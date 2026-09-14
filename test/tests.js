// ============================================================
// PMI Mind - Tests Unitarios (QUnit)
// ============================================================

if (typeof window === "undefined") {
    global.window = global;
    global.document = { addEventListener: function() {} };
    const fs = process.getBuiltinModule("fs");
    const path = process.getBuiltinModule("path");
    const vm = process.getBuiltinModule("vm");
    const base = path.join(process.cwd(), "js");
    ["core/dates.js", "core/evm.js", "core/finance.js", "core/ui.js", "panels/organigrama.js", "panels/gantt.js", "panels/panel-salud.js", "panels/panel-informe.js", "panels/financiero-monedas.js"].forEach(f => {
        vm.runInThisContext(fs.readFileSync(path.join(base, f), "utf8"), { filename: f });
    });
}

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
    assert.notEqual(d, null, 'parseLocalDate devuelve Date');
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
    assert.equal(calcularCosteTotal(gantt, mats, serv, viajes, convert), 5100, '1000+2000+500+600+1000');
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
    const a = result.find(e => e.id === 1);
    const b = result.find(e => e.id === 2);
    assert.equal(a._earlyFinish, 3, 'A termina en día 3 (offset)');
    assert.equal(b._earlyStart, a._earlyFinish, 'B (FS) empieza cuando A termina');
});

QUnit.module('Organigrama');

QUnit.test('organigramaCalcularNiveles - fixture de 2 niveles', assert => {
    const nodos = [
        { id: 1, stakeholderId: null, nombre: 'Ana', puesto: 'Jefa', email: 'ana@x.com', hijoDe: null },
        { id: 2, stakeholderId: null, nombre: 'Bruno', puesto: 'Sub', email: 'bruno@x.com', hijoDe: 1 },
        { id: 3, stakeholderId: null, nombre: 'Carla', puesto: 'Sub', email: 'carla@x.com', hijoDe: 1 },
    ];
    const niveles = organigramaCalcularNiveles(nodos);
    assert.equal(niveles[1], 0, 'raíz nivel 0');
    assert.equal(niveles[2], 1, 'hijo nivel 1');
    assert.equal(niveles[3], 1, 'hijo nivel 1');
});

QUnit.test('organigramaEsDescendiente', assert => {
    const nodos = [
        { id: 1, stakeholderId: null, nombre: 'Ana', puesto: 'Jefa', email: 'ana@x.com', hijoDe: null },
        { id: 2, stakeholderId: null, nombre: 'Bruno', puesto: 'Sub', email: 'bruno@x.com', hijoDe: 1 },
        { id: 3, stakeholderId: null, nombre: 'Carla', puesto: 'Sub', email: 'carla@x.com', hijoDe: 2 },
    ];
    assert.true(organigramaEsDescendiente(nodos, 1, 3), 'Carla es descendiente de Ana');
    assert.true(organigramaEsDescendiente(nodos, 2, 3), 'Carla es descendiente de Bruno');
    assert.false(organigramaEsDescendiente(nodos, 3, 1), 'Ana no es descendiente de Carla');
    assert.false(organigramaEsDescendiente(nodos, 1, 1), 'un nodo no es descendiente de sí mismo');
});

QUnit.test('organigramaValidarReparent - reparent válido', assert => {
    const nodos = [
        { id: 1, stakeholderId: null, nombre: 'Ana', puesto: 'Jefa', email: 'ana@x.com', hijoDe: null },
        { id: 2, stakeholderId: null, nombre: 'Bruno', puesto: 'Sub', email: 'bruno@x.com', hijoDe: null },
    ];
    assert.deepEqual(organigramaValidarReparent(nodos, 2, 1), { ok: true }, 'mover Bruno bajo Ana');
    assert.deepEqual(organigramaValidarReparent(nodos, 2, null), { ok: true }, 'mover a raíz');
});

QUnit.test('organigramaValidarReparent - self', assert => {
    const nodos = [
        { id: 1, stakeholderId: null, nombre: 'Ana', puesto: 'Jefa', email: 'ana@x.com', hijoDe: null },
    ];
    assert.deepEqual(organigramaValidarReparent(nodos, 1, 1), { ok: false, error: 'self' }, 'auto-padre rechazado');
});

QUnit.test('organigramaValidarReparent - ciclo A→B y B→A', assert => {
    const nodos = [
        { id: 1, stakeholderId: null, nombre: 'Ana', puesto: 'Jefa', email: 'ana@x.com', hijoDe: 2 },
        { id: 2, stakeholderId: null, nombre: 'Bruno', puesto: 'Sub', email: 'bruno@x.com', hijoDe: null },
    ];
    assert.deepEqual(organigramaValidarReparent(nodos, 2, 1), { ok: false, error: 'descendant' }, 'Bruno bajo Ana crearía ciclo');
});

QUnit.test('organigramaValidarReparent - notfound', assert => {
    const nodos = [
        { id: 1, stakeholderId: null, nombre: 'Ana', puesto: 'Jefa', email: 'ana@x.com', hijoDe: null },
    ];
    assert.deepEqual(organigramaValidarReparent(nodos, 99, 1), { ok: false, error: 'notfound' }, 'nodo inexistente rechazado');
});

QUnit.test('organigramaReparentarAlEliminar - elimina y reparenta hijos', assert => {
    const nodos = [
        { id: 1, stakeholderId: null, nombre: 'Ana', puesto: 'Jefa', email: 'ana@x.com', hijoDe: null },
        { id: 2, stakeholderId: null, nombre: 'Bruno', puesto: 'Sub', email: 'bruno@x.com', hijoDe: 1 },
        { id: 3, stakeholderId: null, nombre: 'Carla', puesto: 'Sub', email: 'carla@x.com', hijoDe: 1 },
        { id: 4, stakeholderId: null, nombre: 'David', puesto: 'Sub2', email: 'david@x.com', hijoDe: 2 },
    ];
    const resultado = organigramaReparentarAlEliminar(nodos, 2);
    assert.equal(resultado.length, 3, 'nodo eliminado');
    assert.false(resultado.some(n => n.id === 2), 'Bruno ya no existe');
    assert.equal(resultado.find(n => n.id === 4).hijoDe, 1, 'David reparentado bajo Ana');
    assert.equal(nodos.length, 4, 'input intacto');
    assert.equal(nodos.find(n => n.id === 4).hijoDe, 2, 'input sin mutar');
});

QUnit.test('organigramaLimpiarStakeholder - elimina vinculados y preserva el árbol', assert => {
    const nodos = [
        { id: 1, stakeholderId: 10, nombre: 'Ana', puesto: 'Jefa', email: 'ana@x.com', hijoDe: null },
        { id: 2, stakeholderId: 20, nombre: 'Bruno', puesto: 'Sub', email: 'bruno@x.com', hijoDe: 1 },
        { id: 3, stakeholderId: 10, nombre: 'Carla', puesto: 'Sub', email: 'carla@x.com', hijoDe: 2 },
        { id: 4, stakeholderId: 30, nombre: 'David', puesto: 'Sub2', email: 'david@x.com', hijoDe: 3 },
    ];
    const resultado = organigramaLimpiarStakeholder(nodos, 10);
    assert.equal(resultado.length, 2, 'dos nodos eliminados');
    assert.false(resultado.some(n => n.stakeholderId === 10), 'sin nodos con stakeholder 10');
    assert.equal(resultado.find(n => n.id === 2).hijoDe, null, 'Bruno reparentado a raíz');
    assert.equal(resultado.find(n => n.id === 4).hijoDe, 2, 'David reparentado bajo Bruno');
    assert.equal(nodos.length, 4, 'input intacto');
});

QUnit.test('organigramaRemapearStakeholder - intercambia ids', assert => {
    const nodos = [
        { id: 1, stakeholderId: 10, nombre: 'Ana', puesto: 'Jefa', email: 'ana@x.com', hijoDe: null },
        { id: 2, stakeholderId: 20, nombre: 'Bruno', puesto: 'Sub', email: 'bruno@x.com', hijoDe: 1 },
    ];
    const resultado = organigramaRemapearStakeholder(nodos, 10, 99);
    assert.equal(resultado.find(n => n.id === 1).stakeholderId, 99, 'stakeholder 10 remapeado a 99');
    assert.equal(resultado.find(n => n.id === 2).stakeholderId, 20, 'otros nodos intactos');
    assert.equal(nodos.find(n => n.id === 1).stakeholderId, 10, 'input intacto');
});

QUnit.module('G-B costes');

QUnit.test('filtrarElementosGantt filtra por nombre y tipo case-insensitive', assert => {
    const elementos = [{nombre:'Hito A'},{nombre:'Pruebas'},{tipo:'hito', nombre:'EDT'}];
    assert.equal(filtrarElementosGantt(elementos, 'hi').length, 2, 'Hito A (nombre) + EDT (tipo hito)');
    assert.equal(filtrarElementosGantt(elementos, 'prue').length, 1, 'Pruebas');
    assert.equal(filtrarElementosGantt(elementos, '').length, 3, 'query vacía devuelve todo');
});

QUnit.test('calcularCosteRecursosProyecto salta materiales sprint-asociados en ágil', assert => {
    const proyecto = {elementosGantt:[{costeEstimado:100}], materiales:[{cantidad:2,costeUnitario:50,moneda:'EUR',sprint:1}], servicios:[], viajes:[]};
    assert.equal(calcularCosteRecursosProyecto(proyecto, true), 100, 'ágil: salta material sprint:1');
    assert.equal(calcularCosteRecursosProyecto(proyecto, false), 200, 'no ágil: incluye material');
});

QUnit.test('calcularTasasFijas suma solo tasas fijas una vez', assert => {
    const proyecto = {tasasAduanerasFijas:[{tipo:'fijo',valor:150,moneda:'EUR'},{tipo:'porcentaje',valor:5}]};
    assert.equal(calcularTasasFijas(proyecto), 150, '1 fija de 150, ignora porcentaje');
});

QUnit.test('calcularCosteAgileTotalInforme suma historias con sprintId', assert => {
    const proyecto = {scrum:{historias:[{sprintId:'s1',costeEstimado:100},{sprintId:'s2',costeEstimado:50},{sprintId:null,costeEstimado:999}],sprints:[{id:'s1'},{id:'s2'}]},monedaBase:'EUR'};
    assert.equal(calcularCosteAgileTotalInforme(proyecto), 150, 'salta la sin sprintId');
});
