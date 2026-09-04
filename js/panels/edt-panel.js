// ============================================
// MODAL FLOTANTE PARA EDT - VERSIÓN CORREGIDA
// ============================================

// Declarar variables ANTES de usarlas
var edtPanelAbiertoGlobal = false;
var edtActualIdGlobal = null;

// ============================================
// PANEL EDT INTEGRADO EN EL CRONOGRAMA
// ============================================

var vistaActual = 'gantt'; // 'gantt' o 'edt'
var edtSeleccionadaId = null;

function abrirModalEDT(edtId) {
    console.log(" abrirModalEDT llamado con ID:", edtId);
    
    // Buscar la EDT
    var edt = null;
    if (proyecto && proyecto.elementosGantt) {
        for (var i = 0; i < proyecto.elementosGantt.length; i++) {
            if (proyecto.elementosGantt[i].id === edtId && proyecto.elementosGantt[i].tipo === 'edt') {
                edt = proyecto.elementosGantt[i];
                break;
            }
        }
    }
    
    if (!edt) {
        mostrarToast(" EDT no encontrada", 'error');
        return;
    }
    
    edtSeleccionadaId = edtId;
    vistaActual = 'edt';
    
    // Obtener elementos hijos
    var elementosHijos = [];
    for (var i = 0; i < (proyecto.elementosGantt || []).length; i++) {
        if (proyecto.elementosGantt[i].dependeDe === edtId) {
            elementosHijos.push(proyecto.elementosGantt[i]);
        }
    }
    
    // Separar por tipo
    var actividades = [];
    var entregables = [];
    var hitos = [];
    for (var i = 0; i < elementosHijos.length; i++) {
        var e = elementosHijos[i];
        if (e.tipo === 'actividad') actividades.push(e);
        else if (e.tipo === 'entregable') entregables.push(e);
        else if (e.tipo === 'hito') hitos.push(e);
    }
    
    // Calcular progreso
    var sumaProgreso = 0;
    var totalConProgreso = 0;
    for (var i = 0; i < elementosHijos.length; i++) {
        if (elementosHijos[i].tipo !== 'hito') {
            sumaProgreso += (elementosHijos[i].progreso || 0);
            totalConProgreso++;
        }
    }
    var progresoTotal = totalConProgreso > 0 ? (sumaProgreso / totalConProgreso) : 0;
    
    // Coste total
    var costeTotal = 0;
    for (var i = 0; i < elementosHijos.length; i++) {
        costeTotal += (elementosHijos[i].costeEstimado || 0);
    }
    
    // Código EDT
    var codigoEDT = edt.codigo || '';
    if (typeof obtenerCodigoElemento === 'function') {
        codigoEDT = obtenerCodigoElemento(edt, proyecto.elementosGantt) || codigoEDT;
    }
    
    // Generar HTML
    var html = renderizarVistaEDT(edt, actividades, entregables, hitos, progresoTotal, costeTotal, codigoEDT);
    
    // Reemplazar el contenido del contenedor de cronograma
    var cronoContainer = document.getElementById('cronogramaContainer');
    var wbsPanel = document.getElementById('wbsTree');
    var botonesContainer = document.querySelector('#panelCronograma .panel-title:first-child');
    
    if (cronoContainer) {
        // Guardar el HTML original para volver
        window.ganttOriginalHTML = cronoContainer.innerHTML;
        
        // Mostrar vista EDT
        cronoContainer.innerHTML = html;
        cronoContainer.style.minHeight = '500px';
        
        // Ocultar árbol WBS
        if (wbsPanel) wbsPanel.style.display = 'none';
        
        // Cambiar el título del panel
        if (botonesContainer) {
            var tituloOriginal = botonesContainer.querySelector('span');
            if (tituloOriginal && !window.tituloOriginalGuardado) {
                window.tituloOriginalGuardado = tituloOriginal.innerHTML;
                tituloOriginal.innerHTML = ` EDT: ${edt.nombre} ${codigoEDT ? `[${codigoEDT}]` : ''}`;
            }
        }
        
        // Mostrar botón de volver si no existe
        if (!document.getElementById('btnVolverGantt')) {
            var btnVolver = document.createElement('button');
            btnVolver.id = 'btnVolverGantt';
            btnVolver.className = 'btn btn-secondary btn-small';
            btnVolver.innerHTML = '← Volver al Gantt';
            btnVolver.style.marginLeft = '12px';
            btnVolver.onclick = volverAlGantt;
            if (botonesContainer) botonesContainer.appendChild(btnVolver);
        } else {
            document.getElementById('btnVolverGantt').style.display = 'inline-block';
        }
    }
}

function renderizarVistaEDT(edt, actividades, entregables, hitos, progresoTotal, costeTotal, codigoEDT) {
    
    function renderTarjeta(elemento) {
        var fechaFin = elemento.inicio ? sumarDias(elemento.inicio, elemento.duracion) : '-';
        var progreso = elemento.progreso || 0;
        var responsable = elemento.responsable || (elemento.recursoAsignado ? elemento.recursoAsignado.nombre : 'Sin asignar');
        
        var iconos = { actividad: '', entregable: '', hito: '' };
        var icono = iconos[elemento.tipo] || '';
        
        var barraColor = '#007AFF';
        if (progreso >= 80) barraColor = '#00A859';
        else if (progreso >= 50) barraColor = '#FF8C00';
        else if (progreso > 0) barraColor = '#FF3B30';
        
        return `
            <div class="edt-elemento-card" style="background: var(--bg-card); border-radius: 12px; padding: 12px; margin-bottom: 12px; border: 1px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div style="font-weight: 600; font-size: 13px;">
                        ${icono} ${escapeHtml(elemento.nombre)}
                        ${elemento.codigo ? `<span style="font-size: 9px; background: rgba(0,122,255,0.2); padding: 2px 6px; border-radius: 10px; margin-left: 6px;">${escapeHtml(elemento.codigo)}</span>` : ''}
                    </div>
                    <div style="display: flex; gap: 4px;">
                        <button onclick="editarElementoGantt(${elemento.id}); setTimeout(function(){ if(edtSeleccionadaId) abrirModalEDT(edtSeleccionadaId); }, 500);" class="u-btn-ghost" title="Editar"></button>
                        <button onclick="copiarElementoDesdeEDT(${elemento.id})" class="u-btn-ghost" title="Copiar"></button>
                        <button onclick="eliminarElementoDesdeEDT(${elemento.id})" class="u-btn-ghost" title="Eliminar"></button>
                    </div>
                </div>
                <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 8px;">
                     ${elemento.inicio || '-'} → ${fechaFin}
                </div>
                <div style="margin: 8px 0;">
                    <div style="background: var(--progress-bg); border-radius: 10px; height: 4px; overflow: hidden;">
                        <div style="width: ${progreso}%; height: 100%; background: ${barraColor};"></div>
                    </div>
                    <div style="font-size: 9px; margin-top: 4px;">${progreso}% completado</div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 10px; color: var(--text-muted);">
                    <span> ${escapeHtml(responsable)}</span>
                    ${elemento.costeEstimado > 0 ? `<span> ${formatearMoneda(elemento.costeEstimado)}</span>` : ''}
                </div>
            </div>
        `;
    }
    
    var actividadesHtml = '';
    for (var i = 0; i < actividades.length; i++) {
        actividadesHtml += renderTarjeta(actividades[i]);
    }
    if (actividades.length === 0) actividadesHtml = '<div class="u-empty-state"> No hay actividades</div>';
    
    var entregablesHtml = '';
    for (var i = 0; i < entregables.length; i++) {
        entregablesHtml += renderTarjeta(entregables[i]);
    }
    if (entregables.length === 0) entregablesHtml = '<div class="u-empty-state"> No hay entregables</div>';
    
    var hitosHtml = '';
    for (var i = 0; i < hitos.length; i++) {
        hitosHtml += renderTarjeta(hitos[i]);
    }
    if (hitos.length === 0) hitosHtml = '<div class="u-empty-state"> No hay hitos</div>';
    
    return `
        <div class="edt-view-container" style="padding: 16px;">
            <!-- Estadísticas -->
            <div style="display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap;">
                <div style="flex: 1; background: var(--bg-card); border-radius: 12px; padding: 12px; text-align: center; border: 1px solid var(--border-color);">
                    <div style="font-size: 22px; font-weight: 700;">${Math.round(progresoTotal)}%</div>
                    <div class="u-fs-10 u-color-muted">Progreso</div>
                    <div style="margin-top: 8px; background: rgba(255,255,255,0.1); border-radius: 10px; height: 4px; overflow: hidden;">
                        <div style="width: ${progresoTotal}%; height: 100%; background: #007AFF;"></div>
                    </div>
                </div>
                <div style="flex: 1; background: var(--bg-card); border-radius: 12px; padding: 12px; text-align: center; border: 1px solid var(--border-color);">
                    <div style="font-size: 18px; font-weight: 700;">${formatearMoneda(costeTotal)}</div>
                    <div class="u-fs-10 u-color-muted">Coste total</div>
                </div>
                <div style="flex: 1; background: var(--bg-card); border-radius: 12px; padding: 12px; text-align: center; border: 1px solid var(--border-color);">
                    <div style="font-size: 18px; font-weight: 700;">${actividades.length + entregables.length + hitos.length}</div>
                    <div class="u-fs-10 u-color-muted">Elementos totales</div>
                </div>
            </div>
            
            <!-- Vista Kanban -->
            <div style="display: flex; gap: 20px; overflow-x: auto; min-height: 400px;">
                <!-- Actividades -->
                <div class="u-kanban-col">
                    <div style="padding: 14px 16px; border-bottom: 2px solid #FF8C00; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="font-size: 14px; font-weight: 600; margin: 0;"><span> ACTIVIDADES</span> <span class="u-badge-light">${actividades.length}</span></h3>
                        <button onclick="abrirNuevoElementoConPadre(${edt.id}, 'actividad')" style="background: rgba(0,168,89,0.2); border: none; padding: 4px 10px; border-radius: 8px; cursor: pointer; font-size: 11px; color: #00A859;">+ Añadir</button>
                    </div>
                    <div class="u-scroll-panel">
                        ${actividadesHtml}
                    </div>
                </div>
                
                <!-- Entregables -->
                <div class="u-kanban-col">
                    <div style="padding: 14px 16px; border-bottom: 2px solid #00A859; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="font-size: 14px; font-weight: 600; margin: 0;"><span> ENTREGABLES</span> <span class="u-badge-light">${entregables.length}</span></h3>
                        <button onclick="abrirNuevoElementoConPadre(${edt.id}, 'entregable')" style="background: rgba(0,168,89,0.2); border: none; padding: 4px 10px; border-radius: 8px; cursor: pointer; font-size: 11px; color: #00A859;">+ Añadir</button>
                    </div>
                    <div class="u-scroll-panel">
                        ${entregablesHtml}
                    </div>
                </div>
                
                <!-- Hitos -->
                <div class="u-kanban-col">
                    <div style="padding: 14px 16px; border-bottom: 2px solid #FF3B30; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="font-size: 14px; font-weight: 600; margin: 0;"><span> HITOS</span> <span class="u-badge-light">${hitos.length}</span></h3>
                        <button onclick="abrirNuevoElementoConPadre(${edt.id}, 'hito')" style="background: rgba(0,168,89,0.2); border: none; padding: 4px 10px; border-radius: 8px; cursor: pointer; font-size: 11px; color: #00A859;">+ Añadir</button>
                    </div>
                    <div class="u-scroll-panel">
                        ${hitosHtml}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function volverAlGantt() {
    vistaActual = 'gantt';
    edtSeleccionadaId = null;
    
    var cronoContainer = document.getElementById('cronogramaContainer');
    var wbsPanel = document.getElementById('wbsTree');
    var botonesContainer = document.querySelector('#panelCronograma .panel-title:first-child');
    
    if (cronoContainer && window.ganttOriginalHTML) {
        cronoContainer.innerHTML = window.ganttOriginalHTML;
        cronoContainer.style.minHeight = '400px';
        window.ganttOriginalHTML = null;
    }
    
    if (wbsPanel) wbsPanel.style.display = '';
    
    if (botonesContainer) {
        var titulo = botonesContainer.querySelector('span');
        if (titulo && window.tituloOriginalGuardado) {
            titulo.innerHTML = window.tituloOriginalGuardado;
            window.tituloOriginalGuardado = null;
        }
    }
    
    var btnVolver = document.getElementById('btnVolverGantt');
    if (btnVolver) btnVolver.style.display = 'none';
    
    // Recargar el cronograma
    if (typeof renderizarCronograma === 'function') renderizarCronograma();
}

// Mantener las funciones auxiliares
function cerrarModalEDT() {
    volverAlGantt();
}

function copiarElementoDesdeEDT(elementoId) {
    var original = null;
    for (var i = 0; i < proyecto.elementosGantt.length; i++) {
        if (proyecto.elementosGantt[i].id === elementoId) {
            original = proyecto.elementosGantt[i];
            break;
        }
    }
    if (!original) return;
    
    var copia = JSON.parse(JSON.stringify(original));
    copia.id = Date.now() + Math.random() * 1000;
    copia.nombre = original.nombre + " (Copia)";
    copia.progreso = 0;
    copia.finReal = null;
    copia.inicioReal = null;
    
    proyecto.elementosGantt.push(copia);
    guardarProyecto();
    if (typeof reordenarNumeracionElementos === 'function') reordenarNumeracionElementos();
    
    if (edtSeleccionadaId) {
        abrirModalEDT(edtSeleccionadaId);
    }
    mostrarToast(' Elemento copiado', 'success');
}

function eliminarElementoDesdeEDT(elementoId) {
    if (!confirm(tApp('confirmar_eliminar_elemento'))) return;
    
    var nombre = '';
    for (var i = 0; i < proyecto.elementosGantt.length; i++) {
        if (proyecto.elementosGantt[i].id === elementoId) {
            nombre = proyecto.elementosGantt[i].nombre;
            break;
        }
    }
    
    proyecto.elementosGantt = proyecto.elementosGantt.filter(function(e) { return e.id !== elementoId; });
    guardarProyecto();
    if (typeof reordenarNumeracionElementos === 'function') reordenarNumeracionElementos();
    
    if (edtSeleccionadaId) {
        abrirModalEDT(edtSeleccionadaId);
    }
    mostrarToast(' "' + nombre + '" eliminado', 'success');
}

function abrirNuevoElementoConPadre(padreId, tipoSugerido) {
    if (typeof abrirModalNuevoElementoGantt === 'function') {
        abrirModalNuevoElementoGantt();
        setTimeout(function() {
            var dependenciaSelect = document.getElementById('nuevoDependeDe');
            if (dependenciaSelect) dependenciaSelect.value = padreId;
            if (tipoSugerido) {
                var tipoSelect = document.getElementById('nuevoTipo');
                if (tipoSelect) tipoSelect.value = tipoSugerido;
            }
        }, 200);
    }
}

// Variables globales
window.edtSeleccionadaId = null;

// Fijar clics en las EDT del árbol WBS
function fijarClicEnEDT() {
    document.querySelectorAll('.wbs-item[data-type="edt"]:not([data-edt-fixed])').forEach(function(el) {
        el.setAttribute('data-edt-fixed', 'true');
        var id = parseInt(el.getAttribute('data-id'));
        el.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            abrirModalEDT(id);
        });
    });
}

// Sobrescribir renderizado del cronograma
if (typeof renderizarCronograma === 'function') {
    var origCrono = renderizarCronograma;
    renderizarCronograma = function() { origCrono(); fijarClicEnEDT(); };
}

setTimeout(fijarClicEnEDT, 1500);
console.log(" EDT panel integrado activado");
function actualizarTitulosPaneles() {
    // Acta
    const actaTitulo = document.getElementById('actaTitulo');
    if (actaTitulo) actaTitulo.innerHTML = tApp('acta_titulo');
    
    const btnEditarActa = document.getElementById('btnEditarActa');
    if (btnEditarActa) btnEditarActa.innerHTML = tApp('btn_editar');
    
    // Dashboard
    const dashboardTitulo = document.querySelector('#panelDashboard .panel-title span');
    if (dashboardTitulo) dashboardTitulo.innerHTML = tApp('dashboard_titulo');
    
    // Salud
    const saludTitulo = document.querySelector('#panelSalud .panel-title span');
    if (saludTitulo) saludTitulo.innerHTML = tApp('sidebar_salud');
}
// ============================================
