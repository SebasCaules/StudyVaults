/* ============================================================
   f1.js — Física 1 (mecánica y fluidos)
   Laboratorio de simulaciones para el mockup de toolkits.
   Refuerza los apuntes reales de la cursada (Teórica + Práctica).
   Ronda 2: cada sim tiene al menos un handle arrastrable
   (env.addHandle) — se puede AGARRAR y TOCAR todo.
   Script clásico, sin módulos, compatible file://.
   ============================================================ */
(function () {
  "use strict";

  var K = window.SimKit;
  if (!K) return;
  var C = K.colors;
  var G = 9.8;                 // gravedad (m/s²), como en los apuntes
  var MONO = "11px ui-monospace, Menlo, monospace";
  var MONO_SM = "10px ui-monospace, Menlo, monospace";

  /* ---------- helpers de dibujo ---------- */
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  // flecha estándar del core (misma primitiva en las 3 pestañas)
  function arrow(ctx, x0, y0, x1, y1, color, w) {
    K.arrow(ctx, x0, y0, x1, y1, color, w);
  }

  function label(ctx, txt, x, y, color, font, align, baseline) {
    ctx.font = font || MONO;
    ctx.fillStyle = color || C.dim;
    ctx.textAlign = align || "left";
    ctx.textBaseline = baseline || "alphabetic";
    ctx.fillText(txt, x, y);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }

  function disc(ctx, x, y, r, fill, stroke, lw) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 2; ctx.stroke(); }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // resorte horizontal en zig-zag entre (x0,y) y (x1,y)
  function drawSpring(ctx, x0, x1, y, coils, amp, color, lw) {
    ctx.strokeStyle = color; ctx.lineWidth = lw || 2; ctx.lineJoin = "round";
    ctx.beginPath();
    var lead = 10, span = (x1 - x0) - 2 * lead;
    if (span < 4) span = 4;
    ctx.moveTo(x0, y); ctx.lineTo(x0 + lead, y);
    var seg = span / coils;
    for (var i = 0; i < coils; i++) {
      var sx = x0 + lead + i * seg;
      ctx.lineTo(sx + seg * 0.25, y - amp);
      ctx.lineTo(sx + seg * 0.75, y + amp);
      ctx.lineTo(sx + seg, y);
    }
    ctx.lineTo(x1, y); ctx.stroke();
    ctx.lineJoin = "miter";
  }

  // pared con hachurado
  function drawWall(ctx, x, y0, y1, color, side) {
    var s = side === "right" ? 1 : -1;
    ctx.strokeStyle = color || C.gridStrong; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
    ctx.lineWidth = 1;
    for (var yy = y0; yy < y1; yy += 8) {
      ctx.beginPath(); ctx.moveTo(x, yy + 8); ctx.lineTo(x + s * 7, yy); ctx.stroke();
    }
  }

  /* ---------- binding sliders <-> handles ----------
     El core no expone los <input> de los controles, así que los
     mapeamos por orden (los range aparecen en el DOM en el mismo
     orden que en spec.controls). set() escribe el valor y dispara
     'input' para que el thumb, el label, params y onControl queden
     sincronizados cuando se arrastra un handle. */
  function bindSliders(env, keys) {
    var inputs = [];
    var card = env.canvas.closest ? env.canvas.closest(".sim-card") : null;
    if (card) inputs = card.querySelectorAll('.sim-panel input[type="range"]');
    var map = {};
    keys.forEach(function (k, i) { if (inputs[i]) map[k] = inputs[i]; });
    return {
      set: function (key, val) {
        var inp = map[key];
        if (!inp) { env.params[key] = val; return; }
        var mn = parseFloat(inp.min), mx = parseFloat(inp.max);
        if (!isNaN(mn) && val < mn) val = mn;
        if (!isNaN(mx) && val > mx) val = mx;
        inp.value = val;
        inp.dispatchEvent(new Event("input", { bubbles: true }));
      }
    };
  }

  /* ---------- readouts de texto (estado/categoría) ----------
     El fmtNum del core hace isNaN(v) ANTES de chequear si es string,
     así que cualquier readout de texto ("flota", "∞", "elástica")
     renderiza como "—". Para categorías escribimos la celda .v del
     DOM directamente (por orden) y de paso la coloreamos. */
  function bindText(env, keys) {
    var card = env.canvas.closest ? env.canvas.closest(".sim-card") : null;
    var vs = card ? card.querySelectorAll(".readouts .readout .v") : [];
    var map = {};
    keys.forEach(function (k, i) { if (vs[i]) map[k] = vs[i]; });
    return function (key, text, color) {
      var elv = map[key]; if (!elv) return;
      elv.innerHTML = color ? '<span style="color:' + color + '">' + text + "</span>" : text;
    };
  }

  /* ============================================================
     TAB
     ============================================================ */
  K.registerTab({
    id: "f1",
    intro: "Mecánica completa de la partícula y del cuerpo rígido, más fluidos ideales: cinemática 1D, tiro oblicuo, dinámica (Atwood, peralte), energía con resortes, choques, momento angular, rodadura y fluidos (Arquímedes, Bernoulli, Torricelli). Todo salido de los apuntes — y todo se puede tocar: arrastrá las flechas, las masas y los bordes."
  });

  /* ============================================================
     SIM 1 — Tiro oblicuo (con/ sin drag lineal)
     Handle: la punta del vector v₀ en el origen (módulo + ángulo).
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "tiro",
    title: "Tiro oblicuo",
    refs: "Teórica p.2–6, p.10 · Práctica g.1",
    blurb: "Arrastrá la punta de la flecha v₀ para apuntar (módulo y ángulo); los sliders quedan para el ajuste fino. La parábola prevista, la traza real y los vectores v y a responden en vivo, con y sin rozamiento del aire.",
    formula: "R = v₀²·sen2θ/g   ·   h_máx = (v₀·senθ)²/2g   ·   con drag: a = −g·ĵ − (b/m)·v",
    controls: [
      { type: "range", key: "v0", label: "v₀", min: 5, max: 40, step: 1, value: 22, unit: "m/s", digits: 0 },
      { type: "range", key: "angle", label: "ángulo θ", min: 10, max: 85, step: 1, value: 52, unit: "°", digits: 0 },
      { type: "toggle", key: "drag", label: "Rozamiento del aire", value: false },
      { type: "range", key: "k", label: "arrastre b/m", min: 0, max: 1.2, step: 0.05, value: 0.35, unit: "1/s", digits: 2 }
    ],
    readouts: [
      { key: "R", label: "Alcance", unit: "m", digits: 1 },
      { key: "H", label: "h máx", unit: "m", digits: 1 },
      { key: "T", label: "t vuelo", unit: "s", digits: 2 },
      { key: "vf", label: "v impacto", unit: "m/s", digits: 1 }
    ],
    plot: {
      window: 6, xLabel: "t (s)", yLabel: "v_y (m/s)",
      series: [{ key: "vy", label: "v_y", color: C.coral }]
    },
    create: function (env) {
      var ML = 46, MR = 24, MTOP = 26, MBOT = 34;
      var AIMSC = 4;                      // px por m/s del vector de apuntado
      var sl = bindSliders(env, ["v0", "angle", "k"]);
      var x, y, vx, vy, t, landed, restT, maxH, trace;
      var aR = 0, aH = 0, aT = 0;         // predicción analítica (sin drag)

      function predict() {
        var v0 = env.params.v0, th = env.params.angle * Math.PI / 180;
        aR = v0 * v0 * Math.sin(2 * th) / G;
        aH = (v0 * Math.sin(th)) * (v0 * Math.sin(th)) / (2 * G);
        aT = 2 * v0 * Math.sin(th) / G;
        env.setReadout("R", aR); env.setReadout("H", aH);
        env.setReadout("T", aT); env.setReadout("vf", v0);
      }
      function launch() {
        var v0 = env.params.v0, th = env.params.angle * Math.PI / 180;
        vx = v0 * Math.cos(th); vy = v0 * Math.sin(th);
        x = 0; y = 0; t = 0; landed = false; restT = 0; maxH = 0; trace = [[0, 0]];
        env.plot.clear();
        predict();
      }

      // origen del cañón en px
      function ox() { return ML; }
      function oy() { return env.H - MBOT; }

      // handle: punta del vector v₀ (fija módulo y ángulo)
      env.addHandle({
        r: 15,
        x: function () { var th = env.params.angle * Math.PI / 180; return ox() + env.params.v0 * AIMSC * Math.cos(th); },
        y: function () { var th = env.params.angle * Math.PI / 180; return oy() - env.params.v0 * AIMSC * Math.sin(th); },
        onDrag: function (px, py) {
          var dx = px - ox(), dy = oy() - py;
          var v0 = clamp(Math.hypot(dx, dy) / AIMSC, 5, 40);
          var ang = clamp(Math.atan2(dy, dx) * 180 / Math.PI, 10, 85);
          sl.set("v0", v0); sl.set("angle", ang);
        }
      });

      return {
        reset: function () { launch(); },
        onControl: function () { predict(); },   // aim en vivo; el proyectil sigue y relanza al aterrizar
        step: function (dt) {
          if (landed) { restT += dt; if (restT > 0.7) launch(); return; }
          var k = env.params.drag ? env.params.k : 0;
          var ax = -k * vx, ay = -G - k * vy;
          vx += ax * dt; vy += ay * dt;
          x += vx * dt; y += vy * dt; t += dt;
          if (y > maxH) maxH = y;
          if (trace.length < 4000) trace.push([x, y]);
          env.plot.push(t, { vy: vy });
          if (y <= 0 && vy < 0) {
            y = 0; landed = true; restT = 0;
            env.setReadout("R", x); env.setReadout("H", maxH);
            env.setReadout("T", t); env.setReadout("vf", Math.sqrt(vx * vx + vy * vy));
          }
        },
        draw: function (ctx, W, H) {
          var worldW = Math.max(aR * 1.06, 4);
          var worldH = Math.max(aH * 1.18, 2);
          var sc = Math.min((W - ML - MR) / worldW, (H - MTOP - MBOT) / worldH);
          var OX = ML, OY = H - MBOT;
          function SX(wx) { return OX + wx * sc; }
          function SY(wy) { return OY - wy * sc; }

          // grilla de distancia + suelo
          ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
          var stepM = worldW <= 20 ? 2 : (worldW <= 60 ? 10 : 20);
          for (var gx = 0; gx <= worldW; gx += stepM) {
            ctx.beginPath(); ctx.moveTo(SX(gx), MTOP); ctx.lineTo(SX(gx), OY); ctx.stroke();
            label(ctx, gx + "m", SX(gx), OY + 14, C.dim, MONO_SM, "center");
          }
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(ML, OY); ctx.lineTo(W - MR, OY); ctx.stroke();

          // parábola PREVISTA (analítica, sin drag) — feedback de apuntado
          var v0 = env.params.v0, th = env.params.angle * Math.PI / 180;
          var pvx = v0 * Math.cos(th), pvy = v0 * Math.sin(th);
          ctx.setLineDash([4, 5]); ctx.strokeStyle = "rgba(255,255,255,0.28)"; ctx.lineWidth = 1.4;
          ctx.beginPath();
          for (var tt = 0; tt <= aT + 1e-3; tt += aT / 40) {
            var wx = pvx * tt, wy = pvy * tt - 0.5 * G * tt * tt;
            if (tt === 0) ctx.moveTo(SX(wx), SY(wy)); else ctx.lineTo(SX(wx), SY(wy));
          }
          ctx.stroke(); ctx.setLineDash([]);

          // marcas de alcance/h_max
          ctx.setLineDash([4, 4]); ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(SX(0), SY(aH)); ctx.lineTo(SX(aR / 2), SY(aH)); ctx.stroke();
          ctx.setLineDash([]);
          label(ctx, "h_máx " + aH.toFixed(1) + "m", SX(aR / 2) + 4, SY(aH) - 3, C.dim, MONO_SM, "left");

          // traza real
          if (trace.length > 1) {
            ctx.strokeStyle = "rgba(244,124,89,0.7)"; ctx.lineWidth = 2;
            ctx.beginPath();
            for (var i = 0; i < trace.length; i++) {
              var px = SX(trace[i][0]), py = SY(trace[i][1]);
              if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }

          // vector de apuntado v₀ desde el origen (con su handle en la punta)
          var aimX = OX + v0 * AIMSC * Math.cos(th), aimY = OY - v0 * AIMSC * Math.sin(th);
          arrow(ctx, OX, OY, aimX, aimY, C.coral, 2.6);
          label(ctx, "v₀=" + v0.toFixed(0), aimX + 6, aimY - 4, C.coral, MONO_SM, "left");

          // proyectil + vectores en vuelo
          var pxp = SX(x), pyp = SY(y);
          var vSc = 3.4, aSc = 6.0;
          var k = env.params.drag ? env.params.k : 0;
          var axw = -k * vx, ayw = -G - k * vy;
          arrow(ctx, pxp, pyp, pxp + axw * aSc, pyp - ayw * aSc, C.red, 2.2);
          label(ctx, "a", pxp + axw * aSc, pyp - ayw * aSc - 4, C.red, MONO_SM, "center");
          arrow(ctx, pxp, pyp, pxp + vx * vSc, pyp - vy * vSc, C.blue, 2.4);
          label(ctx, "v", pxp + vx * vSc + 6, pyp - vy * vSc, C.blue, MONO_SM, "left");
          disc(ctx, pxp, pyp, 6, C.coral, C.ink, 1.5);

          // indicador de ángulo
          label(ctx, env.params.angle.toFixed(0) + "°", SX(0) + 10, SY(0) - 8, C.dim, MONO_SM, "left");
          if (env.params.drag)
            label(ctx, "drag ON (b/m=" + env.params.k.toFixed(2) + ")", W - MR, MTOP + 4, C.amber, MONO_SM, "right", "top");
          else
            label(ctx, "sin rozamiento", W - MR, MTOP + 4, C.dim, MONO_SM, "right", "top");
        }
      };
    }
  });

  /* ============================================================
     SIM 2 — Colisiones 1D con coeficiente de restitución
     Handles: cada carrito (posición inicial) + la punta de su
     flecha de velocidad (v inicial).
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "colision",
    title: "Colisiones 1D",
    refs: "Teórica p.15–16 · Práctica g.4",
    blurb: "Arrastrá cada carrito para ubicarlo y arrastrá la punta de su flecha para fijarle la velocidad inicial; soltá y chocan. En cada choque p_total no cambia; K solo se conserva si e = 1.",
    formula: "m₁v₁+m₂v₂ = m₁v₁′+m₂v₂′   ·   e = −(v₁′−v₂′)/(v₁−v₂)   ·   e=0 plástica, e=1 elástica",
    stageHeight: 300,
    controls: [
      { type: "range", key: "m1", label: "m₁", min: 0.5, max: 4, step: 0.1, value: 1, unit: "kg", digits: 1 },
      { type: "range", key: "m2", label: "m₂", min: 0.5, max: 4, step: 0.1, value: 2, unit: "kg", digits: 1 },
      { type: "range", key: "v1", label: "v₁ inicial", min: -6, max: 6, step: 0.2, value: 3, unit: "m/s", digits: 1 },
      { type: "range", key: "v2", label: "v₂ inicial", min: -6, max: 6, step: 0.2, value: -2, unit: "m/s", digits: 1 },
      { type: "range", key: "e", label: "restitución e", min: 0, max: 1, step: 0.02, value: 0.6, digits: 2 }
    ],
    readouts: [
      { key: "p", label: "p total", unit: "kg·m/s", digits: 2 },
      { key: "K", label: "K total", unit: "J", digits: 2 },
      { key: "dk", label: "ΔK choque", unit: "J", digits: 2 },
      { key: "reg", label: "Régimen" }
    ],
    plot: {
      window: 10, xLabel: "t (s)", yLabel: "v (m/s)",
      series: [
        { key: "v1", label: "v₁", color: C.coral },
        { key: "v2", label: "v₂", color: C.blue }
      ]
    },
    create: function (env) {
      var L = 10;                          // largo del riel (m)
      var HPX = 42, VS = 13;               // alto de carrito (px), escala de flecha v
      var sl = bindSliders(env, ["m1", "m2", "v1", "v2", "e"]);
      var roTxt = bindText(env, ["p", "K", "dk", "reg"]);
      var c1, c2, t, lastDK, held = false;
      var initX1 = 2.6, initX2 = 7.4;

      function widthOf(m) { return 0.55 + 0.16 * m; }

      function layout() {
        var W = env.W, H = env.H, ml = 48, mr = 48;
        var sc = (W - ml - mr) / L;
        var railY = H * 0.60;
        return {
          ml: ml, sc: sc, railY: railY, bodyTopY: railY - HPX - 4,
          SX: function (wx) { return ml + wx * sc; },
          invX: function (px) { return (px - ml) / sc; }
        };
      }

      function reset() {
        var p = env.params;
        c1 = { x: initX1, v: p.v1, m: p.m1, w: widthOf(p.m1) };
        c2 = { x: initX2, v: p.v2, m: p.m2, w: widthOf(p.m2) };
        t = 0; lastDK = 0; env.plot.clear();
      }
      function regimen(e) { return e >= 0.98 ? "elástica" : (e <= 0.02 ? "plástica" : "inelástica"); }

      // handle: cuerpo de cada carrito (posición inicial)
      function bodyHandle(getC, setInit) {
        env.addHandle({
          r: 26,
          x: function () { return layout().SX(getC().x); },
          y: function () { return layout().bodyTopY + HPX / 2; },
          onStart: function () { held = true; },
          onDrag: function (px) {
            var g = layout(), c = getC();
            setInit(clamp(g.invX(px), c.w / 2, L - c.w / 2));
            reset();
          },
          onEnd: function () { held = false; }
        });
      }
      // handle: punta de la flecha de velocidad
      function velHandle(getC, key) {
        env.addHandle({
          r: 13,
          x: function () { var g = layout(), c = getC(); return g.SX(c.x) + c.v * VS; },
          y: function () { return layout().bodyTopY - 14; },
          onStart: function () { held = true; },
          onDrag: function (px) {
            var g = layout(), c = getC();
            sl.set(key, (px - g.SX(c.x)) / VS);
          },
          onEnd: function () { held = false; }
        });
      }
      bodyHandle(function () { return c1; }, function (v) { initX1 = v; });
      bodyHandle(function () { return c2; }, function (v) { initX2 = v; });
      velHandle(function () { return c1; }, "v1");
      velHandle(function () { return c2; }, "v2");

      function drawCart(ctx, c, g, color, name) {
        var wpx = c.w * g.sc, cx = g.SX(c.x), topY = g.bodyTopY;
        ctx.fillStyle = color; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
        roundRect(ctx, cx - wpx / 2, topY, wpx, HPX, 5); ctx.fill(); ctx.stroke();
        disc(ctx, cx - wpx * 0.30, g.railY - 3, 5, C.ink, color, 1.5);
        disc(ctx, cx + wpx * 0.30, g.railY - 3, 5, C.ink, color, 1.5);
        label(ctx, name + "=" + c.m.toFixed(1), cx, topY + HPX / 2 + 4, C.ink, MONO_SM, "center");
        // flecha de velocidad (con handle en la punta)
        arrow(ctx, cx, topY - 14, cx + c.v * VS, topY - 14, color, 2.4);
        label(ctx, c.v.toFixed(1), cx + c.v * VS + (c.v >= 0 ? 6 : -6), topY - 18,
          color, MONO_SM, c.v >= 0 ? "left" : "right");
      }

      return {
        reset: reset,
        onControl: function (key) {
          if (key === "m1" || key === "m2" || key === "v1" || key === "v2") reset();
          // 'e' se usa en vivo
        },
        step: function (dt) {
          if (!held) {
            c1.x += c1.v * dt; c2.x += c2.v * dt;
            [c1, c2].forEach(function (c) {
              var hw = c.w / 2;
              if (c.x - hw < 0) { c.x = hw; c.v = -c.v; }
              if (c.x + hw > L) { c.x = L - hw; c.v = -c.v; }
            });
            var gap = (c2.x - c1.x) - (c1.w / 2 + c2.w / 2);
            if (gap <= 0 && (c1.v - c2.v) > 0) {
              var e = env.params.e, m1 = c1.m, m2 = c2.m, u1 = c1.v, u2 = c2.v;
              var Kb = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2;
              var v1n = ((m1 - e * m2) * u1 + (1 + e) * m2 * u2) / (m1 + m2);
              var v2n = ((1 + e) * m1 * u1 + (m2 - e * m1) * u2) / (m1 + m2);
              c1.v = v1n; c2.v = v2n;
              lastDK = Kb - (0.5 * m1 * v1n * v1n + 0.5 * m2 * v2n * v2n);
              var overlap = -gap + 0.001;
              c1.x -= overlap / 2; c2.x += overlap / 2;
            }
            t += dt;
            env.plot.push(t, { v1: c1.v, v2: c2.v });
          }
          var p = c1.m * c1.v + c2.m * c2.v;
          var Ktot = 0.5 * c1.m * c1.v * c1.v + 0.5 * c2.m * c2.v * c2.v;
          env.setReadout("p", p); env.setReadout("K", Ktot); env.setReadout("dk", lastDK);
          var e = env.params.e, rc = e >= 0.98 ? C.teal : (e <= 0.02 ? C.red : C.amber);
          roTxt("reg", regimen(e), rc);
        },
        draw: function (ctx, W, H) {
          var g = layout();
          // riel + topes
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(g.SX(0), g.railY); ctx.lineTo(g.SX(L), g.railY); ctx.stroke();
          ctx.fillStyle = C.dim;
          ctx.fillRect(g.SX(0) - 4, g.railY - 30, 4, 30);
          ctx.fillRect(g.SX(L), g.railY - 30, 4, 30);
          // centro de masa
          var xcm = (c1.m * c1.x + c2.m * c2.x) / (c1.m + c2.m);
          ctx.fillStyle = C.amber;
          ctx.beginPath();
          ctx.moveTo(g.SX(xcm), g.railY + 8);
          ctx.lineTo(g.SX(xcm) - 5, g.railY + 18);
          ctx.lineTo(g.SX(xcm) + 5, g.railY + 18);
          ctx.closePath(); ctx.fill();
          label(ctx, "cm", g.SX(xcm), g.railY + 30, C.amber, MONO_SM, "center");

          drawCart(ctx, c1, g, C.coral, "m₁");
          drawCart(ctx, c2, g, C.blue, "m₂");
          if (held) label(ctx, "· soltá para chocar ·", W / 2, 18, C.dim, MONO_SM, "center", "top");
        }
      };
    }
  });

  /* ============================================================
     SIM 3 — Rodadura en plano inclinado
     Handle: el vértice de la rampa (arrastrás el ángulo).
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "rodadura",
    title: "Rodadura en plano inclinado",
    refs: "Teórica p.28–30 · Práctica g.6",
    blurb: "Aro, disco y esfera compiten cuesta abajo. Arrastrá el vértice de la rampa para cambiar el ángulo; el slider de μₛ marca cuándo ruedan sin deslizar y cuándo patinan.",
    formula: "a = g·senθ / (1 + I/mR²)   ·   rueda sin deslizar si tanθ ≤ μₛ·(1+I/mR²)/(I/mR²)   ·   c=I/mR²: aro 1, disco ½, esfera ⅖",
    stageHeight: 360,
    controls: [
      { type: "range", key: "ang", label: "ángulo θ", min: 5, max: 40, step: 1, value: 22, unit: "°", digits: 0 },
      { type: "range", key: "mu", label: "μₛ", min: 0, max: 1, step: 0.02, value: 0.30, digits: 2 }
    ],
    readouts: [
      { key: "aA", label: "a aro", unit: "m/s²", digits: 2 },
      { key: "aD", label: "a disco", unit: "m/s²", digits: 2 },
      { key: "aE", label: "a esfera", unit: "m/s²", digits: 2 },
      { key: "lider", label: "Líder" }
    ],
    plot: {
      window: 4, xLabel: "t (s)", yLabel: "v (m/s)",
      series: [
        { key: "aro", label: "aro", color: C.amber },
        { key: "disco", label: "disco", color: C.blue },
        { key: "esfera", label: "esfera", color: C.coral }
      ]
    },
    create: function (env) {
      var Lworld = 6, R = 0.28;
      var sl = bindSliders(env, ["ang", "mu"]);
      var roTxt = bindText(env, ["aA", "aD", "aE", "lider"]);
      var bodies, t, doneT;

      function make() {
        return [
          { name: "aro", label: "Aro", c: 1.0, color: C.amber, s: 0, v: 0, om: 0, phi: 0, slip: false, a: 0 },
          { name: "disco", label: "Disco", c: 0.5, color: C.blue, s: 0, v: 0, om: 0, phi: 0, slip: false, a: 0 },
          { name: "esfera", label: "Esfera", c: 0.4, color: C.coral, s: 0, v: 0, om: 0, phi: 0, slip: false, a: 0 }
        ];
      }
      function reset() { bodies = make(); t = 0; doneT = 0; env.plot.clear(); }

      function layout() {
        var W = env.W, H = env.H;
        var lx = 54, baseY = H - 42;
        var aw = W - lx - 40, ah = H - 90;
        var th = env.params.ang * Math.PI / 180;
        var run, rise;
        if (aw * Math.tan(th) <= ah) { run = aw; rise = aw * Math.tan(th); }
        else { rise = ah; run = ah / Math.tan(th); }
        return {
          lx: lx, baseY: baseY, aw: aw, ah: ah, th: th, run: run, rise: rise,
          Ptx: lx, Pty: baseY - rise, Pbx: lx + run, Pby: baseY
        };
      }

      // handle: vértice superior de la rampa
      env.addHandle({
        r: 16,
        x: function () { return layout().Ptx; },
        y: function () { return layout().Pty; },
        onDrag: function (px, py) {
          var g = layout();
          var th = Math.atan2(clamp(g.baseY - py, 0, g.ah), g.aw) * 180 / Math.PI;
          sl.set("ang", clamp(th, 5, 40));
        }
      });

      function dyn(b, th, mu) {
        var sT = Math.sin(th), cT = Math.cos(th), tT = Math.tan(th);
        var rolls = (mu <= 0) ? false : (tT <= mu * (1 + b.c) / b.c);
        if (rolls) { var a = G * sT / (1 + b.c); return { a: a, alpha: a / R, slip: false }; }
        var a2 = G * (sT - mu * cT); if (a2 < 0) a2 = 0;
        return { a: a2, alpha: mu * G * cT / (b.c * R), slip: true };
      }

      return {
        reset: reset,
        onControl: function (key) { if (key === "ang") reset(); },
        step: function (dt) {
          var th = env.params.ang * Math.PI / 180, mu = env.params.mu;
          var allDone = true;
          bodies.forEach(function (b) {
            var d = dyn(b, th, mu); b.a = d.a; b.slip = d.slip;
            if (b.s < Lworld) {
              allDone = false;
              b.v += d.a * dt; b.om += d.alpha * dt; b.s += b.v * dt; b.phi += b.om * dt;
              if (b.s >= Lworld) b.s = Lworld;
            }
          });
          t += dt;
          env.plot.push(t, { aro: bodies[0].v, disco: bodies[1].v, esfera: bodies[2].v });
          env.setReadout("aA", bodies[0].a); env.setReadout("aD", bodies[1].a); env.setReadout("aE", bodies[2].a);
          var lead = bodies[0];
          bodies.forEach(function (b) {
            if (b.s > lead.s + 1e-4 || (Math.abs(b.s - lead.s) < 1e-4 && b.a > lead.a)) lead = b;
          });
          roTxt("lider", lead.s > 0.01 ? lead.label : "—", lead.s > 0.01 ? lead.color : C.dim);
          if (allDone) { doneT += dt; if (doneT > 1.0) reset(); }
        },
        draw: function (ctx, W, H) {
          var g = layout();
          var len = Math.sqrt(g.run * g.run + g.rise * g.rise);
          var ux = g.run / len, uy = g.rise / len;
          var nx = uy, ny = -ux;
          var Rpx = Math.max(11, Math.min(20, len * 0.032));

          ctx.fillStyle = "rgba(255,255,255,0.05)";
          ctx.beginPath();
          ctx.moveTo(g.Ptx, g.Pty); ctx.lineTo(g.Pbx, g.Pby); ctx.lineTo(g.Ptx, g.Pby); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(g.Ptx, g.Pty); ctx.lineTo(g.Pbx, g.Pby); ctx.stroke();
          ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(g.Ptx, g.Pby); ctx.lineTo(g.Pbx, g.Pby); ctx.stroke();

          ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(g.Pbx, g.Pby, 26, Math.PI, Math.PI + g.th); ctx.stroke();
          label(ctx, env.params.ang.toFixed(0) + "°", g.Pbx - 34, g.Pby - 6, C.dim, MONO_SM, "right");
          label(ctx, "μₛ=" + env.params.mu.toFixed(2), g.lx, 18, C.dim, MONO, "left", "top");

          bodies.forEach(function (b) {
            var f = b.s / Lworld;
            var cx = g.Ptx + (g.Pbx - g.Ptx) * f + nx * Rpx;
            var cy = g.Pty + (g.Pby - g.Pty) * f + ny * Rpx;
            var outline = b.slip ? C.red : b.color;
            ctx.beginPath(); ctx.arc(cx, cy, Rpx, 0, Math.PI * 2);
            if (b.name === "aro") { ctx.strokeStyle = outline; ctx.lineWidth = 3.5; ctx.stroke(); }
            else {
              ctx.fillStyle = b.name === "disco" ? "rgba(146,207,242,0.28)" : "rgba(244,124,89,0.30)"; ctx.fill();
              ctx.strokeStyle = outline; ctx.lineWidth = 2.4; ctx.stroke();
            }
            var ph = b.phi;
            ctx.strokeStyle = outline; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Rpx * Math.cos(ph), cy + Rpx * Math.sin(ph)); ctx.stroke();
            disc(ctx, cx + Rpx * Math.cos(ph), cy + Rpx * Math.sin(ph), 2.5, outline);
            label(ctx, b.label + (b.slip ? " · patina" : ""), cx + nx * (Rpx + 4), cy + ny * (Rpx + 4),
              b.slip ? C.red : b.color, MONO_SM, "center");
          });
        }
      };
    }
  });

  /* ============================================================
     SIM 4 — Curva peraltada
     Handles: el auto sobre la banda de velocidades (v) + el
     extremo de la calzada (ángulo de peralte).
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "peralte",
    title: "Curva peraltada",
    refs: "Teórica p.9 · Práctica g.2",
    blurb: "Auto en una curva peraltada, en corte frontal. Arrastrá el auto sobre la banda para elegir la velocidad, y el extremo de la calzada para inclinar el peralte. Fuera de [v_mín, v_máx] derrapa.",
    formula: "v_máx = √(gR·(tanθ+μₛ)/(1−μₛ·tanθ))   ·   v_mín = √(gR·(tanθ−μₛ)/(1+μₛ·tanθ))   ·   v_ópt = √(gR·tanθ)",
    stageHeight: 380,
    controls: [
      { type: "range", key: "v", label: "v", min: 0, max: 40, step: 1, value: 20, unit: "m/s", digits: 0 },
      { type: "range", key: "R", label: "radio R", min: 20, max: 200, step: 5, value: 80, unit: "m", digits: 0 },
      { type: "range", key: "th", label: "peralte θ", min: 0, max: 45, step: 1, value: 18, unit: "°", digits: 0 },
      { type: "range", key: "mu", label: "μₛ", min: 0, max: 1, step: 0.02, value: 0.35, digits: 2 }
    ],
    readouts: [
      { key: "vmin", label: "v mín", unit: "m/s", digits: 1 },
      { key: "vmax", label: "v máx", unit: "m/s", digits: 1 },
      { key: "vopt", label: "v ópt", unit: "m/s", digits: 1 },
      { key: "est", label: "Estado" }
    ],
    create: function (env) {
      var sl = bindSliders(env, ["v", "R", "th", "mu"]);
      var roTxt = bindText(env, ["vmin", "vmax", "vopt", "est"]);
      var slidePos, slideVel, phase, state;

      function reset() { slidePos = 0; slideVel = 0; phase = 0; state = 0; }

      function limits() {
        var th = env.params.th * Math.PI / 180, mu = env.params.mu, R = env.params.R;
        var tT = Math.tan(th);
        var inner = (tT - mu) / (1 + mu * tT);
        var vmin = inner > 0 ? Math.sqrt(G * R * inner) : 0;
        var denom = 1 - mu * tT;
        var vmax = denom > 0 ? Math.sqrt(G * R * (tT + mu) / denom) : Infinity;
        return { vmin: vmin, vmax: vmax, vopt: Math.sqrt(G * R * tT) };
      }
      function bandGeom() {
        var W = env.W, H = env.H, Lm = limits(), v = env.params.v;
        var by = H - 26, bx0 = 40, bx1 = W - 40, bw = bx1 - bx0;
        var vScale = Math.max(v * 1.15, isFinite(Lm.vmax) ? Lm.vmax * 1.2 : 45, 30);
        return {
          by: by, bx0: bx0, bx1: bx1, bw: bw, vScale: vScale, lim: Lm,
          BX: function (vv) { return bx0 + clamp(vv / vScale, 0, 1) * bw; },
          invV: function (px) { return clamp((px - bx0) / bw, 0, 1) * vScale; }
        };
      }
      function roadGeom() {
        var W = env.W, H = env.H;
        var th = env.params.th * Math.PI / 180;
        var cx = W * 0.46, cy = H * 0.50, roadLen = Math.min(W * 0.34, 190);
        var ux = Math.cos(th), uy = -Math.sin(th);
        return { cx: cx, cy: cy, roadLen: roadLen, ux: ux, uy: uy, th: th, ax1: cx + ux * roadLen, ay1: cy + uy * roadLen };
      }

      // handle: auto sobre la banda de v
      env.addHandle({
        r: 14,
        x: function () { var g = bandGeom(); return g.BX(env.params.v); },
        y: function () { return bandGeom().by; },
        onDrag: function (px) { sl.set("v", bandGeom().invV(px)); }
      });
      // handle: extremo superior de la calzada -> ángulo
      env.addHandle({
        r: 14,
        x: function () { return roadGeom().ax1; },
        y: function () { return roadGeom().ay1; },
        onDrag: function (px, py) {
          var g = roadGeom();
          var th = Math.atan2(g.cy - py, Math.max(px - g.cx, 4)) * 180 / Math.PI;
          sl.set("th", clamp(th, 0, 45));
        }
      });

      return {
        reset: reset,
        step: function (dt) {
          var Lm = limits(), v = env.params.v, R = env.params.R;
          state = v < Lm.vmin ? -1 : (v > Lm.vmax ? 1 : 0);
          if (state === 0) { slidePos *= 0.86; slideVel *= 0.6; }
          else { slideVel += state * 70 * dt; slidePos += slideVel * dt; if (Math.abs(slidePos) > 120) { slidePos = 0; slideVel = 0; } }
          phase += (v / Math.max(R, 1)) * dt;
          env.setReadout("vmin", Lm.vmin); env.setReadout("vopt", Lm.vopt);
          if (isFinite(Lm.vmax)) env.setReadout("vmax", Lm.vmax); else roTxt("vmax", "∞", C.dim);
          roTxt("est", state === 0 ? "AGARRA" : (state < 0 ? "DERRAPA ↓" : "DERRAPA ↑"),
            state === 0 ? C.teal : C.red);
        },
        draw: function (ctx, W, H) {
          var th = env.params.th * Math.PI / 180;
          var rg = roadGeom(), Lm = limits(), v = env.params.v;
          var stateCol = state === 0 ? C.teal : C.red;
          var cx = rg.cx, cy = rg.cy, roadLen = rg.roadLen, ux = rg.ux, uy = rg.uy;
          var nx = -Math.sin(th), ny = -Math.cos(th);

          var ax0 = cx - ux * roadLen, ay0 = cy - uy * roadLen;
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 8; ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(ax0, ay0); ctx.lineTo(rg.ax1, rg.ay1); ctx.stroke();
          ctx.lineCap = "butt";
          ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
          ctx.beginPath(); ctx.moveTo(cx - roadLen, cy); ctx.lineTo(cx + roadLen * 0.4, cy); ctx.stroke();
          ctx.setLineDash([]);
          label(ctx, env.params.th.toFixed(0) + "° peralte", cx - roadLen, cy + 18, C.dim, MONO_SM, "left");
          label(ctx, "← al centro (R=" + env.params.R.toFixed(0) + "m)", cx - roadLen, cy - roadLen * 0.5 - 6, C.dim, MONO_SM, "left");

          var carX = cx + ux * slidePos, carY = cy + uy * slidePos;
          var carCx = carX + nx * 12, carCy = carY + ny * 12;
          ctx.save();
          ctx.translate(carX + nx * 6, carY + ny * 6);
          ctx.rotate(Math.atan2(uy, ux));
          ctx.fillStyle = stateCol; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.rect(-16, -12, 32, 12); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.rect(-9, -19, 18, 8); ctx.fill(); ctx.stroke();
          ctx.fillStyle = C.ink; disc(ctx, -9, 0, 3.5, C.ink); disc(ctx, 9, 0, 3.5, C.ink);
          ctx.restore();

          var base = 62;
          var Nmag = (v * v / env.params.R * Math.sin(th) + G * Math.cos(th)) / G;
          var fReq = ((v * v / env.params.R) * Math.cos(th) - G * Math.sin(th)) / G;
          var muN = env.params.mu * Nmag;
          arrow(ctx, carCx, carCy, carCx + nx * base * Nmag, carCy + ny * base * Nmag, C.blue, 2.4);
          label(ctx, "N", carCx + nx * base * Nmag, carCy + ny * base * Nmag - 4, C.blue, MONO_SM, "center");
          arrow(ctx, carCx, carCy, carCx, carCy + base, C.amber, 2.4);
          label(ctx, "mg", carCx + 8, carCy + base, C.amber, MONO_SM, "left");
          var fdirx = fReq >= 0 ? -ux : ux, fdiry = fReq >= 0 ? -uy : uy;
          var flen = base * Math.min(Math.abs(fReq), muN);
          arrow(ctx, carCx, carCy, carCx + fdirx * flen, carCy + fdiry * flen, stateCol, 2.6);
          label(ctx, "f", carCx + fdirx * flen - fdirx * 8, carCy + fdiry * flen - 10, stateCol, MONO_SM, "center");
          ctx.setLineDash([3, 3]); ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(carCx, carCy); ctx.lineTo(carCx + fdirx * base * muN, carCy + fdiry * base * muN); ctx.stroke();
          ctx.setLineDash([]);

          // vista superior (inset)
          var ix = W - 62, iy = 56, ir = 34;
          disc(ctx, ix, iy, ir, null, C.grid, 8);
          disc(ctx, ix, iy, ir, null, "rgba(255,255,255,0.12)", 1);
          disc(ctx, ix + ir * Math.cos(phase), iy + ir * Math.sin(phase), 4, stateCol);
          label(ctx, "planta", ix, iy + ir + 14, C.dim, MONO_SM, "center");

          // banda-medidor v (con handle)
          var bg = bandGeom();
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 6; ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(bg.bx0, bg.by); ctx.lineTo(bg.bx1, bg.by); ctx.stroke();
          var segHi = isFinite(Lm.vmax) ? Lm.vmax : bg.vScale;
          ctx.strokeStyle = C.teal; ctx.lineWidth = 6;
          ctx.beginPath(); ctx.moveTo(bg.BX(Lm.vmin), bg.by); ctx.lineTo(bg.BX(segHi), bg.by); ctx.stroke();
          ctx.lineCap = "butt";
          ctx.strokeStyle = C.amber; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(bg.BX(Lm.vopt), bg.by - 8); ctx.lineTo(bg.BX(Lm.vopt), bg.by + 8); ctx.stroke();
          label(ctx, "v_ópt", bg.BX(Lm.vopt), bg.by - 11, C.amber, MONO_SM, "center");
          disc(ctx, bg.BX(v), bg.by, 6, stateCol, C.ink, 1.5);
          label(ctx, "v=" + v.toFixed(0), bg.BX(v), bg.by + 18, stateCol, MONO_SM, "center");
          label(ctx, "v_mín " + Lm.vmin.toFixed(1), bg.bx0, bg.by - 12, C.dim, MONO_SM, "left");
          label(ctx, "v_máx " + (isFinite(Lm.vmax) ? Lm.vmax.toFixed(1) : "∞"), bg.bx1, bg.by - 12, C.dim, MONO_SM, "right");
        }
      };
    }
  });

  /* ============================================================
     SIM 5 — Venturi / Bernoulli
     Handle: la pared de la garganta (diámetro d₂).
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "venturi",
    title: "Venturi / Bernoulli",
    refs: "Teórica p.38–39 · Práctica g.8",
    blurb: "Fluido ideal por un tubo con estrechamiento. Arrastrá la pared de la garganta para angostarla: donde se estrecha va más rápido y baja la presión, y los tubos manométricos lo muestran.",
    formula: "A₁v₁ = A₂v₂   ·   P₁+½ρv₁² = P₂+½ρv₂²   ·   Δp = ½ρ(v₂²−v₁²)   (ρ=1000 kg/m³)",
    stageHeight: 360,
    controls: [
      { type: "range", key: "Q", label: "caudal Q", min: 0.5, max: 8, step: 0.1, value: 3, unit: "L/s", digits: 1 },
      { type: "range", key: "d1", label: "diámetro ancho d₁", min: 4, max: 16, step: 0.5, value: 10, unit: "cm", digits: 1 },
      { type: "range", key: "d2", label: "diámetro angosto d₂", min: 1, max: 10, step: 0.5, value: 4, unit: "cm", digits: 1 }
    ],
    readouts: [
      { key: "v1", label: "v ancho", unit: "m/s", digits: 2 },
      { key: "v2", label: "v angosto", unit: "m/s", digits: 2 },
      { key: "dp", label: "Δp", unit: "Pa", digits: 0 },
      { key: "dh", label: "Δh", unit: "cm", digits: 1 }
    ],
    create: function (env) {
      var RHO = 1000, N = 64, Ltube = 0.6;
      var sl = bindSliders(env, ["Q", "d1", "d2"]);
      var parts = [];

      function d1() { return env.params.d1 / 100; }
      function d2() { return Math.min(env.params.d2, env.params.d1) / 100; }
      function Q() { return env.params.Q / 1000; }
      function dAt(f) { var g = Math.exp(-Math.pow((f - 0.5) / 0.16, 2)); return d1() + (d2() - d1()) * g; }
      function areaOfD(d) { return Math.PI * (d / 2) * (d / 2); }
      function vAt(f) { return Q() / areaOfD(dAt(f)); }

      function vgeom() {
        var W = env.W, H = env.H, ml = 30, mr = 30;
        var tubeW = W - ml - mr, axisY = H * 0.66;
        var rScale = Math.min(120 / d1(), tubeW * 1.1);
        return { ml: ml, tubeW: tubeW, axisY: axisY, rScale: rScale, SX: function (f) { return ml + f * tubeW; } };
      }
      function reset() {
        parts = [];
        for (var i = 0; i < N; i++) parts.push({ x: Math.random(), lat: (Math.random() * 2 - 1) * 0.8 });
      }

      // handle: pared superior de la garganta (fija d₂)
      env.addHandle({
        r: 14,
        x: function () { return vgeom().SX(0.5); },
        y: function () { var g = vgeom(); return g.axisY - (d2() / 2) * g.rScale; },
        onDrag: function (px, py) {
          var g = vgeom();
          var d2cm = (g.axisY - py) * 2 / g.rScale * 100;
          sl.set("d2", clamp(d2cm, 1, Math.min(10, env.params.d1)));
        }
      });

      return {
        reset: reset,
        step: function (dt) {
          for (var i = 0; i < parts.length; i++) {
            var p = parts[i];
            p.x += (vAt(p.x) * dt) / Ltube;
            if (p.x > 1) { p.x -= 1; p.lat = (Math.random() * 2 - 1) * 0.85; }
          }
          var A1 = areaOfD(d1()), A2 = areaOfD(d2());
          var v1 = Q() / A1, v2 = Q() / A2, dp = 0.5 * RHO * (v2 * v2 - v1 * v1);
          env.setReadout("v1", v1); env.setReadout("v2", v2);
          env.setReadout("dp", dp); env.setReadout("dh", dp / (RHO * G) * 100);
        },
        draw: function (ctx, W, H) {
          var g = vgeom(), axisY = g.axisY;
          function rpx(f) { return dAt(f) / 2 * g.rScale; }
          var SX = g.SX;

          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 2;
          ctx.beginPath(); for (var f = 0; f <= 1.0001; f += 0.02) ctx.lineTo(SX(f), axisY - rpx(f)); ctx.stroke();
          ctx.beginPath(); for (var f2 = 0; f2 <= 1.0001; f2 += 0.02) ctx.lineTo(SX(f2), axisY + rpx(f2)); ctx.stroke();
          ctx.fillStyle = "rgba(146,207,242,0.07)";
          ctx.beginPath();
          for (var fa = 0; fa <= 1.0001; fa += 0.02) ctx.lineTo(SX(fa), axisY - rpx(fa));
          for (var fb = 1; fb >= -0.0001; fb -= 0.02) ctx.lineTo(SX(fb), axisY + rpx(fb));
          ctx.closePath(); ctx.fill();

          for (var i = 0; i < parts.length; i++) {
            var p = parts[i], r = rpx(p.x) * 0.9, px = SX(p.x), py = axisY + p.lat * r;
            var speedN = clamp(vAt(p.x) / 6, 0.15, 1);
            ctx.strokeStyle = "rgba(146,207,242," + (0.35 + 0.6 * speedN) + ")"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - (4 + 10 * speedN), py); ctx.stroke();
          }

          var A1 = areaOfD(d1()), A2 = areaOfD(d2()), v1 = Q() / A1;
          var stations = [{ f: 0.15, tag: "P₁" }, { f: 0.5, tag: "P₂" }, { f: 0.85, tag: "P₁" }];
          function head(f) { var vv = vAt(f); return (v1 * v1 - vv * vv) / (2 * G); }
          var hThroat = head(0.5), maxCol = axisY - 44, baseCol = 0.62 * maxCol, minCol = 10, span = baseCol - minCol;
          var colScale = Math.min(170, span / Math.max(-hThroat, 1e-4));
          function colH(f) { return clamp(baseCol + head(f) * colScale, minCol, maxCol); }

          stations.forEach(function (st) {
            var sx = SX(st.f), topTube = axisY - rpx(st.f), ch = colH(st.f), tubeTopY = topTube - ch;
            ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 1.5;
            ctx.strokeRect(sx - 5, tubeTopY, 10, ch + rpx(st.f));
            ctx.fillStyle = "rgba(146,207,242,0.55)"; ctx.fillRect(sx - 4, tubeTopY, 8, ch + rpx(st.f));
            ctx.fillStyle = C.blue; ctx.fillRect(sx - 4, tubeTopY, 8, 3);
            label(ctx, st.tag, sx, tubeTopY - 6, C.blue, MONO_SM, "center");
          });

          ctx.strokeStyle = "rgba(216,178,121,0.7)"; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
          ctx.beginPath();
          for (var fh = 0.06; fh <= 0.95; fh += 0.02) {
            var yy = (axisY - rpx(fh)) - colH(fh);
            if (fh <= 0.06 + 1e-9) ctx.moveTo(SX(fh), yy); else ctx.lineTo(SX(fh), yy);
          }
          ctx.stroke(); ctx.setLineDash([]);
          label(ctx, "línea piezométrica", SX(0.06), (axisY - rpx(0.06)) - colH(0.06) - 8, C.amber, MONO_SM, "left");

          var v2 = Q() / A2;
          label(ctx, "v₁=" + v1.toFixed(2) + " m/s", SX(0.15), axisY + rpx(0.15) + 16, C.dim, MONO_SM, "center");
          label(ctx, "v₂=" + v2.toFixed(2) + " m/s", SX(0.5), axisY + rpx(0.5) + 16, C.coral, MONO_SM, "center");
          arrow(ctx, g.ml + 6, axisY, g.ml + 26, axisY, C.dim, 1.5);
          label(ctx, "flujo →", g.ml + 30, axisY - 8, C.dim, MONO_SM, "left");
        }
      };
    }
  });

  /* ============================================================
     SIM 6 — Cinemática 1D (núcleo del curso)
     Handles: la partícula (x₀) y la punta de su flecha (v₀).
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "cinematica",
    title: "Cinemática 1D",
    refs: "Teórica p.2–4 · Práctica g.1 (1.8–1.13)",
    blurb: "Partícula en una pista horizontal: elegís la forma de la aceleración —constante, a=−k·v (arrastre) o a=−k·x (tipo resorte)— y arrastrás la partícula y su flecha para fijar x₀ y v₀. Las curvas x(t) y v(t) se dibujan solas.",
    formula: "a = dv/dt = d²x/dt²   ·   v = v₀ + ∫a·dt   ·   casos: a=cte, a=−k·v, a=−k·x",
    stageHeight: 200,
    controls: [
      {
        type: "segment", key: "mode", label: "forma de a", value: "const",
        options: [["const", "a = cte"], ["damp", "a = −k·v"], ["spring", "a = −k·x"]]
      },
      { type: "range", key: "coef", label: "coeficiente", min: -4, max: 4, step: 0.1, value: 2, digits: 1 },
      { type: "range", key: "x0", label: "x₀", min: -5, max: 5, step: 0.1, value: -3, unit: "m", digits: 1 },
      { type: "range", key: "v0", label: "v₀", min: -6, max: 6, step: 0.2, value: 2, unit: "m/s", digits: 1 }
    ],
    readouts: [
      { key: "x", label: "x", unit: "m", digits: 2 },
      { key: "v", label: "v", unit: "m/s", digits: 2 },
      { key: "a", label: "a", unit: "m/s²", digits: 2 },
      { key: "reg", label: "Régimen" }
    ],
    plot: {
      window: 8, xLabel: "t (s)", yLabel: "x, v",
      series: [{ key: "x", label: "x (m)", color: C.coral }, { key: "v", label: "v (m/s)", color: C.blue }]
    },
    create: function (env) {
      var XW = 6, VS = 15;
      var sl = bindSliders(env, ["coef", "x0", "v0"]);
      var roTxt = bindText(env, ["x", "v", "a", "reg"]);
      var x, v, t, held = false;

      function accel() {
        var m = env.params.mode, c = env.params.coef;
        if (m === "damp") return -Math.abs(c) * v;
        if (m === "spring") return -Math.abs(c) * x;
        return c;
      }
      function reset() { x = env.params.x0; v = env.params.v0; t = 0; env.plot.clear(); }
      function layout() {
        var W = env.W, H = env.H, ml = 34, mr = 34;
        var trackY = H * 0.52, sc = (W - ml - mr) / (2 * XW);
        return { ml: ml, trackY: trackY, sc: sc, SX: function (wx) { return ml + (wx + XW) * sc; }, invX: function (px) { return (px - ml) / sc - XW; } };
      }
      function regLabel() {
        var m = env.params.mode;
        return m === "damp" ? "arrastre a=−kv" : (m === "spring" ? "oscilador a=−kx" : "a = cte");
      }
      function push() {
        var m = env.params.mode;
        env.setReadout("x", x); env.setReadout("v", v); env.setReadout("a", accel());
        roTxt("reg", regLabel(), m === "damp" ? C.blue : (m === "spring" ? C.teal : C.amber));
      }

      env.addHandle({
        r: 16,
        x: function () { return layout().SX(x); },
        y: function () { return layout().trackY; },
        onStart: function () { held = true; },
        onDrag: function (px) { sl.set("x0", clamp(layout().invX(px), -XW + 0.2, XW - 0.2)); reset(); },
        onEnd: function () { held = false; }
      });
      env.addHandle({
        r: 13,
        x: function () { var g = layout(); return g.SX(x) + v * VS; },
        y: function () { return layout().trackY; },
        onStart: function () { held = true; },
        onDrag: function (px) { var g = layout(); sl.set("v0", (px - g.SX(x)) / VS); },
        onEnd: function () { held = false; }
      });

      return {
        reset: reset,
        onControl: function () { reset(); },
        step: function (dt) {
          if (held) { push(); return; }
          v += accel() * dt; x += v * dt; t += dt;
          if (x < -XW || x > XW) { reset(); return; }
          env.plot.push(t, { x: x, v: v });
          push();
        },
        draw: function (ctx, W, H) {
          var g = layout(), ty = g.trackY;
          K.grid(ctx, W, H, 40);
          // pista + ticks cada 1 m
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(g.SX(-XW), ty); ctx.lineTo(g.SX(XW), ty); ctx.stroke();
          for (var m = -XW; m <= XW; m++) {
            var big = (m % 2 === 0);
            ctx.strokeStyle = big ? C.dim : C.grid; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(g.SX(m), ty - (big ? 6 : 3)); ctx.lineTo(g.SX(m), ty + (big ? 6 : 3)); ctx.stroke();
            if (big) label(ctx, m + "", g.SX(m), ty + 18, C.dim, MONO_SM, "center");
          }
          // equilibrio (solo modo resorte)
          if (env.params.mode === "spring") {
            ctx.strokeStyle = C.teal; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(g.SX(0), ty - 34); ctx.lineTo(g.SX(0), ty + 24); ctx.stroke(); ctx.setLineDash([]);
            label(ctx, "x=0", g.SX(0) + 4, ty - 34, C.teal, MONO_SM, "left", "top");
          }
          // partícula + vectores
          var px = g.SX(x);
          var a = accel();
          arrow(ctx, px, ty - 22, px + a * 8, ty - 22, C.red, 2.2);
          label(ctx, "a", px + a * 8 + (a >= 0 ? 5 : -5), ty - 26, C.red, MONO_SM, a >= 0 ? "left" : "right");
          arrow(ctx, px, ty, px + v * VS, ty, C.blue, 2.4);
          label(ctx, "v", px + v * VS + (v >= 0 ? 6 : -6), ty - 6, C.blue, MONO_SM, v >= 0 ? "left" : "right");
          disc(ctx, px, ty, 8, C.coral, C.ink, 1.5);
          if (held) label(ctx, "· soltá para arrancar ·", W / 2, 16, C.dim, MONO_SM, "center", "top");
        }
      };
    }
  });

  /* ============================================================
     SIM 7 — Máquina de Atwood
     Handles: cada masa (reposición vertical).
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "atwood",
    title: "Máquina de Atwood",
    refs: "Teórica p.7 · Práctica g.2 (2.1–2.7)",
    blurb: "Dos masas colgadas de una polea ideal por una cuerda inextensible. La más pesada baja; arrastrás cualquier masa para reposicionarla y soltás. La aceleración y la tensión salen en vivo.",
    formula: "a = (m₁−m₂)·g/(m₁+m₂)   ·   T = 2·m₁·m₂·g/(m₁+m₂)",
    stageHeight: 340,
    controls: [
      { type: "range", key: "m1", label: "m₁ (izq)", min: 0.2, max: 5, step: 0.1, value: 2, unit: "kg", digits: 1 },
      { type: "range", key: "m2", label: "m₂ (der)", min: 0.2, max: 5, step: 0.1, value: 3, unit: "kg", digits: 1 }
    ],
    readouts: [
      { key: "a", label: "a", unit: "m/s²", digits: 2 },
      { key: "T", label: "tensión T", unit: "N", digits: 1 },
      { key: "v", label: "v cuerda", unit: "m/s", digits: 2 },
      { key: "heavy", label: "Baja" }
    ],
    plot: {
      window: 6, xLabel: "t (s)", yLabel: "v (m/s)",
      series: [{ key: "v", label: "v (m₁↓ +)", color: C.coral }]
    },
    create: function (env) {
      var ROPE = 4, HMIN = 0.5, HMAX = ROPE - 0.5;
      var roTxt = bindText(env, ["a", "T", "v", "heavy"]);
      var h1, v, t, doneT, held = false;

      function layout() {
        var W = env.W, H = env.H;
        var pulleyX = W * 0.5, pulleyY = 46, floorY = H - 26;
        var pxPerM = (floorY - pulleyY) / (ROPE + 0.4);
        return { pulleyX: pulleyX, pulleyY: pulleyY, floorY: floorY, pxPerM: pxPerM };
      }
      function boxSide(m) { return clamp(20 + m * 6, 22, 50); }
      function reset() { h1 = ROPE / 2; v = 0; t = 0; doneT = 0; env.plot.clear(); }

      // handle masa 1 (izq): arrastre vertical => h1
      env.addHandle({
        r: 24,
        x: function () { var g = layout(); return g.pulleyX - 46; },
        y: function () { var g = layout(); return g.pulleyY + h1 * g.pxPerM; },
        onStart: function () { held = true; v = 0; },
        onDrag: function (px, py) { var g = layout(); h1 = clamp((py - g.pulleyY) / g.pxPerM, HMIN, HMAX); v = 0; },
        onEnd: function () { held = false; }
      });
      // handle masa 2 (der): arrastre vertical => h2 (=> h1 = ROPE-h2)
      env.addHandle({
        r: 24,
        x: function () { var g = layout(); return g.pulleyX + 46; },
        y: function () { var g = layout(); return g.pulleyY + (ROPE - h1) * g.pxPerM; },
        onStart: function () { held = true; v = 0; },
        onDrag: function (px, py) { var g = layout(); var h2 = clamp((py - g.pulleyY) / g.pxPerM, HMIN, HMAX); h1 = clamp(ROPE - h2, HMIN, HMAX); v = 0; },
        onEnd: function () { held = false; }
      });

      return {
        reset: reset,
        step: function (dt) {
          var m1 = env.params.m1, m2 = env.params.m2;
          var a = (m1 - m2) * G / (m1 + m2);
          if (!held) {
            v += a * dt; h1 += v * dt;
            if (h1 <= HMIN) { h1 = HMIN; v = 0; doneT += dt; }
            else if (h1 >= HMAX) { h1 = HMAX; v = 0; doneT += dt; }
            else doneT = 0;
            if (doneT > 1.2) reset();
            t += dt; env.plot.push(t, { v: v });
          }
          var T = 2 * m1 * m2 * G / (m1 + m2);
          env.setReadout("a", Math.abs(a)); env.setReadout("T", T); env.setReadout("v", v);
          roTxt("heavy", m1 > m2 ? "m₁ (izq)" : (m2 > m1 ? "m₂ (der)" : "equilibrio"),
            m1 > m2 ? C.coral : (m2 > m1 ? C.blue : C.dim));
        },
        draw: function (ctx, W, H) {
          var g = layout(), m1 = env.params.m1, m2 = env.params.m2;
          var a = (m1 - m2) * G / (m1 + m2);
          var y1 = g.pulleyY + h1 * g.pxPerM, y2 = g.pulleyY + (ROPE - h1) * g.pxPerM;
          var x1 = g.pulleyX - 46, x2 = g.pulleyX + 46;
          // soporte + polea
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(g.pulleyX - 60, 16); ctx.lineTo(g.pulleyX + 60, 16); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(g.pulleyX, 16); ctx.lineTo(g.pulleyX, g.pulleyY - 16); ctx.stroke();
          disc(ctx, g.pulleyX, g.pulleyY, 16, "rgba(255,255,255,0.06)", C.gridStrong, 3);
          disc(ctx, g.pulleyX, g.pulleyY, 3, C.dim);
          // cuerdas
          ctx.strokeStyle = C.dim; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x1, g.pulleyY); ctx.lineTo(x1, y1); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x2, g.pulleyY); ctx.lineTo(x2, y2); ctx.stroke();
          ctx.beginPath(); ctx.arc(g.pulleyX, g.pulleyY, 16, Math.PI, 0); ctx.stroke();
          // masas
          function box(cx, cy, m, color, name) {
            var s = boxSide(m);
            ctx.fillStyle = color; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
            roundRect(ctx, cx - s / 2, cy, s, s, 4); ctx.fill(); ctx.stroke();
            label(ctx, name, cx, cy + s / 2 + 4, C.ink, MONO_SM, "center");
            label(ctx, m.toFixed(1) + "kg", cx, cy - 6, color, MONO_SM, "center");
          }
          box(x1, y1, m1, C.coral, "m₁");
          box(x2, y2, m2, C.blue, "m₂");
          // flechas de aceleración (m1 baja si a>0)
          var aLen = clamp(Math.abs(a) * 6, 0, 40);
          if (aLen > 3) {
            arrow(ctx, x1, y1 + boxSide(m1) + 4, x1, y1 + boxSide(m1) + 4 + (a > 0 ? aLen : -aLen), C.amber, 2);
            arrow(ctx, x2, y2 + boxSide(m2) + 4, x2, y2 + boxSide(m2) + 4 + (a > 0 ? -aLen : aLen), C.amber, 2);
            label(ctx, "a", x1 + 8, y1 + boxSide(m1) + 20, C.amber, MONO_SM, "left");
          }
          if (held) label(ctx, "· soltá para largar ·", W / 2, 34, C.dim, MONO_SM, "center", "top");
        }
      };
    }
  });

  /* ============================================================
     SIM 8 — Resorte y energía
     Handle: la masa (estirás el resorte y soltás).
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "resorte",
    title: "Resorte y energía",
    refs: "Teórica p.11–12 · Práctica g.3 (3.5–3.10)",
    blurb: "Masa sobre resorte horizontal. Arrastrás la masa para estirar el resorte y soltás: la energía va y viene entre cinética K y elástica U, pero la suma se mantiene. Prendé el rozamiento para ver decaer E.",
    formula: "F = −k·x   ·   U = ½k·x²   ·   K = ½m·v²   ·   E = K + U = cte",
    stageHeight: 210,
    controls: [
      { type: "range", key: "k", label: "constante k", min: 5, max: 80, step: 1, value: 24, unit: "N/m", digits: 0 },
      { type: "range", key: "m", label: "masa m", min: 0.2, max: 4, step: 0.1, value: 1, unit: "kg", digits: 1 },
      { type: "toggle", key: "friction", label: "Rozamiento (ver decaer E)", value: false }
    ],
    readouts: [
      { key: "x", label: "elongación x", unit: "m", digits: 2 },
      { key: "K", label: "K", unit: "J", digits: 2 },
      { key: "U", label: "U elást", unit: "J", digits: 2 },
      { key: "E", label: "E total", unit: "J", digits: 2 }
    ],
    plot: {
      window: 8, xLabel: "t (s)", yLabel: "energía (J)",
      series: [
        { key: "K", label: "K", color: C.blue },
        { key: "U", label: "U", color: C.amber },
        { key: "E", label: "E", color: C.coral }
      ]
    },
    create: function (env) {
      var XMIN = -1.5, XMAX = 2.5;
      var x, v, t, held = false, E0 = 1;

      function layout() {
        var W = env.W, H = env.H;
        var wallX = 34, midY = H * 0.5;
        var sc = clamp((W - 260) / (XMAX - XMIN), 40, 130);
        var eqX = wallX + 70 + 1.5 * sc;   // deja el estirado casi hasta las barras
        return { wallX: wallX, midY: midY, sc: sc, eqX: eqX, barX0: W - 116, barX1: W - 30 };
      }
      function energyE() { return 0.5 * env.params.m * v * v + 0.5 * env.params.k * x * x; }
      function reset() { x = 1.5; v = 0; t = 0; E0 = energyE(); env.plot.clear(); }

      env.addHandle({
        r: 20,
        x: function () { var g = layout(); return g.eqX + x * g.sc; },
        y: function () { return layout().midY; },
        onStart: function () { held = true; v = 0; },
        onDrag: function (px) { var g = layout(); x = clamp((px - g.eqX) / g.sc, XMIN, XMAX); v = 0; },
        onEnd: function () { held = false; v = 0; E0 = energyE(); }
      });

      return {
        reset: reset,
        onControl: function () { E0 = energyE(); },
        step: function (dt) {
          var k = env.params.k, m = env.params.m;
          if (!held) {
            var a = -(k / m) * x;
            if (env.params.friction) a += -0.9 * v;
            v += a * dt; x += v * dt; t += dt;
            var K = 0.5 * m * v * v, U = 0.5 * k * x * x;
            env.plot.push(t, { K: K, U: U, E: K + U });
          }
          var K2 = 0.5 * m * v * v, U2 = 0.5 * k * x * x;
          env.setReadout("x", x); env.setReadout("K", K2); env.setReadout("U", U2); env.setReadout("E", K2 + U2);
        },
        draw: function (ctx, W, H) {
          var g = layout(), midY = g.midY, k = env.params.k, m = env.params.m;
          var massX = g.eqX + x * g.sc;
          drawWall(ctx, g.wallX, midY - 34, midY + 34, C.gridStrong, "left");
          // piso
          ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(g.wallX, midY + 20); ctx.lineTo(massX + 30, midY + 20); ctx.stroke();
          // equilibrio
          ctx.strokeStyle = C.teal; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
          ctx.beginPath(); ctx.moveTo(g.eqX, midY - 30); ctx.lineTo(g.eqX, midY + 24); ctx.stroke(); ctx.setLineDash([]);
          label(ctx, "x=0", g.eqX, midY + 34, C.teal, MONO_SM, "center");
          // resorte
          drawSpring(ctx, g.wallX, massX - 16, midY, 12, 8, C.dim, 2);
          // masa
          ctx.fillStyle = C.coral; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
          roundRect(ctx, massX - 16, midY - 16, 32, 32, 5); ctx.fill(); ctx.stroke();
          label(ctx, m.toFixed(1) + "kg", massX, midY + 4, C.ink, MONO_SM, "center");
          // vector velocidad
          arrow(ctx, massX, midY - 24, massX + v * 10, midY - 24, C.blue, 2);

          // barras de energía (escaladas a E0 => se ve decaer con rozamiento)
          var K = 0.5 * m * v * v, U = 0.5 * k * x * x, E = K + U;
          var barH = 70, barY0 = midY - 46, esc = Math.max(E0, 0.05);
          var bx = g.barX0;
          function bar(cx, val, color, name) {
            var h = clamp(val / esc, 0, 1) * barH;
            ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(cx, barY0, 22, barH);
            ctx.fillStyle = color; ctx.fillRect(cx, barY0 + barH - h, 22, h);
            label(ctx, name, cx + 11, barY0 + barH + 12, color, MONO_SM, "center");
            label(ctx, val.toFixed(1), cx + 11, barY0 - 4, color, MONO_SM, "center");
          }
          bar(bx, K, C.blue, "K");
          bar(bx + 30, U, C.amber, "U");
          // línea de E total de referencia
          ctx.strokeStyle = C.coral; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
          var eY = barY0 + barH - clamp(E / esc, 0, 1) * barH;
          ctx.beginPath(); ctx.moveTo(bx - 4, eY); ctx.lineTo(bx + 56, eY); ctx.stroke(); ctx.setLineDash([]);
          label(ctx, "E=" + E.toFixed(1) + "J", bx + 26, barY0 - 16, C.coral, MONO_SM, "center");
          if (held) label(ctx, "· estirá y soltá ·", massX, midY - 40, C.dim, MONO_SM, "center");
        }
      };
    }
  });

  /* ============================================================
     SIM 9 — Momento angular: barra con pivote
     Handle: la altura del punto de impacto d (a lo largo de la barra).
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "angular",
    title: "Momento angular: barra con pivote",
    refs: "Teórica p.31–32 · Práctica g.7 (7.3–7.8)",
    blurb: "Un proyectil impacta una barra que gira en su pivote y queda incrustado (choque plástico rotacional). Arrastrás la altura del impacto: el momento angular se conserva en el choque y fija la ω con que la barra sube.",
    formula: "L = m·v₀·d = (I_barra + m·d²)·ω   ·   I_barra = ⅓·M·L²   ·   ½Iω² = g·(1−cosθ)·(M·L/2 + m·d)",
    stageHeight: 340,
    controls: [
      { type: "range", key: "v0", label: "v₀ proyectil", min: 2, max: 20, step: 0.5, value: 10, unit: "m/s", digits: 1 },
      { type: "range", key: "m", label: "m proyectil", min: 0.05, max: 1, step: 0.05, value: 0.3, unit: "kg", digits: 2 },
      { type: "range", key: "M", label: "M barra", min: 0.5, max: 5, step: 0.1, value: 2, unit: "kg", digits: 1 },
      { type: "range", key: "d", label: "altura impacto d", min: 0.1, max: 1.2, step: 0.05, value: 0.9, unit: "m", digits: 2 }
    ],
    readouts: [
      { key: "Lb", label: "L antes", unit: "kg·m²/s", digits: 2 },
      { key: "La", label: "L después", unit: "kg·m²/s", digits: 2 },
      { key: "w", label: "ω resultante", unit: "rad/s", digits: 2 },
      { key: "thmax", label: "θ máx", unit: "°", digits: 0 }
    ],
    plot: {
      window: 6, xLabel: "t (s)", yLabel: "θ (°)",
      series: [{ key: "th", label: "θ", color: C.coral }]
    },
    create: function (env) {
      var LBAR = 1.2;
      var sl = bindSliders(env, ["v0", "m", "M", "d"]);
      var roTxt = bindText(env, ["Lb", "La", "w", "thmax"]);
      var phase, projX, theta, omega, Iafter, wRes, Lval, thmax, tt, phaseT;

      function layout() {
        var W = env.W, H = env.H;
        var pivotX = W * 0.44, pivotY = 46;
        var sc = (H - 96) / (LBAR * 1.15);
        return { pivotX: pivotX, pivotY: pivotY, sc: sc };
      }
      function predict() {
        var m = env.params.m, M = env.params.M, v0 = env.params.v0, d = env.params.d;
        Iafter = (1 / 3) * M * LBAR * LBAR + m * d * d;
        wRes = m * v0 * d / Iafter;
        Lval = m * v0 * d;
        var denom = G * (M * LBAR / 2 + m * d);
        var cosMax = 1 - 0.5 * Iafter * wRes * wRes / denom;
        thmax = cosMax <= -1 ? 361 : Math.acos(clamp(cosMax, -1, 1)) * 180 / Math.PI;
        env.setReadout("Lb", Lval); env.setReadout("La", Lval); env.setReadout("w", wRes);
        if (thmax > 360) roTxt("thmax", "gira ↻", C.coral); else env.setReadout("thmax", thmax);
      }
      function reset() { phase = "in"; projX = -1.5; theta = 0; omega = 0; tt = 0; phaseT = 0; predict(); env.plot.clear(); }

      // handle: punto de impacto a lo largo de la barra
      env.addHandle({
        r: 15,
        x: function () { var g = layout(); return g.pivotX + Math.sin(theta) * env.params.d * g.sc; },
        y: function () { var g = layout(); return g.pivotY + Math.cos(theta) * env.params.d * g.sc; },
        onDrag: function (px, py) {
          var g = layout();
          var d = Math.hypot(px - g.pivotX, py - g.pivotY) / g.sc;
          sl.set("d", clamp(d, 0.1, LBAR));
        }
      });

      return {
        reset: reset,
        onControl: function () { reset(); },
        step: function (dt) {
          var m = env.params.m, M = env.params.M, d = env.params.d;
          if (phase === "in") {
            projX += env.params.v0 * dt;
            if (projX >= 0) {
              Iafter = (1 / 3) * M * LBAR * LBAR + m * d * d;
              omega = m * env.params.v0 * d / Iafter;
              theta = 0; phase = "swing"; phaseT = 0; predict();
            }
          } else {
            var alpha = -(G * Math.sin(theta) * (M * LBAR / 2 + m * d)) / Iafter;
            omega += alpha * dt; theta += omega * dt; phaseT += dt;
            if (phaseT > 4) reset();
          }
          tt += dt;
          env.plot.push(tt, { th: theta * 180 / Math.PI });
        },
        draw: function (ctx, W, H) {
          var g = layout(), d = env.params.d;
          var dir = { x: Math.sin(theta), y: Math.cos(theta) };
          var ex = g.pivotX + dir.x * LBAR * g.sc, ey = g.pivotY + dir.y * LBAR * g.sc;
          // techo + pivote
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(g.pivotX - 40, g.pivotY - 16); ctx.lineTo(g.pivotX + 40, g.pivotY - 16); ctx.stroke();
          // arco de ángulo
          ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(g.pivotX, g.pivotY); ctx.lineTo(g.pivotX, g.pivotY + LBAR * g.sc); ctx.stroke();
          if (Math.abs(theta) > 0.02) {
            ctx.strokeStyle = C.dim;
            ctx.beginPath(); ctx.arc(g.pivotX, g.pivotY, 30, Math.PI / 2, Math.PI / 2 + theta, theta < 0); ctx.stroke();
          }
          // barra
          ctx.strokeStyle = C.amber; ctx.lineWidth = 6; ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(g.pivotX, g.pivotY); ctx.lineTo(ex, ey); ctx.stroke(); ctx.lineCap = "butt";
          disc(ctx, g.pivotX, g.pivotY, 5, C.dim, C.ink, 1.5);
          // proyectil / masa incrustada
          var ix = g.pivotX + dir.x * d * g.sc, iy = g.pivotY + dir.y * d * g.sc;
          if (phase === "in") {
            var px = g.pivotX + projX * g.sc, py = iy;
            arrow(ctx, px - 22, py, px, py, C.coral, 2);
            disc(ctx, px, py, 6, C.coral, C.ink, 1.5);
            // objetivo (donde pegará)
            ctx.strokeStyle = C.coral; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
            ctx.beginPath(); ctx.arc(ix, iy, 8, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
            label(ctx, "d=" + d.toFixed(2) + "m", ix + 12, iy, C.coral, MONO_SM, "left");
          } else {
            disc(ctx, ix, iy, 6, C.coral, C.ink, 1.5);
          }
          label(ctx, "pivote", g.pivotX + 8, g.pivotY - 4, C.dim, MONO_SM, "left");
          label(ctx, "L = m·v₀·d = " + Lval.toFixed(2), 12, 16, C.dim, MONO_SM, "left", "top");
          label(ctx, "θ = " + (theta * 180 / Math.PI).toFixed(0) + "°", 12, 30, C.coral, MONO_SM, "left", "top");
        }
      };
    }
  });

  /* ============================================================
     SIM 10 — Flotación (Arquímedes)
     Handle: el bloque (lo levantás/hundís y lo soltás).
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "flotacion",
    title: "Flotación (Arquímedes)",
    refs: "Teórica p.36 · Práctica g.8 (8.13–8.18)",
    blurb: "Soltás un bloque sobre un líquido y ves competir el empuje contra el peso. Arrastrá el bloque para levantarlo o hundirlo; al soltar oscila y se estabiliza con la fracción sumergida que mandan las densidades.",
    formula: "E = ρ_L·g·V_sum   ·   flota si ρ_bloque < ρ_L   ·   V_sum/V = ρ_bloque/ρ_L",
    stageHeight: 340,
    controls: [
      { type: "range", key: "rhoB", label: "ρ bloque", min: 200, max: 2000, step: 50, value: 600, unit: "kg/m³", digits: 0 },
      { type: "range", key: "rhoL", label: "ρ líquido", min: 500, max: 1500, step: 50, value: 1000, unit: "kg/m³", digits: 0 }
    ],
    readouts: [
      { key: "W", label: "peso", unit: "N", digits: 1 },
      { key: "E", label: "empuje", unit: "N", digits: 1 },
      { key: "frac", label: "sumergido", unit: "%", digits: 0 },
      { key: "est", label: "Estado" }
    ],
    plot: {
      window: 8, xLabel: "t (s)", yLabel: "y fondo bloque (m)",
      series: [{ key: "y", label: "y", color: C.blue }]
    },
    create: function (env) {
      var LB = 0.4, DWORLD = 1.5, YMAX = 0.7;
      var roTxt = bindText(env, ["W", "E", "frac", "est"]);
      var y, v, t, held = false;

      function layout() {
        var W = env.W, H = env.H;
        var tankX0 = W * 0.30, tankX1 = W * 0.70;
        var surfaceY = H * 0.40, floorY = H - 26;
        var pxPerM = (floorY - surfaceY) / DWORLD;
        return { tankX0: tankX0, tankX1: tankX1, surfaceY: surfaceY, floorY: floorY, pxPerM: pxPerM, cx: (tankX0 + tankX1) / 2 };
      }
      function submerged() { var top = y + LB; return top <= 0 ? LB : (y >= 0 ? 0 : -y); }
      function reset() { y = 0.5; v = 0; t = 0; env.plot.clear(); }

      env.addHandle({
        r: 24,
        x: function () { return layout().cx; },
        y: function () { var g = layout(); return g.surfaceY - (y + LB / 2) * g.pxPerM; },
        onStart: function () { held = true; v = 0; },
        onDrag: function (px, py) { var g = layout(); y = clamp((g.surfaceY - py) / g.pxPerM - LB / 2, -(DWORLD - LB), YMAX); v = 0; },
        onEnd: function () { held = false; }
      });

      return {
        reset: reset,
        step: function (dt) {
          var rhoB = env.params.rhoB, rhoL = env.params.rhoL;
          var A = LB * LB, V = LB * LB * LB, mass = rhoB * V;
          var W = rhoB * V * G, s = submerged(), E = rhoL * A * s * G;
          if (!held) {
            var a = (E - W) / mass - 2.6 * v;
            v += a * dt; y += v * dt;
            if (y < -(DWORLD - LB)) { y = -(DWORLD - LB); if (v < 0) v = 0; }
            if (y > YMAX) { y = YMAX; if (v > 0) v = 0; }
            t += dt; env.plot.push(t, { y: y + DWORLD - LB });
          }
          var frac = submerged() / LB * 100;
          env.setReadout("W", W); env.setReadout("E", E); env.setReadout("frac", frac);
          roTxt("est", rhoB < rhoL ? "flota" : (rhoB > rhoL ? "se hunde" : "indiferente"),
            rhoB < rhoL ? C.teal : (rhoB > rhoL ? C.red : C.dim));
        },
        draw: function (ctx, W, H) {
          var g = layout(), rhoB = env.params.rhoB, rhoL = env.params.rhoL;
          var A = LB * LB, V = LB * LB * LB;
          var wPx = LB * g.pxPerM;
          // tanque + líquido
          ctx.fillStyle = "rgba(146,207,242,0.14)";
          ctx.fillRect(g.tankX0, g.surfaceY, g.tankX1 - g.tankX0, g.floorY - g.surfaceY);
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(g.tankX0, g.surfaceY - 20); ctx.lineTo(g.tankX0, g.floorY);
          ctx.lineTo(g.tankX1, g.floorY); ctx.lineTo(g.tankX1, g.surfaceY - 20); ctx.stroke();
          ctx.strokeStyle = C.blue; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(g.tankX0, g.surfaceY); ctx.lineTo(g.tankX1, g.surfaceY); ctx.stroke();
          label(ctx, "ρ_L=" + rhoL, g.tankX1 - 6, g.floorY - 8, C.blue, MONO_SM, "right");

          // bloque
          var bTop = g.surfaceY - (y + LB) * g.pxPerM, bBot = g.surfaceY - y * g.pxPerM;
          var floatCol = rhoB < rhoL ? C.coral : C.red;
          ctx.fillStyle = "rgba(244,124,89,0.25)"; ctx.strokeStyle = floatCol; ctx.lineWidth = 2;
          ctx.fillRect(g.cx - wPx / 2, bTop, wPx, wPx); ctx.strokeRect(g.cx - wPx / 2, bTop, wPx, wPx);
          // parte sumergida más marcada
          var sTopY = Math.max(bTop, g.surfaceY);
          if (bBot > sTopY) { ctx.fillStyle = "rgba(244,124,89,0.35)"; ctx.fillRect(g.cx - wPx / 2, sTopY, wPx, bBot - sTopY); }
          label(ctx, "ρ_b=" + rhoB, g.cx, bTop - 6, floatCol, MONO_SM, "center");

          // flechas E (arriba) y peso (abajo)
          var Wf = rhoB * V * G, s = submerged(), E = rhoL * A * s * G;
          var maxF = Math.max(Wf, E, 1), fsc = 54 / maxF, ctrY = (bTop + bBot) / 2;
          arrow(ctx, g.cx - 16, ctrY, g.cx - 16, ctrY - E * fsc, C.blue, 2.4);
          label(ctx, "E", g.cx - 22, ctrY - E * fsc - 4, C.blue, MONO_SM, "right");
          arrow(ctx, g.cx + 16, ctrY, g.cx + 16, ctrY + Wf * fsc, C.amber, 2.4);
          label(ctx, "mg", g.cx + 22, ctrY + Wf * fsc + 4, C.amber, MONO_SM, "left");

          // equilibrio esperado
          var fracEq = clamp(rhoB / rhoL, 0, 1);
          label(ctx, "V_sum/V ≈ " + Math.round(fracEq * 100) + "%", g.tankX0 + 6, g.surfaceY + 14, C.dim, MONO_SM, "left");
          if (held) label(ctx, "· soltá el bloque ·", g.cx, 16, C.dim, MONO_SM, "center", "top");
        }
      };
    }
  });

  /* ============================================================
     SIM 11 — Torricelli
     Handle: la altura del orificio.
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "torricelli",
    title: "Torricelli",
    refs: "Teórica p.38–39 · Práctica g.8 (8.19–8.21)",
    blurb: "Un tanque con un orificio en la pared: el chorro sale con v=√(2g·h) y cae en parábola. Arrastrás la altura del orificio y ves cambiar el alcance — máximo cuando está a media altura (h/2).",
    formula: "v = √(2g·h)   ·   alcance R = 2·√(y·(H−y))   ·   R_máx = H  en  y = H/2",
    stageHeight: 340,
    controls: [
      { type: "range", key: "H", label: "nivel de agua H", min: 1, max: 4, step: 0.1, value: 3, unit: "m", digits: 1 }
    ],
    readouts: [
      { key: "h", label: "h sobre orificio", unit: "m", digits: 2 },
      { key: "v", label: "v salida", unit: "m/s", digits: 2 },
      { key: "R", label: "alcance", unit: "m", digits: 2 },
      { key: "y", label: "altura orificio", unit: "m", digits: 2 }
    ],
    create: function (env) {
      var oy, parts, emitAcc;

      function layout() {
        var W = env.W, H = env.H;
        var groundY = H - 28, wallTop = 34, wallX = W * 0.20;
        var maxLevel = 4.2;
        var pxPerM = (groundY - wallTop) / maxLevel;
        return { groundY: groundY, wallTop: wallTop, wallX: wallX, pxPerM: pxPerM, tankW: 96 };
      }
      function reset() { oy = env.params.H / 2; parts = []; emitAcc = 0; }

      env.addHandle({
        r: 14,
        x: function () { return layout().wallX; },
        y: function () { var g = layout(); return g.groundY - oy * g.pxPerM; },
        onDrag: function (px, py) { var g = layout(); oy = clamp((g.groundY - py) / g.pxPerM, 0.1, env.params.H - 0.1); }
      });

      return {
        reset: reset,
        step: function (dt) {
          var H = env.params.H;
          if (oy > H - 0.05) oy = H - 0.05;
          if (oy < 0.1) oy = 0.1;
          var h = H - oy, v = Math.sqrt(2 * G * h);
          // emisión de gotas
          emitAcc += dt;
          while (emitAcc > 0.03) { emitAcc -= 0.03; parts.push({ age: 0 }); }
          for (var i = parts.length - 1; i >= 0; i--) {
            parts[i].age += dt;
            var drop = 0.5 * G * parts[i].age * parts[i].age;
            if (drop >= oy) parts.splice(i, 1);
          }
          var R = 2 * Math.sqrt(oy * (H - oy));
          env.setReadout("h", h); env.setReadout("v", v); env.setReadout("R", R); env.setReadout("y", oy);
        },
        draw: function (ctx, W, H) {
          var g = layout(), Hw = env.params.H;
          var orX = g.wallX, orY = g.groundY - oy * g.pxPerM;
          var waterY = g.groundY - Hw * g.pxPerM;
          var v = Math.sqrt(2 * G * (Hw - oy)), R = 2 * Math.sqrt(oy * (Hw - oy));

          // tanque (a la izquierda de la pared) + agua
          ctx.fillStyle = "rgba(146,207,242,0.14)";
          ctx.fillRect(orX - g.tankW, waterY, g.tankW, g.groundY - waterY);
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(orX - g.tankW, g.wallTop); ctx.lineTo(orX - g.tankW, g.groundY);
          ctx.moveTo(orX, g.wallTop); ctx.lineTo(orX, orY - 4);
          ctx.moveTo(orX, orY + 4); ctx.lineTo(orX, g.groundY);
          ctx.stroke();
          ctx.strokeStyle = C.blue; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(orX - g.tankW, waterY); ctx.lineTo(orX, waterY); ctx.stroke();
          label(ctx, "H=" + Hw.toFixed(1) + "m", orX - g.tankW + 6, waterY + 14, C.blue, MONO_SM, "left");

          // marca h/2 (óptimo)
          var optY = g.groundY - (Hw / 2) * g.pxPerM;
          ctx.strokeStyle = C.amber; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
          ctx.beginPath(); ctx.moveTo(orX - g.tankW, optY); ctx.lineTo(orX + 20, optY); ctx.stroke(); ctx.setLineDash([]);
          label(ctx, "H/2 → R_máx", orX + 24, optY, C.amber, MONO_SM, "left");

          // suelo + ticks de distancia (1 m)
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(orX, g.groundY); ctx.lineTo(W - 12, g.groundY); ctx.stroke();
          for (var mx = 0; orX + mx * g.pxPerM < W - 12; mx++) {
            ctx.strokeStyle = mx % 1 === 0 ? C.grid : C.grid; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(orX + mx * g.pxPerM, g.groundY); ctx.lineTo(orX + mx * g.pxPerM, g.groundY + 5); ctx.stroke();
            if (mx > 0) label(ctx, mx + "m", orX + mx * g.pxPerM, g.groundY + 16, C.dim, MONO_SM, "center");
          }

          // parábola guía del chorro
          ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 1.4; ctx.setLineDash([4, 4]);
          ctx.beginPath();
          var tLand = Math.sqrt(2 * oy / G);
          for (var s = 0; s <= 1.0001; s += 0.05) {
            var tp = s * tLand, xx = orX + v * tp * g.pxPerM, yy = orY + 0.5 * G * tp * tp * g.pxPerM;
            if (s === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
          }
          ctx.stroke(); ctx.setLineDash([]);

          // gotas del chorro
          for (var i = 0; i < parts.length; i++) {
            var tp2 = parts[i].age, xx2 = orX + v * tp2 * g.pxPerM, yy2 = orY + 0.5 * G * tp2 * tp2 * g.pxPerM;
            disc(ctx, xx2, yy2, 2.4, C.blue);
          }
          // flecha v salida
          arrow(ctx, orX, orY, orX + clamp(v * 4, 8, 70), orY, C.coral, 2.2);
          label(ctx, "v=" + v.toFixed(1), orX + 6, orY - 6, C.coral, MONO_SM, "left");

          // marca de alcance
          var rX = orX + R * g.pxPerM;
          ctx.strokeStyle = C.teal; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(rX, g.groundY - 6); ctx.lineTo(rX, g.groundY + 6); ctx.stroke();
          label(ctx, "R=" + R.toFixed(2) + "m", rX, g.groundY - 10, C.teal, MONO_SM, "center");
          // R_máx = H
          var rmX = orX + Hw * g.pxPerM;
          ctx.strokeStyle = "rgba(216,178,121,0.5)"; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
          ctx.beginPath(); ctx.moveTo(rmX, g.groundY - 40); ctx.lineTo(rmX, g.groundY); ctx.stroke(); ctx.setLineDash([]);
          label(ctx, "R_máx=H", rmX, g.groundY - 44, C.amber, MONO_SM, "center");
        }
      };
    }
  });

})();
