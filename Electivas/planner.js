/* =========================================================================
   Plan de Estudios · ITBA Informática — lógica
   ========================================================================= */
const P = window.PLAN;
const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const DAYS6 = [...DAYS, "Sábado"];
const AREA_COLOR = {
  "Ciencia de Datos": "#85a2c2",
  "Imágenes y Realidad Virtual": "#c592ab",
  "Inteligencia Artificial": "#a9b27e",
  "Arquitectura de Software": "#a497c0",
};
const PALETTE = ["#8ba0b8", "#c2a878", "#9bb083", "#c592ab", "#a497c0", "#7fa0bf", "#b9956a", "#8aa17e", "#a9b27e", "#bfa0b0", "#9aa9c4", "#c7b27e"];
const CAP = 600;

const state = {
  view: "cuatri",
  approved: new Set(),
  combo: new Set(),
  fixedCom: new Map(),
  areasOn: new Set(P.areas),
  search: "",
  fOblig: true, fElec: true, fDisp: false, fHor: false,
  comboParams: { allowOverlap: false, modal: { Presencial: true, Virtual: true, Blended: true } },
  combos: [], comboIdx: 0,
  plan: { pool: new Set(), fixed: new Map(), start: { parity: 2, year: 2026 }, maxCred: 18, maxMat: 5, avoid: true, result: null },
};
const byId = new Map();
let net = null;

/* ---------- modelo ---------- */
function buildModel() {
  [...P.obligatorias, ...P.electivas].forEach(m => byId.set(m.codigo, { ...m, horario: P.horarios[m.codigo] || null }));
}
const credOf = c => Number((byId.get(c) || {}).creditos) || 0;
const isElectiva = c => (byId.get(c) || {}).tipo === "electiva";
const abbrOf = c => (byId.get(c) || {}).abbr || c;
const hasHorario = c => { const m = byId.get(c); return m && m.horario && m.horario.comisiones.length; };
const remainingOblig = () => P.obligatorias.filter(m => !state.approved.has(m.codigo)).map(m => m.codigo);
// prioridad de cursada: obligatorias › mayor requisito de créditos › más créditos › código
const planPriority = (a, b) => (a.tipo === b.tipo ? 0 : a.tipo === "obligatoria" ? -1 : 1) || ((b.creditosReq || 0) - (a.creditosReq || 0)) || ((b.creditos || 0) - (a.creditos || 0)) || a.codigo.localeCompare(b.codigo);
// empaquetado (FFD por créditos) para minimizar cuatrimestres
const packSort = (a, b) => ((b.creditos || 0) - (a.creditos || 0)) || (a.tipo === b.tipo ? 0 : a.tipo === "obligatoria" ? -1 : 1) || ((b.creditosReq || 0) - (a.creditosReq || 0)) || a.codigo.localeCompare(b.codigo);

/* ---------- persistencia ---------- */
function load() {
  try {
    state.approved = new Set(JSON.parse(localStorage.getItem("plan_aprobadas_v3") || "null") || P.aprobadasDefault);
    state.combo = new Set(JSON.parse(localStorage.getItem("plan_combo_v3") || "[]"));
    const pool = JSON.parse(localStorage.getItem("plan_pool_v3") || "null");
    state.plan.pool = new Set(pool || remainingOblig());
    state.plan.fixed = new Map(JSON.parse(localStorage.getItem("plan_fixed_v3") || "[]"));
  } catch { state.approved = new Set(P.aprobadasDefault); state.plan.pool = new Set(remainingOblig()); }
}
const saveApproved = () => localStorage.setItem("plan_aprobadas_v3", JSON.stringify([...state.approved]));
const saveCombo = () => localStorage.setItem("plan_combo_v3", JSON.stringify([...state.combo]));
const savePlan = () => { localStorage.setItem("plan_pool_v3", JSON.stringify([...state.plan.pool])); localStorage.setItem("plan_fixed_v3", JSON.stringify([...state.plan.fixed])); };

/* ---------- métricas ---------- */
const approvedCredits = () => { let s = 0; state.approved.forEach(c => s += credOf(c)); return s; };
const electiveCredits = () => { let s = 0; state.approved.forEach(c => { if (isElectiva(c)) s += credOf(c); }); return s; };
function isAvailable(m) {
  if (state.approved.has(m.codigo)) return false;
  if ((Number(m.creditosReq) || 0) > approvedCredits()) return false;
  return (m.correlativas || []).every(c => state.approved.has(c));
}

/* ---------- tiempo / modalidad ---------- */
const toMin = h => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };
const isAsync = s => s.async || /asincr/i.test(s.aula || "");
function comModalidad(com) {
  const m = com.slots.filter(s => !isAsync(s)).map(s => s.modalidad).filter(Boolean);
  if (!m.length) return "Asincrónico";
  const c = {}; m.forEach(x => c[x] = (c[x] || 0) + 1);
  return Object.keys(c).sort((a, b) => c[b] - c[a])[0];
}
function slotsConflict(a, b) { return a.dia === b.dia && toMin(a.desde) < toMin(b.hasta) && toMin(b.desde) < toMin(a.hasta); }
function comConflict(ca, cb) {
  const A = ca.slots.filter(s => !isAsync(s)), B = cb.slots.filter(s => !isAsync(s));
  for (const x of A) for (const y of B) if (slotsConflict(x, y)) return true;
  return false;
}
const salaLabel = s => s.sala || (isAsync(s) ? "asincr." : (s.modalidad === "Virtual" ? "virtual" : (s.modalidad || "")));

/* =========================================================================
   INIT
   ========================================================================= */
function applyTheme(t) {
  if (t === "dark") document.documentElement.setAttribute("data-theme", "dark");
  else document.documentElement.removeAttribute("data-theme");
  document.querySelectorAll("#themeToggle button").forEach(b => b.classList.toggle("on", b.dataset.set === t));
  localStorage.setItem("plan_theme", t);
  if (net) { try { net.destroy(); } catch (e) {} net = null; if (state.view === "grafo") renderGraph(); }
}

async function downloadPNG(node, filename) {
  if (!node) return;
  if (typeof html2canvas === "undefined") { window.print(); return; }
  const bg = getComputedStyle(document.body).backgroundColor;
  try {
    const canvas = await html2canvas(node, { backgroundColor: bg, scale: 2, logging: false, ignoreElements: el => el.classList && el.classList.contains("icon-btn") });
    const a = document.createElement("a"); a.href = canvas.toDataURL("image/png"); a.download = filename; a.click();
  } catch (e) { console.error("descarga", e); window.print(); }
}

function applySidebar(collapsed) {
  document.body.classList.toggle("side-collapsed", collapsed);
  localStorage.setItem("plan_sidebar", collapsed ? "1" : "0");
  if (net) { try { net.destroy(); } catch (e) {} net = null; if (state.view === "grafo") renderGraph(); }
}

function init() {
  buildModel(); load();
  renderAreas(); renderMinorSkeleton(); buildStartOptions(); bindUI();
  applyTheme(localStorage.getItem("plan_theme") || "light");
  applySidebar(localStorage.getItem("plan_sidebar") === "1");
  setView("cuatri"); renderAll();
}
function renderAll() {
  renderCuatri(); renderElect(); renderCombinadorPickers(); renderPlanPool();
  updateMetrics(); updateComboBar();
}

/* =========================================================================
   SIDEBAR
   ========================================================================= */
function renderAreas() {
  const el = document.getElementById("areaList"); el.innerHTML = "";
  P.areas.forEach(a => {
    const b = document.createElement("button"); b.className = "area-pill";
    b.innerHTML = `<span class="swatch" style="background:${AREA_COLOR[a]}"></span>${a}`;
    b.onclick = () => { if (state.areasOn.has(a)) { state.areasOn.delete(a); b.classList.add("off"); } else { state.areasOn.add(a); b.classList.remove("off"); } renderElect(); };
    el.appendChild(b);
  });
}
function renderMinorSkeleton() {
  const el = document.getElementById("minorList"); el.innerHTML = "";
  P.areas.forEach(a => {
    const d = document.createElement("div"); d.className = "minor";
    d.innerHTML = `<div class="minor__top"><span>${a}</span><b data-mt="${a}">0/14</b></div><div class="minibar"><i data-mb="${a}" style="background:${AREA_COLOR[a]}"></i></div>`;
    el.appendChild(d);
  });
}
function updateMetrics() {
  const ac = approvedCredits(), ec = electiveCredits();
  document.getElementById("statCreditos").textContent = ac;
  document.getElementById("statElec").textContent = Math.min(ec, 27);
  document.getElementById("statDisp").textContent = [...byId.values()].filter(isAvailable).length;
  document.getElementById("statRestan").textContent = P.obligatorias.filter(m => !state.approved.has(m.codigo)).length;
  document.getElementById("elecBar").style.width = Math.min(100, ec / 27 * 100) + "%";
  document.getElementById("elecTxt").textContent = `${ec} / 27` + (ec >= 27 ? " · completo" : "");
  P.areas.forEach(a => {
    let s = 0; state.approved.forEach(c => { const m = byId.get(c); if (m && m.tipo === "electiva" && (m.areas || []).includes(a)) s += credOf(c); });
    document.querySelector(`[data-mt="${a}"]`).textContent = `${s}/14`;
    document.querySelector(`[data-mb="${a}"]`).style.width = Math.min(100, s / 14 * 100) + "%";
  });
}

/* =========================================================================
   VIEWS
   ========================================================================= */
function setView(v) {
  state.view = v;
  document.querySelectorAll(".view").forEach(b => b.classList.toggle("is-active", b.dataset.view === v));
  ["cuatri", "elect", "combo", "plan", "grafo", "ref"].forEach(id => document.getElementById("panel-" + id).classList.toggle("hidden", id !== v));
  if (v === "grafo") renderGraph();
  if (v === "ref") renderRef();
  if (v === "plan" && !state.plan.result) optimizePlan();
}
const passSearch = m => !state.search || (m.codigo + " " + m.nombre + " " + m.abbr).toLowerCase().includes(state.search);

/* =========================================================================
   PLAN POR CUATRIMESTRE
   ========================================================================= */
function renderCuatri() {
  const host = document.getElementById("cuatriBody"); host.innerHTML = "";
  let list = P.obligatorias.filter(passSearch);
  if (state.fDisp) list = list.filter(m => isAvailable(m) || state.approved.has(m.codigo));
  if (state.fHor) list = list.filter(m => hasHorario(m.codigo));
  const groups = {}; list.forEach(m => { (groups[`${m.anio}.${m.cuatri}`] ||= []).push(m); });
  const keys = Object.keys(groups).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (!keys.length) { host.innerHTML = `<div class="empty">No hay obligatorias que cumplan los filtros.</div>`; return; }
  keys.forEach(k => {
    const ms = groups[k].sort((a, b) => a.codigo.localeCompare(b.codigo)); const [anio, cuatri] = k.split(".");
    const aprob = ms.filter(m => state.approved.has(m.codigo)).length;
    const col = document.createElement("div"); col.className = "qcol";
    col.innerHTML = `<div class="qcol__h"><div><div class="ciclo">${ms[0].ciclo}</div><h3>Año ${anio} · ${cuatri}.º cuat.</h3></div><div class="qc">${aprob}/${ms.length}</div></div><div class="qcol__body"></div>`;
    const body = col.querySelector(".qcol__body"); ms.forEach(m => body.appendChild(qcard(m))); host.appendChild(col);
  });
}
function qcard(m) {
  const appr = state.approved.has(m.codigo), avail = isAvailable(m), locked = !appr && !avail;
  const d = document.createElement("div"); d.className = "qcard" + (appr ? " appr" : "") + (locked ? " locked" : "");
  d.innerHTML = `<div class="qcard__top"><span class="code">${m.codigo} · ${m.abbr}</span><span class="card__cred">${m.creditos} cr${hasHorario(m.codigo) ? " ·" : ""}${hasHorario(m.codigo) ? '<span class="hor-dot"></span>' : ""}</span></div>
    <p class="qcard__n">${m.nombre}</p>
    <div class="qcard__f"><label><input type="checkbox" class="chk-ap" ${appr ? "checked" : ""}> aprobada</label>${locked ? '<span class="tag tag--lock">requisitos</span>' : (appr ? "" : '<span class="tag tag--ok">cursable</span>')}</div>`;
  d.querySelector(".chk-ap").onchange = e => { e.stopPropagation(); toggleApproved(m.codigo); };
  d.onclick = e => { if (!e.target.closest("label")) openDrawer(m.codigo); };
  return d;
}

/* =========================================================================
   ELECTIVAS
   ========================================================================= */
function renderElect() {
  const host = document.getElementById("electBody"); host.innerHTML = "";
  let list = P.electivas.filter(passSearch).filter(m => { const a = m.areas || []; return !a.length || a.some(x => state.areasOn.has(x)); });
  if (state.fDisp) list = list.filter(isAvailable);
  if (state.fHor) list = list.filter(m => hasHorario(m.codigo));
  list.sort((a, b) => a.codigo.localeCompare(b.codigo));
  if (!list.length) { host.innerHTML = `<div class="empty">Ninguna electiva cumple los filtros.</div>`; return; }
  list.forEach(m => host.appendChild(electCard(m)));
}
function electCard(m) {
  const appr = state.approved.has(m.codigo), avail = isAvailable(m), inCombo = state.combo.has(m.codigo), hor = hasHorario(m.codigo);
  const d = document.createElement("article"); d.className = "card t-electiva" + (appr ? " appr" : "");
  const areaTags = (m.areas || []).map(a => `<span class="tag tag--area" style="background:${AREA_COLOR[a]}">${a.split(" ")[0]}</span>`).join("");
  d.innerHTML = `<div class="card__top"><span class="code">${m.codigo}</span><span class="card__cred">${m.creditos} cr</span></div>
    <span class="card__abbr">${m.abbr}</span>
    <h3 class="card__name">${m.nombre}</h3>
    <div class="card__meta">${areaTags}${hor ? '<span class="tag tag--hor">horario</span>' : ""}${!appr ? (avail ? '<span class="tag tag--ok">disponible</span>' : '<span class="tag tag--lock">requisitos</span>') : ""}</div>
    <div class="card__acts"><button class="mini btn-ap ${appr ? "on" : ""}">${appr ? "aprobada ✓" : "aprobada"}</button><button class="mini btn-co ${inCombo ? "on plan" : ""}" ${hor ? "" : "disabled"}>${inCombo ? "combinar ✓" : "combinar"}</button></div>`;
  d.querySelector(".btn-ap").onclick = e => { e.stopPropagation(); toggleApproved(m.codigo); };
  const co = d.querySelector(".btn-co"); if (hor) co.onclick = e => { e.stopPropagation(); toggleCombo(m.codigo); };
  d.onclick = e => { if (!e.target.closest("button")) openDrawer(m.codigo); };
  return d;
}

/* ---------- toggles ---------- */
function toggleApproved(c) { state.approved.has(c) ? state.approved.delete(c) : state.approved.add(c); saveApproved(); renderAll(); }
function toggleCombo(c) { state.combo.has(c) ? state.combo.delete(c) : state.combo.add(c); saveCombo(); renderElect(); renderCombinadorPickers(); updateComboBar(); }

/* =========================================================================
   DRAWER
   ========================================================================= */
const modalTag = mod => `<span class="dr-modal">${mod || "—"}</span>`;
function openDrawer(code) {
  const m = byId.get(code); if (!m) return;
  const ob = m.tipo === "obligatoria", appr = state.approved.has(code), avail = isAvailable(m), hor = m.horario;
  const areaTags = (m.areas || []).map(a => `<span class="tag tag--area" style="background:${AREA_COLOR[a]}">${a}</span>`).join("") || '<span class="muted">—</span>';
  const corr = (m.correlativas || []).map(c => { const cm = byId.get(c), ok = state.approved.has(c); return `<span class="tag" style="${ok ? "color:var(--sage);border-color:rgba(155,176,131,.3)" : "color:var(--muted)"}">${c} ${cm ? cm.abbr : ""} ${ok ? "✓" : ""}</span>`; }).join("") || '<span class="muted">Sin correlativas</span>';
  let horHtml = '<p class="muted">Sin horario publicado para 1C 2026.</p>';
  if (hor && hor.comisiones.length) horHtml = hor.comisiones.map(cm => `<div class="dr-com"><div class="dr-com__h"><b>Comisión ${cm.comision}</b><span class="dr-com__cupo">${cm.cupo}</span></div>${cm.slots.map(s => `<div class="dr-slot"><span class="d">${s.dia}</span><span class="h">${s.desde}–${s.hasta}</span><span class="au">${s.sala ? "Aula " + s.sala : ""}${s.sede ? " · " + s.sede : ""}</span>${modalTag(s.modalidad)}</div>`).join("")}${cm.profesores ? `<div class="muted" style="font-size:11px;margin-top:7px">${cm.profesores}</div>` : ""}</div>`).join("");
  document.getElementById("drawerPanel").innerHTML = `<button class="dr-close" id="drClose">×</button>
    <span class="dr-code ${ob ? "ob" : ""}">${m.codigo} · ${m.abbr}</span>
    <h3 class="dr-title">${m.nombre}</h3>
    <p class="dr-sub">${ob ? `Obligatoria · ${m.ciclo} · Año ${m.anio} (${m.cuatri}.º cuat.)` : "Electiva"} · ${m.creditos} créditos${m.creditosReq ? ` · requiere ${m.creditosReq}` : ""}${hor ? ` · ${hor.depto}` : ""}</p>
    <div class="dr-x"><button class="mini btn-ap ${appr ? "on" : ""}">${appr ? "aprobada ✓" : "marcar aprobada"}</button>${hor && hor.comisiones.length ? `<button class="mini btn-co ${state.combo.has(code) ? "on plan" : ""}">${state.combo.has(code) ? "en combinador ✓" : "al combinador"}</button>` : ""}</div>
    ${ob ? "" : `<div class="dr-sec"><h4>Áreas · Minor</h4><div class="dr-chips">${areaTags}</div></div>`}
    <div class="dr-sec"><h4>Correlativas</h4><div class="dr-chips">${corr}</div></div>
    <div class="dr-sec"><h4>Horario 1C 2026 ${avail && !appr ? '<span class="tag tag--ok" style="margin-left:6px">disponible</span>' : ""}</h4>${horHtml}</div>`;
  document.getElementById("drawer").classList.add("open");
  document.getElementById("drClose").onclick = closeDrawer;
  document.getElementById("drawerBg").onclick = closeDrawer;
  document.querySelector("#drawerPanel .btn-ap").onclick = () => { toggleApproved(code); openDrawer(code); };
  const dco = document.querySelector("#drawerPanel .btn-co"); if (dco) dco.onclick = () => { toggleCombo(code); openDrawer(code); };
}
const closeDrawer = () => document.getElementById("drawer").classList.remove("open");

/* =========================================================================
   GRILLA SEMANAL (compartida)
   ========================================================================= */
function renderWeek(blocks, opts = {}) {
  const days = opts.days || DAYS, compact = opts.compact, PX = compact ? 0.5 : 0.86;
  let minM = (compact ? 8 : 8) * 60, maxM = 22 * 60;
  blocks.forEach(b => { minM = Math.min(minM, toMin(b.desde)); maxM = Math.max(maxM, toMin(b.hasta)); });
  minM = Math.floor(minM / 60) * 60; maxM = Math.ceil(maxM / 60) * 60;
  const colTpl = `${compact ? 40 : 54}px repeat(${days.length}, 1fr)`;
  let head = `<div class="ghead"></div>` + days.map(d => `<div class="ghead">${d.slice(0, 3)}</div>`).join("");
  let timeCol = ""; for (let t = minM; t < maxM; t += 60) timeCol += `<div class="gtime" style="height:${60 * PX}px">${String(t / 60).padStart(2, "0")}:00</div>`;
  let cols = `<div style="position:relative">${timeCol}</div>`;
  days.forEach(day => {
    let cells = ""; for (let t = minM; t < maxM; t += 60) cells += `<div class="gcell" style="height:${60 * PX}px"></div>`;
    const dayB = blocks.filter(b => b.dia === day).map(b => {
      const top = (toMin(b.desde) - minM) * PX, h = (toMin(b.hasta) - toMin(b.desde)) * PX;
      return `<div class="gblock${b.conf ? " conf" : ""}" style="top:${top}px;height:${h}px;background:${b.color}" title="${b.nombre} · ${b.modalidad || ""} ${b.sala || ""}">
        <b>${b.abbr}${b.sala ? " " + b.sala : ""}</b>${compact ? "" : `<span class="gb-n">${b.nombre}</span>`}<span class="gb-h">${b.desde}–${b.hasta}</span></div>`;
    }).join("");
    cols += `<div class="gcol">${cells}<div style="position:absolute;inset:0">${dayB}</div></div>`;
  });
  return `<div class="gtable" style="grid-template-columns:${colTpl}">${head}</div><div class="gtable" style="grid-template-columns:${colTpl}">${cols}</div>`;
}
function legendHTML(entries) {
  return entries.map(e => `<div class="lg"><span class="sw" style="background:${e.color}"></span><b>${e.abbr}</b><span>${e.nombre}</span></div>`).join("");
}

/* =========================================================================
   COMBINADOR
   ========================================================================= */
function comisionesFor(code) {
  const m = byId.get(code); if (!m || !m.horario) return [];
  let coms = m.horario.comisiones;
  const fx = state.fixedCom.get(code);
  if (fx) { const f = coms.filter(c => c.comision === fx); if (f.length) coms = f; }
  const mod = state.comboParams.modal;
  const filt = coms.filter(c => { const cm = comModalidad(c); return cm === "Asincrónico" || mod[cm] !== false; });
  return filt.length ? filt : coms;
}
function renderCombinadorPickers() {
  const mk = (m) => {
    const sel = state.combo.has(m.codigo); const coms = (m.horario || {}).comisiones || [];
    const it = document.createElement("div"); it.className = "pick-item" + (sel ? " sel" : "");
    let inner = `<label style="display:flex;align-items:center;gap:10px;flex:1;cursor:pointer;overflow:hidden"><input type="checkbox" ${sel ? "checked" : ""}><span class="pc">${m.codigo}</span><span class="pn">${m.abbr} — ${m.nombre}</span></label><span class="px">${m.creditos}cr</span>`;
    it.innerHTML = inner;
    it.querySelector("input").onchange = () => toggleCombo(m.codigo);
    if (sel && coms.length > 1) {
      const wrap = document.createElement("div"); wrap.style.cssText = "flex-basis:100%;padding:4px 0 2px 25px";
      const s = document.createElement("select"); s.style.cssText = "background:var(--panel-3);border:1px solid var(--line);color:var(--ink-soft);border-radius:3px;padding:3px 6px;font-family:var(--f-m);font-size:10.5px";
      s.innerHTML = `<option value="">Comisión: auto</option>` + coms.map(c => `<option value="${c.comision}" ${state.fixedCom.get(m.codigo) === c.comision ? "selected" : ""}>Com ${c.comision} · ${comModalidad(c)}</option>`).join("");
      s.onchange = () => { if (s.value) state.fixedCom.set(m.codigo, s.value); else state.fixedCom.delete(m.codigo); };
      wrap.appendChild(s); it.appendChild(wrap); it.style.flexWrap = "wrap";
    }
    return it;
  };
  const ob = document.getElementById("pickOblig"), el = document.getElementById("pickElec");
  ob.innerHTML = ""; el.innerHTML = "";
  const obs = P.obligatorias.filter(m => hasHorario(m.codigo) && !state.approved.has(m.codigo)).sort((a, b) => a.codigo.localeCompare(b.codigo));
  const els = P.electivas.filter(m => hasHorario(m.codigo) && !state.approved.has(m.codigo)).sort((a, b) => a.codigo.localeCompare(b.codigo));
  obs.forEach(m => ob.appendChild(mk(byId.get(m.codigo))));
  els.forEach(m => el.appendChild(mk(byId.get(m.codigo))));
  document.getElementById("cntOb").textContent = obs.length;
  document.getElementById("cntEl").textContent = els.length;
}
function updateComboBar() {
  const sel = [...state.combo].filter(hasHorario);
  const cred = sel.reduce((s, c) => s + credOf(c), 0), elc = sel.filter(isElectiva).reduce((s, c) => s + credOf(c), 0);
  document.getElementById("comboSel").innerHTML = sel.length ? `<b>${sel.length}</b> materias · <b>${cred}</b> créditos${elc ? ` (${elc} electivos)` : ""}` : "Sin materias seleccionadas.";
  document.getElementById("comboGen").disabled = sel.length === 0;
}
function generateCombos() {
  const sel = [...state.combo].filter(hasHorario).sort();
  const mats = sel.map(c => ({ codigo: c, m: byId.get(c), coms: comisionesFor(c) }));
  const allow = state.comboParams.allowOverlap;
  state.combos = []; const chosen = []; let truncated = false;
  (function bt(i) {
    if (state.combos.length >= CAP) { truncated = true; return; }
    if (i === mats.length) { state.combos.push(chosen.slice()); return; }
    for (const com of mats[i].coms) {
      if (!allow) { let ok = true; for (const p of chosen) if (comConflict(p.com, com)) { ok = false; break; } if (!ok) continue; }
      chosen.push({ codigo: mats[i].codigo, m: mats[i].m, com }); bt(i + 1); chosen.pop();
      if (state.combos.length >= CAP) { truncated = true; return; }
    }
  })(0);
  state.comboIdx = 0;
  const status = document.getElementById("comboStatus"), nav = document.getElementById("comboNav"), legend = document.getElementById("comboLegend");
  legend.innerHTML = "";
  if (!mats.length) { status.innerHTML = ""; nav.classList.add("hidden"); document.getElementById("grid").className = "grid"; return; }
  if (state.combos.length) {
    const word = allow ? "combinaciones (con superposiciones permitidas)" : "cursadas sin superposición";
    status.innerHTML = `<span class="pill ${allow ? "warn" : "ok"}">${state.combos.length}${truncated ? "+" : ""} ${word}</span><span class="muted">${mats.length} materias · ${mats.reduce((s, x) => s + (x.m.creditos || 0), 0)} créditos</span>`;
    buildNav(); renderGrid();
  } else {
    nav.classList.add("hidden"); document.getElementById("grid").className = "grid";
    const pairs = [];
    for (let i = 0; i < mats.length; i++) for (let j = i + 1; j < mats.length; j++)
      if (mats[i].coms.every(ci => mats[j].coms.every(cj => comConflict(ci, cj)))) pairs.push([mats[i].m, mats[j].m]);
    status.innerHTML = `<span class="pill bad">Sin cursada sin superposición</span><span class="muted">Activá “permitir superposiciones” o quitá materias.</span><div class="conflict-list">${pairs.map(([a, b]) => `<div class="conflict">${a.abbr} · ${a.nombre} ⨯ ${b.abbr} · ${b.nombre}</div>`).join("")}</div>`;
  }
}
function buildNav() {
  const nav = document.getElementById("comboNav"); nav.classList.remove("hidden");
  nav.innerHTML = `<button id="cnPrev">‹</button><span class="cn-txt">Opción <b>${state.comboIdx + 1}</b> / ${state.combos.length}${state.combos.length >= CAP ? "+" : ""}</span><button id="cnNext">›</button>`;
  document.getElementById("cnPrev").onclick = () => { state.comboIdx = (state.comboIdx - 1 + state.combos.length) % state.combos.length; buildNav(); renderGrid(); };
  document.getElementById("cnNext").onclick = () => { state.comboIdx = (state.comboIdx + 1) % state.combos.length; buildNav(); renderGrid(); };
}
function renderGrid() {
  const grid = document.getElementById("grid"), combo = state.combos[state.comboIdx];
  const blocks = [], asyncs = [], seenB = new Set(); const entries = [];
  combo.forEach((x, i) => {
    const color = PALETTE[i % PALETTE.length]; entries.push({ abbr: x.m.abbr, nombre: `${x.m.nombre} (com ${x.com.comision})`, color });
    x.com.slots.forEach(s => {
      const key = x.codigo + s.dia + s.desde + s.hasta;
      if (isAsync(s) || !DAYS6.includes(s.dia)) asyncs.push({ ...s, abbr: x.m.abbr, color });
      else { if (seenB.has(key)) return; seenB.add(key); blocks.push({ ...s, abbr: x.m.abbr, nombre: x.m.nombre, color }); }
    });
  });
  // marcar conflictos entre bloques del combo
  blocks.forEach(a => { a.conf = blocks.some(b => b !== a && slotsConflict(a, b)); });
  grid.className = "grid show";
  grid.innerHTML = renderWeek(blocks, { days: DAYS6 }) +
    (asyncs.length ? `<div class="async-row"><span class="lbl">Asincrónico / otros</span>${asyncs.map(a => `<span class="async-chip" style="border-left:3px solid ${a.color}">${a.abbr} · ${a.dia} ${a.desde}–${a.hasta}${a.sala ? " · " + a.sala : ""}</span>`).join("")}</div>` : "");
  document.getElementById("comboLegend").innerHTML = legendHTML(entries);
}

/* =========================================================================
   PLAN DE CURSADA (optimizador multi-cuatrimestre)
   ========================================================================= */
const cuatriAt = (start, i) => { let p = start.parity, y = start.year; for (let k = 0; k < i; k++) { if (p === 2) { p = 1; y++; } else p = 2; } return { parity: p, year: y }; };
const cuatriLabel = c => (c.parity === 1 ? "1c" : "2c") + "-" + String(c.year).slice(-2);
const cuatriName = c => (c.parity === 1 ? "1.º" : "2.º") + " cuat. " + c.year;
const repCom = m => (m.horario && m.horario.comisiones[0]) || null;

function buildStartOptions() {
  const sel = document.getElementById("pcStart"); sel.innerHTML = "";
  for (let i = 0; i < 6; i++) { const c = cuatriAt({ parity: 2, year: 2026 }, i); const o = document.createElement("option"); o.value = c.parity + "-" + c.year; o.textContent = cuatriName(c); sel.appendChild(o); }
  sel.value = state.plan.start.parity + "-" + state.plan.start.year;
}
function optimizePlan() {
  const PL = state.plan;
  const mats = [...PL.pool].filter(c => !state.approved.has(c)).map(c => byId.get(c)).filter(Boolean);
  const N = 14, items = Array.from({ length: N }, () => []), placedIdx = {};
  let acc = approvedCredits(); const accBefore = [];
  let remaining = mats.slice();
  const prereqDone = (m, i) => (m.correlativas || []).every(c => state.approved.has(c) || (placedIdx[c] !== undefined && placedIdx[c] < i));
  for (let i = 0; i < N && remaining.length; i++) {
    accBefore[i] = acc; const cu = cuatriAt(PL.start, i);
    const pick = m => { const coms = (m.horario && m.horario.comisiones) || []; if (!coms.length) return null; if (!PL.avoid) return coms[0]; return coms.find(c => !items[i].some(x => x.com && comConflict(x.com, c))) || coms[0]; };
    const place = m => { items[i].push({ m, com: pick(m) }); placedIdx[m.codigo] = i; };
    remaining.filter(m => PL.fixed.get(m.codigo) === i).forEach(place);
    remaining = remaining.filter(m => placedIdx[m.codigo] === undefined);
    let cand = remaining.filter(m => {
      const fx = PL.fixed.get(m.codigo);
      if (fx !== undefined && fx !== null && fx !== i) return false;
      if (m.parity !== null && m.parity !== cu.parity) return false;
      if ((m.creditosReq || 0) > acc) return false;
      return prereqDone(m, i);
    }).sort(packSort);
    for (const m of cand) {
      if (items[i].length >= PL.maxMat) break;
      const cred = items[i].reduce((s, x) => s + (x.m.creditos || 0), 0);
      if (items[i].length > 0 && cred + (m.creditos || 0) > PL.maxCred) continue;
      const coms = (m.horario && m.horario.comisiones) || [];
      if (PL.avoid && coms.length && !coms.some(c => !items[i].some(x => x.com && comConflict(x.com, c)))) continue;
      place(m);
    }
    remaining = remaining.filter(m => placedIdx[m.codigo] === undefined);
    acc += items[i].reduce((s, x) => s + (x.m.creditos || 0), 0);
  }
  // --- compactación: adelantar materias de cuatris tardíos a cuatris previos de igual paridad con lugar ---
  const credOfCuatri = it => it.reduce((s, x) => s + (x.m.creditos || 0), 0);
  let moved = 0, changed = true, guard = 0;
  while (changed && guard++ < 300) {
    changed = false;
    const accB = []; let a2 = approvedCredits();
    for (let i = 0; i < N; i++) { accB[i] = a2; a2 += credOfCuatri(items[i]); }
    for (let i = N - 1; i >= 1 && !changed; i--) {
      if (!items[i].length) continue;
      const ci = cuatriAt(PL.start, i);
      for (const it of items[i]) {
        const fx = PL.fixed.get(it.m.codigo);
        if (fx !== undefined && fx !== null) continue;
        let done = false;
        for (let j = 0; j < i; j++) {
          const cj = cuatriAt(PL.start, j);
          if (cj.parity !== ci.parity) continue;
          if ((it.m.creditosReq || 0) > accB[j]) continue;
          if (!(it.m.correlativas || []).every(c => state.approved.has(c) || (placedIdx[c] !== undefined && placedIdx[c] < j))) continue;
          if (items[j].length >= PL.maxMat) continue;
          if (credOfCuatri(items[j]) + (it.m.creditos || 0) > PL.maxCred) continue;
          const comsM = (it.m.horario && it.m.horario.comisiones) || [];
          let comJ = it.com;
          if (comsM.length && PL.avoid) { comJ = comsM.find(c => !items[j].some(x => x.com && comConflict(x.com, c))); if (!comJ) continue; }
          it.com = comJ;
          items[i] = items[i].filter(x => x !== it); items[j].push(it); placedIdx[it.m.codigo] = j; moved++; changed = true; done = true; break;
        }
        if (done) break;
      }
    }
  }
  const accBefore2 = []; let a3 = approvedCredits();
  for (let i = 0; i < N; i++) { accBefore2[i] = a3; a3 += credOfCuatri(items[i]); }
  PL.result = { items, unplaced: remaining, accBefore: accBefore2, moved };
  renderPlan();
}
function renderPlanPool() {
  const host = document.getElementById("planPool"); if (!host) return;
  const codes = [...state.plan.pool].filter(c => !state.approved.has(c));
  const obs = codes.filter(c => !isElectiva(c)).map(c => byId.get(c)).sort(planPriority);
  const els = codes.filter(isElectiva).map(c => byId.get(c)).sort(planPriority);
  const usable = c => hasHorario(c) || true;
  const cuatriOpts = () => { let o = `<option value="">auto</option>`; for (let i = 0; i < 8; i++) o += `<option value="${i}">${cuatriLabel(cuatriAt(state.plan.start, i))}</option>`; return o; };
  const item = (m, removable) => {
    const fx = state.plan.fixed.get(m.codigo);
    const sel = `<select data-fx="${m.codigo}">${cuatriOpts().replace(`value="${fx}"`, `value="${fx}" selected`)}</select>`;
    return `<div class="pool-item"><span class="pc">${m.codigo}</span><span class="pab">${m.abbr}</span><span class="pn">${m.nombre}${hasHorario(m.codigo) ? "" : ' <span class="muted">(sin horario)</span>'}</span>${sel}${removable ? `<button class="rm" data-rm="${m.codigo}">×</button>` : ""}</div>`;
  };
  host.innerHTML = `<div class="pool-cols">
    <div class="pool-col"><div class="pool-h">Obligatorias <i>${obs.length}</i></div>${obs.map(m => item(m, true)).join("") || '<p class="muted">—</p>'}</div>
    <div class="pool-col"><div class="pool-h">Electivas <i>${els.length}</i></div>${els.map(m => item(m, true)).join("") || '<p class="muted">Ninguna aún.</p>'}
      <div class="pool-add"><input id="poolAdd" type="text" placeholder="Agregar electiva (código o nombre)…" autocomplete="off"><div id="poolSugg" class="pool-sugg" style="display:none"></div></div>
    </div></div>`;
  host.querySelectorAll("[data-fx]").forEach(s => s.onchange = () => { const c = s.dataset.fx; if (s.value === "") state.plan.fixed.delete(c); else state.plan.fixed.set(c, +s.value); savePlan(); optimizePlan(); });
  host.querySelectorAll("[data-rm]").forEach(b => b.onclick = () => { state.plan.pool.delete(b.dataset.rm); state.plan.fixed.delete(b.dataset.rm); savePlan(); renderPlanPool(); optimizePlan(); });
  const add = document.getElementById("poolAdd"), sugg = document.getElementById("poolSugg");
  add.oninput = () => {
    const q = add.value.trim().toLowerCase(); if (!q) { sugg.style.display = "none"; return; }
    const matches = P.electivas.filter(m => !state.plan.pool.has(m.codigo) && !state.approved.has(m.codigo) && (m.codigo + " " + m.nombre + " " + m.abbr).toLowerCase().includes(q)).slice(0, 12);
    sugg.innerHTML = matches.map(m => `<div data-add="${m.codigo}"><span class="sc">${m.codigo}</span><span>${m.abbr} — ${m.nombre}</span>${hasHorario(m.codigo) ? "" : '<span class="muted" style="margin-left:auto">sin horario</span>'}</div>`).join("") || '<div class="muted" style="padding:8px 10px">Sin resultados</div>';
    sugg.style.display = "block";
    sugg.querySelectorAll("[data-add]").forEach(d => d.onclick = () => { state.plan.pool.add(d.dataset.add); savePlan(); add.value = ""; sugg.style.display = "none"; renderPlanPool(); optimizePlan(); });
  };
  add.onblur = () => setTimeout(() => sugg.style.display = "none", 200);
}
function methodText(R) {
  const PL = state.plan;
  return `<b>Optimización aplicada.</b> Objetivo: minimizar la cantidad de cuatrimestres. ` +
    `Orden de prioridad de la lista: obligatorias › mayor requisito de créditos › más créditos. ` +
    `Restricciones respetadas: paridad 1.º/2.º cuatrimestre · correlativas · créditos requeridos${PL.avoid ? " · sin superposición horaria" : ""}. ` +
    `Tope por cuatrimestre: ${PL.maxCred} créditos y ${PL.maxMat} materias. ` +
    (R.moved ? `Compactación: ${R.moved} materia(s) adelantadas a cuatrimestres con lugar.` : `Sin compactación adicional necesaria.`);
}
function renderPlan() {
  renderPlanPool();
  const R = state.plan.result; if (!R) return;
  const board = document.getElementById("planBoard"), summary = document.getElementById("planSummary"), warn = document.getElementById("planWarn");
  const used = R.items.map((it, i) => ({ it, i })).filter(x => x.it.length);
  const totalCred = R.items.flat().reduce((s, x) => s + (x.m.creditos || 0), 0);
  const finalCred = approvedCredits() + totalCred;
  const elecPlan = R.items.flat().filter(x => x.m.tipo === "electiva").reduce((s, x) => s + (x.m.creditos || 0), 0);
  summary.innerHTML = `<div class="ps"><b>${used.length}</b><span>cuatrimestres</span></div><div class="ps"><b>${R.items.flat().length}</b><span>materias planificadas</span></div><div class="ps"><b>${totalCred}</b><span>créditos a cursar</span></div><div class="ps"><b>${electiveCredits() + elecPlan}/27</b><span>créditos electivos</span></div><div class="ps"><b>${finalCred}</b><span>créditos al finalizar</span></div>`;
  const pm = document.getElementById("planMethod"); if (pm) pm.innerHTML = methodText(R);

  board.innerHTML = "";
  if (!used.length) { board.innerHTML = `<div class="empty">Agregá materias al plan para generar la distribución.</div>`; }
  used.forEach(({ it, i }) => {
    const cu = cuatriAt(state.plan.start, i);
    const blocks = [], asyncs = [], entries = [], seenB = new Set();
    it.forEach((x, k) => {
      const color = PALETTE[k % PALETTE.length]; entries.push({ abbr: x.m.abbr, nombre: x.m.nombre, color });
      const com = x.com; if (!com) { asyncs.push({ abbr: x.m.abbr, txt: "sin horario" }); return; }
      com.slots.forEach(s => {
        const key = x.m.codigo + s.dia + s.desde + s.hasta;
        if (isAsync(s) || !DAYS.includes(s.dia)) asyncs.push({ abbr: x.m.abbr, txt: `${s.dia} ${s.desde}–${s.hasta}`, color });
        else { if (seenB.has(key)) return; seenB.add(key); blocks.push({ ...s, abbr: x.m.abbr, nombre: x.m.nombre, color }); }
      });
    });
    blocks.forEach(a => { a.conf = blocks.some(b => b !== a && slotsConflict(a, b)); });
    const cred = it.reduce((s, x) => s + (x.m.creditos || 0), 0);
    const card = document.createElement("div"); card.className = "qgrid";
    card.innerHTML = `<div class="qgrid__h"><h3>${cuatriName(cu)}<span class="tag-cuat">${cuatriLabel(cu)}</span></h3><div class="qg-actions"><span class="cr">${cred} cr · acum. ${R.accBefore[i] + cred}</span><button class="icon-btn" data-dl>Descargar</button></div></div>
      <div class="qgrid__body">${blocks.length ? renderWeek(blocks, { days: DAYS, compact: true }) : '<p class="muted" style="padding:8px">Sólo materias sin grilla semanal.</p>'}
      ${asyncs.length ? `<div class="async-row"><span class="lbl">Asincrónico / otros</span>${asyncs.map(a => `<span class="async-chip">${a.abbr}${a.txt ? " · " + a.txt : ""}</span>`).join("")}</div>` : ""}
      <div class="legend">${legendHTML(entries)}</div></div>`;
    card.querySelector("[data-dl]").onclick = () => downloadPNG(card, `plan-${cuatriLabel(cu)}.png`);
    board.appendChild(card);
  });

  const warns = [];
  R.items.forEach((it, i) => it.forEach(x => {
    if ((x.m.creditosReq || 0) > R.accBefore[i]) warns.push(`<div class="conflict">${x.m.abbr} · ${x.m.nombre}: requiere ${x.m.creditosReq} créditos pero al inicio de ${cuatriLabel(cuatriAt(state.plan.start, i))} tenés ${R.accBefore[i]}.</div>`);
    const cu = cuatriAt(state.plan.start, i); if (x.m.parity !== null && x.m.parity !== cu.parity) warns.push(`<div class="conflict">${x.m.abbr}: el plan la ubica en ${x.m.cuatri}.º cuatrimestre, pero la fijaste en ${cuatriLabel(cu)}.</div>`);
  }));
  R.unplaced.forEach(m => warns.push(`<div class="conflict">${m.abbr} · ${m.nombre}: no se pudo ubicar (revisá correlativas, créditos requeridos o paridad de cuatrimestre).</div>`));
  warn.innerHTML = warns.length ? `<div class="block__h" style="margin:6px 0">Observaciones</div>${warns.join("")}` : "";
}

/* =========================================================================
   REFERENCIAS
   ========================================================================= */
function renderRef() {
  const host = document.getElementById("refBody"); const q = (document.getElementById("refSearch").value || "").trim().toLowerCase();
  const all = [...P.obligatorias, ...P.electivas].filter(m => (m.codigo + " " + m.nombre + " " + m.abbr).toLowerCase().includes(q)).sort((a, b) => a.abbr.localeCompare(b.abbr));
  host.innerHTML = `<div class="ref-row head"><span>Abreviatura</span><span>Código</span><span>Materia</span><span>Créditos</span><span>Área / Tipo</span></div>` +
    all.map(m => `<div class="ref-row"><span class="rab">${m.abbr}</span><span class="rc">${m.codigo}</span><span class="rn">${m.nombre}</span><span class="rcr">${m.creditos} cr</span><span class="rar">${m.tipo === "obligatoria" ? "Obligatoria" : ((m.areas || []).join(", ") || "Electiva")}</span></div>`).join("");
}

/* =========================================================================
   CORRELATIVAS
   ========================================================================= */
function renderGraph() {
  if (net) return;
  const css = getComputedStyle(document.documentElement), gv = n => css.getPropertyValue(n).trim();
  const nodeBg = gv("--panel-2"), fontC = gv("--ink"), edgeC = gv("--faint"), hl = gv("--brass"), bSlate = gv("--slate"), bBrass = gv("--brass");
  const ids = new Set(); P.edges.forEach(e => { ids.add(e.from); ids.add(e.to); });
  const nodes = [...ids].map(id => { const m = byId.get(id), ob = m && m.tipo === "obligatoria";
    return { id, label: (m ? m.abbr : id) + "\n" + id, color: { background: nodeBg, border: ob ? bSlate : bBrass }, font: { color: fontC, face: "IBM Plex Mono", size: 11 }, shape: "box" }; });
  net = new vis.Network(document.getElementById("network"),
    { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(P.edges.map(e => ({ ...e, arrows: "to" }))) },
    { layout: { hierarchical: { enabled: true, direction: "LR", sortMethod: "directed", levelSeparation: 160, nodeSpacing: 64 } }, physics: false,
      nodes: { margin: 7, borderWidth: 1.2 }, edges: { color: { color: edgeC, highlight: hl }, width: 1, smooth: { type: "cubicBezier" }, arrows: { to: { scaleFactor: .5 } } }, interaction: { hover: true } });
  net.on("click", p => { if (p.nodes.length) openDrawer(p.nodes[0]); });
  setTimeout(() => net.fit({ animation: false }), 60);
}

/* =========================================================================
   BIND
   ========================================================================= */
function bindUI() {
  document.querySelectorAll(".view").forEach(b => b.onclick = () => setView(b.dataset.view));
  const s = document.getElementById("search");
  s.oninput = () => { clearTimeout(s._t); s._t = setTimeout(() => { state.search = s.value.trim().toLowerCase(); renderCuatri(); renderElect(); }, 140); };
  document.getElementById("fDisp").onchange = e => { state.fDisp = e.target.checked; renderCuatri(); renderElect(); };
  document.getElementById("fHor").onchange = e => { state.fHor = e.target.checked; renderCuatri(); renderElect(); };
  document.getElementById("reset").onclick = () => { if (!confirm("¿Restablecer las materias aprobadas a tu estado actual (1.º a 3.º + economía, derecho, simulación, ISW II)?")) return; state.approved = new Set(P.aprobadasDefault); saveApproved(); state.plan.pool = new Set(remainingOblig()); savePlan(); state.plan.result = null; renderAll(); optimizePlan(); };
  // combinador
  document.getElementById("comboGen").onclick = generateCombos;
  document.getElementById("comboClear").onclick = () => { state.combo.clear(); state.fixedCom.clear(); saveCombo(); state.combos = []; renderElect(); renderCombinadorPickers(); updateComboBar(); document.getElementById("comboStatus").innerHTML = ""; document.getElementById("comboNav").classList.add("hidden"); document.getElementById("grid").className = "grid"; document.getElementById("comboLegend").innerHTML = ""; };
  document.getElementById("cAllowOverlap").onchange = e => { state.comboParams.allowOverlap = e.target.checked; };
  const mm = { mPres: "Presencial", mVirt: "Virtual", mBlend: "Blended" };
  Object.keys(mm).forEach(id => document.getElementById(id).onchange = e => { state.comboParams.modal[mm[id]] = e.target.checked; });
  // plan
  document.getElementById("pcStart").onchange = e => { const [p, y] = e.target.value.split("-").map(Number); state.plan.start = { parity: p, year: y }; optimizePlan(); };
  document.getElementById("pcMaxCred").onchange = e => { state.plan.maxCred = +e.target.value || 18; optimizePlan(); };
  document.getElementById("pcMaxMat").onchange = e => { state.plan.maxMat = +e.target.value || 5; optimizePlan(); };
  document.getElementById("pcAvoid").onchange = e => { state.plan.avoid = e.target.checked; optimizePlan(); };
  document.getElementById("planOpt").onclick = optimizePlan;
  document.getElementById("planReset").onclick = () => { state.plan.pool = new Set(remainingOblig()); state.plan.fixed.clear(); savePlan(); optimizePlan(); };
  document.getElementById("refSearch").oninput = renderRef;
  document.querySelectorAll("#themeToggle button").forEach(b => b.onclick = () => applyTheme(b.dataset.set));
  document.getElementById("sideToggle").onclick = () => applySidebar(!document.body.classList.contains("side-collapsed"));
  document.getElementById("planDownload").onclick = () => downloadPNG(document.getElementById("planBoard"), "plan-de-cursada.png");
  window.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });
}

document.addEventListener("DOMContentLoaded", init);
