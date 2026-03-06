#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_BIN="${NODE_BIN:-node}"
INSTALLER="$SCRIPT_DIR/scripts/install.mjs"

if ! command -v "$NODE_BIN" >/dev/null 2>&1; then
  echo "Error: Node.js is required but '$NODE_BIN' was not found in PATH." >&2
  exit 1
fi

exec "$NODE_BIN" "$INSTALLER" "$@"
