// ============================================
// MÓDULO AGENDA Y REGISTRO DE FECHAS IMPORTANTES
// ============================================

let agendaCache = [];
let agendaHitosCache = [];
let agendaEntregablesCache = [];
let agendaCurrentView = 'mes'; // 'dia' | 'semana' | 'mes' | 'ano' | 'lista'
let agendaCurrentDate = new Date();
let agendaAlarmasInterval = null;

const AGENDA_VISTAS = {
    'dia': { label: 'Día', icon: 'calendar', desc: 'Vista diaria por horas' },
    'semana': { label: 'Semana', icon: 'calendar', desc: 'Vista semanal' },
    'mes': { label: 'Mes', icon: 'calendar', desc: 'Vista mensual' },
    'ano': { label: 'Año', icon: 'calendar', desc: 'Vista anual' },
    'lista': { label: 'Lista', icon: 'list', desc: 'Lista cronológica' }
};

const AGENDA_CATEGORIAS = {
    'reunion': { label: 'Reunión', icon: 'users', color: '#007AFF' },
    'decision': { label: 'Decisión', icon: 'check-circle', color: '#FF8C00' },
    'hito': { label: 'Hito', icon: 'flag', color: '#FF3B30' },
    'alarma': { label: 'Alarma', icon: 'bell', color: '#AF52DE' },
    'otro': { label: 'Otro', icon: 'calendar', color: '#8E8E93' }
};

// ============================================
// Helpers de escape y fechas (ámbito de módulo)
// ============================================

function escapeHtml(str) {
    return String(str == null ? '' : str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeHtmlAttr(str) {
    return String(str == null ? '' : str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function safeJsonForAttr(obj) {
    return escapeHtmlAttr(JSON.stringify(obj));
}

function normalizeFecha(fechaStr) {
    if (!fechaStr) return '';
    const parts = String(fechaStr).split(/[-/]/);
    if (parts.length === 3) {
        const year = parts[0].length === 4 ? parts[0] : parts[2];
        const month = parts[1].padStart(2, '0');
        const day = parts[0].length === 4 ? parts[2] : parts[0];
        return year + '-' + month + '-' + day;
    }
    return fechaStr;
}

function getFechaPrincipal(ev) {
    return ev.fecha_inicio || ev.fecha || '';
}

function normalizeForComparison(fechaStr) {
    if (!fechaStr) return '';
    const normalized = normalizeFecha(fechaStr);
    if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized;
    const d = new Date(String(fechaStr) + 'T00:00:00');
    if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
    }
    return normalized;
}

async function cargarAgenda() {
    const proyectoId = getProyectoIdActual();
    if (!proyectoId) {
        mostrarToast(' No hay proyecto seleccionado', 'error');
        renderizarAgenda();
        return;
    }
    if (typeof DataService === 'undefined' || !DataService.listAgendaEventos) {
        console.error('[Agenda] DataService no está disponible');
        mostrarToast(' Error: Servicio de datos no disponible', 'error');
        renderizarAgenda();
        return;
    }
    const token = DataService.getToken();
    console.log('[Agenda] cargarAgenda - token from DataService:', token ? token.substring(0,20)+'...' : 'NO TOKEN');
    if (!token) {
        console.warn('[Agenda] cargarAgenda: No auth token in localStorage (pmi_api_token)');
        mostrarToast(' Sesión expirada. Por favor, inicia sesión de nuevo.', 'warning');
        renderizarAgenda();
        return;
    }
    try {
        const { eventos } = await DataService.listAgendaEventos(proyectoId);
        agendaCache = eventos || [];
        await cargarHitosCronograma(proyectoId);
        renderizarAgenda();
        iniciarComprobacionAlarmas(proyectoId);
    } catch (e) {
        console.error('Error cargando agenda:', e);
        if (e.message && e.message.includes('401')) {
            console.warn('[Agenda] API 401 on cargarAgenda - token invalid/expired');
            mostrarToast(' Token inválido. Inicia sesión en index.html.', 'warning');
            window.location.href = 'index.html?redirect=' + encodeURIComponent(window.location.href);
            return;
        }
        mostrarToast(' Error al cargar agenda: ' + e.message, 'error');
        renderizarAgenda(); // Still render UI on error
    }
}

async function cargarHitosCronograma(proyectoId) {
    if (typeof DataService === 'undefined' || !DataService.listAgendaHitos) {
        console.warn('DataService no disponible para cargar hitos/entregables');
        agendaHitosCache = [];
        agendaEntregablesCache = [];
        return;
    }
    const token = DataService.getToken();
    if (!token) return;
    try {
        const { elementos } = await DataService.listAgendaHitos(proyectoId);
        agendaHitosCache = (elementos || []).filter(e => e.tipo === 'hito');
        agendaEntregablesCache = (elementos || []).filter(e => e.tipo === 'entregable');
    } catch (e) {
        console.warn('No se pudieron cargar hitos/entregables del cronograma:', e);
        if (e.message && e.message.includes('401')) {
            window.location.href = 'index.html?redirect=' + encodeURIComponent(window.location.href);
            return;
        }
        agendaHitosCache = [];
        agendaEntregablesCache = [];
    }
}

function renderizarAgenda() {
    const container = document.getElementById('agendaContent');
    if (!container) return;

    container.innerHTML = `
        <div class="agenda-header">
            <div class="agenda-nav">
                <button class="btn btn-ghost btn-sm" onclick="agendaPeriodoAnterior()"><i data-feather="chevron-left"></i></button>
                <span id="agendaPeriodoActual" class="agenda-periodo-titulo"></span>
                <button class="btn btn-ghost btn-sm" onclick="agendaPeriodoSiguiente()"><i data-feather="chevron-right"></i></button>
                <button class="btn btn-ghost btn-sm" onclick="agendaHoy()" title="Hoy"><i data-feather="target"></i></button>
            </div>
            <div class="agenda-actions">
                <div class="agenda-vista-selector" role="tablist">
                    ${Object.entries(AGENDA_VISTAS).map(([key, v]) => `
                        <button role="tab" class="${agendaCurrentView === key ? 'active' : ''}" 
                                onclick="cambiarVistaAgenda('${key}')" title="${v.desc}">
                            <i data-feather="${v.icon}"></i> ${v.label}
                        </button>
                    `).join('')}
                </div>
                <button class="btn btn-primary btn-sm" onclick="abrirModalEvento()"><i data-feather="plus"></i> Nuevo Evento</button>
            </div>
        </div>
        <div id="agendaDia" class="${agendaCurrentView === 'dia' ? '' : 'u-hidden'}"></div>
        <div id="agendaSemana" class="${agendaCurrentView === 'semana' ? '' : 'u-hidden'}"></div>
        <div id="agendaMes" class="${agendaCurrentView === 'mes' ? '' : 'u-hidden'}"></div>
        <div id="agendaAno" class="${agendaCurrentView === 'ano' ? '' : 'u-hidden'}"></div>
        <div id="agendaLista" class="${agendaCurrentView === 'lista' ? '' : 'u-hidden'}"></div>
    `;

    feather.replace();
    actualizarTituloPeriodo();
    renderizarVistaActual();
}

function actualizarTituloPeriodo() {
    const el = document.getElementById('agendaPeriodoActual');
    if (!el) return;
    
    const d = new Date(agendaCurrentDate);
    switch (agendaCurrentView) {
        case 'dia':
            el.textContent = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            break;
        case 'semana':
            const ini = new Date(d);
            ini.setDate(d.getDate() - d.getDay() + 1); // Lunes
            const fin = new Date(ini);
            fin.setDate(ini.getDate() + 6);
            el.textContent = `${ini.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${fin.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`;
            break;
        case 'mes':
            el.textContent = d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
            break;
        case 'ano':
            el.textContent = d.getFullYear().toString();
            break;
        case 'lista':
            el.textContent = 'Lista de eventos';
            break;
    }
}

function agendaPeriodoAnterior() {
    const d = new Date(agendaCurrentDate);
    switch (agendaCurrentView) {
        case 'dia': d.setDate(d.getDate() - 1); break;
        case 'semana': d.setDate(d.getDate() - 7); break;
        case 'mes': d.setMonth(d.getMonth() - 1); break;
        case 'ano': d.setFullYear(d.getFullYear() - 1); break;
    }
    agendaCurrentDate = d;
    actualizarTituloPeriodo();
    renderizarVistaActual();
}

function agendaPeriodoSiguiente() {
    const d = new Date(agendaCurrentDate);
    switch (agendaCurrentView) {
        case 'dia': d.setDate(d.getDate() + 1); break;
        case 'semana': d.setDate(d.getDate() + 7); break;
        case 'mes': d.setMonth(d.getMonth() + 1); break;
        case 'ano': d.setFullYear(d.getFullYear() + 1); break;
    }
    agendaCurrentDate = d;
    actualizarTituloPeriodo();
    renderizarVistaActual();
}

function agendaHoy() {
    agendaCurrentDate = new Date();
    actualizarTituloPeriodo();
    renderizarVistaActual();
}

function cambiarVistaAgenda(vista) {
    agendaCurrentView = vista;
    // Clear alarm interval when changing views
    if (agendaAlarmasInterval) {
        clearInterval(agendaAlarmasInterval);
        agendaAlarmasInterval = null;
    }
    document.getElementById('agendaDia').classList.toggle('u-hidden', vista !== 'dia');
    document.getElementById('agendaSemana').classList.toggle('u-hidden', vista !== 'semana');
    document.getElementById('agendaMes').classList.toggle('u-hidden', vista !== 'mes');
    document.getElementById('agendaAno').classList.toggle('u-hidden', vista !== 'ano');
    document.getElementById('agendaLista').classList.toggle('u-hidden', vista !== 'lista');
    document.querySelectorAll('.agenda-vista-selector button').forEach(btn => 
        btn.classList.toggle('active', btn.onclick.toString().includes(`'${vista}'`))
    );
    actualizarTituloPeriodo();
    renderizarVistaActual();
}

function obtenerElementosFecha(fechaStr) {
    const elementos = [];
    
    // Eventos de agenda - check if date falls within range (fecha_inicio to fecha_fin)
    agendaCache.filter(ev => {
        const inicio = ev.fecha_inicio || ev.fecha;
        const fin = ev.fecha_fin || ev.fecha;
        return inicio && fin && inicio <= fechaStr && fechaStr <= fin;
}).forEach(ev => {
        elementos.push({ ...ev, tipo: 'evento', categoriaColor: (AGENDA_CATEGORIAS[ev.categoria] || AGENDA_CATEGORIAS.otro).color         });
    });
    
    // Hitos del cronograma
    agendaHitosCache.filter(h => {
        const inicio = h.fecha_inicio || h.fecha;
        const fin = h.fecha_fin || h.fecha;
        return inicio && fin && inicio <= fechaStr && fechaStr <= fin;
    }).forEach(h => {
        elementos.push({ ...h, tipo: 'hito', titulo: h.nombre, categoriaColor: '#FF3B30', icono: 'flag' });
    });
    
    // Entregables del cronograma
    agendaEntregablesCache.filter(e => {
        const inicio = e.fecha_inicio || e.fecha;
        const fin = e.fecha_fin || e.fecha;
        return inicio && fin && inicio <= fechaStr && fechaStr <= fin;
    }).forEach(e => { 
        elementos.push({ 
            ...e, 
            tipo: 'entregable', 
            titulo: e.nombre, 
            categoriaColor: '#FF8C00',
            icono: 'package'
                });
        });
    
    // Fallback: si las cachés están vacías, leer directamente del proyecto.gantt
    if (elementos.length === 0 && typeof proyecto !== 'undefined' && proyecto.elementosGantt) {
        for (let i = 0; i < proyecto.elementosGantt.length; i++) {
            const e = proyecto.elementosGantt[i];
            const inicio = e.fecha_inicio || e.fecha;
            const fin = e.fecha_fin || e.fecha;
            if (inicio && fin && inicio <= fechaStr && fechaStr <= fin && (e.tipo === 'hito' || e.tipo === 'entregable')) {
                elementos.push({
                    ...e,
                    tipo: e.tipo,
                    titulo: e.nombre,
                    categoriaColor: e.tipo === 'hito' ? '#FF3B30' : '#FF8C00',
                    icono: e.tipo === 'hito' ? 'flag' : 'package'
                });
            }
        }
    }
    
    // Ordenar por hora si existe, luego por tipo (hito > entregable > evento)
    return elementos.sort((a, b) => {
        const horaA = a.hora || '00:00';
        const horaB = b.hora || '00:00';
        if (horaA !== horaB) return horaA.localeCompare(horaB);
        const tipoOrder = { hito: 0, entregable: 1, evento: 2 };
        return (tipoOrder[a.tipo] || 2) - (tipoOrder[b.tipo] || 2);
    });
}

function renderizarVistaActual() {
    switch (agendaCurrentView) {
        case 'dia': renderizarVistaDia(); break;
        case 'semana': renderizarVistaSemana(); break;
        case 'mes': renderizarVistaMes(); break;
        case 'ano': renderizarVistaAno(); break;
        case 'lista': renderizarListaEventos(); break;
    }
}

function renderizarVistaDia() {
    const container = document.getElementById('agendaDia');
    if (!container) return;

    const d = new Date(agendaCurrentDate);
    const fechaStr = d.toISOString().split('T')[0];
    const elementos = obtenerElementosFecha(fechaStr);
    const hoy = new Date();
    const esHoy = fechaStr === hoy.toISOString().split('T')[0];

    let html = `
        <div class="agenda-vista-dia">
            <div class="agenda-dia-header ${esHoy ? 'hoy' : ''}">
                <h3>${d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                ${elementos.length === 0 ? '<p class="agenda-vacio">No hay eventos programados</p>' : ''}
            </div>
            <div class="agenda-dia-timeline">
    `;

    // Horas 6:00 - 23:00
    for (let h = 6; h <= 23; h++) {
        const horaStr = `${String(h).padStart(2,'0')}:00`;
        const elementosHora = elementos.filter(ev => ev.hora === horaStr);
        
        html += `<div class="agenda-hora-fila" data-hora="${horaStr}">
            <div class="agenda-hora-label">${horaStr}</div>
            <div class="agenda-hora-eventos">`;
        
        if (elementosHora.length > 0) {
            elementosHora.forEach(ev => {
                const color = ev.categoriaColor || '#8E8E93';
                const icono = ev.icono || 'calendar';
const evJson = safeJsonForAttr(ev);
            html += `<div class="agenda-evento-hora" style="border-left-color:${color}" onclick="event.stopPropagation(); abrirModalEvento(${evJson})">
                    <span class="agenda-evento-cat" style="background:${color}"></span>
                    <span>${escapeHtml(ev.titulo)}</span>
                    ${ev.es_alarma ? '<i data-feather="bell" class="agenda-alarma-icon"></i>' : ''}
                    <i data-feather="${icono}" class="agenda-tipo-icon" style="width:12px;height:12px;margin-left:4px;opacity:0.7"></i>
                </div>`;
            });
        } else {
            html += '<div class="agenda-slot-vacio" onclick="abrirModalEvento(null)"></div>';
        }
        
        html += `</div></div>`;
    }

    html += `</div></div>`;
    container.innerHTML = html;
    feather.replace();
}
function renderizarVistaSemana() {
    const container = document.getElementById('agendaSemana');
    if (!container) return;

    const d = new Date(agendaCurrentDate);
    const inicioSemana = new Date(d);
    inicioSemana.setDate(d.getDate() - d.getDay() + 1); // Lunes
    inicioSemana.setHours(0,0,0,0);

    const diasSemana = [];
    for (let i = 0; i < 7; i++) {
        const dia = new Date(inicioSemana);
        dia.setDate(inicioSemana.getDate() + i);
        diasSemana.push(dia);
    }

    const hoy = new Date();
    const hoyStr = hoy.toISOString().split('T')[0];

    let html = `
        <div class="agenda-vista-semana">
            <div class="agenda-semana-header">
                ${diasSemana.map((dia, i) => {
                    const fechaStr = dia.toISOString().split('T')[0];
                    const esHoy = fechaStr === hoyStr;
                    const elementos = obtenerElementosFecha(fechaStr);
                    return `
                        <div class="agenda-semana-col ${esHoy ? 'hoy' : ''}" data-fecha="${fechaStr}">
                            <div class="agenda-semana-dia">
                                <span class="agenda-semana-dia-nombre">${dia.toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                                <span class="agenda-semana-dia-numero">${dia.getDate()}</span>
                            </div>
                            <div class="agenda-semana-eventos">
                                ${elementos.length === 0 ? '<div class="agenda-vacio">Sin eventos</div>' : elementos.slice(0, 5).map(ev => {
                                    const color = ev.categoriaColor || '#8E8E93';
                                    const icono = ev.icono || 'calendar';
const evJson = safeJsonForAttr(ev);
                                    return `<div class="agenda-evento-mini" style="border-left-color:${ev.categoriaColor || '#8E8E93'}" onclick="event.stopPropagation(); abrirModalEvento(${evJson})">
                                        <span class="agenda-evento-cat" style="background:${ev.categoriaColor || '#8E8E93'}"></span>
                                        <span>${escapeHtml(ev.titulo)}${ev.hora ? ' ' + ev.hora : ''}</span>
                                        ${ev.es_alarma ? '<i data-feather="bell" class="agenda-alarma-icon"></i>' : ''}
                                        <i data-feather="${ev.icono || 'calendar'}" class="agenda-tipo-icon" style="width:10px;height:10px;margin-left:4px;opacity:0.7"></i>
                                    </div>`;
                                }).join('')}
                                ${elementos.length > 5 ? `<div class="agenda-mas-eventos" onclick="filtrarListaPorFecha('${fechaStr}')">+${elementos.length - 5} más</div>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    container.innerHTML = html;
    feather.replace();
}
function renderizarVistaMes() {
    const container = document.getElementById('agendaMes');
    if (!container) return;

    const year = agendaCurrentDate.getFullYear();
    const month = agendaCurrentDate.getMonth();
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = (primerDia.getDay() + 6) % 7;
    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    let html = `<table class="agenda-calendario"><thead><tr>`;
    ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].forEach(d => html += `<th>${d}</th>`);
    html += `</tr></thead><tbody><tr>`;

    for (let i = 0; i < diaInicioSemana; i++) html += `<td class="vacio"></td>`;

    let diaSemana = diaInicioSemana;
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fechaStr = `${year}-${String(month+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
        const esHoy = fechaStr === hoy.toISOString().split('T')[0];
        const elementos = obtenerElementosFecha(fechaStr);

        html += `<td class="${esHoy ? 'hoy' : ''}" data-fecha="${fechaStr}">`;
        html += `<div class="agenda-dia-numero">${dia}</div>`;
        if (elementos.length > 0) {
            html += `<div class="agenda-eventos">`;
            elementos.slice(0, 3).forEach(ev => {
const evJson = safeJsonForAttr(ev);
                html += `<div class="agenda-evento-mini" style="border-left-color:${ev.categoriaColor || '#8E8E93'}" title="${escapeHtml(ev.titulo)}" onclick="event.stopPropagation(); abrirModalEvento(${evJson})">
                    <span class="agenda-evento-cat" style="background:${ev.categoriaColor || '#8E8E93'}"></span>
                    <span>${escapeHtml(ev.titulo)}</span>
                    ${ev.es_alarma ? '<i data-feather="bell" class="agenda-alarma-icon"></i>' : ''}
                    <i data-feather="${ev.icono || 'calendar'}" class="agenda-tipo-icon" style="width:10px;height:10px;margin-left:4px;opacity:0.7"></i>
                </div>`;
            });
            if (elementos.length > 3) {
                html += `<div class="agenda-mas-eventos" onclick="event.stopPropagation(); filtrarListaPorFecha('${fechaStr}')">+${elementos.length - 3} más</div>`;
            }
            html += `</div>`;
        }
        html += `</td>`;

        diaSemana++;
        if (diaSemana === 7 && dia < diasEnMes) {
            html += `</tr><tr>`;
            diaSemana = 0;
        }
    }

    while (diaSemana < 7) {
        html += `<td class="vacio"></td>`;
        diaSemana++;
    }

    html += `</tr></tbody></table>`;
    container.innerHTML = html;
    feather.replace();
}

function renderizarVistaAno() {
    const container = document.getElementById('agendaAno');
    if (!container) return;

    const year = agendaCurrentDate.getFullYear();
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split('T')[0];

    // Agrupar todos los elementos por mes (eventos + hitos + entregables)
    const elementosPorMes = {};
    
    // Eventos de agenda
    agendaCache.forEach(ev => {
        const fecha = ev.fecha_inicio || ev.fecha;
        if (fecha) {
            const mes = fecha.substring(0, 7); // YYYY-MM
            if (!elementosPorMes[mes]) elementosPorMes[mes] = [];
            elementosPorMes[mes].push({ ...ev, tipo: 'evento', categoriaColor: (AGENDA_CATEGORIAS[ev.categoria] || AGENDA_CATEGORIAS.otro).color });
        }
    });
    agendaHitosCache.forEach(h => {
        const fecha = h.fecha_inicio || h.fecha;
        if (fecha) {
            const mes = fecha.substring(0, 7);
            if (!elementosPorMes[mes]) elementosPorMes[mes] = [];
            elementosPorMes[mes].push({ ...h, tipo: 'hito', titulo: h.nombre, categoriaColor: '#FF3B30', icono: 'flag' });
        }
    });
    
    // Entregables del cronograma
    agendaEntregablesCache.forEach(e => {
        const fecha = e.fecha_inicio || e.fecha;
        if (fecha) {
            const mes = fecha.substring(0, 7);
            if (!elementosPorMes[mes]) elementosPorMes[mes] = [];
            elementosPorMes[mes].push({ ...e, tipo: 'entregable', titulo: e.nombre, categoriaColor: '#FF8C00', icono: 'package' });
        }
    });
    
    // Fallback: leer directamente del proyecto.gantt si las cachés están vacías
    if (typeof proyecto !== 'undefined' && proyecto.elementosGantt) {
        proyecto.elementosGantt.forEach(e => {
            if (e.tipo === 'hito' || e.tipo === 'entregable') {
                const fecha = e.fecha_inicio || e.fecha;
                if (fecha) {
                    const mes = fecha.substring(0, 7);
                    if (!elementosPorMes[mes]) elementosPorMes[mes] = [];
                    elementosPorMes[mes].push({
                        ...e,
                        tipo: e.tipo,
                        titulo: e.nombre,
                        categoriaColor: e.tipo === 'hito' ? '#FF3B30' : '#FF8C00',
                        icono: e.tipo === 'hito' ? 'flag' : 'package'
                    });
                }
            }
        });
    }

    let html = '<div class="agenda-vista-ano">';
    for (let m = 0; m < 12; m++) {
        const mesStr = `${year}-${String(m+1).padStart(2,'0')}`;
        const elementosMes = elementosPorMes[mesStr] || [];
        const primerDiaMes = new Date(year, m, 1);
        const esMesActual = m === hoy.getMonth() && year === hoy.getFullYear();

        // Ordenar: hitos primero, luego entregables, luego eventos
        const ordenados = (elementosPorMes[mesStr] || []).slice().sort((a, b) => {
            const tipoOrder = { hito: 0, entregable: 1, evento: 2 };
            return (tipoOrder[a.tipo] || 2) - (tipoOrder[b.tipo] || 2);
        });

        html += `
            <div class="agenda-ano-mes ${esMesActual ? 'actual' : ''}" data-mes="${mesStr}">
                <div class="agenda-ano-mes-header">
                    <h4>${primerDiaMes.toLocaleDateString('es-ES', { month: 'long' })}</h4>
                    <span class="agenda-ano-mes-count">${ordenados.length} elementos</span>
                </div>
                <div class="agenda-ano-mes-grid">
                    ${ordenados.slice(0, 6).map(ev => {
                        const evJson = safeJsonForAttr(ev);
                        return `<div class="agenda-evento-mini" style="border-left-color:${ev.categoriaColor || '#8E8E93'}" onclick="event.stopPropagation(); abrirModalEvento(${evJson})">
                            <span class="agenda-evento-cat" style="background:${ev.categoriaColor || '#8E8E93'}"></span>
                            <span>${escapeHtml(ev.titulo)}</span>
                            <i data-feather="${ev.icono || 'calendar'}" class="agenda-tipo-icon" style="width:10px;height:10px;margin-left:4px;opacity:0.7"></i>
                        </div>`;
                    }).join('')}
                    ${ordenados.length > 6 ? `<div class="agenda-mas-eventos">+${ordenados.length - 6} más</div>` : ''}
                </div>
            </div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;
    feather.replace();
}

function renderizarListaEventos() {
    const container = document.getElementById('agendaLista');
    if (!container) return;

    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    // Obtener todos los elementos (eventos + hitos + entregables)
    const todosLosElementos = [];
    
    // Eventos de agenda
    agendaCache.forEach(ev => {
        todosLosElementos.push({ ...ev, tipo: 'evento', categoriaColor: (AGENDA_CATEGORIAS[ev.categoria] || AGENDA_CATEGORIAS.otro).color, icono: 'calendar' });
    });
    
    // Hitos del cronograma
    agendaHitosCache.forEach(h => {
        todosLosElementos.push({ ...h, tipo: 'hito', titulo: h.nombre, categoriaColor: '#FF3B30', icono: 'flag' });
    });
    
    // Entregables del cronograma
    agendaEntregablesCache.forEach(e => {
        todosLosElementos.push({ ...e, tipo: 'entregable', titulo: e.nombre, categoriaColor: '#FF8C00', icono: 'package' });
    });
    
    // Fallback: leer directamente del proyecto.gantt si las cachés están vacías
    if (todosLosElementos.length === 0 && typeof proyecto !== 'undefined' && proyecto.elementosGantt) {
        proyecto.elementosGantt.forEach(e => {
            if ((e.tipo === 'hito' || e.tipo === 'entregable')) {
                todosLosElementos.push({
                    ...e,
                    tipo: e.tipo,
                    titulo: e.nombre,
                    categoriaColor: e.tipo === 'hito' ? '#FF3B30' : '#FF8C00',
                    icono: e.tipo === 'hito' ? 'flag' : 'package'
                });
            }
        });
    }

    const futuros = todosLosElementos
        .filter(ev => {
            const fecha = getFechaPrincipal(ev);
            const normalized = normalizeForComparison(fecha);
            return normalized && normalized >= hoy.toISOString().split('T')[0];
        })
        .sort((a,b) => {
            const fa = normalizeForComparison(getFechaPrincipal(a));
            const fb = normalizeForComparison(getFechaPrincipal(b));
            return fa.localeCompare(fb);
        });
    
    const pasados = todosLosElementos
        .filter(ev => {
            const fecha = getFechaPrincipal(ev);
            const normalized = normalizeForComparison(fecha);
            return normalized && normalized < hoy.toISOString().split('T')[0];
        })
        .sort((a,b) => {
            const fa = normalizeForComparison(getFechaPrincipal(a));
            const fb = normalizeForComparison(getFechaPrincipal(b));
            return fb.localeCompare(fa);
        });

    let html = '';

    if (futuros.length > 0) {
        html += '<div class="agenda-lista-seccion"><h4> Próximos</h4><div class="agenda-lista">';
        futuros.forEach(ev => html += renderEventoListaItem(ev, false));
        html += '</div></div>';
    }

    if (pasados.length > 0) {
        html += '<div class="agenda-lista-seccion"><h4> Pasados</h4><div class="agenda-lista">';
        pasados.forEach(ev => html += renderEventoListaItem(ev, true));
        html += '</div></div>';
    }

    if (todosLosElementos.length === 0) {
        html = '<div class="info-card" style="text-align:center;padding:40px;"><i data-feather="calendar" style="width:48px;height:48px;opacity:0.3;margin-bottom:16px;"></i><p>No hay eventos registrados</p><button class="btn btn-primary u-mt-16" onclick="abrirModalEvento()"><i data-feather="plus"></i> Crear primer evento</button></div>';
    }

    container.innerHTML = html;
    feather.replace();
}

function renderEventoListaItem(ev, esPasado) {
    const tipo = ev.tipo || 'evento';
    const cat = tipo === 'hito' ? { label: 'Hito', color: '#FF3B30', icon: 'flag' } : 
                tipo === 'entregable' ? { label: 'Entregable', color: '#FF8C00', icon: 'package' } :
                AGENDA_CATEGORIAS[ev.categoria] || AGENDA_CATEGORIAS.otro;
    
    // Format dates with proper locale including year
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    };
    
    const fechaInicio = ev.fecha_inicio ? new Date(ev.fecha_inicio + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : '';
    const fechaFin = ev.fecha_fin ? new Date(ev.fecha_fin + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : '';
    const horaInicio = ev.hora_inicio || '';
    const horaFin = ev.hora_fin || '';
    const isMultiDay = ev.fecha_inicio && ev.fecha_fin && ev.fecha_inicio !== ev.fecha_fin;
    const fechaDisplay = isMultiDay ? `${formatDate(ev.fecha_inicio)} - ${formatDate(ev.fecha_fin)}` : (ev.fecha_inicio ? formatDate(ev.fecha_inicio) : (ev.fecha || ''));
    const horaDisplay = (ev.hora_inicio || ev.hora_fin) ? ` ${ev.hora_inicio || '00:00'} - ${ev.hora_fin || '00:00'}` : '';
    const evJson = safeJsonForAttr(ev);
    
    return `
        <div class="agenda-lista-item ${esPasado ? 'pasado' : ''}" data-id="${ev.id}" data-tipo="${ev.tipo || ev.categoria || 'evento'}" style="position: relative; color: ${cat.color};">
            <div class="agenda-lista-acciones-left">
                <button class="btn btn-ghost btn-xs" onclick="event.stopPropagation(); abrirModalEvento(${evJson})" title="Editar"><i data-feather="edit-2"></i></button>
                <button class="btn btn-danger btn-xs" onclick="event.stopPropagation(); confirmarEliminarEvento(${ev.id})" title="Eliminar"><i data-feather="trash-2"></i></button>
            </div>
            <div class="agenda-lista-content">
                <div class="agenda-lista-fecha">${fechaDisplay}${ev.hora_inicio || ev.hora_fin ? ` ${ev.hora_inicio || '00:00'} - ${ev.hora_fin || '00:00'}` : ''}</div>
                <div class="agenda-lista-titulo-row">
                    <span class="agenda-lista-cat" style="background:${cat.color}">${cat.label}</span>
                    <strong class="agenda-lista-titulo">${escapeHtml(ev.titulo)}</strong>
                    ${ev.es_alarma ? '<i data-feather="bell" class="agenda-alarma-icon" title="Tiene alarma"></i>' : ''}
                    ${ev.hito_id ? '<i data-feather="flag" class="agenda-hito-icon" title="Vinculado a hito"></i>' : ''}
                    ${ev.icono ? `<i data-feather="${ev.icono}" class="agenda-tipo-icon" style="width:12px;height:12px;margin-left:4px;opacity:0.7" title="${ev.tipo}"></i>` : ''}
                </div>
                ${ev.descripcion ? `<div class="agenda-lista-desc">${escapeHtml(ev.descripcion)}</div>` : ''}
                <div class="agenda-lista-progreso">
                    <div class="agenda-progreso-bar" data-progreso="${ev.progreso || 0}" style="background:${ev.progreso >= 100 ? '#00A859' : cat.color}; width: ${Math.min(ev.progreso || 0, 100)}%"></div>
                    <span class="agenda-progreso-text">${ev.progreso || 0}%</span>
                </div>
            </div>
        </div>`;
}

function filtrarListaPorFecha(fecha) {
    cambiarVistaAgenda('lista');
    // Scroll al primer evento de esa fecha
    setTimeout(() => {
        const items = document.querySelectorAll('.agenda-lista-item');
        items.forEach(item => {
            const ev = agendaCache.find(e => e.id == item.dataset.id);
            if (ev && ev.fecha === fecha) item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }, 100);
}

function abrirModalEvento(evento = null) {
    const esEdicion = !!evento;
    const categoriasHtml = Object.entries(AGENDA_CATEGORIAS).map(([key, cat]) =>
        `<option value="${key}" ${evento && evento.categoria === key ? 'selected' : ''}>${cat.label}</option>`
    ).join('');

    const hitosHtml = agendaHitosCache.map(h =>
        `<option value="${h.id}" ${evento && evento.hito_id == h.id ? 'selected' : ''}>${h.codigo ? h.codigo + ' ' : ''}${escapeHtml(h.nombre)}${h.fecha ? ' (' + h.fecha + ')' : ''}</option>`
    ).join('');

    const modalHtml = `
        <div class="modal u-flex" id="modalAgendaEvento">
            <div class="modal-content modal-md">
                <div class="modal-header">
                    <h3><i data-feather="${esEdicion ? 'edit-2' : 'plus'}"></i> ${esEdicion ? 'Editar Evento' : 'Nuevo Evento'}</h3>
                    <span class="close-modal" onclick="cerrarModalAgendaEvento()">&times;</span>
                </div>
                <input type="hidden" id="eventoId" value="${evento?.id || ''}">
                <div class="form-row">
                    <div class="form-group"><label>Fecha inicio *</label><input type="date" id="eventoFechaInicio" value="${evento?.fecha_inicio || new Date().toISOString().split('T')[0]}" required></div>
                    <div class="form-group"><label>Fecha fin *</label><input type="date" id="eventoFechaFin" value="${evento?.fecha_fin || new Date().toISOString().split('T')[0]}" required></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Hora inicio</label><input type="time" id="eventoHoraInicio" value="${evento?.hora_inicio || '09:00'}"></div>
                    <div class="form-group"><label>Hora fin</label><input type="time" id="eventoHoraFin" value="${evento?.hora_fin || '10:00'}"></div>
                </div>
                <div class="form-group"><label>Título *</label><input type="text" id="eventoTitulo" value="${escapeHtml(evento?.titulo || '')}" placeholder="Título del evento" required maxlength="200"></div>
                <div class="form-group"><label>Descripción</label><textarea id="eventoDescripcion" rows="3" placeholder="Detalles...">${escapeHtml(evento?.descripcion || '')}</textarea></div>
                <div class="form-row">
                    <div class="form-group"><label>Categoría</label><select id="eventoCategoria">${categoriasHtml}</select></div>
                    <div class="form-group"><label>Hito vinculado (opcional)</label><select id="eventoHitoId"><option value="">-- Ninguno --</option>${hitosHtml}</select></div>
                </div>
                <div class="form-group checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="eventoEsAlarma" ${evento?.es_alarma ? 'checked' : ''}>
                        <span class="checkbox-custom"></span>
                        <span>Activar alarma (notificación el día del evento)</span>
                    </label>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="cerrarModalAgendaEvento()">Cancelar</button>
                    <button class="btn btn-primary" onclick="guardarEvento()"><i data-feather="save"></i> ${esEdicion ? 'Actualizar' : 'Crear'}</button>
                </div>
            </div>
        </div>`;

    document.getElementById('modalContainer').innerHTML = modalHtml;
    document.getElementById('modalAgendaEvento').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalAgendaEvento(); };
    feather.replace();
}

function cerrarModalAgendaEvento() {
    document.getElementById('modalContainer').innerHTML = '';
}

async function guardarEvento() {
    const id = document.getElementById('eventoId').value;
    const proyectoId = getProyectoIdActual();
    if (!proyectoId) { mostrarToast(' Sin proyecto activo', 'error'); return; }
    if (typeof DataService === 'undefined' || !DataService.saveAgendaEvento) {
        mostrarToast(' Error: Servicio de datos no disponible', 'error');
        return;
    }
    const token = DataService.getToken();
    console.log('[Agenda] guardarEvento - token from DataService:', token ? token.substring(0,20)+'...' : 'NO TOKEN');
    if (!token) { 
        console.warn('[Agenda] No token in localStorage (pmi_api_token)');
        mostrarToast(' No hay token de sesión. Inicia sesión en index.html primero.', 'warning'); 
        return; 
    }

    const payload = {
        id: id || null,
        proyecto_id: proyectoId,
        fecha_inicio: document.getElementById('eventoFechaInicio').value,
        fecha_fin: document.getElementById('eventoFechaFin').value,
        hora_inicio: document.getElementById('eventoHoraInicio').value,
        hora_fin: document.getElementById('eventoHoraFin').value,
        titulo: document.getElementById('eventoTitulo').value.trim(),
        descripcion: document.getElementById('eventoDescripcion').value.trim(),
        categoria: document.getElementById('eventoCategoria').value,
        es_alarma: document.getElementById('eventoEsAlarma').checked,
        hito_id: document.getElementById('eventoHitoId').value || null
    };

    if (!payload.fecha_inicio || !payload.fecha_fin || !payload.titulo) { mostrarToast(' Fecha inicio, fecha fin y título son obligatorios', 'warning'); return; }

    // Validate date logic
    if (payload.fecha_fin < payload.fecha_inicio) { mostrarToast(' La fecha fin debe ser igual o posterior a la fecha inicio', 'warning'); return; }
    
    // Validate time logic for same-day events
    if (payload.fecha_inicio === payload.fecha_fin && payload.hora_fin <= payload.hora_inicio) { mostrarToast(' La hora fin debe ser posterior a la hora inicio', 'warning'); return; }

    try {
        await DataService.saveAgendaEvento(payload);
        mostrarToast(` Evento ${id ? 'actualizado' : 'creado'}`, 'success');
        cerrarModalAgendaEvento();
        await cargarAgenda();
    } catch (e) {
        console.error('Error guardando evento:', e);
        if (e.message && e.message.includes('401')) {
            console.warn('[Agenda] API 401 on guardarEvento - token rejected by server');
            mostrarToast(' Token rechazado por servidor. Re-inicia sesión en index.html.', 'warning');
            window.location.href = 'index.html?redirect=' + encodeURIComponent(window.location.href);
            return;
        }
        mostrarToast(' Error: ' + e.message, 'error');
    }
}

async function confirmarEliminarEvento(id) {
    if (!confirm('¿Eliminar este evento?')) return;
    if (typeof DataService === 'undefined' || !DataService.deleteAgendaEvento) {
        mostrarToast(' Error: Servicio de datos no disponible', 'error');
        return;
    }
    const token = DataService.getToken();
    if (!token) { mostrarToast(' Sesión expirada. Inicia sesión de nuevo.', 'warning'); return; }
    try {
        await DataService.deleteAgendaEvento(id);
        mostrarToast(' Evento eliminado', 'success');
        await cargarAgenda();
    } catch (e) {
        console.error('Error eliminando evento:', e);
        if (e.message && e.message.includes('401')) {
            console.warn('[Agenda] API 401 on confirmarEliminarEvento');
            mostrarToast(' Token inválido. Re-inicia sesión en index.html.', 'warning');
            window.location.href = 'index.html?redirect=' + encodeURIComponent(window.location.href);
            return;
        }
        mostrarToast(' Error: ' + e.message, 'error');
    }
}

async function comprobarAlarmas(proyectoId) {
    if (typeof DataService === 'undefined' || !DataService.checkAgendaAlertas) return;
    const token = DataService.getToken();
    if (!token) return;
    try {
        const { alertas } = await DataService.checkAgendaAlertas(proyectoId);
        (alertas || []).forEach(ev => {
            const cat = AGENDA_CATEGORIAS[ev.categoria] || AGENDA_CATEGORIAS.otro;
            mostrarToast(`🔔 ${escapeHtml(ev.titulo)} ${ev.fecha === new Date().toISOString().split('T')[0] ? 'HOY' : 'MAÑANA'}`, 'info', 8000);
        });
    } catch (e) {
        console.warn('Error comprobando alarmas:', e);
    }
}

function iniciarComprobacionAlarmas(proyectoId) {
    if (agendaAlarmasInterval) clearInterval(agendaAlarmasInterval);
    comprobarAlarmas(proyectoId);
    agendaAlarmasInterval = setInterval(() => comprobarAlarmas(proyectoId), 30 * 60 * 1000); // cada 30 min
}

function detenerComprobacionAlarmas() {
    if (agendaAlarmasInterval) { clearInterval(agendaAlarmasInterval); agendaAlarmasInterval = null; }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (agendaAlarmasInterval) {
        clearInterval(agendaAlarmasInterval);
        agendaAlarmasInterval = null;
    }
});

function getProyectoIdActual() {
    const raw = localStorage.getItem('proyectoSeleccionado');
    return raw ? String(raw) : null;
}