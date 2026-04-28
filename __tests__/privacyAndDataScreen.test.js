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

import PrivacyAndData from '../src/screens/setting/components/PrivacyAndData/PrivacyAndData';

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

describe('Privacy & Data screen', () => {
  test('renders the current local-first data behavior copy', async () => {
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<PrivacyAndData />);
    });

    const renderedText = collectRenderedText(renderer.toJSON());

    expect(renderedText).toContain('Privacy & Data');
    expect(renderedText).toContain(
      'Brunch Body is local-first in the current app. Your Brunch Body data is stored on this device in local app storage.',
    );
    expect(renderedText).toContain(
      'The current app does not automatically sync your data to a Brunch Body cloud service.',
    );
    expect(renderedText).toContain(
      'Brunch Body does not currently provide automatic Brunch Body cloud backup for device-local app data.',
    );
    expect(renderedText).toContain(
      'Profile and vitals values are stored locally and used for in-app calculations and display.',
    );
    expect(renderedText).toContain(
      'Once exported, you are responsible for where the file is saved, copied, shared, uploaded, or deleted.',
    );
    expect(renderedText).toContain(
      'Delete local data removes saved Brunch Body data from this device. It does not remove files you exported, copied, shared, uploaded, or saved outside the app.',
    );
    expect(renderedText).toContain(
      'This screen is a plain-English explanation of current app behavior. It is not the legal Privacy Policy or Terms of Use.',
    );
    expect(renderedText).not.toContain(
      'This screen is reserved for a plain-English Privacy & Data explanation.',
    );
    expect(renderedText).not.toContain('Delete account');
    expect(renderedText).not.toMatch(/\baccount\b/i);
    expect(renderedText).not.toMatch(/\blog(?:\s|-)?in\b/i);
    expect(renderedText).not.toMatch(/\blog(?:\s|-)?out\b/i);
    expect(renderedText).not.toMatch(/\bpassword\b/i);
    expect(renderedText).not.toContain('securely backed up');
    expect(renderedText).not.toContain('synced across devices');
    expect(renderedText).not.toContain('stored in your account');
    expect(renderedText).not.toContain('cloud recovery');
    expect(renderedText).not.toContain('full backup');
    expect(renderedText).not.toContain('restore/import');
  });
});
