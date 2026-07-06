---
tags: [teoria, unidad-4, planaridad, algoritmo-planaridad, apendices]
fuente: raw/Resumenes/Resumen_M_Discreta.pdf
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Algoritmo de planaridad

Cierre de la unidad de planaridad. A partir de los [[03-bloques|apéndices de un subgrafo]]
se definen los conceptos de cuerda, punto de contacto, superposición, bloqueo y
apéndice forzado, y con ellos se arma un **procedimiento** que decide si un grafo es plano
construyendo una inmersión región por región.

## Cuerdas y puntos de contacto

> **Definición.** Una **cuerda** es un apéndice que tiene una sola arista y une $2$
> vértices de $H$, pero que no está en $H$.

> **Definición.** Sea $H$ un subgrafo de $G$ y sea $B$ un apéndice de $H$. Un **punto de
> contacto** de $B$ es un vértice de $B \cap H$ (un vértice por el que el apéndice se pega
> a $H$).

## Superposición de apéndices

Dos apéndices "compiten" por el mismo lado del ciclo cuando sus puntos de contacto se
entrelazan sobre él.

> **Definición.** Sea $C$ un ciclo en $G$. Los apéndices $B_1$ y $B_2$ **se superponen**
> si se cumple alguna de estas condiciones:
> i) dos puntos de contacto de $B_1$ **alternan** con dos puntos de contacto de $B_2$
>    sobre $C$; **o bien**
> ii) $B_1$ y $B_2$ tienen $3$ puntos de contacto en común.

> **Proposición.** Sea $C$ un ciclo y $B_1, B_2$ apéndices superpuestos de $C$. Entonces
> los apéndices **no pueden estar ambos del mismo lado** de $C$: uno va adentro y el otro
> afuera.

## Bloqueo y forzado

Al dibujar los apéndices sobre una inmersión parcial, cada uno debe caber en una región
cuya frontera contenga a todos sus puntos de contacto.

> **Definición.** Sea $H$ un subgrafo de $G$. En un dibujo plano de $H$, un apéndice de
> $H$ **no puede dibujarse** en una región $R$ si la frontera de $R$ no contiene todos los
> puntos de contacto del apéndice.

> **Definición.** Un apéndice de $H$ está **bloqueado** si no puede dibujarse en **ninguna**
> región del dibujo actual de $H$.

> **Proposición.** Si $H$ (subgrafo de $G$) tiene un apéndice **bloqueado**, entonces no
> es posible extender tal dibujo a una inmersión plana de $G$.

> **Definición.** Un apéndice está **forzado** al interior de una región $R$ si $R$ es la
> **única** región cuya frontera contiene a todos los puntos de contacto del apéndice
> (no queda otra región donde ubicarlo).

## Reducción a bloques

El problema global se parte en subproblemas independientes, uno por bloque.

> **Proposición.** Un grafo es plano si y solo si **todos sus bloques son planos**.

Por eso el procedimiento se aplica bloque por bloque: alcanza con decidir la planaridad de
cada [[03-bloques|bloque]] $2$-conexo por separado.

## Procedimiento

Para decidir si un grafo $G$ (o un bloque suyo) es plano se construye una inmersión de a
un apéndice por vez, respetando los forzados:

1. **Inicio.** Se elige un ciclo $C = G_0$ del grafo y se lo dibuja; el ciclo determina
   dos regiones, la interior $R_1$ y la exterior $R_\infty$. Los pedazos restantes de $G$
   son los apéndices $B_1, B_2, \dots$ de $C$.
2. **Paso general.** Mientras queden apéndices sin dibujar:
   - si algún apéndice está **forzado** a una región, se lo dibuja allí;
   - si ningún apéndice está forzado, se elige libremente uno y se lo dibuja en una región
     admisible (interior o exterior).
   - Cada apéndice dibujado subdivide su región en regiones nuevas y puede **forzar** a los
     apéndices restantes (por sus puntos de contacto) a una región concreta.
3. **Fin.** Si en algún momento un apéndice queda **bloqueado** (ninguna región contiene
   todos sus puntos de contacto), el grafo **no es plano**. Si se logran dibujar todos los
   apéndices sin cruces, el grafo **es plano** y el dibujo resultante es una inmersión.

### Ejemplo trabajado

Se toma un grafo $G$ sobre los vértices $\{a, b, c, d, e\}$ y se decide su planaridad.

- **Inicio.** Se elige el ciclo $C = G_0$ dado por el pentágono $a\,b\,c\,d\,e\,a$, que
  crea las regiones $R_1$ (interior) y $R_\infty$. Los apéndices que quedan son $B_1$,
  $B_2$ y $B_3$ (las aristas de $G$ que no están en el ciclo).
- **Primer paso.** Ningún apéndice está forzado, así que cualquiera puede ir en $R_1$ o en
  $R_\infty$. Se dibuja $B_1$ en el interior; al hacerlo, el interior queda subdividido en
  varias regiones y los apéndices restantes $B_2$ y $B_3$ quedan **forzados** a la región
  exterior $R_\infty$.
- **Segundo paso.** Como ambos apéndices están forzados a $R_\infty$, se dibuja primero la
  cuerda y se verifica si el último apéndice se puede integrar en $R_\infty$ sin cruzar
  líneas. No se puede: el último apéndice queda **bloqueado**.

Conclusión: el grafo del ejemplo **no es plano**, porque el último apéndice está bloqueado
(no hay región que contenga todos sus puntos de contacto).

> **Nota.** El procedimiento de los apuntes es constructivo y visual: se apoya en dibujar
> el ciclo inicial y los apéndices a mano, siguiendo los forzados hasta llegar a un
> bloqueo o a una inmersión completa. El diagnóstico "no plano" coincide con lo que
> predice el [[02-homeomorfismo-kuratowski|teorema de Kuratowski]].

---

## Ver también

- [[03-bloques]] — bloques y apéndices (definiciones que usa este algoritmo)
- [[02-homeomorfismo-kuratowski]] — criterio de no planaridad por $K_5$ / $K_{3,3}$
- [[01-grafos-planos-euler]] — grafos planos, regiones y fórmula de Euler
