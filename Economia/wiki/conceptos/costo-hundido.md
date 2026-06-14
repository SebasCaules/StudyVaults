---
tags: [unit-08, definicion]
aliases: [costos hundidos, sunk cost, costo irrecuperable]
---

## Definición

**Costo hundido:** costo **ya pagado en el pasado que no puede ser recuperado**, y que por lo tanto es **común a todas las alternativas** bajo análisis. Los costos hundidos **no son pertinentes**: no se toman en cuenta ni se asignan a ninguna alternativa, porque no establecen diferencias al compararlas y ocurrieron **antes** de tomar la decisión.

## Por qué se excluye (la demostración del PDF)

Las decisiones se toman comparando alternativas **restando flujos de fondos**. Como el costo hundido está en *todos* los flujos, **en la resta se cancela**.

Ejemplo: decidir si lanzar el producto XX. Ya se invirtieron \$100.000 en I+D; el flujo neto anual estimado hoy es \$10.000 por 5 años, TREMA 10% (cuando empezó el I+D se estimaban \$40.000 — irrelevante: la historia no cambia la decisión de hoy):

| Alternativa | Flujo en VP |
|---|---|
| Lanzar | $-100.000 + 10.000 \cdot a(5;10\%)$ |
| No lanzar | $-100.000$ |
| **Lanzar − No lanzar** | $0 + 10.000 \cdot a(5;10\%) > 0$ → **se lanza** |

**Donde:**
- $a(5;10\%)$: factor de VP de una anualidad de 5 años al 10% ([[anualidades]])

Los \$100.000 "desaparecen" de la comparación. Lo único que importa es si los flujos **futuros** incrementales valen la pena.

## El matiz que toma la cátedra (slide 71)

*"Otros efectos, como los ahorros en impuestos por amortización, sí deben tenerse en cuenta."* Si el activo ya comprado (costo hundido) todavía genera [[escudo-fiscal]] por su amortización pendiente, ese escudo es un **flujo futuro que depende de la alternativa** → entra al análisis aunque el costo del activo no.

## Distinción clave: hundido ≠ costo de oportunidad

Un recurso propio **ocioso pero con valor de mercado NO es un costo hundido**: usarlo en el proyecto tiene [[costo-de-oportunidad]]. Ejemplo del torno (PDF): la empresa tiene un torno ocioso adquirido por \$8.000, con valor de mercado \$5.000.

- *Con proyecto:* el torno se usa. *Sin proyecto:* se vende en \$5.000.
- → La inversión imputable al proyecto es **\$5.000** (lo que se deja de cobrar), igual que para una empresa que no tiene torno y debe comprarlo.
- El costo **histórico** de \$8.000 sí es hundido e irrelevante.

Regla: el costo de oportunidad se determina comparando situación *con* vs *sin* proyecto — y sin forzarlo: puede no existir.

## Casos típicos de parcial

- **Estudio de consultora / factibilidad ya pagado** (caso parque solar, parcial 11-Nov-2025): se menciona en el enunciado justamente para que el distraído lo meta en el flujo. **Se excluye.**
- **I+D ya gastado** antes de decidir el lanzamiento.
- **Costo histórico de un activo** que se reutiliza (lo relevante es su valor de mercado actual, no lo que costó).

## Errores comunes / Distinciones

- **"Ya gastamos tanto que no podemos abandonar ahora"** — la falacia del costo hundido: lo gastado no se recupera haga lo que se haga; solo cuentan los flujos futuros.
- **Excluir también el escudo fiscal pendiente del activo hundido** — ese sí es flujo futuro.
- **Confundir hundido con fijo:** un costo fijo *futuro y evitable* (un alquiler que se firma si se hace el proyecto) NO es hundido — entra al flujo.
- Conecta con [[costos-economicos-vs-contables]]: la contabilidad registra el costo histórico; la decisión económica mira solo lo incremental.

## Relacionado con
- [[flujo-de-fondos-proyecto]]
- [[costo-de-oportunidad]]
- [[escudo-fiscal]]
- [[costos-economicos-vs-contables]]
- [[van]]
