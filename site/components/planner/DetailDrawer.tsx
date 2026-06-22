"use client";

// Drawer de detalle de materia. Port de openDrawer/closeDrawer (planner.js ~236-258):
// misma estructura DOM y mismas clases CSS; los eventos despachan acciones en vez
// de mutar el state global. Lee state.drawerCode para saber qué materia mostrar.

import { byId, AREA_COLOR } from "@/lib/planner/model";
import { isAvailable } from "@/lib/planner/metrics";
import { usePlanner } from "@/components/planner/state";
import { FICHAS } from "@/lib/planner/fichas";
import { withBase } from "@/lib/content/slug";
import type { Ficha } from "@/lib/planner/types";

/** Render de un texto multi-párrafo (separado por "\n\n") como <p> apilados. */
function Prose({ text }: { text: string }) {
  if (!text) return null;
  return (
    <>
      {text.split("\n\n").map((p, i) => (
        <p key={i} className="dr-prose">
          {p}
        </p>
      ))}
    </>
  );
}

/** Apartado "Programa analítico" con la ficha oficial del ITBA (PDF parseado). */
function FichaSection({ ficha }: { ficha: Ficha }) {
  const { dispatch } = usePlanner();
  const ch = ficha.cargaHoraria;
  const totales = [
    ch.teoricas != null ? `${ch.teoricas} teóricas` : null,
    ch.practicas != null ? `${ch.practicas} prácticas` : null,
    ch.laboratorio ? `${ch.laboratorio} laboratorio` : null,
  ].filter(Boolean);
  const semanales = [
    ch.presencial != null ? `${ch.presencial} presencial` : null,
    ch.distancia ? `${ch.distancia} a distancia` : null,
  ].filter(Boolean);

  return (
    <div className="dr-sec dr-ficha">
      <h4>Programa analítico</h4>

      <p className="dr-ficha__meta">
        {[ficha.departamento, ficha.anio && `Programa ${ficha.anio}`]
          .filter(Boolean)
          .join(" · ")}
      </p>

      {ch.total != null || totales.length ? (
        <div className="dr-carga">
          {ch.total != null ? (
            <div>
              <b>{ch.total} hs</b> totales
              {totales.length ? ` · ${totales.join(" · ")}` : ""}
            </div>
          ) : null}
          {ch.semanales != null ? (
            <div>
              <b>{ch.semanales} hs</b> semanales
              {semanales.length ? ` · ${semanales.join(" · ")}` : ""}
            </div>
          ) : null}
        </div>
      ) : null}

      {ficha.objetivos ? (
        <div className="dr-ficha__block">
          <h5>Objetivos de aprendizaje</h5>
          <Prose text={ficha.objetivos} />
        </div>
      ) : null}

      {ficha.contenidosMinimos ? (
        <div className="dr-ficha__block">
          <h5>Contenidos mínimos</h5>
          <Prose text={ficha.contenidosMinimos} />
        </div>
      ) : null}

      {ficha.programa.length ? (
        <details className="dr-details">
          <summary>Temario · {ficha.programa.length} unidades</summary>
          <ul className="dr-units">
            {ficha.programa.map((u, i) => (
              <li key={i}>
                <b>{u.titulo}</b>
                {u.descripcion ? <span> — {u.descripcion}</span> : null}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {ficha.evaluacion ? (
        <details className="dr-details">
          <summary>Modalidad de evaluación</summary>
          <div className="dr-details__body">
            <Prose text={ficha.evaluacion} />
          </div>
        </details>
      ) : null}

      {ficha.bibliografiaObligatoria.length ||
      ficha.bibliografiaComplementaria.length ? (
        <details className="dr-details">
          <summary>Bibliografía</summary>
          <div className="dr-details__body">
            {ficha.bibliografiaObligatoria.length ? (
              <>
                <h5>Obligatoria</h5>
                <ul className="dr-biblio">
                  {ficha.bibliografiaObligatoria.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </>
            ) : null}
            {ficha.bibliografiaComplementaria.length ? (
              <>
                <h5>Complementaria</h5>
                <ul className="dr-biblio">
                  {ficha.bibliografiaComplementaria.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </details>
      ) : null}

      <div className="dr-ficha__acts">
        <button
          type="button"
          className="dr-pdf dr-pdf--primary"
          onClick={() => {
            dispatch({ type: "OPEN_FICHA", code: ficha.codigo });
            dispatch({ type: "CLOSE_DRAWER" });
          }}
        >
          Leer ficha completa ↗
        </button>
        <a
          className="dr-pdf"
          href={withBase(ficha.pdf)}
          target="_blank"
          rel="noopener noreferrer"
        >
          PDF
        </a>
      </div>
    </div>
  );
}

export default function DetailDrawer() {
  const { state, dispatch } = usePlanner();
  const code = state.drawerCode;
  const m = code ? byId.get(code) : undefined;

  // Drawer cerrado (sin código o materia inexistente).
  if (!code || !m) {
    return (
      <div className="drawer" aria-hidden="true">
        <div className="drawer__bg" />
        <aside className="drawer__panel" />
      </div>
    );
  }

  const ob = m.tipo === "obligatoria";
  const appr = state.approved.has(code);
  const avail = isAvailable(m, state.approved);
  const hor = m.horario;
  const inCombo = state.combo.has(code);
  const hasComs = !!(hor && hor.comisiones.length);

  const close = () => dispatch({ type: "CLOSE_DRAWER" });

  const areas = m.areas || [];
  const correlativas = m.correlativas || [];
  const ficha = FICHAS[code];
  // descripción inline: presentación de la materia (o contenidos mínimos como fallback)
  const descInline = ficha
    ? ficha.presentacion || ficha.contenidosMinimos
    : "";

  return (
    <div className="drawer open">
      <div className="drawer__bg" onClick={close} />
      <aside className="drawer__panel">
        <button className="dr-close" onClick={close}>
          ×
        </button>
        <span className={"dr-code " + (ob ? "ob" : "")}>
          {m.codigo} · {m.abbr}
        </span>
        <h3 className="dr-title">{m.nombre}</h3>
        <p className="dr-sub">
          {ob
            ? `Obligatoria · ${m.ciclo} · Año ${m.anio} (${m.cuatri}.º cuat.)`
            : "Electiva"}{" "}
          · {m.creditos} créditos
          {m.creditosReq ? ` · requiere ${m.creditosReq}` : ""}
          {hor ? ` · ${hor.depto}` : ""}
        </p>
        <div className="dr-x">
          <button
            className={"mini btn-ap " + (appr ? "on" : "")}
            onClick={() => dispatch({ type: "TOGGLE_APPROVED", code })}
          >
            {appr ? "aprobada ✓" : "marcar aprobada"}
          </button>
          {hasComs ? (
            <button
              className={"mini btn-co " + (inCombo ? "on plan" : "")}
              onClick={() => dispatch({ type: "TOGGLE_COMBO", code })}
            >
              {inCombo ? "en combinador ✓" : "al combinador"}
            </button>
          ) : null}
        </div>
        {descInline ? <p className="dr-desc">{descInline}</p> : null}
        {ob ? null : (
          <div className="dr-sec">
            <h4>Áreas · Minor</h4>
            <div className="dr-chips">
              {areas.length ? (
                areas.map((a) => (
                  <span
                    key={a}
                    className="tag tag--area"
                    style={{ background: AREA_COLOR[a] }}
                  >
                    {a}
                  </span>
                ))
              ) : (
                <span className="muted">—</span>
              )}
            </div>
          </div>
        )}
        <div className="dr-sec">
          <h4>Correlativas</h4>
          <div className="dr-chips">
            {correlativas.length ? (
              correlativas.map((c) => {
                const cm = byId.get(c);
                const ok = state.approved.has(c);
                return (
                  <span
                    key={c}
                    className="tag"
                    style={
                      ok
                        ? {
                            color: "var(--sage)",
                            borderColor: "rgba(155,176,131,.3)",
                          }
                        : { color: "var(--muted)" }
                    }
                  >
                    {c} {cm ? cm.abbr : ""} {ok ? "✓" : ""}
                  </span>
                );
              })
            ) : (
              <span className="muted">Sin correlativas</span>
            )}
          </div>
        </div>
        <div className="dr-sec">
          <h4>
            Horario 1C 2026{" "}
            {avail && !appr ? (
              <span className="tag tag--ok" style={{ marginLeft: 6 }}>
                disponible
              </span>
            ) : null}
          </h4>
          {hasComs ? (
            hor!.comisiones.map((cm) => (
              <div className="dr-com" key={cm.comision}>
                <div className="dr-com__h">
                  <b>Comisión {cm.comision}</b>
                  <span className="dr-com__cupo">{cm.cupo}</span>
                </div>
                {cm.slots.map((s, i) => (
                  <div className="dr-slot" key={i}>
                    <span className="d">{s.dia}</span>
                    <span className="h">
                      {s.desde}–{s.hasta}
                    </span>
                    <span className="au">
                      {s.sala ? "Aula " + s.sala : ""}
                      {s.sede ? " · " + s.sede : ""}
                    </span>
                    <span className="dr-modal">{s.modalidad || "—"}</span>
                  </div>
                ))}
                {cm.profesores ? (
                  <div
                    className="muted"
                    style={{ fontSize: 11, marginTop: 7 }}
                  >
                    {cm.profesores}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <p className="muted">Sin horario publicado para 1C 2026.</p>
          )}
        </div>
        {ficha ? <FichaSection ficha={ficha} /> : null}
      </aside>
    </div>
  );
}
