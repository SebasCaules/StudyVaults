// Optimizador del plan de cursada.
// Objetivo: minimizar la cantidad de cuatrimestres hasta recibirse y, dentro de
// cada cuatrimestre, armar un horario lo más compacto posible.
//
// Estrategia (mejora sobre el FFD original):
//  1. Prioridad por CAMINO CRÍTICO: las materias que destraban cadenas largas de
//     correlativas se ubican primero. El piso de cuatrimestres está acotado por la
//     cadena de correlativas más larga, así que adelantarlas evita alargar el plan.
//  2. Empaquetado FFD por créditos para llenar cada cuatrimestre.
//  3. Selección de comisión que minimiza los días distintos en el campus
//     (horario compacto), respetando "evitar superposiciones".
//  4. Compactación: adelanta materias de cuatrimestres tardíos a previos de igual
//     paridad que tengan lugar.
import { byId } from "./model";
import { approvedCredits } from "./metrics";
import { comConflict, isAsync } from "./time";
import type {
  Comision,
  MateriaM,
  PlacedMateria,
  PlanResult,
  PlanStart,
  PlanState,
} from "./types";

export const cuatriAt = (start: PlanStart, i: number): PlanStart => {
  let p = start.parity;
  let y = start.year;
  for (let k = 0; k < i; k++) {
    if (p === 2) {
      p = 1;
      y++;
    } else p = 2;
  }
  return { parity: p, year: y };
};

export const cuatriLabel = (c: PlanStart) =>
  (c.parity === 1 ? "1c" : "2c") + "-" + String(c.year).slice(-2);
export const cuatriName = (c: PlanStart) =>
  (c.parity === 1 ? "1.º" : "2.º") + " cuat. " + c.year;

/* ---------- helpers de comisión / horario ---------- */

// Días distintos (no asincrónicos) que ocupa una comisión.
const comDays = (com: Comision): Set<string> => {
  const s = new Set<string>();
  for (const sl of com.slots) if (!isAsync(sl)) s.add(sl.dia);
  return s;
};

// Días ya ocupados por las materias puestas en un cuatrimestre.
const usedDaysOf = (placed: PlacedMateria[]): Set<string> => {
  const u = new Set<string>();
  for (const x of placed) if (x.com) for (const d of comDays(x.com)) u.add(d);
  return u;
};

// ¿Hay alguna comisión sin superposición con lo ya puesto en el cuatrimestre?
const hasFreeCom = (coms: Comision[], placed: PlacedMateria[]): boolean =>
  coms.some((c) => !placed.some((x) => x.com && comConflict(x.com, c)));

// Elige la comisión más compacta: menos días nuevos en el campus, luego menos
// días en total, luego orden original. En modo `avoid` prefiere comisiones sin
// superposición; si no hay ninguna, cae a la mejor igual (el llamador decide si
// la ubica o no vía hasFreeCom).
const chooseCom = (
  coms: Comision[],
  placed: PlacedMateria[],
  avoid: boolean,
): Comision | null => {
  if (!coms.length) return null;
  const free = avoid
    ? coms.filter((c) => !placed.some((x) => x.com && comConflict(x.com, c)))
    : coms;
  const cand = free.length ? free : coms;
  const used = usedDaysOf(placed);
  let best = cand[0];
  let bestScore = Infinity;
  cand.forEach((c, idx) => {
    const days = comDays(c);
    let extra = 0;
    days.forEach((d) => {
      if (!used.has(d)) extra++;
    });
    // peso: días nuevos ≫ días totales ≫ orden de la cátedra
    const score = extra * 1000 + days.size * 10 + idx;
    if (score < bestScore) {
      bestScore = score;
      best = c;
    }
  });
  return best;
};

export function optimizePlan(
  PL: PlanState,
  approved: Set<string>,
): PlanResult {
  const mats = [...PL.pool]
    .filter((c) => !approved.has(c))
    .map((c) => byId.get(c))
    .filter(Boolean) as MateriaM[];

  // --- camino crítico: profundidad de dependientes dentro del pool restante ---
  const codeSet = new Set(mats.map((m) => m.codigo));
  const dependents = new Map<string, string[]>();
  for (const m of mats) {
    for (const c of m.correlativas || []) {
      if (!codeSet.has(c)) continue; // correlativa ya aprobada → no cuenta
      const arr = dependents.get(c);
      if (arr) arr.push(m.codigo);
      else dependents.set(c, [m.codigo]);
    }
  }
  const depthMemo = new Map<string, number>();
  const visiting = new Set<string>();
  const depthOf = (code: string): number => {
    const memo = depthMemo.get(code);
    if (memo !== undefined) return memo;
    if (visiting.has(code)) return 0; // guard anti-ciclo
    visiting.add(code);
    let d = 0;
    for (const ch of dependents.get(code) || []) {
      const cd = 1 + depthOf(ch);
      if (cd > d) d = cd;
    }
    visiting.delete(code);
    depthMemo.set(code, d);
    return d;
  };

  // orden de cursada: obligatoria › camino crítico › más créditos (FFD) ›
  // mayor requisito de créditos › código
  const order = (a: MateriaM, b: MateriaM) =>
    (a.tipo === b.tipo ? 0 : a.tipo === "obligatoria" ? -1 : 1) ||
    depthOf(b.codigo) - depthOf(a.codigo) ||
    (b.creditos || 0) - (a.creditos || 0) ||
    (b.creditosReq || 0) - (a.creditosReq || 0) ||
    a.codigo.localeCompare(b.codigo);

  const N = 14;
  const items: PlacedMateria[][] = Array.from({ length: N }, () => []);
  const placedIdx: Record<string, number> = {};
  let acc = approvedCredits(approved);
  let remaining = mats.slice();
  const prereqDone = (m: MateriaM, i: number) =>
    (m.correlativas || []).every(
      (c) =>
        approved.has(c) || (placedIdx[c] !== undefined && placedIdx[c] < i),
    );

  for (let i = 0; i < N && remaining.length; i++) {
    const cu = cuatriAt(PL.start, i);
    const place = (m: MateriaM) => {
      const coms = (m.horario && m.horario.comisiones) || [];
      items[i].push({ m, com: chooseCom(coms, items[i], PL.avoid) });
      placedIdx[m.codigo] = i;
    };
    // materias fijadas a este cuatrimestre van sí o sí
    remaining.filter((m) => PL.fixed.get(m.codigo) === i).forEach(place);
    remaining = remaining.filter((m) => placedIdx[m.codigo] === undefined);

    const cand = remaining
      .filter((m) => {
        const fx = PL.fixed.get(m.codigo);
        if (fx !== undefined && fx !== null && fx !== i) return false;
        if (m.parity !== null && m.parity !== cu.parity) return false;
        if ((m.creditosReq || 0) > acc) return false;
        return prereqDone(m, i);
      })
      .sort(order);

    for (const m of cand) {
      if (items[i].length >= PL.maxMat) break;
      const cred = items[i].reduce((s, x) => s + (x.m.creditos || 0), 0);
      if (items[i].length > 0 && cred + (m.creditos || 0) > PL.maxCred) continue;
      const coms = (m.horario && m.horario.comisiones) || [];
      // en modo avoid, no la ubico si no hay comisión sin superposición
      if (PL.avoid && coms.length && !hasFreeCom(coms, items[i])) continue;
      place(m);
    }
    remaining = remaining.filter((m) => placedIdx[m.codigo] === undefined);
    acc += items[i].reduce((s, x) => s + (x.m.creditos || 0), 0);
  }

  // --- compactación: adelantar materias de cuatris tardíos a previos de igual paridad con lugar ---
  const credOfCuatri = (it: PlacedMateria[]) =>
    it.reduce((s, x) => s + (x.m.creditos || 0), 0);
  let moved = 0;
  let changed = true;
  let guard = 0;
  while (changed && guard++ < 300) {
    changed = false;
    const accB: number[] = [];
    let a2 = approvedCredits(approved);
    for (let i = 0; i < N; i++) {
      accB[i] = a2;
      a2 += credOfCuatri(items[i]);
    }
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
          if (
            !(it.m.correlativas || []).every(
              (c) =>
                approved.has(c) ||
                (placedIdx[c] !== undefined && placedIdx[c] < j),
            )
          )
            continue;
          if (items[j].length >= PL.maxMat) continue;
          if (credOfCuatri(items[j]) + (it.m.creditos || 0) > PL.maxCred)
            continue;
          const comsM = (it.m.horario && it.m.horario.comisiones) || [];
          let comJ = it.com;
          if (comsM.length) {
            if (PL.avoid && !hasFreeCom(comsM, items[j])) continue;
            comJ = chooseCom(comsM, items[j], PL.avoid);
          }
          it.com = comJ;
          items[i] = items[i].filter((x) => x !== it);
          items[j].push(it);
          placedIdx[it.m.codigo] = j;
          moved++;
          changed = true;
          done = true;
          break;
        }
        if (done) break;
      }
    }
  }

  const accBefore2: number[] = [];
  let a3 = approvedCredits(approved);
  for (let i = 0; i < N; i++) {
    accBefore2[i] = a3;
    a3 += credOfCuatri(items[i]);
  }
  return { items, unplaced: remaining, accBefore: accBefore2, moved };
}
