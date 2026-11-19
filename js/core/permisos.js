// ============================================================
// core/permisos.js — Permisos invocados, centralizados y fail-closed
// ============================================================

/**
 * Mapa de `data-panel` / `panelXXX` a la clave canónica de AuthSystem.MODULOS.
 * Las 39 pantallas del sidebar no coinciden con los 21 módulos: esta tabla es
 * la única fuente de verdad para no depender de ocultación por CSS.
 */
const PANEL_A_MODULO = Object.freeze({
    proyecto: 'acta', acta: 'acta', roles: 'acta',
    dashboard: 'dashboard',
    salud: 'salud', calidad: 'calidad', agentes: 'agentes',
    financiero: 'finanzas', finanzas: 'finanzas', monedas: 'finanzas',
    venta: 'finanzas', resumengastos: 'finanzas', seguros: 'finanzas', cashflow: 'finanzas',
    cronograma: 'cronograma', ejecucioncronograma: 'cronograma',
    requisitos: 'requisitos',
    riesgos: 'riesgos',
    stakeholders: 'stakeholders', raci: 'stakeholders', organigrama: 'stakeholders',
    procesos: 'procesos', agenda: 'procesos',
    cierre: 'cierre',
    equipo: 'recursos', materiales: 'recursos', servicios: 'recursos',
    cargatrabajo: 'recursos', recursos: 'recursos', disponibilidad: 'recursos',
    comunicaciones: 'comunicaciones', plancomunicaciones: 'comunicaciones',
    beneficios: 'beneficios', cambios: 'cambios', lecciones: 'lecciones',
    scrum: 'scrum', sprintbacklog: 'scrum', sprintburndown: 'scrum', daily: 'scrum',
    velocitytracking: 'scrum', retrospectives: 'scrum', agilemetrics: 'scrum',
    sprintlist: 'scrum', agilecostcontrol: 'scrum', metricasagiles: 'scrum',
    logistica: 'logistica', viajes: 'viajes', avales: 'avales', garantia: 'garantia',
    informe: 'informe'
});

/** Normaliza cualquier identificador de panel a su clave de módulo gobernada. */
function moduloDePanel(panelId) {
    const clave = String(panelId || '').toLowerCase().replace(/^panel/, '');
    return PANEL_A_MODULO[clave] || null;
}

/** Resuelve el id del proyecto usando el mismo mecanismo que el resto de la app. */
function resolveProyectoId(proyectoId) {
    let id = proyectoId;
    if ((!id || id === 'undefined') && typeof localStorage !== 'undefined') {
        id = localStorage.getItem('proyectoSeleccionado');
    }
    if (id && typeof DataService !== 'undefined' && DataService && typeof DataService.resolveId === 'function') {
        id = DataService.resolveId(id);
    }
    return id;
}

/**
 * Nivel de acceso efectivo a un panel. Sin AuthSystem (tests Node) se devuelve
 * 'edit' para no bloquear los helpers puros. Con AuthSystem, fail-closed.
 */
function nivelAccesoPanel(proyectoId, panelId) {
    if (typeof AuthSystem === 'undefined' || !AuthSystem) return 'edit';
    if (typeof AuthSystem.getCurrentUser !== 'function') return 'none';
    const usuario = AuthSystem.getCurrentUser();
    if (!usuario || !usuario.active) return 'none';
    if (typeof AuthSystem.esAdmin === 'function' && AuthSystem.esAdmin()) return 'edit';

    const modulo = moduloDePanel(panelId);
    // Panel sin módulo gobernado: se puede ver, pero no se concede edición.
    if (!modulo) return 'view';
    if (typeof AuthSystem.getNivelAccesoModulo !== 'function') return 'none';
    return AuthSystem.getNivelAccesoModulo(resolveProyectoId(proyectoId), modulo);
}

function puedeVerPanel(proyectoId, panelId) {
    return nivelAccesoPanel(proyectoId, panelId) !== 'none';
}

function puedeEditarPanel(proyectoId, panelId) {
    return nivelAccesoPanel(proyectoId, panelId) === 'edit';
}

/**
 * Aplica el nivel de acceso a un panel: además de ocultar los botones, los
 * deshabilita para que un handler residual no pueda mutar sin permiso.
 */
function aplicarPermisosPanel(panelEl, proyectoId, panelId) {
    if (!panelEl) return 'none';
    const nivel = nivelAccesoPanel(proyectoId, panelId);
    const editable = nivel === 'edit';
    panelEl.querySelectorAll('.edit-btn, .btn-primary:not(.btn-accion-especial), .delete-btn, .btn-danger')
        .forEach(function (btn) {
            btn.style.display = editable ? '' : 'none';
            btn.disabled = !editable;
            btn.setAttribute('aria-disabled', editable ? 'false' : 'true');
        });
    panelEl.setAttribute('data-nivel-acceso', nivel);
    return nivel;
}

if (typeof window !== 'undefined') {
    window.moduloDePanel = moduloDePanel;
    window.nivelAccesoPanel = nivelAccesoPanel;
    window.puedeVerPanel = puedeVerPanel;
    window.puedeEditarPanel = puedeEditarPanel;
    window.aplicarPermisosPanel = aplicarPermisosPanel;
}
