---
tags: [teoria, unidad-3, calculo-relacional, equivalencia, algebra-relacional]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Equivalencia entre álgebra y cálculo relacional

El [[02-algebra-relacional/01-operaciones-basicas|álgebra relacional]], el
[[01-calculo-de-tuplas|cálculo de tuplas]] (TRC) y el [[02-calculo-de-dominios|cálculo de dominios]]
(DRC) tienen el **mismo poder expresivo**: toda consulta escrita en uno se puede escribir en los
otros (restringiéndose a fórmulas seguras en el caso del cálculo). Un lenguaje con este poder se
dice **relacionalmente completo**. Esta página muestra la correspondencia entre operadores y cómo se
traduce una consulta de un formalismo al otro, con los ejemplos resueltos de los apuntes.

## Correspondencia entre operadores

Cada operación del álgebra tiene su forma equivalente en el cálculo. La tabla resume el patrón que
se repite en las traducciones:

| Álgebra | Cálculo (TRC / DRC) |
|---|---|
| Selección $\sigma_F(r)$ | condición $F$ dentro de la fórmula |
| Proyección $\pi_L(r)$ | dejar libres los atributos de $L$ y **acotar con $\exists$** los demás |
| Producto / join $r \times s$, $r \bowtie s$ | conjunción $\wedge$ de los dos átomos, ligados por el atributo común |
| Unión $r \cup s$ | disyunción $\vee$ |
| Diferencia $r - s$ | conjunción con negación: $\wedge\, \neg(\dots)$ |
| División $r \div s$ ("para todo") | universal, codificado como $\neg(\exists\dots\,\neg(\exists\dots))$ |

> **Nota.** Esta correspondencia es la que se aplica en los ejercicios de conversión de los apuntes;
> resume el uso práctico, no una tabla formal exhaustiva de la teoría.

## De cálculo a álgebra: la división

El caso más delicado es "para todo / todos": en el cálculo aparece como doble negación de
existencial y en el álgebra se resuelve con la **división** (ver [[02-algebra-relacional/02-joins-y-division]]).

> **Ejemplo (conversión TRC → álgebra).** Sobre `cliente(dni, nombre)`, `auto(patente, color)` y
> `alquila(dni, patente)`, se parte del TRC:
> $$\{\, T \mid (\exists C)\,(\ \text{cliente}(C)\ \wedge\ \neg(\exists R)(\ \text{auto}(R) \wedge R[\text{color}]=\text{'beige'} \wedge \neg(\exists S)(\ \text{alquila}(S) \wedge S[\text{patente}]=R[\text{patente}] \wedge S[\text{dni}]=C[\text{dni}]\ )\ )\ \wedge\ T[\text{nombre}]=C[\text{nombre}]\ ) \,\}$$
> que se traduce al álgebra con una división:
> $$\pi_{\text{nombre}}\Big(\ \text{Cliente} \bowtie_{\text{dni}} \big(\ \pi_{\text{dni},\text{patente}}(\text{alquila}) \div \pi_{\text{patente}}(\sigma_{\text{color}=\text{beige}}(\text{auto}))\ \big)\ \Big)$$
> La división $\pi_{\text{dni},\text{patente}}(\text{alquila}) \div \pi_{\text{patente}}(\sigma_{\text{color}=\text{beige}}(\text{auto}))$ devuelve los `dni` que alquilaron **todas** las
> patentes beige — exactamente lo que codifica la doble negación del TRC.

> **Nota.** En el apunte, la glosa en prosa de esta consulta dice "clientes que **nunca** alquilaron
> un auto beige", pero tanto la fórmula (con $\neg\exists\dots\neg\exists$) como el álgebra (con
> $\div$) corresponden a "clientes que alquilaron **todos** los autos beige". La glosa "nunca"
> parece un desliz del original *(dudoso en el original)*; la lectura correcta es la de la división.

## De álgebra a cálculo: contar por diferencia

"Exactamente uno" se arma en el álgebra restando "dos o más" de "uno o más", y en el cálculo con una
negación acotada.

> **Ejemplo (conversión álgebra → DRC).** Consulta que devuelve los clientes que alquilaron
> **exactamente un** auto en febrero de 2015. En el álgebra se calcula un auxiliar con los `dni` que
> alquilaron **dos** autos distintos en febrero (autojoin con `patente` $\neq$) y se lo resta al
> conjunto de los que alquilaron **al menos uno**. En DRC queda:
> $$\{\, \text{Nombre} \mid (\exists\, D, C)\,\big(\ \text{Cliente}(D, \text{Nombre}, C)\ \wedge\ (\exists\, P_1, F_1)(\ \text{Alquila}(D, P_1, F_1) \wedge \text{01/02/2015} \le F_1 \le \text{28/02/2015} \wedge \neg(\exists\, P_2, F_2)(\ \text{Alquila}(D, P_2, F_2) \wedge \text{01/02/2015} \le F_2 \le \text{28/02/2015} \wedge P_2 \neq P_1\ )\ )\ \big) \,\}$$
> Es decir: alquiló un auto `P1` en febrero y **no existe** otro auto `P2 ≠ P1` alquilado en
> febrero. *(Los atributos de `alquila` se abrevian a `dni`, `patente` y `fecha` para legibilidad.)*

## Límites: qué no se puede expresar

Ni el álgebra básica ni el cálculo básico expresan **todo**. Los apuntes marcan dos límites con un
"no se puede":

- **Ordenamiento.** Pedir un resultado ordenado (por ejemplo, "listar los títulos de libros
  alfabéticamente") **no se puede**: el resultado es un conjunto, sin orden intrínseco.
- **Agregación.** Las funciones de agregación (MAX, COUNT, SUM…) no forman parte del álgebra ni del
  cálculo vistos en clase.

> **Ejemplo (agregación reescrita).** Dada la consulta SQL sobre `CURSADA(legajo, …, nota)`:
> ```sql
> SELECT legajo
> FROM CURSADA
> GROUP BY legajo
> HAVING MAX(nota) > 4.0
> ```
> En los apuntes la versión en **álgebra** se marca "no se puede" (no hay funciones de agregación).
> En cambio, en **TRC** y **DRC** sí se resuelve, reescribiendo $\text{MAX(nota)} > 4$ como "existe
> una nota $> 4$":
> $$\text{TRC:}\quad \{\, t \mid \exists\, c \in \text{CURSADA}\ (\ t[\text{legajo}] = c[\text{legajo}] \wedge c[\text{nota}] > 4\ ) \,\}$$
> $$\text{DRC:}\quad \{\, \text{Legajo} \mid (\exists\, M, A, N)\,(\ \text{Cursada}(\text{Legajo}, M, A, N) \wedge N > 4\ ) \,\}$$
> Funciona porque "el máximo supera 4" equivale a "hay al menos una nota mayor que 4".

## Seguridad y equivalencia

La equivalencia entre álgebra y cálculo vale para las **fórmulas seguras** del cálculo (ver
[[01-calculo-de-tuplas]]). Una fórmula insegura como $\{\, t \mid \neg\, r(t) \,\}$ no tiene
equivalente en el álgebra porque produce un resultado infinito; al restringir el cálculo a fórmulas
seguras, los tres formalismos coinciden exactamente.

---

## Ver también

- [[01-calculo-de-tuplas]] — cálculo de tuplas y noción de fórmula segura
- [[02-calculo-de-dominios]] — cálculo de dominios y el patrón "todos" por doble negación
- [[02-algebra-relacional/02-joins-y-division]] — la división, contrapartida del "para todo"
- [[index]] — índice del vault de Base de Datos I
