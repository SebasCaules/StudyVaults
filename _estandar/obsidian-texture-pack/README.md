# StudyVaults · Obsidian Texture Pack

Identidad visual **por tipo de materia** para las vaults de StudyVaults, como
snippets CSS de Obsidian. Una **firma compartida** (serif Newsreader · mono
JetBrains · coral `#f47c59`, coherente con `DESIGN.md §12`) + **4 variantes de
disciplina** que sólo cambian acento y textura. Cada variante trae light y dark.

| Variante | Materias | Acento | Textura | Extra |
|---|---|---|---|---|
| `sv-exactas` | MNA · Proba | azul | papel milimetrado + glow | marcador de teorema |
| `sv-sistemas` | PAW · SDS · Inge2 | coral | matriz de puntos | bloques de código estilo terminal (barra + dots + sintaxis verde) |
| `sv-economicas` | Economía | ámbar | renglones de libro mayor | numeral tabular en tablas |
| `sv-derecho` | Derecho | sepia | grano pergamino | capitular en el 1er párrafo |

## Archivos
- `sv-base.css` — firma compartida (aplica a todo el vault).
- `sv-{exactas,sistemas,economicas,derecho}.css` — variantes (se activan por nota).
- `install.mjs` — copia + habilita + (opcional) stampea las notas.
- `preview.html` — muestra las 4 variantes con toggle light/dark (abrir en el navegador).
- `demo/` — 4 notas de ejemplo para ver cada variante viva en Obsidian.

## Instalar
```bash
# en la vault raíz del repo (la que estás usando), con el tema base de Obsidian:
node _estandar/obsidian-texture-pack/install.mjs --theme default

# en otra vault (p. ej. un original), sin tocar su tema:
node _estandar/obsidian-texture-pack/install.mjs --vault "/ruta/a/OtraVault"
```
Reiniciá/recargá Obsidian si no toma los snippets al toque
(Settings → Appearance → CSS snippets → recargar).

## Cómo se asigna la variante a una nota
Obsidian es **una sola vault** con las materias como carpetas, así que la variante
se aplica por nota con la propiedad `cssclasses` del frontmatter:
```yaml
---
cssclasses:
  - sv-exactas
---
```
El installer puede stampear esto automáticamente **por carpeta** (inferido de la
tabla de arriba):
```bash
node _estandar/obsidian-texture-pack/install.mjs --stamp            # todas
node _estandar/obsidian-texture-pack/install.mjs --stamp --only MNA # una carpeta
```
Es idempotente y respeta el frontmatter existente. **Para notas nuevas**, agregá
la línea `cssclasses` al template de la skill `studyvault-page`.

## Modos de Obsidian
- **Lectura**: se ve todo (texturas, terminal, capitular, acentos).
- **Live-preview / edición**: acentos, callouts y tipografía sí; el chrome de
  terminal es sólo-lectura (el editor dibuja el código aparte).
- Números de línea en código: activá el ajuste nativo de Obsidian
  (Settings → Editor → *Show line numbers*).

## Revertir
```bash
node _estandar/obsidian-texture-pack/install.mjs --uninstall   # quita snippets
```
El tema se revuelve desde Settings → Appearance. El stamp de `cssclasses` se
deshace con git (`git checkout -- <carpeta>`), no lo toca el `--uninstall`.
