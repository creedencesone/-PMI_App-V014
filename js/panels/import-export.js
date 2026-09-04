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
    if (!proy.seguros) proy.seguros = [];
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
