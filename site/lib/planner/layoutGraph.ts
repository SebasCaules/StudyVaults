// Layout jerárquico LR del grafo de correlativas (DAG de 122 edges).
// Reemplaza vis-network: layering por longest-path (orden topológico) + spacing.
// Puro → se renderiza como SVG en GrafoView.
import { byId, PLAN } from "./model";
import type { Edge } from "./types";

export interface GraphNode {
  id: string;
  abbr: string;
  ob: boolean; // obligatoria → borde azul; electiva → borde coral
  x: number;
  y: number;
}

export interface GraphLayout {
  nodes: GraphNode[];
  edges: Edge[];
  width: number;
  height: number;
  nodeW: number;
  nodeH: number;
}

const NODE_W = 76;
const NODE_H = 34;
const LEVEL_SEP = 150; // separación horizontal entre niveles (LR)
const NODE_GAP = 18; // separación vertical entre nodos de un nivel
const PAD = 24;

export function computeGraphLayout(): GraphLayout {
  const edges = PLAN.edges;
  const ids = new Set<string>();
  edges.forEach((e) => {
    ids.add(e.from);
    ids.add(e.to);
  });

  const adj = new Map<string, string[]>();
  const indeg = new Map<string, number>();
  ids.forEach((id) => {
    adj.set(id, []);
    indeg.set(id, 0);
  });
  edges.forEach((e) => {
    adj.get(e.from)!.push(e.to);
    indeg.set(e.to, (indeg.get(e.to) || 0) + 1);
  });

  // longest-path layering vía Kahn (orden topológico)
  const level = new Map<string, number>();
  ids.forEach((id) => level.set(id, 0));
  const queue: string[] = [];
  const deg = new Map(indeg);
  ids.forEach((id) => {
    if ((deg.get(id) || 0) === 0) queue.push(id);
  });
  let guard = 0;
  while (queue.length && guard++ < 10000) {
    const u = queue.shift()!;
    for (const v of adj.get(u)!) {
      level.set(v, Math.max(level.get(v)!, level.get(u)! + 1));
      deg.set(v, (deg.get(v) || 0) - 1);
      if ((deg.get(v) || 0) === 0) queue.push(v);
    }
  }

  // agrupar por nivel, orden estable por abbr
  const byLevel = new Map<number, string[]>();
  let maxLevel = 0;
  [...ids]
    .sort((a, b) => (byId.get(a)?.abbr || a).localeCompare(byId.get(b)?.abbr || b))
    .forEach((id) => {
      const l = level.get(id)!;
      maxLevel = Math.max(maxLevel, l);
      (byLevel.get(l) ?? byLevel.set(l, []).get(l)!).push(id);
    });

  const colHeights: number[] = [];
  for (let l = 0; l <= maxLevel; l++)
    colHeights.push((byLevel.get(l)?.length || 0) * (NODE_H + NODE_GAP) - NODE_GAP);
  const maxColH = Math.max(0, ...colHeights);

  const nodes: GraphNode[] = [];
  for (let l = 0; l <= maxLevel; l++) {
    const col = byLevel.get(l) || [];
    const colH = colHeights[l];
    const y0 = PAD + (maxColH - colH) / 2; // centrar verticalmente cada columna
    col.forEach((id, i) => {
      const m = byId.get(id);
      nodes.push({
        id,
        abbr: m?.abbr || id,
        ob: m?.tipo === "obligatoria",
        x: PAD + l * LEVEL_SEP,
        y: y0 + i * (NODE_H + NODE_GAP),
      });
    });
  }

  const width = PAD * 2 + maxLevel * LEVEL_SEP + NODE_W;
  const height = PAD * 2 + maxColH;
  return { nodes, edges, width, height, nodeW: NODE_W, nodeH: NODE_H };
}
