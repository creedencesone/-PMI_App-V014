const CACHE = 'pmi-mind-v51';
const PRECACHE_URLS = [
    // BEGIN GENERATED PRECACHE
    '/',
    '/assets/icon-192-COQgdxum.png',
    '/assets/manifest-BAKpTY4j.json',
    '/assets/proyecto-BQAMdidX.css',
    '/assets/tokens-DV33kgmC.css',
    '/assets/WIP_LOGO-DFlZgxkJ.png',
    '/auth.js?v=20261121j',
    '/dashboard.html',
    '/design-system/tokens.css?v=20261121j',
    '/favicon.svg',
    '/fonts/InterVariable.woff2',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/index.html',
    '/js/config-global.js?v=20261121j',
    '/js/config.js?v=20261121j',
    '/js/core/alertas.js?v=20261121j',
    '/js/core/audit.js?v=20261121j',
    '/js/core/calidad.js?v=20261121j',
    '/js/core/collections.js?v=20261121j',
    '/js/core/csv.js?v=20261121j',
    '/js/core/dates.js?v=20261121j',
    '/js/core/evm.js?v=20261121j',
    '/js/core/finance.js?v=20261121j',
    '/js/core/keyboard-a11y.js?v=20261121j',
    '/js/core/linea-base.js?v=20261121j',
    '/js/core/modal-a11y.js?v=20261121j',
    '/js/core/nivelacion.js?v=20261121j',
    '/js/core/permisos.js?v=20261121j',
    '/js/core/portafolio.js?v=20261121j',
    '/js/core/raci.js?v=20261121j',
    '/js/core/ui.js?v=20261121j',
    '/js/core/wbs.js?v=20261121j',
    '/js/core/whatif.js?v=20261121j',
    '/js/i18n.js?v=20261121j',
    '/js/motion.js?v=20261121j',
    '/js/panels/acta-roles.js?v=20261121j',
    '/js/panels/agenda.js?v=20261121j',
    '/js/panels/beneficios-cambios-lecciones.js?v=20261121j',
    '/js/panels/carga-trabajo.js?v=20261121j',
    '/js/panels/cierre.js?v=20261121j',
    '/js/panels/compartir.js?v=20261121j',
    '/js/panels/comunicaciones.js?v=20261121j',
    '/js/panels/edt-panel.js?v=20261121j',
    '/js/panels/equipo-servicios.js?v=20261121j',
    '/js/panels/financiero-monedas.js?v=20261121j',
    '/js/panels/gantt.js?v=20261121j',
    '/js/panels/garantia-viajes-avales.js?v=20261121j',
    '/js/panels/grafico-monedas.js?v=20261121j',
    '/js/panels/ia-analisis.js?v=20261121j',
    '/js/panels/import-export.js?v=20261121j',
    '/js/panels/logistica-3d.js?v=20261121j',
    '/js/panels/manual.js?v=20261121j',
    '/js/panels/materiales.js?v=20261121j',
    '/js/panels/montecarlo.js?v=20261121j',
    '/js/panels/navegacion-auth.js?v=20261121j',
    '/js/panels/organigrama.js?v=20261121j',
    '/js/panels/panel-calidad.js?v=20261121j',
    '/js/panels/panel-informe.js?v=20261121j',
    '/js/panels/panel-salud.js?v=20261121j',
    '/js/panels/requisitos.js?v=20261121j',
    '/js/panels/resumen-procesos.js?v=20261121j',
    '/js/panels/riesgos.js?v=20261121j',
    '/js/panels/scrum.js?v=20261121j',
    '/js/panels/stakeholders.js?v=20261121j',
    '/js/panels/venta-cashflow.js?v=20261121j',
    '/js/services/DataService.js?v=20261121j',
    '/js/services/LocalAIService.js?v=20261121j',
    '/js/services/supabaseClient.bundle.js',
    '/js/utils.js?v=20261121j',
    '/js/vendor/chart-fallback.js?v=20261121j',
    '/js/vendor/chart.umd.min.js?v=20261121j',
    '/js/vendor/email.min.js?v=20261121j',
    '/js/vendor/feather.min.js?v=20261121j',
    '/js/vendor/html2canvas.min.js?v=20261121j',
    '/js/vendor/pbkdf2.js?v=20261121j',
    '/js/vendor/pdfjs/pdf.min.js?v=20261121j',
    '/js/vendor/three/DragControls.js?v=20261121j',
    '/js/vendor/three/OrbitControls.js?v=20261121j',
    '/js/vendor/three/three.min.js?v=20261121j',
    '/manifest.json',
    '/proyecto.html',
    '/styles.css?v=20261121j',
    // END GENERATED PRECACHE
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(async cache => {
        // Un recurso ausente no debe impedir instalar todo el service worker.
        const resultados = await Promise.allSettled(PRECACHE_URLS.map(url => cache.add(url)));
        const fallidos = resultados
            .map((resultado, indice) => resultado.status === 'rejected' ? PRECACHE_URLS[indice] : null)
            .filter(Boolean);
        if (fallidos.length) console.warn('[SW] recursos no precacheados:', fallidos);
    }));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(k => k !== CACHE).map(k => caches.delete(k))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    const url = new URL(e.request.url);
    if (url.origin !== self.location.origin) return;
    e.respondWith(
        fetch(e.request).then(res => {
            if (res && res.ok) {
                const clone = res.clone();
                caches.open(CACHE).then(cache => cache.put(e.request, clone));
            }
            return res;
        }).catch(async () => {
            // Vite añade cabeceras Vary a los assets: la coincidencia estricta
            // falla sin red aunque el recurso esté en el precache.
            const opciones = { ignoreVary: true, ignoreSearch: true };
            const local = await caches.match(e.request, opciones);
            if (local) return local;
            for (const nombre of await caches.keys()) {
                const cache = await caches.open(nombre);
                const alternativa = await cache.match(e.request, opciones);
                if (alternativa) return alternativa;
            }
            return Response.error();
        })
    );
});
