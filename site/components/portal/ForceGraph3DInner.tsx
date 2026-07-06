"use client";

// Grafo 3D del hero — "CARTA EXTRUIDA" (diseño V4 de _design-review/graph-variants.html):
//  · maqueta cartográfica ACOSTADA: el layout 2D real de graph.json en el plano
//    XZ; la elevación (fy) de cada nota es su cantidad de enlaces → los hubs
//    flotan alto y las hojas quedan al ras del piso (jerarquía visible)
//  · VORONOI 3D exacto (intersección de semiespacios / planos bisectores,
//    clipping Sutherland–Hodgman): territorios por wiki sembrados en la nota
//    más conectada de cada materia. El piso se dibuja como textura canvas de
//    alta resolución (antialiasing vectorial, sin serrucho) y los tabiques 3D
//    son cristal fantasma. Al cargar, cada territorio CRECE desde su semilla.
//  · CONTENCIÓN: la celda es fija; cada nube se reescala alrededor de su
//    semilla (búsqueda binaria) hasta caber entera, con margen. Outliers
//    clampeados a 1.25× el radio P90 de su nube.
//  · enlaces teñidos por wiki (los cruzados, apagados) — se lee qué conecta qué
//  · LINTERNA: el cursor excita la red (raycast + falloff gaussiano): los nodos
//    cercanos al puntero se encienden y crecen; hover muestra la nota; click
//    la abre. Nube difusa aditiva envuelve cada materia.
//  · etiquetas de materia como pills proyectadas por frame con anti-solape 2D
//    (overlay DOM), UnrealBloom suave, auto-órbita pausada al hover.
// Todo fijo (sin simulación): warmup/cooldown 0. SOLO cliente (ssr:false).
import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import type { ForceGraphMethods } from "react-force-graph-3d";
import * as THREE from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import type { GNode, GLink } from "./ForceGraphInner";
import { VAULTS } from "@/lib/content/vaults";

const VIVID: Record<string, string> = {
  derecho: "#E06B4F",
  economia: "#E6B23C",
  paw: "#5FC486",
  proba: "#37C6B6",
  mna: "#4FA1F0",
  inge2: "#9A88F2",
  sds: "#E67CB2",
};
// Colores vivid para materias FUERA de la paleta curada (VIVID): tonos joya en
// los dos huecos más grandes del círculo cromático de los 7 curados —lima
// (h≈88, entre economía y paw) y magenta-púrpura (h≈291, entre inge2 y sds)—,
// bien separados de todos. Así una materia nueva (p. ej. fisica3 → magenta)
// entra al hero con su propio color en vez de colapsar al azul default de antes.
const EXTRA_VIVID = ["#8FCF45", "#C24FD6"];
const hashStr = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
const colorOf = (v: string) =>
  VIVID[v] ?? EXTRA_VIVID[hashStr(v) % EXTRA_VIVID.length];
// Nombre corto de cada materia, derivado de VAULTS → una materia nueva aparece
// etiquetada sin tocar este archivo (para las 7 curadas coincide con lo previo).
const NAMES: Record<string, string> = Object.fromEntries(
  VAULTS.map((v) => [v.id, v.short]),
);
// Orden estable de las 7 materias curadas (define su secuencia visual histórica).
const VORDER = ["mna", "derecho", "economia", "proba", "paw", "sds", "inge2"];
// Orden efectivo de render: curadas presentes primero, luego cualquier otra
// materia presente en los datos (alfabético). Data-driven → una materia nueva
// obtiene celda voronoi + color + etiqueta automáticamente.
function orderVaults(present: string[]): string[] {
  const set = new Set(present);
  const pref = VORDER.filter((v) => set.has(v));
  const extra = present.filter((v) => !VORDER.includes(v)).sort();
  return [...pref, ...extra];
}

// tema CLARO: tintas sobre papel — los vivid se oscurecen hacia el marrón ancla
function mixHex(a: string, b: string, pa: number): string {
  const h = (x: string) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16));
  const A = h(a),
    B = h(b);
  return (
    "#" +
    A.map((v, i) =>
      Math.round(v * pa + B[i] * (1 - pa))
        .toString(16)
        .padStart(2, "0"),
    ).join("")
  );
}
const inkOf = (v: string) => mixHex(colorOf(v), "#241208", 0.58);
const dotColorOf = (v: string, light: boolean) => (light ? inkOf(v) : colorOf(v));
const CROSS_DARK = "#3d3448";
const CROSS_LIGHT = "#c9baa9";

// ---- constantes de la carta (validadas en el mockup aprobado) ----
const SCALE = 0.62; // unidades graph.json (0..1000) → mundo
const SPREAD = 1.68; // separación entre clusters (sobre el centroide)
const INTRA = 1.38; // espaciado de nodos DENTRO del cluster
const FLOOR = 1;
const TOP = 102; // altura de los tabiques
const BOX = 500; // semi-lado de la caja límite
const VOR_S = 1060; // lado del plano del piso
const MARGIN = 10; // margen de contención dentro de la celda
const RBIG = 1600; // polígono de arranque para el clipping

type N3 = GNode & {
  fx: number;
  fy: number;
  fz: number;
  x?: number;
  y?: number;
  z?: number;
  __sp?: THREE.Sprite;
  __sz?: number;
  __base?: THREE.Color;
};
type L3 = GLink & { sv: string; tv: string };
type V3 = { x: number; y: number; z: number };

const jit = (i: number) => ((i * 2654435761) % 97) - 48;

// ---------------------------------------------------------------------------
// layout: posiciones fijas + clamp de outliers + contención en la celda
// ---------------------------------------------------------------------------
function computeLayout(nodes: GNode[]): {
  pos: V3[];
  seedIdx: Record<string, number>;
  seedsVor: Record<string, V3>; // semillas con altura amortiguada (voronoi)
} {
  const cen: Record<string, { x: number; y: number; k: number }> = {};
  const seedIdx: Record<string, number> = {};
  nodes.forEach((n, i) => {
    const c = (cen[n.v] ||= { x: 0, y: 0, k: 0 });
    c.x += n.x ?? 500;
    c.y += n.y ?? 500;
    c.k++;
    if (!(n.v in seedIdx) || n.deg > nodes[seedIdx[n.v]].deg) seedIdx[n.v] = i;
  });
  for (const v in cen) {
    cen[v].x /= cen[v].k;
    cen[v].y /= cen[v].k;
  }
  const pos: V3[] = nodes.map((n, i) => {
    const cx = (cen[n.v].x - 500) * SCALE;
    const cz = (cen[n.v].y - 500) * SCALE;
    return {
      x: cx * SPREAD + (((n.x ?? 500) - 500) * SCALE - cx) * INTRA,
      z: cz * SPREAD + (((n.y ?? 500) - 500) * SCALE - cz) * INTRA,
      y: 8 + jit(i) * 0.12 + Math.sqrt(n.deg) * 12,
    };
  });
  const byVault: Record<string, number[]> = {};
  nodes.forEach((n, i) => (byVault[n.v] ||= []).push(i));

  // outliers → a no más de 1.25× el radio P90 de su nube
  for (const v in byVault) {
    const idxs = byVault[v];
    let cx = 0,
      cz = 0;
    idxs.forEach((i) => {
      cx += pos[i].x;
      cz += pos[i].z;
    });
    cx /= idxs.length;
    cz /= idxs.length;
    const ds = idxs
      .map((i) => Math.hypot(pos[i].x - cx, pos[i].z - cz))
      .sort((a, b) => a - b);
    const rmax = ds[Math.floor(ds.length * 0.9)] * 1.25;
    for (const i of idxs) {
      const d = Math.hypot(pos[i].x - cx, pos[i].z - cz);
      if (d > rmax) {
        const k = rmax / d;
        pos[i].x = cx + (pos[i].x - cx) * k;
        pos[i].z = cz + (pos[i].z - cz) * k;
      }
    }
  }

  // semillas del voronoi con altura amortiguada (los tabiques quedan apenas
  // inclinados — 3D — sin rebanar los clusters vecinos)
  const seedsVor: Record<string, V3> = {};
  for (const v in seedIdx) {
    const p = pos[seedIdx[v]];
    seedsVor[v] = { x: p.x, y: 22 + p.y * 0.35, z: p.z };
  }

  // contención: celda FIJA, la nube se reescala alrededor de su semilla
  // (búsqueda binaria del factor máximo que deja TODOS los nodos adentro)
  const vaults = Object.keys(seedIdx);
  for (const v of vaults) {
    const s0 = seedsVor[v];
    const bis = vaults
      .filter((o) => o !== v)
      .map((o) => {
        const a = seedsVor[v],
          b = seedsVor[o];
        const n = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
        return {
          n,
          d:
            (b.x * b.x + b.y * b.y + b.z * b.z -
              (a.x * a.x + a.y * a.y + a.z * a.z)) /
            2,
          len: Math.hypot(n.x, n.y, n.z),
        };
      });
    const idxs = byVault[v];
    const inside = (s: number) =>
      idxs.every((i) => {
        const px = s0.x + (pos[i].x - s0.x) * s;
        const pz = s0.z + (pos[i].z - s0.z) * s;
        const py = pos[i].y;
        if (Math.abs(px) > BOX - 12 || Math.abs(pz) > BOX - 12) return false;
        return bis.every(
          (b) => (b.n.x * px + b.n.y * py + b.n.z * pz + b.d) / b.len >= MARGIN,
        );
      });
    if (inside(1)) continue;
    let lo = 0.3,
      hi = 1,
      best = 0.3;
    for (let it = 0; it < 14; it++) {
      const m = (lo + hi) / 2;
      if (inside(m)) {
        best = m;
        lo = m;
      } else hi = m;
    }
    for (const i of idxs) {
      pos[i].x = s0.x + (pos[i].x - s0.x) * best;
      pos[i].z = s0.z + (pos[i].z - s0.z) * best;
    }
  }
  return { pos, seedIdx, seedsVor };
}

// ---------------------------------------------------------------------------
// voronoi 3D: celdas del piso (polígonos exactos) + tabiques entre pares
// ---------------------------------------------------------------------------
type Cell = { v: string; poly: THREE.Vector3[]; sx: number; sz: number };

function clipPoly(poly: THREE.Vector3[], n: THREE.Vector3, d: number) {
  const out: THREE.Vector3[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i],
      b = poly[(i + 1) % poly.length];
    const da = n.dot(a) + d,
      db = n.dot(b) + d;
    if (da >= 0) out.push(a);
    if (da < 0 !== db < 0) out.push(a.clone().lerp(b, da / (da - db)));
  }
  return out;
}

function buildVoronoi(seedsVor: Record<string, V3>): {
  cells: Cell[];
  walls: THREE.Vector3[][];
} {
  const order = orderVaults(Object.keys(seedsVor));
  const S = order.map((v) => new THREE.Vector3(seedsVor[v].x, seedsVor[v].y, seedsVor[v].z));
  const bisector = (i: number, k: number) => ({
    n: S[i].clone().sub(S[k]),
    d: (S[k].lengthSq() - S[i].lengthSq()) / 2,
  });
  const BOXP = [
    { n: new THREE.Vector3(-1, 0, 0), d: BOX },
    { n: new THREE.Vector3(1, 0, 0), d: BOX },
    { n: new THREE.Vector3(0, 0, -1), d: BOX },
    { n: new THREE.Vector3(0, 0, 1), d: BOX },
    { n: new THREE.Vector3(0, 1, 0), d: 0 },
    { n: new THREE.Vector3(0, -1, 0), d: TOP },
  ];
  const cells: Cell[] = [];
  order.forEach((v, i) => {
    let poly = [
      new THREE.Vector3(RBIG, FLOOR, RBIG),
      new THREE.Vector3(RBIG, FLOOR, -RBIG),
      new THREE.Vector3(-RBIG, FLOOR, -RBIG),
      new THREE.Vector3(-RBIG, FLOOR, RBIG),
    ];
    for (let k = 0; k < S.length && poly.length > 2; k++) {
      if (k === i) continue;
      const b = bisector(i, k);
      poly = clipPoly(poly, b.n, b.d);
    }
    for (const bp of BOXP.slice(0, 4))
      if (poly.length > 2) poly = clipPoly(poly, bp.n, bp.d);
    if (poly.length > 2) cells.push({ v, poly, sx: S[i].x, sz: S[i].z });
  });
  const walls: THREE.Vector3[][] = [];
  for (let i = 0; i < S.length; i++)
    for (let j = i + 1; j < S.length; j++) {
      const N = S[j].clone().sub(S[i]).normalize();
      const mid = S[i].clone().add(S[j]).multiplyScalar(0.5);
      let u = new THREE.Vector3(0, 1, 0).cross(N);
      if (u.lengthSq() < 1e-6) u = new THREE.Vector3(1, 0, 0).cross(N);
      u.normalize();
      const w = N.clone().cross(u);
      let poly = [
        mid.clone().addScaledVector(u, RBIG).addScaledVector(w, RBIG),
        mid.clone().addScaledVector(u, RBIG).addScaledVector(w, -RBIG),
        mid.clone().addScaledVector(u, -RBIG).addScaledVector(w, -RBIG),
        mid.clone().addScaledVector(u, -RBIG).addScaledVector(w, RBIG),
      ];
      for (let k = 0; k < S.length && poly.length > 2; k++) {
        if (k === i || k === j) continue;
        const b = bisector(i, k);
        poly = clipPoly(poly, b.n, b.d);
      }
      for (const bp of BOXP) if (poly.length > 2) poly = clipPoly(poly, bp.n, bp.d);
      if (poly.length > 2) walls.push(poly);
    }
  return { cells, walls };
}

function polyGeo(poly: THREE.Vector3[]): THREE.BufferGeometry {
  const posArr: number[] = [];
  for (let i = 1; i < poly.length - 1; i++)
    for (const p of [poly[0], poly[i], poly[i + 1]]) posArr.push(p.x, p.y, p.z);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(posArr, 3));
  return g;
}

// ---------------------------------------------------------------------------
// texturas
// ---------------------------------------------------------------------------
function radialTex(stops: [number, string][]): THREE.Texture {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  stops.forEach(([o, col]) => g.addColorStop(o, col));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.Texture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
const makeDotTexture = () =>
  radialTex([
    [0, "rgba(255,255,255,1)"],
    [0.28, "rgba(255,255,255,0.92)"],
    [0.55, "rgba(255,255,255,0.35)"],
    [0.82, "rgba(255,255,255,0.08)"],
    [1, "rgba(255,255,255,0)"],
  ]);
const makeGlowTexture = () =>
  radialTex([
    [0, "rgba(255,255,255,0.7)"],
    [0.4, "rgba(255,255,255,0.25)"],
    [0.75, "rgba(255,255,255,0.06)"],
    [1, "rgba(255,255,255,0)"],
  ]);

export default function ForceGraph3DInner({
  nodes,
  links,
  light,
  motion,
  onOpen,
}: {
  nodes: GNode[];
  links: GLink[];
  light: boolean;
  selected: string | null;
  motion: boolean;
  onOpen: (u: string) => void;
}) {
  // Theme-aware: dark = vivid sobre inset tabaco; light = tintas sobre papel
  // (el fondo del canvas lo conmuta el CSS; acá se restilizan materiales).
  const wrapRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef(light);
  lightRef.current = light;
  const overlayRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods<N3, L3> | undefined>(undefined);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const hoverRef = useRef(false);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  const dotTex = useMemo(makeDotTexture, []);
  const glowTex = useMemo(makeGlowTexture, []);
  useEffect(
    () => () => {
      dotTex.dispose();
      glowTex.dispose();
    },
    [dotTex, glowTex],
  );

  // layout + voronoi + anclas de etiquetas: puro, una vez por dataset
  const built = useMemo(() => {
    const { pos, seedIdx, seedsVor } = computeLayout(nodes);
    const gnodes: N3[] = nodes.map((n, i) => ({
      ...n,
      fx: pos[i].x,
      fy: pos[i].y,
      fz: pos[i].z,
    }));
    const vOf = new Map(nodes.map((n) => [n.id, n.v]));
    const glinks: L3[] = links.map((l) => ({
      ...l,
      sv: vOf.get(l.source as string) ?? "",
      tv: vOf.get(l.target as string) ?? "",
    }));
    const vor = buildVoronoi(seedsVor);
    // anclas de etiqueta: centroide XZ + tope de altura del cluster
    const anchors: Record<string, { x: number; y: number; z: number }> = {};
    const acc: Record<string, { x: number; z: number; top: number; k: number }> = {};
    gnodes.forEach((n) => {
      const a = (acc[n.v] ||= { x: 0, z: 0, top: 0, k: 0 });
      a.x += n.fx;
      a.z += n.fz;
      a.k++;
      if (n.fy > a.top) a.top = n.fy;
    });
    for (const v in acc)
      anchors[v] = { x: acc[v].x / acc[v].k, y: acc[v].top + 18, z: acc[v].z / acc[v].k };
    const counts: Record<string, number> = {};
    gnodes.forEach((n) => (counts[n.v] = (counts[n.v] ?? 0) + 1));
    // orden de materias presente en los datos (curadas primero) → mismo array
    // para las pills (JSX) y para el posicionador por-frame: sus índices deben
    // alinearse con los hijos del overlay.
    const order = orderVaults(Object.keys(counts));
    return { gnodes, glinks, vor, seedIdx, anchors, counts, order };
  }, [nodes, links]);

  const graphData = useMemo(
    () => ({
      nodes: built.gnodes.map((n) => ({ ...n })) as N3[],
      links: built.glinks.map((l) => ({ ...l })),
    }),
    [built],
  );

  // medir el contenedor
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  // tooltip propio a nivel <body> (position:fixed, z-index máximo): el de la
  // librería vive DENTRO del canvas → lo tapaban las pills y lo recortaba el
  // overflow:hidden de la tarjeta. Este queda en primerísimo plano siempre.
  const tipRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const tip = document.createElement("div");
    tip.className = "fg3d-tooltip";
    tip.style.display = "none";
    document.body.appendChild(tip);
    tipRef.current = tip;
    return () => {
      tip.remove();
      tipRef.current = null;
    };
  }, []);

  // linterna (NDC del mouse) + posición del tooltip fijo
  const lastClientRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const placeTip = () => {
    const tip = tipRef.current;
    if (!tip || tip.style.display === "none") return;
    const { x: cx, y: cy } = lastClientRef.current;
    const tw = tip.offsetWidth,
      th = tip.offsetHeight;
    let x = cx + 14,
      y = cy + 14;
    if (x + tw > window.innerWidth - 8) x = cx - tw - 14;
    if (y + th > window.innerHeight - 8) y = cy - th - 14;
    tip.style.transform = `translate(${x}px, ${y}px)`;
  };
  const placeTipRef = useRef(placeTip);
  placeTipRef.current = placeTip;
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - r.left) / r.width) * 2 - 1,
        y: -(((e.clientY - r.top) / r.height) * 2 - 1),
      };
      lastClientRef.current = { x: e.clientX, y: e.clientY };
      placeTipRef.current();
    };
    const onLeave = () => {
      mouseRef.current = null;
      if (tipRef.current) tipRef.current.style.display = "none";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // loop único: setup imperativo + crecimiento + linterna + etiquetas
  useEffect(() => {
    let raf = 0;
    let stopped = false;
    let setup = false;
    let growT0 = -1;
    let growDone = !motion;
    let lastE = 0.001; // último factor de crecimiento dibujado (para re-temar)
    let drawFloorFn: ((e: number) => void) | null = null;
    let floorTex: THREE.CanvasTexture | null = null;
    const wallMats: {
      m: (THREE.Material & { opacity: number }) & { color: THREE.Color };
      kind: "fill" | "line";
      target: number;
    }[] = [];
    const mists: THREE.Sprite[] = [];
    const stemMats: { m: THREE.LineBasicMaterial; v: string }[] = [];
    let gridMat: (THREE.Material & { opacity: number }) | null = null;
    let bloomPass: UnrealBloomPass | null = null;
    let appliedLight: boolean | null = null;
    const ray = new THREE.Raycaster();
    let lanternGlow: THREE.Sprite | null = null;
    let lanternTarget = 0.35; // opacidad objetivo del glow (depende del tema)
    const tmpC = new THREE.Color();
    const WHITE = new THREE.Color("#ffffff");
    const VIVIDC: Record<string, THREE.Color> = {};
    for (const v of new Set(graphData.nodes.map((n) => n.v)))
      VIVIDC[v] = new THREE.Color(colorOf(v));

    // re-estiliza TODO el mobiliario según el tema (se llama en setup y al
    // conmutar data-theme; los props de react-force-graph se re-aplican solos)
    const styleTheme = (lt: boolean) => {
      appliedLight = lt;
      for (const n of graphData.nodes) {
        if (!n.__base) continue;
        n.__base.set(dotColorOf(n.v, lt));
        n.__sp?.material.color.copy(n.__base);
      }
      for (const s of mists) {
        s.material.blending = lt ? THREE.NormalBlending : THREE.AdditiveBlending;
        s.material.opacity = lt ? 0.05 : 0.035;
        s.material.color.set(lt ? mixHex(colorOf(s.userData.v), "#fdf9f4", 0.62) : colorOf(s.userData.v));
        s.material.needsUpdate = true;
      }
      for (const w of wallMats) {
        w.m.color.set(lt ? 0x4a3527 : 0xe0cdb0);
        w.target = w.kind === "fill" ? (lt ? 0.02 : 0.028) : lt ? 0.08 : 0.11;
        if (growDone) w.m.opacity = w.target;
      }
      for (const st of stemMats) {
        st.m.color.set(dotColorOf(st.v, lt));
        st.m.opacity = lt ? 0.35 : 0.4;
      }
      if (gridMat) gridMat.opacity = lt ? 0.16 : 0.1;
      if (bloomPass) bloomPass.strength = lt ? 0 : 0.45; // bloom no aporta en papel
      if (lanternGlow) {
        lanternGlow.material.blending = lt ? THREE.NormalBlending : THREE.AdditiveBlending;
        lanternGlow.material.color.set(lt ? "#e0663a" : "#ffc9a0");
        lanternGlow.material.needsUpdate = true;
      }
      lanternTarget = lt ? 0.16 : 0.35;
      drawFloorFn?.(lastE);
    };

    const loop = () => {
      if (stopped) return;
      const fg = fgRef.current;
      const overlay = overlayRef.current;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyFg = fg as any;
      if (fg && overlay && anyFg.scene && anyFg.camera) {
        const scene: THREE.Scene = anyFg.scene();
        if (!setup) {
          setup = true;
          // ---- BLOOM suave + salida gestionada ----
          const composer = anyFg.postProcessingComposer?.();
          if (composer && composer.passes.length < 2) {
            // bloom contenido (sobrio): menos strength y umbral más alto para
            // que el piso voronoi no "brille"; en light se apaga (styleTheme)
            bloomPass = new UnrealBloomPass(
              new THREE.Vector2(size.w || 600, size.h || 400),
              0.45,
              0.5,
              0.32,
            );
            composer.addPass(bloomPass);
            composer.addPass(new OutputPass());
          }
          // ---- cámara aérea 3/4 (la auto-órbita conserva la altura) ----
          const k = Math.max(1, Math.min(1.5, 560 / (size.w || 560)));
          anyFg.cameraPosition({ x: 0, y: 660 * k, z: 800 * k }, { x: 0, y: 0, z: 0 }, 0);
          const ctr = anyFg.controls?.();
          if (ctr) {
            ctr.autoRotate = motion;
            ctr.autoRotateSpeed = 0.5;
          }

          // ---- mobiliario de la carta ----
          const grid = new THREE.GridHelper(VOR_S, 30, 0x8a6a4a, 0x8a6a4a);
          gridMat = grid.material as THREE.Material & { opacity: number };
          gridMat.transparent = true;
          gridMat.opacity = 0.1;
          grid.position.y = 0;
          scene.add(grid);

          // nube difusa: un halo aditivo por nodo (envuelve cada materia)
          for (const n of graphData.nodes) {
            const s = new THREE.Sprite(
              new THREE.SpriteMaterial({
                map: glowTex,
                color: new THREE.Color(colorOf(n.v)),
                transparent: true,
                opacity: 0.035,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
              }),
            );
            s.scale.setScalar(26 + Math.sqrt(n.deg) * 6);
            s.position.set(n.fx, n.fy, n.fz);
            s.renderOrder = -2;
            s.userData.v = n.v;
            scene.add(s);
            mists.push(s);
          }

          // piso voronoi: textura canvas de alta resolución (bordes suaves)
          const TEXR = 2048;
          const K = TEXR / VOR_S;
          const u2 = (x: number) => (x / VOR_S + 0.5) * TEXR;
          const w2 = (z: number) => (z / VOR_S + 0.5) * TEXR;
          const fcv = document.createElement("canvas");
          fcv.width = fcv.height = TEXR;
          const fx2 = fcv.getContext("2d")!;
          floorTex = new THREE.CanvasTexture(fcv);
          floorTex.colorSpace = THREE.SRGBColorSpace; // sin esto el OutputPass lava las tintas
          floorTex.anisotropy =
            anyFg.renderer?.().capabilities.getMaxAnisotropy?.() ?? 8;
          const fplane = new THREE.Mesh(
            new THREE.PlaneGeometry(VOR_S, VOR_S).rotateX(-Math.PI / 2),
            new THREE.MeshBasicMaterial({
              map: floorTex,
              transparent: true,
              depthWrite: false,
            }),
          );
          fplane.position.y = FLOOR;
          fplane.renderOrder = -3;
          scene.add(fplane);
          // dibujo SOBRIO: trazo fino sin glow (nada de shadowBlur), relleno
          // apenas perceptible; en light las tintas se oscurecen hacia marrón
          drawFloorFn = (e: number) => {
            const lt = lightRef.current;
            fx2.clearRect(0, 0, TEXR, TEXR);
            fx2.lineJoin = "round";
            for (const c of built.vor.cells) {
              const su = u2(c.sx),
                sv = w2(c.sz);
              fx2.save();
              fx2.translate(su, sv);
              fx2.scale(e, e);
              fx2.translate(-su, -sv);
              const path = new Path2D();
              c.poly.forEach((p, kk) =>
                kk ? path.lineTo(u2(p.x), w2(p.z)) : path.moveTo(u2(p.x), w2(p.z)),
              );
              path.closePath();
              const col = dotColorOf(c.v, lt);
              fx2.globalAlpha = lt ? 0.045 : 0.04;
              fx2.fillStyle = col;
              fx2.fill(path);
              fx2.globalAlpha = lt ? 0.55 : 0.34;
              fx2.strokeStyle = col;
              fx2.lineWidth = 2.2;
              fx2.stroke(path);
              fx2.globalAlpha = lt ? 0.4 : 0.3;
              fx2.lineWidth = 2;
              fx2.beginPath();
              fx2.arc(su, sv, 11 * K, 0, 7);
              fx2.stroke();
              fx2.restore();
            }
            floorTex!.needsUpdate = true;
          };

          // tabiques 3D (cristal fantasma; aparecen al final del crecimiento)
          for (const poly of built.vor.walls) {
            const m = new THREE.MeshBasicMaterial({
              color: 0xe0cdb0,
              transparent: true,
              opacity: 0,
              side: THREE.DoubleSide,
              depthWrite: false,
            });
            const mesh = new THREE.Mesh(polyGeo(poly), m);
            mesh.renderOrder = -1;
            scene.add(mesh);
            wallMats.push({ m, kind: "fill", target: 0.028 });
            const lm = new THREE.LineBasicMaterial({
              color: 0xe0cdb0,
              transparent: true,
              opacity: 0,
            });
            const line = new THREE.LineLoop(
              new THREE.BufferGeometry().setFromPoints(poly),
              lm,
            );
            line.renderOrder = -1;
            scene.add(line);
            wallMats.push({ m: lm, kind: "line", target: 0.11 });
          }

          // tallo de cada semilla (la nota más pesada de cada wiki)
          for (const v in built.seedIdx) {
            const n = built.gnodes[built.seedIdx[v]];
            const sm = new THREE.LineBasicMaterial({
              color: new THREE.Color(colorOf(v)),
              transparent: true,
              opacity: 0.4,
            });
            const stem = new THREE.Line(
              new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(n.fx, FLOOR + 0.5, n.fz),
                new THREE.Vector3(n.fx, n.fy, n.fz),
              ]),
              sm,
            );
            scene.add(stem);
            stemMats.push({ m: sm, v });
          }

          // glow de la linterna
          lanternGlow = new THREE.Sprite(
            new THREE.SpriteMaterial({
              map: glowTex,
              color: new THREE.Color("#ffc9a0"),
              transparent: true,
              opacity: 0,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            }),
          );
          lanternGlow.scale.set(95, 95, 1);
          scene.add(lanternGlow);

          if (!motion) lastE = 1;
          styleTheme(lightRef.current); // estiliza todo + dibuja el piso
        }

        // conmutación de tema en caliente (data-theme cambió)
        if (setup && appliedLight !== lightRef.current)
          styleTheme(lightRef.current);

        const now = performance.now();

        // ---- crecimiento del voronoi (una vez, al cargar) ----
        if (!growDone && drawFloorFn) {
          if (growT0 < 0) growT0 = now;
          const p = Math.min(1, (now - growT0 - 600) / 2800);
          if (p >= 0) {
            const e = 1 - Math.pow(1 - Math.min(1, p * 1.3), 3);
            lastE = Math.max(e, 0.001);
            drawFloorFn(lastE);
            const w = Math.max(0, (p - 0.55) / 0.45);
            for (const wl of wallMats) wl.m.opacity = wl.target * w;
            if (p >= 1) growDone = true;
          }
        }

        // pausar auto-órbita con el cursor sobre un nodo
        const ctr = anyFg.controls?.();
        if (ctr && motion) ctr.autoRotate = !hoverRef.current;

        // ---- linterna: el cursor excita la red ----
        const mouse = mouseRef.current;
        if (lanternGlow) {
          if (mouse) {
            ray.setFromCamera(new THREE.Vector2(mouse.x, mouse.y), anyFg.camera());
            const ro = ray.ray.origin,
              rd = ray.ray.direction;
            const R = 36;
            let bx = 0,
              by = 0,
              bz = 0,
              bw = 0;
            for (const n of graphData.nodes) {
              if (!n.__sp || n.x === undefined) continue;
              const px = n.x - ro.x,
                py = (n.y ?? 0) - ro.y,
                pz = (n.z ?? 0) - ro.z;
              const t = px * rd.x + py * rd.y + pz * rd.z;
              const qx = px - rd.x * t,
                qy = py - rd.y * t,
                qz = pz - rd.z * t;
              const e = Math.exp(-(qx * qx + qy * qy + qz * qz) / (2 * R * R));
              const s = (n.__sz ?? 5) * (1 + e * 1.15);
              n.__sp.scale.set(s, s, 1);
              // dark: encender hacia blanco; light: saturar hacia el vivid puro
              n.__sp.material.color.copy(
                tmpC
                  .copy(n.__base ?? WHITE)
                  .lerp(appliedLight ? VIVIDC[n.v] ?? WHITE : WHITE, e * 0.9),
              );
              if (e > 0.25) {
                bx += n.x * e;
                by += (n.y ?? 0) * e;
                bz += (n.z ?? 0) * e;
                bw += e;
              }
            }
            if (bw > 0.01) {
              lanternGlow.position.set(bx / bw, by / bw, bz / bw);
              lanternGlow.material.opacity +=
                (lanternTarget - lanternGlow.material.opacity) * 0.12;
            } else lanternGlow.material.opacity *= 0.9;
          } else {
            lanternGlow.material.opacity *= 0.92;
            for (const n of graphData.nodes) {
              if (!n.__sp) continue;
              n.__sp.scale.set(n.__sz ?? 5, n.__sz ?? 5, 1);
              if (n.__base) n.__sp.material.color.copy(n.__base);
            }
          }
        }

        // ---- etiquetas de materia: proyectar ancla + anti-solape 2D ----
        const toScreen = anyFg.graph2ScreenCoords;
        if (typeof toScreen === "function") {
          const w = overlay.clientWidth;
          const h = overlay.clientHeight;
          const kids = overlay.children;
          type Lab = { el: HTMLElement; x: number; y: number; hw: number; hh: number };
          const labs: Lab[] = [];
          for (let i = 0; i < built.order.length; i++) {
            const el = kids[i] as HTMLElement | undefined;
            if (!el) continue;
            const a = built.anchors[built.order[i]];
            if (!a) {
              el.style.opacity = "0";
              continue;
            }
            const s = toScreen.call(fg, a.x, a.y, a.z) as { x: number; y: number };
            const on = !!s && s.x > -60 && s.x < w + 60 && s.y > -60 && s.y < h + 60;
            if (!on) {
              el.style.opacity = "0";
              continue;
            }
            labs.push({
              el,
              x: s.x,
              y: s.y - 14,
              hw: (el.offsetWidth || 60) / 2,
              hh: (el.offsetHeight || 22) / 2,
            });
          }
          const PAD = 5;
          for (let it = 0; it < 8; it++) {
            for (let a = 0; a < labs.length; a++) {
              for (let b = a + 1; b < labs.length; b++) {
                const A = labs[a];
                const B = labs[b];
                const dx = B.x - A.x;
                const dy = B.y - A.y;
                const ox = A.hw + B.hw + PAD - Math.abs(dx);
                const oy = A.hh + B.hh + PAD - Math.abs(dy);
                if (ox > 0 && oy > 0) {
                  if (ox < oy) {
                    const s = ((dx < 0 ? -1 : 1) * ox) / 2;
                    A.x -= s;
                    B.x += s;
                  } else {
                    const s = ((dy < 0 ? -1 : 1) * oy) / 2;
                    A.y -= s;
                    B.y += s;
                  }
                }
              }
            }
          }
          for (const L of labs) {
            const x = Math.max(L.hw + 2, Math.min(w - L.hw - 2, L.x));
            const y = Math.max(L.hh + 2, Math.min(h - L.hh - 2, L.y));
            L.el.style.opacity = "1";
            L.el.style.transform = `translate(-50%,-50%) translate(${x}px, ${y}px)`;
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      floorTex?.dispose();
    };
  }, [built, graphData, motion, size.w, size.h, glowTex]);

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
      {size.w > 0 && (
        <ForceGraph3D<N3, L3>
          ref={fgRef}
          width={size.w}
          height={size.h}
          graphData={graphData}
          controlType="orbit"
          backgroundColor="rgba(0,0,0,0)"
          showNavInfo={false}
          enableNodeDrag={false}
          rendererConfig={{ antialias: true, alpha: true }}
          warmupTicks={0}
          cooldownTicks={0}
          nodeThreeObject={(n) => {
            const mat = new THREE.SpriteMaterial({
              map: dotTex,
              color: new THREE.Color(dotColorOf(n.v, lightRef.current)),
              transparent: true,
              depthWrite: false,
              blending: THREE.NormalBlending,
            });
            const sp = new THREE.Sprite(mat);
            const sz = 3.6 + Math.sqrt(n.deg || 0) * 2.4;
            sp.scale.set(sz, sz, 1);
            n.__sp = sp;
            n.__sz = sz;
            n.__base = new THREE.Color(dotColorOf(n.v, lightRef.current));
            return sp;
          }}
          nodeLabel={() => ""}
          linkColor={(l) =>
            l.sv === l.tv
              ? dotColorOf(l.sv, light)
              : light
                ? CROSS_LIGHT
                : CROSS_DARK
          }
          linkOpacity={light ? 0.32 : 0.27}
          linkWidth={0}
          onNodeHover={(n) => {
            hoverRef.current = !!n;
            if (wrapRef.current)
              wrapRef.current.style.cursor = n ? "pointer" : "grab";
            const tip = tipRef.current;
            if (!tip) return;
            if (n) {
              tip.innerHTML = `${escapeHtml(n.t)}<br/><span style="color:${dotColorOf(
                n.v,
                lightRef.current,
              )}">${NAMES[n.v] ?? n.v}</span> · ${n.deg} enlaces`;
              tip.style.display = "block";
              placeTipRef.current(); // posicionar YA (no esperar al próximo move)
            } else {
              tip.style.display = "none";
            }
          }}
          onNodeClick={(n) => n?.u && onOpen(n.u)}
        />
      )}
      {/* etiquetas de materia en primer plano (overlay, proyectado por frame) */}
      <div className="fg3d-labels" ref={overlayRef} aria-hidden="true">
        {built.order.map((v) => (
          <div key={v} className="fg3d-cluster" style={{ ["--c" as string]: colorOf(v) }}>
            <span className="fg3d-lab">
              {NAMES[v] ?? v}
              {built.counts[v] ? ` · ${built.counts[v]}` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );
}
