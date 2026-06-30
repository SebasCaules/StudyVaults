---
titulo: Suma de Variables Aleatorias
tipo: concepto
unidad: 7
tags: [suma-de-va, esperanza, varianza, convolucion]
fuentes: ["[[teorica-suma-va-general]]", "[[teorica-suma-va-independientes]]", "[[teorica-suma-promedio-iid]]", "[[tp7-suma-de-va]]"]
actualizado: 2026-06-06
---

# Suma de Variables Aleatorias

**En breve.** Cómo se comporta la v.a. $S=X+Y$: su [[esperanza|esperanza]]
(siempre lineal), su [[varianza|varianza]] (que arrastra la
[[covarianza-y-correlacion|covarianza]] salvo independencia) y su distribución
(por **convolución**). Es la base de toda la unidad.

Página **hub** de la unidad 7. Dadas dos (o más) v.a., estudiamos la v.a.
**suma** $S=X+Y$: su esperanza, su varianza y su distribución.

## Esperanza de una suma (siempre)
La esperanza es **lineal**, sin ninguna hipótesis sobre $X,Y$:
$$ E[X+Y]=E[X]+E[Y],\qquad \mu_S=\mu_X+\mu_Y. $$
Para $n$ v.a.: $\;E[S_n]=\sum_{k=1}^n E[X_k]$.

## Varianza de una suma
En el **caso general** aparece el término de [[covarianza-y-correlacion|covarianza]]
(según [[teorica-suma-va-general]]):
$$ V(X+Y)=V(X)+2\,\mathrm{Cov}(X,Y)+V(Y). $$
Sale de desarrollar $E\big[((X-\mu_X)+(Y-\mu_Y))^2\big]$.

> Si $X,Y$ son **independientes** (o sólo **no correlacionadas**, $\mathrm{Cov}=0$):
> $$ V(X+Y)=V(X)+V(Y). $$
> Ojo: $V(X-Y)=V(X)+V(Y)$ **también suma** (el $(-1)^2$ deja la varianza positiva).

**Intuición (por qué la resta también suma).** La varianza mide *dispersión*, no
tiene signo. Restar $Y$ no "cancela" el ruido de $X$: agrega el ruido propio de
$Y$. Dos fuentes independientes de incertidumbre se acumulan, las sumes o las
restes; lo que cambia de signo es la **media** ($\mu_{X-Y}=\mu_X-\mu_Y$), no la
varianza.

Para $n$ v.a. **independientes**: $\;V(S_n)=\sum_{k=1}^n V(X_k)$.

## Distribución de la suma: convolución

### Caso general (cualquier $X,Y$)
La teórica [[teorica-suma-va-general]] deriva primero la distribución de la suma
**sin** suponer independencia, partiendo de la **conjunta** $p_{X,Y}$ (o
$f_{X,Y}$). Para cada valor de $S=X+Y$ se suman/integran las parejas $(x,y)$ con
$x+y=s$, parametrizando por $y$ (entonces $x=s-y$):
- **Discreta:** $\displaystyle p_S(s)=P(X+Y=s)=\sum_{y\in R_Y} p_{X,Y}(s-y,\,y)$.
- **Continua:** $\displaystyle f_S(s)=\int_{-\infty}^{+\infty} f_{X,Y}(s-y,\,y)\,dy$.

Usando la regla del producto $p_{X,Y}(x,y)=p_{X\mid Y}(x\mid y)\,p_Y(y)$ (idem
con densidades), esto también se escribe con la **condicional**:
$$ p_S(s)=\sum_{y\in R_Y} p_{X\mid Y}(s-y\mid y)\,p_Y(y),\qquad
   f_S(s)=\int_{-\infty}^{+\infty} f_{X\mid Y}(s-y\mid y)\,f_Y(y)\,dy. $$

### Caso independiente: la convolución propiamente dicha
Si $X,Y$ son **independientes**, la conjunta factoriza ($p_{X,Y}=p_X\,p_Y$,
$f_{X,Y}=f_X\,f_Y$) y la fórmula general colapsa en la **convolución**:
- **Discreta:** $\displaystyle p_S(s)=\sum_{y\in R_Y} p_X(s-y)\,p_Y(y)$.
- **Continua:** $\displaystyle f_S(s)=\int_{-\infty}^{+\infty} f_X(s-y)\,f_Y(y)\,dy$.

Los casos importantes (Bernoulli→Binomial, dos Binomiales, dos Poisson, dos
Normales, dos Uniformes, exponenciales→Gamma) están desarrollados en
[[suma-de-va-independientes]].

> **Cuidado:** Para Binomial, Geométrica, Exponencial y Gamma, la suma de dos variables independientes **solo preserva la familia** si comparten el parámetro de probabilidad o tasa ($p$ o $\lambda$). Si $X\sim\mathrm{Bin}(n,p_1)$ e $Y\sim\mathrm{Bin}(m,p_2)$ con $p_1\neq p_2$, entonces $X+Y$ **no** es Binomial. Lo mismo vale para Geométricas con distinto $p$ y para Exponenciales con distinto $\lambda$. La única excepción de la unidad es Poisson: $X\sim\mathrm{Pois}(\lambda_1)$ e $Y\sim\mathrm{Pois}(\lambda_2)$ independientes dan $X+Y\sim\mathrm{Pois}(\lambda_1+\lambda_2)$ **sin importar** si $\lambda_1=\lambda_2$.

## Caso i.i.d.: suma y promedio
Si $X_1,\dots,X_n$ son **i.i.d.** con media $\mu_X$ y varianza $\sigma_X^2$
(según [[teorica-suma-promedio-iid]]):

| | $S_n=\sum_{i=1}^n X_i$ | $\bar X_n=\tfrac1n S_n$ ([[promedio-muestral]]) |
|---|---|---|
| Media | $n\,\mu_X$ | $\mu_X$ |
| Varianza | $n\,\sigma_X^2$ | $\dfrac{\sigma_X^2}{n}\xrightarrow{n\to\infty}0$ |

Que $V(\bar X_n)\to 0$ es la base de la [[ley-de-grandes-numeros|LGN]]; el
comportamiento de $S_n$ y $\bar X_n$ para $n$ grande lo describe el
[[teorema-central-del-limite|TCL]].

> **Intuición.** Por qué sumar geométricas da binomial negativa: si $G_1$ cuenta los intentos hasta el **primer** éxito y $G_2$ los intentos hasta un nuevo primer éxito en una etapa independiente, entonces $G_1+G_2$ cuenta los intentos totales hasta acumular **dos** éxitos, que es exactamente la $\mathrm{BinNeg}(2,p)$. En general, sumar $r$ geométricas i.i.d. de parámetro $p$ da $\mathrm{BinNeg}(r,p)$. La misma lógica aplica a la Exponencial: tiempo hasta el primer evento más tiempo hasta el siguiente evento independiente = tiempo hasta el segundo evento $\sim\Gamma(2,\lambda)$.

## Ejercicio resuelto
*([[tp7-suma-de-va]], ej. 19 de la guía.) Se toman muestras independientes de
tamaño 10 y 15 de una v.a. normal de media 20 y varianza 3. ¿Probabilidad de que
los dos promedios se diferencien (en valor absoluto) en más de 0.3?*

**Planteo.** Sean $D_i\sim\mathcal N(20,\sqrt3)$ ($i=1..10$) y $E_i\sim\mathcal N(20,\sqrt3)$
($i=1..15$), todas independientes. Promedios:
$\bar X_{10}=\tfrac1{10}\sum D_i$, $\;\bar Y_{15}=\tfrac1{15}\sum E_i$.

**Distribución de cada promedio.** Por ser promedios de normales independientes,
son normales con:
$$ E[\bar X_{10}]=20,\quad V(\bar X_{10})=\frac{3}{10};\qquad E[\bar Y_{15}]=20,\quad V(\bar Y_{15})=\frac{3}{15}=\frac15. $$

**Distribución de la diferencia** $W=\bar X_{10}-\bar Y_{15}$ (resta de normales indep. es normal):
$$ E[W]=20-20=0,\qquad V(W)=V(\bar X_{10})+V(\bar Y_{15})=\frac{3}{10}+\frac15=\frac12. $$
O sea $W\sim\mathcal N\!\big(0,\sqrt{1/2}\big)$.

**Cálculo.** Pedimos $P(|W|>0.3)$:
$$ P(|W|>0.3)=2\Big(1-\Phi\big(\tfrac{0.3}{\sqrt{1/2}}\big)\Big)=2\big(1-\Phi(0.3\sqrt2)\big)=2\big(1-\Phi(0.4243)\big). $$
Interpolando en la tabla entre $\Phi(0.42)=0.6628$ y $\Phi(0.43)=0.6664$ se obtiene
$\Phi(0.4243)\approx 0.6643$, luego $P\approx 2(1-0.6643)\approx 0.6714$.

**Resultado.** $\;P(|\bar X_{10}-\bar Y_{15}|>0.3)\approx 0.6714$ (coincide con la
Respuesta del [[tp7-suma-de-va]]).

## Enlaces
- [[suma-de-va-independientes]] — los casos con nombre propio (convoluciones).
- [[esperanza]] · [[varianza]] · [[covarianza-y-correlacion]] — propiedades usadas acá.
- [[teorema-central-del-limite]] · [[ley-de-grandes-numeros]] · [[desigualdad-de-chebyshev]].
- [[promedio-muestral]] — el promedio $\bar X_n$ y su distribución en el muestreo.
- [[formulario-suma-de-va]] — hoja de fórmulas de la unidad (E/V de sumas,
  convoluciones, cotas, LGN, TCL, fractiles).
