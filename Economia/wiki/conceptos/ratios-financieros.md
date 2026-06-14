---
tags: [unit-06, formula]
aliases: [índices financieros, razones financieras]
---

## Definición

**Ratios (índices) financieros:** cocientes entre partidas de los estados contables que miden la **solidez y salud de la estructura financiera**: posición de liquidez, eficiencia operativa, endeudamiento y rentabilidad. Propósitos: diagnóstico (liquidez, rentabilidad y riesgo), fijación de metas a los administradores por parte de accionistas y acreedores, análisis de competidores, y etapa previa al planeamiento financiero.

## Las cuatro familias

### Liquidez (¿puede pagar lo de corto plazo?)

$$Liquidez\ corriente = \frac{AC}{PC} \qquad Prueba\ ácida = \frac{AC - BC}{PC} \qquad Liquidez\ absoluta = \frac{Disp}{PC}$$

**Donde:**
- $AC$: activo corriente
- $PC$: pasivo corriente
- $BC$: bienes de cambio (lo menos líquido del AC)
- $Disp$: disponibilidades (caja y bancos)

### Actividad (¿qué tan rápido gira?)

$$PPC = \frac{Créditos\ por\ ventas \times 360}{Ventas\ anuales\ a\ crédito} \qquad PPP = \frac{Deudas\ comerciales \times 360}{Compras}$$

$$Días\ de\ existencias = \frac{BC \times 360}{CMV} \qquad Rotación\ de\ activos = \frac{Ventas}{Activo}$$

**Donde:**
- $PPC$: período promedio de cobranza (días)
- $PPP$: período promedio de pago (días)
- $CMV$: costo de la mercadería vendida

### Endeudamiento (¿cómo se financia y cuánto aguanta?)

$$Endeudamiento\ total = \frac{Deuda\ total}{Activo} \qquad \frac{Deuda\ LP}{Capital} \qquad Cobertura\ de\ intereses = \frac{EBITDA}{Intereses}$$

**Donde:**
- $EBITDA$: utilidades antes de intereses, impuestos y amortizaciones
- $Intereses$: pagos anuales de intereses

⚠️ **Definición de cátedra:** cobertura con **EBITDA** ("utilidades antes de int., imp., amort."). Otros textos usan EBIT — verificar el enunciado.

### Rentabilidad (¿cuánto rinde?)

$$Margen\ neto = \frac{Utilidad\ neta}{Ventas} \qquad ROE = \frac{Utilidad\ neta - Div.\ preferidas}{PN} \qquad Rent.\ operativa = \frac{EBIT}{Activo}$$

**Donde:**
- $ROE$: rentabilidad sobre el patrimonio neto
- $PN$: patrimonio neto
- $EBIT$: utilidad operativa

Rendimiento total para el accionista (mercado, no libros):

$$R = \frac{(PPA_f - PPA_p) + Dividendos}{PPA_p}$$

**Donde:**
- $PPA_p, PPA_f$: precio por acción al principio y al final del período

## Ejemplo

Con la ecuación de DuPont, los ratios se encadenan: en GP5 Ej. 5, con $PC = 55$ y liquidez corriente 1,4 sale $AC = 77$; la prueba ácida 1 da $BC = 22$; la absoluta 0,2 da $Disp = 11$; 72 días de existencias dan $CMV = 110$; 90 días de crédito dan $Ventas = 176$; ROE 40% sobre $PN = 40$ da $UN = 16$. Un balance entero reconstruido desde 8 ratios — ver [[ejercicios/gp5-informacion-contable]].

## Intuición / Por qué importa

- Un ratio aislado dice poco: se compara **contra la historia propia, la industria y los covenants** del acreedor.
- Liquidez y rentabilidad suelen tensionarse: caja ociosa es segura pero no rinde.
- El banco mira cobertura de intereses y liquidez antes de renovar un préstamo (GP5 Ej. 6: cobertura 3,9 < 5 exigido → no renueva).

## Errores comunes / Distinciones

- **Mezclar bases de los días:** existencias contra **CMV**; cobranza contra **ventas a crédito**; pago contra **compras**.
- **Cobertura con EBIT vs EBITDA:** cambia el resultado (en GP5 Ej. 5: intereses 4,5 vs 7).
- **ROE alto no siempre es buena gestión:** puede ser pura deuda (ver [[ecuacion-dupont]]).
- Comparar ratios de balances a **fechas distintas** sin ajustar por inflación (lo corrige la Unidad 7).

## Relacionado con
- [[ecuacion-dupont]]
- [[capital-de-trabajo]]
- [[ciclo-de-caja]]
- [[ebit-ebitda]]
- [[balance-patrimonial]]
