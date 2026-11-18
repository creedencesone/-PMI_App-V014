// ============================================================
// core/raci.js — Regla RACI: una sola persona "Accountable" por fila
// ============================================================

/** Devuelve las filas sin exactamente una "A". */
function validarRACI(proyectoParam, actividades) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    const filas = actividades || (typeof getActividadesRACI === 'function' ? getActividadesRACI() : []);
    const problemas = [];
    filas.forEach(f => {
        const responsables = ((p && p.raci) || []).filter(r =>
            (r.actividadKey === f.key || r.actividad === f.nombre) && r.rol === 'A');
        if (responsables.length !== 1) problemas.push({ key: f.key, nombre: f.nombre, cuantos: responsables.length });
    });
    return problemas;
}

/**
 * Asigna un rol RACI garantizando una sola "A" por actividad.
 * Devuelve true si hubo cambio.
 */
function asignarRolRACI(proyectoParam, key, actividad, stakeholderId, rol) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    if (!p) return false;
    if (!Array.isArray(p.raci)) p.raci = [];
    const idx = p.raci.findIndex(r => r.stakeholderId === stakeholderId &&
        ((r.actividadKey && r.actividadKey === key) || r.actividad === actividad));

    if (rol === '') {
        if (idx >= 0) { p.raci.splice(idx, 1); return true; }
        return false;
    }
    if (rol === 'A') {
        p.raci.forEach(r => {
            const mismaFila = (r.actividadKey && r.actividadKey === key) || r.actividad === actividad;
            if (mismaFila && r.stakeholderId !== stakeholderId && r.rol === 'A') r.rol = 'C';
        });
    }
    if (idx >= 0) {
        Object.assign(p.raci[idx], { rol, actividad, actividadKey: key });
    } else {
        p.raci.push({ actividad, actividadKey: key, stakeholderId, rol });
    }
    return true;
}

if (typeof window !== 'undefined') {
    window.validarRACI = validarRACI;
    window.asignarRolRACI = asignarRolRACI;
}
