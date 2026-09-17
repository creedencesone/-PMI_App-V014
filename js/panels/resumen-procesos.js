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
        // Iconos SVG inline Lucide (20x20, stroke currentColor) por fase y por dominio
        const ICONOS_FASE = {
            "Inicio": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
            "Planificación": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>',
            "Ejecución": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>',
            "Monitoreo y Control": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
            "Cierre": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
        };
        const ICONO_DOMINIO_DEFAULT = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';

        function renderizarProcesos() {
            const grid = document.getElementById('procesosGrid');
            if (typeof sincronizarProcesosConPMBOK === 'function') sincronizarProcesosConPMBOK(proyecto);
            else if (!proyecto.procesos) proyecto.procesos = JSON.parse(JSON.stringify(PROCESOS_PMBOK));

            const expandidos = new Set();
            document.querySelectorAll('.pmbok-col.expanded').forEach(col => {
                const titulo = col.querySelector('.pmbok-col-title');
                if (titulo) expandidos.add(titulo.textContent.trim());
            });

            const grupos = {};
            proyecto.procesos.forEach(p => { if (!grupos[p.grupo]) grupos[p.grupo] = []; grupos[p.grupo].push(p); });

            const COLORS_FASES = {"Inicio":"#E54D42","Planificación":"#F59E0B","Ejecución":"#EAB308","Monitoreo y Control":"#10B981","Cierre":"#065F46"};
         const ORDEN_FASES = ["Inicio","Planificación","Ejecución","Monitoreo y Control","Cierre"];
         const ordenGrupos = ORDEN_FASES;

            let html = '<div class="pmbok-board">';
            ordenGrupos.forEach(grupo => {
                const procesos = grupos[grupo] || [];
                const faseColor = (COLORS_FASES && COLORS_FASES[grupo]) ? COLORS_FASES[grupo] : '#007AFF';
                const iconoFase = ICONOS_FASE[grupo] || ICONO_DOMINIO_DEFAULT;

                const MAX_VISIBLES = 5;
                const visibles = procesos.slice(0, MAX_VISIBLES);
                const ocultos = procesos.slice(MAX_VISIBLES);
                const tieneMas = procesos.length > MAX_VISIBLES;

                let cardsHtml = '';
                visibles.forEach(p => {
                    cardsHtml += renderTarjetaProceso(p, faseColor);
                });
                if (tieneMas) {
                    ocultos.forEach(p => {
                        const cls = p.completado ? 'pmbok-card pmbok-card-hidden pmbok-card-completado' : 'pmbok-card pmbok-card-hidden';
                        cardsHtml += `<div class="${cls}" onclick="toggleProceso(${p.id})">${renderTarjetaProcesoInner(p, faseColor)}</div>`;
                    });
                }

                const moreHtml = tieneMas
                    ? `<div class="pmbok-col-more" onclick="toggleVerMasProcesos(this)" data-ocultos="${ocultos.length}"><span class="pmbok-more-label">Ver ${ocultos.length} más</span><span class="pmbok-more-caret">▾</span></div>`
                    : '';

                html += `
                <div class="pmbok-col" style="--fase-color: ${faseColor}">
                    <div class="pmbok-col-header">
                        <span class="pmbok-col-icon">${iconoFase}</span>
                        <span class="pmbok-col-title">${escapeHtml(grupo)}</span>
                    </div>
                    <div class="pmbok-col-count">${procesos.length} procesos</div>
                    <div class="pmbok-col-cards">
                        ${cardsHtml}
                    </div>
                    ${moreHtml}
                </div>`;
            });
            html += '</div>';
            grid.innerHTML = html;
            grid.querySelectorAll('.pmbok-col').forEach(col => {
                const titulo = col.querySelector('.pmbok-col-title');
                if (titulo && expandidos.has(titulo.textContent.trim())) {
                    col.classList.add('expanded');
                    const label = col.querySelector('.pmbok-more-label');
                    const caret = col.querySelector('.pmbok-more-caret');
                    if (label) label.textContent = 'Ver menos';
                    if (caret) caret.textContent = '▴';
                }
            });
        }

        function renderTarjetaProceso(p, faseColor) {
            const cls = p.completado ? 'pmbok-card pmbok-card-completado' : 'pmbok-card';
            return `<div class="${cls}" onclick="toggleProceso(${p.id})">${renderTarjetaProcesoInner(p, faseColor)}</div>`;
        }

        function renderTarjetaProcesoInner(p, faseColor) {
            const check = p.completado ? '<span class="pmbok-card-check"></span>' : '';
            const codigo = p.codigo ? `<span class="pmbok-card-code">${escapeHtml(p.codigo)}</span>` : '';
            return `${codigo}<span class="pmbok-card-name">${escapeHtml(p.nombre)}</span>${check}`;
        }

        function toggleVerMasProcesos(el) {
            const col = el.closest('.pmbok-col');
            if (!col) return;
            const expanded = col.classList.toggle('expanded');
            const label = el.querySelector('.pmbok-more-label');
            const caret = el.querySelector('.pmbok-more-caret');
            if (label) label.textContent = expanded ? 'Ver menos' : `Ver ${el.dataset.ocultos || ''} más`;
            if (caret) caret.textContent = expanded ? '▴' : '▾';
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