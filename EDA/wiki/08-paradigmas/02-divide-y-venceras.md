---
tags: [teoria, unidad-8, divide-y-venceras, teorema-maestro, recurrencias]
fuente: apuntes de la cursada 2024-2C (parciales resueltos)
unidad: 8
tipo: teoria
actualizado: 2026-07-05
---

# Divide y vencerás y el Teorema Maestro

**Divide & Conquer** parte un problema en subproblemas más chicos del mismo tipo, los
resuelve por separado —casi siempre de forma recursiva— y combina los resultados. Su costo
queda descripto por una **recurrencia**, y el **Teorema Maestro** es la herramienta que la
resuelve en forma cerrada.

## La estrategia

> **Definición.** Un algoritmo de **Divide & Conquer** divide el problema en $N$
> subproblemas más pequeños, los resuelve recursivamente y combina las soluciones parciales.

Ejemplos clásicos que aparecen en los apuntes:

- **Merge Sort** y **QuickSort** (ordenamiento).
- **Búsqueda en un BST** (árbol binario de búsqueda).
- **Búsqueda binaria** en un array ordenado.

Complejidades típicas de la familia: temporal $O(n \log n)$ ó $O(n^2)$; espacial
$O(n \log n)$ ó $O(n^2)$, según cómo se dividan y combinen los subproblemas.

## Teorema Maestro

Cuando la estrategia genera una recurrencia de la forma canónica, el Teorema Maestro da la
complejidad sin necesidad de desplegar la recursión.

> **Teorema (Maestro).** Sea una recurrencia
> $$T(n) = a\, T\!\left(\frac{n}{b}\right) + c\, n^{d}$$
> con $a \ge 1$, $b > 1$ y $c, d$ constantes. Comparando $a$ con $b^{d}$ se distinguen tres casos:
> $$a < b^{d} \;\Rightarrow\; O(n^{d})$$
> $$a = b^{d} \;\Rightarrow\; O(n^{d} \log n)$$
> $$a > b^{d} \;\Rightarrow\; O\!\left(n^{\log_{b} a}\right)$$

donde $a$ es la cantidad de subproblemas, $b$ el factor en que se reduce el tamaño en cada
llamada, $d$ el exponente del costo de dividir y combinar ($c\,n^d$) y $c$ una constante
positiva. La comparación $a$ vs $b^{d}$ decide qué domina: el trabajo de las hojas de la
recursión o el de combinar.

## Ejemplo resuelto

En un parcial (1C-21) se caracteriza una recurrencia y se pide aplicar el Teorema Maestro:

$$T(N) = 2\, T\!\left(\frac{N}{2}\right) + \frac{N^{4}}{4}$$

Se identifican las constantes:

$$a = 2, \qquad b = 2, \qquad c = \tfrac{1}{4}, \qquad d = 4$$

Se compara $a$ con $b^{d}$:

$$b^{d} = 2^{4} = 16, \qquad a = 2 < 16$$

Como $a < b^{d}$, cae en el primer caso y la complejidad es

$$T(N) = O(n^{d}) = O(N^{4}).$$

> **Observación.** Domina el término de dividir/combinar ($N^4/4$): las dos ramas
> recursivas ($a=2$) son insuficientes frente al $b^{d}=16$ que impone el costo por nivel,
> por eso el orden final coincide con el del término no recursivo.

---

## Ver también

- [[01-panorama-heuristicas]] — dónde encaja Divide & Conquer entre las heurísticas de diseño
- [[03-algoritmos-ad-hoc]] — algoritmos a medida resueltos en parciales
