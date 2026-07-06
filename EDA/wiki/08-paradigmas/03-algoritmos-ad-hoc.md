---
tags: [resuelto, unidad-8, ad-hoc, in-place, complejidad]
fuente: apuntes de la cursada 2024-2C (parciales resueltos)
unidad: 8
tipo: resuelto
actualizado: 2026-07-05
---

# Algoritmos ad-hoc: hallar el repetido in-place

Los parciales incluyen algoritmos **a medida** (ad-hoc): no encajan en un paradigma estándar,
sino que explotan una propiedad particular del dato de entrada para bajar la complejidad
espacial. El ejemplo desarrollado es el de **hallar el elemento repetido** de un arreglo
usando el propio vector como memoria.

## El problema

Se tiene un arreglo `datos` de enteros con la garantía de que **todas sus posiciones
tienen algún valor entre $1$ y `datos.length - 1`**. Por el principio del palomar existe
al menos un valor repetido, y se lo quiere encontrar.

> **Nota.** En el TP7 (Ejercicio 5) se pedía un algoritmo con complejidad temporal
> $O(n \log n)$ y espacial $O(1)$ que **no modificara** el vector (modo *read-only*). Acá se
> levanta esa restricción: al permitir **modificar** el vector recibido se consigue un
> algoritmo aún $O(1)$ espacial pero **lineal** en tiempo.

## La idea

Se usan los **valores** del vector como **índices** de las posiciones a visitar. Partiendo
de una posición inicial (por ejemplo `pxma = 0`), antes de visitar una posición hacia
adelante (*forward*) se distinguen dos casos:

- **Caso a)** si el valor a visitar es **negativo**, ya se pasó por ahí antes (se llegó a él
  desde otra posición). Como se lo alcanza por segunda vez, ese es el **valor repetido**. Se
  lo devuelve en positivo.
- **Caso b)** si el valor es **positivo**, se realiza el movimiento y se lo pasa a negativo
  para **marcar la visita**.

El signo funciona como marca de "visitado" sin necesidad de memoria extra, y `Math.abs`
recupera el índice real de un valor ya marcado.

## Versión V1 (modifica el vector)

```java
static public int calculateRepeatedV1(int[] datos) {
    int pxma = 0;
    // looking forward
    while (datos[Math.abs(datos[pxma])] > 0) {
        // effectively one movement
        pxma = Math.abs(datos[pxma]);
        // change the state (visited)
        datos[pxma] = -datos[pxma];
    }
    return Math.abs(datos[pxma]);
}
```

**Complejidad.** Cada iteración del `while` avanza a una posición nueva y la marca, así que
se recorre a lo sumo una vez cada posición:

$$T(n) = n + 1 = O(n), \qquad S(n) = O(1).$$

**Traza.** Sobre un arreglo cuyas primeras posiciones son $[1, 2, 3, 4, 4, \dots]$, se salta
$d[0] \to d[1] \to d[2] \to d[3] \to d[4]$ marcando cada visita en negativo; al reencontrar
la posición asociada al $4$ ya marcada, se detecta el repetido $4$.

## Versión V2 (restaura el vector)

Si además se quiere **dejar el vector como estaba** (deshacer las marcas antes de terminar),
se agrega una pasada final que vuelve a positivo todos los valores negativos:

```java
static public int calculateRepeatedV2(int[] datos) {
    int pxma = 0;
    // looking forward
    while (datos[Math.abs(datos[pxma])] > 0) {
        // effectively one movement
        pxma = Math.abs(datos[pxma]);
        // change the state (visited)
        datos[pxma] = -datos[pxma];
    }
    pxma = Math.abs(datos[pxma]);
    for (int rec = 0; rec < datos.length; rec++) {
        if (datos[rec] < 0)
            datos[rec] = -datos[rec];
    }
    return pxma;
}
```

**Complejidad.** Al `while` (que aporta $n + 1$) se le suma una única iteración del `for`
sobre las $n$ posiciones:

$$T(n) = (n + 1) + n = 2n + 1 = O(n), \qquad S(n) = O(1).$$

El costo asintótico sigue siendo lineal en tiempo y constante en espacio; restaurar el vector
solo agrega un factor constante.

---

## Ver también

- [[01-panorama-heuristicas]] — panorama de las heurísticas de diseño
- [[02-divide-y-venceras]] — Divide & Conquer y el Teorema Maestro
