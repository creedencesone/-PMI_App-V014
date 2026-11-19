// ============================================
// GESTIÓN DE DATOS (localStorage)
// ============================================

let proyecto = null;
let tiposCambio = { ...TIPOS_CAMBIO_BASE };

// Cargar proyecto seleccionado desde la cartera
function cargarProyecto() {
    let proyectoId = localStorage.getItem('proyectoSeleccionado');
    let todosProyectos = cargarProyectosStorage();
    let proyectoEncontrado = todosProyectos.find(p => p.id == proyectoId);

    if (proyectoEncontrado) {
        proyecto = proyectoEncontrado;
    } else {
        // Crear proyecto nuevo por defecto
        proyecto = {
            id: Date.now(),
            nombre: "Nuevo Proyecto",
            descripcion: "",
            monedaBase: "EUR",
            monedaVenta: "EUR",
            precioVenta: 0,
            condicionesPago: "",
            hitosFinancieros: [],
            stakeholders: [],
            organigrama: [],
            raci: [],
            equipo: [],
            materiales: [],
            servicios: [],
            edt: [{ id: 1, code: "1.0", nombre: "Proyecto", parentId: null, valor: 5 }],
            hitos: [],
            actividades: [],
            entregables: [],
            procesos: JSON.parse(JSON.stringify(PROCESOS_RESUMIDOS)),
            projectManager: {},
            sponsor: {},
            cliente: {},
            acta: {}
        };
        todosProyectos.push(proyecto);
        guardarProyectosStorage(todosProyectos);
        localStorage.setItem('proyectoSeleccionado', proyecto.id);
    }

    // Actualizar interfaz
    document.getElementById('projectName').innerHTML = escapeHtml(proyecto.nombre || '');
    document.getElementById('projectDesc') && (document.getElementById('projectDesc').innerHTML = proyecto.descripcion || '');
    document.getElementById('monedaBase').value = proyecto.monedaBase;
    document.getElementById('precioVenta').value = proyecto.precioVenta;
    document.getElementById('monedaVenta').value = proyecto.monedaVenta;
    document.getElementById('condicionesPago').value = proyecto.condicionesPago || '';
    document.getElementById('monedaDisplay').innerHTML = proyecto.monedaBase;

    actualizarTiposCambioUI();
    actualizarTodo();
}
// Guardar proyecto actual
function guardarProyecto() {
    let todosProyectos = cargarProyectosStorage();
    let index = todosProyectos.findIndex(p => String(p.id) === String(proyecto.id));

    if (index >= 0) {
        todosProyectos[index] = proyecto;
    } else {
        todosProyectos.push(proyecto);
    }

    guardarProyectosStorage(todosProyectos);
    mostrarToast(" Proyecto guardado");
}

// Actualizar todos los módulos
function actualizarTodo() {
    if (typeof renderizarActa === 'function') renderizarActa();
    if (typeof renderizarRoles === 'function') renderizarRoles();
    if (typeof renderizarFinanzas === 'function') renderizarFinanzas();
    if (typeof renderizarStakeholders === 'function') renderizarStakeholders();
    if (typeof renderizarProcesos === 'function') renderizarProcesos();
    if (typeof renderizarEquipo === 'function') renderizarEquipo();
    if (typeof renderizarMateriales === 'function') renderizarMateriales();
    if (typeof renderizarServicios === 'function') renderizarServicios();
    if (typeof renderizarEdt === 'function') renderizarEdt();
    if (typeof renderizarHitos === 'function') renderizarHitos();
    if (typeof renderizarActividades === 'function') renderizarActividades();
    if (typeof renderizarEntregables === 'function') renderizarEntregables();
    if (typeof calcularCashflow === 'function') calcularCashflow();
    if (typeof renderizarKPIs === 'function') renderizarKPIs();
}