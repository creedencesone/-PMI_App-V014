// ============================================================
// core/finance.js — Cálculos financieros y monedas
// ============================================================

const TASAS_POR_DEFECTO = {
    EUR:1, USD:1.1603, GBP:0.858, JPY:178.482, CHF:0.9465,
    BRL:5.9218, MXN:19.683, COP:3608.9243, ARS:1751.9618, CLP:1089.0409,
    DZD:154.7319, CDF:2683.3008, MZN:74.3037, ZAR:18.7189,
    NGN:1582.1055, KES:150.4795, EGP:59.5726, MAD:10.9132,
    PEN:3.9008, BOB:14.6552, UYU:46.8129, PYG:6862.2429,
    GHS:13.2637, TND:3.3782, ETB:188.6609, TZS:3069.14, UGX:4362.6583,
    RWF:1714.9784, AOA:1104.1025, XOF:655.957, XAF:655.957,
    ZMW:22.2952, BWP:16.3762, MUR:54.3755
};

function _tasaMoneda(moneda) {
    const tasas = (typeof tiposCambio !== 'undefined' && tiposCambio) || TASAS_POR_DEFECTO;
    let tasa = tasas[moneda];
    if (!tasa || !isFinite(tasa) || tasa <= 0) {
        tasa = TASAS_POR_DEFECTO[moneda];
        if (typeof tiposCambio !== 'undefined' && tasa) tiposCambio[moneda] = tasa;
    }
    return tasa;
}

/** Convierte cualquier moneda a la moneda base proyectual: valor / tasa[origen] × tasa[base]. */
function aBase(valor, monedaOrigen, monedaBase) {
    const numero = Number(valor);
    if (!isFinite(numero)) return 0;
    const base = monedaBase || (typeof proyecto !== 'undefined' && proyecto?.monedaBase) || 'EUR';
    const origen = monedaOrigen || base;
    if (origen === base) return numero;
    const tasaOrigen = _tasaMoneda(origen);
    const tasaBase = _tasaMoneda(base);
    if (!tasaOrigen || !tasaBase) {
        console.warn(` aBase: sin tasa para ${origen} → ${base}; se devuelve el valor sin convertir`);
        return numero;
    }
    return numero / tasaOrigen * tasaBase;
}

function convertirMoneda(valor, monedaOrigen, monedaBase) {
    const numero = Number(valor);
    if (!isFinite(numero)) return 0;
    if (!monedaOrigen) {
        console.warn(' convertirMoneda: monedaOrigen undefined, devolviendo valor sin convertir');
        return numero;
    }
    return aBase(numero, monedaOrigen, monedaBase);
}

/** Ingreso/precio de venta expresado siempre en moneda base. */
function precioVentaEnBase(proyectoParam) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    if (!p) return 0;
    const monedaImporte = p.monedaVenta || p.monedaBase || 'EUR';
    return aBase(Number(p.precioVenta) || 0, monedaImporte, p.monedaBase || 'EUR');
}

const SIMBOLOS_MONEDA = {
    EUR:'€', USD:'$', GBP:'£', JPY:'¥', CHF:'₣',
    BRL:'R$', MXN:'Mex$', COP:'COL$', ARS:'ARS$', CLP:'CLP$',
    DZD:'دج', CDF:'FC', MZN:'MT', ZAR:'R',
    NGN:'₦', KES:'KSh', EGP:'E£', MAD:'د.م.',
    PEN:'S/', BOB:'Bs', UYU:'$U', PYG:'₲',
    GHS:'GH₵', TND:'د.ت', ETB:'Br', TZS:'TSh', UGX:'USh',
    RWF:'FRw', AOA:'Kz', XOF:'CFA', XAF:'FCFA',
    ZMW:'ZK', BWP:'P', MUR:'₨'
};

function formatearMoneda(valor, monedaBase) {
    if (valor === undefined || valor === null || isNaN(valor)) return '0,00 €';
    const moneda = monedaBase || (typeof proyecto !== 'undefined' && proyecto?.monedaBase) || 'EUR';
    const simbolo = SIMBOLOS_MONEDA[moneda] || moneda;
    return valor.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' ' + simbolo;
}

function getMonedaSimbolo(moneda) {
    return SIMBOLOS_MONEDA[moneda] || moneda;
}

function calcularROI(precioVenta, costeTotal) {
    return costeTotal > 0 ? ((precioVenta - costeTotal) / costeTotal * 100) : 0;
}

function calcularVAN(flujos, tasaDescuento = 0.1) {
    let van = 0;
    (flujos || []).forEach(f => {
        van += f.valor / Math.pow(1 + tasaDescuento, (f.mes || 1) / 12);
    });
    return van;
}

function calcularPayback(precioVenta, costeTotal, maxMeses = 60) {
    if (precioVenta <= 0) return maxMeses;
    const ingresoMensual = precioVenta / 12;
    let acumulado = 0, meses = 0;
    while (acumulado < costeTotal && meses < maxMeses) {
        meses++;
        acumulado += ingresoMensual;
    }
    return meses;
}

function distribuirCostePorMeses(coste, mesInicio, duracionMeses) {
    const meses = Math.max(1, Math.ceil(duracionMeses));
    const porMes = coste / meses;
    const resultado = {};
    for (let i = 0; i < meses; i++) {
        const m = mesInicio + i;
        resultado[m] = (resultado[m] || 0) + porMes;
    }
    return resultado;
}

function convertirEntreMonedas(valor, monedaOrigen, monedaDestino) {
    const numero = Number(valor);
    if (!isFinite(numero)) return 0;
    const base = (typeof proyecto !== 'undefined' && proyecto?.monedaBase) || 'EUR';
    const origen = monedaOrigen || base;
    const destino = monedaDestino || base;
    if (origen === destino) return numero;
    const enBase = aBase(numero, origen, base);
    if (destino === base) return enBase;
    const tasaDestino = _tasaMoneda(destino);
    const tasaBase = _tasaMoneda(base);
    return tasaBase && tasaDestino ? enBase * tasaDestino / tasaBase : enBase;
}

// Asignar al window para compatibilidad legacy
window.aBase = aBase;
window.convertirMoneda = convertirMoneda;
window.convertirEntreMonedas = convertirEntreMonedas;
window.precioVentaEnBase = precioVentaEnBase;
window.formatearMoneda = formatearMoneda;
window.getMonedaSimbolo = getMonedaSimbolo;
window.calcularROI2 = calcularROI;
window.calcularVAN2 = calcularVAN;
window.calcularPayback2 = calcularPayback;
window.distribuirCostePorMeses = distribuirCostePorMeses;
