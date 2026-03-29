#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$REPO_ROOT"

source ./.secret-scan-config.sh

RANGE="${SECRET_SCAN_RANGE:-}"
REPORT_FILE="${SECRET_SCAN_REPORT_FILE:-secret-scan-report.txt}"
for arg in "$@"; do
  case "$arg" in
    --range=*)
      RANGE="${arg#--range=}"
      ;;
    --report=*)
      REPORT_FILE="${arg#--report=}"
      ;;
  esac
done

hits_file="$(mktemp)"
cleanup() {
  rm -f "$hits_file"
}
trap cleanup EXIT

: > "$REPORT_FILE"

report() {
  echo "$*" | tee -a "$REPORT_FILE"
}

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

validate_exclusion_justifications() {
  local -a raw_exclusions=("$@")
  local justification_file='.secret-scan-exclusions-justifications.csv'

  if [[ ${#raw_exclusions[@]} -eq 0 ]]; then
    return 0
  fi

  if [[ ! -f "$justification_file" ]]; then
    report "❌ Missing ${justification_file}."
    report '   Every exclusion must be explicitly justified and periodically re-reviewed.'
    return 1
  fi

  local path
  for exclusion in "${raw_exclusions[@]}"; do
    path="${exclusion#:(exclude)}"

    if [[ "$path" == *'*'* || "$path" == *'?'* || "$path" == *'['* ]]; then
      report "❌ Invalid exclusion path: ${path}"
      report '   Globs are not permitted; exclusions must be exact file paths.'
      return 1
    fi

    if ! awk -F',' -v target="$path" 'NR > 1 && $1 == target { found=1 } END { exit(found ? 0 : 1) }' "$justification_file"; then
      report "❌ Missing justification metadata for exclusion: ${path}"
      report "   Add a reviewed entry to ${justification_file} before allowlisting this file."
      return 1
    fi
  done

  return 0
}

validate_exclusions() {
  local -a raw_exclusions=("$@")
  local exclusion

  if [[ ${#raw_exclusions[@]} -eq 0 ]]; then
    return 0
  fi

  report 'Validating exclusions (only lockfiles and validated binary false positives are allowed)...'

  for exclusion in "${raw_exclusions[@]}"; do
    local path="${exclusion#:(exclude)}"
    if [[ ! "$path" =~ ${ALLOWED_EXCLUSION_PATHS_REGEX} ]]; then
      report "❌ Invalid exclusion path: ${path}"
      report "   Exclusions must be lockfiles or validated binary false positives."
      return 1
    fi

    if ! git ls-files --error-unmatch "$path" >/dev/null 2>&1; then
      report "❌ Invalid exclusion path: ${path}"
      report '   Exclusions must point to tracked repository files.'
      return 1
    fi
  done

  validate_exclusion_justifications "${raw_exclusions[@]}" || return 1

  report '✅ Exclusion validation passed.'
  return 0
}

scan_content() {
  local scan_scope="$1"
  shift
  local -a pathspec=("$@")

  for i in "${!PATTERN_LABELS[@]}"; do
    local label="${PATTERN_LABELS[$i]}"
    local pattern="${PATTERN_REGEXES[$i]}"

    if git grep -nEI "$pattern" -- . "${pathspec[@]}" >"$hits_file" 2>/dev/null; then
      report "❌ Found ${label} in ${scan_scope}:"
      cat "$hits_file" | tee -a "$REPORT_FILE"
      report ''
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
      report '❌ Found files with forbidden credential-related extensions:'
      echo "$matches" | tee -a "$REPORT_FILE"
      report ''
      report 'Remove these files from git tracking and store them outside the repository.'
      return 1
    fi
  fi

  return 0
}

exclude_args=()
while IFS= read -r exclude_arg; do
  [[ -z "$exclude_arg" ]] && continue
  exclude_args+=("$exclude_arg")
done < <(build_exclude_args)

validate_exclusions "${exclude_args[@]}" || exit 1

report 'Checking tracked repository files for forbidden secret artifacts and patterns...'
scan_forbidden_filenames "$(git ls-files)" || exit 1
scan_content 'tracked repository files' "${exclude_args[@]}" || exit 1

if [[ -n "$RANGE" ]]; then
  report "Checking commit range ${RANGE} for newly introduced forbidden artifacts and secret patterns..."

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
        report "❌ Found high-risk patterns introduced by commits in ${RANGE} (file: ${file}):"
        cat "$hits_file" | tee -a "$REPORT_FILE"
        report ''
        exit 1
      fi
    done <<<"$changed_files"
  fi
fi

report '✅ Secret scan passed.'
