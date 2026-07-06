---
tags: [teoria, unidad-5, maquinas-de-turing, computabilidad]
fuente: Apuntes de la cursada 2025-2C (parcial resuelto)
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Máquinas de Turing

La **Máquina de Turing (MT)** es el modelo de cómputo más general de la
[[03-jerarquia-de-chomsky|jerarquía de Chomsky]]: reconoce los lenguajes de **tipo 0**
(irrestrictos), por encima de los autómatas con pila y los autómatas finitos. A diferencia de
estos, dispone de una **cinta** sobre la que puede leer y **escribir**, y sobre la que el
cabezal se mueve en ambos sentidos, lo que la vuelve capaz no solo de reconocer lenguajes sino
de **computar funciones**. En los apuntes de la cursada se la presenta de forma operativa, a
través de un diseño concreto: una MT que **multiplica**.

## Cómo se describe una MT

En los apuntes la máquina se da como un **diagrama de estados** con un estado inicial, estados
intermedios y un estado final (de aceptación). Cada transición entre estados se etiqueta con la
operación que realiza el cabezal sobre la cinta:

> **Notación.** Una etiqueta de la forma
> $$x \,/\, y,\ M$$
> significa: si el cabezal **lee** el símbolo $x$, entonces **escribe** el símbolo $y$ en esa
> celda y **mueve** el cabezal en la dirección $M$, con $M = R$ (derecha) o $M = L$ (izquierda).

Por ejemplo, $1/1,\,R$ deja el $1$ como está y avanza a la derecha; $B/\#,\,L$ reemplaza un
blanco $B$ por el símbolo $\#$ y retrocede a la izquierda. Los símbolos que aparecen en la cinta
del ejemplo son los datos ($1$ y el separador $*$), el blanco $B$, y varias **marcas de trabajo**
que la máquina va escribiendo: $\#$ (separa la entrada del resultado), $V$ (un $1$ ya **visto**),
$S$ (marca de **suma**), $M$ (marca de **multiplex**) y $A$.

## Ejemplo: MT multiplicadora

La máquina resuelta multiplica dos números representados en **unario** (tiras de $1$) separados
por un $*$, y deja el producto —también en unario— a la derecha de un separador $\#$. El diseño
se organiza en cuatro etapas encadenadas.

### Preparación y caso del cero

Primero el cabezal **recorre toda la cinta** hasta el primer blanco y escribe allí el separador
$\#$. Luego chequea si a la izquierda del $\#$ hay un $0$: eso significa **multiplicar por 0**,
así que no hace falta más que **limpiar la cinta** dejando solo el $\#$ y terminar. Si no es ese
el caso, devuelve el cabezal a la posición del **primer $1$** y arranca el cómputo.

### Bucle de los primeros unos

En el **bucle de los primeros 1's** se copian, detrás del $\#$, todos los $1$ que estén antes
del primer $*$. A medida que copia cada uno, lo reemplaza en el origen por una $V$ de **visto**,
para no volver a procesarlo.

### Bucle de los segundos unos

Cuando **todos los primeros $1$ están vistos**, se etiqueta el primer $*$ con una $S$ de **suma**
y se pasa al **bucle de los segundos 1's**. Este hace lo mismo que el anterior sobre el segundo
grupo de $1$; al llegar al **segundo $*$** lo etiqueta con una $M$ de **multiplex** y continúa
con el bucle de multiplicar.

### Bucle de multiplicar

En el **bucle de multiplicar**, el primer $1$ se marca directamente como visto (no dispara
ninguna copia). Por cada uno de los $1$ siguientes de esa sección: se lo etiqueta como visto y se
**copia una vez** el bloque completo de $1$ que hay detrás del $\#$. Repitiendo esto por cada $1$
de la sección de multiplicar se acumula el producto detrás del $\#$.

### Limpieza (CleanUp)

Finalmente, en la etapa de **CleanUp** se borra toda la basura que quedó detrás del $\#$ y se
reemplazan todas las marcas $A$ y $V$ por $1$, de modo que la cinta quede con el resultado en
unario correctamente escrito.

> **Nota.** El diagrama original de esta MT tiene del orden de dos decenas de estados y usa
> colores para distinguir cada bucle. Acá se reconstruye su comportamiento a partir de la
> explicación en prosa que acompaña al ejercicio, sin reproducir estado por estado el diagrama
> del apunte.

## MT y decidibilidad

Por reconocer los lenguajes de tipo 0, la Máquina de Turing es el tope de la jerarquía y el
modelo de referencia de lo que una computadora puede calcular. Quedan **fuera** de su alcance los
**lenguajes no enumerables**, que ninguna gramática genera y ninguna MT reconoce (ver la
observación en [[03-jerarquia-de-chomsky]]).

> **Nota.** Los apuntes de la cursada trabajan la Máquina de Turing por el lado del **diseño**
> (construir una MT que compute algo), no como teoría formal de decidibilidad. No desarrollan la
> tupla formal de la MT ni resultados de (in)decidibilidad; esta página se limita a lo que
> aparece en el material.

---

## Ver también

- [[03-jerarquia-de-chomsky]] — la MT reconoce los lenguajes tipo 0, en la cima de la jerarquía
- [[01-analisis-sintactico-lr]] — el otro tema del segundo parcial: análisis sintáctico con ítems
- [[03-configuraciones-lenguaje-aceptado]] — configuraciones y traza de ejecución en autómatas finitos
