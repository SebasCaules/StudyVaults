/* ============================================================
   circuit-sandbox.js — Física 3, sección "Circuitos".
   Editor/sandbox de dibujo de circuitos (estilo Falstad) sobre
   SimKit. Dibujás circuitos DC y RLC arrastrando el mouse de un
   punto de grilla a otro y los ves resolverse en vivo.

   Registra DOS laboratorios (tab:"f3", section:"Circuitos"):
     · sandbox-dc   — continua (Kirchhoff, redes, divisores)
     · sandbox-rlc  — RC / RL / RLC, transitorios y resonancia AC

   NO calcula física eléctrica: consume i/v/V de window.CircuitCore
   (motor construido por otro archivo contra el mismo contrato).
   Si CircuitCore no está, dibuja un mensaje de error legible.

   Script clásico, sin módulos, compatible file://.
   ============================================================ */
(function () {
  "use strict";

  var TAU = Math.PI * 2;
  var GRID_W = 24, GRID_H = 14;   // celdas de la grilla (los presets caben acá)

  /* ---------- utilidades genéricas ---------- */
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function mono(ctx, px) { ctx.font = (px || 11) + "px ui-monospace, Menlo, monospace"; }
  function dot(ctx, x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }

  /* ---------- tipos de herramienta / componente ---------- */
  var COMPONENT_TOOLS = { wire: 1, battery: 1, acsource: 1, resistor: 1, capacitor: 1, inductor: 1, "switch": 1 };
  var HAS_VALUE = { resistor: 1, capacitor: 1, inductor: 1, battery: 1, acsource: 1 };
  var TOOL_LABEL = {
    wire: "Cable", battery: "Fuente DC", acsource: "Fuente AC", resistor: "R",
    capacitor: "C", inductor: "L", "switch": "Interruptor",
    select: "Seleccionar", "delete": "Borrar", probe: "Sonda",
  };
  var TOOL_HINT = {
    wire: "arrastrá de un punto de la grilla a otro para tender el cable",
    battery: "arrastrá de un punto a otro para colocar la pila",
    acsource: "arrastrá de un punto a otro para colocar la fuente AC",
    resistor: "arrastrá de un punto a otro para colocar la resistencia",
    capacitor: "arrastrá de un punto a otro para colocar el capacitor",
    inductor: "arrastrá de un punto a otro para colocar el inductor",
    "switch": "arrastrá de un punto a otro para colocar la llave (nace cerrada)",
    select: "clic en un componente para seleccionarlo (la llave también conmuta)",
    "delete": "clic en un componente para borrarlo",
    probe: "clic en un nodo para fijar la sonda del osciloscopio",
  };
  var TYPE_NAME = {
    wire: "cable", battery: "fuente DC", acsource: "fuente AC", resistor: "R",
    capacitor: "C", inductor: "L", "switch": "interruptor",
  };

  /* rangos logarítmicos del slider "valor" por tipo (unidades SI) */
  var RANGES = {
    resistor: [0.1, 1e6],       // Ω
    capacitor: [1e-12, 1e-2],   // F
    inductor: [1e-6, 1e1],      // H
    battery: [0.1, 100],        // V
    acsource: [0.1, 100],       // V (amplitud)
  };
  var FREQ_RANGE = [0.5, 5000]; // Hz

  function logMap(range, t) {
    var lo = Math.log10(range[0]), hi = Math.log10(range[1]);
    return Math.pow(10, lo + clamp(t, 0, 1) * (hi - lo));
  }
  function mapVal(type, t) { return logMap(RANGES[type] || RANGES.resistor, t); }
  function mapFreq(t) { return logMap(FREQ_RANGE, t); }

  /* ---------- formateo de valores con unidades ---------- */
  function fmtR(v) {
    var a = Math.abs(v);
    if (a >= 1e6) return (v / 1e6).toFixed(2) + " MΩ";
    if (a >= 1e3) return (v / 1e3).toFixed(a >= 1e4 ? 0 : 1) + " kΩ";
    if (a >= 1) return v.toFixed(a < 10 ? 1 : 0) + " Ω";
    return v.toFixed(2) + " Ω";
  }
  function fmtC(v) {
    var a = Math.abs(v);
    if (a >= 1) return v.toFixed(2) + " F";
    if (a >= 1e-3) return (v * 1e3).toFixed(2) + " mF";
    if (a >= 1e-6) return (v * 1e6).toFixed(2) + " µF";
    if (a >= 1e-9) return (v * 1e9).toFixed(2) + " nF";
    return (v * 1e12).toFixed(0) + " pF";
  }
  function fmtL(v) {
    var a = Math.abs(v);
    if (a >= 1) return v.toFixed(2) + " H";
    if (a >= 1e-3) return (v * 1e3).toFixed(2) + " mH";
    return (v * 1e6).toFixed(0) + " µH";
  }
  function fmtVolt(v) { return (Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(1)) + " V"; }
  function fmtFreq(f) {
    if (f >= 1000) return (f / 1000).toFixed(2) + " kHz";
    return f.toFixed(f < 10 ? 2 : 0) + " Hz";
  }
  function fmtByType(type, v) {
    if (type === "resistor") return fmtR(v);
    if (type === "capacitor") return fmtC(v);
    if (type === "inductor") return fmtL(v);
    return fmtVolt(v);
  }
  function valueText(cp) {
    switch (cp.type) {
      case "resistor": return fmtR(cp.value);
      case "capacitor": return fmtC(cp.value);
      case "inductor": return fmtL(cp.value);
      case "battery": return fmtVolt(cp.value);
      case "acsource": return fmtVolt(cp.value) + " · " + fmtFreq(cp.freq);
      case "switch": return cp.closed ? "cerrado" : "abierto";
      default: return null;
    }
  }

  /* ---------- color por potencial (azul − · gris 0 · coral +) ---------- */
  var C_GRAY = [138, 138, 147], C_BLUE = [146, 207, 242], C_CORAL = [244, 124, 89];
  function mix(a, b, t) {
    return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * t) + "," +
      Math.round(a[1] + (b[1] - a[1]) * t) + "," +
      Math.round(a[2] + (b[2] - a[2]) * t) + ")";
  }
  function colorForV(v, scale) {
    if (v === null || v === undefined || !(scale > 0)) return "rgba(161,161,170,0.7)";
    var s = clamp(v / scale, -1, 1);
    return s >= 0 ? mix(C_GRAY, C_CORAL, s) : mix(C_GRAY, C_BLUE, -s);
  }

  /* ---------- texto con contorno oscuro (legible sobre cualquier fondo) ---------- */
  function textOut(ctx, text, x, y, color, center) {
    ctx.save();
    ctx.textAlign = center ? "center" : "left";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(20,10,4,0.92)"; ctx.lineWidth = 3;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = color; ctx.fillText(text, x, y);
    ctx.restore();
  }

  /* ---------- glifos (en marco local: eje +x = a→b, centro en origen) ---------- */
  // posB = el terminal + (mayor potencial) está hacia +x (hacia b)
  function drawGlyphLocal(ctx, cp, hw, posB, cell, col) {
    var t = cp.type;
    if (t === "resistor") {
      var amp = cell * 0.28, n = 6;
      ctx.strokeStyle = col.amber; ctx.lineWidth = 2.2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(-hw, 0);
      for (var k = 1; k < n; k++) { ctx.lineTo(-hw + (2 * hw) * k / n, (k % 2 ? -amp : amp)); }
      ctx.lineTo(hw, 0); ctx.stroke();
    } else if (t === "capacitor") {
      var g = Math.min(hw * 0.5, cell * 0.16), ph = cell * 0.55;
      ctx.strokeStyle = col.dim; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-hw, 0); ctx.lineTo(-g, 0); ctx.moveTo(g, 0); ctx.lineTo(hw, 0); ctx.stroke();
      ctx.strokeStyle = col.blue; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-g, -ph); ctx.lineTo(-g, ph); ctx.moveTo(g, -ph); ctx.lineTo(g, ph); ctx.stroke();
    } else if (t === "inductor") {
      var loops = 4, r = (2 * hw) / (loops * 2);
      ctx.strokeStyle = col.amber; ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (var j = 0; j < loops; j++) {
        var cx = -hw + r * (2 * j + 1);
        if (j === 0) ctx.moveTo(cx - r, 0);
        ctx.arc(cx, 0, r, Math.PI, TAU, false); // semicírculo superior
      }
      ctx.stroke();
    } else if (t === "battery") {
      var gap = Math.min(hw * 0.55, cell * 0.22);
      var longX = posB ? gap : -gap, shortX = -longX;
      var lph = cell * 0.5, sph = cell * 0.3;
      ctx.strokeStyle = col.dim; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-hw, 0); ctx.lineTo(-gap, 0); ctx.moveTo(gap, 0); ctx.lineTo(hw, 0); ctx.stroke();
      ctx.strokeStyle = col.coral; ctx.lineWidth = 2.6;   // placa + (larga)
      ctx.beginPath(); ctx.moveTo(longX, -lph); ctx.lineTo(longX, lph); ctx.stroke();
      ctx.strokeStyle = col.blue; ctx.lineWidth = 5;      // placa − (corta)
      ctx.beginPath(); ctx.moveTo(shortX, -sph); ctx.lineTo(shortX, sph); ctx.stroke();
    } else if (t === "acsource") {
      var rad = Math.min(hw * 0.92, cell * 0.5);
      ctx.strokeStyle = col.dim; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-hw, 0); ctx.lineTo(-rad, 0); ctx.moveTo(rad, 0); ctx.lineTo(hw, 0); ctx.stroke();
      ctx.strokeStyle = col.coral; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(0, 0, rad, 0, TAU); ctx.stroke();
      // onda ~ adentro
      ctx.lineWidth = 1.8; ctx.beginPath();
      var seg = 20, wr = rad * 0.62;
      for (var s = 0; s <= seg; s++) {
        var xx = -wr + (2 * wr) * s / seg, yy = -Math.sin((s / seg) * TAU) * rad * 0.34;
        if (s === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    } else if (t === "switch") {
      var contact = 2.6;
      dot(ctx, -hw, 0, contact, col.text); dot(ctx, hw, 0, contact, col.text);
      ctx.strokeStyle = cp.closed ? col.teal : col.amber; ctx.lineWidth = 2.6; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(-hw, 0);
      if (cp.closed) ctx.lineTo(hw, 0); else ctx.lineTo(hw * 0.35, -cell * 0.52);
      ctx.stroke();
    }
  }

  /* ============================================================
     Factory: arma una registración de sandbox contra CircuitCore
     ============================================================ */
  function makeSandboxSim(cfg) {
    // estado compartido por la (única) card de esta registración: lo usan
    // tanto el fmt del slider como create(env).
    var S = { valueType: "resistor" };

    var presetOptions = [
      ["divisor", "Divisor de tensión"],
      ["mallas2", "Dos mallas (Kirchhoff)"],
      ["wheatstone", "Puente de Wheatstone"],
      ["rc", "RC (carga / descarga)"],
      ["rl", "RL (crecimiento de i)"],
      ["rlc-dc", "RLC (escalón DC)"],
      ["rlc-ac", "RLC (excitación AC)"],
    ];

    var controls = [
      { type: "segment", key: "herr", label: "Herramienta", value: "select", options: [
        ["wire", "Cable"], ["battery", "Fuente DC"], ["acsource", "Fuente AC"],
        ["resistor", "R"], ["capacitor", "C"], ["inductor", "L"],
        ["switch", "Interruptor"], ["select", "Seleccionar"], ["delete", "Borrar"], ["probe", "Sonda"]] },
      { type: "range", key: "valor", label: "valor del seleccionado", min: 0, max: 1, step: 0.001, value: 0.5,
        fmt: function (t) { return fmtByType(S.valueType, mapVal(S.valueType, t)); } },
      { type: "range", key: "frecuencia", label: "frecuencia (fuente AC)", min: 0, max: 1, step: 0.001, value: 0.5,
        fmt: function (t) { return fmtFreq(mapFreq(t)); } },
      { type: "select", key: "preset", label: "Preset", value: cfg.preset, options: presetOptions },
      { type: "button", key: "cargar", label: "Cargar preset (reemplaza)" },
      { type: "button", key: "limpiar", label: "Limpiar todo" },
      { type: "button", key: "reiniciar", label: "Reiniciar transitorio (t → 0)" },
    ];

    return {
      tab: "f3",
      section: "Circuitos",
      id: cfg.id,
      title: cfg.title,
      refs: cfg.refs,
      blurb: cfg.blurb,
      formula: cfg.formula,
      stageHeight: cfg.stageHeight,
      controls: controls,
      plot: {
        height: 152,
        window: 3,
        xLabel: "t (s)",
        series: [
          { key: "sv", label: "V sonda (V)", color: "#92cff2" },
          { key: "si", label: "i sel (A)", color: "#f47c59" },
        ],
      },
      readouts: [
        { key: "sel", label: "seleccionado" },
        { key: "i", label: "i sel", unit: "A", digits: 3 },
        { key: "v", label: "v sel", unit: "V", digits: 3 },
        { key: "vp", label: "V sonda", unit: "V", digits: 3 },
        { key: "t", label: "t transitorio", unit: "s", digits: 2 },
      ],

      create: function (env) {
        var col = env.colors;
        var CC = window.CircuitCore || null;
        var canvas = env.canvas;

        /* ---- estado de circuito e interacción ---- */
        var c = null;
        var tool = env.params.herr || "select";
        var selId = null;
        var probeNode = null;         // [gx,gy] de la sonda del scope
        var drag = null;              // {a:[gx,gy], b:[gx,gy]} mientras se coloca
        var lay = null;               // layout de grilla vigente

        function makeCircuit(key) {
          if (!CC) return null;
          try {
            if (key && CC.PRESETS && CC.PRESETS[key] && CC.load) return CC.load(CC.PRESETS[key]);
          } catch (e) {}
          try { return CC.create(); } catch (e2) { return null; }
        }
        c = makeCircuit(cfg.preset);

        /* ---- layout de grilla ---- */
        function computeLayout(W, H) {
          var margin = 26;
          var cell = Math.min((W - 2 * margin) / GRID_W, (H - 2 * margin) / GRID_H);
          if (!(cell > 0)) cell = 20;
          var gw = cell * GRID_W, gh = cell * GRID_H;
          return { cell: cell, ox: (W - gw) / 2, oy: (H - gh) / 2, W: W, H: H };
        }
        function ensureLayout() { if (!lay) lay = computeLayout(env.W || 600, env.H || 460); }
        function g2p(g) { return { x: lay.ox + g[0] * lay.cell, y: lay.oy + g[1] * lay.cell }; }
        function pxToGrid(px, py) {
          return [clamp(Math.round((px - lay.ox) / lay.cell), 0, GRID_W),
                  clamp(Math.round((py - lay.oy) / lay.cell), 0, GRID_H)];
        }
        function constrain(a, g) { // fuerza H o V respecto de a
          var dx = Math.abs(g[0] - a[0]), dy = Math.abs(g[1] - a[1]);
          return dx >= dy ? [g[0], a[1]] : [a[0], g[1]];
        }

        /* ---- lista robusta de componentes (list() puede dar ids u objetos) ---- */
        function listComps() {
          var raw = [];
          try { raw = c.list ? c.list() : []; } catch (e) {}
          var out = [];
          for (var i = 0; i < raw.length; i++) {
            var it = raw[i];
            if (it && typeof it === "object" && it.a) out.push(it);
            else { var gg = null; try { gg = c.get(it); } catch (e2) {} if (gg) out.push(gg); }
          }
          return out;
        }

        function nodeKey(g) { return g[0] + "," + g[1]; }
        function buildNodeV(comps) {
          var map = {}, deg = {}, lo = Infinity, hi = -Infinity;
          function reg(g) {
            var k = nodeKey(g);
            deg[k] = (deg[k] || 0) + 1;
            if (k in map) return;
            var v = null; try { v = c.nodeVoltage ? c.nodeVoltage(g) : null; } catch (e) {}
            map[k] = v;
            if (v !== null && v !== undefined) { if (v < lo) lo = v; if (v > hi) hi = v; }
          }
          comps.forEach(function (cp) { reg(cp.a); reg(cp.b); });
          if (probeNode) { var pk = nodeKey(probeNode); if (!(pk in map)) { try { map[pk] = c.nodeVoltage(probeNode); } catch (e) { map[pk] = null; } } }
          var scale = Math.max(Math.abs(lo === Infinity ? 0 : lo), Math.abs(hi === -Infinity ? 0 : hi), 1e-9);
          return { map: map, deg: deg, scale: scale };
        }

        /* ---- corriente = puntos animados a lo largo del segmento ---- */
        function drawFlow(ctx, p0, p1, i) {
          var lenPx = Math.hypot(p1.x - p0.x, p1.y - p0.y);
          if (lenPx < 6) return;
          var mag = Math.abs(i);
          if (mag < 1e-9) return;
          var ux = (p1.x - p0.x) / lenPx, uy = (p1.y - p0.y) / lenPx;
          // velocidad saturada (fracción de segmento por segundo), signo = sentido a→b
          var spd = (i >= 0 ? 1 : -1) * clamp(0.1 + Math.log10(1 + mag * 40) * 0.55, 0.06, 3.0);
          var N = Math.max(2, Math.round(lenPx / (lay.cell * 0.7)));
          var phase = 0; try { phase = c.time || 0; } catch (e) {}
          for (var k = 0; k < N; k++) {
            var f = (phase * spd) + k / N; f -= Math.floor(f);
            dot(ctx, p0.x + ux * lenPx * f, p0.y + uy * lenPx * f, 2.3, "rgba(255,244,228,0.92)");
          }
        }

        /* ---- dibujo de un componente completo ---- */
        function drawComponent(ctx, cp, nodeV) {
          var p0 = g2p(cp.a), p1 = g2p(cp.b);
          var lenPx = Math.hypot(p1.x - p0.x, p1.y - p0.y);
          if (lenPx < 1) return;
          var Va = nodeV.map[nodeKey(cp.a)], Vb = nodeV.map[nodeKey(cp.b)], sc = nodeV.scale;
          var ang = Math.atan2(p1.y - p0.y, p1.x - p0.x);
          var ux = Math.cos(ang), uy = Math.sin(ang);
          var mx = (p0.x + p1.x) / 2, my = (p0.y + p1.y) / 2;
          var hw = clamp(lenPx * 0.5, lay.cell * 0.85, Math.max(lenPx * 0.5, 8));

          // halo de selección (debajo de todo)
          if (cp.id === selId) {
            ctx.save();
            ctx.strokeStyle = env.tint; ctx.globalAlpha = 0.28; ctx.lineWidth = 9; ctx.lineCap = "round";
            ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
            ctx.restore();
          }

          // leads con gradiente de potencial
          var grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
          grad.addColorStop(0, colorForV(Va, sc));
          grad.addColorStop(1, colorForV(Vb, sc));
          ctx.strokeStyle = grad; ctx.lineWidth = 2.6; ctx.lineCap = "round";
          if (cp.type === "wire") {
            ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y); ctx.lineTo(mx - ux * hw, my - uy * hw);
            ctx.moveTo(mx + ux * hw, my + uy * hw); ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
          }

          // glifo en marco rotado
          var posB = (Va !== null && Vb !== null && Va !== undefined && Vb !== undefined) ? (Vb > Va) : true;
          ctx.save();
          ctx.translate(mx, my); ctx.rotate(ang);
          drawGlyphLocal(ctx, cp, hw, posB, lay.cell, col);
          ctx.restore();

          // corriente animada
          drawFlow(ctx, p0, p1, cp.i || 0);

          // etiqueta de valor (perpendicular al segmento)
          var perpx = Math.sin(ang), perpy = -Math.cos(ang);
          var vt = valueText(cp);
          if (vt) textOut(ctx, vt, mx + perpx * lay.cell * 0.8, my + perpy * lay.cell * 0.8 + 3, col.text, true);

          // terminal + de las fuentes
          if (cp.type === "battery" || cp.type === "acsource") {
            var sgn = posB ? 1 : -1;
            var px = mx + ux * sgn * hw * 0.5 + perpx * lay.cell * 0.45;
            var py = my + uy * sgn * hw * 0.5 + perpy * lay.cell * 0.45 + 3;
            textOut(ctx, "+", px, py, col.coral, true);
          }
        }

        /* ---- nodos coloreados por potencial ---- */
        function drawNodes(ctx, comps, nodeV) {
          var seen = {};
          comps.forEach(function (cp) {
            [cp.a, cp.b].forEach(function (g) {
              var k = nodeKey(g); if (seen[k]) return; seen[k] = 1;
              var p = g2p(g), v = nodeV.map[k];
              var junction = (nodeV.deg[k] || 0) >= 3;
              dot(ctx, p.x, p.y, junction ? 4 : 3, colorForV(v, nodeV.scale));
            });
          });
        }

        /* ---- grilla de puntos ---- */
        function drawGrid(ctx) {
          ctx.fillStyle = col.grid;
          for (var gx = 0; gx <= GRID_W; gx++) {
            for (var gy = 0; gy <= GRID_H; gy++) {
              var p = g2p([gx, gy]);
              ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, TAU); ctx.fill();
            }
          }
        }

        /* ---- sonda del scope ---- */
        function drawProbe(ctx, nodeV) {
          var p = g2p(probeNode);
          var v = nodeV.map[nodeKey(probeNode)];
          ctx.save();
          ctx.strokeStyle = env.tint; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, TAU); ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(p.x - 12, p.y); ctx.lineTo(p.x + 12, p.y);
          ctx.moveTo(p.x, p.y - 12); ctx.lineTo(p.x, p.y + 12); ctx.stroke();
          ctx.restore();
          textOut(ctx, "sonda " + (v == null ? "—" : v.toFixed(2) + " V"), p.x, p.y - 16, env.tint, true);
        }

        /* ---- preview del componente que se está colocando ---- */
        function drawPreview(ctx) {
          var pa = g2p(drag.a), pb = g2p(drag.b);
          ctx.save();
          ctx.strokeStyle = env.tint; ctx.globalAlpha = 0.9; ctx.lineWidth = 2.4;
          ctx.setLineDash([5, 5]); ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
          ctx.setLineDash([]);
          dot(ctx, pa.x, pa.y, 4, env.tint); dot(ctx, pb.x, pb.y, 4, env.tint);
          ctx.restore();
        }

        /* ---- HUD (herramienta activa + ayuda + leyenda de potencial) ---- */
        function drawHUD(ctx, W, H) {
          textOut(ctx, "Herramienta: " + (TOOL_LABEL[tool] || tool), 12, 18, env.tint);
          textOut(ctx, TOOL_HINT[tool] || "", 12, 34, col.dim);
          // leyenda de potencial abajo a la izquierda
          var ly = H - 12;
          textOut(ctx, "potencial:", 12, ly, col.dim);
          var lx = 78;
          [["−", col.blue], ["0", "#9a9aa2"], ["+", col.coral]].forEach(function (e) {
            dot(ctx, lx, ly - 4, 4, e[1]); textOut(ctx, e[0], lx + 8, ly, col.dim); lx += 30;
          });
        }

        /* ---- hit-test de componentes (distancia punto-segmento en px) ---- */
        function distToSeg(px, py, x0, y0, x1, y1) {
          var dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy;
          var t = L2 > 0 ? ((px - x0) * dx + (py - y0) * dy) / L2 : 0; t = clamp(t, 0, 1);
          return Math.hypot(px - (x0 + t * dx), py - (y0 + t * dy));
        }
        function pickComponent(px, py) {
          var comps = listComps(), best = null, bd = 1e9;
          for (var i = 0; i < comps.length; i++) {
            var p0 = g2p(comps[i].a), p1 = g2p(comps[i].b);
            var d = distToSeg(px, py, p0.x, p0.y, p1.x, p1.y);
            if (d < bd) { bd = d; best = comps[i]; }
          }
          return (best && bd <= Math.max(12, lay.cell * 0.45)) ? best : null;
        }

        /* ---- colocación / selección / borrado ---- */
        function placeComponent(type, a, b) {
          var spec = { type: type, a: a, b: b };
          if (HAS_VALUE[type]) spec.value = mapVal(type, env.params.valor);
          if (type === "acsource") spec.freq = mapFreq(env.params.frecuencia);
          if (type === "switch") spec.closed = true;
          var id = null; try { id = c.add(spec); } catch (e) {}
          if (id !== null && id !== undefined) {
            selId = id;
            if (HAS_VALUE[type]) S.valueType = type;
          }
        }
        function doSelect(px, py) {
          var comp = pickComponent(px, py);
          if (comp) {
            selId = comp.id;
            if (comp.type === "switch") { try { c.toggle(comp.id); } catch (e) {} }
            if (HAS_VALUE[comp.type]) S.valueType = comp.type;
          } else { selId = null; }
        }
        function doDelete(px, py) {
          var comp = pickComponent(px, py);
          if (comp) { try { c.remove(comp.id); } catch (e) {} if (selId === comp.id) selId = null; }
        }

        function cursorForTool(tl) {
          if (COMPONENT_TOOLS[tl] || tl === "probe") return "crosshair";
          if (tl === "select" || tl === "delete") return "pointer";
          return "default";
        }

        /* ---- listeners propios sobre el canvas ---- */
        function pos(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
        canvas.addEventListener("pointerdown", function (e) {
          if (!c) return;
          ensureLayout();
          var p = pos(e), g = pxToGrid(p.x, p.y);
          if (COMPONENT_TOOLS[tool]) {
            drag = { a: g, b: g };
            try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
            e.preventDefault();
          }
        });
        canvas.addEventListener("pointermove", function (e) {
          ensureLayout();
          canvas.style.cursor = cursorForTool(tool);   // corre después del core → gana
          if (drag) { var p = pos(e); drag.b = constrain(drag.a, pxToGrid(p.x, p.y)); }
        });
        canvas.addEventListener("pointerup", function (e) {
          if (!c) { drag = null; return; }
          ensureLayout();
          var p = pos(e);
          if (drag) {
            var a = drag.a, b = constrain(drag.a, pxToGrid(p.x, p.y));
            drag = null;
            if (a[0] === b[0] && a[1] === b[1]) return;   // clic sin arrastre: no coloca
            placeComponent(tool, a, b);
            return;
          }
          if (tool === "select") doSelect(p.x, p.y);
          else if (tool === "delete") doDelete(p.x, p.y);
          else if (tool === "probe") probeNode = pxToGrid(p.x, p.y);
        });
        canvas.addEventListener("pointercancel", function () { drag = null; });

        /* ---- readouts ---- */
        function updateReadouts(nodeV) {
          var g = null; if (selId !== null && selId !== undefined) { try { g = c.get(selId); } catch (e) {} }
          if (g) {
            if (HAS_VALUE[g.type]) S.valueType = g.type;
            var name = TYPE_NAME[g.type] || g.type, vt = valueText(g);
            env.setReadout("sel", name + (vt ? " · " + vt : ""));
            env.setReadout("i", g.i);
            env.setReadout("v", g.v);
          } else {
            selId = (g === null && selId !== null) ? null : selId; // limpiar si desapareció
            env.setReadout("sel", "— nada seleccionado");
            env.setReadout("i", "—"); env.setReadout("v", "—");
          }
          var vp = null; if (probeNode) { try { vp = c.nodeVoltage(probeNode); } catch (e) {} }
          env.setReadout("vp", vp == null ? "—" : vp);
          var tt = 0; try { tt = c.time || 0; } catch (e) {}
          env.setReadout("t", tt);
        }

        /* ================= API SimKit ================= */
        function step(dt) {
          if (!c || !c.step) return;
          try { c.step(dt); } catch (e) { return; }
          var vals = {};
          if (probeNode) { var vp = null; try { vp = c.nodeVoltage(probeNode); } catch (e2) {} if (vp !== null && vp !== undefined) vals.sv = vp; }
          if (selId !== null && selId !== undefined) { var g = null; try { g = c.get(selId); } catch (e3) {} if (g && g.i !== null && g.i !== undefined) vals.si = g.i; }
          var tt = 0; try { tt = c.time || 0; } catch (e4) {}
          env.plot.push(tt, vals);
        }

        function draw(ctx, W, H) {
          if (!c) {
            ctx.save(); ctx.textAlign = "center";
            ctx.fillStyle = col.red; mono(ctx, 15);
            ctx.fillText("CircuitCore no está disponible", W / 2, H / 2 - 8);
            ctx.fillStyle = col.dim; mono(ctx, 11);
            ctx.fillText("incluí circuit-core.js antes de circuit-sandbox.js en el HTML", W / 2, H / 2 + 14);
            ctx.restore();
            return;
          }
          lay = computeLayout(W, H);
          drawGrid(ctx);
          var comps = listComps();
          var nodeV = buildNodeV(comps);
          for (var i = 0; i < comps.length; i++) drawComponent(ctx, comps[i], nodeV);
          drawNodes(ctx, comps, nodeV);
          if (probeNode) drawProbe(ctx, nodeV);
          if (drag) drawPreview(ctx);
          drawHUD(ctx, W, H);
          updateReadouts(nodeV);
        }

        function reset() {
          if (c) { try { c.reset(); } catch (e) {} }
          env.plot.clear();
        }

        function onControl(key) {
          if (key === "herr") {
            tool = env.params.herr; drag = null;
            var ty = tool; if (HAS_VALUE[ty]) S.valueType = ty;
            canvas.style.cursor = cursorForTool(tool);
          } else if (key === "valor") {
            if (c && selId !== null && selId !== undefined) {
              var g = null; try { g = c.get(selId); } catch (e) {}
              if (g && HAS_VALUE[g.type]) { try { c.setValue(selId, mapVal(g.type, env.params.valor)); } catch (e2) {} }
            }
          } else if (key === "frecuencia") {
            if (c && selId !== null && selId !== undefined) {
              var g2 = null; try { g2 = c.get(selId); } catch (e) {}
              if (g2 && g2.type === "acsource") { try { c.setFreq(selId, mapFreq(env.params.frecuencia)); } catch (e2) {} }
            }
          }
          // key === "preset": no hace nada hasta apretar "cargar"
        }

        function onButton(key) {
          if (key === "cargar") {
            var nc = makeCircuit(env.params.preset);
            if (nc) { c = nc; selId = null; probeNode = null; env.plot.clear(); }
          } else if (key === "limpiar") {
            if (c) { try { c.clear(); } catch (e) {} selId = null; probeNode = null; env.plot.clear(); }
          } else if (key === "reiniciar") {
            if (c) { try { c.reset(); } catch (e) {} env.plot.clear(); }
          }
        }

        return { reset: reset, step: step, draw: draw, onControl: onControl, onButton: onButton };
      },
    };
  }

  /* ============================================================
     Registraciones
     ============================================================ */
  SimKit.registerSim(makeSandboxSim({
    id: "sandbox-dc",
    title: "Sandbox de circuitos — DC",
    refs: "Editor libre · Kirchhoff / redes de continua",
    preset: "mallas2",
    stageHeight: 480,
    formula: "V = IR   ·   nodo: Σi = 0   ·   malla: ΣV = 0   ·   dibujá con el mouse y medí con la sonda",
    blurb: "Dibujá tu propio circuito de continua: elegí una herramienta y arrastrá de un punto de la " +
      "grilla a otro para tender cables, pilas y resistencias. Los cables se colorean por potencial y los " +
      "puntos animados muestran la corriente; verificá Kirchhoff donde quieras con la sonda. Arrancá de un " +
      "preset o limpiá todo. (Ojo: Reiniciar sólo pone el tiempo a cero; el circuito editado se conserva — " +
      "usá Cargar preset para reemplazarlo.)",
  }));

  SimKit.registerSim(makeSandboxSim({
    id: "sandbox-rlc",
    title: "Sandbox de circuitos — RLC y transitorios",
    refs: "Editor libre · RC / RL / RLC · transitorios y resonancia",
    preset: "rlc-dc",
    stageHeight: 480,
    formula: "τ_RC = RC   ·   τ_RL = L/R   ·   f₀ = 1/(2π√(LC))   ·   el motor integra el transitorio real",
    blurb: "RC, RL y RLC de verdad: colocá R, C y L, cerrá el interruptor y mirá el transitorio en el " +
      "osciloscopio de abajo (fijá la sonda en un nodo con la herramienta Sonda; si además seleccionás un " +
      "componente, se grafica su i(t)). Cambiá el preset a AC y barré la frecuencia con el slider para " +
      "buscar la resonancia. Reiniciar transitorio vuelve el tiempo a cero sin borrar tu circuito.",
  }));

})();
