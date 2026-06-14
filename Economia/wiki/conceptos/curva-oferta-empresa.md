---
tags: [unit-03, micro]
---

## Definición

**Curva de oferta de la empresa (CP, corto plazo):** es el **tramo del costo marginal ($CMg$) que está por encima del mínimo del costo variable medio ($CVMe$)**. Por debajo de ese precio la empresa cierra y ofrece $q = 0$.

## Fórmula

$$\text{Oferta empresa} = CMg(q) \quad \text{para } P \geq \min(CVMe)$$
$$q^*(P) = 0 \quad \text{si } P < \min(CVMe)$$

Donde:
- $CMg(q)$: costo marginal en función de la cantidad
- $CVMe$: costo variable medio ($CV/q$)
- $P$: precio de mercado
- $q^*(P)$: cantidad ofrecida óptima dado $P$

La curva tiene un "salto" discontinuo en el punto de cierre: para $P$ apenas abajo, la firma ofrece 0; apenas arriba, ofrece la cantidad donde $P = CMg$.

## Intuición / Por qué importa

Para cada precio dado, la empresa elige $q^*$ donde $P = CMg$ — pero solo si esa producción no la hace perder más que cerrando. Recuperando dos resultados:

1. **Maximización del beneficio:** $P = CMg$ define cantidad óptima.
2. **Punto de cierre:** $P < \min(CVMe)$ → $q = 0$.

La unión de ambas reglas es la curva de oferta individual. La **curva de oferta de la industria** se obtiene como **suma horizontal** de todas las ofertas individuales: a cada $P$, suma las cantidades de cada firma. Así se "deduce" desde primeros principios la curva de oferta de la Unidad 1.

## Ejemplo

Firma con $CMg(q) = 4 + 2q$ y $\min(CVMe) = 6$ a $q = 1$. Su oferta:
- $P = 5$ → cierra ($P < \min(CVMe) = 6$), $q^* = 0$.
- $P = 8$ → $8 = 4 + 2q \Rightarrow q^* = 2$.
- $P = 12$ → $q^* = 4$.

Si hay 100 firmas idénticas, la oferta de la industria es $Q^*(P) = 100 \cdot q^*(P)$.

## Errores comunes / Distinciones

- **Tomar todo el $CMg$ como oferta.** La parte por debajo de $\min(CVMe)$ no cuenta — la firma cierra.
- **Confundir oferta de empresa con oferta de industria.** La de industria es la suma horizontal; usualmente más elástica (más firmas para responder).
- **Olvidar el salto en el cierre.** Al precio justo, la firma puede ofrecer $0$ o $q^*$ — formalmente la curva no es continua en ese punto.


## Gráfico

![[maximizacion-cp-zonas.svg]]
## Relacionado con
- [[punto-cierre]]
- [[empresa-precio-aceptante]]
- [[competencia-perfecta-caracteristicas]]
- [[excedente-productor]]
