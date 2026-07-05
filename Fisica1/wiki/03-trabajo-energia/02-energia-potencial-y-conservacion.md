---
tags: [teoria, unidad-3, energia-potencial, resortes, conservacion-energia]
fuente: raw/apuntes-2023-2c/teorica-fisica-1.pdf
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Energía potencial y conservación de la energía

Partiendo del [[01-trabajo-y-energia-cinetica|teorema del trabajo y la energía cinética]], esta
página introduce la **energía potencial** asociada a las fuerzas conservativas (peso y fuerza
elástica) y llega a la relación de trabajo y energía en su forma general
$W_{nc} = \Delta K + \Delta U$.

## Trabajo del peso y energía potencial gravitatoria

El trabajo del peso al mover un cuerpo entre dos alturas depende solo del desnivel $\Delta h$:

$$W_{\text{peso}} = -mg\,\Delta h$$

donde $m$ es la masa, $g$ la aceleración de la gravedad y $\Delta h = h_f - h_i$ el cambio de
altura. El signo negativo indica que subir (aumentar $h$) cuesta trabajo al peso. Esto permite
definir una **energía potencial gravitatoria** cuya variación es opuesta a ese trabajo:

> **Definición.** La variación de energía potencial gravitatoria entre dos alturas es
> $$\Delta U_g = mg\,(h_f - h_i) = mg\,\Delta h$$
> de modo que $W_{\text{peso}} = -\Delta U_g$.

## Fuerza elástica

Un resorte de longitud natural $l_0$ estirado o comprimido hasta una longitud $l$ ejerce una fuerza
restitutiva proporcional a la deformación:

> **Definición.** La fuerza elástica de un resorte es
> $$F_e = -k\,d, \qquad d = |\,l - l_0\,|$$
> donde $k$ es la constante elástica del resorte y $d$ el módulo de la deformación respecto de la
> longitud natural $l_0$. El signo negativo indica que la fuerza se opone a la deformación.

## Energía potencial elástica

La fuerza elástica también es conservativa: su trabajo se puede escribir como menos la variación de
una energía potencial. En general, para una fuerza conservativa vale $W_{c} = -\Delta U$, y para el
resorte la energía potencial asociada es

$$W_{e} = -\Delta U_e, \qquad \Delta U_e = \tfrac{1}{2}k\,(x_f^2 - x_0^2)$$

donde $x_0$ y $x_f$ son las deformaciones inicial y final del resorte respecto de $l_0$.

> **Nota.** En los apuntes originales esta relación aparece bajo un encabezado de grafía ambigua;
> la fórmula transcripta corresponde inequívocamente a la **energía potencial elástica** del
> resorte.

## Conservación de la energía: $W_{nc} = \Delta K + \Delta U$

Se separan las fuerzas que actúan sobre el cuerpo en **conservativas** (peso y elástica) y **no
conservativas** (rozamiento, tensiones, fuerzas aplicadas). El teorema del trabajo y la energía
cinética dice que el trabajo neto es $\Delta K$:

$$W_{\text{neto}} = \Delta K \;\Longrightarrow\; W_{c} + W_{nc} = \Delta K$$

Como el trabajo de las fuerzas conservativas es $W_{c} = -\Delta U$ (con
$\Delta U = \Delta U_g + \Delta U_e$), se reemplaza:

$$-\Delta U + W_{nc} = \Delta K$$

y despejando se obtiene la forma general de la relación de trabajo y energía:

> **Teorema (trabajo de las fuerzas no conservativas).** El trabajo de las fuerzas no conservativas iguala la variación de la energía mecánica total:
> $$W_{nc} = \Delta K + \Delta U$$
> donde $\Delta K$ es el cambio de energía cinética y $\Delta U = \Delta U_g + \Delta U_e$ el cambio
> de energía potencial (gravitatoria más elástica).

**Observación.** Si no hay fuerzas no conservativas ($W_{nc} = 0$), la energía mecánica se conserva:
$\Delta K + \Delta U = 0$, es decir $K + U = \text{cte}$. Cuando hay rozamiento u otra fuerza no
conservativa, $W_{nc}$ mide exactamente cuánta energía mecánica se gana o se pierde.

---

## Ver también

- [[01-trabajo-y-energia-cinetica]] — trabajo, energía cinética y potencia
- [[03-guia-resuelta-energia-resortes]] — aplicación de $W_{nc} = \Delta K + \Delta U$ a sistemas con resortes
- [[index]] — índice del vault
