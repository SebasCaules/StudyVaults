---
tags: [teoria, unidad-3, potencial-electrico, energia-potencial, equipotenciales]
fuentes:
  - raw/resumenes/resumen-fisica-3.pdf
  - raw/practicas/practica-fisica-3.pdf
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Trabajo eléctrico y potencial

Mover una carga dentro de un campo eléctrico cuesta (o entrega) trabajo. Ese trabajo,
normalizado por unidad de carga, define el **potencial eléctrico**: un campo escalar que
resume el efecto de $\vec{E}$ y del que se recupera la energía de cualquier carga colocada
en él. Esta página desarrolla la diferencia de potencial, el potencial de una carga puntual,
el potencial absoluto y la energía potencial, a partir de los apuntes de la cursada 2024-1C.

## Trabajo eléctrico y diferencia de potencial

Se considera una carga fuente $+q$ que crea un campo $\vec{E}$, y una carga de prueba $+q_0$
que se traslada a lo largo de una trayectoria desde un punto $A$ hasta un punto $B$. Sobre la
carga de prueba actúa la fuerza eléctrica, relacionada con el campo por

$$\vec{E} = \frac{\vec{F}_E}{q_0} \quad\Longrightarrow\quad \vec{F}_E = q_0\,\vec{E}$$

donde $\vec{F}_E$ es la fuerza eléctrica sobre la carga de prueba y $q_0$ su carga. El trabajo
asociado al traslado, por unidad de carga, define la diferencia de potencial entre $A$ y $B$:

> **Definición (diferencia de potencial).** La diferencia de potencial entre dos puntos $A$
> y $B$ es la circulación del campo eléctrico entre ellos, cambiada de signo:
> $$\Delta V_{AB} = -\int_A^B \vec{E}\cdot d\vec{\ell}$$
> donde $\vec{E}$ es el campo eléctrico y $d\vec{\ell}$ el elemento de camino. Se mide en
> **volt** ($1\,\mathrm{V} = 1\,\mathrm{J/C}$).

**Observación.** La diferencia de potencial es independiente del camino: solo dependen los
puntos extremos $A$ y $B$. Esa es la propiedad que permite tratar a $V$ como un campo escalar.

## Potencial de una carga puntual

Para una carga puntual $q$, el campo a distancia $x$ vale $E = \dfrac{k\,q}{x^2}$, con
$k = \dfrac{1}{4\pi\varepsilon_0}$ la constante de Coulomb. Reemplazando en la definición e
integrando sobre el eje radial entre $x_A$ y $x_B$:

$$\Delta V_{AB} = -\int_{x_A}^{x_B} \frac{k\,q}{x^2}\,dx = -k\,q\int_{x_A}^{x_B} x^{-2}\,dx = k\,q\left.\frac{1}{x}\right|_{x_A}^{x_B}$$

de donde resulta la diferencia de potencial entre dos puntos de una carga puntual:

$$\Delta V_{AB} = k\,q\left[\frac{1}{x_B} - \frac{1}{x_A}\right]$$

donde $x_A$ y $x_B$ son las distancias de los puntos $A$ y $B$ a la carga.

## Potencial absoluto en un punto

Para asignar un valor de potencial a un único punto (y no solo diferencias) hace falta fijar un
origen. Por convención se toma **potencial nulo en el infinito**, $V_\infty = 0$:

> **Definición (potencial absoluto).** El potencial en un punto $A$ es la circulación del
> campo desde el infinito hasta $A$, cambiada de signo:
> $$V_A = -\int_{\infty}^{A} \vec{E}\cdot d\vec{\ell}$$

Para una carga puntual, esta convención da la forma familiar $V = \dfrac{k\,q}{r}$, con $r$ la
distancia a la carga.

**Nota.** La convención $V_\infty = 0$ **no** se aplica a los campos que se extienden hasta el
infinito (por ejemplo, distribuciones infinitas como un hilo o un plano cargado): en esos casos
la integral desde el infinito diverge y hay que elegir otro punto de referencia.

## Energía potencial eléctrica

Multiplicando la diferencia de potencial por la carga que se transporta se obtiene la variación
de energía potencial:

$$\Delta U = q\,\Delta V \quad\Longrightarrow\quad \Delta U = q\left(\frac{k\,Q}{r_B} - \frac{k\,Q}{r_A}\right)$$

donde $q$ es la carga transportada, $Q$ la carga fuente y $r_A$, $r_B$ las distancias a los
puntos inicial y final. En términos de la energía potencial en cada punto:

> **Energía potencial.** La energía potencial de una carga $q$ a distancia $r$ de una carga
> fuente $Q$ es
> $$U = q\,\frac{k\,Q}{r}, \qquad \Delta U = U_B - U_A$$

## Trabajo para mover una carga

Si se quiere trasladar la carga de manera **cuasiestacionaria** (sin acelerarla), el agente
externo debe ejercer en todo momento una fuerza que compense a la eléctrica,
$\vec{F}_{mec} = -\vec{F}_{elec}$. El trabajo mecánico entre $A$ y $B$ es entonces

$$W_{mec} = \int_A^B \vec{F}_{mec}\cdot d\vec{\ell} = -\int_A^B \vec{F}_{elec}\cdot d\vec{\ell} = -\int_A^B q\,\vec{E}\cdot d\vec{\ell}$$

Usando que el campo deriva de un potencial, $\vec{E} = -\vec{\nabla}V$, y que
$\vec{\nabla}V\cdot d\vec{\ell} = dV$, la integral se resuelve directamente:

$$W_{mec} = q\int_A^B \vec{\nabla}V\cdot d\vec{\ell} = q\,\Delta V = q\,(V_B - V_A)$$

donde $q$ es la carga trasladada y $V_A$, $V_B$ los potenciales en los extremos. El trabajo para
mover la carga entre dos puntos depende solo de la diferencia de potencial, no del camino.

## Equipotenciales

La relación $\vec{E} = -\vec{\nabla}V$ ordena el movimiento de las cargas y define las
**superficies equipotenciales** (lugares donde $V$ es constante). De $W_{mec} = q\,\Delta V$ se
sigue que trasladar una carga a lo largo de una curva donde el potencial no cambia
($\Delta V = 0$) no requiere trabajo; el campo $\vec{E}$, al ser el gradiente cambiado de signo,
resulta perpendicular a esas superficies y apunta hacia los potenciales decrecientes.

De ahí el criterio de movimiento espontáneo según el signo de la carga:

- Una carga **positiva** ($q > 0$) se mueve hacia el **potencial menor**.
- Una carga **negativa** ($q < 0$) se mueve desde el potencial bajo hacia el **potencial mayor**.

En [[03-potencial/02-potencial-aplicaciones|las aplicaciones]] se calcula el potencial de una
distribución concreta y se usa la conservación de energía para el movimiento de una carga entre
placas.

---

## Ver también

- [[03-potencial/02-potencial-aplicaciones]] — potencial de un disco y energía de una carga en movimiento
- [[01-electrostatica/02-campo-electrico]] — el campo $\vec{E}$ del que deriva el potencial
- [[02-gauss/01-flujo-y-ley-de-gauss]] — cálculo de $\vec{E}$ por simetría, insumo para integrar el potencial
