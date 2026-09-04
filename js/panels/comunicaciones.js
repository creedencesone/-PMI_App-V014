        function renderizarComunicaciones() {
            const tbody = document.getElementById('comunicacionesBody');
            if (!proyecto.comunicaciones) proyecto.comunicaciones = [];
            if (proyecto.comunicaciones.length === 0) { tbody.innerHTML = '<tr><td colspan="7">No hay comunicaciones</td></tr>'; return; }
            tbody.innerHTML = proyecto.comunicaciones.map(c => `<tr><td>${c.fecha || '-'}</td><td><span class="badge-pais">${c.tipo || '-'}</span></td><td>${escapeHtml(c.con || '')}</td><td><strong>${escapeHtml(c.asunto || '')}</strong></td><td>${escapeHtml((c.contenido || '').substring(0, 100))}${(c.contenido || '').length > 100 ? '...' : ''}</td><td>${c.archivoNombre ? `<span class="edit-btn" onclick="descargarArchivoComunicacion(${c.id})"> ${escapeHtml(c.archivoNombre)}</span>` : '-'}</td><td><span class="edit-btn" onclick="editarComunicacion(${c.id})"></span><span class="delete-btn" onclick="eliminarComunicacion(${c.id})"></span></td></tr>`).join('');
        }
        
        function abrirModalNuevaComunicacion() {
            const tipos = ['Email', 'Llamada', 'WhatsApp', 'Reunión', 'Carta', 'Otro'];
            const modalHtml = `<div class="modal-content modal-500"><div class="modal-header"><h3> Nueva Comunicación</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="comId"><div class="form-group"><label>Fecha</label><input type="date" id="comFecha" value="${new Date().toISOString().split('T')[0]}"></div>
                <div class="form-group"><label>Tipo</label><select id="comTipo">${tipos.map(t => `<option value="${t}">${t}</option>`).join('')}</select></div>
                <div class="form-group"><label>Con</label><input type="text" id="comCon"></div>
                <div class="form-group"><label>Asunto</label><input type="text" id="comAsunto"></div>
                <div class="form-group"><label>Contenido</label><textarea rows="3" id="comContenido"></textarea></div>
                <div class="form-group"><label>Archivo</label><input type="file" id="comArchivo" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png"></div>
                <button class="btn btn-primary" onclick="guardarComunicacion()">Guardar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        async function guardarComunicacion() {
            let id = document.getElementById('comId').value;
            let asunto = document.getElementById('comAsunto').value;
            if (!asunto) { mostrarToast(tApp('toast_asunto_obligatorio'), 'error'); return; }
            let archivoBase64 = null, archivoNombre = null;
            const archivoInput = document.getElementById('comArchivo');
            if (archivoInput.files.length > 0) { archivoNombre = archivoInput.files[0].name; archivoBase64 = await leerArchivoComoBase64(archivoInput.files[0]); }
            let comunicacion = {
                id: id ? parseInt(id) : Date.now(), fecha: document.getElementById('comFecha').value, tipo: document.getElementById('comTipo').value,
                con: document.getElementById('comCon').value, asunto: asunto, contenido: document.getElementById('comContenido').value,
                archivo: archivoBase64, archivoNombre: archivoNombre
            };
            if (!proyecto.comunicaciones) proyecto.comunicaciones = [];
            if (id) { let idx = proyecto.comunicaciones.findIndex(c => c.id === parseInt(id)); if (idx >= 0) { if (!archivoBase64 && proyecto.comunicaciones[idx].archivo) { comunicacion.archivo = proyecto.comunicaciones[idx].archivo; comunicacion.archivoNombre = proyecto.comunicaciones[idx].archivoNombre; } proyecto.comunicaciones[idx] = comunicacion; } }
            else { proyecto.comunicaciones.push(comunicacion); }
            guardarProyecto(); renderizarComunicaciones(); cerrarModalGeneric(); mostrarToast(` Comunicación guardada`, 'success');
        }
        
        function editarComunicacion(id) {
            let c = proyecto.comunicaciones.find(c => c.id === id);
            if (!c) return;
            const tipos = ['Email', 'Llamada', 'WhatsApp', 'Reunión', 'Carta', 'Otro'];
            const modalHtml = `<div class="modal-content modal-500"><div class="modal-header"><h3> Editar</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="comId" value="${c.id}"><div class="form-group"><label>Fecha</label><input type="date" id="comFecha" value="${c.fecha || ''}"></div>
                <div class="form-group"><label>Tipo</label><select id="comTipo">${tipos.map(t => `<option value="${t}" ${c.tipo === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
                <div class="form-group"><label>Con</label><input type="text" id="comCon" value="${escapeHtml(c.con || '')}"></div>
                <div class="form-group"><label>Asunto</label><input type="text" id="comAsunto" value="${escapeHtml(c.asunto || '')}"></div>
                <div class="form-group"><label>Contenido</label><textarea rows="3" id="comContenido">${escapeHtml(c.contenido || '')}</textarea></div>
                <div class="form-group"><label>Archivo</label><input type="file" id="comArchivo" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png"><small>Dejar vacío para mantener actual</small></div>
                <button class="btn btn-primary" onclick="guardarComunicacion()">Actualizar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function eliminarComunicacion(id) {
            if (confirm(tApp('confirmar_eliminar'))) { proyecto.comunicaciones = proyecto.comunicaciones.filter(c => c.id !== id); guardarProyecto(); renderizarComunicaciones(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
        
        function descargarArchivoComunicacion(id) {
            let c = proyecto.comunicaciones.find(c => c.id === id);
            if (c && c.archivo && c.archivoNombre) { const link = document.createElement('a'); link.href = c.archivo; link.download = c.archivoNombre; link.click(); mostrarToast(` Descargando ${c.archivoNombre}`, 'success'); }
            else { mostrarToast(" No hay archivo", 'error'); }
        }
        
        function renderizarReuniones() {
            const container = document.getElementById('listaReuniones');
            if (!proyecto.reuniones) proyecto.reuniones = [];
            if (proyecto.reuniones.length === 0) { container.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><p>No hay reuniones registradas</p></div>'; return; }
            container.innerHTML = proyecto.reuniones.map(r => `<div class="reunion-card"><div class="reunion-titulo"><span> ${escapeHtml(r.titulo || 'Reunión')}</span><div><span class="edit-btn" onclick="editarReunion(${r.id})"></span><span class="delete-btn" onclick="eliminarReunion(${r.id})"></span></div></div><div class="reunion-fecha"> ${r.fecha ? formatearFechaEspa(r.fecha) : '-'}</div><div class="reunion-asistentes"> Asistentes: ${escapeHtml((r.asistentes || []).join(', ') || '-')}</div><div class="reunion-acuerdos"><strong>Acuerdos:</strong><br>${escapeHtml((r.acuerdos || '').substring(0, 150))}${(r.acuerdos || '').length > 150 ? '...' : ''}</div><div class="reunion-acciones"><strong>Acciones:</strong><br>${escapeHtml((r.acciones || '').substring(0, 150))}${(r.acciones || '').length > 150 ? '...' : ''}</div>${r.pdfNombre ? `<div class="reunion-pdf-actions"><button class="btn btn-secondary btn-small" onclick="abrirVisorPdf(${r.id})"> Ver PDF</button><button class="btn btn-secondary btn-small" onclick="descargarPdfReunion(${r.id})"> Descargar PDF</button></div>` : '<div class="reunion-pdf-actions"><span class="u-color-muted"> Sin acta PDF</span></div>'}</div>`).join('');
        }
        
        function abrirModalNuevaReunion() {
            const modalHtml = `<div class="modal-content modal-600"><div class="modal-header"><h3> Nueva Reunión</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="reunionId"><div class="form-group"><label>Título</label><input type="text" id="reunionTitulo"></div>
                <div class="form-group"><label>Fecha</label><input type="date" id="reunionFecha" value="${new Date().toISOString().split('T')[0]}"></div>
                <div class="form-group"><label>Asistentes</label><input type="text" id="reunionAsistentes" placeholder="Juan, María, etc"></div>
                <div class="form-group"><label>Orden del día</label><textarea rows="2" id="reunionOrdenDia"></textarea></div>
                <div class="form-group"><label>Acuerdos</label><textarea rows="3" id="reunionAcuerdos"></textarea></div>
                <div class="form-group"><label>Acciones</label><textarea rows="2" id="reunionAcciones"></textarea></div>
                <div class="form-group"><label>PDF</label><input type="file" id="reunionPdf" accept=".pdf"></div>
                <button class="btn btn-primary" onclick="guardarReunion()">Guardar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        async function guardarReunion() {
            let id = document.getElementById('reunionId').value;
            let titulo = document.getElementById('reunionTitulo').value.trim();
            if (!titulo) { mostrarToast(tApp('toast_titulo_obligatorio'), 'error'); return; }
            let asistentesStr = document.getElementById('reunionAsistentes').value;
            let asistentes = asistentesStr ? asistentesStr.split(',').map(a => a.trim()) : [];
            let pdfBase64 = null, pdfNombre = null;
            const pdfInput = document.getElementById('reunionPdf');
            if (pdfInput.files.length > 0 && pdfInput.files[0].type === 'application/pdf') { pdfNombre = pdfInput.files[0].name; pdfBase64 = await leerArchivoComoBase64(pdfInput.files[0]); }
            let reunion = {
                id: id ? parseInt(id) : Date.now(), fecha: document.getElementById('reunionFecha').value, titulo: titulo, asistentes: asistentes,
                ordenDia: document.getElementById('reunionOrdenDia').value, acuerdos: document.getElementById('reunionAcuerdos').value,
                acciones: document.getElementById('reunionAcciones').value, pdfBase64: pdfBase64, pdfNombre: pdfNombre
            };
            if (!proyecto.reuniones) proyecto.reuniones = [];
            if (id) { let idx = proyecto.reuniones.findIndex(r => r.id === parseInt(id)); if (idx >= 0) { if (!pdfBase64 && proyecto.reuniones[idx].pdfBase64) { reunion.pdfBase64 = proyecto.reuniones[idx].pdfBase64; reunion.pdfNombre = proyecto.reuniones[idx].pdfNombre; } proyecto.reuniones[idx] = reunion; } }
            else { proyecto.reuniones.push(reunion); }
            guardarProyecto(); renderizarReuniones(); cerrarModalGeneric(); mostrarToast(` Minuta guardada`, 'success');
        }
        
        function editarReunion(id) {
            let r = proyecto.reuniones.find(r => r.id === id);
            if (!r) return;
            const modalHtml = `<div class="modal-content modal-600"><div class="modal-header"><h3> Editar</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="reunionId" value="${r.id}"><div class="form-group"><label>Título</label><input type="text" id="reunionTitulo" value="${escapeHtml(r.titulo || '')}"></div>
                <div class="form-group"><label>Fecha</label><input type="date" id="reunionFecha" value="${r.fecha || ''}"></div>
                <div class="form-group"><label>Asistentes</label><input type="text" id="reunionAsistentes" value="${escapeHtml((r.asistentes || []).join(', '))}"></div>
                <div class="form-group"><label>Orden del día</label><textarea rows="2" id="reunionOrdenDia">${escapeHtml(r.ordenDia || '')}</textarea></div>
                <div class="form-group"><label>Acuerdos</label><textarea rows="3" id="reunionAcuerdos">${escapeHtml(r.acuerdos || '')}</textarea></div>
                <div class="form-group"><label>Acciones</label><textarea rows="2" id="reunionAcciones">${escapeHtml(r.acciones || '')}</textarea></div>
                <div class="form-group"><label>PDF</label><input type="file" id="reunionPdf" accept=".pdf"><small>Actual: ${r.pdfNombre || 'ninguno'}</small></div>
                <button class="btn btn-primary" onclick="guardarReunion()">Actualizar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function eliminarReunion(id) {
            if (confirm(tApp('confirmar_eliminar_minuta'))) { proyecto.reuniones = proyecto.reuniones.filter(r => r.id !== id); guardarProyecto(); renderizarReuniones(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
        
        function abrirVisorPdf(reunionId) {
            let r = proyecto.reuniones.find(r => r.id === reunionId);
            if (r && r.pdfBase64) { pdfActualBase64 = r.pdfBase64; pdfActualNombre = r.pdfNombre; document.getElementById('visorPdfTitulo').innerHTML = ` ${escapeHtml(r.titulo || 'Acta')} - ${r.pdfNombre || 'PDF'}`; document.getElementById('visorPdfFrame').src = r.pdfBase64; document.getElementById('visorPdfModal').style.display = 'flex'; }
            else { mostrarToast(tApp('toast_no_hay_pdf'), 'error'); }
        }
        
        function cerrarVisorPdf() { document.getElementById('visorPdfModal').style.display = 'none'; document.getElementById('visorPdfFrame').src = ''; pdfActualBase64 = null; pdfActualNombre = null; }
        function descargarPdfActual() { if (pdfActualBase64 && pdfActualNombre) { const link = document.createElement('a'); link.href = pdfActualBase64; link.download = pdfActualNombre; link.click(); mostrarToast(` Descargando ${pdfActualNombre}`, 'success'); } }
        function descargarPdfReunion(reunionId) { let r = proyecto.reuniones.find(r => r.id === reunionId); if (r && r.pdfBase64 && r.pdfNombre) { const link = document.createElement('a'); link.href = r.pdfBase64; link.download = r.pdfNombre; link.click(); mostrarToast(` Descargando ${r.pdfNombre}`, 'success'); } else { mostrarToast(tApp('toast_no_hay_pdf'), 'error'); } }
        
        function mostrarSubpanelComunicaciones(subpanel, btn) {
            document.querySelectorAll('.subpanel-comunicaciones').forEach(el => el.style.display = 'none');
            document.getElementById(`subpanel${subpanel.charAt(0).toUpperCase() + subpanel.slice(1)}`).style.display = 'block';
            document.querySelectorAll('.btn-tab').forEach(b => { b.style.color = 'rgba(255,255,255,0.7)'; b.style.borderBottom = 'none'; });
            btn.style.color = '#007AFF'; btn.style.borderBottom = '2px solid #007AFF';
            if (subpanel === 'reuniones') renderizarReuniones();
            if (subpanel === 'comunicaciones') renderizarComunicaciones();
        }
        
        // ============================================
        // CRONOGRAMA GANTT
        // ============================================