---
titulo: Intervalos de Confianza
tipo: concepto
unidad: 8
tags: [inferencia, estimacion, intervalo-de-confianza]
fuentes: ["[[teorica-ic-media-desvio-conocido]]", "[[teorica-ic-proporcion]]", "[[teorica-ic-media-desvio-desconocido-intro]]", "[[teorica-ic-media-desvio-desconocido-intervalos]]", "[[tp8-estimacion-de-parametros]]"]
actualizado: 2026-06-06
---

# Intervalos de Confianza

**En breve.** En vez de un número, se da un **rango** que atrapa al parámetro con
confianza $\gamma$. Tres casos según qué se conoce: media con $\sigma$ conocido
($Z$), proporción ($Z$) y media con $\sigma$ desconocido y muestra normal
([[distribucion-t-de-student|t de Student]]). Es la segunda rama de la
[[inferencia-estadistica]].

**Qué es:** en lugar de dar un único número (como en [[estimacion-puntual]]), se
da un **rango** $(\hat\theta_\ell, \hat\theta_u)$ que contiene al parámetro
$\theta$ con un **nivel de confianza** $\gamma$ (cercano a 1). Es la segunda rama
de la [[inferencia-estadistica]].

$$P\big(\hat\theta_\ell(X_1,\dots,X_n) < \theta < \hat\theta_u(X_1,\dots,X_n)\big) = \gamma.$$

- **Bilateral:** ambos extremos finitos.
- **Unilateral a derecha:** $\hat\theta_\ell=-\infty$.
- **Unilateral a izquierda:** $\hat\theta_u=+\infty$.

> **Interpretación frecuentista** (clave, del [[tp8-estimacion-de-parametros]]):
> la fórmula del IC, *antes* de tomar la muestra, tiene probabilidad $\gamma$ de
> contener a $\theta$. Si se tomaran $M$ muestras y se construyera un intervalo
> con cada una, aproximadamente $\gamma\cdot M$ de ellos contendrían a $\theta$.
> **Después** de observar la muestra, los extremos son números fijos: el intervalo
> contiene o no a $\theta$ (probabilidad 0 o 1). NO se dice "este intervalo tiene
> 90% de probabilidad de contener a $\mu$".

## Caso 1 — Media con desvío conocido (normal) $\to$ Z

$X_i\sim\mathcal N(\mu,\sigma)$ i.i.d. con $\sigma$ **conocido**. Como
$\overline X_n\sim\mathcal N(\mu,\sigma/\sqrt n)$, estandarizando
$\frac{\overline X_n-\mu}{\sigma/\sqrt n}\sim\mathcal N(0,1)$ y pidiendo
$P(|\overline X_n-\mu|\le\Delta)=\gamma$ se obtiene
$2\Phi(\Delta/(\sigma/\sqrt n))-1=\gamma$, de donde
$\Phi(\Delta/(\sigma/\sqrt n))=\frac{1+\gamma}{2}$ y por lo tanto
([[teorica-ic-media-desvio-conocido]]):

$$\boxed{\;\Delta_B = z_{\frac{1+\gamma}{2}}\cdot\frac{\sigma}{\sqrt n}\;}\qquad
IC_\gamma^{\,bil}(\mu)=\left(\overline X_n - z_{\frac{1+\gamma}{2}}\frac{\sigma}{\sqrt n},\; \overline X_n + z_{\frac{1+\gamma}{2}}\frac{\sigma}{\sqrt n}\right),$$

donde $z_p=\Phi^{-1}(p)$ es el fractil de la $\mathcal N(0,1)$. Unilaterales:
$\left(\overline X_n - z_\gamma\frac{\sigma}{\sqrt n},\infty\right)$ y
$\left(-\infty, \overline X_n + z_\gamma\frac{\sigma}{\sqrt n}\right)$.

**V.a. no normales:** si $n$ es grande ($n>100$), el [[teorema-central-del-limite]]
permite usar las mismas fórmulas.

## Caso 2 — Proporción $\to$ Z (con $\hat p$ en el desvío)

$X_i\sim$ Bernoulli$(p)$, $\hat p=\frac1n\sum X_i$. Por TCL, para $n$ grande
$\hat p\approx\mathcal N(p,\sqrt{p(1-p)/n})$. El desvío depende del $p$
desconocido, así que se reemplaza por $\hat p$ ([[teorica-ic-proporcion]]):

$$IC_\gamma^{\,bil}(p)=\left(\hat p - z_{\frac{1+\gamma}{2}}\sqrt{\tfrac{\hat p(1-\hat p)}{n}},\; \hat p + z_{\frac{1+\gamma}{2}}\sqrt{\tfrac{\hat p(1-\hat p)}{n}}\right).$$

Diferencias con el caso 1: se sabe que $p\in[0,1]$ (los IC unilaterales se acotan
a $0$ y $1$) y se reemplaza la varianza real por $\hat p(1-\hat p)$, aproximación
buena para $n$ grande.

## Caso 3 — Media con desvío desconocido (normal) $\to$ t de Student

$X_i\sim\mathcal N(\mu,\sigma)$ i.i.d. con $\sigma$ **desconocido** y $n$ no
necesariamente grande. Se reemplaza $\sigma$ por el desvío muestral $S_n$ y
$\mu$ por $\overline X_n$, lo que cambia la distribución de referencia: el
estadístico

$$T = \frac{\overline X_n-\mu}{S_n/\sqrt n} \sim t_{n-1}$$

sigue una [[distribucion-t-de-student]] con $n-1$ grados de libertad. Repitiendo
la derivación del caso 1 con $T$ ([[teorica-ic-media-desvio-desconocido-intervalos]]):

$$\boxed{\;\Delta_B = t_{n-1,\frac{1+\gamma}{2}}\cdot\frac{S_n}{\sqrt n}\;}\qquad
IC_\gamma^{\,bil}(\mu)=\left(\overline X_n \pm t_{n-1,\frac{1+\gamma}{2}}\frac{S_n}{\sqrt n}\right).$$

**Unilaterales** (mismo cambio que en el caso 1, pero con el fractil de la t y
$\gamma$ en vez de $\frac{1+\gamma}{2}$, según [[teorica-ic-media-desvio-desconocido-intervalos]]):
$$IC_\gamma^{\,der}(\mu)=\left(-\infty,\;\overline X_n + t_{n-1,\gamma}\frac{S_n}{\sqrt n}\right),\qquad
IC_\gamma^{\,izq}(\mu)=\left(\overline X_n - t_{n-1,\gamma}\frac{S_n}{\sqrt n},\;+\infty\right),$$
recordando que $t_{n-1,\alpha}=-t_{n-1,1-\alpha}$.

Para $n$ grande ($>100/200$), $t_{n-1,\frac{1+\gamma}{2}}\approx z_{\frac{1+\gamma}{2}}$
y se recupera la fórmula del caso 1 con $S_n$. Resumen:

| Situación | Estadístico | Fractil |
|---|---|---|
| Media, $\sigma$ conocido (o $n$ grande, no normal) | $Z$ | $z_{\frac{1+\gamma}{2}}$ |
| Proporción ($n$ grande) | $Z$ | $z_{\frac{1+\gamma}{2}}$ |
| Media, $\sigma$ desconocido, normal | $T\sim t_{n-1}$ | $t_{n-1,\frac{1+\gamma}{2}}$ |

## Tamaño muestral

El **error de muestreo** $E$ es la semiamplitud del IC (la máxima distancia del
centro a un extremo). Despejando $n$ de $E = z_{\frac{1+\gamma}{2}}\frac{\sigma}{\sqrt n}$:

$$n \ge z_{\frac{1+\gamma}{2}}^2\,\frac{\sigma^2}{E^2}.$$

Para proporciones, como $p$ es desconocido, se usa la cota conservadora
$p(1-p)\le \frac14$ o una estimación previa $\hat p$.

> **Intuición.** El $n$ aparece bajo una raíz en la amplitud del IC, así que la
> precisión mejora con $\sqrt n$: para **partir el error a la mitad** hay que
> **cuadruplicar** la muestra ($E\propto 1/\sqrt n$). Por eso pedir un poco más de
> exactitud cuesta muchos más datos, y conviene fijar primero el error tolerable.

## Corrección por población finita (proporción)

Las fórmulas del caso 2 suponen muestreo **con reposición** (o población
infinita). Si la población tiene tamaño **finito** $N$ y la muestra de tamaño $n$
se extrae **sin reposición**, el número de individuos con el atributo es
[[distribucion-hipergeometrica|hipergeométrico]]. Cuando vale la aproximación
normal de la hipergeométrica, la semiamplitud del IC para $p$ lleva un **factor
de corrección por población finita** ([[tp8-estimacion-de-parametros]], ej. 24):

$$E = z_{1-\frac{\alpha}{2}}\sqrt{\hat p(1-\hat p)}\;\sqrt{\frac{N-n}{N\,n}}.$$

- Si $N\gg n$, el factor $\sqrt{\tfrac{N-n}{Nn}}\to\sqrt{\tfrac1n}$ y se recupera
  la fórmula de población infinita $E=z\sqrt{\hat p(1-\hat p)/n}$.
- Si $N=n$ (se censa toda la población), $E=0$: no hay incertidumbre de muestreo.

**Tamaño muestral con corrección.** Definiendo
$B=\dfrac{E}{z_{1-\alpha/2}\sqrt{\hat p(1-\hat p)}}$, se despeja

$$\boxed{\;n=\frac{1}{B^2+\frac{1}{N}}\;}$$

(con $\hat p$ una estimación previa o una muestra piloto). A diferencia del caso
infinito, $n$ está **acotado por $N$**: aunque se pida un error muy chico, nunca
hace falta una muestra mayor que la población. Para $N\to\infty$ se recupera
$n=1/B^2$.

## Ejercicio resuelto 1 — Media, desvío desconocido (t de Student)

**Enunciado** ([[tp8-estimacion-de-parametros]], ej. 14): los contenidos de 7
recipientes para ácido sulfúrico (en litros) son $9.8, 10.2, 10.4, 9.8, 10.0,
10.2, 9.6$. Obtener un IC del 95% para la media, asumiendo normalidad.

**Planteo.** $\sigma$ es desconocido $\Rightarrow$ caso 3, t de Student con
$n-1=6$ grados de libertad. $\gamma=0.95\Rightarrow\frac{1+\gamma}{2}=0.975$.

**Cálculo.** Con $\sum x_k=70.0$ y $\sum x_k^2=700.48$:
$$\bar x = \frac{70.0}{7}=10.0,\qquad s^2=\frac{1}{6}\left(700.48 - 7\cdot 10.0^2\right)=\frac{0.48}{6}=0.08 \Rightarrow s\approx 0.2828.$$
De la tabla, $t_{6,0.975}=2.4469$. La semiamplitud:
$$\Delta_B = t_{6,0.975}\cdot\frac{s}{\sqrt 7}=2.4469\cdot\frac{0.2828}{\sqrt 7}\approx 0.2616.$$

**Resultado.** $IC_{95\%}(\mu)=10.0\pm 0.2616=\boxed{(9.74,\;10.26)}$.

## Ejercicio resuelto 2 — Media, desvío conocido (Z) y tamaño muestral

**Enunciado** ([[tp8-estimacion-de-parametros]], ej. 9): una máquina llena latas
de café con distribución normal de desvío estándar **conocido** $\sigma=15$ g. Se
toma una muestra de $n=10$ envases con media $\overline x_{10}=246$ g.
a) IC 90% para la dosificación media. b) ¿Cuántos envases más para un error de
muestreo de 5 g?

**Planteo.** $\sigma$ conocido y normal $\Rightarrow$ caso 1, $Z$.
$\gamma=0.9\Rightarrow z_{\frac{1+\gamma}{2}}=z_{0.95}=1.644854$.

**Cálculo a).** $\Delta_B = z_{0.95}\frac{\sigma}{\sqrt n}=1.644854\cdot\frac{15}{\sqrt{10}}\approx 7.8$.
$$IC_{90\%}(\mu)=246\pm 7.8=(238.20,\;253.80).$$

**Cálculo b).** Pedir error $E\le 5$:
$$5\ge z_{0.95}\frac{\sigma}{\sqrt n}\Rightarrow n\ge z_{0.95}^2\frac{\sigma^2}{5^2}=1.644854^2\cdot\frac{15^2}{25}\approx 24.35\Rightarrow n\ge 25.$$
Como ya se midieron $10$, hacen falta $25-10=15$ envases **más**.

**Resultado.** a) $246\pm 7.8$; b) **15 envases más**.

## Ejercicio resuelto 3 — Proporción (Z)

**Enunciado** ([[tp8-estimacion-de-parametros]], ej. 17/22): se mide el rating
(proporción de hogares) de un programa con un panel de $n=600$ hogares;
$\hat p_{600}=0.25$. Obtener un IC del 90% para el rating.

**Planteo.** Proporción, $n$ grande $\Rightarrow$ caso 2, $Z$.
$z_{\frac{1+0.9}{2}}=z_{0.95}=1.6448$.

**Cálculo.**
$$IC_{90\%}(p)=0.25\pm 1.6448\sqrt{\frac{0.25\cdot 0.75}{600}}=0.25\pm 0.0291=(0.2209,\;0.2791).$$

**Resultado.** $IC_{90\%}(p)\approx\boxed{(0.22,\;0.28)}$, es decir entre $22\%$ y
$28\%$ de rating.

> **Numeración:** este problema del rating es el **Ej. 22** de la guía (en la
> sección de *ejercicios resueltos* del TP8 figura como "Ejercicio 17" por la
> doble numeración del PDF). Mismo enunciado, distinta etiqueta.

## Ejercicio resuelto 4 — Media con datos agrupados (Z por TCL)

**Enunciado** ([[tp8-estimacion-de-parametros]], ej. 13): el contenido de sílice
de $n=150$ coladas de hierro viene en una tabla de frecuencias por intervalos
(de $0.333$ a $1.033$, 7 clases). Estimar con confianza del 95% el contenido
medio por colada.

**Planteo.** $\mu$ y $\sigma$ **desconocidos**, pero $n=150$ es **grande**: por el
[[teorema-central-del-limite]] se usa $Z$ (no se asume normalidad). Como los datos
están **agrupados** ([[datos-agrupados]]), se calculan la media y el desvío con la
**marca de clase** $x_j$ (centro de cada intervalo) y la frecuencia $f_j$:
$$\overline x^{Ag}=\frac{\sum_j x_j f_j}{n},\qquad
s^{Ag}=\sqrt{\frac{\sum_j (x_j-\overline x^{Ag})^2 f_j}{n-1}}.$$

**Cálculo.** Con $\sum_j x_j f_j = 110.95$ y $\sum_j (x_j-\overline x^{Ag})^2 f_j = 3.288$:
$$\overline x^{Ag}=\frac{110.95}{150}=0.7396,\qquad s^{Ag}=\sqrt{\frac{3.288}{149}}\approx 0.1485.$$
Con $z_{0.975}=1.9599$ y $\frac{1+\gamma}{2}=0.975$:
$$\Delta_B = z_{0.975}\frac{s^{Ag}}{\sqrt{150}}=1.9599\cdot\frac{0.1485}{\sqrt{150}}\approx 0.0238.$$

**Resultado.** $IC_{95\%}(\mu)=0.7396\pm 0.0238=\boxed{(0.716,\;0.763)}$. Aunque la
guía lo titula "95%", el desarrollo del raw usa el fractil $z_{0.975}$ correcto del
caso bilateral al 95%.

## Ejercicio resuelto 5 — Proporción: IC, unilateral y tamaño muestral

**Enunciado** ([[tp8-estimacion-de-parametros]], ej. 20): de un proceso de piezas
seriadas se tomó una muestra de $n=300$ y se hallaron $18$ defectuosas, así que
$\hat p=18/300=0.06$.
a) IC del 90% para el porcentaje defectuoso. b) tamaño de muestra adicional para
una semiamplitud de $0.01$. c) porcentaje defectuoso **máximo** con 90% de confianza.

**Planteo.** Proporción, $n$ grande $\Rightarrow$ caso 2, $Z$. Para a) bilateral
$z_{\frac{1+0.9}{2}}=z_{0.95}=1.6449$; para c) unilateral a derecha $z_{0.90}=1.2816$.

**Cálculo a).**
$$\Delta_B = z_{0.95}\sqrt{\frac{0.06\cdot 0.94}{300}}=1.6449\cdot 0.01369\approx 0.0226
\Rightarrow IC_{90\%}(p)=0.06\pm 0.023=(0.037,\;0.083).$$

**Cálculo c) — máximo (unilateral a derecha).** El extremo derecho del IC
unilateral usa $z_{0.90}$:
$$p_{\max}=\hat p + z_{0.90}\sqrt{\frac{\hat p(1-\hat p)}{n}}=0.06+1.2816\cdot 0.01369\approx 0.0776=\boxed{7.76\%}.$$

**Cálculo b) — tamaño muestral.** Pedir semiamplitud $E\le 0.01$:
$z_{0.95}\sqrt{\hat p(1-\hat p)/m}\le 0.01$. Usando la estimación previa $\hat p=0.06$,
$$m\ge \left(\frac{z_{0.95}}{0.01}\right)^2 0.06\cdot 0.94 = 1.6449^2\cdot\frac{0.0564}{0.0001}\approx 1525.9,$$
y como ya se midieron 300, hacen falta $\approx \boxed{1226}$ **más**. (Con la cota
conservadora $\hat p(1-\hat p)\le\frac14$ saldría $m\approx 6764$, es decir $6464$
adicionales: mucho más exigente.)

**Resultado.** a) $(0.037,0.083)$; b) $\approx 1226$ piezas más; c) máximo $7.76\%$.

> **Numeración:** en la guía este es el **Ej. 20**; en la sección de *ejercicios
> resueltos* del TP8 aparece etiquetado como "Ejercicio 21" (doble numeración).

## Páginas relacionadas
- [[estimacion-puntual]] — los estimadores que se ubican en el centro del IC.
- [[distribucion-t-de-student]] — distribución de referencia del caso 3.
- [[distribucion-hipergeometrica]] — origen de la corrección por población finita.
- [[datos-agrupados]] — media y desvío por marca de clase (ejercicio resuelto 4).
- [[varianza-muestral]] — cómo se calcula $S_n$.
- [[formulario-inferencia]] — todas las fórmulas juntas.
