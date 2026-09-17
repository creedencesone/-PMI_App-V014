let infChartAvance = null;
let infChartVariacion = null;
let infChartForecast = null;
let infChartHitos = null;

function calcularCosteAgileTotalInforme(proyecto) {
    return (proyecto?.scrum?.historias || []).filter(h => h.sprintId).reduce((sum, h) => sum + convertirMoneda(h.costeEstimado || 0, proyecto?.monedaBase), 0);
}

function actualizarInformeCompleto() {
    console.log(' actualizarInformeCompleto() called');
    try {
        let id = localStorage.getItem('proyectoSeleccionado');
        if (!id) { console.warn('No project selected'); return; }
        let todos = cargarProyectosStorage();
        let proyecto = todos.find(p => p.id == id);
        if (!proyecto) { console.warn('Project not found:', id); return; }
        console.log(' Project loaded:', proyecto.nombre);

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
    let costeTotal = (proyecto.elementosGantt || []).reduce((sum, e) => sum + (e.costeEstimado || 0), 0);
    (proyecto.materiales || []).forEach(m => costeTotal += convertirMoneda(m.cantidad * m.costeUnitario, m.moneda));
    (proyecto.servicios || []).forEach(s => costeTotal += convertirMoneda(s.cantidad * s.costeUnitario, s.moneda));
    (proyecto.viajes || []).forEach(v => costeTotal += convertirMoneda((v.costeVuelos + v.costeHotel + v.costeComidas + v.costeTraslados), v.moneda));

    let BAC = proyecto.precioVenta || 0;
    let _pctTiempo = 1;
    if (_fechas.min && _fechas.max && _fechas.max > _fechas.min) {
        const _ahora = new Date();
        const _totalMs = _fechas.max - _fechas.min;
        const _transMs = _ahora - _fechas.min;
        _pctTiempo = Math.min(1, Math.max(0.01, _transMs / _totalMs));
    }
    let AC = costeTotal * _pctTiempo;
    let elementosGantt = proyecto.elementosGantt || [];
    let metodologia = (proyecto?.metodologia?.tipo || 'cascada').toLowerCase();
    let esAgile = (metodologia === 'agile' || metodologia === 'mixto');

    let tieneDatosReales = elementosGantt.some(e => (e.progreso || 0) > 0 || e.finReal || e.inicioReal);
    if (esAgile && (proyecto.scrum?.sprints?.filter(s => s.estado === 'completado').length > 0)) {
        tieneDatosReales = true;
    }

    const costeAgileTotal = esAgile ? calcularCosteAgileTotalInforme(proyecto) : 0;

    let desviacionDias = 0;
    let tareasConDesviacion = 0;
    elementosGantt.forEach(tarea => {
        if (tarea.finReal && tarea.inicio && tarea.duracion) {
            let fechaFinPlan = typeof sumarDiasHabiles === 'function' ? sumarDiasHabiles(tarea.inicio, tarea.duracion) : new Date(tarea.inicio);
            let fechaFinReal = new Date(tarea.finReal);
            let diffDias = Math.ceil((fechaFinReal - fechaFinPlan) / (1000 * 60 * 60 * 24));
            if (diffDias > 0) { desviacionDias += diffDias; tareasConDesviacion++; }
        }
    });
    let desviacionPromedio = tareasConDesviacion > 0 ? Math.round(desviacionDias / tareasConDesviacion) : 0;

    let riesgos = proyecto.riesgos || [];
    let riesgosCriticos = riesgos.filter(r => r.nivel === 'Crítico' || r.nivel === 'critico').length;
    let riesgosAltos = riesgos.filter(r => r.nivel === 'Alto' || r.nivel === 'alto').length;
    let riesgosMedios = riesgos.filter(r => r.nivel === 'Medio' || r.nivel === 'medio').length;
    let riesgoScore = (riesgosCriticos * 5) + (riesgosAltos * 3) + (riesgosMedios * 1);

    let beneficio = BAC - costeTotal;
    let saludFinanciera = 100;
    if (BAC > 0) {
        let margen = (beneficio / BAC) * 100;
        if (margen < 0) saludFinanciera = Math.max(0, 30 + margen);
        else if (margen < 10) saludFinanciera = 50 + (margen * 2);
        else saludFinanciera = Math.min(100, 70 + (margen - 10));
    }
    saludFinanciera = Math.min(100, Math.max(0, saludFinanciera));

    let EV = 0, PV = 0, CPI = 1, SPI = 1, EAC = BAC;
    let progresoGeneralVal = 0;

    if (tieneDatosReales) {
        if (esAgile && costeAgileTotal > 0) {
            let velocityData = proyecto.scrum?.sprints?.filter(s => s.estado === 'completado' && s.velocity);
            let velocidades = velocityData ? velocityData.map(s => s.velocity) : [];
            let velocidadPromedioAgile = velocidades.length > 0 ? velocidades.reduce((a, b) => a + b, 0) / velocidades.length : 0;
            let puntosBacklog = (proyecto.scrum?.historias || []).filter(h => h.sprintId).length || 1;
            let agileCPI = AC > 0 ? (costeAgileTotal / AC) : 1;
            let agileSPI = puntosBacklog > 0 ? velocidadPromedioAgile / puntosBacklog : 1;
            CPI = Math.min(2, Math.max(0, agileCPI));
            SPI = Math.min(2, Math.max(0, agileSPI));
            EAC = CPI < 0.95 ? AC + (BAC - costeAgileTotal) / CPI : AC + (BAC - costeAgileTotal);
            EV = AC * CPI;
            PV = AC * SPI;
        } else {
            let evAcumulado = 0;
            let elemsParaEV = elementosGantt.filter(e => e.tipo !== 'edt');
            if (elemsParaEV.length > 0 && BAC > 0) {
                let pesoPorElemento = BAC / elemsParaEV.length;
                elemsParaEV.forEach(e => {
                    let progreso = e.progreso || 0;
                    if (e.tipo === 'hito' && e.progreso === 100) progreso = 100;
                    evAcumulado += pesoPorElemento * (progreso / 100);
                });
            }
            EV = evAcumulado;
            let fechaHoy = new Date();
            let fechaInicio = proyecto.fechaInicio ? new Date(proyecto.fechaInicio) : null;
            let fechaFinPlan = proyecto.fechaFinPlan ? new Date(proyecto.fechaFinPlan) : null;
            if (fechaInicio && fechaFinPlan && fechaInicio <= fechaHoy) {
                let totalDuracion = (fechaFinPlan - fechaInicio) / (1000 * 60 * 60 * 24);
                let diasTranscurridos = (fechaHoy - fechaInicio) / (1000 * 60 * 60 * 24);
                let porcentajePlanificado = totalDuracion > 0 ? Math.min(100, Math.max(0, (diasTranscurridos / totalDuracion) * 100)) : 0;
                PV = BAC * (porcentajePlanificado / 100);
            } else {
                let actividades = elementosGantt.filter(e => e.tipo === 'actividad');
                let entregables = elementosGantt.filter(e => e.tipo === 'entregable');
                let hitos = elementosGantt.filter(e => e.tipo === 'hito');
let procProgreso = (typeof contarProcesosCompletados === 'function' ? contarProcesosCompletados(proyecto) : (proyecto.procesos || []).filter(p => p.completado).length) / (typeof PROCESOS_PMBOK !== 'undefined' ? PROCESOS_PMBOK.length : 40) * 100;

                let actProgreso = actividades.length > 0 ? actividades.reduce((s, e) => s + (e.progreso || 0), 0) / actividades.length : 0;
                let entProgreso = entregables.length > 0 ? entregables.reduce((s, e) => s + (e.progreso || 0), 0) / entregables.length : 0;
                let hitosCompletados = hitos.filter(e => e.progreso >= 100).length;
                let hitoProgreso = hitos.length > 0 ? (hitosCompletados / hitos.length) * 100 : 0;
                progresoGeneralVal = (actProgreso * 0.4) + (entProgreso * 0.3) + (procProgreso * 0.2) + (hitoProgreso * 0.1);
                PV = BAC * (progresoGeneralVal / 100);
            }
            CPI = AC > 0 ? EV / AC : 1;
            SPI = PV > 0 ? EV / PV : 1;
            EAC = CPI > 0 ? BAC / CPI : BAC;
            EAC = Math.max(EAC, AC);
        }
    } else if ((typeof contarProcesosCompletados === 'function' ? contarProcesosCompletados(proyecto) : (proyecto.procesos || []).filter(p => p.completado).length) > 0 && BAC > 0) {
        const totalProcesos = (typeof PROCESOS_PMBOK !== 'undefined') ? PROCESOS_PMBOK.length : 40;
        const procesosCompletados = (typeof contarProcesosCompletados === 'function') ? contarProcesosCompletados(proyecto) : (proyecto.procesos || []).filter(p => p.completado).length;
        let progresoPorProcesos = procesosCompletados / totalProcesos;
        EV = BAC * progresoPorProcesos;
        PV = BAC * progresoPorProcesos;
        CPI = AC > 0 ? EV / AC : 1;
        SPI = 1;
        EAC = CPI > 0 ? BAC / CPI : BAC;
    }
    CPI = Math.min(2, Math.max(0, CPI));
    SPI = Math.min(2, Math.max(0, SPI));

    console.log(' Informe debug:', { BAC, AC, EV, PV, CPI, SPI, tieneDatosReales, elementosGantt: elementosGantt.length, progresoGeneralVal, EAC });

    let satisfaccion = proyecto.satisfaccionPromedio || 0;
    let indiceDefectos = 0;
    let totalEntregables = elementosGantt.filter(e => e.tipo === 'entregable').length || 1;
    if (proyecto.defectos !== undefined) indiceDefectos = proyecto.defectos / totalEntregables;
    let velocidadEquipo = esAgile ? (proyecto.velocidadEquipo || 0) : 0;
    let huellaCarbono = proyecto.huellaCarbono || 0;

    let saludGeneral = 0;
    saludGeneral = (CPI / 2 * 15) + (SPI / 2 * 15) + ((beneficio > 0 ? Math.min(beneficio / (BAC || 1), 1) : 0) * 20) + ((1 - Math.min(indiceDefectos, 1)) * 10)
        + (Math.min(velocidadEquipo || 0, 30) / 30 * 10) + (satisfaccion / 5 * 15) + ((1 - Math.min(huellaCarbono / 200, 1)) * 10) + (0 * 15);
    saludGeneral = Math.min(100, Math.max(0, saludGeneral));

    let actividades = elementosGantt.filter(e => e.tipo === 'actividad');
    let entregables = elementosGantt.filter(e => e.tipo === 'entregable');
    let hitos = elementosGantt.filter(e => e.tipo === 'hito');
let procProgreso = (typeof contarProcesosCompletados === 'function' ? contarProcesosCompletados(proyecto) : (proyecto.procesos || []).filter(p => p.completado).length) / (typeof PROCESOS_PMBOK !== 'undefined' ? PROCESOS_PMBOK.length : 40) * 100;
    let actProgreso = actividades.length > 0 ? actividades.reduce((s, e) => s + (e.progreso || 0), 0) / actividades.length : 0;
    let entProgreso = entregables.length > 0 ? entregables.reduce((s, e) => s + (e.progreso || 0), 0) / entregables.length : 0;
    let hitosCompletados = hitos.filter(e => e.progreso >= 100).length;
    let hitoProgreso = hitos.length > 0 ? (hitosCompletados / hitos.length) * 100 : 0;
    if (progresoGeneralVal === 0) {
        progresoGeneralVal = (actProgreso * 0.4) + (entProgreso * 0.3) + (procProgreso * 0.2) + (hitoProgreso * 0.1);
    }
    saludGeneral += (progresoGeneralVal / 100 * 15);
    saludGeneral = Math.min(100, Math.max(0, saludGeneral));

    let idioma = idiomaApp || 'es';
    let monedaSimbolo = proyecto.moneda === 'USD' ? '$' : proyecto.moneda === 'GBP' ? '£' : '€';
    let fmtMon = v => monedaSimbolo + ' ' + v.toLocaleString(idioma, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    let fmtPct = v => v.toFixed(1) + '%';
    let fmtNum = v => v.toLocaleString(idioma, { minimumFractionDigits: 0, maximumFractionDigits: 1 });

    // 1. INFORME DE ESTADO
    let logrado = elementosGantt.filter(e => e.progreso >= 100).length;
    let enCurso = elementosGantt.filter(e => e.progreso > 0 && e.progreso < 100).length;
    let noIniciado = elementosGantt.length - logrado - enCurso;
    let totalAct = elementosGantt.length || 1;
    document.getElementById('infEstadoLogrado').innerHTML = fmtPct((logrado / totalAct) * 100);
    document.getElementById('infEstadoCurso').innerHTML = fmtPct(((enCurso + noIniciado) / totalAct) * 100);

    let riesgosActivos = (proyecto.riesgos || []).filter(r => r.estado !== 'mitigado' && r.estado !== 'cerrado');
    let probContainer = document.getElementById('infEstadoProblemas');
    if (riesgosActivos.length > 0) {
        probContainer.innerHTML = riesgosActivos.slice(0, 5).map(r =>
            '<div style="padding:4px 0"> <strong>' + (r.nombre || 'Riesgo') + '</strong> — ' + (r.descripcion || '') + ' <span style="color:' + (r.nivel === 'Crítico' || r.nivel === 'critico' ? '#ff4444' : r.nivel === 'Alto' || r.nivel === 'alto' ? '#ff8800' : '#ffaa00') + '">(' + (r.nivel || r.probabilidad || '') + ')</span></div>'
        ).join('');
    } else {
        probContainer.innerHTML = ' ' + tApp('informe_problemas') + ': Sin incidencias reportadas.';
    }

    // 2. INFORME DE AVANCE
    document.getElementById('infAvanceProgreso').innerHTML = fmtPct(progresoGeneralVal);
    document.getElementById('infAvanceDesviacion').innerHTML = (desviacionPromedio > 0 ? '+' : '') + desviacionPromedio.toFixed(0);
    document.getElementById('infAvanceCostoReal').innerHTML = fmtMon(AC);
    document.getElementById('infAvanceCostoPlan').innerHTML = fmtMon(BAC * (progresoGeneralVal / 100));

    // 3. INFORME DE VARIACIÓN
    let areasVariacion = [
        { area: tApp('informe_planificado') + ' (Costo)', plan: BAC, real: AC, invert: true, tol: 5 },
        { area: 'CPI', plan: 1.0, real: CPI, tol: 5 },
        { area: 'SPI', plan: 1.0, real: SPI, tol: 5 },
        { area: tApp('informe_estado') + ' (Salud)', plan: 100, real: saludGeneral, tol: 30 },
        { area: tApp('informe_estado') + ' (Progreso)', plan: 100, real: progresoGeneralVal, tol: 30 }
    ];
    let variacionBody = document.getElementById('variacionBody');
    variacionBody.innerHTML = areasVariacion.map(a => {
        let desv = ((a.real - a.plan) / (a.plan || 1)) * 100;
        let umbral = a.tol || 5;
        let malo = a.invert ? desv > umbral : desv < -umbral;
        let bueno = a.invert ? desv < -umbral : desv > umbral;
        let estado = Math.abs(desv) < umbral ? '' : malo ? '' : '';
        let color = malo ? '#ff4444' : bueno ? '#4CAF50' : '#aaa';
        return '<tr><td>' + a.area + '</td><td>' + (typeof a.plan === 'number' && a.plan > 100 ? fmtMon(a.plan) : a.plan.toFixed(2)) + '</td><td>' + (typeof a.real === 'number' && a.real > 100 ? fmtMon(a.real) : a.real.toFixed(2)) + '</td><td style="color:' + color + '">' + desv.toFixed(1) + '%</td><td>' + estado + '</td></tr>';
    }).join('');

    // 4. INFORME DE PRONÓSTICO
    document.getElementById('infForecastCPI').innerHTML = CPI.toFixed(2);
    document.getElementById('infForecastSPI').innerHTML = SPI.toFixed(2);
    document.getElementById('infForecastEAC').innerHTML = fmtMon(EAC);
    let probExito = Math.max(0, Math.min(100, (saludGeneral * 0.6 + (1 - (EAC - BAC) / (BAC || 1)) * 100 * 0.4)));
    document.getElementById('infForecastProb').innerHTML = fmtPct(probExito);

    // 5. INFORME DE EXCEPCIÓN
    let umbralCPI = 0.8;
    let umbralSPI = 0.8;
    let umbralDesviacion = 30;
    let excepcion = false;
    let excUmbral = '', excValor = '', excSeveridad = '';

    if (CPI < umbralCPI) { excepcion = true; excUmbral = 'CPI < ' + umbralCPI; excValor = CPI.toFixed(2); excSeveridad = CPI < 0.6 ? ' Crítica' : ' Alta'; }
    if (SPI < umbralSPI) { excepcion = true; excUmbral = 'SPI < ' + umbralSPI; excValor = SPI.toFixed(2); excSeveridad = SPI < 0.6 ? ' Crítica' : ' Alta'; }
    if (Math.abs(desviacionPromedio) > umbralDesviacion) { excepcion = true; excUmbral = 'Desviación > ' + umbralDesviacion + ' días'; excValor = desviacionPromedio.toFixed(0) + ' días'; excSeveridad = Math.abs(desviacionPromedio) > 60 ? ' Crítica' : ' Alta'; }

    let excAlert = document.getElementById('infExceptionAlert');
    let excNoAlert = document.getElementById('infExceptionNoAlert');
    if (excepcion) {
        excAlert.style.display = 'block';
        excNoAlert.style.display = 'none';
        document.getElementById('infExceptionText').innerHTML = tApp('informe_excepcion_desc');
        document.getElementById('infExceptionUmbral').innerHTML = excUmbral;
        document.getElementById('infExceptionValor').innerHTML = excValor;
        document.getElementById('infExceptionSeveridad').innerHTML = excSeveridad;
    } else {
        excAlert.style.display = 'none';
        excNoAlert.style.display = 'block';
    }

    // 6. INFORME DE HITOS Y ENTREGABLES
    let hitosEntregables = elementosGantt.filter(e => e.tipo === 'hito' || e.tipo === 'entregable' || !e.tipo);
    hitosEntregables.sort((a, b) => {
        let order = { hito: 0, entregable: 1 };
        return (order[a.tipo] || 0) - (order[b.tipo] || 0);
    });
    let hitosBody = document.getElementById('infHitosBody');
    if (hitosEntregables.length > 0) {
        hitosBody.innerHTML = hitosEntregables.map(h => {
            let tipo = h.tipo === 'hito' ? ' Hito' : h.tipo === 'entregable' ? ' Entregable' : ' Elemento';
            let estado = h.progreso >= 100 ? ' ' + tApp('informe_completado') : h.finReal ? ' ' + tApp('informe_en_riesgo') : ' ' + tApp('informe_pendiente');
            let color = h.progreso >= 100 ? '#4CAF50' : h.finReal ? '#ff9800' : '#aaa';
            return '<tr><td>' + tipo + '</td><td>' + (h.nombre || h.tarea || 'Sin nombre') + '</td><td>' + (h.finPlan || '—') + '</td><td>' + (h.finReal || '—') + '</td><td style="color:' + color + '">' + estado + '</td></tr>';
        }).join('');
    }

    // 7. INFORME FINAL / CIERRE
    let beneficioProyectado = beneficio;
    document.getElementById('infFinalRendimiento').innerHTML = fmtPct(saludGeneral);
    document.getElementById('infFinalBeneficio').innerHTML = fmtMon(beneficioProyectado);

    let lecciones = proyecto.lecciones || [];
    let leccContainer = document.getElementById('infFinalLecciones');
    if (lecciones.length > 0) {
        leccContainer.innerHTML = lecciones.slice(0, 5).map(l =>
            '<div style="padding:4px 0">' + (l.tipo === 'exito' ? '' : '') + ' <strong>' + (l.titulo || '') + '</strong>: ' + (l.descripcion || '') + '</div>'
        ).join('');
    } else {
        leccContainer.innerHTML = tApp('informe_final_lecciones') + ': Sin lecciones registradas.';
    }

    let recContainer = document.getElementById('infFinalRecomendaciones');
    let recomendaciones = [];
    if (CPI < 0.9) recomendaciones.push(' Revisar estructura de costos: CPI bajo (' + CPI.toFixed(2) + '). Evaluar reducción de gastos y optimización de recursos.');
    if (SPI < 0.9) recomendaciones.push(' Acelerar cronograma: SPI bajo (' + SPI.toFixed(2) + '). Considerar asignación adicional de recursos a actividades críticas.');
    if (saludGeneral < 50) recomendaciones.push(' Salud general crítica (' + saludGeneral.toFixed(0) + '%). Se recomienda sesión de recuperación con el equipo y revisión de la línea base.');
    if (riesgoScore > 10) {
        let riesgosCriticosLista = (proyecto.riesgos || []).filter(r => { let n = (r.nivel || '').toLowerCase(); return n === 'crítico' || n === 'critico'; });
        let riesgosAltosLista = (proyecto.riesgos || []).filter(r => { let n = (r.nivel || '').toLowerCase(); return n === 'alto'; });
        let riesgosLista = [...riesgosCriticosLista, ...riesgosAltosLista].map(r => '• ' + (r.nombre || 'Sin nombre') + ' (' + (r.nivel || r.probabilidad || '') + ')').join('<br>');
        recomendaciones.push(' Alto nivel de riesgo (' + (riesgosCriticosLista.length + riesgosAltosLista.length) + ' críticos/altos). Priorizar la mitigación:<br>' + riesgosLista);
    }
    if (satisfaccion < 3) recomendaciones.push(' Satisfacción de stakeholders baja (' + satisfaccion.toFixed(1) + '/5). Incrementar comunicación y gestión de expectativas.');
    if (recomendaciones.length === 0) recomendaciones.push(' El proyecto muestra un desempeño adecuado. Continuar con las prácticas actuales de gestión.');
    recContainer.innerHTML = recomendaciones.join('<br>');

    // CHARTS
    _crearChartAvance(logrado, enCurso, noIniciado);
    _crearChartVariacion(areasVariacion);
    _crearChartForecast(BAC, AC, EV, EAC);
    _crearChartHitos(hitosEntregables);
    } catch (e) {
        console.error(' Error en actualizarInformeCompleto:', e);
        if (typeof mostrarToast === 'function') mostrarToast('Error al generar informe: ' + e.message, 'error');
    }
}

function _themeText() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return { text: isDark ? '#e0e0e0' : '#1a1a2e', grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)', card: isDark ? '#1c1c1e' : '#ffffff' };
}

function _crearChartAvance(logrado, enCurso, noIniciado) {
    if (infChartAvance) { infChartAvance.destroy(); infChartAvance = null; }
    let ctx = document.getElementById('chartAvance');
    if (!ctx) return;
    const t = _themeText();
    const c = ctx.getContext('2d');
    const grad = c.createLinearGradient(0, 0, ctx.canvas ? ctx.canvas.width : 300, 0);
    grad.addColorStop(0, '#4CAF50'); grad.addColorStop(1, '#66BB6A');
    const grad2 = c.createLinearGradient(0, 0, ctx.canvas ? ctx.canvas.width : 300, 0);
    grad2.addColorStop(0, '#FF9800'); grad2.addColorStop(1, '#FFB74D');
    const grad3 = c.createLinearGradient(0, 0, ctx.canvas ? ctx.canvas.width : 300, 0);
    grad3.addColorStop(0, '#B0BEC5'); grad3.addColorStop(1, '#CFD8DC');
    infChartAvance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [tApp('informe_completado'), tApp('informe_en_curso'), tApp('chart_no_iniciado')],
            datasets: [{ data: [logrado, enCurso, noIniciado], backgroundColor: [grad, grad2, grad3], borderWidth: 3, borderColor: t.card, hoverOffset: 16 }]
        },
        options: {
            responsive: true, maintainAspectRatio: true, cutout: '55%',
            plugins: {
                legend: { position: 'bottom', labels: { color: t.text, padding: 12, usePointStyle: true, pointStyle: 'circle', font: { size: 12, family: 'system-ui', weight: '500' } } },
                tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleFont: { size: 13, weight: '600' }, bodyFont: { size: 12 }, padding: 10, cornerRadius: 8, displayColors: true, boxPadding: 4 }
            }
        }
    });
}

function _crearChartVariacion(areas) {
    if (infChartVariacion) { infChartVariacion.destroy(); infChartVariacion = null; }
    let ctx = document.getElementById('chartVariacion');
    if (!ctx) return;
    const t = _themeText();
    const c = ctx.getContext('2d');
    const gradPlan = c.createLinearGradient(0, 0, 0, 400);
    gradPlan.addColorStop(0, 'rgba(33,150,243,0.9)'); gradPlan.addColorStop(1, 'rgba(33,150,243,0.2)');
    const gradReal = c.createLinearGradient(0, 0, 0, 400);
    gradReal.addColorStop(0, 'rgba(76,175,80,0.9)'); gradReal.addColorStop(1, 'rgba(76,175,80,0.2)');
    infChartVariacion = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: areas.map(a => a.area),
            datasets: [
                { label: tApp('informe_planificado'), data: areas.map(a => a.plan), backgroundColor: gradPlan, borderRadius: 6, borderSkipped: false },
                { label: tApp('informe_real'), data: areas.map(a => a.real), backgroundColor: gradReal, borderRadius: 6, borderSkipped: false }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: t.text, usePointStyle: true, pointStyle: 'rectRounded', padding: 12, font: { size: 12, family: 'system-ui', weight: '500' } } },
                tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', cornerRadius: 8, padding: 10 }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: t.grid }, ticks: { color: t.text, font: { size: 11 } } },
                x: { grid: { display: false }, ticks: { color: t.text, font: { size: 11, weight: '500' } } }
            }
        }
    });
}

function _crearChartForecast(BAC, AC, EV, EAC) {
    if (infChartForecast) { infChartForecast.destroy(); infChartForecast = null; }
    let ctx = document.getElementById('chartForecast');
    if (!ctx) return;
    const t = _themeText();
    let steps = 5;
    let labels = [], pvData = [], evData = [], acData = [];
    for (let i = 0; i <= steps; i++) {
        let pct = i / steps;
        labels.push((pct * 100).toFixed(0) + '%');
        pvData.push(BAC * pct); evData.push(EV * pct); acData.push(AC * pct);
    }
    const c = ctx.getContext('2d');
    const gradPV = c.createLinearGradient(0, 0, 0, 400);
    gradPV.addColorStop(0, 'rgba(33,150,243,0.3)'); gradPV.addColorStop(1, 'rgba(33,150,243,0.01)');
    const gradEV = c.createLinearGradient(0, 0, 0, 400);
    gradEV.addColorStop(0, 'rgba(76,175,80,0.3)'); gradEV.addColorStop(1, 'rgba(76,175,80,0.01)');
    const gradAC = c.createLinearGradient(0, 0, 0, 400);
    gradAC.addColorStop(0, 'rgba(255,152,0,0.3)'); gradAC.addColorStop(1, 'rgba(255,152,0,0.01)');
    infChartForecast = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: tApp('chart_pv_planificado'), data: pvData, borderColor: '#2196F3', backgroundColor: gradPV, fill: true, tension: 0.4, borderWidth: 3, pointBackgroundColor: '#2196F3', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 7 },
                { label: tApp('chart_ev_ganado'), data: evData, borderColor: '#4CAF50', backgroundColor: gradEV, fill: true, tension: 0.4, borderWidth: 3, pointBackgroundColor: '#4CAF50', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 7 },
                { label: tApp('chart_ac_real'), data: acData, borderColor: '#FF9800', backgroundColor: gradAC, fill: true, tension: 0.4, borderWidth: 3, pointBackgroundColor: '#FF9800', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 7 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: t.text, usePointStyle: true, padding: 12, font: { size: 12, family: 'system-ui', weight: '500' } } },
                tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', cornerRadius: 8, padding: 10 }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: t.grid }, ticks: { color: t.text, font: { size: 11 } } },
                x: { grid: { color: t.grid }, ticks: { color: t.text, font: { size: 11, weight: '500' } } }
            }
        }
    });
}

function _crearChartHitos(lista) {
    if (infChartHitos) { infChartHitos.destroy(); infChartHitos = null; }
    let ctx = document.getElementById('chartHitos');
    if (!ctx) return;
    const t = _themeText();
    const c = ctx.getContext('2d');
    const gradOk = c.createLinearGradient(0, 0, ctx.canvas ? ctx.canvas.width : 300, 0);
    gradOk.addColorStop(0, '#4CAF50'); gradOk.addColorStop(1, '#81C784');
    const gradPend = c.createLinearGradient(0, 0, ctx.canvas ? ctx.canvas.width : 300, 0);
    gradPend.addColorStop(0, '#B0BEC5'); gradPend.addColorStop(1, '#CFD8DC');
    let completados = lista.filter(h => h.progreso >= 100).length;
    let pendientes = lista.length - completados;
    infChartHitos = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [tApp('informe_completado'), tApp('informe_pendiente')],
            datasets: [{ data: [completados, pendientes], backgroundColor: [gradOk, gradPend], borderWidth: 3, borderColor: t.card, hoverOffset: 16 }]
        },
        options: {
            responsive: true, maintainAspectRatio: true, cutout: '55%',
            plugins: {
                legend: { position: 'bottom', labels: { color: t.text, padding: 12, usePointStyle: true, pointStyle: 'circle', font: { size: 12, family: 'system-ui', weight: '500' } } },
                tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', cornerRadius: 8, padding: 10 }
            }
        }
    });
}

function exportarInformePDF() {
    if (!proyecto) {
        if (typeof mostrarToast === 'function') mostrarToast(tApp('toast_no_proyecto'), 'error');
        return;
    }
    if (typeof mostrarToast === 'function') mostrarToast(" Generando PDF de informe...", 'info');

    var panel = document.getElementById('panelInforme');
    if (!panel) return;
    try {
        var clone = panel.cloneNode(true);
        clone.querySelectorAll('.btn, input, select, textarea, button').forEach(function(el) { el.remove(); });

        var canvasOrigen = document.querySelectorAll('#panelInforme canvas');
        var canvasClonados = clone.querySelectorAll('canvas');
        for (var ci = 0; ci < canvasOrigen.length && ci < canvasClonados.length; ci++) {
            try {
                var imgData = canvasOrigen[ci].toDataURL('image/png');
                var img = document.createElement('img');
                img.src = imgData;
                img.style.cssText = 'max-width:100%;height:auto';
                img.width = canvasOrigen[ci].width;
                img.height = canvasOrigen[ci].height;
                canvasClonados[ci].parentNode.replaceChild(img, canvasClonados[ci]);
            } catch(e) {}
        }

        var container = document.createElement('div');
        container.style.cssText = 'position:absolute;top:-9999px;left:-9999px;width:1200px;background:white;padding:40px;font-family:Arial,sans-serif;color:#333;z-index:9999';
        container.appendChild(clone);
        document.body.appendChild(container);

        var nombreProy = proyecto.nombre || localStorage.getItem('proyectoNombre') || 'Proyecto';

        var header = document.createElement('div');
        header.style.cssText = 'text-align:center;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #1a237e';
        header.innerHTML = '<h1 style="margin:0;font-size:24px;color:#1a237e"> ' + tApp('informe_titulo') + '</h1>'
            + '<h2 style="margin:8px 0 0;font-size:18px;color:#333">' + escapeHtml(nombreProy) + '</h2>'
            + '<p style="margin:5px 0 0;font-size:13px;color:#666">' + tApp('informe_generado') + ': ' + new Date().toLocaleDateString() + '</p>';
        clone.insertBefore(header, clone.firstChild);

        var footer = document.createElement('div');
        footer.style.cssText = 'text-align:center;margin-top:30px;padding-top:15px;border-top:1px solid #ccc;font-size:11px;color:#999';
        footer.innerHTML = tApp('informe_proyecto') + ': ' + escapeHtml(nombreProy) + ' — Reports — v1.0';
        clone.appendChild(footer);

        var inlineCss = document.createElement('style');
        inlineCss.textContent = `
            body { font-family: Arial, sans-serif; color: #333; margin:0; padding:0; }
            .info-card { border-left: 4px solid #1a237e; padding: 15px; margin-bottom: 20px; background: #f5f5f5; border-radius: 8px; }
            .info-card-center { text-align: center; }
            .cards-grid { display: grid; gap: 15px; }
            .cards-grid-2 { grid-template-columns: 1fr 1fr; }
            .cards-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
            .cards-grid-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
            .value-card { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; }
            .value-card .small { font-size: 12px; color: #666; margin-bottom: 4px; }
            .value-card .big { font-size: 24px; font-weight: bold; color: #1a237e; }
            .data-table { width: 100%; border-collapse: collapse; font-size: 12px; }
            .data-table th { background: #1a237e; color: white; padding: 8px; text-align: left; }
            .data-table td { padding: 8px; border-bottom: 1px solid #eee; }
            h4 { font-size: 14px; color: #1a237e; margin: 0 0 10px 0; }
            .chart-container { width: 100%; max-width: 600px; margin: 0 auto; text-align: center; }
            .u-mt-16 { margin-top: 16px; }
            .u-mb-24 { margin-bottom: 24px; }
            .u-text-center { text-align: center; }
            .u-fs-14 { font-size: 14px; }
            .u-fs-12 { font-size: 12px; }
            img { max-width: 100% !important; height: auto !important; }
            #infExceptionNoAlert { text-align: center; padding: 20px; color: #666; }
        `;
        clone.insertBefore(inlineCss, clone.firstChild);

        html2canvas(container, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true
        }).then(function(canvas) {
            var imgData = canvas.toDataURL('image/png');
            var win = window.open('', '_blank');
            if (win) {
                win.document.write('<!DOCTYPE html><html><head><title>Informe - ' + escapeHtml(nombreProy) + '</title>');
                win.document.write('<style>body{margin:0;padding:0;display:flex;justify-content:center;background:#666}img{max-width:100%;height:auto}@media print{body{margin:0;padding:0}img{page-break-inside:avoid}}</style>');
                win.document.write('</head><body>');
                win.document.write('<img src="' + imgData + '" onload="window.print()">');
                win.document.write('</body></html>');
                win.document.close();
            }
            document.body.removeChild(container);
            if (typeof mostrarToast === 'function') mostrarToast(" PDF generado correctamente", 'success');
        }).catch(function(err) {
            document.body.removeChild(container);
            if (typeof mostrarToast === 'function') mostrarToast('Error al generar PDF: ' + err.message);
        });
    } catch (e) {
        if (typeof mostrarToast === 'function') mostrarToast('Error: ' + e.message);
    }
}
