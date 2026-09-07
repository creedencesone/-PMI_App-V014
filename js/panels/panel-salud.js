        // ============================================
        // PANEL DE SALUD DEL PROYECTO
        // ============================================
        
        let saludChartProgreso = null;
        let saludChartRiesgos = null;
        let saludChartCashflow = null;
        let saludChartEntregables = null;
        
function actualizarPanelSalud() {
    if (!proyecto) return;
    
    // ============================================
    // 1. CÁLCULO DE COSTES E INGRESOS (INCLUYENDO SPRINTS ÁGILES)
    // ============================================
    // Fechas del proyecto (para prorrateo temporal de AC)
    const _fechas = (proyecto.elementosGantt || []).reduce((acc, t) => {
        if (t.inicio) {
            const dt = new Date(t.inicio);
            if (!acc.min || dt < acc.min) acc.min = dt;
            if (t.duracion > 0) {
                const fin = typeof sumarDiasHabiles === 'function' ? sumarDiasHabiles(t.inicio, t.duracion) : t.inicio;
                const finD = new Date(fin);
                if (!acc.max || finD > acc.max) acc.max = finD;
            } else {
                if (!acc.max || dt > acc.max) acc.max = dt;
            }
        }
        return acc;
    }, { min: null, max: null });
    if (!_fechas.min && proyecto.fechaInicio) _fechas.min = new Date(proyecto.fechaInicio);
    if (!_fechas.max && proyecto.fechaFinPlan) _fechas.max = new Date(proyecto.fechaFinPlan);

    // Coste proyectado = suma de costes estimados por elemento + materiales + servicios + viajes
    let costeTotal = (proyecto.elementosGantt || []).reduce((sum, e) => sum + (e.costeEstimado || 0), 0);
    (proyecto.materiales || []).forEach(m => costeTotal += convertirMoneda(m.cantidad * m.costeUnitario, m.moneda));
    (proyecto.servicios || []).forEach(s => costeTotal += convertirMoneda(s.cantidad * s.costeUnitario, s.moneda));
    (proyecto.viajes || []).forEach(v => costeTotal += convertirMoneda((v.costeVuelos + v.costeHotel + v.costeComidas + v.costeTraslados), v.moneda));
    
    //  NUEVO: Costes de sprints ágiles (si está en modo ágil o mixto)
    const metodologia = proyecto?.metodologia?.tipo || 'cascada';
    const esAgile = (metodologia === 'agile' || metodologia === 'mixto');
    
    let costeAgileTotal = 0;
    let agileCPI = 1;
    let agileSPI = 1;
    let agileEAC = 0;
    let agileTendencia = 'neutral';
    let velocidadPromedioAgile = 0;
    
    if (esAgile && proyecto.scrum && proyecto.scrum.sprints) {
        const sprintsCompletados = proyecto.scrum.sprints.filter(s => s.estado === 'completado');
        
        let totalPuntosPlanificados = 0;
        let totalPuntosCompletados = 0;
        let totalCostePlanificado = 0;
        let totalCosteReal = 0;
        
        sprintsCompletados.forEach(sprint => {
            // Obtener costes del sprint (de los cálculos ágiles)
            if (sprint.costes) {
                totalCosteReal += sprint.costes.real || 0;
                totalCostePlanificado += sprint.costes.planificado || 0;
            } else {
                // Calcular desde las historias si no hay costes guardados
                const historiasSprint = (proyecto.scrum.historias || []).filter(h => h.sprintId === sprint.id);
                historiasSprint.forEach(historia => {
                    if (historia.estado === 'done' && historia.recursoAsignado) {
                        const dias = historia.diasReales || historia.diasEstimados || 5;
                        const horasPorDia = historia.horasPorDia || 8;
                        const horasTotales = dias * horasPorDia;
                        totalCosteReal += horasTotales * historia.recursoAsignado.costeHora;
                    }
                    totalCostePlanificado += historia.costeEstimado || 0;
                });
            }
            
            totalPuntosPlanificados += sprint.puntosPlanificados || 0;
            totalPuntosCompletados += sprint.puntosCompletados || 0;
        });
        
        costeAgileTotal = totalCosteReal;
        costeTotal += convertirMoneda(costeAgileTotal, proyecto.monedaBase);
        
        // Calcular métricas ágiles
        agileCPI = totalCostePlanificado > 0 && totalCosteReal > 0 ? totalCostePlanificado / totalCosteReal : 1;
        agileSPI = totalPuntosPlanificados > 0 ? totalPuntosCompletados / totalPuntosPlanificados : 1;
        
        // EAC basado en CPI ágil
        const presupuestoTotal = proyecto.precioVenta || totalCostePlanificado;
        agileEAC = agileCPI > 0 ? presupuestoTotal / agileCPI : presupuestoTotal;
        
        // Velocidad promedio
        if (sprintsCompletados.length > 0) {
            velocidadPromedioAgile = totalPuntosCompletados / sprintsCompletados.length;
        }
        
        // Tendencia
        if (sprintsCompletados.length >= 2) {
            const ultimoSprint = sprintsCompletados[sprintsCompletados.length - 1];
            const anteriorSprint = sprintsCompletados[sprintsCompletados.length - 2];
            const mejoraVelocidad = (ultimoSprint.puntosCompletados || 0) - (anteriorSprint.puntosCompletados || 0);
            if (mejoraVelocidad > 0) agileTendencia = 'mejorando';
            else if (mejoraVelocidad < 0) agileTendencia = 'empeorando';
        }
        
        console.log(` Métricas Ágiles: CPI=${agileCPI.toFixed(2)}, SPI=${agileSPI.toFixed(2)}, Velocidad=${velocidadPromedioAgile} pts/sprint`);
    }
    
    let BAC = proyecto.precioVenta || 0;
    // AC = coste real incurrido = costeTotal proyectado prorrateado por tiempo transcurrido
    // (EVM estándar: asume gasto uniforme en el tiempo)
    let _pctTiempo = 1;
    if (_fechas.min && _fechas.max && _fechas.max > _fechas.min) {
        const _ahora = new Date();
        const _totalMs = _fechas.max - _fechas.min;
        const _transMs = _ahora - _fechas.min;
        _pctTiempo = Math.min(1, Math.max(0.01, _transMs / _totalMs));
    }
    let AC = costeTotal * _pctTiempo;
    
    // ============================================
    // 2. VERIFICAR SI HAY DATOS REALES EN EL CRONOGRAMA
    // ============================================
    let elementosGantt = proyecto.elementosGantt || [];
    let tieneDatosReales = false;
    
    elementosGantt.forEach(e => {
        if ((e.progreso || 0) > 0 || e.finReal || e.inicioReal) {
            tieneDatosReales = true;
        }
    });
    
    // Si estamos en modo ágil y hay sprints completados, consideramos que hay datos reales
    if (esAgile && (proyecto.scrum?.sprints?.filter(s => s.estado === 'completado').length > 0)) {
        tieneDatosReales = true;
    }
    
    let procesosCompletados = (proyecto.procesos || []).filter(p => p.completado).length;
    let tieneProcesosCompletados = procesosCompletados > 0;
    
    // ============================================
    // 3. CÁLCULO DE RIESGOS
    // ============================================
    let riesgos = proyecto.riesgos || [];
    let riesgosCriticos = riesgos.filter(r => r.nivel === 'Crítico' || r.nivel === 'critico').length;
    let riesgosAltos = riesgos.filter(r => r.nivel === 'Alto' || r.nivel === 'alto').length;
    let riesgosMedios = riesgos.filter(r => r.nivel === 'Medio' || r.nivel === 'medio').length;
    let riesgoScore = (riesgosCriticos * 5) + (riesgosAltos * 3) + (riesgosMedios * 1);
    let riesgoNivel = riesgoScore === 0 ? ' Sin riesgos' : 
                     (riesgoScore <= 5 ? ' Riesgo bajo' : 
                     (riesgoScore <= 15 ? ' Riesgo medio' : ' Riesgo alto'));
    
    // ============================================
    // 4. CÁLCULO DE DESVIACIÓN DE CRONOGRAMA
    // ============================================
    let desviacionDias = 0;
    let tareasConDesviacion = 0;
    
    elementosGantt.forEach(tarea => {
        if (tarea.finReal && tarea.inicio && tarea.duracion) {
            const fechaFinPlan = tarea.duracion > 0
                ? (typeof sumarDiasHabiles === 'function' ? sumarDiasHabiles(tarea.inicio, tarea.duracion) : tarea.inicio)
                : tarea.inicio;
            let fechaFinReal = new Date(tarea.finReal);
            let diffDias = Math.ceil((fechaFinReal - new Date(fechaFinPlan)) / (1000 * 60 * 60 * 24));
            if (diffDias > 0) {
                desviacionDias += diffDias;
                tareasConDesviacion++;
            }
        }
    });
    
    let desviacionPromedio = tareasConDesviacion > 0 ? Math.round(desviacionDias / tareasConDesviacion) : 0;
    let desviacionTexto = desviacionPromedio === 0 ? ' A tiempo' : 
                          (desviacionPromedio <= 10 ? ` +${desviacionPromedio} días` : ` +${desviacionPromedio} días`);
    
    // ============================================
    // 5. CÁLCULO DE SALUD FINANCIERA
    // ============================================
    let beneficio = BAC - costeTotal;
    let saludFinanciera = 100;
    if (BAC > 0) {
        let margen = (beneficio / BAC) * 100;
        if (margen < 0) saludFinanciera = Math.max(0, 30 + margen);
        else if (margen < 10) saludFinanciera = 50 + (margen * 2);
        else saludFinanciera = Math.min(100, 70 + (margen - 10));
    }
    saludFinanciera = Math.min(100, Math.max(0, saludFinanciera));
    
    // ============================================
    // 6. CPI, SPI, EAC - CON VERIFICACIÓN DE DATOS REALES
    // ============================================
    let EV = 0;
    let PV = 0;
    let CPI = 1;
    let SPI = 1;
    let EAC = BAC;
    
    if (tieneDatosReales) {
        if (esAgile && costeAgileTotal > 0) {
            //  Usar métricas ágiles si están disponibles
            CPI = agileCPI;
            SPI = agileSPI;
            EAC = agileEAC;
            EV = AC * CPI; // Valor ganado aproximado
            PV = AC * SPI; // Valor planificado aproximado
        } else {
            // Calcular EV real desde elementosGantt (modo cascada)
            let evAcumulado = 0;
            const elemsParaEV = elementosGantt.filter(e => e.tipo !== 'edt');
            if (elemsParaEV.length > 0 && BAC > 0) {
                let pesoPorElemento = BAC / elemsParaEV.length;
                elemsParaEV.forEach(e => {
                    let progreso = e.progreso || 0;
                    if (e.tipo === 'hito' && e.progreso === 100) progreso = 100;
                    evAcumulado += pesoPorElemento * (progreso / 100);
                });
            }
            EV = evAcumulado;
            
            // Calcular PV basado en tiempo transcurrido
            let fechaHoy = new Date();
            let fechaInicio = proyecto.fechaInicio ? new Date(proyecto.fechaInicio) : null;
            let fechaFinPlan = proyecto.fechaFinPlan ? new Date(proyecto.fechaFinPlan) : null;
            
            if (fechaInicio && fechaFinPlan && fechaInicio <= fechaHoy) {
                let totalDuracion = (fechaFinPlan - fechaInicio) / (1000 * 60 * 60 * 24);
                let diasTranscurridos = (fechaHoy - fechaInicio) / (1000 * 60 * 60 * 24);
                let porcentajePlanificado = totalDuracion > 0 ? Math.min(100, Math.max(0, (diasTranscurridos / totalDuracion) * 100)) : 0;
                PV = BAC * (porcentajePlanificado / 100);
            } else {
                let progresoGeneralVal = calcularProgresoGeneral() / 100;
                PV = BAC * progresoGeneralVal;
            }
            
            CPI = AC > 0 ? EV / AC : 1;
            SPI = PV > 0 ? EV / PV : 1;
            
            EAC = CPI > 0 ? BAC / CPI : BAC;
            EAC = Math.max(EAC, AC);
        }
    } else if (tieneProcesosCompletados && BAC > 0) {
        let totalProcesos = proyecto.procesos.length;
        let progresoPorProcesos = procesosCompletados / totalProcesos;
        EV = BAC * progresoPorProcesos;
        PV = BAC * progresoPorProcesos;
        CPI = AC > 0 ? EV / AC : 1;
        SPI = 1;
        EAC = CPI > 0 ? BAC / CPI : BAC;
    }
    
    CPI = Math.min(2, Math.max(0, CPI));
    SPI = Math.min(2, Math.max(0, SPI));
    
    let cpiEstadoTexto = CPI >= 0.95 ? ' Excelente' : (CPI >= 0.85 ? ' Atención' : (CPI >= 0.7 ? ' Crítico' : ' Crítico'));
    let cpiColor = CPI >= 0.95 ? '#00A859' : (CPI >= 0.85 ? '#FF8C00' : '#FF3B30');
    
    let spiEstadoTexto = SPI >= 0.95 ? ' Excelente' : (SPI >= 0.85 ? ' Atención' : (SPI >= 0.7 ? ' Crítico' : ' Crítico'));
    let spiColor = SPI >= 0.95 ? '#00A859' : (SPI >= 0.85 ? '#FF8C00' : '#FF3B30');
    
    // ============================================
    // 7. OTROS INDICADORES
    // ============================================
    let defectos = proyecto.defectos || 0;
    let totalEntregables = elementosGantt.filter(e => e.tipo === 'entregable').length || 1;
    let indiceDefectos = defectos / totalEntregables;
    let defectosEstado = indiceDefectos <= 0.5 ? ' Excelente' : (indiceDefectos <= 2 ? ' Aceptable' : ' Alto');
    
    // Usar velocidad de sprints ágiles si está disponible
    let velocidadEquipo = proyecto.velocidadEquipo || 0;
    if (esAgile && velocidadPromedioAgile > 0) {
        velocidadEquipo = Math.round(velocidadPromedioAgile);
        proyecto.velocidadEquipo = velocidadEquipo;
    }
    let velocidadEstado = velocidadEquipo >= 20 ? ' Excelente' : (velocidadEquipo >= 10 ? ' Normal' : ' Por definir');
    
    let ROI = costeTotal > 0 ? (beneficio / costeTotal) * 100 : 0;
    let roiEstado = ROI > 0 ? ' Rentable' : (ROI > -10 ? ' Atención' : ' Pérdida');
    
    let satisfaccion = proyecto.satisfaccionPromedio || 0;
    let satisfaccionEstado = satisfaccion >= 4.0 ? ' Excelente' : (satisfaccion >= 3.0 ? ' Mejorable' : ' Crítica');
    
    let huellaCarbono = proyecto.huellaCarbono || 0;
    let huellaEstado = huellaCarbono <= 50 ? ' Baja' : (huellaCarbono <= 100 ? ' Media' : ' Alta');
    
    let beneficioProyectado = beneficio;
    let margenProyectado = BAC > 0 ? ((beneficio / BAC) * 100).toFixed(1) : 0;
    
    // ============================================
    // 8. SALUD GENERAL PMBOK
    // ============================================
    let progresoGeneralVal = calcularProgresoGeneral() / 100;
    let saludGeneral = (
        (Math.min(1, CPI) * 15) +
        (Math.min(1, SPI) * 15) +
        (Math.min(1, ROI / 20) * 10) +
        (Math.max(0, 1 - indiceDefectos / 5) * 10) +
        (Math.min(1, velocidadEquipo / 30) * 10) +
        (satisfaccion / 5 * 15) +
        (Math.max(0, 1 - huellaCarbono / 200) * 10) +
        (progresoGeneralVal * 15)
    );
    saludGeneral = Math.min(100, Math.max(0, saludGeneral));
    
    // ============================================
    // 9. ACTUALIZAR DOM
    // ============================================
    
    // Riesgos
    let riesgosScoreElem = document.getElementById('riesgosScore');
    if (riesgosScoreElem) riesgosScoreElem.innerHTML = riesgoScore;
    let riesgosNivelElem = document.getElementById('riesgosNivel');
    if (riesgosNivelElem) riesgosNivelElem.innerHTML = riesgoNivel;
    
    // Salud Financiera
    let saludFinancieraElem = document.getElementById('saludFinanciera');
    if (saludFinancieraElem) saludFinancieraElem.innerHTML = Math.round(saludFinanciera) + '%';
    let finanzasDetalleElem = document.getElementById('finanzasDetalle');
    if (finanzasDetalleElem) finanzasDetalleElem.innerHTML = `Beneficio: ${formatearMoneda(beneficio)}`;

    let precioVentaSaludElem = document.getElementById('saludPrecioVenta');
    if (precioVentaSaludElem) precioVentaSaludElem.innerHTML = formatearMoneda(BAC);
    let costeTotalSaludElem = document.getElementById('saludCosteTotal');
    if (costeTotalSaludElem) costeTotalSaludElem.innerHTML = formatearMoneda(costeTotal);
    let beneficioSaludElem = document.getElementById('saludBeneficio');
    if (beneficioSaludElem) beneficioSaludElem.innerHTML = formatearMoneda(beneficio);
    
    // Desviación
    let desviacionCronoElem = document.getElementById('desviacionCronograma');
    if (desviacionCronoElem) desviacionCronoElem.innerHTML = desviacionPromedio;
    let cronoDetalleElem = document.getElementById('cronoDetalle');
    if (cronoDetalleElem) cronoDetalleElem.innerHTML = desviacionTexto;
    
    // Beneficio Proyectado
    let beneficioProyectadoElem = document.getElementById('beneficioProyectado');
    if (beneficioProyectadoElem) beneficioProyectadoElem.innerHTML = formatearMoneda(beneficioProyectado);
    let margenProyectadoElem = document.getElementById('margenProyectado');
    if (margenProyectadoElem) margenProyectadoElem.innerHTML = `Margen: ${margenProyectado}%`;
    
    // Progreso General
    let progresoGeneralElem = document.getElementById('progresoGeneral');
    if (progresoGeneralElem) progresoGeneralElem.innerHTML = Math.round(progresoGeneralVal * 100) + '%';
    let progresoBarraElem = document.getElementById('progresoBarra');
    if (progresoBarraElem) progresoBarraElem.style.width = (progresoGeneralVal * 100) + '%';
    
    // CPI
    let cpiValorElem = document.getElementById('cpiValor');
    if (cpiValorElem) cpiValorElem.innerHTML = CPI.toFixed(2);
    let cpiEstadoElem = document.getElementById('cpiEstado');
    if (cpiEstadoElem) {
        cpiEstadoElem.innerHTML = cpiEstadoTexto;
        cpiEstadoElem.style.color = cpiColor;
    }
    
    // SPI
    let spiValorElem = document.getElementById('spiValor');
    if (spiValorElem) spiValorElem.innerHTML = SPI.toFixed(2);
    let spiEstadoElem = document.getElementById('spiEstado');
    if (spiEstadoElem) {
        spiEstadoElem.innerHTML = spiEstadoTexto;
        spiEstadoElem.style.color = spiColor;
    }
    
    // ROI
    let roiValorElem = document.getElementById('roiValor');
    if (roiValorElem) roiValorElem.innerHTML = ROI.toFixed(1) + '%';
    let roiEstadoElem = document.getElementById('roiEstado');
    if (roiEstadoElem) {
        roiEstadoElem.innerHTML = roiEstado;
        roiEstadoElem.style.color = ROI > 0 ? '#00A859' : '#FF3B30';
    }
    
    // EAC
    let eacValorElem = document.getElementById('eacValor');
    if (eacValorElem) eacValorElem.innerHTML = formatearMoneda(EAC);
    
    // Defectos
    let defectosValorElem = document.getElementById('defectosValor');
    if (defectosValorElem) defectosValorElem.innerHTML = indiceDefectos.toFixed(1);
    let defectosEstadoElem = document.getElementById('defectosEstado');
    if (defectosEstadoElem) defectosEstadoElem.innerHTML = defectosEstado;
    
    // Velocidad
    let velocidadValorElem = document.getElementById('velocidadValor');
    if (velocidadValorElem) velocidadValorElem.innerHTML = velocidadEquipo;
    let velocidadEstadoElem = document.getElementById('velocidadEstado');
    if (velocidadEstadoElem) velocidadEstadoElem.innerHTML = velocidadEstado;
    
    // Satisfacción
    let satisfaccionValorElem = document.getElementById('satisfaccionValor');
    if (satisfaccionValorElem) satisfaccionValorElem.innerHTML = satisfaccion.toFixed(1);
    let satisfaccionEstadoElem = document.getElementById('satisfaccionEstado');
    if (satisfaccionEstadoElem) satisfaccionEstadoElem.innerHTML = satisfaccionEstado;
    
    // Huella
    let huellaValorElem = document.getElementById('huellaValor');
    if (huellaValorElem) huellaValorElem.innerHTML = huellaCarbono;
    let huellaEstadoElem = document.getElementById('huellaEstado');
    if (huellaEstadoElem) huellaEstadoElem.innerHTML = huellaEstado;
    
    // Salud General
    let saludGeneralPMBOKElem = document.getElementById('saludGeneralPMBOK');
    if (saludGeneralPMBOKElem) {
        saludGeneralPMBOKElem.innerHTML = Math.round(saludGeneral) + '%';
        let saludColor = saludGeneral >= 70 ? '#00A859' : (saludGeneral >= 40 ? '#FF8C00' : '#FF3B30');
        saludGeneralPMBOKElem.style.color = saludColor;
    }
    
    //  NUEVO: Añadir/Actualizar tarjeta de métricas ágiles en el panel de salud
    let agileCard = document.getElementById('cardAgileMetrics');
    if (!agileCard && esAgile) {
        const cardsGrid = document.querySelector('#panelSalud .cards-grid');
        if (cardsGrid) {
            const newCard = document.createElement('div');
            newCard.id = 'cardAgileMetrics';
            newCard.className = 'value-card';
            newCard.style.background = 'linear-gradient(135deg, rgba(0,122,255,0.2), rgba(0,85,204,0.1))';
            newCard.innerHTML = `
                <div class="small"> Salud Ágil</div>
                <div class="big" id="agileSaludValor">--</div>
                <div class="small" id="agileSaludDetalle">SPI/CPI</div>
            `;
            cardsGrid.appendChild(newCard);
        }
    }
    
    if (esAgile) {
        const agileSaludValor = document.getElementById('agileSaludValor');
        if (agileSaludValor) {
            let saludAgileTexto = '';
            let saludAgileColor = '';
            const promedioAgile = (agileSPI + agileCPI) / 2;
            if (promedioAgile >= 0.95) {
                saludAgileTexto = ' Excelente';
                saludAgileColor = '#00A859';
            } else if (promedioAgile >= 0.85) {
                saludAgileTexto = ' Atención';
                saludAgileColor = '#FF8C00';
            } else {
                saludAgileTexto = ' Crítico';
                saludAgileColor = '#FF3B30';
            }
            agileSaludValor.innerHTML = saludAgileTexto;
            agileSaludValor.style.color = saludAgileColor;
        }
        
        const agileSaludDetalle = document.getElementById('agileSaludDetalle');
        if (agileSaludDetalle) {
            const tendenciaTexto = agileTendencia === 'mejorando' ? ' Mejorando' : (agileTendencia === 'empeorando' ? ' Empeorando' : ' Estable');
            agileSaludDetalle.innerHTML = `SPI: ${agileSPI.toFixed(2)} | CPI: ${agileCPI.toFixed(2)} | ${tendenciaTexto}`;
        }
        
        // Actualizar también los elementos del panel AgileCostControl si existen
        const agileCPIElem = document.getElementById('agileCPI');
        if (agileCPIElem) agileCPIElem.innerHTML = agileCPI.toFixed(2);
        
        const agileSPIElem = document.getElementById('agileSPI');
        if (agileSPIElem) agileSPIElem.innerHTML = agileSPI.toFixed(2);
        
        const agileEACElem = document.getElementById('agileEAC');
        if (agileEACElem) agileEACElem.innerHTML = formatearMoneda(agileEAC);
    }
    
    // Semáforo principal
    let saludSemaforoElem = document.getElementById('saludSemaforo');
    if (saludSemaforoElem) {
        let semaforoTexto = saludGeneral >= 70 ? ' PROYECTO SALUDABLE' : (saludGeneral >= 40 ? ' ATENCIÓN' : ' CRÍTICO');
        saludSemaforoElem.innerHTML = semaforoTexto;
        saludSemaforoElem.style.color = saludGeneral >= 70 ? '#00A859' : (saludGeneral >= 40 ? '#FF8C00' : '#FF3B30');
    }
    
    let saludMensajeElem = document.getElementById('saludMensaje');
    if (saludMensajeElem) {
        if (!tieneDatosReales) {
            saludMensajeElem.innerHTML = ` Sin datos de cronograma. CPI y SPI = 1.00. Actualiza el Gantt para métricas reales.`;
        } else if (esAgile && costeAgileTotal > 0) {
            saludMensajeElem.innerHTML = ` Modo Ágil | CPI: ${agileCPI.toFixed(2)} | SPI: ${agileSPI.toFixed(2)} | Velocidad: ${velocidadPromedioAgile} pts/sprint | ${agileTendencia}`;
        } else {
            saludMensajeElem.innerHTML = `CPI: ${CPI.toFixed(2)} | SPI: ${SPI.toFixed(2)} | Riesgos: ${riesgosCriticos} críticos`;
        }
    }
    
    // Actualizar KPIs
    actualizarKPIs(CPI, SPI, ROI, indiceDefectos, velocidadEquipo, satisfaccion, huellaCarbono, EAC);
    
    mostrarToast(" Panel de salud actualizado", 'success');
}

async function exportarSaludPDF() {
    if (!proyecto) {
        mostrarToast(tApp('toast_no_proyecto'), 'error');
        return;
    }
    
    mostrarToast(" Generando PDF de salud...", 'info');
    
    // Crear un contenedor temporal para clonar el panel
    const panelSalud = document.getElementById('panelSalud');
    const cloneContainer = document.createElement('div');
    cloneContainer.style.position = 'absolute';
    cloneContainer.style.top = '-9999px';
    cloneContainer.style.left = '-9999px';
    cloneContainer.style.width = '1200px';
    cloneContainer.style.background = 'white';
    cloneContainer.style.color = '#333';
    cloneContainer.style.padding = '40px';
    cloneContainer.style.fontFamily = 'Arial, sans-serif';
    
    // Clonar el contenido
    const clone = panelSalud.cloneNode(true);
    
    // Eliminar botones del clon
    const botones = clone.querySelectorAll('.btn');
    botones.forEach(b => b.remove());
    
    // Eliminar inputs range y otros elementos interactivos
    const inputs = clone.querySelectorAll('input, select, textarea');
    inputs.forEach(i => i.remove());
    
    // Estilos específicos para el PDF
    const style = document.createElement('style');
    style.textContent = `
        .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .value-card { background: #f5f5f5; border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #e0e0e0; }
        .value-card .big { font-size: 24px; font-weight: bold; color: #007AFF; }
        .info-card { background: #f9f9f9; border-radius: 12px; padding: 16px; margin-bottom: 20px; border-left: 4px solid #007AFF; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .data-table th { background: #007AFF; color: white; }
        .progress-bar-container { background: #e0e0e0; border-radius: 10px; height: 8px; overflow: hidden; }
        .progress-fill { background: #007AFF; height: 100%; }
        .cashflow-positive { color: #00A859; }
        .cashflow-negative { color: #FF3B30; }
        h4 { color: #007AFF; margin: 16px 0 8px 0; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007AFF; padding-bottom: 20px; }
        .header h1 { color: #007AFF; margin: 0; }
        .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
    `;
    clone.appendChild(style);
    
    // Añadir cabecera
    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = `
        <h1> INFORME DE SALUD DEL PROYECTO</h1>
        <p><strong>${escapeHtml(proyecto.nombre || 'Proyecto')}</strong> | Generado: ${new Date().toLocaleString()}</p>
    `;
    clone.insertBefore(header, clone.firstChild);
    
    // Añadir pie de página
    const footer = document.createElement('div');
    footer.className = 'footer';
    footer.innerHTML = '<p>Informe generado por PMI Mind - Basado en la 8ª Edición</p>';
    clone.appendChild(footer);
    
    cloneContainer.appendChild(clone);
    document.body.appendChild(cloneContainer);
    
    // Esperar a que los canvas se rendericen (si hay)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
        // Capturar los canvas actuales (los originales, no los clonados)
        const canvasElements = document.querySelectorAll('canvas');
        const canvasImages = [];
        
        for (let i = 0; i < canvasElements.length; i++) {
            const canvas = canvasElements[i];
            if (canvas && canvas.width > 0 && canvas.height > 0) {
                try {
                    const imageData = canvas.toDataURL('image/png');
                    canvasImages.push(imageData);
                } catch(e) { console.log("Canvas error:", e); }
            }
        }
        
        // Convertir todo el clon a imagen
        const canvas = await html2canvas(cloneContainer, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true
        });
        
        const imageData = canvas.toDataURL('image/png');
        
        // Crear PDF en nueva ventana
        const ventana = window.open('', '_blank');
        ventana.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Informe de Salud - ${escapeHtml(proyecto.nombre || 'Proyecto')}</title>
                <style>
                    body { margin: 0; padding: 0; display: flex; justify-content: center; }
                    img { max-width: 100%; height: auto; }
                    @media print {
                        body { margin: 0; padding: 0; }
                        img { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <img src="${imageData}" class="u-w-full" />
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            setTimeout(function() { window.close(); }, 1000);
                        }, 500);
                    };
                <\/script>
            </body>
            </html>
        `);
        ventana.document.close();
        
        mostrarToast(" PDF generado correctamente", 'success');
        
    } catch (error) {
        console.error("Error generando PDF:", error);
        mostrarToast(" Error al generar el PDF", 'error');
    } finally {
        document.body.removeChild(cloneContainer);
    }
}
        
       function calcularProgresoGeneral() {
    // 1. Progreso de PROCESOS PMBOK
    let totalProcesos = proyecto.procesos?.length || 49;
    let procesosCompletados = (proyecto.procesos || []).filter(p => p.completado).length;
    let progresoProcesos = procesosCompletados / totalProcesos;
    
    // 2. Progreso de ENTREGABLES (desde el cronograma Gantt)
    let entregables = (proyecto.elementosGantt || []).filter(e => e.tipo === 'entregable');
    let totalEntregables = entregables.length || 1;
    let progresoEntregables = 0;
    
    if (entregables.length > 0) {
        let sumaProgreso = entregables.reduce((sum, e) => sum + (e.progreso || 0), 0);
        progresoEntregables = sumaProgreso / (totalEntregables * 100);
    }
    
    // 3. Progreso de ACTIVIDADES (del Gantt)
    let actividades = (proyecto.elementosGantt || []).filter(e => e.tipo === 'actividad');
    let totalActividades = actividades.length || 1;
    let progresoActividades = 0;
    if (actividades.length > 0) {
        let sumaProgresoActs = actividades.reduce((sum, e) => sum + (e.progreso || 0), 0);
        progresoActividades = sumaProgresoActs / (totalActividades * 100);
    }
    
    // 4. Progreso de HITOS
    let hitos = (proyecto.elementosGantt || []).filter(e => e.tipo === 'hito');
    let hitosCompletados = hitos.filter(h => h.progreso === 100).length;
    let totalHitos = hitos.length || 1;
    let progresoHitos = hitosCompletados / totalHitos;
    
    //  PONDERACIÓN:
    // 40% Actividades + 30% Entregables + 20% Procesos + 10% Hitos
    let progreso = (progresoActividades * 0.4) + 
                   (progresoEntregables * 0.3) + 
                   (progresoProcesos * 0.2) + 
                   (progresoHitos * 0.1);
    
    return Math.min(100, Math.max(0, progreso * 100));
}
function diagnosticarProgreso() {
    let elementos = proyecto.elementosGantt || [];
    let actividades = elementos.filter(e => e.tipo === 'actividad');
    let entregables = elementos.filter(e => e.tipo === 'entregable');
    let hitos = elementos.filter(e => e.tipo === 'hito');
    let procesos = proyecto.procesos || [];
    
    // Calcular porcentajes
    let progAct = 0;
    if (actividades.length > 0) {
        let suma = actividades.reduce((s, e) => s + (e.progreso || 0), 0);
        progAct = suma / (actividades.length * 100);
    }
    
    let progEnt = 0;
    if (entregables.length > 0) {
        let suma = entregables.reduce((s, e) => s + (e.progreso || 0), 0);
        progEnt = suma / (entregables.length * 100);
    }
    
    let progProc = procesos.filter(p => p.completado).length / (procesos.length || 49);
    
    let progHit = 0;
    if (hitos.length > 0) {
        progHit = hitos.filter(h => h.progreso === 100).length / hitos.length;
    }
    
    let progresoFinal = (progAct * 0.4) + (progEnt * 0.3) + (progProc * 0.2) + (progHit * 0.1);
    
    // Crear mensaje
    let mensaje = `
        <div style="background: rgba(0,0,0,0.8); padding: 16px; border-radius: 12px; margin: 16px 0;">
            <h4 style="color: #007AFF; margin-bottom: 12px;"> DIAGNÓSTICO DE PROGRESO</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <tr class="u-border-bottom">
                    <td class="u-p-8"><strong> Actividades:</strong></td>
                    <td class="u-p-8">${actividades.length} actividades</td>
                    <td class="u-p-8">Promedio: ${(progAct * 100).toFixed(0)}%</td>
                    <td class="u-p-8">Aporta: ${(progAct * 0.4 * 100).toFixed(0)}%</td>
                </tr>
                <tr class="u-border-bottom">
                    <td class="u-p-8"><strong> Entregables:</strong></td>
                    <td class="u-p-8">${entregables.length} entregables</td>
                    <td class="u-p-8">Promedio: ${(progEnt * 100).toFixed(0)}%</td>
                    <td class="u-p-8">Aporta: ${(progEnt * 0.3 * 100).toFixed(0)}%</td>
                </tr>
                <tr class="u-border-bottom">
                    <td class="u-p-8"><strong> Procesos:</strong></td>
                    <td class="u-p-8">${procesos.filter(p => p.completado).length}/${procesos.length}</td>
                    <td class="u-p-8">${(progProc * 100).toFixed(0)}%</td>
                    <td class="u-p-8">Aporta: ${(progProc * 0.2 * 100).toFixed(0)}%</td>
                </tr>
                <tr>
                    <td class="u-p-8"><strong> Hitos:</strong></td>
                    <td class="u-p-8">${hitos.filter(h => h.progreso === 100).length}/${hitos.length}</td>
                    <td class="u-p-8">${(progHit * 100).toFixed(0)}%</td>
                    <td class="u-p-8">Aporta: ${(progHit * 0.1 * 100).toFixed(0)}%</td>
                </tr>
                <tr style="border-top: 2px solid #007AFF;">
                    <td style="padding: 12px;"><strong> TOTAL:</strong></td>
                    <td colspan="3" style="padding: 12px; font-size: 24px; font-weight: bold; color: ${progresoFinal * 100 >= 70 ? '#00A859' : (progresoFinal * 100 >= 40 ? '#FF8C00' : '#FF3B30')};">${(progresoFinal * 100).toFixed(1)}%</td>
                </tr>
            </table>
            <div style="margin-top: 16px; padding: 12px; background: rgba(0,122,255,0.2); border-radius: 8px;">
                <strong> ¿Qué significa?</strong><br>
                • ${actividades.length === 0 ? ' No tienes ACTIVIDADES en el Gantt. Créalas para que aporten 40%.' : ' Tienes actividades.'}<br>
                • ${entregables.length === 0 ? ' No tienes ENTREGABLES en el Gantt. Créalos para que aporten 30%.' : ' Tienes entregables.'}<br>
                • ${procesos.filter(p => p.completado).length === procesos.length ? ' Todos los procesos completados.' : ' Te faltan ' + (procesos.length - procesos.filter(p => p.completado).length) + ' procesos por completar.'}<br>
                • ${hitos.length === 0 ? ' No tienes HITOS en el Gantt. Créalos para que aporten 10%.' : ' Tienes hitos.'}
            </div>
        </div>
    `;
    
    // Mostrar en un modal
    const modalHtml = `<div class="modal-content modal-600">
        <div class="modal-header">
            <h3> Diagnóstico de Progreso</h3>
            <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
        </div>
        ${mensaje}
        <button class="btn btn-primary u-w-full" onclick="cerrarModalGeneric()">Cerrar</button>
    </div>`;
    
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}
        
        function actualizarKPIs(CPI, SPI, ROI, indiceDefectos, velocidadEquipo, satisfaccion, huellaCarbono, EAC) {
            const kpisBody = document.getElementById('kpisBody');
            if (!kpisBody) return;
            
            kpisBody.innerHTML = `
                <tr><th>CPI (Costos)</th><td>${CPI.toFixed(2)}</td><td class="${CPI >= 0.9 ? 'cashflow-positive' : (CPI >= 0.7 ? '' : 'cashflow-negative')}">${CPI >= 0.9 ? '' : (CPI >= 0.7 ? '' : '')}</td><td>≥0.9</td></tr>
                <tr><th>SPI (Cronograma)</th><td>${SPI.toFixed(2)}</td><td class="${SPI >= 0.9 ? 'cashflow-positive' : (SPI >= 0.7 ? '' : 'cashflow-negative')}">${SPI >= 0.9 ? '' : (SPI >= 0.7 ? '' : '')}</td><td>≥0.9</td></tr>
                <tr><th>ROI Proyectado</th><td>${ROI.toFixed(1)}%</td><td class="${ROI > 0 ? 'cashflow-positive' : 'cashflow-negative'}">${ROI > 0 ? '' : ''}</td><td>>0%</td></tr>
                <tr><th>EAC (Pronóstico)</th><td>${formatearMoneda(EAC)}</td><td>-</td><td>-</td></tr>
                <tr><th>Índice de Defectos</th><td>${indiceDefectos.toFixed(1)}</td><td class="${indiceDefectos <= 0.5 ? 'cashflow-positive' : (indiceDefectos <= 2 ? '' : 'cashflow-negative')}">${indiceDefectos <= 0.5 ? '' : (indiceDefectos <= 2 ? '' : '')}</td><td>≤0.5</td></tr>
                <tr><th>Velocidad del Equipo</th><td>${velocidadEquipo}</td><td class="${velocidadEquipo >= 20 ? 'cashflow-positive' : (velocidadEquipo >= 10 ? '' : '')}">${velocidadEquipo >= 20 ? '' : (velocidadEquipo >= 10 ? '' : '')}</td><td>≥20 pts/sprint</td></tr>
                <tr><th>Satisfacción Stakeholder</th><td>${satisfaccion.toFixed(1)}/5.0</td><td class="${satisfaccion >= 4.0 ? 'cashflow-positive' : (satisfaccion >= 3.0 ? '' : 'cashflow-negative')}">${satisfaccion >= 4.0 ? '' : (satisfaccion >= 3.0 ? '' : '')}</td><td>≥4.0</td></tr>
                <tr><th>Huella de Carbono</th><td>${huellaCarbono} kg/entregable</td><td class="${huellaCarbono <= 50 ? 'cashflow-positive' : (huellaCarbono <= 100 ? '' : 'cashflow-negative')}">${huellaCarbono <= 50 ? '' : (huellaCarbono <= 100 ? '' : '')}</td><td>≤50</td></tr>
            `;
        }
        
        function abrirModalSatisfaccion() {
            const select = document.getElementById('satisfaccionStakeholder');
            if (select && proyecto.stakeholders) {
                select.innerHTML = '<option value="todos">Todos los stakeholders (promedio)</option>' +
                    proyecto.stakeholders.map(s => `<option value="${s.id}">${escapeHtml(s.nombre)}</option>`).join('');
            }
            document.getElementById('modalSatisfaccion').style.display = 'flex';
        }
        
        function guardarSatisfaccion() {
            let puntaje = parseFloat(document.getElementById('satisfaccionPuntaje').value);
            let stakeholderId = document.getElementById('satisfaccionStakeholder').value;
            let comentarios = document.getElementById('satisfaccionComentarios').value;
            
            if (!proyecto.satisfacciones) proyecto.satisfacciones = [];
            proyecto.satisfacciones.push({
                id: Date.now(),
                stakeholderId: stakeholderId,
                puntaje: puntaje,
                comentarios: comentarios,
                fecha: new Date().toISOString()
            });
            
            // Calcular promedio global (todos los registros)
            let promedio = proyecto.satisfacciones.reduce((sum, s) => sum + s.puntaje, 0) / (proyecto.satisfacciones.length || 1);
            proyecto.satisfaccionPromedio = promedio;
            
            guardarProyecto();
            cerrarModalSatisfaccion();
            actualizarPanelSalud();
            mostrarToast(` Satisfacción registrada: ${puntaje}/5.0`, 'success');
        }
        
        // Función para registrar velocidad del equipo
        function registrarVelocidad() {
            let velocidad = prompt(tApp('prompt_velocidad'), "20");
            if (velocidad !== null) {
                proyecto.velocidadEquipo = parseInt(velocidad);
                guardarProyecto();
                actualizarPanelSalud();
                mostrarToast(` Velocidad registrada: ${proyecto.velocidadEquipo} pts/sprint`, 'success');
            }
        }
        
        // Función para registrar huella de carbono
        function registrarHuellaCarbono() {
            let huella = prompt(tApp('prompt_huella'), "0");
            if (huella !== null) {
                proyecto.huellaCarbono = parseFloat(huella);
                guardarProyecto();
                actualizarPanelSalud();
                mostrarToast(` Huella de carbono registrada: ${proyecto.huellaCarbono} kg CO₂`, 'success');
            }
        }
        
        
        
        function initPanelSalud() {
    // Cargar stakeholders en el select de satisfacción
    const select = document.getElementById('satisfaccionStakeholder');
    if (select && proyecto.stakeholders) {
        select.innerHTML = '<option value="todos">Todos los stakeholders (promedio)</option>' +
            proyecto.stakeholders.map(s => `<option value="${s.id}">${escapeHtml(s.nombre)}</option>`).join('');
    }
    actualizarPanelSalud();
}

function cerrarModalSatisfaccion() {
    document.getElementById('modalSatisfaccion').style.display = 'none';
}


function registrarDefecto() {
    let defectos = prompt(tApp('prompt_defectos'), "0");
    if (defectos !== null) {
        proyecto.defectos = (proyecto.defectos || 0) + parseInt(defectos);
        guardarProyecto();
        actualizarPanelSalud();
        mostrarToast(` Defectos registrados. Total: ${proyecto.defectos}`, 'success');
    }
}

        