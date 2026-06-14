---
tags: [unit-06, formula]
aliases: [margen de contribución, contribución unitaria]
---

## Definición

**Contribución marginal (unitaria):** lo que cada unidad vendida deja, por encima de su costo variable, para **contribuir a cubrir los costos fijos** — y, una vez cubiertos, para generar ganancia. Es la herramienta central del costeo directo ([[sistemas-de-costeo]]).

## Fórmula

$$\boxed{cm = p - cv} \qquad CM_{total} = (p - cv) \cdot q \qquad razón\ de\ contribución = \frac{p - cv}{p}$$

**Donde:**
- $cm$: contribución marginal unitaria (\$/u)
- $p$: precio de venta unitario
- $cv$: costo variable unitario
- $q$: unidades vendidas
- $CM_{total}$: contribución total del período

Resultado del período (costeo directo): $\pi = CM_{total} - CF$, con $CF$ los costos fijos totales.

## Ejemplo

$p = 10$, $cv = 6$ → $cm = 4$ \$/u (razón 40%). Con $CF = 8.000$: cada unidad "aporta" \$4; hacen falta $8.000/4 = 2.000$ unidades para cubrir los fijos ([[punto-de-equilibrio]]). La unidad 2.001 ya es ganancia neta de \$4.

## Intuición / Por qué importa

- Es el criterio de **decisiones de corto plazo**: aceptar un pedido extra a precio bajo conviene si $p > cv$ (contribución positiva), aunque "no cubra el costo total" — los fijos están hundidos en el CP.
- Ordena la **mezcla de productos**: ante capacidad limitada, priorizar la mayor contribución por unidad de recurso escaso.
- Un producto con contribución positiva pero "pérdida contable" por fijos asignados **no debe eliminarse**: su contribución paga fijos comunes que seguirían existiendo (pseudo-equilibrio, ver [[punto-de-equilibrio]]).
- Es el pariente de gestión del análisis marginal de la U2: comparar lo que agrega la unidad ($p$ vs $cv$) y no promedios — misma lógica que $IMg$ vs [[costo-marginal]].

## Errores comunes / Distinciones

- Calcularla con el costo **total** unitario (incluyendo fijos prorrateados): eso es margen de utilidad, no contribución.
- Confundirla con el **beneficio**: la contribución primero paga los fijos; solo el excedente es ganancia.
- En multiproducto, comparar contribuciones absolutas ignorando el recurso escaso (hora-máquina, m² de góndola).

## Relacionado con
- [[punto-de-equilibrio]]
- [[sistemas-de-costeo]]
- [[costos-fijos-variables]]
- [[costo-marginal]]
