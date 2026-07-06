/* ============================================================
   CircuitCore — motor de simulación de circuitos transiente
   estilo SPICE/Falstad para el sandbox de Física 3.

   Análisis nodal modificado (MNA) con integración por
   backward Euler (modelos companion para C y L). Fuentes de
   tensión ideales como ramas MNA extra. Solver: eliminación
   gaussiana con pivoteo parcial. Substepping interno adaptativo.

   Script clásico (IIFE, sin imports), compatible file://.
   Expone window.CircuitCore. Determinista (sin Math.random / Date).
   ============================================================ */
(function () {
  "use strict";

  var PI = Math.PI;

  // Resistencias de modelado
  var R_WIRE = 1e-6; // cable / switch cerrado
  var R_OPEN = 1e9; // switch abierto
  var TINY = 1e-300;

  // Defaults por tipo
  var DEFAULTS = {
    wire: {},
    battery: { value: 10 },
    acsource: { value: 10, freq: 50 },
    resistor: { value: 100 },
    capacitor: { value: 100e-6 },
    inductor: { value: 0.1 },
    switch: { closed: true },
  };

  var BRANCH_TYPES = { battery: 1, acsource: 1, inductor: 1 };

  // ---------- utilidades ----------
  function key(p) {
    return p[0] + "," + p[1];
  }

  // exactamente una coordenada difiere → segmento recto H o V válido
  function validSegment(a, b) {
    if (!a || !b) return false;
    var sameX = a[0] === b[0];
    var sameY = a[1] === b[1];
    return sameX !== sameY; // uno igual y el otro distinto
  }

  function median(arr) {
    if (!arr.length) return 0;
    var s = arr.slice().sort(function (x, y) {
      return x - y;
    });
    var m = s.length >> 1;
    return s.length % 2 ? s[m] : 0.5 * (s[m - 1] + s[m]);
  }

  // Eliminación gaussiana con pivoteo parcial. A: n×n (array de filas),
  // b: vector n. Devuelve x. Regulariza pivotes ~0 para robustez.
  function gauss(A, b, n) {
    for (var col = 0; col < n; col++) {
      var piv = col;
      var mx = Math.abs(A[col][col]);
      for (var r = col + 1; r < n; r++) {
        var v = Math.abs(A[r][col]);
        if (v > mx) {
          mx = v;
          piv = r;
        }
      }
      if (mx < TINY) {
        // fila/columna singular → regularizar diagonal
        A[col][col] += 1e-12;
      } else if (piv !== col) {
        var tr = A[piv];
        A[piv] = A[col];
        A[col] = tr;
        var tb = b[piv];
        b[piv] = b[col];
        b[col] = tb;
      }
      var d = A[col][col];
      if (Math.abs(d) < TINY) continue;
      for (var r2 = col + 1; r2 < n; r2++) {
        var f = A[r2][col] / d;
        if (f !== 0) {
          for (var k = col; k < n; k++) A[r2][k] -= f * A[col][k];
          b[r2] -= f * b[col];
        }
      }
    }
    var x = new Array(n);
    for (var i = n - 1; i >= 0; i--) {
      var s = b[i];
      for (var kk = i + 1; kk < n; kk++) s -= A[i][kk] * x[kk];
      var dd = A[i][i];
      x[i] = Math.abs(dd) < TINY ? 0 : s / dd;
    }
    return x;
  }

  // ---------- fábrica de circuito ----------
  function create() {
    var comps = []; // componentes en orden de inserción
    var nextId = 1;
    var time = 0;

    // topología (lazy, recalculada cuando cambia la estructura)
    var built = false;
    var nodeIdx = {}; // "x,y" -> índice de nodo
    var nodePt = []; // índice -> [x,y]
    var N = 0; // cantidad de nodos
    var urow = []; // nodo -> fila de incógnita (o -1 si es tierra)
    var numNodeUnk = 0;
    var branchCol = {}; // id de comp -> columna de rama
    var branchList = [];
    var M = 0; // tamaño del sistema
    var Vnode = []; // voltajes de nodo tras el último solve

    function markDirty() {
      built = false;
    }

    // ---- construcción de topología ----
    function build() {
      nodeIdx = {};
      nodePt = [];
      for (var ci = 0; ci < comps.length; ci++) {
        var c = comps[ci];
        var pts = [c.a, c.b];
        for (var pi = 0; pi < 2; pi++) {
          var kk = key(pts[pi]);
          if (!(kk in nodeIdx)) {
            nodeIdx[kk] = nodePt.length;
            nodePt.push(pts[pi]);
          }
        }
      }
      N = nodePt.length;

      // union-find para agrupar componentes conexos
      var parent = new Array(N);
      for (var i = 0; i < N; i++) parent[i] = i;
      function find(x) {
        while (parent[x] !== x) {
          parent[x] = parent[parent[x]];
          x = parent[x];
        }
        return x;
      }
      function union(a, b) {
        var ra = find(a),
          rb = find(b);
        if (ra !== rb) parent[ra] = rb;
      }
      for (var cj = 0; cj < comps.length; cj++) {
        var cc = comps[cj];
        // toda conexión (incluso C abierto o switch abierto) une el cluster:
        // el modelo companion siempre da un camino de conductancia finita.
        union(nodeIdx[key(cc.a)], nodeIdx[key(cc.b)]);
      }
      // una tierra por cluster: el nodo de menor índice del cluster
      var rootMin = {};
      for (var m = 0; m < N; m++) {
        var r = find(m);
        if (rootMin[r] === undefined || m < rootMin[r]) rootMin[r] = m;
      }
      var isGround = new Array(N);
      for (var g = 0; g < N; g++) isGround[g] = false;
      for (var rk in rootMin) isGround[rootMin[rk]] = true;

      // filas de incógnita por nodo
      urow = new Array(N);
      var cnt = 0;
      for (var u = 0; u < N; u++) urow[u] = isGround[u] ? -1 : cnt++;
      numNodeUnk = cnt;

      // columnas de rama (fuentes de tensión + inductores)
      branchCol = {};
      branchList = [];
      for (var cb = 0; cb < comps.length; cb++) {
        var comp = comps[cb];
        if (BRANCH_TYPES[comp.type]) {
          branchCol[comp.id] = numNodeUnk + branchList.length;
          branchList.push(comp);
        }
      }
      M = numNodeUnk + branchList.length;
      Vnode = new Array(N);
      for (var vz = 0; vz < N; vz++) Vnode[vz] = 0;
      built = true;
    }

    function rowOf(p) {
      return urow[nodeIdx[key(p)]];
    }

    // ---- un paso interno de backward Euler en t = tEval, paso h ----
    function substep(h, tEval) {
      if (M === 0) return;
      var A = new Array(M);
      var z = new Array(M);
      for (var a0 = 0; a0 < M; a0++) {
        A[a0] = new Array(M);
        for (var b0 = 0; b0 < M; b0++) A[a0][b0] = 0;
        z[a0] = 0;
      }

      function stampG(ra, rb, G) {
        if (ra >= 0) A[ra][ra] += G;
        if (rb >= 0) A[rb][rb] += G;
        if (ra >= 0 && rb >= 0) {
          A[ra][rb] -= G;
          A[rb][ra] -= G;
        }
      }

      for (var ci = 0; ci < comps.length; ci++) {
        var c = comps[ci];
        var ra = rowOf(c.a);
        var rb = rowOf(c.b);
        var t = c.type;

        if (t === "wire") {
          stampG(ra, rb, 1 / R_WIRE);
        } else if (t === "switch") {
          stampG(ra, rb, 1 / (c.closed ? R_WIRE : R_OPEN));
        } else if (t === "resistor") {
          var R = c.value > 1e-12 ? c.value : 1e-12;
          stampG(ra, rb, 1 / R);
        } else if (t === "capacitor") {
          var G = c.value / h; // C/h
          stampG(ra, rb, G);
          var Ieq = G * c._vprev; // fuente de corriente equivalente
          if (ra >= 0) z[ra] += Ieq;
          if (rb >= 0) z[rb] -= Ieq;
          c._G = G;
          c._Ieq = Ieq;
        } else if (t === "inductor") {
          var col = branchCol[c.id];
          var Req = c.value / h; // L/h
          // incidencia de la corriente de rama (i de a→b)
          if (ra >= 0) A[ra][col] += 1;
          if (rb >= 0) A[rb][col] -= 1;
          // ecuación de rama: V(a)-V(b) - (L/h) i = -(L/h) i_prev
          if (ra >= 0) A[col][ra] += 1;
          if (rb >= 0) A[col][rb] -= 1;
          A[col][col] -= Req;
          z[col] += -Req * c._iprev;
        } else if (t === "battery" || t === "acsource") {
          var colV = branchCol[c.id];
          var E =
            t === "battery"
              ? c.value
              : c.value * Math.sin(2 * PI * c.freq * tEval);
          // corriente de rama i (a→b): sale de a, entra a b
          if (ra >= 0) A[ra][colV] += 1;
          if (rb >= 0) A[rb][colV] -= 1;
          // restricción: V(b) - V(a) = E  (terminal + en b)
          if (rb >= 0) A[colV][rb] += 1;
          if (ra >= 0) A[colV][ra] -= 1;
          z[colV] = E;
        }
      }

      var x = gauss(A, z, M);

      // voltajes de nodo
      for (var nn = 0; nn < N; nn++) {
        Vnode[nn] = urow[nn] < 0 ? 0 : x[urow[nn]];
      }

      // actualizar corrientes/tensiones y estados de cada componente
      for (var cj = 0; cj < comps.length; cj++) {
        var d = comps[cj];
        var va = Vnode[nodeIdx[key(d.a)]];
        var vb = Vnode[nodeIdx[key(d.b)]];
        d.v = va - vb;
        var tp = d.type;
        if (tp === "wire") {
          d.i = d.v / R_WIRE;
        } else if (tp === "switch") {
          d.i = d.v / (d.closed ? R_WIRE : R_OPEN);
        } else if (tp === "resistor") {
          d.i = d.v / (d.value > 1e-12 ? d.value : 1e-12);
        } else if (tp === "capacitor") {
          d.i = d._G * d.v - d._Ieq;
          d._vprev = d.v;
        } else if (tp === "inductor") {
          d.i = x[branchCol[d.id]];
          d._iprev = d.i;
        } else if (tp === "battery" || tp === "acsource") {
          d.i = x[branchCol[d.id]];
        }
      }
    }

    // ---- estimación del substep h y cantidad de substeps n ----
    function computeH(dt) {
      var hcand = [dt];
      var Rs = [];
      var Cs = [];
      var Ls = [];
      var fmax = 0;
      for (var i = 0; i < comps.length; i++) {
        var c = comps[i];
        if (c.type === "resistor") Rs.push(c.value);
        else if (c.type === "capacitor") Cs.push(c.value);
        else if (c.type === "inductor") Ls.push(c.value);
        else if (c.type === "acsource") fmax = Math.max(fmax, c.freq);
      }
      var Rtyp = Rs.length ? median(Rs) : 1000;
      if (!(Rtyp > 0)) Rtyp = 1000;

      var taus = [];
      for (var ci = 0; ci < Cs.length; ci++) taus.push(Rtyp * Cs[ci]); // RC
      for (var li = 0; li < Ls.length; li++) taus.push(Ls[li] / Rtyp); // L/R
      if (Cs.length && Ls.length) {
        // escala de oscilación LC: 1/ω0 = √(LC) (con el menor L y C)
        var minL = Math.min.apply(null, Ls);
        var minC = Math.min.apply(null, Cs);
        taus.push(Math.sqrt(minL * minC));
      }
      for (var ti = 0; ti < taus.length; ti++) {
        if (taus[ti] > 0) hcand.push(taus[ti] / 20);
      }
      if (fmax > 0) hcand.push(1 / (40 * fmax));

      var h = Math.min.apply(null, hcand);
      if (!(h > 0)) h = dt;
      var n = Math.ceil(dt / h);
      if (!(n >= 1)) n = 1;
      if (n > 400) n = 400;
      h = dt / n;
      return { h: h, n: n };
    }

    // ---------- API pública del circuito ----------
    var api = {};

    api.add = function (spec) {
      if (!spec || !spec.type || !DEFAULTS[spec.type]) return null;
      var a = spec.a,
        b = spec.b;
      if (!a || !b) return null;
      if (a[0] === b[0] && a[1] === b[1]) return null; // a == b
      if (!validSegment(a, b)) return null; // diagonal
      var t = spec.type;
      var def = DEFAULTS[t];
      var comp = {
        id: nextId++,
        type: t,
        a: [a[0], a[1]],
        b: [b[0], b[1]],
        value:
          spec.value !== undefined
            ? spec.value
            : def.value !== undefined
            ? def.value
            : 0,
        freq: t === "acsource" ? (spec.freq !== undefined ? spec.freq : def.freq) : 0,
        closed:
          t === "switch"
            ? spec.closed !== undefined
              ? !!spec.closed
              : def.closed
            : true,
        i: 0,
        v: 0,
        _vprev: 0,
        _iprev: 0,
        _G: 0,
        _Ieq: 0,
      };
      comps.push(comp);
      markDirty();
      return comp.id;
    };

    api.remove = function (id) {
      for (var i = 0; i < comps.length; i++) {
        if (comps[i].id === id) {
          comps.splice(i, 1);
          markDirty();
          return true;
        }
      }
      return false;
    };

    api.clear = function () {
      comps = [];
      nextId = 1;
      time = 0;
      markDirty();
    };

    function findComp(id) {
      for (var i = 0; i < comps.length; i++)
        if (comps[i].id === id) return comps[i];
      return null;
    }

    function view(c) {
      if (!c) return null;
      return {
        id: c.id,
        type: c.type,
        a: [c.a[0], c.a[1]],
        b: [c.b[0], c.b[1]],
        value: c.value,
        freq: c.freq,
        closed: c.closed,
        i: c.i,
        v: c.v,
      };
    }

    api.get = function (id) {
      return view(findComp(id));
    };

    api.list = function () {
      return comps.map(view);
    };

    api.setValue = function (id, value) {
      var c = findComp(id);
      if (c) c.value = value;
      return !!c;
    };

    api.setFreq = function (id, f) {
      var c = findComp(id);
      if (c) c.freq = f;
      return !!c;
    };

    api.toggle = function (id) {
      var c = findComp(id);
      if (c && c.type === "switch") {
        c.closed = !c.closed;
        return c.closed;
      }
      return null;
    };

    api.step = function (dt) {
      if (!(dt > 0)) return;
      if (!built) build();
      if (M === 0) {
        time += dt;
        return;
      }
      var hn = computeH(dt);
      var h = hn.h,
        n = hn.n;
      var t0 = time;
      for (var k = 1; k <= n; k++) {
        time = t0 + k * h;
        substep(h, time);
      }
      time = t0 + dt; // evitar deriva por redondeo
    };

    api.reset = function () {
      time = 0;
      for (var i = 0; i < comps.length; i++) {
        var c = comps[i];
        c._vprev = 0;
        c._iprev = 0;
        c.i = 0;
        c.v = 0;
        c._G = 0;
        c._Ieq = 0;
      }
      if (built) {
        for (var v = 0; v < N; v++) Vnode[v] = 0;
      }
    };

    api.nodeVoltage = function (p) {
      if (!built) build();
      var kk = key(p);
      if (!(kk in nodeIdx)) return null;
      return Vnode[nodeIdx[kk]];
    };

    api.serialize = function () {
      return {
        v: 1,
        nextId: nextId,
        time: time,
        components: comps.map(function (c) {
          var o = {
            id: c.id,
            type: c.type,
            a: [c.a[0], c.a[1]],
            b: [c.b[0], c.b[1]],
          };
          if (c.type !== "wire" && c.type !== "switch") o.value = c.value;
          if (c.type === "acsource") o.freq = c.freq;
          if (c.type === "switch") o.closed = c.closed;
          return o;
        }),
      };
    };

    api._loadFrom = function (obj) {
      comps = [];
      nextId = 1;
      time = 0;
      var maxId = 0;
      var list = (obj && obj.components) || [];
      for (var i = 0; i < list.length; i++) {
        var s = list[i];
        if (!s || !s.type || !DEFAULTS[s.type]) continue;
        var def = DEFAULTS[s.type];
        var comp = {
          id: s.id !== undefined ? s.id : nextId,
          type: s.type,
          a: [s.a[0], s.a[1]],
          b: [s.b[0], s.b[1]],
          value:
            s.value !== undefined
              ? s.value
              : def.value !== undefined
              ? def.value
              : 0,
          freq:
            s.type === "acsource"
              ? s.freq !== undefined
                ? s.freq
                : def.freq
              : 0,
          closed:
            s.type === "switch"
              ? s.closed !== undefined
                ? !!s.closed
                : def.closed
              : true,
          i: 0,
          v: 0,
          _vprev: 0,
          _iprev: 0,
          _G: 0,
          _Ieq: 0,
        };
        comps.push(comp);
        if (comp.id > maxId) maxId = comp.id;
      }
      nextId = (obj && obj.nextId) || maxId + 1;
      if (nextId <= maxId) nextId = maxId + 1;
      markDirty();
      return api;
    };

    Object.defineProperty(api, "time", {
      get: function () {
        return time;
      },
      enumerable: true,
    });

    return api;
  }

  // ---------- presets (serializados, listos para load) ----------
  function preset(specs) {
    var c = create();
    for (var i = 0; i < specs.length; i++) c.add(specs[i]);
    return c.serialize();
  }

  var W = function (a, b) {
    return { type: "wire", a: a, b: b };
  };

  var PRESETS = {};

  // divisor: batería 12V + R1(100) en serie con R2(200) → nodo medio 8V
  PRESETS.divisor = preset([
    { type: "battery", a: [4, 10], b: [4, 4], value: 12 }, // - en [4,10], + en [4,4]
    W([4, 4], [8, 4]),
    { type: "resistor", a: [8, 4], b: [12, 4], value: 100 }, // R1
    { type: "resistor", a: [12, 4], b: [16, 4], value: 200 }, // R2
    W([16, 4], [16, 10]),
    W([16, 10], [4, 10]),
  ]);

  // mallas2: ε1=12, ε2=6, R1=4, R2=6, R3=3
  // 3 ramas verticales entre riel superior (A, y=4) y riel inferior (B, y=10)
  // i1=1.667 (batería izq a→b), i2=0.111 (batería der a→b), i3=1.778 (R3 a→b)
  PRESETS.mallas2 = preset([
    // rama izquierda: ε1 (+ arriba) en serie con R1
    { type: "battery", a: [6, 10], b: [6, 7], value: 12 },
    { type: "resistor", a: [6, 7], b: [6, 4], value: 4 },
    // rama media: R3 (arriba A → abajo B)
    { type: "resistor", a: [12, 4], b: [12, 7], value: 3 },
    W([12, 7], [12, 10]),
    // rama derecha: ε2 (+ arriba) en serie con R2
    { type: "battery", a: [18, 10], b: [18, 7], value: 6 },
    { type: "resistor", a: [18, 7], b: [18, 4], value: 6 },
    // riel superior A
    W([6, 4], [12, 4]),
    W([12, 4], [18, 4]),
    // riel inferior B
    W([6, 10], [12, 10]),
    W([12, 10], [18, 10]),
  ]);

  // wheatstone: dos divisores en paralelo + galvanómetro (R central)
  // balanceado (R1=R3, R2=R4) → i_galvanómetro ≈ 0
  PRESETS.wheatstone = preset([
    // batería a la izquierda (+ arriba)
    { type: "battery", a: [4, 10], b: [4, 4], value: 12 },
    // riel superior A
    W([4, 4], [8, 4]),
    W([8, 4], [16, 4]),
    // riel inferior C
    W([4, 10], [8, 10]),
    W([8, 10], [16, 10]),
    // divisor 1 (x=8): R1 arriba, R2 abajo, nodo medio B=[8,7]
    { type: "resistor", a: [8, 4], b: [8, 7], value: 100 }, // R1
    { type: "resistor", a: [8, 7], b: [8, 10], value: 200 }, // R2
    // divisor 2 (x=16): R3 arriba, R4 abajo, nodo medio D=[16,7]
    { type: "resistor", a: [16, 4], b: [16, 7], value: 100 }, // R3
    { type: "resistor", a: [16, 7], b: [16, 10], value: 200 }, // R4
    // galvanómetro entre B y D (horizontal, y=7)
    W([8, 7], [10, 7]),
    { type: "resistor", a: [10, 7], b: [14, 7], value: 50 }, // Rg
    W([14, 7], [16, 7]),
  ]);

  // rc: batería 10V + switch + R(1000) + C(1e-3) → τ = RC = 1s
  PRESETS.rc = preset([
    { type: "battery", a: [4, 10], b: [4, 4], value: 10 },
    W([4, 4], [8, 4]),
    { type: "switch", a: [8, 4], b: [12, 4], closed: true },
    { type: "resistor", a: [12, 4], b: [16, 4], value: 1000 },
    { type: "capacitor", a: [16, 4], b: [16, 8], value: 1e-3 },
    W([16, 8], [16, 10]),
    W([16, 10], [4, 10]),
  ]);

  // rl: batería 10V + switch + R(10) + L(1) → τ = L/R = 0.1s
  PRESETS.rl = preset([
    { type: "battery", a: [4, 10], b: [4, 4], value: 10 },
    W([4, 4], [8, 4]),
    { type: "switch", a: [8, 4], b: [12, 4], closed: true },
    { type: "resistor", a: [12, 4], b: [16, 4], value: 10 },
    { type: "inductor", a: [16, 4], b: [16, 8], value: 1 },
    W([16, 8], [16, 10]),
    W([16, 10], [4, 10]),
  ]);

  // rlc-dc: batería 10V + switch + R(10) + L(1) + C(1e-3) en serie
  // subamortiguado: α=R/2L=5 << ω0=1/√(LC)=31.6 → T ≈ 0.201s
  PRESETS["rlc-dc"] = preset([
    { type: "battery", a: [4, 10], b: [4, 4], value: 10 },
    W([4, 4], [6, 4]),
    { type: "switch", a: [6, 4], b: [10, 4], closed: true },
    { type: "resistor", a: [10, 4], b: [14, 4], value: 10 },
    { type: "inductor", a: [14, 4], b: [18, 4], value: 1 },
    { type: "capacitor", a: [18, 4], b: [18, 8], value: 1e-3 },
    W([18, 8], [18, 10]),
    W([18, 10], [4, 10]),
  ]);

  // rlc-ac: fuente AC(10V) + R(5) + L(0.1) + C(1e-4) en serie
  // f0 = 1/(2π√(LC)) ≈ 50.3 Hz; fuente a 50 Hz → resonancia visible
  PRESETS["rlc-ac"] = preset([
    { type: "acsource", a: [4, 10], b: [4, 4], value: 10, freq: 50 },
    W([4, 4], [8, 4]),
    { type: "resistor", a: [8, 4], b: [12, 4], value: 5 },
    { type: "inductor", a: [12, 4], b: [16, 4], value: 0.1 },
    { type: "capacitor", a: [16, 4], b: [16, 8], value: 1e-4 },
    W([16, 8], [16, 10]),
    W([16, 10], [4, 10]),
  ]);

  // ---------- export ----------
  var CircuitCore = {
    create: create,
    load: function (obj) {
      var c = create();
      c._loadFrom(obj);
      return c;
    },
    PRESETS: PRESETS,
  };

  var root =
    typeof window !== "undefined"
      ? window
      : typeof globalThis !== "undefined"
      ? globalThis
      : this;
  root.CircuitCore = CircuitCore;
})();
