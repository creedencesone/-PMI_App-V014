// ============================================================
// core/calidad.js — Calidad como proceso verificable (no un contador global)
// ============================================================

const TIPOS_VERIFICACION_CALIDAD = Object.freeze(['Revisión', 'Auditoría', 'Inspección', 'Prueba']);
const ESTADOS_NO_CONFORMIDAD = Object.freeze(['Abierta', 'En corrección', 'Verificada', 'Cerrada']);
const ESTADOS_ACCION_CALIDAD = Object.freeze(['Pendiente', 'En curso', 'Completada']);

/** Estructura canónica. idempotente: no sobrescribe información existente. */
function inicializarCalidad(proyectoParam) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    if (!p) return null;
    const calidad = p.calidad && typeof p.calidad === 'object' ? p.calidad : {};
    const resultado = {
        plan: Object.assign({ objetivos: '', estandares: [], responsable: '', fechaRevision: null }, calidad.plan || {}),
        verificaciones: Array.isArray(calidad.verificaciones) ? calidad.verificaciones : [],
        noConformidades: Array.isArray(calidad.noConformidades) ? calidad.noConformidades : [],
        accionesCorrectivas: Array.isArray(calidad.accionesCorrectivas) ? calidad.accionesCorrectivas : []
    };
    if (!Array.isArray(resultado.plan.estandares)) resultado.plan.estandares = [];
    p.calidad = resultado;
    return resultado;
}

function siguienteCodigoNoConformidad(proyectoParam) {
    const calidad = inicializarCalidad(proyectoParam);
    const existentes = (calidad ? calidad.noConformidades : []).map(n => String(n.codigo || ''));
    let n = 1;
    while (existentes.includes('NC-' + String(n).padStart(3, '0'))) n++;
    return 'NC-' + String(n).padStart(3, '0');
}

/** Cierre con evidencia: requiere acción correctiva completada y verificada. */
function puedeCerrarNoConformidad(noConformidad, acciones) {
    if (!noConformidad) return false;
    if (String(noConformidad.estado || '').toLowerCase() === 'cerrada') return false;
    const lista = acciones || [];
    const vinculadas = lista.filter(a =>
        String(a.noConformidadId || a.ncId || '') === String(noConformidad.id || noConformidad.codigo || ''));
    return vinculadas.some(a =>
        String(a.estado || '').toLowerCase() === 'completada' && String(a.evidencia || '').trim().length > 0);
}

/** Métricas objetivas del proceso de calidad. */
function resumenCalidad(proyectoParam) {
    const calidad = inicializarCalidad(proyectoParam);
    if (!calidad) return { verificaciones: 0, aprobadas: 0, noConformidades: 0, abiertas: 0, cerradas: 0, acciones: 0, accionesPendientes: 0, indiceCalidad: 0 };
    const verificaciones = calidad.verificaciones.length;
    const aprobadas = calidad.verificaciones.filter(v => v && (v.resultado === 'Conforme' || v.conforme === true)).length;
    const noConformidades = calidad.noConformidades.length;
    const cerradas = calidad.noConformidades.filter(n => n && String(n.estado || '').toLowerCase() === 'cerrada').length;
    const abiertas = noConformidades - cerradas;
    const acciones = calidad.accionesCorrectivas.length;
    const accionesPendientes = calidad.accionesCorrectivas.filter(a => a && String(a.estado || '').toLowerCase() !== 'completada').length;
    const indiceCalidad = verificaciones ? Math.round((aprobadas / verificaciones) * 100) : 0;
    return { verificaciones, aprobadas, noConformidades, abiertas, cerradas, acciones, accionesPendientes, indiceCalidad };
}

/** Checklist para el panel: la evidencia manda, no el checkbox manual. */
function evaluarChecklistCalidad(proyectoParam) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    const calidad = inicializarCalidad(p);
    const r = resumenCalidad(p);
    const plan = calidad ? calidad.plan : {};
    return [
        {
            clave: 'plan', etiqueta: 'Plan de calidad con objetivos y responsable',
            ok: !!(String(plan.objetivos || '').trim() && String(plan.responsable || '').trim()),
            detalle: String(plan.responsable || '').trim() || 'Sin responsable asignado'
        },
        {
            clave: 'estandares', etiqueta: 'Estándares de calidad definidos',
            ok: (plan.estandares || []).length > 0,
            detalle: `${(plan.estandares || []).length} estándar(es)`
        },
        {
            clave: 'verificaciones', etiqueta: 'Verificaciones ejecutadas',
            ok: r.verificaciones > 0,
            detalle: `${r.aprobadas} conforme(s) de ${r.verificaciones}`
        },
        {
            clave: 'noConformidades', etiqueta: 'No conformidades cerradas con evidencia',
            ok: r.abiertas === 0,
            detalle: r.noConformidades ? `${r.cerradas} de ${r.noConformidades} cerradas` : 'Sin no conformidades registradas'
        },
        {
            clave: 'acciones', etiqueta: 'Acciones correctivas completadas',
            ok: r.accionesPendientes === 0,
            detalle: r.acciones ? `${r.acciones - r.accionesPendientes} de ${r.acciones}` : 'Sin acciones registradas'
        }
    ];
}

/** Alta auditada de una no conformidad (única puerta de entrada). */
function registrarNoConformidad(proyectoParam, datos) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    if (!p || !datos) return null;
    const calidad = inicializarCalidad(p);
    const descripcion = String(datos.descripcion || '').trim();
    if (!descripcion) return null;
    const registro = {
        id: datos.id || Date.now(),
        codigo: siguienteCodigoNoConformidad(p),
        descripcion,
        estado: 'Abierta',
        fecha: datos.fecha || new Date().toISOString().slice(0, 10),
        origen: datos.origen || 'Directa'
    };
    if (datos.cantidad != null) registro.cantidad = Number(datos.cantidad) || 0;
    calidad.noConformidades.push(registro);
    if (typeof registrarBitacora === 'function') {
        const clon = typeof clonarParaBitacora === 'function'
            ? clonarParaBitacora : (v => v == null ? null : JSON.parse(JSON.stringify(v)));
        registrarBitacora('calidad', registro.id, 'crear', null, clon(registro), p);
    }
    return registro;
}

/** Convierte el contador global `defectos` en una no conformidad heredada. */
function migrarDefectosCalidad(proyectoParam) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    if (!p) return null;
    const calidad = inicializarCalidad(p);
    const defectos = Number(p.defectos) || 0;
    if (defectos > 0 && !calidad.noConformidades.some(n => n && n.origen === 'legacy-defectos')) {
        registrarNoConformidad(p, {
            descripcion: `${defectos} defecto(s) heredados del contador global de salud`,
            origen: 'legacy-defectos',
            cantidad: defectos
        });
    }
    return calidad;
}

if (typeof window !== 'undefined') {
    window.TIPOS_VERIFICACION_CALIDAD = TIPOS_VERIFICACION_CALIDAD;
    window.ESTADOS_NO_CONFORMIDAD = ESTADOS_NO_CONFORMIDAD;
    window.ESTADOS_ACCION_CALIDAD = ESTADOS_ACCION_CALIDAD;
    window.inicializarCalidad = inicializarCalidad;
    window.siguienteCodigoNoConformidad = siguienteCodigoNoConformidad;
    window.puedeCerrarNoConformidad = puedeCerrarNoConformidad;
    window.registrarNoConformidad = registrarNoConformidad;
    window.resumenCalidad = resumenCalidad;
    window.evaluarChecklistCalidad = evaluarChecklistCalidad;
    window.migrarDefectosCalidad = migrarDefectosCalidad;
}
