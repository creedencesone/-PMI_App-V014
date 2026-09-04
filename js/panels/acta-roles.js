        // ACTA DE INICIO
        // ============================================
function renderizarActa() {
    sincronizarActaConProyecto();
    let a = proyecto.acta || {};
    let pm = proyecto.projectManager || {};
    let sp = proyecto.sponsor || {};
    let cl = proyecto.cliente || {};
    
    let hitosHtml = '';
    if (proyecto.hitosFinancieros && proyecto.hitosFinancieros.length > 0) {
        hitosHtml = '<div class="acta-field"><div class="acta-label">' + tApp('acta_hitos_pago') + '</div><div class="acta-value">';
        proyecto.hitosFinancieros.forEach(h => {
            let importe = (proyecto.precioVenta * h.porcentaje) / 100;
            hitosHtml += `<div style="margin-bottom: 4px;">• ${escapeHtml(h.nombre)}: ${h.porcentaje}% (${formatearMoneda(importe)}) - Mes ${h.mes}</div>`;
        });
        hitosHtml += `</div></div>`;
    } else {
        hitosHtml = '<div class="acta-field"><div class="acta-label">' + tApp('acta_hitos_pago') + '</div><div class="acta-value">' + tApp('acta_sin_hitos') + '</div></div>';
    }
    
    let avalesHtml = '';
    if (proyecto.avales && proyecto.avales.length > 0) {
        avalesHtml = '<div class="acta-field"><div class="acta-label">' + tApp('acta_avales') + '</div><div class="acta-value">';
        proyecto.avales.forEach(a => {
            let estadoIcon = a.estado === 'Vigente' ? '' : (a.estado === 'Próximo a vencer' ? '' : '');
            avalesHtml += `<div style="margin-bottom: 8px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                <strong>${estadoIcon} ${escapeHtml(a.tipo)}</strong><br>
                 ${escapeHtml(a.entidad || 'Entidad no especificada')}<br>
                 Importe: ${formatearMoneda(convertirMoneda(a.importe, a.moneda))}<br>
                 Emisión: ${a.fechaEmision || '-'} |  Vence: ${a.fechaVencimiento || '-'}<br>
                 Ref: ${escapeHtml(a.referencia || '-')}
            </div>`;
        });
        avalesHtml += `</div></div>`;
    } else {
        avalesHtml = '<div class="acta-field"><div class="acta-label">' + tApp('acta_avales') + '</div><div class="acta-value">' + tApp('acta_sin_avales') + '</div></div>';
    }
    
    // Metodología
    const metodologia = proyecto.metodologia || { tipo: 'cascada', fasesAgile: [], fechaTransicion: null };
    let metodologiaTexto = '';
    let metodologiaDetalle = '';
    
    if (metodologia.tipo === 'cascada') {
        metodologiaTexto = ' Gestión Tradicional (Cascada)';
        metodologiaDetalle = 'Planificación secuencial, fases definidas, entregables por etapa.';
    } else if (metodologia.tipo === 'agile') {
        metodologiaTexto = ' Gestión Ágil (Scrum)';
        metodologiaDetalle = 'Sprints de 2 semanas, historias de usuario, entregas incrementales.';
    } else if (metodologia.tipo === 'mixto') {
        metodologiaTexto = ' Gestión Mixta (Cascada + Ágil)';
        let fasesTexto = (metodologia.fasesAgile || []).map(f => {
            const nombres = { diseno: ' Diseño', desarrollo: ' Desarrollo', pruebas: ' Pruebas', implementacion: ' Implementación' };
            return nombres[f] || f;
        }).join(', ') || 'Ninguna';
        metodologiaDetalle = ` Transición: ${metodologia.fechaTransicion || 'No definida'} |  Fases Ágiles: ${fasesTexto}`;
    }
    
    document.getElementById('actaContent').innerHTML = `
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_identificacion')}</h3><div class="acta-grid">
            <div class="acta-field"><div class="acta-label">${tApp('acta_nombre')}</div><div class="acta-value">${escapeHtml(a.nombreProyecto || proyecto.nombre)}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_codigo')}</div><div class="acta-value">${escapeHtml(a.codigo || '-')}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_pais')}</div><div class="acta-value">${escapeHtml(proyecto.pais || a.pais || 'No especificado')}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_inicio')}</div><div class="acta-value">${a.fechaInicio ? formatearFechaEspa(a.fechaInicio) : '-'}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_fin')}</div><div class="acta-value">${a.fechaFin || proyecto.fechaFinPlan || '-'}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_moneda')}</div><div class="acta-value">${a.moneda || proyecto.monedaBase}</div></div>
        </div></div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_objetivos')}</h3>
            <div class="acta-field"><div class="acta-label">${tApp('acta_objetivo_general')}</div><div class="acta-value">${escapeHtml(a.objetivoGeneral || 'No definido')}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_criterios_exito')}</div><div class="acta-value">${escapeHtml(a.criteriosExito || 'No definidos')}</div></div>
        </div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_alcance')}</h3>
            <div class="acta-field"><div class="acta-label">${tApp('acta_descripcion')}</div><div class="acta-value">${escapeHtml(a.alcance || proyecto.descripcion || 'No definido')}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_entregables_clave')}</div><div class="acta-value">${escapeHtml(a.entregablesClave || 'No definidos')}</div></div>
        </div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_partes')}</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 12px;">
                <div class="info-card u-text-center" >
                    <div class="u-fs-32 u-mb-8"></div>
                    <div class="u-fw-600 u-fs-14 u-mb-4">${tApp('acta_pm')}</div>
                    <div class="u-fs-13 u-color-primary">${escapeHtml(pm.nombre || tApp('acta_pm_no_asignado'))}</div>
                    <div class="u-fs-11 u-mt-6"> ${pm.email || '-'}<br> ${pm.telefono || '-'}</div>
                    <button class="btn btn-secondary btn-small u-w-full" onclick="abrirModalPM()" >${tApp('btn_editar')} PM</button>
                </div>
                
                <div class="info-card u-text-center" >
                    <div class="u-fs-32 u-mb-8"></div>
                    <div class="u-fw-600 u-fs-14 u-mb-4">${tApp('acta_sponsor')}</div>
                    <div class="u-fs-13 u-color-primary">${escapeHtml(sp.nombre || tApp('acta_sponsor_no_asignado'))}</div>
                    <div class="u-fs-11 u-mt-6"> ${sp.email || '-'}<br> ${sp.telefono || '-'}</div>
                    <button class="btn btn-secondary btn-small u-w-full" onclick="abrirModalSponsor()" >${tApp('btn_editar')} Sponsor</button>
                </div>
                
                <div class="info-card u-text-center" >
                    <div class="u-fs-32 u-mb-8"></div>
                    <div class="u-fw-600 u-fs-14 u-mb-4">${tApp('acta_cliente')}</div>
                    <div class="u-fs-13 u-color-primary">${escapeHtml(cl.nombre || tApp('acta_cliente_no_asignado'))}</div>
                    <div class="u-fs-11 u-mt-6"> ${cl.email || '-'}<br> ${cl.telefono || '-'}</div>
                    <button class="btn btn-secondary btn-small u-w-full" onclick="abrirModalCliente()" >${tApp('btn_editar')} Cliente</button>
                </div>
            </div>
        </div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_presupuesto')}</h3><div class="acta-grid">
            <div class="acta-field"><div class="acta-label">${tApp('acta_presupuesto_valor')}</div><div class="acta-value">${a.presupuesto ? formatearMoneda(a.presupuesto) : '-'}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_contrato')}</div><div class="acta-value"><strong class="u-color-success">${proyecto.precioVenta ? formatearMoneda(proyecto.precioVenta) : 'No definido'}</strong></div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_moneda_venta')}</div><div class="acta-value">${proyecto.monedaVenta || proyecto.monedaBase}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_roi')}</div><div class="acta-value">${a.roi ? a.roi + '%' : '-'}</div></div>
        </div></div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_condiciones')}</h3>
            <div class="acta-field"><div class="acta-label">${tApp('acta_condiciones_texto')}</div><div class="acta-value">${escapeHtml(proyecto.condicionesPago || 'No definidas')}</div></div>
            ${hitosHtml}
        </div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_avales')}</h3>
            ${avalesHtml}
        </div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_aprobaciones')}</h3><div class="acta-grid">
            <div class="acta-field"><div class="acta-label">${tApp('acta_aprobado_por')}</div><div class="acta-value">${escapeHtml(a.aprobadoPor || 'Pendiente')}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_fecha_aprobacion')}</div><div class="acta-value">${a.fechaAprobacion || '-'}</div></div>
        </div></div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_metodologia')}</h3>
            <div class="acta-field">
                <div class="acta-label">${tApp('acta_metodologia_tipo')}</div>
                <div class="acta-value">${metodologiaTexto}</div>
            </div>
            <div class="acta-field">
                <div class="acta-label">${tApp('acta_metodologia_desc')}</div>
                <div class="acta-value">${metodologiaDetalle}</div>
            </div>
        </div>
        
        <div class="info-card u-mt-16">
            <p class="u-p-sm"> Los hitos de pago se gestionan en Finanzas → Venta y Hitos | Los avales se gestionan en Finanzas → Avales y Garantías</p>
        </div>
    `;
}

function editarActa() {
    let a = proyecto.acta || {};
    const metodologia = proyecto.metodologia || { tipo: 'cascada', fasesAgile: [], fechaTransicion: null };
    
    const modalHtml = `<div class="modal-content modal-md"><div class="modal-header"><h3> ${tApp('btn_editar')} ${tApp('sidebar_acta')}</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
        <div class="form-group"><label>${tApp('acta_nombre')}</label><input type="text" id="actaNombre" value="${escapeHtml(a.nombreProyecto || proyecto.nombre)}"></div>
        <div class="form-group"><label>${tApp('acta_codigo')}</label><input type="text" id="actaCodigo" value="${escapeHtml(a.codigo || '')}"></div>
        <div class="form-row"><div class="form-group"><label>${tApp('acta_inicio')}</label><input type="date" id="actaFechaInicio" value="${a.fechaInicio || proyecto.fechaInicio || ''}"></div>
        <div class="form-group"><label>${tApp('acta_fin')}</label><input type="date" id="actaFechaFin" value="${a.fechaFin || proyecto.fechaFinPlan || ''}"></div></div>
        <div class="form-group"><label>${tApp('acta_objetivo_general')}</label><textarea rows="2" id="actaObjGeneral">${escapeHtml(a.objetivoGeneral || '')}</textarea></div>
        <div class="form-group"><label>${tApp('acta_criterios_exito')}</label><textarea rows="2" id="actaCriterios">${escapeHtml(a.criteriosExito || '')}</textarea></div>
        <div class="form-group"><label>${tApp('acta_descripcion')}</label><textarea rows="2" id="actaAlcance">${escapeHtml(a.alcance || proyecto.descripcion || '')}</textarea></div>
        <div class="form-group"><label>${tApp('acta_entregables_clave')}</label><textarea rows="2" id="actaEntregables">${escapeHtml(a.entregablesClave || '')}</textarea></div>
        <div class="form-row"><div class="form-group"><label>${tApp('acta_presupuesto_valor')}</label><input type="number" id="actaPresupuesto" value="${a.presupuesto || 0}"></div>
        <div class="form-group"><label>${tApp('acta_contrato')}</label><input type="number" id="actaPrecioVenta" value="${proyecto.precioVenta || 0}" step="1000"></div></div>
        <div class="form-row"><div class="form-group"><label>${tApp('acta_moneda_venta')}</label><select id="actaMonedaVenta">${Object.keys(MONEDAS).map(m => `<option value="${m}" ${(proyecto.monedaVenta || proyecto.monedaBase) === m ? 'selected' : ''}>${m} - ${MONEDAS[m]}</option>`).join('')}</select></div>
        <div class="form-group"><label>${tApp('acta_roi')}</label><input type="number" id="actaROI" value="${a.roi || 0}"></div></div>
        
        <hr class="u-hr">
        <h4 class="u-fs-13"> ${tApp('acta_metodologia_tipo')}</h4>
        <div class="form-group">
            <label>${tApp('acta_metodologia_tipo')}</label>
            <select id="metodologiaTipo" onchange="toggleMetodologiaCampos()">
                <option value="cascada" ${metodologia.tipo === 'cascada' ? 'selected' : ''}> Cascada / Tradicional (PMBOK)</option>
                <option value="agile" ${metodologia.tipo === 'agile' ? 'selected' : ''}> Ágil / Scrum</option>
                <option value="mixto" ${metodologia.tipo === 'mixto' ? 'selected' : ''}> Mixto (Cascada + Ágil)</option>
            </select>
            <small class="u-fs-11">Define cómo se gestionará el proyecto. Puedes cambiarlo en cualquier momento.</small>
        </div>
        
        <div id="mixtoConfig" style="display: ${metodologia.tipo === 'mixto' ? 'block' : 'none'};">
            <div class="form-group">
                <label> Fecha de transición a Ágil</label>
                <input type="date" id="metodologiaFechaTransicion" value="${metodologia.fechaTransicion || ''}">
                <small>Hasta esta fecha: usar metodología Cascada | Después: usar Ágil/Scrum</small>
            </div>
            <div class="form-group">
                <label> Fases que serán gestionadas con Ágil</label>
                <select id="metodologiaFasesAgile" multiple size="4" style="height: auto;">
                    <option value="diseno" ${metodologia.fasesAgile?.includes('diseno') ? 'selected' : ''}> Diseño</option>
                    <option value="desarrollo" ${metodologia.fasesAgile?.includes('desarrollo') ? 'selected' : ''}> Desarrollo</option>
                    <option value="pruebas" ${metodologia.fasesAgile?.includes('pruebas') ? 'selected' : ''}> Pruebas</option>
                    <option value="implementacion" ${metodologia.fasesAgile?.includes('implementacion') ? 'selected' : ''}> Implementación</option>
                </select>
                <small>Mantén pulsado Ctrl/Cmd para seleccionar múltiples fases</small>
            </div>
        </div>
        
        <div class="info-card-modal u-mt-16" >
            <small> <strong>¿Cuál elegir?</strong><br>
            • <strong>Cascada:</strong> Ideal para proyectos con requisitos estables, regulados o de construcción.<br>
            • <strong>Ágil:</strong> Perfecto para proyectos con incertidumbre, software o equipos pequeños.<br>
            • <strong>Mixto:</strong> Combina planificación inicial en cascada con desarrollo iterativo ágil.
            </small>
        </div>
        
        <div class="form-row">
            <div class="form-group"><label> Beneficio Proyectado (€)</label><input type="number" id="actaBeneficioProyectado" value="${a.beneficioProyectado || 0}"></div>
            <div class="form-group"><label> Fecha estimada beneficio</label><input type="date" id="actaFechaBeneficio" value="${a.fechaBeneficio || ''}"></div>
        </div>
        <div class="form-group"><label> Indicadores de éxito del beneficio</label><textarea rows="2" id="actaIndicadoresBeneficio" placeholder="Ej: ROI > 15%, Payback < 2 años, VAN > 100.000€">${escapeHtml(a.indicadoresBeneficio || '')}</textarea></div>
        <div class="form-group"><label>${tApp('acta_condiciones_texto')}</label><textarea rows="2" id="actaCondicionesPago" placeholder="Ej: 30% anticipo, 40% contra entrega, 30% a 30 días">${escapeHtml(proyecto.condicionesPago || '')}</textarea></div>
        <div class="form-group"><label>${tApp('acta_aprobado_por')}</label><input type="text" id="actaAprobado" value="${escapeHtml(a.aprobadoPor || '')}"></div>
        <div class="form-group"><label>${tApp('acta_fecha_aprobacion')}</label><input type="date" id="actaFechaAprobacion" value="${a.fechaAprobacion || ''}"></div>
        <div class="info-card-modal u-mt-16"><p> Los hitos de pago se gestionan en Finanzas → Venta y Hitos</p></div>
        <button class="btn btn-primary" onclick="guardarActa()">${tApp('btn_guardar')} Acta</button>
    </div>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}

// Función auxiliar para mostrar/ocultar campos mixtos
function toggleMetodologiaCampos() {
    const tipo = document.getElementById('metodologiaTipo').value;
    const mixtoConfig = document.getElementById('mixtoConfig');
    if (mixtoConfig) {
        mixtoConfig.style.display = tipo === 'mixto' ? 'block' : 'none';
    }
}
        
        function guardarActa() {
    let actaData = {
        nombreProyecto: document.getElementById('actaNombre').value,
        codigo: document.getElementById('actaCodigo').value,
        fechaInicio: document.getElementById('actaFechaInicio').value,
        fechaFin: document.getElementById('actaFechaFin').value,
        objetivoGeneral: document.getElementById('actaObjGeneral').value,
        criteriosExito: document.getElementById('actaCriterios').value,
        alcance: document.getElementById('actaAlcance').value,
        entregablesClave: document.getElementById('actaEntregables').value,
        presupuesto: parseFloat(document.getElementById('actaPresupuesto').value),
        roi: parseFloat(document.getElementById('actaROI').value),
        aprobadoPor: document.getElementById('actaAprobado').value,
        fechaAprobacion: document.getElementById('actaFechaAprobacion').value,
        beneficioProyectado: parseFloat(document.getElementById('actaBeneficioProyectado').value),
        fechaBeneficio: document.getElementById('actaFechaBeneficio').value,
        indicadoresBeneficio: document.getElementById('actaIndicadoresBeneficio').value
    };
    
    let precioVentaActa = parseFloat(document.getElementById('actaPrecioVenta').value);
    let monedaVentaActa = document.getElementById('actaMonedaVenta').value;
    let condicionesPagoActa = document.getElementById('actaCondicionesPago').value;
    
    proyecto.acta = actaData;
    
    //  CORRECCIÓN: Guardar metodología seleccionada
    const metodologiaTipo = document.getElementById('metodologiaTipo')?.value || 'cascada';
    const metodologiaFechaTransicion = document.getElementById('metodologiaFechaTransicion')?.value || null;
    
    // Obtener fases ágiles seleccionadas (soporta múltiple selección)
    const metodologiaFasesSelect = document.getElementById('metodologiaFasesAgile');
    let metodologiaFasesAgile = [];
    if (metodologiaFasesSelect) {
        metodologiaFasesAgile = Array.from(metodologiaFasesSelect.selectedOptions).map(opt => opt.value);
    }
    
    proyecto.metodologia = {
        tipo: metodologiaTipo,
        fasesAgile: metodologiaFasesAgile,
        fechaTransicion: metodologiaFechaTransicion
    };
    
    console.log(" Metodología guardada:", proyecto.metodologia); // Para depuración
    
    if (actaData.nombreProyecto) proyecto.nombre = actaData.nombreProyecto;
    if (actaData.alcance) proyecto.descripcion = actaData.alcance;
    if (actaData.fechaInicio) proyecto.fechaInicio = actaData.fechaInicio;
    if (actaData.fechaFin) proyecto.fechaFinPlan = actaData.fechaFin;
    
    if (!isNaN(precioVentaActa)) proyecto.precioVenta = precioVentaActa;
    proyecto.monedaVenta = monedaVentaActa;
    proyecto.condicionesPago = condicionesPagoActa;
    
    document.getElementById('precioVenta').value = proyecto.precioVenta;
    document.getElementById('precioVenta2').value = proyecto.precioVenta;
    document.getElementById('monedaVenta').value = proyecto.monedaVenta;
    document.getElementById('monedaVenta2').value = proyecto.monedaVenta;
    document.getElementById('condicionesPago').value = proyecto.condicionesPago;
    document.getElementById('condicionesPago2').value = proyecto.condicionesPago;
    
    guardarProyecto();
    renderizarActa();
    calcularCashflow();
    renderizarHitosFinancieros();
    
    //  Aplicar visibilidad de paneles según metodología guardada
    if (typeof mostrarPanelesSegunMetodologia === 'function') {
        mostrarPanelesSegunMetodologia();
    }
    
    cerrarModalGeneric();
    mostrarToast(tApp('toast_acta_guardada'), 'success');
}
        
                // ============================================
        // ROLES - VERSIÓN MEJORADA (con más datos y vCard)
        // ============================================
        
        function renderizarRoles() {
            let pm = proyecto.projectManager || {};
            let sp = proyecto.sponsor || {};
            let cl = proyecto.cliente || {};
            
            document.getElementById('rolesContent').innerHTML = `
                <div class="info-card">
                    <h4> Project Manager</h4>
                    <div class="name">${pm.nombre || 'No definido'}</div>
                    <div class="details">${pm.cargo || ''}</div>
                    <div class="details"> ${pm.email || '-'}</div>
                    <div class="details"> ${pm.telefono || '-'}</div>
                    <div class="details"> ${pm.direccion || '-'}</div>
                    <div class="details"> ${pm.departamento || '-'}</div>
                    <div class="u-mt-8">
                        <span class="edit-icon" onclick="abrirModalPM()"> Editar</span>
                        ${pm.nombre ? `<span class="edit-icon u-ml-8 u-bg-blue-faint" onclick="exportarVCard('pm')"> Exportar vCard</span>` : ''}
                    </div>
                </div>
                <div class="info-card">
                    <h4> Sponsor</h4>
                    <div class="name">${sp.nombre || 'No definido'}</div>
                    <div class="details">${sp.cargo || ''}</div>
                    <div class="details"> ${sp.email || '-'}</div>
                    <div class="details"> ${sp.telefono || '-'}</div>
                    <div class="details"> ${sp.direccion || '-'}</div>
                    <div class="details"> ${sp.departamento || '-'}</div>
                    <div class="u-mt-8">
                        <span class="edit-icon" onclick="abrirModalSponsor()"> Editar</span>
                        ${sp.nombre ? `<span class="edit-icon u-ml-8 u-bg-blue-faint" onclick="exportarVCard('sponsor')"> Exportar vCard</span>` : ''}
                    </div>
                </div>
                <div class="info-card">
                    <h4> Cliente</h4>
                    <div class="name">${cl.nombre || 'No definido'}</div>
                    <div class="details">${cl.cargo || ''}</div>
                    <div class="details"> ${cl.email || '-'}</div>
                    <div class="details"> ${cl.telefono || '-'}</div>
                    <div class="details"> ${cl.direccion || '-'}</div>
                    <div class="details"> ${cl.departamento || '-'}</div>
                    <div class="u-mt-8">
                        <span class="edit-icon" onclick="abrirModalCliente()"> Editar</span>
                        ${cl.nombre ? `<span class="edit-icon u-ml-8 u-bg-blue-faint" onclick="exportarVCard('cliente')"> Exportar vCard</span>` : ''}
                    </div>
                </div>
            `;
        }
        
        function abrirModalPM() {
            let p = proyecto.projectManager || {};
            const modalHtml = `
                <div class="modal-content modal-500">
                    <div class="modal-header">
                        <h3> Editar Project Manager</h3>
                        <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
                    </div>
                    <div class="form-group">
                        <label>Nombre completo *</label>
                        <input type="text" id="pmNombre" value="${escapeHtml(p.nombre || '')}" placeholder="Ej: Juan Carlos Pérez">
                    </div>
                    <div class="form-group">
                        <label>Cargo / Puesto</label>
                        <input type="text" id="pmCargo" value="${escapeHtml(p.cargo || '')}" placeholder="Ej: Director de Proyectos">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="pmEmail" value="${escapeHtml(p.email || '')}" placeholder="juan.perez@empresa.com">
                    </div>
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="text" id="pmTelefono" value="${escapeHtml(p.telefono || '')}" placeholder="+34 600 000 000">
                    </div>
                    <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" id="pmDireccion" value="${escapeHtml(p.direccion || '')}" placeholder="Calle, número, ciudad, país">
                    </div>
                    <div class="form-group">
                        <label>Departamento / Área</label>
                        <input type="text" id="pmDepartamento" value="${escapeHtml(p.departamento || '')}" placeholder="Ej: Gestión de Proyectos">
                    </div>
                    <button class="btn btn-primary" onclick="guardarPM()">Guardar</button>
                </div>
            `;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function guardarPM() {
            proyecto.projectManager = { 
                nombre: document.getElementById('pmNombre').value,
                cargo: document.getElementById('pmCargo').value,
                email: document.getElementById('pmEmail').value,
                telefono: document.getElementById('pmTelefono').value,
                direccion: document.getElementById('pmDireccion').value,
                departamento: document.getElementById('pmDepartamento').value
            };
            guardarProyecto(); 
            renderizarRoles(); renderizarActa();
            cerrarModalGeneric(); 
            mostrarToast(tApp('toast_pm_actualizado'), 'success');
        }
        
        function abrirModalSponsor() {
            let s = proyecto.sponsor || {};
            const modalHtml = `
                <div class="modal-content modal-500">
                    <div class="modal-header">
                        <h3> Editar Sponsor</h3>
                        <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
                    </div>
                    <div class="form-group">
                        <label>Nombre completo *</label>
                        <input type="text" id="sponsorNombre" value="${escapeHtml(s.nombre || '')}" placeholder="Ej: María González">
                    </div>
                    <div class="form-group">
                        <label>Cargo / Puesto</label>
                        <input type="text" id="sponsorCargo" value="${escapeHtml(s.cargo || '')}" placeholder="Ej: Directora General">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="sponsorEmail" value="${escapeHtml(s.email || '')}" placeholder="maria.gonzalez@empresa.com">
                    </div>
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="text" id="sponsorTelefono" value="${escapeHtml(s.telefono || '')}" placeholder="+34 600 000 000">
                    </div>
                    <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" id="sponsorDireccion" value="${escapeHtml(s.direccion || '')}" placeholder="Calle, número, ciudad, país">
                    </div>
                    <div class="form-group">
                        <label>Departamento / Área</label>
                        <input type="text" id="sponsorDepartamento" value="${escapeHtml(s.departamento || '')}" placeholder="Ej: Dirección General">
                    </div>
                    <button class="btn btn-primary" onclick="guardarSponsor()">Guardar</button>
                </div>
            `;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function guardarSponsor() {
            proyecto.sponsor = { 
                nombre: document.getElementById('sponsorNombre').value,
                cargo: document.getElementById('sponsorCargo').value,
                email: document.getElementById('sponsorEmail').value,
                telefono: document.getElementById('sponsorTelefono').value,
                direccion: document.getElementById('sponsorDireccion').value,
                departamento: document.getElementById('sponsorDepartamento').value
            };
            guardarProyecto(); 
            renderizarRoles(); renderizarActa();
            cerrarModalGeneric(); 
            mostrarToast(tApp('toast_sponsor_actualizado'), 'success');
        }
        
        function abrirModalCliente() {
            let c = proyecto.cliente || {};
            const modalHtml = `
                <div class="modal-content modal-500">
                    <div class="modal-header">
                        <h3> Editar Cliente</h3>
                        <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
                    </div>
                    <div class="form-group">
                        <label>Nombre / Empresa *</label>
                        <input type="text" id="clienteNombre" value="${escapeHtml(c.nombre || '')}" placeholder="Ej: Empresa XYZ S.A.">
                    </div>
                    <div class="form-group">
                        <label>Contacto / Persona de referencia</label>
                        <input type="text" id="clienteContacto" value="${escapeHtml(c.contacto || '')}" placeholder="Ej: Carlos López">
                    </div>
                    <div class="form-group">
                        <label>Cargo del contacto</label>
                        <input type="text" id="clienteCargo" value="${escapeHtml(c.cargo || '')}" placeholder="Ej: Gerente de Compras">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="clienteEmail" value="${escapeHtml(c.email || '')}" placeholder="contacto@empresa.com">
                    </div>
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="text" id="clienteTelefono" value="${escapeHtml(c.telefono || '')}" placeholder="+34 600 000 000">
                    </div>
                    <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" id="clienteDireccion" value="${escapeHtml(c.direccion || '')}" placeholder="Calle, número, ciudad, país">
                    </div>
                    <div class="form-group">
                        <label>Departamento / Área</label>
                        <input type="text" id="clienteDepartamento" value="${escapeHtml(c.departamento || '')}" placeholder="Ej: Compras">
                    </div>
                    <button class="btn btn-primary" onclick="guardarCliente()">Guardar</button>
                </div>
            `;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function guardarCliente() {
            proyecto.cliente = { 
                nombre: document.getElementById('clienteNombre').value,
                contacto: document.getElementById('clienteContacto').value,
                cargo: document.getElementById('clienteCargo').value,
                email: document.getElementById('clienteEmail').value,
                telefono: document.getElementById('clienteTelefono').value,
                direccion: document.getElementById('clienteDireccion').value,
                departamento: document.getElementById('clienteDepartamento').value
            };
            guardarProyecto(); 
            renderizarRoles(); renderizarActa();
            cerrarModalGeneric(); 
            mostrarToast(tApp('toast_cliente_actualizado'), 'success');
        }

        // ============================================
// FUNCIONES PARA GESTIÓN DE METODOLOGÍA
// ============================================

function setNavSectionVisibility(selector, visible) {
    const el = document.querySelector(selector);
    if (!el) return;
    // Controlar la visibilidad del contenedor nav-section completo y del propio elemento
    const section = el.closest('.nav-section') || el;
    section.style.display = visible ? '' : 'none';
    el.style.display = visible ? '' : 'none';
}

function actualizarVisibilidadGrupos() {
    const activo = window.procesoActivo || 'Inicio';
    document.querySelectorAll('.nav-group').forEach(group => {
        const body = group.querySelector('.nav-group-body');
        if (!body) return;
        const fase = group.getAttribute('data-fase');
        // Transversal siempre visible
        if (fase === 'Transversal') {
            group.style.display = '';
            return;
        }
        // Solo el proceso activo puede estar visible
        if (fase !== activo) {
            group.style.display = 'none';
            return;
        }
        // El proceso activo se muestra solo si tiene al menos una sección visible (metodología)
        let visible = false;
        body.querySelectorAll('.nav-section').forEach(s => {
            if (s.style.display !== 'none') visible = true;
        });
        group.style.display = visible ? '' : 'none';
    });
}

function mostrarPanelesSegunMetodologia() {
    const metodologia = proyecto?.metodologia?.tipo || 'cascada';
    
    // Paneles específicos de cada metodología (módulos que dependen de la metodología)
    const panelesCascada = ['materiales', 'servicios', 'logistica', 'viajes', 'avales', 'garantia'];
    const panelesAgile = ['sprintBacklog', 'sprintBurndown', 'velocityTracking', 'retrospectives', 'agileMetrics', 'sprintList'];
    
    // Selectores de los dos módulos clave: Cronograma y menú Scrum
    const CRONO = `.nav-header[data-panel="cronograma"]`;
    const SCRUM_MENU = `.nav-header[data-submenu="scrum"]`;
    
    if (metodologia === 'cascada') {
        // Tradicional: SOLO Cronograma (ocultar Scrum Ágil por completo)
        setNavSectionVisibility(SCRUM_MENU, false);
        setNavSectionVisibility(CRONO, true);
        panelesCascada.forEach(p => {
            const elemento = document.querySelector(`.nav-header[data-panel="${p}"], .submenu-item[data-panel="${p}"]`);
            if (elemento) { const s = elemento.closest('.nav-section') || elemento; s.style.display = ''; }
        });
        
    } else if (metodologia === 'agile') {
        // Ágil: SOLO Scrum (ocultar Cronograma por completo)
        setNavSectionVisibility(CRONO, false);
        setNavSectionVisibility(SCRUM_MENU, true);
        panelesAgile.forEach(p => {
            const elemento = document.querySelector(`.nav-header[data-panel="${p}"], .submenu-item[data-panel="${p}"]`);
            if (elemento) { const s = elemento.closest('.nav-section') || elemento; s.style.display = ''; }
        });
        
    } else if (metodologia === 'mixto') {
        // Mixto: AMBOS visibles (Cronograma y Scrum)
        setNavSectionVisibility(CRONO, true);
        setNavSectionVisibility(SCRUM_MENU, true);
        panelesCascada.forEach(p => {
            const elemento = document.querySelector(`.nav-header[data-panel="${p}"], .submenu-item[data-panel="${p}"]`);
            if (elemento) { const s = elemento.closest('.nav-section') || elemento; s.style.display = ''; }
        });
        panelesAgile.forEach(p => {
            const elemento = document.querySelector(`.nav-header[data-panel="${p}"], .submenu-item[data-panel="${p}"]`);
            if (elemento) { const s = elemento.closest('.nav-section') || elemento; s.style.display = ''; }
        });
        mostrarIndicadorMetodologiaMixta();
    }

    actualizarVisibilidadGrupos();
}

function mostrarIndicadorMetodologiaMixta() {
    if (proyecto?.metodologia?.tipo !== 'mixto') return;
    
    const fechaTransicion = proyecto.metodologia.fechaTransicion;
    if (!fechaTransicion) return;
    
    const hoy = new Date();
    const fechaTransicionDate = new Date(fechaTransicion);
    const modoActual = hoy < fechaTransicionDate ? 'Cascada' : 'Ágil / Scrum';
    
    let banner = document.getElementById('metodologiaBanner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'metodologiaBanner';
        banner.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: linear-gradient(135deg, #007AFF, #0055CC);
            padding: 8px 16px;
            border-radius: 30px;
            font-size: 12px;
            z-index: 999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            cursor: pointer;
        `;
        document.body.appendChild(banner);
    }
    
    banner.innerHTML = ` Modo recomendado: <strong>${modoActual}</strong> `;
    banner.title = `Proyecto Mixto: Usar ${modoActual}`;
    
    banner.onclick = () => {
        if (modoActual === 'Cascada') {
            mostrarPanel('Cronograma');
        } else {
            mostrarPanel('SprintBacklog');
        }
    };
}

function recomendarMetodologia() {
    if (!proyecto) return;
    
    let puntajeAgile = 0;
    let puntajeCascada = 0;
    let razones = [];
    
    // 1. Estabilidad de requisitos (por hitos financieros)
    const hitos = proyecto.hitosFinancieros?.length || 0;
    if (hitos > 2) {
        puntajeCascada += 30;
        razones.push(" Múltiples hitos → requisitos probablemente estables → Cascada");
    } else {
        puntajeAgile += 30;
        razones.push(" Pocos hitos → requisitos pueden cambiar → Agile");
    }
    
    // 2. Tamaño del equipo
    const equipoSize = proyecto.equipo?.length || 0;
    if (equipoSize > 5) {
        puntajeCascada += 20;
        razones.push(" Equipo grande (>5) → mejor coordinación en Cascada");
    } else {
        puntajeAgile += 20;
        razones.push(" Equipo pequeño → Agile es más efectivo");
    }
    
    // 3. Complejidad técnica
    const materiales = proyecto.materiales?.length || 0;
    const servicios = proyecto.servicios?.length || 0;
    if (materiales + servicios > 10) {
        puntajeCascada += 25;
        razones.push(" Muchos materiales/servicios → planificación detallada necesaria");
    } else {
        puntajeAgile += 15;
        razones.push(" Pocos componentes → fácil de iterar");
    }
    
    // 4. Riesgos identificados
    const riesgosAltos = (proyecto.riesgos || []).filter(r => r.nivel === 'Alto' || r.nivel === 'Crítico').length;
    if (riesgosAltos > 3) {
        puntajeAgile += 25;
        razones.push(" Riesgos altos → Agile permite adaptación rápida");
    } else {
        puntajeCascada += 10;
        razones.push(" Riesgos controlables → Cascada es viable");
    }
    
    const recomendacion = puntajeAgile > puntajeCascada ? 'agile' : (puntajeCascada > puntajeAgile ? 'cascada' : 'mixto');
    const textosReco = {
        cascada: ' Cascada / Tradicional',
        agile: ' Ágil / Scrum',
        mixto: ' Mixto (combinación)'
    };
    
    const modalHtml = `
        <div class="modal-content modal-600">
            <div class="modal-header">
                <h3> Asistente de Metodología</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div class="u-mb-20">
                <div style="font-size: 24px; text-align: center; margin: 20px 0;">
                     <strong>${textosReco[recomendacion]}</strong>
                </div>
                <div style="background: rgba(0,122,255,0.2); padding: 12px; border-radius: 12px; text-align: center;">
                    Puntuación: Agile ${puntajeAgile} | Cascada ${puntajeCascada}
                </div>
            </div>
            
            <div class="info-card">
                <h4> Análisis detallado</h4>
                <ul class="u-ml-20 u-fs-12">
                    ${razones.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
            
            <div class="u-flex-gap-12 u-mt-20">
                <button class="btn btn-secondary" onclick="cerrarModalGeneric()">Cancelar</button>
                <button class="btn btn-primary" onclick="aplicarMetodologiaRecomendada('${recomendacion}')"> Aplicar recomendación</button>
            </div>
        </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function aplicarMetodologiaRecomendada(tipo) {
    if (!proyecto.metodologia) proyecto.metodologia = {};
    proyecto.metodologia.tipo = tipo;
    guardarProyecto();
    mostrarPanelesSegunMetodologia();
    cerrarModalGeneric();
    mostrarToast(` Metodología configurada: ${tipo.toUpperCase()}`, 'success');
}
        
        // ============================================
        // EXPORTAR TARJETA DE VISITA (vCard)
        // ============================================
        
        function exportarVCard(tipo) {
            let data = {};
            let nombreArchivo = '';
            
            if (tipo === 'pm') {
                data = proyecto.projectManager || {};
                nombreArchivo = `contacto_pm_${(data.nombre || 'project_manager').replace(/\s/g, '_')}.vcf`;
            } else if (tipo === 'sponsor') {
                data = proyecto.sponsor || {};
                nombreArchivo = `contacto_sponsor_${(data.nombre || 'sponsor').replace(/\s/g, '_')}.vcf`;
            } else if (tipo === 'cliente') {
                data = proyecto.cliente || {};
                nombreArchivo = `contacto_cliente_${(data.nombre || 'cliente').replace(/\s/g, '_')}.vcf`;
            }
            
            if (!data.nombre) {
                mostrarToast(" No hay datos de contacto para exportar", 'error');
                return;
            }
            
            // Construir vCard versión 4.0
            let vCard = [
                'BEGIN:VCARD',
                'VERSION:4.0',
                `FN:${data.nombre}`,
                data.cargo ? `TITLE:${data.cargo}` : '',
                data.email ? `EMAIL:${data.email}` : '',
                data.telefono ? `TEL:${data.telefono}` : '',
                data.direccion ? `ADR:;;${data.direccion};;;` : '',
                data.departamento ? `ORG:${data.departamento}` : '',
                data.contacto ? `X-CONTACT:${data.contacto}` : '',
                `REV:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
                'END:VCARD'
            ].filter(line => line !== '').join('\r\n');
            
            // Crear y descargar archivo
            const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', nombreArchivo);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            mostrarToast(` Tarjeta de visita exportada: ${data.nombre}`, 'success');
        }
        
        // Función adicional: Exportar todos los contactos en un solo archivo
        function exportarTodosVCard() {
            let allVCards = [];
            let nombres = [];
            
            const pm = proyecto.projectManager || {};
            const sponsor = proyecto.sponsor || {};
            const cliente = proyecto.cliente || {};
            
            if (pm.nombre) {
                allVCards.push(generarVCardString(pm, 'pm'));
                nombres.push(pm.nombre);
            }
            if (sponsor.nombre) {
                allVCards.push(generarVCardString(sponsor, 'sponsor'));
                nombres.push(sponsor.nombre);
            }
            if (cliente.nombre) {
                allVCards.push(generarVCardString(cliente, 'cliente'));
                nombres.push(cliente.nombre);
            }
            
            if (allVCards.length === 0) {
                mostrarToast(" No hay contactos para exportar", 'error');
                return;
            }
            
            const vcfContent = allVCards.join('\r\n\r\n');
            const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', `contactos_proyecto_${proyecto.nombre.replace(/\s/g, '_')}.vcf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            mostrarToast(` Exportados ${allVCards.length} contactos: ${nombres.join(', ')}`, 'success');
        }
        
        function generarVCardString(data, tipo) {
            let lines = [
                'BEGIN:VCARD',
                'VERSION:4.0',
                `FN:${data.nombre}`,
                data.cargo ? `TITLE:${data.cargo}` : '',
                data.email ? `EMAIL:${data.email}` : '',
                data.telefono ? `TEL:${data.telefono}` : '',
                data.direccion ? `ADR:;;${data.direccion};;;` : '',
                data.departamento ? `ORG:${data.departamento}` : '',
                data.contacto ? `X-CONTACT:${data.contacto}` : '',
                `REV:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
                'END:VCARD'
            ];
            return lines.filter(l => l !== '').join('\r\n');
        }
        
        // ============================================
        // VENTA Y HITOS FINANCIEROS
        // ============================================