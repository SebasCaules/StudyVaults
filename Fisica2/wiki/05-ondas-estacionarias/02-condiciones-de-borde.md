---
tags: [teoria, unidad-5, ondas-estacionarias, condiciones-de-borde, modos-normales, armonicos]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica + práctica)
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Condiciones de borde y modos normales

Los dos extremos de la cuerda imponen **condiciones de borde** sobre la
[[01-onda-estacionaria|onda estacionaria]] $\psi(x,t) = A\cos(kx + \varphi_x)\cos(\omega t + \varphi_t)$.
Solo ciertas longitudes de onda —y por lo tanto ciertas frecuencias— son compatibles con esos
extremos: son los **modos normales de vibración**. Cada extremo puede estar **fijo** (obligado
a ser un nodo) o **libre** (obligado a ser un antinodo), lo que da tres casos.

## Cuerda fija en ambos extremos

Es el caso de una cuerda anclada en $x = 0$ y $x = L$, con ambos extremos forzados a ser
**nodos**.

**Extremo $x = 0$ (nodo).** Se pide $\psi(0, t) = 0$, de donde
$A\cos(\varphi_x)\cos(\omega t + \varphi_t) = 0$ en todo instante, lo que exige
$\cos(\varphi_x) = 0$, es decir $\varphi_x = m\frac{\pi}{2}$ con $m$ impar. Con esa fase el
factor espacial se reduce a un seno:

$$\cos(kx + \varphi_x) \;\longrightarrow\; \sin(kx)$$

**Extremo $x = L$ (nodo).** Se pide $\psi(L, t) = 0$, de donde
$A\sin(kL)\cos(\omega t + \varphi_t) = 0$, lo que exige $\sin(kL) = 0$, es decir
$kL = m\pi$ con $m \in \mathbb{Z}$. Reemplazando $k = 2\pi/\lambda$ queda
$\frac{2\pi}{\lambda}L = m\pi$, y usando $v = f\lambda$ se despejan las longitudes de onda y
frecuencias permitidas:

> **Modos (fijo–fijo).** Las longitudes de onda y frecuencias de los modos normales son
> $$\lambda_m = \frac{2L}{m}, \qquad f_m = m\,\frac{v}{2L}, \qquad m \in \mathbb{N}$$
> donde $L$ es la longitud de la cuerda, $v = \sqrt{F/\mu}$ la velocidad de propagación
> ($F$ tensión, $\mu$ densidad lineal de masa) y $m$ el número de modo.

El modo $m = 1$ da la **frecuencia fundamental** $f_1 = v/2L$; los modos $m = 2, 3, \dots$ son
los **armónicos**, múltiplos enteros de la fundamental. El modo $m$ presenta $m$ antinodos y
$m - 1$ nodos interiores (sin contar los dos extremos).

## Cuerda fija en un extremo y libre en el otro

Ahora el extremo $x = 0$ está fijo (nodo) y el extremo $x = L$ está libre (antinodo).

**Extremo $x = 0$ (nodo).** Igual que antes, $\psi(0, t) = 0$ obliga a
$\cos(kx + \varphi_x) \to \sin(kx)$.

**Extremo $x = L$ (antinodo).** Se pide amplitud máxima, $-A \leq \psi(L, t) \leq A$, lo que
exige $\sin(kL) = \pm 1$, es decir $kL = m\frac{\pi}{2}$ con $m$ impar. De ahí:

> **Modos (fijo–libre).** Solo sobreviven los modos de orden impar:
> $$\lambda_m = \frac{4L}{m}, \qquad f_m = m\,\frac{v}{4L}, \qquad m \text{ impar}$$

La cuerda fija–libre solo admite armónicos **impares** ($m = 1, 3, 5, \dots$): los modos pares
quedan descartados por la condición de antinodo en el extremo libre. La frecuencia fundamental
es $f_1 = v/4L$, la mitad de la de una cuerda fija–fija de igual longitud.

## Cuerda libre en ambos extremos

Ambos extremos son **antinodos**.

**Extremo $x = 0$ (antinodo).** Se pide $-A \leq \psi(0, t) \leq A$, lo que exige
$\cos(\varphi_x) = \pm 1$, es decir $\varphi_x = m\pi$ con $m \in \mathbb{Z}$. Con esa fase el
factor espacial queda como un coseno:

$$\cos(kx + \varphi_x) \;\longrightarrow\; \cos(kx)$$

**Extremo $x = L$ (antinodo).** Se pide $-A \leq \psi(L, t) \leq A$, lo que exige
$\cos(kL) = \pm 1$, es decir $kL = m\pi$ con $m \in \mathbb{Z}$. De ahí:

> **Modos (libre–libre).** Las longitudes de onda y frecuencias coinciden con el caso fijo–fijo:
> $$\lambda_m = \frac{2L}{m}, \qquad f_m = m\,\frac{v}{2L}, \qquad m \in \mathbb{N}$$

El espectro de frecuencias es **igual al del caso fijo–fijo**; lo que cambia es la forma del
patrón (antinodos en los extremos en lugar de nodos).

## Resumen de los tres casos

| Condición de borde | Extremos | $\lambda_m$ | $f_m$ | Modos permitidos |
|---|---|---|---|---|
| Fija–fija | nodo–nodo | $\dfrac{2L}{m}$ | $m\,\dfrac{v}{2L}$ | $m = 1, 2, 3, \dots$ |
| Fija–libre | nodo–antinodo | $\dfrac{4L}{m}$ | $m\,\dfrac{v}{4L}$ | $m$ impar |
| Libre–libre | antinodo–antinodo | $\dfrac{2L}{m}$ | $m\,\dfrac{v}{2L}$ | $m = 1, 2, 3, \dots$ |

**Observación.** En los tres casos la velocidad de propagación es $v = \sqrt{F/\mu}$, la misma
que en una onda propagante: es una propiedad del medio (tensión y densidad lineal), no del modo.
Cambiar la tensión $F$ o la densidad $\mu$ desplaza todo el espectro de frecuencias.

---

## Ver también

- [[01-onda-estacionaria]] — de dónde salen los nodos, antinodos y la forma $A\cos(kx+\varphi_x)\cos(\omega t+\varphi_t)$
- [[03-energia-onda-estacionaria]] — energía de un modo y ejemplo de cambio fijo–fijo → fijo–libre
