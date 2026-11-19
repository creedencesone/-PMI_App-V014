// ============================================================
// core/agentes.js — Equipo de agentes model-agnóstico
// ------------------------------------------------------------
// Orquesta especialistas PMI sobre LocalAIService. Si no hay modelo,
// la respuesta no se bloquea: cada agente aplica una heurística pura.
// Ningún agente muta el proyecto y la salida del modelo se normaliza
// antes de llegar a la UI (nunca se inserta como HTML).
// ============================================================

/** Texto seguro y acotado: la salida del modelo nunca es de confianza. */
function limpiarTextoAgente(valor, max) {
    return String(valor == null ? '' : valor)
        .replace(/[\u0000-\u001F\u007F]/g, ' ')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, max || 180);
}

function numeroAgente(valor) {
    const n = Number(valor);
    return Number.isFinite(n) ? n : 0;
}

/**
 * Instantánea minimalista del proyecto. Sólo primitivas: ni referencias
 * mutables ni credenciales salen del cliente.
 */
function construirContextoAgente(proyecto, metricas) {
    const p = proyecto && typeof proyecto === 'object' ? proyecto : {};
    const ex = metricas && typeof metricas === 'object' ? metricas : {};
    const elementos = Array.isArray(p.elementosGantt) ? p.elementosGantt : [];
    const actividades = elementos.filter(e => e && e.tipo === 'actividad');
    const entregables = elementos.filter(e => e && e.tipo === 'entregable');
    const riesgos = Array.isArray(p.riesgos) ? p.riesgos : [];
    const calidad = p.calidad && typeof p.calidad === 'object' ? p.calidad : {};
    const noConformidades = Array.isArray(calidad.noConformidades) ? calidad.noConformidades : [];
    const avance = actividades.length
        ? actividades.reduce((suma, e) => suma + numeroAgente(e.progreso), 0) / actividades.length
        : 0;

    return Object.freeze({
        nombre: limpiarTextoAgente(p.nombre, 120),
        estado: limpiarTextoAgente(p.estado, 40),
        moneda: limpiarTextoAgente(p.monedaBase || 'EUR', 12),
        precioVenta: numeroAgente(p.precioVenta),
        coste: numeroAgente(ex.costeTotal != null ? ex.costeTotal : p.costeTotal),
        ingreso: numeroAgente(ex.ingresoTotal != null ? ex.ingresoTotal : p.ingresoTotal),
        beneficio: numeroAgente(ex.beneficio),
        roi: numeroAgente(ex.roi),
        avance: Math.round(avance),
        spi: numeroAgente(ex.spi),
        cpi: numeroAgente(ex.cpi),
        actividades: actividades.length,
        entregables: entregables.length,
        entregablesCompletados: entregables.filter(e => numeroAgente(e.progreso) >= 100).length,
        riesgosCriticos: riesgos.filter(r => r && r.nivel === 'critico' && r.estado !== 'cerrado').length,
        riesgosAltos: riesgos.filter(r => r && r.nivel === 'alto' && r.estado !== 'cerrado').length,
        equipo: Array.isArray(p.equipo) ? p.equipo.length : 0,
        stakeholders: Array.isArray(p.stakeholders) ? p.stakeholders.length : 0,
        cambios: Array.isArray(p.cambios) ? p.cambios.length : 0,
        noConformidades: noConformidades.filter(n => n && n.estado !== 'cerrada').length,
        alertasAbiertas: (Array.isArray(p.alertas) ? p.alertas : []).filter(a => a && a.estado !== 'resuelta').length,
        fechaFin: limpiarTextoAgente(p.fechaFinPlan || p.fechaFin, 20)
    });
}

/** Contrato único para IA y heurística: resumen + señales + acciones. */
function formaResultado(resumen, senales, acciones) {
    return {
        resumen: limpiarTextoAgente(resumen, 280),
        senales: (senales || []).slice(0, 5).map(s => ({
            nivel: ['alta', 'media', 'baja'].includes(s.nivel) ? s.nivel : 'media',
            texto: limpiarTextoAgente(s.texto, 180)
        })).filter(s => s.texto),
        acciones: (acciones || []).slice(0, 5).map(a => limpiarTextoAgente(a, 180)).filter(Boolean)
    };
}

const AGENTES_PMI = Object.freeze([
    {
        id: 'planificador',
        nombre: 'Planificador',
        rol: 'Cronograma y ruta crítica',
        system: 'Eres director de proyectos PMI especializado en cronograma, ruta crítica y control de avance.',
        heuristica: function (c) {
            const senales = [];
            if (c.spi > 0 && c.spi < 0.9) senales.push({ nivel: 'alta', texto: `SPI ${c.spi}: avance por debajo de lo planificado.` });
            else if (c.actividades && c.avance < 40) senales.push({ nivel: 'media', texto: `Avance ${c.avance}% con ${c.actividades} actividades abiertas.` });
            if (c.entregables > c.entregablesCompletados) senales.push({ nivel: 'media', texto: `${c.entregables - c.entregablesCompletados} entregable(s) pendiente(s).` });
            if (!senales.length) senales.push({ nivel: 'baja', texto: 'Sin desviaciones relevantes en las métricas de cronograma.' });
            return formaResultado(
                senales[0].nivel === 'baja' ? 'Cronograma bajo control con la información disponible.' : 'El cronograma requiere seguimiento activo.',
                senales,
                ['Revisar la ruta crítica semanalmente', 'Confirmar la fecha de fin prevista con el equipo']
            );
        }
    },
    {
        id: 'financiero',
        nombre: 'Financiero',
        rol: 'Costes, valor ganado y ROI',
        system: 'Eres controller de proyectos especializado en costes, valor ganado, CPI y rentabilidad.',
        heuristica: function (c) {
            const senales = [];
            if (c.cpi > 0 && c.cpi < 0.95) senales.push({ nivel: 'alta', texto: `CPI ${c.cpi}: cada euro invertido rinde menos de lo previsto.` });
            if (c.beneficio < 0) senales.push({ nivel: 'alta', texto: 'El beneficio estimado es negativo con los datos actuales.' });
            else if (c.roi > 0 && c.roi < 10) senales.push({ nivel: 'media', texto: `ROI ${c.roi}% por debajo del umbral del 10%.` });
            if (!senales.length) senales.push({ nivel: 'baja', texto: 'Los indicadores económicos no muestran alertas.' });
            return formaResultado(
                `Coste ${c.coste} ${c.moneda} · ingreso ${c.ingreso} ${c.moneda} · beneficio ${c.beneficio} ${c.moneda}.`,
                senales,
                ['Conciliar coste real con el presupuesto base', 'Revisar partidas con mayor desviación']
            );
        }
    },
    {
        id: 'riesgos',
        nombre: 'Riesgos',
        rol: 'Riesgos y alertas de gobierno',
        system: 'Eres especialista en gestión de riesgos PMI y alertas de gobierno; priorizas impacto y probabilidad.',
        heuristica: function (c) {
            const senales = [];
            if (c.riesgosCriticos > 0) senales.push({ nivel: 'alta', texto: `${c.riesgosCriticos} riesgo(s) crítico(s) abierto(s).` });
            if (c.alertasAbiertas > 0) senales.push({ nivel: c.alertasAbiertas > 2 ? 'alta' : 'media', texto: `${c.alertasAbiertas} alerta(s) sin resolver.` });
            if (c.riesgosAltos > 0) senales.push({ nivel: 'media', texto: `${c.riesgosAltos} riesgo(s) alto(s) activo(s).` });
            if (!senales.length) senales.push({ nivel: 'baja', texto: 'Sin riesgos críticos ni alertas abiertas.' });
            return formaResultado(
                `Riesgos: ${c.riesgosCriticos} críticos, ${c.riesgosAltos} altos; ${c.alertasAbiertas} alertas abiertas.`,
                senales,
                ['Asignar responsable a cada riesgo crítico', 'Dar respuesta a las alertas con fecha límite']
            );
        }
    },
    {
        id: 'calidad',
        nombre: 'Calidad',
        rol: 'Calidad y no conformidades',
        system: 'Eres ingeniero de calidad especializado en verificaciones, no conformidades y acciones correctivas.',
        heuristica: function (c) {
            const senales = [];
            if (c.noConformidades > 0) senales.push({ nivel: c.noConformidades > 2 ? 'alta' : 'media', texto: `${c.noConformidades} no conformidad(es) abierta(s).` });
            if (c.entregables > 0 && c.entregablesCompletados < c.entregables) senales.push({ nivel: 'media', texto: 'Entregables pendientes de verificación final.' });
            if (!senales.length) senales.push({ nivel: 'baja', texto: 'Sin evidencia de no conformidades abiertas.' });
            return formaResultado(
                `Calidad: ${c.entregablesCompletados}/${c.entregables} entregables completados; ${c.noConformidades} no conformidades abiertas.`,
                senales,
                ['Cerrar no conformidades con evidencia y acción correctiva', 'Ejecutar el checklist de calidad del plan']
            );
        }
    },
    {
        id: 'comunicaciones',
        nombre: 'Comunicaciones',
        rol: 'Stakeholders y cambio',
        system: 'Eres especialista en comunicación y participación de stakeholders con enfoque en cambios y lecciones.',
        heuristica: function (c) {
            const senales = [];
            if (c.stakeholders < 3) senales.push({ nivel: 'media', texto: `${c.stakeholders} stakeholder(s) registrado(s): cobertura de comunicación limitada.` });
            if (c.cambios > 0) senales.push({ nivel: 'media', texto: `${c.cambios} cambio(s) acumulado(s): revisar impacto aprobado.` });
            if (!senales.length) senales.push({ nivel: 'baja', texto: 'Comunicación y cambios sin señales críticas.' });
            return formaResultado(
                `${c.stakeholders} stakeholder(s), ${c.cambios} cambio(s) y ${c.equipo} persona(s) en el equipo.`,
                senales,
                ['Actualizar la matriz de comunicación', 'Registrar lecciones aprendidas de los cambios aprobados']
            );
        }
    }
]);

/** Acepta JSON limpio, con o sin cercas de código, y valida el contrato. */
function normalizarRespuestaAgente(texto) {
    if (typeof texto !== 'string') return null;
    const bruto = texto.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const inicio = bruto.indexOf('{');
    const fin = bruto.lastIndexOf('}');
    if (inicio < 0 || fin <= inicio) return null;
    let datos;
    try { datos = JSON.parse(bruto.slice(inicio, fin + 1)); } catch (_) { return null; }
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return null;
    const resumen = limpiarTextoAgente(datos.resumen, 280);
    if (!resumen) return null;
    return {
        resumen,
        senales: (Array.isArray(datos.senales) ? datos.senales : []).slice(0, 5).map(s => ({
            nivel: ['alta', 'media', 'baja'].includes(s && s.nivel) ? s.nivel : 'media',
            texto: limpiarTextoAgente(s && s.texto, 180)
        })).filter(s => s.texto),
        acciones: (Array.isArray(datos.acciones) ? datos.acciones : []).slice(0, 5).map(a => limpiarTextoAgente(a, 180)).filter(Boolean)
    };
}

function modeloActivoSeguro() {
    if (typeof LocalAIService === 'undefined' || !LocalAIService || typeof LocalAIService.leerConfig !== 'function') return '';
    try {
        const cfg = LocalAIService.leerConfig();
        return (cfg.modelos && cfg.modelos[cfg.perfil]) || '';
    } catch (_) {
        return '';
    }
}

async function responderAgente(agente, contexto, opciones) {
    let error = null;
    if (typeof LocalAIService !== 'undefined' && LocalAIService && typeof LocalAIService.ask === 'function') {
        try {
            const texto = await LocalAIService.ask([
                { role: 'system', content: agente.system + ' Responde sólo con JSON: {"resumen":"...","senales":[{"nivel":"alta|media|baja","texto":"..."}],"acciones":["..."]}. Máximo 200 palabras, en español y sin inventar datos.' },
                { role: 'user', content: JSON.stringify({ tarea: agente.rol, contexto: contexto }) }
            ], { signal: opciones.signal });
            const normalizado = normalizarRespuestaAgente(texto);
            if (normalizado) return Object.assign(normalizado, { modo: 'ia', modelo: modeloActivoSeguro() });
            error = 'respuesta_invalida';
        } catch (e) {
            error = e && e.name === 'AbortError' ? 'timeout' : ((e && e.codigo) || 'red');
        }
    } else {
        error = 'sin_servicio';
    }
    return Object.assign(agente.heuristica(contexto), { modo: 'heuristico', modelo: '', error: error });
}

/**
 * Ejecuta el equipo en orden, aislando fallos: un agente caído nunca impide
 * a los demás responder. Devuelve siempre la instantánea y la procedencia.
 */
async function ejecutarEquipoAgentes(proyecto, opciones) {
    const opts = opciones || {};
    const contexto = construirContextoAgente(proyecto, opts.metricas);
    const ids = Array.isArray(opts.agentes) && opts.agentes.length
        ? opts.agentes
        : AGENTES_PMI.map(a => a.id);
    const resultados = [];
    for (const id of ids) {
        const agente = AGENTES_PMI.find(a => a.id === id);
        if (!agente) continue;
        const respuesta = await responderAgente(agente, contexto, opts);
        resultados.push(Object.assign({
            agente: agente.id,
            nombre: agente.nombre,
            rol: agente.rol
        }, respuesta));
    }
    let perfil = 'local';
    if (typeof LocalAIService !== 'undefined' && LocalAIService && typeof LocalAIService.leerConfig === 'function') {
        try { perfil = LocalAIService.leerConfig().perfil || 'local'; } catch (_) { /* valor por defecto */ }
    }
    return {
        resultados,
        contexto,
        metadata: {
            perfil,
            modelo: modeloActivoSeguro(),
            modo: resultados.some(r => r.modo === 'ia') ? 'mixto' : 'heuristico',
            agentes: resultados.length
        }
    };
}

if (typeof window !== 'undefined') {
    window.AGENTES_PMI = AGENTES_PMI;
    window.limpiarTextoAgente = limpiarTextoAgente;
    window.construirContextoAgente = construirContextoAgente;
    window.normalizarRespuestaAgente = normalizarRespuestaAgente;
    window.ejecutarEquipoAgentes = ejecutarEquipoAgentes;
}
