---
tags: [teoria, unidad-2, ordenamiento, sorts, cotas]
fuente: apuntes de la cursada 2024-2C (parciales resueltos)
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Algoritmos de ordenamiento

Página de referencia sobre los cuatro algoritmos de ordenamiento que aparecen en la
cursada: **Bubble Sort**, **Merge Sort**, **Quick Sort** y **Selection Sort**. Se los
compara por sus **cotas** de complejidad temporal (mejor y peor caso) y por sus atributos
estructurales (estabilidad, uso de memoria, in-place, etc.). El análisis línea por línea
de un método de ordenamiento concreto está en [[01-complejidad/03-analisis-de-algoritmos]].

## Cotas de complejidad temporal

La tabla resume la complejidad temporal de cada algoritmo en su **mejor caso** (entrada
favorable) y en su **peor caso** (entrada adversa), tal como se toman en los parciales.

| Algoritmo | Mejor caso (CT) | Peor caso (CT) |
|---|---|---|
| Bubble Sort | $O(n)$ | $O(n^2)$ |
| Merge Sort | $O(n \log n)$ | $O(n \log n)$ |
| Quick Sort | $O(n \log n)$ | $O(n^2)$ |
| Selection Sort | $O(n^2)$ | $O(n^2)$ |

**Observación.** Merge Sort es el único cuyo mejor y peor caso coinciden en $O(n \log n)$,
así que su costo es a la vez eficiente y predecible sin importar la entrada. Quick Sort iguala
esa cota en el caso típico pero degrada a $O(n^2)$ con un pivote malo; Bubble Sort baja a
$O(n)$ si el arreglo ya viene casi ordenado; Selection Sort también tiene mejor y peor caso
iguales, pero pegado en $O(n^2)$ porque siempre recorre todos los pares.

Las cotas $O(n \log n)$ de Merge y Quick se justifican con el
[[01-complejidad/02-teorema-maestro|Teorema Maestro]] sobre la recurrencia de dividir y
conquistar $T(n) = 2\,T(n/2) + c\,n$.

## Atributos de cada algoritmo

Más allá de la cota temporal, cada sort se caracteriza por un conjunto de atributos que
deciden cuándo conviene usarlo.

| Atributo | QuickSort | MergeSort | SelectionSort | BubbleSort |
|---|---|---|---|---|
| Espacio auxiliar | $O(\log n)$ | $O(n)$ | $O(1)$ | $O(1)$ |
| Es estable | No | Sí | No | Sí |
| Es in-place | Sí | No | Sí | Sí |
| Permite repetidos | Sí | Sí | Sí | Sí |
| Uso típico | General rápido | Listas / estabilidad | Simple pero ineficiente | Educación |
| Divide y vencerás | Sí | Sí | No | No |
| Comparaciones necesarias | Menos que Bubble | Más pero predecible | Muchas | Muchas |
| Swap intensivo | Moderado | Bajo | Bajo | Alto |

Los atributos se leen así:

- **Espacio auxiliar.** Memoria extra más allá del arreglo de entrada. Merge Sort necesita
  $O(n)$ (arreglos temporales para el *merge*); Quick Sort gasta $O(\log n)$ en la pila de
  recursión; Selection y Bubble trabajan con $O(1)$.
- **Estable.** Un sort es estable si preserva el orden relativo de elementos con clave igual.
  Merge y Bubble lo son; Quick y Selection no.
- **In-place.** Ordena reacomodando el propio arreglo sin estructura auxiliar de tamaño
  $O(n)$. Todos lo son salvo Merge Sort.
- **Divide y vencerás.** Merge y Quick parten el problema en subproblemas (de ahí su
  $O(n \log n)$); Selection y Bubble son iterativos por comparación de a pares.

## Elegir un sort mejor

Cuando un ejercicio pide "mencionar un algoritmo de ordenamiento con mejor complejidad
temporal $O$ grande" que uno cuadrático, la respuesta canónica es **Merge Sort**, con cota
$O(n \log n)$, mejorando el $O(n^2)$ de Bubble/Selection y el peor caso de Quick. El método
`AlgoSorting` de los parciales (doble bucle con intercambio de adyacentes) resulta $O(n^2)$
por sumatoria de Gauss y se supera exactamente con Merge Sort — la derivación completa de
esa cota está en [[01-complejidad/03-analisis-de-algoritmos]].

---

## Ver también

- [[02-busqueda]] — búsqueda binaria y costo de buscar según la estructura de datos
- [[01-complejidad/02-teorema-maestro]] — justifica la cota $O(n \log n)$ de los sorts D&C
- [[01-complejidad/03-analisis-de-algoritmos]] — análisis línea por línea de `AlgoSorting` ($O(n^2)$ por Gauss)
- [[01-complejidad/01-big-o-y-ordenes]] — notación $O$ y jerarquía de órdenes
