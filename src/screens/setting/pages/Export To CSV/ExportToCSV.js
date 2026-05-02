import React, { useState } from 'react';
import { connect } from 'react-redux';
import { PermissionsAndroid } from 'react-native';
import * as ScopedStorage from 'react-native-scoped-storage';
import XLSX from 'xlsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import RNFS from 'react-native-fs';
import { ExportToCSV } from '../../components';
import {
  getBodyWeightKilograms,
  isBodyUnitPreference,
  kilogramsToPounds,
} from '../../../../utils/bodyMeasurementUnits';

const STANDARD_UNIT_PREFERENCE = 'standard';
const METRIC_UNIT_PREFERENCE = 'metric';
const LEGACY_WEIGHT_UNIT = 'lb';
const CANONICAL_WEIGHT_UNIT = 'kg';

const resolveBodyUnitPreference = value =>
  isBodyUnitPreference(value) ? value : STANDARD_UNIT_PREFERENCE;

const hasExportableSourceValue = value =>
  value !== null && value !== undefined && `${value}`.trim() !== '';

const isNonFiniteExportValue = value => {
  if (typeof value === 'number') {
    return !Number.isFinite(value);
  }

  if (typeof value !== 'string') {
    return false;
  }

  const normalizedValue = value.trim().toLowerCase();

  return (
    normalizedValue === 'nan' ||
    normalizedValue === 'infinity' ||
    normalizedValue === '-infinity'
  );
};

const getSourceWeightValue = value =>
  hasExportableSourceValue(value) && !isNonFiniteExportValue(value)
    ? value
    : '';

const formatKilogramsForExport = kilograms => kilograms.toFixed(1);

const formatPoundsForExport = pounds => pounds.toFixed(1);

const getWeightUnitExportFields = (entryFields, unitPreference) => {
  const weight = entryFields?.weight;
  const sourceValue = getSourceWeightValue(weight);
  const sourceUnit = sourceValue === '' ? '' : LEGACY_WEIGHT_UNIT;
  const storedKilograms = getBodyWeightKilograms({
    weightKilograms: entryFields?.weightKilograms,
  });
  const kilograms =
    storedKilograms === null
      ? getBodyWeightKilograms({ weight })
      : storedKilograms;

  if (kilograms === null) {
    return {
      weight_source_value: sourceValue,
      weight_source_unit: sourceUnit,
      weight_display_value: '',
      weight_display_unit: '',
      weight_canonical_value: '',
      weight_canonical_unit: '',
    };
  }

  const kilogramValue = formatKilogramsForExport(kilograms);
  const storedKilogramPounds =
    storedKilograms === null ? null : kilogramsToPounds(storedKilograms);
  const standardDisplayValue =
    storedKilograms === null
      ? weight
      : storedKilogramPounds === null
        ? ''
        : formatPoundsForExport(storedKilogramPounds);
  const isMetricPreference = unitPreference === METRIC_UNIT_PREFERENCE;

  return {
    weight_source_value: sourceValue,
    weight_source_unit: sourceUnit,
    weight_display_value: isMetricPreference
      ? kilogramValue
      : standardDisplayValue,
    weight_display_unit: isMetricPreference
      ? CANONICAL_WEIGHT_UNIT
      : standardDisplayValue === ''
        ? ''
        : LEGACY_WEIGHT_UNIT,
    weight_canonical_value: kilogramValue,
    weight_canonical_unit: CANONICAL_WEIGHT_UNIT,
  };
};

const listData = [
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
      {
        id: 2,
        name: 'WEIGHT LOG',
        value: 'WeightLog',
        type: 'toggle',
        screen: '',
      },
      {
        id: 3,
        name: 'CALORIES IN / OUT',
        value: 'CaloriesEntry',
        type: 'toggle',
        screen: '',
      },
      {
        id: 4,
        name: 'SUPPLEMENT LOG',
        value: 'SupplementLog',
        type: 'toggle',
        screen: '',
      },
      {
        id: 5,
        name: 'WEEKLY REVIEW',
        value: 'WeeklyEntry',
        type: 'toggle',
        screen: '',
      },
      {
        id: 6,
        name: 'QUARTERLY REVIEW',
        value: 'QuarterlyEntry',
        type: 'toggle',
        screen: '',
      },
    ],
  },
];

export default function ExportToCSVPage(props) {
  const { navigation, journalEntriesList, user } = props;
  const [entryType, setEntryType] = useState('');
  const [entryData, setEntryData] = useState(null);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [permissionModal, setPermissionModal] = useState(false);
  const [loader, setLoader] = useState(false);

  const showMessage = (heading, text) => {
    setAlertHeading(heading);
    setAlertText(text);
    setPermissionModal(true);
  };

  const toggleSwitch = name => {
    if (name === entryType) {
      setEntryType('');
      setEntryData([]);
    } else {
      const filteredData = [];
      const bodyUnitPreference = resolveBodyUnitPreference(
        user?.bodyUnitPreference,
      );

      [...journalEntriesList]
        .sort((a, b) => b.createdOn - a.createdOn)
        .forEach(item => {
          // Object.entries(item[name]).map(([key, value]) =>
          //   console.log('item[name] property: ', typeof value),
          // );

          if (item[name]) {
            const entryFields = { ...item[name] };
            delete entryFields.isDeleted;
            const exportRow = {
              Dated: moment(item.createdOn).format('M/D/YYYY'),
              ...entryFields,
            };

            filteredData.push(
              name === 'WeightLog'
                ? {
                    ...exportRow,
                    ...getWeightUnitExportFields(
                      entryFields,
                      bodyUnitPreference,
                    ),
                  }
                : exportRow,
            );
          }
        });

      setEntryType(name);
      setEntryData(filteredData);
    }
  };

  const exportDataToExcel = async () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(entryData);
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

    const dir = await ScopedStorage.openDocumentTree(true);
    // console.log('dir: ', dir);

    if (dir.path) {
      const filePath =
        dir.path + `/${entryType + '-' + moment().format('hhmmss')}.xlsx`;

      RNFS.writeFile(filePath, wbout, 'ascii')
        .then(() => {
          showMessage(
            'Success!',
            'Journal data was exported as an Excel workbook (.xlsx).\n\nExported files are user-managed copies after export.',
          );
        })
        .catch(e => {
          console.log('Error in file', e);
        });
    } else {
      await ScopedStorage.writeFile(
        dir.uri,
        `${entryType + '-' + moment().format('hhmmss')}`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        wbout,
        '',
        false,
      )
        .then(() => {
          showMessage(
            'Success!',
            'Journal data was exported as an Excel workbook (.xlsx).\n\nExported files are user-managed copies after export.',
          );
        })
        .catch(e => {
          console.log('Error in file', e);
        });
    }
  };

  const handleClick = async () => {
    try {
      const isPermitedExternalStorage = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (!isPermitedExternalStorage) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage permission needed',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          exportDataToExcel();
          console.log('Permission granted');
        } else {
          console.log('Permission denied');
        }
      } else {
        exportDataToExcel();
      }
    } catch (e) {
      console.log('Error while checking permission', e);
    }
  };

  const onExportHandler = async () => {
    if (!entryData) {
      showMessage('Error!', 'Please select any one of the entries.');
    } else if (entryData.length === 0) {
      showMessage(
        'Error!',
        'There is no data found related to the selected entry.',
      );
    } else {
      setLoader(true);
      await handleClick();
      setLoader(false);
    }
  };

  return (
    <ExportToCSV
      loader={loader}
      entryType={entryType}
      toggleSwitch={toggleSwitch}
      navigation={navigation}
      listData={listData}
      onExportHandler={onExportHandler}
      alertHeading={alertHeading}
      alertText={alertText}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
    />
  );
}

ExportToCSVPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  journalEntriesList: PropTypes.arrayOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any),
};

ExportToCSVPage.defaultProps = {
  user: null,
};

const mapStateToProps = state => ({
  journalEntriesList: state.journal?.allJournalEntriesList,
  user: state.auth?.user,
});

export const ExportToCSVWrapper = connect(
  mapStateToProps,
)(ExportToCSVPage);
