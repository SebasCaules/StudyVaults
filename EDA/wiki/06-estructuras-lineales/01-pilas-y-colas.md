---
tags: [teoria, unidad-6, estructuras-lineales, pilas, colas]
fuente: apuntes de la cursada 2024-2C (parciales y finales resueltos)
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Pilas y colas

Las estructuras lineales organizan los elementos en una secuencia y restringen por dónde
se puede insertar y quitar. Las dos más frecuentes son la **pila** (LIFO) y la **cola**
(FIFO): se distinguen por la política de acceso, no por cómo se implementan internamente.

## Pila (Stack)

> **Definición.** Una **pila** (o *stack*) es la estructura de datos que permite
> **inserción solo por el tope y borrado solo por el tope**. Sigue la política **LIFO**
> (*Last-In, First-Out*): el último elemento agregado es el primero en salir.

Sus dos operaciones básicas son:

- **Push:** agrega un elemento en el tope.
- **Pop:** quita y devuelve el elemento del tope (el último que se agregó).

**Observación.** En un ejercicio de parcial se pide identificar "la estructura de datos que
permite inserción solo por el tope y borrado solo por el tope" entre las opciones FIFO,
LIFO, FILO y LILO: la respuesta es **LIFO**, es decir, la pila.

La pila también aparece como estructura auxiliar en el recorrido en profundidad (DFS) de un
grafo, donde se usa una pila para gestionar los nodos pendientes de visitar.

### Complejidad según la implementación

El costo de `push` y `pop` depende de la representación interna elegida cuando **no se
conoce de antemano** cuántos elementos habrá que albergar. Comparando una lista enlazada
(*LinkedList*) contra un arreglo (*Array*):

| Operación | LinkedList | Array |
|---|---|---|
| `push` (peor caso) | $O(1)$ | $O(n)$ |
| `pop` (peor caso) | $O(1)$ | — |

- Con **LinkedList**, `push` es $O(1)$ porque el elemento se agrega al inicio de la lista, y
  `pop` es $O(1)$ porque se saca el último agregado (que quedó al inicio). No hace falta
  recorrer nada ni reservar memoria contigua.
- Con **Array**, `push` en el peor caso es $O(n)$: el elemento se agrega al final, pero si
  el arreglo ya está lleno hay que redimensionarlo y copiar los elementos existentes a uno
  nuevo más grande.

> **Nota.** Por eso, cuando la cantidad de elementos es desconocida, la lista enlazada
> garantiza peor caso $O(1)$ para las operaciones de pila, garantía que el arreglo no da.

## Cola (Queue)

> **Definición.** Una **cola** (o *queue*) sigue la política **FIFO** (*First-In,
> First-Out*): el primer elemento en entrar es el primero en salir. Se inserta por un
> extremo (el final) y se quita por el otro (el frente).

La cola aparece como estructura auxiliar en varios algoritmos sobre grafos: el recorrido en
anchura (BFS) y el cálculo del orden topológico usan una cola para ir procesando los nodos
en el orden en que quedan disponibles.

**Observación.** Entre las cuatro políticas de acceso que suelen listarse —FIFO, LIFO, FILO,
LILO— las dos de uso corriente son **FIFO (cola)** y **LIFO (pila)**.

---

## Ver también

- [[02-listas-enlazadas-y-arreglos]] — las representaciones internas (lista enlazada vs arreglo) sobre las que se montan pila y cola
- [[01-complejidad/01-big-o-y-ordenes]] — notación $O(\cdot)$ usada para medir el costo de las operaciones
