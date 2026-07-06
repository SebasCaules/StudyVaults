/* ============================================================
   f3-induccion.js — Física 3, sección "Inducción, corriente
   alterna y relatividad". Último archivo de la pestaña F3:
   registra la tab y 7 laboratorios (Faraday con imán, espira
   cayendo, RL, RLC, transformador, relatividad y onda EM).
   Todos exponen al menos un handle arrastrable (env.addHandle):
   el core hace hit-test, cursor grab/grabbing y dibuja el halo.
   Script clásico, sin módulos, compatible file://.
   ============================================================ */
(function () {
  "use strict";

  var PAL = (window.SimKit && window.SimKit.colors) || {};
  var TAU = Math.PI * 2;
  var C_LIGHT = 2.998e8;               // m/s
  var SECTION = "Inducción, corriente alterna y relatividad";

  /* ---------- helpers de dibujo (idénticos a f3.js) ---------- */
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

  /* ============================================================
     TAB (este archivo es el último de la pestaña F3)
     ============================================================ */
  SimKit.registerTab({
    id: "f3",
    intro: "Electromagnetismo en vivo, por secciones: electrostática, circuitos, magnetismo e " +
      "inducción — cada laboratorio se toca con el mouse y refuerza un tema de los apuntes.",
  });

  /* ============================================================
     SIM 1 — Faraday con imán en mano (Lenz visual)   [NUEVA]
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SECTION,
    id: "faraday-iman",
    title: "Faraday con imán en mano",
    refs: "Resumen p.23 · Práctica g.6 (6.1)",
    blurb: "Agarrá el imán y acercalo o alejalo de la espira: cambia el flujo Φ y aparece una fem ε = −N·dΦ/dt. " +
      "La aguja del galvanómetro se mueve en vivo y las flechas de corriente muestran la ley de Lenz — al invertir " +
      "el sentido del movimiento se invierte la corriente. Con \"vaivén automático\" el imán oscila solo.",
    formula: "ε = −N·dΦ/dt   ·   Φ = ∫B·dA   ·   i = ε/R   ·   Lenz: la corriente se opone al cambio de Φ",
    stageHeight: 360,
    controls: [
      { type: "toggle", key: "multi", label: "Bobina de N vueltas (N = 20)", value: true },
      { type: "range", key: "R", label: "resistencia R", min: 0.5, max: 8, step: 0.5, value: 2, unit: "Ω", digits: 1 },
      { type: "toggle", key: "auto", label: "vaivén automático del imán", value: true },
    ],
    readouts: [
      { key: "phi", label: "Φ (flujo)", unit: "mWb", digits: 3 },
      { key: "eps", label: "ε inducida", unit: "V", digits: 3 },
      { key: "i", label: "i galvanómetro", unit: "mA", digits: 1 },
      { key: "sentido", label: "sentido (Lenz)" },
    ],
    plot: {
      height: 150, window: 5, autoY: true,
      xLabel: "t (s)", yLabel: "Φ (mWb) · ε (V)",
      series: [{ key: "phi", label: "Φ", color: PAL.teal }, { key: "eps", label: "ε", color: PAL.coral }],
    },
    create: function (env) {
      var MPP = 0.0016, S_SOFT = 0.05, PHI0 = 2e-3, AUTOSPD = 130, IREF = 0.08;
      var magX = null, autoDir = 1, grabbed = false, t = 0;
      var prevPhi = null;
      var cur = { Phi: 0, eps: 0, i: 0 };

      function geom() {
        var W = env.W || 600, H = env.H || 360;
        var coilX = W * 0.64, laneY = H * 0.38;
        return { W: W, H: H, coilX: coilX, laneY: laneY,
          minX: W * 0.14, maxX: coilX - 64, galvoX: W * 0.64, galvoY: H * 0.82 };
      }
      function N() { return env.params.multi ? 20 : 1; }
      function fluxAt(magx, g) {
        var d = Math.max(0, (g.coilX - magx)) * MPP;
        return PHI0 * Math.pow(S_SOFT, 3) / Math.pow(S_SOFT * S_SOFT + d * d, 1.5);
      }

      function reset() {
        magX = null; autoDir = 1; grabbed = false; t = 0; prevPhi = null;
        cur = { Phi: 0, eps: 0, i: 0 }; env.plot.clear();
      }

      // handle: el imán (arrastre horizontal sobre el eje espira)
      env.addHandle({
        r: 28,
        x: function () { return magX == null ? geom().minX : magX; },
        y: function () { return geom().laneY; },
        onStart: function () { grabbed = true; },
        onDrag: function (px) { var g = geom(); magX = clamp(px, g.minX, g.maxX); },
        onEnd: function () { grabbed = false; },
      });

      function step(dt) {
        var g = geom();
        if (magX == null) magX = g.minX + (g.maxX - g.minX) * 0.45;
        if (!grabbed && env.params.auto) {
          magX += autoDir * AUTOSPD * dt;
          if (magX >= g.maxX) { magX = g.maxX; autoDir = -1; }
          else if (magX <= g.minX) { magX = g.minX; autoDir = 1; }
        }
        var Phi = fluxAt(magX, g);
        var eps = (prevPhi == null) ? 0 : -N() * (Phi - prevPhi) / dt;
        prevPhi = Phi;
        cur.Phi = Phi; cur.eps = eps; cur.i = eps / env.params.R;
        t += dt;
        env.plot.push(t, { phi: Phi * 1000, eps: eps });
      }

      function drawMagnet(ctx, x, y, col) {
        var w = 66, h = 26;
        // mitad izquierda S (azul), derecha N (roja, mira a la espira)
        ctx.fillStyle = "rgba(146,207,242,0.85)"; ctx.fillRect(x - w / 2, y - h / 2, w / 2, h);
        ctx.fillStyle = "rgba(214,143,133,0.9)"; ctx.fillRect(x, y - h / 2, w / 2, h);
        ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 1.5;
        ctx.strokeRect(x - w / 2, y - h / 2, w, h);
        ctx.fillStyle = col.ink; ctx.font = "bold 14px ui-monospace, Menlo, monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("S", x - w / 4, y); ctx.fillText("N", x + w / 4, y);
        ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      }

      function drawCoil(ctx, cx, cy, col, n) {
        var loops = Math.min(n, 6);
        ctx.strokeStyle = "rgba(216,178,121,0.9)"; ctx.lineWidth = 2.4;
        for (var k = 0; k < loops; k++) {
          var off = (k - (loops - 1) / 2) * 5;
          ctx.beginPath(); ctx.ellipse(cx + off, cy, 15, 44, 0, 0, TAU); ctx.stroke();
        }
      }

      function drawInducedCurrent(ctx, cx, cy, i, phase, col) {
        if (Math.abs(i) < 4e-4) return;
        var dir = i > 0 ? 1 : -1;
        ctx.save();
        ctx.strokeStyle = "rgba(47,159,143,0.9)"; ctx.lineWidth = 2;
        ctx.setLineDash([5, 6]); ctx.lineDashOffset = -dir * phase * 60;
        ctx.beginPath(); ctx.ellipse(cx, cy, 21, 50, 0, 0, TAU); ctx.stroke();
        ctx.setLineDash([]);
        // cabezas de flecha (arriba y abajo) según el sentido
        var top = { x: cx + dir * 6, y: cy - 50 };
        var bot = { x: cx - dir * 6, y: cy + 50 };
        drawArrow(ctx, cx, cy - 50, top.x, top.y, "rgba(47,159,143,0.95)", 2, 7);
        drawArrow(ctx, cx, cy + 50, bot.x, bot.y, "rgba(47,159,143,0.95)", 2, 7);
        ctx.restore();
      }

      function drawGalvo(ctx, gx, gy, i, col) {
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(gx, gy, 30, Math.PI, TAU); ctx.stroke();
        // escala
        ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 1;
        for (var a = -1; a <= 1; a += 0.5) {
          var ang = -Math.PI / 2 + a * (Math.PI / 3);
          ctx.beginPath();
          ctx.moveTo(gx + Math.cos(ang) * 24, gy + Math.sin(ang) * 24);
          ctx.lineTo(gx + Math.cos(ang) * 30, gy + Math.sin(ang) * 30);
          ctx.stroke();
        }
        var defl = clamp(i / IREF, -1, 1) * (Math.PI / 3);
        var na = -Math.PI / 2 + defl;
        drawArrow(ctx, gx, gy, gx + Math.cos(na) * 26, gy + Math.sin(na) * 26, col.coral, 2, 6);
        dot(ctx, gx, gy, 3, col.text);
        ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.textAlign = "center"; ctx.fillText("galvanómetro", gx, gy + 16); ctx.textAlign = "start";
      }

      function draw(ctx, W, H) {
        var col = env.colors, g = geom();
        if (magX == null) magX = g.minX + (g.maxX - g.minX) * 0.45;
        env.grid(ctx, W, H, 40);

        // eje / riel del imán
        ctx.strokeStyle = "rgba(255,255,255,0.10)"; ctx.setLineDash([4, 5]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(g.minX - 20, g.laneY); ctx.lineTo(g.coilX, g.laneY); ctx.stroke();
        ctx.setLineDash([]);

        // corriente inducida en la espira + campo del imán hacia la bobina
        drawCoil(ctx, g.coilX, g.laneY, col, N());
        drawInducedCurrent(ctx, g.coilX, g.laneY, cur.i, t, col);
        var d = (g.coilX - magX);
        if (d > 6) drawArrow(ctx, magX + 34, g.laneY, magX + 34 + Math.min(d - 34, 60), g.laneY, "rgba(214,143,133,0.6)", 1.4, 6);

        // imán arrastrable
        drawMagnet(ctx, magX, g.laneY, col);

        // cables espira → galvanómetro
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(g.coilX - 8, g.laneY + 48); ctx.lineTo(g.coilX - 8, g.galvoY);
        ctx.moveTo(g.coilX + 8, g.laneY + 48); ctx.lineTo(g.coilX + 8, g.galvoY);
        ctx.stroke();
        drawGalvo(ctx, g.galvoX, g.galvoY, cur.i, col);

        // estado textual
        var mov = grabbed ? "en tu mano" : (env.params.auto ? (autoDir > 0 ? "acercándose" : "alejándose") : "quieto");
        ctx.fillStyle = col.amber; ctx.font = "12px ui-monospace, Menlo, monospace";
        ctx.fillText("imán: " + mov, 10, 20);

        // readouts (incl. string de sentido — Lenz)
        var sentido = Math.abs(cur.i) < 1e-4 ? "—" : (cur.i > 0 ? "antihoraria" : "horaria");
        env.setReadout("phi", cur.Phi * 1000);
        env.setReadout("eps", cur.eps);
        env.setReadout("i", cur.i * 1000);
        env.setReadout("sentido", sentido);
      }

      return { reset: reset, step: step, draw: draw };
    },
  });

  /* ============================================================
     SIM 2 — Fem de movimiento: espira cayendo   [PORT de f3.js]
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SECTION,
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
     SIM 3 — Circuito RL: carga y descarga con llave   [NUEVA]
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SECTION,
    id: "rl",
    title: "Circuito RL — carga y descarga",
    refs: "Resumen p.23 (RL) · Práctica g.7 (7.2)",
    blurb: "Conmutá la llave (botón o palanca en el esquema) entre carga y descarga y mirá la corriente " +
      "crecer o decaer de forma exponencial. La marca τ = L/R sobre la curva señala la constante de tiempo: " +
      "en un τ la corriente cubre el 63 % del cambio.",
    formula: "carga: i = (ε/R)(1 − e^(−t/τ))   ·   descarga: i = i₀·e^(−t/τ)   ·   τ = L/R   ·   U = ½Li²",
    stageHeight: 340,
    controls: [
      { type: "range", key: "eps", label: "fem ε", min: 1, max: 24, step: 1, value: 12, unit: "V", digits: 0 },
      { type: "range", key: "R", label: "resistencia R", min: 1, max: 20, step: 1, value: 5, unit: "Ω", digits: 0 },
      { type: "range", key: "L", label: "inductancia L", min: 0.2, max: 2, step: 0.1, value: 1, unit: "H", digits: 1 },
      { type: "button", key: "sw", label: "conmutar llave (carga ⇄ descarga)" },
    ],
    readouts: [
      { key: "tau", label: "τ = L/R", unit: "s", digits: 3 },
      { key: "imax", label: "i_max = ε/R", unit: "A", digits: 2 },
      { key: "U", label: "U = ½Li²", unit: "J", digits: 2 },
      { key: "estado", label: "estado" },
    ],
    create: function (env) {
      var mode = "carga", i = 0, i0 = 0, t = 0;
      var sch = { sx: 0, sy: 0, x0: 0, x1: 0, y0: 0, y1: 0 };

      function tau() { return env.params.L / env.params.R; }
      function iinf() { return mode === "carga" ? env.params.eps / env.params.R : 0; }
      function analytic(tt) {
        var f = iinf(), tu = tau();
        return f + (i0 - f) * Math.exp(-tt / tu);
      }
      function conmutar() { i0 = i; mode = mode === "carga" ? "descarga" : "carga"; t = 0; }

      function reset() { mode = "carga"; i = 0; i0 = 0; t = 0; }

      // handle: la palanca de la llave (click = conmutar)
      env.addHandle({
        r: 18,
        x: function () { return sch.sx; },
        y: function () { return sch.sy; },
        onStart: function () { conmutar(); },
        onDrag: function () {},
      });

      function step(dt) {
        t += dt;
        var f = iinf(), k = Math.exp(-dt / tau());
        i = f + (i - f) * k;
      }

      function drawSchematic(ctx, W, H, col) {
        var x0 = W * 0.06, x1 = W * 0.36, y0 = H * 0.24, y1 = H * 0.78;
        sch.x0 = x0; sch.x1 = x1; sch.y0 = y0; sch.y1 = y1;
        var sx = (x0 + x1) / 2, sy = y0;
        sch.sx = sx; sch.sy = sy;
        var flow = clamp(Math.abs(i) / (env.params.eps / env.params.R + 1e-6), 0, 1);

        // cableado (con animación de corriente)
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 2;
        ctx.setLineDash([5, 7]); ctx.lineDashOffset = -t * (40 + flow * 220);
        ctx.beginPath();
        ctx.moveTo(sx, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y1);
        ctx.lineTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x0 + (sx - x0) * 0.42, y0);
        ctx.stroke(); ctx.setLineDash([]);

        // batería ε (lado izquierdo)
        var by = (y0 + y1) / 2;
        ctx.strokeStyle = col.amber; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x0 - 7, by - 10); ctx.lineTo(x0 + 7, by - 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x0 - 4, by + 10); ctx.lineTo(x0 + 4, by + 10); ctx.stroke();
        ctx.fillStyle = col.amber; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText("ε=" + env.params.eps.toFixed(0) + "V", x0 - 40, by + 3);

        // resistor R (abajo, zig-zag)
        var rz0 = x0 + (x1 - x0) * 0.35, rz1 = x0 + (x1 - x0) * 0.65;
        ctx.strokeStyle = col.coral; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(rz0, y1);
        for (var z = 0; z < 6; z++) {
          var xx = rz0 + (rz1 - rz0) * (z + 0.5) / 6;
          ctx.lineTo(xx, y1 + (z % 2 ? 7 : -7));
        }
        ctx.lineTo(rz1, y1); ctx.stroke();
        ctx.fillStyle = col.coral; ctx.fillText("R=" + env.params.R.toFixed(0) + "Ω", (rz0 + rz1) / 2 - 18, y1 + 24);

        // inductor L (lado derecho, bobina)
        var ly0 = y0 + (y1 - y0) * 0.32, ly1 = y0 + (y1 - y0) * 0.68, lo = 4;
        ctx.strokeStyle = col.blue; ctx.lineWidth = 2;
        for (var q = 0; q < lo; q++) {
          var yy = ly0 + (ly1 - ly0) * (q + 0.5) / lo;
          ctx.beginPath(); ctx.arc(x1, yy, 7, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        }
        ctx.fillStyle = col.blue; ctx.fillText("L=" + env.params.L.toFixed(1) + "H", x1 + 12, (ly0 + ly1) / 2);

        // llave (palanca) — apunta a C o D según el modo
        var contactC = { x: sx - 16, y: sy }, contactD = { x: sx + 16, y: sy };
        ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText("C", contactC.x - 3, sy - 10); ctx.fillText("D", contactD.x - 3, sy - 10);
        dot(ctx, contactC.x, sy, 2.5, col.dim); dot(ctx, contactD.x, sy, 2.5, col.dim);
        var tgt = mode === "carga" ? contactC : contactD;
        ctx.strokeStyle = col.teal; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(sx, sy + 4); ctx.lineTo(tgt.x, tgt.y - 2); ctx.stroke();
        dot(ctx, sx, sy + 4, 3, col.teal);
      }

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params;
        drawSchematic(ctx, W, H, col);

        // ---- curva i(t) con marca τ ----
        var px0 = W * 0.5, px1 = W - 16, py0 = H * 0.16, py1 = H * 0.82;
        var tu = tau(), Tmax = clamp(5 * tu, 0.4, 8);
        var yTop = Math.max(p.eps / p.R, i0, i, 1e-9) * 1.15;
        function X(tt) { return px0 + clamp(tt / Tmax, 0, 1) * (px1 - px0); }
        function Y(ii) { return py1 - clamp(ii / yTop, 0, 1) * (py1 - py0); }

        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px0, py0); ctx.lineTo(px0, py1); ctx.lineTo(px1, py1); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText("i (A)", px0 - 2, py0 - 6);
        ctx.fillText("t (s)", px1 - 30, py1 + 16);
        ctx.fillText(yTop.toFixed(2), px0 - 34, py0 + 6);
        ctx.fillText("0", px0 - 12, py1 + 3);
        ctx.fillText(Tmax.toFixed(1), px1 - 14, py1 + 16);

        // asíntota (i_max en carga; 0 en descarga)
        var asy = iinf();
        ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.setLineDash([2, 4]);
        ctx.beginPath(); ctx.moveTo(px0, Y(asy)); ctx.lineTo(px1, Y(asy)); ctx.stroke(); ctx.setLineDash([]);

        // marca de τ
        if (tu <= Tmax) {
          ctx.strokeStyle = "rgba(146,207,242,0.6)"; ctx.setLineDash([4, 3]);
          ctx.beginPath(); ctx.moveTo(X(tu), py0); ctx.lineTo(X(tu), py1); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = col.blue; ctx.fillText("τ = L/R", X(tu) + 4, py0 + 12);
          dot(ctx, X(tu), Y(analytic(tu)), 3, col.blue);
        }

        // curva teórica
        var N = 120;
        ctx.strokeStyle = col.teal; ctx.lineWidth = 2; ctx.beginPath();
        for (var kk = 0; kk <= N; kk++) {
          var tt = kk / N * Tmax, xx = X(tt), yy = Y(analytic(tt));
          if (kk === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.stroke();

        // punto operativo en vivo
        dot(ctx, X(t), Y(i), 4.5, col.coral);

        ctx.fillStyle = mode === "carga" ? col.teal : col.amber;
        ctx.font = "12px ui-monospace, Menlo, monospace";
        ctx.fillText("llave: " + mode, px0 + 6, py1 - 8);

        env.setReadout("tau", tu);
        env.setReadout("imax", p.eps / p.R);
        env.setReadout("U", 0.5 * p.L * i * i);
        env.setReadout("estado", mode);
      }

      function onButton(key) { if (key === "sw") conmutar(); }
      return { reset: reset, step: step, draw: draw, onButton: onButton };
    },
  });

  /* ============================================================
     SIM 4 — RLC serie: fasores + resonancia   [PORT de f3.js]
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SECTION,
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
     SIM 5 — Transformador ideal   [NUEVA]
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SECTION,
    id: "transformador",
    title: "Transformador — relación de vueltas",
    refs: "Resumen CA (transformador) · Práctica g.6 (6.12)",
    blurb: "Arrastrá los knobs de cada bobinado para agregar o quitar vueltas (N₁ y N₂). El flujo alterna " +
      "por el núcleo y acopla ambas bobinas: V₂ = V₁·N₂/N₁. Con potencia conservada, la corriente hace lo " +
      "contrario (I₁/I₂ = N₂/N₁). Elevador si N₂>N₁, reductor si N₂<N₁.",
    formula: "V₂/V₁ = N₂/N₁   ·   I₁/I₂ = N₂/N₁   ·   V₁I₁ = V₂I₂ (ideal)",
    stageHeight: 360,
    controls: [
      { type: "range", key: "V1", label: "tensión primaria V₁", min: 1, max: 240, step: 1, value: 120, unit: "V", digits: 0 },
      { type: "range", key: "Rload", label: "carga R (secundario)", min: 5, max: 200, step: 5, value: 50, unit: "Ω", digits: 0 },
    ],
    readouts: [
      { key: "V2", label: "V₂ secundaria", unit: "V", digits: 1 },
      { key: "I1", label: "I₁ primaria", unit: "A", digits: 2 },
      { key: "I2", label: "I₂ secundaria", unit: "A", digits: 2 },
      { key: "tipo", label: "tipo" },
    ],
    plot: {
      height: 140, window: 3, autoY: true,
      xLabel: "t", yLabel: "v₁ · v₂ (V)",
      series: [{ key: "v1", label: "v₁", color: PAL.coral }, { key: "v2", label: "v₂", color: PAL.blue }],
    },
    create: function (env) {
      var NMAX = 36, WVIS = TAU * 0.4;
      var N1 = 8, N2 = 16, phase = 0, tt = 0;
      var core = { top: 0, bot: 0, left: 0, right: 0 };

      function vals() {
        var p = env.params;
        var V2 = p.V1 * N2 / N1;
        var I2 = V2 / p.Rload;
        var I1 = (p.V1 > 0) ? (V2 * I2) / p.V1 : 0;
        return { V2: V2, I1: I1, I2: I2 };
      }

      function reset() { phase = 0; tt = 0; }
      function step(dt) {
        phase += WVIS * dt; tt += dt;
        var s = vals();
        env.plot.push(tt, { v1: env.params.V1 * Math.sin(phase), v2: s.V2 * Math.sin(phase) });
      }

      function knobY(N) {
        var top = core.top + 8, bot = core.bot - 8;
        return bot - (N - 1) / (NMAX - 1) * (bot - top);
      }
      function knobToN(py) {
        var top = core.top + 8, bot = core.bot - 8;
        return clamp(Math.round(1 + (bot - py) / ((bot - top) || 1) * (NMAX - 1)), 1, NMAX);
      }
      // handles: knobs que agregan/quitan vueltas en cada bobinado
      env.addHandle({
        r: 15,
        x: function () { return core.left - 42; },
        y: function () { return knobY(N1); },
        onDrag: function (px, py) { N1 = knobToN(py); },
      });
      env.addHandle({
        r: 15,
        x: function () { return core.right + 42; },
        y: function () { return knobY(N2); },
        onDrag: function (px, py) { N2 = knobToN(py); },
      });

      function winding(ctx, legX, top, bot, turns, color) {
        var loops = Math.min(turns, 16), sp = (bot - top) / (loops + 1);
        ctx.strokeStyle = color; ctx.lineWidth = 2.2;
        for (var k = 0; k < loops; k++) {
          var yy = top + sp * (k + 1);
          ctx.beginPath(); ctx.ellipse(legX, yy, 20, sp * 0.5, 0, 0, TAU); ctx.stroke();
        }
      }

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params, s = vals();
        var cl = W * 0.36, cr = W * 0.62, ct = H * 0.2, cb = H * 0.82, bw = 18;
        core.top = ct; core.bot = cb; core.left = cl; core.right = cr;

        // ===== núcleo de hierro (ventana rectangular) =====
        ctx.strokeStyle = "rgba(161,161,170,0.55)"; ctx.lineWidth = bw;
        ctx.lineJoin = "round";
        ctx.strokeRect(cl, ct, cr - cl, cb - ct);
        ctx.lineJoin = "miter";

        // ===== flujo alterno animado por el núcleo =====
        var amp = Math.abs(Math.sin(phase));
        ctx.strokeStyle = "rgba(216,178,121," + (0.25 + amp * 0.55).toFixed(3) + ")";
        ctx.lineWidth = 2.4; ctx.setLineDash([6, 8]);
        ctx.lineDashOffset = -(Math.sin(phase) >= 0 ? 1 : -1) * tt * 90;
        var inset = bw * 0.5 + 4;
        ctx.strokeRect(cl + inset, ct + inset, (cr - cl) - inset * 2, (cb - ct) - inset * 2);
        ctx.setLineDash([]);
        ctx.fillStyle = col.amber; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText("Φ (núcleo)", (cl + cr) / 2 - 26, (ct + cb) / 2);

        // ===== bobinados =====
        winding(ctx, cl, ct + 14, cb - 14, N1, col.coral);
        winding(ctx, cr, ct + 14, cb - 14, N2, col.blue);

        // fuente primaria + carga secundaria
        ctx.strokeStyle = col.coral; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(cl - 20, ct + 26); ctx.lineTo(W * 0.08, ct + 26);
        ctx.moveTo(cl - 20, cb - 26); ctx.lineTo(W * 0.08, cb - 26); ctx.stroke();
        ctx.fillStyle = col.coral; ctx.font = "12px ui-monospace, Menlo, monospace";
        ctx.fillText("V₁", W * 0.08 - 4, (ct + cb) / 2 - 4);
        ctx.fillText("N₁ = " + N1, cl - 66, cb + 20);

        ctx.strokeStyle = col.blue; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(cr + 20, ct + 26); ctx.lineTo(W * 0.9, ct + 26);
        ctx.moveTo(cr + 20, cb - 26); ctx.lineTo(W * 0.9, cb - 26); ctx.stroke();
        ctx.strokeStyle = col.teal; ctx.lineWidth = 2;
        ctx.strokeRect(W * 0.9 - 10, (ct + cb) / 2 - 14, 20, 28);
        ctx.fillStyle = col.blue; ctx.fillText("N₂ = " + N2, cr + 30, cb + 20);
        ctx.fillStyle = col.teal; ctx.fillText("R", W * 0.9 + 16, (ct + cb) / 2 + 4);

        // etiqueta de tipo
        var tipo = N2 > N1 ? "elevador ↑" : (N2 < N1 ? "reductor ↓" : "aislador 1:1");
        ctx.fillStyle = col.amber; ctx.font = "13px ui-monospace, Menlo, monospace";
        ctx.fillText(tipo + "   (N₂/N₁ = " + (N2 / N1).toFixed(2) + ")", 10, 20);

        env.setReadout("V2", s.V2);
        env.setReadout("I1", s.I1);
        env.setReadout("I2", s.I2);
        env.setReadout("tipo", N2 > N1 ? "elevador" : (N2 < N1 ? "reductor" : "1:1"));
      }

      return { reset: reset, step: step, draw: draw };
    },
  });

  /* ============================================================
     SIM 6 — Relatividad especial (reloj de luz)   [PORT de f3.js]
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SECTION,
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

  /* ============================================================
     SIM 7 — Onda electromagnética plana   [NUEVA]
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SECTION,
    id: "onda-em",
    title: "Onda electromagnética plana",
    refs: "Resumen p.22 (Maxwell / ondas EM)",
    blurb: "Onda plana propagándose en +x: E (rojo, vertical) y B (azul, en profundidad) oscilan en fase y " +
      "perpendiculares entre sí. Arrastrá el knob de amplitud y elegí la longitud de onda λ; f queda fijada por " +
      "c = λf, con c constante.",
    formula: "c = 1/√(μ₀ε₀) = λf   ·   E = E₀cos(kx−ωt)   ·   B = B₀cos(kx−ωt)   ·   E₀/B₀ = c",
    stageHeight: 340,
    controls: [
      { type: "range", key: "lambda", label: "longitud de onda λ", min: 0.5, max: 5, step: 0.1, value: 2, unit: "m", digits: 1 },
    ],
    readouts: [
      { key: "lam", label: "λ", unit: "m", digits: 2 },
      { key: "f", label: "f = c/λ", unit: "Hz", digits: 2 },
      { key: "c", label: "c = λ·f", unit: "m/s", digits: 2 },
    ],
    create: function (env) {
      var PXPM = 80;                       // px por metro (dibujo de λ)
      var amp = 70, phase = 0;             // amp: sim-local (handle); phase: visual
      var gauge = { x: 0, axisY: 0 };

      function reset() { phase = 0; }
      function step(dt) { phase += dt * 2.2; }

      // handle: knob de amplitud (arrastre vertical)
      env.addHandle({
        r: 15,
        x: function () { return gauge.x; },
        y: function () { return gauge.axisY - amp; },
        onDrag: function (px, py) { amp = clamp(gauge.axisY - py, 12, (env.H || 340) * 0.32); },
      });

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params;
        var axisY = H * 0.5, x0 = W * 0.12, x1 = W - 20;
        gauge.x = x0 - 8; gauge.axisY = axisY;
        var lamPx = clamp(p.lambda * PXPM, 30, W);
        var kpx = TAU / lamPx;
        var dB = { x: 0.55, y: 0.34 };     // dirección de "profundidad" para B

        // eje de propagación
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x0, axisY); ctx.lineTo(x1, axisY); ctx.stroke();
        drawArrow(ctx, x1 - 24, axisY, x1, axisY, col.dim, 1.4, 7);
        ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText("x (propagación)", x1 - 96, axisY + 16);

        // stems + curvas E (vertical) y B (profundidad)
        ctx.strokeStyle = col.coral; ctx.lineWidth = 2; ctx.beginPath();
        for (var xa = x0; xa <= x1; xa += 3) {
          var e = amp * Math.cos(kpx * (xa - x0) - phase);
          var yy = axisY - e;
          if (xa === x0) ctx.moveTo(xa, yy); else ctx.lineTo(xa, yy);
        }
        ctx.stroke();
        ctx.strokeStyle = col.blue; ctx.lineWidth = 2; ctx.beginPath();
        for (var xb = x0; xb <= x1; xb += 3) {
          var bb = amp * 0.7 * Math.cos(kpx * (xb - x0) - phase);
          var bx = xb + bb * dB.x, by = axisY + bb * dB.y;
          if (xb === x0) ctx.moveTo(bx, by); else ctx.lineTo(bx, by);
        }
        ctx.stroke();

        // vectores muestra (cada ~λ/4)
        var stepX = Math.max(lamPx / 8, 22);
        for (var xs = x0; xs <= x1 - 6; xs += stepX) {
          var eS = amp * Math.cos(kpx * (xs - x0) - phase);
          var bS = amp * 0.7 * Math.cos(kpx * (xs - x0) - phase);
          drawArrow(ctx, xs, axisY, xs, axisY - eS, "rgba(244,124,89,0.5)", 1, 5);
          drawArrow(ctx, xs, axisY, xs + bS * dB.x, axisY + bS * dB.y, "rgba(146,207,242,0.5)", 1, 5);
        }

        // etiquetas E / B
        ctx.fillStyle = col.coral; ctx.font = "12px ui-monospace, Menlo, monospace";
        ctx.fillText("E", x0 + 4, axisY - amp - 6);
        ctx.fillStyle = col.blue;
        ctx.fillText("B", x0 + amp * dB.x + 6, axisY + amp * dB.y + 12);

        // knob de amplitud (guía vertical)
        ctx.strokeStyle = "rgba(255,255,255,0.16)"; ctx.setLineDash([3, 4]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(gauge.x, axisY); ctx.lineTo(gauge.x, axisY - amp); ctx.stroke();
        ctx.setLineDash([]);

        var f = C_LIGHT / p.lambda;
        env.setReadout("lam", p.lambda);
        env.setReadout("f", f);
        env.setReadout("c", p.lambda * f);
      }

      return { reset: reset, step: step, draw: draw };
    },
  });

})();
