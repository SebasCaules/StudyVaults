import type { Sheet } from "../types";

// Generado por el pipeline studyvault-cheatsheets (extracción + auditoría sub-overseer).
// Editable a mano: es data pura. Ver components/vault-sheets/types.ts.

export const mnaFormulas: Sheet = {
  "vault": "mna",
  "kind": "formulas",
  "title": "Métodos Numéricos Avanzados",
  "subtitle": "Álgebra lineal numérica + Fourier — cheat sheet del final",
  "notation": "$\\mathbb{K}=\\mathbb{R}$ o $\\mathbb{C}$; $z=a+ib$, $\\bar z$ conjugado, $\\rho=|z|$, $\\theta=\\arg z$; $A\\in\\mathbb{K}^{n\\times m}$, $A^T$ traspuesta, $A^*=\\overline{A^T}$; $\\langle\\cdot,\\cdot\\rangle$ producto interno, $\\|\\cdot\\|$ norma; $\\lambda$ autovalor, $S_\\lambda$ autoespacio, $\\rho(A)$ radio espectral; $\\sigma_i$ valores singulares; $T$ período, $\\omega_0=2\\pi/T$.",
  "updated": "2026-06-19",
  "groups": [
    {
      "title": "Números complejos",
      "hint": "Forma binómica y polar",
      "entries": [
        {
          "label": "Unidad imaginaria",
          "kind": "def",
          "tex": "i^2=-1,\\quad i^{2n}=(-1)^n,\\quad i^{2n+1}=(-1)^n\\,i"
        },
        {
          "label": "Número complejo",
          "kind": "def",
          "tex": "z=a_z+i\\,b_z,\\quad a_z=\\mathrm{Re}(z),\\ b_z=\\mathrm{Im}(z)"
        },
        {
          "label": "Producto",
          "kind": "formula",
          "tex": "z\\,w=(a_z a_w-b_z b_w)+i\\,(a_z b_w+a_w b_z)"
        },
        {
          "label": "Inverso / división",
          "kind": "formula",
          "tex": "z^{-1}=\\frac{a_z-i\\,b_z}{a_z^2+b_z^2},\\qquad \\frac{z}{w}=z\\,w^{-1}"
        },
        {
          "label": "Módulo y conjugado",
          "kind": "def",
          "tex": "|z|=\\sqrt{a_z^2+b_z^2},\\quad z\\bar z=|z|^2,\\quad z+\\bar z=2\\,\\mathrm{Re}(z)"
        },
        {
          "label": "Euler",
          "kind": "theorem",
          "tex": "e^{i\\theta}=\\cos\\theta+i\\,\\mathrm{sen}\\,\\theta",
          "cond": "$\\forall\\theta\\in\\mathbb{R}$"
        },
        {
          "label": "Forma polar exponencial",
          "kind": "formula",
          "tex": "z=\\rho\\,e^{i\\theta},\\quad z\\,w=\\rho_z\\rho_w\\,e^{i(\\theta_z+\\theta_w)},\\quad \\tfrac{z}{w}=\\tfrac{\\rho_z}{\\rho_w}\\,e^{i(\\theta_z-\\theta_w)}"
        },
        {
          "label": "De Moivre (potenciación)",
          "kind": "theorem",
          "tex": "z^n=\\rho^n\\,e^{i n\\theta}=\\rho^n\\big[\\cos(n\\theta)+i\\,\\mathrm{sen}(n\\theta)\\big]",
          "cond": "$n\\in\\mathbb{N}$"
        },
        {
          "label": "Radicación ($w^n=z$)",
          "kind": "formula",
          "tex": "w_k=\\sqrt[n]{\\rho_z}\\;e^{\\,i\\left(\\frac{\\theta_z+2k\\pi}{n}\\right)},\\quad k=0,\\dots,n-1",
          "note": "Hay exactamente $n$ raíces distintas, equiespaciadas en el círculo de radio $\\sqrt[n]{\\rho_z}$"
        },
        {
          "label": "Logaritmo ($e^w=z$)",
          "kind": "formula",
          "tex": "w_k=\\ln|z|+i\\,(\\arg z+2k\\pi),\\quad z^w=e^{w\\ln z}"
        },
        {
          "label": "$\\mathbb{C}$ no ordenado",
          "kind": "caution",
          "tex": "\\nexists\\ \\text{orden en }\\mathbb{C}\\ \\text{compatible con los axiomas A.1–A.4}",
          "note": "No tiene sentido escribir $z<w$ en $\\mathbb{C}$"
        }
      ]
    },
    {
      "title": "Vectores, producto interno y normas",
      "hint": "Geometría en $\\mathbb{K}^n$",
      "entries": [
        {
          "label": "Producto interno",
          "kind": "def",
          "tex": "\\langle u,v\\rangle=\\sum_{k=1}^{n} u_k\\,v_k\\quad(\\mathbb{R}^n);\\quad \\sum_k u_k\\,\\overline{v_k}\\ (\\mathbb{C}^n)",
          "note": "Los slides usan $\\sum u_iv_i$ sin conjugar; en $\\mathbb{C}^n$ lo usual es conjugar el 2.º factor"
        },
        {
          "label": "Norma euclídea (2)",
          "kind": "def",
          "tex": "\\|u\\|_2=\\sqrt{\\langle u,u\\rangle}"
        },
        {
          "label": "Otras normas vectoriales",
          "kind": "formula",
          "tex": "\\|v\\|_1=\\sum_i|v_i|,\\quad \\|v\\|_p=\\Big(\\sum_i|v_i|^p\\Big)^{1/p},\\quad \\|v\\|_\\infty=\\max_i|v_i|"
        },
        {
          "label": "Cauchy–Schwarz",
          "kind": "theorem",
          "tex": "|\\langle u,v\\rangle|\\le \\|u\\|_2\\,\\|v\\|_2"
        },
        {
          "label": "Ángulo entre vectores",
          "kind": "formula",
          "tex": "\\cos(\\alpha_{uv})=\\frac{\\langle u,v\\rangle}{\\|u\\|_2\\,\\|v\\|_2},\\quad 0\\le\\alpha_{uv}\\le\\pi"
        },
        {
          "label": "Paralelo / perpendicular",
          "kind": "def",
          "tex": "u\\parallel v\\!\\iff\\! v=k\\,u;\\quad u\\perp v\\!\\iff\\! \\langle u,v\\rangle=0",
          "cond": "$u\\perp v$: ambos no nulos"
        },
        {
          "label": "Axiomas de norma",
          "kind": "def",
          "tex": "N(v)\\!\\ge\\!0,\\ N(v)\\!=\\!0\\!\\iff\\! v\\!=\\!0;\\ N(\\lambda v)\\!=\\!|\\lambda|N(v);\\ N(u\\!+\\!v)\\!\\le\\! N(u)\\!+\\!N(v)"
        }
      ]
    },
    {
      "title": "Matrices y determinantes",
      "hint": "Operaciones, tipos especiales, det",
      "entries": [
        {
          "label": "Producto de matrices",
          "kind": "formula",
          "tex": "C=AB,\\quad c_{ij}=\\sum_{k=1}^{n} a_{ik}\\,b_{kj}=\\langle F_i^A,\\,C_j^B\\rangle",
          "cond": "$A\\in\\mathbb{K}^{m\\times n},\\,B\\in\\mathbb{K}^{n\\times p}$"
        },
        {
          "label": "No conmutatividad",
          "kind": "caution",
          "tex": "AB\\neq BA\\ \\text{en general};\\quad (AB)^T=B^TA^T;\\quad (AB)^{-1}=B^{-1}A^{-1}",
          "note": "Al transponer/invertir un producto se invierte el orden"
        },
        {
          "label": "Tipos con nombre",
          "kind": "def",
          "tex": "\\begin{aligned}&\\text{simétrica: }A=A^T;\\ \\text{antisim.: }A=-A^T\\ (a_{ii}=0)\\\\&\\text{idempotente: }A^2=A;\\ \\text{involutiva: }A^2=I\\\\&\\text{nilpotente: }A^{n_0}=0;\\ \\text{ortogonal: }A^TA=AA^T=I\\end{aligned}"
        },
        {
          "label": "Determinante $2\\times2$",
          "kind": "def",
          "tex": "\\det A=a_{11}a_{22}-a_{12}a_{21}"
        },
        {
          "label": "Cofactor",
          "kind": "def",
          "tex": "A_{ij}=(-1)^{i+j}\\,|M_{ij}|",
          "cond": "$M_{ij}$ = menor: elimina fila $i$, columna $j$"
        },
        {
          "label": "Laplace (cofactores)",
          "kind": "method",
          "tex": "\\det(A)=\\sum_{j=1}^{n} a_{ij}\\,A_{ij}",
          "note": "Conviene desarrollar por la fila/columna con más ceros"
        },
        {
          "label": "Sarrus $3\\times3$",
          "kind": "formula",
          "tex": "\\det A=a_{11}a_{22}a_{33}+a_{12}a_{23}a_{31}+a_{13}a_{21}a_{32}-a_{13}a_{22}a_{31}-a_{11}a_{23}a_{32}-a_{12}a_{21}a_{33}",
          "cond": "solo $3\\times3$"
        },
        {
          "label": "Propiedades del det",
          "kind": "theorem",
          "tex": "\\det(AB)=\\det A\\,\\det B;\\quad \\det(A^T)=\\det A;\\quad \\det(A^{-1})=\\tfrac{1}{\\det A}"
        },
        {
          "label": "Multilineal alternada",
          "kind": "theorem",
          "tex": "\\det(\\dots,A_i+\\alpha A_j,\\dots)=\\det A;\\quad \\det(\\dots,A_i,A_j,\\dots)=-\\det(\\dots,A_j,A_i,\\dots)",
          "note": "Columna nula o columnas LD $\\Rightarrow \\det=0$"
        },
        {
          "label": "Normas matriciales 1, $\\infty$, 2, F",
          "kind": "formula",
          "tex": "\\|A\\|_1=\\max_j\\sum_i|a_{ij}|,\\quad \\|A\\|_\\infty=\\max_i\\sum_j|a_{ij}|,\\quad \\|A\\|_2=\\sigma_1,\\quad \\|A\\|_F=\\sqrt{\\textstyle\\sum_{ij}|a_{ij}|^2}",
          "note": "$\\|A\\|_1$ = máxima suma de columna; $\\|A\\|_\\infty$ = máxima suma de fila; $\\|A\\|_F=\\sqrt{\\sum_i\\sigma_i^2}$ (guía-07 pide 1, 2 y F)"
        }
      ]
    },
    {
      "title": "Espacios vectoriales y subespacios",
      "hint": "Base, dimensión, rango",
      "entries": [
        {
          "label": "Base y dimensión",
          "kind": "def",
          "tex": "B=\\{v_1,\\dots,v_n\\}\\ \\text{LI y generador};\\quad \\dim V=|B|"
        },
        {
          "label": "Test de LI por det",
          "kind": "method",
          "tex": "v_1,\\dots,v_n\\ \\text{LI}\\iff \\det(v_1\\mid\\cdots\\mid v_n)\\neq0",
          "cond": "$n$ vectores en $\\mathbb{R}^n$"
        },
        {
          "label": "Subespacio paramétrico",
          "kind": "def",
          "tex": "H=\\{x:Ax=0\\}=\\langle\\,\\text{soluciones libres}\\,\\rangle",
          "note": "Despejar variables pivote en función de las libres; cada libre da un generador"
        },
        {
          "label": "Coordenadas en base",
          "kind": "def",
          "tex": "v=\\sum_i \\alpha_i\\,b_i\\ \\Rightarrow\\ [v]_B=(\\alpha_1,\\dots,\\alpha_n)^T"
        },
        {
          "label": "Rango–nulidad",
          "kind": "theorem",
          "tex": "\\mathrm{rg}(A)+\\mathrm{nul}(A)=n",
          "cond": "$n$ = nº de columnas; $\\mathrm{nul}$ = $\\dim\\ker$"
        }
      ]
    },
    {
      "title": "Transformaciones lineales",
      "hint": "Núcleo, imagen, matriz asociada",
      "entries": [
        {
          "label": "Núcleo e imagen",
          "kind": "def",
          "tex": "N(T)=\\{v:T(v)=0\\},\\quad R(T)=\\{T(v):v\\in V\\}"
        },
        {
          "label": "Teorema de las dimensiones",
          "kind": "theorem",
          "tex": "\\dim V=\\dim N(T)+\\dim R(T)"
        },
        {
          "label": "Inyectividad",
          "kind": "theorem",
          "tex": "T\\ \\text{inyectiva}\\iff N(T)=\\{0\\}",
          "note": "Si $\\dim V=\\dim W$: inyectiva $\\iff$ sobreyectiva"
        },
        {
          "label": "Matriz asociada",
          "kind": "method",
          "tex": "M_{B_2B_1}(T)=\\big([T(b_1)]_{B_2}\\mid\\cdots\\mid[T(b_n)]_{B_2}\\big)",
          "note": "Columnas = imágenes de la base $B_1$ escritas en coords de $B_2$"
        },
        {
          "label": "Acción en coordenadas",
          "kind": "formula",
          "tex": "[T(v)]_{B_2}=M_{B_2B_1}(T)\\,[v]_{B_1}"
        },
        {
          "label": "Existencia/unicidad de TL",
          "kind": "theorem",
          "tex": "B\\ \\text{base}\\ \\Rightarrow\\ \\exists!\\,T\\ \\text{con}\\ T(b_i)=w_i",
          "cond": "Si los $v_i$ son LD: existe sólo si las $w_i$ respetan las mismas combinaciones; no es única"
        },
        {
          "label": "Cambio de base",
          "kind": "method",
          "tex": "P=M_{B_2B_1}(\\mathrm{id}),\\quad [v]_{B_2}=P\\,[v]_{B_1},\\quad [v]_{B_1}=P^{-1}[v]_{B_2}",
          "note": "Columna $j$ de $P$ = coords del $j$-ésimo vector de $B_1$ en la base $B_2$"
        }
      ]
    },
    {
      "title": "Autovalores y diagonalización",
      "hint": "Espectro, multiplicidades, $A=PDP^{-1}$",
      "entries": [
        {
          "label": "Autovalor / autovector",
          "kind": "def",
          "tex": "A\\,v=\\lambda\\,v,\\quad v\\neq 0"
        },
        {
          "label": "Polinomio característico",
          "kind": "def",
          "tex": "p_A(\\lambda)=\\det(\\lambda I-A)=0",
          "note": "Convención de la cátedra: coef. líder $+1$"
        },
        {
          "label": "Autoespacio",
          "kind": "formula",
          "tex": "S_\\lambda=\\ker(\\lambda I-A)=\\{v:(\\lambda I-A)v=0\\}"
        },
        {
          "label": "Multiplicidades",
          "kind": "def",
          "tex": "m_a(\\lambda)=\\text{orden en }p_A;\\quad m_g(\\lambda)=\\dim S_\\lambda",
          "note": "Siempre $1\\le m_g\\le m_a$"
        },
        {
          "label": "Radio espectral",
          "kind": "def",
          "tex": "\\rho(A)=\\max_i|\\lambda_i|",
          "note": "Mayor autovalor en módulo; controla estabilidad y $\\|A^k\\|$ (guía-05 lo pide explícito)"
        },
        {
          "label": "Criterio de diagonalización",
          "kind": "theorem",
          "tex": "A\\ \\text{diagonalizable}\\iff m_g(\\lambda_i)=m_a(\\lambda_i)\\ \\forall i",
          "cond": "Sobre $\\mathbb{R}$: además todos los $\\lambda_i$ reales"
        },
        {
          "label": "Diagonalización",
          "kind": "method",
          "tex": "A=PDP^{-1},\\quad D=\\mathrm{diag}(\\lambda_i),\\quad P=(v_1\\mid\\cdots\\mid v_n)",
          "note": "Orden de las columnas de $P$ = orden de los $\\lambda_i$ en $D$"
        },
        {
          "label": "Teorema espectral (simétrica real)",
          "kind": "theorem",
          "tex": "A=A^T\\ \\Rightarrow\\ A=PDP^T,\\quad P^TP=I,\\ D\\ \\text{diag. real}",
          "note": "Toda matriz simétrica real es ortogonalmente diagonalizable y sus autoespacios son ortogonales; sustenta la SVD vía $A^TA$"
        },
        {
          "label": "Traza y determinante",
          "kind": "theorem",
          "tex": "\\mathrm{tr}(A)=\\sum_i\\lambda_i,\\qquad \\det(A)=\\prod_i\\lambda_i"
        },
        {
          "label": "Autovalores distintos",
          "kind": "example",
          "tex": "\\lambda_i\\ \\text{todos distintos}\\ \\Rightarrow\\ A\\ \\text{diagonalizable}",
          "note": "Cada $\\lambda$ simple aporta 1 autovector LI; no hace falta chequear $m_g$"
        },
        {
          "label": "Semejanza",
          "kind": "caution",
          "tex": "A\\sim B\\iff B=P^{-1}AP",
          "note": "Matrices semejantes comparten $p_A$, espectro, traza y det"
        }
      ]
    },
    {
      "title": "Factorización LU / PLU",
      "hint": "Doolittle, resolver $Ax=b$ barato",
      "entries": [
        {
          "label": "Idea: invertir sin invertir",
          "kind": "method",
          "tex": "Ax=b\\ \\Rightarrow\\ Lz=b\\ \\text{(adelante)},\\ Ux=z\\ \\text{(atrás)}",
          "note": "$A^{-1}=\\mathrm{adj}(A)/\\det(A)$ es $\\mathcal{O}(n!)$; LU es $\\mathcal{O}(n^2)$ por sistema"
        },
        {
          "label": "LU (Doolittle)",
          "kind": "def",
          "tex": "A=LU,\\quad L\\ \\text{triang. inf. con}\\ \\ell_{ii}=1,\\ U\\ \\text{triang. sup.}"
        },
        {
          "label": "Multiplicadores",
          "kind": "method",
          "tex": "m_{ij}=\\frac{a^{(j)}_{ij}}{a^{(j)}_{jj}}\\ \\Rightarrow\\ F_i'=F_i-m_{ij}F_j",
          "note": "Los $m_{ij}$ se guardan en $L$ (posición $i,j$); $U$ queda al escalonar"
        },
        {
          "label": "PLU",
          "kind": "theorem",
          "tex": "PA=LU",
          "cond": "$A$ regular; $P$ permuta filas cuando aparece pivote nulo"
        },
        {
          "label": "Resolver con PLU",
          "kind": "formula",
          "tex": "Ax=b\\ \\Rightarrow\\ PAx=Pb\\ \\Rightarrow\\ Lz=Pb,\\ Ux=z"
        },
        {
          "label": "Matriz de permutación",
          "kind": "def",
          "tex": "E\\,A\\ \\text{permuta filas};\\quad A\\,E\\ \\text{permuta columnas}",
          "note": "$P=E_k\\cdots E_2E_1$ acumula las permutaciones aplicadas"
        }
      ]
    },
    {
      "title": "Factorización QR (Gram–Schmidt)",
      "hint": "Base ortonormal de las columnas",
      "entries": [
        {
          "label": "QR",
          "kind": "def",
          "tex": "A=QR,\\quad Q^TQ=I,\\quad R\\ \\text{triang. sup.}"
        },
        {
          "label": "Gram–Schmidt",
          "kind": "method",
          "tex": "u_k=a_k-\\sum_{j<k}\\langle a_k,v_j\\rangle\\,v_j,\\qquad v_k=\\frac{u_k}{\\|u_k\\|}",
          "note": "$u_1=a_1$; tomar las columnas LI de $A$ en orden"
        },
        {
          "label": "Cálculo de $R$",
          "kind": "formula",
          "tex": "R=Q^TA",
          "note": "$R_{kk}=\\|u_k\\|$, $R_{jk}=\\langle a_k,v_j\\rangle$ para $j<k$"
        },
        {
          "label": "Matriz ortogonal",
          "kind": "theorem",
          "tex": "A\\ \\text{ortogonal}\\iff \\text{columnas = base ortonormal}\\ \\Rightarrow\\ A^{-1}=A^T"
        },
        {
          "label": "Completar $Q$ cuadrada",
          "kind": "method",
          "tex": "v_{k+1},\\dots,v_n\\ \\bot\\ \\{v_1,\\dots,v_k\\}",
          "note": "En $\\mathbb{R}^3$: producto vectorial $v_3=v_1\\times v_2$ normalizado"
        },
        {
          "label": "Resolver con QR",
          "kind": "formula",
          "tex": "Ax=b\\ \\Rightarrow\\ z=Q^Tb,\\quad Rx=z",
          "note": "Solo backward substitution sobre $R$"
        }
      ]
    },
    {
      "title": "SVD y pseudoinversa",
      "hint": "Generaliza la diagonalización",
      "entries": [
        {
          "label": "Teorema SVD",
          "kind": "theorem",
          "tex": "A=U\\,\\Sigma\\,V^T,\\quad U,V\\ \\text{ortogonales},\\ \\Sigma\\ \\text{diag. rectangular}",
          "cond": "En $\\mathbb{C}$: $A=U\\Sigma V^*$"
        },
        {
          "label": "Valores singulares",
          "kind": "def",
          "tex": "\\sigma_i=\\sqrt{\\lambda_i(A^TA)},\\quad \\sigma_1\\ge\\sigma_2\\ge\\dots\\ge 0"
        },
        {
          "label": "Relaciones clave",
          "kind": "formula",
          "tex": "A^TA=V\\Sigma^T\\Sigma\\,V^T,\\qquad AA^T=U\\Sigma\\Sigma^T U^T",
          "note": "$V$ = autovectores de $A^TA$; $U$ = autovectores de $AA^T$ (ambas simétricas $\\Rightarrow$ teorema espectral)"
        },
        {
          "label": "Receta (vía $A^TA$)",
          "kind": "method",
          "tex": "\\begin{aligned}&1)\\ \\lambda_i,\\,v_i\\ \\text{de }A^TA,\\ \\text{normalizar}\\to V\\\\&2)\\ u_i=\\frac{A\\,v_i}{\\sigma_i}\\ (i\\le r),\\ \\text{completar base}\\to U\\end{aligned}",
          "note": "Conviene diagonalizar la más chica entre $A^TA$ y $AA^T$"
        },
        {
          "label": "Ecuaciones de acoplamiento",
          "kind": "formula",
          "tex": "A\\,v_i=\\sigma_i\\,u_i,\\qquad A^T u_i=\\sigma_i\\,v_i\\quad(i=1,\\dots,r)"
        },
        {
          "label": "Pseudoinversa (SVD)",
          "kind": "formula",
          "tex": "A^+=V\\,\\Sigma^+\\,U^T",
          "note": "Si $A$ es $n\\times m$, entonces $\\Sigma$ es $n\\times m$ y $\\Sigma^+$ es $m\\times n$ (¡cambian las dimensiones!): se forma transponiendo $\\Sigma$ y reemplazando cada $\\sigma_i\\to 1/\\sigma_i$ en la diagonal (los ceros quedan ceros). Ojo en un $4\\times3$: $\\Sigma^+$ es $3\\times4$"
        },
        {
          "label": "Datos vía SVD",
          "kind": "theorem",
          "tex": "\\mathrm{rg}(A)=\\#\\{\\sigma_i>0\\};\\quad \\|A\\|_2=\\sigma_1;\\quad \\|A\\|_F=\\sqrt{\\textstyle\\sum_i\\sigma_i^2}"
        },
        {
          "label": "Definida positiva",
          "kind": "example",
          "tex": "X^TAX>0\\ \\forall X\\neq0\\ \\Rightarrow\\ \\text{todos los}\\ \\lambda>0",
          "note": "$A^TA$ siempre es semidefinida positiva $\\Rightarrow \\lambda_i\\ge0$"
        }
      ]
    },
    {
      "title": "Mínimos cuadrados",
      "hint": "Ajuste por ecuaciones normales",
      "entries": [
        {
          "label": "Planteo",
          "kind": "method",
          "tex": "\\min_X \\|AX-B\\|^2,\\quad A=\\text{(diseño)},\\ B=\\text{(datos)}",
          "note": "Para recta $y=ax+b$: columnas de $A$ son $(x_i)$ y $(1)$"
        },
        {
          "label": "Ecuaciones normales",
          "kind": "theorem",
          "tex": "A^TA\\,X=A^TB"
        },
        {
          "label": "Solución (pseudoinversa)",
          "kind": "formula",
          "tex": "X=(A^TA)^{-1}A^TB=A^+B",
          "cond": "$\\det(A^TA)\\neq0$ (columnas de $A$ LI)"
        },
        {
          "label": "Modelos lineales en parámetros",
          "kind": "example",
          "tex": "y=a_0+a_1\\cos x+a_2\\cos 2x;\\quad y=a_2x^2+a_1x+a_0",
          "note": "Cada función base es una columna de $A$; el método es siempre el mismo"
        },
        {
          "label": "Vía QR (estable)",
          "kind": "method",
          "tex": "A=QR\\ \\Rightarrow\\ Rx=Q^TB",
          "note": "Evita formar $A^TA$ (peor condicionado)"
        }
      ]
    },
    {
      "title": "Series de Fourier",
      "hint": "Trigonométrica, laboratorio y exponencial",
      "entries": [
        {
          "label": "Serie trigonométrica",
          "kind": "def",
          "tex": "f(t)=a_0+\\sum_{n\\ge1} a_n\\cos\\!\\big(\\tfrac{2\\pi n t}{T}\\big)+\\sum_{n\\ge1} b_n\\sin\\!\\big(\\tfrac{2\\pi n t}{T}\\big)"
        },
        {
          "label": "Coeficientes (cátedra)",
          "kind": "formula",
          "tex": "a_0=\\tfrac1T\\!\\int_T\\! f,\\quad a_n=\\tfrac2T\\!\\int_T\\! f\\cos\\tfrac{2\\pi nt}{T},\\quad b_n=\\tfrac2T\\!\\int_T\\! f\\sin\\tfrac{2\\pi nt}{T}",
          "note": "$a_0$ es el valor medio; integrar sobre cualquier intervalo de longitud $T$"
        },
        {
          "label": "Forma de laboratorio (amplitud–fase)",
          "kind": "formula",
          "tex": "f(t)=a_0+\\sum_{n\\ge1} A_n\\cos\\!\\Big(\\tfrac{2\\pi n t}{T}-\\varphi_n\\Big),\\quad A_n=\\sqrt{a_n^2+b_n^2},\\quad \\tan\\varphi_n=\\tfrac{b_n}{a_n}",
          "note": "Interpretar $a_n=A_n\\cos\\varphi_n$, $b_n=A_n\\sin\\varphi_n$ para fijar el cuadrante de $\\varphi_n$ (no usar sólo $\\arctan$). Contenido evaluado (IIP I y III)"
        },
        {
          "label": "Serie exponencial",
          "kind": "def",
          "tex": "f(t)=\\sum_{n\\in\\mathbb{Z}} c_n\\,e^{\\,i\\frac{2\\pi n t}{T}},\\qquad c_n=\\frac1T\\int_T f(t)\\,e^{-i\\frac{2\\pi n t}{T}}\\,dt"
        },
        {
          "label": "Relación trig ↔ exp",
          "kind": "formula",
          "tex": "a_0=c_0,\\quad a_n=c_n+c_{-n},\\quad b_n=i\\,(c_n-c_{-n})"
        },
        {
          "label": "Período de una suma de sinusoides",
          "kind": "method",
          "tex": "T=\\mathrm{m.c.m.}(T_1,\\dots,T_k),\\quad \\omega_0=\\tfrac{2\\pi}{T}",
          "note": "Cada sinusoide $\\cos(\\omega_i t)$ tiene $T_i=2\\pi/\\omega_i$. Si NO existe m.c.m. (cociente irracional, p. ej. $\\cos(\\sqrt2\\,t)$, o $\\cos(\\sqrt{2\\pi}t)+\\cos(\\sqrt2\\,t)$) la función NO es periódica (guía-08 Ej. 1)"
        },
        {
          "label": "Simetrías ($f$ real)",
          "kind": "theorem",
          "tex": "c_{-n}=\\overline{c_n};\\ \\text{par}\\Rightarrow b_n=0,\\,c_n\\in\\mathbb{R};\\ \\text{impar}\\Rightarrow a_n=0,\\,c_n\\ \\text{imag. puro}"
        },
        {
          "label": "Convergencia (Dirichlet)",
          "kind": "theorem",
          "tex": "S(t_0)=\\tfrac12\\big(f(t_0^+)+f(t_0^-)\\big)",
          "note": "En continuidad converge a $f(t_0)$; en un salto, al promedio"
        },
        {
          "label": "Derivación / integración",
          "kind": "formula",
          "tex": "f'\\!:\\ d_n=i\\tfrac{2\\pi n}{T}\\,c_n;\\qquad \\textstyle\\int f\\!:\\ g_n=\\big(i\\tfrac{2\\pi n}{T}\\big)^{-1}c_n"
        },
        {
          "label": "Parseval (potencia)",
          "kind": "theorem",
          "tex": "\\frac1T\\int_T |f(t)|^2\\,dt=\\sum_{n\\in\\mathbb{Z}}|c_n|^2"
        },
        {
          "label": "Sumas notables (vía Parseval/serie)",
          "kind": "example",
          "tex": "\\sum_{n\\ge1}\\tfrac1{n^2}=\\tfrac{\\pi^2}{6},\\quad \\sum_{k\\ge0}\\tfrac1{(2k+1)^2}=\\tfrac{\\pi^2}{8},\\quad \\sum_{n\\ge1}\\tfrac1{n^6}=\\tfrac{\\pi^6}{945}",
          "note": "Típicas en el inciso b) de identidades: evaluar la serie en un punto (Dirichlet) o aplicar Parseval (guía-08 Ej. 12 y 14)"
        },
        {
          "label": "Gibbs",
          "kind": "example",
          "tex": "\\text{en un salto, las sumas parciales hacen overshoot}\\ \\approx 9\\%",
          "note": "No desaparece al aumentar armónicos; se desplaza hacia la discontinuidad"
        }
      ]
    },
    {
      "title": "Transformada de Fourier (continua)",
      "hint": "Espectro de señales aperiódicas",
      "entries": [
        {
          "label": "Definición",
          "kind": "def",
          "tex": "F(\\omega)=\\mathcal{F}\\{f\\}=\\int_{-\\infty}^{\\infty} f(t)\\,e^{-i\\omega t}\\,dt"
        },
        {
          "label": "Decaimiento causal",
          "kind": "formula",
          "tex": "f(t)=e^{-at}\\,u(t)\\ \\Rightarrow\\ F(\\omega)=\\frac{1}{a+i\\omega}",
          "cond": "$a>0$"
        },
        {
          "label": "Pulso rectangular",
          "kind": "formula",
          "tex": "f(t)=\\mathbb{1}_{|t|\\le a/2}\\ \\Rightarrow\\ F(\\omega)=a\\,\\mathrm{sinc}\\!\\Big(\\tfrac{\\omega a}{2}\\Big)=\\tfrac{2\\sin(\\omega a/2)}{\\omega}"
        },
        {
          "label": "Triángulo",
          "kind": "formula",
          "tex": "\\Lambda_n(t)=\\tfrac{n-|t|}{n^2}\\ \\Rightarrow\\ F(\\omega)=\\mathrm{sinc}^2\\!\\Big(\\tfrac{\\omega n}{2}\\Big)",
          "note": "El triángulo = convolución de dos pulsos $\\Rightarrow$ sinc²"
        },
        {
          "label": "Producto por $t$ (deriv. en frec.)",
          "kind": "formula",
          "tex": "t\\,f(t)\\ \\xleftrightarrow{\\ \\mathcal{F}\\ }\\ i\\,\\tfrac{d}{d\\omega}F(\\omega)",
          "note": "P. ej. $t\\,e^{-t}u(t)\\Rightarrow F(\\omega)=\\tfrac{1}{(1+i\\omega)^2}$ (IIP VI)"
        },
        {
          "label": "Gaussiana (autofunción)",
          "kind": "formula",
          "tex": "f(t)=e^{-t^2}\\ \\Rightarrow\\ F(\\omega)=\\sqrt{\\pi}\\,e^{-\\omega^2/4}",
          "note": "Su TF es otra gaussiana"
        },
        {
          "label": "Par sinc ↔ pulso",
          "kind": "example",
          "tex": "f(t)=\\tfrac{\\sin(\\pi t)}{\\pi t}\\ \\Rightarrow\\ X_c(f)=\\mathbb{1}_{|f|\\le 0.5}",
          "note": "Dualidad: sinc en tiempo $\\to$ pulso en frecuencia"
        },
        {
          "label": "Integración directa",
          "kind": "method",
          "tex": "\\int_0^\\infty e^{-(a+i\\omega)t}dt=\\frac{1}{a+i\\omega}",
          "cond": "Converge si $\\mathrm{Re}(a+i\\omega)>0$; graficar módulo $|F|$ y fase $\\arg F$"
        }
      ]
    },
    {
      "title": "EDO/EDP: diferencias finitas implícitas",
      "hint": "Euler implícito: sistema EDO, calor y convección–difusión",
      "entries": [
        {
          "label": "EDO 2.º orden → sistema 1.º",
          "kind": "method",
          "tex": "x''=g(t,x,x')\\ \\Rightarrow\\ \\begin{cases}x_1'=x_2\\\\ x_2'=g\\end{cases},\\quad x_1=x,\\ x_2=x'",
          "note": "Vector de estado $\\mathbf x=(x_1,x_2)^T$. Cond. iniciales $\\Rightarrow$ se cargan en $\\mathbf x^0=(x(0),\\,x'(0))^T$ (un solo vector arranca Euler implícito)"
        },
        {
          "label": "Euler implícito (atrás)",
          "kind": "def",
          "tex": "\\dot{\\mathbf u}\\approx\\frac{\\mathbf u^{k+1}-\\mathbf u^k}{\\Delta t}\\ \\text{evaluando }F\\ \\text{en }k+1"
        },
        {
          "label": "Implícito sobre el sistema $\\dot{\\mathbf x}=M\\mathbf x+\\mathbf f$",
          "kind": "formula",
          "tex": "\\frac{\\mathbf x^{k+1}-\\mathbf x^{k}}{\\Delta t}=M\\,\\mathbf x^{k+1}+\\mathbf f(t_{k+1})\\ \\Rightarrow\\ (I-\\Delta t\\,M)\\,\\mathbf x^{k+1}=\\mathbf x^{k}+\\Delta t\\,\\mathbf f(t_{k+1})",
          "note": "Caso Duffing / oscilador amortiguado (finales I/II/III): se resuelve un sistema $2\\times2$ por paso; con $\\mathbf x^0=(c,c)^T$ se itera $k=0,1,2,\\dots$"
        },
        {
          "label": "Calor $u_t=u_{xx}$ (simétrico)",
          "kind": "formula",
          "tex": "-r\\,u_{i-1}^{k+1}+(1+2r)\\,u_i^{k+1}-r\\,u_{i+1}^{k+1}=u_i^k,\\quad r=\\tfrac{\\Delta t}{h^2}",
          "note": "Malla con 4 nodos internos: $h=1/5$. Tridiagonal SIMÉTRICA $-r,\\,1+2r,\\,-r$"
        },
        {
          "label": "Convección–difusión $u_t=u_{xx}+u_x$",
          "kind": "formula",
          "tex": "(s-r)\\,u_{i-1}^{k+1}+(1+2r)\\,u_i^{k+1}-(r+s)\\,u_{i+1}^{k+1}=u_i^k,\\quad r=\\tfrac{\\Delta t}{h^2},\\ s=\\tfrac{\\Delta t}{2h}",
          "note": "$u_x\\approx\\tfrac{u_{i+1}-u_{i-1}}{2h}$. Tridiagonal NO simétrica: subdiag $s-r$, diag $1+2r$, superdiag $-(r+s)$. Con $s=0$ se recupera el calor (IIP VI)"
        },
        {
          "label": "Sistema tridiagonal",
          "kind": "formula",
          "tex": "M\\,\\mathbf u^{k+1}=\\mathbf u^k",
          "note": "Calor: $M=\\mathrm{tridiag}(-r,\\,1+2r,\\,-r)$. Conv.–difusión: $M=\\mathrm{tridiag}(s-r,\\,1+2r,\\,-(r+s))$"
        },
        {
          "label": "Borde Dirichlet",
          "kind": "caution",
          "tex": "u_0=u_5=0\\ \\Rightarrow\\ \\text{esos términos salen del sistema}",
          "note": "Homogéneo: incógnitas = 4 nodos internos $\\Rightarrow$ sistema $4\\times4$"
        },
        {
          "label": "Borde Neumann ($u_x=0$)",
          "kind": "method",
          "tex": "\\text{central }u_{-1}=u_1\\ \\Rightarrow\\ (1+2r)\\,u_0-2r\\,u_1=u_0^k",
          "note": "Nodo fantasma: los términos en $s$ se CANCELAN ($(s-r)-(r+s)=-2r$), igual que el calor puro. El borde Neumann pasa a ser INCÓGNITA $\\Rightarrow$ el sistema crece a $5\\times5$ (IIP VI b)"
        },
        {
          "label": "Estabilidad incondicional",
          "kind": "theorem",
          "tex": "M\\ \\text{diag. dominante}\\ (1+2r>2r)\\ \\Rightarrow\\ \\text{inversible }\\forall r>0",
          "note": "$M$ es constante en el tiempo: se factoriza (LU/Thomas) UNA sola vez y se reusa en cada paso $M\\mathbf u^{k+1}=\\mathbf u^k$"
        }
      ]
    }
  ]
};

export const mnaConceptos: Sheet = {
  "vault": "mna",
  "kind": "conceptos",
  "title": "Métodos Numéricos Avanzados",
  "subtitle": "Álgebra lineal numérica: complejos, espacios, TL, diagonalización, LU/QR/SVD y Fourier",
  "notation": "$\\mathbb{K}=\\mathbb{R}$ o $\\mathbb{C}$; $\\langle\\cdot,\\cdot\\rangle$ producto interno; $A^T$ transpuesta, $A^*=\\overline{A^T}$ traspuesta conjugada (adjunta); $\\|\\cdot\\|_2$ norma euclídea; $[v]_B$ coordenadas en base $B$; $M_{B_2B_1}(T)$ matriz asociada; $\\sigma_i$ valores singulares; $\\rho(A)$ radio espectral; $\\sin$ = seno (la cátedra escribe $\\operatorname{sen}$); $\\omega_0=2\\pi/T$ frecuencia fundamental.",
  "updated": "2026-06-19",
  "groups": [
    {
      "title": "Números complejos",
      "hint": "Unidad I: cuerpo no ordenado, forma polar, De Moivre, raíces, log",
      "entries": [
        {
          "label": "Número complejo",
          "kind": "def",
          "body": "$z=a_z+i\\,b_z$ con $a_z=\\mathrm{Re}(z)$, $b_z=\\mathrm{Im}(z)$ y $i^2=-1$. El conjunto $\\mathbb{C}=\\{a+ib:a,b\\in\\mathbb{R}\\}=\\mathbb{R}+i\\mathbb{R}$ es un cuerpo con la suma y el producto usuales.",
          "note": "$i^{2n}=(-1)^n$, $i^{2n+1}=(-1)^n i$."
        },
        {
          "label": "$\\mathbb{C}$ es cuerpo no ordenado",
          "kind": "caution",
          "body": "No existe orden en $\\mathbb{C}$ que cumpla los axiomas de orden de $\\mathbb{R}$ (tricotomía, monotonía respecto a suma y producto). No tiene sentido escribir $z_1<z_2$ en $\\mathbb{C}$.",
          "note": "Sí se comparan los módulos $|z_1|$ y $|z_2|$, que son reales."
        },
        {
          "label": "Módulo y conjugado",
          "kind": "formula",
          "body": "$|z|=\\sqrt{a_z^2+b_z^2}$, $\\bar z=a_z-i\\,b_z$. Vale $z\\bar z=|z|^2$, $z+\\bar z=2\\,\\mathrm{Re}(z)$, $z-\\bar z=2i\\,\\mathrm{Im}(z)$, $|z\\,w|=|z||w|$, $\\overline{z+w}=\\bar z+\\bar w$.",
          "note": "$z^{-1}=\\bar z/|z|^2$."
        },
        {
          "label": "Forma polar",
          "kind": "def",
          "body": "$z=\\rho\\,e^{i\\theta}=\\rho(\\cos\\theta+i\\sin\\theta)$ con $\\rho=|z|$, $\\theta=\\arg(z)$. Igualdad: $z=w\\iff\\rho_z=\\rho_w$ y $\\theta_z=\\theta_w+2k\\pi$.",
          "note": "Euler: $e^{i\\theta}=\\cos\\theta+i\\sin\\theta$. (La cátedra escribe $\\operatorname{sen}$.)"
        },
        {
          "label": "De Moivre / potenciación",
          "kind": "theorem",
          "tex": "z^n=\\rho^n e^{i n\\theta}=\\rho^n\\big(\\cos(n\\theta)+i\\,\\sin(n\\theta)\\big),\\quad n\\in\\mathbb{N}",
          "cond": "En polar el producto multiplica módulos y suma argumentos: $\\arg(zw)=\\arg z+\\arg w$, $|zw|=|z||w|$."
        },
        {
          "label": "Raíces $n$-ésimas",
          "kind": "formula",
          "body": "Las $n$ soluciones de $w^n=z$ son $w_k=\\sqrt[n]{\\rho}\\,e^{i(\\theta+2k\\pi)/n}$, $k=0,\\dots,n-1$ (vértices de un polígono regular de $n$ lados sobre la circunferencia de radio $\\sqrt[n]{\\rho}$). En trigonométrica: $w_k=\\sqrt[n]{\\rho}\\big(\\cos\\tfrac{\\theta+2k\\pi}{n}+i\\sin\\tfrac{\\theta+2k\\pi}{n}\\big)$.",
          "cond": "$z=\\rho e^{i\\theta}$, $z\\neq0$."
        },
        {
          "label": "Logaritmo complejo",
          "kind": "formula",
          "body": "$e^w=z$ tiene infinitas soluciones $w_k=\\ln|z|+i(\\arg z+2k\\pi)$, $k\\in\\mathbb{Z}$. Valor principal: $w_0=\\ln|z|+i\\arg z$. Potencia: $z^w=e^{w\\ln z}$.",
          "note": "Multivaluado: por eso $z^w$ también lo es."
        }
      ]
    },
    {
      "title": "Vectores, producto interno y normas",
      "hint": "Unidad II: $\\mathbb{K}^n$, PI, normas $p$, ángulo, ortogonalidad",
      "entries": [
        {
          "label": "Producto interno",
          "kind": "def",
          "body": "$\\langle\\cdot,\\cdot\\rangle:V\\times V\\to\\mathbb{K}$ con positividad ($\\langle u,u\\rangle\\geq0$, $=0\\iff u=0$). En $\\mathbb{R}$: bilineal y simétrico $\\langle u,v\\rangle=\\langle v,u\\rangle$. En $\\mathbb{C}$: SESQUILINEAL — lineal en el 1.º argumento, conjugado-lineal en el 2.º, con simetría hermítica $\\langle u,v\\rangle=\\overline{\\langle v,u\\rangle}$.",
          "note": "Hermítico $\\Rightarrow$ sesquilineal, NO bilineal (la conjugación en el 2.º arg. rompe la linealidad)."
        },
        {
          "label": "Convención de la cátedra (PI)",
          "kind": "caution",
          "body": "El slide (teoria/02-vectores) define $\\langle u,v\\rangle=\\sum_i u_i v_i$ SIN conjugación y con simetría común $\\langle u,v\\rangle=\\langle v,u\\rangle$, tanto en $\\mathbb{R}^n$ como en $\\mathbb{C}^n$. La versión hermítica $\\sum u_i\\overline{v_i}$ es la estándar, pero si el corrector sigue el slide, usá la real para no perder puntos.",
          "note": "$\\mathbb{R}^n$: $\\langle u,v\\rangle=\\sum u_i v_i$ (ambas convenciones coinciden)."
        },
        {
          "label": "Cauchy–Schwarz",
          "kind": "theorem",
          "body": "$|\\langle u,v\\rangle|^2\\leq\\langle u,u\\rangle\\,\\langle v,v\\rangle$, con igualdad sii $u\\parallel v$. Garantiza que $\\cos\\alpha_{uv}$ esté en $[-1,1]$ y, junto con la homogeneidad, implica la desigualdad triangular de la norma inducida.",
          "note": "El slide la transcribe con exponente 2 a ambos lados; la forma usual es la de arriba."
        },
        {
          "label": "Norma euclídea y ángulo",
          "kind": "def",
          "body": "$\\|u\\|_2=\\sqrt{\\langle u,u\\rangle}$ (norma inducida por el PI). Ángulo: $\\cos\\alpha_{uv}=\\dfrac{\\langle u,v\\rangle}{\\|u\\|_2\\|v\\|_2}$, $0\\leq\\alpha_{uv}\\leq\\pi$.",
          "note": "Pitágoras: si $u\\perp v$, $\\|u+v\\|_2^2=\\|u\\|_2^2+\\|v\\|_2^2$."
        },
        {
          "label": "Normas $p$",
          "kind": "def",
          "body": "$\\|v\\|_1=\\sum_i|v_i|$, $\\|v\\|_p=(\\sum_i|v_i|^p)^{1/p}$, $\\|v\\|_\\infty=\\max_i|v_i|$. Toda norma cumple positividad, homogeneidad $\\|\\lambda v\\|=|\\lambda|\\|v\\|$ y desigualdad triangular $\\|u+v\\|\\leq\\|u\\|+\\|v\\|$.",
          "cond": "$\\|\\cdot\\|_2$ es el caso $p=2$; en dimensión finita todas las normas son equivalentes."
        },
        {
          "label": "Paralelismo y perpendicularidad",
          "kind": "def",
          "body": "$u\\parallel v$ si $\\exists k:\\,v=ku$. $u\\perp v$ (no nulos) si $\\langle u,v\\rangle=0$. Perpendicularidad generaliza al PI abstracto el concepto geométrico.",
          "note": "$\\langle u,v\\rangle=0$ con $u,v\\neq0$ define ortogonalidad."
        }
      ]
    },
    {
      "title": "Matrices: operaciones y clasificación",
      "hint": "Producto, transpuesta, adjunta y matrices con nombre propio",
      "entries": [
        {
          "label": "Producto matricial",
          "kind": "formula",
          "body": "$C=AB$ con $c_{ij}=\\sum_k a_{ik}b_{kj}=\\langle F_i^A,C_j^B\\rangle$ (fila $i$ de $A$ por columna $j$ de $B$). Requiere columnas de $A$ = filas de $B$.",
          "note": "En general $AB\\neq BA$; puede existir $AB$ y no $BA$."
        },
        {
          "label": "Transpuesta, adjunta e inversa",
          "kind": "theorem",
          "body": "$(A^T)^T=A$, $(AB)^T=B^T A^T$. Adjunta (conjugada traspuesta) $A^*=\\overline{A^T}$, con $(AB)^*=B^*A^*$. $A$ invertible si $\\exists A^{-1}:AA^{-1}=A^{-1}A=I$; entonces $(AB)^{-1}=B^{-1}A^{-1}$ y $(A^{-1})^{-1}=A$.",
          "note": "Cuidado con el orden: la inversa/transpuesta/adjunta de un producto invierte el orden de los factores."
        },
        {
          "label": "Triangular / diagonal / escalar",
          "kind": "def",
          "body": "Triangular superior: $a_{ij}=0\\;\\forall i>j$; inferior: $a_{ij}=0\\;\\forall i<j$. Diagonal: $a_{ij}=0\\;\\forall i\\neq j$. Escalar: $A=kI_n$. El determinante de una triangular (o diagonal) es el producto de la diagonal.",
          "note": "Los productos/sustituciones con triangulares cuestan $\\mathcal{O}(n^2)$: razón de ser de LU y QR."
        },
        {
          "label": "Simétrica / antisimétrica",
          "kind": "def",
          "body": "Simétrica: $A=A^T$ ($a_{ij}=a_{ji}$). Antisimétrica: $A=-A^T$ ($a_{ij}=-a_{ji}$, diagonal nula). $A+A^T$ siempre es simétrica y $A-A^T$ antisimétrica.",
          "cond": "En $\\mathbb{C}$: hermítica $A=A^*$, antihermítica $A=-A^*$ (los elementos diagonales de una hermítica son reales)."
        },
        {
          "label": "Ortogonal / unitaria",
          "kind": "def",
          "body": "$A\\in\\mathbb{R}^{n\\times n}$ es ortogonal si $AA^T=A^TA=I_n$, equivalentemente sus columnas forman una base ortonormal de $\\mathbb{R}^n$. Entonces $A^{-1}=A^T$. Análogo complejo: $A$ unitaria si $A^*A=AA^*=I$ ($A^{-1}=A^*$).",
          "note": "Las ortogonales/unitarias preservan el PI y la norma ($\\|Av\\|_2=\\|v\\|_2$) y tienen $|\\det A|=1$: son numéricamente estables (no amplifican errores)."
        },
        {
          "label": "Matriz normal",
          "kind": "def",
          "body": "$A$ es normal si conmuta con su adjunta: $AA^*=A^*A$. Engloba a las hermíticas/simétricas, antihermíticas y unitarias/ortogonales. Teorema espectral general: $A$ es normal $\\iff$ es unitariamente diagonalizable ($A=UDU^*$ con $U$ unitaria).",
          "note": "Las normales tienen autovectores ortogonales; es la clase exacta que admite BON de autovectores."
        },
        {
          "label": "Idempotente / involutiva / nilpotente",
          "kind": "def",
          "body": "Idempotente: $A^2=A$ (luego $A^n=A$; sus autovalores son $0$ o $1$; ej.: proyectores). Involutiva: $A^2=I$ (luego $A^{-1}=A$; autovalores $\\pm1$). Nilpotente: $A^{n_0}=0$ para algún $n_0$ (índice de nilpotencia; todos sus autovalores son $0$).",
          "note": "Una nilpotente nunca es diagonalizable salvo $A=0$."
        }
      ]
    },
    {
      "title": "Determinantes y sistemas",
      "hint": "Forma multilineal alternada, Laplace, Sarrus, adjunta",
      "entries": [
        {
          "label": "Determinante",
          "kind": "def",
          "body": "Única forma multilineal alternada $f:\\mathbb{K}^{n\\times n}\\to\\mathbb{K}$ con $f(I_n)=1$. Multilineal por columnas, se anula si dos columnas son iguales o una es CL de las otras.",
          "note": "Notación $\\det A$, $|A|$, $D(A)$."
        },
        {
          "label": "Laplace y Sarrus",
          "kind": "formula",
          "body": "Laplace: $\\det A=\\sum_j a_{ij}A_{ij}$ con cofactor $A_{ij}=(-1)^{i+j}|M_{ij}|$ ($M_{ij}$ = menor). Sarrus ($3\\times3$): $a_{11}a_{22}a_{33}+a_{12}a_{23}a_{31}+a_{13}a_{21}a_{32}$ menos las tres antidiagonales.",
          "cond": "Sarrus solo vale para $3\\times3$. Conviene desarrollar Laplace por la fila/columna con más ceros."
        },
        {
          "label": "Propiedades del determinante",
          "kind": "theorem",
          "body": "$\\det A=\\det A^T$, $\\det(AB)=\\det A\\det B=\\det(BA)$, $\\det(A^{-1})=1/\\det A$, $\\det(\\lambda A)=\\lambda^n\\det A$. La operación $F_i\\to F_i-kF_j$ no cambia el determinante; intercambiar dos filas lo cambia de signo.",
          "note": "$\\det(A+B)\\neq\\det A+\\det B$ en general."
        },
        {
          "label": "Adjunta e inversa",
          "kind": "theorem",
          "body": "$A\\cdot\\mathrm{adj}(A)=\\det(A)\\,I$ con $\\mathrm{adj}(A)=C(A)^T$ (transpuesta de la de cofactores). De ahí $A^{-1}=\\dfrac{\\mathrm{adj}(A)}{\\det A}$.",
          "note": "Vía Laplace/adjunta cuesta $\\mathcal{O}(n!)$: motiva las factorizaciones LU/QR para resolver $AX=B$."
        },
        {
          "label": "Regularidad y sistemas $AX=B$",
          "kind": "method",
          "body": "$A$ regular $\\iff\\det A\\neq0$. Si $\\det A\\neq0$: solución única $X=A^{-1}B$. Homogéneo $AX=0$: $\\det A\\neq0\\Rightarrow$ solo trivial $X=0$; $\\det A=0\\Rightarrow$ infinitas soluciones (núcleo no trivial).",
          "cond": "Sistema cuadrado."
        }
      ]
    },
    {
      "title": "Espacios vectoriales y subespacios",
      "hint": "Axiomas, subespacio, CL, LI/LD, base, dimensión",
      "entries": [
        {
          "label": "Espacio vectorial",
          "kind": "def",
          "body": "Cuaterna $(V,+,\\mathbb{K},\\cdot)$ donde $(V,+)$ es grupo abeliano y la ley externa cumple distributividades, asociatividad mixta y unitariedad ($1\\cdot v=v$).",
          "note": "Ejemplos: $\\mathbb{R}^n$, $\\mathbb{K}^{n\\times m}$, $\\mathbb{P}_n$, $C[a,b]$."
        },
        {
          "label": "Verificar subespacio",
          "kind": "method",
          "body": "$S\\subseteq V$ es subespacio si es cerrado por suma ($s_1+s_2\\in S$) y por escalar ($\\lambda s\\in S$). Consecuencia necesaria: $0_V\\in S$.",
          "cond": "Atajo: si $0_V\\notin S$, NO es subespacio."
        },
        {
          "label": "No-subespacios típicos",
          "kind": "caution",
          "body": "$\\{x+y+z=1\\}$ (no pasa por el origen), $\\{x\\leq0\\}$ (no cerrado por $\\lambda<0$), $\\{\\det A=0\\}$ y $\\{\\det A\\neq0\\}$ (no cerrados por suma), $\\{\\mathrm{gr}(p)=2\\}$ (la suma puede bajar el grado).",
          "note": "Condiciones no homogéneas o no lineales rompen la clausura."
        },
        {
          "label": "LI / LD",
          "kind": "def",
          "body": "$\\{v_1,\\dots,v_n\\}$ es LI si $\\sum\\alpha_i v_i=0\\Rightarrow$ todos los $\\alpha_i=0$. Es LD si no: existe $\\alpha_k\\neq0$, es decir algún vector es CL de los otros.",
          "note": "En $\\mathbb{K}^n$: armar matriz; $\\det\\neq0\\Rightarrow$ LI (caso cuadrado)."
        },
        {
          "label": "Base y dimensión",
          "kind": "def",
          "body": "$B$ es base de $V$ si es LI y genera $V$. $\\dim V$ = cantidad de vectores de una base (no depende de la base elegida). Un generador no es base si es LD; un LI maximal es base.",
          "note": "Ej.: $\\dim\\mathbb{P}_2=3$, $\\dim\\mathbb{R}^{2\\times2}=4$."
        }
      ]
    },
    {
      "title": "Espacios euclídeos y Gram–Schmidt",
      "hint": "PI abstracto, BON, proyección, ortonormalización",
      "entries": [
        {
          "label": "PI en matrices y polinomios",
          "kind": "example",
          "body": "En $\\mathbb{R}^{n\\times m}$: $\\langle A,B\\rangle=\\mathrm{tr}(AB^T)$. En $\\mathbb{P}_n(\\mathbb{C})$ o $L^2$: $\\langle f,g\\rangle=\\int_a^b f(x)\\overline{g(x)}\\,dx$.",
          "note": "$L^2(\\mathbb{R})$: funciones de cuadrado integrable; PI con conjugación."
        },
        {
          "label": "Base ortonormal (BON)",
          "kind": "def",
          "body": "$\\{v_1,\\dots,v_n\\}$ con $\\|v_i\\|=1$ y $\\langle v_i,v_j\\rangle=0$ ($i\\neq j$). En una BON: $v=\\sum_k\\langle v,v_k\\rangle\\,v_k$ (coordenadas = proyecciones) y $\\|v\\|^2=\\sum_k|\\langle v,v_k\\rangle|^2$ (Parseval finito).",
          "cond": "Todo espacio euclídeo de dimensión finita tiene una BON (existencia vía Gram–Schmidt)."
        },
        {
          "label": "Proyección ortogonal",
          "kind": "formula",
          "body": "$P_v u=\\dfrac{\\langle u,v\\rangle}{\\langle v,v\\rangle}\\,v$: componente de $u$ en la dirección de $v$. Sobre un subespacio $S$ con BON $\\{q_i\\}$: $P_S u=\\sum_i\\langle u,q_i\\rangle q_i$. El residuo $u-P_S u$ es $\\perp S$.",
          "cond": "$v\\neq0$. $P_S u$ es el punto de $S$ más cercano a $u$ (base de mínimos cuadrados)."
        },
        {
          "label": "Gram–Schmidt",
          "kind": "method",
          "body": "Normalizar $u_1=v_1/\\|v_1\\|$; luego $\\tilde u_k=v_k-\\sum_{i<k}\\langle u_i,v_k\\rangle u_i$ (resto la proyección sobre lo ya ortonormalizado) y $u_k=\\tilde u_k/\\|\\tilde u_k\\|$. Produce una BON del subespacio generado.",
          "note": "Es el motor de la factorización QR. Si los $v_k$ son LD, algún $\\tilde u_k=0$ (se descarta)."
        }
      ]
    },
    {
      "title": "Transformaciones lineales",
      "hint": "Núcleo, imagen, teorema de dimensiones, matriz asociada",
      "entries": [
        {
          "label": "Inyectividad por núcleo",
          "kind": "theorem",
          "body": "$T:V\\to W$ lineal es inyectiva $\\iff N(T)=\\{0\\}$. Sobreyectiva si $R(T)=W$. Biyectiva = iny. + sobre.",
          "note": "El núcleo $N(T)=\\{v:T(v)=0\\}$ y la imagen $R(T)$ son subespacios (de $V$ y $W$ resp.)."
        },
        {
          "label": "Teorema de las dimensiones",
          "kind": "theorem",
          "tex": "\\dim V=\\dim N(T)+\\dim R(T)",
          "cond": "$V$ de dimensión finita. Corolario: si $\\dim V=\\dim W$, entonces $T$ inyectiva $\\iff$ sobreyectiva."
        },
        {
          "label": "TL definida por una base",
          "kind": "theorem",
          "body": "Dada una base $\\{v_1,\\dots,v_n\\}$ de $V$ y vectores $w_i\\in W$, existe una única TL con $T(v_i)=w_i$. Sobre datos LD debe respetarse la CL: si $v_3=v_1-v_2$ entonces $T(v_3)$ está forzado.",
          "cond": "Sobre base: existe y única; sobre conjunto LD: existe sii los datos son consistentes con las CL (y puede no ser única)."
        },
        {
          "label": "Coordenadas e isomorfismo",
          "kind": "def",
          "body": "$\\varphi:V\\to\\mathbb{K}^n$, $\\varphi(v)=[v]_B$ es isomorfismo. Por eso todo $\\mathbb{K}$-espacio de dimensión $n$ cumple $V\\cong\\mathbb{K}^n$.",
          "note": "Las coordenadas dependen de la base elegida."
        },
        {
          "label": "Matriz asociada $M_{B_2B_1}(T)$",
          "kind": "method",
          "body": "Columna $j$ = $[T(v_j)]_{B_2}$, con $\\{v_j\\}=B_1$. Cumple $[T(v)]_{B_2}=M_{B_2B_1}(T)\\,[v]_{B_1}$. Reduce la TL abstracta a multiplicar por una matriz.",
          "cond": "$B_1$ base del dominio, $B_2$ del codominio."
        },
        {
          "label": "Rango de una matriz",
          "kind": "def",
          "body": "$\\rho(A)$ = número de filas (o columnas) LI = $\\dim R(T)$. Cumple $\\rho(A)+\\mathrm{nulidad}(A)=n$ (n = columnas). Rango por filas = rango por columnas.",
          "note": "$\\rho$ NO es lineal: $\\rho(A+B)\\neq\\rho(A)+\\rho(B)$."
        }
      ]
    },
    {
      "title": "Cambio de base y semejanza",
      "hint": "Matriz de pasaje vía la identidad; invariantes",
      "entries": [
        {
          "label": "Matriz de cambio de base $P$",
          "kind": "method",
          "body": "Tomar $T=\\mathrm{id}$: $P=M_{B_2B_1}(\\mathrm{id})$ tiene por columnas $[v_j]_{B_2}$ con $v_j\\in B_1$. Entonces $[v]_{B_2}=P\\,[v]_{B_1}$ y $[v]_{B_1}=P^{-1}[v]_{B_2}$.",
          "note": "Expresar cada vector de $B_1$ en términos de $B_2$ y apilar coordenadas en columnas."
        },
        {
          "label": "Semejanza",
          "kind": "def",
          "body": "$B$ semejante a $A$ si $\\exists P$ regular con $B=P^{-1}AP$. Matrices semejantes comparten autovalores, determinante, traza, rango y polinomio característico (misma TL en bases distintas).",
          "note": "Diagonalizar = hallar $P$ que vuelva $A$ semejante a una diagonal."
        },
        {
          "label": "Invariantes: traza y determinante",
          "kind": "theorem",
          "body": "$\\mathrm{tr}(A)=\\sum_i\\lambda_i$ (suma de autovalores, con multiplicidad) y $\\det(A)=\\prod_i\\lambda_i$ (producto). Ambos son invariantes por semejanza: si $A=PDP^{-1}$, son la suma y el producto de la diagonal de $D$.",
          "cond": "Sale directo de $p_A(\\lambda)$ por Cardano-Vieta; se usa para chequear autovalores (guia-05 Ej.1b)."
        }
      ]
    },
    {
      "title": "Diagonalización",
      "hint": "Autovalores, autovectores, multiplicidades, radio espectral, criterio",
      "entries": [
        {
          "label": "Autovalor / autovector",
          "kind": "def",
          "body": "$v\\neq0$ es autovector de $A$ con autovalor $\\lambda$ si $Av=\\lambda v$. Se obtienen resolviendo $(\\lambda I-A)X=0$ con $X\\neq0$.",
          "note": "Matricialmente $AX=\\lambda X$ con $X=[v]_B$."
        },
        {
          "label": "Polinomio característico",
          "kind": "formula",
          "body": "$p_A(\\lambda)=\\det(\\lambda I-A)$. Sus raíces son los autovalores. El autoespacio $S_\\lambda=\\{X:(\\lambda I-A)X=0\\}=\\ker(\\lambda I-A)$ reúne los autovectores de $\\lambda$ (más el 0). El espectro es el conjunto de autovalores.",
          "cond": "Hallar autovalores = factorizar $p_A$."
        },
        {
          "label": "Radio espectral",
          "kind": "def",
          "body": "$\\rho(A)=\\max_i|\\lambda_i|$ = mayor módulo de los autovalores. Mide el 'tamaño' espectral de $A$ y controla la convergencia de métodos iterativos ($A^k\\to0\\iff\\rho(A)<1$).",
          "note": "No confundir con el rango $\\rho(A)$ del grupo de TL; aquí es radio espectral (guia-05 Ej.2)."
        },
        {
          "label": "Multiplicidad algebraica vs. geométrica",
          "kind": "def",
          "body": "MA = orden de $\\lambda$ como raíz de $p_A$. MG = $\\dim S_\\lambda$. Siempre $1\\leq\\mathrm{MG}\\leq\\mathrm{MA}$.",
          "note": "Calcular MG = escalonar $(\\lambda I-A)$ y contar variables libres ($\\mathrm{MG}=n-\\rho(\\lambda I-A)$)."
        },
        {
          "label": "Criterio de diagonalización",
          "kind": "theorem",
          "body": "$A\\in\\mathbb{K}^{n\\times n}$ es diagonalizable $\\iff$ sus autovectores forman una base de $\\mathbb{K}^n$ $\\iff$ MG = MA para todo autovalor. Entonces $A=PDP^{-1}$ con $P=(v_1|\\cdots|v_n)$ y $D=\\mathrm{diag}(\\lambda_i)$ (el orden de columnas de $P$ debe coincidir con el de $D$).",
          "cond": "$n$ autovalores distintos $\\Rightarrow$ siempre diagonalizable (suficiente, no necesario)."
        },
        {
          "label": "Teorema espectral (diag. ortogonal)",
          "kind": "theorem",
          "body": "$A\\in\\mathbb{R}^{n\\times n}$ simétrica $\\Rightarrow$ es diagonalizable ortogonalmente: $A=PDP^T$ con $P$ ortogonal ($P^{-1}=P^T$, autovectores ortonormales) y $D$ real. Autovalores reales; autovectores de autovalores distintos son ortogonales.",
          "cond": "En $\\mathbb{C}$: $A$ hermítica $\\Rightarrow A=UDU^*$, $U$ unitaria. Caso general: $A$ normal $\\iff$ unitariamente diagonalizable. Es la base del cálculo de la SVD vía $A^TA$."
        },
        {
          "label": "Diagonalización con parámetro",
          "kind": "example",
          "body": "Con parámetro $k$: factorizar $p_A(\\lambda;k)$, hallar $k$ que da autovalor repetido y chequear si en ese caso $\\dim S_\\lambda$ alcanza la MA. Si no la alcanza, NO diagonaliza.",
          "note": "Caso típico de IP Ej. 2."
        }
      ]
    },
    {
      "title": "Factorización LU / PLU",
      "hint": "Doolittle, multiplicadores, permutaciones",
      "entries": [
        {
          "label": "Idea: factorizar para no invertir",
          "kind": "method",
          "body": "$AX=B$ con $A^{-1}$ cuesta $\\mathcal{O}(n!)$ por adjunta. Factorizando $A=LU$ se resuelve $Ly=B$ (sustitución adelante) y $Ux=y$ (atrás) en $\\mathcal{O}(n^2)$, reaprovechando $L,U$ para muchos $B$.",
          "note": "$L$ triangular inferior, $U$ triangular superior."
        },
        {
          "label": "Algoritmo de Doolittle",
          "kind": "method",
          "body": "Eliminar hacia abajo con multiplicadores $m_{ij}=a_{ij}/a_{jj}$ (pivote). $U$ = matriz escalonada resultante; $L$ = identidad con los $m_{ij}$ guardados bajo la diagonal (unos en la diagonal de $L$).",
          "cond": "Requiere pivotes $a_{jj}\\neq0$ (en Doolittle se fija $\\ell_{ii}=1$)."
        },
        {
          "label": "PLU",
          "kind": "theorem",
          "body": "Si aparece pivote nulo (o chico) se permutan filas con matriz de permutación $E$ (a izquierda permuta filas). Toda $A$ regular admite $PA=LU$ con $P=E_k\\cdots E_1$ producto de las permutaciones. Se resuelve $Lz=Pb$, $Ux=z$.",
          "note": "$EA$ permuta filas, $AE$ permuta columnas. El pivoteo parcial (mayor pivote en módulo) mejora la estabilidad numérica."
        }
      ]
    },
    {
      "title": "Factorización QR",
      "hint": "Gram–Schmidt sobre columnas, $R=Q^TA$, inversas laterales",
      "entries": [
        {
          "label": "Construcción de $Q$ y $R$",
          "kind": "method",
          "body": "Aplicar Gram–Schmidt a las columnas LI de $A$: las $q_i$ ortonormales forman $Q$ ($Q^TQ=I$). Luego $R=Q^TA$ resulta triangular superior, con $R_{ii}=\\|\\tilde a_i\\|$ y $R_{ij}=\\langle q_i,a_j\\rangle$.",
          "cond": "$A=QR$ con $Q$ de columnas ortonormales."
        },
        {
          "label": "Forma reducida vs. completa",
          "kind": "def",
          "body": "Reducida: $Q$ con $k=\\mathrm{rango}$ columnas y $R$ de $k\\times m$. Completa: completar $Q$ a base ortonormal de $\\mathbb{R}^n$ (vía núcleo de $A^T$ o producto vectorial en $\\mathbb{R}^3$) y $R$ con filas de ceros abajo ($n\\times m$).",
          "note": "Resolver $Ax=b$: $z=Q^Tb$, luego $Rx=z$ (solo sustitución hacia atrás)."
        },
        {
          "label": "Estabilidad de QR",
          "kind": "theorem",
          "body": "Como $Q$ es ortogonal preserva la norma ($\\|Qz\\|_2=\\|z\\|_2$), QR no amplifica errores: $\\mathrm{cond}_2(R)=\\mathrm{cond}_2(A)$. Por eso para mínimos cuadrados QR es preferible a las ecuaciones normales, que usan $A^TA$ (eleva al cuadrado el número de condición).",
          "note": "Aplica $A^TA$ duplica el mal condicionamiento: $\\mathrm{cond}_2(A^TA)=\\mathrm{cond}_2(A)^2$."
        },
        {
          "label": "Inversa a izquierda/derecha",
          "kind": "formula",
          "body": "$A\\in\\mathbb{K}^{n\\times m}$ admite inversa a derecha $A_d$ si $AA_d=I_n$, y a izquierda $A_i$ si $A_iA=I_m$. Si columnas LI ($n\\geq m$): $A_i=(A^TA)^{-1}A^T$. Si filas LI ($n\\leq m$): $A_d=A^T(AA^T)^{-1}$.",
          "note": "Coinciden con la pseudoinversa $A^+$ en cada caso; solo una cuadrada invertible tiene inversa bilátera. QR ayuda a construirlas."
        }
      ]
    },
    {
      "title": "SVD, pseudoinversa y normas matriciales",
      "hint": "Valores singulares, Moore–Penrose, low-rank, condición, $\\|A\\|$",
      "entries": [
        {
          "label": "Teorema SVD",
          "kind": "theorem",
          "tex": "A=U\\,S\\,V^T,\\quad U,V\\ \\text{ortogonales},\\ S\\ \\text{diagonal rectangular},\\ \\sigma_1\\geq\\cdots\\geq\\sigma_r>0",
          "cond": "Toda $A\\in\\mathbb{R}^{n\\times m}$ de rango $r$. Generaliza la diagonalización a matrices no cuadradas (siempre existe). En $\\mathbb{C}$: $A=USV^*$. Columnas de $U$ = vectores singulares izquierdos; de $V$ = derechos."
        },
        {
          "label": "Cálculo de la SVD",
          "kind": "method",
          "body": "$\\sigma_i=\\sqrt{\\lambda_i}$ con $\\lambda_i$ autovalores de $A^TA$ (o $AA^T$); $V$ = autovectores normalizados de $A^TA$; $U$ vía $u_i=Av_i/\\sigma_i$ (y completar a base ortonormal). $A^TA=VS^TSV^T$, $AA^T=USS^TU^T$. Acople: $Av_i=\\sigma_i u_i$, $A^Tu_i=\\sigma_i v_i$.",
          "cond": "Conviene diagonalizar la más chica entre $A^TA$ ($m\\times m$) y $AA^T$ ($n\\times n$)."
        },
        {
          "label": "Semidefinida positiva y singulares",
          "kind": "caution",
          "body": "$A^TA$ es siempre simétrica semidefinida positiva: autovalores $\\geq0$, por eso $\\sigma_i=\\sqrt{\\lambda_i}$ está bien definido. $A$ definida positiva $\\iff X^TAX>0\\;\\forall X\\neq0\\iff$ todos sus autovalores $>0$.",
          "note": "$\\sigma_i\\neq$ autovalor de $A$ en general; son los de $A^TA$. Si $A$ es simétrica $\\geq0$, $\\sigma_i=\\lambda_i$."
        },
        {
          "label": "Pseudoinversa de Moore–Penrose",
          "kind": "def",
          "body": "$A^+=V\\,S^+\\,U^T$ con $S^+$ = transpuesta de $S$ invirtiendo los $\\sigma_i\\neq0$ (los ceros quedan en cero). Si $A$ es $n\\times m$, $S^+$ es $m\\times n$ y $A^+$ es $m\\times n$. Si $\\det(A^TA)\\neq0$ (columnas LI): $A^+=(A^TA)^{-1}A^T$.",
          "note": "Existe para cualquier $A$, incluso rectangular o singular; si $A$ es invertible, $A^+=A^{-1}$."
        },
        {
          "label": "Axiomas de Moore–Penrose",
          "kind": "theorem",
          "body": "$A^+$ es la única matriz que cumple: (1) $AA^+A=A$, (2) $A^+AA^+=A^+$, (3) $(AA^+)^T=AA^+$ y (4) $(A^+A)^T=A^+A$. $AA^+$ y $A^+A$ son proyectores ortogonales (idempotentes y simétricos).",
          "note": "$AA^+$ proyecta sobre la imagen de $A$; $A^+A$ sobre el espacio fila."
        },
        {
          "label": "Aproximación de rango bajo (Eckart–Young)",
          "kind": "theorem",
          "body": "$A=\\sum_{i=1}^r\\sigma_i u_i v_i^T$ (suma de rango 1). Truncando a los $k$ mayores singulares, $A_k=\\sum_{i\\le k}\\sigma_i u_i v_i^T$ es la mejor aproximación de rango $k$: $\\|A-A_k\\|_2=\\sigma_{k+1}$ y $\\|A-A_k\\|_F=\\sqrt{\\sum_{i>k}\\sigma_i^2}$.",
          "note": "Base de compresión de datos / imágenes; los $\\sigma_i$ chicos aportan poco."
        },
        {
          "label": "Rango, determinante y condición por SVD",
          "kind": "formula",
          "body": "$\\mathrm{rango}(A)=\\#\\{\\sigma_i\\neq0\\}=r$. Para $A$ cuadrada: $|\\det A|=\\prod_i\\sigma_i$ (y $\\det A=0\\iff$ algún $\\sigma_i=0$). Número de condición $\\mathrm{cond}_2(A)=\\sigma_{\\max}/\\sigma_{\\min}$ (mide la sensibilidad de $Ax=b$ a perturbaciones; grande $\\Rightarrow$ mal condicionada).",
          "cond": "Pedidos directos en guia-07 Ej.3 a/c. $\\mathrm{cond}_2=1$ para ortogonales."
        },
        {
          "label": "Normas matriciales",
          "kind": "formula",
          "body": "Norma-2 (espectral): $\\|A\\|_2=\\sigma_1$ (mayor valor singular). Frobenius: $\\|A\\|_F=\\sqrt{\\sum_i\\sigma_i^2}=\\sqrt{\\sum_{ij}|a_{ij}|^2}$. Norma-1: $\\|A\\|_1=\\max_j\\sum_i|a_{ij}|$ (máxima suma de columna). Norma-$\\infty$: $\\max_i\\sum_j|a_{ij}|$ (máxima suma de fila).",
          "cond": "guia-07 Ej.3d pide norma 1, 2 y Frobenius (solo $\\|\\cdot\\|_2$ y $\\|\\cdot\\|_F$ salen de la SVD)."
        },
        {
          "label": "Mínimos cuadrados",
          "kind": "method",
          "body": "$\\min\\|AX-B\\|^2$ se resuelve con las ecuaciones normales $A^TAX=A^TB$; solución $X=A^+B=(A^TA)^{-1}A^TB$. El residuo $r=B-AX$ cumple $A^Tr=0$ ($r\\perp$ imagen de $A$): $AX$ es la proyección ortogonal de $B$ sobre la imagen. Ajuste de recta $y=ax+b$: $A$ con columnas $(x_i,1)$.",
          "cond": "$A^TA$ invertible (columnas de $A$ LI). Numéricamente preferible vía QR ($Rx=Q^TB$) para no formar $A^TA$."
        }
      ]
    },
    {
      "title": "Series de Fourier",
      "hint": "Frecuencia fundamental, ortogonalidad, trig./exp., Parseval, Dirichlet",
      "entries": [
        {
          "label": "Período y frecuencia fundamental",
          "kind": "def",
          "body": "$\\omega_0=\\dfrac{2\\pi}{T}$ (rad/s); frecuencia $f_0=1/T$. Una sinusoide $\\cos(\\omega t+\\phi)$ tiene $T=2\\pi/\\omega$. Para una suma de sinusoides, $T$ es el mínimo común período: existe sii las frecuencias son CONMENSURABLES (todos los $\\omega_i/\\omega_j\\in\\mathbb{Q}$); $T=\\mathrm{mcm}$ de los períodos individuales.",
          "cond": "Si algún cociente es irracional (p.ej. $\\sqrt{2}$), la suma NO es periódica (guia-08 Ej.1, fijo en todos los IIP)."
        },
        {
          "label": "Ortogonalidad de la base trigonométrica",
          "kind": "theorem",
          "body": "Sobre un período, $\\{1,\\cos(n\\omega_0 t),\\sin(n\\omega_0 t)\\}$ es ortogonal: $\\int_T\\cos(n\\omega_0 t)\\cos(m\\omega_0 t)=0$ si $n\\neq m$, e idem senos y cruzados seno–coseno. Por eso al integrar contra cada base se despeja un único coeficiente.",
          "note": "$\\int_T\\cos^2(n\\omega_0 t)=\\int_T\\sin^2(n\\omega_0 t)=T/2$: de ahí el factor $2/T$ en $a_n,b_n$. Exponencial: $\\frac1T\\int_T e^{in\\omega_0 t}\\overline{e^{im\\omega_0 t}}=\\delta_{nm}$ (BON)."
        },
        {
          "label": "Serie trigonométrica",
          "kind": "formula",
          "tex": "f(t)=a_0+\\sum_{n\\geq1}a_n\\cos(n\\omega_0 t)+\\sum_{n\\geq1}b_n\\sin(n\\omega_0 t),\\quad \\omega_0=\\tfrac{2\\pi}{T}",
          "cond": "$f$ periódica de período $T$. Coeficientes: $a_0=\\tfrac1T\\int_T f$ (valor medio), $a_n=\\tfrac2T\\int_T f\\cos(n\\omega_0 t)$, $b_n=\\tfrac2T\\int_T f\\sin(n\\omega_0 t)$."
        },
        {
          "label": "Serie exponencial",
          "kind": "formula",
          "body": "$f(t)=\\sum_{n\\in\\mathbb{Z}}c_n e^{i n\\omega_0 t}$ con $c_n=\\tfrac1T\\int_T f\\,e^{-i n\\omega_0 t}dt$. Relación: $a_0=c_0$, $a_n=c_n+c_{-n}$, $b_n=i(c_n-c_{-n})$, y al revés $c_n=\\tfrac12(a_n-ib_n)$ ($n\\geq1$).",
          "note": "$f$ real $\\Rightarrow c_{-n}=\\overline{c_n}$."
        },
        {
          "label": "Forma amplitud–fase (laboratorio)",
          "kind": "formula",
          "body": "$f(t)=a_0+\\sum_{n\\geq1}A_n\\cos(n\\omega_0 t-\\varphi_n)$ con $A_n=\\sqrt{a_n^2+b_n^2}$ y $\\tan\\varphi_n=b_n/a_n$. Fijar el cuadrante de $\\varphi_n$ vía $a_n=A_n\\cos\\varphi_n$, $b_n=A_n\\sin\\varphi_n$ (no usar solo $\\arctan$).",
          "note": "$A_n=2|c_n|$. Contenido evaluado (IIP I y III)."
        },
        {
          "label": "Simetrías par/impar",
          "kind": "theorem",
          "body": "$f$ par $\\Rightarrow b_n=0$, $c_n\\in\\mathbb{R}$, $c_n=c_{-n}$ (serie en cosenos). $f$ impar $\\Rightarrow a_n=0$, $c_n$ imaginario puro, $c_n=-c_{-n}$ (serie en senos).",
          "note": "Usar la extensión par/impar para forzar solo cosenos o solo senos."
        },
        {
          "label": "Convergencia de Dirichlet",
          "kind": "theorem",
          "body": "En un punto de continuidad la serie converge a $f(t)$; en un salto converge al promedio $\\tfrac12\\big(f(t^-)+f(t^+)\\big)$. En las discontinuidades aparece el fenómeno de Gibbs (overshoot $\\approx9\\%$ que no desaparece al sumar más armónicos, solo se acerca al salto).",
          "cond": "$f$ seccionalmente continua con derivada seccionalmente continua."
        },
        {
          "label": "Parseval (potencia)",
          "kind": "formula",
          "body": "Potencia media $=\\tfrac1T\\int_T|f|^2=\\sum_{n\\in\\mathbb{Z}}|c_n|^2=a_0^2+\\tfrac12\\sum_{n\\geq1}(a_n^2+b_n^2)$. Sirve para sumar series numéricas (p.ej. $\\sum 1/n^2=\\pi^2/6$, $\\sum 1/(2k+1)^2=\\pi^2/8$).",
          "note": "Conecta energía en el tiempo con energía espectral (la base ortonormal preserva la norma)."
        },
        {
          "label": "Derivación e integración",
          "kind": "theorem",
          "body": "Si $f\\sim\\sum c_n e^{i n\\omega_0 t}$, entonces $f'$ tiene coeficientes $d_n=i\\,n\\omega_0\\,c_n$ y la primitiva tiene $g_n=(i\\,n\\omega_0)^{-1}c_n$ ($n\\neq0$).",
          "note": "Derivar multiplica por $i n\\omega_0$: pondera más las altas frecuencias; integrar las atenúa."
        }
      ]
    },
    {
      "title": "Transformada de Fourier, EDPs y EDOs",
      "hint": "TF continua, pares clásicos, propiedades, diferencias finitas, EDO→sistema",
      "entries": [
        {
          "label": "Transformada continua",
          "kind": "formula",
          "tex": "\\hat x(\\omega)=\\int_{-\\infty}^{\\infty}x(t)\\,e^{-i\\omega t}\\,dt",
          "cond": "$x\\in L^1$ (integrable). Se grafica módulo $|\\hat x|$ y fase $\\arg\\hat x$ vs. frecuencia. Es el límite de la serie cuando $T\\to\\infty$ (espectro continuo)."
        },
        {
          "label": "Propiedades de la TF",
          "kind": "theorem",
          "body": "Linealidad; desplazamiento en tiempo $x(t-t_0)\\to e^{-i\\omega t_0}\\hat x$; modulación $e^{i\\omega_0 t}x\\to\\hat x(\\omega-\\omega_0)$; escalado $x(at)\\to\\tfrac1{|a|}\\hat x(\\omega/a)$; derivada $x'\\to i\\omega\\hat x$; producto por $t$: $t\\,x(t)\\to i\\,\\tfrac{d}{d\\omega}\\hat x$; dualidad y convolución $\\widehat{x*y}=\\hat x\\,\\hat y$.",
          "note": "Ej.: $t e^{-t}u(t)\\to 1/(1+i\\omega)^2$ (IIP VI) usando producto por $t$."
        },
        {
          "label": "Pares de TF clásicos",
          "kind": "example",
          "body": "Exp. decaída $e^{-at}u(t)\\to\\tfrac{1}{a+i\\omega}$ ($a>0$); pulso de ancho $a\\to a\\,\\mathrm{sinc}(\\tfrac{\\omega a}{2})$; triángulo $\\to\\mathrm{sinc}^2$; gaussiana $e^{-t^2}\\to\\sqrt{\\pi}\\,e^{-\\omega^2/4}$ (su transformada es otra gaussiana).",
          "note": "Con la convención de la cátedra $e^{-t^2}$ NO es autofunción (lo sería $e^{-t^2/2}$ bajo la convención unitaria $1/\\sqrt{2\\pi}$). Saltos $\\Rightarrow$ decaimiento $\\sim1/\\omega$ del espectro."
        },
        {
          "label": "EDP implícita por diferencias finitas",
          "kind": "method",
          "body": "Calor $u_t=u_{xx}$ (Euler atrás): $-r\\,u_{i-1}^{k+1}+(1+2r)u_i^{k+1}-r\\,u_{i+1}^{k+1}=u_i^k$, $r=\\Delta t/h^2$ (tridiagonal simétrica). Onda $u_{tt}=u_{xx}$: $-r\\,u_{i-1}^{k+1}+(1+2r)u_i^{k+1}-r\\,u_{i+1}^{k+1}=2u_i^k-u_i^{k-1}$, $r=\\Delta t^2/h^2$. Convección–difusión $u_t=u_{xx}+u_x$: subdiag $s-r$, diag $1+2r$, superdiag $-(r+s)$, $s=\\Delta t/2h$ (no simétrica).",
          "cond": "Sistema tridiagonal $M\\mathbf{u}^{k+1}=\\mathbf{b}^k$; con malla de 4 nodos internos, $h=1/5$."
        },
        {
          "label": "Condiciones de borde e inicio",
          "kind": "caution",
          "body": "Dirichlet homogéneo: los nodos de borde valen $0$ y salen del sistema ($4\\times4$). Neumann ($u_x=0$): nodo fantasma $u_{-1}=u_1$, el borde pasa a ser incógnita ($5\\times5$) y $M$ deja de ser simétrica. El nivel ficticio $u^{-1}$ (onda) se elimina con $u_t(x,0)$.",
          "note": "El esquema implícito es incondicionalmente estable (sin restricción CFL): $M$ es diag. dominante $\\Rightarrow$ inversible $\\forall r>0$. $M$ es constante: se factoriza una vez (LU/Thomas) y se reusa."
        },
        {
          "label": "EDO 2.º orden → sistema de 1.er orden",
          "kind": "method",
          "body": "$\\ddot x=g(t,x,\\dot x)$: con estado $x_1=x$, $x_2=\\dot x$ queda $\\dot x_1=x_2$, $\\dot x_2=g(t,x_1,x_2)$, o sea $\\dot{\\mathbf x}=\\mathbf F(t,\\mathbf x)$. Implícito (Euler atrás) sobre $\\dot{\\mathbf x}=M\\mathbf x+\\mathbf f$: $(I-\\Delta t\\,M)\\mathbf x^{k+1}=\\mathbf x^k+\\Delta t\\,\\mathbf f(t_{k+1})$. Iniciales: $x_1^0=x(0)$, $x_2^0=\\dot x(0)$.",
          "cond": "Si $g$ es no lineal (Duffing $\\alpha x^3$), cada paso resuelve un sistema no lineal por Newton-Raphson; problema de valores iniciales (sin nodo fantasma temporal). Recurrente en finales (patrones §5.9)."
        }
      ]
    }
  ]
};
