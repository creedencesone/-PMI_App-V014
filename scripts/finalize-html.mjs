import fs from 'node:fs';
import path from 'node:path';

/**
 * Vite empaqueta los enlaces `design-system/tokens*.css` del dashboard y
 * termina descartando `tokens.css`.Este paso reinserta la fuente única de
 * tokens en el HTML desplegable, antes de los estilos compilados.
 */
const ROOT = process.cwd();
const VERSION = '20261120e';
const LINKS = [
    `<link rel="stylesheet" href="/design-system/tokens-shared.css?v=${VERSION}">`,
    `<link rel="stylesheet" href="/design-system/tokens.css?v=${VERSION}">`
].join('\n  ');

for (const nombre of ['dashboard.html', 'proyecto.html']) {
    const ruta = path.join(ROOT, 'dist', nombre);
    if (!fs.existsSync(ruta)) continue;
    let html = fs.readFileSync(ruta, 'utf8');
    // Evitar duplicar el par de tokens ya inyectado en ejecuciones previas.
    html = html.replace(/^\s*<link rel="stylesheet"[^>]*href="\/design-system\/tokens(?:-shared)?\.css[^"]*"[^>]*>\s*$/gmi, '');
    html = html.replace(/^\s*<link rel="stylesheet"[^>]*href="\/assets\/tokens-shared-[^"]+\.css"[^>]*>\s*$/gmi, '');
    const titulo = html.match(/<\/title>/i);
    if (!titulo) throw new Error(`Sin </title> en dist/${nombre}`);
    const punto = titulo.index + titulo[0].length;
    html = html.slice(0, punto) + `\n  ${LINKS}` + html.slice(punto);
    fs.writeFileSync(ruta, html);
    console.log(`Tokens restablecidos en dist/${nombre}`);
}
