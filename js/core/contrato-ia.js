/**
 * PMI Mind — Importador de contratos con IA (modelo-agnóstico)
 * ------------------------------------------------------------
 * Lee un contrato (PDF con capa de texto, DOCX o TXT), lo sanea, lo fragmenta
 * y pide a LocalAIService una extracción estructurada con un esquema PMI.
 * La salida del modelo NUNCA se inserta como HTML: se normaliza, se fusiona,
 * se presenta para revisión y sólo se aplica cuando el usuario la aprueba.
 *
 * Patrón del proyecto: script clásico que expone un global (window.ContratoIA).
 */
(function (global) {
    'use strict';

    const MAX_TEXTO = 300000;
    const CHUNK_CHARS = 14000;
    const CHUNK_OVERLAP = 250;
    const MAX_CHUNKS = 14;
    const MAX_ITEMS = 20;
    const FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;
    const MONEDAS = /^(EUR|USD|GBP|CHF|JPY|CNY|MXN|ARS|COP|CLP|PEN|BRL|INR|CAD|AUD|SEK|NOK|DKK|PLN|ZAR)$/;

    /** Esquema único: alimenta el prompt, el normalizador y la fusión. */
    const ESQUEMA = Object.freeze({
        identificacion: Object.freeze({
            nombreProyecto: 'textoCorto', codigo: 'textoCorto', objetivoGeneral: 'texto',
            alcance: 'texto', pais: 'textoCorto', criteriosExito: 'listaTexto', entregablesClave: 'listaTexto'
        }),
        fechas: Object.freeze({ fechaInicio: 'fecha', fechaFinPlan: 'fecha' }),
        economia: Object.freeze({
            precioVenta: 'numero', monedaVenta: 'moneda', condicionesPago: 'texto',
            presupuestoBase: 'numero', monedaPresupuesto: 'moneda', roi: 'numero'
        }),
        gobierno: Object.freeze({
            projectManager: 'persona', sponsor: 'persona', cliente: 'persona', stakeholders: 'lista:persona'
        }),
        requisitos: 'lista:requisito',
        riesgos: 'lista:riesgo',
        hitosFinancieros: 'lista:hitoFinanciero',
        elementosGantt: 'lista:elementoGantt',
        proveedores: 'lista:proveedor',
        contratos: 'lista:contrato'
    });

    const DEFINICIONES_LISTA = Object.freeze({
        persona: Object.freeze({
            nombre: 'textoCorto', cargo: 'textoCorto', email: 'correo', telefono: 'textoCorto',
            empresa: 'textoCorto', puesto: 'textoCorto', rol: 'textoCorto',
            expectativas: 'texto', poder: 'entero5', interes: 'entero5'
        }),
        requisito: Object.freeze({
            codigo: 'textoCorto', necesidad: 'texto', tipo: 'textoCorto', origen: 'textoCorto',
            prioridad: 'textoCorto', criteriosAceptacion: 'texto', responsable: 'textoCorto'
        }),
        riesgo: Object.freeze({
            nombre: 'textoCorto', categoria: 'textoCorto', probabilidad: 'entero5', impacto: 'entero5',
            respuesta: 'texto', owner: 'textoCorto', planAccion: 'texto'
        }),
        hitoFinanciero: Object.freeze({
            nombre: 'textoCorto', mes: 'enteroPositivo', porcentaje: 'porcentaje', importeFijo: 'numero',
            moneda: 'moneda', condiciones: 'texto', metodoPago: 'textoCorto',
            retencionPorcentaje: 'porcentaje', retencionMes: 'enteroPositivo'
        }),
        elementoGantt: Object.freeze({
            nombre: 'textoCorto', tipo: 'textoCorto', inicio: 'fecha', duracion: 'enteroPositivo',
            responsable: 'textoCorto', dependeDe: 'textoCorto', costeEstimado: 'numero'
        }),
        proveedor: Object.freeze({ nombre: 'textoCorto', pais: 'textoCorto' }),
        contrato: Object.freeze({ proveedor: 'textoCorto', importe: 'numero', moneda: 'moneda' })
    });

    /** Destinos canónicos del proyecto. `reflejos` mantiene sincronizado el blob. */
    const DESTINOS = Object.freeze([
        { ruta: 'acta.nombreProyecto', etiqueta: 'Nombre del proyecto', origen: 'identificacion.nombreProyecto', tipo: 'texto', reflejos: ['nombre'] },
        { ruta: 'acta.codigo', etiqueta: 'Código del contrato', origen: 'identificacion.codigo', tipo: 'texto' },
        { ruta: 'acta.objetivoGeneral', etiqueta: 'Objetivo general', origen: 'identificacion.objetivoGeneral', tipo: 'texto' },
        { ruta: 'acta.alcance', etiqueta: 'Alcance', origen: 'identificacion.alcance', tipo: 'texto', reflejos: ['descripcion'] },
        { ruta: 'acta.criteriosExito', etiqueta: 'Criterios de éxito', origen: 'identificacion.criteriosExito', tipo: 'listaTexto' },
        { ruta: 'acta.entregablesClave', etiqueta: 'Entregables clave', origen: 'identificacion.entregablesClave', tipo: 'listaTexto' },
        { ruta: 'fechaInicio', etiqueta: 'Fecha de inicio', origen: 'fechas.fechaInicio', tipo: 'fecha', reflejos: ['acta.fechaInicio'] },
        { ruta: 'fechaFinPlan', etiqueta: 'Fecha de fin prevista', origen: 'fechas.fechaFinPlan', tipo: 'fecha', reflejos: ['acta.fechaFin'] },
        { ruta: 'precioVenta', etiqueta: 'Precio de venta', origen: 'economia.precioVenta', tipo: 'numero' },
        { ruta: 'monedaVenta', etiqueta: 'Moneda de venta', origen: 'economia.monedaVenta', tipo: 'texto' },
        { ruta: 'condicionesPago', etiqueta: 'Condiciones de pago', origen: 'economia.condicionesPago', tipo: 'texto' },
        { ruta: 'acta.presupuestoBase', etiqueta: 'Presupuesto base (BAC)', origen: 'economia.presupuestoBase', tipo: 'numero', reflejos: ['presupuestoBase'] },
        { ruta: 'acta.monedaPresupuesto', etiqueta: 'Moneda del presupuesto', origen: 'economia.monedaPresupuesto', tipo: 'texto' },
        { ruta: 'acta.roi', etiqueta: 'ROI previsto', origen: 'economia.roi', tipo: 'numero' },
        { ruta: 'projectManager', etiqueta: 'Director de proyecto', origen: 'gobierno.projectManager', tipo: 'persona' },
        { ruta: 'sponsor', etiqueta: 'Sponsor', origen: 'gobierno.sponsor', tipo: 'persona' },
        { ruta: 'cliente', etiqueta: 'Cliente', origen: 'gobierno.cliente', tipo: 'persona' },
        { ruta: 'stakeholders', etiqueta: 'Interesados', origen: 'gobierno.stakeholders', tipo: 'lista', lista: 'stakeholders' },
        { ruta: 'requisitos', etiqueta: 'Requisitos', origen: 'requisitos', tipo: 'lista', lista: 'requisitos' },
        { ruta: 'riesgos', etiqueta: 'Riesgos', origen: 'riesgos', tipo: 'lista', lista: 'riesgos' },
        { ruta: 'hitosFinancieros', etiqueta: 'Hitos financieros', origen: 'hitosFinancieros', tipo: 'lista', lista: 'hitosFinancieros' },
        { ruta: 'elementosGantt', etiqueta: 'Cronograma (EDT)', origen: 'elementosGantt', tipo: 'lista', lista: 'elementosGantt' },
        { ruta: 'proveedores', etiqueta: 'Proveedores', origen: 'proveedores', tipo: 'lista', lista: 'proveedores' },
        { ruta: 'contratos', etiqueta: 'Contratos', origen: 'contratos', tipo: 'lista', lista: 'contratos' }
    ]);

    // ------------------------------------------------------------
    // Helpers puros
    // ------------------------------------------------------------

    function clon(valor) {
        if (valor == null) return valor;
        try { return JSON.parse(JSON.stringify(valor)); }
        catch (_) { return valor; }
    }

    function esVacio(valor) {
        if (valor == null) return true;
        if (typeof valor === 'string') return valor.trim() === '';
        if (Array.isArray(valor)) return valor.length === 0;
        if (typeof valor === 'number') return !Number.isFinite(valor) || valor === 0;
        if (typeof valor === 'object') {
            const claves = Object.keys(valor);
            return claves.length === 0 || claves.every(function (clave) { return esVacio(valor[clave]); });
        }
        return false;
    }

    function obtenerEnRuta(obj, ruta) {
        return String(ruta || '').split('.').reduce(function (acc, clave) {
            return acc == null ? undefined : acc[clave];
        }, obj);
    }

    function ponerEnRuta(obj, ruta, valor) {
        const partes = String(ruta || '').split('.').filter(Boolean);
        if (!partes.length) return;
        let destino = obj;
        for (let i = 0; i < partes.length - 1; i++) {
            if (!destino[partes[i]] || typeof destino[partes[i]] !== 'object') destino[partes[i]] = {};
            destino = destino[partes[i]];
        }
        destino[partes[partes.length - 1]] = valor;
    }

    function limpiarTexto(valor, max) {
        if (valor == null) return '';
        return String(valor)
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, max || 180);
    }

    function numero(valor) {
        if (typeof valor === 'number') return Number.isFinite(valor) ? valor : 0;
        if (typeof valor !== 'string') return 0;
        let s = valor.trim().replace(/[^\d.,\-]/g, '');
        if (s.includes(',') && s.includes('.')) {
            if (s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.');
            else s = s.replace(/,/g, '');
        } else if (s.includes(',')) {
            const partes = s.split(',');
            s = (partes.length === 2 && partes[1].length <= 2)
                ? partes[0].replace(/\./g, '') + '.' + partes[1]
                : s.replace(/,/g, '');
        }
        const n = Number(s);
        return Number.isFinite(n) ? n : 0;
    }

    function normalizarFecha(valor) {
        if (valor == null || valor === '') return null;
        if (valor instanceof Date) {
            return isNaN(valor.getTime()) ? null : valor.toISOString().slice(0, 10);
        }
        const s = String(valor).trim();
        if (FECHA_ISO.test(s)) return s;
        let m = /^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/.exec(s);
        if (m) {
            let anio = Number(m[3]);
            if (anio < 100) anio += 2000;
            // Formato español: día/mes/año.
            const dia = Number(m[1]);
            const mes = Number(m[2]);
            if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;
            return anio + '-' + String(mes).padStart(2, '0') + '-' + String(dia).padStart(2, '0');
        }
        m = /^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/.exec(s);
        if (m) {
            const mes = Number(m[2]);
            const dia = Number(m[3]);
            if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;
            return m[1] + '-' + String(mes).padStart(2, '0') + '-' + String(dia).padStart(2, '0');
        }
        const t = Date.parse(s);
        return isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
    }

    function normalizarMoneda(valor) {
        const s = limpiarTexto(valor, 8).toUpperCase();
        const alias = { '€': 'EUR', '$': 'USD', '£': 'GBP', 'EUR/EUR': 'EUR' };
        const resultado = alias[s] || s;
        return MONEDAS.test(resultado) ? resultado : null;
    }

    function convertir(valor, tipo) {
        switch (tipo) {
            case 'texto': return limpiarTexto(valor, 2000) || null;
            case 'textoCorto': return limpiarTexto(valor, 200) || null;
            case 'correo': {
                const s = limpiarTexto(valor, 160);
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : null;
            }
            case 'numero': return esVacio(valor) ? 0 : numero(valor);
            case 'porcentaje': return esVacio(valor) ? 0 : Math.max(0, Math.min(100, numero(valor)));
            case 'entero5': return esVacio(valor) ? 0 : Math.max(1, Math.min(5, Math.round(numero(valor)) || 3));
            case 'enteroPositivo': return esVacio(valor) ? 0 : Math.max(1, Math.round(numero(valor)) || 1);
            case 'fecha': return normalizarFecha(valor);
            case 'moneda': return normalizarMoneda(valor);
            case 'listaTexto': {
                const entrada = Array.isArray(valor) ? valor
                    : (valor == null || valor === '' ? [] : String(valor).split(/[\n;]/));
                const salida = [];
                for (const item of entrada) {
                    const s = limpiarTexto(item, 300);
                    if (s && salida.length < MAX_ITEMS && salida.indexOf(s) < 0) salida.push(s);
                }
                return salida;
            }
            case 'persona': return normalizarObjeto(valor, DEFINICIONES_LISTA.persona);
            default:
                if (typeof tipo === 'string' && tipo.indexOf('lista:') === 0) {
                    return normalizarLista(valor, tipo.slice(6));
                }
                return limpiarTexto(valor, 200) || null;
        }
    }

    function normalizarObjeto(valor, definiciones) {
        const obj = (valor && typeof valor === 'object' && !Array.isArray(valor)) ? valor : {};
        const salida = {};
        for (const clave of Object.keys(definiciones)) salida[clave] = convertir(obj[clave], definiciones[clave]);
        return salida;
    }

    function normalizarLista(valor, claveLista) {
        const definiciones = DEFINICIONES_LISTA[claveLista] || {};
        const entrada = Array.isArray(valor) ? valor : [];
        const salida = [];
        for (const item of entrada) {
            if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
            const normalizado = normalizarObjeto(item, definiciones);
            if (Object.keys(normalizado).some(function (k) { return !esVacio(normalizado[k]); })) {
                salida.push(normalizado);
            }
            if (salida.length >= MAX_ITEMS) break;
        }
        return salida;
    }

    function plantillaEsquema() {
        const salida = {};
        for (const grupo of Object.keys(ESQUEMA)) {
            const def = ESQUEMA[grupo];
            if (typeof def === 'string') { salida[grupo] = normalizarTipoVacio(def); continue; }
            salida[grupo] = {};
            for (const campo of Object.keys(def)) salida[grupo][campo] = normalizarTipoVacio(def[campo]);
        }
        return salida;
    }

    function normalizarTipoVacio(tipo) {
        if (tipo === 'listaTexto' || tipo.indexOf('lista:') === 0) return [];
        if (tipo === 'numero' || tipo === 'porcentaje' || tipo === 'entero5' || tipo === 'enteroPositivo') return 0;
        if (tipo === 'persona') return normalizarObjeto(null, DEFINICIONES_LISTA.persona);
        return null;
    }

    function parsearJSON(texto) {
        let s = String(texto == null ? '' : texto).trim();
        s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
        const inicio = s.indexOf('{');
        const fin = s.lastIndexOf('}');
        if (inicio < 0 || fin <= inicio) return null;
        s = s.slice(inicio, fin + 1)
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/,\s*([}\]])/g, '$1');
        try {
            const obj = JSON.parse(s);
            return (obj && typeof obj === 'object' && !Array.isArray(obj)) ? obj : null;
        } catch (_) {
            return null;
        }
    }

    // ------------------------------------------------------------
    // Lectura de documentos
    // ------------------------------------------------------------

    function sanitizarTextoContrato(texto, max) {
        let s = String(texto == null ? '' : texto);
        s = s.replace(/\r\n?/g, '\n');
        s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
        s = s.replace(/<[^>]{0,4000}>/g, ' ');
        s = s.replace(/[ \t]+/g, ' ');
        s = s.replace(/ *\n */g, '\n');
        s = s.replace(/\n{3,}/g, '\n\n');
        return s.trim().slice(0, max || MAX_TEXTO);
    }

    function leerTextoArchivo(file) {
        if (typeof file.text === 'function') return file.text();
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onload = function () { resolve(String(reader.result || '')); };
            reader.onerror = function () { reject(reader.error || new Error('lectura fallida')); };
            reader.readAsText(file);
        });
    }

    function extraerTextoPDF(file) {
        if (typeof pdfjsLib === 'undefined' || !pdfjsLib.getDocument) {
            return Promise.reject(Object.assign(new Error('pdfjs_no_disponible'), { codigo: 'pdfjs_no_disponible' }));
        }
        if (pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/vendor/pdfjs/pdf.worker.min.js';
        }
        return file.arrayBuffer().then(function (buffer) {
            return pdfjsLib.getDocument({ data: buffer }).promise;
        }).then(function (pdf) {
            const paginas = [];
            let cadena = Promise.resolve();
            for (let numeroPagina = 1; numeroPagina <= pdf.numPages; numeroPagina++) {
                cadena = cadena.then(function (n) {
                    return pdf.getPage(n).then(function (page) {
                        return page.getTextContent().then(function (contenido) {
                            const filas = {};
                            for (const item of contenido.items) {
                                if (!item.str) continue;
                                const y = Math.round(item.transform[5]);
                                if (!filas[y]) filas[y] = [];
                                filas[y].push(item);
                            }
                            const ys = Object.keys(filas).map(Number).sort(function (a, b) { return b - a; });
                            let texto = '';
                            for (const y of ys) {
                                texto += filas[y]
                                    .sort(function (a, b) { return a.transform[4] - b.transform[4]; })
                                    .map(function (item) { return item.str; })
                                    .join(' ') + '\n';
                            }
                            paginas.push(texto);
                        });
                    });
                }.bind(null, numeroPagina));
            }
            return cadena.then(function () {
                return { texto: paginas.join('\n'), paginas: pdf.numPages };
            });
        });
    }

    function entradasZip(buffer) {
        const bytes = new Uint8Array(buffer);
        const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        let eocd = -1;
        const minimo = Math.max(0, bytes.length - 65557);
        for (let i = bytes.length - 22; i >= minimo; i--) {
            if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
        }
        if (eocd < 0) throw new Error('zip_invalido');
        const total = dv.getUint16(eocd + 10, true);
        let puntero = dv.getUint32(eocd + 16, true);
        const decoder = new TextDecoder('utf-8');
        const entradas = {};
        for (let i = 0; i < total; i++) {
            if (puntero + 46 > bytes.length || dv.getUint32(puntero, true) !== 0x02014b50) break;
            const banderas = dv.getUint16(puntero + 8, true);
            const metodo = dv.getUint16(puntero + 10, true);
            const comprimido = dv.getUint32(puntero + 20, true);
            const longitudNombre = dv.getUint16(puntero + 28, true);
            const longitudExtra = dv.getUint16(puntero + 30, true);
            const longitudComentario = dv.getUint16(puntero + 32, true);
            const local = dv.getUint32(puntero + 42, true);
            const nombre = decoder.decode(bytes.subarray(puntero + 46, puntero + 46 + longitudNombre));
            if (!(banderas & 1)) entradas[nombre] = { metodo: metodo, comprimido: comprimido, local: local };
            puntero += 46 + longitudNombre + longitudExtra + longitudComentario;
        }
        return entradas;
    }

    function inflarRaw(bytes, inyectado) {
        if (typeof inyectado === 'function') {
            const resultado = inyectado(bytes);
            return resultado instanceof Uint8Array ? resultado : new Uint8Array(resultado);
        }
        if (typeof DecompressionStream === 'undefined') throw new Error('deflate_no_soportado');
        const flujo = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        return new Response(flujo).arrayBuffer().then(function (buffer) { return new Uint8Array(buffer); });
    }

    function leerEntradaZip(bytes, entrada, inyectado) {
        const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        if (dv.getUint32(entrada.local, true) !== 0x04034b50) throw new Error('zip_local_invalido');
        const longitudNombre = dv.getUint16(entrada.local + 26, true);
        const longitudExtra = dv.getUint16(entrada.local + 28, true);
        const inicio = entrada.local + 30 + longitudNombre + longitudExtra;
        const comprimido = bytes.subarray(inicio, inicio + entrada.comprimido);
        if (entrada.metodo === 0) return Promise.resolve(comprimido);
        if (entrada.metodo === 8) return inflarRaw(comprimido, inyectado);
        return Promise.reject(new Error('zip_metodo_no_soportado'));
    }

    function xmlDocumentoATexto(xml) {
        return String(xml || '')
            .replace(/<w:tab\b[^>]*\/?>/gi, '\t')
            .replace(/<w:br\b[^>]*\/?>/gi, '\n')
            .replace(/<\/w:p>/gi, '\n')
            .replace(/<\/w:tc>/gi, ' | ')
            .replace(/<\/w:tr>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&#x([0-9a-f]+);/gi, function (_, h) { return String.fromCodePoint(parseInt(h, 16)); })
            .replace(/&#(\d+);/g, function (_, d) { return String.fromCodePoint(Number(d)); })
            .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
            .replace(/&amp;/g, '&');
    }

    function extraerTextoDocx(file, opciones) {
        const opcionesSeguras = opciones || {};
        return file.arrayBuffer().then(function (buffer) {
            const bytes = new Uint8Array(buffer);
            const entradas = entradasZip(bytes);
            const nombres = Object.keys(entradas).filter(function (nombre) {
                return nombre === 'word/document.xml' || /^word\/(header|footer)\d*\.xml$/.test(nombre);
            });
            if (nombres.indexOf('word/document.xml') < 0) {
                throw Object.assign(new Error('docx_sin_documento'), { codigo: 'docx_sin_documento' });
            }
            nombres.sort(function (a, b) {
                if (a === 'word/document.xml') return -1;
                if (b === 'word/document.xml') return 1;
                return a.localeCompare(b);
            });
            let cadena = Promise.resolve([]);
            for (const nombre of nombres) {
                cadena = cadena.then(function (partes) {
                    return leerEntradaZip(bytes, entradas[nombre], opcionesSeguras.inflateRaw).then(function (datos) {
                        partes.push(xmlDocumentoATexto(new TextDecoder('utf-8').decode(datos)));
                        return partes;
                    });
                });
            }
            return cadena;
        }).then(function (partes) { return partes.join('\n'); });
    }

    function extraerTextoArchivo(file, opciones) {
        if (!file) {
            return Promise.reject(Object.assign(new Error('sin_archivo'), { codigo: 'sin_archivo' }));
        }
        const opcionesSeguras = opciones || {};
        const nombre = String(file.name || '').toLowerCase();
        const mime = String(file.type || '').toLowerCase();
        let formato = '';
        let lectura;
        if (nombre.endsWith('.pdf') || mime === 'application/pdf') {
            formato = 'pdf';
            lectura = extraerTextoPDF(file);
        } else if (/\.(txt|md|text)$/.test(nombre) || mime.indexOf('text/') === 0) {
            formato = 'txt';
            lectura = leerTextoArchivo(file).then(function (texto) { return { texto: texto, paginas: 0 }; });
        } else if (nombre.endsWith('.docx') || mime.indexOf('wordprocessingml.document') >= 0) {
            formato = 'docx';
            lectura = extraerTextoDocx(file, opcionesSeguras).then(function (texto) { return { texto: texto, paginas: 0 }; });
        } else {
            return Promise.reject(Object.assign(new Error('formato_no_soportado'), { codigo: 'formato_no_soportado' }));
        }
        return lectura.then(function (resultado) {
            const texto = sanitizarTextoContrato(resultado.texto, opcionesSeguras.maxTexto || MAX_TEXTO);
            if (!texto) throw Object.assign(new Error('texto_vacio'), { codigo: 'texto_vacio' });
            return {
                texto: texto,
                caracteres: texto.length,
                paginas: resultado.paginas || 0,
                formato: formato
            };
        });
    }

    // ------------------------------------------------------------
    // Fragmentación, prompt y normalización de la respuesta del modelo
    // ------------------------------------------------------------

    function segmentarContrato(texto, opciones) {
        const opcionesSeguras = opciones || {};
        const limpio = sanitizarTextoContrato(texto, opcionesSeguras.maxTexto || MAX_TEXTO);
        if (!limpio) return [];
        const max = Math.max(2000, Number(opcionesSeguras.maxChars) || CHUNK_CHARS);
        const solapeSolicitado = opcionesSeguras.solape == null ? CHUNK_OVERLAP : (Number(opcionesSeguras.solape) || 0);
        const solape = Math.max(0, Math.min(solapeSolicitado, Math.floor(max / 4)));
        const maxChunks = Math.max(1, Number(opcionesSeguras.maxChunks) || MAX_CHUNKS);

        const unidades = [];
        for (const parrafo of limpio.split('\n')) {
            if (!parrafo.trim()) continue;
            if (parrafo.length <= max) { unidades.push(parrafo); continue; }
            let resto = parrafo;
            while (resto.length > max) {
                const espacio = resto.lastIndexOf(' ', max);
                const corte = espacio > Math.floor(max / 2) ? espacio : max;
                unidades.push(resto.slice(0, corte));
                const retroceso = Math.min(solape, Math.max(0, corte - 1));
                resto = resto.slice(corte - retroceso);
            }
            if (resto.trim()) unidades.push(resto);
        }

        const fragmentos = [];
        let actual = '';
        for (const unidad of unidades) {
            const candidato = actual ? actual + '\n' + unidad : unidad;
            if (candidato.length <= max) { actual = candidato; continue; }
            if (actual) fragmentos.push(actual);
            actual = (solape && actual ? actual.slice(-solape) + '\n' : '') + unidad;
            if (actual.length > max) {
                fragmentos.push(actual.slice(0, max));
                actual = actual.slice(max - solape);
            }
            if (fragmentos.length >= maxChunks) { actual = ''; break; }
        }
        if (actual.trim() && fragmentos.length < maxChunks) fragmentos.push(actual);

        return fragmentos.slice(0, maxChunks).map(function (textoFragmento, i) {
            return { indice: i + 1, texto: textoFragmento, caracteres: textoFragmento.length };
        });
    }

    function construirPromptExtraccion(fragmento, opciones) {
        const opcionesSeguras = opciones || {};
        const total = Math.max(1, Number(opcionesSeguras.total) || 1);
        const indice = Math.max(1, Number(opcionesSeguras.indice) || 1);
        const plantilla = JSON.stringify(plantillaEsquema());
        const system = 'Eres consultor senior de gestión de proyectos PMI. ' +
            'Extrae del fragmento de contrato únicamente la información escrita explícitamente en él. ' +
            'Responde SOLO con un objeto JSON válido, sin cercas ni comentarios, con exactamente estas claves y tipos: ' +
            plantilla + '. ' +
            'Reglas: fechas en ISO AAAA-MM-DD; importes como números sin símbolos ni separadores de miles; ' +
            'monedas ISO de tres letras; usa null para valores no mencionados y [] para listas vacías; ' +
            'texto en español; no inventes, no deduzcas y no traduzcas nombres propios. ' +
            (total > 1 ? 'Este es el fragmento ' + indice + ' de ' + total + '; ignora lo que no aparezca en él. ' : '');
        const user = JSON.stringify({ fragmento: String(fragmento || '').slice(0, CHUNK_CHARS + 2000) });
        return [{ role: 'system', content: system }, { role: 'user', content: user }];
    }

    function normalizarExtraccion(texto) {
        const obj = parsearJSON(texto);
        if (!obj) return null;
        const salida = {};
        for (const grupo of Object.keys(ESQUEMA)) {
            const def = ESQUEMA[grupo];
            const entrada = obj[grupo];
            if (typeof def === 'string') { salida[grupo] = convertir(entrada, def); continue; }
            const contenido = (entrada && typeof entrada === 'object' && !Array.isArray(entrada)) ? entrada : {};
            salida[grupo] = {};
            for (const campo of Object.keys(def)) salida[grupo][campo] = convertir(contenido[campo], def[campo]);
        }
        return salida;
    }

    function claveDeItem(item) {
        const valor = (item && (item.codigo || item.nombre || item.proveedor || item.necesidad)) || JSON.stringify(item || {});
        return String(valor).trim().toLowerCase();
    }

    function fusionarExtracciones(resultados) {
        const salida = plantillaEsquema();
        const lista = Array.isArray(resultados) ? resultados : [];
        for (const resultado of lista) {
            const datos = resultado && resultado.datos;
            if (!datos || typeof datos !== 'object') continue;
            for (const grupo of Object.keys(ESQUEMA)) {
                const def = ESQUEMA[grupo];
                const entrada = datos[grupo];
                if (entrada == null) continue;
                if (typeof def === 'string') {
                    if (!Array.isArray(entrada)) continue;
                    for (const item of entrada) {
                        if (!item || typeof item !== 'object') continue;
                        const claves = salida[grupo].map(claveDeItem);
                        if (claves.indexOf(claveDeItem(item)) < 0) salida[grupo].push(item);
                    }
                    continue;
                }
                if (typeof entrada !== 'object' || Array.isArray(entrada)) continue;
                for (const campo of Object.keys(def)) {
                    const valor = entrada[campo];
                    if (esVacio(valor)) continue;
                    const anterior = salida[grupo][campo];
                    const tipo = def[campo];
                    if (esVacio(anterior) || (tipo === 'texto' && String(valor).length > String(anterior).length)) {
                        salida[grupo][campo] = valor;
                    }
                }
            }
        }
        return salida;
    }

    // ------------------------------------------------------------
    // Fallback heurístico (sin modelo / modelo caído)
    // ------------------------------------------------------------

    function extraerHeuristico(texto, opciones) {
        const limpio = sanitizarTextoContrato(texto, (opciones || {}).maxTexto || MAX_TEXTO);
        const datos = plantillaEsquema();

        const primeraLinea = (limpio.split('\n').find(function (linea) { return linea.trim(); }) || '').trim();
        const matchNombre = /(?:contrato\s+(?:de|para|relativo\s+a|sobre)\s*[:\-]?\s*)([^\n]{3,120})/i.exec(limpio);
        const nombre = matchNombre ? matchNombre[1].trim() : primeraLinea.slice(0, 120);
        if (nombre) datos.identificacion.nombreProyecto = limpiarTexto(nombre, 160);

        const matchCodigo = /(?:expediente|referencia|ref\.?|n[.º°]|número|contrato\s+n[.º°]?)\s*[:#\-]?\s*([A-Z0-9][A-Z0-9\-\/_]{2,29})/im.exec(limpio);
        if (matchCodigo) datos.identificacion.codigo = matchCodigo[1];

        const regexDinero = /([0-9][0-9.,\s]{0,18})\s*(EUR|USD|GBP|CHF|€|\$|£)/gi;
        let mejor = null;
        let coincidencia;
        while ((coincidencia = regexDinero.exec(limpio))) {
            const valor = numero(coincidencia[1]);
            if (valor > 0 && (!mejor || valor > mejor.valor)) {
                mejor = { valor: valor, moneda: normalizarMoneda(coincidencia[2]) || 'EUR' };
            }
        }
        if (mejor) {
            datos.economia.precioVenta = mejor.valor;
            datos.economia.monedaVenta = mejor.moneda;
            datos.economia.presupuestoBase = mejor.valor;
            datos.economia.monedaPresupuesto = mejor.moneda;
        }

        const matchInicio = /(?:fecha\s+de\s+)?(?:inicio|comienzo|firma)\s*(?:prevista)?\s*[:\-]?\s*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/i.exec(limpio);
        if (matchInicio) datos.fechas.fechaInicio = normalizarFecha(matchInicio[1]);
        const matchFin = /(?:fecha\s+de\s+)?(?:fin|finalización|terminación|vencimiento)\s*(?:prevista)?\s*[:\-]?\s*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/i.exec(limpio);
        if (matchFin) datos.fechas.fechaFinPlan = normalizarFecha(matchFin[1]);

        const matchPago = /([^\n]*(?:condiciones?\s+de\s+pago|forma\s+de\s+pago|facturación)[^\n]*)/i.exec(limpio);
        if (matchPago) datos.economia.condicionesPago = limpiarTexto(matchPago[1], 400);

        const regexProveedor = /(?:contratista|adjudicatario|proveedor|empresa\s+adjudicada)\s*[:\-]?\s*([A-ZÁÉÍÓÚÑa-záéíóúñ][^\n,;]{2,60})/gi;
        while ((coincidencia = regexProveedor.exec(limpio)) && datos.proveedores.length < MAX_ITEMS) {
            const proveedor = limpiarTexto(coincidencia[1], 120);
            if (proveedor && !datos.proveedores.some(function (p) { return p.nombre === proveedor; })) {
                datos.proveedores.push({ nombre: proveedor, pais: null });
            }
        }
        if (datos.proveedores.length) {
            datos.contratos.push({
                proveedor: datos.proveedores[0].nombre,
                importe: datos.economia.precioVenta,
                moneda: datos.economia.monedaVenta
            });
        }

        for (const linea of limpio.split('\n')) {
            if (!/^(entregable|hito|objetivo|criterio)/i.test(linea.trim())) continue;
            const textoLinea = limpiarTexto(linea, 300);
            if (!textoLinea) continue;
            if (/^entregable/i.test(textoLinea) && datos.identificacion.entregablesClave.length < MAX_ITEMS) {
                datos.identificacion.entregablesClave.push(textoLinea);
            } else if (/^criterio/i.test(textoLinea) && datos.identificacion.criteriosExito.length < MAX_ITEMS) {
                datos.identificacion.criteriosExito.push(textoLinea);
            }
        }
        return datos;
    }

    // ------------------------------------------------------------
    // Propuesta revisable y aplicación
    // ------------------------------------------------------------

    function limitar(value, minimo, maximo) {
        const n = Math.round(numero(value));
        return Math.max(minimo, Math.min(maximo, isFinite(n) ? n : minimo));
    }

    function prepararPersona(item, esCliente) {
        const persona = {
            nombre: item.nombre || '',
            cargo: item.cargo || item.puesto || '',
            email: item.email || '',
            telefono: item.telefono || '',
            direccion: '',
            departamento: ''
        };
        if (esCliente) persona.contacto = persona.nombre;
        return persona;
    }

    function prepararLista(ruta, elementos) {
        const base = Date.now();
        const fecha = new Date().toISOString().slice(0, 10);
        return (Array.isArray(elementos) ? elementos : []).map(function (item, i) {
            const id = base + i;
            if (ruta === 'requisitos') {
                return {
                    id: id, codigo: item.codigo || 'REQ-' + String(i + 1).padStart(3, '0'),
                    necesidad: item.necesidad || item.nombre || '', tipo: item.tipo || 'negocio',
                    origen: item.origen || 'contrato', prioridad: item.prioridad || 'media',
                    criteriosAceptacion: item.criteriosAceptacion || '', estado: 'pendiente',
                    responsable: item.responsable || '', fecha: fecha, aprobadoPor: '',
                    entregableId: '', wbsCode: ''
                };
            }
            if (ruta === 'riesgos') {
                const probabilidad = limitar(item.probabilidad, 1, 5);
                const impacto = limitar(item.impacto, 1, 5);
                const score = probabilidad * impacto;
                return {
                    id: id, nombre: item.nombre || '', categoria: item.categoria || 'contractual',
                    probabilidad: probabilidad, impacto: impacto, score: score,
                    nivel: score >= 15 ? 'alto' : (score >= 8 ? 'medio' : 'bajo'),
                    impactoMonetario: 0, respuesta: item.respuesta || '', estado: 'identificado',
                    planAccion: item.planAccion || item.respuesta || '', tipo: 'contractual',
                    owner: item.owner || '', causa: '', trigger: '', frecuencia: '',
                    proximaRevision: '', riesgoResidual: ''
                };
            }
            if (ruta === 'hitosFinancieros') {
                return {
                    id: id, nombre: item.nombre || '', mes: limitar(item.mes, 1, 120),
                    porcentaje: limitar(item.porcentaje, 0, 100), moneda: item.moneda || '',
                    importeFijo: item.importeFijo || 0, condiciones: item.condiciones || '',
                    metodoPago: item.metodoPago || 'transferencia', plazoLC: '',
                    comisionEmision: 0, comisionConfirmacion: 0, gastosCourier: 0,
                    retencionPorcentaje: limitar(item.retencionPorcentaje, 0, 100),
                    retencionMes: item.retencionMes || 0
                };
            }
            if (ruta === 'elementosGantt') {
                const tipos = ['edt', 'tarea', 'hito', 'entregable'];
                const tipo = tipos.indexOf(item.tipo) >= 0 ? item.tipo : 'tarea';
                const duracion = tipo === 'hito' ? 0 : limitar(item.duracion, 1, 3650);
                return {
                    id: id, tipo: tipo, nombre: item.nombre || '', inicio: item.inicio || '',
                    duracion: duracion, duracionOriginal: duracion, tipoDuracion: 'dias', duracionHoras: 0,
                    progreso: tipo === 'hito' ? 100 : 0, responsable: item.responsable || '',
                    dependeDe: item.dependeDe || '', recursoAsignado: null, horasDia: 0,
                    costeEstimado: item.costeEstimado || 0, costeReal: 0,
                    predecesores: [], requisitosIds: []
                };
            }
            if (ruta === 'stakeholders') {
                return {
                    id: id, nombre: item.nombre || '', empresa: item.empresa || '',
                    puesto: item.puesto || '', rol: item.rol || '', email: item.email || '',
                    telefono: item.telefono || '', pais: item.pais || '', tipo: 'externo',
                    poder: limitar(item.poder, 1, 5), interes: limitar(item.interes, 1, 5),
                    expectativas: item.expectativas || ''
                };
            }
            if (ruta === 'proveedores') return { id: id, nombre: item.nombre || '', pais: item.pais || '' };
            if (ruta === 'contratos') {
                return { id: id, proveedor: item.proveedor || '', importe: item.importe || 0, moneda: item.moneda || '' };
            }
            return Object.assign({ id: id }, item);
        });
    }

    function proponerCambios(proyecto, extraccion, opciones) {
        const opcionesSeguras = opciones || {};
        const propuestas = [];
        for (const destino of DESTINOS) {
            const extraido = obtenerEnRuta(extraccion, destino.origen);
            if (esVacio(extraido)) continue;
            let valor;
            if (destino.tipo === 'lista') {
                valor = prepararLista(destino.lista || destino.ruta, extraido);
                if (!valor.length) continue;
            } else if (destino.tipo === 'listaTexto') {
                valor = (Array.isArray(extraido) ? extraido : [extraido]).join('\n');
            } else if (destino.tipo === 'persona') {
                valor = prepararPersona(extraido, destino.ruta === 'cliente');
            } else {
                valor = extraido;
            }
            const actual = obtenerEnRuta(proyecto || {}, destino.ruta);
            if (!esVacio(actual) && JSON.stringify(actual) === JSON.stringify(valor)) continue;
            propuestas.push({
                id: destino.ruta,
                ruta: destino.ruta,
                etiqueta: destino.etiqueta,
                valorActual: clon(actual),
                valorPropuesto: valor,
                tipo: destino.tipo,
                reflejos: destino.reflejos || [],
                incluido: true,
                origen: opcionesSeguras.modo || 'ia'
            });
        }
        return {
            propuestas: propuestas,
            metadata: {
                modo: opcionesSeguras.modo || 'ia',
                avisos: opcionesSeguras.avisos || [],
                archivo: opcionesSeguras.archivo || '',
                fecha: new Date().toISOString()
            }
        };
    }

    function aplicarPropuestas(proyecto, seleccion, opciones) {
        if (!proyecto) return { aplicadas: 0, rutas: [] };
        const opcionesSeguras = opciones || {};
        const propuestas = Array.isArray(opcionesSeguras.propuestas) ? opcionesSeguras.propuestas : [];
        const ids = Array.isArray(seleccion) ? seleccion : [];
        const antes = {};
        const rutas = [];
        for (const id of ids) {
            const item = propuestas.find(function (p) { return p.id === id || p.ruta === id; });
            if (!item) continue;
            antes[item.ruta] = clon(obtenerEnRuta(proyecto, item.ruta));
            ponerEnRuta(proyecto, item.ruta, clon(item.valorPropuesto));
            for (const reflejo of (item.reflejos || [])) ponerEnRuta(proyecto, reflejo, clon(item.valorPropuesto));
            rutas.push(item.ruta);
        }
        if (!rutas.length) return { aplicadas: 0, rutas: [] };
        if (typeof sincronizarActaConProyecto === 'function') {
            try { sincronizarActaConProyecto(); } catch (_) { /* no bloquear la importación */ }
        }
        if (typeof registrarBitacora === 'function') {
            registrarBitacora('contrato_ia', proyecto.id, 'importar',
                { campos: antes },
                { campos: rutas, metadata: opcionesSeguras.metadata || null },
                proyecto);
        }
        if (opcionesSeguras.guardar !== false && typeof guardarProyecto === 'function') guardarProyecto();
        return { aplicadas: rutas.length, rutas: rutas };
    }

    const API = Object.freeze({
        ESQUEMA: ESQUEMA,
        DESTINOS: DESTINOS,
        sanitizarTextoContrato: sanitizarTextoContrato,
        segmentarContrato: segmentarContrato,
        construirPromptExtraccion: construirPromptExtraccion,
        normalizarExtraccion: normalizarExtraccion,
        extraerHeuristico: extraerHeuristico,
        fusionarExtracciones: fusionarExtracciones,
        proponerCambios: proponerCambios,
        aplicarPropuestas: aplicarPropuestas,
        extraerTextoArchivo: extraerTextoArchivo,
        extraerTextoDocx: extraerTextoDocx,
        entradasZip: entradasZip,
        xmlDocumentoATexto: xmlDocumentoATexto,
        _parsearJSON: parsearJSON,
        _normalizarFecha: normalizarFecha,
        _numero: numero,
        _obtenerEnRuta: obtenerEnRuta,
        _ponerEnRuta: ponerEnRuta
    });

    global.ContratoIA = API;
})(typeof window !== 'undefined' ? window : globalThis);
