import type { Sheet, SheetEntry, EntryKind } from "./types";
import { defaultKind, KIND_META } from "./types";
import { tokenize } from "./richtext";

/* ──────────────────────────────────────────────────────────────────────────
   Exportadores: una misma Sheet → LaTeX (.tex compilable, denso, color-coded)
   y Markdown (.md, estilo formulario del vault). Ambos son funciones puras.
   ────────────────────────────────────────────────────────────────────────── */

/* ================================== LaTeX ================================= */

const TEX_ESC: Record<string, string> = {
  "\\": "\\textbackslash{}",
  "&": "\\&",
  "%": "\\%",
  $: "\\$",
  "#": "\\#",
  _: "\\_",
  "{": "\\{",
  "}": "\\}",
  "~": "\\textasciitilde{}",
  "^": "\\textasciicircum{}",
};

// Símbolos Unicode → comando LaTeX. Los agentes escriben Unicode (lo acepta
// KaTeX) pero pdflatex no, así que traducimos al exportar. El valor es el
// comando SIN delimitadores (válido en modo math).
const UNI: Record<string, string> = {
  // griegas minúsculas
  α: "\\alpha", β: "\\beta", γ: "\\gamma", δ: "\\delta", ε: "\\varepsilon",
  ϵ: "\\epsilon", ζ: "\\zeta", η: "\\eta", θ: "\\theta", ϑ: "\\vartheta",
  ι: "\\iota", κ: "\\kappa", λ: "\\lambda", μ: "\\mu", ν: "\\nu", ξ: "\\xi",
  π: "\\pi", ϖ: "\\varpi", ρ: "\\rho", ϱ: "\\varrho", σ: "\\sigma",
  ς: "\\varsigma", τ: "\\tau", υ: "\\upsilon", φ: "\\varphi", ϕ: "\\phi",
  χ: "\\chi", ψ: "\\psi", ω: "\\omega",
  // griegas mayúsculas
  Γ: "\\Gamma", Δ: "\\Delta", Θ: "\\Theta", Λ: "\\Lambda", Ξ: "\\Xi",
  Π: "\\Pi", Σ: "\\Sigma", Φ: "\\Phi", Ψ: "\\Psi", Ω: "\\Omega", Υ: "\\Upsilon",
  // relaciones / operadores
  "−": "-", "×": "\\times", "÷": "\\div", "∓": "\\mp", "±": "\\pm",
  "⋅": "\\cdot", "·": "\\cdot", "∙": "\\cdot", "∘": "\\circ",
  "≤": "\\le", "≥": "\\ge", "≠": "\\neq", "≈": "\\approx", "≅": "\\cong",
  "≡": "\\equiv", "∝": "\\propto", "∼": "\\sim", "≲": "\\lesssim",
  "≳": "\\gtrsim", "≪": "\\ll", "≫": "\\gg", "≜": "\\triangleq",
  "→": "\\to", "←": "\\leftarrow", "↔": "\\leftrightarrow", "↦": "\\mapsto",
  "⇒": "\\Rightarrow", "⇐": "\\Leftarrow", "⇔": "\\iff", "⟶": "\\longrightarrow",
  "⟺": "\\iff", "⟹": "\\implies", "⟸": "\\impliedby", "↕": "\\updownarrow",
  "↑": "\\uparrow", "↓": "\\downarrow",
  "∞": "\\infty", "∂": "\\partial", "∇": "\\nabla", "√": "\\surd",
  "∑": "\\sum", "∏": "\\prod", "∫": "\\int", "∮": "\\oint",
  "∈": "\\in", "∉": "\\notin", "∋": "\\ni", "∅": "\\emptyset",
  "⊂": "\\subset", "⊃": "\\supset", "⊆": "\\subseteq", "⊇": "\\supseteq",
  "∪": "\\cup", "∩": "\\cap", "∖": "\\setminus", "⊎": "\\uplus",
  "∀": "\\forall", "∃": "\\exists", "∄": "\\nexists", "¬": "\\neg",
  "∧": "\\wedge", "∨": "\\vee", "⊕": "\\oplus", "⊗": "\\otimes", "⊙": "\\odot",
  "⊥": "\\perp", "∥": "\\parallel", "∠": "\\angle", "°": "^{\\circ}",
  "′": "'", "″": "''", "…": "\\dots", "⋯": "\\cdots", "⋮": "\\vdots",
  "⟨": "\\langle", "⟩": "\\rangle", "⌈": "\\lceil", "⌉": "\\rceil",
  "⌊": "\\lfloor", "⌋": "\\rfloor", "‖": "\\|", "⊤": "\\top", "⊨": "\\models",
  "⊢": "\\vdash", "ℝ": "\\mathbb{R}", "ℂ": "\\mathbb{C}", "ℕ": "\\mathbb{N}",
  "ℤ": "\\mathbb{Z}", "ℚ": "\\mathbb{Q}", "ⁿ": "^{n}", "²": "^{2}",
  "³": "^{3}", "¹": "^{1}", "₀": "_{0}", "₁": "_{1}", "₂": "_{2}",
  "✓": "\\checkmark", "✗": "\\times", "∎": "\\square", "½": "\\tfrac12",
  // tipográficos
  "–": "--", "—": "---", "‘": "`", "’": "'", "“": "``", "”": "''",
};
const UNI_RE = new RegExp(`[${Object.keys(UNI).join("")}]`, "g");

// Red de seguridad: emoji / pictogramas sin equivalente LaTeX → se descartan
// (romperían pdflatex). Se aplica DESPUÉS de UNI, así no afecta lo mapeado.
const EMOJI_RE =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu;

/** Traduce símbolos Unicode a comandos LaTeX (para usar dentro de modo math). */
function texMath(s: string): string {
  return s.replace(UNI_RE, (c) => UNI[c] ?? c).replace(EMOJI_RE, "");
}

/** Escapa especiales de LaTeX en texto plano y envuelve símbolos Unicode en math. */
function texEscape(s: string): string {
  return s
    .replace(/[\\&%$#_{}~^]/g, (c) => TEX_ESC[c] ?? c)
    .replace(UNI_RE, (c) => (c === "−" ? "-" : `$${UNI[c]}$`))
    .replace(EMOJI_RE, "");
}

/** Texto enriquecido → LaTeX: texto escapado, math en `$...$`, code en \texttt,
 *  negrita (`**…**`) en \textbf. */
function texRich(text: string): string {
  return tokenize(text)
    .map((s) => {
      const inner =
        s.type === "math"
          ? `$${texMath(s.value)}$`
          : s.type === "code"
            ? `\\texttt{${texEscape(s.value)}}`
            : texEscape(s.value);
      return s.strong ? `\\textbf{${inner}}` : inner;
    })
    .join("");
}

const TEX_COLOR: Record<EntryKind, string> = {
  def: "sheetDef",
  theorem: "sheetThm",
  formula: "sheetFml",
  method: "sheetMth",
  caution: "sheetCau",
  example: "sheetEx",
};

const TEX_COLOR_DEFS = `\\definecolor{sheetDef}{HTML}{2563EB}
\\definecolor{sheetThm}{HTML}{7C3AED}
\\definecolor{sheetFml}{HTML}{0F9D8F}
\\definecolor{sheetMth}{HTML}{D97706}
\\definecolor{sheetCau}{HTML}{DC2626}
\\definecolor{sheetEx}{HTML}{6B7280}`;

function texEntry(e: SheetEntry, sheetKind: Sheet["kind"]): string {
  const kind = e.kind ?? defaultKind(sheetKind);
  const color = TEX_COLOR[kind];
  const lines: string[] = [];
  const label = `\\textcolor{${color}}{\\textbf{${texRich(e.label)}}}`;

  if (e.tex && e.inline) {
    lines.push(`\\item ${label}: $${texMath(e.tex)}$`);
  } else if (e.tex) {
    lines.push(`\\item ${label}\\nopagebreak\\par\\vspace{1pt}`);
    lines.push(`{\\footnotesize\\[ ${texMath(e.tex)} \\]}`);
  } else {
    lines.push(`\\item ${label}${e.body ? `: ${texRich(e.body)}` : ""}`);
  }
  if (e.tex && e.body) lines.push(`\\par ${texRich(e.body)}`);
  if (e.vars && e.vars.length) {
    lines.push(`\\par {\\footnotesize\\itshape donde:}`);
    for (const v of e.vars)
      lines.push(
        `\\par {\\footnotesize \\hspace*{0.8em}$${texMath(v.sym)}$: ${texRich(v.desc)}}`,
      );
  }
  if (e.cond) lines.push(`\\par {\\small\\itshape ${texRich(e.cond)}}`);
  if (e.note)
    lines.push(
      `\\par {\\small\\textcolor{sheetCau}{$\\triangleright$} ${texRich(e.note)}}`,
    );
  return lines.join("\n");
}

/** Sheet → documento LaTeX completo y compilable (article + multicol). */
export function toTex(sheet: Sheet, columns = 3): string {
  const cols = Math.max(1, Math.min(4, Math.round(columns)));
  const head = `% ${sheet.title} — ${sheet.kind === "formulas" ? "hoja de fórmulas" : "hoja de conceptos"}
% Generado por StudyVaults. Compilar con pdflatex.
\\documentclass[10pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{amsmath,amssymb}
\\usepackage{extarrows}
\\usepackage[a4paper,margin=1.1cm]{geometry}
\\usepackage{multicol}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage{parskip}
\\usepackage{titlesec}
${TEX_COLOR_DEFS}
\\setlength{\\columnsep}{14pt}
\\setlist[itemize]{leftmargin=1em,itemsep=2pt,topsep=2pt,parsep=0pt}
\\titleformat{\\section}{\\bfseries\\small\\scshape\\color{sheetFml}}{}{0pt}{}
\\titlespacing{\\section}{0pt}{6pt}{2pt}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\begin{document}
{\\Large\\bfseries ${texEscape(sheet.title)}}\\hfill {\\small ${
    sheet.kind === "formulas" ? "Hoja de fórmulas" : "Hoja de conceptos"
  }}\\par
${sheet.subtitle ? `{\\small ${texEscape(sheet.subtitle)}}\\par` : ""}
${sheet.notation ? `{\\footnotesize\\itshape ${texRich(sheet.notation)}}\\par` : ""}
\\vspace{4pt}\\hrule\\vspace{6pt}
\\footnotesize
\\begin{multicols}{${cols}}`;

  let lastUnit: string | undefined;
  const body = sheet.groups
    .map((g) => {
      let unitHead = "";
      if (g.unit && g.unit !== lastUnit) {
        lastUnit = g.unit;
        const ut = g.unitTitle ? texEscape(g.unitTitle) : `Unidad ${texEscape(g.unit)}`;
        unitHead = `{\\color{sheetFml}\\rule{\\linewidth}{0.6pt}}\\par\\nobreak\\vspace{1pt}{\\bfseries\\normalsize\\color{sheetFml} U${texEscape(g.unit)} · ${ut}}\\par\\nobreak\\vspace{2pt}\n`;
      }
      const items = g.entries.map((e) => texEntry(e, sheet.kind)).join("\n");
      const hint = g.hint ? `\\par{\\scriptsize\\itshape ${texRich(g.hint)}}` : "";
      return `${unitHead}\\section*{${texEscape(g.title)}}${hint}\n\\begin{itemize}\n${items}\n\\end{itemize}`;
    })
    .join("\n\n");

  return `${head}\n${body}\n\\end{multicols}\n\\end{document}\n`;
}

/* ================================ Markdown ================================ */

function mdEntry(e: SheetEntry): string {
  const tag = e.kind ? `\`${KIND_META[e.kind].label}\` ` : "";
  let line = `- ${tag}**${e.label}**`;
  if (e.tex) line += e.inline ? ` — $${e.tex}$` : `\n  $$${e.tex}$$`;
  if (e.body) line += `${e.tex && !e.inline ? "\n  " : " — "}${e.body}`;
  if (e.vars && e.vars.length) {
    line += `\n  _donde:_`;
    for (const v of e.vars) line += `\n  - $${v.sym}$ — ${v.desc}`;
  }
  if (e.cond) line += `\n  _Cuándo:_ ${e.cond}`;
  if (e.note) line += `\n  _⚠ ${e.note}_`;
  return line;
}

/** Sheet → Markdown (estilo formulario del vault: H2 por sección, listas). */
export function toMd(sheet: Sheet): string {
  const fm = [
    "---",
    `titulo: ${sheet.title} — ${sheet.kind === "formulas" ? "Hoja de fórmulas" : "Hoja de conceptos"}`,
    `tipo: ${sheet.kind === "formulas" ? "formulario" : "concepto"}`,
    `tags: [${sheet.kind === "formulas" ? "formulario, cheatsheet" : "concepto, cheatsheet"}]`,
    sheet.updated ? `actualizado: ${sheet.updated}` : null,
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  const header = `# ${sheet.title} — ${
    sheet.kind === "formulas" ? "Hoja de fórmulas" : "Hoja de conceptos"
  }`;
  const intro = [
    sheet.subtitle ? `${sheet.subtitle}` : null,
    sheet.notation ? `> **Notación.** ${sheet.notation}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const hasUnits = sheet.groups.some((g) => g.unit);
  let lastUnit: string | undefined;
  const body = sheet.groups
    .map((g) => {
      let unitHead = "";
      if (g.unit && g.unit !== lastUnit) {
        lastUnit = g.unit;
        unitHead = `## Unidad ${g.unit}${g.unitTitle ? ` · ${g.unitTitle}` : ""}\n\n`;
      }
      const level = hasUnits ? "###" : "##";
      const hint = g.hint ? `\n_${g.hint}_\n` : "";
      const items = g.entries.map(mdEntry).join("\n");
      return `${unitHead}${level} ${g.title}\n${hint}\n${items}`;
    })
    .join("\n\n");

  return `${fm}\n\n${header}\n\n${intro ? `${intro}\n\n` : ""}${body}\n`;
}

/** Dispara la descarga de un string como archivo (client-only). */
export function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
