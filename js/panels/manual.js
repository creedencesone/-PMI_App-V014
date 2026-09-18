// ============================================================
// MANUAL DE USUARIO - Contenido y funciones
// ============================================================

const manualTemasES = [
    {
        id: 'intro',
        icon: '',
        titulo: 'Introducción',
        contenido: [
            { tipo: 'texto', valor: 'La aplicación PMI está diseñada para la gestión integral de proyectos siguiendo los estándares del Project Management Institute (8ª Edición). Permite administrar la cartera de proyectos, controlar costes, cronogramas, riesgos, stakeholders y generar informes ejecutivos.' },
            { tipo: 'texto', valor: 'Desde el panel principal (Dashboard) puedes crear, editar y supervisar todos tus proyectos. Cada proyecto contiene módulos especializados que cubren las áreas de conocimiento de la dirección de proyectos.' }
        ]
    },
    {
        id: 'proyectos',
        icon: '',
        titulo: 'Gestión de Proyectos',
        contenido: [
            { tipo: 'texto', valor: 'El panel de cartera muestra todos los proyectos con sus indicadores clave: estado, presupuesto, fechas y progreso.' },
            { tipo: 'subtitulo', valor: 'Crear proyecto' },
            { tipo: 'texto', valor: 'Pulsa el botón + (icono "Nuevo Proyecto") en la cabecera de la cartera e introduce nombre, alcance, fechas, país y moneda base. El proyecto se crea con un acta de inicio automática.' },
            { tipo: 'subtitulo', valor: 'Editar / Eliminar' },
            { tipo: 'texto', valor: 'Usa los botones  y  en cada tarjeta de proyecto. Solo los administradores pueden eliminar proyectos.' },
            { tipo: 'subtitulo', valor: 'Filtros y búsqueda' },
            { tipo: 'texto', valor: 'Usa el campo de búsqueda para filtrar proyectos por nombre. Los filtros de estado (Activos/Inactivos/Todos) permiten segmentar la vista.' },
            { tipo: 'subtitulo', valor: 'Respaldos' },
            { tipo: 'texto', valor: 'En la sección de Respaldos puedes guardar la cartera completa en un archivo JSON, exportar a CSV o importar proyectos desde un archivo.' }
        ]
    },
    {
        id: 'salud',
        icon: '',
        titulo: 'Salud del Proyecto',
        contenido: [
            { tipo: 'texto', valor: 'El panel de Salud del Proyecto es el cuadro de mando principal. Muestra indicadores clave de rendimiento (KPI) en tiempo real con semáforos de color.' },
            { tipo: 'subtitulo', valor: 'Indicadores principales' },
            { tipo: 'lista', items: [
                'CPI (Cost Performance Index): eficiencia del coste. >1 = por debajo del presupuesto.',
                'SPI (Schedule Performance Index): eficiencia del cronograma. >1 = adelantado.',
                'EV (Earned Value): valor ganado del trabajo completado (excluye EDTs del peso).',
                'PV (Planned Value): valor planificado del trabajo programado.',
                'AC (Actual Cost): prorrateado temporalmente como costeTotal × % tiempo transcurrido.',
                'EAC (Estimate at Complete): BAC / CPI siempre, unificado.',
                'Variación de Coste y Cronograma en porcentaje.',
                'Salud General: indicador compuesto (CPI × SPI).'
            ]},
            { tipo: 'subtitulo', valor: 'Cálculos EVM' },
            { tipo: 'texto', valor: 'El coste total del proyecto se calcula como Σ(costeEstimado de cada elemento) + materiales + servicios + viajes (sin coste de equipo duplicado). La desviación del cronograma usa sumarDiasHabiles() en vez de setDate + duración para precisión con días hábiles.' },
            { tipo: 'texto', valor: 'Los semáforos de salud usan códigos de color:  Verde (saludable),  Amarillo (precaución),  Rojo (crítico).' }
        ]
    },
    {
        id: 'costes',
        icon: '',
        titulo: 'Costes y Finanzas',
        contenido: [
            { tipo: 'texto', valor: 'El módulo financiero permite gestionar todos los aspectos económicos del proyecto con cálculo automático del cashflow.' },
            { tipo: 'subtitulo', valor: 'Estructura del coste total' },
            { tipo: 'texto', valor: 'El coste total del proyecto se compone de: Σ(costeEstimado de cada elemento Gantt) + materiales + servicios + viajes. El coste de equipo se integra a través del costeEstimado de los elementos.' },
            { tipo: 'subtitulo', valor: 'Cashflow' },
            { tipo: 'texto', valor: 'El cashflow distribuye cada coste entre todos los meses que dura la tarea, calculando el mes índice desde la fecha de inicio del proyecto. Los ingresos se distribuyen desde los hitos financieros de cobro; si no existen, se reparte el precio de venta entre los meses con gasto.' },
            { tipo: 'subtitulo', valor: 'Gráficos profesionales' },
            { tipo: 'texto', valor: 'Los gráficos de cashflow e informes usan Chart.js con estilo profesional: gradientes, cutout 55%, hoverOffset 16, borderRadius 6 y puntos con borde blanco. Los colores de texto se adaptan automáticamente al tema (claro/oscuro).' },
            { tipo: 'subtitulo', valor: 'Monedas' },
            { tipo: 'texto', valor: 'La vista de Monedas es una pantalla única: cabecera con botones de icono para actualizar tasas (↻) y guardar (✓), fila de chips con el total de monedas, fuente, última actualización y moneda base, más una tabla de tasas con búsqueda y filtro por región. La sección "Avanzado" (plegable) incluye evolución histórica, precio de venta y condiciones de pago, proveedor de tasas, actualización automática y botones para probar conexión, exportar e importar CSV.' }
        ]
    },
    {
        id: 'cronograma',
        icon: '',
        titulo: 'Cronograma (Gantt)',
        contenido: [
            { tipo: 'texto', valor: 'El cronograma Gantt permite planificar y visualizar las tareas del proyecto en una línea de tiempo interactiva con soporte para días y horas.' },
            { tipo: 'subtitulo', valor: 'Gestión de elementos Gantt' },
            { tipo: 'lista', items: [
                'Cada elemento tiene: nombre, fecha inicio, duración, responsable, tipo (tarea/hito/entregable/EDT), dependencias y estado.',
                'Agrega elementos con el botón + (icono "Nuevo elemento"). Edita y elimina con los botones correspondientes.',
                'Las dependencias se arrastran entre elementos para establecer relaciones secuenciales.'
            ]},
            { tipo: 'subtitulo', valor: 'Duración en horas' },
            { tipo: 'texto', valor: 'Cada tarea puede configurarse con tipo de duración "Días" u "Horas". Las tareas en horas se convierten a días fraccionales (duraciónHoras / horasDia), ocupando un ancho proporcional en el Gantt. Si la duración es menor a 1 día, la barra se muestra con el tamaño mínimo.' },
            { tipo: 'subtitulo', valor: 'Días hábiles' },
            { tipo: 'texto', valor: 'Todas las fechas se calculan en días hábiles (lunes-viernes). sumarDiasHabiles() omite fines de semana. Si los días son < 1 (tareas en horas), la misma fecha es devuelta sin cambios. El auto-scheduler y la ruta crítica también usan días hábiles.' },
            { tipo: 'subtitulo', valor: 'Barras reales vs planificadas' },
            { tipo: 'texto', valor: 'En el SVG del Gantt, cada tarea muestra una barra real delgada bajo la barra planificada. El color indica el estado:  Verde si la fecha fin real es anterior a la planificada (a tiempo),  Rojo si hay retraso,  Naranja si la tarea está en curso.' },
            { tipo: 'subtitulo', valor: 'Ruta Crítica' },
            { tipo: 'texto', valor: 'El botón  Ruta Crítica resalta las tareas críticas en rojo en el Gantt y verde en la WBS. La duración se convierte a días calendario con sumarDiasHabiles() para precisión. La barra de información muestra total de días y horas.' },
            { tipo: 'subtitulo', valor: 'Auto-Scheduler' },
            { tipo: 'texto', valor: 'El botón  Auto Schedule reorganiza automáticamente las fechas según las dependencias, incluyendo hitos. Calcula la ruta crítica y programa cada tarea lo antes posible respetando fines de semana.' },
            { tipo: 'subtitulo', valor: 'Desplazamiento intra-día' },
            { tipo: 'texto', valor: 'Las dependencias de tipo FS (Finish-to-Start) que finalizan el mismo día en que otra comienza se separan visualmente con un desplazamiento automático para solapar las barras.' },
            { tipo: 'subtitulo', valor: 'Listado ordenado imprimible' },
            { tipo: 'texto', valor: 'El botón  en la toolbar genera un listado topológico (Kahn) de todas las tareas con códigos EDT, ordenadas según dependencias. Incluye botones de  Impresión y  CSV para exportar.' },
            { tipo: 'subtitulo', valor: 'Importación CSV' },
            { tipo: 'texto', valor: 'El botón  abre un modal drag & drop para importar tareas desde CSV. Detecta automáticamente columnas (nombre, duración, inicio, predecesores, etc.) y el delimitador. Muestra preview antes de confirmar la importación.' },
            { tipo: 'subtitulo', valor: 'Metodología' },
            { tipo: 'texto', valor: 'Puedes seleccionar entre Cascada, Agile (Scrum) o Mixto. La metodología afecta a cómo se calcula la velocidad del equipo y la planificación de sprints.' },
            { tipo: 'subtitulo', valor: 'Visualización' },
            { tipo: 'texto', valor: 'La WBS se muestra con fuentes más grandes (EDTs a 14px/600, elementos a 13px/500). Las fechas y nombres dentro de las barras SVG usan 12px/600 para mejor legibilidad.' }
        ]
    },
    {
        id: 'riesgos',
        icon: '',
        titulo: 'Gestión de Riesgos',
        contenido: [
            { tipo: 'texto', valor: 'Identifica, evalúa y da seguimiento a los riesgos del proyecto.' },
            { tipo: 'subtitulo', valor: 'Campos del riesgo' },
            { tipo: 'lista', items: [
                'Nombre, descripción, categoría y responsable.',
                'Probabilidad (Muy Baja a Muy Alta) e Impacto (Muy Bajo a Muy Alto).',
                'Severidad: calculada automáticamente como Probabilidad × Impacto.',
                'Plan de respuesta y acciones preventivas.',
                'Estado y fecha de identificación.'
            ]},
            { tipo: 'subtitulo', valor: 'Matriz de calor' },
            { tipo: 'texto', valor: 'Visualiza los riesgos en una matriz probabilidad-impacto con colores:  Bajo,  Medio,  Alto,  Crítico.' },
            { tipo: 'subtitulo', valor: 'Recomendaciones' },
            { tipo: 'texto', valor: 'El sistema genera recomendaciones automáticas basadas en los riesgos críticos y altos identificados.' }
        ]
    },
    {
        id: 'stakeholders',
        icon: '',
        titulo: 'Stakeholders',
        contenido: [
            { tipo: 'texto', valor: 'Gestiona las partes interesadas del proyecto con una matriz poder/interés y una tabla detallada.' },
            { tipo: 'subtitulo', valor: 'Matriz Poder/Interés' },
            { tipo: 'texto', valor: 'Clasifica a los stakeholders en cuatro cuadrantes: Gestionar de Cerca (alto poder, alto interés), Mantener Satisfechos (alto poder, bajo interés), Mantener Informados (bajo poder, alto interés) y Monitorear (bajo poder, bajo interés).' },
            { tipo: 'subtitulo', valor: 'Matriz RACI' },
            { tipo: 'texto', valor: 'Asigna roles: Responsable (R), Aprobador (A), Consultado (C) e Informado (I) para cada actividad del proyecto.' }
        ]
    },
    {
        id: 'procesos',
        icon: '',
        titulo: 'Procesos',
        contenido: [
            { tipo: 'texto', valor: 'Los procesos se organizan en 5 grupos y 10 áreas de conocimiento según el estándar del PMI.' },
            { tipo: 'subtitulo', valor: 'Grupos de Procesos' },
            { tipo: 'lista', items: [
                'Inicio: definir el proyecto y obtener autorización.',
                'Planificación: establecer alcance, objetivos y plan de acción.',
                'Ejecución: coordinar recursos para completar el trabajo.',
                'Monitoreo y Control: tracking de progreso y gestión de cambios.',
                'Cierre: formalizar la finalización del proyecto.'
            ]}
        ]
    },
    {
        id: 'informes',
        icon: '',
        titulo: 'Informes',
        contenido: [
            { tipo: 'texto', valor: 'Genera 7 tipos de informes basados en la 8ª Edición con datos reales del proyecto y gráficos profesionales.' },
            { tipo: 'subtitulo', valor: 'Tipos de informe' },
            { tipo: 'lista', items: [
                'Resumen Ejecutivo: visión general del estado del proyecto.',
                'Estado de Costes: CPI, EV, PV, AC, EAC (BAC/CPI), variaciones y presupuesto.',
                'Estado de Cronograma: SPI, progreso, hitos y entregables.',
                'Análisis de Riesgos: matriz de calor y riesgos críticos.',
                'Recursos: equipo, materiales y costes por recurso.',
                'Stakeholders: matriz de involucrados y RACI.',
                'Informe Final: consolidado completo del proyecto.'
            ]},
            { tipo: 'subtitulo', valor: 'Gráficos profesionales' },
            { tipo: 'texto', valor: 'Los informes usan Chart.js con estilo profesional: gráficos doughnut con cutout 55%, gradientes de color, hoverOffset 16, borderRadius 6 y tooltips redondeados. Los colores de texto (títulos, ejes, leyendas) se adaptan automáticamente: #e0e0e0 en modo oscuro, #1a1a2e en modo claro.' },
            { tipo: 'subtitulo', valor: 'Cálculos EVM' },
            { tipo: 'texto', valor: 'El AC (Actual Cost) se calcula como costeTotal × % tiempo transcurrido (prorrateo temporal). EAC se calcula siempre como BAC / CPI. Los EDTs se filtran del peso para EV. La desviación del cronograma usa sumarDiasHabiles() en lugar de setDate + duración.' },
            { tipo: 'subtitulo', valor: 'Exportación a PDF' },
            { tipo: 'texto', valor: 'Usa el botón con el icono de impresora para exportar el informe a PDF. Los gráficos Chart.js se capturan automáticamente como imágenes.' }
        ]
    },
    {
        id: 'comunicaciones',
        icon: '',
        titulo: 'Comunicaciones',
        contenido: [
            { tipo: 'texto', valor: 'Gestiona las comunicaciones del proyecto: reuniones, informes, actas y distribución de información.' },
            { tipo: 'subtitulo', valor: 'Registro de comunicaciones' },
            { tipo: 'texto', valor: 'Cada comunicación registra: fecha, tipo (reunión/informe/email/acta), emisor, receptor, asunto, medio, estado y adjuntos.' }
        ]
    },
    {
        id: 'cambios',
        icon: '',
        titulo: 'Solicitudes de Cambio',
        contenido: [
            { tipo: 'texto', valor: 'Registra y da seguimiento a las solicitudes de cambio del proyecto con su ciclo de vida completo.' },
            { tipo: 'subtitulo', valor: 'Campos principales' },
            { tipo: 'lista', items: [
                'Descripción del cambio y justificación.',
                'Impacto en alcance, coste, cronograma y calidad.',
                'Estado: Pendiente / En revisión / Aprobado / Rechazado.',
                'Prioridad, fecha de solicitud y decisión con comentarios.'
            ]}
        ]
    },
    {
        id: 'lecciones',
        icon: '',
        titulo: 'Lecciones Aprendidas',
        contenido: [
            { tipo: 'texto', valor: 'Registra las lecciones aprendidas durante el proyecto para mejorar la gestión futura.' },
            { tipo: 'subtitulo', valor: 'Estructura' },
            { tipo: 'lista', items: [
                'Categoría (procesos/técnica/gestión/comunicaciones/riesgos/otros).',
                'Descripción de la experiencia.',
                'Impacto (positivo/negativo) y recomendaciones.',
                'Estado: Abierta / Validada / Implementada.'
            ]}
        ]
    },
    {
        id: 'scrum',
        icon: '',
        titulo: 'Módulo Scrum / Agile',
        contenido: [
            { tipo: 'texto', valor: 'El módulo Agile incluye herramientas para gestión de sprints, velocity tracking y métricas ágiles.' },
            { tipo: 'subtitulo', valor: 'Componentes' },
            { tipo: 'lista', items: [
                'Sprint Backlog: gestiona las tareas del sprint actual.',
                'Sprint Burndown: gráfico de trabajo pendiente vs tiempo.',
                'Velocity Tracking: seguimiento de la velocidad del equipo.',
                'Retrospectives: registro de retrospectivas de sprint.',
                'Agile Metrics: velocidad, deuda técnica, lead time.',
                'Control Gastos Ágil: costes asociados a sprints.'
            ]},
            { tipo: 'texto', valor: 'NOTA: La velocidad del equipo solo aplica para metodologías Agile o Mixta. En Cascada la velocidad se muestra como 0.' }
        ]
    },
    {
        id: 'usuarios',
        icon: '',
        titulo: 'Gestión de Usuarios',
        contenido: [
            { tipo: 'texto', valor: 'El administrador puede gestionar usuarios, roles y permisos desde el panel de administración.' },
            { tipo: 'subtitulo', valor: 'Roles disponibles' },
            { tipo: 'lista', items: [
                'Admin: acceso total a todas las funciones.',
                'Director de Proyecto (PM): gestión completa de proyectos.',
                'Analista: acceso a consulta y reportes.',
                'Colaborador: acceso limitado a tareas asignadas.',
                'Consultor Externo / Cliente: visibilidad restringida.'
            ]},
            { tipo: 'subtitulo', valor: 'Permisos por módulo' },
            { tipo: 'texto', valor: 'Cada rol tiene permisos predefinidos sobre los módulos: Salud, Costes, Cronograma, Riesgos, Stakeholders, Procesos, Informes y más. Los administradores pueden personalizar permisos por usuario.' }
        ]
    },
    {
        id: 'email',
        icon: '',
        titulo: 'Notificaciones EmailJS',
        contenido: [
            { tipo: 'texto', valor: 'La aplicación puede enviar notificaciones por correo electrónico automáticamente al crear o editar tareas.' },
            { tipo: 'subtitulo', valor: 'Configuración' },
            { tipo: 'texto', valor: 'Haz clic en el botón  en la barra superior para abrir el modal de configuración de EmailJS. Necesitarás un Service ID, Template ID y User ID de tu cuenta en emailjs.com.' },
            { tipo: 'subtitulo', valor: 'Envío automático' },
            { tipo: 'texto', valor: 'Cuando creas o editas una tarea que tiene un recurso con email asignado, se envía una notificación automática al correo del responsable informando de la tarea, fechas y estado.' }
        ]
    },
    {
        id: 'montecarlo',
        icon: '',
        titulo: 'Simulación Monte Carlo',
        contenido: [
            { tipo: 'texto', valor: 'La simulación Monte Carlo permite estimar la probabilidad de cumplir con los plazos y presupuestos del proyecto mediante simulación estadística iterativa.' },
            { tipo: 'subtitulo', valor: '¿Cómo funciona?' },
            { tipo: 'texto', valor: 'El motor ejecuta cientos o miles de simulaciones variando aleatoriamente la duración de cada tarea (distribución triangular, normal o uniforme). Para cada iteración se calcula la duración total y el coste total del proyecto.' },
            { tipo: 'subtitulo', valor: 'Configuración' },
            { tipo: 'lista', items: [
                'Iteraciones: 100 (rápido), 1,000 (preciso) o 5,000 (máxima precisión).',
                'Variación: ±10% a ±50% sobre la duración planificada de cada tarea.',
                'Distribución: Triangular (PERT), Normal o Uniforme.'
            ]},
            { tipo: 'subtitulo', valor: 'Resultados' },
            { tipo: 'texto', valor: 'Muestra la mediana (P50), percentil 80 (P80), percentil 95 (P95), y la probabilidad de terminar dentro del plan. Incluye histogramas de duración y coste, más una curva S de probabilidad acumulada.' },
            { tipo: 'subtitulo', valor: 'Acceso' },
            { tipo: 'texto', valor: 'Desde el botón  Monte Carlo en la barra de herramientas del cronograma Gantt.' }
        ]
    },
    {
        id: 'compartir',
        icon: '',
        titulo: 'Compartir Dashboard',
        contenido: [
            { tipo: 'texto', valor: 'Genera una vista pública del proyecto en un archivo HTML autónomo que puede compartirse con stakeholders sin necesidad de autenticación.' },
            { tipo: 'subtitulo', valor: '¿Cómo funciona?' },
            { tipo: 'lista', items: [
                'Pulsa el botón con el icono de compartir en el panel de Salud del Proyecto.',
                'Se descarga un archivo HTML con todos los KPIs, tareas y gráficos.',
                'El archivo es autónomo: incluye Chart.js vía CDN y toda la información necesaria.',
                'Puedes enviarlo por email, alojarlo en cualquier servidor estático o abrirlo localmente.'
            ]},
            { tipo: 'subtitulo', valor: 'Contenido del dashboard público' },
            { tipo: 'texto', valor: 'Incluye: nombre del proyecto, presupuesto, ingreso previsto, duración, riesgos, equipo, tareas con progreso y un gráfico doughnut de porcentaje completado.' },
            { tipo: 'subtitulo', valor: 'Diferencia clave' },
            { tipo: 'texto', valor: 'A diferencia de otras herramientas, no requiere que el destinatario tenga cuenta, login, ni acceso al sistema. Es una instantánea estática del estado actual del proyecto.' }
        ]
    },
    {
        id: 'backend',
        icon: '',
        titulo: 'Backend PHP',
        contenido: [
            { tipo: 'texto', valor: 'La aplicación incluye un servidor backend PHP con SQLite para servir archivos estáticos y manejar la API REST.' },
            { tipo: 'subtitulo', valor: 'Inicio del servidor' },
            { tipo: 'texto', valor: 'Para iniciar el servidor, ejecuta desde la carpeta backend/: php -S 0.0.0.0:8000 index.php' },
            { tipo: 'subtitulo', valor: 'Acceso desde móvil' },
            { tipo: 'texto', valor: 'El servidor sirve archivos estáticos (HTML, CSS, JS) para acceso desde dispositivos móviles sin necesidad de abrir index.html manualmente. Las rutas API se manejan desde index.php con SQLite como base de datos.' },
            { tipo: 'subtitulo', valor: 'PWA (Progressive Web App)' },
            { tipo: 'texto', valor: 'La aplicación ahora es instalable como PWA. Al abrir en un navegador compatible, verás un aviso para "Instalar" la app. Esto permite acceso sin conexión y apariencia de aplicación nativa en móvil y escritorio.' }
        ]
    },
    {
        id: 'personalizar',
        icon: '',
        titulo: 'Personalización',
        contenido: [
            { tipo: 'subtitulo', valor: 'Tema (Claro / Oscuro)' },
            { tipo: 'texto', valor: 'Usa el botón de tema en la barra lateral para alternar entre modo claro y oscuro. La preferencia se guarda automáticamente. Todos los gráficos y colores de la interfaz se adaptan al tema seleccionado.' },
            { tipo: 'subtitulo', valor: 'Idioma' },
            { tipo: 'texto', valor: 'Cambia el idioma de la interfaz entre Español 🇪🇸, Inglés 🇬🇧, Francés 🇫🇷 y Alemán 🇩🇪 desde el botón de idioma en la barra lateral.' },
            { tipo: 'subtitulo', valor: 'Asistente IA' },
            { tipo: 'texto', valor: 'El botón  IA en la barra lateral del proyecto abre un asistente de inteligencia artificial para ayudar con la gestión del proyecto.' },
            { tipo: 'subtitulo', valor: 'Menú de usuario' },
            { tipo: 'texto', valor: 'En la barra lateral, tu avatar con la inicial y tu nombre y rol abren el modal de perfil al hacer clic. La campana muestra las notificaciones y el icono de salida cierra la sesión.' }
        ]
    },
    {
        id: 'equipo',
        icon: '',
        titulo: 'Equipo',
        contenido: [
            { tipo: 'texto', valor: 'El panel de Equipo gestiona los miembros del proyecto con su coste por hora, moneda y horas mensuales.' },
            { tipo: 'subtitulo', valor: 'Añadir miembros' },
            { tipo: 'texto', valor: 'Pulsa el botón + para añadir un miembro del equipo. El icono de libro abre el catálogo de equipo para importar perfiles predefinidos.' }
        ]
    },
    {
        id: 'materiales',
        icon: '',
        titulo: 'Materiales',
        contenido: [
            { tipo: 'texto', valor: 'El panel de Materiales registra los materiales del proyecto con proveedor, cantidad, coste, país de origen, INCOTERM, arancel y condiciones de pago.' },
            { tipo: 'subtitulo', valor: 'Añadir y gestionar' },
            { tipo: 'texto', valor: 'Pulsa el botón + para añadir un material. El icono de libro importa desde el catálogo de materiales y el icono de actualizar recalcula los aranceles.' }
        ]
    },
    {
        id: 'servicios',
        icon: '',
        titulo: 'Servicios',
        contenido: [
            { tipo: 'texto', valor: 'El panel de Servicios registra servicios contratados con proveedor, cantidad, coste, impuesto y mes de imputación.' },
            { tipo: 'subtitulo', valor: 'Añadir servicios' },
            { tipo: 'texto', valor: 'Pulsa el botón + para añadir un servicio. El coste se integra automáticamente en el cashflow del proyecto.' }
        ]
    },
    {
        id: 'viajes',
        icon: '',
        titulo: 'Viajes',
        contenido: [
            { tipo: 'texto', valor: 'El panel de Viajes gestiona los desplazamientos del proyecto con tarjetas de totales por categoría: vuelos, hoteles, comidas y traslados.' },
            { tipo: 'subtitulo', valor: 'Registro de viajes' },
            { tipo: 'texto', valor: 'Pulsa el botón + para registrar un nuevo viaje con origen, destino, fechas y archivos adjuntos. El icono de exportar descarga el listado de viajes.' }
        ]
    },
    {
        id: 'logistica',
        icon: '',
        titulo: 'Logística',
        contenido: [
            { tipo: 'texto', valor: 'El panel de Logística es un simulador 3D de cubicaje para planificar el transporte de mercancías por vía aérea, marítima o almacén.' },
            { tipo: 'subtitulo', valor: 'Contenedores y exportación' },
            { tipo: 'texto', valor: 'Usa "Añadir Otra Unidad" para crear contenedores y asigna materiales a cada bulto. Los iconos de la cabecera guardan y cargan el estado, y exportan a CSV o PDF.' }
        ]
    },
    {
        id: 'venta',
        icon: '',
        titulo: 'Venta y Hitos Financieros',
        contenido: [
            { tipo: 'texto', valor: 'El panel de Venta define el precio de venta, la moneda y las condiciones de pago del proyecto.' },
            { tipo: 'subtitulo', valor: 'Hitos financieros' },
            { tipo: 'texto', valor: 'Pulsa el botón + para añadir hitos financieros de cobro. Los ingresos se distribuyen en el cashflow a partir de estos hitos.' }
        ]
    },
    {
        id: 'avales',
        icon: '',
        titulo: 'Avales y Garantías',
        contenido: [
            { tipo: 'texto', valor: 'El panel de Avales y Garantías Bancarias registra los avales del proyecto.' },
            { tipo: 'subtitulo', valor: 'Añadir avales' },
            { tipo: 'texto', valor: 'Pulsa el botón + para añadir un aval con su entidad, importe y fechas de vigencia.' }
        ]
    },
    {
        id: 'seguros',
        icon: '',
        titulo: 'Seguros y RC',
        contenido: [
            { tipo: 'texto', valor: 'El panel de Seguros y Responsabilidad Civil registra los seguros del proyecto: transporte, RC, obras, etc.' },
            { tipo: 'subtitulo', valor: 'Añadir seguros' },
            { tipo: 'texto', valor: 'Pulsa el botón + para añadir un seguro. El coste se refleja automáticamente en el cashflow del mes indicado.' }
        ]
    },
    {
        id: 'aranceles',
        icon: '',
        titulo: 'Aranceles y Costes Financieros',
        contenido: [
            { tipo: 'texto', valor: 'Dentro del análisis financiero se gestionan los aranceles por país, las tasas aduaneras y los costes financieros extra.' },
            { tipo: 'subtitulo', valor: 'Configuración' },
            { tipo: 'texto', valor: 'Usa el botón "Añadir" para crear aranceles por país, tasas aduaneras o costes financieros. El botón "Actualizar" recalcula los aranceles de todos los países.' }
        ]
    }
];

const manualTemasEN = JSON.parse(JSON.stringify(manualTemasES));
// Traducir títulos al inglés
var _enTitles = {
    intro: 'Introduction',
    proyectos: 'Project Management',
    salud: 'Project Health',
    costes: 'Costs & Finance',
    cronograma: 'Schedule (Gantt)',
    riesgos: 'Risk Management',
    stakeholders: 'Stakeholders',
    procesos: 'Processes',
    informes: 'Reports',
    comunicaciones: 'Communications',
    cambios: 'Change Requests',
    lecciones: 'Lessons Learned',
    scrum: 'Scrum / Agile Module',
    usuarios: 'User Management',
    email: 'EmailJS Notifications',
    montecarlo: 'Monte Carlo Simulation',
    compartir: 'Share Dashboard',
    backend: 'PHP Backend',
    personalizar: 'Customization',
    equipo: 'Team',
    materiales: 'Materials',
    servicios: 'Services',
    viajes: 'Travel',
    logistica: 'Logistics',
    venta: 'Sales and Financial Milestones',
    avales: 'Guarantees',
    seguros: 'Insurance and Liability',
    aranceles: 'Tariffs and Financial Costs'
};
var _textMap = {
    "La aplicación PMI está diseñada para la gestión integral de proyectos siguiendo los estándares del Project Management Institute (8ª Edición). Permite administrar la cartera de proyectos, controlar costes, cronogramas, riesgos, stakeholders y generar informes ejecutivos.": "The PMI application is designed for comprehensive project management following the Project Management Institute standards (8th Edition). It allows you to manage the project portfolio, control costs, schedules, risks, stakeholders, and generate executive reports.",
    "Desde el panel principal (Dashboard) puedes crear, editar y supervisar todos tus proyectos. Cada proyecto contiene módulos especializados que cubren las áreas de conocimiento de la dirección de proyectos.": "From the main Dashboard you can create, edit, and supervise all your projects. Each project contains specialized modules that cover the knowledge areas of project management.",
    "El panel de cartera muestra todos los proyectos con sus indicadores clave: estado, presupuesto, fechas y progreso.": "The portfolio panel shows all projects with their key indicators: status, budget, dates, and progress.",
    "Haz clic en \" Nuevo Proyecto\" e introduce nombre, alcance, fechas, país y moneda base. El proyecto se crea con un acta de inicio automática.": "Click \"New Project\" and enter name, scope, dates, country, and base currency. The project is created with an automatic project charter.",
    "Usa los botones  y  en cada tarjeta de proyecto. Solo los administradores pueden eliminar proyectos.": "Use the buttons and on each project card. Only administrators can delete projects.",
    "Usa el campo de búsqueda para filtrar proyectos por nombre. Los filtros de estado (Activos/Inactivos/Todos) permiten segmentar la vista.": "Use the search field to filter projects by name. The status filters (Active/Inactive/All) allow you to segment the view.",
    "En la sección de Respaldos puedes guardar la cartera completa en un archivo JSON, exportar a CSV o importar proyectos desde un archivo.": "In the Backups section you can save the entire portfolio to a JSON file, export to CSV, or import projects from a file.",
    "El panel de Salud del Proyecto es el cuadro de mando principal. Muestra indicadores clave de rendimiento (KPI) en tiempo real con semáforos de color.": "The Project Health panel is the main dashboard. It displays key performance indicators (KPIs) in real time with color traffic lights.",
    "El coste total del proyecto se calcula como Σ(costeEstimado de cada elemento) + materiales + servicios + viajes (sin coste de equipo duplicado). La desviación del cronograma usa sumarDiasHabiles() en vez de setDate + duración para precisión con días hábiles.": "The total project cost is calculated as Σ(estimated cost of each element) + materials + services + travel (without duplicated equipment cost). Schedule variance uses sumarDiasHabiles() instead of setDate + duration for business day accuracy.",
    "Los semáforos de salud usan códigos de color:  Verde (saludable),  Amarillo (precaución),  Rojo (crítico).": "Health traffic lights use color codes:  Green (healthy),  Yellow (caution),  Red (critical).",
    "El módulo financiero permite gestionar todos los aspectos económicos del proyecto con cálculo automático del cashflow.": "The financial module allows managing all economic aspects of the project with automatic cashflow calculation.",
    "El coste total del proyecto se compone de: Σ(costeEstimado de cada elemento Gantt) + materiales + servicios + viajes. El coste de equipo se integra a través del costeEstimado de los elementos.": "The total project cost consists of: Σ(estimated cost of each Gantt element) + materials + services + travel. Equipment cost is integrated through the estimated cost of the elements.",
    "El cashflow distribuye cada coste entre todos los meses que dura la tarea, calculando el mes índice desde la fecha de inicio del proyecto. Los ingresos se distribuyen desde los hitos financieros de cobro; si no existen, se reparte el precio de venta entre los meses con gasto.": "Cashflow distributes each cost across all months the task lasts, calculating the index month from the project start date. Income is distributed from financial collection milestones; if none exist, the sale price is split across the months with expenses.",
    "Los gráficos de cashflow e informes usan Chart.js con estilo profesional: gradientes, cutout 55%, hoverOffset 16, borderRadius 6 y puntos con borde blanco. Los colores de texto se adaptan automáticamente al tema (claro/oscuro).": "Cashflow charts and reports use Chart.js with a professional style: gradients, cutout 55%, hoverOffset 16, borderRadius 6, and white-bordered points. Text colors adapt automatically to the theme (light/dark).",
    "Define la moneda base del proyecto y gestiona tipos de cambio para operaciones internacionales.": "Set the project base currency and manage exchange rates for international operations.",
    "El cronograma Gantt permite planificar y visualizar las tareas del proyecto en una línea de tiempo interactiva con soporte para días y horas.": "The Gantt chart allows you to plan and visualize project tasks on an interactive timeline with support for days and hours.",
    "Cada tarea puede configurarse con tipo de duración \"Días\" u \"Horas\". Las tareas en horas se convierten a días fraccionales (duraciónHoras / horasDia), ocupando un ancho proporcional en el Gantt. Si la duración es menor a 1 día, la barra se muestra con el tamaño mínimo.": "Each task can be configured with a duration type of \"Days\" or \"Hours\". Hourly tasks are converted to fractional days (durationHours / hoursPerDay), occupying a proportional width in the Gantt. If the duration is less than 1 day, the bar is shown at minimum size.",
    "Todas las fechas se calculan en días hábiles (lunes-viernes). sumarDiasHabiles() omite fines de semana. Si los días son < 1 (tareas en horas), la misma fecha es devuelta sin cambios. El auto-scheduler y la ruta crítica también usan días hábiles.": "All dates are calculated in business days (Monday-Friday). sumarDiasHabiles() skips weekends. If days are < 1 (hourly tasks), the same date is returned unchanged. The auto-scheduler and critical path also use business days.",
    "En el SVG del Gantt, cada tarea muestra una barra real delgada bajo la barra planificada. El color indica el estado:  Verde si la fecha fin real es anterior a la planificada (a tiempo),  Rojo si hay retraso,  Naranja si la tarea está en curso.": "In the Gantt SVG, each task shows a thin actual bar below the planned bar. The color indicates status:  Green if the actual end date is earlier than planned (on time),  Red if delayed,  Orange if the task is in progress.",
    "El botón  Ruta Crítica resalta las tareas críticas en rojo en el Gantt y verde en la WBS. La duración se convierte a días calendario con sumarDiasHabiles() para precisión. La barra de información muestra total de días y horas.": "The Critical Path button highlights critical tasks in red on the Gantt and green on the WBS. Duration is converted to calendar days with sumarDiasHabiles() for accuracy. The info bar shows total days and hours.",
    "El botón  Auto Schedule reorganiza automáticamente las fechas según las dependencias, incluyendo hitos. Calcula la ruta crítica y programa cada tarea lo antes posible respetando fines de semana.": "The Auto Schedule button automatically rearranges dates according to dependencies, including milestones. It calculates the critical path and schedules each task as early as possible while respecting weekends.",
    "Las dependencias de tipo FS (Finish-to-Start) que finalizan el mismo día en que otra comienza se separan visualmente con un desplazamiento automático para solapar las barras.": "FS (Finish-to-Start) dependencies that end on the same day another begins are visually separated with an automatic offset to overlap the bars.",
    "El botón  en la toolbar genera un listado topológico (Kahn) de todas las tareas con códigos EDT, ordenadas según dependencias. Incluye botones de  Impresión y  CSV para exportar.": "The button in the toolbar generates a topological list (Kahn) of all tasks with WBS codes, sorted by dependencies. Includes Print and CSV buttons for export.",
    "El botón  abre un modal drag & drop para importar tareas desde CSV. Detecta automáticamente columnas (nombre, duración, inicio, predecesores, etc.) y el delimitador. Muestra preview antes de confirmar la importación.": "The button opens a drag & drop modal to import tasks from CSV. It automatically detects columns (name, duration, start, predecessors, etc.) and the delimiter. Shows a preview before confirming the import.",
    "Puedes seleccionar entre Cascada, Agile (Scrum) o Mixto. La metodología afecta a cómo se calcula la velocidad del equipo y la planificación de sprints.": "You can select between Waterfall, Agile (Scrum), or Hybrid. The methodology affects how team velocity and sprint planning are calculated.",
    "La WBS se muestra con fuentes más grandes (EDTs a 14px/600, elementos a 13px/500). Las fechas y nombres dentro de las barras SVG usan 12px/600 para mejor legibilidad.": "The WBS is displayed with larger fonts (WBS codes at 14px/600, elements at 13px/500). Dates and names inside SVG bars use 12px/600 for better readability.",
    "Identifica, evalúa y da seguimiento a los riesgos del proyecto.": "Identify, assess, and track project risks.",
    "Visualiza los riesgos en una matriz probabilidad-impacto con colores:  Bajo,  Medio,  Alto,  Crítico.": "Visualize risks in a probability-impact matrix with colors:  Low,  Medium,  High,  Critical.",
    "El sistema genera recomendaciones automáticas basadas en los riesgos críticos y altos identificados.": "The system generates automatic recommendations based on identified critical and high risks.",
    "Gestiona las partes interesadas del proyecto con una matriz poder/interés y una tabla detallada.": "Manage project stakeholders with a power/interest matrix and a detailed table.",
    "Clasifica a los stakeholders en cuatro cuadrantes: Gestionar de Cerca (alto poder, alto interés), Mantener Satisfechos (alto poder, bajo interés), Mantener Informados (bajo poder, alto interés) y Monitorear (bajo poder, bajo interés).": "Classifies stakeholders into four quadrants: Manage Closely (high power, high interest), Keep Satisfied (high power, low interest), Keep Informed (low power, high interest), and Monitor (low power, low interest).",
    "Asigna roles: Responsable (R), Aprobador (A), Consultado (C) e Informado (I) para cada actividad del proyecto.": "Assign roles: Responsible (R), Accountable (A), Consulted (C), and Informed (I) for each project activity.",
    "Los procesos se organizan en 5 grupos y 10 áreas de conocimiento según el estándar del PMI.": "Processes are organized into 5 groups and 10 knowledge areas according to the PMI standard.",
    "Genera 7 tipos de informes basados en la 8ª Edición con datos reales del proyecto y gráficos profesionales.": "Generates 7 types of reports based on the 8th Edition with real project data and professional charts.",
    "Los informes usan Chart.js con estilo profesional: gráficos doughnut con cutout 55%, gradientes de color, hoverOffset 16, borderRadius 6 y tooltips redondeados. Los colores de texto (títulos, ejes, leyendas) se adaptan automáticamente: #e0e0e0 en modo oscuro, #1a1a2e en modo claro.": "Reports use Chart.js with a professional style: doughnut charts with cutout 55%, color gradients, hoverOffset 16, borderRadius 6, and rounded tooltips. Text colors (titles, axes, legends) adapt automatically: #e0e0e0 in dark mode, #1a1a2e in light mode.",
    "El AC (Actual Cost) se calcula como costeTotal × % tiempo transcurrido (prorrateo temporal). EAC se calcula siempre como BAC / CPI. Los EDTs se filtran del peso para EV. La desviación del cronograma usa sumarDiasHabiles() en lugar de setDate + duración.": "AC (Actual Cost) is calculated as totalCost × % elapsed time (temporal proration). EAC is always calculated as BAC / CPI. WBS codes are filtered from weight for EV. Schedule variance uses sumarDiasHabiles() instead of setDate + duration.",
    "Usa el botón \" Exportar PDF\" para descargar cualquier informe. Los gráficos Chart.js se capturan automáticamente como imágenes.": "Use the \"Export PDF\" button to download any report. Chart.js charts are automatically captured as images.",
    "Gestiona las comunicaciones del proyecto: reuniones, informes, actas y distribución de información.": "Manage project communications: meetings, reports, minutes, and information distribution.",
    "Cada comunicación registra: fecha, tipo (reunión/informe/email/acta), emisor, receptor, asunto, medio, estado y adjuntos.": "Each communication records: date, type (meeting/report/email/minutes), sender, recipient, subject, medium, status, and attachments.",
    "Registra y da seguimiento a las solicitudes de cambio del proyecto con su ciclo de vida completo.": "Register and track project change requests with their complete lifecycle.",
    "Registra las lecciones aprendidas durante el proyecto para mejorar la gestión futura.": "Record lessons learned during the project to improve future management.",
    "El módulo Agile incluye herramientas para gestión de sprints, velocity tracking y métricas ágiles.": "The Agile module includes tools for sprint management, velocity tracking, and agile metrics.",
    "NOTA: La velocidad del equipo solo aplica para metodologías Agile o Mixta. En Cascada la velocidad se muestra como 0.": "NOTE: Team velocity only applies to Agile or Hybrid methodologies. In Waterfall, velocity is shown as 0.",
    "El administrador puede gestionar usuarios, roles y permisos desde el panel de administración.": "The administrator can manage users, roles, and permissions from the administration panel.",
    "Cada rol tiene permisos predefinidos sobre los módulos: Salud, Costes, Cronograma, Riesgos, Stakeholders, Procesos, Informes y más. Los administradores pueden personalizar permisos por usuario.": "Each role has predefined permissions over modules: Health, Costs, Schedule, Risks, Stakeholders, Processes, Reports, and more. Administrators can customize permissions per user.",
    "La aplicación puede enviar notificaciones por correo electrónico automáticamente al crear o editar tareas.": "The application can automatically send email notifications when creating or editing tasks.",
    "Haz clic en el botón  en la barra superior para abrir el modal de configuración de EmailJS. Necesitarás un Service ID, Template ID y User ID de tu cuenta en emailjs.com.": "Click the button in the top bar to open the EmailJS configuration modal. You will need a Service ID, Template ID, and User ID from your emailjs.com account.",
    "Cuando creas o editas una tarea que tiene un recurso con email asignado, se envía una notificación automática al correo del responsable informando de la tarea, fechas y estado.": "When you create or edit a task that has a resource with an assigned email, an automatic notification is sent to the person in charge informing them of the task, dates, and status.",
    "La simulación Monte Carlo permite estimar la probabilidad de cumplir con los plazos y presupuestos del proyecto mediante simulación estadística iterativa.": "The Monte Carlo simulation allows estimating the probability of meeting project deadlines and budgets through iterative statistical simulation.",
    "El motor ejecuta cientos o miles de simulaciones variando aleatoriamente la duración de cada tarea (distribución triangular, normal o uniforme). Para cada iteración se calcula la duración total y el coste total del proyecto.": "The engine runs hundreds or thousands of simulations randomly varying the duration of each task (triangular, normal, or uniform distribution). For each iteration, the total duration and total project cost are calculated.",
    "Muestra la mediana (P50), percentil 80 (P80), percentil 95 (P95), y la probabilidad de terminar dentro del plan. Incluye histogramas de duración y coste, más una curva S de probabilidad acumulada.": "Shows the median (P50), 80th percentile (P80), 95th percentile (P95), and the probability of finishing within plan. Includes duration and cost histograms, plus an S-curve of cumulative probability.",
    "Desde el botón  Monte Carlo en la barra de herramientas del cronograma Gantt.": "From the Monte Carlo button in the Gantt chart toolbar.",
    "Genera una vista pública del proyecto en un archivo HTML autónomo que puede compartirse con stakeholders sin necesidad de autenticación.": "Generates a public view of the project in a standalone HTML file that can be shared with stakeholders without requiring authentication.",
    "Incluye: nombre del proyecto, presupuesto, ingreso previsto, duración, riesgos, equipo, tareas con progreso y un gráfico doughnut de porcentaje completado.": "Includes: project name, budget, expected revenue, duration, risks, team, tasks with progress, and a doughnut chart of completion percentage.",
    "A diferencia de otras herramientas, no requiere que el destinatario tenga cuenta, login, ni acceso al sistema. Es una instantánea estática del estado actual del proyecto.": "Unlike other tools, it does not require the recipient to have an account, login, or system access. It is a static snapshot of the current project status.",
    "La aplicación incluye un servidor backend PHP con SQLite para servir archivos estáticos y manejar la API REST.": "The application includes a PHP backend server with SQLite to serve static files and handle the REST API.",
    "Para iniciar el servidor, ejecuta desde la carpeta backend/: php -S 0.0.0.0:8000 index.php": "To start the server, run from the backend/ folder: php -S 0.0.0.0:8000 index.php",
    "El servidor sirve archivos estáticos (HTML, CSS, JS) para acceso desde dispositivos móviles sin necesidad de abrir index.html manualmente. Las rutas API se manejan desde index.php con SQLite como base de datos.": "The server serves static files (HTML, CSS, JS) for access from mobile devices without needing to open index.html manually. API routes are handled from index.php with SQLite as the database.",
    "La aplicación ahora es instalable como PWA. Al abrir en un navegador compatible, verás un aviso para \"Instalar\" la app. Esto permite acceso sin conexión y apariencia de aplicación nativa en móvil y escritorio.": "The application is now installable as a PWA. When opening in a compatible browser, you will see a prompt to \"Install\" the app. This allows offline access and a native app appearance on mobile and desktop.",
    "Usa el botón de tema en la cabecera para alternar entre modo claro  y oscuro . La preferencia se guarda automáticamente. Todos los gráficos y colores de la interfaz se adaptan al tema seleccionado.": "Use the theme button in the header to toggle between light and dark mode. The preference is saved automatically. All charts and interface colors adapt to the selected theme.",
    "Cambia el idioma de la interfaz entre Español 🇪🇸, Inglés 🇬🇧, Francés 🇫🇷 y Alemán 🇩🇪 desde el botón  Cambiar idioma.": "Change the interface language between Spanish 🇪🇸, English 🇬🇧, French 🇫🇷, and German 🇩🇪 from the Change Language button.",
    "El botón  IA en la barra lateral del proyecto abre un asistente de inteligencia artificial para ayudar con la gestión del proyecto.": "The AI button in the project sidebar opens an artificial intelligence assistant to help with project management.",
    "Pulsa el botón + (icono \"Nuevo Proyecto\") en la cabecera de la cartera e introduce nombre, alcance, fechas, país y moneda base. El proyecto se crea con un acta de inicio automática.": "Press the + button (\"New Project\" icon) in the portfolio header and enter name, scope, dates, country, and base currency. The project is created with an automatic project charter.",
    "Usa el botón con el icono de impresora para exportar el informe a PDF. Los gráficos Chart.js se capturan automáticamente como imágenes.": "Use the printer icon button to export the report to PDF. Chart.js charts are automatically captured as images.",
    "La vista de Monedas es una pantalla única: cabecera con botones de icono para actualizar tasas (↻) y guardar (✓), fila de chips con el total de monedas, fuente, última actualización y moneda base, más una tabla de tasas con búsqueda y filtro por región. La sección \"Avanzado\" (plegable) incluye evolución histórica, precio de venta y condiciones de pago, proveedor de tasas, actualización automática y botones para probar conexión, exportar e importar CSV.": "The Currencies view is a single screen: header with icon buttons to refresh rates (↻) and save (✓), a chip row with total currencies, source, last update, and base currency, plus a rates table with search and region filter. The \"Advanced\" section (collapsible) includes historical evolution, sale price and payment terms, rates provider, automatic updates, and buttons to test connection, export, and import CSV.",
    "Usa el botón de tema en la barra lateral para alternar entre modo claro y oscuro. La preferencia se guarda automáticamente. Todos los gráficos y colores de la interfaz se adaptan al tema seleccionado.": "Use the theme button in the sidebar to toggle between light and dark mode. The preference is saved automatically. All charts and interface colors adapt to the selected theme.",
    "Cambia el idioma de la interfaz entre Español 🇪🇸, Inglés 🇬🇧, Francés 🇫🇷 y Alemán 🇩🇪 desde el botón de idioma en la barra lateral.": "Change the interface language between Spanish 🇪🇸, English 🇬🇧, French 🇫🇷, and German 🇩🇪 from the language button in the sidebar.",
    "En la barra lateral, tu avatar con la inicial y tu nombre y rol abren el modal de perfil al hacer clic. La campana muestra las notificaciones y el icono de salida cierra la sesión.": "In the sidebar, your avatar with the initial and your name and role open the profile modal when clicked. The bell shows notifications and the logout icon ends the session.",
    "El panel de Equipo gestiona los miembros del proyecto con su coste por hora, moneda y horas mensuales.": "The Team panel manages project members with their hourly cost, currency, and monthly hours.",
    "Pulsa el botón + para añadir un miembro del equipo. El icono de libro abre el catálogo de equipo para importar perfiles predefinidos.": "Press the + button to add a team member. The book icon opens the team catalog to import predefined profiles.",
    "El panel de Materiales registra los materiales del proyecto con proveedor, cantidad, coste, país de origen, INCOTERM, arancel y condiciones de pago.": "The Materials panel records project materials with supplier, quantity, cost, country of origin, INCOTERM, tariff, and payment terms.",
    "Pulsa el botón + para añadir un material. El icono de libro importa desde el catálogo de materiales y el icono de actualizar recalcula los aranceles.": "Press the + button to add a material. The book icon imports from the materials catalog and the refresh icon recalculates tariffs.",
    "El panel de Servicios registra servicios contratados con proveedor, cantidad, coste, impuesto y mes de imputación.": "The Services panel records contracted services with supplier, quantity, cost, tax, and allocation month.",
    "Pulsa el botón + para añadir un servicio. El coste se integra automáticamente en el cashflow del proyecto.": "Press the + button to add a service. The cost is automatically integrated into the project cashflow.",
    "El panel de Viajes gestiona los desplazamientos del proyecto con tarjetas de totales por categoría: vuelos, hoteles, comidas y traslados.": "The Travel panel manages project trips with total cards by category: flights, hotels, meals, and transfers.",
    "Pulsa el botón + para registrar un nuevo viaje con origen, destino, fechas y archivos adjuntos. El icono de exportar descarga el listado de viajes.": "Press the + button to register a new trip with origin, destination, dates, and attachments. The export icon downloads the travel list.",
    "El panel de Logística es un simulador 3D de cubicaje para planificar el transporte de mercancías por vía aérea, marítima o almacén.": "The Logistics panel is a 3D stowage simulator to plan cargo transport by air, sea, or warehouse.",
    "Usa \"Añadir Otra Unidad\" para crear contenedores y asigna materiales a cada bulto. Los iconos de la cabecera guardan y cargan el estado, y exportan a CSV o PDF.": "Use \"Add Another Unit\" to create containers and assign materials to each package. The header icons save and load the state, and export to CSV or PDF.",
    "El panel de Venta define el precio de venta, la moneda y las condiciones de pago del proyecto.": "The Sales panel defines the project sale price, currency, and payment terms.",
    "Pulsa el botón + para añadir hitos financieros de cobro. Los ingresos se distribuyen en el cashflow a partir de estos hitos.": "Press the + button to add financial collection milestones. Income is distributed in the cashflow based on these milestones.",
    "El panel de Avales y Garantías Bancarias registra los avales del proyecto.": "The Bank Guarantees panel records project guarantees.",
    "Pulsa el botón + para añadir un aval con su entidad, importe y fechas de vigencia.": "Press the + button to add a guarantee with its entity, amount, and validity dates.",
    "El panel de Seguros y Responsabilidad Civil registra los seguros del proyecto: transporte, RC, obras, etc.": "The Insurance and Liability panel records project insurance: transport, liability, works, etc.",
    "Pulsa el botón + para añadir un seguro. El coste se refleja automáticamente en el cashflow del mes indicado.": "Press the + button to add an insurance policy. The cost is automatically reflected in the cashflow of the indicated month.",
    "Dentro del análisis financiero se gestionan los aranceles por país, las tasas aduaneras y los costes financieros extra.": "Within the financial analysis, country tariffs, customs duties, and extra financial costs are managed.",
    "Usa el botón \"Añadir\" para crear aranceles por país, tasas aduaneras o costes financieros. El botón \"Actualizar\" recalcula los aranceles de todos los países.": "Use the \"Add\" button to create country tariffs, customs duties, or financial costs. The \"Update\" button recalculates tariffs for all countries."
};

var _listMap = {
    "CPI (Cost Performance Index): eficiencia del coste. >1 = por debajo del presupuesto.": "CPI (Cost Performance Index): cost efficiency. >1 = under budget.",
    "SPI (Schedule Performance Index): eficiencia del cronograma. >1 = adelantado.": "SPI (Schedule Performance Index): schedule efficiency. >1 = ahead of schedule.",
    "EV (Earned Value): valor ganado del trabajo completado (excluye EDTs del peso).": "EV (Earned Value): earned value of completed work (excludes WBS codes from weight).",
    "PV (Planned Value): valor planificado del trabajo programado.": "PV (Planned Value): planned value of scheduled work.",
    "AC (Actual Cost): prorrateado temporalmente como costeTotal × % tiempo transcurrido.": "AC (Actual Cost): temporally prorated as totalCost × % elapsed time.",
    "EAC (Estimate at Complete): BAC / CPI siempre, unificado.": "EAC (Estimate at Complete): BAC / CPI always, unified.",
    "Variación de Coste y Cronograma en porcentaje.": "Cost and Schedule variance in percentage.",
    "Salud General: indicador compuesto (CPI × SPI).": "Overall Health: composite indicator (CPI × SPI).",
    "Cada elemento tiene: nombre, fecha inicio, duración, responsable, tipo (tarea/hito/entregable/EDT), dependencias y estado.": "Each element has: name, start date, duration, person in charge, type (task/milestone/deliverable/WBS), dependencies, and status.",
    "Agrega elementos con \" Añadir\". Edita y elimina con los botones correspondientes.": "Add elements with \"Add\". Edit and delete with the corresponding buttons.",
    "Las dependencias se arrastran entre elementos para establecer relaciones secuenciales.": "Dependencies are dragged between elements to establish sequential relationships.",
    "Nombre, descripción, categoría y responsable.": "Name, description, category, and person in charge.",
    "Probabilidad (Muy Baja a Muy Alta) e Impacto (Muy Bajo a Muy Alto).": "Probability (Very Low to Very High) and Impact (Very Low to Very High).",
    "Severidad: calculada automáticamente como Probabilidad × Impacto.": "Severity: automatically calculated as Probability × Impact.",
    "Plan de respuesta y acciones preventivas.": "Response plan and preventive actions.",
    "Estado y fecha de identificación.": "Status and identification date.",
    "Inicio: definir el proyecto y obtener autorización.": "Initiating: define the project and obtain authorization.",
    "Planificación: establecer alcance, objetivos y plan de acción.": "Planning: establish scope, objectives, and action plan.",
    "Ejecución: coordinar recursos para completar el trabajo.": "Executing: coordinate resources to complete the work.",
    "Monitoreo y Control: tracking de progreso y gestión de cambios.": "Monitoring and Controlling: progress tracking and change management.",
    "Cierre: formalizar la finalización del proyecto.": "Closing: formalize project completion.",
    "Resumen Ejecutivo: visión general del estado del proyecto.": "Executive Summary: overview of project status.",
    "Estado de Costes: CPI, EV, PV, AC, EAC (BAC/CPI), variaciones y presupuesto.": "Cost Status: CPI, EV, PV, AC, EAC (BAC/CPI), variances, and budget.",
    "Estado de Cronograma: SPI, progreso, hitos y entregables.": "Schedule Status: SPI, progress, milestones, and deliverables.",
    "Análisis de Riesgos: matriz de calor y riesgos críticos.": "Risk Analysis: heat matrix and critical risks.",
    "Recursos: equipo, materiales y costes por recurso.": "Resources: team, materials, and costs per resource.",
    "Stakeholders: matriz de involucrados y RACI.": "Stakeholders: stakeholder matrix and RACI.",
    "Informe Final: consolidado completo del proyecto.": "Final Report: complete project consolidation.",
    "Descripción del cambio y justificación.": "Change description and justification.",
    "Impacto en alcance, coste, cronograma y calidad.": "Impact on scope, cost, schedule, and quality.",
    "Estado: Pendiente / En revisión / Aprobado / Rechazado.": "Status: Pending / Under review / Approved / Rejected.",
    "Prioridad, fecha de solicitud y decisión con comentarios.": "Priority, request date, and decision with comments.",
    "Categoría (procesos/técnica/gestión/comunicaciones/riesgos/otros).": "Category (processes/technical/management/communications/risks/other).",
    "Descripción de la experiencia.": "Experience description.",
    "Impacto (positivo/negativo) y recomendaciones.": "Impact (positive/negative) and recommendations.",
    "Estado: Abierta / Validada / Implementada.": "Status: Open / Validated / Implemented.",
    "Sprint Backlog: gestiona las tareas del sprint actual.": "Sprint Backlog: manage current sprint tasks.",
    "Sprint Burndown: gráfico de trabajo pendiente vs tiempo.": "Sprint Burndown: pending work vs time chart.",
    "Velocity Tracking: seguimiento de la velocidad del equipo.": "Velocity Tracking: team velocity tracking.",
    "Retrospectives: registro de retrospectivas de sprint.": "Retrospectives: sprint retrospective log.",
    "Agile Metrics: velocidad, deuda técnica, lead time.": "Agile Metrics: velocity, technical debt, lead time.",
    "Control Gastos Ágil: costes asociados a sprints.": "Agile Expense Control: costs associated with sprints.",
    "Admin: acceso total a todas las funciones.": "Admin: full access to all functions.",
    "Director de Proyecto (PM): gestión completa de proyectos.": "Project Manager (PM): complete project management.",
    "Analista: acceso a consulta y reportes.": "Analyst: query and reports access.",
    "Colaborador: acceso limitado a tareas asignadas.": "Contributor: limited access to assigned tasks.",
    "Consultor Externo / Cliente: visibilidad restringida.": "External Consultant / Client: restricted visibility.",
    "Iteraciones: 100 (rápido), 1,000 (preciso) o 5,000 (máxima precisión).": "Iterations: 100 (fast), 1,000 (accurate), or 5,000 (maximum accuracy).",
    "Variación: ±10% a ±50% sobre la duración planificada de cada tarea.": "Variation: ±10% to ±50% over the planned duration of each task.",
    "Distribución: Triangular (PERT), Normal o Uniforme.": "Distribution: Triangular (PERT), Normal, or Uniform.",
    "Haz clic en  Compartir en el panel de Salud del Proyecto.": "Click Share in the Project Health panel.",
    "Se descarga un archivo HTML con todos los KPIs, tareas y gráficos.": "An HTML file is downloaded with all KPIs, tasks, and charts.",
    "El archivo es autónomo: incluye Chart.js vía CDN y toda la información necesaria.": "The file is standalone: it includes Chart.js via CDN and all necessary information.",
    "Puedes enviarlo por email, alojarlo en cualquier servidor estático o abrirlo localmente.": "You can send it by email, host it on any static server, or open it locally.",
    "Agrega elementos con el botón + (icono \"Nuevo elemento\"). Edita y elimina con los botones correspondientes.": "Add elements with the + button (\"New element\" icon). Edit and delete with the corresponding buttons.",
    "Pulsa el botón con el icono de compartir en el panel de Salud del Proyecto.": "Press the share icon button in the Project Health panel."
};

manualTemasEN.forEach(function(t) {
    if (_enTitles[t.id]) t.titulo = _enTitles[t.id];
    t.contenido.forEach(function(c) {
        if (c.tipo === 'subtitulo') {
            var map = {
                'Crear proyecto': 'Create project',
                'Editar / Eliminar': 'Edit / Delete',
                'Filtros y búsqueda': 'Filters and search',
                'Respaldos': 'Backups',
                'Indicadores principales': 'Main indicators',
                'Cálculos EVM': 'EVM Calculations',
                'Estructura del coste total': 'Total cost structure',
                'Cashflow': 'Cashflow',
                'Gráficos profesionales': 'Professional charts',
                'Monedas': 'Currencies',
                'Gestión de elementos Gantt': 'Gantt element management',
                'Duración en horas': 'Duration in hours',
                'Días hábiles': 'Business days',
                'Barras reales vs planificadas': 'Actual vs planned bars',
                'Ruta Crítica': 'Critical Path',
                'Auto-Scheduler': 'Auto-Scheduler',
                'Desplazamiento intra-día': 'Intra-day offset',
                'Listado ordenado imprimible': 'Printable ordered list',
                'Importación CSV': 'CSV Import',
                'Metodología': 'Methodology',
                'Visualización': 'Visualization',
                'Campos del riesgo': 'Risk fields',
                'Matriz de calor': 'Heat matrix',
                'Recomendaciones': 'Recommendations',
                'Matriz Poder/Interés': 'Power/Interest Matrix',
                'Matriz RACI': 'RACI Matrix',
                'Grupos de Procesos': 'Process Groups',
                'Tipos de informe': 'Report types',
                'Gráficos profesionales': 'Professional charts',
                'Cálculos EVM': 'EVM Calculations',
                'Exportación a PDF': 'PDF Export',
                'Registro de comunicaciones': 'Communications log',
                'Campos principales': 'Main fields',
                'Estructura': 'Structure',
                'Componentes': 'Components',
                'Roles disponibles': 'Available roles',
                'Permisos por módulo': 'Module permissions',
                'Configuración': 'Configuration',
                'Envío automático': 'Automatic sending',
                '¿Cómo funciona?': 'How does it work?',
                'Configuración': 'Configuration',
                'Resultados': 'Results',
                'Acceso': 'Access',
                '¿Cómo funciona?': 'How does it work?',
                'Contenido del dashboard público': 'Public dashboard content',
                'Diferencia clave': 'Key difference',
                'Inicio del servidor': 'Server startup',
                'Acceso desde móvil': 'Mobile access',
                'PWA (Progressive Web App)': 'PWA (Progressive Web App)',
                'Tema (Claro / Oscuro)': 'Theme (Light / Dark)',
                'Idioma': 'Language',
                'Asistente IA': 'AI Assistant',
                'Menú de usuario': 'User menu',
                'Añadir miembros': 'Add members',
                'Añadir y gestionar': 'Add and manage',
                'Añadir servicios': 'Add services',
                'Registro de viajes': 'Travel log',
                'Contenedores y exportación': 'Containers and export',
                'Hitos financieros': 'Financial milestones',
                'Añadir avales': 'Add guarantees',
                'Añadir seguros': 'Add insurance'
            };
            if (map[c.valor]) c.valor = map[c.valor];
        }
        if (c.tipo === 'texto' && _textMap[c.valor]) {
            c.valor = _textMap[c.valor];
        }
        if (c.tipo === 'lista' && c.items) {
            c.items = c.items.map(function(i) {
                return _listMap[i] || i;
            });
        }
    });
});
const manualTemasFR = JSON.parse(JSON.stringify(manualTemasES));
var _frTitles = {
    intro: 'Introduction',
    proyectos: 'Gestion de Projet',
    salud: 'Santé du Projet',
    costes: 'Coûts et Finances',
    cronograma: 'Calendrier (Gantt)',
    riesgos: 'Gestion des Risques',
    stakeholders: 'Parties Prenantes',
    procesos: 'Processus',
    informes: 'Rapports',
    comunicaciones: 'Communications',
    cambios: 'Demandes de Changement',
    lecciones: 'Leçons Apprises',
    scrum: 'Module Scrum / Agile',
    usuarios: 'Gestion des Utilisateurs',
    email: 'Notifications EmailJS',
    montecarlo: 'Simulation Monte Carlo',
    compartir: 'Partager le Tableau de Bord',
    backend: 'Backend PHP',
    personalizar: 'Personnalisation',
    equipo: 'Équipe',
    materiales: 'Matériaux',
    servicios: 'Services',
    viajes: 'Voyages',
    logistica: 'Logistique',
    venta: 'Vente et Jalons Financiers',
    avales: 'Cautions et Garanties',
    seguros: 'Assurances et RC',
    aranceles: 'Droits de Douane et Coûts Financiers'
};
var _frTextMap = {
    "La aplicación PMI está diseñada para la gestión integral de proyectos siguiendo los estándares del Project Management Institute (8ª Edición). Permite administrar la cartera de proyectos, controlar costes, cronogramas, riesgos, stakeholders y generar informes ejecutivos.": "L'application PMI est conçue pour la gestion intégrale de projets selon les normes du Project Management Institute (8e Édition). Elle permet de gérer le portefeuille de projets, contrôler les coûts, les calendriers, les risques, les parties prenantes et générer des rapports exécutifs.",
    "Desde el panel principal (Dashboard) puedes crear, editar y supervisar todos tus proyectos. Cada proyecto contiene módulos especializados que cubren las áreas de conocimiento de la dirección de proyectos.": "Depuis le tableau de bord principal, vous pouvez créer, modifier et superviser tous vos projets. Chaque projet contient des modules spécialisés couvrant les domaines de connaissance de la direction de projet.",
    "El panel de cartera muestra todos los proyectos con sus indicadores clave: estado, presupuesto, fechas y progreso.": "Le panneau de portefeuille affiche tous les projets avec leurs indicateurs clés : statut, budget, dates et progression.",
    "Haz clic en \" Nuevo Proyecto\" e introduce nombre, alcance, fechas, país y moneda base. El proyecto se crea con un acta de inicio automática.": "Cliquez sur \"Nouveau Projet\" et saisissez le nom, la portée, les dates, le pays et la devise de base. Le projet est créé avec une charte de projet automatique.",
    "Usa los botones  y  en cada tarjeta de proyecto. Solo los administradores pueden eliminar proyectos.": "Utilisez les boutons sur chaque carte de projet. Seuls les administrateurs peuvent supprimer des projets.",
    "Usa el campo de búsqueda para filtrar proyectos por nombre. Los filtros de estado (Activos/Inactivos/Todos) permiten segmentar la vista.": "Utilisez le champ de recherche pour filtrer les projets par nom. Les filtres de statut (Actifs/Inactifs/Tous) permettent de segmenter la vue.",
    "En la sección de Respaldos puedes guardar la cartera completa en un archivo JSON, exportar a CSV o importar proyectos desde un archivo.": "Dans la section Sauvegardes, vous pouvez enregistrer l'intégralité du portefeuille dans un fichier JSON, exporter en CSV ou importer des projets depuis un fichier.",
    "El panel de Salud del Proyecto es el cuadro de mando principal. Muestra indicadores clave de rendimiento (KPI) en tiempo real con semáforos de color.": "Le panneau Santé du Projet est le tableau de bord principal. Il affiche des indicateurs clés de performance (KPI) en temps réel avec des feux de couleur.",
    "El coste total del proyecto se calcula como Σ(costeEstimado de cada elemento) + materiales + servicios + viajes (sin coste de equipo duplicado). La desviación del cronograma usa sumarDiasHabiles() en vez de setDate + duración para precisión con días hábiles.": "Le coût total du projet est calculé comme Σ(coûtEstimé de chaque élément) + matériaux + services + déplacements (sans coût d'équipement dupliqué). L'écart de calendrier utilise sumarDiasHabiles() au lieu de setDate + durée pour la précision des jours ouvrables.",
    "Los semáforos de salud usan códigos de color:  Verde (saludable),  Amarillo (precaución),  Rojo (crítico).": "Les feux de santé utilisent des codes de couleur :  Vert (bon),  Jaune (attention),  Rouge (critique).",
    "El módulo financiero permite gestionar todos los aspectos económicos del proyecto con cálculo automático del cashflow.": "Le module financier permet de gérer tous les aspects économiques du projet avec un calcul automatique du cashflow.",
    "El coste total del proyecto se compone de: Σ(costeEstimado de cada elemento Gantt) + materiales + servicios + viajes. El coste de equipo se integra a través del costeEstimado de los elementos.": "Le coût total du projet se compose de : Σ(coûtEstimé de chaque élément Gantt) + matériaux + services + déplacements. Le coût d'équipement est intégré via le coûtEstimé des éléments.",
    "El cashflow distribuye cada coste entre todos los meses que dura la tarea, calculando el mes índice desde la fecha de inicio del proyecto. Los ingresos se distribuyen desde los hitos financieros de cobro; si no existen, se reparte el precio de venta entre los meses con gasto.": "Le cashflow répartit chaque coût sur tous les mois de la tâche, en calculant le mois index depuis la date de début du projet. Les revenus sont répartis à partir des jalons financiers de perception ; s'ils n'existent pas, le prix de vente est réparti sur les mois avec dépenses.",
    "Los gráficos de cashflow e informes usan Chart.js con estilo profesional: gradientes, cutout 55%, hoverOffset 16, borderRadius 6 y puntos con borde blanco. Los colores de texto se adaptan automáticamente al tema (claro/oscuro).": "Les graphiques de cashflow et les rapports utilisent Chart.js avec un style professionnel : dégradés, cutout 55%, hoverOffset 16, borderRadius 6 et points avec bordure blanche. Les couleurs du texte s'adaptent automatiquement au thème (clair/sombre).",
    "Define la moneda base del proyecto y gestiona tipos de cambio para operaciones internacionales.": "Définissez la devise de base du projet et gérez les taux de change pour les opérations internationales.",
    "El cronograma Gantt permite planificar y visualizar las tareas del proyecto en una línea de tiempo interactiva con soporte para días y horas.": "Le diagramme de Gantt permet de planifier et visualiser les tâches du projet sur une chronologie interactive avec prise en charge des jours et des heures.",
    "Cada tarea puede configurarse con tipo de duración \"Días\" u \"Horas\". Las tareas en horas se convierten a días fraccionales (duraciónHoras / horasDia), ocupando un ancho proporcional en el Gantt. Si la duración es menor a 1 día, la barra se muestra con el tamaño mínimo.": "Chaque tâche peut être configurée avec un type de durée \"Jours\" ou \"Heures\". Les tâches en heures sont converties en jours fractionnaires (duréeHeures / heuresParJour), occupant une largeur proportionnelle dans le Gantt. Si la durée est inférieure à 1 jour, la barre est affichée à la taille minimale.",
    "Todas las fechas se calculan en días hábiles (lunes-viernes). sumarDiasHabiles() omite fines de semana. Si los días son < 1 (tareas en horas), la misma fecha es devuelta sin cambios. El auto-scheduler y la ruta crítica también usan días hábiles.": "Toutes les dates sont calculées en jours ouvrables (lundi-vendredi). sumarDiasHabiles() ignore les week-ends. Si les jours sont < 1 (tâches en heures), la même date est retournée sans changement. L'auto-planificateur et le chemin critique utilisent également les jours ouvrables.",
    "En el SVG del Gantt, cada tarea muestra una barra real delgada bajo la barra planificada. El color indica el estado:  Verde si la fecha fin real es anterior a la planificada (a tiempo),  Rojo si hay retraso,  Naranja si la tarea está en curso.": "Dans le SVG du Gantt, chaque tâche affiche une barre réelle fine sous la barre planifiée. La couleur indique le statut :  Vert si la date de fin réelle est antérieure à la planifiée (à temps),  Rouge si retard,  Orange si la tâche est en cours.",
    "El botón  Ruta Crítica resalta las tareas críticas en rojo en el Gantt y verde en la WBS. La duración se convierte a días calendario con sumarDiasHabiles() para precisión. La barra de información muestra total de días y horas.": "Le bouton Chemin Critique met en évidence les tâches critiques en rouge dans le Gantt et en vert dans la WBS. La durée est convertie en jours calendaires avec sumarDiasHabiles() pour la précision. La barre d'information affiche le total des jours et des heures.",
    "El botón  Auto Schedule reorganiza automáticamente las fechas según las dependencias, incluyendo hitos. Calcula la ruta crítica y programa cada tarea lo antes posible respetando fines de semana.": "Le bouton Auto-Planificateur réorganise automatiquement les dates selon les dépendances, y compris les jalons. Il calcule le chemin critique et planifie chaque tâche au plus tôt en respectant les week-ends.",
    "Las dependencias de tipo FS (Finish-to-Start) que finalizan el mismo día en que otra comienza se separan visualmente con un desplazamiento automático para solapar las barras.": "Les dépendances de type FS (Finish-to-Start) qui se terminent le même jour qu'une autre commence sont séparées visuellement avec un décalage automatique pour chevaucher les barres.",
    "El botón  en la toolbar genera un listado topológico (Kahn) de todas las tareas con códigos EDT, ordenadas según dependencias. Incluye botones de  Impresión y  CSV para exportar.": "Le bouton dans la barre d'outils génère une liste topologique (Kahn) de toutes les tâches avec les codes WBS, triées par dépendances. Inclut les boutons d'Impression et CSV pour l'exportation.",
    "El botón  abre un modal drag & drop para importar tareas desde CSV. Detecta automáticamente columnas (nombre, duración, inicio, predecesores, etc.) y el delimitador. Muestra preview antes de confirmar la importación.": "Le bouton ouvre un modal glisser-déposer pour importer des tâches depuis CSV. Il détecte automatiquement les colonnes (nom, durée, début, prédécesseurs, etc.) et le délimiteur. Affiche un aperçu avant de confirmer l'importation.",
    "Puedes seleccionar entre Cascada, Agile (Scrum) o Mixto. La metodología afecta a cómo se calcula la velocidad del equipo y la planificación de sprints.": "Vous pouvez choisir entre Cascade, Agile (Scrum) ou Hybride. La méthodologie affecte le calcul de la vélocité de l'équipe et la planification des sprints.",
    "La WBS se muestra con fuentes más grandes (EDTs a 14px/600, elementos a 13px/500). Las fechas y nombres dentro de las barras SVG usan 12px/600 para mejor legibilidad.": "La WBS est affichée avec des polices plus grandes (WBS à 14px/600, éléments à 13px/500). Les dates et noms dans les barres SVG utilisent 12px/600 pour une meilleure lisibilité.",
    "Identifica, evalúa y da seguimiento a los riesgos del proyecto.": "Identifiez, évaluez et suivez les risques du projet.",
    "Visualiza los riesgos en una matriz probabilidad-impacto con colores:  Bajo,  Medio,  Alto,  Crítico.": "Visualisez les risques dans une matrice probabilité-impact avec des couleurs :  Faible,  Moyen,  Élevé,  Critique.",
    "El sistema genera recomendaciones automáticas basadas en los riesgos críticos y altos identificados.": "Le système génère des recommandations automatiques basées sur les risques critiques et élevés identifiés.",
    "Gestiona las partes interesadas del proyecto con una matriz poder/interés y una tabla detallada.": "Gérez les parties prenantes du projet avec une matrice pouvoir/intérêt et un tableau détaillé.",
    "Clasifica a los stakeholders en cuatro cuadrantes: Gestionar de Cerca (alto poder, alto interés), Mantener Satisfechos (alto poder, bajo interés), Mantener Informados (bajo poder, alto interés) y Monitorear (bajo poder, bajo interés).": "Classez les parties prenantes en quatre quadrants : Gérer de près (pouvoir élevé, intérêt élevé), Maintenir Satisfaits (pouvoir élevé, intérêt faible), Tenir Informés (pouvoir faible, intérêt élevé) et Surveiller (pouvoir faible, intérêt faible).",
    "Asigna roles: Responsable (R), Aprobador (A), Consultado (C) e Informado (I) para cada actividad del proyecto.": "Attribuez les rôles : Responsable (R), Approbateur (A), Consulté (C) et Informé (I) pour chaque activité du projet.",
    "Los procesos se organizan en 5 grupos y 10 áreas de conocimiento según el estándar del PMI.": "Les processus sont organisés en 5 groupes et 10 domaines de connaissance selon la norme du PMI.",
    "Genera 7 tipos de informes basados en la 8ª Edición con datos reales del proyecto y gráficos profesionales.": "Génère 7 types de rapports basés sur la 8e Édition avec des données réelles du projet et des graphiques professionnels.",
    "Los informes usan Chart.js con estilo profesional: gráficos doughnut con cutout 55%, gradientes de color, hoverOffset 16, borderRadius 6 y tooltips redondeados. Los colores de texto (títulos, ejes, leyendas) se adaptan automáticamente: #e0e0e0 en modo oscuro, #1a1a2e en modo claro.": "Les rapports utilisent Chart.js avec un style professionnel : graphiques doughnut avec cutout 55%, dégradés de couleur, hoverOffset 16, borderRadius 6 et infobulles arrondies. Les couleurs du texte (titres, axes, légendes) s'adaptent automatiquement : #e0e0e0 en mode sombre, #1a1a2e en mode clair.",
    "El AC (Actual Cost) se calcula como costeTotal × % tiempo transcurrido (prorrateo temporal). EAC se calcula siempre como BAC / CPI. Los EDTs se filtran del peso para EV. La desviación del cronograma usa sumarDiasHabiles() en lugar de setDate + duración.": "L'AC (Coût Réel) est calculé comme coûtTotal × % temps écoulé (prorata temporel). L'EAC est toujours calculé comme BAC / CPI. Les codes WBS sont filtrés du poids pour l'EV. L'écart de calendrier utilise sumarDiasHabiles() au lieu de setDate + durée.",
    "Usa el botón \" Exportar PDF\" para descargar cualquier informe. Los gráficos Chart.js se capturan automáticamente como imágenes.": "Utilisez le bouton \"Exporter PDF\" pour télécharger n'importe quel rapport. Les graphiques Chart.js sont automatiquement capturés comme images.",
    "Gestiona las comunicaciones del proyecto: reuniones, informes, actas y distribución de información.": "Gérez les communications du projet : réunions, rapports, comptes rendus et distribution d'informations.",
    "Cada comunicación registra: fecha, tipo (reunión/informe/email/acta), emisor, receptor, asunto, medio, estado y adjuntos.": "Chaque communication enregistre : date, type (réunion/rapport/email/compte rendu), émetteur, destinataire, sujet, moyen, statut et pièces jointes.",
    "Registra y da seguimiento a las solicitudes de cambio del proyecto con su ciclo de vida completo.": "Enregistrez et suivez les demandes de changement du projet avec leur cycle de vie complet.",
    "Registra las lecciones aprendidas durante el proyecto para mejorar la gestión futura.": "Enregistrez les leçons apprises pendant le projet pour améliorer la gestion future.",
    "El módulo Agile incluye herramientas para gestión de sprints, velocity tracking y métricas ágiles.": "Le module Agile comprend des outils pour la gestion des sprints, le suivi de vélocité et les métriques agiles.",
    "NOTA: La velocidad del equipo solo aplica para metodologías Agile o Mixta. En Cascada la velocidad se muestra como 0.": "REMARQUE : La vélocité de l'équipe s'applique uniquement aux méthodologies Agile ou Hybride. En Cascade, la vélocité est affichée comme 0.",
    "El administrador puede gestionar usuarios, roles y permisos desde el panel de administración.": "L'administrateur peut gérer les utilisateurs, les rôles et les permissions depuis le panneau d'administration.",
    "Cada rol tiene permisos predefinidos sobre los módulos: Salud, Costes, Cronograma, Riesgos, Stakeholders, Procesos, Informes y más. Los administradores pueden personalizar permisos por usuario.": "Chaque rôle a des permissions prédéfinies sur les modules : Santé, Coûts, Calendrier, Risques, Parties Prenantes, Processus, Rapports et plus. Les administrateurs peuvent personnaliser les permissions par utilisateur.",
    "La aplicación puede enviar notificaciones por correo electrónico automáticamente al crear o editar tareas.": "L'application peut envoyer automatiquement des notifications par email lors de la création ou modification de tâches.",
    "Haz clic en el botón  en la barra superior para abrir el modal de configuración de EmailJS. Necesitarás un Service ID, Template ID y User ID de tu cuenta en emailjs.com.": "Cliquez sur le bouton dans la barre supérieure pour ouvrir le modal de configuration EmailJS. Vous aurez besoin d'un Service ID, Template ID et User ID de votre compte emailjs.com.",
    "Cuando creas o editas una tarea que tiene un recurso con email asignado, se envía una notificación automática al correo del responsable informando de la tarea, fechas y estado.": "Lorsque vous créez ou modifiez une tâche avec une ressource ayant un email assigné, une notification automatique est envoyée au responsable l'informant de la tâche, des dates et du statut.",
    "La simulación Monte Carlo permite estimar la probabilidad de cumplir con los plazos y presupuestos del proyecto mediante simulación estadística iterativa.": "La simulation Monte Carlo permet d'estimer la probabilité de respecter les délais et budgets du projet grâce à une simulation statistique itérative.",
    "El motor ejecuta cientos o miles de simulaciones variando aleatoriamente la duración de cada tarea (distribución triangular, normal o uniforme). Para cada iteración se calcula la duración total y el coste total del proyecto.": "Le moteur exécute des centaines ou milliers de simulations en variant aléatoirement la durée de chaque tâche (distribution triangulaire, normale ou uniforme). Pour chaque itération, la durée totale et le coût total du projet sont calculés.",
    "Muestra la mediana (P50), percentil 80 (P80), percentil 95 (P95), y la probabilidad de terminar dentro del plan. Incluye histogramas de duración y coste, más una curva S de probabilidad acumulada.": "Affiche la médiane (P50), le percentile 80 (P80), le percentile 95 (P95), et la probabilité de terminer dans le plan. Inclut des histogrammes de durée et de coût, plus une courbe S de probabilité cumulée.",
    "Desde el botón  Monte Carlo en la barra de herramientas del cronograma Gantt.": "Depuis le bouton Monte Carlo dans la barre d'outils du diagramme de Gantt.",
    "Genera una vista pública del proyecto en un archivo HTML autónomo que puede compartirse con stakeholders sin necesidad de autenticación.": "Génère une vue publique du projet dans un fichier HTML autonome pouvant être partagé avec les parties prenantes sans authentification.",
    "Incluye: nombre del proyecto, presupuesto, ingreso previsto, duración, riesgos, equipo, tareas con progreso y un gráfico doughnut de porcentaje completado.": "Inclut : nom du projet, budget, revenu prévu, durée, risques, équipe, tâches avec progression et un graphique doughnut du pourcentage achevé.",
    "A diferencia de otras herramientas, no requiere que el destinatario tenga cuenta, login, ni acceso al sistema. Es una instantánea estática del estado actual del proyecto.": "Contrairement à d'autres outils, il ne nécessite pas que le destinataire ait un compte, un login ou un accès au système. C'est un instantané statique de l'état actuel du projet.",
    "La aplicación incluye un servidor backend PHP con SQLite para servir archivos estáticos y manejar la API REST.": "L'application inclut un serveur backend PHP avec SQLite pour servir des fichiers statiques et gérer l'API REST.",
    "Para iniciar el servidor, ejecuta desde la carpeta backend/: php -S 0.0.0.0:8000 index.php": "Pour démarrer le serveur, exécutez depuis le dossier backend/: php -S 0.0.0.0:8000 index.php",
    "El servidor sirve archivos estáticos (HTML, CSS, JS) para acceso desde dispositivos móviles sin necesidad de abrir index.html manualmente. Las rutas API se manejan desde index.php con SQLite como base de datos.": "Le serveur sert des fichiers statiques (HTML, CSS, JS) pour l'accès depuis des appareils mobiles sans avoir à ouvrir index.html manuellement. Les routes API sont gérées depuis index.php avec SQLite comme base de données.",
    "La aplicación ahora es instalable como PWA. Al abrir en un navegador compatible, verás un aviso para \"Instalar\" la app. Esto permite acceso sin conexión y apariencia de aplicación nativa en móvil y escritorio.": "L'application est désormais installable comme PWA. En ouvrant dans un navigateur compatible, vous verrez une invitation à \"Installer\" l'application. Cela permet un accès hors ligne et une apparence d'application native sur mobile et bureau.",
    "Usa el botón de tema en la cabecera para alternar entre modo claro  y oscuro . La preferencia se guarda automáticamente. Todos los gráficos y colores de la interfaz se adaptan al tema seleccionado.": "Utilisez le bouton de thème dans l'en-tête pour basculer entre le mode clair et sombre. La préférence est sauvegardée automatiquement. Tous les graphiques et couleurs de l'interface s'adaptent au thème sélectionné.",
    "Cambia el idioma de la interfaz entre Español 🇪🇸, Inglés 🇬🇧, Francés 🇫🇷 y Alemán 🇩🇪 desde el botón  Cambiar idioma.": "Changez la langue de l'interface entre Espagnol 🇪🇸, Anglais 🇬🇧, Français 🇫🇷 et Allemand 🇩🇪 depuis le bouton Changer de langue.",
    "El botón  IA en la barra lateral del proyecto abre un asistente de inteligencia artificial para ayudar con la gestión del proyecto.": "Le bouton IA dans la barre latérale du projet ouvre un assistant d'intelligence artificielle pour aider à la gestion du projet.",
    "Pulsa el botón + (icono \"Nuevo Proyecto\") en la cabecera de la cartera e introduce nombre, alcance, fechas, país y moneda base. El proyecto se crea con un acta de inicio automática.": "Appuyez sur le bouton + (icône \"Nouveau Projet\") dans l'en-tête du portefeuille et saisissez le nom, la portée, les dates, le pays et la devise de base. Le projet est créé avec une charte de projet automatique.",
    "Usa el botón con el icono de impresora para exportar el informe a PDF. Los gráficos Chart.js se capturan automáticamente como imágenes.": "Utilisez le bouton avec l'icône d'imprimante pour exporter le rapport en PDF. Les graphiques Chart.js sont automatiquement capturés comme images.",
    "La vista de Monedas es una pantalla única: cabecera con botones de icono para actualizar tasas (↻) y guardar (✓), fila de chips con el total de monedas, fuente, última actualización y moneda base, más una tabla de tasas con búsqueda y filtro por región. La sección \"Avanzado\" (plegable) incluye evolución histórica, precio de venta y condiciones de pago, proveedor de tasas, actualización automática y botones para probar conexión, exportar e importar CSV.": "La vue Devises est un écran unique : en-tête avec boutons d'icône pour actualiser les taux (↻) et enregistrer (✓), rangée de puces avec le total des devises, la source, la dernière mise à jour et la devise de base, plus un tableau des taux avec recherche et filtre par région. La section \"Avancé\" (repliable) inclut l'évolution historique, le prix de vente et les conditions de paiement, le fournisseur de taux, la mise à jour automatique et des boutons pour tester la connexion, exporter et importer CSV.",
    "Usa el botón de tema en la barra lateral para alternar entre modo claro y oscuro. La preferencia se guarda automáticamente. Todos los gráficos y colores de la interfaz se adaptan al tema seleccionado.": "Utilisez le bouton de thème dans la barre latérale pour basculer entre le mode clair et sombre. La préférence est sauvegardée automatiquement. Tous les graphiques et couleurs de l'interface s'adaptent au thème sélectionné.",
    "Cambia el idioma de la interfaz entre Español 🇪🇸, Inglés 🇬🇧, Francés 🇫🇷 y Alemán 🇩🇪 desde el botón de idioma en la barra lateral.": "Changez la langue de l'interface entre Espagnol 🇪🇸, Anglais 🇬🇧, Français 🇫🇷 et Allemand 🇩🇪 depuis le bouton de langue dans la barre latérale.",
    "En la barra lateral, tu avatar con la inicial y tu nombre y rol abren el modal de perfil al hacer clic. La campana muestra las notificaciones y el icono de salida cierra la sesión.": "Dans la barre latérale, votre avatar avec l'initiale et votre nom et rôle ouvrent le modal de profil au clic. La cloche affiche les notifications et l'icône de sortie ferme la session.",
    "El panel de Equipo gestiona los miembros del proyecto con su coste por hora, moneda y horas mensuales.": "Le panneau Équipe gère les membres du projet avec leur coût horaire, leur devise et leurs heures mensuelles.",
    "Pulsa el botón + para añadir un miembro del equipo. El icono de libro abre el catálogo de equipo para importar perfiles predefinidos.": "Appuyez sur le bouton + pour ajouter un membre de l'équipe. L'icône de livre ouvre le catalogue d'équipe pour importer des profils prédéfinis.",
    "El panel de Materiales registra los materiales del proyecto con proveedor, cantidad, coste, país de origen, INCOTERM, arancel y condiciones de pago.": "Le panneau Matériaux enregistre les matériaux du projet avec fournisseur, quantité, coût, pays d'origine, INCOTERM, droit de douane et conditions de paiement.",
    "Pulsa el botón + para añadir un material. El icono de libro importa desde el catálogo de materiales y el icono de actualizar recalcula los aranceles.": "Appuyez sur le bouton + pour ajouter un matériau. L'icône de livre importe depuis le catalogue de matériaux et l'icône d'actualisation recalcule les droits de douane.",
    "El panel de Servicios registra servicios contratados con proveedor, cantidad, coste, impuesto y mes de imputación.": "Le panneau Services enregistre les services contractés avec fournisseur, quantité, coût, taxe et mois d'imputation.",
    "Pulsa el botón + para añadir un servicio. El coste se integra automáticamente en el cashflow del proyecto.": "Appuyez sur le bouton + pour ajouter un service. Le coût est automatiquement intégré au cashflow du projet.",
    "El panel de Viajes gestiona los desplazamientos del proyecto con tarjetas de totales por categoría: vuelos, hoteles, comidas y traslados.": "Le panneau Voyages gère les déplacements du projet avec des cartes de totaux par catégorie : vols, hôtels, repas et transferts.",
    "Pulsa el botón + para registrar un nuevo viaje con origen, destino, fechas y archivos adjuntos. El icono de exportar descarga el listado de viajes.": "Appuyez sur le bouton + pour enregistrer un nouveau voyage avec origine, destination, dates et pièces jointes. L'icône d'exportation télécharge la liste des voyages.",
    "El panel de Logística es un simulador 3D de cubicaje para planificar el transporte de mercancías por vía aérea, marítima o almacén.": "Le panneau Logistique est un simulateur 3D de cubage pour planifier le transport de marchandises par voie aérienne, maritime ou entrepôt.",
    "Usa \"Añadir Otra Unidad\" para crear contenedores y asigna materiales a cada bulto. Los iconos de la cabecera guardan y cargan el estado, y exportan a CSV o PDF.": "Utilisez \"Ajouter une autre unité\" pour créer des conteneurs et assignez des matériaux à chaque colis. Les icônes de l'en-tête enregistrent et chargent l'état, et exportent en CSV ou PDF.",
    "El panel de Venta define el precio de venta, la moneda y las condiciones de pago del proyecto.": "Le panneau Vente définit le prix de vente, la devise et les conditions de paiement du projet.",
    "Pulsa el botón + para añadir hitos financieros de cobro. Los ingresos se distribuyen en el cashflow a partir de estos hitos.": "Appuyez sur le bouton + pour ajouter des jalons financiers de perception. Les revenus sont répartis dans le cashflow à partir de ces jalons.",
    "El panel de Avales y Garantías Bancarias registra los avales del proyecto.": "Le panneau Cautions et Garanties Bancaires enregistre les cautions du projet.",
    "Pulsa el botón + para añadir un aval con su entidad, importe y fechas de vigencia.": "Appuyez sur le bouton + pour ajouter une caution avec son entité, son montant et ses dates de validité.",
    "El panel de Seguros y Responsabilidad Civil registra los seguros del proyecto: transporte, RC, obras, etc.": "Le panneau Assurances et Responsabilité Civile enregistre les assurances du projet : transport, RC, travaux, etc.",
    "Pulsa el botón + para añadir un seguro. El coste se refleja automáticamente en el cashflow del mes indicado.": "Appuyez sur le bouton + pour ajouter une assurance. Le coût est automatiquement reflété dans le cashflow du mois indiqué.",
    "Dentro del análisis financiero se gestionan los aranceles por país, las tasas aduaneras y los costes financieros extra.": "Dans l'analyse financière, les droits de douane par pays, les taxes douanières et les coûts financiers supplémentaires sont gérés.",
    "Usa el botón \"Añadir\" para crear aranceles por país, tasas aduaneras o costes financieros. El botón \"Actualizar\" recalcula los aranceles de todos los países.": "Utilisez le bouton \"Ajouter\" pour créer des droits de douane par pays, des taxes douanières ou des coûts financiers. Le bouton \"Actualiser\" recalcule les droits de douane de tous les pays."
};
var _frListMap = {
    "CPI (Cost Performance Index): eficiencia del coste. >1 = por debajo del presupuesto.": "CPI (Cost Performance Index) : efficacité des coûts. >1 = sous le budget.",
    "SPI (Schedule Performance Index): eficiencia del cronograma. >1 = adelantado.": "SPI (Schedule Performance Index) : efficacité du calendrier. >1 = en avance.",
    "EV (Earned Value): valor ganado del trabajo completado (excluye EDTs del peso).": "EV (Earned Value) : valeur acquise du travail terminé (exclut les codes WBS du poids).",
    "PV (Planned Value): valor planificado del trabajo programado.": "PV (Planned Value) : valeur planifiée du travail programmé.",
    "AC (Actual Cost): prorrateado temporalmente como costeTotal × % tiempo transcurrido.": "AC (Actual Cost) : proraté temporellement comme coûtTotal × % temps écoulé.",
    "EAC (Estimate at Complete): BAC / CPI siempre, unificado.": "EAC (Estimate at Complete) : BAC / CPI toujours, unifié.",
    "Variación de Coste y Cronograma en porcentaje.": "Variation des coûts et du calendrier en pourcentage.",
    "Salud General: indicador compuesto (CPI × SPI).": "Santé Générale : indicateur composite (CPI × SPI).",
    "Cada elemento tiene: nombre, fecha inicio, duración, responsable, tipo (tarea/hito/entregable/EDT), dependencias y estado.": "Chaque élément a : nom, date de début, durée, responsable, type (tâche/jalon/livrable/WBS), dépendances et statut.",
    "Agrega elementos con \" Añadir\". Edita y elimina con los botones correspondientes.": "Ajoutez des éléments avec \"Ajouter\". Modifiez et supprimez avec les boutons correspondants.",
    "Las dependencias se arrastran entre elementos para establecer relaciones secuenciales.": "Les dépendances sont glissées entre les éléments pour établir des relations séquentielles.",
    "Nombre, descripción, categoría y responsable.": "Nom, description, catégorie et responsable.",
    "Probabilidad (Muy Baja a Muy Alta) e Impacto (Muy Bajo a Muy Alto).": "Probabilité (Très Faible à Très Élevée) et Impact (Très Faible à Très Élevé).",
    "Severidad: calculada automáticamente como Probabilidad × Impacto.": "Sévérité : calculée automatiquement comme Probabilité × Impact.",
    "Plan de respuesta y acciones preventivas.": "Plan de réponse et actions préventives.",
    "Estado y fecha de identificación.": "Statut et date d'identification.",
    "Inicio: definir el proyecto y obtener autorización.": "Démarrage : définir le projet et obtenir l'autorisation.",
    "Planificación: establecer alcance, objetivos y plan de acción.": "Planification : établir la portée, les objectifs et le plan d'action.",
    "Ejecución: coordinar recursos para completar el trabajo.": "Exécution : coordonner les ressources pour terminer le travail.",
    "Monitoreo y Control: tracking de progreso y gestión de cambios.": "Surveillance et Contrôle : suivi de la progression et gestion des changements.",
    "Cierre: formalizar la finalización del proyecto.": "Clôture : formaliser l'achèvement du projet.",
    "Resumen Ejecutivo: visión general del estado del proyecto.": "Résumé Exécutif : vue d'ensemble de l'état du projet.",
    "Estado de Costes: CPI, EV, PV, AC, EAC (BAC/CPI), variaciones y presupuesto.": "État des Coûts : CPI, EV, PV, AC, EAC (BAC/CPI), variations et budget.",
    "Estado de Cronograma: SPI, progreso, hitos y entregables.": "État du Calendrier : SPI, progression, jalons et livrables.",
    "Análisis de Riesgos: matriz de calor y riesgos críticos.": "Analyse des Risques : matrice de chaleur et risques critiques.",
    "Recursos: equipo, materiales y costes por recurso.": "Ressources : équipe, matériaux et coûts par ressource.",
    "Stakeholders: matriz de involucrados y RACI.": "Parties Prenantes : matrice des intervenants et RACI.",
    "Informe Final: consolidado completo del proyecto.": "Rapport Final : consolidé complet du projet.",
    "Descripción del cambio y justificación.": "Description du changement et justification.",
    "Impacto en alcance, coste, cronograma y calidad.": "Impact sur la portée, le coût, le calendrier et la qualité.",
    "Estado: Pendiente / En revisión / Aprobado / Rechazado.": "Statut : En attente / En révision / Approuvé / Rejeté.",
    "Prioridad, fecha de solicitud y decisión con comentarios.": "Priorité, date de demande et décision avec commentaires.",
    "Categoría (procesos/técnica/gestión/comunicaciones/riesgos/otros).": "Catégorie (processus/technique/gestion/communications/risques/autres).",
    "Descripción de la experiencia.": "Description de l'expérience.",
    "Impacto (positivo/negativo) y recomendaciones.": "Impact (positif/négatif) et recommandations.",
    "Estado: Abierta / Validada / Implementada.": "Statut : Ouverte / Validée / Implémentée.",
    "Sprint Backlog: gestiona las tareas del sprint actual.": "Sprint Backlog : gère les tâches du sprint actuel.",
    "Sprint Burndown: gráfico de trabajo pendiente vs tiempo.": "Sprint Burndown : graphique du travail restant vs temps.",
    "Velocity Tracking: seguimiento de la velocidad del equipo.": "Velocity Tracking : suivi de la vélocité de l'équipe.",
    "Retrospectives: registro de retrospectivas de sprint.": "Rétrospectives : enregistrement des rétrospectives de sprint.",
    "Agile Metrics: velocidad, deuda técnica, lead time.": "Agile Metrics : vélocité, dette technique, lead time.",
    "Control Gastos Ágil: costes asociados a sprints.": "Contrôle des Dépenses Agile : coûts associés aux sprints.",
    "Admin: acceso total a todas las funciones.": "Admin : accès total à toutes les fonctions.",
    "Director de Proyecto (PM): gestión completa de proyectos.": "Directeur de Projet (PM) : gestion complète de projets.",
    "Analista: acceso a consulta y reportes.": "Analyste : accès aux consultations et rapports.",
    "Colaborador: acceso limitado a tareas asignadas.": "Collaborateur : accès limité aux tâches assignées.",
    "Consultor Externo / Cliente: visibilidad restringida.": "Consultant Externe / Client : visibilité restreinte.",
    "Iteraciones: 100 (rápido), 1,000 (preciso) o 5,000 (máxima precisión).": "Itérations : 100 (rapide), 1 000 (précis) ou 5 000 (précision maximale).",
    "Variación: ±10% a ±50% sobre la duración planificada de cada tarea.": "Variation : ±10% à ±50% sur la durée planifiée de chaque tâche.",
    "Distribución: Triangular (PERT), Normal o Uniforme.": "Distribution : Triangulaire (PERT), Normale ou Uniforme.",
    "Haz clic en  Compartir en el panel de Salud del Proyecto.": "Cliquez sur Partager dans le panneau Santé du Projet.",
    "Se descarga un archivo HTML con todos los KPIs, tareas y gráficos.": "Un fichier HTML est téléchargé avec tous les KPI, tâches et graphiques.",
    "El archivo es autónomo: incluye Chart.js vía CDN y toda la información necesaria.": "Le fichier est autonome : il inclut Chart.js via CDN et toutes les informations nécessaires.",
    "Puedes enviarlo por email, alojarlo en cualquier servidor estático o abrirlo localmente.": "Vous pouvez l'envoyer par email, l'héberger sur tout serveur statique ou l'ouvrir localement.",
    "Agrega elementos con el botón + (icono \"Nuevo elemento\"). Edita y elimina con los botones correspondientes.": "Ajoutez des éléments avec le bouton + (icône \"Nouvel élément\"). Modifiez et supprimez avec les boutons correspondants.",
    "Pulsa el botón con el icono de compartir en el panel de Salud del Proyecto.": "Appuyez sur le bouton avec l'icône de partage dans le panneau Santé du Projet."
};
manualTemasFR.forEach(function(t) {
    if (_frTitles[t.id]) t.titulo = _frTitles[t.id];
    t.contenido.forEach(function(c) {
        if (c.tipo === 'subtitulo') {
            var map = {
                'Crear proyecto': 'Créer un projet',
                'Editar / Eliminar': 'Modifier / Supprimer',
                'Filtros y búsqueda': 'Filtres et recherche',
                'Respaldos': 'Sauvegardes',
                'Indicadores principales': 'Indicateurs principaux',
                'Cálculos EVM': 'Calculs EVM',
                'Estructura del coste total': 'Structure du coût total',
                'Cashflow': 'Cashflow',
                'Gráficos profesionales': 'Graphiques professionnels',
                'Monedas': 'Devises',
                'Gestión de elementos Gantt': 'Gestion des éléments Gantt',
                'Duración en horas': 'Durée en heures',
                'Días hábiles': 'Jours ouvrables',
                'Barras reales vs planificadas': 'Barres réelles vs planifiées',
                'Ruta Crítica': 'Chemin Critique',
                'Auto-Scheduler': 'Auto-Planificateur',
                'Desplazamiento intra-día': 'Décalage intra-jour',
                'Listado ordenado imprimible': 'Liste ordonnée imprimable',
                'Importación CSV': 'Importation CSV',
                'Metodología': 'Méthodologie',
                'Visualización': 'Visualisation',
                'Campos del riesgo': 'Champs du risque',
                'Matriz de calor': 'Matrice de chaleur',
                'Recomendaciones': 'Recommandations',
                'Matriz Poder/Interés': 'Matrice Pouvoir/Intérêt',
                'Matriz RACI': 'Matrice RACI',
                'Grupos de Procesos': 'Groupes de Processus',
                'Tipos de informe': 'Types de rapport',
                'Exportación a PDF': 'Exportation PDF',
                'Registro de comunicaciones': 'Registre des communications',
                'Campos principales': 'Champs principaux',
                'Estructura': 'Structure',
                'Componentes': 'Composants',
                'Roles disponibles': 'Rôles disponibles',
                'Permisos por módulo': 'Permissions par module',
                'Configuración': 'Configuration',
                'Envío automático': 'Envoi automatique',
                '¿Cómo funciona?': 'Comment ça fonctionne ?',
                'Resultados': 'Résultats',
                'Acceso': 'Accès',
                'Contenido del dashboard público': 'Contenu du tableau de bord public',
                'Diferencia clave': 'Différence clé',
                'Inicio del servidor': 'Démarrage du serveur',
                'Acceso desde móvil': 'Accès mobile',
                'PWA (Progressive Web App)': 'PWA (Application Web Progressive)',
                'Tema (Claro / Oscuro)': 'Thème (Clair / Sombre)',
                'Idioma': 'Langue',
                'Asistente IA': 'Assistant IA',
                'Menú de usuario': 'Menu utilisateur',
                'Añadir miembros': 'Ajouter des membres',
                'Añadir y gestionar': 'Ajouter et gérer',
                'Añadir servicios': 'Ajouter des services',
                'Registro de viajes': 'Registre des voyages',
                'Contenedores y exportación': 'Conteneurs et exportation',
                'Hitos financieros': 'Jalons financiers',
                'Añadir avales': 'Ajouter des cautions',
                'Añadir seguros': 'Ajouter des assurances'
            };
            if (map[c.valor]) c.valor = map[c.valor];
        }
        if (c.tipo === 'texto' && _frTextMap[c.valor]) {
            c.valor = _frTextMap[c.valor];
        }
        if (c.tipo === 'lista' && c.items) {
            c.items = c.items.map(function(i) {
                return _frListMap[i] || i;
            });
        }
    });
});

const manualTemasDE = JSON.parse(JSON.stringify(manualTemasES));
var _deTitles = {
    intro: 'Einleitung',
    proyectos: 'Projektmanagement',
    salud: 'Projektstatus',
    costes: 'Kosten und Finanzen',
    cronograma: 'Zeitplan (Gantt)',
    riesgos: 'Risikomanagement',
    stakeholders: 'Interessengruppen',
    procesos: 'Prozesse',
    informes: 'Berichte',
    comunicaciones: 'Kommunikation',
    cambios: 'Änderungsanträge',
    lecciones: 'Erfahrungen',
    scrum: 'Scrum / Agile-Modul',
    usuarios: 'Benutzerverwaltung',
    email: 'EmailJS-Benachrichtigungen',
    montecarlo: 'Monte-Carlo-Simulation',
    compartir: 'Dashboard teilen',
    backend: 'PHP-Backend',
    personalizar: 'Anpassung',
    equipo: 'Team',
    materiales: 'Materialien',
    servicios: 'Dienstleistungen',
    viajes: 'Reisen',
    logistica: 'Logistik',
    venta: 'Verkauf und Finanzielle Meilensteine',
    avales: 'Bürgschaften',
    seguros: 'Versicherungen und Haftpflicht',
    aranceles: 'Zollsätze und Finanzkosten'
};
var _deTextMap = {
    "La aplicación PMI está diseñada para la gestión integral de proyectos siguiendo los estándares del Project Management Institute (8ª Edición). Permite administrar la cartera de proyectos, controlar costes, cronogramas, riesgos, stakeholders y generar informes ejecutivos.": "Die PMI-Anwendung ist für das umfassende Projektmanagement nach den Standards des Project Management Institute (8. Auflage) konzipiert. Sie ermöglicht die Verwaltung des Projektportfolios, die Kontrolle von Kosten, Zeitplänen, Risiken, Interessengruppen und die Erstellung von Führungsberichten.",
    "Desde el panel principal (Dashboard) puedes crear, editar y supervisar todos tus proyectos. Cada proyecto contiene módulos especializados que cubren las áreas de conocimiento de la dirección de proyectos.": "Vom Haupt-Dashboard aus können Sie alle Ihre Projekte erstellen, bearbeiten und überwachen. Jedes Projekt enthält spezialisierte Module, die die Wissensbereiche des Projektmanagements abdecken.",
    "El panel de cartera muestra todos los proyectos con sus indicadores clave: estado, presupuesto, fechas y progreso.": "Das Portfolio-Panel zeigt alle Projekte mit ihren Schlüsselindikatoren: Status, Budget, Termine und Fortschritt.",
    "Haz clic en \" Nuevo Proyecto\" e introduce nombre, alcance, fechas, país y moneda base. El proyecto se crea con un acta de inicio automática.": "Klicken Sie auf \"Neues Projekt\" und geben Sie Namen, Umfang, Daten, Land und Basiswährung ein. Das Projekt wird mit einer automatischen Projektcharta erstellt.",
    "Usa los botones  y  en cada tarjeta de proyecto. Solo los administradores pueden eliminar proyectos.": "Verwenden Sie die Schaltflächen auf jeder Projektkarte. Nur Administratoren können Projekte löschen.",
    "Usa el campo de búsqueda para filtrar proyectos por nombre. Los filtros de estado (Activos/Inactivos/Todos) permiten segmentar la vista.": "Verwenden Sie das Suchfeld, um Projekte nach Namen zu filtern. Die Statusfilter (Aktiv/Inaktiv/Alle) ermöglichen die Segmentierung der Ansicht.",
    "En la sección de Respaldos puedes guardar la cartera completa en un archivo JSON, exportar a CSV o importar proyectos desde un archivo.": "Im Bereich Sicherungen können Sie das gesamte Portfolio in einer JSON-Datei speichern, als CSV exportieren oder Projekte aus einer Datei importieren.",
    "El panel de Salud del Proyecto es el cuadro de mando principal. Muestra indicadores clave de rendimiento (KPI) en tiempo real con semáforos de color.": "Das Projektstatus-Panel ist das Haupt-Dashboard. Es zeigt Echtzeit-Leistungsindikatoren (KPIs) mit farbigen Ampeln an.",
    "El coste total del proyecto se calcula como Σ(costeEstimado de cada elemento) + materiales + servicios + viajes (sin coste de equipo duplicado). La desviación del cronograma usa sumarDiasHabiles() en vez de setDate + duración para precisión con días hábiles.": "Die Gesamtprojektkosten werden berechnet als Σ(geschätzteKosten jedes Elements) + Materialien + Dienstleistungen + Reisen (ohne doppelte Ausrüstungskosten). Die Zeitplanabweichung verwendet sumarDiasHabiles() anstelle von setDate + Dauer für die Genauigkeit an Werktagen.",
    "Los semáforos de salud usan códigos de color:  Verde (saludable),  Amarillo (precaución),  Rojo (crítico).": "Die Gesundheitsampeln verwenden Farbcodes:  Grün (gesund),  Gelb (Vorsicht),  Rot (kritisch).",
    "El módulo financiero permite gestionar todos los aspectos económicos del proyecto con cálculo automático del cashflow.": "Das Finanzmodul ermöglicht die Verwaltung aller wirtschaftlichen Aspekte des Projekts mit automatischer Cashflow-Berechnung.",
    "El coste total del proyecto se compone de: Σ(costeEstimado de cada elemento Gantt) + materiales + servicios + viajes. El coste de equipo se integra a través del costeEstimado de los elementos.": "Die Gesamtprojektkosten setzen sich zusammen aus: Σ(geschätzteKosten jedes Gantt-Elements) + Materialien + Dienstleistungen + Reisen. Die Ausrüstungskosten werden über die geschätzten Kosten der Elemente integriert.",
    "El cashflow distribuye cada coste entre todos los meses que dura la tarea, calculando el mes índice desde la fecha de inicio del proyecto. Los ingresos se distribuyen desde los hitos financieros de cobro; si no existen, se reparte el precio de venta entre los meses con gasto.": "Der Cashflow verteilt jede Kosten auf alle Monate der Aufgabenlaufzeit, wobei der Indexmonat ab dem Projektstartdatum berechnet wird. Einnahmen werden von den finanziellen Meilensteinen verteilt; wenn keine vorhanden sind, wird der Verkaufspreis auf die Monate mit Ausgaben aufgeteilt.",
    "Los gráficos de cashflow e informes usan Chart.js con estilo profesional: gradientes, cutout 55%, hoverOffset 16, borderRadius 6 y puntos con borde blanco. Los colores de texto se adaptan automáticamente al tema (claro/oscuro).": "Cashflow-Diagramme und Berichte verwenden Chart.js mit professionellem Stil: Farbverläufe, Cutout 55%, hoverOffset 16, borderRadius 6 und Punkte mit weißem Rand. Textfarben passen sich automatisch an das Design (hell/dunkel) an.",
    "Define la moneda base del proyecto y gestiona tipos de cambio para operaciones internacionales.": "Legen Sie die Basiswährung des Projekts fest und verwalten Sie Wechselkurse für internationale Geschäfte.",
    "El cronograma Gantt permite planificar y visualizar las tareas del proyecto en una línea de tiempo interactiva con soporte para días y horas.": "Das Gantt-Diagramm ermöglicht die Planung und Visualisierung von Projektaufgaben auf einer interaktiven Zeitleiste mit Unterstützung für Tage und Stunden.",
    "Cada tarea puede configurarse con tipo de duración \"Días\" u \"Horas\". Las tareas en horas se convierten a días fraccionales (duraciónHoras / horasDia), ocupando un ancho proporcional en el Gantt. Si la duración es menor a 1 día, la barra se muestra con el tamaño mínimo.": "Jede Aufgabe kann mit einem Dauertyp \"Tage\" oder \"Stunden\" konfiguriert werden. Stundeneinheiten werden in Bruchteile von Tagen umgerechnet (dauerStunden / stundenProTag) und nehmen eine proportionale Breite im Gantt ein. Ist die Dauer kürzer als 1 Tag, wird der Balken in Mindestgröße angezeigt.",
    "Todas las fechas se calculan en días hábiles (lunes-viernes). sumarDiasHabiles() omite fines de semana. Si los días son < 1 (tareas en horas), la misma fecha es devuelta sin cambios. El auto-scheduler y la ruta crítica también usan días hábiles.": "Alle Daten werden in Werktagen (Montag-Freitag) berechnet. sumarDiasHabiles() überspringt Wochenenden. Wenn die Tage < 1 sind (Stundenaufgaben), wird dasselbe Datum unverändert zurückgegeben. Der Auto-Planer und der kritische Pfad verwenden ebenfalls Werktage.",
    "En el SVG del Gantt, cada tarea muestra una barra real delgada bajo la barra planificada. El color indica el estado:  Verde si la fecha fin real es anterior a la planificada (a tiempo),  Rojo si hay retraso,  Naranja si la tarea está en curso.": "Im Gantt-SVG zeigt jede Aufgabe einen dünnen Ist-Balken unter dem Plan-Balken. Die Farbe zeigt den Status:  Grün wenn das tatsächliche Enddatum vor dem geplanten liegt (pünktlich),  Rot bei Verzögerung,  Orange wenn die Aufgabe läuft.",
    "El botón  Ruta Crítica resalta las tareas críticas en rojo en el Gantt y verde en la WBS. La duración se convierte a días calendario con sumarDiasHabiles() para precisión. La barra de información muestra total de días y horas.": "Die Schaltfläche Kritischer Pfad hebt kritische Aufgaben rot im Gantt und grün im PSP hervor. Die Dauer wird mit sumarDiasHabiles() in Kalendertage umgerechnet. Die Infoleiste zeigt die Gesamtzahl der Tage und Stunden.",
    "El botón  Auto Schedule reorganiza automáticamente las fechas según las dependencias, incluyendo hitos. Calcula la ruta crítica y programa cada tarea lo antes posible respetando fines de semana.": "Die Schaltfläche Auto-Planer ordnet Daten automatisch nach Abhängigkeiten neu, einschließlich Meilensteine. Er berechnet den kritischen Pfad und plant jede Aufgabe so früh wie möglich unter Berücksichtigung der Wochenenden.",
    "Las dependencias de tipo FS (Finish-to-Start) que finalizan el mismo día en que otra comienza se separan visualmente con un desplazamiento automático para solapar las barras.": "FS-Abhängigkeiten (Finish-to-Start), die am selben Tag enden, an dem eine andere beginnt, werden visuell durch einen automatischen Versatz getrennt, um die Balken zu überlappen.",
    "El botón  en la toolbar genera un listado topológico (Kahn) de todas las tareas con códigos EDT, ordenadas según dependencias. Incluye botones de  Impresión y  CSV para exportar.": "Die Schaltfläche in der Symbolleiste erzeugt eine topologische Liste (Kahn) aller Aufgaben mit PSP-Codes, sortiert nach Abhängigkeiten. Enthält Schaltflächen für Druck und CSV-Export.",
    "El botón  abre un modal drag & drop para importar tareas desde CSV. Detecta automáticamente columnas (nombre, duración, inicio, predecesores, etc.) y el delimitador. Muestra preview antes de confirmar la importación.": "Die Schaltfläche öffnet ein Drag-and-Drop-Modal zum Importieren von Aufgaben aus CSV. Es erkennt automatisch Spalten (Name, Dauer, Start, Vorgänger, etc.) und das Trennzeichen. Zeigt eine Vorschau vor dem Bestätigen des Imports.",
    "Puedes seleccionar entre Cascada, Agile (Scrum) o Mixto. La metodología afecta a cómo se calcula la velocidad del equipo y la planificación de sprints.": "Sie können zwischen Wasserfall, Agile (Scrum) oder Hybrid wählen. Die Methodik beeinflusst, wie die Teamgeschwindigkeit und die Sprintplanung berechnet werden.",
    "La WBS se muestra con fuentes más grandes (EDTs a 14px/600, elementos a 13px/500). Las fechas y nombres dentro de las barras SVG usan 12px/600 para mejor legibilidad.": "Der PSP wird mit größeren Schriftarten angezeigt (PSP-Codes bei 14px/600, Elemente bei 13px/500). Daten und Namen in SVG-Balken verwenden 12px/600 für bessere Lesbarkeit.",
    "Identifica, evalúa y da seguimiento a los riesgos del proyecto.": "Identifizieren, bewerten und verfolgen Sie die Risiken des Projekts.",
    "Visualiza los riesgos en una matriz probabilidad-impacto con colores:  Bajo,  Medio,  Alto,  Crítico.": "Visualisieren Sie Risiken in einer Wahrscheinlichkeits-Auswirkungs-Matrix mit Farben:  Niedrig,  Mittel,  Hoch,  Kritisch.",
    "El sistema genera recomendaciones automáticas basadas en los riesgos críticos y altos identificados.": "Das System generiert automatische Empfehlungen basierend auf den identifizierten kritischen und hohen Risiken.",
    "Gestiona las partes interesadas del proyecto con una matriz poder/interés y una tabla detallada.": "Verwalten Sie die Interessengruppen des Projekts mit einer Macht/Interessen-Matrix und einer detaillierten Tabelle.",
    "Clasifica a los stakeholders en cuatro cuadrantes: Gestionar de Cerca (alto poder, alto interés), Mantener Satisfechos (alto poder, bajo interés), Mantener Informados (bajo poder, alto interés) y Monitorear (bajo poder, bajo interés).": "Klassifiziert Interessengruppen in vier Quadranten: Eng Führen (hohe Macht, hohes Interesse), Zufrieden Stellen (hohe Macht, geringes Interesse), Informiert Halten (geringe Macht, hohes Interesse) und Überwachen (geringe Macht, geringes Interesse).",
    "Asigna roles: Responsable (R), Aprobador (A), Consultado (C) e Informado (I) para cada actividad del proyecto.": "Weist Rollen zu: Verantwortlich (R), Genehmiger (A), Konsultiert (C) und Informiert (I) für jede Projektaktivität.",
    "Los procesos se organizan en 5 grupos y 10 áreas de conocimiento según el estándar del PMI.": "Prozesse sind in 5 Prozessgruppen und 10 Wissensbereiche nach dem PMI-Standard organisiert.",
    "Genera 7 tipos de informes basados en la 8ª Edición con datos reales del proyecto y gráficos profesionales.": "Generiert 7 Berichtsarten basierend auf der 8. Auflage mit echten Projektdaten und professionellen Diagrammen.",
    "Los informes usan Chart.js con estilo profesional: gráficos doughnut con cutout 55%, gradientes de color, hoverOffset 16, borderRadius 6 y tooltips redondeados. Los colores de texto (títulos, ejes, leyendas) se adaptan automáticamente: #e0e0e0 en modo oscuro, #1a1a2e en modo claro.": "Berichte verwenden Chart.js mit professionellem Stil: Donut-Diagramme mit Cutout 55%, Farbverläufen, hoverOffset 16, borderRadius 6 und abgerundeten Tooltips. Textfarben (Titel, Achsen, Legenden) passen sich automatisch an: #e0e0e0 im dunklen Modus, #1a1a2e im hellen Modus.",
    "El AC (Actual Cost) se calcula como costeTotal × % tiempo transcurrido (prorrateo temporal). EAC se calcula siempre como BAC / CPI. Los EDTs se filtran del peso para EV. La desviación del cronograma usa sumarDiasHabiles() en lugar de setDate + duración.": "Der AC (Actual Cost) wird berechnet als Gesamtkosten × % verstrichene Zeit (zeitliche Proportionale). EAC wird immer als BAC / CPI berechnet. PSP-Codes werden aus dem Gewicht für EV herausgefiltert. Die Zeitplanabweichung verwendet sumarDiasHabiles() anstelle von setDate + Dauer.",
    "Usa el botón \" Exportar PDF\" para descargar cualquier informe. Los gráficos Chart.js se capturan automáticamente como imágenes.": "Verwenden Sie die Schaltfläche \"PDF exportieren\", um einen Bericht herunterzuladen. Chart.js-Diagramme werden automatisch als Bilder erfasst.",
    "Gestiona las comunicaciones del proyecto: reuniones, informes, actas y distribución de información.": "Verwalten Sie die Projektkommunikation: Besprechungen, Berichte, Protokolle und Informationsverteilung.",
    "Cada comunicación registra: fecha, tipo (reunión/informe/email/acta), emisor, receptor, asunto, medio, estado y adjuntos.": "Jede Kommunikation erfasst: Datum, Typ (Besprechung/Bericht/E-Mail/Protokoll), Absender, Empfänger, Betreff, Medium, Status und Anhänge.",
    "Registra y da seguimiento a las solicitudes de cambio del proyecto con su ciclo de vida completo.": "Erfassen und verfolgen Sie Projektänderungsanträge mit ihrem vollständigen Lebenszyklus.",
    "Registra las lecciones aprendidas durante el proyecto para mejorar la gestión futura.": "Erfassen Sie die während des Projekts gesammelten Erfahrungen, um das zukünftige Management zu verbessern.",
    "El módulo Agile incluye herramientas para gestión de sprints, velocity tracking y métricas ágiles.": "Das Agile-Modul enthält Werkzeuge für Sprint-Management, Velocity-Tracking und agile Metriken.",
    "NOTA: La velocidad del equipo solo aplica para metodologías Agile o Mixta. En Cascada la velocidad se muestra como 0.": "HINWEIS: Die Teamgeschwindigkeit gilt nur für Agile oder hybride Methoden. Bei Wasserfall wird die Geschwindigkeit als 0 angezeigt.",
    "El administrador puede gestionar usuarios, roles y permisos desde el panel de administración.": "Der Administrator kann Benutzer, Rollen und Berechtigungen über das Admin-Panel verwalten.",
    "Cada rol tiene permisos predefinidos sobre los módulos: Salud, Costes, Cronograma, Riesgos, Stakeholders, Procesos, Informes y más. Los administradores pueden personalizar permisos por usuario.": "Jede Rolle hat vordefinierte Berechtigungen für Module: Status, Kosten, Zeitplan, Risiken, Interessengruppen, Prozesse, Berichte und mehr. Administratoren können Berechtigungen pro Benutzer anpassen.",
    "La aplicación puede enviar notificaciones por correo electrónico automáticamente al crear o editar tareas.": "Die Anwendung kann beim Erstellen oder Bearbeiten von Aufgaben automatisch E-Mail-Benachrichtigungen senden.",
    "Haz clic en el botón  en la barra superior para abrir el modal de configuración de EmailJS. Necesitarás un Service ID, Template ID y User ID de tu cuenta en emailjs.com.": "Klicken Sie auf die Schaltfläche in der oberen Leiste, um das EmailJS-Konfigurationsmodal zu öffnen. Sie benötigen eine Service-ID, Template-ID und User-ID Ihres emailjs.com-Kontos.",
    "Cuando creas o editas una tarea que tiene un recurso con email asignado, se envía una notificación automática al correo del responsable informando de la tarea, fechas y estado.": "Wenn Sie eine Aufgabe erstellen oder bearbeiten, die eine Ressource mit zugewiesener E-Mail hat, wird automatisch eine Benachrichtigung an die verantwortliche Person gesendet, die über Aufgabe, Termine und Status informiert.",
    "La simulación Monte Carlo permite estimar la probabilidad de cumplir con los plazos y presupuestos del proyecto mediante simulación estadística iterativa.": "Die Monte-Carlo-Simulation ermöglicht die Abschätzung der Wahrscheinlichkeit, Projekttermine und -budgets einzuhalten, durch iterative statistische Simulation.",
    "El motor ejecuta cientos o miles de simulaciones variando aleatoriamente la duración de cada tarea (distribución triangular, normal o uniforme). Para cada iteración se calcula la duración total y el coste total del proyecto.": "Die Engine führt Hunderte oder Tausende von Simulationen durch, wobei die Dauer jeder Aufgabe zufällig variiert wird (dreieckige, normale oder gleichmäßige Verteilung). Für jede Iteration werden die Gesamtdauer und die Gesamtkosten des Projekts berechnet.",
    "Muestra la mediana (P50), percentil 80 (P80), percentil 95 (P95), y la probabilidad de terminar dentro del plan. Incluye histogramas de duración y coste, más una curva S de probabilidad acumulada.": "Zeigt den Median (P50), das 80. Perzentil (P80), das 95. Perzentil (P95) und die Wahrscheinlichkeit der Fertigstellung innerhalb des Plans. Enthält Histogramme für Dauer und Kosten sowie eine S-Kurve der kumulierten Wahrscheinlichkeit.",
    "Desde el botón  Monte Carlo en la barra de herramientas del cronograma Gantt.": "Über die Monte-Carlo-Schaltfläche in der Symbolleiste des Gantt-Diagramms.",
    "Genera una vista pública del proyecto en un archivo HTML autónomo que puede compartirse con stakeholders sin necesidad de autenticación.": "Erzeugt eine öffentliche Ansicht des Projekts in einer eigenständigen HTML-Datei, die ohne Authentifizierung mit Interessengruppen geteilt werden kann.",
    "Incluye: nombre del proyecto, presupuesto, ingreso previsto, duración, riesgos, equipo, tareas con progreso y un gráfico doughnut de porcentaje completado.": "Enthält: Projektname, Budget, erwartete Einnahmen, Dauer, Risiken, Team, Aufgaben mit Fortschritt und ein Donut-Diagramm des Fertigstellungsprozentsatzes.",
    "A diferencia de otras herramientas, no requiere que el destinatario tenga cuenta, login, ni acceso al sistema. Es una instantánea estática del estado actual del proyecto.": "Im Gegensatz zu anderen Tools ist kein Konto, Login oder Systemzugriff des Empfängers erforderlich. Es ist eine statische Momentaufnahme des aktuellen Projektstatus.",
    "La aplicación incluye un servidor backend PHP con SQLite para servir archivos estáticos y manejar la API REST.": "Die Anwendung enthält einen PHP-Backend-Server mit SQLite zum Bereitstellen statischer Dateien und zur Verwaltung der REST-API.",
    "Para iniciar el servidor, ejecuta desde la carpeta backend/: php -S 0.0.0.0:8000 index.php": "Zum Starten des Servers führen Sie im backend/-Ordner aus: php -S 0.0.0.0:8000 index.php",
    "El servidor sirve archivos estáticos (HTML, CSS, JS) para acceso desde dispositivos móviles sin necesidad de abrir index.html manualmente. Las rutas API se manejan desde index.php con SQLite como base de datos.": "Der Server stellt statische Dateien (HTML, CSS, JS) für den Zugriff von mobilen Geräten bereit, ohne dass index.html manuell geöffnet werden muss. API-Routen werden von index.php mit SQLite als Datenbank verwaltet.",
    "La aplicación ahora es instalable como PWA. Al abrir en un navegador compatible, verás un aviso para \"Instalar\" la app. Esto permite acceso sin conexión y apariencia de aplicación nativa en móvil y escritorio.": "Die Anwendung ist jetzt als PWA installierbar. Beim Öffnen in einem kompatiblen Browser sehen Sie eine Aufforderung, die App zu \"Installieren\". Dies ermöglicht Offline-Zugriff und ein natives App-Erscheinungsbild auf Mobilgeräten und Desktops.",
    "Usa el botón de tema en la cabecera para alternar entre modo claro  y oscuro . La preferencia se guarda automáticamente. Todos los gráficos y colores de la interfaz se adaptan al tema seleccionado.": "Verwenden Sie die Design-Schaltfläche in der Kopfzeile, um zwischen hellem und dunklem Modus zu wechseln. Die Einstellung wird automatisch gespeichert. Alle Diagramme und Schnittstellenfarben passen sich dem ausgewählten Design an.",
    "Cambia el idioma de la interfaz entre Español 🇪🇸, Inglés 🇬🇧, Francés 🇫🇷 y Alemán 🇩🇪 desde el botón  Cambiar idioma.": "Ändern Sie die Benutzeroberflächensprache zwischen Spanisch 🇪🇸, Englisch 🇬🇧, Französisch 🇫🇷 und Deutsch 🇩🇪 über die Schaltfläche Sprache ändern.",
    "El botón  IA en la barra lateral del proyecto abre un asistente de inteligencia artificial para ayudar con la gestión del proyecto.": "Die KI-Schaltfläche in der Projektseitenleiste öffnet einen KI-Assistenten zur Unterstützung bei der Projektverwaltung.",
    "Pulsa el botón + (icono \"Nuevo Proyecto\") en la cabecera de la cartera e introduce nombre, alcance, fechas, país y moneda base. El proyecto se crea con un acta de inicio automática.": "Drücken Sie die +-Schaltfläche (Symbol \"Neues Projekt\") in der Kopfzeile des Portfolios und geben Sie Name, Umfang, Daten, Land und Basiswährung ein. Das Projekt wird mit einer automatischen Projektcharta erstellt.",
    "Usa el botón con el icono de impresora para exportar el informe a PDF. Los gráficos Chart.js se capturan automáticamente como imágenes.": "Verwenden Sie die Schaltfläche mit dem Druckersymbol, um den Bericht als PDF zu exportieren. Chart.js-Diagramme werden automatisch als Bilder erfasst.",
    "La vista de Monedas es una pantalla única: cabecera con botones de icono para actualizar tasas (↻) y guardar (✓), fila de chips con el total de monedas, fuente, última actualización y moneda base, más una tabla de tasas con búsqueda y filtro por región. La sección \"Avanzado\" (plegable) incluye evolución histórica, precio de venta y condiciones de pago, proveedor de tasas, actualización automática y botones para probar conexión, exportar e importar CSV.": "Die Währungsansicht ist ein einziger Bildschirm: Kopfzeile mit Symbolschaltflächen zum Aktualisieren der Kurse (↻) und Speichern (✓), eine Chip-Zeile mit der Gesamtzahl der Währungen, Quelle, letzter Aktualisierung und Basiswährung, plus eine Kurstabelle mit Suche und Regionsfilter. Der Abschnitt \"Erweitert\" (einklappbar) enthält historische Entwicklung, Verkaufspreis und Zahlungsbedingungen, Kursanbieter, automatische Aktualisierung und Schaltflächen zum Testen der Verbindung, Exportieren und Importieren von CSV.",
    "Usa el botón de tema en la barra lateral para alternar entre modo claro y oscuro. La preferencia se guarda automáticamente. Todos los gráficos y colores de la interfaz se adaptan al tema seleccionado.": "Verwenden Sie die Design-Schaltfläche in der Seitenleiste, um zwischen hellem und dunklem Modus zu wechseln. Die Einstellung wird automatisch gespeichert. Alle Diagramme und Schnittstellenfarben passen sich dem ausgewählten Design an.",
    "Cambia el idioma de la interfaz entre Español 🇪🇸, Inglés 🇬🇧, Francés 🇫🇷 y Alemán 🇩🇪 desde el botón de idioma en la barra lateral.": "Ändern Sie die Benutzeroberflächensprache zwischen Spanisch 🇪🇸, Englisch 🇬🇧, Französisch 🇫🇷 und Deutsch 🇩🇪 über die Sprachschaltfläche in der Seitenleiste.",
    "En la barra lateral, tu avatar con la inicial y tu nombre y rol abren el modal de perfil al hacer clic. La campana muestra las notificaciones y el icono de salida cierra la sesión.": "In der Seitenleiste öffnen Ihr Avatar mit der Initiale sowie Ihr Name und Ihre Rolle beim Klicken das Profil-Modal. Die Glocke zeigt Benachrichtigungen und das Abmelde-Symbol beendet die Sitzung.",
    "El panel de Equipo gestiona los miembros del proyecto con su coste por hora, moneda y horas mensuales.": "Das Team-Panel verwaltet die Projektmitglieder mit ihren Stundensätzen, der Währung und den monatlichen Stunden.",
    "Pulsa el botón + para añadir un miembro del equipo. El icono de libro abre el catálogo de equipo para importar perfiles predefinidos.": "Drücken Sie die +-Schaltfläche, um ein Teammitglied hinzuzufügen. Das Buchsymbol öffnet den Teamkatalog zum Importieren vordefinierter Profile.",
    "El panel de Materiales registra los materiales del proyecto con proveedor, cantidad, coste, país de origen, INCOTERM, arancel y condiciones de pago.": "Das Materialien-Panel erfasst die Projektmaterialien mit Lieferant, Menge, Kosten, Ursprungsland, INCOTERM, Zollsatz und Zahlungsbedingungen.",
    "Pulsa el botón + para añadir un material. El icono de libro importa desde el catálogo de materiales y el icono de actualizar recalcula los aranceles.": "Drücken Sie die +-Schaltfläche, um ein Material hinzuzufügen. Das Buchsymbol importiert aus dem Materialkatalog und das Aktualisieren-Symbol berechnet die Zollsätze neu.",
    "El panel de Servicios registra servicios contratados con proveedor, cantidad, coste, impuesto y mes de imputación.": "Das Dienstleistungen-Panel erfasst beauftragte Dienstleistungen mit Lieferant, Menge, Kosten, Steuer und Zuordnungsmonat.",
    "Pulsa el botón + para añadir un servicio. El coste se integra automáticamente en el cashflow del proyecto.": "Drücken Sie die +-Schaltfläche, um eine Dienstleistung hinzuzufügen. Die Kosten werden automatisch in den Projekt-Cashflow integriert.",
    "El panel de Viajes gestiona los desplazamientos del proyecto con tarjetas de totales por categoría: vuelos, hoteles, comidas y traslados.": "Das Reisen-Panel verwaltet die Projektfahrten mit Gesamtsummen-Karten nach Kategorie: Flüge, Hotels, Mahlzeiten und Transfers.",
    "Pulsa el botón + para registrar un nuevo viaje con origen, destino, fechas y archivos adjuntos. El icono de exportar descarga el listado de viajes.": "Drücken Sie die +-Schaltfläche, um eine neue Reise mit Herkunft, Ziel, Daten und Anhängen zu erfassen. Das Export-Symbol lädt die Reisliste herunter.",
    "El panel de Logística es un simulador 3D de cubicaje para planificar el transporte de mercancías por vía aérea, marítima o almacén.": "Das Logistik-Panel ist ein 3D-Stauraum-Simulator zur Planung des Warentransports per Luft, See oder Lager.",
    "Usa \"Añadir Otra Unidad\" para crear contenedores y asigna materiales a cada bulto. Los iconos de la cabecera guardan y cargan el estado, y exportan a CSV o PDF.": "Verwenden Sie \"Weitere Einheit hinzufügen\", um Container zu erstellen, und weisen Sie jedem Paket Materialien zu. Die Kopfzeilen-Symbole speichern und laden den Zustand und exportieren als CSV oder PDF.",
    "El panel de Venta define el precio de venta, la moneda y las condiciones de pago del proyecto.": "Das Verkauf-Panel definiert den Verkaufspreis, die Währung und die Zahlungsbedingungen des Projekts.",
    "Pulsa el botón + para añadir hitos financieros de cobro. Los ingresos se distribuyen en el cashflow a partir de estos hitos.": "Drücken Sie die +-Schaltfläche, um finanzielle Zahlungsmeilensteine hinzuzufügen. Die Einnahmen werden im Cashflow auf Basis dieser Meilensteine verteilt.",
    "El panel de Avales y Garantías Bancarias registra los avales del proyecto.": "Das Bürgschaften-Panel erfasst die Projektbürgschaften.",
    "Pulsa el botón + para añadir un aval con su entidad, importe y fechas de vigencia.": "Drücken Sie die +-Schaltfläche, um eine Bürgschaft mit Institut, Betrag und Gültigkeitsdaten hinzuzufügen.",
    "El panel de Seguros y Responsabilidad Civil registra los seguros del proyecto: transporte, RC, obras, etc.": "Das Versicherungen-Panel erfasst die Projektversicherungen: Transport, Haftpflicht, Bauarbeiten usw.",
    "Pulsa el botón + para añadir un seguro. El coste se refleja automáticamente en el cashflow del mes indicado.": "Drücken Sie die +-Schaltfläche, um eine Versicherung hinzuzufügen. Die Kosten werden automatisch im Cashflow des angegebenen Monats berücksichtigt.",
    "Dentro del análisis financiero se gestionan los aranceles por país, las tasas aduaneras y los costes financieros extra.": "Innerhalb der Finanzanalyse werden Zollsätze pro Land, Zollgebühren und zusätzliche Finanzkosten verwaltet.",
    "Usa el botón \"Añadir\" para crear aranceles por país, tasas aduaneras o costes financieros. El botón \"Actualizar\" recalcula los aranceles de todos los países.": "Verwenden Sie die Schaltfläche \"Hinzufügen\", um Zollsätze pro Land, Zollgebühren oder Finanzkosten zu erstellen. Die Schaltfläche \"Aktualisieren\" berechnet die Zollsätze aller Länder neu."
};
var _deListMap = {
    "CPI (Cost Performance Index): eficiencia del coste. >1 = por debajo del presupuesto.": "CPI (Cost Performance Index): Kosteneffizienz. >1 = unter Budget.",
    "SPI (Schedule Performance Index): eficiencia del cronograma. >1 = adelantado.": "SPI (Schedule Performance Index): Zeitplaneffizienz. >1 = voraus.",
    "EV (Earned Value): valor ganado del trabajo completado (excluye EDTs del peso).": "EV (Earned Value): erzielter Wert der abgeschlossenen Arbeit (schließt PSP-Codes vom Gewicht aus).",
    "PV (Planned Value): valor planificado del trabajo programado.": "PV (Planned Value): geplanter Wert der programmierten Arbeit.",
    "AC (Actual Cost): prorrateado temporalmente como costeTotal × % tiempo transcurrido.": "AC (Actual Cost): zeitlich anteilig als Gesamtkosten × % verstrichene Zeit.",
    "EAC (Estimate at Complete): BAC / CPI siempre, unificado.": "EAC (Estimate at Complete): BAC / CPI immer, vereinheitlicht.",
    "Variación de Coste y Cronograma en porcentaje.": "Kosten- und Zeitplanabweichung in Prozent.",
    "Salud General: indicador compuesto (CPI × SPI).": "Allgemeiner Status: zusammengesetzter Indikator (CPI × SPI).",
    "Cada elemento tiene: nombre, fecha inicio, duración, responsable, tipo (tarea/hito/entregable/EDT), dependencias y estado.": "Jedes Element hat: Name, Startdatum, Dauer, Verantwortlicher, Typ (Aufgabe/Meilenstein/Lieferobjekt/PSP), Abhängigkeiten und Status.",
    "Agrega elementos con \" Añadir\". Edita y elimina con los botones correspondientes.": "Fügen Sie Elemente mit \"Hinzufügen\" hinzu. Bearbeiten und löschen Sie mit den entsprechenden Schaltflächen.",
    "Las dependencias se arrastran entre elementos para establecer relaciones secuenciales.": "Abhängigkeiten werden zwischen Elementen gezogen, um sequenzielle Beziehungen herzustellen.",
    "Nombre, descripción, categoría y responsable.": "Name, Beschreibung, Kategorie und Verantwortlicher.",
    "Probabilidad (Muy Baja a Muy Alta) e Impacto (Muy Bajo a Muy Alto).": "Wahrscheinlichkeit (Sehr Niedrig bis Sehr Hoch) und Auswirkung (Sehr Niedrig bis Sehr Hoch).",
    "Severidad: calculada automáticamente como Probabilidad × Impacto.": "Schweregrad: automatisch berechnet als Wahrscheinlichkeit × Auswirkung.",
    "Plan de respuesta y acciones preventivas.": "Reaktionsplan und vorbeugende Maßnahmen.",
    "Estado y fecha de identificación.": "Status und Identifikationsdatum.",
    "Inicio: definir el proyecto y obtener autorización.": "Initiierung: Projekt definieren und Genehmigung einholen.",
    "Planificación: establecer alcance, objetivos y plan de acción.": "Planung: Umfang, Ziele und Aktionsplan festlegen.",
    "Ejecución: coordinar recursos para completar el trabajo.": "Ausführung: Ressourcen koordinieren, um die Arbeit abzuschließen.",
    "Monitoreo y Control: tracking de progreso y gestión de cambios.": "Überwachung und Steuerung: Fortschrittsverfolgung und Änderungsmanagement.",
    "Cierre: formalizar la finalización del proyecto.": "Abschluss: Projektabschluss formalisieren.",
    "Resumen Ejecutivo: visión general del estado del proyecto.": "Management Summary: Überblick über den Projektstatus.",
    "Estado de Costes: CPI, EV, PV, AC, EAC (BAC/CPI), variaciones y presupuesto.": "Kostenstatus: CPI, EV, PV, AC, EAC (BAC/CPI), Abweichungen und Budget.",
    "Estado de Cronograma: SPI, progreso, hitos y entregables.": "Zeitplanstatus: SPI, Fortschritt, Meilensteine und Lieferobjekte.",
    "Análisis de Riesgos: matriz de calor y riesgos críticos.": "Risikoanalyse: Heatmap und kritische Risiken.",
    "Recursos: equipo, materiales y costes por recurso.": "Ressourcen: Team, Materialien und Kosten pro Ressource.",
    "Stakeholders: matriz de involucrados y RACI.": "Interessengruppen: Beteiligtenmatrix und RACI.",
    "Informe Final: consolidado completo del proyecto.": "Abschlussbericht: vollständige Projektkonsolidierung.",
    "Descripción del cambio y justificación.": "Änderungsbeschreibung und Begründung.",
    "Impacto en alcance, coste, cronograma y calidad.": "Auswirkung auf Umfang, Kosten, Zeitplan und Qualität.",
    "Estado: Pendiente / En revisión / Aprobado / Rechazado.": "Status: Ausstehend / In Prüfung / Genehmigt / Abgelehnt.",
    "Prioridad, fecha de solicitud y decisión con comentarios.": "Priorität, Anfragedatum und Entscheidung mit Kommentaren.",
    "Categoría (procesos/técnica/gestión/comunicaciones/riesgos/otros).": "Kategorie (Prozesse/Technik/Management/Kommunikation/Risiken/Sonstiges).",
    "Descripción de la experiencia.": "Beschreibung der Erfahrung.",
    "Impacto (positivo/negativo) y recomendaciones.": "Auswirkung (positiv/negativ) und Empfehlungen.",
    "Estado: Abierta / Validada / Implementada.": "Status: Offen / Validiert / Implementiert.",
    "Sprint Backlog: gestiona las tareas del sprint actual.": "Sprint Backlog: verwaltet die Aufgaben des aktuellen Sprints.",
    "Sprint Burndown: gráfico de trabajo pendiente vs tiempo.": "Sprint Burndown: Diagramm der ausstehenden Arbeit vs. Zeit.",
    "Velocity Tracking: seguimiento de la velocidad del equipo.": "Velocity Tracking: Verfolgung der Teamgeschwindigkeit.",
    "Retrospectives: registro de retrospectivas de sprint.": "Retrospektiven: Aufzeichnung von Sprint-Retrospektiven.",
    "Agile Metrics: velocidad, deuda técnica, lead time.": "Agile Metriken: Geschwindigkeit, technische Schulden, Durchlaufzeit.",
    "Control Gastos Ágil: costes asociados a sprints.": "Agile Ausgabenkontrolle: Kosten im Zusammenhang mit Sprints.",
    "Admin: acceso total a todas las funciones.": "Admin: vollständiger Zugriff auf alle Funktionen.",
    "Director de Proyecto (PM): gestión completa de proyectos.": "Projektmanager (PM): vollständiges Projektmanagement.",
    "Analista: acceso a consulta y reportes.": "Analyst: Zugriff auf Abfragen und Berichte.",
    "Colaborador: acceso limitado a tareas asignadas.": "Mitarbeiter: eingeschränkter Zugriff auf zugewiesene Aufgaben.",
    "Consultor Externo / Cliente: visibilidad restringida.": "Externer Berater / Kunde: eingeschränkte Sichtbarkeit.",
    "Iteraciones: 100 (rápido), 1,000 (preciso) o 5,000 (máxima precisión).": "Iterationen: 100 (schnell), 1.000 (genau) oder 5.000 (maximale Genauigkeit).",
    "Variación: ±10% a ±50% sobre la duración planificada de cada tarea.": "Variation: ±10% bis ±50% über der geplanten Dauer jeder Aufgabe.",
    "Distribución: Triangular (PERT), Normal o Uniforme.": "Verteilung: Dreieckig (PERT), Normal oder Gleichmäßig.",
    "Haz clic en  Compartir en el panel de Salud del Proyecto.": "Klicken Sie im Projektstatus-Panel auf Teilen.",
    "Se descarga un archivo HTML con todos los KPIs, tareas y gráficos.": "Eine HTML-Datei mit allen KPIs, Aufgaben und Diagrammen wird heruntergeladen.",
    "El archivo es autónomo: incluye Chart.js vía CDN y toda la información necesaria.": "Die Datei ist eigenständig: sie enthält Chart.js via CDN und alle notwendigen Informationen.",
    "Puedes enviarlo por email, alojarlo en cualquier servidor estático o abrirlo localmente.": "Sie können sie per E-Mail senden, auf einem statischen Server hosten oder lokal öffnen.",
    "Agrega elementos con el botón + (icono \"Nuevo elemento\"). Edita y elimina con los botones correspondientes.": "Fügen Sie Elemente mit der +-Schaltfläche (Symbol \"Neues Element\") hinzu. Bearbeiten und löschen Sie mit den entsprechenden Schaltflächen.",
    "Pulsa el botón con el icono de compartir en el panel de Salud del Proyecto.": "Drücken Sie die Schaltfläche mit dem Teilen-Symbol im Projektstatus-Panel."
};
manualTemasDE.forEach(function(t) {
    if (_deTitles[t.id]) t.titulo = _deTitles[t.id];
    t.contenido.forEach(function(c) {
        if (c.tipo === 'subtitulo') {
            var map = {
                'Crear proyecto': 'Projekt erstellen',
                'Editar / Eliminar': 'Bearbeiten / Löschen',
                'Filtros y búsqueda': 'Filter und Suche',
                'Respaldos': 'Sicherungen',
                'Indicadores principales': 'Hauptindikatoren',
                'Cálculos EVM': 'EVM-Berechnungen',
                'Estructura del coste total': 'Gesamtkostenstruktur',
                'Cashflow': 'Cashflow',
                'Gráficos profesionales': 'Professionelle Grafiken',
                'Monedas': 'Währungen',
                'Gestión de elementos Gantt': 'Verwaltung der Gantt-Elemente',
                'Duración en horas': 'Dauer in Stunden',
                'Días hábiles': 'Werktage',
                'Barras reales vs planificadas': 'Ist- vs. Plan-Balken',
                'Ruta Crítica': 'Kritischer Pfad',
                'Auto-Scheduler': 'Auto-Planer',
                'Desplazamiento intra-día': 'Intra-Tag-Versatz',
                'Listado ordenado imprimible': 'Druckbare geordnete Liste',
                'Importación CSV': 'CSV-Import',
                'Metodología': 'Methodik',
                'Visualización': 'Visualisierung',
                'Campos del riesgo': 'Risikofelder',
                'Matriz de calor': 'Heatmap',
                'Recomendaciones': 'Empfehlungen',
                'Matriz Poder/Interés': 'Macht/Interessen-Matrix',
                'Matriz RACI': 'RACI-Matrix',
                'Grupos de Procesos': 'Prozessgruppen',
                'Tipos de informe': 'Berichtstypen',
                'Exportación a PDF': 'PDF-Export',
                'Registro de comunicaciones': 'Kommunikationsprotokoll',
                'Campos principales': 'Hauptfelder',
                'Estructura': 'Struktur',
                'Componentes': 'Komponenten',
                'Roles disponibles': 'Verfügbare Rollen',
                'Permisos por módulo': 'Berechtigungen pro Modul',
                'Configuración': 'Konfiguration',
                'Envío automático': 'Automatischer Versand',
                '¿Cómo funciona?': 'Wie funktioniert es?',
                'Resultados': 'Ergebnisse',
                'Acceso': 'Zugriff',
                'Contenido del dashboard público': 'Inhalt des öffentlichen Dashboards',
                'Diferencia clave': 'Hauptunterschied',
                'Inicio del servidor': 'Serverstart',
                'Acceso desde móvil': 'Mobiler Zugriff',
                'PWA (Progressive Web App)': 'PWA (Progressive Web App)',
                'Tema (Claro / Oscuro)': 'Design (Hell / Dunkel)',
                'Idioma': 'Sprache',
                'Asistente IA': 'KI-Assistent',
                'Menú de usuario': 'Benutzermenü',
                'Añadir miembros': 'Mitglieder hinzufügen',
                'Añadir y gestionar': 'Hinzufügen und verwalten',
                'Añadir servicios': 'Dienstleistungen hinzufügen',
                'Registro de viajes': 'Reiseregister',
                'Contenedores y exportación': 'Container und Export',
                'Hitos financieros': 'Finanzielle Meilensteine',
                'Añadir avales': 'Bürgschaften hinzufügen',
                'Añadir seguros': 'Versicherungen hinzufügen'
            };
            if (map[c.valor]) c.valor = map[c.valor];
        }
        if (c.tipo === 'texto' && _deTextMap[c.valor]) {
            c.valor = _deTextMap[c.valor];
        }
        if (c.tipo === 'lista' && c.items) {
            c.items = c.items.map(function(i) {
                return _deListMap[i] || i;
            });
        }
    });
});



function getLang() {
    try { return (localStorage.getItem('pmi_idioma') || '').toLowerCase(); } catch(e) { return 'es'; }
}
function getManualTemas() {
    var lang = getLang();
    if (lang === 'en') return manualTemasEN;
    if (lang === 'fr') return manualTemasFR;
    if (lang === 'de') return manualTemasDE;
    return manualTemasES;
}

let manualTemaActivo = 'intro';

function abrirManual() {
    const modal = document.getElementById('modalManual');
    if (!modal) return;
    modal.style.display = 'flex';
    manualTemaActivo = 'intro';
    renderizarManualIndice();
    mostrarManualTema('intro');
}

function cerrarModalManual() {
    const modal = document.getElementById('modalManual');
    if (modal) modal.style.display = 'none';
}

function renderizarManualIndice() {
    const indice = document.getElementById('manualIndice');
    const busqueda = (document.getElementById('manualBusqueda')?.value || '').toLowerCase().trim();
    const temas = getManualTemas();
    let html = '';
    temas.forEach(t => {
        const coincide = !busqueda || t.titulo.toLowerCase().includes(busqueda) || t.id.includes(busqueda);
        const activo = t.id === manualTemaActivo;
        html += `<div class="manual-tema ${activo ? 'activo' : ''} ${coincide ? '' : 'oculto'}" onclick="mostrarManualTema('${t.id}')">${t.icon} ${t.titulo}</div>`;
    });
    if (indice) indice.innerHTML = html;
}

function mostrarManualTema(temaId) {
    manualTemaActivo = temaId;
    const temas = getManualTemas();
    const tema = temas.find(t => t.id === temaId);
    const cont = document.getElementById('manualContenido');
    if (!tema || !cont) return;

    renderizarManualIndice();

    let html = `<div class="manual-titulo">${tema.icon} ${tema.titulo}</div>`;
    tema.contenido.forEach(c => {
        if (c.tipo === 'texto') {
            html += `<div class="manual-texto">${c.valor}</div>`;
        } else if (c.tipo === 'subtitulo') {
            html += `<div class="manual-subtitulo">${c.valor}</div>`;
        } else if (c.tipo === 'lista') {
            html += `<ul class="manual-lista">${c.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
        }
    });
    cont.innerHTML = html;
    cont.scrollTop = 0;
}

function filtrarManual() {
    const busqueda = (document.getElementById('manualBusqueda')?.value || '').toLowerCase().trim();

    document.querySelectorAll('.manual-tema').forEach(el => {
        const texto = el.textContent.toLowerCase();
        el.classList.toggle('oculto', busqueda && !texto.includes(busqueda));
    });

    if (busqueda) {
        const visible = document.querySelector('.manual-tema:not(.oculto)');
        if (visible && !visible.classList.contains('activo')) {
            visible.click();
        }
    } else {
        mostrarManualTema(manualTemaActivo);
    }
}
