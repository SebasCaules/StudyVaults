---
tags: [teoria, unidad-1, familias, relaciones]
fuente: raw/3-resumenes/algebra.pdf
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Familias de subconjuntos y relaciones

Primera unidad de Álgebra: se parte de las **familias de subconjuntos** de un conjunto
y sus operaciones, y se llega a la noción general de **relación** entre dos conjuntos,
su producto cartesiano, la relación inversa y su representación gráfica. La
clasificación de relaciones y los casos de equivalencia y orden se tratan en
[[02-clasificacion-y-equivalencia]]. Transcripción de los apuntes de la cursada 2023-1C.

## Familias de subconjuntos

> **Definición (familia).** Dado un conjunto $A$, una **familia de subconjuntos** de $A$
> es un subconjunto del conjunto de partes $\mathcal{P}(A)$. Se nota $\mathcal{F} \subseteq \mathcal{P}(A)$.

Es decir, una familia es un conjunto cuyos elementos son a su vez subconjuntos de $A$.

### Operaciones sobre una familia

Sobre una familia $\mathcal{F} \subseteq \mathcal{P}(A)$ se definen la unión y la intersección
de todos sus miembros.

La **unión** de la familia reúne los elementos que pertenecen a *algún* conjunto de la familia:

$$\bigcup \mathcal{F} = \bigcup_{B \in \mathcal{F}} B = \{\, x \in A : x \in B \text{ para algún } B \in \mathcal{F} \,\}$$

La **intersección** reúne los elementos que pertenecen a *todos* los conjuntos de la familia:

$$\bigcap \mathcal{F} = \bigcap_{B \in \mathcal{F}} B = \{\, x \in A : x \in B \text{ para todo } B \in \mathcal{F} \,\}$$

donde $A$ es el conjunto ambiente, $B$ cada subconjunto miembro de la familia y $x$ un
elemento genérico de $A$.

## Herramientas de demostración

Junto a las familias, el resumen registra dos herramientas de uso constante en la materia.

**Principio de Arquímedes.** Para todo real existe un natural que lo supera:

$$\forall x \in \mathbb{R}, \ \exists\, n \in \mathbb{N} : n \geq x$$

**Demostrar una inclusión $A \subseteq B$.** Para probar $A \subseteq B$ se dispone de dos vías:

i) **Directo:** $x \in A \Rightarrow x \in B$.
ii) **Contrarrecíproco:** $x \notin B \Rightarrow x \notin A$.

## Relaciones

> **Definición (relación).** Sean $A$ y $B$ conjuntos no vacíos. Una **relación de $A$ en $B$**
> es un subconjunto del producto cartesiano $A \times B$; es decir,
> $$R \subseteq A \times B \qquad \text{o bien} \qquad R \in \mathcal{P}(A \times B).$$

Cuando $(a, b) \in R$ se dice que $a$ está relacionado con $b$ y se escribe $a\,R\,b$.

### Producto cartesiano

El terreno donde vive una relación es el producto cartesiano de los dos conjuntos.

> **Definición (producto cartesiano).** Sean $A$ y $B$ conjuntos no vacíos. Se define
> $$A \times B = \{\, (a, b) : a \in A \ \wedge\ b \in B \,\}$$
> el conjunto de todos los pares ordenados con primera coordenada en $A$ y segunda en $B$.

### Relación inversa

> **Definición (relación inversa).** Dada $R \subseteq A \times B$, se define su **inversa** como
> $$R^{-1} = \{\, (a, b) : (b, a) \in R \,\}, \qquad R^{-1} \subseteq B \times A.$$

La inversa intercambia el orden de las coordenadas: invierte el sentido en que se lee cada par.

## Diagrama de Hasse

Las relaciones sobre un conjunto se pueden dibujar. El resumen contrasta dos representaciones
gráficas de un mismo par relacionado $a\,R\,b$:

- **Grafo:** cada par $a\,R\,b$ se dibuja como una arista dirigida (flecha) que va de $a$ a $b$.
- **Hasse:** el par $a\,R\,b$ se representa colocando $b$ por encima de $a$ y uniéndolos con un
  segmento; la altura codifica el sentido de la relación, sin flechas.

> **Nota.** Los **diagramas de Hasse** sirven específicamente para representar
> [[02-clasificacion-y-equivalencia|relaciones de orden]]: la convención de "más arriba" reemplaza
> a la flecha del grafo, y las aristas que se deducen por transitividad se omiten.

---

## Ver también

- [[02-clasificacion-y-equivalencia]] — reflexiva, simétrica, antisimétrica, transitiva; equivalencia, orden y clases
