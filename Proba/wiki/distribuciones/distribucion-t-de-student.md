---
titulo: Distribución t de Student
tipo: distribucion
unidad: 8
tags: [continua, distribucion, inferencia]
fuentes: ["[[teorica-t-de-student]]", "[[teorica-ic-media-desvio-desconocido-intro]]", "[[teorica-ic-media-desvio-desconocido-intervalos]]", "[[tp8-estimacion-de-parametros]]"]
actualizado: 2026-06-06
---

# Distribución t de Student

**En breve.** La "normal con colas pesadas" que aparece al estandarizar la media
muestral usando el desvío **estimado** $S_n$ en vez del verdadero $\sigma$.
Depende de los grados de libertad $m=n-1$ y tiende a la
[[distribucion-normal|normal]] cuando $m\to\infty$. Es la distribución de
referencia del caso 3 de los [[intervalos-de-confianza]].

**Modela:** la distribución del estadístico estandarizado de la media muestral
cuando la varianza poblacional se estima con $S_n$ (caso de muestras normales
con $\sigma$ desconocido).
**Soporte:** $t\in\mathbb R$.
**Parámetros:** grados de libertad $m\in\mathbb N$ (en inferencia, $m=n-1$).

Debe su nombre al seudónimo "Student" de William S. Gosset.

## De dónde sale

Según [[teorica-ic-media-desvio-desconocido-intro]], si $X_i\sim\mathcal N(\mu,\sigma)$
i.i.d. y se reemplazan $\mu\to\overline X_n$ y $\sigma\to S_n$ ([[varianza-muestral|desvío muestral]]),
el estadístico

$$T = \frac{\overline X_n - \mu}{S_n/\sqrt n} \sim t_{n-1}$$

sigue una t de Student con $n-1$ grados de libertad. Es la herramienta para los
[[intervalos-de-confianza]] de la media con desvío desconocido.

> **Intuición (por qué colas más pesadas que la normal).** Si se conociera
> $\sigma$, el estadístico $\frac{\overline X_n-\mu}{\sigma/\sqrt n}$ sería
> $\mathcal N(0,1)$ exacta. Pero $S_n$ es un **estimado** ruidoso de $\sigma$:
> cuando por azar $S_n$ sale chico, el cociente se infla, y eso agrega valores
> extremos al estadístico. Esa incertidumbre extra "engorda" las colas. Con pocos
> datos $S_n$ es muy inestable (colas muy pesadas, IC ancho); con muchos datos
> $S_n\approx\sigma$ y la t se vuelve indistinguible de la normal.

## Función de densidad

Con $m$ grados de libertad (escrito $n$ en la teórica), según
[[teorica-t-de-student]]:

$$f_T(t) = \frac{1}{\sqrt{(m)\pi}}\;\frac{\Gamma\!\left(\frac{m+1}{2}\right)}{\Gamma\!\left(\frac{m}{2}\right)}\left(1+\frac{t^2}{m}\right)^{-\frac{m+1}{2}}.$$

Es **simétrica** respecto de 0 ($f_T(-t)=f_T(t)$) y tiene **colas más pesadas**
que la normal. La $\Gamma(\cdot)$ es la función gamma ($\Gamma(n+1)=n!$).

> Nota: la teórica manuscrita escribe la densidad con el parámetro $n$ asociado a
> los $n-1$ grados de libertad del estadístico; aquí usamos $m$ para los grados de
> libertad genéricos. La forma estándar equivalente con $\nu=m$ grados de libertad
> es la de arriba.

## Esperanza y varianza

Con $m$ grados de libertad:
- $E[T] = 0$ si $m>1$ (no definida si $m\le 1$).
- $V(T) = \dfrac{m}{m-2} > 1$ si $m>2$ (la varianza supera a la de $\mathcal N(0,1)$;
  no definida / infinita para $m\le 2$).
- **Curtosis (exceso):** $\kappa_T=\dfrac{6}{m-4}>0$ si $m>4$ (colas más pesadas
  que la normal; $\infty$ para $2<m\le 4$, no definida para $m\le 2$). Tiende a
  $0$ cuando $m\to\infty$, recuperando la curtosis de la normal.

> La teórica manuscrita [[teorica-t-de-student]] tabula la curtosis como
> $\kappa_T=\frac{6}{n-5}$ para "$n>5$" usando su $n$ (donde $n-1$ son los grados
> de libertad reales del estadístico). Al identificar $m=\nu=n-1$ ambas coinciden:
> $\frac{6}{m-4}=\frac{6}{(n-1)-4}=\frac{6}{n-5}$.

> ⚠️ Discrepancia (notación de grados de libertad): la teórica manuscrita
> [[teorica-t-de-student]] tabula $E[T]$, $V(T)$ y curtosis usando $n$ donde
> $n-1$ son los grados de libertad reales del estadístico $t_{n-1}$ (escribe
> $V_T=\frac{n-1}{n-3}$ para "$n>3$"). En la convención estándar, con $\nu$ grados
> de libertad, $V(T)=\frac{\nu}{\nu-2}$. Ambas coinciden al identificar $\nu=n-1$.
> En los ejercicios usar **siempre** la tabla de fractiles por grados de libertad
> (GDL) del [[tp8-estimacion-de-parametros]], que es inequívoca.

## Relación con otras distribuciones

- Cuando los grados de libertad $\to\infty$, $\;t_m \to \mathcal N(0,1)$
  (la densidad converge a $\frac{1}{\sqrt{2\pi}}e^{-t^2/2}$). Por eso, para
  $n>100/200$, el IC con t se aproxima por el de la [[distribucion-normal]].
- Se vincula con la [[distribucion-ji-cuadrado]]: si $X_i\sim\mathcal N(\mu,\sigma)$
  i.i.d., $\frac{(n-1)S_n^2}{\sigma^2}\sim\chi^2_{n-1}$, y $T$ se construye como
  cociente de una normal estándar y la raíz de una ji-cuadrado normalizada.

## Fractiles

$t_{m,\gamma}=F_{T_m}^{-1}(\gamma)$. Propiedades clave ([[teorica-t-de-student]]):
- Con **menos** grados de libertad el fractil es **mayor**: si $\ell>m$, entonces
  $t_{m,\gamma}>t_{\ell,\gamma}>z_\gamma$.
- $t_{\ell,\gamma}\to z_\gamma=\Phi^{-1}(\gamma)$ cuando $\ell\to\infty$.

Consecuencia práctica: con $n$ chico el IC de la media es **más ancho** (mayor
incertidumbre por estimar $\sigma$). El [[tp8-estimacion-de-parametros]] trae una
tabla de $t_{\text{GDL},\gamma}$ para $\gamma\in\{0.8,0.9,0.95,0.975,0.99,0.995\}$.

> **Nota.** Para calcular el **tamaño muestral** que garantiza un margen de error $\varepsilon$, conviene usar el cuantil normal $z$ aunque la t sea válida. El motivo es práctico: despejar $n$ de
> $$\Delta = t_{n-1,\,\frac{1+\gamma}{2}}\cdot\frac{S_n}{\sqrt n}\le\varepsilon$$
> obliga a recorrer la tabla grado por grado (búsqueda discreta), porque $t_{n-1,\,(1+\gamma)/2}$ cambia con el propio $n$ que se busca. Con $z$ (constante) el despeje es directo: $n\ge\left(\dfrac{z_{(1+\gamma)/2}\,S_n}{\varepsilon}\right)^2$. Para $n$ grande ambos cuantiles coinciden, así que el resultado es prácticamente idéntico.

## Cuándo usarla (reconocer en un ejercicio)

- Intervalo de confianza (o prueba de hipótesis) **para la media**, …
- … cuando la muestra es **normal**, …
- … el **desvío poblacional $\sigma$ es desconocido** (se usa el muestral $S_n$), …
- … y $n$ **no** es grande (si $n>200$ podés aproximar con la normal).

En **pruebas de hipótesis**, $T$ es el estadístico de la
[[prueba-de-hipotesis-para-la-media|prueba para la media]] con $\sigma$ desconocido,
y entra en el [[diseno-de-prueba-tamano-muestral|diseño de la prueba]] (fijar $\alpha$
y $\beta$ para despejar $n$ y el valor crítico).

> **Cuidado:** con $\sigma$ desconocido y $n$ chico, usar los cuantiles de la normal $z$ en lugar de $t_{n-1}$ produce un IC **más estrecho de lo correcto**. Parece más preciso, pero **no cubre** el nivel de confianza pedido: como no se basa en la distribución real del estadístico, en repeticiones el verdadero $\mu$ queda afuera con más frecuencia que el $1-\gamma$ tolerado. La t corrige exactamente esa sub-cobertura, a costa de un intervalo más ancho.

## Ejercicio resuelto

**Enunciado** ([[teorica-ic-media-desvio-desconocido-intervalos]]): Jorge compró
10 paquetes de azúcar (nominal 1 kg). Pesos en gramos: $986, 983, 981, 989, 991,
986, 986, 979, 997, 988$. Determinar un IC con nivel de confianza del 90% para el
peso medio. ¿Qué hay que asumir?

**Planteo.** Se asume que el peso de un paquete $\sim\mathcal N(\mu,\sigma)$ con
$\mu$ y $\sigma$ **desconocidos**, y que la muestra es i.i.d. (tomada al azar). Al
desconocer $\sigma$ y ser $n=10$ chico $\Rightarrow$ se usa $T\sim t_{n-1}=t_9$.
Bilateral, $\gamma=0.9\Rightarrow\frac{1+\gamma}{2}=0.95$.

**Cálculo.** Con $\sum x_i=9866$ y $\sum x_i^2=9\,734\,034$:
$$\overline x_{10}=\frac{9866}{10}=986.6,\qquad
S_{10}^2=\frac{1}{9}\left(9\,734\,034 - 10\cdot 986.6^2\right)\Rightarrow S_{10}=5.1467.$$
De la tabla, $t_{9,0.95}=1.8331$. La semiamplitud:
$$\Delta_B = t_{9,0.95}\cdot\frac{S_{10}}{\sqrt{10}}=1.8331\cdot\frac{5.1467}{\sqrt{10}}\approx 2.9834\approx 3.$$

**Resultado.** $IC_{90\%}(\mu)=986.6\pm 3=\boxed{(983.6,\;989.6)}$ gramos. El
intervalo no contiene los 1000 g nominales: los paquetes pesan menos que lo
declarado.

## Páginas relacionadas
- [[intervalos-de-confianza]] — el caso 3 (media, $\sigma$ desconocido) la usa.
- [[varianza-muestral]] — el $S_n$ que entra en el estadístico $T$.
- [[distribucion-ji-cuadrado]] — la t se arma como normal sobre raíz de ji-cuadrado.
- [[distribucion-normal]] — límite de la t cuando los grados de libertad crecen.
- [[prueba-de-hipotesis-para-la-media]] — donde $T$ es el estadístico de la prueba.
- [[inferencia-estadistica]] · [[formulario-inferencia]] — el marco y las fórmulas.
