---
tags: [teoria, unidad-6, rototraslacion, rodadura, energia, roce]
fuentes:
  - raw/teoricas/apuntes-2023-2c.pdf
  - raw/practicas/guia-06-rototraslacion.pdf
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Energía en la rodadura

Esta página cierra la unidad de [[06-rototraslacion/01-cinematica-rototraslacion|rototraslación]]
con el balance de energía: la energía cinética total de un cuerpo que rueda, el motivo por el cual
el roce estático de la rodadura sin deslizar no disipa energía, y qué pasa cuando sí hay
deslizamiento. Transcripción de los apuntes de la cursada 2023-2C.

## Energía cinética total

La energía cinética de un cuerpo en rototraslación es la suma de un término de **traslación** del
centro de masa y uno de **rotación** alrededor del CM:

$$K = \tfrac{1}{2} M\,v_{cm}^2 + \tfrac{1}{2} I_{cm}\,\omega^2$$

donde $M$ es la masa, $v_{cm}$ la velocidad del centro de masa, $I_{cm}$ el momento de inercia
respecto del eje por el CM y $\omega$ la velocidad angular. Escribiendo $I_{cm} = \varepsilon MR^2$
y usando la condición de rodadura sin deslizamiento $\omega = v_{cm}/R$, la energía cinética queda
en función de una sola variable:

$$K = \tfrac{1}{2} M\,v_{cm}^2\,(1 + \varepsilon)$$

El factor $(1 + \varepsilon)$ reparte la energía entre traslación y rotación: cuanto mayor es
$\varepsilon$ (masa más alejada del eje), mayor es la fracción que se va a la rotación.

## El roce estático de la rodadura no disipa energía

En la rodadura **sin deslizamiento** el roce es estático y actúa sobre el punto de contacto. Su
trabajo total es la suma del trabajo sobre la traslación y sobre la rotación:

$$W_{fr,\text{tras}} = -f_r\,\Delta x, \qquad W_{fr,\text{rot}} = f_r\,R\,\Delta\theta$$

Pero la condición de rodadura liga el desplazamiento del CM con el ángulo girado, $\Delta x = R\,\Delta\theta$.
Sumando ambos términos:

> **Proposición.** En la rodadura sin deslizamiento el trabajo neto del roce estático es nulo:
> $$W_{fr,\text{neto}} = -f_r\,\Delta x + f_r\,R\,\Delta\theta = 0 \qquad (\Delta x = R\,\Delta\theta)$$
> El roce estático **no disipa energía**; su único papel es imponer el vínculo entre rotación y
> traslación. Por eso, en rodadura sin deslizar se conserva la energía mecánica.

## Aplicación: esfera que baja un plano inclinado

Como el roce estático no trabaja, una esfera que rueda sin deslizar por un plano conserva la
energía mecánica. Igualando la energía potencial perdida con la cinética total ganada (partiendo
del reposo desde una altura $H$):

$$MgH = \tfrac{1}{2}M v^2\,(1 + \varepsilon) \;\Rightarrow\; v = \sqrt{\frac{2gH}{1 + \varepsilon}}$$

Para la esfera maciza ($\varepsilon = \tfrac{2}{5}$) esto da $v = \sqrt{2 \cdot \tfrac{5}{7}\,gH}$, el
mismo resultado que se obtiene por dinámica en
[[06-rototraslacion/02-dinamica-rodadura|dinámica de la rodadura]] (por ejemplo, $v = 10\ \text{m/s}$
para $H = 7\ \text{m}$). Nótese que la velocidad final **no depende del radio ni de la masa**, sólo
de $H$ y del coeficiente $\varepsilon$: una esfera maciza ($\varepsilon = \tfrac{2}{5}$) llega más
rápido que un aro ($\varepsilon = 1$), porque le destina menos energía a la rotación.

## Cuando sí hay deslizamiento: el roce cinético disipa

Si el cuerpo **desliza** (problemas tipo I), el roce es cinético y sí realiza trabajo neto: la
energía mecánica **no** se conserva durante la fase de deslizamiento. Para la esfera lanzada con
$v_0$ y $\omega_0 = 0$ que termina rodando con $V = \dfrac{v_0}{\varepsilon + 1}$ (ejercicio 6.4),
los apuntes cuantifican la caída relativa de la energía cinética de traslación como

$$\Delta k = \frac{1}{(\varepsilon + 1)^2} - 1 < 0$$

El resultado es negativo: parte de la energía cinética inicial se disipó por el roce cinético
mientras el punto de contacto deslizaba. Una vez alcanzada la rodadura sin deslizar, la disipación
cesa y la energía mecánica vuelve a conservarse.

**Observación.** Un cuerpo lanzado y dejado rodar sin deslizar (por ejemplo, una esfera que sale
como proyectil tras rodar por un borde) conserva su energía mecánica; el reparto entre energía de
traslación y de rotación depende de su $\varepsilon$, y esa diferencia es la que separa el
comportamiento de una esfera hueca y una maciza en un mismo experimento.

---

## Ver también

- [[06-rototraslacion/01-cinematica-rototraslacion]] — condición de rodadura $v_{cm} = \omega R$
- [[06-rototraslacion/02-dinamica-rodadura]] — de dónde sale $V = v_0/(\varepsilon+1)$ y la esfera en el plano
- [[04-colisiones/01-impulso-cantidad-movimiento]] — energía y cantidad de movimiento en el cuerpo rígido
