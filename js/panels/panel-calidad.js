// ============================================================
// panel-calidad.js — Plan, verificaciones, no conformidades y acciones correctivas
// ============================================================

function escCalidad(valor) {
    if (typeof escapeHtml === 'function') return escapeHtml(valor);
    return String(valor == null ? '' : valor)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function puedeEditarCalidad() {
    if (typeof proyecto === 'undefined' || !proyecto) return false;
    if (typeof puedeEditarPanel === 'function') return puedeEditarPanel(proyecto.id, 'calidad');
    if (typeof AuthSystem === 'undefined' || !AuthSystem) return true;
    return AuthSystem.puedeEditarModulo ? AuthSystem.puedeEditarModulo(proyecto.id, 'calidad') : false;
}

function inicializarCalidadPanel() {
    if (typeof proyecto === 'undefined' || !proyecto) return;
    migrarDefectosCalidad(proyecto);
    renderizarPlanCalidad();
    renderizarCalidad();
}

function renderizarCalidad() {
    const estadoEl = document.getElementById('calidadResumen');
    const checklistEl = document.getElementById('checklistCalidad');
    if (!estadoEl || !checklistEl || typeof proyecto === 'undefined' || !proyecto) return;

    const calidad = inicializarCalidad(proyecto);
    const r = resumenCalidad(proyecto);
    const editable = puedeEditarCalidad();
    estadoEl.innerHTML = `<span class="req-badge req-badge--estado">${r.indiceCalidad}% conforme</span>
        <span class="u-text-muted">${r.noConformidades} no conformidad(es) · ${r.abiertas} abierta(s) · ${r.accionesPendientes} acción(es) pendiente(s)</span>`;

    checklistEl.innerHTML = evaluarChecklistCalidad(proyecto).map(item => `
        <li class="cierre-checklist__item">
            <span class="req-badge req-badge--${item.ok ? 'cubierto' : 'prioridad'}" aria-hidden="true">${item.ok ? 'OK' : 'Pendiente'}</span>
            <span><strong>${escCalidad(item.etiqueta)}</strong><span class="u-fs-11 u-text-muted">${escCalidad(item.detalle)}</span></span>
        </li>`).join('');

    const verBody = document.getElementById('calidadVerificacionesBody');
    if (verBody) {
        verBody.innerHTML = calidad.verificaciones.length ? calidad.verificaciones.map(v => `
            <tr>
                <td>${escCalidad(v.codigo || v.id)}</td>
                <td>${escCalidad(v.tipo || '')}</td>
                <td>${escCalidad(v.descripcion || '')}</td>
                <td><span class="req-badge req-badge--${v.resultado === 'Conforme' ? 'cubierto' : 'prioridad'}">${escCalidad(v.resultado || 'Pendiente')}</span></td>
                <td>${escCalidad(v.fecha || '')}</td>
            </tr>`).join('') : '<tr><td colspan="5" class="u-text-center">Sin verificaciones registradas</td></tr>';
    }

    const ncBody = document.getElementById('calidadNoConformidadesBody');
    if (ncBody) {
        ncBody.innerHTML = calidad.noConformidades.length ? calidad.noConformidades.map(n => `
            <tr>
                <td>${escCalidad(n.codigo || n.id)}</td>
                <td>${escCalidad(n.descripcion || '')}</td>
                <td><span class="req-badge req-badge--${n.estado === 'Cerrada' ? 'cubierto' : 'prioridad'}">${escCalidad(n.estado || 'Abierta')}</span></td>
                <td>${escCalidad(n.origen === 'legacy-defectos' ? 'Heredada de Salud' : (n.origen || 'Directa'))}</td>
                <td>
                    <button type="button" class="btn btn-secondary btn-small" onclick="abrirModalAccionCalidad('${escCalidad(n.id)}')" ${editable ? '' : 'disabled'}>Acción correctiva</button>
                    <button type="button" class="btn btn-secondary btn-small" onclick="cerrarNoConformidad('${escCalidad(n.id)}')" ${editable ? '' : 'disabled'}>Cerrar</button>
                </td>
            </tr>`).join('') : '<tr><td colspan="5" class="u-text-center">Sin no conformidades registradas</td></tr>';
    }

    const accBody = document.getElementById('calidadAccionesBody');
    if (accBody) {
        accBody.innerHTML = calidad.accionesCorrectivas.length ? calidad.accionesCorrectivas.map(a => `
            <tr>
                <td>${escCalidad(a.codigo || a.id)}</td>
                <td>${escCalidad(a.descripcion || '')}</td>
                <td><span class="req-badge req-badge--${a.estado === 'Completada' ? 'cubierto' : 'prioridad'}">${escCalidad(a.estado || 'Pendiente')}</span></td>
                <td>${escCalidad(a.evidencia || 'Sin evidencia')}</td>
            </tr>`).join('') : '<tr><td colspan="4" class="u-text-center">Sin acciones correctivas registradas</td></tr>';
    }

    ['btnNuevaVerificacion', 'btnNuevaNoConformidad'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = !editable;
    });
}

function abrirModalCalidad(tipo) {
    if (!puedeEditarCalidad()) {
        mostrarToast('No tienes permiso de edición en Calidad', 'warning');
        return;
    }
    const esVerificacion = tipo === 'verificacion';
    const opcionesTipo = TIPOS_VERIFICACION_CALIDAD.map(t => `<option value="${escCalidad(t)}">${escCalidad(t)}</option>`).join('');
    const opcionesResultado = ['Conforme', 'No conforme'].map(t => `<option value="${t}">${t}</option>`).join('');
    const modal = `<div class="modal-content modal-600">
        <div class="modal-header"><h3>${esVerificacion ? 'Nueva verificación' : 'Nueva no conformidad'}</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
        <div class="modal-body">
            <div class="form-group"><label for="calidadModalDescripcion">Descripción</label><textarea id="calidadModalDescripcion" rows="3" required></textarea></div>
            ${esVerificacion ? `<div class="form-row">
                <div class="form-group"><label for="calidadModalTipo">Tipo</label><select id="calidadModalTipo">${opcionesTipo}</select></div>
                <div class="form-group"><label for="calidadModalResultado">Resultado</label><select id="calidadModalResultado">${opcionesResultado}</select></div>
            </div>` : ''}
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="cerrarModalGeneric()">Cancelar</button>
            <button type="button" class="btn btn-primary" onclick="guardarRegistroCalidad('${tipo}')">Guardar</button>
        </div>
    </div>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modal}</div>`;
    if (typeof window.abrirModalAccesible === 'function') window.abrirModalAccesible(document.getElementById('genericModal'));
}

function guardarRegistroCalidad(tipo) {
    if (!puedeEditarCalidad() || typeof proyecto === 'undefined' || !proyecto) return;
    const calidad = inicializarCalidad(proyecto);
    const descripcion = (document.getElementById('calidadModalDescripcion') || {}).value?.trim();
    if (!descripcion) {
        mostrarToast('La descripción es obligatoria', 'error');
        return;
    }
    const fecha = new Date().toISOString().slice(0, 10);
    if (tipo === 'verificacion') {
        const registro = {
            id: Date.now(),
            codigo: 'VER-' + String(calidad.verificaciones.length + 1).padStart(3, '0'),
            tipo: document.getElementById('calidadModalTipo').value,
            descripcion,
            resultado: document.getElementById('calidadModalResultado').value,
            fecha,
            evidencia: ''
        };
        calidad.verificaciones.push(registro);
        if (typeof registrarBitacora === 'function') registrarBitacora('calidad', registro.id, 'crear', null, clonarParaBitacora(registro));
    } else {
        registrarNoConformidad(proyecto, { descripcion, fecha, origen: 'Directa' });
    }
    guardarProyecto();
    cerrarModalGeneric();
    renderizarCalidad();
    mostrarToast('Registro de calidad guardado', 'success');
}

function abrirModalAccionCalidad(id) {
    if (!puedeEditarCalidad() || typeof proyecto === 'undefined' || !proyecto) return;
    const nc = inicializarCalidad(proyecto).noConformidades.find(n => String(n.id) === String(id));
    if (!nc) return;
    const modal = `<div class="modal-content modal-600">
        <div class="modal-header"><h3>Acción correctiva · ${escCalidad(nc.codigo || nc.id)}</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
        <div class="modal-body">
            <div class="form-group"><label for="accionCalidadDescripcion">Acción</label><textarea id="accionCalidadDescripcion" rows="2" required></textarea></div>
            <div class="form-row">
                <div class="form-group"><label for="accionCalidadEstado">Estado</label><select id="accionCalidadEstado">${ESTADOS_ACCION_CALIDAD.map(e => `<option value="${e}">${e}</option>`).join('')}</select></div>
                <div class="form-group"><label for="accionCalidadEvidencia">Evidencia</label><input type="text" id="accionCalidadEvidencia" placeholder="Acta, revisión o informe"></div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="cerrarModalGeneric()">Cancelar</button>
            <button type="button" class="btn btn-primary" onclick="guardarAccionCalidad('${escCalidad(nc.id)}')">Guardar</button>
        </div>
    </div>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modal}</div>`;
    if (typeof window.abrirModalAccesible === 'function') window.abrirModalAccesible(document.getElementById('genericModal'));
}

function guardarAccionCalidad(id) {
    if (!puedeEditarCalidad() || typeof proyecto === 'undefined' || !proyecto) return;
    const calidad = inicializarCalidad(proyecto);
    const descripcion = (document.getElementById('accionCalidadDescripcion') || {}).value?.trim();
    if (!descripcion) {
        mostrarToast('La acción es obligatoria', 'error');
        return;
    }
    const registro = {
        id: Date.now(),
        codigo: 'AC-' + String(calidad.accionesCorrectivas.length + 1).padStart(3, '0'),
        noConformidadId: id,
        descripcion,
        estado: document.getElementById('accionCalidadEstado').value,
        evidencia: document.getElementById('accionCalidadEvidencia').value.trim(),
        fecha: new Date().toISOString().slice(0, 10)
    };
    calidad.accionesCorrectivas.push(registro);
    if (typeof registrarBitacora === 'function') registrarBitacora('calidad', registro.id, 'crear', null, clonarParaBitacora(registro));
    guardarProyecto();
    cerrarModalGeneric();
    renderizarCalidad();
    mostrarToast('Acción correctiva registrada', 'success');
}

function cerrarNoConformidad(id) {
    if (!puedeEditarCalidad() || typeof proyecto === 'undefined' || !proyecto) return;
    const calidad = inicializarCalidad(proyecto);
    const nc = calidad.noConformidades.find(n => String(n.id) === String(id));
    if (!nc) return;
    if (!puedeCerrarNoConformidad(nc, calidad.accionesCorrectivas)) {
        mostrarToast('Requiere una acción correctiva completada con evidencia', 'warning');
        return;
    }
    const antes = clonarParaBitacora(nc);
    nc.estado = 'Cerrada';
    nc.fechaCierre = new Date().toISOString().slice(0, 10);
    if (typeof registrarBitacora === 'function') registrarBitacora('calidad', nc.id, 'cerrar', antes, clonarParaBitacora(nc));
    guardarProyecto();
    renderizarCalidad();
    mostrarToast('No conformidad cerrada con evidencia', 'success');
}

function guardarPlanCalidad() {
    if (!puedeEditarCalidad() || typeof proyecto === 'undefined' || !proyecto) return;
    const calidad = inicializarCalidad(proyecto);
    const antes = clonarParaBitacora(calidad.plan);
    calidad.plan.objetivos = document.getElementById('calidadObjetivos').value.trim();
    calidad.plan.responsable = document.getElementById('calidadResponsable').value.trim();
    calidad.plan.estandares = document.getElementById('calidadEstandares').value.split('\n').map(x => x.trim()).filter(Boolean);
    calidad.plan.fechaRevision = document.getElementById('calidadFechaRevision').value || null;
    if (typeof registrarBitacora === 'function') registrarBitacora('calidad', 'plan', 'actualizar', antes, clonarParaBitacora(calidad.plan));
    guardarProyecto();
    renderizarCalidad();
    mostrarToast('Plan de calidad actualizado', 'success');
}

function renderizarPlanCalidad() {
    const calidad = typeof proyecto !== 'undefined' && proyecto ? inicializarCalidad(proyecto) : null;
    if (!calidad) return;
    const set = (id, valor) => { const el = document.getElementById(id); if (el) el.value = valor || ''; };
    set('calidadObjetivos', calidad.plan.objetivos);
    set('calidadResponsable', calidad.plan.responsable);
    set('calidadEstandares', (calidad.plan.estandares || []).join('\n'));
    set('calidadFechaRevision', calidad.plan.fechaRevision);
}

/** Puerta de entrada desde «Salud»: sustituye el contador global suelto. */
function registrarDefectoComoNoConformidad(cantidad, descripcion) {
    if (!puedeEditarCalidad() || typeof proyecto === 'undefined' || !proyecto) return null;
    const total = Math.max(1, parseInt(cantidad, 10) || 1);
    const texto = String(descripcion || '').trim()
        || `${total} defecto(s) detectado(s) desde el cuadro de mando de salud`;
    const registro = registrarNoConformidad(proyecto, {
        descripcion: texto,
        origen: 'salud',
        cantidad: total
    });
    if (!registro) return null;
    guardarProyecto();
    renderizarCalidad();
    if (typeof actualizarPanelSalud === 'function') actualizarPanelSalud();
    mostrarToast(`${registro.codigo} registrada: ${total} defecto(s) con seguimiento de calidad`, 'success');
    return registro;
}

window.inicializarCalidadPanel = inicializarCalidadPanel;
window.renderizarCalidad = renderizarCalidad;
window.abrirModalCalidad = abrirModalCalidad;
window.guardarRegistroCalidad = guardarRegistroCalidad;
window.abrirModalAccionCalidad = abrirModalAccionCalidad;
window.guardarAccionCalidad = guardarAccionCalidad;
window.cerrarNoConformidad = cerrarNoConformidad;
window.guardarPlanCalidad = guardarPlanCalidad;
window.renderizarPlanCalidad = renderizarPlanCalidad;
window.registrarDefectoComoNoConformidad = registrarDefectoComoNoConformidad;
