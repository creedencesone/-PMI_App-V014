// ============================================================
// PMI Mind - Tests Unitarios (QUnit)
// ============================================================

if (typeof window === "undefined") {
    global.window = global;
    global.document = { addEventListener: function() {} };
    // localStorage mínimo para módulos que leen configuración al cargarse.
    if (typeof global.localStorage === "undefined") {
        const almacen = new Map();
        global.localStorage = {
            getItem: k => almacen.has(k) ? almacen.get(k) : null,
            setItem: (k, v) => almacen.set(k, String(v)),
            removeItem: k => almacen.delete(k),
            clear: () => almacen.clear()
        };
    }
    const fs = process.getBuiltinModule("fs");
    const path = process.getBuiltinModule("path");
    const vm = process.getBuiltinModule("vm");
    const base = path.join(process.cwd(), "js");
    ["core/dates.js", "core/csv.js", "core/whatif.js", "core/evm.js", "core/finance.js", "core/wbs.js", "core/audit.js", "core/ui.js", "core/collections.js", "services/LocalAIService.js", "panels/organigrama.js", "panels/gantt.js", "panels/carga-trabajo.js", "panels/panel-salud.js", "panels/panel-informe.js", "panels/financiero-monedas.js", "panels/montecarlo.js", "panels/riesgos.js", "panels/scrum.js", "core/linea-base.js", "core/raci.js", "panels/cierre.js", "panels/import-export.js", "panels/requisitos.js", "panels/beneficios-cambios-lecciones.js"].forEach(f => {
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
    assert.strictEqual(calcularEAC(100000, 0), null, 'CPI=0 → sin base de pronóstico');
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

// ============================================================
QUnit.module('Dedupe');

QUnit.test('dedupeDomainRows deduplicates by data.id, first wins', assert => {
    const rows = [
        { id: 'r1', organization_id: 'o1', project_id: 'p1', data: { id: 'h1', nombre: 'A' } },
        { id: 'r2', organization_id: 'o1', project_id: 'p1', data: { id: 'h1', nombre: 'A-dup' } },
        { id: 'r3', organization_id: 'o1', project_id: 'p1', data: { id: 'h2', nombre: 'B' } },
    ];
    const result = dedupeDomainRows(rows);
    assert.equal(result.length, 2, '2 unique data.id values → 2 rows');
    assert.equal(result[0].data.nombre, 'A', 'first occurrence kept');
    assert.equal(result[1].data.nombre, 'B', 'second unique kept');
});

QUnit.test('dedupeDomainRows preserves order = first occurrence', assert => {
    const rows = [
        { id: 'a', data: { id: 'x' } },
        { id: 'b', data: { id: 'y' } },
        { id: 'c', data: { id: 'x' } },
        { id: 'd', data: { id: 'y' } },
    ];
    const result = dedupeDomainRows(rows);
    assert.equal(result.length, 2, '2 unique ids');
    assert.equal(result[0].id, 'a', 'first x occurrence');
    assert.equal(result[1].id, 'b', 'first y occurrence');
});

QUnit.test('dedupeDomainRows preserves rows without data.id', assert => {
    const rows = [
        { id: 'a', data: null },
        { id: 'b', data: { id: 'h1' } },
        { id: 'c', data: undefined },
        { id: 'd', data: { id: 'h1' } },
    ];
    const result = dedupeDomainRows(rows);
    assert.equal(result.length, 3, 'null data + undefined data + 1 unique h1');
});

QUnit.test('dedupeDomainRows passthrough for non-array', assert => {
    assert.deepEqual(dedupeDomainRows(null), null, 'null passthrough');
    assert.deepEqual(dedupeDomainRows('foo'), 'foo', 'string passthrough');
});

QUnit.test('dedupeById deduplicates by top-level id, first wins', assert => {
    const items = [
        { id: '1', value: 'A' },
        { id: '1', value: 'A-dup' },
        { id: '2', value: 'B' },
    ];
    const result = dedupeById(items);
    assert.equal(result.length, 2, '2 unique ids');
    assert.equal(result[0].value, 'A', 'first occurrence kept');
    assert.equal(result[1].value, 'B', 'second unique kept');
});

QUnit.test('dedupeById preserves items without id', assert => {
    const items = [
        { id: 1 },
        { noId: true },
        { id: 1 },
    ];
    const result = dedupeById(items);
    assert.equal(result.length, 2, '1 unique id + 1 noId item');
    assert.equal(result[1].noId, true, 'noId item preserved');
});

QUnit.test('dedupeById passthrough for non-array', assert => {
    assert.deepEqual(dedupeById(undefined), undefined, 'undefined passthrough');
    assert.deepEqual(dedupeById(42), 42, 'number passthrough');
});

QUnit.module('Cache');

QUnit.test('seleccionarProyectosACachear keeps current + max most-recent', assert => {
    const now = Date.now();
    const projects = [
        { id: 'a', _serverUpdatedAt: now - 1000 },
        { id: 'b', _serverUpdatedAt: now - 2000 },
        { id: 'c', _serverUpdatedAt: now - 500 },
        { id: 'd', _serverUpdatedAt: now - 3000 },
    ];
    const result = seleccionarProyectosACachear(projects, 'b', 2);
    assert.equal(result.length, 3, '1 kept + 2 max = 3');
    assert.equal(result[0].id, 'b', 'kept project is first');
    assert.equal(result[1].id, 'c', 'most recent after kept');
    assert.equal(result[2].id, 'a', 'second most recent');
});

QUnit.test('seleccionarProyectosACachear ordering by _serverUpdatedAt', assert => {
    const projects = [
        { id: 'x', _serverUpdatedAt: '2026-01-01T00:00:00Z' },
        { id: 'y', _serverUpdatedAt: '2026-06-01T00:00:00Z' },
        { id: 'z', _serverUpdatedAt: '2026-03-01T00:00:00Z' },
    ];
    const result = seleccionarProyectosACachear(projects, 'x', 2);
    assert.equal(result.length, 3, 'kept + 2 = 3');
    assert.equal(result[0].id, 'x', 'kept first');
    assert.equal(result[1].id, 'y', 'most recent ISO string');
    assert.equal(result[2].id, 'z', 'second most recent ISO string');
});

QUnit.test('seleccionarProyectosACachear ordering by updated_at fallback', assert => {
    const projects = [
        { id: 'a', updated_at: 100 },
        { id: 'b', updated_at: 300 },
        { id: 'c', updated_at: 200 },
    ];
    const result = seleccionarProyectosACachear(projects, 'b', 1);
    assert.equal(result.length, 2, 'kept + 1 = 2');
    assert.equal(result[0].id, 'b', 'kept first');
    assert.equal(result[1].id, 'c', 'most recent by updated_at');
});

QUnit.test('seleccionarProyectosACachear keeps current even if oldest', assert => {
    const projects = [
        { id: 'old', updated_at: 1 },
        { id: 'mid', updated_at: 10 },
        { id: 'new', updated_at: 100 },
    ];
    const result = seleccionarProyectosACachear(projects, 'old', 1);
    assert.equal(result.length, 2, 'kept + 1 = 2');
    assert.equal(result[0].id, 'old', 'oldest is kept');
    assert.equal(result[1].id, 'new', 'most recent fills slot');
});

QUnit.test('seleccionarProyectosACachear non-array passthrough', assert => {
    assert.deepEqual(seleccionarProyectosACachear(undefined, 'a'), undefined);
    assert.deepEqual(seleccionarProyectosACachear(null, 'a'), null);
    assert.deepEqual(seleccionarProyectosACachear(42, 'a'), 42);
});

QUnit.test('seleccionarProyectosACachear default max = 5', assert => {
    const projects = Array.from({ length: 8 }, (_, i) => ({ id: String(i), updated_at: i }));
    const result = seleccionarProyectosACachear(projects, '0');
    assert.equal(result.length, 6, '1 kept + default 5 = 6');
    assert.equal(result[0].id, '0', 'kept first');
});

QUnit.test('seleccionarProyectosACachear result length cap with keepId absent', assert => {
    const projects = Array.from({ length: 10 }, (_, i) => ({ id: String(i), updated_at: i }));
    const result = seleccionarProyectosACachear(projects, 'nonexistent', 3);
    assert.equal(result.length, 3, 'no keep match → just max items');
});


// ============================================================
// Monte Carlo — red y makespan (Ciclo 2, ENG-03)
// ============================================================
QUnit.module('Monte Carlo');

QUnit.test('_ordenTopologico ordena dependencias FS', assert => {
    const tareas = [
        { id: 'c', predecesores: [{ id: 'b', tipo: 'FS' }] },
        { id: 'a', predecesores: [] },
        { id: 'b', predecesores: [{ id: 'a', tipo: 'FS' }] }
    ];
    const res = _ordenTopologico(tareas);
    assert.false(res.conCiclo, 'sin ciclo');
    assert.deepEqual(res.orden, ['a', 'b', 'c'], 'orden topológico');
});

QUnit.test('_makespanRed respeta FS y SS', assert => {
    const porId = {
        a: { id: 'a', predecesores: [] },
        b: { id: 'b', predecesores: [{ id: 'a', tipo: 'FS', retraso: 0 }] },
        c: { id: 'c', predecesores: [{ id: 'b', tipo: 'FS', retraso: 0 }] }
    };
    const dur = { a: 5, b: 5, c: 5 };
    const orden = ['a', 'b', 'c'];
    assert.strictEqual(_makespanRed(orden, porId, dur), 15, 'FS: 5+5+5');

    porId.b.predecesores = [{ id: 'a', tipo: 'SS', retraso: 0 }];
    porId.c.predecesores = [{ id: 'b', tipo: 'SS', retraso: 0 }];
    assert.strictEqual(_makespanRed(orden, porId, dur), 5, 'SS: paralelo');
});

QUnit.test('_makespanRed aplica retraso (lag)', assert => {
    const porId = {
        a: { id: 'a', predecesores: [] },
        b: { id: 'b', predecesores: [{ id: 'a', tipo: 'FS', retraso: 3 }] }
    };
    assert.strictEqual(_makespanRed(['a', 'b'], porId, { a: 5, b: 2 }), 10, '5 + 3 + 2');
});


// ============================================================
// Riesgos — EMV y normalización (Ciclo 2, ENG-04)
// ============================================================
QUnit.module('Riesgos');

QUnit.test('nivelRiesgo usa umbrales 20/12/6', assert => {
    assert.strictEqual(nivelRiesgo(20), 'Crítico');
    assert.strictEqual(nivelRiesgo(12), 'Alto');
    assert.strictEqual(nivelRiesgo(6), 'Medio');
    assert.strictEqual(nivelRiesgo(5), 'Bajo');
});

QUnit.test('normalizarEstadoRiesgo unifica vocabulario', assert => {
    assert.strictEqual(normalizarEstadoRiesgo('mitigado'), 'Cerrado');
    assert.strictEqual(normalizarEstadoRiesgo('CERRADO'), 'Cerrado');
    assert.strictEqual(normalizarEstadoRiesgo('activo'), 'Abierto');
});

QUnit.test('calcularEMV usa P/5 e impacto monetario', assert => {
    const riesgos = [
        { probabilidad: 3, impacto: 4, impactoMonetario: 0, estado: 'Abierto' },
        { probabilidad: 5, impacto: 5, impactoMonetario: 10000, estado: 'Abierto' },
        { probabilidad: 5, impacto: 5, impactoMonetario: 10000, estado: 'Cerrado' }
    ];
    // 0,6 * (450000*0,8) + 1 * 10000 = 216000 + 10000
    assert.strictEqual(calcularEMV(riesgos, 450000), 226000, 'EMV correcto y excluye cerrados');
});


// ============================================================
// EVM — coste real y pronóstico (Ciclo 2, ENG-02)
// ============================================================
QUnit.module('EVM coste real');

QUnit.test('calcularACReal respeta fecha de corte', assert => {
    const tareas = [
        { id: 1, tipo: 'actividad', costeReal: 2500, fechaGasto: '2026-01-10' },
        { id: 2, tipo: 'actividad', costeReal: 1000, fechaGasto: '2026-03-10' }
    ];
    assert.strictEqual(calcularACReal(tareas, '2026-02-01'), 2500, 'sólo gasto anterior al corte');
    assert.strictEqual(calcularACReal(tareas, '2026-04-01'), 3500, 'incluye todo el gasto');
});

QUnit.test('EV=2000 y AC real=2500 dan CPI=0,80 y EAC>BAC', assert => {
    const ac = calcularACReal([{ tipo: 'actividad', costeReal: 2500, fechaGasto: '2026-01-10' }], '2026-02-01');
    const cpi = calcularCPI(2000, ac);
    const eac = calcularEAC(2500, cpi);
    assert.strictEqual(ac, 2500);
    assert.strictEqual(cpi, 0.8);
    assert.true(eac > 2500, 'EAC=3125 supera BAC');
});

QUnit.test('sin coste real el AC es estimación etiquetada', assert => {
    const d = calcularDesgloseAC(1000, [{ id: 1, tipo: 'actividad', inicio: '2026-01-01', duracion: 10 }],
        new Date('2026-01-06'), '2026-01-01', { fechaCorte: new Date('2026-01-06') });
    assert.strictEqual(d.fuente, 'estimado');
    assert.strictEqual(d.real, 0);
    assert.true(d.estimado > 0);
});

QUnit.test('calcularCosteRecursosProyecto tolera viajes incompletos', assert => {
    const total = calcularCosteRecursosProyecto({ elementosGantt: [], viajes: [{ costeVuelos: 100 }] }, false);
    assert.strictEqual(total, 100, 'sin NaN');
});

QUnit.module('ENG-06 · WBS y línea base de alcance');

QUnit.test('generarCodigosWBS produce códigos únicos y aísla ciclos', assert => {
    const elementos = [
        { id: 1, tipo: 'edt', nombre: 'Fase 1' },
        { id: 2, tipo: 'edt', nombre: 'Fase 1.1', dependeDe: 1 },
        { id: 3, tipo: 'actividad', nombre: 'A', dependeDe: 1 },
        { id: 4, tipo: 'actividad', nombre: 'B', dependeDe: 1 },
        { id: 5, tipo: 'entregable', nombre: 'E', dependeDe: 2 },
        { id: 6, tipo: 'hito', nombre: 'H', dependeDe: 2 },
        { id: 7, tipo: 'edt', nombre: 'Ciclo A', dependeDe: 8 },
        { id: 8, tipo: 'edt', nombre: 'Ciclo B', dependeDe: 7 }
    ];
    const { codigos, ciclos } = generarCodigosWBS(elementos);
    const valores = elementos.map(e => codigos.get(e));
    assert.strictEqual(new Set(valores).size, valores.length, 'sin códigos duplicados');
    assert.deepEqual(ciclos.sort((a, b) => a - b), [7, 8], 'ciclo detectado');
    assert.strictEqual(codigos.get(1), '1');
    assert.strictEqual(codigos.get(2), '1.1');
    assert.strictEqual(codigos.get(5), '1.1.E1');
});

QUnit.test('creariaCicloWBS bloquea una dependencia circular', assert => {
    const elementos = [
        { id: 1, tipo: 'actividad', predecesores: [] },
        { id: 2, tipo: 'actividad', predecesores: [{ id: 1 }] },
        { id: 3, tipo: 'actividad', predecesores: [{ id: 2 }] }
    ];
    assert.true(creariaCicloWBS(elementos, 1, 3, 'predecesores'), '3 ya depende de 1');
    assert.false(creariaCicloWBS(elementos, 3, 1, 'predecesores'), '1 → 3 es válido');
});

QUnit.test('compararScopeBaseline detecta altas, bajas y cambios', assert => {
    aplicarCodigosWBS([{ id: 1, tipo: 'actividad', nombre: 'A' }, { id: 2, tipo: 'actividad', nombre: 'B' }]);
    const snapshot = crearScopeBaseline([{ id: 1, tipo: 'actividad', nombre: 'A' }, { id: 2, tipo: 'actividad', nombre: 'B' }], []);
    const diff = compararScopeBaseline([{ id: 1, codigo: 'A1', nombre: 'A modificado' }, { id: 3, codigo: 'A2', nombre: 'C' }], snapshot);
    assert.strictEqual(diff.bajas.length, 1);
    assert.strictEqual(diff.altas.length, 1);
    assert.strictEqual(diff.cambios.length, 1);
});

QUnit.module('ENG-07 · Multimoneda y modelos únicos');

QUnit.test('aBase aplica tipo de origen y tipo de base', assert => {
    global.tiposCambio = { EUR: 1, USD: 2, GBP: 0.5 };
    global.proyecto = { monedaBase: 'GBP' };
    assert.strictEqual(aBase(100, 'USD', 'GBP'), 25, '100 USD = 50 EUR = 25 GBP');
    assert.strictEqual(aBase(100, 'GBP', 'GBP'), 100);
    assert.strictEqual(convertirEntreMonedas(100, 'EUR', 'USD'), 200);
    delete global.proyecto;
});

QUnit.test('precioVentaEnBase usa monedaVenta y no la base por defecto', assert => {
    global.tiposCambio = { EUR: 1, USD: 2 };
    const p = { precioVenta: 200, monedaVenta: 'USD', monedaBase: 'EUR' };
    assert.strictEqual(precioVentaEnBase(p), 100);
});

QUnit.test('calcularEAC sin CPI fiable devuelve null', assert => {
    assert.strictEqual(calcularEAC(1000, 0), null);
    assert.strictEqual(calcularEAC(1000, Infinity), null);
    assert.strictEqual(calcularEAC(1000, 0.8), 1250);
});

QUnit.test('calcularSaludGeneral es el único modelo compartido', assert => {
    const valores = { CPI: 1, SPI: 1, ROI: 20, indiceDefectos: 0, velocidadEquipo: 30, satisfaccion: 5, huellaCarbono: 0, progresoGeneral: 1 };
    assert.strictEqual(calcularSaludGeneral(valores), 100);
    assert.strictEqual(calcularSaludGeneral({ ...valores, CPI: 0, SPI: 0, progresoGeneral: 0 }), 55);
});

QUnit.test('calcularCosteTotal convierte coste de recurso en moneda distinta', assert => {
    global.tiposCambio = { EUR: 1, USD: 2 };
    global.proyecto = { monedaBase: 'EUR' };
    const total = calcularCosteTotal([
        { id: 1, costeEstimado: 200, recursoAsignado: { moneda: 'USD' } },
        { id: 2, costeEstimado: 50, moneda: 'EUR' }
    ], [], [], [], convertirMoneda, 'EUR');
    assert.strictEqual(total, 150);
    delete global.proyecto;
});

QUnit.module('Fase 1 · Presupuesto base y coste real aprobados');

QUnit.test('el presupuesto y coste real del acta gobiernan BAC y AC del EVM', assert => {
    global.tiposCambio = { EUR: 1, USD: 2 };
    const p = {
        monedaBase: 'EUR', fechaInicio: '2026-01-01',
        elementosGantt: [{ id: 1, tipo: 'actividad', inicio: '2026-01-01', duracion: 10, costeEstimado: 1000 }],
        acta: {
            presupuestoBase: 5000, monedaPresupuesto: 'USD',
            aprobadoPorPresupuesto: 'Sponsor', fechaAprobacionPresupuesto: '2026-01-02',
            costeReal: 1500, monedaCosteReal: 'USD', fechaCosteReal: '2026-02-01'
        }
    };
    const m = calcularModeloEVM(p);
    assert.strictEqual(m.BAC, 2500, 'BAC aprobado se convierte a la moneda base');
    assert.strictEqual(m.costeTotal, m.BAC, 'salud e informe comparten el mismo BAC');
    assert.strictEqual(m.origenBAC, 'aprobado');
    assert.strictEqual(m.AC, 750, 'AC aprobado se convierte a la moneda base');
    assert.strictEqual(m.origenAC, 'aprobado');
    delete global.tiposCambio;
});

QUnit.test('sin valores aprobados el EVM sigue calculando BAC y AC como antes', assert => {
    const p = {
        monedaBase: 'EUR', fechaInicio: '2026-01-01',
        elementosGantt: [{ id: 1, tipo: 'actividad', inicio: '2026-01-01', duracion: 10, costeEstimado: 1000 }],
        acta: { presupuestoBase: 0, costeReal: 0 }
    };
    const m = calcularModeloEVM(p);
    assert.strictEqual(m.BAC, 1000);
    assert.strictEqual(m.origenBAC, 'calculado');
    assert.notStrictEqual(m.origenAC, 'aprobado');
});

QUnit.test('el coste real aprobado prevalece sobre el registrado en tareas', assert => {
    const d = calcularDesgloseAC(1000, [{ id: 1, inicio: '2026-01-01', duracion: 1, costeReal: 900, fechaGasto: '2026-01-02' }],
        new Date('2026-03-01'), '2026-01-01', { costeRealAprobado: 200 });
    assert.strictEqual(d.total, 200);
    assert.strictEqual(d.fuente, 'real');
    assert.strictEqual(d.origen, 'aprobado');
});

QUnit.test('los estados heredados se normalizan al ciclo de vida del proyecto', assert => {
    assert.strictEqual(normalizarEstadoProyecto('activo'), 'en_curso');
    assert.strictEqual(normalizarEstadoProyecto('Finalizado'), 'cerrado');
    assert.strictEqual(normalizarEstadoProyecto('planificado'), 'planificado');
    assert.strictEqual(normalizarEstadoProyecto(undefined), 'en_curso');
});

QUnit.test('el cierre solo se habilita con evidencia verificable', assert => {
    const base = {
        procesos: [{ id: 1, completado: true }],
        elementosGantt: [{ id: 1, tipo: 'entregable', progreso: 100 }],
        requisitos: [{ id: 'REQ-001', estado: 'aprobado' }],
        cambios: [{ id: 1, estado: 'Aprobado' }],
        riesgos: [{ id: 1, estado: 'mitigado' }],
        lecciones: [{ id: 1, titulo: 'Lección' }]
    };
    assert.true(evaluarChecklistCierre(base).every(x => x.ok), 'checklist completo');
    const incompleto = { ...base, cambios: [{ id: 1, estado: 'Pendiente' }], lecciones: [] };
    const fallos = evaluarChecklistCierre(incompleto).filter(x => !x.ok).map(x => x.clave);
    assert.deepEqual(fallos, ['cambios', 'lecciones']);
});

QUnit.module('ENG-08 · Carga de trabajo');

QUnit.test('calcularCargaPorDia distribuye horas en días hábiles', assert => {
    const p = {
        equipo: [{ id: 1, nombre: 'Ana', horasDia: 8 }],
        elementosGantt: [{ tipo: 'actividad', inicio: '2026-01-05', duracion: 2, horasDia: 8, recursoAsignado: { id: 1, nombre: 'Ana' } }]
    };
    const r = calcularCargaPorDia(p);
    assert.strictEqual(r.dias.length, 2, 'lunes y martes');
    assert.strictEqual(r.carga['1'][r.dias[0]], 8);
    assert.strictEqual(r.sobreasignaciones.length, 0);
});

QUnit.test('calcularCargaPorDia detecta sobreasignación', assert => {
    const p = {
        equipo: [{ id: 1, nombre: 'Ana', horasDia: 8 }],
        elementosGantt: [{ tipo: 'actividad', inicio: '2026-01-05', duracion: 1, duracionHoras: 12, recursoAsignado: { id: 1 } }]
    };
    const r = calcularCargaPorDia(p);
    assert.strictEqual(r.sobreasignaciones.length, 1);
    assert.strictEqual(r.sobreasignaciones[0].exceso, 4);
});

QUnit.test('los fines de semana no generan carga', assert => {
    const p = {
        equipo: [{ id: 1, nombre: 'Ana' }],
        elementosGantt: [{ tipo: 'actividad', inicio: '2026-01-09', duracion: 3, horasDia: 8, recursoAsignado: { id: 1 } }]
    };
    const r = calcularCargaPorDia(p);
    assert.deepEqual(r.dias, ['2026-01-09', '2026-01-12', '2026-01-13']);
});

QUnit.module('ENG-09 · Modelo ágil único');

QUnit.test('normalizarDatosAgiles migra el modelo heredado sin duplicar', assert => {
    global.proyecto = {
        nombre: 'Demo',
        metricasAgiles: { sprints: [{ numero: 1, puntosCompletados: 12 }], velocidadPromedio: 12 },
        scrum: { sprints: [{ numero: 2, puntosCompletados: 8 }] }
    };
    normalizarDatosAgiles();
    assert.strictEqual(global.proyecto.metricasAgiles, undefined, 'modelo heredado eliminado');
    assert.strictEqual(global.proyecto.scrum.sprints.length, 2, 'sprints consolidados');
    assert.strictEqual(global.proyecto.velocidadEquipo, 10, 'velocidad única redondeada');
    assert.deepEqual(global.proyecto.scrum.daily, [], 'Daily disponible');
    delete global.proyecto;
});

QUnit.test('calcularVelocidadEquipo admite velocity y puntosCompletados', assert => {
    const p = { scrum: { sprints: [{ velocity: 14 }, { puntosCompletados: 10 }, { puntosCompletados: 0 }] } };
    assert.strictEqual(calcularVelocidadEquipo(p), 12);
    assert.strictEqual(calcularVelocidadEquipo({ scrum: { sprints: [] } }), 0);
});

QUnit.module('ENG-11 · Importaciones y aranceles');

QUnit.test('resolverArancelMaterial prioriza personalizado, HS y país', assert => {
    const config = [
        { pais: 'China', categoria: 'Electrónica', codigo: '8542', porcentaje: 15 },
        { pais: 'USA', categoria: 'General', codigo: 'G001', porcentaje: 5 }
    ];
    assert.strictEqual(resolverArancelMaterial({ paisOrigen: 'China', hsCode: '8542' }, config), 15, 'HS');
    assert.strictEqual(resolverArancelMaterial({ paisOrigen: 'USA', hsCode: '8542', arancelPersonalizado: 7.5 }, config), 7.5, 'personalizado');
    assert.strictEqual(resolverArancelMaterial({ paisOrigen: 'China', categoria: 'Textil' }, config), 0, 'categoría distinta no aplica');
});

// ============================================================
// Ciclo 2 · cierre de hallazgos 🔴 y cobertura de escenarios
// ============================================================
QUnit.module('Ciclo 2 · gobernanza y trazabilidad');

QUnit.test('escapeHtml cubre comillas simples y dobles', assert => {
    assert.strictEqual(escapeHtml(`"'<>&`), '&quot;&#39;&lt;&gt;&amp;');
});

QUnit.test('sanitizarProyectoImportado elimina markup y manejadores', assert => {
    const limpio = sanitizarProyectoImportado({
        nombre: '<img src=x onerror=alert(1)>Proyecto',
        onclick: 'alert(1)',
        datos: [{ nota: '<script>alert(1)</script>Texto' }]
    }, 0);
    assert.strictEqual(limpio.onclick, undefined, 'clave on* descartada');
    assert.false(String(limpio.nombre).includes('<'), 'sin apertura de etiqueta');
    assert.false(String(limpio.datos[0].nota).includes('>'), 'sin cierre de etiqueta');
});

QUnit.test('normalizarRiesgos completa tipo, owner y monitoreo', assert => {
    const guardar = global.guardarProyecto;
    global.guardarProyecto = () => {};
    global.proyecto = { riesgos: [{ id: 1, nombre: 'Retraso', probabilidad: 3, impacto: 4, estado: 'Abierto' }] };
    normalizarRiesgos();
    const r = proyecto.riesgos[0];
    assert.strictEqual(r.tipo, 'Amenaza');
    assert.strictEqual(r.frecuencia, 'Mensual');
    assert.strictEqual(r.owner, '');
    assert.strictEqual(r.score, 12);
    global.guardarProyecto = guardar;
    delete global.proyecto;
});

QUnit.test('calcularEMV descuenta oportunidades del colchón de contingencia', assert => {
    const riesgos = [
        { probabilidad: 5, impacto: 5, impactoMonetario: 1000, estado: 'Abierto', tipo: 'Amenaza' },
        { probabilidad: 5, impacto: 5, impactoMonetario: 400, estado: 'Abierto', tipo: 'Oportunidad' }
    ];
    assert.strictEqual(calcularEMV(riesgos, 0), 600);
});

QUnit.test('aprobar un cambio crea nueva línea base y conserva la anterior', assert => {
    const snapshot = { version: 1, codigos: [{ id: 1, codigo: '1', nombre: 'Raíz', tipo: 'edt' }] };
    global.proyecto = {
        id: 1, nombre: 'Demo', monedaBase: 'EUR', bitacora: [], cambios: [],
        elementosGantt: [
            { id: 1, tipo: 'edt', nombre: 'Raíz', costeEstimado: 0 },
            { id: 2, tipo: 'actividad', nombre: 'Tarea', dependeDe: 1, costeEstimado: 100 }
        ],
        lineasBase: [{ id: 10, nombre: 'LB inicial', fecha: '2026-01-01', scopeBaseline: snapshot }]
    };
    const copia = JSON.parse(JSON.stringify(snapshot));
    const nueva = propagarCambioALineaBase(proyecto.lineasBase[0], { id: 99 });
    assert.deepEqual(proyecto.lineasBase[0].scopeBaseline, copia, 'baseline anterior intacta');
    assert.strictEqual(proyecto.lineasBase.length, 2, 'se añade una nueva baseline');
    assert.ok(Array.isArray(nueva.diffAlcance.cambios), 'diff antes → después registrado');
    assert.ok(nueva.diffAlcance.total >= 1, 'el cambio de códigos WBS respecto a la baseline inicial se detecta');
    assert.strictEqual(nueva.predecesoraId, 10);
    assert.true(verificarBitacora(), 'bitácora íntegra');
    delete global.proyecto;
});

QUnit.test('solo el CCB puede aprobar un cambio', assert => {
    assert.deepEqual(normalizarEstadoCambio('Aprobado', false), { estado: 'En análisis', autorizado: false });
    assert.deepEqual(normalizarEstadoCambio('Implementado', false, 'Aprobado'), { estado: 'Aprobado', autorizado: false });
    assert.deepEqual(normalizarEstadoCambio('Aprobado', true), { estado: 'Aprobado', autorizado: true });
    assert.deepEqual(normalizarEstadoCambio('Pendiente', false), { estado: 'Pendiente', autorizado: true });
});

QUnit.test('la línea base tras aprobación conserva el impacto acordado por el CCB', assert => {
    const snapshot = { version: 1, codigos: [{ id: 1, codigo: '1', nombre: 'Raíz', tipo: 'edt' }] };
    global.proyecto = {
        id: 1, nombre: 'Demo', monedaBase: 'EUR', bitacora: [], cambios: [],
        elementosGantt: [{ id: 1, tipo: 'edt', nombre: 'Raíz', costeEstimado: 0 }],
        lineasBase: [{ id: 10, nombre: 'LB inicial', fecha: '2026-01-01', scopeBaseline: snapshot }]
    };
    const nueva = propagarCambioALineaBase(proyecto.lineasBase[0], {
        id: 99, descripcion: 'Ampliar alcance', impactoCosteNumerico: 5000,
        impactoPlazoDias: 10, impactoAlcance: 'Nuevo entregable',
        aprobadoPor: 'Sponsor', fechaAprobacion: '2026-02-01', estado: 'Aprobado'
    });
    assert.strictEqual(nueva.impactoCambio.coste, 5000);
    assert.strictEqual(nueva.impactoCambio.plazoDias, 10);
    assert.strictEqual(nueva.impactoCambio.aprobadoPor, 'Sponsor');
    assert.true(verificarBitacora());
    delete global.proyecto;
});

QUnit.module('Ciclo 2 · adquisiciones y cronograma');

QUnit.test('estadoRecepcionOrden detecta retrasos y cumplimiento SLA', assert => {
    assert.strictEqual(estadoRecepcionOrden({ fechaCompromiso: '2026-01-01' }, '2026-02-01'), 'Retrasada');
    assert.strictEqual(estadoRecepcionOrden({ fechaCompromiso: '2026-01-01', fechaRecepcion: '2025-12-28' }), 'En plazo');
    assert.strictEqual(estadoRecepcionOrden({ fechaCompromiso: '2026-01-01', fechaRecepcion: '2026-01-05' }), 'Fuera de plazo');
});

QUnit.test('calcularEscenariosEAC ofrece cuatro escenarios y TCPI-EAC', assert => {
    const r = calcularEscenariosEAC(1000, 200, 100, 100, 0.5, 0.5);
    assert.strictEqual(r.escenarios.length, 4);
    assert.strictEqual(r.escenarios[0].valor, 2000);
    assert.strictEqual(r.escenarios[1].valor, 1100);
    assert.strictEqual(r.escenarios[2].valor, 3800);
    assert.strictEqual(r.tcpiEac, 0.5);
    const sinCpi = calcularEscenariosEAC(1000, 200, 100, 100, 0, 1);
    assert.strictEqual(sinCpi.escenarios[0].valor, null);
    assert.ok(sinCpi.referencia > 0, 'referencia alternativa cuando CPI no es fiable');
});

QUnit.test('_makespanRed conserva leads negativos en FF/SF', assert => {
    const mk = (tipo, retraso) => {
        const tareas = [
            { id: 1, duracion: 5, predecesores: [] },
            { id: 2, duracion: 3, predecesores: [{ id: 1, tipo, retraso }] }
        ];
        return _makespanRed(tareas.map(t => t.id),
            Object.fromEntries(tareas.map(t => [t.id, t])),
            Object.fromEntries(tareas.map(t => [t.id, t.duracion])));
    };
    // El retraso se convierte de días hábiles a naturales en CPM y MC.
    assert.strictEqual(retrasoEnDiasNaturales(-6), -10);
    assert.strictEqual(mk('FF', -6), 13);
    assert.strictEqual(mk('SF', -3), 13);
});

QUnit.module('Ciclo 2 · gobernanza RACI y hitos');

QUnit.test('asignarRolRACI mantiene una sola A por actividad', assert => {
    const actividades = [{ key: 'elem:1', nombre: 'Entrega' }];
    global.proyecto = { raci: [] };
    asignarRolRACI(proyecto, 'elem:1', 'Entrega', 10, 'A');
    asignarRolRACI(proyecto, 'elem:1', 'Entrega', 20, 'A');
    assert.strictEqual(validarRACI(proyecto, actividades).length, 0, 'regla de responsable único cumplida');
    assert.strictEqual(proyecto.raci.find(r => r.stakeholderId === 10).rol, 'C', 'A anterior pasa a C');
    assert.strictEqual(proyecto.raci.find(r => r.stakeholderId === 20).rol, 'A');
    actividades.push({ key: 'elem:2', nombre: 'Sin responsable' });
    assert.strictEqual(validarRACI(proyecto, actividades).length, 1, 'detecta fila sin A');
    delete global.proyecto;
});

QUnit.module('Ciclo 2 · cierre de hallazgos 🔴');

QUnit.test('resolverArancelMaterial distingue el país de destino', assert => {
    const config = [
        { id: 1, pais: 'China', paisDestino: 'ES', codigo: '8542', porcentaje: 15 },
        { id: 2, pais: 'China', paisDestino: 'US', codigo: '8542', porcentaje: 3 }
    ];
    assert.strictEqual(resolverArancelMaterial({ paisOrigen: 'China', paisDestino: 'ES', hsCode: '8542' }, config), 15);
    assert.strictEqual(resolverArancelMaterial({ paisOrigen: 'China', paisDestino: 'US', hsCode: '8542' }, config), 3);
    assert.strictEqual(resolverArancelMaterial({ paisOrigen: 'China', paisDestino: 'MX', hsCode: '9999' }, config), 0, 'destino sin configuración no hereda otro arancel');
});

QUnit.test('calcularCosteTotal incluye el coste de envío del viaje', assert => {
    const viaje = { costeVuelos: 100, costeHotel: 50, costeComidas: 20, costeTraslados: 10, costeEnvio: 25, moneda: 'EUR' };
    assert.strictEqual(calcularCosteTotal([], [], [], [viaje], null, 'EUR'), 205);
});

QUnit.test('ejecutarCPM conserva leads FF/SF negativos sin recortarlos', assert => {
    const elementos = [
        { id: 1, nombre: 'A', tipo: 'tarea', inicio: '2024-01-01', duracion: 5, predecesores: [] },
        { id: 2, nombre: 'B', tipo: 'tarea', inicio: '2024-01-01', duracion: 3, predecesores: [{ id: 1, tipo: 'FF', retraso: -6 }] }
    ];
    const ref = { criticalPath: [], totalFloat: 0 };
    const resultado = ejecutarCPM(elementos, ref);
    const b = resultado.find(e => e.id === 2);
    assert.true(b._earlyStart < 0, 'el inicio adelantado no se recorta a 0');
    assert.ok(Array.isArray(ref.criticalPath), 'la ruta crítica se calcula sobre la red completa');
});

QUnit.test('generarCodigosWBS no repite códigos con IDs duplicados', assert => {
    const elementos = [
        { id: 1, tipo: 'edt', nombre: 'Fase A' },
        { id: 1, tipo: 'edt', nombre: 'Fase B' },
        { id: 2, tipo: 'actividad', nombre: 'Tarea', dependeDe: 1 }
    ];
    const { codigos } = generarCodigosWBS(elementos);
    const valores = elementos.map(e => codigos.get(e));
    assert.strictEqual(new Set(valores).size, valores.length, 'todos los códigos son únicos');
});

QUnit.test('crearScopeBaseline no muta el array de entrada', assert => {
    const elementos = [{ id: 1, tipo: 'actividad', nombre: 'A' }];
    crearScopeBaseline(elementos, []);
    assert.false(Object.prototype.hasOwnProperty.call(elementos[0], 'codigo'), 'el llamador conserva sus datos');
});

QUnit.test('calcularCargaPorDia usa horasMes como capacidad diaria', assert => {
    const proyectoCarga = {
        equipo: [{ id: 1, nombre: 'Consultor', horasMes: 120 }],
        elementosGantt: [{ id: 10, tipo: 'actividad', inicio: '2026-11-23', duracion: 1, recursoAsignado: { id: 1 } }]
    };
    const resultado = calcularCargaPorDia(proyectoCarga);
    assert.strictEqual(resultado.recursos[0].capacidad, 6, '120 h/mes → 6 h/día');
});

QUnit.test('sanitizarProyectoImportado neutraliza comillas, entidades e ids inyectables', assert => {
    const limpio = sanitizarProyectoImportado({
        nombre: 'a" onmouseover="alert(1)&#39;',
        onclick: 'x',
        id: '1);alert(1);//',
        __proto__: { polluted: true }
    });
    assert.strictEqual(limpio.nombre, 'a onmouseover=alert(1)', 'sin comillas ni entidades decodificables');
    assert.strictEqual(limpio.id, '1', 'id canónico para handlers inline');
    assert.false(Object.prototype.hasOwnProperty.call(limpio, 'onclick'), 'manejadores eliminados');
    assert.false(Object.prototype.hasOwnProperty.call(limpio, '__proto__'), 'prototipo no copiado');
    assert.notOk({}.polluted, 'sin contaminación de prototipos');
});


QUnit.test('propagarCambioALineaBase crea baseline inicial cuando no existe', assert => {
    global.proyecto = {
        id: 2, nombre: 'Sin LB', monedaBase: 'EUR', bitacora: [], cambios: [], lineasBase: [],
        elementosGantt: [{ id: 1, tipo: 'edt', nombre: 'Raíz', costeEstimado: 0 }]
    };
    const nueva = propagarCambioALineaBase(null, { id: 5, descripcion: 'Primer cambio' });
    assert.strictEqual(proyecto.lineasBase.length, 2, 'inicial + nueva');
    assert.strictEqual(nueva.predecesoraId, proyecto.lineasBase[0].id);
    assert.true(proyecto.lineasBase[0].superada, 'la inicial queda marcada como superada');
    assert.ok(Array.isArray(nueva.diffAlcance.cambios), 'diff calculado');
    delete global.proyecto;
});

QUnit.module('Ciclo 3 · verificación de hallazgos 🔴');

QUnit.test('normalizarEstadoRiesgo conserva «En seguimiento»', assert => {
    assert.strictEqual(normalizarEstadoRiesgo('En seguimiento'), 'En seguimiento');
    assert.strictEqual(normalizarEstadoRiesgo('seguimiento'), 'En seguimiento');
    assert.strictEqual(normalizarEstadoRiesgo('activo'), 'Abierto');
});

QUnit.test('calcularCargaPorDia carga horasMes aunque el recurso asignado no lo repita', assert => {
    global.proyecto = {
        equipo: [{ id: 1, nombre: 'Consultor', horasMes: 120 }],
        elementosGantt: [{ id: 10, tipo: 'actividad', inicio: '2026-11-23', duracion: 1, recursoAsignado: { id: 1, horasDia: 8 } }]
    };
    const r = calcularCargaPorDia(global.proyecto);
    assert.strictEqual(r.recursos[0].capacidad, 6, 'capacidad canónica 120/20');
    assert.strictEqual(Object.values(r.carga['1'] || {}).reduce((a, b) => a + b, 0), 6, 'la carga usa 6 h, no 8 h');
    assert.strictEqual(r.sobreasignaciones.length, 0, 'sin sobreasignación fantasma');
    delete global.proyecto;
});

QUnit.test('ejecutarCPM aplica leads negativos moderados y expone makespan', assert => {
    const elementos = [
        { id: 1, nombre: 'A', tipo: 'tarea', inicio: '2024-01-01', duracion: 10, predecesores: [] },
        { id: 2, nombre: 'B', tipo: 'tarea', inicio: '2024-01-15', duracion: 3, predecesores: [{ id: 1, tipo: 'FF', retraso: -2 }] }
    ];
    const ref = { criticalPath: [], totalFloat: 0, makespan: 0, conCiclo: false };
    const resultado = ejecutarCPM(elementos, ref);
    assert.true(resultado.find(e => e.id === 2)._earlyStart < 14, 'el lead adelanta B respecto a su fecha manual');
    assert.true(ref.makespan > 0, 'makespan calculado sobre la red');
    assert.false(ref.conCiclo, 'red acíclica');
});

QUnit.test('ejecutarCPM suspende métricas ante dependencias circulares', assert => {
    const elementos = [
        { id: 1, tipo: 'tarea', duracion: 2, predecesores: [{ id: 2, tipo: 'FS', retraso: 0 }] },
        { id: 2, tipo: 'tarea', duracion: 3, predecesores: [{ id: 1, tipo: 'FS', retraso: 0 }] }
    ];
    const ref = { criticalPath: [], totalFloat: 0, makespan: 0, conCiclo: false };
    const getById = global.document.getElementById;
    global.document.getElementById = () => null;
    ejecutarCPM(elementos, ref);
    global.document.getElementById = getById;
    assert.true(ref.conCiclo, 'ciclo detectado');
    assert.strictEqual(ref.criticalPath.length, 0, 'sin ruta crítica falsa');
    assert.strictEqual(ref.makespan, 0, 'sin makespan falso');
});

QUnit.test('calcularCosteTotal respeta monedaBase explícita con convertirFn', assert => {
    const viaje = { costeVuelos: 100, costeEnvio: 25, moneda: 'EUR' };
    global.proyecto = { monedaBase: 'USD' };
    const fn = (valor, origen, base) => base === 'EUR' ? valor : valor * 2;
    assert.strictEqual(calcularCosteTotal([], [], [], [viaje], fn, 'EUR'), 125);
    delete global.proyecto;
});

QUnit.test('calcularModeloEVM da entradas idénticas para salud e informe', assert => {
    global.proyecto = {
        monedaBase: 'EUR', metodologia: { tipo: 'agile' },
        fechaInicio: '2024-01-01', elementosGantt: [{ id: 1, tipo: 'actividad', inicio: '2024-01-01', duracion: 10, costeEstimado: 10000, progreso: 50 }],
        materiales: [{ cantidad: 1, costeUnitario: 5000, moneda: 'EUR', sprint: 1 }],
        servicios: [{ cantidad: 1, costeUnitario: 1000, impuesto: 21, moneda: 'EUR', sprint: 1 }],
        scrum: {
            sprints: [{ id: 1, estado: 'completado', puntosPlanificados: 20, puntosCompletados: 18,
                costes: { planificado: 30000, real: 25000 } }],
            historias: []
        }
    };
    const m = calcularModeloEVM(global.proyecto);
    assert.strictEqual(m.BAC, 35000, 'BAC = Gantt + coste real del sprint, sin duplicar sprint');
    assert.strictEqual(m.agileCPI, 1.2, 'CPI ágil = planificado / real');
    assert.strictEqual(m.agileSPI, 0.9, 'SPI ágil = puntos completados / planificados');
    assert.ok(Math.abs(m.agileEAC - (35000 / 1.2)) < 0.01, 'EAC ágil = BAC / CPI, no tautológico');
    assert.strictEqual(m.CPI, m.agileCPI, 'salud e informe comparten CPI');
    assert.strictEqual(m.SPI, m.agileSPI, 'salud e informe comparten SPI');
    assert.strictEqual(m.EAC, m.agileEAC, 'salud e informe comparten EAC');
    delete global.proyecto;
});

QUnit.module('Ciclo 3 · calendario, CSV y compresión');

QUnit.test('parsearCSV respeta BOM, comillas, saltos internos y delimitadores', assert => {
    const filas = parsearCSV('\uFEFF"nombre";"notas";"coste"\r\n"Tarea, A";"línea 1\nlínea 2";"1.200"');
    assert.deepEqual(filas[0], ['nombre', 'notas', 'coste']);
    assert.deepEqual(filas[1], ['Tarea, A', 'línea 1\nlínea 2', '1.200']);
    assert.strictEqual(parsearCSV('a;b\n1;2')[1][1], '2');
});

QUnit.test('el calendario laboral descuenta festivos configurados', assert => {
    global.proyecto = { calendario: { diasNoLaborables: [0, 6], festivos: ['2026-12-25'] } };
    assert.true(esDiaNoLaboral(new Date(2026, 11, 25)), '25/12 es festivo');
    assert.strictEqual(sumarDiasHabiles('2026-12-24', 1), '2026-12-28', 'salta festivo y fin de semana');
    assert.strictEqual(contarDiasHabiles('2026-12-24', '2026-12-29'), 2, '24 y 28 laborables');
    delete global.proyecto;
});

QUnit.test('simularEscenariosCompresion ofrece crashing y fast-tracking', assert => {
    global.proyecto = { elementosGantt: [
        { id: 1, nombre: 'A', tipo: 'actividad', duracion: 10, costeEstimado: 1000, predecesores: [] },
        { id: 2, nombre: 'B', tipo: 'actividad', duracion: 5, costeEstimado: 500, predecesores: [{ id: 1, tipo: 'FS', retraso: 0 }] }
    ] };
    const esc = simularEscenariosCompresion(global.proyecto);
    assert.strictEqual(esc.length, 3);
    assert.strictEqual(esc[0].duracion, 15);
    assert.true(esc[1].duracion < esc[0].duracion, 'crashing acorta la red');
    assert.true(esc[1].costeExtra > 0, 'crashing tiene coste adicional');
    assert.true(esc[2].duracion < esc[0].duracion, 'fast-tracking acorta la red');
    delete global.proyecto;
});

QUnit.module('Ciclo 4 · cierre final');

QUnit.test('EVM convierte costes de sprint importados y pronostica con el CPI mostrado', assert => {
    global.tiposCambio = { EUR: 1, USD: 2 };
    const proyectoAgil = {
        monedaBase: 'EUR', metodologia: { tipo: 'agile' }, fechaInicio: '2024-01-01',
        elementosGantt: [{ id: 1, tipo: 'actividad', inicio: '2024-01-01', duracion: 10, costeEstimado: 1000, progreso: 100 }],
        materiales: [], servicios: [], viajes: [],
        scrum: { sprints: [{ id: 1, estado: 'completado', fechaFin: '2024-01-31',
            puntosPlanificados: 10, puntosCompletados: 10, moneda: 'USD',
            costes: { planificado: 4000, real: 2000 } }] }
    };
    const m = calcularModeloEVM(proyectoAgil);
    assert.strictEqual(m.BAC, 2000, 'BAC = 1000 EUR + 2000 USD convertidos');
    assert.ok(Math.abs(m.EAC - 1000) < 0.01, 'EAC = BAC / CPI ya limitado');

    const proyectoCPI = Object.assign({}, proyectoAgil, {
        elementosGantt: [],
        scrum: { sprints: [{ id: 1, estado: 'completado', fechaFin: '2024-01-31',
            puntosPlanificados: 10, puntosCompletados: 10,
            costes: { planificado: 300, real: 100 } }] }
    });
    const mc = calcularModeloEVM(proyectoCPI);
    assert.strictEqual(mc.CPI, 2, 'el CPI mostrado está limitado a 2');
    assert.ok(Math.abs(mc.EAC - 50) < 0.01, 'el pronóstico usa el mismo CPI limitado');
});

QUnit.test('bitácora importada se recalcula también en el formato directo', assert => {
    global.proyecto = { id: 1, bitacora: [] };
    registrarBitacora('proyecto', 1, 'crear', null, { nombre: 'Antes' });
    const limpio = sanitizarProyectoImportado(global.proyecto, 0);
    global.proyecto = limpio;
    assert.false(verificarBitacora(), 'sanitizar canóniza ids y rompe el hash');
    recalcularBitacoraImportada(limpio);
    assert.true(verificarBitacora(), 'el recálculo restaura la cadena');
    delete global.proyecto;
});

QUnit.test('el remapeo de organigrama tolera ids importados como texto', assert => {
    const nodos = [{ id: 'n1', stakeholderId: '2' }, { id: 'n2', stakeholderId: 3 }];
    const remapeados = organigramaRemapearStakeholder(nodos, 2, 1);
    assert.strictEqual(remapeados[0].stakeholderId, 1, 'stakeholder "2" pasa al canónico 1');
    assert.strictEqual(remapeados[1].stakeholderId, 3, 'los demás no se tocan');
});


QUnit.test('compararSnapshotsScope acepta snapshots completos sin TypeError', assert => {
    const anterior = crearScopeBaseline([{ id: 1, nombre: 'Diseño', tipo: 'actividad' }], []);
    const actual = crearScopeBaseline([
        { id: 1, nombre: 'Diseño final', tipo: 'actividad' },
        { id: 2, nombre: 'Implantación', tipo: 'actividad' }
    ], []);
    const diff = compararSnapshotsScope(actual, anterior);
    assert.strictEqual(diff.total, 2, 'un cambio de nombre y una alta');
    assert.strictEqual(diff.altas.length, 1, 'alta detectada');
    assert.strictEqual(diff.cambios.length, 1, 'cambio detectado');
});

QUnit.test('la bitácora conserva la instantánea aunque se mute el objeto original', assert => {
    global.proyecto = { bitacora: [] };
    const elem = { id: 1, nombre: 'Diseño', progreso: 10 };
    const antes = clonarParaBitacora(elem);
    elem.progreso = 90;
    registrarBitacora('elemento', 1, 'editar', antes, clonarParaBitacora(elem));
    assert.true(verificarBitacora(), 'cadena válida al registrar');
    elem.progreso = 100; // simula la mutación del render CPM
    assert.true(verificarBitacora(), 'la entrada conserva su copia y el hash sigue siendo válido');
    delete global.proyecto;
});

// ============================================================
// IA local — adaptador modelo-agnóstico
// ============================================================
QUnit.module('IA local');

QUnit.test('normaliza modelos de Ollama y de API compatible con OpenAI', assert => {
    const ollama = LocalAIService._normalizarModelos({
        models: [{ name: 'qwen2.5:7b-instruct', size: 4700000000 }, { name: 'llama3.2:3b', size: 2000000000 }]
    });
    const openai = LocalAIService._normalizarModelos({ data: [{ id: 'mistral-nemo' }] });

    assert.deepEqual(ollama.map(m => m.id), ['qwen2.5:7b-instruct', 'llama3.2:3b'], 'lee /api/tags');
    assert.strictEqual(ollama[0].gb, 4.7, 'convierte bytes a GB');
    assert.deepEqual(openai.map(m => m.id), ['mistral-nemo'], 'lee /v1/models');
    assert.deepEqual(LocalAIService._normalizarModelos({ otro: [] }), [], 'payload desconocido -> vacío');
});

QUnit.test('guarda el entorno y el modelo elegido sin secretos', assert => {
    localStorage.removeItem(LocalAIService.STORAGE_KEY);
    LocalAIService.limpiarCredencialesLegacy();
    LocalAIService.configurar({ perfil: 'lan', modelos: { lan: 'qwen2.5:14b-instruct' } });

    assert.strictEqual(LocalAIService.leerConfig().perfil, 'lan', 'persiste el entorno');
    assert.strictEqual(LocalAIService.modeloActivo('lan'), 'qwen2.5:14b-instruct', 'persiste el modelo');
    assert.strictEqual(localStorage.getItem('openai_api_key'), null, 'no queda API key legacy');

    LocalAIService.configurar({ modelos: { local: 'llama3.2:3b' } });
    assert.strictEqual(LocalAIService.modeloActivo('lan'), 'qwen2.5:14b-instruct', 'cambiar un perfil no borra otro');
});

QUnit.test('ask sin modelo lanza error tipado antes de llamar a la red', async assert => {
    localStorage.removeItem(LocalAIService.STORAGE_KEY);
    const fetchOriginal = global.fetch;
    global.fetch = () => { throw new Error('no debería llamarse'); };
    let codigo = null;
    try {
        await LocalAIService.ask([{ role: 'user', content: 'hola' }]);
    } catch (e) {
        codigo = e.codigo;
    } finally {
        global.fetch = fetchOriginal;
    }
    assert.strictEqual(codigo, 'sin_modelo', 'error tipado sin red');
});

QUnit.test('ask envía el modelo activo al endpoint del proveedor', async assert => {
    localStorage.removeItem(LocalAIService.STORAGE_KEY);
    LocalAIService.configurar({ perfil: 'local', modelos: { local: 'qwen2.5:7b-instruct' } });
    const fetchOriginal = global.fetch;
    let peticion = null;
    global.fetch = async (url, opts) => {
        peticion = { url, body: JSON.parse(opts.body) };
        return {
            ok: true,
            json: async () => ({ choices: [{ message: { content: ' Respuesta de prueba ' } }] })
        };
    };
    try {
        const texto = await LocalAIService.ask([{ role: 'user', content: 'hola' }]);
        assert.strictEqual(texto, 'Respuesta de prueba', 'recorta whitespace');
        assert.strictEqual(peticion.url, 'http://127.0.0.1:11434/v1/chat/completions', 'endpoint OpenAI-compatible de Ollama');
        assert.strictEqual(peticion.body.model, 'qwen2.5:7b-instruct', 'usa el modelo configurado, no uno hardcodeado');
        assert.false(peticion.body.stream, 'respuesta no streaming');
    } finally {
        global.fetch = fetchOriginal;
    }
});

QUnit.module('Requisitos y trazabilidad');

QUnit.test('el correlativo REQ-001 ignora códigos mal formados', assert => {
    assert.strictEqual(siguienteCodigoRequisito([]), 'REQ-001');
    assert.strictEqual(siguienteCodigoRequisito([{ codigo: 'REQ-007' }, { codigo: 'borrador' }, { codigo: 'req-12' }]), 'REQ-013');
});

QUnit.test('la aprobación exige estado explícito y es compatible con proyectos legacy', assert => {
    assert.true(esRequisitoAprobado({ estado: 'aprobado' }));
    assert.true(esRequisitoAprobado({ estado: 'validado' }));
    assert.true(esRequisitoAprobado({ aprobado: true }));
    assert.false(esRequisitoAprobado({ estado: 'propuesto' }));
    assert.false(esRequisitoAprobado(null));
});

QUnit.test('la cobertura funciona en ambos sentidos (Gantt y entregableId)', assert => {
    const elementos = [
        { id: 10, codigo: '1.1', nombre: 'Diseño', requisitosIds: ['a', 7] },
        { id: 20, codigo: 'E-1', nombre: 'Prototipo', requisitosIds: [] }
    ];
    assert.deepEqual(elementosQueCubren({ id: 'a' }, elementos).map(e => e.id), [10], 'id como texto');
    assert.deepEqual(elementosQueCubren({ id: 7 }, elementos).map(e => e.id), [10], 'id numérico');
    assert.deepEqual(elementosQueCubren({ id: 'b', entregableId: 20 }, elementos).map(e => e.id), [20], 'vinculación inversa');
    assert.strictEqual(elementosQueCubren({ id: 'sin-cubrir' }, elementos).length, 0);
});

QUnit.test('el resumen distingue aprobados, sin cubrir y Must pendientes', assert => {
    const elementos = [{ id: 10, requisitosIds: ['r1'] }];
    const lista = [
        { id: 'r1', estado: 'aprobado', prioridad: 'must' },
        { id: 'r2', estado: 'propuesto', prioridad: 'must' },
        { id: 'r3', estado: 'validado', prioridad: 'could' }
    ];
    assert.deepEqual(resumenRequisitos(lista, elementos), { total: 3, aprobados: 2, sinCubrir: 2, criticosPendientes: 1 });
    assert.deepEqual(resumenRequisitos([], elementos), { total: 0, aprobados: 0, sinCubrir: 0, criticosPendientes: 0 });
});
