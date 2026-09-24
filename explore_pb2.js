const os = require("os"), fs = require("fs"), path = require("path");
const home = os.homedir();
const desk = ["Desktop", "Escritorio"].map(d => path.join(home, d)).find(d => { try { return fs.statSync(d).isDirectory(); } catch (e) { return false; } });
const cands = fs.readdirSync(desk).filter(n => /^PMI_App/.test(n)).map(n => path.join(desk, n)).filter(p => fs.existsSync(path.join(p, "js", "panels", "scrum.js")));
cands.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
const base = cands[0];
console.log("BASE:", basepla);

function walkJs(d, out) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!/^(node_modules|.git|.codegraph|legacy|assets)$/.test(e.name)) walkJs(p, out); }
    else if (/\.js$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = walkJs(path.join(base, "js"), []);

console.log("===RENDER_FUNCIONES_SCURM===");
const scrumFile = path.join(base, "js", "panels", "scrum.js");
const scrumLines = fs.readFileSync(scrumFile, "utf8").split("\n");
scrumLines.forEach((l, i) => {
  const m = l.match(/^\s*function\s+(render[A-Za-z0-9_]*)\s*\(/);
  if (m) console.log("scrum.js l" + String(i + 1).padStart(4), "::", m[1]);
});

console.log("===FUNCIONES_*Backlog*===");
for (const f of files) {
  const rel = f.replace(base, "");
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/function\s+([A-Za-z0-9_]*(?:[Bb]acklog)[A-Za-z0-9_]*)\s*\(/g)) {
    console.log("FN", rel, "::", m[1]);
  }
}
