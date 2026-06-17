// Export del plan de cursada a un documento HTML autocontenido y bien formateado
// (sirve para descargar como .html o para imprimir → PDF). Sin dependencias ni
// DOM: devuelve un string. Los colores son literales (no usa color-mix) para que
// imprima y se vea bien en cualquier visor.
import { cuatriAt, cuatriLabel, cuatriName } from "./optimize";
import { isAsync, slotsConflict, toMin } from "./time";
import { DAYS, PALETTE } from "./model";
import type {
  PlacedMateria,
  PlanResult,
  PlanStart,
  Slot,
  WeekBlock,
} from "./types";

const esc = (s: unknown): string =>
  String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );

const credOf = (it: PlacedMateria[]) =>
  it.reduce((s, x) => s + (x.m.creditos || 0), 0);

// Resumen legible de horario de una comisión (días/horas + sala/sede).
function slotLines(slots: Slot[]): { sync: string[]; async: string[] } {
  const sync: string[] = [];
  const async: string[] = [];
  for (const s of slots) {
    const where = [s.sala, s.sede].filter(Boolean).join(" · ");
    if (isAsync(s)) {
      async.push("asincrónico" + (where ? ` · ${where}` : ""));
    } else {
      const mod = s.modalidad ? ` · ${s.modalidad}` : "";
      sync.push(`${s.dia} ${s.desde}–${s.hasta}${where ? " · " + where : ""}${mod}`);
    }
  }
  return { sync, async };
}

// Tinte literal (rgba sobre papel claro) a partir del hex de la materia. No
// usamos color-mix para que imprima bien en cualquier visor.
function tint(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Bloques de la grilla semanal de un cuatrimestre (port de PlanView →
// computeCuatriBlocks). Lo que no entra en la grilla (asincrónico, sin horario
// o días fuera de lun–vie) cae a `asyncs`.
function computeCuatriBlocks(it: PlacedMateria[]): {
  blocks: WeekBlock[];
  asyncs: { abbr: string; txt: string }[];
} {
  const blocks: WeekBlock[] = [];
  const asyncs: { abbr: string; txt: string }[] = [];
  const seen = new Set<string>();
  it.forEach((x, k) => {
    const color = PALETTE[k % PALETTE.length];
    const com = x.com;
    if (!com) {
      asyncs.push({ abbr: x.m.abbr, txt: "sin horario" });
      return;
    }
    com.slots.forEach((s) => {
      const key = x.m.codigo + s.dia + s.desde + s.hasta;
      if (isAsync(s) || !DAYS.includes(s.dia)) {
        asyncs.push({ abbr: x.m.abbr, txt: `${s.dia} ${s.desde}–${s.hasta}` });
      } else if (!seen.has(key)) {
        seen.add(key);
        blocks.push({ ...s, abbr: x.m.abbr, nombre: x.m.nombre, color });
      }
    });
  });
  blocks.forEach((a) => {
    a.conf = blocks.some((b) => b !== a && slotsConflict(a, b));
  });
  return { blocks, asyncs };
}

// Grilla semanal autocontenida (lun–vie × horas) con bloques posicionados,
// espejo de CursadaCalendar pero como string HTML con estilos literales.
function weekGridHTML(blocks: WeekBlock[]): string {
  const PX = 0.6; // px por minuto
  let minM = 8 * 60;
  let maxM = 22 * 60;
  blocks.forEach((b) => {
    minM = Math.min(minM, toMin(b.desde));
    maxM = Math.max(maxM, toMin(b.hasta));
  });
  minM = Math.floor(minM / 60) * 60;
  maxM = Math.ceil(maxM / 60) * 60;
  const hours: number[] = [];
  for (let t = minM; t < maxM; t += 60) hours.push(t);
  const bodyH = (maxM - minM) * PX;
  const cols = `46px repeat(${DAYS.length}, minmax(0, 1fr))`;

  const head = DAYS.map((d) => {
    const n = blocks.filter((b) => b.dia === d).length;
    return `<div class="cg-day${n === 0 ? " is-free" : ""}">${esc(d.slice(0, 3))}${n > 0 ? `<i>${n}</i>` : ""}</div>`;
  }).join("");

  const gutter = `<div class="cg-gutter">${hours
    .map(
      (t) =>
        `<div class="cg-hour" style="height:${60 * PX}px"><span>${String(t / 60).padStart(2, "0")}:00</span></div>`,
    )
    .join("")}</div>`;

  const cells = hours
    .map(() => `<div class="cg-cell" style="height:${60 * PX}px"></div>`)
    .join("");

  const dayCols = DAYS.map((d) => {
    const dayBlocks = blocks.filter((b) => b.dia === d);
    const free =
      dayBlocks.length === 0 ? `<span class="cg-free">libre</span>` : "";
    const blks = dayBlocks
      .map((b) => {
        const top = (toMin(b.desde) - minM) * PX;
        const h = (toMin(b.hasta) - toMin(b.desde)) * PX;
        const room =
          b.sala && h > 42 ? `<span class="cg-blk__room">${esc(b.sala)}</span>` : "";
        return `<div class="cg-blk${b.conf ? " is-conf" : ""}" style="top:${top}px;height:${h}px;background:${tint(b.color, 0.16)};border-color:${tint(b.color, 0.42)};border-left-color:${b.color}">
          <span class="cg-blk__abbr">${esc(b.abbr)}</span>
          <span class="cg-blk__time">${esc(b.desde)}–${esc(b.hasta)}</span>
          ${room}
        </div>`;
      })
      .join("");
    return `<div class="cg-col${dayBlocks.length === 0 ? " is-free" : ""}">${cells}${free}<div class="cg-abs">${blks}</div></div>`;
  }).join("");

  return `<div class="cg">
    <div class="cg-head" style="grid-template-columns:${cols}"><span class="cg-corner"></span>${head}</div>
    <div class="cg-body" style="grid-template-columns:${cols};height:${bodyH}px">${gutter}${dayCols}</div>
  </div>`;
}

function asyncRowHTML(asyncs: { abbr: string; txt: string }[]): string {
  if (!asyncs.length) return "";
  return `<div class="cg-async"><span class="cg-async__lbl">Asincrónico / otros</span>${asyncs
    .map(
      (a) =>
        `<span class="cg-async__chip">${esc(a.abbr)}${a.txt ? " · " + esc(a.txt) : ""}</span>`,
    )
    .join("")}</div>`;
}

export interface ExportArgs {
  result: PlanResult;
  start: PlanStart;
  maxCred: number;
  maxMat: number;
  avoid: boolean;
  approvedCreditsNow: number;
  generado: string; // fecha legible
  autoPrint?: boolean;
}

export function buildPlanHTML(a: ExportArgs): string {
  const { result: R, start, approvedCreditsNow } = a;
  const used = R.items
    .map((it, i) => ({ it, i }))
    .filter((x) => x.it.length);
  const flat = R.items.flat();
  const totalCred = flat.reduce((s, x) => s + (x.m.creditos || 0), 0);
  const finalCred = approvedCreditsNow + totalCred;
  const elecPlan = flat
    .filter((x) => x.m.tipo === "electiva")
    .reduce((s, x) => s + (x.m.creditos || 0), 0);
  const lastIdx = used.length ? used[used.length - 1].i : 0;
  const gradCu = cuatriAt(start, lastIdx);

  const cuatriSection = ({ it, i }: { it: PlacedMateria[]; i: number }) => {
    const cu = cuatriAt(start, i);
    const cred = credOf(it);
    const { blocks, asyncs } = computeCuatriBlocks(it);
    const calHTML = blocks.length
      ? weekGridHTML(blocks)
      : `<p class="cg-empty">Sólo materias sin grilla semanal.</p>`;
    const rows = it
      .slice()
      .sort((x, y) => (y.m.creditos || 0) - (x.m.creditos || 0))
      .map((x) => {
        const { sync, async } = x.com
          ? slotLines(x.com.slots)
          : { sync: [], async: [] };
        const horario =
          x.com == null
            ? `<span class="muted">sin horario</span>`
            : [...sync, ...async].map(esc).join("<br>") || "—";
        const com = x.com ? `<span class="mono">${esc(x.com.comision)}</span>` : "—";
        return `<tr>
          <td class="mono code">${esc(x.m.codigo)}</td>
          <td class="abbr">${esc(x.m.abbr)}</td>
          <td>${esc(x.m.nombre)}${x.m.tipo === "electiva" ? ' <span class="pill-el">electiva</span>' : ""}</td>
          <td class="num">${esc(x.m.creditos)}</td>
          <td>${com}</td>
          <td class="hor">${horario}</td>
        </tr>`;
      })
      .join("");
    return `<section class="cuatri">
      <div class="cuatri__h">
        <h2>${esc(cuatriName(cu))} <span class="tag">${esc(cuatriLabel(cu))}</span></h2>
        <div class="cuatri__meta">${it.length} materia${it.length === 1 ? "" : "s"} · <b>${cred}</b> créditos</div>
      </div>
      <div class="cuatri__cal">
        <div class="cuatri__cal-h">Semana tipo</div>
        ${calHTML}
        ${asyncRowHTML(asyncs)}
      </div>
      <table>
        <thead><tr><th>Código</th><th>Abrev.</th><th>Materia</th><th class="num">Cr.</th><th>Comisión</th><th>Horario</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`;
  };

  const sectionsHTML = used.map(cuatriSection).join("");

  const autoPrintScript = a.autoPrint
    ? `<script>window.addEventListener('load',function(){setTimeout(function(){window.focus();window.print();},250);});</script>`
    : "";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Plan de cursada — ITBA</title>
<style>
  :root{
    --ink:#2b211c; --soft:#5a4d45; --muted:#8a7d73; --line:#e3d9cf;
    --paper:#fbf8f4; --panel:#fff; --coral:#d2754f; --slate:#5b7290;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{
    background:var(--paper); color:var(--ink);
    font-family:Georgia,"Times New Roman",serif; line-height:1.5;
    -webkit-print-color-adjust:exact; print-color-adjust:exact;
  }
  .wrap{max-width:920px;margin:0 auto;padding:40px 32px 56px}
  .mono{font-family:"SFMono-Regular",Menlo,Consolas,monospace}
  .muted{color:var(--muted)}
  header.doc{border-bottom:2px solid var(--ink);padding-bottom:18px;margin-bottom:24px}
  header.doc .kick{font-family:"SFMono-Regular",Menlo,monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--coral);margin:0 0 6px}
  header.doc h1{font-size:30px;margin:0 0 4px;letter-spacing:-.01em}
  header.doc .gen{color:var(--muted);font-size:12.5px;font-family:"SFMono-Regular",Menlo,monospace}
  .summary{display:flex;flex-wrap:wrap;gap:0;border:1px solid var(--line);border-radius:10px;overflow:hidden;margin-bottom:10px;background:var(--panel)}
  .summary .s{flex:1;min-width:150px;padding:14px 18px;border-right:1px solid var(--line)}
  .summary .s:last-child{border-right:none}
  .summary .s b{display:block;font-size:24px;line-height:1.1}
  .summary .s span{display:block;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-top:5px;font-family:"SFMono-Regular",Menlo,monospace}
  .summary .s.accent b{color:var(--coral)}
  .meta-note{font-size:12px;color:var(--muted);margin:0 0 26px;line-height:1.55}
  section.cuatri{border:1px solid var(--line);border-radius:10px;background:var(--panel);margin-bottom:16px;overflow:hidden;page-break-inside:auto;break-inside:auto}
  .cuatri__h{display:flex;align-items:baseline;justify-content:space-between;gap:14px;flex-wrap:wrap;padding:13px 18px;border-bottom:1px solid var(--line);background:#f6efe7;page-break-after:avoid;break-after:avoid}
  .cuatri__h h2{font-size:18px;margin:0}
  .cuatri__h .tag{font-family:"SFMono-Regular",Menlo,monospace;font-size:11px;color:var(--slate);border:1px solid var(--line);border-radius:5px;padding:2px 7px;margin-left:6px;vertical-align:middle}
  .cuatri__meta{font-family:"SFMono-Regular",Menlo,monospace;font-size:12.5px;color:var(--soft)}
  .cuatri__meta b{color:var(--ink)}
  table{width:100%;border-collapse:collapse;font-size:12.5px}
  thead th{text-align:left;font-family:"SFMono-Regular",Menlo,monospace;font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);font-weight:600;padding:9px 14px;border-bottom:1px solid var(--line)}
  tbody td{padding:9px 14px;border-bottom:1px solid var(--line);vertical-align:top}
  tbody tr:last-child td{border-bottom:none}
  td.code{color:var(--slate);font-size:11.5px;white-space:nowrap}
  td.abbr{font-weight:bold}
  td.num,th.num{text-align:right;font-family:"SFMono-Regular",Menlo,monospace}
  td.hor{font-family:"SFMono-Regular",Menlo,monospace;font-size:11px;color:var(--soft);line-height:1.45}
  .pill-el{font-family:"SFMono-Regular",Menlo,monospace;font-size:9px;letter-spacing:.05em;text-transform:uppercase;color:var(--coral);border:1px solid var(--line);border-radius:4px;padding:1px 5px;vertical-align:middle}
  .grad{margin-top:8px;border:1px solid var(--coral);background:#fbeee6;border-radius:10px;padding:16px 20px;page-break-inside:avoid}
  .grad .kick{font-family:"SFMono-Regular",Menlo,monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--coral);margin:0}
  .grad h2{margin:3px 0 2px;font-size:20px}
  .grad p{margin:0;color:var(--soft);font-family:"SFMono-Regular",Menlo,monospace;font-size:13px}
  footer.doc{margin-top:26px;border-top:1px solid var(--line);padding-top:12px;color:var(--muted);font-size:11px;font-family:"SFMono-Regular",Menlo,monospace}
  /* ---- calendario semanal por cuatrimestre ---- */
  .cuatri__cal{padding:13px 18px 15px;border-bottom:1px solid var(--line)}
  .cuatri__cal-h{font-family:"SFMono-Regular",Menlo,monospace;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:9px}
  .cg-empty{margin:2px 0 0;color:var(--muted);font-size:12.5px}
  .cg{border:1px solid var(--line);border-radius:9px;overflow:hidden;background:var(--paper);page-break-inside:avoid;break-inside:avoid}
  .cg-head{display:grid;border-bottom:1px solid var(--line)}
  .cg-corner{border-right:1px solid var(--line)}
  .cg-day{padding:7px 5px;text-align:center;font-family:"SFMono-Regular",Menlo,monospace;font-size:9.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--soft);border-right:1px solid var(--line);display:flex;align-items:center;justify-content:center;gap:5px}
  .cg-day:last-child{border-right:none}
  .cg-day i{font-style:normal;font-size:8.5px;color:#fff;background:var(--coral);border-radius:999px;min-width:14px;padding:1px 4px;line-height:1.3}
  .cg-day.is-free{color:var(--muted)}
  .cg-body{display:grid;position:relative}
  .cg-gutter{position:relative;border-right:1px solid var(--line)}
  .cg-hour{position:relative}
  .cg-hour span{position:absolute;top:-6px;right:6px;font-family:"SFMono-Regular",Menlo,monospace;font-size:9px;color:var(--muted)}
  .cg-col{position:relative;border-right:1px solid var(--line)}
  .cg-col:last-child{border-right:none}
  .cg-col.is-free{background:repeating-linear-gradient(135deg,transparent,transparent 9px,#efe6db 9px,#efe6db 10px)}
  .cg-cell{border-top:1px solid var(--line)}
  .cg-cell:first-child{border-top:none}
  .cg-free{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-90deg);font-family:"SFMono-Regular",Menlo,monospace;font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:var(--muted);opacity:.6}
  .cg-abs{position:absolute;inset:0}
  .cg-blk{position:absolute;left:3px;right:3px;border-radius:6px;overflow:hidden;border:1px solid;border-left-width:3px;padding:4px 6px;display:flex;flex-direction:column;gap:1px;min-height:0}
  .cg-blk__abbr{font-family:Georgia,"Times New Roman",serif;font-weight:bold;font-size:12px;line-height:1.12;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .cg-blk__time{font-family:"SFMono-Regular",Menlo,monospace;font-size:9.5px;color:var(--soft);line-height:1.2}
  .cg-blk__room{font-family:"SFMono-Regular",Menlo,monospace;font-size:8.5px;color:var(--muted);margin-top:auto}
  .cg-blk.is-conf{border-color:#9c3b2e !important;border-left-color:#9c3b2e !important;box-shadow:0 0 0 1px #9c3b2e}
  .cg-async{margin-top:11px;display:flex;flex-wrap:wrap;gap:7px;align-items:center}
  .cg-async__lbl{font-family:"SFMono-Regular",Menlo,monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
  .cg-async__chip{font-family:"SFMono-Regular",Menlo,monospace;font-size:10px;padding:3px 8px;border-radius:4px;background:#f6efe7;border:1px solid var(--line);color:var(--soft)}
  @page{size:A4;margin:14mm}
  @media print{ .wrap{padding:0;max-width:none} body{background:#fff} }
</style>
${autoPrintScript}
</head>
<body>
<div class="wrap">
  <header class="doc">
    <p class="kick">StudyVaults · ITBA</p>
    <h1>Plan de cursada</h1>
    <p class="gen">Generado el ${esc(a.generado)}</p>
  </header>

  <div class="summary">
    <div class="s accent"><b>${used.length}</b><span>cuatrimestres</span></div>
    <div class="s"><b>${esc(cuatriName(gradCu))}</b><span>te recibís</span></div>
    <div class="s"><b>${flat.length}</b><span>materias a cursar</span></div>
    <div class="s"><b>${totalCred}</b><span>créditos a cursar</span></div>
    <div class="s"><b>${approvedCreditsNow}/${finalCred}</b><span>créditos · meta</span></div>
  </div>
  <p class="meta-note">
    Optimización: minimiza la cantidad de cuatrimestres priorizando obligatorias, el camino crítico de
    correlativas y los créditos; las comisiones se eligen para concentrar la cursada en menos días.
    Tope por cuatrimestre: ${a.maxCred} créditos y ${a.maxMat} materias${a.avoid ? " · evitando superposiciones (incluye traslados entre sedes)" : ""}.
  </p>

  ${sectionsHTML}

  <div class="grad">
    <p class="kick">Meta</p>
    <h2>¡Recibido!</h2>
    <p>${finalCred} créditos · ${esc(cuatriName(gradCu))}</p>
  </div>

  <footer class="doc">Plan de cursada · ${elecPlan} créditos electivos en este plan · studyvaults</footer>
</div>
</body>
</html>`;
}
