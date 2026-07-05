/* ============================================================
   f1.js — Física 1 (mecánica y fluidos)
   Laboratorio de simulaciones para el mockup de toolkits.
   Refuerza los apuntes reales de la cursada (Teórica + Práctica).
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

  function arrow(ctx, x0, y0, x1, y1, color, w, head) {
    var dx = x1 - x0, dy = y1 - y0;
    var len = Math.sqrt(dx * dx + dy * dy);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w || 2;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    if (len < 3) return;
    var ang = Math.atan2(dy, dx), h = head || 7;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - h * Math.cos(ang - 0.42), y1 - h * Math.sin(ang - 0.42));
    ctx.lineTo(x1 - h * Math.cos(ang + 0.42), y1 - h * Math.sin(ang + 0.42));
    ctx.closePath(); ctx.fill();
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

  /* ============================================================
     TAB
     ============================================================ */
  K.registerTab({
    id: "f1",
    intro: "Mecánica de la partícula y del cuerpo rígido más fluidos ideales: tiro oblicuo, choques con restitución, rodadura, curvas peraltadas y Bernoulli — todo salido de los apuntes de la cursada."
  });

  /* ============================================================
     SIM 1 — Tiro oblicuo (con/ sin drag lineal)
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "tiro",
    title: "Tiro oblicuo",
    refs: "Teórica p.2–6, p.10 · Práctica g.1",
    blurb: "Proyectil con y sin rozamiento del aire (drag lineal, como en los apuntes). La traza, los vectores v y a y el alcance responden en vivo.",
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
      var x, y, vx, vy, t, landed, restT, maxH, trace;
      var aR = 0, aH = 0, aT = 0; // predicción analítica (sin drag) para encuadrar

      function launch() {
        var v0 = env.params.v0, th = env.params.angle * Math.PI / 180;
        vx = v0 * Math.cos(th); vy = v0 * Math.sin(th);
        x = 0; y = 0; t = 0; landed = false; restT = 0; maxH = 0; trace = [[0, 0]];
        aR = v0 * v0 * Math.sin(2 * th) / G;
        aH = (v0 * Math.sin(th)) * (v0 * Math.sin(th)) / (2 * G);
        aT = 2 * v0 * Math.sin(th) / G;
        env.plot.clear();
        // valores de arranque (ideales) hasta que aterrice y midamos
        env.setReadout("R", aR); env.setReadout("H", aH);
        env.setReadout("T", aT); env.setReadout("vf", v0);
      }

      return {
        reset: function () { launch(); },
        onControl: function () { launch(); },
        step: function (dt) {
          if (landed) { restT += dt; if (restT > 0.7) launch(); return; }
          var k = env.params.drag ? env.params.k : 0;
          // Euler semi-implícito (estable para drag lineal)
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
          var ml = 46, mr = 24, mtop = 26, mbot = 34;
          var worldW = Math.max(aR * 1.06, 4);
          var worldH = Math.max(aH * 1.18, 2);
          var sc = Math.min((W - ml - mr) / worldW, (H - mtop - mbot) / worldH);
          var ox = ml, oy = H - mbot;
          function SX(wx) { return ox + wx * sc; }
          function SY(wy) { return oy - wy * sc; }

          // grilla de distancia + suelo
          ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
          var stepM = worldW <= 20 ? 2 : (worldW <= 60 ? 10 : 20);
          for (var gx = 0; gx <= worldW; gx += stepM) {
            ctx.beginPath(); ctx.moveTo(SX(gx), mtop); ctx.lineTo(SX(gx), oy); ctx.stroke();
            label(ctx, gx + "m", SX(gx), oy + 14, C.dim, MONO_SM, "center");
          }
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(ml, oy); ctx.lineTo(W - mr, oy); ctx.stroke();

          // traza
          if (trace.length > 1) {
            ctx.strokeStyle = "rgba(244,124,89,0.55)"; ctx.lineWidth = 2;
            ctx.beginPath();
            for (var i = 0; i < trace.length; i++) {
              var px = SX(trace[i][0]), py = SY(trace[i][1]);
              if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }

          // marcas de alcance/h_max de la última predicción
          ctx.setLineDash([4, 4]); ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(SX(0), SY(aH)); ctx.lineTo(SX(aR / 2), SY(aH)); ctx.stroke();
          ctx.setLineDash([]);

          // proyectil + vectores
          var pxp = SX(x), pyp = SY(y);
          var vSc = 3.6, aSc = 6.5;
          var k = env.params.drag ? env.params.k : 0;
          var axw = -k * vx, ayw = -G - k * vy;
          // vector aceleración (rojo)
          arrow(ctx, pxp, pyp, pxp + axw * aSc, pyp - ayw * aSc, C.red, 2.2, 7);
          label(ctx, "a", pxp + axw * aSc, pyp - ayw * aSc - 4, C.red, MONO_SM, "center");
          // vector velocidad (azul)
          arrow(ctx, pxp, pyp, pxp + vx * vSc, pyp - vy * vSc, C.blue, 2.4, 8);
          label(ctx, "v", pxp + vx * vSc + 6, pyp - vy * vSc, C.blue, MONO_SM, "left");
          // bala
          disc(ctx, pxp, pyp, 6, C.coral, C.ink, 1.5);

          // indicador de ángulo en el origen
          label(ctx, env.params.angle.toFixed(0) + "°", SX(0) + 6, SY(0) - 8, C.dim, MONO_SM, "left");
          if (env.params.drag)
            label(ctx, "drag ON (b/m=" + env.params.k.toFixed(2) + ")", W - mr, mtop + 4, C.amber, MONO_SM, "right", "top");
          else
            label(ctx, "sin rozamiento", W - mr, mtop + 4, C.dim, MONO_SM, "right", "top");
        }
      };
    }
  });

  /* ============================================================
     SIM 2 — Colisiones 1D con coeficiente de restitución
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "colision",
    title: "Colisiones 1D",
    refs: "Teórica p.15–16 · Práctica g.4",
    blurb: "Dos carritos sobre un riel sin fricción y con topes elásticos. En cada choque entre ellos p_total no cambia; K solo se conserva si e = 1.",
    formula: "m₁v₁+m₂v₂ = m₁v₁′+m₂v₂′   ·   e = −(v₁′−v₂′)/(v₁−v₂)   ·   e=0 plástica, e=1 elástica",
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
      var L = 10;                       // largo del riel (m)
      var c1, c2, t, lastDK;

      function widthOf(m) { return 0.42 + 0.10 * m; }   // ancho visual ∝ masa

      function reset() {
        var p = env.params;
        c1 = { x: 2.6, v: p.v1, m: p.m1, w: widthOf(p.m1) };
        c2 = { x: 7.4, v: p.v2, m: p.m2, w: widthOf(p.m2) };
        t = 0; lastDK = 0;
        env.plot.clear();
      }

      function regimen(e) { return e >= 0.98 ? "elástica" : (e <= 0.02 ? "plástica" : "inelástica"); }

      return {
        reset: reset,
        onControl: function (key) {
          if (key === "m1") { c1.m = env.params.m1; c1.w = widthOf(c1.m); reset(); }
          else if (key === "m2") { c2.m = env.params.m2; c2.w = widthOf(c2.m); reset(); }
          else if (key === "v1" || key === "v2") reset();
          // 'e' se usa en vivo, sin reiniciar
        },
        step: function (dt) {
          c1.x += c1.v * dt; c2.x += c2.v * dt;
          // topes elásticos en los extremos del riel
          [c1, c2].forEach(function (c) {
            var hw = c.w / 2;
            if (c.x - hw < 0) { c.x = hw; c.v = -c.v; }
            if (c.x + hw > L) { c.x = L - hw; c.v = -c.v; }
          });
          // choque carrito-carrito
          var gap = (c2.x - c1.x) - (c1.w / 2 + c2.w / 2);
          var approaching = (c1.v - c2.v) > 0; // c1 a la izquierda de c2
          if (gap <= 0 && approaching) {
            var e = env.params.e, m1 = c1.m, m2 = c2.m, u1 = c1.v, u2 = c2.v;
            var Kb = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2;
            var v1n = ((m1 - e * m2) * u1 + (1 + e) * m2 * u2) / (m1 + m2);
            var v2n = ((1 + e) * m1 * u1 + (m2 - e * m1) * u2) / (m1 + m2);
            c1.v = v1n; c2.v = v2n;
            var Ka = 0.5 * m1 * v1n * v1n + 0.5 * m2 * v2n * v2n;
            lastDK = Kb - Ka;
            // separar apenas para no re-detectar el mismo choque
            var overlap = -gap + 0.001;
            c1.x -= overlap / 2; c2.x += overlap / 2;
          }
          t += dt;
          env.plot.push(t, { v1: c1.v, v2: c2.v });
          var p = c1.m * c1.v + c2.m * c2.v;
          var Ktot = 0.5 * c1.m * c1.v * c1.v + 0.5 * c2.m * c2.v * c2.v;
          env.setReadout("p", p); env.setReadout("K", Ktot);
          env.setReadout("dk", lastDK); env.setReadout("reg", regimen(env.params.e));
        },
        draw: function (ctx, W, H) {
          var ml = 40, mr = 40;
          var sc = (W - ml - mr) / L;
          var railY = H * 0.60;
          function SX(wx) { return ml + wx * sc; }

          // riel + topes
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(SX(0), railY); ctx.lineTo(SX(L), railY); ctx.stroke();
          ctx.fillStyle = C.dim;
          ctx.fillRect(SX(0) - 4, railY - 26, 4, 26);
          ctx.fillRect(SX(L), railY - 26, 4, 26);

          // centro de masa (marcador) — se mueve uniforme salvo topes
          var xcm = (c1.m * c1.x + c2.m * c2.x) / (c1.m + c2.m);
          ctx.fillStyle = C.amber;
          ctx.beginPath();
          ctx.moveTo(SX(xcm), railY + 8);
          ctx.lineTo(SX(xcm) - 5, railY + 18);
          ctx.lineTo(SX(xcm) + 5, railY + 18);
          ctx.closePath(); ctx.fill();
          label(ctx, "cm", SX(xcm), railY + 30, C.amber, MONO_SM, "center");

          drawCart(ctx, c1, SX, sc, railY, C.coral, "m₁");
          drawCart(ctx, c2, SX, sc, railY, C.blue, "m₂");
        }
      };

      function drawCart(ctx, c, SX, sc, railY, color, name) {
        var wpx = c.w * sc, hpx = 30;
        var cx = SX(c.x), topY = railY - hpx - 4;
        // cuerpo
        ctx.fillStyle = color;
        ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
        roundRect(ctx, cx - wpx / 2, topY, wpx, hpx, 4);
        ctx.fill(); ctx.stroke();
        // ruedas
        ctx.fillStyle = C.ink;
        disc(ctx, cx - wpx * 0.28, railY - 3, 4.5, C.ink, color, 1.5);
        disc(ctx, cx + wpx * 0.28, railY - 3, 4.5, C.ink, color, 1.5);
        // etiqueta masa
        label(ctx, name + "=" + c.m.toFixed(1), cx, topY + hpx / 2 + 3, C.ink, MONO_SM, "center");
        // flecha de velocidad
        var vpx = c.v * 12;
        arrow(ctx, cx, topY - 10, cx + vpx, topY - 10, color, 2.4, 8);
        label(ctx, c.v.toFixed(1), cx + vpx + (c.v >= 0 ? 6 : -6), topY - 14,
          color, MONO_SM, c.v >= 0 ? "left" : "right");
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
    }
  });

  /* ============================================================
     SIM 3 — Rodadura en plano inclinado (aro vs disco vs esfera)
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "rodadura",
    title: "Rodadura en plano inclinado",
    refs: "Teórica p.28–30 · Práctica g.6",
    blurb: "Aro, disco y esfera compiten cuesta abajo: distinto momento de inercia, distinta aceleración. El slider de μₛ marca cuándo ruedan sin deslizar y cuándo patinan.",
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
      var Lworld = 6;           // largo del plano (m)
      var R = 0.28;             // radio de los cuerpos (m)
      var bodies, t, doneT;

      function make() {
        return [
          { name: "aro", label: "Aro", c: 1.0, color: C.amber, s: 0, v: 0, om: 0, phi: 0, slip: false, a: 0 },
          { name: "disco", label: "Disco", c: 0.5, color: C.blue, s: 0, v: 0, om: 0, phi: 0, slip: false, a: 0 },
          { name: "esfera", label: "Esfera", c: 0.4, color: C.coral, s: 0, v: 0, om: 0, phi: 0, slip: false, a: 0 }
        ];
      }

      function reset() { bodies = make(); t = 0; doneT = 0; env.plot.clear(); }

      function dyn(b, th, mu) {
        var sT = Math.sin(th), cT = Math.cos(th), tT = Math.tan(th);
        var rolls = (mu <= 0) ? false : (tT <= mu * (1 + b.c) / b.c);
        if (rolls) {
          var a = G * sT / (1 + b.c);
          return { a: a, alpha: a / R, slip: false };
        } else {
          var a2 = G * (sT - mu * cT);
          if (a2 < 0) a2 = 0;
          return { a: a2, alpha: mu * G * cT / (b.c * R), slip: true };
        }
      }

      return {
        reset: reset,
        step: function (dt) {
          var th = env.params.ang * Math.PI / 180, mu = env.params.mu;
          var allDone = true;
          bodies.forEach(function (b) {
            var d = dyn(b, th, mu);
            b.a = d.a; b.slip = d.slip;
            if (b.s < Lworld) {
              allDone = false;
              b.v += d.a * dt;
              b.om += d.alpha * dt;
              b.s += b.v * dt;
              b.phi += b.om * dt;
              if (b.s >= Lworld) { b.s = Lworld; }
            }
          });
          t += dt;
          env.plot.push(t, { aro: bodies[0].v, disco: bodies[1].v, esfera: bodies[2].v });
          env.setReadout("aA", bodies[0].a); env.setReadout("aD", bodies[1].a);
          env.setReadout("aE", bodies[2].a);
          var lead = bodies[0];
          bodies.forEach(function (b) { if (b.s > lead.s) lead = b; });
          env.setReadout("lider", lead.s > 0.01 ? lead.label : "—");
          if (allDone) { doneT += dt; if (doneT > 1.0) reset(); }
        },
        draw: function (ctx, W, H) {
          var th = env.params.ang * Math.PI / 180;
          var lx = 54, baseY = H - 42;
          var aw = W - lx - 40, ah = H - 90;
          var run, rise;
          if (aw * Math.tan(th) <= ah) { run = aw; rise = aw * Math.tan(th); }
          else { rise = ah; run = ah / Math.tan(th); }
          var Ptx = lx, Pty = baseY - rise;      // arriba (izq)
          var Pbx = lx + run, Pby = baseY;        // abajo (der)
          var len = Math.sqrt(run * run + rise * rise);
          var ux = run / len, uy = rise / len;    // dir superficie (arriba→abajo)
          var nx = uy, ny = -ux;                  // normal (hacia afuera/arriba)
          var Rpx = Math.max(11, Math.min(20, len * 0.032));

          // cuña sólida
          ctx.fillStyle = "rgba(255,255,255,0.05)";
          ctx.beginPath();
          ctx.moveTo(Ptx, Pty); ctx.lineTo(Pbx, Pby); ctx.lineTo(Ptx, Pby); ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(Ptx, Pty); ctx.lineTo(Pbx, Pby); ctx.stroke();
          ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(Ptx, Pby); ctx.lineTo(Pbx, Pby); ctx.stroke();

          // arco de ángulo en la base
          ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(Pbx, Pby, 26, Math.PI, Math.PI + th); ctx.stroke();
          label(ctx, env.params.ang.toFixed(0) + "°", Pbx - 34, Pby - 6, C.dim, MONO_SM, "right");
          label(ctx, "μₛ=" + env.params.mu.toFixed(2), lx, 18, C.dim, MONO, "left", "top");

          // cuerpos
          bodies.forEach(function (b) {
            var f = b.s / Lworld;
            var cx = Ptx + (Pbx - Ptx) * f + nx * Rpx;
            var cy = Pty + (Pby - Pty) * f + ny * Rpx;
            var outline = b.slip ? C.red : b.color;
            // cuerpo (aro hueco, disco/esfera rellenos con distinta opacidad)
            ctx.beginPath(); ctx.arc(cx, cy, Rpx, 0, Math.PI * 2);
            if (b.name === "aro") {
              ctx.strokeStyle = outline; ctx.lineWidth = 3.5; ctx.stroke();
            } else {
              ctx.fillStyle = b.name === "disco" ? "rgba(146,207,242,0.28)" : "rgba(244,124,89,0.30)";
              ctx.fill();
              ctx.strokeStyle = outline; ctx.lineWidth = 2.4; ctx.stroke();
            }
            // rayo para ver la rotación (y el patinaje)
            var ph = b.phi;
            ctx.strokeStyle = outline; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Rpx * Math.cos(ph), cy + Rpx * Math.sin(ph)); ctx.stroke();
            disc(ctx, cx + Rpx * Math.cos(ph), cy + Rpx * Math.sin(ph), 2.5, outline);
            // etiqueta
            label(ctx, b.label + (b.slip ? " · patina" : ""), cx + nx * (Rpx + 4), cy + ny * (Rpx + 4),
              b.slip ? C.red : b.color, MONO_SM, "center");
          });
        }
      };
    }
  });

  /* ============================================================
     SIM 4 — Curva peraltada (corte frontal + diagrama de fuerzas)
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "peralte",
    title: "Curva peraltada",
    refs: "Teórica p.9 · Práctica g.2",
    blurb: "Auto en una curva peraltada, en corte frontal con su diagrama de fuerzas. Fuera de la franja [v_mín, v_máx] el auto derrapa.",
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
      var slidePos, slideVel, phase, state;

      function reset() { slidePos = 0; slideVel = 0; phase = 0; state = 0; }

      function limits() {
        var th = env.params.th * Math.PI / 180, mu = env.params.mu, R = env.params.R;
        var tT = Math.tan(th);
        var inner = (tT - mu) / (1 + mu * tT);
        var vmin = inner > 0 ? Math.sqrt(G * R * inner) : 0;
        var denom = 1 - mu * tT;
        var vmax = denom > 0 ? Math.sqrt(G * R * (tT + mu) / denom) : Infinity;
        var vopt = Math.sqrt(G * R * tT);
        return { vmin: vmin, vmax: vmax, vopt: vopt };
      }

      return {
        reset: reset,
        step: function (dt) {
          var L = limits(), v = env.params.v, R = env.params.R;
          // estado: -1 derrapa abajo, +1 derrapa arriba, 0 agarra
          if (v < L.vmin) state = -1;
          else if (v > L.vmax) state = 1;
          else state = 0;
          // animación del deslizamiento sobre el peralte
          if (state === 0) { slidePos *= 0.86; slideVel *= 0.6; }
          else {
            slideVel += state * 70 * dt;
            slidePos += slideVel * dt;
            if (Math.abs(slidePos) > 120) { slidePos = 0; slideVel = 0; }
          }
          phase += (v / Math.max(R, 1)) * dt; // vuelta en la vista superior
          env.setReadout("vmin", L.vmin);
          env.setReadout("vmax", isFinite(L.vmax) ? L.vmax : "∞");
          env.setReadout("vopt", L.vopt);
          env.setReadout("est", state === 0 ? "AGARRA" : (state < 0 ? "DERRAPA ↓" : "DERRAPA ↑"));
        },
        draw: function (ctx, W, H) {
          var th = env.params.th * Math.PI / 180;
          var L = limits(), v = env.params.v;
          var stateCol = state === 0 ? C.teal : C.red;

          // --- corte frontal del peralte ---
          var cx = W * 0.46, cy = H * 0.52;
          var roadLen = Math.min(W * 0.34, 190);
          var ux = Math.cos(th), uy = -Math.sin(th);   // subida del peralte (arriba-der)
          var nx = -Math.sin(th), ny = -Math.cos(th);  // normal (hacia arriba, inclinada al centro=izq)

          // calzada
          var ax0 = cx - ux * roadLen, ay0 = cy - uy * roadLen;
          var ax1 = cx + ux * roadLen, ay1 = cy + uy * roadLen;
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 8; ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(ax0, ay0); ctx.lineTo(ax1, ay1); ctx.stroke();
          ctx.lineCap = "butt";
          // horizontal de referencia
          ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
          ctx.beginPath(); ctx.moveTo(cx - roadLen, cy); ctx.lineTo(cx + roadLen * 0.4, cy); ctx.stroke();
          ctx.setLineDash([]);
          label(ctx, env.params.th.toFixed(0) + "° peralte", cx - roadLen, cy + 18, C.dim, MONO_SM, "left");
          label(ctx, "← al centro (R=" + env.params.R.toFixed(0) + "m)", cx - roadLen, cy - roadLen * 0.5 - 6, C.dim, MONO_SM, "left");

          // auto sobre el peralte (con deslizamiento animado)
          var carX = cx + ux * slidePos, carY = cy + uy * slidePos;
          var carCx = carX + nx * 12, carCy = carY + ny * 12; // CM levantado sobre la calzada
          // chasis (rotado con el peralte)
          ctx.save();
          ctx.translate(carX + nx * 6, carY + ny * 6);
          ctx.rotate(Math.atan2(uy, ux));
          ctx.fillStyle = stateCol; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.rect(-16, -12, 32, 12); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.rect(-9, -19, 18, 8); ctx.fill(); ctx.stroke();
          ctx.fillStyle = C.ink;
          disc(ctx, -9, 0, 3.5, C.ink); disc(ctx, 9, 0, 3.5, C.ink);
          ctx.restore();

          // diagrama de fuerzas (escala: mg = base)
          var base = 62;
          var Nmag = (v * v / (env.params.R) * Math.sin(th) + G * Math.cos(th)) / G; // /mg
          var fReq = ((v * v / env.params.R) * Math.cos(th) - G * Math.sin(th)) / G; // /mg (signo: + baja peralte)
          var muN = env.params.mu * Nmag;
          // N (normal)
          arrow(ctx, carCx, carCy, carCx + nx * base * Nmag, carCy + ny * base * Nmag, C.blue, 2.4, 8);
          label(ctx, "N", carCx + nx * base * Nmag, carCy + ny * base * Nmag - 4, C.blue, MONO_SM, "center");
          // mg
          arrow(ctx, carCx, carCy, carCx, carCy + base, C.amber, 2.4, 8);
          label(ctx, "mg", carCx + 8, carCy + base, C.amber, MONO_SM, "left");
          // fricción (a lo largo de la calzada; f>0 apunta cuesta abajo)
          var fdirx = fReq >= 0 ? -ux : ux, fdiry = fReq >= 0 ? -uy : uy;
          var flen = base * Math.min(Math.abs(fReq), muN);
          arrow(ctx, carCx, carCy, carCx + fdirx * flen, carCy + fdiry * flen, stateCol, 2.6, 8);
          label(ctx, "f", carCx + fdirx * flen - fdirx * 8, carCy + fdiry * flen - 10, stateCol, MONO_SM, "center");
          // límite μₛN (guía punteada en la dirección requerida)
          ctx.setLineDash([3, 3]); ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(carCx, carCy);
          ctx.lineTo(carCx + fdirx * base * muN, carCy + fdiry * base * muN); ctx.stroke();
          ctx.setLineDash([]);

          // --- vista superior (inset) ---
          var ix = W - 62, iy = 56, ir = 34;
          ctx.strokeStyle = C.grid; ctx.lineWidth = 8;
          disc(ctx, ix, iy, ir, null, C.grid, 8);
          ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
          disc(ctx, ix, iy, ir, null, "rgba(255,255,255,0.12)", 1);
          var cxx = ix + ir * Math.cos(phase), cyy = iy + ir * Math.sin(phase);
          disc(ctx, cxx, cyy, 4, stateCol);
          label(ctx, "planta", ix, iy + ir + 14, C.dim, MONO_SM, "center");

          // --- barra-medidor v dentro de [v_mín, v_máx] ---
          var by = H - 26, bx0 = 40, bx1 = W - 40, bw = bx1 - bx0;
          var vScale = Math.max(env.params.v * 1.15,
            isFinite(L.vmax) ? L.vmax * 1.2 : 45, 30);
          function BX(vv) { return bx0 + clamp(vv / vScale, 0, 1) * bw; }
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 6; ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(bx0, by); ctx.lineTo(bx1, by); ctx.stroke();
          // franja segura (verde)
          var segHi = isFinite(L.vmax) ? L.vmax : vScale;
          ctx.strokeStyle = C.teal; ctx.lineWidth = 6;
          ctx.beginPath(); ctx.moveTo(BX(L.vmin), by); ctx.lineTo(BX(segHi), by); ctx.stroke();
          ctx.lineCap = "butt";
          // v_ópt
          ctx.strokeStyle = C.amber; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(BX(L.vopt), by - 8); ctx.lineTo(BX(L.vopt), by + 8); ctx.stroke();
          label(ctx, "v_ópt", BX(L.vopt), by - 11, C.amber, MONO_SM, "center");
          // marcador v actual
          disc(ctx, BX(v), by, 6, stateCol, C.ink, 1.5);
          label(ctx, "v=" + v.toFixed(0), BX(v), by + 18, stateCol, MONO_SM, "center");
          label(ctx, "v_mín " + L.vmin.toFixed(1), bx0, by - 12, C.dim, MONO_SM, "left");
          label(ctx, "v_máx " + (isFinite(L.vmax) ? L.vmax.toFixed(1) : "∞"), bx1, by - 12, C.dim, MONO_SM, "right");
        }
      };
    }
  });

  /* ============================================================
     SIM 5 — Venturi / Bernoulli
     ============================================================ */
  K.registerSim({
    tab: "f1",
    id: "venturi",
    title: "Venturi / Bernoulli",
    refs: "Teórica p.38–39 · Práctica g.8",
    blurb: "Fluido ideal por un tubo con estrechamiento. Donde se angosta va más rápido y baja la presión: los tubos manométricos lo muestran.",
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
      var RHO = 1000;
      var N = 64;
      var parts = [];
      var Ltube = 0.6;   // largo físico del tubo (m) para escalar velocidad

      function d1() { return env.params.d1 / 100; }
      function d2() { return Math.min(env.params.d2, env.params.d1) / 100; }
      function Q() { return env.params.Q / 1000; } // m³/s

      // perfil de diámetro a lo largo del tubo (0..1): ancho en los extremos, angosto en el medio
      function dAt(f) {
        // campana suave (gaussiana) centrada en la garganta (f=0.5)
        var g = Math.exp(-Math.pow((f - 0.5) / 0.16, 2));
        return d1() + (d2() - d1()) * g;
      }
      function areaOfD(d) { return Math.PI * (d / 2) * (d / 2); }
      function vAt(f) { return Q() / areaOfD(dAt(f)); }

      function reset() {
        parts = [];
        for (var i = 0; i < N; i++)
          parts.push({ x: Math.random(), lat: (Math.random() * 2 - 1) * 0.8 });
      }

      return {
        reset: reset,
        step: function (dt) {
          for (var i = 0; i < parts.length; i++) {
            var p = parts[i];
            var v = vAt(p.x);                     // m/s físico
            p.x += (v * dt) / Ltube;
            if (p.x > 1) { p.x -= 1; p.lat = (Math.random() * 2 - 1) * 0.85; }
          }
          var A1 = areaOfD(d1()), A2 = areaOfD(d2());
          var v1 = Q() / A1, v2 = Q() / A2;
          var dp = 0.5 * RHO * (v2 * v2 - v1 * v1);
          env.setReadout("v1", v1); env.setReadout("v2", v2);
          env.setReadout("dp", dp); env.setReadout("dh", dp / (RHO * G) * 100);
        },
        draw: function (ctx, W, H) {
          var ml = 30, mr = 30;
          var tubeW = W - ml - mr;
          var axisY = H * 0.66;                 // eje del tubo
          // escala de radio en px: que d1 (el diámetro ancho) ocupe como mucho ~120px
          var rScale = Math.min(120 / d1(), tubeW * 1.1);
          function rpx(f) { return dAt(f) / 2 * rScale; }
          function SX(f) { return ml + f * tubeW; }

          // contorno del tubo
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 2;
          ctx.beginPath();
          for (var f = 0; f <= 1.0001; f += 0.02) ctx.lineTo(SX(f), axisY - rpx(f));
          ctx.stroke();
          ctx.beginPath();
          for (var f2 = 0; f2 <= 1.0001; f2 += 0.02) ctx.lineTo(SX(f2), axisY + rpx(f2));
          ctx.stroke();
          // agua (relleno tenue)
          ctx.fillStyle = "rgba(146,207,242,0.07)";
          ctx.beginPath();
          for (var fa = 0; fa <= 1.0001; fa += 0.02) ctx.lineTo(SX(fa), axisY - rpx(fa));
          for (var fb = 1; fb >= -0.0001; fb -= 0.02) ctx.lineTo(SX(fb), axisY + rpx(fb));
          ctx.closePath(); ctx.fill();

          // partículas (más rápidas -> más brillantes/alargadas en la garganta)
          for (var i = 0; i < parts.length; i++) {
            var p = parts[i];
            var r = rpx(p.x) * 0.9;
            var px = SX(p.x), py = axisY + p.lat * r;
            var v = vAt(p.x);
            var speedN = clamp(v / 6, 0.15, 1);
            ctx.strokeStyle = "rgba(146,207,242," + (0.35 + 0.6 * speedN) + ")";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(px, py); ctx.lineTo(px - (4 + 10 * speedN), py); ctx.stroke();
          }

          // --- manómetros en entrada, garganta y salida ---
          var A1 = areaOfD(d1()), A2 = areaOfD(d2());
          var v1 = Q() / A1;
          var stations = [{ f: 0.15, tag: "P₁" }, { f: 0.5, tag: "P₂" }, { f: 0.85, tag: "P₁" }];
          // cabeza piezométrica relativa (referida a la entrada): h(f) = (v1²-v(f)²)/(2g)
          function head(f) { var vv = vAt(f); return (v1 * v1 - vv * vv) / (2 * G); } // <=0 en garganta
          var hThroat = head(0.5); // negativo (más bajo)
          var maxCol = axisY - 44;                 // px de columna disponible
          var baseCol = 0.62 * maxCol;             // columna de referencia (entrada)
          var minCol = 10;
          var span = baseCol - minCol;
          var colScale = Math.min(170, span / Math.max(-hThroat, 1e-4)); // px por metro de cabeza
          function colH(f) { return clamp(baseCol + head(f) * colScale, minCol, maxCol); }

          stations.forEach(function (st) {
            var sx = SX(st.f), topTube = axisY - rpx(st.f);
            var ch = colH(st.f);
            var tubeTopY = topTube - ch;
            // tubito
            ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 1.5;
            ctx.strokeRect(sx - 5, tubeTopY, 10, ch + rpx(st.f));
            // agua en el tubito
            ctx.fillStyle = "rgba(146,207,242,0.55)";
            ctx.fillRect(sx - 4, tubeTopY, 8, ch + rpx(st.f));
            ctx.fillStyle = C.blue;
            ctx.fillRect(sx - 4, tubeTopY, 8, 3);
            label(ctx, st.tag, sx, tubeTopY - 6, C.blue, MONO_SM, "center");
          });

          // línea de cabeza piezométrica (conecta las alturas de columna)
          ctx.strokeStyle = "rgba(216,178,121,0.7)"; ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          for (var fh = 0.06; fh <= 0.95; fh += 0.02) {
            var yy = (axisY - rpx(fh)) - colH(fh);
            if (fh <= 0.06 + 1e-9) ctx.moveTo(SX(fh), yy); else ctx.lineTo(SX(fh), yy);
          }
          ctx.stroke(); ctx.setLineDash([]);
          label(ctx, "línea piezométrica", SX(0.06), (axisY - rpx(0.06)) - colH(0.06) - 8, C.amber, MONO_SM, "left");

          // etiquetas de velocidad
          var v2 = Q() / A2;
          label(ctx, "v₁=" + v1.toFixed(2) + " m/s", SX(0.15), axisY + rpx(0.15) + 16, C.dim, MONO_SM, "center");
          label(ctx, "v₂=" + v2.toFixed(2) + " m/s", SX(0.5), axisY + rpx(0.5) + 16, C.coral, MONO_SM, "center");
          arrow(ctx, ml + 6, axisY, ml + 26, axisY, C.dim, 1.5, 6);
          label(ctx, "flujo →", ml + 30, axisY - 8, C.dim, MONO_SM, "left");
        }
      };
    }
  });

})();
