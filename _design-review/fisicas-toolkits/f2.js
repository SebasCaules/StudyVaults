/* ============================================================
   f2.js — Física 2 (ITBA): oscilaciones, ondas, óptica física
   y geométrica, termodinámica. Once laboratorios TÁCTILES sobre
   SimKit. Script clásico (sin módulos), compatible file://.
   Refuerza los apuntes reales de la cursada 2024-2C.

   Regla de oro de esta ronda: TODA sim tiene al menos un handle
   arrastrable (env.addHandle) — el core hace hit-test, cursor
   grab/grabbing y dibuja el halo de affordance.
   ============================================================ */
(function () {
  "use strict";

  var C = window.SimKit.colors;         // paleta compartida
  var TAU = Math.PI * 2;
  var DEG = 180 / Math.PI;
  var MONO = "12px ui-monospace, monospace";
  var MONO_SM = "10px ui-monospace, monospace";

  /* ---------- helpers numéricos ---------- */
  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  /* ---------- puente handle <-> slider del core ----------
     Los sliders los construye el core ANTES de llamar create(),
     así que desde la sim podemos ubicarlos por su etiqueta y
     empujarles un valor: eso dispara el 'input' del core, que
     actualiza params Y el número mostrado. Así el drag y el
     slider quedan siempre sincronizados (sin desfasaje). */
  function sliderByLabel(env, token) {
    var card = env.canvas.closest && env.canvas.closest(".sim-card");
    if (!card) return null;
    var ctls = card.querySelectorAll(".ctl");
    for (var i = 0; i < ctls.length; i++) {
      var span = ctls[i].querySelector("label span");
      var inp = ctls[i].querySelector('input[type="range"]');
      if (span && inp && span.textContent.indexOf(token) >= 0) return inp;
    }
    return null;
  }
  function setSlider(inp, v) {
    if (!inp) return;
    inp.value = v;
    inp.dispatchEvent(new Event("input", { bubbles: true }));
  }

  /* ---------- helpers de dibujo ---------- */
  function txt(ctx, s, x, y, color, font, align, baseline) {
    ctx.fillStyle = color || C.dim;
    ctx.font = font || MONO_SM;
    if (align) ctx.textAlign = align;
    if (baseline) ctx.textBaseline = baseline;
    ctx.fillText(s, x, y);
    if (align) ctx.textAlign = "left";
    if (baseline) ctx.textBaseline = "alphabetic";
  }

  function drawSpring(ctx, x0, x1, y, coils, amp, color, lw) {
    ctx.strokeStyle = color; ctx.lineWidth = lw || 2;
    ctx.lineJoin = "round";
    ctx.beginPath();
    var lead = 12;
    var span = (x1 - x0) - 2 * lead;
    if (span < 4) span = 4;
    ctx.moveTo(x0, y);
    ctx.lineTo(x0 + lead, y);
    var seg = span / coils;
    for (var i = 0; i < coils; i++) {
      var sx = x0 + lead + i * seg;
      ctx.lineTo(sx + seg * 0.25, y - amp);
      ctx.lineTo(sx + seg * 0.75, y + amp);
      ctx.lineTo(sx + seg, y);
    }
    ctx.lineTo(x1, y);
    ctx.stroke();
  }

  function drawWall(ctx, x, y0, y1, color) {
    ctx.strokeStyle = color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
    ctx.lineWidth = 1;
    for (var yy = y0; yy < y1; yy += 8) {
      ctx.beginPath(); ctx.moveTo(x, yy + 8); ctx.lineTo(x - 7, yy); ctx.stroke();
    }
  }

  function arrow(ctx, x1, y1, x2, y2, head, color, lw) {
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw || 2;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    var ang = Math.atan2(y2 - y1, x2 - x1);
    var h = head || 7;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - h * Math.cos(ang - 0.4), y2 - h * Math.sin(ang - 0.4));
    ctx.lineTo(x2 - h * Math.cos(ang + 0.4), y2 - h * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fill();
  }

  function dashLine(ctx, x1, y1, x2, y2, color, lw) {
    ctx.save();
    ctx.setLineDash([5, 5]); ctx.strokeStyle = color; ctx.lineWidth = lw || 1;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.restore();
  }

  function line(ctx, x1, y1, x2, y2, color, lw) {
    ctx.strokeStyle = color; ctx.lineWidth = lw || 1;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }

  // longitud de onda (nm) -> color CSS aproximado (Bruton)
  function nmToRGBArr(nm) {
    var r = 0, g = 0, b = 0;
    if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
    else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
    else if (nm <= 780) { r = 1; }
    var f = 1;
    if (nm < 420) f = 0.3 + 0.7 * (nm - 380) / 40;
    else if (nm > 700) f = 0.3 + 0.7 * (780 - nm) / 80;
    function ch(x) { return Math.round(255 * Math.pow(clamp(x, 0, 1) * f, 0.8)); }
    return [ch(r), ch(g), ch(b)];
  }
  function nmToRGB(nm) { var a = nmToRGBArr(nm); return "rgb(" + a[0] + "," + a[1] + "," + a[2] + ")"; }

  // fotones marchando a lo largo de un segmento (sentido de propagación)
  function drawMarch(ctx, x1, y1, x2, y2, ph, color, r) {
    var n = 5;
    var frac = (ph * 0.6) % 1;
    ctx.fillStyle = color;
    for (var i = 0; i < n; i++) {
      var t = ((i / n) + frac) % 1;
      var px = x1 + (x2 - x1) * t, py = y1 + (y2 - y1) * t;
      ctx.beginPath(); ctx.arc(px, py, r || 1.5, 0, TAU); ctx.fill();
    }
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

  // dibuja el "icono" que acompaña a un handle (punto lleno + anillo lo pone el core)
  function grabDot(ctx, x, y, color, r) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, r || 4, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // pastilla de estado sobre el canvas (el core no puede mostrar readouts de texto,
  // así que lo cualitativo va acá, bien visible)
  function badge(ctx, s, x, y, color, align) {
    ctx.save();
    ctx.font = MONO;
    var w = ctx.measureText(s).width + 16;
    var bx = align === "right" ? x - w : x;
    ctx.fillStyle = "rgba(0,0,0,0.38)";
    roundRect(ctx, bx, y, w, 21, 7); ctx.fill();
    ctx.strokeStyle = color; ctx.globalAlpha = 0.6; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = color; ctx.textBaseline = "middle";
    ctx.fillText(s, bx + 8, y + 11);
    ctx.restore();
  }

  /* ============================================================
     TAB
     ============================================================ */
  window.SimKit.registerTab({
    id: "f2",
    intro: "Once laboratorios táctiles de Física 2: oscilaciones, ondas en cuerda, óptica " +
      "física y geométrica, y termodinámica. Todo elemento con halo punteado se agarra y se " +
      "arrastra — soltá masas, corré rendijas, mové objetos y estirá ciclos con el mouse."
  });

  /* ============================================================
     SIM 1 — Oscilador amortiguado
     ============================================================ */
  window.SimKit.registerSim({
    tab: "f2",
    id: "amortiguado",
    title: "Oscilador amortiguado",
    refs: "Resumen p.1,8 · Teórica p.3–4 · Guía 3",
    blurb: "Masa-resorte con fricción viscosa. Arrastrá la masa para fijar la amplitud inicial y " +
      "soltala: arranca desde ahí. Elegí el régimen o dejá que m, k y b lo definan; la envolvente " +
      "±A·e^(−γt) marca el decaimiento sobre x(t).",
    formula: "ẍ + 2γẋ + ω₀²x = 0    ·    x(t) = A·e^(−γt)·cos(ω_d t + φ)    ·    γ = b/2m,  ω₀ = √(k/m)",
    stageHeight: 300,
    controls: [
      { type: "range", key: "m", label: "masa m", min: 0.3, max: 3, step: 0.05, value: 1, unit: "kg" },
      { type: "range", key: "k", label: "rigidez k", min: 2, max: 30, step: 0.5, value: 12, unit: "N/m" },
      { type: "range", key: "b", label: "amort. b", min: 0.1, max: 12, step: 0.1, value: 1.2, unit: "N·s/m" },
      { type: "segment", key: "mode", label: "régimen", value: "sub", options: [
        ["sub", "Sub"], ["crit", "Crít."], ["sobre", "Sobre"], ["libre", "Libre (b)"]
      ] }
    ],
    readouts: [
      { key: "A0", label: "A inicial", unit: "m", digits: 2 },
      { key: "gamma", label: "γ", unit: "s⁻¹", digits: 2 },
      { key: "wd", label: "ω_d", unit: "rad/s", digits: 2 },
      { key: "Q", label: "factor Q", digits: 2 },
      { key: "zeta", label: "ζ = γ/ω₀", digits: 2 }
    ],
    plot: {
      window: 14, height: 150, autoY: false, yMin: -1.18, yMax: 1.18,
      xLabel: "t (s)", yLabel: "x",
      series: [
        { key: "x", label: "x(t)", color: C.blue },
        { key: "ep", label: "±A·e^(−γt)", color: C.dim },
        { key: "en", label: "", color: C.dim }
      ]
    },
    create: function (env) {
      var st = { x: 1, v: 0, env: 1, t: 0, w0: 0, g: 0, A0: 1, dragging: false,
        center: 200, ampPx: 100, yMid: 150, mx: 260, reg: "Subamortiguado" };

      function effGamma(w0) {
        var m = env.params.mode;
        if (m === "sub") return 0.22 * w0;
        if (m === "crit") return w0;
        if (m === "sobre") return 2.4 * w0;
        return env.params.b / (2 * env.params.m);   // libre
      }
      function params() {
        var w0 = Math.sqrt(env.params.k / env.params.m);
        return { w0: w0, g: effGamma(w0) };
      }
      function report() {
        var p = params();
        var wd = p.w0 > p.g ? Math.sqrt(p.w0 * p.w0 - p.g * p.g) : NaN;
        var reg, tol = 0.02 * p.w0;
        if (Math.abs(p.g - p.w0) <= tol) reg = "Crítico";
        else if (p.g < p.w0) reg = "Subamortiguado";
        else reg = "Sobreamortiguado";
        st.reg = reg;
        env.setReadout("A0", Math.abs(st.A0));
        env.setReadout("gamma", p.g);
        env.setReadout("wd", isNaN(wd) ? "—" : wd);
        env.setReadout("Q", p.w0 / (2 * p.g));
        env.setReadout("zeta", p.g / p.w0);
      }

      env.addHandle({
        x: function () { return st.mx; },
        y: function () { return st.yMid; },
        r: 30,
        onStart: function () { st.dragging = true; },
        onDrag: function (px) {
          st.A0 = clamp((px - st.center) / st.ampPx, -1.05, 1.05);
          st.x = st.A0; st.v = 0; st.env = Math.abs(st.A0); st.t = 0; env.plot.clear();
        },
        onEnd: function () {
          st.dragging = false;
          var p = params();
          st.env = Math.abs(st.A0); st.x = st.A0; st.v = -p.g * st.A0; st.t = 0; env.plot.clear();
        }
      });

      return {
        reset: function () {
          var p = params();
          st.w0 = p.w0; st.g = p.g; st.A0 = 1;
          st.x = 1; st.v = -p.g * 1;
          st.env = 1; st.t = 0;
          env.plot.clear();
        },
        step: function (dt) {
          if (st.dragging) { report(); return; }
          var p = params();
          st.w0 = p.w0; st.g = p.g;
          var a = -2 * p.g * st.v - p.w0 * p.w0 * st.x;
          st.v += a * dt;
          st.x += st.v * dt;
          st.env *= Math.exp(-p.g * dt);
          st.t += dt;
          env.plot.push(st.t, { x: st.x, ep: st.env, en: -st.env });
          report();
        },
        draw: function (ctx, W, H) {
          var yMid = H * 0.5;
          var wallX = 44;
          var center = W * 0.56;
          var ampPx = Math.min(W * 0.26, center - wallX - 70);
          st.center = center; st.ampPx = ampPx; st.yMid = yMid;
          var mx = clamp(center + st.x * ampPx, wallX + 60, W - 46);
          st.mx = mx;

          dashLine(ctx, center, yMid - 60, center, yMid + 60, C.gridStrong, 1);
          txt(ctx, "equilibrio", center + 6, yMid - 48, C.dim);

          drawWall(ctx, wallX, yMid - 40, yMid + 40, C.dim);
          var coils = Math.round(clamp(env.params.k / 2, 6, 16));
          drawSpring(ctx, wallX, mx - 26, yMid, coils, 11, C.dim, 2);

          var s = 52;
          ctx.fillStyle = env.tint;
          ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 1;
          roundRect(ctx, mx - 26, yMid - s / 2, s, s, 8); ctx.fill(); ctx.stroke();
          txt(ctx, "m", mx, yMid + 4, C.ink, MONO, "center");

          if (Math.abs(st.v) > 0.02 && !st.dragging) {
            arrow(ctx, mx, yMid - s / 2 - 10, mx + clamp(st.v * ampPx * 0.5, -70, 70),
              yMid - s / 2 - 10, 7, C.amber, 2);
          }
          var regCol = st.reg === "Crítico" ? C.amber : (st.reg === "Sobreamortiguado" ? C.coral : env.tint);
          badge(ctx, st.reg, W - 12, 12, regCol, "right");
          if (st.dragging) txt(ctx, "soltá para oscilar", mx, yMid + s / 2 + 18, C.amber, MONO_SM, "center");
          else txt(ctx, "arrastrá la masa ↔", wallX, H - 8, C.dim);
        }
      };
    }
  });

  /* ============================================================
     SIM 2 — Resonancia forzada
     ============================================================ */
  window.SimKit.registerSim({
    tab: "f2",
    id: "resonancia",
    title: "Resonancia forzada",
    refs: "Resumen p.1,8 · Teórica p.5 · Guía 4–5",
    blurb: "Forzante F₀cos(ωt) sobre el oscilador. Arrastrá el punto operativo sobre la curva A(ω) " +
      "para fijar ω y mirá crecer la amplitud al cruzar la resonancia; con b chico el pico se agudiza " +
      "y el desfasaje pasa de 0 a π.",
    formula: "A(ω) = (F₀/m) / √((ω₀²−ω²)² + (2γω)²)    ·    tan δ = 2γω/(ω₀²−ω²)    ·    ω_res = √(ω₀²−2γ²)",
    stageHeight: 320,
    controls: [
      { type: "range", key: "w0", label: "ω₀ natural", min: 1.5, max: 8, step: 0.1, value: 4, unit: "rad/s" },
      { type: "range", key: "w", label: "ω forzante", min: 0.2, max: 12, step: 0.05, value: 4, unit: "rad/s" },
      { type: "range", key: "b", label: "amort. b", min: 0.1, max: 6, step: 0.1, value: 0.6, unit: "N·s/m" },
      { type: "range", key: "F0", label: "fuerza F₀", min: 0.5, max: 6, step: 0.1, value: 2, unit: "N" }
    ],
    readouts: [
      { key: "A", label: "amplitud A", unit: "m", digits: 3 },
      { key: "phi", label: "desfasaje δ", unit: "°", digits: 0 },
      { key: "w0", label: "ω₀", unit: "rad/s", digits: 2 },
      { key: "wres", label: "ω_res", unit: "rad/s", digits: 2 }
    ],
    plot: {
      window: 12, height: 148, autoY: true, xLabel: "t (s)",
      series: [
        { key: "x", label: "x(t)", color: C.blue },
        { key: "F", label: "F(t) (norm)", color: C.coral }
      ]
    },
    create: function (env) {
      var st = { t: 0, map: { gx0: 46, gx1: 300, wMax: 12, gy0: 130, gy1: 280, yTop: 1 } };
      var wInput = sliderByLabel(env, "forzante");

      function amp(w) {
        var w0 = env.params.w0, g = env.params.b / 2, F0 = env.params.F0;
        var d = (w0 * w0 - w * w);
        return (F0) / Math.sqrt(d * d + (2 * g * w) * (2 * g * w));
      }
      function phase(w) {
        var w0 = env.params.w0, g = env.params.b / 2;
        return Math.atan2(2 * g * w, w0 * w0 - w * w);  // 0..π
      }
      function wres() {
        var w0 = env.params.w0, g = env.params.b / 2;
        var r = w0 * w0 - 2 * g * g;
        return r > 0 ? Math.sqrt(r) : NaN;
      }

      env.addHandle({
        x: function () { var m = st.map; return m.gx0 + (env.params.w / m.wMax) * (m.gx1 - m.gx0); },
        y: function () { var m = st.map; return m.gy1 - (amp(env.params.w) / m.yTop) * (m.gy1 - m.gy0); },
        r: 16,
        onDrag: function (px) {
          var m = st.map;
          var w = clamp((px - m.gx0) / (m.gx1 - m.gx0) * m.wMax, 0.2, 12);
          setSlider(wInput, w);
        }
      });

      return {
        reset: function () { st.t = 0; env.plot.clear(); },
        step: function (dt) {
          st.t += dt;
          var w = env.params.w, A = amp(w), d = phase(w);
          env.plot.push(st.t, { x: A * Math.cos(w * st.t - d), F: A * Math.cos(w * st.t) });
          var wr = wres();
          env.setReadout("A", A);
          env.setReadout("phi", d * DEG);
          env.setReadout("w0", env.params.w0);
          env.setReadout("wres", isNaN(wr) ? "—" : wr);
        },
        draw: function (ctx, W, H) {
          var padL = 46, padR = 16;
          var animH = 116;
          var w = env.params.w, A = amp(w), d = phase(w);

          var yA = animH * 0.5;
          var wallX = 40, center = W * 0.42;
          var maxAmp = Math.min(120, center - wallX - 60);
          var dispPx = maxAmp * Math.tanh(A / 1.6) * Math.cos(w * st.t - d);
          var mx = clamp(center + dispPx, wallX + 50, center + maxAmp + 30);
          drawWall(ctx, wallX, yA - 26, yA + 26, C.dim);
          drawSpring(ctx, wallX, mx - 20, yA, 10, 8, C.dim, 2);
          ctx.fillStyle = env.tint;
          roundRect(ctx, mx - 20, yA - 18, 40, 36, 7); ctx.fill();
          var Fnow = env.params.F0 * Math.cos(w * st.t);
          var fLen = (Fnow / 6) * 60;
          if (Math.abs(fLen) > 2) arrow(ctx, mx, yA - 34, mx + fLen, yA - 34, 7, C.coral, 2.4);
          txt(ctx, "F(t)", W - 80, 16, C.dim);
          arrow(ctx, W - 46, 12, W - 22, 12, 6, C.coral, 2);

          var gx0 = padL, gx1 = W - padR;
          var gy0 = animH + 14, gy1 = H - 22;
          var wMax = 12;
          var Amax = 1e-6, N = 260, i;
          for (i = 0; i <= N; i++) { var a = amp((i / N) * wMax); if (a > Amax) Amax = a; }
          var yTop = Amax * 1.12;
          st.map = { gx0: gx0, gx1: gx1, wMax: wMax, gy0: gy0, gy1: gy1, yTop: yTop };
          function X(ww) { return gx0 + (ww / wMax) * (gx1 - gx0); }
          function Y(aa) { return gy1 - (aa / yTop) * (gy1 - gy0); }

          line(ctx, gx0, gy1, gx1, gy1, C.grid, 1);
          line(ctx, gx0, gy0, gx0, gy1, C.grid, 1);
          txt(ctx, "A(ω)", gx0 + 4, gy0 + 4, C.dim);
          txt(ctx, "ω →", gx1 - 26, gy1 + 14, C.dim);

          ctx.strokeStyle = env.tint; ctx.lineWidth = 2;
          ctx.beginPath();
          for (var j = 0; j <= N; j++) {
            var ww = (j / N) * wMax, px = X(ww), py = Y(amp(ww));
            if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();

          var wr = wres();
          if (!isNaN(wr) && wr <= wMax) {
            dashLine(ctx, X(wr), gy0, X(wr), gy1, C.amber, 1);
            txt(ctx, "ω_res", X(wr) + 4, gy0 + 14, C.amber);
          }
          dashLine(ctx, X(env.params.w0), gy0, X(env.params.w0), gy1, C.gridStrong, 1);
          txt(ctx, "ω₀", X(env.params.w0) + 4, gy1 - 6, C.dim);

          var opx = X(w), opy = Y(A);
          dashLine(ctx, opx, opy, opx, gy1, C.blue, 1);
          dashLine(ctx, gx0, opy, opx, opy, C.blue, 1);
          grabDot(ctx, opx, opy, C.blue, 4.5);
          txt(ctx, "arrastrá ω →", opx + 10, opy - 8, C.dim);
        }
      };
    }
  });

  /* ============================================================
     SIM 3 — Ondas estacionarias en cuerda
     ============================================================ */
  window.SimKit.registerSim({
    tab: "f2",
    id: "estacionarias",
    title: "Ondas estacionarias en cuerda",
    refs: "Resumen p.1,9 · Teórica p.10–12 · parciales",
    blurb: "Modos normales de una cuerda de L = 1 m. Arrastrá un antinodo para fijar la amplitud; " +
      "cambiá el modo y la condición de borde. Los nodos no se mueven y v = √(T/μ) fija la frecuencia.",
    formula: "ψ(x,t) = A·sin(kx)·cos(ωt)    ·    Fija–Fija: λ_n = 2L/n    ·    Fija–Libre: λ_n = 4L/n (n impar)    ·    v = √(T/μ)",
    stageHeight: 300,
    controls: [
      { type: "segment", key: "bc", label: "condición de borde", value: "ff", options: [
        ["ff", "Fija–Fija"], ["fl", "Fija–Libre"]
      ] },
      { type: "range", key: "n", label: "modo n", min: 1, max: 8, step: 1, value: 3 },
      { type: "range", key: "T", label: "tensión T", min: 10, max: 120, step: 2, value: 40, unit: "N" },
      { type: "range", key: "mu", label: "densidad μ", min: 1, max: 20, step: 0.5, value: 8, unit: "g/m" }
    ],
    readouts: [
      { key: "f", label: "f_n", unit: "Hz", digits: 1 },
      { key: "lam", label: "λ_n", unit: "m", digits: 3 },
      { key: "v", label: "v = √(T/μ)", unit: "m/s", digits: 1 },
      { key: "A", label: "amplitud A", unit: "cm", digits: 1 }
    ],
    plot: {
      window: 8, height: 130, autoY: false, yMin: -1.15, yMax: 1.15,
      xLabel: "t (s)", yLabel: "y",
      series: [{ key: "y", label: "y(antinodo, t)", color: C.blue }]
    },
    create: function (env) {
      var L = 1, K = 150;
      var st = { t: 0, A: 0.9, yMid: 150, amp: 90, anx: 200 };

      function model() {
        var mu = env.params.mu / 1000;
        var v = Math.sqrt(env.params.T / mu);
        var n = env.params.n;
        var nef, k, lam, f;
        if (env.params.bc === "fl") {
          nef = (n % 2 === 0) ? Math.max(1, n - 1) : n;
          k = nef * Math.PI / (2 * L);
          lam = 4 * L / nef;
          f = nef * v / (4 * L);
        } else {
          nef = n;
          k = nef * Math.PI / L;
          lam = 2 * L / nef;
          f = nef * v / (2 * L);
        }
        return { v: v, nef: nef, k: k, lam: lam, f: f };
      }

      env.addHandle({
        x: function () { return st.anx; },
        y: function () { return st.yMid - st.amp * st.A; },
        r: 16,
        onDrag: function (px, py) { st.A = clamp((st.yMid - py) / st.amp, 0.2, 1.08); }
      });

      return {
        reset: function () { st.t = 0; st.A = 0.9; env.plot.clear(); },
        step: function (dt) {
          var mo = model();
          var wVis = TAU * mo.f / K;
          st.t += dt;
          env.plot.push(st.t, { y: st.A * Math.cos(wVis * st.t) });
          env.setReadout("f", mo.f);
          env.setReadout("lam", mo.lam);
          env.setReadout("v", mo.v);
          env.setReadout("A", st.A * 5);   // escala cosmética: A=1 -> 5 cm
        },
        draw: function (ctx, W, H) {
          var mo = model();
          var padL = 54, padR = 40;
          var yMid = H * 0.5;
          var amp = Math.min(H * 0.30, 90) * st.A;
          var ampMax = Math.min(H * 0.30, 90);
          st.yMid = yMid; st.amp = ampMax;
          var x0 = padL, x1 = W - padR;
          var wVis = TAU * mo.f / K;
          var ph = Math.cos(wVis * st.t);
          function px(x) { return x0 + (x / L) * (x1 - x0); }
          // primer antinodo (posición estable del handle)
          st.anx = px(0.5 * Math.PI / mo.k);

          ctx.strokeStyle = "rgba(146,207,242,0.28)"; ctx.lineWidth = 1;
          for (var sgn = -1; sgn <= 1; sgn += 2) {
            ctx.beginPath();
            for (var i = 0; i <= 200; i++) {
              var x = (i / 200) * L, yy = yMid - sgn * amp * Math.abs(Math.sin(mo.k * x));
              if (i === 0) ctx.moveTo(px(x), yy); else ctx.lineTo(px(x), yy);
            }
            ctx.stroke();
          }

          dashLine(ctx, x0, yMid, x1, yMid, C.grid, 1);

          ctx.strokeStyle = env.tint; ctx.lineWidth = 2.4;
          ctx.beginPath();
          for (var j = 0; j <= 240; j++) {
            var xx = (j / 240) * L;
            var y = yMid - amp * Math.sin(mo.k * xx) * ph;
            if (j === 0) ctx.moveTo(px(xx), y); else ctx.lineTo(px(xx), y);
          }
          ctx.stroke();

          var jn = 0, xn;
          while ((xn = jn * Math.PI / mo.k) <= L + 1e-9) {
            ctx.strokeStyle = C.text; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(px(xn), yMid, 4, 0, TAU); ctx.stroke();
            jn++;
          }
          var ja = 0, xa;
          while ((xa = (ja + 0.5) * Math.PI / mo.k) <= L + 1e-9) {
            ctx.fillStyle = C.amber;
            ctx.beginPath(); ctx.arc(px(xa), yMid, 3, 0, TAU); ctx.fill();
            ja++;
          }

          drawWall(ctx, x0, yMid - ampMax - 6, yMid + ampMax + 6, C.dim);
          if (env.params.bc === "fl") {
            var yEnd = yMid - amp * Math.sin(mo.k * L) * ph;
            ctx.strokeStyle = C.dim; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(x1 + 8, yMid - ampMax - 6); ctx.lineTo(x1 + 8, yMid + ampMax + 6); ctx.stroke();
            ctx.strokeStyle = env.tint;
            ctx.beginPath(); ctx.arc(x1, yEnd, 5, 0, TAU); ctx.stroke();
          } else {
            drawWall(ctx, x1 + 8, yMid - ampMax - 6, yMid + ampMax + 6, C.dim);
          }

          // afordancia del antinodo arrastrable
          grabDot(ctx, st.anx, yMid - amp, C.amber, 3);

          txt(ctx, "nodos ○   antinodos ●   ·   arrastrá el antinodo ↕", x0, H - 8, C.dim);
          txt(ctx, "L = 1 m", x1, H - 8, C.dim, MONO_SM, "right");
        }
      };
    }
  });

  /* ============================================================
     SIM 4 — Young + envolvente de difracción
     ============================================================ */
  window.SimKit.registerSim({
    tab: "f2",
    id: "young",
    title: "Young + difracción",
    refs: "Resumen p.3–4,15 · Teórica p.14–18 · Guía 23",
    blurb: "Doble rendija de ancho finito. Arrastrá una rendija para cambiar d en vivo: las franjas " +
      "de interferencia cos²γ quedan moduladas por la campana de difracción (sin β/β)²; donde d/a es " +
      "entero, el orden desaparece.",
    formula: "I = 4I₀·cos²γ·(sin β/β)²   ·   γ = πd·sinθ/λ,  β = πa·sinθ/λ   ·   Δy = λL/d   ·   mín. difr.: sinθ = pλ/a",
    stageHeight: 350,
    controls: [
      { type: "range", key: "d", label: "separación d", min: 20, max: 250, step: 5, value: 90, unit: "µm" },
      { type: "range", key: "a", label: "ancho rendija a", min: 5, max: 80, step: 1, value: 18, unit: "µm" },
      { type: "range", key: "lam", label: "λ (láser)", min: 400, max: 680, step: 5, value: 540, unit: "nm" },
      { type: "range", key: "L", label: "pantalla L", min: 0.5, max: 3, step: 0.1, value: 1.5, unit: "m" }
    ],
    readouts: [
      { key: "dy", label: "interfranja Δy", unit: "mm", digits: 2 },
      { key: "dmin", label: "1er mín. difr.", unit: "mm", digits: 1 },
      { key: "miss", label: "orden ausente d/a", digits: 1 }
    ],
    create: function (env) {
      var st = { t: 0, cx: 300, scalePx: 0.5, rulerY: 22 };
      var dInput = sliderByLabel(env, "separación");
      var maxHalfD = 250 * 0.5;   // se recalcula en draw

      function intensity(sinT) {
        var d = env.params.d * 1e-6, a = env.params.a * 1e-6, lam = env.params.lam * 1e-9;
        var g = Math.PI * d * sinT / lam;
        var b = Math.PI * a * sinT / lam;
        var sinc = (Math.abs(b) < 1e-9) ? 1 : Math.sin(b) / b;
        return { I: Math.cos(g) * Math.cos(g) * sinc * sinc, env: sinc * sinc };
      }

      env.addHandle({
        x: function () { return st.cx + (env.params.d * st.scalePx) / 2; },
        y: function () { return st.rulerY; },
        r: 15,
        onDrag: function (px) {
          var half = clamp(px - st.cx, 6, maxHalfD);
          var d = clamp((2 * half) / st.scalePx, 20, 250);
          setSlider(dInput, d);
        }
      });

      return {
        reset: function () { st.t = 0; },
        step: function (dt) {
          st.t += dt;
          var d = env.params.d * 1e-6, a = env.params.a * 1e-6, lam = env.params.lam * 1e-9, L = env.params.L;
          env.setReadout("dy", (lam * L / d) * 1000);
          env.setReadout("dmin", (lam * L / a) * 1000);
          env.setReadout("miss", env.params.d / env.params.a);
        },
        draw: function (ctx, W, H) {
          var col = nmToRGB(env.params.lam);
          var a = env.params.a * 1e-6, lam = env.params.lam * 1e-9, L = env.params.L, d = env.params.d * 1e-6;
          var Yr = 2.4 * (lam * L / a);
          var padL = 20, padR = 20;
          var gx0 = padL, gx1 = W - padR;
          var gyTop = 44, gyBase = H * 0.66;
          var stripTop = gyBase + 26, stripH = 44, i;

          // --- regla de rendijas (arrastrable) en la banda superior ---
          st.cx = (gx0 + gx1) / 2;
          st.scalePx = ((gx1 - gx0) * 0.32) / 250;   // 250 µm ocupa ~32% del ancho
          maxHalfD = (gx1 - gx0) * 0.32 / 2 + 20;
          var half = (env.params.d * st.scalePx) / 2;
          var slitW = Math.max(2, env.params.a * st.scalePx);
          // barra de la máscara
          line(ctx, gx0 + 40, st.rulerY, gx1 - 40, st.rulerY, C.gridStrong, 1);
          [-1, 1].forEach(function (s) {
            var xC = st.cx + s * half;
            ctx.fillStyle = env.tint;
            ctx.fillRect(xC - slitW / 2, st.rulerY - 7, slitW, 14);
          });
          grabDot(ctx, st.cx + half, st.rulerY, C.blue, 3);
          txt(ctx, "d", st.cx - 4, st.rulerY - 10, C.dim);
          txt(ctx, "arrastrá una rendija ↔", gx0, st.rulerY - 10, C.dim);

          function px(ym) { return (gx0 + gx1) / 2 + (ym / Yr) * ((gx1 - gx0) / 2); }
          function sinTheta(ym) { return (ym) / L; }

          // envolvente de difracción
          ctx.save();
          ctx.setLineDash([4, 4]); ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1.2;
          ctx.beginPath();
          var Wp = gx1 - gx0;
          for (i = 0; i <= Wp; i++) {
            var ym = (-Yr) + (i / Wp) * (2 * Yr);
            var e = intensity(sinTheta(ym)).env;
            var X = gx0 + i, Yv = gyBase - e * (gyBase - gyTop);
            if (i === 0) ctx.moveTo(X, Yv); else ctx.lineTo(X, Yv);
          }
          ctx.stroke();
          ctx.restore();

          // curva de intensidad
          ctx.beginPath();
          ctx.moveTo(gx0, gyBase);
          for (i = 0; i <= Wp; i++) {
            var ym2 = (-Yr) + (i / Wp) * (2 * Yr);
            var I = intensity(sinTheta(ym2)).I;
            ctx.lineTo(gx0 + i, gyBase - I * (gyBase - gyTop));
          }
          ctx.lineTo(gx1, gyBase);
          ctx.closePath();
          ctx.fillStyle = col; ctx.globalAlpha = 0.30; ctx.fill(); ctx.globalAlpha = 1;
          ctx.strokeStyle = col; ctx.lineWidth = 1.6;
          ctx.beginPath();
          for (i = 0; i <= Wp; i++) {
            var ym3 = (-Yr) + (i / Wp) * (2 * Yr);
            var I3 = intensity(sinTheta(ym3)).I;
            var X3 = gx0 + i, Y3 = gyBase - I3 * (gyBase - gyTop);
            if (i === 0) ctx.moveTo(X3, Y3); else ctx.lineTo(X3, Y3);
          }
          ctx.stroke();

          line(ctx, gx0, gyBase, gx1, gyBase, C.grid, 1);

          for (var p = 1; p <= 3; p++) {
            var ymin = p * lam * L / a;
            if (ymin > Yr) break;
            [px(ymin), px(-ymin)].forEach(function (xx) {
              dashLine(ctx, xx, gyTop, xx, gyBase, C.amber, 1);
            });
            if (p === 1) txt(ctx, "mín. difr.", px(ymin) + 3, gyTop + 12, C.amber);
          }

          var dy = lam * L / d;
          if (dy < Yr) {
            var xa = px(0), xb = px(dy), yBr = gyTop + 4;
            ctx.strokeStyle = C.blue; ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(xa, yBr + 5); ctx.lineTo(xa, yBr); ctx.lineTo(xb, yBr); ctx.lineTo(xb, yBr + 5);
            ctx.stroke();
            txt(ctx, "Δy", (xa + xb) / 2 - 6, yBr - 3, C.blue);
          }

          for (i = 0; i <= Wp; i += 1) {
            var ym4 = (-Yr) + (i / Wp) * (2 * Yr);
            var I4 = intensity(sinTheta(ym4)).I;
            ctx.globalAlpha = clamp(I4, 0, 1);
            ctx.fillStyle = col;
            ctx.fillRect(gx0 + i, stripTop, 1.4, stripH);
          }
          ctx.globalAlpha = 1;
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 1;
          ctx.strokeRect(gx0, stripTop, gx1 - gx0, stripH);
          txt(ctx, "pantalla", gx0 + 4, stripTop + stripH - 5, C.dim);
          txt(ctx, "y (mm) →  ±" + (Yr * 1000).toFixed(0), gx1, stripTop - 4, C.dim, MONO_SM, "right");
        }
      };
    }
  });

  /* ============================================================
     SIM 5 — Snell y reflexión total interna
     ============================================================ */
  window.SimKit.registerSim({
    tab: "f2",
    id: "snell",
    title: "Snell y reflexión total interna",
    refs: "Resumen p.1–2 · Teórica p.13 · parciales óptica",
    blurb: "Rayo cruzando la interfaz entre dos medios. Arrastrá el extremo del rayo incidente (o usá " +
      "el slider); al superar θ_c (solo si n₁ > n₂) no hay refracción: reflexión total interna.",
    formula: "n₁·sinθ_i = n₂·sinθ_t    ·    θ_c = arcsin(n₂/n₁)  (n₁ > n₂)    ·    R crece hacia θ_c → 1 en TIR",
    stageHeight: 360,
    controls: [
      { type: "range", key: "n1", label: "n₁ (incidencia)", min: 1, max: 2.5, step: 0.01, value: 1.5, digits: 2 },
      { type: "range", key: "n2", label: "n₂ (transmisión)", min: 1, max: 2.5, step: 0.01, value: 1, digits: 2 },
      { type: "range", key: "thetaI", label: "θ incidente", min: 0, max: 89, step: 1, value: 35, unit: "°" }
    ],
    readouts: [
      { key: "ti", label: "θ_i", unit: "°", digits: 1 },
      { key: "tt", label: "θ_t (refract.)", unit: "°", digits: 1 },
      { key: "tc", label: "θ_c (crítico)", unit: "°", digits: 1 },
      { key: "R", label: "reflectancia R", unit: "%", digits: 0 }
    ],
    create: function (env) {
      var st = { ti: 35, ph: 0, Ox: 0, Oy: 0, Lr: 120 };
      var thetaInput = sliderByLabel(env, "incidente");

      function physics() {
        var n1 = env.params.n1, n2 = env.params.n2;
        var ti = st.ti * Math.PI / 180;
        var sinT = n1 * Math.sin(ti) / n2;
        var tir = sinT > 1;
        var tt = tir ? NaN : Math.asin(clamp(sinT, -1, 1));
        var tc = n1 > n2 ? Math.asin(n2 / n1) : NaN;
        var R, T;
        if (tir) { R = 1; T = 0; }
        else {
          var ci = Math.cos(ti), ct = Math.cos(tt);
          var rs = (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct);
          var rp = (n1 * ct - n2 * ci) / (n1 * ct + n2 * ci);
          R = (rs * rs + rp * rp) / 2; T = 1 - R;
        }
        return { n1: n1, n2: n2, ti: ti, tt: tt, tc: tc, tir: tir, R: R, T: T };
      }

      env.addHandle({
        x: function () { return st.Ox - st.Lr * Math.sin(st.ti * Math.PI / 180); },
        y: function () { return st.Oy - st.Lr * Math.cos(st.ti * Math.PI / 180); },
        r: 18,
        onDrag: function (px, py) {
          var dx = st.Ox - px, dy = st.Oy - py;
          if (dy <= 1) return;   // solo arriba de la interfaz
          var ang = Math.atan2(dx, dy) * DEG;   // desde la normal
          setSlider(thetaInput, clamp(Math.round(ang), 0, 89));
        }
      });

      return {
        reset: function () { st.ti = env.params.thetaI; st.ph = 0; },
        onControl: function (key, val) { if (key === "thetaI") st.ti = val; },
        step: function (dt) {
          st.ph += dt;
          var p = physics();
          env.setReadout("ti", st.ti);
          env.setReadout("tt", p.tir ? "—" : p.tt * DEG);
          env.setReadout("tc", isNaN(p.tc) ? "—" : p.tc * DEG);
          env.setReadout("R", p.R * 100);
        },
        draw: function (ctx, W, H) {
          var p = physics();
          var Ox = W * 0.5, Oy = H * 0.5;
          st.Ox = Ox; st.Oy = Oy;
          var Lr = Math.min(W, H) * 0.42;
          st.Lr = Lr;

          function medFill(n, alpha) {
            var t = clamp((n - 1) / 1.5, 0, 1);
            return "rgba(146,207,242," + (alpha * (0.06 + 0.16 * t)).toFixed(3) + ")";
          }
          ctx.fillStyle = medFill(p.n1, 1); ctx.fillRect(0, 0, W, Oy);
          ctx.fillStyle = medFill(p.n2, 1); ctx.fillRect(0, Oy, W, H - Oy);
          line(ctx, 0, Oy, W, Oy, C.gridStrong, 2);
          dashLine(ctx, Ox, Oy - Lr - 10, Ox, Oy + Lr + 10, C.dim, 1);

          txt(ctx, "n₁ = " + p.n1.toFixed(2), 12, 18, C.dim, "11px ui-monospace, monospace");
          txt(ctx, "n₂ = " + p.n2.toFixed(2), 12, H - 12, C.dim, "11px ui-monospace, monospace");

          if (!isNaN(p.tc)) {
            var xc = Ox - Lr * Math.sin(p.tc), yc = Oy - Lr * Math.cos(p.tc);
            dashLine(ctx, Ox, Oy, xc, yc, C.amber, 1);
            txt(ctx, "θ_c", xc - 4, yc - 4, C.amber);
          }

          var si = Math.sin(p.ti), ci = Math.cos(p.ti);
          var ix = Ox - Lr * si, iy = Oy - Lr * ci;
          arrow(ctx, ix, iy, Ox, Oy, 9, C.blue, 2.6);
          drawMarch(ctx, ix, iy, Ox, Oy, st.ph, C.blue, 1);
          grabDot(ctx, ix, iy, C.blue, 3);

          var rAlpha = 0.25 + 0.75 * p.R;
          ctx.globalAlpha = rAlpha;
          var rx = Ox + Lr * si, ry = Oy - Lr * ci;
          arrow(ctx, Ox, Oy, rx, ry, 8, C.coral, 1.4 + 2 * p.R);
          ctx.globalAlpha = 1;

          if (!p.tir) {
            var tAlpha = 0.2 + 0.8 * p.T;
            ctx.globalAlpha = tAlpha;
            var stt = Math.sin(p.tt), ctt = Math.cos(p.tt);
            var tx = Ox + Lr * stt, ty = Oy + Lr * ctt;
            arrow(ctx, Ox, Oy, tx, ty, 8, C.blue, 1.4 + 2 * p.T);
            drawMarch(ctx, Ox, Oy, tx, ty, st.ph, C.blue, 1);
            ctx.globalAlpha = 1;
          }

          ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(Ox, Oy, 26, -Math.PI / 2 - p.ti, -Math.PI / 2); ctx.stroke();
          if (!p.tir) { ctx.beginPath(); ctx.arc(Ox, Oy, 26, Math.PI / 2, Math.PI / 2 + p.tt); ctx.stroke(); }

          badge(ctx, p.tir ? "REFLEXIÓN TOTAL (TIR)" : "REFRACTA", W - 12, 12, p.tir ? C.coral : env.tint, "right");
          txt(ctx, "arrastrá el rayo ↖", W - 12, 44, C.dim, MONO_SM, "right");
        }
      };
    }
  });

  /* ============================================================
     SIM 6 — MAS y círculo de fase
     ============================================================ */
  window.SimKit.registerSim({
    tab: "f2",
    id: "circulo-fase",
    title: "MAS y círculo de fase",
    refs: "Resumen p.1,8,11 · Teórica p.2",
    blurb: "El MAS es la proyección de un movimiento circular uniforme. Arrastrá el fasor para fijar " +
      "amplitud A y fase φ₀; soltalo y sigue girando. La sombra sobre el eje x traza x(t) = A·cos(ωt+φ₀).",
    formula: "x(t) = A·cos(ωt+φ₀)   ·   v = −Aω·sin(ωt+φ₀)   ·   a = −ω²x   ·   K = ½mω²(A²−x²),  U = ½mω²x²",
    stageHeight: 300,
    controls: [
      { type: "range", key: "w", label: "ω angular", min: 0.4, max: 3.5, step: 0.05, value: 1.4, unit: "rad/s" }
    ],
    readouts: [
      { key: "A", label: "amplitud A", unit: "m", digits: 2 },
      { key: "phi", label: "fase φ₀", unit: "°", digits: 0 },
      { key: "T", label: "período T", unit: "s", digits: 2 },
      { key: "x", label: "x(t)", unit: "m", digits: 2 }
    ],
    plot: {
      window: 12, height: 140, autoY: false, yMin: -1.15, yMax: 1.15,
      xLabel: "t (s)", yLabel: "x",
      series: [{ key: "x", label: "x(t) = proyección", color: C.blue }]
    },
    create: function (env) {
      var st = { t: 0, A: 0.85, phi0: 0, dragging: false, cx: 150, cy: 150, Rmax: 100 };

      function angle() { return env.params.w * st.t + st.phi0; }
      function report() {
        var th = angle();
        env.setReadout("A", st.A);
        var deg = (st.phi0 * DEG) % 360; if (deg > 180) deg -= 360; if (deg < -180) deg += 360;
        env.setReadout("phi", deg);
        env.setReadout("T", TAU / env.params.w);
        env.setReadout("x", st.A * Math.cos(th));
      }

      env.addHandle({
        x: function () { return st.cx + st.A * st.Rmax * Math.cos(angle()); },
        y: function () { return st.cy - st.A * st.Rmax * Math.sin(angle()); },
        r: 16,
        onStart: function () { st.dragging = true; },
        onDrag: function (px, py) {
          var dx = px - st.cx, dy = st.cy - py;
          var dist = Math.hypot(dx, dy);
          st.A = clamp(dist / st.Rmax, 0.25, 1.08);
          var ang = Math.atan2(dy, dx);
          st.phi0 = ang - env.params.w * st.t;   // deja el fasor bajo el cursor
        },
        onEnd: function () { st.dragging = false; }
      });

      return {
        reset: function () { st.t = 0; st.A = 0.85; st.phi0 = 0; st.dragging = false; env.plot.clear(); },
        step: function (dt) {
          if (!st.dragging) {
            st.t += dt;
            env.plot.push(st.t, { x: st.A * Math.cos(angle()) });
          }
          report();
        },
        draw: function (ctx, W, H) {
          env.grid(ctx, W, H, 40);
          var cx = W * 0.30, cy = H * 0.5;
          var Rmax = Math.min(W * 0.20, H * 0.38);
          st.cx = cx; st.cy = cy; st.Rmax = Rmax;
          var th = angle();
          var Rpx = st.A * Rmax;
          var tipx = cx + Rpx * Math.cos(th), tipy = cy - Rpx * Math.sin(th);

          // círculo de referencia (máximo) + círculo actual
          ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(cx, cy, Rmax, 0, TAU); ctx.stroke();
          ctx.setLineDash([3, 4]); ctx.strokeStyle = C.gridStrong;
          ctx.beginPath(); ctx.arc(cx, cy, Rpx, 0, TAU); ctx.stroke(); ctx.setLineDash([]);

          // eje x (horizontal) con la sombra proyectada
          var axisY = cy;
          line(ctx, cx - Rmax - 6, axisY, W - 20, axisY, C.grid, 1);
          line(ctx, cx, cy - Rmax - 6, cx, cy + Rmax + 6, C.grid, 1);
          txt(ctx, "x", W - 26, axisY - 6, C.dim);

          // fasor
          arrow(ctx, cx, cy, tipx, tipy, 8, env.tint, 2.4);
          // conector vertical fasor -> eje x (proyección)
          var projX = tipx;
          dashLine(ctx, tipx, tipy, projX, axisY, C.amber, 1);
          grabDot(ctx, projX, axisY, C.amber, 4);   // sombra sobre el eje
          // vector velocidad de la sombra (tangente proyectada)
          var vShadow = -st.A * env.params.w * Math.sin(th);
          if (Math.abs(vShadow) > 0.02)
            arrow(ctx, projX, axisY + 16, projX + clamp(vShadow * Rmax * 0.5, -60, 60), axisY + 16, 6, C.coral, 2);

          // grab dot en la punta del fasor
          grabDot(ctx, tipx, tipy, env.tint, 4);

          // barras de energía K/U a la derecha
          var bx = W - 46, by0 = 24, bh = 70, bw = 12;
          var frac = Math.cos(th) * Math.cos(th);   // U/E = x²/A²
          ctx.fillStyle = C.grid; ctx.fillRect(bx, by0, bw, bh); ctx.fillRect(bx + 18, by0, bw, bh);
          ctx.fillStyle = C.coral; ctx.fillRect(bx, by0 + bh * (1 - (1 - frac)), bw, bh * (1 - frac));       // K
          ctx.fillStyle = env.tint; ctx.fillRect(bx + 18, by0 + bh * (1 - frac), bw, bh * frac);            // U
          txt(ctx, "K", bx + 2, by0 + bh + 12, C.coral);
          txt(ctx, "U", bx + 20, by0 + bh + 12, env.tint);

          if (st.dragging) txt(ctx, "fijando A y φ₀…", cx, cy + Rmax + 20, C.amber, MONO_SM, "center");
          else txt(ctx, "arrastrá el fasor ↻", cx, cy + Rmax + 20, C.dim, MONO_SM, "center");
        }
      };
    }
  });

  /* ============================================================
     SIM 7 — Trazador de lentes y espejos
     ============================================================ */
  window.SimKit.registerSim({
    tab: "f2",
    id: "lentes",
    title: "Trazador de lentes y espejos",
    refs: "Resumen p.1–2,9 · parciales (dioptrio/lente/espejo)",
    blurb: "Arrastrá el objeto (flecha) sobre el eje óptico y elegí el elemento. Se trazan los rayos " +
      "principales y se arma la imagen: real o virtual, derecha o invertida, con s, s' y el aumento en vivo.",
    formula: "1/s + 1/s' = 1/f   ·   m = −s'/s   ·   lente convergente/espejo cóncavo: f>0   ·   f = R/2 (espejo)",
    stageHeight: 340,
    controls: [
      { type: "segment", key: "kind", label: "elemento", value: "conv", options: [
        ["conv", "Lente +"], ["div", "Lente −"], ["conc", "Espejo cón."], ["convex", "Espejo cvx."]
      ] },
      { type: "range", key: "f", label: "focal |f|", min: 12, max: 70, step: 1, value: 30, unit: "cm" }
    ],
    readouts: [
      { key: "s", label: "objeto s", unit: "cm", digits: 0 },
      { key: "sp", label: "imagen s'", unit: "cm", digits: 0 },
      { key: "m", label: "aumento m", digits: 2 }
    ],
    create: function (env) {
      var st = { so: 55, elemX: 300, yAxis: 170, SCALE: 2, hObjCm: 13, nat: "" };

      function optics() {
        var kind = env.params.kind;
        var isMirror = (kind === "conc" || kind === "convex");
        var fSign = (kind === "conv" || kind === "conc") ? 1 : -1;
        var f = fSign * env.params.f;                 // cm, con signo
        var so = st.so;                               // cm, positivo
        var denom = (1 / f) - (1 / so);
        var atInf = Math.abs(denom) < 1e-3;
        var si = atInf ? Infinity : 1 / denom;        // cm, con signo
        var m = atInf ? Infinity : -si / so;
        return { isMirror: isMirror, f: f, so: so, si: si, m: m, atInf: atInf };
      }

      env.addHandle({
        x: function () { return st.elemX - st.so * st.SCALE; },
        y: function () { return st.yAxis - st.hObjCm * st.SCALE; },
        r: 18,
        onDrag: function (px) {
          st.so = clamp((st.elemX - px) / st.SCALE, 8, 120);
        }
      });

      // dibuja un rayo saliente que pasa por I; sólido hacia adelante, punteado hacia atrás si virtual
      function outRay(ctx, sx, sy, I, forwardSign, virtual, W) {
        var dx = I.x - sx, dy = I.y - sy;
        if (Math.abs(dx) < 1e-6) dx = 1e-6;
        var k = dy / dx;
        var xe = forwardSign > 0 ? W + 60 : -60;
        var ye = sy + k * (xe - sx);
        line(ctx, sx, sy, xe, ye, C.blue, 1.6);
        if (virtual) dashLine(ctx, sx, sy, I.x, I.y, C.dim, 1);
      }

      return {
        reset: function () { st.so = 55; },
        step: function () {
          var o = optics();
          env.setReadout("s", o.so);
          env.setReadout("sp", o.atInf ? "∞" : o.si);
          env.setReadout("m", o.atInf ? "∞" : o.m);
          if (o.atInf) st.nat = "imagen en el ∞";
          else st.nat = (o.si > 0 ? "Real" : "Virtual") + ", " + (o.m < 0 ? "invertida" : "derecha");
        },
        draw: function (ctx, W, H) {
          env.grid(ctx, W, H, 40);
          var elemX = W * 0.5, yAxis = H * 0.52;
          var SCALE = W / 250;
          st.elemX = elemX; st.yAxis = yAxis; st.SCALE = SCALE;
          var o = optics();
          var hObjPx = st.hObjCm * SCALE;

          // eje óptico
          line(ctx, 10, yAxis, W - 10, yAxis, C.gridStrong, 1);

          // elemento
          var elH = Math.min(H * 0.40, 100);
          if (!o.isMirror) {
            line(ctx, elemX, yAxis - elH, elemX, yAxis + elH, env.tint, 2);
            var conv = env.params.kind === "conv";
            // chevrons (convergente hacia afuera, divergente hacia adentro)
            var ch = 7;
            [-1, 1].forEach(function (s) {
              var yy = yAxis + s * elH;
              var dir = (conv ? -s : s);
              line(ctx, elemX, yy, elemX - ch, yy + dir * ch, env.tint, 2);
              line(ctx, elemX, yy, elemX + ch, yy + dir * ch, env.tint, 2);
            });
          } else {
            var bulge = env.params.kind === "conc" ? 16 : -16;   // cóncavo abre hacia el objeto
            ctx.strokeStyle = env.tint; ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(elemX, yAxis - elH);
            ctx.quadraticCurveTo(elemX + bulge, yAxis, elemX, yAxis + elH);
            ctx.stroke();
          }

          // focos
          var fAbs = env.params.f * SCALE;
          function fTick(xx, lbl) {
            line(ctx, xx, yAxis - 5, xx, yAxis + 5, C.dim, 1.5);
            txt(ctx, lbl, xx - 3, yAxis + 18, C.dim);
          }
          if (!o.isMirror) { fTick(elemX + fAbs, "F'"); fTick(elemX - fAbs, "F"); }
          else {
            var fx = (env.params.kind === "conc") ? elemX - fAbs : elemX + fAbs;
            fTick(fx, "F");
          }

          // objeto (flecha coral) hacia arriba
          var xObj = elemX - o.so * SCALE;
          var tipObj = { x: xObj, y: yAxis - hObjPx };
          arrow(ctx, xObj, yAxis, tipObj.x, tipObj.y, 8, C.coral, 2.4);
          grabDot(ctx, tipObj.x, tipObj.y, C.coral, 3);

          var P1 = { x: elemX, y: tipObj.y };      // rayo paralelo golpea el elemento
          var Vc = { x: elemX, y: yAxis };         // centro/vértice
          var forwardSign = o.isMirror ? -1 : 1;

          // rayos entrantes (siempre desde el objeto hacia el elemento)
          line(ctx, tipObj.x, tipObj.y, P1.x, P1.y, C.blue, 1.6);   // paralelo al eje
          line(ctx, tipObj.x, tipObj.y, Vc.x, Vc.y, C.blue, 1.6);   // por el centro/vértice

          if (o.atInf) {
            // rayos salen paralelos a la dirección tip->centro
            var dirx = Vc.x - tipObj.x, diry = Vc.y - tipObj.y;
            var far = forwardSign > 0 ? W + 60 : -60;
            var kk = diry / (dirx || 1e-6);
            line(ctx, P1.x, P1.y, far, P1.y + kk * (far - P1.x), C.blue, 1.6);
            line(ctx, Vc.x, Vc.y, far, Vc.y + kk * (far - Vc.x), C.blue, 1.6);
            badge(ctx, "objeto en el foco → rayos paralelos", 14, 12, C.amber);
          } else {
            var xImg = o.isMirror ? (elemX - o.si * SCALE) : (elemX + o.si * SCALE);
            var yImg = yAxis - o.m * hObjPx;
            var I = { x: xImg, y: yImg };
            var virtual = o.si < 0;
            outRay(ctx, P1.x, P1.y, I, forwardSign, virtual, W);
            outRay(ctx, Vc.x, Vc.y, I, forwardSign, virtual, W);
            // flecha imagen
            var imgCol = virtual ? C.amber : C.teal;
            if (virtual) { dashLine(ctx, xImg, yAxis, xImg, yImg, imgCol, 2); }
            else { arrow(ctx, xImg, yAxis, xImg, yImg, 8, imgCol, 2.4); }
            badge(ctx, st.nat, 14, 12, imgCol);
          }

          txt(ctx, "arrastrá el objeto ↔", W - 14, H - 10, C.dim, MONO_SM, "right");
        }
      };
    }
  });

  /* ============================================================
     SIM 8 — Láminas delgadas, cuña y anillos de Newton
     ============================================================ */
  window.SimKit.registerSim({
    tab: "f2",
    id: "laminas",
    title: "Láminas, cuña y anillos de Newton",
    refs: "Resumen p.3,15–16 · Teórica p.14–16",
    blurb: "Interferencia por división de amplitud. Elegí la geometría y arrastrá el probe sobre el " +
      "patrón para leer el espesor local, el orden y si ahí es franja clara u oscura. El salto de fase π " +
      "en la reflexión aire→medio invierte la condición (centro oscuro en los anillos).",
    formula: "Δφ = (2π/λ)·2ne + Δφ_refl   ·   claro: 2ne = (m−½)λ   ·   oscuro: 2ne = mλ   (con Δφ_refl = π)",
    stageHeight: 340,
    controls: [
      { type: "segment", key: "geo", label: "geometría", value: "cuna", options: [
        ["lam", "Lámina"], ["cuna", "Cuña"], ["anillos", "Anillos"]
      ] },
      { type: "range", key: "lam", label: "λ (nm)", min: 400, max: 680, step: 5, value: 560, unit: "nm" },
      { type: "range", key: "n", label: "índice n", min: 1, max: 1.8, step: 0.01, value: 1.33, digits: 2 },
      { type: "range", key: "e0", label: "espesor máx e", min: 200, max: 3000, step: 50, value: 1400, unit: "nm" },
      { type: "toggle", key: "flip", label: "salto de fase π", value: true }
    ],
    readouts: [
      { key: "el", label: "e local", unit: "nm", digits: 0 },
      { key: "ord", label: "orden ≈ m", digits: 1 },
      { key: "dphi", label: "Δφ/π", digits: 2 },
      { key: "if", label: "interfranja", unit: "µm", digits: 2 }
    ],
    create: function (env) {
      var st = { px: 260, py: 170, rect: { x: 16, y: 16, w: 400, h: 250 }, off: null, key: "", est: "" };
      st.off = document.createElement("canvas");

      function thicknessAt(px, py, rect) {
        var geo = env.params.geo, e0 = env.params.e0;
        if (geo === "lam") return e0;
        if (geo === "cuna") return e0 * clamp((px - rect.x) / rect.w, 0, 1);
        // anillos
        var cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2;
        var r = Math.hypot(px - cx, py - cy);
        var rmax = Math.min(rect.w, rect.h) / 2;
        return e0 * (r / rmax) * (r / rmax);
      }
      function intensityAt(e) {
        var lam = env.params.lam, n = env.params.n;
        var dphi = (TAU / lam) * (2 * n * e) + (env.params.flip ? Math.PI : 0);
        var half = dphi / 2;
        return { I: Math.cos(half) * Math.cos(half), dphi: dphi };
      }

      function renderField(rect) {
        var fw = Math.max(1, Math.floor(rect.w)), fh = Math.max(1, Math.floor(rect.h));
        st.off.width = fw; st.off.height = fh;
        var octx = st.off.getContext("2d");
        var img = octx.createImageData(fw, fh);
        var data = img.data;
        var base = nmToRGBArr(env.params.lam);
        for (var y = 0; y < fh; y++) {
          for (var x = 0; x < fw; x++) {
            var e = thicknessAt(rect.x + x, rect.y + y, rect);
            var I = intensityAt(e).I;
            var o = (y * fw + x) * 4;
            data[o] = base[0] * I; data[o + 1] = base[1] * I; data[o + 2] = base[2] * I; data[o + 3] = 255;
          }
        }
        octx.putImageData(img, 0, 0);
      }

      env.addHandle({
        x: function () { return st.px; },
        y: function () { return st.py; },
        r: 15,
        onDrag: function (px, py) {
          var r = st.rect;
          st.px = clamp(px, r.x, r.x + r.w);
          st.py = clamp(py, r.y, r.y + r.h);
        }
      });

      return {
        reset: function () {},
        step: function () {
          var e = thicknessAt(st.px, st.py, st.rect);
          var it = intensityAt(e);
          env.setReadout("el", e);
          // orden m tal que 2ne = mλ (destructivo con flip)
          var m = (2 * env.params.n * e) / env.params.lam;
          env.setReadout("ord", m);
          env.setReadout("dphi", it.dphi / Math.PI);
          if (it.I > 0.85) st.est = "franja clara (constructiva)";
          else if (it.I < 0.15) st.est = "franja oscura (destructiva)";
          else st.est = "intermedia";
          // interfranja (cuña): Δx tal que Δ(2ne)=λ -> Δe=λ/2n ; en cuña de/dx = e0/w(px)
          var geo = env.params.geo;
          if (geo === "cuna") {
            var dedx = env.params.e0 / st.rect.w;                 // nm por px
            var dxpx = (env.params.lam / (2 * env.params.n)) / dedx;   // px por franja
            // convertir px a µm físicos no es directo; mostramos en "px de patrón" -> aprox mm de campo
            env.setReadout("if", dxpx / 1000 * 8);   // escala cosmética a µm-equivalente
          } else env.setReadout("if", "—");
        },
        draw: function (ctx, W, H) {
          var rect = { x: 16, y: 16, w: W - 32, h: H - 78 };
          st.rect = rect;
          // clamp probe dentro del nuevo rect
          st.px = clamp(st.px, rect.x, rect.x + rect.w);
          st.py = clamp(st.py, rect.y, rect.y + rect.h);

          var key = [env.params.geo, env.params.lam, env.params.n, env.params.e0, env.params.flip,
            Math.floor(rect.w), Math.floor(rect.h)].join(":");
          if (key !== st.key) { st.key = key; renderField(rect); }
          ctx.drawImage(st.off, rect.x, rect.y, rect.w, rect.h);
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 1;
          ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);

          // probe: cruz + lectura local
          var e = thicknessAt(st.px, st.py, st.rect);
          var it = intensityAt(e);
          dashLine(ctx, rect.x, st.py, rect.x + rect.w, st.py, "rgba(255,255,255,0.25)", 1);
          dashLine(ctx, st.px, rect.y, st.px, rect.y + rect.h, "rgba(255,255,255,0.25)", 1);
          grabDot(ctx, st.px, st.py, it.I > 0.5 ? C.ink : C.text, 4);
          ctx.strokeStyle = env.tint; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(st.px, st.py, 8, 0, TAU); ctx.stroke();

          var estCol = st.est.indexOf("clara") >= 0 ? env.tint : (st.est.indexOf("oscura") >= 0 ? C.coral : C.amber);
          badge(ctx, st.est, rect.x, rect.y, estCol);
          var lbl = { lam: "lámina uniforme", cuna: "cuña (franjas equidistantes)", anillos: "anillos de Newton" }[env.params.geo];
          txt(ctx, lbl + "   ·   arrastrá el probe ✛", rect.x, H - 10, C.dim);
          txt(ctx, "2ne = " + (2 * env.params.n * e).toFixed(0) + " nm", rect.x + rect.w, H - 10, C.dim, MONO_SM, "right");
        }
      };
    }
  });

  /* ============================================================
     SIM 9 — Red de difracción
     ============================================================ */
  window.SimKit.registerSim({
    tab: "f2",
    id: "red",
    title: "Red de difracción",
    refs: "Resumen p.4 · Teórica p.17–18 · parciales (red A vs B)",
    blurb: "Subí N de 2 a muchas rendijas y mirá cómo los máximos principales se afinan mientras crecen " +
      "los mínimos secundarios. Arrastrá el probe para leer el ángulo, el orden m y el poder resolvente R = mN.",
    formula: "I = [sin(Nγ)/(N·sinγ)]²·(sinβ/β)²   ·   máx: d·sinθ = mλ   ·   R = λ/Δλ = mN   ·   δθ ≈ λ/(Nd)",
    stageHeight: 330,
    controls: [
      { type: "range", key: "N", label: "N rendijas", min: 2, max: 40, step: 1, value: 6 },
      { type: "range", key: "d", label: "paso d", min: 1, max: 8, step: 0.1, value: 3, unit: "µm" },
      { type: "range", key: "lam", label: "λ (nm)", min: 400, max: 680, step: 5, value: 540, unit: "nm" }
    ],
    readouts: [
      { key: "m", label: "orden m", digits: 0 },
      { key: "th", label: "θ", unit: "°", digits: 1 },
      { key: "R", label: "resolv. R = mN", digits: 0 },
      { key: "dth", label: "ancho δθ", unit: "°", digits: 2 }
    ],
    create: function (env) {
      var st = { px: 300, map: { gx0: 30, gx1: 560, cx: 295, half: 265, SM: 0.5 } };

      function I(sinT) {
        var d = env.params.d * 1e-6, lam = env.params.lam * 1e-9, a = 0.4 * d, N = env.params.N;
        var g = Math.PI * d * sinT / lam;
        var b = Math.PI * a * sinT / lam;
        var sg = Math.sin(g);
        var grat = Math.abs(sg) < 1e-7 ? N : Math.sin(N * g) / sg;
        var gfac = (grat * grat) / (N * N);
        var sinc = Math.abs(b) < 1e-9 ? 1 : Math.sin(b) / b;
        return gfac * sinc * sinc;
      }

      env.addHandle({
        x: function () { return st.px; },
        y: function () { return 40; },
        r: 15,
        onDrag: function (px) { st.px = clamp(px, st.map.gx0, st.map.gx1); }
      });

      return {
        reset: function () {},
        step: function () {
          var m = st.map;
          var sinT = clamp((st.px - m.cx) / m.half * m.SM, -0.999, 0.999);
          var th = Math.asin(sinT);
          var order = Math.round(sinT * (env.params.d * 1e-6) / (env.params.lam * 1e-9));
          env.setReadout("th", th * DEG);
          env.setReadout("m", order);
          env.setReadout("R", Math.abs(order) * env.params.N);
          var dth = env.params.lam * 1e-9 / (env.params.N * env.params.d * 1e-6);
          env.setReadout("dth", dth * DEG);
        },
        draw: function (ctx, W, H) {
          var d = env.params.d * 1e-6, lam = env.params.lam * 1e-9;
          var col = nmToRGB(env.params.lam);
          var gx0 = 30, gx1 = W - 30, cx = (gx0 + gx1) / 2, half = (gx1 - gx0) / 2;
          var gyTop = 56, gyBase = H - 66;
          var SM = Math.min(0.95, 3.4 * lam / d);
          st.map = { gx0: gx0, gx1: gx1, cx: cx, half: half, SM: SM };
          function X(sinT) { return cx + (sinT / SM) * half; }

          // ejes
          line(ctx, gx0, gyBase, gx1, gyBase, C.grid, 1);
          line(ctx, cx, gyTop, cx, gyBase, C.grid, 1);
          txt(ctx, "sinθ →", gx1 - 40, gyBase + 14, C.dim);
          txt(ctx, "I(θ), máx principales afilándose con N", gx0, gyTop - 8, C.dim);

          // curva I(θ)
          ctx.strokeStyle = col; ctx.lineWidth = 1.6;
          ctx.beginPath();
          var Wp = gx1 - gx0, i;
          for (i = 0; i <= Wp; i++) {
            var sinT = (-SM) + (i / Wp) * (2 * SM);
            var yy = gyBase - I(sinT) * (gyBase - gyTop);
            if (i === 0) ctx.moveTo(gx0 + i, yy); else ctx.lineTo(gx0 + i, yy);
          }
          ctx.stroke();

          // máximos principales
          var mMax = Math.floor(SM * d / lam), mm;
          for (mm = -mMax; mm <= mMax; mm++) {
            var sT = mm * lam / d;
            if (Math.abs(sT) > SM) continue;
            dashLine(ctx, X(sT), gyTop, X(sT), gyBase, C.gridStrong, 1);
            txt(ctx, "m=" + mm, X(sT) + 3, gyTop + 10, C.dim);
          }

          // espectro (líneas brillantes en cada máximo)
          var stripY = gyBase + 22, stripH = 22;
          ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.fillRect(gx0, stripY, gx1 - gx0, stripH);
          for (mm = -mMax; mm <= mMax; mm++) {
            var sT2 = mm * lam / d;
            if (Math.abs(sT2) > SM) continue;
            ctx.fillStyle = col; ctx.fillRect(X(sT2) - 1, stripY, 2.4, stripH);
          }
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 1;
          ctx.strokeRect(gx0, stripY, gx1 - gx0, stripH);

          // probe
          dashLine(ctx, st.px, gyTop, st.px, gyBase, C.amber, 1);
          grabDot(ctx, st.px, 40, C.amber, 4);
          txt(ctx, "arrastrá el probe ↔", gx0, 40, C.dim);
        }
      };
    }
  });

  /* ============================================================
     SIM 10 — Ciclo termodinámico PV
     ============================================================ */
  window.SimKit.registerSim({
    tab: "f2",
    id: "ciclo-pv",
    title: "Ciclo termodinámico PV",
    refs: "Resumen p.5,12–16 · Teórica p.23–26 · 2º parciales",
    blurb: "Máquina térmica en el plano PV. Elegí Carnot u Otto y arrastrá los vértices (dentro de los " +
      "límites físicos): el área encerrada es W neto, y η, Q y la comparación con η_Carnot se recalculan en vivo.",
    formula: "ΔU = Q − W   ·   η = W/Q_in = 1 − |Q_out|/Q_in   ·   η_Carnot = 1 − T_min/T_max   ·   η_Otto = 1 − r^(1−γ)",
    stageHeight: 360,
    controls: [
      { type: "segment", key: "cycle", label: "ciclo", value: "carnot", options: [
        ["carnot", "Carnot"], ["otto", "Otto"]
      ] },
      { type: "segment", key: "gas", label: "gas", value: "mono", options: [
        ["mono", "Monoat."], ["diat", "Diatóm."]
      ] },
      { type: "range", key: "Tmin", label: "T minima", min: 250, max: 500, step: 5, value: 300, unit: "K" },
      { type: "range", key: "Tmax", label: "T maxima", min: 600, max: 2200, step: 20, value: 900, unit: "K" },
      { type: "range", key: "ratio", label: "razon de volumen", min: 1.5, max: 12, step: 0.1, value: 3 }
    ],
    readouts: [
      { key: "W", label: "W neto", unit: "J", digits: 0 },
      { key: "Qin", label: "Q entra", unit: "J", digits: 0 },
      { key: "Qout", label: "Q sale", unit: "J", digits: 0 },
      { key: "eta", label: "η", unit: "%", digits: 1 },
      { key: "etac", label: "η_Carnot", unit: "%", digits: 1 }
    ],
    create: function (env) {
      var nR = 8.314;          // n=1 mol
      var V1 = 6;              // L (volumen base)
      var st = { states: [], legs: [], Vlo: 0, Vhi: 12, Plo: 0, Phi: 100, box: { x: 46, y: 16, w: 400, h: 250 } };
      var ratioInput = sliderByLabel(env, "razon");
      var TmaxInput = sliderByLabel(env, "maxima");

      function gamma() { return env.params.gas === "mono" ? 5 / 3 : 7 / 5; }
      function cv() { return env.params.gas === "mono" ? 1.5 * nR : 2.5 * nR; }

      function build() {
        var g = gamma(), r = env.params.ratio, Tmax = env.params.Tmax, Tmin = env.params.Tmin;
        var S = [], legs = [], Qin = 0, Qout = 0;
        function stt(V, T) { return { V: V, P: nR * T / V, T: T }; }
        if (env.params.cycle === "carnot") {
          var Tc = Tmax, Tf = Math.min(Tmin, Tmax - 20);
          var V2 = V1 * r;
          var expo = Math.pow(Tc / Tf, 1 / (g - 1));
          var V3 = V2 * expo, V4 = V1 * expo;
          S = [stt(V1, Tc), stt(V2, Tc), stt(V3, Tf), stt(V4, Tf)];
          legs = [
            { type: "iso", a: 0, b: 1, T: Tc },   // isoterma caliente (Q entra)
            { type: "adi", a: 1, b: 2 },
            { type: "iso", a: 2, b: 3, T: Tf },   // isoterma fría (Q sale)
            { type: "adi", a: 3, b: 0 }
          ];
          Qin = nR * Tc * Math.log(V2 / V1);
          Qout = -nR * Tf * Math.log(V4 / V3);    // >0
        } else {
          var T1 = Tmin;
          var V2o = V1 / r;
          var T2 = T1 * Math.pow(r, g - 1);
          var T3 = Math.max(Tmax, T2 * 1.05);   // el pico debe superar la compresión (Q_in > 0)
          var T4 = T3 * Math.pow(1 / r, g - 1);
          S = [stt(V1, T1), stt(V2o, T2), stt(V2o, T3), stt(V1, T4)];
          legs = [
            { type: "adi", a: 0, b: 1 },
            { type: "iso-v", a: 1, b: 2 },        // isócora: Q entra
            { type: "adi", a: 2, b: 3 },
            { type: "iso-v", a: 3, b: 0 }         // isócora: Q sale
          ];
          Qin = cv() * (T3 - T2);
          Qout = cv() * (T4 - T1);                // >0
        }
        var W = Qin - Qout;
        return { S: S, legs: legs, Qin: Qin, Qout: Qout, W: W,
          eta: W / Qin, etac: 1 - Math.min(Tmin, Tmax) / Tmax, g: g };
      }

      // muestrea una pierna en puntos (V,P)
      function legPts(leg, S) {
        var A = S[leg.a], B = S[leg.b], pts = [], i, N = 40;
        if (leg.type === "iso") {
          for (i = 0; i <= N; i++) { var V = A.V + (B.V - A.V) * i / N; pts.push([V, nR * leg.T / V]); }
        } else if (leg.type === "adi") {
          var c = A.P * Math.pow(A.V, gamma());
          for (i = 0; i <= N; i++) { var V2 = A.V + (B.V - A.V) * i / N; pts.push([V2, c / Math.pow(V2, gamma())]); }
        } else { // iso-v (vertical)
          for (i = 0; i <= N; i++) { var P = A.P + (B.P - A.P) * i / N; pts.push([A.V, P]); }
        }
        return pts;
      }

      function mapX(V) { var b = st.box; return b.x + (V - st.Vlo) / (st.Vhi - st.Vlo) * b.w; }
      function mapY(P) { var b = st.box; return b.y + b.h - (P - st.Plo) / (st.Phi - st.Plo) * b.h; }
      function invV(x) { var b = st.box; return st.Vlo + (x - b.x) / b.w * (st.Vhi - st.Vlo); }
      function invP(y) { var b = st.box; return st.Plo + (b.y + b.h - y) / b.h * (st.Phi - st.Plo); }

      // handles (según ciclo) — sincronizan sliders
      // Carnot: estado 1 vertical -> Tmax ; estado 2 horizontal -> ratio
      env.addHandle({
        hidden: function () { return env.params.cycle !== "carnot"; },
        x: function () { return mapX(st.states[0] ? st.states[0].V : V1); },
        y: function () { return mapY(st.states[0] ? st.states[0].P : 50); },
        r: 16,
        onDrag: function (px, py) {
          var P = clamp(invP(py), 1, 1e5);
          var Tc = P * V1 / nR;
          setSlider(TmaxInput, clamp(Tc, 600, 2200));
        }
      });
      env.addHandle({
        hidden: function () { return env.params.cycle !== "carnot"; },
        x: function () { return mapX(st.states[1] ? st.states[1].V : V1 * 2); },
        y: function () { return mapY(st.states[1] ? st.states[1].P : 30); },
        r: 16,
        onDrag: function (px) {
          var V2 = clamp(invV(px), V1 * 1.5, V1 * 12);
          setSlider(ratioInput, clamp(V2 / V1, 1.5, 12));
        }
      });
      // Otto: estado 2 horizontal -> ratio ; estado 3 vertical -> Tmax
      env.addHandle({
        hidden: function () { return env.params.cycle !== "otto"; },
        x: function () { return mapX(st.states[1] ? st.states[1].V : V1 / 3); },
        y: function () { return mapY(st.states[1] ? st.states[1].P : 60); },
        r: 16,
        onDrag: function (px) {
          var V2 = clamp(invV(px), V1 / 12, V1 / 1.5);
          setSlider(ratioInput, clamp(V1 / V2, 1.5, 12));
        }
      });
      env.addHandle({
        hidden: function () { return env.params.cycle !== "otto"; },
        x: function () { return mapX(st.states[2] ? st.states[2].V : V1 / 3); },
        y: function () { return mapY(st.states[2] ? st.states[2].P : 90); },
        r: 16,
        onDrag: function (px, py) {
          var V2 = st.states[1] ? st.states[1].V : V1 / 3;
          var P = clamp(invP(py), 1, 1e5);
          var T3 = P * V2 / nR;
          setSlider(TmaxInput, clamp(T3, 600, 2200));
        }
      });

      return {
        reset: function () {},
        step: function () {
          var m = build();
          st.states = m.S;
          env.setReadout("W", m.W);
          env.setReadout("Qin", m.Qin);
          env.setReadout("Qout", m.Qout);
          env.setReadout("eta", m.eta * 100);
          env.setReadout("etac", m.etac * 100);
        },
        draw: function (ctx, W, H) {
          var m = build();
          st.states = m.S;
          var box = { x: 48, y: 16, w: W - 66, h: H - 64 };
          st.box = box;

          // rango de ejes
          var Vlo = 1e9, Vhi = -1e9, Plo = 1e9, Phi = -1e9;
          m.legs.forEach(function (leg) {
            legPts(leg, m.S).forEach(function (p) {
              if (p[0] < Vlo) Vlo = p[0]; if (p[0] > Vhi) Vhi = p[0];
              if (p[1] < Plo) Plo = p[1]; if (p[1] > Phi) Phi = p[1];
            });
          });
          st.Vlo = 0; st.Vhi = Vhi * 1.1; st.Plo = 0; st.Phi = Phi * 1.12;

          env.grid(ctx, W, H, 36);
          // ejes
          line(ctx, box.x, box.y, box.x, box.y + box.h, C.gridStrong, 1);
          line(ctx, box.x, box.y + box.h, box.x + box.w, box.y + box.h, C.gridStrong, 1);
          txt(ctx, "P", box.x - 34, box.y + 10, C.dim, MONO);
          txt(ctx, "V →", box.x + box.w - 24, box.y + box.h + 16, C.dim);

          // polígono del ciclo (área = W neto)
          var poly = [];
          m.legs.forEach(function (leg) { legPts(leg, m.S).forEach(function (p) { poly.push(p); }); });
          ctx.beginPath();
          poly.forEach(function (p, i) { var x = mapX(p[0]), y = mapY(p[1]); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
          ctx.closePath();
          ctx.fillStyle = env.tint; ctx.globalAlpha = 0.14; ctx.fill(); ctx.globalAlpha = 1;
          ctx.strokeStyle = env.tint; ctx.lineWidth = 2; ctx.stroke();

          // W neto etiqueta en el centroide
          var cxp = 0, cyp = 0;
          m.S.forEach(function (s) { cxp += mapX(s.V); cyp += mapY(s.P); });
          cxp /= m.S.length; cyp /= m.S.length;
          txt(ctx, "W = " + m.W.toFixed(0) + " J", cxp - 26, cyp, env.tint, MONO, "left", "middle");

          // vértices + etiquetas de estado
          m.S.forEach(function (s, i) {
            var x = mapX(s.V), y = mapY(s.P);
            ctx.fillStyle = C.text;
            ctx.beginPath(); ctx.arc(x, y, 3.5, 0, TAU); ctx.fill();
            txt(ctx, String(i + 1), x + 6, y - 6, C.dim);
          });

          // etiquetas de flujo de calor
          txt(ctx, "Q entra →", box.x + 6, box.y + 14, C.coral);
          txt(ctx, "Q sale ←", box.x + 6, box.y + box.h - 8, C.blue);
          txt(ctx, "arrastrá los vértices ✛", box.x + box.w, box.y + 14, C.dim, MONO_SM, "right");
        }
      };
    }
  });

  /* ============================================================
     SIM 11 — Calorimetría con cambio de fase
     ============================================================ */
  window.SimKit.registerSim({
    tab: "f2",
    id: "calorimetria",
    title: "Calorimetría con cambio de fase",
    refs: "Resumen p.5,12 · Teórica p.21–22 · Guía 24 (24.2)",
    blurb: "Curva T(Q) del agua de −20 °C a 140 °C: dos rampas de calentamiento y dos mesetas de fusión " +
      "y ebullición. Arrastrá el punto sobre la curva para leer el estado, el calor acumulado y la fracción " +
      "de fase ya convertida.",
    formula: "Q = m·c·ΔT   (rampa)   ·   Q = m·L   (meseta, T constante)   ·   c_hielo 2.09 · c_agua 4.18 · c_vapor 2.01 J/g°C",
    stageHeight: 330,
    controls: [
      { type: "range", key: "m", label: "masa m", min: 5, max: 200, step: 5, value: 50, unit: "g" },
      { type: "range", key: "Lf", label: "calor fusión L_f", min: 200, max: 400, step: 2, value: 334, unit: "J/g" },
      { type: "range", key: "Lv", label: "calor vapor. L_v", min: 1500, max: 2800, step: 20, value: 2260, unit: "J/g" }
    ],
    readouts: [
      { key: "Q", label: "Q acumulado", unit: "kJ", digits: 2 },
      { key: "T", label: "temperatura", unit: "°C", digits: 1 },
      { key: "frac", label: "fase convertida", unit: "%", digits: 0 }
    ],
    create: function (env) {
      var ci = 2.09, cw = 4.18, cvp = 2.01, Tmin = -20, Tmax = 140;
      var st = { Q: 0, map: { gx0: 46, gx1: 560, gy0: 20, gy1: 260, Qtot: 1 }, segs: [] };

      function model() {
        var m = env.params.m, Lf = env.params.Lf, Lv = env.params.Lv;
        var q1 = m * ci * (0 - Tmin);     // hielo -20 -> 0
        var q2 = m * Lf;                  // fusión
        var q3 = m * cw * 100;            // agua 0 -> 100
        var q4 = m * Lv;                  // vaporización
        var q5 = m * cvp * (Tmax - 100);  // vapor 100 -> 140
        var segs = [
          { q0: 0, q1: q1, T0: Tmin, T1: 0, fase: "sólido (hielo)", plat: false },
          { q0: q1, q1: q1 + q2, T0: 0, T1: 0, fase: "fusión", plat: true },
          { q0: q1 + q2, q1: q1 + q2 + q3, T0: 0, T1: 100, fase: "líquido (agua)", plat: false },
          { q0: q1 + q2 + q3, q1: q1 + q2 + q3 + q4, T0: 100, T1: 100, fase: "ebullición", plat: true },
          { q0: q1 + q2 + q3 + q4, q1: q1 + q2 + q3 + q4 + q5, T0: 100, T1: Tmax, fase: "vapor", plat: false }
        ];
        return { segs: segs, Qtot: segs[4].q1 };
      }
      function at(Q) {
        var segs = st.segs;
        for (var i = 0; i < segs.length; i++) {
          var s = segs[i];
          if (Q <= s.q1 + 1e-9 || i === segs.length - 1) {
            var f = (Q - s.q0) / Math.max(1e-9, (s.q1 - s.q0));
            f = clamp(f, 0, 1);
            return { T: s.T0 + (s.T1 - s.T0) * f, fase: s.fase, plat: s.plat, frac: f };
          }
        }
        return { T: Tmax, fase: "vapor", plat: false, frac: 1 };
      }

      env.addHandle({
        x: function () { var m = st.map; return m.gx0 + (st.Q / m.Qtot) * (m.gx1 - m.gx0); },
        y: function () { var m = st.map; var T = at(st.Q).T; return m.gy1 - (T - Tmin) / (Tmax - Tmin) * (m.gy1 - m.gy0); },
        r: 16,
        onDrag: function (px) {
          var m = st.map;
          st.Q = clamp((px - m.gx0) / (m.gx1 - m.gx0) * m.Qtot, 0, m.Qtot);
        }
      });

      return {
        reset: function () { var mo = model(); st.segs = mo.segs; st.Q = mo.Qtot * 0.5; },
        step: function () {
          var mo = model(); st.segs = mo.segs; st.map.Qtot = mo.Qtot;
          st.Q = clamp(st.Q, 0, mo.Qtot);
          var a = at(st.Q);
          env.setReadout("Q", st.Q / 1000);
          env.setReadout("T", a.T);
          env.setReadout("frac", a.plat ? a.frac * 100 : "—");
        },
        draw: function (ctx, W, H) {
          var mo = model(); st.segs = mo.segs;
          env.grid(ctx, W, H, 40);
          var gx0 = 46, gx1 = W - 20, gy0 = 24, gy1 = H - 46;
          st.map = { gx0: gx0, gx1: gx1, gy0: gy0, gy1: gy1, Qtot: mo.Qtot };
          function X(Q) { return gx0 + (Q / mo.Qtot) * (gx1 - gx0); }
          function Y(T) { return gy1 - (T - Tmin) / (Tmax - Tmin) * (gy1 - gy0); }

          // ejes + guías T
          line(ctx, gx0, gy0, gx0, gy1, C.gridStrong, 1);
          line(ctx, gx0, gy1, gx1, gy1, C.gridStrong, 1);
          [0, 100].forEach(function (T) {
            dashLine(ctx, gx0, Y(T), gx1, Y(T), C.grid, 1);
            txt(ctx, T + "°", gx0 - 30, Y(T) + 3, C.dim);
          });
          txt(ctx, "T (°C)", gx0 - 40, gy0 + 6, C.dim);
          txt(ctx, "Q →", gx1 - 28, gy1 + 16, C.dim);

          // curva T(Q) con color por fase
          mo.segs.forEach(function (s) {
            ctx.strokeStyle = s.plat ? C.amber : env.tint;
            ctx.lineWidth = s.plat ? 3 : 2.2;
            line(ctx, X(s.q0), Y(s.T0), X(s.q1), Y(s.T1), ctx.strokeStyle, ctx.lineWidth);
          });
          // etiquetas de meseta
          mo.segs.forEach(function (s) {
            if (s.plat) txt(ctx, s.fase === "fusión" ? "fusión (L_f)" : "ebullición (L_v)",
              (X(s.q0) + X(s.q1)) / 2, Y(s.T0) - 8, C.amber, MONO_SM, "center");
          });

          // punto arrastrable
          var a = at(st.Q);
          var pxp = X(st.Q), pyp = Y(a.T);
          dashLine(ctx, pxp, gy0, pxp, gy1, C.blue, 1);
          grabDot(ctx, pxp, pyp, C.text, 5);
          ctx.strokeStyle = env.tint; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(pxp, pyp, 8, 0, TAU); ctx.stroke();
          badge(ctx, a.fase, gx0, gy0, a.plat ? C.amber : env.tint);
          txt(ctx, "arrastrá el punto sobre la curva ↔", gx0, H - 8, C.dim);
        }
      };
    }
  });

})();
