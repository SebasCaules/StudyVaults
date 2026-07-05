/* ============================================================
   f2.js — Física 2 (ITBA): oscilaciones, ondas, óptica física
   y geométrica. Cinco simulaciones registradas sobre SimKit.
   Script clásico (sin módulos), compatible file://. Refuerza
   los apuntes reales de la cursada 2024-2C.
   ============================================================ */
(function () {
  "use strict";

  var C = window.SimKit.colors;         // paleta compartida
  var TAU = Math.PI * 2;
  var DEG = 180 / Math.PI;

  /* ---------- helpers ---------- */
  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  function drawSpring(ctx, x0, x1, y, coils, amp, color, lw) {
    // resorte horizontal en zig-zag entre (x0,y) y (x1,y)
    ctx.strokeStyle = color; ctx.lineWidth = lw || 2;
    ctx.lineJoin = "round";
    ctx.beginPath();
    var lead = 12;                       // tramo recto en cada extremo
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

  // longitud de onda (nm) -> color CSS aproximado (Bruton)
  function nmToRGB(nm) {
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
    return "rgb(" + ch(r) + "," + ch(g) + "," + ch(b) + ")";
  }

  /* ============================================================
     TAB
     ============================================================ */
  window.SimKit.registerTab({
    id: "f2",
    intro: "Oscilaciones, ondas en cuerda y óptica física/geométrica: " +
      "cinco laboratorios que reconstruyen en vivo las figuras de la teórica de Física 2."
  });

  /* ============================================================
     SIM 1 — Oscilador amortiguado
     ============================================================ */
  window.SimKit.registerSim({
    tab: "f2",
    id: "amortiguado",
    title: "Oscilador amortiguado",
    refs: "Resumen p.1,8 · Teórica p.3–4 · Guía 3",
    blurb: "Masa-resorte con fricción viscosa. Elegí el régimen o dejá que m, k y b lo definan; " +
      "la envolvente ±A·e^(−γt) marca el decaimiento sobre x(t).",
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
      { key: "gamma", label: "γ", unit: "s⁻¹", digits: 2 },
      { key: "wd", label: "ω_d", unit: "rad/s", digits: 2 },
      { key: "Q", label: "factor Q", digits: 2 },
      { key: "reg", label: "régimen" }
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
      var A0 = 1;
      var st = { x: A0, v: 0, env: A0, t: 0, w0: 0, g: 0 };

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

      return {
        reset: function () {
          var p = params();
          st.w0 = p.w0; st.g = p.g;
          st.x = A0; st.v = -p.g * A0;   // arranque tangente a la envolvente
          st.env = A0; st.t = 0;
          env.plot.clear();
        },
        step: function (dt) {
          var p = params();
          st.w0 = p.w0; st.g = p.g;
          var a = -2 * p.g * st.v - p.w0 * p.w0 * st.x;
          st.v += a * dt;              // Euler semi-implícito (estable)
          st.x += st.v * dt;
          st.env *= Math.exp(-p.g * dt);
          st.t += dt;
          env.plot.push(st.t, { x: st.x, ep: st.env, en: -st.env });

          var wd = p.w0 > p.g ? Math.sqrt(p.w0 * p.w0 - p.g * p.g) : NaN;
          var reg, tol = 0.02 * p.w0;
          if (Math.abs(p.g - p.w0) <= tol) reg = "Crítico";
          else if (p.g < p.w0) reg = "Subamortiguado";
          else reg = "Sobreamortiguado";
          env.setReadout("gamma", p.g);
          env.setReadout("wd", isNaN(wd) ? "—" : wd);
          env.setReadout("Q", p.w0 / (2 * p.g));
          env.setReadout("reg", reg);
        },
        draw: function (ctx, W, H) {
          var yMid = H * 0.5;
          var wallX = 44;
          var center = W * 0.56;
          var ampPx = Math.min(W * 0.26, center - wallX - 70);
          var mx = center + st.x * ampPx;           // posición horizontal de la masa
          mx = clamp(mx, wallX + 60, W - 46);

          // línea de equilibrio
          dashLine(ctx, center, yMid - 60, center, yMid + 60, C.gridStrong, 1);
          ctx.fillStyle = C.dim; ctx.font = "10px ui-monospace, monospace";
          ctx.fillText("equilibrio", center + 6, yMid - 48);

          drawWall(ctx, wallX, yMid - 40, yMid + 40, C.dim);
          var coils = Math.round(clamp(env.params.k / 2, 6, 16));
          drawSpring(ctx, wallX, mx - 26, yMid, coils, 11, C.dim, 2);

          // masa
          var s = 52;
          ctx.fillStyle = env.tint;
          ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 1;
          roundRect(ctx, mx - 26, yMid - s / 2, s, s, 8); ctx.fill(); ctx.stroke();
          ctx.fillStyle = C.ink; ctx.font = "12px ui-monospace, monospace";
          ctx.textAlign = "center"; ctx.fillText("m", mx, yMid + 4); ctx.textAlign = "left";

          // vector velocidad
          if (Math.abs(st.v) > 0.02) {
            arrow(ctx, mx, yMid - s / 2 - 10, mx + clamp(st.v * ampPx * 0.5, -70, 70),
              yMid - s / 2 - 10, 7, C.amber, 2);
          }
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
    blurb: "Forzante F₀cos(ωt) sobre el oscilador. Barré ω y mirá crecer la amplitud al cruzar la " +
      "resonancia; con b chico el pico se agudiza y el desfasaje pasa de 0 a π.",
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
      var st = { t: 0 };
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
          var animH = 116;                       // banda superior: oscilador
          var w = env.params.w, A = amp(w), d = phase(w);

          // --- oscilador animado ---
          var yA = animH * 0.5;
          var wallX = 40, center = W * 0.42;
          var maxAmp = Math.min(120, center - wallX - 60);
          var dispPx = maxAmp * Math.tanh(A / 1.6) * Math.cos(w * st.t - d);
          var mx = clamp(center + dispPx, wallX + 50, center + maxAmp + 30);
          drawWall(ctx, wallX, yA - 26, yA + 26, C.dim);
          drawSpring(ctx, wallX, mx - 20, yA, 10, 8, C.dim, 2);
          ctx.fillStyle = env.tint;
          roundRect(ctx, mx - 20, yA - 18, 40, 36, 7); ctx.fill();
          // flecha de fuerza F(t)=F0 cos(wt)
          var Fnow = env.params.F0 * Math.cos(w * st.t);
          var fLen = (Fnow / 6) * 60;
          if (Math.abs(fLen) > 2) arrow(ctx, mx, yA - 34, mx + fLen, yA - 34, 7, C.coral, 2.4);
          ctx.fillStyle = C.dim; ctx.font = "10px ui-monospace, monospace";
          ctx.fillText("F(t)", W - 80, 16);
          arrow(ctx, W - 46, 12, W - 22, 12, 6, C.coral, 2);

          // --- curva A(ω) ---
          var gx0 = padL, gx1 = W - padR;
          var gy0 = animH + 14, gy1 = H - 22;
          var wMax = 12;
          // escala vertical: máximo del barrido
          var Amax = 1e-6, N = 260;
          for (var i = 0; i <= N; i++) { var a = amp((i / N) * wMax); if (a > Amax) Amax = a; }
          var yTop = Amax * 1.12;
          function X(ww) { return gx0 + (ww / wMax) * (gx1 - gx0); }
          function Y(aa) { return gy1 - (aa / yTop) * (gy1 - gy0); }

          // ejes
          ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(gx0, gy1); ctx.lineTo(gx1, gy1); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0, gy1); ctx.stroke();
          ctx.fillStyle = C.dim; ctx.font = "10px ui-monospace, monospace";
          ctx.fillText("A(ω)", gx0 + 4, gy0 + 4);
          ctx.fillText("ω →", gx1 - 26, gy1 + 14);

          // curva
          ctx.strokeStyle = env.tint; ctx.lineWidth = 2;
          ctx.beginPath();
          for (var j = 0; j <= N; j++) {
            var ww = (j / N) * wMax, px = X(ww), py = Y(amp(ww));
            if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // marca ω_res
          var wr = wres();
          if (!isNaN(wr) && wr <= wMax) {
            dashLine(ctx, X(wr), gy0, X(wr), gy1, C.amber, 1);
            ctx.fillStyle = C.amber; ctx.fillText("ω_res", X(wr) + 4, gy0 + 14);
          }
          // marca ω₀
          dashLine(ctx, X(env.params.w0), gy0, X(env.params.w0), gy1, C.gridStrong, 1);
          ctx.fillStyle = C.dim; ctx.fillText("ω₀", X(env.params.w0) + 4, gy1 - 6);

          // punto operativo
          var opx = X(w), opy = Y(A);
          dashLine(ctx, opx, opy, opx, gy1, C.blue, 1);
          dashLine(ctx, gx0, opy, opx, opy, C.blue, 1);
          ctx.fillStyle = C.blue;
          ctx.beginPath(); ctx.arc(opx, opy, 4.5, 0, TAU); ctx.fill();
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
    blurb: "Modos normales de una cuerda de L = 1 m. Cambiá el modo y la condición de borde; " +
      "los nodos no se mueven y v = √(T/μ) fija la frecuencia (animación a escala de tiempo).",
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
      { key: "nef", label: "modo efectivo", digits: 0 }
    ],
    plot: {
      window: 8, height: 130, autoY: false, yMin: -1.15, yMax: 1.15,
      xLabel: "t (s)", yLabel: "y",
      series: [{ key: "y", label: "y(antinodo, t)", color: C.blue }]
    },
    create: function (env) {
      var L = 1, K = 150;   // K: factor de compresión temporal para visualizar
      var st = { t: 0 };

      function model() {
        var mu = env.params.mu / 1000;          // g/m -> kg/m
        var v = Math.sqrt(env.params.T / mu);
        var n = env.params.n;
        var nef, k, lam, f;
        if (env.params.bc === "fl") {
          nef = (n % 2 === 0) ? Math.max(1, n - 1) : n;   // solo impares
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

      return {
        reset: function () { st.t = 0; env.plot.clear(); },
        step: function (dt) {
          var mo = model();
          var wVis = TAU * mo.f / K;
          st.t += dt;
          env.plot.push(st.t, { y: Math.cos(wVis * st.t) });
          env.setReadout("f", mo.f);
          env.setReadout("lam", mo.lam);
          env.setReadout("v", mo.v);
          env.setReadout("nef", mo.nef);
        },
        draw: function (ctx, W, H) {
          var mo = model();
          var padL = 54, padR = 40;
          var yMid = H * 0.5;
          var amp = Math.min(H * 0.30, 90);
          var x0 = padL, x1 = W - padR;
          var wVis = TAU * mo.f / K;
          var ph = Math.cos(wVis * st.t);

          function px(x) { return x0 + (x / L) * (x1 - x0); }

          // envolvente del modo ±A|sin(kx)|
          ctx.strokeStyle = "rgba(146,207,242,0.28)"; ctx.lineWidth = 1;
          for (var sgn = -1; sgn <= 1; sgn += 2) {
            ctx.beginPath();
            for (var i = 0; i <= 200; i++) {
              var x = (i / 200) * L, yy = yMid - sgn * amp * Math.abs(Math.sin(mo.k * x));
              if (i === 0) ctx.moveTo(px(x), yy); else ctx.lineTo(px(x), yy);
            }
            ctx.stroke();
          }

          // eje / línea de equilibrio
          dashLine(ctx, x0, yMid, x1, yMid, C.grid, 1);

          // cuerda instantánea
          ctx.strokeStyle = env.tint; ctx.lineWidth = 2.4;
          ctx.beginPath();
          for (var j = 0; j <= 240; j++) {
            var xx = (j / 240) * L;
            var y = yMid - amp * Math.sin(mo.k * xx) * ph;
            if (j === 0) ctx.moveTo(px(xx), y); else ctx.lineTo(px(xx), y);
          }
          ctx.stroke();

          // nodos (círculos huecos) y antinodos (puntos)
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

          // extremos
          drawWall(ctx, x0, yMid - amp - 6, yMid + amp + 6, C.dim);   // izq: fija
          if (env.params.bc === "fl") {
            // derecha libre: anillo sobre varilla vertical (antinodo)
            var yEnd = yMid - amp * Math.sin(mo.k * L) * ph;
            ctx.strokeStyle = C.dim; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(x1 + 8, yMid - amp - 6); ctx.lineTo(x1 + 8, yMid + amp + 6); ctx.stroke();
            ctx.strokeStyle = env.tint;
            ctx.beginPath(); ctx.arc(x1, yEnd, 5, 0, TAU); ctx.stroke();
          } else {
            drawWall(ctx, x1 + 8, yMid - amp - 6, yMid + amp + 6, C.dim);
          }

          // etiquetas
          ctx.fillStyle = C.dim; ctx.font = "10px ui-monospace, monospace";
          ctx.fillText("nodos ○   antinodos ●", x0, H - 8);
          ctx.textAlign = "right";
          ctx.fillText("L = 1 m", x1, H - 8); ctx.textAlign = "left";
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
    blurb: "Doble rendija de ancho finito. Las franjas de interferencia cos²γ quedan moduladas por " +
      "la campana de difracción (sin β/β)²; donde d/a es entero, el orden desaparece.",
    formula: "I = 4I₀·cos²γ·(sin β/β)²   ·   γ = πd·sinθ/λ,  β = πa·sinθ/λ   ·   Δy = λL/d   ·   mín. difr.: sinθ = pλ/a",
    stageHeight: 340,
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
      var st = { t: 0 };
      function intensity(sinT) {
        var d = env.params.d * 1e-6, a = env.params.a * 1e-6, lam = env.params.lam * 1e-9;
        var g = Math.PI * d * sinT / lam;
        var b = Math.PI * a * sinT / lam;
        var sinc = (Math.abs(b) < 1e-9) ? 1 : Math.sin(b) / b;
        return { I: Math.cos(g) * Math.cos(g) * sinc * sinc, env: sinc * sinc };
      }
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
          var Yr = 2.4 * (lam * L / a);            // semiancho en metros mostrado
          var padL = 20, padR = 20;
          var gx0 = padL, gx1 = W - padR;
          var gyTop = 24, gyBase = H * 0.66;       // curva I(y)
          var stripTop = gyBase + 26, stripH = 44; // "pantalla" real

          function px(ym) { return (gx0 + gx1) / 2 + (ym / Yr) * ((gx1 - gx0) / 2); }
          function sinTheta(ym) { return (ym) / L; }  // ym en metros ; ángulo pequeño

          // haz láser entrante animado (adorno)
          ctx.save();
          ctx.setLineDash([8, 8]); ctx.lineDashOffset = -(st.t * 60) % 16;
          ctx.strokeStyle = col; ctx.globalAlpha = 0.5; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo((gx0 + gx1) / 2, gyBase); ctx.lineTo((gx0 + gx1) / 2, gyBase + 20); ctx.stroke();
          ctx.restore();

          // envolvente de difracción (sin β/β)²  (blanca punteada)
          ctx.save();
          ctx.setLineDash([4, 4]); ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1.2;
          ctx.beginPath();
          var Wp = gx1 - gx0, i;
          for (i = 0; i <= Wp; i++) {
            var ym = (-Yr) + (i / Wp) * (2 * Yr);
            var e = intensity(sinTheta(ym)).env;
            var X = gx0 + i, Yv = gyBase - e * (gyBase - gyTop);
            if (i === 0) ctx.moveTo(X, Yv); else ctx.lineTo(X, Yv);
          }
          ctx.stroke();
          ctx.restore();

          // curva de intensidad completa (relleno en color del láser)
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

          // eje base
          ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(gx0, gyBase); ctx.lineTo(gx1, gyBase); ctx.stroke();

          // mínimos de difracción (líneas verticales)
          for (var p = 1; p <= 3; p++) {
            var ymin = p * lam * L / a;
            if (ymin > Yr) break;
            [px(ymin), px(-ymin)].forEach(function (xx) {
              dashLine(ctx, xx, gyTop, xx, gyBase, C.amber, 1);
            });
            if (p === 1) {
              ctx.fillStyle = C.amber; ctx.font = "10px ui-monospace, monospace";
              ctx.fillText("mín. difr.", px(ymin) + 3, gyTop + 12);
            }
          }

          // interfranja Δy (bracket entre y=0 y y=Δy)
          var dy = lam * L / d;
          if (dy < Yr) {
            var xa = px(0), xb = px(dy), yBr = gyTop + 4;
            ctx.strokeStyle = C.blue; ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(xa, yBr + 5); ctx.lineTo(xa, yBr); ctx.lineTo(xb, yBr); ctx.lineTo(xb, yBr + 5);
            ctx.stroke();
            ctx.fillStyle = C.blue; ctx.font = "10px ui-monospace, monospace";
            ctx.fillText("Δy", (xa + xb) / 2 - 6, yBr - 3);
          }

          // "pantalla": brillo real
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
          ctx.fillStyle = C.dim; ctx.font = "10px ui-monospace, monospace";
          ctx.fillText("pantalla", gx0 + 4, stripTop + stripH - 5);
          ctx.textAlign = "right";
          ctx.fillText("y (mm) →  ±" + (Yr * 1000).toFixed(0), gx1, stripTop - 4);
          ctx.textAlign = "left";
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
    blurb: "Rayo cruzando la interfaz entre dos medios. Arrastrá el rayo incidente o usá el slider; " +
      "al superar θ_c (solo si n₁ > n₂) no hay refracción: reflexión total interna.",
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
      { key: "estado", label: "estado" }
    ],
    create: function (env) {
      var st = { ti: 35, drag: false, ph: 0, Ox: 0, Oy: 0 };

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

      // arrastre del rayo incidente
      function onMove(e) {
        if (!st.drag) return;
        var dx = e.offsetX - st.Ox, dy = e.offsetY - st.Oy;
        if (dy >= -2) return;                       // solo por encima de la interfaz
        var ang = Math.atan2(Math.abs(dx), -dy) * DEG;
        st.ti = clamp(ang, 0, 89);
      }
      env.canvas.addEventListener("pointerdown", function (e) {
        st.drag = true; onMove(e);
      });
      env.canvas.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", function () { st.drag = false; });

      return {
        reset: function () { st.ti = env.params.thetaI; st.ph = 0; },
        onControl: function (key, val) { if (key === "thetaI") st.ti = val; },
        step: function (dt) {
          st.ph += dt;
          var p = physics();
          env.setReadout("ti", st.ti);
          env.setReadout("tt", p.tir ? "—" : p.tt * DEG);
          env.setReadout("tc", isNaN(p.tc) ? "—" : p.tc * DEG);
          env.setReadout("estado", p.tir ? "Reflexión total (TIR)" : "Refracta");
        },
        draw: function (ctx, W, H) {
          var p = physics();
          var Ox = W * 0.5, Oy = H * 0.5;
          st.Ox = Ox; st.Oy = Oy;
          var Lr = Math.min(W, H) * 0.42;

          // medios (más denso = más oscuro/saturado)
          function medFill(n, alpha) {
            var t = clamp((n - 1) / 1.5, 0, 1);
            return "rgba(146,207,242," + (alpha * (0.06 + 0.16 * t)).toFixed(3) + ")";
          }
          ctx.fillStyle = medFill(p.n1, 1); ctx.fillRect(0, 0, W, Oy);
          ctx.fillStyle = medFill(p.n2, 1); ctx.fillRect(0, Oy, W, H - Oy);
          // interfaz
          ctx.strokeStyle = C.gridStrong; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(0, Oy); ctx.lineTo(W, Oy); ctx.stroke();
          // normal
          dashLine(ctx, Ox, Oy - Lr - 10, Ox, Oy + Lr + 10, C.dim, 1);

          // etiquetas de medio
          ctx.fillStyle = C.dim; ctx.font = "11px ui-monospace, monospace";
          ctx.fillText("n₁ = " + p.n1.toFixed(2), 12, 18);
          ctx.fillText("n₂ = " + p.n2.toFixed(2), 12, H - 12);

          // ángulo crítico (rayo guía)
          if (!isNaN(p.tc)) {
            var xc = Ox - Lr * Math.sin(p.tc), yc = Oy - Lr * Math.cos(p.tc);
            dashLine(ctx, Ox, Oy, xc, yc, C.amber, 1);
            ctx.fillStyle = C.amber; ctx.font = "10px ui-monospace, monospace";
            ctx.fillText("θ_c", xc - 4, yc - 4);
          }

          // rayo incidente (desde arriba-izq hacia O)
          var si = Math.sin(p.ti), ci = Math.cos(p.ti);
          var ix = Ox - Lr * si, iy = Oy - Lr * ci;
          arrow(ctx, ix, iy, Ox, Oy, 9, C.blue, 2.6);
          // fotones marchando
          drawMarch(ctx, ix, iy, Ox, Oy, st.ph, C.blue, 1);

          // rayo reflejado (arriba-der)
          var rAlpha = 0.25 + 0.75 * p.R;
          ctx.globalAlpha = rAlpha;
          var rx = Ox + Lr * si, ry = Oy - Lr * ci;
          arrow(ctx, Ox, Oy, rx, ry, 8, C.coral, 1.4 + 2 * p.R);
          ctx.globalAlpha = 1;

          // rayo refractado (abajo)
          if (!p.tir) {
            var tAlpha = 0.2 + 0.8 * p.T;
            ctx.globalAlpha = tAlpha;
            var stt = Math.sin(p.tt), ctt = Math.cos(p.tt);
            var tx = Ox + Lr * stt, ty = Oy + Lr * ctt;
            arrow(ctx, Ox, Oy, tx, ty, 8, C.blue, 1.4 + 2 * p.T);
            drawMarch(ctx, Ox, Oy, tx, ty, st.ph, C.blue, 1);
            ctx.globalAlpha = 1;
          }

          // arcos de ángulo
          ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(Ox, Oy, 26, -Math.PI / 2 - p.ti, -Math.PI / 2); ctx.stroke();
          if (!p.tir) { ctx.beginPath(); ctx.arc(Ox, Oy, 26, Math.PI / 2, Math.PI / 2 + p.tt); ctx.stroke(); }

          // badge de estado
          ctx.font = "12px ui-monospace, monospace";
          var badge = p.tir ? "TIR" : "REFRACTA";
          ctx.fillStyle = p.tir ? C.coral : env.tint;
          ctx.textAlign = "right";
          ctx.fillText(badge, W - 12, 18);
          ctx.fillStyle = C.dim; ctx.font = "10px ui-monospace, monospace";
          ctx.fillText("arrastrá el rayo ↖", W - 12, 34);
          ctx.textAlign = "left";
        }
      };
    }
  });

  // fotones marchando a lo largo de un segmento (indica sentido de propagación)
  function drawMarch(ctx, x1, y1, x2, y2, ph, color, r) {
    var n = 5;
    var frac = (ph * 0.6) % 1;
    ctx.fillStyle = color;
    for (var i = 0; i < n; i++) {
      var t = ((i / n) + frac) % 1;
      var px = x1 + (x2 - x1) * t, py = y1 + (y2 - y1) * t;
      ctx.beginPath(); ctx.arc(px, py, r || 1.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  // rectángulo redondeado (helper de canvas)
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
})();
