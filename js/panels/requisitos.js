// ============================================================
// REQUISITOS DEL PROYECTO — Planificación PMI (B.2)
// ============================================================
// Script clásico global: expone funciones en window para el HTML y los tests.
// Un requisito lleva evidencia verificable (criterios de aceptación), origen,
// prioridad MoSCoW, estado de aprobación y trazabilidad hacia la EDT.

const REQ_TIPOS = Object.freeze({
    funcional: 'Funcional',
    no_funcional: 'No funcional',
    legal: 'Legal / normativo',
    negocio: 'Negocio',
    restriccion: 'Restricción'
});

const REQ_PRIORIDADES = Object.freeze({
    must: 'Must have',
    should: 'Should have',
    could: 'Could have',
    wont: "Won't have (esta fase)"
});

const REQ_ESTADOS = Object.freeze({
    propuesto: 'Propuesto',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
    implementado: 'Implementado',
    validado: 'Validado'
});

function reqEsc(valor) {
    return typeof escapeHtml === 'function' ? escapeHtml(valor == null ? '' : String(valor)) : String(valor ?? '');
}

function reqLista() {
    if (typeof proyecto === 'undefined' || !proyecto) return [];
    if (!Array.isArray(proyecto.requisitos)) proyecto.requisitos = [];
    return proyecto.requisitos;
}

function reqElementos() {
    if (typeof proyecto === 'undefined' || !proyecto) return [];
    const vistos = new Set();
    return [].concat(proyecto.elementosGantt || [], proyecto.elementosGanttEjecucion || [])
        .filter(e => {
            if (!e || vistos.has(String(e.id))) return false;
            vistos.add(String(e.id));
            return true;
        });
}

/** Siguiente correlativo REQ-001, REQ-002... tolera importaciones sucias. */
function siguienteCodigoRequisito(lista) {
    const maximo = (lista || []).reduce((acc, r) => {
        const match = String(r?.codigo || '').match(/^REQ-(\d+)$/i);
        return match ? Math.max(acc, parseInt(match[1], 10)) : acc;
    }, 0);
    return `REQ-${String(maximo + 1).padStart(3, '0')}`;
}

function esRequisitoAprobado(r) {
    return !!r && (r.estado === 'aprobado' || r.estado === 'validado' || r.aprobado === true);
}

/** Un elemento cubre el requisito por cualquiera de las dos direcciones. */
function elementosQueCubren(r, elementos) {
    if (!r) return [];
    const id = String(r.id);
    return (elementos || []).filter(e =>
        (Array.isArray(e.requisitosIds) && e.requisitosIds.some(x => String(x) === id)) ||
        (r.entregableId != null && String(e.id) === String(r.entregableId))
    );
}

function resumenRequisitos(lista, elementos) {
    const reqs = lista || [];
    return {
        total: reqs.length,
        aprobados: reqs.filter(esRequisitoAprobado).length,
        sinCubrir: reqs.filter(r => elementosQueCubren(r, elementos).length === 0).length,
        criticosPendientes: reqs.filter(r => r.prioridad === 'must' && !esRequisitoAprobado(r)).length
    };
}

function puedeEditarRequisitos() {
    if (typeof AuthSystem === 'undefined') return true;
    let proyectoId = localStorage.getItem('proyectoSeleccionado');
    if (proyectoId && typeof DataService !== 'undefined' && typeof DataService.resolveId === 'function') {
        proyectoId = DataService.resolveId(proyectoId);
    }
    return AuthSystem.puedeEditarModulo(proyectoId, 'requisitos');
}

function renderizarRequisitos() {
    const lista = reqLista();
    const elementos = reqElementos();
    const filtroTipo = document.getElementById('reqFiltroTipo')?.value || '';
    const filtroEstado = document.getElementById('reqFiltroEstado')?.value || '';
    const filtroPrioridad = document.getElementById('reqFiltroPrioridad')?.value || '';
    const filtroTexto = (document.getElementById('reqFiltroTexto')?.value || '').trim().toLowerCase();
    const editable = puedeEditarRequisitos();

    const filtrados = lista.filter(r =>
        (!filtroTipo || r.tipo === filtroTipo) &&
        (!filtroEstado || r.estado === filtroEstado) &&
        (!filtroPrioridad || r.prioridad === filtroPrioridad) &&
        (!filtroTexto || `${r.codigo || ''} ${r.necesidad || ''} ${r.origen || ''}`.toLowerCase().includes(filtroTexto))
    );

    const tbody = document.getElementById('requisitosBody');
    if (tbody) {
        tbody.innerHTML = filtrados.map(r => {
            const cubiertos = elementosQueCubren(r, elementos);
            const metas = cubiertos.map(e => e.codigo || e.nombre || '').filter(Boolean).join(', ');
            const estado = r.estado || 'propuesto';
            const puedeAprobar = !esRequisitoAprobado(r) && (estado === 'propuesto' || estado === 'rechazado');
            return `<tr>
                <th scope="row">${reqEsc(r.codigo || String(r.id))}</th>
                <td>
                    <strong>${reqEsc(r.necesidad || 'Sin descripción')}</strong>
                    <div class="u-fs-11 u-text-muted">${reqEsc(r.origen || 'Origen no indicado')}</div>
                </td>
                <td><span class="req-badge req-badge--tipo">${reqEsc(REQ_TIPOS[r.tipo] || r.tipo || '—')}</span></td>
                <td><span class="req-badge req-badge--estado">${reqEsc(REQ_ESTADOS[estado] || estado)}</span></td>
                <td><span class="req-badge req-badge--prioridad">${reqEsc(REQ_PRIORIDADES[r.prioridad] || r.prioridad || '—')}</span></td>
                <td>${cubiertos.length
                    ? `<span class="req-badge req-badge--cubierto" title="${reqEsc(metas)}">Cubierto</span>`
                    : '<span class="req-badge req-badge--sin-cobertura">Sin cubrir</span>'}</td>
                <td class="req-acciones">${editable ? `
                    <button type="button" class="edit-btn" onclick="abrirModalRequisito('${reqEsc(r.id)}')" aria-label="Editar ${reqEsc(r.codigo || 'requisito')}">Editar</button>
                    ${puedeAprobar ? `<button type="button" class="btn btn-secondary btn-small" onclick="cambiarEstadoRequisito('${reqEsc(r.id)}', 'aprobado')" aria-label="Aprobar ${reqEsc(r.codigo || 'requisito')}">Aprobar</button>` : ''}
                    <button type="button" class="delete-btn" onclick="eliminarRequisito('${reqEsc(r.id)}')" aria-label="Eliminar ${reqEsc(r.codigo || 'requisito')}">Eliminar</button>` : '<span class="u-text-muted">Solo lectura</span>'}</td>
            </tr>`;
        }).join('') || '<tr><td colspan="7" class="u-text-center">No hay requisitos que coincidan con los filtros.</td></tr>';
    }

    const resumen = resumenRequisitos(lista, elementos);
    const resumenEl = document.getElementById('reqResumen');
    if (resumenEl) {
        resumenEl.textContent = `${filtrados.length} de ${resumen.total} requisito(s) · ${resumen.aprobados} aprobado(s) · ${resumen.sinCubrir} sin cubrir · ${resumen.criticosPendientes} Must pendiente(s)`;
    }

    renderizarTrazabilidadRequisitos(lista, elementos);
    if (typeof feather !== 'undefined' && typeof feather.replace === 'function') feather.replace();
}

function renderizarTrazabilidadRequisitos(lista, elementos) {
    const body = document.getElementById('matrizTrazabilidadBody');
    if (!body) return;
    const reqs = lista || reqLista();
    const elems = elementos || reqElementos();

    if (!reqs.length) {
        body.innerHTML = '<tr><td colspan="4" class="u-text-center">Aún no hay requisitos registrados.</td></tr>';
        return;
    }

    body.innerHTML = reqs.map(r => {
        const cubiertos = elementosQueCubren(r, elems);
        const celdas = cubiertos.map(e =>
            `<span class="req-badge req-badge--cubierto">${reqEsc(e.codigo || e.nombre || 'Elemento')}</span> ${reqEsc(e.nombre || '')}`
        ).join('<br>') || '<span class="u-text-muted">—</span>';
        return `<tr>
            <th scope="row">${reqEsc(r.codigo || String(r.id))}</th>
            <td>${reqEsc(r.necesidad || '')}</td>
            <td>${celdas}</td>
            <td>${cubiertos.length
                ? `<span class="req-badge req-badge--cubierto">${cubiertos.length} elemento(s)</span>`
                : '<span class="req-badge req-badge--sin-cobertura">Sin cubrir</span>'}</td>
        </tr>`;
    }).join('');
}

function abrirModalRequisito(id) {
    if (!puedeEditarRequisitos()) {
        mostrarToast('No tienes permisos de edición en Requisitos', 'error');
        return;
    }
    const lista = reqLista();
    const item = id != null ? lista.find(r => String(r.id) === String(id)) : null;
    const hoy = new Date().toISOString().split('T')[0];
    const valor = (clave, defecto) => reqEsc(item?.[clave] ?? defecto ?? '');

    const opciones = (mapa, seleccionado) => Object.entries(mapa).map(([clave, nombre]) =>
        `<option value="${reqEsc(clave)}" ${String(seleccionado || '') === clave ? 'selected' : ''}>${reqEsc(nombre)}</option>`
    ).join('');

    const elementoOpts = ['<option value="">— Sin vincular —</option>'].concat(
        reqElementos().map(e =>
            `<option value="${reqEsc(e.id)}" ${item && item.entregableId != null && String(item.entregableId) === String(e.id) ? 'selected' : ''}>${reqEsc((e.codigo || 'EDT') + ' · ' + (e.nombre || ''))}</option>`
        )
    ).join('');

    const container = document.getElementById('modalContainer');
    if (!container) return;
    container.innerHTML = `<div class="modal u-flex" id="genericModal">
        <div class="modal-content modal-600">
            <div class="modal-header">
                <h3 id="reqModalTitulo">${item ? 'Editar' : 'Nuevo'} requisito</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()" aria-label="Cerrar diálogo">&times;</span>
            </div>
            <form onsubmit="event.preventDefault(); guardarRequisito(${item ? `'${reqEsc(item.id)}'` : 'null'});">
                <input type="hidden" id="reqId" value="${valor('id')}">
                <div class="form-group">
                    <label for="reqCodigo">Código</label>
                    <input type="text" id="reqCodigo" value="${item ? valor('codigo') : reqEsc(siguienteCodigoRequisito(lista))}" readonly>
                </div>
                <div class="form-group">
                    <label for="reqNecesidad">Necesidad *</label>
                    <textarea id="reqNecesidad" rows="3" required maxlength="2000" autofocus placeholder="Qué necesita el proyecto o el cliente">${valor('necesidad')}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group"><label for="reqTipo">Tipo</label><select id="reqTipo">${opciones(REQ_TIPOS, item?.tipo || 'funcional')}</select></div>
                    <div class="form-group"><label for="reqPrioridad">Prioridad (MoSCoW)</label><select id="reqPrioridad">${opciones(REQ_PRIORIDADES, item?.prioridad || 'should')}</select></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label for="reqOrigen">Origen</label><input type="text" id="reqOrigen" value="${valor('origen')}" placeholder="Stakeholder, contrato, norma..."></div>
                    <div class="form-group"><label for="reqResponsable">Responsable</label><input type="text" id="reqResponsable" value="${valor('responsable')}" placeholder="Persona que lo valida"></div>
                </div>
                <div class="form-group">
                    <label for="reqCriterios">Criterios de aceptación *</label>
                    <textarea id="reqCriterios" rows="3" required maxlength="2000" placeholder="Verificables y medibles">${valor('criteriosAceptacion')}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group"><label for="reqEstado">Estado</label><select id="reqEstado">${opciones(REQ_ESTADOS, item?.estado || 'propuesto')}</select></div>
                    <div class="form-group"><label for="reqFecha">Fecha</label><input type="date" id="reqFecha" value="${valor('fecha', hoy)}"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label for="reqAprobadoPor">Aprobado por</label><input type="text" id="reqAprobadoPor" value="${valor('aprobadoPor')}" placeholder="Nombre y cargo"></div>
                    <div class="form-group"><label for="reqElementoId">EDT / entregable que lo cubre</label><select id="reqElementoId">${elementoOpts}</select></div>
                </div>
                <div class="modal-footer-actions">
                    <button type="button" class="btn btn-secondary" onclick="cerrarModalGeneric()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
            </form>
        </div>
    </div>`;
    const modal = document.getElementById('genericModal');
    if (modal && typeof window.abrirModalAccesible === 'function') window.abrirModalAccesible(modal);
}

function guardarRequisito(id) {
    if (!puedeEditarRequisitos()) {
        mostrarToast('No tienes permisos de edición en Requisitos', 'error');
        return;
    }
    const valor = clave => (document.getElementById(clave)?.value || '').trim();
    const necesidad = valor('reqNecesidad');
    const criterios = valor('reqCriterios');
    if (!necesidad) { mostrarToast('La necesidad es obligatoria', 'error'); return; }
    if (!criterios) { mostrarToast('Los criterios de aceptación son obligatorios', 'error'); return; }

    const elementoId = valor('reqElementoId') || null;
    const elemento = elementoId ? reqElementos().find(e => String(e.id) === String(elementoId)) : null;
    const datos = {
        codigo: valor('reqCodigo'),
        necesidad,
        tipo: valor('reqTipo') || 'funcional',
        origen: valor('reqOrigen'),
        prioridad: valor('reqPrioridad') || 'should',
        criteriosAceptacion: criterios,
        estado: valor('reqEstado') || 'propuesto',
        responsable: valor('reqResponsable'),
        fecha: valor('reqFecha'),
        aprobadoPor: valor('reqAprobadoPor'),
        entregableId: elementoId,
        wbsCode: elemento?.codigo || null
    };
    if ((datos.estado === 'aprobado' || datos.estado === 'validado') && !datos.aprobadoPor) {
        mostrarToast('Indica quién aprueba el requisito', 'error');
        return;
    }

    const lista = reqLista();
    const anterior = id != null ? lista.find(r => String(r.id) === String(id)) : null;
    const antes = anterior && typeof clonarParaBitacora === 'function' ? clonarParaBitacora(anterior) : anterior ? { ...anterior } : null;
    let entidadId = id;

    if (anterior) {
        Object.assign(anterior, datos);
    } else {
        entidadId = Date.now();
        lista.push({ id: entidadId, ...datos });
    }

    // Sincronización inversa: el elemento también sabe qué requisitos cubre.
    if (elemento) {
        if (!Array.isArray(elemento.requisitosIds)) elemento.requisitosIds = [];
        if (!elemento.requisitosIds.some(x => String(x) === String(entidadId))) elemento.requisitosIds.push(String(entidadId));
    }

    if (typeof sincronizarProcesoB2 === 'function') sincronizarProcesoB2();
    if (typeof registrarBitacora === 'function') registrarBitacora('requisito', entidadId, anterior ? 'actualizar' : 'crear', antes, datos);
    guardarProyecto();
    cerrarModalGeneric();
    renderizarRequisitos();
    if (typeof renderizarProcesos === 'function' && document.getElementById('procesosGrid')) renderizarProcesos();
    mostrarToast(anterior ? ' Requisito actualizado' : ' Requisito creado', 'success');
}

function cambiarEstadoRequisito(id, estado) {
    if (!puedeEditarRequisitos()) {
        mostrarToast('No tienes permisos de edición en Requisitos', 'error');
        return;
    }
    const r = reqLista().find(x => String(x.id) === String(id));
    if (!r) return;
    if ((estado === 'aprobado' || estado === 'validado') && !r.criteriosAceptacion) {
        mostrarToast('Añade criterios de aceptación antes de aprobar', 'error');
        return;
    }
    const antes = typeof clonarParaBitacora === 'function' ? clonarParaBitacora(r) : { ...r };
    r.estado = estado;
    if (estado === 'aprobado' && !r.aprobadoPor) {
        const usuario = typeof AuthSystem !== 'undefined' && AuthSystem.getCurrentUser?.();
        r.aprobadoPor = usuario?.nombre || usuario?.email || 'No indicado';
    }
    if (typeof sincronizarProcesoB2 === 'function') sincronizarProcesoB2();
    if (typeof registrarBitacora === 'function') registrarBitacora('requisito', r.id, 'cambiar_estado', antes, { estado: r.estado, aprobadoPor: r.aprobadoPor });
    guardarProyecto();
    renderizarRequisitos();
    if (typeof renderizarProcesos === 'function' && document.getElementById('procesosGrid')) renderizarProcesos();
    mostrarToast(` Requisito ${REQ_ESTADOS[estado] || estado}`, 'success');
}

function eliminarRequisito(id) {
    if (!puedeEditarRequisitos()) {
        mostrarToast('No tienes permisos de edición en Requisitos', 'error');
        return;
    }
    const lista = reqLista();
    const indice = lista.findIndex(r => String(r.id) === String(id));
    if (indice < 0) return;
    const cubiertos = elementosQueCubren(lista[indice], reqElementos());
    if (cubiertos.length && !confirm(`Este requisito está vinculado a ${cubiertos.length} elemento(s) del cronograma. ¿Eliminarlo de todos modos?`)) return;

    const antes = typeof clonarParaBitacora === 'function' ? clonarParaBitacora(lista[indice]) : { ...lista[indice] };
    const eliminado = lista.splice(indice, 1)[0];
    reqElementos().forEach(e => {
        if (Array.isArray(e.requisitosIds)) e.requisitosIds = e.requisitosIds.filter(x => String(x) !== String(id));
    });
    if (typeof sincronizarProcesoB2 === 'function') sincronizarProcesoB2();
    if (typeof registrarBitacora === 'function') registrarBitacora('requisito', eliminado.id, 'eliminar', antes, null);
    guardarProyecto();
    renderizarRequisitos();
    if (typeof renderizarProcesos === 'function' && document.getElementById('procesosGrid')) renderizarProcesos();
    mostrarToast(' Requisito eliminado', 'success');
}

window.REQ_TIPOS = REQ_TIPOS;
window.REQ_PRIORIDADES = REQ_PRIORIDADES;
window.REQ_ESTADOS = REQ_ESTADOS;
window.siguienteCodigoRequisito = siguienteCodigoRequisito;
window.esRequisitoAprobado = esRequisitoAprobado;
window.elementosQueCubren = elementosQueCubren;
window.resumenRequisitos = resumenRequisitos;
window.renderizarRequisitos = renderizarRequisitos;
window.renderizarTrazabilidadRequisitos = renderizarTrazabilidadRequisitos;
window.abrirModalRequisito = abrirModalRequisito;
window.guardarRequisito = guardarRequisito;
window.cambiarEstadoRequisito = cambiarEstadoRequisito;
window.eliminarRequisito = eliminarRequisito;
