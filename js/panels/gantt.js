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
    escala: 'día'
};

let cpmResult = { criticalPath: [], totalFloat: 0 };
let _cronogramaOriginalHTML = null;

function cargarElementosGantt() {
    if (!proyecto.elementosGantt) proyecto.elementosGantt = [];
    if (proyecto.elementosGantt.length === 0) {
        const f = proyecto.fechaInicio || new Date().toISOString().split('T')[0];
        const t = Date.now();
        const edtId = t + 1;
        proyecto.elementosGantt = [
            { id: edtId, tipo: 'edt', nombre: '1. Inicio del Proyecto', inicio: '', duracion: 0, progreso: 0, responsable: '', dependeDe: null, predecesores: [] },
            { id: t + 2, tipo: 'actividad', nombre: 'Acta de Constitución', inicio: f, duracion: 3, progreso: 0, responsable: 'PM', dependeDe: edtId, predecesores: [] },
            { id: t + 3, tipo: 'entregable', nombre: 'Documento del Proyecto', inicio: f, duracion: 7, progreso: 0, responsable: '', dependeDe: edtId, predecesores: [] },
            { id: t + 4, tipo: 'hito', nombre: 'Aprobación del Acta', inicio: sumarDias(f, 7), duracion: 0, progreso: 100, responsable: '', dependeDe: edtId, predecesores: [] }
        ];
        guardarProyecto();
    }
    proyecto.elementosGantt.forEach(e => { if (!e.predecesores) e.predecesores = []; });
    renderizarCronograma();
}

function sumarDias(f, d) { if (!f) return ''; const p = f.split('-'); const dt = new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]) + d); return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0'); }
function parseLocalDate(str) { if (!str) return null; const p = str.split('-'); return new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2])); }
function formatLocalDate(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function diffDias(a, b) { const ta = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()); const tb = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()); return Math.round((ta - tb) / 86400000); }
function getNombreElemento(id) { const e = proyecto.elementosGantt?.find(x => x.id === id); return e ? e.nombre : '-'; }
function getTipoIcono(t) { return { edt: '', actividad: '', entregable: '', hito: '' }[t] || ''; }
function _migrarDuracionHoras() {
    if (!proyecto.elementosGantt) return;
    proyecto.elementosGantt.forEach(e => {
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

// ─── EDT AUTO-CALC ──────────────────────────────────────────────

function recalcularEdtAuto() {
    const elementos = proyecto.elementosGantt || [];
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

function ejecutarCPM(elementos) {
    const ids = new Set(elementos.map(e => e.id));
    const tasks = elementos.filter(e => e.tipo !== 'edt');
    if (!tasks.length) { cpmResult = { criticalPath: [], totalFloat: 0 }; return []; }
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

    cpmResult = { criticalPath, totalFloat: Object.values(float).length ? Math.min(...Object.values(float)) : 0 };
    return tasks;
}

// ─── RENDERIZAR CRONOGRAMA COMPLETO ─────────────────────────────

function renderizarCronograma() {
    const container = document.getElementById('cronogramaContainer');
    if (!container) return;

    // Migrar tareas existentes con tipo horas para usar duración fraccional
    _migrarDuracionHoras();

    // Sync scale selector
    const sel = document.querySelector('.crono-scale-select');
    if (sel) sel.value = ganttState.escala;
    // Save original Gantt DOM structure on first call
    if (!_cronogramaOriginalHTML && container.querySelector('#wbsTree')) {
        _cronogramaOriginalHTML = container.innerHTML;
    }

    autoScheduler();
    recalcularEdtAuto();
    const elementos = [...(proyecto.elementosGantt || [])];
    ejecutarCPM(elementos);

    if (ganttState.vista === 'tarjetas') {
        renderizarVistaTarjetas(elementos);
        renderizarInfoBar();
        return;
    }

    // Restore original HTML if it was replaced by tarjetas view
    if (_cronogramaOriginalHTML && !container.querySelector('#wbsTree')) {
        container.innerHTML = _cronogramaOriginalHTML;
    }

    const fechaInicioProy = calcularInicioProyecto(elementos);
    const fechaFinProy = calcularFinProyecto(elementos);
    const spanFechas = document.getElementById('cronoFechasProyecto');
    if (spanFechas) {
        const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        spanFechas.textContent = ` ${fmt(fechaInicioProy)} → ${fmt(fechaFinProy)} (${Math.round((fechaFinProy - fechaInicioProy) / 86400000)} días naturales)`;
    }
    const diasTotales = Math.max(1, Math.ceil((fechaFinProy - fechaInicioProy) / 86400000) + 60);

    const meses = generarMeses(fechaInicioProy, diasTotales);
    const anchoDia = ({día:50,semana:14,mes:28,año:6})[ganttState.escala] * ganttState.zoom || 28 * ganttState.zoom;
    const anchoTotal = diasTotales * anchoDia;
    const headerHeight = ganttState.escala === 'día' ? 60 : 40;

    // Orden único para árbol + timeline
    const ordenArbol = getOrdenArbol(elementos);

    renderizarArbolWBS(ordenArbol, elementos, headerHeight);
    renderizarTimelineSVG(ordenArbol, elementos, fechaInicioProy, diasTotales, anchoDia, meses, anchoTotal);
    renderizarInfoBar();
    actualizarZoomLabel();

    // Scroll sincronizado entre WBS y timeline
    const wbsPanel = document.getElementById('wbsTree');
    const tlPanel = document.getElementById('timelinePanel');
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

function getOrdenArbol(elementos) {
    const orden = [];
    function walk(parentId) {
        const hijos = elementos.filter(e => e.dependeDe === parentId || (!e.dependeDe && parentId === null))
            .sort((a, b) => (a.codigo || '').localeCompare(b.codigo || ''));
        hijos.forEach(h => {
            orden.push(h);
            if (h.tipo === 'edt' && !ganttState.collapsed.has(h.id)) walk(h.id);
        });
    }
    walk(null);
    return orden;
}

// ─── ÁRBOL WBS (IZQUIERDA) ──────────────────────────────────────

function renderizarArbolWBS(orden, elementos, headerH) {
    const el = document.getElementById('wbsTree');
    if (!el) return;
    const critSet = new Set(cpmResult.criticalPath || []);
    let html = `<div style="height:${headerH}px;flex-shrink:0"></div>`;
    orden.forEach(elem => {
        const depth = calcularProfundidad(elem.id, elementos);
        const icono = getTipoIcono(elem.tipo);
        const esCritico = critSet.has(elem.id);
        const sel = ganttState.selectedId === elem.id ? 'wbs-selected' : '';
        const colapsado = ganttState.collapsed.has(elem.id);
        const tieneHijos = elem.tipo === 'edt' && elementos.some(x => x.dependeDe === elem.id);

        html += `<div class="wbs-item ${sel}" data-id="${elem.id}" data-type="${elem.tipo}" style="padding-left:${depth * 18}px">`;
        if (tieneHijos) {
            html += `<span class="wbs-toggle" data-id="${elem.id}">${colapsado ? '' : '▼'}</span>`;
        } else {
            html += `<span class="wbs-toggle-placeholder"></span>`;
        }
        html += `<span class="wbs-icon">${icono}</span>`;
        html += `<span class="wbs-name ${esCritico ? 'wbs-critical' : ''}">${escapeHtml(elem.nombre)}</span>`;
        if (elem.duracion > 0)
            html += `<span class="wbs-dur">${
                elem.tipoDuracion === 'horas' && elem.duracionHoras
                    ? elem.duracionHoras + 'h'
                    : (elem.duracion < 1 ? (Math.round(elem.duracion * 100) / 100) + 'd' : elem.duracion + 'd')
            }</span>`;
        if (esCritico) html += `<span class="wbs-badge-crit">CP</span>`;
        html += `</div>`;
    });
    el.innerHTML = html;
    document.querySelectorAll('.wbs-toggle').forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            if (ganttState.collapsed.has(id)) ganttState.collapsed.delete(id);
            else ganttState.collapsed.add(id);
            renderizarCronograma();
        };
    });
    document.querySelectorAll('.wbs-item').forEach(item => {
        item.onclick = function() {
            const id = parseInt(this.dataset.id);
            const elem = proyecto.elementosGantt?.find(x => x.id === id);
            ganttState.selectedId = id;
            document.querySelectorAll('.wbs-item').forEach(x => x.classList.remove('wbs-selected'));
            this.classList.add('wbs-selected');
            resaltarBarraEnTimeline(id);
            if (elem) mostrarDetalleElemento(elem);
        };
    });
    // Doble clic → editar (solo no-EDT; EDTs tienen su propio manejador en edt-panel.js)
    document.querySelectorAll('.wbs-item[data-type="actividad"], .wbs-item[data-type="entregable"], .wbs-item[data-type="hito"]').forEach(item => {
        item.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            editarElementoGantt(parseInt(this.dataset.id));
        });
    });
    // Context menu (clic derecho)
    document.querySelectorAll('.wbs-item').forEach(item => {
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

function resaltarBarraEnTimeline(id) {
    document.querySelectorAll('.crono-bar-wrapper').forEach(b => b.classList.remove('bar-selected'));
    document.querySelectorAll(`.crono-bar-wrapper[data-id="${id}"]`).forEach(b => b.classList.add('bar-selected'));
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

function renderizarTimelineSVG(ordenArbol, elementos, fechaInicio, diasTotales, anchoDia, meses, anchoTotal) {
    const svg = document.getElementById('timelineSvg');
    if (!svg) return;

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const headerHeight = ganttState.escala === 'día' ? 60 : 40;
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
    const escala = ganttState.escala;

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
    const critSet = new Set(cpmResult.criticalPath || []);
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
            const pred = proyecto.elementosGantt?.find(x => x.id === p.id);
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
    document.querySelectorAll('.crono-drag-handle').forEach(h => {
        h.addEventListener('mouseenter', function() { this.setAttribute('opacity', '0.6'); });
        h.addEventListener('mouseleave', function() { if (!ganttState.editandoDependencia) this.setAttribute('opacity', '0'); });
        h.addEventListener('mousedown', iniciarDragDependencia);
    });

    document.querySelectorAll('.crono-bar-wrapper').forEach(w => {
        w.addEventListener('mouseenter', function() {
            const handle = this.querySelector('.crono-drag-handle');
            if (handle && !ganttState.editandoDependencia) handle.setAttribute('opacity', '0.6');
            this.querySelectorAll('.crono-bar').forEach(b => b.setAttribute('opacity', '0.9'));
        });
        w.addEventListener('mouseleave', function() {
            const handle = this.querySelector('.crono-drag-handle');
            if (handle && !ganttState.editandoDependencia) handle.setAttribute('opacity', '0');
            this.querySelectorAll('.crono-bar').forEach(b => b.setAttribute('opacity', '0.75'));
        });
    });

    // Tooltip en flechas
    document.querySelectorAll('.crono-arrow').forEach(a => {
        a.addEventListener('mouseenter', function() {
            const from = getNombreElemento(parseInt(this.dataset.from));
            const to = getNombreElemento(parseInt(this.dataset.to));
            const toElem = proyecto.elementosGantt?.find(e => e.id == this.dataset.to);
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
    ganttState.editandoDependencia = true;
    ganttState.dragPredecesor = fromId;

    const svg = document.getElementById('timelineSvg');
    const rect = svg.getBoundingClientRect();

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('id', 'dragLine');
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', 'rgba(0,122,255,0.7)');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '5,3');
    svg.appendChild(line);

    const fromBar = document.querySelector(`.crono-bar-wrapper[data-id="${fromId}"]`);
    if (fromBar) fromBar.classList.add('bar-dragging');

    function onMove(ev) {
        const cx = ev.clientX - rect.left + svg.parentElement.scrollLeft;
        const cy = ev.clientY - rect.top + svg.parentElement.scrollTop;
        const fromEl = document.querySelector(`.crono-bar-wrapper[data-id="${fromId}"]`);
        if (!fromEl) return;
        const fromRect = fromEl.querySelector('.crono-bar')?.getBoundingClientRect();
        if (!fromRect) return;
        const x1 = fromRect.right - rect.left + svg.parentElement.scrollLeft;
        const y1 = fromRect.top - rect.top + svg.parentElement.scrollTop + fromRect.height / 2;
        const midX = (x1 + cx) / 2;
        line.setAttribute('d', `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${cy}, ${cx} ${cy}`);

        // Hover sobre targets
        document.querySelectorAll('.crono-bar-wrapper').forEach(w => {
            const r = w.querySelector('.crono-bar')?.getBoundingClientRect();
            if (!r) return;
            if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) {
                const id = parseInt(w.dataset.id);
                if (id !== fromId && proyecto.elementosGantt?.find(el => el.id === id)?.tipo !== 'edt') {
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

        const target = document.querySelector('.bar-target-hover');
        if (target) {
            const toId = parseInt(target.dataset.id);
            if (toId && toId !== fromId) {
                const elem = proyecto.elementosGantt?.find(e => e.id === toId);
                if (elem && !elem.predecesores?.some(p => p.id === fromId)) {
                    mostrarModalTipoDependencia(fromId, toId);
                }
            }
        }

        const dragLine = document.getElementById('dragLine');
        if (dragLine) dragLine.remove();
        document.querySelectorAll('.bar-dragging, .bar-target-hover').forEach(el => {
            el.classList.remove('bar-dragging', 'bar-target-hover');
        });
        ganttState.editandoDependencia = false;
        ganttState.dragPredecesor = null;
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
    const elem = proyecto.elementosGantt?.find(e => e.id === toId);
    if (!elem) return;
    if (!elem.predecesores) elem.predecesores = [];
    if (elem.predecesores.some(p => p.id === fromId)) return;
    elem.predecesores.push({ id: fromId, tipo, retraso });
    autoScheduler();
    guardarProyecto();
    renderizarCronograma();
    mostrarToast(` Dependencia ${tipo} creada`, 'success');
}

// ─── AUTO-SCHEDULER ─────────────────────────────────────────────

function autoScheduler() {
    const elementos = proyecto.elementosGantt;
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
    // Inicializar fechas: con predecesores → empiezan desde proyInicio; sin ellos → mantienen su fecha
    const taskDate = {};
    tasks.forEach(t => {
        const hasPreds = t.predecesores && t.predecesores.some(p => ids.has(p.id));
        if (hasPreds) {
            taskDate[t.id] = new Date(proyInicio);
        } else if (t.inicio) {
            taskDate[t.id] = parseLocalDate(t.inicio);
        } else {
            taskDate[t.id] = new Date(proyInicio);
        }
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
    // Escribir fechas de vuelta a los elementos, asegurando que no caigan en fin de semana
    tasks.forEach(t => {
        const d = siguienteDiaHabil(taskDate[t.id] || proyInicio);
        const fechaStr = formatLocalDate(d);
        if (t.inicio !== fechaStr) {
            t.inicio = fechaStr;
        }
    });
}

// ─── MODAL EDITAR DEPENDENCIA ──────────────────────────────────

function mostrarModalEditarDependencia(fromId, toId) {
    const fromName = getNombreElemento(fromId);
    const toName = getNombreElemento(toId);
    const elem = proyecto.elementosGantt?.find(e => e.id === toId);
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
        const e = proyecto.elementosGantt?.find(x => x.id === tId);
        const d = e?.predecesores?.find(p => p.id === fId);
        if (d) { d.tipo = tipo; d.retraso = retraso; }
        autoScheduler();
        guardarProyecto();
        renderizarCronograma();
        cerrarModalGeneric();
        mostrarToast(' Dependencia actualizada', 'success');
    };
    window.eliminarDependencia = function(fId, tId) {
        const e = proyecto.elementosGantt?.find(x => x.id === tId);
        if (e) {
            e.predecesores = (e.predecesores || []).filter(p => p.id !== fId);
        }
        autoScheduler();
        guardarProyecto();
        renderizarCronograma();
        cerrarModalGeneric();
        mostrarToast('Dependencia eliminada', 'info');
    };
}

// ─── INFO BAR ───────────────────────────────────────────────────

function renderizarInfoBar() {
    const el = document.getElementById('cronogramaInfoBar');
    if (!el) return;
    const critPath = cpmResult.criticalPath || [];
    const nombres = critPath.map(id => getNombreElemento(id)).filter(Boolean);
    const float = cpmResult.totalFloat || 0;
    let critDias = 0, critHoras = 0, todasHoras = true;
    critPath.forEach(id => {
        const e = proyecto.elementosGantt?.find(x => x.id === id);
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
        <span class="info-chip"> Elementos: ${proyecto.elementosGantt?.length || 0}</span>
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
    if (tipo === 'in') ganttState.zoom = Math.min(ganttState.zoom + 0.3, 3);
    else ganttState.zoom = Math.max(ganttState.zoom - 0.3, 0.4);
    actualizarZoomLabel();
    renderizarCronograma();
}

function actualizarZoomLabel() {
    const lbl = document.getElementById('cronoZoomLabel');
    if (lbl) lbl.textContent = Math.round(ganttState.zoom * 100) + '%';
}

function cambiarEscala(escala) {
    ganttState.escala = escala;
    renderizarCronograma();
}

function colapsarTodos() {
    (proyecto.elementosGantt || []).filter(e => e.tipo === 'edt').forEach(e => ganttState.collapsed.add(e.id));
    renderizarCronograma();
}

function expandirTodos() {
    ganttState.collapsed.clear();
    renderizarCronograma();
}

// ─── VISTA TARJETAS ──────────────────────────────────────────────

function toggleVistaCronograma() {
    ganttState.vista = ganttState.vista === 'gantt' ? 'tarjetas' : 'gantt';
    renderizarCronograma();
    const btn = document.getElementById('btnToggleVista');
    if (btn) btn.textContent = ganttState.vista === 'gantt' ? ' Tarjetas' : ' Gantt';
}

function renderizarVistaTarjetas(elementos) {
    const container = document.getElementById('cronogramaContainer');
    if (!container) return;

    // Ensure WBS codes are set (safe inline version, no re-render)
    elementos.forEach(e => {
        if (!e.codigo) e.codigo = String(e.id).slice(-4);
    });

    const critSet = new Set(cpmResult.criticalPath || []);
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
            const critOrder = esCritico ? (cpmResult.criticalPath.indexOf(elem.id) + 1) : 0;
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
    (proyecto.elementosGantt || []).filter(e => e.tipo === 'edt').forEach(edt => {
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
        if (!proyecto.elementosGantt) proyecto.elementosGantt = [];
        proyecto.elementosGantt.push(nuevo);
        console.debug('[gantt] NUEVO elemento añadido:', nuevo.nombre, '| tipo:', nuevo.tipo, '| inicio:', JSON.stringify(nuevo.inicio), '| dependeDe:', nuevo.dependeDe, '| duracion:', nuevo.duracion);
        autoScheduler();
        recalcularEdtAuto();
        guardarProyecto();
        renderizarCronograma();
        reordenarNumeracionElementos();
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
    const elem = proyecto.elementosGantt?.find(e => e.id === id);
    if (!elem) return;
    const codigo = elem.codigo || obtenerCodigoElemento(elem, proyecto.elementosGantt) || '';
    let edtOpts = '<option value="">-- Ninguno --</option>';
    (proyecto.elementosGantt || []).filter(e => e.tipo === 'edt' && e.id !== elem.id).forEach(edt => {
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
    const elem = proyecto.elementosGantt?.find(e => e.id === id);
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
    autoScheduler();
    recalcularEdtAuto();
    guardarProyecto();
    renderizarCronograma();
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
    reordenarNumeracionElementos();
}

function eliminarElementoGantt(id) {
    if (confirm('¿Eliminar este elemento?')) {
        proyecto.elementosGantt = proyecto.elementosGantt.filter(e => e.id !== id);
        proyecto.elementosGantt.forEach(e => {
            if (e.predecesores) e.predecesores = e.predecesores.filter(p => p.id !== id);
        });
        autoScheduler();
        recalcularEdtAuto();
        guardarProyecto();
        renderizarCronograma();
        mostrarToast(' Eliminado', 'success');
    }
}

function editarElementoMultiple() {
    const checkboxes = document.querySelectorAll('.select-elemento:checked');
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
        const e = proyecto.elementosGantt?.find(x => x.id === id);
        if (!e) return;
        if (r) e.responsable = r;
        if (d && !isNaN(parseInt(d))) e.duracion = parseInt(d);
        if (des && e.inicio) e.inicio = sumarDias(e.inicio, des);
    });
    autoScheduler();
    recalcularEdtAuto();
    guardarProyecto();
    renderizarCronograma();
    cerrarModalGeneric();
    mostrarToast(` ${ids.length} actualizados`, 'success');
}

function seleccionarTodosElementos() {
    const checkAll = document.getElementById('seleccionarTodos');
    document.querySelectorAll('.select-elemento').forEach(cb => cb.checked = checkAll.checked);
}

function ordenarElementosGantt(criterio) {
    if (!proyecto.elementosGantt) return;
    if (criterio === 'fecha') proyecto.elementosGantt.sort((a, b) => (a.inicio || '').localeCompare(b.inicio || ''));
    else if (criterio === 'tipo') {
        const ord = { edt: 1, actividad: 2, entregable: 3, hito: 4 };
        proyecto.elementosGantt.sort((a, b) => (ord[a.tipo] || 5) - (ord[b.tipo] || 5));
    }
    guardarProyecto();
    renderizarCronograma();
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

// ─── SINCRONIZAR ────────────────────────────────────────────────

function sincronizarElementosGantt() {
    if (proyecto.hitos && proyecto.hitos.length > 0) {
        proyecto.hitos.forEach(h => {
            if (!proyecto.elementosGantt.some(e => e.nombre === h.nombre && e.tipo === 'hito')) {
                proyecto.elementosGantt.push({
                    id: Date.now() + Math.random(), tipo: 'hito', nombre: h.nombre,
                    inicio: h.fecha || new Date().toISOString().split('T')[0],
                    duracion: 0, progreso: 100, responsable: '', dependeDe: null, predecesores: []
                });
            }
        });
    }
    if (proyecto.entregables && proyecto.entregables.length > 0) {
        proyecto.entregables.forEach(ent => {
            if (!proyecto.elementosGantt.some(e => e.nombre === ent.nombre && e.tipo === 'entregable')) {
                proyecto.elementosGantt.push({
                    id: Date.now() + Math.random(), tipo: 'entregable', nombre: ent.nombre,
                    inicio: ent.fechaPrevista || new Date().toISOString().split('T')[0],
                    duracion: ent.duracion || 5, progreso: ent.progreso || 0,
                    responsable: ent.responsable || '', dependeDe: null, predecesores: []
                });
            }
        });
    }
    guardarProyecto();
    renderizarCronograma();
    mostrarToast(' Sincronizado', 'success');
}

function actualizarFechasProyectoDesdeActa() {
    if (proyecto.acta?.fechaInicio && proyecto.elementosGantt) {
        proyecto.elementosGantt.forEach(e => {
            if (!e.inicioReal) e.inicio = proyecto.acta.fechaInicio;
        });
        guardarProyecto();
        renderizarCronograma();
        mostrarToast(' Fechas sincronizadas desde el acta', 'success');
    }
}

// ─── EXPORTAR ───────────────────────────────────────────────────

function exportarGantt() {
    let csv = "ID,Tipo,Nombre,Inicio,Duración,Progreso,Responsable,Predecesores\n";
    (proyecto.elementosGantt || []).forEach(e => {
        const preds = (e.predecesores || []).map(p => `${p.id}(${p.tipo})`).join(';');
        csv += `${e.id},${e.tipo},"${e.nombre}",${e.inicio || ''},${e.duracion},${e.progreso || 0},"${e.responsable || ''}","${preds}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gantt_${proyecto.nombre}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(' Exportado', 'success');
}

// ─── IMPORTAR CSV ─────────────────────────────────────────────

function importarCSV() {
    const html = `<div class="modal u-flex" id="genericModal">
        <div class="modal-content" style="max-width:600px">
            <div class="modal-header">
                <h3> Importar CSV</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <p style="font-size:13px;color:#888;margin:8px 0 16px">
                Selecciona un archivo CSV exportado de MS Project, Primavera u otra herramienta.
                Las columnas se detectan automáticamente.
            </p>
            <div id="csvDropZone" style="border:2px dashed rgba(255,255,255,0.2);border-radius:12px;padding:40px 20px;text-align:center;cursor:pointer;transition:border-color 0.2s"
                 ondragover="this.style.borderColor='#007AFF';event.preventDefault()"
                 ondrop="event.preventDefault();procesarCSV(event.dataTransfer.files[0])"
                 onclick="document.getElementById('csvFileInput').click()">
                <div style="font-size:40px;margin-bottom:8px"></div>
                <div style="font-weight:500">Arrastra un CSV aquí o haz clic para seleccionar</div>
                <div style="font-size:11px;color:#666;margin-top:4px">Formatos aceptados: .csv (comas, punto y coma, tabulaciones)</div>
            </div>
            <input type="file" id="csvFileInput" accept=".csv,.txt" style="display:none" onchange="procesarCSV(this.files[0])">
            <div id="csvPreview" style="margin-top:12px;max-height:300px;overflow:auto;font-size:12px"></div>
        </div>
    </div>`;
    document.getElementById('modalContainer').innerHTML = html;
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
        if (lines.length < 2) { mostrarToast('CSV vacío o sin datos', 'error'); return; }
        const headers = lines[0].split(sep).map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
        // Mapeo genérico de columnas
        const colMap = {};
        const namePatterns = [/^(id|wbs|código|codigo|code|task\s?id)$/i, /^(name|nombre|task\s?name|actividad|activity|tarea)$/i, /^(duration|duración|duracion|dur|work)$/i, /^(start|inicio|start\s?date|begin|comienzo)$/i, /^(finish|fin|end|end\s?date|final|due)$/i, /^(predecessors|predecesores|predecesoras|dependencies|depends|pred|predecesor)$/i, /^(resources|recursos|resource\s?names|asignado|responsible|responsable)$/i, /^(type|tipo|kind)$/i, /^(progress|progreso|%\s?complete|pct|avance)$/i, /^(status|estado)$/i];
        const colKeys = ['id', 'nombre', 'duracion', 'inicio', 'fin', 'predecesores', 'recurso', 'tipo', 'progreso', 'estado'];
        headers.forEach((h, i) => {
            for (let j = 0; j < namePatterns.length; j++) {
                if (namePatterns[j].test(h)) { colMap[colKeys[j]] = i; break; }
            }
        });
        if (colMap.nombre === undefined) { mostrarToast('No se encontró columna de nombre', 'error'); return; }

        const rows = [];
        for (let i = 1; i < lines.length; i++) {
            const vals = lines[i].split(sep).map(v => v.replace(/^"|"$/g, '').trim());
            rows.push(vals);
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

        // Normalizar fecha a YYYY-MM-DD
        function normalizarFecha(v) {
            if (!v) return '';
            const d = new Date(v);
            if (!isNaN(d.getTime())) return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
            // Intentar DD/MM/YYYY o DD-MM-YYYY
            const m = v.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
            if (m) return m[3] + '-' + String(parseInt(m[2])).padStart(2, '0') + '-' + String(parseInt(m[1])).padStart(2, '0');
            return v;
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
            const dur = parseDuracion(durRaw);
            const tipo = detectarTipo(nombre, colMap.tipo !== undefined ? vals[colMap.tipo] : null, dur);
            const inicio = colMap.inicio !== undefined ? normalizarFecha(vals[colMap.inicio]) : '';
            const finRaw = colMap.fin !== undefined ? normalizarFecha(vals[colMap.fin]) : '';
            const recurso = colMap.recurso !== undefined ? vals[colMap.recurso] : '';
            const progreso = colMap.progreso !== undefined ? parseFloat(vals[colMap.progreso]) || 0 : 0;
            const preds = colMap.predecesores !== undefined ? parsePredecesores(vals[colMap.predecesores], idx) : [];

            const elem = {
                id: Date.now() + idx,
                tipo,
                nombre,
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

function mostrarAnalisisDesviaciones() {
    const elementos = proyecto.elementosGantt || [];
    const conDesv = elementos.filter(e => calcularDesviacion(e) !== 0 && e.finReal);
    if (conDesv.length === 0) { mostrarToast('Sin desviaciones', 'success'); return; }
    let html = `<table class="data-table"><thead><tr><th>Elemento</th><th>Fin Plan</th><th>Fin Real</th><th>Desv</th></tr></thead><tbody>`;
    conDesv.forEach(e => {
        const d = calcularDesviacion(e);
        html += `<tr><td>${escapeHtml(e.nombre)}</td><td>${e.inicio?sumarDias(e.inicio,e.duracion):'-'}</td><td>${e.finReal||'-'}</td><td class="${d>0?'cashflow-negative':'cashflow-positive'}">${d>0?'+'+d:d}d</td></tr>`;
    });
    html += `</tbody></table>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">
        <div class="modal-content"><div class="modal-header"><h3> Desviaciones</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>${html}</div></div>`;
}

function calcularDesviacion(elem) {
    if (!elem.inicio || !elem.finReal) return 0;
    const finPlan = parseLocalDate(sumarDias(elem.inicio, elem.duracion));
    return Math.ceil((parseLocalDate(elem.finReal) - finPlan) / 86400000);
}

function recalcularCostesPorProgreso() {
    if (!proyecto.elementosGantt) return;
    let totalEst = 0, totalReal = 0;
    proyecto.elementosGantt.forEach(t => {
        if (t.tipo !== 'hito' && t.recursoAsignado) {
            const est = t.costeEstimado || 0;
            const real = est * ((t.progreso || 0) / 100);
            t.costeReal = real;
            totalEst += convertirMoneda(est, t.recursoAsignado.moneda || proyecto.monedaBase);
            totalReal += convertirMoneda(real, t.recursoAsignado.moneda || proyecto.monedaBase);
        }
    });
    guardarProyecto();
    calcularCashflow();
    mostrarToast(` Costes: Est ${formatearMoneda(totalEst)} | Real ${formatearMoneda(totalReal)}`, 'success');
}

function handleFechaRealChange(e) {
    const id = parseInt(e.target.dataset.id);
    const tipo = e.target.dataset.tipo;
    const valor = e.target.value;
    const el = proyecto.elementosGantt?.find(x => x.id === id);
    if (!el) return;
    if (tipo === 'inicio') el.inicioReal = valor || null;
    else if (tipo === 'fin') {
        el.finReal = valor || null;
        if (el.inicioReal && valor) {
            el.duracionReal = Math.ceil((parseLocalDate(valor) - parseLocalDate(el.inicioReal)) / 86400000);
        }
    }
    guardarProyecto();
    renderizarCronograma();
    calcularCashflow();
    mostrarToast(` Fecha real actualizada`, 'success');
}

function editarFechasReales(id) {
    const elem = proyecto.elementosGantt?.find(e => e.id === id);
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
    const elem = proyecto.elementosGantt?.find(e => e.id === id);
    if (!elem) return;
    elem.inicioReal = document.getElementById('realInicio').value || null;
    elem.finReal = document.getElementById('realFin').value || null;
    elem.progreso = parseInt(document.getElementById('realProgreso').value);
    if (elem.inicioReal && elem.finReal) {
        elem.duracionReal = Math.ceil((parseLocalDate(elem.finReal) - parseLocalDate(elem.inicioReal)) / 86400000);
    }
    guardarProyecto();
    renderizarCronograma();
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
    const esCritico = cpmResult.criticalPath?.includes(elem.id);
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
