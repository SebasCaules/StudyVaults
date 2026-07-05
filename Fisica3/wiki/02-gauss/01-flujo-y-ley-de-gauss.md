---
tags: [teoria, unidad-2, ley-de-gauss, flujo-electrico]
fuente: raw/resumenes/resumen-fisica-3.pdf
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Flujo eléctrico y ley de Gauss

La ley de Gauss relaciona el flujo del campo eléctrico a través de una superficie
cerrada con la carga que esa superficie encierra. Es la herramienta central para
calcular el campo $\vec{E}$ en configuraciones con simetría: en vez de integrar la
contribución de cada carga (Coulomb), se elige una superficie adecuada y el cálculo
se reduce a un despeje. Esta página cubre el flujo, la ley general y el método de
evaluación; los [[02-casos-de-aplicacion|seis casos con simetría]] se desarrollan aparte.

## Flujo eléctrico

El flujo eléctrico mide cuánto campo atraviesa una superficie. Para una superficie $S$
se define como la integral del campo por el elemento de área orientado:

$$\Phi = \iint_S \vec{E}\cdot d\vec{S}$$

donde $\vec{E}$ es el campo eléctrico y $d\vec{S}$ es el vector elemento de superficie
(módulo igual al área del elemento, dirección normal a la superficie). Es la misma noción
de flujo de un campo vectorial que se trabaja en Análisis II.

## Ley de Gauss

> **Ley de Gauss.** El flujo del campo eléctrico a través de **cualquier** superficie
> cerrada es igual a la carga encerrada dividida por la permitividad del vacío:
> $$\oiint_S \vec{E}\cdot d\vec{S} = \frac{Q_{enc}}{\varepsilon_0}$$
> donde $Q_{enc}$ es la carga neta encerrada por la superficie y $\varepsilon_0$ es la
> constante de permitividad del vacío.

La superficie cerrada sobre la que se aplica se llama **superficie gaussiana**. Es una
superficie imaginaria que se elige libremente: solo importan las cargas que quedan en su
interior, sin que influya cómo estén distribuidas ni las cargas externas.

**Observación.** La ley vale siempre, cualquiera sea la superficie. Su utilidad práctica
aparece cuando la simetría del problema permite elegir una gaussiana sobre la que $\vec{E}$
sea sencillo (constante en módulo y con ángulo fijo respecto de la normal).

## Cómo evaluar la integral

Escribiendo el producto escalar en términos del ángulo $\alpha$ entre $\vec{E}$ y $d\vec{S}$:

$$\oiint_S \vec{E}\cdot d\vec{S} = \oiint_S |\vec{E}|\,|d\vec{S}|\cos\alpha = \frac{Q_{enc}}{\varepsilon_0}$$

Si se elige la gaussiana de modo que $E$ sea **constante** en toda la superficie y el ángulo
$\alpha$ también sea constante, ambos salen de la integral y queda $E\,S\cos\alpha = Q_{enc}/\varepsilon_0$,
es decir:

$$E = \frac{Q_{enc}}{\varepsilon_0\,S\cos\alpha}$$

donde $S$ es el área total de la superficie gaussiana y $\alpha$ el ángulo (fijo) entre el
campo y la normal.

El caso más usado es cuando además $\alpha = 0$, o sea cuando $\vec{E}$ es perpendicular a la
superficie (paralelo a la normal) en todos sus puntos. Entonces $\cos\alpha = 1$ y la expresión
se reduce a:

$$E = \frac{Q_{enc}}{\varepsilon_0\,S}$$

Esta es la forma con la que se resuelven los casos con simetría: se busca una gaussiana donde
el campo sea perpendicular y constante, y el problema queda en calcular $Q_{enc}$ y el área $S$.

## Densidades de carga

Para calcular $Q_{enc}$ conviene tener a mano las densidades de carga, según cómo esté
distribuida la carga en la distribución:

| Densidad | Definición | Carga (si es constante) |
|---|---|---|
| Lineal $\lambda$ | $\lambda = \dfrac{dq}{d\ell}$ | $q = \lambda\,\ell$ |
| Superficial $\sigma$ | $\sigma = \dfrac{dq}{dS}$ | $q = \sigma\,S$ |
| Volumétrica $\rho$ | $\rho = \dfrac{dq}{dV}$ | $q = \rho\,V$ |

En general la carga encerrada se obtiene integrando la densidad sobre la región interior a la
gaussiana ($Q_{enc} = \int \lambda\,d\ell$, $\int \sigma\,dS$ o $\int \rho\,dV$ según el caso);
cuando la densidad es constante, la integral es simplemente densidad por longitud, área o volumen.

## Estrategia general

Para aplicar la ley de Gauss a una distribución con simetría, el procedimiento es siempre el mismo:

1. Identificar la simetría (cilíndrica, plana o esférica) y elegir una superficie gaussiana
   acorde, sobre la que $\vec{E}$ sea perpendicular y de módulo constante.
2. Escribir el flujo como $E\,S$, con $S$ el área de la parte de la gaussiana que el campo atraviesa.
3. Calcular la carga encerrada $Q_{enc}$ con la densidad correspondiente.
4. Igualar $E\,S = Q_{enc}/\varepsilon_0$ y despejar $E$.

---

## Ver también

- [[02-casos-de-aplicacion]] — los seis casos con simetría (hilo, plano, esferas y cilindros)
