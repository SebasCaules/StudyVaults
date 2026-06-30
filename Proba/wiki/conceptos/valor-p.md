---
titulo: Valor p
tipo: concepto
unidad: 9
tags: [prueba-de-hipotesis, valor-p, inferencia]
fuentes: ["[[tp9-pruebas-de-hipotesis]]", "[[intro-prueba-de-hipotesis-slides]]", "[[apunte-prueba-proporcion]]", "[[apunte-media-desvio-desconocido]]"]
actualizado: 2026-06-06
---

# Valor p

**En breve.** El valor p mide cuán sorprendente es lo observado *si $H_0$ fuera
cierta*: es la probabilidad de un resultado "tan malo o peor" que el de la
muestra. Cuanto más chico, más evidencia contra $H_0$; se rechaza cuando cae por
debajo de $\alpha$.

**Qué es:** El **valor p** (p-value) de una [[prueba-de-hipotesis|prueba de
hipótesis]] es la probabilidad de que, **si $H_0$ es verdadera**, el
[[estadistico-de-prueba|estadístico de prueba]] tome un valor **"tan malo o peor"
(tan contrario a $H_0$)** que el observado, según
[[intro-prueba-de-hipotesis-slides|las slides]] y [[tp9-pruebas-de-hipotesis|TP9]].

Es una medida de cuán sospechoso resulta el resultado observado bajo $H_0$: un
valor p chico significa que datos así de extremos serían muy improbables si $H_0$
fuera cierta.

## Regla de decisión con el valor p

$$ \boxed{\ \text{Se rechaza } H_0 \iff \text{valor p} < \alpha\ } $$

Equivalente a la regla de la región crítica, pero más informativa: el valor p es
el **nivel de significación más chico** al cual todavía se rechazaría $H_0$. Como
dice el apunte de [[apunte-media-desvio-desconocido|desvío desconocido]]:
"se rechaza para todo $\alpha > \text{valor p}$".

![[valor-p.svg]]

> **Intuición (qué NO es).** El valor p **no** es la probabilidad de que $H_0$
> sea verdadera: $H_0$ no es aleatoria, el parámetro tiene un valor fijo aunque
> desconocido. Es una probabilidad sobre los **datos** condicionada a $H_0$, no
> al revés. Por eso un valor p chico dice "datos así de extremos serían raros si
> $H_0$ valiera", lo que nos hace dudar de $H_0$ — pero rechazar puede ser un
> [[error-tipo-i-y-tipo-ii|error tipo I]] (justo cayó en una cola por azar).

## Cómo se calcula (según el tipo de cola)

Sea $\lambda_{\text{obs}}$ el valor observado del estadístico y $E_{\mu_0}[\Lambda]$
su valor esperado bajo $H_0$. Según [[tp9-pruebas-de-hipotesis|TP9]]:

- **Cola derecha:** $\text{valor p}=P_{\mu_0}(\Lambda > \lambda_{\text{obs}})$.
- **Cola izquierda:** $\text{valor p}=P_{\mu_0}(\Lambda < \lambda_{\text{obs}})$.
- **Dos colas:** $\text{valor p}=P_{\mu_0}\!\left(|\Lambda - E_{\mu_0}[\Lambda]| > |\lambda_{\text{obs}} - E_{\mu_0}[\Lambda]|\right)$.

Con el estadístico estandarizado $Z\sim N(0,1)$:

- Cola derecha: $\text{valor p}=1-\Phi(z_{\text{obs}})$.
- Cola izquierda: $\text{valor p}=\Phi(z_{\text{obs}})$.
- Dos colas: $\text{valor p}=2\,(1-\Phi(|z_{\text{obs}}|))$.

Con el estadístico $T\sim t_{n-1}$ se reemplaza $\Phi$ por $\Xi_{n-1}$ (la FDA de
la [[distribucion-t-de-student|t de Student]] con $n-1$ grados de libertad).

## Conceptos relacionados

- [[prueba-de-hipotesis]], [[error-tipo-i-y-tipo-ii]], [[estadistico-de-prueba]]
- [[prueba-de-hipotesis-para-la-media]], [[prueba-de-hipotesis-para-la-proporcion]]
- [[funcion-de-distribucion-acumulada]] ($\Phi$, $\Xi_{n-1}$ son las FDA que se evalúan)
- [[distribucion-normal]], [[distribucion-t-de-student]], [[estandarizacion-y-tabla-normal]]

## Ejercicio resuelto

**Enunciado** (ejercicio 10 del [[tp9-pruebas-de-hipotesis|TP9]], resuelto en el
[[apunte-media-desvio-desconocido|apunte de teórica]]): Un fabricante de lámparas
desarrolló un proceso que espera aumente la eficiencia media (lúmenes/watt) por
encima de $9.5$. Sobre $n=10$ lámparas (variable normal, $\sigma$ desconocido) se
obtuvo $\bar x_{\text{obs}}=10.985$ y $S=1.1489$. Usar $\alpha=5\%$ y calcular el
valor p.

**Planteo.** Cola derecha: $H_0:\mu\le 9.5$ vs $H_1:\mu>9.5$. Como $\sigma$ es
desconocido y $n$ chico, estadístico $T=\dfrac{\bar X - \mu_0}{S/\sqrt n}\sim t_9$.

**Cálculo.**
$$ t_{\text{obs}}=\frac{10.985-9.5}{1.1489/\sqrt{10}}=\frac{1.485}{0.3633}\approx 4.087. $$
Valor crítico: $t_{9,\,0.95}=1.8331$. Como $t_{\text{obs}}=4.087 > 1.8331$, cae en
la región de rechazo. El valor p es
$$ \text{valor p}=P_{\mu_0}(T \ge t_{\text{obs}})=1-\Xi_{9}(4.087)\approx 0.0014. $$

**Resultado.** Como valor p $\approx 0.0014 < 0.05 = \alpha$, se **rechaza $H_0$**:
hay evidencia de que la eficiencia media aumentó. De hecho se rechazaría para
cualquier $\alpha > 0.0014$.
