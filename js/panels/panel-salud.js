        // ============================================
        // PANEL DE SALUD DEL PROYECTO
        // ============================================

        let saludChartProgreso = null;
        let saludChartRiesgos = null;
        let saludChartCashflow = null;
        let saludChartEntregables = null;

// ============================================
// Coste de recursos del proyecto (elementos Gantt + materiales + servicios + viajes)
// En modo ágil (esAgile=true) se excluyen los materiales/servicios con sprint/sprintAsociado:
// ya están contabilizados en costeAgileTotal vía sprint.costes.real (calcularCostesPorSprint).
// ============================================
function calcularCosteRecursosProyecto(proyectoParam, esAgile) {
    if (typeof calcularCosteTotal === 'function') {
        return calcularCosteTotal(
            (proyectoParam && proyectoParam.elementosGantt) || [],
            (proyectoParam && proyectoParam.materiales) || [],
            (proyectoParam && proyectoParam.servicios) || [],
            (proyectoParam && proyectoParam.viajes) || [],
            convertirMoneda,
            (proyectoParam && proyectoParam.monedaBase) || 'EUR',
            { esAgile: !!esAgile }
        );
    }
    let total = (proyectoParam.elementosGantt || []).reduce((sum, e) => sum + (e.costeEstimado || 0), 0);
    (proyectoParam.materiales || []).forEach(m => {
        if (esAgile && (m.sprint || m.sprintAsociado)) return;
        total += convertirMoneda(m.cantidad * m.costeUnitario, m.moneda);
    });
    (proyectoParam.servicios || []).forEach(s => {
        if (esAgile && (s.sprint || s.sprintAsociado)) return;
        total += convertirMoneda(s.cantidad * s.costeUnitario, s.moneda);
    });
    (proyectoParam.viajes || []).forEach(v => {
        const gasto = (Number(v.costeVuelos) || 0) + (Number(v.costeHotel) || 0) +
            (Number(v.costeComidas) || 0) + (Number(v.costeTraslados) || 0);
        total += convertirMoneda(gasto, v.moneda);
    });
    return total;
}

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

    //  NUEVO: Costes de sprints ágiles (si está en modo ágil o mixto)
    const metodologia = proyecto?.metodologia?.tipo || 'cascada';
    const esAgile = (metodologia === 'agile' || metodologia === 'mixto');

    // Coste proyectado = suma de costes estimados por elemento + materiales + servicios + viajes
    // (en modo ágil se excluyen los materiales/servicios sprint-asociados: ya están en costeAgileTotal)
    const modeloEVM = typeof calcularModeloEVM === 'function' ? calcularModeloEVM(proyecto) : null;
    let costeTotal = modeloEVM ? modeloEVM.BAC : calcularCosteRecursosProyecto(proyecto, esAgile);
    let costeAgileTotal = modeloEVM ? modeloEVM.costeAgileReal : 0;
    let agileCPI = modeloEVM ? modeloEVM.agileCPI : 1;
    let agileSPI = modeloEVM ? modeloEVM.agileSPI : 1;
    let agileEAC = modeloEVM ? modeloEVM.agileEAC : 0;
    let agileTendencia = 'neutral';
    const sprintsCerrados = ((proyecto.scrum && proyecto.scrum.sprints) || [])
        .filter(sprint => /^(completado|completed|cerrado)$/i.test(String(sprint.estado || '')))
        .sort((a, b) => String(a.fechaFin || a.fecha || '').localeCompare(String(b.fechaFin || b.fecha || '')));
    if (sprintsCerrados.length >= 2) {
        const anterior = Number(sprintsCerrados[sprintsCerrados.length - 2].puntosCompletados) || 0;
        const actual = Number(sprintsCerrados[sprintsCerrados.length - 1].puntosCompletados) || 0;
        agileTendencia = actual > anterior ? 'mejorando' : (actual < anterior ? 'empeorando' : 'neutral');
    } else if (agileSPI > 1.02) {
        agileTendencia = 'mejorando';
    } else if (agileSPI < 0.98) {
        agileTendencia = 'empeorando';
    }
    let velocidadPromedioAgile = modeloEVM ? modeloEVM.velocidad : 0;

    if (!modeloEVM && esAgile && proyecto.scrum && Array.isArray(proyecto.scrum.sprints)) {
        const sprintsCompletados = proyecto.scrum.sprints.filter(s => s.estado === 'completado');
        sprintsCompletados.forEach(sprint => {
            costeAgileTotal += Number(sprint.costes && sprint.costes.real) || 0;
        });
        costeTotal += costeAgileTotal;
        velocidadPromedioAgile = typeof calcularVelocidadEquipo === 'function'
            ? calcularVelocidadEquipo(proyecto) : 0;
    }

    const precioVenta = typeof precioVentaEnBase === 'function' ? precioVentaEnBase(proyecto) : (proyecto.precioVenta || 0);
    // BAC = presupuesto de COSTE. El precio de venta es ingreso y se usa
    // sólo para beneficio/ROI; mezclarlo aquí invertiría CPI y EAC.
    let BAC = costeTotal;
    // AC = coste real incurrido = costeTotal prorrateado por tiempo transcurrido
    // (EVM estándar: asume gasto uniforme en el tiempo)
    let _pctTiempo = 1;
    if (_fechas.min && _fechas.max && _fechas.max > _fechas.min) {
        const _ahora = new Date();
        const _totalMs = _fechas.max - _fechas.min;
        const _transMs = _ahora - _fechas.min;
        _pctTiempo = Math.min(1, Math.max(0.01, _transMs / _totalMs));
    }
    const fechaCorte = new Date();
    const sprintsParaAC = (esAgile && proyecto.scrum && Array.isArray(proyecto.scrum.sprints)) ? proyecto.scrum.sprints : [];
    let desgloseAC = (typeof calcularDesgloseAC === 'function')
        ? calcularDesgloseAC(costeTotal, proyecto.elementosGantt || [], fechaCorte, proyecto.fechaInicio, {
            fechaCorte: fechaCorte, sprints: sprintsParaAC,
            convertirMoneda, monedaBase: proyecto.monedaBase || 'EUR'
        })
        : { real: 0, estimado: costeTotal * _pctTiempo, total: costeTotal * _pctTiempo, fuente: 'estimado' };
    let AC = desgloseAC.total;
    // Financiación planificada (hitos de cobro, importe fijo o % del precio de venta)
    const monedaIngreso = proyecto.monedaVenta || proyecto.monedaBase || 'EUR';
    const financiacionPlanificada = (proyecto.hitosFinancieros || []).reduce((sum, h) => {
        const porcentaje = Number(h.porcentaje) || 0;
        const importe = porcentaje > 0
            ? precioVenta * porcentaje / 100
            : (typeof aBase === 'function'
                ? aBase(Number(h.importeFijo) || 0, h.moneda || monedaIngreso, proyecto.monedaBase || 'EUR')
                : (Number(h.importeFijo) || 0));
        return sum + (isFinite(importe) ? importe : 0);
    }, 0);

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
    const TOTAL_PROCESOS_REF = (typeof PROCESOS_PMBOK !== 'undefined') ? PROCESOS_PMBOK.length : 40;
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
    let beneficio = precioVenta - costeTotal;
    let saludFinanciera = 100;
    if (precioVenta > 0) {
        let margen = (beneficio / precioVenta) * 100;
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
    let EAC = null;

    const elemsEVM = elementosGantt.filter(e => e.tipo !== 'edt');
    const conCostes = elemsEVM.some(e => (e.costeEstimado || 0) > 0);

    if (modeloEVM) {
        EV = modeloEVM.EV; PV = modeloEVM.PV; CPI = modeloEVM.CPI;
        SPI = modeloEVM.SPI; EAC = modeloEVM.EAC;
    } else if (tieneDatosReales) {
        if (esAgile && costeAgileTotal > 0) {
            // Métricas ágiles: el valor ganado se deriva del coste real y los índices
            CPI = agileCPI;
            SPI = agileSPI;
            EAC = agileEAC;
            EV = AC * CPI;
            PV = AC * SPI;
        } else if (conCostes && typeof calcularEV === 'function' && typeof calcularPV === 'function') {
            // EVM estándar ponderado por el coste de cada elemento del cronograma
            EV = calcularEV(elementosGantt, convertirMoneda, proyecto.monedaBase || 'EUR');
            PV = calcularPV(elementosGantt, fechaCorte, null, convertirMoneda, proyecto.monedaBase || 'EUR');
            if (typeof calcularDesgloseAC === 'function' && proyecto.fechaInicio) {
                desgloseAC = calcularDesgloseAC(costeTotal, elementosGantt, fechaCorte, proyecto.fechaInicio, {
                    fechaCorte: fechaCorte, sprints: sprintsParaAC,
                    convertirMoneda, monedaBase: proyecto.monedaBase || 'EUR'
                });
                AC = desgloseAC.total;
            }
            CPI = AC > 0 ? EV / AC : 1;
            SPI = PV > 0 ? EV / PV : 1;
            EAC = (typeof calcularEAC === 'function') ? calcularEAC(BAC, CPI) : (CPI > 0 ? BAC / CPI : null);
            if (EAC !== null) EAC = Math.max(EAC, AC);
        } else {
            // Sin costes por actividad: aproximación por progreso y tiempo transcurrido
            const progreso = calcularProgresoGeneral() / 100;
            EV = BAC * progreso;
            PV = BAC * _pctTiempo;
            CPI = AC > 0 ? EV / AC : 1;
            SPI = PV > 0 ? EV / PV : 1;
            EAC = (typeof calcularEAC === 'function') ? calcularEAC(BAC, CPI) : (CPI > 0 ? BAC / CPI : null);
            if (EAC !== null) EAC = Math.max(EAC, AC);
        }
    } else if (tieneProcesosCompletados && BAC > 0) {
        const totalProcesos = TOTAL_PROCESOS_REF;
        let progresoPorProcesos = procesosCompletados / totalProcesos;
        EV = BAC * progresoPorProcesos;
        PV = BAC * progresoPorProcesos;
        CPI = AC > 0 ? EV / AC : 1;
        SPI = 1;
        EAC = (typeof calcularEAC === 'function') ? calcularEAC(BAC, CPI) : (CPI > 0 ? BAC / CPI : null);
    }

    CPI = Math.min(2, Math.max(0, CPI));
    SPI = Math.min(2, Math.max(0, SPI));

    const ETC = EAC === null ? null : Math.max(0, EAC - AC);
    const VAC = EAC === null ? null : BAC - EAC;
    const TCPI = (BAC - AC) > 0.01 ? (BAC - EV) / (BAC - AC) : 0;
    const tonoIndice = (v) => v >= 0.95 ? 'ok' : (v >= 0.85 ? 'warn' : 'bad');
    const tonoPorUmbral = (v, bueno, aviso) => v >= bueno ? 'ok' : (v >= aviso ? 'warn' : 'bad');

    let cpiEstadoTexto = CPI >= 0.95 ? 'En objetivo' : (CPI >= 0.85 ? 'Atención' : 'Desviado');
    let spiEstadoTexto = SPI >= 0.95 ? 'En objetivo' : (SPI >= 0.85 ? 'Atención' : 'Desviado');

    // ============================================
    // 7. OTROS INDICADORES
    // ============================================
    let defectos = proyecto.defectos || 0;
    let totalEntregables = elementosGantt.filter(e => e.tipo === 'entregable').length || 1;
    let indiceDefectos = defectos / totalEntregables;
    let defectosEstado = indiceDefectos <= 0.5 ? 'Excelente' : (indiceDefectos <= 2 ? 'Aceptable' : 'Alto');

    // Usar velocidad de sprints ágiles si está disponible
    let velocidadEquipo = proyecto.velocidadEquipo || 0;
    if (esAgile && velocidadPromedioAgile > 0) {
        // La velocidad canónica se calcula desde scrum.sprints; no se escribe
        // en un campo paralelo que sería sobrescrito en el próximo refresco.
        velocidadEquipo = Math.round(velocidadPromedioAgile);
    }
    let velocidadEstado = velocidadEquipo >= 20 ? 'Excelente' : (velocidadEquipo >= 10 ? 'Normal' : 'Por definir');

    let ROI = costeTotal > 0 ? (beneficio / costeTotal) * 100 : 0;
    let roiEstado = ROI > 0 ? 'Rentable' : (ROI > -10 ? 'Atención' : 'Pérdida');

    let satisfaccion = proyecto.satisfaccionPromedio || 0;
    let satisfaccionEstado = satisfaccion >= 4.0 ? 'Excelente' : (satisfaccion >= 3.0 ? 'Mejorable' : 'Crítica');

    let huellaCarbono = proyecto.huellaCarbono || 0;
    let huellaEstado = huellaCarbono <= 50 ? 'Baja' : (huellaCarbono <= 100 ? 'Media' : 'Alta');

    let beneficioProyectado = beneficio;
    let margenProyectado = precioVenta > 0 ? ((beneficio / precioVenta) * 100).toFixed(1) : 0;

    // ============================================
    // 8. SALUD GENERAL PMBOK
    // ============================================
    let progresoGeneralVal = calcularProgresoGeneral() / 100;
    let saludGeneral = typeof calcularSaludGeneral === 'function'
        ? calcularSaludGeneral({ CPI, SPI, ROI, indiceDefectos, velocidadEquipo, satisfaccion, huellaCarbono, progresoGeneral: progresoGeneralVal })
        : 0;

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

    const escribirTexto = (id, valor) => { const el = document.getElementById(id); if (el) el.textContent = valor; };
    const fijarTono = (id, tono) => { const el = document.getElementById(id); if (el) el.dataset.tone = tono || 'neutral'; };

    // Resultado económico
    escribirTexto('saludPrecioVenta', formatearMoneda(precioVenta));
    escribirTexto('saludCosteTotal', formatearMoneda(costeTotal));
    escribirTexto('saludBeneficio', formatearMoneda(beneficio));
    escribirTexto('saludBeneficioMeta', precioVenta > 0 ? `Margen ${(beneficio / precioVenta * 100).toFixed(1)}%` : 'Sin precio de venta');
    escribirTexto('saludCobrosPlanificados', formatearMoneda(financiacionPlanificada));
    escribirTexto('saludCobrosPlanificadosMeta', precioVenta > 0 ? `${Math.round(financiacionPlanificada / precioVenta * 100)}% del precio de venta` : 'Cobros planificados');

    // EVM — valores y medidores
    const pctSobreBAC = (v) => BAC > 0 ? Math.min(100, Math.max(0, (v / BAC) * 100)) : 0;
    const medidores = [
        ['evmPV', 'evmPVBar', 'evmPVPct', 'evmPVMeter', PV, 'Valor planificado'],
        ['evmEV', 'evmEVBar', 'evmEVPct', 'evmEVMeter', EV, 'Valor ganado'],
        ['evmAC', 'evmACBar', 'evmACPct', 'evmACMeter', AC, 'Coste real']
    ];
    medidores.forEach(([valorId, barraId, pctId, meterId, valor, etiqueta]) => {
        const pct = pctSobreBAC(valor);
        escribirTexto(valorId, formatearMoneda(valor));
        escribirTexto(pctId, Math.round(pct) + '%');
        const barra = document.getElementById(barraId);
        if (barra) barra.style.width = pct.toFixed(1) + '%';
        const meter = document.getElementById(meterId);
        if (meter) meter.setAttribute('aria-label', `${etiqueta}: ${formatearMoneda(valor)} (${Math.round(pct)}% del BAC)`);
    });
    const monedaProyecto = proyecto.monedaBase || 'EUR';
    const simboloMoneda = (typeof getMonedaSimbolo === 'function') ? getMonedaSimbolo(monedaProyecto) : '€';
    const escribirMonedaCorta = (id, valor) => {
        const el = document.getElementById(id);
        if (!el) return;
        const abs = Math.abs(valor);
        let corto;
        if (abs >= 1e6) corto = (valor / 1e6).toLocaleString('es-ES', { maximumFractionDigits: 1 }) + ' M ' + simboloMoneda;
        else if (abs >= 1000) corto = Math.round(valor / 1000).toLocaleString('es-ES') + 'k ' + simboloMoneda;
        else corto = Math.round(valor).toLocaleString('es-ES') + ' ' + simboloMoneda;
        el.textContent = corto;
        el.title = formatearMoneda(valor, monedaProyecto);
        el.setAttribute('aria-label', formatearMoneda(valor, monedaProyecto));
    };
    escribirMonedaCorta('evmBAC', BAC);
    const nombreAC = document.getElementById('evmACNombre');
    if (nombreAC) nombreAC.textContent = desgloseAC.fuente === 'real' ? 'Gasto real' : 'Coste estimado';
    const fuenteAC = document.getElementById('evmACFuente');
    if (fuenteAC) fuenteAC.textContent = desgloseAC.fuente === 'real'
        ? 'Gasto real registrado'
        : (desgloseAC.fuente === 'estimado' ? 'Estimación temporal (sin coste real)' : 'Sin gasto registrado');

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
    if (cpiValorElem) cpiValorElem.textContent = CPI.toFixed(2);
    let cpiEstadoElem = document.getElementById('cpiEstado');
    if (cpiEstadoElem) cpiEstadoElem.textContent = cpiEstadoTexto;
    fijarTono('evmCPICard', tonoIndice(CPI));

    // SPI
    let spiValorElem = document.getElementById('spiValor');
    if (spiValorElem) spiValorElem.textContent = SPI.toFixed(2);
    let spiEstadoElem = document.getElementById('spiEstado');
    if (spiEstadoElem) spiEstadoElem.textContent = spiEstadoTexto;
    fijarTono('evmSPICard', tonoIndice(SPI));

    // ROI
    let roiValorElem = document.getElementById('roiValor');
    if (roiValorElem) roiValorElem.textContent = ROI.toFixed(1) + '%';
    let roiEstadoElem = document.getElementById('roiEstado');
    if (roiEstadoElem) roiEstadoElem.textContent = roiEstado;
    fijarTono('evmROICard', ROI > 0 ? 'ok' : (ROI > -10 ? 'warn' : 'bad'));

    // Pronóstico EVM
    const _sinBase = 'Sin base de pronóstico';
    const escribirPronostico = (id, valor) => {
        if (valor === null || !isFinite(valor)) {
            escribirTexto(id, _sinBase);
            const el = document.getElementById(id);
            if (el) { el.removeAttribute('title'); el.removeAttribute('aria-label'); }
        } else escribirMonedaCorta(id, valor);
    };
    escribirPronostico('evmEAC', EAC);
    escribirPronostico('evmETC', ETC);
    escribirPronostico('evmVAC', VAC);
    escribirTexto('evmTCPI', (BAC - AC) > 0.01 ? TCPI.toFixed(2) : '—');
    const escenariosBody = document.getElementById('evmEscenariosBody');
    if (escenariosBody && typeof calcularEscenariosEAC === 'function') {
        const escenarios = calcularEscenariosEAC(BAC, AC, EV, PV, CPI, SPI);
        escenariosBody.innerHTML = escenarios.escenarios.map(s => `
            <tr>
                <th scope="row">${escapeHtml(s.clave)}</th>
                <td>${escapeHtml(s.nombre)}</td>
                <td>${s.valor === null ? _sinBase : formatearMoneda(s.valor, proyecto.monedaBase || 'EUR')}</td>
            </tr>`).join('');
        const tcpiEacEl = document.getElementById('evmTcpiEac');
        if (tcpiEacEl) {
            tcpiEacEl.textContent = escenarios.tcpiEac === null
                ? 'TCPI-EAC: Sin base de pronóstico'
                : `TCPI-EAC: ${escenarios.tcpiEac.toFixed(2)}`;
        }
    }
    const vacEl = document.getElementById('evmVAC');
    if (vacEl && vacEl.parentElement) vacEl.parentElement.dataset.tone = VAC === null ? 'neutral' : (VAC >= 0 ? 'ok' : 'bad');
    const tcpiEl = document.getElementById('evmTCPI');
    if (tcpiEl && tcpiEl.parentElement) tcpiEl.parentElement.dataset.tone = TCPI <= 1 ? 'ok' : (TCPI <= 1.1 ? 'warn' : 'bad');

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

    // Salud general
    let saludGeneralPMBOKElem = document.getElementById('saludGeneralPMBOK');
    if (saludGeneralPMBOKElem) saludGeneralPMBOKElem.textContent = Math.round(saludGeneral) + '%';
    fijarTono('evmVerdict', saludGeneral >= 70 ? 'ok' : (saludGeneral >= 40 ? 'warn' : 'bad'));

    //  NUEVO: Añadir/Actualizar tarjeta de métricas ágiles en el panel de salud
    let agileCard = document.getElementById('cardAgileMetrics');
    if (!agileCard && esAgile) {
        const gridAgile = document.querySelectorAll('#panelSalud .cards-grid');
        const cardsGrid = gridAgile.length ? gridAgile[gridAgile.length - 1] : null;
        if (cardsGrid) {
            const newCard = document.createElement('article');
            newCard.id = 'cardAgileMetrics';
            newCard.className = 'metric-card metric-card--agile';
            newCard.innerHTML = `
                <span class="metric-card__label">Salud ágil</span>
                <strong class="metric-card__value" id="agileSaludValor">--</strong>
                <span class="metric-card__meta" id="agileSaludDetalle">SPI/CPI</span>
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
        if (agileEACElem) agileEACElem.innerHTML = (agileEAC === null || !isFinite(agileEAC)) ? 'Sin base de pronóstico' : formatearMoneda(agileEAC);
    }

    // Veredicto principal
    let saludSemaforoElem = document.getElementById('saludSemaforo');
    if (saludSemaforoElem) {
        saludSemaforoElem.textContent = saludGeneral >= 70 ? 'Saludable' : (saludGeneral >= 40 ? 'Atención' : 'Crítico');
    }

    let saludMensajeElem = document.getElementById('saludMensaje');
    if (saludMensajeElem) {
        if (!tieneDatosReales) {
            saludMensajeElem.textContent = 'Sin datos de cronograma: CPI y SPI se muestran neutrales. Actualiza el Gantt para obtener métricas reales.';
        } else if (esAgile && costeAgileTotal > 0) {
            saludMensajeElem.textContent = `Modo ágil · CPI ${agileCPI.toFixed(2)} · SPI ${agileSPI.toFixed(2)} · Velocidad ${velocidadPromedioAgile} pts/sprint · Tendencia ${agileTendencia}`;
        } else {
            saludMensajeElem.textContent = `CPI ${CPI.toFixed(2)} · SPI ${SPI.toFixed(2)} · ${riesgosCriticos} riesgo(s) crítico(s) · EAC ${EAC === null ? _sinBase : formatearMoneda(EAC)}`;
        }
    }

    // Curva S
    renderizarCurvaEVM({
        elementos: elementosGantt,
        BAC: BAC,
        EV: EV,
        AC: AC,
        EAC: EAC === null ? 0 : EAC,
        hoy: fechaCorte,
        moneda: proyecto.monedaBase
    });

    // Actualizar KPIs
    actualizarKPIs({ CPI, SPI, ROI, indiceDefectos, velocidadEquipo, satisfaccion, huellaCarbono, EAC, VAC, TCPI, BAC });

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
        <p><strong>${escapeHtml(proyecto.nombre || 'Proyecto')}</strong> | Generado: ${new Date().toLocaleString('es-ES')}</p>
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
    // 1. Progreso de PROCESOS PMBOK (referencia fija desde config-global)
    const totalProcesos = (typeof PROCESOS_PMBOK !== 'undefined') ? PROCESOS_PMBOK.length : 40;
    const procesosCompletados = (typeof contarProcesosCompletados === 'function') ? contarProcesosCompletados(proyecto) : (proyecto.procesos || []).filter(p => p.completado).length;
    const progresoProcesos = procesosCompletados / totalProcesos;

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
    const procesosCompletados = (typeof contarProcesosCompletados === 'function') ? contarProcesosCompletados(proyecto) : (proyecto.procesos || []).filter(p => p.completado).length;
    const totalProcesos = (typeof PROCESOS_PMBOK !== 'undefined') ? PROCESOS_PMBOK.length : 40;

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

    let progProc = procesosCompletados / totalProcesos;

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
                    <td class="u-p-8">${procesosCompletados}/${totalProcesos}</td>
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
                • ${procesosCompletados === totalProcesos ? ' Todos los procesos completados.' : ' Te faltan ' + (totalProcesos - procesosCompletados) + ' procesos por completar.'}<br>
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

        function actualizarKPIs(m) {
            const kpisBody = document.getElementById('kpisBody');
            if (!kpisBody) return;

            const moneda = (v) => formatearMoneda(v);
            const chip = (texto, tono) => `<span class="kpi-chip" data-tone="${tono}">${texto}</span>`;
            const fila = (nombre, desc, valor, estado, tono, referencia) => `
                <tr data-tone="${tono}">
                    <th scope="row"><span class="kpi-name">${nombre}</span><span class="kpi-desc">${desc}</span></th>
                    <td class="kpi-value">${valor}</td>
                    <td>${chip(estado, tono)}</td>
                    <td class="kpi-ref">${referencia}</td>
                </tr>`;

            const tonoIndice = (v) => v >= 0.95 ? 'ok' : (v >= 0.85 ? 'warn' : 'bad');
            const supera = (v, limite) => v > limite ? 'warn' : 'ok';

            kpisBody.innerHTML = [
                fila('CPI · coste', 'Rendimiento del coste', m.CPI.toFixed(2), m.CPI >= 0.95 ? 'En objetivo' : (m.CPI >= 0.85 ? 'Atención' : 'Desviado'), tonoIndice(m.CPI), '≥ 0,95'),
                fila('SPI · cronograma', 'Rendimiento del plazo', m.SPI.toFixed(2), m.SPI >= 0.95 ? 'En objetivo' : (m.SPI >= 0.85 ? 'Atención' : 'Desviado'), tonoIndice(m.SPI), '≥ 0,95'),
                fila('EAC · pronóstico', 'Estimación a la finalización', m.EAC > 0 ? moneda(m.EAC) : 'Sin base de pronóstico', m.EAC > 0 ? (m.EAC <= (m.BAC || 0) ? 'En presupuesto' : 'Sobre coste') : 'CPI no fiable', m.EAC > 0 ? (m.EAC <= (m.BAC || 0) ? 'ok' : 'bad') : 'neutral', m.BAC > 0 ? `BAC ${moneda(m.BAC)}` : '—'),
                fila('VAC · variación', 'Desvío esperado al cierre', m.EAC > 0 ? moneda(m.VAC) : '—', m.EAC > 0 ? (m.VAC >= 0 ? 'Holgura' : 'Déficit') : 'Sin pronóstico', m.EAC > 0 ? (m.VAC >= 0 ? 'ok' : 'bad') : 'neutral', '≥ 0'),
                fila('TCPI · eficiencia', 'Rendimiento necesario para cerrar', (m.BAC - m.AC) > 0.01 ? m.TCPI.toFixed(2) : '—', m.TCPI <= 1 ? 'Alcanzable' : (m.TCPI <= 1.1 ? 'Exigente' : 'Inviable'), (m.BAC - m.AC) > 0.01 ? (m.TCPI <= 1 ? 'ok' : (m.TCPI <= 1.1 ? 'warn' : 'bad')) : 'neutral', '≤ 1,00'),
                fila('ROI · retorno', 'Beneficio sobre coste', m.ROI.toFixed(1) + '%', m.ROI > 0 ? 'Rentable' : (m.ROI > -10 ? 'Atención' : 'Pérdida'), m.ROI > 0 ? 'ok' : (m.ROI > -10 ? 'warn' : 'bad'), '> 0%'),
                fila('Defectos', 'Por entregable', m.indiceDefectos.toFixed(1), m.indiceDefectos <= 0.5 ? 'Excelente' : (m.indiceDefectos <= 2 ? 'Aceptable' : 'Alto'), m.indiceDefectos <= 0.5 ? 'ok' : (m.indiceDefectos <= 2 ? 'warn' : 'bad'), '≤ 0,5'),
                fila('Velocidad', 'Puntos por sprint', String(m.velocidadEquipo), m.velocidadEquipo >= 20 ? 'Excelente' : (m.velocidadEquipo >= 10 ? 'Normal' : 'Por definir'), m.velocidadEquipo >= 20 ? 'ok' : (m.velocidadEquipo >= 10 ? 'warn' : 'neutral'), '≥ 20 pts'),
                fila('Satisfacción', 'Stakeholders', m.satisfaccion.toFixed(1) + ' / 5', m.satisfaccion >= 4 ? 'Excelente' : (m.satisfaccion >= 3 ? 'Mejorable' : 'Crítica'), m.satisfaccion >= 4 ? 'ok' : (m.satisfaccion >= 3 ? 'warn' : 'bad'), '≥ 4,0'),
                fila('Huella de carbono', 'kg CO₂ por entregable', String(m.huellaCarbono), m.huellaCarbono <= 50 ? 'Baja' : (m.huellaCarbono <= 100 ? 'Media' : 'Alta'), m.huellaCarbono <= 50 ? 'ok' : (m.huellaCarbono <= 100 ? 'warn' : 'bad'), '≤ 50')
            ].join('');
        }

        // ============================================
        // CURVA S EVM — serie acumulada PV / EV / AC + pronóstico EAC
        // ============================================
        function _evmCompacto(valor, moneda) {
            try {
                return new Intl.NumberFormat('es-ES', {
                    notation: 'compact', maximumFractionDigits: 1,
                    style: 'currency', currency: moneda || 'EUR', currencyDisplay: 'narrowSymbol'
                }).format(valor);
            } catch (e) {
                return Math.round((valor || 0) / 1000) + 'k';
            }
        }

        function _evmFechaCorta(d) {
            try {
                return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
            } catch (e) {
                return d.toISOString().slice(5, 10);
            }
        }

        function renderizarCurvaEVM(datos) {
            const canvas = document.getElementById('evmSChart');
            const vacio = document.getElementById('evmChartEmpty');
            const rango = document.getElementById('evmChartRange');
            if (!canvas) return;

            if (window.__evmSChart && typeof window.__evmSChart.destroy === 'function') {
                window.__evmSChart.destroy();
                window.__evmSChart = null;
            }

            const ChartCtor = (typeof Chart !== 'undefined') ? Chart : null;
            const elementos = (datos.elementos || []).filter(e => e.tipo !== 'edt' && e.inicio);
            const valorados = elementos.filter(e => (e.costeEstimado || 0) > 0);
            const hayDatos = ChartCtor && valorados.length > 0 && datos.BAC > 0;

            if (!hayDatos) {
                canvas.hidden = true;
                if (vacio) vacio.hidden = false;
                if (rango) rango.textContent = 'Sin cronograma valorado';
                return;
            }
            canvas.hidden = false;
            if (vacio) vacio.hidden = true;

            const parseFecha = (v) => (typeof parseLocalDate === 'function') ? parseLocalDate(v) : new Date(v);
            const sumarDias = (ini, dur) => (typeof sumarDiasHabiles === 'function') ? parseLocalDate(sumarDiasHabiles(ini, dur || 0)) : new Date(new Date(ini).getTime() + (dur || 0) * 86400000);
            const tramos = elementos.map(e => {
                const ini = parseFecha(e.inicio);
                const fin = sumarDias(e.inicio, e.duracion) || ini;
                return { ini, fin, coste: e.costeEstimado || 0, progreso: Math.min(100, Math.max(0, e.progreso || 0)) };
            }).filter(t => t.ini instanceof Date && !isNaN(t.ini) && t.fin instanceof Date && !isNaN(t.fin)).sort((a, b) => a.ini - b.ini);

            if (!tramos.length) {
                canvas.hidden = true;
                if (vacio) vacio.hidden = false;
                return;
            }

            const inicio = tramos[0].ini;
            const fin = tramos.reduce((max, t) => t.fin > max ? t.fin : max, tramos[0].fin);
            const hoy = datos.hoy instanceof Date ? datos.hoy : new Date();
            const msDia = 86400000;
            const diasTotales = Math.max(1, Math.round((fin - inicio) / msDia));
            const pasos = Math.min(24, Math.max(8, Math.ceil(diasTotales / 7)));
            const etiquetas = [];
            const puntos = { pv: [], ev: [], ac: [], eac: [] };
            const clamp01 = (v) => Math.min(1, Math.max(0, v));
            const enFecha = new Date(inicio.getTime());
            const finMs = fin.getTime();

            const pvEn = (fecha) => {
                if (typeof calcularPV === 'function') {
                    const v = calcularPV(datos.elementos, fecha);
                    return isFinite(v) ? v : 0;
                }
                return datos.BAC * clamp01((fecha - inicio) / Math.max(1, finMs - inicio));
            };

            const evEn = (fecha) => {
                if (fecha > hoy) return null;
                let total = 0;
                tramos.forEach(t => {
                    const tope = Math.min(hoy.getTime(), t.fin.getTime());
                    const ventana = Math.max(1, tope - t.ini.getTime());
                    const avance = clamp01((fecha - t.ini) / ventana);
                    total += t.coste * (t.progreso / 100) * avance;
                });
                return total;
            };

            const acEn = (fecha) => {
                if (fecha > hoy) return null;
                const ventana = Math.max(1, hoy - inicio);
                return (datos.AC || 0) * clamp01((fecha - inicio) / ventana);
            };

            for (let i = 0; i <= pasos; i++) {
                const ms = inicio.getTime() + Math.round((finMs - inicio.getTime()) * (i / pasos));
                enFecha.setTime(ms);
                etiquetas.push(_evmFechaCorta(enFecha));
                puntos.pv.push(Math.min(datos.BAC, Math.max(0, pvEn(new Date(ms)))));
                puntos.ev.push(evEn(ms));
                puntos.ac.push(acEn(ms));
                puntos.eac.push(null);
            }

            // Pronóstico: desde la fecha de corte hasta el cierre según EAC
            const iHoy = Math.min(pasos, Math.max(0, Math.round(((hoy - inicio) / Math.max(1, finMs - inicio)) * pasos)));
            if (hoy >= inicio && hoy <= fin) {
                puntos.eac[iHoy] = datos.AC || 0;
                for (let i = iHoy; i <= pasos; i++) {
                    const t = (i - iHoy) / Math.max(1, pasos - iHoy);
                    puntos.eac[i] = (datos.AC || 0) + ((datos.EAC || datos.BAC) - (datos.AC || 0)) * t;
                }
            }

            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const raiz = getComputedStyle(document.documentElement);
            const colorTexto = (raiz.getPropertyValue('--text-muted') || '').trim() || (isLight ? '#6B7280' : '#94A3B8');
            const colorRejilla = isLight ? 'rgba(15,23,42,.08)' : 'rgba(148,163,184,.12)';
            const colorPV = isLight ? '#7C8798' : '#8B97A8';
            const colorEV = (raiz.getPropertyValue('--color-primary') || '').trim() || (isLight ? '#2563EB' : '#0A84FF');
            const colorAC = isLight ? '#B45309' : '#FFB020';
            const colorEAC = isLight ? '#B42318' : '#FF6B6B';
            const reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const moneda = datos.moneda || 'EUR';

            if (rango) {
                rango.textContent = `${_evmFechaCorta(inicio)} → ${_evmFechaCorta(fin)} · ${valorados.length} actividades valoradas`;
            }

            window.__evmSChart = new ChartCtor(canvas.getContext('2d'), {
                type: 'line',
                data: {
                    labels: etiquetas,
                    datasets: [
                        { label: 'PV', data: puntos.pv, borderColor: colorPV, backgroundColor: 'transparent', borderWidth: 2, borderDash: [5, 4], tension: 0.32, pointRadius: 0, pointHoverRadius: 4, fill: false },
                        { label: 'EV', data: puntos.ev, borderColor: colorEV, backgroundColor: isLight ? 'rgba(37,99,235,.08)' : 'rgba(10,132,255,.12)', borderWidth: 2.4, tension: 0.32, pointRadius: 0, pointHoverRadius: 4, fill: true, spanGaps: false },
                        { label: 'AC', data: puntos.ac, borderColor: colorAC, backgroundColor: 'transparent', borderWidth: 2, tension: 0.32, pointRadius: 0, pointHoverRadius: 4, fill: false, spanGaps: false },
                        { label: 'EAC', data: puntos.eac, borderColor: colorEAC, backgroundColor: 'transparent', borderWidth: 2, borderDash: [4, 4], tension: 0, pointRadius: 0, pointHoverRadius: 4, fill: false, spanGaps: true }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    animation: reducido ? false : { duration: 500, easing: 'easeOutQuart' },
                    layout: { padding: { top: 6, right: 6 } },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: isLight ? '#FFFFFF' : '#151B24',
                            titleColor: isLight ? '#111827' : '#F1F5F9',
                            bodyColor: isLight ? '#374151' : '#CBD5E1',
                            borderColor: isLight ? '#E2E8F0' : 'rgba(148,163,184,.25)',
                            borderWidth: 1,
                            padding: 10,
                            cornerRadius: 8,
                            displayColors: true,
                            callbacks: {
                                label: (ctx) => ctx.parsed.y == null ? '' : `${ctx.dataset.label}: ${formatearMoneda(ctx.parsed.y, moneda)}`
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            border: { display: false },
                            ticks: { color: colorTexto, maxRotation: 0, autoSkip: true, maxTicksLimit: 6, font: { family: 'Inter', size: 10 } }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: colorRejilla, drawTicks: false },
                            border: { display: false },
                            ticks: { color: colorTexto, padding: 8, maxTicksLimit: 5, callback: (v) => _evmCompacto(v, moneda), font: { family: 'Inter', size: 10 } }
                        }
                    }
                }
            });
        }

        function abrirModalSatisfaccion() {
            const select = document.getElementById('satisfaccionStakeholder');
            if (select && proyecto.stakeholders) {
                select.innerHTML = '<option value="todos">Todos los stakeholders (promedio)</option>' +
                    proyecto.stakeholders.map(s => `<option value="${s.id}">${escapeHtml(s.nombre)}</option>`).join('');
            }
            const modal = document.getElementById('modalSatisfaccion');
            if (!modal) {
                mostrarToast('La validación de satisfacción no está disponible aún', 'warning');
                return;
            }
            modal.style.display = 'flex';
        }

        function guardarSatisfaccion() {
            const inputPuntaje = document.getElementById('satisfaccionPuntaje');
            const inputStakeholder = document.getElementById('satisfaccionStakeholder');
            if (!inputPuntaje || !inputStakeholder) {
                mostrarToast('La validación de satisfacción no está disponible aún', 'warning');
                return;
            }
            let puntaje = parseFloat(inputPuntaje.value);
            let stakeholderId = inputStakeholder.value;
            let comentarios = document.getElementById('satisfaccionComentarios') ? document.getElementById('satisfaccionComentarios').value : '';

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
            const tipo = String((proyecto.metodologia && proyecto.metodologia.tipo) || 'cascada').toLowerCase();
            const esAgile = tipo === 'agile' || tipo === 'mixto';
            if (esAgile || (proyecto.scrum && Array.isArray(proyecto.scrum.sprints) && proyecto.scrum.sprints.length)) {
                // En proyectos ágiles la velocidad se deriva de los sprints:
                // registrar un valor manual crearía una segunda fuente de verdad.
                mostrarToast('La velocidad se calcula automáticamente desde los sprints completados', 'info');
                return;
            }
            let velocidad = prompt(tApp('prompt_velocidad'), "20");
            if (velocidad !== null && isFinite(Number(velocidad))) {
                proyecto.velocidadEquipo = parseInt(velocidad, 10) || 0;
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
    const modal = document.getElementById('modalSatisfaccion');
    if (modal) modal.style.display = 'none';
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

