        function renderizarStakeholders() {
            const container = document.getElementById('stakeholdersContent');
            if (!proyecto.stakeholders || proyecto.stakeholders.length === 0) {
                container.innerHTML = '<div class="info-card u-mb-20"><div class="u-text-center" style="padding:24px"> No hay stakeholders registrados. Haz clic en " Añadir" para crear uno.</div></div>';
                return;
            }
            proyecto.stakeholders.forEach(s => {
                if (typeof s.poder === 'string') s.poder = { Alto: 4, Medio: 3, Bajo: 2 }[s.poder] || 3;
                if (typeof s.interes === 'string') s.interes = { Alto: 4, Medio: 3, Bajo: 2 }[s.interes] || 3;
                if (s.empresa === undefined) s.empresa = '';
                if (s.puesto === undefined) s.puesto = '';
                if (s.email === undefined) s.email = '';
                if (s.telefono === undefined) s.telefono = '';
                if (s.pais === undefined) s.pais = '';
            });
            
            const altaPoderAltoInteres = proyecto.stakeholders.filter(s => s.poder >= 3 && s.interes >= 3);
            const altaPoderBajoInteres = proyecto.stakeholders.filter(s => s.poder >= 3 && s.interes < 3);
            const bajoPoderAltoInteres = proyecto.stakeholders.filter(s => s.poder < 3 && s.interes >= 3);
            const bajoPoderBajoInteres = proyecto.stakeholders.filter(s => s.poder < 3 && s.interes < 3);
            
            const cardTemplate = s => `<div class="stakeholder-card"><strong>${escapeHtml(s.nombre)}</strong><br>${escapeHtml(s.rol || '')}${s.empresa ? '<br><span style="font-size:10px;opacity:0.6">' + escapeHtml(s.empresa) + '</span>' : ''}${s.email ? '<br><span style="font-size:10px;opacity:0.5">' + escapeHtml(s.email) + '</span>' : ''}</div>`;
            
            container.innerHTML = `
                <div class="info-card u-mb-20">
                    <h4 style="margin-bottom:16px"> Matriz Poder / Interés</h4>
                    <div class="matrix-container">
                        <div class="matrix-quadrant"><div class="quadrant-header high-power">Alto Poder / Alto Interés<br> Gestionar Cerca</div><div class="quadrant-content">${altaPoderAltoInteres.map(cardTemplate).join('') || '<div class="u-color-muted u-text-center" style="padding:8px">—</div>'}</div></div>
                        <div class="matrix-quadrant"><div class="quadrant-header low-power">Alto Poder / Bajo Interés<br> Mantener Satisfecho</div><div class="quadrant-content">${altaPoderBajoInteres.map(cardTemplate).join('') || '<div class="u-color-muted u-text-center" style="padding:8px">—</div>'}</div></div>
                        <div class="matrix-quadrant"><div class="quadrant-header high-power">Bajo Poder / Alto Interés<br> Mantener Informado</div><div class="quadrant-content">${bajoPoderAltoInteres.map(cardTemplate).join('') || '<div class="u-color-muted u-text-center" style="padding:8px">—</div>'}</div></div>
                        <div class="matrix-quadrant"><div class="quadrant-header low-power">Bajo Poder / Bajo Interés<br> Monitorear</div><div class="quadrant-content">${bajoPoderBajoInteres.map(cardTemplate).join('') || '<div class="u-color-muted u-text-center" style="padding:8px">—</div>'}</div></div>
                    </div>
                </div>
                <div class="info-card">
                    <h4 style="margin-bottom:16px"> Lista de Stakeholders</h4>
                    <table class="data-table"><thead><tr><th>Nombre</th><th>Empresa</th><th>Puesto</th><th>Rol</th><th>Email</th><th>Teléfono</th><th>País</th><th>Poder</th><th>Interés</th><th>Acciones</th></tr></thead><tbody>
                        ${proyecto.stakeholders.map(s => `
                            <tr>
                                    <td>${escapeHtml(s.nombre)}</td>
                                    <td>${escapeHtml(s.empresa || '-')}</td>
                                    <td>${escapeHtml(s.puesto || '-')}</td>
                                    <td>${escapeHtml(s.rol || '-')}</td>
                                    <td>${escapeHtml(s.email || '-')}</td>
                                    <td>${escapeHtml(s.telefono || '-')}</td>
                                    <td>${escapeHtml(s.pais || '-')}</td>
                                    <td>${s.poder || 0}/5</td>
                                    <td>${s.interes || 0}/5</td>
                                    <td><span class="edit-btn" onclick="editarStakeholder(${s.id})"></span><span class="delete-btn" onclick="eliminarStakeholder(${s.id})"></span></td>
                            </tr>
                        `).join('')}
                    </tbody></table>
                </div>
            `;
        }
        
        function abrirModalStakeholder() {
    // Crear modal con inputs editables y forzar z-index/focus
    const modalHtml = `
      <div class="modal-content" role="dialog" aria-modal="true" aria-label="Añadir stakeholder">
        <div class="modal-header">
          <h3> ${tApp('stakeholders_nuevo') || 'Añadir stakeholder'}</h3>
          <span class="close-modal" onclick="cerrarModalGeneric()" aria-label="Cerrar">&times;</span>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="stkNombre">Nombre</label>
            <input id="stkNombre" type="text" class="u-w-full" autocomplete="off" />
          </div>
          <div class="form-row">
            <div class="form-group u-flex-1">
              <label for="stkEmpresa">Empresa</label>
              <input id="stkEmpresa" type="text" class="u-w-full" />
            </div>
            <div class="form-group u-flex-1">
              <label for="stkPuesto">Puesto</label>
              <input id="stkPuesto" type="text" class="u-w-full" />
            </div>
          </div>
          <div class="form-group">
            <label for="stkRol">Rol en el proyecto</label>
            <input id="stkRol" type="text" class="u-w-full" />
          </div>
          <div class="form-row">
            <div class="form-group u-flex-1">
              <label for="stkEmail">Email</label>
              <input id="stkEmail" type="email" class="u-w-full" />
            </div>
            <div class="form-group u-flex-1">
              <label for="stkTelefono">Teléfono</label>
              <input id="stkTelefono" type="tel" class="u-w-full" />
            </div>
          </div>
          <div class="form-group">
            <label for="stkPais">País</label>
            <input id="stkPais" type="text" class="u-w-full" />
          </div>
          <div class="form-row">
            <div class="form-group u-flex-1">
              <label for="stkPoder">Poder</label>
              <select id="stkPoder" class="select-full">
                <option value="5">5 - Máximo</option>
                <option value="4">4 - Alto</option>
                <option value="3" selected>3 - Medio</option>
                <option value="2">2 - Bajo</option>
                <option value="1">1 - Mínimo</option>
              </select>
            </div>
            <div class="form-group u-flex-1">
              <label for="stkInteres">Interés</label>
              <select id="stkInteres" class="select-full">
                <option value="5">5 - Máximo</option>
                <option value="4">4 - Alto</option>
                <option value="3" selected>3 - Medio</option>
                <option value="2">2 - Bajo</option>
                <option value="1">1 - Mínimo</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="stkExpectativas">Expectativas</label>
            <textarea id="stkExpectativas" rows="3"></textarea>
          </div>
          <div class="u-action-row">
            <button class="btn btn-primary" onclick="guardarStakeholder()"> Guardar</button>
            <button class="btn btn-secondary" onclick="cerrarModalGeneric()"> Cancelar</button>
          </div>
        </div>
      </div>
    `;

    // Remover modal previo si existe
    const existing = document.getElementById('genericModal');
    if (existing) existing.remove();

    // Insertar en body (evita overlays dentro de paneles)
    const modalDiv = document.createElement('div');
    modalDiv.id = 'genericModal';
    modalDiv.className = 'modal';
    modalDiv.style.display = 'flex';
    modalDiv.style.zIndex = '20000'; // forzar por encima de overlays
    modalDiv.innerHTML = modalHtml;
    document.body.appendChild(modalDiv);

    // Cerrar al pulsar fuera del contenido
    modalDiv.addEventListener('click', (e) => { if (e.target === modalDiv) cerrarModalGeneric(); });

    // Forzar focus en primer input
    setTimeout(() => {
      const first = document.getElementById('stkNombre');
      if (first) {
        first.focus();
        first.select && first.select();
      }
    }, 50);
}

// Implementación mínima para guardar (evita inputs deshabilitados)
function guardarStakeholder() {
    const nombre = document.getElementById('stkNombre')?.value?.trim();
    if (!nombre) { mostrarToast(' El nombre es obligatorio', 'error'); return; }

    if (!proyecto) proyecto = {};
    if (!proyecto.stakeholders) proyecto.stakeholders = [];

    const nuevo = {
      id: Date.now(),
      nombre,
      empresa: document.getElementById('stkEmpresa')?.value || '',
      puesto: document.getElementById('stkPuesto')?.value || '',
      rol: document.getElementById('stkRol')?.value || '',
      email: document.getElementById('stkEmail')?.value || '',
      telefono: document.getElementById('stkTelefono')?.value || '',
      pais: document.getElementById('stkPais')?.value || '',
      poder: parseInt(document.getElementById('stkPoder')?.value) || 3,
      interes: parseInt(document.getElementById('stkInteres')?.value) || 3,
      expectativas: document.getElementById('stkExpectativas')?.value || ''
    };

    proyecto.stakeholders.push(nuevo);
    guardarProyecto && guardarProyecto();
    renderizarStakeholders && renderizarStakeholders();
    cerrarModalGeneric();
    mostrarToast(` Stakeholder "${nombre}" añadido`, 'success');
}
        
        
        function editarStakeholder(id) {
            let s = proyecto.stakeholders.find(s => s.id === id);
            if (!s) return;
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Editar</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="stakeId" value="${s.id}">
                <div class="form-group"><label>Nombre</label><input type="text" id="stakeNombre" value="${escapeHtml(s.nombre)}"></div>
                <div class="form-row"><div class="form-group u-flex-1"><label>Empresa</label><input type="text" id="stakeEmpresa" value="${escapeHtml(s.empresa || '')}"></div>
                <div class="form-group u-flex-1"><label>Puesto</label><input type="text" id="stakePuesto" value="${escapeHtml(s.puesto || '')}"></div></div>
                <div class="form-group"><label>Rol en el proyecto</label><input type="text" id="stakeRol" value="${escapeHtml(s.rol || '')}"></div>
                <div class="form-row"><div class="form-group u-flex-1"><label>Email</label><input type="email" id="stakeEmail" value="${escapeHtml(s.email || '')}"></div>
                <div class="form-group u-flex-1"><label>Teléfono</label><input type="tel" id="stakeTelefono" value="${escapeHtml(s.telefono || '')}"></div></div>
                <div class="form-group"><label>País</label><input type="text" id="stakePais" value="${escapeHtml(s.pais || '')}"></div>
                <div class="form-row"><div class="form-group"><label>Poder</label><input type="range" id="stakePoder" min="1" max="5" value="${s.poder}" oninput="document.getElementById('poderVal').innerText=this.value"><span id="poderVal">${s.poder}</span></div>
                <div class="form-group"><label>Interés</label><input type="range" id="stakeInteres" min="1" max="5" value="${s.interes}" oninput="document.getElementById('interesVal').innerText=this.value"><span id="interesVal">${s.interes}</span></div></div>
                <div class="form-group"><label>Expectativas</label><textarea rows="2" id="stakeExpectativas">${escapeHtml(s.expectativas || '')}</textarea></div>
                <button class="btn btn-primary" onclick="actualizarStakeholder()">Actualizar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function actualizarStakeholder() {
            let id = parseInt(document.getElementById('stakeId').value);
            let idx = proyecto.stakeholders.findIndex(s => s.id === id);
            if (idx >= 0) {
                proyecto.stakeholders[idx] = {
                    id: id,
                    nombre: document.getElementById('stakeNombre').value,
                    empresa: document.getElementById('stakeEmpresa').value,
                    puesto: document.getElementById('stakePuesto').value,
                    rol: document.getElementById('stakeRol').value,
                    email: document.getElementById('stakeEmail').value,
                    telefono: document.getElementById('stakeTelefono').value,
                    pais: document.getElementById('stakePais').value,
                    poder: parseInt(document.getElementById('stakePoder').value),
                    interes: parseInt(document.getElementById('stakeInteres').value),
                    expectativas: document.getElementById('stakeExpectativas').value
                };
                guardarProyecto();
                renderizarStakeholders();
                renderizarRACI();
                cerrarModalGeneric();
                mostrarToast(tApp('toast_stakeholder_actualizado'), 'success');
            }
        }

        function eliminarStakeholder(id) {
            if (confirm('¿Eliminar este stakeholder?')) {
                const s = proyecto.stakeholders.find(s => s.id === id);
                proyecto.stakeholders = proyecto.stakeholders.filter(s => s.id !== id);
                if (proyecto.raci) proyecto.raci = proyecto.raci.filter(r => r.stakeholderId !== id);
                guardarProyecto();
                renderizarStakeholders();
                mostrarToast(` Stakeholder "${s?.nombre}" eliminado`, 'success');
            }
        }
        
       
        
        // ============================================
        // MATRIZ RACI
        // ============================================
        function renderizarRACI() {
            const container = document.getElementById('raciContent');
            if (!proyecto.stakeholders || proyecto.stakeholders.length === 0) {
                container.innerHTML = '<div class="info-card">No hay stakeholders registrados. Agrega stakeholders primero.</div>';
                return;
            }
            
            const actividades = ['Acta Constitución', 'Planificación', 'Ejecución', 'Monitoreo', 'Cierre', 'Aprobaciones', 'Comunicaciones', 'Riesgos'];
            if (!proyecto.raci) proyecto.raci = [];
            
            let html = '<div class="raci-table"><table class="data-table"><thead><tr><th>Actividad</th>';
            proyecto.stakeholders.forEach(s => html += `<th>${escapeHtml(s.nombre.substring(0,15))}</th>`);
            html += '</tr></thead><tbody>';
            
            actividades.forEach(act => {
                html += `<tr><td><strong>${act}</strong></td>`;
                proyecto.stakeholders.forEach(s => {
                    let valor = (proyecto.raci || []).find(r => r.actividad === act && r.stakeholderId === s.id)?.rol || '';
                    html += `<td><select class="raci-select" onchange="guardarRACI('${act}', ${s.id}, this.value)"><option value="">-</option><option value="R" ${valor === 'R' ? 'selected' : ''}>R</option><option value="A" ${valor === 'A' ? 'selected' : ''}>A</option><option value="C" ${valor === 'C' ? 'selected' : ''}>C</option><option value="I" ${valor === 'I' ? 'selected' : ''}>I</option></select></td>`;
                });
                html += '</tr>';
            });
            html += '</tbody></table><div class="info-card u-mt-16"><small>R=Responsable, A=Accountable, C=Consultado, I=Informado</small></div></div>';
            container.innerHTML = html;
        }

        // ============================================
        // INFORME INTELIGENTE DE MATRIZ RACI
        // ============================================
        
        function generarInformeRACI() {
            const informeContainer = document.getElementById('raciInforme');
            if (!informeContainer) return;
            
            if (!proyecto.stakeholders || proyecto.stakeholders.length === 0) {
                mostrarToast(" No hay stakeholders registrados. Agrega stakeholders primero.", 'error');
                return;
            }
            
            // Recopilar datos de la matriz RACI
            const raciData = proyecto.raci || [];
            const stakeholders = proyecto.stakeholders;
            
            // Actividades: fijas + tareas del cronograma + entregables
            const actividades = (typeof getActividadesRACI === 'function') ? getActividadesRACI() : ['Acta Constitución', 'Planificación', 'Ejecución', 'Monitoreo', 'Cierre', 'Aprobaciones', 'Comunicaciones', 'Riesgos'].map((nombre, i) => ({ key: 'fija:' + i, nombre }));
            
            // 1. DETECTAR BRECHAS (tareas sin R o sin A)
            const brechas = [];
            actividades.forEach(act => {
                const asignaciones = raciData.filter(r => (r.actividadKey && r.actividadKey === act.key) || r.actividad === act.nombre);
                const tieneR = asignaciones.some(a => a.rol === 'R');
                const tieneA = asignaciones.some(a => a.rol === 'A');
                if (!tieneR) brechas.push({ actividad: act.nombre, tipo: 'R', mensaje: 'No hay nadie responsable (R) de esta actividad' });
                if (!tieneA) brechas.push({ actividad: act.nombre, tipo: 'A', mensaje: 'No hay nadie accountable (A) para esta actividad' });
            });
            
            // 2. DETECTAR SOBRECARGA (personas con muchas R)
            const cargaPorStakeholder = {};
            stakeholders.forEach(s => {
                cargaPorStakeholder[s.id] = { nombre: s.nombre, rol: s.rol || 'Stakeholder', countR: 0, countA: 0, actividadesR: [], actividadesA: [] };
            });
            
            raciData.forEach(r => {
                if (cargaPorStakeholder[r.stakeholderId]) {
                    if (r.rol === 'R') {
                        cargaPorStakeholder[r.stakeholderId].countR++;
                        cargaPorStakeholder[r.stakeholderId].actividadesR.push(r.actividad);
                    } else if (r.rol === 'A') {
                        cargaPorStakeholder[r.stakeholderId].countA++;
                        cargaPorStakeholder[r.stakeholderId].actividadesA.push(r.actividad);
                    }
                }
            });
            
            const sobrecargados = Object.values(cargaPorStakeholder).filter(s => s.countR > 3);
            const sinActividades = Object.values(cargaPorStakeholder).filter(s => s.countR === 0 && s.countA === 0);
            
            // 3. ANÁLISIS POR ROL (quién hace qué, quién decide)
            const responsables = [];
            const accountable = [];
            const consultados = [];
            const informados = [];
            
            raciData.forEach(r => {
                const stakeholder = stakeholders.find(s => s.id === r.stakeholderId);
                const nombre = stakeholder ? stakeholder.nombre : 'Desconocido';
                if (r.rol === 'R') responsables.push({ nombre, actividad: r.actividad });
                if (r.rol === 'A') accountable.push({ nombre, actividad: r.actividad });
                if (r.rol === 'C') consultados.push({ nombre, actividad: r.actividad });
                if (r.rol === 'I') informados.push({ nombre, actividad: r.actividad });
            });
            
            // Generar el informe HTML
            const saludGeneral = brechas.length === 0 ? (sobrecargados.length === 0 ? 'excelente' : 'buena') : (brechas.length > 2 ? 'critica' : 'regular');
            const saludColor = saludGeneral === 'excelente' ? '#00A859' : (saludGeneral === 'buena' ? '#FF8C00' : '#FF3B30');
            const saludTexto = saludGeneral === 'excelente' ? 'Excelente' : (saludGeneral === 'buena' ? 'Buena (requiere atención)' : 'Crítica (acción inmediata)');
            
            let html = `
                <div class="raci-report-title">
                    <span></span> INFORME INTELIGENTE DE MATRIZ RACI
                    <span style="font-size: 12px; color: rgba(255,255,255,0.5);">${new Date().toLocaleString()}</span>
                </div>
                
                <!-- ¿PARA QUÉ SIRVE LA MATRIZ RACI? -->
                <div class="raci-report-section raci-info">
                    <h4> ¿PARA QUÉ SIRVE LA MATRIZ RACI?</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <div>
                            <div class="u-fw-600"> Eliminar confusiones</div>
                            <p class="u-p-sm">Responde preguntas como: <strong>"¿Quién hace qué?"</strong>, <strong>"¿Quién decide?"</strong> y <strong>"¿A quién le informo?"</strong></p>
                        </div>
                        <div>
                            <div class="u-fw-600"> Prevenir conflictos</div>
                            <p class="u-p-sm">Al dejar claro quién es el aprobador final (A), se evitan luchas de poder o decisiones bloqueadas.</p>
                        </div>
                        <div>
                            <div class="u-fw-600"> Identificar sobrecarga</div>
                            <p class="u-p-sm">Si una persona aparece como <span class="raci-badge raci-badge-r">R</span> en demasiadas tareas, está claro que está sobrecargada.</p>
                        </div>
                        <div>
                            <div class="u-fw-600"> Detectar brechas</div>
                            <p class="u-p-sm">Si una tarea no tiene ninguna <span class="raci-badge raci-badge-r">R</span> o ninguna <span class="raci-badge raci-badge-a">A</span>, nadie la hará ni responderá por ella.</p>
                        </div>
                    </div>
                </div>
                
                <!-- SIGNIFICADO DE LOS ROLES RACI -->
                <div class="raci-report-section">
                    <h4> SIGNIFICADO DE CADA ROL</h4>
                    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                        <div><span class="raci-badge raci-badge-r">R</span> <strong>Responsible</strong><br><span class="u-fs-11">Quien ejecuta la tarea</span></div>
                        <div><span class="raci-badge raci-badge-a">A</span> <strong>Accountable</strong><br><span class="u-fs-11">Quien responde por el resultado</span></div>
                        <div><span class="raci-badge raci-badge-c">C</span> <strong>Consulted</strong><br><span class="u-fs-11">Quien debe ser consultado</span></div>
                        <div><span class="raci-badge raci-badge-i">I</span> <strong>Informed</strong><br><span class="u-fs-11">Quien debe ser informado</span></div>
                    </div>
                </div>
                
                <!-- SALUD GENERAL DE LA MATRIZ -->
                <div class="raci-report-section" style="border-left: 4px solid ${saludColor};">
                    <h4> SALUD GENERAL DE LA MATRIZ RACI</h4>
                    <div style="font-size: 24px; font-weight: bold; color: ${saludColor};">${saludTexto}</div>
                    <div style="margin-top: 8px; display: flex; gap: 16px; flex-wrap: wrap;">
                        <div> Actividades totales: ${actividades.length}</div>
                        <div> Asignaciones RACI: ${raciData.length}</div>
                        <div> Stakeholders: ${stakeholders.length}</div>
                    </div>
                </div>
            `;
            
            // SECCIÓN 1: DETECTAR BRECHAS
            if (brechas.length > 0) {
                html += `
                    <div class="raci-report-section raci-critical">
                        <h4> BRECHAS DETECTADAS (Actividades sin responsables)</h4>
                        <p class="u-fs-12 u-mb-12"> Las siguientes actividades no tienen asignados los roles necesarios:</p>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            ${brechas.map(b => `
                                <div style="background: rgba(255,59,48,0.15); padding: 8px; border-radius: 8px;">
                                    <strong>${escapeHtml(b.actividad)}</strong><br>
                                    <span class="u-fs-11"> ${b.mensaje}</span>
                                </div>
                            `).join('')}
                        </div>
                        <p class="u-fs-12 u-mt-12"> <strong>Recomendación:</strong> Asigna los roles faltantes para garantizar que todas las actividades tengan un responsable (R) y un accountable (A).</p>
                    </div>
                `;
            } else {
                html += `
                    <div class="raci-report-section raci-success">
                        <h4> SIN BRECHAS DETECTADAS</h4>
                        <p class="u-p-sm">Todas las actividades tienen asignados los roles <span class="raci-badge raci-badge-r">R</span> (Responsable) y <span class="raci-badge raci-badge-a">A</span> (Accountable). ¡Excelente!</p>
                    </div>
                `;
            }
            
            // SECCIÓN 2: SOBRECARGA DE TRABAJO
            if (sobrecargados.length > 0) {
                html += `
                    <div class="raci-report-section raci-warning">
                        <h4> SOBRECARGA DE TRABAJO DETECTADA</h4>
                        <p class="u-fs-12 u-mb-12">Las siguientes personas tienen demasiadas responsabilidades (R):</p>
                        ${sobrecargados.map(s => {
                            const loadPercent = Math.min(100, (s.countR / 5) * 100);
                            return `
                                <div class="u-mb-16">
                                    <div class="u-flex-jc-sb">
                                        <strong>${escapeHtml(s.nombre)}</strong>
                                        <span class="u-fs-11">${s.countR} actividades como R</span>
                                    </div>
                                    <div class="stakeholder-load-bar">
                                        <div class="stakeholder-load-fill" style="width: ${loadPercent}%;"></div>
                                    </div>
                                    <div style="font-size: 11px; color: rgba(255,255,255,0.6);">
                                        Actividades: ${s.actividadesR.map(a => escapeHtml(a)).join(', ')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                        <p class="u-fs-12 u-mt-12"> <strong>Recomendación:</strong> Distribuye las responsabilidades entre más personas para evitar cuellos de botella y agotamiento.</p>
                    </div>
                `;
            }
            
            // SECCIÓN 3: STAKEHOLDERS SIN PARTICIPACIÓN
            if (sinActividades.length > 0) {
                html += `
                    <div class="raci-report-section raci-info">
                        <h4> STAKEHOLDERS SIN PARTICIPACIÓN</h4>
                        <p class="u-fs-12 u-mb-12">Los siguientes stakeholders no tienen ningún rol asignado en la matriz RACI:</p>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${sinActividades.map(s => `
                                <span style="background: rgba(0,122,255,0.2); padding: 4px 12px; border-radius: 16px; font-size: 12px;">${escapeHtml(s.nombre)}</span>
                            `).join('')}
                        </div>
                        <p class="u-fs-12 u-mt-12"> <strong>Recomendación:</strong> Considera si estos stakeholders deberían tener algún rol (R, A, C o I) según su nivel de poder/interés.</p>
                    </div>
                `;
            }
            
            // SECCIÓN 4: ANÁLISIS POR ROL
            html += `
                <div class="raci-report-section">
                    <h4> ANÁLISIS POR ROL</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                        <div style="background: rgba(0,122,255,0.1); padding: 12px; border-radius: 12px;">
                            <div class="u-fw-600 u-mb-8"><span class="raci-badge raci-badge-r">R</span> ¿QUIÉN HACE QUÉ?</div>
                            ${responsables.length > 0 ? `
                                <div class="u-fs-12 u-scroll-150">
                                    ${responsables.map(r => `<div>• <strong>${escapeHtml(r.nombre)}</strong>: ${escapeHtml(r.actividad)}</div>`).join('')}
                                </div>
                            ` : '<p class="u-p-sm">No hay responsables asignados</p>'}
                        </div>
                        <div style="background: rgba(255,59,48,0.1); padding: 12px; border-radius: 12px;">
                            <div class="u-fw-600 u-mb-8"><span class="raci-badge raci-badge-a">A</span> ¿QUIÉN DECIDE?</div>
                            ${accountable.length > 0 ? `
                                <div class="u-fs-12 u-scroll-150">
                                    ${accountable.map(a => `<div>• <strong>${escapeHtml(a.nombre)}</strong>: ${escapeHtml(a.actividad)}</div>`).join('')}
                                </div>
                            ` : '<p class="u-p-sm">No hay accountable asignados</p>'}
                        </div>
                        <div style="background: rgba(255,140,0,0.1); padding: 12px; border-radius: 12px;">
                            <div class="u-fw-600 u-mb-8"><span class="raci-badge raci-badge-c">C</span> ¿A QUIÉN CONSULTAR?</div>
                            ${consultados.length > 0 ? `
                                <div class="u-fs-12 u-scroll-150">
                                    ${consultados.map(c => `<div>• <strong>${escapeHtml(c.nombre)}</strong>: ${escapeHtml(c.actividad)}</div>`).join('')}
                                </div>
                            ` : '<p class="u-p-sm">No hay consultores asignados</p>'}
                        </div>
                        <div style="background: rgba(52,199,89,0.1); padding: 12px; border-radius: 12px;">
                            <div class="u-fw-600 u-mb-8"><span class="raci-badge raci-badge-i">I</span> ¿A QUIÉN INFORMAR?</div>
                            ${informados.length > 0 ? `
                                <div class="u-fs-12 u-scroll-150">
                                    ${informados.map(i => `<div>• <strong>${escapeHtml(i.nombre)}</strong>: ${escapeHtml(i.actividad)}</div>`).join('')}
                                </div>
                            ` : '<p class="u-p-sm">No hay informados asignados</p>'}
                        </div>
                    </div>
                </div>
            `;
            
            // SECCIÓN 5: RESUMEN EJECUTIVO
            html += `
                <div class="raci-report-section raci-info">
                    <h4> RESUMEN EJECUTIVO PARA LA DIRECCIÓN</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <div>
                            <div> <strong>Puntos fuertes:</strong></div>
                            <ul style="font-size: 12px; margin-left: 20px;">
                                <li>Hay ${stakeholders.length} stakeholders identificados</li>
                                <li>Se han definido ${raciData.length} asignaciones RACI</li>
                                ${brechas.length === 0 ? '<li>Todas las actividades tienen responsable y accountable</li>' : ''}
                            </ul>
                        </div>
                        <div>
                            <div> <strong>Áreas de mejora:</strong></div>
                            <ul style="font-size: 12px; margin-left: 20px;">
                                ${brechas.length > 0 ? `<li>${brechas.length} brecha(s) sin responsable</li>` : ''}
                                ${sobrecargados.length > 0 ? `<li>${sobrecargados.length} persona(s) sobrecargadas</li>` : ''}
                                ${sinActividades.length > 0 ? `<li>${sinActividades.length} stakeholder(s) sin participación</li>` : ''}
                                ${brechas.length === 0 && sobrecargados.length === 0 && sinActividades.length === 0 ? '<li>No se detectaron problemas - Matriz saludable</li>' : ''}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            
            informeContainer.innerHTML = html;
            informeContainer.style.display = 'block';
            
            // Hacer scroll al informe
            informeContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            mostrarToast(" Informe RACI generado exitosamente", 'success');
        }
        
        function guardarRACI(actividad, stakeholderId, rol) {
            if (!proyecto.raci) proyecto.raci = [];
            let idx = proyecto.raci.findIndex(r => r.actividad === actividad && r.stakeholderId === stakeholderId);
            if (rol === '') {
                if (idx >= 0) proyecto.raci.splice(idx, 1);
            } else {
                if (idx >= 0) proyecto.raci[idx].rol = rol;
                else proyecto.raci.push({ actividad, stakeholderId, rol });
            }
            guardarProyecto();
            mostrarToast(` Rol ${rol} asignado`, 'success');
        }
// ============================================
// MÓDULO DE RESUMEN DE GASTOS
// ============================================

let distribucionGastosChart = null;
