// SVG diagram editor for the exam practice flow.
// Shapes: rect, circle, cloud, db (cylinder), actor. Connections: directional arrows.
// State shape: { nodes: [{ id, type, x, y, w, h, label }], edges: [{ id, from, to, label }] }
//
// Improvements (v2):
//   • In-place label editing via foreignObject + <input> (no more prompt()).
//   • Auto-edit on shape placement so the user names it immediately.
//   • Ghost preview while in 'connect' mode (line from source to cursor).
//   • Crosshair cursor while placing.
//   • Resize-on-text: labels truncate visually but full text persists in state.
//   • Floating action chip for the selected shape: Renombrar / Borrar.
//
// Public API (módulo ES):
//   createDiagramEditor(container, { onChange, initialState }) → instance
//   instance.getState(), setState(s), toSVG(), destroy()
//   cloneDiagram(s)
//
// Portado tal cual desde el editor de diagramas SVG de la app de estudio de
// Inge2. Solo se cambió el envoltorio IIFE por exports de módulo; la lógica del
// editor es idéntica. Typecheck desactivado: es DOM/SVG imperativo.
/* eslint-disable */
// @ts-nocheck
  const NS = 'http://www.w3.org/2000/svg';
  // Logical canvas — the bounded "whiteboard". Bigger than the visible window
  // by design: the user can pan + zoom around it.
  const CANVAS_W = 1600;
  const CANVAS_H = 1100;
  // Initial visible viewport window. The shapes look the same size as before
  // because this matches the historical fixed canvas dimensions.
  const VIEW_W0 = 760;
  const VIEW_H0 = 460;
  // Zoom limits (in viewBox width units — smaller w means more zoomed in).
  const VIEW_W_MIN = 200;     // ~ 3.8× zoom in
  const VIEW_W_MAX = 2200;    // shows the whole canvas + a margin
  // Minimum shape size when resizing via the corner handles.
  const MIN_W = 46;
  const MIN_H = 34;

  const SHAPE_DEFS = {
    rect:    { w: 130, h: 60,  label: 'Componente',     description: 'Componente / servicio' },
    circle:  { w: 88,  h: 88,  label: 'Proceso',        description: 'Proceso / actor lógico' },
    cloud:   { w: 140, h: 76,  label: 'Servicio ext.',  description: 'Servicio externo / cloud' },
    db:      { w: 96,  h: 88,  label: 'Base de datos',  description: 'Base de datos / almacén' },
    actor:   { w: 64,  h: 96,  label: 'Usuario',        description: 'Usuario / persona' },
    stack:   { w: 130, h: 90,  label: 'Capas',          description: 'Arquitectura por capas / layered' },
    hexagon: { w: 120, h: 110, label: 'Servicio',       description: 'Arquitectura hexagonal / microservicio' },
    queue:   { w: 170, h: 56,  label: 'Cola',           description: 'Cola FIFO / event broker' },
    package: { w: 220, h: 140, label: 'Bounded context',description: 'Paquete / bounded context — agrupa shapes' },
    text:    { w: 120, h: 34,  label: 'Etiqueta',       description: 'Texto / etiqueta libre' }
  };

  const TOOLBAR_ITEMS = [
    { id: 'rect',    label: 'Cuadrado',  hint: 'Componente / servicio' },
    { id: 'circle',  label: 'Círculo',   hint: 'Proceso / actor lógico' },
    { id: 'cloud',   label: 'Nube',      hint: 'Servicio externo' },
    { id: 'db',      label: 'BD',        hint: 'Base de datos' },
    { id: 'actor',   label: 'Actor',     hint: 'Usuario / persona' },
    { id: 'stack',   label: 'Capas',     hint: 'Arquitectura por capas' },
    { id: 'hexagon', label: 'Hexágono',  hint: 'Hexagonal / microservicio' },
    { id: 'queue',   label: 'Cola',      hint: 'Cola FIFO / event broker' },
    { id: 'package', label: 'Paquete',   hint: 'Bounded context / módulo agrupador' },
    { id: 'text',    label: 'Texto',     hint: 'Etiqueta de texto libre, en cualquier lado' },
    { id: 'connect', label: 'Conexión',  hint: 'Click dos formas para conectarlas' },
  ];

  function uid() { return 'n' + Math.random().toString(36).slice(2, 9); }
  function clone(s) { return JSON.parse(JSON.stringify(s || { nodes: [], edges: [] })); }

  // Clipboard de formas, a nivel módulo: persiste entre montajes y permite
  // copiar/pegar incluso entre instancias del editor en la misma sesión.
  let DE_CLIPBOARD = null;  // { nodes: [...], edges: [...] }

  // Paleta de color por nodo. La key se guarda en node.color y se pinta vía
  // data-color + CSS (tema-aware con color-mix). '' = sin color → usa el del tipo.
  const DE_PALETTE = [
    { key: '',       name: 'Por tipo' },
    { key: 'slate',  name: 'Pizarra' },
    { key: 'coral',  name: 'Coral' },
    { key: 'amber',  name: 'Ámbar' },
    { key: 'green',  name: 'Verde' },
    { key: 'teal',   name: 'Teal' },
    { key: 'blue',   name: 'Azul' },
    { key: 'violet', name: 'Violeta' },
    { key: 'pink',   name: 'Rosa' },
  ];

  function shapeIconSVG(type, size = 14) {
    const s = size;
    const c = `stroke="currentColor" fill="none" stroke-width="1.6" stroke-linejoin="round"`;
    switch (type) {
      case 'rect':   return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><rect x="2" y="4" width="12" height="8" rx="1.5" ${c}/></svg>`;
      case 'circle': return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5" ${c}/></svg>`;
      case 'cloud':  return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><path d="M4 11h8a2.5 2.5 0 0 0 0-5 3 3 0 0 0-5.6-1A2.5 2.5 0 0 0 4 11z" ${c}/></svg>`;
      case 'db':     return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><ellipse cx="8" cy="4" rx="5" ry="1.6" ${c}/><path d="M3 4v8c0 .9 2.2 1.6 5 1.6s5-.7 5-1.6V4" ${c}/><path d="M3 8c0 .9 2.2 1.6 5 1.6s5-.7 5-1.6" ${c}/></svg>`;
      case 'actor':  return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><circle cx="8" cy="4" r="2" ${c}/><path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" ${c}/></svg>`;
      case 'stack':  return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><rect x="3" y="3" width="9" height="3" rx="0.5" ${c}/><rect x="3" y="7" width="9" height="3" rx="0.5" ${c}/><rect x="3" y="11" width="9" height="3" rx="0.5" ${c}/></svg>`;
      case 'hexagon':return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><path d="M4 2 L12 2 L15 8 L12 14 L4 14 L1 8 Z" ${c}/></svg>`;
      case 'queue':  return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><rect x="1" y="5" width="14" height="6" rx="0.5" ${c}/><line x1="5" y1="5" x2="5" y2="11" ${c}/><line x1="9" y1="5" x2="9" y2="11" ${c}/><line x1="13" y1="5" x2="13" y2="11" ${c}/></svg>`;
      case 'package':return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" fill="none" stroke-width="1.4" stroke-dasharray="2 1.5"/></svg>`;
      case 'text':   return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><path d="M3 4h10M8 4v9M6 13h4" ${c}/></svg>`;
      case 'connect':return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><line x1="2" y1="8" x2="13" y2="8" ${c}/><polyline points="10,5 13,8 10,11" ${c}/></svg>`;
      case 'trash':  return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><polyline points="2,4 14,4" ${c}/><path d="M4 4v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4" ${c}/><line x1="7" y1="7" x2="7" y2="12" ${c}/><line x1="9" y1="7" x2="9" y2="12" ${c}/></svg>`;
      case 'clear':  return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><path d="M3 6h10M5 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M4 6l1 7a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l1-7" ${c}/></svg>`;
      case 'edit':   return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><path d="M11 2l3 3-8 8H3v-3l8-8z" ${c}/></svg>`;
      case 'autolayout': return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><rect x="1" y="6" width="4" height="4" rx="0.5" ${c}/><rect x="11" y="2" width="4" height="4" rx="0.5" ${c}/><rect x="11" y="10" width="4" height="4" rx="0.5" ${c}/><path d="M5 8h3M8 8v-4M8 4h3M8 8v4M8 12h3" ${c}/></svg>`;
      case 'undo':   return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><path d="M6 4 L2.5 7 L6 10 M2.5 7 H10 a3.5 3.5 0 0 1 0 7 H7" ${c}/></svg>`;
      case 'redo':   return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><path d="M10 4 L13.5 7 L10 10 M13.5 7 H6 a3.5 3.5 0 0 0 0 7 H9" ${c}/></svg>`;
      case 'log':    return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><path d="M3 3h10M3 6h10M3 9h7M3 12h5" ${c}/></svg>`;
      case 'palette':return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><rect x="2" y="2" width="5" height="5" rx="1" ${c}/><rect x="9" y="2" width="5" height="5" rx="1" ${c}/><rect x="2" y="9" width="5" height="5" rx="1" ${c}/><rect x="9" y="9" width="5" height="5" rx="1" ${c}/></svg>`;
      case 'group':  return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><rect x="1.5" y="1.5" width="8.5" height="8.5" rx="1.5" ${c}/><rect x="6" y="6" width="8.5" height="8.5" rx="1.5" ${c}/></svg>`;
      case 'ungroup':return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><rect x="1.5" y="1.5" width="7" height="7" rx="1.5" ${c}/><rect x="7.5" y="7.5" width="7" height="7" rx="1.5" stroke="currentColor" fill="none" stroke-width="1.6" stroke-dasharray="2 1.6"/></svg>`;
      case 'preset': return `<svg width="${s}" height="${s}" viewBox="0 0 16 16"><rect x="2" y="2" width="5" height="5" rx="1" ${c}/><rect x="9" y="2" width="5" height="5" rx="1" ${c}/><rect x="2" y="9" width="12" height="5" rx="1" ${c}/></svg>`;
      default: return '';
    }
  }

  function shapeBodyPath(type, w, h) {
    switch (type) {
      case 'rect':   return null;
      case 'circle': return null;
      case 'cloud': {
        const w8 = w / 8, h2 = h / 2;
        return `
          M ${w8} ${h - 6}
          a ${h2 * 0.6} ${h2 * 0.6} 0 0 1 0 -${h2 * 0.5}
          a ${h2 * 0.55} ${h2 * 0.55} 0 0 1 ${w8 * 1.6} -${h2 * 0.45}
          a ${h2 * 0.6} ${h2 * 0.6} 0 0 1 ${w8 * 2.6} 0
          a ${h2 * 0.55} ${h2 * 0.55} 0 0 1 ${w8 * 1.7} ${h2 * 0.3}
          a ${h2 * 0.6} ${h2 * 0.6} 0 0 1 0 ${h2 * 0.8}
          Z`;
      }
      case 'db': {
        const rx = w / 2, ry = 10;
        return `
          M 0 ${ry}
          a ${rx} ${ry} 0 0 1 ${w} 0
          L ${w} ${h - ry}
          a ${rx} ${ry} 0 0 1 -${w} 0
          Z
          M 0 ${ry}
          a ${rx} ${ry} 0 0 0 ${w} 0
        `;
      }
      case 'actor': {
        const cx = w / 2, headR = Math.min(w, h) * 0.20;
        const headY = headR + 4;
        return `
          M ${cx} ${headY - headR}
          a ${headR} ${headR} 0 1 0 0.01 0
          Z
          M ${cx - w * 0.4} ${h}
          C ${cx - w * 0.4} ${h * 0.55}, ${cx + w * 0.4} ${h * 0.55}, ${cx + w * 0.4} ${h}
        `;
      }
    }
    return null;
  }

  // Type-specific body geometry. Each branch appends 1+ elements to `g`.
  // Class `de-node-body` is what gets the per-type fill / stroke.
  function renderShapeBody(g, type, w, h) {
    if (type === 'rect') {
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', 0); r.setAttribute('y', 0);
      r.setAttribute('width', w); r.setAttribute('height', h);
      r.setAttribute('rx', 10);
      r.setAttribute('class', 'de-node-body');
      g.appendChild(r);
      return;
    }
    if (type === 'circle') {
      const e = document.createElementNS(NS, 'ellipse');
      e.setAttribute('cx', w / 2); e.setAttribute('cy', h / 2);
      e.setAttribute('rx', w / 2 - 2); e.setAttribute('ry', h / 2 - 2);
      e.setAttribute('class', 'de-node-body');
      g.appendChild(e);
      return;
    }
    if (type === 'stack') {
      // Three offset rounded rectangles, back-to-front. Each is a separate
      // element so per-type styles still work (all share .de-node-body).
      const innerW = w - 16;
      const innerH = h - 16;
      const offsets = [{ x: 16, y: 16, op: 0.55 }, { x: 8, y: 8, op: 0.80 }, { x: 0, y: 0, op: 1 }];
      offsets.forEach((o, i) => {
        const r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', o.x); r.setAttribute('y', o.y);
        r.setAttribute('width', innerW); r.setAttribute('height', innerH);
        r.setAttribute('rx', 4);
        r.setAttribute('class', 'de-node-body de-node-stack-layer');
        r.setAttribute('style', `opacity:${o.op}`);
        g.appendChild(r);
      });
      return;
    }
    if (type === 'hexagon') {
      const q = w / 4;
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', `M ${q} 0 L ${w - q} 0 L ${w} ${h/2} L ${w - q} ${h} L ${q} ${h} L 0 ${h/2} Z`);
      path.setAttribute('class', 'de-node-body');
      g.appendChild(path);
      return;
    }
    if (type === 'queue') {
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', 0); r.setAttribute('y', 0);
      r.setAttribute('width', w); r.setAttribute('height', h);
      r.setAttribute('rx', 6);
      r.setAttribute('class', 'de-node-body');
      g.appendChild(r);
      // Inner FIFO dividers
      const cells = 5;
      for (let i = 1; i < cells; i++) {
        const x = (w / cells) * i;
        const l = document.createElementNS(NS, 'line');
        l.setAttribute('x1', x); l.setAttribute('x2', x);
        l.setAttribute('y1', 6); l.setAttribute('y2', h - 6);
        l.setAttribute('class', 'de-node-divider');
        g.appendChild(l);
      }
      // Small entry/exit arrows so the direction reads as FIFO
      const entry = document.createElementNS(NS, 'path');
      entry.setAttribute('d', `M -8 ${h/2} L 0 ${h/2 - 4} L 0 ${h/2 + 4} Z`);
      entry.setAttribute('class', 'de-node-queue-cap');
      g.appendChild(entry);
      const exit = document.createElementNS(NS, 'path');
      exit.setAttribute('d', `M ${w} ${h/2 - 4} L ${w + 8} ${h/2} L ${w} ${h/2 + 4} Z`);
      exit.setAttribute('class', 'de-node-queue-cap');
      g.appendChild(exit);
      return;
    }
    if (type === 'package') {
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', 0); r.setAttribute('y', 0);
      r.setAttribute('width', w); r.setAttribute('height', h);
      r.setAttribute('rx', 10);
      r.setAttribute('class', 'de-node-body de-node-package-body');
      g.appendChild(r);
      return;
    }
    if (type === 'db') {
      // Cylinder = filled body (side walls + bottom cap) + a fully-filled top
      // lid ellipse on top. The lid's own stroke draws both the top dome and the
      // front seam, so the whole top section is covered with colour.
      const rx = w / 2, ry = 11;
      const body = document.createElementNS(NS, 'path');
      body.setAttribute('d', `M 0 ${ry} L 0 ${h - ry} a ${rx} ${ry} 0 0 0 ${w} 0 L ${w} ${ry} Z`);
      body.setAttribute('class', 'de-node-body');
      g.appendChild(body);
      const lid = document.createElementNS(NS, 'ellipse');
      lid.setAttribute('cx', rx); lid.setAttribute('cy', ry);
      lid.setAttribute('rx', rx); lid.setAttribute('ry', ry);
      lid.setAttribute('class', 'de-node-body de-node-db-lid');
      g.appendChild(lid);
      return;
    }
    if (type === 'text') {
      // Free-floating label: an invisible hit rect (so it can be clicked/dragged)
      // plus a dashed outline that only shows on hover/selection (via CSS).
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', 0); r.setAttribute('y', 0);
      r.setAttribute('width', w); r.setAttribute('height', h);
      r.setAttribute('rx', 6);
      r.setAttribute('class', 'de-node-text-box');
      g.appendChild(r);
      return;
    }
    // Default: SVG path string from shapeBodyPath (cloud, actor)
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', shapeBodyPath(type, w, h) || '');
    path.setAttribute('class', 'de-node-body');
    g.appendChild(path);
  }

  // Label placement is tuned per shape to sit on the figure's *visual* mass, not
  // the bounding-box centre — e.g. below the actor's body, inside the cylinder
  // wall (below its lid), in the hexagon's flat middle band. Both renderShape and
  // startInlineEdit use this so the static label and the edit box always align.
  function labelBox(type, w, h) {
    switch (type) {
      case 'actor':   return { x: -w * 0.35, y: h + 1,            w: w * 1.7,        h: 30 };
      case 'db':      return { x: 6,         y: (h + 22) / 2 - 15, w: w - 12,        h: 30 };
      case 'cloud':   return { x: w * 0.12,  y: h * 0.58 - 15,     w: w * 0.76,      h: 30 };
      case 'stack':   return { x: 4,         y: (h - 16) / 2 - 15, w: (w - 16) - 6,  h: 30 };
      case 'hexagon': return { x: w * 0.18,  y: h / 2 - 15,        w: w * 0.64,      h: 30 };
      case 'queue':   return { x: 6,         y: h / 2 - 15,        w: w - 12,        h: 30 };
      case 'text':    return { x: 1,         y: 1,                 w: w - 2,         h: h - 2 };
      default:        return { x: 4,         y: h / 2 - 16,        w: w - 8,         h: 32 };
    }
  }

  function renderShape(svg, node, isSelected) {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'de-node de-node-type-' + node.type + (isSelected ? ' is-selected' : ''));
    g.setAttribute('data-id', node.id);
    if (node.color) g.setAttribute('data-color', node.color);
    g.setAttribute('transform', `translate(${node.x},${node.y})`);

    const w = node.w, h = node.h;
    renderShapeBody(g, node.type, w, h);

    // Subtle inner highlight for depth on plain rects
    if (node.type === 'rect') {
      const hl = document.createElementNS(NS, 'rect');
      hl.setAttribute('class', 'de-node-highlight');
      hl.setAttribute('x', 1); hl.setAttribute('y', 1);
      hl.setAttribute('width', w - 2); hl.setAttribute('height', Math.min(8, h - 2));
      hl.setAttribute('rx', 9);
      g.appendChild(hl);
    }

    // Label — geometry tuned per shape (see labelBox).
    const lb = labelBox(node.type, w, h);
    const fo = document.createElementNS(NS, 'foreignObject');
    fo.setAttribute('x', lb.x);
    fo.setAttribute('y', lb.y);
    fo.setAttribute('width', lb.w);
    fo.setAttribute('height', lb.h);
    fo.setAttribute('class', 'de-node-label-host');
    const div = document.createElement('div');
    div.setAttribute('class', 'de-node-label-text' + (node.type === 'text' ? ' is-free-text' : ''));
    div.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    div.textContent = node.label;
    fo.appendChild(div);
    g.appendChild(fo);

    svg.appendChild(g);
    return g;
  }

  // Cardinal anchor points on a node's bounding box (n/e/s/w).
  function anchorPoint(node, anchor) {
    switch (anchor) {
      case 'n': return { x: node.x + node.w / 2, y: node.y };
      case 'e': return { x: node.x + node.w,     y: node.y + node.h / 2 };
      case 's': return { x: node.x + node.w / 2, y: node.y + node.h };
      case 'w': return { x: node.x,              y: node.y + node.h / 2 };
    }
    return { x: node.x + node.w / 2, y: node.y + node.h / 2 };
  }
  function nearestAnchor(node, x, y) {
    const opts = ['n', 'e', 's', 'w'];
    let best = 'n', bestD = Infinity;
    for (const a of opts) {
      const p = anchorPoint(node, a);
      const d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < bestD) { bestD = d; best = a; }
    }
    return best;
  }

  // Point where the segment from the node's center toward (tx,ty) crosses the
  // node's *outline*. Round shapes (circle) use an ellipse intersection so the
  // arrowhead touches the silhouette instead of the bounding-box corner; the
  // rest use the tight box. Recomputed on every render → arrows follow moves
  // and resizes and always face the other shape.
  function edgePoint(node, tx, ty) {
    const cx = node.x + node.w / 2;
    const cy = node.y + node.h / 2;
    const dx = tx - cx;
    const dy = ty - cy;
    if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) return { x: cx, y: cy };
    const hw = node.w / 2, hh = node.h / 2;
    if (node.type === 'circle') {
      // Match the rendered ellipse, whose radii are inset by 2 for the stroke
      // (see renderShapeBody) — so the arrowhead touches the visible outline.
      const rx = Math.max(1, hw - 2), ry = Math.max(1, hh - 2);
      const k = 1 / Math.sqrt((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry));
      return { x: cx + dx * k, y: cy + dy * k };
    }
    const scaleX = hw / Math.abs(dx || 0.001);
    const scaleY = hh / Math.abs(dy || 0.001);
    const scale = Math.min(scaleX, scaleY);
    return { x: cx + dx * scale, y: cy + dy * scale };
  }

  // Full geometry of an edge: [startOnA, ...waypoints, endOnB]. Endpoints are
  // intersected with each shape's outline toward the adjacent point (first/last
  // waypoint, or the opposite centre when straight) — so the arrow meets the
  // shapes cleanly with any number of bends and follows moves/resizes.
  function edgeGeometry(a, b, edge) {
    const ac = { x: a.x + a.w / 2, y: a.y + a.h / 2 };
    const bc = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
    const wps = Array.isArray(edge.points) ? edge.points : [];
    if (!wps.length) {
      let p1 = edgePoint(a, bc.x, bc.y);
      let p2 = edgePoint(b, p1.x, p1.y);
      p1 = edgePoint(a, p2.x, p2.y);
      return [p1, p2];
    }
    const p1 = edgePoint(a, wps[0].x, wps[0].y);
    const p2 = edgePoint(b, wps[wps.length - 1].x, wps[wps.length - 1].y);
    return [p1, ...wps.map(w => ({ x: w.x, y: w.y })), p2];
  }

  // Path data: straight polyline, or a Catmull-Rom → cubic-Bézier smooth curve
  // through every point when edge.curved is set.
  function edgePathD(pts, curved) {
    if (pts.length < 2) return '';
    if (!curved || pts.length === 2) {
      return 'M ' + pts.map(p => `${p.x} ${p.y}`).join(' L ');
    }
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || pts[i + 1];
      const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
    }
    return d;
  }

  // Point at half the total polyline length (where the edge label sits).
  function polylineMidpoint(pts) {
    if (!pts.length) return { x: 0, y: 0 };
    if (pts.length === 1) return pts[0];
    const segs = [];
    let total = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const dlen = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
      segs.push(dlen); total += dlen;
    }
    let target = total / 2, acc = 0;
    for (let i = 0; i < segs.length; i++) {
      if (acc + segs[i] >= target) {
        const t = segs[i] ? (target - acc) / segs[i] : 0;
        return {
          x: pts[i].x + (pts[i + 1].x - pts[i].x) * t,
          y: pts[i].y + (pts[i + 1].y - pts[i].y) * t,
        };
      }
      acc += segs[i];
    }
    return pts[pts.length - 1];
  }

  function renderEdge(svg, edge, nodeById, isSelected) {
    const a = nodeById[edge.from];
    const b = nodeById[edge.to];
    if (!a || !b) return;
    const pts = edgeGeometry(a, b, edge);
    const d = edgePathD(pts, edge.curved);
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'de-edge' + (isSelected ? ' is-selected' : ''));
    g.setAttribute('data-id', edge.id);
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('class', 'de-edge-line');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('marker-end', 'url(#de-arrow)');
    g.appendChild(path);
    // Wider invisible hit area for selection
    const hit = document.createElementNS(NS, 'path');
    hit.setAttribute('class', 'de-edge-hit');
    hit.setAttribute('d', d);
    hit.setAttribute('fill', 'none');
    g.appendChild(hit);
    if (edge.label) {
      const m = polylineMidpoint(pts);
      const lt = document.createElementNS(NS, 'text');
      lt.setAttribute('class', 'de-edge-label');
      lt.setAttribute('x', m.x);
      lt.setAttribute('y', m.y - 5);
      lt.setAttribute('text-anchor', 'middle');
      lt.textContent = edge.label;
      g.appendChild(lt);
    }
    svg.appendChild(g);
  }

  function create(container, opts = {}) {
    const onChange = opts.onChange || (() => {});
    const initial = opts.initialState || { nodes: [], edges: [] };
    let state = clone(initial);
    let mode = null;            // null | 'place:<type>' | 'connect'
    let selectedNodes = new Set(); // ids of selected nodes (multi-selection)
    let selectedEdgeId = null;     // id of selected edge (mutually exclusive with nodes)
    let dragging = null;         // { primaryId, startMouseX, startMouseY, startPositions: {id->{x,y}}, moved, snapGuides }
    let resizing = null;         // { id, corner, startX, startY, start: {x,y,w,h} } while dragging a corner handle
    let edgeDrag = null;         // { edgeId, wpIndex } while dragging an edge waypoint
    let marquee = null;          // { startX, startY, curX, curY, shift, initialNodes }
    let connectFrom = null;      // node id while in connect mode (toolbar option)
    let ghostLine = null;        // SVG line element preview during connect
    let hoveredNodeId = null;    // node currently under cursor (anchors visible)
    let hoverClearTimer = null;
    let pendingConnect = null;   // { fromId, fromAnchor } while dragging from an anchor

    // ---- Historial (undo/redo) + bitácora (trazabilidad) ----
    // undo/redo guardan snapshots completos del estado (incluye trace). El
    // `committedSnapshot` es la línea base del último commit: cada commitChange
    // lo apila para deshacer y luego lo reemplaza. La trazabilidad vive en
    // state.trace, así que viaja con el estado (persistencia + export + undo).
    const HISTORY_LIMIT = 120;
    let undoStack = [];
    let redoStack = [];
    let committedSnapshot = null;
    let lastCommit = { kind: null, ts: 0 };
    if (!Array.isArray(state.trace)) state.trace = [];
    committedSnapshot = clone(state);

    // Viewport: visible window into the larger canvas. Mutating it and calling
    // updateViewBox() re-aims the camera. svgPoint() picks up CTM changes
    // automatically so all downstream math still works.
    const viewport = {
      x: (CANVAS_W - VIEW_W0) / 2,
      y: (CANVAS_H - VIEW_H0) / 2,
      w: VIEW_W0,
      h: VIEW_H0
    };
    let panning = null;  // { startMouseX, startMouseY, startVx, startVy }
    // Lifecycle / scope-gating (integración React: cleanup + teclado acotado al editor)
    let pointerInside = false; // el mouse está sobre el editor → habilita atajos de teclado
    let destroyed = false;     // marca para abortar callbacks async tras destroy()
    let rafId = null;          // id del requestAnimationFrame del auto-layout
    let inlineTimer = null;    // id del setTimeout que abre el editor inline al colocar

    function activeSelection() {
      if (selectedEdgeId) return { kind: 'edge', id: selectedEdgeId };
      if (selectedNodes.size === 1) return { kind: 'node', id: [...selectedNodes][0] };
      if (selectedNodes.size > 1) return { kind: 'multi', count: selectedNodes.size };
      return null;
    }
    function clearSelection() { selectedNodes.clear(); selectedEdgeId = null; }

    container.classList.add('diagram-editor');
    container.innerHTML = `
      <div class="de-toolbar" role="group" aria-label="Herramientas de diagrama">
        ${TOOLBAR_ITEMS.map(t => `
          <button type="button" class="de-tool" data-tool="${t.id}" title="${t.hint}">
            <span class="de-tool-icon">${shapeIconSVG(t.id, 14)}</span>
            <span class="de-tool-label">${t.label}</span>
          </button>
        `).join('')}
        <div class="de-toolbar-sep" aria-hidden="true"></div>
        <button type="button" class="de-tool de-tool-secondary" data-action="rename" title="Renombrar lo seleccionado">
          <span class="de-tool-icon">${shapeIconSVG('edit', 14)}</span>
          <span class="de-tool-label">Renombrar</span>
        </button>
        <button type="button" class="de-tool de-tool-danger" data-action="delete" title="Borrar lo seleccionado (Supr)">
          <span class="de-tool-icon">${shapeIconSVG('trash', 14)}</span>
          <span class="de-tool-label">Borrar</span>
        </button>
        <button type="button" class="de-tool de-tool-danger" data-action="clear" title="Vaciar el diagrama">
          <span class="de-tool-icon">${shapeIconSVG('clear', 14)}</span>
          <span class="de-tool-label">Vaciar</span>
        </button>
        <div class="de-toolbar-sep" aria-hidden="true"></div>
        <button type="button" class="de-tool de-tool-secondary" data-action="autolayout" title="Reacomodar todo el diagrama">
          <span class="de-tool-icon">${shapeIconSVG('autolayout', 14)}</span>
          <span class="de-tool-label">Reacomodar</span>
        </button>
        <div class="de-toolbar-sep" aria-hidden="true"></div>
        <button type="button" class="de-tool de-tool-secondary" data-action="undo" title="Deshacer (Ctrl+Z)" disabled>
          <span class="de-tool-icon">${shapeIconSVG('undo', 14)}</span>
          <span class="de-tool-label">Deshacer</span>
        </button>
        <button type="button" class="de-tool de-tool-secondary" data-action="redo" title="Rehacer (Ctrl+Shift+Z)" disabled>
          <span class="de-tool-icon">${shapeIconSVG('redo', 14)}</span>
          <span class="de-tool-label">Rehacer</span>
        </button>
        <button type="button" class="de-tool de-tool-secondary" data-action="trace" title="Bitácora de ediciones — trazabilidad de cada cambio">
          <span class="de-tool-icon">${shapeIconSVG('log', 14)}</span>
          <span class="de-tool-label">Bitácora</span>
          <span class="de-trace-count" data-trace-count>0</span>
        </button>
        <button type="button" class="de-tool de-tool-secondary" data-action="presets" title="Plantillas — bloques y grupos prearmados">
          <span class="de-tool-icon">${shapeIconSVG('preset', 14)}</span>
          <span class="de-tool-label">Plantillas</span>
        </button>
      </div>
      <div class="de-hint" data-de-hint></div>
      <div class="de-selbar" data-selbar hidden></div>
      <div class="de-canvas-wrap">
        <svg class="de-canvas" role="application" tabindex="0" aria-label="Pizarra de diagramas — colocá, arrastrá y conectá formas con el mouse" viewBox="${(CANVAS_W - VIEW_W0) / 2} ${(CANVAS_H - VIEW_H0) / 2} ${VIEW_W0} ${VIEW_H0}" preserveAspectRatio="xMidYMid meet" xmlns="${NS}">
          <defs>
            <marker id="de-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
            <pattern id="de-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" class="de-grid-line" stroke-width="1"/>
            </pattern>
          </defs>
          <!-- Whiteboard backdrop. Wraps a region a bit beyond the canvas so
               pan/zoom never reveals a hard edge mid-drag. -->
          <rect class="de-canvas-bg" x="-80" y="-80" width="${CANVAS_W + 160}" height="${CANVAS_H + 160}" fill="url(#de-grid)" />
          <rect class="de-canvas-bounds" x="0" y="0" width="${CANVAS_W}" height="${CANVAS_H}" fill="none" stroke-width="1"/>
          <g data-groups></g>
          <g data-edges></g>
          <g data-ghost></g>
          <g data-nodes></g>
          <g data-anchors></g>
          <g data-resize></g>
          <g data-edge-handles></g>
          <g data-snap></g>
          <g data-marquee></g>
        </svg>
        <div class="de-zoom-controls" data-zoom-controls>
          <button type="button" class="de-zoom-btn" data-zoom="out" title="Zoom out (–)">−</button>
          <button type="button" class="de-zoom-btn de-zoom-percent" data-zoom="reset" title="Restablecer zoom">100%</button>
          <button type="button" class="de-zoom-btn" data-zoom="in" title="Zoom in (+)">+</button>
          <div class="de-zoom-sep" aria-hidden="true"></div>
          <button type="button" class="de-zoom-btn" data-zoom="fit" title="Ver todo el lienzo">⤢</button>
        </div>
        <div class="de-trace-panel" data-trace-panel hidden>
          <div class="de-trace-head">
            <span class="de-trace-title">Bitácora de ediciones</span>
            <div class="de-trace-head-actions">
              <button type="button" class="de-trace-clear" data-action="trace-clear" title="Vaciar la bitácora">Limpiar</button>
              <button type="button" class="de-trace-close" data-action="trace-close" title="Cerrar" aria-label="Cerrar bitácora">✕</button>
            </div>
          </div>
          <ol class="de-trace-list" data-trace-list></ol>
          <div class="de-trace-empty" data-trace-empty>Todavía no hay ediciones registradas. Cada cambio que hagas queda acá.</div>
        </div>
        <div class="de-preset-panel" data-preset-panel hidden>
          <div class="de-trace-head">
            <span class="de-trace-title">Plantillas</span>
            <button type="button" class="de-trace-close" data-action="presets-close" title="Cerrar" aria-label="Cerrar plantillas">✕</button>
          </div>
          <div class="de-preset-list" data-preset-list></div>
        </div>
      </div>
    `;

    const svg = container.querySelector('.de-canvas');
    const gNodes = svg.querySelector('[data-nodes]');
    const gGroups = svg.querySelector('[data-groups]');
    const gEdges = svg.querySelector('[data-edges]');
    const gGhost = svg.querySelector('[data-ghost]');
    const gAnchors = svg.querySelector('[data-anchors]');
    const gResize = svg.querySelector('[data-resize]');
    const gEdgeHandles = svg.querySelector('[data-edge-handles]');
    const gSnap = svg.querySelector('[data-snap]');
    const gMarquee = svg.querySelector('[data-marquee]');
    const hint = container.querySelector('[data-de-hint]');
    const zoomControls = container.querySelector('[data-zoom-controls]');
    const zoomPercentBtn = zoomControls.querySelector('[data-zoom="reset"]');
    const undoBtn = container.querySelector('[data-action="undo"]');
    const redoBtn = container.querySelector('[data-action="redo"]');
    const traceBtn = container.querySelector('[data-action="trace"]');
    const traceCountEl = container.querySelector('[data-trace-count]');
    const tracePanel = container.querySelector('[data-trace-panel]');
    const traceListEl = container.querySelector('[data-trace-list]');
    const traceEmptyEl = container.querySelector('[data-trace-empty]');
    const selbar = container.querySelector('[data-selbar]');
    const presetBtn = container.querySelector('[data-action="presets"]');
    const presetPanel = container.querySelector('[data-preset-panel]');
    const presetListEl = container.querySelector('[data-preset-list]');

    function snapshot() { return clone(state); }
    function addTrace(kind, label) {
      if (!Array.isArray(state.trace)) state.trace = [];
      state.trace.push({ kind, label, ts: Date.now() });
      if (state.trace.length > 300) state.trace.splice(0, state.trace.length - 300);
    }
    // Commit central: el cambio YA está aplicado a `state`; acá lo registramos en
    // el historial (undo) y en la bitácora (trace), persistimos y refrescamos UI.
    // `opts.coalesce` funde repeticiones rápidas (p. ej. empujar con flechas) en
    // un solo paso de undo y una sola entrada de bitácora.
    function commitChange(kind, label, opts) {
      const now = Date.now();
      const coalesce = opts && opts.coalesce && lastCommit.kind === kind &&
        (now - lastCommit.ts) < 700 && state.trace.length > 0;
      if (coalesce) {
        const last = state.trace[state.trace.length - 1];
        last.label = label; last.ts = now;
      } else {
        undoStack.push(committedSnapshot);
        if (undoStack.length > HISTORY_LIMIT) undoStack.shift();
        redoStack = [];
        addTrace(kind, label);
      }
      committedSnapshot = snapshot();
      lastCommit = { kind, ts: now };
      onChange(state);
      updateHistoryUI();
    }
    function restore(snap) {
      state = snap;
      committedSnapshot = clone(state);
      lastCommit = { kind: null, ts: 0 };
      selectedNodes = new Set([...selectedNodes].filter(id => state.nodes.some(n => n.id === id)));
      if (selectedEdgeId && !state.edges.some(e => e.id === selectedEdgeId)) selectedEdgeId = null;
      setMode(null);
      render();
      onChange(state);
      updateHistoryUI();
    }
    function undo() {
      if (!undoStack.length) return;
      redoStack.push(snapshot());
      restore(undoStack.pop());
    }
    function redo() {
      if (!redoStack.length) return;
      undoStack.push(snapshot());
      restore(redoStack.pop());
    }
    function copySelection() {
      if (!selectedNodes.size) return;
      const nodes = state.nodes.filter(n => selectedNodes.has(n.id)).map(n => clone(n));
      const ids = new Set(nodes.map(n => n.id));
      const edges = state.edges.filter(e => ids.has(e.from) && ids.has(e.to)).map(e => clone(e));
      DE_CLIPBOARD = { nodes, edges };
      hint.innerHTML = `Copiadas <strong>${nodes.length}</strong> forma${nodes.length === 1 ? '' : 's'} · <kbd>Ctrl+V</kbd> para pegar.`;
    }
    function cutSelection() {
      if (!selectedNodes.size) return;
      copySelection();
      const n = selectedNodes.size;
      const dead = new Set(selectedNodes);
      state.nodes = state.nodes.filter(x => !dead.has(x.id));
      state.edges = state.edges.filter(e => !dead.has(e.from) && !dead.has(e.to));
      clearSelection();
      render();
      commitChange('cut', `Cortó ${n} forma${n === 1 ? '' : 's'}`);
      setMode(null);
    }
    function pasteClipboard() {
      if (!DE_CLIPBOARD || !DE_CLIPBOARD.nodes.length) return;
      const OFF = 28;
      const idMap = {};
      const newNodes = DE_CLIPBOARD.nodes.map(n => {
        const nid = uid(); idMap[n.id] = nid;
        return {
          ...clone(n), id: nid,
          x: Math.max(0, Math.min(CANVAS_W - n.w, n.x + OFF)),
          y: Math.max(0, Math.min(CANVAS_H - n.h, n.y + OFF)),
        };
      });
      const newEdges = DE_CLIPBOARD.edges
        .filter(e => idMap[e.from] && idMap[e.to])
        .map(e => ({
          ...clone(e), id: uid(), from: idMap[e.from], to: idMap[e.to],
          points: Array.isArray(e.points) ? e.points.map(p => ({ x: p.x + OFF, y: p.y + OFF })) : [],
        }));
      state.nodes.push(...newNodes);
      state.edges.push(...newEdges);
      selectedNodes = new Set(newNodes.map(n => n.id));
      selectedEdgeId = null;
      render();
      commitChange('paste', `Pegó ${newNodes.length} forma${newNodes.length === 1 ? '' : 's'}`);
    }
    function traceRelTime(ts) {
      const diff = (Date.now() - ts) / 1000;
      if (diff < 5) return 'ahora';
      if (diff < 60) return `hace ${Math.floor(diff)}s`;
      if (diff < 3600) return `hace ${Math.floor(diff / 60)}min`;
      return `hace ${Math.floor(diff / 3600)}h`;
    }
    const TRACE_GLYPH = {
      add: '＋', insert: '⥂', connect: '→', delete: '␡', cut: '✂', paste: '⎘',
      duplicate: '⧉', rename: '✎', label: '🏷', move: '✥', nudge: '✥', resize: '⤡',
      bend: '∿', curve: '∿', layout: '▦', clear: '🗑',
      color: '◑', group: '▢', ungroup: '▢', preset: '▦',
    };
    function renderTrace() {
      if (!traceListEl) return;
      const items = state.trace || [];
      traceListEl.innerHTML = '';
      if (traceEmptyEl) traceEmptyEl.hidden = items.length > 0;
      items.forEach((t, i) => {
        const li = document.createElement('li');
        li.className = 'de-trace-item de-trace-kind-' + t.kind;
        li.innerHTML =
          `<span class="de-trace-n">${i + 1}</span>` +
          `<span class="de-trace-glyph" aria-hidden="true">${TRACE_GLYPH[t.kind] || '•'}</span>` +
          `<span class="de-trace-label"></span>` +
          `<span class="de-trace-time"></span>`;
        li.querySelector('.de-trace-label').textContent = t.label || t.kind;
        li.querySelector('.de-trace-time').textContent = traceRelTime(t.ts);
        traceListEl.appendChild(li);
      });
      traceListEl.scrollTop = traceListEl.scrollHeight;
    }
    function updateHistoryUI() {
      if (undoBtn) undoBtn.disabled = undoStack.length === 0;
      if (redoBtn) redoBtn.disabled = redoStack.length === 0;
      const n = (state.trace || []).length;
      if (traceCountEl) traceCountEl.textContent = String(n);
      if (traceBtn) traceBtn.classList.toggle('has-entries', n > 0);
      if (tracePanel && !tracePanel.hidden) renderTrace();
    }
    function toggleTrace(force) {
      if (!tracePanel) return;
      const show = typeof force === 'boolean' ? force : tracePanel.hidden;
      tracePanel.hidden = !show;
      if (traceBtn) traceBtn.classList.toggle('is-active', show);
      if (show) {
        renderTrace();
        // mutuamente excluyente con el panel de plantillas (mismo rincón)
        if (presetPanel && !presetPanel.hidden) {
          presetPanel.hidden = true;
          if (presetBtn) presetBtn.classList.remove('is-active');
        }
      }
    }

    function updateViewBox() {
      svg.setAttribute('viewBox', `${viewport.x} ${viewport.y} ${viewport.w} ${viewport.h}`);
      if (zoomPercentBtn) {
        const pct = Math.round((VIEW_W0 / viewport.w) * 100);
        zoomPercentBtn.textContent = pct + '%';
      }
    }
    function clampViewport() {
      viewport.w = Math.max(VIEW_W_MIN, Math.min(VIEW_W_MAX, viewport.w));
      // Keep aspect ratio of the original viewport so the SVG never distorts
      viewport.h = viewport.w * (VIEW_H0 / VIEW_W0);
      // Allow a small padding so the user can over-pan slightly for breathing room
      const PAD = 80;
      viewport.x = Math.max(-PAD, Math.min(CANVAS_W + PAD - viewport.w, viewport.x));
      viewport.y = Math.max(-PAD, Math.min(CANVAS_H + PAD - viewport.h, viewport.y));
    }
    function zoomBy(factor, anchorCanvas /* { x, y } */) {
      const oldW = viewport.w;
      let newW = Math.max(VIEW_W_MIN, Math.min(VIEW_W_MAX, oldW / factor));
      const ratio = newW / oldW;
      const ax = anchorCanvas ? anchorCanvas.x : viewport.x + viewport.w / 2;
      const ay = anchorCanvas ? anchorCanvas.y : viewport.y + viewport.h / 2;
      // After zoom, viewport such that the anchor point stays under the cursor
      viewport.x = ax - (ax - viewport.x) * ratio;
      viewport.y = ay - (ay - viewport.y) * ratio;
      viewport.w = newW;
      viewport.h = newW * (VIEW_H0 / VIEW_W0);
      clampViewport();
      updateViewBox();
    }
    function resetView() {
      viewport.w = VIEW_W0;
      viewport.h = VIEW_H0;
      const bb = nodesBoundingBox();
      if (bb) centerViewOn(bb.cx, bb.cy);
      else { viewport.x = (CANVAS_W - VIEW_W0) / 2; viewport.y = (CANVAS_H - VIEW_H0) / 2; }
      updateViewBox();
    }
    function centerViewOn(cx, cy) {
      viewport.x = cx - viewport.w / 2;
      viewport.y = cy - viewport.h / 2;
      clampViewport();
    }
    function nodesBoundingBox() {
      if (!state.nodes.length) return null;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      state.nodes.forEach(n => {
        minX = Math.min(minX, n.x);
        minY = Math.min(minY, n.y);
        maxX = Math.max(maxX, n.x + n.w);
        maxY = Math.max(maxY, n.y + n.h);
      });
      return { minX, minY, maxX, maxY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
    }
    function fitView() {
      // Show the entire canvas + a little padding, preserving aspect.
      const aspect = VIEW_W0 / VIEW_H0;
      const PAD = 40;
      let w = CANVAS_W + 2 * PAD;
      let h = w / aspect;
      if (h < CANVAS_H + 2 * PAD) {
        h = CANVAS_H + 2 * PAD;
        w = h * aspect;
      }
      viewport.w = Math.min(VIEW_W_MAX, w);
      viewport.h = viewport.w / aspect;
      viewport.x = (CANVAS_W - viewport.w) / 2;
      viewport.y = (CANVAS_H - viewport.h) / 2;
      updateViewBox();
    }

    // Zoom toolbar buttons
    zoomControls.querySelector('[data-zoom="in"]').addEventListener('click', () => zoomBy(1.25));
    zoomControls.querySelector('[data-zoom="out"]').addEventListener('click', () => zoomBy(1/1.25));
    zoomControls.querySelector('[data-zoom="reset"]').addEventListener('click', () => resetView());
    zoomControls.querySelector('[data-zoom="fit"]').addEventListener('click', () => fitView());

    // Wheel gestures, Figma/Miro style:
    //  - ctrlKey set → pinch-to-zoom on Mac (or Ctrl+wheel) → ZOOM toward cursor.
    //  - otherwise (two-finger trackpad scroll / mouse wheel) → PAN the viewport.
    svg.addEventListener('wheel', (evt) => {
      evt.preventDefault();
      if (evt.ctrlKey) {
        // Pinch / Ctrl+wheel → zoom toward the cursor.
        const p = svgPoint(evt);
        const factor = Math.exp(-evt.deltaY * 0.015);
        zoomBy(factor, p);
        return;
      }
      // Two-finger scroll / wheel → pan. Convert the wheel delta (CSS px) into
      // canvas units using the current CTM scale, so panning feels 1:1 with the
      // cursor regardless of zoom. Signs follow Figma: scrolling content down /
      // right moves the page so new content appears in that direction.
      const m = svg.getScreenCTM();
      const scaleX = m ? 1 / m.a : viewport.w / VIEW_W0;
      const scaleY = m ? 1 / m.d : viewport.h / VIEW_H0;
      viewport.x += evt.deltaX * scaleX;
      viewport.y += evt.deltaY * scaleY;
      clampViewport();
      updateViewBox();
    }, { passive: false });


    // ---- Alignment snap while dragging ----
    // Threshold in canvas units. Look at edges + center lines of every node
    // that is NOT being moved; pick the smallest delta on each axis below the
    // threshold and apply it, returning the matching guide lines.
    const SNAP_THRESHOLD = 6;
    function computeSnap(startPositions, dx, dy) {
      const movingIds = new Set(Object.keys(startPositions));
      const moving = state.nodes.filter(n => movingIds.has(n.id));
      const others = state.nodes.filter(n => !movingIds.has(n.id));
      if (!moving.length || !others.length) return { dx: 0, dy: 0, guides: [] };

      // Candidate x-lines and y-lines from other nodes
      const xLines = []; // { x, full: 'left'|'right'|'center' }
      const yLines = [];
      others.forEach(o => {
        xLines.push({ x: o.x,            kind: 'edge'   });
        xLines.push({ x: o.x + o.w,      kind: 'edge'   });
        xLines.push({ x: o.x + o.w / 2,  kind: 'center' });
        yLines.push({ y: o.y,            kind: 'edge'   });
        yLines.push({ y: o.y + o.h,      kind: 'edge'   });
        yLines.push({ y: o.y + o.h / 2,  kind: 'center' });
      });

      // For each moving node at its proposed position, gather its 3 x-anchors and 3 y-anchors
      let bestDx = null;   // { delta, guide }
      let bestDy = null;
      moving.forEach(n => {
        const sp = startPositions[n.id];
        const px = sp.x + dx;
        const py = sp.y + dy;
        const myXs = [
          { v: px,           kind: 'edge'   },
          { v: px + n.w,     kind: 'edge'   },
          { v: px + n.w / 2, kind: 'center' }
        ];
        const myYs = [
          { v: py,           kind: 'edge'   },
          { v: py + n.h,     kind: 'edge'   },
          { v: py + n.h / 2, kind: 'center' }
        ];
        myXs.forEach(mx => xLines.forEach(xl => {
          const d = xl.x - mx.v;
          if (Math.abs(d) <= SNAP_THRESHOLD && (bestDx === null || Math.abs(d) < Math.abs(bestDx.delta))) {
            bestDx = { delta: d, guide: { axis: 'x', at: xl.x } };
          }
        }));
        myYs.forEach(my => yLines.forEach(yl => {
          const d = yl.y - my.v;
          if (Math.abs(d) <= SNAP_THRESHOLD && (bestDy === null || Math.abs(d) < Math.abs(bestDy.delta))) {
            bestDy = { delta: d, guide: { axis: 'y', at: yl.y } };
          }
        }));
      });

      const guides = [];
      if (bestDx) guides.push(bestDx.guide);
      if (bestDy) guides.push(bestDy.guide);
      return { dx: bestDx ? bestDx.delta : 0, dy: bestDy ? bestDy.delta : 0, guides };
    }

    function drawSnapGuides(guides) {
      gSnap.innerHTML = '';
      if (!guides || !guides.length) return;
      guides.forEach(g => {
        const line = document.createElementNS(NS, 'line');
        line.setAttribute('class', 'de-snap-guide');
        if (g.axis === 'x') {
          line.setAttribute('x1', g.at); line.setAttribute('x2', g.at);
          line.setAttribute('y1', 0);    line.setAttribute('y2', CANVAS_H);
        } else {
          line.setAttribute('x1', 0);        line.setAttribute('x2', CANVAS_W);
          line.setAttribute('y1', g.at);     line.setAttribute('y2', g.at);
        }
        gSnap.appendChild(line);
      });
    }

    // ---- Auto-layout: Sugiyama-style layered layout left-to-right ----
    // Assigns layers by longest-path from sources (breaking cycles via DFS),
    // then orders nodes within each layer by barycenter of connected nodes
    // to reduce edge crossings, then places them at fixed grid coordinates.
    function autoLayout(animate = true) {
      const nodes = state.nodes;
      if (nodes.length === 0) return;

      const nodeIds = nodes.map(n => n.id);
      const idx = Object.fromEntries(nodeIds.map((id, i) => [id, i]));

      // Build adjacency, dropping self-loops and breaking cycles via DFS
      const forwardEdges = state.edges.filter(e => e.from !== e.to);
      const adj = {}, radj = {};
      nodeIds.forEach(id => { adj[id] = []; radj[id] = []; });
      // Detect back-edges via DFS coloring (0=white, 1=gray, 2=black)
      const color = {};
      nodeIds.forEach(id => { color[id] = 0; });
      const backEdges = new Set();
      function dfs(u, edgesByFrom) {
        color[u] = 1;
        (edgesByFrom[u] || []).forEach(e => {
          if (color[e.to] === 1) backEdges.add(e.id || (e.from + '->' + e.to));
          else if (color[e.to] === 0) dfs(e.to, edgesByFrom);
        });
        color[u] = 2;
      }
      const edgesByFrom = {};
      nodeIds.forEach(id => { edgesByFrom[id] = []; });
      forwardEdges.forEach(e => { edgesByFrom[e.from] && edgesByFrom[e.from].push(e); });
      nodeIds.forEach(id => { if (color[id] === 0) dfs(id, edgesByFrom); });

      forwardEdges.forEach(e => {
        const key = e.id || (e.from + '->' + e.to);
        if (backEdges.has(key)) { adj[e.to].push(e.from); radj[e.from].push(e.to); }
        else                    { adj[e.from].push(e.to); radj[e.to].push(e.from); }
      });

      // Layer assignment via longest path from sources
      const inDeg = {};
      nodeIds.forEach(id => { inDeg[id] = radj[id].length; });
      const layer = {};
      // Kahn-style: start with in-degree 0
      const queue = nodeIds.filter(id => inDeg[id] === 0);
      queue.forEach(id => { layer[id] = 0; });
      let head = 0;
      while (head < queue.length) {
        const u = queue[head++];
        adj[u].forEach(v => {
          layer[v] = Math.max(layer[v] ?? 0, (layer[u] ?? 0) + 1);
          inDeg[v]--;
          if (inDeg[v] === 0) queue.push(v);
        });
      }
      // Any leftover (shouldn't happen after cycle breaking) → put at layer 0
      nodeIds.forEach(id => { if (layer[id] == null) layer[id] = 0; });

      // Group nodes by layer
      const layers = {};
      nodeIds.forEach(id => {
        const L = layer[id];
        (layers[L] = layers[L] || []).push(id);
      });
      const layerKeys = Object.keys(layers).map(Number).sort((a, b) => a - b);

      // Within each layer, reduce crossings by barycenter sweeps (4 passes)
      for (let pass = 0; pass < 4; pass++) {
        layerKeys.forEach(L => {
          const sweep = pass % 2 === 0 ? radj : adj;
          layers[L].sort((a, b) => barycenter(a, sweep, layer, layers) - barycenter(b, sweep, layer, layers));
        });
      }
      function barycenter(id, neighborMap, layer, layers) {
        const neigh = neighborMap[id];
        if (!neigh.length) return idx[id]; // stable fallback
        let sum = 0, count = 0;
        neigh.forEach(nid => {
          const L = layer[nid];
          const order = layers[L].indexOf(nid);
          if (order >= 0) { sum += order; count++; }
        });
        return count ? sum / count : idx[id];
      }

      // Place nodes left-to-right by layer, centered vertically per layer
      const colSpacing = 60;   // gap between columns
      const rowSpacing = 28;   // gap between rows
      const positions = {};

      // Column width = max width in that layer
      const colWidths = layerKeys.map(L => Math.max(...layers[L].map(id => nodes[idx[id]].w)));
      // Total layout width
      const totalW = colWidths.reduce((s, w) => s + w, 0) + colSpacing * (layerKeys.length - 1);
      const startX = Math.max(20, (CANVAS_W - totalW) / 2);

      let cursorX = startX;
      layerKeys.forEach((L, ci) => {
        const colWidth = colWidths[ci];
        const colNodes = layers[L].map(id => nodes[idx[id]]);
        const totalH = colNodes.reduce((s, n) => s + n.h, 0) + rowSpacing * (colNodes.length - 1);
        let cursorY = Math.max(20, (CANVAS_H - totalH) / 2);
        colNodes.forEach(n => {
          positions[n.id] = {
            x: cursorX + (colWidth - n.w) / 2,
            y: cursorY
          };
          cursorY += n.h + rowSpacing;
        });
        cursorX += colWidth + colSpacing;
      });

      // Clamp to canvas
      nodeIds.forEach(id => {
        const n = nodes[idx[id]];
        const p = positions[id];
        p.x = Math.max(8, Math.min(CANVAS_W - n.w - 8, p.x));
        p.y = Math.max(8, Math.min(CANVAS_H - n.h - 8, p.y));
      });

      if (animate) {
        const startPos = {};
        nodes.forEach(n => { startPos[n.id] = { x: n.x, y: n.y }; });
        const duration = 360;
        const t0 = performance.now();
        function tick(now) {
          if (destroyed) return;
          const t = Math.min(1, (now - t0) / duration);
          const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
          nodes.forEach(n => {
            const a = startPos[n.id];
            const b = positions[n.id];
            n.x = a.x + (b.x - a.x) * eased;
            n.y = a.y + (b.y - a.y) * eased;
          });
          render();
          if (t < 1) rafId = requestAnimationFrame(tick);
          else { rafId = null; commitChange('layout', 'Reacomodó el diagrama'); }
        }
        rafId = requestAnimationFrame(tick);
      } else {
        nodes.forEach(n => { const p = positions[n.id]; n.x = p.x; n.y = p.y; });
        render();
        commitChange('layout', 'Reacomodó el diagrama');
      }
    }

    function setMode(next) {
      mode = next;
      connectFrom = null;
      gGhost.innerHTML = '';
      container.classList.toggle('is-placing', !!(mode && mode.startsWith('place:')));
      container.classList.toggle('is-connecting', mode === 'connect');
      container.querySelectorAll('.de-tool').forEach(b => {
        const active = (mode === 'place:' + b.dataset.tool) || (mode === 'connect' && b.dataset.tool === 'connect');
        b.classList.toggle('is-active', !!active);
        if (b.dataset.tool) b.setAttribute('aria-pressed', String(!!active));
      });
      if (mode && mode.startsWith('place:')) {
        const type = mode.split(':')[1];
        hint.innerHTML = type === 'text'
          ? `<strong>Modo texto.</strong> Click donde quieras una etiqueta libre. <kbd>Esc</kbd> cancela.`
          : `<strong>Modo colocar.</strong> Click en el lienzo para insertar: ${SHAPE_DEFS[type].description}. Click <em>sobre una flecha</em> para intercalarlo en el medio. <kbd>Esc</kbd> cancela.`;
      } else if (mode === 'connect') {
        hint.innerHTML = `<strong>Modo conexión.</strong> Click la forma origen y luego la de destino. <kbd>Esc</kbd> cancela.`;
      } else {
        const sel = activeSelection();
        if (sel?.kind === 'node') {
          const n = state.nodes.find(x => x.id === sel.id);
          hint.innerHTML = `Seleccionado: <strong>${escapeText(n?.label || '')}</strong>. Doble-click renombra · arrastrá para mover · esquinas para redimensionar · flechas para empujar · <kbd>Supr</kbd> borra.`;
        } else if (sel?.kind === 'multi') {
          hint.innerHTML = `<strong>${sel.count} formas seleccionadas.</strong> Arrastrá para moverlas juntas · <kbd>Supr</kbd> borra · click para deseleccionar.`;
        } else if (sel?.kind === 'edge') {
          hint.innerHTML = `Flecha seleccionada. Arrastrá los puntos huecos para crear quiebres · doble-click en un quiebre lo borra · <kbd>C</kbd> curva/recta · doble-click etiqueta · <kbd>Supr</kbd> borra.`;
        } else {
          hint.innerHTML = 'Arrastrá en vacío para seleccionar varios · click en forma para seleccionar · shift+click para sumar a la selección.';
        }
      }
    }

    function escapeText(s) { return String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

    function render() {
      gNodes.innerHTML = '';
      gEdges.innerHTML = '';
      renderGroups();
      const byId = {};
      state.nodes.forEach(n => byId[n.id] = n);
      state.edges.forEach(e => {
        renderEdge(gEdges, e, byId, selectedEdgeId === e.id);
      });
      state.nodes.forEach(n => {
        renderShape(gNodes, n, selectedNodes.has(n.id));
      });
      renderAnchors();
      renderResizeHandles();
      renderEdgeHandles();
      renderSelbar();
    }

    // Cardinal-anchor handles around the hovered / selected node. Mousedown on
    // a handle starts a drag-to-connect — no need to switch to "Conexión" mode.
    function renderAnchors() {
      gAnchors.innerHTML = '';
      if (mode || dragging || resizing) return; // hide during placing / connecting / dragging / resizing
      const ids = new Set();
      // Anchors only show for single-node selection (multi-select hides them
      // to keep the canvas clean while moving groups).
      if (selectedNodes.size === 1) ids.add([...selectedNodes][0]);
      if (hoveredNodeId) ids.add(hoveredNodeId);
      if (pendingConnect) ids.add(pendingConnect.fromId);
      ids.forEach(id => {
        const n = state.nodes.find(x => x.id === id);
        if (!n) return;
        if (n.type === 'text') return; // free-text labels aren't connectable
        ['n', 'e', 's', 'w'].forEach(a => {
          const p = anchorPoint(n, a);
          const ring = document.createElementNS(NS, 'circle');
          ring.setAttribute('class', 'de-anchor-ring');
          ring.setAttribute('cx', p.x); ring.setAttribute('cy', p.y);
          ring.setAttribute('r', 10);
          ring.setAttribute('data-node-id', id);
          ring.setAttribute('data-anchor', a);
          gAnchors.appendChild(ring);
          const dot = document.createElementNS(NS, 'circle');
          dot.setAttribute('class', 'de-anchor');
          dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
          dot.setAttribute('r', 5);
          dot.setAttribute('data-node-id', id);
          dot.setAttribute('data-anchor', a);
          gAnchors.appendChild(dot);
        });
      });
    }

    // ---- Resize handles (corners) for a single selected node ----
    // Corners only: the edge-midpoints already host the connect anchors, so the
    // two control sets never overlap (corners = resize, edges = connect).
    const RESIZE_CORNERS = [
      { c: 'nw', fx: n => n.x,         fy: n => n.y },
      { c: 'ne', fx: n => n.x + n.w,   fy: n => n.y },
      { c: 'se', fx: n => n.x + n.w,   fy: n => n.y + n.h },
      { c: 'sw', fx: n => n.x,         fy: n => n.y + n.h },
    ];
    function renderResizeHandles() {
      gResize.innerHTML = '';
      if (mode || dragging || pendingConnect) return;
      if (selectedNodes.size !== 1) return;
      const n = state.nodes.find(x => x.id === [...selectedNodes][0]);
      if (!n) return;
      RESIZE_CORNERS.forEach(h => {
        const r = document.createElementNS(NS, 'rect');
        r.setAttribute('class', 'de-resize de-resize-' + h.c);
        r.setAttribute('x', h.fx(n) - 5);
        r.setAttribute('y', h.fy(n) - 5);
        r.setAttribute('width', 10);
        r.setAttribute('height', 10);
        r.setAttribute('rx', 2);
        r.setAttribute('data-corner', h.c);
        r.setAttribute('data-node-id', n.id);
        gResize.appendChild(r);
      });
    }
    function applyResize(node, corner, dx, dy, s) {
      let left = s.x, top = s.y, right = s.x + s.w, bottom = s.y + s.h;
      if (corner.indexOf('w') >= 0) left = s.x + dx;
      if (corner.indexOf('e') >= 0) right = s.x + s.w + dx;
      if (corner.indexOf('n') >= 0) top = s.y + dy;
      if (corner.indexOf('s') >= 0) bottom = s.y + s.h + dy;
      // Enforce minimum size, anchored on the opposite (fixed) edge.
      if (right - left < MIN_W) {
        if (corner.indexOf('w') >= 0) left = right - MIN_W; else right = left + MIN_W;
      }
      if (bottom - top < MIN_H) {
        if (corner.indexOf('n') >= 0) top = bottom - MIN_H; else bottom = top + MIN_H;
      }
      // Clamp to the canvas bounds.
      left = Math.max(0, left); top = Math.max(0, top);
      right = Math.min(CANVAS_W, right); bottom = Math.min(CANVAS_H, bottom);
      node.x = left; node.y = top;
      node.w = Math.max(MIN_W, right - left);
      node.h = Math.max(MIN_H, bottom - top);
    }
    // Mousedown on a corner handle starts a resize (kept separate from node drag
    // by stopping propagation, mirroring the connect-anchor handler).
    gResize.addEventListener('mousedown', (evt) => {
      const handle = evt.target.closest('.de-resize');
      if (!handle) return;
      evt.preventDefault();
      evt.stopPropagation();
      const id = handle.getAttribute('data-node-id');
      const node = state.nodes.find(n => n.id === id);
      if (!node) return;
      const p = svgPoint(evt);
      resizing = {
        id,
        corner: handle.getAttribute('data-corner'),
        startX: p.x,
        startY: p.y,
        moved: false,
        start: { x: node.x, y: node.y, w: node.w, h: node.h }
      };
    });

    // ---- Edge waypoint handles (for the selected edge) ----
    // Solid dots = existing bends (drag to move, double-click to remove).
    // Hollow dots at each segment midpoint = "add a bend here" (drag to create).
    function renderEdgeHandles() {
      gEdgeHandles.innerHTML = '';
      if (mode || dragging || resizing) return;
      if (!selectedEdgeId) return;
      const edge = state.edges.find(e => e.id === selectedEdgeId);
      if (!edge) return;
      const a = state.nodes.find(n => n.id === edge.from);
      const b = state.nodes.find(n => n.id === edge.to);
      if (!a || !b) return;
      const pts = edgeGeometry(a, b, edge);
      const wps = Array.isArray(edge.points) ? edge.points : [];
      wps.forEach((w, i) => {
        const dot = document.createElementNS(NS, 'circle');
        dot.setAttribute('class', 'de-wp');
        dot.setAttribute('cx', w.x); dot.setAttribute('cy', w.y);
        dot.setAttribute('r', 6);
        dot.setAttribute('data-edge-id', edge.id);
        dot.setAttribute('data-wp-index', String(i));
        gEdgeHandles.appendChild(dot);
      });
      for (let s = 0; s < pts.length - 1; s++) {
        const mx = (pts[s].x + pts[s + 1].x) / 2;
        const my = (pts[s].y + pts[s + 1].y) / 2;
        const add = document.createElementNS(NS, 'circle');
        add.setAttribute('class', 'de-wp-add');
        add.setAttribute('cx', mx); add.setAttribute('cy', my);
        add.setAttribute('r', 5);
        add.setAttribute('data-edge-id', edge.id);
        add.setAttribute('data-seg-index', String(s));
        gEdgeHandles.appendChild(add);
      }
    }
    // Mousedown on a waypoint moves it; on an "add" handle inserts a bend there
    // and immediately drags it. stopPropagation keeps it off node-drag/marquee.
    gEdgeHandles.addEventListener('mousedown', (evt) => {
      const moveH = evt.target.closest('.de-wp');
      const addH = evt.target.closest('.de-wp-add');
      if (!moveH && !addH) return;
      evt.preventDefault();
      evt.stopPropagation();
      const id = (moveH || addH).getAttribute('data-edge-id');
      const edge = state.edges.find(e => e.id === id);
      if (!edge) return;
      if (!Array.isArray(edge.points)) edge.points = [];
      let wpIndex;
      if (moveH) {
        wpIndex = parseInt(moveH.getAttribute('data-wp-index'), 10);
      } else {
        const segIndex = parseInt(addH.getAttribute('data-seg-index'), 10);
        const p = svgPoint(evt);
        edge.points.splice(segIndex, 0, { x: p.x, y: p.y });
        wpIndex = segIndex;
      }
      // `added` = se insertó un quiebre nuevo (mutación real aunque no se
      // arrastre); `moved` se marca en onMove si el puntero efectivamente lo
      // desplaza. Así un click seco sobre un quiebre existente no genera commit.
      edgeDrag = { edgeId: id, wpIndex, added: !moveH, moved: false };
      render();
    });
    // Double-click a waypoint removes it.
    gEdgeHandles.addEventListener('dblclick', (evt) => {
      const moveH = evt.target.closest('.de-wp');
      if (!moveH) return;
      evt.preventDefault();
      evt.stopPropagation();
      const edge = state.edges.find(e => e.id === moveH.getAttribute('data-edge-id'));
      if (!edge || !Array.isArray(edge.points)) return;
      edge.points.splice(parseInt(moveH.getAttribute('data-wp-index'), 10), 1);
      render();
      commitChange('bend', 'Quitó un quiebre de una flecha');
    });

    function setHovered(id) {
      if (hoverClearTimer) { clearTimeout(hoverClearTimer); hoverClearTimer = null; }
      if (hoveredNodeId !== id) {
        hoveredNodeId = id;
        renderAnchors();
      }
    }
    function clearHoverDeferred() {
      if (hoverClearTimer) clearTimeout(hoverClearTimer);
      hoverClearTimer = setTimeout(() => {
        if (!pendingConnect) {
          hoveredNodeId = null;
          renderAnchors();
        }
        hoverClearTimer = null;
      }, 140);
    }

    function svgPoint(evt) {
      const pt = svg.createSVGPoint();
      pt.x = evt.clientX; pt.y = evt.clientY;
      const m = svg.getScreenCTM();
      if (!m) return { x: 0, y: 0 };
      const inv = m.inverse();
      const p = pt.matrixTransform(inv);
      return { x: p.x, y: p.y };
    }

    // ---- Inline label editing (foreignObject + input) ----
    function startInlineEdit(nodeId) {
      const node = state.nodes.find(n => n.id === nodeId);
      if (!node) return;
      // Remove any existing inline editor
      svg.querySelectorAll('.de-inline-editor').forEach(el => el.remove());

      const lb = labelBox(node.type, node.w, node.h);
      const fo = document.createElementNS(NS, 'foreignObject');
      fo.setAttribute('class', 'de-inline-editor');
      fo.setAttribute('x', node.x + lb.x);
      fo.setAttribute('y', node.y + lb.y);
      fo.setAttribute('width', Math.max(60, lb.w));
      fo.setAttribute('height', Math.max(30, lb.h));

      const input = document.createElement('input');
      input.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
      input.setAttribute('type', 'text');
      input.setAttribute('class', 'de-inline-input');
      input.value = node.label;
      fo.appendChild(input);
      svg.appendChild(fo);
      // Hide the static label of the underlying node while editing
      const g = svg.querySelector(`.de-node[data-id="${node.id}"]`);
      if (g) g.classList.add('is-editing');

      requestAnimationFrame(() => {
        input.focus();
        input.select();
      });

      let committed = false;
      const commit = (save) => {
        if (committed) return;
        committed = true;
        const next = input.value.trim();
        if (save && next && next !== node.label) {
          const old = node.label;
          node.label = next;
          commitChange('rename', `Renombró "${old}" → "${next}"`);
        }
        fo.remove();
        if (g) g.classList.remove('is-editing');
        render();
        setMode(null);
      };
      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') { ev.preventDefault(); commit(true); }
        else if (ev.key === 'Escape') { ev.preventDefault(); commit(false); }
        ev.stopPropagation();
      });
      input.addEventListener('blur', () => commit(true));
    }

    // Inline, optional edge label: a centered <input> at the arrow midpoint.
    // Empty value clears the label (tags are optional).
    function startEdgeLabelEdit(edgeId) {
      const edge = state.edges.find(e => e.id === edgeId);
      if (!edge) return;
      const a = state.nodes.find(n => n.id === edge.from);
      const b = state.nodes.find(n => n.id === edge.to);
      if (!a || !b) return;
      const p1 = edgePoint(a, b.x + b.w / 2, b.y + b.h / 2);
      const p2 = edgePoint(b, p1.x, p1.y);
      const mx = (p1.x + p2.x) / 2;
      const my = (p1.y + p2.y) / 2;
      svg.querySelectorAll('.de-inline-editor').forEach(el => el.remove());
      const fo = document.createElementNS(NS, 'foreignObject');
      fo.setAttribute('class', 'de-inline-editor');
      fo.setAttribute('x', mx - 80);
      fo.setAttribute('y', my - 16);
      fo.setAttribute('width', 160);
      fo.setAttribute('height', 32);
      const input = document.createElement('input');
      input.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
      input.setAttribute('type', 'text');
      input.setAttribute('class', 'de-inline-input de-edge-input');
      input.setAttribute('placeholder', 'etiqueta (opcional)');
      input.value = edge.label || '';
      fo.appendChild(input);
      svg.appendChild(fo);
      requestAnimationFrame(() => { input.focus(); input.select(); });
      let committed = false;
      const commit = (save) => {
        if (committed) return;
        committed = true;
        if (save) {
          const next = input.value.trim();
          if (next !== (edge.label || '')) {
            edge.label = next;
            commitChange('label', next ? `Etiquetó una flecha: "${next}"` : 'Quitó la etiqueta de una flecha');
          }
        }
        fo.remove();
        render();
        setMode(null);
      };
      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') { ev.preventDefault(); commit(true); }
        else if (ev.key === 'Escape') { ev.preventDefault(); commit(false); }
        ev.stopPropagation();
      });
      input.addEventListener('blur', () => commit(true));
    }

    // ---- Toolbar ----
    container.querySelectorAll('.de-tool[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.dataset.tool;
        if (t === 'connect') setMode(mode === 'connect' ? null : 'connect');
        else setMode(mode === ('place:' + t) ? null : ('place:' + t));
      });
    });
    container.querySelector('[data-action="rename"]').addEventListener('click', () => {
      const sel = activeSelection();
      if (sel?.kind === 'node') startInlineEdit(sel.id);
      else if (sel?.kind === 'edge') startEdgeLabelEdit(sel.id);
    });
    container.querySelector('[data-action="delete"]').addEventListener('click', deleteSelected);
    container.querySelector('[data-action="autolayout"]').addEventListener('click', () => {
      if (state.nodes.length < 2) return;
      autoLayout(true);
    });
    container.querySelector('[data-action="clear"]').addEventListener('click', () => {
      if (!state.nodes.length && !state.edges.length) return;
      if (!confirm('¿Vaciar el diagrama completo? Podés deshacerlo con Ctrl+Z.')) return;
      state.nodes = [];
      state.edges = [];
      clearSelection();
      render();
      commitChange('clear', 'Vació el diagrama');
      setMode(null);
    });
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    traceBtn.addEventListener('click', () => toggleTrace());
    container.querySelector('[data-action="trace-close"]').addEventListener('click', () => toggleTrace(false));
    container.querySelector('[data-action="trace-clear"]').addEventListener('click', () => {
      if (!(state.trace || []).length) return;
      if (!confirm('¿Vaciar la bitácora de ediciones? El diagrama no se toca.')) return;
      state.trace = [];
      committedSnapshot = snapshot();
      onChange(state);
      updateHistoryUI();
      renderTrace();
    });

    function deleteSelected() {
      let label;
      if (selectedNodes.size > 0) {
        const n = selectedNodes.size;
        const dead = new Set(selectedNodes);
        state.nodes = state.nodes.filter(x => !dead.has(x.id));
        state.edges = state.edges.filter(e => !dead.has(e.from) && !dead.has(e.to));
        label = `Borró ${n} forma${n === 1 ? '' : 's'}`;
      } else if (selectedEdgeId) {
        state.edges = state.edges.filter(e => e.id !== selectedEdgeId);
        label = 'Borró una flecha';
      } else {
        return;
      }
      clearSelection();
      render();
      commitChange('delete', label);
      setMode(null);
    }

    // Duplicate the selected node(s) (offset a touch), plus any edge that lives
    // entirely within the selection; the copies become the new selection.
    function duplicateSelection() {
      if (!selectedNodes.size) return;
      const OFF = 24;
      const idMap = {};
      const newNodes = [];
      state.nodes.forEach(n => {
        if (!selectedNodes.has(n.id)) return;
        const nid = uid();
        idMap[n.id] = nid;
        newNodes.push({
          ...n,
          id: nid,
          x: Math.max(0, Math.min(CANVAS_W - n.w, n.x + OFF)),
          y: Math.max(0, Math.min(CANVAS_H - n.h, n.y + OFF)),
        });
      });
      const newEdges = [];
      state.edges.forEach(e => {
        if (!idMap[e.from] || !idMap[e.to]) return;
        newEdges.push({
          ...e,
          id: uid(),
          from: idMap[e.from],
          to: idMap[e.to],
          points: Array.isArray(e.points) ? e.points.map(p => ({ x: p.x + OFF, y: p.y + OFF })) : [],
        });
      });
      state.nodes.push(...newNodes);
      state.edges.push(...newEdges);
      selectedNodes = new Set(newNodes.map(n => n.id));
      selectedEdgeId = null;
      render();
      commitChange('duplicate', `Duplicó ${newNodes.length} forma${newNodes.length === 1 ? '' : 's'}`);
    }

    // ---- Color por nodo ----
    function setSelectedColor(key) {
      if (!selectedNodes.size) return;
      let changed = 0;
      state.nodes.forEach(n => {
        if (!selectedNodes.has(n.id)) return;
        const next = key || undefined;
        if ((n.color || undefined) !== next) {
          if (next) n.color = next; else delete n.color;
          changed++;
        }
      });
      if (!changed) return;
      render();
      const name = (DE_PALETTE.find(c => c.key === key) || {}).name || 'Por tipo';
      commitChange('color', key
        ? `Pintó ${changed} forma${changed === 1 ? '' : 's'} (${name})`
        : `Quitó el color de ${changed} forma${changed === 1 ? '' : 's'}`);
    }

    // ---- Agrupar / desagrupar ----
    function groupSelection() {
      if (selectedNodes.size < 2) return;
      const gid = 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      state.nodes.forEach(n => { if (selectedNodes.has(n.id)) n.group = gid; });
      render();
      commitChange('group', `Agrupó ${selectedNodes.size} formas`);
    }
    function ungroupSelection() {
      const gids = new Set();
      state.nodes.forEach(n => { if (selectedNodes.has(n.id) && n.group) gids.add(n.group); });
      if (!gids.size) return;
      let n = 0;
      state.nodes.forEach(node => { if (node.group && gids.has(node.group)) { delete node.group; n++; } });
      render();
      commitChange('ungroup', `Desagrupó ${n} forma${n === 1 ? '' : 's'}`);
    }
    function selectionHasGroup() {
      for (const n of state.nodes) if (selectedNodes.has(n.id) && n.group) return true;
      return false;
    }

    // ---- Frames de grupo (capa data-groups, detrás de todo) ----
    function renderGroups() {
      gGroups.innerHTML = '';
      const byGroup = {};
      state.nodes.forEach(n => { if (n.group) (byGroup[n.group] ??= []).push(n); });
      Object.values(byGroup).forEach(members => {
        if (members.length < 2) return;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        members.forEach(n => {
          minX = Math.min(minX, n.x); minY = Math.min(minY, n.y);
          maxX = Math.max(maxX, n.x + n.w); maxY = Math.max(maxY, n.y + n.h);
        });
        const PAD = 16;
        const rect = document.createElementNS(NS, 'rect');
        rect.setAttribute('class', 'de-group-frame');
        rect.setAttribute('x', minX - PAD); rect.setAttribute('y', minY - PAD);
        rect.setAttribute('width', (maxX - minX) + 2 * PAD);
        rect.setAttribute('height', (maxY - minY) + 2 * PAD);
        rect.setAttribute('rx', 12);
        gGroups.appendChild(rect);
      });
    }

    // ---- Barra contextual: aparece SOLO con nodos seleccionados (color + grupo) ----
    function renderSelbar() {
      if (!selbar) return;
      const show = !mode && !dragging && !resizing && selectedNodes.size >= 1;
      selbar.hidden = !show;
      if (!show) { selbar.innerHTML = ''; return; }
      const colors = new Set();
      state.nodes.forEach(n => { if (selectedNodes.has(n.id)) colors.add(n.color || ''); });
      const cur = colors.size === 1 ? [...colors][0] : null;
      const swatches = DE_PALETTE.map(c =>
        `<button type="button" class="de-swatch de-swatch-${c.key || 'none'}${cur === c.key ? ' is-current' : ''}" data-color="${c.key}" title="${c.name}" aria-label="${c.name}"></button>`
      ).join('');
      const canGroup = selectedNodes.size >= 2;
      const groupBtn = selectionHasGroup()
        ? `<button type="button" class="de-selbar-btn" data-selaction="ungroup" title="Desagrupar (Ctrl+Shift+G)"><span class="de-tool-icon">${shapeIconSVG('ungroup', 13)}</span>Desagrupar</button>`
        : `<button type="button" class="de-selbar-btn" data-selaction="group" title="Agrupar (Ctrl+G)"${canGroup ? '' : ' disabled'}><span class="de-tool-icon">${shapeIconSVG('group', 13)}</span>Agrupar</button>`;
      selbar.innerHTML =
        `<span class="de-selbar-label">${selectedNodes.size} sel.</span>` +
        `<div class="de-swatches" role="group" aria-label="Color de la selección">${swatches}</div>` +
        `<div class="de-selbar-sep" aria-hidden="true"></div>` + groupBtn;
    }
    selbar?.addEventListener('click', (evt) => {
      const sw = evt.target.closest('.de-swatch');
      if (sw) { setSelectedColor(sw.getAttribute('data-color')); return; }
      const act = evt.target.closest('[data-selaction]')?.getAttribute('data-selaction');
      if (act === 'group') groupSelection();
      else if (act === 'ungroup') ungroupSelection();
    });

    // ---- Presets: bloques y grupos prearmados ----
    const DE_PRESETS = [
      { key: 'req', name: 'Cliente → API → BD', desc: 'Flujo de request básico', build: () => ({
        nodes: [
          { type: 'actor', x: 0, y: 30, label: 'Cliente' },
          { type: 'rect', x: 130, y: 22, label: 'API' },
          { type: 'db', x: 320, y: 18, label: 'Base de datos' },
        ], links: [[0, 1], [1, 2]],
      }) },
      { key: 'micro', name: 'Microservicio', desc: 'API + BD + cola, agrupado', group: true, build: () => ({
        nodes: [
          { type: 'rect', x: 60, y: 0, label: 'Servicio', color: 'blue' },
          { type: 'db', x: 0, y: 110, label: 'BD', color: 'violet' },
          { type: 'queue', x: 170, y: 120, label: 'Eventos', color: 'amber' },
        ], links: [[0, 1], [0, 2]],
      }) },
      { key: 'layers', name: '3 capas', desc: 'Presentación / Lógica / Datos', group: true, build: () => ({
        nodes: [
          { type: 'stack', x: 0, y: 0, label: 'Presentación', color: 'teal' },
          { type: 'stack', x: 0, y: 130, label: 'Lógica', color: 'blue' },
          { type: 'stack', x: 0, y: 260, label: 'Datos', color: 'violet' },
        ], links: [[0, 1], [1, 2]],
      }) },
      { key: 'lb', name: 'Balanceo de carga', desc: 'LB → N servidores', build: () => ({
        nodes: [
          { type: 'rect', x: 110, y: 0, label: 'Load Balancer', color: 'coral' },
          { type: 'rect', x: 0, y: 130, label: 'Server 1' },
          { type: 'rect', x: 180, y: 130, label: 'Server 2' },
          { type: 'rect', x: 360, y: 130, label: 'Server 3' },
        ], links: [[0, 1], [0, 2], [0, 3]],
      }) },
      { key: 'pubsub', name: 'Pub / Sub', desc: 'Publisher → tópico → subs', build: () => ({
        nodes: [
          { type: 'rect', x: 0, y: 60, label: 'Publisher', color: 'green' },
          { type: 'queue', x: 180, y: 64, label: 'Tópico', color: 'amber' },
          { type: 'rect', x: 400, y: 0, label: 'Suscriptor A' },
          { type: 'rect', x: 400, y: 120, label: 'Suscriptor B' },
        ], links: [[0, 1], [1, 2], [1, 3]],
      }) },
      { key: 'cache', name: 'Cache-aside', desc: 'App ↔ cache ↔ BD', build: () => ({
        nodes: [
          { type: 'rect', x: 0, y: 40, label: 'App' },
          { type: 'rect', x: 180, y: 0, label: 'Cache', color: 'coral' },
          { type: 'db', x: 180, y: 130, label: 'BD', color: 'violet' },
        ], links: [[0, 1], [0, 2]],
      }) },
    ];
    function insertPreset(preset) {
      const built = preset.build();
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      built.nodes.forEach(n => {
        const def = SHAPE_DEFS[n.type];
        minX = Math.min(minX, n.x); minY = Math.min(minY, n.y);
        maxX = Math.max(maxX, n.x + (n.w || def.w)); maxY = Math.max(maxY, n.y + (n.h || def.h));
      });
      const bw = maxX - minX, bh = maxY - minY;
      const cx = viewport.x + viewport.w / 2, cy = viewport.y + viewport.h / 2;
      const ox = Math.max(8, Math.min(CANVAS_W - bw - 8, cx - bw / 2 - minX));
      const oy = Math.max(8, Math.min(CANVAS_H - bh - 8, cy - bh / 2 - minY));
      const gid = preset.group ? ('g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)) : null;
      const ids = [];
      const newNodes = built.nodes.map(n => {
        const def = SHAPE_DEFS[n.type];
        const id = uid(); ids.push(id);
        const node = {
          id, type: n.type,
          x: ox + n.x, y: oy + n.y,
          w: n.w || def.w, h: n.h || def.h,
          label: n.label != null ? n.label : def.label,
        };
        if (n.color) node.color = n.color;
        if (gid) node.group = gid;
        return node;
      });
      const newEdges = (built.links || []).map(([f, t]) => ({
        id: uid(), from: ids[f], to: ids[t], label: '',
      }));
      state.nodes.push(...newNodes);
      state.edges.push(...newEdges);
      selectedNodes = new Set(ids);
      selectedEdgeId = null;
      togglePresets(false);
      render();
      commitChange('preset', `Insertó plantilla "${preset.name}"`);
    }
    function renderPresetList() {
      if (!presetListEl) return;
      presetListEl.innerHTML = '';
      DE_PRESETS.forEach(p => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'de-preset-item';
        btn.innerHTML = `<span class="de-preset-name"></span><span class="de-preset-desc"></span>`;
        btn.querySelector('.de-preset-name').textContent = p.name;
        btn.querySelector('.de-preset-desc').textContent = p.desc;
        btn.addEventListener('click', () => insertPreset(p));
        presetListEl.appendChild(btn);
      });
    }
    function togglePresets(force) {
      if (!presetPanel) return;
      const show = typeof force === 'boolean' ? force : presetPanel.hidden;
      presetPanel.hidden = !show;
      if (presetBtn) presetBtn.classList.toggle('is-active', show);
      if (show) { renderPresetList(); toggleTrace(false); }
    }
    presetBtn?.addEventListener('click', () => togglePresets());
    container.querySelector('[data-action="presets-close"]')?.addEventListener('click', () => togglePresets(false));

    // ---- Anchor drag-to-connect (no toolbar needed) ----
    gAnchors.addEventListener('mousedown', (evt) => {
      const handle = evt.target.closest('.de-anchor-ring, .de-anchor');
      if (!handle) return;
      evt.preventDefault();
      evt.stopPropagation();
      const fromId = handle.getAttribute('data-node-id');
      const fromAnchor = handle.getAttribute('data-anchor');
      pendingConnect = { fromId, fromAnchor };
      hoveredNodeId = fromId; // keep anchors visible on source
      container.classList.add('is-connecting');
      hint.innerHTML = `<strong>Arrastrá la flecha</strong> hasta otra forma. Soltá fuera para cancelar.`;
      renderAnchors();
    });

    // ---- Hover tracking on nodes (for anchor visibility) ----
    gNodes.addEventListener('mouseover', (evt) => {
      if (mode || dragging || pendingConnect) return;
      const nodeEl = evt.target.closest('.de-node');
      if (nodeEl) setHovered(nodeEl.dataset.id);
    });
    gNodes.addEventListener('mouseout', (evt) => {
      if (mode || dragging || pendingConnect) return;
      const rel = evt.relatedTarget;
      // If we're moving to an anchor of the same node or back into the node, keep
      if (rel && rel.closest && (rel.closest('.de-anchor') || rel.closest('.de-anchor-ring'))) return;
      if (rel && rel.closest && rel.closest('.de-node')) return;
      clearHoverDeferred();
    });
    gAnchors.addEventListener('mouseover', () => {
      if (hoverClearTimer) { clearTimeout(hoverClearTimer); hoverClearTimer = null; }
    });
    gAnchors.addEventListener('mouseout', (evt) => {
      if (pendingConnect) return;
      const rel = evt.relatedTarget;
      if (rel && rel.closest && (rel.closest('.de-anchor') || rel.closest('.de-anchor-ring') || rel.closest('.de-node'))) return;
      clearHoverDeferred();
    });

    // ---- Canvas click handling ----
    // Selection happens on mousedown (further below). The click handler now
    // only deals with mode-specific actions (place a shape, connect mode).
    svg.addEventListener('click', (evt) => {
      if (dragging && dragging.moved) return;
      if (marquee) return;
      if (evt.target.closest('.de-anchor, .de-anchor-ring, .de-resize, .de-wp, .de-wp-add')) return;
      const p = svgPoint(evt);
      const nodeEl = evt.target.closest('.de-node');

      if (mode && mode.startsWith('place:')) {
        const type = mode.split(':')[1];
        const def = SHAPE_DEFS[type];
        const makeNode = () => ({
          id: uid(),
          type,
          x: Math.max(8, Math.min(CANVAS_W - def.w - 8, p.x - def.w / 2)),
          y: Math.max(8, Math.min(CANVAS_H - def.h - 8, p.y - def.h / 2)),
          w: def.w, h: def.h,
          label: def.label
        });
        const finishPlace = (node, kind, label) => {
          state.nodes.push(node);
          selectedNodes = new Set([node.id]);
          selectedEdgeId = null;
          setMode(null);
          render();
          commitChange(kind, label);
          inlineTimer = setTimeout(() => { if (!destroyed) startInlineEdit(node.id); }, 30);
        };
        // Insert-on-edge: dropping a (non-text) shape onto an arrow splits it,
        // re-wiring from → new → to.
        const edgeEl = !nodeEl ? evt.target.closest('.de-edge') : null;
        if (edgeEl && type !== 'text') {
          const old = state.edges.find(e => e.id === edgeEl.dataset.id);
          if (old) {
            const node = makeNode();
            state.edges = state.edges.filter(e => e.id !== old.id);
            state.edges.push({ id: uid(), from: old.from, to: node.id, label: '', curved: !!old.curved });
            state.edges.push({ id: uid(), from: node.id, to: old.to, label: '', curved: !!old.curved });
            finishPlace(node, 'insert', `Intercaló ${def.label} en una flecha`);
            return;
          }
        }
        if (!nodeEl) { finishPlace(makeNode(), 'add', `Agregó ${def.label}`); return; }
      }
      if (mode === 'connect' && nodeEl) {
        const id = nodeEl.dataset.id;
        const targetNode = state.nodes.find(n => n.id === id);
        if (targetNode && targetNode.type === 'text') return; // text isn't connectable
        if (!connectFrom) {
          connectFrom = id;
          hint.innerHTML = `<strong>Origen elegido.</strong> Ahora click en la forma de destino.`;
          nodeEl.classList.add('is-connect-source');
        } else if (connectFrom !== id) {
          const fromN = state.nodes.find(n => n.id === connectFrom);
          const toN = state.nodes.find(n => n.id === id);
          state.edges.push({ id: uid(), from: connectFrom, to: id, label: '' });
          connectFrom = null;
          setMode(null);
          clearSelection();
          render();
          commitChange('connect', `Conectó ${fromN?.label || 'forma'} → ${toN?.label || 'forma'}`);
        }
        return;
      }
    });

    svg.addEventListener('dblclick', (evt) => {
      const nodeEl = evt.target.closest('.de-node');
      const edgeEl = evt.target.closest('.de-edge');
      if (nodeEl) { startInlineEdit(nodeEl.dataset.id); return; }
      if (edgeEl) { startEdgeLabelEdit(edgeEl.dataset.id); return; }
    });

    // ---- Connect ghost preview (toolbar 'connect' mode + drag-from-anchor) ----
    svg.addEventListener('mousemove', (evt) => {
      const p = svgPoint(evt);
      if (pendingConnect) {
        const from = state.nodes.find(n => n.id === pendingConnect.fromId);
        if (!from) return;
        const p1 = anchorPoint(from, pendingConnect.fromAnchor);
        // Snap preview endpoint to nearest anchor of the hovered target node, if any
        const targetEl = document.elementFromPoint(evt.clientX, evt.clientY);
        const targetNodeEl = targetEl ? targetEl.closest('.de-node') : null;
        let endX = p.x, endY = p.y;
        if (targetNodeEl && targetNodeEl.dataset.id !== pendingConnect.fromId) {
          const targetNode = state.nodes.find(n => n.id === targetNodeEl.dataset.id);
          if (targetNode) {
            const a = nearestAnchor(targetNode, p.x, p.y);
            const ap = anchorPoint(targetNode, a);
            endX = ap.x; endY = ap.y;
            // Highlight target
            svg.querySelectorAll('.de-node.is-drop-target').forEach(el => el.classList.remove('is-drop-target'));
            targetNodeEl.classList.add('is-drop-target');
          }
        } else {
          svg.querySelectorAll('.de-node.is-drop-target').forEach(el => el.classList.remove('is-drop-target'));
        }
        gGhost.innerHTML = '';
        const line = document.createElementNS(NS, 'line');
        line.setAttribute('class', 'de-ghost-line');
        line.setAttribute('x1', p1.x); line.setAttribute('y1', p1.y);
        line.setAttribute('x2', endX); line.setAttribute('y2', endY);
        line.setAttribute('marker-end', 'url(#de-arrow)');
        gGhost.appendChild(line);
        return;
      }
      if (mode === 'connect' && connectFrom) {
        const from = state.nodes.find(n => n.id === connectFrom);
        if (!from) return;
        const p1 = edgePoint(from, p.x, p.y);
        gGhost.innerHTML = '';
        const line = document.createElementNS(NS, 'line');
        line.setAttribute('class', 'de-ghost-line');
        line.setAttribute('x1', p1.x); line.setAttribute('y1', p1.y);
        line.setAttribute('x2', p.x);  line.setAttribute('y2', p.y);
        line.setAttribute('marker-end', 'url(#de-arrow)');
        gGhost.appendChild(line);
      }
    });

    // Drop / cancel for the drag-from-anchor flow
    function onAnchorDrop(evt) {
      if (!pendingConnect) return;
      const targetEl = document.elementFromPoint(evt.clientX, evt.clientY);
      const targetNodeEl = targetEl ? targetEl.closest('.de-node') : null;
      if (targetNodeEl && targetNodeEl.dataset.id !== pendingConnect.fromId) {
        const toId = targetNodeEl.dataset.id;
        const toNode = state.nodes.find(n => n.id === toId);
        if (toNode && toNode.type === 'text') { /* not connectable */ }
        else {
        const p = svgPoint(evt);
        const toAnchor = toNode ? nearestAnchor(toNode, p.x, p.y) : 'n';
        state.edges.push({
          id: uid(),
          from: pendingConnect.fromId,
          to: toId,
          fromAnchor: pendingConnect.fromAnchor,
          toAnchor,
          label: ''
        });
        const fromN = state.nodes.find(n => n.id === pendingConnect.fromId);
        commitChange('connect', `Conectó ${fromN?.label || 'forma'} → ${toNode?.label || 'forma'}`);
        }
      }
      pendingConnect = null;
      gGhost.innerHTML = '';
      container.classList.remove('is-connecting');
      svg.querySelectorAll('.de-node.is-drop-target').forEach(el => el.classList.remove('is-drop-target'));
      hoveredNodeId = null;
      setMode(null);
      render();
    }
    window.addEventListener('mouseup', onAnchorDrop);

    // ---- Mousedown: select + start drag (node) OR start marquee (empty) ----
    svg.addEventListener('mousedown', (evt) => {
      // Pan: middle mouse button drag (two-finger scroll handles trackpad pan)
      if (evt.button === 1) {
        panning = {
          startMouseX: evt.clientX,
          startMouseY: evt.clientY,
          startVx: viewport.x,
          startVy: viewport.y
        };
        container.classList.add('is-panning-active');
        evt.preventDefault();
        return;
      }
      if (mode) return;
      if (evt.target.closest('.de-anchor, .de-anchor-ring, .de-resize, .de-wp, .de-wp-add')) return;
      if (evt.button !== 0) return; // left button only
      const nodeEl = evt.target.closest('.de-node');
      const edgeEl = evt.target.closest('.de-edge');
      const p = svgPoint(evt);

      if (nodeEl) {
        const id = nodeEl.dataset.id;
        if (evt.shiftKey) {
          // Shift+click toggles this node in the selection
          if (selectedNodes.has(id)) selectedNodes.delete(id);
          else selectedNodes.add(id);
          selectedEdgeId = null;
        } else if (!selectedNodes.has(id)) {
          // Plain click on an unselected node → make it the only selection
          selectedNodes = new Set([id]);
          selectedEdgeId = null;
        }
        // else: plain click on already-selected node keeps multi-selection intact

        if (selectedNodes.has(id)) {
          // Conjunto de arrastre = selección + compañeros de grupo (mover juntos).
          const dragSet = new Set(selectedNodes);
          const groups = new Set();
          selectedNodes.forEach(nid => {
            const nn = state.nodes.find(n => n.id === nid);
            if (nn && nn.group) groups.add(nn.group);
          });
          if (groups.size) {
            state.nodes.forEach(n => { if (n.group && groups.has(n.group)) dragSet.add(n.id); });
          }
          const startPositions = {};
          dragSet.forEach(nid => {
            const nn = state.nodes.find(n => n.id === nid);
            if (nn) startPositions[nid] = { x: nn.x, y: nn.y };
          });
          dragging = {
            primaryId: id,
            startMouseX: p.x,
            startMouseY: p.y,
            startPositions,
            moved: false,
            snapGuides: []
          };
        }
        render();
        evt.preventDefault();
        return;
      }

      if (edgeEl) {
        selectedEdgeId = edgeEl.dataset.id;
        selectedNodes = new Set();
        render();
        evt.preventDefault();
        return;
      }

      // Empty canvas → start marquee. Clear selection unless shift is held.
      if (!evt.shiftKey) clearSelection();
      marquee = {
        startX: p.x, startY: p.y,
        curX: p.x, curY: p.y,
        shift: evt.shiftKey,
        initialNodes: new Set(selectedNodes)
      };
      drawMarquee();
      render();
      evt.preventDefault();
    });

    function drawMarquee() {
      gMarquee.innerHTML = '';
      if (!marquee) return;
      const r = marqueeRect();
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('class', 'de-marquee');
      rect.setAttribute('x', r.x); rect.setAttribute('y', r.y);
      rect.setAttribute('width', r.w); rect.setAttribute('height', r.h);
      gMarquee.appendChild(rect);
    }
    function marqueeRect() {
      const x = Math.min(marquee.startX, marquee.curX);
      const y = Math.min(marquee.startY, marquee.curY);
      const w = Math.abs(marquee.curX - marquee.startX);
      const h = Math.abs(marquee.curY - marquee.startY);
      return { x, y, w, h };
    }
    function nodeIntersectsRect(n, r) {
      return !(n.x + n.w < r.x || n.x > r.x + r.w || n.y + n.h < r.y || n.y > r.y + r.h);
    }

    function onMove(evt) {
      if (panning) {
        // Convert mouse delta (CSS px) into canvas-unit delta. The CTM's a/d
        // components are the scale factor at the current viewBox.
        const m = svg.getScreenCTM();
        if (!m) return;
        const scaleX = 1 / m.a;
        const scaleY = 1 / m.d;
        const dx = (evt.clientX - panning.startMouseX) * scaleX;
        const dy = (evt.clientY - panning.startMouseY) * scaleY;
        viewport.x = panning.startVx - dx;
        viewport.y = panning.startVy - dy;
        clampViewport();
        updateViewBox();
        return;
      }
      const p = svgPoint(evt);
      if (resizing) {
        const node = state.nodes.find(n => n.id === resizing.id);
        if (node) {
          resizing.moved = true;
          applyResize(node, resizing.corner, p.x - resizing.startX, p.y - resizing.startY, resizing.start);
          render();
        }
        return;
      }
      if (edgeDrag) {
        const edge = state.edges.find(e => e.id === edgeDrag.edgeId);
        if (edge && Array.isArray(edge.points) && edge.points[edgeDrag.wpIndex]) {
          edgeDrag.moved = true;
          edge.points[edgeDrag.wpIndex] = {
            x: Math.max(0, Math.min(CANVAS_W, p.x)),
            y: Math.max(0, Math.min(CANVAS_H, p.y)),
          };
          render();
        }
        return;
      }
      if (marquee) {
        marquee.curX = p.x;
        marquee.curY = p.y;
        const r = marqueeRect();
        const inside = state.nodes.filter(n => nodeIntersectsRect(n, r)).map(n => n.id);
        selectedNodes = marquee.shift
          ? new Set([...marquee.initialNodes, ...inside])
          : new Set(inside);
        selectedEdgeId = null;
        drawMarquee();
        render();
        return;
      }
      if (!dragging) return;

      const primary = state.nodes.find(n => n.id === dragging.primaryId);
      if (!primary) return;
      const startPrim = dragging.startPositions[primary.id];
      let dx = p.x - dragging.startMouseX;
      let dy = p.y - dragging.startMouseY;

      // Clamp delta so no node leaves the canvas
      const ids = Object.keys(dragging.startPositions);
      let minDx = -Infinity, maxDx = Infinity, minDy = -Infinity, maxDy = Infinity;
      ids.forEach(id => {
        const sp = dragging.startPositions[id];
        const node = state.nodes.find(n => n.id === id);
        if (!node) return;
        minDx = Math.max(minDx, -sp.x);
        maxDx = Math.min(maxDx, CANVAS_W - node.w - sp.x);
        minDy = Math.max(minDy, -sp.y);
        maxDy = Math.min(maxDy, CANVAS_H - node.h - sp.y);
      });
      dx = Math.max(minDx, Math.min(maxDx, dx));
      dy = Math.max(minDy, Math.min(maxDy, dy));

      // Alignment snap against non-selected nodes
      const snap = computeSnap(dragging.startPositions, dx, dy);
      dx += snap.dx;
      dy += snap.dy;
      dragging.snapGuides = snap.guides;

      ids.forEach(id => {
        const sp = dragging.startPositions[id];
        const node = state.nodes.find(n => n.id === id);
        if (!node) return;
        node.x = sp.x + dx;
        node.y = sp.y + dy;
      });

      const movedDist = Math.abs(p.x - dragging.startMouseX) + Math.abs(p.y - dragging.startMouseY);
      if (movedDist > 1) dragging.moved = true;
      render();
      drawSnapGuides(dragging.snapGuides);
    }
    function onUp() {
      if (panning) {
        panning = null;
        container.classList.remove('is-panning-active');
      }
      if (marquee) {
        marquee = null;
        gMarquee.innerHTML = '';
        render();
      }
      if (resizing) {
        const rn = state.nodes.find(n => n.id === resizing.id);
        const moved = resizing.moved;
        resizing = null;
        render();
        if (moved) commitChange('resize', `Redimensionó ${rn?.label || 'una forma'}`);
      }
      if (edgeDrag) {
        const changed = edgeDrag.added || edgeDrag.moved;
        const label = edgeDrag.added ? 'Agregó un quiebre a una flecha' : 'Movió un quiebre de una flecha';
        edgeDrag = null;
        render();
        if (changed) commitChange('bend', label);
      }
      const wasDragging = !!dragging;
      if (dragging && dragging.moved) {
        const ids = Object.keys(dragging.startPositions);
        const label = ids.length === 1
          ? `Movió ${state.nodes.find(n => n.id === ids[0])?.label || 'una forma'}`
          : `Movió ${ids.length} formas`;
        commitChange('move', label);
      }
      dragging = null;
      gSnap.innerHTML = '';
      // Re-render after release so the resize handles (suppressed while a press
      // is held) reappear for a node selected by a plain click without a move.
      if (wasDragging) render();
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    // El teclado se maneja sobre document, pero solo debe actuar cuando el mouse
    // está sobre el editor — si no, Supr/Ctrl+A/Espacio/F2 secuestrarían toda la
    // página /herramientas donde la pizarra se monta por defecto.
    function onPointerEnter() { pointerInside = true; }
    function onPointerLeave() { pointerInside = false; }
    container.addEventListener('mouseenter', onPointerEnter);
    container.addEventListener('mouseleave', onPointerLeave);

    // ---- Keyboard ----
    function onKey(evt) {
      if (!container.isConnected) return;
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      // Solo actuar si el mouse está sobre el editor (evita capturar teclas en
      // el resto de la página, donde la pizarra monta por defecto).
      if (!pointerInside) return;
      if (evt.key === 'Escape') {
        if (pendingConnect) {
          pendingConnect = null;
          container.classList.remove('is-connecting');
          svg.querySelectorAll('.de-node.is-drop-target').forEach(el => el.classList.remove('is-drop-target'));
        }
        setMode(null);
        clearSelection();
        hoveredNodeId = null;
        gGhost.innerHTML = '';
        if (marquee) { marquee = null; gMarquee.innerHTML = ''; }
        render();
      }
      if ((evt.key === 'Delete' || evt.key === 'Backspace') && (selectedNodes.size > 0 || selectedEdgeId)) {
        evt.preventDefault();
        deleteSelected();
      }
      if (evt.key === 'F2' && selectedNodes.size === 1) {
        evt.preventDefault();
        startInlineEdit([...selectedNodes][0]);
      }
      if ((evt.key === 'a' || evt.key === 'A') && (evt.metaKey || evt.ctrlKey)) {
        evt.preventDefault();
        selectedNodes = new Set(state.nodes.map(n => n.id));
        selectedEdgeId = null;
        render();
      }
      // C toggles the selected edge between straight and curved.
      if ((evt.key === 'c' || evt.key === 'C') && !evt.metaKey && !evt.ctrlKey && selectedEdgeId) {
        evt.preventDefault();
        const edge = state.edges.find(e => e.id === selectedEdgeId);
        if (edge) {
          edge.curved = !edge.curved;
          render();
          commitChange('curve', edge.curved ? 'Flecha → curva' : 'Flecha → recta');
        }
      }
      const mod = evt.metaKey || evt.ctrlKey;
      // Deshacer / rehacer.
      if (mod && (evt.key === 'z' || evt.key === 'Z')) {
        evt.preventDefault();
        if (evt.shiftKey) redo(); else undo();
      }
      if (mod && (evt.key === 'y' || evt.key === 'Y')) { evt.preventDefault(); redo(); }
      // Copiar / cortar / pegar formas (clipboard interno del editor).
      if (mod && (evt.key === 'c' || evt.key === 'C') && selectedNodes.size > 0) {
        evt.preventDefault();
        copySelection();
      }
      if (mod && (evt.key === 'x' || evt.key === 'X') && selectedNodes.size > 0) {
        evt.preventDefault();
        cutSelection();
      }
      if (mod && (evt.key === 'v' || evt.key === 'V')) {
        evt.preventDefault();
        pasteClipboard();
      }
      // Ctrl/Cmd+D duplicates the selected node(s) and any edges between them.
      if ((evt.key === 'd' || evt.key === 'D') && (evt.metaKey || evt.ctrlKey) && selectedNodes.size > 0) {
        evt.preventDefault();
        duplicateSelection();
      }
      // Ctrl/Cmd+G agrupa; con Shift, desagrupa.
      if ((evt.key === 'g' || evt.key === 'G') && (evt.metaKey || evt.ctrlKey)) {
        evt.preventDefault();
        if (evt.shiftKey) ungroupSelection();
        else groupSelection();
      }
      // Arrow keys nudge the selected node(s): 1px, or 10px with Shift.
      if (/^Arrow(Up|Down|Left|Right)$/.test(evt.key) && selectedNodes.size > 0) {
        evt.preventDefault();
        const step = evt.shiftKey ? 10 : 1;
        let dx = 0, dy = 0;
        if (evt.key === 'ArrowUp') dy = -step;
        else if (evt.key === 'ArrowDown') dy = step;
        else if (evt.key === 'ArrowLeft') dx = -step;
        else if (evt.key === 'ArrowRight') dx = step;
        selectedNodes.forEach(id => {
          const n = state.nodes.find(x => x.id === id);
          if (!n) return;
          n.x = Math.max(0, Math.min(CANVAS_W - n.w, n.x + dx));
          n.y = Math.max(0, Math.min(CANVAS_H - n.h, n.y + dy));
        });
        render();
        const moveLabel = selectedNodes.size === 1
          ? `Movió ${state.nodes.find(n => selectedNodes.has(n.id))?.label || 'una forma'}`
          : `Movió ${selectedNodes.size} formas`;
        commitChange('nudge', moveLabel, { coalesce: true });
      }
    }
    document.addEventListener('keydown', onKey);

    setMode(null);
    // Frame the existing content (or stay centered for an empty canvas).
    resetView();
    render();
    updateHistoryUI();

    function toSVG() {
      const cl = svg.cloneNode(true);
      cl.querySelectorAll('.de-inline-editor, .de-edge-hit, [data-ghost], [data-anchors], [data-resize], [data-edge-handles], [data-snap], [data-marquee], .de-canvas-bg, .de-canvas-bounds').forEach(el => el.remove());
      cl.setAttribute('xmlns', NS);
      // Frame the export on the actual content (or a sensible default if empty).
      const bb = nodesBoundingBox();
      let vbX, vbY, vbW, vbH;
      if (bb) {
        const PAD = 30;
        vbX = bb.minX - PAD; vbY = bb.minY - PAD;
        vbW = (bb.maxX - bb.minX) + 2 * PAD;
        vbH = (bb.maxY - bb.minY) + 2 * PAD;
      } else {
        vbX = 0; vbY = 0; vbW = VIEW_W0; vbH = VIEW_H0;
      }
      cl.setAttribute('viewBox', `${vbX} ${vbY} ${vbW} ${vbH}`);
      cl.setAttribute('width', String(Math.round(vbW)));
      cl.setAttribute('height', String(Math.round(vbH)));
      const style = document.createElementNS(NS, 'style');
      style.textContent = `
        .de-node-type-rect    .de-node-body { fill: #F8FBFA; stroke: #0E7C66; stroke-width: 1.6; }
        .de-node-type-circle  .de-node-body { fill: #FEF3C7; stroke: #B45309; stroke-width: 1.6; }
        .de-node-type-cloud   .de-node-body { fill: #ECFEFF; stroke: #0E7490; stroke-width: 1.6; }
        .de-node-type-db      .de-node-body { fill: #EDE9FE; stroke: #5B21B6; stroke-width: 1.6; }
        .de-node-type-db      .de-node-db-lid { fill: #F3F0FE; stroke: #5B21B6; stroke-width: 1.6; }
        .de-node-type-actor   .de-node-body { fill: #FDF2F8; stroke: #9D174D; stroke-width: 1.6; }
        .de-node-type-stack   .de-node-body { fill: #F0FDF4; stroke: #166534; stroke-width: 1.4; }
        .de-node-type-hexagon .de-node-body { fill: #FFF7ED; stroke: #C2410C; stroke-width: 1.6; }
        .de-node-type-queue   .de-node-body { fill: #EFF6FF; stroke: #1D4ED8; stroke-width: 1.4; }
        .de-node-type-queue   .de-node-divider  { stroke: #1D4ED8; stroke-width: 1; opacity: 0.5; }
        .de-node-type-queue   .de-node-queue-cap { fill: #1D4ED8; }
        .de-node-package-body { fill: none; stroke: #6B7280; stroke-width: 1.4; stroke-dasharray: 6 4; }
        .de-node-text-box { fill: none; stroke: none; }
        .de-node[data-color="slate"]  .de-node-body { fill: #F1F5F9; stroke: #475569; }
        .de-node[data-color="coral"]  .de-node-body { fill: #FFF1EC; stroke: #C2410C; }
        .de-node[data-color="amber"]  .de-node-body { fill: #FEF3C7; stroke: #B45309; }
        .de-node[data-color="green"]  .de-node-body { fill: #ECFDF3; stroke: #15803D; }
        .de-node[data-color="teal"]   .de-node-body { fill: #EFFCF9; stroke: #0F766E; }
        .de-node[data-color="blue"]   .de-node-body { fill: #EFF6FF; stroke: #1D4ED8; }
        .de-node[data-color="violet"] .de-node-body { fill: #F5F3FF; stroke: #6D28D9; }
        .de-node[data-color="pink"]   .de-node-body { fill: #FDF2F8; stroke: #BE185D; }
        .de-group-frame { fill: rgba(244,124,89,0.05); stroke: #C97A5E; stroke-width: 1.4; stroke-dasharray: 7 5; }
        .de-node-highlight { fill: rgba(255,255,255,0.5); }
        .de-node-label-text { font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.2; color: #0B0D10; text-align: center; display: flex; align-items: center; justify-content: center; height: 100%; padding: 0 4px; box-sizing: border-box; }
        .de-edge { color: #0E7C66; }
        .de-edge .de-edge-line { stroke: #0E7C66; stroke-width: 1.6; fill: none; }
        .de-edge-label { font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; fill: #585B63; }
      `;
      cl.insertBefore(style, cl.firstChild);
      return new XMLSerializer().serializeToString(cl);
    }

    return {
      getState: () => clone(state),
      setState: (s) => {
        state = clone(s || { nodes: [], edges: [] });
        if (!Array.isArray(state.trace)) state.trace = [];
        undoStack = [];
        redoStack = [];
        committedSnapshot = clone(state);
        lastCommit = { kind: null, ts: 0 };
        clearSelection();
        setMode(null);
        resetView();
        render();
        updateHistoryUI();
        toggleTrace(false);
        togglePresets(false);
      },
      toSVG,
      startInlineEdit,
      destroy: () => {
        destroyed = true;
        if (rafId) cancelAnimationFrame(rafId);
        if (inlineTimer) clearTimeout(inlineTimer);
        document.removeEventListener('keydown', onKey);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('mouseup', onAnchorDrop);
        container.removeEventListener('mouseenter', onPointerEnter);
        container.removeEventListener('mouseleave', onPointerLeave);
        container.innerHTML = '';
        container.classList.remove('diagram-editor', 'is-placing', 'is-connecting', 'is-panning-active');
      }
    };
  }

export { create as createDiagramEditor, clone as cloneDiagram };
