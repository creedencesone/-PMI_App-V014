        // ============================================
        // EQUIPO
        // ============================================
        function renderizarEquipo() {
            const tbody = document.getElementById('equipoBody');
            if (!proyecto.equipo) proyecto.equipo = [];
            if (proyecto.equipo.length === 0) { tbody.innerHTML = '<tr><td colspan="9">No hay personal</td></tr>'; return; }
            tbody.innerHTML = proyecto.equipo.map(r => `<tr><td>${r.foto ? `<img class="team-avatar" src="${escapeHtml(r.foto)}">` : '<span class="team-avatar team-avatar--placeholder">' + (r.nombre.charAt(0).toUpperCase()) + '</span>'}</td><td>${escapeHtml(r.nombre)}</td><td>${escapeHtml(r.rol || '')}</td><td>${escapeHtml(r.email || '')}</td><td>${escapeHtml(r.telefono || '')}</td><td>${r.costeHora}</td><td>${r.moneda}</td><td>${r.horasMes}</td><td><span class="edit-btn" onclick="editarEquipo(${r.id})"></span><span class="delete-btn" onclick="eliminarEquipo(${r.id})"></span></td></tr>`).join('');
            calcularCashflow();
        }

        function previsualizarFoto(inputId, previewId) {
            const file = document.getElementById(inputId).files[0];
            if (!file) return;
            leerArchivoComoBase64(file).then(dataUrl => {
                const img = document.getElementById(previewId);
                img.src = dataUrl;
                img.style.display = 'block';
                document.getElementById('eqFotoData').value = dataUrl;
            });
        }

        function abrirModalEquipo() {
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Nuevo Miembro</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="eqId"><div class="form-group"><label>Nombre</label><input type="text" id="eqNombre"></div>
                <div class="form-group"><label>Rol</label><input type="text" id="eqRol"></div>
                <div class="form-group"><label>Email</label><input type="email" id="eqEmail"></div>
                <div class="form-group"><label>Teléfono</label><input type="tel" id="eqTelefono"></div>
                <div class="form-group"><label>Foto</label><input type="file" id="eqFoto" accept="image/*" onchange="previsualizarFoto('eqFoto', 'eqFotoPreview')">
                    <img id="eqFotoPreview" class="team-avatar-preview" style="display:none;margin-top:8px;border-radius:50%;width:64px;height:64px;object-fit:cover"></div>
                <input type="hidden" id="eqFotoData">
                <div class="form-row"><div class="form-group"><label>Coste/h</label><input type="number" id="eqCosteHora" value="50"></div>
                <div class="form-group"><label>Moneda</label><select id="eqMoneda">${Object.keys(MONEDAS).map(m => `<option value="${m}">${m}</option>`).join('')}</select></div>
                <div class="form-group"><label>Horas/mes</label><input type="number" id="eqHorasMes" value="160"></div></div>
                <button class="btn btn-primary" onclick="guardarEquipo()">Guardar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }

        function guardarEquipo() {
            let nombre = document.getElementById('eqNombre').value.trim();
            if (!nombre) { mostrarToast(tApp('toast_nombre_obligatorio'), 'error'); return; }
            let id = document.getElementById('eqId').value;
            let fotoData = document.getElementById('eqFotoData').value;
            if (!fotoData) {
                const preview = document.getElementById('eqFotoPreview');
                if (preview && preview.src && preview.src.startsWith('data:')) fotoData = preview.src;
            }
            let miembro = {
                id: id ? parseInt(id) : Date.now(), nombre: nombre, rol: document.getElementById('eqRol').value, email: document.getElementById('eqEmail').value,
                telefono: document.getElementById('eqTelefono').value,
                foto: fotoData || null,
                costeHora: parseFloat(document.getElementById('eqCosteHora').value), moneda: document.getElementById('eqMoneda').value,
                horasMes: parseFloat(document.getElementById('eqHorasMes').value)
            };
            if (id) { let idx = proyecto.equipo.findIndex(m => m.id === parseInt(id)); if (idx >= 0) {
                const previo = proyecto.equipo[idx];
                const cambiaPrecio = previo.costeHora !== miembro.costeHora || previo.moneda !== miembro.moneda;
                proyecto.equipo[idx] = miembro;
                if (cambiaPrecio) {
                    (proyecto.elementosGantt || []).forEach(e => {
                        if (e.recursoAsignado && e.recursoAsignado.id === miembro.id) {
                            e.recursoAsignado.costeHora = miembro.costeHora;
                            e.recursoAsignado.moneda = miembro.moneda;
                            if (e.tipo && e.tipo !== 'edt' && e.tipo !== 'hito') {
                                const hTot = e.tipoDuracion === 'horas' ? (e.duracionHoras || e.duracion * (e.horasDia || 8)) : e.duracion * (e.horasDia || 8);
                                e.costeEstimado = hTot * miembro.costeHora;
                            }
                        }
                    });
                    (proyecto.scrum?.historias || []).forEach(h => {
                        if (h.recursoAsignado && h.recursoAsignado.id === miembro.id) {
                            h.recursoAsignado.costeHora = miembro.costeHora;
                            h.recursoAsignado.moneda = miembro.moneda;
                            h.costeEstimado = (h.diasEstimados || 5) * (h.horasPorDia || 8) * miembro.costeHora;
                        }
                    });
                    if (proyecto.scrum?.sprintActivo && typeof recalcularCostesSprint === 'function') recalcularCostesSprint(proyecto.scrum.sprintActivo.id);
                }
            } }
            else { if (!proyecto.equipo) proyecto.equipo = []; proyecto.equipo.push(miembro); }
            guardarProyecto(); renderizarEquipo(); renderizarCronograma(); renderizarSprintBacklog(); cerrarModalGeneric(); mostrarToast(` Miembro guardado`, 'success');
        }

        function editarEquipo(id) {
            let m = proyecto.equipo.find(m => m.id === id);
            if (!m) return;
            const fotoPreviewStyle = m.foto ? '' : 'display:none';
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Editar</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="eqId" value="${m.id}"><div class="form-group"><label>Nombre</label><input type="text" id="eqNombre" value="${escapeHtml(m.nombre)}"></div>
                <div class="form-group"><label>Rol</label><input type="text" id="eqRol" value="${escapeHtml(m.rol || '')}"></div>
                <div class="form-group"><label>Email</label><input type="email" id="eqEmail" value="${escapeHtml(m.email || '')}"></div>
                <div class="form-group"><label>Teléfono</label><input type="tel" id="eqTelefono" value="${escapeHtml(m.telefono || '')}"></div>
                <div class="form-group"><label>Foto</label><input type="file" id="eqFoto" accept="image/*" onchange="previsualizarFoto('eqFoto', 'eqFotoPreview')">
                    <img id="eqFotoPreview" class="team-avatar-preview" style="${fotoPreviewStyle};margin-top:8px;border-radius:50%;width:64px;height:64px;object-fit:cover" src="${m.foto || ''}"></div>
                <input type="hidden" id="eqFotoData" value="">
                <div class="form-row"><div class="form-group"><label>Coste/h</label><input type="number" id="eqCosteHora" value="${m.costeHora}"></div>
                <div class="form-group"><label>Moneda</label><select id="eqMoneda">${Object.keys(MONEDAS).map(c => `<option value="${c}" ${m.moneda === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
                <div class="form-group"><label>Horas/mes</label><input type="number" id="eqHorasMes" value="${m.horasMes}"></div></div>
                <button class="btn btn-primary" onclick="guardarEquipo()">Actualizar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function eliminarEquipo(id) {
            if (confirm(tApp('confirmar_eliminar_miembro'))) { proyecto.equipo = proyecto.equipo.filter(m => m.id !== id); guardarProyecto(); renderizarEquipo(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
        
        // ============================================
        // SERVICIOS
        // ============================================
        function renderizarServicios() {
            const tbody = document.getElementById('serviciosBody');
            if (!proyecto.servicios) proyecto.servicios = [];
            if (proyecto.servicios.length === 0) { tbody.innerHTML = '<tr><td colspan="9">No hay servicios</td></tr>'; return; }
            tbody.innerHTML = proyecto.servicios.map(s => {
                let total = s.cantidad * s.costeUnitario * (1 + (s.impuesto || 0) / 100);
                return `<tr><td>${escapeHtml(s.nombre)}</td><td>${escapeHtml(s.proveedor || '')}</td><td>${s.cantidad}</td><td>${s.costeUnitario}</td><td>${s.moneda}</td><td>${s.impuesto || 0}%</td><td>${formatearMoneda(convertirMoneda(total, s.moneda))}</td><td>Mes ${s.mes || 1}</td><td><span class="edit-btn" onclick="editarServicio(${s.id})"></span><span class="delete-btn" onclick="eliminarServicio(${s.id})"></span></td></tr>`;
            }).join('');
            calcularCashflow();
        }
        
        function abrirModalServicio() {
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Nuevo Servicio</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="serId"><div class="form-group"><label>Nombre</label><input type="text" id="serNombre"></div>
                <div class="form-group"><label>Proveedor</label><input type="text" id="serProveedor"></div>
                <div class="form-row"><div class="form-group"><label>Cantidad</label><input type="number" id="serCantidad" value="1"></div>
                <div class="form-group"><label>Coste unitario</label><input type="number" id="serCosteUnitario" value="500"></div>
                <div class="form-group"><label>Moneda</label><select id="serMoneda">${Object.keys(MONEDAS).map(m => `<option value="${m}">${m}</option>`).join('')}</select></div></div>
                <div class="form-row"><div class="form-group"><label>Impuesto %</label><input type="number" id="serImpuesto" value="21"></div>
                <div class="form-group"><label>Mes</label><input type="number" id="serMes" value="1"></div></div>
                <button class="btn btn-primary" onclick="guardarServicio()">Guardar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function guardarServicio() {
            let nombre = document.getElementById('serNombre').value.trim();
            if (!nombre) { mostrarToast(tApp('toast_nombre_obligatorio'), 'error'); return; }
            let id = document.getElementById('serId').value;
            let servicio = {
                id: id ? parseInt(id) : Date.now(), nombre: nombre, proveedor: document.getElementById('serProveedor').value,
                cantidad: parseFloat(document.getElementById('serCantidad').value), costeUnitario: parseFloat(document.getElementById('serCosteUnitario').value),
                moneda: document.getElementById('serMoneda').value, impuesto: parseFloat(document.getElementById('serImpuesto').value),
                mes: parseInt(document.getElementById('serMes').value)
            };
            if (id) { let idx = proyecto.servicios.findIndex(s => s.id === parseInt(id)); if (idx >= 0) proyecto.servicios[idx] = servicio; }
            else { if (!proyecto.servicios) proyecto.servicios = []; proyecto.servicios.push(servicio); }
            guardarProyecto(); renderizarServicios(); cerrarModalGeneric(); mostrarToast(` Servicio guardado`, 'success');
        }
        
        function editarServicio(id) {
            let s = proyecto.servicios.find(s => s.id === id);
            if (!s) return;
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Editar</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="serId" value="${s.id}"><div class="form-group"><label>Nombre</label><input type="text" id="serNombre" value="${escapeHtml(s.nombre)}"></div>
                <div class="form-group"><label>Proveedor</label><input type="text" id="serProveedor" value="${escapeHtml(s.proveedor || '')}"></div>
                <div class="form-row"><div class="form-group"><label>Cantidad</label><input type="number" id="serCantidad" value="${s.cantidad}"></div>
                <div class="form-group"><label>Coste unitario</label><input type="number" id="serCosteUnitario" value="${s.costeUnitario}"></div>
                <div class="form-group"><label>Moneda</label><select id="serMoneda">${Object.keys(MONEDAS).map(c => `<option value="${c}" ${s.moneda === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div></div>
                <div class="form-row"><div class="form-group"><label>Impuesto %</label><input type="number" id="serImpuesto" value="${s.impuesto}"></div>
                <div class="form-group"><label>Mes</label><input type="number" id="serMes" value="${s.mes || 1}"></div></div>
                <button class="btn btn-primary" onclick="guardarServicio()">Actualizar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function eliminarServicio(id) {
            if (confirm(tApp('confirmar_eliminar_servicio'))) { proyecto.servicios = proyecto.servicios.filter(s => s.id !== id); guardarProyecto(); renderizarServicios(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
        
        // ============================================
        // COMUNICACIONES Y REUNIONES
        // ============================================