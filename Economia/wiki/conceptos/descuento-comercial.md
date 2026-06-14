---
tags: [unit-07, formula]
aliases: [descuento, descuento de documentos, pronto pago, tasa de descuento comercial]
---

## Definición

**Descuento:** compensación que debe pagarse por la **disponibilidad inmediata de un capital que vence en el futuro** (adelantar el cobro de un cheque, pagaré o factura).

**Descuento comercial:** variante de uso difundido por su facilidad de cálculo (no surge de las reglas del interés compuesto): el descuento se aplica **sobre el valor nominal** del documento, proporcional al tiempo restante y a la tasa de descuento.

## Fórmula

$$DC = C \cdot d \cdot n \qquad\qquad \boxed{VA = C\,(1 - d\cdot n)}$$

**Donde:**
- $C$: valor nominal del documento (lo que vence en el futuro)
- $VA$: valor actual que se cobra hoy
- $DC = C - VA$: descuento comercial
- $d$: tasa de descuento del período
- $n$: períodos hasta el vencimiento

**Tasa de interés equivalente** (clave: el descuento se aplica sobre el **nominal**, el interés sobre el **valor actual**; para $n=1$):

$$i = \frac{d}{1-d}$$

Siempre $i > d$: una tasa de descuento del 10% "esconde" una tasa de interés del 11,11%.

## Ejemplos

1. **Pagaré** de \$100 a 1 año, $d = 10\%$: $VA = 100(1-0{,}10) = 90$; $DC = 10$. Tasa de interés implícita: $i = 0{,}10/0{,}90 = 11{,}11\%$ anual (verificación: $90 \times 11{,}11\% = 10$ ✓).
2. **Descuento por pronto pago** (slides): factura de \$100 a 60 días, 10% de descuento pagando a 10 días (plazo ganado: 45 días). Tasa implícita: $11{,}11\%$ por 45 días → anualizada: $TEA = (1{,}1111)^{360/45} - 1 = \mathbf{132{,}28\%}$. **No** tomar el descuento equivale a financiarse a esa tasa astronómica.

## Intuición / Por qué importa

- Es la matemática del **adelanto de cheques/facturas** (muy común en pymes argentinas) y de los descuentos de proveedores.
- Permite traducir condiciones comerciales ("10% por pronto pago") a una **TEA comparable** con el costo de financiarse en el banco: si la TEA implícita del descuento supera la tasa a la que la empresa se financia, conviene pagar al contado y tomar el descuento.

## Errores comunes / Distinciones

- **Confundir tasa de descuento con tasa de interés:** $d$ se aplica sobre el nominal, $i$ sobre el valor actual; no son intercambiables.
- **Caso patológico:** con plazos largos o tasas altas, $d \cdot n$ puede superar 1 y el descuento exceder el valor nominal — matemáticamente posible, **económicamente absurdo** (habría que pagar por entregar el documento). El descuento comercial solo tiene sentido en el corto plazo.
- **No anualizar el costo del pronto pago** antes de compararlo con otras fuentes de financiamiento.
- No confundir con "tasa de descuento" en el sentido de [[conceptos/trema|TREMA]]/costo de oportunidad usado para el VAN — acá $d$ es una convención comercial de corto plazo.

## Relacionado con
- [[tasas-equivalentes]] — anualizar la tasa implícita
- [[tasa-interes]]
- [[costo-financiero-total]]
- [[formulas/unidad-07]]
