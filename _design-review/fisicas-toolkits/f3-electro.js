/* ============================================================
   f3-electro.js — Física 3, sección "Electrostática y potencial".
   Registra 5 laboratorios interactivos en canvas 2D sobre SimKit,
   todos con tab:"f3" y section:"Electrostática y potencial".
   La pestaña F3 la registra otro archivo (registerTab).
   Todos exponen al menos un handle arrastrable (env.addHandle):
   el core hace hit-test, cursor grab/grabbing y dibuja el halo.
   Script clásico, sin módulos, compatible file://.
   ============================================================ */
(function () {
  "use strict";

  var PAL = (window.SimKit && window.SimKit.colors) || {};
  var TAU = Math.PI * 2;
  var SEC = "Electrostática y potencial";

  /* ---------- helpers de dibujo (locales a este archivo) ---------- */
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  // flecha con cabeza controlable (para vectores chicos/decorativos);
  // para vectores "principales" se usa env.arrow del core.
  function drawArrow(ctx, x0, y0, x1, y1, color, w, head) {
    var dx = x1 - x0, dy = y1 - y0, L = Math.sqrt(dx * dx + dy * dy);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w || 2;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    if (L < 1) return;
    var ux = dx / L, uy = dy / L, hs = head || 7;
    var a1 = x1 - ux * hs - uy * hs * 0.6, b1 = y1 - uy * hs + ux * hs * 0.6;
    var a2 = x1 - ux * hs + uy * hs * 0.6, b2 = y1 - uy * hs - ux * hs * 0.6;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(a1, b1); ctx.lineTo(a2, b2);
    ctx.closePath(); ctx.fill();
  }

  function dot(ctx, x, y, r, color) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }

  function pointerXY(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  // tabla de marching-squares compartida (equipotenciales)
  var CASES = [
    [], [3, 0], [0, 1], [1, 3], [1, 2], [3, 0, 1, 2], [0, 2], [2, 3],
    [2, 3], [0, 2], [0, 1, 2, 3], [1, 2], [1, 3], [0, 1], [0, 3], []
  ];
  function marchingSquares(ctx, g, cols, rows, step, level, color, lw) {
    var pts = [null, null, null, null];
    ctx.strokeStyle = color; ctx.lineWidth = lw || 1.1; ctx.beginPath();
    for (var j = 0; j < rows - 1; j++) {
      for (var i = 0; i < cols - 1; i++) {
        var v0 = g[j * cols + i], v1 = g[j * cols + i + 1],
          v2 = g[(j + 1) * cols + i + 1], v3 = g[(j + 1) * cols + i];
        var idx = (v0 > level ? 1 : 0) | (v1 > level ? 2 : 0) | (v2 > level ? 4 : 0) | (v3 > level ? 8 : 0);
        if (idx === 0 || idx === 15) continue;
        var x = i * step, y = j * step;
        pts[0] = { x: x + (level - v0) / (v1 - v0) * step, y: y };
        pts[1] = { x: x + step, y: y + (level - v1) / (v2 - v1) * step };
        pts[2] = { x: x + (level - v3) / (v2 - v3) * step, y: y + step };
        pts[3] = { x: x, y: y + (level - v0) / (v3 - v0) * step };
        var pr = CASES[idx];
        for (var p = 0; p < pr.length; p += 2) {
          var A = pts[pr[p]], B = pts[pr[p + 1]];
          ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y);
        }
      }
    }
    ctx.stroke();
  }

  /* ============================================================
     SIM 1 — Sandbox de cargas (Coulomb + superposición + Gauss)
     PORT de f3.js "sandbox" + presets + superficie gaussiana.
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SEC,
    id: "sandbox",
    title: "Sandbox de cargas",
    refs: "Resumen p.9 · Práctica g.1 (1.11)",
    blurb: "Arrastrá las cargas (cada una es un handle). Cargá un dipolo, un cuadrupolo o una hilera " +
      "de 4, sumá cargas + / − y mirá cómo se superponen las líneas de campo E y las equipotenciales. " +
      "Activá la superficie gaussiana (arrastrable y redimensionable) para leer Φ_E ∝ q_enc en vivo: el " +
      "puente conceptual a la ley de Gauss.",
    formula: "E = k·q/r² r̂   ·   V = Σ k·qᵢ/rᵢ   ·   Φ_E = ∮E·dS = q_enc/ε₀",
    stageHeight: 400,
    controls: [
      { type: "button", key: "dip", label: "Preset: dipolo" },
      { type: "button", key: "quad", label: "Preset: cuadrupolo" },
      { type: "button", key: "row", label: "Preset: hilera de 4" },
      { type: "button", key: "addp", label: "Agregar carga +" },
      { type: "button", key: "addn", label: "Agregar carga −" },
      { type: "button", key: "clear", label: "Limpiar" },
      { type: "toggle", key: "lines", label: "Líneas de campo E", value: true },
      { type: "toggle", key: "equi", label: "Equipotenciales", value: false },
      { type: "toggle", key: "gauss", label: "Superficie gaussiana", value: false },
    ],
    readouts: [
      { key: "E", label: "E (cursor)", unit: "V/m", digits: 0 },
      { key: "V", label: "V (cursor)", unit: "V", digits: 0 },
      { key: "n", label: "cargas", digits: 0 },
      { key: "qenc", label: "q_enc (Gauss)", unit: "nC", digits: 2 },
      { key: "phi", label: "Φ_E = q_enc/ε₀", unit: "V·m", digits: 0 },
    ],
    create: function (env) {
      var KE = 8.99e9, EPS0 = 8.854e-12, Q0 = 6e-9, MPP = 0.0018, MAXCH = 12;
      var LEVELS = [55, 130, 280, 600];
      var charges = [];
      var cursor = { x: -999, y: -999, on: false };
      var dirty = true;
      var needInit = true;
      var phase = 0;
      var cache = { lines: [], grid: null, cols: 0, rows: 0, step: 16, W: 0, H: 0 };
      var gs = { x: 0, y: 0, r: 0 };       // superficie gaussiana (px)
      var GEANG = -0.7;                    // ángulo del handle de radio

      function Vonly(x, y) {
        var V = 0;
        for (var i = 0; i < charges.length; i++) {
          var c = charges[i], dx = x - c.x, dy = y - c.y;
          var r_m = Math.sqrt(dx * dx + dy * dy) * MPP; if (r_m < 0.008) r_m = 0.008;
          V += KE * c.q / r_m;
        }
        return V;
      }
      function fieldAt(x, y) {
        var ex = 0, ey = 0, V = 0;
        for (var i = 0; i < charges.length; i++) {
          var c = charges[i], dx = x - c.x, dy = y - c.y;
          var rpx = Math.sqrt(dx * dx + dy * dy), r_m = rpx * MPP; if (r_m < 0.008) r_m = 0.008;
          V += KE * c.q / r_m;
          var f = KE * c.q / (r_m * r_m * r_m);
          ex += f * dx * MPP; ey += f * dy * MPP;
        }
        return { ex: ex, ey: ey, V: V, Emag: Math.sqrt(ex * ex + ey * ey) };
      }

      function computeLines(W, H) {
        var lines = [];
        var pos = charges.filter(function (c) { return c.q > 0; });
        var neg = charges.filter(function (c) { return c.q < 0; });
        var src = pos.length ? pos : neg;
        var sgn = pos.length ? 1 : -1;
        var seeds = 12, r0 = 13, h = 6, MAX = 260;
        for (var s = 0; s < src.length && s < 8; s++) {
          var base = src[s];
          var n = clamp(Math.round(Math.abs(base.q) / Q0 * seeds), 6, 18);
          for (var k = 0; k < n; k++) {
            var ang = TAU * k / n;
            var x = base.x + r0 * Math.cos(ang), y = base.y + r0 * Math.sin(ang);
            var poly = [x, y];
            for (var st = 0; st < MAX; st++) {
              var fld = fieldAt(x, y), m = fld.Emag; if (m < 1e-30) break;
              var ux = sgn * fld.ex / m, uy = sgn * fld.ey / m;
              x += ux * h; y += uy * h; poly.push(x, y);
              if (x < -8 || x > W + 8 || y < -8 || y > H + 8) break;
              var hit = false;
              for (var q = 0; q < charges.length; q++) {
                var cc = charges[q];
                if (cc.q * sgn < 0) {
                  var ddx = x - cc.x, ddy = y - cc.y;
                  if (ddx * ddx + ddy * ddy < 144) { hit = true; break; }
                }
              }
              if (hit) break;
            }
            if (poly.length > 4) lines.push(poly);
          }
        }
        return lines;
      }

      function rebuild(W, H) {
        var step = 16;
        var cols = Math.ceil(W / step) + 1, rows = Math.ceil(H / step) + 1;
        var grid = new Float32Array(cols * rows);
        for (var j = 0; j < rows; j++)
          for (var i = 0; i < cols; i++)
            grid[j * cols + i] = Vonly(i * step, j * step);
        cache.grid = grid; cache.cols = cols; cache.rows = rows; cache.step = step;
        cache.lines = computeLines(W, H); cache.W = W; cache.H = H;
        dirty = false;
      }

      function reset() { charges = []; dirty = true; phase = 0; needInit = true; gs.r = 0; }
      function initCharges(W, H) { presetDipolo(W, H); needInit = false; }

      /* ---- presets ---- */
      function presetDipolo(W, H) {
        charges = [
          { x: W * 0.40, y: H * 0.5, q: +Q0 },
          { x: W * 0.60, y: H * 0.5, q: -Q0 },
        ];
        dirty = true;
      }
      function presetCuadrupolo(W, H) {
        var cx = W * 0.5, cy = H * 0.5, s = Math.min(W, H) * 0.16;
        charges = [
          { x: cx - s, y: cy - s, q: +Q0 },
          { x: cx + s, y: cy - s, q: -Q0 },
          { x: cx + s, y: cy + s, q: +Q0 },
          { x: cx - s, y: cy + s, q: -Q0 },
        ];
        dirty = true;
      }
      function presetHilera(W, H) {
        var cy = H * 0.5, gap = W * 0.15;
        charges = [];
        for (var i = 0; i < 4; i++) {
          charges.push({ x: W * 0.5 + (i - 1.5) * gap, y: cy, q: +Q0 });
        }
        dirty = true;
      }

      function addCharge(sign) {
        if (charges.length >= MAXCH) return;
        var W = env.W || 600, H = env.H || 380;
        var x = W * 0.5 + (Math.random() - 0.5) * W * 0.4;
        var y = H * 0.5 + (Math.random() - 0.5) * H * 0.4;
        for (var i = 0; i < charges.length; i++) {
          var dx = x - charges[i].x, dy = y - charges[i].y;
          if (dx * dx + dy * dy < 40 * 40) { x += 46; y += 24; }
        }
        charges.push({ x: clamp(x, 24, W - 24), y: clamp(y, 24, H - 24), q: sign * Q0 });
        dirty = true;
      }

      /* ---- sonda de cursor (hover) + handles arrastrables ---- */
      var canvas = env.canvas;
      canvas.addEventListener("pointermove", function (e) {
        var p = pointerXY(canvas, e);
        cursor.x = p.x; cursor.y = p.y; cursor.on = true;
      });
      canvas.addEventListener("pointerleave", function () { cursor.on = false; });
      for (var hi = 0; hi < MAXCH; hi++) {
        (function (idx) {
          env.addHandle({
            r: 17,
            hidden: function () { return idx >= charges.length; },
            x: function () { return charges[idx] ? charges[idx].x : -999; },
            y: function () { return charges[idx] ? charges[idx].y : -999; },
            onDrag: function (px, py) {
              var c = charges[idx]; if (!c) return;
              c.x = clamp(px, 8, (env.W || 600) - 8);
              c.y = clamp(py, 8, (env.H || 380) - 8);
              dirty = true;
            },
          });
        })(hi);
      }

      // handle: centro de la superficie gaussiana (mover)
      env.addHandle({
        r: 15,
        hidden: function () { return !env.params.gauss; },
        x: function () { return gs.x; },
        y: function () { return gs.y; },
        onDrag: function (px, py) {
          var W = env.W || 600, H = env.H || 380;
          gs.x = clamp(px, gs.r, W - gs.r);
          gs.y = clamp(py, gs.r, H - gs.r);
        },
      });
      // handle: borde de la superficie gaussiana (redimensionar)
      env.addHandle({
        r: 13,
        hidden: function () { return !env.params.gauss; },
        x: function () { return gs.x + gs.r * Math.cos(GEANG); },
        y: function () { return gs.y + gs.r * Math.sin(GEANG); },
        onDrag: function (px, py) {
          var W = env.W || 600, H = env.H || 380;
          var maxR = Math.min(W, H) * 0.48;
          gs.r = clamp(Math.hypot(px - gs.x, py - gs.y), 22, maxR);
        },
      });

      function step(dt) { phase += dt * 46; }

      function draw(ctx, W, H) {
        if (needInit && W > 0) initCharges(W, H);
        if (dirty || cache.W !== W || cache.H !== H) rebuild(W, H);
        if (gs.r === 0 && W > 0) { gs.x = W * 0.5; gs.y = H * 0.42; gs.r = Math.min(W, H) * 0.22; }
        var col = env.colors;

        env.grid(ctx, W, H, 40);

        // equipotenciales
        if (env.params.equi && charges.length) {
          ctx.globalAlpha = 0.5;
          for (var l = 0; l < LEVELS.length; l++) {
            marchingSquares(ctx, cache.grid, cache.cols, cache.rows, cache.step, LEVELS[l], col.coral, 1.1);
            marchingSquares(ctx, cache.grid, cache.cols, cache.rows, cache.step, -LEVELS[l], col.blue, 1.1);
          }
          ctx.globalAlpha = 1;
        }

        // líneas de campo (dash animado = sentido de E)
        if (env.params.lines && charges.length) {
          ctx.strokeStyle = "rgba(47,159,143,0.85)"; ctx.lineWidth = 1.4;
          ctx.setLineDash([2, 6]); ctx.lineDashOffset = -phase;
          for (var li = 0; li < cache.lines.length; li++) {
            var poly = cache.lines[li];
            ctx.beginPath(); ctx.moveTo(poly[0], poly[1]);
            for (var pp = 2; pp < poly.length; pp += 2) ctx.lineTo(poly[pp], poly[pp + 1]);
            ctx.stroke();
            var mi = Math.floor(poly.length / 4) * 2;
            if (mi + 2 < poly.length) {
              var fx = poly[mi], fy = poly[mi + 1];
              var f2 = fieldAt(fx, fy), fm = f2.Emag || 1;
              var sg = (charges.filter(function (c) { return c.q > 0; }).length) ? 1 : -1;
              drawArrow(ctx, fx, fy, fx + sg * f2.ex / fm * 9, fy + sg * f2.ey / fm * 9, "rgba(47,159,143,0.9)", 1.2, 5);
            }
          }
          ctx.setLineDash([]);
        }

        // cargas
        for (var i = 0; i < charges.length; i++) {
          var c = charges[i];
          var color = c.q > 0 ? col.coral : col.blue;
          ctx.fillStyle = color;
          ctx.beginPath(); ctx.arc(c.x, c.y, 13, 0, TAU); ctx.fill();
          ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = col.ink; ctx.font = "bold 16px ui-monospace, Menlo, monospace";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(c.q > 0 ? "+" : "−", c.x, c.y);
        }
        ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";

        // superficie gaussiana + flujo
        var qencC = 0;
        if (env.params.gauss) {
          for (var gi = 0; gi < charges.length; gi++) {
            var cc = charges[gi];
            if (Math.hypot(cc.x - gs.x, cc.y - gs.y) <= gs.r) qencC += cc.q;
          }
          var netCol = qencC > 1e-12 ? col.coral : (qencC < -1e-12 ? col.blue : col.dim);
          ctx.save();
          ctx.globalAlpha = 0.10; ctx.fillStyle = netCol;
          ctx.beginPath(); ctx.arc(gs.x, gs.y, gs.r, 0, TAU); ctx.fill();
          ctx.globalAlpha = 0.95;
          ctx.strokeStyle = col.teal; ctx.lineWidth = 1.8;
          ctx.setLineDash([6, 5]); ctx.lineDashOffset = -phase * 0.6;
          ctx.beginPath(); ctx.arc(gs.x, gs.y, gs.r, 0, TAU); ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
          ctx.fillStyle = col.teal; ctx.font = "11px ui-monospace, Menlo, monospace";
          var phiTxt = "Φ_E = " + (qencC / EPS0).toFixed(0) + " V·m";
          ctx.fillText(phiTxt, gs.x - ctx.measureText(phiTxt).width / 2, gs.y - gs.r - 8);
          env.setReadout("qenc", qencC / 1e-9);
          env.setReadout("phi", qencC / EPS0);
        } else {
          env.setReadout("qenc", null);
          env.setReadout("phi", null);
        }

        // cursor: marcador + vector E + readouts
        if (cursor.on && cursor.x >= 0 && cursor.x <= W) {
          var fv = fieldAt(cursor.x, cursor.y);
          var m = fv.Emag || 1;
          var len = clamp(Math.log10(1 + m) * 12, 8, 46);
          env.arrow(ctx, cursor.x, cursor.y, cursor.x + fv.ex / m * len, cursor.y + fv.ey / m * len, col.amber, 2);
          dot(ctx, cursor.x, cursor.y, 3, col.text);
          env.setReadout("E", fv.Emag);
          env.setReadout("V", fv.V);
        } else {
          env.setReadout("E", null); env.setReadout("V", null);
        }
        env.setReadout("n", charges.length);
      }

      function onButton(key) {
        var W = env.W || 600, H = env.H || 380;
        if (key === "addp") addCharge(+1);
        else if (key === "addn") addCharge(-1);
        else if (key === "clear") { charges = []; dirty = true; }
        else if (key === "dip") presetDipolo(W, H);
        else if (key === "quad") presetCuadrupolo(W, H);
        else if (key === "row") presetHilera(W, H);
      }
      function onControl() { dirty = true; }

      return { reset: reset, step: step, draw: draw, onButton: onButton, onControl: onControl };
    },
  });

  /* ============================================================
     SIM 2 — Distribuciones continuas de carga (NUEVA)
     Campo E sobre el eje: anillo, disco, hilo finito, hilo ∞.
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SEC,
    id: "distribuciones",
    title: "Distribuciones continuas de carga",
    refs: "Resumen p.9 · Práctica g.1 (1.3, 1.4, 1.10, 1.12)",
    blurb: "Elegí la distribución y arrastrá el punto de medición sobre el eje. A la izquierda ves la " +
      "geometría con el vector E; a la derecha la curva E(x) sobre el eje. Cada caso muestra la fórmula " +
      "cerrada que sale de integrar dq: anillo y disco sobre su eje de simetría, hilo por distancia " +
      "perpendicular.",
    formula: "E(x) sobre el eje — integrando dE = k·dq/r²   (por superposición)",
    stageHeight: 360,
    controls: [
      { type: "segment", key: "geo", label: "Distribución", value: "anillo", options: [
        ["anillo", "Anillo"], ["disco", "Disco"],
        ["hilo_fin", "Hilo finito"], ["hilo_inf", "Hilo ∞"]] },
      { type: "range", key: "a", label: "radio a / semilargo L", min: 2, max: 12, step: 0.5, value: 6, unit: "cm", digits: 1 },
      { type: "range", key: "q", label: "carga fuente", min: 1, max: 12, step: 0.5, value: 6, digits: 1 },
    ],
    readouts: [
      { key: "E", label: "E (sonda)", unit: "kV/m", digits: 2 },
      { key: "d", label: "x / d (sonda)", unit: "cm", digits: 1 },
      { key: "src", label: "fuente" },
    ],
    create: function (env) {
      var KE = 8.99e9, EPS0 = 8.854e-12, XMAX = 16;
      var x_cm = 6;
      var st = { ox: 0, cy: 0, S: 1, leftW: 0 };

      var FORMULAS = {
        anillo: "E = k·Q·x / (x²+a²)^{3/2}",
        disco: "E = σ/2ε₀ · [1 − x/√(x²+a²)]",
        hilo_fin: "E = k·Q / (d·√(L²+d²))",
        hilo_inf: "E = λ / 2πε₀d = 2kλ/d",
      };

      // magnitud de E (SI, V/m) a distancia xc (cm) sobre el eje
      function Efield(xc) {
        var p = env.params, a = p.a, q = p.q;
        var a_m = a / 100, x_m = Math.max(xc, 0.02) / 100;
        if (p.geo === "anillo") {
          var Qr = q * 1e-9;
          return KE * Qr * x_m / Math.pow(x_m * x_m + a_m * a_m, 1.5);
        }
        if (p.geo === "disco") {
          var Qd = q * 1e-9, sig = Qd / (Math.PI * a_m * a_m);
          return sig / (2 * EPS0) * (1 - x_m / Math.sqrt(x_m * x_m + a_m * a_m));
        }
        if (p.geo === "hilo_fin") {
          var Qf = q * 1e-9, L_m = a_m;
          return KE * Qf / (x_m * Math.sqrt(L_m * L_m + x_m * x_m));
        }
        // hilo_inf: q interpretado como λ en nC/m
        var lam = q * 1e-9;
        return 2 * KE * lam / x_m;
      }

      function srcLabel() {
        var p = env.params;
        if (p.geo === "hilo_inf") return "λ=" + p.q.toFixed(1) + " nC/m";
        return "Q=" + p.q.toFixed(1) + " nC";
      }

      function reset() { x_cm = 6; }

      // handle: punto de medición sobre el eje (sólo x se mueve)
      env.addHandle({
        r: 16,
        x: function () { return st.ox + x_cm * st.S; },
        y: function () { return st.cy; },
        onDrag: function (px) {
          x_cm = clamp((px - st.ox) / st.S, 0.3, XMAX);
        },
      });

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params, geo = p.geo, a = p.a;
        var leftW = W * 0.5, ox = leftW * 0.22, cy = H * 0.5;
        var S = (leftW * 0.72) / XMAX;
        st.ox = ox; st.cy = cy; st.S = S; st.leftW = leftW;

        // separador
        ctx.strokeStyle = col.grid; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(leftW, 12); ctx.lineTo(leftW, H - 12); ctx.stroke();

        // eje horizontal
        ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ox, cy); ctx.lineTo(leftW - 8, cy); ctx.stroke();
        drawArrow(ctx, leftW - 20, cy, leftW - 8, cy, "rgba(255,255,255,0.35)", 1, 5);

        // geometría en el origen
        var aPx = a * S;
        ctx.lineWidth = 2;
        if (geo === "anillo") {
          ctx.strokeStyle = "rgba(244,124,89,0.5)";
          ctx.beginPath(); ctx.moveTo(ox, cy - aPx); ctx.lineTo(ox, cy + aPx); ctx.stroke();
          dot(ctx, ox, cy - aPx, 5, col.coral);
          dot(ctx, ox, cy + aPx, 5, col.coral);
        } else if (geo === "disco") {
          ctx.fillStyle = "rgba(244,124,89,0.5)";
          ctx.fillRect(ox - 3, cy - aPx, 6, aPx * 2);
          ctx.strokeStyle = col.coral; ctx.strokeRect(ox - 3, cy - aPx, 6, aPx * 2);
        } else if (geo === "hilo_fin") {
          ctx.strokeStyle = col.coral; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(ox, cy - aPx); ctx.lineTo(ox, cy + aPx); ctx.stroke();
          ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(ox - 6, cy - aPx); ctx.lineTo(ox + 6, cy - aPx);
          ctx.moveTo(ox - 6, cy + aPx); ctx.lineTo(ox + 6, cy + aPx); ctx.stroke();
        } else {
          // hilo infinito
          ctx.strokeStyle = col.coral; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(ox, 8); ctx.lineTo(ox, H - 8); ctx.stroke();
          drawArrow(ctx, ox, 20, ox, 6, col.coral, 1.4, 6);
          drawArrow(ctx, ox, H - 20, ox, H - 6, col.coral, 1.4, 6);
        }

        // sonda + vector E (horizontal, sale del origen)
        var sx = ox + x_cm * S;
        var Emag = Efield(x_cm);
        var len = clamp(Math.log10(1 + Emag) * 10, 10, leftW * 0.30);
        env.arrow(ctx, sx, cy, sx + len, cy, col.amber, 2);
        dot(ctx, sx, cy, 4, col.text);
        // línea guía de la distancia
        ctx.strokeStyle = "rgba(216,178,121,0.35)"; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(ox, cy + 14); ctx.lineTo(sx, cy + 14); ctx.stroke(); ctx.setLineDash([]);

        // etiquetas
        ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText(srcLabel(), 8, 18);
        ctx.fillStyle = col.teal; ctx.fillText(FORMULAS[geo], 8, H - 10);

        // ---- curva E(x) a la derecha ----
        var px0 = leftW + 46, px1 = W - 16, py0 = 22, py1 = H - 30;
        var N = 120, emax = 1e-9, samp = [];
        for (var i = 0; i <= N; i++) {
          var e = Efield(i / N * XMAX);
          samp.push(e); if (e > emax) emax = e;
        }
        emax *= 1.12;
        function PX(xc) { return px0 + xc / XMAX * (px1 - px0); }
        function PY(e) { return py1 - e / emax * (py1 - py0); }
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px0, py0); ctx.lineTo(px0, py1); ctx.lineTo(px1, py1); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText("E (kV/m)", px0 - 2, py0 - 6);
        ctx.fillText("x (cm)", px1 - 40, py1 + 16);
        ctx.fillText((emax / 1000).toFixed(1), px0 - 40, py0 + 6);
        ctx.fillText("0", px0 - 12, py1 + 3);
        // marcador de a (para anillo/disco/hilo finito)
        if (geo !== "hilo_inf") {
          ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.setLineDash([3, 3]);
          ctx.beginPath(); ctx.moveTo(PX(a), py0); ctx.lineTo(PX(a), py1); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = col.dim; ctx.fillText(geo === "hilo_fin" ? "L" : "a", PX(a) - 3, py0 + 10);
        }
        ctx.strokeStyle = col.teal; ctx.lineWidth = 2; ctx.beginPath();
        for (var k = 0; k <= N; k++) {
          var xx = PX(k / N * XMAX), yy = PY(samp[k]);
          if (k === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
        var opx = PX(clamp(x_cm, 0, XMAX)), opy = PY(Emag);
        ctx.strokeStyle = "rgba(47,159,143,0.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(opx, py1); ctx.lineTo(opx, opy); ctx.stroke();
        dot(ctx, opx, opy, 4, col.coral);

        env.setReadout("E", Emag / 1000);
        env.setReadout("d", x_cm);
        env.setReadout("src", srcLabel());
      }

      function onControl() {}
      return { reset: reset, draw: draw, onControl: onControl };
    },
  });

  /* ============================================================
     SIM 3 — Ley de Gauss E(r) y V(r) por geometría
     PORT de f3.js "gauss" + 6 geometrías + curva V(r).
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SEC,
    id: "gauss",
    title: "Ley de Gauss — E(r) y V(r)",
    refs: "Resumen p.10–14 · Práctica g.1",
    blurb: "Elegí una de las 6 geometrías canónicas y arrastrá el handle de la superficie gaussiana " +
      "para variar r. Las curvas E(r) y V(r) van lado a lado y muestran el comportamiento a trozos: " +
      "adentro vs. afuera del cuerpo. V se obtiene integrando E (V(∞)=0 para cuerpos finitos; " +
      "V(r_max)=0 para los infinitos).",
    formula: "∮E·dS = Q_enc/ε₀   ·   V(r) = −∫E·dl   ·   esfera 1/r²   ·   hilo/cilindro 1/r   ·   plano cte",
    stageHeight: 380,
    controls: [
      { type: "segment", key: "geo", label: "Geometría", value: "esf_cond", options: [
        ["esf_cond", "Esf. conductora"], ["esf_diel", "Esf. ρ"], ["cascaron", "Cascarón"],
        ["cil", "Cilindro ρ"], ["hilo", "Hilo ∞"], ["plano", "Plano/losa"]] },
      { type: "range", key: "a", label: "radio / semiespesor a", min: 3, max: 12, step: 0.5, value: 8, unit: "cm", digits: 1 },
      { type: "range", key: "src", label: "carga fuente", min: 1, max: 12, step: 0.5, value: 6, digits: 1 },
    ],
    readouts: [
      { key: "Er", label: "E(r)", unit: "kV/m", digits: 2 },
      { key: "Vr", label: "V(r)", unit: "kV", digits: 2 },
      { key: "Qenc", label: "Q_enc", unit: "nC", digits: 2 },
      { key: "rr", label: "r (sonda)", unit: "cm", digits: 1 },
    ],
    create: function (env) {
      var KE = 8.99e9, EPS0 = 8.854e-12;
      var MAXCM = 22, HANDLE_ANG = -0.6;
      var r_cm = 13;
      var dash = 0;
      var geoState = { cx: 0, cy: 0, S: 1 };

      function isFinite2() {
        var g = env.params.geo;
        return g === "esf_cond" || g === "esf_diel" || g === "cascaron";
      }
      // E (SI, V/m) a radio rr (cm)
      function Efield(rr) {
        var p = env.params, geo = p.geo, a = p.a, src = p.src;
        var a_m = a / 100, r_m = Math.max(rr, 0.02) / 100;
        if (geo === "esf_cond" || geo === "cascaron") {
          var Qc = src * 1e-9;
          return rr < a ? 0 : KE * Qc / (r_m * r_m);
        }
        if (geo === "esf_diel") {
          var Qd = src * 1e-9;
          return rr < a ? KE * Qd * r_m / (a_m * a_m * a_m) : KE * Qd / (r_m * r_m);
        }
        if (geo === "cil") {
          var lam = src * 1e-9;
          return rr < a ? 2 * KE * lam * r_m / (a_m * a_m) : 2 * KE * lam / r_m;
        }
        if (geo === "hilo") {
          var lh = src * 1e-9;
          return 2 * KE * lh / r_m;
        }
        // plano/losa
        var sig = src * 10 * 1e-9;
        var Eout = sig / (2 * EPS0);
        return rr < a ? Eout * (rr / a) : Eout;
      }
      function Qenc(rr) {
        var p = env.params, geo = p.geo, a = p.a, src = p.src;
        if (geo === "esf_cond" || geo === "cascaron") return rr < a ? 0 : src;
        if (geo === "esf_diel") return rr < a ? src * Math.pow(rr / a, 3) : src;
        if (geo === "cil") return rr < a ? src * Math.pow(rr / a, 2) : src;
        if (geo === "hilo") return src;
        return rr < a ? (src * 10) * (rr / a) : src * 10;
      }
      // V (SI, volts): integra E de rr..MAXCM y agrega la cola a ∞ (cuerpos finitos)
      function tailV() {
        if (!isFinite2()) return 0;
        var Q = env.params.src * 1e-9, R_m = MAXCM / 100;
        return KE * Q / R_m;
      }
      function Vat(rr) {
        rr = clamp(rr, 0.02, MAXCM);
        // conductor/cascarón: E salta a 0 en r=a → V es exactamente constante
        // adentro; se clampea a r=a para evitar el error de la trapezoidal al
        // cruzar la discontinuidad (y para que la curva V(r) quede plana).
        var g = env.params.geo;
        if ((g === "esf_cond" || g === "cascaron") && rr < env.params.a) rr = env.params.a;
        var steps = 100, h = (MAXCM - rr) / steps, V = 0;
        for (var i = 0; i < steps; i++) {
          var r1 = rr + i * h, r2 = rr + (i + 1) * h;
          V += 0.5 * (Efield(r1) + Efield(r2)) * (h / 100);
        }
        return V + tailV();
      }

      function reset() { r_cm = env.params.a * 1.6; dash = 0; }
      function step(dt) { dash += dt * 22; }

      // handle: punto sobre la superficie gaussiana; r se deduce de su distancia al centro
      function hx() {
        var rPx = r_cm * geoState.S;
        if (env.params.geo === "plano") return geoState.cx;
        return geoState.cx + rPx * Math.cos(HANDLE_ANG);
      }
      function hy() {
        var rPx = r_cm * geoState.S;
        if (env.params.geo === "plano") return geoState.cy - rPx;
        return geoState.cy + rPx * Math.sin(HANDLE_ANG);
      }
      env.addHandle({
        r: 16, x: hx, y: hy,
        onDrag: function (px, py) {
          if (env.params.geo === "plano") {
            r_cm = clamp(Math.abs(py - geoState.cy) / geoState.S, 0.4, MAXCM);
          } else {
            r_cm = clamp(Math.hypot(px - geoState.cx, py - geoState.cy) / geoState.S, 0.4, MAXCM);
          }
        },
      });

      // plotter de una curva f(r) sobre 0..MAXCM en la caja b
      function plotCurve(ctx, b, sampler, yLabel, showA) {
        var col = env.colors, N = 100, mx = 1e-12, s = [];
        for (var i = 0; i <= N; i++) {
          var v = sampler(i / N * MAXCM);
          s.push(v); if (v > mx) mx = v;
        }
        mx *= 1.15;
        function PX(rr) { return b.x0 + rr / MAXCM * (b.x1 - b.x0); }
        function PY(v) { return b.y1 - v / mx * (b.y1 - b.y0); }
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(b.x0, b.y0); ctx.lineTo(b.x0, b.y1); ctx.lineTo(b.x1, b.y1); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText(yLabel, b.x0 - 2, b.y0 - 5);
        ctx.fillText("r (cm)", b.x1 - 42, b.y1 + 14);
        ctx.fillText((mx).toPrecision(2), b.x0 - 2, b.y0 + 9);
        if (showA) {
          var a = env.params.a;
          ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(b.x0, b.y0, PX(a) - b.x0, b.y1 - b.y0);
          ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.setLineDash([3, 3]);
          ctx.beginPath(); ctx.moveTo(PX(a), b.y0); ctx.lineTo(PX(a), b.y1); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = col.dim; ctx.fillText("a", PX(a) - 3, b.y0 + 9);
        }
        ctx.strokeStyle = col.teal; ctx.lineWidth = 1.8; ctx.beginPath();
        for (var k = 0; k <= N; k++) {
          var xx = PX(k / N * MAXCM), yy = PY(s[k]);
          if (k === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
        var rc = clamp(r_cm, 0, MAXCM), val = sampler(rc);
        var opx = PX(rc), opy = PY(val);
        ctx.strokeStyle = "rgba(47,159,143,0.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(opx, b.y1); ctx.lineTo(opx, opy); ctx.stroke();
        dot(ctx, opx, opy, 3.5, col.coral);
      }

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params, a = p.a, geo = p.geo;
        var gW = W * 0.40;
        var cx = gW * 0.5, cy = H * 0.5;
        var S = Math.min(gW * 0.42, H * 0.42) / MAXCM;
        geoState.cx = cx; geoState.cy = cy; geoState.S = S;

        // separador
        ctx.strokeStyle = col.grid; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(gW + 8, 12); ctx.lineTo(gW + 8, H - 12); ctx.stroke();

        var aPx = a * S, rPx = r_cm * S;
        var srcLabel;
        if (geo === "plano") {
          ctx.fillStyle = "rgba(146,207,242,0.16)";
          ctx.fillRect(4, cy - aPx, gW - 8, aPx * 2);
          ctx.strokeStyle = col.blue; ctx.lineWidth = 1.5;
          ctx.strokeRect(4, cy - aPx, gW - 8, aPx * 2);
          ctx.setLineDash([5, 4]); ctx.lineDashOffset = -dash;
          ctx.strokeStyle = col.teal; ctx.lineWidth = 1.8;
          ctx.strokeRect(cx - 26, cy - rPx, 52, rPx * 2);
          ctx.setLineDash([]);
          env.arrow(ctx, cx + 38, cy, cx + 38, cy - rPx, col.teal, 1.4);
          srcLabel = "σ = " + (p.src * 10).toFixed(0) + " nC/m²";
        } else {
          var bodyCol = (geo === "esf_cond") ? col.amber : col.blue;
          if (geo === "cascaron") {
            // cascarón: sólo el borde en a (hueco adentro)
            ctx.strokeStyle = col.amber; ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.arc(cx, cy, aPx, 0, TAU); ctx.stroke();
            ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
            ctx.textAlign = "center"; ctx.fillText("hueco · E=0", cx, cy + 3); ctx.textAlign = "start";
          } else {
            ctx.fillStyle = (geo === "esf_cond") ? "rgba(216,178,121,0.18)" : "rgba(146,207,242,0.16)";
            ctx.beginPath(); ctx.arc(cx, cy, aPx, 0, TAU); ctx.fill();
            ctx.strokeStyle = bodyCol; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(cx, cy, aPx, 0, TAU); ctx.stroke();
            if (geo === "esf_cond") {
              ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
              ctx.textAlign = "center"; ctx.fillText("E=0 dentro", cx, cy + 3); ctx.textAlign = "start";
            } else if (geo === "hilo") {
              dot(ctx, cx, cy, 4, col.coral);
            }
          }
          ctx.setLineDash([5, 4]); ctx.lineDashOffset = -dash;
          ctx.strokeStyle = col.teal; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.arc(cx, cy, rPx, 0, TAU); ctx.stroke();
          ctx.setLineDash([]);
          env.arrow(ctx, cx, cy, cx + rPx * 0.94, cy, col.teal, 1.4);
          srcLabel = (geo === "cil" || geo === "hilo")
            ? ("λ = " + p.src.toFixed(1) + " nC/m")
            : ("Q = " + p.src.toFixed(1) + " nC");
        }
        ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText(srcLabel, 8, 18);
        if (geo !== "hilo") ctx.fillText("a = " + a.toFixed(1) + " cm", 8, 34);

        // ---- curvas E(r) (arriba) y V(r) (abajo) ----
        var bx0 = gW + 44, bx1 = W - 14, midY = H * 0.5;
        var showA = (geo !== "hilo");
        plotCurve(ctx, { x0: bx0, y0: 16, x1: bx1, y1: midY - 14 },
          function (rr) { return Efield(rr) / 1000; }, "E (kV/m)", showA);
        plotCurve(ctx, { x0: bx0, y0: midY + 12, x1: bx1, y1: H - 22 },
          function (rr) { return Vat(rr) / 1000; }, "V (kV)", showA);

        env.setReadout("Er", Efield(r_cm) / 1000);
        env.setReadout("Vr", Vat(r_cm) / 1000);
        env.setReadout("Qenc", Qenc(r_cm));
        env.setReadout("rr", r_cm);
      }

      function onControl() {}
      return { reset: reset, step: step, draw: draw, onControl: onControl };
    },
  });

  /* ============================================================
     SIM 4 — Carga en campo uniforme (deflexión entre placas) (NUEVA)
     Cañón de partículas entre placas paralelas (el clásico de CRT).
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SEC,
    id: "deflexion",
    title: "Carga en campo uniforme — deflexión entre placas",
    refs: "Resumen p.9,14 · Práctica g.1",
    blurb: "Cañón de partículas que entra horizontal entre dos placas paralelas. Arrastrá el punto de " +
      "inyección; ajustá la rapidez v₀, el voltaje V entre placas y el largo de las placas. Dentro del " +
      "campo la trayectoria es parabólica (proyectil eléctrico); afuera sigue recta hasta la pantalla. " +
      "Unidades escaladas de la sim (cm · V).",
    formula: "a = qE/m ∝ V/d   ·   y = ½·a·(L/v₀)²   ·   Y = y_placas + v_y·(D/v₀)",
    stageHeight: 340,
    controls: [
      { type: "range", key: "v0", label: "rapidez v₀", min: 20, max: 90, step: 1, value: 45, unit: "cm/s", digits: 0 },
      { type: "range", key: "V", label: "voltaje placas V", min: -300, max: 300, step: 5, value: 180, unit: "V", digits: 0 },
      { type: "range", key: "L", label: "largo placas L", min: 6, max: 16, step: 0.5, value: 13, unit: "cm", digits: 1 },
      { type: "range", key: "d", label: "separación d", min: 3, max: 8, step: 0.5, value: 5, unit: "cm", digits: 1 },
    ],
    readouts: [
      { key: "defl", label: "deflexión Y", unit: "cm", digits: 2 },
      { key: "tof", label: "t de vuelo", unit: "s", digits: 3 },
      { key: "E", label: "E entre placas", unit: "kV/m", digits: 2 },
      { key: "imp", label: "impacto" },
    ],
    create: function (env) {
      var WORLD = 34, ACC_K = 0.45, INJ_X = 1.5, PLATE_X0 = 6, SCREEN_X = 32;
      var S = 1, axisY = 0;
      var inj = 0;                    // offset vertical de inyección (cm, +abajo)
      var P = { x: 0, y: 0, vx: 0, vy: 0, alive: true, hit: null, deadT: 0 };
      var trail = [], ghost = [], impact = null;

      function accel() { return ACC_K * (env.params.V / env.params.d); }  // cm/s², +abajo

      function launch() {
        P.x = INJ_X; P.y = inj; P.vx = env.params.v0; P.vy = 0;
        P.alive = true; P.hit = null; P.deadT = 0;
        trail = [{ x: P.x, y: P.y }];
      }
      function reset() { ghost = []; impact = null; launch(); }

      function step(dt) {
        var p = env.params;
        if (!P.alive) {
          P.deadT += dt;
          if (P.deadT > 0.5) { ghost = trail.slice(); launch(); }
          return;
        }
        var x0 = PLATE_X0, x1 = PLATE_X0 + p.L;
        if (P.x >= x0 && P.x <= x1) P.vy += accel() * dt;
        P.x += P.vx * dt; P.y += P.vy * dt;
        trail.push({ x: P.x, y: P.y });
        if (trail.length > 3000) trail.shift();
        if (P.x >= x0 && P.x <= x1 && Math.abs(P.y) >= p.d / 2) {
          P.y = (P.y > 0 ? 1 : -1) * p.d / 2; P.alive = false; P.hit = "placa"; P.deadT = 0;
        } else if (P.x >= SCREEN_X) {
          impact = { y: P.y }; P.alive = false; P.hit = "pantalla"; P.deadT = 0;
        }
      }

      // handle: punto de inyección (arrastre vertical)
      env.addHandle({
        r: 16,
        x: function () { return INJ_X * S; },
        y: function () { return axisY + inj * S; },
        onDrag: function (px, py) {
          var lim = (axisY - 8) / S;
          inj = clamp((py - axisY) / S, -lim, lim);
          launch();
        },
      });

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params;
        S = W / WORLD; axisY = H * 0.5;
        function CX(xc) { return xc * S; }
        function CY(yc) { return axisY + yc * S; }
        if (P.vx === 0 && P.alive) launch();

        // eje central
        ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.setLineDash([4, 5]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(CX(INJ_X), axisY); ctx.lineTo(CX(SCREEN_X), axisY); ctx.stroke();
        ctx.setLineDash([]);

        // placas
        var px0 = CX(PLATE_X0), px1 = CX(PLATE_X0 + p.L);
        var topY = CY(-p.d / 2), botY = CY(p.d / 2);
        var vpos = p.V >= 0;
        ctx.lineWidth = 4;
        ctx.strokeStyle = vpos ? col.coral : col.blue;
        ctx.beginPath(); ctx.moveTo(px0, topY); ctx.lineTo(px1, topY); ctx.stroke();
        ctx.strokeStyle = vpos ? col.blue : col.coral;
        ctx.beginPath(); ctx.moveTo(px0, botY); ctx.lineTo(px1, botY); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.font = "13px ui-monospace, Menlo, monospace";
        ctx.fillText(vpos ? "+" : "−", px0 - 14, topY + 5);
        ctx.fillText(vpos ? "−" : "+", px0 - 14, botY + 5);

        // campo E entre placas (flechas del + al −)
        if (Math.abs(p.V) > 1) {
          ctx.globalAlpha = clamp(Math.abs(p.V) / 300, 0.2, 0.8);
          for (var fx = px0 + 14; fx < px1 - 4; fx += 26) {
            if (vpos) drawArrow(ctx, fx, topY + 4, fx, botY - 4, "rgba(216,178,121,0.9)", 1.2, 5);
            else drawArrow(ctx, fx, botY - 4, fx, topY + 4, "rgba(216,178,121,0.9)", 1.2, 5);
          }
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText("V = " + p.V.toFixed(0) + " V", px0, topY - 8);

        // pantalla
        var scX = CX(SCREEN_X);
        ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(scX, 10); ctx.lineTo(scX, H - 10); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText("pantalla", scX - 54, 16);
        if (impact) {
          var iy = CY(impact.y);
          ctx.strokeStyle = "rgba(216,178,121,0.55)"; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(scX, axisY); ctx.lineTo(scX, iy); ctx.stroke(); ctx.setLineDash([]);
          dot(ctx, scX, iy, 4, col.amber);
        }

        // trazas
        function stroke(tr, style, wid) {
          if (tr.length < 2) return;
          ctx.strokeStyle = style; ctx.lineWidth = wid; ctx.beginPath();
          ctx.moveTo(CX(tr[0].x), CY(tr[0].y));
          for (var i = 1; i < tr.length; i++) ctx.lineTo(CX(tr[i].x), CY(tr[i].y));
          ctx.stroke();
        }
        stroke(ghost, "rgba(47,159,143,0.22)", 1.2);
        stroke(trail, "rgba(47,159,143,0.7)", 1.8);

        // partícula
        if (P.alive || P.hit) {
          var pcol = P.hit === "placa" ? col.coral : col.teal;
          dot(ctx, CX(P.x), CY(P.y), 5.5, pcol);
          ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.arc(CX(P.x), CY(P.y), 5.5, 0, TAU); ctx.stroke();
        }

        // punto de inyección (marcador)
        ctx.fillStyle = col.amber; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText("v₀", CX(INJ_X) - 4, CY(inj) - 12);

        // ---- readouts (closed-form, entrada en inj) ----
        var a = accel();
        var tP = p.L / p.v0;
        var y1 = 0.5 * a * tP * tP;         // deflexión dentro (cm)
        var vyEx = a * tP;
        var drift = SCREEN_X - (PLATE_X0 + p.L);
        var tD = drift / p.v0;
        var y2 = vyEx * tD;
        var Y = y1 + y2;                    // deflexión total en pantalla (cm)
        var choca = Math.abs(inj + y1) >= p.d / 2;
        var Efield = Math.abs(p.V) / (p.d / 100);   // V/m
        env.setReadout("defl", Y);
        env.setReadout("tof", tP + tD);
        env.setReadout("E", Efield / 1000);
        env.setReadout("imp", choca ? "choca placa" : "pasa");
      }

      return { reset: reset, step: step, draw: draw };
    },
  });

  /* ============================================================
     SIM 5 — Trabajo y potencial (dipolo + carga de prueba)
     PORT de f3.js "potencial" (tal cual) + section.
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SEC,
    id: "potencial",
    title: "Trabajo y potencial — dipolo",
    refs: "Resumen p.14 · Práctica g.1 (1.10, 1.11)",
    blurb: "Arrastrá la carga de prueba por el mapa de equipotenciales del dipolo. Se acumula el " +
      "trabajo W = ∫F·dl a lo largo de TU camino (dibujado); compará con q·ΔV directo desde A: " +
      "coinciden siempre, porque el campo es conservativo.",
    formula: "W = q·ΔV = q(V_B − V_A) = −q∫E·dl   (independiente del camino)",
    stageHeight: 380,
    controls: [
      { type: "range", key: "qd", label: "carga del dipolo", min: 2, max: 12, step: 0.5, value: 6, unit: "nC", digits: 1 },
      { type: "range", key: "sep", label: "separación d", min: 3, max: 10, step: 0.5, value: 6, unit: "cm", digits: 1 },
      { type: "segment", key: "sgn", label: "carga de prueba", value: "pos", options: [["pos", "+ prueba"], ["neg", "− prueba"]] },
      { type: "toggle", key: "equi", label: "Equipotenciales", value: true },
      { type: "button", key: "resetp", label: "Reiniciar camino (fijar A)" },
    ],
    readouts: [
      { key: "V", label: "V (sonda)", unit: "V", digits: 0 },
      { key: "dV", label: "ΔV desde A", unit: "V", digits: 0 },
      { key: "Wpath", label: "W (∫F·dl camino)", unit: "nJ", digits: 1 },
      { key: "Wdir", label: "W = qΔV (directo)", unit: "nJ", digits: 1 },
    ],
    create: function (env) {
      var KE = 8.99e9, MPP = 0.0012;
      var LEVELS = [30, 80, 180, 400];
      var tp = { x: 0, y: 0 };
      var A = { x: 0, y: 0 }, VA = 0, Wpath = 0, path = [];
      var lastPos = { x: 0, y: 0 };
      var needInit = true, dirty = true;
      var cache = { grid: null, cols: 0, rows: 0, step: 14, W: 0, H: 0 };

      function qtest() { return (env.params.sgn === "neg" ? -1 : 1) * 1e-9; }
      function dipole() {
        var W = env.W || 600, H = env.H || 380;
        var sepPx = env.params.sep / 100 / MPP;
        return [
          { x: W / 2 - sepPx / 2, y: H / 2, q: +env.params.qd * 1e-9 },
          { x: W / 2 + sepPx / 2, y: H / 2, q: -env.params.qd * 1e-9 },
        ];
      }
      function Vat(x, y) {
        var d = dipole(), V = 0;
        for (var i = 0; i < d.length; i++) {
          var dx = x - d[i].x, dy = y - d[i].y;
          var r_m = Math.sqrt(dx * dx + dy * dy) * MPP; if (r_m < 0.006) r_m = 0.006;
          V += KE * d[i].q / r_m;
        }
        return V;
      }
      function Eat(x, y) {
        var d = dipole(), ex = 0, ey = 0;
        for (var i = 0; i < d.length; i++) {
          var dx = x - d[i].x, dy = y - d[i].y;
          var rpx = Math.sqrt(dx * dx + dy * dy), r_m = rpx * MPP; if (r_m < 0.006) r_m = 0.006;
          var f = KE * d[i].q / (r_m * r_m * r_m);
          ex += f * dx * MPP; ey += f * dy * MPP;
        }
        return { ex: ex, ey: ey };
      }

      function rebuild(W, H) {
        var step = 14;
        var cols = Math.ceil(W / step) + 1, rows = Math.ceil(H / step) + 1;
        var grid = new Float32Array(cols * rows);
        for (var j = 0; j < rows; j++)
          for (var i = 0; i < cols; i++)
            grid[j * cols + i] = Vat(i * step, j * step);
        cache.grid = grid; cache.cols = cols; cache.rows = rows; cache.step = step;
        cache.W = W; cache.H = H; dirty = false;
      }

      function initAt(W, H) {
        tp.x = W * 0.5 + 90; tp.y = H * 0.5 - 70;
        A.x = tp.x; A.y = tp.y; VA = Vat(tp.x, tp.y);
        Wpath = 0; path = [{ x: tp.x, y: tp.y }];
        lastPos.x = tp.x; lastPos.y = tp.y;
        needInit = false;
      }
      function resetPath() {
        A.x = tp.x; A.y = tp.y; VA = Vat(tp.x, tp.y);
        Wpath = 0; path = [{ x: tp.x, y: tp.y }];
        lastPos.x = tp.x; lastPos.y = tp.y;
      }
      function reset() { needInit = true; dirty = true; }

      env.addHandle({
        r: 16,
        x: function () { return tp.x; },
        y: function () { return tp.y; },
        onStart: function () { lastPos.x = tp.x; lastPos.y = tp.y; },
        onDrag: function (px, py) {
          var W = env.W || 600, H = env.H || 380;
          var nx = clamp(px, 6, W - 6), ny = clamp(py, 6, H - 6);
          var mx = (lastPos.x + nx) / 2, my = (lastPos.y + ny) / 2;
          var E = Eat(mx, my);
          var dlx = (nx - lastPos.x) * MPP, dly = (ny - lastPos.y) * MPP;
          Wpath += -qtest() * (E.ex * dlx + E.ey * dly);
          tp.x = nx; tp.y = ny;
          path.push({ x: nx, y: ny });
          if (path.length > 1200) path.shift();
          lastPos.x = nx; lastPos.y = ny;
        },
      });

      function draw(ctx, W, H) {
        if (needInit && W > 0) initAt(W, H);
        if (dirty || cache.W !== W || cache.H !== H) rebuild(W, H);
        var col = env.colors, d = dipole();

        env.grid(ctx, W, H, 40);

        if (env.params.equi) {
          ctx.globalAlpha = 0.55;
          for (var l = 0; l < LEVELS.length; l++) {
            marchingSquares(ctx, cache.grid, cache.cols, cache.rows, cache.step, LEVELS[l], col.coral, 1.1);
            marchingSquares(ctx, cache.grid, cache.cols, cache.rows, cache.step, -LEVELS[l], col.blue, 1.1);
          }
          ctx.globalAlpha = 1;
        }

        // camino recorrido
        if (path.length > 1) {
          ctx.strokeStyle = "rgba(216,178,121,0.9)"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(path[0].x, path[0].y);
          for (var pp = 1; pp < path.length; pp++) ctx.lineTo(path[pp].x, path[pp].y);
          ctx.stroke();
        }
        // punto A (referencia)
        ctx.strokeStyle = col.amber; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(A.x, A.y, 6, 0, TAU); ctx.stroke();
        ctx.fillStyle = col.amber; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText("A", A.x + 8, A.y - 6);

        // cargas del dipolo
        for (var i = 0; i < d.length; i++) {
          var c = d[i], color = c.q > 0 ? col.coral : col.blue;
          ctx.fillStyle = color;
          ctx.beginPath(); ctx.arc(c.x, c.y, 12, 0, TAU); ctx.fill();
          ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = col.ink; ctx.font = "bold 15px ui-monospace, Menlo, monospace";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(c.q > 0 ? "+" : "−", c.x, c.y);
        }
        ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";

        // carga de prueba (handle) + fuerza sobre ella
        var E = Eat(tp.x, tp.y), q = qtest();
        var Fx = q * E.ex, Fy = q * E.ey, Fm = Math.hypot(Fx, Fy) || 1;
        env.arrow(ctx, tp.x, tp.y, tp.x + Fx / Fm * 32, tp.y + Fy / Fm * 32, col.teal, 2);
        ctx.fillStyle = q > 0 ? col.coral : col.blue;
        ctx.beginPath(); ctx.arc(tp.x, tp.y, 8, 0, TAU); ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = col.teal; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText("F", tp.x + Fx / Fm * 38, tp.y + Fy / Fm * 38);

        var Vnow = Vat(tp.x, tp.y), dV = Vnow - VA;
        env.setReadout("V", Vnow);
        env.setReadout("dV", dV);
        env.setReadout("Wpath", Wpath * 1e9);
        env.setReadout("Wdir", q * dV * 1e9);
      }

      function onButton(key) { if (key === "resetp") resetPath(); }
      function onControl(key) {
        if (key === "qd" || key === "sep") { dirty = true; VA = Vat(A.x, A.y); }
      }
      return { reset: reset, draw: draw, onButton: onButton, onControl: onControl };
    },
  });

})();
