---
tags: [unit-06, metodo]
aliases: [debe y haber, registración contable]
---

## Definición

**Partida doble:** cada operación tiene un **doble efecto** y afecta **al menos dos cuentas**, de modo que la ecuación contable $A = P + PN$ se mantiene siempre. Se registra en **cuentas T** (título, debe a la izquierda, haber a la derecha), cronológicamente en el **Libro Diario** y sistemáticamente (por cuenta) en el **Libro Mayor**.

## Reglas

| Va al **DEBE** (débito) | Va al **HABER** (crédito) |
|---|---|
| Aumentos de Activo | Disminuciones de Activo |
| Disminuciones de Pasivo | Aumentos de Pasivo |
| Disminuciones de PN | Aumentos de PN |
| Egresos (R−) | Ingresos (R+) |

Invariantes (los dos controles de consistencia):

$$DÉBITOS = CRÉDITOS \quad \text{(en cada operación)}$$
$$\sum saldos\ deudores = \sum saldos\ acreedores \quad \text{(en todo momento)}$$

Las cuentas de Activo y Egresos nacen y viven con **saldo deudor**; las de Pasivo, PN e Ingresos con **saldo acreedor**. Las cuentas de resultado son **transitorias**: al cierre del ejercicio se vacían contra "Utilidades" (saldo final nulo). En empresas industriales también hay cuentas transitorias **de producción** (Materia Prima en Proceso, MOD en Proceso, GGF en Proceso...) que se vuelcan a Producción en Proceso.

## Ejemplo

Movimientos de CONTA (GP5 Ej. 1):

| Operación | Debe | Haber |
|---|---|---|
| Compra 100 u a \$2,5 a 30 días | Bienes de cambio 250 | Proveedores 250 |
| Cobro de créditos \$200 | Disponibilidades 200 | Créditos por ventas 200 |
| Venta 100 u a \$4 (50 contado, resto crédito) | Disponibilidades 50 + Créditos 350 | Ventas (R+) 400 |
| Costo de esa venta (PEPS) | CMV (R−) 275 | Bienes de cambio 275 |
| Amortización del mes | Amortizaciones (R−) 80 | Amortizaciones acumuladas 80 |

En cada fila, débitos = créditos.

## Intuición / Por qué importa

Es el mecanismo que hace **autoverificable** a la contabilidad: si el balance no balancea, hay un error de registración. También explica por qué "ganar plata" y "tener plata" difieren: una venta a crédito debita Créditos (no Caja) contra Ventas.

## Errores comunes / Distinciones

- **"Debe = malo, haber = bueno" no existe:** son posiciones (izquierda/derecha), no juicios. Cobrar debita Caja.
- Olvidar la **contrapartida de resultado**: toda venta tiene dos asientos (el ingreso y el CMV).
- Registrar el pago de una deuda como gasto: cancela pasivo, **no** es egreso de resultados ([[devengado-vs-percibido]]).

## Relacionado con
- [[balance-patrimonial]]
- [[cuadro-de-resultados]]
- [[devengado-vs-percibido]]
