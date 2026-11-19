import { chromium } from 'playwright';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

/**
 * Regresiones de accesibilidad y teclado sobre los 36 paneles, en claro y oscuro.
 * Arranca un servidor Vite efímero para que `npm test` sea autocontenido.
 */
const ROOT = process.cwd();
const PORT = Number(process.env.QA_PORT || 5197);
const BASE = `http://127.0.0.1:${PORT}`;
const AXE = fs.readFileSync(`${ROOT}/node_modules/axe-core/axe.min.js`, 'utf8');
const CHROME = (process.env.CHROME_BIN || '');

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe']
});
let serverLog = '';
server.stdout.on('data', d => { serverLog += d.toString(); });
server.stderr.on('data', d => { serverLog += d.toString(); });

async function esperarServidor() {
    for (let i = 0; i < 80; i++) {
        try {
            const r = await fetch(BASE);
            if (r.ok) return;
        } catch { /* todavía arranca */ }
        await new Promise(resolve => setTimeout(resolve, 250));
    }
    throw new Error(`Vite no respondió en ${BASE}\n${serverLog.slice(-800)}`);
}

const initScript = (theme) => {
    const admin = { id: 'admin_001', email: 'admin@pmi.app', nombre: 'QA', role: 'admin', nivel: 100, active: true, proyectosAsignados: [], permisosProyectos: {}, permisos: { ver: true, editar: true, eliminar: true, gestionarUsuarios: true, gestionarProyectos: true, exportarDatos: true, configurarSistema: true, acciones: {} } };
    localStorage.setItem('pmi_usuarios_v3', JSON.stringify([admin]));
    localStorage.setItem('pmi_sesion_v3', JSON.stringify({ userId: 'admin_001', email: 'admin@pmi.app', role: 'admin', nivel: 100, timestamp: Date.now() }));
    localStorage.setItem('pmi_theme', theme);
};

const bloquearRed = r => /supabase\.co|frankfurter|er-api|exchangerate|fonts\.googleapis|fonts\.gstatic/.test(r.request().url()) ? r.abort() : r.continue();

async function prepararPagina(browser, theme, viewport = { width: 1440, height: 900 }) {
    const ctx = await browser.newContext({ viewport });
    await ctx.route('**/*', bloquearRed);
    await ctx.addInitScript(initScript, theme);
    const page = await ctx.newPage();
    const errores = [];
    page.on('pageerror', e => errores.push(e.message));
    page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errores.push(m.text()); });
    await page.goto(`${BASE}/dashboard.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.readyState === 'complete' && typeof window.seedProyectosDemo === 'function' && typeof window.guardarProyectosStorage === 'function', null, { timeout: 15000 });
    await page.evaluate(() => { const d = seedProyectosDemo(); guardarProyectosStorage(d); localStorage.setItem('proyectoSeleccionado', String(d[0].id)); });
    await page.goto(`${BASE}/proyecto.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof window.mostrarPanel === 'function' && document.querySelectorAll('.panel[id^="panel"]').length >= 38, null, { timeout: 15000 });
    return { ctx, page, errores };
}

async function auditarAccesibilidad(browser, theme) {
    const { ctx, page, errores } = await prepararPagina(browser, theme);
    await page.addScriptTag({ content: AXE });
    await page.waitForFunction(() => typeof window.axe === 'object' && typeof window.axe.run === 'function', null, { timeout: 15000 });
    const paneles = await page.evaluate(() => [...document.querySelectorAll('.panel[id^="panel"]')].map(p => p.id.slice(5)));
    const violaciones = new Map();
    let sinNombre = 0;
    for (const id of paneles) {
        await page.evaluate(p => { if (typeof mostrarPanel === 'function') mostrarPanel(p); }, id);
        await page.waitForFunction(p => {
            const activo = document.getElementById('panel' + p);
            return activo && activo.classList.contains('active');
        }, id, { timeout: 5000 });
        // El color del nav cambia con una transición de 200 ms: medir axe a
        // mitad de la transición daba color-contrast falso en el tema claro.
        await page.waitForFunction(() => ![...document.querySelectorAll('.nav-header.active')]
            .some(n => n.getAnimations().some(a => a.playState === 'running')));
        await page.waitForFunction(() => !document.querySelector('.panel.active')?.getAnimations({ subtree: true })
            .some(a => a.playState === 'running' && a.effect?.getTiming().iterations !== Infinity));
        // El toast (fuera del panel) también tiene animación de fade: esperar a
        // que termine para que axe no mida un color中途 de la transición.
        await page.waitForFunction(() => !document.querySelector('#toast')?.getAnimations({ subtree: true })
            .some(a => a.playState === 'running'));
        let res = null;
        for (let intento = 0; intento < 3 && !res; intento++) {
            res = await page.evaluate(async () => {
                if (!window.axe || typeof window.axe.run !== 'function') return null;
                // El toast es una notificación transitoria con fade (opacity
                // 0→1→0): axe mide un color intermediate y da falso positivo de
                // color-contrast. Se excluye del contexto del barrido.
                return await window.axe.run({ include: [document], exclude: [['#toast']] }, {
                    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
                    resultTypes: ['violations']
                });
            });
            if (!res) {
                await page.addScriptTag({ content: AXE });
                await page.waitForFunction(() => typeof window.axe === 'object' && typeof window.axe.run === 'function', null, { timeout: 15000 });
            }
        }
        if (!res) throw new Error('axe-core no disponible tras 3 intentos');
        for (const v of res.violations) {
            if (!violaciones.has(v.id)) violaciones.set(v.id, { impacto: v.impact, ayuda: v.help, nodos: 0, paneles: [], ejemplos: [] });
            const item = violaciones.get(v.id);
            item.nodos += v.nodes.length;
            item.paneles.push(id);
            for (const n of v.nodes) {
                if (item.ejemplos.length >= 4) break;
                item.ejemplos.push(`${id}: ${n.target.join(' ')}`);
            }
        }
        sinNombre += await page.evaluate(() => {
            const activo = document.querySelector('.panel.active');
            if (!activo) return 0;
            const sel = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
            return [...activo.querySelectorAll(sel)].filter(e => e.getClientRects().length)
                .filter(e => !e.getAttribute('aria-label') && !e.textContent.trim() && !e.labels?.length && !e.getAttribute('title')).length;
        });
    }
    // Barrido nativo a 390 px: axe ignora nodos display:none, por lo que
    // redimensionar un escritorio no cubre el móvil real ni sus 38 paneles.
    const anadir = (resultado, etiqueta) => {
        for (const v of resultado.violations) {
            if (!violaciones.has(v.id)) violaciones.set(v.id, { impacto: v.impact, ayuda: v.help, nodos: 0, paneles: [], ejemplos: [] });
            const item = violaciones.get(v.id);
            item.nodos += v.nodes.length;
            item.paneles.push(etiqueta);
            for (const n of v.nodes) {
                if (item.ejemplos.length >= 4) break;
                item.ejemplos.push(`${etiqueta}: ${n.target.join(' ')} · ${String(n.failureSummary || '').replace(/\n/g, ' ').slice(0, 240)}`);
            }
        }
    };
    await ctx.close();
    const movil = await prepararPagina(browser, theme, { width: 390, height: 844 });
    errores.push(...movil.errores);
    const mp = movil.page;
    await mp.addScriptTag({ content: AXE });
    await mp.waitForFunction(() => typeof window.axe === 'object' && typeof window.axe.run === 'function', null, { timeout: 15000 });
    for (const id of paneles) {
        await mp.evaluate(p => { if (typeof mostrarPanel === 'function') mostrarPanel(p); }, id);
        await mp.waitForFunction(p => {
            const activo = document.getElementById('panel' + p);
            return activo && activo.classList.contains('active');
        }, id, { timeout: 5000 });
        await mp.waitForFunction(() => ![...document.querySelectorAll('.nav-header.active')]
            .some(n => n.getAnimations().some(a => a.playState === 'running')));
        await mp.waitForFunction(() => !document.querySelector('.panel.active')?.getAnimations({ subtree: true })
            .some(a => a.playState === 'running' && a.effect?.getTiming().iterations !== Infinity));
        let res = null;
        for (let intento = 0; intento < 3 && !res; intento++) {
            res = await mp.evaluate(async () => {
                if (!window.axe || typeof window.axe.run !== 'function') return null;
                // El toast es una notificación transitoria con fade (opacity
                // 0→1→0): axe mide un color intermediate y da falso positivo de
                // color-contrast. Se excluye del contexto del barrido.
                return await window.axe.run({ include: [document], exclude: [['#toast']] }, {
                    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
                    resultTypes: ['violations']
                });
            });
            if (!res) {
                await mp.addScriptTag({ content: AXE });
                await mp.waitForFunction(() => typeof window.axe === 'object' && typeof window.axe.run === 'function', null, { timeout: 15000 });
            }
        }
        if (!res) throw new Error('axe-core no disponible en 390px tras 3 intentos');
        anadir(res, '390:' + id);
    }
    // Además, con un submenú desplegado (donde antes aparecía aria-allowed-attr).
    await mp.evaluate(() => {
        document.querySelectorAll('.nav-group').forEach(g => { g.style.display = ''; });
        const disparador = document.querySelector('.nav-header[data-submenu]');
        const id = disparador?.getAttribute('data-submenu');
        const submenu = id ? document.querySelector('.submenu[data-submenu="' + id + '"]') : null;
        if (disparador && submenu && !submenu.classList.contains('show')) disparador.click();
    });
    await mp.waitForFunction(() => [...document.querySelectorAll('.submenu.show')].some(s => s.getClientRects().length > 0));
    anadir(await mp.evaluate(async () => await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
        resultTypes: ['violations']
    })), '390px/submenu');
    await movil.ctx.close();
    return { tema: theme, paneles: paneles.length, violaciones: [...violaciones.entries()], sinNombre, errores: [...new Set(errores)] };
}

async function auditarTeclado(browser) {
    const { ctx, page } = await prepararPagina(browser, 'dark');
    const paneles = await page.evaluate(() => [...document.querySelectorAll('.panel[id^="panel"]')].map(p => p.id.slice(5)));
    const problemas = [];
    let pasos = 0;
    for (const id of paneles) {
        const listo = await page.evaluate(p => {
            mostrarPanel(p);
            const panel = document.querySelector('.panel.active');
            if (!panel) return false;
            const sel = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
            const ctrls = [...panel.querySelectorAll(sel)].filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden');
            if (!ctrls.length) return false;
            ctrls[0].focus();
            return true;
        }, id);
        if (!listo) continue;
        for (let i = 0; i < 5; i++) {
            await page.keyboard.press('Tab');
            pasos++;
            const sinOutline = await page.evaluate(() => {
                const e = document.activeElement;
                if (!e || e === document.body) return false;
                // Los inputs de fecha ceden el foco a segmentos internos del selector:
                // el host ya no está :focus y no es un problema de outline de la app.
                if (!e.matches(':focus')) return false;
                const cs = getComputedStyle(e);
                return cs.outlineStyle === 'none' || cs.outlineWidth === '0px';
            });
            if (sinOutline) {
                const detalle = await page.evaluate(() => {
                    const e = document.activeElement;
                    return e ? `${e.tagName}#${e.id}.${String(e.className).slice(0, 60)}` : 'sin elemento';
                });
                problemas.push(`${id} → ${detalle}`);
            }
        }
    }
    const noEnfocables = await page.evaluate(() => {
        const nativos = new Set(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'SUMMARY']);
        let total = 0;
        for (const panel of document.querySelectorAll('.panel[id^="panel"]')) {
            total += [...panel.querySelectorAll('[onclick]')].filter(e => e.getClientRects().length && !nativos.has(e.tagName) && e.tabIndex < 0).length;
        }
        return total;
    });
    await ctx.close();
    return { paneles: paneles.length, pasos, problemas: [...new Set(problemas)], noEnfocables };
}

async function verificarModulosCargados(browser) {
    const { ctx, page } = await prepararPagina(browser, 'dark');
    const modulos = await page.evaluate(() => ({
        csv: typeof window.parsearCSV,
        whatif: typeof window.simularEscenariosCompresion,
        calendario: typeof window.esDiaNoLaboral,
        uiCalendario: typeof window.abrirModalCalendarioLaboral,
        evm: typeof window.calcularModeloEVM,
        cpm: typeof window.ejecutarCPM
    }));
    await ctx.close();
    return modulos;
}

let fallos = 0;
try {
    await esperarServidor();
    const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
    for (const theme of ['dark', 'light']) {
        const r = await auditarAccesibilidad(browser, theme);
        console.log(`[axe ${r.tema}] paneles=${r.paneles} violaciones=${r.violaciones.length} sinNombre=${r.sinNombre} errores=${r.errores.length}`, r.errores);
        for (const [id, v] of r.violaciones.slice(0, 12)) {
            console.log(`  ${v.impacto} ${id} x${v.nodos} · ${v.ayuda}`);
            for (const e of v.ejemplos) console.log(`    ${e}`);
        }
        fallos += r.violaciones.length + r.sinNombre + r.errores.length;
    }
    const teclado = await auditarTeclado(browser);
    console.log(`[teclado] paneles=${teclado.paneles} pasosTab=${teclado.pasos} sinOutline=${teclado.problemas.length} onclickNoEnfocables=${teclado.noEnfocables}`, teclado.problemas);
    fallos += teclado.problemas.length + teclado.noEnfocables;
    const modulos = await verificarModulosCargados(browser);
    const ausentes = Object.entries(modulos).filter(([, tipo]) => tipo !== 'function').map(([nombre]) => nombre);
    console.log('[módulos]', modulos, 'ausentes=', ausentes);
    fallos += ausentes.length;
    await browser.close();
} catch (error) {
    fallos++;
    console.error('[QA] Error:', error.message);
} finally {
    server.kill('SIGTERM');
}

if (fallos > 0) {
    console.error(`QA regresiones: ${fallos} hallazgo(s)`);
    process.exit(1);
}
console.log('QA regresiones: OK');
