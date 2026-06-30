---
titulo: Histograma y frecuencias
tipo: concepto
unidad: 1
tags: [estadistica-descriptiva, histograma, frecuencias]
fuentes: ["[[estadistica-descriptiva-general]]", "[[tp1-estadistica-descriptiva]]", "[[estadistica-descriptiva-introduccion]]"]
actualizado: 2026-06-06
---

# Histograma y frecuencias

**En breve.** El **histograma** muestra cómo se reparten los datos contando cuántos
caen en cada intervalo (*bin*); es la versión muestral de una densidad, y su variante
acumulada $F(\alpha)$ es la contraparte muestral de la
[[funcion-de-distribucion-acumulada|función de distribución acumulada (FDA)]].

> **Vistazo exploratorio previo.** Antes de resumir, conviene mirar los datos
> crudos. Las slides ([[estadistica-descriptiva-introduccion]], slide 3) sugieren
> dos gráficos iniciales: el **scatterplot muestra-vs-caso** (cada dato contra su
> número de observación) y la **dispersión de los datos sobre una recta**. Son un
> paso cualitativo para detectar tendencias, agrupamientos o valores atípicos antes
> de construir el histograma.

Para visualizar la distribución de una muestra se divide el rango de valores en
**intervalos** (llamados *bins*) $a_1 < a_2 < \dots < a_{N+1}$, con
$a_1 < \min_i x_i$ y $a_{N+1} \ge \max_i x_i$. Habitualmente son de **igual
longitud**.

## Frecuencias
- **Frecuencia absoluta** $n_k$: cantidad de datos en el $k$-ésimo intervalo,
  $$ n_k = |\{x_i : x_i \in (a_k, a_{k+1}]\}|. $$
- **Frecuencia relativa** $f_k = \dfrac{n_k}{n}$.
- Se cumplen: $\displaystyle\sum_{k=1}^N n_k = n$ y $\displaystyle\sum_{k=1}^N f_k = 1$.

El **histograma** es el gráfico de barras de $n_k$ (o $f_k$). El **polígono de
frecuencias** une los puntos medios de las barras.

![[histograma.svg]]

> **Observación.** Las barras del histograma de una variable continua se dibujan **contiguas** (sin espacio entre ellas), porque representan un rango continuo de valores. Un intervalo con frecuencia cero no significa valores imposibles, sino infrecuentes: un dato podría caer en cualquier parte de ese rango, simplemente no lo hizo en esta muestra. Separar las barras transmitiría la idea incorrecta de un salto en los valores posibles (eso corresponde a una variable discreta).

## Función de frecuencia relativa acumulada
$$ F(\alpha) = \frac{|\{x_i : x_i \le \alpha\}|}{n} \in [0,1]. $$
Es una función creciente (una "escalera"); su polígono se usa para
[[tecnica-datos-agrupados-interpolacion|interpolar]] mediana, cuartiles y
proporciones. Es la contraparte muestral de la
[[funcion-de-distribucion-acumulada|función de distribución acumulada]] de una
[[variable-aleatoria]].

> **Intuición.** Elegir el ancho de los *bins* es un arte: muy anchos esconden la
> forma (todo en una barra), muy finos la vuelven ruido (una barra por dato). La FDA
> acumulada esquiva ese problema porque no depende de cómo agrupes — por eso se la usa
> para leer cuartiles y proporciones con precisión.

> **Cuidado:** El intervalo de mayor frecuencia (la barra más alta) **no marca dónde está la media**. La media puede caer en otro intervalo según cómo se repartan los datos dentro de cada *bin*. En el ejemplo de los tiempos de viaje en subte, la media daba 40 minutos y no coincidía con el intervalo más frecuente. El histograma muestra la forma y la dispersión de la distribución; la media se calcula aparte.

## Relación
- Cuando solo se dispone de la tabla de frecuencias (no los datos individuales)
  se trabaja con [[datos-agrupados]].
- La [[medidas-de-tendencia-central|moda]] de datos continuos sale del intervalo
  de mayor frecuencia.
