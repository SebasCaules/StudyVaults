---
tags: [teoria, unidad-2, ley-de-gauss, simetria, campo-electrico]
fuente: raw/resumenes/resumen-fisica-3.pdf
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Casos de aplicación de la ley de Gauss

Seis distribuciones con simetría en las que la [[01-flujo-y-ley-de-gauss|ley de Gauss]]
resuelve el campo eléctrico de forma directa: hilo, plano, y las esferas y cilindros
conductores y dieléctricos. En todas se sigue la misma receta: elegir una gaussiana donde
$\vec{E}$ sea perpendicular y constante, escribir el flujo como $E\,S$, calcular $Q_{enc}$
y despejar.

> **Nota.** En el original la esfera y el cilindro usan distintas letras para el radio de la
> distribución ($r$, $a$) y para el punto de evaluación ($r_A$, $r$). Acá se unifica la
> notación: $R$ es el radio característico de la distribución (radio del hilo/cilindro/esfera)
> y $r$ es la distancia desde el eje o el centro al punto donde se calcula el campo.

## Hilo recto infinito ($\lambda = $ cte)

Un hilo recto infinito con densidad lineal de carga $\lambda$ constante. La simetría es
cilíndrica: el campo es radial y solo depende de la distancia $r$ al hilo. Se toma como
gaussiana un **cilindro coaxial** de radio $r$ y longitud $\ell$. Sobre la cara lateral
$\vec{E}$ es perpendicular ($\alpha = 0$) y constante; por las tapas el flujo es nulo
(el campo es paralelo a ellas). El área que atraviesa el campo es $S = 2\pi r\ell$.

Con $Q_{enc} = \lambda\,\ell$, la ley de Gauss $E\,(2\pi r\ell) = Q_{enc}/\varepsilon_0$ da:

$$E = \frac{\lambda}{2\pi\varepsilon_0\,r}$$

donde $\lambda$ es la densidad lineal de carga y $r$ la distancia al hilo. El campo decae
como $1/r$.

## Pared plana infinita ($\sigma = $ cte)

Un plano infinito con densidad superficial de carga $\sigma$ constante. El campo sale
perpendicular al plano hacia ambos lados. Se toma una gaussiana en forma de caja (o cilindro)
que **atraviesa el plano**, con dos tapas de área $S$ paralelas al plano; los costados no
aportan flujo. El campo atraviesa las **dos** tapas, de modo que el flujo total es $2\,E\,S$.

Con $Q_{enc} = \sigma\,S$, la ley de Gauss $2\,E\,S = Q_{enc}/\varepsilon_0$ da:

$$E = \frac{\sigma}{2\varepsilon_0}$$

donde $\sigma$ es la densidad superficial de carga. El campo es **uniforme**: no depende de la
distancia al plano.

## Esfera conductora ($\sigma = $ cte)

Una esfera conductora de radio $R$ (maciza o hueca). En un conductor la carga se distribuye
en la superficie, así que toda la carga queda en $r = R$. Se usa una gaussiana esférica
concéntrica de radio $r$, sobre la que $\vec{E}$ es radial y constante ($S = 4\pi r^2$).

**Fuera de la esfera ($r > R$):** la gaussiana encierra toda la carga. De
$E\,(4\pi r^2) = Q_{enc}/\varepsilon_0$:

$$E = \frac{Q_{enc}}{4\pi\varepsilon_0\,r^2}$$

Es idéntico al campo de una carga puntual concentrada en el centro.

**Dentro de la esfera ($r < R$):** la gaussiana no encierra carga ($Q_{enc} = 0$, la carga
está toda en la superficie), por lo tanto:

$$E = 0$$

> **Observación.** El campo exterior de la esfera conductora coincide con el de una **esfera
> no conductora hueca**: en ambos casos toda la carga queda por fuera de la gaussiana.

## Esfera no conductora maciza ($\rho = $ cte)

Una esfera aislante de radio $R$ con densidad volumétrica de carga $\rho$ constante, repartida
en todo el volumen. Gaussiana esférica de radio $r$, $S = 4\pi r^2$.

**Fuera ($r > R$):** se encierra la carga total $Q_{tot}$. De $E\,(4\pi r^2) = Q_{tot}/\varepsilon_0$:

$$E = \frac{Q_{tot}}{4\pi\varepsilon_0\,r^2}$$

Usando $\rho = \dfrac{Q_{tot}}{\tfrac{4}{3}\pi R^3}$ para escribirlo en función de la densidad:

$$E = \frac{\rho\,R^3}{3\varepsilon_0\,r^2}$$

**Dentro ($r < R$):** la gaussiana solo encierra la carga del volumen interior,
$Q_{enc} = \rho\,\tfrac{4}{3}\pi r^3$. De $E\,(4\pi r^2) = Q_{enc}/\varepsilon_0$:

$$E = \frac{\rho\,r}{3\varepsilon_0}$$

donde $\rho$ es la densidad volumétrica y $r$ la distancia al centro. Dentro el campo **crece
lineal** con $r$; fuera decae como $1/r^2$; ambos coinciden en la superficie $r = R$.

## Cilindro conductor infinito ($\sigma = $ cte)

Un cilindro conductor infinito de radio $R$ (hueco o macizo) con densidad superficial $\sigma$.
Toda la carga queda en la superficie. Gaussiana: cilindro coaxial de radio $r$ y longitud
$\ell$, con la carga saliendo por la cara lateral ($S = 2\pi r\ell$).

**Fuera ($r > R$):** se encierra la carga total. De $E\,(2\pi r\ell) = Q_{tot}/\varepsilon_0$:

$$E = \frac{Q_{tot}}{2\pi\varepsilon_0\,r\ell}$$

Con $\sigma = \dfrac{Q_{tot}}{2\pi R\ell}$ se reescribe en función de la densidad:

$$E = \frac{R\,\sigma}{\varepsilon_0\,r}$$

**Dentro ($r < R$):** no hay carga encerrada, así que:

$$E = 0$$

> **Observación.** El campo exterior sirve también para el **cilindro dieléctrico hueco**:
> como en el conductor, toda la carga queda por fuera de la gaussiana.

## Cilindro dieléctrico infinito macizo ($\rho = $ cte)

Un cilindro aislante infinito de radio $R$ con densidad volumétrica $\rho$ constante repartida
en todo el volumen. Gaussiana cilíndrica coaxial de radio $r$ y longitud $\ell$, $S = 2\pi r\ell$.

**Fuera ($r > R$):** se encierra la carga total. Con $\rho = \dfrac{Q_{tot}}{\pi R^2\ell}$,
de $E\,(2\pi r\ell) = Q_{tot}/\varepsilon_0$:

$$E = \frac{R^2\,\rho}{2\varepsilon_0\,r}$$

**Dentro ($r < R$):** la gaussiana encierra $Q_{enc} = \rho\,\pi r^2\ell$. De
$E\,(2\pi r\ell) = Q_{enc}/\varepsilon_0$:

$$E = \frac{\rho\,r}{2\varepsilon_0}$$

Dentro el campo crece lineal con $r$; fuera decae como $1/r$; ambos coinciden en $r = R$.

## Resumen del comportamiento

Para cada geometría, cómo se comporta el módulo del campo dentro y fuera de la distribución
(radio característico $R$, distancia al punto $r$):

| Geometría | Dentro ($r < R$) | Fuera ($r > R$) |
|---|---|---|
| Hilo recto $\infty$ ($\lambda$) | — | $\dfrac{\lambda}{2\pi\varepsilon_0 r}$ |
| Pared plana $\infty$ ($\sigma$) | — | $\dfrac{\sigma}{2\varepsilon_0}$ (uniforme) |
| Esfera conductora ($\sigma$) | $0$ | $\dfrac{Q_{enc}}{4\pi\varepsilon_0 r^2}$ |
| Esfera no conductora ($\rho$) | $\dfrac{\rho\,r}{3\varepsilon_0}$ | $\dfrac{\rho\,R^3}{3\varepsilon_0 r^2}$ |
| Cilindro conductor ($\sigma$) | $0$ | $\dfrac{R\,\sigma}{\varepsilon_0 r}$ |
| Cilindro dieléctrico ($\rho$) | $\dfrac{\rho\,r}{2\varepsilon_0}$ | $\dfrac{R^2\,\rho}{2\varepsilon_0 r}$ |

**Observación.** El patrón se repite: en los **conductores** el campo interior es nulo (la carga
vive en la superficie); en los **dieléctricos macizos** el campo interior crece lineal con $r$.
Fuera, las esferas decaen como $1/r^2$ (como carga puntual) y los hilos/cilindros como $1/r$.

---

## Ver también

- [[01-flujo-y-ley-de-gauss]] — flujo eléctrico, ley general y método de evaluación
