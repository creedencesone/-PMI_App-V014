
        // ─── Normalización PMBOK 11 (Ciclo 2, ENG-04) ───────────────
        function nivelRiesgo(score) {
            return score >= 20 ? 'Crítico' : score >= 12 ? 'Alto' : score >= 6 ? 'Medio' : 'Bajo';
        }

        function normalizarEstadoRiesgo(estado) {
            var valor = String(estado || 'Abierto').toLowerCase().trim();
            if (valor.indexOf('cerr') === 0 || valor === 'mitigado' || valor === 'closed') return 'Cerrado';
            if (valor.indexOf('seguim') >= 0 || valor === 'in progress' || valor === 'en progreso') return 'En seguimiento';
            return 'Abierto';
        }

        function esRiesgoAbierto(r) {
            return normalizarEstadoRiesgo(r.estado) !== 'Cerrado';
        }

        function compararRiesgos(a, b) {
            return (b.score || 0) - (a.score || 0) || (b.probabilidad || 0) - (a.probabilidad || 0);
        }

        function ordenarRiesgos() {
            if (!Array.isArray(proyecto.riesgos)) return;
            proyecto.riesgos.sort(compararRiesgos);
            guardarProyecto();
            renderizarRiesgos();
            calcularEstadisticasRiesgos();
        }

        function inicializarRiesgos() {
            if (!proyecto.riesgos) proyecto.riesgos = [];
            if (!proyecto.accionesMitigacion) proyecto.accionesMitigacion = [];
            normalizarRiesgos();
            renderizarRiesgos();
            calcularEstadisticasRiesgos();
        }

        /** Completa el modelo PMI 11: tipo, causa, trigger, owner y monitoreo. */
        function normalizarRiesgos() {
            if (!proyecto || !Array.isArray(proyecto.riesgos)) return;
            let cambio = false;
            proyecto.riesgos.forEach(r => {
                const prob = Math.min(5, Math.max(1, Number(r.probabilidad) || 1));
                const imp = Math.min(5, Math.max(1, Number(r.impacto) || 1));
                const score = prob * imp;
                const nivel = nivelRiesgo(score);
                const estado = normalizarEstadoRiesgo(r.estado);
                const defaults = {
                    tipo: r.tipo === 'Oportunidad' ? 'Oportunidad' : 'Amenaza',
                    causa: typeof r.causa === 'string' ? r.causa : '',
                    trigger: typeof r.trigger === 'string' ? r.trigger : '',
                    owner: typeof r.owner === 'string' ? r.owner : '',
                    frecuencia: r.frecuencia || 'Mensual',
                    proximaRevision: r.proximaRevision || '',
                    riesgoResidual: typeof r.riesgoResidual === 'string' ? r.riesgoResidual : ''
                };
                Object.keys(defaults).forEach(k => {
                    if (r[k] !== defaults[k]) { r[k] = defaults[k]; cambio = true; }
                });
                if (/^\d+$/.test(String(r.id)) && Number(r.id) !== r.id) { r.id = Number(r.id); cambio = true; }
                const monetario = Math.max(0, Number(r.impactoMonetario) || 0);
                if (r.impactoMonetario !== monetario) { r.impactoMonetario = monetario; cambio = true; }
                if (r.probabilidad !== prob || r.impacto !== imp || r.score !== score || r.nivel !== nivel || r.estado !== estado) {
                    r.probabilidad = prob; r.impacto = imp; r.score = score; r.nivel = nivel; r.estado = estado; cambio = true;
                }
            });
            if (cambio) guardarProyecto();
        }

        function camposDetalleRiesgo(r) {
            const v = r || {};
            const opcion = (valor, actual) => `<option value="${escapeHtml(String(valor))}"${actual === valor ? ' selected' : ''}>${escapeHtml(String(valor))}</option>`;
            return `
                <div class="form-row">
                    <div class="form-group"><label for="riesgoTipo">Tipo</label><select id="riesgoTipo">${opcion('Amenaza', v.tipo || 'Amenaza')}${opcion('Oportunidad', v.tipo)}</select></div>
                    <div class="form-group"><label for="riesgoOwner">Responsable (owner)</label><input type="text" id="riesgoOwner" value="${escapeHtml(v.owner || '')}" maxlength="120"></div>
                </div>
                <div class="form-group"><label for="riesgoCausa">Causa</label><input type="text" id="riesgoCausa" value="${escapeHtml(v.causa || '')}" maxlength="240"></div>
                <div class="form-group"><label for="riesgoTrigger">Trigger (señal de activación)</label><input type="text" id="riesgoTrigger" value="${escapeHtml(v.trigger || '')}" maxlength="240"></div>
                <div class="form-row">
                    <div class="form-group"><label for="riesgoProximaRevision">Próxima revisión</label><input type="date" id="riesgoProximaRevision" value="${escapeHtml(v.proximaRevision || '')}"></div>
                    <div class="form-group"><label for="riesgoFrecuencia">Frecuencia de monitoreo</label><select id="riesgoFrecuencia">${['Semanal', 'Mensual', 'Trimestral', 'Por hito'].map(x => opcion(x, v.frecuencia || 'Mensual')).join('')}</select></div>
                </div>
                <div class="form-group"><label for="riesgoResidual">Riesgo residual</label><input type="text" id="riesgoResidual" value="${escapeHtml(v.riesgoResidual || '')}" maxlength="240"></div>`;
        }

        function leerDetalleRiesgo() {
            const valor = id => document.getElementById(id)?.value.trim() || '';
            return {
                tipo: document.getElementById('riesgoTipo')?.value || 'Amenaza',
                owner: valor('riesgoOwner'), causa: valor('riesgoCausa'), trigger: valor('riesgoTrigger'),
                frecuencia: document.getElementById('riesgoFrecuencia')?.value || 'Mensual',
                proximaRevision: valor('riesgoProximaRevision'), riesgoResidual: valor('riesgoResidual')
            };
        }

        function renderizarRiesgos() {
            refrescarMatrizRiesgosSiVisible();
            const tbody = document.getElementById('riesgosBody');
            if (!tbody) return;
            if (!proyecto.riesgos || proyecto.riesgos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="15">No hay riesgos</td></tr>'; return;
            }
            tbody.innerHTML = proyecto.riesgos.slice().sort(compararRiesgos).map(r => {
                const id = Number(r.id) || 0;
                const nivelClass = { Crítico: 'badge-pendiente', Alto: 'badge-progreso', Medio: 'badge-pais', Bajo: 'badge-completado' }[r.nivel] || 'badge-pendiente';
                const causaTrigger = [r.causa, r.trigger].filter(Boolean).map(escapeHtml).join(' → ') || '—';
                const monitoreo = [
                    r.proximaRevision ? `Revisión ${escapeHtml(r.proximaRevision)}` : '',
                    escapeHtml(r.frecuencia || 'Mensual'),
                    r.riesgoResidual ? `Residual: ${escapeHtml(r.riesgoResidual)}` : ''
                ].filter(Boolean).join(' · ');
                return `<tr>
                    <td>${id}</td>
                    <td><strong>${escapeHtml(r.nombre)}</strong></td>
                    <td>${escapeHtml(r.tipo || 'Amenaza')}</td>
                    <td>${escapeHtml(r.categoria || '-')}</td>
                    <td>${Number(r.probabilidad) || 1}/5</td>
                    <td>${Number(r.impacto) || 1}/5</td>
                    <td>${Number(r.score) || 0}</td>
                    <td class="${nivelClass}">${escapeHtml(r.nivel || '-')}</td>
                    <td>${causaTrigger}</td>
                    <td>${escapeHtml(r.owner || '-')}</td>
                    <td>${escapeHtml(r.respuesta || '-')}</td>
                    <td>${escapeHtml(normalizarEstadoRiesgo(r.estado))}</td>
                    <td>${escapeHtml(r.planAccion || '-')}</td>
                    <td>${monitoreo}</td>
                    <td><button class="btn btn-secondary btn-small btn-icon-only" onclick="editarRiesgo(${id})" title="Editar riesgo" aria-label="Editar riesgo ${id}"><i data-feather="edit-2"></i></button><button class="btn btn-danger btn-small btn-icon-only" onclick="eliminarRiesgo(${id})" title="Eliminar riesgo" aria-label="Eliminar riesgo ${id}"><i data-feather="trash-2"></i></button></td>
                </tr>`;
            }).join('');
        }

        function calcularEstadisticasRiesgos() {
            if (!proyecto.riesgos) return;
            const abiertos = proyecto.riesgos.filter(esRiesgoAbierto);
            const criticos = abiertos.filter(r => r.nivel === 'Crítico').length;
            const altos = abiertos.filter(r => r.nivel === 'Alto').length;
            const medios = abiertos.filter(r => r.nivel === 'Medio').length;
            const bajos = abiertos.filter(r => r.nivel === 'Bajo').length;
            document.getElementById('totalRiesgosCriticos').innerHTML = criticos;
            document.getElementById('totalRiesgosAltos').innerHTML = altos;
            document.getElementById('totalRiesgosMedios').innerHTML = medios;
            document.getElementById('totalRiesgosBajos').innerHTML = bajos;
        }

        function abrirModalNuevoRiesgo() {
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Nuevo Riesgo</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <div class="form-group"><label for="riesgoNombre">Nombre</label><input type="text" id="riesgoNombre" aria-label="Nombre del riesgo" required></div>
                <div class="form-group"><label for="riesgoCategoria">Categoría</label><input type="text" id="riesgoCategoria" aria-label="Categoría del riesgo" placeholder="Técnico, Externo, Costos..."></div>
                <div class="form-row"><div class="form-group"><label for="riesgoProb">Probabilidad (1-5)</label><input type="range" id="riesgoProb" aria-label="Probabilidad del riesgo" min="1" max="5" value="3" oninput="document.getElementById('probVal').innerText=this.value"><span id="probVal">3</span></div>
                <div class="form-group"><label for="riesgoImp">Impacto (1-5)</label><input type="range" id="riesgoImp" aria-label="Impacto del riesgo" min="1" max="5" value="3" oninput="document.getElementById('impVal').innerText=this.value"><span id="impVal">3</span></div></div>
                <div class="form-group"><label for="riesgoImpactoMonetario">Impacto monetario en ${escapeHtml(proyecto.monedaVenta || proyecto.monedaBase || 'EUR')} (opcional)</label><input type="number" id="riesgoImpactoMonetario" aria-label="Impacto monetario del riesgo" min="0" step="1" placeholder="Se estima desde el valor del proyecto"></div>
                ${camposDetalleRiesgo()}
                <div class="form-group"><label for="riesgoRespuesta">Respuesta</label><select id="riesgoRespuesta" aria-label="Respuesta ante el riesgo"><option value="Mitigar">Mitigar</option><option value="Evitar">Evitar</option><option value="Transferir">Transferir</option><option value="Aceptar">Aceptar</option></select></div>
                <div class="form-group"><label for="riesgoPlan">Plan de acción</label><textarea rows="2" id="riesgoPlan" aria-label="Plan de acción del riesgo"></textarea></div>
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
            let nivel = nivelRiesgo(score);
            let riesgo = {
                id: Date.now(), nombre: nombre, categoria: document.getElementById('riesgoCategoria').value,
                probabilidad: prob, impacto: imp, score: score, nivel: nivel,
                impactoMonetario: parseFloat(document.getElementById('riesgoImpactoMonetario').value) || 0,
                respuesta: document.getElementById('riesgoRespuesta').value, estado: 'Abierto',
                planAccion: document.getElementById('riesgoPlan').value,
                ...leerDetalleRiesgo()
            };
            if (!proyecto.riesgos) proyecto.riesgos = [];
            proyecto.riesgos.push(riesgo);
            if (typeof registrarBitacora === 'function') registrarBitacora('riesgo', riesgo.id, 'crear', null, riesgo);
            guardarProyecto(); renderizarRiesgos(); calcularEstadisticasRiesgos(); cerrarModalGeneric(); mostrarToast(` Riesgo añadido`, 'success');
        }

        function editarRiesgo(id) {
            let r = proyecto.riesgos.find(r => String(r.id) === String(id));
            if (!r) return;
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Editar Riesgo</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="riesgoId" value="${Number(r.id) || 0}"><div class="form-group"><label for="riesgoNombre">Nombre</label><input type="text" id="riesgoNombre" aria-label="Nombre del riesgo" value="${escapeHtml(r.nombre)}"></div>
                <div class="form-group"><label for="riesgoCategoria">Categoría</label><input type="text" id="riesgoCategoria" aria-label="Categoría del riesgo" value="${escapeHtml(r.categoria || '')}"></div>
                <div class="form-row"><div class="form-group"><label for="riesgoProb">Probabilidad</label><input type="range" id="riesgoProb" aria-label="Probabilidad del riesgo" min="1" max="5" value="${Number(r.probabilidad) || 1}" oninput="document.getElementById('probVal').innerText=this.value"><span id="probVal">${Number(r.probabilidad) || 1}</span></div>
                <div class="form-group"><label for="riesgoImp">Impacto</label><input type="range" id="riesgoImp" aria-label="Impacto del riesgo" min="1" max="5" value="${Number(r.impacto) || 1}" oninput="document.getElementById('impVal').innerText=this.value"><span id="impVal">${Number(r.impacto) || 1}</span></div></div>
                <div class="form-group"><label for="riesgoImpactoMonetario">Impacto monetario en ${escapeHtml(proyecto.monedaVenta || proyecto.monedaBase || 'EUR')} (opcional)</label><input type="number" id="riesgoImpactoMonetario" aria-label="Impacto monetario del riesgo" min="0" step="1" value="${r.impactoMonetario || ''}"></div>
                ${camposDetalleRiesgo(r)}
                <div class="form-group"><label for="riesgoRespuesta">Respuesta</label><select id="riesgoRespuesta" aria-label="Respuesta ante el riesgo"><option value="Mitigar" ${r.respuesta === 'Mitigar' ? 'selected' : ''}>Mitigar</option><option value="Evitar" ${r.respuesta === 'Evitar' ? 'selected' : ''}>Evitar</option><option value="Transferir" ${r.respuesta === 'Transferir' ? 'selected' : ''}>Transferir</option><option value="Aceptar" ${r.respuesta === 'Aceptar' ? 'selected' : ''}>Aceptar</option></select></div>
                <div class="form-group"><label for="riesgoPlan">Plan de acción</label><textarea rows="2" id="riesgoPlan" aria-label="Plan de acción del riesgo">${escapeHtml(r.planAccion || '')}</textarea></div>
                <div class="form-group"><label for="riesgoEstado">Estado</label><select id="riesgoEstado" aria-label="Estado del riesgo"><option value="Abierto" ${r.estado === 'Abierto' ? 'selected' : ''}>Abierto</option><option value="En seguimiento" ${r.estado === 'En seguimiento' ? 'selected' : ''}>En seguimiento</option><option value="Cerrado" ${r.estado === 'Cerrado' ? 'selected' : ''}>Cerrado</option></select></div>
                <button class="btn btn-primary" onclick="actualizarRiesgo()">Actualizar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }

        function actualizarRiesgo() {
            let id = parseInt(document.getElementById('riesgoId').value);
            let idx = proyecto.riesgos.findIndex(r => String(r.id) === String(id));
            if (idx >= 0) {
                const antes = { ...proyecto.riesgos[idx] };
                let prob = parseInt(document.getElementById('riesgoProb').value);
                let imp = parseInt(document.getElementById('riesgoImp').value);
                let score = prob * imp;
                let nivel = nivelRiesgo(score);
                proyecto.riesgos[idx] = {
                    id: id, nombre: document.getElementById('riesgoNombre').value, categoria: document.getElementById('riesgoCategoria').value,
                    probabilidad: prob, impacto: imp, score: score, nivel: nivel,
                    impactoMonetario: parseFloat(document.getElementById('riesgoImpactoMonetario').value) || 0,
                    respuesta: document.getElementById('riesgoRespuesta').value, estado: normalizarEstadoRiesgo(document.getElementById('riesgoEstado').value),
                    planAccion: document.getElementById('riesgoPlan').value,
                    ...leerDetalleRiesgo()
                };
                if (typeof registrarBitacora === 'function') registrarBitacora('riesgo', id, 'actualizar', antes, proyecto.riesgos[idx]);
                guardarProyecto(); renderizarRiesgos(); calcularEstadisticasRiesgos(); cerrarModalGeneric(); mostrarToast(tApp('toast_riesgo_actualizado'), 'success');
            }
        }

        function eliminarRiesgo(id) {
            if (confirm(tApp('confirmar_eliminar_riesgo'))) {
                const antes = proyecto.riesgos.find(r => String(r.id) === String(id)) || null;
                if (typeof registrarBitacora === 'function') registrarBitacora('riesgo', id, 'eliminar', antes, null);
                proyecto.riesgos = proyecto.riesgos.filter(r => String(r.id) !== String(id)); guardarProyecto(); renderizarRiesgos(); calcularEstadisticasRiesgos(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }

        function analizarRiesgos() {
            if (!proyecto) { mostrarToast(tApp('toast_no_proyecto'), 'error'); return; }
            if (!Array.isArray(proyecto.riesgos) || proyecto.riesgos.length === 0) {
                mostrarToast(' No hay riesgos registrados para analizar. Añade un riesgo primero.', 'info');
                return;
            }
            normalizarRiesgos();
            calcularEstadisticasRiesgos();
            const abiertos = proyecto.riesgos.filter(esRiesgoAbierto);
            const criticos = abiertos.filter(r => r.nivel === 'Crítico');
            const altos = abiertos.filter(r => r.nivel === 'Alto');
            const medios = abiertos.filter(r => r.nivel === 'Medio');
            const bajos = abiertos.filter(r => r.nivel === 'Bajo');
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
                    <div class="value-card vc-red"><div class="small">Riesgos Críticos</div><div class="big" id="analisisRiesgosCriticos">${criticos.length}</div></div>
                    <div class="value-card vc-orange"><div class="small">Riesgos Altos</div><div class="big" id="analisisRiesgosAltos">${altos.length}</div></div>
                    <div class="value-card vc-yellow"><div class="small">Riesgos Medios</div><div class="big" id="analisisRiesgosMedios">${medios.length}</div></div>
                    <div class="value-card vc-green"><div class="small">Riesgos Bajos</div><div class="big" id="analisisRiesgosBajos">${bajos.length}</div></div>
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

            var riesgos = (proyecto.riesgos || []).slice().sort(compararRiesgos);
            var color = { 'Crítico': '#B42318', 'Alto': '#F79009', 'Medio': '#A16207', 'Bajo': '#2F6E4E' };
            var html = '<table class="matriz-pxi"><caption class="sr-only">Matriz cualitativa de probabilidad e impacto (5×5)</caption><thead><tr><th scope="col">Impacto ↓ / Probabilidad →</th>';
            for (var p = 1; p <= 5; p++) html += '<th scope="col">' + p + '</th>';
            html += '</tr></thead><tbody>';

            for (var i = 5; i >= 1; i--) {
                html += '<tr><th scope="row">' + i + '</th>';
                for (var pr = 1; pr <= 5; pr++) {
                    var enCelda = riesgos.filter(function(r) {
                        return r.probabilidad === pr && r.impacto === i && esRiesgoAbierto(r);
                    });
                    var score = pr * i;
                    var nivel = nivelRiesgo(score);
                    var nombres = enCelda.map(function(r) { return r.nombre; }).join(', ');
                    html += '<td class="matriz-pxi-celda matriz-pxi-' + nivel.toLowerCase() + '"'
                        + ' style="--celda:' + color[nivel] + '"'
                        + (nombres ? ' title="' + escapeHtml(nombres) + '"' : '')
                        + ' aria-label="Probabilidad ' + pr + ', impacto ' + i + ', ' + nivel + ', ' + enCelda.length + ' riesgos">'
                        + '<span class="matriz-pxi-num">' + enCelda.length + '</span>'
                        + '<span class="matriz-pxi-score">' + score + '</span></td>';
                }
                html += '</tr>';
            }
            html += '</tbody></table>';
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

        function calcularEMV(riesgos, valorProyecto) {
            var reserva = 0;
            var monedaOrigen = (typeof proyecto !== 'undefined' && proyecto && (proyecto.monedaVenta || proyecto.monedaBase)) || 'EUR';
            var monedaBase = (typeof proyecto !== 'undefined' && proyecto && proyecto.monedaBase) || 'EUR';
            (riesgos || []).filter(esRiesgoAbierto).forEach(function(r) {
                var probabilidad = Math.min(5, Math.max(1, r.probabilidad || 1)) / 5;
                var impactoBase = (r.impactoMonetario > 0)
                    ? (typeof aBase === 'function' ? aBase(r.impactoMonetario, monedaOrigen, monedaBase) : r.impactoMonetario)
                    : (valorProyecto || 0) * (Math.min(5, Math.max(1, r.impacto || 1)) / 5);
                reserva += (r.tipo === 'Oportunidad' ? -1 : 1) * probabilidad * impactoBase;
            });
            return reserva;
        }

        function calcularValorEsperado() {
            const valorEntrada = parseFloat(document.getElementById('valorProyectoRiesgos').value) || 0;
            const monedaEntrada = proyecto.monedaVenta || proyecto.monedaBase || 'EUR';
            let valorProyecto = valorEntrada > 0 && typeof aBase === 'function'
                ? aBase(valorEntrada, monedaEntrada, proyecto.monedaBase || 'EUR')
                : (typeof precioVentaEnBase === 'function' ? precioVentaEnBase(proyecto) : (proyecto.precioVenta || 0));
            normalizarRiesgos();
            calcularEstadisticasRiesgos();
            let reserva = calcularEMV(proyecto.riesgos, valorProyecto);
            document.getElementById('reservaContingencia').value = formatearMoneda(reserva);
            mostrarToast(` Reserva de contingencia (EMV): ${formatearMoneda(reserva)}`, 'success');
        }

        function abrirModalNuevaAccionMitigacion() {
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Nueva Acción</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <div class="form-group"><label for="accRiesgoId">Riesgo asociado</label><select id="accRiesgoId" aria-label="Riesgo asociado">${(proyecto.riesgos || []).map(r => `<option value="${Number(r.id) || 0}">${escapeHtml(r.nombre)}</option>`).join('')}</select></div>
                <div class="form-group"><label for="accFecha">Fecha</label><input type="date" id="accFecha" aria-label="Fecha de la acción" value="${new Date().toISOString().split('T')[0]}"></div>
                <div class="form-group"><label for="accAccion">Acción tomada</label><textarea rows="2" id="accAccion" aria-label="Acción tomada"></textarea></div>
                <div class="form-group"><label for="accResponsable">Responsable</label><input type="text" id="accResponsable" aria-label="Responsable de la acción"></div>
                <div class="form-group"><label for="accEstado">Estado</label><select id="accEstado" aria-label="Estado de la acción"><option value="Pendiente">Pendiente</option><option value="En progreso">En progreso</option><option value="Completada">Completada</option></select></div>
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
            if (!tbody) return;
            if (!proyecto.accionesMitigacion || proyecto.accionesMitigacion.length === 0) { tbody.innerHTML = '<tr><td colspan="6">No hay acciones</td></tr>'; return; }
            tbody.innerHTML = proyecto.accionesMitigacion.map(a => `<tr>
                <td><strong>${escapeHtml(a.riesgoNombre)}</strong></td>
                <td>${formatearFechaEspa(a.fecha)}</td>
                <td>${escapeHtml(a.accion || '-')}</td>
                <td>${escapeHtml(a.responsable || '-')}</td>
                <td><span class="badge-${a.estado === 'Completada' ? 'completado' : 'progreso'}">${escapeHtml(a.estado || 'Pendiente')}</span></td>
                <td><button class="btn btn-danger btn-small btn-icon-only" onclick="eliminarAccionMitigacion(${Number(a.id) || 0})" title="Eliminar acción" aria-label="Eliminar acción de mitigación"><i data-feather="trash-2"></i></button></td>
                </tr>`).join('');
        }

        function eliminarAccionMitigacion(id) {
            if (confirm(tApp('confirmar_eliminar_accion'))) { proyecto.accionesMitigacion = proyecto.accionesMitigacion.filter(a => Number(a.id) !== Number(id)); guardarProyecto(); renderizarAccionesMitigacion(); mostrarToast(tApp('toast_eliminado'), 'success'); }
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
                    + '<p style="margin:5px 0 0;font-size:13px;color:#666">Generado: ' + new Date().toLocaleDateString('es-ES') + '</p>';
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