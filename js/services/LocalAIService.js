/**
 * PMI Mind — Local AI Service (modelo-agnóstico)
 * ------------------------------------------------------------
 * Descubre proveedores compatibles con la API de chat de OpenAI
 * (Ollama, LM Studio, LLM Biónico, llama.cpp...) y los modelos
 * instalados en cada uno. El modelo elegido vive en localStorage:
 * cambiar de modelo nunca requiere tocar el código ni redeployar.
 *
 * Patrón del proyecto: script clásico que expone un global.
 */
window.LocalAIService = (() => {
  'use strict';

  const STORAGE_KEY = 'pmi_ai_config_v1';

  /** Añadir aquí un proveedor nuevo no requiere cambios en el resto de la app. */
  const PROVEEDORES = Object.freeze([
    { id: 'local',   nombre: 'Local (esta máquina)', tipo: 'ollama',            baseUrl: 'http://127.0.0.1:11434' },
    { id: 'lan',     nombre: 'Servidor LAN',          tipo: 'ollama',            baseUrl: 'https://ai.tu-tailnet.ts.net' },
    { id: 'bionico', nombre: 'LLM Biónico / otro',    tipo: 'openai-compatible', baseUrl: 'http://127.0.0.1:1234/v1' }
  ]);

  const POR_DEFECTO = { perfil: 'local', modelos: {} };

  // ------------------------------------------------------------
  // Configuración persistida
  // ------------------------------------------------------------
  function leerConfig() {
    try {
      const guardada = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        perfil: typeof guardada.perfil === 'string' ? guardada.perfil : POR_DEFECTO.perfil,
        modelos: (guardada.modelos && typeof guardada.modelos === 'object') ? guardada.modelos : {}
      };
    } catch (_) {
      return { perfil: POR_DEFECTO.perfil, modelos: {} };
    }
  }

  function configurar(cambios = {}) {
    const actual = leerConfig();
    const siguiente = {
      perfil: typeof cambios.perfil === 'string' ? cambios.perfil : actual.perfil,
      modelos: { ...actual.modelos, ...(cambios.modelos || {}) }
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(siguiente)); } catch (_) { /* modo privado */ }
    return siguiente;
  }

  function proveedor(id) {
    return PROVEEDORES.find(p => p.id === id) || PROVEEDORES[0];
  }

  function baseUrl(p) {
    return String(p.baseUrl || '').replace(/\/+$/, '');
  }

  function modeloActivo(id) {
    const cfg = leerConfig();
    return cfg.modelos[id || cfg.perfil] || '';
  }

  /** Elimina la antigua API key de OpenAI: con IA local no hay secretos en el cliente. */
  function limpiarCredencialesLegacy() {
    try { localStorage.removeItem('openai_api_key'); } catch (_) { /* no-op */ }
  }

  // ------------------------------------------------------------
  // Descubrimiento de modelos
  // ------------------------------------------------------------
  function rutasModelos(p) {
    const base = baseUrl(p);
    return p.tipo === 'ollama'
      ? [`${base}/api/tags`, `${base}/v1/models`]
      : [`${base}/models`, `${base}/v1/models`];
  }

  /** Normaliza respuestas de Ollama ({models:[{name,size}]}) y OpenAI ({data:[{id}]}). */
  function normalizarModelos(payload) {
    const lista = Array.isArray(payload?.models) ? payload.models
                : Array.isArray(payload?.data) ? payload.data : [];
    const vistos = new Set();
    return lista.map(item => {
      const id = String(item?.name || item?.id || item?.model || '').trim();
      if (!id || vistos.has(id)) return null;
      vistos.add(id);
      return {
        id,
        gb: Number.isFinite(item?.size) ? Math.round((item.size / 1e9) * 10) / 10 : null
      };
    }).filter(Boolean);
  }

  async function peticionSegura(url) {
    const r = await fetch(url, { signal: AbortSignal.timeout(2500), cache: 'no-store' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }

  async function ping(id) {
    const p = proveedor(id);
    for (const url of rutasModelos(p)) {
      try { return !!(await peticionSegura(url)); }
      catch (_) { /* probar la siguiente ruta */ }
    }
    return false;
  }

  async function listModels(id) {
    const p = proveedor(id || leerConfig().perfil);
    for (const url of rutasModelos(p)) {
      try {
        const modelos = normalizarModelos(await peticionSegura(url));
        if (modelos.length) return modelos;
      } catch (_) { /* probar la siguiente ruta */ }
    }
    return [];
  }

  async function perfilesDisponibles() {
    const resultados = await Promise.all(PROVEEDORES.map(async p => ({ id: p.id, ok: await ping(p.id) })));
    return resultados.filter(r => r.ok).map(r => r.id);
  }

  // ------------------------------------------------------------
  // Inferencia
  // ------------------------------------------------------------
  async function ask(messages, opts = {}) {
    const cfg = leerConfig();
    const id = opts.perfil || cfg.perfil;
    const p = proveedor(id);
    const modelo = opts.modelo || cfg.modelos[id] || '';

    if (!modelo) {
      const err = new Error('No hay ningún modelo seleccionado para este entorno');
      err.codigo = 'sin_modelo';
      throw err;
    }

    const base = baseUrl(p);
    const url = p.tipo === 'ollama'
      ? `${base}/v1/chat/completions`
      : `${base}/chat/completions`;

    let respuesta;
    try {
      respuesta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        signal: opts.signal,
        body: JSON.stringify({ model: modelo, messages, stream: false, temperature: 0.4 })
      });
    } catch (e) {
      const err = new Error(`No se pudo conectar con ${p.nombre}: ${e.message}`);
      err.codigo = 'red';
      throw err;
    }

    if (!respuesta.ok) {
      let detalle = '';
      try { detalle = (await respuesta.text()).slice(0, 160); } catch (_) { /* no-op */ }
      const err = new Error(`IA ${p.nombre} devolvió ${respuesta.status}${detalle ? ': ' + detalle : ''}`);
      err.codigo = respuesta.status === 404 ? 'modelo_no_disponible' : 'http';
      throw err;
    }

    let datos = null;
    try { datos = await respuesta.json(); } catch (_) { /* respuesta vacía */ }
    const texto = datos?.choices?.[0]?.message?.content;
    if (typeof texto !== 'string' || !texto.trim()) {
      const err = new Error('La IA devolvió una respuesta vacía');
      err.codigo = 'respuesta_vacia';
      throw err;
    }
    return texto.trim();
  }

  return {
    PROVEEDORES,
    STORAGE_KEY,
    leerConfig,
    configurar,
    proveedor,
    modeloActivo,
    limpiarCredencialesLegacy,
    normalizarModelos,
    listModels,
    perfilesDisponibles,
    ask,
    //-exportadas para tests unitarios
    _normalizarModelos: normalizarModelos,
    _rutasModelos: rutasModelos
  };
})();
