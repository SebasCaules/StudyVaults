#!/usr/bin/env node
/* ============================================================================
   StudyVaults · Texture Pack — installer
   Instala los snippets en una o en TODAS las vaults de Obsidian, infiriendo si
   la vault es multi-materia (scope por carpeta con cssclasses) o mono-materia
   (una variante aplicada a toda la vault, sin tocar contenido).

   Uso:
     node install.mjs                          instala en la vault raíz del repo
     node install.mjs --vault <ruta>           instala en una vault puntual
     node install.mjs --all --root <ruta>      descubre e instala en TODAS las
                                                vaults bajo <ruta> (default ~/Desktop/ITBA)
     node install.mjs --variant <disc>         fuerza una variante a toda la vault
                                                (exactas|sistemas|economicas|derecho)
     node install.mjs --theme default          además pone el tema base de Obsidian
     node install.mjs --stamp                  (solo multi) marca cssclasses por carpeta
     node install.mjs --stamp --only MNA       stampea sólo esa(s) carpeta(s)
     node install.mjs --uninstall              quita snippets y los deshabilita
     node install.mjs --all --root <r> --uninstall   desinstala de todas

   Idempotente. Nunca toca contenido salvo con --stamp (solo vaults multi).
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");

const BASE = "sv-base.css";
const VARIANTS = ["sv-exactas.css","sv-sistemas.css","sv-economicas.css","sv-derecho.css"];
const ALL_SNIPPETS = [BASE, ...VARIANTS, "sv-vault.css"];        // para cleanup/uninstall
const nameOf = (f) => f.replace(/\.css$/,"");
const THEME_NAME = "StudyVaults";
const THEME_FILES = ["manifest.json","theme.css"];

/* carpeta de materia (vault multi) -> disciplina */
const DISCIPLINE = {
  MNA:"exactas", Proba:"exactas", Economia:"economicas", Derecho:"derecho",
  PAW:"sistemas", SDS:"sistemas", Inge2:"sistemas",
};
/* substring del nombre de la vault (vault mono) -> disciplina */
const SUBJECT_KEYS = Object.entries(DISCIPLINE).map(([k,v]) => [k.toLowerCase(), v]);

/* -------- args -------- */
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt  = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i+1] : null; };
const log = (...a) => console.log("·", ...a);

/* ---------------------------------------------------------------- helpers -- */
function discoverVaults(root){
  const found = [];
  (function walk(d, depth){
    if (depth > 5) return;
    let ents; try { ents = fs.readdirSync(d, { withFileTypes:true }); } catch { return; }
    if (ents.some(e => e.isDirectory() && e.name === ".obsidian")) found.push(d);
    for (const e of ents){
      if (!e.isDirectory()) continue;
      if (e.name === ".obsidian" || e.name === "node_modules" || e.name === ".git") continue;
      if (e.name.endsWith(".worktrees")) continue;            // worktrees transitorios
      walk(path.join(d, e.name), depth + 1);
    }
  })(root, 0);
  return found;
}

function isMulti(vaultDir){
  let n = 0;
  for (const sub of Object.keys(DISCIPLINE))
    if (fs.existsSync(path.join(vaultDir, sub))) n++;
  return n >= 2;
}

function inferVariant(vaultDir){
  const base = path.basename(vaultDir).toLowerCase();
  for (const [key, disc] of SUBJECT_KEYS) if (base.includes(key)) return disc;
  return null;
}

/* variante scoped -> variante para TODA la vault (saca el .sv-<disc>) */
function vaultWideCss(disc){
  const src = fs.readFileSync(path.join(HERE, `sv-${disc}.css`), "utf8");
  return `/* GENERADO por install.mjs — variante '${disc}' aplicada a toda la vault */\n`
       + src.replaceAll(`.sv-${disc}`, "");
}

function readAppearance(appJson){
  return fs.existsSync(appJson) ? JSON.parse(fs.readFileSync(appJson, "utf8")) : {};
}

/* stamp de cssclasses (solo vaults multi) — respeta frontmatter existente */
function stampFile(file, cls){
  let src = fs.readFileSync(file, "utf8");
  const cssline = `  - ${cls}`;
  if (src.startsWith("---\n")) {
    const end = src.indexOf("\n---", 4);
    if (end === -1) return false;
    let fm = src.slice(4, end);
    if (new RegExp(`(^|\\n)\\s*(-\\s*)?${cls}(\\s|$)`).test(fm)) return false;
    const m = fm.match(/(^|\n)cssclasses:[ \t]*(.*)/);
    if (m) {
      const val = m[2].trim();
      if (val.startsWith("[")) {
        const items = val.replace(/^\[|\]$/g, "").split(",").map(s => s.trim()).filter(Boolean);
        if (items.includes(cls)) return false;
        items.push(cls);
        fm = fm.replace(/(^|\n)cssclasses:[ \t]*.*/, `$1cssclasses: [${items.join(", ")}]`);
      } else if (val) {
        if (val === cls) return false;
        fm = fm.replace(/(^|\n)cssclasses:[ \t]*.*/, `$1cssclasses:\n  - ${val}\n${cssline}`);
      } else {
        fm = fm.replace(/(^|\n)(cssclasses:[ \t]*\n)/, `$1$2${cssline}\n`);
      }
    } else {
      fm = `cssclasses:\n${cssline}\n` + fm;
    }
    src = "---\n" + fm + src.slice(end);
  } else {
    src = `---\ncssclasses:\n${cssline}\n---\n\n` + src;
  }
  fs.writeFileSync(file, src);
  return true;
}

function listMd(dir){
  const out = [];
  (function walk(d){
    for (const e of fs.readdirSync(d, { withFileTypes:true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (e.name !== ".obsidian" && e.name !== "node_modules") walk(p); }
      else if (e.name.endsWith(".md")) out.push(p);
    }
  })(dir);
  return out;
}

/* ------------------------------------------------------------- install 1x -- */
function installVault(vaultDir, { forceVariant, theme, keepTheme, doStamp, onlyDirs, uninstall }){
  const obsidian = path.join(vaultDir, ".obsidian");
  const snipDir  = path.join(obsidian, "snippets");
  const appJson  = path.join(obsidian, "appearance.json");
  const label = vaultDir.replace(os.homedir(), "~");

  if (!fs.existsSync(obsidian)) { console.error("  ✗ sin .obsidian:", label); return; }
  fs.mkdirSync(snipDir, { recursive:true });
  const app = readAppearance(appJson);
  const enabled = new Set(app.enabledCssSnippets || []);

  if (uninstall) {
    for (const f of ALL_SNIPPETS) { const p = path.join(snipDir, f); if (fs.existsSync(p)) fs.rmSync(p); }
    for (const f of ALL_SNIPPETS) enabled.delete(nameOf(f));
    const tdir = path.join(obsidian, "themes", THEME_NAME);
    if (fs.existsSync(tdir)) fs.rmSync(tdir, { recursive:true, force:true });
    if (app.cssTheme === THEME_NAME) app.cssTheme = "";
    app.enabledCssSnippets = [...enabled];
    fs.writeFileSync(appJson, JSON.stringify(app, null, 2));
    log(`desinstalado (theme + snippets) · ${label}`);
    return;
  }

  // limpiar nuestros snippets previos (para poder cambiar de modo limpio)
  for (const f of ALL_SNIPPETS) { const p = path.join(snipDir, f); if (fs.existsSync(p)) fs.rmSync(p); enabled.delete(nameOf(f)); }

  // modo
  let mode, variant = null;
  if (forceVariant) { mode = "mono"; variant = forceVariant; }
  else if (isMulti(vaultDir)) { mode = "multi"; }
  else { variant = inferVariant(vaultDir); mode = variant ? "mono" : "base"; }

  // instalar el THEME (chrome completo + contenido base de la nota)
  const tdir = path.join(obsidian, "themes", THEME_NAME);
  fs.mkdirSync(tdir, { recursive:true });
  for (const f of THEME_FILES) fs.copyFileSync(path.join(HERE, "theme", f), path.join(tdir, f));
  if (!keepTheme) app.cssTheme = THEME_NAME;

  if (mode === "multi") {
    for (const f of VARIANTS) { fs.copyFileSync(path.join(HERE, f), path.join(snipDir, f)); enabled.add(nameOf(f)); }
  } else if (mode === "mono") {
    fs.writeFileSync(path.join(snipDir, "sv-vault.css"), vaultWideCss(variant));
    enabled.add("sv-vault");
  }

  app.enabledCssSnippets = [...enabled];
  fs.writeFileSync(appJson, JSON.stringify(app, null, 2));
  log(`${label}  →  theme:${app.cssTheme||"(sin cambiar)"} · ${mode}${variant ? " ("+variant+")" : ""}`);

  if (doStamp && mode === "multi") {
    let n = 0;
    for (const [dir, cls] of Object.entries(DISCIPLINE)) {
      if (onlyDirs && !onlyDirs.includes(dir)) continue;
      const b = path.join(vaultDir, dir);
      if (fs.existsSync(b)) for (const f of listMd(b)) if (stampFile(f, `sv-${cls}`)) n++;
    }
    log(`   stamp: ${n} notas marcadas`);
  }
}

/* --------------------------------------------------------------- main ------ */
const common = {
  forceVariant: opt("--variant"),
  theme: opt("--theme"),
  keepTheme: flag("--keep-theme"),
  doStamp: flag("--stamp"),
  onlyDirs: opt("--only") ? opt("--only").split(",").map(s => s.trim()) : null,
  uninstall: flag("--uninstall"),
};

if (flag("--all")) {
  const root = path.resolve(opt("--root") || path.join(os.homedir(), "Desktop", "ITBA"));
  const vaults = discoverVaults(root);
  log(`descubiertas ${vaults.length} vaults bajo ${root.replace(os.homedir(),"~")}`);
  for (const v of vaults) installVault(v, common);
} else {
  installVault(path.resolve(opt("--vault") || REPO), common);
}
log("listo.");
