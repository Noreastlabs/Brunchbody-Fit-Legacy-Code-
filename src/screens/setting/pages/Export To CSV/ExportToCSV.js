import React, { useState } from 'react';
import { connect } from 'react-redux';
import { PermissionsAndroid } from 'react-native';
import * as ScopedStorage from 'react-native-scoped-storage';
import XLSX from 'xlsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import RNFS from 'react-native-fs';
import { ExportToCSV } from '../../components';
import { login } from '../../../../redux/actions';

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
  const { navigation, journalEntriesList, loginUser, user } = props;
  const [entryType, setEntryType] = useState('');
  const [entryData, setEntryData] = useState(null);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [permissionModal, setPermissionModal] = useState(false);
  const [password, setPassword] = useState('');
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
      [...journalEntriesList]
        .sort((a, b) => b.createdOn - a.createdOn)
        .map(item => {
          // Object.entries(item[name]).map(([key, value]) =>
          //   console.log('item[name] property: ', typeof value),
          // );

          if (item[name]) {
            delete item[name].isDeleted;
            filteredData.push({
              Dated: moment(item.createdOn).format('M/D/YYYY'),
              ...item[name],
            });
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
          showMessage('Success!', 'File downloaded successfully.');
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
          showMessage('Success!', 'File downloaded successfully.');
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
    if (password === '') {
      showMessage('Error!', 'Please enter your password.');
    } else if (!entryData) {
      showMessage('Error!', 'Please select any one of the entries.');
    } else if (entryData.length === 0) {
      showMessage(
        'Error!',
        'There is no data found related to the selected entry.',
      );
    } else {
      setLoader(true);

      const response = await loginUser({
        email: user.email,
        password,
      });

      if (response) {
        setPassword('');
        setLoader(false);
        handleClick();
      } else {
        setLoader(false);
        showMessage('Error!', `Password is incorrect.`);
      }
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
      password={password}
      setPassword={setPassword}
    />
  );
}

ExportToCSVPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  journalEntriesList: PropTypes.arrayOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  loginUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth?.user,
  journalEntriesList: state.journal?.allJournalEntriesList,
});

const mapDispatchToProps = dispatch => ({
  loginUser: data => dispatch(login(data)),
});

export const ExportToCSVWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportToCSVPage);
