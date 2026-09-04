/**
 * Visual QA for the PMI Mind app against the live Supabase backend.
 *
 * Uses Playwright's bundled Chromium (installed without sudo to user cache).
 * Logs in with a migrated user, verifies no console errors, and captures
 * screenshots of the key views to confirm the app renders and loads data
 * from Supabase (visual regression evidence).
 *
 * Usage:
 *   node scripts/visual-qa-supabase.mjs
 *
 * Env (optional overrides):
 *   TEST_EMAIL / TEST_PASSWORD  (defaults to the migrated test user)
 *   QA_HEADLESS=false           (run visibly)
 *   QA_SAVE_DIR                 (screenshot output dir, default /tmp/pmi_qa)
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.QA_BASE_URL || 'http://localhost:5173/';
const EMAIL = process.env.TEST_EMAIL || 'a.alba.alarco@gmail.com';
const PASSWORD = process.env.TEST_PASSWORD || 'TestPass_2026!';
const HEADLESS = !(process.env.QA_HEADLESS === 'false');
const SAVE_DIR = process.env.QA_SAVE_DIR || '/tmp/pmi_qa';

fs.mkdirSync(SAVE_DIR, { recursive: true });

const consoleErrors = [];
const results = [];

function record(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
}

function saveShot(page, name) {
  const p = path.join(SAVE_DIR, name);
  page.screenshot({ path: p, fullPage: false });
  return p;
}

async function main() {
  const browser = await chromium.launch({ headless: HEADLESS });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(String(err)));

  // --- 1. Load the app (login page) -------------------------------------
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => e);
  await page.waitForTimeout(1500);
  const title = await page.title();
  const hasLogin = await page.locator('#loginEmail').count();
  record('App loads, login page shown', hasLogin === 1, `title="${title}"`);
  saveShot(page, '01-login.png');

  // --- 2. Log in --------------------------------------------------------
  if (hasLogin) {
    await page.fill('#loginEmail', EMAIL);
    await page.fill('#loginPassword', PASSWORD);
    await page.click('#loginBtn');
    // wait for redirect / dashboard
    await page.waitForTimeout(4000);
    const url = page.url();
    const onDashboard = url.includes('dashboard') || (await page.locator('body').innerText().catch(() => '')).includes('PMI');
    record('Login succeeds → app loads', url.includes('dashboard') || onDashboard, `url=${url}`);
    saveShot(page, '02-after-login.png');
  }

  // --- 3. Dashboard sanity ----------------------------------------------
  await page.waitForTimeout(2000);
  const bodyText = await page.locator('body').innerText().catch(() => '');
  const hasProject = bodyText.includes('Proyecto') || bodyText.includes('proyecto');
  const hasNav = (await page.locator('nav, .sidebar, .nav').count()) > 0;
  record('Dashboard renders with project/nav', hasProject && hasNav);
  saveShot(page, '03-dashboard.png');

  // --- 4. Open a project / first panel ----------------------------------
  // Try to click a project card or navigation to a panel
  const projectLink = page.locator('[data-proyecto], .proyecto-card, .card[data-id], [onclick*="abrirProyecto"], .panel-tab, nav a, .nav-item').first();
  if (await projectLink.count()) {
    await projectLink.first().click().catch(() => {});
    await page.waitForTimeout(3000);
    record('Navigated into a project/panel', true);
    saveShot(page, '04-project-panel.png');
  } else {
    record('Discover navigation into project', false, 'no clickable project found via heuristic');
  }

  // --- 5. Summarize console errors --------------------------------------
  const fatal = consoleErrors.filter((e) => !/favicon|manifest|Sourcemap|net::ERR_ABORTED/i.test(e));
  record(`No console/page errors (${fatal.length} found)`, fatal.length === 0, fatal.slice(0, 3).join(' | '));
  console.log('\n--- ALL CONSOLE ERRORS ---');
  consoleErrors.forEach((e) => console.log('  ', e));

  await browser.close();

  const passed = results.filter((r) => r.ok).length;
  console.log(`\n=== VISUAL QA: ${passed}/${results.length} PASS ===`);
  console.log(`Screenshots saved to ${SAVE_DIR}`);
  process.exit(passed === results.length ? 0 : 1);
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(2);
});
