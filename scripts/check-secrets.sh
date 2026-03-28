#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$REPO_ROOT"

source ./.secret-scan-config.sh

RANGE="${SECRET_SCAN_RANGE:-}"
for arg in "$@"; do
  case "$arg" in
    --range=*)
      RANGE="${arg#--range=}"
      ;;
  esac
done

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

scan_content() {
  local scan_scope="$1"
  shift
  local -a pathspec=("$@")

  for i in "${!PATTERN_LABELS[@]}"; do
    local label="${PATTERN_LABELS[$i]}"
    local pattern="${PATTERN_REGEXES[$i]}"

    if git grep -nEI "$pattern" -- . "${pathspec[@]}" >"$hits_file" 2>/dev/null; then
      echo "❌ Found ${label} in ${scan_scope}:"
      cat "$hits_file"
      echo
      return 1
    fi
  done

  return 0
}

scan_forbidden_filenames() {
  local files="$1"

  if [[ -n "$files" ]]; then
    local matches
    matches="$(echo "$files" | grep -E "$FORBIDDEN_FILE_EXTENSIONS_REGEX" || true)"
    if [[ -n "$matches" ]]; then
      echo '❌ Found files with forbidden credential-related extensions:'
      echo "$matches"
      echo
      echo 'Remove these files from git tracking and store them outside the repository.'
      return 1
    fi
  fi

  return 0
}

mapfile -t exclude_args < <(build_exclude_args)

echo 'Checking tracked repository files for forbidden secret artifacts and patterns...'
scan_forbidden_filenames "$(git ls-files)" || exit 1
scan_content 'tracked repository files' "${exclude_args[@]}" || exit 1

if [[ -n "$RANGE" ]]; then
  echo "Checking commit range ${RANGE} for newly introduced forbidden artifacts and secret patterns..."

  changed_files="$(git diff --name-only "$RANGE" -- || true)"
  scan_forbidden_filenames "$changed_files" || exit 1

  if [[ -n "$changed_files" ]]; then
    while IFS= read -r file; do
      [[ -z "$file" ]] && continue
      [[ ! -f "$file" ]] && continue

      skip_file=0
      for pathspec in "${exclude_args[@]}"; do
        excluded_path="${pathspec#:(exclude)}"
        if [[ "$file" == $excluded_path ]]; then
          skip_file=1
          break
        fi
      done

      (( skip_file == 1 )) && continue

      if git diff -U0 "$RANGE" -- "$file" | grep -E '^\+[^+]' | grep -nEI "$(IFS='|'; echo "${PATTERN_REGEXES[*]}")" >"$hits_file"; then
        echo "❌ Found high-risk patterns introduced by commits in ${RANGE} (file: ${file}):"
        cat "$hits_file"
        echo
        exit 1
      fi
    done <<<"$changed_files"
  fi
fi

echo '✅ Secret scan passed.'
