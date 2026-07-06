---
tags: [teoria, unidad-4, afnd, no-determinismo, subconjuntos, equivalencia]
fuente: raw/teoricas/tla-teorica.pdf
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# AFND y conversión a AFD por subconjuntos

Un **autómata finito no determinístico (AFND)** admite, para un mismo estado y símbolo, pasar
a **varios** estados a la vez. Aunque parece más potente, reconoce exactamente los mismos
lenguajes que un AFD: todo AFND se puede convertir en un AFD equivalente por la **construcción
de subconjuntos** (o conjunto de alcanzables). Esta página presenta el no determinismo, la
equivalencia AFD $\leftrightarrow$ AFND y el método de conversión con un ejemplo completo.

## No determinismo

En un AFD la función de transición devuelve un **único** estado, $\delta : Q \times \Sigma \to Q$.
En un AFND devuelve un **conjunto** de estados posibles: la máquina puede tomar cualquiera de
ellos. La quíntupla es la misma quíntupla general del autómata finito (ver
[[03-automatas-finitos/01-automatas-finitos]]), con

$$\delta : Q \times \Sigma \to \mathcal{P}(Q)$$

donde $\mathcal{P}(Q)$ es el conjunto de partes de $Q$. Una palabra se **acepta** si existe
**al menos una** secuencia de transiciones que termina en un estado final.

> **Observación.** En el diagrama, el no determinismo se ve cuando de un estado salen **dos
> arcos con la misma etiqueta** hacia estados distintos (por ejemplo, un lazo etiquetado $0$
> sobre $q_0$ que a la vez tiene un arco $0$ hacia $q_1$: leyendo $0$ el autómata puede quedarse
> en $q_0$ o pasar a $q_1$).

## Equivalencia AFD y AFND

> **Teorema.** Para todo AFND $N$ existe un AFD $D$ equivalente, $L(D) = L(N)$.

La clave es que, aunque el AFND pueda estar "en varios estados a la vez", ese **conjunto** de
estados posibles es finito. Un AFD que use como estados a los **subconjuntos** de $Q_N$ puede
seguir en paralelo todas las ramas del no determinismo: cada estado del AFD representa el
conjunto de estados en los que el AFND podría estar tras leer la entrada consumida.

## Construcción por subconjuntos

Dado el AFND $N = \langle Q_N, \Sigma, \delta_N, q_0, F_N \rangle$, se construye el AFD
$D = \langle Q_D, \Sigma, \delta_D, \{q_0\}, F_D \rangle$ así:

- **Estados.** $Q_D$ es (una parte de) $\mathcal{P}(Q_N)$: cada estado del AFD es un
  **subconjunto** de estados del AFND. El estado inicial es $\{q_0\}$.
- **Transición.** Desde un subconjunto $S$, leyendo $a$, se va a la **unión** de los destinos
  de cada estado de $S$:
  $$\delta_D(S, a) = \bigcup_{q \in S} \delta_N(q, a)$$
- **Estados finales.** $F_D$ son los subconjuntos que contienen **algún** estado final del
  AFND:
  $$F_D = \{\, S \in Q_D \ :\ S \cap F_N \neq \varnothing \,\}$$

> **Nota.** El conjunto de partes de $Q_N$ puede tener hasta $2^{|Q_N|}$ elementos, pero en la
> práctica solo interesan los subconjuntos **alcanzables** desde $\{q_0\}$. Se los construye
> incrementalmente —arrancando en $\{q_0\}$ y aplicando $\delta_D$— y se descarta el resto de la
> tabla. Los apuntes de la cursada 2025-2C lo llaman **conjunto de alcanzables**.

## Ejemplo completo

Sea el AFND sobre $\Sigma = \{0, 1\}$ con estados $\{q_0, q_1, q_2\}$, inicial $q_0$, finales
$\{q_2\}$, y transiciones

$$\delta_N(q_0, 0) = \{q_0, q_1\},\quad \delta_N(q_0, 1) = \{q_0\},\quad \delta_N(q_1, 1) = \{q_2\}$$

(el resto de las transiciones es vacío). El no determinismo está en $q_0$ con el símbolo $0$:
puede quedarse en $q_0$ o avanzar a $q_1$.

Se arranca en $\{q_0\}$ y se aplica $\delta_D$ solo a los subconjuntos que van apareciendo.
Escribiendo $q_{01}$ por $\{q_0, q_1\}$ y $q_{02}$ por $\{q_0, q_2\}$:

| $\delta_D$ | $0$ | $1$ |
|---|---|---|
| $\{q_0\}$ | $\{q_0, q_1\}$ | $\{q_0\}$ |
| $\{q_0, q_1\}$ | $\{q_0, q_1\}$ | $\{q_0, q_2\}$ |
| $\{q_0, q_2\}$ (\*) | $\{q_0, q_1\}$ | $\{q_0\}$ |

Cada celda sale de unir los destinos del AFND. Por ejemplo, $\delta_D(\{q_0, q_1\}, 1) =
\delta_N(q_0, 1) \cup \delta_N(q_1, 1) = \{q_0\} \cup \{q_2\} = \{q_0, q_2\}$.

Partiendo de $\{q_0\}$ solo se alcanzan **tres** subconjuntos —$\{q_0\}$, $\{q_0, q_1\}$ y
$\{q_0, q_2\}$—, así que la tabla se queda con esos tres estados y se ignoran los demás
subconjuntos del conjunto de partes. El único final es $\{q_0, q_2\}$, porque es el único
alcanzable que contiene a $q_2$:

$$F_D = \{\, \{q_0, q_2\} \,\}$$

El resultado es un AFD que reconoce el mismo lenguaje que el AFND de partida. Si conviene,
puede luego minimizarse con el procedimiento de [[01-minimizacion-afd]].

## Ver también

- [[01-minimizacion-afd]] — eliminar inaccesibles y fusionar estados por clases de equivalencia
- [[03-automatas-finitos/01-automatas-finitos]] — la quíntupla del autómata finito y $\delta$ con destino en $\mathcal{P}(Q)$
- [[02-gramaticas/03-jerarquia-de-chomsky]] — los lenguajes regulares (tipo 3) que estos autómatas reconocen
- [[index]] — índice del vault de TLA
