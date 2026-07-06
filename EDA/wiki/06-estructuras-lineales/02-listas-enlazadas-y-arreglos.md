---
tags: [teoria, unidad-6, estructuras-lineales, listas-enlazadas, arreglos]
fuente: apuntes de la cursada 2024-2C (parciales y finales resueltos)
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Listas enlazadas y arreglos

La lista enlazada y el arreglo son las dos representaciones lineales básicas sobre las que
se construyen estructuras como la pila y la cola. La elección entre una y otra cambia el
costo de las operaciones, y el diseño interno de una lista enlazada (cuántas cadenas
encadena cada nodo) puede convertir una operación de $O(n^2)$ en $O(n)$.

## Arreglo vs. lista enlazada

Cuando no se conoce de antemano cuántos elementos habrá que albergar, las dos opciones de
representación interna tienen costos distintos:

- **Arreglo (Array):** acceso por índice en $O(1)$, pero agregar al final en el peor caso es
  $O(n)$, porque al llenarse hay que redimensionarlo y copiar todo a un bloque más grande.
- **Lista enlazada (LinkedList):** agregar o quitar al inicio es $O(1)$ y no requiere memoria
  contigua ni redimensionar, pero no ofrece acceso directo por índice.

Esta diferencia es la que hace que una pila implementada con lista enlazada tenga `push` y
`pop` en $O(1)$ de peor caso, mientras que con arreglo el `push` es $O(n)$ (ver
[[01-pilas-y-colas]]).

## Diseño de la lista: header y cadenas in/out

Un buen ejemplo del impacto del diseño interno aparece al representar un **dígrafo no denso**
con listas de adyacencia y calcular el **grado de entrada** (*in-degree*) de un vértice cuyo
índice ya se conoce.

**Lista de adyacencia lineal simplemente encadenada sin header.** Se tiene un vector donde
cada posición se corresponde con un vértice y guarda una lista —sin header, es decir, sin
información global— con sus **conexiones salientes** (*out*).

> **Observación.** Para hallar el in-degree de un vértice hay que recorrer todo el vector y,
> por cada vértice, recorrer su lista de salientes buscando aristas que apunten al vértice
> buscado: complejidad temporal $O(n^2)$.

**Con dos listas por posición (out e in).** Si en cambio cada posición encapsula **dos**
listas simplemente encadenadas sin header —una `out` (salientes, la clásica) y otra `in`
(entrantes a ese nodo)— el cálculo cambia:

> **Observación.** Como el índice del vértice se conoce, se accede a su lista de entrantes y
> se la recorre: complejidad temporal $O(n)$.

El costo baja de $O(n^2)$ a $O(n)$ solo por haber agregado a cada nodo la cadena de aristas
entrantes: el mismo dato, mejor organizado, cuesta un orden menos.

## Sobre las tablas de hash

> **Nota.** Aunque las tablas de hash son parte del temario típico de estructuras lineales,
> los apuntes de la cursada 2024-2C **no las desarrollan**: colisiones, direccionamiento
> abierto o encadenamiento no aparecen en el material relevado. Esta página se limita a lo
> que sí está en los apuntes.

---

## Ver también

- [[01-pilas-y-colas]] — pila (LIFO) y cola (FIFO) montadas sobre estas representaciones
- [[01-complejidad/01-big-o-y-ordenes]] — notación $O(\cdot)$ y jerarquía de órdenes de complejidad
