---
tags: [teoria, unidad-4, arboles-b, insercion, b-tree]
fuentes:
  - apuntes de la cursada 2024-2C (final, inserción en B-tree)
  - apuntes de la cursada 2024-2C (final, parciales — crecimiento en altura)
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Inserción en árboles B

La inserción en un árbol B siempre ocurre **en las hojas** y, cuando un nodo se pasa de su
capacidad, propaga la clave del medio hacia arriba. Es la operación dual del
[[03-borrado-en-b-trees|borrado]] y comparte con él la mecánica de subir/bajar claves.

## Algoritmo

> **Regla de inserción.** Para insertar una clave en un B-tree de orden $N$ (capacidad $2N$
> por nodo):
> i) la clave **se inserta en la hoja** que le corresponde según la búsqueda;
> ii) si al insertar el nodo queda con $K > 2N$ claves, la **clave del medio sube al nodo
> antecesor** (el padre) y el nodo se parte en dos;
> iii) el paso (ii) es **recursivo**: si el padre también se pasa de $2N$, vuelve a subir su
> clave del medio, y así hasta la raíz.

> **Observación.** La **altura del árbol aumenta cuando la raíz se llena**: si la subida de
> claves llega hasta la raíz y esta se pasa de $2N$, la raíz se parte y su clave del medio
> forma una **nueva raíz** con un solo elemento. Ese es el único momento en que el árbol crece
> en altura, y es lo que mantiene todas las hojas al mismo nivel.

## Qué claves hacen crecer la altura

Un tipo de ejercicio frecuente es, dado un árbol y **una sola** inserción futura, caracterizar
qué claves provocarían un crecimiento en altura. La altura crece solo si la inserción cae en
una hoja **llena** cuya partición se propaga en cascada hasta la raíz.

**Ejemplo (orden 1).** Sobre el árbol B de orden 1 siguiente, la próxima operación es *solo*
una inserción; se pide indicar los enteros que producirían crecimiento en altura.

```text
                 [40|130]
          /          |          \
       [20]        [100]      [180|220]
      /    \      /    \      /    |    \
    [10]  [30] [70]  [120][140|150][200][240]
```

La única hoja llena (con $2N = 2$ claves) cuya partición se propaga es $[140\,|\,150]$, que
aloja las claves del rango entre $130$ y $180$. Insertar un tercer valor ahí la deja con $3$
claves ($>2$): sube la clave del medio a $[180\,|\,220]$, que pasa a $3$ claves y también se
parte, subiendo a la raíz $[40\,|\,130]$, que a su vez se parte y crea una nueva raíz. La
cascada llega hasta arriba, así que:

$$\text{Crecen la altura} = \{\, x \in \mathbb{Z} : 130 < x < 180 \,\}$$

Es decir, **cualquier número nuevo entre $130$ y $180$** (los ya presentes $140$ y $150$ no se
reinsertan, porque el árbol es sin repeticiones).

## Rango válido de una clave

Otra variante pide, dado el árbol con un hueco marcado `?`, **todos** los valores enteros que
podrían ocupar ese lugar sin violar la propiedad de orden. El razonamiento son las cotas que
imponen los subárboles vecinos.

**Ejemplo (orden 1).** En la raíz $[\,?\,|\,130]$ del árbol siguiente se busca el conjunto de
valores posibles para `?`:

```text
                 [?|130]
          /          |          \
       [20]        [100]      [180|220]
      /    \      /    \      /    |    \
    [10]  [30] [70]  [120][140|150][200][240]
```

La clave `?` es la primera de la raíz, así que debe ser mayor que todo su subárbol izquierdo
—$[20]$ con hojas $[10],[30]$, cuyo máximo es $30$— y menor que todo el subárbol que la separa
de $130$ —$[100]$ con hojas $[70],[120]$, cuyo mínimo es $70$. Encadenando las condiciones
$x>20,\ x>30$ por un lado y $x<100,\ x<70$ por el otro:

$$30 < x < 70 \implies \text{?} \in \{31, 32, \dots, 69\}$$

expresado como intervalo entero cerrado a izquierda y derecha, $[31, 69]$.

---

## Ver también

- [[01-arboles-multicamino-y-b-trees]] — definición, cotas y búsqueda
- [[03-borrado-en-b-trees]] — la operación dual, con fusiones y bajada de claves
- [[01-big-o-y-ordenes]] — el costo $O(\log N)$ de la inserción
