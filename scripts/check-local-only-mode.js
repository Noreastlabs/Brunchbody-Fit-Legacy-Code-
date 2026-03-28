#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const runtimeModePath = path.join(repoRoot, 'src/config/runtimeMode.js');

if (!fs.existsSync(runtimeModePath)) {
  console.error('[local-only-check] Missing src/config/runtimeMode.js');
  process.exit(1);
}

const runtimeModeSource = fs.readFileSync(runtimeModePath, 'utf8');
const localOnlyMatch = runtimeModeSource.match(/LOCAL_ONLY\s*=\s*(true|false)/);

if (!localOnlyMatch) {
  console.error('[local-only-check] Could not determine LOCAL_ONLY value.');
  process.exit(1);
}

const localOnlyEnabled = localOnlyMatch[1] === 'true';
if (!localOnlyEnabled) {
  console.log('[local-only-check] LOCAL_ONLY is false; remote import/call check skipped.');
  process.exit(0);
}

const scanDir = path.join(repoRoot, 'src');
const fileExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);
const violations = [];

const disallowedImportPattern = /(?:import\s+[^;]*?from\s+['\"][^'\"]*(?:firebase|aws-amplify|@aws-sdk|aws-sdk)[^'\"]*['\"]|require\(\s*['\"][^'\"]*(?:firebase|aws-amplify|@aws-sdk|aws-sdk)[^'\"]*['\"]\s*\))/g;
const disallowedApiPattern = /api\/user\//g;

function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, {withFileTypes: true});
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!fileExtensions.has(path.extname(entry.name))) {
      continue;
    }

    const source = fs.readFileSync(fullPath, 'utf8');
    const relativePath = path.relative(repoRoot, fullPath);
    const lines = source.split(/\r?\n/);

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (disallowedImportPattern.test(line) || disallowedApiPattern.test(line)) {
        violations.push(`${relativePath}:${i + 1}: ${line.trim()}`);
      }
      disallowedImportPattern.lastIndex = 0;
      disallowedApiPattern.lastIndex = 0;
    }
  }
}

walk(scanDir);

if (violations.length > 0) {
  console.error('[local-only-check] Found disallowed remote integrations while LOCAL_ONLY=true:');
  for (const violation of violations) {
    console.error(`  - ${violation}`);
  }
  process.exit(1);
}

console.log('[local-only-check] Passed: no Firebase/AWS imports or api/user/ calls found in src/.');
