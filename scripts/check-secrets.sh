#!/usr/bin/env bash
set -euo pipefail

forbidden_ext_pattern='\.(keystore|jks|p12|pem)$'
private_key_pattern='-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----'

echo 'Checking tracked files for forbidden secret file extensions...'
forbidden_files="$(git ls-files | grep -E "$forbidden_ext_pattern" || true)"
if [[ -n "$forbidden_files" ]]; then
  echo '❌ Found tracked files with forbidden extensions:'
  echo "$forbidden_files"
  echo
  echo 'Remove these files from git tracking and store them outside the repository.'
  exit 1
fi

echo 'Checking tracked file contents for private key blocks...'
if git grep -nE "$private_key_pattern" -- . >/tmp/private_key_hits.txt 2>/dev/null; then
  echo '❌ Found private key material in tracked files:'
  cat /tmp/private_key_hits.txt
  echo
  echo 'Remove private keys from the repository immediately and rotate compromised keys.'
  rm -f /tmp/private_key_hits.txt
  exit 1
fi
rm -f /tmp/private_key_hits.txt

echo '✅ Secret scan passed.'
