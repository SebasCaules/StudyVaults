---
titulo: Desigualdades de Markov y de Chebyshev
tipo: teorema
unidad: 7
tags: [desigualdad, cota, varianza, teorema]
fuentes: ["[[teorica-markov-chebyshev]]", "[[tp7-suma-de-va]]"]
actualizado: 2026-06-06
---

# Desigualdades de Markov y de Chebyshev

**En breve.** Dan una **cota superior** de la probabilidad de que una v.a. se
aleje de su media (Chebyshev) o supere un umbral (Markov), usando sólo
[[esperanza|esperanza]] y/o [[varianza|varianza]]. Útiles cuando no se conoce la
distribución y para demostrar la [[ley-de-grandes-numeros|LGN]].

Dos **cotas universales** de probabilidad. No suponen nada sobre la forma de la
distribución (sólo momentos) $\Rightarrow$ son **válidas siempre pero poco
ajustadas**. Según [[teorica-markov-chebyshev]].

**Intuición (por qué son flojas).** Como valen para *cualquier* distribución con
esos momentos, deben cubrir incluso el peor caso posible. Una distribución
concreta y "bien portada" (p. ej. la Normal) concentra mucho más cerca de la
media que ese peor caso, así que la probabilidad real suele ser muchísimo menor
que la cota. Por eso Chebyshev garantiza $\ge 0.84$ donde la verdad es $\approx
0.98$ (ver el ejercicio).

## Desigualdad de Markov
Si $X$ es una v.a. que **sólo toma valores no negativos** ($X\ge 0$), entonces
para todo $\alpha>0$:
$$
P(X\ge\alpha)\le\frac{E[X]}{\alpha}.
$$

**Idea de demostración** (caso continuo): con la función indicadora
$\mathbb 1_{\{x\ge\alpha\}}$,
$$
P(X\ge\alpha)=\int_\alpha^\infty f_X(x)\,dx=\int_{-\infty}^\infty \mathbb 1_{\{x\ge\alpha\}}f_X(x)\,dx\le\int_{-\infty}^\infty \frac{x}{\alpha}\,f_X(x)\,dx=\frac{E[X]}{\alpha},
$$
porque donde $\mathbb 1=1$ es $x\ge\alpha$, luego $\tfrac{x}{\alpha}\ge 1$.

> El TP7 la enuncia de forma equivalente con $|X|$: $\;P(|X|\ge\varepsilon)\le\dfrac{E[|X|]}{\varepsilon}$.

> **Ejemplo.** Martín sabe que la basura que junta en el fin de semana tiene media $\mu = 100\,\text{kg}$, pero desconoce la distribución (sólo sabe que es no negativa). El camión tiene capacidad $200\,\text{kg}$. Aplicando Markov:
> $$P(X \ge 200) \le \frac{E[X]}{200} = \frac{100}{200} = \frac{1}{2}.$$
> Sin saber nada más, garantiza que a lo sumo el $50\%$ de las veces la basura excede la capacidad del camión.

## Desigualdad de Chebyshev
Sea $X$ una v.a. con media $\mu$ y varianza $\sigma_X^2$. Para todo $\varepsilon>0$:
$$
P(|X-\mu|\ge\varepsilon)\le\frac{\sigma_X^2}{\varepsilon^2}.
$$

**Idea de demostración:** aplicar Markov a la v.a. no negativa $(X-\mu)^2$ con $\alpha=\varepsilon^2$:
$$
P(|X-\mu|\ge\varepsilon)=P\big((X-\mu)^2\ge\varepsilon^2\big)\le\frac{E[(X-\mu)^2]}{\varepsilon^2}=\frac{\sigma_X^2}{\varepsilon^2}.
$$

![[chebyshev-cota.svg]]

### Forma para promedios (i.i.d.)
Si $\{X_k\}_{k=1}^n$ son i.i.d. y $\bar X_n=\tfrac1n\sum X_k$ ([[promedio-muestral]]),
como $V(\bar X_n)=\sigma_X^2/n$:
$$
P\big(|\bar X_n-\mu|\ge\varepsilon\big)\le\frac{\sigma_X^2}{n\,\varepsilon^2}\xrightarrow{n\to\infty}0.
$$
Este es el puente directo a la [[ley-de-grandes-numeros|Ley de los Grandes Números]].

## Ejercicio resuelto
*([[tp7-suma-de-va]], ej. 3 de la guía, parte Chebyshev.) Un cañón acierta con
prob. $0.8$; $X$ = número de blancos en $100$ disparos independientes. Acotar
$P(70<X<90)$ con Chebyshev.*

**Planteo.** $X\sim\mathrm{Bin}(100,0.8)$, $E[X]=100\cdot0.8=80$,
$V(X)=100\cdot0.8\cdot0.2=16$.

**Reescritura simétrica.** $70<X<90 \iff |X-80|<10$, así que
$$
P(70<X<90)=P(|X-80|<10)=1-P(|X-80|\ge 10).
$$

**Cota de Chebyshev** con $\varepsilon=10$:
$$
P(|X-80|\ge 10)\le\frac{16}{10^2}=0.16.
$$

**Resultado.** $\;P(70<X<90)\ge 1-0.16=0.84.$
La cota es **correcta pero floja**: el valor verdadero (vía binomial/normal) es
$\approx 0.983$ — ver [[aproximacion-normal-de-la-binomial]]. Chebyshev sólo
garantiza $\ge 0.84$.

> **Ejemplo.** Un DJ pone $M$ canciones por evento con $E[M] = 150$ y $V(M) = 500$; la distribución es desconocida. Chebyshev con $\varepsilon = 50$:
> $$P(|M - 150| \ge 50) \le \frac{500}{50^2} = \frac{500}{2500} = 0.2.$$
> Tomando el complemento: $P(100 < M < 200) = P(|M - 150| < 50) \ge 1 - 0.2 = 0.8.$
> El DJ sabe que al menos el $80\%$ de los eventos queda dentro del rango deseado, sin conocer la distribución de $M$.

> **Cuidado:** Chebyshev acota $P(|X - \mu| \ge \varepsilon) \le \tfrac{\sigma^2}{\varepsilon^2}$ (cota superior). Si lo que se quiere es $P(a < X < b)$ con $[a,b]$ simétrico alrededor de $\mu$, hay que pasar al complemento:
> $$P(|X - \mu| < \varepsilon) \ge 1 - \frac{\sigma^2}{\varepsilon^2},$$
> lo que **invierte la desigualdad** (de $\le$ a $\ge$). El resultado es una cota inferior, no superior.

## Cuándo usarlas
- Cuando **no conocés la distribución**, sólo media y/o varianza.
- Para **dimensionar tamaños de muestra** garantizando una cota (ej. 14, 15, 16 del [[tp7-suma-de-va]]).
- Para **demostrar la LGN débil**.

## Enlaces
- [[ley-de-grandes-numeros]] (consecuencia directa) · [[teorema-central-del-limite]] (da cotas más ajustadas).
- [[varianza]] · [[esperanza]] · [[promedio-muestral]].
