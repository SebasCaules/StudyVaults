---
tags: [teoria, unidad-II, producto-interno, ortogonalidad, normas, gram-schmidt]
fuente: raw/Teoricas/Slides/MNA_Unidad_II_Espacios_Vectoriales_P_I_v1.pdf
unidad: II
tipo: teoria
actualizado: 2026-06-14
---

# Producto interno y ortogonalidad en $\mathbb{K}^n$

Esta página reúne el producto interno, las normas que de él derivan y la noción de
ortogonalidad, hasta el proceso de Gram–Schmidt para construir bases ortonormales.
Es la base sobre la que se apoyan las descomposiciones $QR$ y $SVD$.

## Producto interno

**Observación Previa.** Se nota el cuerpo base como $\mathbb{K}$, con $\mathbb{K} = \mathbb{R}$ o $\mathbb{K} = \mathbb{C}$.

> **Definición.** Sean $u, v \in \mathbb{K}^n$, $u = (u_1, \dots, u_n)$ y $v = (v_1, \dots, v_n)$. Se define el producto interno como
> $$\langle u, v \rangle = \sum_{i=1}^{n} u_i \, \overline{v_i}$$
> donde $\overline{v_i}$ es el conjugado de $v_i$. En $\mathbb{R}^n$ la conjugación es la identidad y queda $\langle u, v \rangle = \sum_i u_i v_i$.

### Propiedades del producto interno

i) **Hermiticidad:** $\langle u, v \rangle = \overline{\langle v, u \rangle}$ para todo $u, v \in \mathbb{K}^n$.
ii) **Linealidad en la primera componente:**
   $$\langle \alpha\, u + \beta\, w, \; v \rangle = \alpha\, \langle u, v \rangle + \beta\, \langle w, v \rangle, \qquad \alpha, \beta \in \mathbb{K}$$
iii) **Positividad:** $\langle u, u \rangle \geq 0$, con $\langle u, u \rangle = 0 \iff u = 0$.

> **Proposición (Cauchy–Schwarz).** Para todo $u, v \in \mathbb{K}^n$,
> $$|\langle u, v \rangle| \leq \|u\|_2 \, \|v\|_2$$
> con igualdad si y solo si $u$ y $v$ son linealmente dependientes.

## Normas derivadas

> **Definición.** La norma euclídea (o norma 2) en $\mathbb{K}^n$ es
> $$\|u\|_2 = \sqrt{\langle u, u \rangle}$$

Además de la euclídea, conviene tener a mano otras normas. Sea $v = (v_1, \dots, v_n)$:

| Norma | Definición | Uso típico |
|---|---|---|
| $\|v\|_1$ | $\displaystyle\sum_{i=1}^{n} \lvert v_i \rvert$ | regularización, robustez |
| $\|v\|_2$ | $\displaystyle\left(\sum_{i=1}^{n} \lvert v_i \rvert^2\right)^{1/2}$ | geometría, mínimos cuadrados |
| $\|v\|_\infty$ | $\displaystyle\max_{1 \leq i \leq n} \lvert v_i \rvert$ | cotas, error máximo |

**Observación.** Todas las normas en $\mathbb{K}^n$ son equivalentes (inducen la misma topología), pero numéricamente no son intercambiables: la elección importa al medir error.

## Ortogonalidad

> **Definición.** Dos vectores $u, v \in \mathbb{K}^n$ no nulos son **ortogonales**, $u \perp v$, si $\langle u, v \rangle = 0$.

> **Definición.** Un conjunto $\{q_1, \dots, q_k\}$ es **ortonormal** si
> $$\langle q_i, q_j \rangle = \delta_{ij} = \begin{cases} 1 & i = j \\ 0 & i \neq j \end{cases}$$

> **Teorema (Pitágoras).** Si $u \perp v$, entonces
> $$\|u + v\|_2^2 = \|u\|_2^2 + \|v\|_2^2$$

## Gram–Schmidt

Dado un conjunto linealmente independiente $\{a_1, \dots, a_k\}$, el proceso de Gram–Schmidt
produce una base ortonormal $\{q_1, \dots, q_k\}$ del mismo subespacio.

> **Proposición (Gram–Schmidt).** Definiendo
> $$u_j = a_j - \sum_{i=1}^{j-1} \langle a_j, q_i \rangle \, q_i, \qquad q_j = \frac{u_j}{\|u_j\|_2}$$
> el conjunto $\{q_1, \dots, q_k\}$ es ortonormal y genera el mismo subespacio que $\{a_1, \dots, a_k\}$.

Verificación numérica del primer paso en Python:

```python
import numpy as np

A = np.array([[1.0, 1.0], [1.0, 0.0], [0.0, 1.0]])
Q, R = np.linalg.qr(A)          # QR = Gram-Schmidt estable
print(np.round(Q.T @ Q, 10))    # -> identidad: columnas ortonormales
```

> **Nota.** En la práctica numérica se usa Gram–Schmidt *modificado* o reflexiones de Householder, porque la versión clásica de arriba pierde ortogonalidad por error de redondeo. La fórmula es correcta en aritmética exacta.

## Conexión con $QR$

La descomposición $A = QR$ es exactamente Gram–Schmidt en forma matricial: las columnas de
$Q$ son los $q_j$ ortonormales y $R$ es triangular superior con $r_{ij} = \langle a_j, q_i \rangle$.
Ver [[teoria/03-matrices]] para la maquinaria matricial subyacente.

---

## Ver también

- [[teoria/02-vectores-cn-rn]] — vectores en $\mathbb{K}^n$, producto interno y normas (página fuente de estos conceptos)
- [[teoria/03-matrices]] — operaciones matriciales y clasificación (ortogonal, simétrica)
- [[clases/clase-2026-05-07|Clase LU/QR]] — Gram–Schmidt aplicado a la factorización $QR$
- [[resueltos/resueltos-svd]] — dónde la ortonormalidad es la pieza central
