#!/usr/bin/env node
// ============================================================
// smoke-test-supabase.mjs — Verificación funcional del frontend
// contra el Supabase vivo. Ejercita los métodos de la capa de
// datos que los 24 paneles usan (vía DataService).
//
// Uso:
//   node scripts/smoke-test-supabase.mjs
//
// Env:
//   SUPABASE_URL, SUPABASE_ANON_KEY (se leen de .env.local si no)
//   TEST_EMAIL, TEST_PASSWORD (default: a.alba.alarco@gmail.com / TestPass_2026!)
// ============================================================
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// --- Cargar .env.local si las env no están ---
function loadEnvLocal() {
    const out = {};
    try {
        const text = readFileSync(resolve('.env.local'), 'utf8');
        for (const line of text.split('\n')) {
            const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
            if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
        }
    } catch { /* sin .env.local */ }
    return out;
}

const env = { ...loadEnvLocal(), ...process.env };
const URL = (env.SUPABASE_URL || env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const ANON = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || '';
const EMAIL = env.TEST_EMAIL || 'a.alba.alarco@gmail.com';
const PASSWORD = env.TEST_PASSWORD || 'TestPass_2026!';

if (!URL || !ANON) { console.error('Faltan SUPABASE_URL/ANON key'); process.exit(1); }

const sb = createClient(URL, ANON);
const results = [];
let failures = 0;

function report(name, ok, detail) {
    results.push({ name, ok, detail });
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
    if (!ok) failures++;
}

// Dominios que los paneles consumen (mirror de DataService.DOMAIN_TABLES)
const DOMAIN_KEYS = [
    'stakeholders','equipo','materiales','servicios','procesos','hitosFinancieros',
    'elementosGantt','riesgos','comunicaciones','reuniones','viajes','avales','seguros','garantia',
];

async function hydrateProject(project) {
    const data = { ...(project.data || {}) };
    data.nombre = project.name;
    data.descripcion = project.description;
    for (const key of DOMAIN_KEYS) {
        const table = `project_${key}`;
        try {
            const { data: rows, error } = await sb
                .from(table).select('data').eq('project_id', project.id);
            if (error) continue;
            if (key === 'garantia') {
                if (rows && rows.length) data.garantia = rows[0].data;
            } else {
                data[key] = (rows || []).map(r => r.data);
            }
        } catch { /* tabla puede no aplicar */ }
    }
    return data;
}

// --- Login real (tarea 7 / login UI) ---
console.log('\n=== 1. Login real (Supabase Auth) ===');
let session = null;
try {
    const { data, error } = await sb.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });
    if (error) throw error;
    session = data.session;
    report('login', !!session?.access_token, `user=${data.user?.email}, token ${session?.access_token?.length} chars`);
} catch (e) {
    report('login', false, e.message);
}

if (!session) {
    console.error('\nNo hay sesión — no se pueden ejecutar las comprobaciones de datos. Abortando.');
    process.exit(1);
}

// --- getUser (getMe) ---
try {
    const { data, error } = await sb.auth.getUser();
    report('getMe (getUser)', !error && !!data.user, data.user?.email);
} catch (e) { report('getMe (getUser)', false, e.message); }

// --- listProjects ---
let projects = [];
try {
    const { data, error } = await sb.from('projects').select('*');
    if (error) throw error;
    projects = data || [];
    report('listProjects', projects.length > 0, `${projects.length} proyectos visibles`);
} catch (e) { report('listProjects', false, e.message); }

// --- Per-project domain hydration (los paneles leen los dominios del blob) ---
console.log('\n=== 2. Lectura de dominios de proyectos (blob desglosado) ===');
for (const p of projects.slice(0, 3)) {
    try {
        const hydrated = await hydrateProject(p);
        const keysFound = DOMAIN_KEYS.filter(k => {
            const v = hydrated[k];
            return k === 'garantia' ? !!v : (Array.isArray(v) && v.length > 0);
        });
        report(`proyecto "${p.name.slice(0, 30)}..." dominios`, keysFound.length > 0, `dominios presentes: ${keysFound.join(', ') || 'ninguno'}`);
    } catch (e) {
        report(`proyecto ${p.id} dominios`, false, e.message);
    }
}

// --- agenda (tarea 12 refactor) ---
console.log('\n=== 3. Agenda (agenda_eventos) ===');
try {
    const { data, error } = await sb.from('agenda_eventos').select('*').limit(50);
    if (error) throw error;
    report('listAgendaEventos', (data || []).length > 0, `${(data || []).length} eventos`);

    // Probar guardar un evento nuevo (persistencia) y borrarlo
    const testTitle = `SMOKE-TEST-${Date.now()}`;
    // Obtener el organization_id del usuario (como hace DataService._getOrganizationId)
    const prof = await sb.from('profiles').select('organization_id').eq('id', session.user.id).maybeSingle();
    const orgId = prof.data?.organization_id;
    const ins = await sb.from('agenda_eventos').insert({
        organization_id: orgId, titulo: testTitle, categoria: 'reunion',
        fecha_inicio: new Date().toISOString().slice(0, 10),
        fecha_fin: new Date().toISOString().slice(0, 10),
        hora_inicio: '09:00', hora_fin: '10:00',
        user_id: session.user.id,
    }).select().single();
    if (ins.error) throw ins.error;
    const newId = ins.data.id;
    report('saveAgendaEvento (crear)', true, `id=${newId}`);

    const del = await sb.from('agenda_eventos').delete().eq('id', newId);
    report('deleteAgendaEvento', !del.error, del.error?.message || 'borrado');
} catch (e) {
    report('agenda (crear/borrar)', false, e.message);
}

// --- notifications ---
console.log('\n=== 4. Notifications ===');
try {
    const { data, error } = await sb.from('notifications').select('*').limit(20);
    report('listNotifications', !error, `${(data || []).length} notificaciones (0 esperadas)`);
} catch (e) { report('listNotifications', false, e.message); }

// --- catalog ---
console.log('\n=== 5. Catálogos ===');
try {
    const m = await sb.from('catalog_materials').select('*').limit(20);
    report('catalogMaterials', !m.error, `${(m.data || []).length} materiales (0 esperados)`);
} catch (e) { report('catalogMaterials', false, e.message); }
try {
    const tm = await sb.from('catalog_team_members').select('*').limit(20);
    report('catalogTeamMembers', !tm.error, `${(tm.data || []).length} miembros (0 esperados)`);
} catch (e) { report('catalogTeamMembers', false, e.message); }

// --- RLS: no debe poder leer organizaciones ajenas ni alter (aislamiento) ---
console.log('\n=== 6. Aislamiento RLS (multi-tenant) ===');
try {
    const { data, error } = await sb.from('organizations').select('*');
    report('RLS lecturas org propias', !error && (data || []).length >= 1, `${(data || []).length} org accesibles`);
} catch (e) { report('RLS lecturas org', false, e.message); }

// Intento de INSERT ilegal cross-tenant: crear un proyecto sin org o con org ajena debería fallar
try {
    const { error } = await sb.from('projects').insert({ name: 'HACK-ATTEMPT', organization_id: '00000000-0000-0000-0000-000000000000', data: {} });
    report('RLS bloquea org inexistente', !!error, error?.message || 'NO bloqueado (riesgo)');
} catch (e) { report('RLS bloquea org inexistente', !!e, e.message); }

// --- Resumen ---
console.log('\n=== RESUMEN ===');
console.log(`Total: ${results.length} | PASS: ${results.length - failures} | FAIL: ${failures}`);
process.exit(failures ? 1 : 0);
