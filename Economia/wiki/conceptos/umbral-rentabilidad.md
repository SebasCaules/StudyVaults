---
tags: [unit-03, micro]
---

## Definición

**Umbral de rentabilidad (UR):** precio a partir del cual la empresa empieza a obtener **beneficios económicos extraordinarios** ($\pi > 0$). Por debajo de este precio (pero arriba del [[punto-cierre]]) la empresa produce a pérdida, aunque conviene producir.

## Fórmula

$$P_{UR} = \min(CTMe)$$

Donde:
- $P_{UR}$: precio del umbral de rentabilidad
- $CTMe$: costo total medio ($CT/q$, incluye fijos y variables)

En ese punto, $P = CMg = CTMe$ y por lo tanto $\pi = (P - CTMe) \cdot q^* = 0$.

Donde:
- $\pi$: beneficio económico
- $q^*$: cantidad óptima ($P = CMg$)

## Intuición / Por qué importa

Define las **tres zonas** de la decisión de la empresa en CP:

| Zona de $P$ | Decisión | Resultado |
|---|---|---|
| $P > P_{UR}$ | Producir | $\pi > 0$ — beneficio extraordinario |
| $P_{cierre} < P < P_{UR}$ | Producir a pérdida | $-CF < \pi < 0$ — pierde menos que cerrando |
| $P < P_{cierre}$ | Cerrar | $\pi = -CF$ |
| $P = P_{UR}$ | Producir | $\pi = 0$ — beneficio normal |

**En equilibrio de LP en CP**, el precio converge precisamente a $\min(CMe_{LP}) = P_{UR}^{LP}$ por libre entrada y salida — todas las firmas operan justo en el umbral.

## Ejemplo

Empresa con $CTMe$ que llega a su mínimo en $q = 15$, $\min(CTMe) = 12$. Si el mercado está a:
- $P = 18$ → $\pi = (18 - 12) \cdot 15 + \text{ajustes por } q^* > 0$ — zona extraordinaria.
- $P = 12$ → opera justo en UR, $\pi = 0$ — beneficio normal.
- $P = 10$ → produce a pérdida (si arriba del cierre); pierde menos que cerrando.

## Errores comunes / Distinciones

- **No confundir con [[punto-cierre]]:** UR usa $CTMe$ (incluye fijos); cierre usa $CVMe$ (solo variables).
- **El "beneficio cero" del UR es económico, no contable.** Beneficio normal = ingreso cubre el costo de oportunidad del capital. La empresa contablemente puede mostrar utilidades.
- **En LP, $\pi > 0$ atrae entrantes** — los beneficios extraordinarios desaparecen por la libre entrada hasta que $P$ vuelve al UR.


## Gráfico

![[maximizacion-cp-zonas.svg]]
## Relacionado con
- [[punto-cierre]]
- [[beneficios-normales-extraordinarios]]
- [[equilibrio-corto-vs-largo-plazo]]
- [[curva-oferta-empresa]]
