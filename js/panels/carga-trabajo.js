// ============================================================
// panels/carga-trabajo.js — Carga por recurso/día y sobreasignación
// ============================================================

/** Devuelve los días hábiles del intervalo [inicio, fin]. */
function _diasHabilesCarga(inicio, fin) {
    const dias = [];
    const actual = inicio instanceof Date ? new Date(inicio) : parseLocalDate(inicio);
    const limite = fin instanceof Date ? new Date(fin) : parseLocalDate(fin);
    if (!actual || isNaN(actual.getTime()) || !limite || isNaN(limite.getTime())) return dias;
    let vueltas = 0;
    const MAX_DIAS = 20000; // ~54 años: difícilmente un proyecto real lo alcanza.
    while (actual <= limite && vueltas < MAX_DIAS) {
        vueltas++;
        if (typeof esDiaNoLaboral === 'function' ? !esDiaNoLaboral(actual) : (typeof esFinDeSemana !== 'function' || !esFinDeSemana(actual))) {
            dias.push(new Date(actual));
        }
        actual.setDate(actual.getDate() + 1);
    }
    if (vueltas >= MAX_DIAS) {
        console.warn('[CargaTrabajo] Intervalo truncado a ' + MAX_DIAS + ' días para proteger la UI');
    }
    return dias;
}

function _claveDia(fecha) {
    return typeof formatLocalDate === 'function' ? formatLocalDate(fecha) : fecha.toISOString().slice(0, 10);
}

/**
 * Calcula horas asignadas por recurso y día hábil.
 * Devuelve días, recursos, carga y sobreasignaciones (horas > capacidad).
 */
function calcularCargaPorDia(proyectoParam, opciones) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    const opts = opciones || {};
    const elementos = (p && p.elementosGantt) || [];
    const equipo = (p && p.equipo) || [];
    const dias = [];
    const carga = {};
    const recursosMap = new Map();
    const Capacity = Number(opts.capacidadPorDefecto) || 8;
    // horasMes es el dato canonical del modelo (160/120/80 h). 20 días
    // hábiles por mes es la conversión estándar a capacidad diaria.
    const capacidadDe = r => {
        const horasMes = Number(r && r.horasMes) || 0;
        if (horasMes > 0) return horasMes / 20;
        const horasDia = Number(r && r.horasDia || r && r.capacidadHorasDia) || 0;
        return horasDia > 0 ? horasDia : Capacity;
    };

    equipo.forEach(r => {
        if (r && r.id != null) recursosMap.set(String(r.id), {
            id: r.id,
            nombre: r.nombre || `Recurso ${r.id}`,
            capacidad: capacidadDe(r),
            color: r.color || null
        });
    });

    const equipoPorId = new Map(equipo.filter(r => r && r.id != null).map(r => [String(r.id), r]));
    const capacidadAsignado = asignado => {
        const canonico = equipoPorId.get(String(asignado && asignado.id));
        return capacidadDe(canonico && Number(canonico.horasMes) > 0 ? canonico : asignado);
    };
    elementos.forEach(e => {
        const asignado = e && e.recursoAsignado;
        if (!asignado || !e.inicio || e.tipo === 'edt') return;
        const id = String(asignado.id != null ? asignado.id : (asignado.nombre || ''));
        if (!id || id === 'undefined') return;
        if (!recursosMap.has(id)) {
            recursosMap.set(id, {
                id: asignado.id,
                nombre: asignado.nombre || `Recurso ${id}`,
                capacidad: capacidadAsignado(asignado),
                color: asignado.color || null
            });
        }
        const inicio = parseLocalDate(e.inicio);
        if (!inicio || isNaN(inicio.getTime())) return;
        const duracion = Math.max(0, Number(e.duracion) || 0);
        if (duracion === 0) return;
        const fin = typeof sumarDiasHabiles === 'function'
            ? parseLocalDate(sumarDiasHabiles(e.inicio, duracion - 1))
            : new Date(inicio.getTime() + (duracion - 1) * 86400000);
        if (!fin || isNaN(fin.getTime())) return;
        const horasTotales = Number(e.duracionHoras) > 0
            ? Number(e.duracionHoras)
            : duracion * capacidadAsignado(asignado);
        const horasPorDia = horasTotales / duracion;
        for (const dia of _diasHabilesCarga(inicio, fin)) {
            const clave = _claveDia(dia);
            if (!dias.includes(clave)) dias.push(clave);
            if (!carga[id]) carga[id] = {};
            carga[id][clave] = (carga[id][clave] || 0) + horasPorDia;
        }
    });

    dias.sort();
    const recursos = [...recursosMap.values()];
    const sobreasignaciones = [];
    recursos.forEach(r => {
        const id = String(r.id);
        dias.forEach(dia => {
            const horas = (carga[id] && carga[id][dia]) || 0;
            if (horas > r.capacidad + 0.01) {
                sobreasignaciones.push({ recursoId: r.id, recurso: r.nombre, dia, horas, exceso: horas - r.capacidad, capacidad: r.capacidad });
            }
        });
    });

    return { dias, recursos, carga, sobreasignaciones };
}

/** Pinta el resumen y el histograma apilado de carga diaria. */
function renderizarCargaTrabajo() {
    const resultado = calcularCargaPorDia();
    const tbody = document.getElementById('cargaTrabajoBody');
    const resumen = document.getElementById('cargaTrabajoResumen');
    const canvas = document.getElementById('cargaTrabajoChart');
    const vacio = document.getElementById('cargaTrabajoVacio');

    if (tbody) {
        tbody.innerHTML = resultado.recursos.map(r => {
            const id = String(r.id);
            const valores = resultado.dias.map(d => (resultado.carga[id] && resultado.carga[id][d]) || 0);
            const total = valores.reduce((a, b) => a + b, 0);
            const pico = Math.max(0, ...valores);
            const excesos = resultado.sobreasignaciones.filter(s => String(s.recursoId) === id).length;
            return `<tr>
                <th scope="row">${escapeHtml(r.nombre)}</th>
                <td>${r.capacidad} h</td>
                <td>${total.toFixed(1)} h</td>
                <td>${pico.toFixed(1)} h</td>
                <td style="color:${excesos ? 'var(--color-danger-text, #FF6B6B)' : 'var(--accent-success, #81C784)'}">${excesos}</td>
            </tr>`;
        }).join('') || '<tr><td colspan="5" class="u-text-center">Sin recursos asignados al cronograma</td></tr>';
    }
    if (resumen) {
        resumen.textContent = `${resultado.sobreasignaciones.length} sobreasignación(es) detectada(s) en ${resultado.dias.length} días hábiles`;
    }
    if (vacio) vacio.hidden = resultado.dias.length > 0;

    if (!canvas || typeof Chart === 'undefined' || resultado.dias.length === 0) return;
    try {
        Chart.getChart(canvas)?.destroy();
        const oscuro = document.documentElement.getAttribute('data-theme') !== 'light';
        const texto = oscuro ? '#E0E0E0' : '#1F2937';
        const rejilla = oscuro ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)';
        const paleta = ['#007AFF', '#00A859', '#FFB300', '#AF52DE', '#FF6B6B', '#5AC8FA', '#FF9500'];
        const datasets = resultado.recursos.map((r, i) => ({
            label: r.nombre,
            data: resultado.dias.map(d => (resultado.carga[String(r.id)] && resultado.carga[String(r.id)][d]) || 0),
            backgroundColor: r.color || paleta[i % paleta.length],
            borderRadius: 3,
            stack: 'carga'
        }));
        datasets.push({
            label: 'Exceso de capacidad',
            data: resultado.dias.map(d => resultado.sobreasignaciones
                .filter(s => s.dia === d)
                .reduce((sum, s) => sum + s.exceso, 0)),
            backgroundColor: '#E53935',
            borderRadius: 3,
            stack: 'exceso'
        });
        new Chart(canvas, {
            type: 'bar',
            data: { labels: resultado.dias, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: texto } } },
                scales: {
                    x: { stacked: true, ticks: { color: texto }, grid: { color: rejilla } },
                    y: { stacked: true, beginAtZero: true, ticks: { color: texto }, grid: { color: rejilla },
                        title: { display: true, text: 'Horas/día', color: texto } }
                }
            }
        });
    } catch (error) {
        console.warn('[Carga de trabajo] No se pudo dibujar el histograma', error);
    }
}

window.calcularCargaPorDia = calcularCargaPorDia;
window.renderizarCargaTrabajo = renderizarCargaTrabajo;
