// ============================================================
// SIMULACIÓN MONTE CARLO para Cronograma y Costes
// ============================================================

let monteCarloChart = null;

function abrirMonteCarlo() {
    let modal = document.getElementById('modalMonteCarlo');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalMonteCarlo';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <span class="close-modal" onclick="cerrarMonteCarlo()">&times;</span>
                <h2 style="margin-bottom:8px;"> Simulación Monte Carlo</h2>
                <p style="opacity:0.6;font-size:13px;margin-bottom:20px;">
                    Estima la probabilidad de cumplir fechas y presupuestos mediante simulación estadística.
                </p>

                <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:20px;">
                    <div style="flex:1;min-width:180px;">
                        <label style="font-size:12px;opacity:0.7;">Iteraciones</label>
                        <select id="mcIteraciones" style="width:100%;padding:8px 10px;border-radius:8px;">
                            <option value="100">100 (rápido)</option>
                            <option value="500">500</option>
                            <option value="1000" selected>1,000</option>
                            <option value="5000">5,000 (preciso)</option>
                        </select>
                    </div>
                    <div style="flex:1;min-width:180px;">
                        <label style="font-size:12px;opacity:0.7;">Variación duración ±</label>
                        <select id="mcVariacion" style="width:100%;padding:8px 10px;border-radius:8px;">
                            <option value="0.1">10%</option>
                            <option value="0.2" selected>20%</option>
                            <option value="0.3">30%</option>
                            <option value="0.5">50%</option>
                        </select>
                    </div>
                    <div style="flex:1;min-width:180px;">
                        <label style="font-size:12px;opacity:0.7;">Distribución</label>
                        <select id="mcDistribucion" style="width:100%;padding:8px 10px;border-radius:8px;">
                            <option value="triangular" selected>Triangular</option>
                            <option value="normal">Normal</option>
                            <option value="uniforme">Uniforme</option>
                        </select>
                    </div>
                    <div style="display:flex;align-items:flex-end;">
                        <button class="btn-primary" onclick="ejecutarMonteCarlo()" style="padding:8px 24px;">
                             Simular
                        </button>
                    </div>
                </div>

                <div id="mcResultados" style="display:none;">
                    <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
                        <div class="info-card" style="flex:1;min-width:140px;padding:12px;">
                            <div style="font-size:11px;opacity:0.6;">P50 (Mediana)</div>
                            <div id="mcP50" style="font-size:20px;font-weight:700;">-</div>
                        </div>
                        <div class="info-card" style="flex:1;min-width:140px;padding:12px;">
                            <div style="font-size:11px;opacity:0.6;">P80 (Confianza 80%)</div>
                            <div id="mcP80" style="font-size:20px;font-weight:700;">-</div>
                        </div>
                        <div class="info-card" style="flex:1;min-width:140px;padding:12px;">
                            <div style="font-size:11px;opacity:0.6;">P95 (Confianza 95%)</div>
                            <div id="mcP95" style="font-size:20px;font-weight:700;">-</div>
                        </div>
                        <div class="info-card" style="flex:1;min-width:140px;padding:12px;">
                            <div style="font-size:11px;opacity:0.6;">Prob. dentro del plan</div>
                            <div id="mcProbPlan" style="font-size:20px;font-weight:700;">-</div>
                        </div>
                    </div>

                    <div id="mcWhatIfWrap" style="margin-bottom:16px;">
                        <h4 style="font-size:13px;margin-bottom:8px;">Escenarios de compresión (what-if)</h4>
                        <table class="data-table">
                            <caption class="sr-only">Comparativa de duración, coste adicional y riesgo entre línea base, crashing y fast-tracking</caption>
                            <thead><tr><th scope="col">Escenario</th><th scope="col">Duración (d)</th><th scope="col">Coste adicional</th><th scope="col">Riesgo</th></tr></thead>
                            <tbody id="mcWhatIfBody"></tbody>
                        </table>
                    </div>

                    <div id="mcHitosWrap" style="margin-bottom:16px;">
                        <h4 style="font-size:13px;margin-bottom:8px;">Distribución de hitos (días desde el inicio)</h4>
                        <table class="data-table">
                            <caption class="sr-only">Percentiles P50, P80 y P95 de cada hito simulado</caption>
                            <thead><tr><th scope="col">Hito</th><th scope="col">P50</th><th scope="col">P80</th><th scope="col">P95</th></tr></thead>
                            <tbody id="mcHitosBody"></tbody>
                        </table>
                    </div>

                    <div style="display:flex;gap:12px;flex-wrap:wrap;">
                        <div style="flex:1;min-width:280px;">
                            <h4 style="font-size:13px;margin-bottom:8px;"> Duración del proyecto</h4>
                            <canvas id="mcChartDuracion" height="200"></canvas>
                        </div>
                        <div style="flex:1;min-width:280px;">
                            <h4 style="font-size:13px;margin-bottom:8px;"> Coste total del proyecto</h4>
                            <canvas id="mcChartCoste" height="200"></canvas>
                        </div>
                    </div>

                    <div style="margin-top:16px;">
                        <h4 style="font-size:13px;margin-bottom:8px;">Curva S de Probabilidad Acumulada</h4>
                        <canvas id="mcChartSCurve" height="200"></canvas>
                    </div>
                </div>

                <div id="mcLoading" style="display:none;text-align:center;padding:40px;">
                    <div style="font-size:32px;margin-bottom:12px;"></div>
                    <div>Simulando... <span id="mcProgreso">0</span>/<span id="mcTotal">1000</span> iteraciones</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    document.getElementById('mcResultados').style.display = 'none';
}

function cerrarMonteCarlo() {
    const modal = document.getElementById('modalMonteCarlo');
    if (modal) modal.style.display = 'none';
    if (monteCarloChart) { monteCarloChart.destroy(); monteCarloChart = null; }
}

function _triangular(opt, ml, pes) {
    const r = Math.random();
    const f = (pes - opt) * (ml - opt);
    if (f === 0) return ml;
    if (r <= (ml - opt) / (pes - opt)) {
        return opt + Math.sqrt(r * (pes - opt) * (ml - opt));
    }
    return pes - Math.sqrt((1 - r) * (pes - opt) * (pes - ml));
}

function _normal(media, desv) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return media + desv * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}


function _diasCalendario(duracionHabiles, fechaReferencia) {
    if (!(duracionHabiles > 0)) return 0;
    const ancla = fechaReferencia || '2024-01-01';
    const base = parseLocalDate(ancla);
    const fin = parseLocalDate(sumarDiasHabiles(ancla, duracionHabiles));
    return Math.max(1, Math.round((fin - base) / 86400000));
}

function _ordenTopologico(tareas) {
    const ids = new Set(tareas.map(t => t.id));
    const ady = {}, grado = {};
    tareas.forEach(t => { ady[t.id] = []; grado[t.id] = 0; });
    tareas.forEach(t => {
        (t.predecesores || []).forEach(p => {
            if (ids.has(p.id) && ady[p.id]) { ady[p.id].push(t.id); grado[t.id]++; }
        });
    });
    const cola = tareas.filter(t => grado[t.id] === 0).map(t => t.id);
    const orden = [];
    while (cola.length) {
        const id = cola.shift();
        orden.push(id);
        (ady[id] || []).forEach(s => { if (--grado[s] === 0) cola.push(s); });
    }
    const conCiclo = orden.length !== tareas.length;
    if (conCiclo) tareas.forEach(t => { if (!orden.includes(t.id)) orden.push(t.id); });
    return { orden, conCiclo };
}

/** Calendario CPM de una red con FS/SS/FF/SF y leads (retraso negativo). */
function _calendarioRed(orden, porId, duraciones) {
    const inicio = {}, fin = {};
    orden.forEach(id => {
        const tarea = porId[id];
        if (!tarea) return;
        inicio[id] = null;
        (tarea.predecesores || []).forEach(p => {
            if (!porId[p.id]) return;
            const esPred = inicio[p.id] || 0;
            const efPred = fin[p.id] || 0;
            const tipo = String(p.tipo || 'FS').trim().toUpperCase();
            let minInicio = efPred;
            if (tipo === 'SS') minInicio = esPred;
            if (tipo === 'FF') minInicio = efPred - (duraciones[id] || 0);
            if (tipo === 'SF') minInicio = esPred - (duraciones[id] || 0);
            minInicio += (typeof retrasoEnDiasNaturales === 'function')
                ? retrasoEnDiasNaturales(p.retraso)
                : (p.retraso || 0);
            if (inicio[id] === null || minInicio > inicio[id]) inicio[id] = minInicio;
        });
        if (inicio[id] === null) inicio[id] = 0;
        fin[id] = inicio[id] + (duraciones[id] || 0);
    });
    return { inicio, fin };
}

function _finTareaRed(id, orden, porId, duraciones) {
    const { fin } = _calendarioRed(orden, porId, duraciones);
    return fin[id] || 0;
}

function _makespanRed(orden, porId, duraciones) {
    const { inicio, fin } = _calendarioRed(orden, porId, duraciones);
    const fines = Object.values(fin);
    if (!fines.length) return 0;
    // FF/SF con lead pueden comenzar en negativo: se desplaza toda la red
    // al origen en vez de recortar el inicio del sucesor.
    const minimo = Math.min(0, ...Object.values(inicio));
    return Math.max(...fines) - minimo;
}

function ejecutarMonteCarlo() {
    const elementos = (proyecto.elementosGantt || []).filter(e => e.tipo !== 'edt');
    if (elementos.length === 0) {
        mostrarToast(' No hay tareas en el cronograma', 'warning');
        return;
    }

    const iterStr = document.getElementById('mcIteraciones');
    const variacionStr = document.getElementById('mcVariacion');
    const distStr = document.getElementById('mcDistribucion');
    const iteraciones = parseInt(iterStr?.value || 1000);
    const variacion = parseFloat(variacionStr?.value || 0.2);
    const distribucion = distStr?.value || 'triangular';

    const loading = document.getElementById('mcLoading');
    const resultados = document.getElementById('mcResultados');
    const mcProgreso = document.getElementById('mcProgreso');
    const mcTotal = document.getElementById('mcTotal');

    loading.style.display = 'block';
    resultados.style.display = 'none';
    if (mcTotal) mcTotal.textContent = iteraciones;

    const porId = {};
    elementos.forEach(e => { porId[e.id] = e; });
    const topologia = _ordenTopologico(elementos);
    if (topologia.conCiclo) {
        mostrarToast('Hay dependencias circulares: la simulación usa un orden aproximado', 'warning');
    }

    const duracionesPlan = {};
    elementos.forEach(e => { duracionesPlan[e.id] = _diasCalendario(e.duracion || 0, e.inicio); });

    const resultadosDuracion = [];
    const resultadosCoste = [];
    const resultadosHitos = {};
    const hitos = elementos.filter(e => e.tipo === 'hito');
    hitos.forEach(h => { resultadosHitos[h.id] = []; });

    function mostrarUnaDuracion(base) {
        const optimista = base * (1 - variacion);
        const pesimista = base * (1 + variacion);
        if (distribucion === 'triangular') return _triangular(optimista, base, pesimista);
        if (distribucion === 'normal') return _normal(base, (pesimista - optimista) / 6);
        return optimista + Math.random() * (pesimista - optimista);
    }

    function runBatch(batchStart, batchSize) {
        const batchEnd = Math.min(batchStart + batchSize, iteraciones);
        for (let i = batchStart; i < batchEnd; i++) {
            const duraciones = {};
            let costeSim = 0;

            elementos.forEach(e => {
                const base = Math.max(0, e.duracion || 0);
                let varHabiles = base > 0 ? Math.max(0.05, mostrarUnaDuracion(base)) : 0;
                duraciones[e.id] = _diasCalendario(varHabiles, e.inicio);
                costeSim += (e.costeEstimado || 0) * (base > 0 ? varHabiles / base : 1);
            });

            const calendario = _calendarioRed(topologia.orden, porId, duraciones);
            const minimo = Math.min(0, ...Object.values(calendario.inicio));
            resultadosDuracion.push(Math.round(Math.max(...Object.values(calendario.fin)) - minimo));
            resultadosCoste.push(costeSim);
            hitos.forEach(h => {
                resultadosHitos[h.id].push((calendario.fin[h.id] || 0) - minimo);
            });
        }

        if (mcProgreso) mcProgreso.textContent = batchEnd;

        if (batchEnd < iteraciones) {
            setTimeout(() => runBatch(batchEnd, batchSize), 0);
        } else {
            mostrarResultados(resultadosDuracion, resultadosCoste, elementos, resultadosHitos);
            renderizarEscenariosWhatIf();
            loading.style.display = 'none';
            resultados.style.display = 'block';
        }
    }

    const batchSize = Math.min(100, Math.max(10, Math.floor(iteraciones / 10)));
    runBatch(0, batchSize);
}

function mostrarResultados(dias, costes, elementos, resultadosHitos) {
    dias.sort((a, b) => a - b);
    costes.sort((a, b) => a - b);
    const n = dias.length;

    // Percentil nearest-rank: ceil(n·p)-1, sin desplazamiento hacia abajo.
    const cuantil = (valores, p) => valores[Math.max(0, Math.ceil(valores.length * p) - 1)];

    // Estadísticos duración
    const p50d = Math.round(cuantil(dias, 0.5));
    const p80d = Math.round(cuantil(dias, 0.8));
    const p95d = Math.round(cuantil(dias, 0.95));
    const mediaD = dias.reduce((a, b) => a + b, 0) / n;

    // Estadísticos coste
    const p50c = cuantil(costes, 0.5);
    const p80c = cuantil(costes, 0.8);
    const p95c = cuantil(costes, 0.95);

    // Probabilidad dentro del plan
    const porIdPlan = {};
    const duracionesPlan = {};
    elementos.forEach(e => {
        porIdPlan[e.id] = e;
        duracionesPlan[e.id] = _diasCalendario(e.duracion || 0, e.inicio);
    });
    const cpmMakespan = (typeof cpmResult !== 'undefined' && cpmResult && Number(cpmResult.makespan) > 0)
        ? Number(cpmResult.makespan)
        : _makespanRed(_ordenTopologico(elementos).orden, porIdPlan, duracionesPlan);
    const duracionPlan = Math.round(cpmMakespan);
    const dentroPlan = dias.filter(d => d <= duracionPlan).length / n * 100;

    const escribir = (id, valor) => { const el = document.getElementById(id); if (el) el.textContent = valor; };
    escribir('mcP50', p50d + ' días');
    escribir('mcP80', p80d + ' días');
    escribir('mcP95', p95d + ' días');
    escribir('mcProbPlan', dentroPlan.toFixed(1) + '%');

    const hitosBody = document.getElementById('mcHitosBody');
    if (hitosBody) {
        const hitos = elementos.filter(e => e.tipo === 'hito');
        hitosBody.innerHTML = hitos.map(h => {
            const valores = (resultadosHitos && resultadosHitos[h.id]) || [];
            if (!valores.length) return `<tr><td>${escapeHtml(h.nombre || 'Hito')}</td><td colspan="3">Sin datos</td></tr>`;
            valores.sort((a, b) => a - b);
            const q = p => Math.round(cuantil(valores, p));
            return `<tr><td>${escapeHtml(h.nombre || 'Hito')}</td><td>${q(0.5)}</td><td>${q(0.8)}</td><td>${q(0.95)}</td></tr>`;
        }).join('') || '<tr><td colspan="4" class="u-text-center">No hay hitos en el cronograma</td></tr>';
    }

    // Obtener colores según tema
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const textColor = isDark ? '#e0e0e0' : '#1a1a2e';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';

    // Destruir charts previos
    ['mcChartDuracion', 'mcChartCoste', 'mcChartSCurve'].forEach(id => {
        const ch = Chart.getChart(id);
        if (ch) ch.destroy();
    });

    // Histograma duración
    const binsD = _histograma(dias, 20);
    const ctxD = document.getElementById('mcChartDuracion')?.getContext('2d');
    if (ctxD) {
        new Chart(ctxD, {
            type: 'bar',
            data: {
                labels: binsD.labels,
                datasets: [{
                    label: tApp('chart_frecuencia'),
                    data: binsD.counts,
                    backgroundColor: '#007AFF',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor }, beginAtZero: true }
                }
            }
        });
    }

    // Histograma coste
    const binsC = _histograma(costes, 20);
    const ctxC = document.getElementById('mcChartCoste')?.getContext('2d');
    if (ctxC) {
        new Chart(ctxC, {
            type: 'bar',
            data: {
                labels: binsC.labels,
                datasets: [{
                    label: tApp('chart_frecuencia'),
                    data: binsC.counts,
                    backgroundColor: '#00A859',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor }, beginAtZero: true }
                }
            }
        });
    }

    // Curva S
    const sLabels = [];
    const sData = [];
    const step = Math.max(1, Math.floor(dias.length / 50));
    for (let i = 0; i < dias.length; i += step) {
        const d = dias[i];
        const pct = (i / n * 100).toFixed(1);
        sLabels.push(d + 'd');
        sData.push(pct);
    }
    // Asegurar último punto
    if (sLabels[sLabels.length - 1] !== dias[n - 1] + 'd') {
        sLabels.push(dias[n - 1] + 'd');
        sData.push('100');
    }

    const ctxS = document.getElementById('mcChartSCurve')?.getContext('2d');
    if (ctxS) {
        new Chart(ctxS, {
            type: 'line',
            data: {
                labels: sLabels,
                datasets: [{
                    label: tApp('chart_probabilidad_acumulada'),
                    data: sData,
                    borderColor: '#FF9500',
                    backgroundColor: 'rgba(255,149,0,0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y}%` } }
                },
                scales: {
                    x: { ticks: { color: textColor, font: { size: 9 } }, grid: { color: gridColor }, title: { display: true,                     text: tApp('chart_duracion'), color: textColor } },
                    y: { ticks: { color: textColor, font: { size: 10 }, callback: (v) => v + '%' }, grid: { color: gridColor }, beginAtZero: true, max: 100 }
                }
            }
        });
    }
}

function _histograma(data, numBins) {
    const min = data[0];
    const max = data[data.length - 1];
    const rango = max - min || 1;
    const binSize = rango / numBins;
    const labels = [];
    const counts = new Array(numBins).fill(0);

    data.forEach(v => {
        const idx = Math.min(numBins - 1, Math.floor((v - min) / binSize));
        counts[idx]++;
    });

    for (let i = 0; i < numBins; i++) {
        const lo = Math.round(min + i * binSize);
        const hi = Math.round(min + (i + 1) * binSize);
        labels.push(lo + '-' + hi);
    }

    return { labels, counts };
}


function renderizarEscenariosWhatIf() {
    const cuerpo = document.getElementById('mcWhatIfBody');
    if (!cuerpo || typeof simularEscenariosCompresion !== 'function') return;
    const escenarios = simularEscenariosCompresion(proyecto);
    cuerpo.innerHTML = escenarios.map(e => `<tr>
        <th scope="row">${escapeHtml(e.nombre)}</th>
        <td>${e.duracion}</td>
        <td>${e.costeExtra ? formatearMoneda(e.costeExtra) : '—'}</td>
        <td>${escapeHtml(e.riesgo)}</td>
    </tr>`).join('');
}
window.renderizarEscenariosWhatIf = renderizarEscenariosWhatIf;
