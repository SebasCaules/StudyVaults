---
tags: [teoria, unidad-4, clausura, claves-candidatas, superclave, atributo-primo]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Clausura de atributos y claves candidatas

La **clausura** de un conjunto de atributos es la herramienta operativa central de la teoría de
dependencias: con ella se decide si una DF se infiere, si un conjunto es superclave y, mediante el
**método de la tabla** (izquierda / medio / derecha), se hallan **todas** las claves candidatas de
un esquema. Las definiciones de DF y los axiomas están en
[[04-dependencias-funcionales/01-dependencias-funcionales-y-armstrong]].

## Clausura de un conjunto de atributos

> **Definición.** Sea $F$ un conjunto de dependencias funcionales y $X \subseteq R$. La **clausura**
> de $X$ bajo $F$, notada $X^+$, es el conjunto de todos los atributos determinados por $X$:
> $$X^+ = \{\, A \in R \mid X \to A \in F^+ \,\}$$

La clausura resuelve el problema de inferencia sin construir todo $F^+$: una dependencia $X \to Y$
se infiere de $F$ **si y solo si** $Y \subseteq X^+$.

> **Algoritmo (clausura de atributos).** Para calcular $X^+$ bajo $F$:
> 1. Inicializar $X^+ := X$.
> 2. Repetir: para cada DF $\alpha \to \beta$ de $F$ con $\alpha \subseteq X^+$, agregar $\beta$ a $X^+$.
> 3. Terminar cuando una pasada completa no agrega ningún atributo nuevo.

**Ejemplo.** Sea $R(A,B,C,D,E,F,G,H)$ y un conjunto de dependencias que incluye $BH \to A$,
$BH \to G$, $GBH \to F$, $HBA \to C$, $A \to D$, $F \to AH$, $BH \to E$, $D \to G$. Calculamos
$(BH)^+$ paso a paso:

- Partimos de $\{B, H\}$.
- $BH \to A$ y $BH \to G$ agregan $A, G$: $\{B,H,A,G\}$.
- $GBH \to F$ agrega $F$; $HBA \to C$ agrega $C$: $\{B,H,A,G,F,C\}$.
- $A \to D$ agrega $D$; $BH \to E$ agrega $E$: $\{B,H,A,G,F,C,D,E\}$.

$(BH)^+ = \{A,B,C,D,E,F,G,H\} = R$, así que $BH$ determina todo el esquema.

## Superclave, clave candidata y atributo primo

> **Definición.** Un conjunto $X \subseteq R$ es una **superclave** de $R$ si $X^+ = R$, es decir,
> si $X$ determina funcionalmente a todos los atributos del esquema.

> **Definición.** Una **clave candidata** (o simplemente **clave**) es una superclave **minimal**:
> $X$ es clave si $X^+ = R$ y ningún subconjunto propio $X' \subsetneq X$ cumple $X'^+ = R$.

> **Definición.** Un atributo es **primo** si pertenece a **alguna** clave candidata. Los atributos
> que no aparecen en ninguna clave se llaman **no primos**.

La distinción primo / no primo es la que gobierna la definición de **3NF**: una violación típica es
una dependencia $\alpha \to A$ donde $\alpha$ no es superclave y $A$ no es primo (por ejemplo,
$A \to D$ con $A$ no superclave y $D$ no primo).

## Método de la tabla para hallar todas las claves

Para no probar a ciegas todos los subconjuntos de atributos, se clasifica **cada atributo** de $R$
según en qué lado de las dependencias aparece. Se arma una tabla de cuatro columnas:

| Columna | Atributos que… | Consecuencia |
|---|---|---|
| **i** (izquierda) | aparecen **solo** a la izquierda de alguna DF | están en **toda** clave |
| **i-d** (medio) | aparecen a la izquierda **y** a la derecha | pueden estar o no |
| **d** (derecha) | aparecen **solo** a la derecha | **nunca** están en una clave |
| **No** | no aparecen en ninguna DF | están en **toda** clave |

El razonamiento clave:

- Los atributos de **i** y de **No** no son determinados por nada, así que ninguna clave puede
  prescindir de ellos: forman el **núcleo** que toda clave debe contener.
- Los atributos de **d** siempre están determinados por otros, por lo que jamás hacen falta en una
  clave.
- Los candidatos a completar la clave salen únicamente de la columna **i-d**.

> **Procedimiento.** Sea $N$ el núcleo (columnas **i** $\cup$ **No**). Si $N^+ = R$, entonces $N$ es
> la única clave. Si no, se van agregando a $N$ subconjuntos crecientes de la columna **i-d** y se
> calcula la clausura; los conjuntos minimales cuya clausura da $R$ son las claves candidatas.

### Ejemplo resuelto: tres claves

Sea $R(A,B,C,D,E,G,H)$ con
$$\text{Dep} = \{\, CB \to A,\;\; E \to G,\;\; AB \to C,\;\; AC \to B,\;\; B \to D \,\}$$

Clasificamos cada atributo:

| i | i-d | d | No |
|---|---|---|---|
| E | C, A, B | D, G | H |

El núcleo es $\{E, H\}$ (columna **i** más columna **No**). Su clausura es
$(EH)^+ = \{E, H, G\}$ (solo $E \to G$ agrega algo): **no** es superclave. Agregamos candidatos de
la columna **i-d**:

- $(EHA)^+ = \{E,H,A,G\}$ — insuficiente.
- $(EHB)^+ = \{E,H,B,G,D\}$ — insuficiente.
- $(EHC)^+ = \{E,H,C,G\}$ — insuficiente.

Con pares del medio se completa el esquema:

- $(EHAB)^+ = \{E,H,A,B,C,D,G\} = R$ &nbsp;✓
- $(EHAC)^+ = \{E,H,A,C,B,D,G\} = R$ &nbsp;✓
- $(EHBC)^+ = \{E,H,B,C,A,D,G\} = R$ &nbsp;✓

Las **claves candidatas** son $EHAB$, $EHAC$ y $EHBC$. Notar que $E$ y $H$ aparecen en las tres,
como anticipaba el núcleo.

### Ejemplo resuelto: núcleo de un solo atributo

Sea $R(A,B,C,D,E,F,G,H)$ con las dependencias del ejemplo de clausura de arriba (incluyen
$BH \to A$, $BH \to G$, $GBH \to F$, $HBA \to C$, $A \to D$, $F \to AH$, $BH \to E$, $D \to G$). La
clasificación deja a $B$ como único atributo **solo-izquierda** (los demás aparecen también a la
derecha, y $C, E$ son solo-derecha). El núcleo es $\{B\}$, pero $(B)^+ = \{B\} \neq R$: $B$ está en
toda clave pero no es superclave por sí solo. Probando extensiones:

- $(BA)^+ = \{B,A,D,G\}$ — no.
- $(BG)^+ = \{B,G\}$ — no.
- $(BD)^+ = \{B,D,G\}$ — no.
- $(BH)^+ = R$ &nbsp;✓
- $(BF)^+ = R$ &nbsp;✓ ($F \to AH$ arranca la cadena y se alcanza todo el esquema)

Las claves candidatas son $BH$ y $BF$.

---

## Ver también

- [[04-dependencias-funcionales/01-dependencias-funcionales-y-armstrong]] — definición de DF, dependencia trivial y axiomas de Armstrong
- [[04-dependencias-funcionales/03-recubrimiento-minimo]] — el recubrimiento mínimo usa la clausura para detectar atributos y dependencias redundantes
