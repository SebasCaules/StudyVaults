/* ============================================================
   f3.js — Física 3 (Electromagnetismo). Registra la pestaña F3
   y 11 laboratorios interactivos en canvas 2D sobre SimKit.
   Todos exponen al menos un handle arrastrable (env.addHandle):
   el core hace hit-test, cursor grab/grabbing y dibuja el halo.
   Script clásico, sin módulos, compatible file://.
   ============================================================ */
(function () {
  "use strict";

  var PAL = (window.SimKit && window.SimKit.colors) || {};
  var TAU = Math.PI * 2;
  var MU0 = 4 * Math.PI * 1e-7;

  /* ---------- helpers de dibujo ---------- */
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
     TAB
     ============================================================ */
  SimKit.registerTab({
    id: "f3",
    intro: "Electromagnetismo táctil: agarrá las cargas, la superficie gaussiana, la sonda de " +
      "campo, el dieléctrico o el punto de resonancia y mirá cómo responde la física en vivo. " +
      "Cada laboratorio refuerza un tema del resumen y las guías de la práctica.",
  });

  /* ============================================================
     SIM 1 — Sandbox de cargas (Coulomb + superposición)
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    id: "sandbox",
    title: "Sandbox de cargas",
    refs: "Resumen p.9 · Práctica g.1",
    blurb: "Arrastrá las cargas (cada una es un handle). Empezá con un dipolo, sumá cargas + / − " +
      "y mirá cómo se superponen las líneas de campo E y las equipotenciales. Pasá el mouse para " +
      "sondear E y V en cualquier punto.",
    formula: "E = k·q/r² r̂   ·   V = Σ k·qᵢ/rᵢ   (superposición)",
    stageHeight: 380,
    controls: [
      { type: "button", key: "addp", label: "Agregar carga +" },
      { type: "button", key: "addn", label: "Agregar carga −" },
      { type: "button", key: "clear", label: "Limpiar" },
      { type: "toggle", key: "lines", label: "Líneas de campo E", value: true },
      { type: "toggle", key: "equi", label: "Equipotenciales", value: false },
    ],
    readouts: [
      { key: "E", label: "E (cursor)", unit: "V/m", digits: 0 },
      { key: "V", label: "V (cursor)", unit: "V", digits: 0 },
      { key: "n", label: "cargas", digits: 0 },
    ],
    create: function (env) {
      var KE = 8.99e9, Q0 = 6e-9, MPP = 0.0018, MAXCH = 10;
      var LEVELS = [55, 130, 280, 600];
      var charges = [];
      var cursor = { x: -999, y: -999, on: false };
      var dirty = true;
      var needInit = true;
      var phase = 0;
      var cache = { lines: [], grid: null, cols: 0, rows: 0, step: 16, W: 0, H: 0 };

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

      function reset() { charges = []; dirty = true; phase = 0; needInit = true; }
      function initCharges(W, H) {
        charges = [
          { x: W * 0.38, y: H * 0.5, q: +Q0 },
          { x: W * 0.62, y: H * 0.5, q: -Q0 },
        ];
        needInit = false; dirty = true;
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

      function step(dt) { phase += dt * 46; }

      function draw(ctx, W, H) {
        if (needInit && W > 0) initCharges(W, H);
        if (dirty || cache.W !== W || cache.H !== H) rebuild(W, H);
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
        if (key === "addp") addCharge(+1);
        else if (key === "addn") addCharge(-1);
        else if (key === "clear") { charges = []; dirty = true; }
      }
      function onControl() { dirty = true; }

      return { reset: reset, step: step, draw: draw, onButton: onButton, onControl: onControl };
    },
  });

  /* ============================================================
     SIM 2 — Ley de Gauss: E(r) por geometría
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    id: "gauss",
    title: "Ley de Gauss — E(r)",
    refs: "Resumen p.10–13 · Práctica g.1",
    blurb: "Elegí la geometría y arrastrá el handle de la superficie gaussiana para variar r. " +
      "La curva E(r) muestra el comportamiento a trozos: adentro vs. afuera del cuerpo.",
    formula: "∮ E·dS = Q_enc/ε₀   ·   esfera: E∝1/r²   ·   hilo/cilindro: E∝1/r   ·   plano: E cte",
    stageHeight: 360,
    controls: [
      { type: "segment", key: "geo", label: "Geometría", value: "esf_cond", options: [
        ["esf_cond", "Esfera conductora"], ["esf_diel", "Esfera ρ"],
        ["cil", "Cilindro ∞"], ["plano", "Plano/losa"]] },
      { type: "range", key: "a", label: "radio / semiespesor a", min: 3, max: 12, step: 0.5, value: 8, unit: "cm", digits: 1 },
      { type: "range", key: "src", label: "carga fuente", min: 1, max: 12, step: 0.5, value: 6, digits: 1 },
    ],
    readouts: [
      { key: "Er", label: "E(r)", unit: "kV/m", digits: 2 },
      { key: "Qenc", label: "Q_enc", unit: "nC", digits: 2 },
      { key: "rr", label: "r (sonda)", unit: "cm", digits: 1 },
    ],
    create: function (env) {
      var KE = 8.99e9, EPS0 = 8.854e-12;
      var MAXCM = 22, HANDLE_ANG = -0.6;
      var r_cm = 13;
      var dash = 0;
      var geoState = { cx: 0, cy: 0, S: 1 };

      function physics(rr) {
        var p = env.params, geo = p.geo, a = p.a, src = p.src;
        var a_m = a / 100, r_m = Math.max(rr, 0.05) / 100;
        var E = 0, Q = 0;
        if (geo === "esf_cond") {
          var Qc = src * 1e-9;
          if (rr < a) { E = 0; Q = 0; }
          else { E = KE * Qc / (r_m * r_m); Q = src; }
        } else if (geo === "esf_diel") {
          var Qd = src * 1e-9;
          if (rr < a) { E = KE * Qd * r_m / (a_m * a_m * a_m); Q = src * Math.pow(rr / a, 3); }
          else { E = KE * Qd / (r_m * r_m); Q = src; }
        } else if (geo === "cil") {
          var lam = src * 1e-9;
          if (rr < a) { E = 2 * KE * lam * r_m / (a_m * a_m); Q = src * Math.pow(rr / a, 2); }
          else { E = 2 * KE * lam / r_m; Q = src; }
        } else {
          var sig = src * 10 * 1e-9;
          var Eout = sig / (2 * EPS0);
          if (rr < a) { E = Eout * (rr / a); Q = (src * 10) * (rr / a); }
          else { E = Eout; Q = src * 10; }
        }
        return { E: E, Q: Q };
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

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params, a = p.a, geo = p.geo;
        var leftW = W * 0.5, cx = leftW * 0.5, cy = H * 0.5;
        var S = Math.min(leftW * 0.5, H * 0.5) * 0.9 / MAXCM;
        geoState.cx = cx; geoState.cy = cy; geoState.S = S;

        ctx.strokeStyle = col.grid; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(leftW, 12); ctx.lineTo(leftW, H - 12); ctx.stroke();

        var aPx = a * S, rPx = r_cm * S;
        var srcLabel;
        if (geo === "plano") {
          ctx.fillStyle = "rgba(146,207,242,0.16)";
          ctx.fillRect(4, cy - aPx, leftW - 8, aPx * 2);
          ctx.strokeStyle = col.blue; ctx.lineWidth = 1.5;
          ctx.strokeRect(4, cy - aPx, leftW - 8, aPx * 2);
          ctx.setLineDash([5, 4]); ctx.lineDashOffset = -dash;
          ctx.strokeStyle = col.teal; ctx.lineWidth = 1.8;
          ctx.strokeRect(cx - 30, cy - rPx, 60, rPx * 2);
          ctx.setLineDash([]);
          env.arrow(ctx, cx + 44, cy, cx + 44, cy - rPx, col.teal, 1.4);
          srcLabel = "σ = " + (p.src * 10).toFixed(0) + " nC/m²";
        } else {
          var bodyCol = (geo === "esf_cond") ? col.amber : col.blue;
          ctx.fillStyle = (geo === "esf_cond") ? "rgba(216,178,121,0.18)" : "rgba(146,207,242,0.16)";
          ctx.beginPath(); ctx.arc(cx, cy, aPx, 0, TAU); ctx.fill();
          ctx.strokeStyle = bodyCol; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(cx, cy, aPx, 0, TAU); ctx.stroke();
          if (geo === "esf_cond") {
            ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
            ctx.textAlign = "center"; ctx.fillText("E=0 dentro", cx, cy + 3); ctx.textAlign = "start";
          }
          ctx.setLineDash([5, 4]); ctx.lineDashOffset = -dash;
          ctx.strokeStyle = col.teal; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.arc(cx, cy, rPx, 0, TAU); ctx.stroke();
          ctx.setLineDash([]);
          env.arrow(ctx, cx, cy, cx + rPx * 0.94, cy, col.teal, 1.4);
          srcLabel = (geo === "cil") ? ("λ = " + p.src.toFixed(1) + " nC/m")
            : ("Q = " + p.src.toFixed(1) + " nC");
        }
        ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText(srcLabel, 8, 18);
        ctx.fillText("a = " + a.toFixed(1) + " cm", 8, 34);

        // ---- curva E(r) ----
        var px0 = leftW + 46, px1 = W - 16, py0 = 20, py1 = H - 30;
        var N = 120, emax = 1e-9;
        var samp = [];
        for (var i = 0; i <= N; i++) {
          var rr = i / N * MAXCM;
          var e = physics(rr).E;
          samp.push(e); if (e > emax) emax = e;
        }
        emax *= 1.12;
        function PX(rr) { return px0 + rr / MAXCM * (px1 - px0); }
        function PY(e) { return py1 - e / emax * (py1 - py0); }
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px0, py0); ctx.lineTo(px0, py1); ctx.lineTo(px1, py1); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText("E (kV/m)", px0 - 2, py0 - 6);
        ctx.fillText("r (cm)", px1 - 34, py1 + 16);
        ctx.fillText((emax / 1000).toFixed(1), px0 - 40, py0 + 6);
        ctx.fillText("0", px0 - 12, py1 + 3);
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillRect(px0, py0, PX(a) - px0, py1 - py0);
        ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(PX(a), py0); ctx.lineTo(PX(a), py1); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillText("a", PX(a) - 3, py0 + 10);
        ctx.strokeStyle = col.teal; ctx.lineWidth = 2; ctx.beginPath();
        for (var k = 0; k <= N; k++) {
          var xx = PX(k / N * MAXCM), yy = PY(samp[k]);
          if (k === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
        var cur = physics(r_cm);
        var opx = PX(clamp(r_cm, 0, MAXCM)), opy = PY(cur.E);
        ctx.strokeStyle = "rgba(47,159,143,0.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(opx, py1); ctx.lineTo(opx, opy); ctx.stroke();
        dot(ctx, opx, opy, 4, col.coral);

        env.setReadout("Er", cur.E / 1000);
        env.setReadout("Qenc", cur.Q);
        env.setReadout("rr", r_cm);
      }

      function onControl() {}
      return { reset: reset, step: step, draw: draw, onControl: onControl };
    },
  });

  /* ============================================================
     SIM 3 — Ciclotrón / fuerza de Lorentz
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    id: "ciclotron",
    title: "Ciclotrón — fuerza de Lorentz",
    refs: "Resumen p.21 · Práctica g.4",
    blurb: "Carga en un B uniforme perpendicular a la pantalla. Arrastrá la punta del vector v₀ " +
      "(largo = rapidez, ángulo = dirección) para reescalar la órbita: r = mv/qB. Con E cruzado " +
      "aparece la deriva E×B (cicloide). Unidades escaladas de la sim.",
    formula: "F = qE + qv×B   ·   r = mv/(qB)   ·   T = 2πm/(qB)   ·   f = qB/(2πm)",
    stageHeight: 380,
    controls: [
      { type: "segment", key: "bdir", label: "Campo B", value: "out", options: [["out", "⊙ sale"], ["in", "⊗ entra"]] },
      { type: "range", key: "q", label: "carga q", min: 1, max: 6, step: 0.5, value: 3, unit: "·q₀", digits: 1 },
      { type: "range", key: "m", label: "masa m", min: 1, max: 6, step: 0.5, value: 3, unit: "·m₀", digits: 1 },
      { type: "range", key: "B", label: "|B|", min: 10, max: 100, step: 5, value: 50, unit: "mT", digits: 0 },
      { type: "toggle", key: "efield", label: "Campo E adicional (E×B)", value: false },
    ],
    readouts: [
      { key: "v0", label: "v₀ (arrastrable)", unit: "u", digits: 0 },
      { key: "r", label: "radio r", unit: "cm", digits: 1 },
      { key: "T", label: "período T", unit: "s", digits: 2 },
      { key: "f", label: "f ciclotrón", unit: "Hz", digits: 2 },
    ],
    create: function (env) {
      var OMEGA_K = 0.06, SPEED_K = 3.3, PX_PER_CM = 5, DRIFT = 45, LEN_K = 0.5;
      var v0mag = 110, v0ang = 0;
      var x = 0, y = 0, vx = 0, vy = 0, trace = [], inited = false;

      function Bz() { return (env.params.bdir === "in" ? -1 : 1) * env.params.B; }
      function cx() { return (env.W || 600) / 2; }
      function cy() { return (env.H || 380) / 2; }
      function alen() { return clamp(v0mag * LEN_K, 22, 120); }

      function reset() {
        var p = env.params;
        var bz = Bz(), qm = (p.q / p.m) * OMEGA_K, omega = qm * bz;
        var speed = v0mag * SPEED_K, Rpx = Math.abs(speed / omega);
        vx = speed * Math.cos(v0ang); vy = speed * Math.sin(v0ang);
        var fx = p.q * (vy * bz), fy = p.q * (-vx * bz);
        var fm = Math.sqrt(fx * fx + fy * fy) || 1; fx /= fm; fy /= fm;
        x = cx() - fx * Rpx; y = cy() - fy * Rpx;
        trace = [];
        inited = (env.W || 0) > 0;
      }

      // handle: punta del vector v₀ (dial de rapidez + dirección)
      env.addHandle({
        r: 15,
        x: function () { return cx() + Math.cos(v0ang) * alen(); },
        y: function () { return cy() + Math.sin(v0ang) * alen(); },
        onDrag: function (px, py) {
          var dx = px - cx(), dy = py - cy(), L = Math.hypot(dx, dy);
          v0ang = Math.atan2(dy, dx);
          v0mag = clamp(L / LEN_K, 40, 200);
          reset();
        },
      });

      function step(dt) {
        var W = env.W || 600, H = env.H || 380, p = env.params;
        var bz = Bz(), qm = (p.q / p.m) * OMEGA_K;
        var Emag = p.efield ? DRIFT * Math.abs(bz) : 0;
        var Ex = Emag, Ey = 0;
        var vmx = vx + qm * Ex * (dt / 2), vmy = vy + qm * Ey * (dt / 2);
        var t = qm * bz * (dt / 2);
        var vpx = vmx + vmy * t, vpy = vmy - vmx * t;
        var s = 2 * t / (1 + t * t);
        var vppx = vmx + vpy * s, vppy = vmy - vpx * s;
        vx = vppx + qm * Ex * (dt / 2); vy = vppy + qm * Ey * (dt / 2);
        x += vx * dt; y += vy * dt;
        var brk = false;
        if (x < 0) { x += W; brk = true; } else if (x > W) { x -= W; brk = true; }
        if (y < 0) { y += H; brk = true; } else if (y > H) { y -= H; brk = true; }
        if (brk) trace.push(null);
        trace.push({ x: x, y: y });
        if (trace.length > 1600) trace.shift();
      }

      function draw(ctx, W, H) {
        if (!inited && W > 0) reset();
        var col = env.colors, p = env.params, into = p.bdir === "in";

        // campo B (símbolos ⊙/⊗)
        ctx.strokeStyle = "rgba(255,255,255,0.14)"; ctx.fillStyle = "rgba(255,255,255,0.14)";
        for (var sx = 30; sx < W; sx += 48) {
          for (var sy = 30; sy < H; sy += 48) {
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(sx, sy, 5, 0, TAU); ctx.stroke();
            if (into) {
              ctx.beginPath();
              ctx.moveTo(sx - 3.2, sy - 3.2); ctx.lineTo(sx + 3.2, sy + 3.2);
              ctx.moveTo(sx + 3.2, sy - 3.2); ctx.lineTo(sx - 3.2, sy + 3.2); ctx.stroke();
            } else { dot(ctx, sx, sy, 1.6, "rgba(255,255,255,0.22)"); }
          }
        }
        ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText("B " + (into ? "entra (⊗)" : "sale (⊙)"), 10, 18);

        if (p.efield) {
          for (var ey2 = 40; ey2 < H; ey2 += 60) drawArrow(ctx, 12, ey2, 40, ey2, "rgba(216,178,121,0.55)", 1.2, 5);
          ctx.fillStyle = col.amber; ctx.fillText("E →", 10, 34);
        }

        var bz = Bz(), qm = (p.q / p.m) * OMEGA_K, omega = Math.abs(qm * bz);
        var speed = v0mag * SPEED_K, Rpx = speed / omega;

        // órbita teórica (centrada) — sólo sin E×B
        if (!p.efield) {
          ctx.strokeStyle = "rgba(161,161,170,0.35)"; ctx.setLineDash([4, 5]); ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(cx(), cy(), Rpx, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
        }

        // traza
        ctx.strokeStyle = "rgba(47,159,143,0.55)"; ctx.lineWidth = 1.6;
        ctx.beginPath(); var pen = false;
        for (var i = 0; i < trace.length; i++) {
          var pnt = trace[i];
          if (!pnt) { pen = false; continue; }
          if (!pen) { ctx.moveTo(pnt.x, pnt.y); pen = true; } else ctx.lineTo(pnt.x, pnt.y);
        }
        ctx.stroke();

        // vector de control v₀ (dial, anclado al centro)
        var tx = cx() + Math.cos(v0ang) * alen(), ty = cy() + Math.sin(v0ang) * alen();
        env.arrow(ctx, cx(), cy(), tx, ty, col.amber, 2);
        ctx.fillStyle = col.amber; ctx.fillText("v₀", tx + 6, ty);

        // partícula
        var pcol = p.q >= 0 ? col.coral : col.blue;
        dot(ctx, x, y, 7, pcol);
        ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.stroke();

        // vectores v y F=qv×B sobre la partícula
        var vm = Math.sqrt(vx * vx + vy * vy) || 1;
        env.arrow(ctx, x, y, x + vx / vm * 34, y + vy / vm * 34, col.teal, 2);
        var Fx = p.q * (vy * bz), Fy = p.q * (-vx * bz);
        var fm = Math.sqrt(Fx * Fx + Fy * Fy) || 1;
        env.arrow(ctx, x, y, x + Fx / fm * 30, y + Fy / fm * 30, col.coral, 2);
        ctx.fillStyle = col.teal; ctx.fillText("v", x + vx / vm * 40, y + vy / vm * 40);
        ctx.fillStyle = col.coral; ctx.fillText("F", x + Fx / fm * 36, y + Fy / fm * 36);

        env.setReadout("v0", v0mag);
        env.setReadout("r", Rpx / PX_PER_CM);
        env.setReadout("T", TAU / omega);
        env.setReadout("f", omega / TAU);
      }

      function onControl() { reset(); }
      return { reset: reset, step: step, draw: draw, onControl: onControl };
    },
  });

  /* ============================================================
     SIM 4 — Fem de movimiento: espira cayendo (práctica 6.10)
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    id: "faraday",
    title: "Fem de movimiento — espira cayendo",
    refs: "Resumen p.23 · Práctica g.6 (6.8, 6.10)",
    blurb: "Arrastrá la espira verticalmente para posicionarla respecto del borde del campo, soltala " +
      "y mirá caer. Mientras cruza el borde aparece fem, corriente y una fuerza que frena (Lenz): " +
      "puede llegar a velocidad terminal.",
    formula: "ε = −dΦ/dt = Bℓv   ·   i = Bℓv/R   ·   v_t = mgR/(B²ℓ²)",
    stageHeight: 360,
    controls: [
      { type: "range", key: "B", label: "campo B", min: 0.5, max: 3, step: 0.1, value: 2, unit: "T", digits: 1 },
      { type: "range", key: "b", label: "lado b (ancho ℓ)", min: 0.1, max: 0.5, step: 0.02, value: 0.25, unit: "m", digits: 2 },
      { type: "range", key: "a", label: "lado a (alto)", min: 0.2, max: 0.6, step: 0.02, value: 0.4, unit: "m", digits: 2 },
      { type: "range", key: "R", label: "resistencia R", min: 0.5, max: 5, step: 0.1, value: 1.3, unit: "Ω", digits: 1 },
      { type: "range", key: "m", label: "masa m", min: 5, max: 100, step: 5, value: 20, unit: "g", digits: 0 },
    ],
    readouts: [
      { key: "i", label: "corriente i", unit: "A", digits: 3 },
      { key: "v", label: "velocidad v", unit: "m/s", digits: 2 },
      { key: "vt", label: "v terminal", unit: "m/s", digits: 2 },
    ],
    plot: {
      height: 150, window: 4, autoY: true,
      xLabel: "t (s)", yLabel: "Φ (Wb) · ε (V)",
      series: [{ key: "phi", label: "Φ", color: PAL.teal }, { key: "eps", label: "ε", color: PAL.coral }],
    },
    create: function (env) {
      var PPM = 200, G = 9.8;
      var y = 0.02, v = 0, t = 0, grabbed = false;

      function reset() { y = 0.02; v = 0; t = 0; grabbed = false; env.plot.clear(); }

      function geom(H) {
        var p = env.params;
        var Yb = 0.42 * H / PPM;
        var overlap = clamp(Yb - y, 0, p.a);
        var straddling = (y < Yb && (y + p.a) > Yb);
        return { Yb: Yb, overlap: overlap, straddling: straddling };
      }

      // handle: agarrar la espira y moverla en vertical (pausa la caída)
      env.addHandle({
        r: 22,
        x: function () { return (env.W || 600) * 0.5; },
        y: function () { return y * PPM + (env.params.a * PPM) / 2; },
        onStart: function () { grabbed = true; v = 0; },
        onDrag: function (px, py) {
          var H = env.H || 360, lh = env.params.a * PPM;
          y = clamp((py - lh / 2) / PPM, 0, (H - 4) / PPM);
          v = 0;
        },
        onEnd: function () { grabbed = false; },
      });

      function step(dt) {
        var p = env.params, H = env.H || 360;
        t += dt;
        if (!grabbed) {
          var m = p.m / 1000, g = geom(H);
          var Fdrag = g.straddling ? (p.B * p.B * p.b * p.b * v) / p.R : 0;
          var acc = G - Fdrag / m;
          v += acc * dt; y += v * dt;
          if (y * PPM > H + 12) { y = 0.02; v = 0; }
        }
        var g2 = geom(H);
        var Phi = p.B * p.b * g2.overlap;
        var eps = (!grabbed && g2.straddling) ? p.B * p.b * v : 0;
        env.plot.push(t, { phi: Phi, eps: eps });
      }

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params, g = geom(H);
        var YbPx = g.Yb * PPM;
        var m = p.m / 1000;
        var vt = m * G * p.R / (p.B * p.B * p.b * p.b);

        ctx.fillStyle = "rgba(146,207,242,0.10)"; ctx.fillRect(0, 0, W, YbPx);
        ctx.strokeStyle = "rgba(255,255,255,0.14)"; ctx.lineWidth = 1;
        for (var sx = 24; sx < W; sx += 46) {
          for (var sy = 22; sy < YbPx - 6; sy += 44) {
            ctx.beginPath(); ctx.arc(sx, sy, 4.5, 0, TAU); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(sx - 3, sy - 3); ctx.lineTo(sx + 3, sy + 3);
            ctx.moveTo(sx + 3, sy - 3); ctx.lineTo(sx - 3, sy + 3); ctx.stroke();
          }
        }
        ctx.strokeStyle = col.blue; ctx.setLineDash([6, 4]); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(0, YbPx); ctx.lineTo(W, YbPx); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText("B (⊗)", 10, 18); ctx.fillText("borde del campo", W - 118, YbPx - 6);

        var lx = W * 0.5 - (p.b * PPM) / 2, ly = y * PPM, lw = p.b * PPM, lh = p.a * PPM;
        ctx.strokeStyle = col.coral; ctx.lineWidth = 3;
        ctx.strokeRect(lx, ly, lw, lh);

        var eps = (!grabbed && g.straddling) ? p.B * p.b * v : 0;
        var i = eps / p.R;
        if (g.straddling && Math.abs(i) > 1e-4) {
          ctx.strokeStyle = col.teal; ctx.lineWidth = 2; ctx.setLineDash([6, 6]);
          ctx.lineDashOffset = -(t * 60);
          ctx.strokeRect(lx + 3, ly + 3, lw - 6, lh - 6); ctx.setLineDash([]);
          var mx = lx + lw / 2, my = ly + lh / 2;
          drawArrow(ctx, lx + 6, ly + 6, lx + lw - 6, ly + 6, col.teal, 1.6, 6);
          drawArrow(ctx, lx + lw - 6, ly + 6, lx + lw - 6, ly + lh - 6, col.teal, 1.6, 6);
          drawArrow(ctx, lx + lw - 6, ly + lh - 6, lx + 6, ly + lh - 6, col.teal, 1.6, 6);
          drawArrow(ctx, lx + 6, ly + lh - 6, lx + 6, ly + 6, col.teal, 1.6, 6);
          ctx.fillStyle = col.teal; ctx.fillText("i (horaria)", mx - 26, my);
        }
        if (!grabbed) {
          env.arrow(ctx, W * 0.5, ly + lh, W * 0.5, ly + lh + clamp(v * 14, 6, 60), col.amber, 2);
          ctx.fillStyle = col.amber; ctx.fillText("v", W * 0.5 + 6, ly + lh + 20);
        }

        var est;
        if (grabbed) est = "sostenida";
        else if (!g.straddling) est = "caída libre";
        else if (vt > 0 && Math.abs(v - vt) / vt < 0.05) est = "≈ terminal";
        else est = "frenando";
        ctx.fillStyle = col.amber; ctx.font = "12px ui-monospace, Menlo, monospace";
        ctx.fillText("estado: " + est, 10, 36);
        env.setReadout("i", Math.abs(i));
        env.setReadout("v", v);
        env.setReadout("vt", vt);
      }

      return { reset: reset, step: step, draw: draw };
    },
  });

  /* ============================================================
     SIM 5 — RLC serie: fasores + resonancia
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    id: "rlc",
    title: "RLC serie — fasores y resonancia",
    refs: "Resumen CA · Práctica g.7 (7.4–7.7)",
    blurb: "Circuito RLC en serie con fuente CA. Mirá rotar los fasores V_R, V_L, V_C y V. " +
      "Arrastrá el punto operativo sobre la curva I(f) para barrer la frecuencia y cruzar la resonancia.",
    formula: "Z = √(R²+(X_L−X_C)²)   ·   φ = atan((X_L−X_C)/R)   ·   f₀ = 1/(2π√(LC))",
    stageHeight: 360,
    controls: [
      { type: "range", key: "R", label: "R", min: 1, max: 100, step: 1, value: 20, unit: "Ω", digits: 0 },
      { type: "range", key: "L", label: "L", min: 1, max: 100, step: 1, value: 10, unit: "mH", digits: 0 },
      { type: "range", key: "C", label: "C", min: 0.5, max: 20, step: 0.5, value: 10, unit: "µF", digits: 1 },
    ],
    readouts: [
      { key: "f", label: "frecuencia f", unit: "Hz", digits: 0 },
      { key: "Z", label: "|Z|", unit: "Ω", digits: 1 },
      { key: "phi", label: "fase φ", unit: "°", digits: 1 },
      { key: "f0", label: "f₀ resonancia", unit: "Hz", digits: 0 },
    ],
    plot: {
      height: 150, window: 3, yMin: -1.25, yMax: 1.25,
      xLabel: "t", yLabel: "norm.",
      series: [{ key: "v", label: "v/V₀", color: PAL.coral }, { key: "i", label: "i/I₀", color: PAL.teal }],
    },
    create: function (env) {
      var VMAX = 10, WVIS = TAU * 0.3, theta = 0, tt = 0;
      var freq = 300;
      var pstate = { px0: 0, px1: 1, py0: 0, py1: 1, fmin: 10, fmax: 1000, imax: 1 };

      function vals() {
        var p = env.params;
        var L = p.L * 1e-3, C = p.C * 1e-6, w = TAU * freq;
        var XL = w * L, XC = 1 / (w * C);
        var X = XL - XC;
        var Z = Math.sqrt(p.R * p.R + X * X);
        var phi = Math.atan2(X, p.R);
        var Imax = VMAX / Z;
        var f0 = 1 / (TAU * Math.sqrt(L * C));
        return { L: L, C: C, XL: XL, XC: XC, X: X, Z: Z, phi: phi, Imax: Imax, f0: f0,
          VR: Imax * p.R, VL: Imax * XL, VC: Imax * XC };
      }
      function Iof(f) {
        var p = env.params, L = p.L * 1e-3, C = p.C * 1e-6, w = TAU * f;
        var Z = Math.sqrt(p.R * p.R + (w * L - 1 / (w * C)) * (w * L - 1 / (w * C)));
        return VMAX / Z;
      }

      function reset() { theta = 0; tt = 0; env.plot.clear(); }
      function step(dt) {
        theta += WVIS * dt; tt += dt;
        var s = vals();
        env.plot.push(tt, { v: Math.cos(theta), i: Math.cos(theta - s.phi) });
      }

      // handle: punto operativo sobre I(f) — mapea x → frecuencia
      env.addHandle({
        r: 14,
        x: function () {
          return pstate.px0 + (freq - pstate.fmin) / ((pstate.fmax - pstate.fmin) || 1) * (pstate.px1 - pstate.px0);
        },
        y: function () {
          var iv = Iof(freq);
          return pstate.py1 - iv / pstate.imax * (pstate.py1 - pstate.py0);
        },
        onDrag: function (px, py) {
          var f = pstate.fmin + (px - pstate.px0) / ((pstate.px1 - pstate.px0) || 1) * (pstate.fmax - pstate.fmin);
          freq = clamp(f, pstate.fmin, pstate.fmax);
        },
      });

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params, s = vals();
        var leftW = W * 0.46;

        // ===== fasores (izquierda) =====
        var cx = leftW * 0.5, cy = H * 0.5;
        var rad = Math.min(leftW * 0.5, H * 0.5) * 0.82;
        var Lmax = Math.max(s.VR, s.VL, s.VC, VMAX) || 1;
        var k = rad / Lmax;
        ctx.strokeStyle = col.grid; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, rad, 0, TAU); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - rad, cy); ctx.lineTo(cx + rad, cy);
        ctx.moveTo(cx, cy - rad); ctx.lineTo(cx, cy + rad); ctx.stroke();

        function ph(ang, len, color, w, label, lx, ly) {
          var ex = cx + Math.cos(ang) * len * k, ey = cy - Math.sin(ang) * len * k;
          env.arrow(ctx, cx, cy, ex, ey, color, w);
          if (label) { ctx.fillStyle = color; ctx.font = "11px ui-monospace, Menlo, monospace";
            ctx.fillText(label, ex + (lx || 4), ey + (ly || 0)); }
          return { x: ex, y: ey };
        }
        var iang = theta;
        ph(iang, s.VR, col.coral, 2.4, "V_R", 4, -2);
        ph(iang + Math.PI / 2, s.VL, col.blue, 2, "V_L", 4, 0);
        ph(iang - Math.PI / 2, s.VC, col.amber, 2, "V_C", 4, 8);
        var vtot = ph(iang + s.phi, VMAX, col.text, 2.8, "V", 6, -2);
        ctx.setLineDash([3, 3]);
        drawArrow(ctx, cx, cy, cx + Math.cos(iang) * rad, cy - Math.sin(iang) * rad, col.teal, 1.4, 6);
        ctx.setLineDash([]);
        ctx.fillStyle = col.teal; ctx.fillText("I", cx + Math.cos(iang) * rad + 4, cy - Math.sin(iang) * rad);
        var rx = cx + Math.cos(iang) * s.VR * k, ry = cy - Math.sin(iang) * s.VR * k;
        ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.setLineDash([2, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(vtot.x, vtot.y); ctx.stroke(); ctx.setLineDash([]);

        // ===== curva I(f) (derecha) =====
        var px0 = leftW + 44, px1 = W - 14, py0 = 22, py1 = H - 30;
        var fmin = 10, fmax = clamp(2.6 * s.f0, 240, 3000);
        freq = clamp(freq, fmin, fmax);
        var N = 140, imax = 1e-9, samp = [];
        for (var q = 0; q <= N; q++) {
          var f = fmin + (fmax - fmin) * q / N, iv = Iof(f);
          samp.push(iv); if (iv > imax) imax = iv;
        }
        imax *= 1.1;
        pstate.px0 = px0; pstate.px1 = px1; pstate.py0 = py0; pstate.py1 = py1;
        pstate.fmin = fmin; pstate.fmax = fmax; pstate.imax = imax;
        function FX(f) { return px0 + (f - fmin) / (fmax - fmin) * (px1 - px0); }
        function IY(iv) { return py1 - iv / imax * (py1 - py0); }
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px0, py0); ctx.lineTo(px0, py1); ctx.lineTo(px1, py1); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText("I (A)", px0 - 2, py0 - 6);
        ctx.fillText("f (Hz)", px1 - 34, py1 + 16);
        ctx.fillText(imax.toFixed(2), px0 - 38, py0 + 6);
        if (s.f0 >= fmin && s.f0 <= fmax) {
          ctx.strokeStyle = "rgba(146,207,242,0.55)"; ctx.setLineDash([4, 3]);
          ctx.beginPath(); ctx.moveTo(FX(s.f0), py0); ctx.lineTo(FX(s.f0), py1); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = col.blue; ctx.fillText("f₀", FX(s.f0) + 3, py0 + 10);
        }
        ctx.strokeStyle = col.teal; ctx.lineWidth = 2; ctx.beginPath();
        for (var c2 = 0; c2 <= N; c2++) {
          var xx = FX(fmin + (fmax - fmin) * c2 / N), yy = IY(samp[c2]);
          if (c2 === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
        var opx = FX(freq), opy = IY(s.Imax);
        ctx.strokeStyle = "rgba(244,124,89,0.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(opx, py1); ctx.lineTo(opx, opy); ctx.stroke();
        dot(ctx, opx, opy, 4.5, col.coral);

        var est;
        if (Math.abs(freq - s.f0) / s.f0 < 0.02) est = "resonancia";
        else if (s.X > 0) est = "inductivo (X_L > X_C)";
        else est = "capacitivo (X_C > X_L)";
        ctx.fillStyle = est === "resonancia" ? col.blue : col.dim;
        ctx.font = "12px ui-monospace, Menlo, monospace";
        ctx.fillText(est, 8, 16);
        env.setReadout("f", freq);
        env.setReadout("Z", s.Z);
        env.setReadout("phi", s.phi * 180 / Math.PI);
        env.setReadout("f0", s.f0);
      }

      return { reset: reset, step: step, draw: draw };
    },
  });

  /* ============================================================
     SIM 6 — Trabajo y potencial (dipolo + carga de prueba)
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
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

  /* ============================================================
     SIM 7 — Capacitor con dieléctrico (slab arrastrable)
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    id: "dielectrico",
    title: "Capacitor con dieléctrico",
    refs: "Resumen p.18–20 · Práctica g.3 (3.7)",
    blurb: "Arrastrá el slab de dieléctrico hacia adentro/afuera de las placas. Con batería, V queda " +
      "fija y sube la carga Q; aislado, Q queda fija y bajan V y E. El slab actúa como dos capacitores " +
      "en paralelo.",
    formula: "C = ε₀A/d·[(1−f)+κf]   ·   con batería: V cte, Q=CV   ·   aislado: Q cte, V=Q/C   ·   E=V/d",
    stageHeight: 340,
    controls: [
      { type: "segment", key: "modo", label: "Conexión", value: "bat", options: [["bat", "Con batería"], ["ais", "Aislado"]] },
      { type: "range", key: "V", label: "batería V", min: 1, max: 20, step: 0.5, value: 10, unit: "V", digits: 1 },
      { type: "range", key: "area", label: "área A", min: 5, max: 50, step: 1, value: 25, unit: "cm²", digits: 0 },
      { type: "range", key: "d", label: "separación d", min: 1, max: 8, step: 0.5, value: 4, unit: "mm", digits: 1 },
      { type: "range", key: "k", label: "constante κ", min: 1, max: 10, step: 0.5, value: 4, digits: 1 },
    ],
    readouts: [
      { key: "C", label: "capacidad C", unit: "pF", digits: 1 },
      { key: "Q", label: "carga Q", unit: "nC", digits: 3 },
      { key: "Vc", label: "tensión V", unit: "V", digits: 2 },
      { key: "E", label: "campo E", unit: "kV/m", digits: 1 },
    ],
    create: function (env) {
      var EPS0 = 8.854e-12;
      var insPx = 0;
      var plates = { x0: 0, Lp: 1, yTop: 0, yBot: 0, yMid: 0 };
      var Qstored = null, prevMode = "bat";

      function physics() {
        var p = env.params;
        var A = p.area * 1e-4, d = p.d * 1e-3, kappa = p.k;
        var f = plates.Lp > 0 ? clamp(insPx / plates.Lp, 0, 1) : 0;
        var C0 = EPS0 * A / d;
        var C = C0 * ((1 - f) + kappa * f);
        var V, Q;
        if (p.modo === "bat") { V = p.V; Q = C * V; Qstored = Q; }
        else { if (Qstored === null) Qstored = C * p.V; Q = Qstored; V = Q / C; }
        var E = V / d;
        return { C: C, Q: Q, V: V, E: E, f: f, d: d };
      }

      function reset() { insPx = 0; Qstored = null; prevMode = env.params.modo; }

      env.addHandle({
        r: 18,
        x: function () { return plates.x0 + insPx; },
        y: function () { return plates.yMid; },
        onDrag: function (px) { insPx = clamp(px - plates.x0, 0, plates.Lp); },
      });

      function onControl(key, val) {
        if (key === "modo") {
          if (val === "ais" && prevMode === "bat") {
            var ph = physics(); Qstored = ph.Q;    // congelar carga al desconectar
          } else if (val === "bat") { Qstored = null; }
          prevMode = val;
        }
      }

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params;
        var Lp = W * 0.52, x0 = W * 0.30, yMid = H * 0.5;
        var gapPx = 26 + p.d * 9;
        plates.x0 = x0; plates.Lp = Lp; plates.yTop = yMid - gapPx / 2; plates.yBot = yMid + gapPx / 2; plates.yMid = yMid;
        insPx = clamp(insPx, 0, Lp);
        var yTop = plates.yTop, yBot = plates.yBot, x1 = x0 + Lp;
        var ph = physics();

        // batería / llave abierta a la izquierda
        var wx = x0 - 42;
        ctx.strokeStyle = col.dim; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x0, yTop); ctx.lineTo(wx, yTop);
        ctx.moveTo(x0, yBot); ctx.lineTo(wx, yBot); ctx.stroke();
        if (p.modo === "bat") {
          ctx.strokeStyle = col.coral; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(wx, yMid - 12); ctx.lineTo(wx, yMid + 12); ctx.stroke();
          ctx.strokeStyle = col.blue; ctx.lineWidth = 6;
          ctx.beginPath(); ctx.moveTo(wx - 7, yMid - 6); ctx.lineTo(wx - 7, yMid + 6); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(wx, yTop); ctx.lineTo(wx, yMid - 12);
          ctx.moveTo(wx - 7, yMid + 6); ctx.lineTo(wx - 7, yBot);
          ctx.moveTo(wx, yMid + 12); ctx.lineTo(wx - 7, yMid + 6); ctx.strokeStyle = col.dim; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
          ctx.fillText(p.V.toFixed(1) + " V", wx - 34, yMid + 3);
        } else {
          ctx.strokeStyle = col.dim; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(wx, yTop); ctx.lineTo(wx, yMid - 10); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(wx, yMid + 12); ctx.lineTo(wx, yBot); ctx.stroke();
          ctx.strokeStyle = col.amber; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(wx, yMid - 10); ctx.lineTo(wx + 8, yMid + 8); ctx.stroke();
          dot(ctx, wx, yMid - 10, 2.5, col.amber); dot(ctx, wx, yMid + 12, 2.5, col.amber);
          ctx.fillStyle = col.amber; ctx.font = "10px ui-monospace, Menlo, monospace";
          ctx.fillText("aislado", wx - 30, yMid + 30);
        }

        // dieléctrico insertado
        if (insPx > 1) {
          ctx.fillStyle = "rgba(146,207,242,0.16)";
          ctx.fillRect(x0, yTop + 2, insPx, (yBot - yTop) - 4);
          ctx.strokeStyle = col.blue; ctx.lineWidth = 1.4;
          ctx.strokeRect(x0, yTop + 2, insPx, (yBot - yTop) - 4);
          ctx.fillStyle = col.blue; ctx.font = "11px ui-monospace, Menlo, monospace";
          ctx.fillText("κ = " + p.k.toFixed(1), x0 + 8, yMid + 4);
          // cargas ligadas en las caras del dieléctrico
          ctx.fillStyle = "rgba(146,207,242,0.9)"; ctx.font = "10px ui-monospace, Menlo, monospace";
          for (var bx = x0 + 10; bx < x0 + insPx - 4; bx += 18) {
            ctx.fillText("−", bx, yTop + 12); ctx.fillText("+", bx, yBot - 4);
          }
        }

        // campo E entre placas (flechas hacia abajo)
        var eAlpha = clamp(ph.E / 6000, 0.15, 1);
        ctx.globalAlpha = eAlpha;
        for (var fx = x0 + 14; fx < x1 - 6; fx += 26) {
          drawArrow(ctx, fx, yTop + 4, fx, yBot - 4, "rgba(216,178,121,0.9)", 1.3, 5);
        }
        ctx.globalAlpha = 1;

        // placas
        ctx.strokeStyle = col.coral; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(x0, yTop); ctx.lineTo(x1, yTop); ctx.stroke();
        ctx.strokeStyle = col.blue; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(x0, yBot); ctx.lineTo(x1, yBot); ctx.stroke();
        ctx.fillStyle = col.coral; ctx.font = "12px ui-monospace, Menlo, monospace";
        ctx.fillText("+", x1 + 6, yTop + 4);
        ctx.fillStyle = col.blue; ctx.fillText("−", x1 + 6, yBot + 4);
        ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText("A = " + p.area + " cm²   d = " + p.d.toFixed(1) + " mm", x0, yBot + 24);
        ctx.fillText("f = " + (ph.f * 100).toFixed(0) + "% insertado", x0, yBot + 38);

        env.setReadout("C", ph.C * 1e12);
        env.setReadout("Q", ph.Q * 1e9);
        env.setReadout("Vc", ph.V);
        env.setReadout("E", ph.E / 1000);
      }

      return { reset: reset, draw: draw, onControl: onControl };
    },
  });

  /* ============================================================
     SIM 8 — Biot-Savart y Ampère (sonda de campo)
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    id: "biot",
    title: "Biot-Savart y Ampère — sonda de B",
    refs: "Resumen p.22 · Práctica g.5",
    blurb: "Elegí hilo ∞, espira (en corte) o solenoide y arrastrá la sonda: muestra el vector B y |B| " +
      "en su posición. El campo de fondo revela la forma; para el hilo, los círculos concéntricos de Ampère.",
    formula: "hilo: B=μ₀I/2πr   ·   espira ≈ dos hilos opuestos (dipolo)   ·   solenoide: B=μ₀nI",
    stageHeight: 360,
    controls: [
      { type: "segment", key: "geo", label: "Fuente", value: "hilo", options: [["hilo", "Hilo ∞"], ["espira", "Espira (corte)"], ["sol", "Solenoide"]] },
      { type: "range", key: "I", label: "corriente I", min: 1, max: 12, step: 0.5, value: 5, unit: "A", digits: 1 },
      { type: "range", key: "a", label: "radio / semisep a", min: 2, max: 8, step: 0.5, value: 5, unit: "cm", digits: 1 },
      { type: "range", key: "n", label: "vueltas (solenoide)", min: 2, max: 12, step: 1, value: 6, unit: "/cm", digits: 0 },
    ],
    readouts: [
      { key: "B", label: "|B| (sonda)", unit: "µT", digits: 1 },
      { key: "r", label: "r a la fuente", unit: "cm", digits: 1 },
    ],
    create: function (env) {
      var PPM = 0.001; // m por px (1 px = 1 mm)
      var probe = { x: 0, y: 0 };
      var needInit = true;

      function ctr() { return { x: (env.W || 600) * 0.5, y: (env.H || 360) * 0.5 }; }
      function aPx() { return clamp(env.params.a, 2, 8) * 10; }
      function solHalf() { return clamp(env.params.a, 2, 10) * 9; }
      function solLen() { return (env.W || 600) * 0.44; }

      function wireB(px, py, wx, wy, I, sense) {
        // sense: +1 = corriente saliente (⊙, B antihorario), -1 = entrante (⊗, B horario)
        var dx = px - wx, dy = py - wy, r = Math.hypot(dx, dy), r_m = Math.max(r * PPM, 0.003);
        var Bm = MU0 * I / (TAU * r_m);
        var ux = -dy / (r || 1), uy = dx / (r || 1); // antihorario
        return { bx: sense * Bm * ux, by: sense * Bm * uy };
      }

      function Bfield(px, py) {
        var p = env.params, c = ctr(), bx = 0, by = 0, region = "";
        if (p.geo === "hilo") {
          var w = wireB(px, py, c.x, c.y, p.I, +1); bx = w.bx; by = w.by;
        } else if (p.geo === "espira") {
          var a = aPx();
          var wl = wireB(px, py, c.x - a, c.y, p.I, +1); // izq: sale
          var wr = wireB(px, py, c.x + a, c.y, p.I, -1); // der: entra
          bx = wl.bx + wr.bx; by = wl.by + wr.by;
        } else {
          var hh = solHalf(), L = solLen();
          var inside = (px > c.x - L / 2 && px < c.x + L / 2 && py > c.y - hh && py < c.y + hh);
          if (inside) { var nm = p.n * 100; bx = MU0 * nm * p.I; by = 0; region = "dentro"; }
          else { bx = 0; by = 0; region = "fuera"; }
        }
        return { bx: bx, by: by, mag: Math.hypot(bx, by), region: region };
      }

      function reset() { needInit = true; }
      function initProbe() {
        var c = ctr(); probe.x = c.x + 80; probe.y = c.y - 46; needInit = false;
      }

      env.addHandle({
        r: 16,
        x: function () { return probe.x; },
        y: function () { return probe.y; },
        onDrag: function (px, py) {
          probe.x = clamp(px, 6, (env.W || 600) - 6);
          probe.y = clamp(py, 6, (env.H || 360) - 6);
        },
      });

      function drawSym(ctx, x, y, out, col) {
        ctx.strokeStyle = col; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.stroke();
        if (out) { dot(ctx, x, y, 2.2, col); }
        else {
          ctx.beginPath();
          ctx.moveTo(x - 4.5, y - 4.5); ctx.lineTo(x + 4.5, y + 4.5);
          ctx.moveTo(x + 4.5, y - 4.5); ctx.lineTo(x - 4.5, y + 4.5); ctx.stroke();
        }
      }

      function draw(ctx, W, H) {
        if (needInit && W > 0) initProbe();
        var col = env.colors, p = env.params, c = ctr();

        // campo de fondo (vectores tenues)
        for (var gx = 26; gx < W; gx += 40) {
          for (var gy = 22; gy < H; gy += 40) {
            var f = Bfield(gx, gy), m = f.mag;
            if (m < 1e-9) continue;
            var len = clamp(6 + Math.log10(1 + m / 1e-7) * 5, 4, 20);
            drawArrow(ctx, gx, gy, gx + f.bx / m * len, gy + f.by / m * len, "rgba(146,207,242,0.28)", 1, 4);
          }
        }

        // fuente
        if (p.geo === "hilo") {
          ctx.strokeStyle = "rgba(255,255,255,0.16)"; ctx.lineWidth = 1;
          for (var rr = 30; rr < Math.max(W, H); rr += 34) {
            ctx.beginPath(); ctx.arc(c.x, c.y, rr, 0, TAU); ctx.stroke();
          }
          drawSym(ctx, c.x, c.y, true, col.coral);
          ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
          ctx.fillText("I ⊙ (sale)", c.x + 12, c.y - 12);
        } else if (p.geo === "espira") {
          var a = aPx();
          drawSym(ctx, c.x - a, c.y, true, col.coral);
          drawSym(ctx, c.x + a, c.y, false, col.blue);
          ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
          ctx.fillText("espira en corte: ⊙ | ⊗", c.x - a - 6, c.y - 16);
        } else {
          var hh = solHalf(), L = solLen();
          ctx.strokeStyle = col.dim; ctx.lineWidth = 1.2;
          ctx.strokeRect(c.x - L / 2, c.y - hh, L, hh * 2);
          for (var sxx = c.x - L / 2 + 10; sxx < c.x + L / 2 - 4; sxx += 22) {
            drawSym(ctx, sxx, c.y - hh, true, col.coral);
            drawSym(ctx, sxx, c.y + hh, false, col.blue);
          }
          // líneas de campo internas
          ctx.strokeStyle = "rgba(216,178,121,0.35)"; ctx.lineWidth = 1;
          for (var ly = c.y - hh + 8; ly < c.y + hh; ly += 12) {
            drawArrow(ctx, c.x - L / 2 + 8, ly, c.x + L / 2 - 8, ly, "rgba(216,178,121,0.4)", 1, 5);
          }
          ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
          ctx.fillText("solenoide en corte (B uniforme dentro)", c.x - L / 2, c.y - hh - 8);
        }

        // sonda + vector B
        var fb = Bfield(probe.x, probe.y), m2 = fb.mag || 1;
        var vlen = clamp(10 + Math.log10(1 + m2 / 1e-7) * 9, 10, 60);
        env.arrow(ctx, probe.x, probe.y, probe.x + fb.bx / m2 * vlen, probe.y + fb.by / m2 * vlen, col.coral, 2.4);
        dot(ctx, probe.x, probe.y, 3, col.text);
        ctx.fillStyle = col.coral; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText("B", probe.x + fb.bx / m2 * (vlen + 8), probe.y + fb.by / m2 * (vlen + 8));
        if (p.geo === "sol") {
          ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
          ctx.fillText(fb.region, probe.x + 10, probe.y + 14);
        }

        env.setReadout("B", fb.mag * 1e6);
        if (p.geo === "sol") {
          env.setReadout("r", null);
        } else if (p.geo === "espira") {
          var a2 = aPx();
          var r1 = Math.hypot(probe.x - (c.x - a2), probe.y - c.y);
          var r2 = Math.hypot(probe.x - (c.x + a2), probe.y - c.y);
          env.setReadout("r", Math.min(r1, r2) * PPM * 100);
        } else {
          env.setReadout("r", Math.hypot(probe.x - c.x, probe.y - c.y) * PPM * 100);
        }
      }

      return { reset: reset, draw: draw };
    },
  });

  /* ============================================================
     SIM 9 — Circuito DC de 2 mallas (Kirchhoff)
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    id: "kirchhoff",
    title: "Circuito DC — Kirchhoff (2 mallas)",
    refs: "Resumen p.16–17 · Práctica g.2 (2.14, 2.16)",
    blurb: "El caso típico de la práctica: 2 fem y 3 resistencias en dos mallas. Movē los sliders y las " +
      "corrientes se resuelven en vivo (flechas proporcionales, coloreadas por sentido). Arrastrá el " +
      "multímetro sobre una rama para medir su i y su caída de tensión.",
    formula: "Nodo: i₁+i₂=i₃   ·   ε₁=i₁R₁+i₃R₃   ·   ε₂=i₂R₂+i₃R₃",
    stageHeight: 340,
    controls: [
      { type: "range", key: "e1", label: "ε₁", min: 0, max: 24, step: 1, value: 12, unit: "V", digits: 0 },
      { type: "range", key: "e2", label: "ε₂", min: 0, max: 24, step: 1, value: 6, unit: "V", digits: 0 },
      { type: "range", key: "R1", label: "R₁", min: 1, max: 20, step: 1, value: 4, unit: "Ω", digits: 0 },
      { type: "range", key: "R2", label: "R₂", min: 1, max: 20, step: 1, value: 6, unit: "Ω", digits: 0 },
      { type: "range", key: "R3", label: "R₃", min: 1, max: 20, step: 1, value: 3, unit: "Ω", digits: 0 },
    ],
    readouts: [
      { key: "i1", label: "i₁", unit: "A", digits: 3 },
      { key: "i2", label: "i₂", unit: "A", digits: 3 },
      { key: "i3", label: "i₃ (R₃)", unit: "A", digits: 3 },
      { key: "ver", label: "máx |ΣV| malla", unit: "V", digits: 4 },
    ],
    create: function (env) {
      var probe = { x: 0, y: 0 };
      var needInit = true;
      var mids = { b1: { x: 0, y: 0 }, b2: { x: 0, y: 0 }, b3: { x: 0, y: 0 } };

      function solve() {
        var p = env.params;
        var R1 = p.R1, R2 = p.R2, R3 = p.R3;
        var det = (R1 + R3) * (R2 + R3) - R3 * R3;
        var i1 = (p.e1 * (R2 + R3) - p.e2 * R3) / det;
        var i2 = ((R1 + R3) * p.e2 - R3 * p.e1) / det;
        var i3 = i1 + i2;
        var res1 = p.e1 - i1 * R1 - i3 * R3;
        var res2 = p.e2 - i2 * R2 - i3 * R3;
        return { i1: i1, i2: i2, i3: i3, res: Math.max(Math.abs(res1), Math.abs(res2)) };
      }

      function reset() { needInit = true; }
      function initProbe() { probe.x = (env.W || 600) * 0.5; probe.y = (env.H || 340) * 0.5; needInit = false; }

      env.addHandle({
        r: 18,
        x: function () { return probe.x; },
        y: function () { return probe.y; },
        onDrag: function (px, py) {
          probe.x = clamp(px, 6, (env.W || 600) - 6);
          probe.y = clamp(py, 6, (env.H || 340) - 6);
        },
      });

      function resistor(ctx, x, y, horiz, label, col) {
        ctx.strokeStyle = col.amber; ctx.lineWidth = 2;
        var w = 34, h = 12;
        if (horiz) { ctx.strokeRect(x - w / 2, y - h / 2, w, h); }
        else { ctx.strokeRect(x - h / 2, y - w / 2, h, w); }
        ctx.fillStyle = col.amber; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText(label, x + (horiz ? -8 : 10), y + (horiz ? -10 : 4));
      }
      function battery(ctx, x, y, label, col) {
        ctx.strokeStyle = col.coral; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(x, y + 10); ctx.stroke();
        ctx.strokeStyle = col.blue; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(x - 8, y - 5); ctx.lineTo(x - 8, y + 5); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText(label, x + 6, y - 12);
      }

      function draw(ctx, W, H) {
        if (needInit && W > 0) initProbe();
        var col = env.colors, p = env.params, s = solve();
        var xl = W * 0.16, xm = W * 0.5, xr = W * 0.84, yt = H * 0.22, yb = H * 0.80, ym = (yt + yb) / 2;

        mids.b1.x = xl; mids.b1.y = ym;
        mids.b2.x = xr; mids.b2.y = ym;
        mids.b3.x = xm; mids.b3.y = ym;

        // rieles y ramas
        ctx.strokeStyle = col.dim; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xl, yt); ctx.lineTo(xr, yt);         // riel superior
        ctx.moveTo(xl, yb); ctx.lineTo(xr, yb);         // riel inferior
        ctx.moveTo(xl, yt); ctx.lineTo(xl, yb);         // rama 1 (izq)
        ctx.moveTo(xr, yt); ctx.lineTo(xr, yb);         // rama 2 (der)
        ctx.moveTo(xm, yt); ctx.lineTo(xm, yb);         // rama 3 (media)
        ctx.stroke();

        // nodos a (arriba) y b (abajo)
        dot(ctx, xm, yt, 4, col.text); dot(ctx, xm, yb, 4, col.text);
        ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText("a", xm + 6, yt - 4); ctx.fillText("b", xm + 6, yb + 14);

        // componentes
        battery(ctx, xl, ym - 26, "ε₁=" + p.e1 + "V", col);
        resistor(ctx, xl, ym + 26, false, "R₁", col);
        battery(ctx, xr, ym - 26, "ε₂=" + p.e2 + "V", col);
        resistor(ctx, xr, ym + 26, false, "R₂", col);
        resistor(ctx, xm, ym, false, "R₃", col);

        // flechas de corriente (thickness ∝ |i|, color por signo)
        function branchArrow(x, i, refUp) {
          var mag = clamp(Math.abs(i) * 3, 1.4, 7);
          var forward = (i >= 0) === refUp;
          var y0 = forward ? yb - 20 : yt + 20;
          var y1 = forward ? yt + 20 : yb - 20;
          var color = i >= 0 ? col.teal : col.red;
          drawArrow(ctx, x, y0, x, y1, color, mag, 8);
        }
        branchArrow(xl, s.i1, true);
        branchArrow(xr, s.i2, true);
        branchArrow(xm, s.i3, false);

        // multímetro: rama más cercana
        var branches = [
          { m: mids.b1, i: s.i1, R: p.R1, name: "R₁" },
          { m: mids.b2, i: s.i2, R: p.R2, name: "R₂" },
          { m: mids.b3, i: s.i3, R: p.R3, name: "R₃" },
        ];
        var best = branches[0], bd = 1e9;
        for (var bi = 0; bi < branches.length; bi++) {
          var dd = Math.hypot(probe.x - branches[bi].m.x, probe.y - branches[bi].m.y);
          if (dd < bd) { bd = dd; best = branches[bi]; }
        }
        // resaltar rama medida
        ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(best.m.x, best.m.y, 20, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
        // etiqueta de medición cerca de la sonda
        ctx.fillStyle = col.text; ctx.font = "bold 11px ui-monospace, Menlo, monospace";
        ctx.fillText(best.name + ": i=" + best.i.toFixed(3) + " A", probe.x + 14, probe.y - 6);
        ctx.fillStyle = col.dim;
        ctx.fillText("ΔV=" + (best.i * best.R).toFixed(2) + " V", probe.x + 14, probe.y + 10);

        // verificación de Kirchhoff (ΣV=0 por malla) en el lienzo
        ctx.fillStyle = s.res < 1e-6 ? col.teal : col.red;
        ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText(s.res < 1e-6 ? "ΣV = 0 en ambas mallas ✓" : "ΣV ≠ 0 (revisar)", xl, yb + 26);

        env.setReadout("i1", s.i1);
        env.setReadout("i2", s.i2);
        env.setReadout("i3", s.i3);
        env.setReadout("ver", Math.abs(s.res) < 1e-9 ? 0 : s.res);
      }

      return { reset: reset, draw: draw };
    },
  });

  /* ============================================================
     SIM 10 — Torque sobre espira / motor DC
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    id: "motor",
    title: "Torque sobre espira — motor DC",
    refs: "Resumen p.22 · Práctica g.4",
    blurb: "Vista superior de una espira en B uniforme. τ=μ×B la hace girar. Arrastrá la espira para " +
      "girarla a mano y soltala: sin conmutador oscila como péndulo de torsión; con conmutador la " +
      "corriente se invierte cada media vuelta y el giro es continuo.",
    formula: "μ=I·A   ·   τ=μ×B=μB·sinθ   ·   U=−μ·B   (θ = ángulo μ–B)",
    stageHeight: 360,
    controls: [
      { type: "range", key: "I", label: "corriente I", min: 0.2, max: 5, step: 0.1, value: 2, unit: "A", digits: 1 },
      { type: "range", key: "B", label: "campo B", min: 0.05, max: 0.5, step: 0.01, value: 0.2, unit: "T", digits: 2 },
      { type: "toggle", key: "conm", label: "Conmutador (motor)", value: true },
    ],
    readouts: [
      { key: "mu", label: "μ = I·A", unit: "mA·m²", digits: 1 },
      { key: "tau", label: "τ = μB·sinθ", unit: "mN·m", digits: 2 },
      { key: "w", label: "ω", unit: "rad/s", digits: 2 },
      { key: "th", label: "θ (μ–B)", unit: "°", digits: 0 },
    ],
    plot: {
      height: 140, window: 6, autoY: true,
      xLabel: "t (s)", yLabel: "ω (rad/s)",
      series: [{ key: "w", label: "ω", color: PAL.teal }],
    },
    create: function (env) {
      var AREA = 0.01, Jm = 0.02, DAMP = 0.9, KT = 6;
      var alpha = 0.6, omega = 0, tt = 0, dragging = false;

      function reset() { alpha = 0.6; omega = 0; tt = 0; dragging = false; env.plot.clear(); }

      function ctr() { return { x: (env.W || 600) * 0.5, y: (env.H || 360) * 0.5 }; }
      function halfW() { return Math.min((env.W || 600), (env.H || 360)) * 0.26; }
      // extremo de la espira (línea perpendicular a μ): ángulo alpha+π/2
      function endX() { return ctr().x + Math.cos(alpha + Math.PI / 2) * halfW(); }
      function endY() { return ctr().y + Math.sin(alpha + Math.PI / 2) * halfW(); }

      env.addHandle({
        r: 18,
        x: endX, y: endY,
        onStart: function () { dragging = true; omega = 0; },
        onDrag: function (px, py) {
          var c = ctr();
          alpha = Math.atan2(py - c.y, px - c.x) - Math.PI / 2;
          omega = 0;
        },
        onEnd: function () { dragging = false; },
      });

      function step(dt) {
        var p = env.params;
        var mu = p.I * AREA;
        var drive = KT * mu * p.B;
        if (!dragging) {
          var shape = p.conm ? Math.abs(Math.sin(alpha)) : -Math.sin(alpha);
          var tau = drive * shape;
          omega += (tau - DAMP * omega) / Jm * dt;
          alpha += omega * dt;
          if (alpha > Math.PI) alpha -= TAU; else if (alpha < -Math.PI) alpha += TAU;
        }
        tt += dt;
        env.plot.push(tt, { w: omega });
      }

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params, c = ctr(), hw = halfW();

        // campo B de fondo (→)
        ctx.strokeStyle = "rgba(146,207,242,0.28)";
        for (var gy = 30; gy < H; gy += 42) drawArrow(ctx, 14, gy, 54, gy, "rgba(146,207,242,0.35)", 1.3, 6);
        ctx.fillStyle = col.blue; ctx.font = "12px ui-monospace, Menlo, monospace";
        ctx.fillText("B →", 16, 20);

        // espira vista de arriba (línea) — extremos e1 (⊙) y e2 (⊗)
        var dxl = Math.cos(alpha + Math.PI / 2), dyl = Math.sin(alpha + Math.PI / 2);
        var e1x = c.x + dxl * hw, e1y = c.y + dyl * hw;
        var e2x = c.x - dxl * hw, e2y = c.y - dyl * hw;
        ctx.strokeStyle = col.text; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(e1x, e1y); ctx.lineTo(e2x, e2y); ctx.stroke();

        // sentido de corriente (puede invertir con el conmutador según sin θ)
        var iSign = 1;
        if (p.conm && Math.sin(alpha) < 0) iSign = -1;
        drawSymbol(ctx, e1x, e1y, iSign > 0, col.coral);
        drawSymbol(ctx, e2x, e2y, iSign < 0, col.blue);

        // fuerzas sobre cada lado: F = I L × B (couple)
        var fdir = iSign; // signo del par
        var fl = 26;
        env.arrow(ctx, e1x, e1y, e1x, e1y - fdir * fl, col.coral, 2);
        env.arrow(ctx, e2x, e2y, e2x, e2y + fdir * fl, col.coral, 2);

        // vector μ (perpendicular a la espira, ángulo alpha)
        var mux = c.x + Math.cos(alpha) * hw * 0.8, muy = c.y + Math.sin(alpha) * hw * 0.8;
        env.arrow(ctx, c.x, c.y, mux, muy, col.amber, 2.4);
        ctx.fillStyle = col.amber; ctx.font = "12px ui-monospace, Menlo, monospace";
        ctx.fillText("μ", mux + 6, muy);

        // arco de sentido de giro
        if (Math.abs(omega) > 0.05) {
          ctx.strokeStyle = col.teal; ctx.lineWidth = 2;
          var a0 = -0.6, a1 = 0.6, dir = omega > 0 ? 1 : -1;
          ctx.beginPath(); ctx.arc(c.x, c.y, hw * 0.42, a0, a1, dir < 0); ctx.stroke();
          var tipA = dir > 0 ? a1 : a0;
          var tx = c.x + Math.cos(tipA) * hw * 0.42, ty = c.y + Math.sin(tipA) * hw * 0.42;
          drawArrow(ctx, tx - dir * 3, ty - 6, tx, ty, col.teal, 2, 6);
        }

        dot(ctx, c.x, c.y, 3, col.dim);

        var mu = p.I * AREA;
        var theta = Math.acos(clamp(Math.cos(alpha), -1, 1)); // ángulo μ–B en [0,π]
        var tau = mu * p.B * Math.sin(theta);
        env.setReadout("mu", mu * 1000);
        env.setReadout("tau", tau * 1000);
        env.setReadout("w", omega);
        env.setReadout("th", theta * 180 / Math.PI);
      }

      function drawSymbol(ctx, x, y, out, cc) {
        ctx.fillStyle = "rgba(36,18,8,0.9)";
        ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fill();
        ctx.strokeStyle = cc; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.stroke();
        if (out) { dot(ctx, x, y, 2.4, cc); }
        else {
          ctx.beginPath();
          ctx.moveTo(x - 5, y - 5); ctx.lineTo(x + 5, y + 5);
          ctx.moveTo(x + 5, y - 5); ctx.lineTo(x - 5, y + 5); ctx.stroke();
        }
      }

      return { reset: reset, step: step, draw: draw };
    },
  });

  /* ============================================================
     SIM 11 — Relatividad especial (reloj de luz)
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    id: "relatividad",
    title: "Relatividad especial — reloj de luz",
    refs: "Resumen p.23 · Práctica g.8 (Prob. 5, 6)",
    blurb: "Dos relojes de luz idénticos: uno en reposo, otro moviéndose a v. Arrastrá el control de " +
      "velocidad (v/c) y mirá cómo el reloj móvil tarda más por tic (dilatación) y su nave se contrae " +
      "en la dirección del movimiento. La curva γ(β) marca el punto operativo.",
    formula: "γ = 1/√(1−β²)   ·   Δt = γ·Δt₀   ·   L = L₀/γ   ·   β = v/c",
    stageHeight: 360,
    controls: [
      { type: "range", key: "L0", label: "altura del reloj L₀", min: 0.4, max: 1, step: 0.05, value: 0.7, unit: "·H" },
    ],
    readouts: [
      { key: "beta", label: "β = v/c", digits: 3 },
      { key: "g", label: "γ (Lorentz)", digits: 3 },
      { key: "dt", label: "Δt / Δt₀", digits: 3 },
      { key: "lc", label: "L / L₀", digits: 3 },
    ],
    create: function (env) {
      var beta = 0.6, P0 = 1.4, t = 0;
      var trail = [];
      var track = { x0: 0, x1: 1, y: 0 };

      function gamma() { return 1 / Math.sqrt(1 - beta * beta); }
      function reset() { t = 0; trail = []; beta = clamp(beta, 0, 0.95); }
      function step(dt) { t += dt; }

      // handle: knob del velocímetro (v/c)
      env.addHandle({
        r: 15,
        x: function () { return track.x0 + beta / 0.95 * (track.x1 - track.x0); },
        y: function () { return track.y; },
        onDrag: function (px) {
          beta = clamp((px - track.x0) / ((track.x1 - track.x0) || 1) * 0.95, 0, 0.95);
        },
      });

      function tri(phase) { // onda triangular 0..1..0 en [0,1)
        var x = phase - Math.floor(phase);
        return x < 0.5 ? x * 2 : (1 - x) * 2;
      }

      function draw(ctx, W, H) {
        var col = env.colors, g = gamma();
        var midX = W * 0.5;

        // separador
        ctx.strokeStyle = col.grid; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(midX, 10); ctx.lineTo(midX, H * 0.72); ctx.stroke();

        // ===== panel izquierdo: reloj en reposo =====
        var Lp = env.params.L0 * H * 0.5;
        var cxL = W * 0.24, topL = H * 0.32 - Lp / 2, botL = H * 0.32 + Lp / 2;
        ctx.fillStyle = col.dim; ctx.font = "12px ui-monospace, Menlo, monospace";
        ctx.fillText("reloj en reposo", cxL - 52, 22);
        ctx.strokeStyle = col.blue; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(cxL - 26, topL); ctx.lineTo(cxL + 26, topL);
        ctx.moveTo(cxL - 26, botL); ctx.lineTo(cxL + 26, botL); ctx.stroke();
        var yphL = topL + (botL - topL) * (1 - tri(t / P0));
        drawArrow(ctx, cxL, topL, cxL, botL, "rgba(255,255,255,0.12)", 1, 0);
        dot(ctx, cxL, yphL, 5, col.amber);
        var n0 = Math.floor(t / P0);
        ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText("tics: " + n0, cxL - 22, botL + 24);
        ctx.fillText("T₀ = " + P0.toFixed(1) + " s", cxL - 30, botL + 40);

        // ===== panel derecho: reloj en movimiento =====
        var Pm = g * P0;
        var laneY = H * 0.32;
        var run = (W - midX) - 90;
        var clockX = midX + 40 + ((t * beta * 130) % (run || 1));
        var Lship0 = 70, Lship = Lship0 / g; // contracción de longitud (nave)
        var topM = laneY - Lp / 2, botM = laneY + Lp / 2;
        ctx.fillStyle = col.dim; ctx.font = "12px ui-monospace, Menlo, monospace";
        ctx.fillText("reloj en movimiento (v)", midX + 20, 22);

        // nave contraída
        ctx.strokeStyle = "rgba(216,178,121,0.7)"; ctx.lineWidth = 1.4;
        ctx.strokeRect(clockX - Lship / 2, topM - 10, Lship, (botM - topM) + 20);

        // espejos (móviles)
        ctx.strokeStyle = col.blue; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(clockX - 22, topM); ctx.lineTo(clockX + 22, topM);
        ctx.moveTo(clockX - 22, botM); ctx.lineTo(clockX + 22, botM); ctx.stroke();

        // fotón dentro (bota en vertical en el marco de la nave)
        var yphM = topM + (botM - topM) * (1 - tri(t / Pm));
        dot(ctx, clockX, yphM, 5, col.coral);

        // rastro absoluto (zig-zag diagonal en el lab)
        trail.push({ x: clockX, y: yphM });
        if (trail.length > 120) trail.shift();
        if (clockX < midX + 42) trail = [];
        ctx.strokeStyle = "rgba(244,124,89,0.5)"; ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (var i = 0; i < trail.length; i++) {
          if (i === 0) ctx.moveTo(trail[i].x, trail[i].y); else ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.stroke();

        var nM = Math.floor(t / Pm);
        ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText("tics: " + nM + "   (T = γT₀ = " + Pm.toFixed(1) + " s)", midX + 20, H * 0.32 + Lp / 2 + 40);

        // ===== velocímetro (handle) =====
        track.x0 = 40; track.x1 = W * 0.46; track.y = H * 0.86;
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(track.x0, track.y); ctx.lineTo(track.x1, track.y); ctx.stroke();
        ctx.strokeStyle = col.teal; ctx.lineWidth = 3;
        var knobX = track.x0 + beta / 0.95 * (track.x1 - track.x0);
        ctx.beginPath(); ctx.moveTo(track.x0, track.y); ctx.lineTo(knobX, track.y); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText("v/c = " + beta.toFixed(2) + "  (arrastrá)", track.x0, track.y - 12);

        // ===== curva γ(β) (abajo derecha) =====
        var gx0 = W * 0.56, gx1 = W - 20, gy0 = H * 0.62, gy1 = H * 0.94;
        var gmax = 4;
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0, gy1); ctx.lineTo(gx1, gy1); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText("γ", gx0 - 2, gy0 - 4); ctx.fillText("β", gx1 - 8, gy1 + 14);
        ctx.fillText(String(gmax), gx0 - 16, gy0 + 6); ctx.fillText("1", gx0 - 10, gy1 + 2);
        ctx.strokeStyle = col.teal; ctx.lineWidth = 2; ctx.beginPath();
        for (var k = 0; k <= 60; k++) {
          var b = k / 60 * 0.96;
          var gg = 1 / Math.sqrt(1 - b * b);
          var xx = gx0 + b / 0.96 * (gx1 - gx0);
          var yy = gy1 - clamp((gg - 1) / (gmax - 1), 0, 1) * (gy1 - gy0);
          if (k === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
        var opx = gx0 + beta / 0.96 * (gx1 - gx0);
        var opy = gy1 - clamp((g - 1) / (gmax - 1), 0, 1) * (gy1 - gy0);
        dot(ctx, opx, opy, 4, col.coral);

        env.setReadout("beta", beta);
        env.setReadout("g", g);
        env.setReadout("dt", g);
        env.setReadout("lc", 1 / g);
      }

      return { reset: reset, step: step, draw: draw };
    },
  });

})();
