#!/usr/bin/env bash
# Shared secret scanning policy for local checks and CI.

FORBIDDEN_FILE_EXTENSIONS_REGEX='\.(keystore|jks|p12|pfx|pem|key|crt|cer|der|mobileprovision|provisionprofile)$'
ALLOWED_EXCLUSION_PATHS_REGEX='(^|/)([^/]+\.lock|gradle-wrapper\.jar)$'

PATTERN_LABELS=(
  'AWS access keys'
  'GCP API keys'
  'Firebase tokens'
  'GitHub tokens'
  'Bearer tokens'
  'Database URLs with embedded credentials'
  'Private key headers'
)

PATTERN_REGEXES=(
  '\b(A3T|AKIA|ASIA|AGPA|AIDA|AROA|ANPA)[0-9A-Z]{16}\b'
  '\bAIza[0-9A-Za-z\-_]{35}\b'
  '\bAAAA[A-Za-z0-9_-]{7}:[A-Za-z0-9_-]{140}\b'
  '\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,255}\b|\bgithub_pat_[A-Za-z0-9_]{80,255}\b'
  '\bBearer[[:space:]]+[A-Za-z0-9._~+\/-]{20,}=*\b'
  '\b(postgres|postgresql|mysql|mariadb|mongodb|mongodb\+srv|redis):\/\/[^[:space:]:/]+:[^[:space:]@/]+@[^[:space:]]+'
  '-----BEGIN (RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----'
)
