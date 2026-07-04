"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import s from "./PlannerIntro.module.css";

// Pseudo-landing de /electivas: presenta cada feature del planificador con
// visuales que se revelan al scrollear (IntersectionObserver) y cierra con un
// CTA que ENLAZA a la app real en /electivas/planificar/ (no hace scroll a un
// ancla — la herramienta vive en otra ruta). Respeta prefers-reduced-motion
// (sin transforms ni autoplay). Static-export safe: todo acceso a
// window/matchMedia va detrás de guards.

const APP_HREF = "/electivas/planificar/";
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

const prefersReduced = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Observa un elemento y devuelve si ya entró en viewport (una sola vez). */
function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced() || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/** Bloque de texto de una feature (eyebrow + título + dek), con reveal. */
function FeatureText({
  eyebrow,
  icon,
  title,
  children,
  extra,
}: {
  eyebrow: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
  extra?: ReactNode;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={cx(s.text, s.reveal, inView && s.isVisible)}>
      <div className={s.eyebrow}>
        {icon}
        {eyebrow}
      </div>
      <h2 className={s.title}>{title}</h2>
      <p className={s.dek}>{children}</p>
      {extra}
    </div>
  );
}

/* ------------------------------------------------------------ */
/* Feature — optimizador (plan por cuatrimestre, autoplay)      */
/* ------------------------------------------------------------ */
const MODES = [
  { label: "Recibirte antes", counts: [3, 3, 2, 2, 0], days: [4, 4, 3, 3, 0] },
  { label: "Menos días de campus", counts: [2, 2, 2, 2, 2], days: [2, 2, 2, 2, 2] },
  { label: "Carga pareja", counts: [2, 2, 2, 2, 2], days: [3, 3, 3, 3, 3] },
];

function PlanVisual() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [mode, setMode] = useState(0);
  // Una elección manual frena el autoplay: la demo no le pisa el modo al usuario.
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (!inView || manual || prefersReduced()) return;
    const id = window.setInterval(() => {
      setMode((m) => (m + 1) % MODES.length);
    }, 3400);
    return () => window.clearInterval(id);
  }, [inView, manual]);

  const pick = (i: number) => {
    setManual(true);
    setMode(i);
  };

  const m = MODES[mode];
  return (
    <div ref={ref} className={cx(s.visualCard, s.revealVisual, inView && s.isVisible)}>
      <span className={s.vTag}>vista previa</span>
      {/* Botones toggle (aria-pressed), no tabs: cambian una misma vista previa,
          no alternan paneles con contenido propio. */}
      <div className={s.modePills} role="group" aria-label="Modo de optimización">
        {MODES.map((mm, i) => (
          <button
            key={mm.label}
            type="button"
            aria-pressed={i === mode}
            className={cx(s.modePill, i === mode && s.modePillActive)}
            onClick={() => pick(i)}
          >
            {mm.label}
          </button>
        ))}
      </div>
      <div className={s.planColumns}>
        {m.counts.map((count, i) => (
          <div key={i} className={s.planCol}>
            <div className={s.barWrap}>
              <div className={s.planBar} style={{ "--n": count } as CSSProperties} />
            </div>
            <div className={s.daysRow}>
              {Array.from({ length: 5 }).map((_, di) => (
                <span key={di} className={cx(s.dayDot, di < m.days[i] && s.dayDotOn)} />
              ))}
            </div>
            <div className={s.colLabel}>C{i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ */
/* Feature — correlativas (grafo)                               */
/* ------------------------------------------------------------ */
function CorrVisual() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const nodes: [string, number, number, "go" | "wait", number][] = [
    ["AM1", 62, 174, "go", 0],
    ["AL1", 62, 46, "go", 0.1],
    ["AM2", 180, 116, "wait", 0.28],
    ["IO", 180, 32, "wait", 0.36],
    ["PROB", 300, 172, "wait", 0.56],
    ["ONL", 300, 72, "wait", 0.64],
  ];
  return (
    <div ref={ref} className={cx(s.visualCard, s.revealVisual, inView && s.isVisible)}>
      <span className={s.vTag}>vista previa</span>
      <svg className={s.graphSvg} viewBox="0 0 400 210" aria-hidden="true">
        <path className={s.gEdge} pathLength={1} d="M74 174 L172 118" />
        <path className={s.gEdge} pathLength={1} d="M74 46 L172 32" />
        <path className={s.gEdge} pathLength={1} d="M188 116 L292 168" />
        <path className={s.gEdge} pathLength={1} d="M188 112 L290 78" />
        <path className={s.gEdge} pathLength={1} d="M188 36 L288 74" />
        {nodes.map(([label, x, y, tone, delay]) => (
          <g
            key={label}
            className={cx(s.gNode, tone === "go" ? s.gNodeGo : s.gNodeWait)}
            style={{ "--nd": `${delay}s` } as CSSProperties}
          >
            <circle cx={x} cy={y} r={18} />
            <text x={x} y={y + 4}>
              {label}
            </text>
          </g>
        ))}
      </svg>
      <div className={s.graphLegend}>
        <span className={s.legendItem}>
          <span className={cx(s.legendDot, s.legendDotGo)} />
          disponible
        </span>
        <span className={s.legendItem}>
          <span className={cx(s.legendDot, s.legendDotWait)} />
          requiere correlativa
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ */
/* Feature — combinador de horarios (semana)                    */
/* ------------------------------------------------------------ */
function WeekVisual() {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={cx(s.visualCard, s.revealVisual, inView && s.isVisible)}>
      <span className={s.vTag}>vista previa</span>
      <div className={s.weekGrid} aria-hidden="true">
        <div className={s.weekHead} />
        {["L", "M", "X", "J", "V"].map((day) => (
          <div key={day} className={cx(s.weekHead, s.mono)}>
            {day}
          </div>
        ))}
        {["8", "11", "14", "17"].map((h, i) => (
          <div key={h} className={cx(s.weekTime, s.mono)} style={{ gridRow: i + 2 }}>
            {h}
          </div>
        ))}
        <div className={cx(s.weekBlock, s.toneAccent)} style={{ gridColumn: 2, gridRow: "2 / span 2" }}>
          AED3
        </div>
        <div className={cx(s.weekBlock, s.toneLink)} style={{ gridColumn: 3, gridRow: "3 / span 2" }}>
          PROB
        </div>
        <div className={cx(s.weekBlock, s.toneWarn)} style={{ gridColumn: 4, gridRow: "2 / span 2" }}>
          REDES
        </div>
        <div className={cx(s.weekBlock, s.tonePromo)} style={{ gridColumn: 5, gridRow: "3 / span 3" }}>
          SO
        </div>
        <div className={cx(s.weekFree, s.mono)} style={{ gridColumn: 6, gridRow: "2 / span 4" }}>
          libre
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ */
/* Feature — combinador de finales (línea de tiempo del turno)  */
/* ------------------------------------------------------------ */
const FINALS: { code: string; date: string; tone: string; pos: number }[] = [
  { code: "AED3", date: "07 jul", tone: "toneAccent", pos: 15 },
  { code: "REDES", date: "15 jul", tone: "toneLink", pos: 50 },
  { code: "SO", date: "24 jul", tone: "tonePromo", pos: 85 },
];

function FinalesVisual() {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={cx(s.visualCard, s.revealVisual, inView && s.isVisible)}>
      <span className={s.vTag}>vista previa</span>
      <div className={cx(s.finHead, s.mono)}>Turno de finales · Julio</div>
      <div className={s.finLine} aria-hidden="true">
        <span className={s.finTrack} />
        <span className={s.finGap} style={{ left: "15%", width: "35%" }}>
          repaso
        </span>
        <span className={s.finGap} style={{ left: "50%", width: "35%" }}>
          repaso
        </span>
        {FINALS.map((f, i) => (
          <div
            key={f.code}
            className={s.finMark}
            style={{ left: `${f.pos}%`, "--mi": i } as CSSProperties}
          >
            <span className={cx(s.finChip, s[f.tone])}>{f.code}</span>
            <span className={cx(s.finDot, s[f.tone])} />
            <span className={cx(s.finDate, s.mono)}>{f.date}</span>
          </div>
        ))}
      </div>
      <div className={s.finLegend}>
        <span className={s.finBadge}>
          <span className={s.finTick} />
          sin superposición
        </span>
        <span className={cx(s.finExport, s.mono)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M12 15V4M8 8l4-4 4 4" />
            <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
          </svg>
          exportar a tu calendario
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ */
/* Feature — minors (anillos + count-up)                        */
/* ------------------------------------------------------------ */
const MINORS = [
  { code: "CD", color: "var(--min-cd)", pct: 75 },
  { code: "IRV", color: "var(--min-irv)", pct: 40 },
  { code: "IA", color: "var(--min-ia)", pct: 90 },
  { code: "ARQ", color: "var(--min-arq)", pct: 25 },
];

function MinorsVisual() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [vals, setVals] = useState<number[]>(() => MINORS.map(() => 0));

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced()) {
      setVals(MINORS.map((m) => m.pct));
      return;
    }
    const duration = 1150;
    let raf = 0;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVals(MINORS.map((m) => Math.round(m.pct * eased)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <div ref={ref} className={cx(s.visualCard, s.revealVisual, inView && s.isVisible)}>
      <span className={s.vTag}>vista previa</span>
      <div className={s.minorsGrid}>
        {MINORS.map((m, i) => (
          <div key={m.code} className={s.ringBlock}>
            <div className={s.ring} style={{ "--ring-color": m.color } as CSSProperties}>
              <svg viewBox="0 0 100 100">
                <circle className={s.ringTrack} cx="50" cy="50" r="42" />
                <circle
                  className={s.ringProgress}
                  cx="50"
                  cy="50"
                  r="42"
                  pathLength={100}
                  style={{ "--pct": inView ? m.pct : 0 } as CSSProperties}
                />
              </svg>
              <div className={s.ringLabel}>
                <span className={cx(s.ringPct, s.mono)}>{vals[i]}%</span>
              </div>
            </div>
            <span className={s.minorBadge} style={{ "--m-color": m.color } as CSSProperties}>
              {m.code}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ */
/* Feature — finalizá y compartí (lock + export/import)         */
/* ------------------------------------------------------------ */
function LockVisual() {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={cx(s.visualCard, s.revealVisual, inView && s.isVisible)}>
      <span className={s.vTag}>vista previa</span>
      <div className={s.lockScene} aria-hidden="true">
        <div className={s.semCard}>
          <div className={cx(s.semBorder, s.semBorderDashed)} />
          <div className={cx(s.semBorder, s.semBorderSolid)} />
          <div className={s.semTop}>
            <span className={s.semName}>Cuatrimestre 6</span>
            <span className={s.lockIcon}>
              <svg viewBox="0 0 24 24" width="22" height="22">
                <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path
                  className={s.lockShackle}
                  d="M8 11V7a4 4 0 0 1 8 0v4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </span>
          </div>
          <div className={s.semChips}>
            <span className={s.chipMini}>AED3</span>
            <span className={s.chipMini}>REDES</span>
            <span className={s.chipMini}>SO</span>
          </div>
          <div className={s.semStatus}>
            <span className={cx(s.statusBefore, s.mono)}>sin lockear</span>
            <span className={cx(s.statusAfter, s.mono)}>lockeado ✓</span>
          </div>
        </div>
        <div className={s.ioRow}>
          <div className={cx(s.ioItem, s.ioExport)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M12 15V4M8 8l4-4 4 4" />
              <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
            </svg>
            <span>exportar preferencias</span>
          </div>
          <div className={cx(s.ioItem, s.ioImport)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M12 4v11M8 11l4 4 4-4" />
              <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
            </svg>
            <span>importar preferencias</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ */
/* Iconos de eyebrow                                            */
/* ------------------------------------------------------------ */
const ICON = {
  optim: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3.5" y="12" width="4" height="8" rx="1" />
      <rect x="10" y="7" width="4" height="13" rx="1" />
      <rect x="16.5" y="3" width="4" height="17" rx="1" />
    </svg>
  ),
  corr: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="5" cy="6" r="2.2" />
      <circle cx="19" cy="6" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <path d="M7 7l3.3 9M17 7l-3.3 9M7.2 6h9.6" strokeWidth="1.3" />
    </svg>
  ),
  week: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M9 4v17M15 4v17" />
    </svg>
  ),
  finales: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
      <path d="M9 15.5l2 2 4-4.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  minor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 8 8" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  ),
};

/* ------------------------------------------------------------ */
/* Componente principal                                         */
/* ------------------------------------------------------------ */
export default function PlannerIntro() {
  const arrow = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className={s.intro}>
      {/* HERO */}
      <section className={s.hero}>
        <div className={s.wrap}>
          <div className={s.heroInner}>
            <div className={s.heroEyebrow}>Planificador de electivas</div>
            <h1 className={s.heroTitle}>
              Armá tu carrera, <em>cuatrimestre por cuatrimestre</em>
            </h1>
            <p className={s.heroDek}>
              Un plan completo, un horario armado y las correlativas resueltas —
              antes de que te anotes a nada.
            </p>
            <div className={s.heroCtas}>
              <Link href={APP_HREF} className={cx(s.btn, s.btnPrimary)}>
                Abrir planificador
                <span className={s.btnIcon}>{arrow}</span>
              </Link>
              <a href="#features" className={cx(s.btn, s.btnGhost)}>
                Ver las herramientas
              </a>
            </div>
            <div className={cx(s.heroMeta, s.mono)}>
              <span>
                <b>6</b> herramientas en una sola vista
              </span>
              <span>Se adapta a tus preferencias</span>
              <span>Pensado para ITBA</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <div id="features">
        <section className={s.feature}>
          <div className={cx(s.wrap, s.featureGrid)}>
            <FeatureText
              eyebrow="01 — Optimizador de plan"
              icon={ICON.optim}
              title="Un optimizador ordena toda tu carrera"
              extra={
                <div className={cx(s.modesHint, s.mono)}>
                  <span>
                    <span className={s.hintDot} />
                    Recibirte antes
                  </span>
                  <span>
                    <span className={s.hintDot} />
                    Menos días de campus
                  </span>
                  <span>
                    <span className={s.hintDot} />
                    Carga pareja
                  </span>
                </div>
              }
            >
              Elegís qué priorizar y el planificador acomoda las materias que te
              faltan, cuatrimestre por cuatrimestre. Cambiás de estrategia cuando
              quieras, sin perder el trabajo hecho.
            </FeatureText>
            <div className={s.featureVisual}>
              <PlanVisual />
            </div>
          </div>
        </section>

        <section className={s.feature}>
          <div className={cx(s.wrap, s.featureGrid, s.reverse)}>
            <FeatureText
              eyebrow="02 — Correlativas"
              icon={ICON.corr}
              title="El árbol de correlativas, resuelto de un vistazo"
            >
              Cada materia muestra de qué depende y qué desbloquea. Los nodos
              disponibles se distinguen al toque de los que todavía tenés que
              esperar.
            </FeatureText>
            <div className={s.featureVisual}>
              <CorrVisual />
            </div>
          </div>
        </section>

        <section className={s.feature}>
          <div className={cx(s.wrap, s.featureGrid)}>
            <FeatureText
              eyebrow="03 — Combinador de horarios"
              icon={ICON.week}
              title="Armá un cuatrimestre y mirá cómo queda la semana"
            >
              Elegís las materias y las comisiones, y el calendario semanal se
              arma solo — con los cruces de horario resueltos antes de que
              existan.
            </FeatureText>
            <div className={s.featureVisual}>
              <WeekVisual />
            </div>
          </div>
        </section>

        <section className={s.feature}>
          <div className={cx(s.wrap, s.featureGrid, s.reverse)}>
            <FeatureText
              eyebrow="04 — Combinador de finales"
              icon={ICON.finales}
              title="Un turno de finales sin choques y con repaso"
            >
              El combinador cruza las fechas de mesa de cada materia y arma un
              turno sin superposiciones, dejando días de repaso entre una y otra.
              Exportalo a tu calendario y listo.
            </FeatureText>
            <div className={s.featureVisual}>
              <FinalesVisual />
            </div>
          </div>
        </section>

        <section className={s.feature}>
          <div className={cx(s.wrap, s.featureGrid)}>
            <FeatureText
              eyebrow="05 — Minors"
              icon={ICON.minor}
              title="Tu progreso en cada área, siempre a la vista"
            >
              Ciencia de Datos, Imágenes y Realidad Virtual, Inteligencia
              Artificial, Arquitectura de Software — cuatro anillos que se van
              llenando a medida que avanzás.
            </FeatureText>
            <div className={s.featureVisual}>
              <MinorsVisual />
            </div>
          </div>
        </section>

        <section className={s.feature}>
          <div className={cx(s.wrap, s.featureGrid, s.reverse)}>
            <FeatureText
              eyebrow="06 — Finalizá y compartí"
              icon={ICON.lock}
              title="Lockeá el cuatrimestre y llevate tu plan"
            >
              Cuando un cuatrimestre queda como lo querés, lo lockeás para que el
              optimizador no lo vuelva a tocar. Exportá tus preferencias o
              importalas en otra sesión.
            </FeatureText>
            <div className={s.featureVisual}>
              <LockVisual />
            </div>
          </div>
        </section>
      </div>

      {/* CTA FINAL */}
      <section className={s.cta}>
        <div className={s.wrap}>
          <div className={s.ctaCard}>
            <div className={s.ctaGlow} aria-hidden="true" />
            <div className={s.ctaCopy}>
              <span className={cx(s.ctaEyebrow, s.mono)}>Todo en una vista</span>
              <h2 className={s.ctaTitle}>Armá tu cursada en minutos</h2>
              <p className={s.ctaDek}>
                Correlativas, horarios, minors y finales, cuatrimestre por
                cuatrimestre. Sin instalar nada.
              </p>
            </div>
            <Link href={APP_HREF} className={cx(s.btn, s.btnPrimary, s.btnLg)}>
              Abrir planificador
              <span className={s.btnIcon}>{arrow}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
