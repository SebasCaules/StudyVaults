<!--
  PÁGINA GENERADA POR LA SKILL `studyvault-page` COMO VALIDACIÓN (no forma parte del wiki publicado).
  Es evidencia de que la skill funciona de punta a punta siguiendo SKILL.md + assets/DESIGN.md.
  Vault objetivo: StudyVaultsITBA/MNA (Métodos Numéricos Avanzados, ITBA 26-1C).
  Prompt de invocación simulado: "Estoy en el vault de MNA. Creá una página nueva de teoría
    sobre la descomposición QR (Gram-Schmidt)."
  Ubicación real de destino que tendría en el wiki: wiki/teoria/05-descomposicion-qr.md
  (acá se guarda fuera del wiki, en la skill, para no contaminar el vault publicado).
  Generada: 2026-06-14.
-->
---
tags: [teoria, unidad-II, factorizaciones, qr, gram-schmidt, ortonormalizacion]
fuente: raw/Teoricas/Anotaciones_Clases/MNA_Clase_07_05_2026.tar.gz
unidad: II
tipo: teoria
actualizado: 2026-06-14
---

# Descomposición QR

La descomposición QR factoriza una matriz como producto de una matriz de columnas ortonormales por una matriz triangular superior. Es la herramienta numérica detrás de los mínimos cuadrados y de la idea de "resolver $AX = B$ sin invertir $A$".

## Definición

> **Definición.** Sea $A \in \mathbb{R}^{n \times m}$ con columnas linealmente independientes. Una descomposición QR de $A$ es una factorización
> $$A = QR$$
> donde $Q \in \mathbb{R}^{n \times m}$ tiene columnas ortonormales ($Q^T Q = I_m$) y $R \in \mathbb{R}^{m \times m}$ es triangular superior e inversible.

**Observación.** Si $A$ es cuadrada ($n = m$) con columnas LI, entonces $Q$ es ortogonal: $Q^T Q = Q Q^T = I$ y por lo tanto $Q^{-1} = Q^T$. Esa es la propiedad que hace barata la factorización: invertir $Q$ es transponerla.

> **Nota.** En $\mathbb{C}^{n \times m}$ la condición sobre $Q$ pasa a ser $Q^* Q = I$ con $Q^* = \overline{Q^T}$ (matriz unitaria en el caso cuadrado).

## Construcción vía Gram-Schmidt

El método estándar para obtener $Q$ y $R$ es ortonormalizar las columnas de $A$ con [[clases/clase-2026-04-09|Gram-Schmidt]]. Sean $a_1, \dots, a_m$ las columnas de $A$.

> **Proposición.** Aplicando Gram-Schmidt a $\{a_1, \dots, a_m\}$ se obtiene una base ortonormal $\{q_1, \dots, q_m\}$ del mismo subespacio, y cada $a_j$ se escribe como combinación de los $q_i$ con $i \le j$. Esos coeficientes son las entradas de $R$:
> $$a_j = \sum_{i=1}^{j} r_{ij} \, q_i, \qquad r_{ij} = \langle a_j, q_i \rangle, \quad r_{jj} = \| \tilde{q}_j \|_2$$

El procedimiento, paso a paso:

i) **Primer vector:** se toma $\tilde{q}_1 = a_1$ y se normaliza
   $$q_1 = \frac{a_1}{\| a_1 \|_2}, \qquad r_{11} = \| a_1 \|_2$$

ii) **Resto de los vectores:** para $j = 2, \dots, m$ se resta la proyección sobre los anteriores
   $$\tilde{q}_j = a_j - \sum_{i=1}^{j-1} \langle a_j, q_i \rangle \, q_i, \qquad q_j = \frac{\tilde{q}_j}{\| \tilde{q}_j \|_2}$$

iii) **Armado de $R$:** triangular superior con $r_{ij} = \langle a_j, q_i \rangle$ para $i < j$ y $r_{jj} = \| \tilde{q}_j \|_2$ en la diagonal.

**Observación.** Que $R$ salga triangular superior es consecuencia directa de que $q_i \perp \tilde{q}_j$ para $i > j$: en la columna $j$ solo intervienen los $q_i$ con $i \le j$, así que las entradas debajo de la diagonal son cero.

## Por qué sirve: sistemas y mínimos cuadrados

La motivación es la misma que la de las factorizaciones LU/PLU vistas en [[clases/clase-2026-05-07|clase]] y la [[clases/clase-2026-05-14|SVD]]: factorizar $A$ para resolver $AX = B$ sin pagar el costo de invertir.

Con $A = QR$ y $A$ cuadrada inversible:

$$AX = B \implies QRX = B \implies RX = Q^T B$$

y como $R$ es triangular superior, $X$ se despeja por **sustitución hacia atrás**, sin invertir nada.

Para el problema de [[clases/clase-2026-05-14|mínimos cuadrados]] $A \in \mathbb{R}^{n \times m}$ con $n > m$, las ecuaciones normales $A^T A X = A^T B$ se simplifican:

$$A^T A = (QR)^T (QR) = R^T Q^T Q R = R^T R$$

$$R^T R \, X = R^T Q^T B \implies R X = Q^T B$$

de nuevo un sistema triangular, numéricamente más estable que formar $A^T A$ directamente.

## QR frente a las otras factorizaciones

| Factorización | Forma | Requiere | Sirve para |
|---|---|---|---|
| LU / PLU | $A = LU$ (o $PA = LU$) | $A$ cuadrada (pivoteo si hace falta) | Resolver $AX = B$, calcular $\det$ y $A^{-1}$ |
| QR | $A = QR$, $Q^T Q = I$, $R$ triangular sup. | columnas de $A$ LI | Mínimos cuadrados, $AX = B$ estable, base ortonormal |
| SVD | $A = U S V^T$, $U,V$ ortogonales | cualquier $A \in \mathbb{R}^{n \times m}$ | Rango, pseudoinversa, mínimos cuadrados general |

**Observación.** QR existe siempre que las columnas sean LI; la SVD no exige ni eso y por eso es la más general, pero también la más costosa de calcular a mano.

## Verificación numérica

Toda factorización se puede chequear reconstruyendo $A = QR$ y confirmando $Q^T Q = I$:

```python
import numpy as np

A = np.array([[1.0, 1.0], [1.0, 0.0], [0.0, 1.0]])
Q, R = np.linalg.qr(A)

assert np.allclose(Q @ R, A)              # reconstruccion
assert np.allclose(Q.T @ Q, np.eye(Q.shape[1]))  # columnas ortonormales
assert np.allclose(R, np.triu(R))         # R triangular superior
```

---

## Ver también

- [[teoria/03-matrices]] — matrices ortogonales, transpuesta e inversa
- [[teoria/02-vectores-cn-rn]] — producto interno y norma $\|\cdot\|_2$ usados en Gram-Schmidt
- [[clases/clase-2026-05-07|Clase LU/QR]] — Doolittle y QR aplicados en clase
- [[clases/clase-2026-05-14|Clase SVD/MMCC]] — factorización general y mínimos cuadrados
- [[guias/guia-06-qr-lu]] — ejercicios de QR y LU
- [[pizarrones/pizarron-clase-8]] — PLU + QR con ejemplos resueltos
