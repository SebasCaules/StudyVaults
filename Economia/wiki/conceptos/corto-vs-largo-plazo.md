---
tags: [unit-02, micro]
---

## Definición

Distinción **temporal** central en la teoría de la empresa, definida según la flexibilidad de los factores:

- **Corto plazo (CP):** al menos un factor está **fijo** (típicamente $K$). La empresa solo puede ajustar el factor variable ($L$).
- **Largo plazo (LP):** **todos** los factores son variables. La empresa puede expandir/cerrar plantas, cambiar tecnología, redimensionar la escala.

## Aclaración importante

La distinción **no es cronológica**: depende de cuán rápido pueda ajustarse cada factor en una industria.
- Una panadería puede llegar al LP en meses (comprar otro horno, mudarse).
- Una refinería puede tardar años (la planta es un activo gigante e indivisible).

## Diferencias clave

| Aspecto | Corto plazo | Largo plazo |
|---|---|---|
| Factores fijos | Sí (al menos uno) | Ninguno |
| Costos fijos | $CF > 0$ | $CF = 0$ (todo es variable) |
| Fenómeno relevante | [[rendimientos-marginales-decrecientes]] | [[rendimientos-a-escala]] |
| Curva de costos | $CMe_{CP}$, formas de U | $CMe_{LP}$ envolvente |
| Decisión | ¿Cuánto $L$? ¿Producir o cerrar? | ¿Qué escala? ¿Entrar/salir del mercado? |

## La envolvente

La curva $CMe_{LP}$ es la **envolvente** de las $CMe_{CP}$ de cada planta posible: cada $Q$ óptimo en LP corresponde a la planta de tamaño que minimiza el costo medio para ese $Q$.

```
$
│   CP1  CP2   CP3
│    \  /\   /\   /
│     \/  \ /  \ /
│      \   X    X
│       \ / \  / \
│        V   \/   \____ ← envolvente (CMe_LP)
│________________________ Q
```

## Intuición / Por qué importa

- En **CP**, las decisiones son sobre cuánto producir con la planta dada; existe la posibilidad de "cerrar pero no salir" (si $P < CVMe$ mínimo).
- En **LP**, las decisiones son estructurales: entrar al mercado, escalar, salir definitivamente.
- En **competencia perfecta de LP**, todas las empresas operan en el **mínimo del $CMe_{LP}$** (tema central de Unidad 3).

## Ejemplo

Una empresa textil con una fábrica que produce 1000 prendas/mes:
- **CP:** decide cuántos operarios contratar para producir entre 800 y 1200 prendas.
- **LP:** decide si construir otra fábrica, mudarse a una más chica o cerrar.

## Errores comunes / Distinciones

- "Largo plazo" no es "muchos meses" — depende del bien.
- En CP, la curva de oferta de la empresa es el tramo del $CMg$ por encima del $CVMe$ mínimo; en LP, es el tramo del $CMg$ por encima del $CTMe$ (no hay $CF$).
- $CF$ en CP no es lo mismo que costo hundido (una vez gastado el $CF$ ya no afecta decisiones marginales).

## Relacionado con
- [[funcion-produccion]]
- [[rendimientos-marginales-decrecientes]]
- [[rendimientos-a-escala]]
- [[costos-fijos-variables]]
- [[curvas-costos]]
