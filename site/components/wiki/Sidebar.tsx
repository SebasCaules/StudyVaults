"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NavSection } from "@/lib/content/nav-tree";
import { getVault } from "@/lib/content/vaults";

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
                <span className="wikinav__count">{s.items.length}</span>
              </summary>
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
            </details>
          </li>
        ))}
      </ol>
    </nav>
  );
}
