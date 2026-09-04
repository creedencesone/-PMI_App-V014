// ============================================================
// PMI Mind - Tests Unitarios (QUnit)
// ============================================================

QUnit.module('Fechas');

QUnit.test('esFinDeSemana', assert => {
    // 2026-07-17 = viernes
    assert.false(esFinDeSemana(new Date(2026, 6, 17)), 'viernes no es fin de semana');
    // 2026-07-18 = sábado
    assert.true(esFinDeSemana(new Date(2026, 6, 18)), 'sábado es fin de semana');
    // 2026-07-19 = domingo
    assert.true(esFinDeSemana(new Date(2026, 6, 19)), 'domingo es fin de semana');
    // 2026-07-20 = lunes
    assert.false(esFinDeSemana(new Date(2026, 6, 20)), 'lunes no es fin de semana');
});

QUnit.test('parseLocalDate / formatLocalDate roundtrip', assert => {
    const str = '2026-07-17';
    const d = parseLocalDate(str);
    assert.notNull(d, 'parseLocalDate devuelve Date');
    assert.equal(formatLocalDate(d), str, 'formatLocalDate restaura el string original');
});

QUnit.test('sumarDiasHabiles - suma días positivos', assert => {
    // viernes 2026-07-17 + 1 día hábil = lunes 2026-07-20
    assert.equal(sumarDiasHabiles('2026-07-17', 1), '2026-07-20', 'viernes+1→lunes');
    // viernes + 3 = miércoles
    assert.equal(sumarDiasHabiles('2026-07-17', 3), '2026-07-22', 'viernes+3→miércoles');
    // lunes + 5 = lunes siguiente
    assert.equal(sumarDiasHabiles('2026-07-20', 5), '2026-07-27', 'lunes+5→lunes');
});

QUnit.test('sumarDiasHabiles - resta días negativos', assert => {
    // lunes 2026-07-20 - 1 = viernes 2026-07-17
    assert.equal(sumarDiasHabiles('2026-07-20', -1), '2026-07-17', 'lunes-1→viernes');
    // lunes 2026-07-20 - 2 = viernes 2026-07-17 (mismo resultado, salta finde)
    assert.equal(sumarDiasHabiles('2026-07-20', -2), '2026-07-16', 'lunes-2→jueves');
});

QUnit.test('sumarDiasHabiles - fracciones < 1', assert => {
    assert.equal(sumarDiasHabiles('2026-07-17', 0.5), '2026-07-17', '0.5 día devuelve misma fecha');
    assert.equal(sumarDiasHabiles('2026-07-17', -0.5), '2026-07-17', '-0.5 día devuelve misma fecha');
});

QUnit.test('sumarDiasHabiles - string vacío / null', assert => {
    assert.equal(sumarDiasHabiles('', 1), '', 'string vacío devuelve vacío');
});

QUnit.test('sumarDiasHabiles - fracciones negativas (bug fix)', assert => {
    // -1.5 debe restar 2 días hábiles, no 1
    assert.equal(sumarDiasHabiles('2026-07-17', -1.5), '2026-07-15', '-1.5 desde viernes = miércoles');
    // -2.5 desde lunes = miércoles anterior (bajamos 3 días hábiles)
    assert.equal(sumarDiasHabiles('2026-07-20', -2.5), '2026-07-15', '-2.5 desde lunes = miércoles anterior');
});

QUnit.module('EVM');

QUnit.test('calcularCosteTotal', assert => {
    const convert = (val) => val;
    const gantt = [{ costeEstimado: 1000 }, { costeEstimado: 2000 }];
    const mats = [{ cantidad: 5, costeUnitario: 100, moneda: 'EUR' }];
    const serv = [{ cantidad: 2, costeUnitario: 300, moneda: 'EUR' }];
    const viajes = [{ costeVuelos: 500, costeHotel: 300, costeComidas: 100, costeTraslados: 100, moneda: 'EUR' }];
    assert.equal(calcularCosteTotal(gantt, mats, serv, viajes, convert), 4500, '1000+2000+500+600+1000');
});

QUnit.test('calcularCPI', assert => {
    assert.equal(calcularCPI(100, 80), 1.25, 'EV=100, AC=80 → CPI=1.25');
    assert.equal(calcularCPI(100, 100), 1, 'EV=100, AC=100 → CPI=1.0');
    assert.equal(calcularCPI(80, 100), 0.8, 'EV=80, AC=100 → CPI=0.8');
    assert.equal(calcularCPI(100, 0), Infinity, 'AC=0 → Infinity');
    assert.equal(calcularCPI(0, 0), 1, 'EV=0, AC=0 → 1');
});

QUnit.test('calcularSPI', assert => {
    assert.equal(calcularSPI(100, 100), 1, 'EV=100, PV=100 → SPI=1.0');
    assert.equal(calcularSPI(80, 100), 0.8, 'EV=80, PV=100 → SPI=0.8');
    assert.equal(calcularSPI(100, 0), Infinity, 'PV=0 → Infinity');
});

QUnit.test('calcularEAC', assert => {
    assert.equal(calcularEAC(100000, 1.25), 80000, 'BAC=100k, CPI=1.25 → EAC=80k');
    assert.equal(calcularEAC(100000, 0.8), 125000, 'BAC=100k, CPI=0.8 → EAC=125k');
    assert.equal(calcularEAC(100000, 1), 100000, 'BAC=100k, CPI=1 → EAC=100k');
    assert.equal(calcularEAC(100000, 0), 100000, 'CPI=0 → BAC');
});

QUnit.test('calcularVAC', assert => {
    assert.equal(calcularVAC(100000, 80000), 20000, 'BAC=100k, EAC=80k → VAC=20k');
});

QUnit.test('calcularEV', assert => {
    const elementos = [
        { costeEstimado: 1000, progreso: 100, tipo: 'tarea' },
        { costeEstimado: 2000, progreso: 50, tipo: 'tarea' },
        { costeEstimado: 500, progreso: 0, tipo: 'tarea' },
        { costeEstimado: 3000, progreso: 100, tipo: 'edt' } // debe excluirse
    ];
    assert.equal(calcularEV(elementos), 2000, '1000*1 + 2000*0.5 + 500*0 = 2000');
});

QUnit.module('ROI / VAN / Payback');

QUnit.test('calcularROI', assert => {
    assert.equal(calcularROI(150000, 100000), 50, 'precio=150k, coste=100k → 50%');
    assert.equal(calcularROI(100000, 100000), 0, 'precio=coste → 0%');
    assert.equal(calcularROI(80000, 100000), -20, 'precio=80k, coste=100k → -20%');
    assert.equal(calcularROI(50000, 0), 0, 'coste=0 → 0');
});

QUnit.test('calcularVAN', assert => {
    const flujos = [
        { mes: 12, valor: 50000 },
        { mes: 24, valor: 60000 }
    ];
    const van = calcularVAN(flujos, 0.1);
    assert.ok(van > 90000 && van < 100000, 'VAN aprox 95k con tasa 10%');
});

QUnit.test('calcularPayback', assert => {
    const meses = calcularPayback(120000, 60000);
    assert.equal(meses, 6, 'ingreso 10k/mes, coste 60k → 6 meses');
    assert.equal(calcularPayback(0, 60000, 60), 60, 'sin ingresos → max meses');
});

QUnit.module('Cashflow');

QUnit.test('distribuirCostePorMeses', assert => {
    const r = distribuirCostePorMeses(1000, 1, 4);
    assert.equal(Object.keys(r).length, 4, '4 meses');
    assert.equal(r[1], 250, 'mes 1 = 250');
    assert.equal(r[4], 250, 'mes 4 = 250');
    assert.equal(Object.values(r).reduce((a, b) => a + b, 0), 1000, 'suma total = 1000');
});

QUnit.test('distribuirCostePorMeses - duración 0', assert => {
    const r = distribuirCostePorMeses(500, 3, 0);
    assert.equal(r[3], 500, 'mes único');
});

QUnit.module('Ruta Crítica (CPM)');

QUnit.test('ejecutarCPM forward pass', assert => {
    const elements = [
        { id: 1, nombre: 'A', inicio: '2026-07-20', duracion: 3, predecesores: [], tipo: 'tarea' },
        { id: 2, nombre: 'B', inicio: '2026-07-20', duracion: 5, predecesores: [{ id: 1, tipo: 'FS' }], tipo: 'tarea' },
    ];
    const result = ejecutarCPM(elements);
    const b = result.find(e => e.id === 2);
    assert.ok(b._inicio > parseLocalDate('2026-07-22'), 'B empieza después de que A termine');
});
