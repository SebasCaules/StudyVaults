---
tags: [teoria, unidad-8, automatas-pila, pila-vacia, estado-final]
fuente: raw/teoricas/tla-teorica.pdf
unidad: 8
tipo: teoria
actualizado: 2026-07-05
---

# Autómatas de pila

Un **autómata de pila** (AP) extiende a los [[03-automatas-finitos/01-automatas-finitos|autómatas finitos]]
agregándoles una memoria auxiliar de tipo **pila** (LIFO: el último símbolo apilado es el primero
en salir). Esa pila le da la capacidad de *contar* y *comparar* cantidades de símbolos —algo fuera
del alcance de un autómata finito—, y es lo que le permite reconocer lenguajes como
$L = \{a^n b^n : n \geq 1\}$. En la [[02-gramaticas/03-jerarquia-de-chomsky|jerarquía de Chomsky]]
los AP son la máquina asociada a los **lenguajes libres de contexto** (tipo 2).

## Definición

> **Definición.** Un autómata de pila es una 7-tupla
> $$AP = \langle Q,\, V,\, \Sigma,\, \delta,\, q_0,\, z_0,\, F \rangle$$

donde cada componente es:

- $Q$ — conjunto **finito** de estados ($q_0, q_1, q_2, \dots$).
- $V$ — **alfabeto de la pila** (los símbolos que se pueden apilar).
- $\Sigma$ — **alfabeto de entrada** (los símbolos de la cinta: $a, b, \dots$).
- $\delta$ — **función de transición**.
- $q_0$ — **estado inicial**.
- $z_0$ — **símbolo inicial de la pila** (lo único que hay en la pila al arrancar).
- $F$ — conjunto de **estados finales**.

## Configuraciones y transiciones

El estado momentáneo de un AP no lo describe solo el estado de control: hay que incluir también
la entrada que falta leer y el contenido de la pila. Se usa la noción de **configuración
instantánea**, un triple

$$[\,q,\; w,\; \gamma\,]$$

donde $q$ es el estado actual, $w \in \Sigma^*$ es la parte de la entrada **todavía no leída** y
$\gamma \in V^*$ es el **contenido de la pila** (por convención, el **tope** se escribe a la
izquierda).

Cada transición se dibuja sobre un arco con una etiqueta de la forma

$$x,\; X \,/\, Y$$

que se lee: *leyendo el símbolo $x \in \Sigma \cup \{\lambda\}$ de la entrada, se **desapila** $X$
del tope y se **apila** $Y$*. Aquí $\lambda$ significa "nada": $x = \lambda$ es una transición
que no consume entrada, $X = \lambda$ no saca nada de la pila y $Y = \lambda$ no apila nada. Un
**push** puro es $x,\ \lambda / Y$ y un **pop** puro es $x,\ X / \lambda$.

El paso entre configuraciones se nota con $\vdash$: si existe una transición $x,\ X/Y$ que lleva de
$q$ a $p$, entonces

$$[\,q,\; x\,w,\; X\gamma\,] \;\vdash\; [\,p,\; w,\; Y\gamma\,]$$

Se consume $x$ de la entrada, se reemplaza el tope $X$ por $Y$ y se pasa al estado $p$. La clausura
reflexivo-transitiva $\vdash^{*}$ encadena varios pasos, igual que la
[[03-automatas-finitos/03-configuraciones-lenguaje-aceptado|secuencia de configuraciones]] de un AFD,
pero arrastrando además la pila.

> **Nota.** En los apuntes de la cursada 2025-2C el separador de la etiqueta aparece a veces como
> `;` en lugar de `/` (por ejemplo $a,\ \lambda\,;\,1$); acá se unifica con `/`. El significado
> —símbolo leído, símbolo desapilado, símbolo apilado— es el mismo.

## Aceptación por estado final y por pila vacía

Una palabra se considera **aceptada** cuando, consumida toda la entrada, el AP alcanza una
configuración de aceptación. En los ejemplos de la cursada esa configuración cumple **las dos
condiciones a la vez**: se llega a un **estado final** ($q \in F$) y la **pila queda vacía**. En el
diagrama, el último paso es típicamente una transición $\lambda,\ z_0 / \lambda$ que desapila el
símbolo inicial $z_0$ y mueve al estado final, dejando la pila en $\lambda$.

- **Aceptación por estado final:** la entrada se consume por completo y el control termina en un
  estado de $F$.
- **Aceptación por pila vacía:** la entrada se consume por completo y la pila queda sin símbolos.

> **Nota.** Los apuntes usan ambos criterios de forma **combinada** (llegar a $F$ *y* vaciar la
> pila), pero no desarrollan formalmente la equivalencia entre "aceptar por estado final" y
> "aceptar por pila vacía" como construcciones separadas.

## Correspondencia con las gramáticas libres de contexto

Según la [[02-gramaticas/03-jerarquia-de-chomsky|jerarquía de Chomsky]], la clase de lenguajes que
reconoce un autómata de pila coincide con la de los
[[07-gramaticas-libres-contexto/01-gramaticas-libres-contexto|lenguajes libres de contexto]]
(gramáticas de **tipo 2**): la máquina abstracta "con pila" está asociada exactamente a ese nivel
de la jerarquía.

> **Nota.** En los apuntes esta correspondencia aparece a nivel de la jerarquía (AP ↔ tipo 2 / LC);
> la construcción explícita en ambos sentidos —de una gramática libre de contexto a un AP y de un AP
> a una gramática— no se desarrolla.

## Ejemplo: diseñar un AP para $L = \{a^n b^n : n \geq 1\}$

La idea es **apilar un $1$ por cada $a$** y luego **desapilar un $1$ por cada $b$**: si al terminar
la pila vuelve a estar vacía, hubo tantas $a$ como $b$ (y en ese orden). El AP tiene tres estados:

- $q_0$ — fase de las $a$. Bucle $a,\ \lambda / 1$: por cada $a$ leída se apila un $1$ (no se saca
  nada).
- $q_0 \to q_1$ con $b,\ 1 / \lambda$: al leer la primera $b$, se desapila un $1$ y se pasa a la
  fase de las $b$.
- $q_1$ — fase de las $b$. Bucle $b,\ 1 / \lambda$: por cada $b$ se desapila un $1$.
- $q_1 \to q_2$ con $\lambda,\ z_0 / \lambda$: cuando el tope vuelve a ser el símbolo inicial $z_0$
  (se acabaron los $1$), se desapila $z_0$ sin leer entrada y se llega al estado final $q_2$ con la
  pila vacía.

Traza para la entrada $aabb$ (partiendo de la pila $[z_0]$):

$$[q_0,\ aabb,\ z_0] \;\vdash\; [q_0,\ abb,\ 1\,z_0] \;\vdash\; [q_0,\ bb,\ 1\,1\,z_0]$$
$$\vdash\; [q_1,\ b,\ 1\,z_0] \;\vdash\; [q_1,\ \lambda,\ z_0] \;\vdash\; [q_2,\ \lambda,\ \lambda]$$

Se apilaron dos $1$ (uno por $a$), se desapilaron dos $1$ (uno por $b$) y al final se desapiló
$z_0$: la entrada quedó consumida, el control está en el estado final $q_2$ y la pila vacía, así
que $aabb \in L$.

Para un caso con conteos cruzados de varios símbolos, ver
[[08-automatas-pila/02-ap-conteo-simbolos]].

---

## Ver también

- [[08-automatas-pila/02-ap-conteo-simbolos]] — AP con conteo de símbolos y traza de configuraciones completa
- [[03-automatas-finitos/01-automatas-finitos]] — el modelo base sin memoria auxiliar
- [[07-gramaticas-libres-contexto/01-gramaticas-libres-contexto]] — la clase de lenguajes que reconocen los AP
- [[02-gramaticas/03-jerarquia-de-chomsky]] — dónde ubica la jerarquía a los AP (tipo 2)
