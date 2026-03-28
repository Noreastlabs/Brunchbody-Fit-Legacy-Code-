#!/usr/bin/env bash
set -euo pipefail

forbidden_ext_pattern='\.(keystore|jks|p12|pem)$'
aws_access_key_pattern='\b(A3T|AKIA|ASIA|AGPA|AIDA|AROA|ANPA)[0-9A-Z]{16}\b'
google_api_key_pattern='\bAIza[0-9A-Za-z\-_]{35}\b'
bearer_token_pattern='\bBearer[[:space:]]+[A-Za-z0-9._~+\/-]{20,}=*\b'
db_url_with_credentials_pattern='\b(postgres(?:ql)?|mysql|mariadb|mongodb(?:\+srv)?|redis):\/\/[^[:space:]:/]+:[^[:space:]@/]+@[^[:space:]]+'
private_key_pattern='-----BEGIN (RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----'

hits_file="$(mktemp)"
cleanup() {
  rm -f "$hits_file"
}
trap cleanup EXIT

build_exclude_args() {
  local exclude_file='.secret-scan-exclusions'
  local -a args=()

  if [[ -f "$exclude_file" ]]; then
    while IFS= read -r raw || [[ -n "$raw" ]]; do
      local line
      line="${raw%%#*}"
      line="${line%$'\r'}"
      line="$(echo "$line" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
      [[ -z "$line" ]] && continue
      args+=(":(exclude)$line")
    done <"$exclude_file"
  fi

  printf '%s\n' "${args[@]}"
}

run_pattern_scan() {
  local label="$1"
  local pattern="$2"
  shift 2
  local -a pathspec=("$@")

  if git grep -nEI "$pattern" -- . "${pathspec[@]}" >"$hits_file" 2>/dev/null; then
    echo "❌ Found ${label} in tracked files:"
    cat "$hits_file"
    echo
    return 1
  fi

  return 0
}

echo 'Checking tracked files for forbidden secret file extensions...'
forbidden_files="$(git ls-files | grep -E "$forbidden_ext_pattern" || true)"
if [[ -n "$forbidden_files" ]]; then
  echo '❌ Found tracked files with forbidden extensions:'
  echo "$forbidden_files"
  echo
  echo 'Remove these files from git tracking and store them outside the repository.'
  exit 1
fi

mapfile -t exclude_args < <(build_exclude_args)

echo 'Checking tracked file contents for high-risk secret patterns...'
run_pattern_scan 'AWS-style access keys' "$aws_access_key_pattern" "${exclude_args[@]}" || exit 1
run_pattern_scan 'Google API keys' "$google_api_key_pattern" "${exclude_args[@]}" || exit 1
run_pattern_scan 'Bearer tokens' "$bearer_token_pattern" "${exclude_args[@]}" || exit 1
run_pattern_scan 'database URLs with embedded credentials' "$db_url_with_credentials_pattern" "${exclude_args[@]}" || exit 1
run_pattern_scan 'private key material' "$private_key_pattern" "${exclude_args[@]}" || exit 1

echo '✅ Secret scan passed.'
