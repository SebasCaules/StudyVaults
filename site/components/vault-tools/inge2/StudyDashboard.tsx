"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Panel, SubPanel, Note, Badge, BigNum, Button } from "@studyvaults/ui";
import type { UnitId } from "./types";
import { UNIT_LIST } from "./data/units";
import {
  loadContributions,
  unitMastery,
  unitTouched,
  overallReadiness,
  onProgress,
  resetAllProgress,
  TOOLS,
  type Tool,
  type ContributionMap,
} from "./progress";

/* ──────────────────────────────────────────────────────────────────────────
   Ingeniería del Software II — Plan de recu (StudyDashboard).

   Orquestador del toolkit: NO publica progreso, sólo LEE y agrega lo que
   reportan las otras herramientas (flashcards, quiz, mechanism, tradeoff,
   antipattern) vía progress.ts y muestra qué tan listo está el alumno para
   el recuperatorio, unidad por unidad.

   Reactividad: en montaje hidratamos (hydrated=true) y nos suscribimos con
   onProgress(); cada notificación (mismo tab vía CustomEvent o storage event
   de otro tab) bumpea `version`, lo que reejecuta el useMemo que vuelve a
   leer loadContributions() y recalcula las métricas.

   Static-export safe: en SSR no hay localStorage → el primer render muestra
   ceros/estado vacío sin romper (hydrated=false). loadContributions() ya está
   guardado tras typeof window; Date.now() / window sólo en effects y handlers.
   ────────────────────────────────────────────────────────────────────────── */

/* ProgressBar — clon local del de Inge2Tools.tsx (sin CSS nuevo). */
function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div
      style={{
        marginTop: 10,
        height: 8,
        borderRadius: 999,
        background: "var(--hairline)",
        overflow: "hidden",
      }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: "100%",
          background: clamped === 100 ? "var(--accent)" : "var(--primary)",
          transition: "width 180ms ease",
        }}
      />
    </div>
  );
}

/* Rótulos en castellano de cada herramienta (para badges de cobertura). */
const TOOL_LABEL: Record<Tool, string> = {
  flashcards: "Flashcards",
  quiz: "Banco",
  mechanism: "Mecanismos",
  tradeoff: "Trade-offs",
  antipattern: "Anti-patrones",
};

/* Etiqueta cualitativa del readiness global según el porcentaje (0..100). */
function readinessLabel(pct: number): string {
  if (pct < 25) return "Arrancando";
  if (pct < 50) return "En camino";
  if (pct < 75) return "Sólido";
  if (pct < 90) return "Listo para rendir";
  return "A romperla";
}

/* Deriva un label legible del último segmento de un slug del wiki:
   "concepts/teorema-cap" → "Teorema cap". */
function slugLabel(slug: string): string {
  const last = slug.split("/").pop() ?? slug;
  const words = last.replace(/-/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Cuántos deep-links de repaso mostramos antes de colapsar en "+N más". */
const MAX_WIKI_LINKS = 4;

export default function StudyDashboard() {
  // Antes de hidratar mostramos un placeholder neutro: en SSR no hay storage.
  const [hydrated, setHydrated] = useState(false);
  // Contador que fuerza recomputar las métricas cuando algo publica progreso.
  const [version, setVersion] = useState(0);
  // Qué unidades tienen sus deep-links expandidos ("+N más").
  const [expanded, setExpanded] = useState<Record<UnitId, boolean>>(
    {} as Record<UnitId, boolean>,
  );

  const bump = useCallback(() => setVersion((v) => v + 1), []);

  // Montaje: hidratamos y nos suscribimos a cambios de progreso. El unsubscribe
  // se devuelve en el cleanup. onProgress cubre mismo-tab (CustomEvent) y
  // otros tabs (storage event).
  useEffect(() => {
    setHydrated(true);
    const unsub = onProgress(() => bump());
    return unsub;
  }, [bump]);

  // Una sola lectura de contribuciones por render-version (eficiente y
  // consistente: pasamos el mismo mapa a todas las métricas). Depende de
  // `version` (cambios) y `hydrated` (post-montaje, ya hay storage).
  const contrib: ContributionMap = useMemo(() => {
    if (!hydrated) return {};
    return loadContributions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, version]);

  // Readiness global 0..100.
  const readinessPct = useMemo(
    () => Math.round(overallReadiness(contrib) * 100),
    [contrib],
  );

  // Métricas por unidad (mastery %, tocada, badges de cobertura) — una pasada.
  const unitRows = useMemo(
    () =>
      UNIT_LIST.map((u) => {
        const mastery = unitMastery(u.id, contrib);
        const tools = TOOLS.filter((t) => (contrib[t]?.[u.id]?.seen ?? 0) > 0);
        return {
          meta: u,
          pct: Math.round(mastery * 100),
          mastery,
          touched: unitTouched(u.id, contrib),
          tools,
        };
      }),
    [contrib],
  );

  // "Dónde enfocar": 3 unidades con menor dominio, priorizando las NO tocadas.
  // Orden: no-tocadas primero, luego por mastery ascendente.
  const focus = useMemo(() => {
    return [...unitRows]
      .sort((a, b) => {
        if (a.touched !== b.touched) return a.touched ? 1 : -1;
        return a.mastery - b.mastery;
      })
      .slice(0, 3);
  }, [unitRows]);

  const toggleExpanded = (id: UnitId) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleReset = () => {
    const ok = window.confirm(
      "Esto borra el progreso de TODAS las herramientas del toolkit " +
        "(Flashcards, Banco, Mecanismos, Trade-offs, Anti-patrones). " +
        "¿Querés reiniciar todo?",
    );
    if (!ok) return;
    resetAllProgress();
    bump();
  };

  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">Plan de recu</span>
        <h3>Tu mapa de estudio</h3>
        <p>
          Este panel no es una herramienta de práctica: agrega el progreso que
          publican las demás (Flashcards, Banco de preguntas, Mecanismos,
          Trade-offs y Anti-patrones) y te muestra, unidad por unidad, qué tan
          listo estás para el recuperatorio. Se actualiza solo a medida que
          practicás.
        </p>
      </div>

      {/* ───────────────────────── Hero: readiness global ──────────────── */}
      <SubPanel
        aria-label="Readiness global"
        style={{ marginBottom: 16 }}
      >
        {!hydrated ? (
          <Note>Cargando tu progreso…</Note>
        ) : (
          <>
            <div
              className="vtool-row"
              style={{ justifyContent: "space-between", alignItems: "baseline", gap: 12 }}
            >
              <BigNum value={readinessPct} unit="%" />
              <span
                className="vtool-mono"
                style={{ color: "var(--text-secondary)" }}
              >
                {readinessLabel(readinessPct)}
              </span>
            </div>
            <ProgressBar pct={readinessPct} />
            <Note>
              Promedio de dominio sobre las {UNIT_LIST.length} unidades del
              programa. Cada unidad sin practicar cuenta como 0.
            </Note>
          </>
        )}
      </SubPanel>

      {/* ───────────────────────── Dónde enfocar ───────────────────────── */}
      {hydrated && (
        <SubPanel aria-label="Dónde enfocar" style={{ marginBottom: 16 }}>
          <strong
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              color: "var(--ink-strong)",
            }}
          >
            Dónde enfocar ahora
          </strong>
          <div className="vtool-stack" style={{ marginTop: 12 }}>
            {focus.map((row) => (
              <div
                key={row.meta.id}
                className="vtool-row"
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ minWidth: 0 }}>
                  <strong style={{ color: "var(--text-primary)" }}>
                    {row.meta.label}
                  </strong>{" "}
                  <span className="vtool-mono" style={{ color: "var(--text-secondary)" }}>
                    · {row.pct}%
                    {!row.touched && " · sin practicar"}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  href={`/inge2/${row.meta.wiki[0]}/`}
                >
                  Repasar y practicar
                </Button>
              </div>
            ))}
          </div>
          <Note>
            Priorizamos las unidades que todavía no tocaste; después, las de
            menor dominio. Practicá con Flashcards o el Banco de preguntas.
          </Note>
        </SubPanel>
      )}

      {/* ───────────────────────── Cobertura por unidad ────────────────── */}
      <section aria-label="Cobertura por unidad">
        <div className="vtool-stack">
          {unitRows.map((row) => {
            const { meta } = row;
            const isOpen = expanded[meta.id];
            const links = isOpen ? meta.wiki : meta.wiki.slice(0, MAX_WIKI_LINKS);
            const hidden = meta.wiki.length - links.length;
            return (
              <SubPanel key={meta.id} aria-label={meta.label}>
                <div
                  className="vtool-row"
                  style={{ justifyContent: "space-between", alignItems: "baseline", gap: 12 }}
                >
                  <strong
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 16,
                      color: "var(--ink-strong)",
                    }}
                  >
                    {meta.label}
                  </strong>
                  <span className="vtool-mono" style={{ color: "var(--text-secondary)" }}>
                    {hydrated ? `${row.pct}%` : "—"}
                  </span>
                </div>

                <p
                  style={{
                    margin: "6px 0 0",
                    color: "var(--text-secondary)",
                    fontSize: 13,
                  }}
                >
                  {meta.blurb}
                </p>

                <ProgressBar pct={hydrated ? row.pct : 0} />

                {/* Badges de herramientas con señal para esta unidad. */}
                <div
                  className="vtool-row"
                  style={{ marginTop: 12, gap: 6, flexWrap: "wrap" }}
                >
                  {hydrated && row.tools.length > 0 ? (
                    row.tools.map((t) => (
                      <Badge key={t} variant="status">
                        {TOOL_LABEL[t]}
                      </Badge>
                    ))
                  ) : (
                    <Note style={{ marginTop: 0 }}>Todavía sin práctica</Note>
                  )}
                </div>

                {/* Deep-links de repaso al wiki. */}
                <div
                  className="vtool-row"
                  style={{ marginTop: 12, gap: 6, flexWrap: "wrap" }}
                >
                  {links.map((slug) => (
                    <Button
                      key={slug}
                      variant="ghost"
                      size="sm"
                      href={`/inge2/${slug}/`}
                    >
                      {slugLabel(slug)}
                    </Button>
                  ))}
                  {hidden > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(meta.id)}
                    >
                      +{hidden} más
                    </Button>
                  )}
                  {isOpen && meta.wiki.length > MAX_WIKI_LINKS && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(meta.id)}
                    >
                      Ver menos
                    </Button>
                  )}
                </div>
              </SubPanel>
            );
          })}
        </div>
      </section>

      {/* ───────────────────────── Reset ───────────────────────────────── */}
      <SubPanel style={{ marginTop: 16 }}>
        <div className="vtool-row" style={{ justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Note style={{ marginTop: 0 }}>
            Borra el progreso de todas las herramientas del toolkit. No se puede
            deshacer.
          </Note>
          <Button variant="ghost" size="sm" onClick={handleReset} disabled={!hydrated}>
            Reiniciar todo el progreso
          </Button>
        </div>
      </SubPanel>
    </Panel>
  );
}
