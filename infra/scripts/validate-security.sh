#!/usr/bin/env sh

set -eu

BASE_URL="${1:-http://localhost}"

echo "[1/3] Revisando headers base..."
curl -sI "$BASE_URL" | grep -E "X-Frame-Options|X-Content-Type-Options|Referrer-Policy" || true

echo "[2/3] Probando endpoint login..."
curl -s -o /dev/null -w "%{http_code}\n" "$BASE_URL/api/auth/login"

echo "[3/3] Validación rápida finalizada"
