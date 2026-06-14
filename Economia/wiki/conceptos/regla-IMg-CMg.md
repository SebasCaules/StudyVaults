---
tags: [unit-02, micro, concepto-central]
---

## Definición

**Regla de optimización universal**: para *cualquier* estructura de mercado, la empresa maximiza beneficios produciendo la cantidad $Q^*$ donde el **ingreso marginal iguala al costo marginal**:

$$\boxed{IMg = CMg}$$

Donde:
- $IMg$: ingreso marginal (variación del ingreso por la unidad adicional)
- $CMg$: costo marginal (variación del costo por la unidad adicional)

Es la aplicación directa del [[analisis-marginal]] al problema de la empresa.

## Justificación

El beneficio es $\pi(Q) = I(Q) - C(Q)$. La condición de máximo:

$$\frac{d\pi}{dQ} = 0 \Rightarrow IMg - CMg = 0 \Rightarrow IMg = CMg$$

Donde:
- $\pi$: beneficio económico
- $I(Q)$: ingreso total como función de la cantidad
- $C(Q)$: costo total como función de la cantidad
- $Q$: cantidad producida

Y la condición de segundo orden requiere que $CMg$ corte al $IMg$ "desde abajo" (que el $CMg$ esté creciendo más rápido).

## Aplicaciones por estructura

| Estructura | Demanda | $IMg$ | Regla óptima |
|---|---|---|---|
| **Competencia perfecta** | Horizontal | $IMg = P$ | $P = CMg$ |
| **Monopolio** | Decreciente | $IMg < P$ | $IMg = CMg$, con $P > CMg$ |
| **Oligopolio** | Decreciente (estratégica) | Depende del modelo | $IMg = CMg$ |
| **Competencia monopolística** | Decreciente | $IMg < P$ | $IMg = CMg$ |

## Intuición / Por qué importa

Es la **piedra angular** del módulo de microeconomía. Lo que cambia entre estructuras es **cómo se calcula el $IMg$**, no la regla. Si entendés esto, entendés por qué:
- En CP el monopolista cobra más caro y produce menos: porque su $IMg < P$, así que iguala $CMg$ a un $IMg$ menor.
- El **Índice de Lerner** $L = (P - CMg)/P = 1/|\eta|$ surge de la misma ecuación.

## Ejemplo

**Caso CP:** $P = 10$, $C(Q) = Q^2$. Entonces $IMg = 10$, $CMg = 2Q$. Igualando: $Q^* = 5$.

**Caso monopolio:** $P = 100 - 2Q$, $C(Q) = Q^2$. $IMg = 100 - 4Q$, $CMg = 2Q$. Igualando: $100 - 4Q = 2Q \Rightarrow Q^* = 16.67$, $P^* = 66.67$.

Notar que en monopolio $P^* > CMg(Q^*)$: hay margen de monopolio.

## Errores comunes / Distinciones

- En CP, "regla $P = CMg$" es **un caso particular** de $IMg = CMg$ — no es regla diferente.
- Si solo se cumple $IMg = CMg$ pero $\pi < 0$: hay que comparar contra cerrar (en CP) o salir (en LP).
- En CP, hay que verificar que $P \geq CVMe_{min}$ (sino, [[punto-cierre|punto de cierre]]).
- La regla solo da máximo si $CMg$ corta al $IMg$ "desde abajo".

## Relacionado con
- [[ingreso-marginal]]
- [[costo-marginal]]
- [[beneficio-economico]]
- [[analisis-marginal]]
- [[curvas-costos]]
- [[punto-cierre]]
