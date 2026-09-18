        function inicializarRiesgos() {
            if (!proyecto.riesgos) proyecto.riesgos = [];
            if (!proyecto.accionesMitigacion) proyecto.accionesMitigacion = [];
            normalizarRiesgos();
            renderizarRiesgos();
            calcularEstadisticasRiesgos();
        }
        
        function normalizarRiesgos() {
            // Migra datos legacy (seeds antiguos guardados sin score/nivel)
            if (!proyecto || !Array.isArray(proyecto.riesgos)) return;
            let cambio = false;
            proyecto.riesgos.forEach(r => {
                let prob = r.probabilidad || 1, imp = r.impacto || 1;
                let score = r.score || (prob * imp);
                let nivel = r.nivel || (score >= 20 ? 'Crítico' : score >= 12 ? 'Alto' : score >= 6 ? 'Medio' : 'Bajo');
                if (r.score !== score || r.nivel !== nivel) { r.score = score; r.nivel = nivel; cambio = true; }
            });
            if (cambio) guardarProyecto();
        }
        
        function renderizarRiesgos() {
            refrescarMatrizRiesgosSiVisible();
            const tbody = document.getElementById('riesgosBody');
            if (!proyecto.riesgos || proyecto.riesgos.length === 0) { tbody.innerHTML = '<tr><td colspan="11">No hay riesgos</td></tr>'; return; }
            tbody.innerHTML = proyecto.riesgos.map(r => {
                const nivelClass = { Crítico: 'badge-pendiente', Alto: 'badge-progreso', Medio: 'badge-pais', Bajo: 'badge-completado' }[r.nivel] || 'badge-pendiente';
                return `<tr>
                    <td>${r.id}</td>
                    <td><strong>${escapeHtml(r.nombre)}</strong></td>
                    <td>${escapeHtml(r.categoria || '-')}</td>
                    <td>${r.probabilidad}/5</td>
                    <td>${r.impacto}/5</td>
                    <td>${r.score}</td>
                    <td class="${nivelClass}">${r.nivel || '-'}</td>
                    <td>${r.respuesta || '-'}</td>
                    <td>${r.estado || 'Abierto'}</td>
                    <td>${escapeHtml(r.planAccion || '-')}</td>
                    <td><span class="edit-btn" onclick="editarRiesgo(${r.id})"></span><span class="delete-btn" onclick="eliminarRiesgo(${r.id})"></span></td>
                </tr>`;
            }).join('');
        }
        
        function calcularEstadisticasRiesgos() {
            if (!proyecto.riesgos) return;
            const criticos = proyecto.riesgos.filter(r => r.nivel === 'Crítico').length;
            const altos = proyecto.riesgos.filter(r => r.nivel === 'Alto').length;
            const medios = proyecto.riesgos.filter(r => r.nivel === 'Medio').length;
            const bajos = proyecto.riesgos.filter(r => r.nivel === 'Bajo').length;
            document.getElementById('totalRiesgosCriticos').innerHTML = criticos;
            document.getElementById('totalRiesgosAltos').innerHTML = altos;
            document.getElementById('totalRiesgosMedios').innerHTML = medios;
            document.getElementById('totalRiesgosBajos').innerHTML = bajos;
        }
        
        function abrirModalNuevoRiesgo() {
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Nuevo Riesgo</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <div class="form-group"><label>Nombre</label><input type="text" id="riesgoNombre"></div>
                <div class="form-group"><label>Categoría</label><input type="text" id="riesgoCategoria" placeholder="Técnico, Externo, Costos..."></div>
                <div class="form-row"><div class="form-group"><label>Probabilidad (1-5)</label><input type="range" id="riesgoProb" min="1" max="5" value="3" oninput="document.getElementById('probVal').innerText=this.value"><span id="probVal">3</span></div>
                <div class="form-group"><label>Impacto (1-5)</label><input type="range" id="riesgoImp" min="1" max="5" value="3" oninput="document.getElementById('impVal').innerText=this.value"><span id="impVal">3</span></div></div>
                <div class="form-group"><label>Respuesta</label><select id="riesgoRespuesta"><option value="Mitigar">Mitigar</option><option value="Evitar">Evitar</option><option value="Transferir">Transferir</option><option value="Aceptar">Aceptar</option></select></div>
                <div class="form-group"><label>Plan de acción</label><textarea rows="2" id="riesgoPlan"></textarea></div>
                <button class="btn btn-primary" onclick="guardarRiesgo()">Guardar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function guardarRiesgo() {
            let nombre = document.getElementById('riesgoNombre').value.trim();
            if (!nombre) { mostrarToast(tApp('toast_nombre_obligatorio'), 'error'); return; }
            let prob = parseInt(document.getElementById('riesgoProb').value);
            let imp = parseInt(document.getElementById('riesgoImp').value);
            let score = prob * imp;
            let nivel = score >= 20 ? 'Crítico' : score >= 12 ? 'Alto' : score >= 6 ? 'Medio' : 'Bajo';
            let riesgo = {
                id: Date.now(), nombre: nombre, categoria: document.getElementById('riesgoCategoria').value,
                probabilidad: prob, impacto: imp, score: score, nivel: nivel,
                respuesta: document.getElementById('riesgoRespuesta').value, estado: 'Abierto',
                planAccion: document.getElementById('riesgoPlan').value
            };
            if (!proyecto.riesgos) proyecto.riesgos = [];
            proyecto.riesgos.push(riesgo);
            guardarProyecto(); renderizarRiesgos(); calcularEstadisticasRiesgos(); cerrarModalGeneric(); mostrarToast(` Riesgo añadido`, 'success');
        }
        
        function editarRiesgo(id) {
            let r = proyecto.riesgos.find(r => r.id === id);
            if (!r) return;
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Editar Riesgo</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="riesgoId" value="${r.id}"><div class="form-group"><label>Nombre</label><input type="text" id="riesgoNombre" value="${escapeHtml(r.nombre)}"></div>
                <div class="form-group"><label>Categoría</label><input type="text" id="riesgoCategoria" value="${escapeHtml(r.categoria || '')}"></div>
                <div class="form-row"><div class="form-group"><label>Probabilidad</label><input type="range" id="riesgoProb" min="1" max="5" value="${r.probabilidad}" oninput="document.getElementById('probVal').innerText=this.value"><span id="probVal">${r.probabilidad}</span></div>
                <div class="form-group"><label>Impacto</label><input type="range" id="riesgoImp" min="1" max="5" value="${r.impacto}" oninput="document.getElementById('impVal').innerText=this.value"><span id="impVal">${r.impacto}</span></div></div>
                <div class="form-group"><label>Respuesta</label><select id="riesgoRespuesta"><option value="Mitigar" ${r.respuesta === 'Mitigar' ? 'selected' : ''}>Mitigar</option><option value="Evitar" ${r.respuesta === 'Evitar' ? 'selected' : ''}>Evitar</option><option value="Transferir" ${r.respuesta === 'Transferir' ? 'selected' : ''}>Transferir</option><option value="Aceptar" ${r.respuesta === 'Aceptar' ? 'selected' : ''}>Aceptar</option></select></div>
                <div class="form-group"><label>Plan de acción</label><textarea rows="2" id="riesgoPlan">${escapeHtml(r.planAccion || '')}</textarea></div>
                <div class="form-group"><label>Estado</label><select id="riesgoEstado"><option value="Abierto" ${r.estado === 'Abierto' ? 'selected' : ''}>Abierto</option><option value="En seguimiento" ${r.estado === 'En seguimiento' ? 'selected' : ''}>En seguimiento</option><option value="Cerrado" ${r.estado === 'Cerrado' ? 'selected' : ''}>Cerrado</option></select></div>
                <button class="btn btn-primary" onclick="actualizarRiesgo()">Actualizar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function actualizarRiesgo() {
            let id = parseInt(document.getElementById('riesgoId').value);
            let idx = proyecto.riesgos.findIndex(r => r.id === id);
            if (idx >= 0) {
                let prob = parseInt(document.getElementById('riesgoProb').value);
                let imp = parseInt(document.getElementById('riesgoImp').value);
                let score = prob * imp;
                let nivel = score >= 20 ? 'Crítico' : score >= 12 ? 'Alto' : score >= 6 ? 'Medio' : 'Bajo';
                proyecto.riesgos[idx] = {
                    id: id, nombre: document.getElementById('riesgoNombre').value, categoria: document.getElementById('riesgoCategoria').value,
                    probabilidad: prob, impacto: imp, score: score, nivel: nivel,
                    respuesta: document.getElementById('riesgoRespuesta').value, estado: document.getElementById('riesgoEstado').value,
                    planAccion: document.getElementById('riesgoPlan').value
                };
                guardarProyecto(); renderizarRiesgos(); calcularEstadisticasRiesgos(); cerrarModalGeneric(); mostrarToast(tApp('toast_riesgo_actualizado'), 'success');
            }
        }
        
        function eliminarRiesgo(id) {
            if (confirm(tApp('confirmar_eliminar_riesgo'))) { proyecto.riesgos = proyecto.riesgos.filter(r => r.id !== id); guardarProyecto(); renderizarRiesgos(); calcularEstadisticasRiesgos(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
        
        function analizarRiesgos() {
            if (!proyecto) { mostrarToast(tApp('toast_no_proyecto'), 'error'); return; }
            if (!Array.isArray(proyecto.riesgos) || proyecto.riesgos.length === 0) {
                mostrarToast(' No hay riesgos registrados para analizar. Añade un riesgo primero.', 'info');
                return;
            }
            normalizarRiesgos();
            calcularEstadisticasRiesgos();
            const criticos = proyecto.riesgos.filter(r => r.nivel === 'Crítico');
            const altos = proyecto.riesgos.filter(r => r.nivel === 'Alto');
            const medios = proyecto.riesgos.filter(r => r.nivel === 'Medio');
            const bajos = proyecto.riesgos.filter(r => r.nivel === 'Bajo');
            const recomendacion = {
                Crítico: 'Prioridad máxima: implementar plan de respuesta inmediato y seguimiento semanal.',
                Alto: 'Planificar respuesta de mitigación y revisar en cada seguimiento del proyecto.',
                Medio: 'Vigilar de cerca: definir acciones preventivas y revisión mensual.',
                Bajo: 'Aceptar y documentar; revisar en hitos relevantes.'
            };
            const lista = [criticos, altos, medios, bajos].flat().map(r => `<div class="info-card ${r.nivel === 'Crítico' ? 'vc-red' : r.nivel === 'Alto' ? 'vc-orange' : r.nivel === 'Medio' ? 'vc-yellow' : 'vc-green'}" style="padding:10px 14px;margin-bottom:8px;">
                <strong>${escapeHtml(r.nombre)}</strong> <span class="pm-tag">${r.nivel} · Score ${r.score}</span><br>
                <span style="font-size:13px;color:#555">${recomendacion[r.nivel] || ''}</span>
            </div>`).join('');
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Análisis de Riesgos</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <div class="cards-grid u-mb-16">
                    <div class="value-card vc-red"><div class="small">Riesgos Críticos</div><div class="big" id="totalRiesgosCriticos">${criticos.length}</div></div>
                    <div class="value-card vc-orange"><div class="small">Riesgos Altos</div><div class="big" id="totalRiesgosAltos">${altos.length}</div></div>
                    <div class="value-card vc-yellow"><div class="small">Riesgos Medios</div><div class="big" id="totalRiesgosMedios">${medios.length}</div></div>
                    <div class="value-card vc-green"><div class="small">Riesgos Bajos</div><div class="big" id="totalRiesgosBajos">${bajos.length}</div></div>
                </div>
                <div class="form-group"><label>Recomendaciones automáticas</label>${lista || '<div class="info-card">No hay riesgos que analizar.</div>'}</div>
                <button class="btn btn-primary" onclick="cerrarModalGeneric()">Cerrar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
            mostrarToast(` Análisis completado: ${criticos.length} críticos, ${altos.length} altos, ${medios.length} medios, ${bajos.length} bajos`, 'success');
        }
        
        function renderizarMatrizRiesgos() {
            var grid = document.getElementById('matrizRiesgosGrid');
            if (!grid) return;

            var riesgos = proyecto.riesgos || [];

            var svgAlert = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
            var svgTrendingUp = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>';
            var svgAlertCircle = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
            var svgCheck = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

            var categorias = [
                {
                    id: 'critico', cssClass: 'pm-col-red', icon: svgAlert, title: 'Crítico',
                    subtitle: 'Score ≥ 20',
                    filter: function(r) { return r.nivel === 'Crítico'; }
                },
                {
                    id: 'alto', cssClass: 'pm-col-orange', icon: svgAlertCircle, title: 'Alto',
                    subtitle: 'Score 12 – 19',
                    filter: function(r) { return r.nivel === 'Alto'; }
                },
                {
                    id: 'medio', cssClass: 'pm-col-yellow', icon: svgTrendingUp, title: 'Medio',
                    subtitle: 'Score 6 – 11',
                    filter: function(r) { return r.nivel === 'Medio'; }
                },
                {
                    id: 'bajo', cssClass: 'pm-col-green', icon: svgCheck, title: 'Bajo',
                    subtitle: 'Score < 6',
                    filter: function(r) { return r.nivel === 'Bajo'; }
                }
            ];

            var html = '<div class="pm-matrix">';
            categorias.forEach(function(cat) {
                var items = riesgos.filter(cat.filter);
                var count = items.length;
                var cards = count === 0
                    ? '<div class="pm-card" style="cursor:default;opacity:0.5;justify-content:center;"><div class="pm-card-body"><div class="pm-card-name" style="text-align:center;">Sin riesgos</div></div></div>'
                    : items.map(function(r) {
                        var nivelColor = { 'Crítico': '#B42318', 'Alto': '#F79009', 'Medio': '#A16207', 'Bajo': '#2F6E4E' }[r.nivel] || '#667085';
                        return '<div class="pm-card" style="cursor:default;border-left:3px solid ' + nivelColor + ';">'
                            + '<div class="pm-card-body">'
                            + '<div class="pm-card-name">' + escapeHtml(r.nombre) + '</div>'
                            + '<div class="pm-card-role">' + escapeHtml(r.categoria || '-') + '</div>'
                            + '<div class="pm-card-email">Prob ' + r.probabilidad + '/5 · Imp ' + r.impacto + '/5</div>'
                            + '<div class="pm-tag" style="display:inline-block;margin-top:4px;font-size:10px;padding:2px 6px;border-radius:4px;background:' + nivelColor + '22;color:' + nivelColor + ';">' + escapeHtml(r.nivel || '-') + '</div>'
                            + '</div></div>';
                    }).join('');

                html += '<div class="pm-col ' + cat.cssClass + '" data-quadrant="' + cat.id + '">'
                    + '<div class="pm-col-header"><div class="pm-col-header-top">' + cat.icon + '<span class="pm-col-title">' + cat.title + '</span></div><div class="pm-col-subtitle">' + cat.subtitle + '</div>'
                    + '<div class="pm-col-badge">' + count + '</div>'
                    + '</div>'
                    + '<div class="pm-col-body" data-quadrant="' + cat.id + '">' + cards + '</div>'
                    + '</div>';
            });
            html += '</div>';

            grid.innerHTML = html;
        }

        function refrescarMatrizRiesgosSiVisible() {
            var container = document.getElementById('matrizRiesgosContainer');
            var grid = document.getElementById('matrizRiesgosGrid');
            if (!container || !grid) return;
            if (container.classList.contains('u-hidden') || container.style.display === 'none') return;
            renderizarMatrizRiesgos();
        }

        function mostrarMatrizRiesgos() {
            var container = document.getElementById('matrizRiesgosContainer');
            if (!container) return;
            container.classList.remove('u-hidden');
            container.style.display = '';
            renderizarMatrizRiesgos();
            mostrarToast(" Matriz de riesgos mostrada", 'success');
        }
        
        function ocultarMatrizRiesgos() {
            var container = document.getElementById('matrizRiesgosContainer');
            if (container) { container.classList.add('u-hidden'); container.style.display = 'none'; }
        }
        
        function calcularValorEsperado() {
            let valorProyecto = parseFloat(document.getElementById('valorProyectoRiesgos').value) || proyecto.precioVenta || 0;
            let reserva = 0;
            proyecto.riesgos.forEach(r => { reserva += valorProyecto * (r.probabilidad / 100) * (r.impacto / 10); });
            document.getElementById('reservaContingencia').value = formatearMoneda(reserva);
            mostrarToast(` Reserva de contingencia: ${formatearMoneda(reserva)}`, 'success');
        }
        
        function abrirModalNuevaAccionMitigacion() {
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Nueva Acción</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <div class="form-group"><label>Riesgo asociado</label><select id="accRiesgoId">${(proyecto.riesgos || []).map(r => `<option value="${r.id}">${escapeHtml(r.nombre)}</option>`).join('')}</select></div>
                <div class="form-group"><label>Fecha</label><input type="date" id="accFecha" value="${new Date().toISOString().split('T')[0]}"></div>
                <div class="form-group"><label>Acción tomada</label><textarea rows="2" id="accAccion"></textarea></div>
                <div class="form-group"><label>Responsable</label><input type="text" id="accResponsable"></div>
                <div class="form-group"><label>Estado</label><select id="accEstado"><option value="Pendiente">Pendiente</option><option value="En progreso">En progreso</option><option value="Completada">Completada</option></select></div>
                <button class="btn btn-primary" onclick="guardarAccionMitigacion()">Guardar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function guardarAccionMitigacion() {
            let riesgoId = parseInt(document.getElementById('accRiesgoId').value);
            let riesgo = proyecto.riesgos.find(r => r.id === riesgoId);
            let accion = {
                id: Date.now(), riesgoId: riesgoId, riesgoNombre: riesgo ? riesgo.nombre : '',
                fecha: document.getElementById('accFecha').value, accion: document.getElementById('accAccion').value,
                responsable: document.getElementById('accResponsable').value, estado: document.getElementById('accEstado').value
            };
            if (!proyecto.accionesMitigacion) proyecto.accionesMitigacion = [];
            proyecto.accionesMitigacion.push(accion);
            guardarProyecto(); renderizarAccionesMitigacion(); cerrarModalGeneric(); mostrarToast(tApp('toast_accion_guardada'), 'success');
        }
        
        function renderizarAccionesMitigacion() {
            const tbody = document.getElementById('accionesMitigacionBody');
            if (!proyecto.accionesMitigacion || proyecto.accionesMitigacion.length === 0) { tbody.innerHTML = '<tr><td colspan="6">No hay acciones</td></tr>'; return; }
            tbody.innerHTML = proyecto.accionesMitigacion.map(a => `<tr>
                <td><strong>${escapeHtml(a.riesgoNombre)}</strong></td>
                <td>${a.fecha || '-'}</td>
                <td>${escapeHtml(a.accion || '-')}</td>
                <td>${escapeHtml(a.responsable || '-')}</td>
                <td><span class="badge-${a.estado === 'Completada' ? 'completado' : 'progreso'}">${a.estado || 'Pendiente'}</span></td>
                <td><span class="delete-btn" onclick="eliminarAccionMitigacion(${a.id})"></span></td>
                </tr>`).join('');
        }
        
        function eliminarAccionMitigacion(id) {
            if (confirm(tApp('confirmar_eliminar_accion'))) { proyecto.accionesMitigacion = proyecto.accionesMitigacion.filter(a => a.id !== id); guardarProyecto(); renderizarAccionesMitigacion(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
        
        function exportarRiesgos() {
            if (!proyecto) {
                if (typeof mostrarToast === 'function') mostrarToast(tApp('toast_no_proyecto'), 'error');
                return;
            }
            if (typeof mostrarToast === 'function') mostrarToast(" Generando PDF de riesgos...", 'info');

            var panel = document.getElementById('panelRiesgos');
            if (!panel) return;
            try {
                var clone = panel.cloneNode(true);
                clone.querySelectorAll('.btn, input, select, textarea, button').forEach(function(el) { el.remove(); });

                var canvasOrigen = document.querySelectorAll('#panelRiesgos canvas');
                var canvasClonados = clone.querySelectorAll('canvas');
                for (var ci = 0; ci < canvasOrigen.length && ci < canvasClonados.length; ci++) {
                    try {
                        var imgData = canvasOrigen[ci].toDataURL('image/png');
                        var img = document.createElement('img');
                        img.src = imgData;
                        img.style.cssText = 'max-width:100%;height:auto';
                        img.width = canvasOrigen[ci].width;
                        img.height = canvasOrigen[ci].height;
                        canvasClonados[ci].parentNode.replaceChild(img, canvasClonados[ci]);
                    } catch(e) {}
                }

                var container = document.createElement('div');
                container.style.cssText = 'position:absolute;top:-9999px;left:-9999px;width:1200px;background:white;padding:40px;font-family:Arial,sans-serif;color:#333;z-index:9999';
                container.appendChild(clone);
                document.body.appendChild(container);

                var nombreProy = proyecto.nombre || localStorage.getItem('proyectoNombre') || 'Proyecto';

                var header = document.createElement('div');
                header.style.cssText = 'text-align:center;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #1a237e';
                header.innerHTML = '<h1 style="margin:0;font-size:24px;color:#1a237e"> Gestión de Riesgos del Proyecto</h1>'
                    + '<h2 style="margin:8px 0 0;font-size:18px;color:#333">' + escapeHtml(nombreProy) + '</h2>'
                    + '<p style="margin:5px 0 0;font-size:13px;color:#666">Generado: ' + new Date().toLocaleDateString() + '</p>';
                clone.insertBefore(header, clone.firstChild);

                var footer = document.createElement('div');
                footer.style.cssText = 'text-align:center;margin-top:30px;padding-top:15px;border-top:1px solid #ccc;font-size:11px;color:#999';
                footer.innerHTML = 'Proyecto: ' + escapeHtml(nombreProy) + ' — Gestión de Riesgos — v1.0';
                clone.appendChild(footer);

                var inlineCss = document.createElement('style');
                inlineCss.textContent = `
                    body { font-family: Arial, sans-serif; color: #333; margin:0; padding:0; }
                    .panel-title { display: block; font-size: 16px; font-weight: bold; color: #1a237e; margin: 20px 0 10px 0; }
                    .panel-title span { display: flex; align-items: center; gap: 6px; }
                    .cards-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; }
                    .value-card { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; }
                    .value-card .small { font-size: 12px; color: #666; margin-bottom: 4px; }
                    .value-card .big { font-size: 24px; font-weight: bold; color: #1a237e; }
                    .data-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; }
                    .data-table th { background: #1a237e; color: white; padding: 8px; text-align: left; }
                    .data-table td { padding: 8px; border-bottom: 1px solid #eee; }
                    .info-card { border-left: 4px solid #1a237e; padding: 15px; margin-bottom: 20px; background: #f5f5f5; border-radius: 8px; }
                    .form-row { display: flex; gap: 20px; }
                    .form-group { flex: 1; }
                    .form-group label { display: block; font-size: 12px; color: #666; margin-bottom: 4px; }
                    .u-mt-8 { margin-top: 8px; }
                    .u-mt-24 { margin-top: 24px; }
                    .u-mb-16 { margin-bottom: 16px; }
                    .u-mb-24 { margin-bottom: 24px; }
                    .u-hidden { display: none; }
                    img { max-width: 100% !important; height: auto !important; }
                `;
                clone.insertBefore(inlineCss, clone.firstChild);

                html2canvas(container, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false,
                    useCORS: true
                }).then(function(canvas) {
                    var imgData = canvas.toDataURL('image/png');
                    var win = window.open('', '_blank');
                    if (win) {
                        win.document.write('<!DOCTYPE html><html><head><title>Riesgos - ' + escapeHtml(nombreProy) + '</title>');
                        win.document.write('<style>body{margin:0;padding:0;display:flex;justify-content:center;background:#666}img{max-width:100%;height:auto}@media print{body{margin:0;padding:0}img{page-break-inside:avoid}}</style>');
                        win.document.write('</head><body>');
                        win.document.write('<img src="' + imgData + '" onload="window.print()">');
                        win.document.write('</body></html>');
                        win.document.close();
                    }
                    document.body.removeChild(container);
                    if (typeof mostrarToast === 'function') mostrarToast(" PDF generado correctamente", 'success');
                }).catch(function(err) {
                    document.body.removeChild(container);
                    if (typeof mostrarToast === 'function') mostrarToast('Error al generar PDF: ' + err.message);
                });
            } catch (e) {
                if (typeof mostrarToast === 'function') mostrarToast('Error: ' + e.message);
            }
        }
        
        // ============================================
        // MÓDULO FINANCIERO INTELIGENTE (simplificado)
        // ============================================