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

function convertirMoneda(valor, monedaOrigen) {
    if (!valor || isNaN(valor)) return 0;
    if (!monedaOrigen) {
        console.warn(' convertirMoneda: monedaOrigen undefined, devolviendo valor sin convertir');
        return valor;
    }
    const monedaBase = (typeof proyecto !== 'undefined' && proyecto?.monedaBase) || 'EUR';
    if (monedaOrigen === monedaBase) return valor;

    const tasas = (typeof tiposCambio !== 'undefined' && tiposCambio) || TASAS_POR_DEFECTO;
    let tasa = tasas[monedaOrigen];
    if (!tasa || tasa === 0) {
        tasa = TASAS_POR_DEFECTO[monedaOrigen];
        if (!tasa) {
            console.error(` No hay tasa para ${monedaOrigen}`);
            return valor;
        }
        if (typeof tiposCambio !== 'undefined') {
            tiposCambio[monedaOrigen] = tasa;
        }
    }
    return valor / tasa;
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

// Asignar al window para compatibilidad legacy
window.convertirMoneda = convertirMoneda;
window.formatearMoneda = formatearMoneda;
window.getMonedaSimbolo = getMonedaSimbolo;
window.calcularROI2 = calcularROI;
window.calcularVAN2 = calcularVAN;
window.calcularPayback2 = calcularPayback;
window.distribuirCostePorMeses = distribuirCostePorMeses;
