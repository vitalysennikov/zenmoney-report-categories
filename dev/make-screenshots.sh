#!/usr/bin/env bash
# Генерирует screenshots/*.png для README на фиктивных данных (dev/fixture.js).
# Запуск: dev/make-screenshots.sh
set -euo pipefail
cd "$(dirname "$0")"

node build-demo.js

CHROME=google-chrome
OUT_DIR="../screenshots"
mkdir -p "$OUT_DIR"

declare -A ACTS=(
  [overview]=1
  [details]=2
  [refunds-transfers]=3
)

for name in "${!ACTS[@]}"; do
  act="${ACTS[$name]}"
  raw="/tmp/zmrc-shot-${name}.png"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --window-size=1200,3000 --virtual-time-budget=3000 \
    --screenshot="$raw" \
    "file://$(pwd)/demo.html?act=${act}" >/dev/null 2>&1
  convert "$raw" -trim +repage -bordercolor white -border 16 "$OUT_DIR/${name}.png"
  rm -f "$raw"
  echo "готово: $OUT_DIR/${name}.png"
done
