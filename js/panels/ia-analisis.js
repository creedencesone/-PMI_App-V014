        
        function configurarAPIKeyIA() {
    const key = prompt(tApp('prompt_api_key'), OPENAI_API_KEY);
    if (key !== null) {
        OPENAI_API_KEY = key;
        localStorage.setItem('openai_api_key', key);
        USAR_IA_REAL = key.length > 0;
        
        if (USAR_IA_REAL) {
            mostrarToast(" Modo IA real activado. ¡Gracias por configurar tu API Key!", 'success');
        } else {
            mostrarToast(" Usando análisis predictivo local. Para IA real, configura tu API Key.", 'info');
            //  Añadir opción para obtener clave
            if (confirm(tApp('confirmar_api_key'))) {
                window.open("https://platform.openai.com/api-keys", "_blank");
            }
        }
    }
}
        
        
        async function analizarPrediccionIA(tipo) {
            const modal = document.getElementById('modalIA');
            const loading = document.getElementById('iaLoading');
            const resultado = document.getElementById('iaResultado');
            
            modal.style.display = 'flex';
            loading.style.display = 'block';
            resultado.innerHTML = '';
            
            setTimeout(async () => {
                try {
                    let analisis = '';
                    
                    const costeTotal = parseFloat(document.getElementById('totalCoste')?.innerText.replace(/[^0-9.,-]/g, '').replace(',', '.')) || 0;
                    const ingresoTotal = parseFloat(document.getElementById('totalIngreso')?.innerText.replace(/[^0-9.,-]/g, '').replace(',', '.')) || 0;
                    const beneficio = ingresoTotal - costeTotal;
                    const roi = costeTotal > 0 ? ((beneficio / costeTotal) * 100).toFixed(1) : 0;
                    const riesgosCriticos = parseInt(document.getElementById('totalRiesgosCriticos')?.innerText || '0');
                    const riesgosAltos = parseInt(document.getElementById('totalRiesgosAltos')?.innerText || '0');
                    const equipoSize = proyecto?.equipo?.length || 0;
                    const materialesCount = proyecto?.materiales?.length || 0;
                    const stakeholdersCount = proyecto?.stakeholders?.length || 0;
                    
                    let probSobrecosto = 30;
                    let probRetraso = 25;
                    let salud = 75;
                    
                    if (beneficio < costeTotal * 0.1) probSobrecosto += 20;
                    if (equipoSize < 3) probRetraso += 15;
                    if (stakeholdersCount < 3) salud -= 10;
                    if (riesgosCriticos > 0) { salud -= riesgosCriticos * 10; probSobrecosto += riesgosCriticos * 5; }
                    if (materialesCount === 0) salud -= 10;
                    
                    probSobrecosto = Math.min(95, Math.max(5, probSobrecosto));
                    probRetraso = Math.min(95, Math.max(5, probRetraso));
                    salud = Math.min(100, Math.max(0, salud));
                    
                    if (tipo === 'riesgos') {
                        analisis = `<div class="ia-analisis-card"><strong> Predicción de Riesgos</strong><hr>
                        <div><span class="ia-tag ia-tag-riesgo"> Riesgo detectado</span> <strong>Desviación presupuestaria</strong><br> Probabilidad: ${probSobrecosto}% | Impacto: Alto<br> Mitigación: Revisar estructura de costos</div>
                        <div class="u-mt-12"><span class="ia-tag ia-tag-riesgo"> Riesgo detectado</span> <strong>Retraso en entregas</strong><br> Probabilidad: ${probRetraso}% | Impacto: Medio<br> Mitigación: Priorizar recursos críticos</div>
                        <div class="u-mt-12"><strong> Riesgos actuales:</strong> ${riesgosCriticos} críticos, ${riesgosAltos} altos</div>
                        <div><strong> Score riesgo global:</strong> ${Math.min(100, (riesgosCriticos * 25) + (riesgosAltos * 10))}/100</div></div>`;
                    } 
                    else if (tipo === 'costos') {
                        analisis = `<div class="ia-analisis-card ia-prediccion-${probSobrecosto > 60 ? 'alta' : (probSobrecosto > 30 ? 'media' : 'baja')}">
                        <strong> Predicción de Costos</strong><hr>
                        <div class="u-fs-24 u-bold">${probSobrecosto}%</div>
                        <div>Probabilidad de sobrecosto</div>
                        <div class="u-mt-12"> Posible desviación: ${Math.round(probSobrecosto / 5)}%</div>
                        <div class="u-mt-12"><strong> Partidas con riesgo:</strong><br>• Materiales y suministros<br>• Costos de personal</div>
                        <div class="u-mt-12"><strong> Métricas actuales:</strong><br> Coste: ${formatearMoneda(costeTotal)}<br> Ingreso: ${formatearMoneda(ingresoTotal)}<br> Beneficio: ${formatearMoneda(beneficio)} (${roi}% ROI)</div></div>`;
                    }
                    else if (tipo === 'plazo') {
                        analisis = `<div class="ia-analisis-card ia-prediccion-${probRetraso > 60 ? 'alta' : (probRetraso > 30 ? 'media' : 'baja')}">
                        <strong> Predicción de Plazo</strong><hr>
                        <div class="u-fs-24 u-bold">${probRetraso}%</div>
                        <div>Probabilidad de retraso</div>
                        <div class="u-mt-12"> Retraso estimado: ${Math.ceil(probRetraso / 20)} mes(es)</div>
                        <div class="u-mt-12"><strong> Actividades críticas:</strong><br>• Planificación inicial<br>• Aprobaciones de stakeholders</div>
                        <div><strong> Estrategias:</strong><br>• Revisar ruta crítica semanalmente<br>• Asignar recursos adicionales</div></div>`;
                    }
                    else if (tipo === 'calidad') {
                        let nivelCalidad = salud >= 70 ? 'Alto' : (salud >= 40 ? 'Medio' : 'Bajo');
                        analisis = `<div class="ia-analisis-card ia-prediccion-${salud < 40 ? 'alta' : (salud < 70 ? 'media' : 'baja')}">
                        <strong> Calidad Esperada</strong><hr>
                        <div class="u-fs-24 u-bold">${nivelCalidad}</div>
                        <div>Puntaje de calidad: ${salud}/100</div>
                        <div class="u-mt-12"><strong> Factores de riesgo:</strong><br>• ${materialesCount === 0 ? 'Sin registros de materiales' : 'Materiales registrados: ' + materialesCount}<br>• ${stakeholdersCount < 3 ? 'Pocos stakeholders identificados' : stakeholdersCount + ' stakeholders registrados'}</div>
                        <div><strong> Recomendaciones:</strong><br>• Implementar checklist de entregables<br>• Realizar pruebas piloto</div></div>`;
                    }
                    else if (tipo === 'recomendaciones') {
                        analisis = `<div class="ia-analisis-card"><strong> Recomendaciones Prioritarias</strong><hr>
                        <div><strong> Acciones inmediatas:</strong><br>1. ${riesgosCriticos > 0 ? 'Mitigar riesgos críticos prioritariamente' : 'Mantener control semanal de riesgos'}<br>2. ${probSobrecosto > 50 ? 'Revisar estructura de costos y proveedores' : 'Optimizar procesos actuales'}<br>3. ${stakeholdersCount < 3 ? 'Identificar y gestionar stakeholders clave' : 'Fortalecer comunicación con stakeholders'}</div>
                        <div class="u-mt-12"><strong> Mejoras para segunda fase:</strong><br>• Implementar dashboard de KPIs<br>• Revisiones quincenales con el equipo</div>
                        <div class="u-mt-12"><strong> KPIs a monitorear:</strong><br>• SPI (Schedule): ${Math.max(0, 100 - probRetraso)}%<br>• CPI (Cost): ${Math.max(0, 100 - probSobrecosto)}%</div></div>`;
                    }
                    else {
                        let nivelSalud = salud >= 70 ? 'Buena' : (salud >= 40 ? 'Moderada' : 'Crítica');
                        let colorSalud = salud >= 70 ? '#00A859' : (salud >= 40 ? '#FF8C00' : '#FF3B30');
                        analisis = `<div class="ia-analisis-card"><strong> DIAGNÓSTICO GENERAL</strong><hr>
                        <div style="font-size: 48px; font-weight: bold; text-align: center; color: ${colorSalud};">${salud}%</div>
                        <div class="u-text-center">Salud del Proyecto - ${nivelSalud}</div>
                        </div>
                        <div class="ia-analisis-card"><strong> RIESGOS</strong><hr>
                        <div> Críticos: ${riesgosCriticos} |  Altos: ${riesgosAltos}</div>
                        <div> Probabilidad de sobrecosto: ${probSobrecosto}%</div>
                        <div> Probabilidad de retraso: ${probRetraso}%</div>
                        </div>
                        <div class="ia-analisis-card"><strong> FINANZAS</strong><hr>
                        <div> Coste Total: ${formatearMoneda(costeTotal)}</div>
                        <div> Ingreso Total: ${formatearMoneda(ingresoTotal)}</div>
                        <div> Beneficio: ${formatearMoneda(beneficio)} (${roi}% ROI)</div>
                        </div>
                        <div class="ia-analisis-card"><strong> RECOMENDACIONES</strong><hr>
                        <ol><li><strong>Prioridad 1:</strong> ${riesgosCriticos > 0 ? 'Mitigar riesgos críticos' : 'Mantener control de riesgos'}</li>
                        <li><strong>Prioridad 2:</strong> ${probSobrecosto > 50 ? 'Revisar estructura de costos' : 'Optimizar procesos'}</li>
                        <li><strong>Prioridad 3:</strong> ${stakeholdersCount < 3 ? 'Gestionar stakeholders' : 'Fortalecer comunicaciones'}</li></ol>
                        </div>`;
                    }
                    
                    loading.style.display = 'none';
                    resultado.innerHTML = analisis;
                } catch(e) {
                    loading.style.display = 'none';
                    resultado.innerHTML = `<div class="ia-analisis-card" style="border-left-color:#FF3B30;"> Error en el análisis: ${e.message}</div>`;
                }
            }, 1000);
        }
        
        function cerrarModalIA() { document.getElementById('modalIA').style.display = 'none'; }
        
        function copiarResultadoIA() {
            const texto = document.getElementById('iaResultado').innerText;
            navigator.clipboard.writeText(texto).then(() => mostrarToast(" Copiado al portapapeles", 'success'));
        }
        
        function exportarIAPDF() {
            const contenido = document.getElementById('iaResultado').innerHTML;
            const ventana = window.open('', '_blank');
            ventana.document.write(`
                <html><head><title>Análisis IA - ${escapeHtml(proyecto?.nombre || 'Proyecto')}</title>
                <style>body{font-family:Arial;padding:40px;} .ia-analisis-card{border:1px solid #ddd;padding:16px;margin-bottom:16px;border-radius:8px;}</style>
                </head><body>
                <h1> Análisis Predictivo IA</h1>
                <h3>Proyecto: ${escapeHtml(proyecto?.nombre || 'Proyecto')}</h3>
                <p>Fecha: ${new Date().toLocaleString()}</p>
                ${contenido}
                <hr><p class="u-fs-11">Generado por PMI Mind</p>
                </body></html>
            `);
            ventana.document.close();
            ventana.print();
        }
        
        function agregarBotonIA() {
            const btn = document.createElement('div');
            btn.className = 'boton-ia-flotante';
            btn.innerHTML = '';
            btn.onclick = () => configurarAPIKeyIA();
            document.body.appendChild(btn);
        }
        
    
        
        // ============================================
        // NAVEGACIÓN Y CARGA INICIAL
        // ============================================