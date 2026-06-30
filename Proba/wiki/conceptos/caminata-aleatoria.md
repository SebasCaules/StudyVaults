---
titulo: Caminata Aleatoria (Random Walk)
tipo: concepto
unidad: 6
tags: [procesos-estocasticos, discreto, ejemplo]
fuentes: ["[[teorica-procesos-estocasticos-introduccion]]", "[[tp6-procesos-estocasticos]]"]
actualizado: 2026-06-06
---

# Caminata Aleatoria (Random Walk)

**En breve.** Una partícula (o el capital de un jugador) que en cada paso suma un
$\pm1$ al azar: $X_n=\sum Y_k$. Es el **ejemplo guía** de la unidad para ilustrar
qué significan Markov, incrementos independientes/estacionarios y por qué un
proceso puede tener media constante pero **no** ser estacionario.

**Modela:** una partícula (o el capital de un jugador) que en cada paso se mueve
$+1$ o $-1$ al azar. Es el **ejemplo guía** para presentar las propiedades de los
[[procesos-estocasticos|procesos estocásticos]] (según
[[teorica-procesos-estocasticos-introduccion]]).

> **Intuición.** Es la [[suma-de-variables-aleatorias|suma acumulada]] de pasos
> i.i.d. La media se queda en $0$ (caso simétrico) porque cada $+1$ se compensa con
> un $-1$ en promedio, pero la **dispersión crece**: $\text{Var}[X_n]=n$ se infla
> con cada paso (los errores se acumulan, no se cancelan). Por eso el proceso "se
> aleja" cada vez más del origen aunque su valor esperado no se mueva.

## Definición
$X_n=\sum_{k=1}^{n}Y_k$ con $X_0=0$ y $Y_k$ i.i.d., $P(Y_k=+1)=p$,
$P(Y_k=-1)=1-p$. **Tiempo discreto** ($n\in\mathbb{N}_0$) y **espacio de estados
discreto** ($\mathbb{E}=\mathbb{Z}$). Recorrido de $X_n$: $\{-n,-n+2,\dots,n-2,n\}$.

Caso **simétrico**: $p=1/2$.

![[caminata-aleatoria.svg]]

## Propiedades (qué cumple y qué no)
- **Es un [[procesos-estocasticos#Proceso de Markov|proceso de Markov]]:** el dinero
  tras $n$ jugadas depende solo del dinero tras $n-1$ y del resultado de la jugada
  $n$.
- Tiene [[procesos-estocasticos#Incrementos independientes y estacionarios|incrementos
  independientes y estacionarios]].
- **NO es estacionario** (ni en sentido amplio): $\text{Var}[X_n]$ crece con $n$.
- **NO es un proceso de conteo** porque puede decrecer; pero las "ganancias"
  $G_n\in\{0,1\}$ ($Y_n=2G_n-1$) forman un [[proceso-de-bernoulli|proceso de
  Bernoulli]] con $p$, cuyo conteo $H_n\sim\text{Binomial}(n,p)$ determina $X_n=
  2H_n-n$.

## Distribución y momentos (caso simétrico)
$$ P(X_n=x)=\binom{n}{\frac{n+x}{2}}\Big(\tfrac12\Big)^n,\qquad E[X_n]=0,\quad \text{Var}[X_n]=n. $$
Caso general $p$: $E[X_n]=n(2p-1)$, $\text{Var}[X_n]=4np(1-p)$. (La
[[esperanza|esperanza]] sale por linealidad y la [[varianza|varianza]] por
[[independencia|independencia]] de los pasos; ver el cálculo paso a paso en
[[proceso-de-bernoulli]].)

## Variantes (de la guía)
- **General:** moneda cargada $p\in(0,1)$ ([[tp6-procesos-estocasticos]] Ej. 2).
  La distribución es $P(X_n=k)=\binom{n}{(n+k)/2}\,p^{(n+k)/2}(1-p)^{(n-k)/2}$, con
  $E[X_n]=n(2p-1)$ y $\text{Var}[X_n]=4np(1-p)$.
- **Gaussiana:** caminata con pasos **continuos** (ver más abajo).

## Caminata gaussiana (movimiento Browniano discretizado)
*De [[tp6-procesos-estocasticos]] Ej. 4.* En lugar de pasos $\pm1$, la cantidad
ganada en la jugada $k$-ésima es una v.a. **continua** $G_k\sim N(0,1)$
([[distribucion-normal|normal estándar]]), con las $G_k$ i.i.d. Se define
$X_n=\sum_{k=1}^{n}G_k$ con $X_0=0$.

- **Recorrido y espacio de estados:** para $n>0$, $\mathbb{E}=\mathbb{R}$ (es el
  recorrido de una normal).
- **Distribución:** $X_n$ es suma de $n$ normales estándar independientes; como la
  [[teorica-suma-normales|suma de normales independientes es normal]] (con medias y
  varianzas que se suman):
  $$ X_n=\sum_{k=1}^{n}G_k\ \sim\ N(0,n),\qquad E[X_n]=0,\quad \text{Var}[X_n]=n. $$
- Coincide en momentos con la caminata simétrica ($E=0$, $\text{Var}=n$), pero ahora
  $X_n$ es **continua** en vez de discreta. De hecho, por el
  [[teorema-central-del-limite|TCL]] la caminata simétrica estandarizada
  $X_n/\sqrt{n}$ también tiende a una normal cuando $n$ es grande: ambas versiones
  convergen al mismo límite gaussiano.

> **Interpretación física (nota de la guía):** la longitud de cada paso varía en cada
> instante. Modela una partícula liviana suspendida en un líquido que sufre choques
> continuos de las moléculas; discretizando el tiempo en instantes equiespaciados, los
> golpes la hacen pegar saltos de longitud variable. Es el análogo discreto del
> **movimiento Browniano**, proceso con aplicaciones en física y finanzas.

## Ejercicio resuelto
Ver el desarrollo completo (suma de v.a. i.i.d., $E[X_n]=0$, $\text{Var}[X_n]=n$,
distribución vía $H_n\sim\text{Binomial}$) en la sección **Ejercicio resuelto** de
[[proceso-de-bernoulli]], tomado de [[tp6-procesos-estocasticos]] Ej. 1 (resuelto).
