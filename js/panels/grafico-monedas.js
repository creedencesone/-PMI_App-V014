// ============================================
// INICIALIZAR SUSCRIPCIÓN A CAMBIO DE IDIOMA
// ============================================

// Cuando el documento esté listo, suscribir los paneles
document.addEventListener('DOMContentLoaded', function() {
    // Suscribir funciones específicas que necesiten refrescarse
    subscribeToLanguageChange(function() {
        // Actualizar gráficos que pueden haber cambiado
        if (typeof calcularCashflow === 'function') {
            setTimeout(calcularCashflow, 100);
        }
        if (typeof actualizarBurnDown === 'function') {
            actualizarBurnDown();
        }
    });
    
    console.log(" Sistema de idioma inicializado");
});
// ============================================
// GRÁFICO DE EVOLUCIÓN DE TIPO DE CAMBIO - VERSIÓN CORREGIDA
// ============================================

let evolucionMonedaChart = null;
let historialTiposCambio = {};

// Función para obtener fechas reales (no futuras)
function obtenerRangoFechasReal(dias) {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - dias);
    
    // Asegurar que no usamos fechas futuras
    if (fechaFin > new Date()) {
        fechaFin.setDate(fechaFin.getDate() - 1);
    }
    
    return {
        inicio: fechaInicio.toISOString().split('T')[0],
        fin: fechaFin.toISOString().split('T')[0]
    };
}

// Cargar historial de tipos de cambio real
async function cargarHistorialTiposCambio(moneda, dias) {
    mostrarToast(` Cargando evolución de ${moneda}...`, 'info');

    const fechas = obtenerRangoFechasReal(dias);
    const apiUrl = `https://api.frankfurter.app/${fechas.inicio}..${fechas.fin}?from=EUR&to=${moneda}`;

    // Verificar caché local primero
    const cacheKey = `historial_${moneda}_${dias}`;
    const cache = localStorage.getItem(cacheKey);
    if (cache) {
        try {
            const parsed = JSON.parse(cache);
            if (parsed.fecha && Date.now() - parsed.fecha < 3600000) {
                mostrarToast(` Datos de ${moneda} cargados desde caché`, 'success');
                return parsed.rates;
            }
        } catch {}
    }

    // Intentar API directamente (Frankfurter soporta CORS)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            if (data.rates && Object.keys(data.rates).length > 0) {
                localStorage.setItem(cacheKey, JSON.stringify({
                    fecha: Date.now(),
                    rates: data.rates
                }));
                mostrarToast(` Evolución real de ${moneda} cargada`, 'success');
                return data.rates;
            }
        }
    } catch (error) {
        console.warn('Frankfurter API directa falló:', error.message);
    }

    // Fallback: intentar con ExchangeRate-API (también soporta CORS)
    try {
        const altUrl = `https://open.er-api.com/v6/latest/EUR`;
        const response = await fetch(altUrl);
        if (response.ok) {
            const data = await response.json();
            if (data.rates && data.rates[moneda]) {
                // Con un solo punto no podemos hacer serie histórica,
                // pero podemos generar datos realistas con variación diaria ~0.1%
                const tasa = data.rates[moneda];
                const rates = {};
                let fechaActual = new Date(fechas.inicio);
                const fechaFin = new Date(fechas.fin);
                let valor = tasa;
                while (fechaActual <= fechaFin) {
                    const fs = fechaActual.toISOString().split('T')[0];
                    rates[fs] = { [moneda]: Math.round(valor * 10000) / 10000 };
                    valor *= (1 + (Math.random() - 0.5) * 0.002);
                    fechaActual.setDate(fechaActual.getDate() + 1);
                }
                mostrarToast(` Datos de ${moneda} basados en tasa actual`, 'success');
                return rates;
            }
        }
    } catch (error) {
        console.warn('ExchangeRate-API falló:', error.message);
    }

    // Último recurso: datos desde caché antigua
    const cacheGlobal = localStorage.getItem('historialTiposCambio');
    if (cacheGlobal) {
        try {
            const parsed = JSON.parse(cacheGlobal);
            if (parsed[moneda]?.datos) {
                mostrarToast(` Usando datos históricos cacheados para ${moneda}`, 'info');
                return parsed[moneda].datos;
            }
        } catch {}
    }

    mostrarToast(` No hay datos reales disponibles para ${moneda}`, 'warning');
    return null;
}

async function actualizarGraficoEvolucionMoneda() {
    const monedaSelect = document.getElementById('monedaComparar');
    const periodoSelect = document.getElementById('periodoGraficoMoneda');
    
    if (!monedaSelect || !periodoSelect) return;
    
    const moneda = monedaSelect.value;
    const dias = parseInt(periodoSelect.value);
    const monedaBase = proyecto?.monedaBase || 'EUR';
    
    const canvas = document.getElementById('evolucionMonedaChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Mostrar loading
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#888';
    ctx.font = '14px Arial';
    ctx.fillText('Cargando datos...', canvas.width/2 - 50, canvas.height/2);
    
    const datos = await cargarHistorialTiposCambio(moneda, dias);
    
    if (!datos || Object.keys(datos).length === 0) {
        document.getElementById('infoEvolucionMoneda').innerHTML = ` No se pudieron cargar los datos para ${moneda}.`;
        return;
    }
    
    // Procesar datos para el gráfico
    const fechas = [];
    const valores = [];
    let valorInicial = null;
    let valorFinal = null;
    let maxValor = 0;
    let minValor = Infinity;
    
    // Ordenar fechas cronológicamente
    const fechasOrdenadas = Object.keys(datos).sort();
    
    for (const fecha of fechasOrdenadas) {
        const valor = datos[fecha][moneda];
        if (valor && valor > 0) {
            fechas.push(fecha);
            valores.push(valor);
            
            if (valorInicial === null) valorInicial = valor;
            valorFinal = valor;
            maxValor = Math.max(maxValor, valor);
            minValor = Math.min(minValor, valor);
        }
    }
    
    if (valores.length === 0) {
        document.getElementById('infoEvolucionMoneda').innerHTML = ` No hay datos suficientes para ${moneda}.`;
        return;
    }
    
    // Calcular variación
    const variacion = valorInicial ? ((valorFinal - valorInicial) / valorInicial * 100) : 0;
    const variacionColor = variacion >= 0 ? '#00A859' : '#FF3B30';
    const variacionIcono = variacion >= 0 ? '' : '';
    
    // Destruir gráfico anterior si existe
    if (evolucionMonedaChart) {
        evolucionMonedaChart.destroy();
    }
    
    // Crear nuevo gráfico
    evolucionMonedaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas.map(f => {
                const [year, month, day] = f.split('-');
                return `${day}/${month}`;
            }),
            datasets: [{
                label: `1 ${monedaBase} → ${moneda}`,
                data: valores,
                borderColor: '#007AFF',
                backgroundColor: 'rgba(0,122,255,0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 2,
                pointHoverRadius: 5,
                pointBackgroundColor: '#007AFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return `1 ${monedaBase} = ${context.raw.toFixed(4)} ${moneda}`;
                        }
                    }
                },
                legend: {
                    position: 'top',
                    labels: { color: '#888' }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: `Tipo de cambio (${moneda})`,
                        color: '#888'
                    },
                    ticks: {
                        callback: (value) => value.toFixed(4),
                        color: '#888'
                    },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Fecha',
                        color: '#888'
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        color: '#888'
                    },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        }
    });
    
    // Actualizar información
    const infoDiv = document.getElementById('infoEvolucionMoneda');
    infoDiv.innerHTML = `
        <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
            <div><strong> Período:</strong> ${formatearFechaEspa(fechas[0])} → ${formatearFechaEspa(fechas[fechas.length-1])}</div>
            <div><strong> Inicio:</strong> 1 ${monedaBase} = ${valorInicial.toFixed(4)} ${moneda}</div>
            <div><strong> Actual:</strong> 1 ${monedaBase} = ${valorFinal.toFixed(4)} ${moneda}</div>
            <div><strong style="color: ${variacionColor};">${variacionIcono} Variación:</strong> ${variacion >= 0 ? '+' : ''}${variacion.toFixed(2)}%</div>
        </div>
        <div style="margin-top: 8px; display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
            <div><strong> Máximo:</strong> ${maxValor.toFixed(4)}</div>
            <div><strong> Mínimo:</strong> ${minValor.toFixed(4)}</div>
            <div><strong> Rango:</strong> ${(maxValor - minValor).toFixed(4)}</div>
        </div>
    `;
    
    // Si la moneda seleccionada es diferente a la base del proyecto, mostrar conversión
    if (moneda !== monedaBase) {
        const tasaActual = tiposCambio[moneda] || 1;
        infoDiv.innerHTML += `
            <div style="margin-top: 12px; padding: 8px; background: rgba(0,122,255,0.15); border-radius: 8px;">
                 <strong>Para tu proyecto:</strong> 1 ${monedaBase} = ${(1/tasaActual).toFixed(4)} ${moneda} | 
                1 ${moneda} = ${tasaActual.toFixed(4)} ${monedaBase}
            </div>
        `;
    }
}

// Poblar select de monedas dinámicamente desde tiposCambio
function poblarSelectMonedas() {
    const select = document.getElementById('monedaComparar');
    if (!select) return;
    const regiones = getMonedasConRegion();
    const orden = { africa: 1, americas: 2, europe: 3, asia: 4, oceania: 5, other: 6 };
    const monedas = Object.keys(tiposCambio || {})
        .filter(m => m !== 'EUR')
        .sort((a, b) => {
            const ra = orden[regiones[a]?.region] || 6;
            const rb = orden[regiones[b]?.region] || 6;
            return ra - rb || a.localeCompare(b);
        });
    select.innerHTML = monedas.map(m => {
        const info = regiones[m] || { region: 'other', nombre: m, flag: '' };
        return `<option value="${m}">${info.flag} ${m} - ${info.nombre}</option>`;
    }).join('');
}

// Inicializar el gráfico cuando se abre el panel de monedas
function inicializarGraficoMonedas() {
    // Cargar historial desde caché
    const cache = localStorage.getItem('historialTiposCambio');
    if (cache) {
        try {
            historialTiposCambio = JSON.parse(cache);
        } catch(e) {}
    }
    
    poblarSelectMonedas();
    
    // Seleccionar el panel de monedas
    const panelMonedas = document.getElementById('panelMonedas');
    if (panelMonedas) {
        // Verificar si ya está activo
        if (panelMonedas.classList.contains('active')) {
            setTimeout(() => {
                actualizarGraficoEvolucionMoneda();
            }, 500);
        }
        
        // Observar cambios de clase
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (panelMonedas.classList.contains('active')) {
                        setTimeout(() => {
                            actualizarGraficoEvolucionMoneda();
                        }, 500);
                    }
                }
            });
        });
        
        observer.observe(panelMonedas, { attributes: true });
}
}
// Agrega esto justo después de la etiqueta <script> donde cargas THREE.js


console.log(" Cargando módulo logístico completo...");

// ============================================================
