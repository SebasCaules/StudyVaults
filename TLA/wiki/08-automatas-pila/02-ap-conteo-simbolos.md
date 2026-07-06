---
tags: [resuelto, unidad-8, automatas-pila, conteo, traza-configuraciones]
fuente: raw/parciales/parcial-2-resuelto.pdf
unidad: 8
tipo: resuelto
actualizado: 2026-07-05
---

# AP con conteo de símbolos

Ejercicio de un parcial resuelto de la cursada 2025-2C: construir un
[[08-automatas-pila/01-automatas-pila|autómata de pila]] que reconozca un lenguaje donde la cantidad
de $c$ centrales debe igualar una **suma de conteos** repartida entre dos bloques de la palabra.
Muestra cómo usar la pila para llevar la cuenta de dos símbolos a la vez.

## Enunciado

> **Ejercicio.** Construir un AP que reconozca
> $$L = \{\, \alpha\, c^{\,n}\, \beta \;:\; \#_a(\alpha) + \#_b(\beta) = n \geq 0,\ \ \alpha, \beta \in \{a, b\}^{*} \,\}$$

donde $\#_a(\alpha)$ cuenta las $a$ en el bloque $\alpha$ y $\#_b(\beta)$ cuenta las $b$ en el
bloque $\beta$. La palabra tiene tres partes en orden: un prefijo $\alpha$ sobre $\{a,b\}$, un bloque
central de $n$ símbolos $c$ y un sufijo $\beta$ sobre $\{a,b\}$. La condición es que el número de
$c$ centrales sea exactamente la cantidad de $a$ del prefijo más la cantidad de $b$ del sufijo.

**Ejemplo de palabra de $L$:** $\;\underbrace{baa}_{\alpha}\, \underbrace{ccccc}_{c^{\,5}}\, \underbrace{ababb}_{\beta}$.
Acá $\#_a(\alpha) = 2$ y $\#_b(\beta) = 3$, y en efecto $2 + 3 = 5 = n$.

## Idea de la construcción

La pila lleva la cuenta en dos etapas:

1. **En $\alpha$** se apila una $A$ por cada $a$ leída (las $b$ del prefijo no tocan la pila).
2. **En el bloque de $c$** primero se **desapila** una $A$ por cada $c$, hasta agotar las $A$: eso
   descuenta la parte $\#_a(\alpha)$. Los $c$ que sobran (los que ya no tienen $A$ que sacar) se
   **apilan** como $c$, porque tendrán que ser cancelados por las $b$ del sufijo.
3. **En $\beta$** se desapila un $c$ por cada $b$ leída (las $a$ del sufijo no tocan la pila).

Si al terminar la pila vuelve al símbolo inicial $S$, los conteos cuadraron y se acepta vaciando la
pila en el estado final.

## Autómata

El AP usa el símbolo inicial de pila $S = z_0$, el símbolo auxiliar $A$ (para contar $a$ del prefijo)
y el símbolo $c$ (para los $c$ sobrantes). Estados: $q_0$ (inicio), $q_\alpha$ (prefijo), $q_c$
(bloque de $c$), $q_\beta$ (sufijo) y $q_f$ (final). Recordando la notación de etiquetas
$x,\ X/Y$ = *leo $x$, desapilo $X$, apilo $Y$*:

| Arco | Etiquetas | Efecto |
|---|---|---|
| $q_0 \to q_\alpha$ | $\lambda,\ S/S$ · $a,\ S/AS$ · $b,\ S/S$ | entra al prefijo; primera $a$ apila $A$ |
| $q_\alpha \to q_\alpha$ | $a,\ S/AS$ · $a,\ A/AA$ · $b,\ S/S$ · $b,\ A/A$ | cada $a$ apila una $A$; las $b$ no tocan la pila |
| $q_\alpha \to q_c$ | $c,\ S/cS$ · $c,\ A/\lambda$ | primer $c$: si hay $A$ la desapila, si no apila $c$ |
| $q_c \to q_c$ | $c,\ A/\lambda$ · $c,\ S/cS$ | cada $c$ desapila una $A$; agotadas, apila $c$ |
| $q_c \to q_\beta$ | $b,\ c/\lambda$ · $a,\ c/c$ · $a,\ S/S$ | entra al sufijo; $b$ desapila un $c$ |
| $q_\beta \to q_\beta$ | $b,\ c/\lambda$ · $a,\ c/c$ · $a,\ S/S$ | cada $b$ desapila un $c$; las $a$ no tocan la pila |
| $q_\beta \to q_f$ | $\lambda,\ S/\lambda$ | tope $S$ (pila saldada): desapila $S$, acepta |

## Traza de configuraciones

Para la palabra $baa\,ccccc\,ababb$, partiendo de $[q_0,\ baaccccc\,ababb,\ S]$. Se usa la notación
$[\,q,\ w,\ \gamma\,]$: estado, entrada por leer y pila (tope a la izquierda).

Fase del prefijo $\alpha = baa$ (la $b$ no apila; cada $a$ apila una $A$):

$$[q_0,\ baaccccc\,ababb,\ S] \;\vdash\; [q_\alpha,\ aaccccc\,ababb,\ S] \;\vdash\; [q_\alpha,\ accccc\,ababb,\ AS]$$
$$\vdash\; [q_\alpha,\ ccccc\,ababb,\ AAS]$$

Fase de los $c$: los dos primeros $c$ desapilan las dos $A$; los tres $c$ restantes se apilan:

$$\vdash\; [q_c,\ cccc\,ababb,\ AS] \;\vdash\; [q_c,\ ccc\,ababb,\ S] \;\vdash\; [q_c,\ cc\,ababb,\ cS]$$
$$\vdash\; [q_c,\ c\,ababb,\ ccS] \;\vdash\; [q_c,\ ababb,\ cccS]$$

Fase del sufijo $\beta = ababb$ (cada $b$ desapila un $c$; las $a$ no tocan la pila):

$$\vdash\; [q_\beta,\ babb,\ cccS] \;\vdash\; [q_\beta,\ abb,\ ccS] \;\vdash\; [q_\beta,\ bb,\ ccS]$$
$$\vdash\; [q_\beta,\ b,\ cS] \;\vdash\; [q_\beta,\ \lambda,\ S] \;\vdash\; [q_f,\ \lambda,\ \lambda]$$

Se consumió toda la entrada, se llegó al estado final $q_f$ y la pila quedó vacía: la palabra
pertenece a $L$. Los $2$ símbolos $c$ que descontaron $A$ corresponden a $\#_a(\alpha) = 2$ y los
$3$ símbolos $c$ apilados fueron cancelados por las $3$ $b$ del sufijo, $\#_b(\beta) = 3$; en total
$n = 5$.

> **Nota.** En los apuntes de la cursada la letra $a$ se escribe con un glifo parecido a "$\partial$";
> acá se transcribe como $a$. La aceptación combina **estado final** y **pila vacía**, como en el
> resto de los ejemplos de AP de la materia.

---

## Ver también

- [[08-automatas-pila/01-automatas-pila]] — definición de AP, notación de configuraciones y aceptación
- [[07-gramaticas-libres-contexto/01-gramaticas-libres-contexto]] — construir gramáticas para lenguajes con conteos de símbolos
- [[03-automatas-finitos/03-configuraciones-lenguaje-aceptado]] — la secuencia de configuraciones $\vdash^{*}$ en el caso sin pila
