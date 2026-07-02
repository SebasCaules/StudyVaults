"use client";

// Modal de detalle de materia. Antes era un drawer lateral derecho; ahora es un
// modal centrado (mismo patrón que MinorsModal: createPortal a document.body,
// envuelto en .planner para reexponer las variables de tema y evitar el
// containing block del transform de la vista). Los eventos despachan acciones
// del state global. Lee state.drawerCode para saber qué materia mostrar.

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { byId, AREA_COLOR } from "@/lib/planner/model";
import { isAvailable } from "@/lib/planner/metrics";
import { usePlanner } from "@/components/planner/state";
import { FICHAS } from "@/lib/planner/fichas";
import { withBase } from "@/lib/content/slug";
import {
  ProgramaChips,
  ComingSoonBadge,
} from "@/components/planner/ProgramaChips";
import {
  IconClose,
  IconCheck,
  IconDownload,
  IconArrowUpRight,
} from "@/components/planner/icons";
import type { Ficha, MateriaM } from "@/lib/planner/types";

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

// ---- descarga del detalle como HTML autocontenido ----

const esc = (s: unknown): string =>
  String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );

/** Texto multi-párrafo ("\n\n") → <p> serializados. */
const proseHTML = (text: string): string =>
  String(text || "")
    .split("\n\n")
    .filter((p) => p.trim())
    .map((p) => `<p>${esc(p)}</p>`)
    .join("");

/** Dispara la descarga de un string HTML como archivo .html. */
function downloadHTMLFile(html: string, filename: string): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Documento HTML autocontenido con el detalle de una materia (y su ficha). */
function buildMateriaHTML(m: MateriaM, ficha: Ficha | undefined): string {
  const ob = m.tipo === "obligatoria";
  const hor = m.horario;
  const areas = m.areas || [];
  const correlativas = m.correlativas || [];

  const subParts = [
    ob
      ? `Obligatoria · ${esc(m.ciclo)} · Año ${esc(m.anio)} (${esc(m.cuatri)}.º cuat.)`
      : "Electiva",
    `${esc(m.creditos)} créditos`,
    m.creditosReq ? `requiere ${esc(m.creditosReq)}` : "",
    hor?.depto ? esc(hor.depto) : "",
  ].filter(Boolean);

  const areasHTML =
    !ob && areas.length
      ? `<section class="sec">
          <h2>Áreas · Minor</h2>
          <div class="chips">${areas.map((a) => `<span class="chip">${esc(a)}</span>`).join("")}</div>
        </section>`
      : "";

  const corrHTML = `<section class="sec">
      <h2>Correlativas</h2>
      ${
        correlativas.length
          ? `<div class="chips">${correlativas
              .map((c) => {
                const cm = byId.get(c);
                return `<span class="chip">${esc(c)}${cm ? " " + esc(cm.abbr) : ""}</span>`;
              })
              .join("")}</div>`
          : `<p class="muted">Sin correlativas</p>`
      }
    </section>`;

  const comsHTML =
    hor && hor.comisiones.length
      ? hor.comisiones
          .map((cm) => {
            const slots = cm.slots
              .map((s) => {
                const aula = [
                  s.sala ? "Aula " + esc(s.sala) : "",
                  s.sede ? esc(s.sede) : "",
                ]
                  .filter(Boolean)
                  .join(" · ");
                return `<li>
                  <span class="d">${esc(s.dia)}</span>
                  <span class="h">${esc(s.desde)}–${esc(s.hasta)}</span>
                  <span class="au">${aula}</span>
                  <span class="mo">${esc(s.modalidad || "—")}</span>
                </li>`;
              })
              .join("");
            const profs = cm.profesores
              ? `<p class="profs">${esc(cm.profesores)}</p>`
              : "";
            return `<div class="com">
              <div class="com__h"><b>Comisión ${esc(cm.comision)}</b><span class="cupo">${esc(cm.cupo || "")}</span></div>
              <ul class="slots">${slots}</ul>
              ${profs}
            </div>`;
          })
          .join("")
      : `<p class="muted">Sin horario publicado para 2C 2026.</p>`;

  const horHTML = `<section class="sec">
      <h2>Horario 2C 2026</h2>
      ${comsHTML}
    </section>`;

  const detailBlock = (title: string, body: string): string =>
    body ? `<div class="block"><h3>${esc(title)}</h3>${body}</div>` : "";

  let fichaHTML = "";
  if (ficha) {
    const temario = ficha.programa.length
      ? `<ul class="units">${ficha.programa
          .map(
            (u) =>
              `<li><b>${esc(u.titulo)}</b>${u.descripcion ? " — " + esc(u.descripcion) : ""}</li>`,
          )
          .join("")}</ul>`
      : "";
    const biblio = (label: string, list: string[]): string =>
      list.length
        ? `<h4>${esc(label)}</h4><ul class="biblio">${list.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
        : "";
    const biblioBody =
      biblio("Obligatoria", ficha.bibliografiaObligatoria) +
      biblio("Complementaria", ficha.bibliografiaComplementaria);

    fichaHTML = `<section class="sec ficha">
      <h2>Programa analítico</h2>
      <p class="muted">${[ficha.departamento, ficha.anio && `Programa ${ficha.anio}`]
        .filter(Boolean)
        .map((x) => esc(x))
        .join(" · ")}</p>
      ${detailBlock("Presentación", proseHTML(ficha.presentacion))}
      ${detailBlock("Objetivos de aprendizaje", proseHTML(ficha.objetivos))}
      ${detailBlock("Contenidos mínimos", proseHTML(ficha.contenidosMinimos))}
      ${detailBlock("Temario", temario)}
      ${detailBlock("Modalidad de evaluación", proseHTML(ficha.evaluacion))}
      ${detailBlock("Bibliografía", biblioBody)}
    </section>`;
  }

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(m.codigo)} · ${esc(m.abbr)} — ITBA</title>
<style>
  :root{
    --ink:#2b211c; --soft:#5a4d45; --muted:#8a7d73; --line:#e3d9cf;
    --paper:#fbf8f4; --panel:#fff; --coral:#d2754f;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{
    background:var(--paper); color:var(--ink);
    font-family:Georgia,"Times New Roman",serif; line-height:1.55;
    -webkit-print-color-adjust:exact; print-color-adjust:exact;
  }
  .wrap{max-width:820px;margin:0 auto;padding:40px 32px 56px}
  .muted{color:var(--muted)}
  header.doc{border-bottom:2px solid var(--ink);padding-bottom:14px;margin-bottom:20px}
  header.doc .kick{font-family:"SFMono-Regular",Menlo,monospace;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--coral);margin:0 0 6px}
  header.doc h1{font-size:25px;margin:0 0 6px;letter-spacing:-.01em}
  header.doc .sub{color:var(--soft);font-size:13px;font-family:"SFMono-Regular",Menlo,monospace;margin:0}
  section.sec{margin-bottom:22px}
  section.sec>h2{font-size:15px;margin:0 0 8px;padding-bottom:5px;border-bottom:1px solid var(--line);letter-spacing:.02em}
  .chips{display:flex;flex-wrap:wrap;gap:6px}
  .chip{font-family:"SFMono-Regular",Menlo,monospace;font-size:11px;padding:3px 9px;border-radius:5px;background:var(--panel);border:1px solid var(--line);color:var(--soft)}
  .com{border:1px solid var(--line);border-radius:9px;background:var(--panel);padding:10px 14px;margin-bottom:10px}
  .com__h{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:6px}
  .com__h .cupo{font-family:"SFMono-Regular",Menlo,monospace;font-size:11px;color:var(--muted)}
  ul.slots{list-style:none;margin:0;padding:0}
  ul.slots li{display:flex;gap:10px;flex-wrap:wrap;font-size:12.5px;padding:3px 0;border-top:1px dashed var(--line)}
  ul.slots li:first-child{border-top:none}
  ul.slots .d{font-weight:bold;min-width:74px}
  ul.slots .h{font-family:"SFMono-Regular",Menlo,monospace;color:var(--soft);min-width:96px}
  ul.slots .au{color:var(--soft);flex:1;min-width:120px}
  ul.slots .mo{font-family:"SFMono-Regular",Menlo,monospace;font-size:11px;color:var(--muted)}
  .profs{font-size:11.5px;color:var(--muted);margin:6px 0 0}
  .ficha .block{margin:14px 0}
  .ficha .block h3{font-size:13.5px;margin:0 0 4px;color:var(--coral);font-family:"SFMono-Regular",Menlo,monospace;letter-spacing:.03em;text-transform:uppercase}
  .ficha .block h4{font-size:12.5px;margin:8px 0 3px}
  .ficha p{margin:0 0 8px;font-size:13px}
  ul.units,ul.biblio{margin:0;padding-left:18px}
  ul.units li,ul.biblio li{font-size:12.5px;margin-bottom:5px}
  footer.doc{margin-top:26px;border-top:1px solid var(--line);padding-top:12px;color:var(--muted);font-size:11px;font-family:"SFMono-Regular",Menlo,monospace}
  @page{size:A4;margin:14mm}
  @media print{ .wrap{padding:0;max-width:none} body{background:#fff} }
</style>
</head>
<body>
<div class="wrap">
  <header class="doc">
    <p class="kick">${esc(m.codigo)} · ${esc(m.abbr)}</p>
    <h1>${esc(m.nombre)}</h1>
    <p class="sub">${subParts.join(" · ")}</p>
  </header>
  ${areasHTML}
  ${corrHTML}
  ${horHTML}
  ${fichaHTML}
  <footer class="doc">Detalle de materia · studyvaults · ITBA</footer>
</div>
</body>
</html>`;
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

      <ProgramaChips codigo={ficha.codigo} />

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

      {ficha.evaluacion ? (
        <div className="dr-ficha__block dr-eval">
          <h5>Modalidad de evaluación</h5>
          <Prose text={ficha.evaluacion} />
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
          Leer ficha completa <IconArrowUpRight size={13} />
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

  // cierre con Escape (hook siempre montado, antes de cualquier return)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch({ type: "CLOSE_DRAWER" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  // Modal cerrado (sin código o materia inexistente): no renderiza nada.
  if (!code || !m) return null;

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
  // sin descripción inline ni ficha: la columna aside queda vacía → no se
  // renderiza y la columna main pasa a ocupar el ancho completo (dr-grid--solo)
  const hasAside = !!(descInline || ficha);

  const onDownload = () => {
    const html = buildMateriaHTML(m, ficha);
    const filename = `detalle-${m.codigo}-${m.abbr}.html`.replace(
      /[^a-zA-Z0-9._-]/g,
      "-",
    );
    downloadHTMLFile(html, filename);
  };

  if (typeof document === "undefined") return null;

  const modal = (
    <div
      className="dr-modal"
      role="dialog"
      aria-modal="true"
      aria-label={m.nombre}
    >
      <div className="dr-modal__bg" onClick={close} />
      <div className="dr-modal__panel dr-modal__panel--wide">
        <button className="dr-close" onClick={close} aria-label="Cerrar">
          <IconClose size={15} />
        </button>
        {/* grid de dos columnas: main (identidad, acciones, correlativas,
            horario) + aside (descripción inline y ficha/programa analítico).
            Sin aside (materia sin ficha ni descripción) → dr-grid--solo,
            main pasa a ocupar el ancho completo. */}
        <div className={"dr-grid" + (hasAside ? "" : " dr-grid--solo")}>
          <div className="dr-col dr-col--main">
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
                {appr ? (
                  <>
                    <IconCheck size={13} /> aprobada
                  </>
                ) : (
                  "marcar aprobada"
                )}
              </button>
              {hasComs ? (
                <button
                  className={"mini btn-co " + (inCombo ? "on plan" : "")}
                  onClick={() => dispatch({ type: "TOGGLE_COMBO", code })}
                >
                  {inCombo ? (
                    <>
                      <IconCheck size={13} /> en combinador
                    </>
                  ) : (
                    "al combinador"
                  )}
                </button>
              ) : null}
              <button type="button" className="dr-dl" onClick={onDownload}>
                <IconDownload size={13} /> Descargar
              </button>
            </div>
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
                        {c} {cm ? cm.abbr : ""}{" "}
                        {ok ? <IconCheck size={12} /> : null}
                      </span>
                    );
                  })
                ) : (
                  <span className="muted">Sin correlativas</span>
                )}
              </div>
            </div>
            {!ficha ? (
              <div className="dr-sec">
                <h4>Programa analítico</h4>
                <ComingSoonBadge />
                <p className="muted">
                  Todavía no cargamos el programa analítico de esta materia.
                  Va a estar disponible próximamente.
                </p>
              </div>
            ) : null}
            <div className="dr-sec">
              <h4>
                Horario 2C 2026{" "}
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
                        <span className="dr-slotmod">
                          {s.modalidad || "—"}
                        </span>
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
                <p className="muted">Sin horario publicado para 2C 2026.</p>
              )}
            </div>
          </div>
          {hasAside ? (
            <div className="dr-col dr-col--aside">
              {descInline ? <p className="dr-desc">{descInline}</p> : null}
              {ficha ? <FichaSection ficha={ficha} /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  return createPortal(
    <div className="planner" style={{ padding: 0 }}>
      {modal}
    </div>,
    document.body,
  );
}
