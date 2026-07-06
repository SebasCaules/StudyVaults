---
tags: [concepto, unidad-8, heuristicas, greedy, backtracking, divide-y-venceras]
fuente: apuntes de la cursada 2024-2C (parciales resueltos)
unidad: 8
tipo: concepto
actualizado: 2026-07-05
---

# Panorama de paradigmas y heurísticas

Frente a un problema algorítmico conviene reconocer con qué **estrategia general** se lo
ataca antes de escribir código: la elección determina la estructura de la solución y su
complejidad. Los apuntes agrupan cuatro heurísticas de diseño —**Greedy**, **Backtracking**,
**Stack/Queue** y **Divide & Conquer**— con su idea central, un ejemplo canónico y sus
complejidades temporal (CT) y espacial (CE) típicas.

## Greedy (voraz)

> **Definición.** Un algoritmo Greedy busca en **cada etapa el óptimo local** con la
> esperanza de llegar al óptimo global. No siempre lo consigue: al no anticipar el futuro,
> puede quedar atrapado en una decisión localmente buena pero globalmente subóptima.

- **Ejemplo canónico:** algoritmo de **Kruskal** (árbol de recubrimiento mínimo).
- **Complejidad temporal:** $O(n \log n)$ ó $O(\log n)$.
- **Complejidad espacial:** $O(1)$ ó $O(n)$.

**Observación.** La marca distintiva del Greedy es que **agarra el valor máximo (o mínimo)
que encuentra cerca** y nunca revisa esa decisión. Es rápido, pero no garantiza el máximo
global justamente porque no explora alternativas.

## Backtracking

> **Definición.** El Backtracking **busca la mejor combinación posible** explorando los
> próximos movimientos: prueba un camino y, si encuentra una restricción que lo invalida,
> **vuelve un paso atrás** y prueba por otro camino. Así recorre el espacio de soluciones
> descartando ramas inviables.

- **Complejidad temporal:** $O(n \log n)$ ó $O(n)$.
- **Complejidad espacial:** $O(n^2)$ ó $O(n^3)$.

## Stack o Queue (exploración exhaustiva)

> **Técnica.** Se **calculan todas las posibles soluciones** apoyándose en una pila (Stack)
> o una cola (Queue) para llevar el frente de exploración. Si se agregan restricciones,
> **solo al final** se evalúa cuál de las soluciones generadas es la mejor.

A diferencia del Backtracking —que poda apenas detecta una restricción violada—, este
enfoque genera primero y filtra después.

## Divide & Conquer (divide y vencerás)

> **Definición.** **Divide el problema en $N$ subproblemas más pequeños**, los resuelve
> (habitualmente de forma recursiva) y combina los resultados.

- **Ejemplos:** Merge Sort, QuickSort, búsqueda en un BST, búsqueda en un array ordenado.
- **Complejidad temporal:** $O(n \log n)$ ó $O(n^2)$.
- **Complejidad espacial:** $O(n \log n)$ ó $O(n^2)$.

El análisis de las recurrencias que genera esta estrategia se hace con el **Teorema
Maestro**; ver [[02-divide-y-venceras]] para el desarrollo completo y un ejemplo resuelto.

## Greedy frente a Backtracking

En los parciales aparece la consigna de **explicar la diferencia** entre un algoritmo Greedy
y uno de Backtracking. El contraste, tal como se resuelve en los apuntes:

| | Greedy | Backtracking |
|---|---|---|
| Cómo decide | agarra el valor máximo que encuentra cerca | busca todas las combinaciones de próximos movimientos y se queda con la mejor |
| Ante una restricción | no la contempla: sigue derecho | vuelve un paso atrás y prueba por otro camino |
| Óptimo global | **no garantizado** (no anticipa el futuro) | lo alcanza explorando y descartando |
| Costo | más barato | más caro (explora el espacio) |

> **Nota.** La idea que sintetiza el contraste es que **Greedy no siempre obtiene el valor
> máximo global, ya que no anticipa el futuro**, mientras que Backtracking sí lo consigue a
> costa de explorar (y retroceder sobre) el espacio de soluciones.

---

## Ver también

- [[02-divide-y-venceras]] — la estrategia de dividir en subproblemas y el Teorema Maestro
- [[03-algoritmos-ad-hoc]] — algoritmos a medida que aparecen resueltos en parciales
