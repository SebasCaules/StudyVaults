"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// useLayoutEffect avisa en SSR; en el prerender (sin window) cae a useEffect.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
import type { NavSection } from "@/lib/content/nav-tree";
import { getVault } from "@/lib/content/vaults";
import { withBase } from "@/lib/content/slug";

// Sidebar de la materia: índice tipo libro con secciones colapsables, numeradas
// y con contador. Solo la sección activa abre por defecto; el usuario puede
// plegar/desplegar y su elección persiste (localStorage por vault).
export default function Sidebar({
  vault,
  sections,
  currentHref,
}: {
  vault: string;
  sections: NavSection[];
  currentHref: string;
}) {
  const cfg = getVault(vault);
  const activeKey =
    sections.find((s) => s.items.some((it) => it.href === currentHref))?.key ??
    null;

  // null hasta hidratar (SSR/primer render usan el default = sección activa)
  const [openMap, setOpenMap] = useState<Record<string, boolean> | null>(null);
  const lsKey = `sv-secs-${vault}`;

  // Restaurar el estado abierto/cerrado ANTES del paint para que las secciones
  // no parpadeen (cerrarse y reabrirse) en cada navegación.
  useIsoLayoutEffect(() => {
    try {
      const raw = localStorage.getItem(lsKey);
      setOpenMap(raw ? JSON.parse(raw) : {});
    } catch {
      setOpenMap({});
    }
  }, [lsKey]);

  const isOpen = (key: string) =>
    openMap === null ? key === activeKey : openMap[key] ?? key === activeKey;

  const onToggle = (key: string, open: boolean) => {
    setOpenMap((prev) => {
      const base = prev ?? {};
      const cur = base[key] ?? key === activeKey;
      if (cur === open) return prev;
      const next = { ...base, [key]: open };
      try {
        localStorage.setItem(lsKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // El sidebar es el navegador principal: al entrar a una nota (o pasar a la
  // siguiente con prev/next o teclado) el árbol tiene que reflejar dónde estás.
  // 1) Si el usuario había plegado la sección activa, se reabre para que la nota
  //    quede a la vista. 2) La nota activa se trae al viewport DENTRO del riel
  //    (solo scrollea el contenedor del sidebar, nunca la página).
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (!activeKey) return;

    // Reabrir la sección activa solo si estaba explícitamente plegada
    // (`false`); si no figura en el mapa, el default ya la abre.
    setOpenMap((prev) => {
      if (!prev || prev[activeKey] !== false) return prev;
      const next = { ...prev, [activeKey]: true };
      try {
        localStorage.setItem(lsKey, JSON.stringify(next));
      } catch {}
      return next;
    });

    // Doble rAF: garantiza que corra después de que el <details> reabierto
    // haya vuelto a maquetar, así el getBoundingClientRect es válido.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = activeLinkRef.current;
        const container = el?.closest<HTMLElement>(".rail__scroll");
        if (!el || !container) return;
        const cr = container.getBoundingClientRect();
        const er = el.getBoundingClientRect();
        const pad = 28; // aire arriba/abajo para no pegar la nota al borde
        let delta = 0;
        if (er.top < cr.top + pad) delta = er.top - cr.top - pad;
        else if (er.bottom > cr.bottom - pad) delta = er.bottom - cr.bottom + pad;
        if (delta === 0) return; // ya visible: no molestar
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        container.scrollTo({
          top: container.scrollTop + delta,
          behavior: reduce ? "auto" : "smooth",
        });
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHref, activeKey]);

  return (
    <nav className="wikinav" aria-label="Navegación de la materia">
      <Link
        href={`/${vault}/`}
        className={`wikinav__home${
          currentHref === `/${vault}/` ? " is-active" : ""
        }`}
      >
        {cfg?.short ?? vault} · índice
      </Link>

      {(cfg?.toolkit ||
        cfg?.sheets ||
        cfg?.library ||
        (cfg?.apps?.length ?? 0) > 0) && (
        <div className="wikinav__tools">
          <span className="wikinav__toolslabel">
            {cfg?.lang === "en" ? "Tools" : "Herramientas"}
          </span>
          {cfg?.toolkit && (
            <Link
              href={`/${vault}/herramientas`}
              className={`wikinav__toollink${
                currentHref === `/${vault}/herramientas` ? " is-active" : ""
              }`}
            >
              {cfg.lang === "en" ? "Study toolkit" : "Toolkit de estudio"}
            </Link>
          )}
          {cfg?.sheets && (
            <Link
              href={`/${vault}/hojas`}
              className={`wikinav__toollink${
                currentHref === `/${vault}/hojas` ? " is-active" : ""
              }`}
            >
              {cfg.lang === "en" ? "Study sheets" : "Hojas de estudio"}
            </Link>
          )}
          {cfg?.library && (
            <Link
              href={`/${vault}/biblioteca`}
              className={`wikinav__toollink${
                currentHref === `/${vault}/biblioteca` ? " is-active" : ""
              }`}
            >
              {cfg.lang === "en" ? "PDF library" : "Biblioteca de PDFs"}
            </Link>
          )}
          {cfg?.apps?.map((app) => (
            <a
              key={app.href}
              href={withBase(app.href)}
              target="_blank"
              rel="noopener noreferrer"
              className="wikinav__toollink"
            >
              {app.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      )}

      <ol className="wikinav__secs">
        {sections.map((s, i) => (
          <li key={s.key}>
            <details
              className={`wikinav__sec${
                s.key === activeKey ? " wikinav__sec--active" : ""
              }`}
              open={isOpen(s.key)}
              onToggle={(e) =>
                onToggle(s.key, (e.currentTarget as HTMLDetailsElement).open)
              }
            >
              <summary className="wikinav__sectitle">
                <span className="wikinav__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="wikinav__caret" aria-hidden="true" />
                <span className="wikinav__seclabel">{s.label}</span>
                <span className="wikinav__count">
                  {s.groups
                    ? s.groups.reduce(
                        (a, g) =>
                          a +
                          g.subgroups.reduce((b, sg) => b + sg.items.length, 0),
                        0,
                      )
                    : s.items.length}
                </span>
              </summary>
              {s.groups ? (
                <div className="wikinav__groups">
                  {s.groups.map((g) => (
                    <div className="wikinav__group" key={g.label}>
                      <span className="wikinav__grouplabel">{g.label}</span>
                      {g.subgroups.map((sg) => (
                        <div className="wikinav__subgroup" key={sg.label}>
                          <span className="wikinav__subgrouplabel">
                            {sg.label}
                          </span>
                          <ul>
                            {sg.items.map((it) => (
                              <li key={it.href}>
                                <Link
                                  href={it.href}
                                  className={`wikinav__link${
                                    it.href === currentHref ? " is-active" : ""
                                  }`}
                                  ref={
                                    it.href === currentHref
                                      ? activeLinkRef
                                      : undefined
                                  }
                                  aria-current={
                                    it.href === currentHref ? "page" : undefined
                                  }
                                >
                                  {it.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                  <ul className="wikinav__grouppages">
                    {s.items.map((it) => (
                      <li key={it.href}>
                        <Link
                          href={it.href}
                          className={`wikinav__link${
                            it.href === currentHref ? " is-active" : ""
                          }`}
                          ref={
                            it.href === currentHref ? activeLinkRef : undefined
                          }
                          aria-current={
                            it.href === currentHref ? "page" : undefined
                          }
                        >
                          {it.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <ul>
                  {s.items.map((it) => (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        className={`wikinav__link${
                          it.href === currentHref ? " is-active" : ""
                        }`}
                        ref={it.href === currentHref ? activeLinkRef : undefined}
                        aria-current={
                          it.href === currentHref ? "page" : undefined
                        }
                      >
                        {it.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </details>
          </li>
        ))}
      </ol>
    </nav>
  );
}
