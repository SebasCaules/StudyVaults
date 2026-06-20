# SYNC_CHECK — verificar la sincronía de las 3 copias de DESIGN.md

`DESIGN.md` existe en **3 ubicaciones que DEBEN quedar byte-idénticas** (mismo md5). Si una difiere,
los consumidores (sobre todo `studyvault-page`, que empaqueta su propia copia) aplican un estándar
distinto. Este check se corre **al empezar** (estado de partida) y **al cerrar** (las 3 verdes).

Paths (relativos a la raíz del repo `StudyVaultsITBA/`, salvo la master externa):

| # | Copia | Rol |
|---|---|---|
| 1 | `_estandar/DESIGN.md` | la del repo — copia de **trabajo** |
| 2 | `.claude/skills/studyvault-page/assets/DESIGN.md` | la que `studyvault-page` empaqueta (corre autocontenida) |
| 3 | `~/Desktop/ITBA/_estandar/DESIGN.md` | **master externa** (fuera del repo; puede no existir) |

## 1. Comparar los 3 hashes

```bash
md5 _estandar/DESIGN.md \
    .claude/skills/studyvault-page/assets/DESIGN.md \
    ~/Desktop/ITBA/_estandar/DESIGN.md
```

(En Linux: `md5sum <los 3 paths>`.) **Las 3 líneas deben mostrar el mismo hash.** Si la master no
existe, el comando avisa "No such file or directory" para esa línea — ver §4.

Una sola línea de veredicto (imprime `SYNC OK` solo si los 3 hashes coinciden):

```bash
a=$(md5 -q _estandar/DESIGN.md)
b=$(md5 -q .claude/skills/studyvault-page/assets/DESIGN.md)
c=$(md5 -q ~/Desktop/ITBA/_estandar/DESIGN.md 2>/dev/null)
[ "$a" = "$b" ] && [ "$a" = "$c" ] && echo "SYNC OK ($a)" \
  || printf 'DESINCRONIZADO\n  repo:   %s\n  skill:  %s\n  master: %s\n' "$a" "$b" "${c:-FALTA}"
```

## 2. Si difieren: ver QUÉ difiere

```bash
diff _estandar/DESIGN.md .claude/skills/studyvault-page/assets/DESIGN.md   # repo vs skill
diff _estandar/DESIGN.md ~/Desktop/ITBA/_estandar/DESIGN.md                # repo vs master
```

Señales típicas de master vieja (despersonalización): menciones de `log.md` y paths privados tipo
`26-1C/MNA_Obsidian/...`. La versión **buena** es la del repo (`_estandar/DESIGN.md`).

```bash
grep -n 'log\.md\|26-1C\|_Obsidian' ~/Desktop/ITBA/_estandar/DESIGN.md   # debería no devolver nada
```

## 3. Re-sincronizar (la del repo es la fuente)

Copiá, no re-edites a mano — copiar garantiza byte-idéntico:

```bash
cp _estandar/DESIGN.md .claude/skills/studyvault-page/assets/DESIGN.md
cp _estandar/DESIGN.md ~/Desktop/ITBA/_estandar/DESIGN.md
```

Después volvé a correr §1 hasta `SYNC OK`. **Nunca** copies en sentido inverso desde una master vieja
(reintroduce `log.md` / paths privados).

## 4. Si la master externa no existe

Es válido (vive fuera del repo, puede no estar en esta máquina). Reportalo como "master ausente" y,
si tiene que existir, creala con el `cp` de §3. No bloquea las copias del repo (1 y 2), que igual
deben coincidir entre sí.

## 5. Companions (alcance distinto)

La regla de las 3 copias es **solo para `DESIGN.md`**. `TEMPLATE_pagina.md` y `EJEMPLO_pagina.md`
existen en 2 copias (repo `_estandar/` + `studyvault-page/assets/`); si los editás, sincronizá esas:

```bash
md5 _estandar/TEMPLATE_pagina.md .claude/skills/studyvault-page/assets/TEMPLATE_pagina.md
md5 _estandar/EJEMPLO_pagina.md  .claude/skills/studyvault-page/assets/EJEMPLO_pagina.md
```

Los `FEATURES_*.md` y `AUDIT.md` viven **solo** en `_estandar/` (no se replican).
