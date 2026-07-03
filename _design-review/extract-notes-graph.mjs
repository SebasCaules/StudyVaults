// Standalone faithful re-implementation of site/app/graph.json/route.ts
// (notes/wikilinks graph). Reuses the REAL gray-matter from site/node_modules and
// mirrors lib/content/{discover,parse,slug,text,resolve-link}.ts + vaults.ts logic.
// Output: dataset JSON that can be regenerated any time from graph.json/route.ts.
//
// Run:  node extract-notes-graph.mjs > graph-notas-data.json
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const SITE = "/Users/sebastiancaules/Desktop/ITBA/StudyVaultsITBA/site";
const REPO_ROOT = path.resolve(SITE, "..");
const matter = require(path.join(SITE, "node_modules/gray-matter"));

// ---- VAULTS (from lib/content/vaults.ts) ----
const VAULTS = [
  { id: "mna", dir: "MNA", short: "MNA", name: "Métodos Numéricos Avanzados", contentRoot: "wiki", indexPath: "wiki/index.md" },
  { id: "derecho", dir: "Derecho", short: "Derecho", name: "Derecho para Ingenieros", contentRoot: "wiki", indexPath: "wiki/index.md" },
  { id: "economia", dir: "Economia", short: "Economía", name: "Economía para Ingenieros", contentRoot: "wiki", indexPath: "wiki/index.md" },
  { id: "proba", dir: "Proba", short: "Proba", name: "Probabilidad y Estadística", contentRoot: "wiki", indexPath: "wiki/index.md" },
  { id: "paw", dir: "PAW", short: "PAW", name: "Programación de Aplicaciones Web", contentRoot: "wiki", indexPath: "wiki/index.md" },
  { id: "sds", dir: "SDS", short: "SDS", name: "Simulación de Sistemas", contentRoot: "wiki", indexPath: "index.md" },
  { id: "inge2", dir: "Inge2", short: "Inge2", name: "Ingeniería del Software II", contentRoot: "wiki", indexPath: "wiki/index.md" },
];

// ---- slug.ts ----
const isIndexPath = (v, rel) => rel === v.indexPath;
function relPathToSlug(v, rel) {
  if (isIndexPath(v, rel)) return [];
  let p = rel.replace(/\.md$/i, "");
  const root = v.contentRoot ? `${v.contentRoot}/` : "";
  if (root && p.startsWith(root)) p = p.slice(root.length);
  return p.split("/").filter(Boolean);
}
const noteHref = (id, slug) => (slug.length ? `/${id}/${slug.join("/")}/` : `/${id}/`);
function humanize(b) {
  return b.replace(/^\d+[-_]/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---- text.ts (displayTitle) ----
const GREEK = { alpha:"α",beta:"β",gamma:"γ",delta:"δ",epsilon:"ε",theta:"θ",lambda:"λ",mu:"μ",pi:"π",sigma:"σ",phi:"φ",omega:"ω",Delta:"Δ",Sigma:"Σ",Omega:"Ω",rho:"ρ",tau:"τ" };
const BB = { C:"ℂ",R:"ℝ",K:"𝕂",N:"ℕ",Z:"ℤ",Q:"ℚ",P:"ℙ",E:"𝔼" };
const SUP = {"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹",n:"ⁿ",i:"ⁱ","+":"⁺","-":"⁻",T:"ᵀ"};
const SUB = {"0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉",n:"ₙ",i:"ᵢ",j:"ⱼ"};
function mathToText(tex) {
  let s = tex;
  s = s.replace(/\\mathbb\{([A-Z])\}/g, (_, c) => BB[c] || c);
  s = s.replace(/\\mathbb\s+([A-Z])/g, (_, c) => BB[c] || c);
  s = s.replace(/\\(mathbf|mathrm|mathcal|text|mathit)\{([^}]*)\}/g, "$2");
  s = s.replace(/\\([a-zA-Z]+)/g, (m, name) => GREEK[name] ?? "");
  s = s.replace(/\^\{([^}]*)\}/g, (_, g) => [...g].map((c) => SUP[c] ?? c).join(""));
  s = s.replace(/\^(.)/g, (_, c) => SUP[c] ?? `^${c}`);
  s = s.replace(/_\{([^}]*)\}/g, (_, g) => [...g].map((c) => SUB[c] ?? c).join(""));
  s = s.replace(/_(.)/g, (_, c) => SUB[c] ?? `_${c}`);
  s = s.replace(/[{}$]/g, "").replace(/\s+/g, " ").trim();
  return s;
}
function displayTitle(s) {
  if (!s.includes("$")) return s;
  return s.replace(/\$([^$]+)\$/g, (_, m) => mathToText(m)).replace(/\$/g, "");
}

// ---- discover.ts (glob **/*.md) ----
function walkMd(dir, base = "") {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === ".obsidian" || name === "node_modules") continue;
    const abs = path.join(dir, name);
    const rel = base ? `${base}/${name}` : name;
    const st = statSync(abs);
    if (st.isDirectory()) out.push(...walkMd(abs, rel));
    else if (/\.md$/i.test(name) && name !== "CLAUDE.md") out.push(rel);
  }
  return out;
}

// ---- parse.ts ----
function firstH1(body) {
  const m = body.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].replace(/[*_`]/g, "").trim() : undefined;
}
function pickFirst(fm, keys) {
  for (const k of keys) { const val = fm[k]; if (val != null && val !== "") return String(val); }
  return undefined;
}
function coerceArray(v) {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map((x) => String(x)).filter(Boolean);
  return [String(v)].filter(Boolean);
}
function lenientMatter(raw) {
  try { const r = matter(raw); return { data: r.data || {}, content: r.content }; }
  catch {
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!m) return { data: {}, content: raw };
    const fmText = m[1], content = m[2], data = {};
    const pick = (key) => { const mm = fmText.match(new RegExp(`^${key}\\s*:\\s*(.+)$`, "im")); return mm ? mm[1].trim().replace(/^["']|["']$/g, "") : undefined; };
    for (const k of ["title","titulo","type","tipo"]) { const v = pick(k); if (v) data[k] = v; }
    return { data, content };
  }
}
function parseNote(v, relPath, raw) {
  const { data: fm, content } = lenientMatter(raw);
  const basename = relPath.replace(/\.md$/i, "").split("/").pop() || relPath;
  const slug = relPathToSlug(v, relPath);
  const rawTitle = pickFirst(fm, ["title","titulo"]) || firstH1(content) || humanize(basename);
  const title = displayTitle(rawTitle);
  const aliases = coerceArray(fm.aliases);
  if (rawTitle !== title) aliases.push(rawTitle);
  return {
    vault: v.id, relPath, slug, href: noteHref(v.id, slug), basename,
    isIndex: isIndexPath(v, relPath), title, aliases, body: content,
  };
}

// ---- resolve-link.ts (note branch, intra-vault) ----
function normalizeJoin(baseDir, target) {
  const parts = `${baseDir}/${target}`.split("/"); const out = [];
  for (const seg of parts) { if (seg === "" || seg === ".") continue; if (seg === "..") out.pop(); else out.push(seg); }
  return out.join("/");
}
const IMG_RE = /\.(svg|png|jpe?g|gif|webp)$/i;
const DOC_RE = /\.pdf$/i;
function resolveNote(vault, idx, rawTarget, currentRelDir) {
  let target = rawTarget.trim().replace(/[#].*$/, "");
  try { target = decodeURIComponent(target); } catch {}
  if (!target) return null;
  if (IMG_RE.test(target) || DOC_RE.test(target)) return null; // asset, not a note edge
  const { relPathIndex, aliasIndex, basenameIndex, contentRoot } = idx;
  const tries = [`${contentRoot}${target}`, target, currentRelDir ? normalizeJoin(currentRelDir, target) : ""].filter(Boolean);
  for (const t of tries) { const hit = relPathIndex.get(t); if (hit) return hit; }
  const ali = aliasIndex.get(target.toLowerCase()); if (ali) return ali;
  const basename = target.split("/").pop() || target;
  const list = basenameIndex.get(basename);
  if (list && list.length) {
    if (list.length === 1) return list[0];
    const want = `${contentRoot}${target}`;
    return list.find((n) => n.relPath.replace(/\.md$/i, "") === want) ||
      list.find((n) => n.relPath.replace(/\.md$/i, "").endsWith(target)) || list[0];
  }
  return null;
}

// ---- vault colors (route.ts) ----
const HEX = { brown:"#241208", blue:"#92cff2", gray:"#a1a1aa", coral:"#f47c59", white:"#ffffff" };
function mix(a, b, pa) {
  const h = (x) => [1,3,5].map((i) => parseInt(x.slice(i, i+2), 16));
  const A = h(a), B = h(b), p = pa/100;
  return "#" + A.map((v, i) => Math.round(v*p + B[i]*(1-p)).toString(16).padStart(2,"0")).join("");
}
const BASE = {
  mna: HEX.blue,
  derecho: mix(HEX.coral, HEX.brown, 72),
  economia: mix(HEX.coral, HEX.blue, 58),
  proba: mix(HEX.blue, HEX.gray, 60),
  paw: mix(HEX.blue, HEX.gray, 52),
  sds: mix(HEX.coral, HEX.gray, 50),
  inge2: mix(HEX.gray, HEX.blue, 68),
};
const cDark = (v) => mix(BASE[v] ?? HEX.blue, HEX.white, 68);
const cLight = (v) => mix(BASE[v] ?? HEX.blue, HEX.brown, 48);

// ==== BUILD MANIFEST ====
const dirOf = (rel) => { const i = rel.lastIndexOf("/"); return i === -1 ? "" : rel.slice(0, i); };
const WIKILINK_RE = /(!?)\[\[([^\]|\n]+?)(?:\|([^\]\n]+?))?\]\]/g;

const allNotes = [];
const perVaultIdx = new Map(); // vaultId -> { relPathIndex, basenameIndex, aliasIndex, contentRoot }
for (const v of VAULTS) {
  const cwd = path.join(REPO_ROOT, v.dir);
  const files = walkMd(cwd).sort();
  const relPathIndex = new Map(), basenameIndex = new Map(), aliasIndex = new Map();
  const contentRoot = v.contentRoot ? `${v.contentRoot}/` : "";
  for (const relPath of files) {
    const raw = readFileSync(path.join(cwd, relPath), "utf8");
    const note = parseNote(v, relPath, raw);
    allNotes.push(note);
    relPathIndex.set(note.relPath.replace(/\.md$/i, ""), note);
    const list = basenameIndex.get(note.basename) ?? []; list.push(note); basenameIndex.set(note.basename, list);
    for (const key of [note.basename, note.title, ...note.aliases]) {
      const k = String(key).trim().toLowerCase();
      if (k && !aliasIndex.has(k)) aliasIndex.set(k, note);
    }
  }
  perVaultIdx.set(v.id, { relPathIndex, basenameIndex, aliasIndex, contentRoot });
}

// ==== NODES (filter: not index, not readme/audit_report/log) ====
const notes = allNotes.filter((n) => !n.isIndex && !/^(readme|audit_report|log)$/i.test(n.basename));
const nodes = notes.map((n) => ({
  u: n.href, v: n.vault, t: n.title,
  s: n.slug.length > 1 ? n.slug[0] : "general",
  deg: 0,
}));
const byId = new Map(nodes.map((n) => [n.u, n]));

// ==== LINKS (intra-vault wikilinks, undirected dedupe) ====
const seen = new Set();
const linkPairs = [];
for (const note of notes) {
  const idx = perVaultIdx.get(note.vault);
  const dir = dirOf(note.relPath);
  let mm; WIKILINK_RE.lastIndex = 0;
  while ((mm = WIKILINK_RE.exec(note.body))) {
    const res = resolveNote(note.vault, idx, mm[2].trim(), dir);
    if (!res) continue;
    const to = res.href;
    if (to === note.href) continue;
    if (!byId.has(to)) continue; // target filtered out (index/readme)
    const key = note.href < to ? `${note.href}|${to}` : `${to}|${note.href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    linkPairs.push([note.href, to]);
    byId.get(note.href).deg++; byId.get(to).deg++;
  }
}

// index remap
const nodeIndex = new Map(nodes.map((n, i) => [n.u, i]));
const links = linkPairs.map(([a, b]) => [nodeIndex.get(a), nodeIndex.get(b)]);

const out = {
  _regen: "Regenerable from site/app/graph.json/route.ts — this mirrors its notes/wikilinks logic.",
  vaults: VAULTS.map((v) => ({ id: v.id, short: v.short, name: v.name, base: BASE[v.id], cDark: cDark(v.id), cLight: cLight(v.id) })),
  nodes: nodes.map((n) => ({ v: n.v, t: n.t, s: n.s, deg: n.deg })),
  links,
};

// stats to stderr
const perVault = {};
for (const n of nodes) perVault[n.v] = (perVault[n.v] || 0) + 1;
const isolated = nodes.filter((n) => n.deg === 0).length;
process.stderr.write(`nodes=${nodes.length} links=${links.length} isolated=${isolated}\n`);
process.stderr.write(`per-vault nodes: ${JSON.stringify(perVault)}\n`);
process.stderr.write(`vault colors:\n`);
for (const v of VAULTS) process.stderr.write(`  ${v.id}: base=${BASE[v.id]} dark=${cDark(v.id)} light=${cLight(v.id)}\n`);

process.stdout.write(JSON.stringify(out));
