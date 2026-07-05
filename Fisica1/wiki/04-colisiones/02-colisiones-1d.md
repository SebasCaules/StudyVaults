---
tags: [teoria, unidad-4, colisiones, coeficiente-de-restitucion, choques]
fuentes:
  - raw/teoricas/apuntes-2023-2c.pdf
  - raw/practicas/guia-04-cantidad-movimiento.pdf
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Colisiones en una dimensión

Una colisión (o choque) es una interacción breve e intensa entre dos cuerpos. Esta página cubre
el análisis de choques en 1D: la conservación de la cantidad de movimiento, la clasificación
según qué se conserva, y el coeficiente de restitución. Continúa de
[[04-colisiones/01-impulso-cantidad-movimiento|impulso y cantidad de movimiento]].

## Conservación de $\vec{p}$ en la colisión

Durante una colisión, las fuerzas internas del choque son mucho mayores que las externas:

$$|\vec{F}_{\text{ext}}| \ll |\vec{F}_{\text{int}}| \;\Rightarrow\; \int_{0}^{t} \sum \vec{F}_{\text{ext}}\,dt \cong 0$$

Como el impulso de las fuerzas externas es despreciable frente al de las internas, la cantidad de
movimiento total del sistema se conserva entre el instante inmediatamente **antes** y el
inmediatamente **después** del choque. Para dos cuerpos:

$$m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2'$$

donde $m_1, m_2$ son las masas, $v_1, v_2$ las velocidades antes del choque y $v_1', v_2'$ las
velocidades después. Las cantidades sin prima son las de "antes"; las primadas, las de "después".

## Clasificación de los choques

Según qué magnitud se conserva se distinguen dos tipos:

| Tipo de choque | $K_{\text{sist}}$ (energía cinética) | $\vec{P}_{\text{sist}}$ (cantidad de mov.) |
|---|---|---|
| Elástica | se conserva (cte.) | se conserva (cte.) |
| Inelástica | no se conserva | se conserva (cte.) |

En **todo** choque se conserva la cantidad de movimiento; lo que distingue elástica de inelástica
es si además se conserva la energía cinética.

## Choque totalmente inelástico (plástico)

En un choque plástico los cuerpos quedan pegados y salen con una única velocidad común $v'$.

> **Definición.** En un choque totalmente inelástico (plástico) los cuerpos continúan juntos tras
> el impacto. De la conservación de $\vec{p}$, con datos $m_1, v_1, m_2, v_2$ e incógnita $v'$:
> $$v' = \frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}$$

Es el caso con solución directa: la incógnita $v'$ queda despejada por la sola conservación de la
cantidad de movimiento.

## Choque totalmente elástico

En el choque elástico se conservan tanto la cantidad de movimiento como la energía cinética. Se
plantean las dos ecuaciones:

$$\text{(1)} \quad m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2'$$

$$\text{(2)} \quad \tfrac{1}{2} m_1 v_1^2 + \tfrac{1}{2} m_2 v_2^2 = \tfrac{1}{2} m_1 v_1'^2 + \tfrac{1}{2} m_2 v_2'^2$$

donde (1) es la conservación de $\vec{p}$ y (2) la de la energía cinética $K$.

### Relación de velocidades relativas

Combinando ambas ecuaciones se obtiene una relación más manejable. Reagrupando por masa:

$$\text{De (1):} \quad m_1(v_1 - v_1') = m_2(v_2' - v_2)$$

$$\text{De (2):} \quad m_1(v_1^2 - v_1'^2) = m_2(v_2'^2 - v_2^2) \;\Rightarrow\; m_1(v_1 - v_1')(v_1 + v_1') = m_2(v_2' - v_2)(v_2' + v_2)$$

Dividiendo la ecuación de (2) por la de (1) se cancelan las masas y las diferencias de velocidad,
y queda:

$$v_1 + v_1' = v_2 + v_2' \;\Rightarrow\; \boxed{\,v_1 - v_2 = -(v_1' - v_2')\,}$$

Es decir: en un choque elástico la velocidad relativa de acercamiento antes del choque es igual, en
módulo y opuesta en signo, a la velocidad relativa de alejamiento después.

## Coeficiente de restitución

Para choques intermedios (ni totalmente elásticos ni plásticos) se usa el coeficiente de
restitución $e$, que mide cuánta velocidad relativa "se recupera" tras el impacto.

> **Definición.** El coeficiente de restitución se define, para un choque en una dimensión, como
> $$e = -\frac{v_1' - v_2'}{v_1 - v_2}$$
> donde el numerador es la velocidad relativa de alejamiento (después) y el denominador la de
> acercamiento (antes).

Sus valores acotan los tres casos:

- Si el choque es **plástico**: $e = 0$ (no se usa $e$; se usa la fórmula del choque plástico).
- Si el choque es **elástico**: $e = 1$ (se usa para reemplazar la condición $\Delta K = 0$).
- Si el choque es **inelástico**: $0 < e < 1$.

> **Nota.** El coeficiente de restitución $e$ se emplea **sólo para colisiones en 1D**.

## Ejemplos de la guía

### Choque plástico con proyectil y rozamiento posterior

Un proyectil de masa $m_B$ y velocidad $v_B$ se incrusta en un sistema (bloque más carro) en reposo.
Por ser plástico, todo sale con velocidad común $v_F$:

$$m_B v_B = (m_B + m_{bl} + m_c)\,v_F \;\Rightarrow\; v_F = \frac{m_B v_B}{m_B + m_{bl} + m_c}$$

Con los datos del apunte ($m_B = 0{,}03\ \text{kg}$, $v_B = 480\ \text{m/s}$, $m_{bl} = 5\ \text{kg}$ y
$m_c = 4\ \text{kg}$, de modo que la masa total del conjunto es $m_B + m_{bl} + m_c = 9{,}03\ \text{kg}$)
resulta $v_F \approx 1{,}59\ \text{m/s}$. En una segunda etapa, el rozamiento frena al conjunto una distancia
$\Delta x$, que se halla con trabajo-energía:

$$-f_r\,\Delta x = 0 - \tfrac{1}{2} M v_F^2 \;\Rightarrow\; -2\mu_c\,(m_{bl}+m_c)\,g\,\Delta x = -M v_F^2$$

donde $\mu_c$ es el coeficiente de rozamiento cinético y $M$ la masa total del conjunto. El choque
(conservación de $\vec{p}$) y el frenado (trabajo-energía) se resuelven en etapas separadas.

### Choque encadenado con energía (resorte o caída y frenado)

Otros ejercicios encadenan el choque con conservación de la energía antes o después. En un caso, dos
bloques chocan comprimiendo un resorte y se busca la compresión máxima (energía mecánica $+$ cantidad
de movimiento). En otro, un cuerpo cae desde una altura $h_i$ (con $v^2 = 2 g h_i$), choca
elásticamente, uno de los cuerpos rebota y sube mientras el otro frena por rozamiento a lo largo de
una distancia. Cada tramo se analiza por separado —energía en la caída/subida/compresión, cantidad de
movimiento en el choque— y se empalman por la velocidad en el punto de impacto.

> **Nota.** En los apuntes, el ejercicio que arroja $h_i = 8\ \text{m}$ encadena caída, choque elástico
> y frenado por rozamiento; se transcribe el método por etapas, ya que algunos resultados finales
> quedan sin recuadrar en el original.

---

## Ver también

- [[04-colisiones/01-impulso-cantidad-movimiento]] — conservación de $\vec{p}$ y centro de masa
- [[04-colisiones/03-colisiones-2d]] — el mismo análisis descompuesto por componentes
