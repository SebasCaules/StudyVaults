# Skills de StudyVaults ITBA

Suite de skills personalizadas que encapsulan los **workflows repetibles** del proyecto.
Cada una es determinista: con mínima instrucción, sigue el estándar del repo y verifica el
resultado. Todas comparten el contrato [`_shared/PROJECT.md`](_shared/PROJECT.md) (arquitectura +
convenciones + trampas) — leerlo primero.

| Skill | Pilar | Usala para… |
|---|---|---|
| [`studyvault-page`](studyvault-page/SKILL.md) | Contenido | crear una página `.md` de wiki siguiendo DESIGN.md |
| [`studyvault-toolkit`](studyvault-toolkit/SKILL.md) | Toolkits | armar/extender herramientas interactivas (`/[vault]/herramientas`) |
| [`studyvault-sheet`](studyvault-sheet/SKILL.md) | Hojas | armar/extender hojas imprimibles de fórmulas/conceptos (`/[vault]/hojas`) |
| [`studyvault-ui`](studyvault-ui/SKILL.md) | Design system | agregar/modificar un componente de `@studyvaults/ui` |
| [`studyvault-data`](studyvault-data/SKILL.md) | Datos | escribir un pipeline `scripts/build-*-data.mjs` desde los vaults |
| [`studyvault-ingest`](studyvault-ingest/SKILL.md) | Ingesta | traer material externo (PDFs/planillas/transcripts/horarios SGA) al repo y cablearlo al sitio |
| [`studyvault-ship`](studyvault-ship/SKILL.md) | Operación | verificar (`run.sh` + preview) y publicar (push a `main`, deploy a Pages) |
| [`studyvault-design`](studyvault-design/SKILL.md) | Estándar | mantener/extender DESIGN.md (las 3 copias byte-idénticas) |

## Cómo se relacionan

```
                         _shared/PROJECT.md  (contrato común)
                                   │
   studyvault-design  ── mantiene ─┤
        (DESIGN.md)                │
            │ consume              ▼
   studyvault-page ─────────► contenido .md  ──► el sitio (site/) lo renderiza
                                                        ▲
   studyvault-ingest ─► material externo → repo (raw/, Electivas/, public/)
            │ delega extracción en
   studyvault-data ─► data.ts/json ─► studyvault-toolkit / studyvault-sheet
                                                        │ usan
                                              studyvault-ui (@studyvaults/ui)
                                                        │
                                              studyvault-ship  (verifica + publica)
```

- **`_shared/`** no es una skill (no tiene `SKILL.md`): es la referencia que todas citan.
- Flujo típico de una mejora: editar contenido/datos/UI → `studyvault-ship` Fase A (verificar) →
  Fase B (publicar) solo cuando el usuario lo pide.
