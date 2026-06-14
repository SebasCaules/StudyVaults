# Electivas — Plan de Estudios (Ing. en Informática, ITBA)

App web estática para **planificar la carrera**: mapa de correlativas, áreas/minors, créditos y armado de horario cuatrimestral sobre el plan **S10 · Rev23**. No es un vault de Obsidian como el resto del repo — es una herramienta. Se abre en el navegador, sin build ni dependencias instaladas (las librerías se cargan por CDN).

## Cómo correrla

```bash
./run.sh            # regenera data.js, sirve en http://localhost:8000 y abre el navegador
# o, sin script:
python3 build-data.py && python3 -m http.server 8000   # luego abrir index.html
```

> Hace falta servirla por HTTP (no `file://`): la app levanta datos con `fetch`.

## Cómo está armada

```
electivas.csv / obligatorias.csv  ──[electivas.py]──▶  electivas.json / obligatorias.json
SGA (catálogo de cursada)         ──[scrape-sga-*.js]──▶  horarios.json
*.json                            ──[build-data.py]──▶  data.js  ──▶  index.html (planner.js + planner.css)
```

| Archivo | Qué es |
|---|---|
| `index.html`, `planner.js`, `planner.css` | La app (entry point + lógica + estilos). |
| `data.js` | Datos consolidados que consume la app. **Generado** por `build-data.py` — no editar a mano. |
| `build-data.py` | Mergea los `.json` + horarios y emite `data.js`. |
| `electivas.py` | Convierte los `.csv` editables en `electivas.json` / `obligatorias.json`. |
| `electivas.csv` / `obligatorias.csv` | Fuente editable de materias y correlativas. |
| `horarios.json` | Comisiones y horarios por materia (Primer Cuat. 2026). |
| `Plan-S10-Rev23.md` | El plan de la carrera en Markdown (versión legible del `.xlsx` original). |
| `scrape-sga-*.js`, `SCRAPING.md` | Scripts y notas para regenerar `horarios.json` desde el SGA. Ver `SCRAPING.md`. |
| `run.sh` | Regenera `data.js` y sirve la app. |

## Editar los datos

1. Editás `electivas.csv` / `obligatorias.csv`.
2. `python3 electivas.py` → regenera los `.json`.
3. `python3 build-data.py` (o `./run.sh`) → regenera `data.js`.

> **Nota.** Los datos (materias, créditos, horarios, profesores) son del catálogo público del ITBA y reflejan un cuatrimestre puntual; verificá siempre contra el SGA y el plan oficial.
