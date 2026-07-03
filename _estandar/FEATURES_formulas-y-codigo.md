# FEATURES — Fórmulas, tablas y código (StudyVaults)

> Guía temática del **Designer**. Profundiza la sección 6 de `DESIGN.md` (LaTeX, tablas, código)
> y le agrega las **convenciones tipográficas matemáticas en español**. `DESIGN.md` manda sobre
> estructura de página; este archivo manda sobre **cómo se escribe la matemática y el código adentro
> de esos bloques**. Ante conflicto, gana `DESIGN.md`.
>
> **Output en español rioplatense, conciso.** Los 7 vaults son SOLO LECTURA: esto describe el
> formato del repo publicable, **nunca** modifica los vaults fuente. Renderer de referencia: el de
> Obsidian (KaTeX/MathJax). Nada de plugins.
>
> **Dónde aplica LaTeX (regla dura, de la auditoría):** fuerte en **MNA, Economía, Proba**;
> presente en **SDS**; **ausente** en **Derecho e Inge2**; en **PAW** `$...$` es para *código inline*
> (nombres de clase, anotaciones), **no** matemática. **No se introduce LaTeX donde la materia no lo usa.**

---

## 0. Decisión rápida: ¿qué bloque uso?

Árbol determinista. Recorrer de arriba hacia abajo y parar en la primera coincidencia.

| Lo que tengo | Lo que uso | Sección |
|---|---|---|
| Un símbolo / fórmula corta en medio de prosa | `$ ... $` inline | 1.1 |
| Una fórmula que merece su renglón y centrado | `$$ ... $$` display | 1.2 |
| Varias ecuaciones que se leen juntas / pasos algebraicos | `$$\begin{aligned} ... \end{aligned}$$` | 1.4 |
| Una matriz, vector columna, determinante | entorno (`pmatrix`, `vmatrix`…) dentro de `$$` | 1.5 |
| Una definición por casos (función a trozos, sistema) | `cases` dentro de `$$` | 1.5 |
| Comparar propiedades / clasificar / listar atributos | tabla Markdown | 2 |
| Código de programa que se ejecuta o se lee como bloque | ` ```lang ` con lenguaje | 3 |
| Nombre de variable, clase, archivo, comando, valor | `` `backtick` `` inline | 3.3 |

Regla de oro: **lo más simple que transmita la idea sin ambigüedad.** No envolver un solo símbolo en `$$`; no abrir un `aligned` para una sola ecuación.

---

## 1. LaTeX

### 1.1 Inline `$ ... $`

Para símbolos, variables y fórmulas cortas embebidas en una oración.

```markdown
El espacio $\mathbb{K}^n$ con la norma $\|v\|_2 = \sqrt{\sum_i |v_i|^2}$ es completo.
Sea $A \in \mathbb{R}^{m \times n}$ de rango $r \le \min(m, n)$.
La probabilidad $P(X \le x)$ define la función de distribución $F_X$.
```

Reglas (deterministas):

- **Sin espacios** pegados a los `$`: `$x$`, nunca `$ x $`.
- Todo símbolo matemático en prosa va en `$...$`, **también las letras sueltas**: se escribe "el vector $v$", no "el vector v". "para $n \ge 1$", no "para n >= 1".
- Texto dentro de fórmula inline larga → `\text{...}`: `$v \in V \text{ tal que } \|v\| = 1$`.
- **No** partir una fórmula inline en dos `$...$` separados por palabras si es una sola expresión; o va entera inline o pasa a display.
- En **PAW**: `$ClassName$`, `$@Autowired$` son *código inline disfrazado*; preferir backticks (`` `ClassName` ``) salvo que el vault ya tenga el hábito del `$`. **No** usar `$...$` para matemática en PAW.

### 1.2 Display `$$ ... $$`

Para fórmulas que merecen su propio renglón centrado.

```markdown
$$\langle u, v \rangle = \sum_{i=1}^{n} u_i \, \overline{v_i}$$
```

Reglas:

- `$$` abre y `$$` cierra; la fórmula puede ir en el mismo renglón (estilo MNA) o con saltos internos. **Elegir uno por vault y mantenerlo.** Convención por defecto: `$$` y fórmula **en el mismo renglón** cuando entra; bloque multilínea solo con `aligned`/`cases`.
- **Una idea por bloque `$$`.** Para varias fórmulas relacionadas en una línea, separarlas con `\quad` o `\qquad` (no con comas sueltas a secas):
  ```markdown
  $$a = 3u - 4v, \quad b = 2u + 3v - 5w$$
  ```
- **Línea en blanco antes y después** del `$$` de display cuando va como párrafo suelto (no pegado a la prosa anterior), salvo que esté dentro de un blockquote de definición (ver 1.6).
- **Sin** numeración de ecuaciones (`\tag`, `\label`) salvo que la materia lo exija; los vaults no numeran.
- Display dentro de listas: indentar el `$$` al nivel del ítem para que el renderer lo asocie.

### 1.3 Cuándo va inline vs display (regla dura)

- **Inline** si: cabe en el renglón, no tiene fracciones altas / integrales / sumatorias grandes, y no es el "resultado principal" del párrafo.
- **Display** si: tiene `\sum`, `\int`, `\prod`, `\frac` de varios pisos, matriz, o es el enunciado central que el lector va a querer ubicar de un vistazo.
- Caso de borde frecuente: una sumatoria corta como $\sum_{i=1}^n x_i$ puede ir inline; $\displaystyle\sum_{i=1}^{n} \frac{x_i^2}{n-1}$ va en display.

### 1.3 bis Estilo libro: prosa + display + leyenda (DESIGN.md §6.1)

Toda fórmula relevante se presenta como en un apunte LaTeX académico, en tres partes:

```markdown
La función de densidad de la distribución normal con media $\mu$ y desvío $\sigma$ es

$$f(x) = \frac{1}{\sigma\sqrt{2\pi}} \, e^{-\frac{(x-\mu)^2}{2\sigma^2}}$$

donde $\mu$ es la media, $\sigma > 0$ el desvío estándar y $x \in \mathbb{R}$ el punto evaluado.
```

- **Intro en prosa** (qué es / cuándo se usa) → **display en renglón propio** → **leyenda de
  variables** que cubre *todos* los símbolos, incluidos subíndices y argumentos no obvios.
- **Prohibido** enunciar la fórmula central inline dentro del párrafo ("pared de símbolos"):
  el inline es para *mencionar* símbolos, no para enunciar resultados.
- Derivaciones: un bloque display por paso, con la prosa conectando los pasos.

### 1.4 Multilínea: `aligned` (la única forma de alinear)

Para cadenas de igualdades, despejes, demostraciones por pasos. Va **dentro** de `$$`.

```markdown
$$\begin{aligned}
\|u + v\|^2 &= \langle u + v, \, u + v \rangle \\
            &= \|u\|^2 + 2\,\langle u, v \rangle + \|v\|^2 \\
            &= \|u\|^2 + \|v\|^2 \quad \text{si } u \perp v
\end{aligned}$$
```

Reglas:

- El `&` marca la **columna de alineación** (típicamente antes del `=`). Una sola `&` por renglón.
- `\\` separa renglones; el último renglón **no** lleva `\\`.
- Comentarios al margen del paso con `\quad \text{...}`.
- Usar `aligned`, **no** `align` ni `eqnarray` (KaTeX/Obsidian: `aligned` es el que va dentro de `$$`).
- Si no hay nada que alinear (varias ecuaciones independientes), usar `\\` dentro de un `aligned` igual, o mejor varios `$$` separados.

### 1.5 Entornos usados en los vaults (catálogo cerrado)

Estos son los entornos que **realmente** aparecen en los vaults. No inventar otros sin necesidad.

| Entorno | Para qué | Ejemplo mínimo |
|---|---|---|
| `pmatrix` | Matriz / vector con paréntesis (el default) | `\begin{pmatrix} 1 & 0 \\ 2 & 3 \end{pmatrix}` |
| `bmatrix` | Matriz con corchetes (si la materia los prefiere) | `\begin{bmatrix} 1 & 0 \\ 2 & 3 \end{bmatrix}` |
| `vmatrix` | Determinante (barras verticales) | `\begin{vmatrix} a & b \\ c & d \end{vmatrix}` |
| `cases` | Definición por casos / sistema de ecuaciones | `\begin{cases} x = 1 \\ y = 2 \end{cases}` |
| `aligned` | Cadenas de igualdades alineadas (1.4) | ver arriba |
| `array` | Tablas matemáticas finas / con líneas | `\begin{array}{c|c} a & b \\ \hline c & d \end{array}` |
| `smallmatrix` / `psmallmatrix` | Matriz chica embebida inline | `$\begin{psmallmatrix} 1 & 0 \\ 0 & 1 \end{psmallmatrix}$` |

Ejemplos copy-paste-ready:

```markdown
$$A = \begin{pmatrix} 1 & 2 & 4 \\ 7 & 5 & 3 \end{pmatrix}, \quad
  \det A = \begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$$
```

```markdown
$$f(x) = \begin{cases}
x^2 & \text{si } x \ge 0 \\
-x  & \text{si } x < 0
\end{cases}$$
```

```markdown
$$\begin{cases}
x + y + z = a \\
x - y = 0 \\
3x + y + bz = 0
\end{cases}$$
```

Reglas de matrices y casos:

- Columnas con `&`, filas con `\\`. **La última fila no lleva `\\`.**
- `pmatrix` es el **default** para matrices y vectores columna. Cambiar a `bmatrix` solo si la materia lo usa de forma consistente.
- En `cases`, el texto de la condición va en `\text{si } ...` con espacio explícito tras "si".
- `\hline` y `|` en el preámbulo (`{c|c}`) solo en `array`.

### 1.6 LaTeX dentro de blockquotes de definición

El estilo canónico de `DESIGN.md` §4 es blockquote con etiqueta en negrita. Cuando una definición/teorema lleva fórmula display, **cada renglón del bloque** (incluido el `$$`) va prefijado con `> `:

```markdown
> **Definición.** Sean $u, v \in \mathbb{K}^n$. El producto interno se define como
> $$\langle u, v \rangle = \sum_{i=1}^{n} u_i \, \overline{v_i}$$

> **Teorema (Pitágoras).** Si $u \perp v$, entonces
> $$\|u + v\|^2 = \|u\|^2 + \|v\|^2$$
```

Regla: el `>` no se omite en la línea del `$$` ni en las líneas internas de un `aligned` dentro del bloque. Renderiza mal si falta.

### 1.7 Errores frecuentes (y la forma correcta)

| Mal | Bien | Por qué |
|---|---|---|
| `el vector v y la matriz A` | `el vector $v$ y la matriz $A$` | símbolos siempre en math mode |
| `$ x + y $` | `$x + y$` | sin espacios pegados a los `$` |
| `$$x$$` para un símbolo suelto | `$x$` inline | display solo para fórmulas que lo merecen |
| `\R`, `\C` (no estándar) | `\mathbb{R}`, `\mathbb{C}` | macros base, sin `\newcommand` |
| `x_i^2` ambiguo en sub/sup largos | `x_{i}^{2}`, `e^{-\lambda t}` | llaves cuando hay más de un carácter |
| `*` para multiplicar | `\cdot` o yuxtaposición `2x` | tipografía matemática |
| `<=`, `>=`, `!=` | `\le`, `\ge`, `\ne` | operadores LaTeX |
| `align` / `eqnarray` | `aligned` dentro de `$$` | lo que soporta KaTeX/Obsidian |
| `\newcommand` en la página | macros base de KaTeX | determinismo, sin estado global |

---

## 2. Tablas Markdown

### 2.1 Forma canónica

```markdown
| Concepto | Notación | Propiedad |
|---|---|---|
| Norma 1 | $\|v\|_1$ | $\sum_i |v_i|$ |
| Norma 2 | $\|v\|_2$ | $\sqrt{\sum_i v_i^2}$ |
| Norma infinito | $\|v\|_\infty$ | $\max_i |v_i|$ |
```

Reglas:

- **Cabecera obligatoria** + fila de separación `|---|---|`. Siempre.
- Separador mínimo `|---|` por columna; alineación opcional con `:`:
  - `|:--|` izquierda · `|:-:|` centrado · `|--:|` derecha.
- Pipes externas (`|` al inicio y fin de cada fila) **sí**, de forma consistente.
- Alinear las pipes en el fuente cuando sea barato (ayuda al diff); el render no lo exige.

### 2.2 LaTeX y código dentro de celdas

- LaTeX inline `$...$` funciona en celdas. **Una `|` literal dentro de una fórmula** rompe la tabla: escaparla como `\vert` o `\mid`. Para valor absoluto/norma usar `\lvert x \rvert`, `\lVert v \rVert` en vez de `|x|` dentro de tablas.
  ```markdown
  | Magnitud | Fórmula |
  |---|---|
  | Módulo | $\lvert z \rvert = \sqrt{a^2 + b^2}$ |
  | Probabilidad condicional | $P(A \mid B)$ |
  ```
- Código inline en celdas: `` `metodo()` `` funciona normal.
- **No** se pueden meter bloques de código triple-backtick ni `$$` display ni saltos de línea reales dentro de una celda. Si hace falta eso, la tabla no es el bloque correcto.

### 2.3 Cuándo SÍ y cuándo NO usar tabla

- **SÍ:** comparaciones (2+ columnas de atributos), clasificaciones, propiedades de operadores, equivalencias notación↔nombre, parámetros de una distribución, casos de un teorema.
- **NO:** una sola columna (usar lista `-`); contenido largo por celda (usar subsecciones); pasos secuenciales (usar lista ordenada `1.`); algo que sea en realidad una matriz matemática (usar `pmatrix`).

Ejemplo idiomático (parámetros de distribución, estilo Proba):

```markdown
| Distribución | Soporte | $E[X]$ | $\mathrm{Var}(X)$ |
|---|---|---|---|
| Bernoulli($p$) | $\{0, 1\}$ | $p$ | $p(1-p)$ |
| Binomial($n, p$) | $\{0, \dots, n\}$ | $np$ | $np(1-p)$ |
| Poisson($\lambda$) | $\mathbb{N}_0$ | $\lambda$ | $\lambda$ |
```

---

## 3. Bloques de código

### 3.1 Forma canónica: lenguaje SIEMPRE declarado

```markdown
```python
def media(xs):
    return sum(xs) / len(xs)
```
```

Reglas:

- **Nunca** un bloque sin lenguaje. Etiquetas válidas según vault: `python`, `java`, `sql`, `yaml`, `bash`, `xml`, `html`, `json`, `c`, `fortran` (SDS), `text`/`console` para salida cruda o pseudocódigo.
- Una idea ejecutable por bloque; no pegar archivos enteros si solo importa un fragmento.
- Indentación real (espacios), no tabs mezclados.
- Salida de consola / REPL: bloque aparte con `text` o `console`, no mezclada con el código fuente.
- **Sin** numeración de líneas manual ni `>>>` prompts salvo que se muestre una sesión REPL real.

### 3.2 Cuándo incluir código (regla dura)

- **SÍ incluir** cuando: la materia es de programación (PAW=Java, SDS=Python/Fortran), el algoritmo se entiende mejor en código que en prosa, hay una API/firma/anotación concreta que el lector va a copiar, o el material fuente ya es código.
- **NO incluir** cuando: una fórmula matemática lo expresa mejor (preferir LaTeX a un snippet numérico), el código sería pseudocódigo trivial que la prosa ya explica, o agregás un bloque solo para "decorar".
- **Matemática vs código:** si es una fórmula, va en LaTeX; si es una implementación, va en bloque de código. No transcribir una sumatoria como `for i in range(n): s += x[i]` cuando $\sum_{i=1}^n x_i$ alcanza — salvo que el punto *sea* la implementación.

### 3.3 Código inline

- Backticks simples para identificadores: `` `variable` ``, `` `Clase` ``, `` `archivo.py` ``, `` `git commit` ``, valores literales `` `null` ``, `` `True` ``.
- Para mostrar un backtick literal, usar dobles: `` `` `código con ` backtick` `` ``.
- En materias sin LaTeX (Derecho, Inge2): los términos técnicos van en **negrita** o `código`, no en `$...$`.

### 3.4 Ejemplos idiomáticos por vault

PAW (Java, firma + anotación):

```markdown
```java
@Repository
public class UserDaoImpl implements UserDao {
    public Optional<User> findById(long id) { ... }
}
```
```

SDS (Python con salida aparte):

```markdown
```python
import numpy as np
A = np.array([[1, 0], [2, 3]])
print(np.linalg.det(A))
```

```text
3.0
```
```

---

## 4. Convenciones tipográficas matemáticas en español

El cuerpo es **español rioplatense**; la notación matemática tiene reglas propias que conviven con el español.

### 4.1 Decimales, miles y unidades

- **Coma decimal** en prosa española: "la media es $\bar{x} = 3{,}5$". En LaTeX, la coma decimal se escribe `3{,}5` (las llaves evitan el espacio de "coma de lista"). Si el vault/material usa punto decimal de forma consistente (estilo anglosajón), respetarlo y **no mezclar**.
- Miles: **no** usar separador de miles en fórmulas; en prosa, espacio fino o nada (`10000`, no `10.000` que se confunde con decimal).
- Unidades: espacio (no pegado) entre número y unidad, `\text{}` para la unidad en LaTeX: `$5 \ \text{m/s}$`, `$T = 300 \ \text{K}$`.
- Porcentajes: `$95\%$` (el `\%` escapado en LaTeX), o "95 %" en prosa.

### 4.2 Nombres de operadores y funciones

- Operadores con nombre en **redonda**, no cursiva: `\sin`, `\cos`, `\log`, `\ln`, `\exp`, `\max`, `\min`, `\det`, `\dim`, `\gcd`, `\lim`. Escribir `$\det A$`, nunca `$det\ A$` (que sale en cursiva, mal).
- Operadores propios de la materia sin macro nativa → `\operatorname{}`: `$\operatorname{Var}(X)$`, `$\operatorname{Cov}(X,Y)$`, `$\operatorname{rg}(A)$` (rango), `$\operatorname{nu}(A)$` (nulidad), `$\operatorname{Im}$`, `$\operatorname{Nu}$`/`$\operatorname{Ker}$`.
- Esperanza/varianza: fijar **una** notación por vault — `$E[X]$` o `$\mathbb{E}[X]$`, `$\operatorname{Var}(X)$` o `$V(X)$` — y mantenerla.

### 4.3 Conjuntos numéricos y símbolos

- Conjuntos numéricos con `\mathbb{}`: `$\mathbb{N}$`, `$\mathbb{Z}$`, `$\mathbb{Q}$`, `$\mathbb{R}$`, `$\mathbb{C}$`, `$\mathbb{K}$` (cuerpo genérico), `$\mathbb{R}^n$`, `$\mathbb{N}_0$`.
- Cuantificadores y lógica: `\forall`, `\exists`, `\implies` / `\Rightarrow`, `\iff` / `\Leftrightarrow`, `\land`, `\lor`, `\neg`.
- Pertenencia/inclusión: `\in`, `\subseteq`, `\subset`, `\cup`, `\cap`, `\emptyset` (o `\varnothing`).
- Vectores: la convención del material. Si se marcan, `\vec{v}` o `\mathbf{v}` — **una sola** por vault. MNA escribe los vectores sin decoración ($v$, $u$), respetarlo.

### 4.4 Puntuación dentro y alrededor de fórmulas

- **El punto final de la oración va fuera del `$...$`** cuando la fórmula cierra la frase en prosa: "...el resultado es $x = 2$." (punto afuera). Para display que cierra oración, el punto **dentro** del `$$` al final es aceptable y frecuente en los vaults (`$$f(2,7) = (5,3).$$`); elegir un criterio por vault.
- Coma "de lista" entre fórmulas inline va **fuera**: "los valores $a$, $b$ y $c$".
- No empezar una oración con un símbolo matemático en minúscula; reformular ("El escalar $\lambda$..." en vez de "$\lambda$ es...").

### 4.5 Vocabulario español ↔ símbolo (glosario mínimo)

| Español | Símbolo / LaTeX | Nota |
|---|---|---|
| tal que | `\mid`, `:` o `\text{ tal que }` | en conjuntos: `$\{x \in \mathbb{R} \mid x > 0\}$` |
| para todo | `\forall` | "para todo $x$" |
| existe | `\exists` | |
| implica / entonces | `\implies`, `\Rightarrow` | |
| si y solo si | `\iff`, `\Leftrightarrow`, "ssi" | "ssi" es abreviatura aceptada en apuntes |
| pertenece a | `\in` | |
| aproximadamente | `\approx` | |
| producto interno | `\langle u, v \rangle` | no `<u,v>` |
| valor absoluto / módulo | `\lvert x \rvert` | barras `|` rompen tablas (ver 2.2) |
| norma | `\lVert v \rVert` | |
| conjugado | `\overline{z}` | |
| transpuesta | `A^{T}` o `A^{\top}` | una por vault |

---

## 5. Mini-checklist (antes de cerrar la página)

LaTeX:

- [ ] Todo símbolo en prosa está en `$...$` (incluidas letras sueltas como $v$, $A$).
- [ ] `$` sin espacios pegados; `$$` display solo para lo que lo merece.
- [ ] Multilínea con `aligned` (no `align`/`eqnarray`); última fila sin `\\`.
- [ ] Matrices con `pmatrix` (default); determinantes con `vmatrix`; casos con `cases`.
- [ ] Operadores con nombre en redonda (`\det`, `\sin`, `\operatorname{Var}`), no en cursiva.
- [ ] Conjuntos numéricos con `\mathbb{}`; `\le`/`\ge`/`\ne` (no `<=`/`>=`/`!=`).
- [ ] LaTeX dentro de blockquote: cada renglón (incluido `$$`) prefijado con `> `.
- [ ] No se introdujo LaTeX en una materia que no lo usa (Derecho, Inge2; PAW solo código).

Tablas:

- [ ] Cabecera + fila separadora `|---|`; pipes externas consistentes.
- [ ] Barras `|` de valor absoluto reemplazadas por `\lvert`/`\lVert`/`\mid` dentro de celdas.
- [ ] La tabla es realmente lo correcto (no una lista, no una matriz, no un paso secuencial).

Código:

- [ ] Todo bloque tiene lenguaje declarado; salida de consola en bloque `text`/`console` aparte.
- [ ] Se incluyó código solo donde aporta (no decorativo); fórmulas en LaTeX, no en snippets numéricos.
- [ ] Identificadores en `` `backticks` `` inline.

Tipografía en español:

- [ ] Coma/punto decimal consistente con el material (sin mezclar).
- [ ] Unidades con espacio y `\text{}`; `%` escapado como `\%`.
- [ ] Puntuación de la oración fuera del `$...$` inline; criterio de punto en display elegido y constante.

---

*Fin de FEATURES_formulas-y-codigo.md*
