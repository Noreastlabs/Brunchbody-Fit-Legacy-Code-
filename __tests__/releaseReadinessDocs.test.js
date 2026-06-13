import {readFileSync} from 'fs';
import path from 'path';

const repoRoot = path.join(__dirname, '..');
const readDoc = relativePath =>
  readFileSync(path.join(repoRoot, relativePath), 'utf8');

const forbiddenLaunchClaims = [
  /public launch approved/i,
  /store ready/i,
  /guaranteed approval/i,
  /provides cloud sync|cloud sync enabled|syncs across devices/i,
  /AI coaching enabled/i,
  /medical advice/i,
];

describe('release readiness docs', () => {
  test('beta operations define local-first intake and owner gates', () => {
    const doc = readDoc('docs/release/beta-program-operations-2026-06-13.md');

    expect(doc).toContain('Owner Gate');
    expect(doc).toContain('local-first');
    expect(doc).toContain('No tester should be asked to send exported files');
    expect(doc).toContain('RC2 signed Android/iOS artifacts');
    forbiddenLaunchClaims.forEach(pattern => {
      expect(doc).not.toMatch(pattern);
    });
  });

  test('feedback intake separates triage from private data collection', () => {
    const doc = readDoc('docs/release/feedback-intake-structure-2026-06-13.md');

    expect(doc).toContain('Feedback Category');
    expect(doc).toContain('Do not request sensitive health details');
    expect(doc).toContain('Support & Contact');
    expect(doc).toContain('privacy wording');
  });

  test('store metadata system keeps claims reviewable and unlaunched', () => {
    const doc = readDoc(
      'docs/release/store-metadata-creative-system-2026-06-13.md',
    );

    expect(doc).toContain('Metadata Source of Truth');
    expect(doc).toContain('Creative Checklist');
    expect(doc).toContain('Forbidden Claims');
    expect(doc).toContain('local-first personal organization');
    forbiddenLaunchClaims.forEach(pattern => {
      expect(doc).not.toMatch(pattern);
    });
  });
});
