        function renderizarStakeholders() {
            var container = document.getElementById('stakeholdersContent');
            var estiloActual = localStorage.getItem('pm_stakeholder_style') || 'v1';
            if (!proyecto.stakeholders || proyecto.stakeholders.length === 0) {
                container.innerHTML = '<div class="info-card u-mb-20"><div class="u-text-center" style="padding:24px"> No hay interesados registrados. Haz clic en " Añadir" para crear uno.</div></div>';
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
            
            function pmDerivarTipo(s) {
                if (s.tipo === 'interno' || s.tipo === 'externo') return s.tipo;
                var p = (s.pais || '').toLowerCase();
                var r = (s.rol || '').toLowerCase();
                var e = (s.empresa || '').toLowerCase();
                if (p.indexOf('institu') !== -1 || p.indexOf('gobierno') !== -1) return 'institucional';
                if (r.indexOf('proveed') !== -1 || r.indexOf('supplier') !== -1 || r.indexOf('vendor') !== -1) return 'proveedor';
                if (e.indexOf('proveed') !== -1 || e.indexOf('supplier') !== -1 || e.indexOf('vendor') !== -1) return 'proveedor';
                if (e.indexOf('cliente') !== -1 || e.indexOf('client') !== -1) return 'cliente';
                return 'interno';
            }
            function pmIniciales(nombre) {
                var parts = (nombre || '').trim().split(/\s+/);
                if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                return (parts[0] || '?').substring(0, 2).toUpperCase();
            }
            var pmTagIcons = {
                interno: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
                cliente: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
                proveedor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
                institucional: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
                externo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
            };
            function pmCardHtml(s, estilo, paleta) {
                var tipo = pmDerivarTipo(s);
                var inic = pmIniciales(s.nombre);
                if (estilo === 'v2') {
                    var tagLabel = {interno:'Interno',externo:'Externo',cliente:'Cliente',proveedor:'Proveedor',institucional:'Institucional'}[tipo] || tipo;
                    return '<div class="pm-card pm-card-v2" draggable="true" data-id="' + s.id + '" style="border-left:4px solid var(--v2-' + paleta + '-accent, #999);">'
                        + '<div class="pm-card-inner" style="display:flex;align-items:flex-start;gap:10px;width:100%;">'
                        + '<div class="pm-avatar pm-avatar-v2" style="background:var(--v2-' + paleta + '-accent, #999);width:40px;height:40px;min-width:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;">' + escapeHtml(inic) + '</div>'
                        + '<div class="pm-card-body" style="flex:1;min-width:0;">'
                        + '<div class="pm-card-name" style="font-size:14px;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escapeHtml(s.nombre) + '</div>'
                        + (s.rol ? '<div class="pm-card-role" style="font-size:12px;color:var(--text-secondary);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escapeHtml(s.rol) + '</div>' : '')
                        + (s.email ? '<div class="pm-card-email" style="font-size:11px;color:var(--text-tertiary,var(--text-secondary));margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escapeHtml(s.email) + '</div>' : '')
                        + '</div>'
                        + '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;">'
                        + '<span class="pm-type-pill">' + escapeHtml(tagLabel) + '</span>'
                        + '<span class="pm-card-menu" title="M\u00e1s opciones">&#8942;</span>'
                        + '</div>'
                        + '</div></div>';
                }
                var conIconoLateral = (tipo === 'interno' || tipo === 'externo');
                var tagLabel2 = {interno:'Interno',cliente:'Cliente',proveedor:'Proveedor',institucional:'Institucional',externo:'Externo'}[tipo];
                var nameLine = conIconoLateral
                    ? '<div class="pm-card-name pm-card-name-inline"><span class="pm-ico-tipo pm-ico-' + tipo + '">' + pmTagIcons[tipo] + '</span><span>' + escapeHtml(s.nombre) + '</span></div>'
                    : '<div class="pm-card-name">' + escapeHtml(s.nombre) + '</div>';
                return '<div class="pm-card" draggable="true" data-id="' + s.id + '">'
                    + '<div class="pm-avatar pm-avatar-' + tipo + '">' + escapeHtml(inic) + '</div>'
                    + '<div class="pm-card-body">'
                    + nameLine
                    + (s.rol ? '<div class="pm-card-role">' + escapeHtml(s.rol) + '</div>' : '')
                    + (s.email ? '<div class="pm-card-email">' + escapeHtml(s.email) + '</div>' : '')
                    + (conIconoLateral ? '' : '<div class="pm-tag pm-tag-' + tipo + '">' + pmTagIcons[tipo] + tagLabel2 + '</div>')
                    + '</div></div>';
            }

            var pmSvgInfo = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
            var pmSvgUsers = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';

            var pmBannerIcons = {
                gc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
                ms: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
                mi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
                mo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
            };

            var pmDescripciones = {
                gc: 'Mantener una comunicaci\u00f3n constante, involucrarlos en la toma de decisiones y gestionar sus expectativas de forma proactiva.',
                ms: 'Mantenerlos informados sobre los avances clave, asegurar su satisfacci\u00f3n y consultarles en decisiones importantes.',
                mi: 'Mantenenerlos informados de forma regular sobre el progreso, hitos y cambios relevantes del proyecto.',
                mo: 'Realizar un seguimiento per\u00f3dico, mantenerlos informados con informaci\u00f3n general y vigilar posibles cambios en su nivel de inter\u00e9s o poder.'
            };

            function pmColHtml(id, title, subtitle, cssClass, items, estilo, bannerNum) {
                var count = items.length;
                if (estilo === 'v2') {
                    var body = items.map(function (item) { return pmCardHtml(item, 'v2', cssClass); }).join('');
                    return '<div class="pm-col pm-col-v2 ' + cssClass + '" data-quadrant="' + id + '">'
                        + '<div class="pm-col-banner pm-banner-' + id + '">'
                        + '<span class="pm-banner-num">' + bannerNum + '</span>'
                        + '<div class="pm-banner-text"><div class="pm-banner-title">' + title + '</div><div class="pm-banner-subtitle">' + subtitle + '</div></div>'
                        + '<div class="pm-banner-icon">' + pmBannerIcons[id] + '</div>'
                        + '</div>'
                        + '<div class="pm-col-desc">' + (pmDescripciones[id] || '') + '</div>'
                        + '<div class="pm-col-count"><span class="pm-icon-people">' + pmSvgUsers + '</span> Stakeholders (' + count + ')</div>'
                        + '<div class="pm-col-body pm-col-body-v2" data-quadrant="' + id + '">' + body + '</div>'
                        + '</div>';
                }
                var badgeNum = '<div class="pm-col-badge">' + count + '</div>';
                var bodyV1 = items.map(function (item) { return pmCardHtml(item, 'v1', cssClass); }).join('');
                return '<div class="pm-col ' + cssClass + '" data-quadrant="' + id + '">'
                    + '<div class="pm-col-header"><div class="pm-col-header-top">' + pmSvgUsers + '<span class="pm-col-title">' + title + '</span></div><div class="pm-col-subtitle">' + subtitle + '</div>' + badgeNum + '</div>'
                    + '<div class="pm-col-body" data-quadrant="' + id + '">' + bodyV1 + '</div>'
                    + '</div>';
            }

            var pmMatrixHtml = '<div class="pm-matrix' + (estiloActual === 'v2' ? ' pm-matrix-v2' : '') + '">'
                + pmColHtml('gc', 'Gestionar Cerca', 'Alto Poder / Alto Inter\u00e9s', 'pm-col-red', altaPoderAltoInteres, estiloActual, '01')
                + pmColHtml('ms', 'Mantener Satisfecho', 'Alto Poder / Bajo Inter\u00e9s', 'pm-col-yellow', altaPoderBajoInteres, estiloActual, '02')
                + pmColHtml('mi', 'Mantener Informado', 'Bajo Poder / Alto Inter\u00e9s', 'pm-col-orange', bajoPoderAltoInteres, estiloActual, '03')
                + pmColHtml('mo', 'Monitorear', 'Bajo Poder / Bajo Inter\u00e9s', 'pm-col-green', bajoPoderBajoInteres, estiloActual, '04')
                + '</div>'
                + '<div class="pm-matrix-footer">'
                + '<div class="pm-matrix-hint">' + pmSvgInfo + ' Arrastra y suelta interesados entre columnas para cambiar su clasificaci\u00f3n.</div>'
                + '<div class="pm-legend">'
                + '<div class="pm-legend-item"><span class="pm-legend-dot" style="background:#F04438"></span> Gestionar Cerca</div>'
                + '<div class="pm-legend-item"><span class="pm-legend-dot" style="background:#F5C518"></span> Mantener Satisfecho</div>'
                + '<div class="pm-legend-item"><span class="pm-legend-dot" style="background:#F79009"></span> Mantener Informado</div>'
                + '<div class="pm-legend-item"><span class="pm-legend-dot" style="background:#12B76A"></span> Monitorear</div>'
                + '</div></div>';

            container.innerHTML = `
                <div class="info-card u-mb-20">
                    <h4 style="margin-bottom:16px"> Matriz Poder / Inter\u00e9s
                        <span class="pm-style-toggle">
                            <button type="button" class="pm-style-opt${estiloActual === 'v1' ? ' active' : ''}" data-estilo="v1">Cl\u00e1sico</button>
                            <button type="button" class="pm-style-opt${estiloActual === 'v2' ? ' active' : ''}" data-estilo="v2">Moderno</button>
                        </span>
                    </h4>
                    ${pmMatrixHtml}
                </div>
                <div class="info-card">
                    <h4 style="margin-bottom:16px"> Lista de Interesados</h4>
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

            container.querySelectorAll('.pm-style-opt').forEach(function (b) {
                b.addEventListener('click', function () {
                    localStorage.setItem('pm_stakeholder_style', b.getAttribute('data-estilo'));
                    renderizarStakeholders();
                });
            });

            var pmQuadrantMap = {
                gc: { poder: 4, interes: 4 },
                ms: { poder: 4, interes: 2 },
                mi: { poder: 2, interes: 4 },
                mo: { poder: 2, interes: 2 }
            };
            var pmDraggedId = null;
            var pmDragJustEnded = false;
            container.querySelectorAll('.pm-card').forEach(function (card) {
                card.addEventListener('dragstart', function (e) {
                    pmDraggedId = card.getAttribute('data-id');
                    card.classList.add('pm-dragging');
                    e.dataTransfer && e.dataTransfer.setData('text/plain', pmDraggedId);
                    e.dataTransfer && (e.dataTransfer.effectAllowed = 'move');
                });
                card.addEventListener('dragend', function () {
                    card.classList.remove('pm-dragging');
                    container.querySelectorAll('.pm-col').forEach(function (c) { c.classList.remove('pm-drag-over'); });
                    pmDraggedId = null;
                    pmDragJustEnded = true;
                    setTimeout(function () { pmDragJustEnded = false; }, 100);
                });
                card.addEventListener('click', function () {
                    if (pmDragJustEnded) return; // un arrastre no debe abrir el modal
                    var id = card.getAttribute('data-id');
                    if (id) editarStakeholder(parseInt(id, 10));
                });
            });
            container.querySelectorAll('.pm-col').forEach(function (col) {
                col.addEventListener('dragover', function (e) {
                    e.preventDefault();
                    e.dataTransfer && (e.dataTransfer.dropEffect = 'move');
                    col.classList.add('pm-drag-over');
                });
                col.addEventListener('dragleave', function () {
                    col.classList.remove('pm-drag-over');
                });
                col.addEventListener('drop', function (e) {
                    e.preventDefault();
                    col.classList.remove('pm-drag-over');
                    var id = pmDraggedId || (e.dataTransfer && e.dataTransfer.getData('text/plain'));
                    if (!id) return;
                    var target = pmQuadrantMap[col.getAttribute('data-quadrant')];
                    if (!target) return;
                    var s = proyecto.stakeholders.find(function (x) { return String(x.id) === String(id); });
                    if (!s) return;
                    s.poder = target.poder;
                    s.interes = target.interes;
                    guardarProyecto && guardarProyecto();
                    renderizarStakeholders();
                });
            });
        }
        
        function abrirModalStakeholder() {
    // Crear modal con inputs editables y forzar z-index/focus
    const modalHtml = `
      <div class="modal-content" role="dialog" aria-modal="true" aria-label="Añadir interesado">
        <div class="modal-header">
          <h3> ${tApp('stakeholders_nuevo') || 'Añadir interesado'}</h3>
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
          <div class="form-row">
            <div class="form-group u-flex-1">
              <label for="stkPais">País</label>
              <input id="stkPais" type="text" class="u-w-full" />
            </div>
            <div class="form-group u-flex-1">
              <label for="stkTipo">Tipo</label>
              <select id="stkTipo" class="select-full">
                <option value="interno" selected>Interno</option>
                <option value="externo">Externo</option>
              </select>
            </div>
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
      tipo: document.getElementById('stkTipo')?.value || 'interno',
      poder: parseInt(document.getElementById('stkPoder')?.value) || 3,
      interes: parseInt(document.getElementById('stkInteres')?.value) || 3,
      expectativas: document.getElementById('stkExpectativas')?.value || ''
    };

    proyecto.stakeholders.push(nuevo);
    guardarProyecto && guardarProyecto();
    renderizarStakeholders && renderizarStakeholders();
    cerrarModalGeneric();
    mostrarToast(` Interesado "${nombre}" añadido`, 'success');
}
        
        
        function editarStakeholder(id) {
            let s = proyecto.stakeholders.find(s => s.id === id);
            if (!s) return;
            const tipoActual = (s.tipo === 'externo') ? 'externo' : 'interno';
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Editar</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="stakeId" value="${s.id}">
                <div class="form-group"><label>Nombre</label><input type="text" id="stakeNombre" value="${escapeHtml(s.nombre)}"></div>
                <div class="form-row"><div class="form-group u-flex-1"><label>Empresa</label><input type="text" id="stakeEmpresa" value="${escapeHtml(s.empresa || '')}"></div>
                <div class="form-group u-flex-1"><label>Puesto</label><input type="text" id="stakePuesto" value="${escapeHtml(s.puesto || '')}"></div></div>
                <div class="form-group"><label>Rol en el proyecto</label><input type="text" id="stakeRol" value="${escapeHtml(s.rol || '')}"></div>
                <div class="form-row"><div class="form-group u-flex-1"><label>Email</label><input type="email" id="stakeEmail" value="${escapeHtml(s.email || '')}"></div>
                <div class="form-group u-flex-1"><label>Teléfono</label><input type="tel" id="stakeTelefono" value="${escapeHtml(s.telefono || '')}"></div></div>
                <div class="form-row"><div class="form-group u-flex-1"><label>País</label><input type="text" id="stakePais" value="${escapeHtml(s.pais || '')}"></div>
                <div class="form-group u-flex-1"><label>Tipo</label><select id="stakeTipo" class="select-full"><option value="interno" ${tipoActual === 'interno' ? 'selected' : ''}>Interno</option><option value="externo" ${tipoActual === 'externo' ? 'selected' : ''}>Externo</option></select></div></div>
                <div class="form-row"><div class="form-group"><label>Poder</label><input type="range" id="stakePoder" min="1" max="5" value="${s.poder}" oninput="document.getElementById('poderVal').innerText=this.value"><span id="poderVal">${s.poder}</span></div>
                <div class="form-group"><label>Interés</label><input type="range" id="stakeInteres" min="1" max="5" value="${s.interes}" oninput="document.getElementById('interesVal').innerText=this.value"><span id="interesVal">${s.interes}</span></div></div>
                <div class="form-group"><label>Expectativas</label><textarea rows="2" id="stakeExpectativas">${escapeHtml(s.expectativas || '')}</textarea></div>
                <div class="u-action-row">
                    <button class="btn btn-danger" onclick="eliminarStakeholder(${s.id})">Eliminar</button>
                    <button class="btn btn-primary" onclick="actualizarStakeholder()">Actualizar</button>
                </div>
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
                    tipo: document.getElementById('stakeTipo')?.value || 'interno',
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
            if (confirm('¿Eliminar este interesado?')) {
                const s = proyecto.stakeholders.find(s => s.id === id);
                proyecto.stakeholders = proyecto.stakeholders.filter(s => s.id !== id);
                if (proyecto.raci) proyecto.raci = proyecto.raci.filter(r => r.stakeholderId !== id);
                guardarProyecto();
                renderizarStakeholders();
                cerrarModalGeneric();
                mostrarToast(` Interesado "${s?.nombre}" eliminado`, 'success');
            }
        }
        
       
        
        // ============================================
        // MATRIZ RACI
        // ============================================
        function renderizarRACI() {
            const container = document.getElementById('raciContent');
            if (!proyecto.stakeholders || proyecto.stakeholders.length === 0) {
                container.innerHTML = '<div class="info-card">No hay interesados registrados. Agrega interesados primero.</div>';
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
                mostrarToast(" No hay interesados registrados. Agrega interesados primero.", 'error');
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
                cargaPorStakeholder[s.id] = { nombre: s.nombre, rol: s.rol || 'Interesado', countR: 0, countA: 0, actividadesR: [], actividadesA: [] };
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
                        <div> Interesados: ${stakeholders.length}</div>
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
            
            // SECCIÓN 3: INTERESADOS SIN PARTICIPACIÓN
            if (sinActividades.length > 0) {
                html += `
                    <div class="raci-report-section raci-info">
<h4> INTERESADOS SIN PARTICIPACIÓN</h4>
<p class="u-fs-12 u-mb-12">Los siguientes interesados no tienen ningún rol asignado en la matriz RACI:</p>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${sinActividades.map(s => `
                                <span style="background: rgba(0,122,255,0.2); padding: 4px 12px; border-radius: 16px; font-size: 12px;">${escapeHtml(s.nombre)}</span>
                            `).join('')}
                        </div>
                        <p class="u-fs-12 u-mt-12"> <strong>Recomendación:</strong> Considera si estos interesados deberían tener algún rol (R, A, C o I) según su nivel de poder/interés.</p>
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
                                <li>Hay ${stakeholders.length} interesados identificados</li>
                                <li>Se han definido ${raciData.length} asignaciones RACI</li>
                                ${brechas.length === 0 ? '<li>Todas las actividades tienen responsable y accountable</li>' : ''}
                            </ul>
                        </div>
                        <div>
                            <div> <strong>Áreas de mejora:</strong></div>
                            <ul style="font-size: 12px; margin-left: 20px;">
                                ${brechas.length > 0 ? `<li>${brechas.length} brecha(s) sin responsable</li>` : ''}
                                ${sobrecargados.length > 0 ? `<li>${sobrecargados.length} persona(s) sobrecargadas</li>` : ''}
                                ${sinActividades.length > 0 ? `<li>${sinActividades.length} interesado(s) sin participación</li>` : ''}
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
