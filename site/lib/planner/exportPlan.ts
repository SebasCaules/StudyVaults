// Export del plan de cursada a un documento HTML autocontenido y bien formateado
// (sirve para descargar como .html o para imprimir → PDF). Sin dependencias ni
// DOM: devuelve un string. Los colores son literales (no usa color-mix) para que
// imprima y se vea bien en cualquier visor.
import { cuatriAt, cuatriLabel, cuatriName } from "./optimize";
import { isAsync } from "./time";
import { DAYS } from "./model";
import type { PlacedMateria, PlanResult, PlanStart, Slot } from "./types";

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
  section.cuatri{border:1px solid var(--line);border-radius:10px;background:var(--panel);margin-bottom:16px;overflow:hidden;page-break-inside:avoid;break-inside:avoid}
  .cuatri__h{display:flex;align-items:baseline;justify-content:space-between;gap:14px;flex-wrap:wrap;padding:13px 18px;border-bottom:1px solid var(--line);background:#f6efe7}
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
