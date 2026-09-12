function organigramaCalcularNiveles(nodos) {
    const niveles = {};
    const porId = {};
    (nodos || []).forEach(n => { porId[n.id] = n; });
    const enProceso = new Set();
    const nivelDe = (id) => {
        if (id in niveles) return niveles[id];
        if (enProceso.has(id)) return 0;
        enProceso.add(id);
        const n = porId[id];
        let nivel = 0;
        if (n && n.hijoDe !== null && n.hijoDe !== undefined) {
            nivel = nivelDe(n.hijoDe) + 1;
        }
        enProceso.delete(id);
        niveles[id] = nivel;
        return nivel;
    };
    (nodos || []).forEach(n => { nivelDe(n.id); });
    return niveles;
}

function organigramaEsDescendiente(nodos, ancestroId, posibleDescId) {
    const porId = {};
    (nodos || []).forEach(n => { porId[n.id] = n; });
    const vistos = new Set();
    let actual = porId[posibleDescId];
    while (actual && actual.hijoDe !== null && actual.hijoDe !== undefined) {
        if (actual.hijoDe === ancestroId) return true;
        if (vistos.has(actual.id)) return false;
        vistos.add(actual.id);
        actual = porId[actual.hijoDe];
    }
    return false;
}

function organigramaValidarReparent(nodos, nodeId, nuevoPadreId) {
    if (nuevoPadreId === null || nuevoPadreId === undefined) return { ok: true };
    if (nuevoPadreId === nodeId) return { ok: false, error: 'self' };
    if (!(nodos || []).some(n => n.id === nodeId)) return { ok: false, error: 'notfound' };
    if (organigramaEsDescendiente(nodos, nodeId, nuevoPadreId)) return { ok: false, error: 'descendant' };
    return { ok: true };
}

function organigramaReparentarAlEliminar(nodos, nodeId) {
    const eliminado = (nodos || []).find(n => n.id === nodeId);
    const nuevoPadre = eliminado ? eliminado.hijoDe : null;
    return (nodos || []).filter(n => n.id !== nodeId).map(n => {
        if (n.hijoDe === nodeId) {
            return Object.assign({}, n, { hijoDe: nuevoPadre });
        }
        return n;
    });
}

function organigramaLimpiarStakeholder(nodos, stakeholderId) {
    let resultado = (nodos || []).slice();
    let objetivo = resultado.find(n => n.stakeholderId === stakeholderId);
    while (objetivo) {
        resultado = organigramaReparentarAlEliminar(resultado, objetivo.id);
        objetivo = resultado.find(n => n.stakeholderId === stakeholderId);
    }
    return resultado;
}

function organigramaRemapearStakeholder(nodos, viejoId, nuevoId) {
    return (nodos || []).map(n => {
        if (n.stakeholderId === viejoId) {
            return Object.assign({}, n, { stakeholderId: nuevoId });
        }
        return n;
    });
}

window.organigramaCalcularNiveles = organigramaCalcularNiveles;
window.organigramaEsDescendiente = organigramaEsDescendiente;
window.organigramaValidarReparent = organigramaValidarReparent;
window.organigramaReparentarAlEliminar = organigramaReparentarAlEliminar;
window.organigramaLimpiarStakeholder = organigramaLimpiarStakeholder;
window.organigramaRemapearStakeholder = organigramaRemapearStakeholder;

function organigramaIniciales(nombre) {
    const parts = (nombre || '').trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return (parts[0] || '?').substring(0, 2).toUpperCase();
}

function organigramaNombreVisible(n) {
    const st = (proyecto.stakeholders || []).find(s => s.id === n.stakeholderId);
    return st ? st.nombre : n.nombre;
}

function organigramaNodoHtml(n) {
    const st = (proyecto.stakeholders || []).find(s => s.id === n.stakeholderId);
    const vinculado = !!st;
    const nombre = vinculado ? st.nombre : n.nombre;
    const puesto = vinculado ? (st.puesto || n.puesto) : n.puesto;
    const email = vinculado ? (st.email || n.email) : n.email;
    let html = '<div class="organigrama-nodo" data-org-id="' + n.id + '">';
    html += '<div class="pm-avatar pm-avatar-interno organigrama-nodo-avatar">' + escapeHtml(organigramaIniciales(nombre)) + '</div>';
    html += '<div class="organigrama-nodo-nombre">' + escapeHtml(nombre || '') + '</div>';
    html += '<div class="organigrama-nodo-puesto">' + escapeHtml(puesto || '') + '</div>';
    html += '<div class="organigrama-nodo-email">' + escapeHtml(email || '') + '</div>';
    if (n.stakeholderId !== null && n.stakeholderId !== undefined && !vinculado) {
        html += '<span class="organigrama-sin-vinculo">' + tApp('organigrama_sin_vinculo') + '</span>';
    }
    html += '<div class="organigrama-nodo-acciones">';
    html += '<button class="btn btn-secondary btn-small" onclick="abrirModalOrganigrama(' + n.id + ')">' + tApp('organigrama_anyadir_subordinado') + '</button>';
    html += '<button class="edit-btn" onclick="editarNodoOrganigrama(' + n.id + ')">Editar</button>';
    html += '<button class="delete-btn" onclick="eliminarNodoOrganigrama(' + n.id + ')">Eliminar</button>';
    html += '</div></div>';
    return html;
}

function renderizarOrganigrama() {
    const contenedor = document.getElementById('organigramaContent');
    if (!contenedor) return;
    const nodos = (proyecto && proyecto.organigrama) || [];
    if (!nodos.length) {
        contenedor.innerHTML = '<div class="info-card"><div class="u-text-center" style="padding:24px">' + tApp('organigrama_vacio') + '</div></div>';
        return;
    }
    const niveles = organigramaCalcularNiveles(nodos);
    const maxNivel = nodos.reduce((m, n) => Math.max(m, niveles[n.id] || 0), 0);
    let html = '';
    for (let nivel = 0; nivel <= maxNivel; nivel++) {
        const nodosNivel = nodos.filter(n => (niveles[n.id] || 0) === nivel);
        if (!nodosNivel.length) continue;
        html += '<div class="organigrama-nivel">';
        html += '<div class="organigrama-nivel-titulo">' + tApp('organigrama_nivel') + ' ' + (nivel + 1) + '</div>';
        html += '<div class="organigrama-fila">';
        nodosNivel.forEach(n => { html += organigramaNodoHtml(n); });
        html += '</div></div>';
    }
    contenedor.innerHTML = html;
}

function organigramaResolverOrigen(origen, nombre, puesto, email) {
    if (origen.indexOf('stk:') === 0) {
        const id = parseInt(origen.substring(4), 10);
        const st = (proyecto.stakeholders || []).find(s => s.id === id);
        if (st) return { stakeholderId: id, nombre: st.nombre || '', puesto: st.puesto || '', email: st.email || '' };
        return { stakeholderId: null, nombre, puesto, email };
    }
    if (origen === 'nuevo') {
        if (!proyecto.stakeholders) proyecto.stakeholders = [];
        const nuevo = {
            id: Date.now(),
            nombre,
            puesto,
            email,
            empresa: '',
            rol: '',
            telefono: '',
            pais: '',
            tipo: 'interno',
            poder: 3,
            interes: 3,
            expectativas: ''
        };
        proyecto.stakeholders.push(nuevo);
        return { stakeholderId: nuevo.id, nombre, puesto, email };
    }
    return { stakeholderId: null, nombre, puesto, email };
}

function abrirModalOrganigrama(jefeId) {
    const jefe = (jefeId === null || jefeId === undefined) ? null : (proyecto.organigrama || []).find(n => n.id === jefeId);
    const nombreJefe = jefe ? organigramaNombreVisible(jefe) : 'Raíz';
    const opcionesStk = (proyecto.stakeholders || []).map(s => '<option value="stk:' + s.id + '">' + escapeHtml(s.nombre) + '</option>').join('');
    const modalHtml = '<div class="modal-content">'
        + '<div class="modal-header"><h3>' + tApp('organigrama_titulo') + '</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>'
        + '<input type="hidden" id="orgJefeId" value="' + (jefeId || '') + '">'
        + '<div class="form-group"><label>' + tApp('organigrama_origen') + '</label>'
        + '<select id="orgOrigen" onchange="onOrgOrigenChange()">'
        + '<option value="solo">' + tApp('organigrama_origen_solo') + '</option>'
        + '<option value="nuevo">' + tApp('organigrama_origen_nuevo') + '</option>'
        + opcionesStk
        + '</select></div>'
        + '<div class="form-group"><label>Nombre</label><input id="orgNombre"></div>'
        + '<div class="form-group"><label>Puesto</label><input id="orgPuesto"></div>'
        + '<div class="form-group"><label>Email</label><input id="orgEmail" type="email"></div>'
        + '<div class="form-group"><label>' + tApp('organigrama_jefe') + '</label><input type="text" value="' + escapeHtml(nombreJefe) + '" readonly></div>'
        + '<div class="u-action-row"><button class="btn btn-primary" onclick="guardarNodoOrganigrama()">Guardar</button>'
        + '<button class="btn btn-secondary" onclick="cerrarModalGeneric()">Cancelar</button></div>'
        + '</div>';
    const existing = document.getElementById('genericModal');
    if (existing) existing.remove();
    const modalDiv = document.createElement('div');
    modalDiv.id = 'genericModal';
    modalDiv.className = 'modal';
    modalDiv.style.display = 'flex';
    modalDiv.style.zIndex = '20000';
    modalDiv.innerHTML = modalHtml;
    document.body.appendChild(modalDiv);
    modalDiv.addEventListener('click', (e) => { if (e.target === modalDiv) cerrarModalGeneric(); });
    setTimeout(() => {
        const first = document.getElementById('orgNombre');
        if (first) first.focus();
    }, 50);
}

function onOrgOrigenChange() {
    const sel = document.getElementById('orgOrigen');
    const val = sel ? sel.value : 'solo';
    const nombre = document.getElementById('orgNombre');
    const puesto = document.getElementById('orgPuesto');
    const email = document.getElementById('orgEmail');
    if (!nombre || !puesto || !email) return;
    if (val.indexOf('stk:') === 0) {
        const id = parseInt(val.substring(4), 10);
        const st = (proyecto.stakeholders || []).find(s => s.id === id);
        if (st) {
            nombre.value = st.nombre || '';
            puesto.value = st.puesto || '';
            email.value = st.email || '';
        }
        nombre.disabled = true;
        puesto.disabled = true;
        email.disabled = true;
    } else {
        nombre.value = '';
        puesto.value = '';
        email.value = '';
        nombre.disabled = false;
        puesto.disabled = false;
        email.disabled = false;
    }
}

function guardarNodoOrganigrama() {
    let proyectoId = localStorage.getItem('proyectoSeleccionado');
    if (proyectoId && typeof DataService !== 'undefined' && typeof DataService.resolveId === 'function') {
        proyectoId = DataService.resolveId(proyectoId);
    }
    if (typeof AuthSystem !== 'undefined' && !AuthSystem.puedeEditarModulo(proyectoId, 'organigrama')) {
        mostrarToast('Sin permisos para editar', 'error');
        return;
    }
    const nombre = (document.getElementById('orgNombre')?.value || '').trim();
    if (!nombre) { mostrarToast('El nombre es obligatorio', 'error'); return; }
    const puesto = (document.getElementById('orgPuesto')?.value || '').trim();
    const email = (document.getElementById('orgEmail')?.value || '').trim();
    const origen = document.getElementById('orgOrigen')?.value || 'solo';
    const jefeRaw = document.getElementById('orgJefeId')?.value || '';
    const jefeId = jefeRaw === '' ? null : parseInt(jefeRaw, 10);
    const resuelto = organigramaResolverOrigen(origen, nombre, puesto, email);
    if (!proyecto.organigrama) proyecto.organigrama = [];
    proyecto.organigrama.push({
        id: Date.now(),
        stakeholderId: resuelto.stakeholderId,
        nombre: resuelto.nombre,
        puesto: resuelto.puesto,
        email: resuelto.email,
        hijoDe: jefeId
    });
    guardarProyecto();
    renderizarOrganigrama();
    cerrarModalGeneric();
    mostrarToast('Nodo añadido', 'success');
}

function editarNodoOrganigrama(id) {
    const nodo = (proyecto.organigrama || []).find(n => n.id === id);
    if (!nodo) return;
    const st = (proyecto.stakeholders || []).find(s => s.id === nodo.stakeholderId);
    const nombre = st ? st.nombre : (nodo.nombre || '');
    const puesto = st ? (st.puesto || nodo.puesto || '') : (nodo.puesto || '');
    const email = st ? (st.email || nodo.email || '') : (nodo.email || '');
    const origenActual = st ? 'stk:' + st.id : 'solo';
    const opcionesJefe = ['<option value="">— Raíz —</option>'];
    (proyecto.organigrama || []).forEach(n => {
        if (organigramaValidarReparent(proyecto.organigrama, id, n.id).ok) {
            opcionesJefe.push('<option value="' + n.id + '"' + (nodo.hijoDe === n.id ? ' selected' : '') + '>' + escapeHtml(organigramaNombreVisible(n)) + '</option>');
        }
    });
    const opcionesStk = (proyecto.stakeholders || []).map(s => '<option value="stk:' + s.id + '"' + (origenActual === 'stk:' + s.id ? ' selected' : '') + '>' + escapeHtml(s.nombre) + '</option>').join('');
    const modalHtml = '<div class="modal-content">'
        + '<div class="modal-header"><h3>' + tApp('organigrama_titulo') + '</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>'
        + '<div class="form-group"><label>' + tApp('organigrama_jefe') + '</label>'
        + '<select id="orgJefe">' + opcionesJefe.join('') + '</select></div>'
        + '<div class="form-group"><label>' + tApp('organigrama_origen') + '</label>'
        + '<select id="orgOrigen" onchange="onOrgOrigenChange()">'
        + '<option value="solo"' + (origenActual === 'solo' ? ' selected' : '') + '>' + tApp('organigrama_origen_solo') + '</option>'
        + '<option value="nuevo"' + (origenActual === 'nuevo' ? ' selected' : '') + '>' + tApp('organigrama_origen_nuevo') + '</option>'
        + opcionesStk
        + '</select></div>'
        + '<div class="form-group"><label>Nombre</label><input id="orgNombre" value="' + escapeHtml(nombre) + '"></div>'
        + '<div class="form-group"><label>Puesto</label><input id="orgPuesto" value="' + escapeHtml(puesto) + '"></div>'
        + '<div class="form-group"><label>Email</label><input id="orgEmail" type="email" value="' + escapeHtml(email) + '"></div>'
        + '<div class="u-action-row"><button class="btn btn-primary" onclick="actualizarNodoOrganigrama(' + id + ')">Guardar</button>'
        + '<button class="btn btn-secondary" onclick="cerrarModalGeneric()">Cancelar</button></div>'
        + '</div>';
    const existing = document.getElementById('genericModal');
    if (existing) existing.remove();
    const modalDiv = document.createElement('div');
    modalDiv.id = 'genericModal';
    modalDiv.className = 'modal';
    modalDiv.style.display = 'flex';
    modalDiv.style.zIndex = '20000';
    modalDiv.innerHTML = modalHtml;
    document.body.appendChild(modalDiv);
    modalDiv.addEventListener('click', (e) => { if (e.target === modalDiv) cerrarModalGeneric(); });
    const vinculado = origenActual.indexOf('stk:') === 0;
    ['orgNombre', 'orgPuesto', 'orgEmail'].forEach(idEl => {
        const el = document.getElementById(idEl);
        if (el) el.disabled = vinculado;
    });
    setTimeout(() => {
        const first = document.getElementById('orgNombre');
        if (first) first.focus();
    }, 50);
}

function actualizarNodoOrganigrama(id) {
    let proyectoId = localStorage.getItem('proyectoSeleccionado');
    if (proyectoId && typeof DataService !== 'undefined' && typeof DataService.resolveId === 'function') {
        proyectoId = DataService.resolveId(proyectoId);
    }
    if (typeof AuthSystem !== 'undefined' && !AuthSystem.puedeEditarModulo(proyectoId, 'organigrama')) {
        mostrarToast('Sin permisos para editar', 'error');
        return;
    }
    const nodo = (proyecto.organigrama || []).find(n => n.id === id);
    if (!nodo) return;
    const jefeRaw = document.getElementById('orgJefe')?.value || '';
    const jefeId = jefeRaw === '' ? null : parseInt(jefeRaw, 10);
    const valido = organigramaValidarReparent(proyecto.organigrama, id, jefeId);
    if (!valido.ok) { mostrarToast('Movimiento no válido', 'error'); return; }
    const nombre = (document.getElementById('orgNombre')?.value || '').trim();
    if (!nombre) { mostrarToast('El nombre es obligatorio', 'error'); return; }
    const puesto = (document.getElementById('orgPuesto')?.value || '').trim();
    const email = (document.getElementById('orgEmail')?.value || '').trim();
    const origen = document.getElementById('orgOrigen')?.value || 'solo';
    const resuelto = organigramaResolverOrigen(origen, nombre, puesto, email);
    nodo.stakeholderId = resuelto.stakeholderId;
    nodo.nombre = resuelto.nombre;
    nodo.puesto = resuelto.puesto;
    nodo.email = resuelto.email;
    nodo.hijoDe = jefeId;
    guardarProyecto();
    renderizarOrganigrama();
    cerrarModalGeneric();
    mostrarToast('Nodo actualizado', 'success');
}

function eliminarNodoOrganigrama(id) {
    let proyectoId = localStorage.getItem('proyectoSeleccionado');
    if (proyectoId && typeof DataService !== 'undefined' && typeof DataService.resolveId === 'function') {
        proyectoId = DataService.resolveId(proyectoId);
    }
    if (typeof AuthSystem !== 'undefined' && !AuthSystem.puedeEditarModulo(proyectoId, 'organigrama')) {
        mostrarToast('Sin permisos para editar', 'error');
        return;
    }
    if (!confirm(tApp('organigrama_confirmar_eliminar'))) return;
    proyecto.organigrama = organigramaReparentarAlEliminar(proyecto.organigrama, id);
    guardarProyecto();
    renderizarOrganigrama();
    mostrarToast(tApp('organigrama_reparentado'), 'success');
}