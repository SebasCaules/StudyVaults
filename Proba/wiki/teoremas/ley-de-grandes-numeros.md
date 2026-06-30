---
titulo: Ley de los Grandes Números
tipo: teorema
unidad: 7
tags: [convergencia, promedio, teorema]
fuentes: ["[[teorica-ley-grandes-numeros]]", "[[teorica-suma-promedio-iid]]", "[[tp7-suma-de-va]]"]
actualizado: 2026-06-06
---

# Ley de los Grandes Números (LGN)

**En breve.** Garantiza que el [[promedio-muestral|promedio muestral]] $\bar X_n$
converge a la media poblacional $\mu$ cuando $n\to\infty$. Es la justificación
teórica de "estimar promediando" y de interpretar la probabilidad como frecuencia
relativa a la larga.

Formaliza la intuición de que **el promedio de muchas observaciones se acerca a
la media poblacional**. Según [[teorica-ley-grandes-numeros]].

![[lgn-convergencia.svg]]

Sea $\{X_k\}_{k\ge1}$ i.i.d. con media $\mu=\mu_X$ y varianza $\sigma^2=\sigma_X^2$,
y $\bar X_n=\tfrac1n\sum_{k=1}^n X_k$ el [[promedio-muestral]].

## Ley débil (LDGN)
$$
\lim_{n\to\infty} P\big(|\bar X_n-\mu|\ge\varepsilon\big)=0\qquad\forall\,\varepsilon>0.
$$
*Convergencia en probabilidad:* la prob. de que el error de aproximación sea
significativo tiende a $0$.

**Demostración (vía Chebyshev).** $\bar X_n$ tiene media $\mu$ y varianza $\sigma^2/n$.
Por la [[desigualdad-de-chebyshev|desigualdad de Chebyshev]]:
$$
P\big(|\bar X_n-\mu|\ge\varepsilon\big)\le\frac{V(\bar X_n)}{\varepsilon^2}=\frac{\sigma^2}{n\,\varepsilon^2}\xrightarrow{n\to\infty}0.
$$

> **Observación.** El paso $V(\bar X_n)=\sigma^2/n$ de la demo descansa en descomponer la varianza de la suma como suma de varianzas: $V\!\big(\sum_{k=1}^n X_k\big)=\sum_{k=1}^n V(X_k)$. Eso solo vale si las $X_k$ son **independientes** (o, más débil, no correlacionadas, $\mathrm{Cov}(X_i,X_j)=0$). Sin esa hipótesis hay que sumar además las covarianzas, y la cota $\sigma^2/(n\varepsilon^2)$ deja de valer tal cual. Acá está garantizado por el i.i.d. del enunciado.

## Ley fuerte (LFGN)
Bajo las mismas condiciones:
$$
P\!\left(\lim_{n\to\infty}\bar X_n=\mu\right)=1,
$$
o sea $\bar X_n\to\mu$ **con probabilidad 1** (convergencia casi segura).

> La diferencia entre débil y fuerte es sutil: la **fuerte** dice que la prob. de
> que el límite del promedio difiera de $\mu$ es **nula**; la **débil** sólo
> controla cada $n$ por separado. La fuerte implica la débil.

## Interpretación frecuentista de la probabilidad
Sea $A$ un evento con $p=P(A)$, repetido de forma independiente. Con
$\mathbb 1_k(A)=1$ si $A$ ocurrió en el $k$-ésimo experimento ($0$ si no), las
$\mathbb 1_k(A)$ son i.i.d. con media $p$. La **frecuencia relativa**
$\hat P_n=\tfrac1n\sum_{k=1}^n\mathbb 1_k(A)$ cumple, por la ley fuerte,
$$
\lim_{n\to\infty}\hat P_n=p\quad\text{con probabilidad 1}.
$$
Esta es la base de **estimar probabilidades repitiendo experimentos**
(ver [[tp7-suma-de-va]]).

**Intuición (LGN vs TCL).** La LGN dice *adónde* va el promedio (a $\mu$); el
[[teorema-central-del-limite|TCL]] dice *cómo* fluctúa en el camino (las
fluctuaciones son de tamaño $\sigma/\sqrt n$ y, reescaladas, son Normales). Son
complementarios: uno fija el blanco, el otro mide la puntería.

> **Intuición.** El desvío del promedio es $\sigma/\sqrt n\to 0$: a más datos, $\bar X_n$ se aprieta alrededor de $\mu$ hasta comportarse como una constante. Un valor atípico sigue apareciendo en las muestras individuales, pero al promediar contra muchos otros su peso relativo se diluye. En palabras del profe: *los promedios ahogan a los valores atípicos* — promediás muchas repeticiones y el extremo pierde relevancia.

## Relectura vía TCL
El [[teorema-central-del-limite|TCL]] da otra mirada: tipificando,
$$
P(|\bar X_n-\mu|\ge\varepsilon)\approx 2\Big(1-\Phi\big(\tfrac{\varepsilon}{\sigma/\sqrt n}\big)\Big)\xrightarrow{n\to\infty}0,
$$
porque el argumento $\tfrac{\varepsilon\sqrt n}{\sigma}\to\infty$ y $\Phi(\infty)=1$.

## Ejercicio resuelto
*([[tp7-suma-de-va]], ej. 16a.) Se estima $p=P(A)$ por la frecuencia relativa con
$n$ repeticiones. Se pide $P(|\hat P_n-p|\le 0.05)>0.97$. ¿Cuántas pruebas como
mínimo, usando Chebyshev?*

**Planteo.** $X_n\sim\mathrm{Bin}(n,p)$, $\hat P_n=X_n/n$, con
$E[\hat P_n]=p$ y $V(\hat P_n)=\dfrac{p(1-p)}{n}$.
Pedimos $P(|\hat P_n-p|>0.05)<0.03$.

**Chebyshev** con $\varepsilon=0.05$:
$$
P(|\hat P_n-p|\ge 0.05)\le\frac{p(1-p)}{n\cdot 0.05^2}.
$$

**Peor caso en $p$.** Como $p(1-p)\le\tfrac14$ (máximo en $p=\tfrac12$):
$$
P(|\hat P_n-p|>0.05)\le\frac{1/4}{n\cdot 0.05^2}=\frac{1}{4n\cdot 0.05^2}.
$$

**Despeje.** Pedimos $\dfrac{1}{4n\cdot 0.05^2}<0.03$:
$$
n>\frac{1}{4\cdot 0.03\cdot 0.05^2}=3333.\overline{3}\;\Rightarrow\; n\ge 3334.
$$

**Resultado.** Con Chebyshev hacen falta $n\ge 3334$ pruebas. *(La aproximación
normal —ej. 16b— da una cota mucho menor, $n\ge 471$, porque usa más información.)*

> ⚠️ **Discrepancia dentro del raw.** La sección "Respuestas" del
> [[tp7-suma-de-va]] reporta $3333$ (trunca $n>3333.\overline 3$); la resolución
> paso a paso de la misma guía exige $n\ge 3334$. El valor **matemáticamente
> correcto es $3334$**: para que la cota de Chebyshev quede por debajo de $0.03$
> hay que **redondear hacia arriba**, no truncar. El $471$ de la parte normal
> coincide en ambas secciones.

## Enlaces
- [[desigualdad-de-chebyshev]] (herramienta de la demo débil).
- [[teorema-central-del-limite]] (cuantifica la **velocidad** de convergencia).
- [[promedio-muestral]] · [[suma-de-variables-aleatorias]].
