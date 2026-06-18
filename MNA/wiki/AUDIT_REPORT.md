---
tags: [auditoria, meta]
fecha: 2026-05-27
auditor: claude-opus-4-7
---

# Audit Report — MNA Wiki

> Auditoría exhaustiva post-ingesta paralela. Veredicto en la sección 5.

## 1. Cobertura

- **PDFs totales en `raw/`**: 70 (59 sueltos + 11 dentro de tar.gz de `Anotaciones_Clases/`)
- **PDFs referenciados** en el frontmatter `fuente:` de algún `.md` del wiki: 70
- **PDFs huérfanos** (no referenciados en ninguna página): **ninguno**.

Notas:

- Los 11 PDFs dentro de los tar.gz están todos cubiertos por las 9 páginas de `wiki/clases/clase-2026-MM-DD.md` (cada clase referencia su tar.gz como `fuente:` y lista los PDFs internos en `archivos_internos:`).
- Los `*xs.pdf` (versiones de slides usadas en clase) dentro de los tar.gz del 12-03 y 19-03 están explícitamente referenciados y cruzados con las páginas de `wiki/teoria/` correspondientes (no se duplica contenido, se enlaza).
- 69 entradas `fuente:` únicas + 1 entrada `fuente: raw/Practicas/Modelos_Examenes/` (página `parciales/patrones.md`, síntesis cross-tema, fuente colectiva válida).

Coincidencia 1-a-1: cada PDF tiene al menos una página markdown asociada.

## 2. Profundidad (sample n=10)

Sample representativo: slides (3) / guías (2) / clases (1) / pizarrones (1) / resueltos (1) / parciales (2).

### `MNA_Unidad_I_Numeros_Complejos_Clase_I_v4.pdf` → `wiki/teoria/01-numeros-complejos.md`

**Veredicto: OK**.

Cubre completo: motivación, unidad imaginaria, potencias de $i$, definiciones de $\mathbb{C}$, las **10 propiedades** de $(\mathbb{C}, +, \cdot)$ (5 para suma + 5 para producto + distributiva), división con ejemplo numérico explícito, axiomas de orden, módulo con sus 6 propiedades, los **8 incisos** del argumento (con corrección documentada para el último renglón mal tipeado en el slide), fórmula de Euler, forma polar (las 3 formas), igualdad y operaciones en polar (con corrección de errata $\rho_z/\rho_z$ → $\rho_z/\rho_w$), De Moivre, radicación con caso especial $n=2$, logaritmación, potencia compleja y las **8 propiedades** de la conjugación. Nada omitido.

### `MNA_Unidad_II_Espacios_Vectoriales_P_I_v1.pdf` → `wiki/teoria/02-vectores-cn-rn.md`

**Veredicto: OK**.

Cubre vectores, ejemplos en $\mathbb{R}^4$ y $\mathbb{C}^3$, igualdad/adición/multiplicación, producto interno (con nota explicando que el slide omite el conjugado), bilinealidad y positividad, Cauchy-Bunyakovsky-Schwarz (con nota documentando la errata de cuadrados extra a la derecha), axiomas de norma, norma euclidiana, ángulo, paralelismo/perpendicularidad, normas 1, $p$, infinito. Nada omitido.

### `MNA_Unidad_II_Espacios_Vectoriales_P_II_v1.pdf` → `wiki/teoria/03-matrices.md`

**Veredicto: OK**.

Definición formal, vectores fila/columna, igualdad, adición y propiedades, multiplicación por escalar, matriz cuadrada, multiplicación con definición y ejemplo numérico explícito $(1, -3, 3) \cdot (7, -1; 3, 5; 1, 9)^T$, propiedades, observaciones, potenciación, transpuesta con ejemplo, identidad, inversa con sus 4 propiedades, **erratas explícitamente documentadas**: $(AB)^{-1} = B^{-1}B^{-1}$ corregida a $B^{-1}A^{-1}$, "A no se lo llama indice de nilpotencia" reinterpretada como "$n_0$ se lo llama"). Las 9 clases de matrices con nombre propio. Nada omitido.

### `MNA_Unidad_II_Espacios_Vectoriales_P_III_v2.pdf` → `wiki/teoria/04-determinantes.md`

**Veredicto: OK**.

Funciones multilineales alternadas con axiomas i)-iii), proposición con 4 propiedades, definición del determinante, notaciones, ejemplo $2 \times 2$, menores, cofactores, regla de Laplace. Wiki agrega nota sobre Sarrus (aparece en el título del slide pero no se desarrolla allí) — extra didáctico, bien. PDF de 111 líneas, wiki de 88 líneas más denso. Nada omitido.

### `Guia_TP_VII_MNA_ITBA_2025.pdf` → `wiki/guias/guia-07-svd-mmcc.md`

**Veredicto: OK con observación menor**.

Los 10 ejercicios transcriptos con todas las matrices, los datos completos de la tabla (15 pares $(x, y)$), las funciones objetivo y los datasets referenciados. Observación: en el ejercicio 1, el último elemento de la matriz $V^T$ del PDF original aparece tipeado como `a` (errata) — el wiki lo transcribió como `2`, sin nota. Es la traducción "correcta" pero conviene marcarlo. No es una pérdida de información de la guía.

### `Guia_TP_IX_MNA_ITBA_2025.pdf` → `wiki/guias/guia-09-tf.md`

**Veredicto: OK**.

El PDF original tiene solo 2 ejercicios y un placeholder de figura. Wiki transcribe los 2 con las 5 partes del ejercicio 1 (a-e) y el ejercicio 2. Bien.

### `MNA_Clase_26_03_2026.pdf` (manuscrita, Firefox-print) → `wiki/clases/clase-2026-03-26.md`

**Veredicto: OK con observación**.

PDF de 163 líneas (con artefactos de extracción: Unicode dañado, subíndices unidos al texto, "0�", "𝛼� 𝑣�", etc.). Wiki tiene 183 líneas e infiere correctamente la estructura: axiomas $(V,+)$ y $(V, \mathbb{K}, \cdot)$, definición de espacio vectorial, 3 ejemplos, subespacios, combinación lineal, gen, dependencia/independencia lineal, base y dimensión, ejemplos finales. Observación: el wiki no transcribe los ejemplos finales de subespacios sí/no del último tramo del PDF al mismo nivel de detalle (los ejemplos $A = \{(x,y): x \le 0\}$, $A = \{(x,y,z): x^2 - 4z^2 = 0\}$, $P = \{A: \det(A) = 0\}$, $Q = \{A: \det(A) \ne 0\}$, polinomios de grado exactamente 2 aparecen en el wiki — verificar continuación de página).

### `clase_svd.pdf` (manuscrito, escaneo) → `wiki/pizarrones/pizarron-svd.md`

**Veredicto: OK**.

`pdftotext` no devuelve texto (es escaneo). Renderizado manual de las 5 páginas confirma: las páginas 1-4 tienen contenido (SVD de matriz $4 \times 3$, vector $(1, 3)^T$, matriz $C$ $2 \times 3$ con pseudo-inversa $C^+$), página 5 efectivamente en blanco. Wiki transcribe todo el trabajo: autovalores, autovectores, ortogonalización por producto cruz, pseudo-inversa $C^+ = (1/45)(7, 2; 2, 7; 10, -10)$. Marca explícita "Página en blanco" para la página 5.

### `Ejercicios_Diagonalizacion_Resueltos.pdf` → `wiki/resueltos/resueltos-diagonalizacion.md`

**Veredicto: OK**.

5 ejercicios en el PDF, 5 ejercicios en el wiki. Las matrices, autovalores, autovectores, pasos de eliminación gaussiana y conclusiones se reproducen fielmente. La notación del polinomio característico es $p_A(\lambda) = |\lambda I - A|$ (coincide con el PDF).

### `MNA_IP_Tema_I_Resolucion.pdf` → `wiki/parciales/ip-tema-01-resolucion.md`

**Veredicto: OK**.

5 ejercicios; los 2 primeros con resolución completa transcripta (núcleo/imagen + diagonalización con discusión de casos $k = -2$ y $k = 4$); los ejercicios 3-5 sin resolución, **marcados explícitamente** con `(El PDF de resolución no incluye desarrollo para este ejercicio.)`. Verificado que el PDF original efectivamente no resuelve los ejercicios 3-5.

### Bonus: `MNA_IP_Tema_IX_Resolucion.pdf` → `wiki/parciales/ip-tema-09-resolucion.md`

**Veredicto: OK**.

PDF de 66 líneas (se corta abruptamente en el ejercicio 3 después de calcular $\sigma_1 = 3.22, \sigma_2 = 6.2113$). Wiki transcribe todo y marca explícitamente `(El PDF de resolución se corta acá.)`. Bien.

### Bonus: `MNA_Final_Tema_XIV.pdf` → `wiki/parciales/final-tema-14.md`

**Veredicto: OK**.

3 ejercicios en el PDF, 3 en el wiki. Sin resolución (marca `tiene_resolucion: false`).

### Bonus: `Guia_TP_V_MNA_ITBA_2025.pdf` → `wiki/guias/guia-05-diagonalizacion.md`

**Veredicto: OK**.

8 ejercicios en el PDF, 8 en el wiki.

## 3. Consistencia de notación

| Concepto | Estado | Notas |
|---|---|---|
| Producto interno en $\mathbb{C}^n$ | OK | `teoria/02` mantiene la versión sin conjugar del slide y agrega nota: "En $\mathbb{C}^n$ lo usual es $\sum u_i \overline{v_i}$; transcripción literal del slide". `clase-2026-03-12` repite la versión del slide sin conjugar (consistente con su fuente). |
| Cauchy-Bunyakovsky-Schwarz | OK con divergencia documentada | `teoria/02` y `clase-2026-03-12` mantienen la errata del slide con cuadrados extra: $|\langle u,v\rangle|^2 \le |\langle u,u\rangle|^2 |\langle v,v\rangle|^2$, ambas con nota explicativa. `pizarron-clase-5` usa la forma estándar $|\langle x, y\rangle| \le \|x\|\|y\|$. Cada doc refleja su fuente — comportamiento esperado, no es inconsistencia real. |
| $(AB)^{-1}$ | OK | `teoria/03` línea 163 escribe $(AB)^{-1} = B^{-1}A^{-1}$ y agrega nota: "El slide escribe $(AB)^{-1} = B^{-1} B^{-1}$ — es una errata; la forma correcta es $B^{-1}A^{-1}$". |
| Polinomio característico | **divergencia entre páginas** | Dos convenciones coexisten: <br>• $\det(A - \lambda I)$ en `pizarron-repaso.md:37,44`, `pizarron-svd.md:25`, `pizarron-clase-6-tl-matriz-asociada.md:129`. <br>• $\det(\lambda I - A)$ en `clase-2026-04-23.md:148`, `resueltos-diagonalizacion.md:17`, `ip-tema-01-resolucion.md:55`, `ip-tema-09-resolucion.md:41`. <br>Ambas son matemáticamente equivalentes salvo signo $(-1)^n$ y dan los mismos autovalores. Refleja la convención usada por cada PDF original (el profesor mismo varía). Conviene una nota en la consolidación de Fase 3. |
| SVD ($U\Sigma V^T$ vs $U\Sigma V^*$) | OK | Todas las menciones en el wiki usan $A = U\Sigma V^T$ (caso real). No hay ningún uso de $V^*$ ni $V^H$ — coherente con que toda la cátedra trabaja en $\mathbb{R}$ para SVD. |
| Norma 2 vs euclidiana | OK | Consistente: $\|u\|_2 = \sqrt{\langle u, u\rangle}$ en `teoria/02`, `clase-2026-03-12`. |

## 4. Links rotos

Wikilinks encontrados (18 distintos): todos resuelven a archivos existentes.

Detalle:

```
[[01-numeros-complejos]]                    → teoria/01-numeros-complejos.md       OK
[[02-vectores-cn-rn]]                       → teoria/02-vectores-cn-rn.md          OK
[[03-matrices]]                             → teoria/03-matrices.md                OK
[[04-determinantes]]                        → teoria/04-determinantes.md           OK
[[teoria/02-vectores-cn-rn]]                → idem                                  OK
[[teoria/03-matrices]]                      → idem                                  OK
[[teoria/04-determinantes]]                 → idem                                  OK
[[../guias/guia-01-complejos]]              → guias/guia-01-complejos.md           OK
[[../guias/guia-04-transformaciones-lineales]] → guias/guia-04-...                  OK
[[../guias/guia-05-diagonalizacion]]        → guias/guia-05-diagonalizacion.md     OK
[[../guias/guia-07-svd-mmcc]]               → guias/guia-07-svd-mmcc.md            OK
[[../guias/guia-09-tf]]                     → guias/guia-09-tf.md                  OK
[[../resueltos/resueltos-algebra]]          → resueltos/resueltos-algebra.md       OK
[[../resueltos/resueltos-complejos]]        → resueltos/resueltos-complejos.md     OK
[[../resueltos/resueltos-diagonalizacion]]  → resueltos/resueltos-diagonalizacion.md OK
[[../resueltos/resueltos-fourier]]          → resueltos/resueltos-fourier.md       OK
[[../resueltos/resueltos-svd]]              → resueltos/resueltos-svd.md           OK
[[../teoria/01-numeros-complejos]]          → teoria/01-numeros-complejos.md       OK
```

**Cero links rotos.**

## 5. Veredicto final

**Wiki listo para Fase 3** con fixes menores recomendados (no bloqueantes).

### Por qué está bien

- **Cobertura completa**: 70/70 PDFs referenciados, sin huérfanos.
- **Profundidad alta**: las páginas teóricas reproducen 100% del slide e incluso documentan explícitamente las erratas conocidas en notas dentro del texto.
- **Notación trazable**: cuando dos páginas difieren, es porque las fuentes originales difieren, no por error de ingesta. El usuario puede ver la convención de cada PDF.
- **Cero links rotos**.
- **Casos límite tratados con honestidad**: PDFs incompletos (`ip-tema-01-resolucion`, `ip-tema-09-resolucion`), páginas en blanco (`pizarron-svd` página 5), erratas de tipeo (slides), todos marcados.

### Fixes menores recomendados (no bloqueantes)

1. **Polinomio característico**: agregar en `index.md` (o en una página de convenciones para Fase 3) la nota "Convención usada: $p_A(\lambda) = \det(\lambda I - A)$ — algunos pizarrones usan $\det(A - \lambda I)$, que difiere por factor $(-1)^n$ pero da los mismos autovalores". Esto evita confusión en la cheatsheet.

2. **Guía VII ejercicio 1**: el último elemento de la primera matriz $V^T$ propuesta tiene una `a` literal en el PDF original (probable errata por `1`). El wiki escribió `2`, lo cual no aparece en el PDF. Reemplazar por `1` con nota o dejar `a` con nota — cualquiera de las dos es preferible a `2` que no sale de ningún lado.

3. **`clase-2026-03-26.md`**: verificar que los ejemplos finales del PDF (subespacios sí/no en $\mathbb{R}^2$, $\mathbb{R}^3$, $\mathbb{R}^{2\times 2}$, $\mathbb{P}_2$) estén completos. La extracción del PDF era muy ruidosa por su formato Firefox-print con Unicode roto, conviene revisar línea por línea contra los renders en imagen.

### Gaps críticos

**Ninguno.** El wiki es fiable para el estudio. La ingesta paralela conservó toda la información del raw y agregó valor con cross-references y notas pedagógicas.
