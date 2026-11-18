// test-login-local.cjs — prueba login en localhost
const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

    await page.goto('http://localhost:5199/index.html', { waitUntil: 'networkidle', timeout: 60000 });
    await page.fill('#loginEmail', 'a.alba.alarco@gmail.com');
    await page.fill('#loginPassword', 'TestPass_2026!');
    await page.click('#loginBtn');
    await page.waitForTimeout(8000);
    console.log('URL actual:', page.url());
    const errText = await page.locator('#loginError').innerText().catch(() => '');
    console.log('loginError visible:', await page.locator('#loginError').evaluate(el => getComputedStyle(el).display !== 'none' && el.classList.contains('show')).catch(() => 'n/a'));
    console.log('loginError texto:', (errText || '').trim().slice(0, 300));
    console.log('errores consola:', errors.slice(0, 8));
    await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });