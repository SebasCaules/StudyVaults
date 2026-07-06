---
tags: [teoria, unidad-4, arboles-b, borrado, b-tree]
fuentes:
  - apuntes de la cursada 2024-2C (final, borrado en B-tree)
  - apuntes de la cursada 2024-2C (final, parciales — trazas de borrado orden 1 y 2)
unidad: 4
tipo: resuelto
actualizado: 2026-07-05
---

# Borrado en árboles B

El borrado en un árbol B es la operación más delicada: además de quitar la clave hay que
**restaurar la ocupación mínima** de los nodos que quedan cortos, y eso puede propagar
fusiones hasta la raíz, reduciendo la altura. Es la operación dual de la
[[02-insercion-en-b-trees|inserción]].

## Algoritmo

> **Regla de borrado.** Para borrar una clave de un B-tree de orden $N$ (mínimo $N$ claves por
> nodo, salvo la raíz):
> i) **si la clave está en una hoja**, se borra directamente;
> ii) **si no está en una hoja** (nodo interno), se la reemplaza por una **clave adyacente
> lexicográficamente** —su predecesor o su sucesor inorder—, que sí vive en una hoja;
> iii) **si tras el borrado un nodo queda con menos claves de las permitidas** (underflow), se
> **une con su hermano y con la clave antecesora** (el separador que baja desde el padre);
> iv) **si al fusionar el nodo resultante no cumple las condiciones** (se pasa de $2N$), se lo
> **particiona subiendo el elemento del medio**, igual que en la inserción.

La clave adyacente del paso (ii) puede tomarse como **sucesor inorder** (la menor clave del
subárbol derecho) o como **predecesor inorder** (la mayor clave del subárbol izquierdo); el
enunciado suele fijar cuál usar. La cascada de fusiones del paso (iii) es lo que, al llegar a
la raíz, puede **disminuir la altura** del árbol.

## Traza — borrado en un árbol B de orden 1

Sobre el siguiente árbol de orden 1 (entre $1$ y $2$ claves por nodo), surgido de insertar
$0, 8, 109, 220, 222, 241, 149, 107, 75, 248, 254, 140, 16, 66, 74, 21, 211, 47, 80, 242$, se
piden los borrados sucesivos de $66, 21, 109, 241, 149, 140, 211, 220$ y $242$. Se transcriben
los cuatro primeros, que ya ejercitan todos los casos.

```text
                          [109]
              /                        \
           [66]                       [220]
          /     \                    /       \
     [8|21]    [75]            [149]        [241|248]
     / | \     /  \            /   \        /    |    \
   [0][16][47][74][80|107] [140][211]  [222][242][254]
```

**Borrar 66** (clave interna). Se reemplaza por su **sucesor** $74$ (menor clave del subárbol
derecho, hoja $[74]$). La hoja $[74]$ queda vacía (underflow); su hermano $[80\,|\,107]$ presta:
baja el separador $75$ y sube $80$. Resultado:

```text
                          [109]
              /                        \
           [74]                       [220]
          /     \                    /       \
     [8|21]    [80]              [149]      [241|248]
     / | \     /  \              /   \       /   |   \
   [0][16][47][75][107]      [140][211] [222][242][254]
```

**Borrar 21** (clave interna). Se reemplaza por su **predecesor** $16$ (mayor clave del
subárbol izquierdo, hoja $[16]$). La hoja $[16]$ queda vacía; como los hermanos están al
mínimo, **se fusiona** con el hermano $[47]$ y el separador $16$ que baja: $[16\,|\,47]$. El
nodo $[8\,|\,16]$ pierde el $16$ y queda como $[8]$. Resultado del lado izquierdo:

```text
           [74]
          /     \
       [8]      [80]
      /   \     /  \
   [0][16|47][75][107]
```

**Borrar 109** (raíz interna). Se reemplaza por su **sucesor** $140$. Su hoja queda vacía y
dispara fusiones en cascada: el nodo $[149]$ se une con $[211]$ y baja $149$ → hoja
$[149\,|\,211]$, dejando vacío al nodo interno; ese vacío se fusiona con $[241\,|\,248]$ y el
separador $220$ → $[220\,|\,241\,|\,248]$, que se pasa de $2$ claves y **se parte subiendo el
medio $241$**. La raíz pasa a ser $[140]$ y su hijo derecho $[241]$:

```text
                     [140]
              /                \
           [74]               [241]
          /    \              /    \
       [8]    [80]        [220]    [248]
      /  \    /  \        /   \    /   \
    [0][16|47][75][107][149|211][222][242][254]
```

**Borrar 241** (clave interna). Se reemplaza por su sucesor $242$; la fusión en cascada vuelve
a subir por el lado derecho hasta que la **raíz $[140]$ se une con su hijo $[74]$** dando la
raíz $[74\,|\,140]$: el árbol **pierde un nivel de altura**.

```text
                    [74|140]
          /            |             \
       [8]           [80]          [220|242]
      /   \          /   \         /    |     \
    [0][16|47]   [75][107]  [149|211][222][248|254]
```

Los borrados restantes ($149, 140, 211, 220, 242$) siguen las mismas reglas —reemplazo por
adyacente, préstamo del hermano o fusión con bajada del separador.

> **Nota.** En los diagramas manuscritos del original algunos números chicos son ambiguos
> (por ejemplo $248$ frente a lo que podría leerse como $247$); se transcriben según el conjunto
> de claves insertadas, que no incluye $247$. *(Trazas fotografiadas, algún dígito dudoso en el
> original.)*

## Traza — orden 2, borrado por sucesor inorder

Sobre este árbol B de orden 2 (entre $2$ y $4$ claves por nodo), sin repeticiones:

```text
                        [33]
              /                    \
        [18|23]                  [48|52]
       /   |    \               /   |    \
[10|12|15][20|21][24|30|31][45|47][50|51][82|90]
```

**Borrar 33** usando el **sucesor inorder**. El sucesor de $33$ es $45$ (menor clave del
subárbol derecho, hoja $[45\,|\,47]$), que sube a la raíz. La hoja $[47]$ queda con una sola
clave (underflow, mínimo $2$); como los hermanos están al mínimo no pueden prestar, así que
**se fusiona** con $[50\,|\,51]$ y el separador $48$ → $[47\,|\,48\,|\,50\,|\,51]$. Eso deja al
nodo $[48\,|\,52]$ como $[52]$ (underflow interno), que se fusiona con $[18\,|\,23]$ y el
separador $45$. La **raíz desaparece** y el árbol baja un nivel:

```text
              [18|23|45|52]
         /     |    |    |     \
[10|12|15][20|21][24|30|31][47|48|50|51][82|90]
```

## Traza — orden 2, borrado por predecesor inorder

Sobre un árbol B de orden 2 análogo, tomando ahora el **predecesor inorder**:

**Borrar 80** (clave en la hoja $[80\,|\,93]$). Es una hoja, se borra directo, pero queda
$[93]$ con una sola clave (underflow). Se fusiona con el hermano $[50\,|\,51]$ y el separador
$52$ → $[50\,|\,51\,|\,52\,|\,93]$; el nodo $[48\,|\,52]$ queda como $[48]$ y se fusiona con
$[18\,|\,23]$ bajando el separador $33$. De nuevo baja la altura:

```text
              [18|23|33|48]
         /     |    |    |     \
[10|12|15][20|21][24|30][45|47][50|51|52|93]
```

## Caracterizar qué borrados bajan la altura

Otro arquetipo pide el conjunto $C$ de claves cuyo borrado **disminuye la altura** del árbol.
Para un árbol B de orden 1 minimalmente cargado:

```text
              [170]
          /          \
      [150]          [230]
     /     \        /     \
  [100]  [165]   [200]   [300]
```

Como cada nodo interno está en el mínimo, borrar **cualquiera de las hojas** dispara la
cascada de fusiones que reduce la altura. Luego:

$$C = \{100,\ 165,\ 200,\ 300\}$$

---

## Ver también

- [[01-arboles-multicamino-y-b-trees]] — definición, cotas de ocupación y búsqueda
- [[02-insercion-en-b-trees]] — la operación dual: subir la clave del medio al partir
- [[03-red-black-trees|árboles Red-Black]] — otra estructura con borrado por casos
