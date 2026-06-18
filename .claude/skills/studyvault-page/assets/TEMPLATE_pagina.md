<!-- TEMPLATE_pagina.md — Copiá este archivo, renombralo en kebab-case (sin tildes/ñ),
     completá los placeholders y BORRÁ todos los comentarios <!-- ... -->.
     Estándar completo: ver DESIGN.md. Ejemplo lleno: ver EJEMPLO_pagina.md. -->
---
tags: [TIPO, unidad-N, TEMA-PRINCIPAL, SUBTEMA]   # kebab-case; primer tag = tipo de pagina
fuente: raw/ruta/al/archivo-fuente.pdf            # una fuente => 'fuente:' string
# fuentes:                                         # varias => 'fuentes:' lista (descomentar)
#   - raw/ruta/uno.pdf
#   - [[fuentes/resumen-clase]]
unidad: N                                          # romano (II) o entero (2); omitir si transversal
tipo: TIPO                                          # teoria | clase | guia | resuelto | parcial | concepto | ...
actualizado: AAAA-MM-DD                            # ISO; fecha de ultima edicion
# aliases: [Alias Uno, Alias Dos]                  # opcional, para wikilinks alternativos
---

# Título de la página

<!-- H1 UNICO. Puede llevar LaTeX inline: # Vectores en $\mathbb{C}^n$ -->
<!-- Parrafo de apertura opcional: 1-2 frases que sitúen el tema. Conciso, rioplatense. -->

## Primera sección

<!-- Enunciados formales => blockquote con etiqueta en negrita: -->

> **Definición.** Texto de la definición.
> $$ formula $$

<!-- Comentario al margen => parrafo con etiqueta en negrita (sin blockquote): -->

**Observación.** Aclaración breve.

### Subsección

<!-- Propiedades enumeradas con i), ii), iii) y etiqueta en negrita: -->

i) **Propiedad:** enunciado con $LaTeX$ inline.
ii) **Otra propiedad:**
   $$ formula $$

## Segunda sección

<!-- Tabla cuando comparás/clasificás: -->

| Concepto | Definición | Nota |
|---|---|---|
| ... | ... | ... |

<!-- Bloque de código SIEMPRE con lenguaje declarado: -->

```python
# codigo de ejemplo
```

<!-- Nota de fidelidad a la fuente, si transcribís algo no estándar: -->

> **Nota.** Salvedad sobre la fuente original, si corresponde.

---

## Ver también

- [[carpeta/pagina-relacionada]] — por qué importa
- [[otra-pagina|alias legible]] — relación

<!-- CHECKLIST antes de cerrar (ver DESIGN.md §11):
     [ ] frontmatter en linea 1, tags + fuente presentes, orden canonico
     [ ] un solo # H1; headings sin saltos
     [ ] definiciones en blockquote > **Etiqueta.**; cero callouts [!type]
     [ ] LaTeX coherente con la materia; tablas con cabecera; codigo con lenguaje
     [ ] wikilinks en kebab-case sin .md; nombre de archivo kebab-case sin tildes
     [ ] separador --- + "## Ver también"; listar la pagina en index.md
     BORRAR este bloque y todos los comentarios antes de publicar. -->
