// ============================================================
// core/evm.js — Earned Value Management
// ============================================================

function calcularCosteTotal(elementosGantt, materiales, servicios, viajes, convertirMoneda) {
    let total = (elementosGantt || []).reduce((sum, e) => sum + (e.costeEstimado || 0), 0);
    (materiales || []).forEach(m => total += convertirMoneda(m.cantidad * m.costeUnitario, m.moneda));
    (servicios || []).forEach(s => total += convertirMoneda(s.cantidad * s.costeUnitario, s.moneda));
    (viajes || []).forEach(v => total += convertirMoneda(
        (v.costeVuelos || 0) + (v.costeHotel || 0) + (v.costeComidas || 0) + (v.costeTraslados || 0), v.moneda));
    return total;
}

function calcularPV(elementosGantt, ahora, sumFn) {
    const fn = sumFn || sumarDiasHabiles;
    let pv = 0;
    (elementosGantt || []).forEach(e => {
        if (!e.inicio || e.tipo === 'edt') return;
        const inicio = parseLocalDate(e.inicio);
        if (!inicio || inicio > ahora) return;
        const finStr = fn(e.inicio, e.duracion || 0);
        const fin = parseLocalDate(finStr);
        if (fin && fin <= ahora) {
            pv += e.costeEstimado || 0;
        } else if (fin && inicio <= ahora && fin > ahora) {
            const totalDias = diffDias(fin, inicio) || 1;
            const pct = Math.max(0, Math.min(1, diffDias(ahora, inicio) / totalDias));
            pv += (e.costeEstimado || 0) * pct;
        }
    });
    return pv;
}

function calcularEV(elementosGantt) {
    let ev = 0;
    (elementosGantt || []).forEach(e => {
        if (e.tipo === 'edt' || !e.costeEstimado) return;
        ev += e.costeEstimado * Math.min(100, Math.max(0, e.progreso || 0)) / 100;
    });
    return ev;
}

function calcularAC(costeTotal, elementosGantt, ahora, fechaInicio) {
    if (!fechaInicio || !ahora) return 0;
    const inicio = parseLocalDate(fechaInicio);
    if (!inicio || ahora <= inicio) return 0;
    let finProy = new Date(inicio);
    (elementosGantt || []).forEach(e => {
        if (e.inicio && e.duracion) {
            const f = parseLocalDate(sumarDiasHabiles(e.inicio, e.duracion));
            if (f && f > finProy) finProy = f;
        }
    });
    const pct = Math.min(1, Math.max(0, diffDias(ahora, inicio) / Math.max(1, diffDias(finProy, inicio))));
    return costeTotal * pct;
}

function calcularCPI(ev, ac) {
    return ac > 0 ? ev / ac : (ev > 0 ? Infinity : 1);
}

function calcularSPI(ev, pv) {
    return pv > 0 ? ev / pv : (ev > 0 ? Infinity : 1);
}

function calcularEAC(bac, cpi) {
    return cpi > 0 ? bac / cpi : bac;
}

function calcularVAC(bac, eac) {
    return bac - eac;
}

function calcularTCPI(bac, ev, ac) {
    const restante = bac - ac;
    return restante > 0 ? (bac - ev) / restante : 0;
}

// Asignar al window para compatibilidad legacy
window.calcularCosteTotal = calcularCosteTotal;
window.calcularPV = calcularPV;
window.calcularEV = calcularEV;
window.calcularAC = calcularAC;
window.calcularCPI2 = calcularCPI;
window.calcularSPI2 = calcularSPI;
window.calcularEAC2 = calcularEAC;
window.calcularVAC = calcularVAC;
window.calcularTCPI = calcularTCPI;
