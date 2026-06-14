# FEATURES — Bloques semánticos: blockquotes etiquetados vs callouts de Obsidian

> Guía temática del **Designer de documentación** (StudyVaults). Profundiza la sección 4 de
> `DESIGN.md` (no la repite). Define con precisión **cómo** marcar definiciones, teoremas,
> observaciones y avisos en una página `.md` del wiki publicable.
>
> **Regla madre (no negociable):** el estilo canónico es el **blockquote con etiqueta en
> negrita y punto** (`> **Definición.**`). Es lo que ya usan los 7 vaults (0 callouts medidos,
> 0 Dataview). Los callouts nativos `[!note]`/`[!warning]`/`[!example]` son una **opción
> documentada que NO se usa por defecto**.
>
> **Output en español rioplatense, conciso.** Los vaults originales son **SOLO LECTURA**: esto
> describe el formato del repo publicable, nunca toca los vaults fuente (incluido SDS, que
> tiene `index.md`/`log.md` en la raíz en vez de `wiki/`).

---

## 0. TL;DR (si leés una sola cosa, leé esto)

1. **Por defecto, todo bloque semántico es un blockquote etiquetado:** `> **Etiqueta.** Texto`.
2. **Enunciado formal** (definición / teorema / proposición / lema / corolario) → **siempre blockquote**.
3. **Comentario al margen** (una aclaración corta) → **párrafo con etiqueta en negrita**, sin `>`.
4. **Aviso** (cuidado / trampa / flag) → blockquote con **dos puntos**: `> **Cuidado:** …`.
5. **Callouts `[!type]`** → **prohibidos por defecto**. Solo si un vault los adopta explícitamente en su `CLAUDE.md`. Nunca los introduzcas vos.
6. La etiqueta va **en negrita**, seguida de **punto** (enunciados) o **dos puntos** (avisos) y **un espacio**.

---

## 1. Las dos sintaxis, lado a lado

### 1.1 Canónica — blockquote con etiqueta en negrita (USAR SIEMPRE)

```markdown
> **Definición.** Texto de la definición.
```

Renderiza como una cita con la palabra "Definición." en negrita al inicio. Es Markdown
vanilla: funciona en Obsidian, en GitHub, en cualquier renderer, y en texto plano se lee igual.

### 1.2 Nativa de Obsidian — callout `[!type]` (NO usar por defecto)

```markdown
> [!note] Definición
> Texto de la definición.
```

Renderiza como una caja coloreada con ícono. **Solo funciona en Obsidian** (en GitHub se ve
como un blockquote roto con `[!note]` literal). Por eso queda fuera del estándar.

### 1.3 Tabla de decisión rápida

| Situación | Sintaxis | Ejemplo |
|---|---|---|
| Definición / teorema / proposición / lema / corolario | Blockquote etiquetado | `> **Teorema.** …` |
| Observación, nota, ejemplo, notación (formal, en bloque) | Blockquote etiquetado | `> **Observación.** …` |
| Aclaración corta al margen (no formal) | Párrafo etiquetado (sin `>`) | `**Observación.** …` |
| Aviso / advertencia / error común | Blockquote con dos puntos | `> **Cuidado:** …` |
| Caja coloreada con ícono | Callout `[!type]` | **No usar** (salvo opt-in del vault) |

---

## 2. Catálogo de etiquetas canónicas

Todas van **en negrita** dentro del blockquote. Punto final tras la palabra para enunciados;
dos puntos para avisos.

| Etiqueta | Puntuación | Uso | ¿Blockquote o párrafo? |
|---|---|---|---|
| `**Definición.**` | punto | Concepto formal, suele cerrar con `$$…$$` | Blockquote |
| `**Teorema.**` | punto | Resultado central, demostrable | Blockquote |
| `**Proposición.**` | punto | Resultado menor / auxiliar | Blockquote |
| `**Lema.**` | punto | Paso intermedio hacia un teorema | Blockquote |
| `**Corolario.**` | punto | Consecuencia directa de un teorema | Blockquote |
| `**Observación.**` | punto | Comentario formal que merece destaque | Blockquote o párrafo según largo |
| `**Nota.**` | punto | Salvedad sobre la fuente / fidelidad al material | Blockquote o párrafo |
| `**Ejemplo.**` | punto | Caso concreto ilustrativo | Blockquote |
| `**Notación.**` | punto | Convención simbólica que se va a usar | Blockquote o párrafo |
| `**Cuidado:**` | dos puntos | Error frecuente, sutileza peligrosa | Blockquote |
| `**Trampa:**` | dos puntos | Trampa de examen / del enunciado (uso real en PAW, Derecho) | Blockquote |
| `**Flag:**` | dos puntos | Marca de atención / pendiente conceptual | Blockquote |

Reglas de puntuación, **deterministas**:

- Enunciados (Definición, Teorema, Proposición, Lema, Corolario, Observación, Nota, Ejemplo, Notación) → **punto** tras la palabra: `**Teorema.**`.
- Avisos (Cuidado, Trampa, Flag) → **dos puntos**: `**Cuidado:**`.
- Siempre **un único espacio** entre la etiqueta y el texto. Nunca dos, nunca cero.
- La etiqueta es la **primera** cosa del bloque, en negrita completa (incluida la puntuación dentro del `**…**`).

---

## 3. Regla determinista: ¿blockquote o párrafo?

Ante la duda, aplicá este criterio binario (no es opinable):

- **¿Es un enunciado formal** (definición, teorema, proposición, lema, corolario)**?** → **BLOCKQUOTE.** Sin excepción, aunque sea de una línea.
- **¿Es un comentario al margen** corto, una aclaración de criterio, una notación liviana**?** → **PÁRRAFO con etiqueta en negrita** (sin `>`).
- **¿Contiene un display `$$…$$` que pertenece al enunciado?** → **BLOCKQUOTE** (la fórmula va dentro del bloque, prefijada con `> `).
- **¿Es un aviso de error/trampa?** → **BLOCKQUOTE con dos puntos**.

Ejemplo de la diferencia (ambos válidos, cada uno en su lugar):

```markdown
> **Definición.** Una matriz $A \in \mathbb{R}^{n \times n}$ es **simétrica** si $A = A^{T}$.

El espectro de una matriz simétrica es real. **Observación.** Esto vale incluso si $A$ no es
invertible: no se exige nada sobre el determinante.
```

El primero es un enunciado → blockquote. El segundo es una aclaración pegada a la prosa →
párrafo etiquetado en línea.

---

## 4. Formato interno del blockquote (las reglas finas)

### 4.1 Una entrada simple

```markdown
> **Definición.** Sean $u, v \in \mathbb{K}^n$. El producto interno es
> $$\langle u, v \rangle = \sum_{i=1}^{n} u_i\, \overline{v_i}$$
```

- **Cada línea** del blockquote (incluido el display LaTeX) empieza con `> `.
- El `$$…$$` que pertenece al enunciado **va adentro** del bloque, no afuera.
- No dejes una línea `> ` vacía huérfana al final del bloque.

### 4.2 Varias entradas del mismo tipo → pluralizar y enumerar

Cuando hay varias definiciones/propiedades juntas, **pluralizá la etiqueta** y usá `i)`, `ii)`,
`iii)` (enumeración romana en minúscula, uso real de MNA):

```markdown
> **Propiedades.** Para todo $u, v, w \in \mathbb{K}^n$ y $\alpha \in \mathbb{K}$:
> i) $\langle u, v \rangle = \overline{\langle v, u \rangle}$
> ii) $\langle \alpha u, v \rangle = \alpha \langle u, v \rangle$
> iii) $\langle u, u \rangle \ge 0$, con igualdad sólo si $u = 0$
```

Plurales canónicos: `**Definiciones.**`, `**Propiedades.**`, `**Observaciones.**`, `**Ejemplos.**`.

### 4.3 Multi-párrafo dentro de un mismo bloque

Para separar párrafos dentro del mismo blockquote, usá una **línea `> ` vacía** entre ellos
(no dos blockquotes separados):

```markdown
> **Teorema (espectral).** Si $A \in \mathbb{R}^{n \times n}$ es simétrica, entonces es
> diagonalizable por una matriz ortogonal y todos sus autovalores son reales.
>
> En particular, existe una base ortonormal de $\mathbb{R}^n$ formada por autovectores de $A$.
```

Si querés nombrar el teorema, va entre paréntesis dentro de la negrita: `**Teorema (espectral).**`.

### 4.4 Demostraciones

La demostración va **fuera** del blockquote del enunciado, como prosa o lista de pasos, y
opcionalmente se abre con un párrafo etiquetado:

```markdown
> **Proposición.** Si $\{v_1, \dots, v_k\}$ es ortogonal y ningún $v_i$ es nulo, es linealmente independiente.

**Demostración.** Supongamos $\sum_i \alpha_i v_i = 0$. Tomando producto interno con $v_j$ …
```

No metas la demostración dentro del blockquote del enunciado: el bloque destaca el *qué*, la prosa explica el *por qué*.

---

## 5. Avisos: Cuidado / Trampa / Flag

Patrón real de Derecho y PAW para marcar errores frecuentes y sutilezas de examen. Usan **dos puntos**.

```markdown
> **Cuidado:** $A^{T}A$ siempre es simétrica y semidefinida positiva, pero **no** necesariamente
> invertible: lo es sólo si las columnas de $A$ son linealmente independientes.

> **Trampa:** el enunciado pide la norma $\|\cdot\|_1$, no la euclídea. Sumar valores absolutos,
> no elevar al cuadrado.

> **Flag:** revisar si el dominio incluye el caso $n = 0$; la fuente no lo aclara.
```

- `Cuidado:` → error conceptual común.
- `Trampa:` → trampa del enunciado o del examen.
- `Flag:` → pendiente / punto a verificar contra la fuente.

Estos avisos son el sustituto canónico del callout `[!warning]`. **No** uses `[!warning]`.

---

## 6. Fidelidad a la fuente: el patrón `> **Nota.**`

Cuando transcribís algo del material crudo que difiere del estándar habitual (notación rara,
una definición no estándar de la cátedra, un símbolo distinto), **no lo corrijas en silencio**:
dejalo fiel y agregá una `> **Nota.**` explicando la salvedad. Patrón real en MNA
(`02-vectores-cn-rn.md`).

```markdown
> **Definición.** La fuente llama "módulo" a lo que habitualmente se nota $\|v\|_2$ (norma euclídea).

> **Nota.** En el apunte original el producto interno se conjuga en la **primera** componente,
> no en la segunda. Acá se respeta esa convención para no contradecir el material de la cátedra.
```

Regla: **fidelidad > prolijidad**. Ante un conflicto entre el material y el estándar, ganá fidelidad y documentá la diferencia con `> **Nota.**`.

---

## 7. Callouts nativos `[!type]` — la opción que NO se usa

### 7.1 Por qué están documentados pero prohibidos por defecto

- **0 ocurrencias** en los 7 vaults (hallazgo del overseer). Introducirlos rompería la homogeneidad.
- **No son portables:** fuera de Obsidian (GitHub, otros renderers) se ven rotos. El repo publicable apunta a portabilidad.
- **DESIGN.md §0.1** los prohíbe explícitamente junto con Dataview y HTML de render.

### 7.2 La única excepción permitida

Un vault puede adoptarlos **solo si lo declara explícitamente en su propio `CLAUDE.md`**. En ese
caso, ese vault los usa de forma **consistente** (no mezcla callouts y blockquotes para lo mismo).
Mientras no haya ese opt-in escrito: **blockquote etiquetado, siempre**.

### 7.3 Mapa de equivalencias (si algún día un vault hace opt-in)

Para que la migración sea trivial y determinista, esta es la traducción 1:1 canónica ↔ callout:

| Canónico (blockquote) | Callout equivalente (solo con opt-in) |
|---|---|
| `> **Definición.** …` | `> [!note] Definición` |
| `> **Teorema.** …` / `> **Proposición.** …` | `> [!abstract] Teorema` |
| `> **Observación.** …` / `> **Nota.** …` | `> [!info] Observación` |
| `> **Ejemplo.** …` | `> [!example] Ejemplo` |
| `> **Cuidado:** …` / `> **Trampa:** …` | `> [!warning] Cuidado` |
| `> **Flag:** …` | `> [!todo] Flag` |

Sintaxis del callout, para referencia (recordá: **no usar** salvo opt-in):

```markdown
> [!example] Producto interno
> Sean $u, v \in \mathbb{K}^n$. Se define $\langle u, v\rangle = \sum_i u_i \overline{v_i}$.
```

El título tras `[!type]` es opcional; si se omite, Obsidian usa el nombre del tipo. Aun con
opt-in, **mantené la etiqueta humana** (`Definición`, `Teorema`) para no perder semántica.

---

## 8. Anti-patrones (NO hacer)

- `> [!note]` en cualquier vault sin opt-in declarado en su `CLAUDE.md`. **Prohibido.**
- `**Definicion.**` sin tilde. El cuerpo lleva tildes: es `**Definición.**` (los *nombres de archivo* van sin tilde, no las etiquetas).
- `**Teorema**` sin punto, o `**Teorema:**` con dos puntos. Enunciados llevan **punto**, no dos puntos.
- `>**Definición.**` sin espacio tras el `>`. Siempre `> ` con espacio.
- Definición formal escrita como párrafo suelto sin blockquote. Un enunciado formal **siempre** va en blockquote.
- Aviso de error escrito como `> **Cuidado.**` con punto. Los avisos llevan **dos puntos**.
- Display `$$…$$` colgando **fuera** del blockquote cuando pertenece al enunciado. Va adentro, prefijado con `> `.
- Mezclar `> [!warning]` y `> **Cuidado:**` en la misma página. Una sola convención por vault.
- HTML (`<div>`, `<aside>`, `<details>`) para simular cajas. Solo Markdown vanilla; HTML únicamente en comentarios `<!-- -->`.

---

## 9. Ejemplos copy-paste-ready (rioplatense)

### 9.1 Bloque matemático (MNA / Proba / Economía — LaTeX fuerte)

```markdown
> **Definición.** Una matriz $A \in \mathbb{R}^{n \times n}$ es **definida positiva** si
> $x^{T} A x > 0$ para todo $x \neq 0$.

> **Teorema (Cholesky).** $A$ es simétrica definida positiva si y sólo si existe una matriz
> triangular inferior $L$ con diagonal positiva tal que
> $$A = L L^{T}.$$

> **Observación.** La factorización de Cholesky cuesta la mitad que la LU: aprovecha la simetría.

> **Cuidado:** si $A$ es simétrica pero sólo **semi**definida positiva, $L$ puede tener ceros en
> la diagonal y la factorización deja de ser única.
```

### 9.2 Bloque conceptual sin LaTeX (Derecho / Inge2 / SDS / PAW)

```markdown
> **Definición.** La **prescripción** es el modo de adquirir un derecho o liberarse de una
> obligación por el transcurso del tiempo fijado por la ley.

> **Nota.** El Código Civil y Comercial unificó los plazos; el plazo genérico de prescripción
> liberatoria es de cinco años (art. 2560).

> **Trampa:** prescripción no es lo mismo que caducidad — la caducidad extingue el derecho
> mismo, no sólo la acción, y no se suspende ni interrumpe.
```

### 9.3 Bloque de código (PAW / SDS — `$...$` es código inline, no matemática)

```markdown
> **Observación.** La anotación `@Transactional` abre la transacción al entrar al método y la
> cierra (commit/rollback) al salir; **no** sirve para llamadas internas a otro método de la
> misma clase (el proxy de Spring no se intercepta a sí mismo).

> **Cuidado:** un `@Transactional` sobre un método `private` se ignora silenciosamente. Tiene que
> ser `public` para que el proxy lo envuelva.

\`\`\`java
@Transactional
public void transferir(long origen, long destino, BigDecimal monto) {
    // ...
}
\`\`\`
```

### 9.4 Párrafo etiquetado (comentario al margen, sin blockquote)

```markdown
El método converge cuadráticamente cerca de la raíz. **Observación.** Lejos de la raíz puede
diverger; conviene arrancar con bisección y recién después pasar a Newton.
```

---

## 10. Mini-checklist (antes de cerrar una página)

- [ ] Todo enunciado formal (definición/teorema/proposición/lema/corolario) está en **blockquote etiquetado**.
- [ ] Los comentarios al margen cortos van como **párrafo etiquetado** (sin `>`), no como blockquote.
- [ ] **Cero** callouts `[!note]`/`[!warning]`/`[!example]` (salvo que el `CLAUDE.md` del vault haga opt-in explícito).
- [ ] Cada etiqueta está **en negrita**, con la puntuación adentro del `**…**`.
- [ ] Enunciados con **punto** (`**Teorema.**`); avisos con **dos puntos** (`**Cuidado:**`).
- [ ] **Un único espacio** entre la etiqueta y el texto; `> ` con espacio en cada línea del bloque.
- [ ] Etiquetas con tilde donde corresponde (`**Definición.**`, `**Observación.**`, `**Proposición.**`).
- [ ] Los `$$…$$` que pertenecen a un enunciado están **dentro** del blockquote, prefijados con `> `.
- [ ] Varias entradas del mismo tipo → etiqueta **pluralizada** + `i)`, `ii)`, `iii)`.
- [ ] Las demostraciones van **fuera** del bloque del enunciado.
- [ ] Las salvedades respecto de la fuente están marcadas con `> **Nota.**` (fidelidad > prolijidad).
- [ ] Cero HTML de render; solo Markdown vanilla (HTML únicamente en comentarios `<!-- -->`).
- [ ] No se introdujo LaTeX en materias que no lo usan (Derecho, Inge2); en PAW `$...$` es código, no matemática.

---

*Fin de FEATURES_callouts-y-bloques.md*
