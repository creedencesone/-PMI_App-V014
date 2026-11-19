// ============================================================
// core/linea-base.js — Gobernanza de líneas base ante cambios aprobados
// ============================================================

// ============================================
// GOVERNANCE: aprobación de cambios → NUEVA línea base (nunca sobrescribe)
// ============================================

/** Elementos del cronograma activo, con fallback al planificador. */
function elementosParaLineaBase() {
    const clave = (typeof cronogramaActivo !== 'undefined' && cronogramaActivo && cronogramaActivo.dataKey) || 'elementosGantt';
    const lista = (typeof proyecto !== 'undefined' && (proyecto[clave] || proyecto.elementosGantt)) || [];
    return Array.isArray(lista) ? lista : [];
}

/**
 * Genera una nueva línea base tras aprobar un cambio.
 * La línea base anterior queda intacta como predecesora y se registra el diff
 * de alcance antes → después, de modo que `compararLineaBase` siga siendo útil.
 */
function nuevaLineaBaseTrasCambio(lineaBaseAnterior, cambio, opciones) {
    opciones = opciones || {};
    if (typeof crearScopeBaseline !== 'function') return null;
    const elementos = elementosParaLineaBase();
    const lista = elementos.map(e => JSON.parse(JSON.stringify(e)));
    aplicarCodigosWBS(lista);
    const aprobados = ((proyecto && proyecto.cambios) || []).filter(c =>
        (c.estado === 'Aprobado' || c.estado === 'Implementado') &&
        (opciones.excluirCambioId == null || String(c.id) !== String(opciones.excluirCambioId)));
    const snapshot = crearScopeBaseline(lista, aprobados);
    const anterior = lineaBaseAnterior && lineaBaseAnterior.scopeBaseline
        ? JSON.parse(JSON.stringify(lineaBaseAnterior.scopeBaseline)) : null;
    const actualCodificado = lista.map(e => ({ id: e.id, codigo: e.codigo, nombre: e.nombre, tipo: e.tipo }));
    const diff = opciones.esInicial
        ? { altas: [], bajas: [], cambios: [], total: 0 }
        : (typeof compararScopeBaseline === 'function'
            ? compararScopeBaseline(actualCodificado, anterior)
            : { altas: [], bajas: [], cambios: [], total: 0 });
    const ids = ((proyecto && proyecto.lineasBase) || []).map(l => Number(l.id) || 0);
    return {
        id: Math.max(Date.now(), ...ids) + 1,
        nombre: `Línea base tras cambio #${cambio.id}`,
        fecha: new Date().toISOString().slice(0, 10),
        dataKey: (typeof cronogramaActivo !== 'undefined' && cronogramaActivo && cronogramaActivo.dataKey) || 'elementosGantt',
        panelKey: (typeof cronogramaActivo !== 'undefined' && cronogramaActivo && cronogramaActivo.panelKey) || 'planificacion',
        elementos: lista,
        scopeBaseline: snapshot,
        scopeBaselineAnterior: anterior,
        diffAlcance: diff,
        cambioId: cambio.id,
        impactoCambio: {
            descripcion: cambio.descripcion || null,
            coste: Number(cambio.impactoCosteNumerico) || 0,
            plazoDias: Number(cambio.impactoPlazoDias) || 0,
            alcance: cambio.impactoAlcance || 'Por determinar',
            aprobadoPor: cambio.aprobadoPor || null,
            fechaAprobacion: cambio.fechaAprobacion || null
        },
        predecesoraId: lineaBaseAnterior ? lineaBaseAnterior.id : null,
        originadaPor: 'cambio-aprobado'
    };
}

/** Enganche único usado por alta y edición de solicitudes de cambio. */
function propagarCambioALineaBase(lineaBaseAnterior, cambio) {
    const elementos = elementosParaLineaBase();
    if (typeof aplicarCodigosWBS === 'function') aplicarCodigosWBS(elementos);
    if (!Array.isArray(proyecto.lineasBase)) proyecto.lineasBase = [];
    // Un cambio antiguo puede apuntar a una línea base ya superada: la
    // predecesora siempre es la última línea base vigente.
    const vigentes = proyecto.lineasBase.filter(lb => !lb.superada)
        .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
    if (!lineaBaseAnterior || !vigentes.some(lb => lb.id === lineaBaseAnterior.id)) {
        lineaBaseAnterior = vigentes[0] || null;
    }
    // Si aún no existe línea base, se congela el estado PREVIO al cambio.
    if (!lineaBaseAnterior) {
        const inicial = nuevaLineaBaseTrasCambio(null,
            { id: 0, descripcion: 'Línea base inicial' },
            { esInicial: true, excluirCambioId: cambio.id });
        if (inicial) {
            inicial.nombre = 'Línea base inicial (previa al cambio #' + cambio.id + ')';
            proyecto.lineasBase.push(inicial);
            lineaBaseAnterior = inicial;
        }
    }
    const nueva = nuevaLineaBaseTrasCambio(lineaBaseAnterior, cambio);
    if (!nueva) return null;
    if (lineaBaseAnterior) lineaBaseAnterior.superada = true;
    proyecto.lineasBase.push(nueva);
    if (typeof registrarBitacora === 'function') {
        registrarBitacora('lineaBase', nueva.id, 'crear',
            lineaBaseAnterior ? { id: lineaBaseAnterior.id, scopeBaseline: lineaBaseAnterior.scopeBaseline } : null,
            { id: nueva.id, cambioId: cambio.id, diffAlcance: nueva.diffAlcance });
    }
    return nueva;
}
