---
tags: [teoria, unidad-6, matrices, operaciones, transpuesta]
fuente: raw/3-resumenes/algebra.pdf
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Matrices: definiciones, operaciones y transpuesta

Unidad de matrices de Álgebra. Se define la matriz como objeto, los casos particulares
(nula, identidad, diagonal, triangular), las tres operaciones básicas (producto por escalar,
suma y producto entre matrices) con sus propiedades, y la transpuesta junto con las matrices
simétricas y antisimétricas. Los sistemas lineales que se resuelven con estas herramientas se
tratan en [[02-sistemas-forma-escalonada-rango]]. Transcripción de los apuntes de la cursada
2023-1C.

## Definición de matriz

> **Definición (matriz).** Una matriz es un objeto de la forma
> $$A = \begin{pmatrix} a_{11} & a_{12} & \cdots & a_{1k} \\ a_{21} & a_{22} & \cdots & a_{2k} \\ \vdots & & & \vdots \\ a_{n1} & a_{n2} & \cdots & a_{nk} \end{pmatrix}$$
> con $A \in \mathbb{K}^{n \times k}$ y $a_{ij} \in \mathbb{K}$, donde $\mathbb{K}$ es el cuerpo base ($\mathbb{R}$ o $\mathbb{C}$).

El primer índice $i$ recorre las **filas** ($n$ en total) y el segundo índice $j$ recorre las
**columnas** ($k$ en total), con $n, k \in \mathbb{N}$. Si $n = k$ se dice que la matriz es
**cuadrada**.

### Matrices particulares

> **Definición (matriz nula).** La matriz nula tiene $0_{ij} = 0$ para todo $i, j$, y puede ser de cualquier tamaño.

> **Definición (matriz identidad).** La matriz identidad $I_n \in \mathbb{K}^{n \times n}$ es la matriz cuadrada
> $$(I_n)_{ij} = \begin{cases} 1 & \text{si } i = j \\ 0 & \text{si } i \neq j \end{cases}$$
> es decir, unos en la diagonal y ceros fuera de ella.

Según qué entradas se anulan, una matriz cuadrada $A \in \mathbb{K}^{n \times n}$ recibe un nombre:

| Tipo | Condición |
|---|---|
| Diagonal | $A_{ij} = 0$ si $i \neq j$ |
| Triangular superior | $A_{ij} = 0$ si $i > j$ |
| Triangular inferior | $A_{ij} = 0$ si $i < j$ |

**Observación.** La matriz identidad es a la vez diagonal, triangular superior y triangular inferior.

## Operaciones

> **Definición (producto por escalar).** Sea $A \in \mathbb{K}^{n \times r}$ y $\alpha \in \mathbb{K}$. Entonces $\alpha A \in \mathbb{K}^{n \times r}$ es la matriz tal que
> $$(\alpha A)_{ij} = \alpha \, (A)_{ij}$$

> **Definición (suma).** Sean $A, B \in \mathbb{K}^{n \times r}$. Entonces $A + B = C \in \mathbb{K}^{n \times r}$ es la matriz tal que
> $$(A + B)_{ij} = A_{ij} + B_{ij}$$

La suma solo está definida entre matrices del **mismo tamaño**.

> **Definición (producto entre matrices).** Sean $A \in \mathbb{K}^{n \times r}$ y $B \in \mathbb{K}^{r \times t}$. Entonces $A \cdot B = C \in \mathbb{K}^{n \times t}$ es la matriz tal que
> $$(AB)_{ij} = \sum_{k=1}^{r} A_{ik} \, B_{kj}$$

El producto $AB$ solo está definido cuando la cantidad de columnas de $A$ coincide con la
cantidad de filas de $B$; el resultado hereda las filas de $A$ y las columnas de $B$.

### Propiedades de la suma

i) **Conmutativa:** $A + B = B + A$.
ii) **Asociativa:** $A + (B + C) = (A + B) + C$.
iii) **Neutro:** $A + 0 = A$.
iv) **Inverso aditivo:** para todo $A \in \mathbb{K}^{n \times r}$ existe $(-1)A$ tal que $A + \big[(-1)A\big] = 0$.

### Propiedades del producto

i) **Asociativa:** $A \cdot (B \cdot C) = (A \cdot B) \cdot C$.
ii) **Neutro:** $A \cdot I = A$ (con $I$ la identidad del tamaño adecuado).
iii) **Absorbente:** $A \cdot 0 = 0$.
iv) **Distributiva a izquierda:** $A \cdot (B + C) = A \cdot B + A \cdot C$.
v) **Distributiva del escalar:** $\alpha (A + B) = \alpha A + \alpha B$.
vi) $\alpha A = A \alpha$.
vii) $\alpha (A B) = (\alpha A) B$.
viii) $(\alpha + \beta) A = \alpha A + \beta A$.
ix) $-1 \cdot A = -A$.

> **Cuidado:** el producto de matrices **no es conmutativo**. En general $A \cdot (B + C) = A B + A C$, pero la distributiva a derecha $(B + C) A = B A + C A$ es una identidad **distinta**: no se pueden intercambiar los factores. Como consecuencia $(A + B)^2 = A^2 + AB + BA + B^2$, que coincide con $A^2 + 2AB + B^2$ **solo si** $AB = BA$.

## Transpuesta

> **Definición (transpuesta).** Dada $A \in \mathbb{K}^{n \times r}$, su transpuesta $A^t$ se define por
> $$(A^t)_{ij} = A_{ji}$$
> de modo que $A^t \in \mathbb{K}^{r \times n}$: intercambia filas por columnas.

A partir de la transpuesta se distinguen dos clases de matrices cuadradas:

> **Definiciones.** Sea $A \in \mathbb{K}^{n \times n}$.
> i) $A$ es **simétrica** si $A = A^t$.
> ii) $A$ es **antisimétrica** si $A^t = -A$.

## Notas de la práctica

Estas observaciones surgen de los ejercicios de la cursada y conviene tenerlas presentes:

- **Operaciones imposibles por dimensión.** Antes de operar hay que chequear tamaños: una suma
  como $3C - D$ o un producto como $E(3D)$ pueden no estar definidos si las dimensiones no
  encajan. La expresión se declara imposible en vez de forzarla.
- **Fila o columna de un producto sin calcular todo.** La fila $i$ de $AB$ es la fila $i$ de $A$
  multiplicada por toda $B$; la columna $j$ de $AB$ es $A$ por la columna $j$ de $B$. Permite
  extraer una sola fila o columna del producto sin computarlo entero.
- **$AB = 0$ no implica $A = 0$ ni $B = 0$.** Existen matrices no nulas cuyo producto es la matriz
  nula (por ejemplo $A = \begin{pmatrix} 2 & 0 \\ 0 & 2 \end{pmatrix}$ y $B$ elegida adecuadamente
  dan $AB = 0$ con $A, B \neq 0$).
- **$A^2 = 0$ no implica $A = 0$.** Contraejemplo: $A = \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix}$
  cumple $A^2 = 0$ pero $A \neq 0$.
- **Cancelación de la suma.** De $A + B = C + A$ sí se deduce $B = C$: alcanza con sumar el inverso
  aditivo de $A$ a ambos lados. La cancelación del producto, en cambio, no vale sin hipótesis extra.

---

## Ver también

- [[02-sistemas-forma-escalonada-rango]] — sistemas lineales, forma escalonada y rango
- [[03-rouche-frobenius-inversibles]] — clasificación de sistemas y matrices inversibles
