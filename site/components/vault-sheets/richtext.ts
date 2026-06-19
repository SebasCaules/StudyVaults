/* ──────────────────────────────────────────────────────────────────────────
   Tokenizador de texto enriquecido compartido por el render (SheetMath) y los
   exportadores (exporters). Parte una cadena en tramos:
   - math: delimitado por `$...$` (LaTeX inline). `$$` = `$` literal.
   - code: delimitado por backticks `` `...` `` (identificadores / código).
   - text: el resto.
   Dentro de math, los backticks son literales; dentro de code, los `$` son
   literales. Así PAW/Inge2 pueden mezclar código y flechas matemáticas.
   ────────────────────────────────────────────────────────────────────────── */

export type Token = { type: "text" | "math" | "code"; value: string };

export function tokenize(text: string): Token[] {
  const out: Token[] = [];
  let buf = "";
  let mode: "text" | "math" | "code" = "text";
  const push = (t: Token["type"], v: string) => {
    if (v.length) out.push({ type: t, value: v });
  };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (mode === "text" && c === "$") {
      if (text[i + 1] === "$") {
        buf += "$";
        i++;
        continue;
      }
      push("text", buf);
      buf = "";
      mode = "math";
      continue;
    }
    if (mode === "math" && c === "$") {
      push("math", buf);
      buf = "";
      mode = "text";
      continue;
    }
    if (mode === "text" && c === "`") {
      push("text", buf);
      buf = "";
      mode = "code";
      continue;
    }
    if (mode === "code" && c === "`") {
      push("code", buf);
      buf = "";
      mode = "text";
      continue;
    }
    buf += c;
  }
  // tramo final (modo sin cerrar → se trata como su contenido crudo)
  push(mode, buf);
  return out;
}
