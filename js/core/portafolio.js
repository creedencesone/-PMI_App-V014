// ============================================================
// core/portafolio.js — Agregación de cartera con una sola moneda y un solo progreso
// ============================================================

/** Tasas base en EUR por unidad de moneda; se pueden sobreescribir al llamar. */
const TASAS_CARTERA_BASE = Object.freeze({
    EUR: 1, USD: 1.1603, GBP: 0.858, JPY: 178.482, CHF: 0.9465,
    BRL: 5.9218, MXN: 19.683, COP: 3608.9243, ARS: 1751.9618, CLP: 1089.0409,
    DZD: 154.7319, CDF: 2683.3008, MZN: 74.3037, ZAR: 18.7189,
    NGN: 1582.1055, KES: 150.4795, EGP: 59.5726, MAD: 10.9132,
    PEN: 3.9008, BOB: 14.6552, UYU: 46.8129, PYG: 6862.2429
});

/** Tasas configuradas por el usuario, sin depender de finance.js ni de window.proyecto. */
function tasasCartera(tasasExtra) {
    const base = Object.assign({}, TASAS_CARTERA_BASE);
    try {
        const cache = JSON.parse((typeof localStorage !== 'undefined' && localStorage.getItem('tiposCambioCache')) || '{}');
        if (cache && typeof cache === 'object') Object.assign(base, cache);
    } catch { /* cache corrupto: se usan las tasas base */ }
    if (tasasExtra && typeof tasasExtra === 'object') Object.assign(base, tasasExtra);
    return base;
}

/** Convierte `valor` de `origen` a `destino`: valor / tasa[origen] * tasa[destino]. */
function convertirEnCartera(valor, origen, destino, tasasExtra) {
    const numero = Number(valor);
    if (!isFinite(numero)) return 0;
    const tasaDestino = destino || 'EUR';
    const tasaOrigen = origen || tasaDestino;
    if (tasaOrigen === tasaDestino) return numero;
    const tasas = tasasCartera(tasasExtra);
    const a = tasas[tasaOrigen];
    const b = tasas[tasaDestino];
    if (!a || !b || !isFinite(a) || !isFinite(b)) return numero;
    return numero / a * b;
}

/** Moneda de salida de la cartera: la mayoritaria, con EUR como desempate. */
function monedaCartera(proyectos, preferida) {
    if (preferida) return preferida;
    const conteo = new Map();
    (proyectos || []).forEach(p => {
        const moneda = (p && p.monedaBase) || 'EUR';
        conteo.set(moneda, (conteo.get(moneda) || 0) + 1);
    });
    let mejor = 'EUR';
    let max = 0;
    conteo.forEach((n, moneda) => {
        if (n > max || (n === max && moneda === 'EUR')) { mejor = moneda; max = n; }
    });
    return mejor;
}

/** Progreso único: activities y tareas por igual, con la misma ponderación. */
function progresoProyecto(p) {
    if (!p) return 0;
    const elementos = p.elementosGantt || [];
    const tipos = new Set(['actividad', 'tarea']);
    const actividades = elementos.filter(e => e && tipos.has(e.tipo));
    const entregables = elementos.filter(e => e && e.tipo === 'entregable');
    const hitos = elementos.filter(e => e && e.tipo === 'hito');
    const procesos = p.procesos || [];
    const media = (lista, campo) => lista.length
        ? lista.reduce((s, e) => s + (Number(campo ? e[campo] : e) || 0), 0) / lista.length / 100
        : 0;
    const procesosOk = procesos.length ? procesos.filter(x => x && x.completado).length / procesos.length : 0;
    const hitosOk = hitos.length ? hitos.filter(h => (Number(h.progreso) || 0) >= 100).length / hitos.length : 0;
    const progreso = media(actividades, 'progreso') * 0.4
        + media(entregables, 'progreso') * 0.3
        + procesosOk * 0.2
        + hitosOk * 0.1;
    return Math.min(100, Math.max(0, Math.round(progreso * 100)));
}

/** Avance de entregables, usado por el informe y las tarjetas. */
function valorEntregado(p) {
    const entregables = (p && p.elementosGantt || []).filter(e => e && e.tipo === 'entregable');
    if (!entregables.length) return 0;
    return Math.round(entregables.reduce((s, e) => s + (Number(e.progreso) || 0), 0) / entregables.length);
}

function nivelRiesgoCartera(r) {
    const nivel = String((r && r.nivel) || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (['critico', 'alto', 'high'].includes(nivel)) return 'critico';
    const probabilidad = Number(r && r.probabilidad) || 0;
    const impacto = Number(r && r.impacto) || 0;
    if (probabilidad * impacto >= 20 || (Number(r && r.score) || 0) >= 20) return 'critico';
    return 'normal';
}

/** Beneficio real en la moneda de salida, priorizando beneficios.real del panel. */
function beneficioProyectoEnCartera(p, destino, tasasExtra) {
    if (!p) return 0;
    const moneda = p.monedaBase || 'EUR';
    let beneficio = null;
    if (p.beneficios && p.beneficios.real != null) beneficio = Number(p.beneficios.real);
    else if (p.beneficioReal != null) beneficio = Number(p.beneficioReal);
    else if (p.beneficio != null) beneficio = Number(p.beneficio);

    if (beneficio == null || !isFinite(beneficio)) {
        const costes = ['materiales', 'servicios', 'equipo', 'viajes'].reduce((total, clave) => {
            return total + (p[clave] || []).reduce((suma, item) => {
                let coste = 0;
                if (clave === 'equipo') coste = (Number(item.costeHora) || 0) * (Number(item.horasMes) || 0);
                else if (clave === 'viajes') coste = ['costeVuelos', 'costeHotel', 'costeComidas', 'costeTraslados']
                    .reduce((s, k) => s + (Number(item[k]) || 0), 0);
                else coste = (Number(item.cantidad) || 0) * (Number(item.costeUnitario) || 0);
                return suma + convertirEnCartera(coste, item.moneda || moneda, moneda, tasasExtra);
            }, 0);
        }, 0);
        beneficio = convertirEnCartera(Number(p.precioVenta) || 0, p.monedaVenta || moneda, moneda, tasasExtra) - costes;
    }
    return convertirEnCartera(beneficio, moneda, destino, tasasExtra);
}

/** Semáforo de cartera: estado civil, ejecución y riesgo con una sola regla. */
function clasificarEstadoCartera(p) {
    const civil = typeof normalizarEstadoProyecto === 'function'
        ? normalizarEstadoProyecto(p && p.estado) : 'en_curso';
    if (civil === 'cerrado') return { clave: 'cerrado', texto: '🔒 Cerrado', clase: 'status-cerrado' };
    if (civil === 'planificado') return { clave: 'planificado', texto: '📋 Planificado', clase: 'status-planificado' };
    if (progresoProyecto(p) >= 100) return { clave: 'finalizado', texto: ' Finalizado', clase: 'status-finalizado' };
    const criticos = (p && p.riesgos || []).filter(nivelRiesgoCartera).length;
    if (criticos > 0) return { clave: 'critico', texto: ' Crítico', clase: 'status-critico' };
    if ((p && p.riesgos || []).length > 2) return { clave: 'atencion', texto: '🟡 Atención', clase: 'status-atencion' };
    return { clave: 'en_curso', texto: '🟢 En curso', clase: 'status-en-curso' };
}

/** Resumen agregado: una sola moneda, un solo progreso y estados coherentes. */
function resumirCartera(proyectos, opciones) {
    const opts = opciones || {};
    const lista = proyectos || [];
    const moneda = monedaCartera(lista, opts.moneda);
    const porEstado = { cerrado: 0, planificado: 0, finalizado: 0, critico: 0, atencion: 0, en_curso: 0 };
    const resultado = {
        moneda,
        total: lista.length,
        activos: 0,
        finalizados: 0,
        valor: 0,
        beneficio: 0,
        riesgos: 0,
        entregablesAceptados: 0,
        porEstado,
        proyectos: []
    };
    lista.forEach(p => {
        const estado = clasificarEstadoCartera(p);
        porEstado[estado.clave]++;
        if (estado.clave === 'cerrado' || estado.clave === 'finalizado') resultado.finalizados++;
        else resultado.activos++;
        resultado.valor += convertirEnCartera(Number(p && p.precioVenta) || 0, (p && p.monedaVenta) || (p && p.monedaBase) || moneda, moneda, opts.tasas);
        resultado.beneficio += beneficioProyectoEnCartera(p, moneda, opts.tasas);
        resultado.riesgos += (p && p.riesgos || []).length;
        const entregables = (p && p.elementosGantt || []).filter(e => e && e.tipo === 'entregable');
        resultado.entregablesAceptados += entregables.filter(e => (Number(e.progreso) || 0) >= 100).length;
        resultado.proyectos.push({
            id: p && p.id,
            nombre: (p && p.nombre) || 'Sin nombre',
            moneda: (p && p.monedaBase) || moneda,
            progreso: progresoProyecto(p),
            valorEntregado: valorEntregado(p),
            valor: convertirEnCartera(Number(p && p.precioVenta) || 0, (p && p.monedaVenta) || (p && p.monedaBase) || moneda, moneda, opts.tasas),
            beneficio: beneficioProyectoEnCartera(p, moneda, opts.tasas),
            estado
        });
    });
    return resultado;
}

function escaparCSV(valor) {
    return '"' + String(valor == null ? '' : valor).replace(/"/g, '""') + '"';
}

if (typeof window !== 'undefined') {
    window.TASAS_CARTERA_BASE = TASAS_CARTERA_BASE;
    window.tasasCartera = tasasCartera;
    window.convertirEnCartera = convertirEnCartera;
    window.monedaCartera = monedaCartera;
    window.progresoProyecto = progresoProyecto;
    window.valorEntregado = valorEntregado;
    window.nivelRiesgoCartera = nivelRiesgoCartera;
    window.beneficioProyectoEnCartera = beneficioProyectoEnCartera;
    window.clasificarEstadoCartera = clasificarEstadoCartera;
    window.resumirCartera = resumirCartera;
    window.escaparCSV = escaparCSV;
}
