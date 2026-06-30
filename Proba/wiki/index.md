# Índice — Wiki 93.24 Probabilidad y Estadística

Catálogo completo del wiki **organizado por unidad** del programa de la cátedra
(1 a 9, más Complementos Matemáticos y Evaluaciones). Dentro de cada unidad, las
páginas se agrupan por tipo: conceptos, distribuciones, teoremas, técnicas,
formularios y las fuentes documentales del material de cátedra.

> Para navegar rápido en Obsidian: abrí la vista de grafo. En el sitio web, el
> índice lateral también está agrupado por unidad.

## Unidad 1 — Estadística Descriptiva

**Conceptos**
- [[asimetria-y-curtosis]]
- [[boxplot]]
- [[cuartiles-y-percentiles]]
- [[datos-agrupados]]
- [[estadistica-descriptiva]] — **hub**; mapa de la unidad.
- [[histograma-y-frecuencias]]
- [[medidas-de-dispersion]]
- [[medidas-de-tendencia-central]]
- [[poblacion-y-muestra]]

**Técnicas**
- [[tecnica-datos-agrupados-interpolacion]] — mediana/cuartiles/proporciones por interpolación.

**Fuentes**
- [[estadistica-descriptiva-general]] — teórica de Estadística Descriptiva (44 diapos).
- [[estadistica-descriptiva-introduccion]] — pptx introductorio (26 slides): dataset de las 200 monedas de €1, tabla de frecuencias y gráficos exploratorios.
- [[tp1-estadistica-descriptiva]] — guía TP1 (repaso + ejercicios, 2 resueltos).

## Unidad 2 — Introducción a la Probabilidad

**Conceptos**
- [[arbol-de-probabilidades]]
- [[axiomas-de-probabilidad]]
- [[espacio-muestral-y-eventos]]
- [[independencia]]
- [[leyes-de-de-morgan]]
- [[probabilidad]] — **hub**; mapa de la unidad.
- [[probabilidad-condicional]]
- [[probabilidad-total-y-bayes]]
- [[regla-de-laplace]]

**Técnicas**
- [[tecnica-conteo-combinatoria]] — principios de conteo, complemento, combinatoria.

**Fuentes**
- [[axiomas-probabilidad]] — teórica de fundamentos y axiomas (17 diapos).
- [[independencia-condicional-bayes]] — teórica de condicional, independencia y Bayes.
- [[regla-de-laplace-slides]] — slides de Laplace y combinatoria (20 diapos).
- [[tp2-calculo-de-probabilidades]] — guía TP2 2024 (repaso, 40 ejercicios, 8 resueltos).

## Unidad 3 — Variables Aleatorias Discretas

**Conceptos**
- [[esperanza]] — valor esperado: definición, E[g(X)], linealidad, advertencia E[XY].
- [[funcion-de-distribucion-acumulada]] — F_X(k)=P(X≤k), propiedades, forma escalonada.
- [[funcion-generadora-de-momentos]] — M_X(t)=E[e^{tX}], generación de momentos, caracterización.
- [[variable-aleatoria]] — v.a. discreta: recorrido, PMF, FDA, esperanza, varianza, momentos, FGM.
- [[varianza]] — V(X)=E[X²]−E[X]², propiedades, advertencia V(X+Y).

**Distribuciones**
- [[distribucion-bernoulli]] — un ensayo éxito/fracaso; E=p, V=pq, FGM.
- [[distribucion-binomial]] — n éxitos en ensayos independientes; E=np, V=npq.
- [[distribucion-binomial-negativa]] — fracasos hasta el r-ésimo éxito (R=N₀, E=rq/p).
- [[distribucion-geometrica]] — fracasos hasta el 1er éxito (R=N₀, E=q/p); falta de memoria.
- [[distribucion-hipergeometrica]] — muestreo sin reposición; E=nM/N, factor de corrección.
- [[distribucion-poisson]] — conteos en un intervalo; E=V=λ, aproximación a la Binomial.

**Técnicas**
- [[reconocer-distribucion-discreta]] — árbol de decisión, pistas del enunciado, aproximaciones, tabla comparativa.
- [[teoria-de-la-decision-valor-esperado]] — maximizar el valor esperado para decidir entre alternativas inciertas; vendedor de diarios resuelto.

**Fuentes**
- [[bernoulli-apunte]] — apunte manuscrito de la distribución Bernoulli (urna 7 bolillas).
- [[binomial-apunte]] — apunte que deriva la binomial y demuestra E[X] y V[X].
- [[binomial-negativa-apunte]] — apunte de la binomial negativa (Pascal) y binomio negativo.
- [[geometrica-apunte]] — apunte de la geométrica (conteo de fracasos) con falta de memoria.
- [[hipergeometrica-apunte]] — apunte de la hipergeométrica con la aproximación binomial.
- [[poisson-aproximacion-binomial-apunte]] — apunte de la aproximación Poisson a la binomial.
- [[poisson-apunte]] — apunte de la distribución Poisson (media = varianza = λ).
- [[tp3-variables-aleatorias-discretas]] — guía TP3 2024 (repaso, 41 ejercicios, resueltos).
- [[va-discretas-introduccion]] — slides teóricas (Pantazis) que motivan la v.a. discreta, PMF, FDA, E y V.

## Unidad 4 — Variables Aleatorias Continuas

**Conceptos**
- [[funcion-de-densidad]] — pdf como derivada de la FDA, propiedades, comparación con la PMF.
- [[minimo-de-exponenciales]] — mínimo de $n$ exponenciales (sistemas en serie) ~ Expo($\sum\lambda_i$).
- [[tasa-de-fallas]] — tasa de riesgo $R(t)=f_T/(1-F_T)$; caracterización exponencial ⟺ $R$ constante.
- [[variable-aleatoria-continua]] — definición de v.a.c., FDA, densidad, E y V por integral.

**Distribuciones**
- [[distribucion-exponencial]] — Expo(λ); densidad, FDA, momentos, falta de memoria.
- [[distribucion-normal]] — N(μ,σ); densidad, regla empírica, estandarización.
- [[distribucion-uniforme-continua]] — Unif(a,b); E=(a+b)/2, V=(b−a)²/12.
- [[distribucion-weibull]] — Weibull(λ,b); FDA 1−exp(−(λx)^b), tasa de fallas, caso b=1=exponencial.

**Técnicas**
- [[estandarizacion-y-tabla-normal]] — estandarizar, simetría de Φ, fractiles e interpolación lineal.

**Formularios**
- [[formulario-va-continuas]] — fórmulas generales, tabla de distribuciones continuas, estandarización, curtosis.

**Fuentes**
- [[teorica-va-continuas]] — apunte que introduce v.a.c., FDA, densidad y E/V por integral.
- [[teorica-va-exponencial]] — apunte de la exponencial: momentos vía Gamma y falta de memoria.
- [[teorica-va-normal]] — apunte de la normal, normal estándar, estandarización y tabla.
- [[teorica-va-uniforme]] — apunte de la uniforme continua con deducción de E[X] y V(X).
- [[tp4-variables-aleatorias-continuas]] — guía TP4 2024 (36 ejercicios, tablas Φ y fractiles).

## Unidad 5 — Función de V.A. y Variables Bidimensionales

**Conceptos**
- [[covarianza-y-correlacion]] — Cov, fórmula práctica, Var de combinación lineal, ρ∈[-1,1], ρ=±1⟺lineal.
- [[esperanza-condicional]] — $E[X\mid Y]$, varianza condicional, leyes de esperanza total y de varianza total.
- [[funcion-de-variable-aleatoria]] — distribución de Y=g(X): método FDA, afines, normales, transformada inversa.
- [[independencia-de-variables-aleatorias]] — definición discreta/continua, Cov=0, incorrelación≠independencia.
- [[mezcla-de-distribuciones]] — mezcla continua condicionada a discreta: FDA, densidad, E, varianza no lineal, Bayes.
- [[variables-aleatorias-bidimensionales]] — conjunta y marginales (discreto/continuo), condicionales, esperanza total.

**Técnicas**
- [[tecnica-distribucion-de-una-funcion-de-va]] — método FDA para Y=g(X), atajos y errores típicos.

**Fuentes**
- [[teorica-bidimensionales-vac-intro]] — v.a.c. bidimensionales (cilindro): densidad, marginales, condicionales.
- [[teorica-bidimensionales-vad-intro]] — v.a.d. bidimensionales (urna): conjunta, marginales, E[g(X,Y)].
- [[teorica-correlacion-entre-menos-uno-y-uno]] — demostración de ρ∈[-1,1] (Cauchy-Schwarz).
- [[teorica-correlacion-uno-implica-relacion-lineal]] — ρ=±1 ⟺ relación lineal con prob. 1.
- [[teorica-covarianza-y-correlacion]] — define Cov y ρ con la fórmula práctica y el caso afín.
- [[teorica-funcion-de-variable-aleatoria]] — Y=g(X): método FDA, afines, normales, transformada inversa.
- [[teorica-independencia-vad]] — independencia discreta: factorización, E[producto], Cov=0.
- [[teorica-mezcla]] — mezcla (subte/colectivo): FDA, densidad, E, Var con cuidado, Bayes.
- [[tp5-2024]] — guía TP5 2024 (repaso, 36 ejercicios, 6 resueltos).

## Unidad 6 — Procesos Estocásticos

**Conceptos**
- [[cadenas-de-markov]] — matriz de transición, diagrama, tipos de estados, distribución estacionaria.
- [[caminata-aleatoria]] — random walk simétrica/general/gaussiana, propiedades y momentos.
- [[proceso-de-bernoulli]] — proceso de conteo discreto: N(k)~Binomial(k,p), incrementos, tiempos geométricos.
- [[proceso-de-poisson]] — proceso de conteo continuo: N(t)~Poisson(λt), tiempos exponenciales, Erlang.
- [[procesos-estocasticos]] — **hub**; definición, Chapman-Kolmogorov, estacionariedad, Markov, conteo.
- [[relacion-bernoulli-poisson]] — Poisson como límite continuo de Bernoulli (p=λΔt) y tabla comparativa.

**Fuentes**
- [[teorica-cadenas-de-markov]] — slides: matriz de transición, Chapman-Kolmogorov, estacionaria.
- [[teorica-proceso-de-bernoulli]] — apuntes 01-02-03: definición, incrementos y tiempos entre eventos.
- [[teorica-proceso-de-poisson]] — apuntes 04-05-06: definición con o(h), N(t)~Poisson(λt), tiempos exp.
- [[teorica-procesos-estocasticos-introduccion]] — slides intro: proceso, caminata, Markov, estacionariedad.
- [[teorica-relacion-bernoulli-poisson]] — apunte 07: Poisson como límite continuo de Bernoulli.
- [[tp6-procesos-estocasticos]] — guía TP6 (repaso, 25 ejercicios, resueltos de Poisson y Markov).

## Unidad 7 — Suma de Variables Aleatorias

**Conceptos**
- [[aproximacion-normal-de-la-binomial]] — De Moivre-Laplace, corrección por continuidad.
- [[promedio-muestral]] — media μ, varianza σ²/n, error estándar; enlace a LGN y TCL.
- [[suma-de-va-independientes]] — Bernoulli→Binomial, Bin+Bin, Poisson+Poisson, Normal+Normal, Unif+Unif, Exp→Gamma.
- [[suma-de-variables-aleatorias]] — **hub**; E y V de una suma (con covarianza), convolución, suma/promedio i.i.d.

**Distribuciones**
- [[distribucion-erlang]] — Erlang(k,λ); tiempo de la k-ésima ocurrencia de Poisson, Gamma de forma entera.
- [[distribucion-gamma]] — Gamma(α,λ); suma de exponenciales, E=α/λ, V=α/λ², relación con Erlang/ji-cuadrado.

**Teoremas**
- [[desigualdad-de-chebyshev]] — desigualdades de Markov (X≥0) y de Chebyshev, con demos.
- [[ley-de-grandes-numeros]] — ley débil (demo vía Chebyshev) y ley fuerte, interpretación frecuentista.
- [[teorema-central-del-limite]] — enunciado, 3 aproximaciones (Z_n, promedio, S_n), corrección por continuidad.

**Formularios**
- [[formulario-suma-de-va]] — E/V de sumas, convoluciones, cotas, LGN, TCL, aprox. binomial, fractiles.

**Fuentes**
- [[teorica-aproximacion-binomial-normal]] — derivación vía Stirling+Taylor y corrección por continuidad.
- [[teorica-ley-grandes-numeros]] — ley débil (vía Chebyshev) y ley fuerte.
- [[teorica-markov-chebyshev]] — enunciados y demos de Markov y Chebyshev.
- [[teorica-suma-binomiales]] — demo Bin+Bin=Bin vía identidad de Vandermonde.
- [[teorica-suma-exponenciales]] — suma de n Exp i.i.d. = Erlang/Gamma.
- [[teorica-suma-iid-bernoulli]] — Bernoulli→Binomial, E/V de S_n y promedio.
- [[teorica-suma-normales]] — demo Normal+Normal=Normal vía convolución.
- [[teorica-suma-poisson]] — demo Poisson+Poisson=Poisson vía binomio de Newton.
- [[teorica-suma-promedio-iid]] — E/V de suma y promedio i.i.d., V(promedio)→0.
- [[teorica-suma-uniformes]] — Unif+Unif da densidad triangular (no uniforme).
- [[teorica-suma-va-general]] — E y V de S=X+Y caso general (con covarianza).
- [[teorica-suma-va-independientes]] — convolución y tabla de casos especiales.
- [[teorica-tcl-introduccion]] — enunciado del TCL y aproximaciones prácticas.
- [[tp7-suma-de-va]] — guía TP7 (repaso, tabla de sumas, divisibilidad/estabilidad, 6 resueltos).

## Unidad 8 — Inferencia Estadística

**Conceptos**
- [[estimacion-puntual]] — estimador, sesgo, ECM, consistencia y los métodos MV, MAP y momentos.
- [[inferencia-estadistica]] — **hub**; cierra el lazo con descriptiva y ramifica en estimación puntual e IC.
- [[intervalos-de-confianza]] — media σ conocido (Z), proporción, media σ desconocido (t), tamaño muestral.
- [[varianza-muestral]] — estimador S_n² con denominador n−1; demostración de insesgadez.

**Distribuciones**
- [[distribucion-ji-cuadrado]] — χ²ₖ; densidad, E=k, V=2k, (n−1)S²/σ²~χ², relación con normal y Gamma.
- [[distribucion-t-de-student]] — densidad, momentos, fractiles, relación con normal y ji-cuadrado.

**Formularios**
- [[formulario-inferencia]] — estimadores, ECM, IC para media y proporción, tamaño muestral, árbol de decisión.

**Fuentes**
- [[teorica-estimacion-puntual-conocidos]] — estimadores de media, proporción y varianza; ji-cuadrado.
- [[teorica-estimacion-puntual-intro]] — estadístico, estimador, ECM, sesgo, insesgado, consistente.
- [[teorica-ic-media-desvio-conocido]] — IC para la media con σ conocido (Z), bilateral/unilaterales.
- [[teorica-ic-media-desvio-desconocido-intervalos]] — IC con t de Student y ejemplo del azúcar.
- [[teorica-ic-media-desvio-desconocido-intro]] — los tres escenarios e introducción del estadístico T.
- [[teorica-ic-proporcion]] — IC para una proporción con TCL.
- [[teorica-maxima-verosimilitud]] — verosimilitud, log-verosimilitud, ejemplo normal.
- [[teorica-maximo-a-posteriori]] — método MAP bayesiano: prior, posterior, Bayes.
- [[teorica-metodo-de-los-momentos]] — igualar momento poblacional al muestral; ejemplo exponencial.
- [[teorica-t-de-student]] — densidad, momentos, simetría, convergencia a la normal, fractiles.
- [[tp8-estimacion-de-parametros]] — guía TP8 2024 (repaso, tablas, resueltos de estimación e IC).

## Unidad 9 — Pruebas de Hipótesis

**Conceptos**
- [[error-tipo-i-y-tipo-ii]] — tabla de errores, nivel de significación, potencia, curva OC, fórmulas de β.
- [[estadistico-de-prueba]] — estadísticos Z/T/proporción, regiones de rechazo por cola.
- [[prueba-de-hipotesis]] — **hub**; H0/H1, errores I y II, α, estadístico, región de rechazo, valor p.
- [[prueba-de-hipotesis-para-la-media]] — estadístico Z (σ conocida) y T (σ desconocida).
- [[prueba-de-hipotesis-para-la-proporcion]] — estadístico Z con q̂=X/n, valor crítico y β(q).
- [[valor-p]] — definición, regla rechazar si p<α, cálculo por tipo de cola.

**Técnicas**
- [[diseno-de-prueba-tamano-muestral]] — fijar α y β a la vez para despejar n y el valor crítico c; curva OC.
- [[reconocer-prueba-de-hipotesis]] — patrón paso a paso: media vs proporción, elegir cola, Z/T, errores frecuentes.

**Formularios**
- [[formulario-pruebas-de-hipotesis]] — estadísticos, regiones de rechazo, valores críticos, valor p, β, fractiles.

**Fuentes**
- [[apunte-media-desvio-desconocido]] — apunte: estadístico T con t de Student, ejemplo de las lámparas.
- [[apunte-media-estadistico-z]] — apunte: equivalencia estimador puntual ↔ estadístico Z.
- [[apunte-media-nula-igual]] — apunte: región de rechazo bilateral y β(μ).
- [[apunte-media-nula-mayor-igual]] — apunte: región de cola izquierda y β(μ).
- [[apunte-prueba-proporcion]] — apunte: región de rechazo, β(p) y valor p para la proporción.
- [[intro-prueba-de-hipotesis-slides]] — pptx introductorio: ejemplos, errores, regla de decisión, valor p.
- [[tp9-pruebas-de-hipotesis]] — guía TP9 2024 (repaso, tablas, ejercicios resueltos).

## Complementos Matemáticos

**Técnicas**
- [[tecnica-derivadas-parciales]] — derivada parcial cruzada como densidad (inversa de acumular).
- [[tecnica-integrales-dobles]] — integral doble, Fubini y baricentro como analogía de densidad conjunta.
- [[tecnica-integrales-impropias]] — integrales impropias Tipo I y Tipo II, dos ejercicios resueltos.

**Fuentes**
- [[complemento-derivadas-parciales]] — derivada parcial cruzada como densidad a partir de la masa.
- [[complemento-integrales-dobles]] — integral doble vía masa de una placa, Fubini y baricentro.
- [[complemento-integrales-impropias]] — integrales impropias Tipo I y Tipo II con dos ejemplos.

## Evaluaciones

**Técnicas**
- [[ejercicios-de-parcial-resueltos]] — 8 ejercicios de parcial de probabilidad y procesos paso a paso.
- [[ejercicios-de-parcial-resueltos-estadistica]] — 7 ejercicios de parcial de estadística e inferencia paso a paso.

**Fuentes**
- [[evaluaciones]] — catálogo de los 19 archivos de `raw/12-evaluaciones` (qué parcial/final es cada uno).

---
_Catálogo organizado por el campo `unidad` del frontmatter de cada página._
