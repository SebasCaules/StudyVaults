---
tags: [teoria, unidad-6, complejidad, algoritmos, complejidad-temporal, complejidad-espacial]
fuente: raw/Resumenes/Resumen_M_Discreta.pdf
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Algoritmos y complejidad

Una vez fijado un lenguaje para comparar crecimientos (ver
[[06-complejidad/01-notacion-asintotica]]), se puede caracterizar qué es un algoritmo y
medir cuántos recursos consume.

## Propiedades de los algoritmos

Todo algoritmo debe cumplir cuatro propiedades:

i) **Finitud:** debe ser descripto por un texto finito.
ii) **Efectividad:** cada paso del algoritmo tiene que poder ser efectuado.
iii) **Terminación:** tiene que parar en un número finito de pasos.
iv) **Determinación:** la secuencia de pasos tiene que estar unívocamente determinada por cada entrada.

## Complejidad

La complejidad mide el costo de ejecutar un algoritmo en términos de los recursos que
consume.

> **Definición.** La complejidad de un cálculo es la cantidad de recursos necesarios para
> efectuarlo. Se distinguen dos tipos de variables:
> - **Temporal:** cantidad de tiempo necesario para efectuar el cálculo.
> - **Espacial:** cantidad de espacio en la memoria para efectuar el cálculo.

La complejidad suele expresarse con notación asintótica sobre el tamaño de la entrada
$n$: un algoritmo se cataloga, por ejemplo, como $O(n)$, $O(n\log_2 n)$ o $O(n^2)$ según
cómo crezca el recurso medido a medida que la entrada se agranda.

---

## Ver también

- [[06-complejidad/01-notacion-asintotica]] — notación $O$, $\Omega$ y $\Theta$, jerarquía de funciones y operaciones de órdenes
- [[index]] — índice del vault de Matemática Discreta
