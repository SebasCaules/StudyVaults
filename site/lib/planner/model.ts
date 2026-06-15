// Modelo estático del planner: PLAN tipado + map byId (materia → con horario).
// Derivado de datos estáticos → se construye una vez al importar (sin DOM).
import rawData from "./data.json";
import type { Materia, MateriaM, Plan } from "./types";

export const PLAN = rawData as unknown as Plan;

export const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
export const DAYS6 = [...DAYS, "Sábado"];

export const AREA_COLOR: Record<string, string> = {
  "Ciencia de Datos": "#85a2c2",
  "Imágenes y Realidad Virtual": "#c592ab",
  "Inteligencia Artificial": "#a9b27e",
  "Arquitectura de Software": "#a497c0",
};

// Paleta para colorear materias en las grillas (combinador / plan).
export const PALETTE = [
  "#8ba0b8", "#c2a878", "#9bb083", "#c592ab", "#a497c0", "#7fa0bf",
  "#b9956a", "#8aa17e", "#a9b27e", "#bfa0b0", "#9aa9c4", "#c7b27e",
];

// Map codigo → materia con su horario resuelto (espejo de buildModel()).
export const byId: Map<string, MateriaM> = new Map();
for (const m of [...PLAN.obligatorias, ...PLAN.electivas]) {
  byId.set(m.codigo, { ...m, horario: PLAN.horarios[m.codigo] || null });
}

export const credOf = (c: string) => Number(byId.get(c)?.creditos) || 0;
export const isElectiva = (c: string) => byId.get(c)?.tipo === "electiva";
export const abbrOf = (c: string) => byId.get(c)?.abbr || c;
export const hasHorario = (c: string) => {
  const m = byId.get(c);
  return !!(m && m.horario && m.horario.comisiones.length);
};
export const remainingOblig = (approved: Set<string>) =>
  PLAN.obligatorias.filter((m) => !approved.has(m.codigo)).map((m) => m.codigo);

// prioridad de cursada: obligatorias › mayor requisito de créditos › más créditos › código
export const planPriority = (a: Materia, b: Materia) =>
  (a.tipo === b.tipo ? 0 : a.tipo === "obligatoria" ? -1 : 1) ||
  (b.creditosReq || 0) - (a.creditosReq || 0) ||
  (b.creditos || 0) - (a.creditos || 0) ||
  a.codigo.localeCompare(b.codigo);

// empaquetado (FFD por créditos) para minimizar cuatrimestres
export const packSort = (a: Materia, b: Materia) =>
  (b.creditos || 0) - (a.creditos || 0) ||
  (a.tipo === b.tipo ? 0 : a.tipo === "obligatoria" ? -1 : 1) ||
  (b.creditosReq || 0) - (a.creditosReq || 0) ||
  a.codigo.localeCompare(b.codigo);
