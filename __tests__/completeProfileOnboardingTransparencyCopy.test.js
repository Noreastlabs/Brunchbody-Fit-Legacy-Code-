import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../src/components', () => {
  const ReactLocal = require('react');

  return {
    CustomHeader: props =>
      ReactLocal.createElement('mock-custom-header', props),
    CustomModal: props =>
      ReactLocal.createElement('mock-custom-modal', props),
    HeightPickerModal: props =>
      ReactLocal.createElement('mock-height-picker-modal', props),
    LogoHeader: props => ReactLocal.createElement('mock-logo-header', props),
  };
});

import Height from '../src/screens/completeProfile/components/Height';
import Name from '../src/screens/completeProfile/components/Name';
import Weight from '../src/screens/completeProfile/components/Weight';
import {strings} from '../src/resources';

const ONBOARDING_LOCAL_DATA_NOTICE =
  strings.completeProfile.helperText.localDataNotice;
const BODY_UNIT_HELPER = strings.completeProfile.helperText.bodyUnitPreference;

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
const FORBIDDEN_BODY_UNIT_COPY = [
  'app-wide units',
  'app wide units',
  'all app units',
  'nutrition units',
  'workout units',
  'supplement units',
  'calendar units',
  'export units',
  'import units',
  'synced units',
  'cloud units',
  'account units',
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
    expect(renderedText).toContain('saved on this device only');
    expect(renderedText).toContain('used for in-app calculations and display');
    FORBIDDEN_COPY.forEach(copy => {
      expect(renderedText).not.toContain(copy);
    });
  });

  test('Height step frames Standard and Metric as body measurement units', async () => {
    const renderer = await renderInAct(
      <Height
        currentScreen={jest.fn()}
        modalVisible={false}
        setModalVisible={jest.fn()}
        feet={5}
        inches={6}
        isHeightSelected={false}
        onConfirmHeight={jest.fn()}
        bodyUnitPreference="metric"
        onChangeBodyUnitPreference={jest.fn()}
        metricHeightText=""
        onChangeMetricHeight={jest.fn()}
      />,
    );

    const renderedText = collectRenderedText(renderer.toJSON());

    expect(renderedText).toContain('Standard');
    expect(renderedText).toContain('Metric');
    expect(renderedText).toContain(BODY_UNIT_HELPER);
    FORBIDDEN_COPY.forEach(copy => {
      expect(renderedText).not.toContain(copy);
    });
    FORBIDDEN_BODY_UNIT_COPY.forEach(copy => {
      expect(renderedText.toLowerCase()).not.toContain(copy);
    });
  });

  test('Weight step frames Standard and Metric as body measurement units', async () => {
    const renderer = await renderInAct(
      <Weight
        currentScreen={jest.fn()}
        text=""
        onChangeText={jest.fn()}
        bodyUnitPreference="standard"
        onChangeBodyUnitPreference={jest.fn()}
      />,
    );

    const renderedText = collectRenderedText(renderer.toJSON());

    expect(renderedText).toContain('Standard');
    expect(renderedText).toContain('Metric');
    expect(renderedText).toContain(BODY_UNIT_HELPER);
    FORBIDDEN_COPY.forEach(copy => {
      expect(renderedText).not.toContain(copy);
    });
    FORBIDDEN_BODY_UNIT_COPY.forEach(copy => {
      expect(renderedText.toLowerCase()).not.toContain(copy);
    });
  });
});
