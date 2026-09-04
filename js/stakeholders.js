// ============================================
// MÓDULO: STAKEHOLDERS Y MATRIZ RACI
// ============================================

// Renderizar panel de stakeholders
function renderizarStakeholders() {
    const container = document.getElementById('panelStakeholders');
    if (!container) return;
    
    let stakeholders = proyecto.stakeholders || [];
    
    // Clasificar por matriz poder/interés
    let altaAlta = stakeholders.filter(s => s.poder >= 7 && s.interes >= 7);
    let altaBaja = stakeholders.filter(s => s.poder >= 7 && s.interes < 7);
    let bajaAlta = stakeholders.filter(s => s.poder < 7 && s.interes >= 7);
    let bajaBaja = stakeholders.filter(s => s.poder < 7 && s.interes < 7);
    
    container.innerHTML = `
        <div class="panel-title">
            <span> Partes Interesadas (Stakeholders)</span>
            <button class="btn btn-primary btn-small" onclick="abrirModalStakeholder()"> Añadir Stakeholder</button>
        </div>
        
        <h4 style="margin-bottom: 12px;"> Matriz de Poder / Interés</h4>
        <div class="matrix-container">
            <div class="matrix-quadrant">
                <div class="quadrant-header high-power"> Alto Poder / Alto Interés</div>
                <div class="quadrant-content" id="stAltaAlta">${renderStakeholderList(altaAlta)}</div>
            </div>
            <div class="matrix-quadrant">
                <div class="quadrant-header high-power"> Alto Poder / Bajo Interés</div>
                <div class="quadrant-content" id="stAltaBaja">${renderStakeholderList(altaBaja)}</div>
            </div>
            <div class="matrix-quadrant">
                <div class="quadrant-header low-power"> Bajo Poder / Alto Interés</div>
                <div class="quadrant-content" id="stBajaAlta">${renderStakeholderList(bajaAlta)}</div>
            </div>
            <div class="matrix-quadrant">
                <div class="quadrant-header low-power"> Bajo Poder / Bajo Interés</div>
                <div class="quadrant-content" id="stBajaBaja">${renderStakeholderList(bajaBaja)}</div>
            </div>
        </div>
        
        <h4 style="margin-top: 24px; margin-bottom: 12px;"> Matriz RACI</h4>
        <div style="overflow-x: auto;">
            <table class="raci-table" id="raciTable">
                <thead>
                    <tr><th>Entregable / Fase</th><th id="raciHeaders"></th></tr>
                </thead>
                <tbody id="raciBody"></tbody>
            </table>
        </div>
        <div style="margin-top: 12px; padding: 8px; background: #e8f0fe; border-radius: 6px; font-size: 11px;">
            <strong> Leyenda RACI:</strong> 
            <span style="background:#00A85920; padding:2px 6px; border-radius:4px;">R = Responsible (Ejecuta)</span> 
            <span style="background:#0070C020; padding:2px 6px; border-radius:4px;">A = Accountable (Aprueba)</span> 
            <span style="background:#FF8C0020; padding:2px 6px; border-radius:4px;">C = Consulted (Consultado)</span> 
            <span style="background:#888820; padding:2px 6px; border-radius:4px;">I = Informed (Informado)</span>
        </div>
    `;
    
    renderizarRACI();
}

// Renderizar lista de stakeholders
function renderStakeholderList(lista) {
    if (!lista || lista.length === 0) {
        return '<div style="color: #999; text-align: center; padding: 20px;">Sin stakeholders</div>';
    }
    
    return lista.map(s => `
        <div class="stakeholder-card">
            <div class="stakeholder-name">
                <strong>${escapeHtml(s.nombre)}</strong>
                <span style="font-size: 10px; color: #666;">(P:${s.poder} I:${s.interes})</span>
            </div>
            <div style="font-size: 10px; color: #555;">
                ${s.rol ? escapeHtml(s.rol) : ''}${s.empresa ? ` | ${escapeHtml(s.empresa)}` : ''}
            </div>
            <div style="font-size: 10px; color: #888; margin-top: 4px;">
                ${s.email ? ` ${escapeHtml(s.email)} ` : ''}${s.telefono ? ` ${escapeHtml(s.telefono)}` : ''}
            </div>
            <div class="stakeholder-actions" style="margin-top: 8px;">
                <span class="edit-btn" onclick="editarStakeholder(${s.id})"> Editar</span>
                <span class="delete-btn" onclick="eliminarStakeholder(${s.id})"> Eliminar</span>
            </div>
        </div>
    `).join('');
}

// Abrir modal para añadir/editar stakeholder
function abrirModalStakeholder(id = null) {
    let stakeholder = null;
    if (id) {
        stakeholder = proyecto.stakeholders.find(s => s.id === id);
    }
    
    const modalHtml = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${stakeholder ? ' Editar Stakeholder' : ' Nuevo Stakeholder'}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="stId" value="${stakeholder ? stakeholder.id : ''}">
            <div class="form-group">
                <label>Nombre completo *</label>
                <input type="text" id="stNombre" value="${stakeholder ? escapeHtml(stakeholder.nombre) : ''}" placeholder="Ej: Juan Pérez">
            </div>
            <div class="form-group">
                <label>Empresa / Organización</label>
                <input type="text" id="stEmpresa" value="${stakeholder ? escapeHtml(stakeholder.empresa || '') : ''}" placeholder="Ej: Tech Solutions S.A.">
            </div>
            <div class="form-group">
                <label>Cargo / Rol en el proyecto</label>
                <input type="text" id="stRol" value="${stakeholder ? escapeHtml(stakeholder.rol || '') : ''}" placeholder="Ej: Sponsor, Product Owner">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Correo electrónico</label>
                    <input type="email" id="stEmail" value="${stakeholder ? escapeHtml(stakeholder.email || '') : ''}" placeholder="correo@empresa.com">
                </div>
                <div class="form-group">
                    <label> Teléfono</label>
                    <input type="tel" id="stTelefono" value="${stakeholder ? escapeHtml(stakeholder.telefono || '') : ''}" placeholder="+34 612 345 678">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Idioma</label>
                    <select id="stIdioma">
                        <option value="Español" ${stakeholder?.idioma === 'Español' ? 'selected' : ''}>🇪🇸 Español</option>
                        <option value="Inglés" ${stakeholder?.idioma === 'Inglés' ? 'selected' : ''}>🇬🇧 Inglés</option>
                        <option value="Francés" ${stakeholder?.idioma === 'Francés' ? 'selected' : ''}>🇫🇷 Francés</option>
                        <option value="Portugués" ${stakeholder?.idioma === 'Portugués' ? 'selected' : ''}>🇵🇹 Portugués</option>
                        <option value="Alemán" ${stakeholder?.idioma === 'Alemán' ? 'selected' : ''}>🇩🇪 Alemán</option>
                        <option value="Árabe" ${stakeholder?.idioma === 'Árabe' ? 'selected' : ''}>🇸🇦 Árabe</option>
                    </select>
                </div>
                <div class="form-group">
                    <label> Ubicación / País</label>
                    <input type="text" id="stPais" value="${stakeholder ? escapeHtml(stakeholder.pais || '') : ''}" placeholder="Ej: España, México, Argelia">
                </div>
            </div>
            <div class="form-group">
                <label>Expectativas / Intereses en el proyecto</label>
                <textarea rows="2" id="stExpectativas" placeholder="¿Qué espera lograr con este proyecto?">${stakeholder ? escapeHtml(stakeholder.expectativas || '') : ''}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Poder (capacidad de influir) 1-10</label>
                    <select id="stPoder">
                        ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}" ${stakeholder?.poder === n ? 'selected' : ''}>${n} - ${n <= 3 ? 'Bajo' : n <= 7 ? 'Medio' : 'Alto'}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label> Interés (en el proyecto) 1-10</label>
                    <select id="stInteres">
                        ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}" ${stakeholder?.interes === n ? 'selected' : ''}>${n} - ${n <= 3 ? 'Bajo' : n <= 7 ? 'Medio' : 'Alto'}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label> Estrategia de gestión sugerida</label>
                <textarea rows="2" id="stEstrategia" placeholder="Ej: Reuniones semanales, informes mensuales...">${stakeholder ? escapeHtml(stakeholder.estrategia || '') : ''}</textarea>
            </div>
            <button class="btn btn-primary" onclick="guardarStakeholder()">Guardar Stakeholder</button>
        </div>
    `;
    
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `<div id="genericModal" class="modal" style="display:flex">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}


// Guardar stakeholder (nuevo o editado)
function guardarStakeholder() {
    const nombre = document.getElementById('stNombre').value.trim();
    if (!nombre) {
        mostrarToast(" El nombre del stakeholder es obligatorio", "error");
        return;
    }
    
    const id = document.getElementById('stId').value;
    const stakeholder = {
        id: id ? parseInt(id) : Date.now(),
        nombre: nombre,
        empresa: document.getElementById('stEmpresa').value,
        rol: document.getElementById('stRol').value,
        email: document.getElementById('stEmail').value,
        telefono: document.getElementById('stTelefono').value,
        idioma: document.getElementById('stIdioma').value,
        pais: document.getElementById('stPais').value,
        expectativas: document.getElementById('stExpectativas').value,
        poder: parseInt(document.getElementById('stPoder').value),
        interes: parseInt(document.getElementById('stInteres').value),
        estrategia: document.getElementById('stEstrategia').value
    };
    
    if (!proyecto.stakeholders) proyecto.stakeholders = [];
    
    if (id) {
        const index = proyecto.stakeholders.findIndex(s => s.id === parseInt(id));
        if (index >= 0) proyecto.stakeholders[index] = stakeholder;
        mostrarToast(` Stakeholder "${nombre}" actualizado`);
    } else {
        proyecto.stakeholders.push(stakeholder);
        mostrarToast(` Stakeholder "${nombre}" añadido`);
    }
    
    guardarProyecto();
    renderizarStakeholders();
    cerrarModalGeneric();
}

// Eliminar stakeholder
function eliminarStakeholder(id) {
    if (confirm("¿Eliminar este stakeholder?")) {
        const stakeholder = proyecto.stakeholders.find(s => s.id === id);
        proyecto.stakeholders = proyecto.stakeholders.filter(s => s.id !== id);
        
        // También eliminar referencias en RACI
        if (proyecto.raci) {
            proyecto.raci = proyecto.raci.filter(r => r.stakeholderId !== id);
        }
        
        guardarProyecto();
        renderizarStakeholders();
        mostrarToast(` Stakeholder "${stakeholder?.nombre}" eliminado`);
    }
}

// ============================================
// MATRIZ RACI
// ============================================

// Renderizar matriz RACI
function renderizarRACI() {
    const stakeholders = proyecto.stakeholders || [];
    const entregables = proyecto.entregables || [];
    
    if (stakeholders.length === 0) {
        const tbody = document.getElementById('raciBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding:40px;">Añade stakeholders para ver la matriz RACI</td></tr>';
        return;
    }
    
    if (entregables.length === 0) {
        const tbody = document.getElementById('raciBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding:40px;">Añade entregables para ver la matriz RACI</td></tr>';
        return;
    }
    
    // Cabeceras con nombres de stakeholders
    let headersHtml = '<th>Entregable / Actividad</th>';
    stakeholders.forEach(s => {
        headersHtml += `<th title="${escapeHtml(s.nombre)}">${escapeHtml(s.nombre.split(' ')[0])}</th>`;
    });
    document.getElementById('raciHeaders').innerHTML = headersHtml;
    
    // Filas por entregable
    let bodyHtml = '';
    entregables.forEach(e => {
        bodyHtml += `<tr>
            <td style="text-align: left;"><strong> ${escapeHtml(e.nombre)}</strong></td>`;
        
        stakeholders.forEach(s => {
            const valorActual = (proyecto.raci || []).find(r => r.itemId === e.id && r.stakeholderId === s.id)?.valor || '';
            bodyHtml += `<td>
                <select class="raci-select" onchange="actualizarRACI(${e.id}, ${s.id}, this.value)">
                    <option value="">-</option>
                    <option value="R" ${valorActual === 'R' ? 'selected' : ''}>R</option>
                    <option value="A" ${valorActual === 'A' ? 'selected' : ''}>A</option>
                    <option value="C" ${valorActual === 'C' ? 'selected' : ''}>C</option>
                    <option value="I" ${valorActual === 'I' ? 'selected' : ''}>I</option>
                </select>
            </td>`;
        });
        bodyHtml += `</tr>`;
    });
    
    document.getElementById('raciBody').innerHTML = bodyHtml;
}

// Actualizar valor RACI
function actualizarRACI(itemId, stakeholderId, valor) {
    if (!proyecto.raci) proyecto.raci = [];
    
    const existingIndex = proyecto.raci.findIndex(r => r.itemId === itemId && r.stakeholderId === stakeholderId);
    
    if (valor === '') {
        if (existingIndex >= 0) proyecto.raci.splice(existingIndex, 1);
    } else {
        if (existingIndex >= 0) {
            proyecto.raci[existingIndex].valor = valor;
        } else {
            proyecto.raci.push({ itemId, stakeholderId, valor });
        }
    }
    
    guardarProyecto();
    mostrarToast(` RACI actualizado`, "info");
}

// ============================================
// FUNCIONES ADICIONALES
// ============================================

// Obtener stakeholders para usar en otros módulos
function getStakeholdersList() {
    return proyecto.stakeholders || [];
}

// Obtener stakeholder por ID
function getStakeholderById(id) {
    return (proyecto.stakeholders || []).find(s => s.id === id);
}