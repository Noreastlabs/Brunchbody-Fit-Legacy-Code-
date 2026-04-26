import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../src/components', () => {
  const ReactLocal = require('react');

  return {
    CustomHeader: props =>
      ReactLocal.createElement('mock-custom-header', props),
    LogoHeader: props => ReactLocal.createElement('mock-logo-header', props),
  };
});

import Name from '../src/screens/completeProfile/components/Name';
import {strings} from '../src/resources';

const ONBOARDING_LOCAL_DATA_NOTICE =
  strings.completeProfile.helperText.localDataNotice;

const FORBIDDEN_COPY = [
  'Delete account',
  'account',
  'stored in your account',
  'securely backed up',
  'backed up',
  'synced across devices',
  'sync',
  'cloud backup',
  'cloud recovery',
  'restore',
  'import',
  'consent',
  'study',
  'research',
  'data sharing',
  'medical advice',
  'diagnosis',
  'treatment',
  'HIPAA',
  'clinical',
  'guaranteed accurate',
];

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

const renderInAct = async element => {
  let renderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(element);
  });

  return renderer;
};

describe('Complete profile onboarding transparency copy', () => {
  test('Name step renders the approved local-data notice without forbidden claims', async () => {
    const renderer = await renderInAct(
      <Name currentScreen={jest.fn()} onChangeText={jest.fn()} text="" />,
    );

    const renderedText = collectRenderedText(renderer.toJSON());

    expect(renderedText).toContain(ONBOARDING_LOCAL_DATA_NOTICE);
    expect(renderedText).toContain('saved on this device');
    expect(renderedText).toContain('used for in-app calculations and display');
    FORBIDDEN_COPY.forEach(copy => {
      expect(renderedText).not.toContain(copy);
    });
  });
});
