"use client";

import type { CSSProperties } from "react";
import { withBase } from "@/lib/content/slug";
import styles from "./HeroFallback.module.css";

// Fallback estático del hero cuando no se monta la escena 3D: sin WebGL,
// con prefers-reduced-motion, o mientras la carta aún no entró en viewport.
// Reemplaza el canvas con un panel sobrio: cada materia del wiki con su color
// y su cantidad de notas, navegable (links reales a cada vault). Consume los
// MISMOS datos que el grafo (chips derivados de graph.json), sin three.js.
type Item = {
  id: string;
  short: string;
  count: number;
  cDark: string;
  cLight: string;
};

export default function HeroFallback({
  chips,
  light,
}: {
  chips: Item[];
  light: boolean;
}) {
  if (chips.length === 0) {
    return <div className={styles.empty}>cargando el mapa del wiki…</div>;
  }
  return (
    <nav className={styles.root} aria-label="Materias del wiki">
      <ul className={styles.list}>
        {chips.map((c) => (
          <li key={c.id}>
            <a
              className={styles.row}
              href={withBase(`/${c.id}/`)}
              style={
                { "--dot": light ? c.cLight : c.cDark } as CSSProperties
              }
            >
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.name}>{c.short}</span>
              <span className={styles.count}>{c.count}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
