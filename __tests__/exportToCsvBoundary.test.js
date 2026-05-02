import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PermissionsAndroid } from 'react-native';
import * as ScopedStorage from 'react-native-scoped-storage';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';

jest.mock('react-redux', () => ({
  connect: () => Component => Component,
}));

jest.mock('xlsx', () => ({
  utils: {
    book_new: jest.fn(() => ({})),
    json_to_sheet: jest.fn(() => ({})),
    book_append_sheet: jest.fn(),
  },
  write: jest.fn(() => 'workbook-binary'),
}));

jest.mock('react-native-scoped-storage', () => ({
  openDocumentTree: jest.fn(),
  writeFile: jest.fn(),
}));

jest.mock('react-native-fs', () => ({
  writeFile: jest.fn(),
}));

jest.mock('../src/screens/setting/components', () => {
  const ReactLocal = require('react');

  return {
    ExportToCSV: props =>
      ReactLocal.createElement('mock-export-to-csv', props),
  };
});

import ExportToCSVPage from '../src/screens/setting/pages/Export To CSV/ExportToCSV';

const createJournalEntry = (entryType, entryData, date = '2024-01-01') => {
  const [year, month, day] = date.split('-').map(Number);

  return {
    createdOn: new Date(year, month - 1, day).getTime(),
    [entryType]: entryData,
  };
};

const getLatestSheetRows = () => {
  const calls = XLSX.utils.json_to_sheet.mock.calls;

  return calls[calls.length - 1][0];
};

const exportRowsForEntryType = async ({
  entryType,
  journalEntriesList,
  user,
}) => {
  let renderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <ExportToCSVPage
        navigation={{ navigate: jest.fn() }}
        journalEntriesList={journalEntriesList}
        user={user}
      />,
    );
  });

  await ReactTestRenderer.act(async () => {
    renderer.root.findByType('mock-export-to-csv').props.toggleSwitch(
      entryType,
    );
  });

  await ReactTestRenderer.act(async () => {
    await renderer.root.findByType('mock-export-to-csv').props.onExportHandler();
  });

  await ReactTestRenderer.act(async () => {});

  return getLatestSheetRows();
};

describe('selected journal export boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(PermissionsAndroid, 'check').mockResolvedValue(true);
    ScopedStorage.openDocumentTree.mockResolvedValue({
      path: '/mock/export-directory',
    });
    RNFS.writeFile.mockResolvedValue();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('exports metric WeightLog rows with source, display, and canonical unit context', async () => {
    const sourceEntry = createJournalEntry('WeightLog', {
      isDeleted: false,
      weight: '135',
      note: 'Morning weigh-in',
    });

    const rows = await exportRowsForEntryType({
      entryType: 'WeightLog',
      journalEntriesList: [sourceEntry],
      user: { bodyUnitPreference: 'metric' },
    });

    expect(rows).toEqual([
      {
        Dated: '1/1/2024',
        weight: '135',
        note: 'Morning weigh-in',
        weight_source_value: '135',
        weight_source_unit: 'lb',
        weight_display_value: '61.2',
        weight_display_unit: 'kg',
        weight_canonical_value: '61.2',
        weight_canonical_unit: 'kg',
      },
    ]);
    expect(sourceEntry.WeightLog).toEqual({
      isDeleted: false,
      weight: '135',
      note: 'Morning weigh-in',
    });
  });

  test('exports WeightLog canonical context from stored kilograms while preserving raw fields', async () => {
    const sourceEntry = createJournalEntry('WeightLog', {
      isDeleted: false,
      weight: '999',
      weightKilograms: 61.2,
      enteredWeightValue: '61.2',
      enteredWeightUnit: 'kg',
      note: 'Metric edit',
    });

    const rows = await exportRowsForEntryType({
      entryType: 'WeightLog',
      journalEntriesList: [sourceEntry],
      user: { bodyUnitPreference: 'metric' },
    });

    expect(rows).toEqual([
      {
        Dated: '1/1/2024',
        weight: '999',
        weightKilograms: 61.2,
        enteredWeightValue: '61.2',
        enteredWeightUnit: 'kg',
        note: 'Metric edit',
        weight_source_value: '999',
        weight_source_unit: 'lb',
        weight_display_value: '61.2',
        weight_display_unit: 'kg',
        weight_canonical_value: '61.2',
        weight_canonical_unit: 'kg',
      },
    ]);
    expect(sourceEntry.WeightLog).toEqual({
      isDeleted: false,
      weight: '999',
      weightKilograms: 61.2,
      enteredWeightValue: '61.2',
      enteredWeightUnit: 'kg',
      note: 'Metric edit',
    });
  });

  test('exports standard WeightLog display from stored canonical kilograms when present', async () => {
    const rows = await exportRowsForEntryType({
      entryType: 'WeightLog',
      journalEntriesList: [
        createJournalEntry('WeightLog', {
          isDeleted: false,
          weight: '999',
          weightKilograms: 61.2,
        }),
      ],
      user: { bodyUnitPreference: 'standard' },
    });

    expect(rows[0]).toEqual({
      Dated: '1/1/2024',
      weight: '999',
      weightKilograms: 61.2,
      weight_source_value: '999',
      weight_source_unit: 'lb',
      weight_display_value: '134.9',
      weight_display_unit: 'lb',
      weight_canonical_value: '61.2',
      weight_canonical_unit: 'kg',
    });
  });

  test('falls back to legacy WeightLog pounds when stored canonical kilograms are invalid', async () => {
    const rows = await exportRowsForEntryType({
      entryType: 'WeightLog',
      journalEntriesList: [
        createJournalEntry('WeightLog', {
          isDeleted: false,
          weight: '135',
          weightKilograms: 'bad-input',
        }),
      ],
      user: { bodyUnitPreference: 'metric' },
    });

    expect(rows[0]).toEqual({
      Dated: '1/1/2024',
      weight: '135',
      weightKilograms: 'bad-input',
      weight_source_value: '135',
      weight_source_unit: 'lb',
      weight_display_value: '61.2',
      weight_display_unit: 'kg',
      weight_canonical_value: '61.2',
      weight_canonical_unit: 'kg',
    });
  });

  test.each([
    { label: 'missing', user: undefined },
    { label: 'unsupported', user: { bodyUnitPreference: 'unsupported' } },
    { label: 'standard', user: { bodyUnitPreference: 'standard' } },
  ])(
    'exports $label WeightLog preference with legacy pound display context',
    async ({ user }) => {
      const rows = await exportRowsForEntryType({
        entryType: 'WeightLog',
        journalEntriesList: [
          createJournalEntry('WeightLog', {
            isDeleted: false,
            weight: '135.0',
          }),
        ],
        user,
      });

      expect(rows[0]).toEqual({
        Dated: '1/1/2024',
        weight: '135.0',
        weight_source_value: '135.0',
        weight_source_unit: 'lb',
        weight_display_value: '135.0',
        weight_display_unit: 'lb',
        weight_canonical_value: '61.2',
        weight_canonical_unit: 'kg',
      });
    },
  );

  test.each([
    {
      label: 'blank',
      weight: '',
      sourceValue: '',
      sourceUnit: '',
    },
    {
      label: 'unparseable',
      weight: 'bad-input',
      sourceValue: 'bad-input',
      sourceUnit: 'lb',
    },
    {
      label: 'zero',
      weight: '0',
      sourceValue: '0',
      sourceUnit: 'lb',
    },
    {
      label: 'negative',
      weight: '-1',
      sourceValue: '-1',
      sourceUnit: 'lb',
    },
    {
      label: 'infinite text',
      weight: 'Infinity',
      sourceValue: '',
      sourceUnit: '',
    },
    {
      label: 'nan number',
      weight: NaN,
      sourceValue: '',
      sourceUnit: '',
    },
    {
      label: 'missing value',
      weight: undefined,
      sourceValue: '',
      sourceUnit: '',
    },
  ])(
    'keeps $label WeightLog weights from exporting derived body measurements',
    async ({ weight, sourceValue, sourceUnit }) => {
      const rows = await exportRowsForEntryType({
        entryType: 'WeightLog',
        journalEntriesList: [
          createJournalEntry('WeightLog', {
            isDeleted: false,
            weight,
          }),
        ],
        user: { bodyUnitPreference: 'metric' },
      });

      expect(rows[0]).toMatchObject({
        weight,
        weight_source_value: sourceValue,
        weight_source_unit: sourceUnit,
        weight_display_value: '',
        weight_display_unit: '',
        weight_canonical_value: '',
        weight_canonical_unit: '',
      });

      [
        rows[0].weight_source_value,
        rows[0].weight_source_unit,
        rows[0].weight_display_value,
        rows[0].weight_display_unit,
        rows[0].weight_canonical_value,
        rows[0].weight_canonical_unit,
      ].forEach(value => {
        expect(value).not.toBeUndefined();
        expect(value).not.toBeNaN();
        expect(value).not.toBe(Infinity);
        expect(value).not.toBe(-Infinity);
      });
    },
  );

  test('leaves non-WeightLog selected rows unchanged by body unit export logic', async () => {
    const rows = await exportRowsForEntryType({
      entryType: 'CaloriesEntry',
      journalEntriesList: [
        createJournalEntry('CaloriesEntry', {
          isDeleted: false,
          weight: 'not-body-weight',
          caloriesIn: '1800',
          caloriesOut: '2200',
          supplement: 'Protein',
        }),
      ],
      user: { bodyUnitPreference: 'metric' },
    });

    expect(rows).toEqual([
      {
        Dated: '1/1/2024',
        weight: 'not-body-weight',
        caloriesIn: '1800',
        caloriesOut: '2200',
        supplement: 'Protein',
      },
    ]);
    expect(rows[0]).not.toHaveProperty('weight_source_value');
    expect(rows[0]).not.toHaveProperty('weight_display_unit');
    expect(rows[0]).not.toHaveProperty('weight_canonical_value');
  });
});
