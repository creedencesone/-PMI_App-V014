// ============================================================
// panels/panel-agentes.js — Equipo de agentes PMI (UI accesible)
// ============================================================

let _resultadoEquipoAgentes = null;

function inicializarPanelAgentes() {
    const resumen = document.getElementById('agentesResumen');
    if (resumen && !resumen.textContent.trim()) {
        resumen.textContent = 'Ejecuta el equipo para obtener un diagnóstico por especialidad.';
    }
    const contenedor = document.getElementById('agentesResultados');
    if (contenedor && !contenedor.childElementCount) {
        const vacio = document.createElement('p');
        vacio.className = 'u-text-muted';
        vacio.id = 'agentesVacio';
        vacio.textContent = 'Aún no hay resultados. El análisis se muestra aquí cuando termines la ejecución.';
        contenedor.appendChild(vacio);
    }
}

function _anadirLista(contenedor, etiqueta, elementos, ordenada) {
    if (!elementos || !elementos.length) return;
    const titulo = document.createElement('h4');
    titulo.textContent = etiqueta;
    const lista = document.createElement(ordenada ? 'ol' : 'ul');
    elementos.forEach(texto => {
        const item = document.createElement('li');
        item.textContent = texto;
        lista.appendChild(item);
    });
    contenedor.appendChild(titulo);
    contenedor.appendChild(lista);
}

function renderizarResultadosEquipoAgentes(resultado) {
    const contenedor = document.getElementById('agentesResultados');
    if (!contenedor || !resultado) return;
    contenedor.textContent = '';

    resultado.resultados.forEach(r => {
        const articulo = document.createElement('article');
        articulo.className = 'agente-card';
        articulo.setAttribute('aria-label', `Informe del agente ${r.nombre}`);

        const titulo = document.createElement('h3');
        titulo.textContent = `${r.nombre} · ${r.rol}`;

        const origen = document.createElement('p');
        origen.className = 'agente-badge';
        origen.textContent = r.modo === 'ia'
            ? `IA · ${r.modelo || 'modelo activo'}`
            : `Análisis integrado · ${r.error || 'sin modelo disponible'}`;

        const resumen = document.createElement('p');
        resumen.textContent = r.resumen;

        articulo.appendChild(titulo);
        articulo.appendChild(origen);
        articulo.appendChild(resumen);
        _anadirLista(articulo, 'Señales detectadas', (r.senales || []).map(s => `[${s.nivel}] ${s.texto}`), false);
        _anadirLista(articulo, 'Acciones recomendadas', r.acciones, true);
        contenedor.appendChild(articulo);
    });
}

async function ejecutarEquipoAgentesDesdeUI() {
    const boton = document.getElementById('btnEjecutarEquipoAgentes');
    const resumen = document.getElementById('agentesResumen');
    if (typeof ejecutarEquipoAgentes !== 'function') {
        if (resumen) resumen.textContent = 'El módulo de agentes no está disponible.';
        return;
    }
    if (boton) boton.disabled = true;
    if (resumen) resumen.textContent = 'Ejecutando equipo de agentes…';

    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), 45000);
    try {
        const metricas = typeof recopilarContextoIA === 'function' ? recopilarContextoIA() : undefined;
        const resultado = await ejecutarEquipoAgentes(
            typeof proyecto !== 'undefined' ? proyecto : null,
            { metricas, signal: controlador.signal }
        );
        _resultadoEquipoAgentes = resultado;
        renderizarResultadosEquipoAgentes(resultado);
        if (resumen) {
            resumen.textContent = `${resultado.resultados.length} agente(s) · modo ${resultado.metadata.modo} · entorno ${resultado.metadata.perfil}`;
        }
        if (typeof mostrarToast === 'function') {
            mostrarToast('Informe del equipo de agentes actualizado', 'success');
        }
    } catch (e) {
        if (resumen) resumen.textContent = `No se pudo ejecutar el equipo: ${e.message}`;
    } finally {
        clearTimeout(temporizador);
        if (boton) boton.disabled = false;
    }
}

function copiarInformeEquipoAgentes() {
    if (!_resultadoEquipoAgentes) {
        if (typeof mostrarToast === 'function') mostrarToast('Ejecuta primero el equipo', 'info');
        return;
    }
    const lineas = [_resultadoEquipoAgentes.contexto.nombre || 'Proyecto'].concat(
        _resultadoEquipoAgentes.resultados.map(r => [
            '',
            `${r.nombre} · ${r.rol} [${r.modo}]`,
            r.resumen,
            ...(r.senales || []).map(s => `- [${s.nivel}] ${s.texto}`),
            ...(r.acciones || []).map((a, i) => `${i + 1}. ${a}`)
        ].join('\n'))
    );
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(lineas.join('\n'))
            .then(() => { if (typeof mostrarToast === 'function') mostrarToast('Informe copiado al portapapeles', 'success'); })
            .catch(() => { if (typeof mostrarToast === 'function') mostrarToast('No se pudo copiar el informe', 'error'); });
    }
}

if (typeof window !== 'undefined') {
    window.inicializarPanelAgentes = inicializarPanelAgentes;
    window.renderizarResultadosEquipoAgentes = renderizarResultadosEquipoAgentes;
    window.ejecutarEquipoAgentesDesdeUI = ejecutarEquipoAgentesDesdeUI;
    window.copiarInformeEquipoAgentes = copiarInformeEquipoAgentes;
}
