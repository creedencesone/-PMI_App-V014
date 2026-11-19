// ─── EmailJS Configuration ────────────────────────────
// El usuario debe configurar estas credenciales desde la UI.
// Se almacenan en proyecto.configEmailJS
function _initEmailJS() {
    if (typeof emailjs !== 'undefined' && !emailjs._initialized) {
        const cfg = proyecto.configEmailJS;
        if (cfg?.publicKey) {
            emailjs.init(cfg.publicKey);
            emailjs._initialized = true;
        }
    }
}

function enviarNotificacionTarea(recursoEmail, recursoNombre, elem) {
    return new Promise((resolve) => {
        const cfg = proyecto.configEmailJS;
        if (!cfg?.publicKey || !cfg?.serviceId || !cfg?.templateId) {
            console.warn('EmailJS no configurado');
            resolve(false);
            return;
        }
        if (!recursoEmail) { resolve(false); return; }
        _initEmailJS();
        const fin = elem.inicio && elem.duracion > 0
            ? (typeof sumarDiasHabiles === 'function' ? sumarDiasHabiles(elem.inicio, elem.duracion) : elem.inicio)
            : elem.inicio || '—';
        emailjs.send(cfg.serviceId, cfg.templateId, {
            to_email: recursoEmail,
            to_name: recursoNombre,
            task_name: elem.nombre,
            task_type: elem.tipo,
            task_start: elem.inicio || '—',
            task_end: fin,
            task_duration: elem.duracion > 0 ? elem.duracion + ' días' : '—',
            task_responsible: elem.responsable || '—',
            project_name: proyecto.nombre || 'Proyecto',
        }).then(() => resolve(true)).catch(err => {
            console.error('EmailJS error:', err);
            resolve(false);
        });
    });
}

let ganttState = {
    zoom: 1,
    collapsed: new Set(),
    dragPredecesor: null,
    selectedId: null,
    editandoDependencia: false,
    vista: 'gantt',
    escala: 'día',
    lineaBaseVisible: null, // id de la línea base activa cuyo barra se superpone en el timeline
    _buscarTimer: null
};

let cpmResult = { criticalPath: [], totalFloat: 0, makespan: 0, conCiclo: false };
let _cronogramaOriginalHTML = null;

let ganttStateEjecucion = {
    zoom: 1,
    collapsed: new Set(),
    dragPredecesor: null,
    selectedId: null,
    editandoDependencia: false,
    vista: 'gantt',
    escala: 'día',
    lineaBaseVisible: null, // id de la línea base activa cuyo barra se superpone en el timeline
    _buscarTimer: null
};

let cpmResultEjecucion = { criticalPath: [], totalFloat: 0, makespan: 0, conCiclo: false };
let _cronogramaOriginalHTMLEjecucion = null;

let cronogramaActivo = { panelKey: 'planificacion', dataKey: 'elementosGantt' };

const _CTX_CRONO = {
    planificacion: {
        panelKey: 'planificacion',
        dataKey: 'elementosGantt',
        containerId: 'cronogramaContainer',
        wbsId: 'wbsTree',
        timelineId: 'timelinePanel',
        svgId: 'timelineSvg',
        buscarId: 'buscarGantt',
        fechasId: 'cronoFechasProyecto',
        infoBarId: 'cronogramaInfoBar',
        zoomLabelId: 'cronoZoomLabel',
        btnToggleVistaId: 'btnToggleVista',
        scaleId: 'cronoScaleSelect'
    },
    ejecucion: {
        panelKey: 'ejecucion',
        dataKey: 'elementosGanttEjecucion',
        containerId: 'ejecucionCronogramaContainer',
        wbsId: 'wbsTreeEjecucion',
        timelineId: 'timelinePanelEjecucion',
        svgId: 'timelineSvgEjecucion',
        buscarId: 'buscarGanttEjecucion',
        fechasId: 'cronoFechasProyectoEjecucion',
        infoBarId: 'cronogramaInfoBarEjecucion',
        zoomLabelId: 'cronoZoomLabelEjecucion',
        btnToggleVistaId: 'btnToggleVistaEjecucion',
        scaleId: 'cronoScaleSelectEjecucion'
    }
};

function _ctxCronograma(panelKey) { return _CTX_CRONO[panelKey || cronogramaActivo.panelKey] || _CTX_CRONO.planificacion; }
function _getState(ctx) { return ctx.panelKey === 'ejecucion' ? ganttStateEjecucion : ganttState; }
function _getCpmResult(ctx) { return ctx.panelKey === 'ejecucion' ? cpmResultEjecucion : cpmResult; }
function _getOrigHTML(ctx) { return ctx.panelKey === 'ejecucion' ? _cronogramaOriginalHTMLEjecucion : _cronogramaOriginalHTML; }
function _setOrigHTML(ctx, val) { if (ctx.panelKey === 'ejecucion') _cronogramaOriginalHTMLEjecucion = val; else _cronogramaOriginalHTML = val; }

function _normalizarElementosGantt(dataKey) {
    let arr = proyecto[dataKey] || [];
    const idsVistos = new Set();
    const elementosUnicos = [];
    arr.forEach(e => {
        if (idsVistos.has(e.id)) return;
        idsVistos.add(e.id);
        elementosUnicos.push(e);
    });
    if (elementosUnicos.length !== arr.length) {
        proyecto[dataKey] = elementosUnicos;
        arr = elementosUnicos;
        guardarProyecto();
    }
    arr.forEach(e => {
        if (!e.predecesores) e.predecesores = [];

        // Alias de tipos habituales en importaciones / seeds
        const aliasTipo = { tarea: 'actividad', task: 'actividad', milestone: 'hito', deliverable: 'entregable', summary: 'edt', fase: 'edt' };
        if (aliasTipo[e.tipo]) e.tipo = aliasTipo[e.tipo];

        // Coherencia inicio/fin/duración: hay orígenes que solo traen fechas.
        if (e.inicio && e.fin && !(e.duracion > 0) && e.tipo !== 'hito' && e.tipo !== 'edt') {
            const dIni = parseLocalDate(e.inicio);
            const dFin = parseLocalDate(e.fin);
            if (dIni && dFin && dFin > dIni) {
                e.duracion = Math.max(1, contarDiasHabiles(dIni, dFin));
            }
        }
        if (e.inicio && e.duracion > 0 && !e.fin && e.tipo !== 'edt') {
            e.fin = sumarDiasHabiles(e.inicio, e.duracion);
        }
    });
    return arr;
}

function cargarElementosGantt() {
    cronogramaActivo = { panelKey: 'planificacion', dataKey: 'elementosGantt' };
    const dataKey = cronogramaActivo.dataKey;
    if (!proyecto[dataKey]) proyecto[dataKey] = [];
    if (proyecto[dataKey].length === 0) {
        const f = proyecto.fechaInicio || new Date().toISOString().split('T')[0];
        const t = Date.now();
        const edtId = t + 1;
        proyecto[dataKey] = [
            { id: edtId, tipo: 'edt', nombre: '1. Inicio del Proyecto', inicio: '', duracion: 0, progreso: 0, responsable: '', dependeDe: null, predecesores: [] },
            { id: t + 2, tipo: 'actividad', nombre: 'Acta de Constitución', inicio: f, duracion: 3, progreso: 0, responsable: 'PM', dependeDe: edtId, predecesores: [] },
            { id: t + 3, tipo: 'entregable', nombre: 'Documento del Proyecto', inicio: f, duracion: 7, progreso: 0, responsable: '', dependeDe: edtId, predecesores: [] },
            { id: t + 4, tipo: 'hito', nombre: 'Aprobación del Acta', inicio: sumarDias(f, 7), duracion: 0, progreso: 100, responsable: '', dependeDe: edtId, predecesores: [] }
        ];
        guardarProyecto();
    }
    _normalizarElementosGantt(dataKey);
    if (typeof aplicarCodigosWBS === 'function') aplicarCodigosWBS(proyecto[dataKey]);
    renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
}

function cargarElementosGanttEjecucion() {
    cronogramaActivo = { panelKey: 'ejecucion', dataKey: 'elementosGanttEjecucion' };
    if (proyecto.elementosGanttEjecucion == null) {
        proyecto.elementosGanttEjecucion = JSON.parse(JSON.stringify(proyecto.elementosGantt || []));
        guardarProyecto();
    }
    _normalizarElementosGantt('elementosGanttEjecucion');
    if (typeof aplicarCodigosWBS === 'function') aplicarCodigosWBS(proyecto.elementosGanttEjecucion);
    renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
}

function getNombreElemento(id, arr) { const data = arr || (proyecto[cronogramaActivo.dataKey] || []); const e = data.find(x => x.id === id); return e ? e.nombre : '-'; }
function getTipoIcono(t) { return { edt: '', actividad: '', entregable: '', hito: '' }[t] || ''; }
function _migrarDuracionHoras(arr) {
    const data = arr || (proyecto[cronogramaActivo.dataKey] || []);
    data.forEach(e => {
        if (e.tipoDuracion === 'horas' && e.duracionHoras) {
            const hDia = e.horasDia || 8; const nueva = e.duracionHoras / hDia;
            if (Math.abs(e.duracion - nueva) > 0.001) {
                e.duracion = nueva;
                e.duracionOriginal = nueva;
            }
        }
    });
}
function normalizarFecha(v) {
    if (!v) return '';
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const m = v.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (m) return m[3] + '-' + String(parseInt(m[2])).padStart(2, '0') + '-' + String(parseInt(m[1])).padStart(2, '0');
    return v;
}

// ─── EDT AUTO-CALC ──────────────────────────────────────────────

function recalcularEdtAuto(arr) {
    const elementos = arr || (proyecto[cronogramaActivo.dataKey] || []);
    const children = {};
    elementos.forEach(e => { children[e.id] = []; });
    elementos.forEach(e => {
        if (e.dependeDe && children[e.dependeDe]) children[e.dependeDe].push(e);
    });

    // Post-order (leaves first)
    const visited = new Set();
    const order = [];
    function walk(id) {
        if (visited.has(id)) return;
        visited.add(id);
        (children[id] || []).forEach(child => { if (child.tipo === 'edt') walk(child.id); });
        order.push(id);
    }
    elementos.filter(e => e.tipo === 'edt').forEach(e => walk(e.id));

    order.forEach(id => {
        const edt = elementos.find(e => e.id === id);
        if (!edt) return;
        const hijos = elementos.filter(e => e.dependeDe === id);
        if (hijos.length === 0) return;

        let minInicio = null, maxFinDate = null;
        hijos.forEach(h => {
            if (!h.inicio) return;
            const start = parseLocalDate(h.inicio);
            if (!minInicio || start < minInicio) minInicio = start;

            const endStr = h.duracion > 0 ? sumarDiasHabiles(h.inicio, h.duracion) : h.inicio;
            const endD = parseLocalDate(endStr);
            if (!maxFinDate || endD > maxFinDate) maxFinDate = endD;
        });

        if (minInicio && maxFinDate) {
            const y = minInicio.getFullYear();
            const m = String(minInicio.getMonth() + 1).padStart(2, '0');
            const d = String(minInicio.getDate()).padStart(2, '0');
            edt.inicio = `${y}-${m}-${d}`;
            edt.duracion = contarDiasHabiles(minInicio, maxFinDate);
        }
        // EDT progress: weighted average of children progress (by duration)
        let totalWeight = 0, totalProgress = 0;
        hijos.forEach(h => {
            const w = Math.max(h.duracion || 0, 1);
            totalWeight += w;
            totalProgress += (h.progreso || 0) * w;
        });
        edt.progreso = totalWeight > 0 ? Math.round(totalProgress / totalWeight) : 0;
    });
}

// ─── MOTOR CPM ──────────────────────────────────────────────────

function ejecutarCPM(elementos, cpmRef) {
    const ref = cpmRef || cpmResult;
    const ids = new Set(elementos.map(e => e.id));
    const tasks = elementos.filter(e => e.tipo !== 'edt');
    if (!tasks.length) { ref.criticalPath = []; ref.totalFloat = 0; return []; }
    const adj = {}, inDeg = {};
    tasks.forEach(t => { adj[t.id] = []; inDeg[t.id] = 0; });

    tasks.forEach(t => {
        (t.predecesores || []).forEach(p => {
            if (ids.has(p.id) && adj[p.id]) {
                adj[p.id].push(t.id);
                inDeg[t.id] = (inDeg[t.id] || 0) + 1;
            }
        });
    });

    const orden = [];
    const q = tasks.filter(t => (inDeg[t.id] || 0) === 0).map(t => t.id);
    while (q.length) {
        const n = q.shift();
        orden.push(n);
        (adj[n] || []).forEach(s => { inDeg[s]--; if (inDeg[s] === 0) q.push(s); });
    }
    // Un ciclo importado no puede producir fechas ni holguras fiables.
    if (orden.length !== tasks.length) {
        ref.conCiclo = true; ref.criticalPath = []; ref.totalFloat = 0; ref.makespan = 0;
        tasks.forEach(t => { t._enCiclo = true; });
        console.warn('[CPM] Red con ciclos: métricas suspendidas');
        if (typeof mostrarToast === 'function') mostrarToast('Cronograma con dependencias circulares: revisa las precedencias', 'error');
        return tasks;
    }
    ref.conCiclo = false;

    // Convertir duración (días hábiles) a días calendario para CPM
    const duration = {};
    tasks.forEach(t => {
        if (t.inicio && t.duracion > 0) {
            const endDate = parseLocalDate(sumarDiasHabiles(t.inicio, t.duracion));
            const startDate = parseLocalDate(t.inicio);
            duration[t.id] = Math.max(1, Math.round((endDate - startDate) / 86400000));
        } else {
            duration[t.id] = t.duracion || 0;
        }
    });

    const earlyStart = {}, earlyFinish = {}, restricciones = {};
    tasks.forEach(t => { earlyStart[t.id] = null; earlyFinish[t.id] = 0; });

    let proyInicio = null;
    tasks.forEach(t => { if (t.inicio) { const d = parseLocalDate(t.inicio); if (!proyInicio || d < proyInicio) proyInicio = d; } });
    if (!proyInicio) proyInicio = new Date();

    tasks.forEach(t => {
        if (t.inicio) {
            const d = parseLocalDate(t.inicio);
            const offset = Math.round((d - proyInicio) / 86400000);
            earlyStart[t.id] = offset;
        }
    });

    orden.forEach(id => {
        const t = tasks.find(x => x.id === id);
        if (!t) return;
        (t.predecesores || []).forEach(p => {
            if (!ids.has(p.id)) return;
            const predES = earlyStart[p.id] ?? 0;
            const predEF = earlyFinish[p.id] || 0;
            const tipo = String(p.tipo || 'FS').trim().toUpperCase();
            let minStart = predEF;
            if (tipo === 'SS') minStart = predES;
            if (tipo === 'FF') minStart = predEF - (duration[id] || 0);
            if (tipo === 'SF') minStart = predES - (duration[id] || 0);
            const retraso = p.retraso || 0;
            minStart += (typeof retrasoEnDiasNaturales === 'function')
                ? retrasoEnDiasNaturales(retraso)
                : retraso;
            // Todas las precedencias contribuyen con su restricción; tomar el
            // máximo hace que un lead negativo no sobrescriba a otro predecesor.
            restricciones[id] = restricciones[id] === undefined ? minStart : Math.max(restricciones[id], minStart);
        });
        if (restricciones[id] !== undefined) earlyStart[id] = restricciones[id];
        else if (earlyStart[id] === null) earlyStart[id] = 0;
        earlyFinish[id] = earlyStart[id] + (duration[id] || 0);
    });

    const inicios = Object.values(earlyStart);
    const desplazamiento = Math.min(0, ...inicios);
    const proyFin = Object.values(earlyFinish).length
        ? Math.max(...Object.values(earlyFinish)) - desplazamiento : 0;
    ref.makespan = proyFin;
    const lateStart = {}, lateFinish = {};
    tasks.forEach(t => { lateFinish[t.id] = proyFin; lateStart[t.id] = proyFin - (duration[t.id] || 0); });

    const ordenRev = [...orden].reverse();
    ordenRev.forEach(id => {
        const t = tasks.find(x => x.id === id);
        if (!t) return;
        (adj[id] || []).forEach(s => {
            const p = (tasks.find(x => x.id === s)?.predecesores || []).find(x => x.id === id);
            if (!p) return;
            const succLS = lateStart[s] || 0;
            const succLF = lateFinish[s] || 0;
            const curDur = duration[id] || 0;
            let maxFinish = succLS;
            const tipo = String(p.tipo || 'FS').trim().toUpperCase();
            if (tipo === 'SS') maxFinish = succLS + curDur;
            if (tipo === 'FF') maxFinish = succLF;
            if (tipo === 'SF') maxFinish = succLF + curDur;
            const baseRetraso = parseLocalDate('2024-01-01');
            const finRetraso = parseLocalDate(sumarDiasHabiles('2024-01-01', p.retraso || 0));
            maxFinish -= Math.round((finRetraso - baseRetraso) / 86400000);
            if (maxFinish < lateFinish[id]) lateFinish[id] = maxFinish;
        });
        lateStart[id] = lateFinish[id] - (duration[id] || 0);
    });

    const float = {};
    tasks.forEach(t => { float[t.id] = lateStart[t.id] - earlyStart[t.id]; });
    const criticalPath = tasks.filter(t => float[t.id] < 0.5).map(t => t.id);

    tasks.forEach(t => {
        t._earlyStart = earlyStart[t.id];
        t._earlyFinish = earlyFinish[t.id];
        t._lateStart = lateStart[t.id];
        t._lateFinish = lateFinish[t.id];
        t._float = float[t.id];
        t._critical = criticalPath.includes(t.id);
    });

    ref.criticalPath = criticalPath;
    ref.totalFloat = Object.values(float).length ? Math.min(...Object.values(float)) : 0;
    return tasks;
}

// ─── BÚSQUEDA POR NOMBRE ────────────────────────────────────────

function filtrarElementosGantt(elementos, query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return elementos;
    return elementos.filter(e => {
        const nombre = (e.nombre || '').toLowerCase();
        const id = String(e.id ?? '');
        const tipo = (e.tipo || '').toLowerCase();
        return nombre.includes(q) || id.includes(q) || tipo.includes(q);
    });
}

function buscarCronogramaDebounced() {
    const ctx = _ctxCronograma(cronogramaActivo.panelKey);
    const state = _getState(ctx);
    clearTimeout(state._buscarTimer);
    state._buscarTimer = setTimeout(() => renderizarCronograma(ctx), 250);
}

// ─── RENDERIZAR CRONOGRAMA COMPLETO ─────────────────────────────

function renderizarCronograma(ctx) {
    ctx = ctx || _ctxCronograma(cronogramaActivo.panelKey);
    const container = document.getElementById(ctx.containerId);
    if (!container) return;
    try {
    const state = _getState(ctx);
    const cpmRef = _getCpmResult(ctx);

    // Migrar tareas existentes con tipo horas para usar duración fraccional
    _migrarDuracionHoras(proyecto[ctx.dataKey]);

    // Sync scale selector
    const sel = document.getElementById(ctx.scaleId);
    if (sel) sel.value = state.escala;
    // Save original Gantt DOM structure on first call
    if (!_getOrigHTML(ctx) && container.querySelector('#' + ctx.wbsId)) {
        _setOrigHTML(ctx, container.innerHTML);
    }

    autoScheduler(proyecto[ctx.dataKey]);
    recalcularEdtAuto(proyecto[ctx.dataKey]);
    const elementos = [...((proyecto[ctx.dataKey]) || [])];
    ejecutarCPM(elementos, cpmRef);

    const q = (document.getElementById(ctx.buscarId)?.value || '').trim().toLowerCase();
    const elementosVisibles = q ? filtrarElementosGantt(elementos, q) : elementos;

    // En pantallas pequeñas la vista de tarjetas es más legible por defecto.
    if (!state.vistaManual) {
        state.vista = window.matchMedia('(max-width: 640px)').matches ? 'tarjetas' : 'gantt';
    }
    const btnVista = document.getElementById(ctx.btnToggleVistaId);
    if (btnVista) {
        const etiqueta = state.vista === 'gantt' ? 'Tarjetas' : 'Gantt';
        const lbl = btnVista.querySelector('.btn-label');
        if (lbl) lbl.textContent = etiqueta;
        btnVista.setAttribute('aria-pressed', state.vista === 'tarjetas' ? 'true' : 'false');
        btnVista.setAttribute('aria-label', state.vista === 'gantt' ? 'Cambiar a vista de tarjetas' : 'Cambiar a vista de Gantt');
    }

    const fechaInicioProy = calcularInicioProyecto(elementosVisibles);
    const fechaFinProy = calcularFinProyecto(elementosVisibles);
    const spanFechas = document.getElementById(ctx.fechasId);
    if (spanFechas) {
        const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        spanFechas.textContent = ` ${formatearFechaEspa(fmt(fechaInicioProy))} → ${formatearFechaEspa(fmt(fechaFinProy))} (${Math.round((fechaFinProy - fechaInicioProy) / 86400000)} días naturales)`;
    }

    if (state.vista === 'tarjetas') {
        renderizarVistaTarjetas(elementosVisibles, ctx);
        renderizarInfoBar(ctx);
        return;
    }

    container.classList.remove('crono-main--cards');
    // Restore original HTML if it was replaced by tarjetas view
    if (_getOrigHTML(ctx) && !container.querySelector('#' + ctx.wbsId)) {
        container.innerHTML = _getOrigHTML(ctx);
    }

    // Rendimiento: "año" itera años en vez de días para no congelar.
    const MAX_DIAS = 5000, MAX_ANCHO = 150000;
    const diasTotales = Math.min(MAX_DIAS, Math.max(1, Math.ceil((fechaFinProy - fechaInicioProy) / 86400000) + 60));
    // Escala automática según el horizonte del proyecto (el usuario puede forzarla).
    const spanDias = Math.max(1, Math.round((fechaFinProy - fechaInicioProy) / 86400000));
    if (!state.escalaManual) {
        const auto = spanDias <= 45 ? 'día' : (spanDias <= 90 ? 'semana' : (spanDias <= 500 ? 'mes' : 'año'));
        if (state.escala !== auto) state.escala = auto;
        if (sel) sel.value = state.escala;
    }
    const meses = generarMeses(fechaInicioProy, diasTotales);
    // Rendimiento: "año" itera años en vez de días para no congelar.
    const anchoDia = ({día:38,semana:12,mes:4.5,año:1.1})[state.escala] * state.zoom || 28 * state.zoom;
    const anchoTotal = Math.min(diasTotales * anchoDia, MAX_ANCHO);
    const headerHeight = state.escala === 'día' ? 60 : 40;

    // Orden único para árbol + timeline
    const ordenArbol = getOrdenArbol(elementosVisibles, ctx);

    renderizarArbolWBS(ordenArbol, elementosVisibles, headerHeight, ctx);
    container.style.setProperty('--crono-rows', String(ordenArbol.length));
    container.style.setProperty('--crono-header', headerHeight + 'px');
    renderizarTimelineSVG(ordenArbol, elementosVisibles, fechaInicioProy, diasTotales, anchoDia, meses, anchoTotal, ctx);
    renderizarInfoBar(ctx);
    actualizarZoomLabel(ctx);

    // Scroll sincronizado entre WBS y timeline
    const wbsPanel = document.getElementById(ctx.wbsId);
    const tlPanel = document.getElementById(ctx.timelineId);
    if (wbsPanel && tlPanel && !wbsPanel._scrollSynced) {
        wbsPanel._scrollSynced = true;
        let syncing = false;
        wbsPanel.addEventListener('scroll', () => {
            if (syncing) return;
            syncing = true;
            tlPanel.scrollTop = wbsPanel.scrollTop;
            syncing = false;
        });
        tlPanel.addEventListener('scroll', () => {
            if (syncing) return;
            syncing = true;
            wbsPanel.scrollTop = tlPanel.scrollTop;
            syncing = false;
        });
    }

    // Auto-centrar la línea de hoy en el timeline
    if (tlPanel) {
        const hoy = new Date();
        const offsetHoy = Math.round((hoy - fechaInicioProy) / 86400000);
        if (offsetHoy >= 0 && offsetHoy < diasTotales) {
            const xHoy = offsetHoy * anchoDia;
            const panelW = tlPanel.clientWidth;
            tlPanel.scrollLeft = Math.max(0, xHoy - panelW / 2);
        }
    }
    } catch(e) {
        console.error('[renderizarCronograma]', e);
        if (container) container.innerHTML = '<div class="u-error" style="padding:20px">⚠️ Error al renderizar el cronograma: <code>' + e.message + '</code></div>';
    }
}

function calcularInicioProyecto(elementos) {
    let min = null;
    elementos.forEach(e => {
        if (e.inicio) { const d = parseLocalDate(e.inicio); if (!min || d < min) min = d; }
    });
    return min || new Date();
}

function calcularFinProyecto(elementos) {
    let max = null;
    elementos.forEach(e => {
        if (e.tipo === 'edt') return;
        let d = null;
        if (e.inicio && e.duracion) {
            d = parseLocalDate(sumarDiasHabiles(e.inicio, e.duracion));
        } else if (e.fin) {
            d = parseLocalDate(e.fin);
        }
        if (d && (!max || d > max)) max = d;
    });
    if (!max) max = new Date(calcularInicioProyecto(elementos));
    return max;
}

function generarMeses(fechaInicio, diasTotales) {
    const meses = [];
    const fin = new Date(fechaInicio);
    fin.setDate(fin.getDate() + diasTotales);
    let c = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
    while (c <= fin) {
        const finMes = new Date(c.getFullYear(), c.getMonth() + 1, 0);
        const start = c < fechaInicio ? new Date(fechaInicio) : new Date(c);
        const end = finMes > fin ? new Date(fin) : finMes;
        meses.push({
            name: c.toLocaleString('es', { month: 'short', year: '2-digit' }),
            start,
            end
        });
        c = new Date(c.getFullYear(), c.getMonth() + 1, 1);
    }
    return meses;
}

// Número de semana ISO 8601 (la misma numeración que usan los calendarios).
function semanaISO(fecha) {
    const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
    const dia = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dia);
    const inicioAno = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - inicioAno) / 86400000 + 1) / 7);
}

// ─── ORDEN COMPARTIDO ÁRBOL + TIMELINE ──────────────────────────

function getOrdenArbol(elementos, ctx) {
    const state = _getState(ctx || _ctxCronograma(cronogramaActivo.panelKey));
    const orden = [];
    const incluidos = new Set();
    function anadir(e) {
        if (incluidos.has(e.id)) return;
        incluidos.add(e.id);
        orden.push(e);
    }
    function walk(parentId) {
        const hijos = elementos.filter(e => parentId === null
            ? (e.dependeDe === null || e.dependeDe === undefined)
            : e.dependeDe === parentId)
            .sort((a, b) => (a.codigo || '').localeCompare(b.codigo || ''));
        hijos.forEach(h => {
            anadir(h);
            if (h.tipo === 'edt' && !state.collapsed.has(h.id)) walk(h.id);
        });
    }
    walk(null);
    elementos.forEach(e => {
        if (incluidos.has(e.id)) return;
        anadir(e);
        if (e.tipo === 'edt' && !state.collapsed.has(e.id)) walk(e.id);
    });
    return orden;
}

// ─── ÁRBOL WBS (IZQUIERDA) ──────────────────────────────────────

function renderizarArbolWBS(orden, elementos, headerH, ctx) {
    const el = document.getElementById(ctx.wbsId);
    if (!el) return;
    const state = _getState(ctx);
    const critSet = new Set(_getCpmResult(ctx).criticalPath || []);
    let html = `<div class="wbs-header" role="presentation" style="height:${headerH}px">
        <span class="wbs-header-label" aria-hidden="true">Actividad</span>
        <span class="wbs-header-dur" aria-hidden="true">Dur.</span>
    </div>`;
    orden.forEach(elem => {
        const depth = calcularProfundidad(elem.id, elementos);
        const esCritico = critSet.has(elem.id);
        const sel = state.selectedId === elem.id ? 'wbs-selected' : '';
        const colapsado = state.collapsed.has(elem.id);
        const tieneHijos = elem.tipo === 'edt' && elementos.some(x => x.dependeDe === elem.id);

        html += `<div class="wbs-item ${sel}" data-id="${elem.id}" data-type="${elem.tipo}" tabindex="0" role="treeitem" aria-level="${depth + 1}" aria-selected="${sel ? 'true' : 'false'}" style="padding-left:${12 + depth * 16}px">`;
        if (tieneHijos) {
            html += `<span class="wbs-toggle" data-id="${elem.id}" role="button" tabindex="0" aria-expanded="${colapsado ? 'false' : 'true'}" aria-label="${colapsado ? 'Expandir' : 'Colapsar'} ${escapeHtml(elem.nombre)}">${colapsado ? '▸' : '▾'}</span>`;
        } else {
            html += `<span class="wbs-toggle-placeholder" aria-hidden="true"></span>`;
        }
        html += `<span class="wbs-dot" aria-hidden="true"></span>`;
        const codigo = elem.codigo || (typeof obtenerCodigoElemento === 'function' ? obtenerCodigoElemento(elem, elementos) : '') || '';
        html += `<span class="wbs-code">${escapeHtml(codigo)}</span>`;
        // El nombre puede venir ya numerado ("1.2 Análisis"); la columna de
        // código muestra esa jerarquía, así que se evita duplicarla.
        const nombreVisible = String(elem.nombre || '').replace(/^\s*\d+(?:\.\d+)*[.)]?\s+/, '') || elem.nombre;
        html += `<span class="wbs-name ${esCritico ? 'wbs-critical' : ''}">${escapeHtml(nombreVisible)}</span>`;
        const durTxt = elem.tipoDuracion === 'horas' && elem.duracionHoras
            ? elem.duracionHoras + 'h'
            : (elem.duracion > 0 ? (elem.duracion < 1 ? (Math.round(elem.duracion * 100) / 100) + 'd' : elem.duracion + 'd') : (elem.tipo === 'hito' ? 'Hito' : '—'));
        const fin = elem.duracion > 0
            ? (elem.tipo === 'edt' ? sumarDias(elem.inicio, elem.duracion) : sumarDiasHabiles(elem.inicio, elem.duracion))
            : (elem.fin || elem.inicio || '');
        const dateTitle = elem.inicio
            ? `Inicio: ${formatearFechaEspa(elem.inicio)} · Fin: ${formatearFechaEspa(fin || elem.inicio)}`
            : 'Sin fechas';
        html += `<span class="wbs-dur" title="${escapeHtml(dateTitle)}">${escapeHtml(durTxt)}</span>`;
        if (esCritico) html += `<span class="wbs-badge-crit">CP</span>`;
        html += `</div>`;
    });
    el.innerHTML = html;
    el.setAttribute('role', 'tree');
    el.setAttribute('aria-label', 'Estructura de desglose del trabajo');
    el.querySelectorAll('.wbs-toggle').forEach(btn => {
        const toggle = function(e) {
            e.stopPropagation();
            e.preventDefault();
            const id = parseInt(this.dataset.id);
            if (state.collapsed.has(id)) state.collapsed.delete(id);
            else state.collapsed.add(id);
            renderizarCronograma(ctx);
        };
        btn.onclick = toggle;
        btn.onkeydown = function(e) { if (e.key === 'Enter' || e.key === ' ') toggle.call(this, e); };
    });
    el.querySelectorAll('.wbs-item').forEach(item => {
        const select = function() {
            const id = parseInt(this.dataset.id);
            const elem = (proyecto[ctx.dataKey] || []).find(x => x.id === id);
            state.selectedId = id;
            el.querySelectorAll('.wbs-item').forEach(x => x.classList.remove('wbs-selected'));
            this.classList.add('wbs-selected');
            resaltarBarraEnTimeline(id, ctx);
            if (elem) mostrarDetalleElemento(elem);
        };
        item.onclick = select;
        item.onkeydown = function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select.call(this); }
        };
    });
    // Doble clic → editar (solo no-EDT; EDTs tienen su propio manejador en edt-panel.js)
    el.querySelectorAll('.wbs-item[data-type="actividad"], .wbs-item[data-type="entregable"], .wbs-item[data-type="hito"]').forEach(item => {
        item.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            editarElementoGantt(parseInt(this.dataset.id));
        });
    });
    // Context menu (clic derecho)
    el.querySelectorAll('.wbs-item').forEach(item => {
        item.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            const tipo = this.dataset.type;
            mostrarContextMenu(id, tipo, e.clientX, e.clientY);
        });
    });
}

function calcularProfundidad(id, elementos) {
    if (typeof calcularProfundidadSegura === 'function') {
        return calcularProfundidadSegura(id, elementos, 'dependeDe');
    }
    const vistos = new Set([id]);
    let depth = 0;
    let e = (elementos || []).find(x => x.id === id);
    while (e && e.dependeDe && !vistos.has(e.dependeDe)) {
        vistos.add(e.dependeDe);
        depth++;
        e = elementos.find(x => x.id === e.dependeDe);
    }
    return depth;
}

function resaltarBarraEnTimeline(id, ctx) {
    ctx = ctx || _ctxCronograma(cronogramaActivo.panelKey);
    const svg = document.getElementById(ctx.svgId);
    if (!svg) return;
    svg.querySelectorAll('.crono-bar-wrapper').forEach(b => b.classList.remove('bar-selected'));
    svg.querySelectorAll(`.crono-bar-wrapper[data-id="${id}"]`).forEach(b => b.classList.add('bar-selected'));
}

// ─── CONTEXT MENU WBS ────────────────────────────────────────────

function mostrarContextMenu(id, tipo, x, y) {
    const menu = document.getElementById('cronoContextMenu');
    if (!menu) return;
    cerrarContextMenu();

    const esEdt = tipo === 'edt';
    let html = '';
    html += `<button class="ctx-item" data-action="editar"><span></span> Editar</button>`;
    if (esEdt) {
        html += `<button class="ctx-item" data-action="anadir-hijo"><span></span> Añadir hijo</button>`;
    }
    html += `<div class="ctx-separator"></div>`;
    html += `<button class="ctx-item ctx-danger" data-action="eliminar"><span></span> Eliminar</button>`;

    menu.innerHTML = html;
    menu.style.display = 'block';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';

    // Ensure menu stays within viewport
    requestAnimationFrame(() => {
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) menu.style.left = (window.innerWidth - rect.width - 8) + 'px';
        if (rect.bottom > window.innerHeight) menu.style.top = (window.innerHeight - rect.height - 8) + 'px';
    });

    menu.querySelectorAll('.ctx-item').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.dataset.action;
            if (action === 'editar') editarElementoGantt(id);
            else if (action === 'eliminar') eliminarElementoGantt(id);
            else if (action === 'anadir-hijo') abrirModalNuevoElementoGantt(id);
            cerrarContextMenu();
        });
    });

    // Close on click outside
    setTimeout(() => {
        document.addEventListener('click', cerrarContextMenu, { once: true });
    }, 0);
}

function cerrarContextMenu() {
    const menu = document.getElementById('cronoContextMenu');
    if (menu) menu.style.display = 'none';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') cerrarContextMenu();
});

// ─── TIMELINE SVG (DERECHA) ─────────────────────────────────────

function renderizarTimelineSVG(ordenArbol, elementos, fechaInicio, diasTotales, anchoDia, meses, anchoTotal, ctx) {
    const svg = document.getElementById(ctx.svgId);
    if (!svg) return;
    const state = _getState(ctx);
    const cpmRef = _getCpmResult(ctx);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const headerHeight = state.escala === 'día' ? 60 : 40;
    const rowHeight = 34;

    const altoTotal = headerHeight + ordenArbol.length * rowHeight;
    svg.style.width = anchoTotal + 'px';
    svg.style.height = altoTotal + 'px';
    svg.setAttribute('viewBox', `0 0 ${anchoTotal} ${altoTotal}`);
    svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');

    const leftLabelWidth = 0; // labels are in the WBS tree

    let defs = `<defs>
        <marker id="arrowFS" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 7" fill="${isDark ? 'rgba(148,163,184,0.55)' : 'rgba(71,85,105,0.55)'}" style="fill:${isDark ? 'rgba(148,163,184,0.55)' : 'rgba(71,85,105,0.55)'}"/>
        </marker>
        <marker id="arrowCritical" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#FF453A" style="fill:#FF453A"/>
        </marker>
        <linearGradient id="barActividad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#3D8BFD"/><stop offset="1" stop-color="#0062CC"/>
        </linearGradient>
        <linearGradient id="barEntregable" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#34C759"/><stop offset="1" stop-color="#007A3D"/>
        </linearGradient>
        <linearGradient id="barHito" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#FFCA28"/><stop offset="1" stop-color="#B85C00"/>
        </linearGradient>
        <linearGradient id="barEdt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#94A3B8"/><stop offset="1" stop-color="#475569"/>
        </linearGradient>
        <linearGradient id="barCritico" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#FF6B60"/><stop offset="1" stop-color="#D92D20"/>
        </linearGradient>
        <filter id="barShadow" x="-20%" y="-40%" width="140%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.4" flood-color="#000" flood-opacity="${isDark ? '0.45' : '0.18'}"/>
        </filter>
    </defs>`;

    // Progreso global (se muestra en la barra de información, no sobre el lienzo)
    const tasksProg = elementos.filter(e => e.tipo !== 'edt' && e.duracion > 0);
    const totalWeight = tasksProg.reduce((s, e) => s + e.duracion, 0);
    const progPct = totalWeight > 0 ? tasksProg.reduce((s, e) => s + (e.progreso || 0) * e.duracion, 0) / totalWeight : 0;
    let gridHtml = '';

    // Grid y cabeceras según escala
    const escala = state.escala;
    const hoy = new Date();
    const offsetHoy = Math.round((hoy - fechaInicio) / 86400000);
    const hayHoy = offsetHoy >= 0 && offsetHoy < diasTotales;
    const xHoy = offsetHoy * anchoDia;
    const paleta = isDark ? {
        titulo: '#E8EEF7',
        sub: 'rgba(148,163,184,0.88)',
        subTenue: 'rgba(148,163,184,0.55)',
        linea: 'rgba(148,163,184,0.16)',
        lineaSuave: 'rgba(148,163,184,0.075)',
        finde: 'rgba(148,163,184,0.062)',
        findeDia: 'rgba(148,163,184,0.10)'
    } : {
        titulo: '#0F172A',
        sub: 'rgba(71,85,105,0.92)',
        subTenue: 'rgba(100,116,139,0.7)',
        linea: 'rgba(15,23,42,0.12)',
        lineaSuave: 'rgba(15,23,42,0.055)',
        finde: 'rgba(15,23,42,0.032)',
        findeDia: 'rgba(15,23,42,0.055)'
    };
    const FUENTE = 'Inter, system-ui, sans-serif';
    const lineaHoy = hayHoy
        ? `<line x1="${xHoy}" y1="0" x2="${xHoy}" y2="${altoTotal}" stroke="var(--color-primary,#0A84FF)" style="stroke:var(--color-primary,#0A84FF)" stroke-width="1.5" opacity="0.8"/>`
          + `<circle cx="${xHoy}" cy="3" r="2.6" fill="var(--color-primary,#0A84FF)" style="fill:var(--color-primary,#0A84FF)"/>`
        : '';

    // Fines de semana: solo cuando cada día tiene ancho suficiente.
    if (anchoDia >= 8) {
        for (let d = 0; d < diasTotales; d++) {
            const fecha = new Date(fechaInicio.getTime() + d * 86400000);
            const diaSem = fecha.getDay();
            if (diaSem === 0 || diaSem === 6) {
                const x = d * anchoDia;
                const relleno = escala === 'día' ? paleta.findeDia : paleta.finde;
                gridHtml += `<rect x="${x}" y="${headerHeight}" width="${anchoDia}" height="${altoTotal - headerHeight}" fill="${relleno}" style="fill:${relleno}" stroke="none"/>`;
            }
        }
    }

    if (escala === 'día') {
        // Tres filas: mes · día de la semana · número de día.
        meses.forEach(m => {
            const x = ((m.start - fechaInicio) / 86400000) * anchoDia;
            const w = ((m.end.getTime() + 86400000 - m.start) / 86400000) * anchoDia;
            const centro = x + w / 2;
            gridHtml += `<text x="${centro}" y="17" font-size="11" fill="${paleta.titulo}" style="fill:${paleta.titulo}" font-family="${FUENTE}" text-anchor="middle" font-weight="600">${m.name}</text>`;
            gridHtml += `<line x1="${x}" y1="26" x2="${x}" y2="${altoTotal}" stroke="${paleta.linea}" style="stroke:${paleta.linea}" stroke-width="1"/>`;
        });
        gridHtml += `<line x1="0" y1="26" x2="${anchoTotal}" y2="26" stroke="${paleta.linea}" style="stroke:${paleta.linea}" stroke-width="1"/>`;
        const diasSem = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
        for (let d = 0; d < diasTotales; d++) {
            const x = d * anchoDia;
            const centro = x + anchoDia / 2;
            const fecha = new Date(fechaInicio.getTime() + d * 86400000);
            const diaSem = fecha.getDay();
            const esFinde = diaSem === 0 || diaSem === 6;
            const color = esFinde ? paleta.subTenue : paleta.sub;
            gridHtml += `<text x="${centro}" y="42" font-size="10" fill="${color}" style="fill:${color}" font-family="${FUENTE}" text-anchor="middle" font-weight="600">${diasSem[diaSem]}</text>`;
            gridHtml += `<text x="${centro}" y="56" font-size="10.5" fill="${esFinde ? paleta.subTenue : paleta.titulo}" style="fill:${esFinde ? paleta.subTenue : paleta.titulo}" font-family="${FUENTE}" text-anchor="middle" font-weight="500">${fecha.getDate()}</text>`;
            gridHtml += `<line x1="${x}" y1="26" x2="${x}" y2="${altoTotal}" stroke="${paleta.lineaSuave}" style="stroke:${paleta.lineaSuave}" stroke-width="1"/>`;
        }
    } else if (escala === 'semana') {
        // Mes arriba, semana ISO abajo.
        meses.forEach(m => {
            const x = ((m.start - fechaInicio) / 86400000) * anchoDia;
            const w = ((m.end.getTime() + 86400000 - m.start) / 86400000) * anchoDia;
            const centro = x + w / 2;
            gridHtml += `<text x="${centro}" y="16" font-size="10.5" fill="${paleta.titulo}" style="fill:${paleta.titulo}" font-family="${FUENTE}" text-anchor="middle" font-weight="600">${m.name}</text>`;
            gridHtml += `<line x1="${x}" y1="26" x2="${x}" y2="${altoTotal}" stroke="${paleta.linea}" style="stroke:${paleta.linea}" stroke-width="1"/>`;
        });
        gridHtml += `<line x1="0" y1="26" x2="${anchoTotal}" y2="26" stroke="${paleta.linea}" style="stroke:${paleta.linea}" stroke-width="1"/>`;
        const primerLunes = (8 - fechaInicio.getDay()) % 7;
        if (primerLunes > 0) {
            // Semana incompleta inicial: etiqueta en el borde izquierdo.
            gridHtml += `<text x="4" y="37" font-size="9.5" fill="${paleta.subTenue}" style="fill:${paleta.subTenue}" font-family="${FUENTE}" font-weight="600">S${semanaISO(fechaInicio)}</text>`;
        }
        for (let d = primerLunes; d < diasTotales; d += 7) {
            const x = d * anchoDia;
            const fechaSem = new Date(fechaInicio.getTime() + d * 86400000);
            gridHtml += `<line x1="${x}" y1="26" x2="${x}" y2="${altoTotal}" stroke="${paleta.lineaSuave}" style="stroke:${paleta.lineaSuave}" stroke-width="1"/>`;
            gridHtml += `<text x="${x + 4}" y="37" font-size="9.5" fill="${paleta.sub}" style="fill:${paleta.sub}" font-family="${FUENTE}" font-weight="600">S${semanaISO(fechaSem)}</text>`;
        }
    } else if (escala === 'año') {
        // Año arriba, trimestres abajo.
        const yearStart = fechaInicio.getFullYear();
        const yearEnd = new Date(fechaInicio.getTime() + diasTotales * 86400000).getFullYear();
        for (let yr = yearStart; yr <= yearEnd; yr++) {
            const xYear = Math.max(0, ((new Date(yr, 0, 1) - fechaInicio) / 86400000) * anchoDia);
            gridHtml += `<line x1="${xYear}" y1="26" x2="${xYear}" y2="${altoTotal}" stroke="${paleta.linea}" style="stroke:${paleta.linea}" stroke-width="1.5"/>`;
            gridHtml += `<text x="${xYear + 6}" y="16" font-size="11" fill="${paleta.titulo}" style="fill:${paleta.titulo}" font-family="${FUENTE}" font-weight="700">${yr}</text>`;
            for (let q = 0; q < 4; q++) {
                const qStart = new Date(yr, q * 3, 1);
                const qEnd = new Date(yr, (q + 1) * 3, 0);
                const x = Math.max(0, ((qStart - fechaInicio) / 86400000) * anchoDia);
                const w = Math.max(1, ((qEnd.getTime() + 86400000 - Math.max(fechaInicio.getTime(), qStart.getTime())) / 86400000) * anchoDia);
                if (x >= anchoTotal) break;
                const centro = x + w / 2;
                gridHtml += `<text x="${centro}" y="37" font-size="10" fill="${paleta.sub}" style="fill:${paleta.sub}" font-family="${FUENTE}" text-anchor="middle" font-weight="600">Q${q + 1}</text>`;
                gridHtml += `<line x1="${x}" y1="26" x2="${x}" y2="${altoTotal}" stroke="${paleta.lineaSuave}" style="stroke:${paleta.lineaSuave}" stroke-width="0.5"/>`;
            }
        }
        gridHtml += `<line x1="0" y1="26" x2="${anchoTotal}" y2="26" stroke="${paleta.linea}" style="stroke:${paleta.linea}" stroke-width="1"/>`;
    } else {
        // Vista de mes: una sola fila centrada.
        meses.forEach(m => {
            const x = ((m.start - fechaInicio) / 86400000) * anchoDia;
            const w = ((m.end.getTime() + 86400000 - m.start) / 86400000) * anchoDia;
            const centro = x + w / 2;
            gridHtml += `<text x="${centro}" y="${headerHeight / 2 + 4}" font-size="11" fill="${paleta.titulo}" style="fill:${paleta.titulo}" font-family="${FUENTE}" text-anchor="middle" font-weight="600">${m.name}</text>`;
            gridHtml += `<line x1="${x}" y1="0" x2="${x}" y2="${altoTotal}" stroke="${paleta.linea}" style="stroke:${paleta.linea}" stroke-width="1"/>`;
        });
        if (anchoDia >= 6) {
            for (let d = 0; d < diasTotales; d += 7) {
                const x = d * anchoDia;
                gridHtml += `<line x1="${x}" y1="0" x2="${x}" y2="${altoTotal}" stroke="${paleta.lineaSuave}" style="stroke:${paleta.lineaSuave}" stroke-width="1"/>`;
            }
        }
    }
    gridHtml += lineaHoy;

    // Separadores de fila y borde inferior de la cabecera
    const rowLineColor = isDark ? 'rgba(148,163,184,0.055)' : 'rgba(15,23,42,0.05)';
    const headerLineColor = isDark ? 'rgba(148,163,184,0.20)' : 'rgba(15,23,42,0.12)';
    for (let i = 0; i <= ordenArbol.length; i++) {
        const yLine = headerHeight + i * rowHeight;
        gridHtml += `<line x1="0" y1="${yLine}" x2="${anchoTotal}" y2="${yLine}" stroke="${rowLineColor}" stroke-width="1"/>`;
    }
    gridHtml += `<line x1="0" y1="${headerHeight}" x2="${anchoTotal}" y2="${headerHeight}" stroke="${headerLineColor}" stroke-width="1"/>`;

    // Barras de tareas
    const critSet = new Set(cpmRef.criticalPath || []);
    const lineaBaseActiva = state.lineaBaseVisible != null
        ? (proyecto.lineasBase || []).find(lb => lb.id === state.lineaBaseVisible) || null
        : null;
    let barsHtml = '', connectionsHtml = '';
    const barPositions = {};
    const dayUsage = {}; // acumula píxeles usados por día para desplazar tareas intra-día

    ordenArbol.forEach((elem, idx) => {
        if (!elem.inicio) return;
        const y = headerHeight + idx * rowHeight + rowHeight / 2;
        const startDate = parseLocalDate(elem.inicio);
        const startOffset = Math.max(0, Math.round((startDate - fechaInicio) / 86400000));
        const w = Math.max(elem.duracion > 0 ? (() => {
            const endStr = sumarDiasHabiles(elem.inicio, elem.duracion);
            const endDate = parseLocalDate(endStr);
            const calDays = endDate ? Math.round((endDate - startDate) / 86400000) : elem.duracion;
            return Math.max(calDays, elem.duracion) * anchoDia;
        })() : 8, 4);
        const dayKey = startOffset;
        // Desplazar la barra si tiene predecesores FS que terminan el mismo día
        const hasSameDayFS = elem.tipo !== 'hito' && elem.predecesores && elem.predecesores.some(p => {
            const pred = (proyecto[ctx.dataKey] || []).find(x => x.id === p.id);
            if (!pred || !pred.inicio || pred.tipo === 'hito') return false;
            if (p.tipo && p.tipo !== 'FS') return false;
            const predEndStr = sumarDiasHabiles(pred.inicio, pred.duracion);
            const predEndDay = Math.round((parseLocalDate(predEndStr) - fechaInicio) / 86400000);
            return predEndDay === dayKey;
        });
        const intraShift = hasSameDayFS ? (dayUsage[dayKey] || 0) : 0;
        dayUsage[dayKey] = (dayUsage[dayKey] || 0) + w;
        const x = startOffset * anchoDia + intraShift;
        const esCritico = critSet.has(elem.id);
        const gradMap = { actividad: 'barActividad', entregable: 'barEntregable', hito: 'barHito', edt: 'barEdt' };
        const gradId = esCritico ? 'barCritico' : (gradMap[elem.tipo] || 'barActividad');
        const solidMap = { barActividad: '#007AFF', barEntregable: '#00A859', barHito: '#FFB300', barEdt: '#64748B', barCritico: '#E74C3C' };
        const solidColor = solidMap[gradId];

        const isHito = elem.tipo === 'hito';
        const barH = isHito ? 12 : 18;
        const barY = y - barH / 2;
        const barW = Math.max(w, isHito ? 12 : 6);
        const radius = isHito ? 3 : 5;

        barPositions[elem.id] = { x, y: y - 9, w: barW, h: 18, id: elem.id };

        const fechaFin = elem.duracion > 0 ? sumarDiasHabiles(elem.inicio, elem.duracion) : (elem.fin || elem.inicio);
        const tooltip = `${elem.nombre} · ${formatearFechaEspa(elem.inicio)} → ${formatearFechaEspa(fechaFin)}${elem.progreso ? ' · ' + elem.progreso + '%' : ''}${esCritico ? ' · Ruta crítica' : ''}`;

        barsHtml += `<g class="crono-bar-wrapper" data-id="${elem.id}" role="img" aria-label="${escapeHtml(tooltip)}">`;
        barsHtml += `<title>${escapeHtml(tooltip)}</title>`;

        if (lineaBaseActiva) {
            const be = lineaBaseActiva.elementos.find(x => x.id === elem.id);
            if (be && be.inicio) {
                const baseStartDate = parseLocalDate(be.inicio);
                const baseStartOffset = Math.max(0, Math.round((baseStartDate - fechaInicio) / 86400000));
                const baseW = Math.max(be.duracion > 0 ? (() => {
                    const endStr = sumarDiasHabiles(be.inicio, be.duracion);
                    const endDate = parseLocalDate(endStr);
                    const calDays = endDate ? Math.round((endDate - baseStartDate) / 86400000) : be.duracion;
                    return Math.max(calDays, be.duracion) * anchoDia;
                })() : 8, 4);
                const baseX = baseStartOffset * anchoDia;
                barsHtml += `<rect class="crono-bar-base" data-id="${elem.id}" x="${baseX}" y="${barY - 9}" width="${Math.max(baseW, 8)}" height="3" rx="1.5" fill="none" stroke="#FFB300" stroke-width="1.5" stroke-dasharray="3,2" opacity="0.9"/>`;
            }
        }

        if (isHito) {
            // Hito: rombo centrado en la fecha de inicio
            const cx = x + 6;
            barsHtml += `<path class="crono-bar crono-bar-hito" d="M ${cx} ${y - 9} L ${cx + 9} ${y} L ${cx} ${y + 9} L ${cx - 9} ${y} Z" fill="url(#${gradId})" stroke="${isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.20)'}" stroke-width="1" filter="url(#barShadow)"/>`;
        } else {
            // Pista de la barra
            barsHtml += `<rect class="crono-bar" x="${x}" y="${barY}" width="${barW}" height="${barH}" rx="${radius}" fill="url(#${gradId})" opacity="${isDark ? 0.28 : 0.20}" stroke="${solidColor}" stroke-opacity="${isDark ? 0.35 : 0.40}" stroke-width="1" filter="url(#barShadow)"/>`;

            // Progreso
            if (elem.progreso > 0) {
                const pw = Math.max(barW * (elem.progreso / 100), 4);
                barsHtml += `<rect class="crono-bar-progress" x="${x}" y="${barY}" width="${Math.min(pw, barW)}" height="${barH}" rx="${radius}" fill="url(#${gradId})"/>`;
            }

            // Remates inferiores: convención de barra resumen para las EDT.
            if (elem.tipo === 'edt') {
                const cap = 5;
                barsHtml += `<path d="M ${x} ${barY + barH} L ${x + cap} ${barY + barH} L ${x} ${barY + barH + cap} Z" fill="${solidColor}" opacity="0.85"/>`;
                barsHtml += `<path d="M ${x + barW} ${barY + barH} L ${x + barW - cap} ${barY + barH} L ${x + barW} ${barY + barH + cap} Z" fill="${solidColor}" opacity="0.85"/>`;
            }
        }

        // Barra real (fechas reales)
        if (elem.inicioReal) {
            const realStartDate = parseLocalDate(elem.inicioReal);
            if (realStartDate) {
                const realStartOffset = Math.max(0, Math.round((realStartDate - fechaInicio) / 86400000));
                const realX = realStartOffset * anchoDia;
                let realEndStr = null;
                if (elem.finReal) {
                    realEndStr = elem.finReal;
                } else if (elem.duracionReal) {
                    realEndStr = sumarDiasHabiles(elem.inicioReal, elem.duracionReal);
                } else if (elem.duracion > 0) {
                    realEndStr = sumarDiasHabiles(elem.inicioReal, elem.duracion);
                }
                let realWidth = 4;
                if (realEndStr) {
                    const realEndDate = parseLocalDate(realEndStr);
                    if (realEndDate) {
                        const realCalDays = Math.round((realEndDate - realStartDate) / 86400000);
                        realWidth = Math.max(realCalDays * anchoDia, 4);
                    }
                }
                const planEndDate = parseLocalDate(fechaFin);
                const realEndParsed = realEndStr ? parseLocalDate(realEndStr) : null;
                const esTarde = realEndParsed && planEndDate && realEndParsed > planEndDate;
                const realColor = elem.finReal ? (esTarde ? '#E74C3C' : '#00A859') : '#FFB300';
                const realBarH = 4;
                const realBarY = barY + barH + 3;
                barsHtml += `<rect x="${realX}" y="${realBarY}" width="${Math.max(realWidth, 4)}" height="${realBarH}" rx="2" fill="${realColor}" opacity="0.9"/>`;
                if (realEndStr && anchoDia >= 14) {
                    barsHtml += `<text x="${realX + Math.max(realWidth, 4) + 4}" y="${realBarY + realBarH}" font-size="9" font-weight="500" fill="${isDark ? 'rgba(255,255,255,0.55)' : 'rgba(15,23,42,0.60)'}" font-family="var(--font-sans, Inter, system-ui)" text-anchor="start">${escapeHtml(formatearFechaEspa(realEndStr))}</text>`;
                }
            }
        }

        // Handle de arrastre para dependencias
        if (elem.tipo !== 'hito') {
            barsHtml += `<circle class="crono-drag-handle" data-id="${elem.id}" cx="${x + barW}" cy="${y}" r="5" fill="${solidColor}" opacity="0" cursor="crosshair"/>`;
        }

        barsHtml += `</g>`;
    });

    // Flechas de dependencia
    ordenArbol.forEach(elem => {
        if (!elem.predecesores || elem.predecesores.length === 0 || !barPositions[elem.id]) return;
        elem.predecesores.forEach(p => {
            const from = barPositions[p.id];
            const to = barPositions[elem.id];
            if (!from || !to) return;
            const esCrit = critSet.has(elem.id) && critSet.has(p.id);
            const marker = esCrit ? 'url(#arrowCritical)' : 'url(#arrowFS)';
            const x1 = from.x + from.w;
            const y1 = from.y + from.h / 2;
            const x2 = to.x;
            const y2 = to.y + to.h / 2;
            const midX = (x1 + x2) / 2;
            const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
            connectionsHtml += `<path d="${path}" fill="none" style="fill:none" stroke="${esCrit ? '#FF453A' : (isDark ? 'rgba(148,163,184,0.55)' : 'rgba(71,85,105,0.55)')}" stroke-width="${esCrit ? 1.6 : 1.2}" marker-end="${marker}" class="crono-arrow" data-from="${p.id}" data-to="${elem.id}"/>`;
        });
    });

    console.debug('[gantt] SVG render | elementos:', elementos.length, '| con inicio:', elementos.filter(e => e.inicio && e.inicio.length > 0).length, '| sin inicio:', elementos.filter(e => !e.inicio || e.inicio.length === 0).map(e => e.tipo + ':' + e.nombre));
    console.debug('[gantt] barras dibujadas:', ordenArbol.filter(e => e.inicio).length, '| skip (sin fecha):', ordenArbol.filter(e => !e.inicio).map(e => e.tipo + ':' + e.nombre));

    svg.innerHTML = defs + gridHtml + connectionsHtml + barsHtml;

    // Eventos SVG para drag-to-connect y hover
    svg.querySelectorAll('.crono-drag-handle').forEach(h => {
        h.addEventListener('mouseenter', function() { this.setAttribute('opacity', '0.6'); });
        h.addEventListener('mouseleave', function() { if (!state.editandoDependencia) this.setAttribute('opacity', '0'); });
        h.addEventListener('mousedown', iniciarDragDependencia);
    });

    svg.querySelectorAll('.crono-bar-wrapper').forEach(w => {
        w.addEventListener('mouseenter', function() {
            const handle = this.querySelector('.crono-drag-handle');
            if (handle && !state.editandoDependencia) handle.setAttribute('opacity', '0.6');
            this.style.filter = 'brightness(1.12)';
        });
        w.addEventListener('mouseleave', function() {
            const handle = this.querySelector('.crono-drag-handle');
            if (handle && !state.editandoDependencia) handle.setAttribute('opacity', '0');
            this.style.filter = '';
        });
    });

    // Tooltip en flechas
    svg.querySelectorAll('.crono-arrow').forEach(a => {
        a.addEventListener('mouseenter', function() {
            const from = getNombreElemento(parseInt(this.dataset.from));
            const to = getNombreElemento(parseInt(this.dataset.to));
            const toElem = (proyecto[ctx.dataKey] || []).find(e => e.id == this.dataset.to);
            const dep = toElem?.predecesores?.find(p => p.id == this.dataset.from);
            const tipo = dep ? dep.tipo : 'FS';
            const retraso = dep && dep.retraso ? ` (${dep.retraso > 0 ? '+' : ''}${dep.retraso}d)` : '';
            mostrarTooltip(this, `${from} → ${to} [${tipo}${retraso}]`);
            this.setAttribute('stroke-width', '3');
        });
        a.addEventListener('mouseleave', function() {
            ocultarTooltip();
            this.setAttribute('stroke-width', '1.5');
        });
        a.addEventListener('click', function() {
            const fromId = parseInt(this.dataset.from);
            const toId = parseInt(this.dataset.to);
            mostrarModalEditarDependencia(fromId, toId);
        });
    });
}

// ─── DRAG TO CONNECT ────────────────────────────────────────────

function iniciarDragDependencia(e) {
    e.preventDefault();
    const fromId = parseInt(this.dataset.id);
    const ctx = _ctxCronograma(cronogramaActivo.panelKey);
    const state = _getState(ctx);
    const svg = document.getElementById(ctx.svgId);
    state.editandoDependencia = true;
    state.dragPredecesor = fromId;

    const rect = svg.getBoundingClientRect();

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('id', 'dragLine');
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', 'rgba(0,122,255,0.7)');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '5,3');
    svg.appendChild(line);

    const fromBar = svg.querySelector(`.crono-bar-wrapper[data-id="${fromId}"]`);
    if (fromBar) fromBar.classList.add('bar-dragging');

    function onMove(ev) {
        const cx = ev.clientX - rect.left + svg.parentElement.scrollLeft;
        const cy = ev.clientY - rect.top + svg.parentElement.scrollTop;
        const fromEl = svg.querySelector(`.crono-bar-wrapper[data-id="${fromId}"]`);
        if (!fromEl) return;
        const fromRect = fromEl.querySelector('.crono-bar')?.getBoundingClientRect();
        if (!fromRect) return;
        const x1 = fromRect.right - rect.left + svg.parentElement.scrollLeft;
        const y1 = fromRect.top - rect.top + svg.parentElement.scrollTop + fromRect.height / 2;
        const midX = (x1 + cx) / 2;
        line.setAttribute('d', `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${cy}, ${cx} ${cy}`);

        // Hover sobre targets
        svg.querySelectorAll('.crono-bar-wrapper').forEach(w => {
            const r = w.querySelector('.crono-bar')?.getBoundingClientRect();
            if (!r) return;
            if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) {
                const id = parseInt(w.dataset.id);
                if (id !== fromId && (proyecto[ctx.dataKey] || []).find(el => el.id === id)?.tipo !== 'edt') {
                    w.classList.add('bar-target-hover');
                }
            } else {
                w.classList.remove('bar-target-hover');
            }
        });
    }

    function onUp(ev) {
        svg.removeEventListener('mousemove', onMove);
        svg.removeEventListener('mouseup', onUp);
        document.removeEventListener('mouseup', onUp);

        const target = svg.querySelector('.bar-target-hover');
        if (target) {
            const toId = parseInt(target.dataset.id);
            if (toId && toId !== fromId) {
                const elem = (proyecto[ctx.dataKey] || []).find(e => e.id === toId);
                if (elem && !elem.predecesores?.some(p => p.id === fromId)) {
                    mostrarModalTipoDependencia(fromId, toId);
                }
            }
        }

        const dragLine = svg.querySelector('#dragLine');
        if (dragLine) dragLine.remove();
        svg.querySelectorAll('.bar-dragging, .bar-target-hover').forEach(el => {
            el.classList.remove('bar-dragging', 'bar-target-hover');
        });
        state.editandoDependencia = false;
        state.dragPredecesor = null;
    }

    svg.addEventListener('mousemove', onMove);
    svg.addEventListener('mouseup', onUp);
    document.addEventListener('mouseup', onUp);
}

// ─── MODAL TIPO DEPENDENCIA ─────────────────────────────────────

const _TIPO_DEP_DESC = {
    FS: 'Final → Inicio: B empieza cuando A termina',
    SS: 'Inicio → Inicio: B empieza cuando A empieza',
    FF: 'Final → Final: B termina cuando A termina',
    SF: 'Inicio → Final: B termina cuando A empieza'
};

let _depCallback = null;

function mostrarModalTipoDependencia(fromId, toId) {
    const fromName = getNombreElemento(fromId);
    const toName = getNombreElemento(toId);
    const existing = document.getElementById('genericModal');
    if (existing) existing.remove();

    const html = `
        <div class="modal-content modal-500">
            <div class="modal-header">
                <h3> Tipo de Dependencia</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div style="padding:16px;">
                <div style="margin-bottom:16px;font-size:13px;color:var(--text-muted);">
                    <strong>${escapeHtml(fromName)}</strong> ← <strong>${escapeHtml(toName)}</strong>
                </div>
                <div class="form-group">
                    <label>Tipo de dependencia:</label>
                    <select id="depTipoSelect" class="u-input" onchange="actualizarDescDep()">
                        <option value="FS">Final → Inicio (FS)</option>
                        <option value="SS">Inicio → Inicio (SS)</option>
                        <option value="FF">Final → Final (FF)</option>
                        <option value="SF">Inicio → Final (SF)</option>
                    </select>
                    <div id="depDesc" style="font-size:12px;color:var(--text-muted);margin-top:6px;">${_TIPO_DEP_DESC['FS']}</div>
                </div>
                <div class="form-group">
                    <label>Días de retraso (positivo) / adelanto (negativo):</label>
                    <input type="number" id="depRetraso" class="u-input" value="0" style="width:120px;">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="cerrarModalGeneric()">Cancelar</button>
                <button class="btn btn-primary" onclick="confirmarDependencia(${fromId}, ${toId})">Crear Dependencia</button>
            </div>
        </div>`;

    const div = document.createElement('div');
    div.id = 'genericModal';
    div.className = 'modal';
    div.style.display = 'flex';
    div.innerHTML = html;
    document.body.appendChild(div);
    div.onclick = (e) => { if (e.target === div) cerrarModalGeneric(); };
    window.actualizarDescDep = function() {
        const sel = document.getElementById('depTipoSelect');
        const desc = document.getElementById('depDesc');
        if (sel && desc) desc.textContent = _TIPO_DEP_DESC[sel.value] || '';
    };
    window.confirmarDependencia = function(fId, tId) {
        const tipo = document.getElementById('depTipoSelect').value;
        const retraso = parseInt(document.getElementById('depRetraso').value) || 0;
        crearDependencia(fId, tId, tipo, retraso);
        cerrarModalGeneric();
    };
}

function crearDependencia(fromId, toId, tipo, retraso) {
    const elementos = proyecto[cronogramaActivo.dataKey] || [];
    const elem = elementos.find(e => e.id === toId);
    if (!elem) return;
    if (typeof creariaCicloWBS === 'function' && creariaCicloWBS(elementos, toId, fromId, 'predecesores')) {
        mostrarToast(' Dependencia rechazada: crearía un ciclo en la red', 'error');
        return;
    }
    if (!elem.predecesores) elem.predecesores = [];
    if (elem.predecesores.some(p => p.id === fromId)) return;
    elem.predecesores.push({ id: fromId, tipo, retraso });
    autoScheduler(proyecto[cronogramaActivo.dataKey]);
    guardarProyecto();
    renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
    mostrarToast(` Dependencia ${tipo} creada`, 'success');
}

// ─── AUTO-SCHEDULER ─────────────────────────────────────────────

function autoScheduler(arr) {
    const elementos = arr || (proyecto[cronogramaActivo.dataKey] || []);
    if (!elementos || !elementos.length) return;
    const ids = new Set(elementos.map(e => e.id));
    const tasks = elementos.filter(e => e.tipo !== 'edt');
    const adj = {}, inDeg = {};
    tasks.forEach(t => { adj[t.id] = []; inDeg[t.id] = 0; });
    tasks.forEach(t => {
        (t.predecesores || []).forEach(p => {
            if (ids.has(p.id) && adj[p.id]) {
                adj[p.id].push(t.id);
                inDeg[t.id] = (inDeg[t.id] || 0) + 1;
            }
        });
    });
    const orden = [];
    const q = tasks.filter(t => (inDeg[t.id] || 0) === 0).map(t => t.id);
    while (q.length) {
        const n = q.shift();
        orden.push(n);
        (adj[n] || []).forEach(s => { inDeg[s]--; if (inDeg[s] === 0) q.push(s); });
    }
    if (orden.length !== tasks.length) {
        console.warn('[autoScheduler] Red con ciclos: no se reprograma');
        if (typeof mostrarToast === 'function') mostrarToast('No se puede reprogramar: hay dependencias circulares', 'error');
        return;
    }
    const duracion = {};
    tasks.forEach(t => { duracion[t.id] = t.duracion || 0; });
    // Fecha del proyecto: la más temprana entre todas las tareas
    let proyInicio = null;
    tasks.forEach(t => {
        if (t.inicio) {
            const d = parseLocalDate(t.inicio);
            if (!proyInicio || d < proyInicio) proyInicio = d;
        }
    });
    if (!proyInicio) proyInicio = new Date();
    // La fecha manual es el punto de partida; las dependencias pueden
    // retrasarla o adelantarla (leads FF/SF negativos).
    const taskDate = {};
    tasks.forEach(t => {
        taskDate[t.id] = t.inicio ? parseLocalDate(t.inicio) : new Date(proyInicio);
    });
    const fechaCalculada = {};
    orden.forEach(id => {
        const t = tasks.find(x => x.id === id);
        if (!t) return;
        (t.predecesores || []).forEach(p => {
            if (!ids.has(p.id) || !taskDate[p.id]) return;
            let nuevaFecha = new Date(taskDate[p.id]);
            const tipo = String(p.tipo || 'FS').trim().toUpperCase();
            if (tipo === 'FS') {
                nuevaFecha = parseLocalDate(sumarDiasHabiles(formatLocalDate(nuevaFecha), duracion[p.id]));
            } else if (tipo === 'SS') {
                // Misma fecha de inicio
            } else if (tipo === 'FF') {
                const finPred = parseLocalDate(sumarDiasHabiles(formatLocalDate(nuevaFecha), duracion[p.id]));
                const iniSucesor = parseLocalDate(sumarDiasHabiles(formatLocalDate(finPred), -duracion[id]));
                nuevaFecha = iniSucesor || finPred;
            } else if (tipo === 'SF') {
                const iniSucesor = parseLocalDate(sumarDiasHabiles(formatLocalDate(nuevaFecha), -duracion[id]));
                nuevaFecha = iniSucesor || nuevaFecha;
            }
            if (p.retraso) {
                nuevaFecha = parseLocalDate(sumarDiasHabiles(formatLocalDate(nuevaFecha), p.retraso));
            }
            // Con varios predecesores prevalece la restricción más tardía.
            if (nuevaFecha && (fechaCalculada[id] === undefined || nuevaFecha > fechaCalculada[id])) {
                fechaCalculada[id] = new Date(nuevaFecha);
            }
        });
        if (fechaCalculada[id] !== undefined) taskDate[id] = new Date(fechaCalculada[id]);
    });
    tasks.forEach(t => {
        const fecha = fechaCalculada[t.id] || taskDate[t.id] || proyInicio;
        const fechaStr = formatLocalDate(siguienteDiaHabil(fecha));
        if (t.inicio !== fechaStr) t.inicio = fechaStr;
    });
}

// ─── MODAL EDITAR DEPENDENCIA ──────────────────────────────────

function mostrarModalEditarDependencia(fromId, toId) {
    const fromName = getNombreElemento(fromId);
    const toName = getNombreElemento(toId);
    const elem = (proyecto[cronogramaActivo.dataKey] || []).find(e => e.id === toId);
    const dep = elem?.predecesores?.find(p => p.id === fromId);
    if (!dep) return;
    const existing = document.getElementById('genericModal');
    if (existing) existing.remove();

    const html = `
        <div class="modal-content modal-500">
            <div class="modal-header">
                <h3> Editar Dependencia</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div style="padding:16px;">
                <div style="margin-bottom:16px;font-size:13px;color:var(--text-muted);">
                    <strong>${escapeHtml(fromName)}</strong> ← <strong>${escapeHtml(toName)}</strong>
                </div>
                <div class="form-group">
                    <label>Tipo de dependencia:</label>
                    <select id="depEditTipo" class="u-input" onchange="actualizarDescDepEdit()">
                        <option value="FS" ${dep.tipo === 'FS' ? 'selected' : ''}>Final → Inicio (FS)</option>
                        <option value="SS" ${dep.tipo === 'SS' ? 'selected' : ''}>Inicio → Inicio (SS)</option>
                        <option value="FF" ${dep.tipo === 'FF' ? 'selected' : ''}>Final → Final (FF)</option>
                        <option value="SF" ${dep.tipo === 'SF' ? 'selected' : ''}>Inicio → Final (SF)</option>
                    </select>
                    <div id="depEditDesc" style="font-size:12px;color:var(--text-muted);margin-top:6px;">${_TIPO_DEP_DESC[dep.tipo] || ''}</div>
                </div>
                <div class="form-group">
                    <label>Días de retraso / adelanto:</label>
                    <input type="number" id="depEditRetraso" class="u-input" value="${dep.retraso || 0}" style="width:120px;">
                </div>
            </div>
            <div class="modal-footer" style="display:flex;justify-content:space-between;">
                <button class="btn btn-danger" onclick="eliminarDependencia(${fromId}, ${toId})"> Eliminar</button>
                <div>
                    <button class="btn btn-secondary" onclick="cerrarModalGeneric()">Cancelar</button>
                    <button class="btn btn-primary" onclick="guardarEdicionDependencia(${fromId}, ${toId})">Guardar</button>
                </div>
            </div>
        </div>`;

    const div = document.createElement('div');
    div.id = 'genericModal';
    div.className = 'modal';
    div.style.display = 'flex';
    div.innerHTML = html;
    document.body.appendChild(div);
    div.onclick = (e) => { if (e.target === div) cerrarModalGeneric(); };
    window.actualizarDescDepEdit = function() {
        const sel = document.getElementById('depEditTipo');
        const desc = document.getElementById('depEditDesc');
        if (sel && desc) desc.textContent = _TIPO_DEP_DESC[sel.value] || '';
    };
    window.guardarEdicionDependencia = function(fId, tId) {
        const tipo = document.getElementById('depEditTipo').value;
        const retraso = parseInt(document.getElementById('depEditRetraso').value) || 0;
        const e = (proyecto[cronogramaActivo.dataKey] || []).find(x => x.id === tId);
        const d = e?.predecesores?.find(p => p.id === fId);
        if (d) { d.tipo = tipo; d.retraso = retraso; }
        autoScheduler(proyecto[cronogramaActivo.dataKey]);
        guardarProyecto();
        renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
        cerrarModalGeneric();
        mostrarToast(' Dependencia actualizada', 'success');
    };
    window.eliminarDependencia = function(fId, tId) {
        const e = (proyecto[cronogramaActivo.dataKey] || []).find(x => x.id === tId);
        if (e) {
            e.predecesores = (e.predecesores || []).filter(p => p.id !== fId);
        }
        autoScheduler(proyecto[cronogramaActivo.dataKey]);
        guardarProyecto();
        renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
        cerrarModalGeneric();
        mostrarToast('Dependencia eliminada', 'info');
    };
}

// ─── INFO BAR ───────────────────────────────────────────────────

function renderizarInfoBar(ctx) {
    const el = document.getElementById(ctx.infoBarId);
    if (!el) return;
    const cpmRef = _getCpmResult(ctx);
    const critPath = cpmRef.criticalPath || [];
    const nombres = critPath.map(id => getNombreElemento(id)).filter(Boolean);
    const float = cpmRef.totalFloat || 0;
    let critDias = 0, critHoras = 0, todasHoras = true;
    critPath.forEach(id => {
        const e = (proyecto[ctx.dataKey] || []).find(x => x.id === id);
        if (!e) return;
        critDias += e.duracion || 0;
        if (e.tipoDuracion === 'horas' && e.duracionHoras) {
            critHoras += e.duracionHoras;
        } else {
            todasHoras = false;
            critHoras += (e.duracion || 0) * (e.horasDia || 8);
        }
    });
    const durStr = todasHoras && critHoras > 0
        ? critHoras + 'h'
        : critDias.toFixed(1).replace(/\.0$/, '') + 'd (' + critHoras + 'h)';
    const makespan = Number(cpmRef.makespan) || 0;
    const tareas = (proyecto[ctx.dataKey] || []).filter(e => e.tipo !== 'edt' && e.duracion > 0);
    const peso = tareas.reduce((s, e) => s + e.duracion, 0);
    const avance = peso > 0 ? Math.round(tareas.reduce((s, e) => s + (e.progreso || 0) * e.duracion, 0) / peso) : 0;
    el.innerHTML = `
        <span class="info-chip info-chip--crit" title="Ruta crítica: ${escapeHtml(nombres.join(' → ') || '—')}">
            <span class="info-dot" aria-hidden="true"></span>Ruta crítica · ${nombres.length} ${nombres.length === 1 ? 'tarea' : 'tareas'} · ${durStr}
        </span>
        ${makespan > 0 ? `<span class="info-chip" title="Makespan calculado sobre la red completa (CPM)">
            <span class="info-dot info-dot--muted" aria-hidden="true"></span>Duración de red: ${makespan.toFixed(1)} d
        </span>` : ''}
        <span class="info-chip" title="Holgura total del proyecto">
            <span class="info-dot info-dot--muted" aria-hidden="true"></span>Holgura: ${float.toFixed(1)} d
        </span>
        <span class="info-chip" title="Avance ponderado por duración">
            <span class="info-dot info-dot--success" aria-hidden="true"></span>Avance: ${avance}%
        </span>
        <span class="info-chip" title="Número de elementos del cronograma">
            <span class="info-dot info-dot--muted" aria-hidden="true"></span>${(proyecto[ctx.dataKey] || []).length} elementos
        </span>
        <span class="info-legend" aria-hidden="true">
            <span class="legend-item"><i class="legend-swatch legend-actividad"></i>Actividad</span>
            <span class="legend-item"><i class="legend-swatch legend-entregable"></i>Entregable</span>
            <span class="legend-item"><i class="legend-swatch legend-hito"></i>Hito</span>
            <span class="legend-item"><i class="legend-swatch legend-critico"></i>Crítico</span>
        </span>
    `;
}

// ─── HERRAMIENTAS ───────────────────────────────────────────────

function mostrarTooltip(el, texto) {
    let tip = document.getElementById('cronoTooltip');
    if (!tip) {
        tip = document.createElement('div');
        tip.id = 'cronoTooltip';
        document.body.appendChild(tip);
    }
    tip.textContent = texto;
    tip.style.display = 'block';
    const r = el.getBoundingClientRect();
    tip.style.left = (r.left + r.width / 2 - tip.offsetWidth / 2) + 'px';
    tip.style.top = (r.top - 30) + 'px';
}

function ocultarTooltip() {
    const tip = document.getElementById('cronoTooltip');
    if (tip) tip.style.display = 'none';
}

function zoomGantt(tipo) {
    const ctx = _ctxCronograma(cronogramaActivo.panelKey);
    const state = _getState(ctx);
    if (tipo === 'in') state.zoom = Math.min(state.zoom + 0.3, 3);
    else state.zoom = Math.max(state.zoom - 0.3, 0.4);
    actualizarZoomLabel(ctx);
    renderizarCronograma(ctx);
}

function actualizarZoomLabel(ctx) {
    const ctxLocal = ctx || _ctxCronograma(cronogramaActivo.panelKey);
    const lbl = document.getElementById(ctxLocal.zoomLabelId);
    if (lbl) lbl.textContent = Math.round(_getState(ctxLocal).zoom * 100) + '%';
}

function cambiarEscala(escala) {
    const ctx = _ctxCronograma(cronogramaActivo.panelKey);
    const state = _getState(ctx);
    state.escala = escala;
    state.escalaManual = true;
    renderizarCronograma(ctx);
}

function colapsarTodos() {
    const ctx = _ctxCronograma(cronogramaActivo.panelKey);
    const state = _getState(ctx);
    (proyecto[ctx.dataKey] || []).filter(e => e.tipo === 'edt').forEach(e => state.collapsed.add(e.id));
    renderizarCronograma(ctx);
}

function expandirTodos() {
    const ctx = _ctxCronograma(cronogramaActivo.panelKey);
    _getState(ctx).collapsed.clear();
    renderizarCronograma(ctx);
}

// ─── VISTA TARJETAS ──────────────────────────────────────────────

function toggleVistaCronograma() {
    const ctx = _ctxCronograma(cronogramaActivo.panelKey);
    const state = _getState(ctx);
    state.vista = state.vista === 'gantt' ? 'tarjetas' : 'gantt';
    state.vistaManual = true;
    renderizarCronograma(ctx);
    const btn = document.getElementById(ctx.btnToggleVistaId);
    if (btn) {
        const etiqueta = state.vista === 'gantt' ? 'Tarjetas' : 'Gantt';
        const lbl = btn.querySelector('.btn-label');
        if (lbl) lbl.textContent = etiqueta;
        else btn.textContent = etiqueta;
        btn.setAttribute('aria-pressed', state.vista === 'tarjetas' ? 'true' : 'false');
    }
}

function renderizarVistaTarjetas(elementos, ctx) {
    const container = document.getElementById(ctx.containerId);
    if (!container) return;
    const cpmRef = _getCpmResult(ctx);

    const critSet = new Set(cpmRef.criticalPath || []);
    const noEdts = elementos.filter(e => e.tipo !== 'edt');

    // Build parent lookup for grouping
    const parentEdt = {};
    noEdts.forEach(e => {
        if (e.dependeDe) {
            const p = elementos.find(x => x.id === e.dependeDe);
            parentEdt[e.id] = p ? p.id : null;
        }
    });

    // Group tasks by parent EDT
    const grupos = {};
    noEdts.forEach(e => {
        const gId = parentEdt[e.id] || 'sin-edt';
        if (!grupos[gId]) grupos[gId] = { nombre: gId === 'sin-edt' ? 'Sin EDT' : getNombreElemento(gId), items: [] };
        grupos[gId].items.push(e);
    });

    const codigoDe = (e) => e.codigo || (typeof obtenerCodigoElemento === 'function' ? obtenerCodigoElemento(e, elementos) : '') || '';

    // All EDTs sorted by depth then WBS code
    const edtsOrdenados = [...elementos.filter(e => e.tipo === 'edt')].sort((a, b) => {
        const dA = calcularProfundidad(a.id, elementos);
        const dB = calcularProfundidad(b.id, elementos);
        if (dA !== dB) return dA - dB;
        return codigoDe(a).localeCompare(codigoDe(b), 'es', { numeric: true });
    });

    const colOrder = [];
    edtsOrdenados.forEach(e => {
        if (!colOrder.includes(e.id)) colOrder.push(e.id);
        if (!grupos[e.id]) grupos[e.id] = { nombre: getNombreElemento(e.id), items: [] };
    });
    if (grupos['sin-edt']) colOrder.push('sin-edt');

    const fmt = (iso) => iso ? formatearFechaEspa(iso) : '—';
    const etiquetaTipo = { actividad: 'Actividad', entregable: 'Entregable', hito: 'Hito' };

    let html = `<div class="tv-container"><div class="tv-grid">`;

    colOrder.forEach(gId => {
        const g = grupos[gId];
        if (!g || g.items.length === 0) return;
        const nombreGrupo = String(g.nombre || '').replace(/^\s*\d+(?:\.\d+)*[.)]?\s+/, '') || g.nombre;
        const edtNombre = gId === 'sin-edt' ? 'Sin EDT' : escapeHtml(nombreGrupo);
        const n = g.items.length;
        html += `<div class="tv-group-header">
            <span class="tv-group-title">${edtNombre}</span>
            <span class="tv-group-count">${n} ${n === 1 ? 'elemento' : 'elementos'}</span>
        </div>`;
        g.items.forEach(elem => {
            const esCritico = critSet.has(elem.id);
            const pct = Math.max(0, Math.min(100, Math.round(elem.progreso || 0)));
            const nombreVisible = String(elem.nombre || '').replace(/^\s*\d+(?:\.\d+)*[.)]?\s+/, '') || elem.nombre;
            const fin = elem.duracion > 0
                ? (elem.tipo === 'edt' ? sumarDias(elem.inicio, elem.duracion) : sumarDiasHabiles(elem.inicio, elem.duracion))
                : (elem.fin || elem.inicio || '');
            const durTxt = elem.tipo === 'hito'
                ? 'Hito'
                : (elem.duracion > 0 ? `${elem.duracion}d` : '—');
            const fechas = elem.inicio ? `${fmt(elem.inicio)} → ${fmt(fin)}` : 'Sin fechas';
            // Sin aria-label: el contenido visible es el nombre accesible y
            // evita label-content-name-mismatch en lectores de pantalla.
            html += `<article class="tv-card${esCritico ? ' tv-card-critical' : ''}" data-id="${elem.id}" data-type="${elem.tipo}" tabindex="0" role="button">
                <div class="tv-card-head">
                    <span class="tv-dot tv-dot--${elem.tipo}" aria-hidden="true"></span>
                    <span class="tv-card-type">${etiquetaTipo[elem.tipo] || elem.tipo}</span>
                    ${esCritico ? '<span class="tv-badge-crit">CP</span>' : ''}
                    <span class="tv-card-id">${escapeHtml(codigoDe(elem))}</span>
                </div>
                <h3 class="tv-card-name">${escapeHtml(nombreVisible)}</h3>
                <div class="tv-card-dates">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    <span>${fechas}</span>
                    <span class="tv-card-dur">${durTxt}</span>
                </div>
                <div class="tv-card-progress">
                    <div class="tv-card-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Avance">
                        <div class="tv-card-bar-fill" style="width:${pct}%"></div>
                    </div>
                    <span class="tv-card-pct">${pct}%</span>
                </div>
                <div class="tv-card-foot">
                    <span class="tv-card-resp">${escapeHtml(elem.responsable || 'Sin responsable')}</span>
                    ${elem.costeEstimado ? `<span class="tv-card-coste">${elem.costeEstimado} ${elem.recursoAsignado?.moneda || '€'}</span>` : ''}
                </div>
            </article>`;
        });
    });
    html += `</div></div>`;

    container.classList.add('crono-main--cards');
    container.innerHTML = html;

    container.querySelectorAll('.tv-card').forEach(card => {
        const activar = function() {
            const id = parseInt(this.dataset.id);
            const elem = elementos.find(x => x.id === id);
            if (elem) mostrarDetalleElemento(elem);
        };
        card.addEventListener('click', activar);
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activar.call(this); }
        });
        card.addEventListener('dblclick', function() {
            editarElementoGantt(parseInt(this.dataset.id));
        });
        card.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mostrarContextMenu(parseInt(this.dataset.id), this.dataset.type, e.clientX, e.clientY);
        });
    });
}

function abrirModalNuevoElementoGantt(parentId) {
    const hoy = new Date().toISOString().split('T')[0];
    let edtOptions = '<option value="">-- Ninguno --</option>';
    (proyecto[cronogramaActivo.dataKey] || []).filter(e => e.tipo === 'edt').forEach(edt => {
        const sel = edt.id === parentId ? ' selected' : '';
        edtOptions += `<option value="${edt.id}"${sel}>${escapeHtml(edt.nombre)}</option>`;
    });
    let recursoOptions = '<option value="">-- Sin asignar --</option>';
    (proyecto.equipo || []).forEach(m => {
        recursoOptions += `<option value="${m.id}">${escapeHtml(m.nombre)} (${escapeHtml(m.rol || '')}) - ${m.costeHora} ${m.moneda}/h</option>`;
    });

    const html = `<div class="modal-content modal-sm">
        <div class="modal-header"><h3> Nuevo Elemento</h3><span class="close-modal" onclick="cerrarModalNuevoElemento()">&times;</span></div>
        <div class="form-group"><label>Tipo</label>
            <select id="nuevoTipo" class="u-select-glass" onchange="document.getElementById('nuevoCamposFecha').style.display=this.value==='edt'?'none':'flex';document.getElementById('nuevoMsgAuto').style.display=this.value==='edt'?'block':'none'">
                <option value="edt"> EDT</option>
                <option value="actividad"> Actividad</option>
                <option value="entregable"> Entregable</option>
                <option value="hito"> Hito</option>
            </select>
        </div>
        <div class="form-group"><label>Nombre *</label><input type="text" id="nuevoNombre" class="u-select-glass" placeholder="Ej: Diseño del módulo"></div>
        <div class="form-row" id="nuevoCamposFecha">
            <div class="form-group u-flex-1"><label> Inicio</label><input type="date" id="nuevoInicio" class="u-select-glass" value="${hoy}"></div>
            <div class="form-group u-flex-1"><label> Duración</label>
                <div style="display:flex;gap:4px">
                    <input type="number" id="nuevoDuracion" class="u-select-glass" value="5" style="flex:1">
                    <select id="nuevoTipoDuracion" class="u-select-glass" style="width:80px;flex-shrink:0" onchange="document.getElementById('nuevoHorasDiaGroup').style.display=this.value==='dias'?'':'none'">
                        <option value="dias">días</option>
                        <option value="horas">horas</option>
                    </select>
                </div>
            </div>
        </div>
        <div id="nuevoMsgAuto" style="display:none;font-size:12px;color:#666;background:rgba(0,0,0,0.05);padding:8px;border-radius:6px;margin-bottom:8px"> Fechas y duración calculadas automáticamente según las actividades hijas</div>
        <div class="form-group"><label> Recurso</label><select id="nuevoRecursoId" class="u-select-glass">${recursoOptions}</select></div>
        <div class="form-row">
            <div class="form-group u-flex-1" id="nuevoHorasDiaGroup"><label> Horas/día</label><input type="number" id="nuevoHorasDia" class="u-select-glass" value="8"></div>
            <div class="form-group u-flex-1"><label> Responsable</label><input type="text" id="nuevoResponsable" class="u-select-glass" placeholder="Nombre"></div>
        </div>
        <div class="form-group"><label> EDT padre</label><select id="nuevoDependeDe" class="u-select-glass">${edtOptions}</select></div>
        <button class="btn btn-primary" onclick="guardarNuevoElementoGantt()" style="width:100%;margin-top:16px;"> Crear</button>
    </div>`;
    let m = document.getElementById('modalNuevoElemento');
    if (m) m.remove();
    m = document.createElement('div');
    m.id = 'modalNuevoElemento';
    m.className = 'modal';
    m.style.display = 'flex';
    m.innerHTML = html;
    document.body.appendChild(m);
}

function cerrarModalNuevoElemento() {
    const m = document.getElementById('modalNuevoElemento');
    if (m) m.remove();
}

function guardarNuevoElementoGantt() {
    try {
        const nombre = document.getElementById('nuevoNombre').value.trim();
        if (!nombre) { mostrarToast('El nombre es obligatorio', 'error'); return; }
        const tipo = document.getElementById('nuevoTipo').value;
        const inicio = tipo === 'edt' ? '' : document.getElementById('nuevoInicio').value;
        if (tipo !== 'edt' && !inicio) { mostrarToast('Fecha de inicio obligatoria', 'error'); return; }
        let duracion = parseFloat(document.getElementById('nuevoDuracion').value);
        if (isNaN(duracion) || duracion < 0) duracion = 0;
        if (tipo === 'hito') duracion = 0;
        if (tipo === 'edt') duracion = 0;
        const dependeDe = parseInt(document.getElementById('nuevoDependeDe').value) || null;
        const recursoId = document.getElementById('nuevoRecursoId').value;
        const tipoDuracion = document.getElementById('nuevoTipoDuracion').value;
        const horasDia = parseInt(document.getElementById('nuevoHorasDia').value) || 8;
        // Si la duración está en horas, convertir a días para almacenamiento interno (duracion en días hábiles)
        let duracionDias = duracion;
        if (tipoDuracion === 'horas' && horasDia > 0) {
            duracionDias = duracion / horasDia;
        }
        let costeEstimado = 0, recursoInfo = null;
        if (recursoId && proyecto.equipo) {
            const r = proyecto.equipo.find(x => x.id == recursoId);
            if (r) {
                const hTot = tipoDuracion === 'horas' ? duracion : (duracion * horasDia);
                costeEstimado = hTot * r.costeHora;
                recursoInfo = { id: r.id, nombre: r.nombre, rol: r.rol, costeHora: r.costeHora, moneda: r.moneda, horasDia, horasMes: r.horasMes };
            }
        }
        const nuevo = {
            id: Date.now(), tipo, nombre, inicio, duracion: tipo === 'hito' ? 0 : duracionDias,
            duracionOriginal: tipo === 'hito' ? 0 : duracionDias,
            tipoDuracion, duracionHoras: tipoDuracion === 'horas' ? duracion : 0,
            progreso: tipo === 'hito' ? 100 : 0, responsable: document.getElementById('nuevoResponsable').value || '',
            dependeDe, recursoAsignado: recursoInfo, horasDia, costeEstimado, costeReal: 0,
            predecesores: []
        };
        if (!proyecto[cronogramaActivo.dataKey]) proyecto[cronogramaActivo.dataKey] = [];
        proyecto[cronogramaActivo.dataKey].push(nuevo);
        console.debug('[gantt] NUEVO elemento añadido:', nuevo.nombre, '| tipo:', nuevo.tipo, '| inicio:', JSON.stringify(nuevo.inicio), '| dependeDe:', nuevo.dependeDe, '| duracion:', nuevo.duracion);
        autoScheduler(proyecto[cronogramaActivo.dataKey]);
        recalcularEdtAuto();
        if (typeof registrarBitacora === 'function') registrarBitacora('elemento', nuevo.id, 'crear', null, { id: nuevo.id, nombre: nuevo.nombre, tipo: nuevo.tipo });
        guardarProyecto();
        renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
        reordenarNumeracionElementos(proyecto[cronogramaActivo.dataKey], _ctxCronograma(cronogramaActivo.panelKey));
        calcularCashflow();
        if (tipo !== 'edt' && recursoInfo?.id) {
            const r = proyecto.equipo?.find(x => x.id == recursoInfo.id);
            if (r?.email) {
                enviarNotificacionTarea(r.email, r.nombre, nuevo).then(sent => {
                    if (sent) mostrarToast(' Notificación enviada a ' + r.nombre, 'success');
                });
            }
        }
        cerrarModalNuevoElemento();
        mostrarToast(` "${nombre}" creado`, 'success');
    } catch (e) { console.error(e); mostrarToast('Error al crear', 'error'); }
}

function editarElementoGantt(id) {
    const elem = (proyecto[cronogramaActivo.dataKey] || []).find(e => e.id === id);
    if (!elem) return;
    const codigo = elem.codigo || obtenerCodigoElemento(elem, proyecto[cronogramaActivo.dataKey]) || '';
    let edtOpts = '<option value="">-- Ninguno --</option>';
    (proyecto[cronogramaActivo.dataKey] || []).filter(e => e.tipo === 'edt' && e.id !== elem.id).forEach(edt => {
        edtOpts += `<option value="${edt.id}" ${elem.dependeDe === edt.id ? 'selected' : ''}>${escapeHtml(edt.nombre)}</option>`;
    });
    const html = `<div class="modal-content modal-sm">
        <div class="modal-header"><h3> Editar ${elem.tipo.toUpperCase()}</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
        <input type="hidden" id="editId" value="${elem.id}">
        <div class="info-card u-mb-16"><strong>Código:</strong> ${codigo}</div>
        <div class="form-group"><label>Tipo</label><select id="editTipo" onchange="document.getElementById('editCamposFecha').style.display=this.value==='edt'?'none':'flex';document.getElementById('editMsgAuto').style.display=this.value==='edt'?'block':'none'">
            <option value="edt" ${elem.tipo==='edt'?'selected':''}> EDT</option>
            <option value="actividad" ${elem.tipo==='actividad'?'selected':''}> Actividad</option>
            <option value="entregable" ${elem.tipo==='entregable'?'selected':''}> Entregable</option>
            <option value="hito" ${elem.tipo==='hito'?'selected':''}> Hito</option>
        </select></div>
        <div class="form-group"><label>Nombre</label><input type="text" id="editNombre" value="${escapeHtml(elem.nombre)}"></div>
        <div class="form-row" id="editCamposFecha" style="display:${elem.tipo==='edt'?'none':'flex'}">
            <div class="form-group u-flex-1"><label>Inicio</label><input type="date" id="editInicio" value="${elem.inicio || ''}"></div>
            <div class="form-group u-flex-1"><label>Duración</label>
                <div style="display:flex;gap:4px">
                    <input type="number" id="editDuracion" class="u-select-glass" value="${elem.duracion || 0}" style="flex:1">
                    <select id="editTipoDuracion" class="u-select-glass" style="width:80px;flex-shrink:0" onchange="document.getElementById('editHorasDiaGroup').style.display=this.value==='dias'?'':'none'">
                        <option value="dias" ${(elem.tipoDuracion||'dias')==='dias'?'selected':''}>días</option>
                        <option value="horas" ${elem.tipoDuracion==='horas'?'selected':''}>horas</option>
                    </select>
                </div>
            </div>
        </div>
        <div id="editMsgAuto" style="display:${elem.tipo==='edt'?'block':'none'};font-size:12px;color:#666;background:rgba(0,0,0,0.05);padding:8px;border-radius:6px;margin-bottom:8px"> Fechas y duración calculadas automáticamente según las actividades hijas</div>
        <div class="form-group"><label>Progreso %</label><input type="number" id="editProgreso" value="${elem.progreso || 0}" min="0" max="100"></div>
        <div class="form-row">
            <div class="form-group u-flex-1"><label>Coste real (${escapeHtml(proyecto.monedaBase || 'EUR')})</label>
                <input type="number" id="editCosteReal" min="0" step="0.01" value="${Number(elem.costeReal) || 0}"></div>
            <div class="form-group u-flex-1"><label>Fecha del gasto</label>
                <input type="date" id="editFechaGasto" value="${escapeHtml(elem.fechaGasto || elem.finReal || '')}"></div>
        </div>
        <div class="form-row" id="editHorasDiaGroup" style="display:${(elem.tipoDuracion||'dias')==='dias'?'none':'flex'}">
            <div class="form-group u-flex-1"><label> Horas/día</label><input type="number" id="editHorasDia" class="u-select-glass" value="${elem.horasDia || 8}"></div>
        </div>
        <div class="form-group"><label>Responsable</label><input type="text" id="editResponsable" value="${escapeHtml(elem.responsable || '')}"></div>
        <div class="form-group"><label> Recurso equipo</label><select id="editRecursoId" class="u-select-glass">
            <option value="">-- Sin asignar --</option>${(proyecto.equipo || []).map(m =>
                `<option value="${m.id}" ${elem.recursoAsignado?.id == m.id ? 'selected' : ''}>${escapeHtml(m.nombre)} (${escapeHtml(m.rol || '')}) - ${m.costeHora} ${m.moneda}/h</option>`
            ).join('')}
        </select></div>
        <div class="form-group"><label>EDT padre</label><select id="editDependeDe">${edtOpts}</select></div>
        <button class="btn btn-primary" onclick="guardarEdicionElementoGantt()">Actualizar</button>
    </div>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${html}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}

function guardarEdicionElementoGantt() {
    const id = parseInt(document.getElementById('editId').value);
    const elem = (proyecto[cronogramaActivo.dataKey] || []).find(e => e.id === id);
    if (!elem) return;
    const antes = JSON.parse(JSON.stringify(elem));
    elem.tipo = document.getElementById('editTipo').value;
    elem.nombre = document.getElementById('editNombre').value;
    elem.inicio = document.getElementById('editInicio').value;
    const rawDuracion = parseFloat(document.getElementById('editDuracion').value) || 0;
    elem.tipoDuracion = document.getElementById('editTipoDuracion').value;
    const horasDiaInput = parseInt(document.getElementById('editHorasDia')?.value) || elem.horasDia || 8;
    elem.horasDia = horasDiaInput;
    if (elem.tipo === 'hito') {
        elem.duracion = 0;
        elem.duracionHoras = 0;
    } else if (elem.tipoDuracion === 'horas') {
        elem.duracionHoras = rawDuracion;
        elem.duracion = rawDuracion / (horasDiaInput || 8);
    } else {
        elem.duracion = rawDuracion;
        elem.duracionHoras = 0;
    }
    elem.progreso = parseInt(document.getElementById('editProgreso').value) || 0;
    elem.costeReal = Math.max(0, parseFloat(document.getElementById('editCosteReal')?.value) || 0);
    elem.fechaGasto = document.getElementById('editFechaGasto')?.value || null;
    elem.responsable = document.getElementById('editResponsable').value || '';
    const recursoId = document.getElementById('editRecursoId').value;
    if (recursoId && proyecto.equipo) {
        const r = proyecto.equipo.find(x => x.id == recursoId);
        if (r) {
            const hTot = elem.tipoDuracion === 'horas' ? (elem.duracionHoras || elem.duracion * (elem.horasDia || 8)) : elem.duracion * (elem.horasDia || 8);
            elem.costeEstimado = hTot * r.costeHora;
            elem.recursoAsignado = { id: r.id, nombre: r.nombre, rol: r.rol, costeHora: r.costeHora, moneda: r.moneda, horasDia: elem.horasDia, horasMes: r.horasMes };
        }
    } else {
        elem.recursoAsignado = null;
        elem.costeEstimado = 0;
    }
    const nuevoDependeDe = parseInt(document.getElementById('editDependeDe').value) || null;
    if (nuevoDependeDe && typeof creariaCicloWBS === 'function' &&
        creariaCicloWBS(proyecto[cronogramaActivo.dataKey] || [], id, nuevoDependeDe, 'dependeDe')) {
        mostrarToast(' Jerarquía rechazada: crearía un ciclo EDT', 'error');
        return;
    }
    elem.dependeDe = nuevoDependeDe;
    if (typeof registrarBitacora === 'function') registrarBitacora('elemento', elem.id, 'editar', antes, { id: elem.id, nombre: elem.nombre, tipo: elem.tipo, horasMes: elem.recursoAsignado?.horasMes });
    recalcularEdtAuto();
    guardarProyecto();
    renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
    if (elem.tipo !== 'edt' && elem.recursoAsignado?.id) {
        const r = proyecto.equipo?.find(x => x.id == elem.recursoAsignado.id);
        if (r?.email) {
            enviarNotificacionTarea(r.email, r.nombre, elem).then(sent => {
                if (sent) mostrarToast(' Notificación enviada a ' + r.nombre, 'success');
            });
        }
    }
    cerrarModalGeneric();
    mostrarToast(' Actualizado', 'success');
    reordenarNumeracionElementos(proyecto[cronogramaActivo.dataKey], _ctxCronograma(cronogramaActivo.panelKey));
}

function eliminarElementoGantt(id) {
    if (confirm('¿Eliminar este elemento?')) {
        const lista = proyecto[cronogramaActivo.dataKey] || [];
        const eliminado = lista.find(e => String(e.id) === String(id));
        proyecto[cronogramaActivo.dataKey] = lista.filter(e => String(e.id) !== String(id));
        proyecto[cronogramaActivo.dataKey].forEach(e => {
            if (e.predecesores) e.predecesores = e.predecesores.filter(p => String(p.id) !== String(id));
            if (String(e.dependeDe) === String(id)) e.dependeDe = null;
        });
        autoScheduler(proyecto[cronogramaActivo.dataKey]);
        recalcularEdtAuto();
        reordenarNumeracionElementos(proyecto[cronogramaActivo.dataKey], _ctxCronograma(cronogramaActivo.panelKey));
        if (typeof registrarBitacora === 'function') registrarBitacora('elemento', id, 'eliminar', eliminado || null, null);
        guardarProyecto();
        renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
        mostrarToast(' Eliminado', 'success');
    }
}

function editarElementoMultiple() {
    const ctxActual = _ctxCronograma(cronogramaActivo.panelKey);
    const container = document.getElementById(ctxActual.containerId);
    const checkboxes = container ? container.querySelectorAll('.select-elemento:checked') : document.querySelectorAll('.select-elemento:checked');
    if (checkboxes.length === 0) { mostrarToast('Selecciona elementos', 'warning'); return; }
    const ids = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
    const html = `<div class="modal-content modal-500">
        <div class="modal-header"><h3> Editar ${ids.length} elementos</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
        <div class="form-group"><label>Responsable</label><input type="text" id="multiResponsable"></div>
        <div class="form-group"><label>Duración (días)</label><input type="number" id="multiDuracion"></div>
        <div class="form-group"><label>Desplazar fechas (días)</label><input type="number" id="multiDesplazar" placeholder="0"></div>
        <button class="btn btn-primary" onclick="aplicarEdicionMultiple([${ids.join(',')}])">Aplicar</button>
    </div>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${html}</div>`;
}

function aplicarEdicionMultiple(ids) {
    const r = document.getElementById('multiResponsable')?.value;
    const d = document.getElementById('multiDuracion')?.value;
    const des = parseInt(document.getElementById('multiDesplazar')?.value) || 0;
    const antes = {};
    ids.forEach(id => {
        const e = (proyecto[cronogramaActivo.dataKey] || []).find(x => x.id === id);
        if (!e) return;
        antes[id] = JSON.parse(JSON.stringify(e));
        if (r) e.responsable = r;
        if (d && !isNaN(parseInt(d))) e.duracion = parseInt(d);
        if (des && e.inicio) e.inicio = sumarDias(e.inicio, des);
    });
    autoScheduler(proyecto[cronogramaActivo.dataKey]);
    recalcularEdtAuto();
    reordenarNumeracionElementos(proyecto[cronogramaActivo.dataKey], _ctxCronograma(cronogramaActivo.panelKey));
    ids.forEach(id => {
        if (!antes[id]) return;
        const e = (proyecto[cronogramaActivo.dataKey] || []).find(x => String(x.id) === String(id));
        const despues = clonarParaBitacora(e);
        if (typeof registrarBitacora === 'function') registrarBitacora('elemento', id, 'editar', antes[id], despues);
    });
    guardarProyecto();
    renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
    cerrarModalGeneric();
    mostrarToast(` ${ids.length} actualizados`, 'success');
}

function seleccionarTodosElementos() {
    const container = document.getElementById(_ctxCronograma(cronogramaActivo.panelKey).containerId);
    if (!container) return;
    const checkAll = container.querySelector('#seleccionarTodos');
    container.querySelectorAll('.select-elemento').forEach(cb => cb.checked = checkAll.checked);
}

function ordenarElementosGantt(criterio) {
    const data = proyecto[cronogramaActivo.dataKey];
    if (!data) return;
    if (criterio === 'fecha') data.sort((a, b) => (a.inicio || '').localeCompare(b.inicio || ''));
    else if (criterio === 'tipo') {
        const ord = { edt: 1, actividad: 2, entregable: 3, hito: 4 };
        data.sort((a, b) => (ord[a.tipo] || 5) - (ord[b.tipo] || 5));
    }
    guardarProyecto();
    renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
    mostrarToast(' Ordenado', 'success');
}

// ─── EMAILJS ─────────────────────────────────────────────────────

function mostrarConfigEmailJS() {
    const cfg = proyecto.configEmailJS || {};
    const html = `<div class="modal-content modal-sm">
        <div class="modal-header"><h3> Notificaciones por Email</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">
            Configura <a href="https://www.emailjs.com" target="_blank" style="color:var(--accent-primary)">EmailJS</a> (gratuito) para que los recursos reciban un correo al ser asignados a una tarea.
            <ol style="margin:8px 0;padding-left:20px">
                <li>Crea una cuenta en emailjs.com</li>
                <li>Añade un servicio de correo (Gmail, Outlook, etc.)</li>
                <li>Crea una plantilla con las variables: <code>to_email</code>, <code>to_name</code>, <code>task_name</code>, <code>task_type</code>, <code>task_start</code>, <code>task_end</code>, <code>task_duration</code>, <code>task_responsible</code>, <code>project_name</code></li>
                <li>Copia las credenciales aquí abajo</li>
            </ol>
        </div>
        <div class="form-group"><label>Public Key</label><input type="text" id="cfgEmailPublicKey" class="u-select-glass" value="${escapeHtml(cfg.publicKey || '')}" placeholder="ej: abc123def456"></div>
        <div class="form-group"><label>Service ID</label><input type="text" id="cfgEmailServiceId" class="u-select-glass" value="${escapeHtml(cfg.serviceId || '')}" placeholder="ej: service_abc123"></div>
        <div class="form-group"><label>Template ID</label><input type="text" id="cfgEmailTemplateId" class="u-select-glass" value="${escapeHtml(cfg.templateId || '')}" placeholder="ej: template_xyz789"></div>
        <button class="btn btn-primary" onclick="guardarConfigEmailJS()" style="width:100%;margin-top:12px"> Guardar configuración</button>
        <button class="btn btn-secondary" onclick="enviarEmailPrueba()" style="width:100%;margin-top:8px"> Enviar prueba</button>
    </div>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${html}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}

function guardarConfigEmailJS() {
    if (!proyecto.configEmailJS) proyecto.configEmailJS = {};
    proyecto.configEmailJS.publicKey = document.getElementById('cfgEmailPublicKey').value.trim();
    proyecto.configEmailJS.serviceId = document.getElementById('cfgEmailServiceId').value.trim();
    proyecto.configEmailJS.templateId = document.getElementById('cfgEmailTemplateId').value.trim();
    guardarProyecto();
    emailjs._initialized = false;
    cerrarModalGeneric();
    mostrarToast(' Configuración guardada', 'success');
}

function enviarEmailPrueba() {
    const cfg = proyecto.configEmailJS;
    if (!cfg?.publicKey || !cfg?.serviceId || !cfg?.templateId) {
        mostrarToast(' Completa la configuración primero', 'error');
        return;
    }
    _initEmailJS();
    const emailPrueba = prompt('Introduce tu email para recibir la prueba:');
    if (!emailPrueba) return;
    emailjs.send(cfg.serviceId, cfg.templateId, {
        to_email: emailPrueba,
        to_name: 'Test',
        task_name: 'Tarea de prueba',
        task_type: 'actividad',
        task_start: '2026-07-16',
        task_end: '2026-07-20',
        task_duration: '5 días',
        task_responsible: 'Responsable de prueba',
        project_name: proyecto.nombre || 'Proyecto',
    }).then(() => mostrarToast(' Email de prueba enviado', 'success'))
      .catch(err => mostrarToast(' Error: ' + (err?.text || err), 'error'));
}

function actualizarFechasProyectoDesdeActa() {
    if (proyecto.acta?.fechaInicio && proyecto.elementosGantt) {
        proyecto.elementosGantt.forEach(e => {
            if (!e.inicioReal) e.inicio = proyecto.acta.fechaInicio;
        });
        guardarProyecto();
        renderizarCronograma(_ctxCronograma('planificacion'));
        mostrarToast(' Fechas sincronizadas desde el acta', 'success');
    }
}

// ─── EXPORTAR ───────────────────────────────────────────────────

function exportarGantt() {
    const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const elementos = proyecto.elementosGantt || [];
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += `<gantt proyecto="${esc(proyecto.nombre)}">\n`;
    elementos.forEach(e => {
        xml += `  <elemento id="${esc(e.id)}" tipo="${esc(e.tipo)}" codigo="${esc(e.codigo || '')}" nombre="${esc(e.nombre)}" inicio="${esc(e.inicio || '')}" duracion="${esc(e.duracion)}" duracionHoras="${esc(e.duracionHoras || 0)}" tipoDuracion="${esc(e.tipoDuracion || 'días')}" progreso="${esc(e.progreso || 0)}" responsable="${esc(e.responsable || '')}" dependeDe="${esc(e.dependeDe || '')}">\n`;
        (e.predecesores || []).forEach(p => {
            xml += `    <predecesor id="${esc(p.id)}" tipo="${esc(p.tipo)}" retraso="${esc(p.retraso || 0)}"/>\n`;
        });
        xml += '  </elemento>\n';
    });
    xml += '</gantt>\n';
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gantt_${proyecto.nombre}.xml`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(' Exportado', 'success');
}

// ─── IMPORTAR ──────────────────────────────────────────────────

function importarXML() {
    const html = `<div class="modal u-flex" id="genericModal">
        <div class="modal-content" style="max-width:600px">
            <div class="modal-header">
                <h3> Importar XML</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <p style="font-size:13px;color:#888;margin:8px 0 16px">
                Selecciona un archivo XML (exportado de este cronograma u otra herramienta).
                Las columnas se detectan automáticamente.
            </p>
            <div id="csvDropZone" style="border:2px dashed rgba(255,255,255,0.2);border-radius:12px;padding:40px 20px;text-align:center;cursor:pointer;transition:border-color 0.2s"
                 ondragover="this.style.borderColor='#007AFF';event.preventDefault()"
                 ondrop="event.preventDefault();procesarXML(event.dataTransfer.files[0])"
                 onclick="document.getElementById('csvFileInput').click()">
                <div style="font-size:40px;margin-bottom:8px"></div>
                <div style="font-weight:500">Arrastra un XML aquí o haz clic para seleccionar</div>
                <div style="font-size:11px;color:#666;margin-top:4px">Formatos aceptados: .xml</div>
            </div>
            <input type="file" id="csvFileInput" accept=".xml,application/xml,text/xml" style="display:none" onchange="procesarXML(this.files[0])">
            <div id="csvPreview" style="margin-top:12px;max-height:300px;overflow:auto;font-size:12px"></div>
        </div>
    </div>`;
    document.getElementById('modalContainer').innerHTML = html;
}

function procesarXML(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const raw = e.target.result.trim();
        if (!raw.startsWith('<')) {
            procesarCSV(file);
            return;
        }
        const rawNoNS = raw.replace(/\sxmlns(:\w+)?=["'][^"']*["']/g, '');
        const doc = new DOMParser().parseFromString(rawNoNS, 'application/xml');
        if (doc.querySelector('parsererror')) {
            mostrarToast('XML no válido', 'error');
            return;
        }

        const norm = s => String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const getAttr = (item, names) => {
            const attrMap = {};
            for (let i = 0; i < item.attributes.length; i++) {
                const a = item.attributes[i];
                attrMap[norm(a.name)] = a.value;
            }
            for (const n of names) {
                if (attrMap[norm(n)] !== undefined) return attrMap[norm(n)];
            }
            return '';
        };
        const getChild = (item, names) => {
            const childTags = Array.from(item.children).map(c => norm(c.tagName));
            for (const n of names) {
                const idx = childTags.indexOf(norm(n));
                if (idx !== -1) {
                    const t = item.children[idx].textContent.trim();
                    if (t !== '') return t;
                }
            }
            return '';
        };
        const getVal = (item, names) => getAttr(item, names) || getChild(item, names);

        const root = doc.documentElement;
        let items = null;
        const tags = ['elemento', 'Task', 'tarea', 'actividad', 'activity', 'item', 'fila', 'row', 'entry', '*|Task', '*|elemento', '*|tarea'];
        for (const t of tags) {
            const found = doc.querySelectorAll(t);
            if (found.length) { items = Array.from(found); break; }
        }
        if (!items) {
            const namesOk = new Set(['task', 'elemento', 'tarea', 'actividad', 'activity', 'item', 'fila', 'row', 'entry']);
            items = Array.from(doc.getElementsByTagName('*')).filter(el => {
                const ln = (el.localName || el.tagName || '').toLowerCase();
                return namesOk.has(ln);
            });
        }
        if (!items) {
            items = Array.from(root.children).filter(c => /nombre|name|taskname|inicio|start|fecha|date|duracion|duration/i.test(c.textContent));
        }
        if (!items || !items.length) {
            const allTags = Array.from(doc.getElementsByTagName('*')).map(e => (e.localName || e.tagName || '').toLowerCase());
            const countMap = {};
            allTags.forEach(t => { countMap[t] = (countMap[t] || 0) + 1; });
            const top = Object.entries(countMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t, n]) => t + '(' + n + ')').join(', ');
            console.warn('[procesarXML] Sin tareas detectadas. Raíz:', root.tagName, '| Namespace:', root.namespaceURI || '(ninguno)', '| Tags:', top, '| Bytes:', raw.length);
            mostrarToast('No se encontraron tareas en el XML. Raíz: <' + root.tagName + '> Tags: ' + (top || 'ninguno'), 'error');
            return;
        }

        const parsearDuracionISO = v => {
            if (!v) return null;
            const s = String(v).trim();
            if (/^\d+(\.\d+)?$/.test(s)) return { duracion: parseFloat(s), horas: parseFloat(s) * 8, tipo: 'días' };
            const m = s.match(/^P(?:(\d+(?:\.\d+)?)D)?(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/i);
            if (!m) return null;
            const dias = parseFloat(m[1]) || 0;
            const horas = parseFloat(m[2]) || 0;
            const mins = parseFloat(m[3]) || 0;
            const segs = parseFloat(m[4]) || 0;
            const totalHoras = horas + mins / 60 + segs / 3600;
            return { duracion: dias + totalHoras / 8, horas: totalHoras, tipo: 'días' };
        };

        const nuevos = [];
        items.forEach((item, idx) => {
            const uidRaw = getVal(item, ['uid']);
            const idRaw = getVal(item, ['id']);
            if (uidRaw === '0' || idRaw === '0') return;
            const nombre = getVal(item, ['nombre', 'name', 'taskname', 'task_name', 'actividad', 'title', 'descripcion']);
            if (!nombre) return;
            const id = parseInt(uidRaw) || parseInt(idRaw) || (Date.now() + idx);
            const codigo = getVal(item, ['codigo', 'código', 'wbs', 'code', 'id', 'orden', 'outline']);
            const inicio = normalizarFecha(getVal(item, ['inicio', 'start', 'fechainicio', 'start_date', 'begin', 'comienzo', 'plannedstart']));
            const fin = normalizarFecha(getVal(item, ['fin', 'finish', 'fechafin', 'end', 'end_date', 'final', 'due', 'plannedfinish']));
            const durRaw = getVal(item, ['duracion', 'duración', 'duration', 'dur', 'work']);
            const tipoRaw = getVal(item, ['tipo', 'type', 'kind']);
            const progresoRaw = getVal(item, ['progreso', 'progress', 'percentcomplete', 'percent', 'avance', 'pct']);
            const responsable = getVal(item, ['responsable', 'resource', 'resources', 'asignado', 'owner']);
            const durHorasRaw = getVal(item, ['duracionhoras', 'hours', 'horas']);
            const tipoDurRaw = getVal(item, ['tipoduracion', 'durationtype']);

            let dur = durRaw ? parsearDuracionISO(durRaw) : null;
            if (!dur) dur = { duracion: parseFloat(durRaw) || 0, horas: 0, tipo: 'días' };
            if (dur.duracion === 0 && inicio && fin) {
                const dIni = parseLocalDate(inicio);
                const dFin = parseLocalDate(fin);
                if (dIni && dFin && dFin >= dIni) {
                    const dias = typeof contarDiasHabiles === 'function' ? contarDiasHabiles(dIni, dFin) : Math.round((dFin - dIni) / 86400000);
                    dur = { duracion: dias, horas: dias * 8, tipo: 'días' };
                }
            }

            let tipo = 'actividad';
            const isMsProjectType = ['0', '1', '2'].includes(tipoRaw);
            if (tipoRaw && !isMsProjectType) {
                tipo = tipoRaw;
            } else {
                const summary = getVal(item, ['summary', 'issummary']);
                const milestone = getVal(item, ['milestone']);
                if (summary === '1' || norm(summary) === 'true') tipo = 'edt';
                else if (milestone === '1' || norm(milestone) === 'true') tipo = 'hito';
            }

            const predecesores = [];
            const links = item.querySelectorAll('PredecessorLink');
            if (links.length) {
                links.forEach(l => {
                    const puid = getVal(l, ['predecessoruid', 'predecessor_uid', 'uid']);
                    const typeRaw = getVal(l, ['type']);
                    const tipoMap = { '1': 'FS', '2': 'SS', '3': 'FF', '4': 'SF' };
                    predecesores.push({ id: parseInt(puid) || 0, tipo: tipoMap[typeRaw] || 'FS', retraso: 0 });
                });
            } else {
                const predChildren = item.querySelectorAll('predecesor');
                if (predChildren.length) {
                    predChildren.forEach(p => {
                        predecesores.push({
                            id: parseInt(p.getAttribute('id')) || 0,
                            tipo: p.getAttribute('tipo') || 'FS',
                            retraso: parseInt(p.getAttribute('retraso')) || 0
                        });
                    });
                } else {
                    const predRaw = getVal(item, ['predecesores', 'predecessors']);
                    if (predRaw) {
                        predRaw.split(/[,;]/).forEach(p => {
                            const m = p.trim().match(/^(\d+)\s*(FS|SS|FF|SF)?/i);
                            if (m) predecesores.push({ id: parseInt(m[1]), tipo: (m[2] || 'FS').toUpperCase(), retraso: 0 });
                        });
                    }
                }
            }

            const parentUid = getVal(item, ['dependeDe', 'parenttaskuid', 'parent_uid']);
            const outlineRaw = getVal(item, ['outlinelevel', 'outline_level']);

            nuevos.push({
                id,
                tipo,
                codigo,
                nombre,
                inicio,
                duracion: tipo === 'hito' ? 0 : dur.duracion,
                duracionOriginal: tipo === 'hito' ? 0 : dur.duracion,
                tipoDuracion: tipoDurRaw || dur.tipo || 'días',
                duracionHoras: parseFloat(durHorasRaw) || dur.horas,
                horasDia: 8,
                progreso: parseFloat(progresoRaw) || 0,
                responsable,
                recursoAsignado: null,
                costeEstimado: 0,
                costeReal: 0,
                predecesores,
                dependeDe: parentUid ? parseInt(parentUid) : null,
                _importIdx: idx,
                _outlineLevel: parseInt(outlineRaw) || 0
            });
        });

        const hasOutline = nuevos.some(e => e._outlineLevel > 0);
        if (hasOutline) {
            const stack = [];
            nuevos.forEach(e => {
                while (stack.length && stack[stack.length - 1]._outlineLevel >= e._outlineLevel) stack.pop();
                if (stack.length) e.dependeDe = stack[stack.length - 1].id;
                stack.push(e);
            });
        }

        const wbsMap = {};
        nuevos.forEach(e => {
            if (e.codigo && /^\d+(\.\d+)*$/.test(e.codigo)) wbsMap[e.codigo] = e;
        });
        nuevos.forEach(e => {
            if (e.dependeDe == null && e.codigo) {
                const parts = e.codigo.split('.');
                if (parts.length > 1) {
                    const parent = wbsMap[parts.slice(0, -1).join('.')];
                    if (parent) e.dependeDe = parent.id;
                }
            }
        });

        const idMap = {};
        nuevos.forEach((e, idx) => { idMap[e.id] = idx; });
        nuevos.forEach(e => {
            e.predecesores = e.predecesores.map(p => {
                const target = idMap[p.id] !== undefined ? nuevos[idMap[p.id]] : null;
                if (!target) return null;
                return { id: target.id, tipo: p.tipo, retraso: p.retraso || 0 };
            }).filter(Boolean);
            delete e._importIdx;
            delete e._outlineLevel;
        });

        nuevos.forEach(e => {
            if (e.tipo !== 'edt' && !e.inicio) {
                e.inicio = proyecto.fechaInicio || new Date().toISOString().split('T')[0];
            }
        });

        const pv = document.getElementById('csvPreview');
        let prevHtml = `<div style="margin-top:8px;font-weight:500"> ${nuevos.length} tareas detectadas</div>`;
        prevHtml += `<table class="data-table" style="font-size:11px;margin-top:8px;width:100%"><thead><tr><th>#</th><th>Tipo</th><th>Nombre</th><th>Dur</th><th>Inicio</th><th>Preds</th></tr></thead><tbody>`;
        nuevos.slice(0, 20).forEach((e, i) => {
            const predStr = e.predecesores.map(p => {
                const pe = nuevos.find(x => x.id === p.id);
                return pe ? pe.nombre.substring(0, 15) : '?';
            }).join(', ') || '—';
            const durStr = e.tipoDuracion === 'horas' ? e.duracionHoras + 'h' : (e.duracion > 0 ? e.duracion.toFixed(2) + 'd' : '—');
            prevHtml += `<tr><td>${i+1}</td><td>${e.tipo}</td><td>${escapeHtml(e.nombre.substring(0, 30))}</td><td>${durStr}</td><td>${e.inicio ? formatearFechaEspa(e.inicio) : '—'}</td><td style="font-size:10px">${escapeHtml(predStr)}</td></tr>`;
        });
        if (nuevos.length > 20) prevHtml += `<tr><td colspan="6" style="text-align:center;color:#888">... y ${nuevos.length - 20} más</td></tr>`;
        prevHtml += `</tbody></table>`;
        prevHtml += `<div style="display:flex;gap:8px;justify-content:center;margin-top:12px">
            <button class="btn btn-primary" onclick="confirmarImportarCSV(${Date.now()})"> Importar ${nuevos.length} elementos</button>
            <button class="btn btn-secondary" onclick="cerrarModalGeneric()">Cancelar</button>
        </div>`;
        pv.innerHTML = prevHtml;

        window._csvImportData = { nuevos, rows: nuevos.length };
    };
    reader.readAsText(file);
}

function procesarCSV(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const raw = e.target.result;
        const lineas = (typeof parsearCSV === 'function')
            ? parsearCSV(raw)
            : String(raw).split(/\r?\n/).filter(l => l.trim()).map(l => l.split(','));
        if (lineas.length < 1) { mostrarToast('CSV vacío o sin datos', 'error'); return; }
        const headers = lineas[0].map(h => h.trim().toLowerCase());
        // Mapeo genérico de columnas
        let colMap = {};
        const namePatterns = [/^(id|wbs|código|codigo|code|task\s?id|orden|order|nº|n°|no|num|numero|número|item|secuencia|sec|posición|posicion)$/i, /^(name|nombre|task\s?name|actividad|activity|tarea)$/i, /^(duration|duración|duracion|dur|work)$/i, /^(start|inicio|start\s?date|begin|comienzo)$/i, /^(finish|fin|end|end\s?date|final|due)$/i, /^(predecessors|predecesores|predecesoras|dependencies|depends|pred|predecesor)$/i, /^(resources|recursos|resource\s?names|asignado|responsible|responsable)$/i, /^(type|tipo|kind)$/i, /^(progress|progreso|%\s?complete|pct|avance)$/i, /^(status|estado)$/i];
        const colKeys = ['id', 'nombre', 'duracion', 'inicio', 'fin', 'predecesores', 'recurso', 'tipo', 'progreso', 'estado'];
        headers.forEach((h, i) => {
            for (let j = 0; j < namePatterns.length; j++) {
                if (namePatterns[j].test(h)) { colMap[colKeys[j]] = i; break; }
            }
        });

        let rows;
        if (colMap.nombre === undefined) {
            colMap = { id: 0, nombre: 1, duracion: 2, inicio: 3, fin: 4 };
            rows = lineas.slice(1);
        } else {
            rows = [];
            rows = lineas.slice(1);
        }
        if (!rows.length) { mostrarToast('Sin datos', 'error'); return; }

        // Parsear duración
        function parseDuracion(v) {
            if (!v || v === '0') return { duracion: 0, horas: 0, tipo: 'días' };
            const m = v.match(/^([\d.]+)\s*(h|hr|horas?|hours?)?$/i);
            if (!m) return { duracion: parseFloat(v) || 0, horas: 0, tipo: 'días' };
            const num = parseFloat(m[1]);
            const unit = (m[2] || '').toLowerCase();
            if (unit === 'h' || unit === 'hr' || unit === 'hora' || unit === 'horas' || unit === 'hour' || unit === 'hours') {
                return { duracion: num / 8, horas: num, tipo: 'horas' };
            }
            return { duracion: num, horas: num * 8, tipo: 'días' };
        }

        // Parsear predecesores
        function parsePredecesores(v, rowIdx) {
            if (!v) return [];
            const preds = [];
            const parts = v.split(/[,;]/).map(s => s.trim()).filter(Boolean);
            parts.forEach(p => {
                const m = p.match(/^(\d+)\s*(FS|SS|FF|SF)?(?:\s*([+-]\s*\d+)\s*d?)?$/i);
                if (m) {
                    preds.push({ id: parseInt(m[1]), tipo: (m[2] || 'FS').toUpperCase(), retraso: m[3] ? parseInt(m[3].replace(/\s/g, '')) : 0 });
                }
            });
            return preds;
        }

        // Determinar tipo
        function detectarTipo(nombre, v, dur) {
            if (v) {
                const vl = v.toLowerCase();
                if (vl === 'hito' || vl === 'milestone' || vl === 'hito') return 'hito';
                if (vl === 'edt' || vl === 'wbs' || vl === 'summary' || vl === 'resumen') return 'edt';
                if (vl === 'entregable' || vl === 'deliverable') return 'entregable';
            }
            if (dur.duracion === 0 && dur.horas === 0) return 'hito';
            return 'actividad';
        }

        // Construir mapa ID→fila
        const idMap = {};
        rows.forEach((vals, idx) => {
            let id = colMap.id !== undefined ? parseInt(vals[colMap.id]) || (idx + 1) : (idx + 1);
            idMap[id] = idx;
        });

        // Crear elementos
        const nuevos = [];
        const wbsMap = {};
        rows.forEach((vals, idx) => {
            const nombre = vals[colMap.nombre];
            if (!nombre) return;
            const durRaw = colMap.duracion !== undefined ? vals[colMap.duracion] : '';
            let dur = parseDuracion(durRaw);
            const inicio = colMap.inicio !== undefined ? normalizarFecha(vals[colMap.inicio]) : '';
            const finRaw = colMap.fin !== undefined ? normalizarFecha(vals[colMap.fin]) : '';
            if (dur.duracion === 0 && dur.horas === 0 && inicio && finRaw) {
                const dIni = parseLocalDate(inicio);
                const dFin = parseLocalDate(finRaw);
                if (dIni && dFin && dFin >= dIni) {
                    const dias = typeof contarDiasHabiles === 'function' ? contarDiasHabiles(dIni, dFin) : Math.round((dFin - dIni) / 86400000);
                    dur = { duracion: dias, horas: dias * 8, tipo: 'días' };
                }
            }
            const tipo = detectarTipo(nombre, colMap.tipo !== undefined ? vals[colMap.tipo] : null, dur);
            const recurso = colMap.recurso !== undefined ? vals[colMap.recurso] : '';
            const progreso = colMap.progreso !== undefined ? parseFloat(vals[colMap.progreso]) || 0 : 0;
            const preds = colMap.predecesores !== undefined ? parsePredecesores(vals[colMap.predecesores], idx) : [];

            const elem = {
                id: Date.now() + idx,
                tipo,
                nombre,
                codigo: (colMap.id !== undefined ? (vals[colMap.id] || '') : '').toString().trim(),
                inicio: (tipo !== 'edt' && inicio) ? inicio : '',
                duracion: tipo === 'hito' ? 0 : dur.duracion,
                duracionOriginal: tipo === 'hito' ? 0 : dur.duracion,
                tipoDuracion: dur.tipo === 'horas' ? 'horas' : 'días',
                duracionHoras: dur.horas,
                horasDia: 8,
                progreso: tipo === 'hito' ? 100 : (isNaN(progreso) ? 0 : progreso),
                responsable: recurso,
                recursoAsignado: null,
                costeEstimado: 0,
                costeReal: 0,
                predecesores: [],
                dependeDe: null,
                _importIdx: idx,
                _importId: colMap.id !== undefined ? parseInt(vals[colMap.id]) || (idx + 1) : (idx + 1)
            };
            nuevos.push(elem);

            // Construir EDT si hay WBS jerárquico
            const wbsVal = colMap.id !== undefined ? vals[colMap.id] : '';
            if (wbsVal && /^\d+(\.\d+)*$/.test(wbsVal)) {
                wbsMap[wbsVal] = elem;
            }
        });

        // Crear EDTs automáticos desde estructura WBS
        const wbsKeys = Object.keys(wbsMap).sort((a, b) => a.split('.').length - b.split('.').length || a.localeCompare(b));
        wbsKeys.forEach(key => {
            const parts = key.split('.');
            if (parts.length > 1) {
                const parentKey = parts.slice(0, -1).join('.');
                const parentElem = wbsMap[parentKey];
                if (parentElem) {
                    const elem = wbsMap[key];
                    elem.dependeDe = parentElem.id;
                }
            }
        });

        // Resolver predecesores (mapear IDs importados a IDs reales)
        nuevos.forEach(elem => {
            const preds = (() => {
                const colIdx = colMap.predecesores;
                if (colIdx === undefined) return [];
                const vals = rows[elem._importIdx];
                return parsePredecesores(vals[colIdx], elem._importIdx);
            })();
            elem.predecesores = preds.map(p => {
                const targetRow = idMap[p.id];
                if (targetRow === undefined) return null;
                const target = nuevos[targetRow];
                if (!target) return null;
                return { id: target.id, tipo: p.tipo, retraso: p.retraso || 0 };
            }).filter(Boolean);
            // Limpiar campos auxiliares
            delete elem._importIdx;
            delete elem._importId;
        });

        // Si no hay inicio para una actividad, calcular desde predecesores vía autoScheduler
        nuevos.forEach(e => {
            if (e.tipo !== 'edt' && !e.inicio) {
                // Asignar fecha del proyecto o la más temprana disponible
                const proyInicio = proyecto.fechaInicio || new Date().toISOString().split('T')[0];
                e.inicio = proyInicio;
            }
        });

        // Mostrar preview
        const pv = document.getElementById('csvPreview');
        let prevHtml = `<div style="margin-top:8px;font-weight:500"> ${nuevos.length} tareas detectadas</div>`;
        prevHtml += `<table class="data-table" style="font-size:11px;margin-top:8px;width:100%"><thead><tr><th>#</th><th>Tipo</th><th>Nombre</th><th>Dur</th><th>Inicio</th><th>Preds</th></tr></thead><tbody>`;
        nuevos.slice(0, 20).forEach((e, i) => {
            const predStr = e.predecesores.map(p => {
                const pe = nuevos.find(x => x.id === p.id);
                return pe ? pe.nombre.substring(0, 15) : '?';
            }).join(', ') || '—';
            const durStr = e.tipoDuracion === 'horas' ? e.duracionHoras + 'h' : (e.duracion > 0 ? e.duracion.toFixed(2) + 'd' : '—');
            prevHtml += `<tr><td>${i+1}</td><td>${e.tipo}</td><td>${escapeHtml(e.nombre.substring(0, 30))}</td><td>${durStr}</td><td>${e.inicio ? formatearFechaEspa(e.inicio) : '—'}</td><td style="font-size:10px">${escapeHtml(predStr)}</td></tr>`;
        });
        if (nuevos.length > 20) prevHtml += `<tr><td colspan="6" style="text-align:center;color:#888">... y ${nuevos.length - 20} más</td></tr>`;
        prevHtml += `</tbody></table>`;
        prevHtml += `<div style="display:flex;gap:8px;justify-content:center;margin-top:12px">
            <button class="btn btn-primary" onclick="confirmarImportarCSV(${Date.now()})"> Importar ${nuevos.length} elementos</button>
            <button class="btn btn-secondary" onclick="cerrarModalGeneric()">Cancelar</button>
        </div>`;
        pv.innerHTML = prevHtml;

        // Guardar datos temporales para confirmación
        window._csvImportData = { nuevos, rows: nuevos.length };
    };
    reader.readAsText(file);
}

function confirmarImportarCSV(timestamp) {
    const data = window._csvImportData;
    if (!data || !data.nuevos || !data.nuevos.length) return;
    if (!proyecto.elementosGantt) proyecto.elementosGantt = [];

    // Crear EDTs padre según dependencias
    const edtIds = new Set();
    data.nuevos.forEach(e => {
        if (e.dependeDe && !proyecto.elementosGantt.find(x => x.id === e.dependeDe)) {
            // Crear EDT padre si no existe
            const padre = proyecto.elementosGantt.find(x => x.id === e.dependeDe);
            if (!padre) {
                const padreElem = data.nuevos.find(x => x.id === e.dependeDe);
                if (padreElem) {
                    padreElem.tipo = 'edt';
                    padreElem.duracion = 0;
                    padreElem.duracionHoras = 0;
                    padreElem.progreso = 0;
                }
            }
        }
    });

    // Insertar EDTs primero, luego el resto
    const edts = data.nuevos.filter(e => e.tipo === 'edt');
    const resto = data.nuevos.filter(e => e.tipo !== 'edt');
    const finales = [...edts, ...resto];

    finales.forEach(e => {
        // Limpiar campos auxiliares
        delete e._importIdx;
        delete e._importId;
        proyecto.elementosGantt.push(e);
    });

    guardarProyecto();
    cerrarModalGeneric();
    delete window._csvImportData;
    autoScheduler();
    renderizarCronograma();
    mostrarToast(` Importados ${finales.length} elementos`, 'success');
}

function limpiarCronograma(ctx) {
    const ctxLocal = ctx || _ctxCronograma(cronogramaActivo.panelKey);
    const total = (proyecto[ctxLocal.dataKey] || []).length;
    if (total === 0) { mostrarToast('El cronograma ya está vacío', 'info'); return; }
    if (!confirm(`¿Estás seguro de que quieres eliminar TODO el cronograma?\n\nSe borrarán ${total} elemento(s) (EDT, actividades, entregables e hitos).\n\nEsta acción NO se puede deshacer ni recuperar.`)) return;
    proyecto[ctxLocal.dataKey] = [];
    guardarProyecto();
    if (typeof autoScheduler === 'function') autoScheduler(proyecto[ctxLocal.dataKey]);
    renderizarCronograma(ctxLocal);
    mostrarToast(` Cronograma eliminado (${total} elementos)`, 'success');
}

// ─── LISTADO ORDENADO (imprimible) ────────────────────────────

function exportarListadoCSV() {
    const elementos = proyecto.elementosGantt || [];
    const tasks = elementos.filter(e => e.tipo !== 'edt');
    if (!tasks.length) return;
    const ids = new Set(tasks.map(e => e.id));
    const adj = {}, inDeg = {};
    tasks.forEach(t => { adj[t.id] = []; inDeg[t.id] = 0; });
    tasks.forEach(t => {
        (t.predecesores || []).forEach(p => {
            if (ids.has(p.id) && adj[p.id]) {
                adj[p.id].push(t.id);
                inDeg[t.id] = (inDeg[t.id] || 0) + 1;
            }
        });
    });
    const orden = [];
    const q = tasks.filter(t => (inDeg[t.id] || 0) === 0).map(t => t.id);
    while (q.length) {
        const n = q.shift();
        orden.push(n);
        (adj[n] || []).forEach(s => { inDeg[s]--; if (inDeg[s] === 0) q.push(s); });
    }
    const ordered = orden.map(id => tasks.find(t => t.id === id)).filter(Boolean);
    const iconos = { actividad: '', hito: '', entregable: '' };
    let csv = '"#","Código","Tipo","Nombre","Duración","Inicio","Fin","Predecesores"\n';
    ordered.forEach((e, i) => {
        const cod = e.codigo || obtenerCodigoElemento(e, elementos) || '';
        const dur = e.tipoDuracion === 'horas' && e.duracionHoras ? e.duracionHoras + 'h' : e.duracion + 'd';
        const fin = e.duracion > 0 ? (e.tipo === 'edt' ? sumarDias(e.inicio, e.duracion) : sumarDiasHabiles(e.inicio, e.duracion)) : (e.inicio || '');
        const preds = (e.predecesores || []).map(p => {
            const pe = elementos.find(x => x.id === p.id);
            return pe ? (pe.codigo || obtenerCodigoElemento(pe, elementos) || '') + ' ' + pe.nombre : '';
        }).join('; ');
        csv += `"${i+1}","${cod}","${e.tipo}","${e.nombre}","${e.duracion > 0 ? dur : ''}","${e.inicio || ''}","${fin}","${preds}"\n`;
    });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `listado_${proyecto.nombre || 'proyecto'}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(' CSV exportado', 'success');
}

function mostrarListadoOrdenado() {
    const elementos = proyecto.elementosGantt || [];
    const tasks = elementos.filter(e => e.tipo !== 'edt');
    if (!tasks.length) { mostrarToast('No hay tareas', 'error'); return; }

    // Orden topológico (Kahn)
    const ids = new Set(tasks.map(e => e.id));
    const adj = {}, inDeg = {};
    tasks.forEach(t => { adj[t.id] = []; inDeg[t.id] = 0; });
    tasks.forEach(t => {
        (t.predecesores || []).forEach(p => {
            if (ids.has(p.id) && adj[p.id]) {
                adj[p.id].push(t.id);
                inDeg[t.id] = (inDeg[t.id] || 0) + 1;
            }
        });
    });
    const orden = [];
    const q = tasks.filter(t => (inDeg[t.id] || 0) === 0).map(t => t.id);
    while (q.length) {
        const n = q.shift();
        orden.push(n);
        (adj[n] || []).forEach(s => { inDeg[s]--; if (inDeg[s] === 0) q.push(s); });
    }
    const ordered = orden.map(id => tasks.find(t => t.id === id)).filter(Boolean);

    // Construir tabla
    const iconos = { actividad: '', hito: '', entregable: '' };
    let rows = '';
    ordered.forEach((e, i) => {
        const cod = e.codigo || obtenerCodigoElemento(e, elementos) || '—';
        const icono = iconos[e.tipo] || '';
        const dur = e.tipoDuracion === 'horas' && e.duracionHoras
            ? e.duracionHoras + 'h'
            : e.duracion + 'd';
        const fin = e.duracion > 0
            ? (e.tipo === 'edt' ? sumarDias(e.inicio, e.duracion) : sumarDiasHabiles(e.inicio, e.duracion))
            : e.inicio || '—';
        const preds = (e.predecesores || []).map(p => {
            const pe = elementos.find(x => x.id === p.id);
            if (!pe) return 'ID:' + p.id;
            const pc = pe.codigo || obtenerCodigoElemento(pe, elementos) || '';
            return (pc ? pc + ' ' : '') + pe.nombre + (p.tipo && p.tipo !== 'FS' ? ' [' + p.tipo + ']' : '') + (p.retraso ? ' +' + p.retraso + 'd' : '');
        }).join('<br>') || '—';
        rows += `<tr>
            <td class="td-num">${i + 1}</td>
            <td class="td-cod">${escapeHtml(cod)}</td>
            <td class="td-tipo">${icono} ${e.tipo}</td>
            <td class="td-nom">${escapeHtml(e.nombre)}</td>
            <td class="td-dur">${e.duracion > 0 ? dur : '—'}</td>
            <td class="td-fecha">${e.inicio ? formatearFechaEspa(e.inicio) : '—'}</td>
            <td class="td-fecha">${e.duracion > 0 ? formatearFechaEspa(fin) : '—'}</td>
            <td class="td-pred">${preds}</td>
        </tr>`;
    });

    const fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    const html = `<div class="modal u-flex" id="genericModal" style="align-items:flex-start;padding-top:20px">
        <div class="modal-content listado-printable" style="max-width:95vw;width:1100px">
            <div class="modal-header no-print">
                <h3> Listado ordenado de actividades</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div class="listado-header">
                <h2 style="margin:0">${escapeHtml(proyecto.nombre || 'Proyecto')}</h2>
                <div style="color:#666;font-size:12px">Generado: ${fecha} — Orden lógico por dependencias</div>
            </div>
            <table class="data-table listado-table">
                <thead><tr>
                    <th>#</th><th>Código</th><th>Tipo</th><th>Nombre</th><th>Duración</th><th>Inicio</th><th>Fin</th><th>Predecesores</th>
                </tr></thead>
                <tbody>${rows}</tbody>
            </table>
            <p style="font-size:11px;color:#999;margin-top:8px;text-align:center">
                Total: ${ordered.length} elementos
            </p>
            <div class="modal-footer no-print" style="display:flex;gap:8px;justify-content:center;margin-top:12px">
                <button class="btn btn-primary" onclick="window.print()"> Imprimir</button>
                <button class="btn btn-secondary" onclick="exportarListadoCSV()"> CSV</button>
                <button class="btn btn-secondary" onclick="cerrarModalGeneric()">Cerrar</button>
            </div>
        </div>
    </div>`;
    document.getElementById('modalContainer').innerHTML = html;
}

// ─── ANÁLISIS ───────────────────────────────────────────────────

function calcularDesviacion(elem) {
    if (!elem.inicio || !elem.finReal) return 0;
    const finPlan = parseLocalDate(sumarDias(elem.inicio, elem.duracion));
    return Math.ceil((parseLocalDate(elem.finReal) - finPlan) / 86400000);
}

function handleFechaRealChange(e) {
    const id = parseInt(e.target.dataset.id);
    const tipo = e.target.dataset.tipo;
    const valor = e.target.value;
    const el = (proyecto[cronogramaActivo.dataKey] || []).find(x => x.id === id);
    if (!el) return;
    if (tipo === 'inicio') el.inicioReal = valor || null;
    else if (tipo === 'fin') {
        el.finReal = valor || null;
        if (el.inicioReal && valor) {
            el.duracionReal = Math.ceil((parseLocalDate(valor) - parseLocalDate(el.inicioReal)) / 86400000);
        }
    }
    guardarProyecto();
    renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
    calcularCashflow();
    mostrarToast(` Fecha real actualizada`, 'success');
}

function editarFechasReales(id) {
    const elem = (proyecto[cronogramaActivo.dataKey] || []).find(e => e.id === id);
    if (!elem) return;
    const html = `<div class="modal-content" style="max-width:450px;">
        <div class="modal-header"><h3> Avance Real</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
        <div class="info-card u-mb-16"><strong>${escapeHtml(elem.nombre)}</strong></div>
        <div class="form-group"><label>Inicio Real</label><input type="date" id="realInicio" value="${elem.inicioReal||''}"></div>
        <div class="form-group"><label>Fin Real</label><input type="date" id="realFin" value="${elem.finReal||''}"></div>
        <div class="form-group"><label>Progreso %</label><input type="range" id="realProgreso" min="0" max="100" value="${elem.progreso||0}" oninput="document.getElementById('progLabel').innerText=this.value"><span id="progLabel">${elem.progreso||0}</span>%</div>
        <button class="btn btn-primary" onclick="guardarFechasReales(${id})"> Guardar</button>
    </div>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${html}</div>`;
}

function guardarFechasReales(id) {
    const elem = (proyecto[cronogramaActivo.dataKey] || []).find(e => e.id === id);
    if (!elem) return;
    const antes = JSON.parse(JSON.stringify(elem));
    elem.inicioReal = document.getElementById('realInicio').value || null;
    elem.finReal = document.getElementById('realFin').value || null;
    elem.progreso = parseInt(document.getElementById('realProgreso').value);
    if (elem.inicioReal && elem.finReal) {
        elem.duracionReal = Math.ceil((parseLocalDate(elem.finReal) - parseLocalDate(elem.inicioReal)) / 86400000);
    }
    const despues = clonarParaBitacora(elem);
    if (typeof registrarBitacora === 'function') registrarBitacora('elemento', id, 'editar', antes, despues);
    guardarProyecto();
    renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
    cerrarModalGeneric();
    mostrarToast(' Avance registrado', 'success');
}

// ─── DETALLE DE ELEMENTO ─────────────────────────────────────────

function mostrarDetalleElemento(elem) {
    const icono = getTipoIcono(elem.tipo);
    const tipoLabel = { edt: 'EDT', actividad: 'Actividad', entregable: 'Entregable', hito: 'Hito' }[elem.tipo] || elem.tipo;
    const finHabiles = elem.inicio && elem.duracion > 0 ? sumarDiasHabiles(elem.inicio, elem.duracion) : (elem.inicio || '—');
    const progreso = elem.progreso ?? 0;
    const recurso = elem.recursoAsignado ? `${elem.recursoAsignado.nombre} (${elem.recursoAsignado.rol || ''})` : '—';
    const dependencias = (elem.predecesores || []).map(p => getNombreElemento(p.id)).filter(Boolean).join(', ') || '—';
    const predsTipo = (elem.predecesores || []).map(p => `${getNombreElemento(p.id)} (${p.tipo})`).join(', ') || '—';
    const codigo = elem.codigo || '';
    const esCritico = _getCpmResult(_ctxCronograma(cronogramaActivo.panelKey)).criticalPath?.includes(elem.id);
    // Duración real en días naturales (incluye fines de semana)
    let duracionReal = elem.duracion;
    if (elem.inicio && elem.duracion > 0) {
        const finDate = parseLocalDate(finHabiles);
        const iniDate = parseLocalDate(elem.inicio);
        if (finDate && iniDate) {
            duracionReal = Math.round((finDate - iniDate) / 86400000);
        }
    }

    const durFmt = elem.duracion < 1 ? (Math.round(elem.duracion * 100) / 100) : elem.duracion;
    const durLabel = elem.tipoDuracion === 'horas' && elem.duracionHoras
        ? elem.duracionHoras + ' horas (' + durFmt + ' días hábiles)'
        : (elem.duracion > 0 ? durFmt + ' días' : '—');
    const html = `<div class="modal-content" style="max-width:500px">
        <div class="modal-header">
            <h3>${icono} ${tipoLabel}: ${escapeHtml(elem.nombre)}</h3>
            <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px">
            ${codigo ? `<div><strong>Código:</strong> ${codigo}</div>` : ''}
            <div><strong>Tipo:</strong> ${tipoLabel}</div>
            <div><strong>Inicio:</strong> ${elem.inicio ? formatearFechaEspa(elem.inicio) : '—'}</div>
            <div><strong>Fin:</strong> ${formatearFechaEspa(finHabiles)}</div>
            <div><strong>Duración:</strong> ${durLabel}</div>
            <div><strong>Duración real:</strong> ${elem.duracion > 0 ? duracionReal + ' días naturales' : '—'}</div>
            <div><strong>Progreso:</strong> ${progreso}%</div>
            <div><strong>Responsable:</strong> ${elem.responsable || '—'}</div>
            <div><strong>Recurso:</strong> ${recurso}</div>
            ${elem.costeEstimado ? `<div><strong>Coste est.:</strong> ${elem.costeEstimado} ${elem.recursoAsignado?.moneda || ''}</div>` : ''}
            ${elem.costeReal ? `<div><strong>Coste real:</strong> ${elem.costeReal} ${elem.recursoAsignado?.moneda || ''}</div>` : ''}
            ${elem.inicioReal ? `<div><strong>Inicio real:</strong> ${formatearFechaEspa(elem.inicioReal)}</div>` : ''}
            ${elem.finReal ? `<div><strong>Fin real:</strong> ${formatearFechaEspa(elem.finReal)}</div>` : ''}
            <div style="grid-column:1/-1"><strong>EDT padre:</strong> ${elem.dependeDe ? getNombreElemento(elem.dependeDe) : '—'}</div>
            <div style="grid-column:1/-1"><strong>Dependencias:</strong> ${predsTipo}</div>
            ${esCritico ? '<div style="grid-column:1/-1"><span class="wbs-badge-crit" style="font-size:11px"> Ruta crítica</span></div>' : ''}
        </div>
        <div style="display:flex;gap:8px;margin-top:16px">
            <button class="btn btn-primary" onclick="cerrarModalGeneric();editarElementoGantt(${elem.id})" style="flex:1"> Editar</button>
            <button class="btn btn-danger" onclick="cerrarModalGeneric();eliminarElementoGantt(${elem.id})" style="flex:1"> Eliminar</button>
            <button class="btn btn-secondary" onclick="cerrarModalGeneric();editarFechasReales(${elem.id})" style="flex:1"> Avance</button>
        </div>
    </div>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${html}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}

// ─── LÍNEA BASE ────────────────────────────────────────────────

function _getLineasBase() {
    if (!proyecto.lineasBase) proyecto.lineasBase = [];
    return proyecto.lineasBase;
}

function abrirModalLineaBase() {
    const existing = document.getElementById('genericModal');
    if (existing) existing.remove();

    const lineas = _getLineasBase();
    let listaHtml = '';
    if (lineas.length === 0) {
        listaHtml = '<div style="padding:16px;font-size:13px;color:var(--text-muted);text-align:center">Aún no hay líneas base guardadas.</div>';
    } else {
        listaHtml = lineas.map(lb => {
            const visible = _getState(_ctxCronograma(cronogramaActivo.panelKey)).lineaBaseVisible === lb.id;
            const nTareas = (lb.elementos || []).length;
            return `<div style="display:flex;align-items:center;gap:8px;padding:10px 4px;border-bottom:1px solid rgba(128,128,128,0.15)">
                <div style="flex:1;min-width:0">
                    <div style="font-weight:600;font-size:13px">${escapeHtml(lb.nombre)} ${visible ? '<span style="font-size:10px;background:#FFB80022;color:#B8860B;padding:1px 6px;border-radius:8px;border:1px solid #B8860B55">EN CRONOGRAMA</span>' : ''}</div>
                    <div style="font-size:11px;color:var(--text-muted)">${formatearFechaEspa(lb.fecha)} · ${nTareas} tareas</div>
                </div>
                <button class="btn btn-small btn-secondary" onclick="toggleLineaBaseVisible(${lb.id})">${visible ? 'Ocultar' : 'Ver'}</button>
                <button class="btn btn-small btn-primary" onclick="compararLineaBase(${lb.id})">Comparar</button>
                <button class="btn btn-small btn-danger" onclick="eliminarLineaBase(${lb.id})">Eliminar</button>
            </div>`;
        }).join('');
    }

    const hoy = formatLocalDate(new Date());
    const html = `<div class="modal-content modal-500">
        <div class="modal-header">
            <h3> Línea Base</h3>
            <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
        </div>
        <div style="padding:16px">
            <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px">
                Guarda el cronograma <strong>tal y como está ahora</strong> como línea base. Después podrás comparar y calcular los desvíos.
            </div>
            <div class="form-group">
                <label>Nombre de la nueva línea base</label>
                <div style="display:flex;gap:8px">
                    <input type="text" id="lineaBaseNombre" class="u-input" style="flex:1" placeholder="Ej: Línea base inicial" value="Línea base ${hoy}" onkeydown="if(event.key==='Enter')guardarLineaBase()">
                    <button class="btn btn-primary" onclick="guardarLineaBase()"> Guardar</button>
                </div>
            </div>
            <div style="margin-top:12px;font-size:12px;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Líneas base guardadas</div>
            ${listaHtml}
        </div>
    </div>`;

    const div = document.createElement('div');
    div.id = 'genericModal';
    div.className = 'modal';
    div.style.display = 'flex';
    div.innerHTML = html;
    document.body.appendChild(div);
    div.onclick = (e) => { if (e.target === div) cerrarModalGeneric(); };
}

function guardarLineaBase() {
    const nombre = (document.getElementById('lineaBaseNombre')?.value || '').trim();
    if (!nombre) {
        mostrarToast(' Introduce un nombre para la línea base', 'error');
        return;
    }
    const elementos = (proyecto[cronogramaActivo.dataKey] || []).map(e => JSON.parse(JSON.stringify(e)));
    if (typeof aplicarCodigosWBS === 'function') aplicarCodigosWBS(elementos);
    const scopeBaseline = typeof crearScopeBaseline === 'function'
        ? crearScopeBaseline(elementos, (proyecto.cambios || []).filter(c => c.estado === 'Aprobado' || c.estado === 'Implementado'))
        : null;
    const lineas = _getLineasBase();
    const lineaBase = {
        id: Date.now(),
        nombre,
        fecha: formatLocalDate(new Date()),
        dataKey: cronogramaActivo.dataKey,
        panelKey: cronogramaActivo.panelKey,
        elementos,
        scopeBaseline
    };
    const vigentes = lineas.filter(l => !l.superada && l.dataKey === lineaBase.dataKey)
        .sort((a, b) => Number(b.id) - Number(a.id));
    const anterior = vigentes[0] || null;
    if (anterior) {
        vigentes.forEach(lb => { lb.superada = true; });
        lineaBase.predecesoraId = anterior.id;
        if (anterior.scopeBaseline) lineaBase.scopeBaselineAnterior = JSON.parse(JSON.stringify(anterior.scopeBaseline));
        if (typeof compararScopeBaseline === 'function' && anterior.scopeBaseline) {
            lineaBase.diffAlcance = compararSnapshotsScope(elementos, anterior.scopeBaseline);
        }
    }
    if (!lineaBase.diffAlcance) lineaBase.diffAlcance = { altas: [], bajas: [], cambios: [], total: 0 };
    lineas.push(lineaBase);
    if (typeof registrarBitacora === 'function') registrarBitacora('lineaBase', lineaBase.id, 'crear', null, { id: lineaBase.id, nombre, scopeBaseline });
    guardarProyecto();
    abrirModalLineaBase();
    mostrarToast(` Línea base "${nombre}" guardada`, 'success');
}

function toggleLineaBaseVisible(id) {
    const ctx = _ctxCronograma(cronogramaActivo.panelKey);
    const state = _getState(ctx);
    state.lineaBaseVisible = state.lineaBaseVisible === id ? null : id;
    renderizarCronograma(ctx);
    abrirModalLineaBase();
}

function eliminarLineaBase(id) {
    const lb = _getLineasBase().find(x => x.id === id);
    if (!lb) return;
    if (!confirm(` ¿Eliminar la línea base "${lb.nombre}"?`)) return;
    const antes = JSON.parse(JSON.stringify(lb));
    proyecto.lineasBase = _getLineasBase().filter(x => x.id !== id);
    if (typeof registrarBitacora === 'function') registrarBitacora('lineaBase', id, 'eliminar', antes, null);
    const state = _getState(_ctxCronograma(cronogramaActivo.panelKey));
    if (state.lineaBaseVisible === id) state.lineaBaseVisible = null;
    guardarProyecto();
    abrirModalLineaBase();
    renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
}

function _desvioDias(base, actual) {
    if (!base || !actual) return null;
    const b = parseLocalDate(base);
    const a = parseLocalDate(actual);
    if (!b || !a) return null;
    return diffDias(a, b);
}

function _fmtDesvio(dias) {
    if (dias === null || dias === undefined || isNaN(dias)) return '<span style="color:var(--text-muted)">—</span>';
    if (dias === 0) return '<span style="color:var(--text-muted)">0 d</span>';
    const signo = dias > 0 ? '+' : '';
    const color = dias > 0 ? '#E53935' : '#00A859';
    const label = dias > 0 ? 'retraso' : 'adelanto';
    return `<span style="color:${color};font-weight:600" title="${label}">${signo}${dias} d</span>`;
}

function compararLineaBase(id) {
    const lb = _getLineasBase().find(x => x.id === id);
    if (!lb) return;
    const existing = document.getElementById('genericModal');
    if (existing) existing.remove();

    const baseList = lb.elementos || [];
    const actualList = (proyecto[lb.dataKey || cronogramaActivo.dataKey] || []).map(e => JSON.parse(JSON.stringify(e)));
    if (typeof aplicarCodigosWBS === 'function') aplicarCodigosWBS(actualList);
    const baseById = new Map(baseList.map(e => [e.id, e]));
    const actualById = new Map(actualList.map(e => [e.id, e]));

    const filas = [];
    baseList.forEach(be => {
        const ae = actualById.get(be.id);
        const nombre = ae ? ae.nombre : be.nombre;
        const tipo = ae ? ae.tipo : be.tipo;
        const icono = getTipoIcono(tipo);
        const finBase = be.inicio ? (be.duracion > 0 ? sumarDiasHabiles(be.inicio, be.duracion) : be.inicio) : null;
        const finAct = ae && ae.inicio ? (ae.duracion > 0 ? sumarDiasHabiles(ae.inicio, ae.duracion) : ae.inicio) : null;
        const dIni = _desvioDias(be.inicio, ae?.inicio);
        const dFin = _desvioDias(finBase, finAct);
        if (!ae) {
            filas.push({ nombre, tipo, icono, eliminada: true, html: `
                <tr style="opacity:0.6">
                    <td>${icono} ${escapeHtml(nombre)}</td>
                    <td>${escapeHtml(be.codigo || '—')}</td>
                    <td>${be.inicio ? formatearFechaEspa(be.inicio) : '—'}</td>
                    <td colspan="3" style="color:#E53935;font-weight:600">Eliminada del cronograma</td>
                    <td>${finBase ? formatearFechaEspa(finBase) : '—'}</td>
                    <td colspan="3"><span style="color:#E53935;font-weight:600">—</span></td>
                </tr>` });
            return;
        }
        const durBase = be.duracion || 0;
        const durAct = ae.duracion || 0;
        const dDur = durAct - durBase;
        const hayRetraso = dIni > 0 || dFin > 0;
        const hayAdelanto = !hayRetraso && (dIni < 0 || dFin < 0);
        filas.push({ nombre, tipo, retraso: hayRetraso, adelanto: hayAdelanto, html: `
            <tr>
                <td>${icono} ${escapeHtml(nombre)}</td>
                <td>${escapeHtml(be.codigo || '—')}${ae.codigo && ae.codigo !== be.codigo ? ` → ${escapeHtml(ae.codigo)}` : ''}</td>
                <td>${be.inicio ? formatearFechaEspa(be.inicio) : '—'}</td>
                <td>${ae.inicio ? formatearFechaEspa(ae.inicio) : '—'}</td>
                <td>${_fmtDesvio(dIni)}</td>
                <td>${finBase ? formatearFechaEspa(finBase) : '—'}</td>
                <td>${finAct ? formatearFechaEspa(finAct) : '—'}</td>
                <td>${_fmtDesvio(dFin)}</td>
                <td>${durBase}d → ${durAct}d ${dDur !== 0 ? _fmtDesvio(dDur) : ''}</td>
            </tr>` });
    });
    actualList.forEach(ae => {
        if (!baseById.has(ae.id)) {
            filas.push({ nombre: ae.nombre, nueva: true, html: `
                <tr style="opacity:0.85">
                    <td>${getTipoIcono(ae.tipo)} ${escapeHtml(ae.nombre)}</td>
                    <td>${escapeHtml(ae.codigo || '—')}</td>
                    <td colspan="3" style="color:#00A859;font-weight:600">Nueva tarea</td>
                    <td>${_fmtDesvio(null)}</td>
                    <td>—</td>
                    <td>${ae.inicio ? formatearFechaEspa(ae.inicio) : '—'}</td>
                    <td>${_fmtDesvio(null)}</td>
                    <td>— → ${ae.duracion || 0}d</td>
                </tr>` });
        }
    });

    const retrasadas = filas.filter(f => !f.eliminada && !f.nueva && f.retraso).length;
    const adelantadas = filas.filter(f => !f.eliminada && !f.nueva && f.adelanto).length;
    const diffAlcance = (typeof compararScopeBaseline === 'function' && lb.scopeBaseline)
        ? compararSnapshotsScope(actualList, lb.scopeBaseline)
        : { altas: [], bajas: [], cambios: [], total: 0 };
    const resumen = `<div style="display:flex;gap:16px;font-size:12px;margin-bottom:10px;flex-wrap:wrap">
        <span><strong>${filas.length}</strong> tareas comparadas</span>
        <span style="color:#E53935"><strong>${retrasadas}</strong> con retraso</span>
        <span style="color:#00A859"><strong>${adelantadas}</strong> adelantadas</span>
        <span>Alcance: <strong>${diffAlcance.total}</strong> diferencias (${diffAlcance.altas.length} altas · ${diffAlcance.bajas.length} bajas · ${diffAlcance.cambios.length} cambios)</span>
        <span>Línea base: <strong>${escapeHtml(lb.nombre)}</strong> (${formatearFechaEspa(lb.fecha)})</span>
    </div>`;

    const html = `<div class="modal-content modal-700">
        <div class="modal-header">
            <h3> Comparar con Línea Base</h3>
            <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
        </div>
        <div style="padding:16px">
            ${resumen}
            <div style="overflow:auto;max-height:420px">
                <table class="data-table" style="font-size:12px;width:100%;border-collapse:collapse">
                    <thead><tr>
                        <th style="text-align:left">Tarea</th>
                        <th>Código WBS</th>
                        <th>Inicio base</th>
                        <th>Inicio act.</th>
                        <th>Desvío inicio</th>
                        <th>Fin base</th>
                        <th>Fin act.</th>
                        <th>Desvío fin</th>
                        <th>Duración</th>
                    </tr></thead>
                    <tbody>${filas.map(f => f.html).join('')}</tbody>
                </table>
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:8px">
                Desvío positivo = retraso · negativo = adelanto (días naturales). Las tareas EDT con fechas calculadas pueden mostrar desvíos heredados de sus hijos.
            </div>
        </div>
    </div>`;

    const div = document.createElement('div');
    div.id = 'genericModal';
    div.className = 'modal';
    div.style.display = 'flex';
    div.innerHTML = html;
    document.body.appendChild(div);
    div.onclick = (e) => { if (e.target === div) cerrarModalGeneric(); };
}


// ─── CALENDARIO LABORAL CONFIGURABLE ──────────────────────────────────────
function abrirModalCalendarioLaboral() {
    let modal = document.getElementById('modalCalendarioLaboral');
    const cal = (typeof proyecto !== 'undefined' && proyecto.calendario) || {};
    const dias = Array.isArray(cal.diasNoLaborables) ? cal.diasNoLaborables : [0, 6];
    const nombres = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalCalendarioLaboral';
        modal.className = 'modal u-hidden';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div class="modal-content modal-md">
            <div class="modal-header"><h3 id="tituloCalendario">Calendario laboral</h3><span class="close-modal" onclick="cerrarModalCalendarioLaboral()">&times;</span></div>
            <div style="padding:16px;display:flex;flex-direction:column;gap:14px;">
                <p style="font-size:13px;opacity:.7;margin:0;">Selecciona los días de la semana no laborables y lista los festivos (AAAA-MM-DD, uno por línea).</p>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">${nombres.map((n, i) => `<label style="font-size:12px;"><input type="checkbox" class="cal-dia" value="${i}" ${dias.includes(i) ? 'checked' : ''}> ${n}</label>`).join('')}</div>
                <label for="calFestivos" style="font-size:12px;">Festivos</label>
                <textarea id="calFestivos" rows="6" style="width:100%;padding:8px;" aria-label="Festivos, uno por línea">${(cal.festivos || []).join('\n')}</textarea>
                <button class="btn btn-primary" onclick="guardarCalendarioLaboral()">Guardar calendario</button>
            </div>
        </div>`;
    modal.style.display = 'flex';
    modal.classList.remove('u-hidden');
}

function guardarCalendarioLaboral() {
    const modal = document.getElementById('modalCalendarioLaboral');
    if (!modal || typeof proyecto === 'undefined') return;
    const dias = Array.from(modal.querySelectorAll('.cal-dia:checked')).map(c => Number(c.value));
    const festivos = String(modal.querySelector('#calFestivos').value || '')
        .split(/[\n,;]+/).map(f => f.trim()).filter(f => /^\d{4}-\d{2}-\d{2}$/.test(f));
    proyecto.calendario = { diasNoLaborables: dias, festivos };
    if (typeof guardarProyecto === 'function') guardarProyecto();
    if (typeof registrarBitacoraSiExiste === 'function') registrarBitacoraSiExiste('calendario', 'proyecto', 'actualizar', null, proyecto.calendario);
    cerrarModalCalendarioLaboral();
    if (typeof mostrarToast === 'function') mostrarToast('Calendario laboral actualizado', 'success');
    if (typeof renderizarCronograma === 'function') renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
}

function cerrarModalCalendarioLaboral() {
    const modal = document.getElementById('modalCalendarioLaboral');
    if (!modal) return;
    modal.style.display = 'none';
    modal.classList.add('u-hidden');
}

window.abrirModalCalendarioLaboral = abrirModalCalendarioLaboral;
window.cerrarModalCalendarioLaboral = cerrarModalCalendarioLaboral;
window.guardarCalendarioLaboral = guardarCalendarioLaboral;
