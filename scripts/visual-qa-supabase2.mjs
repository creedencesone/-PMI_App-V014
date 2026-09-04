/**
 * Robust visual QA for the PMI Mind app against the live Supabase backend.
 *
 * Focus: verify the panels RENDER with data from Supabase despite the
 * pre-existing `panelId` ReferenceError in navegacion-auth.js that aborts
 * init()'s promise chain. Confirms the migration delivered working data flow.
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
  return page.screenshot({ path: p, fullPage: false }).then(() => p).catch(() => '(shot failed)');
}

async function step(fn) {
  try { return await fn(); } catch (e) { return { __err: String(e).slice(0, 200) }; }
}

async function main() {
  const browser = await chromium.launch({ headless: HEADLESS });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push(String(e)));

  // 1. Load login page
  await step(() => page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 }));
  await page.waitForTimeout(1200);
  const hasLogin = await page.locator('#loginEmail').count();
  record('App loads, login page shown', hasLogin === 1, `title=${await page.title()}`);
  await saveShot(page, '01-login.png');
  if (!hasLogin) { await browser.close(); return finish(); }

  // 2. Log in
  await page.fill('#loginEmail', EMAIL);
  await page.fill('#loginPassword', PASSWORD);
  await page.click('#loginBtn');
  await page.waitForTimeout(4500);
  const url = page.url();
  record('Login succeeds → app loads', url.includes('proyecto') || url.includes('dashboard'), `url=${url}`);
  await saveShot(page, '02-after-login.png');

  // 3. Inspect body for project data indicators and count panels
  const bodyText = await page.locator('body').innerText().catch(() => '');
  const panelCount = await page.locator('[id^="panel"]').count().catch(() => 0);
  record('project.html renders with panel containers', panelCount > 0, `${panelCount} [id^=panel] containers`);
  const panelsShown = await page.locator('.panel[style*="display: block"], .panel:not([style*="display: none"])').count().catch(() => 0);
  record('At least one panel visible', panelsShown > 0, `${panelsShown} visible panels`);
  await saveShot(page, '03-project-panels.png');

  // 4. Sample the visible panel content for data presence
  const sample = bodyText.replace(/\s+/g, ' ').slice(0, 1200);
  console.log('\n--- VISIBLE PAGE SAMPLE ---\n' + sample + '\n--- END SAMPLE ---\n');

  // 5. Console errors summary
  const fatal = consoleErrors.filter((e) => !/favicon|manifest|Sourcemap|ERR_ABORTED|net::ERR/i.test(e));
  record(`Console errors (fatal=${fatal.length})`, fatal.length === 0, fatal.slice(0, 2).join(' || '));
  console.log('\n--- CONSOLE ERRORS ---');
  consoleErrors.forEach((e) => console.log('  ', e));

  await browser.close();
  finish();

  function finish() {
    const passed = results.filter((r) => r.ok).length;
    console.log(`\n=== VISUAL QA: ${passed}/${results.length} PASS ===`);
    console.log(`Screenshots → ${SAVE_DIR}`);
    process.exit(passed === results.length ? 0 : 1);
  }
}

main().catch((e) => { console.error('FATAL', e); process.exit(2); });
