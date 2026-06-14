---
tags: [unit-04, micro]
---

## Definición

**Discriminación de precios:** cobrar precios distintos a distintos consumidores (o por distintas cantidades) por **el mismo bien**, con el objetivo de extraer más excedente del consumidor. Solo es factible si la firma tiene **poder de mercado** y puede **evitar el arbitraje**.

## Tres grados (clasificación de Pigou)

| Grado | Mecanismo | Ejemplo |
|---|---|---|
| **1er grado (perfecta)** | Cobrar a cada consumidor exactamente su precio de reserva | Negociación uno-a-uno, subastas personalizadas, médicos privados con tarifa según paciente |
| **2do grado** | Precio depende de la **cantidad comprada** o del paquete | Descuentos por volumen ("1 botella $6, 2 por $10"), tarifas en bloques (luz, gas) |
| **3er grado** | Segmentar mercados con elasticidades distintas, cobrar precio diferente a cada segmento | Tarifas estudiantes/jubilados, precio por geografía, cines matiné, software académico |

## Condiciones para que sea factible

1. **Poder de mercado** (no funciona en CP — habría arbitraje y todos volverían al precio único).
2. **Capacidad de segmentar:** identificar a qué grupo pertenece cada consumidor.
3. **Imposibilidad de arbitraje:** que el grupo que compra barato no pueda revender al de precio alto.

## Regla de la discriminación de 3er grado

Maximizando $\pi$ sobre dos mercados segmentados:

$$IMg_1 = IMg_2 = CMg$$

Donde:
- $IMg_1, IMg_2$: ingreso marginal en cada segmento
- $CMg$: costo marginal común (única tecnología productiva)

Usando $IMg = P(1 - 1/|\varepsilon|)$:

$$P_1\left(1 - \frac{1}{|\varepsilon_1|}\right) = P_2\left(1 - \frac{1}{|\varepsilon_2|}\right) = CMg$$

Donde:
- $P_1, P_2$: precio cobrado a cada segmento
- $\varepsilon_1, \varepsilon_2$: elasticidad precio de la demanda en cada segmento

**Conclusión:** el mercado **más inelástico paga más caro**. Es aplicación directa del [[indice-lerner|Índice de Lerner]] por segmento.

## Intuición / Por qué importa

El monopolio "uniforme" deja excedente sobre la mesa:
- Algunos consumidores pagarían mucho más → la firma quiere capturarles ese extra.
- Otros consumidores no comprarían al precio único → la firma quiere venderles barato.

Discriminar **transfiere excedente del consumidor al productor** y, en algunos casos, **aumenta cantidad transada** (reduce DWL). 1er grado puro elimina el DWL pero captura todo el EC.

## Ejemplo

**Cines:**
- Tarifa estudiante / jubilado: discriminación 3er grado (segmentos identificables, demanda más elástica que adultos plenos).
- Combo "pochoclo + gaseosa + entrada": 2do grado (depende del paquete).

**Aerolíneas:**
- Tarifa flexible vs tarifa básica no reembolsable: 2do grado (autoselección).
- Tarifas según día de compra anticipada: 2do grado dinámico.

## Errores comunes / Distinciones

- **Llamar "discriminación" a cualquier diferencia de precio.** Cobrar más por un producto **premium** (con más calidad) no es discriminación — son productos distintos.
- **Olvidar la condición de no arbitraje.** Si los estudiantes pueden revender entradas a adultos, la discriminación se cae.
- **Aplicar discriminación en CP.** Imposible: todas las firmas serían precio-aceptantes.
- **Confundir 2do con 3er grado.** 2do: precio según *cantidad comprada* (autoselección por elección). 3er: precio según *segmento identificable* (estudiante, geografía).


## Gráfico

![[discriminacion-3er-grado.svg]]
## Relacionado con
- [[monopolio]]
- [[indice-lerner]]
- [[ingreso-marginal-monopolio]]
- [[elasticidad-precio-demanda]]
