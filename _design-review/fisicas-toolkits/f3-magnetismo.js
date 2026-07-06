/* ============================================================
   f3-magnetismo.js — Física 3, sección
   "Magnetismo: Lorentz, Biot-Savart y Ampère".
   Registra 6 laboratorios interactivos en canvas 2D sobre SimKit,
   todos con tab:"f3" y section:"Magnetismo: Lorentz, Biot-Savart y Ampère".
   La pestaña F3 la registra otro archivo (registerTab).
   Todos exponen al menos un handle arrastrable (env.addHandle):
   el core hace hit-test, cursor grab/grabbing y dibuja el halo.

   Portes desde f3.js (fuente de referencia): ciclotrón, sonda de
   Biot-Savart (enriquecida con "dos hilos ∥") y motor DC.
   Nuevos: selector+espectrómetro, ley de Ampère y barra sobre rieles.
   Script clásico, sin módulos, compatible file://.
   ============================================================ */
(function () {
  "use strict";

  var PAL = (window.SimKit && window.SimKit.colors) || {};
  var TAU = Math.PI * 2;
  var MU0 = 4 * Math.PI * 1e-7;
  var SEC = "Magnetismo: Lorentz, Biot-Savart y Ampère";

  /* ---------- helpers de dibujo (locales a este archivo) ---------- */
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  // flecha con cabeza controlable (vectores chicos/decorativos);
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

  // símbolo de campo perpendicular a la pantalla: ⊙ (sale) / ⊗ (entra)
  function drawSym(ctx, x, y, out, color, rr) {
    var r = rr || 7;
    ctx.strokeStyle = color; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    if (out) { dot(ctx, x, y, r * 0.3, color); }
    else {
      var d = r * 0.62;
      ctx.beginPath();
      ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d);
      ctx.moveTo(x + d, y - d); ctx.lineTo(x - d, y + d); ctx.stroke();
    }
  }

  /* ============================================================
     SIM 1 — Ciclotrón / fuerza de Lorentz   (PORT de f3.js)
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SEC,
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
     SIM 2 — Selector de velocidades + espectrómetro de masas   (NUEVA)
     Región 1: E y B cruzados → sólo pasa v* = E/B (selector).
     Región 2: B solo → r = mv/qB separa por masa (espectrómetro,
     tipo Bainbridge: semicírculos que aterrizan en el detector).
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SEC,
    id: "selector",
    title: "Selector de velocidades y espectrómetro",
    refs: "Resumen p.21 · Práctica g.4",
    blurb: "Entran iones con un abanico de rapideces. En el selector (E ↓ y B ⊙ cruzados) sólo salen " +
      "los que cumplen F_E = F_B, o sea v = E/B; los demás se desvían y chocan. Los seleccionados entran " +
      "al espectrómetro (sólo B): como r = mv/(qB) y todos comparten v, cada masa cae en un punto distinto " +
      "del detector. Arrastrá los knobs de E y B (o usá los sliders) y cambiá la muestra.",
    formula: "selector: v = E/B  (qE = qvB)   ·   espectrómetro: r = mv/(qB)  →  cada masa, su radio",
    stageHeight: 380,
    controls: [
      { type: "range", key: "E", label: "campo E", min: 10, max: 100, step: 1, value: 50, unit: "kV/m", digits: 0 },
      { type: "range", key: "B", label: "campo B", min: 10, max: 100, step: 1, value: 50, unit: "mT", digits: 0 },
      { type: "range", key: "q", label: "carga q", min: 1, max: 4, step: 0.5, value: 1, unit: "·q₀", digits: 1 },
      { type: "segment", key: "muestra", label: "muestra", value: "dos", options: [["dos", "2 masas"], ["tres", "3 masas"]] },
    ],
    readouts: [
      { key: "vstar", label: "v* = E/B", unit: "Mm/s", digits: 2 },
      { key: "E", label: "E (selector)", unit: "kV/m", digits: 0 },
      { key: "B", label: "|B|", unit: "mT", digits: 0 },
      { key: "rr", label: "radios r (por masa)" },
    ],
    create: function (env) {
      var EMIN = 10, EMAX = 100, BMIN = 10, BMAX = 100;
      var VSCALE = 78;      // px/s por cada Mm/s
      var ACC = 60;         // fuerza de desvío en el selector (px/s²)
      var KR = 1350;        // r_px = KR·(m·v_Mm)/(q·B_mT)
      var PX_PER_CM = 5;
      var particles = [], marks = [];
      var spawnT = 0, Eint = 50, Bint = 50, inited = false;

      function lay() {
        var W = env.W || 600, H = env.H || 380;
        var cy = H * 0.62;
        return { W: W, H: H, selX0: 58, slitX: W * 0.52, cy: cy,
          chanH: 56, slit: 7, maxR: (cy - 16) / 2 };
      }
      function sampleArr() {
        var c = env.colors;
        return env.params.muestra === "tres"
          ? [{ m: 1.0, c: c.coral }, { m: 1.5, c: c.amber }, { m: 2.0, c: c.blue }]
          : [{ m: 1.0, c: c.coral }, { m: 2.0, c: c.blue }];
      }

      function initState() { Eint = env.params.E; Bint = env.params.B; inited = true; }
      function reset() { particles = []; marks = []; spawnT = 0; initState(); }

      function spawn() {
        var L = lay(), s = sampleArr(), pick = s[(Math.random() * s.length) | 0];
        var v = 0.45 + Math.random() * 1.3; // Mm/s
        particles.push({
          phase: "sel", x: L.selX0, y: L.cy + (Math.random() - 0.5) * 6,
          vx: VSCALE * v, vy: 0, v: v, m: pick.m, c: pick.c, dead: false, fade: 1,
        });
        if (particles.length > 140) particles.shift();
      }

      // handle: knob vertical de E (arriba = más E)
      env.addHandle({
        r: 13,
        x: function () { return 26; },
        y: function () { var L = lay(); return L.cy + 64 - (Eint - EMIN) / (EMAX - EMIN) * 128; },
        onDrag: function (px, py) { var L = lay(); Eint = EMIN + clamp((L.cy + 64 - py) / 128, 0, 1) * (EMAX - EMIN); },
      });
      // handle: knob horizontal de B (derecha = más B)
      env.addHandle({
        r: 13,
        x: function () { return 58 + (Bint - BMIN) / (BMAX - BMIN) * (200 - 58); },
        y: function () { var L = lay(); return L.H - 16; },
        onDrag: function (px) { Bint = BMIN + clamp((px - 58) / (200 - 58), 0, 1) * (BMAX - BMIN); },
      });

      function step(dt) {
        if (!inited) initState();
        var L = lay(), q = env.params.q, vstar = Eint / Bint;
        spawnT += dt; if (spawnT > 0.11) { spawnT = 0; spawn(); }
        for (var i = 0; i < particles.length; i++) {
          var p = particles[i];
          if (p.dead) { p.fade -= dt * 1.7; continue; }
          if (p.phase === "sel") {
            var ay = (q / p.m) * ACC * (vstar - p.v);
            p.vy += ay * dt; p.x += p.vx * dt; p.y += p.vy * dt;
            if (Math.abs(p.y - L.cy) > L.chanH) { p.dead = true; }
            else if (p.x >= L.slitX) {
              if (Math.abs(p.y - L.cy) <= L.slit) {
                p.phase = "esp"; p.entryX = L.slitX; p.entryY = p.y;
                p.vmag = Math.hypot(p.vx, p.vy);
                var vMm = p.vmag / VSCALE;
                p.r = clamp(KR * (p.m * vMm) / (q * Bint), 8, L.maxR);
                p.cxr = L.slitX; p.cyr = p.entryY - p.r; // B ⊙ → curva hacia arriba
                p.theta = Math.PI / 2; p.omega = p.vmag / p.r;
              } else { p.dead = true; p.x = L.slitX; }
            }
          } else {
            p.theta -= p.omega * dt;
            p.x = p.cxr + p.r * Math.cos(p.theta);
            p.y = p.cyr + p.r * Math.sin(p.theta);
            if (p.theta <= -Math.PI / 2) {
              marks.push({ x: p.entryX, y: p.entryY - 2 * p.r, c: p.c, m: p.m, rcm: p.r / PX_PER_CM });
              if (marks.length > 30) marks.shift();
              p.dead = true;
            }
          }
        }
        var alive = [];
        for (var k = 0; k < particles.length; k++) if (!(particles[k].dead && particles[k].fade <= 0)) alive.push(particles[k]);
        particles = alive;
      }

      function draw(ctx, W, H) {
        if (!inited) initState();
        var col = env.colors, q = env.params.q, L = lay(), vstar = Eint / Bint;

        // ------ región selector (izq) y espectrómetro (der) ------
        ctx.fillStyle = "rgba(146,207,242,0.05)"; ctx.fillRect(L.selX0, L.cy - L.chanH, L.slitX - L.selX0, L.chanH * 2);
        ctx.fillStyle = "rgba(216,178,121,0.04)"; ctx.fillRect(L.slitX, 8, W - L.slitX - 4, L.cy + L.chanH - 8);

        // símbolos de B ⊙ (sale) en todo el campo
        for (var bx = L.selX0 + 16; bx < W - 8; bx += 40) {
          for (var by = 24; by < L.cy + L.chanH; by += 38) drawSym(ctx, bx, by, true, "rgba(255,255,255,0.13)", 5);
        }
        // flechas de E ↓ sólo en el selector
        for (var ex = L.selX0 + 14; ex < L.slitX - 6; ex += 34) {
          drawArrow(ctx, ex, L.cy - L.chanH + 4, ex, L.cy + L.chanH - 4, "rgba(216,178,121,0.35)", 1, 5);
        }

        // cañón de iones
        ctx.fillStyle = "rgba(255,255,255,0.10)";
        ctx.fillRect(L.selX0 - 20, L.cy - 12, 18, 24);
        ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText("fuente", L.selX0 - 24, L.cy - 18);
        ctx.fillStyle = col.amber; ctx.fillText("E ↓", L.selX0 + 2, 20);
        ctx.fillStyle = col.blue; ctx.fillText("B ⊙", L.selX0 + 40, 20);

        // barrera + rendija (slit)
        ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(L.slitX, 8); ctx.lineTo(L.slitX, L.cy - L.slit);
        ctx.moveTo(L.slitX, L.cy + L.slit); ctx.lineTo(L.slitX, L.cy + L.chanH); ctx.stroke();
        ctx.fillStyle = col.teal; ctx.fillText("rendija (v=E/B)", L.slitX + 6, L.cy + 4);

        // detector (placa vertical sobre la barrera, hacia arriba)
        ctx.strokeStyle = col.text; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(L.slitX, L.cy - L.slit); ctx.lineTo(L.slitX, 12); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.fillText("detector", L.slitX + 6, 20);

        // arcos fantasma: aterrizaje esperado por masa (a v = v*)
        var s = sampleArr();
        for (var gi = 0; gi < s.length; gi++) {
          var rg = clamp(KR * (s[gi].m * vstar) / (q * Bint), 8, L.maxR);
          ctx.strokeStyle = "rgba(255,255,255,0.10)"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(L.slitX, L.cy - rg, rg, Math.PI / 2, -Math.PI / 2, true); ctx.stroke();
          ctx.strokeStyle = s[gi].c; ctx.globalAlpha = 0.45;
          ctx.beginPath(); ctx.moveTo(L.slitX - 4, L.cy - 2 * rg); ctx.lineTo(L.slitX + 6, L.cy - 2 * rg); ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillStyle = s[gi].c; ctx.font = "10px ui-monospace, Menlo, monospace";
          ctx.fillText(s[gi].m.toFixed(1) + "m₀", L.slitX + 8, L.cy - 2 * rg + 3);
        }

        // marcas reales acumuladas en el detector
        for (var mi = 0; mi < marks.length; mi++) {
          var mk = marks[mi];
          dot(ctx, mk.x, mk.y, 3.5, mk.c);
          ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(mk.x, mk.y, 3.5, 0, TAU); ctx.stroke();
        }

        // partículas
        for (var i = 0; i < particles.length; i++) {
          var p = particles[i];
          ctx.globalAlpha = p.dead ? clamp(p.fade, 0, 1) : 1;
          dot(ctx, p.x, p.y, 3.2, p.c);
          ctx.globalAlpha = 1;
        }

        // ------ knobs (handles) E vertical y B horizontal ------
        var ekY = L.cy + 64 - (Eint - EMIN) / (EMAX - EMIN) * 128;
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(26, L.cy - 64); ctx.lineTo(26, L.cy + 64); ctx.stroke();
        ctx.strokeStyle = col.amber; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(26, L.cy + 64); ctx.lineTo(26, ekY); ctx.stroke();
        ctx.fillStyle = col.amber; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText("E", 18, L.cy - 70);

        var bkX = 58 + (Bint - BMIN) / (BMAX - BMIN) * (200 - 58);
        ctx.strokeStyle = col.gridStrong; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(58, L.H - 16); ctx.lineTo(200, L.H - 16); ctx.stroke();
        ctx.strokeStyle = col.blue; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(58, L.H - 16); ctx.lineTo(bkX, L.H - 16); ctx.stroke();
        ctx.fillStyle = col.blue; ctx.fillText("B", 204, L.H - 12);

        // radios por masa (string)
        var parts = [];
        for (var ri = 0; ri < s.length; ri++) {
          var rc = clamp(KR * (s[ri].m * vstar) / (q * Bint), 8, L.maxR) / PX_PER_CM;
          parts.push(s[ri].m.toFixed(1) + "→" + rc.toFixed(1));
        }
        env.setReadout("vstar", vstar);
        env.setReadout("E", Eint);
        env.setReadout("B", Bint);
        env.setReadout("rr", parts.join("  ") + " cm");
      }

      function onControl(key, val) {
        if (key === "E") Eint = val;
        else if (key === "B") Bint = val;
        else if (key === "muestra") marks = [];
      }
      return { reset: reset, step: step, draw: draw, onControl: onControl };
    },
  });

  /* ============================================================
     SIM 3 — Biot-Savart y Ampère — sonda de B   (PORT + enriquecido)
     Agrega el caso "dos hilos ∥" (↑↑ / ↑↓) con campo superpuesto y
     la fuerza por unidad de longitud F/L (atractiva/repulsiva).
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SEC,
    id: "biot",
    title: "Biot-Savart — sonda de campo",
    refs: "Resumen p.22 · Práctica g.5",
    blurb: "Elegí hilo ∞, espira (en corte), solenoide o dos hilos paralelos, y arrastrá la sonda: " +
      "muestra el vector B y |B| en su posición. Con dos hilos, elegí corrientes ↑↑ o ↑↓, arrastrá la " +
      "separación y leé la fuerza por unidad de longitud F/L entre ellos: paralelas se atraen, opuestas se repelen.",
    formula: "hilo: B=μ₀I/2πr   ·   dos hilos: F/L = μ₀I₁I₂/2πd   ·   solenoide: B=μ₀nI",
    stageHeight: 360,
    controls: [
      { type: "segment", key: "geo", label: "Fuente", value: "hilo", options: [
        ["hilo", "Hilo ∞"], ["espira", "Espira"], ["sol", "Solenoide"], ["dos", "Dos hilos ∥"]] },
      { type: "segment", key: "sent", label: "Sentido (dos hilos)", value: "par", options: [["par", "↑↑ paralelas"], ["anti", "↑↓ opuestas"]] },
      { type: "range", key: "I", label: "corriente I", min: 1, max: 12, step: 0.5, value: 5, unit: "A", digits: 1 },
      { type: "range", key: "a", label: "radio / semisep a", min: 2, max: 8, step: 0.5, value: 5, unit: "cm", digits: 1 },
      { type: "range", key: "n", label: "vueltas (solenoide)", min: 2, max: 12, step: 1, value: 6, unit: "/cm", digits: 0 },
    ],
    readouts: [
      { key: "B", label: "|B| (sonda)", unit: "µT", digits: 1 },
      { key: "r", label: "r a la fuente", unit: "cm", digits: 1 },
      { key: "FL", label: "F/L entre hilos", unit: "µN/m", digits: 1 },
      { key: "tipo", label: "fuerza entre hilos" },
    ],
    create: function (env) {
      var PPM = 0.001; // m por px (1 px = 1 mm)
      var probe = { x: 0, y: 0 };
      var sepPx = 90;
      var needInit = true;

      function ctr() { return { x: (env.W || 600) * 0.5, y: (env.H || 360) * 0.5 }; }
      function aPx() { return clamp(env.params.a, 2, 8) * 10; }
      function solHalf() { return clamp(env.params.a, 2, 10) * 9; }
      function solLen() { return (env.W || 600) * 0.44; }
      function senseR() { return env.params.sent === "anti" ? -1 : 1; }

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
        } else if (p.geo === "dos") {
          var s = sepPx / 2, sr = senseR();
          var wa = wireB(px, py, c.x - s, c.y, p.I, +1);       // izq: sale
          var wb = wireB(px, py, c.x + s, c.y, p.I, sr);       // der: sale (par) / entra (anti)
          bx = wa.bx + wb.bx; by = wa.by + wb.by;
        } else {
          var hh = solHalf(), Lx = solLen();
          var inside = (px > c.x - Lx / 2 && px < c.x + Lx / 2 && py > c.y - hh && py < c.y + hh);
          // interior −x: sentido consistente con las paredes ⊙ (arriba) / ⊗
          // (abajo) bajo la convención wireB (igual que en la sim de Ampère).
          if (inside) { var nm = p.n * 100; bx = -MU0 * nm * p.I; by = 0; region = "dentro"; }
          else { bx = 0; by = 0; region = "fuera"; }
        }
        return { bx: bx, by: by, mag: Math.hypot(bx, by), region: region };
      }

      function reset() { needInit = true; sepPx = 90; }
      function initProbe() {
        var c = ctr(); probe.x = c.x + 80; probe.y = c.y - 46; needInit = false;
      }

      // handle: sonda de campo
      env.addHandle({
        r: 16,
        x: function () { return probe.x; },
        y: function () { return probe.y; },
        onDrag: function (px, py) {
          probe.x = clamp(px, 6, (env.W || 600) - 6);
          probe.y = clamp(py, 6, (env.H || 360) - 6);
        },
      });
      // handle: separación de los dos hilos (arrastrás el hilo derecho)
      env.addHandle({
        r: 15,
        hidden: function () { return env.params.geo !== "dos"; },
        x: function () { return ctr().x + sepPx / 2; },
        y: function () { return ctr().y; },
        onDrag: function (px) { sepPx = clamp(2 * (px - ctr().x), 34, (env.W || 600) * 0.62); },
      });

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
          drawSym(ctx, c.x, c.y, true, col.coral, 7);
          ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
          ctx.fillText("I ⊙ (sale)", c.x + 12, c.y - 12);
        } else if (p.geo === "espira") {
          var a = aPx();
          drawSym(ctx, c.x - a, c.y, true, col.coral, 7);
          drawSym(ctx, c.x + a, c.y, false, col.blue, 7);
          ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
          ctx.fillText("espira en corte: ⊙ | ⊗", c.x - a - 6, c.y - 16);
        } else if (p.geo === "dos") {
          var s = sepPx / 2, sr = senseR();
          drawSym(ctx, c.x - s, c.y, true, col.coral, 8);
          drawSym(ctx, c.x + s, c.y, sr > 0, sr > 0 ? col.coral : col.blue, 8);
          // fuerza F/L entre los hilos (atractiva/repulsiva)
          var d_m = Math.max(sepPx * PPM, 0.004);
          var FL = MU0 * p.I * p.I / (TAU * d_m); // N/m
          var attract = sr > 0;                   // ↑↑ atraen, ↑↓ repelen
          var farrow = clamp(14 + Math.log10(1 + FL / 1e-6) * 8, 12, 40);
          var d1 = attract ? +1 : -1;             // izq apunta a la derecha si atrae
          env.arrow(ctx, c.x - s, c.y - 22, c.x - s + d1 * farrow, c.y - 22, col.teal, 2.2);
          env.arrow(ctx, c.x + s, c.y - 22, c.x + s - d1 * farrow, c.y - 22, col.teal, 2.2);
          // cota de separación
          ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(c.x - s, c.y + 24); ctx.lineTo(c.x + s, c.y + 24); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
          ctx.fillText("d = " + (sepPx * PPM * 100).toFixed(1) + " cm", c.x - 26, c.y + 38);
          ctx.fillStyle = col.teal;
          ctx.fillText(attract ? "atracción" : "repulsión", c.x - 24, c.y - 34);
        } else {
          var hh = solHalf(), Lx = solLen();
          ctx.strokeStyle = col.dim; ctx.lineWidth = 1.2;
          ctx.strokeRect(c.x - Lx / 2, c.y - hh, Lx, hh * 2);
          for (var sxx = c.x - Lx / 2 + 10; sxx < c.x + Lx / 2 - 4; sxx += 22) {
            drawSym(ctx, sxx, c.y - hh, true, col.coral, 7);
            drawSym(ctx, sxx, c.y + hh, false, col.blue, 7);
          }
          ctx.strokeStyle = "rgba(216,178,121,0.35)"; ctx.lineWidth = 1;
          for (var ly = c.y - hh + 8; ly < c.y + hh; ly += 12) {
            drawArrow(ctx, c.x + Lx / 2 - 8, ly, c.x - Lx / 2 + 8, ly, "rgba(216,178,121,0.4)", 1, 5);
          }
          ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
          ctx.fillText("solenoide en corte (B uniforme dentro)", c.x - Lx / 2, c.y - hh - 8);
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
        } else if (p.geo === "dos") {
          var s2 = sepPx / 2;
          var ra = Math.hypot(probe.x - (c.x - s2), probe.y - c.y);
          var rb = Math.hypot(probe.x - (c.x + s2), probe.y - c.y);
          env.setReadout("r", Math.min(ra, rb) * PPM * 100);
        } else {
          env.setReadout("r", Math.hypot(probe.x - c.x, probe.y - c.y) * PPM * 100);
        }

        if (p.geo === "dos") {
          var dd = Math.max(sepPx * PPM, 0.004);
          env.setReadout("FL", MU0 * p.I * p.I / (TAU * dd) * 1e6);
          env.setReadout("tipo", senseR() > 0 ? "atractiva (↑↑)" : "repulsiva (↑↓)");
        } else {
          env.setReadout("FL", null);
          env.setReadout("tipo", "—");
        }
      }

      return { reset: reset, draw: draw };
    },
  });

  /* ============================================================
     SIM 4 — Ley de Ampère interactiva   (NUEVA)
     Camino amperiano circular arrastrable y redimensionable.
     ∮B·dl (numérico sobre el camino) vs μ₀·I_enc: SIEMPRE iguales.
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SEC,
    id: "ampere",
    title: "Ley de Ampère interactiva",
    refs: "Resumen p.22 · Práctica g.5 (5.4)",
    blurb: "Elegí hilo, cable coaxial o solenoide en corte, y jugá con el camino amperiano circular: " +
      "arrastralo (handle central) y redimensionalo (handle del borde). ∮B·dl —integrada punto a punto " +
      "sobre TU camino— y μ₀·I_enc coinciden siempre, aunque descentres el camino: esa invariancia es la Ley de Ampère.",
    formula: "∮ B·dl = μ₀ I_enc   ·   hilo: B=μ₀I/2πr   ·   coaxial: I_enc(r) por capas   ·   solenoide: B=μ₀nI",
    stageHeight: 360,
    controls: [
      { type: "segment", key: "cfg", label: "Configuración", value: "hilo", options: [
        ["hilo", "Hilo"], ["coax", "Cable coaxial"], ["sol", "Solenoide"]] },
      { type: "range", key: "I", label: "corriente I", min: 1, max: 15, step: 0.5, value: 6, unit: "A", digits: 1 },
      { type: "range", key: "n", label: "vueltas (solenoide)", min: 2, max: 12, step: 1, value: 6, unit: "/cm", digits: 0 },
    ],
    readouts: [
      { key: "circ", label: "∮ B·dl", unit: "µT·m", digits: 2 },
      { key: "mi", label: "μ₀·I_enc", unit: "µT·m", digits: 2 },
      { key: "ienc", label: "I_enc", unit: "A", digits: 2 },
      { key: "bl", label: "⟨B⟩ en el camino", unit: "µT", digits: 1 },
    ],
    create: function (env) {
      var PPM = 0.001; // m por px
      var COAX = { a: 16, b: 30, c: 40 }; // radios en px
      var loop = { x: 0, y: 0, R: 64 };
      var inited = false;

      function C() { return { x: (env.W || 600) * 0.42, y: (env.H || 360) * 0.5 }; }
      function solRect() {
        var c = C(), Lx = (env.W || 600) * 0.5, hh = (env.H || 360) * 0.22;
        return { xL: c.x - Lx / 2, xR: c.x + Lx / 2, yT: c.y - hh, yB: c.y + hh };
      }

      function Bfield(px, py) {
        var p = env.params, c = C();
        if (p.cfg === "hilo") {
          var dx = px - c.x, dy = py - c.y, r = Math.hypot(dx, dy), rm = Math.max(r * PPM, 1e-4);
          var Bm = MU0 * p.I / (TAU * rm);
          return { bx: Bm * (-dy / (r || 1)), by: Bm * (dx / (r || 1)) };
        } else if (p.cfg === "coax") {
          var dx2 = px - c.x, dy2 = py - c.y, r2 = Math.hypot(dx2, dy2), rm2 = Math.max(r2 * PPM, 1e-4);
          var am = COAX.a * PPM, bm = COAX.b * PPM, cm = COAX.c * PPM, Ienc;
          if (rm2 < am) Ienc = p.I * rm2 * rm2 / (am * am);
          else if (rm2 < bm) Ienc = p.I;
          else if (rm2 < cm) Ienc = p.I * (1 - (rm2 * rm2 - bm * bm) / (cm * cm - bm * bm));
          else Ienc = 0;
          var Bm2 = MU0 * Ienc / (TAU * rm2);
          return { bx: Bm2 * (-dy2 / (r2 || 1)), by: Bm2 * (dx2 / (r2 || 1)) };
        } else {
          // interior uniforme (−x): sentido consistente con las paredes
          // ⊙ arriba / ⊗ abajo bajo la convención wireB del núcleo, de modo
          // que ∮B·dl salga con el MISMO signo que μ₀·I_enc (ver Ienclosed).
          var R = solRect();
          if (px > R.xL && px < R.xR && py > R.yT && py < R.yB) { return { bx: -MU0 * (p.n * 100) * p.I, by: 0 }; }
          return { bx: 0, by: 0 };
        }
      }

      // ∮B·dl numérico (sentido antihorario) sobre el camino, en T·m
      function circulation() {
        var N = 360, sum = 0, R = loop.R;
        for (var i = 0; i < N; i++) {
          var ph = i / N * TAU;
          var px = loop.x + R * Math.cos(ph), py = loop.y + R * Math.sin(ph);
          var f = Bfield(px, py);
          sum += f.bx * (-Math.sin(ph)) + f.by * (Math.cos(ph));
        }
        return sum * (R * PPM) * (TAU / N);
      }

      // corriente encerrada por el camino, en A
      function Ienclosed() {
        var p = env.params, c = C();
        if (p.cfg === "hilo") {
          return (Math.hypot(loop.x - c.x, loop.y - c.y) < loop.R) ? p.I : 0;
        } else if (p.cfg === "coax") {
          var am = COAX.a * PPM, bm = COAX.b * PPM, cm = COAX.c * PPM;
          // camino concéntrico con el eje → I_enc(R) analítico (exacto);
          // descentrado → integración numérica de J sobre el disco.
          if (Math.hypot(loop.x - c.x, loop.y - c.y) < 2) {
            var Rm = loop.R * PPM;
            if (Rm < am) return p.I * Rm * Rm / (am * am);
            if (Rm < bm) return p.I;
            if (Rm < cm) return p.I * (1 - (Rm * Rm - bm * bm) / (cm * cm - bm * bm));
            return 0;
          }
          var M = 120, cell = (2 * loop.R) / M, dA = (cell * PPM) * (cell * PPM), sum = 0;
          var Jin = p.I / (Math.PI * am * am), Jout = -p.I / (Math.PI * (cm * cm - bm * bm));
          for (var gy = 0; gy < M; gy++) {
            for (var gx = 0; gx < M; gx++) {
              var px = loop.x - loop.R + (gx + 0.5) * cell, py = loop.y - loop.R + (gy + 0.5) * cell;
              if (Math.hypot(px - loop.x, py - loop.y) > loop.R) continue;
              var rm = Math.hypot(px - c.x, py - c.y) * PPM;
              if (rm < am) sum += Jin * dA;
              else if (rm >= bm && rm < cm) sum += Jout * dA;
            }
          }
          return sum;
        } else {
          var R = solRect(), K = (p.n * 100) * p.I;
          function segLen(yWall) {
            var dy = yWall - loop.y; if (Math.abs(dy) >= loop.R) return 0;
            var w = Math.sqrt(loop.R * loop.R - dy * dy);
            var a = Math.max(loop.x - w, R.xL), b = Math.min(loop.x + w, R.xR);
            return b > a ? (b - a) : 0;
          }
          return K * (segLen(R.yT) * PPM - segLen(R.yB) * PPM);
        }
      }

      function reset() { inited = false; }
      function initLoop() { var c = C(); loop.x = c.x; loop.y = c.y; loop.R = 64; inited = true; }

      // handle: mover el camino (centro)
      env.addHandle({
        r: 16,
        x: function () { return loop.x; }, y: function () { return loop.y; },
        onDrag: function (px, py) {
          loop.x = clamp(px, 12, (env.W || 600) - 12);
          loop.y = clamp(py, 12, (env.H || 360) - 12);
        },
      });
      // handle: redimensionar el camino (borde derecho)
      env.addHandle({
        r: 14,
        x: function () { return loop.x + loop.R; }, y: function () { return loop.y; },
        onDrag: function (px, py) {
          loop.R = clamp(Math.hypot(px - loop.x, py - loop.y), 8, Math.min((env.W || 600), (env.H || 360)) * 0.46);
        },
      });

      function draw(ctx, W, H) {
        if (!inited && W > 0) initLoop();
        var col = env.colors, p = env.params, c = C();

        // ---- fuente ----
        if (p.cfg === "hilo") {
          var inside = Math.hypot(loop.x - c.x, loop.y - c.y) < loop.R;
          if (inside) { dot(ctx, c.x, c.y, 12, "rgba(244,124,89,0.18)"); }
          drawSym(ctx, c.x, c.y, true, col.coral, 8);
          ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
          ctx.fillText("I ⊙ = " + p.I.toFixed(1) + " A", c.x + 14, c.y - 12);
        } else if (p.cfg === "coax") {
          ctx.fillStyle = "rgba(244,124,89,0.16)";
          ctx.beginPath(); ctx.arc(c.x, c.y, COAX.a, 0, TAU); ctx.fill();
          ctx.strokeStyle = col.coral; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.arc(c.x, c.y, COAX.a, 0, TAU); ctx.stroke();
          ctx.fillStyle = "rgba(146,207,242,0.14)";
          ctx.beginPath(); ctx.arc(c.x, c.y, COAX.c, 0, TAU);
          ctx.arc(c.x, c.y, COAX.b, 0, TAU, true); ctx.fill();
          ctx.strokeStyle = col.blue; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(c.x, c.y, COAX.b, 0, TAU); ctx.stroke();
          ctx.beginPath(); ctx.arc(c.x, c.y, COAX.c, 0, TAU); ctx.stroke();
          drawSym(ctx, c.x, c.y, true, col.coral, 5);
          ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
          ctx.fillText("núcleo +I ⊙ · malla −I ⊗", c.x - COAX.c, c.y - COAX.c - 8);
        } else {
          var R = solRect();
          ctx.strokeStyle = col.dim; ctx.lineWidth = 1.2; ctx.strokeRect(R.xL, R.yT, R.xR - R.xL, R.yB - R.yT);
          for (var sxx = R.xL + 10; sxx < R.xR - 4; sxx += 22) {
            drawSym(ctx, sxx, R.yT, true, col.coral, 6);
            drawSym(ctx, sxx, R.yB, false, col.blue, 6);
          }
          ctx.strokeStyle = "rgba(216,178,121,0.3)"; ctx.lineWidth = 1;
          for (var ly = R.yT + 8; ly < R.yB; ly += 12) drawArrow(ctx, R.xR - 8, ly, R.xL + 8, ly, "rgba(216,178,121,0.35)", 1, 5);
          ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
          ctx.fillText("solenoide en corte (n=" + p.n + "/cm)", R.xL, R.yT - 8);
        }

        // ---- camino amperiano + muestras tangenciales de B·dl ----
        ctx.strokeStyle = col.teal; ctx.setLineDash([6, 5]); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(loop.x, loop.y, loop.R, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
        var NS = 24;
        for (var k = 0; k < NS; k++) {
          var ph = k / NS * TAU;
          var px = loop.x + loop.R * Math.cos(ph), py = loop.y + loop.R * Math.sin(ph);
          var f = Bfield(px, py);
          var tx = -Math.sin(ph), ty = Math.cos(ph);
          var comp = f.bx * tx + f.by * ty; // B·t̂ (T)
          var g = clamp(Math.abs(comp) / 3e-5 * 14, 2, 16);
          var cc = comp >= 0 ? "rgba(47,159,143,0.85)" : "rgba(214,143,133,0.85)";
          drawArrow(ctx, px, py, px + tx * g * (comp >= 0 ? 1 : -1), py + ty * g * (comp >= 0 ? 1 : -1), cc, 1.3, 4);
        }
        // marcadores de los handles (centro y borde)
        dot(ctx, loop.x, loop.y, 3, col.teal);
        dot(ctx, loop.x + loop.R, loop.y, 3.5, col.teal);

        // ---- cálculo ----
        var cc2 = circulation(), ie = Ienclosed(), mi = MU0 * ie;
        var bAvg = Math.abs(cc2) / (TAU * loop.R * PPM);
        var ok = Math.abs(cc2 - mi) <= 0.06 * (Math.abs(mi) + 1e-9);
        ctx.fillStyle = ok ? col.teal : col.red; ctx.font = "12px ui-monospace, Menlo, monospace";
        ctx.fillText(ok ? "∮B·dl = μ₀·I_enc  ✓" : "∮B·dl = μ₀·I_enc", 12, H - 12);
        ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText("arrastrá / redimensioná el camino", 12, 18);

        env.setReadout("circ", cc2 * 1e6);
        env.setReadout("mi", mi * 1e6);
        env.setReadout("ienc", ie);
        env.setReadout("bl", bAvg * 1e6);
      }

      function onControl() {}
      return { reset: reset, draw: draw, onControl: onControl };
    },
  });

  /* ============================================================
     SIM 5 — Fuerza sobre un conductor (barra sobre rieles)   (NUEVA)
     F = i L × B acelera la barra por los rieles en B uniforme.
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SEC,
    id: "conductor",
    title: "Fuerza sobre un conductor",
    refs: "Resumen p.21 · Práctica g.4 (4.8, 4.9)",
    blurb: "Barra conductora que corre sobre dos rieles en un B uniforme (⊙/⊗). La corriente i por la " +
      "barra genera F = i L × B, perpendicular a la vez a la corriente y a B, que la acelera a lo largo " +
      "de los rieles. Cambiá i, B y la dirección del campo; arrastrá la barra para reposicionarla y mirá v(t).",
    formula: "F = i L × B   ·   |F| = i·L·B   ·   a = F/m   ·   v = a·t",
    stageHeight: 340,
    controls: [
      { type: "segment", key: "bdir", label: "Campo B", value: "out", options: [["out", "⊙ sale"], ["in", "⊗ entra"]] },
      { type: "range", key: "i", label: "corriente i", min: 0.5, max: 10, step: 0.5, value: 4, unit: "A", digits: 1 },
      { type: "range", key: "B", label: "|B|", min: 0.1, max: 1, step: 0.05, value: 0.3, unit: "T", digits: 2 },
      { type: "range", key: "L", label: "largo barra L", min: 0.1, max: 0.4, step: 0.02, value: 0.2, unit: "m", digits: 2 },
      { type: "range", key: "m", label: "masa m", min: 20, max: 200, step: 10, value: 80, unit: "g", digits: 0 },
    ],
    readouts: [
      { key: "F", label: "F = i·L·B", unit: "N", digits: 3 },
      { key: "a", label: "aceleración a", unit: "m/s²", digits: 2 },
      { key: "v", label: "velocidad v", unit: "m/s", digits: 2 },
      { key: "x", label: "posición x", unit: "m", digits: 2 },
    ],
    plot: {
      height: 140, window: 4, autoY: true,
      xLabel: "t (s)", yLabel: "v (m/s)",
      series: [{ key: "v", label: "v", color: PAL.teal }],
    },
    create: function (env) {
      var railLen = 1.5; // m
      var x = 0, v = 0, tt = 0, dragging = false;

      function reset() { x = 0; v = 0; tt = 0; dragging = false; env.plot.clear(); }
      function sgn() { return env.params.bdir === "in" ? -1 : 1; } // ⊙ empuja a la derecha
      function Fnet() { return env.params.i * env.params.L * env.params.B * sgn(); }
      function layout() {
        var W = env.W || 600, H = env.H || 340;
        return { W: W, H: H, x0: W * 0.14, x1: W * 0.86, yTop: H * 0.34, yBot: H * 0.66 };
      }
      function barPx() { var L = layout(); return L.x0 + (x / railLen) * (L.x1 - L.x0); }

      // handle: arrastrar la barra (reposicionar; frena)
      env.addHandle({
        r: 20,
        x: function () { return barPx(); },
        y: function () { var L = layout(); return (L.yTop + L.yBot) / 2; },
        onStart: function () { dragging = true; v = 0; },
        onDrag: function (px) { var L = layout(); x = clamp((px - L.x0) / ((L.x1 - L.x0) || 1) * railLen, 0, railLen); v = 0; },
        onEnd: function () { dragging = false; },
      });

      function step(dt) {
        tt += dt;
        if (!dragging) {
          var a = Fnet() / (env.params.m / 1000);
          v += a * dt; x += v * dt;
          if (x > railLen) { x = 0; v = 0; tt = 0; env.plot.clear(); }
          else if (x < 0) { x = railLen; v = 0; tt = 0; env.plot.clear(); }
        }
        env.plot.push(tt, { v: v });
      }

      function draw(ctx, W, H) {
        var col = env.colors, p = env.params, L = layout(), into = p.bdir === "in";

        // campo B de fondo (⊙/⊗)
        for (var bx = 26; bx < W; bx += 40) {
          for (var by = 20; by < H; by += 40) drawSym(ctx, bx, by, !into, "rgba(255,255,255,0.13)", 5);
        }
        ctx.fillStyle = col.dim; ctx.font = "11px ui-monospace, Menlo, monospace";
        ctx.fillText("B " + (into ? "entra (⊗)" : "sale (⊙)"), 10, 16);

        // rieles
        ctx.strokeStyle = col.dim; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(L.x0, L.yTop); ctx.lineTo(L.x1, L.yTop);
        ctx.moveTo(L.x0, L.yBot); ctx.lineTo(L.x1, L.yBot); ctx.stroke();
        // topes
        ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(L.x0, L.yTop - 8); ctx.lineTo(L.x0, L.yBot + 8);
        ctx.moveTo(L.x1, L.yTop - 8); ctx.lineTo(L.x1, L.yBot + 8); ctx.stroke();
        // fuente de corriente esquemática a la izquierda
        ctx.fillStyle = col.dim; ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillText("i = " + p.i.toFixed(1) + " A", L.x0 - 6, L.yTop - 12);

        // barra
        var bxp = barPx();
        ctx.strokeStyle = col.coral; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(bxp, L.yTop); ctx.lineTo(bxp, L.yBot); ctx.stroke();

        // corriente por la barra (de abajo hacia arriba)
        for (var cy = L.yBot - 12; cy > L.yTop + 6; cy -= 20) drawArrow(ctx, bxp, cy, bxp, cy - 12, col.amber, 1.4, 5);
        ctx.fillStyle = col.amber; ctx.fillText("i", bxp + 6, L.yTop + 4);

        // vector F = i L × B sobre la barra
        var F = Fnet();
        var ym = (L.yTop + L.yBot) / 2;
        var fpx = clamp(Math.abs(F) * 120, 18, 70) * (F >= 0 ? 1 : -1);
        env.arrow(ctx, bxp, ym, bxp + fpx, ym, col.teal, 2.6);
        ctx.fillStyle = col.teal; ctx.font = "12px ui-monospace, Menlo, monospace";
        ctx.fillText("F", bxp + fpx + (F >= 0 ? 6 : -14), ym - 6);

        // vector v
        if (Math.abs(v) > 1e-3) {
          var vpx = clamp(Math.abs(v) * 26, 10, 90) * (v >= 0 ? 1 : -1);
          env.arrow(ctx, bxp, L.yBot + 16, bxp + vpx, L.yBot + 16, col.blue, 2);
          ctx.fillStyle = col.blue; ctx.fillText("v", bxp + vpx + (v >= 0 ? 6 : -12), L.yBot + 20);
        }

        var a = F / (p.m / 1000);
        env.setReadout("F", Math.abs(F));
        env.setReadout("a", Math.abs(a));
        env.setReadout("v", v);
        env.setReadout("x", x);
      }

      return { reset: reset, step: step, draw: draw };
    },
  });

  /* ============================================================
     SIM 6 — Torque sobre espira / motor DC   (PORT de f3.js)
     ============================================================ */
  SimKit.registerSim({
    tab: "f3",
    section: SEC,
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
        var fdir = iSign;
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

})();
