---
tags: [unit-06, formula]
aliases: [ciclo operativo, ciclo de conversión de efectivo]
---

## Definición

- **Ciclo operativo:** tiempo que transcurre entre **recibir el inventario, venderlo y cobrar** los créditos generados por la venta.
- **Ciclo de caja:** tiempo entre **pagar** el inventario comprado y **cobrar** el efectivo de la venta. Mide **cuántos días hay que financiar** bienes de cambio y créditos con fondos propios o bancarios.

## Fórmula

$$Ciclo\ operativo = Período\ de\ inventario + Período\ de\ cobranza$$

$$\boxed{Ciclo\ de\ caja = Ciclo\ operativo - Período\ de\ pago}$$

**Donde:**
- $Período\ de\ inventario$: días que el stock está "en el estante" ($BC \times 360/CMV$)
- $Período\ de\ cobranza$: días que tarda en cobrar ($Créditos \times 360/Ventas$)
- $Período\ de\ pago$: días entre recibir el inventario y pagarlo ($D_{com} \times 360/Compras$)

Línea de tiempo:

```
Compra inventario ──(período inventario)── Venta ──(período cobranza)── Cobro
        └─(período de pago)─ Pago │←──────── ciclo de caja ────────→│
        │←———————————————— ciclo operativo ————————————————→│
```

## Ejemplo

Con los datos de GP5 Ej. 5: existencias 72 días + crédito a clientes 90 días → **ciclo operativo = 162 días**. Si a los proveedores se les paga a 60 días, ciclo de caja = 102 días: más de tres meses de giro que alguien tiene que financiar — eso dimensiona las NOF del [[capital-de-trabajo]].

## Intuición / Por qué importa

- Cuanto más largo el ciclo de caja, más capital de trabajo exige el mismo nivel de ventas.
- Se acorta: rotando stock más rápido, cobrando antes o **estirando el pago a proveedores** (financiamiento espontáneo).
- Conecta los ratios de actividad ([[ratios-financieros]]) con la necesidad de fondos: es la versión "en días" de las NOF.

## Errores comunes / Distinciones

- **Ciclo de caja negativo es posible y deseable** (supermercado: cobra contado, paga a 60 días — los proveedores financian el negocio).
- No confundir ciclo **operativo** (compra→cobro) con ciclo de **caja** (pago→cobro).
- Los períodos se calculan con las bases correctas: inventario sobre CMV, cobranza sobre ventas, pago sobre compras.

## Relacionado con
- [[capital-de-trabajo]]
- [[ratios-financieros]]
- [[estado-origen-aplicacion-fondos]]
