// IMPORTAR PROYECTO DESDE ARCHIVO
// ============================================

// ============================================
// IMPORTACIÓN SEGURA — el JSON nunca inyecta markup ni manejadores
// ============================================

/** id seguro para handlers inline; dashboard.html puede aportar su propia versión. */
if (typeof window.idSeguroHandler !== 'function') {
    window.idSeguroHandler = function idSeguroHandler(id, indice) {
        const texto = String(id ?? '');
        if (/^[A-Za-z0-9_-]{1,64}$/.test(texto)) return texto;
        const prefijoNumerico = texto.match(/^\d+/);
        if (prefijoNumerico) return prefijoNumerico[0];
        const numero = Number(texto);
        return Number.isFinite(numero) ? String(numero) : 'import-' + ((indice || 0) + 1);
    };
}

/** Sanitiza recursivamente un backup antes de convertirlo en proyecto activo. */
function sanitizarProyectoImportado(valor, profundidad) {
    if (typeof valor === 'string') {
        return valor
            .replace(/[\u0000-\u001F\u007F]/g, ' ')
            .replace(/&(?:#\d+|#x[0-9a-f]+|[a-z]+);/gi, '')
            .replace(/[<>]/g, '')
            .replace(/["'`]/g, '')
            .replace(/javascript\s*:/gi, '')
            .slice(0, 200000);
    }
    if (typeof valor === 'number') return Number.isFinite(valor) ? valor : 0;
    if (typeof valor === 'boolean' || valor === null) return valor;
    if (Array.isArray(valor)) {
        return valor.slice(0, 20000).map(v => sanitizarProyectoImportado(v, profundidad + 1));
    }
    if (valor && typeof valor === 'object') {
        const limpio = {};
        Object.keys(valor).slice(0, 500).forEach(clave => {
            if (/^on/i.test(clave) || ['__proto__', 'constructor', 'prototype'].includes(clave)) return;
            const valorLimpio = sanitizarProyectoImportado(valor[clave], profundidad + 1);
            if (/(?:^id$|[_-]id$|Id$|ID$)/.test(clave)) {
                limpio[clave] = idSeguroHandler(valorLimpio, 0);
            } else {
                limpio[clave] = valorLimpio;
            }
        });
        return limpio;
    }
    return null;
}


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
                proyecto = sanitizarProyectoImportado(data.proyecto, 0);
                if (typeof recalcularBitacoraImportada === 'function') recalcularBitacoraImportada(proyecto);

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
                if (typeof registrarBitacora === 'function') {
                    registrarBitacora('proyecto', proyecto.id, 'importar', null, { nombre: proyecto.nombre }, proyecto);
                }

                // Recargar la página para aplicar cambios
                mostrarToast(tApp('toast_proyecto_importado'), 'success');
                setTimeout(() => location.reload(), 1500);

            } else if (data.id || data.nombre) {
                // Es formato antiguo o proyecto directo
                proyecto = sanitizarProyectoImportado(data, 0);
                if (typeof recalcularBitacoraImportada === 'function') recalcularBitacoraImportada(proyecto);
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
                if (typeof registrarBitacora === 'function') {
                    registrarBitacora('proyecto', proyecto.id, 'importar', null, { nombre: proyecto.nombre }, proyecto);
                }

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
    if (!proy.organigrama) proy.organigrama = [];
    if (!proy.raci) proy.raci = [];
    if (!proy.equipo) proy.equipo = [];
    if (!proy.materiales) proy.materiales = [];
    if (!proy.servicios) proy.servicios = [];
    if (!proy.comunicaciones) proy.comunicaciones = [];
    if (!Array.isArray(proy.planComunicaciones)) proy.planComunicaciones = [];
    if (!Array.isArray(proy.lineasBase)) proy.lineasBase = [];
    if (!Array.isArray(proy.bitacora)) proy.bitacora = [];
    if (!proy.reuniones) proy.reuniones = [];
    if (!proy.riesgos) proy.riesgos = [];
    if (!Array.isArray(proy.requisitos)) proy.requisitos = [];
    proy.estado = typeof normalizarEstadoProyecto === 'function'
        ? normalizarEstadoProyecto(proy.estado) : (proy.estado || 'en_curso');
    if (!Array.isArray(proy.lecciones)) proy.lecciones = [];
    if (!Array.isArray(proy.cambios)) proy.cambios = [];
    if (!Array.isArray(proy.lineasBase)) proy.lineasBase = [];
    if (!proy.accionesMitigacion) proy.accionesMitigacion = [];
    if (!proy.elementosGantt) proy.elementosGantt = [];
    sincronizarProcesosConPMBOK(proy);
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
    if (!Array.isArray(proy.alertas)) proy.alertas = [];
    if (typeof inicializarCalidad === 'function') inicializarCalidad(proy);
    if (typeof migrarDefectosCalidad === 'function') migrarDefectosCalidad(proy);

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
