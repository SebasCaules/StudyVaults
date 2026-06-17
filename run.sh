#!/usr/bin/env bash
#
# run.sh — recompila el sitio (site/) y lo levanta para ver los cambios.
#
# El portal vive en site/ (Next.js, static export para GitHub Pages). Antes de
# compilar hay que regenerar el contenido derivado de las vaults:
#   · copy-assets        → imágenes de cada vault   → public/vault-assets/
#   · build-planner-data → Electivas/data.js (JSON) → lib/planner/data.json
#   · copy-vault-apps    → HTML sueltos de vaults    → public/apps/
# Esos pasos ya corren en los hooks predev/prebuild de npm; este script además
# limpia las cachés para que NUNCA queden cambios viejos pegados.
#
# Uso:
#   ./run.sh            modo dev: limpia, regenera y arranca el dev server con
#                       hot-reload en  http://localhost:3000
#   ./run.sh build      build estático de producción (idéntico a GitHub Pages):
#                       next build + pagefind, y lo sirve en
#                       http://localhost:3000/StudyVaults/
#   ./run.sh clean      solo borra cachés y artefactos generados
#
set -euo pipefail

# --- ubicarse en site/ sin importar desde dónde se invoque -------------------
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE="$ROOT/site"
cd "$SITE"

PORT="${PORT:-3000}"
MODE="${1:-dev}"

log()  { printf '\033[1;36m▶ %s\033[0m\n' "$*"; }
err()  { printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; }

# Mata cualquier proceso pegado en el puerto para no chocar al arrancar.
free_port() {
  local pids
  pids="$(lsof -ti tcp:"$PORT" 2>/dev/null || true)"
  if [ -n "$pids" ]; then
    log "Liberando puerto $PORT (PIDs: $pids)"
    # shellcheck disable=SC2086
    kill $pids 2>/dev/null || true
    sleep 1
  fi
}

ensure_deps() {
  if [ ! -d node_modules ]; then
    log "Instalando dependencias (npm ci)"
    npm ci
  fi
}

# Borra todo lo derivado: caché de Next, export estático y contenido generado.
# Así un cambio en una vault/electivas siempre se vuelve a tomar desde cero.
clean() {
  log "Limpiando caché de Next y artefactos generados"
  rm -rf .next out tsconfig.tsbuildinfo \
         public/apps public/electivas public/vault-assets public/pagefind \
         lib/planner/data.json .preview
}

case "$MODE" in
  clean)
    clean
    log "Listo."
    ;;

  build|prod)
    ensure_deps
    clean
    free_port
    log "Build estático de producción (prebuild + next build + pagefind)…"
    npm run build
    # Preview fiel a GitHub Pages: el sitio se sirve bajo /StudyVaults, así que
    # montamos out/ en un dir con ese nombre y servimos estático local.
    rm -rf .preview && mkdir -p .preview
    ln -s "$SITE/out" "$SITE/.preview/StudyVaults"
    free_port
    log "Sirviendo build en  http://localhost:$PORT/StudyVaults/  (Ctrl+C para salir)"
    cd "$SITE/.preview"
    exec python3 -m http.server "$PORT"
    ;;

  dev|"")
    ensure_deps
    clean
    free_port
    log "Dev server con hot-reload en  http://localhost:$PORT  (Ctrl+C para salir)"
    # npm run dev dispara el hook predev (regenera todo el contenido) y luego
    # arranca next dev; -p fija el puerto.
    exec npm run dev -- -p "$PORT"
    ;;

  *)
    err "Modo desconocido: $MODE"
    echo "Uso: ./run.sh [dev|build|clean]" >&2
    exit 1
    ;;
esac
