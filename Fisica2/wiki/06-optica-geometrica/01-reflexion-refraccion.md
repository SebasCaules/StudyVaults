---
tags: [teoria, unidad-6, optica-geometrica, reflexion, refraccion, snell, indice-de-refraccion]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica)
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Reflexión y refracción

La óptica geométrica describe la luz como **rayos** que se propagan en línea recta y que,
al llegar a la separación entre dos medios, se **reflejan** y se **refractan**. Esta página
reúne los postulados del modelo de rayos, la velocidad de la luz y el índice de refracción, y
las dos leyes que gobiernan lo que pasa en una interfaz: la ley de reflexión y la ley de Snell.

## Postulados del modelo de rayos

El curso arranca la óptica con un puñado de postulados que fijan qué es un rayo y cómo se ve un
objeto:

- La luz se propaga en línea recta mediante haces o rayos.
- Por un punto del espacio pueden pasar infinitos rayos, con cualquier dirección y sentido.
- Una fuente puntual de luz (ideal) emite rayos en todas las direcciones.
- Una fuente real se comporta como puntual si está lo suficientemente alejada.
- Un punto de un objeto opaco puede reflejar luz que llega desde cualquier dirección.
- Para ver con claridad un punto de un objeto que no emite luz, es necesario que los rayos
  reflejados por él **converjan** en un punto de la retina.

## Velocidad de la luz e índice de refracción

En el vacío la luz viaja a una velocidad fija; dentro de un medio material se propaga más
despacio. Esa reducción de velocidad es lo que caracteriza ópticamente al medio.

> **Velocidad de la luz.** En el vacío vale
> $$c = 3\times 10^{8}\ \tfrac{\text{m}}{\text{s}}$$

> **Dioptrio.** Superficie que separa dos medios en los cuales la luz se propaga a distinta
> velocidad.

> **Índice de refracción.** Es el cociente entre la velocidad de la luz en el vacío y la
> velocidad en el medio:
> $$n = \frac{c}{v}$$
> donde $c$ es la velocidad en el vacío y $v$ la velocidad de la luz en el medio. Mide el índice
> de refracción del medio respecto del vacío.

Como en cualquier medio material $v < c$, siempre resulta $n > 1$: si fuera $n < 1$ se tendría
$v > c$, lo cual es absurdo. Para el vacío (y, con muy buena aproximación, para el aire) es

$$n_{\text{vacío}} = 1 = n_{\text{aire}}$$

### Longitud de onda en el medio

La frecuencia de la luz no cambia al pasar de un medio a otro, pero sí lo hace la longitud de
onda: al bajar la velocidad, la longitud de onda se acorta en el mismo factor $n$.

$$\lambda = \frac{\lambda_0}{n}$$

donde $\lambda_0$ es la longitud de onda de la luz **en el vacío** y $\lambda$ la longitud de
onda dentro del medio de índice $n$.

## Leyes de la reflexión y la refracción

Cuando un rayo incidente llega a un dioptrio, se separa en un rayo reflejado (vuelve al medio de
partida) y un rayo refractado (pasa al segundo medio). Todos los ángulos se miden respecto de la
**normal** a la superficie en el punto de incidencia.

- **Rayo incidente**, ángulo de incidencia $\theta_i$.
- **Rayo reflejado**, ángulo de reflexión $\theta_i'$.
- **Rayo refractado**, ángulo de refracción $\theta_t$.

> **Ley de reflexión.** El ángulo de reflexión es igual al de incidencia, del lado opuesto de
> la normal:
> $$\theta_i = -\theta_i'$$

> **Ley de Snell.** En la refracción, el producto del índice por el seno del ángulo se conserva
> al cruzar la interfaz:
> $$n_i\,\sin\theta_i = n_t\,\sin\theta_t$$
> donde $n_i$ es el índice del medio de incidencia, $n_t$ el del medio de transmisión, y
> $\theta_i$, $\theta_t$ los ángulos de incidencia y refracción medidos desde la normal.

### Cómo se desvía el rayo refractado

El signo del cambio de índice determina si el rayo refractado se **acerca** o se **aleja** de la
normal:

| Caso | Relación de índices | Ángulo de refracción | Efecto |
|---|---|---|---|
| Hacia un medio más "denso" | $n_i < n_t$ | $\theta_t < \theta_i$ | el rayo se **acerca** a la normal |
| Hacia un medio menos "denso" | $n_i > n_t$ | $\theta_t > \theta_i$ | el rayo se **aleja** de la normal |

**Observación.** El caso $n_i > n_t$ (el rayo pasa a un medio de menor índice y se aleja de la
normal) es el que abre la puerta a la [[02-reflexion-total-interna|reflexión total interna]]:
si el ángulo de incidencia crece lo suficiente, el rayo refractado deja de existir.

---

## Ver también

- [[02-reflexion-total-interna]] — el ángulo crítico y qué pasa cuando $n_i > n_t$
- [[03-dioptrios-esfericos]] — refracción en superficies curvas y formación de imágenes
- [[07-interferencia/01-fundamentos-interferencia]] — la longitud de onda en el medio $\lambda = \lambda_0/n$ reaparece en la interferencia
