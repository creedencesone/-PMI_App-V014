// ============================================================
// core/audit.js — Bitácora append-only de cambios de gobernanza
// ============================================================

function _hashBitacora(texto) {
    let hash = 0x811c9dc5;
    const valor = String(texto == null ? '' : texto);
    for (let i = 0; i < valor.length; i++) {
        hash ^= valor.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, '0');
}

function _actorBitacora() {
    if (typeof usuarioActual !== 'undefined' && usuarioActual && usuarioActual.nombre) {
        return `${usuarioActual.nombre} (${usuarioActual.email || usuarioActual.role || 'usuario'})`;
    }
    try {
        const sesion = JSON.parse(localStorage.getItem('pmi_sesion_v3') || 'null');
        return sesion ? `${sesion.email || sesion.userId} (${sesion.role || 'usuario'})` : 'sistema';
    } catch {
        return 'sistema';
    }
}

/** Añade una entrada inmutable con encadenamiento de hash. */
/** Copia profunda usada por la bitácora: evita que renderizados posteriores muten el hash. */
function clonarParaBitacora(valor) {
    return valor == null ? null : JSON.parse(JSON.stringify(valor));
}

function registrarBitacora(entidad, entidadId, accion, antes, despues) {
    if (typeof proyecto === 'undefined' || !proyecto) return null;
    if (!Array.isArray(proyecto.bitacora)) proyecto.bitacora = [];
    const anterior = proyecto.bitacora.length ? proyecto.bitacora[proyecto.bitacora.length - 1].hash : 'GENESIS';
    const entrada = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        fecha: new Date().toISOString(),
        actor: _actorBitacora(),
        entidad: entidad || 'proyecto',
        entidadId: entidadId == null ? null : entidadId,
        accion: accion || 'actualizar',
        antes: antes == null ? null : antes,
        despues: despues == null ? null : despues,
        hashAnterior: anterior
    };
    entrada.hash = _hashBitacora(`${anterior}|${JSON.stringify(entrada)}`);
    proyecto.bitacora.push(entrada);
    return entrada;
}

/** Verifica que la cadena de hashes no haya sido alterada. */
function verificarBitacora() {
    const entradas = (typeof proyecto !== 'undefined' && proyecto && proyecto.bitacora) || [];
    let anterior = 'GENESIS';
    for (const entrada of entradas) {
        const copia = { ...entrada };
        delete copia.hash;
        const esperado = _hashBitacora(`${anterior}|${JSON.stringify(copia)}`);
        if (entrada.hash !== esperado) return false;
        anterior = entrada.hash;
    }
    return true;
}

/** Tras sanitizar un backup, reconstruye la cadena sobre los valores ya limpios. */
function recalcularBitacoraImportada(proyectoParam) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    if (!p || !Array.isArray(p.bitacora)) return;
    let anterior = 'GENESIS';
    p.bitacora.forEach(entrada => {
        entrada.hashAnterior = anterior;
        const copia = { ...entrada };
        delete copia.hash;
        entrada.hash = _hashBitacora(`${anterior}|${JSON.stringify(copia)}`);
        anterior = entrada.hash;
    });
}

function _escapeBitacora(valor) {
    if (typeof escapeHtml === 'function') return escapeHtml(valor);
    return String(valor == null ? '' : valor);
}

function mostrarBitacora() {
    const entradas = (typeof proyecto !== 'undefined' && proyecto && proyecto.bitacora) || [];
    const valida = verificarBitacora();
    const filas = entradas.slice().reverse().map(e => `
        <tr>
            <td>${_escapeBitacora(new Date(e.fecha).toLocaleString('es-ES'))}</td>
            <td>${_escapeBitacora(e.actor)}</td>
            <td>${_escapeBitacora(e.accion)}</td>
            <td>${_escapeBitacora(e.entidad)} #${_escapeBitacora(e.entidadId ?? '—')}</td>
            <td><code>${_escapeBitacora((e.hash || '').slice(0, 8))}</code></td>
        </tr>`).join('');

    const html = `<div class="modal-content modal-700">
        <div class="modal-header">
            <h3> Bitácora de cambios (append-only)</h3>
            <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
        </div>
        <div style="padding:16px">
            <div style="font-size:12px;margin-bottom:10px;color:var(--text-muted)">
                ${entradas.length} eventos · integridad <strong style="color:${valida ? '#00A859' : '#E53935'}">${valida ? 'verificada' : 'alterada'}</strong>
            </div>
            <div style="overflow:auto;max-height:420px">
                <table class="data-table" style="font-size:12px;width:100%;border-collapse:collapse">
                    <thead><tr><th>Fecha</th><th>Actor</th><th>Acción</th><th>Entidad</th><th>Hash</th></tr></thead>
                    <tbody>${filas || '<tr><td colspan="5" class="u-text-center">Sin eventos registrados</td></tr>'}</tbody>
                </table>
            </div>
        </div>
    </div>`;
    const existing = document.getElementById('genericModal');
    if (existing) existing.remove();
    const div = document.createElement('div');
    div.id = 'genericModal';
    div.className = 'modal';
    div.style.display = 'flex';
    div.innerHTML = html;
    document.body.appendChild(div);
    div.onclick = (e) => { if (e.target === div) cerrarModalGeneric(); };
}

window.clonarParaBitacora = clonarParaBitacora;
window.registrarBitacora = registrarBitacora;
window.verificarBitacora = verificarBitacora;
window.recalcularBitacoraImportada = recalcularBitacoraImportada;
window.mostrarBitacora = mostrarBitacora;
