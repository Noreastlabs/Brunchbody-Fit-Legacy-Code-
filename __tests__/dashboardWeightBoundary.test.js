import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import CarouselCards from '../src/screens/dashboard/components/Carousel';

jest.mock('react-native-chart-kit', () => {
  const ReactLocal = require('react');

  return {
    LineChart: props => ReactLocal.createElement('mock-line-chart', props),
  };
});

jest.mock('react-native-responsive-fontsize', () => ({
  RFPercentage: value => value,
  RFValue: value => value,
}));

jest.mock('react-native-swiper', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-swiper', props, props.children);
});

jest.mock('../src/resources', () => ({
  __esModule: true,
  colors: {
    background: 'background',
    grey: 'grey',
    mainFont: 'mainFont',
    nonEditableOverlays: 'nonEditableOverlays',
    secondary: 'secondary',
    tertiary: 'tertiary',
    white: 'white',
  },
}));

const baseProps = {
  loader: false,
  weightData: ['135', 0, 'bad-input'],
  outlookData: [1, 2, 3],
  calDiffData: [100, 0, -50],
  labelsData: ['Mon', 'Tue', 'Wed'],
};

const renderChartData = user => {
  let renderer;

  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <CarouselCards {...baseProps} user={user} />,
    );
  });

  const [outlookChart, weightChart, calorieChart] = renderer.root
    .findAllByType('mock-line-chart')
    .map(chart => chart.props.data);

  return {
    outlookChart,
    weightChart,
    calorieChart,
  };
};

describe('dashboard weight display boundary', () => {
  test('falls back to pounds label and values without a preference', () => {
    const {weightChart} = renderChartData(undefined);

    expect(weightChart.legend).toEqual(['Weight (lbs)']);
    expect(weightChart.datasets[0].data).toEqual(['135', 0, 'bad-input']);
  });

  test('falls back to pounds label and values without a supported preference', () => {
    const {weightChart} = renderChartData({
      bodyUnitPreference: 'unsupported',
    });

    expect(weightChart.legend).toEqual(['Weight (lbs)']);
    expect(weightChart.datasets[0].data).toEqual(['135', 0, 'bad-input']);
  });

  test('uses pounds label and values for standard preference', () => {
    const {weightChart} = renderChartData({
      bodyUnitPreference: 'standard',
    });

    expect(weightChart.legend).toEqual(['Weight (lbs)']);
    expect(weightChart.datasets[0].data).toEqual(['135', 0, 'bad-input']);
  });

  test('uses kilogram label and converted display values for metric preference', () => {
    const {weightChart} = renderChartData({
      bodyUnitPreference: 'metric',
    });

    expect(weightChart.legend).toEqual(['Weight (kg)']);
    expect(weightChart.datasets[0].data).toEqual([61.23, 0, 0]);
  });

  test('does not convert Outlook or Calorie Differential chart data for metric preference', () => {
    const {outlookChart, calorieChart} = renderChartData({
      bodyUnitPreference: 'metric',
    });

    expect(outlookChart.legend).toEqual(['Outlook']);
    expect(outlookChart.datasets[0].data).toEqual(baseProps.outlookData);
    expect(calorieChart.legend).toEqual(['Calorie Differential']);
    expect(calorieChart.datasets[0].data).toEqual(baseProps.calDiffData);
  });
});
