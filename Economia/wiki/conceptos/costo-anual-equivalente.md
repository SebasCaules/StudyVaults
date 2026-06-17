---
tags: [unit-08, metodo]
aliases: [CAE, valor anual equivalente, VA, valor anual, anualidad equivalente]
---

## Definición

**Valor Anual Equivalente (VA):** renta anual **constante** de flujos de caja que es equivalente — a la tasa de descuento — a todos los ingresos y egresos del proyecto. Es el [[van]] "repartido" como [[anualidades|anualidad]] a lo largo de la vida del proyecto. Cuando el proyecto es de **solo costos** (comparar máquinas, por ejemplo), al VA se lo llama **Costo Anual Equivalente (CAE)** y gana el de menor costo.

## Fórmula

$$\boxed{VA = \frac{VAN}{a(n;i)}}$$

$$a(n;i) = \frac{1 - (1+i)^{-n}}{i}$$

**Donde:**
- $VAN$: valor actual neto del proyecto
- $a(n;i)$: factor de valor presente de una anualidad
- $n$: vida del proyecto (períodos)
- $i$: tasa de descuento ([[trema]])

**Criterio de decisión:** la inversión es aceptable si $VA \geq 0$ (equivale exactamente a $VAN \geq 0$). Entre alternativas: mayor VA (o menor CAE si son costos).

## Ejemplos

- $VAN = 2.872$ a 2 años, 12%: $VA = 2.872 / 1{,}690 =$ \$1.699{,}6 por año.
- Ejemplo integral del PDF: $VAN = 118{,}7$ a 6 años, 15%: $VA = 118{,}7/3{,}784 =$ \$31{,}4 anuales (calculado a 5 años: $35{,}4$).

## Uso principal: alternativas con vidas distintas

Principio fundamental del PDF: **comparar alternativas mutuamente excluyentes durante el mismo período de análisis**. Comparar VANes de vidas distintas es inválido. Dos soluciones equivalentes:

### 1. Cadena de reemplazo
Repetir el proyecto corto tantas veces como haga falta para igualar la vida del largo (si no es múltiplo "justo", repetir ambos hasta una longitud común — el mcm de las vidas).

### 2. Anualidad equivalente
Convertir cada VAN en su VA y comparar las anualidades. Se asume que cada proyecto puede repetirse indefinidamente, de modo que las anualidades "siguen siempre".

**Ejemplo del PDF (tasa 12%):**

| | Proyecto A | Proyecto B |
|---|---|---|
| Inversión | \$10 | \$10 |
| Ingresos | \$3,75/año × 5 años | \$2,5/año × 10 años |
| VAN a su propia vida | $3{,}75 \cdot a(5) - 10 =$ \$3{,}518 | $2{,}5 \cdot a(10) - 10 =$ \$4{,}123 |

Comparar 3,518 contra 4,123 es **trampa** (horizontes distintos). 

- *Cadena de reemplazo:* repito A en el año 5: $VAN_A^{10} = 3{,}75 \cdot a(10) - 10 \cdot (1{,}12)^{-5} - 10 = 21{,}188 - 5{,}674 - 10 =$ \$5{,}514 $> 4{,}123$ → **A**.
- *Anualidad equivalente:* $VA_A = 3{,}518/3{,}6048 =$ \$0{,}9759; $VA_B = 4{,}123/5{,}6502 =$ \$0{,}7297 → **A**. Mismo resultado, menos cuentas.

## Conceptos auxiliares (PDF)

- **Período de análisis (AME):** período durante el cual se realiza la comparación entre alternativas mutuamente excluyentes.
- **Vida útil:** período durante el cual un activo se mantiene en uso productivo. Caso I: período de análisis = vida útil; Caso II: difieren → hay que homogeneizar.

## Errores comunes / Distinciones

- **Comparar VANes de proyectos con vidas distintas** sin cadena de reemplazo ni VA. Es el error que este método existe para evitar.
- **Usar el CAE cuando los proyectos no son repetibles.** La equivalencia VA ↔ cadena descansa en que el proyecto se puede repetir en condiciones similares; si no (proyecto único, tecnología que muere), comparar VANes sobre un horizonte común explícito.
- **Olvidar que $VA$ y $VAN$ siempre tienen el mismo signo:** el VA no cambia la decisión aceptar/rechazar, solo la presentación (y el ranking entre vidas distintas).

## Relacionado con
- [[van]]
- [[anualidades]]
- [[proyectos-mutuamente-excluyentes]]
- [[trema]]
- [[valor-tiempo-dinero]]
