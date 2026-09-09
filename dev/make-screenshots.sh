#!/usr/bin/env bash
# Генерирует screenshots/*.png для README на фиктивных данных (dev/fixture.js).
# Каждый сценарий — в двух темах (light/dark), т.к. страница сама подстраивается
# под prefers-color-scheme браузера; в README они переключаются через суффиксы
# GitHub #gh-light-mode-only / #gh-dark-mode-only.
# Запуск: dev/make-screenshots.sh
set -euo pipefail
cd "$(dirname "$0")"

node build-demo.js

PW=~/.local/bin/playwright
OUT_DIR="../screenshots"
mkdir -p "$OUT_DIR"

declare -A ACTS=(
  [overview]=1
  [details]=2
  [refunds-transfers]=3
  [filter-projects-include]=4
  [filter-projects-exclude]=5
)

for name in "${!ACTS[@]}"; do
  act="${ACTS[$name]}"
  for scheme in light dark; do
    suffix=""
    [ "$scheme" = "dark" ] && suffix="-dark"
    "$PW" screenshot \
      --color-scheme "$scheme" \
      --full-page \
      --viewport-size "820,900" \
      --wait-for-timeout 600 \
      "file://$(pwd)/demo.html?act=${act}" \
      "$OUT_DIR/${name}${suffix}.png" >/dev/null 2>&1
    echo "готово: $OUT_DIR/${name}${suffix}.png"
  done
done
