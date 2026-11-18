
function parseLocalDate(str) { if (!str) return null; const p = str.split('-'); return new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2])); }

function destruirChart(safeVar) {
  if (window[safeVar] && typeof window[safeVar].destroy === 'function') {
    try { window[safeVar].destroy(); } catch(e) {}
    window[safeVar] = null;
  }
}

// ============================================
// MODELO ÁGIL ÚNICO (proyecto.scrum)
// ============================================

/** Velocidad canónica: media de los sprints con puntos completados > 0. */
function calcularVelocidadEquipo(proyectoParam) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    const sprints = (p && p.scrum && p.scrum.sprints) || [];
    const conPuntos = sprints.filter(s => Number(s.puntosCompletados || s.velocity || 0) > 0);
    // Los sprints aún no cerrados no cuentan para la velocidad canónica;
    // los registros heredados sin estado se consideran consolidados.
    const excluidos = new Set(['activo', 'activa', 'en curso', 'en_curso', 'planificado', 'pendiente']);
    const validos = conPuntos.filter(s => !excluidos.has(String(s.estado || '').trim().toLowerCase()));
    if (!validos.length) return 0;
    const suma = validos.reduce((acc, s) => acc + Number(s.puntosCompletados || s.velocity || 0), 0);
    return Math.round(suma / validos.length);
}

/** Migra el modelo heredado metricasAgiles a proyecto.scrum y garantiza la estructura Daily. */
function normalizarDatosAgiles() {
    if (!proyecto) return;
    if (!proyecto.scrum) {
        proyecto.scrum = {
            sprints: [], sprintActivo: null, historias: [], retrospectivas: [],
            metricas: { leadTime: [], cycleTime: [], throughput: [], predictibilidad: [] }
        };
    }
    const s = proyecto.scrum;
    if (!Array.isArray(s.sprints)) s.sprints = [];
    if (!Array.isArray(s.daily)) s.daily = [];
    const legacy = proyecto.metricasAgiles;
    if (legacy && Array.isArray(legacy.sprints)) {
        legacy.sprints.forEach(l => {
            if (!s.sprints.some(x => Number(x.numero) === Number(l.numero))) {
                s.sprints.push({
                    numero: Number(l.numero),
                    nombre: `Sprint ${l.numero}`,
                    puntosCompletados: Number(l.puntosCompletados || 0),
                    velocity: Number(l.puntosCompletados || 0),
                    estado: 'completado',
                    fechaCompletado: l.fechaCompletado || null
                });
            }
        });
        delete proyecto.metricasAgiles;
    }
    proyecto.velocidadEquipo = calcularVelocidadEquipo(proyecto);
    return proyecto.scrum;
}

function inicializarMetricasAgiles() {
    normalizarDatosAgiles();
    if (typeof renderizarBurndown === 'function') renderizarBurndown();
}

/** Alias histórico: un único burndown alimentado por sprintActivo.registroDiario. */
function actualizarBurnDown() {
    if (typeof renderizarBurndown === 'function') renderizarBurndown();
}

function registrarVelocidadSprint() {
    const sprintNum = parseInt(document.getElementById('sprintActual')?.value) || 1;
    const puntos = prompt(` Velocidad del Sprint ${sprintNum} (puntos completados):`, "15");
    if (puntos === null || isNaN(parseFloat(puntos))) return;
    normalizarDatosAgiles();
    const sprints = proyecto.scrum.sprints;
    let sprint = sprints.find(s => Number(s.numero) === sprintNum);
    if (!sprint) {
        sprint = { numero: sprintNum, nombre: `Sprint ${sprintNum}`, estado: 'completado' };
        sprints.push(sprint);
    }
    sprint.puntosCompletados = parseFloat(puntos);
    sprint.velocity = parseFloat(puntos);
    sprint.fechaCompletado = new Date().toISOString();
    proyecto.velocidadEquipo = calcularVelocidadEquipo(proyecto);
    guardarProyecto();
    actualizarBurnDown();
    if (typeof actualizarPanelSalud === 'function') actualizarPanelSalud();
    mostrarToast(` Sprint ${sprintNum}: ${puntos} puntos. Velocidad media: ${proyecto.velocidadEquipo} pts/sprint`, 'success');
    const elSprintActual = document.getElementById('sprintActual');
    if (elSprintActual) elSprintActual.value = sprintNum + 1;
}

function exportarMetricasAgiles() {
    normalizarDatosAgiles();
    const sprints = proyecto.scrum.sprints;
    let csv = "Sprint,Puntos Completados,Fecha\n";
    sprints.forEach(s => {
        csv += `${s.numero},${s.puntosCompletados || 0},${(s.fechaCompletado || '').split('T')[0] || '-'}\n`;
    });
    csv += `\nVelocidad Promedio,${calcularVelocidadEquipo(proyecto)} pts/sprint\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `metricas_agiles_${proyecto.nombre}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Métricas ágiles exportadas", 'success');
}

// ============================================
// SCRUM ÁGIL - SISTEMA COMPLETO (CORREGIDO)
// ============================================



// ============================================
// INICIALIZACIÓN
// ============================================
function renderizarAgileMetrics() {
    console.log(" Renderizando Agile Metrics...");

    // Verificar si existe el contenedor
    const tbody = document.getElementById('agileMetricsBody');
    if (!tbody) return;

    // Verificar datos Scrum
    if (!proyecto.scrum || !proyecto.scrum.sprints || proyecto.scrum.sprints.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="u-text-center">No hay sprints completados. Finaliza al menos un sprint para ver métricas.</td></tr>';
        return;
    }

    const sprints = proyecto.scrum.sprints.filter(s => s.estado === 'completado');
    if (sprints.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="u-text-center">Completa al menos un sprint para ver las métricas.</td></tr>';
        return;
    }

    // Variables para estadísticas
    let totalLeadTime = 0;
    let totalCycleTime = 0;
    let totalThroughput = 0;
    let totalPredictibilidad = 0;
    let sprintCount = 0;

    let html = '';

    sprints.forEach(sprint => {
        const historiasSprint = (proyecto.scrum.historias || []).filter(h => h.sprintId === sprint.id);
        const historiasCount = historiasSprint.length;
        const puntos = sprint.puntosCompletados || 0;

        // Calcular Lead Time (días desde inicio hasta fin del sprint)
        let leadTime = '-';
        if (sprint.fechaFinReal && sprint.fechaInicio) {
            const inicio = parseLocalDate(sprint.fechaInicio);
            const fin = parseLocalDate(sprint.fechaFinReal);
            leadTime = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
            totalLeadTime += leadTime;
        } else if (sprint.fechaFin && sprint.fechaInicio) {
            const inicio = parseLocalDate(sprint.fechaInicio);
            const fin = parseLocalDate(sprint.fechaFin);
            leadTime = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
            totalLeadTime += leadTime;
        }

        // Cycle Time (similar a Lead Time para sprints)
        let cycleTime = leadTime;
        if (cycleTime !== '-') totalCycleTime += cycleTime;

        // Throughput (historias completadas)
        const throughput = historiasSprint.filter(h => h.estado === 'done').length;
        totalThroughput += throughput;

        // Predictibilidad
        let predictibilidad = 0;
        if (sprint.puntosPlanificados && sprint.puntosPlanificados > 0) {
            predictibilidad = ((sprint.puntosCompletados || 0) / sprint.puntosPlanificados) * 100;
            totalPredictibilidad += predictibilidad;
            sprintCount++;
        }

        html += `<tr>
            <td>${escapeHtml(sprint.nombre)}</td>
            <td>${historiasCount}</td>
            <td>${puntos}</td>
            <td>${leadTime}</td>
            <td>${cycleTime}</td>
            <td>${throughput}</td>
            <td>${predictibilidad > 0 ? predictibilidad.toFixed(0) + '%' : '-'}</td>
        </tr>`;
    });

    tbody.innerHTML = html;

    // Actualizar tarjetas de resumen
    if (sprintCount > 0) {
        const avgLeadTime = Math.round(totalLeadTime / sprintCount);
        const avgCycleTime = Math.round(totalCycleTime / sprintCount);
        const avgThroughput = (totalThroughput / sprintCount).toFixed(1);
        const avgPredictibilidad = Math.round(totalPredictibilidad / sprintCount);

        const leadTimeElem = document.getElementById('leadTime');
        if (leadTimeElem) leadTimeElem.innerHTML = avgLeadTime;

        const cycleTimeElem = document.getElementById('cycleTime');
        if (cycleTimeElem) cycleTimeElem.innerHTML = avgCycleTime;

        const throughputElem = document.getElementById('throughput');
        if (throughputElem) throughputElem.innerHTML = avgThroughput;

        const predictibilidadElem = document.getElementById('predictibilidad');
        if (predictibilidadElem) predictibilidadElem.innerHTML = avgPredictibilidad + '%';
    }

    // Dibujar Cumulative Flow Diagram
    dibujarCumulativeFlowChart(sprints);
}

function dibujarCumulativeFlowChart(sprints) {
    const canvas = document.getElementById('cumulativeFlowChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destruir gráfico anterior
    destruirChart("cumulativeFlowInstance");

    const historias = proyecto.scrum.historias || [];

    // Agrupar sprints por orden cronológico
    const sprintsOrdenados = [...sprints].sort((a, b) =>
        parseLocalDate(a.fechaInicio) - parseLocalDate(b.fechaInicio)
    );

    const labels = sprintsOrdenados.map(s => s.nombre);

    // Para cada sprint, contar historias en cada estado
    const todoData = sprintsOrdenados.map(s => {
        return historias.filter(h => h.sprintId === s.id && h.estado === 'todo').length;
    });
    const progressData = sprintsOrdenados.map(s => {
        return historias.filter(h => h.sprintId === s.id && h.estado === 'progress').length;
    });
    const doneData = sprintsOrdenados.map(s => {
        return historias.filter(h => h.sprintId === s.id && h.estado === 'done').length;
    });

    // Acumular para flujo acumulativo
    let accTodo = 0, accProgress = 0, accDone = 0;
    const cumTodo = todoData.map(v => accTodo += v);
    const cumProgress = progressData.map(v => accProgress += v);
    const cumDone = doneData.map(v => accDone += v);

    window.cumulativeFlowInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: tApp('chart_todo'),
                    data: cumTodo,
                    backgroundColor: 'rgba(255,59,48,0.15)',
                    borderColor: '#FF3B30',
                    fill: 'start',
                    tension: 0.3,
                    pointRadius: 3
                },
                {
                    label: tApp('chart_in_progress'),
                    data: cumProgress,
                    backgroundColor: 'rgba(255,140,0,0.15)',
                    borderColor: '#FF8C00',
                    fill: 'start',
                    tension: 0.3,
                    pointRadius: 3
                },
                {
                    label: tApp('chart_done'),
                    data: cumDone,
                    backgroundColor: 'rgba(0,168,89,0.15)',
                    borderColor: '#00A859',
                    fill: 'start',
                    tension: 0.3,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.raw} ` + tApp('chart_historias')
                    }
                },
                legend: {
                    position: 'top',
                    labels: { color: '#888', boxWidth: 12, padding: 12 }
                }
            },
            scales: {
                y: {
                    title: { display: true, text: tApp('chart_historias_acumuladas'), color: '#888' },
                    beginAtZero: true,
                    ticks: { color: '#888' }
                },
                x: {
                    ticks: { color: '#888' }
                }
            }
        }
    });
}

function inicializarScrum() {
    normalizarDatosAgiles();

    // Asegurar que cada sprint tiene estructura de costes (PMBOK 8)
    proyecto.scrum.sprints.forEach(sprint => {
        if (!sprint.costes) {
            sprint.costes = {
                planificado: 0,
                real: 0,
                materiales: [],
                servicios: [],
                equipo: 0,
                desviacion: 0
            };
        }
    });

    renderizarSprintBacklog();
    renderizarBurndown();
    renderizarDaily();
    renderizarVelocityTracking();
    renderizarRetrospectives();
    renderizarAgileMetrics();

    // Costes ágiles se calculan bajo demanda desde el panel de Control de Gastos

    sincronizarConPanelSalud();
}

function sincronizarConPanelSalud() {
    // Velocidad del equipo: una sola fórmula compartida con el panel de salud
    proyecto.velocidadEquipo = calcularVelocidadEquipo(proyecto);

    // Sincronizar defectos desde las retrospectivas
    const retrospectivas = proyecto.scrum.retrospectivas || [];
    const defectosReportados = retrospectivas.reduce((acc, r) => {
        return acc + (r.mejorar?.filter(m => m.toLowerCase().includes('error') || m.toLowerCase().includes('defecto') || m.toLowerCase().includes('bug')).length || 0);
    }, 0);

    if (defectosReportados > 0 && !proyecto.defectos) {
        proyecto.defectos = defectosReportados;
    }

    guardarProyecto();
    if (typeof actualizarPanelSalud === 'function') actualizarPanelSalud();
}

// ============================================
// SPRINT BACKLOG
// ============================================

function renderizarSprintBacklog() {
    const historias = proyecto.scrum.historias || [];
    const sprintActivo = proyecto.scrum.sprintActivo;

    // Verificar que los elementos del DOM existen
    if (document.getElementById('sprintNombre')) {
        if (sprintActivo) {
            const historiasSprint = historias.filter(h => h.sprintId === sprintActivo.id);
            const puntosPlanificados = historiasSprint.reduce((acc, h) => acc + (h.puntos || 0), 0);
            const puntosCompletados = historiasSprint.filter(h => h.estado === 'done').reduce((acc, h) => acc + (h.puntos || 0), 0);
            const progreso = puntosPlanificados > 0 ? (puntosCompletados / puntosPlanificados) * 100 : 0;

            document.getElementById('sprintNombre').innerHTML = ` ${escapeHtml(sprintActivo.nombre || 'Sprint Actual')}`;
            document.getElementById('sprintDetalles').innerHTML = `${formatearFechaEspa(sprintActivo.fechaInicio)} → ${formatearFechaEspa(sprintActivo.fechaFin)}`;
            document.getElementById('sprintPuntosPlanificados').innerHTML = puntosPlanificados;
            document.getElementById('sprintPuntosCompletados').innerHTML = puntosCompletados;
            document.getElementById('sprintProgreso').innerHTML = progreso.toFixed(1);
            document.getElementById('sprintProgresoBarra').style.width = `${progreso}%`;
        } else {
            document.getElementById('sprintNombre').innerHTML = ' Sprint Actual: No iniciado';
            document.getElementById('sprintDetalles').innerHTML = 'Inicia un sprint para comenzar a trabajar';
            document.getElementById('sprintPuntosPlanificados').innerHTML = '0';
            document.getElementById('sprintPuntosCompletados').innerHTML = '0';
            document.getElementById('sprintProgreso').innerHTML = '0';
            document.getElementById('sprintProgresoBarra').style.width = '0%';
        }
    }

    // Filtrar historias por estado
    const todoHistorias = historias.filter(h => h.estado === 'todo' && (!sprintActivo || h.sprintId === sprintActivo.id));
    const progressHistorias = historias.filter(h => h.estado === 'progress' && (!sprintActivo || h.sprintId === sprintActivo.id));
    const doneHistorias = historias.filter(h => h.estado === 'done' && (!sprintActivo || h.sprintId === sprintActivo.id));

    if (document.getElementById('todoCount')) document.getElementById('todoCount').innerHTML = todoHistorias.length;
    if (document.getElementById('progressCount')) document.getElementById('progressCount').innerHTML = progressHistorias.length;
    if (document.getElementById('doneCount')) document.getElementById('doneCount').innerHTML = doneHistorias.length;

    // Renderizar TO DO con eventos drag & drop y click para avanzar
    const todoContainer = document.getElementById('todoList');
    if (todoContainer) {
        todoContainer.innerHTML = todoHistorias.map(h => `
            <div class="item-card agenda-lista-item" style="border-left-color: #FF3B30; cursor: grab;"
                 draggable="true"
                 ondragstart="dragStart(event, ${h.id})"
                 ondragend="dragEnd(event)"
                 onclick="avanzarHistoria(${h.id})"
                 title="Click para mover a En Progreso"
                 data-id="${h.id}">
                <div class="agenda-lista-acciones-left">
                    <button class="btn btn-ghost btn-xs" onclick="event.stopPropagation(); editarHistoria(${h.id})" title="Editar historia" aria-label="Editar historia"><i data-feather="edit-2"></i></button>
                    <button class="btn btn-danger btn-xs" onclick="event.stopPropagation(); eliminarHistoria(${h.id})" title="Eliminar historia" aria-label="Eliminar historia"><i data-feather="trash-2"></i></button>
                </div>
                <div class="agenda-lista-content">
                    <div class="agenda-lista-titulo-row">
                        <span class="agenda-lista-cat" style="background: ${h.prioridad === 'Alta' ? '#FF3B30' : (h.prioridad === 'Media' ? '#FF8C00' : '#00A859')}">${h.prioridad}</span>
                        <strong class="agenda-lista-titulo">[${h.puntos} pts] ${escapeHtml(h.titulo)}</strong>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span class="badge-pendiente">Pendiente</span>
                        <span style="font-size: 11px; color: var(--text-muted);">${formatearFechaEspa(h.fechaCreacion?.split('T')[0])}</span>
                    </div>
                </div>
            </div>
        `).join('');

        todoContainer.ondragover = dragOver;
        todoContainer.ondragleave = dragLeave;
        todoContainer.ondrop = (e) => drop(e, 'progress');
    }

    // Renderizar IN PROGRESS
    const progressContainer = document.getElementById('progressList');
    if (progressContainer) {
        progressContainer.innerHTML = progressHistorias.map(h => `
            <div class="item-card agenda-lista-item" style="border-left-color: #FF8C00; cursor: grab;"
                 draggable="true"
                 ondragstart="dragStart(event, ${h.id})"
                 ondragend="dragEnd(event)"
                 onclick="avanzarHistoria(${h.id})"
                 title="Click para mover a Completado"
                 data-id="${h.id}">
                <div class="agenda-lista-acciones-left">
                    <button class="btn btn-ghost btn-xs" onclick="event.stopPropagation(); editarHistoria(${h.id})" title="Editar historia" aria-label="Editar historia"><i data-feather="edit-2"></i></button>
                    <button class="btn btn-danger btn-xs" onclick="event.stopPropagation(); eliminarHistoria(${h.id})" title="Eliminar historia" aria-label="Eliminar historia"><i data-feather="trash-2"></i></button>
                </div>
                <div class="agenda-lista-content">
                    <div class="agenda-lista-titulo-row">
                        <span class="agenda-lista-cat" style="background: ${h.prioridad === 'Alta' ? '#FF3B30' : (h.prioridad === 'Media' ? '#FF8C00' : '#00A859')}">${h.prioridad}</span>
                        <strong class="agenda-lista-titulo">[${h.puntos} pts] ${escapeHtml(h.titulo)}</strong>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span class="badge-progreso">En progreso</span>
                    </div>
                </div>
            </div>
        `).join('');

        progressContainer.ondragover = dragOver;
        progressContainer.ondragleave = dragLeave;
        progressContainer.ondrop = (e) => drop(e, 'done');
    }

    // Renderizar DONE (no draggable, click retrocede a progress)
    const doneContainer = document.getElementById('doneList');
    if (doneContainer) {
        doneContainer.innerHTML = doneHistorias.map(h => `
            <div class="item-card agenda-lista-item" style="border-left-color: #00A859;"
                 onclick="retrocederHistoria(${h.id})"
                 title="Click para reabrir"
                 data-id="${h.id}">
                <div class="agenda-lista-acciones-left">
                    <button class="btn btn-ghost btn-xs" onclick="event.stopPropagation(); editarHistoria(${h.id})" title="Editar historia" aria-label="Editar historia"><i data-feather="edit-2"></i></button>
                    <button class="btn btn-danger btn-xs" onclick="event.stopPropagation(); eliminarHistoria(${h.id})" title="Eliminar historia" aria-label="Eliminar historia"><i data-feather="trash-2"></i></button>
                </div>
                <div class="agenda-lista-content">
                    <div class="agenda-lista-titulo-row">
                        <span class="agenda-lista-cat" style="background: ${h.prioridad === 'Alta' ? '#FF3B30' : (h.prioridad === 'Media' ? '#FF8C00' : '#00A859')}">${h.prioridad}</span>
                        <strong class="agenda-lista-titulo">[${h.puntos} pts] ${escapeHtml(h.titulo)}</strong>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span class="badge-completado">Completado</span>
                    </div>
                </div>
            </div>
        `).join('');

        doneContainer.ondragover = null;
        doneContainer.ondrop = null;
    }

    // Reemplazar iconos feather (patrón de las vistas modernas)
    if (typeof feather !== 'undefined') feather.replace();
}

// Variables globales para drag & drop
let draggedItemId = null;

function dragStart(event, id) {
    draggedItemId = id;
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
    event.target.classList.add('dragging');
}

function dragEnd(event) {
    event.target.classList.remove('dragging');
    // Limpiar estilos de drag-over
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });
    draggedItemId = null;
}

function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    // Añadir clase visual al contenedor destino
    const targetContainer = event.currentTarget;
    if (!targetContainer.classList.contains('drag-over')) {
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
        targetContainer.classList.add('drag-over');
    }
}

function dragLeave(event) {
    const targetContainer = event.currentTarget;
    targetContainer.classList.remove('drag-over');
}

function drop(event, nuevoEstado) {
    event.preventDefault();

    const id = draggedItemId || parseInt(event.dataTransfer.getData("text/plain"));
    if (!id) return;

    const historia = proyecto.scrum.historias.find(h => h.id === id);
    if (historia && historia.estado !== nuevoEstado) {
        const estadoAnterior = historia.estado;
        historia.estado = nuevoEstado;

        if (nuevoEstado === 'done' && !historia.fechaCompletado) {
    historia.fechaCompletado = new Date().toISOString();
    const fechaInicio = historia.fechaInicio ? parseLocalDate(historia.fechaInicio) : new Date(historia.fechaCreacion);
    const cycleTime = Math.ceil((new Date() - fechaInicio) / (1000 * 60 * 60 * 24));
    historia.cycleTime = cycleTime;

    //  Calcular días reales
    if (historia.fechaInicio) {
        const inicio = parseLocalDate(historia.fechaInicio);
        const fin = new Date();
        historia.diasReales = Math.max(1, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)));
    }

    if (!proyecto.scrum.metricas.cycleTime) proyecto.scrum.metricas.cycleTime = [];
    proyecto.scrum.metricas.cycleTime.push(cycleTime);
}

        guardarProyecto();
        renderizarSprintBacklog();
        renderizarBurndown();
        renderizarAgileMetrics();
        sincronizarConPanelSalud();

        //  Recalcular costes del sprint
        if (proyecto.scrum.sprintActivo && typeof recalcularCostesSprint === 'function') {
            recalcularCostesSprint(proyecto.scrum.sprintActivo.id);
        }

        const estadoTexto = {
            'todo': 'Pendiente',
            'progress': 'En Progreso',
            'done': 'Completado'
        };
        mostrarToast(` Historia movida a ${estadoTexto[nuevoEstado]}`, 'success');
    }

    // Limpiar estilos
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });
    draggedItemId = null;
}

function avanzarHistoria(id) {
    const historia = proyecto.scrum.historias.find(h => h.id === id);
    if (!historia) return;
    const map = { 'todo': 'progress', 'progress': 'done' };
    const nuevoEstado = map[historia.estado];
    if (!nuevoEstado) return;
    historia.estado = nuevoEstado;
    if (nuevoEstado === 'done' && !historia.fechaCompletado) {
        historia.fechaCompletado = new Date().toISOString();
        const fechaInicio = historia.fechaInicio ? parseLocalDate(historia.fechaInicio) : new Date(historia.fechaCreacion);
        historia.cycleTime = Math.ceil((new Date() - fechaInicio) / (1000 * 60 * 60 * 24));
        if (historia.fechaInicio) {
            const inicio = parseLocalDate(historia.fechaInicio);
            historia.diasReales = Math.max(1, Math.ceil((new Date() - inicio) / (1000 * 60 * 60 * 24)));
        }
        if (!proyecto.scrum.metricas.cycleTime) proyecto.scrum.metricas.cycleTime = [];
        proyecto.scrum.metricas.cycleTime.push({ historiaId: id, cycleTime: historia.cycleTime, fecha: new Date().toISOString() });
        if (proyecto.scrum.sprintActivo && typeof recalcularCostesSprint === 'function') recalcularCostesSprint(proyecto.scrum.sprintActivo.id);
        actualizarAgileMetrics();
    }
    guardarProyecto();
    renderizarSprintBacklog();
    mostrarToast('Historia movida a ' + (nuevoEstado === 'progress' ? 'En Progreso' : 'Completado'), 'success');
}

function retrocederHistoria(id) {
    const historia = proyecto.scrum.historias.find(h => h.id === id);
    if (!historia) return;
    historia.estado = 'progress';
    guardarProyecto();
    renderizarSprintBacklog();
    mostrarToast('Historia reabierta a En Progreso', 'success');
}

function abrirModalHistoria() {
    // Generar opciones de recursos desde el equipo
    let recursoOptions = '<option value="">-- Sin asignar --</option>';
    if (proyecto.equipo && proyecto.equipo.length > 0) {
        proyecto.equipo.forEach(m => {
            recursoOptions += `<option value="${m.id}">${escapeHtml(m.nombre)} (${escapeHtml(m.rol || 'Sin rol')}) - ${m.costeHora} ${m.moneda}/hora</option>`;
        });
    } else {
        recursoOptions = '<option value="" disabled> No hay recursos en "Equipo" - Añádelos primero</option>';
    }

    const modalHtml = `
        <div class="modal-content modal-sm">
            <div class="modal-header">
                <h3> Nueva Historia de Usuario</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div class="form-group">
                <label>Título *</label>
                <input type="text" id="historiaTitulo" placeholder="Ej: Como usuario quiero...">
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <textarea rows="3" id="historiaDescripcion" placeholder="Criterios de aceptación..."></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Prioridad</label>
                    <select id="historiaPrioridad">
                        <option value="Crítica">Crítica</option>
                        <option value="Alta">Alta</option>
                        <option value="Media" selected>Media</option>
                        <option value="Baja">Baja</option>
                    </select>
                </div>
                <div class="form-group">
                    <label> Puntos de historia</label>
                    <select id="historiaPuntos">
                        <option value="1">1 punto (XS)</option>
                        <option value="2">2 puntos (S)</option>
                        <option value="3">3 puntos (M)</option>
                        <option value="5" selected>5 puntos (L)</option>
                        <option value="8">8 puntos (XL)</option>
                        <option value="13">13 puntos (XXL)</option>
                    </select>
                </div>
            </div>

            <!-- NUEVO: Asignación de recurso -->
            <div class="form-group">
                <label> Recurso asignado (desde Equipo)</label>
                <select id="historiaRecursoId">
                    ${recursoOptions}
                </select>
                <small class="u-fs-11 u-color-muted"> El coste de la historia se calculará según el recurso y los días estimados.</small>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label> Días estimados</label>
                    <input type="number" id="historiaDiasEstimados" value="5" min="1" step="0.5">
                    <small>Días de trabajo estimados para esta historia</small>
                </div>
                <div class="form-group">
                    <label> Horas por día</label>
                    <input type="number" id="historiaHorasDia" value="8" min="1" max="12">
                    <small>Horas que trabajará al día</small>
                </div>
            </div>

            <div class="form-group">
                <label> Etiquetas</label>
                <input type="text" id="historiaEtiquetas" placeholder="frontend, backend, bug, feature...">
            </div>

            <div class="info-card-modal u-mt-12 u-p-10">
                <small> <strong>Cálculo automático de coste:</strong><br>
                Coste estimado = Días estimados × Horas/día × Coste/hora del recurso</small>
            </div>

            <div class="u-flex-gap-12 u-mt-20" style="justify-content: flex-end;">
                <button class="btn btn-secondary btn-icon-only" onclick="cerrarModalGeneric()" title="Cancelar" aria-label="Cancelar"><i data-feather="x"></i></button>
                <button class="btn btn-primary btn-icon-only" onclick="guardarHistoria()" title="Guardar Historia" aria-label="Guardar Historia"><i data-feather="save"></i></button>
            </div>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    if (typeof feather !== 'undefined') feather.replace();
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}

function guardarHistoria() {
    if (!proyecto) {
        mostrarToast(" Proyecto no cargado", 'error');
        return;
    }

    if (!proyecto.scrum) {
        proyecto.scrum = {
            sprints: [],
            sprintActivo: null,
            historias: [],
            retrospectivas: [],
            metricas: {
                leadTime: [],
                cycleTime: [],
                throughput: [],
                predictibilidad: []
            }
        };
    }

    if (!proyecto.scrum.historias) {
        proyecto.scrum.historias = [];
    }

    let titulo = document.getElementById('historiaTitulo').value.trim();
    if (!titulo) {
        mostrarToast(tApp('toast_titulo_obligatorio_gen'), 'error');
        return;
    }

    const sprintActivo = proyecto.scrum.sprintActivo || null;

    // Obtener valores
    let puntos = parseInt(document.getElementById('historiaPuntos').value) || 5;
    let prioridad = document.getElementById('historiaPrioridad').value;
    let etiquetas = document.getElementById('historiaEtiquetas')?.value || '';
    let descripcion = document.getElementById('historiaDescripcion')?.value || '';

    // Obtener recurso asignado y calcular coste
    let recursoId = document.getElementById('historiaRecursoId')?.value;
    let recursoInfo = null;
    let diasEstimados = parseFloat(document.getElementById('historiaDiasEstimados')?.value) || 5;
    let horasPorDia = parseFloat(document.getElementById('historiaHorasDia')?.value) || 8;
    let costeEstimado = 0;

    if (recursoId && proyecto.equipo) {
        const recurso = proyecto.equipo.find(r => r.id == recursoId);
        if (recurso) {
            const horasTotales = diasEstimados * horasPorDia;
            costeEstimado = horasTotales * recurso.costeHora;
            recursoInfo = {
                id: recurso.id,
                nombre: recurso.nombre,
                rol: recurso.rol,
                costeHora: recurso.costeHora,
                moneda: recurso.moneda,
                horasPorDia: horasPorDia
            };
        }
    }

    const nuevaHistoria = {
        id: Date.now(),
        titulo: titulo,
        descripcion: descripcion,
        prioridad: prioridad,
        puntos: puntos,
        etiquetas: etiquetas,
        estado: 'todo',
        sprintId: sprintActivo ? sprintActivo.id : null,
        fechaCreacion: new Date().toISOString(),
        //  NUEVOS CAMPOS PARA COSTES
        recursoAsignado: recursoInfo,
        diasEstimados: diasEstimados,
        horasPorDia: horasPorDia,
        costeEstimado: costeEstimado,
        costeReal: 0,
        diasReales: null
    };

    proyecto.scrum.historias.push(nuevaHistoria);

    guardarProyecto();
    renderizarSprintBacklog();

    //  Actualizar costes del sprint si hay sprint activo
    if (sprintActivo && typeof recalcularCostesSprint === 'function') {
        recalcularCostesSprint(sprintActivo.id);
    }

    const modal = document.getElementById('genericModal');
    if (modal) modal.remove();

    mostrarToast(` Historia "${titulo}" creada (${puntos} pts) - Coste estimado: ${formatearMoneda(costeEstimado)}`, 'success');
}
function recalcularCostesSprint(sprintId) {
    const sprint = proyecto.scrum.sprints?.find(s => s.id === sprintId);
    if (!sprint) return;

    const historiasSprint = (proyecto.scrum.historias || []).filter(h => h.sprintId === sprintId);

    // Calcular coste PLANIFICADO
    let costePlanificadoTotal = 0;
    let puntosPlanificados = 0;

    historiasSprint.forEach(historia => {
        puntosPlanificados += historia.puntos || 0;
        costePlanificadoTotal += historia.costeEstimado || 0;
    });

    // Calcular coste REAL - SIN FACTOR DE INTENSIDAD
    let costeRealTotal = 0;
    let puntosCompletados = 0;

    historiasSprint.forEach(historia => {
        if (historia.estado === 'done') {
            puntosCompletados += historia.puntos || 0;

            if (historia.recursoAsignado) {
                //  CORRECTO: Usar días REALES, no aplicar factor de intensidad
                const diasReales = historia.diasReales || historia.diasEstimados || 5;
                const horasPorDia = historia.horasPorDia || 8;

                // Horas totales = días reales × horas por día
                const horasTotales = diasReales * horasPorDia;
                const costeRealHistoria = horasTotales * historia.recursoAsignado.costeHora;

                costeRealTotal += costeRealHistoria;

                console.log(` Historia "${historia.titulo}":`);
                console.log(`   Días estimados: ${historia.diasEstimados}`);
                console.log(`   Días reales: ${diasReales}`);
                console.log(`   Horas totales: ${horasTotales}h`);
                console.log(`   Coste estimado: ${formatearMoneda(historia.costeEstimado)}`);
                console.log(`   Coste real: ${formatearMoneda(costeRealHistoria)}`);
            } else {
                costeRealTotal += historia.costeEstimado || 0;
            }
        }
    });

    //  Calcular desviación (puede ser negativa = ahorro, positiva = sobrecoste)
    const desviacion = costePlanificadoTotal > 0 ?
        ((costeRealTotal - costePlanificadoTotal) / costePlanificadoTotal) * 100 : 0;

    // Guardar en el sprint
    if (!sprint.costes) sprint.costes = {};
    sprint.costes.planificado = costePlanificadoTotal;
    sprint.costes.real = costeRealTotal;
    sprint.costes.puntosPlanificados = puntosPlanificados;
    sprint.costes.puntosCompletados = puntosCompletados;
    sprint.costes.desviacion = desviacion;
    sprint.costes.fechaCalculo = new Date().toISOString();

    guardarProyecto();

    // Actualizar UI
    if (typeof calcularCostesPorSprint === 'function') {
        calcularCostesPorSprint();
    }

    // Mostrar alerta según desviación
    if (desviacion > 15) {
        mostrarToast(` Sprint "${sprint.nombre}" tiene SOBRECOSTE del ${desviacion.toFixed(1)}%`, 'warning');
    } else if (desviacion < -10) {
        mostrarToast(` Sprint "${sprint.nombre}" tiene AHORRO del ${Math.abs(desviacion).toFixed(1)}%`, 'success');
    }

    return { costePlanificadoTotal, costeRealTotal, desviacion };
}

function editarHistoria(id) {
    const historia = proyecto.scrum.historias.find(h => h.id === id);
    if (!historia) return;

    // Generar opciones de recursos
    let recursoOptions = '<option value="">-- Sin asignar --</option>';
    if (proyecto.equipo && proyecto.equipo.length > 0) {
        proyecto.equipo.forEach(m => {
            recursoOptions += `<option value="${m.id}" ${historia.recursoAsignado?.id === m.id ? 'selected' : ''}>${escapeHtml(m.nombre)} (${escapeHtml(m.rol || 'Sin rol')}) - ${m.costeHora} ${m.moneda}/hora</option>`;
        });
    }

    const modalHtml = `
        <div class="modal-content modal-sm">
            <div class="modal-header">
                <h3> Editar Historia</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="editHistoriaId" value="${id}">
            <div class="form-group">
                <label>Título</label>
                <input type="text" id="editHistoriaTitulo" value="${escapeHtml(historia.titulo)}">
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <textarea rows="3" id="editHistoriaDescripcion">${escapeHtml(historia.descripcion || '')}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Prioridad</label>
                    <select id="editHistoriaPrioridad">
                        <option value="Crítica" ${historia.prioridad === 'Crítica' ? 'selected' : ''}>Crítica</option>
                        <option value="Alta" ${historia.prioridad === 'Alta' ? 'selected' : ''}>Alta</option>
                        <option value="Media" ${historia.prioridad === 'Media' ? 'selected' : ''}>Media</option>
                        <option value="Baja" ${historia.prioridad === 'Baja' ? 'selected' : ''}>Baja</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Puntos</label>
                    <select id="editHistoriaPuntos">
                        <option value="1" ${historia.puntos === 1 ? 'selected' : ''}>1 punto</option>
                        <option value="2" ${historia.puntos === 2 ? 'selected' : ''}>2 puntos</option>
                        <option value="3" ${historia.puntos === 3 ? 'selected' : ''}>3 puntos</option>
                        <option value="5" ${historia.puntos === 5 ? 'selected' : ''}>5 puntos</option>
                        <option value="8" ${historia.puntos === 8 ? 'selected' : ''}>8 puntos</option>
                        <option value="13" ${historia.puntos === 13 ? 'selected' : ''}>13 puntos</option>
                    </select>
                </div>
            </div>

            <!-- NUEVO: Editar recurso asignado -->
            <div class="form-group">
                <label> Recurso asignado</label>
                <select id="editHistoriaRecursoId">
                    ${recursoOptions}
                </select>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label> Días estimados</label>
                    <input type="number" id="editHistoriaDiasEstimados" value="${historia.diasEstimados || 5}" step="0.5">
                </div>
                <div class="form-group">
                    <label> Horas por día</label>
                    <input type="number" id="editHistoriaHorasDia" value="${historia.horasPorDia || 8}">
                </div>
            </div>

            <div class="form-group">
                <label> Días reales (opcional)</label>
                <input type="number" id="editHistoriaDiasReales" value="${historia.diasReales || ''}" step="0.5" placeholder="Dejar vacío si no está completada">
                <small>Si la historia está completada, introduce los días reales trabajados</small>
            </div>

            <div class="form-group">
                <label>Estado</label>
                <select id="editHistoriaEstado">
                    <option value="todo" ${historia.estado === 'todo' ? 'selected' : ''}> TO DO</option>
                    <option value="progress" ${historia.estado === 'progress' ? 'selected' : ''}> IN PROGRESS</option>
                    <option value="done" ${historia.estado === 'done' ? 'selected' : ''}> DONE</option>
                </select>
            </div>

            <div class="info-card-modal u-mt-12 u-p-10">
                <small> <strong>Coste actual:</strong><br>
                Estimado: ${formatearMoneda(historia.costeEstimado || 0)}<br>
                ${historia.costeReal > 0 ? `Real: ${formatearMoneda(historia.costeReal)}` : ''}
                </small>
            </div>

                <button class="btn btn-primary btn-icon-only" onclick="actualizarHistoria()" title="Actualizar Historia" aria-label="Actualizar Historia"><i data-feather="save"></i></button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    if (typeof feather !== 'undefined') feather.replace();
}

function actualizarHistoria() {
    const id = parseInt(document.getElementById('editHistoriaId').value);
    const idx = proyecto.scrum.historias.findIndex(h => h.id === id);
    if (idx >= 0) {
        const estadoAnterior = proyecto.scrum.historias[idx].estado;
        const nuevoEstado = document.getElementById('editHistoriaEstado').value;

        // Obtener nuevo recurso y recalcular coste
        const recursoId = document.getElementById('editHistoriaRecursoId')?.value;
        const diasEstimados = parseFloat(document.getElementById('editHistoriaDiasEstimados').value) || 5;
        const horasPorDia = parseFloat(document.getElementById('editHistoriaHorasDia').value) || 8;
        const diasReales = document.getElementById('editHistoriaDiasReales').value ?
            parseFloat(document.getElementById('editHistoriaDiasReales').value) : null;

        let recursoInfo = proyecto.scrum.historias[idx].recursoAsignado;
        let costeEstimado = proyecto.scrum.historias[idx].costeEstimado || 0;

        if (recursoId && proyecto.equipo) {
            const recurso = proyecto.equipo.find(r => r.id == recursoId);
            if (recurso) {
                const horasTotales = diasEstimados * horasPorDia;
                costeEstimado = horasTotales * recurso.costeHora;
                recursoInfo = {
                    id: recurso.id,
                    nombre: recurso.nombre,
                    rol: recurso.rol,
                    costeHora: recurso.costeHora,
                    moneda: recurso.moneda,
                    horasPorDia: horasPorDia
                };
            }
        }

        // Calcular coste real si hay días reales
        let costeReal = 0;
        if (diasReales && diasReales > 0 && recursoInfo) {
            const horasTotalesReales = diasReales * horasPorDia;
            costeReal = horasTotalesReales * recursoInfo.costeHora;
        }

        proyecto.scrum.historias[idx] = {
            ...proyecto.scrum.historias[idx],
            titulo: document.getElementById('editHistoriaTitulo').value,
            descripcion: document.getElementById('editHistoriaDescripcion').value,
            prioridad: document.getElementById('editHistoriaPrioridad').value,
            puntos: parseInt(document.getElementById('editHistoriaPuntos').value),
            estado: nuevoEstado,
            recursoAsignado: recursoInfo,
            diasEstimados: diasEstimados,
            horasPorDia: horasPorDia,
            diasReales: diasReales,
            costeEstimado: costeEstimado,
            costeReal: costeReal
        };

        if (nuevoEstado === 'done' && estadoAnterior !== 'done') {
            if (!proyecto.scrum.historias[idx].fechaCompletado) {
                proyecto.scrum.historias[idx].fechaCompletado = new Date().toISOString();
            }
            if (!diasReales && proyecto.scrum.historias[idx].fechaInicio && proyecto.scrum.historias[idx].fechaCompletado) {
                const inicio = parseLocalDate(proyecto.scrum.historias[idx].fechaInicio);
                const fin = new Date(proyecto.scrum.historias[idx].fechaCompletado);
                const diasCalc = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
                proyecto.scrum.historias[idx].diasReales = diasCalc;
            }
        }

        guardarProyecto();
        renderizarSprintBacklog();
        renderizarBurndown();
        renderizarAgileMetrics();
        sincronizarConPanelSalud();

        //  Recalcular costes del sprint
        if (proyecto.scrum.sprintActivo && typeof recalcularCostesSprint === 'function') {
            recalcularCostesSprint(proyecto.scrum.sprintActivo.id);
        }

        cerrarModalGeneric();
        mostrarToast(tApp('toast_historia_actualizada'), 'success');
    }
}

function eliminarHistoria(id) {
    if (confirm(tApp('confirmar_eliminar_historia'))) {
        proyecto.scrum.historias = proyecto.scrum.historias.filter(h => h.id !== id);
        guardarProyecto();
        renderizarSprintBacklog();
        renderizarBurndown();
        mostrarToast(tApp('toast_historia_eliminada'), 'success');
    }
}

function ordenarHistorias(criterio) {
    const historias = proyecto.scrum.historias;
    if (criterio === 'prioridad') {
        const orden = { 'Crítica': 0, 'Alta': 1, 'Media': 2, 'Baja': 3 };
        proyecto.scrum.historias.sort((a, b) => (orden[a.prioridad] || 4) - (orden[b.prioridad] || 4));
    } else if (criterio === 'puntos') {
        proyecto.scrum.historias.sort((a, b) => b.puntos - a.puntos);
    }
    guardarProyecto();
    renderizarSprintBacklog();
    mostrarToast(` Ordenado por ${criterio}`, 'success');
}

function iniciarSprint() {
    if (proyecto.scrum.sprintActivo) {
        mostrarToast(tApp('toast_sprint_activo'), 'warning');
        return;
    }

    const historiasPendientes = proyecto.scrum.historias.filter(h => h.estado === 'todo' && !h.sprintId);
    if (historiasPendientes.length === 0) {
        mostrarToast(" No hay historias pendientes para iniciar un sprint", 'error');
        return;
    }

    const puntosTotales = historiasPendientes.reduce((acc, h) => acc + (h.puntos || 0), 0);
    const velocidadPromedio = calcularVelocidadHistorica();

    let sugerencia = "";
    if (velocidadPromedio > 0) {
        const puntosSugeridos = Math.min(puntosTotales, velocidadPromedio * 1.2);
        sugerencia = `<div class="info-card-modal u-mb-12">
            <p> Basado en tu velocidad histórica (${velocidadPromedio} pts/sprint), se recomienda planificar alrededor de <strong>${Math.round(puntosSugeridos)} puntos</strong> para este sprint.</p>
        </div>`;
    }

    const modalHtml = `
        <div class="modal-content modal-600">
            <div class="modal-header">
                <h3> Iniciar Nuevo Sprint</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            ${sugerencia}
            <div class="form-group">
                <label>Nombre del Sprint</label>
                <input type="text" id="sprintNombreInput" value="Sprint ${(proyecto.scrum.sprints?.length || 0) + 1}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Fecha inicio</label>
                    <input type="date" id="sprintInicio" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label> Duración planificada (días)</label>
                    <input type="number" id="sprintDuracion" value="14" min="1" max="30">
                </div>
            </div>

            <div class="info-card-modal" style="margin-bottom: 12px; background: rgba(0,168,89,0.15);">
                <p> <strong>Presupuesto del sprint:</strong> Se calculará automáticamente al finalizar el sprint<br>
                basado en los recursos asignados a cada historia y los días reales trabajados.</p>
            </div>

            <div class="form-group">
                <label> Historias a incluir en este sprint</label>
                <div id="historiasSeleccion" class="u-scroll-200">
                    ${historiasPendientes.map(h => `
                        <div style="margin: 4px 0;">
                            <input type="checkbox" id="selHistoria_${h.id}" value="${h.id}" class="historia-checkbox">
                            <label for="selHistoria_${h.id}">
                                [${h.puntos} pts] ${escapeHtml(h.titulo)} - ${h.prioridad}
                                ${h.recursoAsignado ? ` ${h.recursoAsignado.nombre}` : ' Sin recurso'}
                                - Coste estimado: ${formatearMoneda(h.costeEstimado || 0)}
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="info-card-modal">
                <p> Puntos totales seleccionados: <span id="puntosSeleccionados">0</span></p>
                <p> Coste planificado estimado: <span id="costePlanificadoSeleccionado">0 €</span></p>
            </div>
            <button class="btn btn-primary btn-icon-only" onclick="confirmarInicioSprint()" title="Iniciar Sprint" aria-label="Iniciar Sprint"><i data-feather="play"></i></button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    if (typeof feather !== 'undefined') feather.replace();

    setTimeout(() => {
        document.querySelectorAll('.historia-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                let totalPuntos = 0;
                let totalCoste = 0;
                document.querySelectorAll('.historia-checkbox:checked').forEach(c => {
                    const id = parseInt(c.value);
                    const historia = proyecto.scrum.historias.find(h => h.id === id);
                    totalPuntos += historia?.puntos || 0;
                    totalCoste += historia?.costeEstimado || 0;
                });
                const puntosSpan = document.getElementById('puntosSeleccionados');
                if (puntosSpan) puntosSpan.innerHTML = totalPuntos;
                const costeSpan = document.getElementById('costePlanificadoSeleccionado');
                if (costeSpan) costeSpan.innerHTML = formatearMoneda(totalCoste);
            });
        });
    }, 100);
}

function confirmarInicioSprint() {
    const historiasSeleccionadas = [];
    document.querySelectorAll('.historia-checkbox:checked').forEach(cb => {
        historiasSeleccionadas.push(parseInt(cb.value));
    });

    if (historiasSeleccionadas.length === 0) {
        mostrarToast(" Selecciona al menos una historia para el sprint", 'error');
        return;
    }

    const nombre = document.getElementById('sprintNombreInput').value;
    const fechaInicio = document.getElementById('sprintInicio').value;
    const duracion = parseInt(document.getElementById('sprintDuracion').value);

    const fechaFin = parseLocalDate(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + duracion);

    // Calcular puntos y coste planificado
    let puntosPlanificados = 0;
    let costePlanificado = 0;

    historiasSeleccionadas.forEach(id => {
        const historia = proyecto.scrum.historias.find(h => h.id === id);
        if (historia) {
            historia.sprintId = null; // temporal, se asignará después
            puntosPlanificados += historia.puntos || 0;
            costePlanificado += historia.costeEstimado || 0;
        }
    });

    const nuevoSprint = {
        id: Date.now(),
        numero: (proyecto.scrum.sprints?.length || 0) + 1,
        nombre: nombre,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin.toISOString().split('T')[0],
        duracion: duracion,
        estado: 'activo',
        historiasIds: historiasSeleccionadas,
        puntosPlanificados: puntosPlanificados,
        puntosCompletados: 0,
        registroDiario: [],
        costes: {
            planificado: costePlanificado,  //  Calculado automáticamente
            real: 0,
            desviacion: 0,
            fechaCreacion: new Date().toISOString()
        }
    };

    // Asignar historias al sprint
    historiasSeleccionadas.forEach(id => {
        const historia = proyecto.scrum.historias.find(h => h.id === id);
        if (historia) {
            historia.sprintId = nuevoSprint.id;
            historia.estado = 'todo';
            historia.fechaInicio = fechaInicio;
        }
    });

    // Inicializar registro diario
    for (let i = 0; i <= duracion; i++) {
        const fechaRegistro = parseLocalDate(fechaInicio);
        fechaRegistro.setDate(fechaRegistro.getDate() + i);
        nuevoSprint.registroDiario.push({
            dia: i,
            puntosRestantes: puntosPlanificados,
            puntosCompletadosHoy: 0,
            fecha: fechaRegistro.toISOString().split('T')[0]
        });
    }

    if (!proyecto.scrum.sprints) proyecto.scrum.sprints = [];
    proyecto.scrum.sprints.push(nuevoSprint);
    proyecto.scrum.sprintActivo = nuevoSprint;

    guardarProyecto();
    renderizarSprintBacklog();
    renderizarBurndown();
    cerrarModalGeneric();

    mostrarToast(` Sprint "${nombre}" iniciado con ${historiasSeleccionadas.length} historias (${puntosPlanificados} pts) - Coste planificado: ${formatearMoneda(costePlanificado)}`, 'success');
}

function finalizarSprint() {
    const sprintActivo = proyecto.scrum.sprintActivo;
    if (!sprintActivo) {
        mostrarToast(tApp('toast_sprint_no_activo'), 'warning');
        return;
    }

    const historiasSprint = proyecto.scrum.historias.filter(h => h.sprintId === sprintActivo.id);
    const completadas = historiasSprint.filter(h => h.estado === 'done').length;
    const puntosCompletados = historiasSprint.filter(h => h.estado === 'done').reduce((acc, h) => acc + (h.puntos || 0), 0);
    const noCompletadas = historiasSprint.filter(h => h.estado !== 'done');

    // Calcular días reales del sprint
    const fechaFinReal = new Date().toISOString().split('T')[0];
    const inicio = parseLocalDate(sprintActivo.fechaInicio);
    const fin = parseLocalDate(fechaFinReal);
    const diasReales = Math.max(1, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)));
    const diasPlanificados = sprintActivo.duracion || 14;

    //  Calcular factor de intensidad
    const factorIntensidad = diasPlanificados / diasReales;

    //  Calcular coste REAL
    let costeRealTotal = 0;
    let horasExtrasTotal = 0;

    historiasSprint.forEach(historia => {
        if (historia.estado === 'done' && historia.recursoAsignado) {
            const diasEstimados = historia.diasEstimados || 5;
            const horasPorDiaNormal = historia.horasPorDia || 8;

            const horasNormales = diasEstimados * horasPorDiaNormal;
            const horasReales = horasNormales * factorIntensidad;
            const horasExtra = horasReales - horasNormales;

            horasExtrasTotal += horasExtra;
            costeRealTotal += horasReales * historia.recursoAsignado.costeHora;
        } else if (historia.estado === 'progress' && historia.recursoAsignado && historia.fechaInicio) {
            const inicioH = parseLocalDate(historia.fechaInicio);
            const hoy = new Date();
            let diasTranscurridos = Math.max(1, Math.ceil((hoy - inicioH) / (1000 * 60 * 60 * 24)));
            const progreso = Math.min(1, diasTranscurridos / (historia.diasEstimados || 1));
            const horasParciales = (historia.diasEstimados || 5) * progreso * (historia.horasPorDia || 8) * factorIntensidad;
            costeRealTotal += horasParciales * historia.recursoAsignado.costeHora;
        }
    });

    const costePlanificado = sprintActivo.costes?.planificado || 0;
    const desviacion = costePlanificado > 0 ?
        ((costeRealTotal - costePlanificado) / costePlanificado) * 100 : 0;

    // Determinar estado
    let desviacionEmoji = "";
    let desviacionColor = "";
    let estadoTexto = "";

    if (desviacion > 15) {
        desviacionEmoji = "";
        desviacionColor = "#FF3B30";
        estadoTexto = "SOBRECOSTE CRÍTICO";
    } else if (desviacion > 5) {
        desviacionEmoji = "";
        desviacionColor = "#FF8C00";
        estadoTexto = "SOBRECOSTE LEVE";
    } else if (desviacion < -10) {
        desviacionEmoji = "";
        desviacionColor = "#00A859";
        estadoTexto = "AHORRO SIGNIFICATIVO";
    } else {
        desviacionEmoji = "";
        desviacionColor = "#007AFF";
        estadoTexto = "DENTRO DEL PRESUPUESTO";
    }

    let mensaje = ` Resumen del Sprint:\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += ` Historias completadas: ${completadas}/${historiasSprint.length}\n`;
    mensaje += ` Puntos completados: ${puntosCompletados}/${sprintActivo.puntosPlanificados}\n`;
    mensaje += ` Velocidad: ${puntosCompletados} pts/sprint\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += ` Duración planificada: ${diasPlanificados} días\n`;
    mensaje += ` Duración real: ${diasReales} días\n`;
    mensaje += ` Factor intensidad: ${factorIntensidad.toFixed(2)}x `;

    if (factorIntensidad > 1) {
        mensaje += `(se trabajó ${((factorIntensidad - 1) * 100).toFixed(0)}% más intensamente)\n`;
    } else if (factorIntensidad < 1) {
        mensaje += `(se trabajó menos intensamente)\n`;
    } else {
        mensaje += `(ritmo normal)\n`;
    }

    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += ` Coste planificado: ${formatearMoneda(costePlanificado)}\n`;
    mensaje += ` Coste real: ${formatearMoneda(costeRealTotal)}\n`;

    if (horasExtrasTotal > 0) {
        mensaje += ` Horas extra: ${horasExtrasTotal.toFixed(0)}h\n`;
    }

    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `${desviacionEmoji} ${estadoTexto}: ${desviacion > 0 ? '+' : ''}${desviacion.toFixed(1)}%\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    if (desviacion > 15) {
        mensaje += `\n ¡ALERTA! El sprint se completó en ${diasReales} días (vs ${diasPlanificados} planificados).\n`;
        mensaje += `Esto requirió trabajar ${((factorIntensidad - 1) * 100).toFixed(0)}% más intensamente,\n`;
        mensaje += `resultando en ${horasExtrasTotal.toFixed(0)} horas extra y un sobrecoste.\n`;
    } else if (desviacion < -10) {
        mensaje += `\n ¡Excelente! Se completó con ahorro del ${Math.abs(desviacion).toFixed(0)}%.\n`;
    }

    if (noCompletadas.length > 0) {
        mensaje += `\n Historias no completadas (volverán al backlog):\n`;
        noCompletadas.forEach(h => {
            mensaje += `   - ${h.titulo} (${h.puntos} pts)\n`;
        });
    }

    if (confirm(mensaje + "\n\n¿Finalizar sprint?")) {
        // Mover historias no completadas al backlog
        noCompletadas.forEach(h => {
            h.sprintId = null;
            h.estado = 'todo';
            h.fechaInicio = null;
        });

        // Actualizar sprint
        sprintActivo.estado = 'completado';
        sprintActivo.fechaFinReal = fechaFinReal;
        sprintActivo.puntosCompletados = puntosCompletados;
        sprintActivo.velocidad = puntosCompletados;
        sprintActivo.diasReales = diasReales;
        sprintActivo.factorIntensidad = factorIntensidad;
        sprintActivo.costes.real = costeRealTotal;
        sprintActivo.costes.desviacion = desviacion;
        sprintActivo.costes.horasExtras = horasExtrasTotal;

        proyecto.scrum.sprintActivo = null;

        guardarProyecto();
        renderizarSprintBacklog();
        renderizarVelocityTracking();
        renderizarAgileMetrics();
        sincronizarConPanelSalud();

        // Actualizar costes en el panel
        if (typeof calcularCostesPorSprint === 'function') {
            calcularCostesPorSprint();
        }

        const mensajeFinal = desviacion > 15 ?
            ` Sprint finalizado con SOBRECOSTE del ${desviacion.toFixed(1)}%` :
            (desviacion < -10 ? ` Sprint finalizado con AHORRO del ${Math.abs(desviacion).toFixed(1)}%` :
            ` Sprint finalizado. Desviación: ${desviacion > 0 ? '+' : ''}${desviacion.toFixed(1)}%`);

        mostrarToast(mensajeFinal, desviacion > 15 ? 'error' : (desviacion < -10 ? 'success' : 'info'));
    }
}

// ============================================
// SPRINT BURNDOWN
// ============================================

function renderizarBurndown() {
    // Asegurar que proyecto.scrum existe
    if (!proyecto.scrum) {
        console.log(" proyecto.scrum no existe");
        return;
    }

    const sprintActivo = proyecto.scrum.sprintActivo;
    const burndownBody = document.getElementById('burndownBody');
    const burndownCanvas = document.getElementById('burndownChartCanvas');

    if (!sprintActivo || !sprintActivo.registroDiario) {
        if (burndownBody) {
            burndownBody.innerHTML = '<tr><td colspan="4" class="u-text-center">No hay sprint activo. Inicia un sprint para ver el burndown. </td></tr>';
        }
        if (burndownCanvas && window.burndownChartGlobal) {
            destruirChart("burndownChartGlobal");
            window.burndownChartGlobal = null;
        }
        return;
    }

    // Actualizar tabla de datos diarios
    if (burndownBody) {
        burndownBody.innerHTML = sprintActivo.registroDiario.map((r, idx) => `
            <tr>
                <td>Día ${r.dia} (${formatearFechaEspa(r.fecha)})</td>
                <td>${r.puntosRestantes || 0}</td>
                <td style="background: rgba(0,168,89,0.15);">
                    <input type="number" id="puntosDia_${idx}" value="${r.puntosCompletadosHoy || 0}" min="0" style="width: 80px; background: rgba(255,255,255,0.1); border-radius: 6px; color: ${document.documentElement.getAttribute('data-theme') === 'light' ? '#1a1a2e' : 'white'};">
                 </td>
                <td><button class="btn btn-secondary btn-small btn-icon-only" onclick="guardarAvanceDia(${idx})" title="Guardar avance" aria-label="Guardar avance del día"><i data-feather="save"></i></button></td>
            </tr>
        `).join('');
    }

    // Dibujar gráfico
    if (burndownCanvas) {
        const ctx = burndownCanvas.getContext('2d');
        if (!ctx) return;

        // Destruir gráfico anterior
        destruirChart("burndownChart");
        if (window.burndownChartGlobal) {
            destruirChart("burndownChartGlobal");
        }

        const dias = sprintActivo.registroDiario.map(r => `Día ${r.dia}`);
        const idealData = [];
        const puntosIniciales = sprintActivo.puntosPlanificados || 0;

        for (let i = 0; i <= sprintActivo.duracion; i++) {
            idealData.push(Math.max(0, puntosIniciales * (1 - i / sprintActivo.duracion)));
        }

        const realData = sprintActivo.registroDiario.map(r => r.puntosRestantes || puntosIniciales);

        window.burndownChartGlobal = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dias,
                datasets: [
                    {
                        label: tApp('chart_ideal'),
                        data: idealData.slice(0, realData.length),
                        borderColor: '#007AFF',
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0
                    },
                    {
                        label: tApp('chart_real'),
                        data: realData,
                        borderColor: '#FF3B30',
                        backgroundColor: 'rgba(255,59,48,0.1)',
                        fill: true,
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
                            label: (context) => `${context.dataset.label}: ${context.raw} ` + tApp('chart_puntos')
                        }
                    }
                },
                scales: {
                    y: {
                        title: { display: true, text: tApp('chart_puntos_restantes'), color: '#888' },
                        min: 0
                    },
                    x: {
                        title: { display: true, text: tApp('chart_dias_sprint'), color: '#888' }
                    }
                }
            }
        });
    }
}

function guardarAvanceDia(diaIndex) {
    const sprintActivo = proyecto.scrum.sprintActivo;
    if (!sprintActivo) return;

    const puntosCompletados = parseInt(document.getElementById(`puntosDia_${diaIndex}`).value) || 0;
    const registro = sprintActivo.registroDiario[diaIndex];

    registro.puntosCompletadosHoy = puntosCompletados;

    // Recalcular puntos restantes
    let puntosAcumulados = 0;
    for (let i = 0; i < sprintActivo.registroDiario.length; i++) {
        puntosAcumulados += sprintActivo.registroDiario[i].puntosCompletadosHoy || 0;
        sprintActivo.registroDiario[i].puntosRestantes = Math.max(0, sprintActivo.puntosPlanificados - puntosAcumulados);
    }

    guardarProyecto();
    renderizarBurndown();  // Refrescar el gráfico
    renderizarSprintBacklog();  // Actualizar progreso del sprint
    mostrarToast(" Avance diario registrado", 'success');
}

function registrarAvanceDiario() {
    const sprintActivo = proyecto.scrum.sprintActivo;
    if (!sprintActivo) {
        mostrarToast(tApp('toast_sprint_no_activo'), 'warning');
        return;
    }

    const hoy = new Date().toISOString().split('T')[0];
    const puntos = prompt(` Puntos completados hoy (${hoy}):`, "0");

    if (puntos !== null && !isNaN(parseFloat(puntos))) {
        const diaActual = sprintActivo.registroDiario.length - 1;
        const registro = sprintActivo.registroDiario[diaActual];
        registro.puntosCompletadosHoy = parseFloat(puntos);

        let puntosAcumulados = 0;
        for (let i = 0; i < sprintActivo.registroDiario.length; i++) {
            puntosAcumulados += sprintActivo.registroDiario[i].puntosCompletadosHoy || 0;
            sprintActivo.registroDiario[i].puntosRestantes = Math.max(0, sprintActivo.puntosPlanificados - puntosAcumulados);
        }

        guardarProyecto();
        renderizarBurndown();
        renderizarSprintBacklog();
        mostrarToast(` Registrado: ${puntos} puntos completados`, 'success');
    }
}

function actualizarBurndown() {
    renderizarBurndown();
}

function exportarBurndown() {
    const sprintActivo = proyecto.scrum.sprintActivo;
    if (!sprintActivo) {
        mostrarToast("No hay sprint activo", 'warning');
        return;
    }

    let csv = "Día,Fecha,Puntos Planificados Restantes,Puntos Completados Hoy,Puntos Restantes\n";
    sprintActivo.registroDiario.forEach(r => {
        const puntosIdeales = Math.max(0, sprintActivo.puntosPlanificados * (1 - r.dia / sprintActivo.duracion));
        csv += `${r.dia},${r.fecha || '-'},${puntosIdeales},${r.puntosCompletadosHoy || 0},${r.puntosRestantes || 0}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `burndown_${sprintActivo.nombre}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Burndown exportado", 'success');
}

// ============================================
// VELOCITY TRACKING
// ============================================

function renderizarVelocityTracking() {
    const sprintsCompletados = (proyecto.scrum.sprints || []).filter(s => s.estado === 'completado');

    let velocidadPromedio = calcularVelocidadEquipo(proyecto);
    let mejorSprint = 0;
    let mejorSprintNum = '';
    let peorSprint = Infinity;
    let peorSprintNum = '';

    sprintsCompletados.forEach(s => {
        const velocidad = s.puntosCompletados || 0;
        if (velocidad > mejorSprint) {
            mejorSprint = velocidad;
            mejorSprintNum = s.nombre;
        }
        if (velocidad < peorSprint) {
            peorSprint = velocidad;
            peorSprintNum = s.nombre;
        }
    });

    peorSprint = peorSprint === Infinity ? 0 : peorSprint;

    if (document.getElementById('velocidadPromedio')) document.getElementById('velocidadPromedio').innerHTML = Math.round(velocidadPromedio);
    if (document.getElementById('mejorSprint')) document.getElementById('mejorSprint').innerHTML = mejorSprint;
    if (document.getElementById('mejorSprintNum')) document.getElementById('mejorSprintNum').innerHTML = mejorSprintNum;
    if (document.getElementById('peorSprint')) document.getElementById('peorSprint').innerHTML = peorSprint;
    if (document.getElementById('peorSprintNum')) document.getElementById('peorSprintNum').innerHTML = peorSprintNum;

    const ultimos3 = sprintsCompletados.slice(-3);
    const prediccion = ultimos3.length > 0 ? ultimos3.reduce((acc, s) => acc + (s.puntosCompletados || 0), 0) / ultimos3.length : velocidadPromedio;
    if (document.getElementById('prediccionProximoSprint')) document.getElementById('prediccionProximoSprint').innerHTML = Math.round(prediccion);

    const velocityCanvas = document.getElementById('velocityChartCanvas');
    if (velocityCanvas && sprintsCompletados.length > 0) {
        const ctx = velocityCanvas.getContext('2d');
        destruirChart("velocityChart");

        const labels = sprintsCompletados.map(s => s.nombre);
        const data = sprintsCompletados.map(s => s.puntosCompletados || 0);
        const planificados = sprintsCompletados.map(s => s.puntosPlanificados || 0);

        window.velocityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: tApp('chart_puntos_planificados'), data: planificados, backgroundColor: 'rgba(0,122,255,0.5)', borderRadius: 6 },
                    { label: tApp('chart_puntos_completados'), data: data, backgroundColor: 'rgba(0,168,89,0.7)', borderRadius: 6 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
            plugins: { tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw} ` + tApp('chart_puntos') } } },
                scales: { y: { title: { display: true, text: tApp('chart_puntos_label'), color: document.documentElement.getAttribute('data-theme') === 'light' ? '#1a1a2e' : 'white' }, beginAtZero: true } }
            }
        });
    }

    const historyBody = document.getElementById('velocityHistoryBody');
    if (historyBody) {
        if (sprintsCompletados.length === 0) {
            historyBody.innerHTML = '<tr><td colspan="7" class="u-text-center">No hay sprints completados</td></tr>';
        } else {
            historyBody.innerHTML = sprintsCompletados.map(s => {
                const eficiencia = s.puntosPlanificados > 0 ? ((s.puntosCompletados / s.puntosPlanificados) * 100).toFixed(1) : 0;
                return `<tr>
                    <td>${escapeHtml(s.nombre)}</td>
                    <td>${formatearFechaEspa(s.fechaInicio)}</td>
                    <td>${formatearFechaEspa(s.fechaFinReal || s.fechaFin)}</td>
                    <td>${s.puntosPlanificados || 0}</td>
                    <td>${s.puntosCompletados || 0}</td>
                    <td class="${s.puntosCompletados >= s.puntosPlanificados ? 'cashflow-positive' : 'cashflow-negative'}">${s.puntosCompletados || 0}</td>
                    <td class="${eficiencia >= 80 ? 'cashflow-positive' : (eficiencia >= 60 ? '' : 'cashflow-negative')}">${eficiencia}%</td>
                </tr>`;
            }).join('');
        }
    }
}

function calcularVelocidadHistorica() {
    return calcularVelocidadEquipo(proyecto);
}

function calcularVelocidadPromedio() {
    renderizarVelocityTracking();
    mostrarToast(" Velocidad promedio calculada", 'success');
}

function exportarVelocity() {
    const sprints = proyecto.scrum.sprints || [];
    let csv = "Sprint,Fecha Inicio,Fecha Fin,Puntos Planificados,Puntos Completados,Velocidad,Eficiencia\n";
    sprints.filter(s => s.estado === 'completado').forEach(s => {
        const eficiencia = s.puntosPlanificados > 0 ? ((s.puntosCompletados / s.puntosPlanificados) * 100).toFixed(1) : 0;
        csv += `"${s.nombre}",${s.fechaInicio || '-'},${s.fechaFinReal || s.fechaFin || '-'},${s.puntosPlanificados || 0},${s.puntosCompletados || 0},${s.puntosCompletados || 0},${eficiencia}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `velocity_${proyecto.nombre}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Velocidad exportada", 'success');
}

// ============================================
// RETROSPECTIVES
// ============================================

function renderizarRetrospectives() {
    const retrospectivas = proyecto.scrum.retrospectivas || [];

    const totalBien = retrospectivas.reduce((acc, r) => acc + (r.bien?.length || 0), 0);
    const totalMejorar = retrospectivas.reduce((acc, r) => acc + (r.mejorar?.length || 0), 0);
    const totalAcciones = retrospectivas.reduce((acc, r) => acc + (r.acciones?.length || 0), 0);
    const totalAccionesCompletadas = retrospectivas.reduce((acc, r) => acc + (r.acciones?.filter(a => a.completada).length || 0), 0);

    if (document.getElementById('totalBien')) document.getElementById('totalBien').innerHTML = totalBien;
    if (document.getElementById('totalMejorar')) document.getElementById('totalMejorar').innerHTML = totalMejorar;
    if (document.getElementById('totalAcciones')) document.getElementById('totalAcciones').innerHTML = totalAcciones;
    if (document.getElementById('totalAccionesCompletadas')) document.getElementById('totalAccionesCompletadas').innerHTML = totalAccionesCompletadas;

    const container = document.getElementById('retrospectivesList');
    if (container) {
        if (retrospectivas.length === 0) {
            container.innerHTML = '<div class="info-card u-text-center">No hay retrospectivas registradas. Completa un sprint y añade una retrospectiva.</div>';
        } else {
            container.innerHTML = retrospectivas.map(r => `
                <div class="info-card">
                    <div class="u-flex-jc-sb">
                        <h4> ${escapeHtml(r.sprintNombre || 'Retrospectiva')}</h4>
                        <button class="btn btn-danger btn-xs" onclick="eliminarRetrospectiva(${r.id})" title="Eliminar retrospectiva" aria-label="Eliminar retrospectiva"><i data-feather="trash-2"></i></button>
                    </div>
                    <div class="details u-mt-8">
                        <div><strong> Fecha:</strong> ${formatearFechaEspa(r.fecha)}</div>
                        <div><strong> Asistentes:</strong> ${escapeHtml(r.asistentes?.join(', ') || '-')}</div>
                    </div>
                    <div class="u-mt-12">
                        <div><strong class="u-color-success"> Lo que salió bien:</strong></div>
                        <ul class="u-ml-20 u-fs-12">${(r.bien || []).map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
                    </div>
                    <div class="u-mt-8">
                        <div><strong style="color: #FF8C00;"> Cosas a mejorar:</strong></div>
                        <ul class="u-ml-20 u-fs-12">${(r.mejorar || []).map(m => `<li>${escapeHtml(m)}</li>`).join('')}</ul>
                    </div>
                    <div class="u-mt-8">
                        <div><strong class="u-color-primary"> Acciones comprometidas:</strong></div>
                        <ul class="u-ml-20 u-fs-12">
                            ${(r.acciones || []).map(a => `<li><input type="checkbox" ${a.completada ? 'checked' : ''} onchange="toggleAccionRetrospectiva(${r.id}, '${a.id}')"> ${escapeHtml(a.descripcion)} <span class="u-fs-10">(Responsable: ${escapeHtml(a.responsable)})</span></li>`).join('')}
                        </ul>
                    </div>
                    <div style="margin-top: 12px; font-size: 11px; color: rgba(255,255,255,0.4);"> Valoración del sprint: ${r.valoracion || '-'}/5</div>
                </div>
            `).join('');
            if (typeof feather !== 'undefined') feather.replace();
        }
    }
}

function abrirModalRetrospectiva() {
    const sprints = (proyecto.scrum.sprints || []).filter(s => s.estado === 'completado');
    const sprintsSinRetro = sprints.filter(s => !proyecto.scrum.retrospectivas?.some(r => r.sprintId === s.id));

    const modalHtml = `
        <div class="modal-content" style="max-width: 650px;">
            <div class="modal-header">
                <h3> Nueva Sprint Retrospective</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div class="form-group">
                <label>Sprint</label>
                <select id="retroSprintId">
                    <option value="">-- Seleccionar sprint --</option>
                    ${sprintsSinRetro.map(s => `<option value="${s.id}">${escapeHtml(s.nombre)} (${formatearFechaEspa(s.fechaInicio)} → ${formatearFechaEspa(s.fechaFin)})</option>`).join('')}
                    ${sprintsSinRetro.length === 0 ? '<option disabled>No hay sprints completados sin retrospectiva</option>' : ''}
                </select>
            </div>
            <div class="form-group">
                <label> Asistentes</label>
                <input type="text" id="retroAsistentes" placeholder="Nombres separados por coma">
            </div>
            <div class="form-group">
                <label> ¿Qué salió bien? (una por línea)</label>
                <textarea rows="3" id="retroBien" placeholder="Ej:\n- Cumplimos con el objetivo del sprint\n- Buena comunicación en el equipo"></textarea>
            </div>
            <div class="form-group">
                <label> ¿Qué podemos mejorar? (una por línea)</label>
                <textarea rows="3" id="retroMejorar" placeholder="Ej:\n- Las daily meetings son muy largas\n- Mejorar la gestión de dependencias"></textarea>
            </div>
            <div class="form-group">
                <label> Acciones concretas (una por línea con responsable)</label>
                <textarea rows="3" id="retroAcciones" placeholder="Ej:\n- Limitar daily a 15 minutos: Scrum Master\n- Crear documento de dependencias: Equipo"></textarea>
            </div>
            <div class="form-group">
                <label> Valoración del sprint (1-5)</label>
                <input type="range" id="retroValoracion" min="1" max="5" step="0.5" value="3.5" oninput="document.getElementById('valoracionPreview').innerText=this.value">
                <div class="u-text-center"><span id="valoracionPreview">3.5</span> / 5.0</div>
            </div>
                <button class="btn btn-primary btn-icon-only" onclick="guardarRetrospectiva()" title="Guardar Retrospectiva" aria-label="Guardar Retrospectiva"><i data-feather="save"></i></button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    if (typeof feather !== 'undefined') feather.replace();
}

function guardarRetrospectiva() {
    const sprintId = document.getElementById('retroSprintId').value;
    if (!sprintId) {
        mostrarToast(" Selecciona un sprint", 'error');
        return;
    }

    const sprint = proyecto.scrum.sprints.find(s => s.id == sprintId);

    const bien = document.getElementById('retroBien').value.split('\n').filter(l => l.trim().length > 0);
    const mejorar = document.getElementById('retroMejorar').value.split('\n').filter(l => l.trim().length > 0);
    const accionesLines = document.getElementById('retroAcciones').value.split('\n').filter(l => l.trim().length > 0);

    const acciones = accionesLines.map(line => {
        const partes = line.split(':');
        return {
            id: Date.now() + Math.random(),
            descripcion: partes[0]?.trim() || line,
            responsable: partes[1]?.trim() || 'Equipo',
            completada: false,
            fechaCreacion: new Date().toISOString()
        };
    });

    const nuevaRetro = {
        id: Date.now(),
        sprintId: parseInt(sprintId),
        sprintNombre: sprint?.nombre || 'Sprint ' + sprintId,
        fecha: new Date().toISOString().split('T')[0],
        asistentes: document.getElementById('retroAsistentes').value.split(',').map(a => a.trim()),
        bien: bien,
        mejorar: mejorar,
        acciones: acciones,
        valoracion: parseFloat(document.getElementById('retroValoracion').value)
    };

    if (!proyecto.scrum.retrospectivas) proyecto.scrum.retrospectivas = [];
    proyecto.scrum.retrospectivas.push(nuevaRetro);

    guardarProyecto();
    renderizarRetrospectives();
    sincronizarConPanelSalud();
    cerrarModalGeneric();
    mostrarToast(` Retrospectiva guardada para ${nuevaRetro.sprintNombre}`, 'success');
}

function toggleAccionRetrospectiva(retroId, accionId) {
    const retro = proyecto.scrum.retrospectivas.find(r => r.id === retroId);
    if (retro) {
        const accion = retro.acciones.find(a => a.id === accionId);
        if (accion) {
            accion.completada = !accion.completada;
            guardarProyecto();
            renderizarRetrospectives();
            mostrarToast(accion.completada ? " Acción marcada como completada" : " Acción reactivada", 'success');
        }
    }
}

function eliminarRetrospectiva(id) {
    if (confirm(tApp('confirmar_eliminar_retrospectiva'))) {
        proyecto.scrum.retrospectivas = proyecto.scrum.retrospectivas.filter(r => r.id !== id);
        guardarProyecto();
        renderizarRetrospectives();
        mostrarToast(tApp('toast_retrospectiva_eliminada'), 'success');
    }
}

// ============================================
// AGILE METRICS
// ============================================

function actualizarAgileMetrics() {
    const historias = proyecto.scrum.historias || [];
    const historiasCompletadas = historias.filter(h => h.estado === 'done');

    // Calcular Lead Time (desde creación hasta completado)
    let leadTimes = [];
    historiasCompletadas.forEach(h => {
        if (h.fechaCreacion && h.fechaCompletado) {
            const leadTime = Math.ceil((new Date(h.fechaCompletado) - new Date(h.fechaCreacion)) / (1000 * 60 * 60 * 24));
            leadTimes.push(leadTime);
            // Guardar en la historia para referencia
            h.leadTime = leadTime;
        }
    });

    // Calcular Cycle Time (desde inicio hasta completado)
    let cycleTimes = [];
    historiasCompletadas.forEach(h => {
        if (h.fechaInicio && h.fechaCompletado) {
            const cycleTime = Math.ceil((new Date(h.fechaCompletado) - parseLocalDate(h.fechaInicio)) / (1000 * 60 * 60 * 24));
            cycleTimes.push(cycleTime);
            h.cycleTime = cycleTime;
        }
    });

    // Guardar métricas en scrum.metricas
    if (!proyecto.scrum.metricas) proyecto.scrum.metricas = {};
    proyecto.scrum.metricas.leadTime = leadTimes;
    proyecto.scrum.metricas.cycleTime = cycleTimes;

    // Calcular promedios
    const leadTimePromedio = leadTimes.length > 0 ? leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length : 0;
    const cycleTimePromedio = cycleTimes.length > 0 ? cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length : 0;

    // Actualizar DOM
    const leadTimeElem = document.getElementById('leadTime');
    if (leadTimeElem) leadTimeElem.innerHTML = leadTimePromedio.toFixed(1);

    const cycleTimeElem = document.getElementById('cycleTime');
    if (cycleTimeElem) cycleTimeElem.innerHTML = cycleTimePromedio.toFixed(1);

    // Calcular Throughput (historias por sprint)
    const sprints = proyecto.scrum.sprints || [];
    const throughputs = [];
    sprints.forEach(s => {
        const historiasSprint = historias.filter(h => h.sprintId === s.id && h.estado === 'done').length;
        throughputs.push(historiasSprint);
    });
    const throughputPromedio = throughputs.length > 0 ? throughputs.reduce((a, b) => a + b, 0) / throughputs.length : 0;

    const throughputElem = document.getElementById('throughput');
    if (throughputElem) throughputElem.innerHTML = throughputPromedio.toFixed(1);

    // Calcular Predictibilidad
    let predictibilidadTotal = 0;
    let sprintsValidos = 0;
    sprints.forEach(s => {
        if (s.puntosPlanificados > 0 && s.puntosCompletados !== undefined) {
            const cumplimiento = Math.min(100, (s.puntosCompletados / s.puntosPlanificados) * 100);
            predictibilidadTotal += cumplimiento;
            sprintsValidos++;
        }
    });
    const predictibilidad = sprintsValidos > 0 ? predictibilidadTotal / sprintsValidos : 0;

    const predictibilidadElem = document.getElementById('predictibilidad');
    if (predictibilidadElem) predictibilidadElem.innerHTML = Math.round(predictibilidad) + '%';

    guardarProyecto();

    // Refrescar Cumulative Flow Diagram
    const sprintsCompletados = sprints.filter(s => s.estado === 'completado');
    if (sprintsCompletados.length > 0) dibujarCumulativeFlowChart(sprintsCompletados);

    mostrarToast(" Métricas ágiles actualizadas", 'success');
}

function exportarAgileMetrics() {
    const sprints = (proyecto.scrum.sprints || []).filter(s => s.estado === 'completado');
    let csv = "Sprint,Historias,Puntos Planificados,Puntos Completados,Velocidad,Lead Time (días),Cycle Time (días),Throughput,Predictibilidad\n";

    sprints.forEach(s => {
        const historiasSprint = (proyecto.scrum.historias || []).filter(h => h.sprintId === s.id);
        const leadTimeProm = historiasSprint.filter(h => h.cycleTime).reduce((acc, h) => acc + (h.cycleTime || 0), 0) / (historiasSprint.filter(h => h.cycleTime).length || 1);
        const predictibilidad = s.puntosPlanificados > 0 ? ((s.puntosCompletados / s.puntosPlanificados) * 100).toFixed(1) : 0;

        csv += `"${s.nombre}",${historiasSprint.length},${s.puntosPlanificados || 0},${s.puntosCompletados || 0},${s.puntosCompletados || 0},${leadTimeProm.toFixed(1)},${leadTimeProm.toFixed(1)},${historiasSprint.filter(h => h.estado === 'done').length},${predictibilidad}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `agile_metrics_${proyecto.nombre}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Métricas ágiles exportadas", 'success');
}
// ============================================
// CONTROL DE GASTOS EN PROYECTOS ÁGILES (PMBOK 8)
// ============================================

function calcularCostesPorSprint() {
    console.log(" calcularCostesPorSprint() ejecutándose...");

    if (!proyecto.scrum) {
        console.log("No hay datos Scrum");
        return [];
    }

    const sprints = proyecto.scrum.sprints || [];
    const historias = proyecto.scrum.historias || [];
    const materiales = proyecto.materiales || [];
    const servicios = proyecto.servicios || [];
    const equipo = proyecto.equipo || [];

    console.log(` Procesando ${sprints.length} sprints...`);

    let costeTotalProyecto = 0;
    let costesPorSprint = [];

    sprints.forEach(sprint => {
        // 1. Coste de materiales asociados a este sprint
        let costeMaterialesSprint = 0;
        materiales.forEach(m => {
            if (m.sprint == sprint.numero || m.sprintAsociado == sprint.id) {
                const coste = convertirMoneda(m.cantidad * m.costeUnitario, m.moneda);
                costeMaterialesSprint += coste;
                console.log(` Material "${m.nombre}" (Sprint ${sprint.numero}): +${formatearMoneda(coste)}`);
            }
        });

        // 2. Coste de servicios asociados a este sprint
        let costeServiciosSprint = 0;
        servicios.forEach(s => {
            if (s.sprint == sprint.numero || s.sprintAsociado == sprint.id) {
                const bruto = (Number(s.cantidad) || 0) * (Number(s.costeUnitario) || 0)
                    * (1 + (Number(s.impuesto) || 0) / 100);
                const coste = convertirMoneda(bruto, s.moneda);
                costeServiciosSprint += coste;
                console.log(` Servicio "${s.nombre}" (Sprint ${sprint.numero}): +${formatearMoneda(coste)}`);
            }
        });

        // 3. Coste de horas de equipo (basado en días reales del sprint)
        let costeEquipoSprint = 0;
        // Obtener historias completadas en este sprint
        const historiasSprint = historias.filter(h => h.sprintId === sprint.id);
        const historiasCompletadas = historiasSprint.filter(h => h.estado === 'done');

        historiasCompletadas.forEach(historia => {
            if (historia.recursoAsignado) {
                // Usar días reales de la historia si existen, si no usar días estimados
                const dias = historia.diasReales || historia.diasEstimados || 5;
                const horasPorDia = historia.horasPorDia || 8;
                const horasTotales = dias * horasPorDia;
                const coste = horasTotales * historia.recursoAsignado.costeHora;
                costeEquipoSprint += convertirMoneda(coste, historia.recursoAsignado.moneda);
                console.log(` Historia "${historia.titulo}": ${dias}d × ${horasPorDia}h × ${historia.recursoAsignado.costeHora}${historia.recursoAsignado.moneda} = ${formatearMoneda(coste)}`);
            }
        });

        // 4. Calcular puntos completados
        const puntosCompletados = historiasCompletadas.reduce((acc, h) => acc + (h.puntos || 0), 0);

        const costeTotalSprint = costeMaterialesSprint + costeServiciosSprint + costeEquipoSprint;
        const costePorPunto = puntosCompletados > 0 ? costeTotalSprint / puntosCompletados : 0;

        // Usar el coste planificado guardado en el sprint (o calcularlo)
        let costePlanificado = sprint.costes?.planificado || 0;
        if (costePlanificado === 0) {
            // Calcular coste planificado desde las historias estimadas
            historiasSprint.forEach(historia => {
                if (historia.costeEstimado) {
                    costePlanificado += historia.costeEstimado;
                }
            });
        }

        const desviacion = costePlanificado > 0 ?
            ((costeTotalSprint - costePlanificado) / costePlanificado) * 100 : 0;

        costesPorSprint.push({
            id: sprint.id,
            numero: sprint.numero || sprint.id,
            nombre: sprint.nombre,
            puntos: puntosCompletados,
            costePlanificado: costePlanificado,
            costeReal: costeTotalSprint,
            desviacion: desviacion,
            costePorPunto: costePorPunto,
            estado: desviacion > 15 ? ' Sobrecoste' : (desviacion < -10 ? ' Ahorro' : ' Controlado')
        });

        costeTotalProyecto += costeTotalSprint;

        // Guardar costes en el sprint
        if (!sprint.costes) sprint.costes = {};
        sprint.costes.real = costeTotalSprint;
        sprint.costes.planificado = costePlanificado;
        sprint.costes.desviacion = desviacion;
        sprint.costes.puntos = puntosCompletados;
        sprint.costes.costePorPunto = costePorPunto;
    });

    guardarProyecto();

    // ============================================
    // ACTUALIZAR DOM DEL PANEL DE CONTROL DE GASTOS
    // ============================================

    // Calcular métricas globales
    const sprintsConDatos = costesPorSprint.filter(s => s.costeReal > 0);
    const costeMedioSprint = sprintsConDatos.length > 0 ?
        costesPorSprint.reduce((acc, s) => acc + s.costeReal, 0) / sprintsConDatos.length : 0;

    const puntosTotales = costesPorSprint.reduce((acc, s) => acc + s.puntos, 0);
    const costePorPuntoGlobal = puntosTotales > 0 ? costeTotalProyecto / puntosTotales : 0;

    // Calcular Burn Rate
    let burnRate = 0;
    const sprintsOrdenados = [...sprints].sort((a, b) => parseLocalDate(a.fechaInicio) - parseLocalDate(b.fechaInicio));
    if (sprintsOrdenados.length > 0) {
        const primerSprint = sprintsOrdenados[0];
        const ultimoSprint = sprintsOrdenados[sprintsOrdenados.length - 1];
        if (primerSprint?.fechaInicio && ultimoSprint?.fechaFin) {
            const inicio = parseLocalDate(primerSprint.fechaInicio);
            const fin = parseLocalDate(ultimoSprint.fechaFin);
            const diasTotales = Math.max(1, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)));
            burnRate = costeTotalProyecto / diasTotales;
        }
    }

    // Actualizar tarjetas de resumen
    const agileCosteTotal = document.getElementById('agileCosteTotal');
    if (agileCosteTotal) {
        agileCosteTotal.innerHTML = formatearMoneda(costeTotalProyecto);

        const costeMedioElem = document.getElementById('agileCosteMedioSprint');
        if (costeMedioElem) costeMedioElem.innerHTML = formatearMoneda(costeMedioSprint);

        const costePorPuntoElem = document.getElementById('agileCostePorPunto');
        if (costePorPuntoElem) costePorPuntoElem.innerHTML = formatearMoneda(costePorPuntoGlobal);

        const burnRateElem = document.getElementById('agileBurnRate');
        if (burnRateElem) burnRateElem.innerHTML = formatearMoneda(burnRate) + '/día';

        // Renderizar tabla de costes por sprint
        const tbody = document.getElementById('costesSprintBody');
        if (tbody) {
            if (costesPorSprint.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="u-text-center">No hay sprints completados</td></tr>';
            } else {
                tbody.innerHTML = costesPorSprint.map(s => {
                    let desviacionColor = '';
                    let desviacionIcono = '';
                    if (s.desviacion > 15) {
                        desviacionColor = '#FF3B30';
                        desviacionIcono = '';
                    } else if (s.desviacion > 5) {
                        desviacionColor = '#FF8C00';
                        desviacionIcono = '';
                    } else if (s.desviacion < -10) {
                        desviacionColor = '#00A859';
                        desviacionIcono = '';
                    } else {
                        desviacionColor = '#007AFF';
                        desviacionIcono = '';
                    }

                    return `
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <td class="u-p-8"><strong>${escapeHtml(s.nombre)}</strong></td>
                            <td class="u-p-8">${s.puntos} pts</td>
                            <td class="u-p-8">${formatearMoneda(s.costePlanificado)}</td>
                            <td style="padding: 8px; background: ${s.desviacion > 15 ? 'rgba(255,59,48,0.2)' : (s.desviacion < -10 ? 'rgba(0,168,89,0.2)' : 'transparent')}">
                                ${formatearMoneda(s.costeReal)}
                            </td>
                            <td style="padding: 8px; color: ${desviacionColor}; font-weight: bold;">
                                ${desviacionIcono} ${s.desviacion > 0 ? '+' : ''}${s.desviacion.toFixed(1)}%
                            </td>
                            <td class="u-p-8">${formatearMoneda(s.costePorPunto)}/punto</td>
                            <td class="u-p-8">${s.estado}</td>
                        </tr>
                    `;
                }).join('');
            }
        }

        // Generar alertas
        const alertas = costesPorSprint.filter(s => Math.abs(s.desviacion) > 15);
        const alertasContainer = document.getElementById('alertasCostesContent');
        if (alertasContainer) {
            if (alertas.length > 0) {
                alertasContainer.innerHTML = alertas.map(a => `
                    <div style="padding: 10px; margin: 8px 0; background: rgba(255,59,48,0.15); border-radius: 8px; border-left: 3px solid #FF3B30;">
                         <strong>${escapeHtml(a.nombre)}</strong>: Desviación del ${a.desviacion.toFixed(1)}%
                        (${formatearMoneda(Math.abs(a.costeReal - a.costePlanificado))})
                        <br><small> Revisar: ${a.costeReal > a.costePlanificado ? 'gastos excesivos' : 'posible infraejecución'}</small>
                    </div>
                `).join('');
            } else {
                alertasContainer.innerHTML = '<div style="padding: 10px; color: #00A859;"> Todas las desviaciones están dentro del margen aceptable (±15%)</div>';
            }
        }

        // Dibujar gráfico
        dibujarGraficoCostesAgile(costesPorSprint);

        console.log(" Panel de Control de Gastos Ágil actualizado");
    }

    return costesPorSprint;
}
// ============================================
// FUNCIÓN PARA CALCULAR SALUD FINANCIERA ÁGIL
// ============================================

function calcularSaludFinancieraAgil() {
    if (!proyecto.scrum || !proyecto.scrum.sprints) {
        return { spi: 1, cpi: 1, eac: 0, tendencia: 'neutral' };
    }

    const sprints = proyecto.scrum.sprints.filter(s => s.estado === 'completado');
    if (sprints.length === 0) {
        return { spi: 1, cpi: 1, eac: 0, tendencia: 'neutral' };
    }

    // Calcular SPI (Schedule Performance Index) basado en velocidad
    let totalPuntosPlanificados = 0;
    let totalPuntosCompletados = 0;
    let totalCostePlanificado = 0;
    let totalCosteReal = 0;

    sprints.forEach(sprint => {
        totalPuntosPlanificados += sprint.puntosPlanificados || 0;
        totalPuntosCompletados += sprint.puntosCompletados || 0;
        totalCostePlanificado += sprint.costes?.planificado || 0;
        totalCosteReal += sprint.costes?.real || 0;
    });

    // SPI basado en puntos (velocidad)
    const spi = totalPuntosPlanificados > 0 ? totalPuntosCompletados / totalPuntosPlanificados : 1;

    // CPI basado en costes
    const cpi = totalCostePlanificado > 0 ? totalCostePlanificado / totalCosteReal : 1;

    // EAC (Estimate at Completion) = Presupuesto total / CPI
    const presupuestoTotal = (typeof precioVentaEnBase === 'function' ? precioVentaEnBase(proyecto) : (proyecto.precioVenta || 0)) || totalCostePlanificado;
    const eac = (typeof calcularEAC === 'function') ? calcularEAC(presupuestoTotal, cpi) : (cpi > 0 ? presupuestoTotal / cpi : null);

    // Tendencia
    let tendencia = 'neutral';
    if (sprints.length >= 2) {
        const ultimoSprint = sprints[sprints.length - 1];
        const anteriorSprint = sprints[sprints.length - 2];
        const mejoraVelocidad = (ultimoSprint.puntosCompletados || 0) - (anteriorSprint.puntosCompletados || 0);
        if (mejoraVelocidad > 0) tendencia = 'mejorando';
        else if (mejoraVelocidad < 0) tendencia = 'empeorando';
    }

    return { spi, cpi, eac, tendencia, totalCosteReal, totalCostePlanificado };
}

function dibujarGraficoCostesAgile(costesPorSprint) {
    const canvas = document.getElementById('agileCostEvolutionChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.agileCostChart) window.agileCostChart.destroy();

    const labels = costesPorSprint.map(s => s.nombre);
    const planificados = costesPorSprint.map(s => s.costePlanificado);
    const reales = costesPorSprint.map(s => s.costeReal);

    window.agileCostChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: tApp('chart_coste_planificado'),
                    data: planificados,
                    backgroundColor: 'rgba(0,122,255,0.6)',
                    borderRadius: 6,
                    borderWidth: 0
                },
                {
                    label: tApp('chart_coste_real'),
                    data: reales,
                    backgroundColor: 'rgba(255,59,48,0.7)',
                    borderRadius: 6,
                    borderWidth: 0
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
                },
                legend: {
                    position: 'top',
                    labels: { color: '#888' }
                }
            },
            scales: {
                y: {
                    title: { display: true, text: tApp('chart_coste_label'), color: '#888' },
                    ticks: {
                        callback: (v) => formatearMoneda(v),
                        color: '#888'
                    }
                },
                x: {
                    ticks: { color: '#888', rotation: 45 }
                }
            }
        }
    });
}

function actualizarCostesSprint() {
    calcularCostesPorSprint();
    mostrarToast(" Costes de sprints actualizados", 'success');
}

function exportarCostesAgile() {
    if (!proyecto.scrum) {
        mostrarToast("No hay datos Scrum para exportar", 'warning');
        return;
    }

    const sprints = proyecto.scrum.sprints || [];
    let csv = "Sprint,Puntos,Coste Planificado (€),Coste Real (€),Desviación (%),Coste por Punto (€),Estado\n";

    sprints.forEach(s => {
        const costes = s.costes || {};
        const historiasSprint = (proyecto.scrum?.historias || []).filter(h => h.sprintId === s.id);
        const puntos = historiasSprint.filter(h => h.estado === 'done').reduce((acc, h) => acc + (h.puntos || 0), 0);
        const desviacion = costes.planificado ? ((costes.real - costes.planificado) / costes.planificado * 100).toFixed(1) : 0;
        const costePorPunto = puntos > 0 ? (costes.real / puntos).toFixed(2) : 0;
        const estado = desviacion > 15 ? 'Sobrecoste' : (desviacion < -10 ? 'Ahorro' : 'Controlado');

        csv += `"${s.nombre}",${puntos},${costes.planificado || 0},${costes.real || 0},${desviacion}%,${costePorPunto},${estado}\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `costes_agile_${proyecto.nombre}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Costes ágiles exportados a CSV", 'success');
}

function actualizarControlGastosAgile() {
    if (proyecto.metodologia?.tipo === 'agile' || proyecto.metodologia?.tipo === 'mixto') {
        calcularCostesPorSprint();
    }
}

// ============================================
// EXPORTAR HISTORIAS
// ============================================

function exportarHistorias() {
    const historias = proyecto.scrum.historias || [];
    let csv = "ID,Título,Descripción,Prioridad,Puntos,Estado,Asignado,Etiquetas,Fecha Creación,Fecha Completado\n";
    historias.forEach(h => {
        csv += `"${h.id}","${escapeHtmlCSV(h.titulo)}","${escapeHtmlCSV(h.descripcion || '')}","${h.prioridad}",${h.puntos || 0},"${h.estado}","${escapeHtmlCSV(h.asignado || '')}","${escapeHtmlCSV(h.etiquetas || '')}","${h.fechaCreacion?.split('T')[0] || '-'}","${h.fechaCompletado?.split('T')[0] || '-'}"\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historias_${proyecto.nombre}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Historias exportadas a CSV", 'success');
}

function escapeHtmlCSV(str) {
    if (!str) return '';
    return str.replace(/"/g, '""');
}
// ============================================
// GESTIÓN DE SPRINTS - LISTADO, EDITAR, BORRAR
// ============================================

function renderizarListadoSprints() {
    // Asegurar que proyecto.scrum existe
    if (!proyecto.scrum) {
        proyecto.scrum = {
            sprints: [],
            sprintActivo: null,
            historias: [],
            retrospectivas: [],
            metricas: {
                leadTime: [],
                cycleTime: [],
                throughput: [],
                predictibilidad: []
            }
        };
        guardarProyecto();
    }

    const sprints = proyecto.scrum.sprints || [];
    const sprintActivo = proyecto.scrum.sprintActivo;

    // Calcular estadísticas (sprintActivo ya está incluido en sprints)
    const totalSprints = sprints.length;
    const activos = sprintActivo ? 1 : 0;
    const completados = sprints.filter(s => s.estado === 'completado').length;

    let sumaVelocidad = 0;
    let countVelocidad = 0;
    sprints.forEach(s => {
        if (s.estado === 'completado' && s.puntosCompletados > 0) {
            sumaVelocidad += s.puntosCompletados;
            countVelocidad++;
        }
    });
    const velocidadMedia = countVelocidad > 0 ? (sumaVelocidad / countVelocidad).toFixed(1) : 0;

    // Actualizar resumen
    const totalSprintsElem = document.getElementById('totalSprints');
    const totalSprintsActivosElem = document.getElementById('totalSprintsActivos');
    const totalSprintsCompletadosElem = document.getElementById('totalSprintsCompletados');
    const velocidadMediaSprintsElem = document.getElementById('velocidadMediaSprints');

    if (totalSprintsElem) totalSprintsElem.innerHTML = totalSprints;
    if (totalSprintsActivosElem) totalSprintsActivosElem.innerHTML = activos;
    if (totalSprintsCompletadosElem) totalSprintsCompletadosElem.innerHTML = completados;
    if (velocidadMediaSprintsElem) velocidadMediaSprintsElem.innerHTML = velocidadMedia;

    // Construir lista de todos los sprints
    const todosSprints = [];
    if (sprintActivo) {
        todosSprints.push({
            ...sprintActivo,
            esActivo: true,
            fechaFinMostrar: sprintActivo.fechaFin || '-',
            puntosPlanificadosMostrar: sprintActivo.puntosPlanificados || 0,
            puntosCompletadosMostrar: sprintActivo.puntosCompletados || 0,
            velocidadMostrar: sprintActivo.puntosCompletados || 0
        });
    }
    sprints.forEach(s => {
        if (s.estado === 'completado') {
            todosSprints.push({
                ...s,
                esActivo: false,
                fechaFinMostrar: s.fechaFinReal || s.fechaFin || '-',
                puntosPlanificadosMostrar: s.puntosPlanificados || 0,
                puntosCompletadosMostrar: s.puntosCompletados || 0,
                velocidadMostrar: s.puntosCompletados || 0
            });
        }
    });

    // Renderizar tabla
    const tbody = document.getElementById('sprintsListBody');
    if (!tbody) return;

    if (todosSprints.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="u-text-center">No hay sprints. Inicia un sprint para comenzar. </td></tr>';
        return;
    }

    tbody.innerHTML = todosSprints.map(s => {
        const eficiencia = s.puntosPlanificadosMostrar > 0 ?
            ((s.puntosCompletadosMostrar / s.puntosPlanificadosMostrar) * 100).toFixed(1) : 0;
        const estadoBadge = s.esActivo ?
            '<span class="badge-progreso"> ACTIVO</span>' :
            '<span class="badge-completado"> COMPLETADO</span>';

        return `<tr>
            <td>#${s.id}</td>
            <td><strong>${escapeHtml(s.nombre || 'Sprint sin nombre')}</strong>${s.esActivo ? ' <span class="badge-progreso" style="font-size: 9px;">Actual</span>' : ''}</td>
            <td>${formatearFechaEspa(s.fechaInicio)}</td>
            <td>${formatearFechaEspa(s.fechaFinMostrar)}</td>
            <td>${estadoBadge}</td>
            <td>${s.puntosPlanificadosMostrar}</td>
            <td>${s.puntosCompletadosMostrar}</td>
            <td>${s.velocidadMostrar}</td>
            <td class="${eficiencia >= 80 ? 'cashflow-positive' : (eficiencia >= 60 ? '' : 'cashflow-negative')}">${eficiencia}%</td>
            <td>
                ${!s.esActivo ? `<button class="btn btn-ghost btn-xs" onclick="editarSprint(${s.id})" title="Editar sprint" aria-label="Editar sprint"><i data-feather="edit-2"></i></button>` : ''}
                ${!s.esActivo ? `<button class="btn btn-danger btn-xs" onclick="eliminarSprint(${s.id})" title="Eliminar sprint" aria-label="Eliminar sprint"><i data-feather="trash-2"></i></button>` : '<span style="color: rgba(255,255,255,0.3);">No editable</span>'}
                <button class="btn btn-ghost btn-xs" onclick="verDetalleSprint(${s.id})" title="Ver detalle del sprint" aria-label="Ver detalle del sprint"><i data-feather="eye"></i></button>
            </td>
        </tr>`;
    }).join('');
    if (typeof feather !== 'undefined') feather.replace();
}

function editarSprint(id) {
    const sprint = proyecto.scrum.sprints.find(s => s.id === id);
    if (!sprint || sprint.estado !== 'completado') {
        mostrarToast(" Solo se pueden editar sprints completados", 'error');
        return;
    }

    const modalHtml = `
        <div class="modal-content modal-500">
            <div class="modal-header">
                <h3> Editar Sprint: ${escapeHtml(sprint.nombre)}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="editSprintId" value="${sprint.id}">
            <div class="form-group">
                <label>Nombre del Sprint</label>
                <input type="text" id="editSprintNombre" value="${escapeHtml(sprint.nombre)}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Fecha inicio</label>
                    <input type="date" id="editSprintInicio" value="${sprint.fechaInicio || ''}">
                </div>
                <div class="form-group">
                    <label> Fecha fin</label>
                    <input type="date" id="editSprintFin" value="${sprint.fechaFinReal || sprint.fechaFin || ''}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Puntos planificados</label>
                    <input type="number" id="editSprintPlanificados" value="${sprint.puntosPlanificados || 0}">
                </div>
                <div class="form-group">
                    <label> Puntos completados</label>
                    <input type="number" id="editSprintCompletados" value="${sprint.puntosCompletados || 0}">
                </div>
            </div>
            <div class="info-card-modal">
                <p> Modificar los puntos afectará la velocidad histórica y las métricas ágiles.</p>
            </div>
            <button class="btn btn-primary btn-icon-only" onclick="guardarEdicionSprint()" title="Guardar Cambios" aria-label="Guardar Cambios"><i data-feather="save"></i></button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    if (typeof feather !== 'undefined') feather.replace();
}

function guardarEdicionSprint() {
    const id = parseInt(document.getElementById('editSprintId').value);
    const sprint = proyecto.scrum.sprints.find(s => s.id === id);

    if (sprint) {
        sprint.nombre = document.getElementById('editSprintNombre').value;
        sprint.fechaInicio = document.getElementById('editSprintInicio').value;
        sprint.fechaFinReal = document.getElementById('editSprintFin').value;
        sprint.puntosPlanificados = parseInt(document.getElementById('editSprintPlanificados').value) || 0;
        sprint.puntosCompletados = parseInt(document.getElementById('editSprintCompletados').value) || 0;
        sprint.velocidad = sprint.puntosCompletados;

        guardarProyecto();
        renderizarListadoSprints();
        renderizarVelocityTracking();
        renderizarAgileMetrics();
        sincronizarConPanelSalud();
        cerrarModalGeneric();
        mostrarToast(` Sprint "${sprint.nombre}" actualizado`, 'success');
    }
}

function eliminarSprint(id) {
    const sprint = proyecto.scrum.sprints.find(s => s.id === id);
    if (!sprint) return;

    if (confirm(`¿Eliminar el sprint "${sprint.nombre}"?\n\nEsta acción también eliminará las historias asociadas a este sprint y no se puede deshacer.`)) {
        // Eliminar historias asociadas a este sprint
        if (proyecto.scrum.historias) {
            const historiasAEliminar = proyecto.scrum.historias.filter(h => h.sprintId === id);
            if (historiasAEliminar.length > 0) {
                if (confirm(`El sprint tiene ${historiasAEliminar.length} historia(s) asociada(s). ¿Eliminarlas también?`)) {
                    proyecto.scrum.historias = proyecto.scrum.historias.filter(h => h.sprintId !== id);
                } else {
                    // Reasignar historias al backlog
                    proyecto.scrum.historias.forEach(h => {
                        if (h.sprintId === id) {
                            h.sprintId = null;
                            h.estado = 'todo';
                        }
                    });
                }
            }
        }

        // Eliminar retrospectiva asociada
        if (proyecto.scrum.retrospectivas) {
            proyecto.scrum.retrospectivas = proyecto.scrum.retrospectivas.filter(r => r.sprintId !== id);
        }

        // Eliminar sprint
        proyecto.scrum.sprints = proyecto.scrum.sprints.filter(s => s.id !== id);

        guardarProyecto();
        renderizarListadoSprints();
        renderizarVelocityTracking();
        renderizarAgileMetrics();
        sincronizarConPanelSalud();
        mostrarToast(` Sprint "${sprint.nombre}" eliminado`, 'success');
    }
}

function verDetalleSprint(id) {
    const sprint = proyecto.scrum.sprints.find(s => s.id === id);
    if (!sprint) return;

    const historiasSprint = (proyecto.scrum.historias || []).filter(h => h.sprintId === id);
    const retrospectiva = (proyecto.scrum.retrospectivas || []).find(r => r.sprintId === id);

    const modalHtml = `
        <div class="modal-content modal-md">
            <div class="modal-header">
                <h3> Detalle del Sprint: ${escapeHtml(sprint.nombre)}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>

            <div class="info-card u-mb-16">
                <div><strong> Período:</strong> ${formatearFechaEspa(sprint.fechaInicio)} → ${formatearFechaEspa(sprint.fechaFinReal || sprint.fechaFin)}</div>
                <div><strong> Puntos:</strong> ${sprint.puntosCompletados || 0}/${sprint.puntosPlanificados || 0} (${sprint.puntosPlanificados > 0 ? ((sprint.puntosCompletados / sprint.puntosPlanificados) * 100).toFixed(1) : 0}%)</div>
                <div><strong> Velocidad:</strong> ${sprint.puntosCompletados || 0} pts</div>
                <div><strong> Eficiencia:</strong> ${sprint.puntosPlanificados > 0 ? ((sprint.puntosCompletados / sprint.puntosPlanificados) * 100).toFixed(1) : 0}%</div>
            </div>

            <div class="info-card u-mb-16">
                <h4> Historias en este sprint (${historiasSprint.length})</h4>
                ${historiasSprint.length > 0 ? `
                    <table class="data-table">
                        <thead><tr><th>Historia</th><th>Puntos</th><th>Estado</th></tr></thead>
                        <tbody>
                            ${historiasSprint.map(h => `
                                <tr>
                                    <td>${escapeHtml(h.titulo)}</td>
                                    <td>${h.puntos || 0}</td>
                                    <td class="${h.estado === 'done' ? 'cashflow-positive' : (h.estado === 'progress' ? '' : 'cashflow-negative')}">${h.estado === 'done' ? ' Completada' : (h.estado === 'progress' ? ' En progreso' : ' Pendiente')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p class="u-color-muted">No hay historias asociadas</p>'}
            </div>

            ${retrospectiva ? `
            <div class="info-card">
                <h4> Retrospectiva</h4>
                <div><strong> Fecha:</strong> ${formatearFechaEspa(retrospectiva.fecha)}</div>
                <div><strong> Valoración:</strong> ${retrospectiva.valoracion || '-'}/5</div>
                <div><strong> Lo que salió bien:</strong><br>${(retrospectiva.bien || []).map(b => `• ${escapeHtml(b)}<br>`).join('')}</div>
                <div><strong> Cosas a mejorar:</strong><br>${(retrospectiva.mejorar || []).map(m => `• ${escapeHtml(m)}<br>`).join('')}</div>
            </div>
            ` : '<div class="info-card"><p class="u-color-muted">No hay retrospectiva registrada para este sprint.</p></div>'}

            <button class="btn btn-primary btn-icon-only u-mt-16" onclick="cerrarModalGeneric()" title="Cerrar" aria-label="Cerrar"><i data-feather="x"></i></button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    if (typeof feather !== 'undefined') feather.replace();
}

function exportarSprints() {
    const sprints = proyecto.scrum.sprints || [];
    let csv = "ID,Nombre,Fecha Inicio,Fecha Fin,Estado,Puntos Planificados,Puntos Completados,Velocidad,Eficiencia\n";

    sprints.forEach(s => {
        const eficiencia = s.puntosPlanificados > 0 ? ((s.puntosCompletados / s.puntosPlanificados) * 100).toFixed(1) : 0;
        csv += `"${s.id}","${s.nombre}",${s.fechaInicio || '-'},${s.fechaFinReal || s.fechaFin || '-'},${s.estado},${s.puntosPlanificados || 0},${s.puntosCompletados || 0},${s.puntosCompletados || 0},${eficiencia}%\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sprints_${proyecto.nombre}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Sprints exportados a CSV", 'success');
}
function reordenarNumeracionElementos(arr, ctx) {
    const elementos = arr || proyecto.elementosGantt;
    if (!elementos) return;

    const resultado = (typeof aplicarCodigosWBS === 'function')
        ? aplicarCodigosWBS(elementos)
        : { ciclos: [] };

    if (resultado.ciclos.length) {
        console.warn('[WBS] Jerarquías circulares detectadas:', resultado.ciclos.join(', '));
    }
    guardarProyecto();
    if (typeof renderizarCronograma === 'function') renderizarCronograma(ctx);
    mostrarToast(resultado.ciclos.length
        ? ` Códigos reordenados · ${resultado.ciclos.length} ciclo(s) aislado(s)`
        : ' Códigos jerárquicos WBS reordenados', resultado.ciclos.length ? 'error' : 'success');
}

// ============================================
// DAILY SCRUM — registro persistente en proyecto.scrum.daily
// ============================================

function registrarDaily() {
    normalizarDatosAgiles();
    const fecha = document.getElementById('dailyFecha')?.value || new Date().toISOString().slice(0, 10);
    const entrada = {
        id: Date.now(),
        fecha,
        equipo: document.getElementById('dailyEquipo')?.value.trim() || '',
        ayer: document.getElementById('dailyAyer')?.value.trim() || '',
        hoy: document.getElementById('dailyHoy')?.value.trim() || '',
        impedimentos: document.getElementById('dailyImpedimentos')?.value.trim() || ''
    };
    const indice = proyecto.scrum.daily.findIndex(d => d.fecha === fecha);
    if (indice >= 0) proyecto.scrum.daily[indice] = { ...proyecto.scrum.daily[indice], ...entrada };
    else proyecto.scrum.daily.push(entrada);
    if (typeof registrarBitacora === 'function') registrarBitacora('daily', entrada.id, indice >= 0 ? 'actualizar' : 'crear', null, entrada);
    guardarProyecto();
    renderizarDaily();
    mostrarToast('Daily registrado', 'success');
}

function renderizarDaily() {
    normalizarDatosAgiles();
    const tbody = document.getElementById('dailyBody');
    if (!tbody) return;
    const entradas = proyecto.scrum.daily.slice().sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
    tbody.innerHTML = entradas.map(d => `<tr>
        <td>${escapeHtml(d.fecha)}</td>
        <td>${escapeHtml(d.equipo || '—')}</td>
        <td>${escapeHtml(d.ayer || '—')}</td>
        <td>${escapeHtml(d.hoy || '—')}</td>
        <td>${escapeHtml(d.impedimentos || '—')}</td>
    </tr>`).join('') || '<tr><td colspan="5" class="u-text-center">Sin dailies registrados</td></tr>';
}
