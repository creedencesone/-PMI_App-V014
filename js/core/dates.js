// ============================================================
// core/dates.js — Funciones de fecha y días hábiles
// ============================================================

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
        while (contados < diasInt) {
            dt.setDate(dt.getDate() - 1);
            if (!esFinDeSemana(dt)) contados++;
        }
    }
    return formatLocalDate(dt);
}

function calcularFechaFin(fechaInicio, duracion, tipoDuracion, horasDia) {
    if (tipoDuracion === 'horas' && horasDia > 0) {
        return sumarDiasHabiles(fechaInicio, duracion / horasDia);
    }
    return sumarDiasHabiles(fechaInicio, duracion);
}

// Asignar al window para compatibilidad con scripts legacy
window.esFinDeSemana = esFinDeSemana;
window.siguienteDiaHabil = siguienteDiaHabil;
window.parseLocalDate = parseLocalDate;
window.formatLocalDate = formatLocalDate;
window.sumarDias = sumarDias;
window.diffDias = diffDias;
window.sumarDiasHabiles = sumarDiasHabiles;
window.calcularFechaFin = calcularFechaFin;
