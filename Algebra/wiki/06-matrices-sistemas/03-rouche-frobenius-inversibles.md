---
tags: [teoria, unidad-6, rouche-frobenius, sistemas-lineales, matrices-inversibles]
fuente: raw/3-resumenes/algebra.pdf
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Rouché–Frobenius y matrices inversibles

Cierre de la unidad de matrices: el **teorema de Rouché–Frobenius** clasifica un sistema lineal
$Ax = b$ comparando el rango de la matriz de coeficientes con el de la ampliada, dando lugar a los
tres casos SCD / SCI / SI. Después se estudian las **matrices inversibles**, que resuelven el
sistema como $x = A^{-1}b$, y el teorema que reúne todas las caracterizaciones equivalentes del
rango máximo. Requiere las nociones de rango y forma escalonada de
[[02-sistemas-forma-escalonada-rango]]. Transcripción de los apuntes de la cursada 2023-1C.

## Teorema de Rouché–Frobenius

El teorema decide, a partir de los rangos, en cuál de tres categorías cae el sistema $Ax = b$:

- **SCD** — Sistema Compatible Determinado: tiene solución única.
- **SCI** — Sistema Compatible Indeterminado: tiene infinitas soluciones.
- **SI** — Sistema Incompatible: no tiene solución.

> **Teorema (Rouché–Frobenius).** Dado el sistema $Ax = b$:
> - Si $\mathrm{Rg}(A) \neq \mathrm{Rg}(A \mid b)$, el sistema es **incompatible (SI)**.
> - Si $\mathrm{Rg}(A) = \mathrm{Rg}(A \mid b)$, el sistema es **compatible (SC)**, y dentro de este caso:
>   - si $\mathrm{Rg}(A) = \#\text{variables}$, es **compatible determinado (SCD)**;
>   - si $\mathrm{Rg}(A) \neq \#\text{variables}$, es **compatible indeterminado (SCI)**.

El árbol de decisión se lee de arriba hacia abajo: primero se compara $\mathrm{Rg}(A)$ con
$\mathrm{Rg}(A \mid b)$ para separar compatible de incompatible, y recién dentro del caso
compatible se compara el rango con la cantidad de variables.

| $\mathrm{Rg}(A)$ vs $\mathrm{Rg}(A\mid b)$ | $\mathrm{Rg}(A)$ vs $\#\text{var}$ | Clasificación |
|---|---|---|
| $\mathrm{Rg}(A) \neq \mathrm{Rg}(A\mid b)$ | — | SI (sin solución) |
| $\mathrm{Rg}(A) = \mathrm{Rg}(A\mid b)$ | $\mathrm{Rg}(A) = \#\text{var}$ | SCD (solución única) |
| $\mathrm{Rg}(A) = \mathrm{Rg}(A\mid b)$ | $\mathrm{Rg}(A) \neq \#\text{var}$ | SCI (infinitas) |

> **Corolario (sistema homogéneo).** Para todo $A \in \mathbb{K}^{n \times r}$, si $Ax = 0$ entonces $\mathrm{Rg}(A \mid 0) = \mathrm{Rg}(A)$, de modo que un sistema homogéneo es siempre compatible: es SCD o SCI, **nunca incompatible** (siempre tiene al menos la solución trivial $x = 0$).

> **Definición (variables libres).** La cantidad de **variables libres** de un sistema es
> $$\#\text{variables libres} = \#\text{variables} - \mathrm{Rg}(A)$$

Un sistema es SCD exactamente cuando no tiene variables libres; cada variable libre aporta un
grado de libertad a la familia de soluciones de un SCI.

## Matrices inversibles

> **Definición (matriz inversible).** Sea $A \in \mathbb{K}^{n \times n}$. Se dice que $A$ es **inversible** si existe $B \in \mathbb{K}^{n \times n}$ tal que
> $$AB = BA = I$$
> Esa matriz $B$ se nota $A^{-1}$.

> **Teorema (unicidad de la inversa).** Si $A$ es inversible, su inversa es única.

> **Teorema.** Si $A \in \mathbb{K}^{n \times n}$ es inversible, entonces $Ax = b$ es SCD para todo $b$, y su solución es
> $$x = A^{-1}b$$

> **Corolario.** Sea $A \in \mathbb{K}^{n \times n}$.
> i) Si $\mathrm{Rg}(A) < n$, entonces $A$ **no** es inversible (no existe $A^{-1}$).
> ii) Si $\mathrm{Rg}(A) = n$, entonces $A$ es inversible.

### Teorema de equivalencias

> **Teorema.** Sea $A \in \mathbb{K}^{n \times n}$. Las siguientes afirmaciones son equivalentes:
> i) $\mathrm{Rg}(A) = n$;
> ii) existe $A^{-1}$;
> iii) $Ax = 0$ es SCD (solo la solución trivial);
> iv) $Ax = b$ es SCD para todo $b$;
> v) $A \sim I$ (es equivalente por filas a la identidad).

**Propiedades del producto de inversibles.**

i) Si $A, B \in \mathbb{K}^{n \times n}$ son inversibles, entonces $AB$ es inversible y
   $$(AB)^{-1} = B^{-1} A^{-1}$$
   (se invierte el orden de los factores).
ii) Si $A, B \in \mathbb{K}^{n \times n}$ y $AB$ es inversible, entonces existen $A^{-1}$ y
    $B^{-1}$ (ambos factores son inversibles).

## Cálculo de la inversa por Gauss–Jordan

En la práctica la inversa se obtiene armando la matriz ampliada $[A \mid I]$ y llevándola por
operaciones elementales de fila hasta que el bloque izquierdo sea la identidad: el bloque derecho
queda entonces en $A^{-1}$. Esquemáticamente,

$$[\,A \mid I\,] \;\sim\; [\,I \mid A^{-1}\,]$$

Si al escalonar aparece una fila nula en el bloque de $A$ —es decir $\mathrm{Rg}(A) < n$— el
proceso se corta y se concluye que $A^{-1}$ **no existe**. Este método concuerda con el teorema de
equivalencias: llegar a $A \sim I$ es exactamente la condición (v) de inversibilidad.

---

## Ver también

- [[02-sistemas-forma-escalonada-rango]] — forma escalonada y rango (insumos de este teorema)
- [[01-matrices-operaciones]] — operaciones con matrices y transpuesta
