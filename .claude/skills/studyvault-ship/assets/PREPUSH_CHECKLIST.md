# Pre-push checklist — StudyVaults

Correr ESTA lista completa antes de cada `git push origin main`. Publicar es push directo a `main`
(sin PRs) y dispara el deploy automático a GitHub Pages. Solo se publica **cuando el usuario lo pide
explícitamente**.

## 1. Build verde (lo primero)

- [ ] `./run.sh build` corrió sin errores (`next build` + `pagefind`, fiel a GH Pages).
- [ ] `tsc` limpio (sin errores de TypeScript).
- [ ] **~802 páginas** generadas (si baja mucho, algo se rompió).
- [ ] Verificación en browser con Claude Preview MCP sobre `http://localhost:3000/StudyVaults/`:
      screenshot de lo que cambió + **0 errores de consola**.
- [ ] (Si tocaste estilos) descartado el CSS stale de Turbopack: `./run.sh clean` y rebuild.
- [ ] (Si tocaste `lib/content/*`) reiniciaste el server: el cache `globalThis` sobrevive al HMR.
- [ ] No corriste `next build` con `next dev` prendido (comparten `.next`).

## 2. Revisión del diff

- [ ] `git branch --show-current` → `main`.
- [ ] `git status` revisado: sé exactamente qué se va a commitear.
- [ ] `git diff` (working) y `git diff --staged` leídos — cambios reales, no asumidos.
- [ ] **Sin artefactos generados/gitignored** en el commit:
      `site/.next`, `site/out`, `site/lib/planner/data.json`,
      `site/public/{apps,electivas,vault-assets,pagefind}`, `node_modules`.
      (Chequeá con `git status --ignored` si dudás.)
- [ ] **Sin contenido personal/privado** reintroducido (el repo está despersonalizado para publicar).

## 3. Commit

- [ ] Mensaje **descriptivo en español rioplatense** (qué cambió + por qué).
- [ ] **SIN trailer `Co-Authored-By: Claude`** — convención explícita de este repo (anula el default
      global del harness). Los commits van solo a nombre del usuario.

## 4. Push y deploy

- [ ] `git push origin main`.
- [ ] Seguir el workflow: `gh run watch` (o `gh run list --workflow=deploy.yml --limit 3`).
- [ ] Reportar al usuario: commit + estado del deploy + URL en vivo
      `https://sebascaules.github.io/StudyVaults/`.
