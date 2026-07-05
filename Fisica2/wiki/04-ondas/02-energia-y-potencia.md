---
tags: [teoria, unidad-4, ondas, energia, potencia]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica)
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Energía y potencia de una onda propagante

Una onda transporta energía sin transportar masa. En una cuerda, cada elemento tiene energía
cinética (por su movimiento transversal) y energía potencial (por el estiramiento al
deformarse). Esta página deriva las densidades de energía, muestra que ambas coinciden, y
calcula la potencia que la onda transmite. Se trabaja con la [[01-ondas-propagantes|onda
armónica propagante]] $y(x, t) = A\cos(kx \pm \omega t + \varphi_0)$.

## Densidad de energía cinética

Un elemento de cuerda de masa $\Delta m = \mu\,\Delta x$ que se mueve con velocidad
transversal $v_y = \partial y/\partial t$ tiene energía cinética $\tfrac12\,\Delta m\,v_y^2$:

$$\Delta E_c = \frac{1}{2}\,\mu\,\Delta x\,\big(A\omega\sin(kx \pm \omega t + \varphi_0)\big)^2$$

La **densidad de energía cinética** es la energía cinética por unidad de longitud, es decir el
límite del cociente cuando el elemento se hace infinitesimal:

$$u_c = \lim_{\Delta x \to 0}\frac{\Delta E_c}{\Delta x} = \frac{1}{2}\,\mu\left(\frac{\partial y}{\partial t}\right)^2$$

donde $\mu$ es la densidad lineal de masa y $\partial y/\partial t$ la velocidad transversal
del elemento.

## Densidad de energía potencial

La energía potencial proviene del trabajo que cuesta estirar el elemento de cuerda al
deformarse; depende de la pendiente $\partial y/\partial x$:

$$\Delta E_p = \frac{1}{2}\,F\left(\frac{\Delta y}{\Delta x}\right)^2\,\Delta x$$

y su **densidad** por unidad de longitud es

$$u_p = \lim_{\Delta x \to 0}\frac{\Delta E_p}{\Delta x} = \frac{1}{2}\,F\left(\frac{\partial y}{\partial x}\right)^2$$

donde $F$ es la tensión de la cuerda y $\partial y/\partial x$ la pendiente local.

## Igualdad de las densidades

> **Proposición.** En una onda propagante, la densidad de energía cinética y la potencial son
> **iguales en todo punto e instante**:
> $$u_c = u_p$$

Para verlo, se usa que $v = \sqrt{F/\mu}$ implica $\omega^2\mu = F k^2$ (partiendo de
$\omega = kv$). Evaluando $u_c$ y $u_p$ sobre la onda armónica, ambas quedan proporcionales a
$\sin^2(kx \pm \omega t + \varphi_0)$ con el mismo coeficiente, de donde $u_c = u_p$.

En consecuencia, la **densidad de energía mecánica** total $u_E = u_c + u_p$ resulta

$$u_E(x, t) = \mu\,\omega^2 A^2\sin^2(kx \pm \omega t + \varphi_0)$$

donde $\mu$ es la densidad lineal, $\omega$ la frecuencia angular y $A$ la amplitud.

### Máximos y mínimos de energía

Como la densidad va con $\sin^2$, la energía **no** está donde la cuerda tiene su mayor
desplazamiento, sino al revés. Analizando cada elemento de cuerda:

- **En la cresta** (máximo desplazamiento, punto de retorno): la pendiente es nula, entonces
  $u_p = 0$; y la velocidad transversal es cero (el elemento invierte su marcha), entonces
  $u_c = 0$. La energía es **mínima** (nula).
- **En el cruce por cero** (elongación nula): la pendiente es máxima, entonces $u_p$ es
  máxima; y la velocidad transversal es máxima, entonces $u_c$ es máxima. La energía es
  **máxima**.

> **Observación.** Es el comportamiento opuesto al de un oscilador aislado. Aquí la energía de
> un elemento no se conserva: la onda va cediendo energía al elemento vecino a medida que
> avanza, y por eso $u_c$ y $u_p$ oscilan **en fase** (ambas máximas o ambas nulas a la vez).

## Potencia transmitida

La onda transmite energía a lo largo de la cuerda. La **potencia instantánea** es la energía
que atraviesa un punto por unidad de tiempo. Como en un tiempo $\Delta t$ la onda avanza
$\Delta x = v\,\Delta t$, la energía que pasa es $u_E\,\Delta x$:

$$P = \frac{\Delta E}{\Delta t} = u_E\,\frac{\Delta x}{\Delta t} \xrightarrow{\;\Delta x \to 0\;} u_E\,v$$

lo que da

$$P(x, t) = \mu\,\omega^2 A^2\sin^2(kx \pm \omega t + \varphi_0)\,v$$

donde se ve que la potencia instantánea **depende del tiempo** (oscila con $\sin^2$).

### Potencia media por ciclo

Como interesa el flujo promedio de energía, se toma el promedio de $P$ sobre un período. El
valor medio de $\sin^2$ a lo largo de un ciclo es $\tfrac12$:

$$\langle P(x, t)\rangle = \mu\,\omega^2 A^2\,v\,\frac{1}{T}\int_0^T \sin^2(kx \pm \omega t + \varphi_0)\,dt = \frac{1}{2}\,\mu\,\omega^2 A^2\,v$$

> **Potencia media.**
> $$\langle P\rangle = \frac{1}{2}\,\mu\,\omega^2 A^2\,v$$
> donde $\mu$ es la densidad lineal de masa, $\omega$ la frecuencia angular, $A$ la amplitud y
> $v$ la velocidad de propagación. La potencia transmitida crece con el **cuadrado** de la
> amplitud y de la frecuencia.

---

## Ver también

- [[01-ondas-propagantes]] — ecuación de onda, $v = \sqrt{F/\mu}$ y ondas armónicas
- [[03-reflexion-y-transmision]] — reparto de energía entre pulso reflejado y transmitido
