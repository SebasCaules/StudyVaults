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

// Paleta para colorear materias en las grillas (combinador / plan). Tonos medios
// desaturados y repartidos por la rueda: distinguibles entre sí sin gritar, y
// legibles con texto oscuro encima tanto en pantalla como sobre papel crema.
export const PALETTE = [
  "#6f8caa", "#c08a5e", "#7fa07a", "#b0819b", "#8b84b0", "#5f9298",
  "#bfa065", "#9aab6d", "#c08a8a", "#7f9bc4", "#a78f6a", "#8fae9f",
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
