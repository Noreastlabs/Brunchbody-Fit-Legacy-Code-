jest.mock('../src/storage/mmkv/index', () => ({
  storage: {
    getBoolean: jest.fn(),
    getString: jest.fn(),
    set: jest.fn(),
  },
}));

jest.mock('../src/utils/storageUtils', () => ({
  setJSON: jest.fn(),
}));

import { hydrateWorkoutPlans } from '../src/storage/mmkv/hydration';
import { brunchBodyPlans } from '../src/data/brunchBodyPlans';
import { STORAGE_KEYS } from '../src/storage/mmkv/keys';
import { storage } from '../src/storage/mmkv/index';
import { setJSON } from '../src/utils/storageUtils';

describe('MMKV bundled plan hydration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('reseeds bundled plans when the initialization sentinel is false', () => {
    storage.getBoolean.mockReturnValueOnce(false);

    hydrateWorkoutPlans();

    expect(storage.getString).not.toHaveBeenCalled();
    expect(setJSON).toHaveBeenCalledWith(
      STORAGE_KEYS.PLANS.BRUNCH_BODY,
      brunchBodyPlans,
    );
    expect(storage.set).toHaveBeenCalledWith(STORAGE_KEYS.IS_INITIALIZED, true);
  });

  test('reseeds bundled plans when the sentinel is true but the payload is missing', () => {
    storage.getBoolean.mockReturnValueOnce(true);
    storage.getString.mockReturnValueOnce(undefined);

    hydrateWorkoutPlans();

    expect(storage.getString).toHaveBeenCalledWith(
      STORAGE_KEYS.PLANS.BRUNCH_BODY,
    );
    expect(setJSON).toHaveBeenCalledWith(
      STORAGE_KEYS.PLANS.BRUNCH_BODY,
      brunchBodyPlans,
    );
    expect(storage.set).toHaveBeenCalledWith(STORAGE_KEYS.IS_INITIALIZED, true);
  });

  test('reseeds bundled plans when the sentinel is true but the payload is malformed JSON', () => {
    storage.getBoolean.mockReturnValueOnce(true);
    storage.getString.mockReturnValueOnce('not-json');

    hydrateWorkoutPlans();

    expect(storage.getString).toHaveBeenCalledWith(
      STORAGE_KEYS.PLANS.BRUNCH_BODY,
    );
    expect(setJSON).toHaveBeenCalledWith(
      STORAGE_KEYS.PLANS.BRUNCH_BODY,
      brunchBodyPlans,
    );
    expect(storage.set).toHaveBeenCalledWith(STORAGE_KEYS.IS_INITIALIZED, true);
  });

  test.each([
    {
      label: 'a non-array payload',
      rawPayload: JSON.stringify({ name: 'Starter', weeksData: [] }),
    },
    {
      label: 'an array item missing the required plan shape',
      rawPayload: JSON.stringify([{ id: 'bb-1', weeksData: [] }]),
    },
  ])(
    'reseeds bundled plans when the sentinel is true but the payload is unusable: $label',
    ({ rawPayload }) => {
      storage.getBoolean.mockReturnValueOnce(true);
      storage.getString.mockReturnValueOnce(rawPayload);

      hydrateWorkoutPlans();

      expect(storage.getString).toHaveBeenCalledWith(
        STORAGE_KEYS.PLANS.BRUNCH_BODY,
      );
      expect(setJSON).toHaveBeenCalledWith(
        STORAGE_KEYS.PLANS.BRUNCH_BODY,
        brunchBodyPlans,
      );
      expect(storage.set).toHaveBeenCalledWith(
        STORAGE_KEYS.IS_INITIALIZED,
        true,
      );
    },
  );

  test('preserves a usable bundled plans payload when the sentinel is already true', () => {
    storage.getBoolean.mockReturnValueOnce(true);
    storage.getString.mockReturnValueOnce(
      JSON.stringify([{ id: 'bb-1', name: 'Starter', weeksData: [] }]),
    );

    hydrateWorkoutPlans();

    expect(storage.getString).toHaveBeenCalledWith(
      STORAGE_KEYS.PLANS.BRUNCH_BODY,
    );
    expect(setJSON).not.toHaveBeenCalled();
    expect(storage.set).not.toHaveBeenCalled();
  });
});
