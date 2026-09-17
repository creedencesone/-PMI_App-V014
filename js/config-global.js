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
            // Inicio
            {id:1, grupo:"Inicio", dominio:"Dirección", codigo:"A.1", nombre:"Inicio del proyecto (Acta)", completado:false},
            {id:2, grupo:"Inicio", dominio:"Interesados", codigo:"E.1", nombre:"Interesados del Proyecto", completado:false},
            // Planificación
            {id:3, grupo:"Planificación", dominio:"Dirección", codigo:"A.2", nombre:"Integrar y alinear los planes del proyecto", completado:false},
            {id:4, grupo:"Planificación", dominio:"Dirección", codigo:"A.3", nombre:"Definir estrategia de suministros", completado:false},
            {id:5, grupo:"Planificación", dominio:"Alcance", codigo:"B.1", nombre:"Definir la gestión del alcance", completado:false},
            {id:6, grupo:"Planificación", dominio:"Alcance", codigo:"B.2", nombre:"Recopilar y analizar requisitos", completado:false},
            {id:7, grupo:"Planificación", dominio:"Alcance", codigo:"B.3", nombre:"Definir el alcance", completado:false},
            {id:8, grupo:"Planificación", dominio:"Alcance", codigo:"B.4", nombre:"Desarrollar la estructura del alcance", completado:false},
            {id:9, grupo:"Planificación", dominio:"Cronograma", codigo:"C.1", nombre:"Planificar la gestión del cronograma", completado:false},
            {id:10, grupo:"Planificación", dominio:"Cronograma", codigo:"C.2", nombre:"Desarrollar el cronograma", completado:false},
            {id:11, grupo:"Planificación", dominio:"Finanzas", codigo:"D.1", nombre:"Planificar la gestión financiera", completado:false},
            {id:12, grupo:"Planificación", dominio:"Finanzas", codigo:"D.2", nombre:"Estimar los costes", completado:false},
            {id:13, grupo:"Planificación", dominio:"Finanzas", codigo:"D.3", nombre:"Desarrollar el presupuesto", completado:false},
            {id:14, grupo:"Planificación", dominio:"Interesados", codigo:"E.2", nombre:"Planificar la participación de los interesados", completado:false},
            {id:15, grupo:"Planificación", dominio:"Interesados", codigo:"E.3", nombre:"Planificar la gestión de las comunicaciones", completado:false},
            {id:16, grupo:"Planificación", dominio:"Recursos", codigo:"F.1", nombre:"Planificar la gestión de los recursos", completado:false},
            {id:17, grupo:"Planificación", dominio:"Recursos", codigo:"F.2", nombre:"Estimar los recursos", completado:false},
            {id:18, grupo:"Planificación", dominio:"Riesgos", codigo:"G.1", nombre:"Planificar la gestión de riesgos", completado:false},
            {id:19, grupo:"Planificación", dominio:"Riesgos", codigo:"G.2", nombre:"Identificar los riesgos", completado:false},
            {id:20, grupo:"Planificación", dominio:"Riesgos", codigo:"G.3", nombre:"Realizar el análisis de riesgos", completado:false},
            {id:21, grupo:"Planificación", dominio:"Riesgos", codigo:"G.4", nombre:"Planificar las respuestas a los riesgos", completado:false},
            // Ejecución
            {id:22, grupo:"Ejecución", dominio:"Dirección", codigo:"A.4", nombre:"Gestionar la ejecución del proyecto", completado:false},
            {id:23, grupo:"Ejecución", dominio:"Dirección", codigo:"A.5", nombre:"Gestionar el aseguramiento de la calidad", completado:false},
            {id:24, grupo:"Ejecución", dominio:"Dirección", codigo:"A.6", nombre:"Gestionar el conocimiento del proyecto", completado:false},
            {id:25, grupo:"Ejecución", dominio:"Interesados", codigo:"E.4", nombre:"Gestionar la participación de los interesados", completado:false},
            {id:26, grupo:"Ejecución", dominio:"Interesados", codigo:"E.5", nombre:"Gestionar las comunicaciones", completado:false},
            {id:27, grupo:"Ejecución", dominio:"Recursos", codigo:"F.3", nombre:"Adquirir los recursos", completado:false},
            {id:28, grupo:"Ejecución", dominio:"Recursos", codigo:"F.4", nombre:"Liderar el equipo", completado:false},
            {id:29, grupo:"Ejecución", dominio:"Riesgos", codigo:"G.5", nombre:"Implementar las respuestas a los riesgos", completado:false},
            // Monitoreo y Control
            {id:30, grupo:"Monitoreo y Control", dominio:"Dirección", codigo:"A.7", nombre:"Seguimiento y control del desarrollo del proyecto", completado:false},
            {id:31, grupo:"Monitoreo y Control", dominio:"Dirección", codigo:"A.8", nombre:"Evaluar e implementar cambios", completado:false},
            {id:32, grupo:"Monitoreo y Control", dominio:"Alcance", codigo:"B.5", nombre:"Seguimiento y Control del alcance", completado:false},
            {id:33, grupo:"Monitoreo y Control", dominio:"Alcance", codigo:"B.6", nombre:"Validar el alcance", completado:false},
            {id:34, grupo:"Monitoreo y Control", dominio:"Cronograma", codigo:"C.3", nombre:"Seguimiento y Control del cronograma", completado:false},
            {id:35, grupo:"Monitoreo y Control", dominio:"Finanzas", codigo:"D.4", nombre:"Seguimiento y Control de las finanzas", completado:false},
            {id:36, grupo:"Monitoreo y Control", dominio:"Interesados", codigo:"E.6", nombre:"Seguimiento de la participación de los interesados", completado:false},
            {id:37, grupo:"Monitoreo y Control", dominio:"Interesados", codigo:"E.7", nombre:"Seguimiento de las comunicaciones", completado:false},
            {id:38, grupo:"Monitoreo y Control", dominio:"Recursos", codigo:"F.5", nombre:"Seguimiento y Control de la asignación de recursos", completado:false},
            {id:39, grupo:"Monitoreo y Control", dominio:"Riesgos", codigo:"G.6", nombre:"Seguimiento de los riesgos", completado:false},
            // Cierre
            {id:40, grupo:"Cierre", dominio:"Dirección", codigo:"A.9", nombre:"Cierre de proyecto", completado:false}
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



        function sincronizarProcesosConPMBOK(proyecto) {
            if (!proyecto || !Array.isArray(PROCESOS_PMBOK)) return;
            const viejos = Array.isArray(proyecto.procesos) ? proyecto.procesos.filter(Boolean) : [];
            const porCodigo = new Map(viejos.map(p => [String(p.codigo), p]));
            const porNombre = new Map(viejos.map(p => [p.nombre, p]));
            const porId = new Map(viejos.map(p => [String(p.id), p]));
            proyecto.procesos = PROCESOS_PMBOK.map(p => {
                const previo = porCodigo.get(String(p.codigo)) || porNombre.get(p.nombre) || porId.get(String(p.id));
                return previo ? { ...p, completado: previo.completado === true } : { ...p };
            });
        }

        function contarProcesosCompletados(proyecto) {
            if (!Array.isArray(PROCESOS_PMBOK) || !proyecto || !Array.isArray(proyecto.procesos)) return 0;
            const viejos = proyecto.procesos.filter(Boolean);
            const porCodigo = new Map(viejos.map(p => [String(p.codigo), p]));
            const porNombre = new Map(viejos.map(p => [p.nombre, p]));
            const porId = new Map(viejos.map(p => [String(p.id), p]));
            return PROCESOS_PMBOK.filter(p => {
                const previo = porCodigo.get(String(p.codigo)) || porNombre.get(p.nombre) || porId.get(String(p.id));
                return previo && previo.completado === true;
            }).length;
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
        
        let tiposCambio = { EUR:1, USD:1.1603, GBP:0.858, JPY:178.482, CHF:0.9465, BRL:5.9218, MXN:19.683, COP:3608.9243, ARS:1751.9618, CLP:1089.0409, DZD:154.7319, CDF:2683.3008, MZN:74.3037, ZAR:18.7189, NGN:1582.1055, KES:150.4795, EGP:59.5726, MAD:10.9132, GHS:13.2637, TND:3.3782, ETB:188.6609, TZS:3069.14, UGX:4362.6583, RWF:1714.9784, AOA:1104.1025, XOF:655.957, XAF:655.957, ZMW:22.2952, BWP:16.3762, MUR:54.3755 };
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
