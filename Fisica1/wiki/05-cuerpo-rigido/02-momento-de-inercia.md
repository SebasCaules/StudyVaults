---
tags: [teoria, unidad-5, cuerpo-rigido, momento-de-inercia, energia-cinetica]
fuente: raw/teoricas/
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Momento de inercia

Transcripción de la teórica de la cursada 2023-2C. El momento de inercia surge naturalmente
al escribir la **energía cinética de rotación** de un cuerpo rígido, y cumple para la rotación
el papel que la masa cumple para la traslación.

## Energía cinética de un cuerpo rígido

### Traslación pura

Si todos los puntos comparten la velocidad del centro de masa, $\vec v_i = \vec v_{cm}$, la
energía cinética total es

$$K_{tras} = \sum_{i=1}^{n} \tfrac12 m_i v_i^2 = \tfrac12\!\left(\sum_{i=1}^{n} m_i\right)\! v_{cm}^2
= \tfrac12 M\, v_{cm}^2$$

### Rotación pura

Cada punto tiene $\vec v_i = \vec\omega \times \vec r_i$. Como $\vec\omega \perp \vec r_i$ para
todo $i$, en módulo $v_i = \omega\, r_i$, y la energía cinética queda

$$K_{rot} = \tfrac12 \sum_{i=1}^{n} m_i (\omega\, r_i)^2
= \tfrac12 \underbrace{\left(\sum_{i=1}^{n} m_i r_i^2\right)}_{\text{momento de inercia}} \omega^2$$

## Definición

> **Definición.** El **momento de inercia** de un cuerpo respecto de un eje $o$ es
> $$I_o = \sum_{i=1}^{n} m_i r_i^2$$
> donde $r_i$ es la distancia de la masa $m_i$ al eje. Con esto la energía cinética rotacional
> se escribe
> $$K_{rot} = \tfrac12 I_o\, \omega^2$$

## Propiedades

- Es el **análogo a la masa** para la rotación: una magnitud que mide la resistencia del cuerpo
  a cambiar su estado rotacional.
- Depende de dos cosas:
  1. La **distribución de la masa** alrededor del eje de rotación.
  2. La **ubicación del eje** de rotación.

Como aparece $r_i^2$, la masa lejana al eje pesa mucho más que la cercana.

## Ejemplo discreto

Cuatro masas iguales $m$ ubicadas a distancia $a$ de un eje $z$ que pasa por el centro. Cada
término vale $m a^2$, de modo que

$$I_z = \sum_{i=1}^{4} m_i r_i^2 = 4\, m a^2$$

> **Observación.** $I_z$ no depende de la dimensión del arreglo a lo largo del eje: solo importa
> la distancia perpendicular al eje. Además, si se **duplica** la distancia de las masas al eje
> ($a \to 2a$), el momento de inercia se **cuadruplica**: $I_z' = 4m(2a)^2 = 4\,I_z$, porque
> depende del cuadrado de la distancia.

## Ejemplo continuo

Para un cuerpo continuo se pasa al límite: $m_i \to dm$, $r_i^2 \to r^2$ y $\sum \to \int$,

$$I_o = \int r^2\, dm$$

**Barra delgada homogénea.** Con densidad lineal $\lambda = \dfrac{M}{L} = \dfrac{dm}{dx} = \text{cte}$,
el elemento de masa es $dm = \dfrac{M}{L}\,dx$. Para el eje por un **extremo**:

$$I_o = \int_0^L x^2\, \frac{M}{L}\, dx = \tfrac13 M L^2$$

Para el eje por el **centro** de la barra:

$$I_{cm} = \int_{-L/2}^{L/2} x^2\, \frac{M}{L}\, dx = \tfrac{1}{12} M L^2$$

Comparando, $I_{cm} = \dfrac{I_o}{4}$, es decir $I_o = 4\, I_{cm}$: correr el eje del centro al
extremo aumenta el momento de inercia. Esa relación se generaliza con el
[[03-teorema-de-steiner|teorema de Steiner]].

## Momentos de inercia de cuerpos comunes

Los siguientes valores son dato; corresponden a ejes que pasan por el **centro de masa**.

| Cuerpo | Eje | $I_{cm}$ |
|---|---|---|
| Cilindro sólido / disco | eje del cilindro | $\tfrac12 M R^2$ |
| Anillo | eje perpendicular por el centro | $M R^2$ |
| Esfera sólida | diámetro | $\tfrac25 M R^2$ |
| Varilla (barra delgada) | perpendicular por el centro | $\tfrac{1}{12} M L^2$ |

Para pasar cualquiera de estos a un eje paralelo distinto del que pasa por el CM se usa el
teorema de Steiner.

---

## Ver también

- [[03-teorema-de-steiner]] — trasladar $I$ del CM a un eje paralelo
- [[04-dinamica-de-rotacion]] — $I$ como inercia rotacional en $M = I\alpha$
- [[01-cinematica-rotacion-planar]] — de dónde sale $v_i = \omega r_i$
