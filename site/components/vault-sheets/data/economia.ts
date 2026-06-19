import type { Sheet } from "../types";

// Generado por el pipeline studyvault-cheatsheets (extracción + auditoría sub-overseer).
// Editable a mano: es data pura. Ver components/vault-sheets/types.ts.

export const economiaFormulas: Sheet = {
  "vault": "economia",
  "kind": "formulas",
  "title": "Economía para Ingenieros",
  "subtitle": "Micro (oferta/demanda, costos, mercados), macro (PBI, dinero, política) y empresa (contabilidad, cálculo financiero, proyectos)",
  "notation": "$Q$ cantidad, $P$ precio, $Y$ ingreso/PBI; $\\eta,\\varepsilon$ elasticidades; $CT=CF+CV$ costos, $CMg$/$CMe$ marginal/medio; $\\pi$ beneficio (micro) o inflación (macro); $i$ tasa nominal, $r$ tasa real, $t$ alícuota impositiva; $VP$/$VF$ valor presente/futuro.",
  "updated": "2026-06-19",
  "groups": [
    {
      "title": "Oferta, demanda y precios",
      "hint": "Equilibrio, deflactar e índices",
      "unit": "1",
      "entries": [
        {
          "label": "Equilibrio de mercado",
          "kind": "def",
          "tex": "Q_d(p) = Q_s(p)",
          "body": "Precio que iguala cantidad demandada y ofrecida; el lado corto manda fuera del equilibrio."
        },
        {
          "label": "Precio real (deflactar)",
          "kind": "formula",
          "tex": "P_{real} = P_{nom}\\cdot \\dfrac{IPC_{base}}{IPC_{act}}",
          "body": "Lleva precios nominales a moneda del año base."
        },
        {
          "label": "Gasto total",
          "kind": "formula",
          "tex": "G = P\\cdot Q",
          "note": "Se maximiza donde $|\\eta|=1$ (punto medio de demanda lineal)."
        },
        {
          "label": "Índice de Laspeyres",
          "kind": "formula",
          "tex": "IP_L = \\dfrac{\\sum_i P_i^t\\,Q_i^o}{\\sum_i P_i^o\\,Q_i^o}",
          "cond": "Canasta fija del año base; base del IPC.",
          "note": "Sobreestima inflación: no captura sustitución."
        },
        {
          "label": "Índice de Paasche",
          "kind": "formula",
          "tex": "IP_P = \\dfrac{\\sum_i P_i^t\\,Q_i^t}{\\sum_i P_i^o\\,Q_i^t}",
          "cond": "Canasta del período corriente; base del deflactor del PBI.",
          "note": "Subestima inflación: canasta ya ajustada."
        },
        {
          "label": "Análisis marginal",
          "kind": "method",
          "tex": "BMg = CMg",
          "body": "Regla racional: actuar mientras el beneficio marginal supere al costo marginal. Se replica en $IMg=CMg$ (producción) y utilidad/peso (consumo)."
        }
      ]
    },
    {
      "title": "Elasticidades",
      "hint": "Sensibilidad porcentual",
      "unit": "1",
      "entries": [
        {
          "label": "Elasticidad-precio demanda",
          "kind": "def",
          "tex": "\\eta = \\dfrac{\\Delta Q/Q}{\\Delta P/P} = \\dfrac{\\partial Q}{\\partial P}\\cdot \\dfrac{P}{Q}",
          "body": "Variación % de Q ante 1% de cambio en P (adimensional). Por la ley de demanda, $\\eta\\le 0$."
        },
        {
          "label": "Clasificación de $\\eta$",
          "kind": "example",
          "tex": "|\\eta|>1\\ \\text{elástica}\\quad |\\eta|<1\\ \\text{inelástica}\\quad |\\eta|=1\\ \\text{unitaria}",
          "note": "$|\\eta|=0$ perf. inelástica (vertical); $|\\eta|\\to\\infty$ perf. elástica (horizontal)."
        },
        {
          "label": "$\\eta$ en demanda lineal",
          "kind": "formula",
          "tex": "Q=a-bP\\ \\Rightarrow\\ \\eta = -b\\cdot \\dfrac{P}{a-bP}",
          "note": "Varía a lo largo de la recta: $\\infty$ en eje P, $0$ en eje Q, $1$ en el medio. La pendiente $-b$ es constante; la elasticidad no."
        },
        {
          "label": "Elasticidad-precio oferta",
          "kind": "def",
          "tex": "\\varepsilon_p = \\dfrac{\\partial Q_o}{\\partial P}\\cdot \\dfrac{P}{Q_o}",
          "cond": "$\\varepsilon_p \\ge 0$ (oferta crece con el precio); mayor en el largo plazo."
        },
        {
          "label": "Elasticidad-ingreso",
          "kind": "def",
          "tex": "\\varepsilon_Y = \\dfrac{\\partial Q}{\\partial Y}\\cdot \\dfrac{Y}{Q}",
          "note": "$\\varepsilon_Y>1$ lujo; $0<\\varepsilon_Y<1$ normal/básico; $\\varepsilon_Y<0$ inferior."
        },
        {
          "label": "Elasticidad cruzada",
          "kind": "def",
          "tex": "\\varepsilon_{XY} = \\dfrac{\\partial Q_X}{\\partial P_Y}\\cdot \\dfrac{P_Y}{Q_X}",
          "note": "$\\varepsilon_{XY}>0$ sustitutos; $\\varepsilon_{XY}<0$ complementarios."
        },
        {
          "label": "Gasto vs elasticidad",
          "kind": "theorem",
          "tex": "|\\eta|>1:\\ \\downarrow P\\Rightarrow\\uparrow G\\qquad |\\eta|<1:\\ \\downarrow P\\Rightarrow\\downarrow G",
          "body": "Si $|\\eta|=1$ el gasto no cambia. Conviene encarecer un bien de demanda inelástica."
        }
      ]
    },
    {
      "title": "Excedentes y bienestar",
      "hint": "Áreas y controles de precio",
      "unit": "1",
      "entries": [
        {
          "label": "Excedente consumidor",
          "kind": "formula",
          "tex": "EC = \\int_0^{Q^*}\\! D(q)\\,dq - P^*Q^* = \\dfrac{(a-P^*)Q^*}{2}",
          "cond": "Forma cerrada para demanda lineal $P=a-bQ$ (triángulo bajo la demanda, sobre $P^*$)."
        },
        {
          "label": "Excedente productor",
          "kind": "formula",
          "tex": "EP = P^*Q^* - \\int_0^{Q^*}\\! S(q)\\,dq = \\dfrac{(P^*-c)Q^*}{2}",
          "cond": "Forma cerrada para oferta lineal $P=c+dQ$."
        },
        {
          "label": "Bienestar total",
          "kind": "theorem",
          "tex": "W = EC + EP",
          "body": "Máximo en equilibrio competitivo (1.º teorema del bienestar). Toda intervención genera DWL."
        },
        {
          "label": "Precio máximo (techo)",
          "kind": "caution",
          "body": "Activo solo si $P_T<P^*$. Transado $Q=Q_s(P_T)$ (manda la oferta). Genera escasez $Q_d-Q_s>0$, colas, mercado negro."
        },
        {
          "label": "Precio mínimo (piso)",
          "kind": "caution",
          "body": "Activo solo si $P_F>P^*$. Transado $Q=Q_d(P_F)$ (manda la demanda). Genera excedente $Q_s-Q_d>0$ (ej. desempleo con salario mínimo)."
        }
      ]
    },
    {
      "title": "Producción",
      "hint": "Factores, PMg/PMe, escala",
      "unit": "2",
      "entries": [
        {
          "label": "Función de producción",
          "kind": "def",
          "tex": "Q = F(K,L)",
          "body": "$K$ capital (fijo en CP), $L$ trabajo (factor variable). En LP todos los factores varían."
        },
        {
          "label": "Cobb-Douglas",
          "kind": "formula",
          "tex": "Q = A\\,K^{\\alpha}L^{\\beta}",
          "note": "Escala: $\\alpha+\\beta>1$ crecientes; $=1$ constantes; $<1$ decrecientes. $A$ = productividad total de factores."
        },
        {
          "label": "PMg Cobb-Douglas",
          "kind": "formula",
          "tex": "PMg_L = \\beta\\dfrac{Q}{L}\\qquad PMg_K = \\alpha\\dfrac{Q}{K}"
        },
        {
          "label": "Producto medio y marginal",
          "kind": "def",
          "tex": "PMe_L = \\dfrac{Q}{L}\\qquad PMg_L = \\dfrac{\\partial Q}{\\partial L}"
        },
        {
          "label": "PMg corta a PMe",
          "kind": "theorem",
          "tex": "PMg_L = PMe_L\\ \\text{en el máximo de } PMe_L",
          "body": "Por encima del máximo, $PMg<PMe$ y $PMe$ decrece (rendimientos marginales decrecientes)."
        }
      ]
    },
    {
      "title": "Costos",
      "hint": "CT/CF/CV, medios, marginal",
      "unit": "2",
      "entries": [
        {
          "label": "Costo total",
          "kind": "formula",
          "tex": "CT = CF + CV\\qquad CV = w\\cdot L",
          "body": "$CF$ independiente de $Q$; $CV$ depende de $Q$ (si solo $L$ es variable)."
        },
        {
          "label": "Costos medios",
          "kind": "formula",
          "tex": "CFMe=\\dfrac{CF}{Q}\\quad CVMe=\\dfrac{CV}{Q}\\quad CTMe=CFMe+CVMe",
          "note": "$CFMe$ decrece a 0; $CVMe$ y $CTMe$ en forma de U."
        },
        {
          "label": "Costo marginal",
          "kind": "def",
          "tex": "CMg = \\dfrac{\\partial CT}{\\partial Q} = \\dfrac{w}{PMg_L}",
          "body": "$CMg$ es alto cuando la productividad marginal del trabajo es baja."
        },
        {
          "label": "Regla CMg ↔ CMe",
          "kind": "theorem",
          "tex": "CMg<CMe\\Rightarrow CMe\\downarrow;\\quad CMg>CMe\\Rightarrow CMe\\uparrow",
          "body": "$CMg$ corta a $CVMe$ y $CTMe$ en sus mínimos."
        },
        {
          "label": "Elasticidad-costo",
          "kind": "formula",
          "tex": "\\varepsilon_C = \\dfrac{\\Delta C/C}{\\Delta Q/Q} = \\dfrac{CMg}{CMe}",
          "note": "$<1$ economías de escala; $=1$ constantes; $>1$ deseconomías."
        },
        {
          "label": "Costos hundidos (sunk)",
          "kind": "caution",
          "body": "Ya gastados, no recuperables: NO entran en decisiones óptimas ni en $CMg$. El costo económico incluye costo de oportunidad de factores propios; el contable no."
        }
      ]
    },
    {
      "title": "Ingreso, beneficio y break-even",
      "hint": "Optimización general",
      "unit": "2",
      "entries": [
        {
          "label": "Ingreso total y marginal",
          "kind": "def",
          "tex": "I(q)=P(q)\\cdot q\\qquad IMg=\\dfrac{dI}{dq}",
          "body": "En CP $P$ constante ($IMg=P$); en monopolio $P(q)$ decreciente ($IMg<P$)."
        },
        {
          "label": "Beneficio",
          "kind": "formula",
          "tex": "\\pi(q) = I(q) - C(q)",
          "body": "Contable $=I-wL$; económico $=I-wL-rK$ (incluye costo de oportunidad del capital)."
        },
        {
          "label": "Condición de máximo",
          "kind": "theorem",
          "tex": "\\dfrac{d\\pi}{dq}=0\\ \\Longrightarrow\\ IMg = CMg",
          "body": "Regla universal: monopolio, competencia perfecta y oligopolio."
        },
        {
          "label": "Punto de equilibrio",
          "kind": "formula",
          "tex": "Q^* = \\dfrac{CF}{P - CV_u}\\qquad V^* = \\dfrac{CF}{(P-CV_u)/P}",
          "cond": "Ingresos $=$ costos totales. $P-CV_u$ = margen de contribución unitario; $V^*$ en pesos.",
          "note": "Resultado a cualquier volumen: $\\pi=(P-CV_u)Q-CF$."
        }
      ]
    },
    {
      "title": "Competencia perfecta",
      "hint": "Precio-aceptante, cierre, LP",
      "unit": "3",
      "entries": [
        {
          "label": "Empresa precio-aceptante",
          "kind": "def",
          "tex": "P = IMg = IMe",
          "body": "Demanda individual horizontal al precio de mercado."
        },
        {
          "label": "Óptimo en CP",
          "kind": "theorem",
          "tex": "P = CMg",
          "body": "Caso particular de $IMg=CMg$ con $IMg=P$. La oferta de la firma es el tramo de $CMg$ sobre el mínimo de $CVMe$."
        },
        {
          "label": "Beneficio",
          "kind": "formula",
          "tex": "\\pi = (P - CTMe)\\cdot q^*",
          "note": "$P>CTMe$ extraordinario; $CVMe<P<CTMe$ pérdida; $P<CVMe$ cierre."
        },
        {
          "label": "Cierre (CP) vs salida (LP)",
          "kind": "caution",
          "body": "Cierre temporario si $P<\\min(CVMe)$: pierde $-CF$ (fijos hundidos). Salida definitiva si $P<\\min(CMe_{LP})$: pérdida 0, no hay fijos en LP."
        },
        {
          "label": "Equilibrio de largo plazo",
          "kind": "theorem",
          "tex": "P^* = CMg = \\min(CMe_{LP})",
          "body": "Libre entrada anula el beneficio económico."
        }
      ]
    },
    {
      "title": "Impuestos y subsidios",
      "hint": "Incidencia, DWL, recaudación",
      "unit": "3",
      "entries": [
        {
          "label": "Efecto del impuesto $t$",
          "kind": "formula",
          "tex": "CMg_2 = CMg_1 + t\\qquad S_2 = S_1 + t",
          "body": "Desplaza la oferta hacia arriba en $t$ por unidad. La incidencia es la misma se cobre a productor o consumidor (equivalencia fiscal)."
        },
        {
          "label": "Incidencia impositiva",
          "kind": "theorem",
          "tex": "\\dfrac{\\Delta P_c}{\\Delta P_p} = \\dfrac{\\varepsilon_s}{|\\varepsilon_d|}",
          "body": "El lado más inelástico carga más. Si $|\\varepsilon_d|=0$ paga 100% el consumidor; si $\\varepsilon_s=0$, el productor."
        },
        {
          "label": "Recaudación y DWL",
          "kind": "formula",
          "tex": "T = t\\cdot Q_{nueva}\\qquad DWL \\approx \\tfrac{1}{2}\\,t\\,\\Delta Q",
          "note": "DWL crece cuanto más elásticas sean oferta y demanda."
        },
        {
          "label": "Subsidio por unidad",
          "kind": "example",
          "body": "Espejo del impuesto: $P_c\\downarrow$, $P_p\\uparrow$ con $P_p-P_c=s$, $Q_2>Q_1$. Costo fiscal $s\\cdot Q_2$. También genera DWL."
        }
      ]
    },
    {
      "title": "Monopolio",
      "hint": "IMg, markup, Lerner",
      "unit": "4",
      "entries": [
        {
          "label": "IMg con demanda lineal",
          "kind": "formula",
          "tex": "P=a-bQ\\ \\Rightarrow\\ IMg = a - 2bQ",
          "note": "El IMg duplica la pendiente de la demanda y comparte intercepto en P."
        },
        {
          "label": "IMg – precio – elasticidad",
          "kind": "theorem",
          "tex": "IMg = P\\left(1 - \\dfrac{1}{|\\varepsilon|}\\right)",
          "body": "$|\\varepsilon|\\to\\infty\\Rightarrow IMg=P$ (CP); $|\\varepsilon|=1\\Rightarrow IMg=0$; $|\\varepsilon|<1\\Rightarrow IMg<0$."
        },
        {
          "label": "Nunca en tramo inelástico",
          "kind": "caution",
          "body": "El monopolista jamás produce donde $|\\varepsilon|<1$: ahí $IMg<0$, conviene subir el precio."
        },
        {
          "label": "Regla de markup",
          "kind": "formula",
          "tex": "P = \\dfrac{CMg}{1 - 1/|\\varepsilon|} = CMg\\cdot \\dfrac{|\\varepsilon|}{|\\varepsilon|-1}",
          "body": "Precio óptimo: margen sobre $CMg$ inverso a la elasticidad."
        },
        {
          "label": "Índice de Lerner",
          "kind": "formula",
          "tex": "L = \\dfrac{P - CMg}{P} = \\dfrac{1}{|\\varepsilon|}",
          "note": "Poder de mercado: $L=0$ en CP; $L\\to1$ monopolio muy inelástico."
        },
        {
          "label": "CP vs monopolio (lineal, $CMg$ cte)",
          "kind": "example",
          "tex": "Q_M = \\tfrac{Q_C}{2}\\qquad P_M = \\tfrac{a+CMg}{2} \\\\[4pt] DWL=\\tfrac{1}{2}(P_M-CMg)(Q_C-Q_M)",
          "body": "El monopolista produce la mitad ($Q_M=Q_C/2$) y cobra el doble del margen sobre $CMg$."
        }
      ]
    },
    {
      "title": "Otros mercados imperfectos",
      "hint": "Discriminación, comp. monopolística, Nash",
      "unit": "4",
      "entries": [
        {
          "label": "Discriminación 3.er grado",
          "kind": "formula",
          "tex": "P_1\\!\\left(1-\\tfrac{1}{|\\varepsilon_1|}\\right) = P_2\\!\\left(1-\\tfrac{1}{|\\varepsilon_2|}\\right) = CMg",
          "body": "$IMg_1=IMg_2=CMg$. Mercado más inelástico paga precio más alto."
        },
        {
          "label": "Comp. monopolística (LP)",
          "kind": "theorem",
          "tex": "P = CMe\\quad \\text{y}\\quad IMg=CMg",
          "body": "Libre entrada anula beneficio, pero $P>CMg$ deja ineficiencia (DWL menor que monopolio)."
        },
        {
          "label": "Regulación monopolio natural",
          "kind": "method",
          "body": "1) $P=CMg$ eficiente pero requiere subsidio ($CMg<CMe$). 2) $P=CMe$: $\\pi=0$ sin subsidio, DWL chico. 3) Sin regular + impuesto suma fija: preserva eficiencia interna."
        },
        {
          "label": "Equilibrio de Nash",
          "kind": "def",
          "tex": "u_i(s_i^*,s_{-i}^*) \\ge u_i(s_i,s_{-i}^*)\\ \\forall s_i,\\forall i",
          "body": "Cada jugador en su mejor respuesta. Identificar marcando mejores respuestas: doble marca = Nash."
        },
        {
          "label": "Dilema del prisionero",
          "kind": "caution",
          "body": "La estrategia dominante lleva a un Nash Pareto-inferior al cooperativo. Por eso los cárteles son inestables sin enforcement."
        },
        {
          "label": "Monopsonio",
          "kind": "example",
          "tex": "VPMg_L = CMg_L\\ \\ (\\neq w)",
          "body": "Único comprador del factor: contrata menos y paga menos salario que en competencia."
        }
      ]
    },
    {
      "title": "PBI e inflación",
      "hint": "Tres métodos, deflactor",
      "unit": "5",
      "entries": [
        {
          "label": "PBI (método del gasto)",
          "kind": "formula",
          "tex": "PBI = C + I + G + (X - M)",
          "body": "El más usado. $I$ incluye FBKF + variación de existencias."
        },
        {
          "label": "PBI (método del ingreso)",
          "kind": "formula",
          "tex": "PBI = R + CKF + I_{pm} + EE",
          "body": "Remuneraciones + consumo de capital fijo + impuestos netos a la prod./import. + excedente de explotación.",
          "note": "Tema sensible Parcial 1: calcular PBI por los 3 métodos da el mismo valor."
        },
        {
          "label": "PBI (método del valor agregado)",
          "kind": "formula",
          "tex": "PBI = \\textstyle\\sum VAB + DM + I_p",
          "body": "Valor agregado bruto de cada sector + derechos de importación + impuestos netos a los productos. Evita doble contabilización de insumos."
        },
        {
          "label": "Identidad del SCN",
          "kind": "theorem",
          "tex": "C+S+T \\equiv Y \\equiv C+I+G+(X-M)",
          "body": "Deriva en las 3 brechas: $(S-I)+(T-G)+(M-X)\\equiv 0$."
        },
        {
          "label": "Deflactor del PBI",
          "kind": "formula",
          "tex": "\\text{Deflactor} = \\dfrac{PBI_{nom}}{PBI_{real}}\\times 100",
          "body": "$PBI_{nom}=\\sum P_t Q_t$; $PBI_{real}=\\sum P_{base}Q_t$ (índice de Paasche)."
        },
        {
          "label": "Tasa de inflación",
          "kind": "formula",
          "tex": "\\pi_t = \\dfrac{IPC_t - IPC_{t-1}}{IPC_{t-1}}\\times 100"
        },
        {
          "label": "Ecuación cuantitativa",
          "kind": "theorem",
          "tex": "M\\cdot V = P\\cdot Y",
          "body": "Con $V$ estable e $Y$ creciendo parejo, exceso de $M$ se vuelve inflación."
        },
        {
          "label": "PBI vs PNB",
          "kind": "caution",
          "body": "$PNB = PBI + $ renta neta de factores del exterior (RNF). PBI mide producción en el territorio; PNB, la de factores nacionales. Confundirlos es error frecuente."
        }
      ]
    },
    {
      "title": "Empleo y distribución",
      "hint": "Tasas, Okun, Gini",
      "unit": "5",
      "entries": [
        {
          "label": "Tasas laborales",
          "kind": "formula",
          "tex": "\\text{Act.}=\\dfrac{PEA}{Pobl.}\\quad \\text{Ocup.}=\\dfrac{Ocup.}{Pobl.}\\quad \\text{Desoc.}=\\dfrac{Desoc.}{PEA}",
          "body": "$PEA=$ ocupados $+$ desocupados. Tasa natural $=$ friccional $+$ estructural; observada $=$ natural $+$ cíclico.",
          "note": "Denominadores distintos: actividad y ocupación sobre Población; desocupación sobre PEA. Mezclarlos es error penalizado."
        },
        {
          "label": "Demandantes de empleo",
          "kind": "formula",
          "tex": "\\text{Tasa dem.}=\\dfrac{Desoc. + Subocup.}{PEA}",
          "body": "Suma desocupados y subocupados (trabajan <35 hs involuntariamente). Ocupados plenos 35–45 hs; sobreocupados >45 hs."
        },
        {
          "label": "Ley de Okun",
          "kind": "theorem",
          "tex": "\\Delta u \\approx -\\beta\\left(\\dfrac{Y-Y^*}{Y^*}\\right)",
          "body": "Caída de 1% del PBI bajo el potencial $\\Rightarrow$ $\\uparrow u\\approx 0{,}5$ p.p. ($\\beta\\approx 0{,}5$)."
        },
        {
          "label": "Coeficiente de Gini",
          "kind": "formula",
          "tex": "G = \\dfrac{A}{A+B}",
          "body": "$A$ área entre Lorenz y diagonal; $B$ bajo Lorenz. $G=0$ igualdad, $G=1$ desigualdad máxima."
        },
        {
          "label": "Pobreza por ingreso",
          "kind": "def",
          "tex": "CBT = CBA\\cdot (\\text{Coef. Engel})^{-1}",
          "body": "Indigencia: ingreso $<$ CBA; pobreza: ingreso $<$ CBT (alimentaria + no alimentaria)."
        }
      ]
    },
    {
      "title": "Política fiscal y deuda",
      "hint": "Multiplicadores, sostenibilidad",
      "unit": "5",
      "entries": [
        {
          "label": "Multiplicador del gasto",
          "kind": "formula",
          "tex": "k_G = \\dfrac{1}{1-PMC} = \\dfrac{1}{PMS}\\quad\\Rightarrow\\quad \\Delta Y = k_G\\,\\Delta G",
          "body": "$PMC=\\Delta C/\\Delta Y_d$; $PMC+PMS=1$."
        },
        {
          "label": "Multiplicador impuestos/transf.",
          "kind": "formula",
          "tex": "k_{TR} = \\dfrac{PMC}{1-PMC}\\qquad k_T = -\\dfrac{PMC}{1-PMC}",
          "note": "Menores en módulo que $k_G$: el primer peso pasa por el filtro del consumo."
        },
        {
          "label": "Presupuesto equilibrado",
          "kind": "theorem",
          "tex": "\\Delta G = \\Delta T\\ \\Rightarrow\\ \\Delta Y = \\Delta G",
          "body": "Multiplicador balanced-budget exactamente $=1$."
        },
        {
          "label": "Resultado fiscal",
          "kind": "formula",
          "tex": "RF_p = T - G - TR\\qquad RF_f = RF_p - i\\cdot D",
          "body": "Primario (sin intereses) y financiero (con $i\\cdot D$)."
        },
        {
          "label": "Déficit primario sostenible",
          "kind": "formula",
          "tex": "d^* = -(r-\\gamma)\\cdot b",
          "cond": "% del PBI. $b=$ Deuda/PBI, $r$ tasa real, $\\gamma$ crecimiento real.",
          "note": "Si $r>\\gamma$ hace falta superávit primario para mantener $b$ constante."
        }
      ]
    },
    {
      "title": "Dinero y sector externo",
      "hint": "Multiplicador monetario, TCR",
      "unit": "5",
      "entries": [
        {
          "label": "Agregados monetarios",
          "kind": "def",
          "tex": "M0\\subset M1\\subset M2\\subset M3",
          "body": "M0 (base) = circulante + reservas BC; M1 = circulante + cuentas corrientes; M2 = M1 + cajas de ahorro; M3 = M2 + plazos fijos. Liquidez decreciente."
        },
        {
          "label": "Identidades monetarias",
          "kind": "def",
          "tex": "M=E+D\\quad BM=E+R\\quad e=\\tfrac{E}{D}\\quad r=\\tfrac{R}{D}",
          "body": "$E$ efectivo, $D$ depósitos, $R$ reservas. $e$ preferencia por cash, $r$ coef. de encajes."
        },
        {
          "label": "Multiplicador del dinero",
          "kind": "formula",
          "tex": "m = \\dfrac{e+1}{e+r}\\qquad M = m\\cdot BM",
          "note": "$\\uparrow r$ (encajes) o $\\uparrow e$ (preferencia cash) $\\Rightarrow$ $\\downarrow m$."
        },
        {
          "label": "Mercado de dinero",
          "kind": "def",
          "tex": "MS = MD = L(Y,r)",
          "body": "$MS$ vertical (lo fija el BC). $MD$ decrece en $r$, crece en $Y$ y $P$. Expansiva: BC compra bonos $\\Rightarrow \\uparrow MS\\Rightarrow\\downarrow r$."
        },
        {
          "label": "Tipo de cambio real",
          "kind": "formula",
          "tex": "TCR = \\dfrac{e\\cdot P^*}{P}",
          "note": "$TCR\\uparrow$ depreciación real (más competitivo); $TCR\\downarrow$ atraso cambiario. $e\\uparrow$ = devaluación local."
        },
        {
          "label": "Cuenta corriente",
          "kind": "formula",
          "tex": "CC = (X-M) + RNF + TC",
          "body": "Balanza comercial + rentas netas del exterior + transferencias corrientes."
        }
      ]
    },
    {
      "title": "Valuación de activos financieros",
      "hint": "Bonos, acciones, Fisher ex-ante",
      "unit": "5",
      "entries": [
        {
          "label": "Valuación de bonos (renta fija)",
          "kind": "formula",
          "tex": "P^B = \\sum_{t=1}^{N} \\dfrac{CF_t}{(1+i)^t}",
          "body": "Concepto clave de la Clase 3.",
          "note": "$CF_t=$ cupón $+$ amortización. La TIR es la $i$ que iguala $P^B$ al precio de mercado."
        },
        {
          "label": "Precio – cupón – TIR",
          "kind": "theorem",
          "tex": "\\text{par}:\\ TIR=cupón \\\\[3pt] \\text{bajo la par}:\\ TIR>cupón \\\\[3pt] \\text{sobre la par}:\\ TIR<cupón",
          "body": "Estructura de riesgo: $TIR = r_{libre} + $ prima de riesgo."
        },
        {
          "label": "Valuación de acciones",
          "kind": "formula",
          "tex": "P^A = \\dfrac{D}{i}\\qquad P^A = \\dfrac{D}{i-g}\\ (i>g)",
          "body": "Perpetuidad de dividendo constante $D$, o Gordon para dividendos crecientes a tasa $g$. $i=$ tasa de descuento ajustada por riesgo."
        },
        {
          "label": "Rendimiento del accionista",
          "kind": "formula",
          "tex": "R = \\dfrac{(PPA_f - PPA_p) + Div}{PPA_p}",
          "body": "Ganancia de capital $+$ dividendos sobre precio inicial. Ej. clase: $(187-200+10)/200=-1{,}5\\%$."
        },
        {
          "label": "Paridad de Fisher (ex-ante)",
          "kind": "formula",
          "tex": "1+r_t = \\dfrac{1+i_t}{1+\\pi^e_{t+1}}",
          "cond": "Tasa real esperada (usa inflación esperada).",
          "note": "La versión realizada usa $\\pi$ observado: $1+r=(1+i)/(1+\\pi)$."
        }
      ]
    },
    {
      "title": "Contabilidad y EERR",
      "hint": "Ecuación patrimonial, cascada",
      "unit": "6",
      "entries": [
        {
          "label": "Ecuación contable",
          "kind": "theorem",
          "tex": "A = P + PN\\qquad PN = A - P",
          "body": "Activo = pasivo + patrimonio neto. Toda operación la preserva (partida doble: débitos $=$ créditos)."
        },
        {
          "label": "Cascada de resultados",
          "kind": "formula",
          "tex": "EBITDA \\to EBIT \\to EBT \\to EAT",
          "body": "$EBIT=EBITDA-Am$; $EBT=EBIT-Int.$; $EAT=EBT-IG$."
        },
        {
          "label": "Amortización lineal",
          "kind": "formula",
          "tex": "Am = \\dfrac{V.O.-V.R.}{V.U.}\\qquad V.L. = V.O. - A.A.",
          "note": "Base amortizable excluye el $V.R.$; los terrenos no se amortizan. Resultado por venta $=Precio-V.L.$"
        },
        {
          "label": "Capital de trabajo",
          "kind": "formula",
          "tex": "KT = AC - PC",
          "body": "Fondo de maniobra desde el activo. $FM=$ recursos permanentes $-$ activos inmovilizados (misma magnitud, visto desde el financiamiento)."
        },
        {
          "label": "NOF y superávit financiero",
          "kind": "def",
          "tex": "NOF = A_{oper} - P_{espont}\\qquad FM - NOF = A_{líq} - P_{líq}",
          "note": "$A_{oper}=$ créditos $+$ bienes de cambio; $P_{espont}=$ proveedores. Si $FM<NOF$ hay déficit a cubrir con deuda financiera CP."
        }
      ]
    },
    {
      "title": "Flujo de fondos (EOAF)",
      "hint": "Orígenes/aplicaciones, FCFF",
      "unit": "6",
      "entries": [
        {
          "label": "Variación de caja",
          "kind": "formula",
          "tex": "\\Delta C = FF_{op} + FF_{inv} + FF_{fin}",
          "body": "Concilia resultado con caja. Aumentos de $P$/$PN$ y bajas de activos = orígenes; aumentos de activos y bajas de $P$/$PN$ = aplicaciones."
        },
        {
          "label": "Flujo de operación",
          "kind": "formula",
          "tex": "FF_{op} = U.neta + Am - \\Delta Créd. - \\Delta BC + \\Delta D_{com}",
          "body": "Parte de la utilidad neta, suma amortizaciones (no erogables) y ajusta por el capital de trabajo del giro."
        },
        {
          "label": "Inversión y financiación",
          "kind": "formula",
          "tex": "FF_{inv} = -Inv. + Ventas\\ BU \\\\[3pt] FF_{fin} = \\Delta D_{fin} - Int. + Aportes - Div.",
          "body": "$\\Delta BU = Inversiones - Amortizaciones$ (variación de bienes de uso)."
        },
        {
          "label": "Flujo del proyecto (FCFF)",
          "kind": "formula",
          "tex": "FCFF = EBIT(1-t) + Am - \\Delta KT - Inv.",
          "note": "Flujo \\\"del activo\\\", sin financiamiento. $FCFE = FCFF + \\Delta D_{fin} - Int.(1-t) + Aportes - Div.$ (\\\"hacia el accionista\\\")."
        }
      ]
    },
    {
      "title": "Costos de fabricación",
      "hint": "Componentes, costeo, producto/período",
      "unit": "6",
      "entries": [
        {
          "label": "Costo de fabricación",
          "kind": "formula",
          "tex": "Costo\\ fab. = MP + MOD + GGF",
          "body": "Materia prima + mano de obra directa + gastos generales de fabricación. Los tres integran el costo del producto (se activan en inventario hasta la venta)."
        },
        {
          "label": "Costeo: absorción vs directo",
          "kind": "formula",
          "tex": "Absorc. = MP + MOD + GGF_{var} + GGF_{fij} \\\\[3pt] Directo = MP + MOD + GGF_{var}",
          "body": "Diferencia: el directo excluye los GGF fijos del costo del producto. En ninguno entran gastos de adm./com./finanzas."
        },
        {
          "label": "Costo producto vs período",
          "kind": "caution",
          "body": "Producto: MP+MOD+GGF, se activan en inventario y van a CMV al vender. Período: administración, comercialización y financieros, se imputan al ejercicio en que ocurren."
        },
        {
          "label": "Optimización de diseño",
          "kind": "method",
          "tex": "C(x)=ax+\\dfrac{b}{x}+k\\ \\Rightarrow\\ x^*=\\sqrt{\\tfrac{b}{a}}",
          "body": "Derivar $C(x)$, igualar a 0, verificar $C''(x^*)>0$. Diseñar temprano es barato (el costo del cambio crece escalonado con la etapa)."
        }
      ]
    },
    {
      "title": "Ratios financieros",
      "hint": "Liquidez, actividad, deuda, DuPont",
      "unit": "6",
      "entries": [
        {
          "label": "Liquidez",
          "kind": "formula",
          "tex": "\\text{Corr.}=\\tfrac{AC}{PC}\\quad \\text{Ácida}=\\tfrac{AC-BC}{PC}",
          "body": "Corriente $>1$ equivale a $KT>0$; ácida quita bienes de cambio. Absoluta $=$ Disponibilidades$/PC$."
        },
        {
          "label": "Ratios de actividad",
          "kind": "caution",
          "tex": "PPC=\\tfrac{Créd.\\times días}{Ventas}\\quad PPP=\\tfrac{Deudas\\times días}{Compras}",
          "note": "Cobranza sobre ventas, pago sobre compras, existencias sobre CMV. Mezclar bases es el error clásico."
        },
        {
          "label": "Ciclo de caja",
          "kind": "formula",
          "tex": "\\text{Ciclo caja} = PPC + \\text{días exist.} - PPP",
          "body": "Días de giro a financiar (ciclo operativo menos período de pago)."
        },
        {
          "label": "Endeudamiento y cobertura",
          "kind": "formula",
          "tex": "End.=\\tfrac{Deuda}{Activo}\\qquad Cob.=\\tfrac{EBITDA}{Intereses}",
          "note": "La cátedra define la cobertura con EBITDA (otros textos: EBIT). En GP5 el banco exige cobertura $\\ge 5$."
        },
        {
          "label": "Ecuación de DuPont",
          "kind": "theorem",
          "tex": "ROE = \\dfrac{U.neta}{Ventas}\\times \\dfrac{Ventas}{Activos}\\times \\dfrac{Activos}{PN}",
          "body": "Margen × rotación × apalancamiento (los dos primeros = rentabilidad sobre activos)."
        },
        {
          "label": "Equilibrio contable",
          "kind": "formula",
          "tex": "cm = p - cv\\qquad q^* = \\dfrac{CF}{p - cv}",
          "note": "$V^* = CF/[(p-cv)/p]$ en pesos. Resultado: $\\pi=(p-cv)q-CF$."
        }
      ]
    },
    {
      "title": "Valor tiempo del dinero",
      "hint": "Capitalizar y descontar",
      "unit": "7",
      "entries": [
        {
          "label": "Interés compuesto",
          "kind": "formula",
          "tex": "F = P\\,(1+i)^n\\qquad P = \\dfrac{F}{(1+i)^n}",
          "note": "Simple: $M=C(1+in)$ (lineal). Casi todo capitaliza: usar compuesto salvo aviso."
        },
        {
          "label": "Despeje de tasa y plazo",
          "kind": "formula",
          "tex": "i = \\left(\\dfrac{F}{P}\\right)^{1/n}\\!-1\\qquad n = \\dfrac{\\ln(F/P)}{\\ln(1+i)}",
          "body": "Los cuatro despejes del compuesto: $F$, $P$, $i$, $n$ (Excel: VF, VA, TASA, NPER)."
        },
        {
          "label": "Regla de oro",
          "kind": "caution",
          "body": "Nunca sumar ni comparar montos de momentos distintos sin antes llevarlos a la misma fecha."
        },
        {
          "label": "Tasas: nominal, efectiva",
          "kind": "formula",
          "tex": "i_p = \\dfrac{i}{k}\\qquad i_e = \\left(1+\\dfrac{i}{k}\\right)^{k} - 1",
          "body": "$k$ capitalizaciones/año. A mayor frecuencia, mayor TEA para la misma TNA."
        },
        {
          "label": "Tasas equivalentes",
          "kind": "formula",
          "tex": "1+TEA = (1+TEM)^{12}\\qquad i_t = (1+i_d)^{t/d}-1",
          "note": "Dos tasas son equivalentes si producen el mismo capital final en el mismo plazo. Parcial: $TEM=(1+TNA/360)^{30}-1$ con cap. diaria."
        },
        {
          "label": "Capitalización continua",
          "kind": "formula",
          "tex": "F = P\\cdot e^{r n}\\qquad TEA = e^{r}-1",
          "cond": "Límite cuando $k\\to\\infty$."
        },
        {
          "label": "Tasa real (exacta)",
          "kind": "formula",
          "tex": "1+r = \\dfrac{1+i}{1+\\pi}",
          "cond": "Argentina / tasas altas.",
          "note": "La aproximación $r\\approx i-\\pi$ solo sirve para tasas chicas."
        },
        {
          "label": "Componentes de la tasa",
          "kind": "def",
          "tex": "i = (1+i_f)(1+i_r)(1+i_\\theta) - 1",
          "body": "Inflación × real × riesgo (riesgo país $=$ spread vs bono USA). Bancaria: spread $=i_{activa}-i_{pasiva}$."
        }
      ]
    },
    {
      "title": "Rentas y préstamos",
      "hint": "Anualidades, perpetuidades, amortización",
      "unit": "7",
      "entries": [
        {
          "label": "Anualidad vencida",
          "kind": "formula",
          "tex": "VA = C\\cdot \\dfrac{1-(1+i)^{-n}}{i}\\qquad VF = C\\cdot \\dfrac{(1+i)^n-1}{i}",
          "body": "Pagos al final. Adelantada: multiplicar por $(1+i)$."
        },
        {
          "label": "Perpetuidad",
          "kind": "formula",
          "tex": "VA = \\dfrac{C}{i}\\qquad VA = \\dfrac{C_1}{i-g}\\ (i>g)",
          "note": "Constante y creciente (Gordon). Anualidad $=$ perpetuidad desde 1 menos perpetuidad desde $t+1$."
        },
        {
          "label": "Período antes del primer flujo",
          "kind": "caution",
          "body": "La fórmula de anualidad/perpetuidad da el VP un período ANTES del primer pago. Si arranca en $t$, dividir por $(1+i)^{t-1}$ para traer a 0."
        },
        {
          "label": "VP de flujos mixtos (VAN)",
          "kind": "formula",
          "tex": "P = \\sum_{t=0}^{n} \\dfrac{F_t}{(1+i)^t}",
          "note": "Excel: VNA/NPV descuenta el primer flujo como $t=1$; el flujo de $t=0$ se suma aparte."
        },
        {
          "label": "Sistema francés",
          "kind": "formula",
          "tex": "C = \\dfrac{P\\cdot i}{1-(1+i)^{-n}}\\qquad S_t = C\\cdot \\dfrac{1-(1+i)^{-(n-t)}}{i}",
          "body": "Cuota constante; saldo $=$ VP de cuotas restantes. Amortización creciente: $A_{t+1}=A_t(1+i)$."
        },
        {
          "label": "Sistema alemán",
          "kind": "formula",
          "tex": "A = \\dfrac{P}{n}\\qquad I_t = [P-(t-1)A]\\,i\\qquad S_t = P - tA",
          "body": "Amortización constante; cuota decreciente ($C_t=A+I_t$). A la tasa del préstamo, francés y alemán son equivalentes (VP cuotas $=P$)."
        },
        {
          "label": "Sistema directo / CFT",
          "kind": "caution",
          "tex": "C = \\dfrac{P}{n} + P\\cdot i\\qquad \\text{Neto} = \\sum_t \\dfrac{Pago_t}{(1+i_{CFT})^t}",
          "note": "Directo: interés sobre capital inicial $\\Rightarrow$ costo efectivo $\\gg$ tasa declarada. CFT $=$ TIR de la financiación con comisiones; $CFT\\ge TEA$."
        },
        {
          "label": "Descuento comercial",
          "kind": "formula",
          "tex": "VA = C\\,(1 - d\\cdot n)\\qquad i = \\dfrac{d}{1-d}",
          "cond": "$d$ se aplica sobre el nominal; la equivalencia $i=d/(1-d)$ vale solo para $n=1$."
        }
      ]
    },
    {
      "title": "Evaluación de proyectos",
      "hint": "VAN, TIR, ranking",
      "unit": "8",
      "entries": [
        {
          "label": "Valor Actual Neto",
          "kind": "formula",
          "tex": "VAN = \\sum_{j=0}^{n} \\dfrac{FC_j}{(1+i)^j}",
          "cond": "$VAN>0$ aceptar; $=0$ indiferente; $<0$ rechazar.",
          "note": "Descontar flujos después de impuestos, nunca utilidades contables. $i=$ TREMA. Supone reinversión a la TREMA."
        },
        {
          "label": "Tasa Interna de Retorno",
          "kind": "formula",
          "tex": "\\sum_{j=0}^{n} \\dfrac{FC_j}{(1+TIR)^j} = 0",
          "cond": "$TIR>TREMA$ aceptar.",
          "note": "No rankear excluyentes ni flujos con varios cambios de signo. Ante conflicto manda el VAN."
        },
        {
          "label": "TER (TIR modificada)",
          "kind": "formula",
          "tex": "(1+TER)^n = \\dfrac{VF_{ingresos}}{VP_{egresos}}",
          "body": "Remedio para TIR múltiples: ingresos capitalizados y egresos descontados a la TREMA."
        },
        {
          "label": "Índice de rentabilidad",
          "kind": "formula",
          "tex": "IR = \\dfrac{VP(\\text{flujos futuros})}{I}",
          "note": "$IR>1 \\iff VAN>0$. Ordena proyectos bajo racionamiento de capital; ciego a la escala."
        },
        {
          "label": "Tasa de Fisher (conflicto)",
          "kind": "caution",
          "tex": "VAN_1(r_F) = VAN_2(r_F)",
          "body": "Cruce de perfiles de VAN de dos proyectos. Si $TREMA<r_F$ hay conflicto de ranking VAN–TIR $\\Rightarrow$ decidir por VAN; si $TREMA>r_F$ ambos coinciden."
        },
        {
          "label": "Payback (período recupero)",
          "kind": "method",
          "tex": "PR = a + \\dfrac{I - \\sum_{j=1}^{a} FC_j}{FC_{a+1}}",
          "body": "Simple ignora el valor tiempo; descontado acumula $FC_j/(1+i)^j$ ($PRCA\\ge PRS$). Ambos ignoran flujos post-recupero."
        }
      ]
    },
    {
      "title": "Flujos e impuestos",
      "hint": "FEO, escudo, terminal",
      "unit": "8",
      "entries": [
        {
          "label": "Flujo efectivo operativo",
          "kind": "formula",
          "tex": "FEO = EBIT(1-t) + Am = (V-C)(1-t) + t\\cdot Am",
          "body": "Tres formas equivalentes ($=UN+Am$). La amortización se resta solo para el IG y se suma de vuelta."
        },
        {
          "label": "Escudo fiscal",
          "kind": "formula",
          "tex": "Escudo_t = t\\cdot Am\\qquad VP_{escudo} = t\\cdot Am\\cdot a(n_{am};i)",
          "note": "Alargar la amortización deja el escudo nominal igual pero más tarde $\\Rightarrow$ $VP$ menor $\\Rightarrow$ VAN menor."
        },
        {
          "label": "Venta de activo fijo",
          "kind": "formula",
          "tex": "FF_{venta} = P_{venta} - t\\,(P_{venta} - VL)",
          "body": "$P>VL$ paga impuesto; $P<VL$ pérdida deducible; $P=VL$ neutro. Si está totalmente amortizado, toda la venta es utilidad gravada."
        },
        {
          "label": "Capital de trabajo",
          "kind": "formula",
          "tex": "\\text{Efecto en } FF_t = -\\Delta KT_t",
          "body": "Aumento $=$ egreso; reducción $=$ ingreso; al cierre se recupera todo. No genera escudo (no es gasto)."
        },
        {
          "label": "Comparar vidas distintas",
          "kind": "method",
          "tex": "VA = \\dfrac{VAN}{a(n;i)}",
          "body": "Valor/Costo Anual Equivalente o cadena de reemplazo (repetir hasta el mcm de las vidas). En costos: gana el menor CAE."
        },
        {
          "label": "Armado del flujo",
          "kind": "caution",
          "body": "Nunca incluir: amortización como egreso, costos hundidos, intereses/préstamos/aportes/dividendos. Internos, IIBB y sellos: tratarlos como un costo más."
        }
      ]
    }
  ]
};

export const economiaConceptos: Sheet = {
  "vault": "economia",
  "kind": "conceptos",
  "title": "Economía para Ingenieros",
  "subtitle": "Micro · Macro · Empresa — hoja de conceptos para el final (ITBA 61.23)",
  "notation": "$\\eta$ elasticidad, $\\varepsilon$ elast. oferta · IMg/CMg ingreso/costo marginal · $\\pi$ inflación · $r$ tasa real, $i$ nominal · $t$ alícuota IG · TREMA tasa de corte · $A=P+PN$ ecuación contable",
  "updated": "2026-06-19",
  "groups": [
    {
      "title": "Fundamentos y mercado",
      "hint": "Escasez, FPP, oferta-demanda, equilibrio",
      "unit": "1",
      "entries": [
        {
          "label": "Economía / Escasez",
          "kind": "def",
          "body": "Economía: ciencia de asignar recursos escasos entre fines alternativos. Escasez: recursos limitados frente a necesidades ilimitadas — es el fundamento del problema económico."
        },
        {
          "label": "Costo de oportunidad",
          "kind": "def",
          "body": "Valor de la mejor alternativa renunciada al tomar una decisión. Recorre todo el curso: del capital propio del dueño a la TREMA de un proyecto."
        },
        {
          "label": "FPP",
          "kind": "theorem",
          "body": "Combinaciones máximas de dos bienes con recursos y tecnología dados. Es cóncava porque los recursos no son perfectamente adaptables $\\Rightarrow$ costos de oportunidad $crecientes$.",
          "note": "Puntos interiores = ineficiencia; exteriores = inalcanzables."
        },
        {
          "label": "Ley de demanda y oferta",
          "kind": "theorem",
          "body": "Demanda: $\\uparrow P \\Rightarrow \\downarrow Q_d$ (efecto sustitución + efecto ingreso). Oferta: $\\uparrow P \\Rightarrow \\uparrow Q_s$. Ceteris paribus.",
          "cond": "ceteris paribus"
        },
        {
          "label": "Movimiento vs desplazamiento",
          "kind": "caution",
          "body": "Cambia el $precio\\ del\\ propio\\ bien$ $\\Rightarrow$ movimiento $sobre$ la curva. Cambia cualquier otra cosa (ingreso, precios relacionados, gustos, tecnología, impuestos, nº de agentes) $\\Rightarrow$ desplazamiento.",
          "note": "Error típico: atribuir a la demanda un cambio de costos — los costos mueven la $oferta$."
        },
        {
          "label": "Clasificación de bienes",
          "kind": "example",
          "body": "Sustitutos: $\\uparrow P_x \\Rightarrow \\uparrow Q_d^y$. Complementarios: $\\uparrow P_x \\Rightarrow \\downarrow Q_d^y$. Normales: $\\uparrow I \\Rightarrow \\uparrow Q_d$. Inferiores: $\\uparrow I \\Rightarrow \\downarrow Q_d$. Lujo: $\\uparrow I \\Rightarrow \\uparrow\\uparrow Q_d$."
        },
        {
          "label": "Equilibrio de mercado",
          "kind": "method",
          "body": "Ocurre donde $Q_d = Q_s$. Si $P>P_{eq}$: sobreoferta (presión a la baja); si $P<P_{eq}$: escasez (presión al alza). La curva que se desplaza marca la dirección; la pendiente de la otra reparte el cambio entre $P$ y $Q$."
        }
      ]
    },
    {
      "title": "Elasticidades",
      "hint": "Sensibilidad porcentual y conexión con el ingreso",
      "unit": "1",
      "entries": [
        {
          "label": "Elasticidad-precio demanda",
          "kind": "formula",
          "tex": "\\eta_p = \\frac{\\%\\Delta Q_d}{\\%\\Delta P}",
          "body": "Sensibilidad de $Q_d$ al precio. $|\\eta|>1$ elástica; $=1$ unitaria; $<1$ inelástica; $0$ perf. inelástica (vertical); $\\infty$ perf. elástica (horizontal)."
        },
        {
          "label": "Elasticidad e ingreso total",
          "kind": "theorem",
          "body": "Con $IT=P\\cdot Q$: si $|\\eta|>1$, $\\uparrow P \\Rightarrow \\downarrow IT$; si $|\\eta|=1$, $IT$ no cambia; si $|\\eta|<1$, $\\uparrow P \\Rightarrow \\uparrow IT$.",
          "note": "Por eso conviene encarecer un bien de demanda inelástica."
        },
        {
          "label": "Elasticidad en demanda lineal",
          "kind": "caution",
          "body": "En una demanda lineal $\\eta$ NO es constante: elástica arriba, unitaria al medio, inelástica abajo. La $pendiente$ sí es constante — pendiente $\\neq$ elasticidad."
        },
        {
          "label": "Otras elasticidades",
          "kind": "formula",
          "body": "Ingreso: $\\eta_I=\\%\\Delta Q/\\%\\Delta I$ ($<0$ inferior, $0$–$1$ normal, $>1$ lujo). Cruzada: $\\eta_{xy}=\\%\\Delta Q_x/\\%\\Delta P_y$ ($>0$ sustitutos, $<0$ complementarios). Oferta: $\\varepsilon_p=\\%\\Delta Q_s/\\%\\Delta P$, mayor en el LP."
        }
      ]
    },
    {
      "title": "Bienestar e intervención",
      "hint": "Excedentes, controles, impuestos",
      "unit": "1",
      "entries": [
        {
          "label": "Excedentes EC y EP",
          "kind": "def",
          "body": "EC: área $debajo$ de la demanda y $encima$ del precio (disposición a pagar − precio pagado). EP: área $encima$ de la oferta y $debajo$ del precio.",
          "note": "El EC va con la $demanda$, no entre oferta y precio."
        },
        {
          "label": "1er teorema del bienestar",
          "kind": "theorem",
          "body": "El equilibrio competitivo (sin externalidades) maximiza el excedente total $EC+EP$. Es la vara de eficiencia para juzgar toda otra estructura o política."
        },
        {
          "label": "Controles de precios",
          "kind": "method",
          "body": "Precio máximo (techo) por $debajo$ del eq. $\\Rightarrow$ vinculante $\\Rightarrow$ escasez ($Q_d>Q_s$), colas, mercado negro. Precio mínimo (piso) por $encima$ del eq. $\\Rightarrow$ vinculante $\\Rightarrow$ excedente (caso: salario mínimo).",
          "note": "Por el lado no vinculante el mercado opera normal."
        },
        {
          "label": "Incidencia impositiva",
          "kind": "theorem",
          "body": "El efecto sobre $P,Q$ es el $mismo$ se cobre legalmente a productor o consumidor (equivalencia fiscal). La carga cae más sobre el lado $menos$ elástico.",
          "note": "D perf. elástica + impuesto al consumidor $\\Rightarrow$ el $productor$ paga todo."
        },
        {
          "label": "Deadweight loss (DWL)",
          "kind": "formula",
          "tex": "DWL = \\tfrac{1}{2}\\, t \\cdot \\Delta Q",
          "body": "Excedente que nadie captura por operar fuera del equilibrio competitivo (triángulo). Mayor cuanto más elásticas sean oferta y demanda."
        }
      ]
    },
    {
      "title": "Producción",
      "hint": "Función de producción, productividades, escala",
      "unit": "2",
      "entries": [
        {
          "label": "Función de producción / CP vs LP",
          "kind": "def",
          "body": "$Q=F(K,L)$. Corto plazo: al menos un factor fijo (típ. $K$). Largo plazo: todos los factores variables. Las decisiones óptimas pueden ser opuestas en CP y LP."
        },
        {
          "label": "Productividad media y marginal",
          "kind": "formula",
          "body": "$PMe_L=Q/L$, $PMg_L=\\partial Q/\\partial L$. Relación promedio-marginal: $PMg>PMe \\Rightarrow$ $PMe$ crece; $PMg<PMe \\Rightarrow$ decrece; $PMg=PMe \\Rightarrow$ $PMe$ máximo."
        },
        {
          "label": "Rendimientos marginales decrecientes",
          "kind": "theorem",
          "body": "Con $K$ fijo, a partir de cierto $L$ cada trabajador adicional aporta $menos$ producción que el anterior. Fenómeno de corto plazo."
        },
        {
          "label": "Etapas de producción",
          "kind": "method",
          "body": "I: $PMe$ creciente (no racional, contratar más). II: $PMe$ decreciente con $PMg>0$ = $zona\\ racional$. III: $PMg<0$ (nunca conviene operar)."
        },
        {
          "label": "Rendimientos a escala (LP)",
          "kind": "theorem",
          "body": "Escalar todos los factores por $\\lambda$: si $Q$ crece más que $\\lambda$ $\\Rightarrow$ crecientes; igual $\\Rightarrow$ constantes; menos $\\Rightarrow$ decrecientes. Cobb-Douglas $Q=AK^\\alpha L^\\beta$: signo según $\\alpha+\\beta\\lessgtr1$.",
          "note": "Rendimientos marginales (CP) $\\neq$ rendimientos a escala (LP): son independientes."
        }
      ]
    },
    {
      "title": "Costos",
      "hint": "Económico vs contable, estructura, regla del óptimo",
      "unit": "2",
      "entries": [
        {
          "label": "Costo económico vs contable",
          "kind": "def",
          "body": "Contable: solo desembolsos efectivos. Económico = contable + costos implícitos (costo de oportunidad de recursos propios). Beneficio económico $=IT-CT_{econ}\\le$ beneficio contable."
        },
        {
          "label": "Beneficio normal",
          "kind": "def",
          "body": "Situación con beneficio económico $=0$. No es quebrar: es ganar exactamente lo mismo que la mejor alternativa de uso de los recursos."
        },
        {
          "label": "Estructura de costos CP",
          "kind": "formula",
          "body": "$CT=CF+CV$. Medios: $CFMe=CF/Q$ (siempre decreciente), $CVMe$, $CTMe=CFMe+CVMe$ (forma de U). Marginal: $CMg=dCT/dQ=dCV/dQ$.",
          "note": "El $CMg$ no incluye $CF$."
        },
        {
          "label": "CMg y geometría de costos",
          "kind": "theorem",
          "body": "$CMg=w/PMg_L$ (la forma del $CMg$ es la del $PMg$ invertida). El $CMg$ corta a $CVMe$ y a $CTMe$ en sus $mínimos$ (primero al $CVMe$)."
        },
        {
          "label": "Economías de escala (LP)",
          "kind": "def",
          "body": "$CTMe_{LP}$ = envolvente inferior de los $CTMe_{CP}$. Decreciente $\\Rightarrow$ economías de escala (rend. crecientes); creciente $\\Rightarrow$ deseconomías. EEM: menor $Q$ en el mínimo del $CTMe_{LP}$."
        },
        {
          "label": "Costo hundido (sunk)",
          "kind": "caution",
          "body": "Costo ya pagado e irrecuperable. Regla: se ignora en toda decisión hacia adelante; solo importa qué hacer ahora. No entra en el $CMg$.",
          "cond": "decisiones marginales"
        },
        {
          "label": "Regla universal del óptimo",
          "kind": "theorem",
          "tex": "IMg = CMg",
          "body": "Vale para TODA estructura de mercado. Lo que cambia entre estructuras es cómo se ve el $IMg$, no la regla. $IMg>CMg$: producir más; $IMg<CMg$: producir menos."
        }
      ]
    },
    {
      "title": "Competencia perfecta",
      "hint": "Precio-aceptante, cierre, equilibrio LP",
      "unit": "3",
      "entries": [
        {
          "label": "Los 4 supuestos",
          "kind": "def",
          "body": "Producto homogéneo, atomicidad (nadie influye en el precio), libre entrada/salida, información perfecta. Sirve como referencia de eficiencia, no como descripción literal de mercados reales."
        },
        {
          "label": "Empresa precio-aceptante",
          "kind": "formula",
          "body": "Demanda individual horizontal al precio: $P=IMg=IMe$. Óptimo de cantidad aplicando $IMg=CMg$: $\\;P=CMg$. La única decisión es cuánto producir."
        },
        {
          "label": "Cierre vs umbral de rentabilidad",
          "kind": "method",
          "body": "Punto de cierre: $P=\\min(CVMe)$ — debajo conviene cerrar. Umbral de rentabilidad: $P=\\min(CTMe)$ — debajo hay pérdidas económicas.",
          "note": "Si $\\min CVMe<P<\\min CTMe$: hay pérdida pero SIGUE operando (los $CF$ están sunk)."
        },
        {
          "label": "Curva de oferta de la empresa (CP)",
          "kind": "def",
          "body": "Es el tramo del $CMg$ que está por encima del $\\min(CVMe)$. Debajo del punto de cierre la oferta es cero."
        },
        {
          "label": "Equilibrio de largo plazo",
          "kind": "theorem",
          "tex": "P = CMg = \\min(CTMe_{LP})",
          "body": "La libre entrada/salida disciplina los beneficios hasta $\\pi$ económico $=0$ (beneficio normal). Doble condición: maximización ($P=CMg$) + cero beneficio.",
          "note": "$\\pi=0$ no es quebrar: la industria está en reposo."
        },
        {
          "label": "Eficiencia competitiva",
          "kind": "theorem",
          "body": "Eficiencia productiva (cada empresa produce al menor costo) + eficiencia asignativa ($P=CMg$). Resultado: maximiza el excedente total. Oferta LP horizontal (costos cttes) o pendiente positiva (costos crecientes, caso realista)."
        }
      ]
    },
    {
      "title": "Monopolio y poder de mercado",
      "hint": "IMg < P, Lerner, discriminación, regulación",
      "unit": "4",
      "entries": [
        {
          "label": "Causas del monopolio",
          "kind": "def",
          "body": "Recurso único, patentes/propiedad intelectual, regulación que impide competir, o monopolio natural (economías de escala persistentes hacen que una sola empresa minimice el costo total de la industria)."
        },
        {
          "label": "Ingreso marginal del monopolista",
          "kind": "formula",
          "tex": "IMg = a - 2bQ \\quad (P=a-bQ)",
          "body": "Enfrenta toda la demanda del mercado. $IMg<P$ porque para vender una unidad más hay que bajar el precio a todas. En demanda lineal: misma ordenada $a$, doble de pendiente."
        },
        {
          "label": "Decisión óptima del monopolio",
          "kind": "method",
          "body": "Aplica $IMg=CMg \\Rightarrow Q^*$; el precio $P^*$ sale de la $demanda$ evaluada en $Q^*$. Siempre $P^*>CMg$ $\\Rightarrow$ fuente del DWL.",
          "note": "Nunca opera en zona inelástica ($|\\eta|<1$), donde $IMg<0$."
        },
        {
          "label": "Índice de Lerner",
          "kind": "formula",
          "tex": "L = \\frac{P - CMg}{P} = \\frac{1}{|\\eta|}",
          "body": "Mide el poder de mercado. $L=0$ en competencia perfecta; $L\\to1$ máximo poder. Más poder $\\Leftrightarrow$ demanda más inelástica."
        },
        {
          "label": "Impuesto unitario vs lump-sum",
          "kind": "caution",
          "body": "Impuesto $t$ por unidad o $\\uparrow CMg$: $\\downarrow Q$, $\\uparrow P$. Impuesto $lump$-$sum$ (suma fija): NO cambia $Q$ ni $P$ (es costo fijo, no entra al $CMg$), solo reduce $\\pi$.",
          "note": "Trampa frecuente de parcial."
        },
        {
          "label": "Discriminación de precios",
          "kind": "method",
          "body": "1er grado (perfecta): cobra a cada uno su disposición máxima $\\Rightarrow EC=0$, $DWL=0$ (eficiente, distribución extrema). 2do grado: paquetes/tarifas autoselectivas. 3er grado: por grupos según $\\eta_i$, con $\\frac{P_i-CMg}{P_i}=\\frac{1}{|\\eta_i|}$ (más caro al grupo más inelástico).",
          "cond": "requiere poder de mercado, identificar grupos y evitar reventa"
        },
        {
          "label": "Regulación del monopolio",
          "kind": "method",
          "body": "$P=CMg$: eficiencia asignativa pero da pérdidas en monopolio natural ($CMg<CTMe$, requiere subsidio). $P=CTMe$: $\\pi=0$, sostenible pero no plenamente eficiente. También: tasa de retorno regulada, propiedad pública, partir el monopolio."
        }
      ]
    },
    {
      "title": "Oligopolio y comp. monopolística",
      "hint": "Interdependencia, juegos, diferenciación",
      "unit": "4",
      "entries": [
        {
          "label": "Competencia monopolística (eq. LP)",
          "kind": "theorem",
          "body": "Muchas empresas + producto $diferenciado$ + libre entrada. Lleva a $\\pi$ económico $=0$, pero la demanda es tangente al $CTMe$ en su tramo $descendente$ $\\Rightarrow$ exceso de capacidad ($Q^*<$EEM) y $P>CMg$.",
          "note": "Trade-off: variedad al costo de cierta ineficiencia productiva."
        },
        {
          "label": "Oligopolio: interdependencia",
          "kind": "def",
          "body": "Pocas empresas; característica clave: interdependencia estratégica — la decisión de cada una depende de las otras. Modelos: Cournot (cantidades, resultado intermedio), Bertrand (precios homogéneos $\\Rightarrow P=CMg$), Stackelberg (líder-seguidor)."
        },
        {
          "label": "Cartel",
          "kind": "caution",
          "body": "Acuerdo para producir como un monopolio único. Inherentemente $inestable$: cada miembro tiene incentivo a desviarse (producir más al precio alto). Es un dilema del prisionero repetido; necesita monitoreo y enforcement."
        },
        {
          "label": "Teoría de juegos / Nash",
          "kind": "theorem",
          "body": "Estrategia dominante: la mejor sin importar qué hagan los otros. Equilibrio de Nash: cada jugador hace lo mejor dadas las estrategias del resto (nadie se desvía unilateralmente). Dilema del prisionero: el Nash es peor para todos que cooperar."
        }
      ]
    },
    {
      "title": "PBI y cuentas nacionales",
      "hint": "Medición del producto, real vs nominal, identidades",
      "unit": "5",
      "entries": [
        {
          "label": "PBI",
          "kind": "def",
          "body": "Valor monetario de todos los bienes y servicios $finales$ producidos $dentro$ de las fronteras en un período. Bruto (no descuenta depreciación) vs Neto; Interno (territorio) vs Nacional/PNB (residentes).",
          "note": "Solo bienes finales, o equivalentemente la suma de valores agregados — nunca intermedios."
        },
        {
          "label": "PBI por el gasto",
          "kind": "formula",
          "tex": "PBI = C + I + G + (X - M)",
          "body": "Tres métodos equivalentes por construcción: gasto, ingreso (remuneraciones + excedente + depreciación + impuestos netos) y valor agregado (output − consumo intermedio por sector)."
        },
        {
          "label": "Deflactor del PBI",
          "kind": "formula",
          "tex": "\\text{Deflactor} = \\frac{PBI_{nom}}{PBI_{real}}\\times 100",
          "body": "Índice de precios de toda la producción interna (más amplio que el IPC). Captura precios sobre la mezcla del año en curso (índice de Paasche).",
          "note": "Para crecimiento real hay que deflactar antes — no usar cifras nominales."
        },
        {
          "label": "Identidad de las 3 brechas",
          "kind": "theorem",
          "tex": "(S-I) + (T-G) + (M-X) \\equiv 0",
          "body": "Sale de $C+S+T\\equiv Y\\equiv C+I+G+(X-M)$. Brecha privada + brecha fiscal + brecha externa (signo invertido) se compensan.",
          "note": "Es identidad CONTABLE, no causalidad: siempre se cumple por construcción."
        }
      ]
    },
    {
      "title": "Inflación y empleo",
      "hint": "IPC, costos de inflación, mercado de trabajo",
      "unit": "5",
      "entries": [
        {
          "label": "Inflación",
          "kind": "def",
          "body": "Aumento $sostenido$ y $generalizado$ del nivel de precios (no un pico aislado ni un solo bien). Hiperinflación: $>50\\%$ mensual (Cagan). Desinflación: bajar la $tasa$ de inflación (costoso en el CP, suele venir con recesión)."
        },
        {
          "label": "IPC y tasa de inflación",
          "kind": "formula",
          "tex": "\\pi_t = \\frac{IPC_t - IPC_{t-1}}{IPC_{t-1}}\\times 100",
          "body": "El IPC mide el costo de una canasta $fija$ (índice de Laspeyres). Sobreestima la inflación porque no captura la sustitución hacia bienes que se abarataron."
        },
        {
          "label": "Costos de la inflación",
          "kind": "example",
          "body": "Suela de zapato (menos efectivo), costos de menú (reetiquetar), pérdida de la unidad de cuenta (dolarización mental), redistribución arbitraria (pierde el acreedor nominal, gana el deudor nominal) y distorsión de incentivos."
        },
        {
          "label": "PEA, PEI y tasas",
          "kind": "def",
          "body": "Población = PEA + PEI. PEA = ocupados + desocupados. Tasa de actividad $=PEA/Pob$; de ocupación $=Ocup/Pob$; de desocupación $=Desoc/PEA$.",
          "note": "Cuidado: denominadores distintos (Población vs PEA)."
        },
        {
          "label": "Tipos de desempleo y tasa natural",
          "kind": "def",
          "body": "Friccional (búsqueda entre empleos), estructural (desajuste calidad-vacante), cíclico (ligado al ciclo). Tasa natural = friccional + estructural (independiente del ciclo). El objetivo no es desempleo cero."
        },
        {
          "label": "Ley de Okun",
          "kind": "theorem",
          "body": "Regularidad empírica: una caída del PBI real de $1\\%$ respecto del potencial se asocia a un aumento de $\\approx0{,}5$ puntos en la tasa de desempleo."
        }
      ]
    },
    {
      "title": "ODA y política fiscal",
      "hint": "Demanda/oferta agregadas, multiplicador, déficit",
      "unit": "5",
      "entries": [
        {
          "label": "Demanda agregada (DA)",
          "kind": "theorem",
          "body": "Pendiente negativa por tres efectos al $\\uparrow P$: riqueza (Pigou, $\\downarrow C$), tasa de interés ($\\uparrow r \\Rightarrow \\downarrow I$) y comercio exterior ($\\downarrow X-M$). Eje vertical: nivel general de precios $P$; horizontal: producto real $Y$."
        },
        {
          "label": "Oferta agregada (CP vs LP)",
          "kind": "theorem",
          "body": "OACP: pendiente positiva por rigideces nominales (salarios/precios pegajosos). OALP: vertical en el producto potencial $Y_*$ — en LP solo factores reales determinan $Y$, no el nivel de precios.",
          "note": "$Y<Y_*$ recesión; $Y>Y_*$ sobrecalentamiento."
        },
        {
          "label": "Multiplicador keynesiano del gasto",
          "kind": "formula",
          "tex": "k = \\frac{1}{1-PMC} = \\frac{1}{PMS}, \\quad \\Delta Y = k\\,\\Delta G",
          "body": "Un $\\Delta G$ autónomo genera un aumento del producto $mayor$ (cadena de re-gasto, serie geométrica). Ej.: $PMC=0{,}8 \\Rightarrow k=5$."
        },
        {
          "label": "Multiplicador de impuestos/transferencias",
          "kind": "caution",
          "body": "$\\Delta Y = -\\frac{PMC}{1-PMC}\\Delta T$ (impuestos) y $+\\frac{PMC}{1-PMC}\\Delta TR$ (transferencias). Menor en módulo que el del gasto: el primer peso de $T/TR$ se ahorra en parte. Presupuesto equilibrado ($\\Delta G=\\Delta T$): multiplicador $=1$.",
          "note": "No aplicar la fórmula de $G$ a $T$."
        },
        {
          "label": "Política fiscal y estabilizadores",
          "kind": "def",
          "body": "Expansiva: $\\uparrow G$ o $\\downarrow T$ $\\Rightarrow$ DA a la derecha ($\\uparrow Y,\\uparrow P$), apropiada en recesión. Estabilizadores automáticos: recaudación pro-cíclica y seguro de desempleo actúan anticíclicamente sin discreción."
        },
        {
          "label": "Déficit, deuda y financiamiento",
          "kind": "def",
          "body": "Déficit primario $=G+TR-T$; financiero = primario + intereses. Tres formas de financiarlo: deuda doméstica, deuda externa y emisión (la única necesariamente inflacionaria si la economía no crece).",
          "note": "Sostenibilidad: si $r>\\gamma$ hace falta superávit primario para que Deuda/PBI no explote."
        }
      ]
    },
    {
      "title": "Dinero y política monetaria",
      "hint": "Agregados, multiplicador, mercado de dinero, M·V=P·Y",
      "unit": "5",
      "entries": [
        {
          "label": "Funciones y agregados del dinero",
          "kind": "def",
          "body": "Funciones: medio de cambio, unidad de cuenta, reserva de valor, patrón de pago diferido. Agregados (más a menos líquidos): BM (M0) $\\subset$ M1 (circulante + cta. cte.) $\\subset$ M2 (+ caja de ahorro) $\\subset$ M3 (+ plazos fijos).",
          "note": "El dinero moderno es fiduciario; la tangibilidad NO es una característica esencial."
        },
        {
          "label": "Multiplicador del dinero",
          "kind": "formula",
          "tex": "m = \\frac{M}{BM} = \\frac{e+1}{e+r}",
          "body": "Los bancos crean dinero secundario prestando una fracción de los depósitos. $e=E/D$ (preferencia por efectivo), $r=R/D$ (encajes). $M=m\\cdot BM$.",
          "note": "$\\uparrow r$ o $\\uparrow e \\Rightarrow \\downarrow m$."
        },
        {
          "label": "Mercado de dinero",
          "kind": "theorem",
          "body": "Demanda $MD$ con pendiente negativa respecto de $r$ (el costo de oportunidad de tener dinero es la rentabilidad de activos no monetarios; motivos: transacción, precaución, especulación). Oferta $MS$ vertical (la fija el BC). Su cruce determina $r_E$."
        },
        {
          "label": "Herramientas del Banco Central",
          "kind": "method",
          "body": "Operaciones de mercado abierto (comprar/vender bonos), encajes, redescuento, intervención cambiaria, tasa de política. Régimen: instrumentos $\\to$ objetivo operativo $\\to$ meta intermedia (ancla nominal) $\\to$ objetivo final."
        },
        {
          "label": "Política monetaria y metas de inflación",
          "kind": "def",
          "body": "Expansiva: $\\uparrow MS \\Rightarrow \\downarrow r \\Rightarrow \\uparrow I,C \\Rightarrow$ DA a la derecha. Metas de inflación: objetivo explícito de IPC + comunicación transparente + independencia operativa del BC."
        },
        {
          "label": "Ecuación cuantitativa y neutralidad",
          "kind": "theorem",
          "tex": "M \\cdot V = P \\cdot Y",
          "body": "Si $V$ e $Y$ son estables, $\\Delta M \\Rightarrow \\Delta P$ (teoría cuantitativa, Friedman). Neutralidad del dinero: en el LP $\\Delta M$ cambia $P$ proporcionalmente sin afectar variables reales.",
          "note": "En el CP la política monetaria sí afecta $Y$ por rigideces."
        }
      ]
    },
    {
      "title": "U5 / U7 · Finanzas y sector externo",
      "hint": "Tasa real, bonos, acciones, TCR",
      "entries": [
        {
          "label": "Tasa de interés real (Fisher)",
          "kind": "formula",
          "tex": "1 + r = \\frac{1+i}{1+\\pi}",
          "body": "Ajusta la tasa nominal $i$ por la inflación $\\pi$ midiendo poder adquisitivo. Ex-ante usa $\\pi$ esperada; ex-post la realizada.",
          "note": "La aproximación $r\\approx i-\\pi$ NO sirve en Argentina (tasas altas): siempre Fisher exacta."
        },
        {
          "label": "Valuación de bono (renta fija)",
          "kind": "formula",
          "tex": "P^B = \\sum_{t=1}^{N}\\frac{CF_t}{(1+i)^t}",
          "body": "Precio = VP de cupones + amortización. La TIR es la tasa que iguala precio y VP de los flujos.",
          "note": "$P=100$: TIR = cupón (par); $P<100$: TIR > cupón; $P>100$: TIR < cupón."
        },
        {
          "label": "Rating crediticio",
          "kind": "def",
          "body": "Moody's/S&P/Fitch, escala AAA $\\to$ D. Corte clave en BBB-/Baa3: arriba investment grade, abajo junk. $TIR=$ tasa libre de riesgo + prima de riesgo (riesgo país = spread vs bono USA)."
        },
        {
          "label": "Acción (renta variable)",
          "kind": "formula",
          "tex": "P^A = \\frac{D}{i}",
          "body": "Sin flujo prefijado: perpetuidad de dividendos esperados $D$ descontados a la tasa ajustada por riesgo $i$. Gordon si crecen a $g$: $P^A=D_1/(i-g)$."
        },
        {
          "label": "Tipo de cambio real",
          "kind": "formula",
          "tex": "TCR = e\\cdot\\frac{P^*}{P}",
          "body": "Mide competitividad relativa. $e$ tipo de cambio nominal (pesos por dólar). Si sube $\\Rightarrow$ devaluación real $\\Rightarrow$ exportaciones más competitivas. $X-M$ entra en la DA."
        }
      ]
    },
    {
      "title": "Contabilidad",
      "hint": "Balance, devengado, resultados, amortización",
      "unit": "6",
      "entries": [
        {
          "label": "Ecuación contable / partida doble",
          "kind": "theorem",
          "tex": "Activo = Pasivo + Patrimonio\\ Neto",
          "body": "Base de la partida doble: cada operación toca $\\ge2$ cuentas y los débitos igualan a los créditos. Balance = foto (stock) a una fecha.",
          "note": "El PN es residual ($A-P$): NO es plata disponible."
        },
        {
          "label": "Devengado vs percibido",
          "kind": "caution",
          "body": "Devengado: efectos se reconocen en el período en que $ocurren$ (se factura), no cuando se cobra/paga. Es la distinción madre: separa utilidad (cuadro de resultados) de caja (flujo de fondos).",
          "note": "Una empresa rentable (devengado) puede quedarse sin caja y quebrar."
        },
        {
          "label": "Cascada del estado de resultados",
          "kind": "method",
          "body": "Ventas $-$ costos erogables $=$ EBITDA; $-$ amortizaciones $=$ EBIT (op.); $-$ intereses $=$ EBT; $-$ IG $=$ EAT (utilidad neta). Solo resultados $del\\ período$.",
          "cond": "esquema financiero (el de U8)"
        },
        {
          "label": "Amortización contable",
          "kind": "formula",
          "tex": "Am = \\frac{V.O. - V.R.}{V.U.}, \\quad V.L. = V.O. - A.A.",
          "body": "Convierte gradualmente el activo fijo en gasto. Gasto que NO eroga caja (en el flujo se suma de vuelta). Resultado por venta de un bien de uso $=P_{venta}-V.L.$",
          "note": "Los terrenos no se amortizan; la base amortizable es $V.O.-V.R.$, no $V.O.$"
        },
        {
          "label": "Previsiones vs provisiones",
          "kind": "def",
          "body": "Provisión: obligación $cierta$ devengada (sueldos a pagar, IG a pagar). Previsión: hecho de ocurrencia $eventual$ estimado (incobrables, despidos). Las cuentas regularizadoras (amortiz. acum., previsiones) restan $dentro$ del activo, no son pasivo."
        }
      ]
    },
    {
      "title": "Análisis financiero y costos",
      "hint": "Capital de trabajo, ratios, DuPont, punto de equilibrio",
      "unit": "6",
      "entries": [
        {
          "label": "Capital de trabajo y ciclo de caja",
          "kind": "formula",
          "tex": "KT = AC - PC",
          "body": "Parte del activo corriente financiada a LP (colchón de liquidez). Ciclo operativo = días inventario + días cobranza; ciclo de caja = ciclo operativo − días pago."
        },
        {
          "label": "Ratios financieros",
          "kind": "method",
          "body": "Liquidez: corriente $AC/PC$, ácida $(AC-BC)/PC$. Actividad: rotaciones (existencias vs CMV, cobranza vs ventas, pago vs compras). Endeudamiento: deuda/activo, cobertura $=EBITDA/intereses$. Rentabilidad: margen, ROE $=UN/PN$.",
          "note": "La cátedra define cobertura con EBITDA; bases de los días: existencias↔CMV, cobranza↔ventas, pago↔compras."
        },
        {
          "label": "Ecuación DuPont",
          "kind": "formula",
          "tex": "ROE = \\frac{UN}{Ventas}\\cdot\\frac{Ventas}{Activo}\\cdot\\frac{Activo}{PN}",
          "body": "Descompone el ROE en margen (ef. económica) × rotación (ef. operativa) × apalancamiento. Un mismo ROE puede venir de márgenes, rotación o deuda — diagnósticos distintos."
        },
        {
          "label": "Integración del costo de fabricación",
          "kind": "def",
          "body": "Costo de fabricación $=MP+MOD+GGF$ (materia prima + mano de obra directa + gastos generales de fabricación). Directo/indirecto (rastreabilidad) $\\neq$ fijo/variable (comportamiento ante el volumen).",
          "note": "Directo $\\neq$ variable: hay indirectos variables (energía de máquina) y fijos indirectos que van al producto en absorción."
        },
        {
          "label": "Sistemas de costeo",
          "kind": "method",
          "body": "Absorción: carga GGF $fijos$ al producto (presentación contable). Directo/variable: solo costos variables (gestión, vía contribución marginal). Estándar (control de desvíos) y ABC. Gastos de adm./comerc. nunca integran el costo del producto."
        },
        {
          "label": "Punto de equilibrio",
          "kind": "formula",
          "tex": "q^* = \\frac{CF}{p - cv} = \\frac{CF}{cm}",
          "body": "Cantidad con $IT=CT$ (beneficio nulo). $cm=p-cv$ = contribución marginal unitaria. En multiproducto, un producto puede no cubrir su costo total asignado pero sí $contribuir$ a los fijos comunes (pseudo-equilibrio).",
          "note": "Usar el costo variable unitario, no el costo medio total."
        }
      ]
    },
    {
      "title": "Cálculo financiero",
      "hint": "Valor tiempo, tasas equivalentes, anualidades, préstamos",
      "unit": "7",
      "entries": [
        {
          "label": "Valor tiempo del dinero",
          "kind": "def",
          "body": "1 peso de hoy es $equivalente$ (no igual) a $1+i$ pesos dentro de un período. Razones: inflación, preferencia temporal, incertidumbre y costo de oportunidad. Interés = retribución por el uso de capital ajeno."
        },
        {
          "label": "Capitalización y actualización",
          "kind": "formula",
          "tex": "VF = VP(1+i)^n, \\quad VP = \\sum_{t=0}^{n}\\frac{F_t}{(1+i)^t}",
          "body": "Capitalizar = llevar al futuro; actualizar (descontar) = traer al presente. Simple: $M=C(1+i\\,n)$ (lineal). Compuesto: $F=P(1+i)^n$ (exponencial, equivalencia perfecta).",
          "note": "Regla de oro: nunca sumar ni comparar dinero de fechas distintas sin llevarlo al mismo momento."
        },
        {
          "label": "Tasas equivalentes",
          "kind": "formula",
          "tex": "i_e = \\left(1+\\frac{i}{k}\\right)^{k} - 1, \\quad TEM = \\left(1+\\frac{TNA}{360}\\right)^{30}-1",
          "body": "TNA nominal (declarada), proporcional $i_p=i/k$, efectiva (TEA). Dos tasas son equivalentes si dan el mismo capital final: $(1+i/k)^k=(1+j/p)^p$.",
          "note": "A tasas efectivas no se aplica proporcionalidad: la tasa de 80 días es $(1+i_{30})^{80/30}-1$."
        },
        {
          "label": "Anualidades",
          "kind": "formula",
          "tex": "VA = C\\cdot\\frac{1-(1+i)^{-n}}{i}, \\quad VF = C\\cdot\\frac{(1+i)^n-1}{i}",
          "body": "$n$ cuotas constantes $C$. Adelantada $=$ vencida $\\times(1+i)$. El factor $a_{n,i}$ convierte cuota en VP y viceversa: herramienta de 'contado vs cuotas' y de préstamos."
        },
        {
          "label": "Perpetuidades",
          "kind": "formula",
          "tex": "VP = \\frac{C}{i}, \\quad VP_{Gordon} = \\frac{C_1}{i-g}",
          "body": "Flujo $C$ por siempre desde $t{=}1$. Creciente (Gordon) exige $i>g$ y usa el flujo del período próximo.",
          "note": "El VP queda UN período antes del primer flujo; diferida desde $t{+}1$: $\\frac{C}{i}\\cdot\\frac{1}{(1+i)^t}$."
        },
        {
          "label": "Sistemas de amortización",
          "kind": "method",
          "body": "Francés: cuota constante $=P/a_{n,i}$, interés sobre saldo. Alemán: amortización constante $P/n$, cuota decreciente. Directo: interés sobre el capital $inicial$ $\\Rightarrow$ costo efectivo $>$ tasa declarada.",
          "note": "Francés y alemán son equivalentes a la tasa del préstamo; el saldo del francés es el VP de las cuotas restantes."
        },
        {
          "label": "Descuento comercial y CFT",
          "kind": "formula",
          "tex": "VA = C(1 - d\\cdot n), \\quad i = \\frac{d}{1-d}",
          "body": "Descuento $d$ aplicado sobre el valor nominal; la tasa implícita es mayor. CFT = TIR del flujo sobre el $neto$ recibido (incluye comisiones y gastos) — ni la TNA ni la TEA miden el costo real con comisiones."
        }
      ]
    },
    {
      "title": "Evaluación de proyectos",
      "hint": "Flujo de caja, FEO, escudo fiscal, VAN/TIR",
      "unit": "8",
      "entries": [
        {
          "label": "Principio rector: caja, no contabilidad",
          "kind": "caution",
          "body": "El flujo es la diferencia entre pesos cobrados y pagados (percibido), después de impuestos e $incremental$ (con proyecto − sin proyecto). Los ahorros también son ingresos; incluye inversión en activos y en capital de trabajo.",
          "note": "Excluir: costos hundidos, intereses y cuotas del préstamo, dividendos y costos prorrateados que no varían."
        },
        {
          "label": "FEO (flujo de efectivo operativo)",
          "kind": "formula",
          "tex": "FEO = UN + Am = (V-C)(1-t) + t\\cdot Am = EBIT(1-t) + Am",
          "body": "Se parte del cuadro de resultados proyectado y se corrige lo contable a caja. La amortización se resta para calcular el IG y se vuelve a sumar porque no es salida de caja.",
          "note": "No restar la amortización del flujo (error #1)."
        },
        {
          "label": "Escudo fiscal",
          "kind": "formula",
          "tex": "Escudo = t \\cdot Am",
          "body": "Único efecto de caja de la amortización: impuesto que no se paga. Si se alarga el plazo de amortización, el escudo total nominal es igual pero se cobra más tarde $\\Rightarrow$ menor VP $\\Rightarrow$ VAN $menor$.",
          "cond": "amortización más rápida $\\Rightarrow$ VAN mayor"
        },
        {
          "label": "Flujo por venta de activo (FEE)",
          "kind": "formula",
          "tex": "FF_{venta} = P_{venta} - t\\,(P_{venta} - VL)",
          "body": "Lo gravado es la utilidad contable de venta (mercado − valor de libro). El capital de trabajo se recupera al final como ingreso.",
          "note": "Si el activo está totalmente amortizado ($VL=0$), toda la venta es utilidad gravada."
        },
        {
          "label": "VAN — criterio rector",
          "kind": "formula",
          "tex": "VAN = \\sum_{j=0}^{n}\\frac{FC_j}{(1+i)^j}, \\quad i = TREMA",
          "body": "Ganancia en pesos de hoy por encima del costo del capital. Aceptar si $VAN>0$. $VAN=0$ no es 'no ganar nada': es ganar exactamente el beneficio normal."
        },
        {
          "label": "TIR y TREMA",
          "kind": "def",
          "body": "TIR: tasa que hace $VAN=0$; aceptar si $TIR>TREMA$. TREMA: costo de oportunidad del capital del inversor (tasa de corte y de descuento). En proyectos independientes convencionales VAN y TIR coinciden.",
          "note": "Los intereses no van en el flujo: su costo ya vive en la TREMA."
        },
        {
          "label": "TIR múltiple",
          "kind": "caution",
          "body": "Si el flujo cambia de signo más de una vez (no convencional), la ecuación del VAN puede tener varias raíces — la TIR pierde sentido. Usar VAN o la TER: $(1+TER)^n = VF_{ingresos}/VP_{egresos}$."
        },
        {
          "label": "Conflicto VAN-TIR (excluyentes)",
          "kind": "method",
          "body": "En mutuamente excluyentes pueden ordenar distinto por diferencias de escala o de perfil temporal. A la izquierda de la tasa de Fisher manda el $VAN$ (su hipótesis de reinversión a la TREMA es la realista).",
          "cond": "vidas distintas: homogeneizar antes (cadena de reemplazo o CAE)"
        },
        {
          "label": "Payback y CAE",
          "kind": "method",
          "body": "Payback: tiempo hasta recuperar la inversión (PRS ignora el valor tiempo; ambos ignoran lo posterior al recupero). CAE/Valor Anual: el VAN repartido como renta constante $VA=VAN/a(n;i)$ — entre máquinas de costos gana el de menor CAE."
        }
      ]
    }
  ]
};
