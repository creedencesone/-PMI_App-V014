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

function ejecutarMonteCarlo() {
    const elementos = (proyecto.elementosGantt || []).filter(e => e.tipo !== 'edt' && e.duracion > 0);
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

    // Usar requestAnimationFrame para no bloquear la UI
    const resultadosDuracion = [];
    const resultadosCoste = [];

    function runBatch(batchStart, batchSize) {
        const batchEnd = Math.min(batchStart + batchSize, iteraciones);
        for (let i = batchStart; i < batchEnd; i++) {
            let maxDias = 0;
            let costeSim = 0;
            const fechasSim = {};

            elementos.forEach(e => {
                let d = e.duracion;
                const optimista = d * (1 - variacion);
                const pesimista = d * (1 + variacion);

                let varD = d;
                if (distribucion === 'triangular') {
                    varD = _triangular(optimista, d, pesimista);
                } else if (distribucion === 'normal') {
                    const desv = (pesimista - optimista) / 6;
                    varD = _normal(d, desv);
                } else {
                    varD = optimista + Math.random() * (pesimista - optimista);
                }
                varD = Math.max(0.05, varD);

                // Calcular fecha fin con la duración variada
                let inicio = e.inicio;
                if (e.predecesores && e.predecesores.length > 0) {
                    e.predecesores.forEach(p => {
                        const predInicio = fechasSim[p.id];
                        if (predInicio && (!inicio || predInicio > inicio)) {
                            inicio = predInicio;
                        }
                    });
                }
                // Aplicar FF si existe
                if (e.tipo === 'ff' && e.predecesores && e.predecesores.some(p => p.tipo === 'FF')) {
                    // FF: tarea no puede terminar antes que su predecesora
                    e.predecesores.forEach(p => {
                        const predFin = fechasSim[p.id];
                        if (predFin && inicio && predFin > inicio) {
                            inicio = predFin;
                        }
                    });
                }

                if (inicio) {
                    const fin = sumarDiasHabiles(inicio, varD);
                    const dias = Math.round((parseLocalDate(fin) - parseLocalDate(inicio)) / 86400000);
                    maxDias = Math.max(maxDias, dias);
                    fechasSim[e.id] = fin;
                }

                costeSim += (e.costeEstimado || 0) * (varD / Math.max(e.duracion, 0.01));
            });

            resultadosDuracion.push(maxDias);
            resultadosCoste.push(costeSim);
        }

        if (mcProgreso) mcProgreso.textContent = batchEnd;

        if (batchEnd < iteraciones) {
            setTimeout(() => runBatch(batchEnd, batchSize), 0);
        } else {
            mostrarResultados(resultadosDuracion, resultadosCoste, elementos);
            loading.style.display = 'none';
            resultados.style.display = 'block';
        }
    }

    const batchSize = Math.min(100, Math.max(10, Math.floor(iteraciones / 10)));
    runBatch(0, batchSize);
}

function mostrarResultados(dias, costes, elementos) {
    dias.sort((a, b) => a - b);
    costes.sort((a, b) => a - b);
    const n = dias.length;

    // Estadísticos duración
    const p50d = dias[Math.floor(n * 0.5)];
    const p80d = dias[Math.floor(n * 0.8)];
    const p95d = dias[Math.floor(n * 0.95)];
    const mediaD = dias.reduce((a, b) => a + b, 0) / n;

    // Estadísticos coste
    const p50c = costes[Math.floor(n * 0.5)];
    const p80c = costes[Math.floor(n * 0.8)];
    const p95c = costes[Math.floor(n * 0.95)];

    // Probabilidad dentro del plan
    const duracionPlan = elementos.reduce((max, e) => {
        if (e.inicio && e.duracion) {
            const fin = sumarDiasHabiles(e.inicio, e.duracion);
            const d = diffDias(parseLocalDate(fin), parseLocalDate(e.inicio));
            return Math.max(max, d);
        }
        return max;
    }, 0);
    const dentroPlan = dias.filter(d => d <= duracionPlan).length / n * 100;

    document.getElementById('mcP50').textContent = p50d + ' días';
    document.getElementById('mcP80').textContent = p80d + ' días';
    document.getElementById('mcP95').textContent = p95d + ' días';
    document.getElementById('mcProbPlan').textContent = dentroPlan.toFixed(1) + '%';

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
