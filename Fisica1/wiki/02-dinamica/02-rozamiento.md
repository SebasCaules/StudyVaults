---
tags: [teoria, unidad-2, dinamica, rozamiento, friccion]
fuente: raw/teoricas/fisica1-dinamica.pdf
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Rozamiento

El rozamiento es la fuerza de contacto tangencial entre dos superficies. Se distinguen dos
regímenes según si las superficies deslizan o no una sobre la otra.

## Régimen estático

> **Definición.** El régimen **estático** ocurre cuando las superficies **no deslizan** entre
> sí. La fuerza de rozamiento estático $f_e$ toma el valor necesario para impedir el
> deslizamiento, hasta un máximo:
> $$f_{e,\max} = \mu_e\,N$$
> donde $\mu_e$ es el coeficiente de rozamiento estático y $N$ la fuerza normal.

Mientras la fuerza aplicada no supere $f_{e,\max}$, el rozamiento estático la equilibra
exactamente y el cuerpo permanece en reposo relativo.

## Régimen cinético

> **Definición.** El régimen **cinético** ocurre cuando hay **deslizamiento relativo** entre
> las superficies. La fuerza de rozamiento cinético vale
> $$f_c = \mu_c\,N$$
> donde $\mu_c$ es el coeficiente de rozamiento cinético y $N$ la normal.

A diferencia del estático, el rozamiento cinético tiene un valor **fijo** (no se ajusta): se
opone al movimiento con módulo $\mu_c N$ mientras dure el deslizamiento.

## Relación entre los regímenes

Si se grafica la fuerza de rozamiento en función de la fuerza aplicada, se obtiene:

- Mientras el cuerpo no desliza, el rozamiento estático **iguala** a la fuerza aplicada: es la
  recta a $45^\circ$ ($f_e = f_{\text{aplicada}}$).
- Ese ajuste llega hasta $f_{e,\max} = \mu_e N$, punto llamado de **movimiento inminente**
  (el cuerpo está a punto de deslizar).
- Una vez que desliza, la fuerza cae al valor cinético constante $f_c = \mu_c N$, típicamente
  menor que el máximo estático.

Esto se resume en la desigualdad entre coeficientes:

$$0 \leq \mu_c \leq \mu_e \leq 1$$

es decir, el coeficiente cinético nunca supera al estático, y ambos están acotados entre $0$ y
$1$.

> **Observación.** El coeficiente de rozamiento estático $\mu_e$ fija el **umbral** para que
> el movimiento comience; el cinético $\mu_c$ fija la **fuerza** que se opone una vez que el
> cuerpo ya se mueve.

---

## Ver también

- [[01-leyes-de-newton-vinculos-poleas]] — cómo entra el rozamiento en los diagramas de cuerpo libre
- [[03-curva-peraltada]] — el rozamiento como fuerza centrípeta en curvas
- [[index]] — índice del vault
