import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

/** Verifica que dashboard y proyecto arranquen sin red tras el primer arranque. */
const ROOT = process.cwd();
const PORT = Number(process.env.OFFLINE_PORT || 5198);
const BASE = `http://127.0.0.1:${PORT}`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe']
});
let log = '';
server.stdout.on('data', d => { log += d.toString(); });
server.stderr.on('data', d => { log += d.toString(); });

async function esperar() {
    for (let i = 0; i < 80; i++) {
        try { if ((await fetch(BASE)).ok) return; } catch { /* arranca */ }
        await new Promise(r => setTimeout(r, 250));
    }
    throw new Error(`Preview no respondió: ${log.slice(-600)}`);
}

let fallos = 0;
try {
    await esperar();
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(() => {
        // Sin administrador implícito, el banco de pruebas siembra una cuenta
        // demo válida con el hash PBKDF2 conocido antes de restaurar la sesión.
        localStorage.setItem('pmi_usuarios_v3', JSON.stringify([{
            id: 'admin_001', email: 'admin@pmi.app',
            password: 'pbkdf2$100000$a1b2c3d4e5f60718293a4b5c6d7e8f90$a4dae039e7b33674370afadb7b953cbc1c2388c2cae22e9fb21debf0046afea2',
            nombre: 'Administrador', role: 'admin', nivel: 100, active: true,
            permisos: {}, proyectosAsignados: [], permisosProyectos: {}
        }]));
        localStorage.setItem('pmi_sesion_v3', JSON.stringify({ userId: 'admin_001', email: 'admin@pmi.app', role: 'admin', nivel: 100, timestamp: Date.now() }));
    });
    const page = await ctx.newPage();
    const fallosRed = [];
    // El fallback de DataService prueba dos variantes del dynamic import: la
    // cancelación de la primera es esperada, igual que las llamadas a Supabase
    // cuando el navegador está deliberadamente sin red.
    page.on('requestfailed', r => {
        const url = r.url();
        if (/supabaseClient\.(entry|bundle)\.js/.test(url) || /supabase\.co/.test(url)) return;
        fallosRed.push(`${url.replace(BASE, '')} :: ${r.failure()?.errorText}`);
    });
    await page.goto(`${BASE}/dashboard.html`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(async () => {
        if (navigator.serviceWorker) await navigator.serviceWorker.ready;
    });
    await page.waitForTimeout(1200);
    const registrado = await page.evaluate(() => !!navigator.serviceWorker?.controller);
    const diagnostico = await page.evaluate(async () => {
        const keys = await caches.keys();
        const cache = await caches.open(keys[0]);
        const objetos = await cache.keys();
        return { keys, total: objetos.length, tieneCss: objetos.some(r => /\.css(\?|$)/.test(r.url)) };
    });
    console.log('[offline] diagnóstico inicial', diagnostico);
    if (!registrado) throw new Error('Service worker no controla la página');

    await ctx.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const dashboardEstado = await page.evaluate(() => ({
        titulo: document.title,
        contenido: !!document.querySelector('#main-content'),
        secciones: document.querySelectorAll('#main-content section, #main-content .stat-card, #main-content .kpi-card').length,
        texto: document.body.innerText.slice(0, 120)
    }));
    console.log('[offline] dashboard:', dashboardEstado);
    const dashboardOk = dashboardEstado.titulo.includes('PMI Mind') && dashboardEstado.contenido && dashboardEstado.texto.includes('Administrador');
    await page.goto(`${BASE}/proyecto.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    const proyectoOk = await page.evaluate(() => document.querySelectorAll('.panel[id^="panel"]').length >= 38);
    console.log(`[offline] serviceWorker=${registrado} dashboard=${dashboardOk} proyecto=${proyectoOk}`);
    if (fallosRed.length) console.log('  fallos de red:', [...new Set(fallosRed)].slice(0, 12));
    fallos += (dashboardOk ? 0 : 1) + (proyectoOk ? 0 : 1);
    await browser.close();
} catch (error) {
    fallos++;
    console.error('[offline] Error:', error.message);
} finally {
    server.kill('SIGTERM');
}
if (fallos) process.exit(1);
console.log('Offline: OK');
