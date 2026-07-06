---
tags: [teoria, unidad-5, formas-normales, 3nf, bcnf, 4nf, 5nf]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Formas normales: de 1NF a 5NF y BCNF

Las **formas normales** son condiciones sobre un esquema relacional $R$ (con su conjunto de
dependencias $F$) que acotan la redundancia y las anomalías de actualización. Se organizan como una
**escala**: cada forma es más estricta que la anterior, y satisfacerla implica satisfacer todas las
inferiores. Esta página fija las definiciones; la maquinaria para llegar a ellas (clausura, claves,
recubrimiento mínimo) vive en [[04-dependencias-funcionales/01-dependencias-funcionales-y-armstrong]]
y sus páginas hermanas.

## Por qué normalizar

Un esquema mal diseñado sufre **anomalías**:

- **de inserción:** no se puede registrar un hecho sin conocer otro no relacionado;
- **de modificación:** un mismo dato repetido obliga a actualizar muchas tuplas (riesgo de
  inconsistencia);
- **de borrado:** eliminar una tupla borra, de paso, información que se quería conservar.

La normalización descompone $R$ en subesquemas $R_1, \dots, R_n$ que evitan estas anomalías. Toda
descomposición aceptable debe cumplir dos condiciones (ver
[[05-formas-normales/02-descomposicion-3nf-bcnf]]):

1. ser **sin pérdida** (*lossless join*): la junta natural de las proyecciones reconstruye
   exactamente $R$;
2. **preservar las dependencias**: $F'^{+} = F^{+}$, donde $F'$ es la unión de las proyecciones de
   $F$ sobre cada $R_i$.

## Recordatorio de vocabulario

Sobre un esquema $R$ con dependencias $F$:

> **Definición.** Un conjunto $\alpha \subseteq R$ es **superclave** si $\alpha^{+} = R$. Es **clave
> candidata** si además es minimal (ningún subconjunto propio es superclave). Un atributo es
> **primo** si pertenece a alguna clave candidata.

> **Definición.** Una dependencia funcional $\alpha \to \beta$ es **trivial** si $\beta \subseteq
> \alpha$. Una dependencia multivaluada $\alpha \twoheadrightarrow \beta$ es **trivial** si
> $\beta \subseteq \alpha$ o bien $\alpha \cup \beta = R$.

## Primera forma normal (1NF)

> **Definición (1NF).** $R$ está en **primera forma normal** si todos sus atributos son **atómicos**:
> no hay atributos multivaluados ni compuestos. Cada celda contiene un único valor indivisible.

Es el punto de partida del modelo relacional: sin 1NF no se puede hablar de dependencias sobre
tuplas. Todas las formas superiores la presuponen.

## Segunda forma normal (2NF)

> **Definición (2NF).** $R$ está en **2NF** si está en 1NF y ningún atributo **no primo** depende
> **parcialmente** de una clave candidata (es decir, todo atributo no primo depende de la clave
> *completa*, no de un subconjunto propio).

> **Nota.** En los apuntes de la cursada 2025-2C la 2NF aparece marcada como *"no se usa más"*: se la
> menciona por completitud histórica, pero el proceso de normalización salta directo de 1NF a 3NF /
> BCNF, que son las formas efectivamente utilizadas.

## Tercera forma normal (3NF)

> **Definición (3NF).** $R$ está en **3NF** si para toda dependencia funcional no trivial
> $\alpha \to \beta$ de $F^{+}$ se cumple **al menos una** de estas condiciones:
> $$\alpha \text{ es superclave} \qquad \text{o} \qquad \beta \text{ es primo}$$
> donde "$\beta$ primo" significa que cada atributo de $\beta$ pertenece a alguna clave candidata.

La 3NF admite una dependencia $\alpha \to \beta$ con $\alpha$ no superclave **siempre que** el lado
derecho esté formado por atributos primos. Es la forma normal que siempre se puede alcanzar
**preservando dependencias y sin pérdida** (algoritmo de síntesis, ver
[[05-formas-normales/02-descomposicion-3nf-bcnf]]).

## Forma normal de Boyce–Codd (BCNF)

> **Definición (BCNF).** $R$ está en **BCNF** si para toda dependencia funcional no trivial
> $\alpha \to \beta$ se cumple que
> $$\alpha \text{ es superclave.}$$

BCNF es **más estricta** que 3NF: elimina la excepción "$\beta$ primo". Toda relación en BCNF está en
3NF, pero no al revés.

| | 3NF | BCNF |
|---|---|---|
| Condición por cada $\alpha \to \beta$ no trivial | $\alpha$ superclave **o** $\beta$ primo | $\alpha$ superclave |
| Sin pérdida | sí | sí |
| Preserva dependencias | **siempre** | **no siempre** |

El precio de la estrictez de BCNF es que su descomposición **puede no preservar las dependencias**:
a veces hay que elegir entre BCNF (sin la garantía de preservación) y 3NF (que la garantiza).

## Cuarta forma normal (4NF)

La 4NF ataca la redundancia que las dependencias funcionales no capturan: las **dependencias
multivaluadas** (ver [[05-formas-normales/03-mvd-4nf-5nf]]).

> **Definición (4NF).** $R$ está en **4NF** si para toda dependencia multivaluada no trivial
> $\alpha \twoheadrightarrow \beta$ se cumple que $\alpha$ es superclave.

Como toda dependencia funcional es también multivaluada, 4NF implica BCNF.

## Quinta forma normal (5NF)

La 5NF (o *project–join normal form*, PJNF) atiende las **dependencias de junta** (JD), que
generalizan las multivaluadas a más de dos componentes.

> **Definición (5NF).** $R$ está en **5NF** si toda **dependencia de junta** que vale en $R$ es
> consecuencia de sus claves candidatas; equivalentemente, para toda JD no trivial
> $\bowtie(R_1, \dots, R_n)$ que vale en $R$, **cada** $R_i$ es superclave de $R$.

## La escala completa

Cada forma es estrictamente más fuerte que la anterior:

$$\text{1NF} \supset \text{2NF} \supset \text{3NF} \supset \text{BCNF} \supset \text{4NF} \supset \text{5NF}$$

Estar en una forma implica estar en todas las de su izquierda. El diseño relacional apunta, en la
práctica de la materia, a **3NF** (garantiza preservación) o **BCNF**, subiendo a **4NF/5NF** cuando
aparecen dependencias multivaluadas o de junta.

---

## Ver también

- [[05-formas-normales/02-descomposicion-3nf-bcnf]] — algoritmos de síntesis 3NF, BCNF y proyección de Gottlob, con árboles resueltos
- [[05-formas-normales/03-mvd-4nf-5nf]] — dependencias multivaluadas, de junta, 4NF y 5NF
- [[05-formas-normales/04-metodo-del-tableau]] — el *chase* para probar junta sin pérdida e inferir dependencias
- [[04-dependencias-funcionales/02-clausura-y-claves-candidatas]] — clausura $X^{+}$, superclaves y claves
- [[04-dependencias-funcionales/03-recubrimiento-minimo]] — recubrimiento mínimo $F_m$, insumo de la síntesis 3NF
