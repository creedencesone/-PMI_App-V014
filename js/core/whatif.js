// ============================================================
// core/whatif.js — Escenarios deterministas de compresión de cronograma.
// Complementa Monte Carlo con crashing y fast-tracking auditables.
// ============================================================

function simularEscenariosCompresion(proyectoParam, opciones) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null) || {};
    const opts = opciones || {};
    const elementos = (p.elementosGantt || []).filter(e => e && e.tipo !== 'edt' && Number(e.duracion) > 0);
    if (!elementos.length) return [];

    const pct = Math.min(0.8, Math.max(0.05, Number(opts.reduccion) || 0.2));
    const factorCoste = Math.max(0, Number(opts.factorCoste) || 1.5);
    const ref = () => ({ criticalPath: [], totalFloat: 0, makespan: 0, conCiclo: false });
    const evaluar = (lista, destino) => {
        if (typeof ejecutarCPM === 'function') {
            ejecutarCPM(lista.map(e => JSON.parse(JSON.stringify(e))), destino);
            if (!destino.conCiclo && destino.makespan > 0) return destino.makespan;
        }
        return lista.reduce((sum, e) => sum + (Number(e.duracion) || 0), 0);
    };

    const base = ref();
    const duracionBase = evaluar(elementos, base);
    const idsCriticos = new Set(base.criticalPath.length ? base.criticalPath.map(String) : elementos.map(e => String(e.id)));
    const criticas = elementos.filter(e => idsCriticos.has(String(e.id)));

    const crash = elementos.map(e => {
        const copia = JSON.parse(JSON.stringify(e));
        if (idsCriticos.has(String(copia.id))) copia.duracion = Math.max(0.5, Number(copia.duracion) * (1 - pct));
        return copia;
    });
    const costeExtra = criticas.reduce((sum, e) => {
        const ahorro = Number(e.duracion) - Math.max(0.5, Number(e.duracion) * (1 - pct));
        const costeDia = (Number(e.costeEstimado) || 0) / Math.max(0.5, Number(e.duracion));
        return sum + ahorro * costeDia * factorCoste;
    }, 0);

    const solape = Math.max(1, Math.round(pct * 10) / 2);
    const fast = elementos.map(e => {
        const copia = JSON.parse(JSON.stringify(e));
        if (idsCriticos.has(String(copia.id))) {
            copia.predecesores = (copia.predecesores || []).map(pr => {
                const tipo = String(pr.tipo || 'FS').trim().toUpperCase();
                return (tipo === 'FS' && idsCriticos.has(String(pr.id)))
                    ? { ...pr, tipo: 'SS', retraso: (Number(pr.retraso) || 0) - solape }
                    : pr;
            });
        }
        return copia;
    });

    const redondear = n => Math.round(n * 100) / 100;
    return [
        { id: 'baseline', nombre: 'Línea base', duracion: redondear(duracionBase), costeExtra: 0, riesgo: '—' },
        { id: 'crashing', nombre: 'Crashing (acelerar ruta crítica)', duracion: redondear(evaluar(crash, ref())), costeExtra: redondear(costeExtra), riesgo: 'Alto · más recursos' },
        { id: 'fast-tracking', nombre: 'Fast-tracking (solapar precedencias)', duracion: redondear(evaluar(fast, ref())), costeExtra: 0, riesgo: 'Medio · posible retrabajo' }
    ];
}

window.simularEscenariosCompresion = simularEscenariosCompresion;
