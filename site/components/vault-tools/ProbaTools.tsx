"use client";

import ToolkitShell, { type Tool } from "./ToolkitShell";
import FinalesTool from "./proba/finales/Finales";
import CombinatoriaTool from "./proba/Combinatoria";
import BayesTool from "./proba/Bayes";
import DistribucionesTool from "./proba/Distribuciones";
import TablaNormalTool from "./proba/TablaNormal";
import AproxNormalTool from "./proba/AproxNormal";
import DescriptivaTool from "./proba/Descriptiva";
import IntervalosConfianzaTool from "./proba/IntervalosConfianza";
import TestHipotesisTool from "./proba/TestHipotesis";
import PotenciaErrorTool from "./proba/PotenciaError";
import MarkovTool from "./proba/Markov";
import DecisionTool from "./proba/Decision";
import FormularioTool from "./proba/Formulario";

/* ============================================================================
 * Toolkit de Probabilidad y Estadística (93.24) — orquestador.
 * Cada herramienta vive en su propio archivo en ./proba/ y comparte el núcleo
 * numérico (lib/stats.ts) y el andamiaje de plots (proba/plot.tsx). Acá sólo se
 * arman las tabs y se agrupan por bloque del programa.
 * ========================================================================== */

/* Afiches bespoke del runner (micro-ilustraciones tinteadas por --k-color). */

/** Campana normal con el área central sombreada. */
const PosterGauss = (
  <svg viewBox="0 0 288 150" fill="none">
    <path d="M28 118 H260" stroke="var(--border)" strokeWidth={1.4} strokeLinecap="round" />
    <path d="M92 118 C120 118 126 40 144 40 C162 40 168 118 196 118 Z" fill="color-mix(in srgb, var(--k-color) 20%, transparent)" />
    <path d="M34 116 C82 116 100 44 144 44 C188 44 206 116 254 116" stroke="var(--k-color)" strokeWidth={2.4} strokeLinecap="round" />
    <path d="M92 118 V128 M144 40 V128 M196 118 V128" stroke="var(--border)" strokeWidth={1.2} strokeLinecap="round" />
    <circle cx="144" cy="44" r="2.6" fill="var(--k-color)" />
    <text x="86" y="142" fill="var(--text-secondary)" fontSize={10} style={{ fontFamily: "var(--font-mono)" }}>μ−σ</text>
    <text x="196" y="142" fill="var(--text-secondary)" fontSize={10} style={{ fontFamily: "var(--font-mono)" }}>μ+σ</text>
  </svg>
);

/** Árbol de probabilidad: prior → ramas → posteriores. */
const PosterBayes = (
  <svg viewBox="0 0 288 150" fill="none">
    <circle cx="66" cy="75" r="11" fill="color-mix(in srgb, var(--k-color) 18%, transparent)" stroke="var(--k-color)" strokeWidth={1.6} />
    <path d="M77 68 L150 40 M77 82 L150 110" stroke="var(--k-color)" strokeWidth={1.8} strokeLinecap="round" />
    <circle cx="162" cy="40" r="10" fill="color-mix(in srgb, var(--k-color) 14%, transparent)" stroke="var(--k-color)" strokeWidth={1.5} />
    <circle cx="162" cy="110" r="10" fill="var(--surface-2)" stroke="var(--border)" strokeWidth={1.5} />
    <path d="M172 36 L226 28 M172 44 L226 56" stroke="var(--text-secondary)" strokeWidth={1.4} strokeLinecap="round" opacity={0.7} />
    <path d="M172 106 L226 96 M172 114 L226 124" stroke="var(--text-secondary)" strokeWidth={1.4} strokeLinecap="round" opacity={0.7} />
    <g fill="var(--text-secondary)" opacity={0.8}>
      <circle cx="234" cy="28" r="4" /><circle cx="234" cy="56" r="4" />
      <circle cx="234" cy="96" r="4" /><circle cx="234" cy="124" r="4" />
    </g>
    <text x="52" y="102" fill="var(--text-secondary)" fontSize={10} style={{ fontFamily: "var(--font-mono)" }}>P(H)</text>
  </svg>
);

const tools: Tool[] = [
  // ── Práctica de examen ──────────────────────────────────────────────
  {
    key: "finales",
    label: "Banco de finales",
    group: "Práctica de examen",
    icon: "exam",
    tone: "caution",
    verb: "Practicar",
    desc: "Parciales y finales resueltos paso a paso, navegables como un file system, filtrables por tipo de ejercicio, con TPs propuestos y verdadero/falso.",
    node: <FinalesTool />,
  },

  // ── Probabilidad y conteo (U2) ──────────────────────────────────────
  {
    key: "combinatoria",
    label: "Combinatoria",
    group: "Probabilidad y conteo",
    icon: "dice",
    tone: "def",
    verb: "Contar",
    desc: "Permutaciones, variaciones y combinaciones (con o sin repetición), con la guía de cuándo usar cada una.",
    node: <CombinatoriaTool />,
  },
  {
    key: "bayes",
    label: "Bayes",
    group: "Probabilidad y conteo",
    icon: "bayesTree",
    tone: "def",
    verb: "Actualizar",
    desc: "Probabilidad total y teorema de Bayes: cargá causas con sus priors y verosimilitudes y obtené los posteriores.",
    poster: PosterBayes,
    node: <BayesTool />,
  },

  // ── Distribuciones (U3, U4) ─────────────────────────────────────────
  {
    key: "distribuciones",
    label: "Distribuciones",
    group: "Distribuciones",
    icon: "bell",
    tone: "accent",
    verb: "Calcular",
    desc: "Elegí una distribución (binomial, Poisson, normal, t, gamma…), ajustá sus parámetros y mirá probabilidades y gráfico en vivo.",
    poster: PosterGauss,
    node: <DistribucionesTool />,
  },
  {
    key: "normal",
    label: "Tabla normal",
    group: "Distribuciones",
    icon: "tableGrid",
    tone: "accent",
    verb: "Buscar",
    desc: "La normal estándar interactiva: pasá de z a probabilidad y al revés, estandarizá X ~ N(μ, σ) y calculá P(a ≤ X ≤ b).",
    node: <TablaNormalTool />,
  },
  {
    key: "aprox-normal",
    label: "Aprox. normal",
    group: "Distribuciones",
    icon: "approxBars",
    tone: "accent",
    verb: "Aproximar",
    desc: "Aproximación normal de la binomial con corrección por continuidad: compará el valor exacto contra la aproximación.",
    node: <AproxNormalTool />,
  },

  // ── Datos y muestras (U1) ───────────────────────────────────────────
  {
    key: "descriptiva",
    label: "Descriptiva",
    group: "Datos y muestras",
    icon: "histogram",
    tone: "example",
    verb: "Analizar",
    desc: "Pegá tus datos y obtené media, desvío, cuartiles e histograma para resumir una muestra de un vistazo.",
    node: <DescriptivaTool />,
  },

  // ── Inferencia (U8) ─────────────────────────────────────────────────
  {
    key: "intervalos",
    label: "Intervalos de confianza",
    group: "Inferencia",
    icon: "intervalCI",
    tone: "theorem",
    verb: "Estimar",
    desc: "IC para la media (Z y t de Student) y para una proporción, bilateral o unilateral, con cálculo de tamaño muestral.",
    node: <IntervalosConfianzaTool />,
  },

  // ── Pruebas de hipótesis (U9) ───────────────────────────────────────
  {
    key: "test-hipotesis",
    label: "Test de hipótesis",
    group: "Pruebas de hipótesis",
    icon: "scale",
    tone: "method",
    verb: "Decidir",
    desc: "Prueba para la media (Z o T) y para la proporción: estadístico, región de rechazo, valor p y decisión, con gráfico.",
    node: <TestHipotesisTool />,
  },
  {
    key: "potencia",
    label: "Potencia y error II",
    group: "Pruebas de hipótesis",
    icon: "powerOverlap",
    tone: "method",
    verb: "Diseñar",
    desc: "Error tipo II β, potencia 1 − β y diseño del tamaño muestral fijando α y β, con la curva de potencia.",
    node: <PotenciaErrorTool />,
  },

  // ── Procesos y decisión (U3, U6) ────────────────────────────────────
  {
    key: "markov",
    label: "Cadenas de Markov",
    group: "Procesos y decisión",
    icon: "markov",
    tone: "def",
    verb: "Iterar",
    desc: "Matriz de transición, distribución a n pasos (Pⁿ) y distribución estacionaria de una cadena de Markov.",
    node: <MarkovTool />,
  },
  {
    key: "decision",
    label: "Teoría de la decisión",
    group: "Procesos y decisión",
    icon: "decision",
    tone: "def",
    verb: "Elegir",
    desc: "Matriz de pagos con estados de la naturaleza: valor esperado por alternativa y la mejor decisión.",
    node: <DecisionTool />,
  },

  // ── Referencia ──────────────────────────────────────────────────────
  {
    key: "formulario",
    label: "Formulario",
    group: "Referencia",
    icon: "document",
    tone: "example",
    verb: "Consultar",
    desc: "Distribuciones, teoremas, suma de variables, inferencia y pruebas de hipótesis reunidos para repasar antes del parcial.",
    node: <FormularioTool />,
  },
];

export default function ProbaTools() {
  return (
    <ToolkitShell
      launcher={{
        code: "SYS.02",
        kicker: "Distribuciones e inferencia",
        title: "Probabilidad y Estadística",
        accent: "var(--accent)",
        pattern: "radial",
        variant: "grid",
        dek: "De la combinatoria a la inferencia: distribuciones con gráfico en vivo, estimación, pruebas de hipótesis y un banco de finales resueltos. Todo se recalcula sobre tus parámetros y datos.",
        meta: (
          <>
            <span className="tk__hero-metaitem">
              <b>13</b> herramientas
            </span>
            <span className="tk__hero-metaitem">
              <b>8</b> categorías
            </span>
            <span className="tk__hero-metaitem">/proba/herramientas</span>
          </>
        ),
        motif: (
          <svg viewBox="0 0 320 200" fill="none">
            <line x1="20" y1="168" x2="300" y2="168" stroke="var(--border)" strokeWidth={1.5} />
            <g fill="color-mix(in srgb, var(--link) 32%, transparent)">
              <rect x="34" y="162" width="18" height="6" />
              <rect x="58" y="154" width="18" height="14" />
              <rect x="82" y="142" width="18" height="26" />
              <rect x="106" y="126" width="18" height="42" />
              <rect x="130" y="110" width="18" height="58" />
              <rect x="154" y="96" width="18" height="72" />
              <rect x="178" y="110" width="18" height="58" />
              <rect x="202" y="126" width="18" height="42" />
              <rect x="226" y="142" width="18" height="26" />
              <rect x="250" y="154" width="18" height="14" />
              <rect x="274" y="162" width="18" height="6" />
            </g>
            <path
              d="M22 164 C70 164 90 54 163 54 C236 54 256 164 302 164"
              stroke="var(--accent)"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <g fill="var(--link)" opacity={0.85}>
              <circle cx="102" cy="100" r="2.4" />
              <circle cx="126" cy="90" r="2.4" />
              <circle cx="150" cy="66" r="2.4" />
              <circle cx="176" cy="70" r="2.4" />
              <circle cx="198" cy="104" r="2.4" />
            </g>
            <g stroke="var(--border)" strokeWidth={1}>
              <line x1="91" y1="168" x2="91" y2="172" />
              <line x1="235" y1="168" x2="235" y2="172" />
            </g>
            <text x="82" y="184" fill="var(--text-secondary)" fontSize={10} style={{ fontFamily: "var(--font-mono)" }}>
              −3σ
            </text>
            <text x="222" y="184" fill="var(--text-secondary)" fontSize={10} style={{ fontFamily: "var(--font-mono)" }}>
              +3σ
            </text>
          </svg>
        ),
      }}
      tools={tools}
    />
  );
}
