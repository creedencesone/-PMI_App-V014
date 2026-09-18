// ============================================

function inicializarBeneficios() {
    if (!proyecto.beneficios) {
        proyecto.beneficios = {
            proyectado: 0,
            real: 0,
            fechaEstimada: null,
            indicadores: [],
            historial: [],
            hitos: []
        };
    }
    renderizarBeneficios();
}

function renderizarBeneficios() {
    const b = proyecto.beneficios || { proyectado: 0, real: 0, indicadores: [], hitos: [] };
    
    document.getElementById('beneficioProyectadoValor').innerHTML = formatearMoneda(b.proyectado || 0);
    document.getElementById('beneficioRealValor').innerHTML = formatearMoneda(b.real || 0);
    
    let desviacion = 0;
    let estado = '';
    let estadoColor = '';
    
    if (b.proyectado > 0) {
        desviacion = ((b.real || 0) - b.proyectado) / b.proyectado * 100;
        if (desviacion >= 0) {
            estado = ' Superando meta';
            estadoColor = '#00A859';
        } else if (desviacion >= -10) {
            estado = ' Cerca de meta';
            estadoColor = '#FF8C00';
        } else {
            estado = ' Por debajo de meta';
            estadoColor = '#FF3B30';
        }
    }
    
    document.getElementById('beneficioDesviacion').innerHTML = (desviacion >= 0 ? '+' : '') + desviacion.toFixed(1) + '%';
    document.getElementById('beneficioEstado').innerHTML = estado;
    document.getElementById('beneficioEstado').style.color = estadoColor;
    
    // Renderizar hitos de beneficio
    const hitosContainer = document.getElementById('hitosBeneficioList');
    if (hitosContainer) {
        if (!b.hitos || b.hitos.length === 0) {
            hitosContainer.innerHTML = '<p class="u-color-muted">No hay hitos de beneficio registrados</p>';
        } else {
            hitosContainer.innerHTML = b.hitos.map(h => `
                <div class="item-card">
                    <div>
                        <strong>${escapeHtml(h.nombre)}</strong><br>
                         ${formatearFechaEspa(h.fecha)} |  Meta: ${formatearMoneda(h.meta)} |  Real: ${formatearMoneda(h.real || 0)}
                    </div>
                    <div>
                        <span class="edit-btn" onclick="editarHitoBeneficio(${h.id})"></span>
                        <span class="delete-btn" onclick="eliminarHitoBeneficio(${h.id})"></span>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Renderizar indicadores
    const indicadoresBody = document.getElementById('indicadoresBeneficioBody');
    if (indicadoresBody) {
        const indicadores = [
            { nombre: "ROI", meta: "> 15%", real: calcularROI() + "%", cumplimiento: calcularROI() >= 15 ? "" : "" },
            { nombre: "VAN", meta: "> 0", real: formatearMoneda(calcularVAN()), cumplimiento: calcularVAN() > 0 ? "" : "" },
            { nombre: "Payback", meta: "< 2 años", real: calcularPayback() + " meses", cumplimiento: calcularPayback() <= 24 ? "" : "" }
        ];
        
        indicadoresBody.innerHTML = indicadores.map(i => `
            <tr><td>${i.nombre}</td><td>${i.meta}</td><td>${i.real}</td><td>${i.cumplimiento}</td></tr>
        `).join('');
    }
    
    // Dibujar gráfico
    dibujarGraficoBeneficios();
}

function calcularROI() {
    let costeTotal = (proyecto.elementosGantt || []).reduce((sum, e) => sum + (e.costeEstimado || 0), 0);
    (proyecto.materiales || []).forEach(m => costeTotal += m.cantidad * m.costeUnitario);
    let beneficio = (proyecto.precioVenta || 0) - costeTotal;
    return costeTotal > 0 ? (beneficio / costeTotal * 100).toFixed(1) : 0;
}

function calcularVAN() {
    let flujos = [];
    let tasaDescuento = 0.1;
    (proyecto.hitosFinancieros || []).forEach(h => {
        flujos.push({ mes: h.mes || 1, valor: h.importeFijo || ((proyecto.precioVenta || 0) * (h.porcentaje || 0) / 100) });
    });
    
    let van = 0;
    flujos.forEach(f => {
        van += f.valor / Math.pow(1 + tasaDescuento, f.mes / 12);
    });
    return van;
}

function calcularPayback() {
    let acumulado = 0;
    let meses = 0;
    let ingresosMensuales = (proyecto.precioVenta || 0) / 12;
    let costeTotal = (proyecto.elementosGantt || []).reduce((sum, e) => sum + (e.costeEstimado || 0), 0);
    (proyecto.materiales || []).forEach(m => costeTotal += m.cantidad * m.costeUnitario);
    
    while (acumulado < costeTotal && meses < 60) {
        meses++;
        acumulado += ingresosMensuales;
    }
    return meses;
}

function dibujarGraficoBeneficios() {
    const ctx = document.getElementById('beneficiosChart')?.getContext('2d');
    if (!ctx) return;
    
    // Destruir gráfico existente si hay
    if (window.beneficiosChartInstance) window.beneficiosChartInstance.destroy();
    
    const historial = proyecto.beneficios?.historial || [];
    const labels = historial.map(h => h.fecha);
    const datos = historial.map(h => h.valor);
    
    window.beneficiosChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.length ? labels : ['Inicio', 'Actual', 'Proyectado'],
            datasets: [
                {
                    label: tApp('chart_beneficio_real'),
                    data: datos.length ? datos : [0, proyecto.beneficios?.real || 0, 0],
                    borderColor: '#00A859',
                    backgroundColor: 'rgba(0,168,89,0.1)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: tApp('chart_beneficio_proyectado'),
                    data: [0, proyecto.beneficios?.proyectado || 0, proyecto.beneficios?.proyectado || 0],
                    borderColor: '#007AFF',
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.dataset.label}: ${formatearMoneda(context.raw)}`
                    }
                }
            }
        }
    });
}

function registrarBeneficioReal() {
    const valor = prompt(tApp('prompt_beneficio_real'), proyecto.beneficios?.real || 0);
    if (valor !== null && !isNaN(parseFloat(valor))) {
        if (!proyecto.beneficios) proyecto.beneficios = {};
        proyecto.beneficios.real = parseFloat(valor);
        
        if (!proyecto.beneficios.historial) proyecto.beneficios.historial = [];
        proyecto.beneficios.historial.push({
            fecha: new Date().toISOString().split('T')[0],
            valor: parseFloat(valor)
        });
        
        guardarProyecto();
        renderizarBeneficios();
        mostrarToast(` Beneficio real registrado: ${formatearMoneda(parseFloat(valor))}`, 'success');
    }
}

function agregarHitoBeneficio() {
    const modalHtml = `
        <div class="modal-content modal-500">
            <div class="modal-header">
                <h3> Nuevo Hito de Beneficio</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div class="form-group">
                <label>Nombre del hito</label>
                <input type="text" id="hitoBeneficioNombre" placeholder="Ej: Alcanzar ROI > 15%">
            </div>
            <div class="form-group">
                <label> Fecha objetivo</label>
                <input type="date" id="hitoBeneficioFecha">
            </div>
            <div class="form-group">
                <label> Meta (€)</label>
                <input type="number" id="hitoBeneficioMeta" placeholder="0">
            </div>
            <div class="form-group">
                <label> Real (€) - opcional</label>
                <input type="number" id="hitoBeneficioReal" placeholder="0">
            </div>
            <button class="btn btn-primary" onclick="guardarHitoBeneficio()">Guardar</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function guardarHitoBeneficio() {
    let nombre = document.getElementById('hitoBeneficioNombre').value.trim();
    if (!nombre) { mostrarToast(tApp('toast_nombre_obligatorio'), 'error'); return; }
    
    const nuevoHito = {
        id: Date.now(),
        nombre: nombre,
        fecha: document.getElementById('hitoBeneficioFecha').value,
        meta: parseFloat(document.getElementById('hitoBeneficioMeta').value) || 0,
        real: parseFloat(document.getElementById('hitoBeneficioReal').value) || 0
    };
    
    if (!proyecto.beneficios) proyecto.beneficios = {};
    if (!proyecto.beneficios.hitos) proyecto.beneficios.hitos = [];
    proyecto.beneficios.hitos.push(nuevoHito);
    
    guardarProyecto();
    renderizarBeneficios();
    cerrarModalGeneric();
    mostrarToast(` Hito "${nombre}" agregado`, 'success');
}

function editarHitoBeneficio(id) {
    const hito = proyecto.beneficios?.hitos?.find(h => h.id === id);
    if (!hito) return;
    
    const modalHtml = `
        <div class="modal-content modal-500">
            <div class="modal-header">
                <h3> Editar Hito de Beneficio</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="editHitoId" value="${id}">
            <div class="form-group">
                <label>Nombre</label>
                <input type="text" id="editHitoNombre" value="${escapeHtml(hito.nombre)}">
            </div>
            <div class="form-group">
                <label>Fecha objetivo</label>
                <input type="date" id="editHitoFecha" value="${hito.fecha || ''}">
            </div>
            <div class="form-group">
                <label>Meta (€)</label>
                <input type="number" id="editHitoMeta" value="${hito.meta || 0}">
            </div>
            <div class="form-group">
                <label>Real (€)</label>
                <input type="number" id="editHitoReal" value="${hito.real || 0}">
            </div>
            <button class="btn btn-primary" onclick="actualizarHitoBeneficio()">Actualizar</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function actualizarHitoBeneficio() {
    const id = parseInt(document.getElementById('editHitoId').value);
    const idx = proyecto.beneficios.hitos.findIndex(h => h.id === id);
    if (idx >= 0) {
        proyecto.beneficios.hitos[idx] = {
            id: id,
            nombre: document.getElementById('editHitoNombre').value,
            fecha: document.getElementById('editHitoFecha').value,
            meta: parseFloat(document.getElementById('editHitoMeta').value) || 0,
            real: parseFloat(document.getElementById('editHitoReal').value) || 0
        };
        guardarProyecto();
        renderizarBeneficios();
        cerrarModalGeneric();
        mostrarToast(tApp('toast_hito_actualizado'), 'success');
    }
}

function eliminarHitoBeneficio(id) {
    if (confirm(tApp('confirmar_eliminar_hito'))) {
        proyecto.beneficios.hitos = proyecto.beneficios.hitos.filter(h => h.id !== id);
        guardarProyecto();
        renderizarBeneficios();
        mostrarToast(tApp('toast_hito_eliminado'), 'success');
    }
}

function exportarBeneficios() {
    const b = proyecto.beneficios || {};
    let csv = "Indicador,Valor\n";
    csv += `Beneficio Proyectado,${b.proyectado || 0}\n`;
    csv += `Beneficio Real,${b.real || 0}\n`;
    csv += `Desviación,${b.proyectado > 0 ? (((b.real || 0) - b.proyectado) / b.proyectado * 100).toFixed(1) : 0}%\n`;
    csv += `ROI,${calcularROI()}%\n`;
    csv += `VAN,${calcularVAN()}\n`;
    csv += `Payback,${calcularPayback()} meses\n`;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `beneficios_${proyecto.nombre}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Beneficios exportados", 'success');
}  

// ============================================
// GESTIÓN DE CAMBIOS
// ============================================

function inicializarCambios() {
    if (!proyecto.cambios) proyecto.cambios = [];
    renderizarCambios();
}

function renderizarCambios() {
    const cambios = proyecto.cambios || [];
    
    document.getElementById('cambiosPendientes').innerHTML = cambios.filter(c => c.estado === 'Pendiente').length;
    document.getElementById('cambiosAprobados').innerHTML = cambios.filter(c => c.estado === 'Aprobado').length;
    document.getElementById('cambiosRechazados').innerHTML = cambios.filter(c => c.estado === 'Rechazado').length;
    document.getElementById('cambiosImplementados').innerHTML = cambios.filter(c => c.estado === 'Implementado').length;
    
    const tbody = document.getElementById('cambiosBody');
    if (cambios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="u-text-center">No hay solicitudes de cambio</td></tr>';
        return;
    }
    
    tbody.innerHTML = cambios.map(c => `
        <tr>
            <td>#${c.id}</td>
            <td>${formatearFechaEspa(c.fecha)}</td>
            <td>${escapeHtml(c.solicitante || '-')}</td>
            <td>${escapeHtml(c.descripcion || '-').substring(0, 50)}</td>
            <td>${c.impacto || '-'}</td>
            <td><span class="badge-${c.prioridad === 'Alta' ? 'progreso' : (c.prioridad === 'Media' ? 'pais' : 'completado')}">${c.prioridad || 'Media'}</span></td>
            <td><span class="badge-${c.estado === 'Aprobado' ? 'completado' : (c.estado === 'Pendiente' ? 'progreso' : 'pendiente')}">${c.estado || 'Pendiente'}</span></td>
            <td>${escapeHtml(c.aprobadoPor || '-')}</td>
            <td>
                <span class="edit-btn" onclick="editarCambio(${c.id})"></span>
                <span class="delete-btn" onclick="eliminarCambio(${c.id})"></span>
            </td>
        </tr>
    `).join('');
}

function abrirModalNuevoCambio() {
    const hoy = new Date().toISOString().split('T')[0];
    const modalHtml = `
        <div class="modal-content modal-600">
            <div class="modal-header">
                <h3> Nueva Solicitud de Cambio</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div class="form-group">
                <label> Descripción del cambio *</label>
                <textarea rows="2" id="cambioDescripcion" placeholder="Describa el cambio solicitado..."></textarea>
            </div>
            <div class="form-group">
                <label> Solicitante</label>
                <input type="text" id="cambioSolicitante" placeholder="Nombre del solicitante">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Impacto en Costo</label>
                    <input type="text" id="cambioImpactoCosto" placeholder="Ej: +5.000€">
                </div>
                <div class="form-group">
                    <label> Impacto en Plazo</label>
                    <input type="text" id="cambioImpactoPlazo" placeholder="Ej: +10 días">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Prioridad</label>
                    <select id="cambioPrioridad">
                        <option value="Baja">Baja</option>
                        <option value="Media" selected>Media</option>
                        <option value="Alta">Alta</option>
                        <option value="Crítica">Crítica</option>
                    </select>
                </div>
                <div class="form-group">
                    <label> Fecha solicitud</label>
                    <input type="date" id="cambioFecha" value="${hoy}">
                </div>
            </div>
            <div class="form-group">
                <label> Justificación del cambio</label>
                <textarea rows="2" id="cambioJustificacion" placeholder="¿Por qué es necesario este cambio?"></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Estado inicial</label>
                    <select id="cambioEstado">
                        <option value="Pendiente">Pendiente de revisión</option>
                        <option value="En análisis">En análisis</option>
                        <option value="Aprobado">Aprobado</option>
                        <option value="Rechazado">Rechazado</option>
                        <option value="Implementado">Implementado</option>
                    </select>
                </div>
                <div class="form-group">
                    <label> Aprobado por</label>
                    <input type="text" id="cambioAprobadoPor" placeholder="Nombre del aprobador">
                </div>
            </div>
            <button class="btn btn-primary" onclick="guardarCambio()">Guardar Solicitud</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function guardarCambio() {
    let descripcion = document.getElementById('cambioDescripcion').value.trim();
    if (!descripcion) { mostrarToast(tApp('toast_descripcion_obligatoria'), 'error'); return; }
    
    const nuevoCambio = {
        id: Date.now(),
        fecha: document.getElementById('cambioFecha').value,
        solicitante: document.getElementById('cambioSolicitante').value,
        descripcion: descripcion,
        impacto: ` ${document.getElementById('cambioImpactoCosto').value || '0'} |  ${document.getElementById('cambioImpactoPlazo').value || '0'}`,
        prioridad: document.getElementById('cambioPrioridad').value,
        estado: document.getElementById('cambioEstado').value,
        justificacion: document.getElementById('cambioJustificacion').value,
        aprobadoPor: document.getElementById('cambioAprobadoPor').value,
        fechaRegistro: new Date().toISOString()
    };
    
    if (!proyecto.cambios) proyecto.cambios = [];
    proyecto.cambios.push(nuevoCambio);
    
    guardarProyecto();
    renderizarCambios();
    cerrarModalGeneric();
    mostrarToast(` Solicitud de cambio #${nuevoCambio.id} registrada`, 'success');
}

function editarCambio(id) {
    const cambio = proyecto.cambios?.find(c => c.id === id);
    if (!cambio) return;
    
    const modalHtml = `
        <div class="modal-content modal-600">
            <div class="modal-header">
                <h3> Editar Solicitud #${id}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="editCambioId" value="${id}">
            <div class="form-group">
                <label>Descripción</label>
                <textarea rows="2" id="editCambioDescripcion">${escapeHtml(cambio.descripcion)}</textarea>
            </div>
            <div class="form-group">
                <label>Solicitante</label>
                <input type="text" id="editCambioSolicitante" value="${escapeHtml(cambio.solicitante || '')}">
            </div>
            <div class="form-row">
                <div class="form-group"><label>Prioridad</label>
                    <select id="editCambioPrioridad">
                        <option value="Baja" ${cambio.prioridad === 'Baja' ? 'selected' : ''}>Baja</option>
                        <option value="Media" ${cambio.prioridad === 'Media' ? 'selected' : ''}>Media</option>
                        <option value="Alta" ${cambio.prioridad === 'Alta' ? 'selected' : ''}>Alta</option>
                        <option value="Crítica" ${cambio.prioridad === 'Crítica' ? 'selected' : ''}>Crítica</option>
                    </select>
                </div>
                <div class="form-group"><label>Estado</label>
                    <select id="editCambioEstado">
                        <option value="Pendiente" ${cambio.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="En análisis" ${cambio.estado === 'En análisis' ? 'selected' : ''}>En análisis</option>
                        <option value="Aprobado" ${cambio.estado === 'Aprobado' ? 'selected' : ''}>Aprobado</option>
                        <option value="Rechazado" ${cambio.estado === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
                        <option value="Implementado" ${cambio.estado === 'Implementado' ? 'selected' : ''}>Implementado</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Aprobado por</label>
                <input type="text" id="editCambioAprobadoPor" value="${escapeHtml(cambio.aprobadoPor || '')}">
            </div>
            <button class="btn btn-primary" onclick="actualizarCambio()">Actualizar</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function actualizarCambio() {
    const id = parseInt(document.getElementById('editCambioId').value);
    const idx = proyecto.cambios.findIndex(c => c.id === id);
    if (idx >= 0) {
        proyecto.cambios[idx] = {
            ...proyecto.cambios[idx],
            descripcion: document.getElementById('editCambioDescripcion').value,
            solicitante: document.getElementById('editCambioSolicitante').value,
            prioridad: document.getElementById('editCambioPrioridad').value,
            estado: document.getElementById('editCambioEstado').value,
            aprobadoPor: document.getElementById('editCambioAprobadoPor').value
        };
        guardarProyecto();
        renderizarCambios();
        cerrarModalGeneric();
        mostrarToast(tApp('toast_solicitud_actualizada'), 'success');
    }
}

function eliminarCambio(id) {
    if (confirm(tApp('confirmar_eliminar_cambio'))) {
        proyecto.cambios = proyecto.cambios.filter(c => c.id !== id);
        guardarProyecto();
        renderizarCambios();
        mostrarToast(tApp('toast_solicitud_eliminada'), 'success');
    }
}
// ============================================
// LECCIONES APRENDIDAS
// ============================================

function inicializarLecciones() {
    if (!proyecto.lecciones) proyecto.lecciones = [];
    renderizarLecciones();
}

function renderizarLecciones() {
    const lecciones = proyecto.lecciones || [];
    
    document.getElementById('totalExitos').innerHTML = lecciones.filter(l => l.categoria === 'exito').length;
    document.getElementById('totalMejoras').innerHTML = lecciones.filter(l => l.categoria === 'mejora').length;
    document.getElementById('totalRecomendaciones').innerHTML = lecciones.filter(l => l.categoria === 'recomendacion').length;
    
    const container = document.getElementById('listaLecciones');
    if (lecciones.length === 0) {
        container.innerHTML = '<div class="info-card u-text-center">No hay lecciones registradas. ¡Comienza a documentar tu aprendizaje!</div>';
        return;
    }
    
    const colores = {
        exito: 'border-left-color: #00A859;',
        mejora: 'border-left-color: #FF8C00;',
        recomendacion: 'border-left-color: #007AFF;'
    };
    
    const iconos = {
        exito: '',
        mejora: '',
        recomendacion: ''
    };
    
    container.innerHTML = lecciones.map(l => `
        <div class="info-card" style="${colores[l.categoria] || colores.recomendacion}">
            <div class="u-flex-jc-sb">
                <h4>${iconos[l.categoria]} ${escapeHtml(l.titulo)}</h4>
                <div>
                    <span class="edit-btn" onclick="editarLeccion(${l.id})"></span>
                    <span class="delete-btn" onclick="eliminarLeccion(${l.id})"></span>
                </div>
            </div>
            <div class="details u-mt-12">
                <div><strong> Descripción:</strong><br>${escapeHtml(l.descripcion)}</div>
                <div class="u-mt-8"><strong> Acción recomendada:</strong><br>${escapeHtml(l.accion)}</div>
                <div class="u-mt-8 u-fs-11 u-color-muted">
                     ${l.fecha ? formatearFechaEspa(l.fecha) : '-'}
                </div>
            </div>
        </div>
    `).join('');
}

function abrirModalNuevaLeccion() {
    const modalHtml = `
        <div class="modal-content modal-sm">
            <div class="modal-header">
                <h3> Nueva Lección Aprendida</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div class="form-group">
                <label>Categoría</label>
                <select id="leccionCategoria">
                    <option value="exito"> Éxito (lo que salió bien)</option>
                    <option value="mejora"> Área de mejora (lo que salió mal)</option>
                    <option value="recomendacion"> Recomendación para futuros proyectos</option>
                </select>
            </div>
            <div class="form-group">
                <label>Título *</label>
                <input type="text" id="leccionTitulo" placeholder="Ej: Importancia de la planificación temprana">
            </div>
            <div class="form-group">
                <label>Descripción detallada</label>
                <textarea rows="3" id="leccionDescripcion" placeholder="¿Qué ocurrió? ¿Cuál fue el contexto?"></textarea>
            </div>
            <div class="form-group">
                <label>Acción recomendada / Solución aplicada</label>
                <textarea rows="2" id="leccionAccion" placeholder="¿Qué se hizo o qué se recomienda hacer?"></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Autor</label>
                    <input type="text" id="leccionAutor" value="PMO">
                </div>
                <div class="form-group">
                    <label> Fecha</label>
                    <input type="date" id="leccionFecha" value="${new Date().toISOString().split('T')[0]}">
                </div>
            </div>
            <button class="btn btn-primary" onclick="guardarLeccion()">Guardar Lección</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function guardarLeccion() {
    let titulo = document.getElementById('leccionTitulo').value.trim();
    if (!titulo) { mostrarToast(tApp('toast_titulo_obligatorio_gen'), 'error'); return; }
    
    const nuevaLeccion = {
        id: Date.now(),
        categoria: document.getElementById('leccionCategoria').value,
        titulo: titulo,
        descripcion: document.getElementById('leccionDescripcion').value,
        accion: document.getElementById('leccionAccion').value,
        autor: document.getElementById('leccionAutor').value,
        fecha: document.getElementById('leccionFecha').value,
        fechaRegistro: new Date().toISOString()
    };
    
    if (!proyecto.lecciones) proyecto.lecciones = [];
    proyecto.lecciones.push(nuevaLeccion);
    
    guardarProyecto();
    renderizarLecciones();
    cerrarModalGeneric();
    mostrarToast(` Lección "${titulo}" registrada`, 'success');
}

function editarLeccion(id) {
    const leccion = proyecto.lecciones?.find(l => l.id === id);
    if (!leccion) return;
    
    const modalHtml = `
        <div class="modal-content modal-sm">
            <div class="modal-header">
                <h3> Editar Lección</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="editLeccionId" value="${id}">
            <div class="form-group">
                <label>Categoría</label>
                <select id="editLeccionCategoria">
                    <option value="exito" ${leccion.categoria === 'exito' ? 'selected' : ''}> Éxito</option>
                    <option value="mejora" ${leccion.categoria === 'mejora' ? 'selected' : ''}> Área de mejora</option>
                    <option value="recomendacion" ${leccion.categoria === 'recomendacion' ? 'selected' : ''}> Recomendación</option>
                </select>
            </div>
            <div class="form-group">
                <label>Título</label>
                <input type="text" id="editLeccionTitulo" value="${escapeHtml(leccion.titulo)}">
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <textarea rows="3" id="editLeccionDescripcion">${escapeHtml(leccion.descripcion)}</textarea>
            </div>
            <div class="form-group">
                <label>Acción</label>
                <textarea rows="2" id="editLeccionAccion">${escapeHtml(leccion.accion)}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Autor</label>
                    <input type="text" id="editLeccionAutor" value="${escapeHtml(leccion.autor)}">
                </div>
                <div class="form-group">
                    <label>Fecha</label>
                    <input type="date" id="editLeccionFecha" value="${leccion.fecha || ''}">
                </div>
            </div>
            <button class="btn btn-primary" onclick="actualizarLeccion()">Actualizar</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function actualizarLeccion() {
    const id = parseInt(document.getElementById('editLeccionId').value);
    const idx = proyecto.lecciones.findIndex(l => l.id === id);
    if (idx >= 0) {
        proyecto.lecciones[idx] = {
            ...proyecto.lecciones[idx],
            categoria: document.getElementById('editLeccionCategoria').value,
            titulo: document.getElementById('editLeccionTitulo').value,
            descripcion: document.getElementById('editLeccionDescripcion').value,
            accion: document.getElementById('editLeccionAccion').value,
            autor: document.getElementById('editLeccionAutor').value,
            fecha: document.getElementById('editLeccionFecha').value
        };
        guardarProyecto();
        renderizarLecciones();
        cerrarModalGeneric();
        mostrarToast(tApp('toast_leccion_actualizada'), 'success');
    }
}

function eliminarLeccion(id) {
    if (confirm(tApp('confirmar_eliminar_leccion'))) {
        proyecto.lecciones = proyecto.lecciones.filter(l => l.id !== id);
        guardarProyecto();
        renderizarLecciones();
        mostrarToast(tApp('toast_leccion_eliminada'), 'success');
    }
}
// ============================================
// GESTIÓN DE CONFIGURACIÓN (Versionado)
// ============================================

function generarOpcionesVersion(actual) {
    const opciones = ['1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '2.0', '2.1', '2.2', '3.0'];
    return opciones.map(v => `<option value="${v}" ${v === actual ? 'selected' : ''}>v${v}</option>`).join('');
}

function actualizarVersionEntregable(id, nuevaVersion) {
    const elemento = proyecto.elementosGantt?.find(e => e.id === id);
    if (elemento && elemento.tipo === 'entregable') {
        const versionAnterior = elemento.version || '1.0';
        elemento.version = nuevaVersion;
        
        // Registrar en el historial de versiones
        if (!elemento.historialVersiones) elemento.historialVersiones = [];
        elemento.historialVersiones.push({
            version: nuevaVersion,
            fecha: new Date().toISOString(),
                    usuario: 'PM'
        });
        
        guardarProyecto();
        mostrarToast(` Entregable "${elemento.nombre}" actualizado a versión ${nuevaVersion}`, 'success');
        
        // Si hay cambio mayor, sugerir registrar lección
        if (versionAnterior.split('.')[0] !== nuevaVersion.split('.')[0]) {
            mostrarToast(" Cambio mayor de versión. Considera registrar una lección aprendida.", 'info');
        }
    }
}

function verHistorialVersiones(id) {
    const elemento = proyecto.elementosGantt?.find(e => e.id === id);
    if (!elemento || !elemento.historialVersiones) {
        mostrarToast("No hay historial de versiones", 'info');
        return;
    }
    
    const modalHtml = `
        <div class="modal-content modal-500">
            <div class="modal-header">
                <h3> Historial de Versiones - ${escapeHtml(elemento.nombre)}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <table class="data-table">
                <thead><tr><th>Versión</th><th>Fecha</th><th>Usuario</th></tr></thead>
                <tbody>
                    ${elemento.historialVersiones.map(h => `
                        <tr><td>v${h.version}</td><td>${formatearFechaEspa(h.fecha?.split('T'.split('T')[0])[0])}</td><td>${h.usuario}</td></tr>
                    `).join('')}
                </tbody>
            </table>
            <button class="btn btn-primary" onclick="cerrarModalGeneric()">Cerrar</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}
// ============================================
// MÉTRICAS ÁGILES
// ============================================


