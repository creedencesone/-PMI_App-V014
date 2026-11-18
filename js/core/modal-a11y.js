// ============================================================
// modal-a11y.js — diálogos accesibles: role/aria-modal, focus trap y
// restauración del foco al cerrar. Funciona con modales dinámicos.
// ============================================================
(function () {
    'use strict';
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const estados = new WeakMap();
    const selector = '.modal, [role="dialog"]';
    const focusable = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function visible(el) {
        if (!el || el.classList.contains('u-hidden')) return false;
        const st = window.getComputedStyle(el);
        return st.display !== 'none' && st.visibility !== 'hidden' && el.getClientRects().length > 0;
    }

    function preparar(el) {
        if (!el.hasAttribute('role')) el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
            const titulo = el.querySelector('h2, h3, .modal-header h3');
            if (titulo) {
                if (!titulo.id) titulo.id = 'dialog-titulo-' + Math.random().toString(36).slice(2, 8);
                el.setAttribute('aria-labelledby', titulo.id);
            }
        }
    }

    function abrir(el) {
        if (!el) return;
        preparar(el);
        const estado = estados.get(el) || {};
        if (!estado.abierto) {
            estado.abierto = true;
            estado.focoAnterior = document.activeElement;
            estados.set(el, estado);
        }
        window.requestAnimationFrame(() => {
            const objetivo = el.querySelector('[autofocus], input:not([type="hidden"]), select, textarea, button');
            if (objetivo && typeof objetivo.focus === 'function') objetivo.focus({ preventScroll: true });
        });
    }

    function cerrar(el) {
        const estado = estados.get(el);
        if (!estado || !estado.abierto) return;
        estado.abierto = false;
        estados.set(el, estado);
        const previo = estado.focoAnterior;
        if (previo && document.contains(previo) && typeof previo.focus === 'function') {
            window.requestAnimationFrame(() => previo.focus({ preventScroll: true }));
        }
    }

    function sincronizar() {
        document.querySelectorAll(selector).forEach(el => {
            const abierto = visible(el);
            const estado = estados.get(el);
            if (abierto && (!estado || !estado.abierto)) abrir(el);
            else if (!abierto && estado && estado.abierto) cerrar(el);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll(selector).forEach(preparar);
        sincronizar();
        const observer = new MutationObserver(sincronizar);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'style', 'hidden'], subtree: true, childList: true });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            const activo = Array.from(document.querySelectorAll(selector)).find(visible);
            if (!activo) return;
            event.preventDefault();
            const boton = activo.querySelector('.close-modal[onclick], [data-modal-close], button[onclick*="cerrar" i]');
            if (boton && typeof boton.click === 'function') boton.click();
            else { activo.classList.add('u-hidden'); activo.style.display = 'none'; }
            return;
        }
        if (event.key !== 'Tab') return;
        const modal = Array.from(document.querySelectorAll(selector)).find(visible);
        if (!modal) return;
        const nodes = Array.from(modal.querySelectorAll(focusable)).filter(el => visible(el) || el.type === 'hidden');
        if (!nodes.length) { event.preventDefault(); modal.focus(); return; }
        const primero = nodes[0], ultimo = nodes[nodes.length - 1];
        if (event.shiftKey && (document.activeElement === primero || !modal.contains(document.activeElement))) {
            event.preventDefault(); ultimo.focus();
        } else if (!event.shiftKey && (document.activeElement === ultimo || !modal.contains(document.activeElement))) {
            event.preventDefault(); primero.focus();
        }
    });

    window.abrirModalAccesible = abrir;
})();
