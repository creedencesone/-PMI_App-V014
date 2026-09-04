#!/usr/bin/env node
// ============================================================
// migrate-sqlite-to-supabase.mjs — Migración de una sola vez
// de backend/database.sqlite → Supabase (multi-tenant).
//
// TAREA 8 del plan comercial-backend-supabase-multitenant.
//
// Lee los datos del SQLite (solo lectura) y los carga en Supabase
// vía REST usando la secret/service-role key (NO la anon), que
// permite la admin API de auth y el bypass de RLS.
//
// Uso:
//   node scripts/migrate-sqlite-to-supabase.mjs
//
// Env (obligatorias):
//   SUPABASE_URL                 (https://<ref>.supabase.co)
//   SUPABASE_SERVICE_ROLE_KEY    (secret key — NUNCA commiteada)
//   SQLITE_PATH                  (default: backend/database.sqlite)
//
// Comportamiento:
//   - Crea una organización por defecto si no existe.
//   - Crea cada usuario en auth.users (admin API) y, si eso falla,
//     lo registra igualmente en profiles + organization_members.
//   - Migra notifications, catalog_materials, catalog_team_members,
//     agenda → agenda_eventos.
//   - Para cada proyecto: inserta en projects y desglosa el blob
//     projects.data en las 14 tablas de dominio (cada elemento del
//     array → una fila con data jsonb = el elemento completo).
//     garantia es un OBJETO → una fila o ninguna si es null.
//   - Mapea los IDs enteros de SQLite a los nuevos UUIDs para
//     mantener las relaciones (project_members, agenda hito_id, ...).
//   - Imprime conteos comparados por tabla (SQLite vs Supabase).
//   - Termina con "MIGRATION OK" solo si TODO se migró; si algo
//     falla, reporta por nombre de tabla y sale con código != 0.
// ============================================================

import { DatabaseSync } from 'node:sqlite';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

// ------------------------------------------------------------
// 0. Configuración y helpers
// ------------------------------------------------------------

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SQLITE_PATH = resolve(process.env.SQLITE_PATH || 'backend/database.sqlite');

if (!SUPABASE_URL) {
    console.error('Falta SUPABASE_URL (https://<ref>.supabase.co)');
    process.exit(1);
}
if (!SERVICE_ROLE_KEY) {
    console.error('Falta SUPABASE_SERVICE_ROLE_KEY (secret/service-role key)');
    process.exit(1);
}

const REST = `${SUPABASE_URL}/rest/v1`;
const AUTH_ADMIN = `${SUPABASE_URL}/auth/v1/admin`;

// Nombre de la organización por defecto (tenant raíz).
const DEFAULT_ORG_NAME = process.env.DEFAULT_ORG_NAME || 'Organización Principal';

// Mapeo dominio del blob → tabla destino. Cada elemento del array
// del dominio se inserta como una fila con data jsonb = el elemento.
const DOMAIN_TABLES = [
    ['stakeholders', 'project_stakeholders'],
    ['equipo', 'project_equipo'],
    ['materiales', 'project_materiales'],
    ['servicios', 'project_servicios'],
    ['procesos', 'project_procesos'],
    ['hitosFinancieros', 'project_hitos_financieros'],
    ['elementosGantt', 'project_elementos_gantt'],
    ['riesgos', 'project_riesgos'],
    ['comunicaciones', 'project_comunicaciones'],
    ['reuniones', 'project_reuniones'],
    ['viajes', 'project_viajes'],
    ['avales', 'project_avales'],
    ['seguros', 'project_seguros'],
    // garantia es OBJETO (no array) → se trata aparte.
];

// Tablas migradas de SQLite (conteo para verificación).
const MIGRATED_TABLES = [
    'notifications',
    'catalog_materials',
    'catalog_team_members',
    'agenda_eventos',
];

// Conteos por tabla (SQLite vs Supabase) para el reporte final.
const counts = new Map(); // tabla -> { sqlite, supabase }

function bumpSqlite(table, n = 1) {
    const c = counts.get(table) || { sqlite: 0, supabase: 0 };
    c.sqlite += n;
    counts.set(table, c);
}
function bumpSupabase(table, n = 1) {
    const c = counts.get(table) || { sqlite: 0, supabase: 0 };
    c.supabase += n;
    counts.set(table, c);
}

// Errores por tabla (para reporte final).
const errors = new Map(); // tabla -> [mensajes]
function recordError(table, msg) {
    if (!errors.has(table)) errors.set(table, []);
    errors.get(table).push(msg);
}

// ------------------------------------------------------------
// 1. Cliente REST Supabase (secret key)
// ------------------------------------------------------------

async function supabaseFetch(path, { method = 'GET', body, headers = {} } = {}) {
    const res = await fetch(`${REST}${path}`, {
        method,
        headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) {
        const err = new Error(`HTTP ${res.status}: ${text}`);
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
}

// Inserta una fila y devuelve la fila creada (con su id uuid).
async function insertRow(table, row) {
    const created = await supabaseFetch(`/${table}`, { method: 'POST', body: row });
    return Array.isArray(created) ? created[0] : created;
}

// Cuenta filas de una tabla en Supabase (usa HEAD + Content-Range).
async function countTable(table) {
    const res = await fetch(`${REST}/${table}?select=id`, {
        method: 'HEAD',
        headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Range': '0-0',
            'Prefer': 'count=exact',
        },
    });
    const range = res.headers.get('content-range') || '';
    const m = range.match(/\/(\d+)$/);
    return m ? parseInt(m[1], 10) : 0;
}

// ------------------------------------------------------------
// 2. Conexión SQLite (solo lectura)
// ------------------------------------------------------------

let db;
try {
    db = new DatabaseSync(SQLITE_PATH, { readOnly: true });
} catch (e) {
    console.error(`No se pudo abrir SQLite en ${SQLITE_PATH}: ${e.message}`);
    process.exit(1);
}

const all = (sql, ...params) => db.prepare(sql).all(...params);
const get = (sql, ...params) => db.prepare(sql).get(...params);

// ------------------------------------------------------------
// 3. Mapeos de IDs (SQLite entero → UUID Supabase)
// ------------------------------------------------------------

const userUuid = new Map(); // sqlite user id -> uuid
const projectUuid = new Map(); // sqlite project id -> uuid
// hito_id de agenda: el hito vive en el blob hitosFinancieros con un
// id numérico (timestamp). Lo mapeamos a un uuid estable por proyecto.
const hitoUuid = new Map(); // `${projectId}:${hitoId}` -> uuid

function uuidForHito(projectId, hitoId) {
    const key = `${projectId}:${hitoId}`;
    if (!hitoUuid.has(key)) hitoUuid.set(key, randomUUID());
    return hitoUuid.get(key);
}

// ------------------------------------------------------------
// 4. Migración
// ------------------------------------------------------------

async function main() {
    console.log('=== Migración SQLite → Supabase ===');
    console.log(`SQLite: ${SQLITE_PATH}`);
    console.log(`Supabase: ${SUPABASE_URL}`);
    console.log('');

    // --- 4.1 Organización por defecto -------------------------
    let orgId;
    try {
        const existing = await supabaseFetch(
            `/organizations?name=eq.${encodeURIComponent(DEFAULT_ORG_NAME)}&select=id`
        );
        if (Array.isArray(existing) && existing.length > 0) {
            orgId = existing[0].id;
            console.log(`Organización existente: ${DEFAULT_ORG_NAME} (${orgId})`);
        } else {
            const org = await insertRow('organizations', { name: DEFAULT_ORG_NAME });
            orgId = org.id;
            console.log(`Organización creada: ${DEFAULT_ORG_NAME} (${orgId})`);
        }
        bumpSupabase('organizations', 1);
    } catch (e) {
        recordError('organizations', e.message);
        console.error(`ERROR creando organización: ${e.message}`);
        throw e;
    }

    // --- 4.2 Usuarios ------------------------------------------
    const users = all('SELECT * FROM users');
    bumpSqlite('users', users.length);
    console.log(`\nMigrando ${users.length} usuarios...`);

    for (const u of users) {
        const uuid = randomUUID();
        userUuid.set(u.id, uuid);

        // 4.2.1 Intentar crear en auth.users (admin API).
        let authCreated = false;
        try {
            const created = await fetch(`${AUTH_ADMIN}/users`, {
                method: 'POST',
                headers: {
                    'apikey': SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: u.email,
                    password: randomUUID(), // contraseña aleatoria; el usuario la resetea
                    email_confirm: true,
                    user_metadata: { name: u.name, role: u.role },
                }),
            });
            const body = await created.json();
            if (created.ok && body && body.id) {
                userUuid.set(u.id, body.id);
                authCreated = true;
                console.log(`  auth.users: ${u.email} → ${body.id}`);
            } else {
                console.warn(`  auth.users falló para ${u.email}: ${created.status} ${JSON.stringify(body)}`);
            }
        } catch (e) {
            console.warn(`  auth.users excepción para ${u.email}: ${e.message}`);
        }

        // 4.2.2 profiles (id = auth user id si se creó, si no un uuid nuevo).
        const profileId = userUuid.get(u.id);
        try {
            await insertRow('profiles', {
                id: profileId,
                organization_id: orgId,
                email: u.email,
                name: u.name,
                role: u.role === 'admin' ? 'admin' : 'editor',
            });
            bumpSupabase('profiles', 1);
        } catch (e) {
            recordError('profiles', `${u.email}: ${e.message}`);
            console.error(`  ERROR profiles ${u.email}: ${e.message}`);
        }

        // 4.2.3 organization_members.
        try {
            await insertRow('organization_members', {
                organization_id: orgId,
                user_id: profileId,
                role: u.role === 'admin' ? 'owner' : 'editor',
            });
            bumpSupabase('organization_members', 1);
        } catch (e) {
            recordError('organization_members', `${u.email}: ${e.message}`);
            console.error(`  ERROR organization_members ${u.email}: ${e.message}`);
        }
    }

    // --- 4.3 Proyectos + dominios ------------------------------
    const projects = all('SELECT * FROM projects');
    bumpSqlite('projects', projects.length);
    console.log(`\nMigrando ${projects.length} proyectos...`);

    for (const p of projects) {
        const pid = randomUUID();
        projectUuid.set(p.id, pid);

        let blob = {};
        try { blob = JSON.parse(p.data || '{}'); } catch (e) {
            console.warn(`  Proyecto ${p.id}: data no es JSON válido, se usa {}`);
        }

        const ownerUuid = userUuid.get(p.owner_id) || null;

        // 4.3.1 projects (columnas tipadas + resto del blob en data).
        const projectRow = {
            id: pid,
            organization_id: orgId,
            name: blob.nombre ?? p.name ?? '',
            description: blob.descripcion ?? p.description ?? '',
            moneda_base: blob.monedaBase ?? 'EUR',
            moneda_venta: blob.monedaVenta ?? 'EUR',
            precio_venta: blob.precioVenta ?? 0,
            condiciones_pago: blob.condicionesPago ?? '',
            fecha_inicio: blob.fechaInicio || null,
            data: blob,
        };
        try {
            await insertRow('projects', projectRow);
            bumpSupabase('projects', 1);
        } catch (e) {
            recordError('projects', `proyecto ${p.id} (${p.name}): ${e.message}`);
            console.error(`  ERROR projects ${p.id}: ${e.message}`);
            continue; // no desglosar dominios de un proyecto que no se insertó
        }

        // 4.3.2 Dominios (arrays → una fila por elemento).
        for (const [blobKey, table] of DOMAIN_TABLES) {
            const arr = Array.isArray(blob[blobKey]) ? blob[blobKey] : [];
            for (const item of arr) {
                try {
                    await insertRow(table, {
                        organization_id: orgId,
                        project_id: pid,
                        data: item,
                    });
                    bumpSupabase(table, 1);
                } catch (e) {
                    recordError(table, `proyecto ${p.id}: ${e.message}`);
                    console.error(`  ERROR ${table} (proyecto ${p.id}): ${e.message}`);
                }
            }
        }

        // 4.3.3 garantia (OBJETO → una fila o ninguna si null).
        if (blob.garantia && typeof blob.garantia === 'object') {
            try {
                await insertRow('project_garantia', {
                    organization_id: orgId,
                    project_id: pid,
                    data: blob.garantia,
                });
                bumpSupabase('project_garantia', 1);
            } catch (e) {
                recordError('project_garantia', `proyecto ${p.id}: ${e.message}`);
                console.error(`  ERROR project_garantia (proyecto ${p.id}): ${e.message}`);
            }
        }

        // 4.3.4 project_members (desde project_users).
        const members = all('SELECT * FROM project_users WHERE project_id = ?', p.id);
        for (const m of members) {
            const muuid = userUuid.get(m.user_id);
            if (!muuid) {
                console.warn(`  project_users: user ${m.user_id} no migrado, se omite en proyecto ${p.id}`);
                continue;
            }
            try {
                await insertRow('project_members', {
                    organization_id: orgId,
                    project_id: pid,
                    user_id: muuid,
                    role: m.role === 'admin' ? 'admin' : (m.role === 'viewer' ? 'viewer' : 'editor'),
                });
                bumpSupabase('project_members', 1);
            } catch (e) {
                recordError('project_members', `proyecto ${p.id} user ${m.user_id}: ${e.message}`);
                console.error(`  ERROR project_members (proyecto ${p.id}): ${e.message}`);
            }
        }
    }

    // --- 4.4 notifications -------------------------------------
    const notifications = all('SELECT * FROM notifications');
    bumpSqlite('notifications', notifications.length);
    console.log(`\nMigrando ${notifications.length} notificaciones...`);
    for (const n of notifications) {
        let data = {};
        try { data = JSON.parse(n.data || '{}'); } catch { data = {}; }
        try {
            await insertRow('notifications', {
                organization_id: orgId,
                user_id: userUuid.get(n.user_id) || null,
                type: n.type,
                title: n.title,
                message: n.message ?? '',
                data,
                is_read: !!n.is_read,
            });
            bumpSupabase('notifications', 1);
        } catch (e) {
            recordError('notifications', `notif ${n.id}: ${e.message}`);
            console.error(`  ERROR notifications ${n.id}: ${e.message}`);
        }
    }

    // --- 4.5 catalog_materials ---------------------------------
    const materials = all('SELECT * FROM catalog_materials');
    bumpSqlite('catalog_materials', materials.length);
    console.log(`\nMigrando ${materials.length} materiales de catálogo...`);
    for (const m of materials) {
        try {
            await insertRow('catalog_materials', {
                organization_id: orgId,
                user_id: userUuid.get(m.user_id) || null,
                nombre: m.nombre,
                proveedor: m.proveedor ?? '',
                part_number: m.partNumber ?? '',
                hs_code: m.hsCode ?? '',
                peso_unitario: m.pesoUnitario ?? 0,
                coste_unitario: m.costeUnitario ?? 0,
                moneda: m.moneda ?? 'EUR',
                pais_origen: m.paisOrigen ?? '',
                incoterm: m.incoterm ?? 'CIF',
                notas: m.notas ?? '',
            });
            bumpSupabase('catalog_materials', 1);
        } catch (e) {
            recordError('catalog_materials', `material ${m.id}: ${e.message}`);
            console.error(`  ERROR catalog_materials ${m.id}: ${e.message}`);
        }
    }

    // --- 4.6 catalog_team_members ------------------------------
    const teamMembers = all('SELECT * FROM catalog_team_members');
    bumpSqlite('catalog_team_members', teamMembers.length);
    console.log(`\nMigrando ${teamMembers.length} miembros de equipo de catálogo...`);
    for (const t of teamMembers) {
        try {
            await insertRow('catalog_team_members', {
                organization_id: orgId,
                user_id: userUuid.get(t.user_id) || null,
                nombre: t.nombre,
                rol: t.rol ?? '',
                email: t.email ?? '',
                telefono: t.telefono ?? '',
                foto: t.foto ?? '',
                coste_hora: t.costeHora ?? 0,
                moneda: t.moneda ?? 'EUR',
                horas_mes: t.horasMes ?? 160,
            });
            bumpSupabase('catalog_team_members', 1);
        } catch (e) {
            recordError('catalog_team_members', `member ${t.id}: ${e.message}`);
            console.error(`  ERROR catalog_team_members ${t.id}: ${e.message}`);
        }
    }

    // --- 4.7 agenda → agenda_eventos ---------------------------
    const agenda = all('SELECT * FROM agenda');
    bumpSqlite('agenda_eventos', agenda.length);
    console.log(`\nMigrando ${agenda.length} eventos de agenda...`);
    for (const a of agenda) {
        // hito_id: el hito vive en el blob hitosFinancieros del proyecto.
        // Generamos un uuid estable por (proyecto, hito) para mantener la
        // referencia aunque el hito no tenga fila propia en Supabase.
        let hitoUuidVal = null;
        if (a.hito_id != null && a.hito_id !== '') {
            hitoUuidVal = uuidForHito(a.proyecto_id, a.hito_id);
        }
        try {
            await insertRow('agenda_eventos', {
                organization_id: orgId,
                project_id: projectUuid.get(a.proyecto_id) || null,
                user_id: userUuid.get(a.user_id) || null,
                fecha_inicio: a.fecha_inicio,
                fecha_fin: a.fecha_fin ?? a.fecha_inicio,
                hora_inicio: a.hora_inicio ?? '09:00',
                hora_fin: a.hora_fin ?? '10:00',
                titulo: a.titulo,
                descripcion: a.descripcion ?? '',
                categoria: a.categoria ?? 'otro',
                es_alarma: !!a.es_alarma,
                hito_id: hitoUuidVal,
            });
            bumpSupabase('agenda_eventos', 1);
        } catch (e) {
            recordError('agenda_eventos', `evento ${a.id}: ${e.message}`);
            console.error(`  ERROR agenda_eventos ${a.id}: ${e.message}`);
        }
    }

    // --- 4.8 Conteos comparados en Supabase ---------------------
    // Tablas con fuente SQLite 1:1 (se exige que los conteos coincidan).
    const oneToOne = ['projects', ...MIGRATED_TABLES];
    // Tablas derivadas (sin tabla SQLite directa: salen del blob o de
    // otras tablas). Se reportan pero no se exige igualdad.
    const derived = [
        'profiles', 'organization_members', 'project_members',
        ...DOMAIN_TABLES.map(([, t]) => t),
        'project_garantia',
    ];

    console.log('\n=== Conteos comparados (SQLite vs Supabase) ===');
    const tablesToVerify = [...oneToOne, ...derived];
    for (const table of tablesToVerify) {
        let sup = 0;
        try { sup = await countTable(table); } catch (e) {
            console.log(`  ${table.padEnd(28)} (no verificable: ${e.message})`);
            continue;
        }
        const c = counts.get(table) || { sqlite: 0, supabase: 0 };
        c.supabase = sup;
        counts.set(table, c);
        const sqlite = c.sqlite;
        const ok = sqlite === sup;
        console.log(`  ${table.padEnd(28)} SQLite=${String(sqlite).padStart(4)}  Supabase=${String(sup).padStart(4)}  ${ok ? 'OK' : (oneToOne.includes(table) ? 'DIFERENTE' : '(derivada)')}`);
    }

    // --- 4.9 Reporte final --------------------------------------
    console.log('\n=== Resultado ===');
    if (errors.size > 0) {
        console.error('MIGRATION FAILED — errores por tabla:');
        for (const [table, msgs] of errors) {
            console.error(`  [${table}] ${msgs.length} error(es):`);
            for (const m of msgs.slice(0, 5)) console.error(`    - ${m}`);
            if (msgs.length > 5) console.error(`    ... y ${msgs.length - 5} más`);
        }
        process.exit(1);
    }

    // Verificar que los conteos coincidan SOLO en las tablas 1:1.
    let mismatch = false;
    for (const table of oneToOne) {
        const c = counts.get(table);
        if (c && c.sqlite !== c.supabase) {
            console.error(`  Conteo no coincide en ${table}: SQLite=${c.sqlite} Supabase=${c.supabase}`);
            mismatch = true;
        }
    }
    if (mismatch) {
        console.error('MIGRATION FAILED — los conteos no coinciden.');
        process.exit(1);
    }

    console.log('MIGRATION OK');
}

main().catch((e) => {
    console.error('\nMIGRATION FAILED — error fatal:', e.message);
    process.exit(1);
});
