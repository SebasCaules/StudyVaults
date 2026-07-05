---
tags: [teoria, unidad-6, rototraslacion, rodadura, roce, plano-inclinado]
fuentes:
  - raw/teoricas/apuntes-2023-2c.pdf
  - raw/practicas/guia-06-rototraslacion.pdf
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Dinámica de la rodadura: problemas tipo I y tipo II

Con la cinemática de la [[06-rototraslacion/01-cinematica-rototraslacion|rototraslación]] ya
armada, esta página plantea la dinámica. Todo problema de rodadura combina dos ecuaciones —la de
traslación y la de rotación— y se agrupa en dos tipos según el rol del roce. Transcripción de los
apuntes de la cursada 2023-2C.

## Las dos ecuaciones de la rototraslación

Todo cuerpo que rueda cumple simultáneamente la segunda ley para el centro de masa y la ecuación
de rotación respecto de un eje por el CM:

$$\sum \vec{F}_{ext} = M\,\vec{a}_{cm}, \qquad \sum \vec{M}_{cm} = I_{cm}\,\vec{\alpha}$$

donde $M$ es la masa, $\vec{a}_{cm}$ la aceleración del centro de masa, $I_{cm}$ el momento de
inercia respecto del eje por el CM y $\vec{\alpha}$ la aceleración angular. Es cómodo escribir el
momento de inercia como

$$I_{cm} = \varepsilon\,M R^2$$

con $\varepsilon$ un coeficiente adimensional que depende de la geometría: $\varepsilon = \tfrac{2}{5}$
para la esfera maciza, $\varepsilon = \tfrac{1}{2}$ para el cilindro o disco y $\varepsilon = 1$ para
el aro. La incógnita repetida es la **fuerza de roce en el contacto**, cuyo carácter (cinético o
estático) distingue los dos tipos de problema.

## Problemas tipo I — hay deslizamiento (roce cinético)

Se parte de un estado con $v_{A0} \neq 0$: el punto de contacto **desliza**, de modo que actúa
**roce cinético**, cuyo sentido es contrario al de la velocidad del punto de contacto. La
estrategia es:

1. Con $\sum \vec{F} = M\vec{a}_{cm}$ obtener $a_{cm} = \pm\,\mu_c g$ (constante).
2. Con $\sum \vec{M}_{cm} = I_{cm}\alpha$ obtener $\alpha$ (constante).
3. Escribir las ecuaciones horarias $v_{cm}(t) = v_0 + a_{cm}\,t$ y $\omega(t) = \omega_0 + \alpha\,t$.
4. Esas ecuaciones valen **hasta que la velocidad del punto de contacto se anula** ($v_A = 0$). En
   ese instante se alcanza la condición de rodadura $v_{cm} = \omega R$ y, a partir de ahí, el
   cuerpo rueda sin deslizar.

### Ejemplo: esfera lanzada sin girar

Una esfera maciza ($I_{cm} = \tfrac{2}{5}MR^2$, es decir $\varepsilon = \tfrac{2}{5}$) de radio
$R = 4\ \text{cm}$ se lanza con $v_0 = 3\ \text{m/s}$ y $\omega_0 = 0$, con $\mu_c = 0.2$ y
$g = 10\ \text{m/s}^2$. Como $v_A = v_0 - \omega_0 R = 3\ \text{m/s} > 0$, la esfera **patina**
(avanza más de lo que gira) y el roce apunta hacia atrás. Planteando las ecuaciones:

$$-\mu_c M g = M\,a_{cm} \;\Rightarrow\; a_{cm} = -\mu_c g = -2\ \text{m/s}^2 \;\Rightarrow\; v_{cm}(t) = 3 - 2\,t$$

$$\mu_c M g\,R = \tfrac{2}{5}MR^2\,\alpha \;\Rightarrow\; \alpha = \frac{5\,\mu_c g}{2R} = 125\ \text{rad/s}^2 \;\Rightarrow\; \omega(t) = 125\,t$$

El roce frena la traslación y acelera la rotación. La rodadura empieza cuando $v_{cm} = \omega R$:

$$3 - 2\,t_r = (125\,t_r)(0.04) = 5\,t_r \;\Rightarrow\; 3 = 7\,t_r \;\Rightarrow\; t_r = \tfrac{3}{7}\ \text{s} \approx 0.43\ \text{s}$$

### Caso general: velocidad al iniciar la rodadura (ejercicio 6.4)

Repitiendo el planteo para una geometría cualquiera $I_{cm} = \varepsilon MR^2$, con $v_0 > 0$ y
$\omega_0 = 0$ (patina), se obtiene $a_{cm} = -\mu_c g$ y $\alpha = \dfrac{\mu_c g}{\varepsilon R}$.
Imponiendo $v_{cm} = \omega R$ en el instante $t_r$ resulta $v_0 = \mu_c g\,t_r\!\left(1 + \tfrac{1}{\varepsilon}\right)$,
y la velocidad del CM al comenzar a rodar sin deslizar es notablemente simple:

$$V = \frac{v_0}{\varepsilon + 1}$$

donde $v_0$ es la velocidad inicial y $\varepsilon$ el coeficiente de inercia. Para una esfera
maciza ($\varepsilon = \tfrac{2}{5}$) queda $V = \tfrac{5}{7}v_0$: parte de la energía cinética se
disipó durante la fase de deslizamiento (ver [[06-rototraslacion/03-energia-rodadura|energía en la rodadura]]).

## Problemas tipo II — no hay deslizamiento (roce estático)

Se parte del reposo ($v_{A0} = 0$) y se aplica una fuerza (o torque) para iniciar el movimiento.
El objetivo es **hallar las condiciones para que el cuerpo ruede sin deslizar**. Las claves:

- La fuerza responsable de que el objeto ruede sin deslizar es el **roce estático**.
- El valor máximo del roce estático es $f_{s,\max} = \mu_e N$.
- Su dirección es **paralela al plano de apoyo**.
- Su sentido es el necesario para lograr que el punto de contacto no deslice (se determina
  resolviendo, no se supone de antemano).

La estrategia es plantear las dos ecuaciones dinámicas más el vínculo $a_{cm} = \alpha R$, despejar
$a_{cm}$ y la fuerza de roce necesaria, y **verificar** que $|f_r| \le \mu_e N$; si se cumple, la
hipótesis de rodadura sin deslizar es válida.

### Ejemplo: esfera que rueda por un plano inclinado

Una esfera maciza ($I_{cm} = \tfrac{2}{5}MR^2$) de $M = 2\ \text{kg}$ baja rodando **sin deslizar**
un plano inclinado de ángulo $\theta = 40^\circ$ desde una altura $H = 7\ \text{m}$, con
$\mu_e = 0.3$. Tomando el sentido de bajada como positivo y una fuerza de roce $f_r$ paralela al
plano:

$$Mg\sin\theta + f_r = M\,a_{cm} \quad (1) \qquad -f_r\,R = \tfrac{2}{5}MR^2\,\alpha \quad (2) \qquad a_{cm} = \alpha R \quad (3)$$

Combinando las tres ecuaciones se cancela el roce y aparece la aceleración del centro de masa:

$$a_{cm} = \tfrac{5}{7}\,g\sin\theta \approx 4.6\ \text{m/s}^2$$

La velocidad en la base se obtiene con la cinemática por el plano ($\Delta x = H/\sin\theta$):

$$v = \sqrt{2\,a_{cm}\,\frac{H}{\sin\theta}} = \sqrt{2 \cdot \tfrac{5}{7}\,g\,H} = 10\ \text{m/s}$$

Despejando el roce de la ecuación (1):

$$f_r = \tfrac{5}{7}Mg\sin\theta - Mg\sin\theta = -\tfrac{2}{7}Mg\sin\theta \approx -3.7\ \text{N}$$

El signo negativo indica que el roce apunta **al revés** del sentido supuesto en el dibujo. Falta
comprobar que ese roce es alcanzable con roce estático:

$$f_{r,\max} = \mu_e N = \mu_e\,Mg\cos\theta \approx 4.6\ \text{N}$$

Como $|f_r| \approx 3.7\ \text{N} \le f_{r,\max} \approx 4.6\ \text{N}$, la condición se cumple: la
esfera efectivamente rueda sin deslizar.

### Torque máximo para no deslizar (ejercicio 6.10)

En una rueda inicialmente en reposo a la que se aplica un torque $M_{ap}$, el mismo esquema (dos
ecuaciones dinámicas + vínculo, con $f_r = \mu_e N$ en el límite) da el torque máximo que admite
la rodadura sin deslizar:

$$M_{ap,\max} = \mu_e\,M g\,R\,(\varepsilon + 1)$$

Si el torque aplicado supera este valor, el roce estático no alcanza y la rueda empieza a patinar.

---

## Ver también

- [[06-rototraslacion/01-cinematica-rototraslacion]] — relación de velocidades y condición de rodadura
- [[06-rototraslacion/03-energia-rodadura]] — por qué el roce estático no disipa energía
- [[02-dinamica/01-leyes-de-newton-vinculos-poleas]] — roce estático y cinético, plano inclinado
