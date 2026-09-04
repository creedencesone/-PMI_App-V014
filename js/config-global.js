    // ============================================
    // CONFIGURACIÓN GLOBAL
    // ============================================
        const MONEDAS = {
            EUR: "Euro (€)", USD: "Dólar ($)", GBP: "Libra (£)", JPY: "Yen (¥)", CHF: "Franco (₣)",
            BRL: "Real (R$)", MXN: "Peso Mexicano (Mex$)", COP: "Peso Colombiano (COL$)", ARS: "Peso Argentino (ARS$)", CLP: "Peso Chileno (CLP$)",
            DZD: "Dinar Argelino (دج)", CDF: "Franco Congoleño (FC)", MZN: "Metical (MT)", ZAR: "Rand (R)", NGN: "Naira (₦)", KES: "Chelín (KSh)", EGP: "Libra (E£)", MAD: "Dirham (د.م.)",
            GHS: "Cedi Ghanés (GH₵)", TND: "Dinar Tunecino (د.ت)", ETB: "Birr Etíope (Br)", TZS: "Chelín Tanzano (TSh)", UGX: "Chelín Ugandés (USh)", RWF: "Franco Ruandés (FRw)", AOA: "Kwanza (Kz)", XOF: "Franco CFA (CFA)", XAF: "Franco CFA (FCFA)", ZMW: "Kwacha (ZK)", BWP: "Pula (P)", MUR: "Rupia (₨)"
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

        const FASE_COLORS = {
            "Inicio": "#E54D42",
            "Planificación": "#F59E0B",
            "Ejecución": "#EAB308",
            "Monitoreo y Control": "#10B981",
            "Cierre": "#065F46"
        };
        
        // ============================================
        // ALMACENAMIENTO UNIFICADO
        // ============================================
        const STORAGE_PROYECTOS_KEY = 'pmi_proyectos';
        const STORAGE_OLD_KEYS = ['pmi_proyectos_v11', 'pmi_proyectos_v6'];
        const STORAGE_BACKUP_KEYS = ['pmi_proyectos_bkp1', 'pmi_proyectos_bkp2'];
        const STORAGE_RECOVERY_KEY = 'pmi_recovery';
        
        function cargarProyectosStorage() {
            let data;
            data = localStorage.getItem(STORAGE_PROYECTOS_KEY);
            if (data) {
                try { return JSON.parse(data); } catch {}
            }
            for (const bkpKey of STORAGE_BACKUP_KEYS) {
                data = localStorage.getItem(bkpKey);
                if (data) {
                    try {
                        const proyectos = JSON.parse(data);
                        localStorage.setItem(STORAGE_PROYECTOS_KEY, data);
                        return proyectos;
                    } catch { continue; }
                }
            }
            data = localStorage.getItem(STORAGE_RECOVERY_KEY);
            if (data) {
                try {
                    const recovery = JSON.parse(data);
                    if (recovery.data && Array.isArray(recovery.data)) {
                        const json = JSON.stringify(recovery.data);
                        localStorage.setItem(STORAGE_PROYECTOS_KEY, json);
                        return recovery.data;
                    }
                } catch {}
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
            const json = JSON.stringify(proyectos);
            try {
                localStorage.setItem(STORAGE_PROYECTOS_KEY, json);
            } catch (e) {
                console.error('localStorage lleno, intentando liberar espacio...');
                // Intentar eliminar backups viejos para liberar espacio
                try { localStorage.removeItem(STORAGE_RECOVERY_KEY); } catch {}
                STORAGE_BACKUP_KEYS.forEach(k => { try { localStorage.removeItem(k); } catch {} });
                try { localStorage.setItem(STORAGE_PROYECTOS_KEY, json); } catch (e2) {
                    throw new Error('Almacenamiento local lleno. Libera espacio o exporta proyectos.');
                }
            }
            for (const bkpKey of STORAGE_BACKUP_KEYS) {
                try { localStorage.setItem(bkpKey, json); } catch {}
            }
            try {
                localStorage.setItem(STORAGE_RECOVERY_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    data: proyectos
                }));
            } catch {}
        }



        function seedProyectosDemo() {
            const demos = [
                {
                    id: Date.now() + 1,
                    nombre: 'Proyecto Demo - ERP Cloud',
                    descripcion: 'Implementación de ERP en la nube para empresa retail con módulos de finanzas, inventario y CRM.',
                    fechaInicio: new Date().toISOString().split('T')[0],
                    fechaFinPlan: new Date(Date.now() + 180*86400000).toISOString().split('T')[0],
                    monedaBase: 'EUR',
                    pais: 'España',
                    metodologia: { tipo: 'mixto' },
                    precioVenta: 450000,
                    estado: 'activo',
                    elementosGantt: [
                        { id: 1, nombre: 'Análisis de requisitos', inicio: new Date().toISOString().split('T')[0], fin: new Date(Date.now() + 30*86400000).toISOString().split('T')[0], progreso: 100, tipo: 'tarea', responsable: 'PM', estado: 'completada' },
                        { id: 2, nombre: 'MVP Funcional', inicio: new Date(Date.now() + 15*86400000).toISOString().split('T')[0], fin: new Date(Date.now() + 75*86400000).toISOString().split('T')[0], progreso: 60, tipo: 'hito', responsable: 'Tech Lead', estado: 'en_curso' },
                        { id: 3, nombre: 'Manual de usuario', inicio: new Date(Date.now() + 60*86400000).toISOString().split('T')[0], fin: new Date(Date.now() + 120*86400000).toISOString().split('T')[0], progreso: 20, tipo: 'entregable', responsable: 'Documentación', estado: 'en_curso' }
                    ],
                    hitosFinancieros: [
                        { id: 1, nombre: 'Anticipo 30%', mes: 1, porcentaje: 30, moneda: 'EUR', importeFijo: 135000, metodoPago: 'transferencia' },
                        { id: 2, nombre: 'Hito intermedio 40%', mes: 4, porcentaje: 40, moneda: 'EUR', importeFijo: 180000, metodoPago: 'transferencia' },
                        { id: 3, nombre: 'Entrega final 30%', mes: 7, porcentaje: 30, moneda: 'EUR', importeFijo: 135000, metodoPago: 'transferencia' }
                    ],
                    equipo: [
                        { id: 1, nombre: 'Project Manager', costeHora: 50, horasMes: 160, tipo: 'interno' },
                        { id: 2, nombre: 'Desarrollador Senior', costeHora: 40, horasMes: 160, tipo: 'interno' },
                        { id: 3, nombre: 'Consultor Funcional', costeHora: 45, horasMes: 120, tipo: 'externo' }
                    ],
                    riesgos: [
                        { id: 1, nombre: 'Retraso en entregas', probabilidad: 3, impacto: 4, categoria: 'cronograma', estado: 'activo', planRespuesta: 'Asignar recursos extra' },
                        { id: 2, nombre: 'Cambio de requisitos', probabilidad: 4, impacto: 3, categoria: 'alcance', estado: 'activo', planRespuesta: 'Proceso formal de cambios' }
                    ],
                    stakeholders: [
                        { id: 1, nombre: 'Director General', poder: 5, interes: 5, rol: 'sponsor' },
                        { id: 2, nombre: 'Director TI', poder: 4, interes: 5, rol: 'key_user' }
                    ]
                },
                {
                    id: Date.now() + 2,
                    nombre: 'Proyecto Demo - Desarrollo App Móvil',
                    descripcion: 'Aplicación móvil cross-platform para banca digital con autenticación biométrica.',
                    fechaInicio: new Date().toISOString().split('T')[0],
                    fechaFinPlan: new Date(Date.now() + 120*86400000).toISOString().split('T')[0],
                    monedaBase: 'USD',
                    pais: 'Estados Unidos',
                    metodologia: { tipo: 'agile' },
                    precioVenta: 280000,
                    estado: 'activo',
                    elementosGantt: [
                        { id: 1, nombre: 'Sprint 1 - Auth', inicio: new Date().toISOString().split('T')[0], fin: new Date(Date.now() + 14*86400000).toISOString().split('T')[0], progreso: 100, tipo: 'tarea', estado: 'completada' },
                        { id: 2, nombre: 'Sprint 2 - Dashboard', inicio: new Date(Date.now() + 14*86400000).toISOString().split('T')[0], fin: new Date(Date.now() + 28*86400000).toISOString().split('T')[0], progreso: 70, tipo: 'tarea', estado: 'en_curso' }
                    ],
                    hitosFinancieros: [
                        { id: 1, nombre: 'Anticipo 50%', mes: 1, porcentaje: 50, moneda: 'USD', importeFijo: 140000, metodoPago: 'transferencia' },
                        { id: 2, nombre: 'Entrega 50%', mes: 5, porcentaje: 50, moneda: 'USD', importeFijo: 140000, metodoPago: 'transferencia' }
                    ],
                    equipo: [
                        { id: 1, nombre: 'Scrum Master', costeHora: 55, horasMes: 160, tipo: 'interno' },
                        { id: 2, nombre: 'Desarrollador Mobile', costeHora: 45, horasMes: 160, tipo: 'interno' },
                        { id: 3, nombre: 'Diseñador UX', costeHora: 35, horasMes: 80, tipo: 'externo' }
                    ],
                    riesgos: [
                        { id: 1, nombre: 'Fragilidad en API', probabilidad: 3, impacto: 3, categoria: 'tecnico', estado: 'activo' }
                    ],
                    stakeholders: [
                        { id: 1, nombre: 'CTO', poder: 5, interes: 4, rol: 'sponsor' },
                        { id: 2, nombre: 'Product Owner', poder: 4, interes: 5, rol: 'key_user' }
                    ]
                }
            ];
            return demos;
        }
        
        let tiposCambio = { EUR:1, USD:1.09, GBP:0.86, JPY:164, CHF:0.95, BRL:5.45, MXN:18.25, COP:4190, ARS:950, CLP:920, DZD:134, CDF:2800, MZN:64, ZAR:18.5, NGN:1500, KES:140, EGP:48, MAD:10.8, GHS:11.5, TND:3.3, ETB:115, TZS:2700, UGX:4000, RWF:1380, AOA:900, XOF:655.96, XAF:655.96, ZMW:24.5, BWP:13.5, MUR:48 };
        // window.proyecto (no `let`): DataService.syncProyecto() lee window.proyecto.
        window.proyecto = null;
        let cashflowChart = null, dashboardChart = null;
        let elementosGantt = [];
        let zoomLevel = 1;
        let matrizChart = null;
        let pdfActualBase64 = null;
        let pdfActualNombre = null;
        let burndownChart = null;
        let velocityChart = null;
        let cumulativeFlowChart = null;
