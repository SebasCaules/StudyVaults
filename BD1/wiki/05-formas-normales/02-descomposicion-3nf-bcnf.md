---
tags: [tecnica, unidad-5, descomposicion, sintesis-3nf, bcnf, algoritmo-de-gottlob]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 5
tipo: tecnica
actualizado: 2026-07-05
---

# Descomposición en 3NF y BCNF

Descomponer $R$ es reemplazarlo por subesquemas $R_1, \dots, R_n$ cuya unión de atributos es $R$.
Para que la descomposición sirva debe ser **sin pérdida** y, salvo que se resigne a propósito,
**preservar las dependencias**. Esta página reúne las condiciones y los tres algoritmos usados en la
cursada, con los árboles resueltos de los parciales.

## Junta sin pérdida y preservación

> **Definición (sin pérdida en dos esquemas).** La descomposición de $R$ en $R_1$ y $R_2$ es **sin
> pérdida** si la intersección determina funcionalmente a uno de los dos lados:
> $$(R_1 \cap R_2) \to (R_1 - R_2) \in F^{+} \qquad \text{o} \qquad (R_1 \cap R_2) \to (R_2 - R_1) \in F^{+}$$

Es decir, el atributo (o conjunto) compartido debe ser clave de al menos uno de los fragmentos. Para
descomposiciones en $n$ esquemas la prueba general se hace por **tableau** (ver
[[05-formas-normales/04-metodo-del-tableau]]).

> **Definición (preservación de dependencias).** Sea $F_i$ la proyección de $F$ sobre $R_i$ y
> $F' = \bigcup_i F_i$. La descomposición **preserva las dependencias** si $F'^{+} = F^{+}$: no se
> pierde ninguna dependencia al repartir los atributos.

## Algoritmo de síntesis 3NF

Toma como insumo el **recubrimiento mínimo** $F_m$ (ver
[[04-dependencias-funcionales/03-recubrimiento-minimo]]) y produce una descomposición **en 3NF, sin
pérdida y que preserva dependencias**:

1. Calcular el recubrimiento mínimo $F_m$ de $F$.
2. Por cada dependencia $\alpha \to \beta$ de $F_m$, formar un subesquema con los atributos
   $\alpha \cup \beta$. Las dependencias con **igual lado izquierdo** se agrupan en un solo esquema.
3. Si ningún subesquema contiene una **clave candidata** de $R$, agregar un esquema que sea una clave.
4. Eliminar todo subesquema contenido en otro.

### Ejemplo resuelto — $R(A,B,C,D,E,F,G,H)$

Del segundo parcial. El esquema es $R = (A,B,C,D,E,F,G,H)$ con
$$\text{Dep} = \{\, BH \twoheadrightarrow AG,\; GBH \to F,\; HBA \to C,\; A \to D,\; F \to AH,\; BH \to E,\; D \to G \,\}$$

**Paso previo — convertir la multivaluada.** $BH \twoheadrightarrow AG$ se transforma en
dependencias funcionales por **coalescencia** (regla de las MVD, ver
[[05-formas-normales/03-mvd-4nf-5nf]]). Con $\beta = AG$:

- como $G \subseteq AG$, $D \cap AG = \varnothing$ y $D \to G$, resulta $BH \to G$;
- como $A \subseteq AG$, $F \cap AG = \varnothing$ y $F \to A$, resulta $BH \to A$.

**Claves.** Clasificando los atributos (solo-izquierda / ambos lados / solo-derecha) y cerrando los
candidatos, $B$ está en toda clave y $(B)^{+} = \{B\}$ no es superclave. Probando extensiones:

$$(BH)^{+} = R \qquad (BF)^{+} = R \qquad (BA)^{+},\,(BG)^{+},\,(BD)^{+} \subsetneq R$$

Las claves candidatas son $\mathbf{BH}$ y $\mathbf{BF}$; los atributos **primos** son $\{B,H,F\}$.

**¿Está en 3NF?** No: $A \to D$ la viola, porque $A$ no es superclave y $D$ no es primo. Hay que
descomponer.

**Recubrimiento mínimo.** Reduciendo las dependencias (usando que $BH \to A \to D \to G$, con lo que
$G$ y $A$ sobran en los lados izquierdos de $GBH \to F$ y $HBA \to C$, y separando $F \to AH$):

$$F_m = \{\, BH \to F,\; BH \to C,\; BH \to E,\; A \to D,\; F \to A,\; F \to H,\; D \to G \,\}$$

**Síntesis.** Agrupando por lado izquierdo, el árbol de descomposición queda:

| Subesquema | Clave | Dependencias |
|---|---|---|
| $R_1 = (B,H,F,C,E)$ | $BH$ | $BH \to FCE$ |
| $R_2 = (A,D)$ | $A$ | $A \to D$ |
| $R_3 = (F,A,H)$ | $F$ | $F \to AH$ |
| $R_4 = (D,G)$ | $D$ | $D \to G$ |

Como $R_1$ contiene la clave $BH$, no hace falta agregar un esquema extra por el paso 3. La
descomposición es 3NF, sin pérdida y preserva dependencias.

## Algoritmo de descomposición BCNF

BCNF se alcanza por **descomposición binaria iterativa** (no por síntesis). Mientras algún $R_i$
tenga una dependencia no trivial $\alpha \to \beta$ que la viole (con $\alpha$ **no** superclave de
$R_i$), se parte $R_i$ en dos:

$$R_i \;\longrightarrow\; (\alpha \cup \beta) \quad \text{y} \quad \big(R_i - (\beta - \alpha)\big)$$

Cada partición es **sin pérdida**, porque la intersección de los dos fragmentos es $\alpha$ y
$\alpha \to \alpha\beta$. Se repite hasta que todos los subesquemas estén en BCNF.

> **Cuidado:** la descomposición BCNF **no siempre preserva las dependencias**. Si preservar es
> obligatorio, puede que haya que conformarse con 3NF (que sí las preserva). Este es el compromiso
> central entre 3NF y BCNF.

## Proyección de dependencias — algoritmo de Gottlob

Cuando se descompone $R$, hay que saber **qué dependencias de $F^{+}$ valen dentro de un subesquema
$R_1$** (su proyección $\pi_{R_1}(F^{+})$). El **algoritmo de Gottlob** la calcula: para cada
subconjunto $Y \subseteq R_1$ se computa su clausura $Y^{+}$ **bajo $F$ sobre $R$ completo** y se
agrega la dependencia $Y \to (Y^{+} \cap R_1)$; el resultado final es el recubrimiento mínimo de todo
lo obtenido. Operativamente se **eliminan** los atributos $X = R - R_1$ combinando por
pseudotransitividad las dependencias que los producen con las que los usan:
$$Y \to A,\quad AZ \to B \;\Longrightarrow\; YZ \to B$$

### Ejemplo resuelto — $R(A,B,C,D,E,G,H)$

Del segundo parcial. $R = (A,B,C,D,E,G,H)$ con
$$\text{Dep} = \{\, CB \to A,\; E \to G,\; AB \to C,\; AC \to B,\; B \to D \,\}$$

Se descompone y uno de los subesquemas es $R_1 = (A,B,D,E,G,H)$. El atributo a eliminar es
$X = R - R_1 = \{C\}$.

- Las dependencias que involucran a $C$ ($CB \to A$, $AB \to C$, $AC \to B$) se combinan entre sí;
  por ejemplo $AB \to C$ con $CB \to A$ da $AB \to A$, que es **trivial**. Ninguna combinación produce
  una dependencia no trivial nueva sobre $R_1$.
- Las dependencias que **no** mencionan a $C$ pasan directas: $E \to G$ y $B \to D$ (ambas con todos
  sus atributos en $R_1$).

Proyección resultante sobre $R_1$:
$$F_1 = \{\, E \to G,\; B \to D \,\}$$

> **Nota.** En el mismo parcial las claves de $R$ se hallan clasificando atributos: $E$ y $H$ están en
> toda clave ($(EH)^{+} = \{E,H,G\}$ no es superclave), y las claves candidatas resultan
> $EHAB$, $EHAC$ y $EHBC$.

---

## Ver también

- [[05-formas-normales/01-formas-normales]] — definiciones de 3NF, BCNF y la escala de formas normales
- [[05-formas-normales/04-metodo-del-tableau]] — prueba general de junta sin pérdida por *chase*
- [[04-dependencias-funcionales/03-recubrimiento-minimo]] — cálculo de $F_m$, insumo de la síntesis 3NF
- [[04-dependencias-funcionales/02-clausura-y-claves-candidatas]] — hallar todas las claves candidatas
