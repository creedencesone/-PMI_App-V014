
// ============================================
// FUNCIONES DE FORMATO DE FECHA ESPAÑOL
// ============================================

function formatearFechaEspa(fechaStr) {
    if (!fechaStr) return '-';

    try {
        let fecha;

        // Si es string ISO (YYYY-MM-DD)
        if (typeof fechaStr === 'string' && fechaStr.match(/^\d{4}-\d{2}-\d{2}/)) {
            const partes = fechaStr.split('-');
            fecha = new Date(partes[0], partes[1] - 1, partes[2]);
        }
        // Si es objeto Date
        else if (fechaStr instanceof Date) {
            fecha = fechaStr;
        }
        // Si es timestamp
        else if (typeof fechaStr === 'number') {
            fecha = new Date(fechaStr);
        }
        else {
            fecha = new Date(fechaStr);
        }

        // Verificar si la fecha es válida
        if (isNaN(fecha.getTime())) return fechaStr;

        // Formato español: dd/mm/yyyy
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const anio = fecha.getFullYear();

        return `${dia}/${mes}/${anio}`;
    } catch(e) {
        return fechaStr;
    }
}

// Función para convertir fecha de formato español a ISO (para inputs date)
function fechaEspaToISO(fechaStr) {
    if (!fechaStr) return '';

    // Si ya está en formato ISO, devolver igual
    if (fechaStr.match(/^\d{4}-\d{2}-\d{2}/)) return fechaStr;

    // Si está en formato dd/mm/yyyy
    const partes = fechaStr.split('/');
    if (partes.length === 3) {
        return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
    }

    return fechaStr;
}

// Función para obtener fecha actual en formato español
function fechaActualEspa() {
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, '0');
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const anio = hoy.getFullYear();
    return `${dia}/${mes}/${anio}`;
}
// ============================================
// SISTEMA DE EVENTOS PARA CAMBIO DE IDIOMA
// ============================================

// Disparar evento cuando cambia el idioma
function dispatchLanguageChangeEvent() {
    const event = new CustomEvent('languageChanged', { detail: { language: idiomaApp } });
    window.dispatchEvent(event);
}

// Función para que los paneles se suscriban al cambio de idioma
function subscribeToLanguageChange(callback) {
    window.addEventListener('languageChanged', callback);
}

// Función para refrescar TODOS los paneles según el idioma
function refreshAllPanels() {
    console.log(" Refrescando todos los paneles por cambio de idioma...");

    // Acta de Inicio
    if (typeof renderizarActa === 'function') {
        renderizarActa();
    }

    // Dashboard
    if (typeof calcularCashflow === 'function') {
        calcularCashflow();
    }

    // Salud del Proyecto
    if (typeof actualizarPanelSalud === 'function') {
        actualizarPanelSalud();
    }

    // Cronograma Gantt
    if (typeof renderizarCronograma === 'function') {
        renderizarCronograma();
    }

    // Riesgos
    if (typeof renderizarRiesgos === 'function') {
        renderizarRiesgos();
    }
    if (typeof renderizarAccionesMitigacion === 'function') {
        renderizarAccionesMitigacion();
    }
    if (typeof inicializarRiesgos === 'function') {
        inicializarRiesgos();
    }

    // Stakeholders
    if (typeof renderizarStakeholders === 'function') {
        renderizarStakeholders();
    }

    if (typeof renderizarOrganigrama === 'function') {
        renderizarOrganigrama();
    }

    // Carga de trabajo por recurso/día
    if (typeof renderizarCargaTrabajo === 'function') {
        renderizarCargaTrabajo();
    }

    // RACI
    if (typeof renderizarRACI === 'function') {
        renderizarRACI();
    }

    // Procesos
    if (typeof renderizarProcesos === 'function') {
        renderizarProcesos();
    }

    // Equipo
    if (typeof renderizarEquipo === 'function') {
        renderizarEquipo();
    }

    // Materiales
    if (typeof renderizarMateriales === 'function') {
        renderizarMateriales();
    }

    // Servicios
    if (typeof renderizarServicios === 'function') {
        renderizarServicios();
    }

    // Viajes
    if (typeof renderizarViajes === 'function') {
        renderizarViajes();
    }

    // Avales
    if (typeof renderizarAvales === 'function') {
        renderizarAvales();
    }

    // Seguros
    if (typeof renderizarSeguros === 'function') {
        renderizarSeguros();
    }

    // Garantía
    if (typeof renderizarGarantia === 'function') {
        renderizarGarantia();
    }

    // Roles
    if (typeof renderizarRoles === 'function') {
        renderizarRoles();
    }

    // Comunicaciones
    if (typeof renderizarComunicaciones === 'function') {
        renderizarComunicaciones();
    }
    if (typeof renderizarReuniones === 'function') {
        renderizarReuniones();
    }

    // Beneficios
    if (typeof renderizarBeneficios === 'function') {
        renderizarBeneficios();
    }

    // Cambios
    if (typeof renderizarCambios === 'function') {
        renderizarCambios();
    }

    // Lecciones
    if (typeof renderizarLecciones === 'function') {
        renderizarLecciones();
    }

    // SCRUM / Ágil
    if (typeof renderizarSprintBacklog === 'function') {
        renderizarSprintBacklog();
    }
    if (typeof renderizarBurndown === 'function') {
        renderizarBurndown();
    }
    if (typeof renderizarVelocityTracking === 'function') {
        renderizarVelocityTracking();
    }
    if (typeof renderizarRetrospectives === 'function') {
        renderizarRetrospectives();
    }
    if (typeof renderizarAgileMetrics === 'function') {
        renderizarAgileMetrics();
    }
    if (typeof renderizarListadoSprints === 'function') {
        renderizarListadoSprints();
    }
    if (typeof calcularCostesPorSprint === 'function') {
        calcularCostesPorSprint();
    }

    // Monedas
    if (typeof actualizarTiposCambioUI === 'function') {
        actualizarTiposCambioUI();
    }

    // Resumen de Gastos (AHORA CON TRY-CATCH PARA EVITAR ERRORES)
    if (typeof actualizarResumenGastos === 'function') {
        try {
            actualizarResumenGastos();
        } catch(e) {
            console.warn("Error en actualizarResumenGastos:", e.message);
        }
    }

    // Hitos Financieros
    if (typeof renderizarHitosFinancieros === 'function') {
        renderizarHitosFinancieros();
    }

    console.log(" Todos los paneles refrescados");
}

// Actualizar textos estáticos del DOM (títulos de paneles, botones, etc.)
function stripIcon(text) {
    return text.replace(/^[]+\s*/, '');
}

function updateStaticTexts() {
    // Títulos de paneles principales
    const panelTitles = {
        'panelActa': 'acta_titulo',
        'panelDashboard': 'dashboard_titulo',
        'panelSalud': 'salud_titulo',
        'panelRiesgos': 'riesgos_titulo',
        'panelStakeholders': 'stakeholders_titulo',
        'panelRaci': 'raci_titulo',
        'panelProcesos': 'procesos_titulo',
        'panelComunicaciones': 'comunicaciones_titulo',
        'panelCronograma': 'gantt_titulo',
        'panelMonedas': 'monedas_titulo',
        'panelVenta': 'venta_titulo',
        'panelCashflow': 'cashflow_titulo',
        'panelResumenGastos': 'resumen_titulo',
        'panelGarantia': 'garantia_titulo',
        'panelFinanciero': 'financiero_titulo',
        'panelEquipo': 'equipo_titulo',
        'panelMateriales': 'materiales_titulo',
        'panelServicios': 'servicios_titulo',
        'panelViajes': 'viajes_titulo',
        'panelLogistica': 'logistica_titulo',
        'panelAvales': 'avales_titulo',
        'panelBeneficios': 'beneficios_titulo',
        'panelCambios': 'cambios_titulo',
        'panelLecciones': 'lecciones_titulo',
        'panelRoles': 'roles_titulo',
        'panelSprintBacklog': 'sprintBacklog_titulo',
        'panelSprintBurndown': 'sprintBurndown_titulo',
        'panelVelocityTracking': 'velocityTracking_titulo',
        'panelRetrospectives': 'retrospectives_titulo',
        'panelAgileMetrics': 'agileMetrics_titulo',
        'panelAgileCostControl': 'agileCostControl_titulo',
        'panelSprintList': 'sprintList_titulo'
    };

    for (const [panelId, key] of Object.entries(panelTitles)) {
        const panel = document.getElementById(panelId);
        if (panel) {
            const titleSpan = panel.querySelector('.panel-title span');
            if (titleSpan && !titleSpan.querySelector('button') && !titleSpan.querySelector('select')) {
                const currentText = titleSpan.innerHTML;
                const iconMatch = currentText.match(/^[]/);
                const icon = iconMatch ? iconMatch[0] : '';
                const translatedText = tApp(key);
                if (translatedText !== key) {
                    titleSpan.innerHTML = `${icon} ${stripIcon(translatedText)}`;
                }
            }
        }
    }

    // Sub-títulos dentro de paneles (.second-title, h4 con data-i18n, etc.)
    const subTitleMap = {
        'panelMonedas': { selector: 'h4', textPattern: 'Hitos Financieros', key: 'monedas_hitos' },
        'panelRiesgos': [
            { selector: '.panel-title span', textPattern: 'Matriz de Probabilidad', key: 'riesgos_matriz' },
            { selector: '.panel-title span', textPattern: 'Lista de Riesgos', key: 'riesgos_lista' },
            { selector: '.panel-title span', textPattern: 'Análisis Cuantitativo', key: 'riesgos_analisis_cuantitativo' },
            { selector: '.panel-title span', textPattern: 'Registro de Acciones', key: 'riesgos_acciones_titulo' },
            { selector: 'label', textPattern: 'Valor del Proyecto', key: 'riesgos_valor_proyecto' },
            { selector: 'label', textPattern: 'Reserva de Contingencia', key: 'riesgos_reserva_contingencia' }
        ]
    };

    // Static label translations within panels
    const staticLabels = [
        // Monedas
        { panel: 'panelMonedas', selector: 'label', textPattern: 'Moneda Base', key: 'monedas_base' },
        { panel: 'panelMonedas', selector: 'label', textPattern: 'Precio Venta', key: 'monedas_precio' },
        { panel: 'panelMonedas', selector: 'label', textPattern: 'Moneda Venta', key: 'monedas_venta' },
        { panel: 'panelMonedas', selector: 'label', textPattern: 'Condiciones de pago', key: 'monedas_condiciones' },
        { panel: 'panelMonedas', selector: 'label', textPattern: 'Moneda a comparar', key: 'monedas_comparar' },
        { panel: 'panelMonedas', selector: 'label', textPattern: 'Período', key: 'monedas_periodo' },
        // Venta
        { panel: 'panelVenta', selector: 'label', textPattern: 'Precio Venta', key: 'venta_precio' },
        { panel: 'panelVenta', selector: 'label', textPattern: 'Moneda', key: 'venta_moneda' },
        { panel: 'panelVenta', selector: 'label', textPattern: 'Condiciones', key: 'venta_condiciones' },
        // Cashflow table headers
        { panel: 'panelCashflow', selector: 'th', textPattern: 'Mes', key: 'cashflow_mes' },
        { panel: 'panelCashflow', selector: 'th', textPattern: 'Ingresos', key: 'cashflow_ingresos' },
        { panel: 'panelCashflow', selector: 'th', textPattern: 'Gastos', key: 'cashflow_gastos' },
        { panel: 'panelCashflow', selector: 'th', textPattern: 'Neto', key: 'cashflow_neto' },
        { panel: 'panelCashflow', selector: 'th', textPattern: 'Acumulado', key: 'cashflow_acumulado' },
        // Resumen value-card labels
        { panel: 'panelResumenGastos', selector: '.small', textPattern: 'Total Gastos', key: 'resumen_total' },
        { panel: 'panelResumenGastos', selector: '.small', textPattern: 'Personal', key: 'resumen_personal' },
        { panel: 'panelResumenGastos', selector: '.small', textPattern: 'Materiales', key: 'resumen_materiales' },
        { panel: 'panelResumenGastos', selector: '.small', textPattern: 'Servicios', key: 'resumen_servicios' },
        { panel: 'panelResumenGastos', selector: '.small', textPattern: 'Viajes', key: 'resumen_viajes' },
        { panel: 'panelResumenGastos', selector: '.small', textPattern: 'Logística', key: 'resumen_logistica' },
        { panel: 'panelResumenGastos', selector: '.small', textPattern: 'Financieros', key: 'resumen_financieros' },
        { panel: 'panelResumenGastos', selector: '.small', textPattern: '% vs Presupuesto', key: 'resumen_porcentaje' },
        // Garantía value-card labels
        { panel: 'panelGarantia', selector: '.small', textPattern: 'Estado', key: 'garantia_estado' },
        { panel: 'panelGarantia', selector: '.small', textPattern: 'Duración', key: 'garantia_duracion' },
        { panel: 'panelGarantia', selector: '.small', textPattern: 'Inicio', key: 'garantia_inicio' },
        { panel: 'panelGarantia', selector: '.small', textPattern: 'Fin', key: 'garantia_fin' },
        // Financiero value-card labels
        { panel: 'panelFinanciero', selector: '.small', textPattern: 'Coste Total Materiales', key: 'financiero_costemateriales' },
        { panel: 'panelFinanciero', selector: '.small', textPattern: 'Total Aranceles', key: 'financiero_aranceles' },
        { panel: 'panelFinanciero', selector: '.small', textPattern: 'Tasas Aduaneras', key: 'financiero_tasas' },
        { panel: 'panelFinanciero', selector: '.small', textPattern: 'Coste Total Importación', key: 'financiero_importacion' },
        // Viajes value-card labels
        { panel: 'panelViajes', selector: '.small', textPattern: 'Vuelos', key: 'viajes_vuelos' },
        { panel: 'panelViajes', selector: '.small', textPattern: 'Hoteles', key: 'viajes_hoteles' },
        { panel: 'panelViajes', selector: '.small', textPattern: 'Comidas', key: 'viajes_comidas' },
        { panel: 'panelViajes', selector: '.small', textPattern: 'Traslados', key: 'viajes_traslados' },
        { panel: 'panelViajes', selector: '.small', textPattern: 'Total Viajes', key: 'viajes_total' },
        // Beneficios value-card labels
        { panel: 'panelBeneficios', selector: '.small', textPattern: 'Beneficio Proyectado', key: 'beneficios_proyectado' },
        { panel: 'panelBeneficios', selector: '.small', textPattern: 'Beneficio Real', key: 'beneficios_real' },
        { panel: 'panelBeneficios', selector: '.small', textPattern: 'Desviación', key: 'beneficios_desviacion' },
        { panel: 'panelBeneficios', selector: '.small', textPattern: 'Estado', key: 'beneficios_estado' },
        // Cambios value-card labels
        { panel: 'panelCambios', selector: '.small', textPattern: 'Pendientes', key: 'cambios_pendientes' },
        { panel: 'panelCambios', selector: '.small', textPattern: 'Aprobados', key: 'cambios_aprobados' },
        { panel: 'panelCambios', selector: '.small', textPattern: 'Rechazados', key: 'cambios_rechazados' },
        { panel: 'panelCambios', selector: '.small', textPattern: 'Implementados', key: 'cambios_implementados' },
        // Lecciones value-card labels
        { panel: 'panelLecciones', selector: '.small', textPattern: 'Éxitos', key: 'lecciones_exitos' },
        { panel: 'panelLecciones', selector: '.small', textPattern: 'Áreas de Mejora', key: 'lecciones_mejora' },
        { panel: 'panelLecciones', selector: '.small', textPattern: 'Recomendaciones', key: 'lecciones_recomendaciones' },
        // Riesgos value-card labels
        { panel: 'panelRiesgos', selector: '.small', textPattern: 'Riesgos Críticos', key: 'riesgos_criticos' },
        { panel: 'panelRiesgos', selector: '.small', textPattern: 'Riesgos Altos', key: 'riesgos_altos' },
        { panel: 'panelRiesgos', selector: '.small', textPattern: 'Riesgos Medios', key: 'riesgos_medios' },
        { panel: 'panelRiesgos', selector: '.small', textPattern: 'Riesgos Bajos', key: 'riesgos_bajos' },
        // Salud value-card labels
        { panel: 'panelSalud', selector: '.small', textPattern: 'Progreso General', key: 'salud_progreso' },
        { panel: 'panelSalud', selector: '.small', textPattern: 'Riesgos', key: 'salud_riesgos' },
        { panel: 'panelSalud', selector: '.small', textPattern: 'Salud Financiera', key: 'salud_financiera' },
        { panel: 'panelSalud', selector: '.small', textPattern: 'Desviación', key: 'salud_desviacion' },
        { panel: 'panelSalud', selector: '.small', textPattern: 'CPI', key: 'salud_cpi' },
        { panel: 'panelSalud', selector: '.small', textPattern: 'SPI', key: 'salud_spi' },
        { panel: 'panelSalud', selector: '.small', textPattern: 'ROI Proyectado', key: 'salud_roi' },
        { panel: 'panelSalud', selector: '.small', textPattern: 'EAC', key: 'salud_eac' },
        { panel: 'panelSalud', selector: '.small', textPattern: 'Defectos', key: 'salud_defectos' },
        { panel: 'panelSalud', selector: '.small', textPattern: 'Velocidad del Equipo', key: 'salud_velocidad' },
        { panel: 'panelSalud', selector: '.small', textPattern: 'Satisfacción Stakeholder', key: 'salud_satisfaccion' },
        { panel: 'panelSalud', selector: '.small', textPattern: 'Huella de Carbono', key: 'salud_huella' },
        { panel: 'panelSalud', selector: '.small', textPattern: 'Salud General', key: 'salud_pmbok' },
        { panel: 'panelSalud', selector: '.small', textPattern: 'Beneficio Proyectado', key: 'salud_beneficio_proyectado' }
    ];

    for (const item of staticLabels) {
        const panel = document.getElementById(item.panel);
        if (!panel) continue;
        const elements = panel.querySelectorAll(item.selector);
        for (const el of elements) {
            if (el.innerHTML.includes(item.textPattern)) {
                const iconMatch = el.innerHTML.match(/^[]+/);
                const icon = iconMatch ? iconMatch[0] : '';
                el.innerHTML = icon ? `${icon} ${stripIcon(tApp(item.key))}` : tApp(item.key);
            }
        }
    }

    // Sub-titles (h4 elements) in info-cards
    const infoCardTitles = [
        { panel: 'panelMonedas', textPattern: 'Evolución del Tipo de Cambio', key: 'monedas_evolucion' },
        { panel: 'panelResumenGastos', textPattern: 'Desglose Detallado', key: 'resumen_desglose' },
        { panel: 'panelResumenGastos', textPattern: 'Análisis de Gastos', key: 'resumen_analisis' },
        { panel: 'panelGarantia', textPattern: 'Relación con Hitos de Pago', key: 'garantia_relacion_hitos' },
        { panel: 'panelBeneficios', textPattern: 'Hitos de Beneficio', key: 'beneficios_hitos' },
        { panel: 'panelBeneficios', textPattern: 'Indicadores de Éxito', key: 'beneficios_indicadores' },
        { panel: 'panelSprintBacklog', textPattern: 'Backlog del Producto', key: 'sprintBacklog_backlog' },
        { panel: 'panelSprintBurndown', textPattern: 'Registro Diario de Sprint', key: 'sprintBurndown_registro' },
        { panel: 'panelVelocityTracking', textPattern: 'Historial de Sprints', key: 'velocityTracking_historial' },
        { panel: 'panelSprintList', textPattern: 'Resumen de Sprints', key: 'sprintList_total' }
    ];

    for (const item of infoCardTitles) {
        const panel = document.getElementById(item.panel);
        if (!panel) continue;
        const headers = panel.querySelectorAll('h4');
        for (const h of headers) {
            if (h.innerHTML.includes(item.textPattern)) {
                const iconMatch = h.innerHTML.match(/^[]+/);
                const icon = iconMatch ? iconMatch[0] : '';
                h.innerHTML = `${icon} ${stripIcon(tApp(item.key))}`;
            }
        }
    }

    // Botones comunes en paneles
    try {
        document.querySelectorAll('.btn').forEach(btn => {
            const t = btn.textContent.trim();
            // Map button text patterns to translation keys
            const btnMap = {
                'Editar': 'btn_editar',
                'Añadir': 'btn_anadir',
                'Nuevo': 'btn_anadir',
                'Guardar': 'btn_guardar',
                'Exportar': 'btn_exportar',
                'Eliminar': 'btn_eliminar',
                'Cancelar': 'btn_cancelar',
                'Cerrar': 'btn_cerrar',
                'Actualizar': 'btn_actualizar',
                'Importar': 'btn_importar'
            };
            for (const [pattern, key] of Object.entries(btnMap)) {
                if (t === pattern || t.startsWith(pattern + ' ') || t.startsWith(' ' + pattern) || t.startsWith(' ' + pattern) || t.startsWith(' ' + pattern) || t.startsWith(' ' + pattern) || t.startsWith(' ' + pattern) || t.startsWith(' ' + pattern)) {
                    const iconMatch = btn.innerHTML.match(/^[]+/);
                    const icon = iconMatch ? iconMatch[0] : '';
                    const translated = tApp(key);
                    if (translated !== key && btn.innerHTML !== (icon ? icon + ' ' + stripIcon(translated) : translated)) {
                        btn.innerHTML = icon ? icon + ' ' + stripIcon(translated) : translated;
                    }
                    break;
                }
            }
        });
    } catch(e) {
        console.warn("Error actualizando botones:", e.message);
    }

    // Static text paragraphs / info cards
    const staticTexts = [
        { panel: 'panelGarantia', selector: 'p', textPattern: 'No hay garantía configurada', key: 'garantia_no_config_texto' },
        { panel: 'panelGarantia', selector: 'p', textPattern: 'Configura la garantía para ver', key: 'garantia_config_info' }
    ];
    for (const item of staticTexts) {
        const panel = document.getElementById(item.panel);
        if (!panel) continue;
        const elements = panel.querySelectorAll(item.selector);
        for (const el of elements) {
            if (el.innerHTML.includes(item.textPattern)) {
                el.innerHTML = tApp(item.key);
            }
        }
    }

    // ACTA title special case (has id="actaTitulo")
    const actaTitle = document.getElementById('actaTitulo');
    if (actaTitle) {
        const iconMatch = actaTitle.innerHTML.match(/^[]+/);
        const icon = iconMatch ? iconMatch[0] : '';
        actaTitle.innerHTML = `${icon} ${stripIcon(tApp('acta_titulo'))}`;
    }

    // ACTA section headers (h3 with class u-section-title or ids)
    const actaSections = [
        { id: 'actaIdentificacion', key: 'acta_identificacion' },
        { id: 'actaObjetivos', key: 'acta_objetivos' },
        { id: 'actaAlcance', key: 'acta_alcance' },
        { id: 'actaPartes', key: 'acta_partes' },
        { id: 'actaPresupuesto', key: 'acta_presupuesto' },
        { id: 'actaCondiciones', key: 'acta_condiciones' },
        { id: 'actaAvales', key: 'acta_avales' },
        { id: 'actaAprobaciones', key: 'acta_aprobaciones' },
        { id: 'actaMetodologia', key: 'acta_metodologia' }
    ];
    for (const section of actaSections) {
        const el = document.getElementById(section.id);
        if (el) {
            const iconMatch = el.innerHTML.match(/^[]+/);
            const icon = iconMatch ? iconMatch[0] : '';
            el.innerHTML = icon ? `${icon} ${stripIcon(tApp(section.key))}` : tApp(section.key);
        }
    }
}

function tApp(key) {
    if (textosApp[idiomaApp] && textosApp[idiomaApp][key]) {
        return textosApp[idiomaApp][key];
    }
    if (textosApp.es && textosApp.es[key]) {
        return textosApp.es[key];
    }
    return key;
}

function cambiarIdiomaApp(idioma) {
    idiomaApp = idioma;
    localStorage.setItem('pmi_idioma', idioma);
    aplicarIdiomaUI(idioma);
    const nombreIdioma = { es: 'Español', en: 'English', fr: 'Français', de: 'Deutsch' }[idioma];
    mostrarToast(` ${tApp('idioma_cambiado')} ${nombreIdioma}`, 'success');
}

function mostrarMenuIdiomaApp() {
    const existingModal = document.getElementById('genericModal');
    if (existingModal) existingModal.remove();

    const modalHtml = `
        <div class="modal-content modal-300">
            <div class="modal-header">
                <h3>${tApp('idioma_titulo')}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button class="btn btn-secondary" onclick="cambiarIdiomaApp('es'); cerrarModalGeneric()">🇪🇸 ${tApp('idioma_es')}</button>
                <button class="btn btn-secondary" onclick="cambiarIdiomaApp('en'); cerrarModalGeneric()">🇬🇧 ${tApp('idioma_en')}</button>
                <button class="btn btn-secondary" onclick="cambiarIdiomaApp('fr'); cerrarModalGeneric()">🇫🇷 ${tApp('idioma_fr')}</button>
                <button class="btn btn-secondary" onclick="cambiarIdiomaApp('de'); cerrarModalGeneric()">🇩🇪 ${tApp('idioma_de')}</button>
            </div>
        </div>
    `;

    const modalDiv = document.createElement('div');
    modalDiv.id = 'genericModal';
    modalDiv.className = 'modal';
    modalDiv.style.display = 'flex';
    modalDiv.innerHTML = modalHtml;
    document.body.appendChild(modalDiv);

    modalDiv.onclick = (e) => {
        if (e.target === modalDiv) cerrarModalGeneric();
    };
}
function cerrarModalGeneric() {
    const genericModal = document.getElementById('genericModal');
    if (genericModal) genericModal.remove();
    const editHitoModal = document.getElementById('editHitoModal');
    if (editHitoModal) editHitoModal.remove();
    const modals = ['modalGarantia','modalSatisfaccion','modalViaje','modalEmbalaje','modalIA'];
    modals.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    const openModals = document.querySelectorAll('.modal[style*="display: flex"]');
    openModals.forEach(modal => {
        if (modal.id !== 'genericModal') modal.style.display = 'none';
    });
}

        function cargarIdiomaApp() {
            const guardado = localStorage.getItem('pmi_idioma');
            if (guardado === 'es' || guardado === 'en' || guardado === 'fr' || guardado === 'de') {
                idiomaApp = guardado;
            }
            if (idiomaApp !== 'es') {
                aplicarIdiomaUI(idiomaApp);
            }
        }

        function aplicarIdiomaUI(idioma) {
            idiomaApp = idioma;
            actualizarSidebarIdioma();
            actualizarHeaderBotones();
            actualizarTarjetasPrincipales();
            const langBtn = document.getElementById('languageToggleBtn');
            if (langBtn) langBtn.innerHTML = tApp('idioma_titulo');
            updateStaticTexts();
            refreshAllPanels();
            dispatchLanguageChangeEvent();
        }

        function actualizarSidebarIdioma() {
            if (!window.iconosGuardados) {
                window.iconosGuardados = {};
                const elementosConIcono = [
                    { selector: '.nav-header[data-panel="acta"] .nav-icon', icono: 'file-text' },
                    { selector: '.nav-header[data-panel="dashboard"] .nav-icon', icono: 'bar-chart-2' },
                    { selector: '.nav-header[data-panel="salud"] .nav-icon', icono: 'heart' },
                    { selector: '.nav-header[data-submenu="finanzas"] .nav-icon', icono: 'dollar-sign' },
                    { selector: '.nav-header[data-panel="financiero"] .nav-icon', icono: 'briefcase' },
                    { selector: '.nav-header[data-panel="cronograma"] .nav-icon', icono: 'calendar' },
                    { selector: '.nav-header[data-panel="riesgos"] .nav-icon', icono: 'alert-triangle' },
                    { selector: '.nav-header[data-submenu="stakeholders"] .nav-icon', icono: 'users' },
                    { selector: '.nav-header[data-panel="procesos"] .nav-icon', icono: 'check-square' },
                    { selector: '.nav-header[data-submenu="recursos"] .nav-icon', icono: 'box' },
                    { selector: '.nav-header[data-panel="comunicaciones"] .nav-icon', icono: 'message-circle' },
                    { selector: '.nav-header[data-panel="informe"] .nav-icon', icono: 'file' },
                    { selector: '.nav-header[data-panel="beneficios"] .nav-icon', icono: 'target' },
                    { selector: '.nav-header[data-panel="cambios"] .nav-icon', icono: 'edit' },
                    { selector: '.nav-header[data-panel="lecciones"] .nav-icon', icono: 'book' },
                    { selector: '.nav-header[data-submenu="scrum"] .nav-icon', icono: 'repeat' },
                    { selector: '.submenu-item[data-panel="monedas"]', icono: 'globe' },
                    { selector: '.submenu-item[data-panel="venta"]', icono: 'tag' },
                    { selector: '.submenu-item[data-panel="cashflow"]', icono: 'bar-chart-2' },
                    { selector: '.submenu-item[data-panel="resumenGastos"]', icono: 'pie-chart' },
                    { selector: '.submenu-item[data-panel="avales"]', icono: 'shield' },
                    { selector: '.submenu-item[data-panel="garantia"]', icono: 'award' },
                    { selector: '.submenu-item[data-panel="seguros"]', icono: 'umbrella' },
                    { selector: '.submenu-item[data-panel="stakeholders"]', icono: 'list' },
                    { selector: '.submenu-item[data-panel="raci"]', icono: 'grid' },
                    { selector: '.submenu-item[data-panel="roles"]', icono: 'users' },
                    { selector: '.submenu-item[data-panel="equipo"]', icono: 'users' },
                    { selector: '.submenu-item[data-panel="materiales"]', icono: 'package' },
                    { selector: '.submenu-item[data-panel="servicios"]', icono: 'tool' },
                    { selector: '.submenu-item[data-panel="logistica"]', icono: 'anchor' },
                    { selector: '.submenu-item[data-panel="viajes"]', icono: 'plane' },
                    { selector: '.submenu-item[data-panel="organigrama"]', icono: 'users' }
                ];
                elementosConIcono.forEach(item => {
                    const el = document.querySelector(item.selector);
                    if (el && !window.iconosGuardados[item.selector]) {
                        window.iconosGuardados[item.selector] = item.icono;
                    }
                });
            }
            const sidebarMap = [
                { selector: '.nav-header[data-panel="acta"] .nav-title', key: 'sidebar_acta' },
                { selector: '.nav-header[data-panel="dashboard"] .nav-title', key: 'sidebar_dashboard' },
                { selector: '.nav-header[data-panel="salud"] .nav-title', key: 'sidebar_salud' },
                { selector: '.nav-header[data-submenu="finanzas"] .nav-title', key: 'sidebar_finanzas' },
                { selector: '.nav-header[data-panel="financiero"] .nav-title', key: 'sidebar_financiero' },
                { selector: '.nav-header[data-panel="cronograma"] .nav-title', key: 'sidebar_cronograma' },
                { selector: '.nav-header[data-panel="riesgos"] .nav-title', key: 'sidebar_riesgos' },
                { selector: '.nav-header[data-submenu="stakeholders"] .nav-title', key: 'sidebar_stakeholders' },
                { selector: '.nav-header[data-panel="procesos"] .nav-title', key: 'sidebar_procesos' },
                { selector: '.nav-header[data-submenu="recursos"] .nav-title', key: 'sidebar_recursos' },
                { selector: '.nav-header[data-panel="comunicaciones"] .nav-title', key: 'sidebar_comunicaciones' },
                { selector: '.nav-header[data-panel="resumenGastos"] .nav-title', key: 'sidebar_resumen' },
                { selector: '.nav-header[data-panel="beneficios"] .nav-title', key: 'sidebar_beneficios' },
                { selector: '.nav-header[data-panel="cambios"] .nav-title', key: 'sidebar_cambios' },
                { selector: '.nav-header[data-panel="lecciones"] .nav-title', key: 'sidebar_lecciones' },
                { selector: '.nav-header[data-submenu="scrum"] .nav-title', key: 'sidebar_scrum' },
                { selector: '.nav-header[data-panel="informe"] .nav-title', key: 'sidebar_informe' },
                { selector: '.submenu-item[data-panel="monedas"]', key: 'sidebar_monedas' },
                { selector: '.submenu-item[data-panel="venta"]', key: 'sidebar_venta' },
                { selector: '.submenu-item[data-panel="cashflow"]', key: 'sidebar_cashflow' },
                { selector: '.submenu-item[data-panel="avales"]', key: 'sidebar_avales' },
                { selector: '.submenu-item[data-panel="garantia"]', key: 'sidebar_garantia' },
                { selector: '.submenu-item[data-panel="stakeholders"]', key: 'sidebar_lista' },
                { selector: '.submenu-item[data-panel="raci"]', key: 'sidebar_raci' },
                { selector: '.submenu-item[data-panel="roles"]', key: 'sidebar_roles' },
                { selector: '.submenu-item[data-panel="equipo"]', key: 'sidebar_equipo' },
                { selector: '.submenu-item[data-panel="materiales"]', key: 'sidebar_materiales' },
                { selector: '.submenu-item[data-panel="servicios"]', key: 'sidebar_servicios' },
                { selector: '.submenu-item[data-panel="logistica"]', key: 'sidebar_logistica' },
                { selector: '.submenu-item[data-panel="viajes"]', key: 'sidebar_viajes' },
                { selector: '.submenu-item[data-panel="organigrama"]', key: 'sidebar_organigrama' },
                { selector: '.submenu-item[data-panel="sprintBacklog"]', key: 'sidebar_sprintBacklog' },
                { selector: '.submenu-item[data-panel="sprintBurndown"]', key: 'sidebar_sprintBurndown' },
                { selector: '.submenu-item[data-panel="velocityTracking"]', key: 'sidebar_velocityTracking' },
                { selector: '.submenu-item[data-panel="retrospectives"]', key: 'sidebar_retrospectives' },
                { selector: '.submenu-item[data-panel="agileMetrics"]', key: 'sidebar_agileMetrics' },
                { selector: '.submenu-item[data-panel="sprintList"]', key: 'sidebar_sprintList' },
                { selector: '.submenu-item[data-panel="agileCostControl"]', key: 'sidebar_agileCostControl' }
            ];
            sidebarMap.forEach(item => {
                const el = document.querySelector(item.selector);
                if (el) {
                    const featherIcon = window.iconosGuardados[item.selector];
                    if (featherIcon) {
                        el.innerHTML = '<i data-feather="' + featherIcon + '" class="nav-feather"></i> ' + tApp(item.key);
                    } else {
                        el.innerHTML = tApp(item.key);
                    }
                }
            });
            // Restaurar iconos Feather en nav-icon spans (no tienen key de texto)
            document.querySelectorAll('.nav-icon').forEach(span => {
                const parentHeader = span.closest('.nav-header');
                if (!parentHeader) return;
                // Buscar el selector que corresponde a este nav-icon
                for (const [selector, featherName] of Object.entries(window.iconosGuardados || {})) {
                    if (selector.endsWith('.nav-icon') && document.querySelector(selector) === span) {
                        span.innerHTML = '<i data-feather="' + featherName + '" class="nav-feather"></i>';
                        break;
                    }
                }
            });
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
            const volverSpan = document.querySelector('.nav-back .nav-item span:last-child');
            if (volverSpan) volverSpan.textContent = tApp('sidebar_volver');
        }

        function actualizarHeaderBotones() {
            const btnAct = document.querySelector('.btn-success.btn-small');
            if (btnAct && (btnAct.innerHTML.includes('Actualizar') || btnAct.innerHTML.includes('Update'))) {
                btnAct.innerHTML = tApp('btn_actualizar');
            }
            document.querySelectorAll('.btn-secondary.btn-small').forEach(btn => {
                if (btn.innerHTML.includes('Guardar') || btn.innerHTML.includes('Save')) {
                    btn.innerHTML = tApp('btn_guardar');
                }
            });
            const btnExp = document.querySelector('.btn-primary.btn-small');
            if (btnExp && (btnExp.innerHTML.includes('Exportar') || btnExp.innerHTML.includes('Export'))) {
                btnExp.innerHTML = tApp('btn_exportar');
            }
        }

        function actualizarTarjetasPrincipales() {
            const cards = document.querySelectorAll('.cards-grid .value-card .small');
            if (cards[0]) cards[0].textContent = tApp('card_coste');
            if (cards[1]) cards[1].textContent = tApp('card_ingreso');
            if (cards[2]) cards[2].textContent = tApp('card_beneficio');
            if (cards[3]) cards[3].textContent = tApp('card_financiacion');
        }

        // ============================================
        // FUNCIONES AUXILIARES
        // ============================================
        function sincronizarActaConProyecto() {
            if (!proyecto.acta) proyecto.acta = {};
            if (!proyecto.acta.nombreProyecto && proyecto.nombre) proyecto.acta.nombreProyecto = proyecto.nombre;
            else if (proyecto.acta.nombreProyecto !== proyecto.nombre && proyecto.nombre) proyecto.acta.nombreProyecto = proyecto.nombre;
            if (!proyecto.acta.alcance && proyecto.descripcion) proyecto.acta.alcance = proyecto.descripcion;
            else if (proyecto.acta.alcance !== proyecto.descripcion && proyecto.descripcion) proyecto.acta.alcance = proyecto.descripcion;
            if (!proyecto.acta.fechaInicio && proyecto.fechaInicio) proyecto.acta.fechaInicio = proyecto.fechaInicio;
            else if (proyecto.acta.fechaInicio !== proyecto.fechaInicio && proyecto.fechaInicio) proyecto.acta.fechaInicio = proyecto.fechaInicio;
            if (!proyecto.acta.fechaFin && proyecto.fechaFinPlan) proyecto.acta.fechaFin = proyecto.fechaFinPlan;
            else if (proyecto.acta.fechaFin !== proyecto.fechaFinPlan && proyecto.fechaFinPlan) proyecto.acta.fechaFin = proyecto.fechaFinPlan;
            if (!proyecto.acta.moneda && proyecto.monedaBase) proyecto.acta.moneda = proyecto.monedaBase;
            else if (proyecto.acta.moneda !== proyecto.monedaBase && proyecto.monedaBase) proyecto.acta.moneda = proyecto.monedaBase;
        }

        function guardarProyecto() {
    // Limpiar propiedades temporales del motor CPM antes de guardar
    if (proyecto.elementosGantt) {
        proyecto.elementosGantt.forEach(e => {
            delete e._earlyStart;
            delete e._earlyFinish;
            delete e._lateStart;
            delete e._lateFinish;
            delete e._float;
            delete e._critical;
        });
    }
    let todos = cargarProyectosStorage();
    let idx = todos.findIndex(p => p.id === proyecto.id);
    if (idx >= 0) todos[idx] = proyecto;
            else todos.push(proyecto);
            try {
                guardarProyectosStorage(todos);
                mostrarToast(tApp('toast_guardado'), 'success');
            } catch (e) {
                console.error('Error al guardar:', e);
                mostrarToast(' No se pudo guardar: almacenamiento lleno', 'error');
            }
        }

        function mostrarToast(mensaje, tipo) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = mensaje;
        toast.className = `toast ${tipo}`;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}
// ============================================
// FUNCIÓN PARA COMPARAR CÓDIGOS JERÁRQUICOS
// ============================================

function compararCodigosJerarquicos(codigoA, codigoB) {
    if (!codigoA && !codigoB) return 0;
    if (!codigoA) return 1;
    if (!codigoB) return -1;

    // Función para convertir "1.2.3" o "H-1.2" en array de números
    function parseCodigo(codigo) {
        // Eliminar prefijos como H- o E-
        let limpio = codigo.replace(/^[A-Z]-/, '');
        // Dividir por puntos y convertir a números
        const partes = limpio.split('.');
        return partes.map(p => parseInt(p, 10));
    }

    const partesA = parseCodigo(codigoA);
    const partesB = parseCodigo(codigoB);

    // Comparar parte por parte
    const maxLen = Math.max(partesA.length, partesB.length);
    for (let i = 0; i < maxLen; i++) {
        const valA = i < partesA.length ? partesA[i] : 0;
        const valB = i < partesB.length ? partesB[i] : 0;
        if (valA !== valB) {
            return valA - valB;
        }
    }
    return 0;
}

 function escapeHtml(str) { if(!str) return ''; return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }


        function leerArchivoComoBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        // ============================================
