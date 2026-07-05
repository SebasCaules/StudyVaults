---
tags: [teoria, unidad-8, difraccion, rendija-simple, fraunhofer]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica)
unidad: 8
tipo: teoria
actualizado: 2026-07-05
---

# Difracción por una rendija

La **difracción** es el ensanchamiento de un haz de luz al atravesar una abertura o
bordear un obstáculo cuyo tamaño es comparable a la longitud de onda. En el límite
opuesto, cuando la longitud de onda es mucho menor que la abertura, la luz se comporta
como en la óptica geométrica: viaja en línea recta y proyecta una sombra nítida. Esta
página estudia la rendija única en la aproximación de Fraunhofer (pantalla lejana).

## Principio de Huygens–Fresnel

El punto de partida es el principio que permite tratar cada abertura como un conjunto de
emisores secundarios.

> **Principio de Huygens–Fresnel.** Todo punto de un frente de onda funciona como una
> fuente de nuevas ondas esféricas secundarias de igual frecuencia que la inicial. La
> forma del nuevo frente de onda está formada por la tangente (la envolvente) de estos
> frentes de onda secundarios.

Con este principio, la rendija de ancho $a$ deja de ser una simple abertura: se piensa
como una sucesión continua de fuentes puntuales, cada una emitiendo hacia la pantalla. El
patrón observado es el resultado de **interferir** todas esas ondas secundarias entre sí.

## Suma de las ondas secundarias

Se toma el eje $y'$ a lo largo de la rendija, con origen en su centro. La onda que sale
del punto $y' = 0$ hacia un ángulo $\theta$ se escribe, en notación compleja
($e^{ix} = \cos x + i\sin x$), como

$$dE_C = A\,e^{i(kr - \omega t)}\,dy'$$

donde $A$ es la amplitud por unidad de longitud de la rendija, $k = 2\pi/\lambda$ el número
de onda, $r$ la distancia a la pantalla y $\omega$ la frecuencia angular. La onda que sale
de un punto genérico $y'$ recorre una distancia distinta: en la aproximación de Fraunhofer
los rayos salen paralelos y la diferencia de camino respecto del centro es

$$\Delta r = y'\sin\theta \qquad\Rightarrow\qquad r' = r + \Delta r = r + y'\sin\theta$$

de modo que su contribución es $dE_C = A\,e^{i(kr' - \omega t)}\,dy'$. Integrando todas las
fuentes secundarias a lo largo del ancho $a$ y tomando el módulo al cuadrado se obtiene la
intensidad. El resultado se compacta definiendo la variable de fase $\beta$.

> **Variable de fase de la rendija.** Mide, en radianes, el desfasaje acumulado de un
> borde de la rendija al otro:
> $$\beta = \frac{k\,a\sin\theta}{2} = \frac{\pi a}{\lambda_0}\,n\sin\theta$$
> donde $a$ es el ancho de la rendija, $\theta$ el ángulo de observación, $\lambda_0$ la
> longitud de onda en vacío y $n$ el índice del medio. Para $n = 1$ queda
> $\beta = \dfrac{\pi a}{\lambda}\sin\theta$.

## Intensidad del patrón

> **Intensidad de difracción por una rendija.** La intensidad en la pantalla en función del
> ángulo es
> $$I_R = I_0\left(\frac{\sin\beta}{\beta}\right)^{2}$$
> donde $I_0$ es la intensidad en el centro del patrón ($\theta = 0$) y $\beta$ la variable
> de fase definida arriba.

El factor $\left(\dfrac{\sin\beta}{\beta}\right)^2$ es la función *sinc* al cuadrado: una
campana central intensa flanqueada por campanas secundarias mucho más débiles.

### Mínimos

Los mínimos (intensidad nula) aparecen donde $\sin\beta = 0$ pero $\beta \neq 0$:

$$\sin\beta = 0 \;\Rightarrow\; \beta = p\pi, \qquad p \in \mathbb{Z},\; p \neq 0$$

donde $p$ es el **número (u orden) del mínimo de difracción**. El caso $p = 0$ queda
excluido porque ahí está el máximo central.

### Máximo principal

En $\beta = 0$ (es decir $\theta = 0$) el cociente es indeterminado, pero su límite vale $1$:

$$\lim_{\beta \to 0}\frac{\sin\beta}{\beta} = 1 \;\Rightarrow\; I_R = I_0$$

Es el **máximo principal**, la campana central del patrón, centrada en la dirección de
incidencia.

### Máximos secundarios

Entre mínimo y mínimo hay campanas secundarias. Sus posiciones se hallan anulando la
derivada de la intensidad:

$$\frac{\partial}{\partial\beta}\frac{\sin\beta}{\beta} = 0
\;\Rightarrow\; \frac{\sin\beta - \beta\cos\beta}{\beta^{2}} = 0
\;\Rightarrow\; \tan\beta = \beta$$

Esta ecuación trascendente no cae exactamente sobre múltiplos de $\pi$; sus soluciones y la
intensidad relativa correspondiente se resumen en la tabla (que reproduce la del apunte):

| $\beta$ | $I_R / I_0$ | Tipo |
|---|---|---|
| $0$ | $1$ | Máximo (principal) |
| $\pi$ | $0$ | Mínimo |
| $1{,}4303\,\pi$ | $0{,}047$ | Máximo secundario |
| $2\pi$ | $0$ | Mínimo |
| $2{,}4590\,\pi$ | $0{,}016$ | Máximo secundario |
| $3\pi$ | $0$ | Mínimo |
| $3{,}4707\,\pi$ | $0{,}008$ | Máximo secundario |
| $4\pi$ | $0$ | Mínimo |

El primer máximo secundario tiene apenas el $4{,}7\%$ de la intensidad central, y decaen
rápido: casi toda la luz se concentra en la campana principal.

## Ancho de la campana principal

El ancho angular del máximo central se mide entre sus dos primeros mínimos ($\beta = \pm\pi$).
Para ángulos chicos, $\sin\theta_1 \approx \theta_1$, y de $\beta = \pi$ se despeja

$$\frac{\pi a}{\lambda}\sin\theta_1 = \pi \;\Rightarrow\; \sin\theta_1 = \frac{\lambda}{a}
\;\Rightarrow\; \theta_1 \approx \frac{\lambda}{a}$$

El semiángulo hasta el primer mínimo es $\theta_1 \approx \lambda/a$, con lo que el **ancho
angular total** de la campana principal es

$$\theta_D \approx \frac{2\lambda}{a}$$

**Observación.** La campana se ensancha cuando la rendija se angosta (a menor $a$, mayor
$\theta_D$): cuanto más se cierra la abertura, más se abre el haz. Es el sello de la
difracción.

## Límites: óptica geométrica y fuente puntual

La relación entre $\lambda$ y $a$ fija los dos regímenes extremos:

- **$\lambda \ll a$ (límite de la óptica geométrica).** La campana es angostísima: la luz
  prácticamente atraviesa recta y en la pantalla se ve la **imagen de la rendija** con
  bordes definidos.
- **$\lambda \gg a$ (fuente puntual).** La rendija se comporta como una **fuente puntual**
  que emite una onda esférica: la luz se abre en todas las direcciones y la pantalla se
  ilumina de forma casi uniforme.

---

## Ver también

- [[02-redes-de-difraccion]] — muchas rendijas: la envolvente $(\sin\beta/\beta)^2$ modula los máximos de la red
- [[03-criterio-de-rayleigh]] — el ancho $\theta_D$ de la campana fija el límite de resolución
