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
    document.getElementById('projectName').innerHTML = proyecto.nombre;
    document.getElementById('projectDesc').innerHTML = proyecto.descripcion || '';
    document.getElementById('monedaBase').value = proyecto.monedaBase;
    document.getElementById('precioVenta').value = proyecto.precioVenta;
    document.getElementById('monedaVenta').value = proyecto.monedaVenta;
    document.getElementById('condicionesPago').value = proyecto.condicionesPago || '';
    document.getElementById('monedaDisplay').innerHTML = proyecto.monedaBase;
    
    actualizarTiposCambioUI();
    actualizarTodo();
}
// ============================================================
// APLICAR RESTRICCIONES DE PERMISOS - MÓDULOS VISIBLES
// ============================================================

function aplicarRestriccionesPermisos(usuario) {
    console.log(' aplicarRestriccionesPermisos() ejecutándose...');
    
    if (usuario.role === 'admin') {
        console.log(' Admin - Acceso total a todos los paneles');
        return;
    }
    
    // Obtener el ID del proyecto actual
    var proyectoId = localStorage.getItem('proyectoSeleccionado');
    var permisosModulos = usuario.permisosModulos || {};
    var modulosPermitidos = permisosModulos[proyectoId] || {};
    
    console.log(' Proyecto ID:', proyectoId);
    console.log(' Módulos permitidos:', modulosPermitidos);
    
    // Lista de TODOS los paneles posibles
    var todosLosPaneles = [
        'acta', 'salud', 'finanzas', 'monedas', 'venta', 'cashflow', 
        'resumenGastos', 'avales', 'garantia', 'financiero', 'cronograma', 'riesgos',
        'stakeholders', 'Raci', 'procesos', 'equipo', 'materiales', 'servicios', 
        'logistica', 'viajes', 'comunicaciones', 'beneficios', 'cambios', 'lecciones',
        'sprintBacklog', 'sprintBurndown', 'velocityTracking', 'retrospectives',
        'agileMetrics', 'sprintList', 'agileCostControl'
    ];
    
    // Recorrer todos los elementos del menú
    var elementos = document.querySelectorAll('.nav-header[data-panel], .nav-header.has-submenu, .submenu-item[data-panel]');
    for (var i = 0; i < elementos.length; i++) {
        var el = elementos[i];
        var panelId = el.dataset.panel;
        
        // Si es un submenu sin panel directo, buscar el panel de sus hijos
        if (!panelId && el.classList && el.classList.contains('has-submenu')) {
            var firstChild = el.querySelector('.submenu-item[data-panel]');
            if (firstChild) {
                panelId = firstChild.dataset.panel;
            }
        }
        
        if (panelId) {
            // Verificar si el panel está permitido
            // Si no está en el objeto de permisos, por defecto es true (permitido)
            var permitido = modulosPermitidos[panelId] !== false;
            
            if (!permitido) {
                el.style.display = 'none';
                console.log(' Ocultando panel:', panelId);
            } else {
                el.style.display = '';
                console.log(' Mostrando panel:', panelId);
            }
        }
    }
    
    // Restringir acciones de edición/eliminación
    if (!usuario.permisos || !usuario.permisos.editar) {
        var editBtns = document.querySelectorAll('.edit-btn, .btn-primary:not(.btn-accion-especial)');
        for (var j = 0; j < editBtns.length; j++) {
            editBtns[j].style.display = 'none';
        }
    }
    
    if (!usuario.permisos || !usuario.permisos.eliminar) {
        var deleteBtns = document.querySelectorAll('.delete-btn, .btn-danger');
        for (var k = 0; k < deleteBtns.length; k++) {
            deleteBtns[k].style.display = 'none';
        }
    }
    
    console.log(' Restricciones aplicadas correctamente');
}


// Guardar proyecto actual
function guardarProyecto() {
    let todosProyectos = cargarProyectosStorage();
    let index = todosProyectos.findIndex(p => p.id === proyecto.id);
    
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