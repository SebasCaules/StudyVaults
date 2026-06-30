---
titulo: Cadenas de Markov
tipo: concepto
unidad: 6
tags: [procesos-estocasticos, markov, matriz-de-transicion]
fuentes: ["[[teorica-cadenas-de-markov]]", "[[tp6-procesos-estocasticos]]"]
actualizado: 2026-06-06
---

# Cadenas de Markov

**En breve.** Una cadena de Markov es un [[procesos-estocasticos#Proceso de Markov|proceso de Markov]]
con estados **discretos**: salta entre pocos estados y el próximo depende solo del
actual. Todo se calcula con una **matriz de transición** $\mathbb{P}$; las
preguntas típicas son "¿dónde estoy tras $n$ pasos?" ($\vec p(0)\mathbb{P}^n$) y
"¿qué pasa a largo plazo?" (distribución estacionaria $\vec\pi$).

**Modela:** sistemas que saltan entre un conjunto **discreto** de estados, donde
el próximo estado depende **solo del actual** (no de la historia): clima,
posición de un jugador, marca de un cliente, etc.

Una **cadena de Markov** es un [[procesos-estocasticos#Proceso de Markov|proceso
de Markov]] con espacio de estados **discreto** $\mathbb{E}=\{s_1,s_2,\dots\}$.
Nos concentramos en cadenas con conjunto de índices también discreto
($\mathbb{T}=\mathbb{N}_0$). Queda descripta por (según
[[teorica-cadenas-de-markov]]):

1. La **distribución inicial** $p_j(0)=P(X(0)=s_j)$, con $\sum_j p_j(0)=1$.
2. Las **probabilidades de transición** $p_{ij}(n)=P\big(X(n{+}1)=s_j\mid X(n)=
   s_i\big)$, con $\sum_j p_{ij}(n)=1$ para todo $i$ (de cada estado se sale a
   alguno).

## Matriz de transición
$$ \mathbb{P}(n)=\begin{pmatrix} p_{11}(n) & p_{12}(n) & \cdots\\ p_{21}(n) & p_{22}(n) & \cdots\\ \vdots & \vdots & \ddots \end{pmatrix},\qquad \text{cada fila suma 1 (matriz estocástica)}. $$
Con el **vector de probabilidades de estado** $\vec p(n)=(p_1(n)\ p_2(n)\ \cdots)$
(suma 1), la ecuación de Chapman-Kolmogorov se escribe
$$ \vec p(n+1)=\vec p(n)\,\mathbb{P}(n). $$

> **Intuición.** La fila $i$ de $\mathbb{P}$ es la
> [[probabilidad-condicional|distribución condicional]] de "a dónde voy si estoy en
> $s_i$" (por eso suma 1). Multiplicar el vector de estado por $\mathbb{P}$ es
> "avanzar un paso promediando sobre todos los destinos posibles", y elevar
> $\mathbb{P}$ a la $k$ comprime $k$ pasos en una sola matriz: $(\mathbb{P}^k)_{ij}$
> suma las probabilidades de **todos los caminos** de $i$ a $j$ en $k$ pasos.

### Cadena homogénea
La cadena es **homogénea** si $p_{ij}(n)=p_{ij}$ no depende del tiempo. Entonces
$\mathbb{P}$ es constante y
$$ \vec p(n)=\vec p(0)\,\mathbb{P}^{n}. $$
La matriz de **$k$ pasos** es $\mathbb{P}^{(k)}=\mathbb{P}^k$ (sus entradas son las
probabilidades de ir de un estado a otro en exactamente $k$ pasos).

> **Cuidado:** $(\mathbb{P}^k)_{ij}$ es la probabilidad de ir de $s_i$ a $s_j$ en $k$ pasos **avanzando en el tiempo**: el condicionante está en el pasado y el condicionado en el futuro. El atajo de la potencia de la matriz **no vale** cuando la condicional está invertida. Si querés $P(X_n=s_i\mid X_{n+k}=s_j)$ —el pasado dado el futuro—, $(\mathbb{P}^k)_{ij}$ da otro número; en ese caso resolvé siempre vía intersección y dividí por el condicionante.

## Diagrama de estados
Grafo dirigido y etiquetado: un nodo por estado, una arista $s_i\to s_j$
etiquetada con $p_{ij}$. La **suma de las etiquetas de las aristas que salen de un
nodo es 1**.

![[markov-diagrama.svg]]

## Tipos de estados (cadenas homogéneas)
- **Accesibilidad / comunicación:** $s_j$ es accesible desde $s_i$ sii
  $p_{ij}^{(n)}>0$ para algún $n$. Si además $s_i$ es accesible desde $s_j$, se
  **comunican**.
- **Irreducible:** todos los estados se comunican (una sola clase).
- **Recurrente / transitorio:** sea $r_i$ la probabilidad de volver a $s_i$
  partiendo de $s_i$. $s_i$ es **recurrente** si $r_i=1$, **transitorio** si
  $r_i<1$.
- **Periódico:** $m_i$ = mayor entero tal que $p_{ii}^{(n)}=0$ cuando $n$ no es
  divisible por $m_i$. Si $m_i=1$ el estado es **aperiódico**; si $m_i>1$ es
  **periódico** de período $m_i$.
- **Absorbente:** estado del que no se sale ($p_{ii}=1$). P. ej. "la muerte".

## Distribución estacionaria
La **distribución estacionaria** (o de largo plazo) $\vec\pi$ satisface
$$ \vec\pi=\vec\pi\,\mathbb{P},\qquad \textstyle\sum_j \pi_j=1. $$
Es decir, $\vec\pi$ es el **autovector a izquierda** de $\mathbb{P}$ asociado al
autovalor 1. (No toda solución de $\vec\pi=\vec\pi\mathbb{P}$ es una distribución
estacionaria: hay que pedir que sea distribución de probabilidad.)

> **Intuición.** $\vec\pi$ es la distribución que **se reproduce a sí misma**: si
> arrancás con ella, tras un paso seguís con ella ("régimen de equilibrio"). En una
> cadena regular es además el límite al que tiende el sistema sin importar de dónde
> partas: la fracción de tiempo a largo plazo que pasás en cada estado. Por eso
> "comportamiento de largo plazo" $\equiv$ resolver $\vec\pi=\vec\pi\mathbb{P}$.

> **Condición suficiente (cadena regular):** si existe $n\ge1$ tal que todos los
> elementos de $\mathbb{P}^n$ son positivos, $\mathbb{P}$ es **regular**; entonces
> la cadena es irreducible, recurrente y aperiódica, y existe
> $\vec\pi=\lim_{n\to\infty}\vec p(n)$ **independiente** de $\vec p(0)$.

Cuando la cadena es **periódica** puede no existir $\vec\pi$ como límite, aunque
los promedios temporales sí convergen (ejemplo del "bebé" en
[[teorica-cadenas-de-markov]]).

> **Cuidado:** Resolver $\vec\pi=\vec\pi\,\mathbb{P}$ con $\sum_j\pi_j=1$ **garantiza** que $\vec\pi$ es la distribución estacionaria solo si la cadena **ya fue verificada como regular**. El orden importa: primero verificar regularidad, recién después aplicar el autovector a izquierda. Si la cadena no es regular y se aplica igual el procedimiento, el vector hallado puede no ser la distribución estacionaria (y aunque numéricamente dé bien, el razonamiento no es válido: es por carambola).

> **Observación.** Que una cadena **no sea regular** no implica que no tenga distribución estacionaria: hay que analizar cada caso por separado.
> - **Un único estado absorbente accesible desde todos los demás:** sin importar dónde arranque, la cadena termina en ese estado con probabilidad 1 → sí hay distribución estacionaria (concentrada en el absorbente).
> - **Dos o más estados absorbentes:** la cadena termina en uno u otro según el estado inicial; las filas de $\mathbb{P}^n$ no convergen a un mismo vector → no hay un comportamiento de largo plazo unificado, no existe distribución estacionaria global.
> - **Cadena periódica:** las potencias $\mathbb{P}^n$ oscilan entre valores y no convergen → no existe $\vec\pi$ como límite.
> - **Estado transitorio que comunica con una subclase regular:** a largo plazo la cadena se comporta como esa subclase, y la distribución estacionaria de la subclase describe el comportamiento de largo plazo.

## Tiempo hasta absorción
Si $s_1,\dots,s_k$ son absorbentes, ordenando los estados
$\mathbb{P}=\begin{pmatrix}\mathbb{I}_{k\times k} & \mathbf{0}\\ \mathbb{F} & \mathbb{Q}\end{pmatrix}$.
Con $\mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$: $\mathbb{M}(i,j)$ es el tiempo
esperado en $s_{k+j}$ partiendo de $s_{k+i}$ antes de la absorción, y
$\mathbb{G}=\mathbb{M}\,\mathbb{F}$ da $\mathbb{G}(i,j)=P($absorbido por $s_j\mid$
partió de $s_{k+i})$ (de [[tp6-procesos-estocasticos]] sección de repaso).

> **Cadena absorbente ↔ tiempo de vida geométrico** ([[tp6-procesos-estocasticos]]
> Ej. 24). Proceso de dos estados $\{V\text{ (vivo)},M\text{ (muerto)}\}$ con $X_0=V$,
> $P(X_n=V\mid X_{n-1}=V)=1-p$, $P(X_n=M\mid X_{n-1}=V)=p$ y $M$ absorbente
> ($p_{MM}=1$). Sea $N$ = años de vida. La persona muere exactamente en el año $k$ si
> sobrevivió los $k$ años previos y muere en el siguiente, por lo que
> $$ P(N=0)=p,\qquad P(N=k)=\underbrace{(1-p)^k}_{\text{sobrevive }k\text{ años}}\,p\quad(k\ge1). $$
> Es una [[distribucion-geometrica|geométrica]] (convención "nº de fracasos antes del
> éxito", con el "éxito" = morir), de donde $E[N]=\dfrac{1-p}{p}$. La potencia de la
> matriz es $\mathbb{P}^n=\begin{pmatrix}1&0\\ 1-(1-p)^n&(1-p)^n\end{pmatrix}$ y su
> límite manda toda la masa al estado absorbente $M$. Es el patrón general "tiempo hasta
> absorción de una cadena con un único estado de salida" → geométrica.

## Cuándo usarla (reconocer en un ejercicio)
- Un sistema con **pocos estados discretos** y reglas "del estado actual al
  siguiente" con probabilidades fijas → arma $\mathbb{P}$ y un diagrama.
- "¿Probabilidad de estar en tal estado tras $n$ pasos?" → $\vec p(0)\mathbb{P}^n$.
- "¿Comportamiento / frecuencia a largo plazo?" → distribución estacionaria
  $\vec\pi=\vec\pi\mathbb{P}$.

## Ejercicios resueltos

### Largo plazo de una cadena regular
*De [[tp6-procesos-estocasticos]] Ej. 17 (resuelto). Cadena de Markov homogénea
con $\mathbb{E}=\{a,b,c\}$ y*
$$ \mathbb{P}=\begin{pmatrix}0.3 & 0.4 & 0.3\\ 1 & 0 & 0\\ 0 & 0.3 & 0.7\end{pmatrix}. $$
*(a) Calcular $P(X_2=a\mid X_1=b, X_0=c)$. (b) Calcular $P(X_{35}=a\mid X_{33}=a)$.
(c) Estimar $P(X_{200}=a\mid X_0=b)$.*

**(a)** Por la propiedad de Markov, el condicionante se reduce al último instante:
$$ P(X_2=a\mid X_1=b,X_0=c)=P(X_2=a\mid X_1=b)=p_{ba}=1. $$
(fila $b$, columna $a$ de $\mathbb{P}$).

**(b)** Es una transición en **2 pasos**, $(\mathbb{P}^2)_{aa}$. Sumando los
caminos $a\to\{a,b,c\}\to a$:
$$ P(X_{35}=a\mid X_{33}=a)=\sum_{i}p_{ai}\,p_{ia}=\underbrace{0.3^2}_{a\to a\to a}+\underbrace{0.4\cdot1}_{a\to b\to a}+\underbrace{0.3\cdot0}_{a\to c\to a}=0.49. $$

**(c) Largo plazo.** Como $\mathbb{P}^2=\begin{pmatrix}0.49&0.21&0.3\\0.3&0.4&0.3\\
0.3&0.21&0.49\end{pmatrix}>0$, la cadena es **regular** y existe estacionaria
$\vec\pi=(a,b,c)$ independiente del inicio. Resolviendo
$\vec\pi=\vec\pi\mathbb{P}$ con $a+b+c=1$:
$$ \begin{cases} a=0.3a+b\\ b=0.4a+0.3c\\ a+b+c=1 \end{cases}\;\Rightarrow\; \vec\pi=\Big(\tfrac{10}{27},\tfrac{7}{27},\tfrac{10}{27}\Big). $$
Como $\mathbb{P}^{200}$ tiene filas $\approx\vec\pi$, la probabilidad de largo
plazo no depende de $X_0$:
$$ P(X_{200}=a\mid X_0=b)\approx \pi_a=\frac{10}{27}\approx 0.370. $$

**Resultado.** (a) $1$, (b) $0.49$, (c) $\approx 10/27$.

### Clases, recurrencia y primera visita
*De [[tp6-procesos-estocasticos]] Ej. 22 (resuelto). Cadena con
$\mathbb{E}=\{0,1,2,3,4,5,6\}$ y*
$$ \mathbb{P}=\begin{pmatrix} \tfrac15&\tfrac35&0&0&\tfrac15&0&0\\ 0&0&1&0&0&0&0\\ 0&\tfrac13&0&\tfrac23&0&0&0\\ 0&1&0&0&0&0&0\\ 0&0&0&0&0&1&0\\ 0&0&0&0&0&0&1\\ 0&0&0&0&1&0&0 \end{pmatrix}. $$

**Clases (ítem b).** Mirando qué estados se comunican (ida y vuelta con
probabilidad positiva en algún número de pasos):
$$ C_1=\{0\},\qquad C_2=\{1,2,3\},\qquad C_3=\{4,5,6\}. $$
- $\{0\}$ **no** se comunica con $1$: aunque $p_{01}=\tfrac35>0$, no hay forma de
  volver a $0$ desde $1$, así que $C_1$ es una clase aparte y **transitoria** (la
  probabilidad de salir es $\ge p_{01}=\tfrac35>0$).
- $C_2$ y $C_3$ son **cerradas y recurrentes** (no hay flechas que salgan de ellas);
  una vez dentro, la cadena se queda.
- $C_3=\{4\to5\to6\to4\}$ es un ciclo de longitud 3 → **periódica de período 3**
  ($p_{ii}^{(n)}=1$ sólo si $3\mid n$). $C_2$ **no** es periódica, porque
  $p_{11}^{(2)}=p_{12}p_{21}=\tfrac13\notin\{0,1\}$.

**Probabilidad de primera visita.** Se define
$q_{ij}(n)=P\big(X_n=j,\,X_m\ne j\ \forall\,1\le m\le n{-}1\mid X_0=i\big)$:
llegar **por primera vez** a $j$ desde $i$ en $n$ pasos. Como estos eventos (por
distinto $n$) son disjuntos, $q_{ij}=\sum_{n\ge1}q_{ij}(n)$.

**(c1) $P($alcanzar $6$ desde $0)=\tfrac14$.** Para llegar de $0$ a $6$ hay que pasar
sí o sí por $4$ (única salida de $C_1$ hacia $C_3$), y desde $4$ se va a $6$ en
exactamente 2 pasos forzados $4\to5\to6$. La primera visita a $4$ ocurre en $k$ pasos
si la cadena se quedó $k-1$ veces en $0$ y recién entonces saltó a $4$:
$$ q_{04}(k)=p_{00}^{\,k-1}\,p_{04}=\Big(\tfrac15\Big)^{k-1}\tfrac15=\Big(\tfrac15\Big)^{k}. $$
Entonces, usando $\sum_{k=0}^{\infty}q^k=\tfrac{1}{1-q}$,
$$ q_{06}=\sum_{k\ge1}q_{04}(k)=\sum_{k\ge1}\Big(\tfrac15\Big)^{k}=\frac{1}{1-\tfrac15}-1=\frac54-1=\frac14. $$

**(c2) $P($alcanzar $3$ desde $1)=1$.** Dentro de $C_2$ sólo se llega a $3$ en pasos
**pares** (hay que hacer ciclos $1\to2\to1$ antes de salir por $2\to3$). Con $h$
ciclos previos, $q_{13}(2h{+}2)=\big(\tfrac13\big)^{h}\cdot\tfrac23$, y
$$ q_{13}=\sum_{h\ge0}\Big(\tfrac13\Big)^{h}\tfrac23=\tfrac23\cdot\frac{1}{1-\tfrac13}=\tfrac23\cdot\tfrac32=1. $$
(La cadena entra a $3$ con probabilidad 1: $C_2$ es recurrente.)

**(c3) Pasos esperados de $1$ a $3$ $=3$.** Sea $T_{13}$ el nº de transiciones hasta
la primera visita a $3$; como $P(T_{13}=n)=q_{13}(n)$, sólo aportan los $n=2k$ con
$q_{13}(2k)=\big(\tfrac13\big)^{k-1}\tfrac23$. Usando
$\sum_{k\ge1}k\,q^{k-1}=\tfrac{1}{(1-q)^2}$:
$$ E[T_{13}]=\sum_{n\ge1}n\,q_{13}(n)=\sum_{k\ge1}2k\Big(\tfrac13\Big)^{k-1}\tfrac23 =\tfrac43\sum_{k\ge1}k\Big(\tfrac13\Big)^{k-1}=\tfrac43\cdot\frac{1}{(1-\tfrac13)^2}=\tfrac43\cdot\tfrac94=3. $$

**(c4) Largo plazo en $2$ desde $1$ $=\tfrac38$.** Como la cadena queda atrapada en
$C_2=\{1,2,3\}$, restringimos a una cadena $Y_n$ sobre $\{1,2,3\}$ con
$\mathbb{P}_Y=\begin{pmatrix}0&1&0\\\tfrac13&0&\tfrac23\\1&0&0\end{pmatrix}$. Es
**regular** ($\mathbb{P}_Y^8>0$), así que existe estacionaria $\vec\pi=(a,b,c)$ con
$\vec\pi=\vec\pi\,\mathbb{P}_Y$, $a+b+c=1$:
$$ \begin{cases}a=\tfrac13 b+c\\ b=a\\ c=\tfrac23 b\end{cases}\Rightarrow \Big(a,b,c\Big)=\Big(\tfrac38,\tfrac38,\tfrac14\Big)\;\Rightarrow\; \lim_{n\to\infty}P(X_n=2\mid X_0=1)=b=\tfrac38. $$

**Resultado.** $q_{06}=\tfrac14$; $q_{13}=1$; $E[T_{13}]=3$; largo plazo en $2$
$=\tfrac38$.

### Cadena con estado absorbente (oportunidades de examen)
*De [[tp6-procesos-estocasticos]] Ej. 25 (resuelto). Cada materia tiene 3
oportunidades de final; $p=P(\text{aprobar})$. $X_n=$ nº de oportunidades en el
período $n$, con $\mathbb{E}=\{0,1,2,3\}$: el estado $0$ ("aprobado") es
**absorbente**; el $3$ es la cursada recién aprobada; al reprobar la última
instancia se vuelve $1\to3$ (recursa).*

**(a) Matriz de transición.** De cada estado $\ne0$ se aprueba con prob. $p$ (va a $0$)
o se reprueba con prob. $1-p$ (baja una oportunidad, salvo $1\to3$):
$$ \mathbb{P}=\begin{pmatrix}1&0&0&0\\ p&0&0&1-p\\ p&1-p&0&0\\ p&0&1-p&0\end{pmatrix} \quad\text{(orden de estados }0,1,2,3). $$

**(b) Evolución desde $X_0=3$.** Con $\vec\pi_0=(0,0,0,1)$ y
$\vec\pi_{n+1}=\vec\pi_n\,\mathbb{P}$:
$$ \vec\pi_1=(p,\,0,\,1-p,\,0),\quad \vec\pi_2=(2p-p^2,\,(1-p)^2,\,0,\,0),\quad \vec\pi_3=(p^3-3p^2+3p,\,0,\,0,\,(1-p)^3). $$
La clave: en el instante $n$, **no estar aprobado** ($X_n\ne0$) significa haber
reprobado todas las instancias previas, lo que tiene probabilidad $(1-p)^n$. Por lo
tanto la probabilidad de estar en $0$ es $1-(1-p)^n$, y la masa restante $(1-p)^n$ se
reparte cíclicamente entre los estados $1,2,3$ según $n\bmod 3$:
$$ \vec\pi_n=\begin{cases} \big(1-(1-p)^n,\,0,\,0,\,(1-p)^n\big)&n=3k\\ \big(1-(1-p)^n,\,(1-p)^n,\,0,\,0\big)&n=3k+1\\ \big(1-(1-p)^n,\,0,\,(1-p)^n,\,0\big)&n=3k+2 \end{cases} $$

**Valor límite.** Como $0<1-p<1$, $(1-p)^n\to0$, así que toda la probabilidad se
concentra en el estado absorbente:
$$ \lim_{n\to\infty}\vec\pi_n=(1,\,0,\,0,\,0). $$
Es decir, el alumno **termina aprobando con probabilidad 1**.

**Resultado.** El patrón de $\vec\pi_n$ depende de $n\bmod3$ con peso $(1-p)^n$ fuera
del estado $0$; el límite es $(1,0,0,0)$.
