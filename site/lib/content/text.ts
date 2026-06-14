// Convierte LaTeX simple a texto legible (para títulos y TOC, donde no
// renderizamos KaTeX). Cubre los casos comunes de los vaults; lo no cubierto
// se limpia a algo razonable (sin backslashes ni llaves).

const BLACKBOARD: Record<string, string> = {
  C: "ℂ",
  R: "ℝ",
  K: "𝕂",
  N: "ℕ",
  Z: "ℤ",
  Q: "ℚ",
  P: "ℙ",
  E: "𝔼",
};
const SUP: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵",
  "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", n: "ⁿ", i: "ⁱ",
  "+": "⁺", "-": "⁻", T: "ᵀ",
};
const SUB: Record<string, string> = {
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅",
  "6": "₆", "7": "₇", "8": "₈", "9": "₉", n: "ₙ", i: "ᵢ", j: "ⱼ",
};
const GREEK: Record<string, string> = {
  alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε",
  theta: "θ", lambda: "λ", mu: "μ", pi: "π", sigma: "σ", phi: "φ",
  omega: "ω", Delta: "Δ", Sigma: "Σ", Omega: "Ω", rho: "ρ", tau: "τ",
};

/** LaTeX (sin delimitadores) → texto unicode legible. */
export function mathToText(tex: string): string {
  let s = tex;
  s = s.replace(/\\mathbb\{([A-Z])\}/g, (_, c) => BLACKBOARD[c] || c);
  s = s.replace(/\\mathbb\s+([A-Z])/g, (_, c) => BLACKBOARD[c] || c);
  s = s.replace(/\\(mathbf|mathrm|mathcal|text|mathit)\{([^}]*)\}/g, "$2");
  s = s.replace(/\\([a-zA-Z]+)/g, (m, name) => GREEK[name] ?? "");
  s = s.replace(/\^\{([^}]*)\}/g, (_, g) =>
    [...g].map((c: string) => SUP[c] ?? c).join(""),
  );
  s = s.replace(/\^(.)/g, (_, c) => SUP[c] ?? `^${c}`);
  s = s.replace(/_\{([^}]*)\}/g, (_, g) =>
    [...g].map((c: string) => SUB[c] ?? c).join(""),
  );
  s = s.replace(/_(.)/g, (_, c) => SUB[c] ?? `_${c}`);
  s = s.replace(/[{}$]/g, "");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

/** Título/heading con posibles tramos $...$ → texto legible. */
export function displayTitle(s: string): string {
  if (!s.includes("$")) return s;
  return s.replace(/\$([^$]+)\$/g, (_, m) => mathToText(m)).replace(/\$/g, "");
}
