// Export del plan de cursada / combinación a un documento HTML autocontenido y
// bien formateado (sirve para descargar como .html o imprimir → PDF). Sin
// dependencias ni DOM: devuelve un string. Los colores son literales (no usa
// color-mix) para que imprima y se vea bien en cualquier visor.
import { cuatriAt, cuatriLabel, cuatriName } from "./optimize";
import { isAsync, slotsConflict, toMin } from "./time";
import { DAYS, PALETTE } from "./model";
import { FICHAS } from "./fichas";
import { charsOf } from "./programa";
import resumenesData from "./resumenes.json";
import type {
  Comision,
  Ficha,
  OptMethod,
  PlacedMateria,
  PlanResult,
  PlanStart,
  WeekBlock,
} from "./types";

/** Resumen por bloques extraído de los PDFs (Electivas/build-resumenes.py). */
interface ResumenEntry {
  codigo: string;
  materia: string;
  puntosClave: string[];
  contenidosMinimos: string;
  evaluacion: { resumen: string; texto: string };
  bibliografia: { obligatoria: string[]; complementaria: string[] };
}
const RESUMENES = resumenesData as unknown as Record<string, ResumenEntry>;

const esc = (s: unknown): string =>
  String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );

const credOf = (it: PlacedMateria[]) =>
  it.reduce((s, x) => s + (x.m.creditos || 0), 0);

/** minúsculas sin acentos, para matchear robusto el texto de `evaluacion`. */
const normTxt = (s: string): string =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Mapea la palabra/dígito de cantidad ("dos", "2") a número; default 1. */
const NUMW: Record<string, number> = {
  un: 1, una: 1, uno: 1, "1": 1,
  dos: 2, "2": 2, tres: 3, "3": 3, cuatro: 4, "4": 4, cinco: 5, "5": 5,
};
const numOf = (w: string | undefined): number => (w ? NUMW[w] ?? 1 : 1);

/** Dedup preservando el primer elemento de cada clave. */
function dedupBy<T>(xs: T[], key: (x: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of xs) {
    const k = key(x);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
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
  const PX = 0.5; // px por minuto (compacto para imprimir en pocas páginas)
  // Rango ajustado a las horas reales de cursada → grillas cortas, menos páginas.
  let minM = Infinity;
  let maxM = -Infinity;
  blocks.forEach((b) => {
    minM = Math.min(minM, toMin(b.desde));
    maxM = Math.max(maxM, toMin(b.hasta));
  });
  if (!isFinite(minM)) {
    minM = 8 * 60;
    maxM = 18 * 60;
  }
  minM = Math.floor(minM / 60) * 60;
  maxM = Math.ceil(maxM / 60) * 60;
  const hours: number[] = [];
  for (let t = minM; t < maxM; t += 60) hours.push(t);
  const bodyH = (maxM - minM) * PX;
  const cols = `38px repeat(${DAYS.length}, minmax(0, 1fr))`;

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

// ---- especificaciones completas por materia (programa analítico) -----------

/** Horario de la comisión elegida (día · franja · aula/sede · modalidad). */
function comHorarioHTML(com: Comision | null): string {
  if (!com || !com.slots.length) return "";
  const slots = com.slots
    .map((s) => {
      const aula = [s.sala ? "Aula " + esc(s.sala) : "", s.sede ? esc(s.sede) : ""]
        .filter(Boolean)
        .join(" · ");
      return `<li><span class="d">${esc(s.dia)}</span><span class="h">${esc(s.desde)}–${esc(s.hasta)}</span><span class="au">${aula}</span><span class="mo">${esc(s.modalidad || "—")}</span></li>`;
    })
    .join("");
  return `<div class="mat-com"><div class="mat-com__h">Comisión <b>${esc(com.comision)}</b></div><ul class="mat-slots">${slots}</ul></div>`;
}

/** Ficha compacta de una materia ("menos es más"): identidad + horario, un
 *  Resumen (puntos clave + evaluación) que carga la esencia, y abajo sólo lo
 *  complementario y escaneable — los contenidos (títulos del temario) y la
 *  bibliografía. Sin repetir objetivos/presentación/evaluación en prosa larga. */
function materiaSpecsHTML(x: PlacedMateria): string {
  const m = x.m;
  const ficha: Ficha | undefined = FICHAS[m.codigo];
  const r = RESUMENES[m.codigo];
  const ob = m.tipo === "obligatoria";
  const carga = ficha
    ? [
        ficha.cargaHoraria.total != null ? `${ficha.cargaHoraria.total} hs` : "",
        ficha.cargaHoraria.semanales != null
          ? `${ficha.cargaHoraria.semanales} hs/sem`
          : "",
      ]
        .filter(Boolean)
        .join(" · ")
    : "";
  const sub = [
    ob ? "Obligatoria" : "Electiva",
    `${m.creditos} créditos`,
    m.horario?.depto || (ficha ? ficha.departamento : ""),
    carga,
  ]
    .filter(Boolean)
    .map((s) => esc(s))
    .join(" · ");

  // Resumen: puntos clave + evaluación (de Electivas/build-resumenes.py).
  let resumenBox = "";
  if (r && (r.puntosClave.length || r.evaluacion.resumen)) {
    const pk = r.puntosClave.length
      ? `<div class="mat-res__col"><h4>Puntos clave</h4><ul class="mat-res__pk">${r.puntosClave
          .map((p) => `<li>${esc(p)}</li>`)
          .join("")}</ul></div>`
      : "";
    const ev = r.evaluacion.resumen
      ? `<div class="mat-res__col"><h4>Evaluación</h4><p>${esc(r.evaluacion.resumen)}</p></div>`
      : "";
    resumenBox = `<div class="mat-resumen">${pk}${ev}</div>`;
  }

  // Régimen (chips derivados del texto de evaluación: parciales/final/TP/…).
  const regimen = regimenChipsHTML(m.codigo);

  // Complementario (escaneable): sólo los contenidos (títulos del temario). La
  // bibliografía ya no va acá — se consolida y deduplica al final del documento.
  let body = "";
  if (ficha) {
    body = ficha.programa.length
      ? `<div class="mat-block"><h4>Contenidos del programa</h4><ul class="mat-temas">${ficha.programa
          .map((u) => `<li>${esc(u.titulo)}</li>`)
          .join("")}</ul></div>`
      : "";
  } else {
    body = `<p class="mat-soon">Programa analítico no disponible — próximamente.</p>`;
  }

  return `<section class="mat-spec">
    <div class="mat-spec__h">
      <span class="mat-spec__code">${esc(m.codigo)} · ${esc(m.abbr)}</span>
      <h3 class="mat-spec__t">${esc(m.nombre)}</h3>
      <p class="mat-spec__sub">${sub}</p>
      ${comHorarioHTML(x.com)}
    </div>
    ${regimen}
    ${resumenBox}
    ${body}
  </section>`;
}

/** Chips del régimen de aprobación de una materia (derivados de la ficha). */
function regimenChipsHTML(codigo: string): string {
  const d = charsOf(codigo);
  if (!d) return "";
  const chips: string[] = [];
  if (d.tieneParcial) chips.push("Parciales");
  if (d.tieneTP) chips.push("Trabajos prácticos");
  if (d.tieneFinal) chips.push("Examen final");
  if (d.promocionable === true && !d.tieneFinal) chips.push("Promociona sin final");
  if (d.asistenciaObligatoria)
    chips.push(
      d.asistenciaPct != null
        ? `Asistencia ${d.asistenciaPct}%`
        : "Asistencia obligatoria",
    );
  if (!chips.length) return "";
  return `<div class="mat-regimen"><span class="mat-regimen__lbl">Régimen</span>${chips
    .map((c) => `<span class="mat-regimen__chip">${esc(c)}</span>`)
    .join("")}</div>`;
}

/** Bloque "Programas de las materias" (dedup por código, orden por código). */
function specsSectionHTML(placed: PlacedMateria[]): string {
  const seen = new Set<string>();
  const uniq = placed
    .filter((x) => (seen.has(x.m.codigo) ? false : (seen.add(x.m.codigo), true)))
    .sort((a, b) => a.m.codigo.localeCompare(b.m.codigo));
  if (!uniq.length) return "";
  return `<section class="specs">
    <h2 class="specs__h">Programa por materia</h2>
    ${uniq.map(materiaSpecsHTML).join("")}
  </section>`;
}

// ---- secciones combinadas del cuatrimestre (vista nueva) -------------------

/** Filas compactas de materias (identidad + comisión + créditos), ordenadas por
 *  créditos desc. Compartido por la grilla del combinador y del plan por-cuatri. */
function materiaRowsHTML(placed: PlacedMateria[]): string {
  return placed
    .slice()
    .sort((x, y) => (y.m.creditos || 0) - (x.m.creditos || 0))
    .map((x) => {
      const com = x.com
        ? `Com. <span class="mono">${esc(x.com.comision)}</span>`
        : `<span class="muted">sin horario</span>`;
      return `<li class="mrow">
        <span class="mrow__abbr">${esc(x.m.abbr)}</span>
        <span class="mrow__name">${esc(x.m.nombre)}${x.m.tipo === "electiva" ? ' <span class="pill-el">electiva</span>' : ""}</span>
        <span class="mrow__com">${com}</span>
        <span class="mrow__cr">${esc(x.m.creditos)} cr</span>
      </li>`;
    })
    .join("");
}

/** Sección "Semana de cursada": grilla combinada + asincrónicos + roster. */
function weekSectionHTML(placed: PlacedMateria[], title: string): string {
  const cred = credOf(placed);
  const { blocks, asyncs } = computeCuatriBlocks(placed);
  const calHTML = blocks.length
    ? weekGridHTML(blocks)
    : `<p class="cg-empty">Sólo materias sin grilla semanal.</p>`;
  return `<section class="cuatri">
    <div class="cuatri__h">
      <h2>${esc(title)}</h2>
      <div class="cuatri__meta">${placed.length} materia${placed.length === 1 ? "" : "s"} · <b>${cred}</b> créditos</div>
    </div>
    <div class="cuatri__cal">
      ${calHTML}
      ${asyncRowHTML(asyncs)}
    </div>
    <ul class="mlist">${materiaRowsHTML(placed)}</ul>
  </section>`;
}

/** Extrae las instancias de evaluación (chips) y una pista de "cuándo" del texto
 *  de `evaluacion` de una ficha. Heurística determinista: sólo marca lo que
 *  aparece explícito; nunca inventa fechas (que casi nunca están en el PDF). */
function extractInstancias(ficha: Ficha): { chips: string[]; cuando: string } {
  const t = normTxt(ficha.evaluacion);
  const d = charsOf(ficha.codigo);
  const chips: string[] = [];

  // Parciales (con cantidad si el texto la explicita).
  const pm = t.match(
    /\b(un|una|uno|dos|tres|cuatro|cinco|1|2|3|4|5)\s+(?:examen(?:es)?\s+)?parcial(?:es)?\b/,
  );
  if (pm) {
    const n = numOf(pm[1]);
    chips.push(n > 1 ? `${n} parciales` : "1 parcial");
  } else if (/\bparciales\b/.test(t)) {
    chips.push("Parciales");
  } else if (/\bparcial\b/.test(t)) {
    chips.push("1 parcial");
  }

  // Trabajos prácticos (con cantidad si aparece).
  const tpm = t.match(
    /\b(un|una|dos|tres|cuatro|cinco|1|2|3|4|5)\s+trabajos?\s+practicos?\b/,
  );
  if (tpm) {
    const n = numOf(tpm[1]);
    chips.push(n > 1 ? `${n} TP` : "1 TP");
  } else if (d?.tieneTP) {
    chips.push("TP");
  }

  // Entregas / proyecto integrador.
  const em = t.match(/\b(un|una|dos|tres|cuatro|cinco|1|2|3|4|5)\s+entregas?\b/);
  if (em) chips.push(`${numOf(em[1])} entregas`);
  if (/\bproyecto\s+(final|especial|integrador|grupal)/.test(t))
    chips.push("Proyecto");

  if (/\bcoloquio\b/.test(t)) chips.push("Coloquio");
  if (d?.tieneFinal) chips.push("Examen final");
  if (/recuperatori/.test(t)) chips.push("Recuperatorio");

  // Pistas de "cuándo" (rara vez hay fechas; sí referencias relativas).
  const cuando: string[] = [];
  if (/mitad del cuatrimestre|a mitad|promediando|mediados de la cursada/.test(t))
    cuando.push("mitad del cuatrimestre");
  if (
    /al final del (curso|cuatrimestre)|final del cuatrimestre|hacia el final|al finalizar/.test(
      t,
    )
  )
    cuando.push("final del cuatrimestre");
  const sem = t.match(/semana\s+(\d+)/);
  if (sem) cuando.push(`semana ${sem[1]}`);

  return {
    chips: dedupBy(chips, (c) => c),
    cuando: dedupBy(cuando, (c) => c).join(" · "),
  };
}

/** Calendario de evaluaciones COMBINADO: una fila por materia (ordenadas por
 *  código) con sus instancias de evaluación y, si el texto lo explicita, cuándo.
 *  Vista única para todo el cuatrimestre — no se repite el detalle por materia. */
function combinedEvaluacionesHTML(placed: PlacedMateria[]): string {
  const seen = new Set<string>();
  const uniq = placed
    .filter((x) => (seen.has(x.m.codigo) ? false : (seen.add(x.m.codigo), true)))
    .sort((a, b) => a.m.codigo.localeCompare(b.m.codigo));
  if (!uniq.length) return "";

  const rows = uniq
    .map((x) => {
      const ficha: Ficha | undefined = FICHAS[x.m.codigo];
      if (!ficha) {
        return `<tr>
          <td class="ec-mat"><b>${esc(x.m.abbr)}</b> <span>${esc(x.m.nombre)}</span></td>
          <td class="ec-ins"><span class="ec-soon">Programa próximamente</span></td>
          <td class="ec-when">—</td>
        </tr>`;
      }
      const { chips, cuando } = extractInstancias(ficha);
      const insHTML = chips.length
        ? chips.map((c) => `<span class="ec-chip">${esc(c)}</span>`).join("")
        : `<span class="ec-soon">Ver programa de la materia</span>`;
      return `<tr>
        <td class="ec-mat"><b>${esc(x.m.abbr)}</b> <span>${esc(x.m.nombre)}</span></td>
        <td class="ec-ins">${insHTML}</td>
        <td class="ec-when">${cuando ? esc(cuando) : "—"}</td>
      </tr>`;
    })
    .join("");

  return `<section class="evalcal">
    <h2 class="evalcal__h">Calendario de evaluaciones</h2>
    <p class="evalcal__note">Instancias de evaluación de todas las materias del cuatrimestre. Las fechas exactas las fija cada cátedra al inicio de la cursada.</p>
    <table class="evalcal__t">
      <thead><tr><th>Materia</th><th>Instancias</th><th>Cuándo</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </section>`;
}

/** Carga horaria TOTAL del cuatrimestre: suma de las horas informadas por las
 *  fichas (obligatorias sin ficha no aportan y se aclara en la nota). */
function cargaHorariaTotalHTML(placed: PlacedMateria[]): string {
  const seen = new Set<string>();
  const uniq = placed.filter((x) =>
    seen.has(x.m.codigo) ? false : (seen.add(x.m.codigo), true),
  );
  let total = 0;
  let semanales = 0;
  let teoricas = 0;
  let practicas = 0;
  let laboratorio = 0;
  let conFicha = 0;
  for (const x of uniq) {
    const f = FICHAS[x.m.codigo];
    if (!f) continue;
    const c = f.cargaHoraria;
    const has =
      c.total != null ||
      c.semanales != null ||
      c.teoricas != null ||
      c.practicas != null ||
      c.laboratorio != null;
    if (!has) continue;
    conFicha += 1;
    total += c.total ?? 0;
    semanales += c.semanales ?? 0;
    teoricas += c.teoricas ?? 0;
    practicas += c.practicas ?? 0;
    laboratorio += c.laboratorio ?? 0;
  }
  if (conFicha === 0) return "";

  const cell = (b: string, span: string, accent = false) =>
    `<div class="carga__c${accent ? " accent" : ""}"><b>${esc(b)}</b><span>${esc(span)}</span></div>`;
  const cells = [
    total > 0 ? cell(`${total} hs`, "total cuatrimestre", true) : "",
    semanales > 0 ? cell(`${semanales} hs`, "por semana") : "",
    teoricas > 0 ? cell(`${teoricas} hs`, "teóricas") : "",
    practicas > 0 ? cell(`${practicas} hs`, "prácticas") : "",
    laboratorio > 0 ? cell(`${laboratorio} hs`, "laboratorio") : "",
  ]
    .filter(Boolean)
    .join("");
  const nota =
    conFicha < uniq.length
      ? `<p class="carga__note">Suma de ${conFicha} de ${uniq.length} materias con carga horaria informada (las obligatorias sin programa analítico no aportan al total).</p>`
      : "";
  return `<section class="carga">
    <h2 class="carga__h">Carga horaria del cuatrimestre</h2>
    <div class="carga__grid">${cells}</div>
    ${nota}
  </section>`;
}

/** Limpia una entrada de bibliografía (espacios y números de página sueltos que
 *  quedan del parseo del PDF, p. ej. "…Gedisa. 5"). */
function cleanBiblio(s: string): string {
  return s.replace(/\s+/g, " ").replace(/[.\s]+\d{1,3}\s*$/, "").trim();
}

/** Bibliografía CONSOLIDADA: obligatoria + complementaria de todas las materias,
 *  deduplicada (por título normalizado) y ordenada, en una sola lista. */
function consolidatedBibliografiaHTML(placed: PlacedMateria[]): string {
  const seen = new Set<string>();
  const entries: string[] = [];
  const push = (raw: string) => {
    const clean = cleanBiblio(raw);
    if (!clean) return;
    const key = normTxt(clean).replace(/[^a-z0-9]+/g, " ").trim();
    if (!key || seen.has(key)) return;
    seen.add(key);
    entries.push(clean);
  };
  // Materias por código (dedup) para no procesar dos veces una repetida.
  const codes = new Set<string>();
  for (const x of placed) {
    if (codes.has(x.m.codigo)) continue;
    codes.add(x.m.codigo);
    const f = FICHAS[x.m.codigo];
    if (!f) continue;
    f.bibliografiaObligatoria.forEach(push);
    f.bibliografiaComplementaria.forEach(push);
  }
  if (!entries.length) return "";
  entries.sort((a, b) => normTxt(a).localeCompare(normTxt(b)));
  return `<section class="biblio">
    <h2 class="biblio__h">Bibliografía consolidada</h2>
    <p class="biblio__note">${entries.length} títulos (obligatoria y complementaria) de las materias del cuatrimestre, sin repetir.</p>
    <ul class="biblio__list">${entries
      .map((e) => `<li>${esc(e)}</li>`)
      .join("")}</ul>
  </section>`;
}

/** Cuerpo combinado de UN cuatrimestre en el orden nuevo: grilla + calendario de
 *  evaluaciones (bajo `includeCalendar`) y carga horaria + programa por materia +
 *  bibliografía consolidada (bajo `includeSpecs`). Compartido por el combinador
 *  y por el plan cuando se exporta un solo cuatrimestre. */
function combinedCuatriSectionsHTML(
  placed: PlacedMateria[],
  includeCalendar: boolean,
  includeSpecs: boolean,
  weekTitle: string,
): string {
  const parts: string[] = [];
  if (includeCalendar) {
    parts.push(weekSectionHTML(placed, weekTitle));
    parts.push(combinedEvaluacionesHTML(placed));
  }
  if (includeSpecs) {
    parts.push(cargaHorariaTotalHTML(placed));
    parts.push(specsSectionHTML(placed));
    parts.push(consolidatedBibliografiaHTML(placed));
  }
  return parts.filter(Boolean).join("\n");
}

// ---- estilos compartidos ----------------------------------------------------

const BASE_CSS = `
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
  header.doc{border-bottom:2px solid var(--ink);padding-bottom:14px;margin-bottom:18px}
  header.doc .kick{font-family:"SFMono-Regular",Menlo,monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--coral);margin:0 0 6px}
  header.doc h1{font-size:26px;margin:0 0 4px;letter-spacing:-.01em}
  header.doc .gen{color:var(--muted);font-size:12.5px;font-family:"SFMono-Regular",Menlo,monospace}
  .summary{display:flex;flex-wrap:wrap;gap:0;border:1px solid var(--line);border-radius:10px;overflow:hidden;margin-bottom:10px;background:var(--panel)}
  .summary .s{flex:1;min-width:140px;padding:11px 16px;border-right:1px solid var(--line)}
  .summary .s:last-child{border-right:none}
  .summary .s b{display:block;font-size:21px;line-height:1.1}
  .summary .s span{display:block;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-top:5px;font-family:"SFMono-Regular",Menlo,monospace}
  .summary .s.accent b{color:var(--coral)}
  .meta-note{font-size:11.5px;color:var(--muted);margin:0 0 18px;line-height:1.5}
  /* cada cuatrimestre es un bloque que no se parte: si no entra, salta de página */
  section.cuatri{border:1px solid var(--line);border-radius:10px;background:var(--panel);margin-bottom:13px;overflow:hidden;page-break-inside:avoid;break-inside:avoid}
  .cuatri__h{display:flex;align-items:baseline;justify-content:space-between;gap:14px;flex-wrap:wrap;padding:10px 16px;border-bottom:1px solid var(--line);background:#f6efe7}
  .cuatri__h h2{font-size:16px;margin:0}
  .cuatri__h .tag{font-family:"SFMono-Regular",Menlo,monospace;font-size:10.5px;color:var(--slate);border:1px solid var(--line);border-radius:5px;padding:1px 6px;margin-left:6px;vertical-align:middle}
  .cuatri__meta{font-family:"SFMono-Regular",Menlo,monospace;font-size:12px;color:var(--soft)}
  .cuatri__meta b{color:var(--ink)}
  /* lista compacta de materias (una fila por materia) */
  .mlist{list-style:none;margin:0;padding:0}
  .mrow{display:flex;align-items:baseline;gap:10px;padding:7px 16px;border-bottom:1px solid var(--line)}
  .mrow:last-child{border-bottom:none}
  .mrow__abbr{font-weight:bold;font-size:12.5px;min-width:64px;flex:none}
  .mrow__name{flex:1;min-width:0;font-size:12.5px;color:var(--ink)}
  .mrow__com{font-family:"SFMono-Regular",Menlo,monospace;font-size:10.5px;color:var(--soft);flex:none;white-space:nowrap}
  .mrow__cr{font-family:"SFMono-Regular",Menlo,monospace;font-size:11px;color:var(--soft);flex:none;min-width:42px;text-align:right}
  .pill-el{font-family:"SFMono-Regular",Menlo,monospace;font-size:9px;letter-spacing:.05em;text-transform:uppercase;color:var(--coral);border:1px solid var(--line);border-radius:4px;padding:1px 5px;vertical-align:middle}
  .grad{margin-top:8px;border:1px solid var(--coral);background:#fbeee6;border-radius:10px;padding:16px 20px;page-break-inside:avoid}
  .grad .kick{font-family:"SFMono-Regular",Menlo,monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--coral);margin:0}
  .grad h2{margin:3px 0 2px;font-size:20px}
  .grad p{margin:0;color:var(--soft);font-family:"SFMono-Regular",Menlo,monospace;font-size:13px}
  footer.doc{margin-top:26px;border-top:1px solid var(--line);padding-top:12px;color:var(--muted);font-size:11px;font-family:"SFMono-Regular",Menlo,monospace}
  /* ---- calendario semanal por cuatrimestre ---- */
  .cuatri__cal{padding:11px 16px 12px;border-bottom:1px solid var(--line)}
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
  .cg-blk__abbr{font-family:Georgia,"Times New Roman",serif;font-weight:bold;font-size:12px;line-height:1.12;color:var(--ink);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;overflow:hidden;overflow-wrap:break-word}
  .cg-blk__time{font-family:"SFMono-Regular",Menlo,monospace;font-size:9.5px;color:var(--soft);line-height:1.2}
  .cg-blk__room{font-family:"SFMono-Regular",Menlo,monospace;font-size:8.5px;color:var(--muted);margin-top:auto}
  .cg-blk.is-conf{border-color:#9c3b2e !important;border-left-color:#9c3b2e !important;box-shadow:0 0 0 1px #9c3b2e}
  .cg-async{margin-top:11px;display:flex;flex-wrap:wrap;gap:7px;align-items:center}
  .cg-async__lbl{font-family:"SFMono-Regular",Menlo,monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
  .cg-async__chip{font-family:"SFMono-Regular",Menlo,monospace;font-size:10px;padding:3px 8px;border-radius:4px;background:#f6efe7;border:1px solid var(--line);color:var(--soft)}
`;

// Estilos del bloque "Programas de las materias" (specs completas).
const SPECS_CSS = `
  .specs{margin-top:24px}
  .specs__h{font-size:19px;margin:0 0 16px;padding-bottom:8px;border-bottom:2px solid var(--ink)}
  .mat-spec{margin:0 0 22px;padding:0 0 18px;border-bottom:1px solid var(--line)}
  .mat-spec:last-child{border-bottom:none;margin-bottom:0}
  .mat-spec__h{page-break-inside:avoid;break-inside:avoid;margin-bottom:10px}
  .mat-spec__code{font-family:"SFMono-Regular",Menlo,monospace;font-size:11px;color:var(--coral);letter-spacing:.05em}
  .mat-spec__t{font-size:19px;margin:4px 0 3px;line-height:1.15}
  .mat-spec__sub{font-family:"SFMono-Regular",Menlo,monospace;font-size:11.5px;color:var(--soft);margin:0}
  .mat-com{margin-top:10px;border:1px solid var(--line);border-radius:8px;background:var(--panel);padding:8px 12px}
  .mat-com__h{font-size:12px;color:var(--ink)}
  .mat-com__cupo{font-family:"SFMono-Regular",Menlo,monospace;font-size:10.5px;color:var(--muted)}
  .mat-slots{list-style:none;margin:6px 0 0;padding:0}
  .mat-slots li{display:flex;gap:10px;flex-wrap:wrap;font-size:11.5px;padding:2px 0;border-top:1px dashed var(--line)}
  .mat-slots li:first-child{border-top:none}
  .mat-slots .d{font-weight:bold;min-width:70px}
  .mat-slots .h{font-family:"SFMono-Regular",Menlo,monospace;color:var(--soft);min-width:92px}
  .mat-slots .au{color:var(--soft);flex:1;min-width:110px}
  .mat-slots .mo{font-family:"SFMono-Regular",Menlo,monospace;font-size:10.5px;color:var(--muted)}
  .mat-com__profs{font-size:10.5px;color:var(--muted);margin:6px 0 0}
  .mat-carga{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}
  .mat-carga span{font-family:"SFMono-Regular",Menlo,monospace;font-size:10.5px;color:var(--soft);background:var(--panel);border:1px solid var(--line);border-radius:5px;padding:3px 8px}
  .mat-carga b{color:var(--coral);font-weight:600}
  .mat-block{margin:12px 0}
  .mat-block h4{font-family:"SFMono-Regular",Menlo,monospace;font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--coral);margin:0 0 5px}
  .mat-block p{font-size:12.5px;line-height:1.6;color:var(--ink);margin:0 0 7px}
  .mat-units{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:5px}
  .mat-units li{font-size:12px;line-height:1.5}
  .mat-temas{margin:0;padding-left:18px;columns:2;column-gap:28px}
  .mat-temas li{font-size:11.5px;line-height:1.45;color:var(--ink);margin-bottom:3px;break-inside:avoid}
  .mat-biblio{margin:0 0 10px;padding-left:20px;display:flex;flex-direction:column;gap:4px}
  .mat-biblio li{font-size:11.5px;line-height:1.45;color:var(--soft)}
  .mat-biblio__lbl{font-family:"SFMono-Regular",Menlo,monospace;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:0 0 5px}
  .mat-soon{font-size:12px;color:var(--muted);font-style:italic;margin:8px 0 0}
  /* caja "resumen" (puntos clave + evaluación) antes del programa completo */
  .mat-resumen{display:flex;flex-wrap:wrap;gap:12px 26px;margin:10px 0 14px;padding:12px 16px;border:1px solid var(--line);border-left:3px solid var(--coral);border-radius:8px;background:#f9f2ea;page-break-inside:avoid;break-inside:avoid}
  .mat-res__col{flex:1;min-width:220px}
  .mat-res__col h4{font-family:"SFMono-Regular",Menlo,monospace;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--coral);margin:0 0 6px}
  .mat-res__col p{font-size:12px;line-height:1.5;color:var(--ink);margin:0}
  .mat-res__pk{margin:0;padding-left:16px;display:flex;flex-direction:column;gap:4px}
  .mat-res__pk li{font-size:11.5px;line-height:1.45;color:var(--ink)}
  /* chips del régimen de aprobación por materia */
  .mat-regimen{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:10px 0 2px}
  .mat-regimen__lbl{font-family:"SFMono-Regular",Menlo,monospace;font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
  .mat-regimen__chip{font-family:"SFMono-Regular",Menlo,monospace;font-size:10px;padding:2px 8px;border-radius:999px;background:#f6efe7;border:1px solid var(--line);color:var(--soft)}
  @media print{ .specs__h,.mat-spec__t{page-break-after:avoid} }
`;

// Estilos de las secciones combinadas nuevas (calendario de evaluaciones,
// carga horaria total y bibliografía consolidada).
const COMBINED_CSS = `
  /* ---- calendario de evaluaciones combinado ---- */
  .evalcal{margin-top:22px}
  .evalcal__h{font-size:17px;margin:0 0 4px;padding-bottom:7px;border-bottom:2px solid var(--ink)}
  .evalcal__note{font-size:11.5px;color:var(--muted);margin:8px 0 10px;line-height:1.5}
  .evalcal__t{width:100%;border-collapse:collapse;font-size:12px}
  .evalcal__t thead th{text-align:left;font-family:"SFMono-Regular",Menlo,monospace;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);padding:0 10px 6px;border-bottom:1px solid var(--line)}
  .evalcal__t tbody tr{border-bottom:1px solid var(--line);page-break-inside:avoid;break-inside:avoid}
  .evalcal__t td{padding:8px 10px;vertical-align:top}
  .ec-mat{white-space:nowrap}
  .ec-mat b{font-size:12.5px}
  .ec-mat span{color:var(--soft);font-size:11px}
  .ec-ins{width:56%}
  .ec-chip{display:inline-block;font-family:"SFMono-Regular",Menlo,monospace;font-size:10px;padding:2px 8px;margin:0 5px 4px 0;border-radius:999px;background:#f9f2ea;border:1px solid var(--line);color:var(--ink)}
  .ec-soon{font-size:11px;font-style:italic;color:var(--muted)}
  .ec-when{font-family:"SFMono-Regular",Menlo,monospace;font-size:10.5px;color:var(--soft);white-space:nowrap}
  /* ---- carga horaria total ---- */
  .carga{margin-top:22px}
  .carga__h{font-size:17px;margin:0 0 12px;padding-bottom:7px;border-bottom:2px solid var(--ink)}
  .carga__grid{display:flex;flex-wrap:wrap;gap:0;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--panel)}
  .carga__c{flex:1;min-width:120px;padding:11px 16px;border-right:1px solid var(--line)}
  .carga__c:last-child{border-right:none}
  .carga__c b{display:block;font-size:19px;line-height:1.1}
  .carga__c span{display:block;font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);margin-top:5px;font-family:"SFMono-Regular",Menlo,monospace}
  .carga__c.accent b{color:var(--coral)}
  .carga__note{font-size:11px;color:var(--muted);margin:9px 0 0;line-height:1.5}
  /* ---- bibliografía consolidada ---- */
  .biblio{margin-top:22px}
  .biblio__h{font-size:17px;margin:0 0 4px;padding-bottom:7px;border-bottom:2px solid var(--ink)}
  .biblio__note{font-size:11.5px;color:var(--muted);margin:8px 0 10px;line-height:1.5}
  .biblio__list{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:5px}
  .biblio__list li{font-size:11.5px;line-height:1.45;color:var(--soft);break-inside:avoid}
  @media print{ .evalcal__h,.carga__h,.biblio__h{page-break-after:avoid} }
`;

const PAGE_CSS = `
  @page{size:A4;margin:14mm}
  @media print{ .wrap{padding:0;max-width:none} body{background:#fff} }
`;

/** Envuelve el contenido en un documento HTML autocontenido e imprimible. */
function docPage(title: string, inner: string, autoPrint?: boolean): string {
  const autoPrintScript = autoPrint
    ? `<script>window.addEventListener('load',function(){setTimeout(function(){window.focus();window.print();},250);});</script>`
    : "";
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>${BASE_CSS}${SPECS_CSS}${COMBINED_CSS}${PAGE_CSS}</style>
${autoPrintScript}
</head>
<body>
<div class="wrap">
${inner}
</div>
</body>
</html>`;
}

// ---- export del PLAN de cursada (multi-cuatrimestre) -----------------------

export interface ExportArgs {
  result: PlanResult;
  start: PlanStart;
  maxCred: number;
  maxMat: number;
  avoid: boolean;
  approvedCreditsNow: number;
  generado: string; // fecha legible
  autoPrint?: boolean;
  /** incluir las especificaciones completas de cada materia (default true). */
  includeSpecs?: boolean;
  /** incluir las secciones de calendario/cuatrimestre (default true). Combinado
   *  con `includeSpecs` cubre las 3 opciones de descarga:
   *    solo calendario     → includeCalendar:true,  includeSpecs:false
   *    calendario+programa  → ambos true (default)
   *    solo programa        → includeCalendar:false, includeSpecs:true */
  includeCalendar?: boolean;
  /** índices de cuatrimestre a incluir; si se omite, se incluyen todos. */
  cuatris?: number[];
  /** método de optimización usado (ajusta el objetivo que declara el meta-note
   *  del documento multi-cuatrimestre). Default "cuatris" para no romper los
   *  call-sites que todavía no lo pasan. */
  method?: OptMethod;
}

/** Objetivo del meta-note según el método de optimización elegido. */
const METHOD_NOTE: Record<OptMethod, string> = {
  cuatris: "minimiza la cantidad de cuatrimestres",
  dias: "concentra la cursada en la menor cantidad de días por semana",
  balance: "reparte créditos y materias de forma pareja entre los cuatrimestres",
};

export function buildPlanHTML(a: ExportArgs): string {
  const { result: R, start, approvedCreditsNow } = a;
  const sel = a.cuatris && a.cuatris.length ? new Set(a.cuatris) : null;
  const used = R.items
    .map((it, i) => ({ it, i }))
    .filter((x) => x.it.length && (!sel || sel.has(x.i)));
  const flat = used.flatMap((u) => u.it);
  const totalCred = flat.reduce((s, x) => s + (x.m.creditos || 0), 0);
  const finalCred = approvedCreditsNow + totalCred;
  const elecPlan = flat
    .filter((x) => x.m.tipo === "electiva")
    .reduce((s, x) => s + (x.m.creditos || 0), 0);
  const lastIdx = used.length ? used[used.length - 1].i : 0;
  const gradCu = cuatriAt(start, lastIdx);

  // Exportar UN solo cuatrimestre → estructura combinada nueva (idéntica al
  // combinador): portada + grilla + calendario de evaluaciones + carga horaria +
  // programa por materia + bibliografía consolidada, respetando los flags.
  if (used.length === 1) {
    const only = used[0];
    const cu = cuatriAt(start, only.i);
    const cred = credOf(only.it);
    const { blocks } = computeCuatriBlocks(only.it);
    const dias = new Set(blocks.map((b) => b.dia)).size;
    const includeCalendar = a.includeCalendar !== false;
    const includeSpecs = a.includeSpecs !== false;
    const inner = `<header class="doc">
    <p class="kick">StudyVaults · ITBA</p>
    <h1>Plan de cursada</h1>
    <p class="gen">${esc(cuatriName(cu))} · Generado el ${esc(a.generado)}</p>
  </header>

  <div class="summary">
    <div class="s accent"><b>${esc(cuatriName(cu))}</b><span>cuatrimestre</span></div>
    <div class="s"><b>${only.it.length}</b><span>materia${only.it.length === 1 ? "" : "s"}</span></div>
    <div class="s"><b>${cred}</b><span>créditos</span></div>
    <div class="s"><b>${dias}</b><span>día${dias === 1 ? "" : "s"} en el campus</span></div>
  </div>

  ${combinedCuatriSectionsHTML(only.it, includeCalendar, includeSpecs, "Semana de cursada")}

  <footer class="doc">Plan de cursada · ${esc(cuatriName(cu))} · studyvaults · ITBA</footer>`;
    return docPage("Plan de cursada — ITBA", inner, a.autoPrint);
  }

  const cuatriSection = ({ it, i }: { it: PlacedMateria[]; i: number }) => {
    const cu = cuatriAt(start, i);
    const cred = credOf(it);
    const { blocks, asyncs } = computeCuatriBlocks(it);
    const calHTML = blocks.length
      ? weekGridHTML(blocks)
      : `<p class="cg-empty">Sólo materias sin grilla semanal.</p>`;
    // Lista compacta de materias: identidad + créditos + comisión. La grilla de
    // arriba ya muestra los horarios, así que no repetimos el detalle.
    return `<section class="cuatri">
      <div class="cuatri__h">
        <h2>${esc(cuatriName(cu))} <span class="tag">${esc(cuatriLabel(cu))}</span></h2>
        <div class="cuatri__meta">${it.length} materia${it.length === 1 ? "" : "s"} · <b>${cred}</b> créditos</div>
      </div>
      <div class="cuatri__cal">
        ${calHTML}
        ${asyncRowHTML(asyncs)}
      </div>
      <ul class="mlist">${materiaRowsHTML(it)}</ul>
    </section>`;
  };

  const sectionsHTML =
    a.includeCalendar === false ? "" : used.map(cuatriSection).join("");
  // La bibliografía se movió de cada materia a una lista consolidada; en el plan
  // multi-cuatri se agrega al final (dedup sobre todas las materias del plan)
  // para no perderla.
  const specsHTML =
    a.includeSpecs === false
      ? ""
      : specsSectionHTML(flat) + consolidatedBibliografiaHTML(flat);

  const inner = `<header class="doc">
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
    Optimización: ${METHOD_NOTE[a.method ?? "cuatris"]} priorizando obligatorias, el camino crítico de
    correlativas y los créditos; las comisiones se eligen para concentrar la cursada en menos días.
    Tope por cuatrimestre: ${a.maxCred} créditos y ${a.maxMat} materias${a.avoid ? " · evitando superposiciones (incluye traslados entre sedes)" : ""}.
  </p>

  ${sectionsHTML}

  <div class="grad">
    <p class="kick">Meta</p>
    <h2>¡Recibido!</h2>
    <p>${finalCred} créditos · ${esc(cuatriName(gradCu))}</p>
  </div>

  ${specsHTML}

  <footer class="doc">Plan de cursada · ${elecPlan} créditos electivos en este plan · studyvaults</footer>`;

  return docPage("Plan de cursada — ITBA", inner, a.autoPrint);
}

// ---- export de la COMBINACIÓN elegida (un cuatrimestre) --------------------

export interface ComboExportArgs {
  placed: PlacedMateria[]; // la combinación elegida (materia + comisión)
  generado: string;
  periodo?: string; // ej. "2.º cuatrimestre 2026"
  autoPrint?: boolean;
  /** incluir la sección de calendario/semana (default true). */
  includeCalendar?: boolean;
  /** incluir las especificaciones por materia (default true). Ver ExportArgs. */
  includeSpecs?: boolean;
}

export function buildComboHTML(a: ComboExportArgs): string {
  const { placed } = a;
  const cred = credOf(placed);
  const { blocks } = computeCuatriBlocks(placed);
  const dias = new Set(blocks.map((b) => b.dia)).size;
  const includeCalendar = a.includeCalendar !== false;
  const includeSpecs = a.includeSpecs !== false;

  const inner = `<header class="doc">
    <p class="kick">StudyVaults · ITBA</p>
    <h1>Programa de cursada</h1>
    <p class="gen">${a.periodo ? esc(a.periodo) + " · " : ""}Generado el ${esc(a.generado)}</p>
  </header>

  <div class="summary">
    <div class="s accent"><b>${placed.length}</b><span>materias</span></div>
    <div class="s"><b>${cred}</b><span>créditos</span></div>
    <div class="s"><b>${dias}</b><span>día${dias === 1 ? "" : "s"} en el campus</span></div>
  </div>

  ${combinedCuatriSectionsHTML(placed, includeCalendar, includeSpecs, "Semana de cursada")}

  <footer class="doc">Programa de cursada · studyvaults · ITBA</footer>`;

  return docPage("Programa de cursada — ITBA", inner, a.autoPrint);
}
