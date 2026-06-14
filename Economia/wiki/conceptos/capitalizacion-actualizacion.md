---
tags: [unit-07, definicion]
aliases: [valor presente, valor futuro, VP, VF, actualización, descuento de flujos, compounding, discounting]
---

## Definición

Las dos operaciones inversas que permiten mover dinero en el tiempo:

- **Capitalización (compounding):** expresar una suma de hoy en términos financieramente equivalentes en un momento **futuro**. De un capital se calcula el monto: $VP \to VF$.
- **Actualización / descuento (discounting):** expresar un capital futuro en términos equivalentes de un momento **anterior**. Del monto se calcula el capital que lo generó: $VF \to VP$. Lo que se obtiene es el **valor actual**.

## Fórmula

$$\boxed{VF = VP\,(1+i)^n} \qquad\qquad \boxed{VP = \frac{VF}{(1+i)^n}}$$

**Donde:**
- $VF$: valor futuro
- $VP$: valor presente
- $i$: tasa efectiva del período (el costo de oportunidad del dinero)
- $n$: períodos entre ambos momentos

Despejes restantes: $i = (VF/VP)^{1/n}-1$ y $n = \ln(VF/VP)/\ln(1+i)$ (Excel: `TASA`/`RATE` y `NPER`).

**Generalización a flujos múltiples (mixtos):**

$$VP = \sum_{t=0}^{n}\frac{F_t}{(1+i)^t}$$

**Donde:**
- $F_t$: flujo del período $t$ (con signo)

## Ejemplo

**Flujos mixtos (slides, edificio de oficinas, $i = 5\%$):** $-170.000$ hoy, $-100.000$ en $t=1$, $+320.000$ en $t=2$:

$$VP = -170.000 - \frac{100.000}{1{,}05} + \frac{320.000}{1{,}05^2} = -170.000 - 95.238 + 290.249 = +25.011$$

El proyecto agrega valor — esto ya **es** un [[conceptos/van|VAN]].

**VP simple (Pam Valenti):** recibir \$1.700 en 8 años con alternativa al 4%: $VP = 1.700/1{,}04^8 = 1.242{,}17$ — precio máximo a pagar por esa promesa.

## Intuición / Por qué importa

- El gráfico del VP es una curva decreciente en el tiempo: **cuanto más lejos (o mayor $i$), menos vale hoy** un mismo monto futuro.
- Es la mecánica detrás de **toda** valuación: bonos, acciones, proyectos, préstamos. La Unidad 8 (VAN/TIR) es exactamente esta fórmula aplicada al [[conceptos/flujo-de-fondos-proyecto|flujo de fondos de un proyecto]], descontada a la [[conceptos/trema|TREMA]].
- Para **comparar alternativas hay que pararse en un único momento** (cualquiera sirve, si se es consistente): comprar vs alquilar en $t=0$, o tipo de cambio breakeven en $t=3$ (parcial del pádel).

## Errores comunes / Distinciones

- **Sumar flujos de períodos distintos sin descontar.** El error conceptual número 1 de la unidad.
- **En Excel, `VNA`/`NPV` asume que el primer flujo es de $t=1$:** el flujo de $t=0$ se suma aparte, sin descontar.
- **Descontar con una tasa de período distinto al de los flujos** (ver [[tasas-equivalentes]]).
- **Elegir mal el momento de comparación no es error… si se descuenta todo al mismo punto.** Mezclar valores de $t=0$ con valores de $t=3$ sí lo es.

## Relacionado con
- [[valor-tiempo-dinero]] — el fundamento
- [[tasa-interes]] — el "precio" usado para mover fondos
- [[anualidades]], [[perpetuidades]] — atajos para flujos con estructura
- [[conceptos/van|van]] — la aplicación estrella (U8)
- [[formulas/unidad-07]]
