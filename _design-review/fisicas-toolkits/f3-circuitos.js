/* ============================================================
   f3-circuitos.js — Física 3, sección "Circuitos".
   Registra 6 laboratorios interactivos en canvas 2D sobre SimKit,
   todos con tab:"f3" y section:"Circuitos" (el core los agrupa
   bajo un header). No registra el tab (lo hace otro archivo).
   Todos exponen al menos un handle arrastrable (env.addHandle):
   el core hace hit-test, cursor grab/grabbing y dibuja el halo.
   Script clásico, sin módulos, compatible file://.

   Orden:
     1. Ohm y resistividad          (NUEVA)
     2. Fem y resistencia interna   (NUEVA)
     3. Serie, paralelo y mixto     (NUEVA)
     4. Kirchhoff (2 mallas)        (PORT de f3.js + enriquecido)
     5. Capacitores serie/paralelo  (NUEVA)
     6. Capacitor con dieléctrico   (PORT de f3.js tal cual)
   ============================================================ */
(function () {
  "use strict";

  var TAU = Math.PI * 2;

  /* ---------- helpers de dibujo compartidos ---------- */
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

  function mono(ctx, px) { ctx.font = (px || 11) + "px ui-monospace, Menlo, monospace"; }

  // resistor: caja con relleno tenue (horizontal o vertical)
  function resistorSym(ctx, cx, cy, horiz, col) {
    var w = 38, h = 14;
    ctx.fillStyle = "rgba(216,178,121,0.14)";
    ctx.strokeStyle = col.amber; ctx.lineWidth = 2;
    if (horiz) { ctx.fillRect(cx - w / 2, cy - h / 2, w, h); ctx.strokeRect(cx - w / 2, cy - h / 2, w, h); }
    else { ctx.fillRect(cx - h / 2, cy - w / 2, h, w); ctx.strokeRect(cx - h / 2, cy - w / 2, h, w); }
  }

  // capacitor: dos placas paralelas
  function capSym(ctx, cx, cy, horiz, col) {
    ctx.strokeStyle = col.blue; ctx.lineWidth = 3;
    ctx.beginPath();
    if (horiz) {
      ctx.moveTo(cx - 4, cy - 12); ctx.lineTo(cx - 4, cy + 12);
      ctx.moveTo(cx + 4, cy - 12); ctx.lineTo(cx + 4, cy + 12);
    } else {
      ctx.moveTo(cx - 12, cy - 4); ctx.lineTo(cx + 12, cy - 4);
      ctx.moveTo(cx - 12, cy + 4); ctx.lineTo(cx + 12, cy + 4);
    }
    ctx.stroke();
  }

  /* ============================================================
     SIM 1 — Ohm y resistividad  (NUEVA)
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: "Circuitos",
    id: "ohm",
    title: "Ohm y resistividad",
    refs: "Resumen p.15 · Práctica g.2 (2.2, 2.3)",
    blurb: "Estirá el alambre (largo L) y engrosá su sección (área A) con los handles; elegí el material " +
      "y la temperatura. R = ρL/A se recalcula en vivo y el punto operativo recorre la recta V–I de Ohm. " +
      "Los electrones adentro van más rápido cuanto mayor es la corriente (y cuanto más fina la sección).",
    formula: "R = ρL/A   ·   ρ(T) = ρ₀[1 + α(T − 20°)]   ·   V = IR   ·   v_d = I/(nqA)",
    stageHeight: 360,
    controls: [
      { type: "segment", key: "mat", label: "Material", value: "cu", options: [
        ["cu", "Cobre"], ["al", "Aluminio"], ["ni", "Nicrom"]] },
      { type: "range", key: "T", label: "temperatura", min: 0, max: 200, step: 5, value: 20, unit: "°C", digits: 0 },
    ],
    readouts: [
      { key: "R", label: "R = ρL/A", unit: "Ω", digits: 3 },
      { key: "I", label: "corriente I", unit: "A", digits: 2 },
      { key: "P", label: "potencia P", unit: "W", digits: 1 },
      { key: "vd", label: "v_drift", unit: "mm/s", digits: 3 },
      { key: "rho", label: "ρ(T)", unit: "Ω·m", digits: 2 },
    ],
    create: function (env) {
      var E_CH = 1.602e-19;
      // ρ₀ (Ω·m, 20 °C), α (1/°C), n (portadores/m³) — Serway
      var MAT = {
        cu: { rho: 1.68e-8, alpha: 3.9e-3, n: 8.5e28, name: "Cobre" },
        al: { rho: 2.82e-8, alpha: 3.9e-3, n: 1.81e29, name: "Aluminio" },
        ni: { rho: 1.50e-6, alpha: 0.4e-3, n: 8.0e28, name: "Nicrom" },
      };
      var Lm = 1.0;      // largo (m), handle del extremo derecho: 0.2..2.0
      var Amm2 = 2.0;    // sección (mm²), handle de grosor: 0.3..8
      var Vapp = 3.0;    // tensión aplicada (V), handle sobre la recta V–I: 0..VMAX
      var VMAX = 6;
      var NCAR = 26;
      var carriers = [];
      var wire = { x0: 0, x1: 1, yMid: 0, halfPx: 6, Lpx: 1, PPU: 1 };
      var plt = { x0: 0, x1: 1, y0: 0, y1: 1 };

      function mat() { return MAT[env.params.mat] || MAT.cu; }
      function rhoT() { var m = mat(); return m.rho * (1 + m.alpha * (env.params.T - 20)); }
      function areaM2() { return Amm2 * 1e-6; }
      function resistance() { return rhoT() * Lm / areaM2(); }
      function halfFromA(a) { return 4 + (a - 0.3) * 3.9; }   // px de semiespesor
      function aFromHalf(h) { return clamp(0.3 + (h - 4) / 3.9, 0.3, 8); }

      function reset() {
        Lm = 1.0; Amm2 = 2.0; Vapp = 3.0;
        carriers = [];
        for (var i = 0; i < NCAR; i++) carriers.push({ u: Math.random(), y: Math.random() * 2 - 1 });
      }
      reset();

      function step(dt) {
        var I = Vapp / resistance();
        var vd = I / (mat().n * E_CH * areaM2());   // m/s (real)
        // fracción de largo por segundo (visual): sigue a v_drift (∝ I / A)
        var frac = clamp(vd * 34, 0, 1.8);
        for (var i = 0; i < carriers.length; i++) {
          carriers[i].u -= frac * dt;               // electrones van contra I (hacia el +)
          if (carriers[i].u < 0) { carriers[i].u += 1; carriers[i].y = Math.random() * 2 - 1; }
        }
      }

      // handle: extremo derecho → largo L
      env.addHandle({
        r: 16,
        x: function () { return wire.x1; },
        y: function () { return wire.yMid; },
        onDrag: function (px) { Lm = clamp((px - wire.x0) / (wire.PPU || 1), 0.2, 2.0); },
      });
      // handle: borde superior (mitad) → grosor / área A
      env.addHandle({
        r: 15,
        x: function () { return wire.x0 + wire.Lpx / 2; },
        y: function () { return wire.yMid - wire.halfPx; },
        onDrag: function (px, py) { Amm2 = aFromHalf(clamp(wire.yMid - py, 4, 34)); },
      });
      // handle: punto operativo sobre la recta V–I → tensión aplicada
      env.addHandle({
        r: 13,
        x: function () { return plt.x0 + Vapp / VMAX * (plt.x1 - plt.x0); },
        y: function () { return plt.y1 - Vapp / VMAX * (plt.y1 - plt.y0); },
        onDrag: function (px, py) {
          Vapp = clamp((plt.y1 - py) / ((plt.y1 - plt.y0) || 1), 0, 1) * VMAX;
        },
      });

      function draw(ctx, W, H) {
        var col = env.colors;
        var R = resistance(), I = Vapp / R, P = Vapp * I;
        var vd = I / (mat().n * E_CH * areaM2());

        // ---- layout ----
        var leftW = W * 0.56;
        var x0 = 64, availLen = Math.max(leftW - x0 - 34, 60);
        var PPU = availLen / 2.0;
        var Lpx = Lm * PPU;
        var yMid = H * 0.34, yBot = H * 0.70;
        var halfPx = halfFromA(Amm2);
        wire.x0 = x0; wire.PPU = PPU; wire.Lpx = Lpx; wire.x1 = x0 + Lpx;
        wire.yMid = yMid; wire.halfPx = halfPx;

        // ---- batería + lazo ----
        var bx = 28, byc = (yMid + yBot) / 2;
        ctx.strokeStyle = col.dim; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx, yMid); ctx.lineTo(x0, yMid);                 // lead + al extremo izq
        ctx.moveTo(wire.x1, yMid); ctx.lineTo(wire.x1 + 20, yMid);  // vuelta derecha
        ctx.lineTo(wire.x1 + 20, yBot); ctx.lineTo(bx, yBot);       // riel inferior
        ctx.stroke();
        ctx.strokeStyle = col.coral; ctx.lineWidth = 3;             // placa + (larga)
        ctx.beginPath(); ctx.moveTo(bx - 11, byc - 8); ctx.lineTo(bx + 11, byc - 8); ctx.stroke();
        ctx.strokeStyle = col.blue; ctx.lineWidth = 6;              // placa − (corta)
        ctx.beginPath(); ctx.moveTo(bx - 7, byc + 8); ctx.lineTo(bx + 7, byc + 8); ctx.stroke();
        ctx.strokeStyle = col.dim; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx, byc - 8); ctx.lineTo(bx, yMid);
        ctx.moveTo(bx, byc + 8); ctx.lineTo(bx, yBot); ctx.stroke();
        ctx.fillStyle = col.dim; mono(ctx, 11);
        ctx.fillText("V=" + Vapp.toFixed(1) + "V", bx - 10, byc + 30);

        // ---- alambre (resistor) ----
        ctx.fillStyle = "rgba(216,178,121,0.16)";
        ctx.strokeStyle = col.amber; ctx.lineWidth = 2;
        ctx.fillRect(x0, yMid - halfPx, Lpx, halfPx * 2);
        ctx.strokeRect(x0, yMid - halfPx, Lpx, halfPx * 2);
        // caps de terminal (+ izq, − der)
        ctx.fillStyle = col.coral; ctx.fillRect(x0 - 3, yMid - halfPx, 3, halfPx * 2);
        ctx.fillStyle = col.blue; ctx.fillRect(wire.x1, yMid - halfPx, 3, halfPx * 2);

        // electrones adentro
        if (Lpx > 6) {
          for (var i = 0; i < carriers.length; i++) {
            var ex = x0 + carriers[i].u * Lpx;
            var ey = yMid + carriers[i].y * Math.max(halfPx - 3, 1);
            dot(ctx, ex, ey, 2.1, "rgba(146,207,242,0.85)");
          }
        }

        // corriente convencional (arriba, → ) y deriva de e⁻ (abajo, ← )
        var Iw = clamp(Math.log10(1 + I) * 2 + 1.4, 1.4, 6);
        var arrLen = Math.min(Lpx - 8, 70);
        if (arrLen > 10) {
          drawArrow(ctx, x0 + 6, yMid - halfPx - 13, x0 + 6 + arrLen, yMid - halfPx - 13, col.teal, Iw, 7);
          ctx.fillStyle = col.teal; mono(ctx, 11);
          ctx.fillText("I", x0 + 6 + arrLen + 6, yMid - halfPx - 9);
          ctx.fillStyle = col.blue; ctx.fillText("e⁻ ←", x0 + 6, yMid + halfPx + 18);
        }

        // etiquetas L / A
        ctx.fillStyle = col.dim; mono(ctx, 11);
        ctx.fillText("L = " + Lm.toFixed(2) + " m", x0 + 4, yBot + 16);
        ctx.fillText("A = " + Amm2.toFixed(1) + " mm²", x0 + 4, yBot + 32);
        ctx.fillStyle = col.amber;
        ctx.fillText(mat().name + "   ρ(T)=" + rhoT().toExponential(2) + " Ω·m", x0 + 4, yBot + 48);

        // ---- recta V–I ----
        var px0 = leftW + 46, px1 = W - 16, py0 = 26, py1 = H - 34;
        plt.x0 = px0; plt.x1 = px1; plt.y0 = py0; plt.y1 = py1;
        var Imax = VMAX / R;   // eje I: la recta va esquina a esquina, pendiente = R
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px0, py0); ctx.lineTo(px0, py1); ctx.lineTo(px1, py1); ctx.stroke();
        ctx.fillStyle = col.dim; mono(ctx, 10);
        ctx.fillText("V (V)", px0 - 2, py0 - 8);
        ctx.fillText("I (A)", px1 - 28, py1 + 16);
        ctx.fillText(VMAX.toFixed(0), px0 - 20, py0 + 6);
        ctx.fillText("0", px0 - 10, py1 + 3);
        ctx.fillText(Imax >= 100 ? Imax.toFixed(0) : Imax.toFixed(2), px1 - 30, py1 + 16 - 12);
        // recta Ohm
        ctx.strokeStyle = col.teal; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(px0, py1); ctx.lineTo(px1, py0); ctx.stroke();
        ctx.fillStyle = col.teal; mono(ctx, 10);
        ctx.fillText("pendiente = R = " + R.toFixed(3) + " Ω", px0 + 6, py0 + 12);
        // punto operativo
        var opx = px0 + Vapp / VMAX * (px1 - px0), opy = py1 - Vapp / VMAX * (py1 - py0);
        ctx.strokeStyle = "rgba(244,124,89,0.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(opx, py1); ctx.lineTo(opx, opy);
        ctx.moveTo(px0, opy); ctx.lineTo(opx, opy); ctx.stroke();
        dot(ctx, opx, opy, 4.5, col.coral);

        env.setReadout("R", R);
        env.setReadout("I", I);
        env.setReadout("P", P);
        env.setReadout("vd", vd * 1000);
        env.setReadout("rho", rhoT());
      }

      function onControl() {}
      return { reset: reset, step: step, draw: draw, onControl: onControl };
    },
  });

  /* ============================================================
     SIM 2 — Fem y resistencia interna  (NUEVA)
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: "Circuitos",
    id: "femr",
    title: "Fem y resistencia interna",
    refs: "Resumen p.16 · Práctica g.2",
    blurb: "Una pila real: fem ε con resistencia interna r alimentando una carga R. Arrastrá el punto " +
      "operativo sobre la curva P(R) para barrer la carga; la recta V_term(I) es la característica de la " +
      "pila. La transferencia de potencia es máxima cuando R = r (marcado en la curva).",
    formula: "I = ε/(R+r)   ·   V_term = ε − Ir = εR/(R+r)   ·   P = I²R   ·   P_máx en R=r   ·   η = R/(R+r)",
    stageHeight: 340,
    controls: [
      { type: "range", key: "e", label: "fem ε", min: 1, max: 24, step: 0.5, value: 12, unit: "V", digits: 1 },
      { type: "range", key: "r", label: "resistencia interna r", min: 0.2, max: 5, step: 0.1, value: 1, unit: "Ω", digits: 1 },
    ],
    readouts: [
      { key: "vt", label: "V_terminal", unit: "V", digits: 2 },
      { key: "i", label: "corriente I", unit: "A", digits: 2 },
      { key: "p", label: "P en R", unit: "W", digits: 2 },
      { key: "eta", label: "η rendimiento", unit: "%", digits: 0 },
    ],
    create: function (env) {
      var Rload = 2.0;
      var pP = { x0: 0, x1: 1, y0: 0, y1: 1, Rmax: 20, Pfull: 1 };

      function vals() {
        var e = env.params.e, r = env.params.r, R = Rload;
        var I = e / (R + r), Vt = e - I * r, P = I * I * R, eta = R / (R + r);
        return { e: e, r: r, R: R, I: I, Vt: Vt, P: P, eta: eta };
      }
      function pcurve(R) { var e = env.params.e, r = env.params.r; return e * e * R / ((R + r) * (R + r)); }

      function reset() { Rload = Math.max(env.params.r, 2.0); }

      // handle: punto operativo sobre P(R) → carga R
      env.addHandle({
        r: 13,
        x: function () { return pP.x0 + clamp(Rload / pP.Rmax, 0, 1) * (pP.x1 - pP.x0); },
        y: function () { return pP.y1 - clamp(pcurve(Rload) / pP.Pfull, 0, 1) * (pP.y1 - pP.y0); },
        onDrag: function (px) {
          Rload = clamp((px - pP.x0) / ((pP.x1 - pP.x0) || 1) * pP.Rmax, 0.05, pP.Rmax);
        },
      });

      function draw(ctx, W, H) {
        var col = env.colors, e = env.params.e, r = env.params.r;
        var Rmax = clamp(8 * r, 10, 40);
        Rload = clamp(Rload, 0.05, Rmax);
        var s = vals();

        // ===== izquierda: recta V_term(I) (característica de la pila) =====
        var ax0 = 50, ax1 = W * 0.46, ay0 = 26, ay1 = H - 40;
        var Isc = e / r;
        function LX(I) { return ax0 + clamp(I / Isc, 0, 1) * (ax1 - ax0); }
        function LY(V) { return ay1 - clamp(V / e, 0, 1) * (ay1 - ay0); }
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ax0, ay0); ctx.lineTo(ax0, ay1); ctx.lineTo(ax1, ay1); ctx.stroke();
        ctx.fillStyle = col.dim; mono(ctx, 10);
        ctx.fillText("V_term (V)", ax0 - 2, ay0 - 8);
        ctx.fillText("I (A)", ax1 - 28, ay1 + 16);
        ctx.fillText("ε=" + e.toFixed(1), ax0 - 40, ay0 + 6);
        ctx.fillText("I_cc=" + Isc.toFixed(1), ax1 - 54, ay1 + 16 - 12);
        // recta (0,ε) → (Isc,0)
        ctx.strokeStyle = col.coral; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(LX(0), LY(e)); ctx.lineTo(LX(Isc), LY(0)); ctx.stroke();
        // marca R=r  (I=ε/2r, V=ε/2)
        var Irr = e / (2 * r);
        ctx.strokeStyle = "rgba(146,207,242,0.5)"; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(LX(Irr), ay1); ctx.lineTo(LX(Irr), LY(e / 2)); ctx.stroke(); ctx.setLineDash([]);
        // punto operativo
        var lx = LX(s.I), ly = LY(s.Vt);
        ctx.strokeStyle = "rgba(244,124,89,0.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(lx, ay1); ctx.lineTo(lx, ly); ctx.moveTo(ax0, ly); ctx.lineTo(lx, ly); ctx.stroke();
        dot(ctx, lx, ly, 4.5, col.coral);
        ctx.fillStyle = col.dim; mono(ctx, 10);
        ctx.fillText("caída interna Ir = " + (s.I * r).toFixed(2) + " V", ax0 + 6, ay0 + 12);

        // ===== derecha: curva P(R), pico en R=r =====
        var bx0 = W * 0.54, bx1 = W - 18, by0 = 26, by1 = H - 40;
        var Ppeak = e * e / (4 * r), Pfull = Ppeak * 1.14;
        pP.x0 = bx0; pP.x1 = bx1; pP.y0 = by0; pP.y1 = by1; pP.Rmax = Rmax; pP.Pfull = Pfull;
        function PX(R) { return bx0 + clamp(R / Rmax, 0, 1) * (bx1 - bx0); }
        function PY(P) { return by1 - clamp(P / Pfull, 0, 1) * (by1 - by0); }
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(bx0, by0); ctx.lineTo(bx0, by1); ctx.lineTo(bx1, by1); ctx.stroke();
        ctx.fillStyle = col.dim; mono(ctx, 10);
        ctx.fillText("P en R (W)", bx0 - 2, by0 - 8);
        ctx.fillText("R (Ω)", bx1 - 30, by1 + 16);
        ctx.fillText(Ppeak.toFixed(1), bx0 - 34, by0 + 6);
        ctx.fillText(Rmax.toFixed(0), bx1 - 14, by1 + 16);
        // curva
        var N = 120;
        ctx.strokeStyle = col.teal; ctx.lineWidth = 2; ctx.beginPath();
        for (var k = 0; k <= N; k++) {
          var Rk = k / N * Rmax, xx = PX(Rk), yy = PY(pcurve(Rk));
          if (k === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
        // pico en R=r
        ctx.strokeStyle = "rgba(146,207,242,0.55)"; ctx.setLineDash([4, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(PX(r), by1); ctx.lineTo(PX(r), PY(Ppeak)); ctx.stroke(); ctx.setLineDash([]);
        dot(ctx, PX(r), PY(Ppeak), 3.5, col.blue);
        ctx.fillStyle = col.blue; mono(ctx, 10);
        ctx.fillText("R=r (P_máx)", PX(r) + 4, PY(Ppeak) - 4);
        // punto operativo
        var opx = PX(Rload), opy = PY(s.P);
        ctx.strokeStyle = "rgba(244,124,89,0.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(opx, by1); ctx.lineTo(opx, opy); ctx.stroke();
        dot(ctx, opx, opy, 4.5, col.coral);
        ctx.fillStyle = col.coral; mono(ctx, 10);
        ctx.fillText("R = " + Rload.toFixed(2) + " Ω", opx + 6, opy + 14);

        env.setReadout("vt", s.Vt);
        env.setReadout("i", s.I);
        env.setReadout("p", s.P);
        env.setReadout("eta", s.eta * 100);
      }

      return { reset: reset, draw: draw };
    },
  });

  /* ============================================================
     SIM — Kirchhoff (la card Serie/paralelo fue subsumida por el sandbox)
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: "Circuitos",
    id: "kirchhoff",
    title: "Kirchhoff — circuito de 2 mallas",
    refs: "Resumen p.16–17 · Práctica g.2 (2.14, 2.16)",
    blurb: "El caso típico de la práctica: 2 fem y 3 resistencias en dos mallas. Elegí la topología " +
      "(ε₂ en el mismo sentido o invertida), movē los sliders y las corrientes se resuelven en vivo " +
      "(flechas ∝ |i|, coloreadas por sentido). Arrastrá el multímetro sobre una rama; activá el " +
      "toggle para superponer el sistema de ecuaciones con los valores vivos.",
    formula: "Nodo: i₁+i₂=i₃   ·   ε₁=i₁R₁+i₃R₃   ·   ±ε₂=i₂R₂+i₃R₃",
    stageHeight: 360,
    controls: [
      { type: "segment", key: "topo", label: "Topología", value: "std", options: [
        ["std", "ε₂ →"], ["opp", "ε₂ ← (opuesta)"]] },
      { type: "range", key: "e1", label: "ε₁", min: 0, max: 24, step: 1, value: 12, unit: "V", digits: 0 },
      { type: "range", key: "e2", label: "ε₂", min: 0, max: 24, step: 1, value: 6, unit: "V", digits: 0 },
      { type: "range", key: "R1", label: "R₁", min: 1, max: 20, step: 1, value: 4, unit: "Ω", digits: 0 },
      { type: "range", key: "R2", label: "R₂", min: 1, max: 20, step: 1, value: 6, unit: "Ω", digits: 0 },
      { type: "range", key: "R3", label: "R₃", min: 1, max: 20, step: 1, value: 3, unit: "Ω", digits: 0 },
      { type: "toggle", key: "eqs", label: "Mostrar sistema de ecuaciones", value: false },
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
        var s2 = p.topo === "opp" ? -1 : 1;
        var e2 = s2 * p.e2;
        var R1 = p.R1, R2 = p.R2, R3 = p.R3;
        var det = (R1 + R3) * (R2 + R3) - R3 * R3;
        var i1 = (p.e1 * (R2 + R3) - e2 * R3) / det;
        var i2 = ((R1 + R3) * e2 - R3 * p.e1) / det;
        var i3 = i1 + i2;
        var res1 = p.e1 - i1 * R1 - i3 * R3;
        var res2 = e2 - i2 * R2 - i3 * R3;
        return { i1: i1, i2: i2, i3: i3, e2: e2, s2: s2, res: Math.max(Math.abs(res1), Math.abs(res2)) };
      }

      function reset() { needInit = true; }
      function initProbe() { probe.x = (env.W || 600) * 0.5; probe.y = (env.H || 360) * 0.5; needInit = false; }

      env.addHandle({
        r: 18,
        x: function () { return probe.x; },
        y: function () { return probe.y; },
        onDrag: function (px, py) {
          probe.x = clamp(px, 6, (env.W || 600) - 6);
          probe.y = clamp(py, 6, (env.H || 360) - 6);
        },
      });

      function resistor(ctx, x, y, label, col) {
        ctx.fillStyle = "rgba(216,178,121,0.14)";
        ctx.strokeStyle = col.amber; ctx.lineWidth = 2;
        ctx.fillRect(x - 6, y - 17, 12, 34); ctx.strokeRect(x - 6, y - 17, 12, 34);
        ctx.fillStyle = col.amber; mono(ctx, 11);
        ctx.fillText(label, x + 10, y + 4);
      }
      // batería vertical; up=true → placa + arriba
      function battery(ctx, x, y, label, col, up) {
        ctx.strokeStyle = col.coral; ctx.lineWidth = 3;
        var sgn = up ? -1 : 1;
        ctx.beginPath(); ctx.moveTo(x, y + sgn * 10); ctx.lineTo(x, y + sgn * 2); ctx.stroke(); // lead a placa +
        ctx.beginPath(); ctx.moveTo(x - 9, y + sgn * 2); ctx.lineTo(x + 9, y + sgn * 2); ctx.stroke(); // placa + (larga)
        ctx.strokeStyle = col.blue; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(x - 5, y - sgn * 4); ctx.lineTo(x + 5, y - sgn * 4); ctx.stroke(); // placa − (corta)
        ctx.fillStyle = col.dim; mono(ctx, 11);
        ctx.fillText(label, x + 8, y - 12);
      }

      function draw(ctx, W, H) {
        if (needInit && W > 0) initProbe();
        var col = env.colors, p = env.params, s = solve();
        var xl = W * 0.16, xm = W * 0.5, xr = W * 0.84, yt = H * 0.20, yb = H * 0.74, ym = (yt + yb) / 2;

        mids.b1.x = xl; mids.b1.y = ym;
        mids.b2.x = xr; mids.b2.y = ym;
        mids.b3.x = xm; mids.b3.y = ym;

        ctx.strokeStyle = col.dim; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xl, yt); ctx.lineTo(xr, yt);
        ctx.moveTo(xl, yb); ctx.lineTo(xr, yb);
        ctx.moveTo(xl, yt); ctx.lineTo(xl, yb);
        ctx.moveTo(xr, yt); ctx.lineTo(xr, yb);
        ctx.moveTo(xm, yt); ctx.lineTo(xm, yb);
        ctx.stroke();

        dot(ctx, xm, yt, 4, col.text); dot(ctx, xm, yb, 4, col.text);
        ctx.fillStyle = col.dim; mono(ctx, 11);
        ctx.fillText("a", xm + 6, yt - 4); ctx.fillText("b", xm + 6, yb + 14);

        battery(ctx, xl, ym - 26, "ε₁=" + p.e1 + "V", col, true);
        resistor(ctx, xl, ym + 26, "R₁", col);
        battery(ctx, xr, ym - 26, "ε₂=" + p.e2 + "V", col, s.s2 > 0);   // invierte con topología opuesta
        resistor(ctx, xr, ym + 26, "R₂", col);
        resistor(ctx, xm, ym, "R₃", col);

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
        ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(best.m.x, best.m.y, 20, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = col.text; mono(ctx, 11);
        ctx.fillText(best.name + ": i=" + best.i.toFixed(3) + " A", probe.x + 14, probe.y - 6);
        ctx.fillStyle = col.dim;
        ctx.fillText("ΔV=" + (best.i * best.R).toFixed(2) + " V", probe.x + 14, probe.y + 10);

        // verificación de Kirchhoff
        ctx.fillStyle = s.res < 1e-6 ? col.teal : col.red; mono(ctx, 11);
        ctx.fillText(s.res < 1e-6 ? "ΣV = 0 en ambas mallas ✓" : "ΣV ≠ 0 (revisar)", xl, yb + 30);

        // overlay del sistema de ecuaciones
        if (p.eqs) {
          var e2 = s.e2;
          var lines = [
            "Nodo a:   i₁ + i₂ = i₃",
            "Malla 1:  ε₁ = i₁R₁ + i₃R₃",
            "          " + p.e1 + " = " + s.i1.toFixed(2) + "·" + p.R1 + " + " + s.i3.toFixed(2) + "·" + p.R3,
            "Malla 2:  ε₂ = i₂R₂ + i₃R₃",
            "          " + e2 + " = " + s.i2.toFixed(2) + "·" + p.R2 + " + " + s.i3.toFixed(2) + "·" + p.R3,
          ];
          var boxX = W - 300, boxY = 12, boxW = 288, boxH = 20 + lines.length * 18;
          if (boxX < xr + 24) boxX = xr + 24;
          ctx.fillStyle = "rgba(20,10,4,0.82)";
          ctx.fillRect(boxX, boxY, boxW, boxH);
          ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 1;
          ctx.strokeRect(boxX, boxY, boxW, boxH);
          mono(ctx, 11);
          for (var li = 0; li < lines.length; li++) {
            ctx.fillStyle = (li === 0 || lines[li].indexOf("Malla") >= 0) ? col.teal : col.text;
            ctx.fillText(lines[li], boxX + 10, boxY + 20 + li * 18);
          }
        }

        env.setReadout("i1", s.i1);
        env.setReadout("i2", s.i2);
        env.setReadout("i3", s.i3);
        env.setReadout("ver", Math.abs(s.res) < 1e-9 ? 0 : s.res);
      }

      function onControl() {}
      return { reset: reset, draw: draw, onControl: onControl };
    },
  });

  /* ============================================================
     SIM 5 — Capacitores en serie y paralelo  (NUEVA)
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: "Circuitos",
    id: "caps",
    title: "Capacitores en serie y paralelo",
    refs: "Resumen p.18–19 · Práctica g.3 (3.2)",
    blurb: "Tres capacitores en serie, paralelo o mixto conectados a una fuente. Arrastrá el dial de la " +
      "batería para fijar V. C_eq se arma paso a paso; las barras muestran la carga Q y la tensión V de " +
      "cada capacitor (en serie Q es común; en paralelo V es común) y el readout la energía total.",
    formula: "paralelo: C_eq=ΣC (V común)   ·   serie: 1/C_eq=Σ1/C (Q común)   ·   Q=CV   ·   U=½C_eqV²",
    stageHeight: 360,
    controls: [
      { type: "segment", key: "topo", label: "Topología", value: "par", options: [
        ["par", "Paralelo"], ["ser", "Serie"], ["mix", "Mixto"]] },
      { type: "range", key: "C1", label: "C₁", min: 1, max: 20, step: 0.5, value: 6, unit: "µF", digits: 1 },
      { type: "range", key: "C2", label: "C₂", min: 1, max: 20, step: 0.5, value: 3, unit: "µF", digits: 1 },
      { type: "range", key: "C3", label: "C₃", min: 1, max: 20, step: 0.5, value: 2, unit: "µF", digits: 1 },
    ],
    readouts: [
      { key: "ceq", label: "C_eq", unit: "µF", digits: 2 },
      { key: "qt", label: "Q total", unit: "µC", digits: 1 },
      { key: "v", label: "tensión V", unit: "V", digits: 1 },
      { key: "u", label: "energía U", unit: "µJ", digits: 0 },
    ],
    create: function (env) {
      var Vb = 10, VMAX = 20;
      var knob = { x: 0, y0: 0, y1: 1 };

      function solve() {
        var p = env.params, C1 = p.C1 * 1e-6, C2 = p.C2 * 1e-6, C3 = p.C3 * 1e-6, V = Vb;
        if (p.topo === "par") {
          var Ceq = C1 + C2 + C3;
          return { Ceq: Ceq, Qt: Ceq * V, per: [
            { C: C1, V: V, Q: C1 * V }, { C: C2, V: V, Q: C2 * V }, { C: C3, V: V, Q: C3 * V }],
            steps: [
              "C_eq = C₁+C₂+C₃",
              "    = " + p.C1 + "+" + p.C2 + "+" + p.C3 + " = " + (Ceq * 1e6).toFixed(1) + " µF",
              "V común;  Qₖ = Cₖ·V"] };
        } else if (p.topo === "ser") {
          var Ceq2 = 1 / (1 / C1 + 1 / C2 + 1 / C3), Q = Ceq2 * V;
          return { Ceq: Ceq2, Qt: Q, per: [
            { C: C1, V: Q / C1, Q: Q }, { C: C2, V: Q / C2, Q: Q }, { C: C3, V: Q / C3, Q: Q }],
            steps: [
              "1/C_eq = 1/C₁+1/C₂+1/C₃",
              "C_eq = " + (Ceq2 * 1e6).toFixed(2) + " µF",
              "Q común = " + (Q * 1e6).toFixed(1) + " µC;  Vₖ = Q/Cₖ"] };
        } else {
          var C23 = C2 + C3, Ceq3 = C1 * C23 / (C1 + C23), Q1 = Ceq3 * V, Vp = Q1 / C23;
          return { Ceq: Ceq3, Qt: Q1, per: [
            { C: C1, V: Q1 / C1, Q: Q1 }, { C: C2, V: Vp, Q: C2 * Vp }, { C: C3, V: Vp, Q: C3 * Vp }],
            steps: [
              "C₂∥C₃ = C₂+C₃ = " + (C23 * 1e6).toFixed(1) + " µF",
              "C_eq = C₁·(C₂∥C₃)/(C₁+C₂∥C₃) = " + (Ceq3 * 1e6).toFixed(2) + " µF",
              "Q₁ común; V_par = " + Vp.toFixed(2) + " V"] };
        }
      }

      function reset() { Vb = 10; }

      // handle: dial de la batería (vertical) → V
      env.addHandle({
        r: 15,
        x: function () { return knob.x; },
        y: function () { return knob.y1 - Vb / VMAX * (knob.y1 - knob.y0); },
        onDrag: function (px, py) {
          Vb = clamp((knob.y1 - py) / ((knob.y1 - knob.y0) || 1), 0, 1) * VMAX;
        },
      });

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params, s = solve();
        var U = 0.5 * s.Ceq * Vb * Vb;

        // ===== dial de batería (izquierda) =====
        knob.x = 54; knob.y0 = H * 0.16; knob.y1 = H * 0.72;
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(knob.x, knob.y0); ctx.lineTo(knob.x, knob.y1); ctx.stroke();
        var ky = knob.y1 - Vb / VMAX * (knob.y1 - knob.y0);
        ctx.strokeStyle = col.coral; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(knob.x, knob.y1); ctx.lineTo(knob.x, ky); ctx.stroke();
        // glifo de batería + label
        ctx.strokeStyle = col.coral; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(knob.x - 11, knob.y1 + 14); ctx.lineTo(knob.x + 11, knob.y1 + 14); ctx.stroke();
        ctx.strokeStyle = col.blue; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(knob.x - 7, knob.y1 + 24); ctx.lineTo(knob.x + 7, knob.y1 + 24); ctx.stroke();
        ctx.fillStyle = col.text; mono(ctx, 12);
        ctx.fillText("V = " + Vb.toFixed(1) + " V", knob.x - 18, knob.y0 - 10);

        // ===== esquema compacto de la topología =====
        var sx = 120, sxR = W * 0.44, sT = H * 0.22, sB = H * 0.62, sm = (sT + sB) / 2;
        ctx.strokeStyle = col.dim; ctx.lineWidth = 2;
        if (p.topo === "par") {
          ctx.beginPath();
          ctx.moveTo(sx, sT); ctx.lineTo(sxR, sT);
          ctx.moveTo(sx, sB); ctx.lineTo(sxR, sB); ctx.stroke();
          var frp = [0.28, 0.55, 0.82];
          for (var b = 0; b < 3; b++) {
            var xb = sx + frp[b] * (sxR - sx);
            ctx.strokeStyle = col.dim; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(xb, sT); ctx.lineTo(xb, sB); ctx.stroke();
            capSym(ctx, xb, sm, false, col);
            ctx.fillStyle = col.blue; mono(ctx, 10); ctx.fillText("C" + (b + 1), xb + 14, sm);
          }
        } else if (p.topo === "ser") {
          var frs = [0.2, 0.5, 0.8];
          ctx.beginPath(); ctx.moveTo(sx, sm); ctx.lineTo(sxR, sm); ctx.stroke();
          for (var c = 0; c < 3; c++) {
            var xc = sx + frs[c] * (sxR - sx);
            capSym(ctx, xc, sm, true, col);
            ctx.fillStyle = col.blue; mono(ctx, 10); ctx.fillText("C" + (c + 1), xc - 8, sm - 18);
          }
        } else {
          var xM = sx + 0.4 * (sxR - sx);
          ctx.beginPath(); ctx.moveTo(sx, sm); ctx.lineTo(xM, sm); ctx.stroke();
          capSym(ctx, (sx + xM) / 2, sm, true, col);
          ctx.fillStyle = col.blue; mono(ctx, 10); ctx.fillText("C1", (sx + xM) / 2 - 8, sm - 18);
          ctx.strokeStyle = col.dim; ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(xM, sT); ctx.lineTo(xM, sB);
          ctx.moveTo(sxR, sT); ctx.lineTo(sxR, sB);
          ctx.moveTo(xM, sT); ctx.lineTo(sxR, sT);
          ctx.moveTo(xM, sB); ctx.lineTo(sxR, sB); ctx.stroke();
          capSym(ctx, xM, sm, false, col);
          capSym(ctx, sxR, sm, false, col);
          ctx.fillStyle = col.blue; mono(ctx, 10);
          ctx.fillText("C2", xM + 14, sm); ctx.fillText("C3", sxR + 12, sm);
        }

        // ===== barras Q y V por capacitor =====
        var gx0 = W * 0.5, gx1 = W - 20, gyB = H * 0.66, gyT = H * 0.14;
        var Qmax = Math.max(s.per[0].Q, s.per[1].Q, s.per[2].Q, 1e-12);
        var slotW = (gx1 - gx0) / 3;
        ctx.strokeStyle = col.grid; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(gx0, gyB); ctx.lineTo(gx1, gyB); ctx.stroke();
        // leyenda
        ctx.fillStyle = col.teal; ctx.fillRect(gx0, gyT - 12, 9, 3);
        ctx.fillStyle = col.dim; mono(ctx, 10); ctx.fillText("Q", gx0 + 13, gyT - 9);
        ctx.fillStyle = col.blue; ctx.fillRect(gx0 + 40, gyT - 12, 9, 3);
        ctx.fillStyle = col.dim; ctx.fillText("V", gx0 + 53, gyT - 9);
        for (var k = 0; k < 3; k++) {
          var cx = gx0 + (k + 0.5) * slotW;
          var qh = (s.per[k].Q / Qmax) * (gyB - gyT);
          var vh = (s.per[k].V / VMAX) * (gyB - gyT);
          ctx.fillStyle = "rgba(47,159,143,0.85)";
          ctx.fillRect(cx - 16, gyB - qh, 14, qh);
          ctx.fillStyle = "rgba(146,207,242,0.8)";
          ctx.fillRect(cx + 2, gyB - vh, 14, vh);
          ctx.fillStyle = col.text; mono(ctx, 11);
          ctx.fillText("C" + (k + 1), cx - 8, gyB + 16);
          ctx.fillStyle = col.dim; mono(ctx, 10);
          ctx.fillText("Q=" + (s.per[k].Q * 1e6).toFixed(1) + "µC", cx - 24, gyB + 30);
          ctx.fillText("V=" + s.per[k].V.toFixed(1) + "V", cx - 20, gyB + 43);
        }

        // ===== desglose paso a paso (abajo) =====
        var ty = H * 0.80;
        ctx.fillStyle = col.teal; mono(ctx, 11);
        ctx.fillText("C_eq paso a paso:", 20, ty);
        ctx.fillStyle = col.text; mono(ctx, 11);
        for (var t = 0; t < s.steps.length; t++) ctx.fillText(s.steps[t], 20, ty + 18 + t * 18);
        ctx.fillStyle = col.amber; mono(ctx, 11);
        ctx.fillText("U_total = ½·C_eq·V² = " + (U * 1e6).toFixed(0) + " µJ", W * 0.5, ty);

        env.setReadout("ceq", s.Ceq * 1e6);
        env.setReadout("qt", s.Qt * 1e6);
        env.setReadout("v", Vb);
        env.setReadout("u", U * 1e6);
      }

      function onControl() {}
      return { reset: reset, draw: draw, onControl: onControl };
    },
  });

  /* ============================================================
     SIM 6 — Capacitor con dieléctrico  (PORT de f3.js tal cual)
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: "Circuitos",
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
          ctx.fillStyle = col.dim; mono(ctx, 11);
          ctx.fillText(p.V.toFixed(1) + " V", wx - 34, yMid + 3);
        } else {
          ctx.strokeStyle = col.dim; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(wx, yTop); ctx.lineTo(wx, yMid - 10); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(wx, yMid + 12); ctx.lineTo(wx, yBot); ctx.stroke();
          ctx.strokeStyle = col.amber; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(wx, yMid - 10); ctx.lineTo(wx + 8, yMid + 8); ctx.stroke();
          dot(ctx, wx, yMid - 10, 2.5, col.amber); dot(ctx, wx, yMid + 12, 2.5, col.amber);
          ctx.fillStyle = col.amber; mono(ctx, 10);
          ctx.fillText("aislado", wx - 30, yMid + 30);
        }

        // dieléctrico insertado
        if (insPx > 1) {
          ctx.fillStyle = "rgba(146,207,242,0.16)";
          ctx.fillRect(x0, yTop + 2, insPx, (yBot - yTop) - 4);
          ctx.strokeStyle = col.blue; ctx.lineWidth = 1.4;
          ctx.strokeRect(x0, yTop + 2, insPx, (yBot - yTop) - 4);
          ctx.fillStyle = col.blue; mono(ctx, 11);
          ctx.fillText("κ = " + p.k.toFixed(1), x0 + 8, yMid + 4);
          ctx.fillStyle = "rgba(146,207,242,0.9)"; mono(ctx, 10);
          for (var bx = x0 + 10; bx < x0 + insPx - 4; bx += 18) {
            ctx.fillText("−", bx, yTop + 12); ctx.fillText("+", bx, yBot - 4);
          }
        }

        // campo E entre placas
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
        ctx.fillStyle = col.coral; mono(ctx, 12);
        ctx.fillText("+", x1 + 6, yTop + 4);
        ctx.fillStyle = col.blue; ctx.fillText("−", x1 + 6, yBot + 4);
        ctx.fillStyle = col.dim; mono(ctx, 10);
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

})();
