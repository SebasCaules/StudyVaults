// Optimizador del plan de cursada. PORTADO VERBATIM de planner.js (optimizePlan):
// FFD por créditos + compactación. Solo se cambió `state.*` por parámetros.
import { byId, packSort } from "./model";
import { approvedCredits } from "./metrics";
import { comConflict } from "./time";
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

export function optimizePlan(
  PL: PlanState,
  approved: Set<string>,
): PlanResult {
  const mats = [...PL.pool]
    .filter((c) => !approved.has(c))
    .map((c) => byId.get(c))
    .filter(Boolean) as MateriaM[];
  const N = 14;
  const items: PlacedMateria[][] = Array.from({ length: N }, () => []);
  const placedIdx: Record<string, number> = {};
  let acc = approvedCredits(approved);
  const accBefore: number[] = [];
  let remaining = mats.slice();
  const prereqDone = (m: MateriaM, i: number) =>
    (m.correlativas || []).every(
      (c) =>
        approved.has(c) || (placedIdx[c] !== undefined && placedIdx[c] < i),
    );

  for (let i = 0; i < N && remaining.length; i++) {
    accBefore[i] = acc;
    const cu = cuatriAt(PL.start, i);
    const pick = (m: MateriaM): Comision | null => {
      const coms = (m.horario && m.horario.comisiones) || [];
      if (!coms.length) return null;
      if (!PL.avoid) return coms[0];
      return (
        coms.find(
          (c) => !items[i].some((x) => x.com && comConflict(x.com, c)),
        ) || coms[0]
      );
    };
    const place = (m: MateriaM) => {
      items[i].push({ m, com: pick(m) });
      placedIdx[m.codigo] = i;
    };
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
      .sort(packSort);
    for (const m of cand) {
      if (items[i].length >= PL.maxMat) break;
      const cred = items[i].reduce((s, x) => s + (x.m.creditos || 0), 0);
      if (items[i].length > 0 && cred + (m.creditos || 0) > PL.maxCred) continue;
      const coms = (m.horario && m.horario.comisiones) || [];
      if (
        PL.avoid &&
        coms.length &&
        !coms.some(
          (c) => !items[i].some((x) => x.com && comConflict(x.com, c)),
        )
      )
        continue;
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
          if (comsM.length && PL.avoid) {
            comJ =
              comsM.find(
                (c) => !items[j].some((x) => x.com && comConflict(x.com, c)),
              ) || null;
            if (!comJ) continue;
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
