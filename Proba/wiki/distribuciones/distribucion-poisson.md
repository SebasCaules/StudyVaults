---
titulo: Distribución Poisson
tipo: distribucion
unidad: 3
tags: [discreta, distribucion]
fuentes: ["[[poisson-apunte]]", "[[poisson-aproximacion-binomial-apunte]]", "[[tp3-variables-aleatorias-discretas]]"]
actualizado: 2026-06-06
---

# Distribución Poisson

**En breve.** Cuenta eventos **raros** que ocurren a una tasa media $\lambda$
constante en un intervalo (llamadas por hora, defectos por metro). Su sello: media
y varianza coinciden ($=\lambda$). Aparece como límite de una
[[distribucion-binomial|Binomial]] con muchos ensayos y $p$ chico.

**Modela:** el número de ocurrencias de un evento en un intervalo (de tiempo,
espacio, etc.) cuando ocurren a una tasa media constante.
**Soporte:** $\mathcal{R}_X = \mathbb{N}_0 = \{0, 1, 2, \dots\}$.
**Parámetros:** $\lambda > 0$ = número medio de ocurrencias en el intervalo.

Se nota $X \sim \text{Poisson}(\lambda)$. Ejemplos
([[poisson-apunte]]): número de accesos a un servidor por minuto, partículas
emitidas por una sustancia radioactiva, pasajeros que llegan a una parada por hora.

## Función de masa
$$ p_X(k) = P(X=k) = \frac{\lambda^{k}}{k!}\,e^{-\lambda}, \qquad k \in \mathbb{N}_0 $$

> Normaliza con la serie de la exponencial:
> $\sum_{k=0}^\infty \tfrac{\lambda^k}{k!}e^{-\lambda} = e^{-\lambda}\,e^{\lambda} = e^0 = 1$.

## Esperanza y varianza
- $E[X] = \mu_X = \lambda$
- $V(X) = \sigma_X^2 = \lambda$

> Propiedad distintiva: **media y varianza son iguales** ($\mu_X = \sigma_X^2 =
> \lambda$). Se demuestran ([[poisson-apunte]]) reindexando: $E[X]=\lambda$ y, con
> $k^2 = k(k-1)+k$, $E[X^2] = \lambda^2 + \lambda$, de donde $V(X)=\lambda$.

> **Observación.** Que media y varianza coincidan no es un accidente: la Poisson hereda esta propiedad de la Binomial. La varianza de una $\text{Binomial}(n,p)$ es $np(1-p)$; cuando $p$ es chico, $1-p \approx 1$ y por tanto $np(1-p) \approx np = \lambda$. En el límite $n\to\infty,\ p\to 0$ con $np=\lambda$ fijo, la varianza converge exactamente a $\lambda$, igual que la media. Esto también explica por qué la aproximación exige $p$ chico: si $p$ no fuera pequeño, la varianza de la Binomial quedaría por debajo de $\lambda$ y las dos distribuciones dejarían de parecerse.

## Función generadora de momentos
$$ M_X(t) = e^{\lambda(e^t - 1)} $$
(ver [[funcion-generadora-de-momentos|FGM]]).

## Relaciones con otras distribuciones
- **Aproximación a la [[distribucion-binomial|Binomial]]** (ver sección siguiente).
- La suma de [[independencia|Poisson independientes]] es Poisson:
  $\text{Poisson}(\lambda_1) + \text{Poisson}(\lambda_2) = \text{Poisson}(\lambda_1+\lambda_2)$.
- Surge del **proceso de Poisson**; los tiempos entre eventos son
  [[distribucion-exponencial|exponenciales]].

## Aproximación de Poisson a la Binomial

> **Intuición.** Partí un intervalo en $n$ "ranuras" diminutas; en cada una el
> evento ocurre o no, con probabilidad chiquita $p$. Eso es una
> [[distribucion-binomial|Binomial$(n,p)$]]. Si hacés las ranuras cada vez más
> finas ($n\to\infty$) manteniendo fija la tasa esperada $\lambda=np$, la binomial
> "se congela" en la Poisson. Por eso la Poisson modela conteos donde **no hay un
> $n$ natural**: solo importa la tasa media.

Cuando $n$ es **grande** y $p$ **chico**, la [[distribucion-binomial|Binomial$(n,p)$]]
se aproxima por una Poisson de parámetro $\lambda = n\,p$
([[poisson-aproximacion-binomial-apunte]]):
$$ P(X=k) = \binom{n}{k}p^k(1-p)^{\,n-k} \;\approx\; \frac{(np)^k}{k!}\,e^{-np} $$

**Proposición.** Sea $\{p_n\}$ una secuencia con $\lim_{n\to\infty} n\,p_n = \lambda > 0$.
Entonces, para todo $k \in \mathbb{N}_0$:
$$ \lim_{n\to\infty}\binom{n}{k}p_n^{\,k}(1-p_n)^{\,n-k} = \frac{\lambda^k}{k!}\,e^{-\lambda} $$

> Idea de la demostración: se usa $\binom{n}{k}p_n^k = \tfrac{(np_n)^k}{k!}\cdot
> \tfrac{n(n-1)\cdots(n-k+1)}{n^k}$, que tiende a $\tfrac{\lambda^k}{k!}$, y
> $(1-p_n)^{n} \to e^{-\lambda}$ (porque $(1+x/n)^n \to e^x$), mientras que
> $(1-p_n)^{-k}\to 1$. La cátedra ilustra con $p=0{,}001$: ya con $n$ moderado,
> $P(X_n=0)=(1-p)^n$ (binomial) y $e^{-np}$ (Poisson) coinciden en varias cifras.

> **Cuidado:** Para que la aproximación sea válida no basta con $n$ grande y $p$ chico por separado: también hace falta que $\lambda = np$ quede **acotado** (en la práctica, $\lambda < 10$ como referencia). Si $p = 0{,}01$ pero $n = 10{,}000$, entonces $\lambda = 100$ y la Binomial sigue siendo una Binomial grande que la Poisson ya no aproxima bien. Las condiciones se resumen en: $n \gg 1$, $p \ll 1$ **y** $np = \lambda$ de magnitud razonable.

## Cuándo usarla (reconocer en un ejercicio)
- Conteos de eventos **raros** en un intervalo, dada una tasa media $\lambda$.
- "Número medio de ... por (hora / km / página)".
- Binomial con $n$ muy grande y $p$ muy chico (eventos poco probables en muchos
  ensayos): usar Poisson con $\lambda = np$.

## Ejercicio resuelto

**Enunciado** ([[tp3-variables-aleatorias-discretas]] ej. 34). Una fábrica envía 500
artículos. La probabilidad de deterioro de un artículo en el camino es $0{,}002$.
Hallar la probabilidad de que se deterioren: a) exactamente 3; b) menos de 3;
d) por lo menos uno.

**Planteo.** Sea $X$ = n.º de artículos deteriorados, $X \sim
\text{Binomial}(500,\ 0{,}002)$. Como $n=500$ es grande y $p=0{,}002$ chico,
aproximamos por $\text{Poisson}(\lambda)$ con $\lambda = np = 500\cdot 0{,}002 = 1$.

**Cálculo.** Con $p_X(k) = \tfrac{1^k}{k!}e^{-1} = \tfrac{e^{-1}}{k!}$:
- a) $P(X=3) = \tfrac{e^{-1}}{3!} = \tfrac{e^{-1}}{6} \approx 0{,}0613$.
- b) $P(X<3) = P(0)+P(1)+P(2) = e^{-1}\left(1 + 1 + \tfrac12\right) = 2{,}5\,e^{-1} \approx 0{,}920$.
- d) $P(X\ge 1) = 1 - P(X=0) = 1 - e^{-1} \approx 0{,}632$.

**Resultado.** a) $\approx 0{,}061$; b) $\approx 0{,}92$; d) $\approx 0{,}632$.

> Ejemplo adicional ([[poisson-apunte]]): si los pasajeros que llegan a una parada
> en 1 hora son $X \sim \text{Poisson}(5)$, entonces $P(X=0) = e^{-5}$ y
> $P(X \le 2) = e^{-5}(1 + 5 + 12{,}5) = 18{,}5\,e^{-5} \approx 0{,}125$.

### Ejercicio resuelto — n mínimo: binomial exacta vs aproximación Poisson (artillería)

**Enunciado** ([[tp3-variables-aleatorias-discretas]] ej. 32). Una batería de
artillería dispara a un blanco con probabilidad de acertar $p=0{,}01$ por disparo.
¿Cuántos disparos $n$ necesita para tener probabilidad $\ge 90\%$ de acertar **al
menos una vez**? Resolver con binomial y con la aproximación Poisson, y comparar.

**Planteo.** $X_n\sim\text{Binomial}(n,p)$ = aciertos en $n$ tiros. Se pide
$$P(X_n\ge 1)=1-P(X_n=0)\ge 0{,}9 \iff P(X_n=0)\le 0{,}1.$$

**Cálculo (binomial exacta).** $P(X_n=0)=(1-p)^n\le 0{,}1$, tomando logaritmo
(creciente) y dando vuelta el signo porque $\log(1-p)<0$:
$$ n \ge \frac{-1}{\log_{10}(1-p)} = \frac{-1}{\log_{10}(0{,}99)} \approx 229{,}1 \;\Rightarrow\; n_{\min}^{(b)} = 230. $$

**Cálculo (aproximación Poisson, $\lambda=np$).** $P(X_n=0)\approx e^{-np}\le 0{,}1$:
$$ n \ge \frac{-\ln(0{,}1)}{p} = \frac{\ln 10}{0{,}01} \approx 230{,}26 \;\Rightarrow\; n_{\min}^{(P)} = 231. $$

**Resultado.** $n_{\min}^{(b)}=230$ (binomial) vs $n_{\min}^{(P)}=231$ (Poisson):
difieren en **1 disparo**. El raw tabula la razón para $p\in[0{,}01;\,0{,}10]$ y la
diferencia entre ambos métodos **nunca supera 2** disparos: con $p$ chico, la
Poisson aproxima muy bien a la binomial incluso para este cálculo de tamaño mínimo.
La aproximación tiende a pedir un disparo de más (es ligeramente conservadora).
