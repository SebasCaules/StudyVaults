---
tags: [teoria, unidad-7, recorridos, arbol-de-expresion, bst]
fuente: raw/3-Resumenes/Resumen M.Discreta.pdf
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Recorridos y árboles de expresión

Recorrer un árbol es visitar todos sus vértices en un orden definido. Los tres recorridos
clásicos dan las notaciones prefija, postfija e infija de una expresión, y motivan el árbol
binario de búsqueda como estructura de datos.

## Recorridos de un árbol binario

Se definen tres recorridos según en qué momento se visita la raíz de cada subárbol respecto de
sus subárboles izquierdo y derecho:

| Recorrido | Orden de visita | Notación |
|---|---|---|
| Pre-orden (izquierda) | raíz → subárbol izquierdo → subárbol derecho | prefija |
| Post-orden (izquierda) | subárbol izquierdo → subárbol derecho → raíz | postfija |
| Orden infijo | subárbol izquierdo → raíz → subárbol derecho | infija |

Cada recorrido se aplica recursivamente a los subárboles.

## Árbol de expresión

En un **árbol de expresión** cada operador queda en la raíz del subárbol que combina a sus
operandos. Los tres recorridos producen las tres notaciones de la expresión.

> **Ejemplo.** Para la expresión $((3+2) * (7-4)) \div 8$, con $\div$ en la raíz, los recorridos dan:
> $$\text{Prefija:} \quad \div \; * \; + \; 3 \; 2 \; - \; 7 \; 4 \; 8$$
> $$\text{Postfija:} \quad 3 \; 2 \; + \; 7 \; 4 \; - \; * \; 8 \; \div$$
> $$\text{Infija (requiere paréntesis):} \quad ((3+2) * (7-4)) \div 8$$

**Observación.** Las notaciones prefija y postfija no necesitan paréntesis: el orden de los
operadores ya determina la agrupación. La infija sí los requiere para evitar ambigüedad.

## Árbol binario de búsqueda (BST)

> **Definición.** Un **árbol binario de búsqueda** (BST) es un árbol binario en el cual un
> vértice $v$ tiene valor más grande que cualquier vértice de su subárbol izquierdo y más chico
> que cualquier vértice de su subárbol derecho.

Esta invariante ordena los datos y permite buscar descendiendo por el árbol comparando claves.

> **Definición.** Un árbol es **balanceado** si, para cada vértice, el número de vértices de su
> subárbol izquierdo difiere a lo sumo en $1$ del número de vértices de su subárbol derecho.

## Estructuras de datos y sus costos

El BST se compara con otras dos estructuras para almacenar una colección de claves:

| Estructura | Naturaleza |
|---|---|
| Array | Estático, de longitud finita |
| Lista enlazada | Dinámico, de longitud variable |
| Árbol binario de búsqueda | Enlace dinámico |

El interés está en el costo de las operaciones, medido en notación $O$.

**Buscar una clave.**

i) En un **array** (ordenado) requiere en el peor caso $O(\log_2 n)$ comparaciones.
ii) En una **lista enlazada** la búsqueda es secuencial a la fuerza, de orden $O(n)$.
iii) En un **BST** es de orden $O(\log_2 n)$ si el árbol está balanceado; si no lo está, en el
   peor caso se cae en el orden $O(n)$ de la lista.

**Insertar o borrar una clave.**

i) En un **array** es de orden $O(n)$, porque hay que desplazar los elementos.
ii) En una **lista enlazada** es de orden $O(1)$.
iii) En un **BST** es de orden $O(1)$.

donde $n$ es la cantidad de claves almacenadas.

---

## Ver también

- [[07-arboles/02-arboles-con-raiz]] — árboles binarios y subárboles izquierdo/derecho
- [[07-arboles/01-arboles-y-bosques]] — definiciones base de árbol y hoja
- [[07-arboles/04-arboles-recubridores]] — árboles recubridores, DFS y BFS
