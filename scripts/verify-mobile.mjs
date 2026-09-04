#!/usr/bin/env node
// scripts/verify-mobile.mjs
// Playwright mobile-verification harness for responsive layout checks.
// Launches headless Chromium, tests pages at mobile/tablet viewports,
// asserts no horizontal overflow, takes screenshots, writes console.txt.
//
// Env vars:
//   BASE_URL          – static server URL (default http://localhost:4173)
//   INJECT_OVERFLOW=1 – deterministic failure mode: injects a 5000px div
//                       into the first page before assertion
//
// Flags:
//   --container-selector <sel>  – measure overflow on this element instead
//                                 of <body> (default: body)

import { chromium } from "playwright";
import { spawn, execSync } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const PAGES = ["index.html", "dashboard.html", "proyecto.html"];
const VIEWPORTS = [375, 768];
const EVIDENCE_DIR = path.join(
  PROJECT_ROOT,
  ".omo",
  "evidence",
  "task-1-responsive-adaptacion-movil"
);

// ---------------------------------------------------------------------------
// CLI flag parsing
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = argv.slice(2);
  const result = { containerSelector: "body" };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--container-selector" && args[i + 1]) {
      result.containerSelector = args[++i];
    }
  }
  return result;
}

const opts = parseArgs(process.argv);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Check if something is listening on the given port. */
function isPortReachable(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const req = http.get({ host, port, timeout: 1500 }, () => {
      req.destroy();
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

/** Start a python3 static server and return the child process. */
function startStaticServer(port, root) {
  const child = spawn(
    "python3",
    ["-m", "http.server", String(port), "--directory", root],
    { stdio: "ignore", detached: true }
  );
  child.on("error", (err) => {
    console.error(`[server] Failed to start python3 http.server: ${err.message}`);
    process.exit(1);
  });
  return child;
}

/** Wait until the port is reachable (up to maxWait ms). */
async function waitForServer(port, maxWait = 10000) {
  const step = 300;
  let waited = 0;
  while (waited < maxWait) {
    if (await isPortReachable(port)) return true;
    await new Promise((r) => setTimeout(r, step));
    waited += step;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const injectOverflow = process.env.INJECT_OVERFLOW === "1";

  const base = new URL(process.env.BASE_URL || "http://localhost:4173");
  const port = parseInt(base.port, 10) || 4173;
  const baseUrl = base.origin;

  let serverProc = null;
  let ownServer = false;

  // --- Determine if we need to start our own server -----------------------
  try {
    const reachable = await isPortReachable(port);
    if (reachable) {
      console.log(`[harness] Server already reachable at ${baseUrl}`);
    } else {
      console.log(
        `[harness] No server on port ${port} — starting local static server...`
      );
      const serveRoot = fs.existsSync(path.join(PROJECT_ROOT, "dist"))
        ? path.join(PROJECT_ROOT, "dist")
        : PROJECT_ROOT;
      console.log(`[harness] Serving ${serveRoot}`);
      serverProc = startStaticServer(port, serveRoot);
      ownServer = true;

      const ready = await waitForServer(port);
      if (!ready) {
        console.error(
          `[harness] ERROR: Static server did not become reachable on port ${port}`
        );
        process.exit(1);
      }
      console.log(`[harness] Static server ready at ${baseUrl}`);
    }
  } catch (err) {
    console.error(`[harness] Server setup error: ${err.message}`);
    process.exit(1);
  }

  // --- Ensure evidence directory exists ------------------------------------
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

  // --- Launch browser & run tests ------------------------------------------
  let exitCode = 0;
  const failures = [];
  const results = [];

  let browser;
  try {
    browser = await chromium.launch({ headless: true });

    for (const page_name of PAGES) {
      const slug = page_name.replace(".html", "");

      for (const w of VIEWPORTS) {
        const label = `${slug}-${w}`;
        const screenshotPath = path.join(EVIDENCE_DIR, `${label}.png`);
        const pageUrl = `${baseUrl}/${page_name}`;

        console.log(`[harness] Testing ${label} @ ${pageUrl}`);

        const context = await browser.newContext({
          viewport: { width: w, height: 800 },
        });
        const page = await context.newPage();

        // Tolerate console errors (missing-session, supabase, etc.)
        page.on("pageerror", () => {});

        try {
          await page.goto(pageUrl, {
            waitUntil: "domcontentloaded",
            timeout: 15000,
          });
        } catch (err) {
          const msg = `NAVIGATION FAILED: ${label} — ${err.message}`;
          console.error(`[harness] ${msg}`);
          results.push({ label, pass: false, reason: msg });
          failures.push(label);
          exitCode = 1;
          await context.close();
          continue;
        }

        // Optional: inject overflow for failure test mode
        if (injectOverflow && page_name === PAGES[0] && w === VIEWPORTS[0]) {
          await page.evaluate(() => {
            const div = document.createElement("div");
            div.style.width = "5000px";
            div.style.height = "10px";
            div.id = "__overflow-inject";
            document.documentElement.appendChild(div);
          });
          console.log(`[harness] Injected 5000px overflow div into ${label}`);
        }

        // Wait a beat for layout to settle
        await page.waitForTimeout(500);

        // Assert no horizontal overflow on the target element.
        // Default: check document.documentElement (the page-level scroll container).
        // With --container-selector: check the queried element instead.
        const overflowData = await page.evaluate((selector) => {
          const el =
            selector === "body"
              ? document.documentElement
              : document.querySelector(selector) || document.documentElement;
          return {
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
            overflow: el.scrollWidth > el.clientWidth,
          };
        }, opts.containerSelector);

        const pass = !overflowData.overflow;
        const detail =
          `scrollWidth=${overflowData.scrollWidth} clientWidth=${overflowData.clientWidth}` +
          ` [${pass ? "PASS" : "FAIL"}]`;
        console.log(`[harness] ${label}: ${detail}`);
        results.push({
          label,
          pass,
          scrollWidth: overflowData.scrollWidth,
          clientWidth: overflowData.clientWidth,
          reason: pass ? null : `Horizontal overflow detected: ${detail}`,
        });

        if (!pass) {
          failures.push(label);
          exitCode = 1;
        }

        // Screenshot
        try {
          await page.screenshot({ path: screenshotPath, fullPage: true });
          console.log(`[harness] Screenshot saved: ${screenshotPath}`);
        } catch (err) {
          console.error(`[harness] Screenshot failed for ${label}: ${err.message}`);
        }

        await context.close();
      }
    }
  } finally {
    if (browser) await browser.close().catch(() => {});

    // Kill our own server
    if (ownServer && serverProc) {
      try {
        process.kill(-serverProc.pid, "SIGTERM");
      } catch {
        try { serverProc.kill("SIGTERM"); } catch { /* already dead */ }
      }
      console.log("[harness] Static server stopped.");
    }
  }

  // --- Write console.txt ---------------------------------------------------
  const consoleLines = results.map((r) => {
    const status = r.pass ? "PASS" : "FAIL";
    const val =
      r.scrollWidth !== undefined
        ? `scrollWidth=${r.scrollWidth} clientWidth=${r.clientWidth}`
        : r.reason || "";
    return `${r.label}: ${status} — ${val}`;
  });

  if (failures.length > 0) {
    consoleLines.push("");
    consoleLines.push("FAILURES:");
    for (const f of failures) {
      const r = results.find((x) => x.label === f);
      consoleLines.push(`  ${f}: ${r.reason}`);
    }
  }

  consoleLines.push("");
  consoleLines.push(
    `Summary: ${results.length} tests, ${results.length - failures.length} passed, ${failures.length} failed`
  );

  const consolePath = path.join(EVIDENCE_DIR, "console.txt");
  fs.writeFileSync(consolePath, consoleLines.join("\n") + "\n", "utf-8");
  console.log(`[harness] Console log written: ${consolePath}`);

  // --- Exit -----------------------------------------------------------------
  if (exitCode !== 0) {
    console.error(
      `[harness] FAILED: ${failures.length} page(s)/viewport(s) had horizontal overflow: ${failures.join(", ")}`
    );
  } else {
    console.log("[harness] ALL pages and viewports passed.");
  }

  process.exit(exitCode);
}

main().catch((err) => {
  console.error(`[harness] Fatal error: ${err.message}`);
  process.exit(1);
});
