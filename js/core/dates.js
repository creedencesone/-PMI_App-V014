// ============================================================
// core/dates.js — Fechas, días hábiles y calendario laboral real
// ============================================================

function _proyectoCalendarioActual() {
    if (typeof proyecto !== 'undefined' && proyecto && proyecto.calendario) return proyecto.calendario;
    return null;
}

function _parseFechaIsoLocal(fecha) {
    if (!fecha) return null;
    if (fecha instanceof Date) return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    const s = String(fecha).slice(0, 10);
    const p = s.split('-');
    if (p.length !== 3) return null;
    const d = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
    return isNaN(d.getTime()) ? null : d;
}

function _claveFechaLocal(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function _setFestivos(cal) {
    const lista = (cal && Array.isArray(cal.festivos) ? cal.festivos : []);
    return new Set(lista.map(f => String(f).slice(0, 10)).filter(Boolean));
}

function esDiaNoLaboral(d, calendario) {
    const cal = calendario || _proyectoCalendarioActual() || {};
    const dt = _parseFechaIsoLocal(d);
    if (!dt) return false;
    const libres = Array.isArray(cal.diasNoLaborables) ? cal.diasNoLaborables : [0, 6];
    if (libres.indexOf(dt.getDay()) !== -1) return true;
    return _setFestivos(cal).has(_claveFechaLocal(dt));
}

function esFinDeSemana(d) {
    const dt = _parseFechaIsoLocal(d);
    if (!dt) return false;
    return esDiaNoLaboral(dt);
}

function siguienteDiaHabil(d, calendario) {
    const r = _parseFechaIsoLocal(d);
    if (!r) return null;
    let vueltas = 0;
    while (esDiaNoLaboral(r, calendario) && vueltas < 3660) { r.setDate(r.getDate() + 1); vueltas++; }
    return r;
}

function parseLocalDate(str) {
    return _parseFechaIsoLocal(str);
}

function formatLocalDate(d) {
    if (!d) return '';
    const dt = _parseFechaIsoLocal(d);
    if (!dt) return '';
    return _claveFechaLocal(dt);
}

function sumarDias(f, d) {
    if (!f) return '';
    const dt = _parseFechaIsoLocal(f);
    if (!dt) return '';
    dt.setDate(dt.getDate() + (Number(d) || 0));
    return _claveFechaLocal(dt);
}

function diffDias(a, b) {
    const da = _parseFechaIsoLocal(a);
    const db = _parseFechaIsoLocal(b);
    if (!da || !db) return 0;
    const ta = Date.UTC(da.getFullYear(), da.getMonth(), da.getDate());
    const tb = Date.UTC(db.getFullYear(), db.getMonth(), db.getDate());
    return Math.round((ta - tb) / 86400000);
}

function sumarDiasHabiles(fechaStr, dias, calendario) {
    if (!fechaStr) return '';
    const dt = _parseFechaIsoLocal(fechaStr);
    if (!dt) return '';
    const cal = calendario || _proyectoCalendarioActual();
    const n = Number(dias) || 0;
    if (Math.abs(n) < 1) return _claveFechaLocal(dt);
    let contados = 0;
    let vueltas = 0;
    if (n >= 0) {
        while (contados < n && vueltas < 36600) {
            dt.setDate(dt.getDate() + 1);
            if (!esDiaNoLaboral(dt, cal)) contados++;
            vueltas++;
        }
    } else {
        const diasInt = Math.ceil(Math.abs(n));
        while (contados < diasInt && vueltas < 36600) {
            dt.setDate(dt.getDate() - 1);
            if (!esDiaNoLaboral(dt, cal)) contados++;
            vueltas++;
        }
    }
    return _claveFechaLocal(dt);
}

function contarDiasHabiles(inicio, fin, calendario) {
    if (!inicio || !fin) return 0;
    const a = _parseFechaIsoLocal(inicio);
    const b = _parseFechaIsoLocal(fin);
    if (!a || !b) return 0;
    const cal = calendario || _proyectoCalendarioActual();
    let n = 0;
    const d = new Date(a);
    let vueltas = 0;
    while (d < b && vueltas < 36600) {
        if (!esDiaNoLaboral(d, cal)) n++;
        d.setDate(d.getDate() + 1);
        vueltas++;
    }
    return n;
}

/** Un retraso se expresa en días hábiles; CPM y Monte Carlo lo convierten igual. */
function retrasoEnDiasNaturales(retraso, fechaReferencia, calendario) {
    const referencia = fechaReferencia || '2024-01-01';
    const inicio = _parseFechaIsoLocal(referencia);
    if (!inicio || isNaN(inicio.getTime())) return Number(retraso) || 0;
    const fin = sumarDiasHabiles(referencia, Number(retraso) || 0, calendario);
    const final = _parseFechaIsoLocal(fin);
    if (!final) return Number(retraso) || 0;
    return Math.round((final - inicio) / 86400000);
}

function calcularFechaFin(fechaInicio, duracion, tipoDuracion, horasDia) {
    if (tipoDuracion === 'horas' && horasDia > 0) {
        return sumarDiasHabiles(fechaInicio, duracion / horasDia);
    }
    return sumarDiasHabiles(fechaInicio, duracion);
}

window.esDiaNoLaboral = esDiaNoLaboral;
window.esFinDeSemana = esFinDeSemana;
window.siguienteDiaHabil = siguienteDiaHabil;
window.parseLocalDate = parseLocalDate;
window.formatLocalDate = formatLocalDate;
window.sumarDias = sumarDias;
window.diffDias = diffDias;
window.sumarDiasHabiles = sumarDiasHabiles;
window.contarDiasHabiles = contarDiasHabiles;
window.retrasoEnDiasNaturales = retrasoEnDiasNaturales;
window.calcularFechaFin = calcularFechaFin;
