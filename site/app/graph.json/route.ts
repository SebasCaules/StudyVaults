import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceX,
  forceY,
  forceCollide,
  type SimulationNodeDatum,
} from "d3-force";
import { getManifest } from "@/lib/content/manifest";
import { resolveTarget } from "@/lib/content/resolve-link";
import { VAULTS, type VaultId } from "@/lib/content/vaults";

export const dynamic = "force-static";

// Grafo de las páginas del wiki: nodos = notas, aristas = wikilinks resueltos
// (intra-vault). El layout force se precomputa acá en build → el cliente solo
// dibuja y anima suave. Se emite a out/graph.json.

interface SimNode extends SimulationNodeDatum {
  id: string;
  v: VaultId;
  t: string;
  s: string;
  deg: number;
}

const WIKILINK_RE = /(!?)\[\[([^\]|\n]+?)(?:\|([^\]\n]+?))?\]\]/g;
function dirOf(relPath: string): string {
  const i = relPath.lastIndexOf("/");
  return i === -1 ? "" : relPath.slice(0, i);
}

export async function GET() {
  const m = await getManifest();
  const notes = m.notes.filter(
    (n) => !n.isIndex && !/^(readme|audit_report|log)$/i.test(n.basename),
  );

  const nodes: SimNode[] = notes.map((n) => ({
    id: n.href,
    v: n.vault,
    t: n.title,
    s: n.slug.length > 1 ? n.slug[0] : "general",
    deg: 0,
  }));
  const byId = new Map(nodes.map((n) => [n.id, n]));

  // aristas
  const seen = new Set<string>();
  const links: { source: string; target: string }[] = [];
  for (const note of notes) {
    const dir = dirOf(note.relPath);
    let mm: RegExpExecArray | null;
    WIKILINK_RE.lastIndex = 0;
    while ((mm = WIKILINK_RE.exec(note.body))) {
      const target = mm[2].trim();
      const res = resolveTarget(m, note.vault, dir, target);
      if (!res || res.kind !== "note") continue;
      const to = res.note.href;
      if (to === note.href) continue;
      const key = note.href < to ? `${note.href}|${to}` : `${to}|${note.href}`;
      if (seen.has(key)) continue;
      if (!byId.has(to)) continue;
      seen.add(key);
      links.push({ source: note.href, target: to });
      byId.get(note.href)!.deg++;
      byId.get(to)!.deg++;
    }
  }

  // anclas por materia en una ELIPSE APAISADA (más ancha que alta): así el
  // grafo, ya de por sí clusterizado por materia, adopta una forma horizontal
  // que llena los canvases anchos en vez de quedar en un cuadrado central.
  const anchors: Record<string, { x: number; y: number }> = {};
  VAULTS.forEach((vlt, i) => {
    const a = (i / VAULTS.length) * Math.PI * 2 - Math.PI / 2;
    anchors[vlt.id] = { x: Math.cos(a) * 660, y: Math.sin(a) * 320 };
  });
  nodes.forEach((n) => {
    const an = anchors[n.v];
    n.x = an.x + (Math.random() - 0.5) * 110;
    n.y = an.y + (Math.random() - 0.5) * 110;
  });

  const sim = forceSimulation(nodes)
    // repulsión fuerte pero ACOTADA (distanceMax) → nodos bien separados y
    // "descomprimidos", sin que el grafo explote ni se deshagan los clusters.
    .force("charge", forceManyBody().strength(-105).distanceMax(540))
    .force(
      "link",
      forceLink<SimNode, { source: string; target: string }>(links)
        .id((d) => d.id)
        .distance(52)
        .strength(0.14),
    )
    .force("x", forceX<SimNode>((n) => anchors[n.v].x).strength(0.05))
    .force("y", forceY<SimNode>((n) => anchors[n.v].y).strength(0.06))
    .force("collide", forceCollide(8).strength(0.9))
    .stop();
  // más ticks → el layout se asienta de forma suave y natural
  for (let i = 0; i < 440; i++) sim.tick();

  // normalizar centrando el layout en (500,500) y ajustando al ALTO (fit
  // vertical): como el layout es apaisado, el ancho se extiende más allá de
  // 0..1000 y el renderer —que escala 1000 → min(ancho,alto) centrado en la
  // cámara— lo despliega a lo ancho, llenando el canvas.
  const xs = nodes.map((n) => n.x!);
  const ys = nodes.map((n) => n.y!);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const ySpan = (maxY - minY) || 1;
  const xSpan = (maxX - minX) || 1;
  const pad = 56;
  const scale = (1000 - pad * 2) / ySpan;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  // La repulsión isótropa redondea la elipse, así que el resultado queda ~1.4:1.
  // Un estirón horizontal suave y ACOTADO lleva el aspecto a ~1.9:1 para llenar
  // canvases anchos, sin deformar de más (tope 1.5×).
  const xStretch = Math.min(1.5, Math.max(1, 1.9 / (xSpan / ySpan)));

  // color por nodo, resuelto en build y POR TEMA (AA en dark y light).
  // base = tint de materia (mismas mezclas que --vt-* de globals.css);
  // cDark = aclarado hacia blanco (visible sobre canvas oscuro);
  // cLight = oscurecido hacia marrón (visible sobre off-white).
  const HEX = { brown: "#241208", blue: "#92cff2", gray: "#a1a1aa", coral: "#f47c59", white: "#ffffff" };
  function mix(a: string, b: string, pa: number): string {
    const h = (x: string) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16));
    const A = h(a), B = h(b), p = pa / 100;
    return (
      "#" +
      A.map((v, i) =>
        Math.round(v * p + B[i] * (1 - p))
          .toString(16)
          .padStart(2, "0"),
      ).join("")
    );
  }
  const BASE: Record<string, string> = {
    mna: HEX.blue,
    derecho: mix(HEX.coral, HEX.brown, 72),
    economia: mix(HEX.coral, HEX.blue, 58),
    proba: mix(HEX.blue, HEX.gray, 60),
    paw: mix(HEX.blue, HEX.gray, 52),
    sds: mix(HEX.coral, HEX.gray, 50),
    inge2: mix(HEX.gray, HEX.blue, 68),
  };
  const cDark = (v: string) => mix(BASE[v] ?? HEX.blue, HEX.white, 68);
  const cLight = (v: string) => mix(BASE[v] ?? HEX.blue, HEX.brown, 48);

  const idx = new Map(nodes.map((n, i) => [n.id, i]));
  const outNodes = nodes.map((n) => ({
    v: n.v,
    t: n.t,
    u: n.id, // href
    s: n.s,
    cDark: cDark(n.v),
    cLight: cLight(n.v),
    x: Math.round((n.x! - cx) * scale * xStretch + 500),
    y: Math.round((n.y! - cy) * scale + 500),
    r: Math.round((2.0 + Math.sqrt(n.deg) * 1.05) * 10) / 10,
  }));
  const outLinks = links.map((l) => [
    idx.get(typeof l.source === "string" ? l.source : (l.source as SimNode).id)!,
    idx.get(typeof l.target === "string" ? l.target : (l.target as SimNode).id)!,
  ]);

  // semiejes reales del contenido (centrado en 500,500) → el cliente hace un
  // contain-fit a estos límites: llena el eje más ajustado en cualquier canvas
  // (ancho en desktop) sin recortar ni deformar.
  let hx = 1, hy = 1;
  for (const n of outNodes) {
    const dx = Math.abs(n.x - 500), dy = Math.abs(n.y - 500);
    if (dx > hx) hx = dx;
    if (dy > hy) hy = dy;
  }

  return Response.json({
    nodes: outNodes,
    links: outLinks,
    vaults: VAULTS.map((v) => ({ id: v.id, short: v.short })),
    bounds: { hx, hy },
  });
}
