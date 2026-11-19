        // ============================================
        // NAVEGACIÓN Y CARGA INICIAL
        // ============================================
         function mostrarPanel(panelId, opts) {
            // Limpiar intervalos de alarmas al cambiar de panel
            if (typeof detenerComprobacionAlarmas === 'function') detenerComprobacionAlarmas();

            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(`panel${panelId}`);
            if(panel) panel.classList.add('active');
            const pid = panelId.toLowerCase();
            if(pid === 'financiero') { inicializarConfigFinanciera(); calcularTodosLosCostesFinancieros(); if (typeof renderizarImportaciones === 'function') renderizarImportaciones(); }
            if(pid === 'cashflow') calcularCashflow();
            if(pid === 'resumengastos') { actualizarResumenGastos(); }
            if(pid === 'cronograma') cargarElementosGantt();
            if(pid === 'ejecucioncronograma') cargarElementosGanttEjecucion();
            if(pid === 'riesgos') { inicializarRiesgos(); renderizarAccionesMitigacion(); document.getElementById('valorProyectoRiesgos').value = proyecto.precioVenta || 0; calcularValorEsperado(); }
            if(pid === 'stakeholders') renderizarStakeholders();
            if(pid === 'raci') renderizarRACI();
            if(pid === 'monedas') { actualizarTiposCambioUI(); mostrarFechaUltimaActualizacion(); poblarSelectMonedas(); setTimeout(actualizarGraficoEvolucionMoneda, 300); }
            if(pid === 'equipo') renderizarEquipo();
            if(pid === 'organigrama') renderizarOrganigrama();
            if(pid === 'cargatrabajo' && typeof renderizarCargaTrabajo === 'function') renderizarCargaTrabajo();
            if(pid === 'materiales') renderizarMateriales();
            if(pid === 'servicios') renderizarServicios();
            if(pid === 'comunicaciones') { renderizarComunicaciones(); renderizarReuniones(); if (typeof renderizarPlanComunicaciones === 'function') renderizarPlanComunicaciones(); document.querySelectorAll('.subpanel-comunicaciones').forEach(el => el.style.display = 'none'); document.getElementById('subpanelComunicaciones').style.display = 'block'; }
            if(pid === 'acta') renderizarActa();
            if(pid === 'procesos') renderizarProcesos();
            if(pid === 'roles') renderizarRoles();
            if(pid === 'viajes') { renderizarViajes(); }
            if(pid === 'avales') { renderizarAvales(); }
            if(pid === 'seguros') { renderizarSeguros(); }
            if(pid === 'garantia') { renderizarGarantia(); }
            if(pid === 'salud') { actualizarPanelSalud(); }
            if(pid === 'beneficios') renderizarBeneficios();
            if(pid === 'cambios') renderizarCambios();
            if(pid === 'lecciones') renderizarLecciones();
            if(pid === 'informe') { actualizarInformeCompleto(); }
            if(pid === 'metricasagiles') actualizarBurnDown();
            if(pid === 'sprintbacklog') renderizarSprintBacklog();
            if(pid === 'sprintburndown') renderizarBurndown();
            if(pid === 'daily') { normalizarDatosAgiles(); renderizarDaily(); }
            if(pid === 'velocitytracking') renderizarVelocityTracking();
            if(pid === 'retrospectives') renderizarRetrospectives();
            if(pid === 'agilemetrics') renderizarAgileMetrics();
            if(pid === 'sprintlist') renderizarListadoSprints();
            if(pid === 'agilecostcontrol') actualizarCostesSprint();
            if(pid === 'logistica') { inicializarModuloLogistica(); }
            if(pid === 'agenda') { cargarAgenda(); }

            // Aplicar permisos de edición por módulo
            var proyectoId = localStorage.getItem('proyectoSeleccionado');
            if (proyectoId && typeof DataService !== 'undefined' && typeof DataService.resolveId === 'function') {
                proyectoId = DataService.resolveId(proyectoId);
            }
            var usuario = AuthSystem.getCurrentUser();
            if (usuario && usuario.role !== 'admin' && proyectoId) {
                var nivel = AuthSystem.getNivelAccesoModulo(proyectoId, panelId.toLowerCase());
                var panelEl = document.getElementById('panel' + panelId);
                if (panelEl) {
                    var editBtns = panelEl.querySelectorAll('.edit-btn, .btn-primary:not(.btn-accion-especial)');
                    var deleteBtns = panelEl.querySelectorAll('.delete-btn, .btn-danger');
                    var mostrar = nivel === 'edit';
                    editBtns.forEach(function(btn) { btn.style.display = mostrar ? '' : 'none'; });
                    deleteBtns.forEach(function(btn) { btn.style.display = mostrar ? '' : 'none'; });
                }
            }

            if (typeof hacerScrollAccesible === 'function') hacerScrollAccesible();

            // Estado de navegación: accesible, enlazable y con foco predecible
            var nombrePanel = String(panelId || '');
            var inferiorPanel = nombrePanel.toLowerCase();
            document.querySelectorAll('.nav-header[data-panel], .submenu-item[data-panel]').forEach(function (nav) {
                var activo = (nav.getAttribute('data-panel') || '').toLowerCase() === inferiorPanel;
                nav.classList.toggle('active', activo);
                if (activo) nav.setAttribute('aria-current', 'page');
                else nav.removeAttribute('aria-current');
            });

            if (!opts || opts.url !== false) {
                var hashPanel = '#panel' + nombrePanel;
                if (window.location.hash !== hashPanel) {
                    if (opts && opts.replaceUrl) window.history.replaceState(null, '', hashPanel);
                    else window.history.pushState(null, '', hashPanel);
                }
            }

            var activoActual = document.activeElement;
            var debeMoverFoco = !opts || opts.foco === true ||
                !activoActual || activoActual === document.body ||
                (activoActual.closest && activoActual.closest('.sidebar'));
            if (debeMoverFoco) {
                var destinoFoco = panel && panel.querySelector('h2, h1, .panel-title, [data-titulo-panel]');
                if (!destinoFoco && panel) {
                    panel.setAttribute('tabindex', '-1');
                    destinoFoco = panel;
                }
                if (destinoFoco) {
                    setTimeout(function () {
                        try { destinoFoco.focus({ preventScroll: true }); }
                        catch (e) { destinoFoco.focus(); }
                    }, 0);
                }
            }
        }

 async function cargarProyecto() {
    // Verificar autenticación: requiere sesión local O token API
    const tieneSesionLocal = !!AuthSystem.getCurrentUser();
    const tieneTokenAPI = typeof DataService !== 'undefined' && DataService.getToken();

    if (!tieneSesionLocal && !tieneTokenAPI) {
        console.warn(' Usuario no autenticado, redirigiendo a login');
        window.location.href = 'index.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    let idRaw = localStorage.getItem('proyectoSeleccionado');
    if (idRaw && typeof DataService !== 'undefined' && typeof DataService.resolveId === 'function') {
        const idResuelto = DataService.resolveId(idRaw);
        if (String(idResuelto) !== String(idRaw)) {
            idRaw = String(idResuelto);
            localStorage.setItem('proyectoSeleccionado', idRaw);
        }
    }
    let id = parseInt(idRaw, 10);
    // Los IDs de Supabase son UUID (string): NO usar parseInt para decidir la ruta
    const idEsValido = !!idRaw && idRaw !== 'null' && idRaw !== 'undefined';

    // Intentar cargar desde API primero (solo si hay token, para no pisar datos locales)
    if (idEsValido && typeof DataService !== 'undefined' && DataService.getToken()) {
        try {
            const apiResult = await DataService.getProject(idRaw);
            if (apiResult && apiResult.project && apiResult.project.data
                && !(typeof DataService.isProjectDeleted === 'function' && DataService.isProjectDeleted(String(apiResult.project.id)))) {
                const apiProyecto = { ...apiResult.project.data, id: apiResult.project.id, _fromApi: true };
                let todos = cargarProyectosStorage();
                let idx = todos.findIndex(p => String(p.id) === idRaw || p.id === id);
                if (idx >= 0) {
                    const merged = { ...todos[idx], ...apiProyecto };
                    todos[idx] = merged;
                    proyecto = merged;
                } else {
                    todos.push(apiProyecto);
                    proyecto = apiProyecto;
                }
                guardarProyectosStorage(todos);
            }
        } catch (e) {
            console.log(' API no disponible para cargar proyecto, usando localStorage');
        }
    }

    if (!proyecto) {
        let todos = cargarProyectosStorage();
        let p = null;
        if (idEsValido) {
            p = todos.find(p => String(p.id) === idRaw || p.id === id);
        }
        if (!p && todos.length > 0) {
            console.warn(' Proyecto con ID', idRaw, 'no encontrado. Cargando primero disponible.');
            p = todos[0];
            localStorage.setItem('proyectoSeleccionado', String(p.id));
        }
        if(p) {
            proyecto = p;
        }
    }

    if(proyecto) {
        if(!proyecto.configAranceles) proyecto.configAranceles = [];
        if(!proyecto.tasasAduanerasFijas) proyecto.tasasAduanerasFijas = [];
        if(!proyecto.costesFinancierosExtra) proyecto.costesFinancierosExtra = [];
        ['proveedores', 'contratos', 'ordenesCompra', 'pagosRealizados', 'lineasBase', 'cambios', 'bitacora', 'planComunicaciones'].forEach(function (clave) {
            if (!Array.isArray(proyecto[clave])) proyecto[clave] = [];
        });
        if(!proyecto.hitosFinancieros) proyecto.hitosFinancieros = [];
        if(!proyecto.stakeholders) proyecto.stakeholders = [];
        if(!proyecto.organigrama) proyecto.organigrama = [];
        if(!proyecto.raci) proyecto.raci = [];
        if(!proyecto.equipo) proyecto.equipo = [];
        if(!proyecto.materiales) proyecto.materiales = [];
        if(!proyecto.servicios) proyecto.servicios = [];
        if(!proyecto.comunicaciones) proyecto.comunicaciones = [];
        if(!proyecto.reuniones) proyecto.reuniones = [];
        if(!proyecto.riesgos) proyecto.riesgos = [];
        if(!proyecto.accionesMitigacion) proyecto.accionesMitigacion = [];
        if(!proyecto.elementosGantt) proyecto.elementosGantt = [];
        sincronizarProcesosConPMBOK(proyecto);
        if(!proyecto.monedaVenta) proyecto.monedaVenta = proyecto.monedaBase;
        if(!proyecto.condicionesPago) proyecto.condicionesPago = "";
        if(!proyecto.acta) proyecto.acta = {};
        if(!proyecto.viajes) proyecto.viajes = [];
        if(!proyecto.avales) proyecto.avales = [];           //  NUEVO: Inicializar avales
        if(!proyecto.seguros) proyecto.seguros = [];         //  NUEVO: Inicializar seguros
        if(!proyecto.garantia) proyecto.garantia = null;     //  NUEVO: Inicializar garantia
        if(!proyecto.defectos) proyecto.defectos = 0;
        if(!proyecto.velocidadEquipo) proyecto.velocidadEquipo = 0;
        if(!proyecto.huellaCarbono) proyecto.huellaCarbono = 0;
        if(!proyecto.satisfacciones) proyecto.satisfacciones = [];
        if(!proyecto.satisfaccionPromedio) proyecto.satisfaccionPromedio = 0;
        if(!proyecto.beneficios) proyecto.beneficios = { proyectado: 0, real: 0, historial: [], hitos: [] };
        // Dentro de cargarProyecto(), después de las otras inicializaciones
        if (!proyecto.metodologia) {
    proyecto.metodologia = {
        tipo: 'cascada',
        fasesAgile: [],
        fechaTransicion: null
    };
}
        sincronizarActaConProyecto();
    } else {
        if (idEsValido) {
            console.warn(' Proyecto seleccionado no encontrado. Volviendo al dashboard.');
            localStorage.removeItem('proyectoSeleccionado');
            window.location.href = 'dashboard.html';
            return;
        }

        //  NUEVO PROYECTO - AHORA CON AVALES Y GARANTIA
        proyecto = {
            id: parseInt(id) || Date.now(),
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
            procesos: JSON.parse(JSON.stringify(PROCESOS_PMBOK)),
            projectManager: {},
            sponsor: {},
            cliente: {},
            acta: {},
            configAranceles: [],
            tasasAduanerasFijas: [],
            costesFinancierosExtra: [],
            elementosGantt: [],
            riesgos: [],
            accionesMitigacion: [],
            comunicaciones: [],
            reuniones: [],
            viajes: [],           //  Viajes
            avales: [],           //  Avales y garantías bancarias
            seguros: [],          //  Seguros y RC
            garantia: null,       //  Garantía del proyecto
            defectos: 0,
            velocidadEquipo: 0,
            huellaCarbono: 0,
            satisfacciones: [],
            satisfaccionPromedio: 0,
            metodologia: { tipo: 'cascada', fasesAgile: [], fechaTransicion: null },
            beneficios: { proyectado: 0, real: 0, historial: [], hitos: [] }
        };
        sincronizarActaConProyecto();
        // Persistir de inmediato: sin esto el proyecto sólo vivía en memoria
        // y desaparecía al recargar o al volver a la cartera.
        localStorage.setItem('proyectoSeleccionado', String(proyecto.id));
        const todosProyectos = cargarProyectosStorage();
        const indice = todosProyectos.findIndex(p => String(p.id) === String(proyecto.id));
        if (indice >= 0) todosProyectos[indice] = proyecto;
        else todosProyectos.push(proyecto);
        guardarProyectosStorage(todosProyectos);
    }
    document.getElementById('projectName').innerHTML = escapeHtml(proyecto.nombre || '');
    document.getElementById('projectDesc') && (document.getElementById('projectDesc').innerHTML = proyecto.descripcion || '');
    const monedaBaseSelect = document.getElementById('monedaBase');
    if(monedaBaseSelect) monedaBaseSelect.innerHTML = Object.keys(MONEDAS).map(m => `<option value="${m}" ${proyecto.monedaBase === m ? 'selected' : ''}>${m} - ${MONEDAS[m]}</option>`).join('');
    const monedaVentaSelect = document.getElementById('monedaVenta');
    if(monedaVentaSelect) monedaVentaSelect.innerHTML = Object.keys(MONEDAS).map(m => `<option value="${m}" ${(proyecto.monedaVenta || proyecto.monedaBase) === m ? 'selected' : ''}>${m} - ${MONEDAS[m]}</option>`).join('');
    const monedaVenta2Select = document.getElementById('monedaVenta2');
    if(monedaVenta2Select) monedaVenta2Select.innerHTML = Object.keys(MONEDAS).map(m => `<option value="${m}" ${(proyecto.monedaVenta || proyecto.monedaBase) === m ? 'selected' : ''}>${m} - ${MONEDAS[m]}</option>`).join('');
    document.getElementById('precioVenta').value = proyecto.precioVenta || 0;
    document.getElementById('precioVenta2').value = proyecto.precioVenta || 0;
    document.getElementById('condicionesPago').value = proyecto.condicionesPago || '';
    document.getElementById('condicionesPago2').value = proyecto.condicionesPago || '';
    document.getElementById('monedaDisplay').innerHTML = proyecto.monedaBase;
    actualizarTiposCambioUI();
    inicializarConfigFinanciera();
    inicializarRiesgos();
    renderizarActa();
    renderizarRoles();
    renderizarStakeholders();
    renderizarProcesos();
    renderizarEquipo();
    renderizarMateriales();
    renderizarServicios();
    renderizarHitosFinancieros();
    renderizarAvales();        //  Añadir esta línea
    renderizarSeguros();       //  Añadir esta línea
    renderizarGarantia();      //  Añadir esta línea
    calcularCashflow();
    cargarElementosGantt();
    renderizarComunicaciones();
    renderizarReuniones();
    renderizarViajes();        //  Añadir esta línea
    if (typeof renderizarOrganigrama === 'function') renderizarOrganigrama();
    mostrarFechaUltimaActualizacion();
    inicializarBeneficios();
    inicializarCambios();
    inicializarLecciones();
    inicializarMetricasAgiles();

    if (!proyecto.scrum) {
    proyecto.scrum = {
        sprints: [],
        sprintActivo: null,
        historias: [],
        retrospectivas: [],
        metricas: {
            leadTime: [],
            cycleTime: [],
            throughput: [],
            predictibilidad: []
        }

    };
}
    inicializarScrum();
    if (typeof mostrarPanelesSegunMetodologia === 'function') mostrarPanelesSegunMetodologia();
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

    var proyectoId = localStorage.getItem('proyectoSeleccionado');
    if (proyectoId && typeof DataService !== 'undefined' && typeof DataService.resolveId === 'function') {
        proyectoId = DataService.resolveId(proyectoId);
    }

    var elementos = document.querySelectorAll('.nav-header[data-panel], .nav-header.has-submenu, .submenu-item[data-panel]');
    for (var i = 0; i < elementos.length; i++) {
        var el = elementos[i];
        var panelId = el.dataset.panel;

        if (!panelId && el.classList && el.classList.contains('has-submenu')) {
            var firstChild = el.querySelector('.submenu-item[data-panel]');
            if (firstChild) panelId = firstChild.dataset.panel;
        }

        if (panelId) {
            var nivel = AuthSystem.getNivelAccesoModulo(proyectoId, panelId);
            if (nivel === 'none') {
                el.style.display = 'none';
                console.log(' Ocultando panel:', panelId);
            } else {
                el.style.display = '';
                console.log(' Mostrando panel:', panelId, '(' + nivel + ')');
            }
        }
    }

    console.log(' Restricciones aplicadas correctamente');
}
// ============================================================
// ACTUALIZAR UI DEL USUARIO EN PROYECTO
// ============================================================

function actualizarUIProyecto(usuario) {
    if (!usuario) return;

    // Avatar
    var avatar = document.getElementById('userAvatar');
    if (avatar) avatar.textContent = usuario.nombre.charAt(0).toUpperCase();

    // Nombre
    var nombre = document.getElementById('userNameDisplay');
    if (nombre) nombre.textContent = usuario.nombre;

    // Rol
    var rol = document.getElementById('userRoleDisplay');
    if (rol) {
        var roleInfo = AuthSystem.getRoleInfo(usuario.role);
        rol.textContent = roleInfo?.nombre || usuario.role;
        rol.style.color = roleInfo?.color || '#888';
    }

    // Mostrar controles de compartir (todos los usuarios autenticados)
    var adminControls = document.getElementById('adminControlsProyecto');
    if (adminControls) {
        adminControls.style.display = 'block';
    }
}
// ============================================================
// CERRAR SESIÓN DESDE PROYECTO
// ============================================================

function cerrarSesionProyecto() {
    if (confirm(tApp('confirmar_cerrar_sesion'))) {
        if (typeof DataService !== 'undefined') DataService.stopAutoSync();
        AuthSystem.logout();
        window.location.href = 'index.html';
    }
}

// Alias global para el botón de cerrar sesión
window.cerrarSesionProyecto = cerrarSesionProyecto;
// Alias global para botón de sync manual
window.syncNowManual = syncNowManual;
// ============================================================
// FUNCIONES DE GESTIÓN (enlazadas a dashboard)
// ============================================================

// ============================================================
// COMPARTIR PROYECTO
// ============================================================

var proyectosCompartidosCargados = [];

function mostrarGestionUsuarios() {
    var modal = document.getElementById('modalCompartir');
    if (!modal) {
        mostrarToast(' Modal de compartir no encontrado', 'error');
        return;
    }
    modal.classList.remove('u-hidden');
    modal.style.display = 'flex';
    if (typeof window.abrirModalAccesible === 'function') window.abrirModalAccesible(modal);
    document.getElementById('shareEmail').value = '';
    document.getElementById('shareRole').value = 'editor';
    document.getElementById('sharedUsersList').innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Cargando...</p>';
    cargarUsuariosCompartidos();
}

function cerrarModalCompartir() {
    var modal = document.getElementById('modalCompartir');
    if (modal) { modal.classList.add('u-hidden'); modal.style.display = 'none'; }
}

function getCurrentProjectId() {
    return typeof proyecto !== 'undefined' && proyecto ? proyecto.id : null;
}

async function cargarUsuariosCompartidos() {
    var listEl = document.getElementById('sharedUsersList');
    var projectId = getCurrentProjectId();
    if (!projectId) {
        listEl.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">No hay proyecto seleccionado</p>';
        return;
    }
    try {
        var data = await DataService.listProjectUsers(projectId);
        proyectosCompartidosCargados = data.users || [];
        renderizarUsuariosCompartidos();
    } catch (e) {
        listEl.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">No se pudieron cargar los usuarios</p>';
    }
}

function renderizarUsuariosCompartidos() {
    var listEl = document.getElementById('sharedUsersList');
    if (!proyectosCompartidosCargados.length) {
        listEl.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Solo tú tienes acceso a este proyecto</p>';
        return;
    }
    var html = '';
    proyectosCompartidosCargados.forEach(function(u) {
        var esPropietario = u.role === 'owner';
        html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:rgba(255,255,255,0.03);border-radius:8px;">';
        html += '<div><div style="font-weight:500;font-size:14px;">' + escapeHtml(u.name || u.email) + '</div>';
        html += '<div style="font-size:11px;color:var(--text-muted);">' + escapeHtml(u.email) + ' · <span style="text-transform:capitalize;">' + escapeHtml(u.role || '') + '</span></div></div>';
        if (!esPropietario) {
            html += '<button class="btn btn-danger btn-small" onclick="eliminarUsuarioCompartido(' + Number(u.id) + ')" style="padding:6px 12px;font-size:12px;"></button>';
        } else {
            html += '<span style="font-size:11px;color:var(--text-muted);"> Propietario</span>';
        }
        html += '</div>';
    });
    listEl.innerHTML = html;
}

async function compartirProyecto() {
    var email = document.getElementById('shareEmail').value.trim();
    var role = document.getElementById('shareRole').value;
    var btn = document.getElementById('btnCompartir');
    var projectId = getCurrentProjectId();

    if (!email) {
        mostrarToast(' Introduce un correo electrónico', 'error');
        return;
    }
    if (!projectId) {
        mostrarToast(' No hay proyecto seleccionado', 'error');
        return;
    }

    btn.disabled = true;
    btn.textContent = ' Añadiendo...';

    try {
        await DataService.addProjectUser(projectId, email, role);
        mostrarToast(' Usuario añadido correctamente', 'success');
        document.getElementById('shareEmail').value = '';
        await cargarUsuariosCompartidos();
    } catch (e) {
        var msg = e.message || 'Error al añadir usuario';
        if (msg.includes('409')) msg = 'Ese usuario no existe o ya tiene acceso';
        mostrarToast(' ' + msg, 'error');
    }

    btn.disabled = false;
    btn.textContent = ' Añadir usuario';
}

async function eliminarUsuarioCompartido(userId) {
    var projectId = getCurrentProjectId();
    if (!projectId || !confirm('¿Eliminar este usuario del proyecto?')) return;

    try {
        await DataService.removeProjectUser(projectId, userId);
        mostrarToast(' Usuario eliminado', 'success');
        await cargarUsuariosCompartidos();
    } catch (e) {
        mostrarToast(' Error al eliminar usuario', 'error');
    }
}

function mostrarGestionPermisos() {
    mostrarToast(' Abriendo compartir...', 'info');
    mostrarGestionUsuarios();
}

// Sobrescribir mostrarLogin si no existe
if (typeof mostrarLogin === 'undefined') {
    function mostrarLogin() {
        window.location.href = 'index.html';
    }
}

function initNavegacion() {
    document.querySelectorAll('.nav-header[data-panel]').forEach(header => {
        header.addEventListener('click', () => {
            let panelId = header.getAttribute('data-panel');
            mostrarPanel(panelId.charAt(0).toUpperCase() + panelId.slice(1));
        });
    });
    document.querySelectorAll('.nav-header.has-submenu').forEach(header => {
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            let submenuId = header.getAttribute('data-submenu');
            let submenu = document.querySelector(`.submenu[data-submenu="${submenuId}"]`);
            if(submenu) submenu.classList.toggle('show');
            let arrow = header.querySelector('.nav-arrow');
            if(arrow) arrow.classList.toggle('expanded');
        });
    });
    document.querySelectorAll('.submenu-item').forEach(item => {
        item.addEventListener('click', () => {
            let panelId = item.getAttribute('data-panel');
            if (panelId) mostrarPanel(panelId.charAt(0).toUpperCase() + panelId.slice(1));
        });
    });

    function abrirPanelDesdeHash() {
        const coincidencia = /^#panel(.+)$/.exec(window.location.hash || '');
        if (!coincidencia) return;
        const id = coincidencia[1];
        if (document.getElementById('panel' + id) && typeof mostrarPanel === 'function') {
            mostrarPanel(id, { foco: true, url: false, replaceUrl: true });
        }
    }
    window.addEventListener('hashchange', abrirPanelDesdeHash);
    window.addEventListener('popstate', abrirPanelDesdeHash);
    setTimeout(abrirPanelDesdeHash, 400);
}

window.procesoActivo = 'Inicio';

function setActiveProceso(fase, opts) {
    if (!fase) fase = 'Inicio';
    window.procesoActivo = fase;
    document.querySelectorAll('.proceso-tab').forEach(function(tab) {
        tab.classList.toggle('active', tab.getAttribute('data-fase') === fase);
    });
    if (typeof actualizarVisibilidadGrupos === 'function') {
        actualizarVisibilidadGrupos();
    }
    const FASE_PANEL_INICIAL = {
        'Inicio': 'Salud',
        'Planificación': 'Cronograma',
        'Ejecución': (typeof proyecto !== 'undefined' && proyecto?.metodologia?.tipo === 'agile') ? 'SprintBacklog' : 'EjecucionCronograma',
        'Monitoreo y Control': 'Salud',
        'Cierre': 'Lecciones'
    };
    const procedeNavegar = !opts || opts.navegar !== false;
    const panelDestino = procedeNavegar ? FASE_PANEL_INICIAL[fase] : null;
    if (panelDestino && typeof mostrarPanel === 'function') {
        mostrarPanel(panelDestino);
    }
}
window.setActiveProceso = setActiveProceso;

function toggleNavGroup(header) {
    if (!header) return;
    const group = header.closest('.nav-group');
    if (group) group.classList.toggle('collapsed');
}
window.toggleNavGroup = toggleNavGroup;

function cerrarModalSatisfaccion() {
    const modal = document.getElementById('modalSatisfaccion');
    if (modal) modal.style.display = 'none';
}
// ============================================
// SISTEMA DE NUMERACIÓN JERÁRQUICA EDT-ACTIVIDAD (CORREGIDO)
// ============================================

function obtenerPrefijoEDT(elementos, edtId, visitados) {
    const edt = elementos.find(e => e.id === edtId);
    if (!edt) return '';
    const vistos = visitados || new Set();
    if (vistos.has(edtId)) return '';
    vistos.add(edtId);

    // Buscar el prefijo de la EDT padre
    let prefijo = '';
    if (edt.dependeDe) {
        const padreEDT = elementos.find(e => e.id === edt.dependeDe && e.tipo === 'edt');
        if (padreEDT) {
            prefijo = obtenerPrefijoEDT(elementos, padreEDT.id, vistos);
        }
    }

    // Obtener todas las EDT al mismo nivel (mismo padre)
    const mismasEdt = elementos
        .filter(e => e.tipo === 'edt' && e.dependeDe === edt.dependeDe)
        .sort((a, b) => a.id - b.id); // Ordenar por ID para mantener consistencia

    const indice = mismasEdt.findIndex(e => e.id === edtId) + 1;

    return prefijo ? `${prefijo}.${indice}` : `${indice}`;
}

function obtenerNumeroActividad(elementos, actividadId) {
    const actividad = elementos.find(e => e.id === actividadId);
    if (!actividad) return '';

    // Si la actividad tiene una EDT padre (dependeDe)
    if (actividad.dependeDe) {
        const edtPadre = elementos.find(e => e.id === actividad.dependeDe && e.tipo === 'edt');
        if (edtPadre) {
            const prefijoEDT = obtenerPrefijoEDT(elementos, edtPadre.id);
            // Contar actividades bajo esta EDT, ordenadas por ID
            const actividadesHijas = elementos
                .filter(e => e.tipo === 'actividad' && e.dependeDe === edtPadre.id)
                .sort((a, b) => a.id - b.id);
            const indice = actividadesHijas.findIndex(a => a.id === actividadId) + 1;
            return `${prefijoEDT}.${indice}`;
        }
    }

    // Si no tiene EDT padre, usar numeración simple
    const actividadesSinPadre = elementos
        .filter(e => e.tipo === 'actividad' && (!e.dependeDe || !elementos.find(edt => edt.id === e.dependeDe)))
        .sort((a, b) => a.id - b.id);
    const indice = actividadesSinPadre.findIndex(a => a.id === actividadId) + 1;
    return `${indice}`;
}

function obtenerNumeroEntregable(elementos, entregableId) {
    const entregable = elementos.find(e => e.id === entregableId);
    if (!entregable) return '';

    if (entregable.dependeDe) {
        const edtPadre = elementos.find(e => e.id === entregable.dependeDe && e.tipo === 'edt');
        if (edtPadre) {
            const prefijoEDT = obtenerPrefijoEDT(elementos, edtPadre.id);
            const entregablesHijos = elementos
                .filter(e => e.tipo === 'entregable' && e.dependeDe === edtPadre.id)
                .sort((a, b) => a.id - b.id);
            const indice = entregablesHijos.findIndex(en => en.id === entregableId) + 1;
            return `${prefijoEDT}.${indice}`;
        }
    }

    const entregablesSinPadre = elementos
        .filter(e => e.tipo === 'entregable' && (!e.dependeDe || !elementos.find(edt => edt.id === e.dependeDe)))
        .sort((a, b) => a.id - b.id);
    const indice = entregablesSinPadre.findIndex(en => en.id === entregableId) + 1;
    return `E-${indice}`;
}

function obtenerNumeroHito(elementos, hitoId) {
    const hito = elementos.find(e => e.id === hitoId);
    if (!hito) return '';

    if (hito.dependeDe) {
        const edtPadre = elementos.find(e => e.id === hito.dependeDe && e.tipo === 'edt');
        if (edtPadre) {
            const prefijoEDT = obtenerPrefijoEDT(elementos, edtPadre.id);
            const hitosHijos = elementos
                .filter(e => e.tipo === 'hito' && e.dependeDe === edtPadre.id)
                .sort((a, b) => a.id - b.id);
            const indice = hitosHijos.findIndex(h => h.id === hitoId) + 1;
            return `H-${prefijoEDT}.${indice}`;
        }
    }

    const hitosSinPadre = elementos
        .filter(e => e.tipo === 'hito' && (!e.dependeDe || !elementos.find(edt => edt.id === e.dependeDe)))
        .sort((a, b) => a.id - b.id);
    const indice = hitosSinPadre.findIndex(h => h.id === hitoId) + 1;
    return `H-${indice}`;
}

function obtenerCodigoElemento(elemento, elementos) {
    if (!elemento || !elementos || !elementos.length) return '';
    if (typeof WbsCodeService !== 'undefined') {
        return WbsCodeService.generar(elementos).codigos.get(elemento.id) || elemento.codigo || '';
    }
    // Numeración WBS unificada: todos los hijos de un mismo padre se numeran
    // en secuencia (actividades, entregables e hitos comparten jerarquía).
    const hijosDe = new Map();
    elementos.forEach(e => {
        const key = (e.dependeDe == null) ? 'root' : String(e.dependeDe);
        if (!hijosDe.has(key)) hijosDe.set(key, []);
        hijosDe.get(key).push(e);
    });
    const codigos = {};
    const visitados = new Set();
    const walk = (key, prefijo) => {
        if (visitados.has(key)) return;
        visitados.add(key);
        const hijos = (hijosDe.get(key) || []).slice().sort((a, b) => {
            const ca = a.codigo || '';
            const cb = b.codigo || '';
            if (ca && cb && ca !== cb) return ca.localeCompare(cb, 'es', { numeric: true });
            return (a.id || 0) - (b.id || 0);
        });
        hijos.forEach((h, i) => {
            const code = prefijo ? `${prefijo}.${i + 1}` : String(i + 1);
            codigos[h.id] = code;
            walk(String(h.id), code);
        });
    };
    walk('root', '');
    return codigos[elemento.id] || '';
}

        // ============================================
        // MATRIZ RACI - VERSIÓN CORREGIDA
        // ============================================
        function escAttr(str) {
            return String(str == null ? '' : str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function getActividadesRACI() {
            const filas = [];

            const elementos = proyecto.elementosGantt || [];
            const tareas = elementos.filter(e => e.tipo === 'actividad').sort((a, b) => a.id - b.id);
            const entregables = elementos.filter(e => e.tipo === 'entregable').sort((a, b) => a.id - b.id);

            tareas.forEach(e => filas.push({ key: 'elem:' + e.id, nombre: e.nombre, grupo: 'CRONOGRAMA' }));
            entregables.forEach(e => filas.push({ key: 'elem:' + e.id, nombre: e.nombre, grupo: 'ENTREGABLES' }));

            return filas;
        }

        function renderizarRACI() {
            const container = document.getElementById('raciContent');
            if (!container) {
                console.log(" No se encuentra el contenedor raciContent");
                return;
            }

            if (!proyecto.stakeholders || proyecto.stakeholders.length === 0) {
                container.innerHTML = '<div class="info-card"> No hay stakeholders registrados. Agrega stakeholders primero en el panel de Stakeholders.</div>';
                return;
            }

            const actividades = getActividadesRACI();
            if (!proyecto.raci) proyecto.raci = [];
            const actKeys = {};
            const actNames = {};
            actividades.forEach(a => { actKeys[a.key] = true; actNames[a.nombre] = true; });
            const raciLen = proyecto.raci.length;
            proyecto.raci = proyecto.raci.filter(r => (r.actividadKey && actKeys[r.actividadKey]) || (!r.actividadKey && actNames[r.actividad]));
            if (proyecto.raci.length !== raciLen) guardarProyecto();

            if (actividades.length === 0) {
                container.innerHTML = '<div class="info-card"> No hay actividades en el cronograma. Añade actividades o entregables desde el panel Cronograma para empezar a asignar roles RACI.</div>';
                return;
            }

            let html = '<div class="raci-table u-overflow-x-auto"><table class="data-table" style="min-width: 500px;"><thead><tr><th>Actividad</th>';

            proyecto.stakeholders.forEach(s => {
                html += `<th class="u-fs-11">${escapeHtml(s.nombre.substring(0, 12))}</th>`;
            });
            html += '</tr></thead><tbody>';

            let grupoActual = null;
            actividades.forEach(act => {
                if (act.grupo !== grupoActual) {
                    grupoActual = act.grupo;
                    const label = grupoActual === 'CRONOGRAMA' ? ' Tareas del Cronograma' : ' Entregables';
                    html += `<tr class="raci-seccion"><td colspan="${proyecto.stakeholders.length + 1}">${label}</td></tr>`;
                }
                html += `<tr><td class="u-bold">${escapeHtml(act.nombre)}</td>`;
                proyecto.stakeholders.forEach(s => {
                    const raciItem = proyecto.raci.find(r => r.stakeholderId === s.id && ((r.actividadKey && r.actividadKey === act.key) || r.actividad === act.nombre));
                    const valor = raciItem ? raciItem.rol : '';
                    html += `<td class="u-text-center">
                        <select class="raci-select" aria-label="Rol RACI de ${escAttr(s.nombre || s.email || ('stakeholder ' + s.id))} en ${escAttr(act.nombre)}" style="width: 55px; padding: 4px; font-size: 11px;" onchange="guardarRACI('${escAttr(act.key)}', '${escAttr(act.nombre)}', ${s.id}, this.value)">
                            <option value="">-</option>
                            <option value="R" ${valor === 'R' ? 'selected' : ''}>R</option>
                            <option value="A" ${valor === 'A' ? 'selected' : ''}>A</option>
                            <option value="C" ${valor === 'C' ? 'selected' : ''}>C</option>
                            <option value="I" ${valor === 'I' ? 'selected' : ''}>I</option>
                        </select>
                    </td>`;
                });
                html += '</tr>';
            });

            html += `</tbody></table>
            <div class="info-card u-mt-16 raci-legend">
                <span class="raci-badge raci-badge-r">R</span><span class="raci-legend-text">Responsable (quien ejecuta)</span>
                <span class="raci-badge raci-badge-a">A</span><span class="raci-legend-text">Accountable (quien responde/aprueba)</span>
                <span class="raci-badge raci-badge-c">C</span><span class="raci-legend-text">Consultado</span>
                <span class="raci-badge raci-badge-i">I</span><span class="raci-legend-text">Informado</span>
            </div></div>`;

            container.innerHTML = html;
            console.log(" Matriz RACI renderizada correctamente");
        }

        function guardarRACI(key, actividad, stakeholderId, rol) {
            const antes = (proyecto.raci || []).find(r => r.stakeholderId === stakeholderId && r.actividadKey === key) || null;
            asignarRolRACI(proyecto, key, actividad, stakeholderId, rol);
            if (typeof registrarBitacora === 'function') registrarBitacora('raci', stakeholderId, 'actualizar', antes, proyecto.raci.find(r => r.stakeholderId === stakeholderId && r.actividadKey === key) || null);
            guardarProyecto();
            if (typeof renderizarRACI === 'function') renderizarRACI();
            const problemas = validarRACI(proyecto, typeof getActividadesRACI === 'function' ? getActividadesRACI() : []);
            if (problemas.length) {
                mostrarToast(`Rol ${rol} asignado · ${problemas.length} fila(s) sin responsable único`, 'error');
            } else {
                mostrarToast(` Rol ${rol} asignado para "${actividad}"`, 'success');
            }
        }
function actualizarFechasProyectoDesdeActa() {
    if (proyecto.acta && proyecto.acta.fechaInicio) {
        proyecto.fechaInicio = proyecto.acta.fechaInicio;
    }
    if (proyecto.acta && proyecto.acta.fechaFin) {
        proyecto.fechaFinPlan = proyecto.acta.fechaFin;
    }
    guardarProyecto();
    if (typeof renderizarCronograma === 'function') renderizarCronograma();
    mostrarToast(" Fechas del proyecto sincronizadas con el Acta", 'success');
}
// ============================================================
// PERFIL DE USUARIO
// ============================================================

function mostrarModalPerfil() {
    var modal = document.getElementById('modalPerfil');
    if (!modal) return;
    var usuario = AuthSystem.getCurrentUser();
    if (!usuario) return;
    document.getElementById('perfilNombre').value = usuario.nombre || '';
    document.getElementById('perfilEmail').value = usuario.email || '';
    var roleInfo = AuthSystem.getRoleInfo(usuario.role);
    document.getElementById('perfilRol').value = roleInfo?.nombre || usuario.role || '';
    document.getElementById('perfilPasswordActual').value = '';
    document.getElementById('perfilPasswordNueva').value = '';
    document.getElementById('perfilPasswordNueva2').value = '';
    document.getElementById('perfilError').style.display = 'none';
    modal.classList.remove('u-hidden');
    modal.style.display = 'flex';
    if (typeof window.abrirModalAccesible === 'function') window.abrirModalAccesible(modal);
}

function cerrarModalPerfil() {
    var modal = document.getElementById('modalPerfil');
    if (modal) { modal.classList.add('u-hidden'); modal.style.display = 'none'; }
}

function mostrarErrorPerfil(msg) {
    var el = document.getElementById('perfilError');
    if (!el) return;
    el.textContent = ' ' + msg;
    el.style.display = 'block';
}

async function guardarPerfil() {
    var nombre = document.getElementById('perfilNombre').value.trim();
    var email = document.getElementById('perfilEmail').value.trim();
    var passActual = document.getElementById('perfilPasswordActual').value;
    var passNueva = document.getElementById('perfilPasswordNueva').value;
    var passNueva2 = document.getElementById('perfilPasswordNueva2').value;
    var btn = document.getElementById('btnGuardarPerfil');

    if (!nombre) {
        mostrarErrorPerfil('El nombre es obligatorio');
        return;
    }

    document.getElementById('perfilError').style.display = 'none';
    btn.disabled = true;
    btn.textContent = ' Guardando...';

    var warnings = [];

    // Intentar API primero
    if (typeof DataService !== 'undefined' && DataService.getToken()) {
        try {
            var body = { name: nombre };
            var emailChanged = email && email !== (AuthSystem.getCurrentUser()?.email || '');
            if (emailChanged) {
                if (!passActual) {
                    mostrarErrorPerfil('Introduce tu contraseña actual para cambiar el email');
                    btn.disabled = false;
                    btn.textContent = ' Guardar cambios';
                    return;
                }
                body.email = email;
                body.current_password = passActual;
            }
            var result = await DataService.updateProfile(body);

            // Actualizar token y sesión local
            if (result.token) {
                DataService.setToken(result.token);
            }

            // Actualizar AuthSystem local
            var usuario = AuthSystem.getCurrentUser();
            if (usuario) {
                usuario.nombre = result.user.name || nombre;
                if (result.user.email) usuario.email = result.user.email;
                AuthSystem.updateUser(usuario);
            }

            // Cambiar contraseña si se solicitó
            if (passNueva || passNueva2) {
                if (passNueva !== passNueva2) {
                    warnings.push('Las contraseñas nuevas no coinciden');
                } else if (passNueva.length < 6) {
                    warnings.push('La nueva contraseña debe tener al menos 6 caracteres');
                } else if (!passActual) {
                    warnings.push('Introduce la contraseña actual para cambiarla');
                } else {
                    try {
                        await DataService.changePassword({ current_password: passActual, new_password: passNueva });
                        warnings.push(' Contraseña cambiada');
                    } catch (e) {
                        warnings.push('Error al cambiar contraseña: ' + (e.message || ''));
                    }
                }
            }

            btn.textContent = ' Guardado';
            if (warnings.length > 0) {
                mostrarToast(warnings.join(' · '), 'info');
            } else {
                mostrarToast(' Perfil actualizado', 'success');
            }
            cerrarModalPerfil();
            // Refrescar UI del usuario
            if (typeof actualizarUIProyecto === 'function') {
                actualizarUIProyecto(AuthSystem.getCurrentUser());
            }
        } catch (e) {
            mostrarErrorPerfil(e.message || 'Error al guardar');
        }
    } else {
        // Fallback local
        var usuario = AuthSystem.getCurrentUser();
        if (usuario) {
            usuario.nombre = nombre;
            usuario.email = email;
            AuthSystem.updateUser(usuario);
        }
        if (passNueva || passNueva2) {
            if (passNueva !== passNueva2) {
                warnings.push('Las contraseñas nuevas no coinciden');
            } else if (passNueva.length < 6) {
                warnings.push('La nueva contraseña debe tener al menos 6 caracteres');
            } else if (!passActual) {
                warnings.push('Introduce la contraseña actual para cambiarla');
            } else {
                var u = AuthSystem.getCurrentUser();
                if (u) {
                    u.password = AuthSystem.hashPassword(passNueva);
                    AuthSystem.updateUser(u);
                    warnings.push(' Contraseña cambiada');
                }
            }
        }
        if (warnings.length > 0) {
            mostrarToast(warnings.join(' · '), 'info');
        } else {
            mostrarToast(' Perfil actualizado (local)', 'success');
        }
        cerrarModalPerfil();
        if (typeof actualizarUIProyecto === 'function') {
            actualizarUIProyecto(AuthSystem.getCurrentUser());
        }
    }

    btn.disabled = false;
    setTimeout(function() { btn.textContent = ' Guardar cambios'; }, 2000);
}

// ============================================================
// NOTIFICACIONES
// ============================================================
var _notifPollTimer = null;
var _ultimoNotifCount = 0;

function mostrarPanelNotificaciones() {
    var modal = document.getElementById('modalNotificaciones');
    if (!modal) return;
    modal.classList.remove('u-hidden');
    modal.style.display = 'flex';
    if (typeof window.abrirModalAccesible === 'function') window.abrirModalAccesible(modal);
    recargarNotificaciones();
}

function cerrarModalNotificaciones() {
    var modal = document.getElementById('modalNotificaciones');
    if (modal) { modal.classList.add('u-hidden'); modal.style.display = 'none'; }
}

function escaparHtmlNotif(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
}

async function recargarNotificaciones() {
    var container = document.getElementById('notificacionesList');
    if (!container) return;
    container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;"> Cargando...</p>';
    try {
        var data = await DataService.listNotifications();
        var notifs = data.notifications || [];
        if (notifs.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:40px 0;">No hay notificaciones</p>';
            return;
        }
        var html = '<div style="display:flex;flex-direction:column;gap:4px;">';
        notifs.forEach(function(n) {
            var noLeida = !n.is_read;
            html += '<div style="display:flex;gap:10px;padding:10px 12px;border-radius:8px;background:' + (noLeida ? 'rgba(0,122,255,0.08)' : 'transparent') + ';border:1px solid ' + (noLeida ? 'rgba(0,122,255,0.15)' : 'rgba(255,255,255,0.05)') + ';">';
            html += '<div style="font-size:18px;flex-shrink:0;">' + (n.type === 'project_shared' ? '' : '') + '</div>';
            html += '<div style="flex:1;min-width:0;">';
            html += '<div style="font-size:13px;font-weight:' + (noLeida ? '600' : '400') + ';color:var(--text-primary);">' + escaparHtmlNotif(n.title) + '</div>';
            html += '<div style="font-size:12px;color:var(--text-muted);margin-top:2px;">' + escaparHtmlNotif(n.message) + '</div>';
            html += '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">' + (n.created_at || '') + '</div>';
            html += '</div>';
            if (noLeida) {
                html += '<span style="font-size:11px;cursor:pointer;color:#007AFF;flex-shrink:0;" onclick="marcarNotifLeida(' + n.id + ')"></span>';
            }
            html += '</div>';
        });
        html += '</div>';
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;"> Error: ' + escaparHtmlNotif(e.message) + '</p>';
    }
}

async function marcarNotifLeida(id) {
    try {
        await DataService.markNotificationRead(id);
        actualizarBadgeNotif();
        recargarNotificaciones();
    } catch (e) {}
}

async function marcarTodasNotifLeidas() {
    try {
        await DataService.markAllNotificationsRead();
        actualizarBadgeNotif();
        recargarNotificaciones();
        mostrarToast(' Todas marcadas como leídas', 'success');
    } catch (e) {}
}

async function actualizarBadgeNotif() {
    var badge = document.getElementById('notifBadge');
    if (!badge) return;
    try {
        var data = await DataService.getUnreadCount();
        var count = data.count || 0;
        if (count > 0) {
            badge.style.display = 'flex';
            badge.textContent = count > 99 ? '99+' : count;
            if (_ultimoNotifCount > 0 && count > _ultimoNotifCount) {
                mostrarToast(' Tienes ' + count + ' notificaciones sin leer', 'info');
            }
            _ultimoNotifCount = count;
        } else {
            badge.style.display = 'none';
            _ultimoNotifCount = 0;
        }
    } catch (e) {
        badge.style.display = 'none';
    }
}

function iniciarNotificacionesProyecto() {
    if (typeof DataService === 'undefined' || !DataService.getToken()) return;
    actualizarBadgeNotif();
    if (_notifPollTimer) clearInterval(_notifPollTimer);
    _notifPollTimer = setInterval(actualizarBadgeNotif, 30000);
}

function formatearTiempoSync(ts) {
    if (!ts) return '';
    var seg = Math.floor((Date.now() - ts) / 1000);
    if (seg < 5) return 'ahora';
    if (seg < 60) return 'hace ' + seg + 's';
    var min = Math.floor(seg / 60);
    return 'hace ' + min + 'min';
}

function syncNowManual() {
    var btn = document.getElementById('btnSyncNow');
    if (btn) { btn.textContent = ''; btn.disabled = true; }
    DataService.syncProyecto().then(function() {
        setTimeout(function() {
            if (btn) { btn.textContent = '↻'; btn.disabled = false; }
        }, 1000);
    }).catch(function() {
        if (btn) { btn.textContent = '↻'; btn.disabled = false; }
    });
}

function iniciarIndicadorSync() {
    var el = document.getElementById('syncStatus');
    if (!el) return;
    el.style.display = 'block';
    DataService.setSyncStatusCallback(function(status) {
        var icon = document.getElementById('syncIcon');
        var text = document.getElementById('syncText');
        var time = document.getElementById('syncTime');
        var btn = document.getElementById('btnSyncNow');
        if (!icon || !text) return;
        if (status === 'syncing') {
            icon.textContent = '';
            text.textContent = 'Sincronizando...';
            el.style.background = 'rgba(255,204,0,0.1)';
            el.style.color = '#FFCC00';
            if (btn) btn.style.display = 'none';
        } else if (status === 'ok') {
            icon.textContent = '';
            text.textContent = 'Sincronizado';
            el.style.background = 'rgba(0,168,89,0.1)';
            el.style.color = '#00A859';
            if (time) time.textContent = formatearTiempoSync(DataService.getLastSyncTime());
            if (btn) { btn.style.display = 'inline'; btn.textContent = '↻'; btn.disabled = false; }
        } else if (status === 'pending') {
            var count = DataService.getPendingCount();
            icon.textContent = '';
            text.textContent = count + ' cambio(s) pendiente(s)';
            el.style.background = 'rgba(255,140,0,0.1)';
            el.style.color = '#FF8C00';
            if (btn) { btn.style.display = 'inline'; btn.textContent = '↻'; btn.disabled = false; }
        } else {
            icon.textContent = '';
            text.textContent = 'Error de sincronización';
            el.style.background = 'rgba(255,59,48,0.1)';
            el.style.color = '#FF3B30';
            if (btn) { btn.style.display = 'inline'; btn.textContent = '↻'; btn.disabled = false; }
        }
    });
    // Callback para actualizar contador en tiempo real
    DataService.setPendingUICallback(function(count) {
        var icon = document.getElementById('syncIcon');
        var text = document.getElementById('syncText');
        var btn = document.getElementById('btnSyncNow');
        if (!icon || !text) return;
        if (count > 0) {
            icon.textContent = '';
            text.textContent = count + ' cambio(s) pendiente(s)';
            el.style.background = 'rgba(255,140,0,0.1)';
            el.style.color = '#FF8C00';
            if (btn) { btn.style.display = 'inline'; btn.textContent = '↻'; btn.disabled = false; }
        }
    });
    // Actualizar cada 10s el tiempo
    setInterval(function() {
        var time = document.getElementById('syncTime');
        if (time) time.textContent = formatearTiempoSync(DataService.getLastSyncTime());
    }, 10000);
}
 async function init() {
    initNavegacion();
    setActiveProceso('Inicio');
    await cargarProyecto();
    cargarTemaGuardado();
    cargarIdiomaApp();
    cargarUsuarioSesion();
    // Iniciar auto-sync si hay token de API
    if (typeof DataService !== 'undefined' && DataService.getToken()) {
        DataService.startAutoSync(30000);
        iniciarIndicadorSync();
        iniciarNotificacionesProyecto();
        console.log(' Auto-sync iniciado (cada 30s)');
        // Pull all projects from server to sync localStorage
        DataService.pullAllProjects().then(pulled => {
            if (pulled.length > 0) {
                console.log(` ${pulled.length} proyectos descargados del servidor`);
            }
        }).catch(() => {});
    }
    setTimeout(function() {
        if (typeof actualizarPanelSalud === 'function') {
            console.log(' Forzando actualización del panel de salud');
            actualizarPanelSalud();
        } else {
            console.warn(' actualizarPanelSalud no está disponible');
        }
    }, 200);
}
let usuarioActual = null;

init().catch(e => console.error(" init() failed:", e));
// ============================================
// SISTEMA DE USUARIO Y SESIÓN (usando AuthSystem de auth.js)
// ============================================


function mapAuthUser(authUser) {
    if (!authUser) return null;
    return {
        id: authUser.id,
        nombre: authUser.name || authUser.email,
        email: authUser.email,
        rol: authUser.role === 'admin' ? 'Administrador' : (authUser.role === 'viewer' ? 'Sponsor' : 'Project Manager'),
        proyectos: authUser.projects || []
    };
}

function actualizarUIUsuario() {
    const nombreDisplay = document.getElementById('userNameDisplay');
    const rolDisplay = document.getElementById('userRoleDisplay');

    if (usuarioActual) {
        if (nombreDisplay) nombreDisplay.innerHTML = escapeHtml(usuarioActual.nombre || '');
        if (rolDisplay) rolDisplay.innerHTML = usuarioActual.rol;

        // Asignar usuario al proyecto si no tiene PM asignado
        if (proyecto && !proyecto.projectManager?.nombre) {
            proyecto.projectManager = {
                nombre: usuarioActual.nombre,
                email: usuarioActual.email,
                rol: usuarioActual.rol,
                cargo: usuarioActual.rol,
                telefono: '',
                direccion: '',
                departamento: ''
            };
            guardarProyecto();
            renderizarActa();
        }
    } else {
        if (nombreDisplay) nombreDisplay.innerHTML = 'Invitado';
        if (rolDisplay) rolDisplay.innerHTML = 'Sin autenticar';
    }
}

function cargarUsuarioSesion() {
    const authUser = AuthSystem.getCurrentUser();
    if (authUser) {
        usuarioActual = authUser;
        actualizarUIProyecto(authUser);
        // Asignar usuario al proyecto si no tiene PM
        if (proyecto && !proyecto.projectManager?.nombre) {
            proyecto.projectManager = {
                nombre: authUser.nombre,
                email: authUser.email,
                rol: authUser.role,
                cargo: authUser.role,
                telefono: '',
                direccion: '',
                departamento: ''
            };
            guardarProyecto();
            renderizarActa();
        }
    } else {
        setTimeout(() => {
            if (!usuarioActual) {
                // Redirigir al login, volver aquí después
                var returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
                window.location.href = 'index.html?redirect=' + returnUrl;
            }
        }, 1000);
    }
}

function cerrarSesion() {
    if (confirm(tApp('confirmar_cerrar_sesion_seguro'))) {
        if (typeof DataService !== 'undefined') DataService.stopAutoSync();
        usuarioActual = null;
        Promise.resolve(AuthSystem.signOut()).finally(() => { window.location.href = 'index.html'; });
    }
}

         // ============================================
        // FUNCIONES DE TEMA CLARO/OSCURO
        // ============================================

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const btn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');

    if (currentTheme === 'light') {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('pmi_theme', 'dark');
        if (btn) {
            if (themeIcon) themeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
        }
        mostrarToast(" Tema oscuro activado", 'info');
    } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('pmi_theme', 'light');
        if (btn) {
            if (themeIcon) themeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
        }
        mostrarToast(" Tema claro activado", 'info');
    }

    //  RECALCULAR GRÁFICOS CON NUEVOS COLORES
    if (cashflowChart) {
        cashflowChart.destroy();
        cashflowChart = null;
    }
    if (dashboardChart) {
        dashboardChart.destroy();
        dashboardChart = null;
    }
    if (typeof calcularCashflow === 'function') {
        calcularCashflow();
    }
    if (typeof actualizarPanelSalud === 'function') {
        setTimeout(actualizarPanelSalud, 100);
    }
}

        function cargarTemaGuardado() {
            const temaGuardado = localStorage.getItem('pmi_theme');
            const html = document.documentElement;
            const themeIcon = document.getElementById('themeIcon');

            if (temaGuardado === 'light') {
                html.setAttribute('data-theme', 'light');
                if (themeIcon) themeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
            } else {
                html.setAttribute('data-theme', 'dark');
                if (themeIcon) themeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
            }
        }


                // ============================================
        // TEMA CLARO/OSCURO
        // ============================================

         window.toggleTheme = function() {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme');
            const themeIcon = document.getElementById('themeIcon');

            if (current === 'light') {
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('pmi_theme', 'dark');
                if (themeIcon) themeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
                if (typeof mostrarToast === 'function') mostrarToast(" Tema oscuro", 'info');
            } else {
                html.setAttribute('data-theme', 'light');
                localStorage.setItem('pmi_theme', 'light');
                if (themeIcon) themeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
                if (typeof mostrarToast === 'function') mostrarToast(" Tema claro", 'info');
            }
        };

        // Inicializar tema al cargar
        (function initTheme() {
            const temaGuardado = localStorage.getItem('pmi_theme');
            const html = document.documentElement;
            const themeIcon = document.getElementById('themeIcon');

            if (temaGuardado === 'light') {
                html.setAttribute('data-theme', 'light');
                if (themeIcon) themeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
            } else {
                html.setAttribute('data-theme', 'dark');
                if (themeIcon) themeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
            }
        })();

     // ============================================
// GESTIÓN DE BENEFICIOS
// ============================================
