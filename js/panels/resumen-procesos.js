function actualizarResumenGastos() {
    if (!proyecto) return;
    
    console.log("===  ACTUALIZANDO RESUMEN DE GASTOS ===");
    console.log("Moneda base del proyecto:", proyecto.monedaBase);
    console.log("Tipos de cambio disponibles:", tiposCambio);
    
    // Inicializar acumuladores por categoría
    let gastos = {
        personal: 0,
        materiales: 0,
        servicios: 0,
        viajes: 0,
        logistica: 0,
        financieros: 0,
        otros: 0
    };
    
    let desglose = [];
    
    // Definición de nombres de categorías
    const nombresCategoriasLocal = {
        personal: tApp('chart_personal'),
        materiales: tApp('chart_materiales'),
        servicios: tApp('chart_servicios'),
        viajes: tApp('chart_viajes'),
        logistica: tApp('chart_logistica'),
        financieros: tApp('chart_financieros'),
        otros: tApp('chart_otros')
    };
    
    // ========== GASTOS DE MATERIALES (VERSIÓN CORREGIDA) ==========
    console.log("\n--- MATERIALES ---");
    (proyecto.materiales || []).forEach(m => {
        // Calcular coste base
        const costeOriginal = m.cantidad * m.costeUnitario;
        const monedaMaterial = m.moneda;
        
        // Obtener tasa de cambio
        let tasa = tiposCambio[monedaMaterial];
        let costeConvertido = 0;
        
        if (tasa && tasa > 0) {
            costeConvertido = costeOriginal / tasa;
            console.log(` ${m.nombre}: ${costeOriginal} ${monedaMaterial} → ${costeConvertido.toFixed(2)} ${proyecto.monedaBase} (tasa: ${tasa})`);
        } else {
            console.error(` ERROR: No hay tasa para ${monedaMaterial}. Usando valor original sin convertir.`);
            mostrarToast(` No hay tasa de cambio para ${monedaMaterial}. Actualiza los tipos de cambio.`, 'warning');
            costeConvertido = costeOriginal;
        }
        
        // Coste de envío
        let costeEnvioOriginal = m.costeEnvio || 0;
        let costeEnvioConvertido = 0;
        if (costeEnvioOriginal > 0) {
            const monedaEnvio = m.monedaEnvio || m.moneda;
            const tasaEnvio = tiposCambio[monedaEnvio];
            if (tasaEnvio && tasaEnvio > 0) {
                costeEnvioConvertido = costeEnvioOriginal / tasaEnvio;
                console.log(`   Envío: ${costeEnvioOriginal} ${monedaEnvio} → ${costeEnvioConvertido.toFixed(2)} ${proyecto.monedaBase}`);
            } else {
                console.warn(`    Envío sin conversión: ${costeEnvioOriginal} ${monedaEnvio}`);
                costeEnvioConvertido = costeEnvioOriginal;
            }
        }
        
        const total = costeConvertido + costeEnvioConvertido;
        gastos.materiales += total;
        
        desglose.push({
            categoria: " Materiales",
            subcategoria: m.incoterm || "Compra",
            concepto: m.nombre,
            mes: `Mes ${m.mes || 1}`,
            importe: total,
            debug: `${costeOriginal} ${monedaMaterial} = ${total.toFixed(2)} ${proyecto.monedaBase}`
        });
    });
    console.log(` TOTAL MATERIALES: ${gastos.materiales.toFixed(2)} ${proyecto.monedaBase}\n`);
    
    // ========== GASTOS DE SERVICIOS ==========
    console.log("--- SERVICIOS ---");
    (proyecto.servicios || []).forEach(s => {
        const costeOriginal = s.cantidad * s.costeUnitario * (1 + (s.impuesto || 0) / 100);
        const tasa = tiposCambio[s.moneda];
        let total = 0;
        
        if (tasa && tasa > 0) {
            total = costeOriginal / tasa;
            console.log(` ${s.nombre}: ${costeOriginal} ${s.moneda} → ${total.toFixed(2)} ${proyecto.monedaBase}`);
        } else {
            console.error(` ERROR: No hay tasa para ${s.moneda}`);
            total = costeOriginal;
        }
        
        gastos.servicios += total;
        desglose.push({
            categoria: " Servicios",
            subcategoria: `Impuesto ${s.impuesto || 0}%`,
            concepto: s.nombre,
            mes: `Mes ${s.mes || 1}`,
            importe: total
        });
    });
    
    // ========== GASTOS DE VIAJES ==========
    console.log("--- VIAJES ---");
    (proyecto.viajes || []).forEach(v => {
        const costeOriginal = (v.costeVuelos || 0) + (v.costeHotel || 0) + (v.costeComidas || 0) + (v.costeTraslados || 0);
        const tasa = tiposCambio[v.moneda];
        let total = 0;
        
        if (tasa && tasa > 0) {
            total = costeOriginal / tasa;
            console.log(` ${v.nombre}: ${costeOriginal} ${v.moneda} → ${total.toFixed(2)} ${proyecto.monedaBase}`);
        } else {
            console.error(` ERROR: No hay tasa para ${v.moneda}`);
            total = costeOriginal;
        }
        
        gastos.viajes += total;
        desglose.push({
            categoria: " Viajes",
            subcategoria: v.destino || "Desplazamiento",
            concepto: `${v.nombre} - ${v.motivo || 'Sin motivo'}`,
            mes: v.fechaSalida ? new Date(v.fechaSalida).toLocaleDateString() : `Mes ${v.mes || 1}`,
            importe: total
        });
    });
    
    // ========== GASTOS DE LOGÍSTICA (Envios) ==========
    (proyecto.envios || []).forEach(e => {
        let total = convertirMoneda(e.costeTotalEnvio || 0, proyecto.monedaBase);
        gastos.logistica += total;
        desglose.push({
            categoria: " Logística",
            subcategoria: e.incoterm || "Envío",
            concepto: e.nombre,
            mes: "Según envío",
            importe: total
        });
    });
    
    // ========== GASTOS FINANCIEROS ==========
    (proyecto.costesFinancierosExtra || []).forEach(c => {
        let total = c.tipo === 'porcentaje' ? (c.base || 0) * (c.tasa / 100) : c.tasa;
        total = convertirMoneda(total, c.moneda);
        gastos.financieros += total;
        desglose.push({
            categoria: " Financieros",
            subcategoria: c.tipo === 'porcentaje' ? 'Porcentaje' : 'Fijo',
            concepto: c.concepto,
            mes: c.periodicidad || "Único",
            importe: total
        });
    });
    
    // ========== GASTOS DE TAREAS DEL GANTT ==========
    (proyecto.elementosGantt || []).forEach(tarea => {
        if (tarea.tipo !== 'hito' && tarea.recursoAsignado && tarea.costeEstimado > 0) {
            let coste = convertirMoneda(tarea.costeEstimado, tarea.recursoAsignado.moneda || proyecto.monedaBase);
            gastos.personal += coste;
            desglose.push({
                categoria: " Personal",
                subcategoria: "Tareas",
                concepto: tarea.nombre,
                mes: tarea.inicio ? new Date(tarea.inicio).toLocaleDateString() : "Planificado",
                importe: coste
            });
        }
    });
    
    // Calcular total
    let totalGastos = Object.values(gastos).reduce((a, b) => a + b, 0);
    console.log(`\n TOTAL GENERAL GASTOS: ${totalGastos.toFixed(2)} ${proyecto.monedaBase}`);
    console.log("=== FIN RESUMEN GASTOS ===\n");
    
    // Actualizar tarjetas de resumen
    document.getElementById('resumenTotalGastos').innerHTML = formatearMoneda(totalGastos);
    document.getElementById('resumenGastoPersonal').innerHTML = formatearMoneda(gastos.personal);
    document.getElementById('resumenGastoMateriales').innerHTML = formatearMoneda(gastos.materiales);
    document.getElementById('resumenGastoServicios').innerHTML = formatearMoneda(gastos.servicios);
    document.getElementById('resumenGastoViajes').innerHTML = formatearMoneda(gastos.viajes);
    document.getElementById('resumenGastoLogistica').innerHTML = formatearMoneda(gastos.logistica);
    document.getElementById('resumenGastoFinancieros').innerHTML = formatearMoneda(gastos.financieros);
    
    // Calcular porcentaje vs presupuesto
    let presupuesto = proyecto.acta?.presupuesto || proyecto.precioVenta || totalGastos;
    let porcentajePresupuesto = totalGastos > 0 ? (totalGastos / presupuesto) * 100 : 0;
    document.getElementById('resumenPorcentajePresupuesto').innerHTML = porcentajePresupuesto.toFixed(1) + '%';
    
    // Ordenar desglose por importe (mayor a menor)
    desglose.sort((a, b) => b.importe - a.importe);
    
    // Generar tabla de desglose
    let desgloseHtml = '';
    desglose.forEach(item => {
        let porcentaje = totalGastos > 0 ? (item.importe / totalGastos) * 100 : 0;
        let debugInfo = item.debug ? `<br><span style="font-size: 8px; color: #888;">${item.debug}</span>` : '';
        desgloseHtml += `<tr>
            <td><strong>${item.categoria}</strong>${debugInfo}</td>
            <td>${item.subcategoria}</td>
            <td>${escapeHtml(item.concepto)}</td>
            <td>${item.mes}</td>
            <td>${formatearMoneda(item.importe)}</td>
            <td class="u-color-success">${porcentaje.toFixed(1)}%</td>
        </tr>`;
    });
    
    document.getElementById('desgloseGastosBody').innerHTML = desgloseHtml || '<tr><td colspan="6" class="u-text-center">No hay datos de gastos</td></tr>';
    document.getElementById('desgloseTotalGeneral').innerHTML = formatearMoneda(totalGastos);
    
    // Generar gráfico de distribución
    const ctx = document.getElementById('distribucionGastosChart')?.getContext('2d');
    if (ctx) {
        if (distribucionGastosChart) distribucionGastosChart.destroy();
        
        let categorias = [];
        let valores = [];
        let colores = [];
        
        const coloresPorCategoria = {
            personal: '#007AFF',
            materiales: '#FF8C00',
            servicios: '#00A859',
            viajes: '#FF3B30',
            logistica: '#AF52DE',
            financieros: '#FFCC00',
            otros: '#5856D6'
        };
        
        for (let [key, value] of Object.entries(gastos)) {
            if (value > 0) {
                categorias.push(nombresCategoriasLocal[key] || key);
                valores.push(value);
                colores.push(coloresPorCategoria[key] || '#5856D6');
            }
        }
        
        distribucionGastosChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categorias,
                datasets: [{
                    data: valores,
                    backgroundColor: colores,
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: document.documentElement.getAttribute('data-theme') === 'light' ? '#1a1a2e' : '#e0e0e0', font: { size: 11 } }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                let label = context.label || '';
                                let value = context.raw;
                                let total = context.dataset.data.reduce((a, b) => a + b, 0);
                                let porcentaje = total > 0 ? (value / total) * 100 : 0;
                                return `${label}: ${formatearMoneda(value)} (${porcentaje.toFixed(1)}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }
    
    // Generar análisis de gastos
    let categoriaMayor = '';
    let mayorValor = 0;
    for (let [key, value] of Object.entries(gastos)) {
        if (value > mayorValor) {
            mayorValor = value;
            categoriaMayor = nombresCategoriasLocal[key];
        }
    }
    
    let analisisHtml = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
            <div style="background: rgba(0,122,255,0.15); padding: 12px; border-radius: 12px;">
                <strong> Principales hallazgos:</strong><br>
                • La mayor partida de gasto es <strong>${categoriaMayor}</strong> con ${formatearMoneda(mayorValor)} (${((mayorValor/totalGastos)*100).toFixed(1)}% del total)<br>
                • ${gastos.personal > gastos.materiales ? 'El coste de personal supera al de materiales' : 'Los materiales representan una inversión significativa'}<br>
                • Los gastos financieros representan ${((gastos.financieros/totalGastos)*100).toFixed(1)}% del total
            </div>
            <div style="background: rgba(52,199,89,0.1); padding: 12px; border-radius: 12px;">
                <strong> Recomendaciones:</strong><br>
                • Revisar periódicamente los gastos de ${categoriaMayor.toLowerCase()} para identificar oportunidades de ahorro<br>
                • Establecer alertas cuando los gastos superen el ${porcentajePresupuesto.toFixed(0)}% del presupuesto<br>
                • Considerar negociación con proveedores para reducir costes
            </div>
        </div>
        <div style="margin-top: 16px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 8px; font-size: 11px;">
             <strong>Resumen ejecutivo:</strong> El proyecto ha ejecutado ${formatearMoneda(totalGastos)} de gastos, lo que representa el ${porcentajePresupuesto.toFixed(1)}% del presupuesto total.
            ${porcentajePresupuesto > 100 ? ' Se ha superado el presupuesto inicial.' : ' El proyecto está dentro del presupuesto.'}
        </div>
    `;
    
    const analisisElement = document.getElementById('analisisGastosTexto');
    if (analisisElement) analisisElement.innerHTML = analisisHtml;
    
    mostrarToast(" Resumen de gastos actualizado", 'success');
    // Guardar resumen de gastos para el dashboard
    proyecto.resumenGastos = {
    totalGastos: totalGastos,
    desglose: desglose,
    fechaActualizacion: new Date().toISOString()
};
guardarProyecto();
}

function exportarResumenGastos() {
    if (!proyecto) return;
    
    let csv = "Categoría,Subcategoría,Concepto,Mes,Importe (EUR),% del Total\n";
    
    const filas = document.querySelectorAll('#desgloseGastosBody tr');
    filas.forEach(fila => {
        const celdas = fila.querySelectorAll('td');
        if (celdas.length >= 6) {
            csv += `"${celdas[0].innerText.replace(/</g, '&lt;')}","${celdas[1].innerText}","${celdas[2].innerText}","${celdas[3].innerText}","${celdas[4].innerText}","${celdas[5].innerText}"\n`;
        }
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `resumen_gastos_${proyecto.nombre}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    mostrarToast(" Resumen de gastos exportado a CSV", 'success');
}
        
        // ============================================
        // PROCESOS PMBOK
        // ============================================
        function renderizarProcesos() {
            const grid = document.getElementById('procesosGrid');
            if (!proyecto.procesos) proyecto.procesos = JSON.parse(JSON.stringify(PROCESOS_PMBOK));
            
            const grupos = {};
            proyecto.procesos.forEach(p => { if (!grupos[p.grupo]) grupos[p.grupo] = []; grupos[p.grupo].push(p); });
            
            let html = '';
            for (const [grupo, procesos] of Object.entries(grupos)) {
                const faseColor = (typeof FASE_COLORS !== 'undefined' && FASE_COLORS[grupo]) ? FASE_COLORS[grupo] : '#007AFF';
                html += `<div class="info-card fase-card u-mb-16" style="--fase-color: ${faseColor}"><h4> ${grupo}</h4>`;
                procesos.forEach(p => {
                    const statusIcon = p.completado
                        ? '<span style="color:#00A859;font-weight:700">✓</span>'
                        : '<span style="color:rgba(128,128,128,0.4)">○</span>';
                    html += `<div class="process-card" onclick="toggleProceso(${p.id})" style="border-left-color: ${faseColor}"><div class="u-flex-jc-sb"><span>${escapeHtml(p.nombre)}</span><span>${statusIcon}</span></div></div>`;
                });
                html += `</div>`;
            }
            grid.innerHTML = html;
        }
        
        function toggleProceso(id) {
            let p = proyecto.procesos.find(p => p.id === id);
            if (p) { p.completado = !p.completado; guardarProyecto(); renderizarProcesos(); calcularCashflow(); mostrarToast(`${p.nombre}: ${p.completado ? 'Completado' : 'Pendiente'}`, 'success'); }
        }
        
        function resetearProcesos() {
            if (confirm(tApp('confirmar_resetear_procesos'))) {
                proyecto.procesos = JSON.parse(JSON.stringify(PROCESOS_PMBOK));
                guardarProyecto();
                renderizarProcesos();
                mostrarToast(tApp('toast_procesos_reseteados'), 'success');
            }
        }
        
        // ============================================
        // MATERIALES
        // ============================================