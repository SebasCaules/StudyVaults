"use client";

import ToolkitShell, { type Tool } from "./ToolkitShell";
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

const tools: Tool[] = [
  // ── Probabilidad y conteo (U2) ──────────────────────────────────────
  {
    key: "combinatoria",
    label: "Combinatoria",
    group: "Probabilidad y conteo",
    icon: "braces",
    verb: "Contar",
    desc: "Permutaciones, variaciones y combinaciones (con o sin repetición), con la guía de cuándo usar cada una.",
    node: <CombinatoriaTool />,
  },
  {
    key: "bayes",
    label: "Bayes",
    group: "Probabilidad y conteo",
    icon: "branch",
    verb: "Actualizar",
    desc: "Probabilidad total y teorema de Bayes: cargá causas con sus priors y verosimilitudes y obtené los posteriores.",
    node: <BayesTool />,
  },

  // ── Distribuciones (U3, U4) ─────────────────────────────────────────
  {
    key: "distribuciones",
    label: "Distribuciones",
    group: "Distribuciones",
    icon: "bell",
    verb: "Calcular",
    desc: "Elegí una distribución (binomial, Poisson, normal, t, gamma…), ajustá sus parámetros y mirá probabilidades y gráfico en vivo.",
    node: <DistribucionesTool />,
  },
  {
    key: "normal",
    label: "Tabla normal",
    group: "Distribuciones",
    icon: "crossCurves",
    verb: "Buscar",
    desc: "La normal estándar interactiva: pasá de z a probabilidad y al revés, estandarizá X ~ N(μ, σ) y calculá P(a ≤ X ≤ b).",
    node: <TablaNormalTool />,
  },
  {
    key: "aprox-normal",
    label: "Aprox. normal",
    group: "Distribuciones",
    icon: "trending",
    verb: "Aproximar",
    desc: "Aproximación normal de la binomial con corrección por continuidad: compará el valor exacto contra la aproximación.",
    node: <AproxNormalTool />,
  },

  // ── Datos y muestras (U1) ───────────────────────────────────────────
  {
    key: "descriptiva",
    label: "Descriptiva",
    group: "Datos y muestras",
    icon: "bars",
    verb: "Analizar",
    desc: "Pegá tus datos y obtené media, desvío, cuartiles e histograma para resumir una muestra de un vistazo.",
    node: <DescriptivaTool />,
  },

  // ── Inferencia (U8) ─────────────────────────────────────────────────
  {
    key: "intervalos",
    label: "Intervalos de confianza",
    group: "Inferencia",
    icon: "target",
    verb: "Estimar",
    desc: "IC para la media (Z y t de Student) y para una proporción, bilateral o unilateral, con cálculo de tamaño muestral.",
    node: <IntervalosConfianzaTool />,
  },

  // ── Pruebas de hipótesis (U9) ───────────────────────────────────────
  {
    key: "test-hipotesis",
    label: "Test de hipótesis",
    group: "Pruebas de hipótesis",
    icon: "shield",
    verb: "Decidir",
    desc: "Prueba para la media (Z o T) y para la proporción: estadístico, región de rechazo, valor p y decisión, con gráfico.",
    node: <TestHipotesisTool />,
  },
  {
    key: "potencia",
    label: "Potencia y error II",
    group: "Pruebas de hipótesis",
    icon: "pulse",
    verb: "Diseñar",
    desc: "Error tipo II β, potencia 1 − β y diseño del tamaño muestral fijando α y β, con la curva de potencia.",
    node: <PotenciaErrorTool />,
  },

  // ── Procesos y decisión (U3, U6) ────────────────────────────────────
  {
    key: "markov",
    label: "Cadenas de Markov",
    group: "Procesos y decisión",
    icon: "matrix",
    verb: "Iterar",
    desc: "Matriz de transición, distribución a n pasos (Pⁿ) y distribución estacionaria de una cadena de Markov.",
    node: <MarkovTool />,
  },
  {
    key: "decision",
    label: "Teoría de la decisión",
    group: "Procesos y decisión",
    icon: "scale",
    verb: "Elegir",
    desc: "Matriz de pagos con estados de la naturaleza: valor esperado por alternativa y la mejor decisión.",
    node: <DecisionTool />,
  },

  // ── Referencia ──────────────────────────────────────────────────────
  {
    key: "formulario",
    label: "Formulario",
    group: "Referencia",
    icon: "formula",
    verb: "Consultar",
    desc: "Distribuciones, teoremas, suma de variables, inferencia y pruebas de hipótesis reunidos para repasar antes del parcial.",
    node: <FormularioTool />,
  },
];

export default function ProbaTools() {
  return (
    <ToolkitShell
      intro={
        <>
          Un kit de probabilidad y estadística que sigue el programa de la
          materia: conteo y Bayes, distribuciones y la normal, estadística
          descriptiva, intervalos de confianza, pruebas de hipótesis, procesos y
          decisión, más un formulario de repaso. Todo se recalcula en vivo sobre
          tus parámetros y datos.
        </>
      }
      tools={tools}
    />
  );
}
