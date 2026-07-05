---
tags: [teoria, unidad-2, oscilaciones-amortiguadas, subamortiguado, critico, sobreamortiguado]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica + práctica)
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Oscilaciones amortiguadas: los tres regímenes

Cuando al oscilador masa-resorte se le agrega una fuerza de rozamiento viscoso (proporcional a
la velocidad y opuesta a ella), la amplitud deja de ser constante y el sistema pierde energía.
Según cuánto pese el rozamiento frente a la frecuencia propia, el movimiento cae en uno de tres
regímenes: **sobreamortiguado**, **críticamente amortiguado** o **subamortiguado**. Esta página
plantea la ecuación de movimiento y resuelve los tres casos; la [[02-energia-y-factor-q|energía y
el factor de calidad]] se tratan aparte.

## La ecuación del oscilador amortiguado

El modelo es la misma masa unida a un resorte, pero ahora dentro de un **medio viscoso**. Sobre
la masa actúan dos fuerzas: la elástica $F_e = -k\,\Delta x$ y la viscosa $F_v = -b\,\dot{x}$,
esta última siempre opuesta a la velocidad. La segunda ley de Newton da

$$-k\,(x - l_0) - b\,\dot{x} = m\,\ddot{x}$$

donde $l_0$ es la posición de equilibrio (longitud natural). Reordenando y dividiendo por $m$:

$$\ddot{x} + \frac{b}{m}\,\dot{x} + \frac{k}{m}\,x = \frac{k\,l_0}{m}$$

Conviene nombrar dos parámetros que resumen el sistema:

$$\gamma = \frac{b}{2m}, \qquad \omega_0 = \sqrt{\frac{k}{m}}$$

donde $\gamma$ es el **coeficiente de amortiguamiento** (mide la fricción, con $b$ la constante
del medio viscoso) y $\omega_0$ es la **frecuencia natural** del oscilador sin fricción. Con esta
notación la ecuación homogénea asociada queda $\ddot{x} + 2\gamma\,\dot{x} + \omega_0^2\,x = 0$.

## Resolución de la ecuación diferencial

La solución completa se escribe como suma de una particular y una homogénea, $x(t) = x_h(t) + x_p(t)$.

La **solución particular** es constante, $x_p(t) = l_0$: representa el reposo en la posición de
equilibrio hacia la que el sistema tiende.

Para la **solución homogénea** se propone una exponencial $x_h(t) = C\,e^{rt}$, con lo cual
$\dot{x}_h = r\,C\,e^{rt}$ y $\ddot{x}_h = r^2\,C\,e^{rt}$. Reemplazando en la homogénea:

$$\left(r^2 + 2\gamma\,r + \omega_0^2\right) C\,e^{rt} = 0$$

Como $e^{rt} \neq 0$, se anula el paréntesis (la **ecuación característica**) y se despeja $r$:

$$r = -\gamma \pm \sqrt{\gamma^2 - \omega_0^2}$$

El signo del radicando decide todo. Se distinguen tres casos:

- Si $\gamma > \omega_0$, el radicando es positivo y $r$ es **real** (dos raíces reales).
- Si $\gamma = \omega_0$, el radicando se anula y hay una **raíz doble**.
- Si $\gamma < \omega_0$, el radicando es negativo y $r$ es **complejo**.

## Régimen sobreamortiguado ($\gamma > \omega_0$)

Con dos raíces reales negativas, la solución es una combinación de dos exponenciales
decrecientes:

$$x(t) = e^{-\gamma t}\left(C_1\,e^{\sqrt{\gamma^2 - \omega_0^2}\;t} + C_2\,e^{-\sqrt{\gamma^2 - \omega_0^2}\;t}\right)$$

donde $C_1$ y $C_2$ se fijan con las condiciones iniciales. El sistema **no oscila**: la masa
regresa al equilibrio de forma monótona (o a lo sumo cruzando una vez el cero, según el signo de
la velocidad inicial), sin dar vueltas alrededor de él. Es el caso de fricción dominante.

## Régimen críticamente amortiguado ($\gamma = \omega_0$)

En el límite $\gamma = \omega_0$ la raíz es doble y la solución toma la forma

$$x(t) = (C_1 + C_2\,t)\,e^{-\gamma t}$$

Tampoco **oscila**, pero es el caso que **decae a cero más rápido** que cualquier otro: separa
la frontera entre oscilar y no oscilar. Es el amortiguamiento óptimo cuando se quiere frenar un
sistema en el menor tiempo posible sin que rebote.

## Régimen subamortiguado ($\gamma < \omega_0$)

Cuando la fricción es débil ($\gamma < \omega_0$), el radicando es negativo y la raíz se vuelve
imaginaria. Escribiendo $\sqrt{\gamma^2 - \omega_0^2} = \sqrt{-1}\,\sqrt{\omega_0^2 - \gamma^2}
= i\,\omega'$, aparece una nueva frecuencia:

$$\omega' = \sqrt{\omega_0^2 - \gamma^2}$$

llamada **frecuencia de amortiguamiento**. Siempre es menor que $\omega_0$: la fricción hace más
lenta la oscilación. La solución real resultante es una oscilación cuya amplitud decae en el tiempo:

> **Ecuación del oscilador subamortiguado.** El desplazamiento es
> $$x(t) = A\,e^{-\gamma t}\cos(\omega' t + \varphi_0) + l_0$$
> donde $A$ y $\varphi_0$ salen de las condiciones iniciales, $\omega' = \sqrt{\omega_0^2 - \gamma^2}$
> es la frecuencia de amortiguamiento y $l_0$ la posición de equilibrio.

### Envolvente y pseudoperíodo

El factor $A\,e^{-\gamma t}$ actúa como **envolvente**: la oscilación queda encerrada entre las
curvas $\pm A\,e^{-\gamma t}$, que marcan cómo se apaga la amplitud. El coseno oscila dentro de
esa envolvente decreciente.

Aunque la amplitud disminuye con el tiempo, la frecuencia $\omega'$ **permanece constante**. Por
lo tanto el tiempo que tarda la masa en volver a pasar por un "mismo" punto de referencia también
es constante, y se define el **pseudoperíodo**:

$$T' = \frac{2\pi}{\omega'}$$

Se lo llama *pseudo* período porque, en rigor, el movimiento no es periódico: la masa no vuelve
exactamente al mismo estado (la amplitud ya decayó), pero el intervalo entre pasos sucesivos por
la posición de equilibrio sí se repite.

## Comparación de los tres regímenes

| Régimen | Condición | Solución | ¿Oscila? |
|---|---|---|---|
| Sobreamortiguado | $\gamma > \omega_0$ | $e^{-\gamma t}\big(C_1 e^{\sqrt{\gamma^2 - \omega_0^2}\,t} + C_2 e^{-\sqrt{\gamma^2 - \omega_0^2}\,t}\big)$ | No |
| Crítico | $\gamma = \omega_0$ | $(C_1 + C_2\,t)\,e^{-\gamma t}$ | No (decae más rápido) |
| Subamortiguado | $\gamma < \omega_0$ | $A\,e^{-\gamma t}\cos(\omega' t + \varphi_0) + l_0$ | Sí, con envolvente $\pm A e^{-\gamma t}$ |

**Observación.** La distinción entre los tres regímenes también se lee a través del factor de
calidad $Q$: $Q < \tfrac12$ sobreamortiguado, $Q = \tfrac12$ crítico, $Q > \tfrac12$
subamortiguado. Ver [[02-energia-y-factor-q]].

---

## Ver también

- [[02-energia-y-factor-q]] — energía disipada, tiempo característico y factor de calidad $Q$
- [[01-mas/01-oscilador-armonico]] — el oscilador sin fricción, caso límite $\gamma = 0$
