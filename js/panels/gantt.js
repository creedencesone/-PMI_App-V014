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

let cpmResult = { criticalPath: [], totalFloat: 0 };
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

let cpmResultEjecucion = { criticalPath: [], totalFloat: 0 };
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
    arr.forEach(e => { if (!e.predecesores) e.predecesores = []; });
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
    renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
}

function cargarElementosGanttEjecucion() {
    cronogramaActivo = { panelKey: 'ejecucion', dataKey: 'elementosGanttEjecucion' };
    if (proyecto.elementosGanttEjecucion == null) {
        proyecto.elementosGanttEjecucion = JSON.parse(JSON.stringify(proyecto.elementosGantt || []));
        guardarProyecto();
    }
    _normalizarElementosGantt('elementosGanttEjecucion');
    renderizarCronograma(_ctxCronograma(cronogramaActivo.panelKey));
}

function sumarDias(f, d) { if (!f) return ''; const p = f.split('-'); const dt = new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]) + d); return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0'); }
function parseLocalDate(str) { if (!str) return null; const p = str.split('-'); return new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2])); }
function formatLocalDate(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function diffDias(a, b) { const ta = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()); const tb = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()); return Math.round((ta - tb) / 86400000); }
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
function esFinDeSemana(d) { const w = d.getDay(); return w === 0 || w === 6; }
function siguienteDiaHabil(d) { const r = new Date(d); while (esFinDeSemana(r)) r.setDate(r.getDate() + 1); return r; }
function sumarDiasHabiles(fechaStr, dias) {
    if (!fechaStr) return '';
    const dt = parseLocalDate(fechaStr);
    if (!dt) return '';
    if (Math.abs(dias) < 1) return formatLocalDate(dt);
    let contados = 0;
    if (dias >= 0) {
        while (contados < dias) {
            dt.setDate(dt.getDate() + 1);
            if (!esFinDeSemana(dt)) contados++;
        }
    } else {
        const diasInt = Math.ceil(Math.abs(dias));
        while (contados < diasInt) {
            dt.setDate(dt.getDate() - 1);
            if (!esFinDeSemana(dt)) contados++;
        }
    }
    return formatLocalDate(dt);
}
function contarDiasHabiles(inicio, fin) {
    if (!inicio || !fin) return 0;
    let n = 0;
    const d = new Date(inicio);
    while (d < fin) {
        if (!esFinDeSemana(d)) n++;
        d.setDate(d.getDate() + 1);
    }
    return n;
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

    const earlyStart = {}, earlyFinish = {};
    tasks.forEach(t => { earlyStart[t.id] = 0; earlyFinish[t.id] = 0; });

    let proyInicio = null;
    tasks.forEach(t => { if (t.inicio) { const d = parseLocalDate(t.inicio); if (!proyInicio || d < proyInicio) proyInicio = d; } });
    if (!proyInicio) proyInicio = new Date();

    tasks.forEach(t => {
        if (t.inicio) {
            const d = parseLocalDate(t.inicio);
            const offset = Math.round((d - proyInicio) / 86400000);
            earlyStart[t.id] = Math.max(0, offset);
        }
    });

    orden.forEach(id => {
        const t = tasks.find(x => x.id === id);
        if (!t) return;
        (t.predecesores || []).forEach(p => {
            if (!ids.has(p.id)) return;
            const predDur = duration[p.id] || 0;
            const predES = earlyStart[p.id] || 0;
            const predEF = earlyFinish[p.id] || 0;
            let minStart = predEF;
            if (p.tipo === 'SS') minStart = predES;
            if (p.tipo === 'FF') minStart = predEF - (duration[id] || 0);
            if (p.tipo === 'SF') minStart = predES - (duration[id] || 0);
            minStart += (p.retraso || 0);
            if (minStart > earlyStart[id]) earlyStart[id] = minStart;
        });
        earlyFinish[id] = earlyStart[id] + (duration[id] || 0);
    });

    const proyFin = Object.values(earlyFinish).length ? Math.max(...Object.values(earlyFinish)) : 0;
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
            if (p.tipo === 'SS') maxFinish = succLS + curDur;
            if (p.tipo === 'FF') maxFinish = succLF;
            if (p.tipo === 'SF') maxFinish = succLF + curDur;
            maxFinish -= (p.retraso || 0);
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

    if (state.vista === 'tarjetas') {
        renderizarVistaTarjetas(elementosVisibles, ctx);
        renderizarInfoBar(ctx);
        return;
    }

    // Restore original HTML if it was replaced by tarjetas view
    if (_getOrigHTML(ctx) && !container.querySelector('#' + ctx.wbsId)) {
        container.innerHTML = _getOrigHTML(ctx);
    }

    const fechaInicioProy = calcularInicioProyecto(elementosVisibles);
    const fechaFinProy = calcularFinProyecto(elementosVisibles);
    const spanFechas = document.getElementById(ctx.fechasId);
    if (spanFechas) {
        const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        spanFechas.textContent = ` ${fmt(fechaInicioProy)} → ${fmt(fechaFinProy)} (${Math.round((fechaFinProy - fechaInicioProy) / 86400000)} días naturales)`;
    }
    // Rendimiento: cap DOM/SVG para evitar congelar; usar escala "año" para rangos mayores.
    const MAX_DIAS = 5000;
    const MAX_ANCHO = 150000;
    const diasTotales = Math.min(MAX_DIAS, Math.max(1, Math.ceil((fechaFinProy - fechaInicioProy) / 86400000) + 60));

    const meses = generarMeses(fechaInicioProy, diasTotales);
    const anchoDia = ({día:50,semana:14,mes:28,año:6})[state.escala] * state.zoom || 28 * state.zoom;
    const anchoTotal = Math.min(diasTotales * anchoDia, MAX_ANCHO);
    const headerHeight = state.escala === 'día' ? 60 : 40;

    // Orden único para árbol + timeline
    const ordenArbol = getOrdenArbol(elementosVisibles, ctx);

    renderizarArbolWBS(ordenArbol, elementosVisibles, headerHeight, ctx);
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
        if (offsetHoy > 0 && offsetHoy < diasTotales) {
            const xHoy = offsetHoy * anchoDia;
            const panelW = tlPanel.clientWidth;
            tlPanel.scrollLeft = Math.max(0, xHoy - panelW / 2);
        }
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
        if (e.inicio && e.duracion) {
            const d = parseLocalDate(sumarDiasHabiles(e.inicio, e.duracion));
            if (!max || d > max) max = d;
        }
    });
    if (!max) max = new Date(calcularInicioProyecto(elementos));
    return max;
}

function generarMeses(fechaInicio, diasTotales) {
    const meses = [];
    let c = new Date(fechaInicio);
    c.setDate(1);
    const fin = new Date(fechaInicio);
    fin.setDate(fin.getDate() + diasTotales);
    while (c <= fin) {
        const finMes = new Date(c.getFullYear(), c.getMonth() + 1, 0);
        meses.push({
            name: c.toLocaleString('es', { month: 'short', year: '2-digit' }),
            start: new Date(c),
            end: finMes
        });
        c.setMonth(c.getMonth() + 1);
    }
    return meses;
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
    let html = `<div style="height:${headerH}px;flex-shrink:0"></div>`;
    orden.forEach(elem => {
        const depth = calcularProfundidad(elem.id, elementos);
        const icono = getTipoIcono(elem.tipo);
        const esCritico = critSet.has(elem.id);
        const sel = state.selectedId === elem.id ? 'wbs-selected' : '';
        const colapsado = state.collapsed.has(elem.id);
        const tieneHijos = elem.tipo === 'edt' && elementos.some(x => x.dependeDe === elem.id);

        html += `<div class="wbs-item ${sel}" data-id="${elem.id}" data-type="${elem.tipo}" style="padding-left:${depth * 18}px">`;
        if (tieneHijos) {
            html += `<span class="wbs-toggle" data-id="${elem.id}">${colapsado ? '' : '▼'}</span>`;
        } else {
            html += `<span class="wbs-toggle-placeholder"></span>`;
        }
        html += `<span class="wbs-icon">${icono}</span>`;
        const codigo = elem.codigo || (typeof obtenerCodigoElemento === 'function' ? obtenerCodigoElemento(elem, elementos) : '') || '';
        html += `<span class="wbs-code">${escapeHtml(codigo)}</span>`;
        html += `<span class="wbs-name ${esCritico ? 'wbs-critical' : ''}">${escapeHtml(elem.nombre)}</span>`;
        const durTxt = elem.tipoDuracion === 'horas' && elem.duracionHoras
            ? elem.duracionHoras + 'h'
            : (elem.duracion > 0 ? (elem.duracion < 1 ? (Math.round(elem.duracion * 100) / 100) + 'd' : elem.duracion + 'd') : '');
        const fin = elem.duracion > 0
            ? (elem.tipo === 'edt' ? sumarDias(elem.inicio, elem.duracion) : sumarDiasHabiles(elem.inicio, elem.duracion))
            : (elem.inicio || '');
        const inicioTxt = elem.inicio || '—';
        const finTxt = fin || '—';
        if (durTxt || elem.inicio) {
            html += `<span class="wbs-dates" title="Inicio: ${escapeHtml(inicioTxt)} · Fin: ${escapeHtml(finTxt)}">`;
            if (durTxt) html += `<span class="wbs-dur">${escapeHtml(durTxt)}</span>`;
            html += `<span class="wbs-start">${escapeHtml(inicioTxt)}</span>`;
            html += `<span class="wbs-arrow">→</span>`;
            html += `<span class="wbs-end">${escapeHtml(finTxt)}</span>`;
            html += `</span>`;
        }
        if (esCritico) html += `<span class="wbs-badge-crit">CP</span>`;
        html += `</div>`;
    });
    el.innerHTML = html;
    el.querySelectorAll('.wbs-toggle').forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            if (state.collapsed.has(id)) state.collapsed.delete(id);
            else state.collapsed.add(id);
            renderizarCronograma(ctx);
        };
    });
    el.querySelectorAll('.wbs-item').forEach(item => {
        item.onclick = function() {
            const id = parseInt(this.dataset.id);
            const elem = (proyecto[ctx.dataKey] || []).find(x => x.id === id);
            state.selectedId = id;
            el.querySelectorAll('.wbs-item').forEach(x => x.classList.remove('wbs-selected'));
            this.classList.add('wbs-selected');
            resaltarBarraEnTimeline(id, ctx);
            if (elem) mostrarDetalleElemento(elem);
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
    let depth = 0;
    let e = elementos.find(x => x.id === id);
    while (e && e.dependeDe) {
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
            <polygon points="0 0, 7 2.5, 0 7" fill="${isDark ? '#ccc' : '#000'}" style="fill:${isDark ? '#ccc' : '#000'}"/>
        </marker>
        <marker id="arrowCritical" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#FF3B30" style="fill:#FF3B30"/>
        </marker>
    </defs>`;

    // Project progress bar (y=0)
    const tasksProg = elementos.filter(e => e.tipo !== 'edt' && e.duracion > 0);
    const totalWeight = tasksProg.reduce((s, e) => s + e.duracion, 0);
    const progPct = totalWeight > 0 ? tasksProg.reduce((s, e) => s + (e.progreso || 0) * e.duracion, 0) / totalWeight : 0;
    const progColor = progPct >= 100 ? '#00A859' : (progPct >= 50 ? '#007AFF' : '#FF9500');
    let gridHtml = `
        <rect x="0" y="0" width="${anchoTotal}" height="4" fill="rgba(0,0,0,0.08)" stroke="none" rx="2"/>
        <rect x="0" y="0" width="${anchoTotal * progPct / 100}" height="4" fill="${progColor}" stroke="none" rx="2"/>
        <text x="${anchoTotal - 4}" y="3" font-size="8" fill="${isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'}" font-family="system-ui" text-anchor="end" dominant-baseline="central">${Math.round(progPct)}%</text>
    `;

    // Grid y cabeceras según escala
    const escala = state.escala;

    if (escala === 'día') {
        // Día: mes arriba, día-semana + día-nº abajo, fines de semana marcados
        const diasSem = ['D','L','M','X','J','V','S'];
        const c = {
            mes: isDark ? '#E0E0E0' : 'rgba(0,0,0,0.7)',
            diaLab: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.8)',
            diaFinde: isDark ? '#FF6B6B' : 'rgba(200,40,40,0.85)',
            numLab: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            numFinde: isDark ? 'rgba(255,100,100,0.75)' : 'rgba(200,40,40,0.75)',
            findeFill: isDark ? 'rgba(255,59,48,0.08)' : 'rgba(200,40,40,0.08)',
            lineMes: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
        };
        // Primero renderizar fines de semana (detrás de todo)
        for (let d = 0; d < diasTotales; d++) {
            const fecha = new Date(fechaInicio.getTime() + d * 86400000);
            const diaSem = fecha.getDay();
            if (diaSem === 0 || diaSem === 6) {
                const x = d * anchoDia;
                gridHtml += `<rect x="${x}" y="${headerHeight}" width="${anchoDia}" height="${altoTotal - headerHeight}" fill="${c.findeFill}" style="fill:${c.findeFill}" stroke="none"/>`;
            }
        }
        // Meses (fila superior del header)
        meses.forEach(m => {
            const x = ((m.start - fechaInicio) / 86400000) * anchoDia;
            const w = ((m.end.getTime() + 86400000 - m.start) / 86400000) * anchoDia;
            const centro = x + w / 2;
            gridHtml += `<text x="${centro}" y="${26}" font-size="11" fill="${c.mes}" style="fill:${c.mes}" font-family="system-ui" text-anchor="middle" font-weight="600">${m.name}</text>`;
            gridHtml += `<line x1="${x}" y1="${32}" x2="${x}" y2="${altoTotal}" stroke="${c.lineMes}" style="stroke:${c.lineMes}" stroke-width="1"/>`;
        });
        // Días individuales: día-semana + día-nº
        for (let d = 0; d < diasTotales; d++) {
            const x = d * anchoDia;
            const centro = x + anchoDia / 2;
            const fecha = new Date(fechaInicio.getTime() + d * 86400000);
            const diaSem = fecha.getDay();
            const esFinSemana = diaSem === 0 || diaSem === 6;
            gridHtml += `<text x="${centro}" y="${46}" font-size="10" fill="${esFinSemana ? c.diaFinde : c.diaLab}" style="fill:${esFinSemana ? c.diaFinde : c.diaLab}" font-family="system-ui" text-anchor="middle" font-weight="600">${diasSem[diaSem]}</text>`;
            gridHtml += `<text x="${centro}" y="${58}" font-size="10" fill="${esFinSemana ? c.numFinde : c.numLab}" style="fill:${esFinSemana ? c.numFinde : c.numLab}" font-family="system-ui" text-anchor="middle">${fecha.getDate()}</text>`;
        }
        // Línea de hoy
        const hoy = new Date();
        const offsetHoy = Math.round((hoy - fechaInicio) / 86400000);
        if (offsetHoy > 0 && offsetHoy < diasTotales) {
            const xHoy = offsetHoy * anchoDia;
            gridHtml += `<line x1="${xHoy}" y1="${32}" x2="${xHoy}" y2="${altoTotal}" stroke="#FF3B30" style="stroke:#FF3B30" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.7"/>`;
        }
    } else if (escala === 'semana') {
        // Semana: meses arriba, número de semana abajo, findes marcados
        const c = {
            mes: isDark ? '#E0E0E0' : 'rgba(0,0,0,0.7)',
            semana: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.75)',
            findeFill: isDark ? 'rgba(255,59,48,0.08)' : 'rgba(200,40,40,0.08)',
            lineMes: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
            lineSem: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
        };
        // Fines de semana
        for (let d = 0; d < diasTotales; d++) {
            const fecha = new Date(fechaInicio.getTime() + d * 86400000);
            if (fecha.getDay() === 0 || fecha.getDay() === 6) {
                const x = d * anchoDia;
                gridHtml += `<rect x="${x}" y="${headerHeight}" width="${anchoDia}" height="${altoTotal - headerHeight}" fill="${c.findeFill}" style="fill:${c.findeFill}" stroke="none"/>`;
            }
        }
        // Meses
        meses.forEach(m => {
            const x = ((m.start - fechaInicio) / 86400000) * anchoDia;
            const w = ((m.end.getTime() + 86400000 - m.start) / 86400000) * anchoDia;
            const centro = x + w / 2;
            gridHtml += `<text x="${centro}" y="${28}" font-size="11" fill="${c.mes}" style="fill:${c.mes}" font-family="system-ui" text-anchor="middle" font-weight="600">${m.name}</text>`;
            gridHtml += `<line x1="${x}" y1="${34}" x2="${x}" y2="${altoTotal}" stroke="${c.lineMes}" style="stroke:${c.lineMes}" stroke-width="1"/>`;
        });
        // Semanas
        let numSemana = 1;
        for (let d = 0; d < diasTotales; d += 7) {
            const x = d * anchoDia;
            gridHtml += `<line x1="${x}" y1="${34}" x2="${x}" y2="${altoTotal}" stroke="${c.lineSem}" style="stroke:${c.lineSem}" stroke-width="1"/>`;
            gridHtml += `<text x="${x + 4}" y="${headerHeight - 2}" font-size="11" fill="${c.semana}" style="fill:${c.semana}" font-family="system-ui" font-weight="600">S${numSemana}</text>`;
            numSemana++;
        }
        // Línea de hoy
        const hoy = new Date();
        const offsetHoy = Math.round((hoy - fechaInicio) / 86400000);
        if (offsetHoy > 0 && offsetHoy < diasTotales) {
            const xHoy = offsetHoy * anchoDia;
            gridHtml += `<line x1="${xHoy}" y1="${34}" x2="${xHoy}" y2="${altoTotal}" stroke="#FF3B30" style="stroke:#FF3B30" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.7"/>`;
        }
    } else if (escala === 'año') {
        // Año: trimestres con año visible
        const c = {
            qLabel: isDark ? '#E0E0E0' : 'rgba(0,0,0,0.7)',
            yearLabel: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
            lineQ: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
            findeFill: isDark ? 'rgba(255,59,48,0.06)' : 'rgba(200,40,40,0.06)'
        };
        // Fines de semana (solo en años para dar contexto)
        for (let d = 0; d < diasTotales; d++) {
            const fecha = new Date(fechaInicio.getTime() + d * 86400000);
            if (fecha.getDay() === 0 || fecha.getDay() === 6) {
                const x = d * anchoDia;
                gridHtml += `<rect x="${x}" y="${headerHeight}" width="${anchoDia}" height="${altoTotal - headerHeight}" fill="${c.findeFill}" style="fill:${c.findeFill}" stroke="none"/>`;
            }
        }
        const yearStart = fechaInicio.getFullYear();
        const yearEnd = new Date(fechaInicio.getTime() + diasTotales * 86400000).getFullYear();
        for (let yr = yearStart; yr <= yearEnd; yr++) {
            // Línea de inicio de año
            const xYear = Math.max(0, ((new Date(yr, 0, 1) - fechaInicio) / 86400000) * anchoDia);
            gridHtml += `<line x1="${xYear}" y1="${headerHeight}" x2="${xYear}" y2="${altoTotal}" stroke="${c.lineQ}" style="stroke:${c.lineQ}" stroke-width="1.5"/>`;
            gridHtml += `<text x="${xYear + 4}" y="${headerHeight - 6}" font-size="12" fill="${c.yearLabel}" style="fill:${c.yearLabel}" font-family="system-ui" font-weight="700">${yr}</text>`;
            for (let q = 0; q < 4; q++) {
                const qStart = new Date(yr, q * 3, 1);
                const qEnd = new Date(yr, (q + 1) * 3, 0);
                const x = Math.max(0, ((qStart - fechaInicio) / 86400000) * anchoDia);
                const w = Math.max(1, ((qEnd.getTime() + 86400000 - Math.max(fechaInicio.getTime(), qStart.getTime())) / 86400000) * anchoDia);
                if (x >= anchoTotal) break;
                const centro = x + w / 2;
                gridHtml += `<text x="${centro}" y="${26}" font-size="12" fill="${c.qLabel}" style="fill:${c.qLabel}" font-family="system-ui" text-anchor="middle" font-weight="600">Q${q + 1}</text>`;
                gridHtml += `<line x1="${x}" y1="${32}" x2="${x}" y2="${altoTotal}" stroke="${c.lineQ}" style="stroke:${c.lineQ}" stroke-width="0.5"/>`;
            }
        }
        // Línea de hoy
        const hoy = new Date();
        const offsetHoy = Math.round((hoy - fechaInicio) / 86400000);
        if (offsetHoy > 0 && offsetHoy < diasTotales) {
            const xHoy = offsetHoy * anchoDia;
            gridHtml += `<line x1="${xHoy}" y1="${32}" x2="${xHoy}" y2="${altoTotal}" stroke="#FF3B30" style="stroke:#FF3B30" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.7"/>`;
        }
    } else {
        // Mes: nombre del mes + año
        const c = {
            mes: isDark ? '#E0E0E0' : 'rgba(0,0,0,0.7)',
            lineMes: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
            lineSem: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
            findeFill: isDark ? 'rgba(255,59,48,0.08)' : 'rgba(200,40,40,0.06)'
        };
        // Fines de semana
        for (let d = 0; d < diasTotales; d++) {
            const fecha = new Date(fechaInicio.getTime() + d * 86400000);
            if (fecha.getDay() === 0 || fecha.getDay() === 6) {
                const x = d * anchoDia;
                gridHtml += `<rect x="${x}" y="${headerHeight}" width="${anchoDia}" height="${altoTotal - headerHeight}" fill="${c.findeFill}" style="fill:${c.findeFill}" stroke="none"/>`;
            }
        }
        meses.forEach(m => {
            const x = ((m.start - fechaInicio) / 86400000) * anchoDia;
            const w = ((m.end.getTime() + 86400000 - m.start) / 86400000) * anchoDia;
            const centro = x + w / 2;
            gridHtml += `<text x="${centro}" y="${headerHeight - 6}" font-size="11" fill="${c.mes}" style="fill:${c.mes}" font-family="system-ui" text-anchor="middle" font-weight="600">${m.name}</text>`;
            gridHtml += `<line x1="${x}" y1="${headerHeight}" x2="${x}" y2="${altoTotal}" stroke="${c.lineMes}" style="stroke:${c.lineMes}" stroke-width="1"/>`;
        });
        // Grid semanas
        for (let d = 0; d < diasTotales; d += 7) {
            const x = d * anchoDia;
            gridHtml += `<line x1="${x}" y1="${headerHeight}" x2="${x}" y2="${altoTotal}" stroke="${c.lineSem}" style="stroke:${c.lineSem}" stroke-width="1"/>`;
        }
        // Línea de hoy
        const hoy = new Date();
        const offsetHoy = Math.round((hoy - fechaInicio) / 86400000);
        if (offsetHoy > 0 && offsetHoy < diasTotales) {
            const xHoy = offsetHoy * anchoDia;
            gridHtml += `<line x1="${xHoy}" y1="${headerHeight}" x2="${xHoy}" y2="${altoTotal}" stroke="#FF3B30" style="stroke:#FF3B30" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.7"/>`;
        }
    }

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
        const color = esCritico ? '#FF3B30' : (elem.tipo === 'actividad' ? '#007AFF' : (elem.tipo === 'entregable' ? '#00A859' : (elem.tipo === 'hito' ? '#FF9500' : '#888')));

        barPositions[elem.id] = { x, y: y - 8, w: Math.max(w, 8), h: 16, id: elem.id };

        const barH = elem.tipo === 'hito' ? 12 : 16;
        const barY = y - barH / 2;

        barsHtml += `<g class="crono-bar-wrapper" data-id="${elem.id}">`;

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
                barsHtml += `<rect class="crono-bar-base" data-id="${elem.id}" x="${baseX}" y="${barY - 7}" width="${Math.max(baseW, 8)}" height="4" rx="2" fill="none" stroke="#FFB800" stroke-width="1.5" stroke-dasharray="3,2" opacity="0.85"/>`;
            }
        }

        // Sombra
        barsHtml += `<rect x="${x + 1}" y="${barY + 1}" width="${Math.max(w, 8)}" height="${barH}" rx="4" fill="rgba(0,0,0,0.2)" style="fill:rgba(0,0,0,0.2)"/>`;

        // Barra principal
        barsHtml += `<rect class="crono-bar" x="${x}" y="${barY}" width="${Math.max(w, 8)}" height="${barH}" rx="4" fill="${color}" style="fill:${color}" opacity="${elem.tipo === 'hito' ? 0.9 : 0.75}" stroke="${esCritico ? '#FF3B30' : 'transparent'}" stroke-width="${esCritico ? 2 : 0}"/>`;

        // Progreso
        if (elem.progreso > 0 && elem.duracion > 0) {
            const pw = Math.max(w * (elem.progreso / 100), 4);
            barsHtml += `<rect x="${x}" y="${barY}" width="${Math.min(pw, Math.max(w, 8))}" height="${barH}" rx="4" fill="${color}" style="fill:${color}" opacity="0.9"/>`;
        }

        // Fecha fin planificada
        const fechaFin = elem.duracion > 0 ? sumarDiasHabiles(elem.inicio, elem.duracion) : elem.inicio;

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
                const realColor = elem.finReal ? (esTarde ? '#FF3B30' : '#00A859') : '#FF9500';
                const realBarH = 5;
                const realBarY = barY + barH + 2;
                barsHtml += `<rect x="${realX}" y="${realBarY}" width="${Math.max(realWidth, 4)}" height="${realBarH}" rx="2" fill="${realColor}" style="fill:${realColor}" opacity="0.85"/>`;
                if (realEndStr) {
                    barsHtml += `<text x="${realX + Math.max(realWidth, 4) + 3}" y="${realBarY + realBarH - 1}" font-size="9" font-weight="500" fill="${realColor}" style="fill:${realColor}" font-family="system-ui" text-anchor="start">${escapeHtml(realEndStr)}</text>`;
                }
            }
        }

        // Fecha inicio (antes de la barra)
        barsHtml += `<text x="${x - 5}" y="${y + 4}" font-size="10" font-weight="500" fill="${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.55)'}" style="fill:${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.55)'}" font-family="system-ui" text-anchor="end">${escapeHtml(elem.inicio)}</text>`;

        // Nombre (dentro de la barra)
        const label = elem.nombre.length > 25 ? elem.nombre.substring(0, 22) + '…' : elem.nombre;
        barsHtml += `<text x="${x + 5}" y="${y + 4}" font-size="12" fill="${isDark ? '#fff' : 'rgba(0,0,0,0.85)'}" style="fill:${isDark ? '#fff' : 'rgba(0,0,0,0.85)'}" font-family="system-ui" font-weight="600" text-anchor="start">${escapeHtml(label)}</text>`;

        // Fecha fin (después de la barra)
        barsHtml += `<text x="${x + Math.max(w, 8) + 5}" y="${y + 4}" font-size="10" font-weight="500" fill="${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.55)'}" style="fill:${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.55)'}" font-family="system-ui" text-anchor="start">${escapeHtml(fechaFin)}</text>`;

        // Handle de arrastre para dependencias (círculo al final de la barra)
        if (elem.tipo !== 'hito') {
            barsHtml += `<circle class="crono-drag-handle" data-id="${elem.id}" cx="${x + Math.max(w, 8)}" cy="${y}" r="5" fill="${color}" style="fill:${color}" opacity="0" cursor="crosshair"/>`;
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
            connectionsHtml += `<path d="${path}" fill="none" style="fill:none" stroke="${esCrit ? '#FF3B30' : (isDark ? '#999' : '#000')}" stroke-width="${esCrit ? 1.5 : 1}" marker-end="${marker}" class="crono-arrow" data-from="${p.id}" data-to="${elem.id}"/>`;
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
            this.querySelectorAll('.crono-bar').forEach(b => b.setAttribute('opacity', '0.9'));
        });
        w.addEventListener('mouseleave', function() {
            const handle = this.querySelector('.crono-drag-handle');
            if (handle && !state.editandoDependencia) handle.setAttribute('opacity', '0');
            this.querySelectorAll('.crono-bar').forEach(b => b.setAttribute('opacity', '0.75'));
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
    const elem = (proyecto[cronogramaActivo.dataKey] || []).find(e => e.id === toId);
    if (!elem) return;
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
    // Inicializar fechas: respetar la fecha manual de cada tarea; las dependencias solo pueden retrasarla
    const taskDate = {};
    tasks.forEach(t => {
        taskDate[t.id] = t.inicio ? parseLocalDate(t.inicio) : new Date(proyInicio);
    });
    // Aplicar dependencias en orden topológico
    orden.forEach(id => {
        const t = tasks.find(x => x.id === id);
        if (!t) return;
        (t.predecesores || []).forEach(p => {
            if (!ids.has(p.id)) return;
            if (!taskDate[p.id]) return;
            let nuevaFecha = new Date(taskDate[p.id]);
            if (p.tipo === 'FS') {
                // Sumar días hábiles de duración del predecesor
                nuevaFecha = parseLocalDate(sumarDiasHabiles(formatLocalDate(nuevaFecha), duracion[p.id]));
            } else if (p.tipo === 'SS') {
                // Misma fecha de inicio
            } else if (p.tipo === 'FF') {
                // El sucesor termina cuando el predecesor termina: inicio = fin del predecesor - duración hábil del sucesor
                const finPred = parseLocalDate(sumarDiasHabiles(formatLocalDate(nuevaFecha), duracion[p.id]));
                const iniSucesor = parseLocalDate(sumarDiasHabiles(formatLocalDate(finPred), -duracion[id]));
                nuevaFecha = iniSucesor || finPred;
            } else if (p.tipo === 'SF') {
                // El sucesor termina cuando el predecesor empieza: inicio = inicio predecesor - duración hábil del sucesor
                const iniSucesor = parseLocalDate(sumarDiasHabiles(formatLocalDate(nuevaFecha), -duracion[id]));
                nuevaFecha = iniSucesor || nuevaFecha;
            }
            // Aplicar retraso (días hábiles)
            if (p.retraso) {
                nuevaFecha = parseLocalDate(sumarDiasHabiles(formatLocalDate(nuevaFecha), p.retraso));
            }
            if (nuevaFecha && nuevaFecha > taskDate[id]) {
                taskDate[id] = new Date(nuevaFecha);
            }
        });
    });
    // Escribir fechas de vuelta a los elementos: la fecha manual se respeta tal cual;
    // solo se normaliza a día hábil cuando la fecha proviene del cálculo de dependencias
    tasks.forEach(t => {
        const manual = parseLocalDate(t.inicio);
        let fechaStr;
        if (manual && !(taskDate[t.id] > manual)) {
            fechaStr = formatLocalDate(manual);
        } else {
            fechaStr = formatLocalDate(siguienteDiaHabil(taskDate[t.id] || proyInicio));
        }
        if (t.inicio !== fechaStr) {
            t.inicio = fechaStr;
        }
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
    el.innerHTML = `
        <span class="info-chip critical"> Ruta crítica: ${nombres.join(' → ') || '—'} (${durStr})</span>
        <span class="info-chip"> Holgura total: ${float.toFixed(1)} días</span>
        <span class="info-chip"> Elementos: ${(proyecto[ctx.dataKey] || []).length}</span>
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
    _getState(ctx).escala = escala;
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
    renderizarCronograma(ctx);
    const btn = document.getElementById(ctx.btnToggleVistaId);
    if (btn) btn.textContent = state.vista === 'gantt' ? ' Tarjetas' : ' Gantt';
}

function renderizarVistaTarjetas(elementos, ctx) {
    const container = document.getElementById(ctx.containerId);
    if (!container) return;
    const cpmRef = _getCpmResult(ctx);

    // Ensure WBS codes are set (safe inline version, no re-render)
    elementos.forEach(e => {
        if (!e.codigo) e.codigo = String(e.id).slice(-4);
    });

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

    // All EDTs sorted by depth then code
    const edtsOrdenados = [...elementos.filter(e => e.tipo === 'edt')].sort((a, b) => {
        const dA = calcularProfundidad(a.id, elementos);
        const dB = calcularProfundidad(b.id, elementos);
        if (dA !== dB) return dA - dB;
        return (a.codigo || '').localeCompare(b.codigo || '');
    });

    // Build column order: ALL EDTs, then "sin-edt" if it has items
    const colOrder = [];
    edtsOrdenados.forEach(e => {
        if (!colOrder.includes(e.id)) colOrder.push(e.id);
        if (!grupos[e.id]) grupos[e.id] = { nombre: getNombreElemento(e.id), items: [] };
    });
    if (grupos['sin-edt']) colOrder.push('sin-edt');

    let html = `<div class="tv-container"><div class="tv-grid">`;

    colOrder.forEach(gId => {
        const g = grupos[gId];
        if (!g || g.items.length === 0) return;
        const edtNombre = gId === 'sin-edt' ? 'Sin EDT' : escapeHtml(g.nombre);
        html += `<div class="tv-group-header">${edtNombre} <span class="tv-group-count">${g.items.length} elementos</span></div>`;
        g.items.forEach(elem => {
            const icono = getTipoIcono(elem.tipo);
            const esCritico = critSet.has(elem.id);
            const pct = elem.progreso || 0;
            const critOrder = esCritico ? (cpmRef.criticalPath.indexOf(elem.id) + 1) : 0;
            html += `<div class="tv-card ${esCritico ? 'tv-card-critical' : ''}" data-id="${elem.id}" data-type="${elem.tipo}">
                ${critOrder > 0 ? `<div class="tv-card-order">${critOrder}</div>` : ''}
                <div class="tv-card-header">
                    <span class="tv-card-icon">${icono}</span>
                    <span class="tv-card-type">${elem.tipo}</span>
                    ${esCritico ? '<span class="tv-badge-crit">CP</span>' : ''}
                    <span class="tv-card-id">${elem.codigo || ''}</span>
                </div>
                <div class="tv-card-name">${escapeHtml(elem.nombre)}</div>
                <div class="tv-card-dates">${elem.inicio || '—'}${elem.duracion > 0 ? ' · ' + (elem.tipoDuracion === 'horas' && elem.duracionHoras ? elem.duracionHoras + 'h' : elem.duracion + 'd') : ''}</div>
                <div class="tv-card-bar"><div class="tv-card-bar-fill" style="width:${pct}%"></div></div>
                <div class="tv-card-footer">
                    <span class="tv-card-resp">${escapeHtml(elem.responsable || '—')}</span>
                    <span class="tv-card-pct">${pct}%</span>
                </div>
                <div class="tv-card-meta">
                    <span class="tv-card-recurso">${elem.recursoAsignado ? escapeHtml(elem.recursoAsignado.nombre) + (elem.recursoAsignado.rol ? ' (' + escapeHtml(elem.recursoAsignado.rol) + ')' : '') : '—'}</span>
                    <span class="tv-card-coste">${elem.costeEstimado ? elem.costeEstimado + ' ' + (elem.recursoAsignado?.moneda || '€') : ''}</span>
                </div>
            </div>`;
        });
    });
    html += `</div></div>`;

    container.innerHTML = html;

    // ── Dependency arrows overlay (simplified for grid) ──
    const gridEl = container.querySelector('.tv-grid');
    if (gridEl) {
        if (gridEl._tvResizeObserver) gridEl._tvResizeObserver.disconnect();
        const dibujarFlechasTarjetas = () => {
            const existingSvg = gridEl.querySelector('.tv-arrows-svg');
            if (existingSvg) existingSvg.remove();
            const gridRect = gridEl.getBoundingClientRect();
            const cards = container.querySelectorAll('.tv-card');
            const cardMap = {};
            cards.forEach(c => {
                const id = parseInt(c.dataset.id);
                if (!isNaN(id)) cardMap[id] = c;
            });
            const taskIds = new Set(noEdts.map(e => e.id));
            const links = [];
            noEdts.forEach(elem => {
                (elem.predecesores || []).forEach(p => {
                    if (!taskIds.has(p.id)) return;
                    const fromCard = cardMap[p.id];
                    const toCard = cardMap[elem.id];
                    if (fromCard && toCard) links.push({ from: fromCard, to: toCard, tipo: p.tipo || 'FS', crit: critSet.has(elem.id) && critSet.has(p.id) });
                });
            });
            if (!links.length) return;

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'tv-arrows-svg');
            svg.style.position = 'absolute';
            svg.style.top = '0';
            svg.style.left = '0';
            svg.style.width = '100%';
            svg.style.height = '100%';
            svg.style.pointerEvents = 'none';
            svg.style.overflow = 'visible';
            svg.style.zIndex = '0';
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const _tvDark = document.documentElement.getAttribute('data-theme') !== 'light';
            defs.innerHTML = `<marker id="tvArrowFS" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0, 7 2.5, 0 5" fill="${_tvDark ? '#ccc' : '#000'}"/></marker>
                <marker id="tvArrowCrit" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0, 7 2.5, 0 5" fill="#FF3B30"/></marker>`;
            svg.appendChild(defs);

            const linkData = links.map(l => {
                const fr = l.from.getBoundingClientRect();
                const tr = l.to.getBoundingClientRect();
                const x1 = fr.right - gridRect.left;
                const y1 = fr.top + fr.height / 2 - gridRect.top;
                const x2 = tr.left - gridRect.left;
                const y2 = tr.top + tr.height / 2 - gridRect.top;
                return { x1, y1, x2, y2, ...l };
            });

            linkData.forEach(ld => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const mx = (ld.x1 + ld.x2) / 2;
                path.setAttribute('d', `M ${ld.x1} ${ld.y1} C ${mx} ${ld.y1}, ${mx} ${ld.y2}, ${ld.x2} ${ld.y2}`);
                path.setAttribute('fill', 'none');
                const _tvColor = _tvDark ? '#999' : '#000';
                path.setAttribute('stroke', ld.crit ? '#FF3B30' : _tvColor);
                path.setAttribute('stroke-width', ld.crit ? '1.5' : '1');
                path.setAttribute('marker-end', ld.crit ? 'url(#tvArrowCrit)' : 'url(#tvArrowFS)');
                svg.appendChild(path);

                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', ld.x1);
                circle.setAttribute('cy', ld.y1);
                circle.setAttribute('r', '3');
                circle.setAttribute('fill', ld.crit ? '#FF3B30' : _tvColor);
                circle.setAttribute('stroke', '#fff');
                circle.setAttribute('stroke-width', '1');
                svg.appendChild(circle);
            });

            gridEl.style.position = 'relative';
            gridEl.appendChild(svg);
        };
        dibujarFlechasTarjetas();
        gridEl._tvResizeObserver = new ResizeObserver(() => requestAnimationFrame(dibujarFlechasTarjetas));
        gridEl._tvResizeObserver.observe(gridEl);
    }
    container.querySelectorAll('.tv-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const elem = elementos.find(x => x.id === id);
            if (elem) mostrarDetalleElemento(elem);
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

// ─── CRUD: AÑADIR / EDITAR / ELIMINAR ──────────────────────────

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
                recursoInfo = { id: r.id, nombre: r.nombre, rol: r.rol, costeHora: r.costeHora, moneda: r.moneda, horasDia };
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
    elem.responsable = document.getElementById('editResponsable').value || '';
    const recursoId = document.getElementById('editRecursoId').value;
    if (recursoId && proyecto.equipo) {
        const r = proyecto.equipo.find(x => x.id == recursoId);
        if (r) {
            const hTot = elem.tipoDuracion === 'horas' ? (elem.duracionHoras || elem.duracion * (elem.horasDia || 8)) : elem.duracion * (elem.horasDia || 8);
            elem.costeEstimado = hTot * r.costeHora;
            elem.recursoAsignado = { id: r.id, nombre: r.nombre, rol: r.rol, costeHora: r.costeHora, moneda: r.moneda, horasDia: elem.horasDia };
        }
    } else {
        elem.recursoAsignado = null;
        elem.costeEstimado = 0;
    }
    elem.dependeDe = parseInt(document.getElementById('editDependeDe').value) || null;
    autoScheduler(proyecto[cronogramaActivo.dataKey]);
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
        proyecto[cronogramaActivo.dataKey] = (proyecto[cronogramaActivo.dataKey] || []).filter(e => e.id !== id);
        proyecto[cronogramaActivo.dataKey].forEach(e => {
            if (e.predecesores) e.predecesores = e.predecesores.filter(p => p.id !== id);
        });
        autoScheduler(proyecto[cronogramaActivo.dataKey]);
        recalcularEdtAuto();
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
    ids.forEach(id => {
        const e = (proyecto[cronogramaActivo.dataKey] || []).find(x => x.id === id);
        if (!e) return;
        if (r) e.responsable = r;
        if (d && !isNaN(parseInt(d))) e.duracion = parseInt(d);
        if (des && e.inicio) e.inicio = sumarDias(e.inicio, des);
    });
    autoScheduler(proyecto[cronogramaActivo.dataKey]);
    recalcularEdtAuto();
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
            prevHtml += `<tr><td>${i+1}</td><td>${e.tipo}</td><td>${escapeHtml(e.nombre.substring(0, 30))}</td><td>${durStr}</td><td>${e.inicio || '—'}</td><td style="font-size:10px">${escapeHtml(predStr)}</td></tr>`;
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
        // Detectar delimitador
        const firstLine = raw.split('\n')[0];
        const comma = (firstLine.match(/,/g) || []).length;
        const semicolon = (firstLine.match(/;/g) || []).length;
        const tab = (firstLine.match(/\t/g) || []).length;
        let sep = ',';
        if (semicolon > comma && semicolon > tab) sep = ';';
        if (tab > comma && tab > semicolon) sep = '\t';
        const lines = raw.split(/\r?\n/).filter(l => l.trim());
        if (lines.length < 1) { mostrarToast('CSV vacío o sin datos', 'error'); return; }
        const headers = lines[0].split(sep).map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
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
            rows = lines.map(l => l.split(sep).map(v => v.replace(/^"|"$/g, '').trim()));
        } else {
            rows = [];
            for (let i = 1; i < lines.length; i++) {
                const vals = lines[i].split(sep).map(v => v.replace(/^"|"$/g, '').trim());
                rows.push(vals);
            }
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
            prevHtml += `<tr><td>${i+1}</td><td>${e.tipo}</td><td>${escapeHtml(e.nombre.substring(0, 30))}</td><td>${durStr}</td><td>${e.inicio || '—'}</td><td style="font-size:10px">${escapeHtml(predStr)}</td></tr>`;
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
            <td class="td-fecha">${e.inicio || '—'}</td>
            <td class="td-fecha">${e.duracion > 0 ? fin : '—'}</td>
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
    elem.inicioReal = document.getElementById('realInicio').value || null;
    elem.finReal = document.getElementById('realFin').value || null;
    elem.progreso = parseInt(document.getElementById('realProgreso').value);
    if (elem.inicioReal && elem.finReal) {
        elem.duracionReal = Math.ceil((parseLocalDate(elem.finReal) - parseLocalDate(elem.inicioReal)) / 86400000);
    }
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
            <div><strong>Inicio:</strong> ${elem.inicio || '—'}</div>
            <div><strong>Fin:</strong> ${finHabiles}</div>
            <div><strong>Duración:</strong> ${durLabel}</div>
            <div><strong>Duración real:</strong> ${elem.duracion > 0 ? duracionReal + ' días naturales' : '—'}</div>
            <div><strong>Progreso:</strong> ${progreso}%</div>
            <div><strong>Responsable:</strong> ${elem.responsable || '—'}</div>
            <div><strong>Recurso:</strong> ${recurso}</div>
            ${elem.costeEstimado ? `<div><strong>Coste est.:</strong> ${elem.costeEstimado} ${elem.recursoAsignado?.moneda || ''}</div>` : ''}
            ${elem.costeReal ? `<div><strong>Coste real:</strong> ${elem.costeReal} ${elem.recursoAsignado?.moneda || ''}</div>` : ''}
            ${elem.inicioReal ? `<div><strong>Inicio real:</strong> ${elem.inicioReal}</div>` : ''}
            ${elem.finReal ? `<div><strong>Fin real:</strong> ${elem.finReal}</div>` : ''}
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
                    <div style="font-size:11px;color:var(--text-muted)">${lb.fecha} · ${nTareas} tareas</div>
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
    const lineas = _getLineasBase();
    lineas.push({
        id: Date.now(),
        nombre,
        fecha: formatLocalDate(new Date()),
        elementos
    });
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
    proyecto.lineasBase = _getLineasBase().filter(x => x.id !== id);
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
    const actualList = proyecto[cronogramaActivo.dataKey] || [];
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
                    <td>${be.inicio || '—'}</td>
                    <td colspan="2" style="color:#E53935;font-weight:600">Eliminada del cronograma</td>
                    <td>${finBase || '—'}</td>
                    <td colspan="2"><span style="color:#E53935;font-weight:600">—</span></td>
                </tr>` });
            return;
        }
        const durBase = be.duracion || 0;
        const durAct = ae.duracion || 0;
        const dDur = durAct - durBase;
        filas.push({ nombre, tipo, html: `
            <tr>
                <td>${icono} ${escapeHtml(nombre)}</td>
                <td>${be.inicio || '—'}</td>
                <td>${ae.inicio || '—'}</td>
                <td>${_fmtDesvio(dIni)}</td>
                <td>${finBase || '—'}</td>
                <td>${finAct || '—'}</td>
                <td>${_fmtDesvio(dFin)}</td>
                <td>${durBase}d → ${durAct}d ${dDur !== 0 ? _fmtDesvio(dDur) : ''}</td>
            </tr>` });
    });
    actualList.forEach(ae => {
        if (!baseById.has(ae.id)) {
            filas.push({ nombre: ae.nombre, nueva: true, html: `
                <tr style="opacity:0.85">
                    <td>${getTipoIcono(ae.tipo)} ${escapeHtml(ae.nombre)}</td>
                    <td colspan="2" style="color:#00A859;font-weight:600">Nueva tarea</td>
                    <td>${_fmtDesvio(null)}</td>
                    <td>—</td>
                    <td>${ae.inicio || '—'}</td>
                    <td>${_fmtDesvio(null)}</td>
                    <td>— → ${ae.duracion || 0}d</td>
                </tr>` });
        }
    });

    const retrasadas = filas.filter(f => !f.eliminada && !f.nueva && f.html.includes('retraso')).length;
    const adelantadas = filas.filter(f => f.html.includes('adelanto')).length;
    const resumen = `<div style="display:flex;gap:16px;font-size:12px;margin-bottom:10px;flex-wrap:wrap">
        <span><strong>${filas.length}</strong> tareas comparadas</span>
        <span style="color:#E53935"><strong>${retrasadas}</strong> con retraso</span>
        <span style="color:#00A859"><strong>${adelantadas}</strong> adelantadas</span>
        <span>Línea base: <strong>${escapeHtml(lb.nombre)}</strong> (${lb.fecha})</span>
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
