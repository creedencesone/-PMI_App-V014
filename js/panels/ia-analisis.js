/**
 * PMI Mind — Asistente IA Predictivo
 * ------------------------------------------------------------
 * Usa LocalAIService (Ollama / servidor LAN / proveedor compatible).
 * Si no hay ningún modelo disponible, cae al análisis heurístico
 * integrado para que la app siga siendo 100% funcional offline.
 */

const TIPOS_ANALISIS_IA = {
    riesgos: 'predicción de riesgos',
    costos: 'predicción de costes',
    plazo: 'predicción de plazos',
    calidad: 'calidad esperada',
    recomendaciones: 'recomendaciones prioritarias',
    completo: 'diagnóstico integral del proyecto'
};

/** Configura el entorno y el modelo. Llamado desde el botón del sidebar y del modal. */
async function configurarIALocal(cambios) {
    const modal = document.getElementById('modalIA');
    if (modal) modal.style.display = 'flex';

    if (cambios && typeof cambios.proveedor === 'string') {
        LocalAIService.configurar({ perfil: cambios.proveedor, modelos: {} });
    }
    if (cambios && typeof cambios.modelo === 'string') {
        const perfil = LocalAIService.leerConfig().perfil;
        LocalAIService.configurar({ modelos: { [perfil]: cambios.modelo } });
    }
    LocalAIService.limpiarCredencialesLegacy();
    await actualizarControlesIA();
}

/** Alias conservado por compatibilidad con enlaces antiguos. */
function configurarAPIKeyIA() {
    return configurarIALocal();
}

/** Pinta los desplegables de entorno/modelo a partir de lo que responde cada servidor. */
async function actualizarControlesIA() {
    const selProveedor = document.getElementById('iaProveedor');
    const selModelo = document.getElementById('iaModelo');
    const estado = document.getElementById('iaEstado');
    if (!selProveedor || !selModelo || !estado) return;

    const cfg = LocalAIService.leerConfig();

    selProveedor.innerHTML = '';
    LocalAIService.PROVEEDORES.forEach(p => {
        const opcion = document.createElement('option');
        opcion.value = p.id;
        opcion.textContent = p.nombre;
        opcion.selected = p.id === cfg.perfil;
        selProveedor.appendChild(opcion);
    });

    estado.textContent = 'Buscando proveedores…';
    const disponibles = await LocalAIService.perfilesDisponibles();

    Array.from(selProveedor.options).forEach(opcion => {
        const ok = disponibles.includes(opcion.value);
        opcion.textContent = `${LocalAIService.proveedor(opcion.value).nombre}${ok ? '' : ' (sin conexión)'}`;
        opcion.disabled = !ok && opcion.value !== cfg.perfil;
    });

    if (disponibles.length && !disponibles.includes(cfg.perfil)) {
        LocalAIService.configurar({ perfil: disponibles[0] });
    }

    const perfil = LocalAIService.leerConfig().perfil;
    selProveedor.value = perfil;

    const modelos = await LocalAIService.listModels(perfil);
    const actual = LocalAIService.modeloActivo(perfil);

    selModelo.innerHTML = '';
    const vacia = document.createElement('option');
    vacia.value = '';
    vacia.textContent = modelos.length ? '— selecciona un modelo —' : '— sin modelos detectados —';
    selModelo.appendChild(vacia);

    modelos.forEach(m => {
        const opcion = document.createElement('option');
        opcion.value = m.id;
        opcion.textContent = m.gb ? `${m.id} (${m.gb} GB)` : m.id;
        selModelo.appendChild(opcion);
    });

    if (actual && modelos.some(m => m.id === actual)) {
        selModelo.value = actual;
    } else if (actual) {
        // El modelo elegido ya no existe en el servidor: limpiar la selección.
        LocalAIService.configurar({ modelos: { [perfil]: '' } });
    }

    actualizarResumenIA(disponibles.length, modelos.length);
}

function actualizarResumenIA(proveedores, modelos) {
    const estado = document.getElementById('iaEstado');
    if (!estado) return;
    if (!proveedores) {
        estado.textContent = 'Sin IA local: se usará el análisis heurístico integrado';
        return;
    }
    estado.textContent = `${proveedores} proveedor(es) · ${modelos} modelo(s) disponible(s)`;
}

function seleccionarProveedorIA(id) {
    LocalAIService.configurar({ perfil: id, modelos: {} });
    actualizarControlesIA();
}

function seleccionarModeloIA(id) {
    const perfil = LocalAIService.leerConfig().perfil;
    LocalAIService.configurar({ modelos: { [perfil]: id } });
    const estado = document.getElementById('iaEstado');
    if (estado && id) estado.textContent = `Modelo activo: ${id}`;
}

async function refrescarModelosIA() {
    await actualizarControlesIA();
}

async function probarConexionIA() {
    const estado = document.getElementById('iaEstado');
    if (estado) estado.textContent = 'Probando conexión…';
    try {
        const texto = await LocalAIService.ask(
            [{ role: 'user', content: 'Responde únicamente con la palabra OK.' }],
            { signal: AbortSignal.timeout(8000) }
        );
        if (estado) estado.textContent = `Conexión OK · ${texto.slice(0, 40)}`;
        if (typeof mostrarToast === 'function') mostrarToast(' IA local conectada', 'success');
    } catch (e) {
        if (estado) estado.textContent = `Sin conexión: ${e.message.slice(0, 80)}`;
        if (typeof mostrarToast === 'function') mostrarToast(' No se pudo conectar con la IA local', 'info');
    }
}

/** Extrae el contexto numérico que ya usa el panel (sin enviar el proyecto completo). */
function recopilarContextoIA() {
    const numero = id => parseFloat(
        (document.getElementById(id)?.innerText || '').replace(/[^0-9.,-]/g, '').replace(',', '.')
    ) || 0;
    const entero = id => parseInt(document.getElementById(id)?.innerText || '0') || 0;

    const costeTotal = numero('totalCoste');
    const ingresoTotal = numero('totalIngreso');
    const beneficio = ingresoTotal - costeTotal;
    const roi = costeTotal > 0 ? ((beneficio / costeTotal) * 100).toFixed(1) : 0;

    return {
        costeTotal,
        ingresoTotal,
        beneficio,
        roi,
        riesgosCriticos: entero('totalRiesgosCriticos'),
        riesgosAltos: entero('totalRiesgosAltos'),
        equipo: proyecto?.equipo?.length || 0,
        materiales: proyecto?.materiales?.length || 0,
        stakeholders: proyecto?.stakeholders?.length || 0
    };
}

/** Heurística original: fallback cuando no hay modelo local disponible. */
function generarAnalisisHeuristico(tipo, datos) {
    const { costeTotal, ingresoTotal, beneficio, roi, riesgosCriticos, riesgosAltos,
            equipo, materiales, stakeholders } = datos;

    let probSobrecosto = 30;
    let probRetraso = 25;
    let salud = 75;

    if (beneficio < costeTotal * 0.1) probSobrecosto += 20;
    if (equipo < 3) probRetraso += 15;
    if (stakeholders < 3) salud -= 10;
    if (riesgosCriticos > 0) { salud -= riesgosCriticos * 10; probSobrecosto += riesgosCriticos * 5; }
    if (materiales === 0) salud -= 10;

    probSobrecosto = Math.min(95, Math.max(5, probSobrecosto));
    probRetraso = Math.min(95, Math.max(5, probRetraso));
    salud = Math.min(100, Math.max(0, salud));

    if (tipo === 'riesgos') {
        return `<div class="ia-analisis-card"><strong> Predicción de Riesgos</strong><hr>
        <div><span class="ia-tag ia-tag-riesgo"> Riesgo detectado</span> <strong>Desviación presupuestaria</strong><br> Probabilidad: ${probSobrecosto}% | Impacto: Alto<br> Mitigación: Revisar estructura de costos</div>
        <div class="u-mt-12"><span class="ia-tag ia-tag-riesgo"> Riesgo detectado</span> <strong>Retraso en entregas</strong><br> Probabilidad: ${probRetraso}% | Impacto: Medio<br> Mitigación: Priorizar recursos críticos</div>
        <div class="u-mt-12"><strong> Riesgos actuales:</strong> ${riesgosCriticos} críticos, ${riesgosAltos} altos</div>
        <div><strong> Score riesgo global:</strong> ${Math.min(100, (riesgosCriticos * 25) + (riesgosAltos * 10))}/100</div></div>`;
    }
    if (tipo === 'costos') {
        return `<div class="ia-analisis-card ia-prediccion-${probSobrecosto > 60 ? 'alta' : (probSobrecosto > 30 ? 'media' : 'baja')}">
        <strong> Predicción de Costos</strong><hr>
        <div class="u-fs-24 u-bold">${probSobrecosto}%</div>
        <div>Probabilidad de sobrecosto</div>
        <div class="u-mt-12"> Posible desviación: ${Math.round(probSobrecosto / 5)}%</div>
        <div class="u-mt-12"><strong> Partidas con riesgo:</strong><br>• Materiales y suministros<br>• Costos de personal</div>
        <div class="u-mt-12"><strong> Métricas actuales:</strong><br> Coste: ${formatearMoneda(costeTotal)}<br> Ingreso: ${formatearMoneda(ingresoTotal)}<br> Beneficio: ${formatearMoneda(beneficio)} (${roi}% ROI)</div></div>`;
    }
    if (tipo === 'plazo') {
        return `<div class="ia-analisis-card ia-prediccion-${probRetraso > 60 ? 'alta' : (probRetraso > 30 ? 'media' : 'baja')}">
        <strong> Predicción de Plazo</strong><hr>
        <div class="u-fs-24 u-bold">${probRetraso}%</div>
        <div>Probabilidad de retraso</div>
        <div class="u-mt-12"> Retraso estimado: ${Math.ceil(probRetraso / 20)} mes(es)</div>
        <div class="u-mt-12"><strong> Actividades críticas:</strong><br>• Planificación inicial<br>• Aprobaciones de stakeholders</div>
        <div><strong> Estrategias:</strong><br>• Revisar ruta crítica semanalmente<br>• Asignar recursos adicionales</div></div>`;
    }
    if (tipo === 'calidad') {
        const nivelCalidad = salud >= 70 ? 'Alto' : (salud >= 40 ? 'Medio' : 'Bajo');
        return `<div class="ia-analisis-card ia-prediccion-${salud < 40 ? 'alta' : (salud < 70 ? 'media' : 'baja')}">
        <strong> Calidad Esperada</strong><hr>
        <div class="u-fs-24 u-bold">${nivelCalidad}</div>
        <div>Puntaje de calidad: ${salud}/100</div>
        <div class="u-mt-12"><strong> Factores de riesgo:</strong><br>• ${materiales === 0 ? 'Sin registros de materiales' : 'Materiales registrados: ' + materiales}<br>• ${stakeholders < 3 ? 'Pocos stakeholders identificados' : stakeholders + ' stakeholders registrados'}</div>
        <div><strong> Recomendaciones:</strong><br>• Implementar checklist de entregables<br>• Realizar pruebas piloto</div></div>`;
    }
    if (tipo === 'recomendaciones') {
        return `<div class="ia-analisis-card"><strong> Recomendaciones Prioritarias</strong><hr>
        <div><strong> Acciones inmediatas:</strong><br>1. ${riesgosCriticos > 0 ? 'Mitigar riesgos críticos prioritariamente' : 'Mantener control semanal de riesgos'}<br>2. ${probSobrecosto > 50 ? 'Revisar estructura de costos y proveedores' : 'Optimizar procesos actuales'}<br>3. ${stakeholders < 3 ? 'Identificar y gestionar stakeholders clave' : 'Fortalecer comunicación con stakeholders'}</div>
        <div class="u-mt-12"><strong> Mejoras para segunda fase:</strong><br>• Implementar dashboard de KPIs<br>• Revisiones quincenales con el equipo</div>
        <div class="u-mt-12"><strong> KPIs a monitorear:</strong><br>• SPI (Schedule): ${Math.max(0, 100 - probRetraso)}%<br>• CPI (Cost): ${Math.max(0, 100 - probSobrecosto)}%</div></div>`;
    }

    const nivelSalud = salud >= 70 ? 'Buena' : (salud >= 40 ? 'Moderada' : 'Crítica');
    const colorSalud = salud >= 70 ? '#047857' : (salud >= 40 ? '#92400E' : '#B42318');
    return `<div class="ia-analisis-card"><strong> DIAGNÓSTICO GENERAL</strong><hr>
    <div style="font-size:48px;font-weight:bold;text-align:center;color:${colorSalud};">${salud}%</div>
    <div class="u-text-center">Salud del Proyecto - ${nivelSalud}</div></div>
    <div class="ia-analisis-card"><strong> RIESGOS</strong><hr>
    <div> Críticos: ${riesgosCriticos} | Altos: ${riesgosAltos}</div>
    <div> Probabilidad de sobrecosto: ${probSobrecosto}%</div>
    <div> Probabilidad de retraso: ${probRetraso}%</div></div>
    <div class="ia-analisis-card"><strong> FINANZAS</strong><hr>
    <div> Coste Total: ${formatearMoneda(costeTotal)}</div>
    <div> Ingreso Total: ${formatearMoneda(ingresoTotal)}</div>
    <div> Beneficio: ${formatearMoneda(beneficio)} (${roi}% ROI)</div></div>
    <div class="ia-analisis-card"><strong> RECOMENDACIONES</strong><hr>
    <ol><li><strong>Prioridad 1:</strong> ${riesgosCriticos > 0 ? 'Mitigar riesgos críticos' : 'Mantener control de riesgos'}</li>
    <li><strong>Prioridad 2:</strong> ${probSobrecosto > 50 ? 'Revisar estructura de costos' : 'Optimizar procesos'}</li>
    <li><strong>Prioridad 3:</strong> ${stakeholders < 3 ? 'Gestionar stakeholders' : 'Fortalecer comunicaciones'}</li></ol></div>`;
}

async function analizarPrediccionIA(tipo) {
    const modal = document.getElementById('modalIA');
    const loading = document.getElementById('iaLoading');
    const resultado = document.getElementById('iaResultado');
    if (!modal || !loading || !resultado) return;

    modal.style.display = 'flex';
    loading.style.display = 'block';
    resultado.textContent = '';

    const datos = recopilarContextoIA();
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), 30000);

    try {
        const texto = await LocalAIService.ask([
            {
                role: 'system',
                content: 'Eres consultor senior de gestión de proyectos PMI. Responde siempre en español, ' +
                         'en markdown plano y con un máximo de 250 palabras. No inventes datos que no estén ' +
                         'en el contexto. Estructura la respuesta en **Diagnóstico**, **Riesgos** y ' +
                         '**Acciones recomendadas**.'
            },
            {
                role: 'user',
                content: JSON.stringify({
                    tarea: TIPOS_ANALISIS_IA[tipo] || tipo,
                    proyecto: proyecto?.nombre || null,
                    metricas: datos
                })
            }
        ], { signal: controlador.signal });

        loading.style.display = 'none';

        const distintivo = document.createElement('div');
        distintivo.className = 'ia-badge';
        const cfg = LocalAIService.leerConfig();
        distintivo.textContent = `IA local · ${LocalAIService.modeloActivo(cfg.perfil) || 'modelo'} · ${LocalAIService.proveedor(cfg.perfil).nombre}`;

        const respuesta = document.createElement('div');
        respuesta.className = 'ia-respuesta';
        respuesta.textContent = texto; // Nunca innerHTML: la salida del modelo no es de confianza.

        resultado.appendChild(distintivo);
        resultado.appendChild(respuesta);
    } catch (e) {
        loading.style.display = 'none';
        const aviso = document.createElement('div');
        aviso.className = 'ia-badge ia-badge-fallback';
        aviso.textContent = e.name === 'AbortError'
            ? ' La IA tardó demasiado: se muestra el análisis integrado'
            : ' IA local no disponible: se muestra el análisis integrado';
        resultado.appendChild(aviso);
        resultado.insertAdjacentHTML('beforeend', generarAnalisisHeuristico(tipo, datos));
    } finally {
        clearTimeout(temporizador);
    }
}

function cerrarModalIA() { document.getElementById('modalIA').style.display = 'none'; }

function copiarResultadoIA() {
    const texto = document.getElementById('iaResultado').innerText;
    navigator.clipboard.writeText(texto).then(() => mostrarToast(' Copiado al portapapeles', 'success'));
}

function exportarIAPDF() {
    const contenido = document.getElementById('iaResultado').innerHTML;
    const ventana = window.open('', '_blank');
    ventana.document.write(`
        <html><head><title>Análisis IA - ${escapeHtml(proyecto?.nombre || 'Proyecto')}</title>
        <style>body{font-family:Arial;padding:40px;} .ia-analisis-card{border:1px solid #ddd;padding:16px;margin-bottom:16px;border-radius:8px;} .ia-respuesta{white-space:pre-wrap;}</style>
        </head><body>
        <h1> Análisis Predictivo IA</h1>
        <h3>Proyecto: ${escapeHtml(proyecto?.nombre || 'Proyecto')}</h3>
        <p>Fecha: ${new Date().toLocaleString('es-ES')}</p>
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
    btn.onclick = () => configurarIALocal();
    document.body.appendChild(btn);
}

// ============================================================
// NAVEGACIÓN Y CARGA INICIAL
// ============================================================
