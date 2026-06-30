---
titulo: Probabilidad condicional
tipo: concepto
unidad: 2
tags: [probabilidad, condicional]
fuentes: ["[[independencia-condicional-bayes]]"]
actualizado: 2026-06-06
---

# Probabilidad condicional

**En breve.** Mide la chance de $D$ una vez que sabés que $C$ ocurrió: achicás el
universo a $C$ y mirás qué fracción de $C$ también cumple $D$. Es el ladrillo de la
[[independencia]], la [[probabilidad-total-y-bayes|probabilidad total y Bayes]] y el
[[arbol-de-probabilidades|árbol de probabilidades]].

La probabilidad de $D$ **dado** $C$ (sabiendo que $C$ ocurrió), con $P(C)\neq 0$:
$$
P(D\mid C) = \frac{P(D\cap C)}{P(C)}.
$$
**Idea**: condicionar a $C$ es *reducir el universo* de todo $S$ a solo $C$; ahora
$C$ pasa a ser el nuevo "espacio cierto" y se cuentan los casos de $D$ dentro de $C$.

> **Intuición.** La fórmula sale de pensar en frecuencias relativas restringidas. Si repetís el experimento $n$ veces y $C$ ocurrió $n_C$ de ellas, la frecuencia de $D$ *entre los casos en que $C$ ocurrió* es
> $$\frac{n(D\cap C)}{n_C} = \frac{n(D\cap C)/n}{n_C/n}.$$
> Cuando $n\to\infty$, el numerador converge a $P(D\cap C)$ y el denominador a $P(C)$. Por eso el denominador es $P(C)$ y no $1$: no dividís entre *todas* las repeticiones, sino solo entre las que ya sabés que cayeron en $C$.

> ⚠️ Si $P(C)=0$, la condicional $P(D\mid C)$ **no está definida** (división por cero):
> no se puede condicionar a un suceso de probabilidad nula. La definición exige
> explícitamente $P(C)\neq 0$ ([[tp2-calculo-de-probabilidades]], repaso).

> Frases que indican condicional: "si...", "sabiendo que...", "dado que...", "de los
> casos en que...".
>
> La probabilidad condicional **cumple todos los [[axiomas-de-probabilidad|axiomas]]**
> (es una probabilidad legítima sobre el universo reducido).

## Ejercicio resuelto
*Se tiran dos dados y la suma es $\ge 8$. ¿Probabilidad de que la suma sea par?*

Sea $C=\{\text{suma}\ge 8\}$ y $D=\{\text{suma par}\}$.
- $|C| = 15$ casos $\Rightarrow P(C)=\tfrac{15}{36}$.
- $C\cap D$ (suma $\ge 8$ **y** par: 8, 10, 12) $= 9$ casos $\Rightarrow P(C\cap D)=\tfrac{9}{36}$.
$$
P(D\mid C) = \frac{P(D\cap C)}{P(C)} = \frac{9/36}{15/36} = \frac{9}{15} = \frac{3}{5} = 0.6.
$$

## Relación
- Si $P(D\mid C)=P(D)$, los eventos son [[independencia|independientes]].
- Reordenando: $P(D\cap C)=P(D\mid C)\,P(C)$ (**regla de la multiplicación**) → base de
  la [[probabilidad-total-y-bayes|probabilidad total y Bayes]] y de las etiquetas del
  [[arbol-de-probabilidades|árbol de probabilidades]].

> **Cuidado:** la regla del complemento vale al complementar el *evento de interés*, manteniendo fijo el condicionante:
> $$P(A^c\mid B) = 1 - P(A\mid B),$$
> pero **no** vale al complementar el *condicionante*:
> $$P(A\mid B^c) \neq 1 - P(A\mid B)\quad(\text{en general}).$$
> El motivo: $P(\cdot\mid B)$ y $P(\cdot\mid B^c)$ son probabilidades sobre universos reducidos distintos ($B$ y $B^c$ tienen casos totales distintos), así que sus complementos no tienen por qué relacionarse.
