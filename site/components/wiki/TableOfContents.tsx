"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/content/render";

// Scroll-spy: resalta la entrada de la sección visible y sigue el scroll en
// páginas largas. IntersectionObserver sobre los headings (por id). Client-only
// con guard: en SSR/prerender no hay `window`, así que el primer render coincide
// con el servidor (sin id activo) y el effect lo actualiza tras hidratar.
export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window))
      return;

    const ids = items.map((it) => it.id);
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);
    if (!headings.length) return;

    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        // El activo es el heading visible más arriba en el documento; si ninguno
        // está en la banda (entre encabezados de una sección larga) se conserva
        // el último activo en vez de desmarcar.
        if (visible.size) {
          const first = ids.find((id) => visible.has(id));
          if (first) setActiveId(first);
        }
      },
      // Banda de disparo cerca del tope (debajo del nav): un heading cuenta como
      // "actual" al entrar en el ~30% superior del viewport.
      { rootMargin: "-72px 0px -68% 0px", threshold: 0 },
    );

    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [items]);

  if (!items.length) return null;
  return (
    <aside className="toc" aria-label="En esta página">
      <p className="toc__title">En esta página</p>
      <ul>
        {items.map((it) => {
          const active = it.id === activeId;
          return (
            <li
              key={it.id}
              className={it.depth === 3 ? "toc__item toc__item--sub" : "toc__item"}
            >
              <a
                href={`#${it.id}`}
                className={active ? "is-active" : undefined}
                aria-current={active ? "location" : undefined}
              >
                {it.text}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
