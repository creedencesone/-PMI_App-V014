// ============================================================
// core/finance.js — Cálculos financieros y monedas
// ============================================================

const TASAS_POR_DEFECTO = {
    EUR:1, USD:1.09, GBP:0.86, JPY:164, CHF:0.95,
    BRL:5.45, MXN:18.25, COP:4190, ARS:950, CLP:920,
    DZD:134, CDF:2800, MZN:64, ZAR:18.5,
    NGN:1500, KES:140, EGP:48, MAD:10.8,
    PEN:3.72, BOB:6.91, UYU:42.5, PYG:7350,
    GHS:11.5, TND:3.3, ETB:115, TZS:2700, UGX:4000,
    RWF:1380, AOA:900, XOF:655.96, XAF:655.96,
    ZMW:24.5, BWP:13.5, MUR:48
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
