---
tags: [teoria, unidad-4, combinaciones-con-repeticion, distribucion, conteo]
fuente: raw/4-parciales-finales/algebra.pdf
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Combinaciones con repetición

Segunda cara de la [[01-conteo-y-combinaciones|combinatoria]] de la cursada 2023-1C: los
problemas de **repartir objetos idénticos en cajas distintas**. Aparecen en los parciales
como distribuciones (flores en jarrones, bolas en urnas) y se resuelven todos con la misma
fórmula, la de las **combinaciones con repetición**. Esta página presenta la fórmula, la
técnica de "al menos uno por caja" y el ejercicio que las usa.

## La fórmula

> **Definición (combinaciones con repetición).** Repartir $n$ objetos **idénticos** en $k$
> cajas **distintas** (o, equivalentemente, elegir $n$ elementos de $k$ tipos permitiendo
> repetir) se puede hacer de
> $$\binom{n + k - 1}{n} = \binom{n + k - 1}{k - 1}$$
> maneras, donde $n$ es la cantidad de objetos a repartir y $k$ la cantidad de cajas.

Las dos formas del número combinatorio son iguales por la simetría $\binom{m}{j} = \binom{m}{m-j}$;
en los parciales se escribe la versión $\binom{n + k - 1}{n}$.

**Observación.** La cuenta permite que una caja quede **vacía**: no se exige nada sobre el
reparto. Cuando el enunciado pide "al menos uno por caja", hay que ajustar antes de aplicar
la fórmula (ver la técnica de abajo).

## Técnica: "al menos uno por caja"

Si el problema exige que **cada caja reciba al menos un objeto**, se procede en dos pasos:

1. **Reservar uno por caja.** Se coloca de entrada $1$ objeto en cada una de las $k$ cajas.
   Eso consume $k$ objetos y garantiza la condición.
2. **Repartir el resto libremente.** Quedan $n - k$ objetos, que ahora sí se distribuyen sin
   restricción entre las $k$ cajas con la fórmula general:
   $$\binom{(n - k) + k - 1}{\,n - k\,}.$$

donde $n$ es el total de objetos y $k$ el número de cajas. El truco convierte un problema con
restricción en uno libre, restándole $k$ a los objetos disponibles.

## Ejemplo resuelto: repartir flores en cajas

El ejercicio modelo (Recuperatorio 1P, 4C-2016) reparte flores en **$29$ cajas distintas**,
con $324$ rosas y $120$ azules, bajo dos condiciones independientes.

### Condición sobre las rosas — reparto libre

Se reparten las $324$ rosas idénticas entre las $29$ cajas sin restricción. Aplicando la
fórmula con $n = 324$ objetos y $k = 29$ cajas:

$$\binom{324 + 29 - 1}{324} = \binom{324 + 28}{324} = \binom{352}{324}.$$

### Condición sobre las azules — al menos una por caja

La segunda condición pide que haya **al menos un azul en cada caja**. Se aplica la técnica:

1. Se pone $1$ azul en cada una de las $29$ cajas, consumiendo $29$ de los $120$ azules.
2. Quedan $120 - 29 = 91$ azules para repartir libremente entre las $29$ cajas:

$$\binom{91 + 29 - 1}{91} = \binom{91 + 28}{91} = \binom{119}{91}.$$

> **Nota.** El enunciado original acompaña la condición de las rosas con una restricción
> extra de divisibilidad sobre el número de rosas por caja que en el manuscrito queda
> *(dudoso en el original)*. La parte transcripta con certeza es el mecanismo de reparto:
> libre para las rosas, y con "al menos uno por caja" para las azules.

## Cómo reconocer cada herramienta

Conviene tener claro cuándo usar el número combinatorio simple y cuándo el de repetición.

| Situación | Herramienta | Fórmula |
|---|---|---|
| Elegir un subconjunto de $k$ de $n$ (sin orden, sin repetir) | Número combinatorio | $\binom{n}{k}$ |
| Repartir $n$ objetos idénticos en $k$ cajas (se puede repetir/vaciar) | Combinaciones con repetición | $\binom{n+k-1}{n}$ |
| Repartir con **al menos uno** por caja | Repetición tras reservar $k$ | $\binom{n-1}{k-1}$ |

La última fila sale de aplicar la técnica de reserva: tras poner uno por caja quedan $n - k$
objetos, y $\binom{(n-k)+k-1}{\,n-k\,} = \binom{n-1}{\,n-k\,} = \binom{n-1}{k-1}$.

---

## Ver también

- [[01-conteo-y-combinaciones]] — reglas de conteo y número combinatorio $\binom{n}{k}$
- [[01-relaciones/02-clasificacion-y-equivalencia]] — el marco de clases donde suele acoplarse el conteo
