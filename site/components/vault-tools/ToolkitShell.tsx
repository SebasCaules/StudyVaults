"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@studyvaults/ui";
import { useUrlState, setOrDelete } from "@/lib/url-state/core";
import ToolIcon, { type ToolIconName } from "./ToolIcon";

/**
 * Tono de rol de una card en la grilla continua. Mapea a un token de rol
 * (definido en toolkit.css sobre tokens reales — nada de hex): así una materia
 * distingue sus categorías por color sin partir la grilla en secciones.
 */
export type ToolTone =
  | "def"
  | "theorem"
  | "formula"
  | "method"
  | "caution"
  | "example"
  | "accent"
  | "vault";

/** tono → variable CSS (resuelta en .tk, ver toolkit.css). */
const TONE_VAR: Record<ToolTone, string> = {
  def: "var(--role-def)",
  theorem: "var(--role-theorem)",
  formula: "var(--role-formula)",
  method: "var(--role-method)",
  caution: "var(--role-caution)",
  example: "var(--role-example)",
  accent: "var(--role-accent)",
  vault: "var(--vault-tint)",
};

export interface Tool {
  key: string;
  label: string;
  node: ReactNode;
  /** Categoría opcional: agrupa la herramienta en la grilla (con encabezado). */
  group?: string;
  /** Ícono que comunica de qué se trata la herramienta de un vistazo. */
  icon?: ToolIconName;
  /** Una línea en lenguaje llano: qué hace y para qué sirve (sin jerga). */
  desc?: ReactNode;
  /** Verbo de acción para el CTA: "Calcular", "Practicar", "Repasar"… */
  verb?: string;
  /** Tono de rol de la card en la grilla continua (default: tinte de la materia). */
  tone?: ToolTone;
  /**
   * Bajada del *afiche* del runner (cuando la herramienta está abierta). Si se
   * omite cae a `desc`. Sirve para dar en el afiche una explicación un poco más
   * rica que la línea de la card, sin tocar el cuerpo de la tool.
   */
  blurb?: ReactNode;
  /**
   * Micro-ilustración *bespoke* del afiche del runner: un SVG propio que comunica
   * de qué se trata la herramienta de un vistazo (matriz, campana de Gauss, curvas
   * de mercado…). Debe pintarse con tokens de rol — usar `var(--k-color)` para que
   * matchee el tono de la tool. Si se omite, el runner arma un motivo generativo a
   * partir del `icon` (ícono grande tonal sobre un campo blueprint).
   */
  poster?: ReactNode;
}

/**
 * Identidad *bespoke* del launcher de una materia: el hero (motivo + kicker +
 * título + bajada + meta) que precede a la grilla de cards. Cada toolkit pasa
 * la suya; el runner (la vista de herramienta abierta) NO cambia — es común a
 * todas las materias.
 */
export interface LauncherIdentity {
  /** Código de sistema mono, p.ej. "SYS.01". */
  code?: string;
  /** Kicker/eyebrow en mayúsculas, p.ej. "ÁLGEBRA LINEAL NUMÉRICA". */
  kicker: string;
  /** Título grande del hero, p.ej. "Métodos Numéricos Avanzados". */
  title: string;
  /** Bajada breve (una o dos líneas). */
  dek?: ReactNode;
  /** Meta mono (cantidad de tools, categorías, ruta…). Componer con <span>. */
  meta?: ReactNode;
  /** Motivo SVG propio de la materia (columna derecha del hero). */
  motif?: ReactNode;
  /** Token de acento del hero (default: var(--vault-tint)). Ej. "var(--link)". */
  accent?: string;
  /** Motivo de fondo del hero. */
  pattern?: "grid" | "radial" | "cross" | "none";
  /** Layout de la grilla: "grid" (continua con categoría in-card) o "flat" (kit único, cards grandes). */
  variant?: "grid" | "flat";
}

/**
 * Shell de los toolkits por materia — una "grilla de cards-lanzador": por
 * defecto muestra una tarjeta por herramienta, agrupadas por `group` (con
 * encabezado de grupo cuando lo hay; sin `group` caen en un único bloque sin
 * encabezado). Al abrir una card se monta solo la herramienta activa a ancho
 * completo, con un breadcrumb para volver a la grilla o saltar a otra tool.
 *
 * Cada herramienta conserva su estado mientras está visible; al cambiar de
 * tool el panel se remonta (`key={active}`) para disparar la entrada y el
 * cleanup de la anterior (p.ej. la pizarra de diagramas).
 *
 * Compatible hacia atrás: la interfaz `Tool` y la firma de `ToolkitShell`
 * no cambian — sólo cambia la presentación.
 */
export default function ToolkitShell({
  intro,
  tools,
  launcher,
}: {
  intro?: ReactNode;
  tools: Tool[];
  /** Identidad bespoke del launcher. Si se omite, cae al launcher clásico. */
  launcher?: LauncherIdentity;
}) {
  const base = useId();
  // `tool` en la URL = key de la herramienta activa (ausente = grilla). Deep-link:
  // recargar y compartir el link reproducen la tool abierta. `push` para que
  // Atrás del navegador vuelva de la tool a la grilla (ver lib/url-state/README.md).
  const [active, setActive] = useUrlState<string | null>({
    initial: null,
    decode: (p) => {
      const t = p.get("tool");
      return t && tools.some((tool) => tool.key === t) ? t : null; // validar contra ESTE toolkit
    },
    encode: (v, p) => setOrDelete(p, "tool", v ?? "", v != null),
    mode: "push",
  });

  const order = useMemo(() => tools.map((t) => t.key), [tools]);
  const activeIdx = active ? order.indexOf(active) : -1;
  const activeTool = activeIdx >= 0 ? tools[activeIdx] : undefined;

  // Agrupar preservando el orden original. Tramos contiguos con el mismo
  // `group` (o sin group) forman un bloque; el número es el índice global 1-based.
  const groups = useMemo(() => {
    const out: { name: string | null; items: { tool: Tool; n: number }[] }[] = [];
    tools.forEach((tool, i) => {
      const name = tool.group ?? null;
      const last = out[out.length - 1];
      if (!last || last.name !== name) out.push({ name, items: [{ tool, n: i + 1 }] });
      else last.items.push({ tool, n: i + 1 });
    });
    return out;
  }, [tools]);

  const cardId = (k: string) => `${base}-tk-card-${k}`;
  const total = String(tools.length).padStart(2, "0");

  // Al abrir una herramienta, llevar el foco al encabezado del panel (a11y).
  const headRef = useRef<HTMLDivElement | null>(null);
  // Al volver a la grilla, devolver el foco a la card que estaba abierta.
  const returnKey = useRef<string | null>(null);
  const [pendingFocus, setPendingFocus] = useState<string | null>(null);

  const open = (k: string) => {
    returnKey.current = k;
    setActive(k);
  };
  const back = () => {
    setPendingFocus(returnKey.current);
    setActive(null);
  };

  useEffect(() => {
    if (active) headRef.current?.focus();
  }, [active]);

  useEffect(() => {
    if (active === null && pendingFocus) {
      document.getElementById(cardId(pendingFocus))?.focus();
      setPendingFocus(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, pendingFocus]);

  // ---- vista: grilla de cards ----
  if (!activeTool) {
    // Card "clásica" (launcher legacy, sin identidad): ícono + número + CTA.
    const legacyCard = (tool: Tool, n: number) => (
      <button
        key={tool.key}
        id={cardId(tool.key)}
        type="button"
        className={cn("tk__card", !tool.desc && "tk__card--bare")}
        onClick={() => open(tool.key)}
      >
        <span className="tk__card-top">
          <span className="tk__card-ico" aria-hidden="true">
            <ToolIcon name={tool.icon ?? "blocks"} />
          </span>
          <span className="tk__card-num" aria-hidden="true">
            {String(n).padStart(2, "0")}
          </span>
        </span>
        <span className="tk__card-label">{tool.label}</span>
        {tool.desc && <span className="tk__card-desc">{tool.desc}</span>}
        <span className="tk__card-cta" aria-hidden="true">
          {tool.verb ?? "Abrir"}
          <i className="tk__card-arrow">→</i>
        </span>
      </button>
    );

    if (launcher) {
      const flat = launcher.variant === "flat";
      // Card "toned" (launcher bespoke): categoría in-card + tinte de rol.
      const tonedCard = (tool: Tool) => (
        <button
          key={tool.key}
          id={cardId(tool.key)}
          type="button"
          className={cn("tk__card", "tk__card--toned", flat && "tk__card--lg")}
          style={{ ["--k-color"]: TONE_VAR[tool.tone ?? "vault"] } as CSSProperties}
          onClick={() => open(tool.key)}
        >
          {!flat && tool.group && (
            <span className="tk__card-cat">
              <span className="tk__card-cat-dot" aria-hidden="true" />
              {tool.group}
            </span>
          )}
          <span className="tk__card-ico" aria-hidden="true">
            <ToolIcon name={tool.icon ?? "blocks"} size={flat ? 22 : 18} />
          </span>
          <span className="tk__card-label">{tool.label}</span>
          {tool.desc && <span className="tk__card-desc">{tool.desc}</span>}
        </button>
      );

      return (
        <div className="tk">
          <div
            className={cn("tk__hero", `tk__hero--${launcher.pattern ?? "none"}`)}
            style={
              launcher.accent
                ? ({ ["--tk-accent"]: launcher.accent } as CSSProperties)
                : undefined
            }
          >
            <div className="tk__hero-body">
              <div className="tk__hero-kicker">
                <span className="tk__hero-dot" aria-hidden="true" />
                {launcher.code ? `${launcher.code} · ` : ""}
                {launcher.kicker}
              </div>
              <h2 className="tk__hero-title">{launcher.title}</h2>
              {launcher.dek && <p className="tk__hero-dek">{launcher.dek}</p>}
              {launcher.meta && <div className="tk__hero-meta">{launcher.meta}</div>}
            </div>
            {launcher.motif && (
              <div className="tk__hero-motif" aria-hidden="true">
                {launcher.motif}
              </div>
            )}
          </div>

          <div className={cn("tk__grid", flat ? "tk__grid--flat" : "tk__grid--cont")}>
            {tools.map((tool) => tonedCard(tool))}
          </div>
        </div>
      );
    }

    // Fallback: launcher clásico (secciones por grupo).
    return (
      <div className="tk">
        {intro && <p className="tk__intro">{intro}</p>}

        <div className="tk__deck">
          {groups.map((g, gi) => (
            <section className="tk__set" key={g.name ?? `g${gi}`} aria-label={g.name ?? undefined}>
              {g.name && (
                <h3 className="tk__set-head">
                  <span className="tk__set-name">{g.name}</span>
                  <span className="tk__set-rule" aria-hidden="true" />
                  <span className="tk__set-count">
                    {String(g.items.length).padStart(2, "0")}
                  </span>
                </h3>
              )}
              <div className="tk__grid">
                {g.items.map(({ tool, n }) => legacyCard(tool, n))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  // ---- vista: herramienta abierta ----
  // El tono de rol de la tool tiñe todo el runner (afiche + acento del panel):
  // así cada herramienta abre con su propia "cara" de color, no un chrome único.
  const openTone = TONE_VAR[activeTool.tone ?? "vault"];
  return (
    <div
      className="tk tk--open"
      style={{ ["--k-color"]: openTone } as CSSProperties}
    >
      <div className="tk__bar">
        <button type="button" className="tk__back" onClick={back}>
          <span className="tk__back-arrow" aria-hidden="true">
            ←
          </span>
          Herramientas
        </button>

        <span className="tk__crumb" aria-hidden="true">
          <span className="tk__crumb-sep">/</span>
          <span className="tk__crumb-idx">{String(activeIdx + 1).padStart(2, "0")}</span>
          {activeTool.group && <span className="tk__crumb-group">{activeTool.group}</span>}
          <span className="tk__crumb-label">{activeTool.label}</span>
        </span>

        <nav className="tk__jump" aria-label="Cambiar de herramienta">
          {tools.map((t) => (
            <button
              key={t.key}
              type="button"
              className={cn("tk__jump-btn", t.key === active && "is-active")}
              aria-current={t.key === active ? "true" : undefined}
              title={t.label}
              onClick={() => open(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* key={active} → remonta al cambiar: dispara la entrada y desmonta
          la herramienta anterior (cleanup, p.ej. la pizarra). */}
      <div key={active} className="tk__open">
        {/* Afiche bespoke: la "cara" de la herramienta dentro del runner
            compartido. Comunica de qué se trata (ícono + categoría + título +
            bajada + micro-ilustración) tinteado por el tono de rol de la tool,
            de modo que cada herramienta se distinga de un vistazo de la anterior.
            El header interno del Panel (redundante) se oculta por CSS. */}
        <div
          ref={headRef}
          className="tk__poster"
          data-tone={activeTool.tone ?? "vault"}
          tabIndex={-1}
          role="group"
          aria-label={activeTool.label}
        >
          <div className="tk__poster-main">
            <div className="tk__poster-eyebrow">
              <span className="tk__poster-ico" aria-hidden="true">
                <ToolIcon name={activeTool.icon ?? "blocks"} size={19} />
              </span>
              <span className="tk__poster-idx" aria-hidden="true">
                {String(activeIdx + 1).padStart(2, "0")}
                <i>/{total}</i>
              </span>
              {activeTool.group && (
                <span className="tk__poster-cat">
                  <span className="tk__poster-cat-dot" aria-hidden="true" />
                  {activeTool.group}
                </span>
              )}
            </div>
            <h2 className="tk__poster-title">{activeTool.label}</h2>
            {(activeTool.blurb ?? activeTool.desc) && (
              <p className="tk__poster-desc">{activeTool.blurb ?? activeTool.desc}</p>
            )}
          </div>

          <div className="tk__poster-art" aria-hidden="true">
            {activeTool.poster ?? (
              <div className="tk__poster-plate">
                <span className="tk__poster-plate-ico">
                  <ToolIcon name={activeTool.icon ?? "blocks"} size={70} />
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="tk__open-body">{activeTool.node}</div>
      </div>
    </div>
  );
}
