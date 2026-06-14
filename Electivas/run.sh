#!/usr/bin/env bash
# Regenera data.js y sirve la app en http://localhost:8000, abriéndola en el navegador.
set -euo pipefail
cd "$(dirname "$0")"

python3 ./build-data.py

PORT="${1:-8000}"
python3 -m http.server "$PORT" &
server_pid=$!
trap 'kill "$server_pid" 2>/dev/null || true' EXIT

sleep 1
open "http://localhost:$PORT/" 2>/dev/null || true

echo "Servidor en http://localhost:$PORT/  (Ctrl+C para frenar)"
wait "$server_pid"
