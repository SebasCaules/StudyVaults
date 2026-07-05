---
tags: [teoria, unidad-5, ondas-estacionarias, energia, potencia]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica + práctica)
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Energía y potencia en la onda estacionaria

En una [[01-onda-estacionaria|onda estacionaria]] cada elemento de la cuerda almacena energía
cinética y potencial elástica. A diferencia de una onda propagante, la onda estacionaria **no
transporta** energía neta a lo largo de la cuerda: la almacena y la intercambia localmente entre
forma cinética y potencial. Se trabaja con el modo fija–fija
$\psi(x,t) = A\sin(kx)\cos(\omega t + \varphi_t)$.

## Densidades de energía

> **Densidad de energía cinética.** Depende de la velocidad transversal $\partial\psi/\partial t$:
> $$u_c = \tfrac{1}{2}\mu\left(\frac{\partial\psi}{\partial t}\right)^2 = \tfrac{1}{2}\mu\,\omega^2 A^2\,\sin^2(kx)\,\sin^2(\omega t + \varphi_t)$$

> **Densidad de energía potencial.** Depende de la pendiente $\partial\psi/\partial x$:
> $$u_p = \tfrac{1}{2}F\left(\frac{\partial\psi}{\partial x}\right)^2 = \tfrac{1}{2}F\,k^2 A^2\,\cos^2(kx)\,\cos^2(\omega t + \varphi_t)$$

donde $\mu$ es la densidad lineal de masa y $F$ la tensión de la cuerda. Como
$F k^2 = \mu\omega^2$ (pues $v^2 = F/\mu = \omega^2/k^2$), ambas densidades comparten el mismo
prefactor $\tfrac{1}{2}\mu\omega^2 A^2$. Sumándolas se obtiene la densidad de energía mecánica:

> **Densidad de energía mecánica.**
> $$u_E = \tfrac{1}{2}\mu\,\omega^2 A^2\left[\cos^2(kx)\cos^2(\omega t + \varphi_t) + \sin^2(kx)\sin^2(\omega t + \varphi_t)\right]$$

## Dónde se concentra la energía

Las densidades cinética y potencial se turnan según el instante y según el punto de la cuerda.

| Instante | En un nodo | En un antinodo |
|---|---|---|
| Cuerda en máxima elongación | $u_p$ máx, $u_c = 0$ | $u_p = 0$, $u_c = 0$ |
| Cuerda horizontal | $u_p = 0$, $u_c = 0$ | $u_p = 0$, $u_c$ máx |

En la **máxima elongación** la cuerda está momentáneamente en reposo, así que $u_c = 0$ en todos
lados; la energía es puramente potencial y se concentra en los nodos, donde la pendiente es
máxima. En el instante de **cuerda horizontal** el desplazamiento es nulo en todos lados
($u_p = 0$), la energía es puramente cinética y se concentra en los antinodos, que se mueven con
la máxima velocidad. Los nodos nunca almacenan energía cinética porque no se mueven.

## Energía contenida en un tramo

Para hallar la energía de un tramo $[x_i, x_f]$ de la cuerda se integra la densidad mecánica en
la posición:

$$E = \int_{x_i}^{x_f} u_E(x,t)\,dx$$

que, integrada, da

$$E = \tfrac{1}{2}\mu\,\omega^2 A^2\,\frac{\Delta x}{2}$$

con $\Delta x = x_f - x_i$ la longitud del tramo. Es la expresión que se usa, por ejemplo, para
despejar la amplitud $A$ a partir de la energía medida en un segmento de cuerda.

## Potencia media: la onda no transporta energía

La onda estacionaria es la superposición de dos ondas propagantes de sentidos opuestos, cada una
con potencia media $\langle P\rangle = \tfrac{1}{2}\mu\omega^2 A^2 v$ pero de signo contrario por
viajar en sentidos opuestos:

$$\langle P\rangle = \tfrac{1}{2}\mu\omega^2 A^2\, v + \tfrac{1}{2}\mu\omega^2 A^2\,(-v) = 0$$

> **Observación.** La potencia media neta de una onda estacionaria es nula: **las ondas
> estacionarias no transportan energía, la almacenan.** La energía queda confinada oscilando
> entre forma cinética y potencial dentro de cada celda entre nodos.

## Ejemplo: cambio de fijo–fijo a fijo–libre

Una cuerda de longitud $L$ y densidad lineal $\mu$, **fija en ambos extremos** y con tensión
$F$, vibra a frecuencia $f$ mostrando **3 nodos interiores**. Si se libera un extremo (anillo
sin peso que desliza sin fricción por una varilla vertical) y se cambia la tensión a $F'$,
¿puede vibrar a la misma frecuencia $f$ con los mismos 3 nodos interiores? En caso afirmativo,
hallar $F'/F$.

**Configuración fija–fija.** Con 3 nodos interiores el modo es $m = 4$ (tiene $m - 1 = 3$ nodos
internos). Entonces $L = 2\lambda$ y la frecuencia es

$$f = f_4 = 4\,\frac{v}{2L} = \frac{2v}{L}, \qquad v = \sqrt{\frac{F}{\mu}}$$

**Configuración fija–libre.** Aquí solo hay modos impares y el número de nodos interiores del
modo $m$ es $(m-1)/2$; para 3 nodos interiores se necesita $m = 7$. Entonces $L = 7\lambda/4$ y

$$f = f_7 = 7\,\frac{v'}{4L}, \qquad v' = \sqrt{\frac{F'}{\mu}}$$

**Igualando frecuencias.** Se pide que la frecuencia sea la misma en ambos casos:

$$\frac{2v}{L} = \frac{7v'}{4L} \;\Rightarrow\; 8v = 7v' \;\Rightarrow\; \frac{v'}{v} = \frac{8}{7}$$

Como $v = \sqrt{F/\mu}$, se tiene $v'/v = \sqrt{F'/F}$, de donde

$$\frac{F'}{F} = \left(\frac{8}{7}\right)^2 = \frac{64}{49}$$

Es decir, **sí es posible**: manteniendo los mismos 3 nodos interiores y la misma frecuencia al
pasar de fija–fija a fija–libre, la tensión debe aumentar en un factor $F'/F = 64/49$.

> **Nota.** El planteo (fija–fija $m=4$ con 3 nodos interiores → fija–libre $m=7$) y el resultado
> $F'/F = 64/49$ son matemáticamente consistentes y respetan las convenciones de conteo de nodos
> de la unidad, pero el enunciado *no pudo confirmarse* contra las fuentes verificadas: los
> parciales de onda estacionaria de la práctica plantean otras variantes. Vale como ejercicio
> ilustrativo; su procedencia manuscrita queda sin verificar.

---

## Ver también

- [[01-onda-estacionaria]] — forma general, nodos, antinodos y los instantes de la cuerda
- [[02-condiciones-de-borde]] — modos normales y número de nodos interiores por caso
