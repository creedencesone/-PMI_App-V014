/**
 * PMI Mind — Panel «Importar contrato con IA»
 * ------------------------------------------------------------
 * Sube un contrato (PDF/DOCX/TXT), extrae datos con el modelo local/LAN y
 * muestra una propuesta revisable. Nada se guarda hasta que el usuario marca
 * los campos a aplicar. La salida del modelo se renderiza siempre con
 * textContent: nunca se inserta como HTML.
 */
(function (global) {
    'use strict';

    let controlador = null;
    let propuestaActual = null;

    function t(clave, respaldo) {
        if (typeof tApp === 'function') {
            const valor = tApp(clave);
            if (valor && valor !== clave) return valor;
        }
        return respaldo;
    }

    function texto(id) {
        return document.getElementById(id);
    }

    function estado(mensaje) {
        const elemento = texto('contratoEstado');
        if (elemento) elemento.textContent = mensaje || '';
    }

    function progreso(valor, maximo) {
        const elemento = texto('contratoProgreso');
        if (!elemento) return;
        elemento.max = maximo || 100;
        elemento.value = Math.max(0, Math.min(maximo || 100, valor || 0));
    }

    function puedeAplicar() {
        if (typeof puedeEditarPanel !== 'function') return true;
        const id = (typeof localStorage !== 'undefined' && localStorage.getItem('proyectoSeleccionado')) || '';
        try { return puedeEditarPanel(id, 'importarContrato'); }
        catch (_) { return false; }
    }

    function inicializarPanelImportarContrato() {
        const botonAnalizar = texto('btnAnalizarContrato');
        const botonCancelar = texto('btnCancelarContrato');
        const archivo = texto('contratoArchivo');
        const vacio = texto('contratoVacio');
        if (!archivo) return;

        if (botonAnalizar) botonAnalizar.textContent = t('importarContrato_analizar', 'Analizar contrato');
        if (botonCancelar) botonCancelar.textContent = t('importarContrato_cancelar', 'Cancelar');
        archivo.setAttribute('aria-label', t('importarContrato_archivo', 'Documento del contrato (PDF, DOCX o TXT)'));
        const etiquetaArchivo = texto('contratoArchivoLabel');
        if (etiquetaArchivo) etiquetaArchivo.textContent = t('importarContrato_archivo', 'Documento del contrato (PDF, DOCX o TXT)');
        const barra = texto('contratoProgreso');
        if (barra) barra.setAttribute('aria-label', t('importarContrato_progreso', 'Progreso del análisis'));
        const titulo = texto('importarContratoTituloTexto');
        if (titulo) titulo.textContent = t('importarContrato_titulo', 'Importar contrato con IA');

        if (propuestaActual) {
            renderizarPropuesta(propuestaActual);
        } else if (vacio) {
            vacio.textContent = t('importarContrato_vacio',
                'Sube un contrato en PDF, DOCX o TXT. El modelo local extraerá los datos PMI y podrás revisarlos antes de aplicarlos.');
            vacio.hidden = Boolean(controlador);
        }
        if (!controlador) {
            if (botonCancelar) botonCancelar.disabled = true;
            if (botonAnalizar) botonAnalizar.disabled = false;
            if (!propuestaActual) progreso(0, 100);
        }
    }

    function resumenValor(item) {
        const valor = item && item.valorPropuesto;
        if (Array.isArray(valor)) {
            const nombres = valor.map(function (v) {
                return v.nombre || v.proveedor || v.codigo || v.necesidad || '';
            }).filter(Boolean).slice(0, 3);
            return valor.length + (nombres.length ? ' · ' + nombres.join(', ') : '');
        }
        if (valor && typeof valor === 'object') {
            return Object.keys(valor).filter(function (k) { return valor[k]; })
                .map(function (k) { return k + ': ' + String(valor[k]).slice(0, 40); })
                .join(' · ').slice(0, 160);
        }
        return String(valor == null ? '—' : valor).slice(0, 160);
    }

    function renderizarPropuesta(propuesta) {
        const contenedor = texto('contratoPropuesta');
        if (!contenedor) return;
        contenedor.textContent = '';

        const lista = (propuesta && propuesta.propuestas) || [];
        if (!lista.length) {
            const aviso = document.createElement('p');
            aviso.className = 'text-secondary';
            aviso.textContent = t('importarContrato_sinDatos',
                'No se encontraron datos del contrato que puedan rellenarse automáticamente.');
            contenedor.appendChild(aviso);
            return;
        }

        const campo = document.createElement('fieldset');
        const leyenda = document.createElement('legend');
        leyenda.textContent = t('importarContrato_revisar', 'Revisa los campos extraídos');
        campo.appendChild(leyenda);

        for (const item of lista) {
            const etiqueta = document.createElement('label');
            etiqueta.className = 'importar-contrato-opcion';
            const casilla = document.createElement('input');
            casilla.type = 'checkbox';
            casilla.checked = true;
            casilla.dataset.ruta = item.ruta;
            etiqueta.appendChild(casilla);
            etiqueta.appendChild(document.createTextNode(' ' + item.etiqueta));

            const detalle = document.createElement('p');
            detalle.className = 'text-secondary';
            const actual = (item.valorActual == null || item.valorActual === '')
                ? '—' : resumenValor({ valorPropuesto: item.valorActual });
            detalle.textContent = actual + ' → ' + resumenValor(item);

            const bloque = document.createElement('div');
            bloque.className = 'importar-contrato-campo';
            bloque.appendChild(etiqueta);
            bloque.appendChild(detalle);
            campo.appendChild(bloque);
        }
        contenedor.appendChild(campo);

        if (puedeAplicar()) {
            const aplicar = document.createElement('button');
            aplicar.type = 'button';
            aplicar.className = 'btn btn-primary btn-small';
            aplicar.id = 'btnAplicarContrato';
            aplicar.textContent = t('importarContrato_aplicar', 'Aplicar campos seleccionados');
            aplicar.addEventListener('click', aplicarExtraccionContratoDesdeUI);
            contenedor.appendChild(aplicar);
        }

        const avisos = (propuesta.metadata && propuesta.metadata.avisos) || [];
        if (avisos.length) {
            const nota = document.createElement('p');
            nota.className = 'text-secondary';
            nota.textContent = t('importarContrato_avisos', 'Fragmentos sin respuesta válida') + ': ' + avisos.join(', ');
            contenedor.appendChild(nota);
        }
    }

    function proyectoActivo() {
        if (typeof proyecto !== 'undefined' && proyecto) return proyecto;
        if (global.proyecto) return global.proyecto;
        return null;
    }

    async function analizarContratoIA() {
        if (controlador) return;
        if (typeof ContratoIA === 'undefined' || typeof LocalAIService === 'undefined') {
            estado(t('importarContrato_sinIA', 'El módulo de IA no está disponible. Recarga la página.'));
            return;
        }
        const entrada = texto('contratoArchivo');
        const archivo = entrada && entrada.files && entrada.files[0];
        if (!archivo) {
            estado(t('importarContrato_sinArchivo', 'Selecciona primero un archivo de contrato.'));
            return;
        }
        if (archivo.size > 25 * 1024 * 1024) {
            estado(t('importarContrato_demasiadoGrande', 'El archivo supera el límite de 25 MB.'));
            return;
        }

        controlador = new AbortController();
        const botonAnalizar = texto('btnAnalizarContrato');
        const botonCancelar = texto('btnCancelarContrato');
        if (botonAnalizar) botonAnalizar.disabled = true;
        if (botonCancelar) botonCancelar.disabled = false;
        propuestaActual = null;
        const contenedor = texto('contratoPropuesta');
        if (contenedor) contenedor.textContent = '';
        const vacio = texto('contratoVacio');
        if (vacio) vacio.hidden = true;

        try {
            estado(t('importarContrato_leyendo', 'Leyendo el documento…'));
            progreso(5, 100);
            const documento = await ContratoIA.extraerTextoArchivo(archivo);
            estado(t('importarContrato_textoExtraido', 'Texto extraído') + ': ' +
                documento.caracteres + ' ' + t('importarContrato_caracteres', 'caracteres') +
                (documento.paginas ? ' · ' + documento.paginas + ' ' + t('importarContrato_paginas', 'páginas') : ''));

            const fragmentos = ContratoIA.segmentarContrato(documento.texto);
            if (!fragmentos.length) throw new Error('texto_vacio');

            const resultados = [];
            const avisos = [];
            for (let i = 0; i < fragmentos.length; i++) {
                estado(t('importarContrato_analizando', 'Analizando fragmento') + ' ' +
                    (i + 1) + ' / ' + fragmentos.length);
                try {
                    const mensajes = ContratoIA.construirPromptExtraccion(fragmentos[i].texto, {
                        indice: i + 1,
                        total: fragmentos.length
                    });
                    const respuesta = await LocalAIService.ask(mensajes, { signal: controlador.signal });
                    const normalizado = ContratoIA.normalizarExtraccion(respuesta);
                    if (normalizado) resultados.push({ datos: normalizado, fragmento: i + 1 });
                    else avisos.push(String(i + 1));
                } catch (error) {
                    if (error && error.name === 'AbortError') throw error;
                    avisos.push(String(i + 1) + (error && (error.codigo || error.message)
                        ? ' (' + error.codigo + ')' : ''));
                } finally {
                    progreso(5 + Math.round(((i + 1) / fragmentos.length) * 80), 100);
                }
            }

            let datos;
            let modo = 'ia';
            if (resultados.length) {
                datos = ContratoIA.fusionarExtracciones(resultados);
            } else {
                datos = ContratoIA.extraerHeuristico(documento.texto);
                modo = 'heuristico';
            }

            propuestaActual = ContratoIA.proponerCambios(proyectoActivo(), datos, {
                modo: modo,
                avisos: avisos,
                archivo: archivo.name
            });
            renderizarPropuesta(propuestaActual);
            progreso(100, 100);
            estado(t('importarContrato_listo', 'Propuesta lista') + ': ' +
                propuestaActual.propuestas.length + ' ' + t('importarContrato_campos', 'campos') +
                (modo === 'heuristico' ? ' · ' + t('importarContrato_modoHeuristico', 'análisis integrado') : ''));
        } catch (error) {
            if (error && error.name === 'AbortError') {
                estado(t('importarContrato_cancelado', 'Análisis cancelado.'));
            } else {
                estado(t('importarContrato_error', 'No se pudo analizar el contrato') + ': ' +
                    ((error && (error.message || error.codigo)) || 'error'));
            }
        } finally {
            controlador = null;
            if (botonAnalizar) botonAnalizar.disabled = false;
            if (botonCancelar) botonCancelar.disabled = true;
        }
    }

    function cancelarAnalisisContrato() {
        if (controlador) controlador.abort();
    }

    async function aplicarExtraccionContratoDesdeUI() {
        if (!propuestaActual || !puedeAplicar()) return;
        const contenedor = texto('contratoPropuesta');
        const seleccion = contenedor
            ? Array.from(contenedor.querySelectorAll('input[type="checkbox"]:checked'))
                .map(function (casilla) { return casilla.dataset.ruta; })
            : [];
        if (!seleccion.length) {
            estado(t('importarContrato_selecciona', 'Marca al menos un campo para aplicar.'));
            return;
        }
        const resultado = ContratoIA.aplicarPropuestas(proyectoActivo(), seleccion, {
            propuestas: propuestaActual.propuestas,
            metadata: propuestaActual.metadata
        });
        propuestaActual = null;
        if (contenedor) contenedor.textContent = '';
        progreso(0, 100);
        estado(t('importarContrato_aplicado', 'Campos aplicados') + ': ' + resultado.aplicadas);
        if (typeof mostrarToast === 'function') {
            mostrarToast(t('importarContrato_aplicado', 'Campos aplicados') + ': ' + resultado.aplicadas, 'success');
        }
        if (typeof cargarProyecto === 'function') {
            try {
                await cargarProyecto();
                if (typeof mostrarPanel === 'function') mostrarPanel('ImportarContrato', { url: false });
            } catch (_) { /* la propuesta ya quedó guardada */ }
        }
    }

    global.inicializarPanelImportarContrato = inicializarPanelImportarContrato;
    global.analizarContratoIA = analizarContratoIA;
    global.cancelarAnalisisContrato = cancelarAnalisisContrato;
    global.aplicarExtraccionContratoDesdeUI = aplicarExtraccionContratoDesdeUI;
})(typeof window !== 'undefined' ? window : globalThis);
