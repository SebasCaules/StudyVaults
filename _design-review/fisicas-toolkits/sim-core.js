/* ============================================================
   SimKit — micro-framework de simulaciones para el mockup de
   toolkits de Física (F1/F2/F3). Script clásico (sin módulos),
   compatible file://. Los fN.js registran tabs y sims acá.
   ============================================================ */
(function () {
  "use strict";

  var DT = 1 / 120;          // paso fijo de física (s)
  var MAX_STEPS = 6;         // tope de pasos por frame (evita espiral)
  var TABS = ["f1", "f2", "f3"];

  var tabMeta = {};          // id -> {intro}
  var sims = [];             // specs registrados en orden
  var instances = [];        // runtime por sim
  var booted = false;

  /* ---------- paleta (coherente con tokens del sitio) ---------- */
  var COLORS = {
    coral: "#f47c59",
    blue: "#92cff2",
    teal: "#2f9f8f",
    amber: "#d8b279",
    red: "#d68f85",
    ink: "#241208",
    text: "#ffffff",
    dim: "#a1a1aa",
    grid: "rgba(255,255,255,0.08)",
    gridStrong: "rgba(255,255,255,0.16)",
    stage: "#241208",
  };
  var TAB_TINT = { f1: COLORS.coral, f2: COLORS.blue, f3: COLORS.teal };
  var SERIES_DEFAULT = [COLORS.coral, COLORS.blue, COLORS.teal, COLORS.amber, COLORS.red];

  /* ---------- API pública ---------- */
  window.SimKit = {
    colors: COLORS,
    registerTab: function (opts) { tabMeta[opts.id] = opts; },
    registerSim: function (spec) { sims.push(spec); },
    boot: boot,
    /* Grilla sutil estándar (fondo de stage). */
    grid: function (ctx, W, H, step) {
      var s = step || 40;
      ctx.save();
      ctx.strokeStyle = COLORS.grid; ctx.lineWidth = 1;
      ctx.beginPath();
      for (var x = s; x < W; x += s) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (var y = s; y < H; y += s) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();
      ctx.restore();
    },
    /* Flecha estándar (vectores). */
    arrow: function (ctx, x0, y0, x1, y1, color, width) {
      var dx = x1 - x0, dy = y1 - y0;
      var len = Math.hypot(dx, dy);
      if (len < 1) return;
      var ang = Math.atan2(dy, dx);
      ctx.save();
      ctx.strokeStyle = color; ctx.fillStyle = color;
      ctx.lineWidth = width || 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      var h = Math.min(10, 4 + len * 0.06);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 - h * Math.cos(ang - 0.44), y1 - h * Math.sin(ang - 0.44));
      ctx.lineTo(x1 - h * Math.cos(ang + 0.44), y1 - h * Math.sin(ang + 0.44));
      ctx.closePath(); ctx.fill();
      ctx.restore();
    },
  };

  /* ---------- helpers ---------- */
  function el(tag, cls, parent) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (parent) parent.appendChild(n);
    return n;
  }
  function fmtNum(v, digits) {
    if (typeof v === "string") return v;
    if (v === null || v === undefined || isNaN(v)) return "—";
    var d = digits === undefined ? 2 : digits;
    var a = Math.abs(v);
    if (a !== 0 && (a >= 1e5 || a < Math.pow(10, -d))) return v.toExponential(2);
    return v.toFixed(d);
  }

  /* ---------- canvas DPR-aware ---------- */
  function fitCanvas(canvas) {
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return false;
    var W = Math.round(w * dpr), H = Math.round(h * dpr);
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W; canvas.height = H;
    }
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  }

  /* ---------- strip chart ---------- */
  function StripChart(canvas, cfg, tint) {
    this.canvas = canvas;
    this.cfg = cfg;
    this.tint = tint;
    this.window = cfg.window || 10;
    this.series = {};
    var self = this;
    (cfg.series || []).forEach(function (s, i) {
      self.series[s.key] = { label: s.label, color: s.color || SERIES_DEFAULT[i % SERIES_DEFAULT.length], pts: [] };
    });
  }
  StripChart.prototype.push = function (x, values) {
    var xmin = x - this.window;
    for (var k in values) {
      var s = this.series[k];
      if (!s) continue;
      s.pts.push([x, values[k]]);
      while (s.pts.length && s.pts[0][0] < xmin) s.pts.shift();
    }
    this.lastX = x;
  };
  StripChart.prototype.clear = function () {
    for (var k in this.series) this.series[k].pts = [];
    this.lastX = 0;
  };
  StripChart.prototype.draw = function () {
    if (!fitCanvas(this.canvas)) return;
    var ctx = this.canvas.getContext("2d");
    var W = this.canvas.clientWidth, H = this.canvas.clientHeight;
    var padL = 44, padR = 12, padT = 12, padB = 20;
    ctx.clearRect(0, 0, W, H);

    // rango Y
    var yMin = this.cfg.yMin, yMax = this.cfg.yMax;
    if (this.cfg.autoY !== false && (yMin === undefined || yMax === undefined)) {
      var lo = Infinity, hi = -Infinity;
      for (var k in this.series) {
        var pts = this.series[k].pts;
        for (var i = 0; i < pts.length; i++) {
          if (pts[i][1] < lo) lo = pts[i][1];
          if (pts[i][1] > hi) hi = pts[i][1];
        }
      }
      if (lo === Infinity) { lo = -1; hi = 1; }
      if (hi - lo < 1e-9) { hi += 1; lo -= 1; }
      var m = (hi - lo) * 0.12;
      yMin = (this.cfg.yMin !== undefined) ? this.cfg.yMin : lo - m;
      yMax = (this.cfg.yMax !== undefined) ? this.cfg.yMax : hi + m;
    }
    var x1 = (this.lastX || 0), x0 = x1 - this.window;
    var plotW = W - padL - padR, plotH = H - padT - padB;
    function X(x) { return padL + ((x - x0) / (x1 - x0 || 1)) * plotW; }
    function Y(y) { return padT + (1 - (y - yMin) / (yMax - yMin)) * plotH; }

    // grilla + ejes
    ctx.strokeStyle = COLORS.grid; ctx.lineWidth = 1;
    ctx.font = "10px ui-monospace, Menlo, monospace";
    ctx.fillStyle = COLORS.dim;
    var ticks = 4;
    for (var t = 0; t <= ticks; t++) {
      var yv = yMin + (t / ticks) * (yMax - yMin);
      var yy = Y(yv);
      ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(W - padR, yy); ctx.stroke();
      ctx.fillText(fmtNum(yv, Math.abs(yMax - yMin) < 10 ? 1 : 0), 4, yy + 3);
    }
    // línea y=0 si está en rango
    if (yMin < 0 && yMax > 0) {
      ctx.strokeStyle = COLORS.gridStrong;
      ctx.beginPath(); ctx.moveTo(padL, Y(0)); ctx.lineTo(W - padR, Y(0)); ctx.stroke();
    }

    // series
    for (var key in this.series) {
      var s = this.series[key];
      if (s.pts.length < 2) continue;
      ctx.strokeStyle = s.color; ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (var j = 0; j < s.pts.length; j++) {
        var px = X(s.pts[j][0]), py = Y(s.pts[j][1]);
        if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      var last = s.pts[s.pts.length - 1];
      ctx.fillStyle = s.color;
      ctx.beginPath(); ctx.arc(X(last[0]), Y(last[1]), 2.5, 0, Math.PI * 2); ctx.fill();
    }

    // leyenda + labels
    var lx = padL + 6;
    for (var key2 in this.series) {
      var s2 = this.series[key2];
      ctx.fillStyle = s2.color;
      ctx.fillRect(lx, padT, 8, 2);
      ctx.fillStyle = COLORS.dim;
      ctx.fillText(s2.label, lx + 12, padT + 5);
      lx += 12 + ctx.measureText(s2.label).width + 14;
    }
    ctx.fillStyle = COLORS.dim;
    if (this.cfg.xLabel) ctx.fillText(this.cfg.xLabel, W - padR - ctx.measureText(this.cfg.xLabel).width, H - 6);
    if (this.cfg.yLabel) ctx.fillText(this.cfg.yLabel, padL + 6, H - 6);
  };

  /* ---------- construcción de una card ---------- */
  function buildSim(spec) {
    var panel = document.getElementById("panel-" + spec.tab);
    if (!panel) return null;
    var tint = TAB_TINT[spec.tab];

    var card = el("article", "sim-card", panel);
    card.id = "sim-" + spec.id;

    var head = el("div", "sim-head", card);
    var h2 = el("h2", null, head); h2.textContent = spec.title;
    if (spec.refs) { var r = el("span", "refs", head); r.textContent = spec.refs; }
    if (spec.blurb) { var b = el("p", "sim-blurb", card); b.textContent = spec.blurb; }
    if (spec.formula) { var f = el("p", "sim-formula", card); f.textContent = spec.formula; }

    var body = el("div", "sim-body", card);
    var stageWrap = el("div", null, body);
    var stage = el("div", "sim-stage", stageWrap);
    if (spec.stageHeight) stage.style.minHeight = spec.stageHeight + "px";
    var canvas = el("canvas", null, stage);

    var chart = null;
    if (spec.plot) {
      var plotDiv = el("div", "sim-plot", stageWrap);
      if (spec.plot.height) plotDiv.style.height = spec.plot.height + "px";
      var plotCanvas = el("canvas", null, plotDiv);
      chart = new StripChart(plotCanvas, spec.plot, tint);
    }

    var sidePanel = el("div", "sim-panel", body);

    // transporte
    var transport = el("div", "sim-transport", sidePanel);
    var playBtn = el("button", "primary", transport); playBtn.textContent = "❚❚ Pausa";
    var resetBtn = el("button", null, transport); resetBtn.textContent = "⟲ Reiniciar";

    // estado runtime
    var inst = {
      spec: spec,
      canvas: canvas,
      stage: stage,
      chart: chart,
      playing: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      visible: false,
      acc: 0,
      params: {},
      readoutEls: {},
      sim: null,
    };
    if (!inst.playing) playBtn.textContent = "▶ Correr";

    playBtn.addEventListener("click", function () {
      inst.playing = !inst.playing;
      playBtn.textContent = inst.playing ? "❚❚ Pausa" : "▶ Correr";
    });
    resetBtn.addEventListener("click", function () { doReset(inst); });

    // controles declarativos
    (spec.controls || []).forEach(function (c) {
      if (c.type === "range") {
        inst.params[c.key] = c.value;
        var wrap = el("div", "ctl", sidePanel);
        var lab = el("label", null, wrap);
        var name = el("span", null, lab); name.textContent = c.label;
        var val = el("span", "val", lab);
        var input = el("input", null, wrap);
        input.type = "range"; input.min = c.min; input.max = c.max;
        input.step = c.step || "any"; input.value = c.value;
        var show = function () {
          var v = parseFloat(input.value);
          val.textContent = (c.fmt ? c.fmt(v) : fmtNum(v, c.digits !== undefined ? c.digits : 2)) + (c.unit ? " " + c.unit : "");
        };
        input.addEventListener("input", function () {
          inst.params[c.key] = parseFloat(input.value);
          show();
          if (inst.sim && inst.sim.onControl) inst.sim.onControl(c.key, inst.params[c.key]);
        });
        show();
      } else if (c.type === "select") {
        inst.params[c.key] = c.value;
        var wrap2 = el("div", "ctl", sidePanel);
        var lab2 = el("label", null, wrap2);
        el("span", null, lab2).textContent = c.label;
        var sel = el("select", null, wrap2);
        c.options.forEach(function (o) {
          var opt = el("option", null, sel); opt.value = o[0]; opt.textContent = o[1];
        });
        sel.value = c.value;
        sel.addEventListener("change", function () {
          inst.params[c.key] = sel.value;
          if (inst.sim && inst.sim.onControl) inst.sim.onControl(c.key, sel.value);
        });
      } else if (c.type === "segment") {
        inst.params[c.key] = c.value;
        var wrap3 = el("div", "ctl", sidePanel);
        var lab3 = el("label", null, wrap3);
        el("span", null, lab3).textContent = c.label;
        var seg = el("div", "seg", wrap3);
        var btns = [];
        c.options.forEach(function (o) {
          var bt = el("button", null, seg);
          bt.textContent = o[1];
          bt.setAttribute("aria-pressed", String(o[0] === c.value));
          bt.addEventListener("click", function () {
            inst.params[c.key] = o[0];
            btns.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
            bt.setAttribute("aria-pressed", "true");
            if (inst.sim && inst.sim.onControl) inst.sim.onControl(c.key, o[0]);
          });
          btns.push(bt);
        });
      } else if (c.type === "toggle") {
        inst.params[c.key] = !!c.value;
        var wrap4 = el("div", "ctl ctl-toggle", sidePanel);
        el("span", null, wrap4).textContent = c.label;
        var chk = el("input", null, wrap4); chk.type = "checkbox"; chk.checked = !!c.value;
        chk.addEventListener("change", function () {
          inst.params[c.key] = chk.checked;
          if (inst.sim && inst.sim.onControl) inst.sim.onControl(c.key, chk.checked);
        });
      } else if (c.type === "button") {
        var wrap5 = el("div", "ctl", sidePanel);
        var bt2 = el("button", "action", wrap5);
        bt2.textContent = c.label;
        bt2.addEventListener("click", function () {
          if (inst.sim && inst.sim.onButton) inst.sim.onButton(c.key);
        });
      }
    });

    // readouts
    if (spec.readouts && spec.readouts.length) {
      var ro = el("div", "readouts", sidePanel);
      spec.readouts.forEach(function (rd) {
        var box = el("div", "readout", ro);
        el("div", "k", box).textContent = rd.label;
        var v = el("div", "v", box);
        v.innerHTML = "—" + (rd.unit ? ' <span class="unit">' + rd.unit + "</span>" : "");
        inst.readoutEls[rd.key] = { el: v, unit: rd.unit, digits: rd.digits };
      });
    }

    // --- manipulación directa: handles arrastrables sobre el canvas ---
    // addHandle({x:()=>px, y:()=>px, r?, onDrag(x,y), onStart?, onEnd?}) — el
    // core hace hit-testing, cursores grab/grabbing y dibuja el halo de
    // affordance (para que TODO lo agarrable se vea igual en las 3 pestañas).
    inst.handles = [];
    var hovered = null, active = null;
    function pos(e) {
      var rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function hit(p) {
      for (var i = inst.handles.length - 1; i >= 0; i--) {
        var h = inst.handles[i];
        if (h.hidden && h.hidden()) continue;
        var r = h.r || 20;
        if (Math.hypot(h.x() - p.x, h.y() - p.y) <= r) return h;
      }
      return null;
    }
    canvas.addEventListener("pointerdown", function (e) {
      var p = pos(e);
      var h = hit(p);
      if (!h) return;
      active = h;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
      if (h.onStart) h.onStart(p.x, p.y);
      h.onDrag(p.x, p.y);
      e.preventDefault();
    });
    canvas.addEventListener("pointermove", function (e) {
      var p = pos(e);
      if (active) { active.onDrag(p.x, p.y); return; }
      hovered = hit(p);
      canvas.style.cursor = hovered ? "grab" : "default";
    });
    function release(e) {
      if (!active) return;
      if (active.onEnd) active.onEnd();
      active = null;
      canvas.style.cursor = hovered ? "grab" : "default";
    }
    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);

    inst.drawHandles = function (ctx) {
      inst.handles.forEach(function (h) {
        if (h.hidden && h.hidden()) return;
        var r = h.r || 20;
        var isActive = h === active, isHover = h === hovered;
        ctx.save();
        ctx.beginPath();
        ctx.arc(h.x(), h.y(), Math.max(9, r * 0.55), 0, Math.PI * 2);
        ctx.strokeStyle = tint;
        ctx.globalAlpha = isActive ? 0.95 : isHover ? 0.7 : 0.3;
        ctx.lineWidth = isActive ? 2.4 : 1.4;
        ctx.setLineDash(isActive || isHover ? [] : [3, 4]);
        ctx.stroke();
        if (isActive) {
          ctx.globalAlpha = 0.15;
          ctx.fillStyle = tint;
          ctx.fill();
        }
        ctx.restore();
      });
    };

    // env que ve la sim
    var env = {
      canvas: canvas,
      colors: COLORS,
      tint: tint,
      get params() { return inst.params; },
      get W() { return canvas.clientWidth; },
      get H() { return canvas.clientHeight; },
      setReadout: function (key, value, digits) {
        var r2 = inst.readoutEls[key];
        if (!r2) return;
        r2.el.innerHTML = fmtNum(value, digits !== undefined ? digits : r2.digits) +
          (r2.unit ? ' <span class="unit">' + r2.unit + "</span>" : "");
      },
      plot: {
        push: function (x, values) { if (chart) chart.push(x, values); },
        clear: function () { if (chart) chart.clear(); },
      },
      addHandle: function (h) { inst.handles.push(h); return h; },
      grid: window.SimKit.grid,
      arrow: window.SimKit.arrow,
    };
    inst.env = env;
    inst.sim = spec.create(env);
    return inst;
  }

  function doReset(inst) {
    inst.acc = 0;
    if (inst.chart) inst.chart.clear();
    if (inst.sim && inst.sim.reset) inst.sim.reset();
  }

  /* ---------- tabs ---------- */
  function selectTab(id) {
    document.body.setAttribute("data-tab", id);
    TABS.forEach(function (t) {
      var btn = document.getElementById("tab-" + t);
      var panel = document.getElementById("panel-" + t);
      var on = t === id;
      if (btn) btn.setAttribute("aria-selected", String(on));
      if (panel) panel.hidden = !on;
    });
    try { history.replaceState(null, "", "#" + id); } catch (e) {}
    // re-fit canvases del tab recién mostrado
    instances.forEach(function (inst) {
      if (inst.spec.tab === id) fitCanvas(inst.canvas);
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    if (booted) return; booted = true;

    // intros + counts
    TABS.forEach(function (t) {
      var meta = tabMeta[t];
      var intro = document.querySelector('[data-intro="' + t + '"]');
      if (intro && meta && meta.intro) intro.textContent = meta.intro;
      var count = sims.filter(function (s) { return s.tab === t; }).length;
      var badge = document.querySelector('[data-count="' + t + '"]');
      if (badge) badge.textContent = String(count);
    });

    // chips de salto rápido por tab (antes de las cards, después del intro),
    // agrupados por sección cuando las sims declaran spec.section
    TABS.forEach(function (t) {
      var tabSims = sims.filter(function (s) { return s.tab === t; });
      if (tabSims.length < 2) return;
      var intro = document.querySelector('[data-intro="' + t + '"]');
      if (!intro) return;
      var row = document.createElement("nav");
      row.className = "sim-jump";
      var lastSec = null;
      tabSims.forEach(function (s) {
        if (s.section && s.section !== lastSec) {
          lastSec = s.section;
          var sec = document.createElement("span");
          sec.className = "sec";
          sec.textContent = s.section;
          row.appendChild(sec);
        }
        var a = document.createElement("a");
        a.href = "#sim-" + s.id;
        a.textContent = s.title;
        a.addEventListener("click", function (e) {
          e.preventDefault();
          var card = document.getElementById("sim-" + s.id);
          if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        row.appendChild(a);
      });
      intro.insertAdjacentElement("afterend", row);
    });

    // cards (con header de sección cuando cambia spec.section dentro del tab)
    var lastSectionByTab = {};
    sims.forEach(function (spec) {
      if (spec.section && lastSectionByTab[spec.tab] !== spec.section) {
        lastSectionByTab[spec.tab] = spec.section;
        var panel = document.getElementById("panel-" + spec.tab);
        if (panel) {
          var head = el("div", "sim-section-head", panel);
          var h = el("h2", null, head);
          h.textContent = spec.section;
          var count = sims.filter(function (s) { return s.tab === spec.tab && s.section === spec.section; }).length;
          var n = el("span", "n", head);
          n.textContent = count + (count === 1 ? " laboratorio" : " laboratorios");
        }
      }
      var inst = buildSim(spec);
      if (inst) instances.push(inst);
    });

    // visibilidad (pausa fuera de viewport)
    var io = ("IntersectionObserver" in window)
      ? new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            var inst = instances.find(function (i) { return i.stage === entry.target; });
            if (inst) inst.visible = entry.isIntersecting;
          });
        }, { rootMargin: "80px" })
      : null;
    instances.forEach(function (inst) {
      if (io) io.observe(inst.stage); else inst.visible = true;
    });

    // tabs
    TABS.forEach(function (t) {
      var btn = document.getElementById("tab-" + t);
      if (btn) btn.addEventListener("click", function () { selectTab(t); });
    });
    var initial = (location.hash || "").replace("#", "");
    selectTab(TABS.indexOf(initial) >= 0 ? initial : "f1");

    // reset inicial + loop
    instances.forEach(doReset);
    var last = performance.now();
    function frame(now) {
      var elapsed = Math.min((now - last) / 1000, 0.25);
      last = now;
      var activeTab = document.body.getAttribute("data-tab");
      instances.forEach(function (inst) {
        if (inst.spec.tab !== activeTab || !inst.visible) return;
        if (!fitCanvas(inst.canvas)) return;
        if (inst.playing && inst.sim.step) {
          inst.acc += elapsed;
          var steps = 0;
          while (inst.acc >= DT && steps < MAX_STEPS) {
            inst.sim.step(DT);
            inst.acc -= DT; steps++;
          }
          if (steps === MAX_STEPS) inst.acc = 0;
        }
        var ctx = inst.canvas.getContext("2d");
        ctx.clearRect(0, 0, inst.env.W, inst.env.H);
        inst.sim.draw(ctx, inst.env.W, inst.env.H);
        inst.drawHandles(ctx);
        if (inst.chart) inst.chart.draw();
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
