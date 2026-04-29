import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../src/components', () => {
  const ReactLocal = require('react');

  return {
    CustomHeader: props =>
      ReactLocal.createElement('mock-custom-header', props),
    SafeAreaWrapper: ({children}) =>
      ReactLocal.createElement('mock-safe-area-wrapper', null, children),
  };
});

jest.mock('../src/resources', () => ({
  colors: {
    background: 'background',
    white: 'white',
  },
}));

import HelpAndSupport from '../src/screens/setting/components/HelpAndSupport/HelpAndSupport';

const collectRenderedText = value => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(collectRenderedText).join(' ');
  }

  return collectRenderedText(value.children);
};

const FORBIDDEN_REACHABLE_ACCOUNT_AUTH_COPY = [
  /\baccount\b/i,
  /\blog(?:\s|-)?in\b/i,
  /\blog(?:\s|-)?out\b/i,
  /\bpassword\b/i,
  /\bdelete account\b/i,
  /\breset password\b/i,
];

describe('Help & Support screen', () => {
  test('renders local-first help and escalation boundaries', async () => {
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<HelpAndSupport />);
    });

    const renderedText = collectRenderedText(renderer.toJSON()).replace(
      /\s+/g,
      ' ',
    );

    expect(renderedText).toContain('Help & Support');
    expect(renderedText).toContain(
      'Brunch Body helps you organize user-entered fitness, nutrition, journal, calendar, todo, planning, and Profile information.',
    );
    expect(renderedText).toContain('Nickname');
    expect(renderedText).toContain('Saved on this device');
    expect(renderedText).toContain('Saved on this device only');
    expect(renderedText).toContain('app-managed local data');
    expect(renderedText).toContain(
      'The current app does not provide Brunch Body cloud sync, remote recovery, automatic Brunch Body backup or restore, or support-side inspection or deletion of device-local app data.',
    );
    expect(renderedText).toContain('Delete local data');
    expect(renderedText).toContain(
      'It does not remove files you exported, copied, shared, moved, backed up, uploaded, placed in operating-system backups or cloud folders, or otherwise saved outside the app.',
    );
    expect(renderedText).toContain(
      'For beta or tester feedback, use the existing Support & Contact link in Settings or the release/tester materials you were given.',
    );
    expect(renderedText).toContain(
      'For health, training, or nutrition decisions, rely on qualified professionals.',
    );
    expect(renderedText).toContain('When something feels wrong');
    expect(renderedText).toContain(
      'If Brunch Body data looks missing or unexpected, first check that you are using the same device and current app install where you entered it.',
    );
    expect(renderedText).toContain(
      'Because Brunch Body is saved on this device only, the app does not provide cloud recovery or retrieve a copy from another device.',
    );
    expect(renderedText).toContain(
      'If a Profile value looks wrong, open Profile and update the value saved on this device.',
    );
    expect(renderedText).toContain(
      'If you used Delete local data, Brunch Body cannot recover local data after you delete it unless you separately saved or exported a copy.',
    );
    expect(renderedText).toContain(
      'Files you export, copy, share, or move are managed outside the app. Delete local data does not remove those files.',
    );
    expect(renderedText).toContain(
      'Brunch Body cannot inspect or restore device-local app data for you.',
    );
    expect(renderedText).toContain('Share feedback');
    expect(renderedText).toContain(
      'Brunch Body does not automatically monitor what you do in the app.',
    );
    expect(renderedText).toContain(
      'You do not need to include exported files, screenshots with private details, or sensitive health information unless you choose to.',
    );

    FORBIDDEN_REACHABLE_ACCOUNT_AUTH_COPY.forEach(pattern => {
      expect(renderedText).not.toMatch(pattern);
    });

    expect(renderedText).not.toContain('syncs across devices');
    expect(renderedText).not.toContain('cloud recovery is available');
    expect(renderedText).not.toContain('cloud restore is available');
    expect(renderedText).not.toContain('remote recovery is available');
    expect(renderedText).not.toContain('support staff can access');
    expect(renderedText).not.toContain('support staff access');
    expect(renderedText).not.toContain('remote deletion');
    expect(renderedText).not.toContain('AI advice');
    expect(renderedText).not.toContain('medical advice');
    expect(renderedText).not.toContain('guaranteed backup');
    expect(renderedText).not.toContain('guaranteed restore');
    expect(renderedText).not.toContain('full backup');
    expect(renderedText).not.toContain('support chat');
    expect(renderedText).not.toContain('ticket');
    expect(renderedText).not.toContain('analytics');
    expect(renderedText).not.toContain('telemetry');
    expect(renderedText).not.toContain('crash reporting');
    expect(renderedText).not.toContain('support case');
    expect(renderedText).not.toContain('case number');
    expect(renderedText).not.toContain('open a case');
    expect(renderedText).not.toContain('automatically collect');
    expect(renderedText).not.toContain('automatically send');
    expect(renderedText).not.toContain('background monitoring');
    expect(renderedText).not.toContain('we will respond');
  });
});
