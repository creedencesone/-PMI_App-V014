// ============================================================
// CORE MATH - Funciones de cálculo puras (testeables)
// ============================================================

// ─── FECHAS ───────────────────────────────────────────────

function esFinDeSemana(d) {
    const w = d.getDay();
    return w === 0 || w === 6;
}

function siguienteDiaHabil(d) {
    const r = new Date(d);
    while (esFinDeSemana(r)) r.setDate(r.getDate() + 1);
    return r;
}

function parseLocalDate(str) {
    if (!str) return null;
    const p = str.split('-');
    return new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
}

function formatLocalDate(d) {
    return d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
}

function sumarDias(f, d) {
    if (!f) return '';
    const p = f.split('-');
    const dt = new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]) + d);
    return formatLocalDate(dt);
}

function diffDias(a, b) {
    const ta = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const tb = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((ta - tb) / 86400000);
}

function sumarDiasHabiles(fechaStr, dias) {
    if (!fechaStr) return '';
    const dt = parseLocalDate(fechaStr);
    if (!dt) return '';
    if (Math.abs(dias) < 1) return formatLocalDate(dt);
    let contados = 0;
    if (dias >= 0) {
        while (contados < dias) {
            dt.setDate(dt.getDate() + 1);
            if (!esFinDeSemana(dt)) contados++;
        }
    } else {
        const diasInt = Math.ceil(Math.abs(dias));
        for (let i = 0; i < diasInt; i++) {
            dt.setDate(dt.getDate() - 1);
            if (!esFinDeSemana(dt)) contados--;
        }
    }
    return formatLocalDate(dt);
}

function calcularFechaFin(fechaInicio, duracion, tipoDuracion, horasDia) {
    if (tipoDuracion === 'horas' && horasDia > 0) {
        const diasFrac = duracion / horasDia;
        return sumarDiasHabiles(fechaInicio, diasFrac);
    }
    return sumarDiasHabiles(fechaInicio, duracion);
}

// ─── EVM (Earned Value Management) ───────────────────────

function calcularCosteTotal(elementosGantt, materiales, servicios, viajes, convertirMoneda) {
    let total = (elementosGantt || []).reduce((sum, e) => sum + (e.costeEstimado || 0), 0);
    (materiales || []).forEach(m => total += convertirMoneda(m.cantidad * m.costeUnitario, m.moneda));
    (servicios || []).forEach(s => total += convertirMoneda(s.cantidad * s.costeUnitario, s.moneda));
    (viajes || []).forEach(v => total += convertirMoneda(
        (v.costeVuelos || 0) + (v.costeHotel || 0) + (v.costeComidas || 0) + (v.costeTraslados || 0), v.moneda));
    return total;
}

function calcularPV(elementosGantt, ahora, sumarDiasFn) {
    const fn = sumarDiasFn || sumarDiasHabiles;
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
            const transcurridos = diffDias(ahora, inicio);
            const pct = Math.max(0, Math.min(1, transcurridos / totalDias));
            pv += (e.costeEstimado || 0) * pct;
        }
    });
    return pv;
}

function calcularEV(elementosGantt) {
    let ev = 0;
    (elementosGantt || []).forEach(e => {
        if (e.tipo === 'edt' || !e.costeEstimado) return;
        const pct = Math.min(100, Math.max(0, e.progreso || 0));
        ev += e.costeEstimado * (pct / 100);
    });
    return ev;
}

function calcularAC(costeTotal, elementosGantt, ahora, fechaInicio) {
    if (!fechaInicio || !ahora || ahora <= parseLocalDate(fechaInicio)) return 0;
    const inicio = parseLocalDate(fechaInicio);
    if (!inicio) return 0;
    let finProy = parseLocalDate(fechaInicio);
    (elementosGantt || []).forEach(e => {
        if (e.inicio && e.duracion) {
            const f = parseLocalDate(sumarDiasHabiles(e.inicio, e.duracion));
            if (f && f > finProy) finProy = f;
        }
    });
    const totalDias = Math.max(1, diffDias(finProy, inicio));
    const transcurridos = Math.max(0, diffDias(ahora, inicio));
    const pct = Math.min(1, transcurridos / totalDias);
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

// ─── FINANCIERO ──────────────────────────────────────────

function calcularROI(precioVenta, costeTotal) {
    return costeTotal > 0 ? ((precioVenta - costeTotal) / costeTotal * 100) : 0;
}

function calcularVAN(flujos, tasaDescuento) {
    let van = 0;
    (flujos || []).forEach(f => {
        van += f.valor / Math.pow(1 + (tasaDescuento || 0.1), (f.mes || 1) / 12);
    });
    return van;
}

function calcularPayback(precioVenta, costeTotal, maxMeses) {
    if (precioVenta <= 0) return maxMeses || 60;
    const ingresoMensual = precioVenta / 12;
    let acumulado = 0;
    let meses = 0;
    while (acumulado < costeTotal && meses < (maxMeses || 60)) {
        meses++;
        acumulado += ingresoMensual;
    }
    return meses;
}

// ─── CASHFLOW ────────────────────────────────────────────

function distribuirCostePorMeses(coste, mesInicio, duracionMeses) {
    const meses = Math.max(1, Math.ceil(duracionMeses));
    const porMes = coste / meses;
    const resultado = {};
    for (let i = 0; i < meses; i++) {
        const m = mesInicio + i;
        resultado[m] = (resultado[m] || 0) + porMes;
    }
    return resultado;
}

// ─── RUTA CRÍTICA (CPM) ─────────────────────────────────

function ejecutarCPM(elementos, sumarDiasFn) {
    const fn = sumarDiasFn || sumarDiasHabiles;
    const porId = {};
    elementos.forEach(e => porId[e.id] = { ...e, _inicio: parseLocalDate(e.inicio), _fin: null });

    // Forward pass
    Object.values(porId).forEach(e => {
        if (!e._inicio) {
            const preds = (e.predecesores || []).filter(p => porId[p.id] && porId[p.id]._inicio);
            if (preds.length > 0) {
                let maxFin = null;
                preds.forEach(p => {
                    const pred = porId[p.id];
                    if (pred._fin) {
                        const f = new Date(pred._fin);
                        if (!maxFin || f > maxFin) maxFin = f;
                    }
                });
                if (maxFin) e._inicio = new Date(maxFin);
            }
        }
        if (e._inicio && e.duracion > 0) {
            const finStr = fn(formatLocalDate(e._inicio), e.duracion);
            e._fin = parseLocalDate(finStr);
        } else if (e._inicio) {
            e._fin = new Date(e._inicio);
        }
    });

    // Backward pass for critical path
    return Object.values(porId);
}
