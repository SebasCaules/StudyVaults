"use client";

import { Panel, SubPanel, Note } from "@studyvaults/ui";

/* ============================================================================
 * Formulario — referencia estática de toda la materia (unidades 1–9).
 * Distribuciones, teoremas, suma de v.a., inferencia y pruebas de hipótesis.
 * Las fórmulas son fieles a los formularios del vault (formulario-*.md).
 * ========================================================================== */

type Row = {
  name: string;
  support: string;
  law: string;
  ev: string;
  varx: string;
};

const DISCRETAS: Row[] = [
  { name: "Bernoulli(p)", support: "{0, 1}", law: "pˣ(1−p)¹⁻ˣ", ev: "p", varx: "p(1−p)" },
  { name: "Binomial(n, p)", support: "{0, …, n}", law: "C(n,k) pᵏ(1−p)ⁿ⁻ᵏ", ev: "np", varx: "np(1−p)" },
  { name: "Geométrica(p) — fracasos", support: "{0, 1, …}", law: "(1−p)ᵏ p", ev: "(1−p)/p", varx: "(1−p)/p²" },
  { name: "Geométrica(p) — ensayos", support: "{1, 2, …}", law: "(1−p)ᵏ⁻¹ p", ev: "1/p", varx: "(1−p)/p²" },
  { name: "Binomial neg.(r, p) — fracasos", support: "{0, 1, …}", law: "C(k+r−1,k)(1−p)ᵏ pʳ", ev: "r(1−p)/p", varx: "r(1−p)/p²" },
  { name: "Hipergeom.(N, K, n)", support: "máx(0,n−N+K)…mín(n,K)", law: "C(K,k)C(N−K,n−k)/C(N,n)", ev: "nK/N", varx: "n·(K/N)(1−K/N)·(N−n)/(N−1)" },
  { name: "Poisson(λ)", support: "{0, 1, …}", law: "e⁻λ λᵏ / k!", ev: "λ", varx: "λ" },
  { name: "Uniforme disc.(a, b)", support: "{a, …, b}", law: "1 / (b−a+1)", ev: "(a+b)/2", varx: "((b−a+1)²−1)/12" },
];

const CONTINUAS: Row[] = [
  { name: "Uniforme(a, b)", support: "[a, b]", law: "1/(b−a)", ev: "(a+b)/2", varx: "(b−a)²/12" },
  { name: "Exponencial(λ)", support: "x ≥ 0", law: "λ e⁻λˣ", ev: "1/λ", varx: "1/λ²" },
  { name: "Normal(μ, σ²)", support: "ℝ", law: "φ((x−μ)/σ)/σ", ev: "μ", varx: "σ²" },
  { name: "Gamma(α, λ)", support: "x ≥ 0", law: "λᵅ xᵅ⁻¹ e⁻λˣ / Γ(α)", ev: "α/λ", varx: "α/λ²" },
  { name: "Erlang(k, λ)", support: "x ≥ 0", law: "λᵏ xᵏ⁻¹ e⁻λˣ / (k−1)!", ev: "k/λ", varx: "k/λ²" },
  { name: "Ji-cuadrado(k)", support: "x ≥ 0", law: "Gamma(k/2, 1/2)", ev: "k", varx: "2k" },
  { name: "t de Student(m)", support: "ℝ", law: "∝ (1 + t²/m)⁻⁽ᵐ⁺¹⁾ᐟ²", ev: "0 (m>1)", varx: "m/(m−2) (m>2)" },
];

function DistTable({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <SubPanel style={{ marginTop: 16 }}>
      <div className="vtool-eyebrow">{title}</div>
      <div style={{ overflowX: "auto", marginTop: 8 }}>
        <table className="vtool-table">
          <thead>
            <tr>
              <th>Distribución</th>
              <th>Soporte</th>
              <th>PMF / PDF</th>
              <th>E[X]</th>
              <th>Var(X)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.name}>
                <td style={{ fontWeight: 600 }}>{d.name}</td>
                <td><code>{d.support}</code></td>
                <td><code>{d.law}</code></td>
                <td><code>{d.ev}</code></td>
                <td><code>{d.varx}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SubPanel>
  );
}

export default function FormularioTool() {
  return (
    <Panel>
      <div className="vtool-head">
        <h3>Formulario</h3>
        <p>
          Soporte, esperanza y varianza de las distribuciones del curso, más los
          teoremas, la suma de variables, la inferencia y las pruebas de
          hipótesis reunidos para repasar antes del parcial.
        </p>
      </div>

      <DistTable title="Distribuciones discretas (U3)" rows={DISCRETAS} />
      <DistTable title="Distribuciones continuas (U4, U7, U8)" rows={CONTINUAS} />

      <SubPanel style={{ marginTop: 16 }}>
        <div className="vtool-eyebrow">Teoremas clave</div>
        <table className="vtool-table" style={{ marginTop: 8 }}>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>Bayes</td>
              <td>
                <code>P(Aᵢ | B) = P(B | Aᵢ) P(Aᵢ) / P(B)</code>, con{" "}
                <code>P(B) = Σⱼ P(B | Aⱼ) P(Aⱼ)</code> (probabilidad total) sobre
                una partición {"{Aⱼ}"}.
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>TCL</td>
              <td>
                Si X₁, …, Xₙ i.i.d. con media μ y varianza σ² &lt; ∞, entonces{" "}
                <code>(X̄ₙ − μ) / (σ/√n) →ᵈ N(0, 1)</code>. Equivalente:{" "}
                <code>Σ Xᵢ ≈ N(nμ, nσ²)</code>.
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>Markov / Chebyshev</td>
              <td>
                <code>P(X ≥ a) ≤ E[X]/a</code> (X ≥ 0);{" "}
                <code>P(|X − μ| ≥ ε) ≤ σ²/ε²</code>.
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>Linealidad</td>
              <td>
                <code>E[aX + bY] = a E[X] + b E[Y]</code>;{" "}
                <code>Var(aX + b) = a² Var(X)</code>; si indep.,{" "}
                <code>Var(X + Y) = Var(X) + Var(Y)</code>.
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>Ley grandes números</td>
              <td>X̄ₙ → μ (en prob. / casi seguro) cuando n → ∞.</td>
            </tr>
          </tbody>
        </table>
      </SubPanel>

      <SubPanel style={{ marginTop: 16 }}>
        <div className="vtool-eyebrow">Suma de v.a. independientes (U7)</div>
        <table className="vtool-table" style={{ marginTop: 8 }}>
          <tbody>
            <tr><td><code>n × Bernoulli(p)</code></td><td><code>Binomial(n, p)</code></td></tr>
            <tr><td><code>Bin(n₁,p) + Bin(n₂,p)</code></td><td><code>Bin(n₁+n₂, p)</code></td></tr>
            <tr><td><code>Poisson(λ₁) + Poisson(λ₂)</code></td><td><code>Poisson(λ₁+λ₂)</code></td></tr>
            <tr><td><code>N(μ₁,σ₁) + N(μ₂,σ₂)</code></td><td><code>N(μ₁+μ₂, √(σ₁²+σ₂²))</code></td></tr>
            <tr><td><code>n × Exp(λ)</code></td><td><code>Gamma(n, λ) = Erlangₙ(λ)</code></td></tr>
            <tr><td><code>Σ N(0,1)²</code> (n términos)</td><td><code>χ²ₙ</code></td></tr>
          </tbody>
        </table>
        <Note style={{ marginTop: 10 }}>
          <b>Aproximación normal de la binomial.</b> Bin(n,p) ≈ N(np, √(npq)).
          Con corrección por continuidad:{" "}
          <code>P(a ≤ S ≤ b) ≈ Φ((b+½−np)/√npq) − Φ((a−½−np)/√npq)</code>.
        </Note>
      </SubPanel>

      <SubPanel style={{ marginTop: 16 }}>
        <div className="vtool-eyebrow">Inferencia — intervalos de confianza (U8)</div>
        <table className="vtool-table" style={{ marginTop: 8 }}>
          <thead>
            <tr><th>Caso</th><th>Condición</th><th>Semiamplitud Δ (bilateral)</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Media (Z)</td>
              <td>σ conocido (o n grande)</td>
              <td><code>z₍₍₁₊γ₎/₂₎ · σ/√n</code></td>
            </tr>
            <tr>
              <td>Media (t)</td>
              <td>σ desconocido, normal</td>
              <td><code>t₍ₙ₋₁, ₍₁₊γ₎/₂₎ · Sₙ/√n</code></td>
            </tr>
            <tr>
              <td>Proporción</td>
              <td>n grande</td>
              <td><code>z₍₍₁₊γ₎/₂₎ · √(p̂(1−p̂)/n)</code></td>
            </tr>
          </tbody>
        </table>
        <Note style={{ marginTop: 10 }}>
          IC = estimador ± Δ. Unilaterales usan <code>z_γ</code> (o{" "}
          <code>t_γ</code>) en vez de <code>z₍₍₁₊γ₎/₂₎</code>. Tamaño muestral:
          media <code>n ≥ z²σ²/E²</code>; proporción{" "}
          <code>n ≥ z²·¼/E²</code> (conservador) o{" "}
          <code>n ≥ z²·p̂(1−p̂)/E²</code>. Árbol: proporción → Z; media σ conoc. →
          Z; media σ desc. n chico → t; n &gt; 200 → Z con Sₙ.
        </Note>
      </SubPanel>

      <SubPanel style={{ marginTop: 16 }}>
        <div className="vtool-eyebrow">Pruebas de hipótesis (U9)</div>
        <p style={{ margin: "8px 0" }}>
          Estadísticos:{" "}
          <code>Z = (X̄ − μ₀)/(σ/√n)</code>,{" "}
          <code>T = (X̄ − μ₀)/(S/√n) ~ t₍ₙ₋₁₎</code>,{" "}
          <code>Z = (q̂ − q₀)/√(q₀(1−q₀)/n)</code>.
        </p>
        <table className="vtool-table" style={{ marginTop: 8 }}>
          <thead>
            <tr><th>Prueba</th><th>H₀ / H₁</th><th>Rechaza si (Z)</th><th>Valor p</th></tr>
          </thead>
          <tbody>
            <tr><td>Dos colas</td><td>= / ≠</td><td><code>|Z| &gt; z₍₁₋α/₂₎</code></td><td><code>2(1 − Φ(|z|))</code></td></tr>
            <tr><td>Cola derecha</td><td>≤ / &gt;</td><td><code>Z &gt; z₍₁₋α₎</code></td><td><code>1 − Φ(z)</code></td></tr>
            <tr><td>Cola izquierda</td><td>≥ / &lt;</td><td><code>Z &lt; −z₍₁₋α₎</code></td><td><code>Φ(z)</code></td></tr>
          </tbody>
        </table>
        <Note style={{ marginTop: 10 }}>
          Rechazar H₀ ⟺ valor p &lt; α. Error II (σ conoc., cola derecha):{" "}
          <code>β(μ₁) = Φ(z₍₁₋α₎ + (μ₀−μ₁)/(σ/√n))</code>; potencia = 1 − β.
          Diseño (1 cola):{" "}
          <code>n = ((z₍₁₋α₎ + z₍₁₋β₎)·σ / (μ₁−μ₀))²</code>.
        </Note>
      </SubPanel>

      <SubPanel style={{ marginTop: 16 }}>
        <div className="vtool-eyebrow">Fractiles de uso frecuente</div>
        <table className="vtool-table" style={{ marginTop: 8 }}>
          <thead>
            <tr><th>α</th><th>z₍₁₋α₎ (1 cola)</th><th>z₍₁₋α/₂₎ (2 colas)</th></tr>
          </thead>
          <tbody>
            <tr><td>0.10</td><td><code>1.2816</code></td><td><code>1.6449</code></td></tr>
            <tr><td>0.05</td><td><code>1.6449</code></td><td><code>1.9600</code></td></tr>
            <tr><td>0.025</td><td><code>1.9600</code></td><td><code>2.2414</code></td></tr>
            <tr><td>0.01</td><td><code>2.3263</code></td><td><code>2.5758</code></td></tr>
          </tbody>
        </table>
      </SubPanel>
    </Panel>
  );
}
