/* ============================================================
   f3.js — Física 3 (Electromagnetismo). Registra la pestaña F3
   y 5 laboratorios interactivos en canvas 2D sobre SimKit.
   Script clásico, sin módulos, compatible file://.
   ============================================================ */
(function () {
  "use strict";

  var PAL = (window.SimKit && window.SimKit.colors) || {};
  var TAU = Math.PI * 2;

  /* ---------- helpers de dibujo ---------- */
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

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

  /* ============================================================
     TAB
     ============================================================ */
  SimKit.registerTab({
    id: "f3",
    intro: "Electromagnetismo en vivo: electrostática y superposición, ley de Gauss, " +
      "fuerza de Lorentz, inducción de Faraday y circuitos de corriente alterna. " +
      "Cada laboratorio refuerza un tema del resumen y las guías de la práctica.",
  });

  /* ============================================================
     SIM 1 — Sandbox de cargas (Coulomb + superposición)
     ============================================================ */
  var CASES = [
    [], [3, 0], [0, 1], [1, 3], [1, 2], [3, 0, 1, 2], [0, 2], [2, 3],
    [2, 3], [0, 2], [0, 1, 2, 3], [1, 2], [1, 3], [0, 1], [0, 3], []
  ];

  SimKit.registerSim({
    tab: "f3",
    id: "sandbox",
    title: "Sandbox de cargas",
    refs: "Resumen p.9 · Práctica g.1",
    blurb: "Arrastrá las cargas con el mouse. Empezá con un dipolo, sumá cargas + / − y mirá " +
      "cómo se superponen las líneas de campo E y las equipotenciales.",
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
    ],
    create: function (env) {
      var KE = 8.99e9, Q0 = 6e-9, MPP = 0.0018;
      var LEVELS = [55, 130, 280, 600];
      var charges = [];
      var cursor = { x: -999, y: -999, on: false };
      var drag = -1;
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

      function contour(ctx, level, color) {
        var g = cache.grid, cols = cache.cols, rows = cache.rows, step = cache.step;
        var pts = [null, null, null, null];
        ctx.strokeStyle = color; ctx.lineWidth = 1.1; ctx.beginPath();
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

      function reset() { charges = []; drag = -1; dirty = true; phase = 0; needInit = true; }
      function initCharges(W, H) {
        charges = [
          { x: W * 0.38, y: H * 0.5, q: +Q0 },
          { x: W * 0.62, y: H * 0.5, q: -Q0 },
        ];
        needInit = false; dirty = true;
      }

      function addCharge(sign) {
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

      /* ---- interacción mouse ---- */
      var canvas = env.canvas;
      canvas.addEventListener("pointerdown", function (e) {
        var p = pointerXY(canvas, e);
        drag = -1;
        for (var i = charges.length - 1; i >= 0; i--) {
          var dx = p.x - charges[i].x, dy = p.y - charges[i].y;
          if (dx * dx + dy * dy < 18 * 18) { drag = i; break; }
        }
        if (drag >= 0 && canvas.setPointerCapture) { try { canvas.setPointerCapture(e.pointerId); } catch (_) {} }
      });
      canvas.addEventListener("pointermove", function (e) {
        var p = pointerXY(canvas, e);
        cursor.x = p.x; cursor.y = p.y; cursor.on = true;
        if (drag >= 0) {
          charges[drag].x = clamp(p.x, 6, (env.W || 600) - 6);
          charges[drag].y = clamp(p.y, 6, (env.H || 380) - 6);
          dirty = true;
        }
      });
      canvas.addEventListener("pointerup", function () { drag = -1; });
      canvas.addEventListener("pointerleave", function () { cursor.on = false; drag = -1; });

      function step(dt) { phase += dt * 46; }

      function draw(ctx, W, H) {
        if (needInit && W > 0) initCharges(W, H);
        if (dirty || cache.W !== W || cache.H !== H) rebuild(W, H);
        var col = env.colors;

        // grilla de fondo
        ctx.strokeStyle = col.grid; ctx.lineWidth = 1;
        ctx.beginPath();
        for (var gx = 0; gx <= W; gx += 40) { ctx.moveTo(gx, 0); ctx.lineTo(gx, H); }
        for (var gy = 0; gy <= H; gy += 40) { ctx.moveTo(0, gy); ctx.lineTo(W, gy); }
        ctx.stroke();

        // equipotenciales
        if (env.params.equi && charges.length) {
          ctx.globalAlpha = 0.5;
          for (var l = 0; l < LEVELS.length; l++) {
            contour(ctx, LEVELS[l], col.coral);
            contour(ctx, -LEVELS[l], col.blue);
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
            // flecha de sentido a media línea
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
          drawArrow(ctx, cursor.x, cursor.y, cursor.x + fv.ex / m * len, cursor.y + fv.ey / m * len, col.amber, 2, 7);
          dot(ctx, cursor.x, cursor.y, 3, col.text);
          env.setReadout("E", fv.Emag);
          env.setReadout("V", fv.V);
        } else {
          env.setReadout("E", null); env.setReadout("V", null);
        }
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
    blurb: "Elegí la geometría y arrastrá la superficie gaussiana para variar r. " +
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
      { key: "rr", label: "r", unit: "cm", digits: 1 },
    ],
    create: function (env) {
      var KE = 8.99e9, EPS0 = 8.854e-12;
      var MAXCM = 22;
      var r_cm = 13;          // radio de la gaussiana (estado arrastrable)
      var dash = 0;
      var drag = false;

      // devuelve {E: V/m, Qenc: nC} para un radio rr (cm)
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
          var lam = src * 1e-9;               // nC/m
          if (rr < a) { E = 2 * KE * lam * r_m / (a_m * a_m); Q = src * Math.pow(rr / a, 2); }
          else { E = 2 * KE * lam / r_m; Q = src; }   // Q por 1 m de longitud
        } else { // plano/losa: σ = src*10 nC/m², semiespesor a
          var sig = src * 10 * 1e-9;
          var Eout = sig / (2 * EPS0);
          if (rr < a) { E = Eout * (rr / a); Q = (src * 10) * (rr / a); }
          else { E = Eout; Q = src * 10; }           // Q por 1 m² de tapa
        }
        return { E: E, Q: Q };
      }

      function reset() { r_cm = env.params.a * 1.6; drag = false; dash = 0; }
      function step(dt) { dash += dt * 22; }

      // mapea evento de mouse (mitad izquierda) a un radio en cm
      var canvas = env.canvas;
      function setRfromEvent(e) {
        var pt = pointerXY(canvas, e);
        var W = env.W || 600, H = env.H || 360;
        var leftW = W * 0.5, cx = leftW * 0.5, cy = H * 0.5;
        var S = Math.min(leftW * 0.5, H * 0.5) * 0.9 / MAXCM;
        var d;
        if (env.params.geo === "plano") d = Math.abs(pt.y - cy) / S;
        else d = Math.sqrt((pt.x - cx) * (pt.x - cx) + (pt.y - cy) * (pt.y - cy)) / S;
        r_cm = clamp(d, 0.4, MAXCM);
      }
      canvas.addEventListener("pointerdown", function (e) {
        var pt = pointerXY(canvas, e);
        if (pt.x < (env.W || 600) * 0.5) { drag = true; setRfromEvent(e); }
      });
      canvas.addEventListener("pointermove", function (e) { if (drag) setRfromEvent(e); });
      canvas.addEventListener("pointerup", function () { drag = false; });
      canvas.addEventListener("pointerleave", function () { drag = false; });

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params, a = p.a, geo = p.geo;
        var leftW = W * 0.5, cx = leftW * 0.5, cy = H * 0.5;
        var S = Math.min(leftW * 0.5, H * 0.5) * 0.9 / MAXCM;

        // separador
        ctx.strokeStyle = col.grid; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(leftW, 12); ctx.lineTo(leftW, H - 12); ctx.stroke();

        // ---- lado izquierdo: cuerpo + superficie gaussiana ----
        var aPx = a * S, rPx = r_cm * S;
        var srcLabel;
        if (geo === "plano") {
          // losa horizontal de semiespesor a
          ctx.fillStyle = "rgba(146,207,242,0.16)";
          ctx.fillRect(4, cy - aPx, leftW - 8, aPx * 2);
          ctx.strokeStyle = col.blue; ctx.lineWidth = 1.5;
          ctx.strokeRect(4, cy - aPx, leftW - 8, aPx * 2);
          // pillbox gaussiana (altura 2r)
          ctx.setLineDash([5, 4]); ctx.lineDashOffset = -dash;
          ctx.strokeStyle = col.teal; ctx.lineWidth = 1.8;
          ctx.strokeRect(cx - 30, cy - rPx, 60, rPx * 2);
          ctx.setLineDash([]);
          drawArrow(ctx, cx + 44, cy, cx + 44, cy - rPx, col.teal, 1.4, 6);
          srcLabel = "σ = " + (p.src * 10).toFixed(0) + " nC/m²";
        } else {
          // esfera o cilindro (sección circular)
          var bodyCol = (geo === "esf_cond") ? col.amber : col.blue;
          ctx.fillStyle = (geo === "esf_cond") ? "rgba(216,178,121,0.18)" : "rgba(146,207,242,0.16)";
          ctx.beginPath(); ctx.arc(cx, cy, aPx, 0, TAU); ctx.fill();
          ctx.strokeStyle = bodyCol; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(cx, cy, aPx, 0, TAU); ctx.stroke();
          if (geo === "esf_cond") {
            ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
            ctx.textAlign = "center"; ctx.fillText("E=0 dentro", cx, cy + 3); ctx.textAlign = "start";
          }
          // superficie gaussiana
          ctx.setLineDash([5, 4]); ctx.lineDashOffset = -dash;
          ctx.strokeStyle = col.teal; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.arc(cx, cy, rPx, 0, TAU); ctx.stroke();
          ctx.setLineDash([]);
          drawArrow(ctx, cx, cy, cx + rPx * 0.94, cy, col.teal, 1.4, 6);
          srcLabel = (geo === "cil") ? ("λ = " + p.src.toFixed(1) + " nC/m")
            : ("Q = " + p.src.toFixed(1) + " nC");
          // handle de arrastre
          dot(ctx, cx + rPx * Math.cos(-0.6), cy + rPx * Math.sin(-0.6), 4, col.teal);
        }
        ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText(srcLabel, 8, 18);
        ctx.fillText("a = " + a.toFixed(1) + " cm", 8, 34);

        // ---- lado derecho: curva E(r) ----
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
        // ejes
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px0, py0); ctx.lineTo(px0, py1); ctx.lineTo(px1, py1); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText("E (kV/m)", px0 - 2, py0 - 6);
        ctx.fillText("r (cm)", px1 - 34, py1 + 16);
        ctx.fillText((emax / 1000).toFixed(1), px0 - 40, py0 + 6);
        ctx.fillText("0", px0 - 12, py1 + 3);
        // sombra r<a
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillRect(px0, py0, PX(a) - px0, py1 - py0);
        ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(PX(a), py0); ctx.lineTo(PX(a), py1); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillText("a", PX(a) - 3, py0 + 10);
        // curva
        ctx.strokeStyle = col.teal; ctx.lineWidth = 2; ctx.beginPath();
        for (var k = 0; k <= N; k++) {
          var xx = PX(k / N * MAXCM), yy = PY(samp[k]);
          if (k === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
        // punto operativo en r actual
        var cur = physics(r_cm);
        var opx = PX(clamp(r_cm, 0, MAXCM)), opy = PY(cur.E);
        ctx.strokeStyle = "rgba(47,159,143,0.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(opx, py1); ctx.lineTo(opx, opy); ctx.stroke();
        dot(ctx, opx, opy, 4, col.coral);

        env.setReadout("Er", cur.E / 1000);
        env.setReadout("Qenc", cur.Q);
        env.setReadout("rr", r_cm);
      }

      function onControl() { /* la curva se recomputa cada frame */ }
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
    blurb: "Carga en un B uniforme perpendicular a la pantalla. Sin E describe un círculo; " +
      "con E cruzado aparece la deriva E×B (cicloide). Unidades escaladas de la sim.",
    formula: "F = qE + qv×B   ·   r = mv/(qB)   ·   T = 2πm/(qB)   ·   f = qB/(2πm)",
    stageHeight: 380,
    controls: [
      { type: "segment", key: "bdir", label: "Campo B", value: "out", options: [["out", "⊙ sale"], ["in", "⊗ entra"]] },
      { type: "range", key: "q", label: "carga q", min: 1, max: 6, step: 0.5, value: 3, unit: "·q₀", digits: 1 },
      { type: "range", key: "m", label: "masa m", min: 1, max: 6, step: 0.5, value: 3, unit: "·m₀", digits: 1 },
      { type: "range", key: "B", label: "|B|", min: 10, max: 100, step: 5, value: 50, unit: "mT", digits: 0 },
      { type: "range", key: "v0", label: "v inicial", min: 40, max: 180, step: 5, value: 100, unit: "u", digits: 0 },
      { type: "toggle", key: "efield", label: "Campo E adicional (E×B)", value: false },
    ],
    readouts: [
      { key: "r", label: "radio r", unit: "cm", digits: 1 },
      { key: "T", label: "período T", unit: "s", digits: 2 },
      { key: "f", label: "f ciclotrón", unit: "Hz", digits: 2 },
    ],
    create: function (env) {
      var SPEED = 2.5, OMEGA = 0.06, PX_PER_CM = 5, DRIFT = 45;
      var x = 0, y = 0, vx = 0, vy = 0, trace = [], inited = false;

      function Bz() { return (env.params.bdir === "in" ? -1 : 1) * env.params.B; }

      function reset() {
        var W = env.W || 600, H = env.H || 380, p = env.params;
        var bz = Bz(), qm = (p.q / p.m) * OMEGA, omega = qm * bz;
        var speed = p.v0 * SPEED, Rpx = Math.abs(speed / omega);
        vx = speed; vy = 0;
        var fx = p.q * (vy * bz), fy = p.q * (-vx * bz);
        var fm = Math.sqrt(fx * fx + fy * fy) || 1; fx /= fm; fy /= fm;
        x = W / 2 - fx * Rpx; y = H / 2 - fy * Rpx;
        trace = [];
        inited = (env.W || 0) > 0;
      }

      function step(dt) {
        var W = env.W || 600, H = env.H || 380, p = env.params;
        var bz = Bz(), qm = (p.q / p.m) * OMEGA;
        var Emag = p.efield ? DRIFT * Math.abs(bz) : 0;
        var Ex = Emag, Ey = 0;
        // Boris pusher (rotación exacta del giro + medio paso de E)
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

        // campo E
        if (p.efield) {
          ctx.strokeStyle = "rgba(216,178,121,0.5)";
          for (var ey2 = 40; ey2 < H; ey2 += 60) drawArrow(ctx, 12, ey2, 40, ey2, "rgba(216,178,121,0.55)", 1.2, 5);
          ctx.fillStyle = col.amber; ctx.fillText("E →", 10, 34);
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

        // partícula
        var pcol = p.q >= 0 ? col.coral : col.blue;
        dot(ctx, x, y, 7, pcol);
        ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.stroke();

        // vectores v y F=qv×B
        var vm = Math.sqrt(vx * vx + vy * vy) || 1;
        drawArrow(ctx, x, y, x + vx / vm * 34, y + vy / vm * 34, col.teal, 2, 7);
        var bz = Bz();
        var Fx = p.q * (vy * bz), Fy = p.q * (-vx * bz);
        var fm = Math.sqrt(Fx * Fx + Fy * Fy) || 1;
        drawArrow(ctx, x, y, x + Fx / fm * 30, y + Fy / fm * 30, col.coral, 2, 7);
        ctx.fillStyle = col.teal; ctx.fillText("v", x + vx / vm * 40, y + vy / vm * 40);
        ctx.fillStyle = col.coral; ctx.fillText("F", x + Fx / fm * 36, y + Fy / fm * 36);

        // readouts (valores teóricos del ciclotrón)
        var qm = (p.q / p.m) * OMEGA, omega = Math.abs(qm * bz);
        var Rpx = Math.abs(p.v0 * SPEED / (qm * bz));
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
    blurb: "La espira cae y sale de la región de B. Mientras cruza el borde aparece fem, " +
      "corriente y una fuerza que frena (Lenz): puede llegar a velocidad terminal.",
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
      { key: "est", label: "estado" },
    ],
    plot: {
      height: 150, window: 4, autoY: true,
      xLabel: "t (s)", yLabel: "Φ (Wb) · ε (V)",
      series: [{ key: "phi", label: "Φ", color: PAL.teal }, { key: "eps", label: "ε", color: PAL.coral }],
    },
    create: function (env) {
      var PPM = 200, G = 9.8;
      var y = 0.02, v = 0, t = 0;

      function reset() { y = 0.02; v = 0; t = 0; env.plot.clear(); }

      function geom(H) {
        var p = env.params;
        var Yb = 0.42 * H / PPM;                 // borde inferior del campo (m)
        var overlap = clamp(Yb - y, 0, p.a);     // alto de espira dentro del campo
        var straddling = (y < Yb && (y + p.a) > Yb);
        return { Yb: Yb, overlap: overlap, straddling: straddling };
      }

      function step(dt) {
        var p = env.params, H = env.H || 360;
        var m = p.m / 1000, g = geom(H);
        var Fdrag = g.straddling ? (p.B * p.B * p.b * p.b * v) / p.R : 0;
        var acc = G - Fdrag / m;                 // g − fuerza de Lenz / m
        v += acc * dt; y += v * dt; t += dt;
        var g2 = geom(H);
        var Phi = p.B * p.b * g2.overlap;
        var eps = g2.straddling ? p.B * p.b * v : 0;
        env.plot.push(t, { phi: Phi, eps: eps });
        if (y * PPM > H + 12) { y = 0.02; v = 0; }  // relanza sin borrar el plot
      }

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params, g = geom(H);
        var YbPx = g.Yb * PPM;
        var m = p.m / 1000;
        var vt = m * G * p.R / (p.B * p.B * p.b * p.b);

        // región de campo B (arriba del borde), símbolos ⊗
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

        // espira
        var lx = W * 0.5 - (p.b * PPM) / 2, ly = y * PPM, lw = p.b * PPM, lh = p.a * PPM;
        ctx.strokeStyle = col.coral; ctx.lineWidth = 3;
        ctx.strokeRect(lx, ly, lw, lh);

        // corriente inducida (Lenz) — sentido horario, dashes marchando
        var eps = g.straddling ? p.B * p.b * v : 0;
        var i = eps / p.R;
        if (g.straddling && Math.abs(i) > 1e-4) {
          ctx.strokeStyle = col.teal; ctx.lineWidth = 2; ctx.setLineDash([6, 6]);
          ctx.lineDashOffset = -(t * 60);
          ctx.strokeRect(lx + 3, ly + 3, lw - 6, lh - 6); ctx.setLineDash([]);
          // flechas de sentido (horario)
          var mx = lx + lw / 2, my = ly + lh / 2;
          drawArrow(ctx, lx + 6, ly + 6, lx + lw - 6, ly + 6, col.teal, 1.6, 6);          // top →
          drawArrow(ctx, lx + lw - 6, ly + 6, lx + lw - 6, ly + lh - 6, col.teal, 1.6, 6); // right ↓
          drawArrow(ctx, lx + lw - 6, ly + lh - 6, lx + 6, ly + lh - 6, col.teal, 1.6, 6); // bottom ←
          drawArrow(ctx, lx + 6, ly + lh - 6, lx + 6, ly + 6, col.teal, 1.6, 6);           // left ↑
          ctx.fillStyle = col.teal; ctx.fillText("i (horaria)", mx - 26, my);
        }
        // vector velocidad
        drawArrow(ctx, W * 0.5, ly + lh, W * 0.5, ly + lh + clamp(v * 14, 6, 60), col.amber, 2, 7);
        ctx.fillStyle = col.amber; ctx.fillText("v", W * 0.5 + 6, ly + lh + 20);

        // readouts
        var est;
        if (!g.straddling) est = "caída libre";
        else if (vt > 0 && Math.abs(v - vt) / vt < 0.05) est = "≈ terminal";
        else est = "frenando";
        env.setReadout("i", Math.abs(i));
        env.setReadout("v", v);
        env.setReadout("vt", vt);
        env.setReadout("est", est);
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
    blurb: "Circuito RLC en serie con fuente CA. Mirá rotar los fasores V_R, V_L, V_C y V, " +
      "y barré la frecuencia para pasar por la resonancia en la curva I(f).",
    formula: "Z = √(R²+(X_L−X_C)²)   ·   φ = atan((X_L−X_C)/R)   ·   f₀ = 1/(2π√(LC))",
    stageHeight: 360,
    controls: [
      { type: "range", key: "R", label: "R", min: 1, max: 100, step: 1, value: 20, unit: "Ω", digits: 0 },
      { type: "range", key: "L", label: "L", min: 1, max: 100, step: 1, value: 10, unit: "mH", digits: 0 },
      { type: "range", key: "C", label: "C", min: 0.5, max: 20, step: 0.5, value: 10, unit: "µF", digits: 1 },
      { type: "range", key: "f", label: "frecuencia f", min: 10, max: 1200, step: 5, value: 300, unit: "Hz", digits: 0 },
    ],
    readouts: [
      { key: "Z", label: "|Z|", unit: "Ω", digits: 1 },
      { key: "phi", label: "fase φ", unit: "°", digits: 1 },
      { key: "f0", label: "f₀ resonancia", unit: "Hz", digits: 0 },
      { key: "est", label: "estado" },
    ],
    plot: {
      height: 150, window: 3, yMin: -1.25, yMax: 1.25,
      xLabel: "t", yLabel: "norm.",
      series: [{ key: "v", label: "v/V₀", color: PAL.coral }, { key: "i", label: "i/I₀", color: PAL.teal }],
    },
    create: function (env) {
      var VMAX = 10, WVIS = TAU * 0.3, theta = 0, tt = 0;

      function vals() {
        var p = env.params;
        var L = p.L * 1e-3, C = p.C * 1e-6, w = TAU * p.f;
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

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params, s = vals();
        var leftW = W * 0.46;

        // ===== fasores (izquierda) =====
        var cx = leftW * 0.5, cy = H * 0.5;
        var rad = Math.min(leftW * 0.5, H * 0.5) * 0.82;
        var Lmax = Math.max(s.VR, s.VL, s.VC, VMAX) || 1;
        var k = rad / Lmax;
        // disco
        ctx.strokeStyle = col.grid; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, rad, 0, TAU); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - rad, cy); ctx.lineTo(cx + rad, cy);
        ctx.moveTo(cx, cy - rad); ctx.lineTo(cx, cy + rad); ctx.stroke();

        function ph(ang, len, color, w, label, lx, ly) {
          var ex = cx + Math.cos(ang) * len * k, ey = cy - Math.sin(ang) * len * k;
          drawArrow(ctx, cx, cy, ex, ey, color, w, 7);
          if (label) { ctx.fillStyle = color; ctx.font = "11px ui-monospace, Menlo, monospace";
            ctx.fillText(label, ex + (lx || 4), ey + (ly || 0)); }
          return { x: ex, y: ey };
        }
        var iang = theta;                        // corriente = referencia
        // fasores desde el origen
        ph(iang, s.VR, col.coral, 2.4, "V_R", 4, -2);
        ph(iang + Math.PI / 2, s.VL, col.blue, 2, "V_L", 4, 0);
        ph(iang - Math.PI / 2, s.VC, col.amber, 2, "V_C", 4, 8);
        var vtot = ph(iang + s.phi, VMAX, col.text, 2.8, "V", 6, -2);
        // corriente (referencia, teal punteada)
        ctx.setLineDash([3, 3]);
        drawArrow(ctx, cx, cy, cx + Math.cos(iang) * rad, cy - Math.sin(iang) * rad, col.teal, 1.4, 6);
        ctx.setLineDash([]);
        ctx.fillStyle = col.teal; ctx.fillText("I", cx + Math.cos(iang) * rad + 4, cy - Math.sin(iang) * rad);
        // construcción: rectángulo V_R + reactivo neto
        var rx = cx + Math.cos(iang) * s.VR * k, ry = cy - Math.sin(iang) * s.VR * k;
        ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.setLineDash([2, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(vtot.x, vtot.y); ctx.stroke(); ctx.setLineDash([]);

        // ===== curva I(f) (derecha) =====
        var px0 = leftW + 44, px1 = W - 14, py0 = 22, py1 = H - 30;
        var fmin = 10, fmax = clamp(2.6 * s.f0, 240, 3000);
        var N = 140, imax = 1e-9, samp = [];
        for (var q = 0; q <= N; q++) {
          var f = fmin + (fmax - fmin) * q / N, iv = Iof(f);
          samp.push(iv); if (iv > imax) imax = iv;
        }
        imax *= 1.1;
        function FX(f) { return px0 + (f - fmin) / (fmax - fmin) * (px1 - px0); }
        function IY(iv) { return py1 - iv / imax * (py1 - py0); }
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px0, py0); ctx.lineTo(px0, py1); ctx.lineTo(px1, py1); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText("I (A)", px0 - 2, py0 - 6);
        ctx.fillText("f (Hz)", px1 - 34, py1 + 16);
        ctx.fillText(imax.toFixed(2), px0 - 38, py0 + 6);
        // f0 (resonancia)
        if (s.f0 >= fmin && s.f0 <= fmax) {
          ctx.strokeStyle = "rgba(146,207,242,0.55)"; ctx.setLineDash([4, 3]);
          ctx.beginPath(); ctx.moveTo(FX(s.f0), py0); ctx.lineTo(FX(s.f0), py1); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = col.blue; ctx.fillText("f₀", FX(s.f0) + 3, py0 + 10);
        }
        // curva
        ctx.strokeStyle = col.teal; ctx.lineWidth = 2; ctx.beginPath();
        for (var c2 = 0; c2 <= N; c2++) {
          var xx = FX(fmin + (fmax - fmin) * c2 / N), yy = IY(samp[c2]);
          if (c2 === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
        // punto operativo
        if (p.f >= fmin && p.f <= fmax) {
          var opx = FX(p.f), opy = IY(s.Imax);
          ctx.strokeStyle = "rgba(244,124,89,0.5)"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(opx, py1); ctx.lineTo(opx, opy); ctx.stroke();
          dot(ctx, opx, opy, 4.5, col.coral);
        }

        // readouts
        var est;
        if (Math.abs(p.f - s.f0) / s.f0 < 0.02) est = "resonancia";
        else if (s.X > 0) est = "inductivo";
        else est = "capacitivo";
        env.setReadout("Z", s.Z);
        env.setReadout("phi", s.phi * 180 / Math.PI);
        env.setReadout("f0", s.f0);
        env.setReadout("est", est);
      }

      return { reset: reset, step: step, draw: draw };
    },
  });

})();
