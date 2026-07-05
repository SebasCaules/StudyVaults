---
tags: [teoria, unidad-9, termodinamica, primera-ley, gas-ideal, procesos-termodinamicos]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica)
unidad: 9
tipo: teoria
actualizado: 2026-07-05
---

# Primera ley, gas ideal y procesos termodinámicos

El calor es una forma de energía ($1\ \text{cal} = 4{,}18\ \text{J}$). Cuando un sistema
intercambia calor $Q$ y trabajo $W$ con el entorno, en general $Q - W \neq 0$: parte de la energía
queda dentro del sistema. Esta página plantea la **primera ley**, el modelo de **gas ideal** y los
cuatro **procesos termodinámicos** básicos. La [[04-segunda-ley-entropia|segunda ley]] y la
entropía se tratan aparte.

## Convención de signos

Sobre un sistema que intercambia calor $Q$ y trabajo $W$:

- $Q > 0$: calor **entregado al** sistema.
- $Q < 0$: calor **cedido por** el sistema.
- $W > 0$: el sistema **realiza** trabajo sobre el entorno.
- $W < 0$: se realiza trabajo **sobre** el sistema.

## Primera ley de la termodinámica

> **Primera ley.** Cuando se agrega calor $Q$ a un sistema, una parte de esa energía permanece en
> el sistema modificando su energía interna $\Delta U$, y el resto sale como trabajo $W$ hacia el
> entorno:
> $$\Delta U = Q - W$$

En su forma diferencial, para cambios infinitesimales:

$$dU = \delta Q - \delta W$$

donde la notación distingue el carácter de cada término: $d$ es una **derivada total** (de una
función de estado, como $U$), mientras que $\delta$ marca una cantidad que **depende del camino**
recorrido (como $Q$ y $W$). El teorema de conservación de la energía mecánica,
$\Delta E_{mec} = W_{FNC}$, es un caso particular de este balance.

## Trabajo al cambiar el volumen

Si el gas empuja un pistón de área $A$ una distancia $dx$ contra una presión externa, el trabajo
infinitesimal es $\delta W = F\,dx = P\,A\,dx = P\,dV$. Usando la presión externa:

$$\delta W = P_{ext}\,dV \qquad\Longrightarrow\qquad W = \int_{V_i}^{V_f} P_{ext}(V)\,dV$$

donde $P_{ext}$ es la presión externa y $P_{ext}(V)$ **depende del proceso**. Dos casos:

- **Proceso irreversible** con $P_{ext} = \text{cte}$: $\;W = P_{ext}\displaystyle\int_{V_i}^{V_f} dV = P_{ext}\,(V_f - V_i)$.
- **Proceso reversible**: $\;P_{ext} = P_{gas}$ (la presión del sistema, que va cambiando según el proceso).

## Funciones y variables de estado

> **Función de estado.** Magnitud física macroscópica que caracteriza el estado de un sistema en
> equilibrio. Ejemplos: la energía interna $U$ y la entropía $S$. Su variación depende solo de los
> estados inicial y final, no del camino.

> **Variable de estado.** Parámetro macroscópico que caracteriza un sistema en equilibrio: masa
> $m$, temperatura $T$, presión $P$, volumen $V$, número de moles $n$.

Las variables se clasifican en **extensivas** ($n, m, V, U, S$ — dependen del tamaño del sistema)
e **intensivas** ($P, T$ — no dependen del tamaño).

**Proceso reversible.** Es muy lento; en cada instante el sistema está casi en equilibrio con el
entorno, y mediante un cambio infinitesimal se puede invertir la dirección del proceso.

**Proceso irreversible.** Hay pérdida o disipación de energía; en cada instante el sistema no está
en equilibrio con el entorno, y no puede volver a su estado original.

## Gas ideal

> **Ecuación de estado del gas ideal.**
> $$P\,V = n\,R\,T$$
> donde $P$ es la presión, $V$ el volumen, $n$ los moles, $T$ la temperatura absoluta y $R$ la
> constante de los gases: $R = 0{,}082\ \dfrac{\text{l}\cdot\text{atm}}{\text{K}\cdot\text{mol}} = 8{,}31\ \dfrac{\text{J}}{\text{K}\cdot\text{mol}}$.

La energía cinética media de traslación de $n$ moles de gas ideal es

$$\langle E_c \rangle = \frac{3}{2}\,n\,R\,T$$

### Grados de libertad y calores específicos

La energía interna y los calores específicos dependen de los **grados de libertad** de la molécula:

| Gas ideal | Grados de libertad | Energía interna $U$ | $c_v$ | $c_p = c_v + R$ |
|---|---|---|---|---|
| Monoatómico | 3 (traslación) | $\tfrac{3}{2}nRT$ | $\tfrac{3}{2}R$ | $\tfrac{5}{2}R$ |
| Diatómico | 5 (3 traslación + 2 rotación) | $\tfrac{5}{2}nRT$ | $\tfrac{5}{2}R$ | $\tfrac{7}{2}R$ |

La relación $c_p = c_v + R$ (con $c_p > c_v$) vale para todo gas ideal: a presión constante parte
del calor se va en trabajo de expansión, así que hace falta más calor para el mismo $\Delta T$.

## Los cuatro procesos termodinámicos

Un **proceso termodinámico** es una evolución del estado de un sistema en la que varían una o más
propiedades ($P$, $V$, $T$, $U$). Para un gas ideal, los cuatro procesos básicos:

### Isocórico ($V = \text{cte}$)

Como $dV = 0$, el trabajo es nulo: $\delta W = P\,dV = 0$. Por ser gas ideal $dU = n\,c_v\,dT$, y
por la primera ley $dU = \delta Q$. Entonces todo el calor va a energía interna:

$$Q = n\,c_v\,\Delta T = \Delta U$$

### Isotérmico ($T = \text{cte}$)

Como $dT = 0$, se tiene $dU = n\,c_v\,dT = 0$: la energía interna no cambia y $Q = W$. El calor
(igual al trabajo) es

$$Q = n\,R\,T\,\ln\!\left(\frac{V_f}{V_i}\right)$$

donde $V_i$ y $V_f$ son los volúmenes inicial y final.

### Isobárico ($P = \text{cte}$)

El calor intercambiado usa el calor específico a presión constante:

$$Q = n\,c_p\,\Delta T, \qquad c_p = c_v + R$$

### Adiabático ($\delta Q = 0$)

No hay intercambio de calor. El estado sigue la curva

$$P\,V^{\gamma} = \text{cte}, \qquad \gamma = \frac{c_p}{c_v}$$

donde $\gamma$ es el **coeficiente adiabático**. Como $Q = 0$, la primera ley da $\Delta U = -W$:
todo el trabajo sale (o entra) a costa de la energía interna. El trabajo puede escribirse

$$W = \frac{P_i V_i - P_f V_f}{\gamma - 1}$$

## Procesos cíclicos

Un **proceso cíclico** es aquel en el que el sistema regresa a su estado inicial tras una serie de
transformaciones. Como $U$ es función de estado, al cerrar el ciclo su variación total es nula:

$$\Delta U = \Delta U_1 + \Delta U_2 + \Delta U_3 = 0$$

Sumando los aportes de cada tramo, $Q = Q_1 + Q_2 + Q_3$ y $W = W_1 + W_2 + W_3$. Por la primera
ley, como $\Delta U = 0$ en el ciclo completo,

$$W = Q$$

es decir, el trabajo neto del ciclo iguala al calor neto intercambiado (el área encerrada en el
diagrama $P$–$V$).

---

## Ver también

- [[01-calorimetria]] — calor, calor específico y cambios de fase
- [[02-procesos-termicos]] — dilatación, esfuerzo térmico y conducción
- [[04-segunda-ley-entropia]] — máquinas térmicas, refrigeradores, Carnot y entropía
