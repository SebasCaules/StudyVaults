---
tags: [teoria, unidad-7, interferencia, laminas-delgadas, cuna, anillos-de-newton]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica)
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Interferencia por división de amplitud

En la **división de amplitud** un mismo haz se parte en dos por reflexión y transmisión en las
dos caras de una película delgada. Los dos rayos que emergen (reflejados en la cara superior y en
la inferior) son coherentes y al superponerse interfieren. Según la geometría de la película se
obtienen tres casos clásicos: **láminas delgadas**, **cuña** y **anillos de Newton**. Todos
parten de la fórmula maestra del [[01-fundamentos-interferencia|desfase]]
$\Delta\phi = \tfrac{2\pi}{\lambda_0}\Delta CO + \Delta\varphi$.

## Salto de fase por reflexión

Antes de las geometrías hay que fijar el desfase constante $\Delta\varphi$ que introducen las
reflexiones. Igual que en una cuerda, un pulso se invierte al reflejarse en un extremo "más
pesado":

> **Regla del salto de fase.** Un haz de luz se invierte —sufre un salto de fase de $\pi$— al
> reflejarse sobre un medio con **mayor índice de refracción** que el del medio de incidencia. Si
> el medio es de menor índice, no hay salto. La transmisión (refracción) **nunca** introduce
> salto de fase.

En consecuencia, siempre hay una diferencia de $\pi$ entre el desfase por reflexión y el desfase
por transmisión. Para una película en aire ($n' > n$ en la cara de arriba, aire de nuevo abajo)
solo el rayo reflejado en la cara superior sufre el salto:

- $\Delta\varphi = 0$ cuando **ambos** rayos se invierten o **ninguno** lo hace.
- $\Delta\varphi = \pm\pi$ cuando se invierte **un solo** rayo.

## Láminas delgadas

Una **lámina delgada** de espesor $e$ e índice $n'$ (mayor que el del medio $n$) se ilumina con
luz casi monocromática. El rayo se divide: parte se refleja en la cara superior (rayo 1) y parte
se refracta, viaja por la lámina, se refleja en la cara inferior y vuelve a salir (rayo 2). Ambos
tienen intensidades parecidas entre sí y mucho mayores que las de las reflexiones posteriores, así
que solo interfieren esos dos.

El rayo 2 recorre de más un camino óptico dentro de la lámina. Para **incidencia casi normal** ese
recorrido extra es $2e$ (baja y sube) dentro de un medio de índice $n'$, de modo que
$\Delta CO = n'\,2e$ y

$$\Delta\phi = \frac{2\pi}{\lambda_0}\,2n'e + \Delta\varphi$$

donde $\lambda_0$ es la longitud de onda en el vacío, $n'$ el índice de la lámina, $e$ su espesor
y $\Delta\varphi$ el salto de fase por reflexión ($0$ o $\pm\pi$ según la regla de arriba). Con
este $\Delta\phi$ se aplican directamente las condiciones de [[01-fundamentos-interferencia|
máximo y mínimo]]: $\Delta\phi = 2m\pi$ da franjas claras y $\Delta\phi = (2m+1)\pi$ franjas
oscuras.

> **Observación.** El salto $\Delta\varphi = \pm\pi$ es lo que explica que una película de jabón
> muy fina ($e \to 0$, $\Delta CO \to 0$) se vea **oscura** por reflexión: con $\Delta\varphi =
> \pi$ el desfase total tiende a $\pi$, que es condición de mínimo, no de máximo.

## Cuña

Una **cuña** es una película de espesor variable: dos superficies que forman un ángulo pequeño
$\alpha$ entre sí, con un medio de índice $n$ entre ellas. A una distancia $x$ del vértice el
espesor es $e = x\tan\alpha \simeq x\alpha$ (para $\alpha$ chico). Sustituyendo en el desfase de
la lámina:

$$\Delta\phi = \frac{2\pi}{\lambda_0}\,2n\alpha x + \Delta\varphi$$

donde $x$ es la distancia al vértice, $\alpha$ el ángulo de la cuña, $n$ el índice del medio
interior y $\lambda_0$ la longitud de onda en el vacío. Como $\Delta\phi$ crece linealmente con
$x$, al iluminar toda la cuña se observan **franjas rectas alternadas claras y oscuras** (un
patrón de interferencia): cada vez que $\Delta\phi$ avanza en $\pi$ se pasa de una franja a la
siguiente.

La **distancia entre franjas consecutivas** (interfranja de la cuña) sale de pedir que $\Delta\phi$
cambie en $2\pi$ entre dos máximos:

$$\Delta x = \frac{\lambda_0}{2n\alpha}$$

Cuanto más chico el ángulo $\alpha$, más separadas están las franjas.

## Anillos de Newton

Los **anillos de Newton** aparecen al apoyar una lente plano-convexa de radio de curvatura $R$
sobre una superficie plana: entre ambas queda una capa de aire (índice $n$) cuyo espesor $e$ crece
con la distancia $r$ al punto de contacto. La geometría del casquete esférico relaciona $e$ con
$r$. Partiendo de

$$R^2 = (R - e)^2 + r^2 = R^2 - 2Re + e^2 + r^2$$

y usando que $e \ll R, r$ (se desprecia $e^2$), se despeja el espesor:

$$e \approx \frac{r^2}{2R}$$

donde $r$ es la distancia radial al punto de contacto y $R$ el radio de curvatura de la lente.
Sustituyendo en el desfase de la lámina ($\Delta CO = 2ne$):

$$\Delta\phi = \frac{2\pi}{\lambda_0}\,\frac{n\,r^2}{R} + \Delta\varphi$$

Como $\Delta\phi$ depende de $r^2$, las franjas de igual espesor son **circunferencias
concéntricas**: se observan anillos claros y oscuros alternados, centrados en el punto de
contacto. Equivalentemente, cada anillo cumple la relación

$$r = \sqrt{2Re}$$

que vincula el radio del anillo con el espesor de aire en ese punto.

> **Nota.** En las tres geometrías el término $\Delta\varphi$ de reflexión es el que decide si el
> centro (o el borde delgado) sale claro u oscuro. En los apuntes se lo arrastra como una
> constante $\pm\pi$; conviene fijar en cada problema qué rayo se invierte antes de aplicar las
> condiciones de máximo/mínimo.

---

## Ver también

- [[01-fundamentos-interferencia]] — camino óptico, coherencia y condiciones de máximo/mínimo
- [[03-doble-rendija-de-young]] — el otro método: división del frente de onda
