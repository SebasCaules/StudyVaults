"use client";

// Drawer de detalle de materia. Port de openDrawer/closeDrawer (planner.js ~236-258):
// misma estructura DOM y mismas clases CSS; los eventos despachan acciones en vez
// de mutar el state global. Lee state.drawerCode para saber qué materia mostrar.

import { byId, AREA_COLOR } from "@/lib/planner/model";
import { isAvailable } from "@/lib/planner/metrics";
import { usePlanner } from "@/components/planner/state";

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
      </aside>
    </div>
  );
}
