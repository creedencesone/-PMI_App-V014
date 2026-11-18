// ============================================================
// core/csv.js — Parser CSV con BOM, comillas, comillas escapadas y
// separadores , ; \t. Una sola implementación para todos los paneles.
// ============================================================

function detectarSeparadorCSV(texto) {
    const candidatos = [',', ';', '\t'];
    const lim = texto.indexOf('\n');
    const primera = texto.slice(0, lim < 0 ? texto.length : lim);
    let mejor = ',', max = -1;
    let enComillas = false;
    const recuento = { ',': 0, ';': 0, '\t': 0 };
    for (let i = 0; i < primera.length; i++) {
        const ch = primera[i];
        if (ch === '"') { if (enComillas && primera[i + 1] === '"') i++; else enComillas = !enComillas; }
        else if (!enComillas && Object.prototype.hasOwnProperty.call(recuento, ch)) recuento[ch]++;
    }
    candidatos.forEach(sep => { if (recuento[sep] > max) { max = recuento[sep]; mejor = sep; } });
    return mejor;
}

function parsearCSV(texto, opciones) {
    const opts = opciones || {};
    let s = String(texto == null ? '' : texto);
    if (s.charCodeAt(0) === 0xFEFF) s = s.slice(1);
    const sep = opts.separador || detectarSeparadorCSV(s);
    const filas = [];
    let fila = [], campo = '', enComillas = false;
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (enComillas) {
            if (ch === '"') {
                if (s[i + 1] === '"') { campo += '"'; i++; }
                else enComillas = false;
            } else campo += ch;
            continue;
        }
        if (ch === '"') { enComillas = true; continue; }
        if (ch === sep) { fila.push(campo.trim()); campo = ''; continue; }
        if (ch === '\n' || ch === '\r') {
            if (ch === '\r' && s[i + 1] === '\n') i++;
            fila.push(campo.trim());
            if (fila.some(c => c !== '')) filas.push(fila);
            fila = []; campo = '';
            continue;
        }
        campo += ch;
    }
    fila.push(campo.trim());
    if (fila.some(c => c !== '')) filas.push(fila);
    return filas;
}

window.parsearCSV = parsearCSV;
window.detectarSeparadorCSV = detectarSeparadorCSV;
