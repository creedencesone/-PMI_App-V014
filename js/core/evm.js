// ============================================================
// core/evm.js — Earned Value Management
// ============================================================

function _monedaBaseCalculo(monedaBase) {
    return monedaBase || (typeof proyecto !== 'undefined' && proyecto?.monedaBase) || 'EUR';
}

function _costeElementoEnBase(elemento, conversion, monedaBase) {
    const valor = Number(elemento && elemento.costeEstimado) || 0;
    const origen = (elemento && elemento.recursoAsignado && elemento.recursoAsignado.moneda) ||
        (elemento && elemento.moneda) || monedaBase;
    return conversion(valor, origen);
}

function calcularCosteTotal(elementosGantt, materiales, servicios, viajes, convertirFn, monedaBase, opciones) {
    const base = _monedaBaseCalculo(monedaBase);
    const conversion = convertirFn
        ? ((valor, origen) => convertirFn(valor, origen, base))
        : ((valor, origen) => (typeof aBase === 'function' ? aBase(valor, origen, base) : valor));
    const opts = opciones || {};
    let total = (elementosGantt || []).reduce((sum, e) => sum + _costeElementoEnBase(e, conversion, base), 0);
    const omitir = (item) => opts.esAgile && (item.sprint || item.sprintAsociado);
    (materiales || []).forEach(m => { if (!omitir(m)) total += conversion((Number(m.cantidad) || 0) * (Number(m.costeUnitario) || 0), m.moneda); });
    (servicios || []).forEach(s => { if (!omitir(s)) total += conversion((Number(s.cantidad) || 0) * (Number(s.costeUnitario) || 0) * (1 + (Number(s.impuesto) || 0) / 100), s.moneda); });
    (viajes || []).forEach(v => total += conversion(
        (Number(v.costeVuelos) || 0) + (Number(v.costeHotel) || 0) + (Number(v.costeComidas) || 0) +
        (Number(v.costeTraslados) || 0) + (Number(v.costeEnvio) || 0), v.moneda || base));
    return total;
}

function calcularPV(elementosGantt, ahora, sumFn, convertirFn, monedaBase) {
    const fn = sumFn || sumarDiasHabiles;
    const base = _monedaBaseCalculo(monedaBase);
    const conversion = convertirFn || ((valor, origen) => (typeof aBase === 'function' ? aBase(valor, origen, base) : valor));
    let pv = 0;
    (elementosGantt || []).forEach(e => {
        if (!e.inicio || e.tipo === 'edt') return;
        const inicio = parseLocalDate(e.inicio);
        if (!inicio || inicio > ahora) return;
        const finStr = fn(e.inicio, e.duracion || 0);
        const fin = parseLocalDate(finStr);
        const coste = _costeElementoEnBase(e, conversion, base);
        if (fin && fin <= ahora) {
            pv += coste;
        } else if (fin && inicio <= ahora && fin > ahora) {
            const totalDias = diffDias(fin, inicio) || 1;
            const pct = Math.max(0, Math.min(1, diffDias(ahora, inicio) / totalDias));
            pv += coste * pct;
        }
    });
    return pv;
}

function calcularEV(elementosGantt, convertirFn, monedaBase) {
    const base = _monedaBaseCalculo(monedaBase);
    const conversion = convertirFn || ((valor, origen) => (typeof aBase === 'function' ? aBase(valor, origen, base) : valor));
    let ev = 0;
    (elementosGantt || []).forEach(e => {
        if (e.tipo === 'edt' || !e.costeEstimado) return;
        ev += _costeElementoEnBase(e, conversion, base) * Math.min(100, Math.max(0, e.progreso || 0)) / 100;
    });
    return ev;
}

function _fechaGasto(elemento) {
    if (!elemento) return null;
    const valor = elemento.fechaGasto || elemento.fechaCoste || elemento.fechaReal ||
        elemento.finReal || elemento.inicioReal || elemento.inicio;
    if (!valor) return null;
    const fecha = parseLocalDate(valor);
    return fecha && !isNaN(fecha.getTime()) ? fecha : null;
}

/**
 * Coste real incurrido hasta la fecha de corte.
 * Devuelve 0 cuando no hay gasto real: el prorrateo es sólo una estimación
 * que el panel etiqueta explícitamente como tal.
 */
function calcularACReal(elementosGantt, fechaCorte, sprints, convertirFn, monedaBase) {
    const corte = fechaCorte ? new Date(fechaCorte) : new Date();
    if (isNaN(corte.getTime())) return 0;
    const base = _monedaBaseCalculo(monedaBase);
    const conversion = convertirFn || ((valor, origen) => (typeof aBase === 'function' ? aBase(valor, origen, base) : valor));
    let total = 0;
    (elementosGantt || []).forEach(e => {
        const real = Number(e && e.costeReal) || 0;
        if (real <= 0 || e.tipo === 'edt') return;
        const fecha = _fechaGasto(e);
        const origen = (e.recursoAsignado && e.recursoAsignado.moneda) || e.moneda || base;
        if (!fecha || fecha <= corte) total += conversion(real, origen);
    });
    (sprints || []).forEach(sp => {
        if (!sp || !sp.costes || sp.estado !== 'completado') return;
        const real = Number(sp.costes.real) || 0;
        if (real <= 0) return;
        const fechaValor = sp.fechaFin || sp.fecha || sp.fin || sp.inicio;
        const fecha = fechaValor ? parseLocalDate(fechaValor) : null;
        const origen = sp.moneda || (sp.costes && sp.costes.moneda) || base;
        if (!fecha || (fecha <= corte)) total += conversion(real, origen);
    });
    return total;
}

/** Desglose transparente entre gasto real y estimación temporal. */
function calcularDesgloseAC(costeTotal, elementosGantt, ahora, fechaInicio, opciones) {
    const opts = opciones || {};
    const fechaCorte = opts.fechaCorte || ahora;
    const base = _monedaBaseCalculo(opts.monedaBase);
    const conversion = opts.convertirMoneda || ((valor, origen) => (typeof aBase === 'function' ? aBase(valor, origen, base) : valor));
    const real = calcularACReal(elementosGantt, fechaCorte, opts.sprints, conversion, base);
    if (real > 0) {
        return { real: real, estimado: 0, total: real, fuente: 'real' };
    }
    const estimado = calcularACProrrateado(costeTotal, elementosGantt, ahora, fechaInicio);
    return { real: 0, estimado: estimado, total: estimado, fuente: estimado > 0 ? 'estimado' : 'sin-datos' };
}

/** Prorrateo temporal: estimación burda, nunca se presenta como coste real. */
function calcularACProrrateado(costeTotal, elementosGantt, ahora, fechaInicio) {
    if (!fechaInicio || !ahora) return 0;
    const inicio = parseLocalDate(fechaInicio);
    if (!inicio || isNaN(inicio.getTime()) || ahora <= inicio) return 0;
    let finProy = new Date(inicio);
    (elementosGantt || []).forEach(e => {
        if (e.inicio && e.duracion) {
            const f = parseLocalDate(sumarDiasHabiles(e.inicio, e.duracion));
            if (f && !isNaN(f.getTime()) && f > finProy) finProy = f;
        }
    });
    const denom = Math.max(1, diffDias(finProy, inicio));
    const pct = Math.min(1, Math.max(0, diffDias(ahora, inicio) / denom));
    return (Number(costeTotal) || 0) * pct;
}

function calcularAC(costeTotal, elementosGantt, ahora, fechaInicio, opciones) {
    return calcularDesgloseAC(costeTotal, elementosGantt, ahora, fechaInicio, opciones).total;
}

function calcularCPI(ev, ac) {
    return ac > 0 ? ev / ac : (ev > 0 ? Infinity : 1);
}

function calcularSPI(ev, pv) {
    return pv > 0 ? ev / pv : (ev > 0 ? Infinity : 1);
}

/** Sin CPI fiable no hay base para pronosticar: se devuelve null, nunca BAC. */
function calcularEAC(bac, cpi) {
    if (!isFinite(cpi) || cpi <= 0 || !isFinite(bac)) return null;
    return bac / cpi;
}

function calcularVAC(bac, eac) {
    return bac - eac;
}

function calcularTCPI(bac, ev, ac) {
    const restante = bac - ac;
    return restante > 0 ? (bac - ev) / restante : 0;
}


/**
 * Modelo EVM único: salud e informe consumen exactamente las mismas entradas.
 * El BAC incluye el coste real de los sprints cerrados (el coste estimado de
 * materiales/servicios vinculados a sprint se excluye para no contarlo dos veces).
 */
function calcularModeloEVM(proyectoParam, opciones) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null) || {};
    const opts = opciones || {};
    const base = p.monedaBase || 'EUR';
    const conversion = (typeof convertirMoneda === 'function')
        ? ((valor, origen) => convertirMoneda(valor, origen, base))
        : ((valor, origen) => (typeof aBase === 'function' ? aBase(valor, origen, base) : valor));
    const metodologia = String((p.metodologia && p.metodologia.tipo) || 'cascada').toLowerCase();
    const esAgile = metodologia === 'agile' || metodologia === 'mixto';
    const sprints = (esAgile && p.scrum && Array.isArray(p.scrum.sprints)) ? p.scrum.sprints : [];
    const completados = sprints.filter(s => s && s.estado === 'completado');

    const costeBase = (typeof calcularCosteTotal === 'function')
        ? calcularCosteTotal(p.elementosGantt || [], p.materiales || [], p.servicios || [], p.viajes || [], conversion, base, { esAgile })
        : (p.elementosGantt || []).reduce((sum, e) => sum + (Number(e.costeEstimado) || 0), 0);
    const monedaSprint = s => s.moneda || (s.costes && s.costes.moneda) || base;
    const costeAgileReal = completados.reduce((sum, s) =>
        sum + conversion(Number(s.costes && s.costes.real) || 0, monedaSprint(s)), 0);
    const costeAgilePlan = completados.reduce((sum, s) =>
        sum + conversion(Number(s.costes && s.costes.planificado) || 0, monedaSprint(s)), 0);
    const idsCompletados = new Set(completados.map(s => String(s.id ?? s.numero)));
    const costePendiente = esAgile
        ? [...(p.materiales || []), ...(p.servicios || [])].reduce((sum, item) => {
            const sprint = item.sprint || item.sprintAsociado;
            if (sprint == null || idsCompletados.has(String(sprint))) return sum;
            const bruto = (Number(item.cantidad) || 0) * (Number(item.costeUnitario) || 0)
                * (1 + (Number(item.impuesto) || 0) / 100)
                + (Number(item.costeEnvio) || 0);
            return sum + conversion(bruto, item.moneda || base);
        }, 0)
        : 0;
    const BAC = costeBase + (esAgile ? costeAgileReal + costePendiente : 0);

    const fechaCorte = opts.fechaCorte || new Date();
    const AC = (typeof calcularDesgloseAC === 'function')
        ? calcularDesgloseAC(BAC, p.elementosGantt || [], fechaCorte, p.fechaInicio, {
            fechaCorte, sprints, convertirMoneda: conversion, monedaBase: base
        }).total
        : BAC;

    const EV = (typeof calcularEV === 'function') ? calcularEV(p.elementosGantt || [], conversion, base) : 0;
    const PV = (typeof calcularPV === 'function') ? calcularPV(p.elementosGantt || [], fechaCorte, null, conversion, base) : 0;
    const puntosPlan = completados.reduce((sum, s) => sum + (Number(s.puntosPlanificados) || 0), 0);
    const puntosComp = completados.reduce((sum, s) => sum + (Number(s.puntosCompletados) || 0), 0);
    const敏捷 = 0; // marcador interno eliminado en el objeto devuelto

    let agileCPI = costeAgilePlan > 0 && AC > 0 ? costeAgilePlan / AC : 1;
    let agileSPI = puntosPlan > 0 ? puntosComp / puntosPlan : 1;
    // El pronóstico usa el MISMO CPI que se muestra (limitado a 2).
    agileCPI = Math.min(2, Math.max(0, isFinite(agileCPI) ? agileCPI : 1));
    agileSPI = Math.min(2, Math.max(0, isFinite(agileSPI) ? agileSPI : 1));
    const agileEAC = BAC > 0 && agileCPI > 0 ? BAC / agileCPI : null;

    const usaAgil = esAgile && costeAgileReal > 0;
    let CPI = usaAgil ? agileCPI : (AC > 0 ? EV / AC : 1);
    let SPI = usaAgil ? agileSPI : (PV > 0 ? EV / PV : 1);
    let EAC = usaAgil ? agileEAC : ((typeof calcularEAC === 'function') ? calcularEAC(BAC, CPI) : (CPI > 0 ? BAC / CPI : null));
    let valorGanado = usaAgil ? AC * CPI : EV;
    let valorPlanificado = usaAgil ? AC * SPI : PV;
    if (!usaAgil && EAC !== null && isFinite(EAC)) EAC = Math.max(EAC, AC);
    CPI = Math.min(2, Math.max(0, isFinite(CPI) ? CPI : 1));
    SPI = Math.min(2, Math.max(0, isFinite(SPI) ? SPI : 1));

    const velocidad = (typeof calcularVelocidadEquipo === 'function')
        ? calcularVelocidadEquipo(p)
        : (p.velocidadEquipo || 0);

    return {
        esAgile, BAC, costeTotal: BAC, AC,
        EV: valorGanado, PV: valorPlanificado,
        CPI, SPI, EAC,
        agileCPI, agileSPI, agileEAC,
        costeAgileReal, costeAgilePlan, velocidad,
        puntosPlanificados: puntosPlan, puntosCompletados: puntosComp,
        fechaCorte, monedaBase: base
    };
}

/** Escenarios clásicos de EAC + TCPI basado en EAC. */
function calcularEscenariosEAC(bac, ac, ev, pv, cpi, spi) {
    const eacBasico = calcularEAC(bac, cpi);
    const factible = (valor) => isFinite(valor) && valor > 0 ? valor : null;
    const restante = Math.max(0, (Number(bac) || 0) - (Number(ev) || 0));
    const escenarios = [
        { clave: 'CPI', nombre: 'BAC / CPI', valor: eacBasico },
        { clave: 'típico', nombre: 'AC + (BAC − EV)', valor: factible((Number(ac) || 0) + restante) },
        { clave: 'compuesto', nombre: 'AC + (BAC − EV) / (CPI × SPI)', valor: (isFinite(cpi) && isFinite(spi) && cpi > 0 && spi > 0) ? factible((Number(ac) || 0) + restante / (cpi * spi)) : null },
        { clave: 'SPI', nombre: 'AC + (BAC − EV) / SPI', valor: (isFinite(spi) && spi > 0) ? factible((Number(ac) || 0) + restante / spi) : null }
    ];
    const referencia = eacBasico === null ? escenarios.find(s => s.valor !== null)?.valor ?? null : eacBasico;
    const tcpiEac = referencia !== null && (Number(referencia) - Number(ac || 0)) > 0
        ? (Number(bac) - Number(ev || 0)) / (referencia - Number(ac || 0))
        : null;
    return { escenarios, tcpiEac, referencia };
}

/** Único modelo de salud PMBOK, compartido por panel de salud e informe. */
function calcularSaludGeneral(valores) {
    const v = valores || {};
    const num = (x) => isFinite(x) ? Number(x) : 0;
    const cpi = num(v.CPI), spi = num(v.SPI), roi = num(v.ROI);
    const defectos = num(v.indiceDefectos), velocidad = num(v.velocidadEquipo);
    const satisfaccion = num(v.satisfaccion), huella = num(v.huellaCarbono), progreso = num(v.progresoGeneral);
    const total =
        (Math.min(1, cpi) * 15) +
        (Math.min(1, spi) * 15) +
        (Math.min(1, roi / 20) * 10) +
        (Math.max(0, 1 - defectos / 5) * 10) +
        (Math.min(1, velocidad / 30) * 10) +
        (satisfaccion / 5 * 15) +
        (Math.max(0, 1 - huella / 200) * 10) +
        (progreso * 15);
    return Math.min(100, Math.max(0, total));
}

// Asignar al window para compatibilidad legacy
window.calcularModeloEVM = calcularModeloEVM;
window.calcularCosteTotal = calcularCosteTotal;
window.calcularPV = calcularPV;
window.calcularEV = calcularEV;
window.calcularAC = calcularAC;
window.calcularACReal = calcularACReal;
window.calcularDesgloseAC = calcularDesgloseAC;
window.calcularCPI = calcularCPI;
window.calcularSPI = calcularSPI;
window.calcularCPI2 = calcularCPI;
window.calcularSPI2 = calcularSPI;
window.calcularEAC = calcularEAC;
window.calcularEAC2 = calcularEAC;
window.calcularEscenariosEAC = calcularEscenariosEAC;
window.calcularSaludGeneral = calcularSaludGeneral;
window.calcularVAC = calcularVAC;
window.calcularTCPI = calcularTCPI;
