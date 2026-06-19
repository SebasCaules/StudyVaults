import type { Sheet } from "../types";

// Generado por el pipeline studyvault-cheatsheets (extracción + auditoría sub-overseer).
// Editable a mano: es data pura. Ver components/vault-sheets/types.ts.

export const probaFormulas: Sheet = {
  "vault": "proba",
  "kind": "formulas",
  "title": "Probabilidad y Estadística",
  "subtitle": "Cheat sheet integral del final (93.24 ITBA): descriptiva, probabilidad, v.a., distribuciones, procesos, suma de v.a., inferencia y pruebas",
  "notation": "$X_i$ i.i.d.; $\\mu=E[X]$, $\\sigma^2=V(X)$; $\\overline X_n=\\frac1n\\sum X_i$, $S_n$ desvío muestral; $q=1-p$; $\\Phi$ FDA de $N(0,1)$, $z_p=\\Phi^{-1}(p)$; $\\gamma$ confianza, $\\alpha$ significación; $\\binom{n}{k}$ combinatorio",
  "updated": "2026-06-19",
  "groups": [
    {
      "title": "Estadística descriptiva",
      "hint": "Resumen de una muestra {x_i}: centro, dispersión, forma, posición",
      "unit": "1",
      "entries": [
        {
          "label": "Media muestral",
          "kind": "formula",
          "tex": "\\bar x=\\frac{1}{n}\\sum_{i=1}^n x_i",
          "note": "Sensible a outliers; la mediana es robusta"
        },
        {
          "label": "Mediana",
          "kind": "def",
          "body": "Valor central de la muestra ordenada: posición $(n+1)/2$ si $n$ impar; promedio de las dos centrales si $n$ par. Es el 2º cuartil $q_2$."
        },
        {
          "label": "Varianza y desvío muestral",
          "kind": "formula",
          "tex": "s^2=\\frac{1}{n-1}\\sum_{i=1}^n (x_i-\\bar x)^2,\\qquad s=\\sqrt{s^2}",
          "note": "Denominador $n-1$ (Bessel), no $n$"
        },
        {
          "label": "Rango e IQR",
          "kind": "formula",
          "tex": "R=\\max_i x_i-\\min_i x_i,\\qquad \\mathrm{IQR}=q_3-q_1"
        },
        {
          "label": "Asimetría y curtosis",
          "kind": "formula",
          "tex": "\\gamma=\\frac{\\sum (x_i-\\bar x)^3}{n\\,s^3},\\qquad \\kappa=\\frac{\\sum (x_i-\\bar x)^4}{n\\,s^4}-3",
          "note": "$\\gamma>0$ cola a derecha; $\\kappa>0$ colas pesadas (vs normal)"
        },
        {
          "label": "Datos agrupados",
          "kind": "method",
          "tex": "\\bar x_{Ag}=\\frac{\\sum_i x_i f_i}{n},\\quad s_{Ag}=\\sqrt{\\tfrac{\\sum_i (x_i-\\bar x_{Ag})^2 f_i}{n-1}}",
          "cond": "$x_i$ marca de clase, $f_i$ frecuencia; cuartiles/mediana por interpolación lineal sobre acumuladas"
        },
        {
          "label": "Boxplot: cercas de Tukey",
          "kind": "theorem",
          "tex": "L_W=q_1-1.5\\,\\mathrm{IQR},\\qquad U_W=q_3+1.5\\,\\mathrm{IQR}",
          "note": "Outlier: fuera de $[L_W,U_W]$. En una normal, $P(\\text{outlier})\\approx0.7\\%$"
        }
      ]
    },
    {
      "title": "Probabilidad y conteo",
      "hint": "Axiomas, Laplace, condicional, independencia, Bayes, combinatoria",
      "unit": "2",
      "entries": [
        {
          "label": "Axiomas de Kolmogorov",
          "kind": "theorem",
          "tex": "P(A)\\ge 0,\\quad P(S)=1,\\quad P\\!\\Big(\\bigcup_i E_i\\Big)=\\sum_i P(E_i)",
          "cond": "El 3º vale para $E_i$ mutuamente excluyentes ($\\sigma$-aditividad)"
        },
        {
          "label": "Complemento y unión",
          "kind": "formula",
          "tex": "P(A^c)=1-P(A),\\qquad P(A\\cup B)=P(A)+P(B)-P(A\\cap B)"
        },
        {
          "label": "Regla de Laplace",
          "kind": "formula",
          "tex": "P(A)=\\frac{|A|}{|S|}=\\frac{\\text{favorables}}{\\text{posibles}}",
          "cond": "Solo si $S$ finito y resultados equiprobables"
        },
        {
          "label": "De Morgan",
          "kind": "theorem",
          "tex": "\\overline{A\\cup B}=\\overline A\\cap\\overline B,\\qquad \\overline{A\\cap B}=\\overline A\\cup\\overline B",
          "note": "Para 'ninguno' conviene pasar a $1-P(\\bigcup A_i)$"
        },
        {
          "label": "Probabilidad condicional y multiplicación",
          "kind": "formula",
          "tex": "P(D\\mid C)=\\frac{P(D\\cap C)}{P(C)}\\;\\Rightarrow\\; P(D\\cap C)=P(D\\mid C)\\,P(C)",
          "cond": "Requiere $P(C)\\neq 0$"
        },
        {
          "label": "Independencia",
          "kind": "def",
          "tex": "P(A\\cap B)=P(A)\\,P(B)\\iff P(B\\mid A)=P(B)",
          "note": "M.e. (con prob.+) NO es independiente. Serie→producto; paralelo→$1-\\prod q_i$"
        },
        {
          "label": "Probabilidad total y Bayes",
          "kind": "theorem",
          "tex": "P(B)=\\sum_k P(B\\mid A_k)P(A_k),\\quad P(A_i\\mid B)=\\frac{P(B\\mid A_i)P(A_i)}{\\sum_k P(B\\mid A_k)P(A_k)}",
          "cond": "$\\{A_k\\}$ partición de $S$"
        },
        {
          "label": "Las 5 formas de contar",
          "kind": "method",
          "tex": "\\begin{aligned}&\\text{orden, sin rep: }\\tfrac{n!}{(n-r)!}\\\\&\\text{sin orden, sin rep: }\\tbinom{n}{r}\\\\&\\text{con rep: }n^r\\ \\text{(orden)},\\ \\tbinom{n+r-1}{r}\\ \\text{(sin)}\\end{aligned}",
          "note": "Permutaciones: $n!$. Preguntá: ¿importa orden? ¿hay repetición?"
        },
        {
          "label": "Identidades combinatorias",
          "kind": "theorem",
          "tex": "\\tbinom{n}{r}=\\tbinom{n}{n-r},\\ \\sum_k\\tbinom{n}{k}=2^n,\\ (x+y)^n=\\sum_k\\tbinom{n}{k}x^k y^{n-k}"
        }
      ]
    },
    {
      "title": "Variable aleatoria discreta",
      "hint": "PMF, FDA, esperanza, varianza, momentos, FGM",
      "unit": "3",
      "entries": [
        {
          "label": "PMF y FDA",
          "kind": "def",
          "tex": "p_X(k)=P(X=k),\\ \\sum_k p_X(k)=1,\\qquad F_X(k)=P(X\\le k)",
          "note": "FDA escalonada, no decreciente, continua a derecha"
        },
        {
          "label": "Esperanza y E[g(X)]",
          "kind": "formula",
          "tex": "E[X]=\\sum_k k\\,p_X(k),\\qquad E[g(X)]=\\sum_k g(k)\\,p_X(k)"
        },
        {
          "label": "Varianza (fórmula de cálculo)",
          "kind": "formula",
          "tex": "V(X)=E[X^2]-\\big(E[X]\\big)^2,\\qquad \\sigma_X=\\sqrt{V(X)}"
        },
        {
          "label": "Linealidad de E y propiedades de V",
          "kind": "theorem",
          "tex": "E[aX+bY+c]=aE[X]+bE[Y]+c,\\qquad V(aX+c)=a^2V(X)",
          "note": "$E[XY]\\neq E[X]E[Y]$ y $V(X+Y)\\neq V(X)+V(Y)$ salvo independencia"
        },
        {
          "label": "Función generadora de momentos",
          "kind": "formula",
          "tex": "M_X(t)=E[e^{tX}],\\quad E[X^k]=M_X^{(k)}(0)",
          "note": "Caracteriza la distribución; $M_{X+Y}=M_X M_Y$ si independientes"
        },
        {
          "label": "Teoría de la decisión (valor esperado)",
          "kind": "method",
          "tex": "k^*=\\arg\\max_k E[G_k(X)]",
          "cond": "Elegí el parámetro $k$ que maximiza la ganancia esperada (newsvendor)"
        }
      ]
    },
    {
      "title": "Distribuciones discretas",
      "hint": "Soporte, PMF, E, V, FGM. Convención cátedra: geométrica/binneg cuentan FRACASOS",
      "unit": "3",
      "entries": [
        {
          "label": "Bernoulli(p)",
          "kind": "formula",
          "tex": "p_X(1)=p,\\ p_X(0)=q;\\quad E=p,\\ V=pq,\\ M=q+pe^t",
          "cond": "Un ensayo éxito/fracaso. $R_X=\\{0,1\\}$"
        },
        {
          "label": "Binomial(n,p)",
          "kind": "formula",
          "tex": "p_X(k)=\\tbinom{n}{k}p^k q^{n-k};\\quad E=np,\\ V=npq,\\ M=(q+pe^t)^n",
          "cond": "Nº de éxitos en $n$ ensayos i.i.d. (con reposición / pob. grande)"
        },
        {
          "label": "Geométrica(p) — nº de fracasos",
          "kind": "formula",
          "tex": "p_X(k)=q^k p,\\ k\\ge0;\\quad E=\\tfrac{q}{p},\\ V=\\tfrac{q}{p^2},\\ M=\\tfrac{p}{1-qe^t}",
          "note": "Versión 'nº de ensayos' $Y=X+1$: $p_Y(k)=q^{k-1}p$, $E=1/p$. No mezclar"
        },
        {
          "label": "Falta de memoria (geométrica)",
          "kind": "theorem",
          "tex": "P(X\\ge L+\\Delta\\mid X\\ge L)=P(X\\ge\\Delta),\\quad P(X\\ge m)=q^m",
          "cond": "Única discreta sin memoria"
        },
        {
          "label": "Binomial negativa(r,p) — fracasos",
          "kind": "formula",
          "tex": "p_X(k)=\\tbinom{k+r-1}{k}q^k p^r;\\quad E=\\tfrac{rq}{p},\\ V=\\tfrac{rq}{p^2}",
          "cond": "Fracasos hasta el $r$-ésimo éxito. Suma de $r$ geométricas; $M=(\\tfrac{p}{1-qe^t})^r$"
        },
        {
          "label": "Hipergeométrica(N,M,n)",
          "kind": "formula",
          "tex": "p_X(k)=\\frac{\\binom{M}{k}\\binom{N-M}{n-k}}{\\binom{N}{n}};\\quad E=n\\tfrac{M}{N},\\ V=npq\\,\\tfrac{N-n}{N-1}",
          "cond": "Muestreo SIN reposición; $p=M/N$. Factor corrección $\\tfrac{N-n}{N-1}$"
        },
        {
          "label": "Poisson(λ)",
          "kind": "formula",
          "tex": "p_X(k)=\\frac{\\lambda^k}{k!}e^{-\\lambda};\\quad E=V=\\lambda,\\ M=e^{\\lambda(e^t-1)}",
          "note": "Sello: media = varianza. Conteo de eventos raros a tasa $\\lambda$"
        },
        {
          "label": "Aproximación Poisson de la binomial",
          "kind": "theorem",
          "tex": "\\mathrm{Bin}(n,p)\\approx\\mathrm{Poisson}(\\lambda=np)",
          "cond": "$n$ grande, $p$ chico"
        }
      ]
    },
    {
      "title": "Variable aleatoria continua",
      "hint": "FDA, densidad, E/V por integral, tasa de fallas",
      "unit": "4",
      "entries": [
        {
          "label": "FDA y densidad",
          "kind": "formula",
          "tex": "F_X(x)=\\int_{-\\infty}^x f_X(y)\\,dy,\\quad f_X(x)=F_X'(x),\\quad \\int_{\\mathbb R}f_X=1",
          "note": "v.a.c. $\\iff F_X$ continua $\\iff P(X=\\alpha)=0\\ \\forall\\alpha$"
        },
        {
          "label": "Probabilidad, esperanza, momentos",
          "kind": "formula",
          "tex": "P(a<X\\le b)=F_X(b)-F_X(a),\\quad E[X]=\\int x f_X\\,dx,\\quad E[X^k]=\\int x^k f_X\\,dx"
        },
        {
          "label": "Varianza y esperanza por la cola",
          "kind": "formula",
          "tex": "V(X)=E[X^2]-(E[X])^2,\\quad E[X]=\\int_0^\\infty P(X>x)\\,dx\\ (X\\ge0)"
        },
        {
          "label": "Tasa de fallas (hazard)",
          "kind": "formula",
          "tex": "R(t)=\\frac{f_T(t)}{1-F_T(t)}=-\\frac{d}{dt}\\ln S(t),\\quad S(t)=e^{-\\int_0^t R}",
          "note": "$R$ constante $\\iff$ exponencial; creciente=desgaste, decreciente=mortalidad infantil"
        }
      ]
    },
    {
      "title": "Distribuciones continuas",
      "hint": "Densidad, FDA, E, V. La cátedra parametriza la normal por el DESVÍO σ",
      "unit": "4",
      "entries": [
        {
          "label": "Uniforme(a,b)",
          "kind": "formula",
          "tex": "f_X=\\tfrac{1}{b-a}\\,(a<x<b),\\ F_X=\\tfrac{x-a}{b-a};\\quad E=\\tfrac{a+b}{2},\\ V=\\tfrac{(b-a)^2}{12}"
        },
        {
          "label": "Exponencial(λ)",
          "kind": "formula",
          "tex": "f_X=\\lambda e^{-\\lambda x},\\ F_X=1-e^{-\\lambda x},\\ P(X>x)=e^{-\\lambda x};\\quad E=\\tfrac1\\lambda,\\ V=\\tfrac1{\\lambda^2}",
          "note": "Falta de memoria; única con tasa de fallas constante. $M=\\tfrac{\\lambda}{\\lambda-t}$"
        },
        {
          "label": "Normal N(μ,σ)",
          "kind": "formula",
          "tex": "f_X=\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}};\\quad E=\\mu,\\ V=\\sigma^2,\\ M=e^{\\mu t+\\frac12\\sigma^2 t^2}",
          "note": "FDA sin forma cerrada: usar $\\Phi$. 2º parámetro = desvío"
        },
        {
          "label": "Falta de memoria (exponencial)",
          "kind": "theorem",
          "tex": "P(X>x+\\Delta\\mid X>x)=P(X>\\Delta)=e^{-\\lambda\\Delta}"
        },
        {
          "label": "Weibull(λ,b)",
          "kind": "formula",
          "tex": "F_X=1-e^{-(\\lambda x)^b},\\ R(x)=\\lambda b(\\lambda x)^{b-1};\\quad E=\\tfrac1\\lambda\\Gamma(1+\\tfrac1b)",
          "cond": "$b=1$ recupera exponencial; $b>1$ desgaste, $b<1$ mortalidad infantil"
        },
        {
          "label": "Gamma/Erlang(n,λ)",
          "kind": "formula",
          "tex": "f(x)=\\frac{\\lambda^n x^{n-1}e^{-\\lambda x}}{(n-1)!};\\quad E=\\tfrac{n}{\\lambda},\\ V=\\tfrac{n}{\\lambda^2}",
          "cond": "Suma de $n$ exp($\\lambda$); tiempo de la $n$-ésima ocurrencia de Poisson"
        },
        {
          "label": "P(T_n>t) de Erlang vía Poisson",
          "kind": "method",
          "tex": "P(T_n>t)=\\sum_{j=0}^{n-1}\\frac{(\\lambda t)^j}{j!}e^{-\\lambda t}",
          "cond": "Dualidad $\\{T_n>t\\}\\Leftrightarrow\\{N(t)\\le n-1\\}$, $N(t)\\sim\\mathrm{Poisson}(\\lambda t)$"
        },
        {
          "label": "Mínimo de exponenciales (serie)",
          "kind": "example",
          "tex": "\\min(X_1,\\dots,X_n)\\sim\\mathrm{Exp}\\!\\Big(\\textstyle\\sum_i\\lambda_i\\Big)",
          "note": "Las tasas se suman. Suma (no mínimo) de exp i.i.d. = Gamma"
        }
      ]
    },
    {
      "title": "Normal estándar y tabla Z",
      "hint": "Estandarizar para resolver cualquier normal con una sola tabla",
      "unit": "4",
      "entries": [
        {
          "label": "Estandarización",
          "kind": "method",
          "tex": "Z=\\frac{X-\\mu}{\\sigma}\\sim N(0,1),\\qquad F_X(x)=\\Phi\\!\\Big(\\frac{x-\\mu}{\\sigma}\\Big)",
          "note": "$z$ = a cuántos desvíos del centro está $x$"
        },
        {
          "label": "Simetría de Φ y fractiles",
          "kind": "formula",
          "tex": "\\Phi(-z)=1-\\Phi(z),\\qquad z_{1-\\alpha}=-z_\\alpha,\\quad x_\\alpha=\\mu+\\sigma z_\\alpha"
        },
        {
          "label": "Probabilidades útiles",
          "kind": "formula",
          "tex": "P(a<X\\le b)=\\Phi\\!\\big(\\tfrac{b-\\mu}{\\sigma}\\big)-\\Phi\\!\\big(\\tfrac{a-\\mu}{\\sigma}\\big),\\ P(\\mu\\pm k\\sigma)=2\\Phi(k)-1"
        },
        {
          "label": "Regla empírica y fractiles clave",
          "kind": "example",
          "tex": "1\\sigma{:}0.683,\\ 2\\sigma{:}0.954,\\ 3\\sigma{:}0.997;\\ z_{.90}{=}1.28,\\ z_{.95}{=}1.64,\\ z_{.975}{=}1.96,\\ z_{.99}{=}2.33"
        },
        {
          "label": "Curtosis de referencia",
          "kind": "example",
          "tex": "\\kappa_{N}=0,\\quad \\kappa_{\\text{Unif}}=-\\tfrac65,\\quad \\kappa_{\\text{Exp}}=+6"
        }
      ]
    },
    {
      "title": "Bidimensionales, función de v.a.",
      "hint": "Conjunta, marginales, condicionales, covarianza, transformaciones",
      "unit": "5",
      "entries": [
        {
          "label": "Conjunta y marginales",
          "kind": "formula",
          "tex": "p_X(x)=\\sum_y p_{X,Y},\\ f_X(x)=\\int f_{X,Y}\\,dy;\\quad E[h(X,Y)]=\\sum\\sum h\\,p\\ \\big/\\ \\iint h\\,f",
          "note": "Las marginales NO determinan la conjunta"
        },
        {
          "label": "Condicional e independencia",
          "kind": "formula",
          "tex": "f_{X\\mid Y}(x\\mid y)=\\frac{f_{X,Y}(x,y)}{f_Y(y)};\\quad \\text{indep}\\iff f_{X,Y}=f_X f_Y"
        },
        {
          "label": "Covarianza y correlación",
          "kind": "formula",
          "tex": "\\mathrm{Cov}(X,Y)=E[XY]-\\mu_X\\mu_Y,\\qquad \\rho=\\frac{\\mathrm{Cov}(X,Y)}{\\sigma_X\\sigma_Y}\\in[-1,1]",
          "note": "Indep $\\Rightarrow$ Cov$=0$; recíproco FALSO (salvo conjuntamente normal)"
        },
        {
          "label": "Varianza de combinación lineal",
          "kind": "formula",
          "tex": "V(aX+bY)=a^2V(X)+2ab\\,\\mathrm{Cov}(X,Y)+b^2V(Y)"
        },
        {
          "label": "ρ = ±1 ⟺ relación lineal",
          "kind": "theorem",
          "tex": "\\rho=\\pm1\\iff Y=aX+b\\ \\text{(prob. 1)},\\ \\mathrm{sign}(a)=\\mathrm{sign}(\\rho)"
        },
        {
          "label": "Distribución de Y=g(X) (método FDA)",
          "kind": "method",
          "tex": "F_Y(y)=P(g(X)\\le y)=F_X(\\dots),\\quad f_Y(y)=F_Y'(y)",
          "cond": "Reescribir $\\{g(X)\\le y\\}$ como evento sobre $X$; sumar ramas si $g$ no inyectiva"
        },
        {
          "label": "Transformación afín Y=aX+b",
          "kind": "formula",
          "tex": "\\mu_Y=a\\mu_X+b,\\ \\sigma_Y=|a|\\sigma_X;\\quad X\\sim N\\Rightarrow Y\\sim N(a\\mu_X+b,|a|\\sigma_X)"
        },
        {
          "label": "Transformada inversa (simular)",
          "kind": "method",
          "tex": "U\\sim\\mathrm{Unif}(0,1)\\Rightarrow Y=F_X^{-1}(U)\\ \\text{tiene FDA }F_X",
          "note": "Ej: $\\mathrm{Exp}(\\lambda)$ → $Y=-\\tfrac1\\lambda\\ln(1-U)$"
        }
      ]
    },
    {
      "title": "Esperanza condicional y mezcla",
      "hint": "Promediar por etapas: leyes total; varianza con cuidado",
      "unit": "5",
      "entries": [
        {
          "label": "Esperanza y varianza condicional",
          "kind": "def",
          "tex": "E[X\\mid Y=y]=\\sum_x x\\,p_{X\\mid Y},\\quad V(X\\mid Y)=E[X^2\\mid Y]-(E[X\\mid Y])^2",
          "note": "$E[X\\mid Y]$ es una v.a. (función de $Y$)"
        },
        {
          "label": "Ley de esperanza total",
          "kind": "theorem",
          "tex": "E[X]=E\\big[E[X\\mid Y]\\big]=\\sum_y E[X\\mid Y=y]\\,p_Y(y)"
        },
        {
          "label": "Ley de varianza total",
          "kind": "theorem",
          "tex": "V(X)=E\\big[V(X\\mid Y)\\big]+V\\big(E[X\\mid Y]\\big)",
          "note": "intra + inter. ERROR común: olvidar el 2º término"
        },
        {
          "label": "Mezcla (continua | discreta)",
          "kind": "formula",
          "tex": "f_X(x)=\\sum_k f_{X\\mid M}(x\\mid k)\\,P(M=k),\\quad E[g(X)]=\\sum_k E[g(X)\\mid M{=}k]P(M{=}k)",
          "note": "Densidad = combinación convexa. La varianza NO se mezcla linealmente"
        },
        {
          "label": "Mezcla inversa (discreta | continua)",
          "kind": "formula",
          "tex": "p_X(x)=\\int p_{X\\mid Y}(x\\mid y)\\,f_Y(y)\\,dy",
          "cond": "Sobredispersión: $V(X)=E[V(X\\mid Y)]+V(E[X\\mid Y])$"
        }
      ]
    },
    {
      "title": "Procesos estocásticos",
      "hint": "Bernoulli (discreto) ↔ Poisson (continuo); cadenas de Markov; caminata",
      "unit": "6",
      "entries": [
        {
          "label": "Proceso de Bernoulli",
          "kind": "def",
          "tex": "N(k)\\sim\\mathrm{Bin}(k,p);\\ \\tau_i\\sim\\mathrm{Geo}(p);\\ T_k\\sim\\mathrm{BinNeg}(k,p)",
          "cond": "Tiempo discreto, incrementos indep. y estacionarios, $\\le1$ evento por paso"
        },
        {
          "label": "Proceso de Poisson(λ)",
          "kind": "def",
          "tex": "N(t)\\sim\\mathrm{Poisson}(\\lambda t);\\ \\tau_i\\sim\\mathrm{Exp}(\\lambda);\\ T_k\\sim\\mathrm{Erlang}(k,\\lambda)",
          "cond": "$P(N(t{+}h){-}N(t)=1)=\\lambda h+o(h)$; sin eventos simultáneos"
        },
        {
          "label": "Dualidad conteo ↔ tiempo",
          "kind": "theorem",
          "tex": "T_k< t\\iff N(t)\\ge k,\\qquad E[N(t)]=V[N(t)]=\\lambda t",
          "note": "Pasa de preguntas de tiempo (Erlang/Exp) a conteos (Poisson)"
        },
        {
          "label": "Cadena de Markov: evolución",
          "kind": "formula",
          "tex": "\\vec p(n+1)=\\vec p(n)\\,\\mathbb{P},\\qquad \\vec p(n)=\\vec p(0)\\,\\mathbb{P}^n",
          "cond": "$\\mathbb P$ estocástica (cada fila suma 1); homogénea"
        },
        {
          "label": "Distribución estacionaria",
          "kind": "formula",
          "tex": "\\vec\\pi=\\vec\\pi\\,\\mathbb{P},\\qquad \\textstyle\\sum_j\\pi_j=1",
          "cond": "Autovector izq. de autovalor 1; existe y es límite si $\\mathbb P$ regular ($\\mathbb P^n>0$)"
        },
        {
          "label": "Tipos de estados",
          "kind": "def",
          "body": "Recurrente ($r_i=1$) vs transitorio; absorbente ($p_{ii}=1$); irreducible (todos se comunican); periódico/aperiódico. Tiempo hasta absorción: $\\mathbb M=(\\mathbb I-\\mathbb Q)^{-1}$."
        },
        {
          "label": "Caminata aleatoria",
          "kind": "formula",
          "tex": "X_n=\\sum_{k=1}^n Y_k,\\ Y_k\\in\\{\\pm1\\};\\quad E[X_n]=n(2p-1),\\ V[X_n]=4npq",
          "note": "Simétrica: $E=0$, $V=n$. Markov, incrementos indep., NO estacionario"
        }
      ]
    },
    {
      "title": "Suma de v.a.",
      "hint": "E/V de sumas, convolución, casos cerrados con nombre propio",
      "unit": "7",
      "entries": [
        {
          "label": "E y V de una suma",
          "kind": "formula",
          "tex": "E[X+Y]=E[X]+E[Y],\\quad V(X\\pm Y)=V(X)+2\\,\\mathrm{Cov}(X,Y)+V(Y)",
          "note": "Indep / no correlacionadas: $V(X\\pm Y)=V(X)+V(Y)$"
        },
        {
          "label": "Suma y promedio i.i.d.",
          "kind": "formula",
          "tex": "E[S_n]=n\\mu,\\ V(S_n)=n\\sigma^2;\\quad E[\\overline X_n]=\\mu,\\ V(\\overline X_n)=\\tfrac{\\sigma^2}{n}",
          "note": "Error estándar $\\sigma/\\sqrt n$: bajar a la mitad cuesta $\\times4$ datos"
        },
        {
          "label": "Convolución (independientes)",
          "kind": "formula",
          "tex": "p_S(s)=\\sum_y p_X(s-y)p_Y(y),\\quad f_S(s)=\\int f_X(s-y)f_Y(y)\\,dy",
          "note": "Atajo: $M_{X+Y}=M_X M_Y$"
        },
        {
          "label": "Sumas cerradas con nombre propio",
          "kind": "theorem",
          "tex": "\\begin{aligned}&n{\\times}\\mathrm{Ber}(p)=\\mathrm{Bin}(n,p),\\ \\mathrm{Bin}{+}\\mathrm{Bin}=\\mathrm{Bin}\\,(p\\ \\text{igual})\\\\&\\mathrm{Poi}(\\lambda_1){+}\\mathrm{Poi}(\\lambda_2)=\\mathrm{Poi}(\\lambda_1{+}\\lambda_2)\\\\&N(\\mu_1,\\sigma_1){+}N(\\mu_2,\\sigma_2)=N(\\mu_1{+}\\mu_2,\\sqrt{\\sigma_1^2{+}\\sigma_2^2})\\\\&n{\\times}\\mathrm{Exp}(\\lambda)=\\mathrm{Gamma}(n,\\lambda),\\ \\sum_{i=1}^n N(0,1)^2=\\chi^2_n\\end{aligned}",
          "note": "Suman las VARIANZAS, no los desvíos. Unif+Unif = triangular (no se conserva)"
        }
      ]
    },
    {
      "title": "Cotas, LGN y TCL",
      "hint": "Markov, Chebyshev, ley de grandes números, teorema central del límite",
      "unit": "7",
      "entries": [
        {
          "label": "Markov y Chebyshev",
          "kind": "theorem",
          "tex": "P(X\\ge\\alpha)\\le\\tfrac{E[X]}{\\alpha}\\ (X\\ge0),\\qquad P(|X-\\mu|\\ge\\varepsilon)\\le\\tfrac{\\sigma^2}{\\varepsilon^2}",
          "note": "Cotas universales pero flojas; usar si no se conoce la distribución"
        },
        {
          "label": "Chebyshev para promedios",
          "kind": "formula",
          "tex": "P(|\\overline X_n-\\mu|\\ge\\varepsilon)\\le\\frac{\\sigma^2}{n\\,\\varepsilon^2}\\xrightarrow{n\\to\\infty}0"
        },
        {
          "label": "Ley de grandes números",
          "kind": "theorem",
          "tex": "\\text{débil: }\\lim_n P(|\\overline X_n-\\mu|\\ge\\varepsilon)=0;\\quad \\text{fuerte: }P(\\lim_n\\overline X_n=\\mu)=1",
          "note": "Justifica frecuencia relativa $\\hat P_n\\to p$"
        },
        {
          "label": "Teorema central del límite",
          "kind": "theorem",
          "tex": "Z_n=\\frac{\\overline X_n-\\mu}{\\sigma/\\sqrt n}\\ \\Rightarrow\\ P(Z_n\\le z)\\to\\Phi(z)",
          "cond": "$X_i$ i.i.d. con $\\mu,\\sigma$ finitos; regla usual $n>20\\text{–}30$"
        },
        {
          "label": "Aproximaciones del TCL",
          "kind": "formula",
          "tex": "\\overline X_n\\overset{\\text{ap}}{\\sim}N(\\mu,\\tfrac{\\sigma}{\\sqrt n}),\\quad S_n\\overset{\\text{ap}}{\\sim}N(n\\mu,\\sqrt n\\,\\sigma)",
          "note": "Frec. rel.: $P(\\hat P_n\\le q)\\approx\\Phi\\!\\big(\\tfrac{q-p}{\\sqrt{p(1-p)/n}}\\big)$"
        },
        {
          "label": "Normal aprox. de la binomial (+ continuidad)",
          "kind": "formula",
          "tex": "P(a\\le S_n\\le b)\\approx\\Phi\\!\\big(\\tfrac{b+\\frac12-np}{\\sqrt{npq}}\\big)-\\Phi\\!\\big(\\tfrac{a-\\frac12-np}{\\sqrt{npq}}\\big)",
          "cond": "$\\mathrm{Bin}(n,p)\\approx N(np,\\sqrt{npq})$. Corrección $\\pm\\tfrac12$ para discretas"
        }
      ]
    },
    {
      "title": "Estimación puntual",
      "hint": "Calidad del estimador y métodos de construcción",
      "unit": "8",
      "entries": [
        {
          "label": "ECM, sesgo, consistencia",
          "kind": "formula",
          "tex": "\\mathrm{mse}(\\hat\\theta)=V(\\hat\\theta)+\\mathrm{sesgo}^2(\\hat\\theta),\\quad \\mathrm{sesgo}=E[\\hat\\theta]-\\theta",
          "note": "Insesgado: $E[\\hat\\theta]=\\theta$. Consistente: $\\mathrm{mse}\\to0$"
        },
        {
          "label": "Estimadores clásicos (insesgados)",
          "kind": "formula",
          "tex": "\\hat\\mu=\\overline X_n\\ (\\mathrm{ecm}\\,\\tfrac{\\sigma^2}{n}),\\ \\hat p=\\overline X_n\\ (\\tfrac{p(1-p)}{n}),\\ S_n^2=\\tfrac{1}{n-1}\\sum(X_i-\\overline X_n)^2"
        },
        {
          "label": "Varianza muestral: identidad y ley",
          "kind": "formula",
          "tex": "(n-1)S_n^2=\\sum X_i^2-n\\overline X_n^2,\\quad \\tfrac{(n-1)S_n^2}{\\sigma^2}\\sim\\chi^2_{n-1}",
          "cond": "La $\\chi^2$ vale si la muestra es normal"
        },
        {
          "label": "Máxima verosimilitud (MV)",
          "kind": "method",
          "tex": "\\hat\\theta=\\arg\\max_\\theta\\sum_i\\ln f(x_i;\\theta)",
          "note": "Si $\\theta$ está en el SOPORTE (uniformes) NO derivar: $\\hat\\theta$ en un extremo de la muestra"
        },
        {
          "label": "MAP (bayesiano)",
          "kind": "method",
          "tex": "\\hat\\theta=\\arg\\max_\\theta g(\\theta\\mid x),\\quad g(\\theta\\mid x)\\propto f(x\\mid\\theta)\\,g(\\theta)",
          "note": "Promedia datos y prior; $n$ grande → manda la muestra"
        },
        {
          "label": "Método de los momentos",
          "kind": "method",
          "tex": "\\mu_k=E[X^k]=H(\\theta)\\ \\Rightarrow\\ \\hat\\theta=H^{-1}(\\hat\\mu_k)",
          "cond": "Igualar momento poblacional al muestral y despejar (ej: $\\hat\\lambda=1/\\overline X_n$ exp.)"
        }
      ]
    },
    {
      "title": "Distribuciones de muestreo (t, χ²)",
      "hint": "Las leyes que aparecen al estimar μ y σ²",
      "unit": "8",
      "entries": [
        {
          "label": "Ji-cuadrado χ²_k",
          "kind": "formula",
          "tex": "\\sum_{i=1}^k Z_i^2\\sim\\chi^2_k;\\quad E=k,\\ V=2k,\\ \\chi^2_k=\\mathrm{Gamma}(\\tfrac k2,\\tfrac12)",
          "note": "Aditiva en gdl; $\\chi^2_k\\approx N(k,\\sqrt{2k})$ para $k$ grande"
        },
        {
          "label": "t de Student",
          "kind": "formula",
          "tex": "T=\\frac{\\overline X_n-\\mu}{S_n/\\sqrt n}\\sim t_{n-1};\\quad E[T]=0,\\ V(T)=\\tfrac{m}{m-2}\\,(m{>}2)",
          "note": "Simétrica, colas más pesadas que la normal; $t_m\\to N(0,1)$ si $m\\to\\infty$"
        },
        {
          "label": "Fractiles de la t",
          "kind": "caution",
          "tex": "m<\\ell\\Rightarrow t_{m,\\gamma}>t_{\\ell,\\gamma}>z_\\gamma",
          "note": "Menos gdl → fractil mayor → IC más ancho. Para $n>100\\text{–}200$ usar $z$"
        }
      ]
    },
    {
      "title": "Intervalos de confianza",
      "hint": "Rango que atrapa θ con confianza γ. Semiamplitud bilateral Δ_B",
      "unit": "8",
      "entries": [
        {
          "label": "IC media, σ conocido (Z)",
          "kind": "formula",
          "tex": "IC_\\gamma(\\mu)=\\overline X_n\\pm z_{\\frac{1+\\gamma}{2}}\\frac{\\sigma}{\\sqrt n}",
          "cond": "Normal con $\\sigma$ conocido, o $n$ grande (TCL)"
        },
        {
          "label": "IC media, σ desconocido (t)",
          "kind": "formula",
          "tex": "IC_\\gamma(\\mu)=\\overline X_n\\pm t_{n-1,\\frac{1+\\gamma}{2}}\\frac{S_n}{\\sqrt n}",
          "cond": "Muestra normal, $\\sigma$ desconocido, $n$ chico"
        },
        {
          "label": "IC proporción (Z)",
          "kind": "formula",
          "tex": "IC_\\gamma(p)=\\hat p\\pm z_{\\frac{1+\\gamma}{2}}\\sqrt{\\frac{\\hat p(1-\\hat p)}{n}}",
          "cond": "$n$ grande; unilaterales acotados a $[0,1]$"
        },
        {
          "label": "Tamaño muestral (error E = semiamplitud)",
          "kind": "formula",
          "tex": "n\\ge z_{\\frac{1+\\gamma}{2}}^2\\frac{\\sigma^2}{E^2};\\quad \\text{prop: }n\\ge z_{\\frac{1+\\gamma}{2}}^2\\frac{1/4}{E^2}",
          "note": "Cota conservadora $p(1-p)\\le\\tfrac14$, o usar $\\hat p$ previo. Redondear hacia arriba"
        },
        {
          "label": "Unilaterales y corrección pob. finita",
          "kind": "caution",
          "tex": "\\Delta_U\\ \\text{usa }\\gamma\\ \\text{(no }\\tfrac{1+\\gamma}{2});\\quad E=z\\sqrt{\\hat p(1-\\hat p)}\\sqrt{\\tfrac{N-n}{Nn}}",
          "note": "Interpretación frecuentista: el IC (antes de muestrear) atrapa $\\theta$ con prob. $\\gamma$"
        }
      ]
    },
    {
      "title": "Pruebas de hipótesis",
      "hint": "Estadístico, región de rechazo, valor p, errores. Igualdad siempre en H₀",
      "unit": "9",
      "entries": [
        {
          "label": "Errores y potencia",
          "kind": "def",
          "tex": "\\text{Tipo I }(\\alpha)\\!:\\text{rechazar }H_0\\text{ cierta};\\ \\text{Tipo II }(\\beta)\\!:\\text{aceptar }H_0\\text{ falsa};\\ \\text{potencia}=1-\\beta",
          "note": "$\\alpha$ se fija; $\\beta$ es función de $\\theta_1$. Bajar ambos → subir $n$"
        },
        {
          "label": "Estadísticos de prueba",
          "kind": "formula",
          "tex": "Z=\\frac{\\bar X-\\mu_0}{\\sigma/\\sqrt n},\\quad T=\\frac{\\bar X-\\mu_0}{S/\\sqrt n}\\sim t_{n-1},\\quad Z=\\frac{\\hat q-q_0}{\\sqrt{q_0(1-q_0)/n}}",
          "cond": "$Z$ ($\\sigma$ conocida o $n$ grande); $T$ ($\\sigma$ desc., normal); prop ($n>100$)"
        },
        {
          "label": "Región de rechazo",
          "kind": "method",
          "tex": "\\text{2 colas: }|Z|>z_{1-\\alpha/2};\\ \\text{derecha: }Z>z_{1-\\alpha};\\ \\text{izq: }Z<-z_{1-\\alpha}",
          "note": "Con $T$, reemplazar $z$ por $t_{n-1}$"
        },
        {
          "label": "Valor crítico del estimador (media, σ)",
          "kind": "formula",
          "tex": "\\bar x_c=\\mu_0\\pm z_{1-\\alpha/2}\\frac{\\sigma}{\\sqrt n}\\ (\\text{2 colas}),\\ =\\mu_0+z_{1-\\alpha}\\frac{\\sigma}{\\sqrt n}\\ (\\text{der.})"
        },
        {
          "label": "Valor p",
          "kind": "formula",
          "tex": "\\text{der: }1-\\Phi(z_{\\rm obs}),\\ \\text{izq: }\\Phi(z_{\\rm obs}),\\ \\text{2 colas: }2(1-\\Phi(|z_{\\rm obs}|))",
          "note": "Decisión: rechazar $H_0\\iff$ valor p $<\\alpha$"
        },
        {
          "label": "Error tipo II β(μ₁) — media, σ conocida",
          "kind": "formula",
          "tex": "\\text{der: }\\beta(\\mu_1)=\\Phi\\!\\Big(z_{1-\\alpha}+\\tfrac{\\mu_0-\\mu_1}{\\sigma/\\sqrt n}\\Big)",
          "note": "$\\beta(\\mu_0)=1-\\alpha$; $\\beta(\\bar x_c)\\approx0.5$; $\\beta\\to0$ al alejarse"
        },
        {
          "label": "Diseño: despejar n (fijar α y β)",
          "kind": "method",
          "tex": "n=\\Big(\\frac{(z_{1-\\alpha}+z_{1-\\beta^*})\\,\\sigma}{\\mu_1-\\mu_0}\\Big)^2",
          "cond": "Media, $\\sigma$ conocida; redondear hacia arriba. Luego $\\bar x_c=\\mu_0+z_{1-\\alpha}\\sigma/\\sqrt n$"
        },
        {
          "label": "Cómo plantear H₀/H₁",
          "kind": "caution",
          "body": "La igualdad va siempre en $H_0$; la carga de prueba en $H_1$. 'Al menos/no menor' → $H_0$ con $\\ge$ → cola izquierda. ¿Media o proporción? ¿σ conocido? define $Z$ vs $T$."
        }
      ]
    }
  ]
};

export const probaConceptos: Sheet = {
  "vault": "proba",
  "kind": "conceptos",
  "title": "Probabilidad y Estadística",
  "subtitle": "Hoja de conceptos definitiva: de los axiomas a las pruebas de hipótesis",
  "notation": "$S$ espacio muestral; $X$ v.a.; $E[X]=\\mu$, $V(X)=\\sigma^2$; $q=1-p$; $\\Phi$ FDA de $N(0,1)$; $\\bar X_n$ promedio muestral; $\\hat\\theta$ estimador; $H_0/H_1$ hipótesis.",
  "updated": "2026-06-19",
  "groups": [
    {
      "title": "Estadística descriptiva",
      "hint": "Resumir una muestra observada (centro, dispersión, forma) sin inferir todavía sobre la población.",
      "unit": "1",
      "entries": [
        {
          "label": "Población vs muestra",
          "kind": "def",
          "body": "**Población**: universo completo a estudiar. **Muestra** $\\{x_i\\}_{i=1}^n$: subconjunto que se observa (idealmente al azar, representativa). La descriptiva trabaja sobre la muestra.",
          "cond": "Cuantitativa (numérica) vs cualitativa; la materia usa cuantitativas."
        },
        {
          "label": "Tendencia central",
          "kind": "formula",
          "tex": "\\bar x = \\frac{1}{n}\\sum_{i=1}^n x_i \\qquad m_e=q_2 \\ (50\\%\\ \\text{a cada lado}) \\qquad \\text{moda}=\\text{valor más frecuente}",
          "note": "$n$ par: mediana = promedio de las dos centrales."
        },
        {
          "label": "Dispersión",
          "kind": "formula",
          "tex": "s^2=\\frac{1}{n-1}\\sum(x_i-\\bar x)^2 \\qquad s=\\sqrt{s^2} \\qquad R=\\max-\\min \\qquad \\text{IQR}=q_3-q_1",
          "note": "Varianza muestral con $n-1$ (versión insesgada)."
        },
        {
          "label": "Forma (adimensionales)",
          "kind": "formula",
          "tex": "\\gamma=\\frac{\\sum(x_i-\\bar x)^3}{n\\,s^3} \\qquad \\kappa=\\frac{\\sum(x_i-\\bar x)^4}{n\\,s^4}-3",
          "body": "Asimetría $\\gamma$: $>0$ cola a derecha, $<0$ cola a izquierda. Curtosis $\\kappa$: peso de colas vs normal.",
          "note": "Cuidado: la teórica invierte el signo de $\\kappa$; verificar convención de cátedra."
        },
        {
          "label": "Cuartiles y percentiles",
          "kind": "def",
          "body": "Parten la muestra ordenada en 4 (cuartiles), 10 (deciles) o 100 (percentiles) partes iguales. $q_1$=25%, $q_2$=mediana, $q_3$=75%. Base del IQR y del boxplot.",
          "cond": "Robustos ante extremos (miden posición, no magnitud)."
        },
        {
          "label": "Boxplot · regla de Tukey",
          "kind": "method",
          "tex": "L_W=q_1-1.5\\cdot\\text{IQR},\\qquad U_W=q_3+1.5\\cdot\\text{IQR}",
          "body": "Caja de $q_1$ a $q_3$, línea en la mediana, bigotes hasta el dato más extremo dentro de los límites.",
          "note": "Datos fuera de $[L_W,U_W]$ son outliers."
        },
        {
          "label": "Robustez",
          "kind": "caution",
          "body": "Mediana y MAD ($\\text{mediana}\\{|x_i-\\bar x|\\}$) son **robustos** ante outliers; media y desvío **no**. Para sueldos/precios reportar mediana.",
          "note": "Un solo valor enorme arrastra la media pero no la mediana."
        },
        {
          "label": "Datos agrupados",
          "kind": "method",
          "tex": "\\bar x_{Ag}=\\frac{\\sum x_i f_i}{n} \\qquad s_{Ag}=\\sqrt{\\frac{\\sum(x_i-\\bar x_{Ag})^2 f_i}{n-1}}",
          "body": "Solo se tiene tabla de frecuencias por intervalos: se usa la **marca de clase** $x_i=(L_i+L_{s,i})/2$ como representante. Todas las medidas son **aproximaciones**.",
          "note": "Mediana/cuartiles por interpolación lineal sobre la frecuencia acumulada."
        },
        {
          "label": "Frecuencias e histograma",
          "kind": "def",
          "body": "Frec. absoluta $n_k$, relativa $f_k=n_k/n$ ($\\sum f_k=1$). El histograma grafica $n_k$. La acumulada $F(\\alpha)=|\\{x_i\\le\\alpha\\}|/n$ es la contraparte muestral de la FDA."
        }
      ]
    },
    {
      "title": "Fundamentos de probabilidad",
      "hint": "Modelar la incertidumbre antes de observar: espacio muestral, axiomas y sus consecuencias.",
      "unit": "2",
      "entries": [
        {
          "label": "Espacio muestral y eventos",
          "kind": "def",
          "body": "Experimento aleatorio $E$ con resultado incierto; $S$ = todos los resultados; evento $A\\subseteq S$. $\\Sigma$ ($\\sigma$-álgebra) = colección de eventos medibles. M.e.: $A\\cap B=\\emptyset$.",
          "cond": "$S$ finito $\\Rightarrow$ se toma $\\Sigma=2^S$."
        },
        {
          "label": "Axiomas de Kolmogorov",
          "kind": "theorem",
          "body": "Espacio $(S,\\Sigma,P)$ con: (1) $P(A)\\ge 0$; (2) $P(S)=1$; (3) $\\sigma$-aditividad: m.e. $\\Rightarrow P(\\bigcup E_i)=\\sum P(E_i)$.",
          "note": "De ahí se deducen TODAS las propiedades útiles."
        },
        {
          "label": "Consecuencias de los axiomas",
          "kind": "formula",
          "tex": "P(A^c)=1-P(A) \\qquad P(\\emptyset)=0 \\qquad A\\subseteq B\\Rightarrow P(A)\\le P(B)",
          "body": "Complemento, suceso imposible, monotonía."
        },
        {
          "label": "Probabilidad de la unión",
          "kind": "formula",
          "tex": "P(A\\cup B)=P(A)+P(B)-P(A\\cap B)",
          "body": "Inclusión-exclusión (3 eventos): $\\sum P(A_i)-\\sum P(A_i\\cap A_j)+P(A\\cap B\\cap C)$.",
          "cond": "Si m.e., $P(A\\cap B)=0$ y suman directo."
        },
        {
          "label": "Regla de Laplace",
          "kind": "formula",
          "tex": "P(A)=\\frac{|A|}{|S|}=\\frac{\\text{casos favorables}}{\\text{casos posibles}}",
          "cond": "Solo si $S$ finito y casos **equiprobables**.",
          "note": "Reduce probabilidad a contar (combinatoria)."
        },
        {
          "label": "Leyes de De Morgan",
          "kind": "theorem",
          "tex": "\\overline{A\\cup B}=\\bar A\\cap\\bar B \\qquad \\overline{A\\cap B}=\\bar A\\cup\\bar B",
          "body": "\"Ninguno de varios\" $\\to$ complemento de la unión: $P(\\bigcap\\bar A_i)=1-P(\\bigcup A_i)$.",
          "note": "Truco de parcial más frecuente."
        }
      ]
    },
    {
      "title": "Condicional, independencia y Bayes",
      "hint": "Cómo se actualiza la probabilidad con información y cómo invertir la condicional.",
      "unit": "2",
      "entries": [
        {
          "label": "Probabilidad condicional",
          "kind": "def",
          "tex": "P(D\\mid C)=\\frac{P(D\\cap C)}{P(C)},\\qquad P(C)\\ne 0",
          "body": "Reducir el universo a $C$. Regla del producto: $P(D\\cap C)=P(D\\mid C)\\,P(C)$.",
          "note": "Indefinida si $P(C)=0$. Frases gatillo: \"si...\", \"dado que...\"."
        },
        {
          "label": "Independencia de eventos",
          "kind": "def",
          "tex": "P(A\\cap B)=P(A)\\,P(B) \\iff P(B\\mid A)=P(B)",
          "body": "Saber uno no informa sobre el otro. Colección: $P(\\bigcap A_k)=\\prod P(A_k)$.",
          "cond": "$\\emptyset$ y $S$ son independientes de todo."
        },
        {
          "label": "M.e. ≠ independiente",
          "kind": "caution",
          "body": "Dos eventos m.e. con probabilidad positiva **no** son independientes (si ocurrió $A$, $B$ no ocurrió: hay info). Son conceptos opuestos.",
          "note": "Error clásico: confundir $P(A\\cap B)=0$ con $P(A\\cap B)=P(A)P(B)$."
        },
        {
          "label": "Probabilidad total",
          "kind": "theorem",
          "tex": "P(B)=\\sum_k P(B\\mid A_k)\\,P(A_k)",
          "body": "Con $\\{A_k\\}$ partición (m.e. y cubren $S$). \"Arma\" $B$ sumando lo que aporta cada caso."
        },
        {
          "label": "Teorema de Bayes",
          "kind": "theorem",
          "tex": "P(A_i\\mid B)=\\frac{P(B\\mid A_i)\\,P(A_i)}{\\sum_k P(B\\mid A_k)\\,P(A_k)}",
          "body": "Da vuelta la condicional: $P(A_i)$ a priori $\\to$ $P(A_i\\mid B)$ a posteriori. De la causa al diagnóstico.",
          "note": "Maquinaria de tests diagnósticos, fallas, falsos positivos."
        },
        {
          "label": "Árbol de probabilidades",
          "kind": "method",
          "body": "Experimentos por etapas. (1) Aristas = condicionales del hijo dado el camino; (2) hijos = partición; (3) aristas de un nodo suman 1; (4) prob. de un camino = **producto** de sus aristas.",
          "note": "Sumar hojas = prob. total; dar vuelta el árbol = Bayes."
        },
        {
          "label": "Fiabilidad serie/paralelo",
          "kind": "example",
          "body": "**Serie** (todos deben funcionar): $P=\\prod p_i$. **Paralelo** (basta uno): $P=1-\\prod q_i$ (complemento del producto de fallas).",
          "cond": "Componentes independientes."
        }
      ]
    },
    {
      "title": "Variable aleatoria discreta",
      "hint": "Asignar números a resultados; describir con PMF/FDA y resumir con E y V.",
      "unit": "3",
      "entries": [
        {
          "label": "V.a. discreta y PMF",
          "kind": "def",
          "tex": "p_X(k)=P(X=k),\\qquad \\sum_{k\\in\\mathcal R_X} p_X(k)=1",
          "body": "Función $X:S\\to\\mathbb R$ de recorrido discreto. La PMF (función de masa) asigna probabilidad a cada valor; vale 0 fuera del recorrido."
        },
        {
          "label": "FDA discreta",
          "kind": "def",
          "tex": "F_X(k)=P(X\\le k)=\\sum_{y\\le k} p_X(y)",
          "body": "Escalonada: salta $p_X(k)$ en cada valor. Monótona, continua a derecha, $\\lim_{-\\infty}=0$, $\\lim_{+\\infty}=1$.",
          "note": "Recuperar PMF: $p_X(k)=F_X(k)-\\lim_{x\\to k^-}F_X(x)$ (tamaño del salto)."
        },
        {
          "label": "Probabilidades por la FDA",
          "kind": "formula",
          "tex": "P(X<k)=F_X(k)-p_X(k)\\quad P(a<X\\le b)=F_X(b)-F_X(a)\\quad P(X>k)=1-F_X(k)",
          "note": "En discreta $<$ vs $\\le$ difieren en la masa $p_X(k)$: cuidado."
        },
        {
          "label": "Esperanza",
          "kind": "def",
          "tex": "E[X]=\\mu_X=\\sum_{k} k\\,p_X(k) \\qquad E[g(X)]=\\sum_k g(k)\\,p_X(k)",
          "body": "Promedio a largo plazo, centro de masa de la PMF. No tiene por qué ser un valor del recorrido."
        },
        {
          "label": "Linealidad de E",
          "kind": "theorem",
          "tex": "E[aX+bY+c]=a\\,E[X]+b\\,E[Y]+c",
          "body": "$E[X+Y]=E[X]+E[Y]$ **siempre** (aun sin independencia).",
          "note": "Pero $E[XY]\\ne E[X]E[Y]$ en general (requiere independencia)."
        },
        {
          "label": "Varianza (fórmula de cálculo)",
          "kind": "formula",
          "tex": "V(X)=\\sigma_X^2=E[(X-\\mu_X)^2]=E[X^2]-(E[X])^2",
          "body": "Dispersión alrededor de la media; $\\sigma_X=\\sqrt{V(X)}$ en unidades de $X$."
        },
        {
          "label": "Propiedades de V",
          "kind": "theorem",
          "tex": "V(aX+c)=a^2 V(X) \\qquad \\sigma(aX+c)=|a|\\,\\sigma(X) \\qquad V(c)=0",
          "note": "$V(X+Y)\\ne V(X)+V(Y)$ en general (requiere independencia)."
        },
        {
          "label": "FGM",
          "kind": "def",
          "tex": "M_X(t)=E[e^{tX}],\\qquad E[X^k]=M_X^{(k)}(0)",
          "body": "Empaqueta todos los momentos. Caracteriza la distribución; transformación afín $M_{aX+b}(t)=e^{bt}M_X(at)$.",
          "cond": "Suma de independientes: $M_{X+Y}=M_X\\cdot M_Y$."
        }
      ]
    },
    {
      "title": "Distribuciones discretas",
      "hint": "Catálogo: recorrido, E, V y cuándo usar cada una.",
      "unit": "3",
      "entries": [
        {
          "label": "Bernoulli$(p)$",
          "kind": "formula",
          "tex": "p_X(1)=p,\\ p_X(0)=q \\qquad E[X]=p \\qquad V(X)=pq",
          "body": "Un ensayo éxito/fracaso. FGM $q+pe^t$. Varianza máxima en $p=1/2$."
        },
        {
          "label": "Binomial$(n,p)$",
          "kind": "formula",
          "tex": "p_X(k)=\\binom{n}{k}p^k q^{n-k} \\qquad E=np \\qquad V=npq",
          "body": "Nº de éxitos en $n$ ensayos i.i.d. = suma de $n$ Bernoulli. $k\\in\\{0,\\dots,n\\}$.",
          "cond": "Reproductiva: $\\text{Bin}(n_1,p)+\\text{Bin}(n_2,p)=\\text{Bin}(n_1+n_2,p)$."
        },
        {
          "label": "Geométrica$(p)$",
          "kind": "formula",
          "tex": "p_X(k)=q^k p,\\ k\\in\\mathbb N_0 \\qquad E=\\frac{q}{p} \\qquad V=\\frac{q}{p^2}",
          "body": "Nº de **fracasos** antes del 1er éxito (convención cátedra). Falta de memoria: $P(X\\ge L+\\Delta\\mid X\\ge L)=P(X\\ge\\Delta)$.",
          "note": "Versión \"nº de ensayos\" $Y=X+1$: $E[Y]=1/p$. NO mezclar."
        },
        {
          "label": "Binomial negativa$(r,p)$",
          "kind": "formula",
          "tex": "p_X(k)=\\binom{k+r-1}{k}q^k p^r \\qquad E=\\frac{rq}{p} \\qquad V=\\frac{rq}{p^2}",
          "body": "Nº de fracasos hasta el $r$-ésimo éxito (Pascal). Suma de $r$ geométricas i.i.d."
        },
        {
          "label": "Hipergeométrica$(N,M,n)$",
          "kind": "formula",
          "tex": "p_X(k)=\\frac{\\binom{M}{k}\\binom{N-M}{n-k}}{\\binom{N}{n}} \\qquad E=n\\tfrac{M}{N}=np \\qquad V=npq\\tfrac{N-n}{N-1}",
          "body": "Muestreo **sin reposición**. Factor de corrección $\\frac{N-n}{N-1}$.",
          "cond": "Si $N\\gg n$ se aproxima por Binomial$(n,M/N)$."
        },
        {
          "label": "Poisson$(\\lambda)$",
          "kind": "formula",
          "tex": "p_X(k)=\\frac{\\lambda^k}{k!}e^{-\\lambda} \\qquad E=V=\\lambda",
          "body": "Conteos en un intervalo. Sello: **media = varianza**. FGM $e^{\\lambda(e^t-1)}$.",
          "cond": "Reproductiva; aprox. de Bin con $n$ grande, $p$ chico, $\\lambda=np$."
        },
        {
          "label": "Reconocer distribución discreta",
          "kind": "method",
          "body": "1 ensayo→Bernoulli; nº éxitos en $n$→Binomial; espera al 1er éxito→Geométrica; al $r$-ésimo→BinNeg; sin reposición→Hipergeométrica; conteos/tasa→Poisson.",
          "note": "Pistas: \"hasta que\", \"sin devolver\", \"en promedio λ por...\"."
        },
        {
          "label": "Teoría de la decisión",
          "kind": "method",
          "body": "Elegir entre alternativas inciertas **maximizando el valor esperado** de la ganancia. Construir la v.a. de cada opción, calcular $E[\\cdot]$ y comparar.",
          "cond": "Criterio del vendedor de diarios."
        }
      ]
    },
    {
      "title": "Variable aleatoria continua",
      "hint": "El continuo: densidad, integrales y confiabilidad.",
      "unit": "4",
      "entries": [
        {
          "label": "V.a. continua",
          "kind": "def",
          "tex": "X\\text{ continua}\\iff F_X\\text{ continua}\\iff P(X=\\alpha)=0\\ \\forall\\alpha",
          "body": "Toma valores en un continuo, probabilidad puntual nula. Solo los **intervalos** tienen prob. positiva.",
          "note": "Ventaja: $<$ y $\\le$ dan lo mismo (no hay que cuidar bordes)."
        },
        {
          "label": "Función de densidad (pdf)",
          "kind": "def",
          "tex": "f_X(x)=F_X'(x)\\ge 0,\\qquad \\int_{-\\infty}^{+\\infty} f_X=1",
          "body": "Análogo continuo de la PMF. Es \"prob. por unidad de longitud\" (una tasa), **no** una probabilidad: puede valer $>1$.",
          "cond": "$P(a<X\\le b)=\\int_a^b f_X=F_X(b)-F_X(a)$."
        },
        {
          "label": "FDA y recíproco",
          "kind": "formula",
          "tex": "F_X(x)=\\int_{-\\infty}^{x} f_X(y)\\,dy \\qquad P(a<X<b)=F_X(b)-F_X(a)",
          "body": "No decreciente, de 0 a 1."
        },
        {
          "label": "Esperanza y varianza por integral",
          "kind": "formula",
          "tex": "E[g(X)]=\\int g(x)f_X(x)\\,dx \\qquad V(X)=\\int (x-\\mu)^2 f_X\\,dx=E[X^2]-\\mu^2",
          "body": "Reemplazan las sumas del caso discreto por integrales."
        },
        {
          "label": "Esperanza por la cola",
          "kind": "formula",
          "tex": "E[X]=\\int_0^{\\infty}\\big(1-F_X(x)\\big)\\,dx=\\int_0^{\\infty} P(X>x)\\,dx",
          "cond": "Solo para $X\\ge 0$.",
          "note": "Útil cuando se conoce $F_X$ pero la densidad es incómoda."
        },
        {
          "label": "Tasa de fallas (hazard)",
          "kind": "def",
          "tex": "R(t)=\\frac{f_T(t)}{1-F_T(t)}=-\\frac{d}{dt}\\ln S(t),\\quad S(t)=P(T>t)",
          "body": "Ritmo instantáneo de falla dado que sobrevivió hasta $t$. Creciente=desgaste, decreciente=mortalidad infantil, constante=al azar.",
          "cond": "$S(t)=\\exp(-\\int_0^t R)$."
        },
        {
          "label": "Caracterización exponencial",
          "kind": "theorem",
          "body": "$T$ continua positiva es **exponencial** $\\iff$ su tasa de fallas $R(t)$ es **constante**. Reexpresa la falta de memoria.",
          "note": "$R$ constante $\\lambda \\Rightarrow S(t)=e^{-\\lambda t}$."
        },
        {
          "label": "Mínimo de exponenciales (serie)",
          "kind": "theorem",
          "tex": "T=\\min(X_1,\\dots,X_n)\\sim\\text{Expo}\\Big(\\sum_i\\lambda_i\\Big)",
          "body": "Sistema en serie (falla en cuanto falla uno). Las **tasas se suman**: $P(T>t)=\\prod e^{-\\lambda_i t}$.",
          "note": "No confundir con la suma de exponenciales (Gamma, standby)."
        }
      ]
    },
    {
      "title": "Distribuciones continuas",
      "hint": "Uniforme, exponencial, normal, Weibull y la estandarización.",
      "unit": "4",
      "entries": [
        {
          "label": "Uniforme$(a,b)$",
          "kind": "formula",
          "tex": "f_X=\\tfrac{1}{b-a}\\ \\text{en }(a,b) \\qquad E=\\tfrac{a+b}{2} \\qquad V=\\tfrac{(b-a)^2}{12}",
          "body": "Densidad constante. FDA lineal $F_X(x)=\\frac{x-a}{b-a}$."
        },
        {
          "label": "Exponencial$(\\lambda)$",
          "kind": "formula",
          "tex": "f_X=\\lambda e^{-\\lambda x}\\ (x>0) \\qquad E=\\tfrac{1}{\\lambda} \\qquad V=\\tfrac{1}{\\lambda^2}",
          "body": "Tiempo de espera al próximo suceso. $P(X>x)=e^{-\\lambda x}$. Media = desvío.",
          "cond": "Única continua **sin memoria**; análogo continuo de la geométrica."
        },
        {
          "label": "Normal$N(\\mu,\\sigma)$",
          "kind": "formula",
          "tex": "f_X=\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}} \\qquad E=\\mu \\qquad V=\\sigma^2",
          "body": "Campana simétrica. $\\gamma=0$, $\\kappa=0$. FDA $F_X(x)=\\Phi\\big(\\frac{x-\\mu}{\\sigma}\\big)$.",
          "note": "Cátedra: segundo parámetro = **desvío** $\\sigma$, no varianza."
        },
        {
          "label": "Regla empírica 68-95-99.7",
          "kind": "example",
          "tex": "P(|X-\\mu|<\\sigma)\\approx 0.683,\\ <2\\sigma\\approx 0.954,\\ <3\\sigma\\approx 0.997",
          "cond": "Solo para la normal."
        },
        {
          "label": "Estandarización",
          "kind": "method",
          "tex": "Z=\\frac{X-\\mu}{\\sigma}\\sim N(0,1) \\qquad \\Phi(-z)=1-\\Phi(z)",
          "body": "Prob.→valor: buscar $\\Phi$. Valor→prob.: fractil $x_\\alpha=\\mu+\\sigma z_\\alpha$.",
          "note": "Fractiles: $z_{0.90}{=}1.2816$, $z_{0.95}{=}1.6449$, $z_{0.975}{=}1.96$, $z_{0.99}{=}2.3263$. Interpolar entre filas."
        },
        {
          "label": "Weibull$(\\lambda,b)$",
          "kind": "formula",
          "tex": "F_X=1-e^{-(\\lambda x)^b}\\ (x>0) \\qquad R(t)=\\lambda b(\\lambda t)^{b-1}",
          "body": "Modelo estándar de confiabilidad. Tasa de fallas potencia de $t$.",
          "cond": "$b=1$ recupera la exponencial; $b>1$ desgaste, $b<1$ mortalidad infantil."
        },
        {
          "label": "Distribución de $Y=g(X)$ (método FDA)",
          "kind": "method",
          "body": "1) $F_Y(y)=P(g(X)\\le y)$ reescrito como evento sobre $X$, evaluar en $F_X$. 2) Derivar para $f_Y$, o sumar masas de preimágenes (discreto).",
          "cond": "Afín: $Y=aX+b\\Rightarrow \\mu_Y=a\\mu_X+b$, $\\sigma_Y=|a|\\sigma_X$. Normal cerrada por afines."
        },
        {
          "label": "$g$ no inyectiva",
          "kind": "caution",
          "body": "Para $Y=X^2$ hay que sumar las dos ramas de la preimagen: $P(X^2\\le w)=P(-\\sqrt w\\le X\\le\\sqrt w)$. Con $V\\sim N(0,1)$: $V^2\\sim\\chi^2_1$.",
          "note": "Transformada inversa: $F_X^{-1}(U)$ con $U\\sim\\text{Unif}(0,1)$ genera la distribución de $X$."
        }
      ]
    },
    {
      "title": "Variables bidimensionales",
      "hint": "Conjunta, marginales, condicionales; covarianza, correlación e independencia.",
      "unit": "5",
      "entries": [
        {
          "label": "Conjunta y marginales",
          "kind": "def",
          "tex": "f_X(x)=\\int f_{X,Y}(x,y)\\,dy \\qquad p_X(x)=\\sum_y p_{X,Y}(x,y)",
          "body": "La conjunta lo contiene todo; marginalizar = sumar/integrar la otra variable.",
          "note": "Las marginales NO determinan la conjunta."
        },
        {
          "label": "Condicional y esperanza condicional",
          "kind": "def",
          "tex": "f_{X\\mid Y}(x\\mid y)=\\frac{f_{X,Y}(x,y)}{f_Y(y)} \\qquad E[X\\mid Y=y]=\\int x\\,f_{X\\mid Y}\\,dx",
          "body": "$E[X\\mid Y=y]$ es un número; $E[X\\mid Y]$ es una **función de $Y$** (v.a.)."
        },
        {
          "label": "Independencia de v.a.",
          "kind": "def",
          "tex": "X,Y\\text{ indep.}\\iff f_{X,Y}=f_X\\cdot f_Y\\ (\\text{o }p_{X,Y}=p_X p_Y)",
          "body": "Conjunta factoriza en producto de marginales. Equivale a $f_{X\\mid Y}=f_X$.",
          "cond": "Consecuencias: $E[XY]=E[X]E[Y]$, $\\text{Cov}=0$, $V(X+Y)=V(X)+V(Y)$."
        },
        {
          "label": "Soporte no rectangular ⇒ dependencia",
          "kind": "caution",
          "body": "Si el soporte de $f_{X,Y}$ no es un rectángulo $A\\times B$ (p. ej. $0<y<x<1$), $X$ e $Y$ **no** pueden ser independientes (el rango de $Y$ depende de $X$).",
          "note": "Detección rápida sin calcular. También: cero en celda con marginales positivas."
        },
        {
          "label": "Covarianza",
          "kind": "formula",
          "tex": "\\text{Cov}(X,Y)=E[(X-\\mu_X)(Y-\\mu_Y)]=E[XY]-\\mu_X\\mu_Y",
          "body": "Mide asociación lineal. Bilineal; $\\text{Cov}(X,X)=V(X)$.",
          "cond": "$\\text{Cov}(aX{+}b,cY{+}d)=ac\\,\\text{Cov}(X,Y)$."
        },
        {
          "label": "Varianza de combinación lineal",
          "kind": "formula",
          "tex": "V(aX+bY)=a^2V(X)+2ab\\,\\text{Cov}(X,Y)+b^2V(Y)",
          "note": "$V(X\\pm Y)=V(X)\\pm 2\\text{Cov}+V(Y)$."
        },
        {
          "label": "Correlación $\\rho\\in[-1,1]$",
          "kind": "theorem",
          "tex": "\\rho_{X,Y}=\\frac{\\text{Cov}(X,Y)}{\\sigma_X\\sigma_Y}\\in[-1,1]",
          "body": "Covarianza normalizada (adimensional). $\\rho=\\pm 1\\iff Y=aX+b$ con prob. 1 (relación lineal). Demo: Cauchy-Schwarz vía discriminante $\\le 0$."
        },
        {
          "label": "Incorrelación ≠ independencia",
          "kind": "caution",
          "body": "$X,Y$ indep. $\\Rightarrow\\text{Cov}=0$, pero el **recíproco es FALSO** en general. Única excepción: conjuntamente gaussianas ($\\text{Cov}=0\\Rightarrow$ indep.)."
        },
        {
          "label": "Ley de esperanza total",
          "kind": "theorem",
          "tex": "E[X]=E\\big[E[X\\mid Y]\\big]=\\int E[X\\mid Y{=}y]\\,f_Y(y)\\,dy",
          "body": "Promediar por etapas: versión \"esperada\" de la probabilidad total."
        },
        {
          "label": "Ley de varianza total",
          "kind": "theorem",
          "tex": "V(X)=E\\big[V(X\\mid Y)\\big]+V\\big(E[X\\mid Y]\\big)",
          "body": "Dispersión intra-grupo + dispersión entre medias de grupo.",
          "note": "Error típico: olvidar el término entre-grupos $V(E[X\\mid Y])$ y subestimar $V(X)$."
        },
        {
          "label": "Mezcla de distribuciones",
          "kind": "method",
          "tex": "f_X(x)=\\sum_k f_{X\\mid M}(x\\mid k)\\,P(M{=}k)",
          "body": "Población hecha de subpoblaciones; densidad = combinación convexa. La **varianza no se mezcla linealmente** (usar ley de varianza total → sobredispersión).",
          "note": "Mezcla inversa: integrar contra $f_Y(y)$ en vez de sumar."
        }
      ]
    },
    {
      "title": "Procesos estocásticos",
      "hint": "Familias de v.a. en el tiempo: Bernoulli, Poisson, Markov, caminata.",
      "unit": "6",
      "entries": [
        {
          "label": "Proceso estocástico",
          "kind": "def",
          "body": "Familia $\\{X(t)\\}_{t\\in\\mathbb T}$ indexada por el tiempo. Espacio de estados $\\mathbb E$. Se simplifica con: estacionariedad, incrementos independientes, propiedad de Markov.",
          "cond": "Discreto/continuo según $\\mathbb E$ y $\\mathbb T$."
        },
        {
          "label": "Propiedades simplificadoras",
          "kind": "def",
          "body": "**Estacionario**: desplazar índices no cambia la distribución conjunta. **Incrementos indep.**: en intervalos disjuntos son independientes. **Incrementos estac.**: dependen solo de la longitud del intervalo.",
          "note": "Amplio: solo $E[X(t)]$ y $V[X(t)]$ constantes."
        },
        {
          "label": "Proceso de Markov",
          "kind": "def",
          "tex": "P(x_n,t_n\\mid x_{n-1},\\dots,x_1)=P(x_n,t_n\\mid x_{n-1},t_{n-1})",
          "body": "El futuro depende **solo del presente**, no de toda la historia. Chapman-Kolmogorov se simplifica.",
          "cond": "Espacio de estados discreto $\\Rightarrow$ cadena de Markov."
        },
        {
          "label": "Proceso de Bernoulli$(p)$",
          "kind": "formula",
          "tex": "N(k)\\sim\\text{Binomial}(k,p)",
          "body": "Conteo en tiempo **discreto**: a lo sumo un evento por paso, prob. $p$. $N(k)\\sim\\text{Bin}(k,p)$; tiempos entre eventos $\\sim$Geométrica; tiempo al $k$-ésimo $\\sim$BinNeg."
        },
        {
          "label": "Proceso de Poisson$(\\lambda)$",
          "kind": "formula",
          "tex": "N(t)\\sim\\text{Poisson}(\\lambda t),\\quad E[N(t)]=V[N(t)]=\\lambda t",
          "body": "Conteo en tiempo **continuo**, tasa $\\lambda$. Condiciones con $o(h)$: $P(\\Delta N{=}1)=\\lambda h+o(h)$, sin simultáneos.",
          "cond": "Tiempos entre eventos $\\sim$Expo$(\\lambda)$ i.i.d.; al $k$-ésimo $\\sim$Erlang$(k,\\lambda)$."
        },
        {
          "label": "Dualidad conteo ↔ tiempo",
          "kind": "method",
          "tex": "T_k< t \\iff N(t)\\ge k",
          "body": "Pasa preguntas sobre tiempos (Erlang/Expo) a conteos (Poisson). Clave en ejercicios.",
          "note": "Ajustar siempre la tasa a la longitud del intervalo ($\\lambda t$)."
        },
        {
          "label": "Relación Bernoulli-Poisson",
          "kind": "theorem",
          "body": "Poisson = límite continuo de Bernoulli con ticks infinitesimales ($p=\\lambda\\Delta t$). Análogos: Geom↔Expo, BinNeg↔Erlang, Bin↔Poisson.",
          "cond": "Ambos: conteo, incrementos indep./estac., Markov."
        },
        {
          "label": "Cadena de Markov",
          "kind": "method",
          "tex": "\\vec p(n)=\\vec p(0)\\,\\mathbb P^n,\\qquad (\\mathbb P^k)_{ij}=P(i\\to j\\text{ en }k\\text{ pasos})",
          "body": "Matriz de transición $\\mathbb P$ (filas suman 1, estocástica). Tipos de estados: accesible, recurrente/transitorio, periódico, absorbente.",
          "cond": "Cadena homogénea: $\\mathbb P$ constante."
        },
        {
          "label": "Distribución estacionaria",
          "kind": "formula",
          "tex": "\\vec\\pi=\\vec\\pi\\,\\mathbb P,\\qquad \\sum_j\\pi_j=1",
          "body": "Régimen de equilibrio (autovector a izquierda, autovalor 1). En cadena regular ($\\mathbb P^n>0$) es el límite independiente del inicio.",
          "note": "\"Comportamiento de largo plazo\" = resolver este sistema."
        },
        {
          "label": "Caminata aleatoria",
          "kind": "example",
          "tex": "X_n=\\sum_{k=1}^n Y_k,\\ E[X_n]=n(2p-1),\\ V[X_n]=4np(1-p)",
          "body": "Pasos $\\pm 1$ i.i.d. Markov, incrementos indep./estac., pero **NO estacionario** ($V$ crece con $n$). Simétrica ($p{=}1/2$): $E{=}0$, $V{=}n$.",
          "note": "Gaussiana ($G_k\\sim N(0,1)$): $X_n\\sim N(0,n)$ (Browniano discreto)."
        }
      ]
    },
    {
      "title": "Suma de variables aleatorias",
      "hint": "E, V y distribución de S=X+Y; convolución y casos estables.",
      "unit": "7",
      "entries": [
        {
          "label": "E y V de una suma",
          "kind": "theorem",
          "tex": "E[X+Y]=E[X]+E[Y] \\qquad V(X+Y)=V(X)+2\\text{Cov}(X,Y)+V(Y)",
          "body": "La esperanza siempre suma. La varianza arrastra la covarianza salvo independencia."
        },
        {
          "label": "La resta también suma varianzas",
          "kind": "caution",
          "tex": "V(X-Y)=V(X)+V(Y)\\quad(\\text{indep.})",
          "body": "La varianza mide dispersión, no tiene signo: el $(-1)^2$ la deja positiva. Lo que cambia de signo es la media.",
          "note": "Solo si independientes (o incorrelacionadas)."
        },
        {
          "label": "Convolución (independientes)",
          "kind": "formula",
          "tex": "f_S(s)=\\int f_X(s-y)f_Y(y)\\,dy \\qquad p_S(s)=\\sum_y p_X(s-y)p_Y(y)",
          "body": "Distribución de $S=X+Y$ con $X,Y$ indep. Atajo: FGM de la suma = producto de FGM.",
          "cond": "Caso general (sin indep.): usar la conjunta $f_{X,Y}(s-y,y)$."
        },
        {
          "label": "Sumas estables / cerradas",
          "kind": "theorem",
          "body": "Bernoulli×n→Bin; Bin+Bin→Bin (misma $p$); Poisson+Poisson→Poisson; Normal+Normal→Normal; Expo×n→Gamma/Erlang; Geom+Geom→BinNeg; $\\sum Z_i^2\\to\\chi^2$.",
          "note": "Unif+Unif→**triangular** (NO uniforme): familia no estable."
        },
        {
          "label": "Normal + Normal",
          "kind": "formula",
          "tex": "N(\\mu_1,\\sigma_1)+N(\\mu_2,\\sigma_2)=N\\big(\\mu_1+\\mu_2,\\sqrt{\\sigma_1^2+\\sigma_2^2}\\big)",
          "note": "Suman las **varianzas**, NO los desvíos."
        },
        {
          "label": "Suma y promedio i.i.d.",
          "kind": "formula",
          "tex": "E[S_n]=n\\mu,\\ V(S_n)=n\\sigma^2 \\qquad E[\\bar X_n]=\\mu,\\ V(\\bar X_n)=\\frac{\\sigma^2}{n}",
          "body": "Con $X_i$ i.i.d. La varianza del promedio $\\to 0$: base de la LGN."
        },
        {
          "label": "Promedio muestral",
          "kind": "def",
          "tex": "\\bar X_n=\\frac{1}{n}\\sum X_i,\\qquad \\sigma_{\\bar X_n}=\\frac{\\sigma}{\\sqrt n}\\ (\\text{error estándar})",
          "body": "Estimador insesgado de $\\mu$. Para bajar el error a la mitad hay que **cuadruplicar** $n$ ($\\propto 1/\\sqrt n$).",
          "cond": "Si $X_i$ normales, $\\bar X_n$ es **exactamente** $N(\\mu,\\sigma/\\sqrt n)$."
        },
        {
          "label": "Gamma / Erlang",
          "kind": "formula",
          "tex": "T_n=\\sum_{i=1}^n\\tau_i\\sim\\text{Gamma}(n,\\lambda),\\quad E=\\tfrac{n}{\\lambda},\\ V=\\tfrac{n}{\\lambda^2}",
          "body": "Suma de $n$ exponenciales i.i.d. = Erlang (Gamma de forma entera). Tiempo a la $n$-ésima ocurrencia Poisson.",
          "cond": "Densidad $f=\\frac{\\lambda^n t^{n-1}e^{-\\lambda t}}{(n-1)!}$."
        }
      ]
    },
    {
      "title": "Teoremas límite",
      "hint": "Chebyshev (cota), LGN (a dónde va) y TCL (cómo fluctúa).",
      "unit": "7",
      "entries": [
        {
          "label": "Desigualdad de Markov",
          "kind": "theorem",
          "tex": "P(X\\ge\\alpha)\\le\\frac{E[X]}{\\alpha},\\qquad \\alpha>0",
          "cond": "Solo para $X\\ge 0$.",
          "note": "Cota universal (no usa la distribución)."
        },
        {
          "label": "Desigualdad de Chebyshev",
          "kind": "theorem",
          "tex": "P(|X-\\mu|\\ge\\varepsilon)\\le\\frac{\\sigma^2}{\\varepsilon^2}",
          "body": "Cota de alejarse de la media usando solo $\\sigma^2$. Sale de aplicar Markov a $(X-\\mu)^2$.",
          "note": "Correcta pero **floja** (vale para cualquier distribución → cubre el peor caso)."
        },
        {
          "label": "Ley de grandes números",
          "kind": "theorem",
          "tex": "\\bar X_n\\to\\mu\\quad(n\\to\\infty)",
          "body": "Débil (en prob., demo vía Chebyshev): $P(|\\bar X_n-\\mu|\\ge\\varepsilon)\\le\\frac{\\sigma^2}{n\\varepsilon^2}\\to 0$. Fuerte: convergencia casi segura.",
          "cond": "Justifica estimar promediando e interpretar prob. como frecuencia."
        },
        {
          "label": "Teorema central del límite",
          "kind": "theorem",
          "tex": "Z_n=\\frac{\\bar X_n-\\mu}{\\sigma/\\sqrt n}\\xrightarrow{d} N(0,1)",
          "body": "Suma/promedio de muchas i.i.d. → aproximadamente Normal, **sin importar** la distribución de origen.",
          "cond": "Regla usual $n>20$ (o $n>30$). $\\bar X_n\\approx N(\\mu,\\sigma/\\sqrt n)$, $S_n\\approx N(n\\mu,\\sqrt n\\,\\sigma)$."
        },
        {
          "label": "Corrección por continuidad",
          "kind": "method",
          "tex": "P(a\\le S_n\\le b)\\approx\\Phi\\Big(\\tfrac{b+\\frac12-n\\mu}{\\sqrt n\\sigma}\\Big)-\\Phi\\Big(\\tfrac{a-\\frac12-n\\mu}{\\sqrt n\\sigma}\\Big)",
          "body": "Al aproximar una **discreta** por la normal, ajustar $\\pm\\tfrac12$: cada entero se ensancha a $[s-\\tfrac12,s+\\tfrac12]$.",
          "note": "Para $<$ y $>$ estrictos mover el $\\pm\\tfrac12$ hacia adentro."
        },
        {
          "label": "Aproximación normal de la binomial",
          "kind": "formula",
          "tex": "\\text{Bin}(n,p)\\approx N(np,\\sqrt{npq})",
          "body": "De Moivre-Laplace (Stirling+Taylor). Caso emblemático del TCL.",
          "cond": "Conviene si $np\\ge 5$ y $nq\\ge 5$. Si $p\\approx 0$ con $np$ moderado, usar Poisson."
        }
      ]
    },
    {
      "title": "Inferencia: estimación puntual",
      "hint": "Estimar un parámetro con un valor; medir calidad y métodos.",
      "unit": "8",
      "entries": [
        {
          "label": "Estadístico vs estimador vs estimación",
          "kind": "def",
          "body": "**Estadístico**: función $g(X_1,\\dots,X_n)$ de la muestra (v.a.). **Estimador** $\\hat\\theta$: estadístico para aproximar $\\theta$. **Estimación**: valor concreto $\\hat\\theta(x_1,\\dots,x_n)$ (número).",
          "note": "Pre-muestra (mayúsculas, v.a.) vs post-muestra (minúsculas, número)."
        },
        {
          "label": "ECM y descomposición sesgo-varianza",
          "kind": "formula",
          "tex": "\\text{mse}(\\hat\\theta)=E[(\\hat\\theta-\\theta)^2]=V(\\hat\\theta)+\\text{sesgo}^2(\\hat\\theta)",
          "body": "$\\text{sesgo}(\\hat\\theta)=E[\\hat\\theta]-\\theta$. Insesgado: sesgo$=0$. Consistente: $\\text{mse}\\to 0$.",
          "note": "Ideal: insesgado de mínima varianza."
        },
        {
          "label": "Estimadores clásicos",
          "kind": "formula",
          "tex": "\\bar X_n\\to\\mu\\ (\\text{ECM }\\tfrac{\\sigma^2}{n}) \\quad \\hat p\\to p\\ (\\text{ECM }\\tfrac{p(1-p)}{n}) \\quad S_n^2\\to\\sigma^2",
          "body": "Los tres insesgados. Las aproximaciones normales (por TCL) sostienen los IC."
        },
        {
          "label": "Varianza muestral (insesgada)",
          "kind": "formula",
          "tex": "S_n^2=\\frac{1}{n-1}\\sum(X_i-\\bar X_n)^2,\\qquad E[S_n^2]=\\sigma^2",
          "body": "Denominador $n-1$ (corrección de Bessel): se gasta 1 grado de libertad al estimar la media.",
          "cond": "Si normal: $\\frac{(n-1)S_n^2}{\\sigma^2}\\sim\\chi^2_{n-1}$."
        },
        {
          "label": "Máxima verosimilitud (MV)",
          "kind": "method",
          "tex": "\\hat\\theta=\\arg\\max_\\theta \\sum_i\\ln f(x_i;\\theta)",
          "body": "Maximizar la log-verosimilitud (derivar e igualar a 0). Estimadores consistentes.",
          "cond": "Cuando se conoce la familia y se quiere el estimador estándar."
        },
        {
          "label": "MV con parámetro en el soporte",
          "kind": "caution",
          "body": "Si $\\theta$ define el **borde del soporte** (uniformes), la verosimilitud es monótona: el máximo está en el **extremo de la muestra** ($x_{(n)}$ o $x_{(1)}$), NO derivando.",
          "note": "Unif$(3,\\alpha)$: $\\hat\\alpha=\\max_i x_i$. Unif$(\\alpha,2)$: $\\hat\\alpha=\\min_i x_i$."
        },
        {
          "label": "Máximo a posteriori (MAP)",
          "kind": "method",
          "tex": "\\hat\\theta=\\arg\\max_\\theta f(x\\mid\\theta)\\,g(\\theta)",
          "body": "Bayesiano: $\\theta$ es v.a. con prior $g(\\theta)$; maximizar la posterior (numerador de Bayes).",
          "cond": "Cuando hay info previa creíble. Beta-Bernoulli: $\\hat p=\\frac{s+\\alpha-1}{n+\\alpha+\\beta-2}$."
        },
        {
          "label": "Método de los momentos",
          "kind": "method",
          "body": "Igualar momento poblacional al muestral y despejar: $\\mu_k=H(\\theta)$, $\\hat\\theta=H^{-1}(\\hat\\mu_k)$.",
          "cond": "Exponencial: $\\mu=1/\\lambda\\Rightarrow\\hat\\lambda=1/\\bar X_n$. Puede diferir del MV."
        }
      ]
    },
    {
      "title": "Intervalos de confianza",
      "hint": "Rango que atrapa al parámetro con confianza γ; tres casos y tamaño muestral.",
      "unit": "8",
      "entries": [
        {
          "label": "Intervalo de confianza",
          "kind": "def",
          "tex": "P\\big(\\hat\\theta_\\ell<\\theta<\\hat\\theta_u\\big)=\\gamma",
          "body": "Rango con nivel de confianza $\\gamma$. Bilateral (ambos finitos) o unilateral ($\\pm\\infty$ en un extremo)."
        },
        {
          "label": "Interpretación frecuentista",
          "kind": "caution",
          "body": "El IC tiene prob. $\\gamma$ de contener a $\\theta$ **antes** de muestrear. **Después**, los extremos son números fijos: contiene o no (prob. 0 o 1). NO decir \"este IC tiene 90% de prob. de contener a $\\mu$\"."
        },
        {
          "label": "Caso 1 · Media, σ conocido (Z)",
          "kind": "formula",
          "tex": "IC_\\gamma(\\mu)=\\bar X_n \\pm z_{\\frac{1+\\gamma}{2}}\\,\\frac{\\sigma}{\\sqrt n}",
          "body": "Muestra normal con $\\sigma$ conocido (o $n$ grande por TCL). $z_p=\\Phi^{-1}(p)$.",
          "cond": "Unilateral: usar $z_\\gamma$ y un solo extremo."
        },
        {
          "label": "Caso 2 · Proporción (Z)",
          "kind": "formula",
          "tex": "IC_\\gamma(p)=\\hat p \\pm z_{\\frac{1+\\gamma}{2}}\\sqrt{\\frac{\\hat p(1-\\hat p)}{n}}",
          "body": "Por TCL, $n$ grande. En el desvío va $\\hat p$ (a diferencia de la prueba de hipótesis).",
          "cond": "Acotar a $[0,1]$ en unilaterales."
        },
        {
          "label": "Caso 3 · Media, σ desconocido (t)",
          "kind": "formula",
          "tex": "T=\\frac{\\bar X_n-\\mu}{S_n/\\sqrt n}\\sim t_{n-1},\\qquad IC_\\gamma(\\mu)=\\bar X_n\\pm t_{n-1,\\frac{1+\\gamma}{2}}\\frac{S_n}{\\sqrt n}",
          "body": "Muestra normal, $\\sigma$ desconocido, $n$ chico. t de Student con $n-1$ g.l.",
          "note": "$n$ grande ($>100/200$): $t_{n-1}\\approx z$ (se recupera el caso 1)."
        },
        {
          "label": "Tamaño muestral",
          "kind": "formula",
          "tex": "n\\ge z_{\\frac{1+\\gamma}{2}}^2\\,\\frac{\\sigma^2}{E^2}",
          "body": "$E$ = semiamplitud (error de muestreo). Precisión $\\propto 1/\\sqrt n$.",
          "cond": "Proporción: cota conservadora $p(1-p)\\le\\tfrac14$ o $\\hat p$ previo. Redondear hacia arriba."
        },
        {
          "label": "Corrección por población finita",
          "kind": "formula",
          "tex": "E=z_{1-\\frac{\\alpha}{2}}\\sqrt{\\hat p(1-\\hat p)}\\sqrt{\\frac{N-n}{N\\,n}}",
          "body": "Muestreo sin reposición de población finita $N$ (origen hipergeométrico). $n$ acotado por $N$.",
          "cond": "Si $N\\gg n$ se recupera $E=z\\sqrt{\\hat p(1-\\hat p)/n}$."
        },
        {
          "label": "IC de la varianza (ji-cuadrado)",
          "kind": "formula",
          "tex": "\\left[\\frac{(n-1)S^2}{\\chi^2_{n-1,1-\\alpha/2}},\\ \\frac{(n-1)S^2}{\\chi^2_{n-1,\\alpha/2}}\\right]",
          "body": "Usa $(n-1)S^2/\\sigma^2\\sim\\chi^2_{n-1}$ (muestra normal).",
          "note": "$\\chi^2_k$: $E=k$, $V=2k$."
        }
      ]
    },
    {
      "title": "Distribuciones de muestreo",
      "hint": "t de Student y ji-cuadrado: las que aparecen al estimar con σ desconocido.",
      "unit": "8",
      "entries": [
        {
          "label": "t de Student $t_m$",
          "kind": "formula",
          "tex": "T=\\frac{\\bar X_n-\\mu}{S_n/\\sqrt n}\\sim t_{n-1}",
          "body": "Reemplaza $\\sigma$ por $S_n$ (aleatorio): colas **más pesadas** que la normal, fractiles mayores. $m=n-1$ g.l.",
          "cond": "$m\\to\\infty\\Rightarrow t_m\\to N(0,1)$. Menos g.l. → fractil mayor."
        },
        {
          "label": "Ji-cuadrado $\\chi^2_k$",
          "kind": "formula",
          "tex": "\\sum_{i=1}^k Z_i^2\\sim\\chi^2_k,\\qquad \\frac{(n-1)S_n^2}{\\sigma^2}\\sim\\chi^2_{n-1}",
          "body": "Suma de $k$ normales estándar al cuadrado. $E=k$, $V=2k$. Aditiva en g.l.",
          "cond": "Construye la t: $T=Z/\\sqrt{V/k}$ con $Z\\sim N(0,1)$, $V\\sim\\chi^2_k$ indep."
        }
      ]
    },
    {
      "title": "Pruebas de hipótesis",
      "hint": "Decidir entre H0 y H1 controlando la probabilidad de error.",
      "unit": "9",
      "entries": [
        {
          "label": "Hipótesis y tipo de cola",
          "kind": "def",
          "body": "$H_0$ (nula, por defecto, se mantiene salvo evidencia fuerte) vs $H_1$ (alternativa). **Dos colas**: $\\theta=\\theta_0$ vs $\\ne$. **Cola der.**: $\\theta\\le\\theta_0$ vs $>$. **Cola izq.**: $\\theta\\ge\\theta_0$ vs $<$.",
          "note": "La igualdad SIEMPRE va en $H_0$. Analogía del jurado: $H_0$=inocente."
        },
        {
          "label": "Ingredientes",
          "kind": "def",
          "body": "**Estadístico** $\\Lambda$ (resume la muestra); **región de rechazo** $R$; **nivel de significación** $\\alpha$ tal que $P_{H_0}(\\Lambda\\in R)\\le\\alpha$.",
          "note": "Región en las colas: ahí caen los valores improbables bajo $H_0$."
        },
        {
          "label": "Errores tipo I y II",
          "kind": "def",
          "tex": "\\alpha=P(\\text{rechazar }H_0\\mid H_0\\text{ cierta}),\\quad \\beta=P(\\text{aceptar }H_0\\mid H_0\\text{ falsa})",
          "body": "Tipo I: rechazar siendo cierta. Tipo II: aceptar siendo falsa. **Potencia** = $1-\\beta$.",
          "note": "$\\alpha$ es un número (se fija); $\\beta=\\beta(\\theta_1)$ es una función (curva OC)."
        },
        {
          "label": "Balance α-β",
          "kind": "caution",
          "body": "Bajar $\\alpha$ tiende a **subir** $\\beta$ y viceversa. Para bajar **ambos** a la vez hay que **aumentar $n$**.",
          "note": "Diseño: fijar $\\alpha$ y $\\beta(\\theta_1)$ para despejar $n$ y el valor crítico $c$."
        },
        {
          "label": "Estadístico para la media",
          "kind": "formula",
          "tex": "Z=\\frac{\\bar X-\\mu_0}{\\sigma/\\sqrt n}\\sim N(0,1) \\qquad T=\\frac{\\bar X-\\mu_0}{S/\\sqrt n}\\sim t_{n-1}",
          "body": "$Z$: $\\sigma$ conocida o $n$ grande. $T$: $\\sigma$ desconocida, muestra normal, $n$ chico."
        },
        {
          "label": "Estadístico para la proporción",
          "kind": "formula",
          "tex": "Z=\\frac{\\hat q-q_0}{\\sqrt{q_0(1-q_0)/n}}\\sim N(0,1)",
          "body": "$\\hat q=X/n$, $n$ grande ($>100$). En el denominador va $q_0$ (todo bajo $H_0$), NO $\\hat q$.",
          "note": "Diferencia clave con el IC de proporción (que usa $\\hat q$)."
        },
        {
          "label": "Región de rechazo por cola",
          "kind": "method",
          "tex": "\\text{2 colas: }|Z|>z_{1-\\alpha/2}\\quad\\text{der.: }Z>z_{1-\\alpha}\\quad\\text{izq.: }Z<-z_{1-\\alpha}",
          "body": "Con $T$ se reemplaza $z$ por el fractil $t_{n-1}$. Valor crítico des-estandarizado: $\\bar x_c=\\mu_0+z_{1-\\alpha}\\sigma/\\sqrt n$."
        },
        {
          "label": "Valor p",
          "kind": "def",
          "tex": "\\text{rechazar }H_0\\iff \\text{valor p}<\\alpha",
          "body": "Prob. (bajo $H_0$) de un estadístico \"tan malo o peor\" que el observado. Der.: $1-\\Phi(z_{obs})$; izq.: $\\Phi(z_{obs})$; 2 colas: $2(1-\\Phi(|z_{obs}|))$.",
          "note": "NO es $P(H_0$ cierta$)$: es prob. sobre los datos dado $H_0$."
        },
        {
          "label": "Reconocer la prueba",
          "kind": "method",
          "body": "1) Identificar parámetro (media o proporción). 2) Plantear $H_0/H_1$ y la cola según hacia dónde apunta $H_1$. 3) Elegir $Z$ o $T$. 4) Región/valor p. 5) Decidir y concluir.",
          "cond": "Dato = conteo de éxitos/total → proporción. Dualidad: IC bilateral $\\gamma$ no rechaza $H_0:\\theta=\\theta_0$ a nivel $\\alpha=1-\\gamma$."
        }
      ]
    }
  ]
};
