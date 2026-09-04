// ============================================
// MÓDULO: LOGÍSTICA 3D - Simulador de Carga
// ============================================

// SimuladorLogisticoApp class is defined inline in proyecto.html

// Función de inicialización del módulo
function inicializarModuloLogistica() {
    console.log(" Inicializando módulo logístico...");
    
    if (!window.appLogistica) {
        console.error(" appLogistica no existe");
        return;
    }
    
    // Verificar Three.js
    if (typeof THREE === 'undefined') {
        console.warn(" Three.js no cargado, esperando...");
        setTimeout(inicializarModuloLogistica, 500);
        return;
    }
    
    // Verificar controles
    if (typeof THREE.OrbitControls === 'undefined') {
        console.warn(" OrbitControls no cargado, esperando...");
        setTimeout(inicializarModuloLogistica, 500);
        return;
    }
    
    // Inicializar
    if (!window.appLogistica.inicializado) {
        try {
            window.appLogistica.init();
        } catch (e) {
            console.error(" Error al inicializar:", e);
            window.appLogistica.inicializado = false;
        }
    }
}

// Exponer funciones globales
window.inicializarModuloLogistica = inicializarModuloLogistica;