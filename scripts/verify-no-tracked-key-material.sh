#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

patterns=(
  '*.keystore'
  '*.jks'
  '*.p12'
  '*.pem'
  '*.key'
  '*.mobileprovision'
)

matches="$(git ls-files -- "${patterns[@]}")"

if [[ -n "$matches" ]]; then
  echo '❌ Tracked key/certificate material detected:'
  echo "$matches"
  echo ''
  echo 'Remove these files from git tracking immediately.'
  exit 1
fi

echo '✅ No tracked key/certificate files match restricted extensions.'
