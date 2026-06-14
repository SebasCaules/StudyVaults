---
tags: [unit-05, macro]
aliases: [multiplicador del dinero, m, expansión secundaria]
---

## Definición

**Multiplicador del dinero ($m$):** factor por el que se amplifica la base monetaria en la oferta monetaria total. Refleja la **creación secundaria de dinero** que hacen los bancos comerciales al prestar una fracción de los depósitos.

## Fórmula

$$\boxed{m = \frac{M}{BM} = \frac{e + 1}{e + r}}$$

Donde:
- $m$: multiplicador del dinero
- $M$: oferta monetaria total ($M = E + D$)
- $BM$: base monetaria ($BM = E + R$)
- $e = E/D$: preferencia del público por efectivo (cuánto cash guarda por cada peso depositado)
- $r = R/D$: coeficiente de encajes (fracción de depósitos retenida como reservas)
- $E$: efectivo en poder del público
- $D$: depósitos
- $R$: reservas bancarias

$$M = m \cdot BM$$

## Identidades base

| Variable | Definición |
|---|---|
| $M = E + D$ | Oferta monetaria = efectivo en público + depósitos |
| $BM = E + R$ | Base monetaria = efectivo en público + reservas bancarias |
| $R = r \cdot D$ | Reservas = encaje × depósitos |
| Préstamos $= D - R$ | Lo que el banco no encaja, lo presta |

## Mecanismo intuitivo

$100 de BM, encaje $r = 10\%$, sin preferencia por efectivo ($e = 0$):
- Banco 1 recibe $100, encaja $10, presta $90 → vuelve como depósito.
- Banco 2 encaja $9, presta $81 → vuelve.
- Banco 3 encaja $8,1, presta $72,9 → ...

Suma geométrica:
$$M = 100 + 90 + 81 + \ldots = \frac{100}{1 - 0,9} = 1000$$

Comprobación: $m = (0+1)/(0 + 0,1) = 10$. $M = 10 \cdot 100 = 1000$ ✓.

## Comparativa estática

| Si... | ...el multiplicador |
|---|---|
| ↑ $r$ (más encajes) | ↓ $m$ |
| ↑ $e$ (público guarda más cash) | ↓ $m$ |
| ↓ $r$ o ↓ $e$ | ↑ $m$ |

## Intuición / Por qué importa

- El BC controla la **BM**, pero la oferta monetaria total $M = m \cdot BM$ depende también del comportamiento de **bancos** (vía $r$, encajes y prudencia) y **público** (vía $e$).
- En **crisis**, los bancos suben sus reservas precautorias (sube $r$) y el público corre al efectivo (sube $e$) → cae $m$ → cae $M$ aunque la BM no cambie. Se llama **trampa de la liquidez**.
- Por eso aumentar la BM no garantiza aumento proporcional de $M$ — la transmisión depende del multiplicador.

## Ejemplo

Argentina (sept-2025): $m = M_2/BM \approx 1,76$. Significa que solo uno de cada dos pesos en M2 fue emitido directamente — el resto es creación secundaria del sistema bancario. Países desarrollados tienen multiplicadores mucho mayores (10-15+) por sistemas bancarios más profundos.

## Errores comunes / Distinciones

- **El BC no controla $m$ directamente** — solo lo influye a través de la política de encajes.
- **El multiplicador no es constante.** Cae en crisis y sube en bonanza.
- **La fórmula simplificada $m = 1/r$** vale solo si $e = 0$ (todo el dinero queda en bancos).


## Gráfico

![[multiplicador-dinero-cascada.svg]]
## Relacionado con
- [[agregados-monetarios]]
- [[banco-central-herramientas]]
- [[ecuacion-cuantitativa]]
- [[politica-monetaria-expansiva-contractiva]]
