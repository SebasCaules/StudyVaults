---
tags: [teoria, unidad-7, combinacion-lineal, generadores, gen]
fuentes:
  - raw/3-resumenes/algebra.pdf
  - raw/1-teoricas/algebra.pdf
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Combinación lineal y generadores

Con la suma y el producto por escalar se arma una **combinación lineal** de un conjunto de
vectores. El conjunto de todas las combinaciones lineales posibles, $\mathrm{gen}\,G$, es
un subespacio y da lugar a la noción de **conjunto de generadores**. Continúa la unidad
iniciada en [[01-espacios-vectoriales]]. Transcripción de los apuntes de la cursada
2023-1C.

## Combinación lineal

> **Definición (combinación lineal).** Sea $V$ un $\mathbb{K}$-e.v. y sean
> $v, v_1, v_2, \dots, v_n \in V$. Se dice que $v$ es **combinación lineal** de
> $v_1, v_2, \dots, v_n$ si existen escalares $\alpha_1, \alpha_2, \dots, \alpha_n \in
> \mathbb{K}$ tales que
> $$v = \alpha_1 v_1 + \alpha_2 v_2 + \cdots + \alpha_n v_n.$$

**Ejemplos.**

- $w = (1, 2)$ es combinación lineal de $v_1 = (1, 0)$ y $v_2 = (0, 1)$, pues
  $w = 1 \cdot v_1 + 2 \cdot v_2$.
- Cualquier matriz simétrica $2 \times 2$ es combinación lineal de
  $$A_1 = \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}, \quad
    A_2 = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}, \quad
    A_3 = \begin{pmatrix} 0 & 0 \\ 0 & 1 \end{pmatrix},$$
  ya que $\begin{pmatrix} a & b \\ b & c \end{pmatrix} = a A_1 + b A_2 + c A_3$.
- Todo vector de $\mathbb{R}^2$ es combinación lineal de $e_1 = (1, 0)$ y $e_2 = (0, 1)$:
  $(a, b) = a\, e_1 + b\, e_2$.

**Contraejemplo.** $w = (1, 2, 3)$ **no** es combinación lineal de $v_1 = (1, 0, 1)$ y
$v_2 = (0, 1, -1)$. Si lo fuera, existirían $\alpha, \beta$ con $w = \alpha v_1 + \beta
v_2$, de donde
$$(1, 2, 3) = (\alpha,\, \beta,\, \alpha - \beta).$$
Igualando componentes, las dos primeras dan $\alpha = 1$ y $\beta = 2$, pero la tercera
exige $\alpha - \beta = 3$, es decir $1 - 2 = 3$, un absurdo.

**Observación (vía sistema).** Decidir si $(a, b)$ es combinación lineal de $v_1 = (1, 1)$
y $v_2 = (1, -1)$ equivale a resolver el sistema $\alpha + \beta = a$, $\alpha - \beta =
b$. Escalonando la ampliada
$$\left(\begin{array}{cc|c} 1 & 1 & a \\ 1 & -1 & b \end{array}\right)
\xrightarrow{\,F_2 - F_1\,}
\left(\begin{array}{cc|c} 1 & 1 & a \\ 0 & -2 & b - a \end{array}\right)$$
el sistema es compatible ($\mathrm{Rg}(A) = \mathrm{Rg}(A \mid b) = 2$), así que **todo**
$(a, b) \in \mathbb{R}^2$ es combinación lineal de $v_1$ y $v_2$.

## Espacio generado $\mathrm{gen}\,G$

> **Definición (generado).** Sea $V$ un $\mathbb{K}$-e.v. y $G = \{ v_1, \dots, v_n \}
> \subseteq V$. El **espacio generado** por $G$ es el conjunto de todas las combinaciones
> lineales de sus vectores:
> $$\mathrm{gen}\,G = \mathrm{gen}\{ v_1, \dots, v_n \} = \Big\{ v \in V : \exists\,
> \alpha_1, \dots, \alpha_n \in \mathbb{K},\ v = \sum_{s=1}^{n} \alpha_s v_s \Big\}.$$

> **Teorema.** $\mathrm{gen}\,G$ es un subespacio de $V$.

La demostración chequea las cuatro condiciones de subespacio (ver
[[02-subespacios]]):

1. $\mathrm{gen}\,G \subseteq V$ por definición.
2. $0 \in \mathrm{gen}\,G$, tomando $0 = 0 \cdot v_1 + \cdots + 0 \cdot v_n$.
3. Si $v = \sum_s \alpha_s v_s$ y $w = \sum_s \beta_s v_s$ están en $\mathrm{gen}\,G$,
   entonces
   $$v + w = \sum_{s=1}^{n} \alpha_s v_s + \sum_{s=1}^{n} \beta_s v_s
   = \sum_{s=1}^{n} (\alpha_s + \beta_s)\, v_s \in \mathrm{gen}\,G,$$
   pues $\alpha_s + \beta_s \in \mathbb{K}$.
4. Si $v = \sum_s \alpha_s v_s$ y $\alpha \in \mathbb{K}$, entonces
   $$\alpha v = \alpha \Big( \sum_{s=1}^{n} \alpha_s v_s \Big)
   = \sum_{s=1}^{n} (\alpha \cdot \alpha_s)\, v_s \in \mathrm{gen}\,G.$$

**Ejemplos de $\mathrm{gen}$.**

- $\mathrm{gen}\{(1,1)\} = \{ \alpha (1, 1) : \alpha \in \mathbb{R} \} = \{ (\alpha,
  \alpha)^t : \alpha \in \mathbb{R} \}$, la recta diagonal. Así $(3, 3) \in S$ pero
  $(2, 3) \notin S$.
- $\mathbb{R}^2 = \mathrm{gen}\{ e_1, e_2 \}$.
- $\mathbb{R}^{2 \times 3} = \mathrm{gen}\{ E_{11}, E_{12}, E_{13}, E_{21}, E_{22},
  E_{23} \}$, donde $E_{ij}$ es la matriz con un $1$ en la posición $(i,j)$ y ceros en el
  resto.
- $\mathbb{R}_3[x] = \mathrm{gen}\{ x^3, x^2, x, 1 \}$: todo polinomio de grado $\le 3$ se
  escribe $p = a x^3 + b x^2 + c x + d$.

## Conjunto de generadores de un subespacio

> **Definición (conjunto de generadores).** Sea $V$ un $\mathbb{K}$-e.v. y $S$ un
> subespacio de $V$. Se dice que $G = \{ v_1, \dots, v_n \}$ es un **conjunto de
> generadores** de $S$ si $S = \mathrm{gen}\,G$.

**Ejemplo (generadores de un núcleo).** Para
$$S = \{ x \in \mathbb{R}^4 : x_1 - x_2 + x_3 + x_4 = 0 \ \text{y} \ x_1 - x_3 + 2x_4 = 0 \}$$
se resuelve el sistema homogéneo asociado. Escalonando se despejan
$x_1 = x_3 - 2x_4$ y $x_2 = 2x_3 - x_4$, con $x_3, x_4$ libres, de modo que
$$x = x_3\,(1, 2, 1, 0) + x_4\,(-2, -1, 0, 1) \implies
S = \mathrm{gen}\{ (1, 2, 1, 0),\ (-2, -1, 0, 1) \}.$$

**Ejemplo (matrices antisimétricas).** Para $S = \{ A \in \mathbb{R}^{2 \times 2} :
A \text{ es antisimétrica} \}$, la condición $A^t = -A$ obliga a
$A = \begin{pmatrix} 0 & a \\ -a & 0 \end{pmatrix} = a \begin{pmatrix} 0 & 1 \\ -1 & 0
\end{pmatrix}$, luego $S = \mathrm{gen}\left\{ \begin{pmatrix} 0 & 1 \\ -1 & 0
\end{pmatrix} \right\}$.

## Agregar o quitar un vector redundante

Este teorema es la herramienta para depurar un conjunto de generadores: un vector que ya
es combinación lineal de los demás no aporta al generado.

> **Teorema.** Sea $V$ un $\mathbb{K}$-e.v. y $v_1, \dots, v_r, v_{r+1} \in V$. Entonces
> $$\mathrm{gen}\{ v_1, \dots, v_r \} = \mathrm{gen}\{ v_1, \dots, v_r, v_{r+1} \}
> \iff v_{r+1} \in \mathrm{gen}\{ v_1, \dots, v_r \}.$$

En la demostración, llamando $S = \mathrm{gen}\{v_1, \dots, v_r\}$ y $T = \mathrm{gen}
\{v_1, \dots, v_r, v_{r+1}\}$:

- ($\Rightarrow$) Si $S = T$, como $v_{r+1} \in T$ entonces $v_{r+1} \in S$.
- ($\Leftarrow$) Siempre vale $S \subseteq T$ (basta tomar coeficiente $0$ para
  $v_{r+1}$). Para $T \subseteq S$: si $v \in T$, se escribe $v = \alpha_1 v_1 + \cdots +
  \alpha_r v_r + \alpha_{r+1} v_{r+1}$; y como por hipótesis $v_{r+1} = \beta_1 v_1 +
  \cdots + \beta_r v_r$, sustituyendo,
  $$v = (\alpha_1 + \alpha_{r+1}\beta_1)\, v_1 + \cdots + (\alpha_r + \alpha_{r+1}\beta_r)\,
  v_r \in S.$$

---

## Ver también

- [[01-espacios-vectoriales]] — la estructura donde vive la combinación lineal
- [[02-subespacios]] — $\mathrm{gen}\,G$ es un subespacio; caso $\mathrm{Nul}(A)$
- [[04-independencia-base-dimension]] — depurar un generador hasta una base
