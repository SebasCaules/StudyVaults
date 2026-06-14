---
titulo: Proceso de Poisson
tipo: concepto
unidad: 6
tags: [procesos-estocasticos, continuo, proceso-de-conteo]
fuentes: ["[[teorica-proceso-de-poisson]]", "[[tp6-procesos-estocasticos]]"]
actualizado: 2026-06-06
---

# Proceso de Poisson

**En breve.** Modela eventos que caen "al azar" en tiempo continuo a una tasa
$\lambda$ constante (llamadas, arribos, fallas). Es el **límite continuo** del
[[proceso-de-bernoulli|proceso de Bernoulli]]: conteos $\sim$
[[distribucion-poisson|Poisson]], tiempos entre eventos $\sim$
[[distribucion-exponencial|Exponencial]].

**Modela:** la ocurrencia de eventos "al azar" en **tiempo continuo** a una tasa
constante: llamadas a una central, arribos a una cola, emisión de partículas,
fallas de un sistema, etc.
**Tipo:** [[procesos-estocasticos#Proceso de conteo|proceso de conteo]] de tiempo
continuo.

> **Intuición.** Tomá un [[proceso-de-bernoulli|proceso de Bernoulli]] y hacé los
> ticks del reloj infinitamente finos: en cada instante diminuto $h$ hay un evento
> con probabilidad $\lambda h$ (a lo sumo uno). El conteo Binomial se vuelve
> [[distribucion-poisson|Poisson]] y la espera Geométrica se vuelve
> [[distribucion-exponencial|Exponencial]]. La **tasa** $\lambda$ es el promedio de
> eventos por unidad de tiempo; todo lo demás sale de ahí ajustando unidades.

## Definición
$\{N(t)\}_{t\ge0}$ es un **proceso de Poisson con tasa $\lambda>0$** sii es un
proceso de conteo que cumple (según [[teorica-proceso-de-poisson]]):
1. Tiene [[procesos-estocasticos#Incrementos independientes y estacionarios|incrementos independientes]].
2. Los incrementos son **estacionarios**.
3. $P\big(N(t{+}h)-N(t)=1\big)=\lambda h+o(h)$ (un evento en un intervalo corto $h$).
4. $P\big(N(t{+}h)-N(t)>1\big)=o(h)$ (no hay eventos simultáneos).

Notación de **infinitésimo**: $f(h)=o(h)$ sii $\displaystyle\lim_{h\to0}\frac{f(h)}{h}=0$.
La condición 3 dice que $\lambda$ es la **tasa de generación de eventos**; la 2
garantiza que el proceso luce igual en cualquier intervalo de la misma longitud;
la 4 prohíbe eventos simultáneos.

## Distribución de los conteos
A partir de las condiciones se deduce el **sistema de ecuaciones diferenciales**
para $P_n(t)=P(N(t)=n)$:
$$ \dot P_0(t)=-\lambda P_0(t),\quad P_0(0)=1; \qquad \dot P_n(t)=-\lambda P_n(t)+\lambda P_{n-1}(t),\quad P_n(0)=0\ (n\ge1). $$
Resolviendo por inducción ($P_0(t)=e^{-\lambda t}$, $P_1(t)=\lambda t\,e^{-\lambda t}$, …)
se obtiene $N(t)\sim$ [[distribucion-poisson|Poisson]]$(\lambda t)$:
$$ \boxed{\,P(N(t)=n)=\frac{(\lambda t)^n}{n!}\,e^{-\lambda t}\quad(n\ge0).\,} $$
Por incrementos estacionarios, el conteo en cualquier intervalo de longitud
$\tau$ es $\text{Poisson}(\lambda\tau)$. En particular $E[N(t)]=\text{Var}[N(t)]=
\lambda t$.

## Tiempos entre eventos
Sea $\tau_{n+1}$ el tiempo desde el evento $n$ hasta el $n{+}1$. Como
$P(\tau_{n+1}>t)=P(\Delta N(t)=0)=P(N(t)=0)=e^{-\lambda t}$ para $t>0$:
$$ F_{\tau_{n+1}}(t)=1-e^{-\lambda t}\quad (t>0), $$
de donde $\tau_{n+1}\sim$ [[distribucion-exponencial|Exponencial]]$(\lambda)$ i.i.d.
El **tiempo hasta el $k$-ésimo evento** $T_k=\tau_1+\dots+\tau_k$ es
[[suma-de-variables-aleatorias|suma]] de $k$ exponenciales i.i.d., es decir una
**[[distribucion-erlang|Erlang]]$(k,\lambda)$** (Gamma de parámetro entero).

> **Caracterización alternativa:** $N(t)$ es un proceso de Poisson de tasa
> $\lambda$ $\iff$ los tiempos entre eventos $\tau_n\sim\text{Expo}(\lambda)$
> i.i.d. ($n\ge1$).

## Dualidad conteo ↔ tiempo (clave para ejercicios)
$T_k$ = instante del $k$-ésimo evento. Entonces, mirando la definición de proceso
de conteo:
$$ T_k< t \iff N(t)\ge k. $$
Esto permite pasar de preguntas sobre **tiempos** (Erlang/Exponencial) a preguntas
sobre **conteos** (Poisson) y viceversa.

## Relaciones con otras distribuciones / procesos
- Marginal: [[distribucion-poisson|Poisson]]; tiempos entre eventos:
  [[distribucion-exponencial|Exponencial]] (falta de memoria); tiempo al
  $k$-ésimo: [[distribucion-erlang|Erlang]].
- Es la **versión continua** del [[proceso-de-bernoulli|proceso de Bernoulli]]:
  ver [[relacion-bernoulli-poisson]].

## Cuándo usarlo (reconocer en un ejercicio)
- Eventos que ocurren "al azar" en tiempo continuo a un **promedio/tasa**
  constante ($\lambda$ por unidad de tiempo).
- "¿Cuántos eventos en un tiempo $t$?" → Poisson($\lambda t$). "¿Tiempo hasta el
  próximo / entre eventos?" → Exponencial. "¿Tiempo hasta el $k$-ésimo?" → Erlang.
- Recordá ajustar la tasa a la longitud del intervalo (mismas unidades).

## Ejercicio resuelto
*De [[tp6-procesos-estocasticos]] Ej. 8 (resuelto). En un banco se atiende en
promedio a 4 clientes cada 6 minutos según un proceso de Poisson. Calcular: (a)
$P(\ge6$ clientes en 6 min$)$; (b) $P($atender un cliente tome $>3$ min$)$; (c)
$P($atención entre 2 y 4 min$)$; (d) $P($atender 10 clientes tome $<10$ min$)$.*

**Tasa.** $\lambda=\dfrac{4}{6}=\dfrac23\ \text{min}^{-1}$.

**(a)** En 6 min, $N(6)\sim\text{Poisson}(\lambda\cdot6)=\text{Poisson}(4)$:
$$ P(N(6)\ge6)=1-\sum_{k=0}^{5}\frac{4^k}{k!}e^{-4}\approx 1-0.7851=0.2149. $$

**(b)–(c)** El tiempo de atención (entre eventos) $T\sim\text{Expo}(2/3)$, en
minutos. Usando $F_T(t)=1-e^{-\frac23 t}$:
$$ P(T>3)=e^{-\frac23\cdot3}=e^{-2}\approx 0.1353. $$
$$ P(2<T<4)=F_T(4)-F_T(2)=e^{-4/3}-e^{-8/3}\approx 0.1941. $$

**(d)** Sea $T_{10}$ el tiempo de atención de 10 clientes. Por la **dualidad**
$T_{10}<10 \iff N(10)\ge10$, con $N(10)\sim\text{Poisson}(\lambda\cdot10)=
\text{Poisson}(20/3)$:
$$ P(T_{10}<10)=P\big(N(10)\ge10\big)=1-\sum_{k=0}^{9}\frac{(20/3)^k}{k!}e^{-20/3}\approx 1-0.8626=0.1374. $$

**Resultado.** (a) $0.2149$, (b) $0.1353$, (c) $0.1941$, (d) $0.1374$.

> Nota: la clave de respuestas del TP6 da $0.1374$ para (d), valor que coincide con el
> redondeo correcto. La *resolución* paso a paso del raw escribe $0.1373$ por truncar un
> dígito en un paso intermedio; usamos $0.1374$.
