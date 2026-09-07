// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================

// Monedas soportadas (internacional)
const MONEDAS = {
    // Europa
    EUR: { nombre: "Euro", simbolo: "€", pais: "Eurozona" },
    GBP: { nombre: "Libra Esterlina", simbolo: "£", pais: "Reino Unido" },
    CHF: { nombre: "Franco Suizo", simbolo: "₣", pais: "Suiza" },
    // América
    USD: { nombre: "Dólar USA", simbolo: "$", pais: "Estados Unidos" },
    BRL: { nombre: "Real Brasileño", simbolo: "R$", pais: "Brasil" },
    MXN: { nombre: "Peso Mexicano", simbolo: "Mex$", pais: "México" },
    COP: { nombre: "Peso Colombiano", simbolo: "COL$", pais: "Colombia" },
    ARS: { nombre: "Peso Argentino", simbolo: "ARS$", pais: "Argentina" },
    CLP: { nombre: "Peso Chileno", simbolo: "CLP$", pais: "Chile" },
    PEN: { nombre: "Sol Peruano", simbolo: "S/", pais: "Perú" },
    BOB: { nombre: "Boliviano", simbolo: "Bs", pais: "Bolivia" },
    UYU: { nombre: "Peso Uruguayo", simbolo: "$U", pais: "Uruguay" },
    PYG: { nombre: "Guaraní", simbolo: "₲", pais: "Paraguay" },
    // África
    DZD: { nombre: "Dinar Argelino", simbolo: "دج", pais: "Argelia" },
    CDF: { nombre: "Franco Congoleño", simbolo: "FC", pais: "R.D. Congo" },
    MZN: { nombre: "Metical", simbolo: "MT", pais: "Mozambique" },
    ZAR: { nombre: "Rand Sudafricano", simbolo: "R", pais: "Sudáfrica" },
    NGN: { nombre: "Naira", simbolo: "₦", pais: "Nigeria" },
    KES: { nombre: "Chelín Keniata", simbolo: "KSh", pais: "Kenia" },
    EGP: { nombre: "Libra Egipcia", simbolo: "E£", pais: "Egipto" },
    MAD: { nombre: "Dirham Marroquí", simbolo: "د.م.", pais: "Marruecos" },
    GHS: { nombre: "Cedi Ghanés", simbolo: "GH₵", pais: "Ghana" },
    TND: { nombre: "Dinar Tunecino", simbolo: "د.ت", pais: "Túnez" },
    ETB: { nombre: "Birr Etíope", simbolo: "Br", pais: "Etiopía" },
    TZS: { nombre: "Chelín Tanzano", simbolo: "TSh", pais: "Tanzania" },
    UGX: { nombre: "Chelín Ugandés", simbolo: "USh", pais: "Uganda" },
    RWF: { nombre: "Franco Ruandés", simbolo: "FRw", pais: "Ruanda" },
    AOA: { nombre: "Kwanza Angoleño", simbolo: "Kz", pais: "Angola" },
    XOF: { nombre: "Franco CFA (BCEAO)", simbolo: "CFA", pais: "África Occidental" },
    XAF: { nombre: "Franco CFA (BEAC)", simbolo: "FCFA", pais: "África Central" },
    ZMW: { nombre: "Kwacha Zambiano", simbolo: "ZK", pais: "Zambia" },
    BWP: { nombre: "Pula Botsuana", simbolo: "P", pais: "Botsuana" },
    MUR: { nombre: "Rupia Mauriciana", simbolo: "₨", pais: "Mauricio" },
    // Asia
    JPY: { nombre: "Yen Japonés", simbolo: "¥", pais: "Japón" }
};

// Tipos de cambio base (1 EUR = X)
const TIPOS_CAMBIO_BASE = {
    EUR: 1.0000, USD: 1.0890, GBP: 0.8570, JPY: 164.20, CHF: 0.9540,
    BRL: 5.4500, MXN: 18.2500, COP: 4190.00, ARS: 950.00, CLP: 920.00,
    PEN: 3.7200, BOB: 6.9100, UYU: 42.50, PYG: 7350.00,
    DZD: 134.00, CDF: 2800.00, MZN: 64.00, ZAR: 18.50, NGN: 1500.00,
    KES: 140.00, EGP: 47.00, MAD: 10.80,
    GHS: 11.50, TND: 3.30, ETB: 115.00, TZS: 2700.00, UGX: 4000.00,
    RWF: 1380.00, AOA: 900.00, XOF: 655.96, XAF: 655.96, ZMW: 24.50,
    BWP: 13.50, MUR: 48.00
};

// Incoterms 2024
const INCOTERMS = [
    { codigo: "EXW", nombre: "Ex Works", descripcion: "En fábrica del vendedor" },
    { codigo: "FCA", nombre: "Free Carrier", descripcion: "En el transportista" },
    { codigo: "FAS", nombre: "Free Alongside Ship", descripcion: "Al costado del barco" },
    { codigo: "FOB", nombre: "Free On Board", descripcion: "A bordo del barco" },
    { codigo: "CFR", nombre: "Cost and Freight", descripcion: "Coste y flete" },
    { codigo: "CIF", nombre: "Cost Insurance Freight", descripcion: "Coste seguro y flete" },
    { codigo: "CPT", nombre: "Carriage Paid To", descripcion: "Transporte pagado hasta" },
    { codigo: "CIP", nombre: "Carriage Insurance Paid", descripcion: "Transporte y seguro pagado" },
    { codigo: "DAP", nombre: "Delivered at Place", descripcion: "Entregado en lugar" },
    { codigo: "DPU", nombre: "Delivered at Place Unloaded", descripcion: "Entregado y descargado" },
    { codigo: "DDP", nombre: "Delivered Duty Paid", descripcion: "Entregado derechos pagados" }
];

// Procesos PMBOK (41 procesos, 7 dominios)
const PROCESOS_PMBOK = [
    // Dirección (A)
    {id:1, grupo:"Inicio", dominio:"Dirección", codigo:"A.1", nombre:"Inicio (Acta)", completado:false},
    {id:2, grupo:"Planificación", dominio:"Dirección", codigo:"A.2", nombre:"Integrar planes", completado:false},
    {id:3, grupo:"Planificación", dominio:"Dirección", codigo:"A.3", nombre:"Estrategia suministros", completado:false},
    {id:4, grupo:"Ejecución", dominio:"Dirección", codigo:"A.4", nombre:"Gestionar ejecución", completado:false},
    {id:5, grupo:"Ejecución", dominio:"Dirección", codigo:"A.5", nombre:"Asegurar calidad", completado:false},
    {id:6, grupo:"Ejecución", dominio:"Dirección", codigo:"A.6", nombre:"Gestionar conocimiento", completado:false},
    {id:7, grupo:"Monitoreo y Control", dominio:"Dirección", codigo:"A.7", nombre:"Seguimiento y control", completado:false},
    {id:8, grupo:"Monitoreo y Control", dominio:"Dirección", codigo:"A.8", nombre:"Gestionar cambios (integrado)", completado:false},
    {id:9, grupo:"Cierre", dominio:"Dirección", codigo:"A.9", nombre:"Cierre proyecto", completado:false},
    {id:10, grupo:"Cierre", dominio:"Dirección", codigo:"A.10", nombre:"Cierre adquisiciones", completado:false},
    // Alcance (B)
    {id:11, grupo:"Planificación", dominio:"Alcance", codigo:"B.1", nombre:"Planificar alcance", completado:false},
    {id:12, grupo:"Planificación", dominio:"Alcance", codigo:"B.2", nombre:"Recopilar requisitos", completado:false},
    {id:13, grupo:"Planificación", dominio:"Alcance", codigo:"B.3", nombre:"Definir alcance", completado:false},
    {id:14, grupo:"Planificación", dominio:"Alcance", codigo:"B.4", nombre:"Crear EDT/WBS", completado:false},
    {id:15, grupo:"Monitoreo y Control", dominio:"Alcance", codigo:"B.5", nombre:"Controlar alcance", completado:false},
    {id:16, grupo:"Monitoreo y Control", dominio:"Alcance", codigo:"B.6", nombre:"Validar alcance", completado:false},
    // Cronograma (C)
    {id:17, grupo:"Planificación", dominio:"Cronograma", codigo:"C.1", nombre:"Planificar cronograma", completado:false},
    {id:18, grupo:"Planificación", dominio:"Cronograma", codigo:"C.2", nombre:"Desarrollar cronograma", completado:false},
    {id:19, grupo:"Monitoreo y Control", dominio:"Cronograma", codigo:"C.3", nombre:"Controlar cronograma", completado:false},
    // Finanzas (D)
    {id:20, grupo:"Planificación", dominio:"Finanzas", codigo:"D.1", nombre:"Planificar finanzas", completado:false},
    {id:21, grupo:"Planificación", dominio:"Finanzas", codigo:"D.2", nombre:"Estimar costes", completado:false},
    {id:22, grupo:"Planificación", dominio:"Finanzas", codigo:"D.3", nombre:"Desarrollar presupuesto", completado:false},
    {id:23, grupo:"Monitoreo y Control", dominio:"Finanzas", codigo:"D.4", nombre:"Controlar costes", completado:false},
    // Interesados (E)
    {id:24, grupo:"Inicio", dominio:"Interesados", codigo:"E.1", nombre:"Identificar interesados", completado:false},
    {id:25, grupo:"Planificación", dominio:"Interesados", codigo:"E.2", nombre:"Planificar participación", completado:false},
    {id:26, grupo:"Planificación", dominio:"Interesados", codigo:"E.3", nombre:"Planificar comunicaciones", completado:false},
    {id:27, grupo:"Ejecución", dominio:"Interesados", codigo:"E.4", nombre:"Gestionar participación", completado:false},
    {id:28, grupo:"Ejecución", dominio:"Interesados", codigo:"E.5", nombre:"Gestionar comunicaciones", completado:false},
    {id:29, grupo:"Monitoreo y Control", dominio:"Interesados", codigo:"E.6", nombre:"Monitorear participación", completado:false},
    {id:30, grupo:"Monitoreo y Control", dominio:"Interesados", codigo:"E.7", nombre:"Monitorear comunicaciones", completado:false},
    // Recursos (F)
    {id:31, grupo:"Planificación", dominio:"Recursos", codigo:"F.1", nombre:"Planificar recursos", completado:false},
    {id:32, grupo:"Planificación", dominio:"Recursos", codigo:"F.2", nombre:"Estimar recursos", completado:false},
    {id:33, grupo:"Ejecución", dominio:"Recursos", codigo:"F.3", nombre:"Adquirir recursos", completado:false},
    {id:34, grupo:"Ejecución", dominio:"Recursos", codigo:"F.4", nombre:"Liderar equipo", completado:false},
    {id:35, grupo:"Monitoreo y Control", dominio:"Recursos", codigo:"F.5", nombre:"Controlar recursos", completado:false},
    // Riesgos (G)
    {id:36, grupo:"Planificación", dominio:"Riesgos", codigo:"G.1", nombre:"Planificar riesgos", completado:false},
    {id:37, grupo:"Planificación", dominio:"Riesgos", codigo:"G.2", nombre:"Identificar riesgos", completado:false},
    {id:38, grupo:"Planificación", dominio:"Riesgos", codigo:"G.3", nombre:"Análisis (cual/cuant)", completado:false},
    {id:39, grupo:"Planificación", dominio:"Riesgos", codigo:"G.4", nombre:"Planificar respuestas", completado:false},
    {id:40, grupo:"Ejecución", dominio:"Riesgos", codigo:"G.5", nombre:"Implementar respuestas", completado:false},
    {id:41, grupo:"Monitoreo y Control", dominio:"Riesgos", codigo:"G.6", nombre:"Monitorear riesgos", completado:false}
];

const PROCESOS_RESUMIDOS = PROCESOS_PMBOK;

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
    localStorage.setItem(STORAGE_PROYECTOS_KEY, json);
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
            nombre: 'Proyecto Demo - App Móvil',
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

// Función para obtener símbolo de moneda
function getMonedaSimbolo(moneda) {
    return MONEDAS[moneda]?.simbolo || moneda;
}

// Función para formatear moneda
function formatearMoneda(valor, monedaBase) {
    let simbolo = getMonedaSimbolo(monedaBase);
    return valor.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + simbolo;
}