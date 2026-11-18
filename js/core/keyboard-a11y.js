/**
 * Accesibilidad de teclado para controles no nativos:
 * - elementos dinámicos con `onclick` (span/div de tablas y tarjetas);
 * - navegación del sidebar (`[data-panel]`, `[data-submenu]:not(.submenu)`, `.submenu-item`).
 *
 * Añade `tabindex`/`role`, activa con Enter/Espacio, mantiene `aria-expanded`
 * en los submenús y vuelve a aplicarse al contenido inyectado dinámicamente.
 */
(function () {
    'use strict';

    var NATIVOS = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'SUMMARY'];
    var FOCUSEABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])';
    var NAV_SELECCION = '[data-panel], [data-submenu]:not(.submenu), .submenu-item';
    var procesados = new WeakSet();
    var navProcesados = new WeakSet();
    var temporizador = null;
    var observador = null;

    function textoAccesible(elemento) {
        var texto = (elemento.textContent || '').replace(/\s+/g, ' ').trim();
        var titulo = elemento.getAttribute('title');
        if (texto) return texto.slice(0, 120);
        if (titulo) return titulo.trim().slice(0, 120);
        var inline = elemento.getAttribute('onclick') || '';
        var funcion = /^\s*([A-Za-z_$][\w$]*)\s*\(/.exec(inline);
        if (funcion) {
            return funcion[1]
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/[_\$]/g, ' ')
                .trim()
                .slice(0, 120);
        }
        return '';
    }

    function tieneDescendientesInteractivos(elemento) {
        return !!(elemento.querySelector && elemento.querySelector(FOCUSEABLE + ', [onclick]'));
    }

    function activar(elemento, evento) {
        if (evento.key !== 'Enter' && evento.key !== ' ' && evento.key !== 'Spacebar' && evento.keyCode !== 32) return;
        evento.preventDefault();
        evento.stopPropagation();
        try {
            elemento.click();
        } catch (error) {
            console.error('PMIKeyboardA11y: no se pudo activar el control', error);
        }
    }

    function yaTieneTeclado(elemento) {
        if (procesados.has(elemento)) return true;
        var inline = elemento.getAttribute('onkeydown') || '';
        return /Enter|Space|keyCode|which|charCode|keyup|keydown/i.test(inline);
    }

    function sincronizarSubmenu(elemento) {
        var id = elemento.getAttribute('data-submenu');
        var submenu = id ? document.querySelector('.submenu[data-submenu="' + id + '"]') : null;
        if (submenu) {
            const abierto = submenu.classList.contains('show') ? 'true' : 'false';
            elemento.setAttribute('aria-expanded', abierto);
        }
    }

    function procesarNavegacion(root) {
        var scope = root && root.nodeType === 1 ? root : document;
        var candidatos = [];

        if (typeof scope.matches === 'function' && scope.matches(NAV_SELECCION)) candidatos.push(scope);
        if (typeof scope.querySelectorAll === 'function') {
            candidatos = candidatos.concat(Array.prototype.slice.call(scope.querySelectorAll(NAV_SELECCION)));
        }

        candidatos.forEach(function (elemento) {
            if (NATIVOS.indexOf(elemento.tagName) !== -1) return;
            if (navProcesados.has(elemento)) return;
            if (elemento.getAttribute('aria-hidden') === 'true') return;

            if (!elemento.hasAttribute('tabindex')) elemento.setAttribute('tabindex', '0');
            if (!elemento.hasAttribute('role')) elemento.setAttribute('role', 'button');

            if (!elemento.hasAttribute('aria-label') && !elemento.hasAttribute('aria-labelledby')) {
                var etiqueta = textoAccesible(elemento);
                if (etiqueta) elemento.setAttribute('aria-label', etiqueta);
            }

            if (elemento.hasAttribute('data-submenu')) {
                elemento.setAttribute('aria-haspopup', 'true');
                sincronizarSubmenu(elemento);
                elemento.addEventListener('click', function () { sincronizarSubmenu(elemento); });
            }

            elemento.addEventListener('keydown', function (evento) { activar(elemento, evento); });
            navProcesados.add(elemento);
        });
    }

    function procesar(root) {
        procesarNavegacion(root);

        var scope = root && root.nodeType === 1 ? root : document;
        var candidatos = [];

        if (typeof scope.matches === 'function' && scope.matches('[onclick]')) candidatos.push(scope);
        if (typeof scope.querySelectorAll === 'function') {
            candidatos = candidatos.concat(Array.prototype.slice.call(scope.querySelectorAll('[onclick]')));
        }

        candidatos.forEach(function (elemento) {
            if (NATIVOS.indexOf(elemento.tagName) !== -1) return;
            if (!elemento.hasAttribute('onclick')) return;
            if (elemento.getAttribute('aria-hidden') === 'true') return;
            if (yaTieneTeclado(elemento)) return;

            if (tieneDescendientesInteractivos(elemento)) {
                if (procesados.has(elemento)) {
                    elemento.removeAttribute('role');
                    elemento.removeAttribute('tabindex');
                }
                return;
            }

            if (!elemento.hasAttribute('tabindex') && elemento.tabIndex < 0) {
                elemento.setAttribute('tabindex', '0');
            }
            if (!elemento.hasAttribute('role')) {
                elemento.setAttribute('role', 'button');
            }
            if (!elemento.hasAttribute('aria-label') && !elemento.hasAttribute('aria-labelledby')) {
                var etiqueta = textoAccesible(elemento);
                if (etiqueta) elemento.setAttribute('aria-label', etiqueta);
            }

            elemento.addEventListener('keydown', function (evento) { activar(elemento, evento); });
            procesados.add(elemento);
        });
    }

    function programar(root) {
        if (temporizador) clearTimeout(temporizador);
        temporizador = setTimeout(function () {
            temporizador = null;
            procesar(root);
        }, 80);
    }

    function envolverMostrarPanel() {
        var original = window.mostrarPanel;
        if (typeof original !== 'function' || original.__pmiKeyboardA11y) return;
        var envuelto = function (panelId) {
            var resultado = original.apply(this, arguments);
            setTimeout(function () {
                procesar(document);
                var nombre = String(panelId || '').toLowerCase();
                document.querySelectorAll('.submenu-item[data-panel]').forEach(function (item) {
                    var activo = (item.getAttribute('data-panel') || '').toLowerCase() === nombre;
                    item.classList.toggle('active', activo);
                });
            }, 0);
            return resultado;
        };
        envuelto.__pmiKeyboardA11y = true;
        window.mostrarPanel = envuelto;
    }

    function iniciar() {
        procesar(document);
        envolverMostrarPanel();

        if (typeof MutationObserver === 'undefined' || !document.body) return;
        observador = new MutationObserver(function (mutaciones) {
            mutaciones.forEach(function (mutacion) {
                if (mutacion.type === 'childList') {
                    Array.prototype.forEach.call(mutacion.addedNodes, function (nodo) {
                        if (nodo && nodo.nodeType === 1) programar(nodo);
                    });
                } else if (mutacion.type === 'attributes' &&
                    (mutacion.attributeName === 'onclick' || mutacion.attributeName === 'class')) {
                    programar(mutacion.target);
                }
            });
        });
        observador.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['onclick', 'class']
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar, { once: true });
    } else {
        iniciar();
    }

    window.PMIKeyboardA11y = {
        procesar: procesar,
        programar: programar,
        observar: function () { return !!observador; }
    };
})();
