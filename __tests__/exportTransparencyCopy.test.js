import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PermissionsAndroid } from 'react-native';
import * as ScopedStorage from 'react-native-scoped-storage';
import RNFS from 'react-native-fs';

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

jest.mock('../src/components', () => {
  const ReactLocal = require('react');

  return {
    Button: props => ReactLocal.createElement('mock-button', props),
    CustomHeader: props =>
      ReactLocal.createElement('mock-custom-header', props),
    CustomModal: props =>
      ReactLocal.createElement('mock-custom-modal', props, props.content),
    PermissionModal: props =>
      ReactLocal.createElement('mock-permission-modal', props),
    SafeAreaWrapper: props =>
      ReactLocal.createElement('mock-safe-area-wrapper', props, props.children),
  };
});

jest.mock('../src/screens/setting/components', () => {
  const ReactLocal = require('react');

  return {
    ExportToCSV: props =>
      ReactLocal.createElement('mock-export-to-csv', props),
  };
});

import ExportToCSVSurface from '../src/screens/setting/components/Export To CSV/ExportToCSV';
import ExportToCSVPage from '../src/screens/setting/pages/Export To CSV/ExportToCSV';

const EXPORT_SUCCESS_MESSAGE =
  'Journal data was exported as an Excel workbook (.xlsx).\n\nExported files are user-managed copies after export. Brunch Body does not automatically import, restore, sync, or delete exported files.';
const FORBIDDEN_REACHABLE_ACCOUNT_AUTH_COPY = [
  /\baccount\b/i,
  /\blog(?:\s|-)?in\b/i,
  /\blog(?:\s|-)?out\b/i,
  /\bpassword\b/i,
  /\bdelete account\b/i,
  /\breset password\b/i,
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

const createExportSurfaceProps = props => ({
  navigation: { navigate: jest.fn() },
  listData: [
    {
      id: 1,
      title: 'Select Entries',
      options: [
        {
          id: 1,
          name: 'DAILY JOURNAL',
          value: 'DailyEntry',
          type: 'toggle',
          screen: '',
        },
      ],
    },
  ],
  toggleSwitch: jest.fn(),
  onExportHandler: jest.fn(),
  entryType: '',
  alertHeading: '',
  alertText: '',
  permissionModal: false,
  setPermissionModal: jest.fn(),
  loader: false,
  ...props,
});

describe('Export transparency copy', () => {
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

  test('renders selected journal xlsx export sensitivity and exported copy boundary copy', async () => {
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ExportToCSVSurface {...createExportSurfaceProps()} />,
      );
    });

    const renderedText = collectRenderedText(renderer.toJSON()).replace(
      /\s+/g,
      ' ',
    );

    expect(renderedText).toContain('Export Journal Data');
    expect(renderedText).toContain(
      'Exports selected journal entries as an Excel workbook (.xlsx).',
    );
    expect(renderedText).toContain(
      'Exported files may contain personal fitness, journal, nutrition, supplement, reflection, or profile-related information depending on what you export.',
    );
    expect(renderedText).toContain(
      'Exported files are user-managed copies after export.',
    );
    expect(renderedText).toContain(
      'Brunch Body does not currently provide app-managed import or restore for exported files.',
    );
    expect(renderedText).toContain(
      'Files saved outside the app are not removed by Delete local data.',
    );
    expect(renderedText).toContain(
      'Android and iOS device backups, file apps, cloud folders, and device-transfer tools are outside Brunch Body app-managed storage.',
    );
    FORBIDDEN_REACHABLE_ACCOUNT_AUTH_COPY.forEach(pattern => {
      expect(renderedText).not.toMatch(pattern);
    });
  });

  test('shows the xlsx export success modal with exported copy boundary copy', async () => {
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ExportToCSVPage
          navigation={{ navigate: jest.fn() }}
          journalEntriesList={[
            {
              createdOn: new Date('2024-01-01T00:00:00.000Z').getTime(),
              DailyEntry: {
                isDeleted: false,
                thought: 'Reflection',
              },
            },
          ]}
        />,
      );
    });

    await ReactTestRenderer.act(async () => {
      renderer.root
        .findByType('mock-export-to-csv')
        .props.toggleSwitch('DailyEntry');
    });

    await ReactTestRenderer.act(async () => {
      await renderer.root.findByType('mock-export-to-csv').props.onExportHandler();
    });

    await ReactTestRenderer.act(async () => {});

    const exportProps = renderer.root.findByType('mock-export-to-csv').props;

    expect(PermissionsAndroid.check).toHaveBeenCalledWith(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    expect(RNFS.writeFile).toHaveBeenCalledWith(
      expect.stringMatching(/\/mock\/export-directory\/DailyEntry-\d{6}\.xlsx$/),
      'workbook-binary',
      'ascii',
    );
    expect(exportProps.alertHeading).toBe('Success!');
    expect(exportProps.alertText).toBe(EXPORT_SUCCESS_MESSAGE);
    expect(exportProps.permissionModal).toBe(true);
  });
});
