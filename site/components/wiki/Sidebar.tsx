"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

  useEffect(() => {
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
