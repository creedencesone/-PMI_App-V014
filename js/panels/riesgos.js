        function inicializarRiesgos() {
            if (!proyecto.riesgos) proyecto.riesgos = [];
            if (!proyecto.accionesMitigacion) proyecto.accionesMitigacion = [];
            renderizarRiesgos();
            calcularEstadisticasRiesgos();
        }
        
        function renderizarRiesgos() {
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
        
        function ordenarRiesgos(criterio) {
            if (!proyecto.riesgos) return;
            if (criterio === 'probabilidad') proyecto.riesgos.sort((a, b) => b.probabilidad - a.probabilidad);
            else if (criterio === 'impacto') proyecto.riesgos.sort((a, b) => b.impacto - a.impacto);
            else if (criterio === 'score') proyecto.riesgos.sort((a, b) => b.score - a.score);
            renderizarRiesgos(); mostrarToast(` Ordenado por ${criterio}`, 'success');
        }
        
        function analizarRiesgos() {
            let criticos = proyecto.riesgos.filter(r => r.nivel === 'Crítico').length;
            mostrarToast(` Análisis: ${criticos} riesgos críticos identificados`, 'info');
        }
        
        function mostrarMatrizRiesgos() {
            const container = document.getElementById('matrizRiesgosContainer');
            if (!container) return;
            container.style.display = 'block';
            const canvas = document.getElementById('matrizRiesgosCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            canvas.width = 500; canvas.height = 400;
            ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
            for (let i = 1; i <= 5; i++) { ctx.beginPath(); ctx.moveTo(i * 80, 0); ctx.lineTo(i * 80, 400); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 400 - i * 60); ctx.lineTo(500, 400 - i * 60); ctx.stroke(); }
            ctx.fillStyle = 'white'; ctx.font = '10px sans-serif';
            for (let i = 1; i <= 5; i++) { ctx.fillText(i, i * 80 - 5, 20); ctx.fillText(i, 5, 400 - i * 60 + 5); }
            ctx.fillStyle = '#007AFF';
            proyecto.riesgos.forEach(r => { let x = r.probabilidad * 80 - 10; let y = 400 - r.impacto * 60 - 10; ctx.fillRect(x, y, 8, 8); ctx.fillStyle = '#FF5F57'; });
            mostrarToast(" Matriz de riesgos mostrada", 'success');
        }
        
        function ocultarMatrizRiesgos() { document.getElementById('matrizRiesgosContainer').style.display = 'none'; }
        
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
            let csv = "ID,Riesgo,Categoría,Probabilidad,Impacto,Score,Nivel,Respuesta,Estado\n";
            (proyecto.riesgos || []).forEach(r => { csv += `${r.id},"${r.nombre}",${r.categoria || ''},${r.probabilidad},${r.impacto},${r.score},${r.nivel},${r.respuesta},${r.estado}\n`; });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement('a'); const url = URL.createObjectURL(blob); link.href = url; link.setAttribute('download', `riesgos_${proyecto.nombre}.csv`); document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url); mostrarToast(" Riesgos exportados", 'success');
        }
        
        // ============================================
        // MÓDULO FINANCIERO INTELIGENTE (simplificado)
        // ============================================