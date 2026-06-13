import {
  DEFAULT_ADAPTIVE_MAX_WIDTH,
  getAdaptiveContentStyle,
} from '../src/components/SafeAreaWrapper/SafeAreaWrapper';

describe('adaptive readiness boundary', () => {
  test('content remains full width on phone-sized screens', () => {
    expect(getAdaptiveContentStyle({width: 390})).toEqual({
      flex: 1,
      width: '100%',
    });
  });

  test('content is constrained and centered on wide screens', () => {
    expect(getAdaptiveContentStyle({width: 1024})).toEqual({
      flex: 1,
      width: DEFAULT_ADAPTIVE_MAX_WIDTH,
      alignSelf: 'center',
    });
  });

  test('invalid width falls back to the mobile-safe style', () => {
    expect(getAdaptiveContentStyle({width: undefined})).toEqual({
      flex: 1,
      width: '100%',
    });
  });
});
