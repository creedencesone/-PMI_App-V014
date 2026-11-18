// ============================================================
// core/wbs.js — Numeración WBS, detección de ciclos y línea base de alcance
// ============================================================

/** Devuelve los ids que participan en un ciclo del campo indicado. */
function detectarCiclosWBS(elementos, campo) {
    const clave = campo || 'dependeDe';
    const porId = new Map((elementos || []).filter(Boolean).map(e => [e.id, e]));
    const estado = new Map();
    const ciclos = new Set();

    function visitar(id, pila) {
        if (estado.get(id) === 'negro') return;
        if (estado.get(id) === 'gris') {
            const desde = pila.indexOf(id);
            (desde >= 0 ? pila.slice(desde) : [id]).forEach(x => ciclos.add(x));
            return;
        }
        estado.set(id, 'gris');
        pila.push(id);
        const actual = porId.get(id);
        const valor = actual ? actual[clave] : null;
        const padres = Array.isArray(valor) ? valor.map(p => (p && p.id != null ? p.id : p)).filter(Boolean) : (valor ? [valor] : []);
        padres.forEach(padre => { if (porId.has(padre)) visitar(padre, pila); });
        pila.pop();
        estado.set(id, 'negro');
    }

    porId.forEach((_, id) => visitar(id, []));
    return [...ciclos];
}

/** ¿es ancestorId ascendiente de descendantId por el campo indicado? */
function esAncestroWBS(ancestorId, descendantId, elementos, campo) {
    const clave = campo || 'dependeDe';
    const porId = new Map((elementos || []).filter(Boolean).map(e => [e.id, e]));
    const vistos = new Set();
    const pendientes = [descendantId];
    while (pendientes.length) {
        const actualId = pendientes.shift();
        if (actualId === ancestorId && actualId !== descendantId) return true;
        if (vistos.has(actualId)) continue;
        vistos.add(actualId);
        const actual = porId.get(actualId);
        if (!actual) continue;
        const valor = actual[clave];
        const padres = Array.isArray(valor) ? valor.map(p => (p && p.id != null ? p.id : p)).filter(Boolean) : (valor ? [valor] : []);
        padres.forEach(p => { if (!vistos.has(p)) pendientes.push(p); });
    }
    return false;
}

/** Crear esta relación cerraría un ciclo. */
function creariaCicloWBS(elementos, hijoId, padreId, campo) {
    if (hijoId === padreId) return true;
    return esAncestroWBS(hijoId, padreId, elementos, campo);
}

/** Profundidad segura: nunca cuelga aunque exista un ciclo. */
function calcularProfundidadSegura(id, elementos, campo) {
    const clave = campo || 'dependeDe';
    const porId = new Map((elementos || []).filter(Boolean).map(e => [e.id, e]));
    const vistos = new Set([id]);
    let depth = 0;
    let actual = porId.get(id);
    while (actual && actual[clave] && !vistos.has(actual[clave])) {
        vistos.add(actual[clave]);
        depth++;
        actual = porId.get(actual[clave]);
    }
    return depth;
}

/**
 * Genera códigos WBS únicos para todos los elementos.
 * EDT: 1, 1.1, 1.1.1… · Actividades: 1.A1 · Entregables: 1.E1 · Hitos: 1.H1.
 * Los elementos en ciclo reciben un código de diagnóstico y no se promocionan a raíz.
 */
function generarCodigosWBS(elementos) {
    const lista = (elementos || []).filter(Boolean);
    // Los IDs importados pueden repetirse. Se deriva una clave interna única
    // para que ningún elemento comparta código WBS.
    const conteo = new Map();
    lista.forEach(e => conteo.set(e.id, (conteo.get(e.id) || 0) + 1));
    const vistosId = new Map();
    const claveDe = e => {
        const n = conteo.get(e.id) || 1;
        if (n === 1) return String(e.id);
        const i = (vistosId.get(e.id) || 0) + 1;
        vistosId.set(e.id, i);
        return `${e.id}#${i}`;
    };
    const claves = new Map(lista.map(e => [e, claveDe(e)]));
    const primeraClave = new Map();
    claves.forEach((clave, e) => { if (!primeraClave.has(e.id)) primeraClave.set(e.id, clave); });
    const clavePadre = e => (e.dependeDe == null ? null : (primeraClave.get(e.dependeDe) || String(e.dependeDe)));
    const ciclos = new Set(detectarCiclosWBS(lista, 'dependeDe').map(id => primeraClave.get(id) || String(id)));
    const codigos = new Map();
    const prefijos = { actividad: 'A', entregable: 'E', hito: 'H' };

    function hijosDe(clavePadreId, tipo) {
        return lista.filter(e => clavePadre(e) === clavePadreId &&
            (tipo === null || e.tipo === tipo) && !ciclos.has(claves.get(e)));
    }

    function asignarEdt(clave, prefijo, vistos) {
        if (vistos.has(clave)) return;
        vistos.add(clave);
        codigos.set(clave, prefijo);
        hijosDe(clave, 'edt').forEach((hijo, i) => asignarEdt(claves.get(hijo), `${prefijo}.${i + 1}`, vistos));
        Object.keys(prefijos).forEach(tipo => {
            hijosDe(clave, tipo).forEach((hijo, i) => {
                codigos.set(claves.get(hijo), `${prefijo}.${prefijos[tipo]}${i + 1}`);
            });
        });
    }

    lista.filter(e => e.tipo === 'edt' && !ciclos.has(claves.get(e)))
        .filter(e => {
            const pc = clavePadre(e);
            return !pc || !lista.some(x => claves.get(x) === pc && x.tipo === 'edt') || ciclos.has(pc);
        })
        .forEach((edt, i) => asignarEdt(claves.get(edt), String(i + 1), new Set()));

    lista.filter(e => e.tipo !== 'edt' && !ciclos.has(claves.get(e)))
        .filter(e => {
            const pc = clavePadre(e);
            return !pc || !lista.some(x => claves.get(x) === pc && x.tipo === 'edt');
        })
        .forEach(e => { /* se asignan junto a su EDT padre */ });
    Object.keys(prefijos).forEach(tipo => {
        lista.filter(e => e.tipo === tipo && !ciclos.has(claves.get(e)) && !codigos.has(claves.get(e)))
            .forEach((e, i) => codigos.set(claves.get(e), `${prefijos[tipo]}${i + 1}`));
    });

    ciclos.forEach(clave => codigos.set(clave, `CICLO-${clave.replace('#', '-')}`));
    lista.forEach(e => {
        const clave = claves.get(e);
        if (!codigos.has(clave)) codigos.set(clave, `ID-${clave}`);
    });
    const porElemento = new Map(lista.map(e => [e, codigos.get(claves.get(e))]));
    // Compatibilidad: la API histórica consultaba por id (válido si no hay duplicados).
    lista.forEach(e => { if (conteo.get(e.id) === 1) porElemento.set(e.id, porElemento.get(e)); });
    const idsCiclo = [...new Set(lista.filter(e => ciclos.has(claves.get(e))).map(e => e.id))];
    return { codigos: porElemento, ciclos: idsCiclo };
}

function aplicarCodigosWBS(elementos) {
    const resultado = generarCodigosWBS(elementos);
    (elementos || []).forEach(e => {
        if (e && resultado.codigos.has(e)) e.codigo = resultado.codigos.get(e);
    });
    return resultado;
}

/** Snapshot inmutable de alcance para la línea base. */
function crearScopeBaseline(elementos, cambiosAprobados) {
    // Snapshot inmutable: no se muta el array que recibe el llamador.
    const snapshot = (elementos || []).map(e => JSON.parse(JSON.stringify(e)));
    const resultado = aplicarCodigosWBS(snapshot);
    return {
        version: Date.now(),
        fecha: new Date().toISOString(),
        codigos: snapshot.map(e => ({ id: e.id, codigo: e.codigo, nombre: e.nombre, tipo: e.tipo })),
        cambiosAprobados: (cambiosAprobados || []).map(c => ({ id: c.id, descripcion: c.descripcion, estado: c.estado })),
        ciclos: resultado.ciclos,
        snapshot: snapshot
    };
}

/** Diff de alcance: altas, bajas y cambios de código/nombre. */
function compararScopeBaseline(elementos, snapshot) {
    const actuales = new Map((elementos || []).map(e => [e.id, e]));
    const base = new Map(((snapshot && snapshot.codigos) || []).map(e => [e.id, e]));
    const altas = [], bajas = [], cambios = [];
    base.forEach((b, id) => {
        const a = actuales.get(id);
        if (!a) { bajas.push(b); return; }
        if (a.codigo !== b.codigo || a.nombre !== b.nombre) {
            cambios.push({ id, antes: { codigo: b.codigo, nombre: b.nombre }, despues: { codigo: a.codigo, nombre: a.nombre } });
        }
    });
    actuales.forEach((a, id) => { if (!base.has(id)) altas.push({ id, codigo: a.codigo, nombre: a.nombre, tipo: a.tipo }); });
    return { altas, bajas, cambios, total: altas.length + bajas.length + cambios.length };
}

/** Compara dos snapshots de alcance, en forma de array o de objeto `{ codigos }`. */
function compararSnapshotsScope(actual, anterior) {
    const elementos = Array.isArray(actual) ? actual : ((actual && actual.codigos) || []);
    const snapshot = anterior && Array.isArray(anterior) ? { codigos: anterior } : anterior;
    return compararScopeBaseline(elementos, snapshot);
}

// Compatibilidad con módulos cargados como scripts clásicos
window.WbsCodeService = {
    detectarCiclos: detectarCiclosWBS,
    esAncestro: esAncestroWBS,
    creariaCiclo: creariaCicloWBS,
    profundidad: calcularProfundidadSegura,
    generar: generarCodigosWBS,
    aplicar: aplicarCodigosWBS,
    crearSnapshot: crearScopeBaseline,
    comparar: compararScopeBaseline,
    compararSnapshots: compararSnapshotsScope
};
window.detectarCiclosWBS = detectarCiclosWBS;
window.creariaCicloWBS = creariaCicloWBS;
window.generarCodigosWBS = generarCodigosWBS;
window.aplicarCodigosWBS = aplicarCodigosWBS;
window.calcularProfundidadSegura = calcularProfundidadSegura;
window.crearScopeBaseline = crearScopeBaseline;
window.compararScopeBaseline = compararScopeBaseline;
window.compararSnapshotsScope = compararSnapshotsScope;
