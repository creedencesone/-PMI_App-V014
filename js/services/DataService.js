// ============================================
// DataService — Capa de acceso a datos
// Backend: Supabase (auth + Postgres) con fallback a localStorage
// ============================================
// TAREA 9: los métodos usan el SDK @supabase/supabase-js en vez de
// fetch a la API PHP. Se mantienen EXACTAMENTE las mismas firmas y
// shapes de retorno para no romper los paneles.
//
// El cliente se carga de forma DIFERIDA (dynamic import) para poder
// seguir cargando este fichero como <script> clásico y para que
// `node --check` lo valide sin ejecutar el navegador.

let _supabasePromise = null;
function _getSupabase() {
    if (!_supabasePromise) {
        // El cliente se carga con un dynamic import "oculto" a Vite
        // (new Function) porque este fichero se sirve como <script> clásico:
        // si Vite detecta el import(), inyecta un `import` estático al inicio
        // y el navegador lanza "Cannot use import statement outside a module".
        //
        // Se prueban las dos variantes para que funcione en dev, preview y
        // producción:
        //   · dev/preview: js/services/supabaseClient.entry.js (Vite lo transforma)
        //   · producción: js/services/supabaseClient.bundle.js (generado por el build)
        // Ambas exponen el cliente en globalThis.__SUPABASE__.
        const dynamicImport = new Function('p', 'return import(p)');
        // Orden de preferencia según el entorno, con fallback al otro por si
        // falta el fichero (p. ej. `vite preview` en localhost no copia el entry).
        const esDev = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/.test(location.hostname);
        const candidates = esDev
            ? ['./supabaseClient.entry.js', './supabaseClient.bundle.js']
            : ['./supabaseClient.bundle.js', './supabaseClient.entry.js'];

        _supabasePromise = (async () => {
            let lastError = null;
            for (const path of candidates) {
                try {
                    await dynamicImport(path);
                    if (globalThis.__SUPABASE__) return globalThis.__SUPABASE__;
                } catch (err) {
                    lastError = err;
                }
            }
            throw lastError || new Error('No se pudo cargar el cliente de Supabase');
        })().catch(err => {
            _supabasePromise = null;
            throw err;
        });
    }
    return _supabasePromise;
}

// ------------------------------------------------------------
// Tablas de dominio del blob projects.data (22)
// Cada dominio se normaliza en una tabla con `data jsonb`.
// garantia es OBJETO (una fila por proyecto); el resto son arrays.
// ------------------------------------------------------------
const DOMAIN_TABLES = [
    { key: 'stakeholders', table: 'project_stakeholders' },
    { key: 'equipo', table: 'project_equipo' },
    { key: 'materiales', table: 'project_materiales' },
    { key: 'servicios', table: 'project_servicios' },
    { key: 'procesos', table: 'project_procesos' },
    { key: 'hitosFinancieros', table: 'project_hitos_financieros' },
    { key: 'elementosGantt', table: 'project_elementos_gantt' },
    { key: 'riesgos', table: 'project_riesgos' },
    { key: 'requisitos', table: 'project_requisitos' },
    { key: 'comunicaciones', table: 'project_comunicaciones' },
    { key: 'reuniones', table: 'project_reuniones' },
    { key: 'viajes', table: 'project_viajes' },
    { key: 'avales', table: 'project_avales' },
    { key: 'seguros', table: 'project_seguros' },
    { key: 'garantia', table: 'project_garantia' },
    { key: 'lineasBase', table: 'project_lineas_base' },
    { key: 'cambios', table: 'project_cambios' },
    { key: 'bitacora', table: 'project_bitacora' },
    { key: 'proveedores', table: 'project_proveedores' },
    { key: 'contratos', table: 'project_contratos' },
    { key: 'ordenesCompra', table: 'project_ordenes_compra' },
    { key: 'pagosRealizados', table: 'project_pagos_realizados' },
];

// Columnas tipadas de projects → claves camelCase del blob
const TYPED_FIELDS = {
    moneda_base: 'monedaBase',
    moneda_venta: 'monedaVenta',
    precio_venta: 'precioVenta',
    condiciones_pago: 'condicionesPago',
    fecha_inicio: 'fechaInicio',
};

// ------------------------------------------------------------
// Mapeos snake_case (Supabase) ↔ camelCase (frontend) para catálogos
// (SQLite usaba camelCase; el esquema destino usa snake_case)
// ------------------------------------------------------------
const MATERIAL_FRONT_TO_DB = {
    nombre: 'nombre',
    proveedor: 'proveedor',
    partNumber: 'part_number',
    hsCode: 'hs_code',
    pesoUnitario: 'peso_unitario',
    costeUnitario: 'coste_unitario',
    moneda: 'moneda',
    paisOrigen: 'pais_origen',
    incoterm: 'incoterm',
    notas: 'notas',
};
const MATERIAL_DB_TO_FRONT = {
    id: 'id',
    user_id: 'user_id',
    nombre: 'nombre',
    proveedor: 'proveedor',
    part_number: 'partNumber',
    hs_code: 'hsCode',
    peso_unitario: 'pesoUnitario',
    coste_unitario: 'costeUnitario',
    moneda: 'moneda',
    pais_origen: 'paisOrigen',
    incoterm: 'incoterm',
    notas: 'notas',
    created_at: 'created_at',
    updated_at: 'updated_at',
};

const TEAM_FRONT_TO_DB = {
    nombre: 'nombre',
    rol: 'rol',
    email: 'email',
    telefono: 'telefono',
    foto: 'foto',
    costeHora: 'coste_hora',
    moneda: 'moneda',
    horasMes: 'horas_mes',
};
const TEAM_DB_TO_FRONT = {
    id: 'id',
    user_id: 'user_id',
    nombre: 'nombre',
    rol: 'rol',
    email: 'email',
    telefono: 'telefono',
    foto: 'foto',
    coste_hora: 'costeHora',
    moneda: 'moneda',
    horas_mes: 'horasMes',
    created_at: 'created_at',
    updated_at: 'updated_at',
};

function _mapRowFromDb(row, mapping) {
    const out = {};
    for (const [dbKey, frontKey] of Object.entries(mapping)) {
        if (row && row[dbKey] !== undefined) out[frontKey] = row[dbKey];
    }
    return out;
}

function _mapRowToDb(data, mapping) {
    const out = {};
    for (const [frontKey, dbKey] of Object.entries(mapping)) {
        if (data && data[frontKey] !== undefined) out[dbKey] = data[frontKey];
    }
    return out;
}

// agenda_eventos.hito_id es uuid; los hitos del frontend usan ids
// arbitrarios (Date.now()...). Solo se guardan uuids válidos.
function _toUuidOrNull(value) {
    if (value === null || value === undefined || value === '') return null;
    const s = String(value);
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s) ? s : null;
}

const DataService = {
    // Referencia legacy: agenda.js todavía la usa con fetch hasta la tarea 12.
    API_BASE: 'http://localhost:8000/api',
    STORAGE_KEY: 'pmi_proyectos',

    _autoSyncTimer: null,
    _lastSyncTime: null,
    _syncInProgress: false,
    _syncStatusCallback: null,
    _onlineCache: null,
    _flushTimer: null,
    _pendingUICallback: null,

    _safeSetItem(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014 || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                console.warn('[DataService] localStorage sin espacio para', key, '- no se cachea');
                return false;
            }
            throw e;
        }
    },

    getToken() {
        return localStorage.getItem('pmi_api_token');
    },

    setToken(token) {
        if (token) localStorage.setItem('pmi_api_token', token);
        else localStorage.removeItem('pmi_api_token');
    },

    _deletedProjectsKey: 'pmi_proyectos_eliminados',

    _readDeletedProjects() {
        try {
            const raw = localStorage.getItem(this._deletedProjectsKey);
            if (!raw) return [];
            const list = JSON.parse(raw);
            return Array.isArray(list) ? list : [];
        } catch (e) {
            console.warn('[DataService] Error leyendo proyectos eliminados:', e.message);
            return [];
        }
    },

    _writeDeletedProjects(list) {
        localStorage.setItem(this._deletedProjectsKey, JSON.stringify(list));
    },

    isProjectDeleted(id) {
        if (id == null) return false;
        const sid = String(id);
        const list = this._readDeletedProjects();
        if (list.includes(sid)) return true;
        const resolved = this.resolveId(sid);
        return resolved !== sid && list.includes(String(resolved));
    },

    markProjectDeleted(id) {
        if (id == null) return;
        const sid = String(this.resolveId(id));
        const list = this._readDeletedProjects();
        if (!list.includes(sid)) {
            list.push(sid);
            this._writeDeletedProjects(list);
        }
    },

    unmarkProjectDeleted(id) {
        if (id == null) return;
        const sid = String(this.resolveId(id));
        this._writeDeletedProjects(this._readDeletedProjects().filter(x => x !== sid));
    },

    pruneDeletedProjects(knownApiIds) {
        const ids = new Set((knownApiIds || []).map(String));
        const list = this._readDeletedProjects();
        const remaining = list.filter(id => ids.has(String(this.resolveId(id))));
        if (remaining.length !== list.length) this._writeDeletedProjects(remaining);
    },

    _idRemapKey: 'pmi_ids_remapeados',

    _readRemapMap() {
        try {
            const raw = localStorage.getItem(this._idRemapKey);
            if (!raw) return {};
            const map = JSON.parse(raw);
            return (map && typeof map === 'object') ? map : {};
        } catch (e) {
            return {};
        }
    },

    _recordRemap(oldId, newId) {
        if (oldId == null || newId == null) return;
        const oldS = String(oldId);
        const newS = String(newId);
        if (oldS === newS) return;
        const map = this._readRemapMap();
        map[oldS] = newS;
        try {
            localStorage.setItem(this._idRemapKey, JSON.stringify(map));
        } catch (e) {
            console.warn('[DataService] Error guardando remapeo de ids:', e.message);
        }
    },

    resolveId(id) {
        if (id == null) return id;
        let cur = String(id);
        const map = this._readRemapMap();
        let hops = 0;
        while (map[cur] && hops < 10) {
            cur = map[cur];
            hops++;
        }
        return cur;
    },

    // --------------------------------------------------
    // Helpers internos (Supabase)
    // --------------------------------------------------

    async _getCurrentUser() {
        const supabase = await _getSupabase();
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!data.user) throw new Error('No hay sesión activa');
        return data.user;
    },

    async _getProfile(userId) {
        const supabase = await _getSupabase();
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
        if (error) throw error;
        if (data) {
            try {
                sessionStorage.setItem('pmi_perfil_verificado_v1', JSON.stringify({
                    id: data.id, role: data.role, organization_id: data.organization_id,
                    email: String(data.email || '').toLowerCase()
                }));
            } catch { /* almacenamiento de sesión no disponible */ }
        }
        return data;
    },

    // Crea el perfil (y su organización) si el usuario aún no lo tiene.
    async _ensureProfile(authUser, name) {
        const existing = await this._getProfile(authUser.id);
        if (existing) return existing;
        const supabase = await _getSupabase();
        // 0007: organización + membresía + perfil en una sola transacción
        // SECURITY DEFINER, sin carreras entre comprobación e inserción.
        const { data: orgId, error: bootstrapErr } = await supabase.rpc(
            'bootstrap_organizacion_usuario',
            { p_nombre: name || authUser.email || 'Mi organización', p_email: authUser.email || '' }
        );
        if (bootstrapErr) throw bootstrapErr;
        return await this._getProfile(authUser.id) || {
            id: authUser.id, organization_id: orgId,
            email: authUser.email, name: name || '', role: 'editor'
        };
    },

    async _getOrganizationId() {
        const user = await this._getCurrentUser();
        const profile = await this._getProfile(user.id);
        if (profile && profile.organization_id) return profile.organization_id;
        const ensured = await this._ensureProfile(user, user.user_metadata?.name || '');
        return ensured.organization_id;
    },

    // Comprueba conectividad con Supabase (para cola offline / detección online)
    async _checkOnline() {
        try {
            const supabase = await _getSupabase();
            const { error } = await supabase.from('projects').select('id').limit(1);
            return !error;
        } catch {
            return false;
        }
    },

    // Reconstruye el blob del proyecto fusionando las tablas de dominio.
    // Solo se sobreescribe un dominio si su tabla tiene filas (así un
    // blob ya poblado no se pierde si la tabla está vacía).
    async _hydrateProject(project) {
        if (!project) return project;
        const supabase = await _getSupabase();
        const data = { ...(project.data || {}) };
        for (const d of DOMAIN_TABLES) {
            try {
                const { data: rows, error } = await supabase
                    .from(d.table)
                    .select('data')
                    .eq('project_id', project.id);
                if (error) continue;
                if (d.key === 'garantia') {
                    if (rows && rows.length > 0) data.garantia = rows[0].data || null;
                } else if (rows && rows.length > 0) {
                    data[d.key] = dedupeDomainRows(rows).map(r => r.data);
                } else if (!rows || rows.length === 0) {
                    if (Array.isArray(data[d.key]) && typeof dedupeById === 'function') {
                        data[d.key] = dedupeById(data[d.key]);
                    }
                }
            } catch { /* dominio no disponible: se conserva el valor del blob */ }
        }
        // Columnas tipadas → claves camelCase del blob (solo si faltan)
        for (const [col, key] of Object.entries(TYPED_FIELDS)) {
            if (project[col] !== null && project[col] !== undefined && data[key] === undefined) {
                data[key] = project[col];
            }
        }
        return { ...project, data };
    },

    // Desglosa los dominios del blob en sus tablas (delete + insert).
    // Best-effort: si una tabla falla, el blob ya conserva los datos.
    async _writeDomains(projectId, orgId, data) {
        const supabase = await _getSupabase();
        for (const d of DOMAIN_TABLES) {
            try {
                const value = data ? data[d.key] : undefined;
                // La bitácora es append-only (RLS sin DELETE): se insertan
                // únicamente las entradas nuevas, sin borrar las existentes.
                if (d.key === 'bitacora') {
                    if (Array.isArray(value) && value.length > 0) {
                        const { data: existentes, error: selErr } = await supabase
                            .from(d.table).select('data').eq('project_id', projectId).order('created_at', { ascending: true });
                        if (selErr) { console.warn(`[DataService] SELECT bitácora falló:`, selErr.message); continue; }
                        const ids = new Set((existentes || []).map(f => f.data && f.data.id));
                        const nuevos = value.filter(item => !ids.has(item.id));
                        if (nuevos.length) {
                            const { error: insErr } = await supabase.from(d.table).insert(nuevos.map(item => ({
                                organization_id: orgId, project_id: projectId, data: item
                            })));
                            if (insErr) console.warn(`[DataService] Insert bitácora falló:`, insErr.message);
                        }
                    }
                    continue;
                }
                const { error: delErr } = await supabase.from(d.table).delete().eq('project_id', projectId);
                if (delErr) {
                    console.warn(`[DataService] Delete falló en ${d.key}, se omite insert:`, delErr.message);
                    continue;
                }
                if (d.key === 'garantia') {
                    if (value && typeof value === 'object') {
                        const { error: insErr } = await supabase.from(d.table).insert({
                            organization_id: orgId,
                            project_id: projectId,
                            data: value,
                        });
                        if (insErr) console.warn(`[DataService] Insert falló en ${d.key}:`, insErr.message);
                    }
                } else if (Array.isArray(value) && value.length > 0) {
                    const rows = value.map(item => ({
                        organization_id: orgId,
                        project_id: projectId,
                        data: item,
                    }));
                    const { error: insErr } = await supabase.from(d.table).insert(rows);
                    if (insErr) console.warn(`[DataService] Insert falló en ${d.key}:`, insErr.message);
                }
            } catch (e) {
                console.warn(`[DataService] No se pudieron sincronizar ${d.key}:`, e.message);
            }
        }
    },

    async isAvailable() {
        return this._checkOnline();
    },

    // --------------------------------------------------
    // Auth
    // --------------------------------------------------

    async login(email, password) {
        const supabase = await _getSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const session = data.session;
        const authUser = data.user;
        let name = authUser.user_metadata?.name || '';
        let role = 'editor';
        try {
            const profile = await this._ensureProfile(authUser, name);
            if (profile) {
                name = profile.name || name;
                role = profile.role || role;
            }
        } catch (e) {
            console.warn('[DataService] No se pudo asegurar el perfil:', e.message);
        }
        const user = { id: authUser.id, email: authUser.email, name, role };
        const token = session ? session.access_token : null;
        this.setToken(token);
        return { success: true, user, token };
    },

    async signOut() {
        try {
            const supabase = await _getSupabase();
            if (supabase && supabase.auth) await supabase.auth.signOut();
        } finally {
            this.setToken(null);
            this.stopAutoSync();
        }
    },

    async register(email, password, name) {
        const supabase = await _getSupabase();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
        });
        if (error) throw error;
        const authUser = data.user;
        if (!authUser) throw new Error('No se pudo crear el usuario');
        let role = 'editor';
        try {
            const profile = await this._ensureProfile(authUser, name);
            if (profile) role = profile.role || role;
        } catch (e) {
            console.warn('[DataService] No se pudo crear el perfil:', e.message);
        }
        const session = data.session;
        const token = session ? session.access_token : null;
        if (token) this.setToken(token);
        return { success: true, user: { id: authUser.id, email: authUser.email, name, role }, token };
    },

    async getMe() {
        const supabase = await _getSupabase();
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        const authUser = data.user;
        let name = authUser.user_metadata?.name || '';
        let role = 'editor';
        try {
            const profile = await this._getProfile(authUser.id);
            if (profile) {
                name = profile.name || name;
                role = profile.role || role;
            }
        } catch { /* perfil opcional */ }
        return { user: { id: authUser.id, email: authUser.email, name, role } };
    },

    // --------------------------------------------------
    // Proyectos
    // --------------------------------------------------

    async listProjects() {
        const supabase = await _getSupabase();
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('updated_at', { ascending: false });
        if (error) throw error;
        return { projects: data || [] };
    },

    async getProject(id) {
        const supabase = await _getSupabase();
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) throw error;
        if (!data) throw new Error('Project not found or access denied (404)');
        const hydrated = await this._hydrateProject(data);
        return { project: hydrated };
    },

    async createProject(data) {
        const supabase = await _getSupabase();
        const orgId = await this._getOrganizationId();
        const blob = data.data || {};
        const name = data.name || blob.nombre || 'Sin nombre';
        const description = data.description || blob.descripcion || '';
        const typed = {};
        for (const [col, key] of Object.entries(TYPED_FIELDS)) {
            if (blob[key] !== undefined) typed[col] = blob[key];
        }
        const { data: project, error } = await supabase
            .from('projects')
            .insert({ organization_id: orgId, name, description, data: blob, ...typed })
            .select()
            .single();
        if (error) throw error;
        await this._writeDomains(project.id, orgId, blob);
        return { project: await this._hydrateProject(project) };
    },

    async updateProject(id, data) {
        const supabase = await _getSupabase();
        const updates = {};
        if (data.name !== undefined) updates.name = data.name;
        if (data.description !== undefined) updates.description = data.description;
        if (data.data !== undefined) {
            updates.data = data.data;
            for (const [col, key] of Object.entries(TYPED_FIELDS)) {
                if (data.data[key] !== undefined) updates[col] = data.data[key];
            }
        }
        const { data: updated, error } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', id)
            .select()
            .maybeSingle();
        if (error) throw error;
        if (!updated) throw new Error('Project not found or access denied (404)');
        if (data.data !== undefined) {
            await this._writeDomains(id, updated.organization_id, data.data);
        }
        return { project: await this._hydrateProject(updated) };
    },

    async deleteProject(id) {
        const supabase = await _getSupabase();
        // .select() es imprescindible: con RLS, un DELETE denegado NO devuelve
        // error, simplemente borra 0 filas. Sin esto el frontend "cree" que ha
        // borrado y el proyecto reaparece al recargar.
        const { data: deleted, error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)
            .select('id');
        if (error) throw error;
        if (!deleted || deleted.length === 0) {
            // ¿Existe todavía? Si existe y no se ha borrado → RLS lo bloquea.
            const { data: still, error: checkErr } = await supabase
                .from('projects')
                .select('id')
                .eq('id', id)
                .maybeSingle();
            if (checkErr && this._isMissingProjectError(checkErr)) {
                /* id inválido: se trata como inexistente */
            } else if (still) {
                throw new Error('No tienes permisos para eliminar este proyecto (403)');
            }
            // Si no existe (o no es visible) el borrado es idempotente: continuar.
        }
        // [FIX resurreccion] tombstone: evitar que migrateLocalToBackend re-suba este proyecto
        // (markProjectDeleted es el helper real; _addToDeletedProjects nunca existió)
        this.markProjectDeleted(String(id));
        // [FIX resurreccion] limpiar la vista local pmi_proyectos
        try {
            const list = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
            this._safeSetItem(this.STORAGE_KEY, JSON.stringify(list.filter(p => String(p.id) !== String(id))));
        } catch (e) { console.warn('[DataService] no se pudo limpiar lista local tras borrar', e); }
        return { message: 'Project deleted' };
    },

    // --------------------------------------------------
    // Usuarios de proyecto (compartir)
    // --------------------------------------------------

    async listProjectUsers(projectId) {
        const supabase = await _getSupabase();
        const { data: members, error } = await supabase
            .from('project_members')
            .select('user_id, role')
            .eq('project_id', projectId);
        if (error) throw error;
        const userIds = (members || []).map(m => m.user_id);
        let profiles = [];
        if (userIds.length > 0) {
            const { data: profs, error: profErr } = await supabase
                .from('profiles')
                .select('id, email, name')
                .in('id', userIds);
            if (profErr) throw profErr;
            profiles = profs || [];
        }
        const users = (members || []).map(m => {
            const p = profiles.find(pr => pr.id === m.user_id) || {};
            return { id: m.user_id, email: p.email || '', name: p.name || '', role: m.role };
        });
        return { users };
    },

    async addProjectUser(projectId, email, role) {
        const supabase = await _getSupabase();
        const { data: profile, error: profErr } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle();
        if (profErr) throw profErr;
        if (!profile) throw new Error('User not found with that email (404)');
        const { data: project, error: projErr } = await supabase
            .from('projects')
            .select('organization_id, name')
            .eq('id', projectId)
            .maybeSingle();
        if (projErr) throw projErr;
        if (!project) throw new Error('Project not found (404)');
        const { error } = await supabase.from('project_members').insert({
            organization_id: project.organization_id,
            project_id: projectId,
            user_id: profile.id,
            role: role || 'editor',
        });
        if (error) {
            if (error.code === '23505') throw new Error('User already has access to this project (409)');
            throw error;
        }
        // Notificación al usuario añadido
        try {
            await supabase.from('notifications').insert({
                organization_id: project.organization_id,
                user_id: profile.id,
                type: 'project_shared',
                title: 'Te han compartido un proyecto',
                message: `Te han añadido al proyecto "${project.name}"`,
                data: { project_id: projectId, project_name: project.name, role: role || 'editor' },
            });
        } catch { /* notificación no crítica */ }
        return { message: 'User added' };
    },

    async removeProjectUser(projectId, userId) {
        const supabase = await _getSupabase();
        const { error } = await supabase
            .from('project_members')
            .delete()
            .eq('project_id', projectId)
            .eq('user_id', userId);
        if (error) throw error;
        return { message: 'User removed' };
    },

    async listUsers() {
        const supabase = await _getSupabase();
        const { data, error } = await supabase
            .from('profiles')
            .select('id, email, name, role, created_at')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return { users: data || [] };
    },

    async updateProfile(body) {
        const supabase = await _getSupabase();
        const authUser = await this._getCurrentUser();
        const updates = {};
        if (body.name) updates.name = body.name;
        if (body.email && body.email !== authUser.email) {
            const { error: emailErr } = await supabase.auth.updateUser({ email: body.email });
            if (emailErr) throw emailErr;
            updates.email = body.email;
        }
        if (Object.keys(updates).length > 0) {
            const { error: profErr } = await supabase.from('profiles').update(updates).eq('id', authUser.id);
            if (profErr) throw profErr;
        }
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token || null;
        if (token) this.setToken(token);
        const profile = await this._getProfile(authUser.id);
        return {
            message: 'Profile updated',
            token,
            user: {
                id: authUser.id,
                email: updates.email || authUser.email,
                name: updates.name || profile?.name || authUser.user_metadata?.name || '',
                role: profile?.role || 'editor',
            },
        };
    },

    async changePassword(body) {
        const supabase = await _getSupabase();
        const { error } = await supabase.auth.updateUser({ password: body.new_password });
        if (error) throw error;
        return { message: 'Password changed' };
    },

    // --------------------------------------------------
    // Notificaciones
    // --------------------------------------------------

    /** Alta de notificación de gobierno; tolera fallo de red para no bloquear la UI. */
    async createNotification(opciones) {
        const datos = opciones || {};
        if (!datos.title || !datos.message) throw new Error('title y message son obligatorios');
        const supabase = await _getSupabase();
        let userId = datos.userId;
        if (!userId) {
            const usuario = await this._getCurrentUser();
            userId = usuario && usuario.id;
        }
        if (!userId) throw new Error('No hay usuario autenticado para notificar');
        const registro = {
            user_id: userId,
            type: datos.type || 'gobierno.alerta',
            title: datos.title,
            message: datos.message,
            data: datos.data || {},
            is_read: false
        };
        if (datos.organizationId) registro.organization_id = datos.organizationId;
        const { data, error } = await supabase.from('notifications').insert(registro).select().maybeSingle();
        if (error) throw error;
        return data || registro;
    },

    async listNotifications() {
        const supabase = await _getSupabase();
        const user = await this._getCurrentUser();
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);
        if (error) throw error;
        return { notifications: data || [] };
    },

    async getUnreadCount() {
        const supabase = await _getSupabase();
        const user = await this._getCurrentUser();
        const { count, error } = await supabase
            .from('notifications')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_read', false);
        if (error) throw error;
        return { count: count || 0 };
    },

    async markNotificationRead(id) {
        const supabase = await _getSupabase();
        const user = await this._getCurrentUser();
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id)
            .eq('user_id', user.id);
        if (error) throw error;
        return { message: 'Marked as read' };
    },

    async markAllNotificationsRead() {
        const supabase = await _getSupabase();
        const user = await this._getCurrentUser();
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);
        if (error) throw error;
        return { message: 'All marked as read' };
    },

    // --------------------------------------------------
    // Catálogo
    // --------------------------------------------------

    async getCatalogMaterials() {
        const token = this.getToken();
        if (!token) return { materials: [] };
        try {
            const supabase = await _getSupabase();
            const user = await this._getCurrentUser();
            const { data, error } = await supabase
                .from('catalog_materials')
                .select('*')
                .eq('user_id', user.id)
                .order('nombre', { ascending: true });
            if (error) throw error;
            return { materials: (data || []).map(r => _mapRowFromDb(r, MATERIAL_DB_TO_FRONT)) };
        } catch { return { materials: [] }; }
    },

    async createCatalogMaterial(data) {
        const supabase = await _getSupabase();
        const user = await this._getCurrentUser();
        const orgId = await this._getOrganizationId();
        const { data: row, error } = await supabase
            .from('catalog_materials')
            .insert({ organization_id: orgId, user_id: user.id, ..._mapRowToDb(data, MATERIAL_FRONT_TO_DB) })
            .select()
            .single();
        if (error) throw error;
        return { material: _mapRowFromDb(row, MATERIAL_DB_TO_FRONT) };
    },

    async updateCatalogMaterial(id, data) {
        const supabase = await _getSupabase();
        const user = await this._getCurrentUser();
        const { data: row, error } = await supabase
            .from('catalog_materials')
            .update(_mapRowToDb(data, MATERIAL_FRONT_TO_DB))
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .maybeSingle();
        if (error) throw error;
        if (!row) throw new Error('Material not found (404)');
        return { material: _mapRowFromDb(row, MATERIAL_DB_TO_FRONT) };
    },

    async deleteCatalogMaterial(id) {
        const supabase = await _getSupabase();
        const user = await this._getCurrentUser();
        const { data: deleted, error } = await supabase
            .from('catalog_materials')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)
            .select();
        if (error) throw error;
        if (!deleted || deleted.length === 0) throw new Error('Material not found (404)');
        return { deleted: true };
    },

    async getCatalogTeamMembers() {
        const token = this.getToken();
        if (!token) return { members: [] };
        try {
            const supabase = await _getSupabase();
            const user = await this._getCurrentUser();
            const { data, error } = await supabase
                .from('catalog_team_members')
                .select('*')
                .eq('user_id', user.id)
                .order('nombre', { ascending: true });
            if (error) throw error;
            return { members: (data || []).map(r => _mapRowFromDb(r, TEAM_DB_TO_FRONT)) };
        } catch { return { members: [] }; }
    },

    async createCatalogTeamMember(data) {
        const supabase = await _getSupabase();
        const user = await this._getCurrentUser();
        const orgId = await this._getOrganizationId();
        const { data: row, error } = await supabase
            .from('catalog_team_members')
            .insert({ organization_id: orgId, user_id: user.id, ..._mapRowToDb(data, TEAM_FRONT_TO_DB) })
            .select()
            .single();
        if (error) throw error;
        return { member: _mapRowFromDb(row, TEAM_DB_TO_FRONT) };
    },

    async updateCatalogTeamMember(id, data) {
        const supabase = await _getSupabase();
        const user = await this._getCurrentUser();
        const { data: row, error } = await supabase
            .from('catalog_team_members')
            .update(_mapRowToDb(data, TEAM_FRONT_TO_DB))
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .maybeSingle();
        if (error) throw error;
        if (!row) throw new Error('Member not found (404)');
        return { member: _mapRowFromDb(row, TEAM_DB_TO_FRONT) };
    },

    async deleteCatalogTeamMember(id) {
        const supabase = await _getSupabase();
        const user = await this._getCurrentUser();
        const { data: deleted, error } = await supabase
            .from('catalog_team_members')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)
            .select();
        if (error) throw error;
        if (!deleted || deleted.length === 0) throw new Error('Member not found (404)');
        return { deleted: true };
    },

    // --------------------------------------------------
    // Agenda (tarea 12)
    // --------------------------------------------------

    async listAgendaEventos(proyectoId) {
        const supabase = await _getSupabase();
        const { data, error } = await supabase
            .from('agenda_eventos')
            .select('*')
            .eq('project_id', proyectoId)
            .order('fecha_inicio', { ascending: true })
            .order('created_at', { ascending: true });
        if (error) throw error;
        return { eventos: data || [] };
    },

    async listAgendaHitos(proyectoId) {
        // Los hitos/entregables viven en el blob elementosGantt del proyecto
        const result = await this.getProject(proyectoId);
        const elementosGantt = (result.project && result.project.data && result.project.data.elementosGantt) || [];
        const elementos = elementosGantt
            .filter(e => e && (e.tipo === 'hito' || e.tipo === 'entregable'))
            .map(e => ({
                id: e.id,
                nombre: e.nombre,
                fecha_inicio: e.inicio || null,
                fecha_fin: e.fin || e.inicio || null,
                codigo: e.codigo || null,
                tipo: e.tipo,
            }));
        return { elementos };
    },

    async saveAgendaEvento(evento) {
        const supabase = await _getSupabase();
        const user = await this._getCurrentUser();
        const orgId = await this._getOrganizationId();
        const payload = {
            organization_id: orgId,
            project_id: evento.proyecto_id,
            user_id: user.id,
            fecha_inicio: evento.fecha_inicio,
            fecha_fin: evento.fecha_fin,
            hora_inicio: evento.hora_inicio || '09:00',
            hora_fin: evento.hora_fin || '10:00',
            titulo: evento.titulo,
            descripcion: evento.descripcion || '',
            categoria: evento.categoria || 'otro',
            es_alarma: !!evento.es_alarma,
            hito_id: _toUuidOrNull(evento.hito_id),
        };
        if (evento.id) {
            const { data: row, error } = await supabase
                .from('agenda_eventos')
                .update(payload)
                .eq('id', evento.id)
                .select()
                .maybeSingle();
            if (error) throw error;
            if (!row) throw new Error('Evento no encontrado (404)');
            return { message: 'Evento actualizado', evento: row };
        }
        const { data: row, error } = await supabase
            .from('agenda_eventos')
            .insert(payload)
            .select()
            .single();
        if (error) throw error;
        return { message: 'Evento creado', id: row.id, evento: row };
    },

    async deleteAgendaEvento(id) {
        const supabase = await _getSupabase();
        const { data: deleted, error } = await supabase
            .from('agenda_eventos')
            .delete()
            .eq('id', id)
            .select();
        if (error) throw error;
        if (!deleted || deleted.length === 0) throw new Error('Evento no encontrado (404)');
        return { message: 'Evento eliminado' };
    },

    async checkAgendaAlertas(proyectoId) {
        const supabase = await _getSupabase();
        const hoy = new Date().toISOString().split('T')[0];
        const manana = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('agenda_eventos')
            .select('*')
            .eq('project_id', proyectoId)
            .eq('es_alarma', true)
            .in('fecha_inicio', [hoy, manana])
            .order('fecha_inicio', { ascending: true });
        if (error) throw error;
        return { alertas: data || [] };
    },

    // --------------------------------------------------
    // Sincronización
    // --------------------------------------------------

    // Error de "proyecto inexistente / id inválido" en Supabase:
    // 404 (no existe) o 400 invalid uuid (id numérico legacy de la era SQLite).
    // Ambos deben disparar la recreación con UUID nuevo y remapeo de id local.
    _isMissingProjectError(e) {
        if (!e) return false;
        const msg = e.message || '';
        return msg.includes('404') || msg.includes('invalid input syntax for type uuid') || e.code === '22P02';
    },

    async syncProyecto() {
        if (!window.proyecto || !window.proyecto.id) return;
        const token = this.getToken();
        if (!token) return;
        if (this._syncInProgress) return;
        this._syncInProgress = true;
        this._notifySyncStatus('syncing');
        try {
            const p = window.proyecto;
            await this.updateProject(p.id, {
                name: p.nombre,
                description: p.descripcion || '',
                data: p,
            });
            this._lastSyncTime = Date.now();
            this._dequeue(String(p.id));
            this._notifySyncStatus('ok');
        } catch (e) {
            if (this._isMissingProjectError(e)) {
                const oldId = window.proyecto.id;
                try {
                    const created = await this.createProject({
                        name: window.proyecto.nombre,
                        description: window.proyecto.descripcion || '',
                        data: window.proyecto,
                    });
                    if (created && created.project && created.project.id) {
                        window.proyecto.id = created.project.id;
                        this._recordRemap(oldId, created.project.id);
                        localStorage.setItem('proyectoSeleccionado', created.project.id);
                        // Actualizar el ID también en el array de localStorage
                        const allProyectos = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                        const idx = allProyectos.findIndex(p => String(p.id) === String(oldId));
                        if (idx >= 0) {
                            allProyectos[idx].id = created.project.id;
                            this._safeSetItem(this.STORAGE_KEY, JSON.stringify(allProyectos));
                        }
                    }
                    this._lastSyncTime = Date.now();
                    this._dequeue(String(oldId));
                    this._notifySyncStatus('ok');
                } catch (e2) {
                    this._enqueue(String(oldId));
                    console.warn('[DataService] Sync create failed, queued:', e2.message);
                }
            } else {
                this._enqueue(String(window.proyecto.id));
                console.warn('[DataService] Sync failed, queued for retry:', e.message);
            }
        } finally {
            this._syncInProgress = false;
        }
    },

    async syncAllProjects(projects) {
        const token = this.getToken();
        if (!token || !projects) return;
        if (this._syncInProgress) return;
        this._syncInProgress = true;
        try {
        const results = [];
        for (const p of projects) {
            try {
                await this.updateProject(p.id, {
                    name: p.nombre,
                    description: p.descripcion || '',
                    data: p,
                });
                this._dequeue(String(p.id));
                results.push({ id: p.id, status: 'updated' });
            } catch (e) {
                if (this._isMissingProjectError(e) || e.message.includes('403')) {
                    try {
                        const created = await this.createProject({ name: p.nombre, description: p.descripcion || '', data: p });
                        if (created && created.project && created.project.id) {
                            const oldId = p.id;
                            p.id = created.project.id;
                            this._recordRemap(oldId, created.project.id);
                            // Update in localStorage array
                            const allProyectos = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                            const idx = allProyectos.findIndex(pr => String(pr.id) === String(oldId));
                            if (idx >= 0) {
                                allProyectos[idx].id = created.project.id;
                                this._safeSetItem(this.STORAGE_KEY, JSON.stringify(allProyectos));
                            }
                            // Actualizar proyectoSeleccionado si apuntaba al viejo ID
                            const sel = localStorage.getItem('proyectoSeleccionado');
                            if (sel && String(sel) === String(oldId)) {
                                localStorage.setItem('proyectoSeleccionado', created.project.id);
                            }
                            if (window.proyecto && String(window.proyecto.id) === String(oldId)) {
                                window.proyecto.id = created.project.id;
                            }
                            this._dequeue(String(oldId));
                            results.push({ id: created.project.id, oldId, status: 'created' });
                        }
                    } catch (e2) {
                        this._enqueue(String(p.id));
                        results.push({ id: p.id, status: 'error', error: e2.message });
                    }
                } else {
                    this._enqueue(String(p.id));
                    results.push({ id: p.id, status: 'queued' });
                }
            }
        }
        return results;
        } finally {
            this._syncInProgress = false;
        }
    },

    // --------------------------------------------------
    // Migración única: localStorage → backend
    // --------------------------------------------------

    async migrateLocalToBackend(onProgress) {
        const token = this.getToken();
        if (!token) {
            throw new Error('Debes iniciar sesión en el servidor primero');
        }
        const allProyectosOrig = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        // [FIX resurreccion] excluir proyectos TOMBSTONE (marcados como eliminados): NO re-subir jamás
        const tombstones = new Set((JSON.parse(localStorage.getItem(this._deletedProjectsKey) || '[]') || []).map(String));
        const allProyectos = allProyectosOrig.filter(p => !tombstones.has(String(p.id)));
        if (allProyectos.length === 0) {
            return { migrated: 0, message: 'No hay proyectos para migrar' };
        }

        // Primero, ver qué proyectos YA existen en el servidor
        let serverIds = [];
        try {
            const existing = await this.listProjects();
            serverIds = (existing.projects || []).map(p => String(p.id));
        } catch {}

        const localOnly = allProyectos.filter(p => !serverIds.includes(String(p.id)));
        if (localOnly.length === 0) {
            return { migrated: 0, message: 'Todos los proyectos ya están en el servidor' };
        }

        if (onProgress) onProgress({ total: localOnly.length, current: 0, name: '' });

        const results = [];
        for (let i = 0; i < localOnly.length; i++) {
            const p = localOnly[i];
            if (onProgress) onProgress({ total: localOnly.length, current: i + 1, name: p.nombre || 'Sin nombre' });
            try {
                const created = await this.createProject({
                    name: p.nombre,
                    description: p.descripcion || '',
                    data: p,
                });
                if (created && created.project && created.project.id) {
                    const oldId = p.id;
                    p.id = created.project.id;
                    this._recordRemap(oldId, created.project.id);
                    // Actualizar en localStorage
                    const allProyectos = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                    const idx = allProyectos.findIndex(pr => String(pr.id) === String(oldId));
                    if (idx >= 0) {
                        allProyectos[idx].id = created.project.id;
                        this._safeSetItem(this.STORAGE_KEY, JSON.stringify(allProyectos));
                    }
                    // Actualizar proyectoSeleccionado si apuntaba al viejo ID
                    const sel = localStorage.getItem('proyectoSeleccionado');
                    if (sel && String(sel) === String(oldId)) {
                        localStorage.setItem('proyectoSeleccionado', created.project.id);
                    }
                    if (window.proyecto && String(window.proyecto.id) === String(oldId)) {
                        window.proyecto.id = created.project.id;
                    }
                    results.push({ id: created.project.id, oldId, nombre: p.nombre, status: 'ok' });
                }
            } catch (e) {
                results.push({ id: p.id, nombre: p.nombre, status: 'error', error: e.message });
            }
        }

        const ok = results.filter(r => r.status === 'ok').length;
        const errors = results.filter(r => r.status === 'error').length;
        return { migrated: ok, errors, total: results.length, results };
    },

    // --------------------------------------------------
    // Offline Queue
    // --------------------------------------------------

    _getQueue() {
        try {
            return JSON.parse(localStorage.getItem('pmi_offline_queue') || '{}');
        } catch { return {}; }
    },

    _saveQueue(queue) {
        localStorage.setItem('pmi_offline_queue', JSON.stringify(queue));
    },

    _enqueue(projectId) {
        if (!projectId) return;
        const queue = this._getQueue();
        queue[projectId] = Date.now();
        this._saveQueue(queue);
        this._notifySyncStatus('pending');
        this._notifyPendingCount();
        this._startFlushTimer();
    },

    _dequeue(projectId) {
        if (!projectId) return;
        const queue = this._getQueue();
        delete queue[projectId];
        this._saveQueue(queue);
        this._notifyPendingCount();
        const remaining = Object.keys(queue).length;
        if (remaining === 0) {
            this._stopFlushTimer();
        }
    },

    getPendingCount() {
        return Object.keys(this._getQueue()).length;
    },

    getPendingIds() {
        return Object.keys(this._getQueue());
    },

    setPendingUICallback(cb) {
        this._pendingUICallback = cb;
    },

    _notifyPendingCount() {
        if (this._pendingUICallback) {
            this._pendingUICallback(this.getPendingCount());
        }
    },

    _startFlushTimer() {
        if (this._flushTimer) return;
        this._flushTimer = setInterval(() => {
            this._flushQueue();
        }, 15000);
    },

    _stopFlushTimer() {
        if (this._flushTimer) {
            clearInterval(this._flushTimer);
            this._flushTimer = null;
        }
    },

    async _flushQueue() {
        const queue = this._getQueue();
        const ids = Object.keys(queue);
        if (ids.length === 0) return;
        // Probar conectividad rápida
        if (!(await this._checkOnline())) return; // Sin conexión, reintentar después
        for (const id of ids) {
            if (this._syncInProgress) break;
            try {
                const proyectos = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const p = proyectos.find(pr => String(pr.id) === id || pr.id === parseInt(id));
                if (!p) { this._dequeue(id); continue; }
                await this.updateProject(id, {
                    name: p.nombre,
                    description: p.descripcion || '',
                    data: p,
                });
                this._dequeue(id);
                this._lastSyncTime = Date.now();
            } catch (e) {
                if (this._isMissingProjectError(e)) {
                    // Try creating instead
                    try {
                        const proyectos = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                        const p = proyectos.find(pr => String(pr.id) === id || pr.id === parseInt(id));
                        if (!p) { this._dequeue(id); continue; }
                        const created = await this.createProject({
                            name: p.nombre,
                            description: p.descripcion || '',
                            data: p,
                        });
                        if (created && created.project && created.project.id) {
                            this._recordRemap(id, created.project.id);
                            // Actualizar ID en localStorage
                            const allProyectos = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                            const idx = allProyectos.findIndex(pr => String(pr.id) === id || pr.id === parseInt(id));
                            if (idx >= 0) {
                                allProyectos[idx].id = created.project.id;
                                this._safeSetItem(this.STORAGE_KEY, JSON.stringify(allProyectos));
                            }
                            this._dequeue(id);
                            this._lastSyncTime = Date.now();
                        }
                    } catch { /* Reintentar después */ }
                }
            }
        }
    },

    // --------------------------------------------------
    // Pull (descarga desde servidor)
    // --------------------------------------------------

    async _pullProject(projectId) {
        const token = this.getToken();
        if (!token || !projectId) return null;
        if (this.isProjectDeleted(projectId)) return null;
        try {
            const result = await this.getProject(projectId);
            if (result && result.project && result.project.data) {
                const serverProj = {
                    ...result.project.data,
                    id: result.project.id,
                    _serverUpdatedAt: result.project.updated_at
                };
                const allProyectos = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const idx = allProyectos.findIndex(p => {
                    if (String(p.id) === String(projectId)) return true;
                    return String(this.resolveId(String(p.id))) === String(projectId);
                });
                if (idx >= 0) {
                    allProyectos[idx] = serverProj;
                } else {
                    allProyectos.push(serverProj);
                }
                if (window.proyecto && String(window.proyecto.id) === String(projectId)) {
                    window.proyecto = serverProj;
                }
                const json = JSON.stringify(allProyectos);
                if (!this._safeSetItem(this.STORAGE_KEY, json)) {
                    const trimmed = seleccionarProyectosACachear(allProyectos, projectId, 5);
                    this._safeSetItem(this.STORAGE_KEY, JSON.stringify(trimmed));
                }
                return serverProj;
            }
        } catch (e) {
            console.warn('[DataService] Pull failed for project', projectId, e.message);
        }
        return null;
    },

    async pullAllProjects() {
        const token = this.getToken();
        if (!token) return [];
        try {
            const result = await this.listProjects();
            const projects = result.projects || [];
            const pulled = [];
            for (const p of projects) {
                const proj = await this._pullProject(p.id);
                if (proj) pulled.push(proj);
            }
            return pulled;
        } catch (e) {
            console.warn('[DataService] Pull all projects failed:', e.message);
            return [];
        }
    },

    // --------------------------------------------------
    // Detección online/offline
    // --------------------------------------------------

    initOnlineDetection() {
        if (typeof window === 'undefined') return;
        this._onlineCache = navigator.onLine;
        window.addEventListener('online', () => {
            console.log('[DataService] Conexión restablecida');
            this._onlineCache = true;
            this._flushQueue();
            if (window.proyecto && this.getToken()) {
                this.syncProyecto();
            }
        });
        window.addEventListener('offline', () => {
            console.log('[DataService] Sin conexión');
            this._onlineCache = false;
            this._notifySyncStatus('pending');
        });
    },

    // --------------------------------------------------
    // Auto-sync periódico
    // --------------------------------------------------

    startAutoSync(intervalMs) {
        this.stopAutoSync();
        this._lastSyncTime = Date.now();
        // Vaciar cola pendiente al iniciar
        const pending = this.getPendingCount();
        if (pending > 0) {
            this._notifySyncStatus('pending');
            this._startFlushTimer();
        } else {
            this._notifySyncStatus('ok');
        }
        this._autoSyncTimer = setInterval(() => {
            this.syncProyecto();
        }, intervalMs || 30000);
    },

    stopAutoSync() {
        if (this._autoSyncTimer) {
            clearInterval(this._autoSyncTimer);
            this._autoSyncTimer = null;
        }
    },

    isAutoSyncActive() {
        return this._autoSyncTimer !== null;
    },

    getLastSyncTime() {
        return this._lastSyncTime;
    },

    setSyncStatusCallback(cb) {
        this._syncStatusCallback = cb;
        // Notificar estado actual
        const pending = this.getPendingCount();
        if (pending > 0) cb('pending');
    },

    _notifySyncStatus(status) {
        if (this._syncStatusCallback) {
            this._syncStatusCallback(status);
        }
    },
};

// Init online/offline detection
if (typeof window !== 'undefined') {
    // Usar setTimeout para asegurar que el DOM y otros scripts estén listos
    setTimeout(() => DataService.initOnlineDetection(), 100);
}

// ============================================
// Sobrescribe guardarProyecto para sincronizar
// con la API tras guardar en localStorage
// ============================================
(function() {
    const patchGuardarProyecto = () => {
        if (typeof guardarProyecto !== 'function') {
            setTimeout(patchGuardarProyecto, 100);
            return;
        }
        const original = guardarProyecto;
        guardarProyecto = function() {
            original();
            DataService.syncProyecto();
        };
    };
    patchGuardarProyecto();
})();