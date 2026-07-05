---
tags: [teoria, unidad-7, interferencia, coherencia, camino-optico, intensidad]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica)
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Fundamentos de la interferencia

La **interferencia** es el fenómeno por el cual dos haces de luz que se superponen no siempre
suman sus intensidades: según cómo estén desfasados, se pueden reforzar (zonas más brillantes
que la simple suma) o cancelar (zonas oscuras). Es un fenómeno **exclusivo de las ondas** y solo
aparece cuando los haces son **coherentes**. Esta página fija las bases (la luz como onda,
intensidad, superposición y coherencia) sobre las que se apoyan la [[02-division-de-amplitud|
división de amplitud]] (láminas, cuña, anillos de Newton) y la [[03-doble-rendija-de-young|
doble rendija de Young]].

## La luz como onda electromagnética

Por las ecuaciones de Maxwell, la luz es una **onda electromagnética transversal**. Como los
materiales ópticos son en general no magnéticos, se describe la onda por su campo eléctrico
$\vec E$ (no por $\vec B$). Para una onda que se propaga en la dirección $z$:

$$\vec E = E\,\cos(kz - \omega t + \varphi_E)\,\hat n_E$$

donde $E$ es la amplitud, $k = 2\pi/\lambda$ el número de onda, $\omega$ la frecuencia angular,
$\varphi_E$ la fase inicial y $\hat n_E$ un versor **contenido en el plano perpendicular a
$\hat z$** (la onda es transversal). El plano definido por $\vec E$ y $\hat z$ es el **plano de
polarización**.

Descomponiendo el campo en las direcciones $\hat x$ y $\hat y$ del plano transversal:

$$\vec E = A_x\cos(kz - \omega t + \varphi_x)\,\hat x + A_y\cos(kz - \omega t + \varphi_y)\,\hat y$$

Llamando $\phi = kz - \omega t$ a la **fase de propagación** común y $\varphi = \varphi_y -
\varphi_x$ al **desfase entre componentes**, la onda de luz queda

$$\vec E = A_x\cos(\phi)\,\hat x + A_y\cos(\phi + \varphi)\,\hat y$$

donde $A_x, A_y$ son las amplitudes de cada componente.

## Intensidad de la luz

Lo que un detector (o el ojo) mide no es el campo instantáneo —que oscila a $f \approx 500$ THz
$= 5\times 10^{14}$ Hz, imposible de seguir— sino la **intensidad**: la potencia media por unidad
de área. La intensidad disminuye al propagarse la onda, pero en una región pequeña lejos de la
fuente puede tomarse $I \approx$ constante.

$$I = \frac{\langle P \rangle}{\text{área}} = n\,c\,\varepsilon_0\,\langle |\vec E|^2 \rangle$$

donde $n$ es el índice de refracción del medio, $c$ la velocidad de la luz en el vacío,
$\varepsilon_0 = 8.854\times 10^{-12}\ \mathrm{Ws/Vm}$ la permitividad del vacío y
$\langle |\vec E|^2 \rangle$ el promedio temporal del módulo al cuadrado del campo. Como el
promedio de $\cos^2$ es $\tfrac12$, en términos de las amplitudes:

$$I = \frac{n\,c\,\varepsilon_0}{2}\,\big(A_x^2 + A_y^2\big)$$

La consecuencia clave para lo que sigue: **la intensidad es proporcional al cuadrado de la
amplitud**.

## Superposición de dos haces

Cuando dos haces se superponen, el campo total es la suma $\vec E = \vec E_1 + \vec E_2$. Al
calcular la intensidad aparece un término cruzado, y el resultado es

$$I = I_1 + I_2 + 2\sqrt{I_1 I_2}\,\big\langle \cos\alpha\,\cos(\Delta\phi) \big\rangle$$

donde $I_1, I_2$ son las intensidades de cada haz por separado, $\alpha$ es el ángulo entre las
direcciones de polarización de los dos campos y $\Delta\phi = \phi_1 - \phi_2$ la diferencia de
fase entre ellos. Los dos primeros términos son la **mezcla** (la simple suma de intensidades);
el tercero es el **término de interferencia**, exclusivo de las ondas.

## Coherencia

Todo el fenómeno depende de si el término de interferencia sobrevive al promedio temporal
$\langle\,\cdot\,\rangle$. Hay dos maneras de que ese promedio se anule:

- **Fuentes distintas** ($\Delta\varphi$ y $\alpha$ aleatorias): las fases relativas y las
  polarizaciones varían rápida y azarosamente, de modo que
  $\langle \cos\alpha\,\cos\Delta\varphi \rangle = 0$ y queda $I = I_1 + I_2$ (no hay
  interferencia observable).
- **Frecuencias distintas** ($\omega_1 \neq \omega_2$): $\Delta\phi$ no es constante en el tiempo
  y el término también se promedia a cero.

> **Definición.** Dos haces son **coherentes** cuando $\Delta\varphi$ y $\alpha$ se mantienen
> **constantes** en el tiempo (misma frecuencia, relación de fase fija). Solo entonces el término
> de interferencia no promedia a cero y el patrón es observable.

En la práctica, para garantizar coherencia se parte de **un único haz** y se lo divide, ya que
dos fuentes independientes nunca mantienen una relación de fase fija.

## Cómo conseguir fuentes coherentes

A partir de un mismo haz hay dos estrategias, que luego se hacen superponer entre sí:

| Método | Idea | Ejemplos |
|---|---|---|
| **División de amplitud** | Se divide el haz en dos (reflejado + transmitido) | [[02-division-de-amplitud|láminas delgadas, cuña, anillos de Newton]] |
| **División del frente de onda** | Se toman dos porciones del frente de onda del haz | [[03-doble-rendija-de-young|doble rendija de Young]] |

En ambos métodos, al venir del mismo haz se anulan las diferencias que rompen la coherencia:
$\Delta(\omega t) = 0$, $\Delta\varphi = 0$ y $\alpha = 0$. La única diferencia que sobrevive es
la de **fase espacial** $\Delta(kz)$, que depende del índice $n$ y del camino recorrido $z$ y es
**constante** en el tiempo.

## Camino óptico y diferencia de fase

Para cuantificar $\Delta(kz)$ se define el **camino óptico** $CO = n\,z$: el camino geométrico
$z$ ponderado por el índice del medio (porque en un medio de índice $n$ la longitud de onda es
$\lambda = \lambda_0 / n$, con $\lambda_0$ la longitud de onda en el vacío). Desarrollando el
desfase entre los dos haces:

$$\Delta\phi = \Delta(kz) = k_2 z_2 - k_1 z_1 = \frac{2\pi}{\lambda_0}\,(n_2 z_2 - n_1 z_1)$$

Definiendo la **diferencia de camino óptico** $\Delta CO = CO_2 - CO_1 = n_2 z_2 - n_1 z_1$, y
sumando el desfase constante $\Delta\varphi$ que puedan introducir las reflexiones:

$$\Delta\phi = \frac{2\pi}{\lambda_0}\,\Delta CO + \Delta\varphi$$

donde $\lambda_0$ es la longitud de onda en el vacío, $\Delta CO$ la diferencia de camino óptico
entre los dos haces y $\Delta\varphi$ un desfase constante extra (típicamente $0$ o $\pm\pi$,
según lo que ocurra en las reflexiones — ver [[02-division-de-amplitud]]). Esta es la fórmula
maestra: todo el estudio de interferencia se reduce a calcular $\Delta\phi$ en cada geometría.

## Condiciones de máximo y mínimo

Con haces coherentes, el promedio del término de interferencia da $\langle \cos\alpha\,
\cos\Delta\phi \rangle = \cos\Delta\phi$, de modo que

$$I = I_1 + I_2 + 2\sqrt{I_1 I_2}\,\cos\Delta\phi$$

La intensidad oscila entre un mínimo y un máximo, $I_{min} \le I \le I_{max}$, según el valor de
$\cos\Delta\phi$:

> **Interferencia constructiva (máximo).** Cuando $\cos\Delta\phi = 1$, es decir
> $$\Delta\phi = 2m\pi, \qquad m \in \mathbb{Z}$$
> los haces están en fase y $I_{max} = I_1 + I_2 + 2\sqrt{I_1 I_2}$.

> **Interferencia destructiva (mínimo).** Cuando $\cos\Delta\phi = -1$, es decir
> $$\Delta\phi = (2m+1)\pi, \qquad m \in \mathbb{Z}$$
> los haces están en contrafase y $I_{min} = I_1 + I_2 - 2\sqrt{I_1 I_2}$.

donde $m$ es el **orden** de la franja (entero).

### Caso de igual intensidad

El caso más importante es cuando los dos haces tienen la misma intensidad, $I_1 = I_2 = I_0$.
Usando la identidad $1 + \cos\Delta\phi = 2\cos^2(\Delta\phi/2)$:

$$I = 2I_0\,(1 + \cos\Delta\phi) = 4I_0\cos^2\!\left(\frac{\Delta\phi}{2}\right)$$

con $0 \le I \le 4I_0$. Este es el **mejor contraste posible** entre máximos y mínimos: los
mínimos caen a cero absoluto y los máximos llegan a cuatro veces la intensidad de un solo haz.

---

## Ver también

- [[02-division-de-amplitud]] — láminas delgadas, cuña y anillos de Newton
- [[03-doble-rendija-de-young]] — interferencia por división del frente de onda
