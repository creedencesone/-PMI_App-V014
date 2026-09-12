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

function organigramaNodoHtml(n, nivel) {
    const st = (proyecto.stakeholders || []).find(s => s.id === n.stakeholderId);
    const vinculado = !!st;
    const nombre = vinculado ? st.nombre : n.nombre;
    const puesto = vinculado ? (st.puesto || n.puesto) : n.puesto;
    const email = vinculado ? (st.email || n.email) : n.email;
    let html = '<div class="organigrama-nodo" data-org-id="' + n.id + '" data-nivel="' + (nivel || 0) + '">';
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

function organigramaZoomPct() {
    let z = 100;
    if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('organigrama_zoom');
        if (raw !== null) z = parseInt(raw, 10);
    }
    if (isNaN(z)) z = 100;
    z = Math.max(30, Math.min(200, z));
    return Math.round(z / 10) * 10;
}

function organigramaEstiloActual() {
    let estilo = 'tarjetas';
    if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('organigrama_estilo');
        if (raw === 'compacto' || raw === 'tarjetas') estilo = raw;
    }
    return estilo;
}

function organigramaToolbarHtml() {
    const estilo = organigramaEstiloActual();
    const zoom = organigramaZoomPct();
    return '<div class="organigrama-toolbar">'
        + '<span class="pm-style-toggle">'
        + '<button type="button" class="pm-style-opt' + (estilo === 'tarjetas' ? ' active' : '') + '" data-estilo="tarjetas">' + tApp('organigrama_estilo_tarjetas') + '</button>'
        + '<button type="button" class="pm-style-opt' + (estilo === 'compacto' ? ' active' : '') + '" data-estilo="compacto">' + tApp('organigrama_estilo_compacto') + '</button>'
        + '</span>'
        + '<span class="organigrama-zoom">'
        + '<button type="button" class="organigrama-zoom-btn" data-zoom="-1" title="' + tApp('organigrama_zoom_out') + '">−</button>'
        + '<span class="organigrama-zoom-pct">' + zoom + '%</span>'
        + '<button type="button" class="organigrama-zoom-btn" data-zoom="1" title="' + tApp('organigrama_zoom_in') + '">+</button>'
        + '<button type="button" class="organigrama-zoom-btn" data-zoom="0" title="' + tApp('organigrama_zoom_reset') + '">⟲</button>'
        + '</span>'
        + '</div>';
}

function organigramaAplicarZoom(contenedor) {
    const arbol = contenedor.querySelector('.organigrama-arbol');
    const inner = arbol ? arbol.querySelector('.organigrama-arbol-inner') : null;
    if (!inner) return;
    const zoom = organigramaZoomPct() / 100;
    inner.style.zoom = zoom;
    const pct = contenedor.querySelector('.organigrama-zoom-pct');
    if (pct) pct.textContent = Math.round(zoom * 100) + '%';
    organigramaDibujarConectores(contenedor);
}

function organigramaAplicarEstilo(contenedor) {
    const arbol = contenedor.querySelector('.organigrama-arbol');
    if (!arbol) return;
    const estilo = organigramaEstiloActual();
    arbol.classList.toggle('organigrama-estilo-compacto', estilo === 'compacto');
    contenedor.querySelectorAll('.pm-style-opt').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-estilo') === estilo);
    });
    if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => organigramaDibujarConectores(contenedor));
    } else {
        organigramaDibujarConectores(contenedor);
    }
}

function organigramaVincularToolbar(contenedor) {
    contenedor.querySelectorAll('.organigrama-zoom-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const delta = parseInt(btn.getAttribute('data-zoom'), 10);
            let z = organigramaZoomPct();
            if (delta === 0) z = 100;
            else z = Math.max(30, Math.min(200, z + delta * 10));
            if (typeof localStorage !== 'undefined') localStorage.setItem('organigrama_zoom', String(z));
            organigramaAplicarZoom(contenedor);
        });
    });
    contenedor.querySelectorAll('.pm-style-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            const estilo = btn.getAttribute('data-estilo');
            if (typeof localStorage !== 'undefined') localStorage.setItem('organigrama_estilo', estilo);
            organigramaAplicarEstilo(contenedor);
        });
    });
}

function renderizarOrganigrama() {
    const contenedor = document.getElementById('organigramaContent');
    if (!contenedor) return;
    const nodos = (proyecto && proyecto.organigrama) || [];
    if (!nodos.length) {
        contenedor.innerHTML = '<div class="info-card"><div class="u-text-center" style="padding:24px">' + tApp('organigrama_vacio') + '</div></div>';
        return;
    }
    const porId = {};
    nodos.forEach(n => { porId[n.id] = n; });
    const hijosDe = (padreId) => nodos.filter(n => n.hijoDe === padreId);
    const raices = nodos.filter(n => n.hijoDe === null || n.hijoDe === undefined || !porId[n.hijoDe]);
    const vistos = new Set();
    const subarbolHtml = (padreId, nivel) => {
        const hijos = hijosDe(padreId);
        let html = '<div class="organigrama-subarbol">';
        if (padreId !== null && padreId !== undefined) {
            html += organigramaNodoHtml(porId[padreId], nivel);
        }
        if (hijos.length) {
            html += '<div class="organigrama-hijos">';
            hijos.forEach(h => {
                if (vistos.has(h.id)) return;
                vistos.add(h.id);
                html += subarbolHtml(h.id, nivel + 1);
            });
            html += '</div>';
        }
        html += '</div>';
        return html;
    };
    const estilo = organigramaEstiloActual();
    let html = organigramaToolbarHtml();
    html += '<div class="organigrama-arbol' + (estilo === 'compacto' ? ' organigrama-estilo-compacto' : '') + '"><div class="organigrama-arbol-inner">';
    raices.forEach(r => {
        if (vistos.has(r.id)) return;
        vistos.add(r.id);
        html += subarbolHtml(r.id, 0);
    });
    html += '</div></div>';
    contenedor.innerHTML = html;
    organigramaAplicarZoom(contenedor);
    organigramaVincularToolbar(contenedor);
    organigramaVincularResize(contenedor);
    if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => organigramaDibujarConectores(contenedor));
    }
    if (typeof document !== 'undefined' && document.fonts && typeof document.fonts.ready === 'object') {
        document.fonts.ready.then(() => organigramaDibujarConectores(contenedor));
    }
}

function organigramaDibujarConectores(contenedor) {
    const arbol = contenedor.querySelector('.organigrama-arbol');
    const inner = arbol ? arbol.querySelector('.organigrama-arbol-inner') : null;
    if (!inner) return;
    const zoom = organigramaZoomPct() / 100;
    const innerRect = inner.getBoundingClientRect();
    const ancho = innerRect.width / zoom;
    const alto = innerRect.height / zoom;
    let svg = inner.querySelector('.organigrama-conectores');
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'organigrama-conectores');
        inner.insertBefore(svg, inner.firstChild);
    }
    svg.setAttribute('width', ancho);
    svg.setAttribute('height', alto);
    svg.innerHTML = '';
    const porNodo = {};
    inner.querySelectorAll('.organigrama-nodo').forEach(nodo => {
        porNodo[nodo.getAttribute('data-org-id')] = nodo;
    });
    const nodosData = (proyecto && proyecto.organigrama) || [];
    const porId = {};
    nodosData.forEach(n => { porId[n.id] = n; });
    const hijosDe = (padreId) => nodosData.filter(n => n.hijoDe === padreId);
    const crear = (d) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', 'organigrama-conector');
        svg.appendChild(path);
    };
    const vistos = new Set();
    const dibujar = (padreId) => {
        const hijos = hijosDe(padreId).filter(h => porNodo[h.id]);
        if (!hijos.length) return;
        const padreEl = porNodo[padreId];
        const padreRect = padreEl ? padreEl.getBoundingClientRect() : null;
        const hijosRects = hijos.map(h => porNodo[h.id].getBoundingClientRect());
        const xPadre = padreRect ? (padreRect.left + padreRect.width / 2 - innerRect.left) / zoom : (hijosRects[0].left + hijosRects[0].width / 2 - innerRect.left) / zoom;
        const yPadre = padreRect ? (padreRect.bottom - innerRect.top) / zoom : 0;
        const yHijos = (hijosRects[0].top - innerRect.top) / zoom;
        const xIzq = (hijosRects[0].left + hijosRects[0].width / 2 - innerRect.left) / zoom;
        const xDer = (hijosRects[hijosRects.length - 1].left + hijosRects[hijosRects.length - 1].width / 2 - innerRect.left) / zoom;
        if (hijos.length === 1) {
            crear('M ' + xPadre + ' ' + yPadre + ' L ' + xIzq + ' ' + yHijos);
        } else {
            const yBus = (yPadre + yHijos) / 2;
            crear('M ' + xPadre + ' ' + yPadre + ' L ' + xPadre + ' ' + yBus + ' L ' + xIzq + ' ' + yBus + ' L ' + xDer + ' ' + yBus);
            hijosRects.forEach(r => {
                const x = (r.left + r.width / 2 - innerRect.left) / zoom;
                crear('M ' + x + ' ' + yBus + ' L ' + x + ' ' + yHijos);
            });
        }
        hijos.forEach(h => {
            if (vistos.has(h.id)) return;
            vistos.add(h.id);
            dibujar(h.id);
        });
    };
    nodosData.forEach(n => {
        if (n.hijoDe === null || n.hijoDe === undefined || !porId[n.hijoDe]) {
            if (vistos.has(n.id)) return;
            vistos.add(n.id);
            dibujar(n.id);
        }
    });
}

function organigramaVincularResize(contenedor) {
    if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
    if (contenedor.__orgResizeVinculado) return;
    contenedor.__orgResizeVinculado = true;
    let timer = null;
    window.addEventListener('resize', () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            const c = document.getElementById('organigramaContent');
            if (c && c.querySelector('.organigrama-arbol')) organigramaDibujarConectores(c);
        }, 150);
    });
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