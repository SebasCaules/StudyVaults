---
titulo: Independencia de eventos
tipo: concepto
unidad: 2
tags: [probabilidad, independencia]
fuentes: ["[[independencia-condicional-bayes]]", "[[tp2-calculo-de-probabilidades]]"]
actualizado: 2026-06-06
---

# Independencia de eventos

**En breve.** Dos eventos son independientes cuando saber que uno ocurrió no cambia la
probabilidad del otro; eso permite **multiplicar** sus probabilidades para la
intersección. Es el supuesto que simplifica casi todo cálculo y la base de las
[[independencia-de-variables-aleatorias|v.a. independientes]].

Dos eventos $A, B$ son **independientes** sii
$$ P(A\cap B) = P(A)\cdot P(B). $$
Intuición: que ocurra uno **no aporta información** sobre el otro.

## Caracterización por la condicional
Si $P(C)\neq 0$: $\;C$ y $D$ independientes $\iff P(D\mid C)=P(D)$.
*(Sale de sustituir $P(D\cap C)=P(D)P(C)$ en la [[probabilidad-condicional|definición
de condicional]].)*

## Casos particulares
- $\emptyset$ es independiente de **todo** evento ($P(A\cap\emptyset)=0=P(A)\cdot 0$).
- $S$ es independiente de **todo** evento ($P(A\cap S)=P(A)=P(A)\cdot 1$).

## Colección de eventos
$\{A_k\}$ son independientes sii $P\!\left(\bigcap_k A_k\right)=\prod_k P(A_k)$.

> ⚠️ No confundir con [[espacio-muestral-y-eventos|mutuamente excluyentes]]: si
> $A,B$ son m.e. y ambos con prob. positiva, **no** son independientes (saber que
> ocurrió $A$ asegura que $B$ no ocurrió).

## Ejercicio resuelto
*Dos tiradores disparan a la vez, con probabilidades de acierto $0.6$ y $0.7$,
independientes. Calcular: (a) exactamente uno acierta; (b) exactamente dos.*

Sean $A_1$ = "tirador 1 acierta", $A_2$ = "tirador 2 acierta", independientes.

**(b) Exactamente dos** $= A_1\cap A_2$:
$$ P(A_1\cap A_2) = P(A_1)P(A_2) = 0.6\cdot 0.7 = 0.42. $$

**(a) Exactamente uno** $= (A_1\cap A_2^c)\cup(A_1^c\cap A_2)$ (m.e.):
$$ P = P(A_1)P(A_2^c) + P(A_1^c)P(A_2) = 0.6\cdot 0.3 + 0.4\cdot 0.7 = 0.18 + 0.28 = 0.46. $$

## Ejercicio resuelto — mutuamente excluyentes vs. independientes ([[tp2-calculo-de-probabilidades]] ej. 12)
*Sean $A,B$ con $P(A)=0.4$ y $P(A\cup B)=0.7$. ¿Cuánto vale $p=P(B)$ si son
(a) m.e.? (b) independientes?*

**(a) M.e.** ($P(A\cap B)=0$): $\;P(A\cup B)=P(A)+P(B)\Rightarrow 0.7=0.4+p\Rightarrow p=0.3.$

**(b) Independientes** ($P(A\cap B)=P(A)P(B)$):
$$ P(A\cup B)=P(A)+P(B)-P(A)P(B)\Rightarrow 0.7 = 0.4 + p - 0.4p \Rightarrow 0.6\,p=0.3\Rightarrow p=0.5. $$
Distinto valor de $p$ según el supuesto: **m.e. e independiente son cosas opuestas**.

## Ejercicio resuelto — fiabilidad serie/paralelo ([[tp2-calculo-de-probabilidades]] ej. 20)
*Cuatro contactos $A,B,C,D$ (relevadores independientes) se conectan así: la rama
$A\!-\!B$ en serie, en **paralelo** con la rama $C\!-\!D$ en serie. Cada contacto puede
fallar la conexión con probabilidad $10^{-2}$. ¿Probabilidad de que circule corriente
entre entrada y salida?*

Cada contacto **funciona** con $p=1-10^{-2}=0.99$.
- **Serie** (la rama funciona si funcionan **ambos**): $P(\text{rama})=p\cdot p=0.99^2=0.9801$.
- **Paralelo** (el circuito funciona si funciona **al menos una** rama → complemento de
  que fallen las dos): con $q_{\text{rama}}=1-0.9801=0.0199$,
$$ P = 1 - q_{\text{rama}}^2 = 1 - 0.0199^2 \approx 0.999604. $$

> Regla de oro: **serie → producto** (todos deben funcionar); **paralelo → complemento
> del producto de fallas** (basta con que uno funcione).

## Relación
[[probabilidad-condicional]] · [[axiomas-de-probabilidad]] (no confundir con la unión de
m.e.) · [[arbol-de-probabilidades]] (las etapas independientes dan ramas iguales nivel a
nivel) · base de las [[independencia-de-variables-aleatorias|v.a. independientes]] y de
la [[suma-de-variables-aleatorias|suma de v.a.]] (unidades posteriores).
