---
tags: [teoria, unidad-3, trabajo, energia-cinetica, potencia]
fuente: raw/apuntes-2023-2c/teorica-fisica-1.pdf
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Trabajo, energía cinética y potencia

Esta página introduce el concepto de **trabajo** de una fuerza —constante, variable y a lo
largo de una trayectoria curva—, el **teorema del trabajo y la energía cinética** que lo conecta
con la velocidad, y la **potencia** como tasa a la que se transfiere energía. Es la base sobre la
que se apoya la [[02-energia-potencial-y-conservacion|conservación de la energía]].

## Trabajo de una fuerza constante

> **Definición.** El trabajo de una fuerza constante $\vec F$ sobre un desplazamiento $\Delta \vec x$ es el producto escalar
> $$W = F_x \, \Delta x = \vec F \cdot \Delta \vec x$$
> donde $F_x$ es la componente de la fuerza en la dirección del movimiento.

La unidad de trabajo en el SI es el **joule**:

$$[W] = \text{N} \cdot \text{m} = \text{kg}\,\frac{\text{m}^2}{\text{s}^2} = \text{J}$$

**Observación.** El signo del trabajo **no depende del sistema de coordenadas**: queda fijado por
la orientación relativa entre la fuerza y el desplazamiento. Si $\vec F$ forma un ángulo $\theta$
con el desplazamiento, la componente útil es $F_x = F\cos\theta$ y entonces $W = F\cos\theta\,\Delta x$.

### Ejemplo: bloque tirado sobre una superficie horizontal

Un bloque se desplaza $\Delta x$ sobre una superficie horizontal, tirado por una fuerza $\vec F$
que forma un ángulo $\theta$ con la horizontal. Actúan además el peso $m\vec g$, la normal $\vec N$
y el rozamiento $\vec f_r$. El trabajo de cada fuerza es:

| Fuerza | Trabajo | Motivo |
|---|---|---|
| Aplicada $\vec F$ | $W_F = F\cos\theta\,\Delta x$ | solo la componente horizontal trabaja |
| Normal $\vec N$ | $W_N = N_x\,\Delta x = 0$ | perpendicular al desplazamiento |
| Rozamiento $\vec f_r$ | $W_{f_r} = f_r\cos 180^\circ\,\Delta x = -f_r\,\Delta x$ | opuesto al movimiento |
| Peso $m\vec g$ | $W_{mg} = (mg)_x\,\Delta x = 0$ | vertical, sin componente horizontal |

El trabajo neto es la suma de todos:

$$W_{\text{neto}} = W_F + W_N + W_{f_r} + W_{mg}$$

## Trabajo de una fuerza variable

Cuando la fuerza cambia a lo largo del recorrido, el trabajo se obtiene sumando las contribuciones
$F_{x}\,\Delta x_i$ de tramos infinitesimales y pasando al límite:

$$W = \lim_{\Delta x_i \to 0} \sum_i F_{x_i}\,\Delta x_i = \int_{x_0}^{x_f} F_x \, dx$$

donde $F_x$ es la componente de la fuerza en la dirección del movimiento y la integral se toma
entre la posición inicial $x_0$ y la final $x_f$.

## Caso general: trayectoria curva

Sobre una trayectoria curva conviene descomponer la fuerza en sus componentes **tangencial** $\hat t$
y **normal** $\hat n$. Como el desplazamiento $d\vec s = ds\,\hat t$ es siempre tangente a la
trayectoria, solo la componente tangencial hace trabajo:

$$W = \int_i^f \vec F \cdot d\vec s = \int_i^f \big(F_t\,\hat t + F_n\,\hat n\big)\cdot ds\,\hat t \;\Longrightarrow\; W = \int_i^f F_t \, ds$$

donde $F_t$ es la componente tangencial de la fuerza y $ds$ el elemento de arco. La componente
normal $F_n$ es perpendicular al desplazamiento y **no aporta trabajo**.

## Teorema del trabajo y la energía cinética

Partiendo del trabajo neto y usando la regla de la cadena sobre la aceleración tangencial
$a_t = \dfrac{dv}{dt}$, se convierte la integral en el espacio en una integral en la velocidad:

$$W_{\text{neto}} = \int_i^f F_t \, ds = \int_i^f m\,\frac{dv}{dt}\, ds = \int_{v_i}^{v_f} m\,v \, dv$$

donde en el último paso se usó $\dfrac{ds}{dt} = v$. Integrando:

$$W_{\text{neto}} = \tfrac{1}{2}m v_f^2 - \tfrac{1}{2}m v_i^2$$

Esto motiva definir la **energía cinética**:

> **Definición.** La energía cinética de una partícula de masa $m$ y rapidez $v$ es
> $$K = \tfrac{1}{2} m v^2$$

> **Teorema (del trabajo y la energía cinética).** El trabajo neto de todas las fuerzas sobre una partícula es igual a la variación de su energía cinética:
> $$W_{\text{neto}} = K_f - K_0 = \Delta K$$

En palabras: el trabajo neto es lo que cambia la rapidez. Si $W_{\text{neto}} > 0$ la partícula se
acelera; si es negativo, se frena.

## Potencia

La **potencia** mide qué tan rápido se transfiere la energía (o se realiza el trabajo).

> **Definición.** La potencia instantánea es la tasa a la que una fuerza realiza trabajo:
> $$P = \frac{dW}{dt} = \vec F \cdot \frac{d\vec s}{dt} = \vec F \cdot \vec v$$
> donde $\vec v = \dfrac{d\vec s}{dt}$ es la velocidad del punto de aplicación de la fuerza.

El **valor medio** en un intervalo se obtiene dividiendo el trabajo total por el tiempo:

$$P_{\text{med}} = \frac{W}{\Delta t}$$

La unidad de potencia en el SI es el **watt** ($1\ \text{W} = 1\ \text{J/s}$).

---

## Ver también

- [[02-energia-potencial-y-conservacion]] — fuerzas conservativas, energía potencial y $W_{nc} = \Delta K + \Delta U$
- [[03-guia-resuelta-energia-resortes]] — problemas de energía con resortes y potencia
- [[index]] — índice del vault
