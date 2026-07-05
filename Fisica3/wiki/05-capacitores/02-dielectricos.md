---
tags: [teoria, unidad-5, capacitores, dielectricos, energia]
fuente: raw/resumenes/resumen-fisica-3.pdf
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Capacitores con material dieléctrico

Insertar un dieléctrico entre las placas de un capacitor aumenta su capacidad. El material
se caracteriza por su permitividad relativa $\varepsilon_r$, que reescala el campo, el
voltaje y la energía respecto del capacitor en vacío. Esta página parte de la
[[01-capacitores|definición de capacidad]] y analiza qué cambia al agregar el material.

## Permitividad relativa

Se distinguen tres permitividades:

| Símbolo | Nombre | Descripción |
|---|---|---|
| $\varepsilon$ | permitividad absoluta | permitividad del material |
| $\varepsilon_0$ | permitividad del vacío | constante universal |
| $\varepsilon_r$ | permitividad relativa | del material respecto del vacío |

> **Definición.** La permitividad relativa es el cociente entre la permitividad absoluta del
> material y la del vacío:
> $$\varepsilon_r = \frac{\varepsilon}{\varepsilon_0}$$
> Es adimensional y vale $\varepsilon_r = 1$ en vacío, $\varepsilon_r > 1$ en cualquier
> dieléctrico.

## Efecto sobre el voltaje y la capacidad

Manteniendo la misma carga $Q_0$, al introducir el dieléctrico la diferencia de potencial
**disminuye** por un factor $\varepsilon_r$ respecto de la del capacitor en vacío:

$$\Delta V = \frac{\Delta V_0}{\varepsilon_r}$$

donde $\Delta V_0$ es el voltaje sin dieléctrico y $\Delta V$ el voltaje con dieléctrico.
Como $C = Q_0 / \Delta V$, al bajar el voltaje sube la capacidad en el mismo factor:

$$C = \frac{Q_0}{\Delta V} = \frac{Q_0}{\Delta V_0 / \varepsilon_r} = \frac{Q_0}{\Delta V_0}\,\varepsilon_r$$

es decir, la capacidad con dieléctrico es la capacidad en vacío multiplicada por
$\varepsilon_r$:

$$C = \varepsilon_r\, C_0$$

donde $C_0 = Q_0 / \Delta V_0$ es la capacidad del mismo capacitor en vacío. Por eso las
fórmulas geométricas de [[01-capacitores]] llevan el factor $\varepsilon_r$.

## Efecto sobre la energía

A partir de $C = \varepsilon_r C_0$ se deduce la energía almacenada con dieléctrico, a carga
$Q_0$ constante. Partiendo de la energía en vacío $U_0 = \dfrac{Q_0^2}{2C_0}$ y de la
energía con dieléctrico $U_E = \dfrac{Q_0^2}{2C}$:

$$U_E = \frac{Q_0^2}{2\,\varepsilon_r C_0} = \frac{U_0}{\varepsilon_r}$$

donde $U_0$ es la energía sin dieléctrico. A carga constante, la energía almacenada
**disminuye** por el factor $\varepsilon_r$: el capacitor "atrae" al dieléctrico hacia
adentro, y el sistema pierde energía en el proceso.

> **Nota.** Este resultado supone la **carga** $Q_0$ constante (capacitor aislado, desconectado
> de la fuente). Si en cambio se mantiene el **voltaje** constante el balance energético es
> distinto; los apuntes de la cursada 2024-1C tratan el caso de carga constante.

---

## Ver también

- [[01-capacitores]] — capacidad, geometrías, combinación y energía
- [[03-redes-y-redistribucion-resueltos]] — problema 3.7: cambio de energía al insertar un dieléctrico
