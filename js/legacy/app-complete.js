    // ============================================
    // CONFIGURACIÓN GLOBAL
    // ============================================
        const MONEDAS = {
            EUR: "Euro (€)", USD: "Dólar ($)", GBP: "Libra (£)", JPY: "Yen (¥)", CHF: "Franco (₣)",
            BRL: "Real (R$)", MXN: "Peso Mexicano (Mex$)", COP: "Peso Colombiano (COL$)", ARS: "Peso Argentino (ARS$)", CLP: "Peso Chileno (CLP$)",
            DZD: "Dinar Argelino (دج)", CDF: "Franco Congoleño (FC)", MZN: "Metical (MT)", ZAR: "Rand (R)", NGN: "Naira (₦)", KES: "Chelín (KSh)", EGP: "Libra (E£)", MAD: "Dirham (د.م.)"
        };
        
        const PROCESOS_PMBOK = [
            {id:1, grupo:"Inicio", dominio:"Gobernanza", nombre:"Desarrollar Acta de Constitución", completado:false},
            {id:2, grupo:"Inicio", dominio:"Interesados", nombre:"Identificar Interesados", completado:false},
            {id:3, grupo:"Inicio", dominio:"Gobernanza", nombre:"Establecer la Gobernanza del Proyecto", completado:false},
            {id:4, grupo:"Planificación", dominio:"Alcance", nombre:"Planificar la Gestión del Alcance", completado:false},
            {id:5, grupo:"Planificación", dominio:"Alcance", nombre:"Elicitar y Analizar Requisitos", completado:false},
            {id:6, grupo:"Planificación", dominio:"Alcance", nombre:"Definir el Alcance", completado:false},
            {id:7, grupo:"Planificación", dominio:"Alcance", nombre:"Crear Estructura de Desglose del Trabajo (EDT)", completado:false},
            {id:8, grupo:"Planificación", dominio:"Cronograma", nombre:"Planificar la Gestión del Cronograma", completado:false},
            {id:9, grupo:"Planificación", dominio:"Cronograma", nombre:"Desarrollar el Cronograma", completado:false},
            {id:10, grupo:"Planificación", dominio:"Finanzas", nombre:"Planificar la Gestión Financiera", completado:false},
            {id:11, grupo:"Planificación", dominio:"Finanzas", nombre:"Estimar Presupuesto y Costos", completado:false},
            {id:12, grupo:"Planificación", dominio:"Recursos", nombre:"Planificar la Gestión de Recursos", completado:false},
            {id:13, grupo:"Planificación", dominio:"Recursos", nombre:"Estimar Recursos Físicos y Humanos", completado:false},
            {id:14, grupo:"Planificación", dominio:"Riesgos", nombre:"Planificar la Gestión de Riesgos", completado:false},
            {id:15, grupo:"Planificación", dominio:"Riesgos", nombre:"Identificar y Evaluar Riesgos (Cualitativo/Cuantitativo)", completado:false},
            {id:16, grupo:"Planificación", dominio:"Riesgos", nombre:"Planificar las Respuestas a los Riesgos", completado:false},
            {id:17, grupo:"Planificación", dominio:"Gobernanza", nombre:"Planificar la Gestión de Calidad", completado:false},
            {id:18, grupo:"Planificación", dominio:"Recursos", nombre:"Planificar las Adquisiciones", completado:false},
            {id:19, grupo:"Planificación", dominio:"Interesados", nombre:"Planificar el Involucramiento de Interesados", completado:false},
            {id:20, grupo:"Planificación", dominio:"Interesados", nombre:"Planificar la Gestión de la Comunicación", completado:false},
            {id:21, grupo:"Planificación", dominio:"Gobernanza", nombre:"Planificar Gobernanza de Inteligencia Artificial (IA)", completado:false},
            {id:22, grupo:"Planificación", dominio:"Gobernanza", nombre:"Planificar Criterios de Sostenibilidad y ESG", completado:false},
            {id:23, grupo:"Ejecución", dominio:"Gobernanza", nombre:"Dirigir y Gestionar el Trabajo del Proyecto", completado:false},
            {id:24, grupo:"Ejecución", dominio:"Gobernanza", nombre:"Gestionar el Conocimiento del Proyecto", completado:false},
            {id:25, grupo:"Ejecución", dominio:"Recursos", nombre:"Adquirir y Desarrollar Recursos", completado:false},
            {id:26, grupo:"Ejecución", dominio:"Gobernanza", nombre:"Gestionar la Calidad", completado:false},
            {id:27, grupo:"Ejecución", dominio:"Riesgos", nombre:"Implementar Respuestas a los Riesgos", completado:false},
            {id:28, grupo:"Ejecución", dominio:"Recursos", nombre:"Efectuar Adquisiciones", completado:false},
            {id:29, grupo:"Ejecución", dominio:"Interesados", nombre:"Gestionar la Participación de los Interesados", completado:false},
            {id:30, grupo:"Ejecución", dominio:"Interesados", nombre:"Gestionar las Comunicaciones", completado:false},
            {id:31, grupo:"Ejecución", dominio:"Gobernanza", nombre:"Ejecutar y Monitorear Criterios de Sostenibilidad (ESG)", completado:false},
            {id:32, grupo:"Monitoreo y Control", dominio:"Gobernanza", nombre:"Monitorear y Controlar el Trabajo del Proyecto", completado:false},
            {id:33, grupo:"Monitoreo y Control", dominio:"Gobernanza", nombre:"Realizar el Control Integrado de Cambios", completado:false},
            {id:34, grupo:"Monitoreo y Control", dominio:"Alcance", nombre:"Monitorear y Controlar el Alcance", completado:false},
            {id:35, grupo:"Monitoreo y Control", dominio:"Cronograma", nombre:"Monitorear y Controlar el Cronograma", completado:false},
            {id:36, grupo:"Monitoreo y Control", dominio:"Finanzas", nombre:"Monitorear y Controlar las Finanzas", completado:false},
            {id:37, grupo:"Monitoreo y Control", dominio:"Recursos", nombre:"Monitorear y Controlar los Recursos", completado:false},
            {id:38, grupo:"Monitoreo y Control", dominio:"Riesgos", nombre:"Monitorear los Riesgos", completado:false},
            {id:39, grupo:"Monitoreo y Control", dominio:"Recursos", nombre:"Monitorear y Controlar las Adquisiciones", completado:false},
            {id:40, grupo:"Monitoreo y Control", dominio:"Interesados", nombre:"Monitorear Comunicaciones y Participación", completado:false},
            {id:41, grupo:"Cierre", dominio:"Gobernanza", nombre:"Cerrar el Proyecto o Fase", completado:false},
            {id:42, grupo:"Cierre", dominio:"Finanzas", nombre:"Confirmar la Realización de Beneficios", completado:false}
        ];
        
        // ============================================
        // ALMACENAMIENTO UNIFICADO
        // ============================================
        const STORAGE_PROYECTOS_KEY = 'pmi_proyectos';
        const STORAGE_OLD_KEYS = ['pmi_proyectos_v11', 'pmi_proyectos_v6'];
        
        function cargarProyectosStorage() {
            let data = localStorage.getItem(STORAGE_PROYECTOS_KEY);
            if (data) {
                try { return JSON.parse(data); } catch { return []; }
            }
            for (const oldKey of STORAGE_OLD_KEYS) {
                data = localStorage.getItem(oldKey);
                if (data) {
                    try {
                        const proyectos = JSON.parse(data);
                        localStorage.setItem(STORAGE_PROYECTOS_KEY, data);
                        localStorage.removeItem(oldKey);
                        return proyectos;
                    } catch { continue; }
                }
            }
            return [];
        }
        
        function guardarProyectosStorage(proyectos) {
            localStorage.setItem(STORAGE_PROYECTOS_KEY, JSON.stringify(proyectos));
        }
        
        let tiposCambio = { EUR:1, USD:1.09, GBP:0.86, JPY:164, CHF:0.95, BRL:5.45, MXN:18.25, COP:4190, ARS:950, CLP:920, DZD:134, CDF:2800, MZN:64, ZAR:18.5, NGN:1500, KES:140, EGP:48, MAD:10.8 };
        let proyecto = null;
        let cashflowChart = null, dashboardChart = null;
        let elementosGantt = [];
        let zoomLevel = 1;
        let matrizChart = null;
        let pdfActualBase64 = null;
        let pdfActualNombre = null;
        let burndownChart = null;
        let velocityChart = null;
        let cumulativeFlowChart = null;

        

        // ============================================
        // SISTEMA DE IDIOMAS - VERSIÓN SIMPLIFICADA
        // ============================================
        
        let idiomaApp = localStorage.getItem('pmi_idioma') || 'es';
        
       const textosApp = {
    es: {
        // ========== BOTONES GENERALES ==========
        btn_actualizar: " Actualizar",
        btn_guardar: " Guardar",
        btn_exportar: " Exportar",
        btn_editar: " Editar",
        btn_anadir: " Añadir",
        btn_eliminar: " Eliminar",
        btn_cancelar: "Cancelar",
        btn_cerrar: "Cerrar",
        btn_ver: " Ver",
        btn_copiar: " Copiar",
        btn_importar: " Importar",
        
        // ========== SIDEBAR ==========
        sidebar_acta: "Acta de Inicio",
        sidebar_dashboard: "Dashboard",
        sidebar_salud: "Salud del Proyecto",
        sidebar_finanzas: "Finanzas",
        sidebar_monedas: " Monedas",
        sidebar_venta: " Venta y Hitos",
        sidebar_cashflow: " Cashflow",
        sidebar_resumen: " Resumen de Gastos",
        sidebar_avales: " Avales y Garantías",
        sidebar_garantia: " Garantía",
        sidebar_financiero: "Módulo Financiero",
        sidebar_cronograma: "Cronograma Gantt",
        sidebar_riesgos: "Gestión de Riesgos",
        sidebar_stakeholders: "Stakeholders",
        sidebar_lista: " Lista y Matriz",
        sidebar_raci: " Matriz RACI",
        sidebar_procesos: "Procesos PMBOK",
        sidebar_recursos: "Recursos",
        sidebar_roles: " Roles",
        sidebar_equipo: " Equipo",
        sidebar_materiales: " Materiales",
        sidebar_servicios: " Servicios",
        sidebar_logistica: " Logística",
        sidebar_viajes: " Viajes",
        sidebar_comunicaciones: "Comunicaciones",
        sidebar_volver: "Volver a Cartera",
        sidebar_beneficios: "Seguimiento Beneficios",
        sidebar_cambios: "Solicitudes de Cambio",
        sidebar_lecciones: "Lecciones Aprendidas",
        sidebar_scrum: "Scrum Ágil",
        sidebar_sprintBacklog: "Sprint Backlog",
        sidebar_sprintBurndown: "Sprint Burndown",
        sidebar_velocityTracking: "Velocity Tracking",
        sidebar_retrospectives: "Retrospectives",
        sidebar_agileMetrics: "Agile Metrics",
        sidebar_sprintList: "Listado de Sprints",
        sidebar_agileCostControl: "Control de Gastos Ágil",
        
        // ========== TARJETAS PRINCIPALES ==========
        card_coste: " Coste Total",
        card_ingreso: " Ingreso Total",
        card_beneficio: " Beneficio",
        card_financiacion: " Financiación",
        
        // ========== ACTA DE INICIO ==========
        acta_titulo: " Acta de Constitución",
        acta_identificacion: "1. IDENTIFICACIÓN DEL PROYECTO",
        acta_objetivos: "2. OBJETIVOS",
        acta_alcance: "3. ALCANCE",
        acta_partes: "4. PARTES DEL PROYECTO",
        acta_presupuesto: "5. PRESUPUESTO Y VENTA",
        acta_condiciones: "6. CONDICIONES DE PAGO",
        acta_avales: "7. AVALES Y GARANTÍAS",
        acta_aprobaciones: "8. APROBACIONES",
        acta_metodologia: "9. METODOLOGÍA DE GESTIÓN",
        acta_nombre: " Nombre",
        acta_codigo: " Código",
        acta_pais: " País",
        acta_inicio: " Inicio",
        acta_fin: " Fin Plan",
        acta_moneda: " Moneda",
        acta_objetivo_general: " Objetivo General",
        acta_criterios_exito: " Criterios Éxito",
        acta_descripcion: " Descripción",
        acta_entregables_clave: " Entregables Clave",
        acta_pm: "Project Manager",
        acta_sponsor: "Sponsor",
        acta_cliente: "Cliente",
        acta_presupuesto_valor: " Presupuesto",
        acta_contrato: " Importe Total Contrato",
        acta_moneda_venta: " Moneda Venta",
        acta_roi: " ROI",
        acta_condiciones_texto: " Condiciones",
        acta_hitos_pago: " Hitos de Pago",
        acta_aprobado_por: " Aprobado por",
        acta_fecha_aprobacion: " Fecha",
        acta_metodologia_tipo: " Metodología",
        acta_metodologia_desc: " Descripción",
        acta_sin_hitos: "No hay hitos de pago definidos",
        acta_sin_avales: "No hay avales registrados",
        acta_pm_no_asignado: "No asignado",
        acta_sponsor_no_asignado: "No asignado",
        acta_cliente_no_asignado: "No asignado",
        
        // ========== SALUD DEL PROYECTO ==========
        salud_titulo: " Salud del Proyecto - Cuadro de Mando",
        salud_general: " SALUD GENERAL DEL PROYECTO",
        salud_analizando: "Analizando datos...",
        salud_progreso: " Progreso General",
        salud_riesgos: " Riesgos",
        salud_financiera: " Salud Financiera",
        salud_desviacion: " Desviación",
        salud_cpi: " CPI (Costos)",
        salud_spi: " SPI (Cronograma)",
        salud_roi: " ROI Proyectado",
        salud_eac: " EAC (Pronóstico)",
        salud_defectos: " Índice de Defectos",
        salud_velocidad: " Velocidad del Equipo",
        salud_satisfaccion: " Satisfacción Stakeholder",
        salud_huella: " Huella de Carbono",
        salud_pmbok: " Salud General (PMBOK 8)",
        salud_beneficio_proyectado: " Beneficio Proyectado",
        salud_indicadores: " INDICADORES CLAVE (KPIs)",
        salud_indicador: "Indicador",
        salud_valor: "Valor",
        salud_estado: "Estado",
        salud_meta: "Meta",
        salud_metricas_agiles: " Métricas Ágiles - Sprint Burn-down",
        salud_puntos_sprint: " Puntos por sprint",
        salud_sprints_totales: " Sprints totales",
        salud_sprint_actual: " Sprint actual",
        
        // ========== DASHBOARD ==========
        dashboard_titulo: " Dashboard",
        dashboard_indicador: "Indicador",
        dashboard_valor: "Valor",
        
        // ========== CRONOGRAMA GANTT ==========
        gantt_titulo: " Cronograma del Proyecto - Diagrama Gantt",
        gantt_sincronizar: " Sincronizar",
        gantt_nuevo: " Nuevo",
        gantt_exportar: " Exportar",
        gantt_sincronizar_fechas: " Sincronizar fechas",
        gantt_analisis_desviaciones: " Análisis de Desviaciones",
        gantt_calcular_costes: " Calcular costes reales",
        gantt_filtrar: " Filtrar por tipo:",
        gantt_todos: " Todos",
        gantt_edt: " EDT",
        gantt_actividad: " Actividades",
        gantt_hito: " Hitos",
        gantt_entregable: " Entregables",
        gantt_escala: " Escala:",
        gantt_buscar: " Buscar:",
        gantt_elementos: " Elementos del Cronograma",
        gantt_ordenar_fecha: " Por fecha",
        gantt_ordenar_tipo: " Por tipo",
        gantt_edicion_multiple: " Edición múltiple",
        gantt_reordenar: " Reordenar Códigos",
        gantt_tipo: "Tipo",
        gantt_nombre: "Nombre",
        gantt_inicio: "Inicio",
        gantt_duracion: "Duración",
        gantt_fin_plan: "Fin Plan",
        gantt_desviacion: "Desviación",
        gantt_progreso: "Progreso",
        gantt_fechas_reales: "Fechas Reales",
        gantt_responsable: "Responsable",
        gantt_depende_de: "Depende de",
        gantt_coste: " Coste",
        gantt_recurso: " Recurso",
        gantt_acciones: "Acciones",
        gantt_version: " Versión",
        gantt_zoom_in: " Zoom +",
        gantt_zoom_out: " Zoom -",
        gantt_colapsar: " Colapsar",
        gantt_expandir: " Expandir",
        
        // ========== RIESGOS ==========
        riesgos_titulo: " Gestión de Riesgos del Proyecto",
        riesgos_analizar: " Analizar Riesgos",
        riesgos_nuevo: " Nuevo Riesgo",
        riesgos_exportar: " Exportar",
        riesgos_criticos: " Riesgos Críticos",
        riesgos_altos: " Riesgos Altos",
        riesgos_medios: " Riesgos Medios",
        riesgos_bajos: " Riesgos Bajos",
        riesgos_matriz: " Matriz de Probabilidad vs Impacto",
        riesgos_mostrar_matriz: "Mostrar Matriz",
        riesgos_ocultar_matriz: "Ocultar",
        riesgos_lista: " Lista de Riesgos Identificados",
        riesgos_ordenar_prob: " Por Probabilidad",
        riesgos_ordenar_impacto: " Por Impacto",
        riesgos_ordenar_score: " Por Score",
        riesgos_id: "ID",
        riesgos_nombre: "Riesgo",
        riesgos_categoria: "Categoría",
        riesgos_probabilidad: "Probabilidad",
        riesgos_impacto: "Impacto",
        riesgos_score: "Score",
        riesgos_nivel: "Nivel",
        riesgos_respuesta: "Respuesta",
        riesgos_estado: "Estado",
        riesgos_plan_accion: "Plan de acción",
        riesgos_analisis_cuantitativo: " Análisis Cuantitativo de Riesgos",
        riesgos_calcular_valor: "Calcular Valor Esperado",
        riesgos_valor_proyecto: "Valor del Proyecto (en moneda base)",
        riesgos_reserva_contingencia: "Reserva de Contingencia Estimada",
        riesgos_acciones_titulo: " Registro de Acciones de Mitigación",
        riesgos_nueva_accion: " Nueva Acción",
        riesgos_asociado: "Riesgo asociado",
        riesgos_fecha: "Fecha",
        riesgos_accion_tomada: "Acción tomada",
        
        // ========== STAKEHOLDERS ==========
        stakeholders_titulo: " Stakeholders",
        stakeholders_nuevo: " Añadir",
        stakeholders_nombre: "Nombre",
        stakeholders_rol: "Rol",
        stakeholders_poder: "Poder",
        stakeholders_interes: "Interés",
        stakeholders_expectativas: "Expectativas",
        
        // ========== MATRIZ RACI ==========
        raci_titulo: " Matriz RACI",
        raci_generar_informe: " Generar Informe RACI",
        raci_actividad: "Actividad",
        raci_info: "R=Responsable, A=Accountable, C=Consultado, I=Informado",
        
        // ========== PROCESOS PMBOK ==========
        procesos_titulo: " Procesos PMBOK",
        procesos_resetear: " Resetear",
        
        // ========== COMUNICACIONES ==========
        comunicaciones_titulo: "Comunicaciones y Gestión de Reuniones",
        comunicaciones_nueva: " Nueva Comunicación",
        comunicaciones_nueva_reunion: " Nueva Reunión",
        comunicaciones_lista: " Comunicaciones",
        comunicaciones_minutas: " Minutas de Reuniones",
        comunicaciones_fecha: "Fecha",
        comunicaciones_tipo: "Tipo",
        comunicaciones_con: "Con",
        comunicaciones_asunto: "Asunto",
        comunicaciones_contenido: "Contenido",
        comunicaciones_adjuntos: "Adjuntos",
        
        // ========== CONFIRMACIONES ==========
        confirmar_eliminar: "¿Eliminar?",
        confirmar_eliminar_material: "¿Eliminar material?",
        confirmar_eliminar_miembro: "¿Eliminar miembro?",
        confirmar_eliminar_servicio: "¿Eliminar servicio?",
        confirmar_eliminar_minuta: "¿Eliminar minuta?",
        confirmar_eliminar_riesgo: "¿Eliminar riesgo?",
        confirmar_eliminar_accion: "¿Eliminar acción?",
        confirmar_eliminar_garantia: "¿Eliminar la configuración de garantía?",
        confirmar_eliminar_viaje: "¿Eliminar este viaje?",
        confirmar_eliminar_aval: "¿Eliminar este aval/garantía?",
        confirmar_eliminar_hito: "¿Eliminar este hito?",
        confirmar_eliminar_cambio: "¿Eliminar esta solicitud de cambio?",
        confirmar_eliminar_leccion: "¿Eliminar esta lección aprendida?",
        confirmar_eliminar_historia: "¿Eliminar esta historia?",
        confirmar_eliminar_retrospectiva: "¿Eliminar esta retrospectiva?",
        confirmar_eliminar_elemento: "¿Eliminar este elemento?",
        confirmar_resetear_procesos: "¿Resetear todos los procesos?",
        confirmar_cerrar_sesion: "¿Cerrar sesión?",
        confirmar_cerrar_sesion_seguro: "¿Seguro que quieres cerrar sesión?",
        confirmar_api_key: "¿Quieres obtener una API Key de OpenAI para análisis más precisos?",
        prompt_velocidad: "Ingrese la velocidad del equipo (puntos por sprint):",
        prompt_huella: "Ingrese la huella de carbono (kg CO₂):",
        prompt_defectos: "Ingrese el número de defectos encontrados:",
        prompt_api_key: " Ingresa tu API Key de OpenAI (opcional - dejar vacío para usar análisis local):\n\nObtén una en https://platform.openai.com/api-keys",
        prompt_beneficio_real: " Ingrese el beneficio real obtenido hasta la fecha:",
        toast_guardado: " Guardado",
        toast_eliminado: " Eliminado",
        toast_actualizado: " Actualizado",
        toast_error: " Error",
        toast_nombre_obligatorio: " El nombre es obligatorio",
        toast_acta_guardada: " Acta guardada y sincronizada con la venta",
        toast_pm_actualizado: " PM actualizado",
        toast_sponsor_actualizado: " Sponsor actualizado",
        toast_cliente_actualizado: " Cliente actualizado",
        toast_venta_actualizada: " Datos de venta actualizados",
        toast_stakeholder_actualizado: " Stakeholder actualizado",
        toast_procesos_reseteados: " Procesos reseteados",
        toast_elemento_creado: " Elemento creado: ",
        toast_sin_desviaciones: " No hay desviaciones registradas. ¡Todo va según lo planificado!",
        toast_riesgo_actualizado: " Riesgo actualizado",
        toast_accion_guardada: " Acción guardada",
        toast_tipos_cambio_guardados: " Todos los tipos de cambio guardados",
        toast_proyecto_importado: " Proyecto importado correctamente. Recargando...",
        toast_hito_actualizado: " Hito actualizado",
        toast_hito_eliminado: " Hito eliminado",
        toast_solicitud_actualizada: " Solicitud actualizada",
        toast_solicitud_eliminada: " Solicitud eliminada",
        toast_leccion_actualizada: " Lección actualizada",
        toast_leccion_eliminada: " Lección eliminada",
        toast_historia_actualizada: " Historia actualizada",
        toast_historia_eliminada: " Historia eliminada",
        toast_retrospectiva_eliminada: " Retrospectiva eliminada",
        toast_selecciona_elementos: " Selecciona elementos",
        toast_no_hay_pdf: " No hay PDF",
        toast_asunto_obligatorio: " Asunto obligatorio",
        toast_titulo_obligatorio: " Título obligatorio",
        toast_fecha_inicio_obligatoria: " La fecha de inicio es obligatoria",
        toast_duracion_positiva: " La duración debe ser un número positivo",
        toast_hitos_duracion_cero: " Los hitos deben tener duración 0 días. Se ajustará automáticamente.",
        toast_no_proyecto: " No hay proyecto cargado",
        toast_descripcion_obligatoria: " La descripción es obligatoria",
        toast_titulo_obligatorio_gen: " El título es obligatorio",
        toast_error_crear_elemento: " Error al crear el elemento: ",
        toast_sprint_activo: " Ya hay un sprint activo. Finalízalo primero.",
        toast_sprint_no_activo: " No hay sprint activo",
        
        // ========== IDIOMA ==========
        idioma_titulo: " Cambiar idioma",
        idioma_es: "Español",
        idioma_en: "Inglés",
        idioma_fr: "Francés",
        idioma_de: "Alemán",
        idioma_cambiado: "Idioma cambiado a"
    },
    
    en: {
        btn_actualizar: " Update",
        btn_guardar: " Save",
        btn_exportar: " Export",
        btn_editar: " Edit",
        btn_anadir: " Add",
        btn_eliminar: " Delete",
        btn_cancelar: "Cancel",
        btn_cerrar: "Close",
        btn_ver: " View",
        btn_copiar: " Copy",
        btn_importar: " Import",
        
        sidebar_acta: "Project Charter",
        sidebar_dashboard: "Dashboard",
        sidebar_salud: "Project Health",
        sidebar_finanzas: "Finance",
        sidebar_monedas: " Currencies",
        sidebar_venta: " Sales & Milestones",
        sidebar_cashflow: " Cashflow",
        sidebar_resumen: " Expense Summary",
        sidebar_avales: " Guarantees",
        sidebar_garantia: " Warranty",
        sidebar_financiero: "Financial Module",
        sidebar_cronograma: "Gantt Schedule",
        sidebar_riesgos: "Risk Management",
        sidebar_stakeholders: "Stakeholders",
        sidebar_lista: " List & Matrix",
        sidebar_raci: " RACI Matrix",
        sidebar_procesos: "PMBOK Processes",
        sidebar_recursos: "Resources",
        sidebar_roles: " Roles",
        sidebar_equipo: " Team",
        sidebar_materiales: " Materials",
        sidebar_servicios: " Services",
        sidebar_logistica: " Logistics",
        sidebar_viajes: " Travel",
        sidebar_comunicaciones: "Communications",
        sidebar_volver: "Back to Portfolio",
        sidebar_beneficios: "Benefits Tracking",
        sidebar_cambios: "Change Requests",
        sidebar_lecciones: "Lessons Learned",
        sidebar_scrum: "Scrum Agile",
        sidebar_sprintBacklog: "Sprint Backlog",
        sidebar_sprintBurndown: "Sprint Burndown",
        sidebar_velocityTracking: "Velocity Tracking",
        sidebar_retrospectives: "Retrospectives",
        sidebar_agileMetrics: "Agile Metrics",
        sidebar_sprintList: "Sprint List",
        sidebar_agileCostControl: "Agile Cost Control",
        
        card_coste: " Total Cost",
        card_ingreso: " Total Income",
        card_beneficio: " Profit",
        card_financiacion: " Financing",
        
        acta_titulo: " Project Charter",
        acta_identificacion: "1. PROJECT IDENTIFICATION",
        acta_objetivos: "2. OBJECTIVES",
        acta_alcance: "3. SCOPE",
        acta_partes: "4. PROJECT PARTIES",
        acta_presupuesto: "5. BUDGET & SALES",
        acta_condiciones: "6. PAYMENT TERMS",
        acta_avales: "7. GUARANTEES",
        acta_aprobaciones: "8. APPROVALS",
        acta_metodologia: "9. MANAGEMENT METHODOLOGY",
        acta_nombre: " Name",
        acta_codigo: " Code",
        acta_pais: " Country",
        acta_inicio: " Start",
        acta_fin: " Planned End",
        acta_moneda: " Currency",
        acta_objetivo_general: " General Objective",
        acta_criterios_exito: " Success Criteria",
        acta_descripcion: " Description",
        acta_entregables_clave: " Key Deliverables",
        acta_pm: "Project Manager",
        acta_sponsor: "Sponsor",
        acta_cliente: "Client",
        acta_presupuesto_valor: " Budget",
        acta_contrato: " Total Contract Amount",
        acta_moneda_venta: " Sales Currency",
        acta_roi: " ROI",
        acta_condiciones_texto: " Conditions",
        acta_hitos_pago: " Payment Milestones",
        acta_aprobado_por: " Approved by",
        acta_fecha_aprobacion: " Date",
        acta_metodologia_tipo: " Methodology",
        acta_metodologia_desc: " Description",
        acta_sin_hitos: "No payment milestones defined",
        acta_sin_avales: "No guarantees registered",
        acta_pm_no_asignado: "Not assigned",
        acta_sponsor_no_asignado: "Not assigned",
        acta_cliente_no_asignado: "Not assigned",
        
        salud_titulo: " Project Health - Dashboard",
        salud_general: " OVERALL PROJECT HEALTH",
        salud_analizando: "Analyzing data...",
        salud_progreso: " Overall Progress",
        salud_riesgos: " Risks",
        salud_financiera: " Financial Health",
        salud_desviacion: " Deviation",
        salud_cpi: " CPI (Cost)",
        salud_spi: " SPI (Schedule)",
        salud_roi: " Projected ROI",
        salud_eac: " EAC (Forecast)",
        salud_defectos: " Defect Rate",
        salud_velocidad: " Team Velocity",
        salud_satisfaccion: " Stakeholder Satisfaction",
        salud_huella: " Carbon Footprint",
        salud_pmbok: " Overall Health (PMBOK 8)",
        salud_beneficio_proyectado: " Projected Profit",
        salud_indicadores: " KEY PERFORMANCE INDICATORS (KPIs)",
        salud_indicador: "Indicator",
        salud_valor: "Value",
        salud_estado: "Status",
        salud_meta: "Target",
        salud_metricas_agiles: " Agile Metrics - Sprint Burn-down",
        salud_puntos_sprint: " Points per sprint",
        salud_sprints_totales: " Total sprints",
        salud_sprint_actual: " Current sprint",
        
        dashboard_titulo: " Dashboard",
        dashboard_indicador: "Indicator",
        dashboard_valor: "Value",
        
        gantt_titulo: " Project Schedule - Gantt Chart",
        gantt_sincronizar: " Synchronize",
        gantt_nuevo: " New",
        gantt_exportar: " Export",
        gantt_sincronizar_fechas: " Sync dates",
        gantt_analisis_desviaciones: " Deviation Analysis",
        gantt_calcular_costes: " Calculate actual costs",
        gantt_filtrar: " Filter by type:",
        gantt_todos: " All",
        gantt_edt: " WBS",
        gantt_actividad: " Activities",
        gantt_hito: " Milestones",
        gantt_entregable: " Deliverables",
        gantt_escala: " Scale:",
        gantt_buscar: " Search:",
        gantt_elementos: " Schedule Elements",
        gantt_ordenar_fecha: " By date",
        gantt_ordenar_tipo: " By type",
        gantt_edicion_multiple: " Multiple edit",
        gantt_reordenar: " Reorder Codes",
        gantt_tipo: "Type",
        gantt_nombre: "Name",
        gantt_inicio: "Start",
        gantt_duracion: "Duration",
        gantt_fin_plan: "Planned End",
        gantt_desviacion: "Deviation",
        gantt_progreso: "Progress",
        gantt_fechas_reales: "Actual Dates",
        gantt_responsable: "Responsible",
        gantt_depende_de: "Depends on",
        gantt_coste: " Cost",
        gantt_recurso: " Resource",
        gantt_acciones: "Actions",
        gantt_version: " Version",
        gantt_zoom_in: " Zoom +",
        gantt_zoom_out: " Zoom -",
        gantt_colapsar: " Collapse",
        gantt_expandir: " Expand",
        
        riesgos_titulo: " Project Risk Management",
        riesgos_analizar: " Analyze Risks",
        riesgos_nuevo: " New Risk",
        riesgos_exportar: " Export",
        riesgos_criticos: " Critical Risks",
        riesgos_altos: " High Risks",
        riesgos_medios: " Medium Risks",
        riesgos_bajos: " Low Risks",
        riesgos_matriz: " Probability vs Impact Matrix",
        riesgos_mostrar_matriz: "Show Matrix",
        riesgos_ocultar_matriz: "Hide",
        riesgos_lista: " Identified Risks List",
        riesgos_ordenar_prob: " By Probability",
        riesgos_ordenar_impacto: " By Impact",
        riesgos_ordenar_score: " By Score",
        riesgos_id: "ID",
        riesgos_nombre: "Risk",
        riesgos_categoria: "Category",
        riesgos_probabilidad: "Probability",
        riesgos_impacto: "Impact",
        riesgos_score: "Score",
        riesgos_nivel: "Level",
        riesgos_respuesta: "Response",
        riesgos_estado: "Status",
        riesgos_plan_accion: "Action Plan",
        riesgos_analisis_cuantitativo: " Quantitative Risk Analysis",
        riesgos_calcular_valor: "Calculate Expected Value",
        riesgos_valor_proyecto: "Project Value (in base currency)",
        riesgos_reserva_contingencia: "Estimated Contingency Reserve",
        riesgos_acciones_titulo: " Mitigation Actions Log",
        riesgos_nueva_accion: " New Action",
        riesgos_asociado: "Associated Risk",
        riesgos_fecha: "Date",
        riesgos_accion_tomada: "Action Taken",
        
        stakeholders_titulo: " Stakeholders",
        stakeholders_nuevo: " Add",
        stakeholders_nombre: "Name",
        stakeholders_rol: "Role",
        stakeholders_poder: "Power",
        stakeholders_interes: "Interest",
        stakeholders_expectativas: "Expectations",
        
        raci_titulo: " RACI Matrix",
        raci_generar_informe: " Generate RACI Report",
        raci_actividad: "Activity",
        raci_info: "R=Responsible, A=Accountable, C=Consulted, I=Informed",
        
        procesos_titulo: " PMBOK Processes",
        procesos_resetear: " Reset",
        
        comunicaciones_titulo: "Communications & Meeting Management",
        comunicaciones_nueva: " New Communication",
        comunicaciones_nueva_reunion: " New Meeting",
        comunicaciones_lista: " Communications",
        comunicaciones_minutas: " Meeting Minutes",
        comunicaciones_fecha: "Date",
        comunicaciones_tipo: "Type",
        comunicaciones_con: "With",
        comunicaciones_asunto: "Subject",
        comunicaciones_contenido: "Content",
        comunicaciones_adjuntos: "Attachments",
        
        idioma_titulo: " Change language",
        idioma_es: "Spanish",
        idioma_en: "English",
        idioma_fr: "French",
        idioma_de: "German",
        idioma_cambiado: "Language changed to",
        
        // ========== MONEDAS ==========
        monedas_titulo: " Currencies & Exchange Rates",
        monedas_actualizar: " Update",
        monedas_guardar: " Save",
        monedas_base: "Base Currency",
        monedas_precio: "Sale Price",
        monedas_venta: "Sales Currency",
        monedas_condiciones: "Payment Terms",
        monedas_hitos: " Financial Milestones",
        monedas_anadir_hito: " Add Milestone",
        monedas_evolucion: " Exchange Rate Trend",
        monedas_comparar: " Currency to compare",
        monedas_periodo: " Period",
        
        // ========== VENTA ==========
        venta_titulo: " Sales",
        venta_precio: "Sale Price",
        venta_moneda: "Currency",
        venta_condiciones: "Terms",
        venta_anadir: " Add",
        
        // ========== CASHFLOW ==========
        cashflow_titulo: " Cashflow",
        cashflow_mes: "Month",
        cashflow_ingresos: "Income",
        cashflow_gastos: "Expenses",
        cashflow_neto: "Net",
        cashflow_acumulado: "Accumulated",
        cashflow_total: "TOTAL",
        
        // ========== RESUMEN GASTOS ==========
        resumen_titulo: " Expense Summary - Distribution by Category",
        resumen_actualizar: " Update",
        resumen_exportar: " Export",
        resumen_total: "Total Expenses",
        resumen_personal: "Personnel",
        resumen_materiales: "Materials",
        resumen_servicios: "Services",
        resumen_viajes: "Travel",
        resumen_logistica: "Logistics",
        resumen_financieros: "Financial",
        resumen_porcentaje: "% vs Budget",
        resumen_desglose: " Detailed Expense Breakdown",
        resumen_categoria: "Category",
        resumen_subcategoria: "Subcategory",
        resumen_concepto: "Concept",
        resumen_mes: "Month",
        resumen_importe: "Amount",
        resumen_porcentaje_total: "% of Total",
        resumen_total_general: "TOTAL GENERAL",
        resumen_analisis: " Expense Analysis",
        
        // ========== GARANTIA ==========
        garantia_titulo: " Warranty Management",
        garantia_configurar: " Configure Warranty",
        garantia_exportar: " Export",
        garantia_estado: "Status",
        garantia_no_configurada: "Not configured",
        garantia_duracion: "Duration",
        garantia_inicio: "Start",
        garantia_fin: "End",
        garantia_no_config_texto: "No warranty configured. Click \"Configure Warranty\" to start.",
        garantia_relacion_hitos: " Payment Milestone Relation",
        garantia_config_info: "Configure warranty to see how it affects payment milestones.",
        garantia_equipo: "Equipment/Product under warranty *",
        garantia_equipo_placeholder: "E.g., Dell PowerEdge Server, ERP System, etc.",
        garantia_duracion_anios: "Warranty duration (years)",
        garantia_fecha_inicio: "Start date",
        garantia_cobertura: "Coverage included",
        garantia_cobertura_placeholder: "E.g., Hardware repair, technical support, spare parts...",
        garantia_exclusiones: "Exclusions / Limitations",
        garantia_exclusiones_placeholder: "E.g., Damage from misuse, normal wear...",
        garantia_hito_final: " Last milestone is paid at end of warranty",
        garantia_hito_info: "Check this if the client does not pay the last milestone until the warranty period ends.",
        garantia_hito_select: "Select the final milestone",
        garantia_hito_placeholder: "-- Select milestone --",
        garantia_hito_help: "This milestone will move to the end of the warranty period.",
        garantia_info: " If you activate this option, the selected milestone will be paid at the end of the warranty, not on the original date.",
        garantia_guardar: " Save Warranty",
        
        // ========== FINANCIERO ==========
        financiero_titulo: " Advanced Financial Analysis",
        financiero_actualizar: " Update All",
        financiero_recalcular: " Recalculate",
        financiero_costemateriales: "Total Material Cost",
        financiero_aranceles: "Total Duties",
        financiero_tasas: "Customs Fees",
        financiero_importacion: "Total Import Cost",
        
        // ========== EQUIPO ==========
        equipo_titulo: " Team",
        equipo_nuevo: " Add",
        equipo_nombre: "Name",
        equipo_rol: "Role",
        equipo_email: "Email",
        equipo_costeh: "Cost/h",
        equipo_moneda: "Currency",
        equipo_horasmes: "Hours/month",
        equipo_acciones: "Actions",
        
        // ========== MATERIALES ==========
        materiales_titulo: " Materials",
        materiales_nuevo: " Add",
        materiales_actualizar: " Update",
        materiales_nombre: "Name",
        materiales_proveedor: "Supplier",
        materiales_partnumber: "Part Number",
        materiales_cantidad: "Quantity",
        materiales_coste: "Cost",
        materiales_moneda: "Currency",
        materiales_pais: "Country of Origin",
        materiales_periodo: "Period",
        materiales_plazo: "Lead Time",
        materiales_incoterm: "INCOTERM",
        materiales_envio: "Shipping",
        materiales_arancel: "Duty",
        materiales_pago: "Payment",
        materiales_acciones: "Actions",
        
        // ========== SERVICIOS ==========
        servicios_titulo: " Services",
        servicios_nuevo: " Add",
        servicios_nombre: "Name",
        servicios_proveedor: "Provider",
        servicios_cantidad: "Quantity",
        servicios_coste: "Cost",
        servicios_moneda: "Currency",
        servicios_impuesto: "Tax",
        servicios_total: "Total",
        servicios_mes: "Month",
        servicios_acciones: "Actions",
        
        // ========== VIAJES ==========
        viajes_titulo: " Travel Management",
        viajes_nuevo: " New Trip",
        viajes_exportar: " Export",
        viajes_vuelos: "Flights",
        viajes_hoteles: "Hotels",
        viajes_comidas: "Meals",
        viajes_traslados: "Transfers",
        viajes_total: "Total Travel",
        viajes_registro: " Travel Log",
        
        // ========== LOGISTICA ==========
        logistica_titulo: " Logistics - 3D Cubing Simulator",
        logistica_guardar: " Save",
        logistica_cargar: " Load",
        logistica_csv: " CSV",
        logistica_pdf: " PDF",
        logistica_cargas: "Cargo",
        logistica_volumen: "Total Volume",
        logistica_peso: "Weight / Max",
        logistica_costo: "Logistics Cost",
        logistica_bulto_nuevo: " New Package / Pallet",
        logistica_asignar_material: " Assign Material to Package",
        
        // ========== AVALES ==========
        avales_titulo: " Guarantees & Bank Guarantees",
        avales_nuevo: " Add Guarantee",
        
        // ========== BENEFICIOS ==========
        beneficios_titulo: " Benefits Tracking",
        beneficios_registrar: " Register Real Profit",
        beneficios_exportar: " Export",
        beneficios_proyectado: "Projected Profit",
        beneficios_real: "Real Profit",
        beneficios_desviacion: "Deviation",
        beneficios_estado: "Status",
        beneficios_hitos: " Benefit Milestones",
        beneficios_agregar_hito: " Add Milestone",
        beneficios_indicadores: " Success Indicators",
        beneficios_indicador: "Indicator",
        beneficios_meta: "Target",
        beneficios_real_label: "Real",
        beneficios_cumplimiento: "Compliance",
        
        // ========== CAMBIOS ==========
        cambios_titulo: " Change Request Management (PMBOK 8)",
        cambios_nuevo: " New Request",
        cambios_pendientes: "Pending",
        cambios_aprobados: "Approved",
        cambios_rechazados: "Rejected",
        cambios_implementados: "Implemented",
        cambios_id: "ID",
        cambios_fecha: "Date",
        cambios_solicitante: "Requester",
        cambios_descripcion: "Description",
        cambios_impacto: "Impact",
        cambios_prioridad: "Priority",
        cambios_estado: "Status",
        cambios_aprobado_por: "Approved by",
        cambios_acciones: "Actions",
        
        // ========== LECCIONES ==========
        lecciones_titulo: " Lessons Learned (PMBOK 8)",
        lecciones_nuevo: " New Lesson",
        lecciones_exitos: " Successes",
        lecciones_mejora: " Improvement Areas",
        lecciones_recomendaciones: " Recommendations",
        
        // ========== SPRINT BACKLOG ==========
        sprintBacklog_titulo: " Sprint Backlog - User Story Management",
        sprintBacklog_nueva_historia: " New Story",
        sprintBacklog_iniciar: " Start Sprint",
        sprintBacklog_finalizar: " Finish Sprint",
        sprintBacklog_actual: "Sprint Actual: Not started",
        sprintBacklog_info: "Start a sprint to begin working",
        sprintBacklog_puntos_plan: " Planned Points:",
        sprintBacklog_puntos_comp: " Completed Points:",
        sprintBacklog_progreso: " Progress:",
        sprintBacklog_backlog: " Product Backlog",
        sprintBacklog_prioridad: " By Priority",
        sprintBacklog_puntos: " By Points",
        sprintBacklog_exportar: " Export",
        
        // ========== SPRINT BURNDOWN ==========
        sprintBurndown_titulo: " Sprint Burndown Chart",
        sprintBurndown_actualizar: " Update",
        sprintBurndown_exportar: " Export",
        sprintBurndown_registro: " Daily Sprint Log",
        sprintBurndown_dia: "Day",
        sprintBurndown_puntos_rest: "Remaining Points",
        sprintBurndown_puntos_hoy: "Completed Today",
        sprintBurndown_acciones: "Actions",
        sprintBurndown_registrar: " Register Daily Progress",
        
        // ========== VELOCITY TRACKING ==========
        velocityTracking_titulo: " Velocity Tracking - Team Speed",
        velocityTracking_calcular: " Calculate Velocity",
        velocityTracking_exportar: " Export",
        velocityTracking_promedio: "Average Velocity",
        velocityTracking_puntos_sprint: "points/sprint",
        velocityTracking_mejor: "Best Sprint",
        velocityTracking_peor: "Worst Sprint",
        velocityTracking_prediccion: "Next Prediction",
        velocityTracking_puntos_est: "estimated points",
        velocityTracking_historial: " Completed Sprints History",
        velocityTracking_sprint: "Sprint",
        velocityTracking_fecha_inicio: "Start Date",
        velocityTracking_fecha_fin: "End Date",
        velocityTracking_puntos_plan: "Planned Points",
        velocityTracking_puntos_comp: "Completed Points",
        velocityTracking_velocidad: "Velocity",
        velocityTracking_eficiencia: "Efficiency",
        
        // ========== RETROSPECTIVES ==========
        retrospectives_titulo: " Sprint Retrospectives",
        retrospectives_nuevo: " New Retrospective",
        retrospectives_bien: " Things that went well",
        retrospectives_mejorar: " Things to improve",
        retrospectives_acciones: " Committed Actions",
        retrospectives_completadas: " Completed Actions",
        
        // ========== AGILE METRICS ==========
        agileMetrics_titulo: " Agile Metrics - Dashboard",
        agileMetrics_actualizar: " Update",
        agileMetrics_exportar: " Export",
        agileMetrics_lead_time: "Lead Time",
        agileMetrics_dias_prom: "avg days",
        agileMetrics_cycle_time: "Cycle Time",
        agileMetrics_dias_hist: "days/story",
        agileMetrics_throughput: "Throughput",
        agileMetrics_hist_sprint: "stories/sprint",
        agileMetrics_predictibilidad: "Predictability",
        agileMetrics_cumplimiento: "target compliance",
        agileMetrics_detalle: " Detailed Metrics by Sprint",
        agileMetrics_sprint: "Sprint",
        agileMetrics_historias: "Stories",
        agileMetrics_puntos: "Points",
        agileMetrics_lead: "Lead Time",
        agileMetrics_cycle: "Cycle Time",
        agileMetrics_throughput_label: "Throughput",
        agileMetrics_predict: "Predictability",
        
        // ========== SPRINT LIST ==========
        sprintList_titulo: " Sprint Management",
        sprintList_refrescar: " Refresh",
        sprintList_exportar: " Export",
        sprintList_total: "Total Sprints",
        sprintList_activos: "Active",
        sprintList_completados: "Completed",
        sprintList_velocidad_media: "Average Velocity",
        sprintList_id: "ID",
        sprintList_nombre: "Name",
        sprintList_fecha_inicio: "Start Date",
        sprintList_fecha_fin: "End Date",
        sprintList_estado: "Status",
        sprintList_puntos_plan: "Planned Points",
        sprintList_puntos_comp: "Completed Points",
        sprintList_velocidad: "Velocity",
        sprintList_eficiencia: "Efficiency",
        sprintList_acciones: "Actions",
        
        // ========== AGILE COST CONTROL ==========
        agileCostControl_titulo: " Cost Control - Agile Management (PMBOK 8)",
        agileCostControl_actualizar: " Update",
        agileCostControl_exportar: " Export",
        agileCostControl_coste_total: "Total Project Cost",
        agileCostControl_coste_medio: "Average Cost per Sprint",
        agileCostControl_coste_punto: "Cost per Point",
        agileCostControl_burn_rate: "Burn Rate",
        agileCostControl_desglose: " Cost Breakdown by Sprint",
        agileCostControl_sprint: "Sprint",
        agileCostControl_puntos: "Points",
        agileCostControl_coste_plan: "Planned Cost",
        agileCostControl_coste_real: "Real Cost",
        agileCostControl_desviacion: "Deviation",
        agileCostControl_coste_punto_label: "Cost/Point",
        agileCostControl_estado: "Status",
        agileCostControl_alertas: " Deviation Alerts",
        agileCostControl_pmbok: " PMBOK 8 Indicators",
        agileCostControl_cpi: "CPI (Cost Performance)",
        agileCostControl_spi: "SPI (Schedule Performance)",
        agileCostControl_eac: "EAC (Estimate at Completion)",
        
        // ========== ROLES ==========
        roles_titulo: " Roles",
        
        // ========== CONFIRMACIONES ==========
        confirmar_eliminar: "Delete?",
        confirmar_eliminar_material: "Delete material?",
        confirmar_eliminar_miembro: "Delete member?",
        confirmar_eliminar_servicio: "Delete service?",
        confirmar_eliminar_minuta: "Delete minutes?",
        confirmar_eliminar_riesgo: "Delete risk?",
        confirmar_eliminar_accion: "Delete action?",
        confirmar_eliminar_garantia: "Delete warranty configuration?",
        confirmar_eliminar_viaje: "Delete this trip?",
        confirmar_eliminar_aval: "Delete this guarantee?",
        confirmar_eliminar_hito: "Delete this milestone?",
        confirmar_eliminar_cambio: "Delete this change request?",
        confirmar_eliminar_leccion: "Delete this lesson learned?",
        confirmar_eliminar_historia: "Delete this story?",
        confirmar_eliminar_retrospectiva: "Delete this retrospective?",
        confirmar_eliminar_elemento: "Delete this element?",
        confirmar_resetear_procesos: "Reset all processes?",
        confirmar_cerrar_sesion: "Logout?",
        confirmar_cerrar_sesion_seguro: "Are you sure you want to logout?",
        confirmar_api_key: "Do you want to get an OpenAI API Key for more accurate analysis?",
        prompt_velocidad: "Enter team velocity (points per sprint):",
        prompt_huella: "Enter carbon footprint (kg CO₂):",
        prompt_defectos: "Enter number of defects found:",
        prompt_api_key: " Enter your OpenAI API Key (optional - leave empty for local analysis):\n\nGet one at https://platform.openai.com/api-keys",
        prompt_beneficio_real: " Enter the real profit obtained to date:",
        toast_guardado: " Saved",
        toast_eliminado: " Deleted",
        toast_actualizado: " Updated",
        toast_error: " Error",
        toast_nombre_obligatorio: " Name is required",
        toast_acta_guardada: " Charter saved and synced with sales",
        toast_pm_actualizado: " PM updated",
        toast_sponsor_actualizado: " Sponsor updated",
        toast_cliente_actualizado: " Client updated",
        toast_venta_actualizada: " Sales data updated",
        toast_stakeholder_actualizado: " Stakeholder updated",
        toast_procesos_reseteados: " Processes reset",
        toast_elemento_creado: " Element created: ",
        toast_sin_desviaciones: " No deviations recorded. Everything is on track!",
        toast_riesgo_actualizado: " Risk updated",
        toast_accion_guardada: " Action saved",
        toast_tipos_cambio_guardados: " All exchange rates saved",
        toast_proyecto_importado: " Project imported successfully. Reloading...",
        toast_hito_actualizado: " Milestone updated",
        toast_hito_eliminado: " Milestone deleted",
        toast_solicitud_actualizada: " Request updated",
        toast_solicitud_eliminada: " Request deleted",
        toast_leccion_actualizada: " Lesson updated",
        toast_leccion_eliminada: " Lesson deleted",
        toast_historia_actualizada: " Story updated",
        toast_historia_eliminada: " Story deleted",
        toast_retrospectiva_eliminada: " Retrospective deleted",
        toast_selecciona_elementos: " Select elements",
        toast_no_hay_pdf: " No PDF",
        toast_asunto_obligatorio: " Subject is required",
        toast_titulo_obligatorio: " Title is required",
        toast_fecha_inicio_obligatoria: " Start date is required",
        toast_duracion_positiva: " Duration must be a positive number",
        toast_hitos_duracion_cero: " Milestones must have 0 days duration. Will adjust automatically.",
        toast_no_proyecto: " No project loaded",
        toast_descripcion_obligatoria: " Description is required",
        toast_titulo_obligatorio_gen: " Title is required",
        toast_error_crear_elemento: " Error creating element: ",
        toast_sprint_activo: " There is an active sprint already. Finish it first.",
        toast_sprint_no_activo: " No active sprint"
    },
    
    fr: {
        btn_actualizar: " Mettre à jour",
        btn_guardar: " Enregistrer",
        btn_exportar: " Exporter",
        btn_editar: " Modifier",
        btn_anadir: " Ajouter",
        btn_eliminar: " Supprimer",
        btn_cancelar: "Annuler",
        btn_cerrar: "Fermer",
        btn_ver: " Voir",
        btn_copiar: " Copier",
        btn_importar: " Importer",
        
        sidebar_acta: "Charte du Projet",
        sidebar_dashboard: "Tableau de Bord",
        sidebar_salud: "Santé du Projet",
        sidebar_finanzas: "Finances",
        sidebar_monedas: " Devises",
        sidebar_venta: " Vente et Jalons",
        sidebar_cashflow: " Flux de Trésorerie",
        sidebar_resumen: " Résumé des Dépenses",
        sidebar_avales: " Garanties",
        sidebar_garantia: " Garantie",
        sidebar_financiero: "Module Financier",
        sidebar_cronograma: "Diagramme de Gantt",
        sidebar_riesgos: "Gestion des Risques",
        sidebar_stakeholders: "Parties Prenantes",
        sidebar_lista: " Liste et Matrice",
        sidebar_raci: " Matrice RACI",
        sidebar_procesos: "Processus PMBOK",
        sidebar_recursos: "Ressources",
        sidebar_roles: " Rôles",
        sidebar_equipo: " Équipe",
        sidebar_materiales: " Matériaux",
        sidebar_servicios: " Services",
        sidebar_logistica: " Logistique",
        sidebar_viajes: " Voyages",
        sidebar_comunicaciones: "Communications",
        sidebar_volver: "Retour au Portefeuille",
        sidebar_beneficios: "Suivi des Bénéfices",
        sidebar_cambios: "Demandes de Modification",
        sidebar_lecciones: "Leçons Apprises",
        sidebar_scrum: "Scrum Agile",
        sidebar_sprintBacklog: "Sprint Backlog",
        sidebar_sprintBurndown: "Sprint Burndown",
        sidebar_velocityTracking: "Suivi de Vélocité",
        sidebar_retrospectives: "Rétrospectives",
        sidebar_agileMetrics: "Métriques Agile",
        sidebar_sprintList: "Liste des Sprints",
        sidebar_agileCostControl: "Contrôle des Coûts Agile",
        
        card_coste: " Coût Total",
        card_ingreso: " Revenu Total",
        card_beneficio: " Bénéfice",
        card_financiacion: " Financement",
        
        acta_titulo: " Charte du Projet",
        acta_identificacion: "1. IDENTIFICATION DU PROJET",
        acta_objetivos: "2. OBJECTIFS",
        acta_alcance: "3. PORTÉE",
        acta_partes: "4. PARTIES DU PROJET",
        acta_presupuesto: "5. BUDGET & VENTE",
        acta_condiciones: "6. CONDITIONS DE PAIEMENT",
        acta_avales: "7. GARANTIES",
        acta_aprobaciones: "8. APPROBATIONS",
        acta_metodologia: "9. MÉTHODOLOGIE DE GESTION",
        acta_nombre: " Nom",
        acta_codigo: " Code",
        acta_pais: " Pays",
        acta_inicio: " Début",
        acta_fin: " Fin Planifiée",
        acta_moneda: " Monnaie",
        acta_objetivo_general: " Objectif Général",
        acta_criterios_exito: " Critères de Succès",
        acta_descripcion: " Description",
        acta_entregables_clave: " Livrables Clés",
        acta_pm: "Chef de Projet",
        acta_sponsor: "Sponsor",
        acta_cliente: "Client",
        acta_presupuesto_valor: " Budget",
        acta_contrato: " Montant Total du Contrat",
        acta_moneda_venta: " Monnaie de Vente",
        acta_roi: " ROI",
        acta_condiciones_texto: " Conditions",
        acta_hitos_pago: " Jalons de Paiement",
        acta_aprobado_por: " Approuvé par",
        acta_fecha_aprobacion: " Date",
        acta_metodologia_tipo: " Méthodologie",
        acta_metodologia_desc: " Description",
        acta_sin_hitos: "Aucun jalon de paiement défini",
        acta_sin_avales: "Aucune garantie enregistrée",
        acta_pm_no_asignado: "Non assigné",
        acta_sponsor_no_asignado: "Non assigné",
        acta_cliente_no_asignado: "Non assigné",
        
        // ========== SALUD DU PROJET ==========
        salud_titulo: " Santé du Projet - Tableau de Bord",
        salud_general: " SANTÉ GÉNÉRALE DU PROJET",
        salud_analizando: "Analyse des données...",
        salud_progreso: " Progrès Général",
        salud_riesgos: " Risques",
        salud_financiera: " Santé Financière",
        salud_desviacion: " Déviation",
        salud_cpi: " CPI (Coûts)",
        salud_spi: " SPI (Calendrier)",
        salud_roi: " ROI Projeté",
        salud_eac: " EAC (Prévision)",
        salud_defectos: " Taux de Défauts",
        salud_velocidad: " Vélocité de l'Équipe",
        salud_satisfaccion: " Satisfaction des Parties Prenantes",
        salud_huella: " Empreinte Carbone",
        salud_pmbok: " Santé Générale (PMBOK 8)",
        salud_beneficio_proyectado: " Bénéfice Projeté",
        salud_indicadores: " INDICATEURS CLÉS (KPI)",
        salud_indicador: "Indicateur",
        salud_valor: "Valeur",
        salud_estado: "État",
        salud_meta: "Objectif",
        salud_metricas_agiles: " Métriques Agile - Sprint Burndown",
        salud_puntos_sprint: " Points par sprint",
        salud_sprints_totales: " Sprints totaux",
        salud_sprint_actual: " Sprint actuel",
        
        // ========== DASHBOARD ==========
        dashboard_titulo: " Tableau de Bord",
        dashboard_indicador: "Indicateur",
        dashboard_valor: "Valeur",
        
        // ========== DIAGRAMME DE GANTT ==========
        gantt_titulo: " Calendrier du Projet - Diagramme de Gantt",
        gantt_sincronizar: " Synchroniser",
        gantt_nuevo: " Nouveau",
        gantt_exportar: " Exporter",
        gantt_sincronizar_fechas: " Synchroniser les dates",
        gantt_analisis_desviaciones: " Analyse des Déviation",
        gantt_calcular_costes: " Calculer les coûts réels",
        gantt_filtrar: " Filtrer par type :",
        gantt_todos: " Tous",
        gantt_edt: " WBS",
        gantt_actividad: " Activités",
        gantt_hito: " Jalons",
        gantt_entregable: " Livrables",
        gantt_escala: " Échelle :",
        gantt_buscar: " Rechercher :",
        gantt_elementos: " Éléments du Calendrier",
        gantt_ordenar_fecha: " Par date",
        gantt_ordenar_tipo: " Par type",
        gantt_edicion_multiple: " Édition multiple",
        gantt_reordenar: " Réordonner les Codes",
        gantt_tipo: "Type",
        gantt_nombre: "Nom",
        gantt_inicio: "Début",
        gantt_duracion: "Durée",
        gantt_fin_plan: "Fin Planifiée",
        gantt_desviacion: "Déviation",
        gantt_progreso: "Progrès",
        gantt_fechas_reales: "Dates Réelles",
        gantt_responsable: "Responsable",
        gantt_depende_de: "Dépend de",
        gantt_coste: " Coût",
        gantt_recurso: " Ressource",
        gantt_acciones: "Actions",
        gantt_version: " Version",
        gantt_zoom_in: " Zoom +",
        gantt_zoom_out: " Zoom -",
        gantt_colapsar: " Réduire",
        gantt_expandir: " Développer",
        
        // ========== RISQUES ==========
        riesgos_titulo: " Gestion des Risques du Projet",
        riesgos_analizar: " Analyser les Risques",
        riesgos_nuevo: " Nouveau Risque",
        riesgos_exportar: " Exporter",
        riesgos_criticos: " Risques Critiques",
        riesgos_altos: " Risques Élevés",
        riesgos_medios: " Risques Moyens",
        riesgos_bajos: " Risques Faibles",
        riesgos_matriz: " Matrice Probabilité vs Impact",
        riesgos_mostrar_matriz: "Afficher la Matrice",
        riesgos_ocultar_matriz: "Cacher",
        riesgos_lista: " Liste des Risques Identifiés",
        riesgos_ordenar_prob: " Par Probabilité",
        riesgos_ordenar_impacto: " Par Impact",
        riesgos_ordenar_score: " Par Score",
        riesgos_id: "ID",
        riesgos_nombre: "Risque",
        riesgos_categoria: "Catégorie",
        riesgos_probabilidad: "Probabilité",
        riesgos_impacto: "Impact",
        riesgos_score: "Score",
        riesgos_nivel: "Niveau",
        riesgos_respuesta: "Réponse",
        riesgos_estado: "État",
        riesgos_plan_accion: "Plan d'Action",
        riesgos_analisis_cuantitativo: " Analyse Quantitative des Risques",
        riesgos_calcular_valor: "Calculer la Valeur Espérée",
        riesgos_valor_proyecto: "Valeur du Projet (en devise de base)",
        riesgos_reserva_contingencia: "Réserve de Contingence Estimée",
        riesgos_acciones_titulo: " Registre des Actions d'Atténuation",
        riesgos_nueva_accion: " Nouvelle Action",
        riesgos_asociado: "Risque associé",
        riesgos_fecha: "Date",
        riesgos_accion_tomada: "Action entreprise",
        
        // ========== PARTIES PRENANTES ==========
        stakeholders_titulo: " Parties Prenantes",
        stakeholders_nuevo: " Ajouter",
        stakeholders_nombre: "Nom",
        stakeholders_rol: "Rôle",
        stakeholders_poder: "Pouvoir",
        stakeholders_interes: "Intérêt",
        stakeholders_expectativas: "Attentes",
        
        // ========== MATRICE RACI ==========
        raci_titulo: " Matrice RACI",
        raci_generar_informe: " Générer Rapport RACI",
        raci_actividad: "Activité",
        raci_info: "R=Responsable, A=Accountable, C=Consulté, I=Informé",
        
        // ========== PROCESSUS PMBOK ==========
        procesos_titulo: " Processus PMBOK",
        procesos_resetear: " Réinitialiser",
        
        // ========== COMMUNICATIONS ==========
        comunicaciones_titulo: " Communications & Gestion des Réunions",
        comunicaciones_nueva: " Nouvelle Communication",
        comunicaciones_nueva_reunion: " Nouvelle Réunion",
        comunicaciones_lista: " Communications",
        comunicaciones_minutas: " Comptes Rendus",
        comunicaciones_fecha: "Date",
        comunicaciones_tipo: "Type",
        comunicaciones_con: "Avec",
        comunicaciones_asunto: "Sujet",
        comunicaciones_contenido: "Contenu",
        comunicaciones_adjuntos: "Pièces Jointes",
        
        // ========== MONNAIES ==========
        monedas_titulo: " Devises et Taux de Change",
        monedas_actualizar: " Mettre à jour",
        monedas_guardar: " Enregistrer",
        monedas_base: "Devise de Base",
        monedas_precio: "Prix de Vente",
        monedas_venta: "Devise de Vente",
        monedas_condiciones: "Conditions de Paiement",
        monedas_hitos: " Jalons Financiers",
        monedas_anadir_hito: " Ajouter Jalon",
        monedas_evolucion: " Évolution du Taux de Change",
        monedas_comparer: " Devise à comparer",
        monedas_periode: " Période",
        
        // ========== VENTE ==========
        venta_titulo: " Vente",
        venta_precio: "Prix de Vente",
        venta_monnaie: "Devise",
        venta_conditions: "Conditions",
        venta_ajouter: " Ajouter",
        
        // ========== FLUX DE TRÉSORERIE ==========
        cashflow_titulo: " Flux de Trésorerie",
        cashflow_mois: "Mois",
        cashflow_revenus: "Revenus",
        cashflow_depenses: "Dépenses",
        cashflow_net: "Net",
        cashflow_cumule: "Cumulé",
        cashflow_total: "TOTAL",
        
        // ========== RÉSUMÉ DES DÉPENSES ==========
        resumen_titulo: " Résumé des Dépenses - Distribution par Catégorie",
        resumen_actualiser: " Mettre à jour",
        resumen_exporter: " Exporter",
        resumen_total: "Total des Dépenses",
        resumen_personnel: "Personnel",
        resumen_materiaux: "Matériaux",
        resumen_services: "Services",
        resumen_voyages: "Voyages",
        resumen_logistique: "Logistique",
        resumen_financier: "Financier",
        resumen_pourcentage: "% vs Budget",
        resumen_desglose: " Détail des Dépenses",
        resumen_categorie: "Catégorie",
        resumen_souscategorie: "Sous-catégorie",
        resumen_concept: "Concept",
        resumen_mois: "Mois",
        resumen_montant: "Montant",
        resumen_pourcentage_total: "% du Total",
        resumen_total_general: "TOTAL GÉNÉRAL",
        resumen_analyse: " Analyse des Dépenses",
        
        // ========== GARANTIE ==========
        garantie_titre: " Gestion de la Garantie",
        garantie_configurer: " Configurer la Garantie",
        garantie_exporter: " Exporter",
        garantie_statut: "Statut",
        garantie_non_config: "Non configurée",
        garantie_duree: "Durée",
        garantie_debut: "Début",
        garantie_fin: "Fin",
        garantie_non_config_texte: "Aucune garantie configurée. Cliquez sur \"Configurer la Garantie\" pour commencer.",
        garantie_liaison_jalons: " Relation avec les Jalons de Paiement",
        garantie_info_config: "Configurez la garantie pour voir comment elle affecte les jalons de paiement.",
        garantie_equipement: "Équipement / Produit sous garantie *",
        garantie_equipement_placeholder: "Ex: Serveur Dell PowerEdge, Système ERP, etc.",
        garantie_duree_ans: "Durée de la garantie (années)",
        garantie_date_debut: "Date de début",
        garantie_couverture: "Couverture incluse",
        garantie_couverture_placeholder: "Ex: Réparation matérielle, support technique, pièces de rechange...",
        garantie_exclusions: "Exclusions / Limitations",
        garantie_exclusions_placeholder: "Ex: Dommages dus à une mauvaise utilisation, usure normale...",
        garantie_jalon_final: " Le dernier jalon est payé à la fin de la garantie",
        garantie_jalon_info: "Cochez cette option si le client ne paie pas le dernier jalon avant la fin de la période de garantie.",
        garantie_jalon_select: "Sélectionner le jalon final",
        garantie_jalon_placeholder: "-- Sélectionner un jalon --",
        garantie_jalon_aide: "Ce jalon sera déplacé à la fin de la période de garantie.",
        garantie_info_texte: " Si vous activez cette option, le jalon sélectionné sera payé à la fin de la garantie, pas à la date originale.",
        garantie_sauvegarder: " Enregistrer la Garantie",
        
        // ========== MODULE FINANCIER ==========
        financier_titre: " Analyse Financière Avancée",
        financier_mettre_a_jour: " Tout mettre à jour",
        financier_recalculer: " Recalculer",
        financier_cout_materiaux: "Coût Total des Matériaux",
        financier_droits: "Total des Droits de Douane",
        financier_taxes: "Frais de Douane",
        financier_importation: "Coût Total d'Importation",
        
        // ========== ÉQUIPE ==========
        equipe_titre: " Équipe",
        equipe_ajouter: " Ajouter",
        equipe_nom: "Nom",
        equipe_role: "Rôle",
        equipe_email: "Email",
        equipe_cout_h: "Coût/h",
        equipe_devise: "Devise",
        equipe_heures_mois: "Heures/mois",
        equipe_actions: "Actions",
        
        // ========== MATÉRIAUX ==========
        materiaux_titre: " Matériaux",
        materiaux_ajouter: " Ajouter",
        materiaux_actualiser: " Mettre à jour",
        materiaux_nom: "Nom",
        materiaux_fournisseur: "Fournisseur",
        materiaux_reference: "Référence",
        materiaux_quantite: "Quantité",
        materiaux_cout: "Coût",
        materiaux_devise: "Devise",
        materiaux_pays: "Pays d'Origine",
        materiaux_periode: "Période",
        materiaux_delai: "Délai",
        materiaux_incoterm: "INCOTERM",
        materiaux_expedition: "Expédition",
        materiaux_droit: "Droit de Douane",
        materiaux_paiement: "Paiement",
        materiaux_actions: "Actions",
        
        // ========== SERVICES ==========
        services_titre: " Services",
        services_ajouter: " Ajouter",
        services_nom: "Nom",
        services_fournisseur: "Prestataire",
        services_quantite: "Quantité",
        services_cout: "Coût",
        services_devise: "Devise",
        services_taxe: "Taxe",
        services_total: "Total",
        services_mois: "Mois",
        services_actions: "Actions",
        
        // ========== VOYAGES ==========
        voyages_titre: " Gestion des Voyages",
        voyages_nouveau: " Nouveau Voyage",
        voyages_exporter: " Exporter",
        voyages_vols: "Vols",
        voyages_hotels: "Hôtels",
        voyages_repas: "Repas",
        voyages_transferts: "Transferts",
        voyages_total: "Total Voyages",
        voyages_registre: " Registre des Voyages",
        
        // ========== LOGISTIQUE ==========
        logistique_titre: " Logistique - Simulateur 3D de Cubage",
        logistique_sauvegarder: " Enregistrer",
        logistique_charger: " Charger",
        logistique_csv: " CSV",
        logistique_pdf: " PDF",
        logistique_cargaisons: "Chargements",
        logistique_volume: "Volume Total",
        logistique_poids: "Poids / Max",
        logistique_cout: "Coût Logistique",
        logistique_nouveau_colis: " Nouveau Colis / Palette",
        logistique_assigner_materiau: " Assigner un Matériau au Colis",
        
        // ========== GARANTIES BANCAIRES ==========
        garanties_bancaires_titre: " Garanties Bancaires",
        garanties_bancaires_ajouter: " Ajouter une Garantie",
        
        // ========== BÉNÉFICES ==========
        benefices_titre: " Suivi des Bénéfices",
        benefices_enregistrer: " Enregistrer le Bénéfice Réel",
        benefices_exporter: " Exporter",
        benefices_projete: "Bénéfice Projeté",
        benefices_reel: "Bénéfice Réel",
        benefices_deviation: "Déviation",
        benefices_statut: "Statut",
        benefices_jalons: " Jalons de Bénéfice",
        benefices_ajouter_jalon: " Ajouter un Jalon",
        benefices_indicateurs: " Indicateurs de Succès",
        benefices_indicateur: "Indicateur",
        benefices_objectif: "Objectif",
        benefices_reel_label: "Réel",
        benefices_conformite: "Conformité",
        
        // ========== DEMANDES DE MODIFICATION ==========
        demandes_titre: " Gestion des Demandes de Modification (PMBOK 8)",
        demandes_nouvelle: " Nouvelle Demande",
        demandes_en_attente: "En Attente",
        demandes_approuvees: "Approuvées",
        demandes_rejetees: "Rejetées",
        demandes_implementees: "Implémentées",
        demandes_id: "ID",
        demandes_date: "Date",
        demandes_demandeur: "Demandeur",
        demandes_description: "Description",
        demandes_impact: "Impact",
        demandes_priorite: "Priorité",
        demandes_statut: "Statut",
        demandes_approuve_par: "Approuvé par",
        demandes_actions: "Actions",
        
        // ========== LEÇONS APPRISES ==========
        lecons_titre: " Leçons Apprises (PMBOK 8)",
        lecons_nouvelle: " Nouvelle Leçon",
        lecons_succes: " Succès",
        lecons_amelioration: " Axes d'Amélioration",
        lecons_recommandations: " Recommandations",
        
        // ========== SPRINT BACKLOG ==========
        sprintBacklog_titre: " Sprint Backlog - Gestion des Histoires Utilisateur",
        sprintBacklog_nouvelle_histoire: " Nouvelle Histoire",
        sprintBacklog_demarrer: " Démarrer le Sprint",
        sprintBacklog_terminer: " Terminer le Sprint",
        sprintBacklog_actuel: "Sprint Actuel : Non démarré",
        sprintBacklog_info: "Démarrez un sprint pour commencer à travailler",
        sprintBacklog_points_plan: " Points Planifiés :",
        sprintBacklog_points_term: " Points Terminés :",
        sprintBacklog_progres: " Progrès :",
        sprintBacklog_backlog: " Backlog Produit",
        sprintBacklog_priorite: " Par Priorité",
        sprintBacklog_points: " Par Points",
        sprintBacklog_exporter: " Exporter",
        
        // ========== SPRINT BURNDOWN ==========
        sprintBurndown_titre: " Graphique Sprint Burndown",
        sprintBurndown_actualiser: " Mettre à jour",
        sprintBurndown_exporter: " Exporter",
        sprintBurndown_registre: " Registre Quotidien du Sprint",
        sprintBurndown_jour: "Jour",
        sprintBurndown_points_rest: "Points Restants",
        sprintBurndown_points_auj: "Points Terminés Aujourd'hui",
        sprintBurndown_actions: "Actions",
        sprintBurndown_enregistrer: " Enregistrer l'Avancement Quotidien",
        
        // ========== SUIVI DE VÉLOCITÉ ==========
        velocityTracking_titre: " Suivi de Vélocité - Vitesse de l'Équipe",
        velocityTracking_calculer: " Calculer la Vélocité",
        velocityTracking_exporter: " Exporter",
        velocityTracking_moyenne: "Vélocité Moyenne",
        velocityTracking_points_sprint: "points/sprint",
        velocityTracking_meilleur: "Meilleur Sprint",
        velocityTracking_pire: "Pire Sprint",
        velocityTracking_prediction: "Prédiction Prochaine",
        velocityTracking_points_est: "points estimés",
        velocityTracking_historique: " Historique des Sprints Terminés",
        velocityTracking_sprint: "Sprint",
        velocityTracking_date_debut: "Date de Début",
        velocityTracking_date_fin: "Date de Fin",
        velocityTracking_points_plan: "Points Planifiés",
        velocityTracking_points_term: "Points Terminés",
        velocityTracking_velocite: "Vélocité",
        velocityTracking_efficacite: "Efficacité",
        
        // ========== RÉTROSPECTIVES ==========
        retrospectives_titre: " Rétrospectives de Sprint",
        retrospectives_nouvelle: " Nouvelle Rétrospective",
        retrospectives_bien: " Ce qui s'est bien passé",
        retrospectives_ameliorer: " Ce qui peut être amélioré",
        retrospectives_actions: " Actions Engagées",
        retrospectives_termine: " Actions Terminées",
        
        // ========== MÉTRIQUES AGILE ==========
        agileMetrics_titre: " Métriques Agile - Tableau de Bord",
        agileMetrics_actualiser: " Mettre à jour",
        agileMetrics_exporter: " Exporter",
        agileMetrics_lead_time: "Lead Time",
        agileMetrics_jours_moy: "jours moyen",
        agileMetrics_cycle_time: "Cycle Time",
        agileMetrics_jours_hist: "jours/histoire",
        agileMetrics_throughput: "Throughput",
        agileMetrics_hist_sprint: "histoires/sprint",
        agileMetrics_predictibilite: "Prédictibilité",
        agileMetrics_conformite: "conformité à l'objectif",
        agileMetrics_detail: " Métriques Détaillées par Sprint",
        agileMetrics_sprint: "Sprint",
        agileMetrics_histoires: "Histoires",
        agileMetrics_points: "Points",
        agileMetrics_lead: "Lead Time",
        agileMetrics_cycle: "Cycle Time",
        agileMetrics_throughput_label: "Throughput",
        agileMetrics_predict: "Prédictibilité",
        
        // ========== LISTE DES SPRINTS ==========
        sprintList_titre: " Gestion des Sprints",
        sprintList_actualiser: " Actualiser",
        sprintList_exporter: " Exporter",
        sprintList_total: "Total des Sprints",
        sprintList_actifs: "Actifs",
        sprintList_termines: "Terminés",
        sprintList_velocite_moy: "Vélocité Moyenne",
        sprintList_id: "ID",
        sprintList_nom: "Nom",
        sprintList_date_debut: "Date de Début",
        sprintList_date_fin: "Date de Fin",
        sprintList_statut: "Statut",
        sprintList_points_plan: "Points Planifiés",
        sprintList_points_term: "Points Terminés",
        sprintList_velocite: "Vélocité",
        sprintList_efficacite: "Efficacité",
        sprintList_actions: "Actions",
        
        // ========== CONTRÔLE DES COÛTS AGILE ==========
        agileCostControl_titre: " Contrôle des Coûts - Gestion Agile (PMBOK 8)",
        agileCostControl_actualiser: " Mettre à jour",
        agileCostControl_exporter: " Exporter",
        agileCostControl_cout_total: "Coût Total du Projet",
        agileCostControl_cout_moyen: "Coût Moyen par Sprint",
        agileCostControl_cout_point: "Coût par Point",
        agileCostControl_burn_rate: "Burn Rate",
        agileCostControl_detail: " Détail des Coûts par Sprint",
        agileCostControl_sprint: "Sprint",
        agileCostControl_points: "Points",
        agileCostControl_cout_plan: "Coût Planifié",
        agileCostControl_cout_reel: "Coût Réel",
        agileCostControl_deviation: "Déviation",
        agileCostControl_cout_point_label: "Coût/Point",
        agileCostControl_statut: "Statut",
        agileCostControl_alertes: " Alertes de Déviation",
        agileCostControl_pmbok: " Indicateurs PMBOK 8",
        agileCostControl_cpi: "CPI (Coût Performance)",
        agileCostControl_spi: "SPI (Calendrier Performance)",
        agileCostControl_eac: "EAC (Estimation à l'Achèvement)",
        
        // ========== RÔLES ==========
        roles_titre: " Rôles",
        
        // ========== CONFIRMATIONS ==========
        confirmar_eliminar: "Supprimer ?",
        confirmar_eliminar_material: "Supprimer le matériau ?",
        confirmar_eliminar_miembro: "Supprimer le membre ?",
        confirmar_eliminar_servicio: "Supprimer le service ?",
        confirmar_eliminar_minuta: "Supprimer le compte rendu ?",
        confirmar_eliminar_riesgo: "Supprimer le risque ?",
        confirmar_eliminar_accion: "Supprimer l'action ?",
        confirmar_eliminar_garantia: "Supprimer la configuration de garantie ?",
        confirmar_eliminar_viaje: "Supprimer ce voyage ?",
        confirmar_eliminar_aval: "Supprimer cette garantie ?",
        confirmar_eliminar_hito: "Supprimer ce jalon ?",
        confirmar_eliminar_cambio: "Supprimer cette demande de modification ?",
        confirmar_eliminar_leccion: "Supprimer cette leçon apprise ?",
        confirmar_eliminar_historia: "Supprimer cette histoire ?",
        confirmar_eliminar_retrospectiva: "Supprimer cette rétrospective ?",
        confirmar_eliminar_elemento: "Supprimer cet élément ?",
        confirmar_resetear_procesos: "Réinitialiser tous les processus ?",
        confirmar_cerrar_sesion: "Se déconnecter ?",
        confirmar_cerrar_sesion_seguro: "Êtes-vous sûr de vouloir vous déconnecter ?",
        confirmar_api_key: "Voulez-vous obtenir une clé API OpenAI pour des analyses plus précises ?",
        prompt_velocidad: "Entrez la vélocité de l'équipe (points par sprint) :",
        prompt_huella: "Entrez l'empreinte carbone (kg CO₂) :",
        prompt_defectos: "Entrez le nombre de défauts trouvés :",
        prompt_api_key: " Entrez votre clé API OpenAI (facultatif - laissez vide pour l'analyse locale) :\n\nObtenez-en une sur https://platform.openai.com/api-keys",
        prompt_beneficio_real: " Entrez le bénéfice réel obtenu à ce jour :",
        toast_guardado: " Enregistré",
        toast_eliminado: " Supprimé",
        toast_actualizado: " Mis à jour",
        toast_error: " Erreur",
        toast_nombre_obligatorio: " Le nom est obligatoire",
        toast_acta_guardada: " Charte sauvegardée et synchronisée avec la vente",
        toast_pm_actualizado: " Chef de projet mis à jour",
        toast_sponsor_actualizado: " Sponsor mis à jour",
        toast_cliente_actualizado: " Client mis à jour",
        toast_venta_actualizada: " Données de vente mises à jour",
        toast_stakeholder_actualizado: " Partie prenante mise à jour",
        toast_procesos_reseteados: " Processus réinitialisés",
        toast_elemento_creado: " Élément créé : ",
        toast_sin_desviaciones: " Aucune déviation enregistrée. Tout est sur la bonne voie !",
        toast_riesgo_actualizado: " Risque mis à jour",
        toast_accion_guardada: " Action enregistrée",
        toast_tipos_cambio_guardados: " Tous les taux de change enregistrés",
        toast_proyecto_importado: " Projet importé avec succès. Rechargement...",
        toast_hito_actualizado: " Jalon mis à jour",
        toast_hito_eliminado: " Jalon supprimé",
        toast_solicitud_actualizada: " Demande mise à jour",
        toast_solicitud_eliminada: " Demande supprimée",
        toast_leccion_actualizada: " Leçon mise à jour",
        toast_leccion_eliminada: " Leçon supprimée",
        toast_historia_actualizada: " Histoire mise à jour",
        toast_historia_eliminada: " Histoire supprimée",
        toast_retrospectiva_eliminada: " Rétrospective supprimée",
        toast_selecciona_elementos: " Sélectionnez des éléments",
        toast_no_hay_pdf: " Pas de PDF",
        toast_asunto_obligatorio: " Le sujet est obligatoire",
        toast_titulo_obligatorio: " Le titre est obligatoire",
        toast_fecha_inicio_obligatoria: " La date de début est obligatoire",
        toast_duracion_positiva: " La durée doit être un nombre positif",
        toast_hitos_duracion_cero: " Les jalons doivent avoir une durée de 0 jours. Ajustement automatique.",
        toast_no_proyecto: " Aucun projet chargé",
        toast_descripcion_obligatoria: " La description est obligatoire",
        toast_titulo_obligatorio_gen: " Le titre est obligatoire",
        toast_error_crear_elemento: " Erreur lors de la création de l'élément : ",
        toast_sprint_activo: " Un sprint est déjà actif. Terminez-le d'abord.",
        toast_sprint_no_activo: " Aucun sprint actif",
        
        idioma_titulo: " Changer de langue",
        idioma_es: "Espagnol",
        idioma_en: "Anglais",
        idioma_fr: "Français",
        idioma_de: "Allemand",
        idioma_cambiado: "Langue changée en"
    },
    
    de: {
        btn_actualizar: " Aktualisieren",
        btn_guardar: " Speichern",
        btn_exportar: " Exportieren",
        btn_editar: " Bearbeiten",
        btn_anadir: " Hinzufügen",
        btn_eliminar: " Löschen",
        btn_cancelar: "Abbrechen",
        btn_cerrar: "Schließen",
        btn_ver: " Ansehen",
        btn_copiar: " Kopieren",
        btn_importar: " Importieren",
        
        sidebar_acta: "Projektcharta",
        sidebar_dashboard: "Dashboard",
        sidebar_salud: "Projekt Gesundheit",
        sidebar_finanzas: "Finanzen",
        sidebar_monedas: " Währungen",
        sidebar_venta: " Verkauf & Meilensteine",
        sidebar_cashflow: " Cashflow",
        sidebar_resumen: " Ausgabenübersicht",
        sidebar_avales: " Garantien",
        sidebar_garantia: " Gewährleistung",
        sidebar_financiero: "Finanzmodul",
        sidebar_cronograma: "Gantt-Diagramm",
        sidebar_riesgos: "Risikomanagement",
        sidebar_stakeholders: "Stakeholder",
        sidebar_lista: " Liste & Matrix",
        sidebar_raci: " RACI-Matrix",
        sidebar_procesos: "PMBOK Prozesse",
        sidebar_recursos: "Ressourcen",
        sidebar_roles: " Rollen",
        sidebar_equipo: " Team",
        sidebar_materiales: " Materialien",
        sidebar_servicios: " Dienstleistungen",
        sidebar_logistica: " Logistik",
        sidebar_viajes: " Reisen",
        sidebar_comunicaciones: "Kommunikation",
        sidebar_volver: "Zurück zum Portfolio",
        sidebar_beneficios: "Nutzenverfolgung",
        sidebar_cambios: "Änderungsanträge",
        sidebar_lecciones: "Gelernte Lektionen",
        sidebar_scrum: "Scrum Agile",
        sidebar_sprintBacklog: "Sprint Backlog",
        sidebar_sprintBurndown: "Sprint Burndown",
        sidebar_velocityTracking: "Geschwindigkeitsverfolgung",
        sidebar_retrospectives: "Retrospektiven",
        sidebar_agileMetrics: "Agile Kennzahlen",
        sidebar_sprintList: "Sprint-Liste",
        sidebar_agileCostControl: "Agile Kostenkontrolle",
        
        card_coste: " Gesamtkosten",
        card_ingreso: " Gesamteinnahmen",
        card_beneficio: " Gewinn",
        card_financiacion: " Finanzierung",
        
        acta_titulo: " Projektcharta",
        acta_identificacion: "1. PROJEKTIDENTIFIKATION",
        acta_objetivos: "2. ZIELE",
        acta_alcance: "3. UMFANG",
        acta_partes: "4. PROJEKTBETEILIGTE",
        acta_presupuesto: "5. BUDGET & VERKAUF",
        acta_condiciones: "6. ZAHLUNGSBEDINGUNGEN",
        acta_avales: "7. GARANTIEN",
        acta_aprobaciones: "8. GENEHMIGUNGEN",
        acta_metodologia: "9. MANAGEMENT-METHODIK",
        acta_nombre: " Name",
        acta_codigo: " Code",
        acta_pais: " Land",
        acta_inicio: " Beginn",
        acta_fin: " Geplantes Ende",
        acta_moneda: " Währung",
        acta_objetivo_general: " Allgemeines Ziel",
        acta_criterios_exito: " Erfolgskriterien",
        acta_descripcion: " Beschreibung",
        acta_entregables_clave: " Wichtige Liefergegenstände",
        acta_pm: "Projektmanager",
        acta_sponsor: "Sponsor",
        acta_cliente: "Kunde",
        acta_presupuesto_valor: " Budget",
        acta_contrato: " Gesamtauftragssumme",
        acta_moneda_venta: " Verkaufswährung",
        acta_roi: " ROI",
        acta_condiciones_texto: " Bedingungen",
        acta_hitos_pago: " Zahlungsmeilensteine",
        acta_aprobado_por: " Genehmigt von",
        acta_fecha_aprobacion: " Datum",
        acta_metodologia_tipo: " Methodik",
        acta_metodologia_desc: " Beschreibung",
        acta_sin_hitos: "Keine Zahlungsmeilensteine definiert",
        acta_sin_avales: "Keine Garantien registriert",
        acta_pm_no_asignado: "Nicht zugewiesen",
        acta_sponsor_no_asignado: "Nicht zugewiesen",
        acta_cliente_no_asignado: "Nicht zugewiesen",
        
        idioma_titulo: " Sprache ändern",
        idioma_es: "Spanisch",
        idioma_en: "Englisch",
        idioma_fr: "Französisch",
        idioma_de: "Deutsch",
        idioma_cambiado: "Sprache geändert auf",

        // ========== SALUD DEL PROYECTO ==========
        salud_titulo: " Projekt Gesundheit - Dashboard",
        salud_general: " ALLGEMEINE PROJEKTGESUNDHEIT",
        salud_analizando: "Analysiere Daten...",
        salud_progreso: " Allgemeiner Fortschritt",
        salud_riesgos: " Risiken",
        salud_financiera: " Finanzielle Gesundheit",
        salud_desviacion: " Abweichung",
        salud_cpi: " CPI (Kosten)",
        salud_spi: " SPI (Zeitplan)",
        salud_roi: " Prognostizierter ROI",
        salud_eac: " EAC (Prognose)",
        salud_defectos: " Fehlerrate",
        salud_velocidad: " Team Geschwindigkeit",
        salud_satisfaccion: " Stakeholder Zufriedenheit",
        salud_huella: " CO2-Fußabdruck",
        salud_pmbok: " Allgemeine Gesundheit (PMBOK 8)",
        salud_beneficio_proyectado: " Prognostizierter Gewinn",
        salud_indicadores: " KEY PERFORMANCE INDIKATOREN (KPIs)",
        salud_indicador: "Indikator",
        salud_valor: "Wert",
        salud_estado: "Status",
        salud_meta: "Ziel",
        salud_metricas_agiles: " Agile Metriken - Sprint Burndown",
        salud_puntos_sprint: " Punkte pro Sprint",
        salud_sprints_totales: " Sprints insgesamt",
        salud_sprint_actual: " Aktueller Sprint",

        // ========== DASHBOARD ==========
        dashboard_titulo: " Dashboard",
        dashboard_indicador: "Indikator",
        dashboard_valor: "Wert",

        // ========== CRONOGRAMA GANTT ==========
        gantt_titulo: " Projekt Zeitplan - Gantt-Diagramm",
        gantt_sincronizar: " Synchronisieren",
        gantt_nuevo: " Neu",
        gantt_exportar: " Exportieren",
        gantt_sincronizar_fechas: " Daten synchronisieren",
        gantt_analisis_desviaciones: " Abweichungsanalyse",
        gantt_calcular_costes: " Ist-Kosten berechnen",
        gantt_filtrar: " Filtern nach Typ:",
        gantt_todos: " Alle",
        gantt_edt: " PSP",
        gantt_actividad: " Aktivitäten",
        gantt_hito: " Meilensteine",
        gantt_entregable: " Liefergegenstände",
        gantt_escala: " Skala:",
        gantt_buscar: " Suchen:",
        gantt_elementos: " Zeitplan Elemente",
        gantt_ordenar_fecha: " Nach Datum",
        gantt_ordenar_tipo: " Nach Typ",
        gantt_edicion_multiple: " Mehrfachbearbeitung",
        gantt_reordenar: " Codes neu ordnen",
        gantt_tipo: "Typ",
        gantt_nombre: "Name",
        gantt_inicio: "Start",
        gantt_duracion: "Dauer",
        gantt_fin_plan: "Geplantes Ende",
        gantt_desviacion: "Abweichung",
        gantt_progreso: "Fortschritt",
        gantt_fechas_reales: "Ist-Daten",
        gantt_responsable: "Verantwortlich",
        gantt_depende_de: "Abhängig von",
        gantt_coste: " Kosten",
        gantt_recurso: " Ressource",
        gantt_acciones: "Aktionen",
        gantt_version: " Version",
        gantt_zoom_in: " Zoom +",
        gantt_zoom_out: " Zoom -",
        gantt_colapsar: " Einklappen",
        gantt_expandir: " Ausklappen",

        // ========== RIESGOS ==========
        riesgos_titulo: " Projekt Risikomanagement",
        riesgos_analizar: " Risiken analysieren",
        riesgos_nuevo: " Neues Risiko",
        riesgos_exportar: " Exportieren",
        riesgos_criticos: " Kritische Risiken",
        riesgos_altos: " Hohe Risiken",
        riesgos_medios: " Mittlere Risiken",
        riesgos_bajos: " Niedrige Risiken",
        riesgos_matriz: " Wahrscheinlichkeits vs. Auswirkungsmatrix",
        riesgos_mostrar_matriz: "Matrix anzeigen",
        riesgos_ocultar_matriz: "Ausblenden",
        riesgos_lista: " Liste identifizierter Risiken",
        riesgos_ordenar_prob: " Nach Wahrscheinlichkeit",
        riesgos_ordenar_impacto: " Nach Auswirkung",
        riesgos_ordenar_score: " Nach Score",
        riesgos_id: "ID",
        riesgos_nombre: "Risiko",
        riesgos_categoria: "Kategorie",
        riesgos_probabilidad: "Wahrscheinlichkeit",
        riesgos_impacto: "Auswirkung",
        riesgos_score: "Score",
        riesgos_nivel: "Stufe",
        riesgos_respuesta: "Antwort",
        riesgos_estado: "Status",
        riesgos_plan_accion: "Aktionsplan",
        riesgos_analisis_cuantitativo: " Quantitative Risikoanalyse",
        riesgos_calcular_valor: "Erwarteten Wert berechnen",
        riesgos_valor_proyecto: "Projektwert (in Basiswährung)",
        riesgos_reserva_contingencia: "Geschätzte Rücklage",
        riesgos_acciones_titulo: " Maßnahmenprotokoll",
        riesgos_nueva_accion: " Neue Maßnahme",
        riesgos_asociado: "Zugehöriges Risiko",
        riesgos_fecha: "Datum",
        riesgos_accion_tomada: "Ergriffene Maßnahme",

        // ========== STAKEHOLDERS ==========
        stakeholders_titulo: " Stakeholder",
        stakeholders_nuevo: " Hinzufügen",
        stakeholders_nombre: "Name",
        stakeholders_rol: "Rolle",
        stakeholders_poder: "Macht",
        stakeholders_interes: "Interesse",
        stakeholders_expectativas: "Erwartungen",

        // ========== MATRIZ RACI ==========
        raci_titulo: " RACI-Matrix",
        raci_generar_informe: " RACI-Bericht erstellen",
        raci_actividad: "Aktivität",
        raci_info: "R=Verantwortlich, A=Rechenschaftspflichtig, C=Konsultiert, I=Informiert",

        // ========== PROCESOS PMBOK ==========
        procesos_titulo: " PMBOK Prozesse",
        procesos_resetear: " Zurücksetzen",

        // ========== COMUNICACIONES ==========
        comunicaciones_titulo: "Kommunikation & Besprechungsmanagement",
        comunicaciones_nueva: " Neue Kommunikation",
        comunicaciones_nueva_reunion: " Neue Besprechung",
        comunicaciones_lista: " Kommunikationen",
        comunicaciones_minutas: " Besprechungsprotokolle",
        comunicaciones_fecha: "Datum",
        comunicaciones_tipo: "Typ",
        comunicaciones_con: "Mit",
        comunicaciones_asunto: "Betreff",
        comunicaciones_contenido: "Inhalt",
        comunicaciones_adjuntos: "Anhänge",

        // ========== MONEDAS ==========
        monedas_titulo: " Währungen & Wechselkurse",
        monedas_actualizar: " Aktualisieren",
        monedas_guardar: " Speichern",
        monedas_base: "Basiswährung",
        monedas_precio: "Verkaufspreis",
        monedas_venta: "Verkaufswährung",
        monedas_condiciones: "Zahlungsbedingungen",
        monedas_hitos: " Finanzielle Meilensteine",
        monedas_anadir_hito: " Meilenstein hinzufügen",
        monedas_evolucion: " Wechselkurstrend",
        monedas_comparar: " Zu vergleichende Währung",
        monedas_periodo: " Zeitraum",

        // ========== VENTA ==========
        venta_titulo: " Verkauf",
        venta_precio: "Verkaufspreis",
        venta_moneda: "Währung",
        venta_condiciones: "Bedingungen",
        venta_anadir: " Hinzufügen",

        // ========== CASHFLOW ==========
        cashflow_titulo: " Cashflow",
        cashflow_mes: "Monat",
        cashflow_ingresos: "Einnahmen",
        cashflow_gastos: "Ausgaben",
        cashflow_neto: "Netto",
        cashflow_acumulado: "Kumuliert",
        cashflow_total: "GESAMT",

        // ========== RESUMEN GASTOS ==========
        resumen_titulo: " Ausgabenübersicht - Verteilung nach Kategorie",
        resumen_actualizar: " Aktualisieren",
        resumen_exportar: " Exportieren",
        resumen_total: "Gesamtausgaben",
        resumen_personal: "Personal",
        resumen_materiales: "Materialien",
        resumen_servicios: "Dienstleistungen",
        resumen_viajes: "Reisen",
        resumen_logistica: "Logistik",
        resumen_financieros: "Finanzen",
        resumen_porcentaje: "% vs Budget",
        resumen_desglose: " Detaillierte Ausgabenaufstellung",
        resumen_categoria: "Kategorie",
        resumen_subcategoria: "Unterkategorie",
        resumen_concepto: "Konzept",
        resumen_mes: "Monat",
        resumen_importe: "Betrag",
        resumen_porcentaje_total: "% der Gesamtsumme",
        resumen_total_general: "GESAMTSUMME",
        resumen_analisis: " Ausgabenanalyse",

        // ========== GARANTIA ==========
        garantia_titulo: " Garantieverwaltung",
        garantia_configurar: " Garantie konfigurieren",
        garantia_exportar: " Exportieren",
        garantia_estado: "Status",
        garantia_no_configurada: "Nicht konfiguriert",
        garantia_duracion: "Dauer",
        garantia_inicio: "Start",
        garantia_fin: "Ende",
        garantia_no_config_texto: "Keine Garantie konfiguriert. Klicken Sie auf \"Garantie konfigurieren\" um zu beginnen.",
        garantia_relacion_hitos: " Beziehung zu Zahlungsmeilensteinen",
        garantia_config_info: "Konfigurieren Sie die Garantie um zu sehen, wie sie Zahlungsmeilensteine beeinflusst.",
        garantia_equipo: "Gerät/Produkt unter Garantie *",
        garantia_equipo_placeholder: "Z.B. Dell PowerEdge Server, ERP-System, etc.",
        garantia_duracion_anios: "Garantiedauer (Jahre)",
        garantia_fecha_inicio: "Startdatum",
        garantia_cobertura: "Enthaltene Deckung",
        garantia_cobertura_placeholder: "Z.B. Hardware-Reparatur, technischer Support, Ersatzteile...",
        garantia_exclusiones: "Ausschlüsse / Einschränkungen",
        garantia_exclusiones_placeholder: "Z.B. Schäden durch Missbrauch, normalen Verschleiß...",
        garantia_hito_final: " Letzter Meilenstein wird am Ende der Garantie bezahlt",
        garantia_hito_info: "Aktivieren Sie diese Option, wenn der Kunde den letzten Meilenstein erst nach Ablauf der Garantiezeit bezahlt.",
        garantia_hito_select: "Wählen Sie den letzten Meilenstein",
        garantia_hito_placeholder: "-- Meilenstein auswählen --",
        garantia_hito_help: "Dieser Meilenstein wird an das Ende der Garantiezeit verschoben.",
        garantia_info: " Wenn Sie diese Option aktivieren, wird der ausgewählte Meilenstein am Ende der Garantie bezahlt, nicht zum ursprünglichen Datum.",
        garantia_guardar: " Garantie speichern",

        // ========== FINANCIERO ==========
        financiero_titulo: " Erweiterte Finanzanalyse",
        financiero_actualizar: " Alle aktualisieren",
        financiero_recalcular: " Neu berechnen",
        financiero_costemateriales: "Materialkosten gesamt",
        financiero_aranceles: "Zölle gesamt",
        financiero_tasas: "Zollgebühren",
        financiero_importacion: "Importkosten gesamt",

        // ========== EQUIPO ==========
        equipo_titulo: " Team",
        equipo_nuevo: " Hinzufügen",
        equipo_nombre: "Name",
        equipo_rol: "Rolle",
        equipo_email: "E-Mail",
        equipo_costeh: "Kosten/h",
        equipo_moneda: "Währung",
        equipo_horasmes: "Stunden/Monat",
        equipo_acciones: "Aktionen",

        // ========== MATERIALES ==========
        materiales_titulo: " Materialien",
        materiales_nuevo: " Hinzufügen",
        materiales_actualizar: " Aktualisieren",
        materiales_nombre: "Name",
        materiales_proveedor: "Lieferant",
        materiales_partnumber: "Artikelnummer",
        materiales_cantidad: "Menge",
        materiales_coste: "Kosten",
        materiales_moneda: "Währung",
        materiales_pais: "Ursprungsland",
        materiales_periodo: "Zeitraum",
        materiales_plazo: "Lieferzeit",
        materiales_incoterm: "INCOTERM",
        materiales_envio: "Versand",
        materiales_arancel: "Zoll",
        materiales_pago: "Zahlung",
        materiales_acciones: "Aktionen",

        // ========== SERVICIOS ==========
        servicios_titulo: " Dienstleistungen",
        servicios_nuevo: " Hinzufügen",
        servicios_nombre: "Name",
        servicios_proveedor: "Anbieter",
        servicios_cantidad: "Menge",
        servicios_coste: "Kosten",
        servicios_moneda: "Währung",
        servicios_impuesto: "Steuer",
        servicios_total: "Gesamt",
        servicios_mes: "Monat",
        servicios_acciones: "Aktionen",

        // ========== VIAJES ==========
        viajes_titulo: " Reiseverwaltung",
        viajes_nuevo: " Neue Reise",
        viajes_exportar: " Exportieren",
        viajes_vuelos: "Flüge",
        viajes_hoteles: "Hotels",
        viajes_comidas: "Verpflegung",
        viajes_traslados: "Transfers",
        viajes_total: "Reisen gesamt",
        viajes_registro: " Reiselogbuch",

        // ========== LOGISTICA ==========
        logistica_titulo: " Logistik - 3D Würfel-Simulator",
        logistica_guardar: " Speichern",
        logistica_cargar: " Laden",
        logistica_csv: " CSV",
        logistica_pdf: " PDF",
        logistica_cargas: "Fracht",
        logistica_volumen: "Gesamtvolumen",
        logistica_peso: "Gewicht / Max",
        logistica_costo: "Logistikkosten",
        logistica_bulto_nuevo: " Neues Paket / Palette",
        logistica_asignar_material: " Material dem Paket zuweisen",

        // ========== AVALES ==========
        avales_titulo: " Garantien & Bankbürgschaften",
        avales_nuevo: " Garantie hinzufügen",

        // ========== BENEFICIOS ==========
        beneficios_titulo: " Nutzenverfolgung",
        beneficios_registrar: " Echten Gewinn erfassen",
        beneficios_exportar: " Exportieren",
        beneficios_proyectado: "Prognostizierter Gewinn",
        beneficios_real: "Echter Gewinn",
        beneficios_desviacion: "Abweichung",
        beneficios_estado: "Status",
        beneficios_hitos: " Nutzen Meilensteine",
        beneficios_agregar_hito: " Meilenstein hinzufügen",
        beneficios_indicadores: " Erfolgsindikatoren",
        beneficios_indicador: "Indikator",
        beneficios_meta: "Ziel",
        beneficios_real_label: "Echt",
        beneficios_cumplimiento: "Erfüllung",

        // ========== CAMBIOS ==========
        cambios_titulo: " Änderungsmanagement (PMBOK 8)",
        cambios_nuevo: " Neuer Antrag",
        cambios_pendientes: "Ausstehend",
        cambios_aprobados: "Genehmigt",
        cambios_rechazados: "Abgelehnt",
        cambios_implementados: "Implementiert",
        cambios_id: "ID",
        cambios_fecha: "Datum",
        cambios_solicitante: "Antragsteller",
        cambios_descripcion: "Beschreibung",
        cambios_impacto: "Auswirkung",
        cambios_prioridad: "Priorität",
        cambios_estado: "Status",
        cambios_aprobado_por: "Genehmigt von",
        cambios_acciones: "Aktionen",

        // ========== LECCIONES ==========
        lecciones_titulo: " Erfahrungsberichte (PMBOK 8)",
        lecciones_nuevo: " Neue Lektion",
        lecciones_exitos: " Erfolge",
        lecciones_mejora: " Verbesserungsbereiche",
        lecciones_recomendaciones: " Empfehlungen",

        // ========== SPRINT BACKLOG ==========
        sprintBacklog_titulo: " Sprint Backlog - User Story Management",
        sprintBacklog_nueva_historia: " Neue Story",
        sprintBacklog_iniciar: " Sprint starten",
        sprintBacklog_finalizar: " Sprint beenden",
        sprintBacklog_actual: "Aktueller Sprint: Nicht gestartet",
        sprintBacklog_info: "Starten Sie einen Sprint um zu beginnen",
        sprintBacklog_puntos_plan: " Geplante Punkte:",
        sprintBacklog_puntos_comp: " Abgeschlossene Punkte:",
        sprintBacklog_progreso: " Fortschritt:",
        sprintBacklog_backlog: " Product Backlog",
        sprintBacklog_prioridad: " Nach Priorität",
        sprintBacklog_puntos: " Nach Punkten",
        sprintBacklog_exportar: " Exportieren",

        // ========== SPRINT BURNDOWN ==========
        sprintBurndown_titulo: " Sprint Burndown Diagramm",
        sprintBurndown_actualizar: " Aktualisieren",
        sprintBurndown_exportar: " Exportieren",
        sprintBurndown_registro: " Tägliches Sprint Log",
        sprintBurndown_dia: "Tag",
        sprintBurndown_puntos_rest: "Verbleibende Punkte",
        sprintBurndown_puntos_hoy: "Heute abgeschlossen",
        sprintBurndown_acciones: "Aktionen",
        sprintBurndown_registrar: " Täglichen Fortschritt erfassen",

        // ========== VELOCITY TRACKING ==========
        velocityTracking_titulo: " Geschwindigkeitsverfolgung - Team Geschwindigkeit",
        velocityTracking_calcular: " Geschwindigkeit berechnen",
        velocityTracking_exportar: " Exportieren",
        velocityTracking_promedio: "Durchschnittsgeschwindigkeit",
        velocityTracking_puntos_sprint: "Punkte/Sprint",
        velocityTracking_mejor: "Bester Sprint",
        velocityTracking_peor: "Schlechtester Sprint",
        velocityTracking_prediccion: "Nächste Vorhersage",
        velocityTracking_puntos_est: "geschätzte Punkte",
        velocityTracking_historial: " Verlauf abgeschlossener Sprints",
        velocityTracking_sprint: "Sprint",
        velocityTracking_fecha_inicio: "Startdatum",
        velocityTracking_fecha_fin: "Enddatum",
        velocityTracking_puntos_plan: "Geplante Punkte",
        velocityTracking_puntos_comp: "Abgeschlossene Punkte",
        velocityTracking_velocidad: "Geschwindigkeit",
        velocityTracking_eficiencia: "Effizienz",

        // ========== RETROSPECTIVES ==========
        retrospectives_titulo: " Sprint Retrospektiven",
        retrospectives_nuevo: " Neue Retrospektive",
        retrospectives_bien: " Was gut gelaufen ist",
        retrospectives_mejorar: " Was verbessert werden kann",
        retrospectives_acciones: " Vereinbarte Maßnahmen",
        retrospectives_completadas: " Abgeschlossene Maßnahmen",

        // ========== AGILE METRICS ==========
        agileMetrics_titulo: " Agile Metriken - Dashboard",
        agileMetrics_actualizar: " Aktualisieren",
        agileMetrics_exportar: " Exportieren",
        agileMetrics_lead_time: "Lead Time",
        agileMetrics_dias_prom: "Ø Tage",
        agileMetrics_cycle_time: "Cycle Time",
        agileMetrics_dias_hist: "Tage/Story",
        agileMetrics_throughput: "Durchsatz",
        agileMetrics_hist_sprint: "Stories/Sprint",
        agileMetrics_predictibilidad: "Vorhersagbarkeit",
        agileMetrics_cumplimiento: "Zielerreichung",
        agileMetrics_detalle: " Detaillierte Metriken nach Sprint",
        agileMetrics_sprint: "Sprint",
        agileMetrics_historias: "Stories",
        agileMetrics_puntos: "Punkte",
        agileMetrics_lead: "Lead Time",
        agileMetrics_cycle: "Cycle Time",
        agileMetrics_throughput_label: "Durchsatz",
        agileMetrics_predict: "Vorhersagbarkeit",

        // ========== SPRINT LIST ==========
        sprintList_titulo: " Sprint Verwaltung",
        sprintList_refrescar: " Aktualisieren",
        sprintList_exportar: " Exportieren",
        sprintList_total: "Sprints gesamt",
        sprintList_activos: "Aktiv",
        sprintList_completados: "Abgeschlossen",
        sprintList_velocidad_media: "Durchschnittsgeschwindigkeit",
        sprintList_id: "ID",
        sprintList_nombre: "Name",
        sprintList_fecha_inicio: "Startdatum",
        sprintList_fecha_fin: "Enddatum",
        sprintList_estado: "Status",
        sprintList_puntos_plan: "Geplante Punkte",
        sprintList_puntos_comp: "Abgeschlossene Punkte",
        sprintList_velocidad: "Geschwindigkeit",
        sprintList_eficiencia: "Effizienz",
        sprintList_acciones: "Aktionen",

        // ========== AGILE COST CONTROL ==========
        agileCostControl_titulo: " Kostenkontrolle - Agiles Management (PMBOK 8)",
        agileCostControl_actualizar: " Aktualisieren",
        agileCostControl_exportar: " Exportieren",
        agileCostControl_coste_total: "Gesamtprojektkosten",
        agileCostControl_coste_medio: "Durchschnittskosten pro Sprint",
        agileCostControl_coste_punto: "Kosten pro Punkt",
        agileCostControl_burn_rate: "Burn Rate",
        agileCostControl_desglose: " Kostenaufschlüsselung nach Sprint",
        agileCostControl_sprint: "Sprint",
        agileCostControl_puntos: "Punkte",
        agileCostControl_coste_plan: "Geplante Kosten",
        agileCostControl_coste_real: "Echte Kosten",
        agileCostControl_desviacion: "Abweichung",
        agileCostControl_coste_punto_label: "Kosten/Punkt",
        agileCostControl_estado: "Status",
        agileCostControl_alertas: " Abweichungswarnungen",
        agileCostControl_pmbok: " PMBOK 8 Indikatoren",
        agileCostControl_cpi: "CPI (Kostenleistung)",
        agileCostControl_spi: "SPI (Zeitplanleistung)",
        agileCostControl_eac: "EAC (Schätzung bei Abschluss)",

        // ========== ROLES ==========
        roles_titulo: " Rollen",

        // ========== BESTÄTIGUNGEN ==========
        confirmar_eliminar: "Löschen?",
        confirmar_eliminar_material: "Material löschen?",
        confirmar_eliminar_miembro: "Mitglied löschen?",
        confirmar_eliminar_servicio: "Dienstleistung löschen?",
        confirmar_eliminar_minuta: "Protokoll löschen?",
        confirmar_eliminar_riesgo: "Risiko löschen?",
        confirmar_eliminar_accion: "Maßnahme löschen?",
        confirmar_eliminar_garantia: "Garantiekonfiguration löschen?",
        confirmar_eliminar_viaje: "Diese Reise löschen?",
        confirmar_eliminar_aval: "Diese Garantie löschen?",
        confirmar_eliminar_hito: "Diesen Meilenstein löschen?",
        confirmar_eliminar_cambio: "Diese Änderungsanfrage löschen?",
        confirmar_eliminar_leccion: "Diese Erfahrung löschen?",
        confirmar_eliminar_historia: "Diese Story löschen?",
        confirmar_eliminar_retrospectiva: "Diese Retrospektive löschen?",
        confirmar_eliminar_elemento: "Dieses Element löschen?",
        confirmar_resetear_procesos: "Alle Prozesse zurücksetzen?",
        confirmar_cerrar_sesion: "Abmelden?",
        confirmar_cerrar_sesion_seguro: "Sind Sie sicher, dass Sie sich abmelden möchten?",
        confirmar_api_key: "Möchten Sie einen OpenAI API-Schlüssel für genauere Analysen erhalten?",
        prompt_velocidad: "Geben Sie die Teamgeschwindigkeit ein (Punkte pro Sprint):",
        prompt_huella: "Geben Sie den CO2-Fußabdruck ein (kg CO₂):",
        prompt_defectos: "Geben Sie die Anzahl der gefundenen Fehler ein:",
        prompt_api_key: " Geben Sie Ihren OpenAI API-Schlüssel ein (optional - leer lassen für lokale Analyse):\n\nHolen Sie sich einen unter https://platform.openai.com/api-keys",
        prompt_beneficio_real: " Geben Sie den bisher erzielten tatsächlichen Gewinn ein:",
        toast_guardado: " Gespeichert",
        toast_eliminado: " Gelöscht",
        toast_actualizado: " Aktualisiert",
        toast_error: " Fehler",
        toast_nombre_obligatorio: " Name ist erforderlich",
        toast_acta_guardada: " Projektcharta gespeichert und mit Verkauf synchronisiert",
        toast_pm_actualizado: " Projektmanager aktualisiert",
        toast_sponsor_actualizado: " Sponsor aktualisiert",
        toast_cliente_actualizado: " Kunde aktualisiert",
        toast_venta_actualizada: " Verkaufsdaten aktualisiert",
        toast_stakeholder_actualizado: " Stakeholder aktualisiert",
        toast_procesos_reseteados: " Prozesse zurückgesetzt",
        toast_elemento_creado: " Element erstellt: ",
        toast_sin_desviaciones: " Keine Abweichungen aufgezeichnet. Alles läuft nach Plan!",
        toast_riesgo_actualizado: " Risiko aktualisiert",
        toast_accion_guardada: " Maßnahme gespeichert",
        toast_tipos_cambio_guardados: " Alle Wechselkurse gespeichert",
        toast_proyecto_importado: " Projekt erfolgreich importiert. Neu laden...",
        toast_hito_actualizado: " Meilenstein aktualisiert",
        toast_hito_eliminado: " Meilenstein gelöscht",
        toast_solicitud_actualizada: " Antrag aktualisiert",
        toast_solicitud_eliminada: " Antrag gelöscht",
        toast_leccion_actualizada: " Erfahrung aktualisiert",
        toast_leccion_eliminada: " Erfahrung gelöscht",
        toast_historia_actualizada: " Story aktualisiert",
        toast_historia_eliminada: " Story gelöscht",
        toast_retrospectiva_eliminada: " Retrospektive gelöscht",
        toast_selecciona_elementos: " Elemente auswählen",
        toast_no_hay_pdf: " Kein PDF",
        toast_asunto_obligatorio: " Betreff ist erforderlich",
        toast_titulo_obligatorio: " Titel ist erforderlich",
        toast_fecha_inicio_obligatoria: " Startdatum ist erforderlich",
        toast_duracion_positiva: " Die Dauer muss eine positive Zahl sein",
        toast_hitos_duracion_cero: " Meilensteine müssen eine Dauer von 0 Tagen haben. Wird automatisch angepasst.",
        toast_no_proyecto: " Kein Projekt geladen",
        toast_descripcion_obligatoria: " Beschreibung ist erforderlich",
        toast_titulo_obligatorio_gen: " Titel ist erforderlich",
        toast_error_crear_elemento: " Fehler beim Erstellen des Elements: ",
        toast_sprint_activo: " Es ist bereits ein aktiver Sprint vorhanden. Beenden Sie ihn zuerst.",
        toast_sprint_no_activo: " Kein aktiver Sprint"
    }
};


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
    if (typeof renderizarTablaGantt === 'function') {
        renderizarTablaGantt();
    }
    if (typeof renderizarGanttUnificado === 'function') {
        renderizarGanttUnificado();
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
    return textosApp[idiomaApp][key] || textosApp.es[key] || key;
}
        function cambiarIdiomaApp(idioma) {
    idiomaApp = idioma;
    localStorage.setItem('pmi_idioma', idioma);
    aplicarIdiomaUI(idioma);
    const nombreIdioma = { es: 'Español', en: 'English', fr: 'Français', de: 'Deutsch' }[idioma];
    mostrarToast(` ${tApp('idioma_cambiado')} ${nombreIdioma}`, 'success');
}

// Asegurar que tApp() devuelva correctamente los textos
function tApp(key) {
    if (textosApp[idiomaApp] && textosApp[idiomaApp][key]) {
        return textosApp[idiomaApp][key];
    }
    if (textosApp.es && textosApp.es[key]) {
        return textosApp.es[key];
    }
    return key;
}

// Función auxiliar para mostrar menú de idioma
function mostrarMenuIdiomaApp() {
    const modalHtml = `
        <div class="modal-content modal-300">
            <div class="modal-header">
                <h3>${tApp('idioma_titulo')}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button class="btn btn-secondary" onclick="cambiarIdiomaApp('es'); cerrarModalGeneric()"> ${tApp('idioma_es')}</button>
                <button class="btn btn-secondary" onclick="cambiarIdiomaApp('en'); cerrarModalGeneric()"> ${tApp('idioma_en')}</button>
                <button class="btn btn-secondary" onclick="cambiarIdiomaApp('fr'); cerrarModalGeneric()"> ${tApp('idioma_fr')}</button>
                <button class="btn btn-secondary" onclick="cambiarIdiomaApp('de'); cerrarModalGeneric()"> ${tApp('idioma_de')}</button>
            </div>
        </div>
    `;
    
    let modalDiv = document.getElementById('genericModal');
    if (modalDiv) modalDiv.remove();
    
    modalDiv = document.createElement('div');
    modalDiv.id = 'genericModal';
    modalDiv.className = 'modal';
    modalDiv.style.display = 'flex';
    modalDiv.innerHTML = modalHtml;
    document.body.appendChild(modalDiv);
    
    modalDiv.onclick = (e) => {
        if (e.target === modalDiv) cerrarModalGeneric();
    };
}

// Función para cerrar modales genéricos
function cerrarModalGeneric() {
    const genericModal = document.getElementById('genericModal');
    if (genericModal) genericModal.remove();
    
    const garantiaModal = document.getElementById('modalGarantia');
    if (garantiaModal) garantiaModal.style.display = 'none';
    
    const satisfaccionModal = document.getElementById('modalSatisfaccion');
    if (satisfaccionModal) satisfaccionModal.style.display = 'none';
    
    const viajeModal = document.getElementById('modalViaje');
    if (viajeModal) viajeModal.style.display = 'none';
    
    const embalajeModal = document.getElementById('modalEmbalaje');
    if (embalajeModal) embalajeModal.style.display = 'none';
    
    const iaModal = document.getElementById('modalIA');
    if (iaModal) iaModal.style.display = 'none';
    
    const openModals = document.querySelectorAll('.modal[style*="display: flex"]');
    openModals.forEach(modal => {
        if (modal.id !== 'genericModal') modal.style.display = 'none';
    });
}

// Asegurar que tApp() esté definida
function tApp(key) {
    return textosApp[idiomaApp][key] || textosApp.es[key] || key;
}
        
       function mostrarMenuIdiomaApp() {
    // Cerrar cualquier modal existente
    const existingModal = document.getElementById('genericModal');
    if (existingModal) existingModal.remove();
    
    const modalHtml = `
        <div class="modal-content modal-300">
            <div class="modal-header">
                <h3>${tApp('idioma_titulo')}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button class="btn btn-secondary" onclick="cambiarIdiomaApp('es'); cerrarModalGeneric()"> ${tApp('idioma_es')}</button>
                <button class="btn btn-secondary" onclick="cambiarIdiomaApp('en'); cerrarModalGeneric()"> ${tApp('idioma_en')}</button>
                <button class="btn btn-secondary" onclick="cambiarIdiomaApp('fr'); cerrarModalGeneric()"> ${tApp('idioma_fr')}</button>
                <button class="btn btn-secondary" onclick="cambiarIdiomaApp('de'); cerrarModalGeneric()"> ${tApp('idioma_de')}</button>
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
                    { selector: '.nav-header[data-panel="acta"] .nav-title', icono: '' },
                    { selector: '.nav-header[data-panel="dashboard"] .nav-title', icono: '' },
                    { selector: '.nav-header[data-panel="salud"] .nav-title', icono: '' },
                    { selector: '.nav-header[data-submenu="finanzas"] .nav-title', icono: '' },
                    { selector: '.nav-header[data-panel="financiero"] .nav-title', icono: '' },
                    { selector: '.nav-header[data-panel="cronograma"] .nav-title', icono: '' },
                    { selector: '.nav-header[data-panel="riesgos"] .nav-title', icono: '' },
                    { selector: '.nav-header[data-submenu="stakeholders"] .nav-title', icono: '' },
                    { selector: '.nav-header[data-panel="procesos"] .nav-title', icono: '' },
                    { selector: '.nav-header[data-submenu="recursos"] .nav-title', icono: '' },
                    { selector: '.nav-header[data-panel="comunicaciones"] .nav-title', icono: '' },
                    { selector: '.nav-header[data-panel="resumenGastos"] .nav-title', icono: '' },
                    { selector: '.submenu-item[data-panel="monedas"]', icono: '' },
                    { selector: '.submenu-item[data-panel="venta"]', icono: '' },
                    { selector: '.submenu-item[data-panel="cashflow"]', icono: '' },
                    { selector: '.submenu-item[data-panel="avales"]', icono: '' },
                    { selector: '.submenu-item[data-panel="garantia"]', icono: '' },
                    { selector: '.submenu-item[data-panel="stakeholders"]', icono: '' },
                    { selector: '.submenu-item[data-panel="raci"]', icono: '' },
                    { selector: '.submenu-item[data-panel="roles"]', icono: '' },
                    { selector: '.submenu-item[data-panel="equipo"]', icono: '' },
                    { selector: '.submenu-item[data-panel="materiales"]', icono: '' },
                    { selector: '.submenu-item[data-panel="servicios"]', icono: '' },
                    { selector: '.submenu-item[data-panel="logistica"]', icono: '' },
                    { selector: '.submenu-item[data-panel="viajes"]', icono: '' },
                    { selector: '.nav-header[data-panel="beneficios"] .nav-title', icono: '' },
                    { selector: '.nav-header[data-panel="cambios"] .nav-title', icono: '' },
                    { selector: '.nav-header[data-panel="lecciones"] .nav-title', icono: '' },
                    { selector: '.nav-header[data-submenu="scrum"] .nav-title', icono: '' }
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
                    el.innerHTML = tApp(item.key);
                }
            });
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
        
        function formatearMoneda(valor) {
            if (!proyecto) return valor.toLocaleString('es-ES', {minimumFractionDigits:2, maximumFractionDigits:2}) + " €";
            let simbolo = {EUR:"€",USD:"$",GBP:"£",JPY:"¥",CHF:"₣",BRL:"R$",MXN:"Mex$",COP:"COL$",ARS:"ARS$",CLP:"CLP$",DZD:"دج",CDF:"FC",MZN:"MT",ZAR:"R",NGN:"₦",KES:"KSh",EGP:"E£",MAD:"د.م."}[proyecto.monedaBase] || proyecto.monedaBase;
            return valor.toLocaleString('es-ES', {minimumFractionDigits:2, maximumFractionDigits:2}) + " " + simbolo;
        }
        
    function convertirMoneda(valor, monedaOrigen) {
    // Si no hay valor, devolver 0
    if (!valor || isNaN(valor)) return 0;
    
    // Si no hay proyecto o moneda base, devolver el valor sin cambios
    if (!proyecto || !proyecto.monedaBase) {
        console.warn(" No se pudo convertir: proyecto o moneda base no definida");
        return valor;
    }
    
    // Si la moneda es la misma que la base, no convertir
    if (monedaOrigen === proyecto.monedaBase) {
        return valor;
    }
    
    // Asegurar que tiposCambio existe
    if (!tiposCambio || Object.keys(tiposCambio).length === 0) {
        console.warn(" tiposCambio vacío, cargando valores por defecto");
        // Valores por defecto
        tiposCambio = {
            EUR: 1, USD: 1.09, GBP: 0.86, JPY: 164, CHF: 0.95,
            DZD: 134, CDF: 2800, MZN: 64, ZAR: 18.5
        };
    }
    
    // Obtener la tasa de cambio
    let tasa = tiposCambio[monedaOrigen];
    
    // Si no hay tasa, buscar en valores por defecto
    if (!tasa || tasa === 0) {
        const defaultRates = {
            USD: 1.09, GBP: 0.86, JPY: 164, CHF: 0.95,
            DZD: 134, CDF: 2800, MZN: 64, ZAR: 18.5,
            BRL: 5.45, MXN: 18.25, COP: 4190, ARS: 950, CLP: 920,
            NGN: 1500, KES: 140, EGP: 48, MAD: 10.8
        };
        
        tasa = defaultRates[monedaOrigen];
        
        if (tasa) {
            // Guardar la tasa para futuras conversiones
            tiposCambio[monedaOrigen] = tasa;
            console.log(` Tasa añadida para ${monedaOrigen}: ${tasa}`);
        } else {
            console.error(` ERROR: No hay tasa para ${monedaOrigen}. Usando valor original.`);
            mostrarToast(` No hay tasa de cambio para ${monedaOrigen}. Actualiza los tipos de cambio.`, 'warning');
            return valor;
        }
    }
    
    //  CORRECCIÓN IMPORTANTE: Dividir para convertir a EUR
    // Ejemplo: 1000 DZD ÷ 134 = 7.46 EUR
    const valorConvertido = valor / tasa;
    
    // Log para depuración (opcional, puedes comentarlo después)
    if (monedaOrigen !== proyecto.monedaBase) {
        console.log(` Conversión: ${valor.toFixed(2)} ${monedaOrigen} → ${valorConvertido.toFixed(2)} ${proyecto.monedaBase} (tasa: ${tasa})`);
    }
    
    return valorConvertido;
}

function guardarProyecto() {
    let todos = cargarProyectosStorage();
    let idx = todos.findIndex(p => p.id === proyecto.id);
    if (idx >= 0) todos[idx] = proyecto;
            else todos.push(proyecto);
            guardarProyectosStorage(todos);
            mostrarToast(tApp('toast_guardado'), 'success');
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
        
 function escapeHtml(str) { if(!str) return ''; return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); }

        
        function leerArchivoComoBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }
        
        // ============================================

        // ACTA DE INICIO
        // ============================================
function renderizarActa() {
    sincronizarActaConProyecto();
    let a = proyecto.acta || {};
    let pm = proyecto.projectManager || {};
    let sp = proyecto.sponsor || {};
    let cl = proyecto.cliente || {};
    
    let hitosHtml = '';
    if (proyecto.hitosFinancieros && proyecto.hitosFinancieros.length > 0) {
        hitosHtml = '<div class="acta-field"><div class="acta-label">' + tApp('acta_hitos_pago') + '</div><div class="acta-value">';
        proyecto.hitosFinancieros.forEach(h => {
            let importe = (proyecto.precioVenta * h.porcentaje) / 100;
            hitosHtml += `<div style="margin-bottom: 4px;">• ${escapeHtml(h.nombre)}: ${h.porcentaje}% (${formatearMoneda(importe)}) - Mes ${h.mes}</div>`;
        });
        hitosHtml += `</div></div>`;
    } else {
        hitosHtml = '<div class="acta-field"><div class="acta-label">' + tApp('acta_hitos_pago') + '</div><div class="acta-value">' + tApp('acta_sin_hitos') + '</div></div>';
    }
    
    let avalesHtml = '';
    if (proyecto.avales && proyecto.avales.length > 0) {
        avalesHtml = '<div class="acta-field"><div class="acta-label">' + tApp('acta_avales') + '</div><div class="acta-value">';
        proyecto.avales.forEach(a => {
            let estadoIcon = a.estado === 'Vigente' ? '' : (a.estado === 'Próximo a vencer' ? '' : '');
            avalesHtml += `<div style="margin-bottom: 8px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                <strong>${estadoIcon} ${escapeHtml(a.tipo)}</strong><br>
                 ${escapeHtml(a.entidad || 'Entidad no especificada')}<br>
                 Importe: ${formatearMoneda(convertirMoneda(a.importe, a.moneda))}<br>
                 Emisión: ${a.fechaEmision || '-'} |  Vence: ${a.fechaVencimiento || '-'}<br>
                 Ref: ${escapeHtml(a.referencia || '-')}
            </div>`;
        });
        avalesHtml += `</div></div>`;
    } else {
        avalesHtml = '<div class="acta-field"><div class="acta-label">' + tApp('acta_avales') + '</div><div class="acta-value">' + tApp('acta_sin_avales') + '</div></div>';
    }
    
    // Metodología
    const metodologia = proyecto.metodologia || { tipo: 'cascada', fasesAgile: [], fechaTransicion: null };
    let metodologiaTexto = '';
    let metodologiaDetalle = '';
    
    if (metodologia.tipo === 'cascada') {
        metodologiaTexto = ' Gestión Tradicional (Cascada)';
        metodologiaDetalle = 'Planificación secuencial, fases definidas, entregables por etapa.';
    } else if (metodologia.tipo === 'agile') {
        metodologiaTexto = ' Gestión Ágil (Scrum)';
        metodologiaDetalle = 'Sprints de 2 semanas, historias de usuario, entregas incrementales.';
    } else if (metodologia.tipo === 'mixto') {
        metodologiaTexto = ' Gestión Mixta (Cascada + Ágil)';
        let fasesTexto = (metodologia.fasesAgile || []).map(f => {
            const nombres = { diseno: ' Diseño', desarrollo: ' Desarrollo', pruebas: ' Pruebas', implementacion: ' Implementación' };
            return nombres[f] || f;
        }).join(', ') || 'Ninguna';
        metodologiaDetalle = ` Transición: ${metodologia.fechaTransicion || 'No definida'} |  Fases Ágiles: ${fasesTexto}`;
    }
    
    document.getElementById('actaContent').innerHTML = `
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_identificacion')}</h3><div class="acta-grid">
            <div class="acta-field"><div class="acta-label">${tApp('acta_nombre')}</div><div class="acta-value">${escapeHtml(a.nombreProyecto || proyecto.nombre)}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_codigo')}</div><div class="acta-value">${escapeHtml(a.codigo || '-')}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_pais')}</div><div class="acta-value">${escapeHtml(proyecto.pais || a.pais || 'No especificado')}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_inicio')}</div><div class="acta-value">${a.fechaInicio ? formatearFechaEspa(a.fechaInicio) : '-'}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_fin')}</div><div class="acta-value">${a.fechaFin || proyecto.fechaFinPlan || '-'}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_moneda')}</div><div class="acta-value">${a.moneda || proyecto.monedaBase}</div></div>
        </div></div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_objetivos')}</h3>
            <div class="acta-field"><div class="acta-label">${tApp('acta_objetivo_general')}</div><div class="acta-value">${escapeHtml(a.objetivoGeneral || 'No definido')}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_criterios_exito')}</div><div class="acta-value">${escapeHtml(a.criteriosExito || 'No definidos')}</div></div>
        </div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_alcance')}</h3>
            <div class="acta-field"><div class="acta-label">${tApp('acta_descripcion')}</div><div class="acta-value">${escapeHtml(a.alcance || proyecto.descripcion || 'No definido')}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_entregables_clave')}</div><div class="acta-value">${escapeHtml(a.entregablesClave || 'No definidos')}</div></div>
        </div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_partes')}</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 12px;">
                <div class="info-card u-text-center" >
                    <div class="u-fs-32 u-mb-8"></div>
                    <div class="u-fw-600 u-fs-14 u-mb-4">${tApp('acta_pm')}</div>
                    <div class="u-fs-13 u-color-primary">${escapeHtml(pm.nombre || tApp('acta_pm_no_asignado'))}</div>
                    <div class="u-fs-11 u-mt-6"> ${pm.email || '-'}<br> ${pm.telefono || '-'}</div>
                    <button class="btn btn-secondary btn-small u-w-full" onclick="abrirModalPM()" >${tApp('btn_editar')} PM</button>
                </div>
                
                <div class="info-card u-text-center" >
                    <div class="u-fs-32 u-mb-8"></div>
                    <div class="u-fw-600 u-fs-14 u-mb-4">${tApp('acta_sponsor')}</div>
                    <div class="u-fs-13 u-color-primary">${escapeHtml(sp.nombre || tApp('acta_sponsor_no_asignado'))}</div>
                    <div class="u-fs-11 u-mt-6"> ${sp.email || '-'}<br> ${sp.telefono || '-'}</div>
                    <button class="btn btn-secondary btn-small u-w-full" onclick="abrirModalSponsor()" >${tApp('btn_editar')} Sponsor</button>
                </div>
                
                <div class="info-card u-text-center" >
                    <div class="u-fs-32 u-mb-8"></div>
                    <div class="u-fw-600 u-fs-14 u-mb-4">${tApp('acta_cliente')}</div>
                    <div class="u-fs-13 u-color-primary">${escapeHtml(cl.nombre || tApp('acta_cliente_no_asignado'))}</div>
                    <div class="u-fs-11 u-mt-6"> ${cl.email || '-'}<br> ${cl.telefono || '-'}</div>
                    <button class="btn btn-secondary btn-small u-w-full" onclick="abrirModalCliente()" >${tApp('btn_editar')} Cliente</button>
                </div>
            </div>
        </div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_presupuesto')}</h3><div class="acta-grid">
            <div class="acta-field"><div class="acta-label">${tApp('acta_presupuesto_valor')}</div><div class="acta-value">${a.presupuesto ? formatearMoneda(a.presupuesto) : '-'}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_contrato')}</div><div class="acta-value"><strong class="u-color-success">${proyecto.precioVenta ? formatearMoneda(proyecto.precioVenta) : 'No definido'}</strong></div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_moneda_venta')}</div><div class="acta-value">${proyecto.monedaVenta || proyecto.monedaBase}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_roi')}</div><div class="acta-value">${a.roi ? a.roi + '%' : '-'}</div></div>
        </div></div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_condiciones')}</h3>
            <div class="acta-field"><div class="acta-label">${tApp('acta_condiciones_texto')}</div><div class="acta-value">${escapeHtml(proyecto.condicionesPago || 'No definidas')}</div></div>
            ${hitosHtml}
        </div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_avales')}</h3>
            ${avalesHtml}
        </div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_aprobaciones')}</h3><div class="acta-grid">
            <div class="acta-field"><div class="acta-label">${tApp('acta_aprobado_por')}</div><div class="acta-value">${escapeHtml(a.aprobadoPor || 'Pendiente')}</div></div>
            <div class="acta-field"><div class="acta-label">${tApp('acta_fecha_aprobacion')}</div><div class="acta-value">${a.fechaAprobacion || '-'}</div></div>
        </div></div>
        
        <div class="acta-section"><h3 class="u-color-primary">${tApp('acta_metodologia')}</h3>
            <div class="acta-field">
                <div class="acta-label">${tApp('acta_metodologia_tipo')}</div>
                <div class="acta-value">${metodologiaTexto}</div>
            </div>
            <div class="acta-field">
                <div class="acta-label">${tApp('acta_metodologia_desc')}</div>
                <div class="acta-value">${metodologiaDetalle}</div>
            </div>
        </div>
        
        <div class="info-card u-mt-16">
            <p class="u-p-sm"> Los hitos de pago se gestionan en Finanzas → Venta y Hitos | Los avales se gestionan en Finanzas → Avales y Garantías</p>
        </div>
    `;
}

function editarActa() {
    let a = proyecto.acta || {};
    const metodologia = proyecto.metodologia || { tipo: 'cascada', fasesAgile: [], fechaTransicion: null };
    
    const modalHtml = `<div class="modal-content modal-md"><div class="modal-header"><h3> ${tApp('btn_editar')} ${tApp('sidebar_acta')}</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
        <div class="form-group"><label>${tApp('acta_nombre')}</label><input type="text" id="actaNombre" value="${escapeHtml(a.nombreProyecto || proyecto.nombre)}"></div>
        <div class="form-group"><label>${tApp('acta_codigo')}</label><input type="text" id="actaCodigo" value="${escapeHtml(a.codigo || '')}"></div>
        <div class="form-row"><div class="form-group"><label>${tApp('acta_inicio')}</label><input type="date" id="actaFechaInicio" value="${a.fechaInicio || proyecto.fechaInicio || ''}"></div>
        <div class="form-group"><label>${tApp('acta_fin')}</label><input type="date" id="actaFechaFin" value="${a.fechaFin || proyecto.fechaFinPlan || ''}"></div></div>
        <div class="form-group"><label>${tApp('acta_objetivo_general')}</label><textarea rows="2" id="actaObjGeneral">${escapeHtml(a.objetivoGeneral || '')}</textarea></div>
        <div class="form-group"><label>${tApp('acta_criterios_exito')}</label><textarea rows="2" id="actaCriterios">${escapeHtml(a.criteriosExito || '')}</textarea></div>
        <div class="form-group"><label>${tApp('acta_descripcion')}</label><textarea rows="2" id="actaAlcance">${escapeHtml(a.alcance || proyecto.descripcion || '')}</textarea></div>
        <div class="form-group"><label>${tApp('acta_entregables_clave')}</label><textarea rows="2" id="actaEntregables">${escapeHtml(a.entregablesClave || '')}</textarea></div>
        <div class="form-row"><div class="form-group"><label>${tApp('acta_presupuesto_valor')}</label><input type="number" id="actaPresupuesto" value="${a.presupuesto || 0}"></div>
        <div class="form-group"><label>${tApp('acta_contrato')}</label><input type="number" id="actaPrecioVenta" value="${proyecto.precioVenta || 0}" step="1000"></div></div>
        <div class="form-row"><div class="form-group"><label>${tApp('acta_moneda_venta')}</label><select id="actaMonedaVenta">${Object.keys(MONEDAS).map(m => `<option value="${m}" ${(proyecto.monedaVenta || proyecto.monedaBase) === m ? 'selected' : ''}>${m} - ${MONEDAS[m]}</option>`).join('')}</select></div>
        <div class="form-group"><label>${tApp('acta_roi')}</label><input type="number" id="actaROI" value="${a.roi || 0}"></div></div>
        
        <hr class="u-hr">
        <h4 class="u-fs-13"> ${tApp('acta_metodologia_tipo')}</h4>
        <div class="form-group">
            <label>${tApp('acta_metodologia_tipo')}</label>
            <select id="metodologiaTipo" onchange="toggleMetodologiaCampos()">
                <option value="cascada" ${metodologia.tipo === 'cascada' ? 'selected' : ''}> Cascada / Tradicional (PMBOK)</option>
                <option value="agile" ${metodologia.tipo === 'agile' ? 'selected' : ''}> Ágil / Scrum</option>
                <option value="mixto" ${metodologia.tipo === 'mixto' ? 'selected' : ''}> Mixto (Cascada + Ágil)</option>
            </select>
            <small class="u-fs-11">Define cómo se gestionará el proyecto. Puedes cambiarlo en cualquier momento.</small>
        </div>
        
        <div id="mixtoConfig" style="display: ${metodologia.tipo === 'mixto' ? 'block' : 'none'};">
            <div class="form-group">
                <label> Fecha de transición a Ágil</label>
                <input type="date" id="metodologiaFechaTransicion" value="${metodologia.fechaTransicion || ''}">
                <small>Hasta esta fecha: usar metodología Cascada | Después: usar Ágil/Scrum</small>
            </div>
            <div class="form-group">
                <label> Fases que serán gestionadas con Ágil</label>
                <select id="metodologiaFasesAgile" multiple size="4" style="height: auto;">
                    <option value="diseno" ${metodologia.fasesAgile?.includes('diseno') ? 'selected' : ''}> Diseño</option>
                    <option value="desarrollo" ${metodologia.fasesAgile?.includes('desarrollo') ? 'selected' : ''}> Desarrollo</option>
                    <option value="pruebas" ${metodologia.fasesAgile?.includes('pruebas') ? 'selected' : ''}> Pruebas</option>
                    <option value="implementacion" ${metodologia.fasesAgile?.includes('implementacion') ? 'selected' : ''}> Implementación</option>
                </select>
                <small>Mantén pulsado Ctrl/Cmd para seleccionar múltiples fases</small>
            </div>
        </div>
        
        <div class="info-card-modal u-mt-16" >
            <small> <strong>¿Cuál elegir?</strong><br>
            • <strong>Cascada:</strong> Ideal para proyectos con requisitos estables, regulados o de construcción.<br>
            • <strong>Ágil:</strong> Perfecto para proyectos con incertidumbre, software o equipos pequeños.<br>
            • <strong>Mixto:</strong> Combina planificación inicial en cascada con desarrollo iterativo ágil.
            </small>
        </div>
        
        <div class="form-row">
            <div class="form-group"><label> Beneficio Proyectado (€)</label><input type="number" id="actaBeneficioProyectado" value="${a.beneficioProyectado || 0}"></div>
            <div class="form-group"><label> Fecha estimada beneficio</label><input type="date" id="actaFechaBeneficio" value="${a.fechaBeneficio || ''}"></div>
        </div>
        <div class="form-group"><label> Indicadores de éxito del beneficio</label><textarea rows="2" id="actaIndicadoresBeneficio" placeholder="Ej: ROI > 15%, Payback < 2 años, VAN > 100.000€">${escapeHtml(a.indicadoresBeneficio || '')}</textarea></div>
        <div class="form-group"><label>${tApp('acta_condiciones_texto')}</label><textarea rows="2" id="actaCondicionesPago" placeholder="Ej: 30% anticipo, 40% contra entrega, 30% a 30 días">${escapeHtml(proyecto.condicionesPago || '')}</textarea></div>
        <div class="form-group"><label>${tApp('acta_aprobado_por')}</label><input type="text" id="actaAprobado" value="${escapeHtml(a.aprobadoPor || '')}"></div>
        <div class="form-group"><label>${tApp('acta_fecha_aprobacion')}</label><input type="date" id="actaFechaAprobacion" value="${a.fechaAprobacion || ''}"></div>
        <div class="info-card-modal u-mt-16"><p> Los hitos de pago se gestionan en Finanzas → Venta y Hitos</p></div>
        <button class="btn btn-primary" onclick="guardarActa()">${tApp('btn_guardar')} Acta</button>
    </div>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}

// Función auxiliar para mostrar/ocultar campos mixtos
function toggleMetodologiaCampos() {
    const tipo = document.getElementById('metodologiaTipo').value;
    const mixtoConfig = document.getElementById('mixtoConfig');
    if (mixtoConfig) {
        mixtoConfig.style.display = tipo === 'mixto' ? 'block' : 'none';
    }
}
        
        function guardarActa() {
    let actaData = {
        nombreProyecto: document.getElementById('actaNombre').value,
        codigo: document.getElementById('actaCodigo').value,
        fechaInicio: document.getElementById('actaFechaInicio').value,
        fechaFin: document.getElementById('actaFechaFin').value,
        objetivoGeneral: document.getElementById('actaObjGeneral').value,
        criteriosExito: document.getElementById('actaCriterios').value,
        alcance: document.getElementById('actaAlcance').value,
        entregablesClave: document.getElementById('actaEntregables').value,
        presupuesto: parseFloat(document.getElementById('actaPresupuesto').value),
        roi: parseFloat(document.getElementById('actaROI').value),
        aprobadoPor: document.getElementById('actaAprobado').value,
        fechaAprobacion: document.getElementById('actaFechaAprobacion').value,
        beneficioProyectado: parseFloat(document.getElementById('actaBeneficioProyectado').value),
        fechaBeneficio: document.getElementById('actaFechaBeneficio').value,
        indicadoresBeneficio: document.getElementById('actaIndicadoresBeneficio').value
    };
    
    let precioVentaActa = parseFloat(document.getElementById('actaPrecioVenta').value);
    let monedaVentaActa = document.getElementById('actaMonedaVenta').value;
    let condicionesPagoActa = document.getElementById('actaCondicionesPago').value;
    
    proyecto.acta = actaData;
    
    //  CORRECCIÓN: Guardar metodología seleccionada
    const metodologiaTipo = document.getElementById('metodologiaTipo')?.value || 'cascada';
    const metodologiaFechaTransicion = document.getElementById('metodologiaFechaTransicion')?.value || null;
    
    // Obtener fases ágiles seleccionadas (soporta múltiple selección)
    const metodologiaFasesSelect = document.getElementById('metodologiaFasesAgile');
    let metodologiaFasesAgile = [];
    if (metodologiaFasesSelect) {
        metodologiaFasesAgile = Array.from(metodologiaFasesSelect.selectedOptions).map(opt => opt.value);
    }
    
    proyecto.metodologia = {
        tipo: metodologiaTipo,
        fasesAgile: metodologiaFasesAgile,
        fechaTransicion: metodologiaFechaTransicion
    };
    
    console.log(" Metodología guardada:", proyecto.metodologia); // Para depuración
    
    if (actaData.nombreProyecto) proyecto.nombre = actaData.nombreProyecto;
    if (actaData.alcance) proyecto.descripcion = actaData.alcance;
    if (actaData.fechaInicio) proyecto.fechaInicio = actaData.fechaInicio;
    if (actaData.fechaFin) proyecto.fechaFinPlan = actaData.fechaFin;
    
    if (!isNaN(precioVentaActa)) proyecto.precioVenta = precioVentaActa;
    proyecto.monedaVenta = monedaVentaActa;
    proyecto.condicionesPago = condicionesPagoActa;
    
    document.getElementById('precioVenta').value = proyecto.precioVenta;
    document.getElementById('precioVenta2').value = proyecto.precioVenta;
    document.getElementById('monedaVenta').value = proyecto.monedaVenta;
    document.getElementById('monedaVenta2').value = proyecto.monedaVenta;
    document.getElementById('condicionesPago').value = proyecto.condicionesPago;
    document.getElementById('condicionesPago2').value = proyecto.condicionesPago;
    
    guardarProyecto();
    renderizarActa();
    calcularCashflow();
    renderizarHitosFinancieros();
    
    //  Aplicar visibilidad de paneles según metodología guardada
    if (typeof mostrarPanelesSegunMetodologia === 'function') {
        mostrarPanelesSegunMetodologia();
    }
    
    cerrarModalGeneric();
    mostrarToast(tApp('toast_acta_guardada'), 'success');
}
        
                // ============================================
        // ROLES - VERSIÓN MEJORADA (con más datos y vCard)
        // ============================================
        
        function renderizarRoles() {
            let pm = proyecto.projectManager || {};
            let sp = proyecto.sponsor || {};
            let cl = proyecto.cliente || {};
            
            document.getElementById('rolesContent').innerHTML = `
                <div class="info-card">
                    <h4> Project Manager</h4>
                    <div class="name">${pm.nombre || 'No definido'}</div>
                    <div class="details">${pm.cargo || ''}</div>
                    <div class="details"> ${pm.email || '-'}</div>
                    <div class="details"> ${pm.telefono || '-'}</div>
                    <div class="details"> ${pm.direccion || '-'}</div>
                    <div class="details"> ${pm.departamento || '-'}</div>
                    <div class="u-mt-8">
                        <span class="edit-icon" onclick="abrirModalPM()"> Editar</span>
                        ${pm.nombre ? `<span class="edit-icon u-ml-8 u-bg-blue-faint" onclick="exportarVCard('pm')"> Exportar vCard</span>` : ''}
                    </div>
                </div>
                <div class="info-card">
                    <h4> Sponsor</h4>
                    <div class="name">${sp.nombre || 'No definido'}</div>
                    <div class="details">${sp.cargo || ''}</div>
                    <div class="details"> ${sp.email || '-'}</div>
                    <div class="details"> ${sp.telefono || '-'}</div>
                    <div class="details"> ${sp.direccion || '-'}</div>
                    <div class="details"> ${sp.departamento || '-'}</div>
                    <div class="u-mt-8">
                        <span class="edit-icon" onclick="abrirModalSponsor()"> Editar</span>
                        ${sp.nombre ? `<span class="edit-icon u-ml-8 u-bg-blue-faint" onclick="exportarVCard('sponsor')"> Exportar vCard</span>` : ''}
                    </div>
                </div>
                <div class="info-card">
                    <h4> Cliente</h4>
                    <div class="name">${cl.nombre || 'No definido'}</div>
                    <div class="details">${cl.cargo || ''}</div>
                    <div class="details"> ${cl.email || '-'}</div>
                    <div class="details"> ${cl.telefono || '-'}</div>
                    <div class="details"> ${cl.direccion || '-'}</div>
                    <div class="details"> ${cl.departamento || '-'}</div>
                    <div class="u-mt-8">
                        <span class="edit-icon" onclick="abrirModalCliente()"> Editar</span>
                        ${cl.nombre ? `<span class="edit-icon u-ml-8 u-bg-blue-faint" onclick="exportarVCard('cliente')"> Exportar vCard</span>` : ''}
                    </div>
                </div>
            `;
        }
        
        function abrirModalPM() {
            let p = proyecto.projectManager || {};
            const modalHtml = `
                <div class="modal-content modal-500">
                    <div class="modal-header">
                        <h3> Editar Project Manager</h3>
                        <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
                    </div>
                    <div class="form-group">
                        <label>Nombre completo *</label>
                        <input type="text" id="pmNombre" value="${escapeHtml(p.nombre || '')}" placeholder="Ej: Juan Carlos Pérez">
                    </div>
                    <div class="form-group">
                        <label>Cargo / Puesto</label>
                        <input type="text" id="pmCargo" value="${escapeHtml(p.cargo || '')}" placeholder="Ej: Director de Proyectos">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="pmEmail" value="${escapeHtml(p.email || '')}" placeholder="juan.perez@empresa.com">
                    </div>
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="text" id="pmTelefono" value="${escapeHtml(p.telefono || '')}" placeholder="+34 600 000 000">
                    </div>
                    <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" id="pmDireccion" value="${escapeHtml(p.direccion || '')}" placeholder="Calle, número, ciudad, país">
                    </div>
                    <div class="form-group">
                        <label>Departamento / Área</label>
                        <input type="text" id="pmDepartamento" value="${escapeHtml(p.departamento || '')}" placeholder="Ej: Gestión de Proyectos">
                    </div>
                    <button class="btn btn-primary" onclick="guardarPM()">Guardar</button>
                </div>
            `;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function guardarPM() {
            proyecto.projectManager = { 
                nombre: document.getElementById('pmNombre').value,
                cargo: document.getElementById('pmCargo').value,
                email: document.getElementById('pmEmail').value,
                telefono: document.getElementById('pmTelefono').value,
                direccion: document.getElementById('pmDireccion').value,
                departamento: document.getElementById('pmDepartamento').value
            };
            guardarProyecto(); 
            renderizarRoles(); 
            cerrarModalGeneric(); 
            mostrarToast(tApp('toast_pm_actualizado'), 'success');
        }
        
        function abrirModalSponsor() {
            let s = proyecto.sponsor || {};
            const modalHtml = `
                <div class="modal-content modal-500">
                    <div class="modal-header">
                        <h3> Editar Sponsor</h3>
                        <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
                    </div>
                    <div class="form-group">
                        <label>Nombre completo *</label>
                        <input type="text" id="sponsorNombre" value="${escapeHtml(s.nombre || '')}" placeholder="Ej: María González">
                    </div>
                    <div class="form-group">
                        <label>Cargo / Puesto</label>
                        <input type="text" id="sponsorCargo" value="${escapeHtml(s.cargo || '')}" placeholder="Ej: Directora General">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="sponsorEmail" value="${escapeHtml(s.email || '')}" placeholder="maria.gonzalez@empresa.com">
                    </div>
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="text" id="sponsorTelefono" value="${escapeHtml(s.telefono || '')}" placeholder="+34 600 000 000">
                    </div>
                    <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" id="sponsorDireccion" value="${escapeHtml(s.direccion || '')}" placeholder="Calle, número, ciudad, país">
                    </div>
                    <div class="form-group">
                        <label>Departamento / Área</label>
                        <input type="text" id="sponsorDepartamento" value="${escapeHtml(s.departamento || '')}" placeholder="Ej: Dirección General">
                    </div>
                    <button class="btn btn-primary" onclick="guardarSponsor()">Guardar</button>
                </div>
            `;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function guardarSponsor() {
            proyecto.sponsor = { 
                nombre: document.getElementById('sponsorNombre').value,
                cargo: document.getElementById('sponsorCargo').value,
                email: document.getElementById('sponsorEmail').value,
                telefono: document.getElementById('sponsorTelefono').value,
                direccion: document.getElementById('sponsorDireccion').value,
                departamento: document.getElementById('sponsorDepartamento').value
            };
            guardarProyecto(); 
            renderizarRoles(); 
            cerrarModalGeneric(); 
            mostrarToast(tApp('toast_sponsor_actualizado'), 'success');
        }
        
        function abrirModalCliente() {
            let c = proyecto.cliente || {};
            const modalHtml = `
                <div class="modal-content modal-500">
                    <div class="modal-header">
                        <h3> Editar Cliente</h3>
                        <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
                    </div>
                    <div class="form-group">
                        <label>Nombre / Empresa *</label>
                        <input type="text" id="clienteNombre" value="${escapeHtml(c.nombre || '')}" placeholder="Ej: Empresa XYZ S.A.">
                    </div>
                    <div class="form-group">
                        <label>Contacto / Persona de referencia</label>
                        <input type="text" id="clienteContacto" value="${escapeHtml(c.contacto || '')}" placeholder="Ej: Carlos López">
                    </div>
                    <div class="form-group">
                        <label>Cargo del contacto</label>
                        <input type="text" id="clienteCargo" value="${escapeHtml(c.cargo || '')}" placeholder="Ej: Gerente de Compras">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="clienteEmail" value="${escapeHtml(c.email || '')}" placeholder="contacto@empresa.com">
                    </div>
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="text" id="clienteTelefono" value="${escapeHtml(c.telefono || '')}" placeholder="+34 600 000 000">
                    </div>
                    <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" id="clienteDireccion" value="${escapeHtml(c.direccion || '')}" placeholder="Calle, número, ciudad, país">
                    </div>
                    <div class="form-group">
                        <label>Departamento / Área</label>
                        <input type="text" id="clienteDepartamento" value="${escapeHtml(c.departamento || '')}" placeholder="Ej: Compras">
                    </div>
                    <button class="btn btn-primary" onclick="guardarCliente()">Guardar</button>
                </div>
            `;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function guardarCliente() {
            proyecto.cliente = { 
                nombre: document.getElementById('clienteNombre').value,
                contacto: document.getElementById('clienteContacto').value,
                cargo: document.getElementById('clienteCargo').value,
                email: document.getElementById('clienteEmail').value,
                telefono: document.getElementById('clienteTelefono').value,
                direccion: document.getElementById('clienteDireccion').value,
                departamento: document.getElementById('clienteDepartamento').value
            };
            guardarProyecto(); 
            renderizarRoles(); 
            cerrarModalGeneric(); 
            mostrarToast(tApp('toast_cliente_actualizado'), 'success');
        }

        // ============================================
// FUNCIONES PARA GESTIÓN DE METODOLOGÍA
// ============================================

function mostrarPanelesSegunMetodologia() {
    const metodologia = proyecto?.metodologia?.tipo || 'cascada';
    
    // Paneles específicos de cada metodología
    const panelesCascada = ['cronograma', 'materiales', 'servicios', 'logistica', 'viajes', 'avales', 'garantia'];
    const panelesAgile = ['sprintBacklog', 'sprintBurndown', 'velocityTracking', 'retrospectives', 'agileMetrics', 'sprintList'];
    
    if (metodologia === 'cascada') {
        // Ocultar paneles ágiles, mostrar cascada
        panelesAgile.forEach(p => {
            const elemento = document.querySelector(`.nav-header[data-panel="${p}"], .submenu-item[data-panel="${p}"]`);
            if (elemento) elemento.style.display = 'none';
        });
        panelesCascada.forEach(p => {
            const elemento = document.querySelector(`.nav-header[data-panel="${p}"], .submenu-item[data-panel="${p}"]`);
            if (elemento) elemento.style.display = 'block';
        });
        
        // Ocultar menú Scrum
        const scrumMenu = document.querySelector('.nav-header[data-submenu="scrum"]');
        if (scrumMenu) scrumMenu.style.display = 'none';
        
    } else if (metodologia === 'agile') {
        // Mostrar paneles ágiles, ocultar cascada
        panelesCascada.forEach(p => {
            const elemento = document.querySelector(`.nav-header[data-panel="${p}"], .submenu-item[data-panel="${p}"]`);
            if (elemento) elemento.style.display = 'none';
        });
        panelesAgile.forEach(p => {
            const elemento = document.querySelector(`.nav-header[data-panel="${p}"], .submenu-item[data-panel="${p}"]`);
            if (elemento) elemento.style.display = 'block';
        });
        
        // Mostrar menú Scrum
        const scrumMenu = document.querySelector('.nav-header[data-submenu="scrum"]');
        if (scrumMenu) scrumMenu.style.display = 'block';
        
    } else if (metodologia === 'mixto') {
        // Mostrar todos los paneles
        panelesCascada.forEach(p => {
            const elemento = document.querySelector(`.nav-header[data-panel="${p}"], .submenu-item[data-panel="${p}"]`);
            if (elemento) elemento.style.display = 'block';
        });
        panelesAgile.forEach(p => {
            const elemento = document.querySelector(`.nav-header[data-panel="${p}"], .submenu-item[data-panel="${p}"]`);
            if (elemento) elemento.style.display = 'block';
        });
        
        const scrumMenu = document.querySelector('.nav-header[data-submenu="scrum"]');
        if (scrumMenu) scrumMenu.style.display = 'block';
        
        mostrarIndicadorMetodologiaMixta();
    }
}

function mostrarIndicadorMetodologiaMixta() {
    if (proyecto?.metodologia?.tipo !== 'mixto') return;
    
    const fechaTransicion = proyecto.metodologia.fechaTransicion;
    if (!fechaTransicion) return;
    
    const hoy = new Date();
    const fechaTransicionDate = new Date(fechaTransicion);
    const modoActual = hoy < fechaTransicionDate ? 'Cascada' : 'Ágil / Scrum';
    
    let banner = document.getElementById('metodologiaBanner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'metodologiaBanner';
        banner.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: linear-gradient(135deg, #007AFF, #0055CC);
            padding: 8px 16px;
            border-radius: 30px;
            font-size: 12px;
            z-index: 999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            cursor: pointer;
        `;
        document.body.appendChild(banner);
    }
    
    banner.innerHTML = ` Modo recomendado: <strong>${modoActual}</strong> `;
    banner.title = `Proyecto Mixto: Usar ${modoActual}`;
    
    banner.onclick = () => {
        if (modoActual === 'Cascada') {
            mostrarPanel('Cronograma');
        } else {
            mostrarPanel('SprintBacklog');
        }
    };
}

function recomendarMetodologia() {
    if (!proyecto) return;
    
    let puntajeAgile = 0;
    let puntajeCascada = 0;
    let razones = [];
    
    // 1. Estabilidad de requisitos (por hitos financieros)
    const hitos = proyecto.hitosFinancieros?.length || 0;
    if (hitos > 2) {
        puntajeCascada += 30;
        razones.push(" Múltiples hitos → requisitos probablemente estables → Cascada");
    } else {
        puntajeAgile += 30;
        razones.push(" Pocos hitos → requisitos pueden cambiar → Agile");
    }
    
    // 2. Tamaño del equipo
    const equipoSize = proyecto.equipo?.length || 0;
    if (equipoSize > 5) {
        puntajeCascada += 20;
        razones.push(" Equipo grande (>5) → mejor coordinación en Cascada");
    } else {
        puntajeAgile += 20;
        razones.push(" Equipo pequeño → Agile es más efectivo");
    }
    
    // 3. Complejidad técnica
    const materiales = proyecto.materiales?.length || 0;
    const servicios = proyecto.servicios?.length || 0;
    if (materiales + servicios > 10) {
        puntajeCascada += 25;
        razones.push(" Muchos materiales/servicios → planificación detallada necesaria");
    } else {
        puntajeAgile += 15;
        razones.push(" Pocos componentes → fácil de iterar");
    }
    
    // 4. Riesgos identificados
    const riesgosAltos = (proyecto.riesgos || []).filter(r => r.nivel === 'Alto' || r.nivel === 'Crítico').length;
    if (riesgosAltos > 3) {
        puntajeAgile += 25;
        razones.push(" Riesgos altos → Agile permite adaptación rápida");
    } else {
        puntajeCascada += 10;
        razones.push(" Riesgos controlables → Cascada es viable");
    }
    
    const recomendacion = puntajeAgile > puntajeCascada ? 'agile' : (puntajeCascada > puntajeAgile ? 'cascada' : 'mixto');
    const textosReco = {
        cascada: ' Cascada / Tradicional',
        agile: ' Ágil / Scrum',
        mixto: ' Mixto (combinación)'
    };
    
    const modalHtml = `
        <div class="modal-content modal-600">
            <div class="modal-header">
                <h3> Asistente de Metodología</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div class="u-mb-20">
                <div style="font-size: 24px; text-align: center; margin: 20px 0;">
                     <strong>${textosReco[recomendacion]}</strong>
                </div>
                <div style="background: rgba(0,122,255,0.2); padding: 12px; border-radius: 12px; text-align: center;">
                    Puntuación: Agile ${puntajeAgile} | Cascada ${puntajeCascada}
                </div>
            </div>
            
            <div class="info-card">
                <h4> Análisis detallado</h4>
                <ul class="u-ml-20 u-fs-12">
                    ${razones.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
            
            <div class="u-flex-gap-12 u-mt-20">
                <button class="btn btn-secondary" onclick="cerrarModalGeneric()">Cancelar</button>
                <button class="btn btn-primary" onclick="aplicarMetodologiaRecomendada('${recomendacion}')"> Aplicar recomendación</button>
            </div>
        </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function aplicarMetodologiaRecomendada(tipo) {
    if (!proyecto.metodologia) proyecto.metodologia = {};
    proyecto.metodologia.tipo = tipo;
    guardarProyecto();
    mostrarPanelesSegunMetodologia();
    cerrarModalGeneric();
    mostrarToast(` Metodología configurada: ${tipo.toUpperCase()}`, 'success');
}
        
        // ============================================
        // EXPORTAR TARJETA DE VISITA (vCard)
        // ============================================
        
        function exportarVCard(tipo) {
            let data = {};
            let nombreArchivo = '';
            
            if (tipo === 'pm') {
                data = proyecto.projectManager || {};
                nombreArchivo = `contacto_pm_${(data.nombre || 'project_manager').replace(/\s/g, '_')}.vcf`;
            } else if (tipo === 'sponsor') {
                data = proyecto.sponsor || {};
                nombreArchivo = `contacto_sponsor_${(data.nombre || 'sponsor').replace(/\s/g, '_')}.vcf`;
            } else if (tipo === 'cliente') {
                data = proyecto.cliente || {};
                nombreArchivo = `contacto_cliente_${(data.nombre || 'cliente').replace(/\s/g, '_')}.vcf`;
            }
            
            if (!data.nombre) {
                mostrarToast(" No hay datos de contacto para exportar", 'error');
                return;
            }
            
            // Construir vCard versión 4.0
            let vCard = [
                'BEGIN:VCARD',
                'VERSION:4.0',
                `FN:${data.nombre}`,
                data.cargo ? `TITLE:${data.cargo}` : '',
                data.email ? `EMAIL:${data.email}` : '',
                data.telefono ? `TEL:${data.telefono}` : '',
                data.direccion ? `ADR:;;${data.direccion};;;` : '',
                data.departamento ? `ORG:${data.departamento}` : '',
                data.contacto ? `X-CONTACT:${data.contacto}` : '',
                `REV:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
                'END:VCARD'
            ].filter(line => line !== '').join('\r\n');
            
            // Crear y descargar archivo
            const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', nombreArchivo);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            mostrarToast(` Tarjeta de visita exportada: ${data.nombre}`, 'success');
        }
        
        // Función adicional: Exportar todos los contactos en un solo archivo
        function exportarTodosVCard() {
            let allVCards = [];
            let nombres = [];
            
            const pm = proyecto.projectManager || {};
            const sponsor = proyecto.sponsor || {};
            const cliente = proyecto.cliente || {};
            
            if (pm.nombre) {
                allVCards.push(generarVCardString(pm, 'pm'));
                nombres.push(pm.nombre);
            }
            if (sponsor.nombre) {
                allVCards.push(generarVCardString(sponsor, 'sponsor'));
                nombres.push(sponsor.nombre);
            }
            if (cliente.nombre) {
                allVCards.push(generarVCardString(cliente, 'cliente'));
                nombres.push(cliente.nombre);
            }
            
            if (allVCards.length === 0) {
                mostrarToast(" No hay contactos para exportar", 'error');
                return;
            }
            
            const vcfContent = allVCards.join('\r\n\r\n');
            const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', `contactos_proyecto_${proyecto.nombre.replace(/\s/g, '_')}.vcf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            mostrarToast(` Exportados ${allVCards.length} contactos: ${nombres.join(', ')}`, 'success');
        }
        
        function generarVCardString(data, tipo) {
            let lines = [
                'BEGIN:VCARD',
                'VERSION:4.0',
                `FN:${data.nombre}`,
                data.cargo ? `TITLE:${data.cargo}` : '',
                data.email ? `EMAIL:${data.email}` : '',
                data.telefono ? `TEL:${data.telefono}` : '',
                data.direccion ? `ADR:;;${data.direccion};;;` : '',
                data.departamento ? `ORG:${data.departamento}` : '',
                data.contacto ? `X-CONTACT:${data.contacto}` : '',
                `REV:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
                'END:VCARD'
            ];
            return lines.filter(l => l !== '').join('\r\n');
        }
        
        // ============================================
        // VENTA Y HITOS FINANCIEROS
        // ============================================
        function actualizarVenta() {
            const precioInput = document.getElementById('precioVenta');
            const monedaSelect = document.getElementById('monedaVenta');
            const condicionesText = document.getElementById('condicionesPago');
            if (precioInput) proyecto.precioVenta = parseFloat(precioInput.value) || 0;
            if (monedaSelect) proyecto.monedaVenta = monedaSelect.value;
            if (condicionesText) proyecto.condicionesPago = condicionesText.value;
            document.getElementById('precioVenta2').value = proyecto.precioVenta;
            document.getElementById('monedaVenta2').value = proyecto.monedaVenta;
            document.getElementById('condicionesPago2').value = proyecto.condicionesPago;
            guardarProyecto(); calcularCashflow(); renderizarHitosFinancieros(); renderizarActa();
            mostrarToast(tApp('toast_venta_actualizada'), 'success');
        }
        
        function actualizarVenta2() {
            document.getElementById('precioVenta').value = document.getElementById('precioVenta2').value;
            document.getElementById('monedaVenta').value = document.getElementById('monedaVenta2').value;
            document.getElementById('condicionesPago').value = document.getElementById('condicionesPago2').value;
            actualizarVenta();
        }
        
        // Reemplaza TODA la función renderizarHitosFinancieros con esta versión CORREGIDA
    function renderizarHitosFinancieros() {
        const container = document.getElementById('hitosFinancierosList');
        if (!container) return;
        
        if (!proyecto.hitosFinancieros || proyecto.hitosFinancieros.length === 0) {
            container.innerHTML = '<div style="padding:20px;text-align:center;color:rgba(255,255,255,0.5);">No hay hitos de cobro</div>';
            if(document.getElementById('hitosList2')) document.getElementById('hitosList2').innerHTML = container.innerHTML;
            return;
        }
        
        container.innerHTML = proyecto.hitosFinancieros.map(h => {
            let importe = 0;
            let monedaSimbolo = {EUR:"€",USD:"$",GBP:"£",JPY:"¥",CHF:"₣",BRL:"R$",MXN:"Mex$",COP:"COL$",ARS:"ARS$",CLP:"CLP$",DZD:"دج",CDF:"FC",MZN:"MT",ZAR:"R",NGN:"₦",KES:"KSh",EGP:"E£",MAD:"د.م."}[h.moneda] || h.moneda;
            
            if (h.importeFijo && h.importeFijo > 0) {
                importe = h.importeFijo;
            } else {
                importe = (proyecto.precioVenta * h.porcentaje) / 100;
                // Convertir a la moneda del hito si es diferente
                if (proyecto.monedaVenta !== h.moneda) {
                    importe = convertirMoneda(importe, proyecto.monedaVenta);
                }
            }
            
            //  Indicador del método de pago (con comprobación de existencia)
            let metodoPago = h.metodoPago || 'transferencia';
            let metodoIcono = metodoPago === 'lc' ? ' LC' : ' Transferencia';
            let plazoInfo = '';
            if (metodoPago === 'lc' && h.plazoLC && h.plazoLC > 0) {
                plazoInfo = `<br><span style="font-size:10px; color:#FF8C00;"> Cobro a ${h.plazoLC} días</span>`;
            }
            
            return `<div class="item-card"><div>
                <strong>${escapeHtml(h.nombre)}</strong> <span class="u-fs-10">(${metodoIcono})</span><br>
                 Mes ${h.mes} · ${h.porcentaje}% ·  ${importe.toLocaleString('es-ES', {minimumFractionDigits:2})} ${monedaSimbolo}
                ${h.moneda !== (proyecto.monedaVenta || proyecto.monedaBase) ? `<br><span class="u-fs-10"> Moneda: ${h.moneda}</span>` : ''}
                ${h.condiciones ? `<br><span class="u-fs-10"> ${escapeHtml(h.condiciones)}</span>` : ''}
                ${plazoInfo}
            </div>
            <div><span class="edit-btn" onclick="editarHitoFinanciero(${h.id})"></span><span class="delete-btn" onclick="eliminarHitoFinanciero(${h.id})"></span></div></div>`;
        }).join('');
        
        if(document.getElementById('hitosList2')) {
            document.getElementById('hitosList2').innerHTML = container.innerHTML;
        }
        renderizarActa();
    }
        
        // Reemplaza la función abrirModalHitoFinanciero
function abrirModalHitoFinanciero() {
    const monedaPorDefecto = proyecto.monedaVenta || proyecto.monedaBase || 'EUR';
    const modalHtml = `<div class="modal-content modal-md"><div class="modal-header"><h3> Nuevo Hito de Pago</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
        <div class="form-group"><label>Nombre del hito</label><input type="text" id="hfNombre" placeholder="Ej: Anticipo, Hito 1, Entrega final"></div>
        <div class="form-row">
            <div class="form-group"><label>Mes de cobro (según plan)</label><input type="number" id="hfMes" value="1" min="1" max="36"></div>
            <div class="form-group"><label>Porcentaje (%)</label><input type="number" id="hfPorcentaje" value="30" step="5" min="0" max="100"></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label> Moneda de pago</label>
                <select id="hfMoneda">
                    ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${m === monedaPorDefecto ? 'selected' : ''}>${m} - ${MONEDAS[m]}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label> Importe fijo (opcional)</label>
                <input type="number" id="hfImporteFijo" value="0" placeholder="Dejar 0 para usar porcentaje">
            </div>
        </div>
        <div class="form-group"><label> Condiciones / Observaciones</label>
            <textarea rows="2" id="hfCondiciones" placeholder="Ej: Pago contra factura, 30 días fecha factura..."></textarea>
        </div>
        
        <!-- NUEVOS CAMPOS PARA CARTA DE CRÉDITO -->
        <hr class="u-hr">
        <h4 class="u-fs-13"> MÉTODO DE PAGO Y FINANCIACIÓN</h4>
        <div class="form-row">
            <div class="form-group">
                <label>Método de pago</label>
                <select id="hfMetodoPago" onchange="toggleCamposLC()">
                    <option value="transferencia">Transferencia bancaria</option>
                    <option value="lc">Carta de Crédito (LC)</option>
                </select>
            </div>
            <div class="form-group u-hidden" id="plazoLCGroup">
                <label>Plazo de cobro LC (días)</label>
                <input type="number" id="hfPlazoLC" value="30" step="30" placeholder="30, 60, 90...">
                <small class="u-fs-10">Días después del hito</small>
            </div>
        </div>

        <div id="costesLCGroup" style="display:none; margin-top:12px;">
            <h5 class="u-fs-12"> Costes de la Carta de Crédito</h5>
            <div class="form-row">
                <div class="form-group"><label>Comisión de emisión (%)</label><input type="number" id="hfComisionEmision" value="0.2" step="0.1"></div>
                <div class="form-group"><label>Comisión de confirmación (%)</label><input type="number" id="hfComisionConfirmacion" value="0.3" step="0.1"></div>
                <div class="form-group"><label>Gastos de courier (fijo)</label><input type="number" id="hfGastosCourier" value="150" step="10"></div>
            </div>
            <div class="info-card-modal" style="padding: 8px; margin-top: 8px;">
                <small> Los costes de LC se calcularán como un porcentaje del importe del hito + gastos fijos, y se reflejarán como gasto en el mes del hito.</small>
            </div>
        </div>

        <button class="btn btn-primary" onclick="guardarHitoFinanciero()">Guardar Hito</button>
    </div>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}

function toggleCamposLC() {
    const metodoSelect = document.getElementById('hfMetodoPago');
    if (!metodoSelect) return;
    
    const metodo = metodoSelect.value;
    const plazoGroup = document.getElementById('plazoLCGroup');
    const costesGroup = document.getElementById('costesLCGroup');
    
    if (metodo === 'lc') {
        if (plazoGroup) plazoGroup.style.display = 'block';
        if (costesGroup) costesGroup.style.display = 'block';
    } else {
        if (plazoGroup) plazoGroup.style.display = 'none';
        if (costesGroup) costesGroup.style.display = 'none';
    }
}

// También necesitas la versión de edición
function editarHitoFinanciero(id) {
    let h = proyecto.hitosFinancieros.find(h => h.id === id);
    if(!h) return;
    
    const metodoPago = h.metodoPago || 'transferencia';
    const mostrarLC = metodoPago === 'lc';
    
    const modalHtml = `
        <div class="modal-content modal-md">
            <div class="modal-header">
                <h3> Editar Hito: ${escapeHtml(h.nombre)}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="hfId" value="${h.id}">
            
            <div class="form-group">
                <label>Nombre del hito</label>
                <input type="text" id="hfNombre" class="form-control" value="${escapeHtml(h.nombre)}">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Mes de cobro (según plan)</label>
                    <input type="number" id="hfMes" value="${h.mes}" min="1" max="36">
                </div>
                <div class="form-group">
                    <label>Porcentaje (%)</label>
                    <input type="number" id="hfPorcentaje" value="${h.porcentaje}" step="5" min="0" max="100">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Moneda de pago</label>
                    <select id="hfMoneda">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${h.moneda === m ? 'selected' : ''}>${m} - ${MONEDAS[m]}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label> Importe fijo (opcional)</label>
                    <input type="number" id="hfImporteFijo" value="${h.importeFijo || 0}" placeholder="Dejar 0 para usar porcentaje">
                </div>
            </div>
            
            <div class="form-group">
                <label> Condiciones / Observaciones</label>
                <textarea rows="2" id="hfCondiciones" placeholder="Ej: Pago contra factura, 30 días fecha factura...">${escapeHtml(h.condiciones || '')}</textarea>
            </div>
            
            <!-- NUEVOS CAMPOS PARA CARTA DE CRÉDITO -->
            <hr class="u-hr">
            <h4 class="u-fs-13"> MÉTODO DE PAGO Y FINANCIACIÓN</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Método de pago</label>
                    <select id="hfMetodoPago" onchange="toggleCamposLCEdit()">
                        <option value="transferencia" ${metodoPago === 'transferencia' ? 'selected' : ''}>Transferencia bancaria</option>
                        <option value="lc" ${metodoPago === 'lc' ? 'selected' : ''}>Carta de Crédito (LC)</option>
                    </select>
                </div>
                <div class="form-group" id="plazoLCGroupEdit" style="display: ${mostrarLC ? 'block' : 'none'};">
                    <label>Plazo de cobro LC (días)</label>
                    <input type="number" id="hfPlazoLC" value="${h.plazoLC || 30}" step="30" placeholder="30, 60, 90...">
                    <small class="u-fs-10">Días después del hito</small>
                </div>
            </div>
            
            <div id="costesLCGroupEdit" style="display: ${mostrarLC ? 'block' : 'none'}; margin-top:12px;">
                <h5 class="u-fs-12"> Costes de la Carta de Crédito</h5>
                <div class="form-row">
                    <div class="form-group">
                        <label>Comisión de emisión (%)</label>
                        <input type="number" id="hfComisionEmision" value="${h.comisionEmision || 0.2}" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Comisión de confirmación (%)</label>
                        <input type="number" id="hfComisionConfirmacion" value="${h.comisionConfirmacion || 0.3}" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Gastos de courier (fijo)</label>
                        <input type="number" id="hfGastosCourier" value="${h.gastosCourier || 150}" step="10">
                    </div>
                </div>
                <div class="info-card-modal" style="padding: 8px; margin-top: 8px;">
                    <small> Los costes de LC se calcularán como un porcentaje del importe del hito + gastos fijos, y se reflejarán como gasto en el mes del hito.</small>
                </div>
            </div>
            
            <div class="u-flex-gap-12 u-mt-20">
                <button class="btn btn-secondary u-flex-1" onclick="cerrarModalGeneric()">Cancelar</button>
                <button class="btn btn-primary u-flex-1" onclick="guardarHitoFinanciero()">Guardar Cambios</button>
            </div>
        </div>
    `;
    
    // Crear el modal
    const modalDiv = document.createElement('div');
    modalDiv.id = 'editHitoModal';
    modalDiv.className = 'modal';
    modalDiv.style.display = 'flex';
    modalDiv.innerHTML = modalHtml;
    document.body.appendChild(modalDiv);
    
    // Cerrar al hacer clic fuera del contenido
    modalDiv.onclick = (e) => {
        if (e.target === modalDiv) {
            modalDiv.remove();
        }
    };
}

function toggleCamposLCEdit() {
    const metodoSelect = document.getElementById('hfMetodoPago');
    if (!metodoSelect) return;
    
    const metodo = metodoSelect.value;
    const plazoGroup = document.getElementById('plazoLCGroupEdit');
    const costesGroup = document.getElementById('costesLCGroupEdit');
    
    if (metodo === 'lc') {
        if (plazoGroup) plazoGroup.style.display = 'block';
        if (costesGroup) costesGroup.style.display = 'block';
    } else {
        if (plazoGroup) plazoGroup.style.display = 'none';
        if (costesGroup) costesGroup.style.display = 'none';
    }
}
        
        function abrirModalHitoFinanciero2() { abrirModalHitoFinanciero(); }
        

// ============================================
// GUARDAR HITO FINANCIERO - FUNCIÓN FALTANTE
// ============================================

// Reemplaza la función guardarHitoFinanciero
function guardarHitoFinanciero() {
    let nombre = document.getElementById('hfNombre').value.trim();
    if (!nombre) { 
        mostrarToast(tApp('toast_nombre_obligatorio'), 'error'); 
        return; 
    }
    
    let id = document.getElementById('hfId')?.value;
    let mes = parseInt(document.getElementById('hfMes').value);
    let porcentaje = parseFloat(document.getElementById('hfPorcentaje').value);
    let metodoPago = document.getElementById('hfMetodoPago').value;
    
    if (isNaN(mes) || mes < 1) {
        mostrarToast(" El mes debe ser un número positivo (mínimo 1)", 'error');
        return;
    }
    
    if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
        mostrarToast(" El porcentaje debe estar entre 0 y 100", 'error');
        return;
    }
    
    let nuevoHito = { 
        id: id ? parseInt(id) : Date.now(), 
        nombre: nombre, 
        mes: mes, 
        porcentaje: porcentaje,
        moneda: document.getElementById('hfMoneda').value,
        importeFijo: parseFloat(document.getElementById('hfImporteFijo').value) || 0,
        condiciones: document.getElementById('hfCondiciones').value || '',
        metodoPago: metodoPago,
        plazoLC: metodoPago === 'lc' ? parseInt(document.getElementById('hfPlazoLC').value) : 0,
        comisionEmision: metodoPago === 'lc' ? parseFloat(document.getElementById('hfComisionEmision').value) : 0,
        comisionConfirmacion: metodoPago === 'lc' ? parseFloat(document.getElementById('hfComisionConfirmacion').value) : 0,
        gastosCourier: metodoPago === 'lc' ? parseFloat(document.getElementById('hfGastosCourier').value) : 0
    };
    
    if (!proyecto.hitosFinancieros) proyecto.hitosFinancieros = [];
    
    if (id) { 
        let idx = proyecto.hitosFinancieros.findIndex(h => h.id === parseInt(id)); 
        if (idx >= 0) proyecto.hitosFinancieros[idx] = nuevoHito; 
    } else { 
        proyecto.hitosFinancieros.push(nuevoHito); 
    }
    
    guardarProyecto(); 
    renderizarHitosFinancieros(); 
    calcularCashflow(); 
    cerrarModalGeneric(); 
    mostrarToast(` Hito "${nombre}" guardado`, 'success');
}
        



        
function eliminarHitoFinanciero(id) {
            if (confirm(tApp('confirmar_eliminar'))) { proyecto.hitosFinancieros = proyecto.hitosFinancieros.filter(h => h.id !== id); guardarProyecto(); renderizarHitosFinancieros(); calcularCashflow(); renderizarActa(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
// ============================================
// FUNCIÓN CALCULAR CASHFLOW
// ============================================

// Reemplaza la función calcularCashflow completa
function calcularCashflow() {
    // ============================================
    // 1. CALCULAR DURACIÓN REAL DEL PROYECTO
    // ============================================
    let maxMes = 12;
    let meses = [];
    
    // Hitos financieros
    (proyecto.hitosFinancieros || []).forEach(h => {
        if (h.mes) meses.push(h.mes);
        if (h.metodoPago === 'lc' && h.plazoLC) {
            const mesCobroReal = h.mes + Math.ceil(h.plazoLC / 30);
            meses.push(mesCobroReal);
        }
    });
    
    // Materiales
    (proyecto.materiales || []).forEach(m => { 
        if (m.mes) meses.push(m.mes);
        // También considerar meses de pagos diferidos de materiales
        if (m.condicionesPago) {
            const cp = m.condicionesPago;
            if (cp.tipo === 'porcentajes' && cp.tramos) {
                cp.tramos.forEach(t => { if (t.mes) meses.push(t.mes); });
            } else if (cp.tipo === 'plazo' && m.mes) {
                const mesesPlazo = Math.ceil(cp.plazoDias / 30);
                meses.push(m.mes + mesesPlazo);
            } else if (cp.tipo === 'mixto' && m.mes) {
                const mesesPlazo = Math.ceil(cp.plazoResto / 30);
                meses.push(m.mes + mesesPlazo);
            }
        }
    });
    
    (proyecto.servicios || []).forEach(s => { if (s.mes) meses.push(s.mes); });
    (proyecto.viajes || []).forEach(v => { if (v.mes) meses.push(v.mes); });
    
    if (meses.length > 0) {
        const mesMaximo = Math.max(...meses);
        maxMes = Math.max(12, mesMaximo);
    }
    
    if (proyecto.garantia && proyecto.garantia.afectaHitoFinal && proyecto.garantia.hitoFinalId) {
        const hitoGarantia = (proyecto.hitosFinancieros || []).find(h => h.id === proyecto.garantia.hitoFinalId);
        if (hitoGarantia && hitoGarantia.mes && hitoGarantia.mes > maxMes) {
            maxMes = hitoGarantia.mes;
        }
    }
    
    maxMes = Math.min(maxMes, 60);
    
    let gastos = new Array(maxMes).fill(0);
    let ingresos = new Array(maxMes).fill(0);
    let gastosLC = new Array(maxMes).fill(0);
    
    // ============================================
    // GASTOS DE RECURSOS (desde tareas del Gantt)
    // ============================================
    (proyecto.elementosGantt || []).forEach(tarea => {
        if (tarea.recursoAsignado && tarea.tipo !== 'hito' && tarea.inicio) {
            let costeTarea = tarea.costeReal > 0 ? tarea.costeReal : (tarea.costeEstimado || 0);
            if (costeTarea > 0) {
                const fechaInicio = new Date(tarea.inicio);
                const mesInicio = (fechaInicio.getFullYear() - new Date(proyecto.fechaInicio || fechaInicio).getFullYear()) * 12 + fechaInicio.getMonth();
                const idx = Math.min(maxMes - 1, Math.max(0, mesInicio));
                if (idx >= 0 && idx < maxMes) {
                    gastos[idx] += convertirMoneda(costeTarea, tarea.recursoAsignado.moneda || proyecto.monedaBase);
                }
            }
        }
    });
    
    // ============================================
    // GASTOS DE MATERIALES CON CONDICIONES DE PAGO
    // ============================================
    (proyecto.materiales || []).forEach(m => {
        const costeTotalMaterial = convertirMoneda(m.cantidad * m.costeUnitario + (m.costeEnvio || 0), m.moneda);
        const condiciones = m.condicionesPago;
        
        if (!condiciones || condiciones.tipo === 'contado') {
            // Pago de contado en el mes del material
            let mes = (m.mes || 1) - 1;
            if (mes >= 0 && mes < maxMes) gastos[mes] += costeTotalMaterial;
        } 
        else if (condiciones.tipo === 'porcentajes' && condiciones.tramos) {
            // Distribuir por porcentajes
            let sumaPorcentajes = 0;
            condiciones.tramos.forEach(tramo => {
                sumaPorcentajes += tramo.porcentaje;
                let importe = costeTotalMaterial * (tramo.porcentaje / 100);
                let mes = (tramo.mes || 1) - 1;
                if (mes >= 0 && mes < maxMes) {
                    gastos[mes] += importe;
                    console.log(` Material "${m.nombre}": ${tramo.porcentaje}% (${formatearMoneda(importe)}) en mes ${tramo.mes}`);
                }
            });
            if (Math.abs(sumaPorcentajes - 100) > 0.1) {
                console.warn(` Material "${m.nombre}": La suma de porcentajes es ${sumaPorcentajes}% (debe ser 100%)`);
            }
        }
        else if (condiciones.tipo === 'plazo') {
            // Pago a plazo después de la compra/recepción
            let mesBase = (m.mes || 1) - 1;
            let mesesPlazo = Math.ceil(condiciones.plazoDias / 30);
            let mesPago = mesBase + mesesPlazo;
            
            if (mesPago >= 0 && mesPago < maxMes) {
                gastos[mesPago] += costeTotalMaterial;
                console.log(` Material "${m.nombre}": Pago total ${formatearMoneda(costeTotalMaterial)} en mes ${mesPago + 1} (plazo ${condiciones.plazoDias} días)`);
            } else if (mesPago >= maxMes) {
                // Extender el array si es necesario
                for (let i = maxMes; i <= mesPago; i++) {
                    if (gastos[i] === undefined) gastos[i] = 0;
                }
                maxMes = mesPago + 1;
                gastos[mesPago] = (gastos[mesPago] || 0) + costeTotalMaterial;
            }
        }
        else if (condiciones.tipo === 'mixto') {
            // Porcentaje inicial ahora, resto a plazo
            let importeInicial = costeTotalMaterial * (condiciones.porcentajeInicial / 100);
            let importeResto = costeTotalMaterial - importeInicial;
            let mesBase = (m.mes || 1) - 1;
            let mesesPlazo = Math.ceil(condiciones.plazoResto / 30);
            
            // Pago inicial
            if (mesBase >= 0 && mesBase < maxMes) {
                gastos[mesBase] += importeInicial;
                console.log(` Material "${m.nombre}": ${condiciones.porcentajeInicial}% inicial (${formatearMoneda(importeInicial)}) en mes ${m.mes}`);
            }
            
            // Pago del resto
            let mesResto = mesBase + mesesPlazo;
            if (mesResto >= 0 && mesResto < maxMes) {
                gastos[mesResto] += importeResto;
                console.log(` Material "${m.nombre}": Resto ${100 - condiciones.porcentajeInicial}% (${formatearMoneda(importeResto)}) en mes ${mesResto + 1}`);
            } else if (mesResto >= maxMes) {
                for (let i = maxMes; i <= mesResto; i++) {
                    if (gastos[i] === undefined) gastos[i] = 0;
                }
                maxMes = mesResto + 1;
                gastos[mesResto] = (gastos[mesResto] || 0) + importeResto;
            }
        }
    });
    
    // ============================================
    // GASTOS DE SERVICIOS
    // ============================================
    (proyecto.servicios || []).forEach(s => {
        let total = s.cantidad * s.costeUnitario * (1 + (s.impuesto || 0) / 100);
        total = convertirMoneda(total, s.moneda);
        let mes = (s.mes || 1) - 1;
        if (mes >= 0 && mes < maxMes) gastos[mes] += total;
    });

    // ============================================
    // GASTOS DE VIAJES
    // ============================================
    (proyecto.viajes || []).forEach(v => {
        let totalViaje = convertirMoneda((v.costeVuelos || 0) + (v.costeHotel || 0) + (v.costeComidas || 0) + (v.costeTraslados || 0), v.moneda);
        let mes = (v.mes || 1) - 1;
        if (mes >= 0 && mes < maxMes) gastos[mes] += totalViaje;
    });

    // ============================================
    // GASTOS DE SPRINTS (MODO ÁGIL)
    // ============================================
    const metodologia = proyecto?.metodologia?.tipo || 'cascada';
    const esAgile = (metodologia === 'agile' || metodologia === 'mixto');
    
    if (esAgile && proyecto.scrum && proyecto.scrum.sprints) {
        console.log(" Procesando costes de sprints para Cashflow...");
        
        let fechaInicioProyecto = proyecto.fechaInicio ? new Date(proyecto.fechaInicio) : new Date();
        
        proyecto.scrum.sprints.forEach(sprint => {
            let mesSprint = 1;
            if (sprint.fechaInicio) {
                const fechaInicioSprint = new Date(sprint.fechaInicio);
                const diffMeses = (fechaInicioSprint.getFullYear() - fechaInicioProyecto.getFullYear()) * 12 + 
                                  (fechaInicioSprint.getMonth() - fechaInicioProyecto.getMonth());
                mesSprint = Math.max(1, diffMeses + 1);
            }
            
            const idx = mesSprint - 1;
            
            let costeSprint = 0;
            if (sprint.costes) {
                costeSprint = sprint.costes.real || 0;
            } else {
                const historiasSprint = (proyecto.scrum.historias || []).filter(h => h.sprintId === sprint.id);
                historiasSprint.forEach(historia => {
                    if (historia.estado === 'done' && historia.recursoAsignado) {
                        const dias = historia.diasReales || historia.diasEstimados || 5;
                        const horasPorDia = historia.horasPorDia || 8;
                        const horasTotales = dias * horasPorDia;
                        costeSprint += horasTotales * historia.recursoAsignado.costeHora;
                    }
                });
            }
            
            if (idx >= 0 && idx < maxMes && costeSprint > 0) {
                gastos[idx] += convertirMoneda(costeSprint, proyecto.monedaBase);
            }
        });
    }
    
    // ============================================
    // GASTOS DE AVALES Y GARANTÍAS
    // ============================================
    (proyecto.avales || []).forEach((aval) => {
        const estadoIgnorar = ['Cancelado', 'Vencido'];
        if (estadoIgnorar.includes(aval.estado)) return;
        
        let costes = aval.costesCalculados || { apertura: 0, riesgoTotal: 0, notaria: 0, otros: 0 };
        
        let mesEmision = 1;
        if (aval.fechaEmision && proyecto.fechaInicio) {
            try {
                const fechaInicioProyecto = new Date(proyecto.fechaInicio);
                const fechaEmision = new Date(aval.fechaEmision);
                if (!isNaN(fechaInicioProyecto.getTime()) && !isNaN(fechaEmision.getTime())) {
                    const diffMeses = (fechaEmision.getFullYear() - fechaInicioProyecto.getFullYear()) * 12 + 
                                      (fechaEmision.getMonth() - fechaInicioProyecto.getMonth());
                    mesEmision = Math.max(1, diffMeses + 1);
                }
            } catch(e) {}
        }
        
        const idxEmision = mesEmision - 1;
        const costesUnicos = (costes.apertura || 0) + (costes.notaria || 0) + (costes.otros || 0);
        
        if (idxEmision >= 0 && idxEmision < maxMes && costesUnicos > 0) {
            gastos[idxEmision] += costesUnicos;
        }
        
        if (costes.riesgoTotal > 0) {
            let mesesVigencia = aval.mesesVigencia || 12;
            if (aval.fechaEmision && aval.fechaVencimiento) {
                try {
                    const fechaEmision = new Date(aval.fechaEmision);
                    const fechaVencimiento = new Date(aval.fechaVencimiento);
                    if (!isNaN(fechaEmision.getTime()) && !isNaN(fechaVencimiento.getTime())) {
                        const diffDias = (fechaVencimiento - fechaEmision) / (1000 * 60 * 60 * 24);
                        mesesVigencia = Math.max(1, Math.ceil(diffDias / 30.44));
                    }
                } catch(e) {}
            }
            
            const trimestres = Math.ceil(mesesVigencia / 3);
            const costePorTrimestre = costes.riesgoTotal / trimestres;
            
            for (let t = 0; t < trimestres; t++) {
                const mesTrimestre = mesEmision + (t * 3);
                const idxTrimestre = mesTrimestre - 1;
                if (idxTrimestre >= 0 && idxTrimestre < maxMes) {
                    gastos[idxTrimestre] += costePorTrimestre;
                }
            }
        }
    });
    
    // ============================================
    // PROCESAR INGRESOS Y GASTOS DE CARTA DE CRÉDITO
    // ============================================
    (proyecto.hitosFinancieros || []).forEach(h => {
        let importeBruto = 0;
        if (h.importeFijo && h.importeFijo > 0) {
            importeBruto = h.importeFijo;
        } else {
            importeBruto = (proyecto.precioVenta * (h.porcentaje || 0)) / 100;
        }
        let monedaHito = h.moneda || proyecto.monedaVenta || proyecto.monedaBase;
        let importeEnMonedaBase = convertirMoneda(importeBruto, monedaHito);
        
        if (proyecto.garantia && proyecto.garantia.afectaHitoFinal && proyecto.garantia.hitoFinalId === h.id) {
            let idx = maxMes - 1;
            ingresos[idx] += importeEnMonedaBase;
            return;
        }
        
        let mesHito = (h.mes || 1) - 1;
        let mesCobro = mesHito;
        
        if (h.metodoPago === 'lc') {
            const comisionEmision = importeEnMonedaBase * ((h.comisionEmision || 0) / 100);
            const comisionConfirmacion = importeEnMonedaBase * ((h.comisionConfirmacion || 0) / 100);
            const gastosCourierConv = convertirMoneda(h.gastosCourier || 0, proyecto.monedaBase);
            const costesLCTotal = comisionEmision + comisionConfirmacion + gastosCourierConv;
            
            if (mesHito >= 0 && mesHito < maxMes && costesLCTotal > 0) {
                gastos[mesHito] += costesLCTotal;
                gastosLC[mesHito] = costesLCTotal;
            }
            
            if (h.plazoLC && h.plazoLC > 0) {
                const mesesPlazo = Math.ceil(h.plazoLC / 30);
                mesCobro = mesHito + mesesPlazo;
                
                if (mesCobro >= maxMes) {
                    maxMes = mesCobro + 1;
                    gastos.length = maxMes;
                    ingresos.length = maxMes;
                    for (let i = 0; i < maxMes; i++) {
                        if (gastos[i] === undefined) gastos[i] = 0;
                        if (ingresos[i] === undefined) ingresos[i] = 0;
                    }
                }
            }
        }
        
        if (mesCobro >= 0 && mesCobro < maxMes) {
            ingresos[mesCobro] += importeEnMonedaBase;
        }
    });
    
    // ============================================
    // 3. GENERAR HTML DEL CASHFLOW Y GRÁFICOS
    // ============================================
    let html = '', totalIng = 0, totalGas = 0, saldo = 0, minSaldo = 0;
    let labels = [], ingData = [], gasData = [], salData = [];
    
    for (let i = 0; i < maxMes; i++) {
        let ing = ingresos[i] || 0, gas = gastos[i] || 0, neto = ing - gas;
        saldo += neto; 
        totalIng += ing; 
        totalGas += gas;
        if (saldo < minSaldo) minSaldo = saldo;
        
        let year = Math.floor(i / 12);
        let month = (i % 12) + 1;
        let label = year === 0 ? `Mes ${month}` : `Año ${year+1} - Mes ${month}`;
        
        let tooltipLC = '';
        if (gastosLC[i] > 0) {
            tooltipLC = `<span style="font-size:10px; color:#FF8C00;"> (incluye ${formatearMoneda(gastosLC[i])} de costes LC)</span>`;
        }
        
        html += `<tr>
            <td class="bold">${label}${tooltipLC}</td>
            <td>${formatearMoneda(ing)}</td>
            <td>${formatearMoneda(gas)}</td>
            <td class="${neto >= 0 ? 'cashflow-positive' : 'cashflow-negative'}">${formatearMoneda(neto)}</td>
            <td class="${saldo >= 0 ? 'cashflow-positive' : 'cashflow-negative'}">${formatearMoneda(saldo)}</td>
        </tr>`;
        
        labels.push(label); 
        ingData.push(ing); 
        gasData.push(gas); 
        salData.push(saldo);
    }
    
    document.getElementById('cashflowBody').innerHTML = html;
    document.getElementById('totalIngresosFoot').innerHTML = formatearMoneda(totalIng);
    document.getElementById('totalGastosFoot').innerHTML = formatearMoneda(totalGas);
    document.getElementById('totalNetoFoot').innerHTML = formatearMoneda(totalIng - totalGas);
const elCosteCompl = document.getElementById('totalCoste');
        if (elCosteCompl) elCosteCompl.innerHTML = formatearMoneda(totalGas);
        const elIngresoCompl = document.getElementById('totalIngreso');
        if (elIngresoCompl) elIngresoCompl.innerHTML = formatearMoneda(totalIng);
        const elBeneficioCompl = document.getElementById('totalBeneficio');
        if (elBeneficioCompl) elBeneficioCompl.innerHTML = formatearMoneda(totalIng - totalGas);
        const elFinanCompl = document.getElementById('necesidadFinanciacion');
        if (elFinanCompl) elFinanCompl.innerHTML = formatearMoneda(minSaldo < 0 ? Math.abs(minSaldo) : 0);
    
    const duracionSpan = document.getElementById('duracionProyectoMeses');
    if (duracionSpan) duracionSpan.value = maxMes;
    
    // GRÁFICOS
    // GRÁFICOS
    // GRÁFICOS - CON DETECCIÓN DE TEMA CLARO/OSCURO
    const ctx = document.getElementById('cashflowChart')?.getContext('2d');
    if (ctx) { 
        if(cashflowChart) cashflowChart.destroy(); 
        
        // Detectar tema actual
        const isDarkTheme = document.documentElement.getAttribute('data-theme') !== 'light';
        const textColor = isDarkTheme ? 'white' : '#1a1a2e';
        const gridColor = isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        
        cashflowChart = new Chart(ctx, { 
            type: 'line', 
            data: { 
                labels, 
                datasets: [
                    { label: 'Ingresos', data: ingData, borderColor: '#00A859', backgroundColor: 'rgba(0,168,89,0.1)', fill: true, tension: 0.3 },
                    { label: 'Gastos', data: gasData, borderColor: '#FF5F57', backgroundColor: 'rgba(255,95,87,0.1)', fill: true, tension: 0.3 },
                    { label: 'Saldo Acumulado', data: salData, borderColor: '#007AFF', borderDash: [5,5], tension: 0.3, yAxisID: 'y', fill: false }
                ] 
            }, 
            options: { 
                responsive: true, 
                maintainAspectRatio: true,
                plugins: {
                    tooltip: { 
                        callbacks: { 
                            label: (context) => `${context.dataset.label}: ${formatearMoneda(context.raw)}` 
                        } 
                    },
                    legend: { 
                        labels: { color: textColor, font: { size: 11 } }
                    }
                },
                scales: { 
                    y: { 
                        ticks: { color: textColor, callback: (v) => formatearMoneda(v) },
                        title: { display: true, text: 'Importe (€)', color: textColor },
                        grid: { color: gridColor }
                    }, 
                    x: { 
                        ticks: { color: textColor, maxRotation: 45, minRotation: 45 },
                        title: { display: true, text: 'Período', color: textColor },
                        grid: { color: gridColor }
                    } 
                } 
            } 
        }); 
    }
    
    const dashCtx = document.getElementById('dashboardChart')?.getContext('2d');
    if (dashCtx) { 
        if(dashboardChart) dashboardChart.destroy(); 
        
        // Detectar tema actual
        const isDarkTheme = document.documentElement.getAttribute('data-theme') !== 'light';
        const textColor = isDarkTheme ? 'white' : '#1a1a2e';
        const gridColor = isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        
        dashboardChart = new Chart(dashCtx, { 
            type: 'bar', 
            data: { 
                labels, 
                datasets: [
                    { label: 'Ingresos', data: ingData, backgroundColor: '#00A859', borderRadius: 6 },
                    { label: 'Gastos', data: gasData, backgroundColor: '#FF5F57', borderRadius: 6 }
                ] 
            }, 
            options: { 
                responsive: true, 
                maintainAspectRatio: true,
                plugins: {
                    tooltip: { 
                        callbacks: { 
                            label: (context) => `${context.dataset.label}: ${formatearMoneda(context.raw)}` 
                        } 
                    },
                    legend: { 
                        labels: { color: textColor, font: { size: 11 } }
                    }
                },
                scales: { 
                    y: { 
                        ticks: { color: textColor, callback: (v) => formatearMoneda(v) },
                        title: { display: true, text: 'Importe (€)', color: textColor },
                        grid: { color: gridColor }
                    }, 
                    x: { 
                        ticks: { color: textColor, maxRotation: 45, minRotation: 45 },
                        title: { display: true, text: 'Período', color: textColor },
                        grid: { color: gridColor }
                    } 
                } 
            } 
        }); 
    }
    
    document.getElementById('dashboardStats').innerHTML = `
        <tr><th>Stakeholders</th><td>${proyecto.stakeholders?.length || 0}</td></tr>
        <tr><th>Procesos</th><td>${proyecto.procesos?.filter(p => p.completado).length || 0}/49</td></tr>
        <tr><th>Equipo</th><td>${proyecto.equipo?.length || 0}</td></tr>
        <tr><th>Materiales</th><td>${proyecto.materiales?.length || 0}</td></tr>
        <tr><th>Riesgos</th><td>${proyecto.riesgos?.length || 0}</td></tr>
        <tr><th>Hitos Financieros</th><td>${proyecto.hitosFinancieros?.length || 0}</td></tr>
        <tr><th>Duración (meses)</th><td>${maxMes}</td></tr>
    `;
    // Guardar costes totales para que el dashboard los use
proyecto.costeTotalCashflow = totalGas;
proyecto.ingresoTotalCashflow = totalIng;
proyecto.beneficioTotalCashflow = totalIng - totalGas;

// También guardar en resumenFinanciero
if (!proyecto.resumenFinanciero) proyecto.resumenFinanciero = {};
proyecto.resumenFinanciero.costeTotal = totalGas;
proyecto.resumenFinanciero.ingresoTotal = totalIng;
proyecto.resumenFinanciero.beneficioTotal = totalIng - totalGas;
proyecto.resumenFinanciero.fechaActualizacion = new Date().toISOString();

guardarProyecto(); // Asegurar que se guarda
}



        // ============================================
        // STAKEHOLDERS
        // ============================================
        function renderizarStakeholders() {
            const container = document.getElementById('stakeholdersContent');
            if (!proyecto.stakeholders || proyecto.stakeholders.length === 0) {
                container.innerHTML = '<div class="info-card">No hay stakeholders registrados</div>';
                return;
            }
            
            const altaPoderAltoInteres = proyecto.stakeholders.filter(s => s.poder >= 3 && s.interes >= 3);
            const altaPoderBajoInteres = proyecto.stakeholders.filter(s => s.poder >= 3 && s.interes < 3);
            const bajoPoderAltoInteres = proyecto.stakeholders.filter(s => s.poder < 3 && s.interes >= 3);
            const bajoPoderBajoInteres = proyecto.stakeholders.filter(s => s.poder < 3 && s.interes < 3);
            
            container.innerHTML = `
                <div class="matrix-container">
                    <div class="matrix-quadrant"><div class="quadrant-header high-power">Alto Poder / Alto Interés<br> Gestionar Cerca</div><div class="quadrant-content">${altaPoderAltoInteres.map(s => `<div class="stakeholder-card"><strong>${escapeHtml(s.nombre)}</strong><br>${escapeHtml(s.rol || '')}</div>`).join('') || '<div class="u-color-muted">-</div>'}</div></div>
                    <div class="matrix-quadrant"><div class="quadrant-header low-power">Alto Poder / Bajo Interés<br> Mantener Satisfecho</div><div class="quadrant-content">${altaPoderBajoInteres.map(s => `<div class="stakeholder-card"><strong>${escapeHtml(s.nombre)}</strong><br>${escapeHtml(s.rol || '')}</div>`).join('') || '<div class="u-color-muted">-</div>'}</div></div>
                    <div class="matrix-quadrant"><div class="quadrant-header high-power">Bajo Poder / Alto Interés<br> Mantener Informado</div><div class="quadrant-content">${bajoPoderAltoInteres.map(s => `<div class="stakeholder-card"><strong>${escapeHtml(s.nombre)}</strong><br>${escapeHtml(s.rol || '')}</div>`).join('') || '<div class="u-color-muted">-</div>'}</div></div>
                    <div class="matrix-quadrant"><div class="quadrant-header low-power">Bajo Poder / Bajo Interés<br> Monitorear</div><div class="quadrant-content">${bajoPoderBajoInteres.map(s => `<div class="stakeholder-card"><strong>${escapeHtml(s.nombre)}</strong><br>${escapeHtml(s.rol || '')}</div>`).join('') || '<div class="u-color-muted">-</div>'}</div></div>
                </div>
                <table class="data-table"><thead><tr><th>Nombre</th><th>Rol</th><th>Poder</th><th>Interés</th><th>Expectativas</th><th>Acciones</th></tr></thead><tbody>
                    ${proyecto.stakeholders.map(s => `
                        <tr>
                            <td>${escapeHtml(s.nombre)}</td>
                            <td>${escapeHtml(s.rol || '-')}</td>
                            <td>${s.poder || 0}/5</td>
                            <td>${s.interes || 0}/5</td>
                            <td>${escapeHtml(s.expectativas || '-')}</td>
                            <td><span class="edit-btn" onclick="editarStakeholder(${s.id})"></span><span class="delete-btn" onclick="eliminarStakeholder(${s.id})"></span></td>
                        </tr>
                    `).join('')}
                </tbody></table>
            `;
        }
        
        function abrirModalStakeholder() {
    // Crear modal con inputs editables y forzar z-index/focus
    const modalHtml = `
      <div class="modal-content modal-sm" role="dialog" aria-modal="true" aria-label="Añadir stakeholder">
        <div class="modal-header">
          <h3> ${tApp('stakeholders_nuevo') || 'Añadir stakeholder'}</h3>
          <span class="close-modal" onclick="cerrarModalGeneric()" aria-label="Cerrar">&times;</span>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="stkNombre">Nombre</label>
            <input id="stkNombre" type="text" class="u-w-full" autocomplete="off" />
          </div>
          <div class="form-group">
            <label for="stkRol">Rol</label>
            <input id="stkRol" type="text" class="u-w-full" />
          </div>
          <div class="form-row">
            <div class="form-group u-flex-1">
              <label for="stkPoder">Poder</label>
              <select id="stkPoder" class="select-full">
                <option value="Alto">Alto</option>
                <option value="Medio">Medio</option>
                <option value="Bajo">Bajo</option>
              </select>
            </div>
            <div class="form-group u-flex-1">
              <label for="stkInteres">Interés</label>
              <select id="stkInteres" class="select-full">
                <option value="Alto">Alto</option>
                <option value="Medio">Medio</option>
                <option value="Bajo">Bajo</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="stkExpectativas">Expectativas</label>
            <textarea id="stkExpectativas" rows="3"></textarea>
          </div>
          <div class="u-action-row">
            <button class="btn btn-primary" onclick="guardarStakeholder()"> Guardar</button>
            <button class="btn btn-secondary" onclick="cerrarModalGeneric()"> Cancelar</button>
          </div>
        </div>
      </div>
    `;

    // Remover modal previo si existe
    const existing = document.getElementById('genericModal');
    if (existing) existing.remove();

    // Insertar en body (evita overlays dentro de paneles)
    const modalDiv = document.createElement('div');
    modalDiv.id = 'genericModal';
    modalDiv.className = 'modal';
    modalDiv.style.display = 'flex';
    modalDiv.style.zIndex = '20000'; // forzar por encima de overlays
    modalDiv.innerHTML = modalHtml;
    document.body.appendChild(modalDiv);

    // Cerrar al pulsar fuera del contenido
    modalDiv.addEventListener('click', (e) => { if (e.target === modalDiv) cerrarModalGeneric(); });

    // Forzar focus en primer input
    setTimeout(() => {
      const first = document.getElementById('stkNombre');
      if (first) {
        first.focus();
        first.select && first.select();
      }
    }, 50);
}

// Implementación mínima para guardar (evita inputs deshabilitados)
function guardarStakeholder() {
    const nombre = document.getElementById('stkNombre')?.value?.trim();
    if (!nombre) { mostrarToast(' El nombre es obligatorio', 'error'); return; }

    if (!proyecto) proyecto = {};
    if (!proyecto.stakeholders) proyecto.stakeholders = [];

    const nuevo = {
      id: Date.now(),
      nombre,
      rol: document.getElementById('stkRol')?.value || '',
      poder: document.getElementById('stkPoder')?.value || '',
      interes: document.getElementById('stkInteres')?.value || '',
      expectativas: document.getElementById('stkExpectativas')?.value || ''
    };

    proyecto.stakeholders.push(nuevo);
    guardarProyecto && guardarProyecto();
    renderizarStakeholders && renderizarStakeholders();
    cerrarModalGeneric();
    mostrarToast(` Stakeholder "${nombre}" añadido`, 'success');
}
        
        
        function editarStakeholder(id) {
            let s = proyecto.stakeholders.find(s => s.id === id);
            if (!s) return;
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Editar</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="stakeId" value="${s.id}">
                <div class="form-group"><label>Nombre</label><input type="text" id="stakeNombre" value="${escapeHtml(s.nombre)}"></div>
                <div class="form-group"><label>Rol</label><input type="text" id="stakeRol" value="${escapeHtml(s.rol || '')}"></div>
                <div class="form-row"><div class="form-group"><label>Poder</label><input type="range" id="stakePoder" min="1" max="5" value="${s.poder}" oninput="document.getElementById('poderVal').innerText=this.value"><span id="poderVal">${s.poder}</span></div>
                <div class="form-group"><label>Interés</label><input type="range" id="stakeInteres" min="1" max="5" value="${s.interes}" oninput="document.getElementById('interesVal').innerText=this.value"><span id="interesVal">${s.interes}</span></div></div>
                <div class="form-group"><label>Expectativas</label><textarea rows="2" id="stakeExpectativas">${escapeHtml(s.expectativas || '')}</textarea></div>
                <button class="btn btn-primary" onclick="actualizarStakeholder()">Actualizar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function actualizarStakeholder() {
            let id = parseInt(document.getElementById('stakeId').value);
            let idx = proyecto.stakeholders.findIndex(s => s.id === id);
            if (idx >= 0) {
                proyecto.stakeholders[idx] = {
                    id: id,
                    nombre: document.getElementById('stakeNombre').value,
                    rol: document.getElementById('stakeRol').value,
                    poder: parseInt(document.getElementById('stakePoder').value),
                    interes: parseInt(document.getElementById('stakeInteres').value),
                    expectativas: document.getElementById('stakeExpectativas').value
                };
                guardarProyecto();
                renderizarStakeholders();
                renderizarRACI();
                cerrarModalGeneric();
                mostrarToast(tApp('toast_stakeholder_actualizado'), 'success');
            }
        }
        
       
        
        // ============================================
        // MATRIZ RACI
        // ============================================
        function renderizarRACI() {
            const container = document.getElementById('raciContent');
            if (!proyecto.stakeholders || proyecto.stakeholders.length === 0) {
                container.innerHTML = '<div class="info-card">No hay stakeholders registrados. Agrega stakeholders primero.</div>';
                return;
            }
            
            const actividades = ['Acta Constitución', 'Planificación', 'Ejecución', 'Monitoreo', 'Cierre', 'Aprobaciones', 'Comunicaciones', 'Riesgos'];
            if (!proyecto.raci) proyecto.raci = [];
            
            let html = '<div class="raci-table"><table class="data-table"><thead><tr><th>Actividad</th>';
            proyecto.stakeholders.forEach(s => html += `<th>${escapeHtml(s.nombre.substring(0,15))}</th>`);
            html += '</tr></thead><tbody>';
            
            actividades.forEach(act => {
                html += `<tr><td><strong>${act}</strong></td>`;
                proyecto.stakeholders.forEach(s => {
                    let valor = (proyecto.raci || []).find(r => r.actividad === act && r.stakeholderId === s.id)?.rol || '';
                    html += `<td><select class="raci-select" onchange="guardarRACI('${act}', ${s.id}, this.value)"><option value="">-</option><option value="R" ${valor === 'R' ? 'selected' : ''}>R</option><option value="A" ${valor === 'A' ? 'selected' : ''}>A</option><option value="C" ${valor === 'C' ? 'selected' : ''}>C</option><option value="I" ${valor === 'I' ? 'selected' : ''}>I</option></select></td>`;
                });
                html += '</tr>';
            });
            html += '</tbody></table><div class="info-card u-mt-16"><small>R=Responsable, A=Accountable, C=Consultado, I=Informado</small></div></div>';
            container.innerHTML = html;
        }

        // ============================================
        // INFORME INTELIGENTE DE MATRIZ RACI
        // ============================================
        
        function generarInformeRACI() {
            const informeContainer = document.getElementById('raciInforme');
            if (!informeContainer) return;
            
            if (!proyecto.stakeholders || proyecto.stakeholders.length === 0) {
                mostrarToast(" No hay stakeholders registrados. Agrega stakeholders primero.", 'error');
                return;
            }
            
            // Recopilar datos de la matriz RACI
            const raciData = proyecto.raci || [];
            const stakeholders = proyecto.stakeholders;
            
            // Actividades predefinidas
            const actividades = ['Acta Constitución', 'Planificación', 'Ejecución', 'Monitoreo', 'Cierre', 'Aprobaciones', 'Comunicaciones', 'Riesgos'];
            
            // 1. DETECTAR BRECHAS (tareas sin R o sin A)
            const brechas = [];
            actividades.forEach(act => {
                const asignaciones = raciData.filter(r => r.actividad === act);
                const tieneR = asignaciones.some(a => a.rol === 'R');
                const tieneA = asignaciones.some(a => a.rol === 'A');
                if (!tieneR) brechas.push({ actividad: act, tipo: 'R', mensaje: 'No hay nadie responsable (R) de esta actividad' });
                if (!tieneA) brechas.push({ actividad: act, tipo: 'A', mensaje: 'No hay nadie accountable (A) para esta actividad' });
            });
            
            // 2. DETECTAR SOBRECARGA (personas con muchas R)
            const cargaPorStakeholder = {};
            stakeholders.forEach(s => {
                cargaPorStakeholder[s.id] = { nombre: s.nombre, rol: s.rol || 'Stakeholder', countR: 0, countA: 0, actividadesR: [], actividadesA: [] };
            });
            
            raciData.forEach(r => {
                if (cargaPorStakeholder[r.stakeholderId]) {
                    if (r.rol === 'R') {
                        cargaPorStakeholder[r.stakeholderId].countR++;
                        cargaPorStakeholder[r.stakeholderId].actividadesR.push(r.actividad);
                    } else if (r.rol === 'A') {
                        cargaPorStakeholder[r.stakeholderId].countA++;
                        cargaPorStakeholder[r.stakeholderId].actividadesA.push(r.actividad);
                    }
                }
            });
            
            const sobrecargados = Object.values(cargaPorStakeholder).filter(s => s.countR > 3);
            const sinActividades = Object.values(cargaPorStakeholder).filter(s => s.countR === 0 && s.countA === 0);
            
            // 3. ANÁLISIS POR ROL (quién hace qué, quién decide)
            const responsables = [];
            const accountable = [];
            const consultados = [];
            const informados = [];
            
            raciData.forEach(r => {
                const stakeholder = stakeholders.find(s => s.id === r.stakeholderId);
                const nombre = stakeholder ? stakeholder.nombre : 'Desconocido';
                if (r.rol === 'R') responsables.push({ nombre, actividad: r.actividad });
                if (r.rol === 'A') accountable.push({ nombre, actividad: r.actividad });
                if (r.rol === 'C') consultados.push({ nombre, actividad: r.actividad });
                if (r.rol === 'I') informados.push({ nombre, actividad: r.actividad });
            });
            
            // Generar el informe HTML
            const saludGeneral = brechas.length === 0 ? (sobrecargados.length === 0 ? 'excelente' : 'buena') : (brechas.length > 2 ? 'critica' : 'regular');
            const saludColor = saludGeneral === 'excelente' ? '#00A859' : (saludGeneral === 'buena' ? '#FF8C00' : '#FF3B30');
            const saludTexto = saludGeneral === 'excelente' ? 'Excelente' : (saludGeneral === 'buena' ? 'Buena (requiere atención)' : 'Crítica (acción inmediata)');
            
            let html = `
                <div class="raci-report-title">
                    <span></span> INFORME INTELIGENTE DE MATRIZ RACI
                    <span style="font-size: 12px; color: rgba(255,255,255,0.5);">${new Date().toLocaleString()}</span>
                </div>
                
                <!-- ¿PARA QUÉ SIRVE LA MATRIZ RACI? -->
                <div class="raci-report-section raci-info">
                    <h4> ¿PARA QUÉ SIRVE LA MATRIZ RACI?</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <div>
                            <div class="u-fw-600"> Eliminar confusiones</div>
                            <p class="u-p-sm">Responde preguntas como: <strong>"¿Quién hace qué?"</strong>, <strong>"¿Quién decide?"</strong> y <strong>"¿A quién le informo?"</strong></p>
                        </div>
                        <div>
                            <div class="u-fw-600"> Prevenir conflictos</div>
                            <p class="u-p-sm">Al dejar claro quién es el aprobador final (A), se evitan luchas de poder o decisiones bloqueadas.</p>
                        </div>
                        <div>
                            <div class="u-fw-600"> Identificar sobrecarga</div>
                            <p class="u-p-sm">Si una persona aparece como <span class="raci-badge raci-badge-r">R</span> en demasiadas tareas, está claro que está sobrecargada.</p>
                        </div>
                        <div>
                            <div class="u-fw-600"> Detectar brechas</div>
                            <p class="u-p-sm">Si una tarea no tiene ninguna <span class="raci-badge raci-badge-r">R</span> o ninguna <span class="raci-badge raci-badge-a">A</span>, nadie la hará ni responderá por ella.</p>
                        </div>
                    </div>
                </div>
                
                <!-- SIGNIFICADO DE LOS ROLES RACI -->
                <div class="raci-report-section">
                    <h4> SIGNIFICADO DE CADA ROL</h4>
                    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                        <div><span class="raci-badge raci-badge-r">R</span> <strong>Responsible</strong><br><span class="u-fs-11">Quien ejecuta la tarea</span></div>
                        <div><span class="raci-badge raci-badge-a">A</span> <strong>Accountable</strong><br><span class="u-fs-11">Quien responde por el resultado</span></div>
                        <div><span class="raci-badge raci-badge-c">C</span> <strong>Consulted</strong><br><span class="u-fs-11">Quien debe ser consultado</span></div>
                        <div><span class="raci-badge raci-badge-i">I</span> <strong>Informed</strong><br><span class="u-fs-11">Quien debe ser informado</span></div>
                    </div>
                </div>
                
                <!-- SALUD GENERAL DE LA MATRIZ -->
                <div class="raci-report-section" style="border-left: 4px solid ${saludColor};">
                    <h4> SALUD GENERAL DE LA MATRIZ RACI</h4>
                    <div style="font-size: 24px; font-weight: bold; color: ${saludColor};">${saludTexto}</div>
                    <div style="margin-top: 8px; display: flex; gap: 16px; flex-wrap: wrap;">
                        <div> Actividades totales: ${actividades.length}</div>
                        <div> Asignaciones RACI: ${raciData.length}</div>
                        <div> Stakeholders: ${stakeholders.length}</div>
                    </div>
                </div>
            `;
            
            // SECCIÓN 1: DETECTAR BRECHAS
            if (brechas.length > 0) {
                html += `
                    <div class="raci-report-section raci-critical">
                        <h4> BRECHAS DETECTADAS (Actividades sin responsables)</h4>
                        <p class="u-fs-12 u-mb-12"> Las siguientes actividades no tienen asignados los roles necesarios:</p>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            ${brechas.map(b => `
                                <div style="background: rgba(255,59,48,0.15); padding: 8px; border-radius: 8px;">
                                    <strong>${escapeHtml(b.actividad)}</strong><br>
                                    <span class="u-fs-11"> ${b.mensaje}</span>
                                </div>
                            `).join('')}
                        </div>
                        <p class="u-fs-12 u-mt-12"> <strong>Recomendación:</strong> Asigna los roles faltantes para garantizar que todas las actividades tengan un responsable (R) y un accountable (A).</p>
                    </div>
                `;
            } else {
                html += `
                    <div class="raci-report-section raci-success">
                        <h4> SIN BRECHAS DETECTADAS</h4>
                        <p class="u-p-sm">Todas las actividades tienen asignados los roles <span class="raci-badge raci-badge-r">R</span> (Responsable) y <span class="raci-badge raci-badge-a">A</span> (Accountable). ¡Excelente!</p>
                    </div>
                `;
            }
            
            // SECCIÓN 2: SOBRECARGA DE TRABAJO
            if (sobrecargados.length > 0) {
                html += `
                    <div class="raci-report-section raci-warning">
                        <h4> SOBRECARGA DE TRABAJO DETECTADA</h4>
                        <p class="u-fs-12 u-mb-12">Las siguientes personas tienen demasiadas responsabilidades (R):</p>
                        ${sobrecargados.map(s => {
                            const loadPercent = Math.min(100, (s.countR / 5) * 100);
                            return `
                                <div class="u-mb-16">
                                    <div class="u-flex-jc-sb">
                                        <strong>${escapeHtml(s.nombre)}</strong>
                                        <span class="u-fs-11">${s.countR} actividades como R</span>
                                    </div>
                                    <div class="stakeholder-load-bar">
                                        <div class="stakeholder-load-fill" style="width: ${loadPercent}%;"></div>
                                    </div>
                                    <div style="font-size: 11px; color: rgba(255,255,255,0.6);">
                                        Actividades: ${s.actividadesR.map(a => escapeHtml(a)).join(', ')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                        <p class="u-fs-12 u-mt-12"> <strong>Recomendación:</strong> Distribuye las responsabilidades entre más personas para evitar cuellos de botella y agotamiento.</p>
                    </div>
                `;
            }
            
            // SECCIÓN 3: STAKEHOLDERS SIN PARTICIPACIÓN
            if (sinActividades.length > 0) {
                html += `
                    <div class="raci-report-section raci-info">
                        <h4> STAKEHOLDERS SIN PARTICIPACIÓN</h4>
                        <p class="u-fs-12 u-mb-12">Los siguientes stakeholders no tienen ningún rol asignado en la matriz RACI:</p>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${sinActividades.map(s => `
                                <span style="background: rgba(0,122,255,0.2); padding: 4px 12px; border-radius: 16px; font-size: 12px;">${escapeHtml(s.nombre)}</span>
                            `).join('')}
                        </div>
                        <p class="u-fs-12 u-mt-12"> <strong>Recomendación:</strong> Considera si estos stakeholders deberían tener algún rol (R, A, C o I) según su nivel de poder/interés.</p>
                    </div>
                `;
            }
            
            // SECCIÓN 4: ANÁLISIS POR ROL
            html += `
                <div class="raci-report-section">
                    <h4> ANÁLISIS POR ROL</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                        <div style="background: rgba(0,122,255,0.1); padding: 12px; border-radius: 12px;">
                            <div class="u-fw-600 u-mb-8"><span class="raci-badge raci-badge-r">R</span> ¿QUIÉN HACE QUÉ?</div>
                            ${responsables.length > 0 ? `
                                <div class="u-fs-12 u-scroll-150">
                                    ${responsables.map(r => `<div>• <strong>${escapeHtml(r.nombre)}</strong>: ${escapeHtml(r.actividad)}</div>`).join('')}
                                </div>
                            ` : '<p class="u-p-sm">No hay responsables asignados</p>'}
                        </div>
                        <div style="background: rgba(255,59,48,0.1); padding: 12px; border-radius: 12px;">
                            <div class="u-fw-600 u-mb-8"><span class="raci-badge raci-badge-a">A</span> ¿QUIÉN DECIDE?</div>
                            ${accountable.length > 0 ? `
                                <div class="u-fs-12 u-scroll-150">
                                    ${accountable.map(a => `<div>• <strong>${escapeHtml(a.nombre)}</strong>: ${escapeHtml(a.actividad)}</div>`).join('')}
                                </div>
                            ` : '<p class="u-p-sm">No hay accountable asignados</p>'}
                        </div>
                        <div style="background: rgba(255,140,0,0.1); padding: 12px; border-radius: 12px;">
                            <div class="u-fw-600 u-mb-8"><span class="raci-badge raci-badge-c">C</span> ¿A QUIÉN CONSULTAR?</div>
                            ${consultados.length > 0 ? `
                                <div class="u-fs-12 u-scroll-150">
                                    ${consultados.map(c => `<div>• <strong>${escapeHtml(c.nombre)}</strong>: ${escapeHtml(c.actividad)}</div>`).join('')}
                                </div>
                            ` : '<p class="u-p-sm">No hay consultores asignados</p>'}
                        </div>
                        <div style="background: rgba(52,199,89,0.1); padding: 12px; border-radius: 12px;">
                            <div class="u-fw-600 u-mb-8"><span class="raci-badge raci-badge-i">I</span> ¿A QUIÉN INFORMAR?</div>
                            ${informados.length > 0 ? `
                                <div class="u-fs-12 u-scroll-150">
                                    ${informados.map(i => `<div>• <strong>${escapeHtml(i.nombre)}</strong>: ${escapeHtml(i.actividad)}</div>`).join('')}
                                </div>
                            ` : '<p class="u-p-sm">No hay informados asignados</p>'}
                        </div>
                    </div>
                </div>
            `;
            
            // SECCIÓN 5: RESUMEN EJECUTIVO
            html += `
                <div class="raci-report-section raci-info">
                    <h4> RESUMEN EJECUTIVO PARA LA DIRECCIÓN</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <div>
                            <div> <strong>Puntos fuertes:</strong></div>
                            <ul style="font-size: 12px; margin-left: 20px;">
                                <li>Hay ${stakeholders.length} stakeholders identificados</li>
                                <li>Se han definido ${raciData.length} asignaciones RACI</li>
                                ${brechas.length === 0 ? '<li>Todas las actividades tienen responsable y accountable</li>' : ''}
                            </ul>
                        </div>
                        <div>
                            <div> <strong>Áreas de mejora:</strong></div>
                            <ul style="font-size: 12px; margin-left: 20px;">
                                ${brechas.length > 0 ? `<li>${brechas.length} brecha(s) sin responsable</li>` : ''}
                                ${sobrecargados.length > 0 ? `<li>${sobrecargados.length} persona(s) sobrecargadas</li>` : ''}
                                ${sinActividades.length > 0 ? `<li>${sinActividades.length} stakeholder(s) sin participación</li>` : ''}
                                ${brechas.length === 0 && sobrecargados.length === 0 && sinActividades.length === 0 ? '<li>No se detectaron problemas - Matriz saludable</li>' : ''}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            
            informeContainer.innerHTML = html;
            informeContainer.style.display = 'block';
            
            // Hacer scroll al informe
            informeContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            mostrarToast(" Informe RACI generado exitosamente", 'success');
        }
        
        function guardarRACI(actividad, stakeholderId, rol) {
            if (!proyecto.raci) proyecto.raci = [];
            let idx = proyecto.raci.findIndex(r => r.actividad === actividad && r.stakeholderId === stakeholderId);
            if (rol === '') {
                if (idx >= 0) proyecto.raci.splice(idx, 1);
            } else {
                if (idx >= 0) proyecto.raci[idx].rol = rol;
                else proyecto.raci.push({ actividad, stakeholderId, rol });
            }
            guardarProyecto();
            mostrarToast(` Rol ${rol} asignado`, 'success');
        }
// ============================================
// MÓDULO DE RESUMEN DE GASTOS
// ============================================

let distribucionGastosChart = null;

function actualizarResumenGastos() {
    if (!proyecto) return;
    
    console.log("===  ACTUALIZANDO RESUMEN DE GASTOS ===");
    console.log("Moneda base del proyecto:", proyecto.monedaBase);
    console.log("Tipos de cambio disponibles:", tiposCambio);
    
    // Inicializar acumuladores por categoría
    let gastos = {
        personal: 0,
        materiales: 0,
        servicios: 0,
        viajes: 0,
        logistica: 0,
        financieros: 0,
        otros: 0
    };
    
    let desglose = [];
    
    // Definición de nombres de categorías
    const nombresCategoriasLocal = {
        personal: ' Personal',
        materiales: ' Materiales',
        servicios: ' Servicios',
        viajes: ' Viajes',
        logistica: ' Logística',
        financieros: ' Financieros',
        otros: ' Otros'
    };
    
    // ========== GASTOS DE MATERIALES (VERSIÓN CORREGIDA) ==========
    console.log("\n--- MATERIALES ---");
    (proyecto.materiales || []).forEach(m => {
        // Calcular coste base
        const costeOriginal = m.cantidad * m.costeUnitario;
        const monedaMaterial = m.moneda;
        
        // Obtener tasa de cambio
        let tasa = tiposCambio[monedaMaterial];
        let costeConvertido = 0;
        
        if (tasa && tasa > 0) {
            costeConvertido = costeOriginal / tasa;
            console.log(` ${m.nombre}: ${costeOriginal} ${monedaMaterial} → ${costeConvertido.toFixed(2)} ${proyecto.monedaBase} (tasa: ${tasa})`);
        } else {
            console.error(` ERROR: No hay tasa para ${monedaMaterial}. Usando valor original sin convertir.`);
            mostrarToast(` No hay tasa de cambio para ${monedaMaterial}. Actualiza los tipos de cambio.`, 'warning');
            costeConvertido = costeOriginal;
        }
        
        // Coste de envío
        let costeEnvioOriginal = m.costeEnvio || 0;
        let costeEnvioConvertido = 0;
        if (costeEnvioOriginal > 0) {
            const monedaEnvio = m.monedaEnvio || m.moneda;
            const tasaEnvio = tiposCambio[monedaEnvio];
            if (tasaEnvio && tasaEnvio > 0) {
                costeEnvioConvertido = costeEnvioOriginal / tasaEnvio;
                console.log(`   Envío: ${costeEnvioOriginal} ${monedaEnvio} → ${costeEnvioConvertido.toFixed(2)} ${proyecto.monedaBase}`);
            } else {
                console.warn(`    Envío sin conversión: ${costeEnvioOriginal} ${monedaEnvio}`);
                costeEnvioConvertido = costeEnvioOriginal;
            }
        }
        
        const total = costeConvertido + costeEnvioConvertido;
        gastos.materiales += total;
        
        desglose.push({
            categoria: " Materiales",
            subcategoria: m.incoterm || "Compra",
            concepto: m.nombre,
            mes: `Mes ${m.mes || 1}`,
            importe: total,
            debug: `${costeOriginal} ${monedaMaterial} = ${total.toFixed(2)} ${proyecto.monedaBase}`
        });
    });
    console.log(` TOTAL MATERIALES: ${gastos.materiales.toFixed(2)} ${proyecto.monedaBase}\n`);
    
    // ========== GASTOS DE SERVICIOS ==========
    console.log("--- SERVICIOS ---");
    (proyecto.servicios || []).forEach(s => {
        const costeOriginal = s.cantidad * s.costeUnitario * (1 + (s.impuesto || 0) / 100);
        const tasa = tiposCambio[s.moneda];
        let total = 0;
        
        if (tasa && tasa > 0) {
            total = costeOriginal / tasa;
            console.log(` ${s.nombre}: ${costeOriginal} ${s.moneda} → ${total.toFixed(2)} ${proyecto.monedaBase}`);
        } else {
            console.error(` ERROR: No hay tasa para ${s.moneda}`);
            total = costeOriginal;
        }
        
        gastos.servicios += total;
        desglose.push({
            categoria: " Servicios",
            subcategoria: `Impuesto ${s.impuesto || 0}%`,
            concepto: s.nombre,
            mes: `Mes ${s.mes || 1}`,
            importe: total
        });
    });
    
    // ========== GASTOS DE VIAJES ==========
    console.log("--- VIAJES ---");
    (proyecto.viajes || []).forEach(v => {
        const costeOriginal = (v.costeVuelos || 0) + (v.costeHotel || 0) + (v.costeComidas || 0) + (v.costeTraslados || 0);
        const tasa = tiposCambio[v.moneda];
        let total = 0;
        
        if (tasa && tasa > 0) {
            total = costeOriginal / tasa;
            console.log(` ${v.nombre}: ${costeOriginal} ${v.moneda} → ${total.toFixed(2)} ${proyecto.monedaBase}`);
        } else {
            console.error(` ERROR: No hay tasa para ${v.moneda}`);
            total = costeOriginal;
        }
        
        gastos.viajes += total;
        desglose.push({
            categoria: " Viajes",
            subcategoria: v.destino || "Desplazamiento",
            concepto: `${v.nombre} - ${v.motivo || 'Sin motivo'}`,
            mes: v.fechaSalida ? new Date(v.fechaSalida).toLocaleDateString() : `Mes ${v.mes || 1}`,
            importe: total
        });
    });
    
    // ========== GASTOS DE LOGÍSTICA (Envios) ==========
    (proyecto.envios || []).forEach(e => {
        let total = convertirMoneda(e.costeTotalEnvio || 0, proyecto.monedaBase);
        gastos.logistica += total;
        desglose.push({
            categoria: " Logística",
            subcategoria: e.incoterm || "Envío",
            concepto: e.nombre,
            mes: "Según envío",
            importe: total
        });
    });
    
    // ========== GASTOS FINANCIEROS ==========
    (proyecto.costesFinancierosExtra || []).forEach(c => {
        let total = c.tipo === 'porcentaje' ? (c.base || 0) * (c.tasa / 100) : c.tasa;
        total = convertirMoneda(total, c.moneda);
        gastos.financieros += total;
        desglose.push({
            categoria: " Financieros",
            subcategoria: c.tipo === 'porcentaje' ? 'Porcentaje' : 'Fijo',
            concepto: c.concepto,
            mes: c.periodicidad || "Único",
            importe: total
        });
    });
    
    // ========== GASTOS DE TAREAS DEL GANTT ==========
    (proyecto.elementosGantt || []).forEach(tarea => {
        if (tarea.tipo !== 'hito' && tarea.recursoAsignado && tarea.costeEstimado > 0) {
            let coste = convertirMoneda(tarea.costeEstimado, tarea.recursoAsignado.moneda || proyecto.monedaBase);
            gastos.personal += coste;
            desglose.push({
                categoria: " Personal",
                subcategoria: "Tareas",
                concepto: tarea.nombre,
                mes: tarea.inicio ? new Date(tarea.inicio).toLocaleDateString() : "Planificado",
                importe: coste
            });
        }
    });
    
    // Calcular total
    let totalGastos = Object.values(gastos).reduce((a, b) => a + b, 0);
    console.log(`\n TOTAL GENERAL GASTOS: ${totalGastos.toFixed(2)} ${proyecto.monedaBase}`);
    console.log("=== FIN RESUMEN GASTOS ===\n");
    
    // Actualizar tarjetas de resumen
    document.getElementById('resumenTotalGastos').innerHTML = formatearMoneda(totalGastos);
    document.getElementById('resumenGastoPersonal').innerHTML = formatearMoneda(gastos.personal);
    document.getElementById('resumenGastoMateriales').innerHTML = formatearMoneda(gastos.materiales);
    document.getElementById('resumenGastoServicios').innerHTML = formatearMoneda(gastos.servicios);
    document.getElementById('resumenGastoViajes').innerHTML = formatearMoneda(gastos.viajes);
    document.getElementById('resumenGastoLogistica').innerHTML = formatearMoneda(gastos.logistica);
    document.getElementById('resumenGastoFinancieros').innerHTML = formatearMoneda(gastos.financieros);
    
    // Calcular porcentaje vs presupuesto
    let presupuesto = proyecto.acta?.presupuesto || proyecto.precioVenta || totalGastos;
    let porcentajePresupuesto = totalGastos > 0 ? (totalGastos / presupuesto) * 100 : 0;
    document.getElementById('resumenPorcentajePresupuesto').innerHTML = porcentajePresupuesto.toFixed(1) + '%';
    
    // Ordenar desglose por importe (mayor a menor)
    desglose.sort((a, b) => b.importe - a.importe);
    
    // Generar tabla de desglose
    let desgloseHtml = '';
    desglose.forEach(item => {
        let porcentaje = totalGastos > 0 ? (item.importe / totalGastos) * 100 : 0;
        let debugInfo = item.debug ? `<br><span style="font-size: 8px; color: #888;">${item.debug}</span>` : '';
        desgloseHtml += `<tr>
            <td><strong>${item.categoria}</strong>${debugInfo}</td>
            <td>${item.subcategoria}</td>
            <td>${escapeHtml(item.concepto)}</td>
            <td>${item.mes}</td>
            <td>${formatearMoneda(item.importe)}</td>
            <td class="u-color-success">${porcentaje.toFixed(1)}%</td>
        </tr>`;
    });
    
    document.getElementById('desgloseGastosBody').innerHTML = desgloseHtml || '<tr><td colspan="6" class="u-text-center">No hay datos de gastos</td></tr>';
    document.getElementById('desgloseTotalGeneral').innerHTML = formatearMoneda(totalGastos);
    
    // Generar gráfico de distribución
    const ctx = document.getElementById('distribucionGastosChart')?.getContext('2d');
    if (ctx) {
        if (distribucionGastosChart) distribucionGastosChart.destroy();
        
        let categorias = [];
        let valores = [];
        let colores = [];
        
        const coloresPorCategoria = {
            personal: '#007AFF',
            materiales: '#FF8C00',
            servicios: '#00A859',
            viajes: '#FF3B30',
            logistica: '#AF52DE',
            financieros: '#FFCC00',
            otros: '#5856D6'
        };
        
        for (let [key, value] of Object.entries(gastos)) {
            if (value > 0) {
                categorias.push(nombresCategoriasLocal[key] || key);
                valores.push(value);
                colores.push(coloresPorCategoria[key] || '#5856D6');
            }
        }
        
        distribucionGastosChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categorias,
                datasets: [{
                    data: valores,
                    backgroundColor: colores,
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: 'white', font: { size: 11 } }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                let label = context.label || '';
                                let value = context.raw;
                                let total = context.dataset.data.reduce((a, b) => a + b, 0);
                                let porcentaje = total > 0 ? (value / total) * 100 : 0;
                                return `${label}: ${formatearMoneda(value)} (${porcentaje.toFixed(1)}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }
    
    // Generar análisis de gastos
    let categoriaMayor = '';
    let mayorValor = 0;
    for (let [key, value] of Object.entries(gastos)) {
        if (value > mayorValor) {
            mayorValor = value;
            categoriaMayor = nombresCategoriasLocal[key];
        }
    }
    
    let analisisHtml = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
            <div style="background: rgba(0,122,255,0.15); padding: 12px; border-radius: 12px;">
                <strong> Principales hallazgos:</strong><br>
                • La mayor partida de gasto es <strong>${categoriaMayor}</strong> con ${formatearMoneda(mayorValor)} (${((mayorValor/totalGastos)*100).toFixed(1)}% del total)<br>
                • ${gastos.personal > gastos.materiales ? 'El coste de personal supera al de materiales' : 'Los materiales representan una inversión significativa'}<br>
                • Los gastos financieros representan ${((gastos.financieros/totalGastos)*100).toFixed(1)}% del total
            </div>
            <div style="background: rgba(52,199,89,0.1); padding: 12px; border-radius: 12px;">
                <strong> Recomendaciones:</strong><br>
                • Revisar periódicamente los gastos de ${categoriaMayor.toLowerCase()} para identificar oportunidades de ahorro<br>
                • Establecer alertas cuando los gastos superen el ${porcentajePresupuesto.toFixed(0)}% del presupuesto<br>
                • Considerar negociación con proveedores para reducir costes
            </div>
        </div>
        <div style="margin-top: 16px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 8px; font-size: 11px;">
             <strong>Resumen ejecutivo:</strong> El proyecto ha ejecutado ${formatearMoneda(totalGastos)} de gastos, lo que representa el ${porcentajePresupuesto.toFixed(1)}% del presupuesto total.
            ${porcentajePresupuesto > 100 ? ' Se ha superado el presupuesto inicial.' : ' El proyecto está dentro del presupuesto.'}
        </div>
    `;
    
    const analisisElement = document.getElementById('analisisGastosTexto');
    if (analisisElement) analisisElement.innerHTML = analisisHtml;
    
    mostrarToast(" Resumen de gastos actualizado", 'success');
    // Guardar resumen de gastos para el dashboard
    proyecto.resumenGastos = {
    totalGastos: totalGastos,
    desglose: desglose,
    fechaActualizacion: new Date().toISOString()
};
guardarProyecto();
}

function exportarResumenGastos() {
    if (!proyecto) return;
    
    let csv = "Categoría,Subcategoría,Concepto,Mes,Importe (EUR),% del Total\n";
    
    const filas = document.querySelectorAll('#desgloseGastosBody tr');
    filas.forEach(fila => {
        const celdas = fila.querySelectorAll('td');
        if (celdas.length >= 6) {
            csv += `"${celdas[0].innerText.replace(/</g, '&lt;')}","${celdas[1].innerText}","${celdas[2].innerText}","${celdas[3].innerText}","${celdas[4].innerText}","${celdas[5].innerText}"\n`;
        }
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `resumen_gastos_${proyecto.nombre}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    mostrarToast(" Resumen de gastos exportado a CSV", 'success');
}
        
        // ============================================
        // PROCESOS PMBOK
        // ============================================
        function renderizarProcesos() {
            const grid = document.getElementById('procesosGrid');
            if (!proyecto.procesos) proyecto.procesos = JSON.parse(JSON.stringify(PROCESOS_PMBOK));
            
            const grupos = {};
            proyecto.procesos.forEach(p => { if (!grupos[p.grupo]) grupos[p.grupo] = []; grupos[p.grupo].push(p); });
            
            let html = '';
            for (const [grupo, procesos] of Object.entries(grupos)) {
                html += `<div class="info-card u-mb-16"><h4> ${grupo}</h4>`;
                procesos.forEach(p => {
                    html += `<div class="process-card" onclick="toggleProceso(${p.id})" style="border-left-color: ${p.completado ? '#00A859' : '#FF8C00'}"><div class="u-flex-jc-sb"><span>${escapeHtml(p.nombre)}</span><span>${p.completado ? '' : ''}</span></div></div>`;
                });
                html += `</div>`;
            }
            grid.innerHTML = html;
        }
        
        function toggleProceso(id) {
            let p = proyecto.procesos.find(p => p.id === id);
            if (p) { p.completado = !p.completado; guardarProyecto(); renderizarProcesos(); calcularCashflow(); mostrarToast(`${p.nombre}: ${p.completado ? 'Completado' : 'Pendiente'}`, 'success'); }
        }
        
        function resetearProcesos() {
            if (confirm(tApp('confirmar_resetear_procesos'))) {
                proyecto.procesos = JSON.parse(JSON.stringify(PROCESOS_PMBOK));
                guardarProyecto();
                renderizarProcesos();
                mostrarToast(tApp('toast_procesos_reseteados'), 'success');
            }
        }
        
        // ============================================
        // MATERIALES
        // ============================================
    function renderizarMateriales() {
    const tbody = document.getElementById('materialesBody');
    if (!proyecto.materiales) proyecto.materiales = [];
    if (proyecto.materiales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="15" class="u-text-center">No hay materiales registrados</td></tr>';
        return;
    }
    
    // Determinar si estamos en modo ágil o mixto
    const esAgile = (proyecto.metodologia?.tipo === 'agile' || proyecto.metodologia?.tipo === 'mixto');
    
    tbody.innerHTML = proyecto.materiales.map(m => {
        // Calcular costes adicionales
        let costeEnvioConv = convertirMoneda(m.costeEnvio || 0, m.monedaEnvio || m.moneda);
        let seguroCalc = (m.cantidad * convertirMoneda(m.costeUnitario, m.moneda)) * ((m.seguroPorcentaje || 0) / 100);
        let seguroFijoConv = convertirMoneda(m.seguroFijo || 0, m.moneda);
        let gastosAduanaConv = convertirMoneda(m.gastosAduana || 0, m.monedaAduana || m.moneda);
        let totalCostesAdicionales = costeEnvioConv + seguroCalc + seguroFijoConv + gastosAduanaConv;
        
        let incotermLabel = '';
        switch(m.incoterm) {
            case 'EXW': incotermLabel = ' EXW'; break;
            case 'FOB': incotermLabel = ' FOB'; break;
            case 'CIF': incotermLabel = ' CIF'; break;
            default: incotermLabel = m.incoterm || 'N/D';
        }
        
        let arancelInfo = '';
        if (m.arancelPersonalizado && m.arancelPersonalizado > 0) {
            arancelInfo = `${m.arancelPersonalizado}% (manual)`;
        } else {
            arancelInfo = 'Auto-calculado';
        }
        
        // Mostrar Sprint si es modo ágil, sino mostrar Mes
        let periodoMostrar = '';
        if (esAgile && m.sprint) {
            periodoMostrar = ` Sprint ${m.sprint}`;
            if (m.historiaAsociada) {
                periodoMostrar += `<br><small style="font-size: 9px; color: #FF8C00;"> ${escapeHtml(m.historiaAsociada.substring(0, 25))}${m.historiaAsociada.length > 25 ? '...' : ''}</small>`;
            }
        } else {
            periodoMostrar = `Mes ${m.mes || 1}`;
        }
        
        // Mostrar también el método de gestión si es mixto
        let gestionLabel = '';
        if (proyecto.metodologia?.tipo === 'mixto' && m.tipoGestion) {
            gestionLabel = m.tipoGestion === 'agile' ? ' Ágil' : ' Cascada';
        }
        
        // ============================================
        // PLAZO DE SUMINISTRO Y FECHA DE RECEPCIÓN
        // ============================================
        let plazoInfo = '';
        if (m.plazoSuministro && m.plazoSuministro > 0) {
            let recepcionInfo = '';
            if (m.fechaRecepcionEstimada) {
                recepcionInfo = `<br><small style="font-size: 9px; color: #00A859;"> Recibe: ${m.fechaRecepcionEstimada}</small>`;
            } else if (m.mesRecepcion) {
                recepcionInfo = `<br><small style="font-size: 9px; color: #00A859;"> Recibe: Mes ${m.mesRecepcion}</small>`;
            }
            plazoInfo = `<div class="u-fs-10"> ${m.plazoSuministro} días${recepcionInfo}</div>`;
        } else {
            plazoInfo = '<div style="font-size: 10px; color: #888;">-</div>';
        }
        
        // ============================================
        // GENERAR TEXTO DE CONDICIONES DE PAGO
        // ============================================
        let condicionesPagoHtml = '';
        if (m.condicionesPago) {
            const cp = m.condicionesPago;
            if (cp.tipo === 'contado') {
                condicionesPagoHtml = '<span class="badge-completado" title="Pago de contado"> Contado</span>';
            } else if (cp.tipo === 'contra_recepcion') {
                condicionesPagoHtml = `<span class="badge-pais" style="background: rgba(0,168,89,0.2); color: #00A859;" title="Pago contra recepción"> Contra recepción</span>`;
            } else if (cp.tipo === 'porcentajes') {
                const tramos = cp.tramos.map(t => `${t.porcentaje}% (${t.momento === 'compra' ? 'compra' : 'recepción'})`).join(', ');
                condicionesPagoHtml = `<span class="badge-progreso" title="${tramos}"> ${cp.tramos.length} pagos</span>`;
            } else if (cp.tipo === 'plazo') {
                const refTexto = cp.plazoReferencia === 'compra' ? 'compra' : (cp.plazoReferencia === 'recepcion' ? 'recepción' : 'factura');
                condicionesPagoHtml = `<span class="badge-pais" title="Pago a ${cp.plazoDias} días después de la ${refTexto}"> ${cp.plazoDias} días</span>`;
            } else if (cp.tipo === 'mixto') {
                const refTexto = cp.plazoReferencia === 'compra' ? 'compra' : 'recepción';
                condicionesPagoHtml = `<span class="badge-warning" style="background: rgba(255,140,0,0.2); color: #FF8C00; padding: 2px 6px; border-radius: 12px;" title="${cp.porcentajeInicial}% al ${refTexto === 'compra' ? 'comprar' : 'recibir'}, ${100-cp.porcentajeInicial}% a ${cp.plazoResto} días"> ${cp.porcentajeInicial}% + ${cp.plazoResto}d</span>`;
            }
        } else {
            condicionesPagoHtml = '<span class="badge-pendiente">Sin condiciones</span>';
        }
        
        return `
            <tr>
                <td><strong>${escapeHtml(m.nombre)}</strong>${gestionLabel ? `<br><small style="font-size: 9px;">${gestionLabel}</small>` : ''}</td>
                <td>${escapeHtml(m.proveedor || '-')}</td>
                <td>${escapeHtml(m.partNumber || '-')}</td>
                <td>${m.cantidad}</td>
                <td>${formatearMoneda(convertirMoneda(m.costeUnitario, m.moneda))}</td>
                <td>${m.moneda}</td>
                <td class="badge-pais">${escapeHtml(m.paisOrigen || 'No especificado')}</td>
                <td style="background: ${esAgile && m.sprint ? 'rgba(255,140,0,0.15)' : 'rgba(0,122,255,0.1)'};">${periodoMostrar}</td>
                <td class="u-text-center">${plazoInfo}</td>
                <td><span class="badge-pais" style="background:rgba(255,140,0,0.2);">${incotermLabel}</span></td>
                <td>${formatearMoneda(costeEnvioConv)}</td>
                <td>${arancelInfo}</td>
                <td class="u-text-center">${condicionesPagoHtml}</td>
                <td>
                    <span class="edit-btn" onclick="editarMaterial(${m.id})"></span>
                    <span class="delete-btn" onclick="eliminarMaterial(${m.id})"></span>
                 </td>
            </tr>
        `;
    }).join('');
    
    calcularCashflow();
}
        
function abrirModalMaterial() {
    const esAgile = (proyecto.metodologia?.tipo === 'agile' || proyecto.metodologia?.tipo === 'mixto');
    
    // Obtener valores por defecto
    const hoy = new Date().toISOString().split('T')[0];
    const monedaPorDefecto = proyecto.monedaBase || 'EUR';
    
    let modalHtml = `
        <div class="modal-content modal-lg" style="max-width: 750px;">
            <div class="modal-header">
                <h3> Nuevo Material</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="matId">
            
            <!-- ============================================ -->
            <!-- DATOS BÁSICOS DEL MATERIAL -->
            <!-- ============================================ -->
            <div class="form-group">
                <label>Nombre del material *</label>
                <input type="text" id="matNombre" placeholder="Ej: Servidor Dell PowerEdge" class="u-select-glass">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Proveedor</label>
                    <input type="text" id="matProveedor" placeholder="Ej: Dell Technologies" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Part Number / SKU</label>
                    <input type="text" id="matPartNumber" placeholder="Ej: R750-XS" class="u-select-glass">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Cantidad</label>
                    <input type="number" id="matCantidad" value="1" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label>Coste unitario</label>
                    <input type="number" id="matCosteUnitario" value="1000" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label>Moneda</label>
                    <select id="matMoneda" class="u-select-glass">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${m === monedaPorDefecto ? 'selected' : ''}>${m} - ${MONEDAS[m]}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <!-- ============================================ -->
            <!--  NUEVO: HS CODE Y PESO UNITARIO -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> DATOS PARA COMERCIO EXTERIOR</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Peso unitario (kg)</label>
                    <input type="number" id="matPesoUnitario" value="1" step="0.1" min="0.1" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Peso por unidad del material</small>
                </div>
                <div class="form-group">
                    <label> HS Code (Código Arancelario)</label>
                    <input type="text" id="matHsCode" placeholder="Ej: 8471.30.00" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Código para comercio internacional</small>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> País de origen</label>
                    <input type="text" id="matPaisOrigen" placeholder="Ej: China, USA, España" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Para cálculo de aranceles</small>
                </div>
    `;
    
    if (esAgile) {
        modalHtml += `
                <div class="form-group">
                    <label> Sprint asociado</label>
                    <input type="number" id="matSprint" value="1" min="1" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Sprint donde se usará este material</small>
                </div>
            </div>
        `;
    } else {
        modalHtml += `
                <div class="form-group">
                    <label> Mes de compra</label>
                    <input type="number" id="matMes" value="1" min="1" max="36" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Mes planificado para la compra</small>
                </div>
            </div>
        `;
    }
    
    modalHtml += `
            <!-- ============================================ -->
            <!-- PLAZO DE SUMINISTRO -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> PLAZO DE SUMINISTRO</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Plazo de suministro (días)</label>
                    <input type="number" id="matPlazoSuministro" value="0" min="0" max="365" step="1" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Días desde la compra hasta la recepción</small>
                </div>
                <div class="form-group">
                    <label> Fecha de referencia</label>
                    <select id="matReferenciaPlazo" class="u-select-glass">
                        <option value="compra">Desde fecha de compra</option>
                        <option value="pedido">Desde fecha de pedido</option>
                        <option value="envio">Desde fecha de envío</option>
                    </select>
                </div>
            </div>
            
            <!-- ============================================ -->
            <!-- CONDICIONES DE PAGO -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> CONDICIONES DE PAGO</h4>
            
            <div class="form-group">
                <label>Tipo de pago</label>
                <select id="matTipoPago" class="u-select-glass" onchange="toggleCondicionesPagoMaterial()">
                    <option value="contado"> Pago de contado (100% ahora)</option>
                    <option value="porcentajes"> Pago por porcentajes</option>
                    <option value="plazo"> Pago a plazo</option>
                    <option value="mixto"> Mixto (porcentaje + plazo)</option>
                    <option value="contra_recepcion"> Pago contra recepción</option>
                </select>
            </div>
            
            <!-- Opción: Pago contra recepción -->
            <div id="pagoContraRecepcionGroup" class="u-hidden">
                <div class="info-card-modal" style="padding: 8px; background: rgba(0,168,89,0.15);">
                    <small> El pago se realizará <strong>contra recepción del material</strong>.</small>
                </div>
            </div>
            
            <!-- Opción: Porcentajes -->
            <div id="pagoPorcentajesGroup" class="u-hidden">
                <label style="font-size: 12px; margin-bottom: 8px; display: block;"> Distribución de pagos</label>
                <div id="listaPorcentajesMaterial">
                    <div class="form-row u-mb-8">
                        <div class="form-group u-flex-2">
                            <label>% inicial</label>
                            <input type="number" id="pagoPorcInicial" value="80" min="0" max="100" step="5" class="u-select-glass">
                        </div>
                        <div class="form-group u-flex-2">
                            <label>Momento del pago</label>
                            <select id="pagoPorcMomentoInicial" class="u-select-glass">
                                <option value="compra">En el momento de la compra</option>
                                <option value="recepcion">En el momento de la recepción</option>
                            </select>
                        </div>
                        <div class="form-group u-flex-1">
                            <label>&nbsp;</label>
                            <button class="btn btn-secondary btn-small u-w-full" onclick="agregarFilaPagoMaterial()">+ Añadir tramo</button>
                        </div>
                    </div>
                </div>
                <div id="listaTramosPagoMaterial" class="u-mt-8"></div>
                <small class="u-fs-11 u-color-muted"> La suma de los porcentajes debe ser 100%</small>
            </div>
            
            <!-- Opción: Plazo -->
            <div id="pagoPlazoGroup" class="u-hidden">
                <div class="form-row">
                    <div class="form-group">
                        <label> Días de plazo</label>
                        <input type="number" id="pagoPlazoDias" value="30" min="0" max="360" step="15" class="u-select-glass">
                    </div>
                    <div class="form-group">
                        <label> Fecha de referencia</label>
                        <select id="pagoPlazoReferencia" class="u-select-glass">
                            <option value="compra">Fecha de compra</option>
                            <option value="recepcion">Fecha de recepción</option>
                            <option value="factura">Fecha de factura</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Opción: Mixto -->
            <div id="pagoMixtoGroup" class="u-hidden">
                <div class="form-row">
                    <div class="form-group">
                        <label> Porcentaje inicial</label>
                        <input type="number" id="pagoMixtoPorcInicial" value="50" min="0" max="100" step="5" class="u-select-glass">
                    </div>
                    <div class="form-group">
                        <label> Plazo para el resto (días)</label>
                        <input type="number" id="pagoMixtoPlazo" value="30" min="0" max="360" step="15" class="u-select-glass">
                    </div>
                    <div class="form-group">
                        <label>Referencia del plazo</label>
                        <select id="pagoMixtoReferencia" class="u-select-glass">
                            <option value="compra">Desde compra</option>
                            <option value="recepcion">Desde recepción</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- ============================================ -->
            <!-- LOGÍSTICA Y TRANSPORTE -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> LOGÍSTICA Y TRANSPORTE</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label>INCOTERM</label>
                    <select id="matIncoterm" class="u-select-glass">
                        <option value="EXW">EXW - En fábrica</option>
                        <option value="FOB">FOB - Libre a bordo</option>
                        <option value="CIF" selected>CIF - Coste, seguro y flete</option>
                        <option value="DDP">DDP - Entregado con derechos pagados</option>
                    </select>
                </div>
                <div class="form-group">
                    <label> Coste de envío</label>
                    <input type="number" id="matCosteEnvio" value="0" step="100" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Moneda envío</label>
                    <select id="matMonedaEnvio" class="u-select-glass">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${m === monedaPorDefecto ? 'selected' : ''}>${m}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <!-- ============================================ -->
            <!-- ARANCELES Y ADUANAS -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> ARANCELES Y ADUANAS</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label> % Arancel personalizado</label>
                    <input type="number" id="matArancelPersonalizado" value="0" step="1" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Gastos de aduana</label>
                    <input type="number" id="matGastosAduana" value="0" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Moneda gastos aduana</label>
                    <select id="matMonedaAduana" class="u-select-glass">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${m === monedaPorDefecto ? 'selected' : ''}>${m}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label> Notas adicionales</label>
                <textarea rows="2" id="matNotas" placeholder="Condiciones particulares..." class="u-select-glass"></textarea>
            </div>
            
            <div class="info-card-modal u-mt-16" style="background: rgba(0,122,255,0.1);">
                <small> <strong>Resumen del material:</strong><br>
                • <strong>HS Code:</strong> Se usará para comercio exterior y packing list<br>
                • <strong>Peso unitario:</strong> Se usará para calcular el peso total en logística<br>
                • <strong>País de origen:</strong> Para cálculo de aranceles
                </small>
            </div>
            
            <button class="btn btn-primary u-mt-16" onclick="guardarMaterial()" style="width:100%;"> Guardar Material</button>
        </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
    
    // Inicializar visibilidad de opciones de pago
    setTimeout(() => {
        toggleCondicionesPagoMaterial();
    }, 100);
}

// Función para mostrar/ocultar opciones de pago
function toggleCondicionesPagoMaterial() {
    const tipo = document.getElementById('matTipoPago').value;
    document.getElementById('pagoPorcentajesGroup').style.display = tipo === 'porcentajes' ? 'block' : 'none';
    document.getElementById('pagoPlazoGroup').style.display = tipo === 'plazo' ? 'block' : 'none';
    document.getElementById('pagoMixtoGroup').style.display = tipo === 'mixto' ? 'block' : 'none';
    document.getElementById('pagoContraRecepcionGroup').style.display = tipo === 'contra_recepcion' ? 'block' : 'none';
}

// Función para agregar fila de pago por porcentaje
function agregarFilaPagoMaterial() {
    const container = document.getElementById('listaTramosPagoMaterial');
    const index = container.children.length;
    
    const rowHtml = `
        <div class="form-row u-mb-8" data-tramo-index="${index}">
            <div class="form-group u-flex-2">
                <label>% tramo ${index + 2}</label>
                <input type="number" class="pagoPorcValor" value="20" min="0" max="100" step="5">
            </div>
            <div class="form-group u-flex-2">
                <label>Momento del pago</label>
                <select class="pagoPorcMomento">
                    <option value="compra">En el momento de la compra</option>
                    <option value="recepcion">En el momento de la recepción</option>
                </select>
            </div>
            <div class="form-group u-flex-1">
                <label>&nbsp;</label>
                <button class="btn btn-danger btn-small u-w-full" onclick="eliminarFilaPagoMaterial(this)"></button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', rowHtml);
}

function eliminarFilaPagoMaterial(btn) {
    btn.closest('.form-row').remove();
}
        
function guardarMaterial() {
    let nombre = document.getElementById('matNombre').value.trim();
    if (!nombre) {
        mostrarToast(tApp('toast_nombre_obligatorio'), "error");
        return;
    }
    
    let id = document.getElementById('matId').value;
    const esAgile = (proyecto.metodologia?.tipo === 'agile' || proyecto.metodologia?.tipo === 'mixto');
    
    // ============================================
    //  RECOGER HS CODE Y PESO UNITARIO
    // ============================================
    const hsCode = document.getElementById('matHsCode').value.trim() || '';
    const pesoUnitario = parseFloat(document.getElementById('matPesoUnitario').value) || 1;
    const paisOrigen = document.getElementById('matPaisOrigen').value.trim() || '';
    
    // ============================================
    // RECOGER PLAZO DE SUMINISTRO
    // ============================================
    const plazoSuministro = parseInt(document.getElementById('matPlazoSuministro').value) || 0;
    const referenciaPlazo = document.getElementById('matReferenciaPlazo').value;
    
    // ============================================
    // RECOGER CONDICIONES DE PAGO
    // ============================================
    const tipoPago = document.getElementById('matTipoPago').value;
    let condicionesPago = {
        tipo: tipoPago,
        tramos: [],
        plazoDias: 0,
        plazoReferencia: 'compra',
        porcentajeInicial: 0,
        plazoResto: 0,
        contraRecepcion: tipoPago === 'contra_recepcion'
    };
    
    if (tipoPago === 'porcentajes') {
        const porcInicial = parseFloat(document.getElementById('pagoPorcInicial').value) || 0;
        const momentoInicial = document.getElementById('pagoPorcMomentoInicial').value;
        condicionesPago.tramos.push({ porcentaje: porcInicial, momento: momentoInicial });
        
        const tramos = document.querySelectorAll('#listaTramosPagoMaterial .form-row');
        tramos.forEach(tramo => {
            const porc = parseFloat(tramo.querySelector('.pagoPorcValor')?.value) || 0;
            const momento = tramo.querySelector('.pagoPorcMomento')?.value || 'compra';
            condicionesPago.tramos.push({ porcentaje: porc, momento: momento });
        });
        
    } else if (tipoPago === 'plazo') {
        condicionesPago.plazoDias = parseInt(document.getElementById('pagoPlazoDias').value) || 0;
        condicionesPago.plazoReferencia = document.getElementById('pagoPlazoReferencia').value;
        
    } else if (tipoPago === 'mixto') {
        condicionesPago.porcentajeInicial = parseFloat(document.getElementById('pagoMixtoPorcInicial').value) || 0;
        condicionesPago.plazoResto = parseInt(document.getElementById('pagoMixtoPlazo').value) || 0;
        condicionesPago.plazoReferencia = document.getElementById('pagoMixtoReferencia').value;
    }
    
    // Construir objeto base del material
    let nuevoMaterial = {
        id: id ? parseInt(id) : Date.now(),
        nombre: nombre,
        proveedor: document.getElementById('matProveedor').value.trim(),
        partNumber: document.getElementById('matPartNumber').value.trim(),
        cantidad: parseFloat(document.getElementById('matCantidad').value),
        costeUnitario: parseFloat(document.getElementById('matCosteUnitario').value),
        moneda: document.getElementById('matMoneda').value,
        paisOrigen: paisOrigen,
        
        //  NUEVOS CAMPOS
        hsCode: hsCode,
        pesoUnitario: pesoUnitario,
        
        // Plazo de suministro
        plazoSuministro: plazoSuministro,
        referenciaPlazo: referenciaPlazo,
        fechaRecepcionEstimada: null,
        
        // Logística
        incoterm: document.getElementById('matIncoterm').value,
        costeEnvio: parseFloat(document.getElementById('matCosteEnvio').value),
        monedaEnvio: document.getElementById('matMonedaEnvio').value,
        
        // Aranceles
        arancelPersonalizado: parseFloat(document.getElementById('matArancelPersonalizado').value),
        gastosAduana: parseFloat(document.getElementById('matGastosAduana').value),
        monedaAduana: document.getElementById('matMonedaAduana').value,
        notas: document.getElementById('matNotas').value,
        
        // Condiciones de pago
        condicionesPago: condicionesPago,
        
        // Seguimiento de pagos reales
        pagosRealizados: []
    };
    
    // Calcular fecha de recepción estimada
    if (proyecto.fechaInicio) {
        const fechaBase = new Date(proyecto.fechaInicio);
        const mesCompra = nuevoMaterial.mes || 1;
        fechaBase.setMonth(fechaBase.getMonth() + (mesCompra - 1));
        
        if (plazoSuministro > 0) {
            const fechaRecepcion = new Date(fechaBase);
            fechaRecepcion.setDate(fechaRecepcion.getDate() + plazoSuministro);
            nuevoMaterial.fechaRecepcionEstimada = fechaRecepcion.toISOString().split('T')[0];
            
            const diffMeses = (fechaRecepcion.getFullYear() - new Date(proyecto.fechaInicio).getFullYear()) * 12 +
                              (fechaRecepcion.getMonth() - new Date(proyecto.fechaInicio).getMonth());
            nuevoMaterial.mesRecepcion = Math.max(1, diffMeses + 1);
        } else {
            nuevoMaterial.mesRecepcion = nuevoMaterial.mes || 1;
        }
    }
    
    // Período según metodología
    if (esAgile) {
        nuevoMaterial.sprint = parseInt(document.getElementById('matSprint')?.value) || 1;
        nuevoMaterial.historiaAsociada = document.getElementById('matHistoriaAsociada')?.value || '';
        nuevoMaterial.mes = null;
        nuevoMaterial.tipoGestion = 'agile';
    } else {
        nuevoMaterial.mes = parseInt(document.getElementById('matMes').value);
        nuevoMaterial.sprint = null;
        nuevoMaterial.historiaAsociada = null;
        nuevoMaterial.tipoGestion = 'cascada';
    }
    
    // Guardar o actualizar
    if (id) {
        let index = proyecto.materiales.findIndex(m => m.id === parseInt(id));
        if (index !== -1) proyecto.materiales[index] = nuevoMaterial;
    } else {
        if (!proyecto.materiales) proyecto.materiales = [];
        proyecto.materiales.push(nuevoMaterial);
    }
    
    guardarProyecto();
    renderizarMateriales();
    
    if (esAgile && typeof calcularCostesPorSprint === 'function') {
        setTimeout(() => calcularCostesPorSprint(), 500);
    }
    
    cerrarModalGeneric();
    
    // Mensaje con resumen
    let msgPago = '';
    if (tipoPago === 'contado') msgPago = ' (Pago de contado)';
    else if (tipoPago === 'contra_recepcion') msgPago = ` (Pago contra recepción en ${plazoSuministro} días)`;
    else if (tipoPago === 'porcentajes') msgPago = ` (${condicionesPago.tramos.length} pagos)`;
    else if (tipoPago === 'plazo') msgPago = ` (Pago a ${condicionesPago.plazoDias} días)`;
    else if (tipoPago === 'mixto') msgPago = ` (${condicionesPago.porcentajeInicial}% ahora, resto a ${condicionesPago.plazoResto} días)`;
    
    let hsCodeMsg = hsCode ? ` | HS Code: ${hsCode}` : '';
    let pesoMsg = ` | Peso: ${pesoUnitario} kg/unidad`;
    
    if (plazoSuministro > 0) {
        msgPago += `  Plazo suministro: ${plazoSuministro} días → Recepción: ${nuevoMaterial.fechaRecepcionEstimada || 'calculada'}`;
    }
    
    mostrarToast(` Material "${nombre}" guardado${msgPago}${hsCodeMsg}${pesoMsg}`, "success");
}
        
    function editarMaterial(id) {
    let material = proyecto.materiales.find(m => m.id === id);
    if (!material) return;
    
    const esAgile = (proyecto.metodologia?.tipo === 'agile' || proyecto.metodologia?.tipo === 'mixto');
    const condiciones = material.condicionesPago || { tipo: 'contado' };
    
    // Preparar valores para los campos de condiciones de pago
    let tipoPago = condiciones.tipo || 'contado';
    let porcentajeInicial = condiciones.porcentajeInicial || 50;
    let plazoResto = condiciones.plazoResto || 30;
    let plazoDias = condiciones.plazoDias || 60;
    let plazoReferencia = condiciones.plazoReferencia || 'compra';
    
    // Preparar tramos de porcentajes
    let tramosHtml = '';
    if (condiciones.tramos && condiciones.tramos.length > 0) {
        for (let i = 1; i < condiciones.tramos.length; i++) {
            const t = condiciones.tramos[i];
            tramosHtml += `
                <div class="form-row u-mb-8" data-tramo-index="${i}">
                    <div class="form-group u-flex-2">
                        <label>% tramo ${i + 1}</label>
                        <input type="number" class="pagoPorcValor" value="${t.porcentaje}" min="0" max="100" step="5">
                    </div>
                    <div class="form-group u-flex-2">
                        <label>Momento del pago</label>
                        <select class="pagoPorcMomento">
                            <option value="compra" ${t.momento === 'compra' ? 'selected' : ''}>En el momento de la compra</option>
                            <option value="recepcion" ${t.momento === 'recepcion' ? 'selected' : ''}>En el momento de la recepción</option>
                        </select>
                    </div>
                    <div class="form-group u-flex-1">
                        <label>&nbsp;</label>
                        <button class="btn btn-danger btn-small u-w-full" onclick="eliminarFilaPagoMaterial(this)"></button>
                    </div>
                </div>
            `;
        }
    }
    
    // Valores de plazo de suministro
    let plazoSuministro = material.plazoSuministro || 0;
    let referenciaPlazo = material.referenciaPlazo || 'compra';
    
    //  Obtener HS Code y peso unitario del material
    let hsCode = material.hsCode || material.partNumber || '';
    let pesoUnitario = material.pesoUnitario || 1;
    
    let modalHtml = `
        <div class="modal-content modal-lg" style="max-width: 750px;">
            <div class="modal-header">
                <h3> Editar Material: ${escapeHtml(material.nombre)}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="matId" value="${material.id}">
            
            <!-- ============================================ -->
            <!-- DATOS BÁSICOS -->
            <!-- ============================================ -->
            <div class="form-group">
                <label>Nombre del material *</label>
                <input type="text" id="matNombre" value="${escapeHtml(material.nombre)}" class="u-select-glass">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Proveedor</label>
                    <input type="text" id="matProveedor" value="${escapeHtml(material.proveedor || '')}" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Part Number / SKU</label>
                    <input type="text" id="matPartNumber" value="${escapeHtml(material.partNumber || '')}" class="u-select-glass">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Cantidad</label>
                    <input type="number" id="matCantidad" value="${material.cantidad}" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label>Coste unitario</label>
                    <input type="number" id="matCosteUnitario" value="${material.costeUnitario}" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label>Moneda</label>
                    <select id="matMoneda" class="u-select-glass">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${material.moneda === m ? 'selected' : ''}>${m} - ${MONEDAS[m]}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <!-- ============================================ -->
            <!--  NUEVO: HS CODE Y PESO UNITARIO -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> DATOS PARA COMERCIO EXTERIOR</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Peso unitario (kg)</label>
                    <input type="number" id="matPesoUnitario" value="${pesoUnitario}" step="0.1" min="0.1" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Peso por unidad del material</small>
                </div>
                <div class="form-group">
                    <label> HS Code (Código Arancelario)</label>
                    <input type="text" id="matHsCode" value="${escapeHtml(hsCode)}" placeholder="Ej: 8471.30.00" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Código para comercio internacional</small>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> País de origen</label>
                    <input type="text" id="matPaisOrigen" value="${escapeHtml(material.paisOrigen || '')}" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Para cálculo de aranceles</small>
                </div>
    `;
    
    if (esAgile) {
        modalHtml += `
                <div class="form-group">
                    <label> Sprint asociado</label>
                    <input type="number" id="matSprint" value="${material.sprint || 1}" min="1" class="u-select-glass">
                </div>
            </div>
        `;
        if (material.historiaAsociada) {
            modalHtml += `
                <div class="form-row">
                    <div class="form-group u-flex-1">
                        <label> Historia asociada</label>
                        <input type="text" id="matHistoriaAsociada" value="${escapeHtml(material.historiaAsociada || '')}" class="u-select-glass">
                    </div>
                </div>
            `;
        }
    } else {
        modalHtml += `
                <div class="form-group">
                    <label> Mes de compra</label>
                    <input type="number" id="matMes" value="${material.mes || 1}" min="1" max="36" class="u-select-glass">
                </div>
            </div>
        `;
    }
    
    modalHtml += `
            <!-- ============================================ -->
            <!-- PLAZO DE SUMINISTRO -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> PLAZO DE SUMINISTRO</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Plazo de suministro (días)</label>
                    <input type="number" id="matPlazoSuministro" value="${plazoSuministro}" min="0" max="365" step="1" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Días desde la compra hasta la recepción</small>
                </div>
                <div class="form-group">
                    <label> Fecha de referencia</label>
                    <select id="matReferenciaPlazo" class="u-select-glass">
                        <option value="compra" ${referenciaPlazo === 'compra' ? 'selected' : ''}>Desde fecha de compra</option>
                        <option value="pedido" ${referenciaPlazo === 'pedido' ? 'selected' : ''}>Desde fecha de pedido</option>
                        <option value="envio" ${referenciaPlazo === 'envio' ? 'selected' : ''}>Desde fecha de envío</option>
                    </select>
                </div>
            </div>
            
            ${material.fechaRecepcionEstimada ? `
            <div class="info-card-modal" style="margin-bottom: 12px; padding: 8px; background: rgba(0,122,255,0.1);">
                <small> <strong>Fecha de recepción estimada actual:</strong> ${material.fechaRecepcionEstimada}</small>
            </div>
            ` : ''}
            
            <!-- ============================================ -->
            <!-- CONDICIONES DE PAGO -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> CONDICIONES DE PAGO</h4>
            
            <div class="form-group">
                <label>Tipo de pago</label>
                <select id="matTipoPago" class="u-select-glass" onchange="toggleCondicionesPagoMaterial()">
                    <option value="contado" ${tipoPago === 'contado' ? 'selected' : ''}> Pago de contado (100% ahora)</option>
                    <option value="porcentajes" ${tipoPago === 'porcentajes' ? 'selected' : ''}> Pago por porcentajes</option>
                    <option value="plazo" ${tipoPago === 'plazo' ? 'selected' : ''}> Pago a plazo</option>
                    <option value="mixto" ${tipoPago === 'mixto' ? 'selected' : ''}> Mixto (porcentaje + plazo)</option>
                    <option value="contra_recepcion" ${tipoPago === 'contra_recepcion' ? 'selected' : ''}> Pago contra recepción</option>
                </select>
            </div>
            
            <!-- Opción: Pago contra recepción -->
            <div id="pagoContraRecepcionGroup" style="display: ${tipoPago === 'contra_recepcion' ? 'block' : 'none'};">
                <div class="info-card-modal" style="padding: 8px; background: rgba(0,168,89,0.15);">
                    <small> El pago se realizará <strong>contra recepción del material</strong>.</small>
                </div>
            </div>
            
            <!-- Opción: Porcentajes -->
            <div id="pagoPorcentajesGroup" style="display: ${tipoPago === 'porcentajes' ? 'block' : 'none'};">
                <label style="font-size: 12px; margin-bottom: 8px; display: block;"> Distribución de pagos</label>
                <div id="listaPorcentajesMaterial">
                    <div class="form-row u-mb-8">
                        <div class="form-group u-flex-2">
                            <label>% inicial</label>
                            <input type="number" id="pagoPorcInicial" value="${condiciones.tramos && condiciones.tramos[0] ? condiciones.tramos[0].porcentaje : 80}" min="0" max="100" step="5" class="u-select-glass">
                        </div>
                        <div class="form-group u-flex-2">
                            <label>Momento del pago</label>
                            <select id="pagoPorcMomentoInicial" class="u-select-glass">
                                <option value="compra" ${condiciones.tramos && condiciones.tramos[0] && condiciones.tramos[0].momento === 'compra' ? 'selected' : ''}>En el momento de la compra</option>
                                <option value="recepcion" ${condiciones.tramos && condiciones.tramos[0] && condiciones.tramos[0].momento === 'recepcion' ? 'selected' : ''}>En el momento de la recepción</option>
                            </select>
                        </div>
                        <div class="form-group u-flex-1">
                            <label>&nbsp;</label>
                            <button class="btn btn-secondary btn-small u-w-full" onclick="agregarFilaPagoMaterial()">+ Añadir tramo</button>
                        </div>
                    </div>
                </div>
                <div id="listaTramosPagoMaterial">
                    ${tramosHtml}
                </div>
                <small class="u-fs-11 u-color-muted"> La suma de los porcentajes debe ser 100%</small>
            </div>
            
            <!-- Opción: Plazo -->
            <div id="pagoPlazoGroup" style="display: ${tipoPago === 'plazo' ? 'block' : 'none'};">
                <div class="form-row">
                    <div class="form-group">
                        <label> Días de plazo</label>
                        <input type="number" id="pagoPlazoDias" value="${plazoDias}" min="0" max="360" step="15" class="u-select-glass">
                    </div>
                    <div class="form-group">
                        <label> Fecha de referencia</label>
                        <select id="pagoPlazoReferencia" class="u-select-glass">
                            <option value="compra" ${plazoReferencia === 'compra' ? 'selected' : ''}>Fecha de compra</option>
                            <option value="recepcion" ${plazoReferencia === 'recepcion' ? 'selected' : ''}>Fecha de recepción</option>
                            <option value="factura" ${plazoReferencia === 'factura' ? 'selected' : ''}>Fecha de factura</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Opción: Mixto -->
            <div id="pagoMixtoGroup" style="display: ${tipoPago === 'mixto' ? 'block' : 'none'};">
                <div class="form-row">
                    <div class="form-group">
                        <label> Porcentaje inicial</label>
                        <input type="number" id="pagoMixtoPorcInicial" value="${porcentajeInicial}" min="0" max="100" step="5" class="u-select-glass">
                    </div>
                    <div class="form-group">
                        <label> Plazo para el resto (días)</label>
                        <input type="number" id="pagoMixtoPlazo" value="${plazoResto}" min="0" max="360" step="15" class="u-select-glass">
                    </div>
                    <div class="form-group">
                        <label>Referencia del plazo</label>
                        <select id="pagoMixtoReferencia" class="u-select-glass">
                            <option value="compra" ${condiciones.plazoReferencia === 'compra' ? 'selected' : ''}>Desde compra</option>
                            <option value="recepcion" ${condiciones.plazoReferencia === 'recepcion' ? 'selected' : ''}>Desde recepción</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- ============================================ -->
            <!-- LOGÍSTICA Y TRANSPORTE -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> LOGÍSTICA Y TRANSPORTE</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label>INCOTERM</label>
                    <select id="matIncoterm" class="u-select-glass">
                        <option value="EXW" ${material.incoterm === 'EXW' ? 'selected' : ''}>EXW - En fábrica</option>
                        <option value="FOB" ${material.incoterm === 'FOB' ? 'selected' : ''}>FOB - Libre a bordo</option>
                        <option value="CIF" ${material.incoterm === 'CIF' ? 'selected' : ''}>CIF - Coste, seguro y flete</option>
                        <option value="DDP" ${material.incoterm === 'DDP' ? 'selected' : ''}>DDP - Entregado con derechos pagados</option>
                    </select>
                </div>
                <div class="form-group">
                    <label> Coste de envío</label>
                    <input type="number" id="matCosteEnvio" value="${material.costeEnvio || 0}" step="100" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Moneda envío</label>
                    <select id="matMonedaEnvio" class="u-select-glass">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${(material.monedaEnvio || material.moneda) === m ? 'selected' : ''}>${m}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Seguro de transporte (%)</label>
                    <input type="number" id="matSeguro" value="${material.seguroPorcentaje || 0}" step="0.5" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Seguro de transporte (fijo)</label>
                    <input type="number" id="matSeguroFijo" value="${material.seguroFijo || 0}" class="u-select-glass">
                </div>
            </div>
            
            <!-- ============================================ -->
            <!-- ARANCELES Y ADUANAS -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> ARANCELES Y ADUANAS</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label> % Arancel personalizado</label>
                    <input type="number" id="matArancelPersonalizado" value="${material.arancelPersonalizado || 0}" step="1" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Gastos de aduana</label>
                    <input type="number" id="matGastosAduana" value="${material.gastosAduana || 0}" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Moneda gastos aduana</label>
                    <select id="matMonedaAduana" class="u-select-glass">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${(material.monedaAduana || material.moneda) === m ? 'selected' : ''}>${m}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label> Notas adicionales</label>
                <textarea rows="2" id="matNotas" class="u-select-glass">${escapeHtml(material.notas || '')}</textarea>
            </div>
            
            <div class="info-card-modal u-mt-16" style="background: rgba(0,122,255,0.1);">
                <small> <strong>Resumen del material:</strong><br>
                • <strong>HS Code:</strong> ${hsCode || 'No definido'} - Se usará en el packing list<br>
                • <strong>Peso unitario:</strong> ${pesoUnitario} kg - Se usará para calcular el peso total<br>
                • <strong>País de origen:</strong> ${material.paisOrigen || 'No definido'} - Para cálculo de aranceles
                </small>
            </div>
            
            <button class="btn btn-primary u-mt-16" onclick="guardarMaterial()" style="width:100%;"> Actualizar Material</button>
        </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
    
    // Inicializar la visibilidad de las opciones de pago
    setTimeout(() => {
        toggleCondicionesPagoMaterial();
    }, 100);
}

        function eliminarMaterial(id) {
            if (confirm(tApp('confirmar_eliminar_material'))) { proyecto.materiales = proyecto.materiales.filter(m => m.id !== id); guardarProyecto(); renderizarMateriales(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
        
        function actualizarArancelesMateriales() { if (typeof calcularAnalisisMateriales === 'function') calcularAnalisisMateriales(); mostrarToast(" Aranceles actualizados", 'info'); }
        
        // ============================================

        // ============================================
        // EQUIPO
        // ============================================
        function renderizarEquipo() {
            const tbody = document.getElementById('equipoBody');
            if (!proyecto.equipo) proyecto.equipo = [];
            if (proyecto.equipo.length === 0) { tbody.innerHTML = '<tr><td colspan="7">No hay personal</td></tr>'; return; }
            tbody.innerHTML = proyecto.equipo.map(r => `<tr><td>${escapeHtml(r.nombre)}</td><td>${escapeHtml(r.rol || '')}</td><td>${escapeHtml(r.email || '')}</td><td>${r.costeHora}</td><td>${r.moneda}</td><td>${r.horasMes}</td><td><span class="edit-btn" onclick="editarEquipo(${r.id})"></span><span class="delete-btn" onclick="eliminarEquipo(${r.id})"></span></td></tr>`).join('');
            calcularCashflow();
        }
        
        function abrirModalEquipo() {
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Nuevo Miembro</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="eqId"><div class="form-group"><label>Nombre</label><input type="text" id="eqNombre"></div>
                <div class="form-group"><label>Rol</label><input type="text" id="eqRol"></div>
                <div class="form-group"><label>Email</label><input type="email" id="eqEmail"></div>
                <div class="form-row"><div class="form-group"><label>Coste/h</label><input type="number" id="eqCosteHora" value="50"></div>
                <div class="form-group"><label>Moneda</label><select id="eqMoneda">${Object.keys(MONEDAS).map(m => `<option value="${m}">${m}</option>`).join('')}</select></div>
                <div class="form-group"><label>Horas/mes</label><input type="number" id="eqHorasMes" value="160"></div></div>
                <button class="btn btn-primary" onclick="guardarEquipo()">Guardar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function guardarEquipo() {
            let nombre = document.getElementById('eqNombre').value.trim();
            if (!nombre) { mostrarToast(tApp('toast_nombre_obligatorio'), 'error'); return; }
            let id = document.getElementById('eqId').value;
            let miembro = {
                id: id ? parseInt(id) : Date.now(), nombre: nombre, rol: document.getElementById('eqRol').value, email: document.getElementById('eqEmail').value,
                costeHora: parseFloat(document.getElementById('eqCosteHora').value), moneda: document.getElementById('eqMoneda').value,
                horasMes: parseFloat(document.getElementById('eqHorasMes').value)
            };
            if (id) { let idx = proyecto.equipo.findIndex(m => m.id === parseInt(id)); if (idx >= 0) proyecto.equipo[idx] = miembro; }
            else { if (!proyecto.equipo) proyecto.equipo = []; proyecto.equipo.push(miembro); }
            guardarProyecto(); renderizarEquipo(); cerrarModalGeneric(); mostrarToast(` Miembro guardado`, 'success');
        }
        
        function editarEquipo(id) {
            let m = proyecto.equipo.find(m => m.id === id);
            if (!m) return;
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Editar</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="eqId" value="${m.id}"><div class="form-group"><label>Nombre</label><input type="text" id="eqNombre" value="${escapeHtml(m.nombre)}"></div>
                <div class="form-group"><label>Rol</label><input type="text" id="eqRol" value="${escapeHtml(m.rol || '')}"></div>
                <div class="form-group"><label>Email</label><input type="email" id="eqEmail" value="${escapeHtml(m.email || '')}"></div>
                <div class="form-row"><div class="form-group"><label>Coste/h</label><input type="number" id="eqCosteHora" value="${m.costeHora}"></div>
                <div class="form-group"><label>Moneda</label><select id="eqMoneda">${Object.keys(MONEDAS).map(c => `<option value="${c}" ${m.moneda === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
                <div class="form-group"><label>Horas/mes</label><input type="number" id="eqHorasMes" value="${m.horasMes}"></div></div>
                <button class="btn btn-primary" onclick="guardarEquipo()">Actualizar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function eliminarEquipo(id) {
            if (confirm(tApp('confirmar_eliminar_miembro'))) { proyecto.equipo = proyecto.equipo.filter(m => m.id !== id); guardarProyecto(); renderizarEquipo(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
        
        // ============================================
        // SERVICIOS
        // ============================================
        function renderizarServicios() {
            const tbody = document.getElementById('serviciosBody');
            if (!proyecto.servicios) proyecto.servicios = [];
            if (proyecto.servicios.length === 0) { tbody.innerHTML = '<tr><td colspan="9">No hay servicios</td></tr>'; return; }
            tbody.innerHTML = proyecto.servicios.map(s => {
                let total = s.cantidad * s.costeUnitario * (1 + (s.impuesto || 0) / 100);
                return `<tr><td>${escapeHtml(s.nombre)}</td><td>${escapeHtml(s.proveedor || '')}</td><td>${s.cantidad}</td><td>${s.costeUnitario}</td><td>${s.moneda}</td><td>${s.impuesto || 0}%</td><td>${formatearMoneda(convertirMoneda(total, s.moneda))}</td><td>Mes ${s.mes || 1}</td><td><span class="edit-btn" onclick="editarServicio(${s.id})"></span><span class="delete-btn" onclick="eliminarServicio(${s.id})"></span></td></tr>`;
            }).join('');
            calcularCashflow();
        }
        
        function abrirModalServicio() {
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Nuevo Servicio</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="serId"><div class="form-group"><label>Nombre</label><input type="text" id="serNombre"></div>
                <div class="form-group"><label>Proveedor</label><input type="text" id="serProveedor"></div>
                <div class="form-row"><div class="form-group"><label>Cantidad</label><input type="number" id="serCantidad" value="1"></div>
                <div class="form-group"><label>Coste unitario</label><input type="number" id="serCosteUnitario" value="500"></div>
                <div class="form-group"><label>Moneda</label><select id="serMoneda">${Object.keys(MONEDAS).map(m => `<option value="${m}">${m}</option>`).join('')}</select></div></div>
                <div class="form-row"><div class="form-group"><label>Impuesto %</label><input type="number" id="serImpuesto" value="21"></div>
                <div class="form-group"><label>Mes</label><input type="number" id="serMes" value="1"></div></div>
                <button class="btn btn-primary" onclick="guardarServicio()">Guardar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function guardarServicio() {
            let nombre = document.getElementById('serNombre').value.trim();
            if (!nombre) { mostrarToast(tApp('toast_nombre_obligatorio'), 'error'); return; }
            let id = document.getElementById('serId').value;
            let servicio = {
                id: id ? parseInt(id) : Date.now(), nombre: nombre, proveedor: document.getElementById('serProveedor').value,
                cantidad: parseFloat(document.getElementById('serCantidad').value), costeUnitario: parseFloat(document.getElementById('serCosteUnitario').value),
                moneda: document.getElementById('serMoneda').value, impuesto: parseFloat(document.getElementById('serImpuesto').value),
                mes: parseInt(document.getElementById('serMes').value)
            };
            if (id) { let idx = proyecto.servicios.findIndex(s => s.id === parseInt(id)); if (idx >= 0) proyecto.servicios[idx] = servicio; }
            else { if (!proyecto.servicios) proyecto.servicios = []; proyecto.servicios.push(servicio); }
            guardarProyecto(); renderizarServicios(); cerrarModalGeneric(); mostrarToast(` Servicio guardado`, 'success');
        }
        
        function editarServicio(id) {
            let s = proyecto.servicios.find(s => s.id === id);
            if (!s) return;
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Editar</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="serId" value="${s.id}"><div class="form-group"><label>Nombre</label><input type="text" id="serNombre" value="${escapeHtml(s.nombre)}"></div>
                <div class="form-group"><label>Proveedor</label><input type="text" id="serProveedor" value="${escapeHtml(s.proveedor || '')}"></div>
                <div class="form-row"><div class="form-group"><label>Cantidad</label><input type="number" id="serCantidad" value="${s.cantidad}"></div>
                <div class="form-group"><label>Coste unitario</label><input type="number" id="serCosteUnitario" value="${s.costeUnitario}"></div>
                <div class="form-group"><label>Moneda</label><select id="serMoneda">${Object.keys(MONEDAS).map(c => `<option value="${c}" ${s.moneda === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div></div>
                <div class="form-row"><div class="form-group"><label>Impuesto %</label><input type="number" id="serImpuesto" value="${s.impuesto}"></div>
                <div class="form-group"><label>Mes</label><input type="number" id="serMes" value="${s.mes || 1}"></div></div>
                <button class="btn btn-primary" onclick="guardarServicio()">Actualizar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function eliminarServicio(id) {
            if (confirm(tApp('confirmar_eliminar_servicio'))) { proyecto.servicios = proyecto.servicios.filter(s => s.id !== id); guardarProyecto(); renderizarServicios(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
        
        // ============================================
        // COMUNICACIONES Y REUNIONES
        // ============================================
        function renderizarComunicaciones() {
            const tbody = document.getElementById('comunicacionesBody');
            if (!proyecto.comunicaciones) proyecto.comunicaciones = [];
            if (proyecto.comunicaciones.length === 0) { tbody.innerHTML = '<tr><td colspan="7">No hay comunicaciones</td></tr>'; return; }
            tbody.innerHTML = proyecto.comunicaciones.map(c => `<tr><td>${c.fecha || '-'}</td><td><span class="badge-pais">${c.tipo || '-'}</span></td><td>${escapeHtml(c.con || '')}</td><td><strong>${escapeHtml(c.asunto || '')}</strong></td><td>${escapeHtml((c.contenido || '').substring(0, 100))}${(c.contenido || '').length > 100 ? '...' : ''}</td><td>${c.archivoNombre ? `<span class="edit-btn" onclick="descargarArchivoComunicacion(${c.id})"> ${escapeHtml(c.archivoNombre)}</span>` : '-'}</td><td><span class="edit-btn" onclick="editarComunicacion(${c.id})"></span><span class="delete-btn" onclick="eliminarComunicacion(${c.id})"></span></td></tr>`).join('');
        }
        
        function abrirModalNuevaComunicacion() {
            const tipos = ['Email', 'Llamada', 'WhatsApp', 'Reunión', 'Carta', 'Otro'];
            const modalHtml = `<div class="modal-content modal-500"><div class="modal-header"><h3> Nueva Comunicación</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="comId"><div class="form-group"><label>Fecha</label><input type="date" id="comFecha" value="${new Date().toISOString().split('T')[0]}"></div>
                <div class="form-group"><label>Tipo</label><select id="comTipo">${tipos.map(t => `<option value="${t}">${t}</option>`).join('')}</select></div>
                <div class="form-group"><label>Con</label><input type="text" id="comCon"></div>
                <div class="form-group"><label>Asunto</label><input type="text" id="comAsunto"></div>
                <div class="form-group"><label>Contenido</label><textarea rows="3" id="comContenido"></textarea></div>
                <div class="form-group"><label>Archivo</label><input type="file" id="comArchivo" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png"></div>
                <button class="btn btn-primary" onclick="guardarComunicacion()">Guardar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        async function guardarComunicacion() {
            let id = document.getElementById('comId').value;
            let asunto = document.getElementById('comAsunto').value;
            if (!asunto) { mostrarToast(tApp('toast_asunto_obligatorio'), 'error'); return; }
            let archivoBase64 = null, archivoNombre = null;
            const archivoInput = document.getElementById('comArchivo');
            if (archivoInput.files.length > 0) { archivoNombre = archivoInput.files[0].name; archivoBase64 = await leerArchivoComoBase64(archivoInput.files[0]); }
            let comunicacion = {
                id: id ? parseInt(id) : Date.now(), fecha: document.getElementById('comFecha').value, tipo: document.getElementById('comTipo').value,
                con: document.getElementById('comCon').value, asunto: asunto, contenido: document.getElementById('comContenido').value,
                archivo: archivoBase64, archivoNombre: archivoNombre
            };
            if (!proyecto.comunicaciones) proyecto.comunicaciones = [];
            if (id) { let idx = proyecto.comunicaciones.findIndex(c => c.id === parseInt(id)); if (idx >= 0) { if (!archivoBase64 && proyecto.comunicaciones[idx].archivo) { comunicacion.archivo = proyecto.comunicaciones[idx].archivo; comunicacion.archivoNombre = proyecto.comunicaciones[idx].archivoNombre; } proyecto.comunicaciones[idx] = comunicacion; } }
            else { proyecto.comunicaciones.push(comunicacion); }
            guardarProyecto(); renderizarComunicaciones(); cerrarModalGeneric(); mostrarToast(` Comunicación guardada`, 'success');
        }
        
        function editarComunicacion(id) {
            let c = proyecto.comunicaciones.find(c => c.id === id);
            if (!c) return;
            const tipos = ['Email', 'Llamada', 'WhatsApp', 'Reunión', 'Carta', 'Otro'];
            const modalHtml = `<div class="modal-content modal-500"><div class="modal-header"><h3> Editar</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="comId" value="${c.id}"><div class="form-group"><label>Fecha</label><input type="date" id="comFecha" value="${c.fecha || ''}"></div>
                <div class="form-group"><label>Tipo</label><select id="comTipo">${tipos.map(t => `<option value="${t}" ${c.tipo === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
                <div class="form-group"><label>Con</label><input type="text" id="comCon" value="${escapeHtml(c.con || '')}"></div>
                <div class="form-group"><label>Asunto</label><input type="text" id="comAsunto" value="${escapeHtml(c.asunto || '')}"></div>
                <div class="form-group"><label>Contenido</label><textarea rows="3" id="comContenido">${escapeHtml(c.contenido || '')}</textarea></div>
                <div class="form-group"><label>Archivo</label><input type="file" id="comArchivo" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png"><small>Dejar vacío para mantener actual</small></div>
                <button class="btn btn-primary" onclick="guardarComunicacion()">Actualizar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function eliminarComunicacion(id) {
            if (confirm(tApp('confirmar_eliminar'))) { proyecto.comunicaciones = proyecto.comunicaciones.filter(c => c.id !== id); guardarProyecto(); renderizarComunicaciones(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
        
        function descargarArchivoComunicacion(id) {
            let c = proyecto.comunicaciones.find(c => c.id === id);
            if (c && c.archivo && c.archivoNombre) { const link = document.createElement('a'); link.href = c.archivo; link.download = c.archivoNombre; link.click(); mostrarToast(` Descargando ${c.archivoNombre}`, 'success'); }
            else { mostrarToast(" No hay archivo", 'error'); }
        }
        
        function renderizarReuniones() {
            const container = document.getElementById('listaReuniones');
            if (!proyecto.reuniones) proyecto.reuniones = [];
            if (proyecto.reuniones.length === 0) { container.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><p>No hay reuniones registradas</p></div>'; return; }
            container.innerHTML = proyecto.reuniones.map(r => `<div class="reunion-card"><div class="reunion-titulo"><span> ${escapeHtml(r.titulo || 'Reunión')}</span><div><span class="edit-btn" onclick="editarReunion(${r.id})"></span><span class="delete-btn" onclick="eliminarReunion(${r.id})"></span></div></div><div class="reunion-fecha"> ${r.fecha ? formatearFechaEspa(r.fecha) : '-'}</div><div class="reunion-asistentes"> Asistentes: ${escapeHtml((r.asistentes || []).join(', ') || '-')}</div><div class="reunion-acuerdos"><strong>Acuerdos:</strong><br>${escapeHtml((r.acuerdos || '').substring(0, 150))}${(r.acuerdos || '').length > 150 ? '...' : ''}</div><div class="reunion-acciones"><strong>Acciones:</strong><br>${escapeHtml((r.acciones || '').substring(0, 150))}${(r.acciones || '').length > 150 ? '...' : ''}</div>${r.pdfNombre ? `<div class="reunion-pdf-actions"><button class="btn btn-secondary btn-small" onclick="abrirVisorPdf(${r.id})"> Ver PDF</button><button class="btn btn-secondary btn-small" onclick="descargarPdfReunion(${r.id})"> Descargar PDF</button></div>` : '<div class="reunion-pdf-actions"><span class="u-color-muted"> Sin acta PDF</span></div>'}</div>`).join('');
        }
        
        function abrirModalNuevaReunion() {
            const modalHtml = `<div class="modal-content modal-600"><div class="modal-header"><h3> Nueva Reunión</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="reunionId"><div class="form-group"><label>Título</label><input type="text" id="reunionTitulo"></div>
                <div class="form-group"><label>Fecha</label><input type="date" id="reunionFecha" value="${new Date().toISOString().split('T')[0]}"></div>
                <div class="form-group"><label>Asistentes</label><input type="text" id="reunionAsistentes" placeholder="Juan, María, etc"></div>
                <div class="form-group"><label>Orden del día</label><textarea rows="2" id="reunionOrdenDia"></textarea></div>
                <div class="form-group"><label>Acuerdos</label><textarea rows="3" id="reunionAcuerdos"></textarea></div>
                <div class="form-group"><label>Acciones</label><textarea rows="2" id="reunionAcciones"></textarea></div>
                <div class="form-group"><label>PDF</label><input type="file" id="reunionPdf" accept=".pdf"></div>
                <button class="btn btn-primary" onclick="guardarReunion()">Guardar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        async function guardarReunion() {
            let id = document.getElementById('reunionId').value;
            let titulo = document.getElementById('reunionTitulo').value.trim();
            if (!titulo) { mostrarToast(tApp('toast_titulo_obligatorio'), 'error'); return; }
            let asistentesStr = document.getElementById('reunionAsistentes').value;
            let asistentes = asistentesStr ? asistentesStr.split(',').map(a => a.trim()) : [];
            let pdfBase64 = null, pdfNombre = null;
            const pdfInput = document.getElementById('reunionPdf');
            if (pdfInput.files.length > 0 && pdfInput.files[0].type === 'application/pdf') { pdfNombre = pdfInput.files[0].name; pdfBase64 = await leerArchivoComoBase64(pdfInput.files[0]); }
            let reunion = {
                id: id ? parseInt(id) : Date.now(), fecha: document.getElementById('reunionFecha').value, titulo: titulo, asistentes: asistentes,
                ordenDia: document.getElementById('reunionOrdenDia').value, acuerdos: document.getElementById('reunionAcuerdos').value,
                acciones: document.getElementById('reunionAcciones').value, pdfBase64: pdfBase64, pdfNombre: pdfNombre
            };
            if (!proyecto.reuniones) proyecto.reuniones = [];
            if (id) { let idx = proyecto.reuniones.findIndex(r => r.id === parseInt(id)); if (idx >= 0) { if (!pdfBase64 && proyecto.reuniones[idx].pdfBase64) { reunion.pdfBase64 = proyecto.reuniones[idx].pdfBase64; reunion.pdfNombre = proyecto.reuniones[idx].pdfNombre; } proyecto.reuniones[idx] = reunion; } }
            else { proyecto.reuniones.push(reunion); }
            guardarProyecto(); renderizarReuniones(); cerrarModalGeneric(); mostrarToast(` Minuta guardada`, 'success');
        }
        
        function editarReunion(id) {
            let r = proyecto.reuniones.find(r => r.id === id);
            if (!r) return;
            const modalHtml = `<div class="modal-content modal-600"><div class="modal-header"><h3> Editar</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="reunionId" value="${r.id}"><div class="form-group"><label>Título</label><input type="text" id="reunionTitulo" value="${escapeHtml(r.titulo || '')}"></div>
                <div class="form-group"><label>Fecha</label><input type="date" id="reunionFecha" value="${r.fecha || ''}"></div>
                <div class="form-group"><label>Asistentes</label><input type="text" id="reunionAsistentes" value="${escapeHtml((r.asistentes || []).join(', '))}"></div>
                <div class="form-group"><label>Orden del día</label><textarea rows="2" id="reunionOrdenDia">${escapeHtml(r.ordenDia || '')}</textarea></div>
                <div class="form-group"><label>Acuerdos</label><textarea rows="3" id="reunionAcuerdos">${escapeHtml(r.acuerdos || '')}</textarea></div>
                <div class="form-group"><label>Acciones</label><textarea rows="2" id="reunionAcciones">${escapeHtml(r.acciones || '')}</textarea></div>
                <div class="form-group"><label>PDF</label><input type="file" id="reunionPdf" accept=".pdf"><small>Actual: ${r.pdfNombre || 'ninguno'}</small></div>
                <button class="btn btn-primary" onclick="guardarReunion()">Actualizar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function eliminarReunion(id) {
            if (confirm(tApp('confirmar_eliminar_minuta'))) { proyecto.reuniones = proyecto.reuniones.filter(r => r.id !== id); guardarProyecto(); renderizarReuniones(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
        
        function abrirVisorPdf(reunionId) {
            let r = proyecto.reuniones.find(r => r.id === reunionId);
            if (r && r.pdfBase64) { pdfActualBase64 = r.pdfBase64; pdfActualNombre = r.pdfNombre; document.getElementById('visorPdfTitulo').innerHTML = ` ${escapeHtml(r.titulo || 'Acta')} - ${r.pdfNombre || 'PDF'}`; document.getElementById('visorPdfFrame').src = r.pdfBase64; document.getElementById('visorPdfModal').style.display = 'flex'; }
            else { mostrarToast(tApp('toast_no_hay_pdf'), 'error'); }
        }
        
        function cerrarVisorPdf() { document.getElementById('visorPdfModal').style.display = 'none'; document.getElementById('visorPdfFrame').src = ''; pdfActualBase64 = null; pdfActualNombre = null; }
        function descargarPdfActual() { if (pdfActualBase64 && pdfActualNombre) { const link = document.createElement('a'); link.href = pdfActualBase64; link.download = pdfActualNombre; link.click(); mostrarToast(` Descargando ${pdfActualNombre}`, 'success'); } }
        function descargarPdfReunion(reunionId) { let r = proyecto.reuniones.find(r => r.id === reunionId); if (r && r.pdfBase64 && r.pdfNombre) { const link = document.createElement('a'); link.href = r.pdfBase64; link.download = r.pdfNombre; link.click(); mostrarToast(` Descargando ${r.pdfNombre}`, 'success'); } else { mostrarToast(tApp('toast_no_hay_pdf'), 'error'); } }
        
        function mostrarSubpanelComunicaciones(subpanel, btn) {
            document.querySelectorAll('.subpanel-comunicaciones').forEach(el => el.style.display = 'none');
            document.getElementById(`subpanel${subpanel.charAt(0).toUpperCase() + subpanel.slice(1)}`).style.display = 'block';
            document.querySelectorAll('.btn-tab').forEach(b => { b.style.color = 'rgba(255,255,255,0.7)'; b.style.borderBottom = 'none'; });
            btn.style.color = '#007AFF'; btn.style.borderBottom = '2px solid #007AFF';
            if (subpanel === 'reuniones') renderizarReuniones();
            if (subpanel === 'comunicaciones') renderizarComunicaciones();
        }
        
        // ============================================
        // CRONOGRAMA GANTT
        // ============================================
 function cargarElementosGantt() {
    if (!proyecto.elementosGantt) proyecto.elementosGantt = [];
    if (proyecto.elementosGantt.length === 0) {
        const fechaInicio = proyecto.fechaInicio || new Date().toISOString().split('T')[0];
        proyecto.elementosGantt = [
            { id: Date.now() + 1, tipo: 'edt', nombre: '1. Inicio del Proyecto', inicio: fechaInicio, duracion: 5, progreso: 0, responsable: '', dependeDe: null },
            { id: Date.now() + 2, tipo: 'actividad', nombre: 'Acta de Constitución', inicio: fechaInicio, duracion: 3, progreso: 0, responsable: 'PM', dependeDe: null },
            { id: Date.now() + 3, tipo: 'entregable', nombre: 'Documento del Proyecto', inicio: fechaInicio, duracion: 7, progreso: 0, responsable: '', dependeDe: null },
            { id: Date.now() + 4, tipo: 'hito', nombre: 'Aprobación del Acta', inicio: sumarDias(fechaInicio, 7), duracion: 0, progreso: 100, responsable: '', dependeDe: null }
        ];
        guardarProyecto();
    }
    
    //  ASIGNAR CÓDIGOS JERÁRQUICOS INICIALES
    // reordenarNumeracionElementos(); // Función no implementada - comentada
    
    renderizarTablaGantt();
    renderizarGanttUnificado();
}
        
        function sumarDias(fechaStr, dias) { const fecha = new Date(fechaStr); fecha.setDate(fecha.getDate() + dias); return fecha.toISOString().split('T')[0]; }
        
function renderizarTablaGantt() {
    const container = document.getElementById('ganttCardList');
    if (!container) return;
    let elementos = [...(proyecto.elementosGantt || [])];
    const filtro = document.getElementById('filtroTipoGantt')?.value || 'todos';
    const busqueda = document.getElementById('buscarGantt')?.value.toLowerCase() || '';
    
    if (filtro !== 'todos') elementos = elementos.filter(e => e.tipo === filtro);
    if (busqueda) elementos = elementos.filter(e => e.nombre.toLowerCase().includes(busqueda));
    
    elementos.sort((a, b) => {
        const codA = obtenerCodigoElemento(a, elementos) || '';
        const codB = obtenerCodigoElemento(b, elementos) || '';
        return compararCodigosJerarquicos(codA, codB);
    });
    
    if (elementos.length === 0) { 
        container.innerHTML = '<div class="u-text-center" style="padding:32px;color:var(--text-muted);font-size:13px;">No hay elementos</div>'; 
        return; 
    }
    
    var typeColors = { edt: 'type-edt', actividad: 'type-actividad', entregable: 'type-entregable', hito: 'type-hito' };
    var typeIcons = { edt: '', actividad: '', entregable: '', hito: '' };
    
    container.innerHTML = '<div class="gantt-card-list">' + elementos.map(function(e) {
        var fechaFinPlan = e.inicio && e.duracion ? sumarDias(e.inicio, e.duracion) : '-';
        var desviacion = calcularDesviacion(e);
        var desviacionClass = desviacion > 0 ? 'late' : (desviacion < 0 ? 'ahead' : 'on-time');
        var desviacionTexto = desviacion > 0 ? '+' + desviacion + 'd' : (desviacion < 0 ? desviacion + 'd' : 'On time');
        var codigo = e.codigo || obtenerCodigoElemento(e, elementos);
        var esEDT = (e.tipo === 'edt');
        var costeTarea = e.costeEstimado || 0;
        var costeMoneda = e.recursoAsignado?.moneda || proyecto.monedaBase;
        var recursoNombre = e.recursoAsignado?.nombre || '';
        var progress = e.progreso || 0;
        var progressColor = progress >= 100 ? '#00A859' : (progress >= 50 ? '#FF9500' : '#FF3B30');
        var initials = recursoNombre ? recursoNombre.split(' ').map(function(s){return s[0]}).join('').substring(0,2).toUpperCase() : '';
        var edtAttr = esEDT ? ' data-edt-id="' + e.id + '"' : '';
        
        var costHtml = costeTarea > 0 ? '<span class="gantt-card-cost">' + formatearMoneda(convertirMoneda(costeTarea, costeMoneda)) + '</span>' : '<span class="gantt-card-cost no-cost">-</span>';
        
        return '<div class="gantt-card">' +
            '<input type="checkbox" class="select-elemento" data-id="' + e.id + '" style="flex-shrink:0;">' +
            '<div class="gantt-card-type ' + (typeColors[e.tipo] || '') + '">' + (typeIcons[e.tipo] || '') + '</div>' +
            '<div class="gantt-card-body">' +
            '<div><span class="gantt-card-name"' + edtAttr + '>' + (codigo ? '<span class="gantt-card-code">[' + codigo + ']</span> ' : '') + escapeHtml(e.nombre) + '</span></div>' +
            '<div class="gantt-card-meta">' +
            '<span> ' + formatearFechaEspa(e.inicio) + '</span>' +
            '<span> ' + (e.duracion || 0) + 'd</span>' +
            '<span> ' + (fechaFinPlan ? formatearFechaEspa(fechaFinPlan) : '-') + '</span>' +
            (e.dependeDe ? '<span> ' + escapeHtml(getNombreElemento(e.dependeDe)) + '</span>' : '') +
            '</div>' +
            '<div class="gantt-card-dates" style="margin-top:4px;">' +
            '<input type="date" class="fecha-real-input" data-id="' + e.id + '" data-tipo="inicio" value="' + (e.inicioReal || '') + '" placeholder="Inicio real">' +
            '<input type="date" class="fecha-real-input" data-id="' + e.id + '" data-tipo="fin" value="' + (e.finReal || '') + '" placeholder="Fin real">' +
            '</div>' +
            '</div>' +
            '<div class="gantt-card-progress">' +
            '<div class="gantt-progress-bar"><div class="gantt-progress-fill" style="width:' + progress + '%;background:' + progressColor + ';"></div></div>' +
            '<div class="gantt-progress-text">' + progress + '%</div>' +
            '</div>' +
            '<div class="gantt-desviacion ' + desviacionClass + '">' + desviacionTexto + '</div>' +
            (recursoNombre ? '<div class="gantt-card-responsible"><div class="gantt-avatar">' + initials + '</div><span class="gantt-avatar-name">' + escapeHtml(recursoNombre) + '</span></div>' : '') +
            costHtml +
            '<div class="gantt-card-actions">' +
            '<button class="gantt-edit-btn" onclick="editarElementoGantt(' + e.id + ')"></button>' +
            '<button class="gantt-delete-btn" onclick="eliminarElementoGantt(' + e.id + ')"></button>' +
            '</div>' +
            '</div>';
    }).join('') + '</div>';
    
    document.querySelectorAll('.fecha-real-input').forEach(function(input) {
        input.removeEventListener('change', handleFechaRealChange);
        input.addEventListener('change', handleFechaRealChange);
    });
}

function handleFechaRealChange(e) {
    const id = parseInt(e.target.dataset.id);
    const tipo = e.target.dataset.tipo;
    const valor = e.target.value;
    
    const elemento = proyecto.elementosGantt?.find(el => el.id === id);
    if (elemento) {
        if (tipo === 'inicio') {
            elemento.inicioReal = valor || null;
            if (elemento.finReal && valor) {
                const diffTime = new Date(elemento.finReal) - new Date(valor);
                elemento.duracionReal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
        } else if (tipo === 'fin') {
            elemento.finReal = valor || null;
            if (elemento.inicioReal && valor) {
                const diffTime = new Date(valor) - new Date(elemento.inicioReal);
                elemento.duracionReal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
            if (elemento.progreso === 100 && !elemento.finReal) {
                elemento.finReal = valor;
            }
        }
        guardarProyecto();
        renderizarTablaGantt();
        renderizarGanttUnificado();
        
        //  NUEVO: Recalcular Cashflow al actualizar fechas reales
        calcularCashflow();
        
        mostrarToast(` Fecha real actualizada para "${elemento.nombre}"`, 'success');
    }
}

function calcularDesviacion(elemento) {
    if (!elemento.inicio || !elemento.finReal) return 0;
    const fechaFinPlan = new Date(sumarDias(elemento.inicio, elemento.duracion));
    const fechaFinReal = new Date(elemento.finReal);
    const desviacion = Math.ceil((fechaFinReal - fechaFinPlan) / (1000 * 60 * 60 * 24));
    return desviacion;
}
        
        function getTipoIcono(tipo) { const iconos = { edt: '', actividad: '', entregable: '', hito: '' }; return iconos[tipo] || ''; }
        function getNombreElemento(id) { const elem = proyecto.elementosGantt?.find(e => e.id === id); return elem ? elem.nombre : '-'; }
        
        function actualizarProgresoGantt(id, valor) {
            const elem = proyecto.elementosGantt?.find(e => e.id === id);
            if (elem) { elem.progreso = parseInt(valor); guardarProyecto(); renderizarTablaGantt(); renderizarGanttUnificado(); mostrarToast(` Progreso actualizado a ${valor}%`, 'success'); }
        }
        
        function abrirModalNuevoElementoGantt() {
    const hoy = new Date().toISOString().split('T')[0];
    
    // Generar opciones de EDTs
    let edtOptions = '<option value="">-- Ninguno --</option>';
    if (proyecto.elementosGantt) {
        proyecto.elementosGantt.filter(e => e.tipo === 'edt').forEach(edt => {
            edtOptions += `<option value="${edt.id}">${escapeHtml(edt.nombre)}</option>`;
        });
    }
    
    //  Generar opciones de recursos desde el panel EQUIPO
    let recursoOptions = '<option value="">-- Sin asignar --</option>';
    if (proyecto.equipo && proyecto.equipo.length > 0) {
        proyecto.equipo.forEach(m => {
            recursoOptions += `<option value="${m.id}">${escapeHtml(m.nombre)} (${escapeHtml(m.rol || 'Sin rol')}) - ${m.costeHora} ${m.moneda}/hora</option>`;
        });
    } else {
        recursoOptions += '<option value="" disabled> No hay recursos en "Equipo" - Añádelos primero</option>';
    }
    
    const modalHtml = `<div class="modal-content modal-sm">
        <div class="modal-header">
            <h3> Nuevo Elemento</h3>
            <span class="close-modal" onclick="cerrarModalNuevoElemento()">&times;</span>
        </div>
        
        <div class="form-group">
            <label>Tipo</label>
            <select id="nuevoTipo" class="u-select-glass">
                <option value="edt"> EDT</option>
                <option value="actividad"> Actividad</option>
                <option value="entregable"> Entregable</option>
                <option value="hito"> Hito</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>Nombre *</label>
            <input type="text" id="nuevoNombre" class="u-select-glass" placeholder="Ej: Desarrollo del Módulo X">
        </div>
        
        <div class="form-row">
            <div class="form-group u-flex-1">
                <label> Fecha inicio</label>
                <input type="date" id="nuevoInicio" class="u-select-glass" value="${hoy}">
            </div>
            <div class="form-group u-flex-1">
                <label> Duración (días)</label>
                <input type="number" id="nuevoDuracion" class="u-select-glass" value="5">
            </div>
        </div>
        
        <!--  NUEVO: Asignación de recursos desde EQUIPO -->
        <div class="form-group">
            <label> Recurso asignado (desde Equipo)</label>
            <select id="nuevoRecursoId" class="u-select-glass">
                ${recursoOptions}
            </select>
            <small class="u-fs-11 u-color-muted"> Selecciona una persona del equipo. Sus datos de coste/hora se usarán para calcular el coste de esta tarea.</small>
        </div>
        
        <div class="form-row">
            <div class="form-group u-flex-1">
                <label> Horas/día</label>
                <input type="number" id="nuevoHorasDia" class="u-select-glass" value="8" step="1">
                <small>Horas que trabajará al día</small>
            </div>
            <div class="form-group u-flex-1">
                <label> Responsable</label>
                <input type="text" id="nuevoResponsable" class="u-select-glass" placeholder="Nombre">
            </div>
        </div>
        
        <div class="form-group">
            <label> Pertenece a EDT</label>
            <select id="nuevoDependeDe" class="u-select-glass">
                ${edtOptions}
            </select>
            <small class="u-fs-11 u-color-muted"> Si seleccionas una EDT, este elemento heredará su código (ej: 1.1, 1.2)</small>
        </div>
        
        <div class="info-card u-text-center" >
            <small> El coste se calculará automáticamente: <strong>Duración × Horas/día × Coste/hora del recurso</strong></small>
        </div>
        
        <button class="btn btn-primary" onclick="guardarNuevoElementoGantt()" style="width:100%; margin-top:16px;"> Crear Elemento</button>
    </div>`;
    
    let modalDiv = document.getElementById('modalNuevoElemento');
    if (modalDiv) modalDiv.remove();
    
    modalDiv = document.createElement('div');
    modalDiv.id = 'modalNuevoElemento';
    modalDiv.className = 'modal';
    modalDiv.style.display = 'flex';
    modalDiv.innerHTML = modalHtml;
    document.body.appendChild(modalDiv);
}

function cerrarModalNuevoElemento() {
    const modal = document.getElementById('modalNuevoElemento');
    if (modal) modal.remove();
}

function toggleDuracionInput() {
    const tipoSelect = document.getElementById('nuevoTipoDuracion');
    if (!tipoSelect) return;
    
    const tipo = tipoSelect.value;
    const diasGroup = document.getElementById('duracionDiasGroup');
    const mesesGroup = document.getElementById('duracionMesesGroup');
    const fechaFinGroup = document.getElementById('fechaFinGroup');
    
    if (diasGroup) diasGroup.style.display = tipo === 'dias' ? 'block' : 'none';
    if (mesesGroup) mesesGroup.style.display = tipo === 'meses' ? 'block' : 'none';
    if (fechaFinGroup) fechaFinGroup.style.display = tipo === 'fecha_fin' ? 'block' : 'none';
}
        
function guardarNuevoElementoGantt() {
    try {
        const nombre = document.getElementById('nuevoNombre').value.trim();
        if (!nombre) {
            mostrarToast(tApp('toast_nombre_obligatorio'), 'error');
            return;
        }
        
        const inicio = document.getElementById('nuevoInicio').value;
        if (!inicio) {
            mostrarToast(tApp('toast_fecha_inicio_obligatoria'), 'error');
            return;
        }
        
        let duracion = parseInt(document.getElementById('nuevoDuracion').value);
        if (isNaN(duracion) || duracion < 0) {
            mostrarToast(tApp('toast_duracion_positiva'), 'error');
            return;
        }
        
        const tipo = document.getElementById('nuevoTipo').value;
        
        if (tipo === 'hito' && duracion !== 0) {
            mostrarToast(tApp('toast_hitos_duracion_cero'), 'warning');
            duracion = 0;
        }
        
        const responsable = document.getElementById('nuevoResponsable').value || '';
        const dependeDeSelect = document.getElementById('nuevoDependeDe').value;
        const dependeDe = dependeDeSelect ? parseInt(dependeDeSelect) : null;
        
        const recursoId = document.getElementById('nuevoRecursoId').value;
        const horasDia = parseInt(document.getElementById('nuevoHorasDia').value) || 8;
        
        //  CALCULAR COSTE ESTIMADO CORRECTAMENTE
        let costeEstimado = 0;
        let recursoInfo = null;
        
        if (recursoId && proyecto.equipo) {
            const recurso = proyecto.equipo.find(r => r.id == recursoId);
            if (recurso) {
                // Coste = Horas totales × Coste por hora
                // Horas totales = Duración (días) × Horas por día
                const horasTotales = duracion * horasDia;
                costeEstimado = horasTotales * recurso.costeHora;
                recursoInfo = {
                    id: recurso.id,
                    nombre: recurso.nombre,
                    rol: recurso.rol,
                    costeHora: recurso.costeHora,
                    moneda: recurso.moneda,
                    horasDia: horasDia
                };
                console.log(` Coste calculado para "${nombre}": ${horasTotales}h × ${recurso.costeHora}${recurso.moneda}/h = ${costeEstimado} ${recurso.moneda}`);
            }
        }
        
        const duracionFinal = tipo === 'hito' ? 0 : duracion;
        
        const nuevoElemento = {
            id: Date.now(),
            tipo: tipo,
            nombre: nombre,
            inicio: inicio,
            duracion: duracionFinal,
            duracionOriginal: duracionFinal,
            progreso: tipo === 'hito' ? 100 : 0,
            responsable: responsable,
            dependeDe: dependeDe,
            recursoAsignado: recursoInfo,
            horasDia: horasDia,
            costeEstimado: costeEstimado,
            costeReal: 0
        };
        
        if (!proyecto.elementosGantt) proyecto.elementosGantt = [];
        proyecto.elementosGantt.push(nuevoElemento);
        
       
        guardarProyecto();
        renderizarTablaGantt();
        renderizarGanttUnificado();
        reordenarNumeracionElementos();
        
        //  IMPORTANTE: Recalcular el cashflow después de añadir la tarea
        calcularCashflow();
        
        cerrarModalNuevoElemento();
        
        if (recursoInfo) {
            mostrarToast(` Elemento creado: ${nombre}\n Coste estimado: ${formatearMoneda(convertirMoneda(costeEstimado, recursoInfo.moneda))}`, 'success');
        } else {
            mostrarToast(tApp('toast_elemento_creado') + nombre, 'success');
        }
        
    } catch(error) {
        console.error("ERROR:", error);
        mostrarToast(tApp('toast_error_crear_elemento') + error.message, 'error');
    }
    
}

        function editarElementoGantt(id) {
    const elem = proyecto.elementosGantt?.find(e => e.id === id);
    if (!elem) return;
    const codigoActual = obtenerCodigoElemento(elem, proyecto.elementosGantt);
    
    // Generar opciones de EDTs
    let edtOptions = '<option value="">-- Ninguno (elemento raíz) --</option>';
    (proyecto.elementosGantt || []).filter(e => e.tipo === 'edt' && e.id !== elem.id).forEach(edt => {
        const codigo = obtenerCodigoElemento(edt, proyecto.elementosGantt) || '';
        edtOptions += `<option value="${edt.id}" ${elem.dependeDe === edt.id ? 'selected' : ''}>${codigo ? `[${codigo}] ` : ''}${escapeHtml(edt.nombre)}</option>`;
    });
    
    const tipoDuracionActual = elem.tipoDuracion || 'dias';
    const mesesValor = elem.duracion ? (elem.duracion / 30.44).toFixed(1) : 0;
    
    const modalHtml = `<div class="modal-content modal-sm"><div class="modal-header"><h3> Editar ${elem.tipo.toUpperCase()}</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
        <input type="hidden" id="editId" value="${elem.id}">
        <div class="info-card u-mb-16" >
            <strong>Código actual:</strong> ${codigoActual || 'Sin asignar'}
        </div>
        <div class="form-group"><label>Tipo</label>
            <select id="editTipo">
                <option value="edt" ${elem.tipo === 'edt' ? 'selected' : ''}> EDT</option>
                <option value="actividad" ${elem.tipo === 'actividad' ? 'selected' : ''}> Actividad</option>
                <option value="entregable" ${elem.tipo === 'entregable' ? 'selected' : ''}> Entregable</option>
                <option value="hito" ${elem.tipo === 'hito' ? 'selected' : ''}> Hito</option>
            </select>
        </div>
        <div class="form-group"><label>Nombre</label><input type="text" id="editNombre" value="${escapeHtml(elem.nombre)}"></div>
        <div class="form-group"><label>Fecha de inicio</label><input type="date" id="editInicio" value="${elem.inicio || ''}"></div>
        
        <div class="form-group"><label>Tipo de duración</label>
            <select id="editTipoDuracion" onchange="toggleEditDuracionInput()">
                <option value="dias" ${tipoDuracionActual === 'dias' ? 'selected' : ''}> Por días</option>
                <option value="meses" ${tipoDuracionActual === 'meses' ? 'selected' : ''}> Por meses</option>
                <option value="fecha_fin" ${tipoDuracionActual === 'fecha_fin' ? 'selected' : ''}> Por fecha de fin</option>
            </select>
        </div>
        
        <div id="editDuracionDiasGroup" style="display: ${tipoDuracionActual === 'dias' ? 'block' : 'none'};">
            <label>Duración (días)</label>
            <input type="number" id="editDuracionDias" value="${elem.duracion || 0}">
        </div>
        
        <div id="editDuracionMesesGroup" style="display: ${tipoDuracionActual === 'meses' ? 'block' : 'none'};">
            <label>Duración (meses)</label>
            <input type="number" id="editDuracionMeses" value="${mesesValor}" step="0.5">
        </div>
        
        <div id="editFechaFinGroup" style="display: ${tipoDuracionActual === 'fecha_fin' ? 'block' : 'none'};">
            <label>Fecha de fin</label>
            <input type="date" id="editFechaFin" value="${elem.fechaFinCalculada || ''}">
        </div>
        
        <div class="form-group"><label>Progreso %</label><input type="number" id="editProgreso" value="${elem.progreso || 0}" min="0" max="100"></div>
        <div class="form-group"><label>Responsable</label><input type="text" id="editResponsable" value="${escapeHtml(elem.responsable || '')}"></div>
        <div class="form-group"><label>Pertenece a EDT</label>
            <select id="editDependeDe">
                ${edtOptions}
            </select>
        </div>
        <div class="info-card u-mt-16">
            <small> Al guardar, se recalculará automáticamente el código jerárquico y la duración en días.</small>
        </div>
        <button class="btn btn-primary" onclick="guardarEdicionElementoGantt()">Actualizar</button>
    </div>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}
function editarFechasReales(id) {
    const elem = proyecto.elementosGantt?.find(e => e.id === id);
    if (!elem) return;
    
    const modalHtml = `<div class="modal-content" style="max-width: 450px;">
        <div class="modal-header">
            <h3> Registrar Avance Real</h3>
            <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
        </div>
        <div class="info-card u-mb-16">
            <strong>${escapeHtml(elem.nombre)}</strong><br>
            <small>Planificado: ${elem.inicio || '-'} → ${elem.duracion ? sumarDias(elem.inicio, elem.duracion) : '-'}</small>
        </div>
        <div class="form-group">
            <label> Fecha Real de Inicio</label>
            <input type="date" id="realInicio" value="${elem.inicioReal || ''}">
        </div>
        <div class="form-group">
            <label> Fecha Real de Finalización</label>
            <input type="date" id="realFin" value="${elem.finReal || ''}">
        </div>
        <div class="form-group">
            <label> Progreso Real (%)</label>
            <input type="range" id="realProgreso" min="0" max="100" value="${elem.progreso || 0}" oninput="document.getElementById('progresoLabel').innerText=this.value">
            <span id="progresoLabel">${elem.progreso || 0}</span>%
        </div>
        <button class="btn btn-primary" onclick="guardarFechasReales(${id})"> Guardar Avance</button>
    </div>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function guardarFechasReales(id) {
    const elem = proyecto.elementosGantt?.find(e => e.id === id);
    if (elem) {
        elem.inicioReal = document.getElementById('realInicio').value || null;
        elem.finReal = document.getElementById('realFin').value || null;
        elem.progreso = parseInt(document.getElementById('realProgreso').value);
        
        // Calcular duración real si hay ambas fechas
        if (elem.inicioReal && elem.finReal) {
            const diffTime = new Date(elem.finReal) - new Date(elem.inicioReal);
            elem.duracionReal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        
        guardarProyecto();
        renderizarTablaGantt();
        renderizarGanttUnificado();
        cerrarModalGeneric();
        mostrarToast(` Avance registrado para "${elem.nombre}"`, 'success');
    }
}

function toggleEditDuracionInput() {
    const tipo = document.getElementById('editTipoDuracion').value;
    document.getElementById('editDuracionDiasGroup').style.display = tipo === 'dias' ? 'block' : 'none';
    document.getElementById('editDuracionMesesGroup').style.display = tipo === 'meses' ? 'block' : 'none';
    document.getElementById('editFechaFinGroup').style.display = tipo === 'fecha_fin' ? 'block' : 'none';
}

function guardarEdicionElementoGantt() {
    const id = parseInt(document.getElementById('editId').value);
    const elem = proyecto.elementosGantt?.find(e => e.id === id);
    if (elem) {
        elem.tipo = document.getElementById('editTipo').value;
        elem.nombre = document.getElementById('editNombre').value;
        elem.inicio = document.getElementById('editInicio').value;
        
        // Leer duración según el tipo seleccionado
        const tipoDuracion = document.getElementById('editTipoDuracion').value;
        if (tipoDuracion === 'dias') {
            elem.duracion = parseInt(document.getElementById('editDuracionDias').value) || 0;
        } else if (tipoDuracion === 'meses') {
            const meses = parseFloat(document.getElementById('editDuracionMeses').value) || 0;
            elem.duracion = Math.round(meses * 30.44);
        } else if (tipoDuracion === 'fecha_fin') {
            const fechaFin = document.getElementById('editFechaFin').value;
            if (fechaFin && elem.inicio) {
                const diffTime = new Date(fechaFin) - new Date(elem.inicio);
                elem.duracion = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
        }
        
        elem.progreso = parseInt(document.getElementById('editProgreso').value);
        elem.responsable = document.getElementById('editResponsable').value;
        elem.dependeDe = parseInt(document.getElementById('editDependeDe').value) || null;
        
        // reordenarNumeracionElementos(); // Función no implementada - comentada
        guardarProyecto();
        renderizarTablaGantt();
        renderizarGanttUnificado();
        cerrarModalGeneric();
        mostrarToast(tApp('toast_actualizado'), 'success');
        reordenarNumeracionElementos();
    }
}

function eliminarElementoGantt(id) {
    if (confirm(tApp('confirmar_eliminar'))) { proyecto.elementosGantt = proyecto.elementosGantt.filter(e => e.id !== id); guardarProyecto(); renderizarTablaGantt(); renderizarGanttUnificado(); mostrarToast(tApp('toast_eliminado'), 'success'); }
}

        function editarElementoMultiple() {
            const checkboxes = document.querySelectorAll('.select-elemento:checked');
            if (checkboxes.length === 0) { mostrarToast(tApp('toast_selecciona_elementos'), 'warning'); return; }
            const ids = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
            const modalHtml = `<div class="modal-content modal-500"><div class="modal-header"><h3> Edición Múltiple (${ids.length})</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <div class="form-group"><label>Responsable</label><input type="text" id="multiResponsable"></div>
                <div class="form-group"><label>Duración (días)</label><input type="number" id="multiDuracion"></div>
                <div class="form-group"><label>Desplazar fechas (días)</label><input type="number" id="multiDesplazar"></div>
                <button class="btn btn-primary" onclick="aplicarEdicionMultiple([${ids.join(',')}])">Aplicar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function aplicarEdicionMultiple(ids) {
            const nuevoResponsable = document.getElementById('multiResponsable')?.value;
            const nuevaDuracion = document.getElementById('multiDuracion')?.value;
            const desplazar = parseInt(document.getElementById('multiDesplazar')?.value);
            ids.forEach(id => {
                const elem = proyecto.elementosGantt?.find(e => e.id === id);
                if (elem) {
                    if (nuevoResponsable) elem.responsable = nuevoResponsable;
                    if (nuevaDuracion && !isNaN(parseInt(nuevaDuracion))) elem.duracion = parseInt(nuevaDuracion);
                    if (!isNaN(desplazar) && desplazar !== 0 && elem.inicio) { const fecha = new Date(elem.inicio); fecha.setDate(fecha.getDate() + desplazar); elem.inicio = fecha.toISOString().split('T')[0]; }
                }
            });
            guardarProyecto(); renderizarTablaGantt(); renderizarGanttUnificado(); cerrarModalGeneric(); mostrarToast(` ${ids.length} elementos actualizados`, 'success');
        }
        
        function seleccionarTodosElementos() { const checkAll = document.getElementById('seleccionarTodos'); const checkboxes = document.querySelectorAll('.select-elemento'); checkboxes.forEach(cb => cb.checked = checkAll.checked); }
        
        function ordenarElementosGantt(criterio) {
            if (!proyecto.elementosGantt) return;
            if (criterio === 'fecha') proyecto.elementosGantt.sort((a, b) => (a.inicio || '').localeCompare(b.inicio || ''));
            else if (criterio === 'tipo') { const orden = { edt: 1, actividad: 2, entregable: 3, hito: 4 }; proyecto.elementosGantt.sort((a, b) => (orden[a.tipo] || 5) - (orden[b.tipo] || 5)); }
            guardarProyecto(); renderizarTablaGantt(); renderizarGanttUnificado(); mostrarToast(` Ordenado`, 'success');
        }
        
        function sincronizarElementosGantt() {
            if (proyecto.hitos && proyecto.hitos.length > 0) {
                proyecto.hitos.forEach(hito => { if (!proyecto.elementosGantt.some(e => e.nombre === hito.nombre && e.tipo === 'hito')) { proyecto.elementosGantt.push({ id: Date.now() + Math.random(), tipo: 'hito', nombre: hito.nombre, inicio: hito.fecha || new Date().toISOString().split('T')[0], duracion: 0, progreso: 100, responsable: '', dependeDe: null }); } });
            }
            if (proyecto.entregables && proyecto.entregables.length > 0) {
                proyecto.entregables.forEach(ent => { if (!proyecto.elementosGantt.some(e => e.nombre === ent.nombre && e.tipo === 'entregable')) { proyecto.elementosGantt.push({ id: Date.now() + Math.random(), tipo: 'entregable', nombre: ent.nombre, inicio: ent.fechaPrevista || new Date().toISOString().split('T')[0], duracion: ent.duracion || 5, progreso: ent.progreso || 0, responsable: ent.responsable || '', dependeDe: null }); } });
            }
            guardarProyecto(); renderizarTablaGantt(); renderizarGanttUnificado(); mostrarToast(" Sincronizado", 'success');
        }
        function renderizarGanttUnificado() {
    const container = document.getElementById('ganttUnificadoContainer');
    if (!container) return;
    container.classList.add('gantt-chart-modern');
    
    let elementos = [...(proyecto.elementosGantt || [])];
    const filtro = document.getElementById('filtroTipoGantt')?.value || 'todos';
    const busqueda = document.getElementById('buscarGantt')?.value.toLowerCase() || '';
    
    if (filtro !== 'todos') elementos = elementos.filter(e => e.tipo === filtro);
    if (busqueda) elementos = elementos.filter(e => e.nombre.toLowerCase().includes(busqueda));
    
    if (elementos.length === 0) { 
        container.innerHTML = '<div class="info-card">No hay elementos</div>'; 
        return; 
    }
    
    // Calcular fechas del proyecto
    let fechaInicioProyecto = null;
    let fechaFinProyecto = null;
    
    elementos.forEach(e => {
        if (e.inicio) {
            const fechaInicio = new Date(e.inicio);
            if (!fechaInicioProyecto || fechaInicio < fechaInicioProyecto) {
                fechaInicioProyecto = fechaInicio;
            }
            if (e.duracion && e.duracion > 0) {
                const fechaFin = sumarDias(e.inicio, e.duracion);
                const fechaFinDate = new Date(fechaFin);
                if (!fechaFinProyecto || fechaFinDate > fechaFinProyecto) {
                    fechaFinProyecto = fechaFinDate;
                }
            } else if (!fechaFinProyecto || fechaInicio > fechaFinProyecto) {
                fechaFinProyecto = fechaInicio;
            }
        }
    });
    
    if (!fechaInicioProyecto) fechaInicioProyecto = new Date();
    if (!fechaFinProyecto) {
        fechaFinProyecto = new Date(fechaInicioProyecto);
        fechaFinProyecto.setMonth(fechaFinProyecto.getMonth() + 12);
    }
    
    fechaFinProyecto.setMonth(fechaFinProyecto.getMonth() + 2);
    
    const totalDias = Math.ceil((fechaFinProyecto - fechaInicioProyecto) / (1000 * 60 * 60 * 24));
    
    // Generar meses
    let months = [];
    let currentDate = new Date(fechaInicioProyecto);
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    while (currentDate <= fechaFinProyecto) {
        months.push({
            name: currentDate.toLocaleString('es', { month: 'short', year: '2-digit' }),
            start: new Date(currentDate),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        });
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    const anchoMes = 70 * zoomLevel;
    const anchoTotalCabecera = months.length * anchoMes;
    
    let html = `<div class="gantt-header" style="position: sticky; top: 0; background: rgba(30,30,40,0.95); z-index: 10;">
        <div class="gantt-task" style="width: 280px; position: sticky; left: 0; background: rgba(30,30,40,0.95); z-index: 11;"> Elemento</div>
        <div class="gantt-months" style="display: flex; width: ${anchoTotalCabecera}px;">
            ${months.map(m => `<div class="gantt-month" style="width: ${anchoMes}px; flex-shrink: 0;">${m.name}</div>`).join('')}
        </div>
    </div>`;
    
    const grupos = { edt: elementos.filter(e => e.tipo === 'edt'), actividad: elementos.filter(e => e.tipo === 'actividad'), entregable: elementos.filter(e => e.tipo === 'entregable'), hito: elementos.filter(e => e.tipo === 'hito') };
    
    for (const [tipo, items] of Object.entries(grupos)) {
        if (items.length === 0) continue;
        
        const nombreGrupo = { edt: ' EDT', actividad: ' Actividades', entregable: ' Entregables', hito: ' Hitos' }[tipo];
        
        html += `<div class="gantt-group u-mb-8">
            <div style="padding: 8px; background: rgba(0,122,255,0.2); margin-top: 8px; border-radius: 8px;">
                <strong>${nombreGrupo}</strong> (${items.length})
            </div>`;
        
        items.forEach(item => {
            if (!item.inicio) return;
            
            // Cálculos para barra PLANIFICADA
            const startDate = new Date(item.inicio);
            const startOffset = Math.max(0, Math.floor((startDate - fechaInicioProyecto) / (1000 * 60 * 60 * 24)));
            let widthPlan = item.duracion > 0 ? (item.duracion / totalDias) * 100 : 2;
            if (item.tipo === 'hito') widthPlan = 1.5;
            const leftPosPlan = (startOffset / totalDias) * 100;
            
            // Cálculos para barra REAL (si existe)
            let leftPosReal = 0, widthReal = 0;
            if (item.inicioReal) {
                const startRealDate = new Date(item.inicioReal);
                const startRealOffset = Math.max(0, Math.floor((startRealDate - fechaInicioProyecto) / (1000 * 60 * 60 * 24)));
                let duracionReal = item.duracionReal || item.duracion;
                if (item.finReal) {
                    const endRealDate = new Date(item.finReal);
                    duracionReal = Math.ceil((endRealDate - startRealDate) / (1000 * 60 * 60 * 24));
                }
                leftPosReal = (startRealOffset / totalDias) * 100;
                widthReal = duracionReal > 0 ? (duracionReal / totalDias) * 100 : 2;
            }
            
            const colores = { edt: '#007AFF', actividad: '#FF8C00', entregable: '#00A859', hito: '#FF3B30' };
            const color = colores[item.tipo] || '#888';
            const codigo = item.codigo || obtenerCodigoElemento(item, elementos) || '';
            
            // Color de la barra real según desviación
            const desviacion = calcularDesviacion(item);
            const colorReal = desviacion > 0 ? '#FF3B30' : (desviacion < 0 ? '#00A859' : '#34C759');
            
            //  NUEVO: Determinar si es EDT para hacerla clicable
            const esEDT = (item.tipo === 'edt');
            const onclickAttr = esEDT ? `onclick="abrirModalEDT(${item.id})"` : '';
            const edtAttr = esEDT ? ` data-edt-id="${item.id}"` : '';
            const taskStyle = `width: 280px; position: sticky; left: 0; background: rgba(0,0,0,0.3); z-index: 5; font-size: 11px;${esEDT ? ' cursor: pointer;' : ''}`;
            
            html += `<div class="gantt-row u-flex">
                <div class="gantt-task-name" style="${taskStyle}" ${onclickAttr}${edtAttr}>
                    ${item.tipo === 'hito' ? ' ' : ''}
                    ${codigo ? `<span style="color: ${color}; font-weight: bold;">[${codigo}]</span> ` : ''}
                    ${escapeHtml(item.nombre.substring(0, 35))}
                    ${item.duracion > 0 ? `<span class="u-fs-10">(${item.duracion}d)</span>` : ''}
                    <span style="font-size: 10px; color: ${color};"> ${item.progreso || 0}%</span>
                    ${esEDT ? '<span style="font-size: 10px; margin-left: 8px;"> Click</span>' : ''}
                </div>
                <div class="gantt-bars u-flex-1" >
                    <!-- BARRA PLANIFICADA (azul) -->
                    <div class="gantt-bar" style="left: ${leftPosPlan}%; width: ${widthPlan}%; background: #007AFF; opacity: 0.6; height: 18px; top: 2px; border-radius: 4px;">
                        <span style="font-size: 8px; padding: 0 4px;"> ${escapeHtml(item.nombre.substring(0, 15))}</span>
                    </div>
                    ${item.inicioReal ? `
                    <!-- BARRA REAL -->
                    <div class="gantt-bar" style="left: ${Math.max(0, Math.min(100, leftPosReal))}%; width: ${Math.min(100 - leftPosReal, widthReal)}%; background: ${colorReal}; opacity: 0.8; height: 18px; top: 24px; border-radius: 4px;">
                        <span style="font-size: 8px; padding: 0 4px;"> ${escapeHtml(item.nombre.substring(0, 10))}</span>
                    </div>
                    ` : ''}
                    <!-- BARRA DE PROGRESO -->
                    ${item.progreso > 0 && item.duracion > 0 ? 
                        `<div class="gantt-bar" style="left: ${leftPosPlan}%; width: ${(widthPlan * item.progreso / 100)}%; background: rgba(0,122,255,0.4); height: 18px; top: 2px; z-index: 2;"></div>` : ''}
                </div>
            </div>`;
        });
        html += `</div>`;
    }
    
    container.innerHTML = html;
}
        
        function zoomGantt(tipo) { if (tipo === 'in') zoomLevel = Math.min(zoomLevel + 0.2, 2); else zoomLevel = Math.max(zoomLevel - 0.2, 0.5); renderizarGanttUnificado(); }
        
        function colapsarTodos() {
            document.querySelectorAll('.gantt-group').forEach(group => { const content = group.querySelectorAll('.gantt-row'); if (content.length > 0 && !group.querySelector('.gantt-group-collapsed')) { content.forEach(row => row.style.display = 'none'); const header = group.querySelector('div:first-child'); const collapseBtn = document.createElement('span'); collapseBtn.textContent = ' '; collapseBtn.style.cursor = 'pointer'; collapseBtn.style.marginLeft = '10px'; collapseBtn.onclick = () => expandirGrupo(group); header.appendChild(collapseBtn); group.classList.add('gantt-group-collapsed'); } });
        }
        
        function expandirTodos() {
            document.querySelectorAll('.gantt-group').forEach(group => { const content = group.querySelectorAll('.gantt-row'); content.forEach(row => row.style.display = 'flex'); const btn = group.querySelector('span:last-child'); if (btn && btn.textContent === ' ') btn.remove(); group.classList.remove('gantt-group-collapsed'); });
        }
        
        function expandirGrupo(group) { const rows = group.querySelectorAll('.gantt-row'); rows.forEach(row => row.style.display = 'flex'); const btn = group.querySelector('span:last-child'); if (btn && btn.textContent === ' ') btn.remove(); group.classList.remove('gantt-group-collapsed'); }
        
        function exportarGantt() {
            let csv = "ID,Tipo,Nombre,Inicio,Duración,Progreso,Responsable\n";
            (proyecto.elementosGantt || []).forEach(e => { csv += `${e.id},${e.tipo},"${e.nombre}",${e.inicio || ''},${e.duracion},${e.progreso || 0},"${e.responsable || ''}"\n`; });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement('a'); const url = URL.createObjectURL(blob); link.href = url; link.setAttribute('download', `gantt_${proyecto.nombre}.csv`); document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url); mostrarToast(" Exportado", 'success');
        }
        function mostrarAnalisisDesviaciones() {
    const elementos = proyecto.elementosGantt || [];
    const elementosConDesviacion = elementos.filter(e => calcularDesviacion(e) !== 0 && e.finReal);
    
    if (elementosConDesviacion.length === 0) {
        mostrarToast(tApp('toast_sin_desviaciones'), 'success');
        return;
    }
    
    let html = `<div class="raci-report-section"><h4> ANÁLISIS DE DESVIACIONES</h4>
        <table class="data-table"><thead><tr><th>Elemento</th><th>Fin Planificado</th><th>Fin Real</th><th>Desviación</th><th>Estado</th></tr></thead><tbody>`;
    
    elementosConDesviacion.forEach(e => {
        const desviacion = calcularDesviacion(e);
        const finPlan = e.inicio ? sumarDias(e.inicio, e.duracion) : '-';
        const estado = desviacion > 0 ? ' Retrasado' : ' Adelantado';
        html += `<tr>
            <td><strong>${escapeHtml(e.nombre)}</strong></td>
            <td>${finPlan}</td>
            <td>${e.finReal || '-'}</td>
            <td class="${desviacion > 0 ? 'cashflow-negative' : 'cashflow-positive'}">${desviacion > 0 ? `+${desviacion}` : desviacion} días</td>
            <td>${estado}</td>
        </tr>`;
    });
    
    html += `</tbody></table>
    <div class="info-card u-mt-16">
        <strong> Recomendaciones:</strong><br>
        • ${elementosConDesviacion.filter(e => calcularDesviacion(e) > 0).length > 0 ? 'Revisar las tareas retrasadas y asignar recursos adicionales' : 'Ninguna tarea retrasada'}
        • Actualizar frecuentemente las fechas reales para mantener el cronograma preciso
    </div></div>`;
    
    const modalHtml = `<div class="modal-content modal-800">
        <div class="modal-header"><h3> Análisis de Desviaciones</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
        ${html}
        <button class="btn btn-primary" onclick="exportarDesviaciones()"> Exportar a CSV</button>
    </div>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function exportarDesviaciones() {
    let csv = "Elemento,Fin Planificado,Fin Real,Desviación (días),Estado\n";
    (proyecto.elementosGantt || []).forEach(e => {
        if (e.finReal) {
            const desviacion = calcularDesviacion(e);
            const finPlan = e.inicio ? sumarDias(e.inicio, e.duracion) : '-';
            csv += `"${e.nombre}",${finPlan},${e.finReal || '-'},${desviacion},${desviacion > 0 ? 'Retrasado' : (desviacion < 0 ? 'Adelantado' : 'A tiempo')}\n`;
        }
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `desviaciones_${proyecto.nombre}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Desviaciones exportadas", 'success');
}
function recalcularCostesPorProgreso() {
    if (!proyecto.elementosGantt) return;
    
    let totalCosteEstimado = 0;
    let totalCosteReal = 0;
    
    proyecto.elementosGantt.forEach(tarea => {
        if (tarea.tipo !== 'hito' && tarea.recursoAsignado) {
            const costeEstimado = tarea.costeEstimado || 0;
            const progreso = (tarea.progreso || 0) / 100;
            const costeReal = costeEstimado * progreso;
            
            tarea.costeReal = costeReal;
            
            totalCosteEstimado += convertirMoneda(costeEstimado, tarea.recursoAsignado.moneda || proyecto.monedaBase);
            totalCosteReal += convertirMoneda(costeReal, tarea.recursoAsignado.moneda || proyecto.monedaBase);
        }
    });
    
    guardarProyecto();
    calcularCashflow();
    
    mostrarToast(` Costes actualizados: Estimado: ${formatearMoneda(totalCosteEstimado)} | Real: ${formatearMoneda(totalCosteReal)}`, 'success');
}

        function inicializarRiesgos() {
            if (!proyecto.riesgos) proyecto.riesgos = [];
            if (!proyecto.accionesMitigacion) proyecto.accionesMitigacion = [];
            renderizarRiesgos();
            calcularEstadisticasRiesgos();
        }
        
        function renderizarRiesgos() {
            const tbody = document.getElementById('riesgosBody');
            if (!proyecto.riesgos || proyecto.riesgos.length === 0) { tbody.innerHTML = '<tr><td colspan="11">No hay riesgos</td></tr>'; return; }
            tbody.innerHTML = proyecto.riesgos.map(r => {
                const nivelClass = { Crítico: 'badge-pendiente', Alto: 'badge-progreso', Medio: 'badge-pais', Bajo: 'badge-completado' }[r.nivel] || 'badge-pendiente';
                return `<tr>
                    <td>${r.id}</td>
                    <td><strong>${escapeHtml(r.nombre)}</strong></td>
                    <td>${escapeHtml(r.categoria || '-')}</td>
                    <td>${r.probabilidad}/5</td>
                    <td>${r.impacto}/5</td>
                    <td>${r.score}</td>
                    <td class="${nivelClass}">${r.nivel || '-'}</td>
                    <td>${r.respuesta || '-'}</td>
                    <td>${r.estado || 'Abierto'}</td>
                    <td>${escapeHtml(r.planAccion || '-')}</td>
                    <td><span class="edit-btn" onclick="editarRiesgo(${r.id})"></span><span class="delete-btn" onclick="eliminarRiesgo(${r.id})"></span></td>
                </tr>`;
            }).join('');
        }
        
        function calcularEstadisticasRiesgos() {
            if (!proyecto.riesgos) return;
            const criticos = proyecto.riesgos.filter(r => r.nivel === 'Crítico').length;
            const altos = proyecto.riesgos.filter(r => r.nivel === 'Alto').length;
            const medios = proyecto.riesgos.filter(r => r.nivel === 'Medio').length;
            const bajos = proyecto.riesgos.filter(r => r.nivel === 'Bajo').length;
            document.getElementById('totalRiesgosCriticos').innerHTML = criticos;
            document.getElementById('totalRiesgosAltos').innerHTML = altos;
            document.getElementById('totalRiesgosMedios').innerHTML = medios;
            document.getElementById('totalRiesgosBajos').innerHTML = bajos;
        }
        
        function abrirModalNuevoRiesgo() {
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Nuevo Riesgo</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <div class="form-group"><label>Nombre</label><input type="text" id="riesgoNombre"></div>
                <div class="form-group"><label>Categoría</label><input type="text" id="riesgoCategoria" placeholder="Técnico, Externo, Costos..."></div>
                <div class="form-row"><div class="form-group"><label>Probabilidad (1-5)</label><input type="range" id="riesgoProb" min="1" max="5" value="3" oninput="document.getElementById('probVal').innerText=this.value"><span id="probVal">3</span></div>
                <div class="form-group"><label>Impacto (1-5)</label><input type="range" id="riesgoImp" min="1" max="5" value="3" oninput="document.getElementById('impVal').innerText=this.value"><span id="impVal">3</span></div></div>
                <div class="form-group"><label>Respuesta</label><select id="riesgoRespuesta"><option value="Mitigar">Mitigar</option><option value="Evitar">Evitar</option><option value="Transferir">Transferir</option><option value="Aceptar">Aceptar</option></select></div>
                <div class="form-group"><label>Plan de acción</label><textarea rows="2" id="riesgoPlan"></textarea></div>
                <button class="btn btn-primary" onclick="guardarRiesgo()">Guardar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function guardarRiesgo() {
            let nombre = document.getElementById('riesgoNombre').value.trim();
            if (!nombre) { mostrarToast(tApp('toast_nombre_obligatorio'), 'error'); return; }
            let prob = parseInt(document.getElementById('riesgoProb').value);
            let imp = parseInt(document.getElementById('riesgoImp').value);
            let score = prob * imp;
            let nivel = score >= 20 ? 'Crítico' : score >= 12 ? 'Alto' : score >= 6 ? 'Medio' : 'Bajo';
            let riesgo = {
                id: Date.now(), nombre: nombre, categoria: document.getElementById('riesgoCategoria').value,
                probabilidad: prob, impacto: imp, score: score, nivel: nivel,
                respuesta: document.getElementById('riesgoRespuesta').value, estado: 'Abierto',
                planAccion: document.getElementById('riesgoPlan').value
            };
            if (!proyecto.riesgos) proyecto.riesgos = [];
            proyecto.riesgos.push(riesgo);
            guardarProyecto(); renderizarRiesgos(); calcularEstadisticasRiesgos(); cerrarModalGeneric(); mostrarToast(` Riesgo añadido`, 'success');
        }
        
        function editarRiesgo(id) {
            let r = proyecto.riesgos.find(r => r.id === id);
            if (!r) return;
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Editar Riesgo</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <input type="hidden" id="riesgoId" value="${r.id}"><div class="form-group"><label>Nombre</label><input type="text" id="riesgoNombre" value="${escapeHtml(r.nombre)}"></div>
                <div class="form-group"><label>Categoría</label><input type="text" id="riesgoCategoria" value="${escapeHtml(r.categoria || '')}"></div>
                <div class="form-row"><div class="form-group"><label>Probabilidad</label><input type="range" id="riesgoProb" min="1" max="5" value="${r.probabilidad}" oninput="document.getElementById('probVal').innerText=this.value"><span id="probVal">${r.probabilidad}</span></div>
                <div class="form-group"><label>Impacto</label><input type="range" id="riesgoImp" min="1" max="5" value="${r.impacto}" oninput="document.getElementById('impVal').innerText=this.value"><span id="impVal">${r.impacto}</span></div></div>
                <div class="form-group"><label>Respuesta</label><select id="riesgoRespuesta"><option value="Mitigar" ${r.respuesta === 'Mitigar' ? 'selected' : ''}>Mitigar</option><option value="Evitar" ${r.respuesta === 'Evitar' ? 'selected' : ''}>Evitar</option><option value="Transferir" ${r.respuesta === 'Transferir' ? 'selected' : ''}>Transferir</option><option value="Aceptar" ${r.respuesta === 'Aceptar' ? 'selected' : ''}>Aceptar</option></select></div>
                <div class="form-group"><label>Plan de acción</label><textarea rows="2" id="riesgoPlan">${escapeHtml(r.planAccion || '')}</textarea></div>
                <div class="form-group"><label>Estado</label><select id="riesgoEstado"><option value="Abierto" ${r.estado === 'Abierto' ? 'selected' : ''}>Abierto</option><option value="En seguimiento" ${r.estado === 'En seguimiento' ? 'selected' : ''}>En seguimiento</option><option value="Cerrado" ${r.estado === 'Cerrado' ? 'selected' : ''}>Cerrado</option></select></div>
                <button class="btn btn-primary" onclick="actualizarRiesgo()">Actualizar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function actualizarRiesgo() {
            let id = parseInt(document.getElementById('riesgoId').value);
            let idx = proyecto.riesgos.findIndex(r => r.id === id);
            if (idx >= 0) {
                let prob = parseInt(document.getElementById('riesgoProb').value);
                let imp = parseInt(document.getElementById('riesgoImp').value);
                let score = prob * imp;
                let nivel = score >= 20 ? 'Crítico' : score >= 12 ? 'Alto' : score >= 6 ? 'Medio' : 'Bajo';
                proyecto.riesgos[idx] = {
                    id: id, nombre: document.getElementById('riesgoNombre').value, categoria: document.getElementById('riesgoCategoria').value,
                    probabilidad: prob, impacto: imp, score: score, nivel: nivel,
                    respuesta: document.getElementById('riesgoRespuesta').value, estado: document.getElementById('riesgoEstado').value,
                    planAccion: document.getElementById('riesgoPlan').value
                };
                guardarProyecto(); renderizarRiesgos(); calcularEstadisticasRiesgos(); cerrarModalGeneric(); mostrarToast(tApp('toast_riesgo_actualizado'), 'success');
            }
        }
        
        function eliminarRiesgo(id) {
            if (confirm(tApp('confirmar_eliminar_riesgo'))) { proyecto.riesgos = proyecto.riesgos.filter(r => r.id !== id); guardarProyecto(); renderizarRiesgos(); calcularEstadisticasRiesgos(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
        
        function ordenarRiesgos(criterio) {
            if (!proyecto.riesgos) return;
            if (criterio === 'probabilidad') proyecto.riesgos.sort((a, b) => b.probabilidad - a.probabilidad);
            else if (criterio === 'impacto') proyecto.riesgos.sort((a, b) => b.impacto - a.impacto);
            else if (criterio === 'score') proyecto.riesgos.sort((a, b) => b.score - a.score);
            renderizarRiesgos(); mostrarToast(` Ordenado por ${criterio}`, 'success');
        }
        
        function analizarRiesgos() {
            let criticos = proyecto.riesgos.filter(r => r.nivel === 'Crítico').length;
            mostrarToast(` Análisis: ${criticos} riesgos críticos identificados`, 'info');
        }
        
        function mostrarMatrizRiesgos() {
            const container = document.getElementById('matrizRiesgosContainer');
            if (!container) return;
            container.style.display = 'block';
            const canvas = document.getElementById('matrizRiesgosCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            canvas.width = 500; canvas.height = 400;
            ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
            for (let i = 1; i <= 5; i++) { ctx.beginPath(); ctx.moveTo(i * 80, 0); ctx.lineTo(i * 80, 400); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 400 - i * 60); ctx.lineTo(500, 400 - i * 60); ctx.stroke(); }
            ctx.fillStyle = 'white'; ctx.font = '10px sans-serif';
            for (let i = 1; i <= 5; i++) { ctx.fillText(i, i * 80 - 5, 20); ctx.fillText(i, 5, 400 - i * 60 + 5); }
            ctx.fillStyle = '#007AFF';
            proyecto.riesgos.forEach(r => { let x = r.probabilidad * 80 - 10; let y = 400 - r.impacto * 60 - 10; ctx.fillRect(x, y, 8, 8); ctx.fillStyle = '#FF5F57'; });
            mostrarToast(" Matriz de riesgos mostrada", 'success');
        }
        
        function ocultarMatrizRiesgos() { document.getElementById('matrizRiesgosContainer').style.display = 'none'; }
        
        function calcularValorEsperado() {
            let valorProyecto = parseFloat(document.getElementById('valorProyectoRiesgos').value) || proyecto.precioVenta || 0;
            let reserva = 0;
            proyecto.riesgos.forEach(r => { reserva += valorProyecto * (r.probabilidad / 100) * (r.impacto / 10); });
            document.getElementById('reservaContingencia').value = formatearMoneda(reserva);
            mostrarToast(` Reserva de contingencia: ${formatearMoneda(reserva)}`, 'success');
        }
        
        function abrirModalNuevaAccionMitigacion() {
            const modalHtml = `<div class="modal-content"><div class="modal-header"><h3> Nueva Acción</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <div class="form-group"><label>Riesgo asociado</label><select id="accRiesgoId">${(proyecto.riesgos || []).map(r => `<option value="${r.id}">${escapeHtml(r.nombre)}</option>`).join('')}</select></div>
                <div class="form-group"><label>Fecha</label><input type="date" id="accFecha" value="${new Date().toISOString().split('T')[0]}"></div>
                <div class="form-group"><label>Acción tomada</label><textarea rows="2" id="accAccion"></textarea></div>
                <div class="form-group"><label>Responsable</label><input type="text" id="accResponsable"></div>
                <div class="form-group"><label>Estado</label><select id="accEstado"><option value="Pendiente">Pendiente</option><option value="En progreso">En progreso</option><option value="Completada">Completada</option></select></div>
                <button class="btn btn-primary" onclick="guardarAccionMitigacion()">Guardar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
            document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
        }
        
        function guardarAccionMitigacion() {
            let riesgoId = parseInt(document.getElementById('accRiesgoId').value);
            let riesgo = proyecto.riesgos.find(r => r.id === riesgoId);
            let accion = {
                id: Date.now(), riesgoId: riesgoId, riesgoNombre: riesgo ? riesgo.nombre : '',
                fecha: document.getElementById('accFecha').value, accion: document.getElementById('accAccion').value,
                responsable: document.getElementById('accResponsable').value, estado: document.getElementById('accEstado').value
            };
            if (!proyecto.accionesMitigacion) proyecto.accionesMitigacion = [];
            proyecto.accionesMitigacion.push(accion);
            guardarProyecto(); renderizarAccionesMitigacion(); cerrarModalGeneric(); mostrarToast(tApp('toast_accion_guardada'), 'success');
        }
        
        function renderizarAccionesMitigacion() {
            const tbody = document.getElementById('accionesMitigacionBody');
            if (!proyecto.accionesMitigacion || proyecto.accionesMitigacion.length === 0) { tbody.innerHTML = '<tr><td colspan="6">No hay acciones</td></tr>'; return; }
            tbody.innerHTML = proyecto.accionesMitigacion.map(a => `<tr>
                <td><strong>${escapeHtml(a.riesgoNombre)}</strong></td>
                <td>${a.fecha || '-'}</td>
                <td>${escapeHtml(a.accion || '-')}</td>
                <td>${escapeHtml(a.responsable || '-')}</td>
                <td><span class="badge-${a.estado === 'Completada' ? 'completado' : 'progreso'}">${a.estado || 'Pendiente'}</span></td>
                <td><span class="delete-btn" onclick="eliminarAccionMitigacion(${a.id})"></span></td>
                </tr>`).join('');
        }
        
        function eliminarAccionMitigacion(id) {
            if (confirm(tApp('confirmar_eliminar_accion'))) { proyecto.accionesMitigacion = proyecto.accionesMitigacion.filter(a => a.id !== id); guardarProyecto(); renderizarAccionesMitigacion(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
        
        function exportarRiesgos() {
            let csv = "ID,Riesgo,Categoría,Probabilidad,Impacto,Score,Nivel,Respuesta,Estado\n";
            (proyecto.riesgos || []).forEach(r => { csv += `${r.id},"${r.nombre}",${r.categoria || ''},${r.probabilidad},${r.impacto},${r.score},${r.nivel},${r.respuesta},${r.estado}\n`; });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement('a'); const url = URL.createObjectURL(blob); link.href = url; link.setAttribute('download', `riesgos_${proyecto.nombre}.csv`); document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url); mostrarToast(" Riesgos exportados", 'success');
        }
        
        // ============================================
        // MÓDULO FINANCIERO INTELIGENTE (simplificado)
        // ============================================
        function inicializarConfigFinanciera() {
            if (!proyecto.configAranceles) proyecto.configAranceles = [];
            if (!proyecto.tasasAduanerasFijas) proyecto.tasasAduanerasFijas = [];
            if (!proyecto.costesFinancierosExtra) proyecto.costesFinancierosExtra = [];
            if (proyecto.configAranceles.length === 0) proyecto.configAranceles = [{ id: 1, pais: 'China', categoria: 'Electrónica', porcentaje: 15, codigo: '8542' }, { id: 2, pais: 'USA', categoria: 'General', porcentaje: 5, codigo: 'G001' }];
            if (proyecto.tasasAduanerasFijas.length === 0) proyecto.tasasAduanerasFijas = [{ id: 1, concepto: 'Tasa de despacho', tipo: 'fijo', valor: 150, moneda: 'EUR' }];
            renderizarConfigAranceles(); renderizarTasasAduaneras(); renderizarCostesFinancierosExtra();
        }
        
        function renderizarConfigAranceles() { const tbody = document.getElementById('configArancelesBody'); if (!tbody) return; if (!proyecto.configAranceles || proyecto.configAranceles.length === 0) { tbody.innerHTML = '<tr><td colspan="5">No hay aranceles</td></tr>'; return; } tbody.innerHTML = proyecto.configAranceles.map(a => `<tr><td>${escapeHtml(a.pais)}</td><td>${escapeHtml(a.categoria)}</td><td>${a.porcentaje}%</td><td>${escapeHtml(a.codigo || '-')}</td><td><span class="delete-btn" onclick="eliminarConfigArancel(${a.id})"></span></td></tr>`).join(''); }
        function renderizarTasasAduaneras() { const tbody = document.getElementById('tasasFijasBody'); if (!tbody) return; if (!proyecto.tasasAduanerasFijas || proyecto.tasasAduanerasFijas.length === 0) { tbody.innerHTML = '<tr><td colspan="5">No hay tasas</td></tr>'; return; } tbody.innerHTML = proyecto.tasasAduanerasFijas.map(t => `<tr><td>${escapeHtml(t.concepto)}</td><td>${t.tipo === 'fijo' ? 'Fijo' : 'Porcentaje'}</td><td>${t.tipo === 'fijo' ? t.valor + ' ' + t.moneda : t.valor + '%'}</td><td>${t.moneda || '-'}</td><td><span class="delete-btn" onclick="eliminarTasaAduanera(${t.id})"></span></td></tr>`).join(''); }
        function renderizarCostesFinancierosExtra() { const tbody = document.getElementById('costesFinancierosExtraBody'); if (!tbody) return; if (!proyecto.costesFinancierosExtra || proyecto.costesFinancierosExtra.length === 0) { tbody.innerHTML = '<tr><td colspan="8">No hay costes</td></tr>'; return; } tbody.innerHTML = proyecto.costesFinancierosExtra.map(c => { let total = c.tipo === 'porcentaje' ? (c.base || 0) * (c.tasa / 100) : c.tasa; return `<tr><td>${escapeHtml(c.concepto)}</td><td>${c.tipo === 'porcentaje' ? '%' : 'Fijo'}</td><td>${c.base || '-'}</td><td>${c.tasa}${c.tipo === 'porcentaje' ? '%' : ''}</td><td>${c.moneda}</td><td>${formatearMoneda(convertirMoneda(total, c.moneda))}</td><td>${c.periodicidad || 'Único'}</td><td><span class="delete-btn" onclick="eliminarCosteFinancieroExtra(${c.id})"></span></td></tr>`; }).join(''); }
        
        function calcularTodosLosCostesFinancieros() { calcularAnalisisMateriales(); calcularAnalisisEquipo(); renderizarCostesFinancierosExtra(); }
        
        function calcularAnalisisMateriales() {
            const tbody = document.getElementById('analisisMaterialesBody'); if (!tbody) return;
            if (!proyecto.materiales || proyecto.materiales.length === 0) { tbody.innerHTML = '<tr><td colspan="10">No hay materiales</td></tr>'; return; }
            const flete = parseFloat(document.getElementById('factorFlete')?.value || 10) / 100;
            const seguro = parseFloat(document.getElementById('factorSeguro')?.value || 2) / 100;
            let totalMateriales = 0, totalAranceles = 0, totalTasas = 0, totalImportacion = 0;
            tbody.innerHTML = proyecto.materiales.map(m => {
                const valorUnitario = convertirMoneda(m.costeUnitario, m.moneda);
                const valorTotalMaterial = m.cantidad * valorUnitario;
                const valorCIF = valorTotalMaterial + (valorTotalMaterial * flete) + (valorTotalMaterial * seguro);
                const arancel = (proyecto.configAranceles || []).find(a => a.pais.toLowerCase() === (m.paisOrigen || '').toLowerCase())?.porcentaje || 0;
                const valorArancel = valorCIF * (arancel / 100);
                const tasasFijas = (proyecto.tasasAduanerasFijas || []).filter(t => t.tipo === 'fijo').reduce((sum, t) => sum + convertirMoneda(t.valor, t.moneda), 0);
                const valorTasas = tasasFijas;
                const totalItem = valorTotalMaterial + valorArancel + valorTasas;
                totalMateriales += valorTotalMaterial; totalAranceles += valorArancel; totalTasas += valorTasas; totalImportacion += totalItem;
                return `</table>
                    <td>${escapeHtml(m.nombre)}</td>
                    <td>${m.cantidad}</td>
                    <td>${formatearMoneda(valorUnitario)}</td>
                    <td>${m.moneda}</td>
                    <td>${escapeHtml(m.paisOrigen || '-')}</td>
                    <td>${formatearMoneda(valorCIF)}</td>
                    <td>${arancel}% (${formatearMoneda(valorArancel)})</td>
                    <td>${formatearMoneda(valorTasas)}</td>
                    <td>${formatearMoneda(totalItem)}</td>
                    <td>Mes ${m.mes || 1}</td>
                </tr>`;
            }).join('');
            document.getElementById('resumenCosteMateriales').innerHTML = formatearMoneda(totalMateriales);
            document.getElementById('resumenTotalAranceles').innerHTML = formatearMoneda(totalAranceles);
            document.getElementById('resumenTotalTasas').innerHTML = formatearMoneda(totalTasas);
            document.getElementById('resumenTotalImportacion').innerHTML = formatearMoneda(totalImportacion);
        }
        
        function calcularAnalisisEquipo() {
            const tbody = document.getElementById('analisisEquipoBody'); if (!tbody) return;
            const duracionMeses = parseFloat(document.getElementById('duracionProyectoMeses')?.value || 12);
            if (!proyecto.equipo || proyecto.equipo.length === 0) { tbody.innerHTML = '<tr><td colspan="8">No hay personal</td></tr>'; return; }
            let total = 0;
            tbody.innerHTML = proyecto.equipo.map(m => { const totalMiembro = convertirMoneda(m.costeHora * m.horasMes * duracionMeses, m.moneda); total += totalMiembro; return `<tr>
                <td>${escapeHtml(m.nombre)}</td>
                <td>${escapeHtml(m.rol || '-')}</td>
                <td>${m.costeHora}</td>
                <td>${m.horasMes}</td>
                <td>${duracionMeses}</td>
                <td>${formatearMoneda(totalMiembro)}</td>
                <td>${m.moneda}</td>
                <td><span class="edit-btn" onclick="editarEquipo(${m.id})"></span></td>
                </tr>`; }).join('');
        }
        
        function mostrarSubpanelAnalisis(subpanel, btn) {
            document.querySelectorAll('.subpanel-analisis').forEach(el => el.style.display = 'none');
            document.getElementById(`subpanel${subpanel.charAt(0).toUpperCase() + subpanel.slice(1)}`).style.display = 'block';
            document.querySelectorAll('.btn-tab').forEach(b => { b.style.color = 'rgba(255,255,255,0.7)'; b.style.borderBottom = 'none'; });
            if (btn) { btn.style.color = '#007AFF'; btn.style.borderBottom = '2px solid #007AFF'; }
            if (subpanel === 'materiales') calcularAnalisisMateriales();
            if (subpanel === 'equipo') calcularAnalisisEquipo();
            if (subpanel === 'servicios') renderizarServicios();
        }
        
        function abrirModalConfigArancel() { mostrarToast("Funcionalidad avanzada - usa la tabla para gestionar", 'info'); }
        function abrirModalTasaAduaneraFija() { mostrarToast("Funcionalidad avanzada", 'info'); }
        function abrirModalCosteFinancieroExtra() { mostrarToast("Funcionalidad avanzada", 'info'); }
        function eliminarConfigArancel(id) { proyecto.configAranceles = proyecto.configAranceles.filter(a => a.id !== id); guardarProyecto(); renderizarConfigAranceles(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        function eliminarTasaAduanera(id) { proyecto.tasasAduanerasFijas = proyecto.tasasAduanerasFijas.filter(t => t.id !== id); guardarProyecto(); renderizarTasasAduaneras(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        function eliminarCosteFinancieroExtra(id) { proyecto.costesFinancierosExtra = proyecto.costesFinancierosExtra.filter(c => c.id !== id); guardarProyecto(); renderizarCostesFinancierosExtra(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        function actualizarArancelesTodos() { calcularAnalisisMateriales(); mostrarToast(" Aranceles actualizados", 'success'); }
        
        // ============================================
        // APIS Y ACTUALIZACIÓN EXTERNA
        // ============================================
        let ultimaActualizacionCambio = null;
        
// ============================================
// TIPOS DE CAMBIO - VERSIÓN CORREGIDA Y UNIFICADA
// ============================================
// CONFIGURACIÓN DE PROVEEDORES DE TIPOS DE CAMBIO
// ============================================
const PROVEEDORES_TASAS = {
    frankfurter: {
        nombre: 'Frankfurter API (BCE)',
        url: 'https://api.frankfurter.app/latest?from=EUR',
        parser: (data) => data.rates,
        requiereKey: false
    },
    exchangerate: {
        nombre: 'ExchangeRate-API',
        url: 'https://open.er-api.com/v6/latest/EUR',
        parser: (data) => data.rates,
        requiereKey: false
    },
    currencyapi: {
        nombre: 'CurrencyAPI',
        url: 'https://api.currencyapi.com/v3/latest?base_currency=EUR',
        parser: (data) => {
            const rates = {};
            for (const [k, v] of Object.entries(data.data)) rates[k] = v.value;
            return rates;
        },
        requiereKey: true
    }
};

let proveedorActual = 'auto';
let autoUpdateInterval = 86400000;
let autoUpdateTimer = null;

// ============================================

// VERSIÓN MEJORADA - Múltiples APIs con fallback
async function actualizarTiposCambioAuto() {
    const btn = document.getElementById('btnActualizarTipos');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="btn-icon"></span><span class="btn-text">Actualizando...</span>';
    }
    mostrarToast(" Actualizando tipos de cambio...", 'info');

    const proveedores = proveedorActual === 'auto' 
        ? ['frankfurter', 'exchangerate'] 
        : [proveedorActual];

    for (const provId of proveedores) {
        const prov = PROVEEDORES_TASAS[provId];
        if (!prov) continue;

        try {
            mostrarToast(` Intentando ${prov.nombre}...`, 'info');
            const response = await fetch(prov.url);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            const rates = prov.parser(data);
            
            if (rates && Object.keys(rates).length > 0) {
                tiposCambio = { EUR: 1 };
                
                for (const [moneda, tasa] of Object.entries(rates)) {
                    if (typeof tasa === 'number' && tasa > 0) {
                        tiposCambio[moneda] = tasa;
                    }
                }
                
                // Añadir monedas extra que no estén en la API
                const monedasExtra = {
                    DZD: 134, CDF: 2800, MZN: 64, ZAR: 18.5,
                    BRL: 5.45, MXN: 18.25, COP: 4190, ARS: 950, CLP: 920,
                    NGN: 1500, KES: 140, EGP: 48, MAD: 10.8,
                    VES: 36, UYU: 39, PEN: 3.8, BOB: 6.9, PYG: 7300
                };
                
                for (const [moneda, tasa] of Object.entries(monedasExtra)) {
                    if (!tiposCambio[moneda]) tiposCambio[moneda] = tasa;
                }
                
                // Guardar en caché
                localStorage.setItem('tiposCambioCache', JSON.stringify(tiposCambio));
                localStorage.setItem('tiposCambioFuente', provId);
                ultimaActualizacionCambio = new Date();
                localStorage.setItem('ultimaActualizacionCambio', ultimaActualizacionCambio.toISOString());
                
                actualizarTiposCambioUI();
                mostrarFechaUltimaActualizacion();
                actualizarStatsMonedas();
                
                if (typeof calcularCashflow === 'function') calcularCashflow();
                if (typeof actualizarResumenGastos === 'function') actualizarResumenGastos();
                
                mostrarToast(` Tipos actualizados desde ${prov.nombre} (${Object.keys(tiposCambio).length} monedas)`, 'success');
                return;
            }
        } catch (error) {
            console.warn(`Error ${prov.nombre}:`, error.message);
            continue;
        }
    }

    // Si todas fallan, usar caché o respaldo
    mostrarToast(" Error en APIs. Usando datos en caché.", 'warning');
    const cache = localStorage.getItem('tiposCambioCache');
    if (cache) {
        tiposCambio = JSON.parse(cache);
        actualizarTiposCambioUI();
        mostrarFechaUltimaActualizacion();
        actualizarStatsMonedas();
    } else {
        usarTiposCambioRespaldo();
    }

    if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-icon"></span><span class="btn-text">Actualizar Tasas</span>';
    }
}

function cambiarProveedorTasas(nuevoProveedor) {
    proveedorActual = nuevoProveedor;
    localStorage.setItem('proveedorTasas', nuevoProveedor);
    if (nuevoProveedor !== 'manual') {
        actualizarTiposCambioAuto();
    }
}

function configurarAutoUpdate(intervalo) {
    autoUpdateInterval = parseInt(intervalo);
    localStorage.setItem('autoUpdateInterval', autoUpdateInterval);
    if (autoUpdateTimer) clearInterval(autoUpdateTimer);
    if (autoUpdateInterval > 0) {
        autoUpdateTimer = setInterval(actualizarTiposCambioAuto, autoUpdateInterval);
    }
}

function probarConexionAPI() {
    const provId = proveedorActual === 'auto' ? 'frankfurter' : proveedorActual;
    const prov = PROVEEDORES_TASAS[provId];
    if (!prov) return;
    
    mostrarToast(` Probando ${prov.nombre}...`, 'info');
    fetch(prov.url)
        .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
        .then(data => {
            const rates = prov.parser(data);
            mostrarToast(` ${prov.nombre} OK - ${Object.keys(rates).length} monedas`, 'success');
        })
        .catch(err => {
            mostrarToast(` ${prov.nombre} falló: ${err.message}`, 'error');
        });
}

function exportarTiposCambio() {
    if (!tiposCambio) return;
    let csv = 'Moneda,Tasa (1 EUR = ?),Fuente,Fecha\n';
    const fuente = localStorage.getItem('tiposCambioFuente') || 'desconocida';
    const fecha = new Date().toISOString().split('T')[0];
    for (const [moneda, tasa] of Object.entries(tiposCambio)) {
        csv += `${moneda},${tasa},${fuente},${fecha}\n`;
    }
    descargarArchivo(csv, `tipos_cambio_${fecha}.csv`, 'text/csv');
    mostrarToast(' Tipos de cambio exportados', 'success');
}

function importarTiposCambio() {
    document.getElementById('importTiposCambioFile').click();
}

function procesarImportTiposCambio(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n');
        let count = 0;
        for (let i = 1; i < lines.length; i++) {
            const [moneda, tasa] = lines[i].split(',');
            if (moneda && tasa) {
                tiposCambio[moneda.trim()] = parseFloat(tasa);
                count++;
            }
        }
        localStorage.setItem('tiposCambioCache', JSON.stringify(tiposCambio));
        actualizarTiposCambioUI();
        actualizarStatsMonedas();
        mostrarToast(` ${count} tasas importadas`, 'success');
    };
    reader.readAsText(file);
}

function usarTiposCambioRespaldo() {
    console.log(" Usando tipos de cambio de respaldo (valores fijos)");
    
    tiposCambio = {
        EUR: 1, USD: 1.09, GBP: 0.86, JPY: 164, CHF: 0.95,
        BRL: 5.45, MXN: 18.25, COP: 4190, ARS: 950, CLP: 920,
        DZD: 134, CDF: 2800, MZN: 64, ZAR: 18.5,
        NGN: 1500, KES: 140, EGP: 48, MAD: 10.8,
        VES: 36, UYU: 39, PEN: 3.8, BOB: 6.9, PYG: 7300,
        CNY: 7.8, INR: 90, KRW: 1400, SGD: 1.45, HKD: 8.5,
        TRY: 32, PLN: 4.3, CZK: 25, HUF: 390, RON: 5.0,
        SEK: 11.2, NOK: 11.5, DKK: 7.5, ISK: 150
    };
    
    localStorage.setItem('tiposCambioCache', JSON.stringify(tiposCambio));
    localStorage.setItem('tiposCambioFuente', 'respaldo');
    ultimaActualizacionCambio = new Date();
    localStorage.setItem('ultimaActualizacionCambio', ultimaActualizacionCambio.toISOString());
    
    actualizarTiposCambioUI();
    mostrarFechaUltimaActualizacion();
    actualizarStatsMonedas();
    
    if (typeof calcularCashflow === 'function') calcularCashflow();
    if (typeof actualizarResumenGastos === 'function') actualizarResumenGastos();
    
    mostrarToast(" Usando tipos de cambio de respaldo (valores fijos)", 'info');
}

// Cargar proveedor guardado al inicio
document.addEventListener('DOMContentLoaded', () => {
    const savedProv = localStorage.getItem('proveedorTasas');
    if (savedProv) {
        proveedorActual = savedProv;
        const sel = document.getElementById('proveedorTasas');
        if (sel) sel.value = savedProv;
    }
    const savedInterval = localStorage.getItem('autoUpdateInterval');
    if (savedInterval) {
        autoUpdateInterval = parseInt(savedInterval);
        const sel = document.getElementById('autoUpdateInterval');
        if (sel) sel.value = autoUpdateInterval;
        if (autoUpdateInterval > 0) {
            autoUpdateTimer = setInterval(actualizarTiposCambioAuto, autoUpdateInterval);
        }
    }
});

function actualizarTiposCambioUI() {
    const container = document.getElementById('tiposCambioContainer');
    if (!container) return;
    
    if (!tiposCambio || Object.keys(tiposCambio).length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon"></div><p>No hay datos de tasas. Pulsa "Actualizar Tasas".</p></div>';
        return;
    }
    
    const monedasConRegion = getMonedasConRegion();
    const rows = Object.entries(tiposCambio).map(([moneda, tasa]) => {
        const info = monedasConRegion[moneda] || { region: 'other', nombre: moneda, flag: '' };
        const changeClass = tasa > 1 ? 'rate-high' : (tasa < 1 ? 'rate-low' : '');
        return `<tr data-moneda="${moneda}" data-region="${info.region}" data-nombre="${info.nombre.toLowerCase()}">
            <td class="moneda-cell">
                <span class="moneda-flag">${info.flag}</span>
                <span class="moneda-code">${moneda}</span>
                <span class="moneda-name">${info.nombre}</span>
            </td>
            <td class="tasa-cell">
                <input type="number" id="tasa_${moneda}" value="${tasa}" step="0.0001" class="tasa-input ${changeClass}" aria-label="Tasa para ${moneda}">
                <button class="btn-icon-btn" onclick="guardarTasa('${moneda}')" title="Guardar tasa" aria-label="Guardar tasa para ${moneda}"></button>
            </td>
        </tr>`;
    }).join('');
    
    container.innerHTML = `
        <table class="data-table tasas-table">
            <thead>
                <tr>
                    <th>Moneda</th>
                    <th>Tasa (1 EUR = ?)</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        <div class="table-footer">
            <span>${Object.keys(tiposCambio).length} monedas</span>
            <span class="fuente-badge">Fuente: ${getFuenteNombre()}</span>
        </div>`;
    
    actualizarStatsMonedas();
}

function getFuenteNombre() {
    const fuente = localStorage.getItem('tiposCambioFuente') || 'desconocida';
    const nombres = {
        frankfurter: ' Frankfurter (BCE)',
        exchangerate: ' ExchangeRate-API',
        currencyapi: ' CurrencyAPI',
        respaldo: ' Respaldo local',
        manual: ' Manual'
    };
    return nombres[fuente] || fuente;
}

function actualizarStatsMonedas() {
    const totalEl = document.getElementById('statTotalMonedas');
    const fuenteEl = document.getElementById('statFuenteActiva');
    const fechaEl = document.getElementById('statUltimaAct');
    const baseEl = document.getElementById('statMonedaBase');
    
    if (totalEl) totalEl.textContent = Object.keys(tiposCambio || {}).length;
    if (fuenteEl) fuenteEl.textContent = getFuenteNombre().split(' ')[0];
    if (fechaEl && ultimaActualizacionCambio) {
        const fecha = new Date(ultimaActualizacionCambio);
        fechaEl.textContent = fecha.toLocaleDateString() + ' ' + fecha.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    }
    if (baseEl && proyecto) baseEl.textContent = proyecto.monedaBase || 'EUR';
}

function getMonedasConRegion() {
    return {
        EUR: {region: 'europe', nombre: 'Euro', flag: ''},
        USD: {region: 'americas', nombre: 'Dólar EE.UU.', flag: ''},
        GBP: {region: 'europe', nombre: 'Libra Esterlina', flag: ''},
        JPY: {region: 'asia', nombre: 'Yen Japonés', flag: ''},
        CHF: {region: 'europe', nombre: 'Franco Suizo', flag: ''},
        BRL: {region: 'americas', nombre: 'Real Brasileño', flag: ''},
        MXN: {region: 'americas', nombre: 'Peso Mexicano', flag: ''},
        COP: {region: 'americas', nombre: 'Peso Colombiano', flag: ''},
        ARS: {region: 'americas', nombre: 'Peso Argentino', flag: ''},
        CLP: {region: 'americas', nombre: 'Peso Chileno', flag: ''},
        DZD: {region: 'africa', nombre: 'Dinar Argelino', flag: ''},
        CDF: {region: 'africa', nombre: 'Franco Congoleño', flag: ''},
        MZN: {region: 'africa', nombre: 'Metical Mozambique', flag: ''},
        ZAR: {region: 'africa', nombre: 'Rand Sudafricano', flag: ''},
        NGN: {region: 'africa', nombre: 'Naira Nigeriano', flag: ''},
        KES: {region: 'africa', nombre: 'Chelín Keniano', flag: ''},
        EGP: {region: 'africa', nombre: 'Libra Egipcia', flag: ''},
        MAD: {region: 'africa', nombre: 'Dirham Marroquí', flag: ''},
        CNY: {region: 'asia', nombre: 'Yuan Chino', flag: ''},
        INR: {region: 'asia', nombre: 'Rupia India', flag: ''},
        KRW: {region: 'asia', nombre: 'Won Surcoreano', flag: ''},
        SGD: {region: 'asia', nombre: 'Dólar Singapur', flag: ''},
        HKD: {region: 'asia', nombre: 'Dólar Hong Kong', flag: ''},
        TRY: {region: 'asia', nombre: 'Lira Turca', flag: ''},
        PLN: {region: 'europe', nombre: 'Zloty Polaco', flag: ''},
        CZK: {region: 'europe', nombre: 'Corona Checa', flag: ''},
        HUF: {region: 'europe', nombre: 'Forinto Húngaro', flag: ''},
        RON: {region: 'europe', nombre: 'Leu Rumano', flag: ''},
        SEK: {region: 'europe', nombre: 'Corona Sueca', flag: ''},
        NOK: {region: 'europe', nombre: 'Corona Noruega', flag: ''},
        DKK: {region: 'europe', nombre: 'Corona Danesa', flag: ''},
        ISK: {region: 'europe', nombre: 'Corona Islandesa', flag: ''},
        VES: {region: 'americas', nombre: 'Bolívar Venezolano', flag: ''},
        UYU: {region: 'americas', nombre: 'Peso Uruguayo', flag: ''},
        PEN: {region: 'americas', nombre: 'Sol Peruano', flag: ''},
        BOB: {region: 'americas', nombre: 'Boliviano', flag: ''},
        PYG: {region: 'americas', nombre: 'Guaraní Paraguayo', flag: ''}
    };
}

function filtrarMonedas(texto) {
    const filas = document.querySelectorAll('#tiposCambioContainer tbody tr');
    const busqueda = texto.toLowerCase();
    filas.forEach(fila => {
        const moneda = fila.dataset.moneda.toLowerCase();
        const nombre = fila.dataset.nombre.toLowerCase();
        fila.style.display = (moneda.includes(busqueda) || nombre.includes(busqueda)) ? '' : 'none';
    });
}

function filtrarPorRegion(region) {
    const filas = document.querySelectorAll('#tiposCambioContainer tbody tr');
    filas.forEach(fila => {
        fila.style.display = (!region || fila.dataset.region === region) ? '' : 'none';
    });
}

function cambiarTabMonedas(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    const btn = document.querySelector(`[data-tab="${tabId}"]`);
    const panel = document.getElementById(tabId);
    if (btn) btn.classList.add('active');
    if (panel) panel.classList.add('active');
    
    if (tabId === 'tab-evolucion') {
        setTimeout(() => actualizarGraficoEvolucionMoneda(), 100);
    }
}

function guardarTasa(moneda) {
    const input = document.getElementById(`tasa_${moneda}`);
    if (input) {
        const valor = parseFloat(input.value);
        if (!isNaN(valor) && valor > 0) {
            tiposCambio[moneda] = valor;
            localStorage.setItem('tiposCambioCache', JSON.stringify(tiposCambio));
            input.classList.add('saved');
            setTimeout(() => input.classList.remove('saved'), 1000);
            if (typeof calcularCashflow === 'function') calcularCashflow();
            if (typeof actualizarResumenGastos === 'function') actualizarResumenGastos();
            mostrarToast(` Tasa ${moneda} guardada: ${valor}`, 'success');
        }
    }
}

function guardarTasa(moneda) {
    const input = document.getElementById(`tasa_${moneda}`);
    if (input) {
        tiposCambio[moneda] = parseFloat(input.value);
        localStorage.setItem('tiposCambioCache', JSON.stringify(tiposCambio));
        if (typeof calcularCashflow === 'function') calcularCashflow();
        if (typeof actualizarResumenGastos === 'function') actualizarResumenGastos();
        mostrarToast(` Tasa para ${moneda} guardada`, 'success');
    }
}

function actualizarTiposCambio() {
    for (const moneda of Object.keys(tiposCambio)) {
        const input = document.getElementById(`tasa_${moneda}`);
        if (input) tiposCambio[moneda] = parseFloat(input.value);
    }
    localStorage.setItem('tiposCambioCache', JSON.stringify(tiposCambio));
    if (typeof calcularCashflow === 'function') calcularCashflow();
    if (typeof actualizarResumenGastos === 'function') actualizarResumenGastos();
    mostrarToast(tApp('toast_tipos_cambio_guardados'), 'success');
}

function cambiarMonedaBaseYActualizar() {
    const nuevaBase = document.getElementById('monedaBase').value;
    if (proyecto) {
        proyecto.monedaBase = nuevaBase;
        guardarProyecto();
        document.getElementById('monedaDisplay').innerHTML = nuevaBase;
        if (typeof calcularCashflow === 'function') calcularCashflow();
        if (typeof actualizarResumenGastos === 'function') actualizarResumenGastos();
        mostrarToast(` Moneda base cambiada a: ${nuevaBase}`, 'success');
    }
}

function mostrarFechaUltimaActualizacion() {
    const span = document.getElementById('ultimaActualizacionCambio');
    if (span) {
        if (ultimaActualizacionCambio) {
            const fecha = new Date(ultimaActualizacionCambio);
            span.innerText = fecha.toLocaleString();
        } else {
            span.innerText = 'No actualizada';
        }
    }
}

function actualizarTodosLosDatosExternos() {
    actualizarTiposCambioAuto();
    if (typeof actualizarArancelesTodos === 'function') actualizarArancelesTodos();
    mostrarToast(" Actualizando todos los datos...", 'info');
}

function exportarExcel() {
    let csv = "Nombre,Valor\n";
    csv += `Coste Total,${document.getElementById('totalCoste')?.innerText || '0'}\n`;
    csv += `Ingreso Total,${document.getElementById('totalIngreso')?.innerText || '0'}\n`;
    csv += `Beneficio,${document.getElementById('totalBeneficio')?.innerText || '0'}\n`;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `proyecto_${proyecto.nombre}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    mostrarToast(" Exportado a CSV", 'success');
}
        // ============================================
        // EXPORTAR PROYECTO ACTUAL A JSON
        // ============================================
        
        async function exportarProyectoActual() {
            if (!proyecto) {
                mostrarToast(tApp('toast_no_proyecto'), 'error');
                return;
            }
            
            const datosExportar = {
                version: "1.0",
                fechaExportacion: new Date().toISOString(),
                tipo: "proyecto_unico",
                proyecto: proyecto
            };
            
            const jsonStr = JSON.stringify(datosExportar, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const nombreArchivo = `${proyecto.nombre.replace(/[^a-z0-9]/gi, '_')}_backup_${new Date().toISOString().split('T')[0]}.json`;
            
            // Usar File System Access API si está disponible (Chrome/Edge)
            if ('showSaveFilePicker' in window) {
                try {
                    const opciones = {
                        suggestedName: nombreArchivo,
                        types: [{
                            description: 'Archivo JSON',
                            accept: { 'application/json': ['.json'] }
                        }]
                    };
                    const fileHandle = await window.showSaveFilePicker(opciones);
                    const writable = await fileHandle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                    mostrarToast(` Proyecto "${proyecto.nombre}" guardado correctamente`, 'success');
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        descargaTradicionalProyecto(blob, nombreArchivo);
                    }
                }
            } else {
                // Firefox, Safari - descarga directa
                descargaTradicionalProyecto(blob, nombreArchivo);
            }
        }
        // ============================================
// IMPORTAR PROYECTO DESDE ARCHIVO

// IMPORTAR PROYECTO DESDE ARCHIVO
// ============================================

function importarProyecto() {
    // Crear input de tipo file
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    
    input.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            // Verificar que es un backup válido
            if (data.tipo === 'proyecto_unico' && data.proyecto) {
                // Es formato de exportación
                proyecto = data.proyecto;
                
                // Asegurar que todas las propiedades necesarias existan
                inicializarEstructuraProyecto(proyecto);
                
                // Guardar en localStorage
                let todos = cargarProyectosStorage();
                const idx = todos.findIndex(p => p.id === proyecto.id);
                if (idx >= 0) {
                    todos[idx] = proyecto;
                } else {
                    todos.push(proyecto);
                }
                guardarProyectosStorage(todos);
                localStorage.setItem('proyectoSeleccionado', proyecto.id);
                
                // Recargar la página para aplicar cambios
                mostrarToast(tApp('toast_proyecto_importado'), 'success');
                setTimeout(() => location.reload(), 1500);
                
            } else if (data.id || data.nombre) {
                // Es formato antiguo o proyecto directo
                proyecto = data;
                inicializarEstructuraProyecto(proyecto);
                
                let todos = cargarProyectosStorage();
                const idx = todos.findIndex(p => p.id === proyecto.id);
                if (idx >= 0) {
                    todos[idx] = proyecto;
                } else {
                    todos.push(proyecto);
                }
                guardarProyectosStorage(todos);
                localStorage.setItem('proyectoSeleccionado', proyecto.id);
                
                mostrarToast(tApp('toast_proyecto_importado'), 'success');
                setTimeout(() => location.reload(), 1500);
                
            } else {
                mostrarToast(" El archivo no es un backup válido del proyecto", 'error');
            }
            
        } catch (error) {
            console.error("Error al importar:", error);
            mostrarToast(" Error al leer el archivo. Formato no válido.", 'error');
        }
        
        input.remove();
    };
    
    document.body.appendChild(input);
    input.click();
}

// Función para inicializar todas las propiedades necesarias del proyecto
function inicializarEstructuraProyecto(proy) {
    if (!proy.configAranceles) proy.configAranceles = [];
    if (!proy.tasasAduanerasFijas) proy.tasasAduanerasFijas = [];
    if (!proy.costesFinancierosExtra) proy.costesFinancierosExtra = [];
    if (!proy.hitosFinancieros) proy.hitosFinancieros = [];
    if (!proy.stakeholders) proy.stakeholders = [];
    if (!proy.raci) proy.raci = [];
    if (!proy.equipo) proy.equipo = [];
    if (!proy.materiales) proy.materiales = [];
    if (!proy.servicios) proy.servicios = [];
    if (!proy.comunicaciones) proy.comunicaciones = [];
    if (!proy.reuniones) proy.reuniones = [];
    if (!proy.riesgos) proy.riesgos = [];
    if (!proy.accionesMitigacion) proy.accionesMitigacion = [];
    if (!proy.elementosGantt) proy.elementosGantt = [];
    if (!proy.procesos || proy.procesos.length === 0) proy.procesos = JSON.parse(JSON.stringify(PROCESOS_PMBOK));
    if (!proy.monedaVenta) proy.monedaVenta = proy.monedaBase || 'EUR';
    if (!proy.condicionesPago) proy.condicionesPago = "";
    if (!proy.acta) proy.acta = {};
    if (!proy.viajes) proy.viajes = [];
    if (!proy.avales) proy.avales = [];
    if (!proy.garantia) proy.garantia = null;
    if (proy.defectos === undefined) proy.defectos = 0;
    if (proy.velocidadEquipo === undefined) proy.velocidadEquipo = 0;
    if (proy.huellaCarbono === undefined) proy.huellaCarbono = 0;
    if (!proy.satisfacciones) proy.satisfacciones = [];
    if (proy.satisfaccionPromedio === undefined) proy.satisfaccionPromedio = 0;
    
    return proy;
}
        
        function descargaTradicionalProyecto(blob, nombreArchivo) {
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = nombreArchivo;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            mostrarToast(` Proyecto exportado: ${nombreArchivo}`, 'success');
        }
        // ============================================

        // ============================================
        // PANEL DE SALUD DEL PROYECTO
        // ============================================
        
        let saludChartProgreso = null;
        let saludChartRiesgos = null;
        let saludChartCashflow = null;
        let saludChartEntregables = null;
        
function actualizarPanelSalud() {
    if (!proyecto) return;
    
    // ============================================
    // 1. CÁLCULO DE COSTES E INGRESOS (INCLUYENDO SPRINTS ÁGILES)
    // ============================================
    let costeTotal = 0;
    
    // Costes de equipo (Cascada)
    (proyecto.equipo || []).forEach(e => costeTotal += convertirMoneda(e.costeHora * e.horasMes * 12, e.moneda));
    
    // Costes de materiales
    (proyecto.materiales || []).forEach(m => costeTotal += convertirMoneda(m.cantidad * m.costeUnitario, m.moneda));
    
    // Costes de servicios
    (proyecto.servicios || []).forEach(s => costeTotal += convertirMoneda(s.cantidad * s.costeUnitario, s.moneda));
    
    // Costes de viajes
    (proyecto.viajes || []).forEach(v => costeTotal += convertirMoneda((v.costeVuelos + v.costeHotel + v.costeComidas + v.costeTraslados), v.moneda));
    
    //  NUEVO: Costes de sprints ágiles (si está en modo ágil o mixto)
    const metodologia = proyecto?.metodologia?.tipo || 'cascada';
    const esAgile = (metodologia === 'agile' || metodologia === 'mixto');
    
    let costeAgileTotal = 0;
    let agileCPI = 1;
    let agileSPI = 1;
    let agileEAC = 0;
    let agileTendencia = 'neutral';
    let velocidadPromedioAgile = 0;
    
    if (esAgile && proyecto.scrum && proyecto.scrum.sprints) {
        const sprintsCompletados = proyecto.scrum.sprints.filter(s => s.estado === 'completado');
        
        let totalPuntosPlanificados = 0;
        let totalPuntosCompletados = 0;
        let totalCostePlanificado = 0;
        let totalCosteReal = 0;
        
        sprintsCompletados.forEach(sprint => {
            // Obtener costes del sprint (de los cálculos ágiles)
            if (sprint.costes) {
                totalCosteReal += sprint.costes.real || 0;
                totalCostePlanificado += sprint.costes.planificado || 0;
            } else {
                // Calcular desde las historias si no hay costes guardados
                const historiasSprint = (proyecto.scrum.historias || []).filter(h => h.sprintId === sprint.id);
                historiasSprint.forEach(historia => {
                    if (historia.estado === 'done' && historia.recursoAsignado) {
                        const dias = historia.diasReales || historia.diasEstimados || 5;
                        const horasPorDia = historia.horasPorDia || 8;
                        const horasTotales = dias * horasPorDia;
                        totalCosteReal += horasTotales * historia.recursoAsignado.costeHora;
                    }
                    totalCostePlanificado += historia.costeEstimado || 0;
                });
            }
            
            totalPuntosPlanificados += sprint.puntosPlanificados || 0;
            totalPuntosCompletados += sprint.puntosCompletados || 0;
        });
        
        costeAgileTotal = totalCosteReal;
        costeTotal += convertirMoneda(costeAgileTotal, proyecto.monedaBase);
        
        // Calcular métricas ágiles
        agileCPI = totalCostePlanificado > 0 ? totalCostePlanificado / totalCosteReal : 1;
        agileSPI = totalPuntosPlanificados > 0 ? totalPuntosCompletados / totalPuntosPlanificados : 1;
        
        // EAC basado en CPI ágil
        const presupuestoTotal = proyecto.precioVenta || totalCostePlanificado;
        agileEAC = agileCPI > 0 ? presupuestoTotal / agileCPI : presupuestoTotal;
        
        // Velocidad promedio
        if (sprintsCompletados.length > 0) {
            velocidadPromedioAgile = totalPuntosCompletados / sprintsCompletados.length;
        }
        
        // Tendencia
        if (sprintsCompletados.length >= 2) {
            const ultimoSprint = sprintsCompletados[sprintsCompletados.length - 1];
            const anteriorSprint = sprintsCompletados[sprintsCompletados.length - 2];
            const mejoraVelocidad = (ultimoSprint.puntosCompletados || 0) - (anteriorSprint.puntosCompletados || 0);
            if (mejoraVelocidad > 0) agileTendencia = 'mejorando';
            else if (mejoraVelocidad < 0) agileTendencia = 'empeorando';
        }
        
        console.log(` Métricas Ágiles: CPI=${agileCPI.toFixed(2)}, SPI=${agileSPI.toFixed(2)}, Velocidad=${velocidadPromedioAgile} pts/sprint`);
    }
    
    let BAC = proyecto.precioVenta || 0;
    let AC = costeTotal;
    
    // ============================================
    // 2. VERIFICAR SI HAY DATOS REALES EN EL CRONOGRAMA
    // ============================================
    let elementosGantt = proyecto.elementosGantt || [];
    let tieneDatosReales = false;
    
    elementosGantt.forEach(e => {
        if ((e.progreso || 0) > 0 || e.finReal || e.inicioReal) {
            tieneDatosReales = true;
        }
    });
    
    // Si estamos en modo ágil y hay sprints completados, consideramos que hay datos reales
    if (esAgile && (proyecto.scrum?.sprints?.filter(s => s.estado === 'completado').length > 0)) {
        tieneDatosReales = true;
    }
    
    let procesosCompletados = (proyecto.procesos || []).filter(p => p.completado).length;
    let tieneProcesosCompletados = procesosCompletados > 0;
    
    // ============================================
    // 3. CÁLCULO DE RIESGOS
    // ============================================
    let riesgos = proyecto.riesgos || [];
    let riesgosCriticos = riesgos.filter(r => r.nivel === 'Crítico' || r.nivel === 'critico').length;
    let riesgosAltos = riesgos.filter(r => r.nivel === 'Alto' || r.nivel === 'alto').length;
    let riesgosMedios = riesgos.filter(r => r.nivel === 'Medio' || r.nivel === 'medio').length;
    let riesgoScore = (riesgosCriticos * 5) + (riesgosAltos * 3) + (riesgosMedios * 1);
    let riesgoNivel = riesgoScore === 0 ? ' Sin riesgos' : 
                     (riesgoScore <= 5 ? ' Riesgo bajo' : 
                     (riesgoScore <= 15 ? ' Riesgo medio' : ' Riesgo alto'));
    
    // ============================================
    // 4. CÁLCULO DE DESVIACIÓN DE CRONOGRAMA
    // ============================================
    let desviacionDias = 0;
    let tareasConDesviacion = 0;
    
    elementosGantt.forEach(tarea => {
        if (tarea.finReal && tarea.inicio && tarea.duracion) {
            let fechaFinPlan = new Date(tarea.inicio);
            fechaFinPlan.setDate(fechaFinPlan.getDate() + tarea.duracion);
            let fechaFinReal = new Date(tarea.finReal);
            let diffDias = Math.ceil((fechaFinReal - fechaFinPlan) / (1000 * 60 * 60 * 24));
            if (diffDias > 0) {
                desviacionDias += diffDias;
                tareasConDesviacion++;
            }
        }
    });
    
    let desviacionPromedio = tareasConDesviacion > 0 ? Math.round(desviacionDias / tareasConDesviacion) : 0;
    let desviacionTexto = desviacionPromedio === 0 ? ' A tiempo' : 
                          (desviacionPromedio <= 10 ? ` +${desviacionPromedio} días` : ` +${desviacionPromedio} días`);
    
    // ============================================
    // 5. CÁLCULO DE SALUD FINANCIERA
    // ============================================
    let beneficio = BAC - costeTotal;
    let saludFinanciera = 100;
    if (BAC > 0) {
        let margen = (beneficio / BAC) * 100;
        if (margen < 0) saludFinanciera = Math.max(0, 30 + margen);
        else if (margen < 10) saludFinanciera = 50 + (margen * 2);
        else saludFinanciera = Math.min(100, 70 + (margen - 10));
    }
    saludFinanciera = Math.min(100, Math.max(0, saludFinanciera));
    
    // ============================================
    // 6. CPI, SPI, EAC - CON VERIFICACIÓN DE DATOS REALES
    // ============================================
    let EV = 0;
    let PV = 0;
    let CPI = 1;
    let SPI = 1;
    let EAC = BAC;
    
    if (tieneDatosReales) {
        if (esAgile && costeAgileTotal > 0) {
            //  Usar métricas ágiles si están disponibles
            CPI = agileCPI;
            SPI = agileSPI;
            EAC = agileEAC;
            EV = AC * CPI; // Valor ganado aproximado
            PV = AC * SPI; // Valor planificado aproximado
        } else {
            // Calcular EV real desde elementosGantt (modo cascada)
            let evAcumulado = 0;
            if (elementosGantt.length > 0 && BAC > 0) {
                let pesoPorElemento = BAC / elementosGantt.length;
                elementosGantt.forEach(e => {
                    let progreso = e.progreso || 0;
                    if (e.tipo === 'hito' && e.progreso === 100) progreso = 100;
                    evAcumulado += pesoPorElemento * (progreso / 100);
                });
            }
            EV = evAcumulado;
            
            // Calcular PV basado en tiempo transcurrido
            let fechaHoy = new Date();
            let fechaInicio = proyecto.fechaInicio ? new Date(proyecto.fechaInicio) : null;
            let fechaFinPlan = proyecto.fechaFinPlan ? new Date(proyecto.fechaFinPlan) : null;
            
            if (fechaInicio && fechaFinPlan && fechaInicio <= fechaHoy) {
                let totalDuracion = (fechaFinPlan - fechaInicio) / (1000 * 60 * 60 * 24);
                let diasTranscurridos = (fechaHoy - fechaInicio) / (1000 * 60 * 60 * 24);
                let porcentajePlanificado = totalDuracion > 0 ? Math.min(100, Math.max(0, (diasTranscurridos / totalDuracion) * 100)) : 0;
                PV = BAC * (porcentajePlanificado / 100);
            } else {
                let progresoGeneralVal = calcularProgresoGeneral() / 100;
                PV = BAC * progresoGeneralVal;
            }
            
            CPI = AC > 0 ? EV / AC : 1;
            SPI = PV > 0 ? EV / PV : 1;
            
            if (CPI > 0 && CPI < 0.95) {
                EAC = AC + (BAC - EV) / CPI;
            } else if (CPI >= 0.95) {
                EAC = AC + (BAC - EV);
            } else {
                EAC = BAC;
            }
            EAC = Math.max(EAC, AC);
        }
    } else if (tieneProcesosCompletados && BAC > 0) {
        let totalProcesos = proyecto.procesos.length;
        let progresoPorProcesos = procesosCompletados / totalProcesos;
        EV = BAC * progresoPorProcesos;
        PV = BAC * progresoPorProcesos;
        CPI = AC > 0 ? EV / AC : 1;
        SPI = 1;
        EAC = CPI > 0 ? BAC / CPI : BAC;
    }
    
    CPI = Math.min(2, Math.max(0, CPI));
    SPI = Math.min(2, Math.max(0, SPI));
    
    let cpiEstadoTexto = CPI >= 0.95 ? ' Excelente' : (CPI >= 0.85 ? ' Atención' : (CPI >= 0.7 ? ' Crítico' : ' Crítico'));
    let cpiColor = CPI >= 0.95 ? '#00A859' : (CPI >= 0.85 ? '#FF8C00' : '#FF3B30');
    
    let spiEstadoTexto = SPI >= 0.95 ? ' Excelente' : (SPI >= 0.85 ? ' Atención' : (SPI >= 0.7 ? ' Crítico' : ' Crítico'));
    let spiColor = SPI >= 0.95 ? '#00A859' : (SPI >= 0.85 ? '#FF8C00' : '#FF3B30');
    
    // ============================================
    // 7. OTROS INDICADORES
    // ============================================
    let defectos = proyecto.defectos || 0;
    let totalEntregables = elementosGantt.filter(e => e.tipo === 'entregable').length || 1;
    let indiceDefectos = defectos / totalEntregables;
    let defectosEstado = indiceDefectos <= 0.5 ? ' Excelente' : (indiceDefectos <= 2 ? ' Aceptable' : ' Alto');
    
    // Usar velocidad de sprints ágiles si está disponible
    let velocidadEquipo = proyecto.velocidadEquipo || 0;
    if (esAgile && velocidadPromedioAgile > 0) {
        velocidadEquipo = Math.round(velocidadPromedioAgile);
        proyecto.velocidadEquipo = velocidadEquipo;
    }
    let velocidadEstado = velocidadEquipo >= 20 ? ' Excelente' : (velocidadEquipo >= 10 ? ' Normal' : ' Por definir');
    
    let ROI = costeTotal > 0 ? (beneficio / costeTotal) * 100 : 0;
    let roiEstado = ROI > 0 ? ' Rentable' : (ROI > -10 ? ' Atención' : ' Pérdida');
    
    let satisfaccion = proyecto.satisfaccionPromedio || 0;
    let satisfaccionEstado = satisfaccion >= 4.0 ? ' Excelente' : (satisfaccion >= 3.0 ? ' Mejorable' : ' Crítica');
    
    let huellaCarbono = proyecto.huellaCarbono || 0;
    let huellaEstado = huellaCarbono <= 50 ? ' Baja' : (huellaCarbono <= 100 ? ' Media' : ' Alta');
    
    let beneficioProyectado = beneficio;
    let margenProyectado = BAC > 0 ? ((beneficio / BAC) * 100).toFixed(1) : 0;
    
    // ============================================
    // 8. SALUD GENERAL PMBOK
    // ============================================
    let progresoGeneralVal = calcularProgresoGeneral() / 100;
    let saludGeneral = (
        (Math.min(1, CPI) * 15) +
        (Math.min(1, SPI) * 15) +
        (Math.min(1, ROI / 20) * 10) +
        (Math.max(0, 1 - indiceDefectos / 5) * 10) +
        (Math.min(1, velocidadEquipo / 30) * 10) +
        (satisfaccion / 5 * 15) +
        (Math.max(0, 1 - huellaCarbono / 200) * 10) +
        (progresoGeneralVal * 15)
    );
    saludGeneral = Math.min(100, Math.max(0, saludGeneral));
    
    // ============================================
    // 9. ACTUALIZAR DOM
    // ============================================
    
    // Riesgos
    let riesgosScoreElem = document.getElementById('riesgosScore');
    if (riesgosScoreElem) riesgosScoreElem.innerHTML = riesgoScore;
    let riesgosNivelElem = document.getElementById('riesgosNivel');
    if (riesgosNivelElem) riesgosNivelElem.innerHTML = riesgoNivel;
    
    // Salud Financiera
    let saludFinancieraElem = document.getElementById('saludFinanciera');
    if (saludFinancieraElem) saludFinancieraElem.innerHTML = Math.round(saludFinanciera) + '%';
    let finanzasDetalleElem = document.getElementById('finanzasDetalle');
    if (finanzasDetalleElem) finanzasDetalleElem.innerHTML = `Beneficio: ${formatearMoneda(beneficio)}`;
    
    // Desviación
    let desviacionCronoElem = document.getElementById('desviacionCronograma');
    if (desviacionCronoElem) desviacionCronoElem.innerHTML = desviacionPromedio;
    let cronoDetalleElem = document.getElementById('cronoDetalle');
    if (cronoDetalleElem) cronoDetalleElem.innerHTML = desviacionTexto;
    
    // Beneficio Proyectado
    let beneficioProyectadoElem = document.getElementById('beneficioProyectado');
    if (beneficioProyectadoElem) beneficioProyectadoElem.innerHTML = formatearMoneda(beneficioProyectado);
    let margenProyectadoElem = document.getElementById('margenProyectado');
    if (margenProyectadoElem) margenProyectadoElem.innerHTML = `Margen: ${margenProyectado}%`;
    
    // Progreso General
    let progresoGeneralElem = document.getElementById('progresoGeneral');
    if (progresoGeneralElem) progresoGeneralElem.innerHTML = Math.round(progresoGeneralVal * 100) + '%';
    let progresoBarraElem = document.getElementById('progresoBarra');
    if (progresoBarraElem) progresoBarraElem.style.width = (progresoGeneralVal * 100) + '%';
    
    // CPI
    let cpiValorElem = document.getElementById('cpiValor');
    if (cpiValorElem) cpiValorElem.innerHTML = CPI.toFixed(2);
    let cpiEstadoElem = document.getElementById('cpiEstado');
    if (cpiEstadoElem) {
        cpiEstadoElem.innerHTML = cpiEstadoTexto;
        cpiEstadoElem.style.color = cpiColor;
    }
    
    // SPI
    let spiValorElem = document.getElementById('spiValor');
    if (spiValorElem) spiValorElem.innerHTML = SPI.toFixed(2);
    let spiEstadoElem = document.getElementById('spiEstado');
    if (spiEstadoElem) {
        spiEstadoElem.innerHTML = spiEstadoTexto;
        spiEstadoElem.style.color = spiColor;
    }
    
    // ROI
    let roiValorElem = document.getElementById('roiValor');
    if (roiValorElem) roiValorElem.innerHTML = ROI.toFixed(1) + '%';
    let roiEstadoElem = document.getElementById('roiEstado');
    if (roiEstadoElem) {
        roiEstadoElem.innerHTML = roiEstado;
        roiEstadoElem.style.color = ROI > 0 ? '#00A859' : '#FF3B30';
    }
    
    // EAC
    let eacValorElem = document.getElementById('eacValor');
    if (eacValorElem) eacValorElem.innerHTML = formatearMoneda(EAC);
    
    // Defectos
    let defectosValorElem = document.getElementById('defectosValor');
    if (defectosValorElem) defectosValorElem.innerHTML = indiceDefectos.toFixed(1);
    let defectosEstadoElem = document.getElementById('defectosEstado');
    if (defectosEstadoElem) defectosEstadoElem.innerHTML = defectosEstado;
    
    // Velocidad
    let velocidadValorElem = document.getElementById('velocidadValor');
    if (velocidadValorElem) velocidadValorElem.innerHTML = velocidadEquipo;
    let velocidadEstadoElem = document.getElementById('velocidadEstado');
    if (velocidadEstadoElem) velocidadEstadoElem.innerHTML = velocidadEstado;
    
    // Satisfacción
    let satisfaccionValorElem = document.getElementById('satisfaccionValor');
    if (satisfaccionValorElem) satisfaccionValorElem.innerHTML = satisfaccion.toFixed(1);
    let satisfaccionEstadoElem = document.getElementById('satisfaccionEstado');
    if (satisfaccionEstadoElem) satisfaccionEstadoElem.innerHTML = satisfaccionEstado;
    
    // Huella
    let huellaValorElem = document.getElementById('huellaValor');
    if (huellaValorElem) huellaValorElem.innerHTML = huellaCarbono;
    let huellaEstadoElem = document.getElementById('huellaEstado');
    if (huellaEstadoElem) huellaEstadoElem.innerHTML = huellaEstado;
    
    // Salud General
    let saludGeneralPMBOKElem = document.getElementById('saludGeneralPMBOK');
    if (saludGeneralPMBOKElem) {
        saludGeneralPMBOKElem.innerHTML = Math.round(saludGeneral) + '%';
        let saludColor = saludGeneral >= 70 ? '#00A859' : (saludGeneral >= 40 ? '#FF8C00' : '#FF3B30');
        saludGeneralPMBOKElem.style.color = saludColor;
    }
    
    //  NUEVO: Añadir/Actualizar tarjeta de métricas ágiles en el panel de salud
    let agileCard = document.getElementById('cardAgileMetrics');
    if (!agileCard && esAgile) {
        const cardsGrid = document.querySelector('#panelSalud .cards-grid');
        if (cardsGrid) {
            const newCard = document.createElement('div');
            newCard.id = 'cardAgileMetrics';
            newCard.className = 'value-card';
            newCard.style.background = 'linear-gradient(135deg, rgba(0,122,255,0.2), rgba(0,85,204,0.1))';
            newCard.innerHTML = `
                <div class="small"> Salud Ágil</div>
                <div class="big" id="agileSaludValor">--</div>
                <div class="small" id="agileSaludDetalle">SPI/CPI</div>
            `;
            cardsGrid.appendChild(newCard);
        }
    }
    
    if (esAgile) {
        const agileSaludValor = document.getElementById('agileSaludValor');
        if (agileSaludValor) {
            let saludAgileTexto = '';
            let saludAgileColor = '';
            const promedioAgile = (agileSPI + agileCPI) / 2;
            if (promedioAgile >= 0.95) {
                saludAgileTexto = ' Excelente';
                saludAgileColor = '#00A859';
            } else if (promedioAgile >= 0.85) {
                saludAgileTexto = ' Atención';
                saludAgileColor = '#FF8C00';
            } else {
                saludAgileTexto = ' Crítico';
                saludAgileColor = '#FF3B30';
            }
            agileSaludValor.innerHTML = saludAgileTexto;
            agileSaludValor.style.color = saludAgileColor;
        }
        
        const agileSaludDetalle = document.getElementById('agileSaludDetalle');
        if (agileSaludDetalle) {
            const tendenciaTexto = agileTendencia === 'mejorando' ? ' Mejorando' : (agileTendencia === 'empeorando' ? ' Empeorando' : ' Estable');
            agileSaludDetalle.innerHTML = `SPI: ${agileSPI.toFixed(2)} | CPI: ${agileCPI.toFixed(2)} | ${tendenciaTexto}`;
        }
        
        // Actualizar también los elementos del panel AgileCostControl si existen
        const agileCPIElem = document.getElementById('agileCPI');
        if (agileCPIElem) agileCPIElem.innerHTML = agileCPI.toFixed(2);
        
        const agileSPIElem = document.getElementById('agileSPI');
        if (agileSPIElem) agileSPIElem.innerHTML = agileSPI.toFixed(2);
        
        const agileEACElem = document.getElementById('agileEAC');
        if (agileEACElem) agileEACElem.innerHTML = formatearMoneda(agileEAC);
    }
    
    // Semáforo principal
    let saludSemaforoElem = document.getElementById('saludSemaforo');
    if (saludSemaforoElem) {
        let semaforoTexto = saludGeneral >= 70 ? ' PROYECTO SALUDABLE' : (saludGeneral >= 40 ? ' ATENCIÓN' : ' CRÍTICO');
        saludSemaforoElem.innerHTML = semaforoTexto;
        saludSemaforoElem.style.color = saludGeneral >= 70 ? '#00A859' : (saludGeneral >= 40 ? '#FF8C00' : '#FF3B30');
    }
    
    let saludMensajeElem = document.getElementById('saludMensaje');
    if (saludMensajeElem) {
        if (!tieneDatosReales) {
            saludMensajeElem.innerHTML = ` Sin datos de cronograma. CPI y SPI = 1.00. Actualiza el Gantt para métricas reales.`;
        } else if (esAgile && costeAgileTotal > 0) {
            saludMensajeElem.innerHTML = ` Modo Ágil | CPI: ${agileCPI.toFixed(2)} | SPI: ${agileSPI.toFixed(2)} | Velocidad: ${velocidadPromedioAgile} pts/sprint | ${agileTendencia}`;
        } else {
            saludMensajeElem.innerHTML = `CPI: ${CPI.toFixed(2)} | SPI: ${SPI.toFixed(2)} | Riesgos: ${riesgosCriticos} críticos`;
        }
    }
    
    // Actualizar KPIs
    actualizarKPIs(CPI, SPI, ROI, indiceDefectos, velocidadEquipo, satisfaccion, huellaCarbono, EAC);
    
    mostrarToast(" Panel de salud actualizado", 'success');
}

async function exportarSaludPDF() {
    if (!proyecto) {
        mostrarToast(tApp('toast_no_proyecto'), 'error');
        return;
    }
    
    mostrarToast(" Generando PDF de salud...", 'info');
    
    // Crear un contenedor temporal para clonar el panel
    const panelSalud = document.getElementById('panelSalud');
    const cloneContainer = document.createElement('div');
    cloneContainer.style.position = 'absolute';
    cloneContainer.style.top = '-9999px';
    cloneContainer.style.left = '-9999px';
    cloneContainer.style.width = '1200px';
    cloneContainer.style.background = 'white';
    cloneContainer.style.color = '#333';
    cloneContainer.style.padding = '40px';
    cloneContainer.style.fontFamily = 'Arial, sans-serif';
    
    // Clonar el contenido
    const clone = panelSalud.cloneNode(true);
    
    // Eliminar botones del clon
    const botones = clone.querySelectorAll('.btn');
    botones.forEach(b => b.remove());
    
    // Eliminar inputs range y otros elementos interactivos
    const inputs = clone.querySelectorAll('input, select, textarea');
    inputs.forEach(i => i.remove());
    
    // Estilos específicos para el PDF
    const style = document.createElement('style');
    style.textContent = `
        .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .value-card { background: #f5f5f5; border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #e0e0e0; }
        .value-card .big { font-size: 24px; font-weight: bold; color: #007AFF; }
        .info-card { background: #f9f9f9; border-radius: 12px; padding: 16px; margin-bottom: 20px; border-left: 4px solid #007AFF; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .data-table th { background: #007AFF; color: white; }
        .progress-bar-container { background: #e0e0e0; border-radius: 10px; height: 8px; overflow: hidden; }
        .progress-fill { background: #007AFF; height: 100%; }
        .cashflow-positive { color: #00A859; }
        .cashflow-negative { color: #FF3B30; }
        h4 { color: #007AFF; margin: 16px 0 8px 0; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007AFF; padding-bottom: 20px; }
        .header h1 { color: #007AFF; margin: 0; }
        .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
    `;
    clone.appendChild(style);
    
    // Añadir cabecera
    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = `
        <h1> INFORME DE SALUD DEL PROYECTO</h1>
        <p><strong>${escapeHtml(proyecto.nombre || 'Proyecto')}</strong> | Generado: ${new Date().toLocaleString()}</p>
    `;
    clone.insertBefore(header, clone.firstChild);
    
    // Añadir pie de página
    const footer = document.createElement('div');
    footer.className = 'footer';
    footer.innerHTML = '<p>Informe generado por PMI Mind - Basado en PMBOK 8ª Edición</p>';
    clone.appendChild(footer);
    
    cloneContainer.appendChild(clone);
    document.body.appendChild(cloneContainer);
    
    // Esperar a que los canvas se rendericen (si hay)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
        // Capturar los canvas actuales (los originales, no los clonados)
        const canvasElements = document.querySelectorAll('canvas');
        const canvasImages = [];
        
        for (let i = 0; i < canvasElements.length; i++) {
            const canvas = canvasElements[i];
            if (canvas && canvas.width > 0 && canvas.height > 0) {
                try {
                    const imageData = canvas.toDataURL('image/png');
                    canvasImages.push(imageData);
                } catch(e) { console.log("Canvas error:", e); }
            }
        }
        
        // Convertir todo el clon a imagen
        const canvas = await html2canvas(cloneContainer, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true
        });
        
        const imageData = canvas.toDataURL('image/png');
        
        // Crear PDF en nueva ventana
        const ventana = window.open('', '_blank');
        ventana.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Informe de Salud - ${escapeHtml(proyecto.nombre || 'Proyecto')}</title>
                <style>
                    body { margin: 0; padding: 0; display: flex; justify-content: center; }
                    img { max-width: 100%; height: auto; }
                    @media print {
                        body { margin: 0; padding: 0; }
                        img { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <img src="${imageData}" class="u-w-full" />
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            setTimeout(function() { window.close(); }, 1000);
                        }, 500);
                    };
                <\/script>
            </body>
            </html>
        `);
        ventana.document.close();
        
        mostrarToast(" PDF generado correctamente", 'success');
        
    } catch (error) {
        console.error("Error generando PDF:", error);
        mostrarToast(" Error al generar el PDF", 'error');
    } finally {
        document.body.removeChild(cloneContainer);
    }
}
        
       function calcularProgresoGeneral() {
    // 1. Progreso de PROCESOS PMBOK
    let totalProcesos = proyecto.procesos?.length || 49;
    let procesosCompletados = (proyecto.procesos || []).filter(p => p.completado).length;
    let progresoProcesos = procesosCompletados / totalProcesos;
    
    // 2. Progreso de ENTREGABLES (desde el cronograma Gantt)
    let entregables = (proyecto.elementosGantt || []).filter(e => e.tipo === 'entregable');
    let totalEntregables = entregables.length || 1;
    let progresoEntregables = 0;
    
    if (entregables.length > 0) {
        let sumaProgreso = entregables.reduce((sum, e) => sum + (e.progreso || 0), 0);
        progresoEntregables = sumaProgreso / (totalEntregables * 100);
    }
    
    // 3. Progreso de ACTIVIDADES (del Gantt)
    let actividades = (proyecto.elementosGantt || []).filter(e => e.tipo === 'actividad');
    let totalActividades = actividades.length || 1;
    let progresoActividades = 0;
    if (actividades.length > 0) {
        let sumaProgresoActs = actividades.reduce((sum, e) => sum + (e.progreso || 0), 0);
        progresoActividades = sumaProgresoActs / (totalActividades * 100);
    }
    
    // 4. Progreso de HITOS
    let hitos = (proyecto.elementosGantt || []).filter(e => e.tipo === 'hito');
    let hitosCompletados = hitos.filter(h => h.progreso === 100).length;
    let totalHitos = hitos.length || 1;
    let progresoHitos = hitosCompletados / totalHitos;
    
    //  PONDERACIÓN:
    // 40% Actividades + 30% Entregables + 20% Procesos + 10% Hitos
    let progreso = (progresoActividades * 0.4) + 
                   (progresoEntregables * 0.3) + 
                   (progresoProcesos * 0.2) + 
                   (progresoHitos * 0.1);
    
    return Math.min(100, Math.max(0, progreso * 100));
}
function diagnosticarProgreso() {
    let elementos = proyecto.elementosGantt || [];
    let actividades = elementos.filter(e => e.tipo === 'actividad');
    let entregables = elementos.filter(e => e.tipo === 'entregable');
    let hitos = elementos.filter(e => e.tipo === 'hito');
    let procesos = proyecto.procesos || [];
    
    // Calcular porcentajes
    let progAct = 0;
    if (actividades.length > 0) {
        let suma = actividades.reduce((s, e) => s + (e.progreso || 0), 0);
        progAct = suma / (actividades.length * 100);
    }
    
    let progEnt = 0;
    if (entregables.length > 0) {
        let suma = entregables.reduce((s, e) => s + (e.progreso || 0), 0);
        progEnt = suma / (entregables.length * 100);
    }
    
    let progProc = procesos.filter(p => p.completado).length / (procesos.length || 49);
    
    let progHit = 0;
    if (hitos.length > 0) {
        progHit = hitos.filter(h => h.progreso === 100).length / hitos.length;
    }
    
    let progresoFinal = (progAct * 0.4) + (progEnt * 0.3) + (progProc * 0.2) + (progHit * 0.1);
    
    // Crear mensaje
    let mensaje = `
        <div style="background: rgba(0,0,0,0.8); padding: 16px; border-radius: 12px; margin: 16px 0;">
            <h4 style="color: #007AFF; margin-bottom: 12px;"> DIAGNÓSTICO DE PROGRESO</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <tr class="u-border-bottom">
                    <td class="u-p-8"><strong> Actividades:</strong></td>
                    <td class="u-p-8">${actividades.length} actividades</td>
                    <td class="u-p-8">Promedio: ${(progAct * 100).toFixed(0)}%</td>
                    <td class="u-p-8">Aporta: ${(progAct * 0.4 * 100).toFixed(0)}%</td>
                </tr>
                <tr class="u-border-bottom">
                    <td class="u-p-8"><strong> Entregables:</strong></td>
                    <td class="u-p-8">${entregables.length} entregables</td>
                    <td class="u-p-8">Promedio: ${(progEnt * 100).toFixed(0)}%</td>
                    <td class="u-p-8">Aporta: ${(progEnt * 0.3 * 100).toFixed(0)}%</td>
                </tr>
                <tr class="u-border-bottom">
                    <td class="u-p-8"><strong> Procesos PMBOK:</strong></td>
                    <td class="u-p-8">${procesos.filter(p => p.completado).length}/${procesos.length}</td>
                    <td class="u-p-8">${(progProc * 100).toFixed(0)}%</td>
                    <td class="u-p-8">Aporta: ${(progProc * 0.2 * 100).toFixed(0)}%</td>
                </tr>
                <tr>
                    <td class="u-p-8"><strong> Hitos:</strong></td>
                    <td class="u-p-8">${hitos.filter(h => h.progreso === 100).length}/${hitos.length}</td>
                    <td class="u-p-8">${(progHit * 100).toFixed(0)}%</td>
                    <td class="u-p-8">Aporta: ${(progHit * 0.1 * 100).toFixed(0)}%</td>
                </tr>
                <tr style="border-top: 2px solid #007AFF;">
                    <td style="padding: 12px;"><strong> TOTAL:</strong></td>
                    <td colspan="3" style="padding: 12px; font-size: 24px; font-weight: bold; color: ${progresoFinal * 100 >= 70 ? '#00A859' : (progresoFinal * 100 >= 40 ? '#FF8C00' : '#FF3B30')};">${(progresoFinal * 100).toFixed(1)}%</td>
                </tr>
            </table>
            <div style="margin-top: 16px; padding: 12px; background: rgba(0,122,255,0.2); border-radius: 8px;">
                <strong> ¿Qué significa?</strong><br>
                • ${actividades.length === 0 ? ' No tienes ACTIVIDADES en el Gantt. Créalas para que aporten 40%.' : ' Tienes actividades.'}<br>
                • ${entregables.length === 0 ? ' No tienes ENTREGABLES en el Gantt. Créalos para que aporten 30%.' : ' Tienes entregables.'}<br>
                • ${procesos.filter(p => p.completado).length === procesos.length ? ' Todos los procesos completados.' : ' Te faltan ' + (procesos.length - procesos.filter(p => p.completado).length) + ' procesos por completar.'}<br>
                • ${hitos.length === 0 ? ' No tienes HITOS en el Gantt. Créalos para que aporten 10%.' : ' Tienes hitos.'}
            </div>
        </div>
    `;
    
    // Mostrar en un modal
    const modalHtml = `<div class="modal-content modal-600">
        <div class="modal-header">
            <h3> Diagnóstico de Progreso</h3>
            <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
        </div>
        ${mensaje}
        <button class="btn btn-primary u-w-full" onclick="cerrarModalGeneric()">Cerrar</button>
    </div>`;
    
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}
        
        function actualizarKPIs(CPI, SPI, ROI, indiceDefectos, velocidadEquipo, satisfaccion, huellaCarbono, EAC) {
            const kpisBody = document.getElementById('kpisBody');
            if (!kpisBody) return;
            
            kpisBody.innerHTML = `
                <tr><th>CPI (Costos)</th><td>${CPI.toFixed(2)}</td><td class="${CPI >= 0.9 ? 'cashflow-positive' : (CPI >= 0.7 ? '' : 'cashflow-negative')}">${CPI >= 0.9 ? '' : (CPI >= 0.7 ? '' : '')}</td><td>≥0.9</td></tr>
                <tr><th>SPI (Cronograma)</th><td>${SPI.toFixed(2)}</td><td class="${SPI >= 0.9 ? 'cashflow-positive' : (SPI >= 0.7 ? '' : 'cashflow-negative')}">${SPI >= 0.9 ? '' : (SPI >= 0.7 ? '' : '')}</td><td>≥0.9</td></tr>
                <tr><th>ROI Proyectado</th><td>${ROI.toFixed(1)}%</td><td class="${ROI > 0 ? 'cashflow-positive' : 'cashflow-negative'}">${ROI > 0 ? '' : ''}</td><td>>0%</td></tr>
                <tr><th>EAC (Pronóstico)</th><td>${formatearMoneda(EAC)}</td><td>-</td><td>-</td></tr>
                <tr><th>Índice de Defectos</th><td>${indiceDefectos.toFixed(1)}</td><td class="${indiceDefectos <= 0.5 ? 'cashflow-positive' : (indiceDefectos <= 2 ? '' : 'cashflow-negative')}">${indiceDefectos <= 0.5 ? '' : (indiceDefectos <= 2 ? '' : '')}</td><td>≤0.5</td></tr>
                <tr><th>Velocidad del Equipo</th><td>${velocidadEquipo}</td><td class="${velocidadEquipo >= 20 ? 'cashflow-positive' : (velocidadEquipo >= 10 ? '' : '')}">${velocidadEquipo >= 20 ? '' : (velocidadEquipo >= 10 ? '' : '')}</td><td>≥20 pts/sprint</td></tr>
                <tr><th>Satisfacción Stakeholder</th><td>${satisfaccion.toFixed(1)}/5.0</td><td class="${satisfaccion >= 4.0 ? 'cashflow-positive' : (satisfaccion >= 3.0 ? '' : 'cashflow-negative')}">${satisfaccion >= 4.0 ? '' : (satisfaccion >= 3.0 ? '' : '')}</td><td>≥4.0</td></tr>
                <tr><th>Huella de Carbono</th><td>${huellaCarbono} kg/entregable</td><td class="${huellaCarbono <= 50 ? 'cashflow-positive' : (huellaCarbono <= 100 ? '' : 'cashflow-negative')}">${huellaCarbono <= 50 ? '' : (huellaCarbono <= 100 ? '' : '')}</td><td>≤50</td></tr>
            `;
        }
        
        function abrirModalSatisfaccion() {
            const select = document.getElementById('satisfaccionStakeholder');
            if (select && proyecto.stakeholders) {
                select.innerHTML = '<option value="todos">Todos los stakeholders (promedio)</option>' +
                    proyecto.stakeholders.map(s => `<option value="${s.id}">${escapeHtml(s.nombre)}</option>`).join('');
            }
            document.getElementById('modalSatisfaccion').style.display = 'flex';
        }
        
        function guardarSatisfaccion() {
            let puntaje = parseFloat(document.getElementById('satisfaccionPuntaje').value);
            let stakeholderId = document.getElementById('satisfaccionStakeholder').value;
            let comentarios = document.getElementById('satisfaccionComentarios').value;
            
            if (!proyecto.satisfacciones) proyecto.satisfacciones = [];
            proyecto.satisfacciones.push({
                id: Date.now(),
                stakeholderId: stakeholderId,
                puntaje: puntaje,
                comentarios: comentarios,
                fecha: new Date().toISOString()
            });
            
            // Calcular promedio
            let satisfaccionesFiltradas = proyecto.satisfacciones.filter(s => s.stakeholderId === 'todos' || s.stakeholderId === stakeholderId);
            let promedio = satisfaccionesFiltradas.reduce((sum, s) => sum + s.puntaje, 0) / (satisfaccionesFiltradas.length || 1);
            proyecto.satisfaccionPromedio = promedio;
            
            guardarProyecto();
            cerrarModalSatisfaccion();
            actualizarPanelSalud();
            mostrarToast(` Satisfacción registrada: ${puntaje}/5.0`, 'success');
        }
        
        // Función para registrar velocidad del equipo
        function registrarVelocidad() {
            let velocidad = prompt(tApp('prompt_velocidad'), "20");
            if (velocidad !== null) {
                proyecto.velocidadEquipo = parseInt(velocidad);
                guardarProyecto();
                actualizarPanelSalud();
                mostrarToast(` Velocidad registrada: ${proyecto.velocidadEquipo} pts/sprint`, 'success');
            }
        }
        
        // Función para registrar huella de carbono
        function registrarHuellaCarbono() {
            let huella = prompt(tApp('prompt_huella'), "0");
            if (huella !== null) {
                proyecto.huellaCarbono = parseFloat(huella);
                guardarProyecto();
                actualizarPanelSalud();
                mostrarToast(` Huella de carbono registrada: ${proyecto.huellaCarbono} kg CO₂`, 'success');
            }
        }
        
        
        
        function initPanelSalud() {
    // Cargar stakeholders en el select de satisfacción
    const select = document.getElementById('satisfaccionStakeholder');
    if (select && proyecto.stakeholders) {
        select.innerHTML = '<option value="todos">Todos los stakeholders (promedio)</option>' +
            proyecto.stakeholders.map(s => `<option value="${s.id}">${escapeHtml(s.nombre)}</option>`).join('');
    }
    actualizarPanelSalud();
}

function cerrarModalSatisfaccion() {
    document.getElementById('modalSatisfaccion').style.display = 'none';
}


function registrarDefecto() {
    let defectos = prompt(tApp('prompt_defectos'), "0");
    if (defectos !== null) {
        proyecto.defectos = (proyecto.defectos || 0) + parseInt(defectos);
        guardarProyecto();
        actualizarPanelSalud();
        mostrarToast(` Defectos registrados. Total: ${proyecto.defectos}`, 'success');
    }
}

        
        function abrirModalGarantia() {
            const g = proyecto.garantia || {};
            
            document.getElementById('garantiaEquipo').value = g.equipo || '';
            document.getElementById('garantiaDuracionAnios').value = g.duracionAnios || 1;
            document.getElementById('garantiaFechaInicio').value = g.fechaInicio || '';
            document.getElementById('garantiaCobertura').value = g.cobertura || '';
            document.getElementById('garantiaExclusiones').value = g.exclusiones || '';
            document.getElementById('garantiaAfectaHitoFinal').checked = g.afectaHitoFinal || false;
            
            // Cargar hitos en el select
            const hitoSelect = document.getElementById('garantiaHitoFinalId');
            if (hitoSelect) {
                hitoSelect.innerHTML = '<option value="">-- Seleccionar hito --</option>';
                (proyecto.hitosFinancieros || []).forEach(h => {
                    hitoSelect.innerHTML += `<option value="${h.id}" ${g.hitoFinalId === h.id ? 'selected' : ''}>${escapeHtml(h.nombre)} (Mes ${h.mes})</option>`;
                });
            }
            
            // Mostrar/ocultar select según checkbox
            document.getElementById('garantiaHitoFinalSelect').style.display = g.afectaHitoFinal ? 'block' : 'none';
            
            document.getElementById('modalGarantia').style.display = 'flex';
        }
        
        function guardarGarantia() {
            let equipo = document.getElementById('garantiaEquipo').value.trim();
            if (!equipo) {
                mostrarToast(" El equipo/producto en garantía es obligatorio", 'error');
                return;
            }
            
            let afectaHitoFinal = document.getElementById('garantiaAfectaHitoFinal').checked;
            let hitoFinalId = afectaHitoFinal ? parseInt(document.getElementById('garantiaHitoFinalId').value) : null;
            
            if (afectaHitoFinal && !hitoFinalId) {
                mostrarToast(" Debes seleccionar el hito final que se pagará al término de la garantía", 'error');
                return;
            }
            
            let garantia = {
                equipo: equipo,
                duracionAnios: parseInt(document.getElementById('garantiaDuracionAnios').value) || 1,
                fechaInicio: document.getElementById('garantiaFechaInicio').value,
                cobertura: document.getElementById('garantiaCobertura').value,
                exclusiones: document.getElementById('garantiaExclusiones').value,
                afectaHitoFinal: afectaHitoFinal,
                hitoFinalId: hitoFinalId
            };
            
            proyecto.garantia = garantia;
            guardarProyecto();
            
            // Si afecta al hito final, actualizar el Cashflow
            if (afectaHitoFinal && hitoFinalId) {
                actualizarHitoPorGarantia(hitoFinalId, garantia);
            }
            
            renderizarGarantia();
            calcularCashflow();
            cerrarModalGarantia();
            mostrarToast(` Garantía de "${equipo}" configurada correctamente`, 'success');
        }
        
        function actualizarHitoPorGarantia(hitoId, garantia) {
            // Calcular fecha de fin de garantía
            let fechaFinGarantia = null;
            if (garantia.fechaInicio && garantia.duracionAnios) {
                let fecha = new Date(garantia.fechaInicio);
                fecha.setFullYear(fecha.getFullYear() + garantia.duracionAnios);
                fechaFinGarantia = fecha;
            }
            
            // Buscar el hito
            const hito = (proyecto.hitosFinancieros || []).find(h => h.id === hitoId);
            if (hito && fechaFinGarantia) {
                // Guardar el mes original si no existe
                if (!hito.mesOriginal) {
                    hito.mesOriginal = hito.mes;
                }
                // El mes ahora es el mes de fin de garantía (aproximado)
                // Calculamos cuántos meses desde el inicio del proyecto
                if (proyecto.fechaInicio) {
                    const inicioProyecto = new Date(proyecto.fechaInicio);
                    const diffMeses = (fechaFinGarantia.getFullYear() - inicioProyecto.getFullYear()) * 12 + (fechaFinGarantia.getMonth() - inicioProyecto.getMonth());
                    hito.mes = Math.max(1, diffMeses + 1);
                }
                mostrarToast(` El hito "${hito.nombre}" se ha movido al mes ${hito.mes} (fin de garantía)`, 'warning');
            }
        }
        
        function eliminarGarantia() {
            if (confirm(tApp('confirmar_eliminar_garantia'))) {
                // Restaurar hitos a sus meses originales
                if (proyecto.garantia && proyecto.garantia.hitoFinalId) {
                    const hito = (proyecto.hitosFinancieros || []).find(h => h.id === proyecto.garantia.hitoFinalId);
                    if (hito && hito.mesOriginal) {
                        hito.mes = hito.mesOriginal;
                        delete hito.mesOriginal;
                        mostrarToast(` El hito "${hito.nombre}" ha vuelto a su mes original (${hito.mes})`, 'info');
                    }
                }
                proyecto.garantia = null;
                guardarProyecto();
                renderizarGarantia();
                calcularCashflow();
                mostrarToast(tApp('toast_eliminado'), 'success');
            }
        }
        
        function cerrarModalGarantia() {
            document.getElementById('modalGarantia').style.display = 'none';
        }
        
        function exportarGarantia() {
            if (!proyecto.garantia || !proyecto.garantia.equipo) {
                mostrarToast("No hay garantía configurada para exportar", 'warning');
                return;
            }
            
            const g = proyecto.garantia;
            let fechaFin = '';
            if (g.fechaInicio && g.duracionAnios) {
                let fecha = new Date(g.fechaInicio);
                fecha.setFullYear(fecha.getFullYear() + g.duracionAnios);
                fechaFin = fecha.toISOString().split('T')[0];
            }
            
            let csv = "Campo,Valor\n";
            csv += `Equipo,"${g.equipo}"\n`;
            csv += `Duración,${g.duracionAnios} años\n`;
            csv += `Fecha Inicio,${g.fechaInicio || '-'}\n`;
            csv += `Fecha Fin,${fechaFin || '-'}\n`;
            csv += `Cobertura,"${g.cobertura || '-'}"\n`;
            csv += `Exclusiones,"${g.exclusiones || '-'}"\n`;
            csv += `Afecta Hito Final,${g.afectaHitoFinal ? 'Sí' : 'No'}\n`;
            
            if (g.afectaHitoFinal && g.hitoFinalId) {
                const hito = (proyecto.hitosFinancieros || []).find(h => h.id === g.hitoFinalId);
                csv += `Hito Final,"${hito ? hito.nombre : 'No encontrado'}"\n`;
            }
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', `garantia_${proyecto.nombre}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            mostrarToast(" Garantía exportada a CSV", 'success');
        }
        
        // Agregar evento para mostrar/ocultar el select de hitos
        document.addEventListener('change', function(e) {
            if (e.target.id === 'garantiaAfectaHitoFinal') {
                const selectDiv = document.getElementById('garantiaHitoFinalSelect');
                if (selectDiv) {
                    selectDiv.style.display = e.target.checked ? 'block' : 'none';
                }
            }
        });    
                // ============================================
        // MÓDULO DE VIAJES
        // ============================================
        
        function renderizarViajes() {
            if (!proyecto.viajes) proyecto.viajes = [];
            
            let totalVuelos = 0, totalHoteles = 0, totalComidas = 0, totalTraslados = 0, totalGeneral = 0;
            
            proyecto.viajes.forEach(v => {
                let vuelosConv = convertirMoneda(v.costeVuelos || 0, v.moneda);
                let hotelConv = convertirMoneda(v.costeHotel || 0, v.moneda);
                let comidasConv = convertirMoneda(v.costeComidas || 0, v.moneda);
                let trasladosConv = convertirMoneda(v.costeTraslados || 0, v.moneda);
                
                totalVuelos += vuelosConv;
                totalHoteles += hotelConv;
                totalComidas += comidasConv;
                totalTraslados += trasladosConv;
                totalGeneral += vuelosConv + hotelConv + comidasConv + trasladosConv;
            });
            
            document.getElementById('totalVuelos').innerHTML = formatearMoneda(totalVuelos);
            document.getElementById('totalHoteles').innerHTML = formatearMoneda(totalHoteles);
            document.getElementById('totalComidas').innerHTML = formatearMoneda(totalComidas);
            document.getElementById('totalTraslados').innerHTML = formatearMoneda(totalTraslados);
            document.getElementById('totalViajes').innerHTML = formatearMoneda(totalGeneral);
            
            const container = document.getElementById('listaViajes');
            if (!container) return;
            
            if (proyecto.viajes.length === 0) {
                container.innerHTML = '<div class="info-card u-text-center">No hay viajes registrados. Haz clic en " Nuevo Viaje" para comenzar.</div>';
                return;
            }
            
            container.innerHTML = proyecto.viajes.map(v => {
                let documentos = [];
                if (v.docPasaporte) documentos.push(' Pasaporte');
                if (v.docVisa) documentos.push(' Visa');
                if (v.docVacunas) documentos.push(' Vacunas');
                if (v.docSeguro) documentos.push(' Seguro');
                if (v.docCarnet) documentos.push(' Carnet');
                if (v.docCartas) documentos.push(' Cartas invitación');
                if (v.docOtrosTexto) documentos.push(` ${v.docOtrosTexto}`);
                
                let totalViaje = convertirMoneda((v.costeVuelos || 0) + (v.costeHotel || 0) + (v.costeComidas || 0) + (v.costeTraslados || 0), v.moneda);
                
                return `
                    <div class="info-card u-mb-16">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <h4> ${escapeHtml(v.nombre)} ${v.rol ? `(${escapeHtml(v.rol)})` : ''}</h4>
                                <div class="details u-mt-8">
                                    <div> ${escapeHtml(v.origen || '-')} → ${escapeHtml(v.destino || '-')}</div>
                                    <div> ${v.fechaSalida ? formatearFechaEspa(v.fechaSalida) : '-'} → ${v.fechaRegreso ? formatearFechaEspa(v.fechaRegreso) : '-'}</div>
                                    <div> ${escapeHtml(v.motivo || '-')}</div>
                                </div>
                            </div>
                            <div>
                                <span class="edit-btn" onclick="editarViaje(${v.id})"></span>
                                <span class="delete-btn" onclick="eliminarViaje(${v.id})"></span>
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 12px 0;">
                            <div style="background: rgba(0,122,255,0.1); padding: 8px; border-radius: 8px; text-align: center;">
                                <div class="u-fs-11"> Vuelos</div>
                                <div class="u-bold">${formatearMoneda(convertirMoneda(v.costeVuelos || 0, v.moneda))}</div>
                            </div>
                            <div style="background: rgba(52,199,89,0.1); padding: 8px; border-radius: 8px; text-align: center;">
                                <div class="u-fs-11"> Hotel</div>
                                <div class="u-bold">${formatearMoneda(convertirMoneda(v.costeHotel || 0, v.moneda))}</div>
                            </div>
                            <div style="background: rgba(255,140,0,0.1); padding: 8px; border-radius: 8px; text-align: center;">
                                <div class="u-fs-11"> Comidas</div>
                                <div class="u-bold">${formatearMoneda(convertirMoneda(v.costeComidas || 0, v.moneda))}</div>
                            </div>
                            <div style="background: rgba(255,59,48,0.1); padding: 8px; border-radius: 8px; text-align: center;">
                                <div class="u-fs-11"> Traslados</div>
                                <div class="u-bold">${formatearMoneda(convertirMoneda(v.costeTraslados || 0, v.moneda))}</div>
                            </div>
                        </div>
                        
                        ${documentos.length > 0 ? `
                        <div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 8px; margin-top: 8px;">
                            <strong> Documentación:</strong><br>
                            ${documentos.map(d => `<span style="display: inline-block; background: rgba(0,122,255,0.2); padding: 2px 8px; border-radius: 12px; margin: 2px; font-size: 11px;">${d}</span>`).join('')}
                        </div>
                        ` : '<div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 8px; margin-top: 8px; font-size: 11px;"> Sin documentación registrada</div>'}
                        
                        <div class="u-mt-8 u-fs-11 u-color-muted">
                             Moneda: ${v.moneda} |  Mes: ${v.mes || 1} |  Total: ${formatearMoneda(totalViaje)}
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        function abrirModalViaje() {
            document.getElementById('modalViajeTitulo').innerHTML = ' Nuevo Viaje';
            document.getElementById('viajeId').value = '';
            document.getElementById('viajeNombre').value = '';
            document.getElementById('viajeRol').value = '';
            document.getElementById('viajeOrigen').value = '';
            document.getElementById('viajeDestino').value = '';
            document.getElementById('viajeFechaSalida').value = '';
            document.getElementById('viajeFechaRegreso').value = '';
            document.getElementById('viajeMotivo').value = '';
            document.getElementById('viajeCosteVuelos').value = '0';
            document.getElementById('viajeCosteHotel').value = '0';
            document.getElementById('viajeCosteComidas').value = '0';
            document.getElementById('viajeCosteTraslados').value = '0';
            document.getElementById('viajeMoneda').value = proyecto.monedaBase || 'EUR';
            document.getElementById('viajeMes').value = '1';
            
            document.getElementById('viajeDocPasaporte').checked = false;
            document.getElementById('viajeDocVisa').checked = false;
            document.getElementById('viajeDocVacunas').checked = false;
            document.getElementById('viajeDocSeguro').checked = false;
            document.getElementById('viajeDocCarnet').checked = false;
            document.getElementById('viajeDocCartas').checked = false;
            document.getElementById('viajeDocOtros').checked = false;
            document.getElementById('viajeDocOtrosTexto').value = '';
            
            document.getElementById('modalViaje').style.display = 'flex';
        }
        
        function editarViaje(id) {
            let v = proyecto.viajes.find(v => v.id === id);
            if (!v) return;
            
            document.getElementById('modalViajeTitulo').innerHTML = ' Editar Viaje';
            document.getElementById('viajeId').value = v.id;
            document.getElementById('viajeNombre').value = v.nombre || '';
            document.getElementById('viajeRol').value = v.rol || '';
            document.getElementById('viajeOrigen').value = v.origen || '';
            document.getElementById('viajeDestino').value = v.destino || '';
            document.getElementById('viajeFechaSalida').value = v.fechaSalida || '';
            document.getElementById('viajeFechaRegreso').value = v.fechaRegreso || '';
            document.getElementById('viajeMotivo').value = v.motivo || '';
            document.getElementById('viajeCosteVuelos').value = v.costeVuelos || 0;
            document.getElementById('viajeCosteHotel').value = v.costeHotel || 0;
            document.getElementById('viajeCosteComidas').value = v.costeComidas || 0;
            document.getElementById('viajeCosteTraslados').value = v.costeTraslados || 0;
            document.getElementById('viajeMoneda').value = v.moneda || proyecto.monedaBase;
            document.getElementById('viajeMes').value = v.mes || 1;
            
            document.getElementById('viajeDocPasaporte').checked = v.docPasaporte || false;
            document.getElementById('viajeDocVisa').checked = v.docVisa || false;
            document.getElementById('viajeDocVacunas').checked = v.docVacunas || false;
            document.getElementById('viajeDocSeguro').checked = v.docSeguro || false;
            document.getElementById('viajeDocCarnet').checked = v.docCarnet || false;
            document.getElementById('viajeDocCartas').checked = v.docCartas || false;
            document.getElementById('viajeDocOtros').checked = v.docOtros || false;
            document.getElementById('viajeDocOtrosTexto').value = v.docOtrosTexto || '';
            
            document.getElementById('modalViaje').style.display = 'flex';
        }
        
        function guardarViaje() {
            let nombre = document.getElementById('viajeNombre').value.trim();
            if (!nombre) { mostrarToast(" El nombre del viajero es obligatorio", 'error'); return; }
            
            let id = document.getElementById('viajeId').value;
            
            let viaje = {
                id: id ? parseInt(id) : Date.now(),
                nombre: nombre,
                rol: document.getElementById('viajeRol').value,
                origen: document.getElementById('viajeOrigen').value,
                destino: document.getElementById('viajeDestino').value,
                fechaSalida: document.getElementById('viajeFechaSalida').value,
                fechaRegreso: document.getElementById('viajeFechaRegreso').value,
                motivo: document.getElementById('viajeMotivo').value,
                costeVuelos: parseFloat(document.getElementById('viajeCosteVuelos').value) || 0,
                costeHotel: parseFloat(document.getElementById('viajeCosteHotel').value) || 0,
                costeComidas: parseFloat(document.getElementById('viajeCosteComidas').value) || 0,
                costeTraslados: parseFloat(document.getElementById('viajeCosteTraslados').value) || 0,
                moneda: document.getElementById('viajeMoneda').value,
                mes: parseInt(document.getElementById('viajeMes').value) || 1,
                docPasaporte: document.getElementById('viajeDocPasaporte').checked,
                docVisa: document.getElementById('viajeDocVisa').checked,
                docVacunas: document.getElementById('viajeDocVacunas').checked,
                docSeguro: document.getElementById('viajeDocSeguro').checked,
                docCarnet: document.getElementById('viajeDocCarnet').checked,
                docCartas: document.getElementById('viajeDocCartas').checked,
                docOtros: document.getElementById('viajeDocOtros').checked,
                docOtrosTexto: document.getElementById('viajeDocOtrosTexto').value
            };
            
            if (!proyecto.viajes) proyecto.viajes = [];
            
            if (id) {
                let idx = proyecto.viajes.findIndex(v => v.id === parseInt(id));
                if (idx >= 0) proyecto.viajes[idx] = viaje;
            } else {
                proyecto.viajes.push(viaje);
            }
            
            guardarProyecto();
            renderizarViajes();
            calcularCashflow();
            cerrarModalViaje();
            mostrarToast(` Viaje de ${nombre} guardado correctamente`, 'success');
        }
        
        function eliminarViaje(id) {
            if (confirm(tApp('confirmar_eliminar_viaje'))) {
                proyecto.viajes = proyecto.viajes.filter(v => v.id !== id);
                guardarProyecto();
                renderizarViajes();
                calcularCashflow();
                mostrarToast(tApp('toast_eliminado'), 'success');
            }
        }
        
        function cerrarModalViaje() {
            document.getElementById('modalViaje').style.display = 'none';
        }
        
        function exportarViajes() {
            if (!proyecto.viajes || proyecto.viajes.length === 0) {
                mostrarToast("No hay viajes para exportar", 'warning');
                return;
            }
            
            let csv = "Nombre,Rol,Origen,Destino,Fecha Salida,Fecha Regreso,Motivo,Vuelos,Hotel,Comidas,Traslados,Moneda,Mes,Documentación\n";
            proyecto.viajes.forEach(v => {
                let docs = [];
                if (v.docPasaporte) docs.push("Pasaporte");
                if (v.docVisa) docs.push("Visa");
                if (v.docVacunas) docs.push("Vacunas");
                if (v.docSeguro) docs.push("Seguro");
                if (v.docCarnet) docs.push("Carnet");
                if (v.docCartas) docs.push("Cartas invitación");
                if (v.docOtrosTexto) docs.push(v.docOtrosTexto);
                
                csv += `"${v.nombre}","${v.rol || ''}","${v.origen || ''}","${v.destino || ''}","${v.fechaSalida || ''}","${v.fechaRegreso || ''}","${v.motivo || ''}",${v.costeVuelos || 0},${v.costeHotel || 0},${v.costeComidas || 0},${v.costeTraslados || 0},"${v.moneda}",${v.mes || 1},"${docs.join(', ')}"\n`;
            });
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', `viajes_${proyecto.nombre}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            mostrarToast(" Viajes exportados a CSV", 'success');
        }   


        
        // ============================================
        // MÓDULO DE AVALES (GARANTÍAS)
        // ============================================
        
        function renderizarAvales() {
    const container = document.getElementById('avalesContent');
    if (!container) return;
    
    if (!proyecto.avales || proyecto.avales.length === 0) {
        container.innerHTML = `
            <div class="info-card u-text-center">
                <p> No hay avales registrados</p>
                <button class="btn btn-primary btn-small" onclick="abrirModalAval()"> Añadir Aval</button>
            </div>
        `;
        return;
    }
    
    let totalCostesAvales = 0;
    proyecto.avales.forEach(a => {
        totalCostesAvales += a.costesCalculados?.total || 0;
    });
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div class="info-card" style="display: inline-block; padding: 8px 16px;">
                <strong> Costes totales de avales:</strong> ${formatearMoneda(totalCostesAvales)}
            </div>
            <button class="btn btn-primary btn-small" onclick="abrirModalAval()"> Nuevo Aval</button>
        </div>
        <div class="cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));">
            ${proyecto.avales.map(a => {
                const costes = a.costesCalculados || {};
                return `
                    <div class="info-card" style="border-left-color: ${a.estado === 'Vigente' ? '#00A859' : (a.estado === 'Próximo a vencer' ? '#FF8C00' : '#FF3B30')}">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <h4> ${escapeHtml(a.tipo)}</h4>
                            <div>
                                <span class="edit-btn" onclick="editarAval(${a.id})"></span>
                                <span class="delete-btn" onclick="eliminarAval(${a.id})"></span>
                            </div>
                        </div>
                        <div class="name">${escapeHtml(a.entidad || 'Entidad no especificada')}</div>
                        <div class="details u-mt-8">
                            <div> Importe: ${formatearMoneda(convertirMoneda(a.importe, a.moneda))}</div>
                            <div> Emisión: ${a.fechaEmision || '-'} |  Vence: ${a.fechaVencimiento || '-'}</div>
                            <div> Estado: <span class="${a.estado === 'Vigente' ? 'badge-completado' : (a.estado === 'Próximo a vencer' ? 'badge-progreso' : 'badge-pendiente')}">${a.estado || 'Pendiente'}</span></div>
                            <div> Nº Referencia: ${escapeHtml(a.referencia || '-')}</div>
                        </div>
                        <div style="margin-top: 12px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 8px;">
                            <strong> Costes del aval:</strong><br>
                            • Apertura: ${formatearMoneda(costes.apertura || 0)}<br>
                            • Riesgo (total): ${formatearMoneda(costes.riesgoTotal || 0)}<br>
                            • Notaría: ${formatearMoneda(costes.notaria || 0)}<br>
                            • Otros: ${formatearMoneda(costes.otros || 0)}<br>
                            <strong>TOTAL: ${formatearMoneda(costes.total || 0)}</strong>
                        </div>
                        ${a.notas ? `<div style="margin-top: 8px; font-size: 11px;"> ${escapeHtml(a.notas)}</div>` : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}
// ============================================
// FUNCIÓN RENDERIZAR GARANTÍA
// ============================================

function renderizarGarantia() {
    const container = document.getElementById('garantiaContent');
    if (!container) return;
    
    const g = proyecto.garantia;
    
    // Actualizar tarjetas de resumen
    const estadoSpan = document.getElementById('garantiaEstado');
    const duracionSpan = document.getElementById('garantiaDuracion');
    const inicioSpan = document.getElementById('garantiaInicio');
    const finSpan = document.getElementById('garantiaFin');
    
    if (!g || !g.equipo) {
        if (container) container.innerHTML = '<p class="u-text-center u-color-muted">No hay garantía configurada. Haz clic en "Configurar Garantía" para comenzar.</p>';
        if (estadoSpan) estadoSpan.innerHTML = 'No configurada';
        if (duracionSpan) duracionSpan.innerHTML = '0 años';
        if (inicioSpan) inicioSpan.innerHTML = '-';
        if (finSpan) finSpan.innerHTML = '-';
        return;
    }
    
    // Calcular fecha de fin
    let fechaFin = '';
    if (g.fechaInicio && g.duracionAnios) {
        let fecha = new Date(g.fechaInicio);
        fecha.setFullYear(fecha.getFullYear() + g.duracionAnios);
        fechaFin = fecha.toISOString().split('T')[0];
    }
    
    // Mostrar contenido detallado
    if (container) {
        container.innerHTML = `
            <div class="info-card">
                <h4> ${escapeHtml(g.equipo)}</h4>
                <div class="details u-mt-8">
                    <div> Duración: ${g.duracionAnios} años</div>
                    <div> Inicio: ${g.fechaInicio || '-'}</div>
                    <div> Fin: ${fechaFin || '-'}</div>
                    <div> Cobertura: ${escapeHtml(g.cobertura || '-')}</div>
                    <div> Exclusiones: ${escapeHtml(g.exclusiones || '-')}</div>
                    <div> Afecta hito final: ${g.afectaHitoFinal ? 'Sí' : 'No'}</div>
                </div>
                <button class="btn btn-danger btn-small u-mt-12" onclick="eliminarGarantia()"> Eliminar Garantía</button>
            </div>
        `;
    }
    
    // Actualizar tarjetas superiores
    if (estadoSpan) estadoSpan.innerHTML = g.afectaHitoFinal ? ' Configurada (con hito)' : ' Configurada';
    if (duracionSpan) duracionSpan.innerHTML = `${g.duracionAnios} años`;
    if (inicioSpan) inicioSpan.innerHTML = g.fechaInicio || '-';
    if (finSpan) finSpan.innerHTML = fechaFin || '-';
    
    // Información del hito afectado
    const hitoInfoDiv = document.getElementById('garantiaHitoInfo');
    if (hitoInfoDiv && g.afectaHitoFinal && g.hitoFinalId) {
        const hito = (proyecto.hitosFinancieros || []).find(h => h.id === g.hitoFinalId);
        if (hito) {
            hitoInfoDiv.innerHTML = `
                <p class="u-p-sm">
                     El hito <strong>"${escapeHtml(hito.nombre)}"</strong> se pagará al final del período de garantía (mes ${hito.mes}).
                    ${hito.mesOriginal ? '<br> Originalmente estaba programado para el mes ' + hito.mesOriginal + '.' : ''}
                </p>
            `;
        } else {
            hitoInfoDiv.innerHTML = '<p class="u-p-sm"> El hito seleccionado ya no existe. Reconfigura la garantía.</p>';
        }
    } else if (hitoInfoDiv) {
        hitoInfoDiv.innerHTML = '<p class="u-p-sm">La garantía no afecta a ningún hito de pago.</p>';
    }
}

// ============================================
// FUNCIÓN ELIMINAR GARANTÍA (si no existe)
// ============================================

function eliminarGarantia() {
    if (confirm(tApp('confirmar_eliminar_garantia'))) {
        // Restaurar hitos a sus meses originales
        if (proyecto.garantia && proyecto.garantia.hitoFinalId) {
            const hito = (proyecto.hitosFinancieros || []).find(h => h.id === proyecto.garantia.hitoFinalId);
            if (hito && hito.mesOriginal) {
                hito.mes = hito.mesOriginal;
                delete hito.mesOriginal;
                mostrarToast(` El hito "${hito.nombre}" ha vuelto a su mes original (${hito.mes})`, 'info');
            }
        }
        proyecto.garantia = null;
        guardarProyecto();
        renderizarGarantia();
        calcularCashflow();
        mostrarToast(tApp('toast_eliminado'), 'success');
    }
}
        
        function abrirModalAval() {
    const hoy = new Date().toISOString().split('T')[0];
    const modalHtml = `
        <div class="modal-content modal-600">
            <div class="modal-header">
                <h3> Nuevo Aval / Garantía</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="avalId">
            
            <div class="form-group">
                <label>Tipo de aval *</label>
                <select id="avalTipo">
                    <option value="Aval bancario">Aval bancario</option>
                    <option value="Carta de crédito standby">Carta de crédito standby</option>
                    <option value="Garantía de cumplimiento">Garantía de cumplimiento</option>
                    <option value="Garantía de anticipo">Garantía de anticipo</option>
                    <option value="Garantía de retención">Garantía de retención</option>
                    <option value="Seguro de crédito">Seguro de crédito</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Entidad emisora</label>
                <input type="text" id="avalEntidad" placeholder="Ej: Banco Santander">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Importe avalado</label>
                    <input type="number" id="avalImporte" value="100000">
                </div>
                <div class="form-group">
                    <label>Moneda</label>
                    <select id="avalMoneda">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}">${m} - ${MONEDAS[m]}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Fecha de emisión</label>
                    <input type="date" id="avalFechaEmision" value="${hoy}">
                </div>
                <div class="form-group">
                    <label> Fecha de vencimiento</label>
                    <input type="date" id="avalFechaVencimiento">
                </div>
            </div>
            
            <div class="form-group">
                <label>Nº de referencia / póliza</label>
                <input type="text" id="avalReferencia" placeholder="Ej: AV-2024-001">
            </div>
            
            <div class="form-group">
                <label>Estado</label>
                <select id="avalEstado">
                    <option value="Vigente"> Vigente</option>
                    <option value="Próximo a vencer"> Próximo a vencer</option>
                    <option value="Vencido"> Vencido</option>
                    <option value="Cancelado"> Cancelado</option>
                </select>
            </div>
            
            <!-- ========== NUEVA SECCIÓN: COSTES DEL AVAL ========== -->
            <hr class="u-hr">
            <h4 class="u-fs-13"> COSTES Y COMISIONES DEL AVAL</h4>
            <p style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 12px;">Estos costes se reflejarán automáticamente en el cashflow del proyecto.</p>
            
            <!-- Comisión de Apertura -->
            <div class="form-row">
                <div class="form-group">
                    <label> Comisión de apertura/estudio (%)</label>
                    <input type="number" id="avalComisionAperturaPct" value="0.75" step="0.1" placeholder="%">
                    <small class="u-fs-10">Ej: 0.75% = 0.75</small>
                </div>
                <div class="form-group">
                    <label> O fijo (€)</label>
                    <input type="number" id="avalComisionAperturaFija" value="0" placeholder="Importe fijo">
                </div>
            </div>
            
            <!-- Comisión de Riesgo / Trimestral -->
            <div class="form-row">
                <div class="form-group">
                    <label> Comisión de riesgo trimestral (%)</label>
                    <input type="number" id="avalComisionRiesgoPct" value="0.5" step="0.1" placeholder="% por trimestre">
                    <small class="u-fs-10">Se aplica cada 3 meses sobre el importe</small>
                </div>
                <div class="form-group">
                    <label> O fijo por trimestre (€)</label>
                    <input type="number" id="avalComisionRiesgoFija" value="0" placeholder="Importe fijo/trimestre">
                </div>
            </div>
            
            <!-- Gastos de Notaría -->
            <div class="form-row">
                <div class="form-group">
                    <label> Gastos de Notaría (%)</label>
                    <input type="number" id="avalGastosNotariaPct" value="0.3" step="0.1" placeholder="% del importe">
                </div>
                <div class="form-group">
                    <label> O fijo (€)</label>
                    <input type="number" id="avalGastosNotariaFijos" value="0" placeholder="Importe fijo">
                </div>
            </div>
            
            <!-- Otros gastos -->
            <div class="form-group">
                <label> Otros gastos (gestoría, correo, etc.)</label>
                <input type="number" id="avalOtrosGastos" value="0" placeholder="Importe en €">
            </div>
            
            <div class="info-card-modal u-mt-12 u-p-10">
                <small> <strong>Ejemplo para 100.000€:</strong><br>
                • Apertura 0.75% = 750€ (pago único)<br>
                • Riesgo trimestral 0.5% = 500€/trimestre<br>
                • Notaría 0.3% = 300€ (pago único)<br>
                Estos costes se añadirán automáticamente a los gastos del proyecto.</small>
            </div>
            
            <div class="form-group u-mt-16">
                <label>Notas / condiciones adicionales</label>
                <textarea rows="2" id="avalNotas" placeholder="Condiciones particulares del aval..."></textarea>
            </div>
            
            <div class="u-flex-gap-12 u-mt-20">
                <button class="btn btn-secondary u-flex-1" onclick="cerrarModalGeneric()">Cancelar</button>
                <button class="btn btn-primary u-flex-1" onclick="guardarAval()">Guardar Aval</button>
            </div>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}
        
function guardarAval() {
    let id = document.getElementById('avalId').value;
    let tipo = document.getElementById('avalTipo').value;
    if (!tipo) { mostrarToast(" El tipo de aval es obligatorio", 'error'); return; }
    
    let importe = parseFloat(document.getElementById('avalImporte').value);
    let fechaEmision = document.getElementById('avalFechaEmision').value;
    let fechaVencimiento = document.getElementById('avalFechaVencimiento').value;
    
    // ============================================
    // CALCULAR MESES DE VIGENCIA (AUTOMÁTICAMENTE)
    // ============================================
    let mesesVigencia = 12; // valor por defecto
    if (fechaEmision && fechaVencimiento) {
        try {
            const inicio = new Date(fechaEmision);
            const fin = new Date(fechaVencimiento);
            if (!isNaN(inicio) && !isNaN(fin)) {
                mesesVigencia = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24 * 30.44));
                mesesVigencia = Math.max(1, mesesVigencia);
            }
        } catch(e) {
            console.warn("Error calculando vigencia:", e);
        }
    }
    
    // Obtener valores de comisiones
    let comisionAperturaPct = parseFloat(document.getElementById('avalComisionAperturaPct').value) || 0;
    let comisionAperturaFija = parseFloat(document.getElementById('avalComisionAperturaFija').value) || 0;
    let comisionRiesgoPct = parseFloat(document.getElementById('avalComisionRiesgoPct').value) || 0;
    let comisionRiesgoFija = parseFloat(document.getElementById('avalComisionRiesgoFija').value) || 0;
    let gastosNotariaPct = parseFloat(document.getElementById('avalGastosNotariaPct').value) || 0;
    let gastosNotariaFijos = parseFloat(document.getElementById('avalGastosNotariaFijos').value) || 0;
    let otrosGastos = parseFloat(document.getElementById('avalOtrosGastos').value) || 0;
    
    // Convertir importe a moneda base para cálculos consistentes
    const importeEnBase = convertirMoneda(importe, document.getElementById('avalMoneda').value);
    
    // Calcular comisión de apertura
    let apertura = comisionAperturaFija;
    if (comisionAperturaPct > 0) {
        apertura += importeEnBase * (comisionAperturaPct / 100);
    }
    
    // Calcular gastos de notaría
    let notaria = gastosNotariaFijos;
    if (gastosNotariaPct > 0) {
        notaria += importeEnBase * (gastosNotariaPct / 100);
    }
    
    // Calcular comisión de riesgo TOTAL (suma de todos los pagos trimestrales)
    let riesgoTotal = 0;
    const trimestres = Math.ceil(mesesVigencia / 3);
    if (comisionRiesgoFija > 0) {
        riesgoTotal = comisionRiesgoFija * trimestres;
    } else if (comisionRiesgoPct > 0) {
        riesgoTotal = (importeEnBase * (comisionRiesgoPct / 100)) * trimestres;
    }
    
    let aval = {
        id: id ? parseInt(id) : Date.now(),
        tipo: tipo,
        entidad: document.getElementById('avalEntidad').value,
        importe: importe,
        moneda: document.getElementById('avalMoneda').value,
        fechaEmision: fechaEmision,
        fechaVencimiento: fechaVencimiento,
        referencia: document.getElementById('avalReferencia').value,
        estado: document.getElementById('avalEstado').value,
        notas: document.getElementById('avalNotas').value,
        // Comisiones (guardamos los valores originales)
        comisionAperturaPct: comisionAperturaPct,
        comisionAperturaFija: comisionAperturaFija,
        comisionRiesgoPct: comisionRiesgoPct,
        comisionRiesgoFija: comisionRiesgoFija,
        gastosNotariaPct: gastosNotariaPct,
        gastosNotariaFijos: gastosNotariaFijos,
        otrosGastos: otrosGastos,
        mesesVigencia: mesesVigencia,
        // Costes calculados (para mostrar en la UI y usar en cashflow)
        costesCalculados: {
            apertura: apertura,
            riesgoTotal: riesgoTotal,
            notaria: notaria,
            otros: otrosGastos,
            total: apertura + riesgoTotal + notaria + otrosGastos
        }
    };
    
    if (!proyecto.avales) proyecto.avales = [];
    
    if (id) {
        let idx = proyecto.avales.findIndex(a => a.id === parseInt(id));
        if (idx >= 0) proyecto.avales[idx] = aval;
    } else {
        proyecto.avales.push(aval);
    }
    
    guardarProyecto();
    renderizarAvales();
    calcularCashflow(); // Recalcular cashflow para incluir los costes
    cerrarModalGeneric();
    mostrarToast(` ${aval.tipo} guardado. Costes totales: ${formatearMoneda(aval.costesCalculados.total)}`, 'success');
}
        
        function editarAval(id) {
    let a = proyecto.avales.find(a => a.id === id);
    if (!a) return;
    
    const modalHtml = `
        <div class="modal-content modal-600">
            <div class="modal-header">
                <h3> Editar Aval: ${escapeHtml(a.tipo)}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="avalId" value="${a.id}">
            
            <div class="form-group">
                <label>Tipo de aval</label>
                <select id="avalTipo">
                    <option value="Aval bancario" ${a.tipo === 'Aval bancario' ? 'selected' : ''}>Aval bancario</option>
                    <option value="Carta de crédito standby" ${a.tipo === 'Carta de crédito standby' ? 'selected' : ''}>Carta de crédito standby</option>
                    <option value="Garantía de cumplimiento" ${a.tipo === 'Garantía de cumplimiento' ? 'selected' : ''}>Garantía de cumplimiento</option>
                    <option value="Garantía de anticipo" ${a.tipo === 'Garantía de anticipo' ? 'selected' : ''}>Garantía de anticipo</option>
                    <option value="Garantía de retención" ${a.tipo === 'Garantía de retención' ? 'selected' : ''}>Garantía de retención</option>
                    <option value="Seguro de crédito" ${a.tipo === 'Seguro de crédito' ? 'selected' : ''}>Seguro de crédito</option>
                    <option value="Otro" ${a.tipo === 'Otro' ? 'selected' : ''}>Otro</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Entidad emisora</label>
                <input type="text" id="avalEntidad" value="${escapeHtml(a.entidad || '')}">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Importe avalado</label>
                    <input type="number" id="avalImporte" value="${a.importe}">
                </div>
                <div class="form-group">
                    <label>Moneda</label>
                    <select id="avalMoneda">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${a.moneda === m ? 'selected' : ''}>${m} - ${MONEDAS[m]}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Fecha emisión</label>
                    <input type="date" id="avalFechaEmision" value="${a.fechaEmision || ''}">
                </div>
                <div class="form-group">
                    <label> Fecha vencimiento</label>
                    <input type="date" id="avalFechaVencimiento" value="${a.fechaVencimiento || ''}">
                </div>
            </div>
            
            <div class="form-group">
                <label>Nº de referencia</label>
                <input type="text" id="avalReferencia" value="${escapeHtml(a.referencia || '')}">
            </div>
            
            <div class="form-group">
                <label>Estado</label>
                <select id="avalEstado">
                    <option value="Vigente" ${a.estado === 'Vigente' ? 'selected' : ''}> Vigente</option>
                    <option value="Próximo a vencer" ${a.estado === 'Próximo a vencer' ? 'selected' : ''}> Próximo a vencer</option>
                    <option value="Vencido" ${a.estado === 'Vencido' ? 'selected' : ''}> Vencido</option>
                    <option value="Cancelado" ${a.estado === 'Cancelado' ? 'selected' : ''}> Cancelado</option>
                </select>
            </div>
            
            <hr class="u-hr">
            <h4 class="u-fs-13"> COSTES Y COMISIONES DEL AVAL</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Comisión apertura (%)</label>
                    <input type="number" id="avalComisionAperturaPct" value="${a.comisionAperturaPct || 0.75}" step="0.1">
                </div>
                <div class="form-group">
                    <label>O fijo (€)</label>
                    <input type="number" id="avalComisionAperturaFija" value="${a.comisionAperturaFija || 0}">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Comisión riesgo trimestral (%)</label>
                    <input type="number" id="avalComisionRiesgoPct" value="${a.comisionRiesgoPct || 0.5}" step="0.1">
                </div>
                <div class="form-group">
                    <label>O fijo/trimestre (€)</label>
                    <input type="number" id="avalComisionRiesgoFija" value="${a.comisionRiesgoFija || 0}">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Gastos notaría (%)</label>
                    <input type="number" id="avalGastosNotariaPct" value="${a.gastosNotariaPct || 0.3}" step="0.1">
                </div>
                <div class="form-group">
                    <label>O fijos (€)</label>
                    <input type="number" id="avalGastosNotariaFijos" value="${a.gastosNotariaFijos || 0}">
                </div>
            </div>
            
            <div class="form-group">
                <label>Otros gastos (€)</label>
                <input type="number" id="avalOtrosGastos" value="${a.otrosGastos || 0}">
            </div>
            
            <div class="form-group">
                <label>Notas</label>
                <textarea rows="2" id="avalNotas">${escapeHtml(a.notas || '')}</textarea>
            </div>
            
            <div class="info-card-modal" style="margin-top: 12px; background: rgba(0,122,255,0.15);">
                <small> <strong>Costes actuales del aval:</strong><br>
                • Apertura: ${formatearMoneda(a.costesCalculados?.apertura || 0)}<br>
                • Riesgo (total): ${formatearMoneda(a.costesCalculados?.riesgoTotal || 0)}<br>
                • Notaría: ${formatearMoneda(a.costesCalculados?.notaria || 0)}<br>
                • Otros: ${formatearMoneda(a.costesCalculados?.otros || 0)}<br>
                <strong>TOTAL: ${formatearMoneda(a.costesCalculados?.total || 0)}</strong>
                </small>
            </div>
            
            <div class="u-flex-gap-12 u-mt-20">
                <button class="btn btn-secondary u-flex-1" onclick="cerrarModalGeneric()">Cancelar</button>
                <button class="btn btn-primary u-flex-1" onclick="guardarAval()">Actualizar Aval</button>
            </div>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}
        
        function eliminarAval(id) {
            if (confirm(tApp('confirmar_eliminar_aval'))) {
                proyecto.avales = proyecto.avales.filter(a => a.id !== id);
                guardarProyecto();
                renderizarAvales();
                mostrarToast(tApp('toast_eliminado'), 'success');
            }
        }
        
        // ============================================
        // SISTEMA DE IA PREDICTIVA
        // ============================================
        
        let OPENAI_API_KEY = localStorage.getItem('openai_api_key') || '';
        let USAR_IA_REAL = false;
        

        
        function configurarAPIKeyIA() {
    const key = prompt(tApp('prompt_api_key'), OPENAI_API_KEY);
    if (key !== null) {
        OPENAI_API_KEY = key;
        localStorage.setItem('openai_api_key', key);
        USAR_IA_REAL = key.length > 0;
        
        if (USAR_IA_REAL) {
            mostrarToast(" Modo IA real activado. ¡Gracias por configurar tu API Key!", 'success');
        } else {
            mostrarToast(" Usando análisis predictivo local. Para IA real, configura tu API Key.", 'info');
            //  Añadir opción para obtener clave
            if (confirm(tApp('confirmar_api_key'))) {
                window.open("https://platform.openai.com/api-keys", "_blank");
            }
        }
    }
}
        
        
        async function analizarPrediccionIA(tipo) {
            const modal = document.getElementById('modalIA');
            const loading = document.getElementById('iaLoading');
            const resultado = document.getElementById('iaResultado');
            
            modal.style.display = 'flex';
            loading.style.display = 'block';
            resultado.innerHTML = '';
            
            setTimeout(async () => {
                try {
                    let analisis = '';
                    
                    const costeTotal = parseFloat(document.getElementById('totalCoste')?.innerText.replace(/[^0-9.,-]/g, '').replace(',', '.')) || 0;
                    const ingresoTotal = parseFloat(document.getElementById('totalIngreso')?.innerText.replace(/[^0-9.,-]/g, '').replace(',', '.')) || 0;
                    const beneficio = ingresoTotal - costeTotal;
                    const roi = costeTotal > 0 ? ((beneficio / costeTotal) * 100).toFixed(1) : 0;
                    const riesgosCriticos = parseInt(document.getElementById('totalRiesgosCriticos')?.innerText || '0');
                    const riesgosAltos = parseInt(document.getElementById('totalRiesgosAltos')?.innerText || '0');
                    const equipoSize = proyecto?.equipo?.length || 0;
                    const materialesCount = proyecto?.materiales?.length || 0;
                    const stakeholdersCount = proyecto?.stakeholders?.length || 0;
                    
                    let probSobrecosto = 30;
                    let probRetraso = 25;
                    let salud = 75;
                    
                    if (beneficio < costeTotal * 0.1) probSobrecosto += 20;
                    if (equipoSize < 3) probRetraso += 15;
                    if (stakeholdersCount < 3) salud -= 10;
                    if (riesgosCriticos > 0) { salud -= riesgosCriticos * 10; probSobrecosto += riesgosCriticos * 5; }
                    if (materialesCount === 0) salud -= 10;
                    
                    probSobrecosto = Math.min(95, Math.max(5, probSobrecosto));
                    probRetraso = Math.min(95, Math.max(5, probRetraso));
                    salud = Math.min(100, Math.max(0, salud));
                    
                    if (tipo === 'riesgos') {
                        analisis = `<div class="ia-analisis-card"><strong> Predicción de Riesgos</strong><hr>
                        <div><span class="ia-tag ia-tag-riesgo"> Riesgo detectado</span> <strong>Desviación presupuestaria</strong><br> Probabilidad: ${probSobrecosto}% | Impacto: Alto<br> Mitigación: Revisar estructura de costos</div>
                        <div class="u-mt-12"><span class="ia-tag ia-tag-riesgo"> Riesgo detectado</span> <strong>Retraso en entregas</strong><br> Probabilidad: ${probRetraso}% | Impacto: Medio<br> Mitigación: Priorizar recursos críticos</div>
                        <div class="u-mt-12"><strong> Riesgos actuales:</strong> ${riesgosCriticos} críticos, ${riesgosAltos} altos</div>
                        <div><strong> Score riesgo global:</strong> ${Math.min(100, (riesgosCriticos * 25) + (riesgosAltos * 10))}/100</div></div>`;
                    } 
                    else if (tipo === 'costos') {
                        analisis = `<div class="ia-analisis-card ia-prediccion-${probSobrecosto > 60 ? 'alta' : (probSobrecosto > 30 ? 'media' : 'baja')}">
                        <strong> Predicción de Costos</strong><hr>
                        <div class="u-fs-24 u-bold">${probSobrecosto}%</div>
                        <div>Probabilidad de sobrecosto</div>
                        <div class="u-mt-12"> Posible desviación: ${Math.round(probSobrecosto / 5)}%</div>
                        <div class="u-mt-12"><strong> Partidas con riesgo:</strong><br>• Materiales y suministros<br>• Costos de personal</div>
                        <div class="u-mt-12"><strong> Métricas actuales:</strong><br> Coste: ${formatearMoneda(costeTotal)}<br> Ingreso: ${formatearMoneda(ingresoTotal)}<br> Beneficio: ${formatearMoneda(beneficio)} (${roi}% ROI)</div></div>`;
                    }
                    else if (tipo === 'plazo') {
                        analisis = `<div class="ia-analisis-card ia-prediccion-${probRetraso > 60 ? 'alta' : (probRetraso > 30 ? 'media' : 'baja')}">
                        <strong> Predicción de Plazo</strong><hr>
                        <div class="u-fs-24 u-bold">${probRetraso}%</div>
                        <div>Probabilidad de retraso</div>
                        <div class="u-mt-12"> Retraso estimado: ${Math.ceil(probRetraso / 20)} mes(es)</div>
                        <div class="u-mt-12"><strong> Actividades críticas:</strong><br>• Planificación inicial<br>• Aprobaciones de stakeholders</div>
                        <div><strong> Estrategias:</strong><br>• Revisar ruta crítica semanalmente<br>• Asignar recursos adicionales</div></div>`;
                    }
                    else if (tipo === 'calidad') {
                        let nivelCalidad = salud >= 70 ? 'Alto' : (salud >= 40 ? 'Medio' : 'Bajo');
                        analisis = `<div class="ia-analisis-card ia-prediccion-${salud < 40 ? 'alta' : (salud < 70 ? 'media' : 'baja')}">
                        <strong> Calidad Esperada</strong><hr>
                        <div class="u-fs-24 u-bold">${nivelCalidad}</div>
                        <div>Puntaje de calidad: ${salud}/100</div>
                        <div class="u-mt-12"><strong> Factores de riesgo:</strong><br>• ${materialesCount === 0 ? 'Sin registros de materiales' : 'Materiales registrados: ' + materialesCount}<br>• ${stakeholdersCount < 3 ? 'Pocos stakeholders identificados' : stakeholdersCount + ' stakeholders registrados'}</div>
                        <div><strong> Recomendaciones:</strong><br>• Implementar checklist de entregables<br>• Realizar pruebas piloto</div></div>`;
                    }
                    else if (tipo === 'recomendaciones') {
                        analisis = `<div class="ia-analisis-card"><strong> Recomendaciones Prioritarias</strong><hr>
                        <div><strong> Acciones inmediatas:</strong><br>1. ${riesgosCriticos > 0 ? 'Mitigar riesgos críticos prioritariamente' : 'Mantener control semanal de riesgos'}<br>2. ${probSobrecosto > 50 ? 'Revisar estructura de costos y proveedores' : 'Optimizar procesos actuales'}<br>3. ${stakeholdersCount < 3 ? 'Identificar y gestionar stakeholders clave' : 'Fortalecer comunicación con stakeholders'}</div>
                        <div class="u-mt-12"><strong> Mejoras para segunda fase:</strong><br>• Implementar dashboard de KPIs<br>• Revisiones quincenales con el equipo</div>
                        <div class="u-mt-12"><strong> KPIs a monitorear:</strong><br>• SPI (Schedule): ${Math.max(0, 100 - probRetraso)}%<br>• CPI (Cost): ${Math.max(0, 100 - probSobrecosto)}%</div></div>`;
                    }
                    else {
                        let nivelSalud = salud >= 70 ? 'Buena' : (salud >= 40 ? 'Moderada' : 'Crítica');
                        let colorSalud = salud >= 70 ? '#00A859' : (salud >= 40 ? '#FF8C00' : '#FF3B30');
                        analisis = `<div class="ia-analisis-card"><strong> DIAGNÓSTICO GENERAL</strong><hr>
                        <div style="font-size: 48px; font-weight: bold; text-align: center; color: ${colorSalud};">${salud}%</div>
                        <div class="u-text-center">Salud del Proyecto - ${nivelSalud}</div>
                        </div>
                        <div class="ia-analisis-card"><strong> RIESGOS</strong><hr>
                        <div> Críticos: ${riesgosCriticos} |  Altos: ${riesgosAltos}</div>
                        <div> Probabilidad de sobrecosto: ${probSobrecosto}%</div>
                        <div> Probabilidad de retraso: ${probRetraso}%</div>
                        </div>
                        <div class="ia-analisis-card"><strong> FINANZAS</strong><hr>
                        <div> Coste Total: ${formatearMoneda(costeTotal)}</div>
                        <div> Ingreso Total: ${formatearMoneda(ingresoTotal)}</div>
                        <div> Beneficio: ${formatearMoneda(beneficio)} (${roi}% ROI)</div>
                        </div>
                        <div class="ia-analisis-card"><strong> RECOMENDACIONES</strong><hr>
                        <ol><li><strong>Prioridad 1:</strong> ${riesgosCriticos > 0 ? 'Mitigar riesgos críticos' : 'Mantener control de riesgos'}</li>
                        <li><strong>Prioridad 2:</strong> ${probSobrecosto > 50 ? 'Revisar estructura de costos' : 'Optimizar procesos'}</li>
                        <li><strong>Prioridad 3:</strong> ${stakeholdersCount < 3 ? 'Gestionar stakeholders' : 'Fortalecer comunicaciones'}</li></ol>
                        </div>`;
                    }
                    
                    loading.style.display = 'none';
                    resultado.innerHTML = analisis;
                } catch(e) {
                    loading.style.display = 'none';
                    resultado.innerHTML = `<div class="ia-analisis-card" style="border-left-color:#FF3B30;"> Error en el análisis: ${e.message}</div>`;
                }
            }, 1000);
        }
        
        function cerrarModalIA() { document.getElementById('modalIA').style.display = 'none'; }
        
        function copiarResultadoIA() {
            const texto = document.getElementById('iaResultado').innerText;
            navigator.clipboard.writeText(texto).then(() => mostrarToast(" Copiado al portapapeles", 'success'));
        }
        
        function exportarIAPDF() {
            const contenido = document.getElementById('iaResultado').innerHTML;
            const ventana = window.open('', '_blank');
            ventana.document.write(`
                <html><head><title>Análisis IA - ${escapeHtml(proyecto?.nombre || 'Proyecto')}</title>
                <style>body{font-family:Arial;padding:40px;} .ia-analisis-card{border:1px solid #ddd;padding:16px;margin-bottom:16px;border-radius:8px;}</style>
                </head><body>
                <h1> Análisis Predictivo IA</h1>
                <h3>Proyecto: ${escapeHtml(proyecto?.nombre || 'Proyecto')}</h3>
                <p>Fecha: ${new Date().toLocaleString()}</p>
                ${contenido}
                <hr><p class="u-fs-11">Generado por PMI Mind</p>
                </body></html>
            `);
            ventana.document.close();
            ventana.print();
        }
        
        function agregarBotonIA() {
            const btn = document.createElement('div');
            btn.className = 'boton-ia-flotante';
            btn.innerHTML = '';
            btn.onclick = () => configurarAPIKeyIA();
            document.body.appendChild(btn);
        }
        
    
        
        // ============================================
// ============================================

function inicializarBeneficios() {
    if (!proyecto.beneficios) {
        proyecto.beneficios = {
            proyectado: 0,
            real: 0,
            fechaEstimada: null,
            indicadores: [],
            historial: [],
            hitos: []
        };
    }
    renderizarBeneficios();
}

function renderizarBeneficios() {
    const b = proyecto.beneficios || { proyectado: 0, real: 0, indicadores: [], hitos: [] };
    
    document.getElementById('beneficioProyectadoValor').innerHTML = formatearMoneda(b.proyectado || 0);
    document.getElementById('beneficioRealValor').innerHTML = formatearMoneda(b.real || 0);
    
    let desviacion = 0;
    let estado = '';
    let estadoColor = '';
    
    if (b.proyectado > 0) {
        desviacion = ((b.real || 0) - b.proyectado) / b.proyectado * 100;
        if (desviacion >= 0) {
            estado = ' Superando meta';
            estadoColor = '#00A859';
        } else if (desviacion >= -10) {
            estado = ' Cerca de meta';
            estadoColor = '#FF8C00';
        } else {
            estado = ' Por debajo de meta';
            estadoColor = '#FF3B30';
        }
    }
    
    document.getElementById('beneficioDesviacion').innerHTML = (desviacion >= 0 ? '+' : '') + desviacion.toFixed(1) + '%';
    document.getElementById('beneficioEstado').innerHTML = estado;
    document.getElementById('beneficioEstado').style.color = estadoColor;
    
    // Renderizar hitos de beneficio
    const hitosContainer = document.getElementById('hitosBeneficioList');
    if (hitosContainer) {
        if (!b.hitos || b.hitos.length === 0) {
            hitosContainer.innerHTML = '<p class="u-color-muted">No hay hitos de beneficio registrados</p>';
        } else {
            hitosContainer.innerHTML = b.hitos.map(h => `
                <div class="item-card">
                    <div>
                        <strong>${escapeHtml(h.nombre)}</strong><br>
                         ${h.fecha || '-'} |  Meta: ${formatearMoneda(h.meta)} |  Real: ${formatearMoneda(h.real || 0)}
                    </div>
                    <div>
                        <span class="edit-btn" onclick="editarHitoBeneficio(${h.id})"></span>
                        <span class="delete-btn" onclick="eliminarHitoBeneficio(${h.id})"></span>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Renderizar indicadores
    const indicadoresBody = document.getElementById('indicadoresBeneficioBody');
    if (indicadoresBody) {
        const indicadores = [
            { nombre: "ROI", meta: "> 15%", real: calcularROI() + "%", cumplimiento: calcularROI() >= 15 ? "" : "" },
            { nombre: "VAN", meta: "> 0", real: formatearMoneda(calcularVAN()), cumplimiento: calcularVAN() > 0 ? "" : "" },
            { nombre: "Payback", meta: "< 2 años", real: calcularPayback() + " meses", cumplimiento: calcularPayback() <= 24 ? "" : "" }
        ];
        
        indicadoresBody.innerHTML = indicadores.map(i => `
            <tr><td>${i.nombre}</td><td>${i.meta}</td><td>${i.real}</td><td>${i.cumplimiento}</td></tr>
        `).join('');
    }
    
    // Dibujar gráfico
    dibujarGraficoBeneficios();
}

function calcularROI() {
    let costeTotal = 0;
    (proyecto.equipo || []).forEach(e => costeTotal += e.costeHora * e.horasMes * 12);
    (proyecto.materiales || []).forEach(m => costeTotal += m.cantidad * m.costeUnitario);
    let beneficio = (proyecto.precioVenta || 0) - costeTotal;
    return costeTotal > 0 ? (beneficio / costeTotal * 100).toFixed(1) : 0;
}

function calcularVAN() {
    let flujos = [];
    let tasaDescuento = 0.1;
    (proyecto.hitosFinancieros || []).forEach(h => {
        flujos.push({ mes: h.mes || 1, valor: h.importeFijo || ((proyecto.precioVenta || 0) * (h.porcentaje || 0) / 100) });
    });
    
    let van = 0;
    flujos.forEach(f => {
        van += f.valor / Math.pow(1 + tasaDescuento, f.mes / 12);
    });
    return van;
}

function calcularPayback() {
    let acumulado = 0;
    let meses = 0;
    let ingresosMensuales = (proyecto.precioVenta || 0) / 12;
    let costeTotal = 0;
    (proyecto.equipo || []).forEach(e => costeTotal += e.costeHora * e.horasMes * 12);
    (proyecto.materiales || []).forEach(m => costeTotal += m.cantidad * m.costeUnitario);
    
    while (acumulado < costeTotal && meses < 60) {
        meses++;
        acumulado += ingresosMensuales;
    }
    return meses;
}

function dibujarGraficoBeneficios() {
    const ctx = document.getElementById('beneficiosChart')?.getContext('2d');
    if (!ctx) return;
    
    // Destruir gráfico existente si hay
    if (window.beneficiosChartInstance) window.beneficiosChartInstance.destroy();
    
    const historial = proyecto.beneficios?.historial || [];
    const labels = historial.map(h => h.fecha);
    const datos = historial.map(h => h.valor);
    
    window.beneficiosChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.length ? labels : ['Inicio', 'Actual', 'Proyectado'],
            datasets: [
                {
                    label: 'Beneficio Real',
                    data: datos.length ? datos : [0, proyecto.beneficios?.real || 0, 0],
                    borderColor: '#00A859',
                    backgroundColor: 'rgba(0,168,89,0.1)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Beneficio Proyectado',
                    data: [0, proyecto.beneficios?.proyectado || 0, proyecto.beneficios?.proyectado || 0],
                    borderColor: '#007AFF',
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.dataset.label}: ${formatearMoneda(context.raw)}`
                    }
                }
            }
        }
    });
}

function registrarBeneficioReal() {
    const valor = prompt(tApp('prompt_beneficio_real'), proyecto.beneficios?.real || 0);
    if (valor !== null && !isNaN(parseFloat(valor))) {
        if (!proyecto.beneficios) proyecto.beneficios = {};
        proyecto.beneficios.real = parseFloat(valor);
        
        if (!proyecto.beneficios.historial) proyecto.beneficios.historial = [];
        proyecto.beneficios.historial.push({
            fecha: new Date().toISOString().split('T')[0],
            valor: parseFloat(valor)
        });
        
        guardarProyecto();
        renderizarBeneficios();
        mostrarToast(` Beneficio real registrado: ${formatearMoneda(parseFloat(valor))}`, 'success');
    }
}

function agregarHitoBeneficio() {
    const modalHtml = `
        <div class="modal-content modal-500">
            <div class="modal-header">
                <h3> Nuevo Hito de Beneficio</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div class="form-group">
                <label>Nombre del hito</label>
                <input type="text" id="hitoBeneficioNombre" placeholder="Ej: Alcanzar ROI > 15%">
            </div>
            <div class="form-group">
                <label> Fecha objetivo</label>
                <input type="date" id="hitoBeneficioFecha">
            </div>
            <div class="form-group">
                <label> Meta (€)</label>
                <input type="number" id="hitoBeneficioMeta" placeholder="0">
            </div>
            <div class="form-group">
                <label> Real (€) - opcional</label>
                <input type="number" id="hitoBeneficioReal" placeholder="0">
            </div>
            <button class="btn btn-primary" onclick="guardarHitoBeneficio()">Guardar</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function guardarHitoBeneficio() {
    let nombre = document.getElementById('hitoBeneficioNombre').value.trim();
    if (!nombre) { mostrarToast(tApp('toast_nombre_obligatorio'), 'error'); return; }
    
    const nuevoHito = {
        id: Date.now(),
        nombre: nombre,
        fecha: document.getElementById('hitoBeneficioFecha').value,
        meta: parseFloat(document.getElementById('hitoBeneficioMeta').value) || 0,
        real: parseFloat(document.getElementById('hitoBeneficioReal').value) || 0
    };
    
    if (!proyecto.beneficios) proyecto.beneficios = {};
    if (!proyecto.beneficios.hitos) proyecto.beneficios.hitos = [];
    proyecto.beneficios.hitos.push(nuevoHito);
    
    guardarProyecto();
    renderizarBeneficios();
    cerrarModalGeneric();
    mostrarToast(` Hito "${nombre}" agregado`, 'success');
}

function editarHitoBeneficio(id) {
    const hito = proyecto.beneficios?.hitos?.find(h => h.id === id);
    if (!hito) return;
    
    const modalHtml = `
        <div class="modal-content modal-500">
            <div class="modal-header">
                <h3> Editar Hito de Beneficio</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="editHitoId" value="${id}">
            <div class="form-group">
                <label>Nombre</label>
                <input type="text" id="editHitoNombre" value="${escapeHtml(hito.nombre)}">
            </div>
            <div class="form-group">
                <label>Fecha objetivo</label>
                <input type="date" id="editHitoFecha" value="${hito.fecha || ''}">
            </div>
            <div class="form-group">
                <label>Meta (€)</label>
                <input type="number" id="editHitoMeta" value="${hito.meta || 0}">
            </div>
            <div class="form-group">
                <label>Real (€)</label>
                <input type="number" id="editHitoReal" value="${hito.real || 0}">
            </div>
            <button class="btn btn-primary" onclick="actualizarHitoBeneficio()">Actualizar</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function actualizarHitoBeneficio() {
    const id = parseInt(document.getElementById('editHitoId').value);
    const idx = proyecto.beneficios.hitos.findIndex(h => h.id === id);
    if (idx >= 0) {
        proyecto.beneficios.hitos[idx] = {
            id: id,
            nombre: document.getElementById('editHitoNombre').value,
            fecha: document.getElementById('editHitoFecha').value,
            meta: parseFloat(document.getElementById('editHitoMeta').value) || 0,
            real: parseFloat(document.getElementById('editHitoReal').value) || 0
        };
        guardarProyecto();
        renderizarBeneficios();
        cerrarModalGeneric();
        mostrarToast(tApp('toast_hito_actualizado'), 'success');
    }
}

function eliminarHitoBeneficio(id) {
    if (confirm(tApp('confirmar_eliminar_hito'))) {
        proyecto.beneficios.hitos = proyecto.beneficios.hitos.filter(h => h.id !== id);
        guardarProyecto();
        renderizarBeneficios();
        mostrarToast(tApp('toast_hito_eliminado'), 'success');
    }
}

function exportarBeneficios() {
    const b = proyecto.beneficios || {};
    let csv = "Indicador,Valor\n";
    csv += `Beneficio Proyectado,${b.proyectado || 0}\n`;
    csv += `Beneficio Real,${b.real || 0}\n`;
    csv += `Desviación,${b.proyectado > 0 ? (((b.real || 0) - b.proyectado) / b.proyectado * 100).toFixed(1) : 0}%\n`;
    csv += `ROI,${calcularROI()}%\n`;
    csv += `VAN,${calcularVAN()}\n`;
    csv += `Payback,${calcularPayback()} meses\n`;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `beneficios_${proyecto.nombre}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Beneficios exportados", 'success');
}  

// ============================================
// GESTIÓN DE CAMBIOS
// ============================================

function inicializarCambios() {
    if (!proyecto.cambios) proyecto.cambios = [];
    renderizarCambios();
}

function renderizarCambios() {
    const cambios = proyecto.cambios || [];
    
    document.getElementById('cambiosPendientes').innerHTML = cambios.filter(c => c.estado === 'Pendiente').length;
    document.getElementById('cambiosAprobados').innerHTML = cambios.filter(c => c.estado === 'Aprobado').length;
    document.getElementById('cambiosRechazados').innerHTML = cambios.filter(c => c.estado === 'Rechazado').length;
    document.getElementById('cambiosImplementados').innerHTML = cambios.filter(c => c.estado === 'Implementado').length;
    
    const tbody = document.getElementById('cambiosBody');
    if (cambios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="u-text-center">No hay solicitudes de cambio</td></tr>';
        return;
    }
    
    tbody.innerHTML = cambios.map(c => `
        <tr>
            <td>#${c.id}</td>
            <td>${c.fecha || '-'}</td>
            <td>${escapeHtml(c.solicitante || '-')}</td>
            <td>${escapeHtml(c.descripcion || '-').substring(0, 50)}</td>
            <td>${c.impacto || '-'}</td>
            <td><span class="badge-${c.prioridad === 'Alta' ? 'progreso' : (c.prioridad === 'Media' ? 'pais' : 'completado')}">${c.prioridad || 'Media'}</span></td>
            <td><span class="badge-${c.estado === 'Aprobado' ? 'completado' : (c.estado === 'Pendiente' ? 'progreso' : 'pendiente')}">${c.estado || 'Pendiente'}</span></td>
            <td>${escapeHtml(c.aprobadoPor || '-')}</td>
            <td>
                <span class="edit-btn" onclick="editarCambio(${c.id})"></span>
                <span class="delete-btn" onclick="eliminarCambio(${c.id})"></span>
            </td>
        </tr>
    `).join('');
}

function abrirModalNuevoCambio() {
    const hoy = new Date().toISOString().split('T')[0];
    const modalHtml = `
        <div class="modal-content modal-600">
            <div class="modal-header">
                <h3> Nueva Solicitud de Cambio</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div class="form-group">
                <label> Descripción del cambio *</label>
                <textarea rows="2" id="cambioDescripcion" placeholder="Describa el cambio solicitado..."></textarea>
            </div>
            <div class="form-group">
                <label> Solicitante</label>
                <input type="text" id="cambioSolicitante" placeholder="Nombre del solicitante">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Impacto en Costo</label>
                    <input type="text" id="cambioImpactoCosto" placeholder="Ej: +5.000€">
                </div>
                <div class="form-group">
                    <label> Impacto en Plazo</label>
                    <input type="text" id="cambioImpactoPlazo" placeholder="Ej: +10 días">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Prioridad</label>
                    <select id="cambioPrioridad">
                        <option value="Baja">Baja</option>
                        <option value="Media" selected>Media</option>
                        <option value="Alta">Alta</option>
                        <option value="Crítica">Crítica</option>
                    </select>
                </div>
                <div class="form-group">
                    <label> Fecha solicitud</label>
                    <input type="date" id="cambioFecha" value="${hoy}">
                </div>
            </div>
            <div class="form-group">
                <label> Justificación del cambio</label>
                <textarea rows="2" id="cambioJustificacion" placeholder="¿Por qué es necesario este cambio?"></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Estado inicial</label>
                    <select id="cambioEstado">
                        <option value="Pendiente">Pendiente de revisión</option>
                        <option value="En análisis">En análisis</option>
                        <option value="Aprobado">Aprobado</option>
                        <option value="Rechazado">Rechazado</option>
                        <option value="Implementado">Implementado</option>
                    </select>
                </div>
                <div class="form-group">
                    <label> Aprobado por</label>
                    <input type="text" id="cambioAprobadoPor" placeholder="Nombre del aprobador">
                </div>
            </div>
            <button class="btn btn-primary" onclick="guardarCambio()">Guardar Solicitud</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function guardarCambio() {
    let descripcion = document.getElementById('cambioDescripcion').value.trim();
    if (!descripcion) { mostrarToast(tApp('toast_descripcion_obligatoria'), 'error'); return; }
    
    const nuevoCambio = {
        id: Date.now(),
        fecha: document.getElementById('cambioFecha').value,
        solicitante: document.getElementById('cambioSolicitante').value,
        descripcion: descripcion,
        impacto: ` ${document.getElementById('cambioImpactoCosto').value || '0'} |  ${document.getElementById('cambioImpactoPlazo').value || '0'}`,
        prioridad: document.getElementById('cambioPrioridad').value,
        estado: document.getElementById('cambioEstado').value,
        justificacion: document.getElementById('cambioJustificacion').value,
        aprobadoPor: document.getElementById('cambioAprobadoPor').value,
        fechaRegistro: new Date().toISOString()
    };
    
    if (!proyecto.cambios) proyecto.cambios = [];
    proyecto.cambios.push(nuevoCambio);
    
    guardarProyecto();
    renderizarCambios();
    cerrarModalGeneric();
    mostrarToast(` Solicitud de cambio #${nuevoCambio.id} registrada`, 'success');
}

function editarCambio(id) {
    const cambio = proyecto.cambios?.find(c => c.id === id);
    if (!cambio) return;
    
    const modalHtml = `
        <div class="modal-content modal-600">
            <div class="modal-header">
                <h3> Editar Solicitud #${id}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="editCambioId" value="${id}">
            <div class="form-group">
                <label>Descripción</label>
                <textarea rows="2" id="editCambioDescripcion">${escapeHtml(cambio.descripcion)}</textarea>
            </div>
            <div class="form-group">
                <label>Solicitante</label>
                <input type="text" id="editCambioSolicitante" value="${escapeHtml(cambio.solicitante || '')}">
            </div>
            <div class="form-row">
                <div class="form-group"><label>Prioridad</label>
                    <select id="editCambioPrioridad">
                        <option value="Baja" ${cambio.prioridad === 'Baja' ? 'selected' : ''}>Baja</option>
                        <option value="Media" ${cambio.prioridad === 'Media' ? 'selected' : ''}>Media</option>
                        <option value="Alta" ${cambio.prioridad === 'Alta' ? 'selected' : ''}>Alta</option>
                        <option value="Crítica" ${cambio.prioridad === 'Crítica' ? 'selected' : ''}>Crítica</option>
                    </select>
                </div>
                <div class="form-group"><label>Estado</label>
                    <select id="editCambioEstado">
                        <option value="Pendiente" ${cambio.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="En análisis" ${cambio.estado === 'En análisis' ? 'selected' : ''}>En análisis</option>
                        <option value="Aprobado" ${cambio.estado === 'Aprobado' ? 'selected' : ''}>Aprobado</option>
                        <option value="Rechazado" ${cambio.estado === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
                        <option value="Implementado" ${cambio.estado === 'Implementado' ? 'selected' : ''}>Implementado</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Aprobado por</label>
                <input type="text" id="editCambioAprobadoPor" value="${escapeHtml(cambio.aprobadoPor || '')}">
            </div>
            <button class="btn btn-primary" onclick="actualizarCambio()">Actualizar</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function actualizarCambio() {
    const id = parseInt(document.getElementById('editCambioId').value);
    const idx = proyecto.cambios.findIndex(c => c.id === id);
    if (idx >= 0) {
        proyecto.cambios[idx] = {
            ...proyecto.cambios[idx],
            descripcion: document.getElementById('editCambioDescripcion').value,
            solicitante: document.getElementById('editCambioSolicitante').value,
            prioridad: document.getElementById('editCambioPrioridad').value,
            estado: document.getElementById('editCambioEstado').value,
            aprobadoPor: document.getElementById('editCambioAprobadoPor').value
        };
        guardarProyecto();
        renderizarCambios();
        cerrarModalGeneric();
        mostrarToast(tApp('toast_solicitud_actualizada'), 'success');
    }
}

function eliminarCambio(id) {
    if (confirm(tApp('confirmar_eliminar_cambio'))) {
        proyecto.cambios = proyecto.cambios.filter(c => c.id !== id);
        guardarProyecto();
        renderizarCambios();
        mostrarToast(tApp('toast_solicitud_eliminada'), 'success');
    }
}
// ============================================
// LECCIONES APRENDIDAS
// ============================================

function inicializarLecciones() {
    if (!proyecto.lecciones) proyecto.lecciones = [];
    renderizarLecciones();
}

function renderizarLecciones() {
    const lecciones = proyecto.lecciones || [];
    
    document.getElementById('totalExitos').innerHTML = lecciones.filter(l => l.categoria === 'exito').length;
    document.getElementById('totalMejoras').innerHTML = lecciones.filter(l => l.categoria === 'mejora').length;
    document.getElementById('totalRecomendaciones').innerHTML = lecciones.filter(l => l.categoria === 'recomendacion').length;
    
    const container = document.getElementById('listaLecciones');
    if (lecciones.length === 0) {
        container.innerHTML = '<div class="info-card u-text-center">No hay lecciones registradas. ¡Comienza a documentar tu aprendizaje!</div>';
        return;
    }
    
    const colores = {
        exito: 'border-left-color: #00A859;',
        mejora: 'border-left-color: #FF8C00;',
        recomendacion: 'border-left-color: #007AFF;'
    };
    
    const iconos = {
        exito: '',
        mejora: '',
        recomendacion: ''
    };
    
    container.innerHTML = lecciones.map(l => `
        <div class="info-card" style="${colores[l.categoria] || colores.recomendacion}">
            <div class="u-flex-jc-sb">
                <h4>${iconos[l.categoria]} ${escapeHtml(l.titulo)}</h4>
                <div>
                    <span class="edit-btn" onclick="editarLeccion(${l.id})"></span>
                    <span class="delete-btn" onclick="eliminarLeccion(${l.id})"></span>
                </div>
            </div>
            <div class="details u-mt-12">
                <div><strong> Descripción:</strong><br>${escapeHtml(l.descripcion)}</div>
                <div class="u-mt-8"><strong> Acción recomendada:</strong><br>${escapeHtml(l.accion)}</div>
                <div class="u-mt-8 u-fs-11 u-color-muted">
                     ${l.fecha ? formatearFechaEspa(l.fecha) : '-'}
                </div>
            </div>
        </div>
    `).join('');
}

function abrirModalNuevaLeccion() {
    const modalHtml = `
        <div class="modal-content modal-sm">
            <div class="modal-header">
                <h3> Nueva Lección Aprendida</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div class="form-group">
                <label>Categoría</label>
                <select id="leccionCategoria">
                    <option value="exito"> Éxito (lo que salió bien)</option>
                    <option value="mejora"> Área de mejora (lo que salió mal)</option>
                    <option value="recomendacion"> Recomendación para futuros proyectos</option>
                </select>
            </div>
            <div class="form-group">
                <label>Título *</label>
                <input type="text" id="leccionTitulo" placeholder="Ej: Importancia de la planificación temprana">
            </div>
            <div class="form-group">
                <label>Descripción detallada</label>
                <textarea rows="3" id="leccionDescripcion" placeholder="¿Qué ocurrió? ¿Cuál fue el contexto?"></textarea>
            </div>
            <div class="form-group">
                <label>Acción recomendada / Solución aplicada</label>
                <textarea rows="2" id="leccionAccion" placeholder="¿Qué se hizo o qué se recomienda hacer?"></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Autor</label>
                    <input type="text" id="leccionAutor" value="PMO">
                </div>
                <div class="form-group">
                    <label> Fecha</label>
                    <input type="date" id="leccionFecha" value="${new Date().toISOString().split('T')[0]}">
                </div>
            </div>
            <button class="btn btn-primary" onclick="guardarLeccion()">Guardar Lección</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function guardarLeccion() {
    let titulo = document.getElementById('leccionTitulo').value.trim();
    if (!titulo) { mostrarToast(tApp('toast_titulo_obligatorio_gen'), 'error'); return; }
    
    const nuevaLeccion = {
        id: Date.now(),
        categoria: document.getElementById('leccionCategoria').value,
        titulo: titulo,
        descripcion: document.getElementById('leccionDescripcion').value,
        accion: document.getElementById('leccionAccion').value,
        autor: document.getElementById('leccionAutor').value,
        fecha: document.getElementById('leccionFecha').value,
        fechaRegistro: new Date().toISOString()
    };
    
    if (!proyecto.lecciones) proyecto.lecciones = [];
    proyecto.lecciones.push(nuevaLeccion);
    
    guardarProyecto();
    renderizarLecciones();
    cerrarModalGeneric();
    mostrarToast(` Lección "${titulo}" registrada`, 'success');
}

function editarLeccion(id) {
    const leccion = proyecto.lecciones?.find(l => l.id === id);
    if (!leccion) return;
    
    const modalHtml = `
        <div class="modal-content modal-sm">
            <div class="modal-header">
                <h3> Editar Lección</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="editLeccionId" value="${id}">
            <div class="form-group">
                <label>Categoría</label>
                <select id="editLeccionCategoria">
                    <option value="exito" ${leccion.categoria === 'exito' ? 'selected' : ''}> Éxito</option>
                    <option value="mejora" ${leccion.categoria === 'mejora' ? 'selected' : ''}> Área de mejora</option>
                    <option value="recomendacion" ${leccion.categoria === 'recomendacion' ? 'selected' : ''}> Recomendación</option>
                </select>
            </div>
            <div class="form-group">
                <label>Título</label>
                <input type="text" id="editLeccionTitulo" value="${escapeHtml(leccion.titulo)}">
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <textarea rows="3" id="editLeccionDescripcion">${escapeHtml(leccion.descripcion)}</textarea>
            </div>
            <div class="form-group">
                <label>Acción</label>
                <textarea rows="2" id="editLeccionAccion">${escapeHtml(leccion.accion)}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Autor</label>
                    <input type="text" id="editLeccionAutor" value="${escapeHtml(leccion.autor)}">
                </div>
                <div class="form-group">
                    <label>Fecha</label>
                    <input type="date" id="editLeccionFecha" value="${leccion.fecha || ''}">
                </div>
            </div>
            <button class="btn btn-primary" onclick="actualizarLeccion()">Actualizar</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function actualizarLeccion() {
    const id = parseInt(document.getElementById('editLeccionId').value);
    const idx = proyecto.lecciones.findIndex(l => l.id === id);
    if (idx >= 0) {
        proyecto.lecciones[idx] = {
            ...proyecto.lecciones[idx],
            categoria: document.getElementById('editLeccionCategoria').value,
            titulo: document.getElementById('editLeccionTitulo').value,
            descripcion: document.getElementById('editLeccionDescripcion').value,
            accion: document.getElementById('editLeccionAccion').value,
            autor: document.getElementById('editLeccionAutor').value,
            fecha: document.getElementById('editLeccionFecha').value
        };
        guardarProyecto();
        renderizarLecciones();
        cerrarModalGeneric();
        mostrarToast(tApp('toast_leccion_actualizada'), 'success');
    }
}

function eliminarLeccion(id) {
    if (confirm(tApp('confirmar_eliminar_leccion'))) {
        proyecto.lecciones = proyecto.lecciones.filter(l => l.id !== id);
        guardarProyecto();
        renderizarLecciones();
        mostrarToast(tApp('toast_leccion_eliminada'), 'success');
    }
}
// ============================================
// GESTIÓN DE CONFIGURACIÓN (Versionado)
// ============================================

function generarOpcionesVersion(actual) {
    const opciones = ['1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '2.0', '2.1', '2.2', '3.0'];
    return opciones.map(v => `<option value="${v}" ${v === actual ? 'selected' : ''}>v${v}</option>`).join('');
}

function actualizarVersionEntregable(id, nuevaVersion) {
    const elemento = proyecto.elementosGantt?.find(e => e.id === id);
    if (elemento && elemento.tipo === 'entregable') {
        const versionAnterior = elemento.version || '1.0';
        elemento.version = nuevaVersion;
        
        // Registrar en el historial de versiones
        if (!elemento.historialVersiones) elemento.historialVersiones = [];
        elemento.historialVersiones.push({
            version: nuevaVersion,
            fecha: new Date().toISOString(),
                    usuario: 'PM'
        });
        
        guardarProyecto();
        mostrarToast(` Entregable "${elemento.nombre}" actualizado a versión ${nuevaVersion}`, 'success');
        
        // Si hay cambio mayor, sugerir registrar lección
        if (versionAnterior.split('.')[0] !== nuevaVersion.split('.')[0]) {
            mostrarToast(" Cambio mayor de versión. Considera registrar una lección aprendida.", 'info');
        }
    }
}

function verHistorialVersiones(id) {
    const elemento = proyecto.elementosGantt?.find(e => e.id === id);
    if (!elemento || !elemento.historialVersiones) {
        mostrarToast("No hay historial de versiones", 'info');
        return;
    }
    
    const modalHtml = `
        <div class="modal-content modal-500">
            <div class="modal-header">
                <h3> Historial de Versiones - ${escapeHtml(elemento.nombre)}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <table class="data-table">
                <thead><tr><th>Versión</th><th>Fecha</th><th>Usuario</th></tr></thead>
                <tbody>
                    ${elemento.historialVersiones.map(h => `
                        <tr><td>v${h.version}</td><td>${h.fecha.split('T')[0]}</td><td>${h.usuario}</td></tr>
                    `).join('')}
                </tbody>
            </table>
            <button class="btn btn-primary" onclick="cerrarModalGeneric()">Cerrar</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}
// ============================================
// MÉTRICAS ÁGILES
// ============================================


function inicializarMetricasAgiles() {
    if (!proyecto.metricasAgiles) {
        proyecto.metricasAgiles = {
            sprints: [],
            velocidadPromedio: 0,
            sprintsCompletados: 0
        };
    }
    actualizarBurnDown();
}

function actualizarBurnDown() {
    const ctx = document.getElementById('burndownChart')?.getContext('2d');
    if (!ctx) return;
    
    const puntosPorSprint = parseInt(document.getElementById('puntosPorSprint')?.value) || 20;
    const sprintsTotales = parseInt(document.getElementById('sprintsTotales')?.value) || 6;
    const sprintActual = parseInt(document.getElementById('sprintActual')?.value) || 1;
    
    // Datos ideales (línea recta descendente)
    const idealData = [];
    for (let i = 0; i <= sprintsTotales; i++) {
        idealData.push(puntosPorSprint * (sprintsTotales - i));
    }
    
    // Datos reales (desde el proyecto)
    const metricas = proyecto.metricasAgiles || { sprints: [] };
    const realData = [puntosPorSprint * sprintsTotales];
    for (let i = 1; i <= sprintActual; i++) {
        const sprintData = metricas.sprints?.find(s => s.numero === i);
        const puntosRestantes = Math.max(0, realData[i-1] - (sprintData?.puntosCompletados || 0));
        realData.push(puntosRestantes);
    }
    while (realData.length <= sprintsTotales) {
        realData.push(realData[realData.length - 1]);
    }
    
    const labels = ['Inicio', ...Array.from({ length: sprintsTotales }, (_, i) => `Sprint ${i+1}`)];
    
    //  Usar la variable global
    if (burndownChart) burndownChart.destroy();
    
    burndownChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.slice(0, realData.length),
            datasets: [
                { label: 'Ideal (Planificado)', data: idealData.slice(0, realData.length), borderColor: '#007AFF', borderDash: [5, 5], fill: false, tension: 0 },
                { label: 'Real (Ejecutado)', data: realData, borderColor: '#FF8C00', backgroundColor: 'rgba(255,140,0,0.1)', fill: true, tension: 0.3 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw} puntos` } } },
            scales: { y: { title: { display: true, text: 'Puntos restantes', color: 'white' } }, x: { title: { display: true, text: 'Tiempo', color: 'white' } } }
        }
    });
}
function registrarVelocidadSprint() {
    const sprintNum = parseInt(document.getElementById('sprintActual')?.value) || 1;
    const puntos = prompt(` Velocidad del Sprint ${sprintNum} (puntos completados):`, "15");
    
    if (puntos !== null && !isNaN(parseFloat(puntos))) {
        if (!proyecto.metricasAgiles) proyecto.metricasAgiles = { sprints: [] };
        if (!proyecto.metricasAgiles.sprints) proyecto.metricasAgiles.sprints = [];
        
        const sprintExistente = proyecto.metricasAgiles.sprints.find(s => s.numero === sprintNum);
        if (sprintExistente) {
            sprintExistente.puntosCompletados = parseFloat(puntos);
            sprintExistente.fechaCompletado = new Date().toISOString();
        } else {
            proyecto.metricasAgiles.sprints.push({
                numero: sprintNum,
                puntosCompletados: parseFloat(puntos),
                fechaCompletado: new Date().toISOString()
            });
        }
        
        // Calcular velocidad promedio
        const sprintsCompletados = proyecto.metricasAgiles.sprints.filter(s => s.puntosCompletados > 0);
        const suma = sprintsCompletados.reduce((acc, s) => acc + s.puntosCompletados, 0);
        proyecto.metricasAgiles.velocidadPromedio = sprintsCompletados.length > 0 ? suma / sprintsCompletados.length : 0;
        
        guardarProyecto();
        actualizarBurnDown();
        
        // Actualizar también el panel de salud
        proyecto.velocidadEquipo = proyecto.metricasAgiles.velocidadPromedio;
        actualizarPanelSalud();
        
        mostrarToast(` Sprint ${sprintNum}: ${puntos} puntos completados. Velocidad promedio: ${proyecto.metricasAgiles.velocidadPromedio.toFixed(1)} pts/sprint`, 'success');
        
        // Sugerir próximo sprint
        document.getElementById('sprintActual').value = sprintNum + 1;
    }
}

function exportarMetricasAgiles() {
    const metricas = proyecto.metricasAgiles || { sprints: [] };
    let csv = "Sprint,Puntos Completados,Fecha\n";
    metricas.sprints.forEach(s => {
        csv += `${s.numero},${s.puntosCompletados || 0},${s.fechaCompletado?.split('T')[0] || '-'}\n`;
    });
    csv += `\nVelocidad Promedio,${metricas.velocidadPromedio.toFixed(1)} pts/sprint\n`;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `metricas_agiles_${proyecto.nombre}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Métricas ágiles exportadas", 'success');
}

// ============================================
// SCRUM ÁGIL - SISTEMA COMPLETO (CORREGIDO)
// ============================================



// ============================================
// INICIALIZACIÓN
// ============================================
function renderizarAgileMetrics() {
    console.log(" Renderizando Agile Metrics...");
    
    // Verificar si existe el contenedor
    const tbody = document.getElementById('agileMetricsBody');
    if (!tbody) return;
    
    // Verificar datos Scrum
    if (!proyecto.scrum || !proyecto.scrum.sprints || proyecto.scrum.sprints.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="u-text-center">No hay sprints completados. Finaliza al menos un sprint para ver métricas.</td></tr>';
        return;
    }
    
    const sprints = proyecto.scrum.sprints.filter(s => s.estado === 'completado');
    if (sprints.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="u-text-center">Completa al menos un sprint para ver las métricas.</td></tr>';
        return;
    }
    
    // Variables para estadísticas
    let totalLeadTime = 0;
    let totalCycleTime = 0;
    let totalThroughput = 0;
    let totalPredictibilidad = 0;
    let sprintCount = 0;
    
    let html = '';
    
    sprints.forEach(sprint => {
        const historiasSprint = (proyecto.scrum.historias || []).filter(h => h.sprintId === sprint.id);
        const historiasCount = historiasSprint.length;
        const puntos = sprint.puntosCompletados || 0;
        
        // Calcular Lead Time (días desde inicio hasta fin del sprint)
        let leadTime = '-';
        if (sprint.fechaFinReal && sprint.fechaInicio) {
            const inicio = new Date(sprint.fechaInicio);
            const fin = new Date(sprint.fechaFinReal);
            leadTime = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
            totalLeadTime += leadTime;
        } else if (sprint.fechaFin && sprint.fechaInicio) {
            const inicio = new Date(sprint.fechaInicio);
            const fin = new Date(sprint.fechaFin);
            leadTime = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
            totalLeadTime += leadTime;
        }
        
        // Cycle Time (similar a Lead Time para sprints)
        let cycleTime = leadTime;
        if (cycleTime !== '-') totalCycleTime += cycleTime;
        
        // Throughput (historias completadas)
        const throughput = historiasSprint.filter(h => h.estado === 'done').length;
        totalThroughput += throughput;
        
        // Predictibilidad
        let predictibilidad = 0;
        if (sprint.puntosPlanificados && sprint.puntosPlanificados > 0) {
            predictibilidad = ((sprint.puntosCompletados || 0) / sprint.puntosPlanificados) * 100;
            totalPredictibilidad += predictibilidad;
            sprintCount++;
        }
        
        html += `<tr>
            <td>${escapeHtml(sprint.nombre)}</td>
            <td>${historiasCount}</td>
            <td>${puntos}</td>
            <td>${leadTime}</td>
            <td>${cycleTime}</td>
            <td>${throughput}</td>
            <td>${predictibilidad > 0 ? predictibilidad.toFixed(0) + '%' : '-'}</td>
        </tr>`;
    });
    
    tbody.innerHTML = html;
    
    // Actualizar tarjetas de resumen
    if (sprintCount > 0) {
        const avgLeadTime = Math.round(totalLeadTime / sprintCount);
        const avgCycleTime = Math.round(totalCycleTime / sprintCount);
        const avgThroughput = (totalThroughput / sprintCount).toFixed(1);
        const avgPredictibilidad = Math.round(totalPredictibilidad / sprintCount);
        
        const leadTimeElem = document.getElementById('leadTime');
        if (leadTimeElem) leadTimeElem.innerHTML = avgLeadTime;
        
        const cycleTimeElem = document.getElementById('cycleTime');
        if (cycleTimeElem) cycleTimeElem.innerHTML = avgCycleTime;
        
        const throughputElem = document.getElementById('throughput');
        if (throughputElem) throughputElem.innerHTML = avgThroughput;
        
        const predictibilidadElem = document.getElementById('predictibilidad');
        if (predictibilidadElem) predictibilidadElem.innerHTML = avgPredictibilidad + '%';
    }
}

function inicializarScrum() {
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
    
    // Asegurar que cada sprint tiene estructura de costes (PMBOK 8)
    proyecto.scrum.sprints.forEach(sprint => {
        if (!sprint.costes) {
            sprint.costes = {
                planificado: 0,
                real: 0,
                materiales: [],
                servicios: [],
                equipo: 0,
                desviacion: 0
            };
        }
    });
    
    renderizarSprintBacklog();
    renderizarBurndown();
    renderizarVelocityTracking();
    renderizarRetrospectives();
    renderizarAgileMetrics();
    
    // Calcular costes si estamos en modo ágil
    if (proyecto.metodologia?.tipo === 'agile' || proyecto.metodologia?.tipo === 'mixto') {
    if (typeof calcularCostesPorSprint === 'function' && (proyecto.metodologia?.tipo === 'agile' || proyecto.metodologia?.tipo === 'mixto')) {
    // setTimeout(() => calcularCostesPorSprint(), 500); // Comentado hasta implementar
    console.log(" Para ver costes ágiles, abre el panel 'Control de Gastos Ágil'");
}
    }
    
    sincronizarConPanelSalud();
}

function sincronizarConPanelSalud() {
    // Sincronizar velocidad del equipo con el panel de salud
    const sprintsCompletados = (proyecto.scrum.sprints || []).filter(s => s.estado === 'completado');
    if (sprintsCompletados.length > 0) {
        const sumaVelocidad = sprintsCompletados.reduce((acc, s) => acc + (s.puntosCompletados || 0), 0);
        const velocidadPromedio = sumaVelocidad / sprintsCompletados.length;
        proyecto.velocidadEquipo = Math.round(velocidadPromedio);
    }
    
    // Sincronizar defectos desde las retrospectivas
    const retrospectivas = proyecto.scrum.retrospectivas || [];
    const defectosReportados = retrospectivas.reduce((acc, r) => {
        return acc + (r.mejorar?.filter(m => m.toLowerCase().includes('error') || m.toLowerCase().includes('defecto') || m.toLowerCase().includes('bug')).length || 0);
    }, 0);
    
    if (defectosReportados > 0 && !proyecto.defectos) {
        proyecto.defectos = defectosReportados;
    }
    
    guardarProyecto();
    if (typeof actualizarPanelSalud === 'function') actualizarPanelSalud();
}

// ============================================
// SPRINT BACKLOG
// ============================================

function renderizarSprintBacklog() {
    const historias = proyecto.scrum.historias || [];
    const sprintActivo = proyecto.scrum.sprintActivo;
    
    // Verificar que los elementos del DOM existen
    if (document.getElementById('sprintNombre')) {
        if (sprintActivo) {
            const historiasSprint = historias.filter(h => h.sprintId === sprintActivo.id);
            const puntosPlanificados = historiasSprint.reduce((acc, h) => acc + (h.puntos || 0), 0);
            const puntosCompletados = historiasSprint.filter(h => h.estado === 'done').reduce((acc, h) => acc + (h.puntos || 0), 0);
            const progreso = puntosPlanificados > 0 ? (puntosCompletados / puntosPlanificados) * 100 : 0;
            
            document.getElementById('sprintNombre').innerHTML = ` ${sprintActivo.nombre || 'Sprint Actual'}`;
            document.getElementById('sprintDetalles').innerHTML = `${sprintActivo.fechaInicio || '-'} → ${sprintActivo.fechaFin || '-'}`;
            document.getElementById('sprintPuntosPlanificados').innerHTML = puntosPlanificados;
            document.getElementById('sprintPuntosCompletados').innerHTML = puntosCompletados;
            document.getElementById('sprintProgreso').innerHTML = progreso.toFixed(1);
            document.getElementById('sprintProgresoBarra').style.width = `${progreso}%`;
        } else {
            document.getElementById('sprintNombre').innerHTML = ' Sprint Actual: No iniciado';
            document.getElementById('sprintDetalles').innerHTML = 'Inicia un sprint para comenzar a trabajar';
            document.getElementById('sprintPuntosPlanificados').innerHTML = '0';
            document.getElementById('sprintPuntosCompletados').innerHTML = '0';
            document.getElementById('sprintProgreso').innerHTML = '0';
            document.getElementById('sprintProgresoBarra').style.width = '0%';
        }
    }
    
    // Filtrar historias por estado
    const todoHistorias = historias.filter(h => h.estado === 'todo' && (!sprintActivo || h.sprintId === sprintActivo.id));
    const progressHistorias = historias.filter(h => h.estado === 'progress' && (!sprintActivo || h.sprintId === sprintActivo.id));
    const doneHistorias = historias.filter(h => h.estado === 'done' && (!sprintActivo || h.sprintId === sprintActivo.id));
    
    if (document.getElementById('todoCount')) document.getElementById('todoCount').innerHTML = todoHistorias.length;
    if (document.getElementById('progressCount')) document.getElementById('progressCount').innerHTML = progressHistorias.length;
    if (document.getElementById('doneCount')) document.getElementById('doneCount').innerHTML = doneHistorias.length;
    
    // Renderizar TO DO con eventos drag & drop mejorados
    const todoContainer = document.getElementById('todoList');
    if (todoContainer) {
        todoContainer.innerHTML = todoHistorias.map(h => `
            <div class="item-card" 
                 draggable="true" 
                 ondragstart="dragStart(event, ${h.id})" 
                 ondragend="dragEnd(event)"
                 data-id="${h.id}">
                <div>
                    <strong>[${h.puntos} pts] ${escapeHtml(h.titulo)}</strong>
                    <div style="font-size: 10px; color: ${h.prioridad === 'Alta' ? '#FF3B30' : (h.prioridad === 'Media' ? '#FF8C00' : '#00A859')}">
                         ${h.prioridad} |  ${h.fechaCreacion?.split('T')[0] || '-'}
                    </div>
                </div>
                <div>
                    <span class="edit-btn" onclick="editarHistoria(${h.id})"></span>
                    <span class="delete-btn" onclick="eliminarHistoria(${h.id})"></span>
                </div>
            </div>
        `).join('');
        
        // Configurar eventos del contenedor
        todoContainer.ondragover = dragOver;
        todoContainer.ondragleave = dragLeave;
        todoContainer.ondrop = (e) => drop(e, 'progress');
    }
    
    // Renderizar IN PROGRESS
    const progressContainer = document.getElementById('progressList');
    if (progressContainer) {
        progressContainer.innerHTML = progressHistorias.map(h => `
            <div class="item-card" 
                 draggable="true" 
                 ondragstart="dragStart(event, ${h.id})" 
                 ondragend="dragEnd(event)"
                 data-id="${h.id}">
                <div>
                    <strong>[${h.puntos} pts] ${escapeHtml(h.titulo)}</strong>
                    <div style="font-size: 10px; color: #FF8C00;"> En progreso</div>
                </div>
                <div>
                    <span class="edit-btn" onclick="editarHistoria(${h.id})"></span>
                    <span class="delete-btn" onclick="eliminarHistoria(${h.id})"></span>
                </div>
            </div>
        `).join('');
        
        progressContainer.ondragover = dragOver;
        progressContainer.ondragleave = dragLeave;
        progressContainer.ondrop = (e) => drop(e, 'done');
    }
    
    // Renderizar DONE (no draggable porque ya está completado)
    const doneContainer = document.getElementById('doneList');
    if (doneContainer) {
        doneContainer.innerHTML = doneHistorias.map(h => `
            <div class="item-card">
                <div>
                    <strong>[${h.puntos} pts] ${escapeHtml(h.titulo)}</strong>
                    <div style="font-size: 10px; color: #00A859;"> Completado</div>
                </div>
                <div>
                    <span class="edit-btn" onclick="editarHistoria(${h.id})"></span>
                    <span class="delete-btn" onclick="eliminarHistoria(${h.id})"></span>
                </div>
            </div>
        `).join('');
        
        // DONE no acepta drops
        doneContainer.ondragover = null;
        doneContainer.ondrop = null;
    }
}

// Variables globales para drag & drop
let draggedItemId = null;

function dragStart(event, id) {
    draggedItemId = id;
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
    event.target.classList.add('dragging');
}

function dragEnd(event) {
    event.target.classList.remove('dragging');
    // Limpiar estilos de drag-over
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });
    draggedItemId = null;
}

function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    
    // Añadir clase visual al contenedor destino
    const targetContainer = event.currentTarget;
    if (!targetContainer.classList.contains('drag-over')) {
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
        targetContainer.classList.add('drag-over');
    }
}

function dragLeave(event) {
    const targetContainer = event.currentTarget;
    targetContainer.classList.remove('drag-over');
}

function drop(event, nuevoEstado) {
    event.preventDefault();
    
    const id = draggedItemId || parseInt(event.dataTransfer.getData("text/plain"));
    if (!id) return;
    
    const historia = proyecto.scrum.historias.find(h => h.id === id);
    if (historia && historia.estado !== nuevoEstado) {
        const estadoAnterior = historia.estado;
        historia.estado = nuevoEstado;
        
        if (nuevoEstado === 'done' && !historia.fechaCompletado) {
    historia.fechaCompletado = new Date().toISOString();
    const fechaInicio = new Date(historia.fechaInicio || historia.fechaCreacion);
    const cycleTime = Math.ceil((new Date() - fechaInicio) / (1000 * 60 * 60 * 24));
    historia.cycleTime = cycleTime;
    
    //  Calcular días reales
    if (historia.fechaInicio) {
        const inicio = new Date(historia.fechaInicio);
        const fin = new Date();
        historia.diasReales = Math.max(1, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)));
    }
    
    if (!proyecto.scrum.metricas.cycleTime) proyecto.scrum.metricas.cycleTime = [];
    proyecto.scrum.metricas.cycleTime.push(cycleTime);
}
        
        guardarProyecto();
        renderizarSprintBacklog();
        renderizarBurndown();
        renderizarAgileMetrics();
        sincronizarConPanelSalud();
        
        //  Recalcular costes del sprint
        if (proyecto.scrum.sprintActivo && typeof recalcularCostesSprint === 'function') {
            recalcularCostesSprint(proyecto.scrum.sprintActivo.id);
        }
        
        const estadoTexto = {
            'todo': 'Pendiente',
            'progress': 'En Progreso',
            'done': 'Completado'
        };
        mostrarToast(` Historia movida a ${estadoTexto[nuevoEstado]}`, 'success');
    }
    
    // Limpiar estilos
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });
    draggedItemId = null;
}

function abrirModalHistoria() {
    // Generar opciones de recursos desde el equipo
    let recursoOptions = '<option value="">-- Sin asignar --</option>';
    if (proyecto.equipo && proyecto.equipo.length > 0) {
        proyecto.equipo.forEach(m => {
            recursoOptions += `<option value="${m.id}">${escapeHtml(m.nombre)} (${escapeHtml(m.rol || 'Sin rol')}) - ${m.costeHora} ${m.moneda}/hora</option>`;
        });
    } else {
        recursoOptions = '<option value="" disabled> No hay recursos en "Equipo" - Añádelos primero</option>';
    }
    
    const modalHtml = `
        <div class="modal-content modal-sm">
            <div class="modal-header">
                <h3> Nueva Historia de Usuario</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div class="form-group">
                <label>Título *</label>
                <input type="text" id="historiaTitulo" placeholder="Ej: Como usuario quiero...">
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <textarea rows="3" id="historiaDescripcion" placeholder="Criterios de aceptación..."></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Prioridad</label>
                    <select id="historiaPrioridad">
                        <option value="Crítica">Crítica</option>
                        <option value="Alta">Alta</option>
                        <option value="Media" selected>Media</option>
                        <option value="Baja">Baja</option>
                    </select>
                </div>
                <div class="form-group">
                    <label> Puntos de historia</label>
                    <select id="historiaPuntos">
                        <option value="1">1 punto (XS)</option>
                        <option value="2">2 puntos (S)</option>
                        <option value="3">3 puntos (M)</option>
                        <option value="5" selected>5 puntos (L)</option>
                        <option value="8">8 puntos (XL)</option>
                        <option value="13">13 puntos (XXL)</option>
                    </select>
                </div>
            </div>
            
            <!-- NUEVO: Asignación de recurso -->
            <div class="form-group">
                <label> Recurso asignado (desde Equipo)</label>
                <select id="historiaRecursoId">
                    ${recursoOptions}
                </select>
                <small class="u-fs-11 u-color-muted"> El coste de la historia se calculará según el recurso y los días estimados.</small>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Días estimados</label>
                    <input type="number" id="historiaDiasEstimados" value="5" min="1" step="0.5">
                    <small>Días de trabajo estimados para esta historia</small>
                </div>
                <div class="form-group">
                    <label> Horas por día</label>
                    <input type="number" id="historiaHorasDia" value="8" min="1" max="12">
                    <small>Horas que trabajará al día</small>
                </div>
            </div>
            
            <div class="form-group">
                <label> Etiquetas</label>
                <input type="text" id="historiaEtiquetas" placeholder="frontend, backend, bug, feature...">
            </div>
            
            <div class="info-card-modal u-mt-12 u-p-10">
                <small> <strong>Cálculo automático de coste:</strong><br>
                Coste estimado = Días estimados × Horas/día × Coste/hora del recurso</small>
            </div>
            
            <div class="u-flex-gap-12 u-mt-20">
                <button class="btn btn-secondary u-flex-1" onclick="cerrarModalGeneric()">Cancelar</button>
                <button class="btn btn-primary u-flex-1" onclick="guardarHistoria()">Guardar Historia</button>
            </div>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}

function guardarHistoria() {
    if (!proyecto) {
        mostrarToast(" Proyecto no cargado", 'error');
        return;
    }
    
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
    
    if (!proyecto.scrum.historias) {
        proyecto.scrum.historias = [];
    }
    
    let titulo = document.getElementById('historiaTitulo').value.trim();
    if (!titulo) { 
        mostrarToast(tApp('toast_titulo_obligatorio_gen'), 'error'); 
        return; 
    }
    
    const sprintActivo = proyecto.scrum.sprintActivo || null;
    
    // Obtener valores
    let puntos = parseInt(document.getElementById('historiaPuntos').value) || 5;
    let prioridad = document.getElementById('historiaPrioridad').value;
    let asignado = document.getElementById('historiaAsignado')?.value || '';
    let etiquetas = document.getElementById('historiaEtiquetas')?.value || '';
    let descripcion = document.getElementById('historiaDescripcion')?.value || '';
    
    //  NUEVO: Obtener recurso asignado y calcular coste
    let recursoId = document.getElementById('historiaRecursoId')?.value;
    let recursoInfo = null;
    let diasEstimados = parseFloat(document.getElementById('historiaDiasEstimados')?.value) || 5;
    let horasPorDia = parseFloat(document.getElementById('historiaHorasDia')?.value) || 8;
    let costeEstimado = 0;
    
    if (recursoId && proyecto.equipo) {
        const recurso = proyecto.equipo.find(r => r.id == recursoId);
        if (recurso) {
            const horasTotales = diasEstimados * horasPorDia;
            costeEstimado = horasTotales * recurso.costeHora;
            recursoInfo = {
                id: recurso.id,
                nombre: recurso.nombre,
                rol: recurso.rol,
                costeHora: recurso.costeHora,
                moneda: recurso.moneda,
                horasPorDia: horasPorDia
            };
        }
    }
    
    const nuevaHistoria = {
        id: Date.now(),
        titulo: titulo,
        descripcion: descripcion,
        prioridad: prioridad,
        puntos: puntos,
        asignado: asignado,
        etiquetas: etiquetas,
        estado: 'todo',
        sprintId: sprintActivo ? sprintActivo.id : null,
        fechaCreacion: new Date().toISOString(),
        //  NUEVOS CAMPOS PARA COSTES
        recursoAsignado: recursoInfo,
        diasEstimados: diasEstimados,
        horasPorDia: horasPorDia,
        costeEstimado: costeEstimado,
        costeReal: 0,
        diasReales: null
    };
    
    proyecto.scrum.historias.push(nuevaHistoria);
    
    guardarProyecto();
    renderizarSprintBacklog();
    
    //  Actualizar costes del sprint si hay sprint activo
    if (sprintActivo && typeof recalcularCostesSprint === 'function') {
        recalcularCostesSprint(sprintActivo.id);
    }
    
    const modal = document.getElementById('genericModal');
    if (modal) modal.remove();
    
    mostrarToast(` Historia "${titulo}" creada (${puntos} pts) - Coste estimado: ${formatearMoneda(costeEstimado)}`, 'success');
}
function recalcularCostesSprint(sprintId) {
    const sprint = proyecto.scrum.sprints?.find(s => s.id === sprintId);
    if (!sprint) return;
    
    const historiasSprint = (proyecto.scrum.historias || []).filter(h => h.sprintId === sprintId);
    
    // Calcular coste PLANIFICADO
    let costePlanificadoTotal = 0;
    let puntosPlanificados = 0;
    
    historiasSprint.forEach(historia => {
        puntosPlanificados += historia.puntos || 0;
        costePlanificadoTotal += historia.costeEstimado || 0;
    });
    
    // Calcular coste REAL - SIN FACTOR DE INTENSIDAD
    let costeRealTotal = 0;
    let puntosCompletados = 0;
    
    historiasSprint.forEach(historia => {
        if (historia.estado === 'done') {
            puntosCompletados += historia.puntos || 0;
            
            if (historia.recursoAsignado) {
                //  CORRECTO: Usar días REALES, no aplicar factor de intensidad
                const diasReales = historia.diasReales || historia.diasEstimados || 5;
                const horasPorDia = historia.horasPorDia || 8;
                
                // Horas totales = días reales × horas por día
                const horasTotales = diasReales * horasPorDia;
                const costeRealHistoria = horasTotales * historia.recursoAsignado.costeHora;
                
                costeRealTotal += costeRealHistoria;
                
                console.log(` Historia "${historia.titulo}":`);
                console.log(`   Días estimados: ${historia.diasEstimados}`);
                console.log(`   Días reales: ${diasReales}`);
                console.log(`   Horas totales: ${horasTotales}h`);
                console.log(`   Coste estimado: ${formatearMoneda(historia.costeEstimado)}`);
                console.log(`   Coste real: ${formatearMoneda(costeRealHistoria)}`);
            } else {
                costeRealTotal += historia.costeEstimado || 0;
            }
        }
    });
    
    //  Calcular desviación (puede ser negativa = ahorro, positiva = sobrecoste)
    const desviacion = costePlanificadoTotal > 0 ? 
        ((costeRealTotal - costePlanificadoTotal) / costePlanificadoTotal) * 100 : 0;
    
    // Guardar en el sprint
    if (!sprint.costes) sprint.costes = {};
    sprint.costes.planificado = costePlanificadoTotal;
    sprint.costes.real = costeRealTotal;
    sprint.costes.puntosPlanificados = puntosPlanificados;
    sprint.costes.puntosCompletados = puntosCompletados;
    sprint.costes.desviacion = desviacion;
    sprint.costes.fechaCalculo = new Date().toISOString();
    
    guardarProyecto();
    
    // Actualizar UI
    if (typeof calcularCostesPorSprint === 'function') {
        calcularCostesPorSprint();
    }
    
    // Mostrar alerta según desviación
    if (desviacion > 15) {
        mostrarToast(` Sprint "${sprint.nombre}" tiene SOBRECOSTE del ${desviacion.toFixed(1)}%`, 'warning');
    } else if (desviacion < -10) {
        mostrarToast(` Sprint "${sprint.nombre}" tiene AHORRO del ${Math.abs(desviacion).toFixed(1)}%`, 'success');
    }
    
    return { costePlanificadoTotal, costeRealTotal, desviacion };
}

function editarHistoria(id) {
    const historia = proyecto.scrum.historias.find(h => h.id === id);
    if (!historia) return;
    
    // Generar opciones de recursos
    let recursoOptions = '<option value="">-- Sin asignar --</option>';
    if (proyecto.equipo && proyecto.equipo.length > 0) {
        proyecto.equipo.forEach(m => {
            recursoOptions += `<option value="${m.id}" ${historia.recursoAsignado?.id === m.id ? 'selected' : ''}>${escapeHtml(m.nombre)} (${escapeHtml(m.rol || 'Sin rol')}) - ${m.costeHora} ${m.moneda}/hora</option>`;
        });
    }
    
    const modalHtml = `
        <div class="modal-content modal-sm">
            <div class="modal-header">
                <h3> Editar Historia</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="editHistoriaId" value="${id}">
            <div class="form-group">
                <label>Título</label>
                <input type="text" id="editHistoriaTitulo" value="${escapeHtml(historia.titulo)}">
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <textarea rows="3" id="editHistoriaDescripcion">${escapeHtml(historia.descripcion || '')}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Prioridad</label>
                    <select id="editHistoriaPrioridad">
                        <option value="Crítica" ${historia.prioridad === 'Crítica' ? 'selected' : ''}>Crítica</option>
                        <option value="Alta" ${historia.prioridad === 'Alta' ? 'selected' : ''}>Alta</option>
                        <option value="Media" ${historia.prioridad === 'Media' ? 'selected' : ''}>Media</option>
                        <option value="Baja" ${historia.prioridad === 'Baja' ? 'selected' : ''}>Baja</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Puntos</label>
                    <select id="editHistoriaPuntos">
                        <option value="1" ${historia.puntos === 1 ? 'selected' : ''}>1 punto</option>
                        <option value="2" ${historia.puntos === 2 ? 'selected' : ''}>2 puntos</option>
                        <option value="3" ${historia.puntos === 3 ? 'selected' : ''}>3 puntos</option>
                        <option value="5" ${historia.puntos === 5 ? 'selected' : ''}>5 puntos</option>
                        <option value="8" ${historia.puntos === 8 ? 'selected' : ''}>8 puntos</option>
                        <option value="13" ${historia.puntos === 13 ? 'selected' : ''}>13 puntos</option>
                    </select>
                </div>
            </div>
            
            <!-- NUEVO: Editar recurso asignado -->
            <div class="form-group">
                <label> Recurso asignado</label>
                <select id="editHistoriaRecursoId">
                    ${recursoOptions}
                </select>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Días estimados</label>
                    <input type="number" id="editHistoriaDiasEstimados" value="${historia.diasEstimados || 5}" step="0.5">
                </div>
                <div class="form-group">
                    <label> Horas por día</label>
                    <input type="number" id="editHistoriaHorasDia" value="${historia.horasPorDia || 8}">
                </div>
            </div>
            
            <div class="form-group">
                <label> Días reales (opcional)</label>
                <input type="number" id="editHistoriaDiasReales" value="${historia.diasReales || ''}" step="0.5" placeholder="Dejar vacío si no está completada">
                <small>Si la historia está completada, introduce los días reales trabajados</small>
            </div>
            
            <div class="form-group">
                <label>Estado</label>
                <select id="editHistoriaEstado">
                    <option value="todo" ${historia.estado === 'todo' ? 'selected' : ''}> TO DO</option>
                    <option value="progress" ${historia.estado === 'progress' ? 'selected' : ''}> IN PROGRESS</option>
                    <option value="done" ${historia.estado === 'done' ? 'selected' : ''}> DONE</option>
                </select>
            </div>
            
            <div class="info-card-modal u-mt-12 u-p-10">
                <small> <strong>Coste actual:</strong><br>
                Estimado: ${formatearMoneda(historia.costeEstimado || 0)}<br>
                ${historia.costeReal > 0 ? `Real: ${formatearMoneda(historia.costeReal)}` : ''}
                </small>
            </div>
            
            <button class="btn btn-primary" onclick="actualizarHistoria()">Actualizar</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function actualizarHistoria() {
    const id = parseInt(document.getElementById('editHistoriaId').value);
    const idx = proyecto.scrum.historias.findIndex(h => h.id === id);
    if (idx >= 0) {
        const estadoAnterior = proyecto.scrum.historias[idx].estado;
        const nuevoEstado = document.getElementById('editHistoriaEstado').value;
        
        // Obtener nuevo recurso y recalcular coste
        const recursoId = document.getElementById('editHistoriaRecursoId')?.value;
        const diasEstimados = parseFloat(document.getElementById('editHistoriaDiasEstimados').value) || 5;
        const horasPorDia = parseFloat(document.getElementById('editHistoriaHorasDia').value) || 8;
        const diasReales = document.getElementById('editHistoriaDiasReales').value ? 
            parseFloat(document.getElementById('editHistoriaDiasReales').value) : null;
        
        let recursoInfo = proyecto.scrum.historias[idx].recursoAsignado;
        let costeEstimado = proyecto.scrum.historias[idx].costeEstimado || 0;
        
        if (recursoId && proyecto.equipo) {
            const recurso = proyecto.equipo.find(r => r.id == recursoId);
            if (recurso) {
                const horasTotales = diasEstimados * horasPorDia;
                costeEstimado = horasTotales * recurso.costeHora;
                recursoInfo = {
                    id: recurso.id,
                    nombre: recurso.nombre,
                    rol: recurso.rol,
                    costeHora: recurso.costeHora,
                    moneda: recurso.moneda,
                    horasPorDia: horasPorDia
                };
            }
        }
        
        // Calcular coste real si hay días reales
        let costeReal = 0;
        if (diasReales && diasReales > 0 && recursoInfo) {
            const horasTotalesReales = diasReales * horasPorDia;
            costeReal = horasTotalesReales * recursoInfo.costeHora;
        }
        
        proyecto.scrum.historias[idx] = {
            ...proyecto.scrum.historias[idx],
            titulo: document.getElementById('editHistoriaTitulo').value,
            descripcion: document.getElementById('editHistoriaDescripcion').value,
            prioridad: document.getElementById('editHistoriaPrioridad').value,
            puntos: parseInt(document.getElementById('editHistoriaPuntos').value),
            estado: nuevoEstado,
            recursoAsignado: recursoInfo,
            diasEstimados: diasEstimados,
            horasPorDia: horasPorDia,
            diasReales: diasReales,
            costeEstimado: costeEstimado,
            costeReal: costeReal
        };
        
        if (nuevoEstado === 'done' && estadoAnterior !== 'done') {
            if (!proyecto.scrum.historias[idx].fechaCompletado) {
                proyecto.scrum.historias[idx].fechaCompletado = new Date().toISOString();
            }
            if (!diasReales && proyecto.scrum.historias[idx].fechaInicio && proyecto.scrum.historias[idx].fechaCompletado) {
                const inicio = new Date(proyecto.scrum.historias[idx].fechaInicio);
                const fin = new Date(proyecto.scrum.historias[idx].fechaCompletado);
                const diasCalc = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
                proyecto.scrum.historias[idx].diasReales = diasCalc;
            }
        }
        
        guardarProyecto();
        renderizarSprintBacklog();
        renderizarBurndown();
        renderizarAgileMetrics();
        sincronizarConPanelSalud();
        
        //  Recalcular costes del sprint
        if (proyecto.scrum.sprintActivo && typeof recalcularCostesSprint === 'function') {
            recalcularCostesSprint(proyecto.scrum.sprintActivo.id);
        }
        
        cerrarModalGeneric();
        mostrarToast(tApp('toast_historia_actualizada'), 'success');
    }
}

function eliminarHistoria(id) {
    if (confirm(tApp('confirmar_eliminar_historia'))) {
        proyecto.scrum.historias = proyecto.scrum.historias.filter(h => h.id !== id);
        guardarProyecto();
        renderizarSprintBacklog();
        renderizarBurndown();
        mostrarToast(tApp('toast_historia_eliminada'), 'success');
    }
}

function ordenarHistorias(criterio) {
    const historias = proyecto.scrum.historias;
    if (criterio === 'prioridad') {
        const orden = { 'Crítica': 0, 'Alta': 1, 'Media': 2, 'Baja': 3 };
        proyecto.scrum.historias.sort((a, b) => (orden[a.prioridad] || 4) - (orden[b.prioridad] || 4));
    } else if (criterio === 'puntos') {
        proyecto.scrum.historias.sort((a, b) => b.puntos - a.puntos);
    }
    guardarProyecto();
    renderizarSprintBacklog();
    mostrarToast(` Ordenado por ${criterio}`, 'success');
}

function iniciarSprint() {
    if (proyecto.scrum.sprintActivo) {
        mostrarToast(tApp('toast_sprint_activo'), 'warning');
        return;
    }
    
    const historiasPendientes = proyecto.scrum.historias.filter(h => h.estado === 'todo' && !h.sprintId);
    if (historiasPendientes.length === 0) {
        mostrarToast(" No hay historias pendientes para iniciar un sprint", 'error');
        return;
    }
    
    const puntosTotales = historiasPendientes.reduce((acc, h) => acc + (h.puntos || 0), 0);
    const velocidadPromedio = calcularVelocidadHistorica();
    
    let sugerencia = "";
    if (velocidadPromedio > 0) {
        const puntosSugeridos = Math.min(puntosTotales, velocidadPromedio * 1.2);
        sugerencia = `<div class="info-card-modal u-mb-12">
            <p> Basado en tu velocidad histórica (${velocidadPromedio} pts/sprint), se recomienda planificar alrededor de <strong>${Math.round(puntosSugeridos)} puntos</strong> para este sprint.</p>
        </div>`;
    }
    
    const modalHtml = `
        <div class="modal-content modal-600">
            <div class="modal-header">
                <h3> Iniciar Nuevo Sprint</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            ${sugerencia}
            <div class="form-group">
                <label>Nombre del Sprint</label>
                <input type="text" id="sprintNombreInput" value="Sprint ${(proyecto.scrum.sprints?.length || 0) + 1}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Fecha inicio</label>
                    <input type="date" id="sprintInicio" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label> Duración planificada (días)</label>
                    <input type="number" id="sprintDuracion" value="14" min="1" max="30">
                </div>
            </div>
            
            <div class="info-card-modal" style="margin-bottom: 12px; background: rgba(0,168,89,0.15);">
                <p> <strong>Presupuesto del sprint:</strong> Se calculará automáticamente al finalizar el sprint<br>
                basado en los recursos asignados a cada historia y los días reales trabajados.</p>
            </div>
            
            <div class="form-group">
                <label> Historias a incluir en este sprint</label>
                <div id="historiasSeleccion" class="u-scroll-200">
                    ${historiasPendientes.map(h => `
                        <div style="margin: 4px 0;">
                            <input type="checkbox" id="selHistoria_${h.id}" value="${h.id}" class="historia-checkbox">
                            <label for="selHistoria_${h.id}">
                                [${h.puntos} pts] ${escapeHtml(h.titulo)} - ${h.prioridad}
                                ${h.recursoAsignado ? ` ${h.recursoAsignado.nombre}` : ' Sin recurso'}
                                - Coste estimado: ${formatearMoneda(h.costeEstimado || 0)}
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="info-card-modal">
                <p> Puntos totales seleccionados: <span id="puntosSeleccionados">0</span></p>
                <p> Coste planificado estimado: <span id="costePlanificadoSeleccionado">0 €</span></p>
            </div>
            <button class="btn btn-primary" onclick="confirmarInicioSprint()">Iniciar Sprint</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    
    setTimeout(() => {
        document.querySelectorAll('.historia-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                let totalPuntos = 0;
                let totalCoste = 0;
                document.querySelectorAll('.historia-checkbox:checked').forEach(c => {
                    const id = parseInt(c.value);
                    const historia = proyecto.scrum.historias.find(h => h.id === id);
                    totalPuntos += historia?.puntos || 0;
                    totalCoste += historia?.costeEstimado || 0;
                });
                const puntosSpan = document.getElementById('puntosSeleccionados');
                if (puntosSpan) puntosSpan.innerHTML = totalPuntos;
                const costeSpan = document.getElementById('costePlanificadoSeleccionado');
                if (costeSpan) costeSpan.innerHTML = formatearMoneda(totalCoste);
            });
        });
    }, 100);
}

function confirmarInicioSprint() {
    const historiasSeleccionadas = [];
    document.querySelectorAll('.historia-checkbox:checked').forEach(cb => {
        historiasSeleccionadas.push(parseInt(cb.value));
    });
    
    if (historiasSeleccionadas.length === 0) {
        mostrarToast(" Selecciona al menos una historia para el sprint", 'error');
        return;
    }
    
    const nombre = document.getElementById('sprintNombreInput').value;
    const fechaInicio = document.getElementById('sprintInicio').value;
    const duracion = parseInt(document.getElementById('sprintDuracion').value);
    
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + duracion);
    
    // Calcular puntos y coste planificado
    let puntosPlanificados = 0;
    let costePlanificado = 0;
    
    historiasSeleccionadas.forEach(id => {
        const historia = proyecto.scrum.historias.find(h => h.id === id);
        if (historia) {
            historia.sprintId = null; // temporal, se asignará después
            puntosPlanificados += historia.puntos || 0;
            costePlanificado += historia.costeEstimado || 0;
        }
    });
    
    const nuevoSprint = {
        id: Date.now(),
        numero: (proyecto.scrum.sprints?.length || 0) + 1,
        nombre: nombre,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin.toISOString().split('T')[0],
        duracion: duracion,
        estado: 'activo',
        historiasIds: historiasSeleccionadas,
        puntosPlanificados: puntosPlanificados,
        puntosCompletados: 0,
        registroDiario: [],
        costes: {
            planificado: costePlanificado,  //  Calculado automáticamente
            real: 0,
            desviacion: 0,
            fechaCreacion: new Date().toISOString()
        }
    };
    
    // Asignar historias al sprint
    historiasSeleccionadas.forEach(id => {
        const historia = proyecto.scrum.historias.find(h => h.id === id);
        if (historia) {
            historia.sprintId = nuevoSprint.id;
            historia.estado = 'todo';
            historia.fechaInicio = fechaInicio;
        }
    });
    
    // Inicializar registro diario
    for (let i = 0; i <= duracion; i++) {
        const fechaRegistro = new Date(fechaInicio);
        fechaRegistro.setDate(fechaRegistro.getDate() + i);
        nuevoSprint.registroDiario.push({
            dia: i,
            puntosRestantes: puntosPlanificados,
            puntosCompletadosHoy: 0,
            fecha: fechaRegistro.toISOString().split('T')[0]
        });
    }
    
    if (!proyecto.scrum.sprints) proyecto.scrum.sprints = [];
    proyecto.scrum.sprints.push(nuevoSprint);
    proyecto.scrum.sprintActivo = nuevoSprint;
    
    guardarProyecto();
    renderizarSprintBacklog();
    renderizarBurndown();
    cerrarModalGeneric();
    
    mostrarToast(` Sprint "${nombre}" iniciado con ${historiasSeleccionadas.length} historias (${puntosPlanificados} pts) - Coste planificado: ${formatearMoneda(costePlanificado)}`, 'success');
}

function finalizarSprint() {
    const sprintActivo = proyecto.scrum.sprintActivo;
    if (!sprintActivo) {
        mostrarToast(tApp('toast_sprint_no_activo'), 'warning');
        return;
    }
    
    const historiasSprint = proyecto.scrum.historias.filter(h => h.sprintId === sprintActivo.id);
    const completadas = historiasSprint.filter(h => h.estado === 'done').length;
    const puntosCompletados = historiasSprint.filter(h => h.estado === 'done').reduce((acc, h) => acc + (h.puntos || 0), 0);
    const noCompletadas = historiasSprint.filter(h => h.estado !== 'done');
    
    // Calcular días reales del sprint
    const fechaFinReal = new Date().toISOString().split('T')[0];
    const inicio = new Date(sprintActivo.fechaInicio);
    const fin = new Date(fechaFinReal);
    const diasReales = Math.max(1, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)));
    const diasPlanificados = sprintActivo.duracion || 14;
    
    //  Calcular factor de intensidad
    const factorIntensidad = diasPlanificados / diasReales;
    
    //  Calcular coste REAL
    let costeRealTotal = 0;
    let horasExtrasTotal = 0;
    
    historiasSprint.forEach(historia => {
        if (historia.estado === 'done' && historia.recursoAsignado) {
            const diasEstimados = historia.diasEstimados || 5;
            const horasPorDiaNormal = historia.horasPorDia || 8;
            
            const horasNormales = diasEstimados * horasPorDiaNormal;
            const horasReales = horasNormales * factorIntensidad;
            const horasExtra = horasReales - horasNormales;
            
            horasExtrasTotal += horasExtra;
            costeRealTotal += horasReales * historia.recursoAsignado.costeHora;
        } else if (historia.estado === 'progress' && historia.recursoAsignado && historia.fechaInicio) {
            const inicioH = new Date(historia.fechaInicio);
            const hoy = new Date();
            let diasTranscurridos = Math.max(1, Math.ceil((hoy - inicioH) / (1000 * 60 * 60 * 24)));
            const progreso = Math.min(1, diasTranscurridos / (historia.diasEstimados || 1));
            const horasParciales = (historia.diasEstimados || 5) * progreso * (historia.horasPorDia || 8) * factorIntensidad;
            costeRealTotal += horasParciales * historia.recursoAsignado.costeHora;
        }
    });
    
    const costePlanificado = sprintActivo.costes?.planificado || 0;
    const desviacion = costePlanificado > 0 ? 
        ((costeRealTotal - costePlanificado) / costePlanificado) * 100 : 0;
    
    // Determinar estado
    let desviacionEmoji = "";
    let desviacionColor = "";
    let estadoTexto = "";
    
    if (desviacion > 15) {
        desviacionEmoji = "";
        desviacionColor = "#FF3B30";
        estadoTexto = "SOBRECOSTE CRÍTICO";
    } else if (desviacion > 5) {
        desviacionEmoji = "";
        desviacionColor = "#FF8C00";
        estadoTexto = "SOBRECOSTE LEVE";
    } else if (desviacion < -10) {
        desviacionEmoji = "";
        desviacionColor = "#00A859";
        estadoTexto = "AHORRO SIGNIFICATIVO";
    } else {
        desviacionEmoji = "";
        desviacionColor = "#007AFF";
        estadoTexto = "DENTRO DEL PRESUPUESTO";
    }
    
    let mensaje = ` Resumen del Sprint:\n`;
    mensaje += `\n`;
    mensaje += ` Historias completadas: ${completadas}/${historiasSprint.length}\n`;
    mensaje += ` Puntos completados: ${puntosCompletados}/${sprintActivo.puntosPlanificados}\n`;
    mensaje += ` Velocidad: ${puntosCompletados} pts/sprint\n`;
    mensaje += `\n`;
    mensaje += ` Duración planificada: ${diasPlanificados} días\n`;
    mensaje += ` Duración real: ${diasReales} días\n`;
    mensaje += ` Factor intensidad: ${factorIntensidad.toFixed(2)}x `;
    
    if (factorIntensidad > 1) {
        mensaje += `(se trabajó ${((factorIntensidad - 1) * 100).toFixed(0)}% más intensamente)\n`;
    } else if (factorIntensidad < 1) {
        mensaje += `(se trabajó menos intensamente)\n`;
    } else {
        mensaje += `(ritmo normal)\n`;
    }
    
    mensaje += `\n`;
    mensaje += ` Coste planificado: ${formatearMoneda(costePlanificado)}\n`;
    mensaje += ` Coste real: ${formatearMoneda(costeRealTotal)}\n`;
    
    if (horasExtrasTotal > 0) {
        mensaje += ` Horas extra: ${horasExtrasTotal.toFixed(0)}h\n`;
    }
    
    mensaje += `\n`;
    mensaje += `${desviacionEmoji} ${estadoTexto}: ${desviacion > 0 ? '+' : ''}${desviacion.toFixed(1)}%\n`;
    mensaje += `\n`;
    
    if (desviacion > 15) {
        mensaje += `\n ¡ALERTA! El sprint se completó en ${diasReales} días (vs ${diasPlanificados} planificados).\n`;
        mensaje += `Esto requirió trabajar ${((factorIntensidad - 1) * 100).toFixed(0)}% más intensamente,\n`;
        mensaje += `resultando en ${horasExtrasTotal.toFixed(0)} horas extra y un sobrecoste.\n`;
    } else if (desviacion < -10) {
        mensaje += `\n ¡Excelente! Se completó con ahorro del ${Math.abs(desviacion).toFixed(0)}%.\n`;
    }
    
    if (noCompletadas.length > 0) {
        mensaje += `\n Historias no completadas (volverán al backlog):\n`;
        noCompletadas.forEach(h => {
            mensaje += `   - ${h.titulo} (${h.puntos} pts)\n`;
        });
    }
    
    if (confirm(mensaje + "\n\n¿Finalizar sprint?")) {
        // Mover historias no completadas al backlog
        noCompletadas.forEach(h => {
            h.sprintId = null;
            h.estado = 'todo';
            h.fechaInicio = null;
        });
        
        // Actualizar sprint
        sprintActivo.estado = 'completado';
        sprintActivo.fechaFinReal = fechaFinReal;
        sprintActivo.puntosCompletados = puntosCompletados;
        sprintActivo.velocidad = puntosCompletados;
        sprintActivo.diasReales = diasReales;
        sprintActivo.factorIntensidad = factorIntensidad;
        sprintActivo.costes.real = costeRealTotal;
        sprintActivo.costes.desviacion = desviacion;
        sprintActivo.costes.horasExtras = horasExtrasTotal;
        
        proyecto.scrum.sprintActivo = null;
        
        guardarProyecto();
        renderizarSprintBacklog();
        renderizarVelocityTracking();
        renderizarAgileMetrics();
        sincronizarConPanelSalud();
        
        // Actualizar costes en el panel
        if (typeof calcularCostesPorSprint === 'function') {
            calcularCostesPorSprint();
        }
        
        const mensajeFinal = desviacion > 15 ? 
            ` Sprint finalizado con SOBRECOSTE del ${desviacion.toFixed(1)}%` : 
            (desviacion < -10 ? ` Sprint finalizado con AHORRO del ${Math.abs(desviacion).toFixed(1)}%` :
            ` Sprint finalizado. Desviación: ${desviacion > 0 ? '+' : ''}${desviacion.toFixed(1)}%`);
        
        mostrarToast(mensajeFinal, desviacion > 15 ? 'error' : (desviacion < -10 ? 'success' : 'info'));
    }
}

// ============================================
// SPRINT BURNDOWN
// ============================================

function renderizarBurndown() {
    // Asegurar que proyecto.scrum existe
    if (!proyecto.scrum) {
        console.log(" proyecto.scrum no existe");
        return;
    }
    
    const sprintActivo = proyecto.scrum.sprintActivo;
    const burndownBody = document.getElementById('burndownBody');
    const burndownCanvas = document.getElementById('burndownChartCanvas');
    
    if (!sprintActivo || !sprintActivo.registroDiario) {
        if (burndownBody) {
            burndownBody.innerHTML = '<tr><td colspan="4" class="u-text-center">No hay sprint activo. Inicia un sprint para ver el burndown. </td></tr>';
        }
        if (burndownCanvas && window.burndownChartGlobal) {
            window.burndownChartGlobal.destroy();
            window.burndownChartGlobal = null;
        }
        return;
    }
    
    // Actualizar tabla de datos diarios
    if (burndownBody) {
        burndownBody.innerHTML = sprintActivo.registroDiario.map((r, idx) => `
            <tr>
                <td>Día ${r.dia} (${r.fecha || '-'})</td>
                <td>${r.puntosRestantes || 0}</td>
                <td style="background: rgba(0,168,89,0.15);">
                    <input type="number" id="puntosDia_${idx}" value="${r.puntosCompletadosHoy || 0}" min="0" style="width: 80px; background: rgba(255,255,255,0.1); border-radius: 6px; color: white;">
                 </td>
                <td><button class="btn btn-secondary btn-small" onclick="guardarAvanceDia(${idx})">Guardar</button></td>
            </tr>
        `).join('');
    }
    
    // Dibujar gráfico
    if (burndownCanvas) {
        const ctx = burndownCanvas.getContext('2d');
        if (!ctx) return;
        
        // Destruir gráfico anterior
        if (window.burndownChartGlobal) {
            window.burndownChartGlobal.destroy();
        }
        
        const dias = sprintActivo.registroDiario.map(r => `Día ${r.dia}`);
        const idealData = [];
        const puntosIniciales = sprintActivo.puntosPlanificados || 0;
        
        for (let i = 0; i <= sprintActivo.duracion; i++) {
            idealData.push(Math.max(0, puntosIniciales * (1 - i / sprintActivo.duracion)));
        }
        
        const realData = sprintActivo.registroDiario.map(r => r.puntosRestantes || puntosIniciales);
        
        window.burndownChartGlobal = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dias,
                datasets: [
                    {
                        label: 'Ideal',
                        data: idealData.slice(0, realData.length),
                        borderColor: '#007AFF',
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0
                    },
                    {
                        label: 'Real',
                        data: realData,
                        borderColor: '#FF3B30',
                        backgroundColor: 'rgba(255,59,48,0.1)',
                        fill: true,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.raw} puntos`
                        }
                    }
                },
                scales: {
                    y: {
                        title: { display: true, text: 'Puntos Restantes', color: '#888' },
                        min: 0
                    },
                    x: {
                        title: { display: true, text: 'Días del Sprint', color: '#888' }
                    }
                }
            }
        });
    }
}

function guardarAvanceDia(diaIndex) {
    const sprintActivo = proyecto.scrum.sprintActivo;
    if (!sprintActivo) return;
    
    const puntosCompletados = parseInt(document.getElementById(`puntosDia_${diaIndex}`).value) || 0;
    const registro = sprintActivo.registroDiario[diaIndex];
    
    registro.puntosCompletadosHoy = puntosCompletados;
    
    // Recalcular puntos restantes
    let puntosAcumulados = 0;
    for (let i = 0; i < sprintActivo.registroDiario.length; i++) {
        puntosAcumulados += sprintActivo.registroDiario[i].puntosCompletadosHoy || 0;
        sprintActivo.registroDiario[i].puntosRestantes = Math.max(0, sprintActivo.puntosPlanificados - puntosAcumulados);
    }
    
    guardarProyecto();
    renderizarBurndown();  // Refrescar el gráfico
    renderizarSprintBacklog();  // Actualizar progreso del sprint
    mostrarToast(" Avance diario registrado", 'success');
}

function registrarAvanceDiario() {
    const sprintActivo = proyecto.scrum.sprintActivo;
    if (!sprintActivo) {
        mostrarToast(tApp('toast_sprint_no_activo'), 'warning');
        return;
    }
    
    const hoy = new Date().toISOString().split('T')[0];
    const puntos = prompt(` Puntos completados hoy (${hoy}):`, "0");
    
    if (puntos !== null && !isNaN(parseFloat(puntos))) {
        const diaActual = sprintActivo.registroDiario.length - 1;
        const registro = sprintActivo.registroDiario[diaActual];
        registro.puntosCompletadosHoy = parseFloat(puntos);
        
        let puntosAcumulados = 0;
        for (let i = 0; i < sprintActivo.registroDiario.length; i++) {
            puntosAcumulados += sprintActivo.registroDiario[i].puntosCompletadosHoy || 0;
            sprintActivo.registroDiario[i].puntosRestantes = Math.max(0, sprintActivo.puntosPlanificados - puntosAcumulados);
        }
        
        guardarProyecto();
        renderizarBurndown();
        renderizarSprintBacklog();
        mostrarToast(` Registrado: ${puntos} puntos completados`, 'success');
    }
}

function actualizarBurndown() {
    renderizarBurndown();
    mostrarToast(" Burndown actualizado", 'success');
}

function exportarBurndown() {
    const sprintActivo = proyecto.scrum.sprintActivo;
    if (!sprintActivo) {
        mostrarToast("No hay sprint activo", 'warning');
        return;
    }
    
    let csv = "Día,Fecha,Puntos Planificados Restantes,Puntos Completados Hoy,Puntos Restantes\n";
    sprintActivo.registroDiario.forEach(r => {
        const puntosIdeales = Math.max(0, sprintActivo.puntosPlanificados * (1 - r.dia / sprintActivo.duracion));
        csv += `${r.dia},${r.fecha || '-'},${puntosIdeales},${r.puntosCompletadosHoy || 0},${r.puntosRestantes || 0}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `burndown_${sprintActivo.nombre}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Burndown exportado", 'success');
}

// ============================================
// VELOCITY TRACKING
// ============================================

function renderizarVelocityTracking() {
    const sprintsCompletados = (proyecto.scrum.sprints || []).filter(s => s.estado === 'completado');
    
    let velocidadPromedio = 0;
    let mejorSprint = 0;
    let mejorSprintNum = '';
    let peorSprint = Infinity;
    let peorSprintNum = '';
    
    sprintsCompletados.forEach(s => {
        const velocidad = s.puntosCompletados || 0;
        velocidadPromedio += velocidad;
        if (velocidad > mejorSprint) {
            mejorSprint = velocidad;
            mejorSprintNum = s.nombre;
        }
        if (velocidad < peorSprint) {
            peorSprint = velocidad;
            peorSprintNum = s.nombre;
        }
    });
    
    velocidadPromedio = sprintsCompletados.length > 0 ? velocidadPromedio / sprintsCompletados.length : 0;
    peorSprint = peorSprint === Infinity ? 0 : peorSprint;
    
    if (document.getElementById('velocidadPromedio')) document.getElementById('velocidadPromedio').innerHTML = Math.round(velocidadPromedio);
    if (document.getElementById('mejorSprint')) document.getElementById('mejorSprint').innerHTML = mejorSprint;
    if (document.getElementById('mejorSprintNum')) document.getElementById('mejorSprintNum').innerHTML = mejorSprintNum;
    if (document.getElementById('peorSprint')) document.getElementById('peorSprint').innerHTML = peorSprint;
    if (document.getElementById('peorSprintNum')) document.getElementById('peorSprintNum').innerHTML = peorSprintNum;
    
    const ultimos3 = sprintsCompletados.slice(-3);
    const prediccion = ultimos3.length > 0 ? ultimos3.reduce((acc, s) => acc + (s.puntosCompletados || 0), 0) / ultimos3.length : velocidadPromedio;
    if (document.getElementById('prediccionProximoSprint')) document.getElementById('prediccionProximoSprint').innerHTML = Math.round(prediccion);
    
    const velocityCanvas = document.getElementById('velocityChartCanvas');
    if (velocityCanvas && sprintsCompletados.length > 0) {
        const ctx = velocityCanvas.getContext('2d');
        if (velocityChart) velocityChart.destroy();
        
        const labels = sprintsCompletados.map(s => s.nombre);
        const data = sprintsCompletados.map(s => s.puntosCompletados || 0);
        const planificados = sprintsCompletados.map(s => s.puntosPlanificados || 0);
        
        velocityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Puntos Planificados', data: planificados, backgroundColor: 'rgba(0,122,255,0.5)', borderRadius: 6 },
                    { label: 'Puntos Completados', data: data, backgroundColor: 'rgba(0,168,89,0.7)', borderRadius: 6 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw} puntos` } } },
                scales: { y: { title: { display: true, text: 'Puntos', color: 'white' }, beginAtZero: true } }
            }
        });
    }
    
    const historyBody = document.getElementById('velocityHistoryBody');
    if (historyBody) {
        if (sprintsCompletados.length === 0) {
            historyBody.innerHTML = '<tr><td colspan="7" class="u-text-center">No hay sprints completados</td></tr>';
        } else {
            historyBody.innerHTML = sprintsCompletados.map(s => {
                const eficiencia = s.puntosPlanificados > 0 ? ((s.puntosCompletados / s.puntosPlanificados) * 100).toFixed(1) : 0;
                return `<tr>
                    <td>${escapeHtml(s.nombre)}</td>
                    <td>${s.fechaInicio || '-'}</td>
                    <td>${s.fechaFinReal || s.fechaFin || '-'}</td>
                    <td>${s.puntosPlanificados || 0}</td>
                    <td>${s.puntosCompletados || 0}</td>
                    <td class="${s.puntosCompletados >= s.puntosPlanificados ? 'cashflow-positive' : 'cashflow-negative'}">${s.puntosCompletados || 0}</td>
                    <td class="${eficiencia >= 80 ? 'cashflow-positive' : (eficiencia >= 60 ? '' : 'cashflow-negative')}">${eficiencia}%</td>
                </tr>`;
            }).join('');
        }
    }
}

function calcularVelocidadHistorica() {
    const sprintsCompletados = (proyecto.scrum.sprints || []).filter(s => s.estado === 'completado');
    if (sprintsCompletados.length === 0) return 0;
    const suma = sprintsCompletados.reduce((acc, s) => acc + (s.puntosCompletados || 0), 0);
    return suma / sprintsCompletados.length;
}

function calcularVelocidadPromedio() {
    renderizarVelocityTracking();
    mostrarToast(" Velocidad promedio calculada", 'success');
}

function exportarVelocity() {
    const sprints = proyecto.scrum.sprints || [];
    let csv = "Sprint,Fecha Inicio,Fecha Fin,Puntos Planificados,Puntos Completados,Velocidad,Eficiencia\n";
    sprints.filter(s => s.estado === 'completado').forEach(s => {
        const eficiencia = s.puntosPlanificados > 0 ? ((s.puntosCompletados / s.puntosPlanificados) * 100).toFixed(1) : 0;
        csv += `"${s.nombre}",${s.fechaInicio || '-'},${s.fechaFinReal || s.fechaFin || '-'},${s.puntosPlanificados || 0},${s.puntosCompletados || 0},${s.puntosCompletados || 0},${eficiencia}%\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `velocity_${proyecto.nombre}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Velocidad exportada", 'success');
}

// ============================================
// RETROSPECTIVES
// ============================================

function renderizarRetrospectives() {
    const retrospectivas = proyecto.scrum.retrospectivas || [];
    
    const totalBien = retrospectivas.reduce((acc, r) => acc + (r.bien?.length || 0), 0);
    const totalMejorar = retrospectivas.reduce((acc, r) => acc + (r.mejorar?.length || 0), 0);
    const totalAcciones = retrospectivas.reduce((acc, r) => acc + (r.acciones?.length || 0), 0);
    const totalAccionesCompletadas = retrospectivas.reduce((acc, r) => acc + (r.acciones?.filter(a => a.completada).length || 0), 0);
    
    if (document.getElementById('totalBien')) document.getElementById('totalBien').innerHTML = totalBien;
    if (document.getElementById('totalMejorar')) document.getElementById('totalMejorar').innerHTML = totalMejorar;
    if (document.getElementById('totalAcciones')) document.getElementById('totalAcciones').innerHTML = totalAcciones;
    if (document.getElementById('totalAccionesCompletadas')) document.getElementById('totalAccionesCompletadas').innerHTML = totalAccionesCompletadas;
    
    const container = document.getElementById('retrospectivesList');
    if (container) {
        if (retrospectivas.length === 0) {
            container.innerHTML = '<div class="info-card u-text-center">No hay retrospectivas registradas. Completa un sprint y añade una retrospectiva.</div>';
        } else {
            container.innerHTML = retrospectivas.map(r => `
                <div class="info-card">
                    <div class="u-flex-jc-sb">
                        <h4> ${escapeHtml(r.sprintNombre || 'Retrospectiva')}</h4>
                        <span class="delete-btn" onclick="eliminarRetrospectiva(${r.id})"></span>
                    </div>
                    <div class="details u-mt-8">
                        <div><strong> Fecha:</strong> ${r.fecha || '-'}</div>
                        <div><strong> Asistentes:</strong> ${escapeHtml(r.asistentes?.join(', ') || '-')}</div>
                    </div>
                    <div class="u-mt-12">
                        <div><strong class="u-color-success"> Lo que salió bien:</strong></div>
                        <ul class="u-ml-20 u-fs-12">${(r.bien || []).map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
                    </div>
                    <div class="u-mt-8">
                        <div><strong style="color: #FF8C00;"> Cosas a mejorar:</strong></div>
                        <ul class="u-ml-20 u-fs-12">${(r.mejorar || []).map(m => `<li>${escapeHtml(m)}</li>`).join('')}</ul>
                    </div>
                    <div class="u-mt-8">
                        <div><strong class="u-color-primary"> Acciones comprometidas:</strong></div>
                        <ul class="u-ml-20 u-fs-12">
                            ${(r.acciones || []).map(a => `<li><input type="checkbox" ${a.completada ? 'checked' : ''} onchange="toggleAccionRetrospectiva(${r.id}, '${a.id}')"> ${escapeHtml(a.descripcion)} <span class="u-fs-10">(Responsable: ${escapeHtml(a.responsable)})</span></li>`).join('')}
                        </ul>
                    </div>
                    <div style="margin-top: 12px; font-size: 11px; color: rgba(255,255,255,0.4);"> Valoración del sprint: ${r.valoracion || '-'}/5</div>
                </div>
            `).join('');
        }
    }
}

function abrirModalRetrospectiva() {
    const sprints = (proyecto.scrum.sprints || []).filter(s => s.estado === 'completado');
    const sprintsSinRetro = sprints.filter(s => !proyecto.scrum.retrospectivas?.some(r => r.sprintId === s.id));
    
    const modalHtml = `
        <div class="modal-content" style="max-width: 650px;">
            <div class="modal-header">
                <h3> Nueva Sprint Retrospective</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <div class="form-group">
                <label>Sprint</label>
                <select id="retroSprintId">
                    <option value="">-- Seleccionar sprint --</option>
                    ${sprintsSinRetro.map(s => `<option value="${s.id}">${escapeHtml(s.nombre)} (${s.fechaInicio} → ${s.fechaFin})</option>`).join('')}
                    ${sprintsSinRetro.length === 0 ? '<option disabled>No hay sprints completados sin retrospectiva</option>' : ''}
                </select>
            </div>
            <div class="form-group">
                <label> Asistentes</label>
                <input type="text" id="retroAsistentes" placeholder="Nombres separados por coma">
            </div>
            <div class="form-group">
                <label> ¿Qué salió bien? (una por línea)</label>
                <textarea rows="3" id="retroBien" placeholder="Ej:\n- Cumplimos con el objetivo del sprint\n- Buena comunicación en el equipo"></textarea>
            </div>
            <div class="form-group">
                <label> ¿Qué podemos mejorar? (una por línea)</label>
                <textarea rows="3" id="retroMejorar" placeholder="Ej:\n- Las daily meetings son muy largas\n- Mejorar la gestión de dependencias"></textarea>
            </div>
            <div class="form-group">
                <label> Acciones concretas (una por línea con responsable)</label>
                <textarea rows="3" id="retroAcciones" placeholder="Ej:\n- Limitar daily a 15 minutos: Scrum Master\n- Crear documento de dependencias: Equipo"></textarea>
            </div>
            <div class="form-group">
                <label> Valoración del sprint (1-5)</label>
                <input type="range" id="retroValoracion" min="1" max="5" step="0.5" value="3.5" oninput="document.getElementById('valoracionPreview').innerText=this.value">
                <div class="u-text-center"><span id="valoracionPreview">3.5</span> / 5.0</div>
            </div>
            <button class="btn btn-primary" onclick="guardarRetrospectiva()">Guardar Retrospectiva</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function guardarRetrospectiva() {
    const sprintId = document.getElementById('retroSprintId').value;
    if (!sprintId) {
        mostrarToast(" Selecciona un sprint", 'error');
        return;
    }
    
    const sprint = proyecto.scrum.sprints.find(s => s.id == sprintId);
    
    const bien = document.getElementById('retroBien').value.split('\n').filter(l => l.trim().length > 0);
    const mejorar = document.getElementById('retroMejorar').value.split('\n').filter(l => l.trim().length > 0);
    const accionesLines = document.getElementById('retroAcciones').value.split('\n').filter(l => l.trim().length > 0);
    
    const acciones = accionesLines.map(line => {
        const partes = line.split(':');
        return {
            id: Date.now() + Math.random(),
            descripcion: partes[0]?.trim() || line,
            responsable: partes[1]?.trim() || 'Equipo',
            completada: false,
            fechaCreacion: new Date().toISOString()
        };
    });
    
    const nuevaRetro = {
        id: Date.now(),
        sprintId: parseInt(sprintId),
        sprintNombre: sprint?.nombre || 'Sprint ' + sprintId,
        fecha: new Date().toISOString().split('T')[0],
        asistentes: document.getElementById('retroAsistentes').value.split(',').map(a => a.trim()),
        bien: bien,
        mejorar: mejorar,
        acciones: acciones,
        valoracion: parseFloat(document.getElementById('retroValoracion').value)
    };
    
    if (!proyecto.scrum.retrospectivas) proyecto.scrum.retrospectivas = [];
    proyecto.scrum.retrospectivas.push(nuevaRetro);
    
    guardarProyecto();
    renderizarRetrospectives();
    sincronizarConPanelSalud();
    cerrarModalGeneric();
    mostrarToast(` Retrospectiva guardada para ${nuevaRetro.sprintNombre}`, 'success');
}

function toggleAccionRetrospectiva(retroId, accionId) {
    const retro = proyecto.scrum.retrospectivas.find(r => r.id === retroId);
    if (retro) {
        const accion = retro.acciones.find(a => a.id === accionId);
        if (accion) {
            accion.completada = !accion.completada;
            guardarProyecto();
            renderizarRetrospectives();
            mostrarToast(accion.completada ? " Acción marcada como completada" : " Acción reactivada", 'success');
        }
    }
}

function eliminarRetrospectiva(id) {
    if (confirm(tApp('confirmar_eliminar_retrospectiva'))) {
        proyecto.scrum.retrospectivas = proyecto.scrum.retrospectivas.filter(r => r.id !== id);
        guardarProyecto();
        renderizarRetrospectives();
        mostrarToast(tApp('toast_retrospectiva_eliminada'), 'success');
    }
}

// ============================================
// AGILE METRICS
// ============================================

function actualizarAgileMetrics() {
    const historias = proyecto.scrum.historias || [];
    const historiasCompletadas = historias.filter(h => h.estado === 'done');
    
    // Calcular Lead Time (desde creación hasta completado)
    let leadTimes = [];
    historiasCompletadas.forEach(h => {
        if (h.fechaCreacion && h.fechaCompletado) {
            const leadTime = Math.ceil((new Date(h.fechaCompletado) - new Date(h.fechaCreacion)) / (1000 * 60 * 60 * 24));
            leadTimes.push(leadTime);
            // Guardar en la historia para referencia
            h.leadTime = leadTime;
        }
    });
    
    // Calcular Cycle Time (desde inicio hasta completado)
    let cycleTimes = [];
    historiasCompletadas.forEach(h => {
        if (h.fechaInicio && h.fechaCompletado) {
            const cycleTime = Math.ceil((new Date(h.fechaCompletado) - new Date(h.fechaInicio)) / (1000 * 60 * 60 * 24));
            cycleTimes.push(cycleTime);
            h.cycleTime = cycleTime;
        }
    });
    
    // Guardar métricas en scrum.metricas
    if (!proyecto.scrum.metricas) proyecto.scrum.metricas = {};
    proyecto.scrum.metricas.leadTime = leadTimes;
    proyecto.scrum.metricas.cycleTime = cycleTimes;
    
    // Calcular promedios
    const leadTimePromedio = leadTimes.length > 0 ? leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length : 0;
    const cycleTimePromedio = cycleTimes.length > 0 ? cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length : 0;
    
    // Actualizar DOM
    const leadTimeElem = document.getElementById('leadTime');
    if (leadTimeElem) leadTimeElem.innerHTML = leadTimePromedio.toFixed(1);
    
    const cycleTimeElem = document.getElementById('cycleTime');
    if (cycleTimeElem) cycleTimeElem.innerHTML = cycleTimePromedio.toFixed(1);
    
    // Calcular Throughput (historias por sprint)
    const sprints = proyecto.scrum.sprints || [];
    const throughputs = [];
    sprints.forEach(s => {
        const historiasSprint = historias.filter(h => h.sprintId === s.id && h.estado === 'done').length;
        throughputs.push(historiasSprint);
    });
    const throughputPromedio = throughputs.length > 0 ? throughputs.reduce((a, b) => a + b, 0) / throughputs.length : 0;
    
    const throughputElem = document.getElementById('throughput');
    if (throughputElem) throughputElem.innerHTML = throughputPromedio.toFixed(1);
    
    // Calcular Predictibilidad
    let predictibilidadTotal = 0;
    let sprintsValidos = 0;
    sprints.forEach(s => {
        if (s.puntosPlanificados > 0 && s.puntosCompletados !== undefined) {
            const cumplimiento = Math.min(100, (s.puntosCompletados / s.puntosPlanificados) * 100);
            predictibilidadTotal += cumplimiento;
            sprintsValidos++;
        }
    });
    const predictibilidad = sprintsValidos > 0 ? predictibilidadTotal / sprintsValidos : 0;
    
    const predictibilidadElem = document.getElementById('predictibilidad');
    if (predictibilidadElem) predictibilidadElem.innerHTML = Math.round(predictibilidad) + '%';
    
    guardarProyecto();
    mostrarToast(" Métricas ágiles actualizadas", 'success');
}

function exportarAgileMetrics() {
    const sprints = (proyecto.scrum.sprints || []).filter(s => s.estado === 'completado');
    let csv = "Sprint,Historias,Puntos Planificados,Puntos Completados,Velocidad,Lead Time (días),Cycle Time (días),Throughput,Predictibilidad\n";
    
    sprints.forEach(s => {
        const historiasSprint = (proyecto.scrum.historias || []).filter(h => h.sprintId === s.id);
        const leadTimeProm = historiasSprint.filter(h => h.cycleTime).reduce((acc, h) => acc + (h.cycleTime || 0), 0) / (historiasSprint.filter(h => h.cycleTime).length || 1);
        const predictibilidad = s.puntosPlanificados > 0 ? ((s.puntosCompletados / s.puntosPlanificados) * 100).toFixed(1) : 0;
        
        csv += `"${s.nombre}",${historiasSprint.length},${s.puntosPlanificados || 0},${s.puntosCompletados || 0},${s.puntosCompletados || 0},${leadTimeProm.toFixed(1)},${leadTimeProm.toFixed(1)},${historiasSprint.filter(h => h.estado === 'done').length},${predictibilidad}%\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `agile_metrics_${proyecto.nombre}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Métricas ágiles exportadas", 'success');
}
// ============================================
// CONTROL DE GASTOS EN PROYECTOS ÁGILES (PMBOK 8)
// ============================================

function calcularCostesPorSprint() {
    console.log(" calcularCostesPorSprint() ejecutándose...");
    
    if (!proyecto.scrum) {
        console.log("No hay datos Scrum");
        return [];
    }
    
    const sprints = proyecto.scrum.sprints || [];
    const historias = proyecto.scrum.historias || [];
    const materiales = proyecto.materiales || [];
    const servicios = proyecto.servicios || [];
    const equipo = proyecto.equipo || [];
    
    console.log(` Procesando ${sprints.length} sprints...`);
    
    let costeTotalProyecto = 0;
    let costesPorSprint = [];
    
    sprints.forEach(sprint => {
        // 1. Coste de materiales asociados a este sprint
        let costeMaterialesSprint = 0;
        materiales.forEach(m => {
            if (m.sprint == sprint.numero || m.sprintAsociado == sprint.id) {
                const coste = convertirMoneda(m.cantidad * m.costeUnitario, m.moneda);
                costeMaterialesSprint += coste;
                console.log(` Material "${m.nombre}" (Sprint ${sprint.numero}): +${formatearMoneda(coste)}`);
            }
        });
        
        // 2. Coste de servicios asociados a este sprint
        let costeServiciosSprint = 0;
        servicios.forEach(s => {
            if (s.sprint == sprint.numero || s.sprintAsociado == sprint.id) {
                const coste = convertirMoneda(s.cantidad * s.costeUnitario, s.moneda);
                costeServiciosSprint += coste;
                console.log(` Servicio "${s.nombre}" (Sprint ${sprint.numero}): +${formatearMoneda(coste)}`);
            }
        });
        
        // 3. Coste de horas de equipo (basado en días reales del sprint)
        let costeEquipoSprint = 0;
        // Obtener historias completadas en este sprint
        const historiasSprint = historias.filter(h => h.sprintId === sprint.id);
        const historiasCompletadas = historiasSprint.filter(h => h.estado === 'done');
        
        historiasCompletadas.forEach(historia => {
            if (historia.recursoAsignado) {
                // Usar días reales de la historia si existen, si no usar días estimados
                const dias = historia.diasReales || historia.diasEstimados || 5;
                const horasPorDia = historia.horasPorDia || 8;
                const horasTotales = dias * horasPorDia;
                const coste = horasTotales * historia.recursoAsignado.costeHora;
                costeEquipoSprint += convertirMoneda(coste, historia.recursoAsignado.moneda);
                console.log(` Historia "${historia.titulo}": ${dias}d × ${horasPorDia}h × ${historia.recursoAsignado.costeHora}${historia.recursoAsignado.moneda} = ${formatearMoneda(coste)}`);
            }
        });
        
        // 4. Calcular puntos completados
        const puntosCompletados = historiasCompletadas.reduce((acc, h) => acc + (h.puntos || 0), 0);
        
        const costeTotalSprint = costeMaterialesSprint + costeServiciosSprint + costeEquipoSprint;
        const costePorPunto = puntosCompletados > 0 ? costeTotalSprint / puntosCompletados : 0;
        
        // Usar el coste planificado guardado en el sprint (o calcularlo)
        let costePlanificado = sprint.costes?.planificado || 0;
        if (costePlanificado === 0) {
            // Calcular coste planificado desde las historias estimadas
            historiasSprint.forEach(historia => {
                if (historia.costeEstimado) {
                    costePlanificado += historia.costeEstimado;
                }
            });
        }
        
        const desviacion = costePlanificado > 0 ? 
            ((costeTotalSprint - costePlanificado) / costePlanificado) * 100 : 0;
        
        costesPorSprint.push({
            id: sprint.id,
            numero: sprint.numero || sprint.id,
            nombre: sprint.nombre,
            puntos: puntosCompletados,
            costePlanificado: costePlanificado,
            costeReal: costeTotalSprint,
            desviacion: desviacion,
            costePorPunto: costePorPunto,
            estado: desviacion > 15 ? ' Sobrecoste' : (desviacion < -10 ? ' Ahorro' : ' Controlado')
        });
        
        costeTotalProyecto += costeTotalSprint;
        
        // Guardar costes en el sprint
        if (!sprint.costes) sprint.costes = {};
        sprint.costes.real = costeTotalSprint;
        sprint.costes.planificado = costePlanificado;
        sprint.costes.desviacion = desviacion;
        sprint.costes.puntos = puntosCompletados;
        sprint.costes.costePorPunto = costePorPunto;
    });
    
    guardarProyecto();
    
    // ============================================
    // ACTUALIZAR DOM DEL PANEL DE CONTROL DE GASTOS
    // ============================================
    
    // Calcular métricas globales
    const sprintsConDatos = costesPorSprint.filter(s => s.costeReal > 0);
    const costeMedioSprint = sprintsConDatos.length > 0 ? 
        costesPorSprint.reduce((acc, s) => acc + s.costeReal, 0) / sprintsConDatos.length : 0;
    
    const puntosTotales = costesPorSprint.reduce((acc, s) => acc + s.puntos, 0);
    const costePorPuntoGlobal = puntosTotales > 0 ? costeTotalProyecto / puntosTotales : 0;
    
    // Calcular Burn Rate
    let burnRate = 0;
    const sprintsOrdenados = [...sprints].sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
    if (sprintsOrdenados.length > 0) {
        const primerSprint = sprintsOrdenados[0];
        const ultimoSprint = sprintsOrdenados[sprintsOrdenados.length - 1];
        if (primerSprint?.fechaInicio && ultimoSprint?.fechaFin) {
            const inicio = new Date(primerSprint.fechaInicio);
            const fin = new Date(ultimoSprint.fechaFin);
            const diasTotales = Math.max(1, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)));
            burnRate = costeTotalProyecto / diasTotales;
        }
    }
    
    // Actualizar tarjetas de resumen
    const agileCosteTotal = document.getElementById('agileCosteTotal');
    if (agileCosteTotal) {
        agileCosteTotal.innerHTML = formatearMoneda(costeTotalProyecto);
        
        const costeMedioElem = document.getElementById('agileCosteMedioSprint');
        if (costeMedioElem) costeMedioElem.innerHTML = formatearMoneda(costeMedioSprint);
        
        const costePorPuntoElem = document.getElementById('agileCostePorPunto');
        if (costePorPuntoElem) costePorPuntoElem.innerHTML = formatearMoneda(costePorPuntoGlobal);
        
        const burnRateElem = document.getElementById('agileBurnRate');
        if (burnRateElem) burnRateElem.innerHTML = formatearMoneda(burnRate) + '/día';
        
        // Renderizar tabla de costes por sprint
        const tbody = document.getElementById('costesSprintBody');
        if (tbody) {
            if (costesPorSprint.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="u-text-center">No hay sprints completados</td></tr>';
            } else {
                tbody.innerHTML = costesPorSprint.map(s => {
                    let desviacionColor = '';
                    let desviacionIcono = '';
                    if (s.desviacion > 15) {
                        desviacionColor = '#FF3B30';
                        desviacionIcono = '';
                    } else if (s.desviacion > 5) {
                        desviacionColor = '#FF8C00';
                        desviacionIcono = '';
                    } else if (s.desviacion < -10) {
                        desviacionColor = '#00A859';
                        desviacionIcono = '';
                    } else {
                        desviacionColor = '#007AFF';
                        desviacionIcono = '';
                    }
                    
                    return `
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <td class="u-p-8"><strong>${escapeHtml(s.nombre)}</strong></td>
                            <td class="u-p-8">${s.puntos} pts</td>
                            <td class="u-p-8">${formatearMoneda(s.costePlanificado)}</td>
                            <td style="padding: 8px; background: ${s.desviacion > 15 ? 'rgba(255,59,48,0.2)' : (s.desviacion < -10 ? 'rgba(0,168,89,0.2)' : 'transparent')}">
                                ${formatearMoneda(s.costeReal)}
                            </td>
                            <td style="padding: 8px; color: ${desviacionColor}; font-weight: bold;">
                                ${desviacionIcono} ${s.desviacion > 0 ? '+' : ''}${s.desviacion.toFixed(1)}%
                            </td>
                            <td class="u-p-8">${formatearMoneda(s.costePorPunto)}/punto</td>
                            <td class="u-p-8">${s.estado}</td>
                        </tr>
                    `;
                }).join('');
            }
        }
        
        // Generar alertas
        const alertas = costesPorSprint.filter(s => Math.abs(s.desviacion) > 15);
        const alertasContainer = document.getElementById('alertasCostesContent');
        if (alertasContainer) {
            if (alertas.length > 0) {
                alertasContainer.innerHTML = alertas.map(a => `
                    <div style="padding: 10px; margin: 8px 0; background: rgba(255,59,48,0.15); border-radius: 8px; border-left: 3px solid #FF3B30;">
                         <strong>${escapeHtml(a.nombre)}</strong>: Desviación del ${a.desviacion.toFixed(1)}% 
                        (${formatearMoneda(Math.abs(a.costeReal - a.costePlanificado))})
                        <br><small> Revisar: ${a.costeReal > a.costePlanificado ? 'gastos excesivos' : 'posible infraejecución'}</small>
                    </div>
                `).join('');
            } else {
                alertasContainer.innerHTML = '<div style="padding: 10px; color: #00A859;"> Todas las desviaciones están dentro del margen aceptable (±15%)</div>';
            }
        }
        
        // Dibujar gráfico
        dibujarGraficoCostesAgile(costesPorSprint);
        
        console.log(" Panel de Control de Gastos Ágil actualizado");
    }
    
    return costesPorSprint;
}
// ============================================
// FUNCIÓN PARA CALCULAR SALUD FINANCIERA ÁGIL
// ============================================

function calcularSaludFinancieraAgil() {
    if (!proyecto.scrum || !proyecto.scrum.sprints) {
        return { spi: 1, cpi: 1, eac: 0, tendencia: 'neutral' };
    }
    
    const sprints = proyecto.scrum.sprints.filter(s => s.estado === 'completado');
    if (sprints.length === 0) {
        return { spi: 1, cpi: 1, eac: 0, tendencia: 'neutral' };
    }
    
    // Calcular SPI (Schedule Performance Index) basado en velocidad
    let totalPuntosPlanificados = 0;
    let totalPuntosCompletados = 0;
    let totalCostePlanificado = 0;
    let totalCosteReal = 0;
    
    sprints.forEach(sprint => {
        totalPuntosPlanificados += sprint.puntosPlanificados || 0;
        totalPuntosCompletados += sprint.puntosCompletados || 0;
        totalCostePlanificado += sprint.costes?.planificado || 0;
        totalCosteReal += sprint.costes?.real || 0;
    });
    
    // SPI basado en puntos (velocidad)
    const spi = totalPuntosPlanificados > 0 ? totalPuntosCompletados / totalPuntosPlanificados : 1;
    
    // CPI basado en costes
    const cpi = totalCostePlanificado > 0 ? totalCostePlanificado / totalCosteReal : 1;
    
    // EAC (Estimate at Completion) = Presupuesto total / CPI
    const presupuestoTotal = proyecto.precioVenta || totalCostePlanificado;
    const eac = cpi > 0 ? presupuestoTotal / cpi : presupuestoTotal;
    
    // Tendencia
    let tendencia = 'neutral';
    if (sprints.length >= 2) {
        const ultimoSprint = sprints[sprints.length - 1];
        const anteriorSprint = sprints[sprints.length - 2];
        const mejoraVelocidad = (ultimoSprint.puntosCompletados || 0) - (anteriorSprint.puntosCompletados || 0);
        if (mejoraVelocidad > 0) tendencia = 'mejorando';
        else if (mejoraVelocidad < 0) tendencia = 'empeorando';
    }
    
    return { spi, cpi, eac, tendencia, totalCosteReal, totalCostePlanificado };
}

function dibujarGraficoCostesAgile(costesPorSprint) {
    const canvas = document.getElementById('agileCostEvolutionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (window.agileCostChart) window.agileCostChart.destroy();
    
    const labels = costesPorSprint.map(s => s.nombre);
    const planificados = costesPorSprint.map(s => s.costePlanificado);
    const reales = costesPorSprint.map(s => s.costeReal);
    
    window.agileCostChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Coste Planificado',
                    data: planificados,
                    backgroundColor: 'rgba(0,122,255,0.6)',
                    borderRadius: 6,
                    borderWidth: 0
                },
                {
                    label: 'Coste Real',
                    data: reales,
                    backgroundColor: 'rgba(255,59,48,0.7)',
                    borderRadius: 6,
                    borderWidth: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.dataset.label}: ${formatearMoneda(context.raw)}`
                    }
                },
                legend: {
                    position: 'top',
                    labels: { color: '#888' }
                }
            },
            scales: {
                y: {
                    title: { display: true, text: 'Coste (€)', color: '#888' },
                    ticks: { 
                        callback: (v) => formatearMoneda(v),
                        color: '#888'
                    }
                },
                x: {
                    ticks: { color: '#888', rotation: 45 }
                }
            }
        }
    });
}

function actualizarCostesSprint() {
    calcularCostesPorSprint();
    mostrarToast(" Costes de sprints actualizados", 'success');
}

function exportarCostesAgile() {
    if (!proyecto.scrum) {
        mostrarToast("No hay datos Scrum para exportar", 'warning');
        return;
    }
    
    const sprints = proyecto.scrum.sprints || [];
    let csv = "Sprint,Puntos,Coste Planificado (€),Coste Real (€),Desviación (%),Coste por Punto (€),Estado\n";
    
    sprints.forEach(s => {
        const costes = s.costes || {};
        const historiasSprint = (proyecto.scrum?.historias || []).filter(h => h.sprintId === s.id);
        const puntos = historiasSprint.filter(h => h.estado === 'done').reduce((acc, h) => acc + (h.puntos || 0), 0);
        const desviacion = costes.planificado ? ((costes.real - costes.planificado) / costes.planificado * 100).toFixed(1) : 0;
        const costePorPunto = puntos > 0 ? (costes.real / puntos).toFixed(2) : 0;
        const estado = desviacion > 15 ? 'Sobrecoste' : (desviacion < -10 ? 'Ahorro' : 'Controlado');
        
        csv += `"${s.nombre}",${puntos},${costes.planificado || 0},${costes.real || 0},${desviacion}%,${costePorPunto},${estado}\n`;
    });
    
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `costes_agile_${proyecto.nombre}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Costes ágiles exportados a CSV", 'success');
}

function actualizarControlGastosAgile() {
    if (proyecto.metodologia?.tipo === 'agile' || proyecto.metodologia?.tipo === 'mixto') {
        calcularCostesPorSprint();
    }
}

// ============================================
// EXPORTAR HISTORIAS
// ============================================

function exportarHistorias() {
    const historias = proyecto.scrum.historias || [];
    let csv = "ID,Título,Descripción,Prioridad,Puntos,Estado,Asignado,Etiquetas,Fecha Creación,Fecha Completado\n";
    historias.forEach(h => {
        csv += `"${h.id}","${escapeHtmlCSV(h.titulo)}","${escapeHtmlCSV(h.descripcion || '')}","${h.prioridad}",${h.puntos || 0},"${h.estado}","${escapeHtmlCSV(h.asignado || '')}","${escapeHtmlCSV(h.etiquetas || '')}","${h.fechaCreacion?.split('T')[0] || '-'}","${h.fechaCompletado?.split('T')[0] || '-'}"\n`;
    });
    
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historias_${proyecto.nombre}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Historias exportadas a CSV", 'success');
}

function escapeHtmlCSV(str) {
    if (!str) return '';
    return str.replace(/"/g, '""');
}
// ============================================
// GESTIÓN DE SPRINTS - LISTADO, EDITAR, BORRAR
// ============================================

function renderizarListadoSprints() {
    // Asegurar que proyecto.scrum existe
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
        guardarProyecto();
    }
    
    const sprints = proyecto.scrum.sprints || [];
    const sprintActivo = proyecto.scrum.sprintActivo;
    
    // Calcular estadísticas
    const totalSprints = sprints.length + (sprintActivo ? 1 : 0);
    const activos = sprintActivo ? 1 : 0;
    const completados = sprints.filter(s => s.estado === 'completado').length;
    
    let sumaVelocidad = 0;
    let countVelocidad = 0;
    sprints.forEach(s => {
        if (s.estado === 'completado' && s.puntosCompletados > 0) {
            sumaVelocidad += s.puntosCompletados;
            countVelocidad++;
        }
    });
    const velocidadMedia = countVelocidad > 0 ? (sumaVelocidad / countVelocidad).toFixed(1) : 0;
    
    // Actualizar resumen
    const totalSprintsElem = document.getElementById('totalSprints');
    const totalSprintsActivosElem = document.getElementById('totalSprintsActivos');
    const totalSprintsCompletadosElem = document.getElementById('totalSprintsCompletados');
    const velocidadMediaSprintsElem = document.getElementById('velocidadMediaSprints');
    
    if (totalSprintsElem) totalSprintsElem.innerHTML = totalSprints;
    if (totalSprintsActivosElem) totalSprintsActivosElem.innerHTML = activos;
    if (totalSprintsCompletadosElem) totalSprintsCompletadosElem.innerHTML = completados;
    if (velocidadMediaSprintsElem) velocidadMediaSprintsElem.innerHTML = velocidadMedia;
    
    // Construir lista de todos los sprints
    const todosSprints = [];
    if (sprintActivo) {
        todosSprints.push({
            ...sprintActivo,
            esActivo: true,
            fechaFinMostrar: sprintActivo.fechaFin || '-',
            puntosPlanificadosMostrar: sprintActivo.puntosPlanificados || 0,
            puntosCompletadosMostrar: sprintActivo.puntosCompletados || 0,
            velocidadMostrar: sprintActivo.puntosCompletados || 0
        });
    }
    sprints.forEach(s => {
        if (s.estado === 'completado') {
            todosSprints.push({
                ...s,
                esActivo: false,
                fechaFinMostrar: s.fechaFinReal || s.fechaFin || '-',
                puntosPlanificadosMostrar: s.puntosPlanificados || 0,
                puntosCompletadosMostrar: s.puntosCompletados || 0,
                velocidadMostrar: s.puntosCompletados || 0
            });
        }
    });
    
    // Renderizar tabla
    const tbody = document.getElementById('sprintsListBody');
    if (!tbody) return;
    
    if (todosSprints.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="u-text-center">No hay sprints. Inicia un sprint para comenzar. </td></tr>';
        return;
    }
    
    tbody.innerHTML = todosSprints.map(s => {
        const eficiencia = s.puntosPlanificadosMostrar > 0 ? 
            ((s.puntosCompletadosMostrar / s.puntosPlanificadosMostrar) * 100).toFixed(1) : 0;
        const estadoBadge = s.esActivo ? 
            '<span class="badge-progreso"> ACTIVO</span>' : 
            '<span class="badge-completado"> COMPLETADO</span>';
        
        return `<tr>
            <td>#${s.id}</td>
            <td><strong>${escapeHtml(s.nombre || 'Sprint sin nombre')}</strong>${s.esActivo ? ' <span class="badge-progreso" style="font-size: 9px;">Actual</span>' : ''}</td>
            <td>${s.fechaInicio || '-'}</td>
            <td>${s.fechaFinMostrar}</td>
            <td>${estadoBadge}</td>
            <td>${s.puntosPlanificadosMostrar}</td>
            <td>${s.puntosCompletadosMostrar}</td>
            <td>${s.velocidadMostrar}</td>
            <td class="${eficiencia >= 80 ? 'cashflow-positive' : (eficiencia >= 60 ? '' : 'cashflow-negative')}">${eficiencia}%</td>
            <td>
                ${!s.esActivo ? `<button class="edit-btn" onclick="editarSprint(${s.id})"> Editar</button>` : ''}
                ${!s.esActivo ? `<button class="delete-btn" onclick="eliminarSprint(${s.id})"> Eliminar</button>` : '<span style="color: rgba(255,255,255,0.3);">No editable</span>'}
                <button class="btn btn-secondary btn-small" onclick="verDetalleSprint(${s.id})"> Ver</button>
            </td>
        </tr>`;
    }).join('');
}

function editarSprint(id) {
    const sprint = proyecto.scrum.sprints.find(s => s.id === id);
    if (!sprint || sprint.estado !== 'completado') {
        mostrarToast(" Solo se pueden editar sprints completados", 'error');
        return;
    }
    
    const modalHtml = `
        <div class="modal-content modal-500">
            <div class="modal-header">
                <h3> Editar Sprint: ${escapeHtml(sprint.nombre)}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="editSprintId" value="${sprint.id}">
            <div class="form-group">
                <label>Nombre del Sprint</label>
                <input type="text" id="editSprintNombre" value="${escapeHtml(sprint.nombre)}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Fecha inicio</label>
                    <input type="date" id="editSprintInicio" value="${sprint.fechaInicio || ''}">
                </div>
                <div class="form-group">
                    <label> Fecha fin</label>
                    <input type="date" id="editSprintFin" value="${sprint.fechaFinReal || sprint.fechaFin || ''}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label> Puntos planificados</label>
                    <input type="number" id="editSprintPlanificados" value="${sprint.puntosPlanificados || 0}">
                </div>
                <div class="form-group">
                    <label> Puntos completados</label>
                    <input type="number" id="editSprintCompletados" value="${sprint.puntosCompletados || 0}">
                </div>
            </div>
            <div class="info-card-modal">
                <p> Modificar los puntos afectará la velocidad histórica y las métricas ágiles.</p>
            </div>
            <button class="btn btn-primary" onclick="guardarEdicionSprint()">Guardar Cambios</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function guardarEdicionSprint() {
    const id = parseInt(document.getElementById('editSprintId').value);
    const sprint = proyecto.scrum.sprints.find(s => s.id === id);
    
    if (sprint) {
        sprint.nombre = document.getElementById('editSprintNombre').value;
        sprint.fechaInicio = document.getElementById('editSprintInicio').value;
        sprint.fechaFinReal = document.getElementById('editSprintFin').value;
        sprint.puntosPlanificados = parseInt(document.getElementById('editSprintPlanificados').value) || 0;
        sprint.puntosCompletados = parseInt(document.getElementById('editSprintCompletados').value) || 0;
        sprint.velocidad = sprint.puntosCompletados;
        
        guardarProyecto();
        renderizarListadoSprints();
        renderizarVelocityTracking();
        renderizarAgileMetrics();
        sincronizarConPanelSalud();
        cerrarModalGeneric();
        mostrarToast(` Sprint "${sprint.nombre}" actualizado`, 'success');
    }
}

function eliminarSprint(id) {
    const sprint = proyecto.scrum.sprints.find(s => s.id === id);
    if (!sprint) return;
    
    if (confirm(`¿Eliminar el sprint "${sprint.nombre}"?\n\nEsta acción también eliminará las historias asociadas a este sprint y no se puede deshacer.`)) {
        // Eliminar historias asociadas a este sprint
        if (proyecto.scrum.historias) {
            const historiasAEliminar = proyecto.scrum.historias.filter(h => h.sprintId === id);
            if (historiasAEliminar.length > 0) {
                if (confirm(`El sprint tiene ${historiasAEliminar.length} historia(s) asociada(s). ¿Eliminarlas también?`)) {
                    proyecto.scrum.historias = proyecto.scrum.historias.filter(h => h.sprintId !== id);
                } else {
                    // Reasignar historias al backlog
                    proyecto.scrum.historias.forEach(h => {
                        if (h.sprintId === id) {
                            h.sprintId = null;
                            h.estado = 'todo';
                        }
                    });
                }
            }
        }
        
        // Eliminar retrospectiva asociada
        if (proyecto.scrum.retrospectivas) {
            proyecto.scrum.retrospectivas = proyecto.scrum.retrospectivas.filter(r => r.sprintId !== id);
        }
        
        // Eliminar sprint
        proyecto.scrum.sprints = proyecto.scrum.sprints.filter(s => s.id !== id);
        
        guardarProyecto();
        renderizarListadoSprints();
        renderizarVelocityTracking();
        renderizarAgileMetrics();
        sincronizarConPanelSalud();
        mostrarToast(` Sprint "${sprint.nombre}" eliminado`, 'success');
    }
}

function verDetalleSprint(id) {
    const sprint = proyecto.scrum.sprints.find(s => s.id === id);
    if (!sprint) return;
    
    const historiasSprint = (proyecto.scrum.historias || []).filter(h => h.sprintId === id);
    const retrospectiva = (proyecto.scrum.retrospectivas || []).find(r => r.sprintId === id);
    
    const modalHtml = `
        <div class="modal-content modal-md">
            <div class="modal-header">
                <h3> Detalle del Sprint: ${escapeHtml(sprint.nombre)}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            
            <div class="info-card u-mb-16">
                <div><strong> Período:</strong> ${sprint.fechaInicio || '-'} → ${sprint.fechaFinReal || sprint.fechaFin || '-'}</div>
                <div><strong> Puntos:</strong> ${sprint.puntosCompletados || 0}/${sprint.puntosPlanificados || 0} (${sprint.puntosPlanificados > 0 ? ((sprint.puntosCompletados / sprint.puntosPlanificados) * 100).toFixed(1) : 0}%)</div>
                <div><strong> Velocidad:</strong> ${sprint.puntosCompletados || 0} pts</div>
                <div><strong> Eficiencia:</strong> ${sprint.puntosPlanificados > 0 ? ((sprint.puntosCompletados / sprint.puntosPlanificados) * 100).toFixed(1) : 0}%</div>
            </div>
            
            <div class="info-card u-mb-16">
                <h4> Historias en este sprint (${historiasSprint.length})</h4>
                ${historiasSprint.length > 0 ? `
                    <table class="data-table">
                        <thead><tr><th>Historia</th><th>Puntos</th><th>Estado</th></tr></thead>
                        <tbody>
                            ${historiasSprint.map(h => `
                                <tr>
                                    <td>${escapeHtml(h.titulo)}</td>
                                    <td>${h.puntos || 0}</td>
                                    <td class="${h.estado === 'done' ? 'cashflow-positive' : (h.estado === 'progress' ? '' : 'cashflow-negative')}">${h.estado === 'done' ? ' Completada' : (h.estado === 'progress' ? ' En progreso' : ' Pendiente')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p class="u-color-muted">No hay historias asociadas</p>'}
            </div>
            
            ${retrospectiva ? `
            <div class="info-card">
                <h4> Retrospectiva</h4>
                <div><strong> Fecha:</strong> ${retrospectiva.fecha || '-'}</div>
                <div><strong> Valoración:</strong> ${retrospectiva.valoracion || '-'}/5</div>
                <div><strong> Lo que salió bien:</strong><br>${(retrospectiva.bien || []).map(b => `• ${escapeHtml(b)}<br>`).join('')}</div>
                <div><strong> Cosas a mejorar:</strong><br>${(retrospectiva.mejorar || []).map(m => `• ${escapeHtml(m)}<br>`).join('')}</div>
            </div>
            ` : '<div class="info-card"><p class="u-color-muted">No hay retrospectiva registrada para este sprint.</p></div>'}
            
            <button class="btn btn-primary u-mt-16" onclick="cerrarModalGeneric()">Cerrar</button>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
}

function exportarSprints() {
    const sprints = proyecto.scrum.sprints || [];
    let csv = "ID,Nombre,Fecha Inicio,Fecha Fin,Estado,Puntos Planificados,Puntos Completados,Velocidad,Eficiencia\n";
    
    sprints.forEach(s => {
        const eficiencia = s.puntosPlanificados > 0 ? ((s.puntosCompletados / s.puntosPlanificados) * 100).toFixed(1) : 0;
        csv += `"${s.id}","${s.nombre}",${s.fechaInicio || '-'},${s.fechaFinReal || s.fechaFin || '-'},${s.estado},${s.puntosPlanificados || 0},${s.puntosCompletados || 0},${s.puntosCompletados || 0},${eficiencia}%\n`;
    });
    
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sprints_${proyecto.nombre}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(" Sprints exportados a CSV", 'success');
}
function reordenarNumeracionElementos() {
    if (!proyecto.elementosGantt) return;
    
    const elementos = proyecto.elementosGantt;
    
    // Función para obtener elementos hijos de un EDT
    function obtenerHijos(edtId, tipo = null) {
        return elementos.filter(e => e.dependeDe === edtId && (tipo === null || e.tipo === tipo));
    }
    
    // Función recursiva para asignar códigos
    function asignarCodigos(edtId, prefijo, nivel = 1) {
        const edt = elementos.find(e => e.id === edtId);
        if (edt) {
            edt.codigo = prefijo;
        }
        
        // Obtener EDTs hijos
        const edtHijos = obtenerHijos(edtId, 'edt');
        edtHijos.forEach((hijo, idx) => {
            asignarCodigos(hijo.id, `${prefijo}.${idx + 1}`, nivel + 1);
        });
        
        // Obtener actividades hijas
        const actividades = obtenerHijos(edtId, 'actividad');
        actividades.forEach((act, idx) => {
            act.codigo = `${prefijo}.${idx + 1}`;
        });
        
        // Obtener entregables hijos
        const entregables = obtenerHijos(edtId, 'entregable');
        entregables.forEach((ent, idx) => {
            ent.codigo = `${prefijo}.${idx + 1}`;
        });
        
        // Obtener hitos hijos
        const hitos = obtenerHijos(edtId, 'hito');
        hitos.forEach((hito, idx) => {
            hito.codigo = `H-${prefijo}.${idx + 1}`;
        });
    }
    
    // Encontrar EDTs raíz (sin dependeDe o que dependen de algo que no es EDT)
    const edtRaices = elementos.filter(e => 
        e.tipo === 'edt' && 
        (!e.dependeDe || !elementos.find(p => p.id === e.dependeDe && p.tipo === 'edt'))
    );
    
    // Asignar códigos a las EDTs raíz
    edtRaices.forEach((edt, idx) => {
        asignarCodigos(edt.id, `${idx + 1}`);
    });
    
    // Elementos sin EDT padre
    const elementosSinPadre = elementos.filter(e => 
        e.tipo !== 'edt' && 
        (!e.dependeDe || !elementos.find(p => p.id === e.dependeDe && p.tipo === 'edt'))
    );
    
    // Actividades sin EDT padre
    const actividadesSinPadre = elementosSinPadre.filter(e => e.tipo === 'actividad');
    actividadesSinPadre.forEach((act, idx) => {
        act.codigo = `${idx + 1}`;
    });
    
    // Entregables sin EDT padre
    const entregablesSinPadre = elementosSinPadre.filter(e => e.tipo === 'entregable');
    entregablesSinPadre.forEach((ent, idx) => {
        ent.codigo = `E-${idx + 1}`;
    });
    
    // Hitos sin EDT padre
    const hitosSinPadre = elementosSinPadre.filter(e => e.tipo === 'hito');
    hitosSinPadre.forEach((hito, idx) => {
        hito.codigo = `H-${idx + 1}`;
    });
    
    guardarProyecto();
    renderizarTablaGantt();
    renderizarGanttUnificado();
    mostrarToast(" Códigos jerárquicos reordenados", 'success');
}
// ============================================

// ============================================
// MODAL FLOTANTE PARA EDT - VERSIÓN CORREGIDA
// ============================================

// Declarar variables ANTES de usarlas
var edtPanelAbiertoGlobal = false;
var edtActualIdGlobal = null;

// ============================================
// PANEL EDT INTEGRADO EN EL CRONOGRAMA
// ============================================

var vistaActual = 'gantt'; // 'gantt' o 'edt'
var edtSeleccionadaId = null;

function abrirModalEDT(edtId) {
    console.log(" abrirModalEDT llamado con ID:", edtId);
    
    // Buscar la EDT
    var edt = null;
    if (proyecto && proyecto.elementosGantt) {
        for (var i = 0; i < proyecto.elementosGantt.length; i++) {
            if (proyecto.elementosGantt[i].id === edtId && proyecto.elementosGantt[i].tipo === 'edt') {
                edt = proyecto.elementosGantt[i];
                break;
            }
        }
    }
    
    if (!edt) {
        mostrarToast(" EDT no encontrada", 'error');
        return;
    }
    
    edtSeleccionadaId = edtId;
    vistaActual = 'edt';
    
    // Obtener elementos hijos
    var elementosHijos = [];
    for (var i = 0; i < (proyecto.elementosGantt || []).length; i++) {
        if (proyecto.elementosGantt[i].dependeDe === edtId) {
            elementosHijos.push(proyecto.elementosGantt[i]);
        }
    }
    
    // Separar por tipo
    var actividades = [];
    var entregables = [];
    var hitos = [];
    for (var i = 0; i < elementosHijos.length; i++) {
        var e = elementosHijos[i];
        if (e.tipo === 'actividad') actividades.push(e);
        else if (e.tipo === 'entregable') entregables.push(e);
        else if (e.tipo === 'hito') hitos.push(e);
    }
    
    // Calcular progreso
    var sumaProgreso = 0;
    var totalConProgreso = 0;
    for (var i = 0; i < elementosHijos.length; i++) {
        if (elementosHijos[i].tipo !== 'hito') {
            sumaProgreso += (elementosHijos[i].progreso || 0);
            totalConProgreso++;
        }
    }
    var progresoTotal = totalConProgreso > 0 ? (sumaProgreso / totalConProgreso) : 0;
    
    // Coste total
    var costeTotal = 0;
    for (var i = 0; i < elementosHijos.length; i++) {
        costeTotal += (elementosHijos[i].costeEstimado || 0);
    }
    
    // Código EDT
    var codigoEDT = edt.codigo || '';
    if (typeof obtenerCodigoElemento === 'function') {
        codigoEDT = obtenerCodigoElemento(edt, proyecto.elementosGantt) || codigoEDT;
    }
    
    // Generar HTML
    var html = renderizarVistaEDT(edt, actividades, entregables, hitos, progresoTotal, costeTotal, codigoEDT);
    
    // Reemplazar el contenido del contenedor de Gantt
    var ganttContainer = document.getElementById('ganttUnificadoContainer');
    var tablaContainer = document.getElementById('tablaElementosGanttBody');
    var botonesContainer = document.querySelector('#panelCronograma .panel-title:first-child');
    
    if (ganttContainer) {
        // Guardar el HTML original para volver
        window.ganttOriginalHTML = ganttContainer.innerHTML;
        
        // Mostrar vista EDT
        ganttContainer.innerHTML = html;
        ganttContainer.style.minHeight = '500px';
        
        // Ocultar tabla de elementos
        if (tablaContainer) tablaContainer.style.display = 'none';
        
        // Cambiar el título del panel
        if (botonesContainer) {
            var tituloOriginal = botonesContainer.querySelector('span');
            if (tituloOriginal && !window.tituloOriginalGuardado) {
                window.tituloOriginalGuardado = tituloOriginal.innerHTML;
                tituloOriginal.innerHTML = ` EDT: ${edt.nombre} ${codigoEDT ? `[${codigoEDT}]` : ''}`;
            }
        }
        
        // Mostrar botón de volver si no existe
        if (!document.getElementById('btnVolverGantt')) {
            var btnVolver = document.createElement('button');
            btnVolver.id = 'btnVolverGantt';
            btnVolver.className = 'btn btn-secondary btn-small';
            btnVolver.innerHTML = '← Volver al Gantt';
            btnVolver.style.marginLeft = '12px';
            btnVolver.onclick = volverAlGantt;
            if (botonesContainer) botonesContainer.appendChild(btnVolver);
        } else {
            document.getElementById('btnVolverGantt').style.display = 'inline-block';
        }
    }
}

function renderizarVistaEDT(edt, actividades, entregables, hitos, progresoTotal, costeTotal, codigoEDT) {
    
    function renderTarjeta(elemento) {
        var fechaFin = elemento.inicio ? sumarDias(elemento.inicio, elemento.duracion) : '-';
        var progreso = elemento.progreso || 0;
        var responsable = elemento.responsable || (elemento.recursoAsignado ? elemento.recursoAsignado.nombre : 'Sin asignar');
        
        var iconos = { actividad: '', entregable: '', hito: '' };
        var icono = iconos[elemento.tipo] || '';
        
        var barraColor = '#007AFF';
        if (progreso >= 80) barraColor = '#00A859';
        else if (progreso >= 50) barraColor = '#FF8C00';
        else if (progreso > 0) barraColor = '#FF3B30';
        
        return `
            <div class="edt-elemento-card" style="background: var(--bg-card); border-radius: 12px; padding: 12px; margin-bottom: 12px; border: 1px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div style="font-weight: 600; font-size: 13px;">
                        ${icono} ${escapeHtml(elemento.nombre)}
                        ${elemento.codigo ? `<span style="font-size: 9px; background: rgba(0,122,255,0.2); padding: 2px 6px; border-radius: 10px; margin-left: 6px;">${escapeHtml(elemento.codigo)}</span>` : ''}
                    </div>
                    <div style="display: flex; gap: 4px;">
                        <button onclick="editarElementoGantt(${elemento.id}); setTimeout(function(){ if(edtSeleccionadaId) abrirModalEDT(edtSeleccionadaId); }, 500);" class="u-btn-ghost" title="Editar"></button>
                        <button onclick="copiarElementoDesdeEDT(${elemento.id})" class="u-btn-ghost" title="Copiar"></button>
                        <button onclick="eliminarElementoDesdeEDT(${elemento.id})" class="u-btn-ghost" title="Eliminar"></button>
                    </div>
                </div>
                <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 8px;">
                     ${elemento.inicio || '-'} → ${fechaFin}
                </div>
                <div style="margin: 8px 0;">
                    <div style="background: var(--progress-bg); border-radius: 10px; height: 4px; overflow: hidden;">
                        <div style="width: ${progreso}%; height: 100%; background: ${barraColor};"></div>
                    </div>
                    <div style="font-size: 9px; margin-top: 4px;">${progreso}% completado</div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 10px; color: var(--text-muted);">
                    <span> ${escapeHtml(responsable)}</span>
                    ${elemento.costeEstimado > 0 ? `<span> ${formatearMoneda(elemento.costeEstimado)}</span>` : ''}
                </div>
            </div>
        `;
    }
    
    var actividadesHtml = '';
    for (var i = 0; i < actividades.length; i++) {
        actividadesHtml += renderTarjeta(actividades[i]);
    }
    if (actividades.length === 0) actividadesHtml = '<div class="u-empty-state"> No hay actividades</div>';
    
    var entregablesHtml = '';
    for (var i = 0; i < entregables.length; i++) {
        entregablesHtml += renderTarjeta(entregables[i]);
    }
    if (entregables.length === 0) entregablesHtml = '<div class="u-empty-state"> No hay entregables</div>';
    
    var hitosHtml = '';
    for (var i = 0; i < hitos.length; i++) {
        hitosHtml += renderTarjeta(hitos[i]);
    }
    if (hitos.length === 0) hitosHtml = '<div class="u-empty-state"> No hay hitos</div>';
    
    return `
        <div class="edt-view-container" style="padding: 16px;">
            <!-- Estadísticas -->
            <div style="display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap;">
                <div style="flex: 1; background: var(--bg-card); border-radius: 12px; padding: 12px; text-align: center; border: 1px solid var(--border-color);">
                    <div style="font-size: 22px; font-weight: 700;">${Math.round(progresoTotal)}%</div>
                    <div class="u-fs-10 u-color-muted">Progreso</div>
                    <div style="margin-top: 8px; background: rgba(255,255,255,0.1); border-radius: 10px; height: 4px; overflow: hidden;">
                        <div style="width: ${progresoTotal}%; height: 100%; background: #007AFF;"></div>
                    </div>
                </div>
                <div style="flex: 1; background: var(--bg-card); border-radius: 12px; padding: 12px; text-align: center; border: 1px solid var(--border-color);">
                    <div style="font-size: 18px; font-weight: 700;">${formatearMoneda(costeTotal)}</div>
                    <div class="u-fs-10 u-color-muted">Coste total</div>
                </div>
                <div style="flex: 1; background: var(--bg-card); border-radius: 12px; padding: 12px; text-align: center; border: 1px solid var(--border-color);">
                    <div style="font-size: 18px; font-weight: 700;">${actividades.length + entregables.length + hitos.length}</div>
                    <div class="u-fs-10 u-color-muted">Elementos totales</div>
                </div>
            </div>
            
            <!-- Vista Kanban -->
            <div style="display: flex; gap: 20px; overflow-x: auto; min-height: 400px;">
                <!-- Actividades -->
                <div class="u-kanban-col">
                    <div style="padding: 14px 16px; border-bottom: 2px solid #FF8C00; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="font-size: 14px; font-weight: 600; margin: 0;"><span> ACTIVIDADES</span> <span class="u-badge-light">${actividades.length}</span></h3>
                        <button onclick="abrirNuevoElementoConPadre(${edt.id}, 'actividad')" style="background: rgba(0,168,89,0.2); border: none; padding: 4px 10px; border-radius: 8px; cursor: pointer; font-size: 11px; color: #00A859;">+ Añadir</button>
                    </div>
                    <div class="u-scroll-panel">
                        ${actividadesHtml}
                    </div>
                </div>
                
                <!-- Entregables -->
                <div class="u-kanban-col">
                    <div style="padding: 14px 16px; border-bottom: 2px solid #00A859; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="font-size: 14px; font-weight: 600; margin: 0;"><span> ENTREGABLES</span> <span class="u-badge-light">${entregables.length}</span></h3>
                        <button onclick="abrirNuevoElementoConPadre(${edt.id}, 'entregable')" style="background: rgba(0,168,89,0.2); border: none; padding: 4px 10px; border-radius: 8px; cursor: pointer; font-size: 11px; color: #00A859;">+ Añadir</button>
                    </div>
                    <div class="u-scroll-panel">
                        ${entregablesHtml}
                    </div>
                </div>
                
                <!-- Hitos -->
                <div class="u-kanban-col">
                    <div style="padding: 14px 16px; border-bottom: 2px solid #FF3B30; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="font-size: 14px; font-weight: 600; margin: 0;"><span> HITOS</span> <span class="u-badge-light">${hitos.length}</span></h3>
                        <button onclick="abrirNuevoElementoConPadre(${edt.id}, 'hito')" style="background: rgba(0,168,89,0.2); border: none; padding: 4px 10px; border-radius: 8px; cursor: pointer; font-size: 11px; color: #00A859;">+ Añadir</button>
                    </div>
                    <div class="u-scroll-panel">
                        ${hitosHtml}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function volverAlGantt() {
    vistaActual = 'gantt';
    edtSeleccionadaId = null;
    
    var ganttContainer = document.getElementById('ganttUnificadoContainer');
    var tablaContainer = document.getElementById('tablaElementosGanttBody');
    var botonesContainer = document.querySelector('#panelCronograma .panel-title:first-child');
    
    if (ganttContainer && window.ganttOriginalHTML) {
        ganttContainer.innerHTML = window.ganttOriginalHTML;
        ganttContainer.style.minHeight = '400px';
        window.ganttOriginalHTML = null;
    }
    
    if (tablaContainer) tablaContainer.style.display = '';
    
    if (botonesContainer) {
        var titulo = botonesContainer.querySelector('span');
        if (titulo && window.tituloOriginalGuardado) {
            titulo.innerHTML = window.tituloOriginalGuardado;
            window.tituloOriginalGuardado = null;
        }
    }
    
    var btnVolver = document.getElementById('btnVolverGantt');
    if (btnVolver) btnVolver.style.display = 'none';
    
    // Recargar el Gantt
    if (typeof renderizarGanttUnificado === 'function') renderizarGanttUnificado();
    if (typeof renderizarTablaGantt === 'function') renderizarTablaGantt();
}

// Mantener las funciones auxiliares
function cerrarModalEDT() {
    volverAlGantt();
}

function copiarElementoDesdeEDT(elementoId) {
    var original = null;
    for (var i = 0; i < proyecto.elementosGantt.length; i++) {
        if (proyecto.elementosGantt[i].id === elementoId) {
            original = proyecto.elementosGantt[i];
            break;
        }
    }
    if (!original) return;
    
    var copia = JSON.parse(JSON.stringify(original));
    copia.id = Date.now() + Math.random() * 1000;
    copia.nombre = original.nombre + " (Copia)";
    copia.progreso = 0;
    copia.finReal = null;
    copia.inicioReal = null;
    
    proyecto.elementosGantt.push(copia);
    guardarProyecto();
    if (typeof reordenarNumeracionElementos === 'function') reordenarNumeracionElementos();
    
    if (edtSeleccionadaId) {
        abrirModalEDT(edtSeleccionadaId);
    }
    mostrarToast(' Elemento copiado', 'success');
}

function eliminarElementoDesdeEDT(elementoId) {
    if (!confirm(tApp('confirmar_eliminar_elemento'))) return;
    
    var nombre = '';
    for (var i = 0; i < proyecto.elementosGantt.length; i++) {
        if (proyecto.elementosGantt[i].id === elementoId) {
            nombre = proyecto.elementosGantt[i].nombre;
            break;
        }
    }
    
    proyecto.elementosGantt = proyecto.elementosGantt.filter(function(e) { return e.id !== elementoId; });
    guardarProyecto();
    if (typeof reordenarNumeracionElementos === 'function') reordenarNumeracionElementos();
    
    if (edtSeleccionadaId) {
        abrirModalEDT(edtSeleccionadaId);
    }
    mostrarToast(' "' + nombre + '" eliminado', 'success');
}

function abrirNuevoElementoConPadre(padreId, tipoSugerido) {
    if (typeof abrirModalNuevoElementoGantt === 'function') {
        abrirModalNuevoElementoGantt();
        setTimeout(function() {
            var dependenciaSelect = document.getElementById('nuevoDependeDe');
            if (dependenciaSelect) dependenciaSelect.value = padreId;
            if (tipoSugerido) {
                var tipoSelect = document.getElementById('nuevoTipo');
                if (tipoSelect) tipoSelect.value = tipoSugerido;
            }
        }, 200);
    }
}

// Variables globales
window.edtSeleccionadaId = null;

// Fijar clics en las EDT
function fijarClicEnEDT() {
    document.querySelectorAll('[data-edt-id]:not([data-edt-fixed])').forEach(function(el) {
        el.style.cursor = 'pointer';
        el.style.color = '#007AFF';
        el.setAttribute('data-edt-fixed', 'true');
        var id = parseInt(el.getAttribute('data-edt-id'));
        el.onclick = function() { abrirModalEDT(id); };
    });
}

// Sobrescribir renderizado
if (typeof renderizarGanttUnificado === 'function') {
    var origGantt = renderizarGanttUnificado;
    renderizarGanttUnificado = function() { origGantt(); fijarClicEnEDT(); };
}
if (typeof renderizarTablaGantt === 'function') {
    var origTabla = renderizarTablaGantt;
    renderizarTablaGantt = function() { origTabla(); fijarClicEnEDT(); };
}

setTimeout(fijarClicEnEDT, 1500);
console.log(" EDT panel integrado activado");
function actualizarTitulosPaneles() {
    // Acta
    const actaTitulo = document.getElementById('actaTitulo');
    if (actaTitulo) actaTitulo.innerHTML = tApp('acta_titulo');
    
    const btnEditarActa = document.getElementById('btnEditarActa');
    if (btnEditarActa) btnEditarActa.innerHTML = tApp('btn_editar');
    
    // Dashboard
    const dashboardTitulo = document.querySelector('#panelDashboard .panel-title span');
    if (dashboardTitulo) dashboardTitulo.innerHTML = tApp('dashboard_titulo');
    
    // Salud
    const saludTitulo = document.querySelector('#panelSalud .panel-title span');
    if (saludTitulo) saludTitulo.innerHTML = tApp('sidebar_salud');
}
// ============================================

// ============================================
// INICIALIZAR SUSCRIPCIÓN A CAMBIO DE IDIOMA
// ============================================

// Cuando el documento esté listo, suscribir los paneles
document.addEventListener('DOMContentLoaded', function() {
    // Suscribir funciones específicas que necesiten refrescarse
    subscribeToLanguageChange(function() {
        // Actualizar gráficos que pueden haber cambiado
        if (typeof calcularCashflow === 'function') {
            setTimeout(calcularCashflow, 100);
        }
        if (typeof actualizarBurnDown === 'function') {
            actualizarBurnDown();
        }
    });
    
    console.log(" Sistema de idioma inicializado");
});
// ============================================
// GRÁFICO DE EVOLUCIÓN DE TIPO DE CAMBIO - VERSIÓN CORREGIDA
// ============================================

let evolucionMonedaChart = null;
let historialTiposCambio = {};

// Función para obtener fechas reales (no futuras)
function obtenerRangoFechasReal(dias) {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - dias);
    
    // Asegurar que no usamos fechas futuras
    if (fechaFin > new Date()) {
        fechaFin.setDate(fechaFin.getDate() - 1);
    }
    
    return {
        inicio: fechaInicio.toISOString().split('T')[0],
        fin: fechaFin.toISOString().split('T')[0]
    };
}

// Cargar historial de tipos de cambio con manejo de errores mejorado
async function cargarHistorialTiposCambio(moneda, dias) {
    mostrarToast(` Cargando evolución de ${moneda}...`, 'info');
    
    const fechas = obtenerRangoFechasReal(dias);
    
    // Usar diferentes proxies para evitar CORS
    const proxies = [
        'https://api.allorigins.win/raw?url=',
        'https://cors-anywhere.herokuapp.com/',
        'https://cors.bridged.cc/'
    ];
    
    const apiUrl = `https://api.frankfurter.app/${fechas.inicio}..${fechas.fin}?from=EUR&to=${moneda}`;
    
    for (const proxy of proxies) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
            
            const response = await fetch(proxy + encodeURIComponent(apiUrl), {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                if (data.rates && Object.keys(data.rates).length > 0) {
                    // Guardar en caché
                    historialTiposCambio[moneda] = {
                        fecha: new Date().toISOString(),
                        datos: data.rates,
                        dias: dias
                    };
                    localStorage.setItem('historialTiposCambio', JSON.stringify(historialTiposCambio));
                    
                    mostrarToast(` Datos de ${moneda} cargados correctamente`, 'success');
                    return data.rates;
                }
            }
        } catch (error) {
            console.warn(`Proxy ${proxy} falló:`, error.message);
            // Continuar con el siguiente proxy
        }
    }
    
    // Si todo falla, usar datos de ejemplo o caché
    mostrarToast(` Usando datos simulados para ${moneda}`, 'warning');
    return generarDatosSimulados(moneda, dias);
}

// Generar datos simulados cuando la API falla
function generarDatosSimulados(moneda, dias) {
    const fechas = obtenerRangoFechasReal(dias);
    const rates = {};
    
    // Obtener tasa actual
    const tasaActual = tiposCambio[moneda] || 1;
    
    // Generar variación aleatoria pero realista (±5%)
    let fechaActual = new Date(fechas.inicio);
    const fechaFin = new Date(fechas.fin);
    
    let valor = tasaActual * (0.95 + Math.random() * 0.1);
    
    while (fechaActual <= fechaFin) {
        const fechaStr = fechaActual.toISOString().split('T')[0];
        // Variación diaria aleatoria entre -1% y +1%
        const variacion = 0.99 + Math.random() * 0.02;
        valor = valor * variacion;
        rates[fechaStr] = { [moneda]: Math.max(0.5, valor) };
        
        fechaActual.setDate(fechaActual.getDate() + 1);
    }
    
    return rates;
}

async function actualizarGraficoEvolucionMoneda() {
    const monedaSelect = document.getElementById('monedaComparar');
    const periodoSelect = document.getElementById('periodoGraficoMoneda');
    
    if (!monedaSelect || !periodoSelect) return;
    
    const moneda = monedaSelect.value;
    const dias = parseInt(periodoSelect.value);
    const monedaBase = proyecto?.monedaBase || 'EUR';
    
    const canvas = document.getElementById('evolucionMonedaChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Mostrar loading
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#888';
    ctx.font = '14px Arial';
    ctx.fillText('Cargando datos...', canvas.width/2 - 50, canvas.height/2);
    
    const datos = await cargarHistorialTiposCambio(moneda, dias);
    
    if (!datos || Object.keys(datos).length === 0) {
        document.getElementById('infoEvolucionMoneda').innerHTML = ` No se pudieron cargar los datos para ${moneda}.`;
        return;
    }
    
    // Procesar datos para el gráfico
    const fechas = [];
    const valores = [];
    let valorInicial = null;
    let valorFinal = null;
    let maxValor = 0;
    let minValor = Infinity;
    
    // Ordenar fechas cronológicamente
    const fechasOrdenadas = Object.keys(datos).sort();
    
    for (const fecha of fechasOrdenadas) {
        const valor = datos[fecha][moneda];
        if (valor && valor > 0) {
            fechas.push(fecha);
            valores.push(valor);
            
            if (valorInicial === null) valorInicial = valor;
            valorFinal = valor;
            maxValor = Math.max(maxValor, valor);
            minValor = Math.min(minValor, valor);
        }
    }
    
    if (valores.length === 0) {
        document.getElementById('infoEvolucionMoneda').innerHTML = ` No hay datos suficientes para ${moneda}.`;
        return;
    }
    
    // Calcular variación
    const variacion = valorInicial ? ((valorFinal - valorInicial) / valorInicial * 100) : 0;
    const variacionColor = variacion >= 0 ? '#00A859' : '#FF3B30';
    const variacionIcono = variacion >= 0 ? '' : '';
    
    // Destruir gráfico anterior si existe
    if (evolucionMonedaChart) {
        evolucionMonedaChart.destroy();
    }
    
    // Crear nuevo gráfico
    evolucionMonedaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas.map(f => {
                const [year, month, day] = f.split('-');
                return `${day}/${month}`;
            }),
            datasets: [{
                label: `1 ${monedaBase} → ${moneda}`,
                data: valores,
                borderColor: '#007AFF',
                backgroundColor: 'rgba(0,122,255,0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 2,
                pointHoverRadius: 5,
                pointBackgroundColor: '#007AFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return `1 ${monedaBase} = ${context.raw.toFixed(4)} ${moneda}`;
                        }
                    }
                },
                legend: {
                    position: 'top',
                    labels: { color: '#888' }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: `Tipo de cambio (${moneda})`,
                        color: '#888'
                    },
                    ticks: {
                        callback: (value) => value.toFixed(4),
                        color: '#888'
                    },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Fecha',
                        color: '#888'
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        color: '#888'
                    },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        }
    });
    
    // Actualizar información
    const infoDiv = document.getElementById('infoEvolucionMoneda');
    infoDiv.innerHTML = `
        <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
            <div><strong> Período:</strong> ${fechas[0]} → ${fechas[fechas.length-1]}</div>
            <div><strong> Inicio:</strong> 1 ${monedaBase} = ${valorInicial.toFixed(4)} ${moneda}</div>
            <div><strong> Actual:</strong> 1 ${monedaBase} = ${valorFinal.toFixed(4)} ${moneda}</div>
            <div><strong style="color: ${variacionColor};">${variacionIcono} Variación:</strong> ${variacion >= 0 ? '+' : ''}${variacion.toFixed(2)}%</div>
        </div>
        <div style="margin-top: 8px; display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
            <div><strong> Máximo:</strong> ${maxValor.toFixed(4)}</div>
            <div><strong> Mínimo:</strong> ${minValor.toFixed(4)}</div>
            <div><strong> Rango:</strong> ${(maxValor - minValor).toFixed(4)}</div>
        </div>
    `;
    
    // Si la moneda seleccionada es diferente a la base del proyecto, mostrar conversión
    if (moneda !== monedaBase) {
        const tasaActual = tiposCambio[moneda] || 1;
        infoDiv.innerHTML += `
            <div style="margin-top: 12px; padding: 8px; background: rgba(0,122,255,0.15); border-radius: 8px;">
                 <strong>Para tu proyecto:</strong> 1 ${monedaBase} = ${(1/tasaActual).toFixed(4)} ${moneda} | 
                1 ${moneda} = ${tasaActual.toFixed(4)} ${monedaBase}
            </div>
        `;
    }
}

// Inicializar el gráfico cuando se abre el panel de monedas
function inicializarGraficoMonedas() {
    // Cargar historial desde caché
    const cache = localStorage.getItem('historialTiposCambio');
    if (cache) {
        try {
            historialTiposCambio = JSON.parse(cache);
        } catch(e) {}
    }
    
    // Seleccionar el panel de monedas
    const panelMonedas = document.getElementById('panelMonedas');
    if (panelMonedas) {
        // Verificar si ya está activo
        if (panelMonedas.classList.contains('active')) {
            setTimeout(() => {
                actualizarGraficoEvolucionMoneda();
            }, 500);
        }
        
        // Observar cambios de clase
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (panelMonedas.classList.contains('active')) {
                        setTimeout(() => {
                            actualizarGraficoEvolucionMoneda();
                        }, 500);
                    }
                }
            });
        });
        
        observer.observe(panelMonedas, { attributes: true });
}
}
// Agrega esto justo después de la etiqueta <script> donde cargas THREE.js


console.log(" Cargando módulo logístico completo...");

// ============================================================

// ============================================================
// CLASE PRINCIPAL - SimuladorLogisticoApp
// ============================================================

// ============================================================
// VISOR 3D SIMPLIFICADO Y FUNCIONAL
// ============================================================

console.log("DEBUG: About to define SimuladorLogisticoApp class");
var SimuladorLogisticoApp = class SimuladorLogisticoApp {
    constructor() {
        // --- Estado 3D ---
        this.escena = null;
        this.camara = null;
        this.renderizador = null;
        this.controlesOrbita = null;
        this.controlesArrastre = null;
        this.meshesArrastrables = [];
        this.listaContenedores = [];
        this.idContenedorActivo = 0;
        this.nextPalletId = 1;
        this.inicializado = false;
        this.mallaContenedor = null;
        this.lineasContenedor = null;
        this.datosPalletSeleccionado = null;
        this.meshResaltadoContorno = null;
        this.raycaster = null;
        this.mouse = null;
        
        // --- Paleta de colores ---
        this.coloresPaleta = [0x2980b9, 0x27ae60, 0xe67e22, 0x8e44ad, 0xf1c40f, 0x16a085, 0xe74c3c, 0x3498db, 0x2c3e50, 0x1abc9c];
        
        // --- Catálogos de unidades ---
        this.catalogosUnidades = {
            AEREO: [
                { texto: "ULD AKE LD3 (Max: 1,588 kg)", val: "1.56|1.53|1.60|1588|AKE LD3" },
                { texto: "ULD AAP LD9 (Max: 4,626 kg)", val: "3.17|2.23|1.62|4626|AAP LD9" },
                { texto: "Paleta PMC P6P (Max: 5,000 kg)", val: "3.17|2.44|2.44|5000|PMC P6P" },
                { texto: "Paleta PAG AMA (Max: 5,443 kg)", val: "3.17|2.44|2.44|5443|PAG AMA" },
                { texto: "Paleta PLA L-7 (Max: 3,175 kg)", val: "2.23|1.53|1.62|3175|PLA L-7" },
                { texto: "Contenedor AAU A-2 (Max: 4,600 kg)", val: "1.56|1.53|1.62|4600|AAU A-2" }
            ],
            MARITIMO: [
                { texto: "Contenedor 20' Dry Van (Max: 28,000 kg)", val: "5.90|2.35|2.39|28000|20ft DV" },
                { texto: "Contenedor 20' Open Top (Max: 24,000 kg)", val: "5.90|2.35|2.39|24000|20ft OT" },
                { texto: "Contenedor 20' Reefer (Max: 21,000 kg)", val: "5.45|2.29|2.27|21000|20ft Reefer" },
                { texto: "Contenedor 20' Flat Rack (Max: 25,000 kg)", val: "5.65|2.20|2.20|25000|20ft FR" },
                { texto: "Contenedor 40' Dry Van (Max: 28,500 kg)", val: "12.03|2.35|2.39|28500|40ft DV" },
                { texto: "Contenedor 40' High Cube (Max: 28,600 kg)", val: "12.03|2.35|2.69|28600|40ft HC" },
                { texto: "Contenedor 40' Open Top (Max: 26,500 kg)", val: "12.03|2.35|2.39|26500|40ft OT" },
                { texto: "Contenedor 40' Reefer (Max: 24,000 kg)", val: "11.59|2.29|2.50|24000|40ft Reefer" },
                { texto: "Contenedor 40' Flat Rack (Max: 35,000 kg)", val: "11.65|2.20|2.20|35000|40ft FR" },
                { texto: "Contenedor 45' Pallet Wide (Max: 24,000 kg)", val: "13.56|2.47|2.70|24000|45ft PW" }
            ],
            SIN_CONTENEDOR: [
                { texto: "Suelo Terrestre / Libre (Sin Límite)", val: "10.00|8.00|4.00|999999|Zona Libre" },
                { texto: "Almacén Pequeño (6×4×3 m)", val: "6.00|4.00|3.00|999999|Almacén P" },
                { texto: "Almacén Mediano (12×6×4 m)", val: "12.00|6.00|4.00|999999|Almacén M" },
                { texto: "Almacén Grande (20×10×6 m)", val: "20.00|10.00|6.00|999999|Almacén G" }
            ]
        };
        
        // --- Tipos de carga ---
        this.tiposCarga = {
            caja: { nombre: 'Caja', largo: 1.20, ancho: 0.80, alto: 1.00 },
            pallet_europeo: { nombre: 'Pallet Europeo', largo: 1.20, ancho: 0.80, alto: 1.00 },
            pallet_americano: { nombre: 'Pallet Americano', largo: 1.20, ancho: 1.00, alto: 1.20 },
            bidon: { nombre: 'Bidón', largo: 0.60, ancho: 0.60, alto: 0.90 },
            saco: { nombre: 'Saco', largo: 0.80, ancho: 0.60, alto: 0.50 },
            tubo: { nombre: 'Tubo', largo: 3.00, ancho: 0.30, alto: 0.30 },
            personalizado: { nombre: 'Personalizado', largo: 1.00, ancho: 0.80, alto: 0.60 }
        };
        
        // --- Países completo (todos los UN reconocidos) ---
        this.paisesCatalogo = {
            'AF': { nombre: 'Afganistán', continente: 'Asia', moneda: 'AFN', arancelBase: 10 },
            'AL': { nombre: 'Albania', continente: 'Europa', moneda: 'ALL', arancelBase: 5 },
            'DE': { nombre: 'Alemania', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'AD': { nombre: 'Andorra', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'AO': { nombre: 'Angola', continente: 'África', moneda: 'AOA', arancelBase: 12 },
            'AG': { nombre: 'Antigua y Barbuda', continente: 'América', moneda: 'XCD', arancelBase: 10 },
            'SA': { nombre: 'Arabia Saudita', continente: 'Asia', moneda: 'SAR', arancelBase: 5 },
            'AR': { nombre: 'Argentina', continente: 'América', moneda: 'ARS', arancelBase: 15 },
            'AM': { nombre: 'Armenia', continente: 'Asia', moneda: 'AMD', arancelBase: 5 },
            'AU': { nombre: 'Australia', continente: 'Oceanía', moneda: 'AUD', arancelBase: 5 },
            'AT': { nombre: 'Austria', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'AZ': { nombre: 'Azerbaiyán', continente: 'Asia', moneda: 'AZN', arancelBase: 8 },
            'BS': { nombre: 'Bahamas', continente: 'América', moneda: 'BSD', arancelBase: 10 },
            'BH': { nombre: 'Baréin', continente: 'Asia', moneda: 'BHD', arancelBase: 5 },
            'BD': { nombre: 'Bangladés', continente: 'Asia', moneda: 'BDT', arancelBase: 15 },
            'BB': { nombre: 'Barbados', continente: 'América', moneda: 'BBD', arancelBase: 10 },
            'BE': { nombre: 'Bélgica', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'BZ': { nombre: 'Belice', continente: 'América', moneda: 'BZD', arancelBase: 10 },
            'BJ': { nombre: 'Benín', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'BY': { nombre: 'Bielorrusia', continente: 'Europa', moneda: 'BYN', arancelBase: 8 },
            'MM': { nombre: 'Birmania', continente: 'Asia', moneda: 'MMK', arancelBase: 12 },
            'BO': { nombre: 'Bolivia', continente: 'América', moneda: 'BOB', arancelBase: 10 },
            'BA': { nombre: 'Bosnia y Herzegovina', continente: 'Europa', moneda: 'BAM', arancelBase: 5 },
            'BW': { nombre: 'Botsuana', continente: 'África', moneda: 'BWP', arancelBase: 10 },
            'BR': { nombre: 'Brasil', continente: 'América', moneda: 'BRL', arancelBase: 15 },
            'BN': { nombre: 'Brunéi', continente: 'Asia', moneda: 'BND', arancelBase: 5 },
            'BG': { nombre: 'Bulgaria', continente: 'Europa', moneda: 'BGN', arancelBase: 0 },
            'BF': { nombre: 'Burkina Faso', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'BI': { nombre: 'Burundi', continente: 'África', moneda: 'BIF', arancelBase: 15 },
            'BT': { nombre: 'Bután', continente: 'Asia', moneda: 'BTN', arancelBase: 12 },
            'CV': { nombre: 'Cabo Verde', continente: 'África', moneda: 'CVE', arancelBase: 10 },
            'KH': { nombre: 'Camboya', continente: 'Asia', moneda: 'KHR', arancelBase: 12 },
            'CM': { nombre: 'Camerún', continente: 'África', moneda: 'XAF', arancelBase: 12 },
            'CA': { nombre: 'Canadá', continente: 'América', moneda: 'CAD', arancelBase: 3 },
            'QA': { nombre: 'Catar', continente: 'Asia', moneda: 'QAR', arancelBase: 5 },
            'TD': { nombre: 'Chad', continente: 'África', moneda: 'XAF', arancelBase: 15 },
            'CL': { nombre: 'Chile', continente: 'América', moneda: 'CLP', arancelBase: 8 },
            'CN': { nombre: 'China', continente: 'Asia', moneda: 'CNY', arancelBase: 15 },
            'CY': { nombre: 'Chipre', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'CO': { nombre: 'Colombia', continente: 'América', moneda: 'COP', arancelBase: 10 },
            'KM': { nombre: 'Comoras', continente: 'África', moneda: 'KMF', arancelBase: 12 },
            'KP': { nombre: 'Corea del Norte', continente: 'Asia', moneda: 'KPW', arancelBase: 15 },
            'KR': { nombre: 'Corea del Sur', continente: 'Asia', moneda: 'KRW', arancelBase: 8 },
            'CI': { nombre: 'Costa de Marfil', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'CR': { nombre: 'Costa Rica', continente: 'América', moneda: 'CRC', arancelBase: 8 },
            'HR': { nombre: 'Croacia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'CU': { nombre: 'Cuba', continente: 'América', moneda: 'CUP', arancelBase: 15 },
            'DK': { nombre: 'Dinamarca', continente: 'Europa', moneda: 'DKK', arancelBase: 0 },
            'DM': { nombre: 'Dominica', continente: 'América', moneda: 'XCD', arancelBase: 10 },
            'EC': { nombre: 'Ecuador', continente: 'América', moneda: 'USD', arancelBase: 10 },
            'EG': { nombre: 'Egipto', continente: 'África', moneda: 'EGP', arancelBase: 15 },
            'SV': { nombre: 'El Salvador', continente: 'América', moneda: 'USD', arancelBase: 8 },
            'AE': { nombre: 'Emiratos Árabes Unidos', continente: 'Asia', moneda: 'AED', arancelBase: 5 },
            'ER': { nombre: 'Eritrea', continente: 'África', moneda: 'ERN', arancelBase: 15 },
            'SK': { nombre: 'Eslovaquia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'SI': { nombre: 'Eslovenia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'ES': { nombre: 'España', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'US': { nombre: 'Estados Unidos', continente: 'América', moneda: 'USD', arancelBase: 5 },
            'EE': { nombre: 'Estonia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'ET': { nombre: 'Etiopía', continente: 'África', moneda: 'ETB', arancelBase: 15 },
            'PH': { nombre: 'Filipinas', continente: 'Asia', moneda: 'PHP', arancelBase: 10 },
            'FI': { nombre: 'Finlandia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'FJ': { nombre: 'Fiyi', continente: 'Oceanía', moneda: 'FJD', arancelBase: 8 },
            'FR': { nombre: 'Francia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'GA': { nombre: 'Gabón', continente: 'África', moneda: 'XAF', arancelBase: 12 },
            'GM': { nombre: 'Gambia', continente: 'África', moneda: 'GMD', arancelBase: 12 },
            'GE': { nombre: 'Georgia', continente: 'Asia', moneda: 'GEL', arancelBase: 5 },
            'GH': { nombre: 'Ghana', continente: 'África', moneda: 'GHS', arancelBase: 12 },
            'GD': { nombre: 'Granada', continente: 'América', moneda: 'XCD', arancelBase: 10 },
            'GR': { nombre: 'Grecia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'GT': { nombre: 'Guatemala', continente: 'América', moneda: 'GTQ', arancelBase: 8 },
            'GN': { nombre: 'Guinea', continente: 'África', moneda: 'GNF', arancelBase: 12 },
            'GQ': { nombre: 'Guinea Ecuatorial', continente: 'África', moneda: 'XAF', arancelBase: 12 },
            'GW': { nombre: 'Guinea-Bisáu', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'GY': { nombre: 'Guyana', continente: 'América', moneda: 'GYD', arancelBase: 10 },
            'HT': { nombre: 'Haití', continente: 'América', moneda: 'HTG', arancelBase: 10 },
            'HN': { nombre: 'Honduras', continente: 'América', moneda: 'HNL', arancelBase: 8 },
            'HU': { nombre: 'Hungría', continente: 'Europa', moneda: 'HUF', arancelBase: 0 },
            'IN': { nombre: 'India', continente: 'Asia', moneda: 'INR', arancelBase: 18 },
            'ID': { nombre: 'Indonesia', continente: 'Asia', moneda: 'IDR', arancelBase: 12 },
            'IQ': { nombre: 'Irak', continente: 'Asia', moneda: 'IQD', arancelBase: 8 },
            'IR': { nombre: 'Irán', continente: 'Asia', moneda: 'IRR', arancelBase: 15 },
            'IE': { nombre: 'Irlanda', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'IS': { nombre: 'Islandia', continente: 'Europa', moneda: 'ISK', arancelBase: 3 },
            'IL': { nombre: 'Israel', continente: 'Asia', moneda: 'ILS', arancelBase: 5 },
            'IT': { nombre: 'Italia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'JM': { nombre: 'Jamaica', continente: 'América', moneda: 'JMD', arancelBase: 10 },
            'JP': { nombre: 'Japón', continente: 'Asia', moneda: 'JPY', arancelBase: 5 },
            'JO': { nombre: 'Jordania', continente: 'Asia', moneda: 'JOD', arancelBase: 8 },
            'KZ': { nombre: 'Kazajistán', continente: 'Asia', moneda: 'KZT', arancelBase: 5 },
            'KE': { nombre: 'Kenia', continente: 'África', moneda: 'KES', arancelBase: 12 },
            'KG': { nombre: 'Kirguistán', continente: 'Asia', moneda: 'KGS', arancelBase: 5 },
            'KI': { nombre: 'Kiribati', continente: 'Oceanía', moneda: 'AUD', arancelBase: 8 },
            'KW': { nombre: 'Kuwait', continente: 'Asia', moneda: 'KWD', arancelBase: 5 },
            'LA': { nombre: 'Laos', continente: 'Asia', moneda: 'LAK', arancelBase: 10 },
            'LS': { nombre: 'Lesoto', continente: 'África', moneda: 'LSL', arancelBase: 10 },
            'LV': { nombre: 'Letonia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'LB': { nombre: 'Líbano', continente: 'Asia', moneda: 'LBP', arancelBase: 8 },
            'LR': { nombre: 'Liberia', continente: 'África', moneda: 'LRD', arancelBase: 12 },
            'LY': { nombre: 'Libia', continente: 'África', moneda: 'LYD', arancelBase: 12 },
            'LI': { nombre: 'Liechtenstein', continente: 'Europa', moneda: 'CHF', arancelBase: 3 },
            'LT': { nombre: 'Lituania', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'LU': { nombre: 'Luxemburgo', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'MG': { nombre: 'Madagascar', continente: 'África', moneda: 'MGA', arancelBase: 12 },
            'MY': { nombre: 'Malasia', continente: 'Asia', moneda: 'MYR', arancelBase: 8 },
            'MW': { nombre: 'Malaui', continente: 'África', moneda: 'MWK', arancelBase: 12 },
            'MV': { nombre: 'Maldivas', continente: 'Asia', moneda: 'MVR', arancelBase: 10 },
            'ML': { nombre: 'Mali', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'MT': { nombre: 'Malta', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'MA': { nombre: 'Marruecos', continente: 'África', moneda: 'MAD', arancelBase: 12 },
            'MH': { nombre: 'Islas Marshall', continente: 'Oceanía', moneda: 'USD', arancelBase: 8 },
            'MU': { nombre: 'Mauricio', continente: 'África', moneda: 'MUR', arancelBase: 10 },
            'MR': { nombre: 'Mauritania', continente: 'África', moneda: 'MRU', arancelBase: 12 },
            'DZ': { nombre: 'Argelia', continente: 'África', moneda: 'DZD', arancelBase: 15 },
            'MX': { nombre: 'México', continente: 'América', moneda: 'MXN', arancelBase: 8 },
            'FM': { nombre: 'Micronesia', continente: 'Oceanía', moneda: 'USD', arancelBase: 8 },
            'MD': { nombre: 'Moldavia', continente: 'Europa', moneda: 'MDL', arancelBase: 5 },
            'MC': { nombre: 'Mónaco', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'MN': { nombre: 'Mongolia', continente: 'Asia', moneda: 'MNT', arancelBase: 8 },
            'ME': { nombre: 'Montenegro', continente: 'Europa', moneda: 'EUR', arancelBase: 5 },
            'MZ': { nombre: 'Mozambique', continente: 'África', moneda: 'MZN', arancelBase: 12 },
            'NA': { nombre: 'Namibia', continente: 'África', moneda: 'NAD', arancelBase: 10 },
            'NR': { nombre: 'Nauru', continente: 'Oceanía', moneda: 'AUD', arancelBase: 8 },
            'NP': { nombre: 'Nepal', continente: 'Asia', moneda: 'NPR', arancelBase: 12 },
            'NI': { nombre: 'Nicaragua', continente: 'América', moneda: 'NIO', arancelBase: 8 },
            'NE': { nombre: 'Níger', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'NG': { nombre: 'Nigeria', continente: 'África', moneda: 'NGN', arancelBase: 15 },
            'NO': { nombre: 'Noruega', continente: 'Europa', moneda: 'NOK', arancelBase: 3 },
            'NZ': { nombre: 'Nueva Zelanda', continente: 'Oceanía', moneda: 'NZD', arancelBase: 5 },
            'OM': { nombre: 'Omán', continente: 'Asia', moneda: 'OMR', arancelBase: 5 },
            'NL': { nombre: 'Países Bajos', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'PK': { nombre: 'Pakistán', continente: 'Asia', moneda: 'PKR', arancelBase: 15 },
            'PW': { nombre: 'Palaos', continente: 'Oceanía', moneda: 'USD', arancelBase: 8 },
            'PA': { nombre: 'Panamá', continente: 'América', moneda: 'PAB', arancelBase: 8 },
            'PG': { nombre: 'Papúa Nueva Guinea', continente: 'Oceanía', moneda: 'PGK', arancelBase: 8 },
            'PY': { nombre: 'Paraguay', continente: 'América', moneda: 'PYG', arancelBase: 10 },
            'PE': { nombre: 'Perú', continente: 'América', moneda: 'PEN', arancelBase: 8 },
            'PL': { nombre: 'Polonia', continente: 'Europa', moneda: 'PLN', arancelBase: 0 },
            'PT': { nombre: 'Portugal', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'GB': { nombre: 'Reino Unido', continente: 'Europa', moneda: 'GBP', arancelBase: 0 },
            'CF': { nombre: 'República Centroafricana', continente: 'África', moneda: 'XAF', arancelBase: 12 },
            'CG': { nombre: 'República del Congo', continente: 'África', moneda: 'XAF', arancelBase: 12 },
            'CD': { nombre: 'República Democrática del Congo', continente: 'África', moneda: 'CDF', arancelBase: 15 },
            'CZ': { nombre: 'República Checa', continente: 'Europa', moneda: 'CZK', arancelBase: 0 },
            'MK': { nombre: 'Macedonia del Norte', continente: 'Europa', moneda: 'MKD', arancelBase: 5 },
            'DO': { nombre: 'República Dominicana', continente: 'América', moneda: 'DOP', arancelBase: 10 },
            'RW': { nombre: 'Ruanda', continente: 'África', moneda: 'RWF', arancelBase: 12 },
            'RO': { nombre: 'Rumania', continente: 'Europa', moneda: 'RON', arancelBase: 0 },
            'RU': { nombre: 'Rusia', continente: 'Asia', moneda: 'RUB', arancelBase: 8 },
            'WS': { nombre: 'Samoa', continente: 'Oceanía', moneda: 'WST', arancelBase: 8 },
            'KN': { nombre: 'San Cristóbal y Nieves', continente: 'América', moneda: 'XCD', arancelBase: 10 },
            'SM': { nombre: 'San Marino', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'VC': { nombre: 'San Vicente y las Granadinas', continente: 'América', moneda: 'XCD', arancelBase: 10 },
            'LC': { nombre: 'Santa Lucía', continente: 'América', moneda: 'XCD', arancelBase: 10 },
            'ST': { nombre: 'Santo Tomé y Príncipe', continente: 'África', moneda: 'STN', arancelBase: 12 },
            'SN': { nombre: 'Senegal', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'RS': { nombre: 'Serbia', continente: 'Europa', moneda: 'RSD', arancelBase: 5 },
            'SC': { nombre: 'Seychelles', continente: 'África', moneda: 'SCR', arancelBase: 10 },
            'SL': { nombre: 'Sierra Leona', continente: 'África', moneda: 'SLL', arancelBase: 12 },
            'SG': { nombre: 'Singapur', continente: 'Asia', moneda: 'SGD', arancelBase: 5 },
            'SY': { nombre: 'Siria', continente: 'Asia', moneda: 'SYP', arancelBase: 12 },
            'SO': { nombre: 'Somalia', continente: 'África', moneda: 'SOS', arancelBase: 15 },
            'LK': { nombre: 'Sri Lanka', continente: 'Asia', moneda: 'LKR', arancelBase: 12 },
            'SZ': { nombre: 'Suazilandia', continente: 'África', moneda: 'SZL', arancelBase: 10 },
            'ZA': { nombre: 'Sudáfrica', continente: 'África', moneda: 'ZAR', arancelBase: 12 },
            'SD': { nombre: 'Sudán', continente: 'África', moneda: 'SDG', arancelBase: 15 },
            'SS': { nombre: 'Sudán del Sur', continente: 'África', moneda: 'SSP', arancelBase: 15 },
            'SE': { nombre: 'Suecia', continente: 'Europa', moneda: 'SEK', arancelBase: 0 },
            'CH': { nombre: 'Suiza', continente: 'Europa', moneda: 'CHF', arancelBase: 3 },
            'SR': { nombre: 'Surinam', continente: 'América', moneda: 'SRD', arancelBase: 10 },
            'TH': { nombre: 'Tailandia', continente: 'Asia', moneda: 'THB', arancelBase: 10 },
            'TZ': { nombre: 'Tanzania', continente: 'África', moneda: 'TZS', arancelBase: 12 },
            'TJ': { nombre: 'Tayikistán', continente: 'Asia', moneda: 'TJS', arancelBase: 8 },
            'TL': { nombre: 'Timor Oriental', continente: 'Asia', moneda: 'USD', arancelBase: 10 },
            'TG': { nombre: 'Togo', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'TO': { nombre: 'Tonga', continente: 'Oceanía', moneda: 'TOP', arancelBase: 8 },
            'TT': { nombre: 'Trinidad y Tobago', continente: 'América', moneda: 'TTD', arancelBase: 10 },
            'TN': { nombre: 'Túnez', continente: 'África', moneda: 'TND', arancelBase: 12 },
            'TM': { nombre: 'Turkmenistán', continente: 'Asia', moneda: 'TMT', arancelBase: 8 },
            'TR': { nombre: 'Turquía', continente: 'Asia', moneda: 'TRY', arancelBase: 8 },
            'TV': { nombre: 'Tuvalu', continente: 'Oceanía', moneda: 'AUD', arancelBase: 8 },
            'UA': { nombre: 'Ucrania', continente: 'Europa', moneda: 'UAH', arancelBase: 5 },
            'UG': { nombre: 'Uganda', continente: 'África', moneda: 'UGX', arancelBase: 12 },
            'UY': { nombre: 'Uruguay', continente: 'América', moneda: 'UYU', arancelBase: 10 },
            'UZ': { nombre: 'Uzbekistán', continente: 'Asia', moneda: 'UZS', arancelBase: 8 },
            'VU': { nombre: 'Vanuatu', continente: 'Oceanía', moneda: 'VUV', arancelBase: 8 },
            'VA': { nombre: 'Ciudad del Vaticano', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'VE': { nombre: 'Venezuela', continente: 'América', moneda: 'VES', arancelBase: 15 },
            'VN': { nombre: 'Vietnam', continente: 'Asia', moneda: 'VND', arancelBase: 12 },
            'YE': { nombre: 'Yemen', continente: 'Asia', moneda: 'YER', arancelBase: 12 },
            'DJ': { nombre: 'Yibuti', continente: 'África', moneda: 'DJF', arancelBase: 12 },
            'ZM': { nombre: 'Zambia', continente: 'África', moneda: 'ZMW', arancelBase: 12 },
            'ZW': { nombre: 'Zimbabue', continente: 'África', moneda: 'ZWL', arancelBase: 15 },
            'XK': { nombre: 'Kosovo', continente: 'Europa', moneda: 'EUR', arancelBase: 5 }
        };
        
        // --- Bind de métodos ---
        this.init = this.init.bind(this);
        this.cambiarModalidad = this.cambiarModalidad.bind(this);
        this.agregarContenedor = this.agregarContenedor.bind(this);
        this.seleccionarContenedor = this.seleccionarContenedor.bind(this);
        this.actualizarUnidadActiva = this.actualizarUnidadActiva.bind(this);
        this.crearCarga = this.crearCarga.bind(this);
        this.eliminarUltimaCarga = this.eliminarUltimaCarga.bind(this);
        this.actualizarCostos = this.actualizarCostos.bind(this);
        this.actualizarInterfazGlobal = this.actualizarInterfazGlobal.bind(this);
        this.actualizarTablaPacking = this.actualizarTablaPacking.bind(this);
        this.guardarEstado = this.guardarEstado.bind(this);
        this.cargarEstado = this.cargarEstado.bind(this);
        this.cambiarVista = this.cambiarVista.bind(this);
        this.cargarTipoPredefinido = this.cargarTipoPredefinido.bind(this);
        this.actualizarPreviewDimension = this.actualizarPreviewDimension.bind(this);
        this.guardarMaterial = this.guardarMaterial.bind(this);
        this.verificarInvasiones = this.verificarInvasiones.bind(this);
        this.exportarCSV = this.exportarCSV.bind(this);
        this.exportarPDF = this.exportarPDF.bind(this);
        this.cargarPaisesEnSelectores = this.cargarPaisesEnSelectores.bind(this);
        this.cargarMaterialesEnSelector = this.cargarMaterialesEnSelector.bind(this);
        this.renderizarMaterialesDelPalletActivo = this.renderizarMaterialesDelPalletActivo.bind(this);
        this.eliminarMaterialDePallet = this.eliminarMaterialDePallet.bind(this);
        this.seleccionarPalletPorId = this.seleccionarPalletPorId.bind(this);
        this.eliminarMaterialDesdePacking = this.eliminarMaterialDesdePacking.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.animate = this.animate.bind(this);
        this.onClick = this.onClick.bind(this);
        this.seleccionarPalletPorMesh = this.seleccionarPalletPorMesh.bind(this);
        this.deseleccionarPallet = this.deseleccionarPallet.bind(this);
        this.verificarEstadoVisor = this.verificarEstadoVisor.bind(this);
    }

    // ============================================================
    // INICIALIZACIÓN PRINCIPAL
    // ============================================================
    
    init() {
        if (this.inicializado) return;
        this.inicializado = true;
        
        console.log(" Inicializando simulador 3D...");
        
        if (typeof THREE === 'undefined') {
            console.error(" Three.js no está disponible");
            const container = document.getElementById('canvas3d-container');
            if (container) {
                container.innerHTML = `
                    <div style="display:flex; align-items:center; justify-content:center; height:100%; background:#1a1a2e; color:white; flex-direction:column; padding:20px;">
                        <div style="font-size:48px; margin-bottom:16px;"></div>
                        <h3>Three.js no está cargado</h3>
                        <p style="color:#888; text-align:center;">Revisa tu conexión a internet y recarga la página.</p>
                        <button onclick="location.reload()" style="margin-top:16px; padding:10px 24px; background:#007AFF; color:white; border:none; border-radius:8px; cursor:pointer;">Recargar</button>
                    </div>
                `;
            }
            return;
        }
        
        try {
            this.cargarPaisesEnSelectores();
            this.cargarMaterialesEnSelector();
            this.init3D();
            this.cambiarModalidad();
            this.cargarTipoPredefinido();
            this.actualizarCostos();
            
            if (this.listaContenedores.length === 0) {
                this.agregarContenedor();
            }
            
            document.getElementById('logIncoterm')?.addEventListener('change', () => this.actualizarCostos());
            document.getElementById('logPaisOrigen')?.addEventListener('change', () => this.actualizarCostos());
            document.getElementById('logPaisDestino')?.addEventListener('change', () => this.actualizarCostos());
            document.getElementById('logValorMercancia')?.addEventListener('input', () => this.actualizarCostos());
            document.getElementById('logTipoCarga')?.addEventListener('change', () => this.cargarTipoPredefinido());
            
            console.log(" Simulador 3D listo");
        } catch (e) {
            console.error(" Error al inicializar simulador 3D:", e);
            this.inicializado = false;
            mostrarToast(" Error 3D: " + e.message, 'error');
        }
    }

    // ============================================================
    // INICIALIZACIÓN 3D
    // ============================================================
    
    init3D() {
    const contenedorVisor = document.getElementById('canvas3d-container');
    if (!contenedorVisor) {
        console.error(" No se encuentra el contenedor 3D");
        return;
    }
    
    //  FORZAR TAMAÑO COMPLETO
    contenedorVisor.style.width = '100%';
    contenedorVisor.style.height = '100%';
    contenedorVisor.style.minHeight = '500px';
    contenedorVisor.style.position = 'relative';
    contenedorVisor.style.overflow = 'hidden';
    
    // Limpiar contenedor
    while (contenedorVisor.firstChild) {
        contenedorVisor.removeChild(contenedorVisor.firstChild);
    }
    
    // Obtener dimensiones REALES del contenedor
    const w = contenedorVisor.clientWidth || 500;
    const h = contenedorVisor.clientHeight || 450;
    
    console.log(` Dimensiones del visor: ${w}x${h}`);
    
    // Crear escena
    this.escena = new THREE.Scene();
    this.escena.background = new THREE.Color(0x1a1a2e);

    // Crear cámara con aspect ratio correcto
    this.camara = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    this.camara.position.set(7, 5, 9);
    this.camara.lookAt(0, 1, 0);

    // Crear renderizador
    this.renderizador = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
    });
    this.renderizador.setSize(w, h);
    this.renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderizador.shadowMap.enabled = true;
    this.renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderizador.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderizador.toneMappingExposure = 1.2;
    this.renderizador.outputEncoding = THREE.sRGBEncoding;
    
    //  Asegurar que el canvas ocupa todo el contenedor
    this.renderizador.domElement.style.width = '100%';
    this.renderizador.domElement.style.height = '100%';
    this.renderizador.domElement.style.display = 'block';
    
    contenedorVisor.appendChild(this.renderizador.domElement);

    // Controles Orbita
    this.controlesOrbita = new THREE.OrbitControls(this.camara, this.renderizador.domElement);
    this.controlesOrbita.enableDamping = true;
    this.controlesOrbita.dampingFactor = 0.1;
    this.controlesOrbita.target.set(0, 1, 0);
    this.controlesOrbita.minDistance = 2;
    this.controlesOrbita.maxDistance = 30;
    this.controlesOrbita.maxPolarAngle = Math.PI / 2.1;
    this.controlesOrbita.update();

    // Luces
    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x1a1a2e, 0.6);
    this.escena.add(hemisphereLight);
    
    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    dirLight.position.set(8, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;
    this.escena.add(dirLight);
    
    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.5);
    fillLight.position.set(-8, 5, -6);
    this.escena.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(-5, 3, 10);
    this.escena.add(rimLight);

    // Suelo
    const gridHelper = new THREE.GridHelper(20, 24, 0x4a6fa5, 0x2c3e50);
    gridHelper.position.y = 0.01;
    this.escena.add(gridHelper);

    // Raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Evento de clic para selección
    this.renderizador.domElement.addEventListener('click', this.onClick);
    // Evento de hover para tooltip
    this.renderizador.domElement.addEventListener('mousemove', (e) => { this.onHover(e); });

    //  Evento de resize con actualización completa
    window.addEventListener('resize', () => {
        this.onWindowResize();
    });

    //  También observar cambios en el contenedor (para cuando se muestra/oculta)
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => {
            this.onWindowResize();
        });
        resizeObserver.observe(contenedorVisor);
        this._resizeObserver = resizeObserver;
    }

    // Tecla R para rotar
    window.addEventListener('keydown', (e) => {
        if ((e.key === 'r' || e.key === 'R') && this.datosPalletSeleccionado) {
            const mesh = this.datosPalletSeleccionado.mesh;
            mesh.rotation.y += Math.PI / 2;
            mesh.rotation.y = mesh.rotation.y % (Math.PI * 2);
            if (this.meshResaltadoContorno) {
                this.meshResaltadoContorno.rotation.copy(mesh.rotation);
            }
            this.actualizarInterfazGlobal();
            this.guardarEstado();
            mostrarToast(' Carga rotada 90°', 'success');
        }
    });

    // Configurar Drag Controls
    this.configurarDragControls();

    // Iniciar animación
    this.animate();
    
    console.log(" Entorno 3D inicializado con tamaño:", w, "x", h);
    
}
// ============================================================
// CALCULAR PESO TOTAL POR PALLET
// ============================================================
    
calcularPesoPallet(bulto) {
    let pesoTotal = 0;
    if (bulto.materiales && bulto.materiales.length > 0) {
        bulto.materiales.forEach(mat => {
            pesoTotal += mat.peso || 0;
        });
    }
    return pesoTotal;
}

// ============================================================
// OBTENER HS CODE DE UN MATERIAL
// ============================================================
    
obtenerHsCode(materialId) {
    if (!materialId) return 'N/A';
    const material = proyecto.materiales?.find(m => m.id === materialId);
    if (material) {
        // Buscar en diferentes campos donde pueda estar el HS Code
        return material.hsCode || material.partNumber || material.codigo || 'N/A';
    }
    return 'N/A';
}

// ============================================================
// CALCULAR COSTE DEL EQUIPAMIENTO (CONTENEDOR/ULD)
// ============================================================
    
calcularCosteEquipamiento(contenedor) {
    if (!contenedor) return 0;
    
    // Coste base según tipo de contenedor
    let costeBase = 0;
    const modo = document.getElementById('logModalidad')?.value || 'AEREO';
    
    if (modo === 'AEREO') {
        // ULD: coste por alquiler
        costeBase = 150 + (contenedor.L * contenedor.A * 0.5);
    } else if (modo === 'MARITIMO') {
        // Contenedor marítimo: coste por día
        costeBase = 200 + (contenedor.L * 0.8);
    } else {
        // Suelo/Almacén: coste por m²
        costeBase = 50 + (contenedor.L * contenedor.A * 2);
    }
    
    // Añadir coste por peso utilizado
    const pesoTotal = contenedor.bultos.reduce((acc, b) => acc + this.calcularPesoPallet(b), 0);
    const porcentajeUso = contenedor.maxPeso > 0 ? Math.min(100, (pesoTotal / contenedor.maxPeso) * 100) : 0;
    const costePorPeso = (porcentajeUso / 100) * 300; // Coste adicional por uso
    
    return Math.round(costeBase + costePorPeso);
}

// ============================================================
// ACTUALIZAR PACKING LIST MEJORADO
// ============================================================
    
actualizarTablaPacking() {
    const tbody = document.getElementById('logPackingBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (this.listaContenedores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="13" style="text-align: center; padding: 20px; color: #666;">No hay contenedores. Crea uno para comenzar.</td></tr>';
        return;
    }

    let totalGeneralPeso = 0;
    let totalGeneralCosto = 0;
    let totalGeneralMateriales = 0;

    this.listaContenedores.forEach(c => {
        // Calcular coste del equipamiento para este contenedor
        const costeEquipamiento = this.calcularCosteEquipamiento(c);
        totalGeneralCosto += costeEquipamiento;
        
        // Si no tiene bultos, mostrar fila vacía
        if (c.bultos.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span style="background:#34495e; color:white; padding:2px 8px; border-radius:4px; font-size:0.7rem;">${c.nombre.split(' (')[0]}</span></td>
                <td colspan="11" style="text-align: center; color: #666;">Sin cargas</td>
                <td style="text-align: right; font-weight: bold;">${costeEquipamiento.toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
            return;
        }
        
        c.bultos.forEach(b => {
            const alturaSuelo = (b.mesh.position.y - b.alto / 2).toFixed(2);
            const contenedorNombre = c.nombre.split(' (')[0];
            const colorHex = '#' + b.colorOriginal.toString(16).padStart(6, '0');
            const pesoPallet = this.calcularPesoPallet(b);
            totalGeneralPeso += pesoPallet;
            
            // Calcular coste del pallet (proporcional al peso que ocupa)
            const pesoTotalContenedor = c.bultos.reduce((acc, p) => acc + this.calcularPesoPallet(p), 0);
            const porcentajePallet = pesoTotalContenedor > 0 ? (pesoPallet / pesoTotalContenedor) : 0;
            const costePallet = costeEquipamiento * porcentajePallet;
            
            if (b.materiales.length > 0) {
                b.materiales.forEach((m, matIndex) => {
                    const hsCode = this.obtenerHsCode(m.materialId);
                    totalGeneralMateriales += m.cantidad;
                    
                    const tr = document.createElement('tr');
                    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                    tr.innerHTML = `
                        <td><span style="background:#34495e; color:white; padding:2px 8px; border-radius:4px; font-size:0.7rem;">${contenedorNombre}</span></td>
                        <td><strong>PL-${b.id}</strong></td>
                        <td>${b.tag}</td>
                        <td><span style="display:inline-block; width:12px; height:12px; background:${colorHex}; border-radius:2px;"></span> ${b.tipo || 'Carga'}</td>
                        <td>${b.largo.toFixed(2)}×${b.ancho.toFixed(2)}×${b.alto.toFixed(2)}</td>
                        <td>${alturaSuelo} m</td>
                        <td>${m.nombre}</td>
                        <td><span style="background:rgba(0,122,255,0.2); padding:2px 6px; border-radius:4px; font-size:10px; font-family: monospace;">${hsCode}</span></td>
                        <td style="text-align: center;">${m.cantidad}</td>
                        <td style="text-align: center; font-weight: bold;">${m.peso.toFixed(1)}</td>
                        <td style="text-align: center; font-size: 10px; color: #888;">
                            ${matIndex === 0 ? `<span style="font-weight: bold; color: #f1c40f;">${pesoPallet.toFixed(1)} kg</span>` : ''}
                        </td>
                        <td style="text-align: right; font-size: 11px;">
                            ${matIndex === 0 ? `<span style="font-weight: bold; color: #FF8C00;">$${costePallet.toFixed(2)}</span>` : ''}
                        </td>
                        <td style="text-align: center;">
                            <button class="btn btn-secondary btn-small" style="font-size: 9px; padding: 2px 6px;" onclick="window.appLogistica?.seleccionarPalletPorId(${b.id})"></button>
                            <button class="btn btn-danger btn-small" style="font-size: 9px; padding: 2px 6px;" onclick="window.appLogistica?.eliminarMaterialDesdePacking(${c.id}, ${b.id}, ${matIndex})"></button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                // Bulto sin materiales
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                tr.innerHTML = `
                    <td><span style="background:#34495e; color:white; padding:2px 8px; border-radius:4px; font-size:0.7rem;">${contenedorNombre}</span></td>
                    <td><strong>PL-${b.id}</strong></td>
                    <td>${b.tag}</td>
                    <td><span style="display:inline-block; width:12px; height:12px; background:${colorHex}; border-radius:2px;"></span> ${b.tipo || 'Carga'}</td>
                    <td>${b.largo.toFixed(2)}×${b.ancho.toFixed(2)}×${b.alto.toFixed(2)}</td>
                    <td>${alturaSuelo} m</td>
                    <td colspan="3" style="color:var(--text-muted); text-align: center;">Sin inventario</td>
                    <td style="text-align: center;">0</td>
                    <td style="text-align: center; font-size: 10px; color: #888;">0 kg</td>
                    <td style="text-align: right; font-size: 11px;">$0.00</td>
                    <td style="text-align: center;">
                        <button class="btn btn-secondary btn-small" style="font-size: 9px; padding: 2px 6px;" onclick="window.appLogistica?.seleccionarPalletPorId(${b.id})"></button>
                    </td>
                `;
                tbody.appendChild(tr);
            }
        });
    });

    // Añadir fila de totales
    if (this.listaContenedores.length > 0) {
        const trTotal = document.createElement('tr');
        trTotal.style.background = 'rgba(0,122,255,0.15)';
        trTotal.style.fontWeight = 'bold';
        trTotal.innerHTML = `
            <td colspan="9" style="padding: 12px; text-align: right; font-size: 13px;"> TOTALES GENERALES:</td>
            <td style="padding: 12px; text-align: center; font-size: 13px; color: #f1c40f;">${totalGeneralPeso.toFixed(1)} kg</td>
            <td style="padding: 12px; text-align: center; font-size: 12px; color: #888;">-</td>
            <td style="padding: 12px; text-align: right; font-size: 13px; color: #FF8C00; font-weight: bold;">$${totalGeneralCosto.toFixed(2)}</td>
            <td style="padding: 12px; text-align: center; font-size: 11px; color: #888;">${totalGeneralMateriales} materiales</td>
        `;
        tbody.appendChild(trTotal);
    }
}

// ============================================================
// EXPORTAR CSV MEJORADO CON TODOS LOS DATOS
// ============================================================
    
exportarCSV() {
    if (this.listaContenedores.length === 0) {
        mostrarToast('No hay datos para exportar', 'warning');
        return;
    }

    let csv = "Unidad,ID Carga,Etiqueta,Tipo,Largo (m),Ancho (m),Alto (m),Altura Suelo (m),Material,HS Code,Cantidad,Peso Material (kg),Peso Pallet (kg),Coste Pallet ($),Coste Equipamiento ($)\n";
    
    this.listaContenedores.forEach(c => {
        const costeEquipamiento = this.calcularCosteEquipamiento(c);
        const pesoTotalContenedor = c.bultos.reduce((acc, p) => acc + this.calcularPesoPallet(p), 0);
        
        c.bultos.forEach(b => {
            const alturaSuelo = (b.mesh.position.y - b.alto / 2).toFixed(2);
            const pesoPallet = this.calcularPesoPallet(b);
            const porcentajePallet = pesoTotalContenedor > 0 ? (pesoPallet / pesoTotalContenedor) : 0;
            const costePallet = costeEquipamiento * porcentajePallet;
            
            if (b.materiales.length > 0) {
                b.materiales.forEach(m => {
                    const hsCode = this.obtenerHsCode(m.materialId);
                    csv += `${c.nombre.split(' (')[0]},PL-${b.id},${b.tag},${b.tipo || 'Carga'},${b.largo.toFixed(2)},${b.ancho.toFixed(2)},${b.alto.toFixed(2)},${alturaSuelo},${m.nombre},${hsCode},${m.cantidad},${m.peso},${pesoPallet.toFixed(1)},${costePallet.toFixed(2)},${costeEquipamiento.toFixed(2)}\n`;
                });
            } else {
                csv += `${c.nombre.split(' (')[0]},PL-${b.id},${b.tag},${b.tipo || 'Carga'},${b.largo.toFixed(2)},${b.ancho.toFixed(2)},${b.alto.toFixed(2)},${alturaSuelo},VACÍO,N/A,0,0,${pesoPallet.toFixed(1)},${costePallet.toFixed(2)},${costeEquipamiento.toFixed(2)}\n`;
            }
        });
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `packing_list_completo_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(' Packing List completo exportado a CSV', 'success');
}

// ============================================================
// EXPORTAR PDF MEJORADO
// ============================================================
    
exportarPDF() {
    if (this.listaContenedores.length === 0) {
        mostrarToast('No hay datos para exportar a PDF', 'warning');
        return;
    }

    const ventana = window.open('', '_blank');
    if (!ventana) {
        mostrarToast(' No se pudo abrir la ventana. Permite popups.', 'error');
        return;
    }

    let tablaHtml = '';
    let totalGeneralPeso = 0;
    let totalGeneralCosto = 0;

    this.listaContenedores.forEach(c => {
        const costeEquipamiento = this.calcularCosteEquipamiento(c);
        const pesoTotalContenedor = c.bultos.reduce((acc, p) => acc + this.calcularPesoPallet(p), 0);
        
        c.bultos.forEach(b => {
            const pesoPallet = this.calcularPesoPallet(b);
            totalGeneralPeso += pesoPallet;
            const porcentajePallet = pesoTotalContenedor > 0 ? (pesoPallet / pesoTotalContenedor) : 0;
            const costePallet = costeEquipamiento * porcentajePallet;
            totalGeneralCosto += costePallet;
            
            if (b.materiales.length > 0) {
                b.materiales.forEach(m => {
                    const hsCode = this.obtenerHsCode(m.materialId);
                    tablaHtml += `
                        <tr>
                            <td>${c.nombre.split(' (')[0]}</td>
                            <td>PL-${b.id}</td>
                            <td>${b.tag}</td>
                            <td>${m.nombre}</td>
                            <td>${hsCode}</td>
                            <td style="text-align:center;">${m.cantidad}</td>
                            <td style="text-align:center;">${m.peso.toFixed(1)}</td>
                            <td style="text-align:center; font-weight:bold;">${pesoPallet.toFixed(1)}</td>
                            <td style="text-align:right; font-weight:bold; color:#FF8C00;">$${costePallet.toFixed(2)}</td>
                            <td style="text-align:right; color:#666;">$${costeEquipamiento.toFixed(2)}</td>
                        </tr>
                    `;
                });
            } else {
                tablaHtml += `
                    <tr>
                        <td>${c.nombre.split(' (')[0]}</td>
                        <td>PL-${b.id}</td>
                        <td>${b.tag}</td>
                        <td colspan="2" style="text-align:center; color:#888;">VACÍO</td>
                        <td style="text-align:center;">0</td>
                        <td style="text-align:center;">0</td>
                        <td style="text-align:center; font-weight:bold;">${pesoPallet.toFixed(1)}</td>
                        <td style="text-align:right; font-weight:bold; color:#FF8C00;">$${costePallet.toFixed(2)}</td>
                        <td style="text-align:right; color:#666;">$${costeEquipamiento.toFixed(2)}</td>
                    </tr>
                `;
            }
        });
    });

    ventana.document.write(`
        <html>
        <head>
            <title>Packing List Completo</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; background: #fff; }
                h1 { color: #007AFF; text-align: center; }
                .subtitle { text-align: center; color: #666; margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
                th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
                th { background: #007AFF; color: white; font-weight: bold; }
                .total-row { background: #f0f7ff; font-weight: bold; }
                .total-row td { border-top: 2px solid #007AFF; }
                .footer { margin-top: 30px; text-align: center; color: #888; font-size: 11px; border-top: 1px solid #eee; padding-top: 20px; }
                .right { text-align: right; }
                .center { text-align: center; }
                .badge { background: #007AFF; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; }
                .summary { display: flex; justify-content: space-around; background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 20px 0; }
                .summary-item { text-align: center; }
                .summary-item .label { font-size: 11px; color: #666; }
                .summary-item .value { font-size: 20px; font-weight: bold; color: #007AFF; }
            </style>
        </head>
        <body>
            <h1> PACKING LIST COMPLETO</h1>
            <p class="subtitle">Generado: ${new Date().toLocaleString()} | Proyecto: ${proyecto?.nombre || 'Sin proyecto'}</p>
            
            <div class="summary">
                <div class="summary-item">
                    <div class="label"> Total Contenedores</div>
                    <div class="value">${this.listaContenedores.length}</div>
                </div>
                <div class="summary-item">
                    <div class="label"> Total Cargas</div>
                    <div class="value">${this.listaContenedores.reduce((acc, c) => acc + c.bultos.length, 0)}</div>
                </div>
                <div class="summary-item">
                    <div class="label"> Peso Total</div>
                    <div class="value">${totalGeneralPeso.toFixed(1)} kg</div>
                </div>
                <div class="summary-item">
                    <div class="label"> Coste Total</div>
                    <div class="value" style="color: #FF8C00;">$${totalGeneralCosto.toFixed(2)}</div>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Unidad</th>
                        <th>ID</th>
                        <th>Etiqueta</th>
                        <th>Material</th>
                        <th>HS Code</th>
                        <th style="text-align:center;">Cant.</td>
                        <th style="text-align:center;">Peso Mat. (kg)</td>
                        <th style="text-align:center;">Peso Pallet (kg)</td>
                        <th style="text-align:right;">Coste Pallet</td>
                        <th style="text-align:right;">Coste Equip.</td>
                    </tr>
                </thead>
                <tbody>
                    ${tablaHtml}
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td colspan="7" style="text-align:right; font-size:13px;">TOTALES:</td>
                        <td style="text-align:center; font-size:13px;">${totalGeneralPeso.toFixed(1)} kg</td>
                        <td style="text-align:right; font-size:13px; color:#FF8C00;">$${totalGeneralCosto.toFixed(2)}</td>
                        <td style="text-align:right; font-size:12px; color:#666;">-</td>
                    </tr>
                </tfoot>
            </table>
            
            <div class="footer">
                <p>Documento generado por PMI Mind - Simulador Logístico 3D</p>
                <p style="font-size:10px;">* Los costes son estimados según el tipo de contenedor y el peso utilizado</p>
            </div>
            
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        setTimeout(function() { window.close(); }, 1000);
                    }, 500);
                };
            <\/script>
        </body>
        </html>
    `);
    ventana.document.close();
    ventana.focus();
}

    // ============================================================
    // CONFIGURAR DRAG CONTROLS
    // ============================================================
    
    configurarDragControls() {
        if (this.controlesArrastre) {
            this.controlesArrastre.dispose();
        }
        
        this.controlesArrastre = new THREE.DragControls(
            this.meshesArrastrables, 
            this.camara, 
            this.renderizador.domElement
        );
        
        this.controlesArrastre.addEventListener('dragstart', (event) => {
            this.controlesOrbita.enabled = false;
        });
        
        this.controlesArrastre.addEventListener('drag', (event) => {
            this.limitarMovimiento(event.object);
            if (this.meshResaltadoContorno && this.datosPalletSeleccionado) {
                this.meshResaltadoContorno.position.copy(event.object.position);
                this.meshResaltadoContorno.rotation.copy(event.object.rotation);
            }
        });
        
        this.controlesArrastre.addEventListener('dragend', (event) => {
            this.controlesOrbita.enabled = true;
            this.resolverSolapes(event.object);
            this.verificarInvasiones();
            this.actualizarInterfazGlobal();
            this.guardarEstado();
        });
    }

    // ============================================================
    // LIMITAR MOVIMIENTO
    // ============================================================
    
    limitarMovimiento(mesh) {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) return;
        
        const datosBulto = contActual.bultos.find(b => b.mesh === mesh);
        if (!datosBulto) return;
        
        const angulo = mesh.rotation.y;
        const esGiro90 = Math.abs(Math.sin(angulo)) > 0.1;
        
        const anchoEfectivo = esGiro90 ? datosBulto.largo : datosBulto.ancho;
        const largoEfectivo = esGiro90 ? datosBulto.ancho : datosBulto.largo;
        
        const semilargo = largoEfectivo / 2;
        const semiancho = anchoEfectivo / 2;
        const semiAlto = datosBulto.alto / 2;
        
        mesh.position.x = Math.max(-contActual.L / 2 + semilargo, Math.min(contActual.L / 2 - semilargo, mesh.position.x));
        mesh.position.z = Math.max(-contActual.A / 2 + semiancho, Math.min(contActual.A / 2 - semiancho, mesh.position.z));
        mesh.position.y = Math.max(semiAlto, Math.min(contActual.H - semiAlto, mesh.position.y));
    }

    // ============================================================
    // CLICK PARA SELECCIÓN
    // ============================================================
    
    onClick(event) {
        console.log(" Click en el visor 3D");
        
        if (!this.renderizador || !this.raycaster) return;
        
        const rect = this.renderizador.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camara);
        const intersecciones = this.raycaster.intersectObjects(this.meshesArrastrables);
        
        if (intersecciones.length > 0) {
            console.log(" Objeto seleccionado:", intersecciones[0].object);
            this.seleccionarPalletPorMesh(intersecciones[0].object);
        } else {
            console.log(" No se seleccionó ningún objeto");
            this.deseleccionarPallet();
        }
    }

    // ============================================================
    // HOVER TOOLTIP
    // ============================================================

    onHover(event) {
        const rect = this.renderizador.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camara);
        const intersecciones = this.raycaster.intersectObjects(this.meshesArrastrables);
        const tooltip = document.getElementById('log3dTooltip');
        if (!tooltip) return;
        if (intersecciones.length > 0) {
            const mesh = intersecciones[0].object;
            const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
            const bulto = contActual?.bultos.find(b => b.mesh === mesh);
            if (bulto) {
                let html = `<strong style="color:#f1c40f;"> PL-${bulto.id}</strong><br>`;
                html += `<span style="color:#aaa;">${bulto.tag}</span><br>`;
                html += `<span style="color:#888;font-size:11px;">${(bulto.largo).toFixed(2)}×${(bulto.ancho).toFixed(2)}×${(bulto.alto).toFixed(2)} m</span>`;
                if (bulto.materiales.length > 0) {
                    html += `<hr style="border-color:rgba(255,255,255,0.08); margin:6px 0;">`;
                    html += `<span style="color:#888;font-size:10px;">CONTENIDO:</span><br>`;
                    bulto.materiales.forEach(m => {
                        html += `<span style="font-size:11px;"> ${m.nombre} <span style="color:#888;">x${m.cantidad} (${m.peso} kg)</span></span><br>`;
                    });
                } else {
                    html += `<br><span style="color:#555;font-size:11px;">Vacío</span>`;
                }
                tooltip.innerHTML = html;
                tooltip.style.display = 'block';
                const visorRect = this.renderizador.domElement.getBoundingClientRect();
                let tx = event.clientX - visorRect.left + 15;
                let ty = event.clientY - visorRect.top - 10;
                if (tx + 290 > visorRect.width) tx = event.clientX - visorRect.left - 290;
                if (ty + 150 > visorRect.height) ty = visorRect.height - 160;
                if (ty < 0) ty = 5;
                tooltip.style.left = tx + 'px';
                tooltip.style.top = ty + 'px';
                this.renderizador.domElement.style.cursor = 'pointer';
                return;
            }
        }
        tooltip.style.display = 'none';
        this.renderizador.domElement.style.cursor = 'default';
    }

    // ============================================================
    // SELECCIÓN DE PALLET
    // ============================================================
    
    seleccionarPalletPorMesh(mesh) {
    console.log(" Seleccionando pallet...");
    
    const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
    if (!contActual) {
        console.warn(" No hay contenedor activo");
        return;
    }
    
    const bultoFound = contActual.bultos.find(b => b.mesh === mesh);
    if (!bultoFound) {
        console.warn(" Bulto no encontrado en el contenedor activo");
        return;
    }
    
    console.log(` Bulto seleccionado: PL-${bultoFound.id} (${bultoFound.tag})`);
    this.datosPalletSeleccionado = bultoFound;
    
    // Eliminar resaltado anterior
    if (this.meshResaltadoContorno && this.escena) {
        this.escena.remove(this.meshResaltadoContorno);
        this.meshResaltadoContorno = null;
    }
    
    // Crear nuevo resaltado
    try {
        const geomContorno = mesh.geometry.clone();
        const matContorno = new THREE.MeshBasicMaterial({ 
            color: 0xf1c40f, 
            wireframe: true,
            transparent: true,
            opacity: 0.9
        });
        this.meshResaltadoContorno = new THREE.Mesh(geomContorno, matContorno);
        this.meshResaltadoContorno.position.copy(mesh.position);
        this.meshResaltadoContorno.rotation.copy(mesh.rotation);
        this.meshResaltadoContorno.scale.set(1.05, 1.05, 1.05);
        this.escena.add(this.meshResaltadoContorno);
    } catch(e) {
        console.warn("Error al crear contorno:", e);
    }

    //  ACTUALIZAR EL PANEL DE MATERIALES
    const panel = document.getElementById('logSeccionMateriales');
    if (panel) {
        panel.style.opacity = "1";
        panel.style.pointerEvents = "auto";
        panel.style.background = 'rgba(0,122,255,0.05)';
        panel.style.border = '1px solid #007AFF';
    }
    
    const titulo = document.getElementById('logTituloMateriales');
    if (titulo) {
        titulo.innerHTML = `4. Materiales en: PL-${bultoFound.id} (${bultoFound.tag})`;
    }
    
    // Cargar materiales en el selector
    this.cargarMaterialesEnSelector();
    this.renderizarMaterialesDelPalletActivo();
    
    //  ACTUALIZAR EL RESUMEN DE MERCANCÍA
    this.actualizarResumenMercanciaUI();
    
    // Mostrar feedback visual
    mostrarToast(` Pallet PL-${bultoFound.id} seleccionado`, 'success');
}

    deseleccionarPallet() {
        if (this.meshResaltadoContorno && this.escena) {
            this.escena.remove(this.meshResaltadoContorno);
            this.meshResaltadoContorno = null;
        }
        this.datosPalletSeleccionado = null;
        
        const panel = document.getElementById('logSeccionMateriales');
        if (panel) {
            panel.style.opacity = "0.5";
            panel.style.pointerEvents = "none";
            panel.style.background = '';
            panel.style.border = '';
        }
        
        const titulo = document.getElementById('logTituloMateriales');
        if (titulo) {
            titulo.innerHTML = '4. Materiales de: Ninguno Seleccionado';
        }
        
        const lista = document.getElementById('logListaMateriales');
        if (lista) {
            lista.innerHTML = '<span style="color:var(--text-muted); font-size:0.8rem;">Selecciona una carga en el visor 3D</span>';
        }
    }

    // ============================================================
    // FUNCIONES DE CONTENEDORES
    // ============================================================
    
    cambiarModalidad() {
        const modo = document.getElementById('logModalidad').value;
        const selector = document.getElementById('logTipoUnidad');
        
        selector.innerHTML = '';
        this.catalogosUnidades[modo].forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.val;
            opt.innerText = item.texto;
            selector.appendChild(opt);
        });

        this.listaContenedores = [];
        this.idContenedorActivo = 0;
        this.nextPalletId = 1;
        this.agregarContenedor();
    }

    agregarContenedor() {
        const info = document.getElementById('logTipoUnidad').value.split('|');
        const modo = document.getElementById('logModalidad').value;
        
        let prefijo = "Unidad";
        if (modo === 'AEREO') prefijo = "ULD";
        else if (modo === 'MARITIMO') prefijo = "Contenedor";
        else prefijo = "Suelo Terrestre";

        const nuevoId = this.listaContenedores.length > 0 ? 
            Math.max(...this.listaContenedores.map(c => c.id)) + 1 : 1;

        this.listaContenedores.push({
            id: nuevoId,
            tipoNombre: info[4],
            nombre: `${prefijo} #${nuevoId} (${info[4]})`,
            L: parseFloat(info[0]),
            A: parseFloat(info[1]),
            H: parseFloat(info[2]),
            maxPeso: parseFloat(info[3]),
            bultos: []
        });
        
        this.seleccionarContenedor(nuevoId);
        mostrarToast(`Nueva unidad creada: ${prefijo} #${nuevoId}`, 'success');
    }

    seleccionarContenedor(id) {
    const contPrevio = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
    if (contPrevio) {
        contPrevio.bultos.forEach(b => {
            if (this.escena) this.escena.remove(b.mesh);
        });
    }
    if (this.meshResaltadoContorno && this.escena) {
        this.escena.remove(this.meshResaltadoContorno);
        this.meshResaltadoContorno = null;
    }

    this.idContenedorActivo = id;
    const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
    if (!contActual) return;
    
    this.dibujarEstructuraContenedor(contActual.L, contActual.A, contActual.H);

    this.meshesArrastrables = [];
    contActual.bultos.forEach(b => {
        if (this.escena) this.escena.add(b.mesh);
        this.meshesArrastrables.push(b.mesh);
    });

    this.configurarDragControls();
    this.deseleccionarPallet();
    this.verificarInvasiones();
    this.actualizarInterfazGlobal();
    
    //  ACTUALIZAR EL RESUMEN DE MERCANCÍA
    this.actualizarResumenMercanciaUI();
}

    actualizarUnidadActiva() {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) return;

        const info = document.getElementById('logTipoUnidad').value.split('|');
        const modo = document.getElementById('logModalidad').value;
        
        let prefijo = "Unidad";
        if (modo === 'AEREO') prefijo = "ULD";
        else if (modo === 'MARITIMO') prefijo = "Contenedor";
        else prefijo = "Suelo Terrestre";

        contActual.tipoNombre = info[4];
        contActual.nombre = `${prefijo} #${contActual.id} (${info[4]})`;
        contActual.L = parseFloat(info[0]);
        contActual.A = parseFloat(info[1]);
        contActual.H = parseFloat(info[2]);
        contActual.maxPeso = parseFloat(info[3]);

        this.dibujarEstructuraContenedor(contActual.L, contActual.A, contActual.H);
        this.verificarInvasiones();
        this.actualizarInterfazGlobal();
    }

    dibujarEstructuraContenedor(L, A, H) {
        if (!this.escena) return;
        
        if (this.mallaContenedor) {
            this.escena.remove(this.mallaContenedor);
            this.mallaContenedor = null;
        }
        if (this.lineasContenedor) {
            this.escena.remove(this.lineasContenedor);
            this.lineasContenedor = null;
        }

        const modoGlobal = document.getElementById('logModalidad').value;
        const geometria = new THREE.BoxGeometry(L, H, A);
        
        const opacidad = modoGlobal === 'SIN_CONTENEDOR' ? 0.0 : 0.08;
        let colorLinea = 0x4a6fa5;
        if (modoGlobal === 'MARITIMO') colorLinea = 0xe74c3c;
        else if (modoGlobal === 'SIN_CONTENEDOR') colorLinea = 0x27ae60;

        this.mallaContenedor = new THREE.Mesh(geometria, new THREE.MeshPhysicalMaterial({
            color: 0x88aacc,
            transparent: true,
            opacity: opacidad,
            depthWrite: false,
            side: THREE.DoubleSide
        }));
        this.mallaContenedor.position.set(0, H / 2, 0);
        this.escena.add(this.mallaContenedor);

        const edges = new THREE.EdgesGeometry(geometria);
        this.lineasContenedor = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: colorLinea, transparent: true, opacity: 0.6 })
        );
        this.lineasContenedor.position.copy(this.mallaContenedor.position);
        this.escena.add(this.lineasContenedor);
    }

    // ============================================================
    // CREAR CARGA
    // ============================================================
    
    crearCarga() {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) {
            mostrarToast('Primero crea una unidad de transporte', 'warning');
            return;
        }

        const tipo = document.getElementById('logTipoCarga').value;
        const tag = document.getElementById('logCargaTag').value.trim() || 'Carga';
        const cantidad = parseInt(document.getElementById('logCargaCantidad').value) || 1;
        const orientacion = parseInt(document.getElementById('logCargaOrientacion').value) || 0;
        
        let largo = parseFloat(document.getElementById('logCargaLargo').value) || 0;
        let ancho = parseFloat(document.getElementById('logCargaAncho').value) || 0;
        let alto = parseFloat(document.getElementById('logCargaAlto').value) || 0;

        if (largo <= 0 || ancho <= 0 || alto <= 0) {
            mostrarToast(' Las dimensiones deben ser mayores a 0', 'error');
            return;
        }

        const tipoNombre = this.tiposCarga[tipo]?.nombre || 'Personalizado';

        for (let i = 0; i < cantidad; i++) {
            const totalBultos = this.listaContenedores.reduce((sum, c) => sum + c.bultos.length, 0);
            const cPick = this.coloresPaleta[totalBultos % this.coloresPaleta.length];
            
            const geom = new THREE.BoxGeometry(largo, alto, ancho);
            const mat = new THREE.MeshPhysicalMaterial({ 
                color: cPick, 
                roughness: 0.4,
                metalness: 0.1,
                transparent: true,
                opacity: 0.95
            });
            const meshCaja = new THREE.Mesh(geom, mat);
            meshCaja.castShadow = true;
            meshCaja.receiveShadow = true;
            
            //  Añadir datos para identificación
            meshCaja.userData = {
                esCarga: true,
                id: this.nextPalletId,
                index: i
            };
            
            const edges = new THREE.EdgesGeometry(geom);
            const lineMat = new THREE.LineBasicMaterial({ color: 0x1c2833, transparent: true, opacity: 0.2 });
            const wireframe = new THREE.LineSegments(edges, lineMat);
            meshCaja.add(wireframe);

            const pos = this.encontrarPosicionLibre(largo, ancho, alto, contActual, null, orientacion === 90 ? Math.PI / 2 : 0);
            if (pos) {
                meshCaja.position.set(pos.x, pos.y, pos.z);
            } else {
                const spacing = 0.15;
                const col = i % 3;
                const row = Math.floor(i / 3);
                const xPos = -contActual.L / 2 + largo / 2 + spacing + col * (largo + spacing);
                const zPos = -contActual.A / 2 + ancho / 2 + spacing + row * (ancho + spacing);
                meshCaja.position.set(
                    Math.min(xPos, contActual.L / 2 - largo / 2),
                    alto / 2,
                    Math.min(zPos, contActual.A / 2 - ancho / 2)
                );
            }
            
            if (orientacion === 90) {
                meshCaja.rotation.y = Math.PI / 2;
            }

            if (this.escena) this.escena.add(meshCaja);
            this.meshesArrastrables.push(meshCaja);

            const nuevaCarga = {
                id: this.nextPalletId++,
                tag: `${tag}${cantidad > 1 ? ` #${i+1}` : ''}`,
                tipo: tipoNombre,
                largo: largo,
                ancho: ancho,
                alto: alto,
                mesh: meshCaja,
                colorOriginal: cPick,
                materiales: [],
                orientacion: orientacion
            };

            contActual.bultos.push(nuevaCarga);
        }

        this.configurarDragControls();
        this.resolverSolapes();
        this.verificarInvasiones();
        this.actualizarInterfazGlobal();
        mostrarToast(` ${cantidad} carga(s) "${tipoNombre}" ubicada(s)`, 'success');
    }

    // ============================================================
    // ELIMINAR CARGA
    // ============================================================
    
    eliminarUltimaCarga() {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual || contActual.bultos.length === 0) {
            mostrarToast('No hay cargas para eliminar', 'warning');
            return;
        }

        const ultimo = contActual.bultos[contActual.bultos.length - 1];
        
        if (confirm(`¿Eliminar la carga PL-${ultimo.id} (${ultimo.tag})?`)) {
            contActual.bultos.pop();
            if (this.escena) this.escena.remove(ultimo.mesh);
            
            if (this.datosPalletSeleccionado === ultimo) {
                this.deseleccionarPallet();
            }

            const idx = this.meshesArrastrables.indexOf(ultimo.mesh);
            if (idx > -1) this.meshesArrastrables.splice(idx, 1);
            
            this.configurarDragControls();
            this.verificarInvasiones();
            this.actualizarInterfazGlobal();
            mostrarToast(`Carga PL-${ultimo.id} eliminada`, 'warning');
        }
    }

    // ============================================================
    // AUTO-PLACEMENT: ENCONTRAR POSICIÓN LIBRE
    // ============================================================

    cajasSolapan(x1, z1, y1, l1, a1, h1, b2, rotacionY1) {
        const m2 = b2.mesh;
        const ang2 = m2.rotation.y;
        const esGiro2 = Math.abs(Math.sin(ang2)) > 0.1;
        const l2 = esGiro2 ? b2.ancho : b2.largo;
        const a2 = esGiro2 ? b2.largo : b2.ancho;
        const ang1 = rotacionY1 || 0;
        const esGiro1 = Math.abs(Math.sin(ang1)) > 0.1;
        const l1e = esGiro1 ? a1 : l1;
        const a1e = esGiro1 ? l1 : a1;
        const dx = Math.abs(x1 - m2.position.x);
        const dy = Math.abs(y1 - m2.position.y);
        const dz = Math.abs(z1 - m2.position.z);
        return dx < (l1e + l2) / 2 && dy < (h1 + b2.alto) / 2 && dz < (a1e + a2) / 2;
    }

    encontrarPosicionLibre(largo, ancho, alto, contActual, excluirMesh, rotacionY, cercaDe) {
        const spacing = 0.05;
        const ang = rotacionY || 0;
        const esGiro = Math.abs(Math.sin(ang)) > 0.1;
        const lEf = esGiro ? ancho : largo;
        const aEf = esGiro ? largo : ancho;
        const stepX = lEf + spacing;
        const stepZ = aEf + spacing;
        const stepY = alto + spacing;
        const maxCols = Math.max(1, Math.floor((contActual.L - lEf) / stepX) + 1);
        const maxRows = Math.max(1, Math.floor((contActual.A - aEf) / stepZ) + 1);
        const maxLayers = Math.max(1, Math.floor((contActual.H - alto) / stepY) + 1);
        const startX = -contActual.L / 2 + lEf / 2;
        const startZ = -contActual.A / 2 + aEf / 2;
        const posiciones = [];
        for (let layer = 0; layer < maxLayers; layer++) {
            for (let row = 0; row < maxRows; row++) {
                for (let col = 0; col < maxCols; col++) {
                    const x = startX + col * stepX;
                    const z = startZ + row * stepZ;
                    const y = alto / 2 + layer * stepY;
                    let solapa = false;
                    for (const b of contActual.bultos) {
                        if (excluirMesh && b.mesh === excluirMesh) continue;
                        if (this.cajasSolapan(x, z, y, lEf, aEf, alto, b, ang)) {
                            solapa = true;
                            break;
                        }
                    }
                    if (!solapa) {
                        const dist = cercaDe ? Math.sqrt((x-cercaDe.x)**2 + (y-cercaDe.y)**2 + (z-cercaDe.z)**2) : 0;
                        posiciones.push({ x, y, z, dist });
                    }
                }
            }
        }
        if (posiciones.length === 0) return null;
        posiciones.sort((a, b) => a.dist - b.dist);
        return posiciones[0];
    }

    resolverSolapes(excluirMesh) {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) return;
        for (let iter = 0; iter < 50; iter++) {
            let haySolape = false;
            for (let i = 0; i < contActual.bultos.length; i++) {
                for (let j = i + 1; j < contActual.bultos.length; j++) {
                    const bA = contActual.bultos[i];
                    const bB = contActual.bultos[j];
                    if (bA.mesh === excluirMesh && bB.mesh === excluirMesh) continue;
                    const angA = bA.mesh.rotation.y;
                    const angB = bB.mesh.rotation.y;
                    const esGA = Math.abs(Math.sin(angA)) > 0.1;
                    const esGB = Math.abs(Math.sin(angB)) > 0.1;
                    const lA = esGA ? bA.ancho : bA.largo;
                    const aA = esGA ? bA.largo : bA.ancho;
                    const lB = esGB ? bB.ancho : bB.largo;
                    const aB = esGB ? bB.largo : bB.ancho;
                    const dx = Math.abs(bA.mesh.position.x - bB.mesh.position.x);
                    const dy = Math.abs(bA.mesh.position.y - bB.mesh.position.y);
                    const dz = Math.abs(bA.mesh.position.z - bB.mesh.position.z);
                    if (dx < (lA + lB) / 2 && dy < (bA.alto + bB.alto) / 2 && dz < (aA + aB) / 2) {
                        haySolape = true;
                        let mover = bB;
                        if (excluirMesh && bB.mesh === excluirMesh) mover = bB;
                        else if (excluirMesh && bA.mesh === excluirMesh) mover = bA;
                        else if (dy < (bA.alto + bB.alto) / 2 - 0.01) mover = bB;
                        else mover = bB;
                        const angM = mover.mesh.rotation.y;
                        const esGM = Math.abs(Math.sin(angM)) > 0.1;
                        const lM = esGM ? mover.ancho : mover.largo;
                        const aM = esGM ? mover.largo : mover.ancho;
                        const cercaDe = { x: mover.mesh.position.x, y: mover.mesh.position.y, z: mover.mesh.position.z };
                        const pos = this.encontrarPosicionLibre(lM, aM, mover.alto, contActual, excluirMesh ? undefined : bA.mesh, angM, cercaDe);
                        if (pos) {
                            mover.mesh.position.set(pos.x, pos.y, pos.z);
                            if (this.meshResaltadoContorno && mover.mesh === this.datosPalletSeleccionado?.mesh) {
                                this.meshResaltadoContorno.position.copy(mover.mesh.position);
                            }
                        }
                        break;
                    }
                }
                if (haySolape) break;
            }
            if (!haySolape) break;
        }
    }

    // ============================================================
    // AUTO-ORDENAR Y MOVER SELECCIÓN
    // ============================================================

    autoOrdenarCarga() {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual || contActual.bultos.length === 0) {
            mostrarToast('No hay cargas para ordenar', 'warning');
            return;
        }
        const bultos = [...contActual.bultos].sort((a, b) => {
            const volA = a.largo * a.ancho * a.alto;
            const volB = b.largo * b.ancho * b.alto;
            return volB - volA;
        });
        const colocados = [];
        bultos.forEach(b => {
            const ang = b.mesh.rotation.y;
            const esGiro = Math.abs(Math.sin(ang)) > 0.1;
            const lEf = esGiro ? b.ancho : b.largo;
            const aEf = esGiro ? b.largo : b.ancho;
            const spacing = 0.05;
            const stepX = lEf + spacing;
            const stepZ = aEf + spacing;
            const stepY = b.alto + spacing;
            const maxCols = Math.max(1, Math.floor((contActual.L - lEf) / stepX) + 1);
            const maxRows = Math.max(1, Math.floor((contActual.A - aEf) / stepZ) + 1);
            const maxLayers = Math.max(1, Math.floor((contActual.H - b.alto) / stepY) + 1);
            const startX = -contActual.L / 2 + lEf / 2;
            const startZ = -contActual.A / 2 + aEf / 2;
            let colocado = false;
            for (let layer = 0; layer < maxLayers && !colocado; layer++) {
                for (let row = 0; row < maxRows && !colocado; row++) {
                    for (let col = 0; col < maxCols && !colocado; col++) {
                        const x = startX + col * stepX;
                        const z = startZ + row * stepZ;
                        const y = b.alto / 2 + layer * stepY;
                        let solapa = false;
                        for (const c of colocados) {
                            const dcx = Math.abs(x - c.x);
                            const dcy = Math.abs(y - c.y);
                            const dcz = Math.abs(z - c.z);
                            const angC = c.rot;
                            const esGC = Math.abs(Math.sin(angC)) > 0.1;
                            const lC = esGC ? c.ancho : c.largo;
                            const aC = esGC ? c.largo : c.ancho;
                            if (dcx < (lEf + lC) / 2 && dcy < (b.alto + c.alto) / 2 && dcz < (aEf + aC) / 2) {
                                solapa = true;
                                break;
                            }
                        }
                        if (!solapa) {
                            b.mesh.position.set(x, y, z);
                            colocados.push({ x, y, z, largo: lEf, ancho: aEf, alto: b.alto, rot: ang });
                            colocado = true;
                        }
                    }
                }
            }
            if (!colocado) {
                b.mesh.position.set(-contActual.L / 2 + lEf / 2, b.alto / 2, -contActual.A / 2 + aEf / 2);
                colocados.push({ x: b.mesh.position.x, y: b.mesh.position.y, z: b.mesh.position.z, largo: lEf, ancho: aEf, alto: b.alto, rot: ang });
            }
        });
        if (this.meshResaltadoContorno && this.datosPalletSeleccionado) {
            this.meshResaltadoContorno.position.copy(this.datosPalletSeleccionado.mesh.position);
            this.meshResaltadoContorno.rotation.copy(this.datosPalletSeleccionado.mesh.rotation);
        }
        this.verificarInvasiones();
        this.actualizarInterfazGlobal();
        this.guardarEstado();
        mostrarToast(' Cargas auto-ordenadas sin solapes', 'success');
    }

    moverSeleccion(direccion) {
        if (!this.datosPalletSeleccionado) {
            mostrarToast('Primero selecciona una carga', 'warning');
            return;
        }
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) return;
        const bulto = this.datosPalletSeleccionado;
        const mesh = bulto.mesh;
        const paso = 0.1;
        const oldX = mesh.position.x, oldY = mesh.position.y, oldZ = mesh.position.z;
        const ang = mesh.rotation.y;
        const esGiro = Math.abs(Math.sin(ang)) > 0.1;
        const lEf = esGiro ? bulto.ancho : bulto.largo;
        const aEf = esGiro ? bulto.largo : bulto.ancho;
        switch (direccion) {
            case 'izquierda': mesh.position.x -= paso; break;
            case 'derecha': mesh.position.x += paso; break;
            case 'adelante': mesh.position.z -= paso; break;
            case 'atras': mesh.position.z += paso; break;
            case 'subir': mesh.position.y += paso; break;
            case 'bajar': mesh.position.y -= paso; break;
            case 'suelo': mesh.position.y = bulto.alto / 2; break;
        }
        mesh.position.x = Math.max(-contActual.L / 2 + lEf / 2, Math.min(contActual.L / 2 - lEf / 2, mesh.position.x));
        mesh.position.z = Math.max(-contActual.A / 2 + aEf / 2, Math.min(contActual.A / 2 - aEf / 2, mesh.position.z));
        mesh.position.y = Math.max(bulto.alto / 2, Math.min(contActual.H - bulto.alto / 2, mesh.position.y));
        let solapa = false;
        for (const otro of contActual.bultos) {
            if (otro.mesh === mesh) continue;
            if (this.cajasSolapan(mesh.position.x, mesh.position.z, mesh.position.y, lEf, aEf, bulto.alto, otro, ang)) {
                solapa = true;
                break;
            }
        }
        if (solapa) {
            mesh.position.set(oldX, oldY, oldZ);
            mostrarToast(' No puedes mover aquí, hay otra carga', 'warning');
            return;
        }
        if (this.meshResaltadoContorno) {
            this.meshResaltadoContorno.position.copy(mesh.position);
        }
        this.verificarInvasiones();
        this.actualizarInterfazGlobal();
        this.guardarEstado();
    }

    // ============================================================
    // VERIFICACIÓN DE INVASIONES
    // ============================================================
    
    verificarInvasiones() {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) return;

        contActual.bultos.forEach(b => {
            b.mesh.material.color.setHex(b.colorOriginal);
        });

        for (let i = 0; i < contActual.bultos.length; i++) {
            const bA = contActual.bultos[i];
            for (let j = i + 1; j < contActual.bultos.length; j++) {
                const bB = contActual.bultos[j];
                
                const dx = Math.abs(bA.mesh.position.x - bB.mesh.position.x);
                const dy = Math.abs(bA.mesh.position.y - bB.mesh.position.y);
                const dz = Math.abs(bA.mesh.position.z - bB.mesh.position.z);
                
                const anguloA = bA.mesh.rotation.y;
                const anguloB = bB.mesh.rotation.y;
                const esGiroA = Math.abs(Math.sin(anguloA)) > 0.1;
                const esGiroB = Math.abs(Math.sin(anguloB)) > 0.1;
                
                const lA = esGiroA ? bA.ancho : bA.largo;
                const aA = esGiroA ? bA.largo : bA.ancho;
                const lB = esGiroB ? bB.ancho : bB.largo;
                const aB = esGiroB ? bB.largo : bB.ancho;
                
                const distX = (lA + lB) / 2;
                const distY = (bA.alto + bB.alto) / 2;
                const distZ = (aA + aB) / 2;
                
                if (dx < distX && dy < distY && dz < distZ) {
                    bA.mesh.material.color.setHex(0xe74c3c);
                    bB.mesh.material.color.setHex(0xe74c3c);
                }
            }
        }

        const pesoTotal = contActual.bultos.reduce((acc, p) => 
            acc + p.materiales.reduce((sm, m) => sm + (m.peso || 0), 0), 0);
        const errorPeso = pesoTotal > contActual.maxPeso;

        const banner = document.getElementById('logBannerAlerta');
        if (banner) {
            let hayError = false;
            contActual.bultos.forEach(b => {
                if (b.mesh.material.color.getHex() === 0xe74c3c) hayError = true;
            });
            banner.style.display = (hayError || errorPeso) ? 'block' : 'none';
            
            if (hayError && errorPeso) {
                banner.innerHTML = ' ¡INVASIÓN FÍSICA Y SOBREPESO DETECTADOS!';
                banner.style.background = 'rgba(255,59,48,0.3)';
            } else if (hayError) {
                banner.innerHTML = ' ¡INVASIÓN FÍSICA DETECTADA! Reorganiza la carga.';
                banner.style.background = 'rgba(255,59,48,0.2)';
            } else if (errorPeso) {
                banner.innerHTML = ` SOBREPESO: ${pesoTotal.toFixed(0)} kg / ${contActual.maxPeso.toFixed(0)} kg`;
                banner.style.background = 'rgba(255,140,0,0.2)';
            }
        }

        const pesoElement = document.getElementById('logMPeso');
        if (pesoElement) {
            if (contActual.maxPeso > 500000) {
                pesoElement.innerText = `${pesoTotal.toLocaleString()} kg / Libre`;
                pesoElement.style.color = pesoTotal > 0 ? '#00A859' : '#888';
            } else {
                const porcentaje = (pesoTotal / contActual.maxPeso) * 100;
                let color = '#00A859';
                if (porcentaje > 90) color = '#FF3B30';
                else if (porcentaje > 70) color = '#FF8C00';
                pesoElement.innerText = `${pesoTotal.toLocaleString()} / ${contActual.maxPeso.toLocaleString()} kg`;
                pesoElement.style.color = color;
            }
        }
    }

    // ============================================================
    // CARGAR MATERIALES EN SELECTOR
    // ============================================================
    
    cargarMaterialesEnSelector() {
        const select = document.getElementById('logMatSelector');
        if (!select) return;

        select.innerHTML = '<option value="">-- Seleccionar material --</option>';

        if (!proyecto || !proyecto.materiales || proyecto.materiales.length === 0) {
            select.innerHTML = '<option value=""> No hay materiales registrados</option>';
            return;
        }

        const asignados = new Set();
        this.listaContenedores.forEach(c => {
            c.bultos.forEach(b => {
                b.materiales.forEach(m => asignados.add(String(m.materialId)));
            });
        });

        proyecto.materiales.forEach(m => {
            const yaAsignado = asignados.has(String(m.id));
            const option = document.createElement('option');
            option.value = m.id;
            let texto = `${yaAsignado ? ' ' : ''}${m.nombre}`;
            if (m.proveedor) texto += ` (${m.proveedor})`;
            if (m.partNumber) texto += ` - ${m.partNumber}`;
            if (m.costeUnitario) texto += ` - ${m.costeUnitario} ${m.moneda}/ud`;
            if (m.cantidad !== undefined) texto += ` [Stock: ${m.cantidad}]`;
            if (yaAsignado) texto += ' (ya asignado)';
            option.textContent = texto;
            if (yaAsignado) option.disabled = true;
            select.appendChild(option);
        });
    }

    // ============================================================
    // RENDERIZAR MATERIALES DEL PALLET
    // ============================================================
    
    renderizarMaterialesDelPalletActivo() {
        const contenedor = document.getElementById('logListaMateriales');
        if (!contenedor) return;
        
        contenedor.innerHTML = '';

        if (!this.datosPalletSeleccionado || this.datosPalletSeleccionado.materiales.length === 0) {
            contenedor.innerHTML = '<span style="color:var(--text-muted); font-size:0.8rem;">Vacío. Selecciona materiales del desplegable.</span>';
            return;
        }

        this.datosPalletSeleccionado.materiales.forEach((m, index) => {
            const div = document.createElement('div');
            div.className = 'logistica-material-item';
            div.style.cssText = 'display:flex; justify-content:space-between; padding:8px; background:rgba(0,0,0,0.2); border-radius:8px; margin-bottom:4px;';
            div.innerHTML = `
                <div>
                     <strong>${m.nombre}</strong> 
                    <span style="background:rgba(0,122,255,0.2); padding:2px 6px; border-radius:4px; font-size:10px;">${m.hsCode || 'N/A'}</span>
                    (x${m.cantidad}) - ${m.peso} kg
                </div>
                <div>
                    <button class="btn btn-danger btn-small" onclick="window.appLogistica.eliminarMaterialDePallet(${index})"></button>
                </div>
            `;
            contenedor.appendChild(div);
        });
    }

    // ============================================================
    // GUARDAR MATERIAL
    // ============================================================
    
    guardarMaterial() {
        if (!this.datosPalletSeleccionado) {
            mostrarToast(' Primero selecciona una carga en el visor 3D', 'warning');
            return;
        }

        const materialSelect = document.getElementById('logMatSelector');
        const cantidad = parseInt(document.getElementById('logMatCant').value);
        const materialId = parseInt(materialSelect.value);

        if (!materialId || isNaN(cantidad) || cantidad < 1) {
            mostrarToast('Selecciona un material y una cantidad válida', 'error');
            return;
        }

        const material = proyecto.materiales.find(m => m.id === materialId);
        if (!material) {
            mostrarToast('Material no encontrado', 'error');
            return;
        }

        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        
        const pesoUnitario = material.pesoUnitario || 1;
        const pesoTotal = cantidad * pesoUnitario;

        const pesoTotalULD = contActual.bultos.reduce((acc, p) => 
            acc + p.materiales.reduce((sm, m) => sm + (m.peso || 0), 0), 0);
            
        if (pesoTotalULD + pesoTotal > contActual.maxPeso) {
            mostrarToast(' Excede la capacidad máxima del contenedor', 'error');
            return;
        }

        const materialData = {
            materialId: material.id,
            nombre: material.nombre,
            hsCode: material.hsCode || material.partNumber || 'N/A',
            cantidad: cantidad,
            peso: pesoTotal
        };

        this.datosPalletSeleccionado.materiales.push(materialData);

        this.cargarMaterialesEnSelector();
        this.renderizarMaterialesDelPalletActivo();
        this.verificarInvasiones();
        this.actualizarInterfazGlobal();
        mostrarToast(` ${cantidad} unidad(es) de "${material.nombre}" asignadas`, 'success');
        this.actualizarValorMercanciaUI();
        this.actualizarCostos();
        this.actualizarResumenMercanciaUI();
        this.actualizarCostos();
    }

    // ============================================================
    // ELIMINAR MATERIAL DEL PALLET
    // ============================================================
    
    eliminarMaterialDePallet(index) {
    if (!this.datosPalletSeleccionado) return;
    
    const nombre = this.datosPalletSeleccionado.materiales[index].nombre;
    if (confirm(`¿Eliminar "${nombre}" de la carga?`)) {
        this.datosPalletSeleccionado.materiales.splice(index, 1);
        this.cargarMaterialesEnSelector();
        this.renderizarMaterialesDelPalletActivo();
        this.verificarInvasiones();
        this.actualizarInterfazGlobal();
        mostrarToast(`Material "${nombre}" eliminado`, 'warning');
        
        //  ACTUALIZAR EL RESUMEN DE MERCANCÍA
        this.actualizarResumenMercanciaUI();
        this.actualizarCostos();
    }
}

    // ============================================================
    // SELECCIONAR PALLET POR ID
    // ============================================================
    
    seleccionarPalletPorId(id) {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) return;
        
        const bulto = contActual.bultos.find(b => b.id === id);
        if (bulto && bulto.mesh) {
            this.seleccionarPalletPorMesh(bulto.mesh);
        }
    }

    // ============================================================
    // ELIMINAR MATERIAL DESDE PACKING
    // ============================================================
    
    eliminarMaterialDesdePacking(contenedorId, palletId, materialIndex) {
        const contenedor = this.listaContenedores.find(c => c.id === contenedorId);
        if (!contenedor) return;
        
        const pallet = contenedor.bultos.find(b => b.id === palletId);
        if (!pallet || !pallet.materiales[materialIndex]) return;
        
        const nombre = pallet.materiales[materialIndex].nombre;
        
        if (confirm(`¿Eliminar "${nombre}" de la carga PL-${palletId}?`)) {
            pallet.materiales.splice(materialIndex, 1);
            
            if (this.datosPalletSeleccionado && this.datosPalletSeleccionado.id === palletId) {
                this.cargarMaterialesEnSelector();
                this.renderizarMaterialesDelPalletActivo();
            }
            this.verificarInvasiones();
            this.actualizarInterfazGlobal();
            mostrarToast(`Material "${nombre}" eliminado`, 'warning');
        }
    }

// ============================================================
// CÁLCULO DE COSTOS (ACTUALIZADO CON VALOR REAL DE MATERIALES)
// ============================================================
    
actualizarCostos() {
    const modo = document.getElementById('logModalidad').value;
    const incoterm = document.getElementById('logIncoterm').value;
    const origenCod = document.getElementById('logPaisOrigen').value;
    const destinoCod = document.getElementById('logPaisDestino').value;
    
    //  CALCULAR VALOR REAL DE LA MERCANCÍA desde los materiales asignados
    let valorMercancia = 0;
    const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
    
    if (contActual) {
        contActual.bultos.forEach(bulto => {
            bulto.materiales.forEach(mat => {
                // Buscar el material original en el proyecto para obtener su coste unitario
                const materialOriginal = proyecto.materiales.find(m => m.id === mat.materialId);
                if (materialOriginal) {
                    // El valor es: cantidad × coste unitario (convertido a la moneda base)
                    const costeUnitario = convertirMoneda(materialOriginal.costeUnitario, materialOriginal.moneda);
                    valorMercancia += mat.cantidad * costeUnitario;
                } else {
                    // Si no se encuentra el material original, usar un valor estimado
                    // (1€ por kg como aproximación)
                    valorMercancia += mat.peso * 1;
                }
            });
        });
    }
    
    // Si no hay materiales asignados, usar el valor manual como respaldo
    if (valorMercancia === 0) {
        valorMercancia = parseFloat(document.getElementById('logValorMercancia').value) || 0;
        mostrarToast(' Usando valor manual. Asigna materiales para cálculo automático.', 'info');
    } else {
        // Actualizar el campo de valor con el cálculo real (para transparencia)
        const valorInput = document.getElementById('logValorMercancia');
        if (valorInput) {
            valorInput.value = valorMercancia.toFixed(2);
            valorInput.style.background = 'rgba(0,168,89,0.15)';
            valorInput.style.border = '1px solid #00A859';
        }
    }

    if (!contActual) return;

    const origenInfo = this.paisesCatalogo[origenCod];
    const destinoInfo = this.paisesCatalogo[destinoCod];
    const origenNombre = origenInfo ? origenInfo.nombre : 'Desconocido';
    const destinoNombre = destinoInfo ? destinoInfo.nombre : 'Desconocido';

    const pesoTotalKilos = contActual.bultos.reduce((acc, p) => 
        acc + p.materiales.reduce((sm, m) => sm + (m.peso || 0), 0), 0);
    const volumenMetrosCubicos = contActual.bultos.reduce((acc, b) => 
        acc + (b.largo * b.ancho * b.alto), 0);

    // Cálculo de flete
    let precioFleteFijo = 0;
    const pesoVolumetrico = Math.max(pesoTotalKilos, volumenMetrosCubicos * 167);
    
    if (modo === "MARITIMO") {
        precioFleteFijo = 1500 + (volumenMetrosCubicos * 35) + (pesoTotalKilos * 0.05);
    } else if (modo === "AEREO") {
        precioFleteFijo = 300 + (pesoVolumetrico * 2.5) + (volumenMetrosCubicos * 200);
    } else {
        precioFleteFijo = 200 + (volumenMetrosCubicos * 40) + (pesoTotalKilos * 0.1);
    }

    // Aranceles basados en el valor REAL de la mercancía
    let arancelImpuesto = 0;
    let arancelPorcentaje = 0;
    if (origenCod && destinoCod && origenCod !== destinoCod) {
        if (destinoInfo && destinoInfo.arancelBase > 0) {
            arancelPorcentaje = destinoInfo.arancelBase;
            arancelImpuesto = valorMercancia * (arancelPorcentaje / 100);
        } else {
            arancelPorcentaje = 10;
            arancelImpuesto = valorMercancia * 0.10;
        }
    }

    const costoSeguro = Math.max(valorMercancia * 0.0075, 50);
    const gastosLocalesDestino = 250 + (pesoTotalKilos * 0.025);
    const costeTotalBase = precioFleteFijo + arancelImpuesto + costoSeguro + gastosLocalesDestino;

    let costoParaElVendedor = 0;
    let desgloseTexto = "";
    let desgloseDetallado = [];

    switch(incoterm) {
        case "DDP":
            costoParaElVendedor = costeTotalBase;
            desgloseDetallado = [
                { label: ` DDP: Vendedor paga Flete`, value: precioFleteFijo },
                { label: ` DDP: Vendedor paga Arancel (${arancelPorcentaje}%)`, value: arancelImpuesto },
                { label: ` DDP: Vendedor paga Seguro`, value: costoSeguro },
                { label: ` DDP: Vendedor paga Gastos Locales`, value: gastosLocalesDestino }
            ];
            desgloseTexto = ` Vendedor asume TODOS los costes: $${costoParaElVendedor.toFixed(2)}`;
            break;
        case "CIF":
            costoParaElVendedor = precioFleteFijo + costoSeguro;
            desgloseDetallado = [
                { label: ` CIF: Vendedor paga Flete`, value: precioFleteFijo },
                { label: ` CIF: Vendedor paga Seguro`, value: costoSeguro }
            ];
            desgloseTexto = ` Vendedor paga: Flete: $${precioFleteFijo.toFixed(2)} | Seguro: $${costoSeguro.toFixed(2)} | Comprador paga: Arancel: $${arancelImpuesto.toFixed(2)} | Locales: $${gastosLocalesDestino.toFixed(2)}`;
            break;
        default:
            costoParaElVendedor = 0;
            desgloseDetallado = [{ label: ` ${incoterm}: Comprador asume costes`, value: 0 }];
            desgloseTexto = ` Comprador paga: Flete: $${precioFleteFijo.toFixed(2)} | Arancel: $${arancelImpuesto.toFixed(2)} | Seguro: $${costoSeguro.toFixed(2)} | Locales: $${gastosLocalesDestino.toFixed(2)}`;
    }

    // Actualizar DOM
    const costosElement = document.getElementById('logMCostos');
    if (costosElement) {
        costosElement.innerText = `$${costoParaElVendedor.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD`;
        costosElement.style.color = costoParaElVendedor > 0 ? '#FF8C00' : '#007AFF';
    }
    
    const desgloseElement = document.getElementById('logMDesglose');
    if (desgloseElement) {
        let desgloseHtml = `<div style="font-size: 10px; margin-bottom: 4px;"> ${origenNombre} → ${destinoNombre}</div>`;
        desgloseHtml += `<div style="font-size: 11px; color: #00A859; margin-bottom: 4px;"> Valor mercancía: $${valorMercancia.toFixed(2)}</div>`;
        desgloseHtml += desgloseTexto;
        
        if (desgloseDetallado.length > 0) {
            const detalles = desgloseDetallado.map(d => 
                `<span style="display: inline-block; margin-right: 8px;">${d.label}: $${d.value.toFixed(2)}</span>`
            ).join('');
            desgloseHtml += `<div style="font-size: 9px; color: #888; margin-top: 4px;">${detalles}</div>`;
        }
        
        desgloseElement.innerHTML = desgloseHtml;
    }
}
// ============================================================
// MOSTRAR VALOR DE MERCANCÍA EN LA INTERFAZ
// ============================================================
    
actualizarValorMercanciaUI() {
    const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
    if (!contActual) return;
    
    let valorMercancia = 0;
    let totalMateriales = 0;
    let totalPeso = 0;
    
    contActual.bultos.forEach(bulto => {
        bulto.materiales.forEach(mat => {
            totalMateriales += mat.cantidad;
            totalPeso += mat.peso || 0;
            const materialOriginal = proyecto.materiales.find(m => m.id === mat.materialId);
            if (materialOriginal) {
                const costeUnitario = convertirMoneda(materialOriginal.costeUnitario, materialOriginal.moneda);
                valorMercancia += mat.cantidad * costeUnitario;
            } else {
                valorMercancia += mat.peso * 1; // Estimación
            }
        });
    });
    
    // Actualizar el campo de valor
    const valorInput = document.getElementById('logValorMercancia');
    if (valorInput) {
        if (valorMercancia > 0) {
            valorInput.value = valorMercancia.toFixed(2);
            valorInput.style.background = 'rgba(0,168,89,0.15)';
            valorInput.style.border = '1px solid #00A859';
            valorInput.title = ` Calculado desde ${totalMateriales} materiales (${totalPeso.toFixed(1)} kg)`;
        } else {
            valorInput.style.background = '';
            valorInput.style.border = '';
            valorInput.title = 'No hay materiales asignados';
        }
    }
    
    // Mostrar resumen en la interfaz
    const infoDiv = document.getElementById('infoEvolucionMoneda') || document.createElement('div');
    if (infoDiv.id === 'infoEvolucionMoneda') {
        // Si es el div de información de monedas, añadir el resumen
        const resumenHtml = `
            <div style="margin-top: 8px; padding: 8px; background: rgba(0,168,89,0.1); border-radius: 8px; font-size: 11px;">
                 <strong>Resumen de carga:</strong> ${totalMateriales} materiales | ${totalPeso.toFixed(1)} kg | 
                 Valor: $${valorMercancia.toFixed(2)}
            </div>
        `;
        // Insertar después del contenido existente
        infoDiv.insertAdjacentHTML('beforeend', resumenHtml);
    }
}
// ============================================================
// MOSTRAR VALOR DE MERCANCÍA EN LA INTERFAZ
// ============================================================
    
actualizarResumenMercanciaUI() {
    console.log(" Actualizando resumen de mercancía...");
    
    const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
    if (!contActual) {
        console.warn(" No hay contenedor activo");
        this.mostrarResumenVacio();
        return;
    }
    
    let valorMercancia = 0;
    let totalMateriales = 0;
    let totalPeso = 0;
    let detalleMateriales = [];
    
    // Recorrer todos los bultos del contenedor activo
    contActual.bultos.forEach(bulto => {
        if (bulto.materiales && bulto.materiales.length > 0) {
            bulto.materiales.forEach(mat => {
                totalMateriales += mat.cantidad;
                totalPeso += mat.peso || 0;
                
                // Buscar el material original en el proyecto para obtener su coste unitario
                const materialOriginal = proyecto?.materiales?.find(m => m.id === mat.materialId);
                if (materialOriginal) {
                    // Convertir el coste unitario a la moneda base
                    const costeUnitario = convertirMoneda(materialOriginal.costeUnitario, materialOriginal.moneda);
                    const valorItem = mat.cantidad * costeUnitario;
                    valorMercancia += valorItem;
                    detalleMateriales.push({
                        nombre: mat.nombre,
                        cantidad: mat.cantidad,
                        valor: valorItem,
                        peso: mat.peso || 0,
                        costeUnitario: costeUnitario,
                        moneda: materialOriginal.moneda
                    });
                } else {
                    // Si no se encuentra el material original, usar estimación por peso
                    const valorEstimado = mat.peso * 1; // 1€ por kg como estimación
                    valorMercancia += valorEstimado;
                    detalleMateriales.push({
                        nombre: mat.nombre + ' (estimado)',
                        cantidad: mat.cantidad,
                        valor: valorEstimado,
                        peso: mat.peso || 0,
                        costeUnitario: 1,
                        moneda: 'EUR'
                    });
                }
            });
        }
    });
    
    console.log(` Valor calculado: $${valorMercancia.toFixed(2)}`);
    console.log(` Materiales: ${totalMateriales}, Peso: ${totalPeso.toFixed(1)} kg`);
    
    
    // ============================================
    // ACTUALIZAR DOM
    // ============================================
    
    // Actualizar resumen de valor
    const resumenValor = document.getElementById('valorMercanciaResumen');
    if (resumenValor) {
        resumenValor.textContent = `$${valorMercancia.toFixed(2)}`;
        resumenValor.style.color = valorMercancia > 0 ? '#00A859' : '#888';
        resumenValor.style.fontWeight = 'bold';
    }
    
    // Actualizar resumen de materiales
    const resumenMateriales = document.getElementById('resumenMaterialesCarga');
    if (resumenMateriales) {
        if (totalMateriales > 0) {
            resumenMateriales.textContent = `${totalMateriales} materiales | ${totalPeso.toFixed(1)} kg | ${detalleMateriales.length} tipos`;
            resumenMateriales.style.color = '#fff';
        } else {
            resumenMateriales.textContent = '0 materiales | 0 kg';
            resumenMateriales.style.color = '#666';
        }
    }
    
    // Actualizar el campo de valor de mercancía
    const valorInput = document.getElementById('logValorMercancia');
    if (valorInput) {
        if (valorMercancia > 0) {
            valorInput.value = valorMercancia.toFixed(2);
            valorInput.style.background = 'rgba(0,168,89,0.15)';
            valorInput.style.border = '2px solid #00A859';
            valorInput.style.color = '#00A859';
            valorInput.title = ` Calculado desde ${totalMateriales} materiales (${totalPeso.toFixed(1)} kg)`;
        } else {
            valorInput.style.background = '';
            valorInput.style.border = '';
            valorInput.style.color = '';
            valorInput.title = 'No hay materiales asignados';
        }
    }
    
    // Actualizar costos (para recalcular aranceles, seguros, etc.)
    this.actualizarCostos();
    
    return { valorMercancia, totalMateriales, totalPeso, detalleMateriales };
}

// ============================================================
// MOSTRAR RESUMEN VACÍO
// ============================================================
    
mostrarResumenVacio() {
    const resumenValor = document.getElementById('valorMercanciaResumen');
    if (resumenValor) {
        resumenValor.textContent = '$0.00';
        resumenValor.style.color = '#888';
    }
    
    const resumenMateriales = document.getElementById('resumenMaterialesCarga');
    if (resumenMateriales) {
        resumenMateriales.textContent = '0 materiales | 0 kg';
        resumenMateriales.style.color = '#666';
    }
    
    const valorInput = document.getElementById('logValorMercancia');
    if (valorInput) {
        valorInput.style.background = '';
        valorInput.style.border = '';
        valorInput.style.color = '';
    }
}
    // ============================================================
    // INTERFAZ DE USUARIO
    // ============================================================
    
    actualizarInterfazGlobal() {
        const contenedorTabs = document.getElementById('logisticaTabs');
        if (!contenedorTabs) return;
        
        contenedorTabs.innerHTML = '';
        
        this.listaContenedores.forEach(c => {
            const pesoULD = c.bultos.reduce((acc, p) => acc + p.materiales.reduce((sm, m) => sm + m.peso, 0), 0);
            const btn = document.createElement('button');
            btn.className = `logistica-tab ${c.id === this.idContenedorActivo ? 'active' : ''}`;
            btn.innerText = `${c.nombre.split(' (')[0]} (${pesoULD.toLocaleString()} kg)`;
            btn.onclick = () => this.seleccionarContenedor(c.id);
            contenedorTabs.appendChild(btn);
        });

        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) return;

        const totalBultos = contActual.bultos.length;
        const totalVol = contActual.bultos.reduce((acc, b) => acc + (b.largo * b.ancho * b.alto), 0);

        document.getElementById('logMBultos').innerText = totalBultos;
        document.getElementById('logMVol').innerText = totalVol.toFixed(3) + " m³";
        
        this.actualizarCostos();
        this.actualizarTablaPacking();
    }

    // ============================================================
    // TABLA PACKING
    // ============================================================
    
    actualizarTablaPacking() {
        const tbody = document.getElementById('logPackingBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.listaContenedores.forEach(c => {
            c.bultos.forEach(b => {
                const alturaSuelo = (b.mesh.position.y - b.alto / 2).toFixed(2);
                const contenedorNombre = c.nombre.split(' (')[0];
                const colorHex = '#' + b.colorOriginal.toString(16).padStart(6, '0');
                
                if (b.materiales.length > 0) {
                    b.materiales.forEach((m, matIndex) => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td><span style="background:#34495e; color:white; padding:2px 8px; border-radius:4px; font-size:0.7rem;">${contenedorNombre}</span></td>
                            <td><strong>PL-${b.id}</strong></td>
                            <td>${b.tag}</td>
                            <td><span style="display:inline-block; width:12px; height:12px; background:${colorHex}; border-radius:2px;"></span> ${b.tipo || 'Carga'}</td>
                            <td>${b.largo.toFixed(2)}×${b.ancho.toFixed(2)}×${b.alto.toFixed(2)}</td>
                            <td>${alturaSuelo} m</td>
                            <td>${m.nombre}</td>
                            <td><span style="background:rgba(0,122,255,0.2); padding:2px 6px; border-radius:4px; font-size:10px;">${m.hsCode || 'N/A'}</span></td>
                            <td>${m.cantidad}</td>
                            <td>${m.peso.toFixed(1)}</td>
                            <td>
                                <button class="btn btn-secondary btn-small" onclick="window.appLogistica.seleccionarPalletPorId(${b.id})"></button>
                                <button class="btn btn-danger btn-small" onclick="window.appLogistica.eliminarMaterialDesdePacking(${c.id}, ${b.id}, ${matIndex})"></button>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                } else {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><span style="background:#34495e; color:white; padding:2px 8px; border-radius:4px; font-size:0.7rem;">${contenedorNombre}</span></td>
                        <td><strong>PL-${b.id}</strong></td>
                        <td>${b.tag}</td>
                        <td><span style="display:inline-block; width:12px; height:12px; background:${colorHex}; border-radius:2px;"></span> ${b.tipo || 'Carga'}</td>
                        <td>${b.largo.toFixed(2)}×${b.ancho.toFixed(2)}×${b.alto.toFixed(2)}</td>
                        <td>${alturaSuelo} m</td>
                        <td colspan="3" style="color:var(--text-muted);">Sin inventario</td>
                        <td>0</td>
                        <td>
                            <button class="btn btn-secondary btn-small" onclick="window.appLogistica.seleccionarPalletPorId(${b.id})"></button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                }
            });
        });
    }

    // ============================================================
    // CARGAR PAÍSES EN SELECTORES
    // ============================================================
    
    cargarPaisesEnSelectores() {
        const origenSelect = document.getElementById('logPaisOrigen');
        const destinoSelect = document.getElementById('logPaisDestino');
        
        if (!origenSelect || !destinoSelect) return;
        
        origenSelect.innerHTML = '';
        destinoSelect.innerHTML = '';
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Seleccionar país --';
        origenSelect.appendChild(defaultOption.cloneNode(true));
        destinoSelect.appendChild(defaultOption.cloneNode(true));
        
        const continentes = {};
        for (const [codigo, info] of Object.entries(this.paisesCatalogo)) {
            const cont = info.continente || 'Otros';
            if (!continentes[cont]) continentes[cont] = [];
            continentes[cont].push({ codigo, nombre: info.nombre });
        }
        
        const continentesOrdenados = ['Europa', 'África', 'América', 'Asia', 'Oceanía', 'Otros'];
        
        for (const cont of continentesOrdenados) {
            if (continentes[cont] && continentes[cont].length > 0) {
                const optgroup = document.createElement('optgroup');
                optgroup.label = cont;
                continentes[cont].sort((a, b) => a.nombre.localeCompare(b.nombre));
                
                for (const pais of continentes[cont]) {
                    const opt = document.createElement('option');
                    opt.value = pais.codigo;
                    opt.textContent = `${pais.nombre} (${pais.codigo})`;
                    if (pais.codigo === 'ES' && origenSelect.id === 'logPaisOrigen') opt.selected = true;
                    if (pais.codigo === 'MX' && destinoSelect.id === 'logPaisDestino') opt.selected = true;
                    optgroup.appendChild(opt);
                }
                origenSelect.appendChild(optgroup.cloneNode(true));
                destinoSelect.appendChild(optgroup.cloneNode(true));
            }
        }
    }

    // ============================================================
    // FUNCIONES DE CARGA PREDEFINIDA
    // ============================================================
    
    cargarTipoPredefinido() {
        const tipo = document.getElementById('logTipoCarga').value;
        const predefinido = this.tiposCarga[tipo];
        
        if (predefinido) {
            document.getElementById('logCargaLargo').value = predefinido.largo;
            document.getElementById('logCargaAncho').value = predefinido.ancho;
            document.getElementById('logCargaAlto').value = predefinido.alto;
        }
        
        this.actualizarPreviewDimension();
    }

    actualizarPreviewDimension() {
        const tipo = document.getElementById('logTipoCarga').value;
        const largo = parseFloat(document.getElementById('logCargaLargo').value) || 0;
        const ancho = parseFloat(document.getElementById('logCargaAncho').value) || 0;
        const alto = parseFloat(document.getElementById('logCargaAlto').value) || 0;
        const tipoNombre = this.tiposCarga[tipo]?.nombre || 'Personalizado';
        const volumen = largo * ancho * alto;
        
        const preview = document.getElementById('logPreviewDimension');
        if (preview) {
            preview.innerHTML = 
                ` <strong>${tipoNombre}</strong>: ${largo.toFixed(2)}m × ${ancho.toFixed(2)}m × ${alto.toFixed(2)}m | Volumen: ${volumen.toFixed(3)} m³`;
        }
    }

    // ============================================================
    // EXPORTAR
    // ============================================================
    
    exportarCSV() {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual || contActual.bultos.length === 0) {
            mostrarToast('No hay datos para exportar', 'warning');
            return;
        }

        let csv = "Unidad,ID Carga,Etiqueta,Tipo,Largo (m),Ancho (m),Alto (m),Altura Suelo (m),Material,HS Code,Cantidad,Peso (kg)\n";
        
        this.listaContenedores.forEach(c => {
            c.bultos.forEach(b => {
                const alturaSuelo = (b.mesh.position.y - b.alto / 2).toFixed(2);
                if (b.materiales.length > 0) {
                    b.materiales.forEach(m => {
                        csv += `${c.nombre.split(' (')[0]},PL-${b.id},${b.tag},${b.tipo || 'Carga'},${b.largo.toFixed(2)},${b.ancho.toFixed(2)},${b.alto.toFixed(2)},${alturaSuelo},${m.nombre},${m.hsCode || 'N/A'},${m.cantidad},${m.peso}\n`;
                    });
                } else {
                    csv += `${c.nombre.split(' (')[0]},PL-${b.id},${b.tag},${b.tipo || 'Carga'},${b.largo.toFixed(2)},${b.ancho.toFixed(2)},${b.alto.toFixed(2)},${alturaSuelo},VACÍO,N/A,0,0\n`;
                }
            });
        });

        const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `packing_list_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        mostrarToast(' Packing List exportado a CSV', 'success');
    }

    exportarPDF() {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual || contActual.bultos.length === 0) {
            mostrarToast('No hay datos para exportar a PDF', 'warning');
            return;
        }

        const ventana = window.open('', '_blank');
        if (ventana) {
            ventana.document.write(`
                <html>
                <head><title>Packing List</title>
                <style>
                    body { font-family: Arial; padding: 40px; }
                    h1 { color: #007AFF; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
                    th { background: #007AFF; color: white; }
                </style>
                </head>
                <body>
                    <h1> PACKING LIST</h1>
                    <p>Fecha: ${new Date().toLocaleString()}</p>
                    <table>
                        <thead><tr><th>Unidad</th><th>ID</th><th>Material</th><th>Cantidad</th><th>Peso (kg)</th></tr></thead>
                        <tbody>
            `);
            
            this.listaContenedores.forEach(c => {
                c.bultos.forEach(b => {
                    if (b.materiales.length > 0) {
                        b.materiales.forEach(m => {
                            ventana.document.write(`
                                <tr>
                                    <td>${c.nombre.split(' (')[0]}</td>
                                    <td>PL-${b.id}</td>
                                    <td>${m.nombre}</td>
                                    <td>${m.cantidad}</td>
                                    <td>${m.peso}</td>
                                </tr>
                            `);
                        });
                    }
                });
            });
            
            ventana.document.write(`
                        </tbody>
                    </table>
                    <p style="margin-top:30px; color:#888; font-size:12px;">Documento generado por PMI Mind</p>
                </body>
                </html>
            `);
            ventana.document.close();
            ventana.focus();
            ventana.print();
        } else {
            mostrarToast(' No se pudo abrir la ventana. Permite popups.', 'error');
        }
    }

    // ============================================================
    // GUARDAR / CARGAR ESTADO
    // ============================================================
    
    guardarEstado() {
        try {
            const estado = {
                contenedores: this.listaContenedores.map(c => ({
                    id: c.id,
                    tipoNombre: c.tipoNombre,
                    nombre: c.nombre,
                    L: c.L,
                    A: c.A,
                    H: c.H,
                    maxPeso: c.maxPeso,
                    bultos: c.bultos.map(b => ({
                        id: b.id,
                        tag: b.tag,
                        tipo: b.tipo,
                        largo: b.largo,
                        ancho: b.ancho,
                        alto: b.alto,
                        colorOriginal: b.colorOriginal,
                        orientacion: b.orientacion,
                        materiales: b.materiales,
                        posicion: {
                            x: b.mesh.position.x,
                            y: b.mesh.position.y,
                            z: b.mesh.position.z
                        },
                        rotacion: b.mesh.rotation.y
                    }))
                })),
                idActivo: this.idContenedorActivo,
                nextPalletId: this.nextPalletId,
                config: {
                    modalidad: document.getElementById('logModalidad').value,
                    origen: document.getElementById('logPaisOrigen').value,
                    destino: document.getElementById('logPaisDestino').value,
                    incoterm: document.getElementById('logIncoterm').value,
                    valorMercancia: document.getElementById('logValorMercancia').value
                }
            };
            
            localStorage.setItem('simuladorLogistico', JSON.stringify(estado));
            mostrarToast(' Estado guardado', 'success');
        } catch (e) {
            console.error(e);
            mostrarToast('Error al guardar', 'error');
        }
    }

    cargarEstado() {
        try {
            const data = localStorage.getItem('simuladorLogistico');
            if (!data) {
                mostrarToast('No hay estado guardado', 'warning');
                return;
            }

            const estado = JSON.parse(data);
            
            document.getElementById('logModalidad').value = estado.config.modalidad || 'AEREO';
            document.getElementById('logPaisOrigen').value = estado.config.origen || 'ES';
            document.getElementById('logPaisDestino').value = estado.config.destino || 'MX';
            document.getElementById('logIncoterm').value = estado.config.incoterm || 'CIF';
            document.getElementById('logValorMercancia').value = estado.config.valorMercancia || 15000;

            this.cambiarModalidad();
            
            this.listaContenedores = [];
            this.idContenedorActivo = estado.idActivo || 0;
            this.nextPalletId = estado.nextPalletId || 1;

            estado.contenedores.forEach(cData => {
                const cont = {
                    id: cData.id,
                    tipoNombre: cData.tipoNombre || '',
                    nombre: cData.nombre || '',
                    L: cData.L || 10,
                    A: cData.A || 8,
                    H: cData.H || 4,
                    maxPeso: cData.maxPeso || 999999,
                    bultos: []
                };

                cData.bultos.forEach(bData => {
                    const geom = new THREE.BoxGeometry(bData.largo, bData.alto, bData.ancho);
                    const mat = new THREE.MeshPhysicalMaterial({ 
                        color: bData.colorOriginal || 0x2980b9,
                        roughness: 0.4,
                        metalness: 0.1,
                        transparent: true,
                        opacity: 0.95
                    });
                    const mesh = new THREE.Mesh(geom, mat);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    
                    const edges = new THREE.EdgesGeometry(geom);
                    const lineMat = new THREE.LineBasicMaterial({ color: 0x1c2833, transparent: true, opacity: 0.2 });
                    const wireframe = new THREE.LineSegments(edges, lineMat);
                    mesh.add(wireframe);

                    mesh.position.set(bData.posicion.x, bData.posicion.y, bData.posicion.z);
                    mesh.rotation.y = bData.rotacion || 0;
                    
                    if (this.escena) this.escena.add(mesh);
                    this.meshesArrastrables.push(mesh);

                    cont.bultos.push({
                        id: bData.id,
                        tag: bData.tag || 'Cargado',
                        tipo: bData.tipo || 'Carga',
                        largo: bData.largo,
                        ancho: bData.ancho,
                        alto: bData.alto,
                        mesh: mesh,
                        colorOriginal: bData.colorOriginal || 0x2980b9,
                        materiales: bData.materiales || [],
                        orientacion: bData.orientacion || 0
                    });
                });

                this.listaContenedores.push(cont);
            });

            this.configurarDragControls();
            this.seleccionarContenedor(this.idContenedorActivo);
            this.actualizarInterfazGlobal();
            mostrarToast(' Estado cargado', 'success');
            
        } catch (e) {
            console.error(e);
            mostrarToast('Error al cargar', 'error');
        }
    }

    // ============================================================
    // VISTAS DE CÁMARA
    // ============================================================
    
    cambiarVista(modo) {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        const hTarget = contActual ? contActual.H / 2 : 1.5;
        const lTarget = contActual ? Math.max(contActual.L, contActual.A) / 2 + 2 : 5;
        
        let targetPos;
        const offset = 2;
        switch(modo) {
            case 'perspectiva':
                targetPos = new THREE.Vector3(lTarget * 0.7, lTarget * 0.6 + offset, lTarget * 0.8);
                break;
            case 'planta':
                targetPos = new THREE.Vector3(0.01, lTarget * 1.2 + offset, 0.01);
                break;
            case 'frontal':
                targetPos = new THREE.Vector3(0, hTarget + offset, lTarget);
                break;
            case 'reset':
            default:
                targetPos = new THREE.Vector3(8, 6 + offset, 10);
                break;
        }
        
        const startPos = this.camara.position.clone();
        const startTarget = this.controlesOrbita.target.clone();
        const endTarget = new THREE.Vector3(0, hTarget, 0);
        const startTime = Date.now();
        const duration = 500;
        
        const animateCamera = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            
            this.camara.position.lerpVectors(startPos, targetPos, ease);
            this.controlesOrbita.target.lerpVectors(startTarget, endTarget, ease);
            this.controlesOrbita.update();
            
            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };
        animateCamera();
    }

    // ============================================================
    // RESIZE Y ANIMACIÓN
    // ============================================================
    
    onWindowResize() {
    const contenedorVisor = document.getElementById('canvas3d-container');
    if (!contenedorVisor || !this.renderizador || !this.camara) return;
    
    // Esperar un poco para que el DOM se actualice
    setTimeout(() => {
        const w = contenedorVisor.clientWidth;
        const h = contenedorVisor.clientHeight;
        
        console.log(` Resize visor: ${w}x${h}`);
        
        if (w > 0 && h > 0) {
            // Actualizar cámara
            this.camara.aspect = w / h;
            this.camara.updateProjectionMatrix();
            
            // Actualizar renderizador
            this.renderizador.setSize(w, h);
            
            // Asegurar que el canvas ocupa todo
            this.renderizador.domElement.style.width = '100%';
            this.renderizador.domElement.style.height = '100%';
            
            // Actualizar controles
            if (this.controlesOrbita) {
                this.controlesOrbita.update();
            }
            
            console.log(` Visor actualizado a: ${w}x${h}`);
        }
    }, 50);
}

    verificarEstadoVisor() {
        const info = [];
        info.push(`THREE.js: ${typeof THREE !== 'undefined' ? '' : ''}`);
        info.push(`Escena: ${this.escena ? '' : ''}`);
        info.push(`Cámara: ${this.camara ? '' : ''}`);
        info.push(`Renderizador: ${this.renderizador ? '' : ''}`);
        info.push(`OrbitControls: ${this.controlesOrbita ? '' : ''}`);
        info.push(`Contenedores: ${this.listaContenedores.length}`);
        info.push(`Meshes arrastrables: ${this.meshesArrastrables.length}`);
        const cont = document.getElementById('canvas3d-container');
        if (cont) {
            info.push(`Contenedor DOM: ${cont.clientWidth}x${cont.clientHeight}`);
            info.push(`Canvas hijos: ${cont.querySelectorAll('canvas').length}`);
        }
        info.push(`Animación activa: ${this.inicializado ? '' : ''}`);
        alert(' Diagnóstico Visor 3D:\n' + info.join('\n'));
        console.log(' Diagnóstico:', info);
    }

    animate() {
        requestAnimationFrame(this.animate);
        if (this.controlesOrbita) this.controlesOrbita.update();
        if (this.renderizador && this.escena && this.camara) {
            this.renderizador.render(this.escena, this.camara);
        }
    }
};
// ============================================================
// INSTANCIA GLOBAL
// ============================================================

// Crear instancia SIEMPRE con la clase inline (más completa)
try {
    console.log(" Creando instancia SimuladorLogisticoApp...");
    window.appLogistica = new SimuladorLogisticoApp();
    console.log(" Instancia creada correctamente");
} catch (e) {
    console.error(" Error al crear instancia SimuladorLogisticoApp:", e);
}

// Funciones globales para los botones HTML
window.crearCarga = function() { 
    if (window.appLogistica) window.appLogistica.crearCarga(); 
};

window.eliminarUltimaCarga = function() { 
    if (window.appLogistica) window.appLogistica.eliminarUltimaCarga(); 
};

window.guardarEstado = function() { 
    if (window.appLogistica) window.appLogistica.guardarEstado(); 
};

window.cargarEstado = function() { 
    if (window.appLogistica) window.appLogistica.cargarEstado(); 
};

window.exportarCSV = function() { 
    if (window.appLogistica) window.appLogistica.exportarCSV(); 
};

window.exportarPDF = function() { 
    if (window.appLogistica) window.appLogistica.exportarPDF(); 
};

window.seleccionarPalletPorId = function(id) { 
    if (window.appLogistica) window.appLogistica.seleccionarPalletPorId(id); 
};

window.abrirModalEditarMaterial = function(c, p, m) { 
    if (window.appLogistica) window.appLogistica.abrirModalEditarMaterial(c, p, m); 
};

window.eliminarMaterialDesdePacking = function(c, p, m) { 
    if (window.appLogistica) window.appLogistica.eliminarMaterialDesdePacking(c, p, m); 
};

window.cerrarModalEditar = function() { 
    if (window.appLogistica) window.appLogistica.cerrarModalEditar(); 
};

window.guardarEdicionMaterial = function() { 
    if (window.appLogistica) window.appLogistica.guardarEdicionMaterial(); 
};

// Función de inicialización
function inicializarModuloLogistica() {
    console.log(" Inicializando módulo logístico 3D...");
    
    // Asegurar que la instancia existe
    if (!window.appLogistica) {
        console.warn(" appLogistica no existe, creando instancia...");
        try {
            window.appLogistica = new SimuladorLogisticoApp();
        } catch (e) {
            console.error(" No se pudo crear la instancia:", e);
            mostrarToast(" Error crítico en logística", 'error');
            return;
        }
    }
    
    if (typeof THREE === 'undefined') {
        console.warn(" Three.js no cargado. Intentando de nuevo...");
        mostrarToast(" Cargando motor 3D...", 'info');
        setTimeout(inicializarModuloLogistica, 1000);
        return;
    }
    
    // Verificar que los controles también están cargados
    if (typeof THREE.OrbitControls === 'undefined' || typeof THREE.DragControls === 'undefined') {
        console.warn(" Controles Three.js no cargados. Reintentando...");
        setTimeout(inicializarModuloLogistica, 1000);
        return;
    }
    
    if (!window.appLogistica.inicializado) {
        try {
            window.appLogistica.init();
            console.log(" Módulo logístico inicializado correctamente");
        } catch (e) {
            console.error(" Error al inicializar módulo logístico:", e);
            mostrarToast(" Error en logística: " + e.message, 'error');
        }
    }
}

// Función global para forzar reinicialización del módulo logístico (útil para depuración)
window.reiniciarLogistica = function() {
    console.log(" Forzando reinicialización del módulo logístico...");
    if (window.appLogistica) {
        window.appLogistica.inicializado = false;
        window.appLogistica.init();
    }
};

// Inicializar cuando el panel se active
document.addEventListener('DOMContentLoaded', function() {
    const panelLogistica = document.getElementById('panelLogistica');
    if (panelLogistica) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (panelLogistica.classList.contains('active')) {
                        setTimeout(inicializarModuloLogistica, 300);
                    }
                }
            });
        });
        observer.observe(panelLogistica, { attributes: true });
        
        if (panelLogistica.classList.contains('active')) {
            setTimeout(inicializarModuloLogistica, 500);
        }
    }
});

// Interceptar mostrarPanel
if (typeof mostrarPanel === 'function') {
    var mostrarPanelOriginal = mostrarPanel;
    mostrarPanel = function(panelId) {
        mostrarPanelOriginal(panelId);
        if (panelId === 'logistica' || panelId === 'Logistica') {
            setTimeout(inicializarModuloLogistica, 500);
        }
    };
}

console.log(" Módulo Logístico 3D con Three.js preparado");

        // ============================================
        // NAVEGACIÓN Y CARGA INICIAL
        // ============================================
        function mostrarPanel(panelId) {
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(`panel${panelId}`);
            if(panel) panel.classList.add('active');
            const pid = panelId.toLowerCase();
            if(pid === 'financiero') { inicializarConfigFinanciera(); calcularTodosLosCostesFinancieros(); }
            if(pid === 'cashflow') calcularCashflow();
            if(pid === 'resumengastos') { actualizarResumenGastos(); }
            if(pid === 'cronograma') cargarElementosGantt();
            if(pid === 'riesgos') { inicializarRiesgos(); renderizarAccionesMitigacion(); document.getElementById('valorProyectoRiesgos').value = proyecto.precioVenta || 0; calcularValorEsperado(); }
            if(pid === 'stakeholders') renderizarStakeholders();
            if(pid === 'raci') renderizarRACI();
            if(pid === 'monedas') { actualizarTiposCambioUI(); mostrarFechaUltimaActualizacion(); }
            if(pid === 'equipo') renderizarEquipo();
            if(pid === 'materiales') renderizarMateriales();
            if(pid === 'servicios') renderizarServicios();
            if(pid === 'comunicaciones') { renderizarComunicaciones(); renderizarReuniones(); document.querySelectorAll('.subpanel-comunicaciones').forEach(el => el.style.display = 'none'); document.getElementById('subpanelComunicaciones').style.display = 'block'; }
            if(pid === 'acta') renderizarActa();
            if(pid === 'dashboard') calcularCashflow();
            if(pid === 'procesos') renderizarProcesos();
            if(pid === 'roles') renderizarRoles();
            if(pid === 'viajes') { renderizarViajes(); }
            if(pid === 'garantia') { renderizarGarantia(); }
            if(pid === 'salud') { initPanelSalud(); }
            if(pid === 'beneficios') renderizarBeneficios();
            if(pid === 'cambios') renderizarCambios();
            if(pid === 'lecciones') renderizarLecciones();
            if(pid === 'metricasagiles') actualizarBurnDown();
            if(pid === 'sprintbacklog') renderizarSprintBacklog();
            if(pid === 'sprintburndown') renderizarBurndown();
            if(pid === 'velocitytracking') renderizarVelocityTracking();
            if(pid === 'retrospectives') renderizarRetrospectives();
            if(pid === 'agilemetrics') renderizarAgileMetrics();
            if(pid === 'sprintlist') renderizarListadoSprints();
            if(pid === 'logistica') { inicializarModuloLogistica(); }
        }
        
 function cargarProyecto() {

    var panelId = 'salud';
    let id = localStorage.getItem('proyectoSeleccionado');
    let todos = cargarProyectosStorage();
    let p = todos.find(p => p.id == id);
    if(p) {
        proyecto = p;
        if(!proyecto.configAranceles) proyecto.configAranceles = [];
        if(!proyecto.tasasAduanerasFijas) proyecto.tasasAduanerasFijas = [];
        if(!proyecto.costesFinancierosExtra) proyecto.costesFinancierosExtra = [];
        if(!proyecto.hitosFinancieros) proyecto.hitosFinancieros = [];
        if(!proyecto.stakeholders) proyecto.stakeholders = [];
        if(!proyecto.raci) proyecto.raci = [];
        if(!proyecto.equipo) proyecto.equipo = [];
        if(!proyecto.materiales) proyecto.materiales = [];
        if(!proyecto.servicios) proyecto.servicios = [];
        if(!proyecto.comunicaciones) proyecto.comunicaciones = [];
        if(!proyecto.reuniones) proyecto.reuniones = [];
        if(!proyecto.riesgos) proyecto.riesgos = [];
        if(!proyecto.accionesMitigacion) proyecto.accionesMitigacion = [];
        if(!proyecto.elementosGantt) proyecto.elementosGantt = [];
        if(!proyecto.procesos || proyecto.procesos.length === 0) proyecto.procesos = JSON.parse(JSON.stringify(PROCESOS_PMBOK));
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
    var proyectoId = parseInt(localStorage.getItem('proyectoSeleccionado'));
    var permisosModulos = usuario.permisosModulos || {};
    var modulosPermitidos = permisosModulos[proyectoId] || {};
    
    console.log(' Proyecto ID:', proyectoId);
    console.log(' Módulos permitidos:', modulosPermitidos);
    
    // Lista de TODOS los paneles posibles
    var todosLosPaneles = [
        'acta', 'dashboard', 'salud', 'finanzas', 'monedas', 'venta', 'cashflow', 
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
    
    // Mostrar controles de administración (solo admin)
    var adminControls = document.getElementById('adminControlsProyecto');
    if (adminControls) {
        adminControls.style.display = usuario.role === 'admin' ? 'block' : 'none';
    }
}
// ============================================================
// CERRAR SESIÓN DESDE PROYECTO
// ============================================================

function cerrarSesionProyecto() {
    if (confirm(tApp('confirmar_cerrar_sesion'))) {
        AuthSystem.logout();
        window.location.href = 'index.html';
    }
}

// Alias global para el botón de cerrar sesión
window.cerrarSesionProyecto = cerrarSesionProyecto;
// ============================================================
// FUNCIONES DE GESTIÓN (enlazadas a dashboard)
// ============================================================

function mostrarGestionUsuarios() {
    // Redirigir al dashboard donde está la gestión completa
    mostrarToast(' Abriendo gestión de usuarios...', 'info');
    window.location.href = 'dashboard.html';
}

function mostrarGestionPermisos() {
    mostrarToast(' Abriendo gestión de permisos...', 'info');
    window.location.href = 'dashboard.html';
}

// Sobrescribir mostrarLogin si no existe
if (typeof mostrarLogin === 'undefined') {
    function mostrarLogin() {
        window.location.href = 'index.html';
    }
}
        
        sincronizarActaConProyecto();
    } else {
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
            satisfaccionPromedio: 0
        };
        sincronizarActaConProyecto();
    }
    document.getElementById('projectName').innerHTML = proyecto.nombre;
    document.getElementById('projectDesc').innerHTML = proyecto.descripcion || '';
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
    renderizarGarantia();      //  Añadir esta línea
    calcularCashflow();
    cargarElementosGantt();
    renderizarComunicaciones();
    renderizarReuniones();
    renderizarViajes();        //  Añadir esta línea
    cargarTiposCambioCache();
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
    if (panelId && typeof mostrarPanel === 'function') {
    setTimeout(function() {
        mostrarPanel(panelId.charAt(0).toUpperCase() + panelId.slice(1));
    }, 100);
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
}

function cerrarModalSatisfaccion() {
    const modal = document.getElementById('modalSatisfaccion');
    if (modal) modal.style.display = 'none';
}
// ============================================
// SISTEMA DE NUMERACIÓN JERÁRQUICA EDT-ACTIVIDAD (CORREGIDO)
// ============================================

function obtenerPrefijoEDT(elementos, edtId) {
    const edt = elementos.find(e => e.id === edtId);
    if (!edt) return '';
    
    // Buscar el prefijo de la EDT padre
    let prefijo = '';
    if (edt.dependeDe) {
        const padreEDT = elementos.find(e => e.id === edt.dependeDe && e.tipo === 'edt');
        if (padreEDT) {
            prefijo = obtenerPrefijoEDT(elementos, padreEDT.id);
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
    switch (elemento.tipo) {
        case 'edt':
            return obtenerPrefijoEDT(elementos, elemento.id);
        case 'actividad':
            return obtenerNumeroActividad(elementos, elemento.id);
        case 'entregable':
            return obtenerNumeroEntregable(elementos, elemento.id);
        case 'hito':
            return obtenerNumeroHito(elementos, elemento.id);
        default:
            return '';
    }
}

        // ============================================
        // MATRIZ RACI - VERSIÓN CORREGIDA
        // ============================================
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
            
            const actividades = ['Acta Constitución', 'Planificación', 'Ejecución', 'Monitoreo', 'Cierre', 'Aprobaciones', 'Comunicaciones', 'Riesgos'];
            if (!proyecto.raci) proyecto.raci = [];
            
            let html = '<div class="raci-table u-overflow-x-auto"><table class="data-table" style="min-width: 500px;"><thead><tr><th>Actividad</th>';
            
            proyecto.stakeholders.forEach(s => {
                html += `<th class="u-fs-11">${escapeHtml(s.nombre.substring(0, 12))}</td>`;
            });
            html += '</tr></thead><tbody>';
            
            actividades.forEach(act => {
                html += `<tr><td class="u-bold">${escapeHtml(act)}</td>`;
                proyecto.stakeholders.forEach(s => {
                    const raciItem = proyecto.raci.find(r => r.actividad === act && r.stakeholderId === s.id);
                    const valor = raciItem ? raciItem.rol : '';
                    html += `<td class="u-text-center">
                        <select class="raci-select" style="width: 55px; padding: 4px; font-size: 11px;" onchange="guardarRACI('${act}', ${s.id}, this.value)">
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
            <div class="info-card u-mt-16">
                <small> <strong>R</strong> = Responsable (quien ejecuta) | <strong>A</strong> = Accountable (quien responde/aprueba) | <strong>C</strong> = Consultado | <strong>I</strong> = Informado</small>
            </div></div>`;
            
            container.innerHTML = html;
            console.log(" Matriz RACI renderizada correctamente");
        }
        
        function guardarRACI(actividad, stakeholderId, rol) {
            if (!proyecto.raci) proyecto.raci = [];
            const idx = proyecto.raci.findIndex(r => r.actividad === actividad && r.stakeholderId === stakeholderId);
            
            if (rol === '') {
                if (idx >= 0) proyecto.raci.splice(idx, 1);
            } else {
                if (idx >= 0) {
                    proyecto.raci[idx].rol = rol;
                } else {
                    proyecto.raci.push({ actividad, stakeholderId, rol });
                }
            }
            guardarProyecto();
            mostrarToast(` Rol ${rol} asignado para "${actividad}"`, 'success');
        }
function actualizarFechasProyectoDesdeActa() {
    if (proyecto.acta && proyecto.acta.fechaInicio) {
        proyecto.fechaInicio = proyecto.acta.fechaInicio;
    }
    if (proyecto.acta && proyecto.acta.fechaFin) {
        proyecto.fechaFinPlan = proyecto.acta.fechaFin;
    }
    guardarProyecto();
    renderizarGanttUnificado();
    mostrarToast(" Fechas del proyecto sincronizadas con el Acta", 'success');
}
 function init() { 
    initNavegacion(); 
    cargarProyecto(); 
    cargarTemaGuardado(); 
    cargarIdiomaApp(); 
    cargarUsuarioSesion();
}
let usuarioActual = null;

try { init(); } catch (e) { console.error(" init() failed:", e); }
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
        if (nombreDisplay) nombreDisplay.innerHTML = usuarioActual.nombre;
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
        usuarioActual = mapAuthUser(authUser);
        actualizarUIUsuario();
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
        AuthSystem.logout();
        usuarioActual = null;
        window.location.href = 'index.html';
    }
}

         // ============================================
        // FUNCIONES DE TEMA CLARO/OSCURO
        // ============================================
        
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const btn = document.getElementById('themeToggleBtn');
    const themeIcon = document.querySelector('#themeToggleBtn span:first-child');
    const themeText = document.querySelector('#themeToggleBtn span:last-child');
    
    if (currentTheme === 'light') {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('pmi_theme', 'dark');
        if (btn) {
            if (themeIcon) themeIcon.innerHTML = '';
            if (themeText) themeText.innerHTML = 'Tema oscuro';
        }
        mostrarToast(" Tema oscuro activado", 'info');
    } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('pmi_theme', 'light');
        if (btn) {
            if (themeIcon) themeIcon.innerHTML = '';
            if (themeText) themeText.innerHTML = 'Tema claro';
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
            const btn = document.getElementById('themeToggleBtn');
            
            if (temaGuardado === 'light') {
                html.setAttribute('data-theme', 'light');
                if (btn) btn.innerHTML = '';
            } else {
                html.setAttribute('data-theme', 'dark');
                if (btn) btn.innerHTML = '';
            }
        }


                // ============================================
        // TEMA CLARO/OSCURO
        // ============================================
        
        window.toggleTheme = function() {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme');
            const btn = document.getElementById('themeToggleBtn');
            
            if (current === 'light') {
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('pmi_theme', 'dark');
                if (btn) btn.innerHTML = '';
                if (typeof mostrarToast === 'function') mostrarToast(" Tema oscuro", 'info');
            } else {
                html.setAttribute('data-theme', 'light');
                localStorage.setItem('pmi_theme', 'light');
                if (btn) btn.innerHTML = '';
                if (typeof mostrarToast === 'function') mostrarToast(" Tema claro", 'info');
            }
        };
        
        // Inicializar tema al cargar
        (function initTheme() {
            const temaGuardado = localStorage.getItem('pmi_theme');
            const html = document.documentElement;
            const btn = document.getElementById('themeToggleBtn');
            
            if (temaGuardado === 'light') {
                html.setAttribute('data-theme', 'light');
                if (btn) btn.innerHTML = '';
            } else {
                html.setAttribute('data-theme', 'dark');
                if (btn) btn.innerHTML = '';
            }
        })();
// ============================================