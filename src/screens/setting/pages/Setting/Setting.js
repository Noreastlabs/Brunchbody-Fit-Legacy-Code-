/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import ReactNativeAN from 'react-native-alarm-notification';
import { useFocusEffect } from '@react-navigation/core';
import moment from 'moment';
import { Setting } from '../../components';
import { logout } from '../../../../redux/actions';

const initialState = {
  clockToggle: true,
  checkWeightToggle: false,
  completeJournalToggle: false,
  complateCalInOutToggle: false,
  shareMyDataToggle: true,
  isTimePickerModal: false,
};

const listData = [
  {
    id: 1,
    title: 'My Profile',
    options: [{ id: 1, name: 'Manage Profile', type: '', screen: 'MyProfile' }],
  },
  {
    id: 2,
    title: 'Clock',
    options: [
      {
        id: 1,
        name: '24 HOUR',
        type: 'toggle',
        toggleName: 'clockToggle',
        value: initialState.clockToggle,
        screen: '',
      },
    ],
    screen: '',
  },
  {
    id: 3,
    title: 'Alerts',
    options: [
      {
        id: 1,
        name: 'Check Weight',
        type: 'toggle',
        toggleName: 'checkWeightToggle',
        value: initialState.checkWeightToggle,
        screen: '',
        alarmTime: moment(new Date()).format('hh:mm A'),
      },
      {
        id: 2,
        name: 'Complete Journal',
        type: 'toggle',
        toggleName: 'completeJournalToggle',
        value: initialState.completeJournalToggle,
        screen: '',
        alarmTime: moment(new Date()).format('hh:mm A'),
      },
      {
        id: 3,
        name: 'Complete Cal In/Out',
        type: 'toggle',
        toggleName: 'complateCalInOutToggle',
        value: initialState.complateCalInOutToggle,
        screen: '',
        alarmTime: moment(new Date()).format('hh:mm A'),
      },
    ],
    screen: '',
  },
  // {
  //   id: 4,
  //   title: 'My Data',
  //   options: [
  //     {
  //       id: 1,
  //       name: 'SHARE MY DATA',
  //       type: 'toggle',
  //       toggleName: 'shareMyDataToggle',
  //       value: initialState.shareMyDataToggle,
  //       screen: '',
  //     },
  //   ],
  //   screen: '',
  // },
  {
    id: 5,
    title: 'Export to CSV',
    options: [
      {
        id: 1,
        name: 'Export Journal to Files',
        value: false,
        screen: 'ExportToCSV',
      },
    ],
    screen: '',
  },
  {
    id: 6,
    title: 'About',
    options: [
      { id: 1, name: 'Version', type: '', screen: '' },
      {
        id: 2,
        name: 'Terms of use',
        type: '',
        link: 'https://brunchbodyfit.com/terms-conditions/',
      },
      {
        id: 3,
        name: 'Privacy policy',
        type: '',
        link: 'https://brunchbodyfit.com/privacy-policy/',
      },
      { id: 4, name: 'Tutorial', type: '', screen: 'Tutorials' },
      { id: 5, name: 'Abbrevations', type: '', screen: 'Abbrevations' },
      { id: 6, name: 'Rate us', type: '', screen: '' },
      {
        id: 7,
        name: 'Contact Us',
        type: '',
        link: 'https://brunchbodyfit.com/contact-us/',
      },
    ],
    screen: '',
  },
  {
    id: 7,
    title: 'Logout',
    options: [{ id: 1, name: 'Logout', type: '', screen: '' }],
    screen: '',
  },
];

let currentHours = '';
let currentMinutes = '';

export default function SettingPage(props) {
  const { navigation, logoutUser } = props;
  const [state, setState] = useState(initialState);
  const [hours, setHours] = useState(moment().format('h'));
  const [minutes, setMinutes] = useState(moment().format('m'));
  const [timeFormat, setTimeFormat] = useState(moment().format('A'));
  const [listing] = useState(listData);
  const [selectedIndex, setIndex] = useState();
  const [isPermissionModal, setIsPermissionModal] = useState(false);
  const [isWarningModal, setIsWarningModal] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [alarmHeading, setAlarmHeading] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      currentHours = moment().format('h');
      currentMinutes = moment().format('mm');
    }, []),
  );

  const onChangeHandler = data => {
    const { name, value } = data;
    setState({
      ...state,
      [name]: value,
    });
  };

  const onSetListing = time => {
    const list = Array.from(listing[2].options);
    list[selectedIndex].alarmTime = moment(time).format('hh:mm A');
  };

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setIsWarningModal(true);
  };

  const onDoneWarningModal = () => {
    setIsWarningModal(false);
    setTimeout(() => {
      setAlertText('');
      setAlertHeading('');
    }, 500);
  };

  const onLogoutPermission = () => {
    setAlertHeading('Logout');
    setAlertText('Are you sure you want to logout?');
    setIsPermissionModal(true);
  };

  const onLogoutHandler = async () => {
    const response = await logoutUser();
    if (response) {
      navigation.replace('SignIn');
      setIsPermissionModal(false);
    } else {
      showMessage('Error!', 'Something went wrong!');
    }
  };

  const onAddAlarmHandler = async () => {
    const currentDate = new Date();
    let hrs = hours;

    if (hrs !== '12' && timeFormat === 'PM') {
      hrs = (parseInt(hrs, 10) + 12) % 24;
    }
    if (hrs === '12' && timeFormat === 'AM') {
      hrs = (parseInt(hrs, 10) + 12) % 24;
    }

    currentDate.setHours(hrs);
    currentDate.setMinutes(minutes);
    onSetListing(currentDate);

    onChangeHandler({
      name: 'isTimePickerModal',
      value: false,
    });

    showMessage('Info', 'Alarm notifications are disabled in this build.');
  };

  return (
    <Setting
      state={state}
      listing={listing}
      setState={setState}
      navigation={navigation}
      listData={listData}
      onChangeHandler={onChangeHandler}
      onLogoutHandler={onLogoutHandler}
      onAddAlarmHandler={onAddAlarmHandler}
      minutes={minutes}
      hours={hours}
      timeFormat={timeFormat}
      setHours={setHours}
      setMinutes={setMinutes}
      setTimeFormat={setTimeFormat}
      setIndex={setIndex}
      currentHours={currentHours}
      currentMinutes={currentMinutes}
      isPermissionModal={isPermissionModal}
      setIsPermissionModal={setIsPermissionModal}
      alertHeading={alertHeading}
      alertText={alertText}
      onLogoutPermission={onLogoutPermission}
      setAlarmHeading={setAlarmHeading}
      isWarningModal={isWarningModal}
      setIsWarningModal={setIsWarningModal}
      onDoneWarningModal={onDoneWarningModal}
    />
  );
}

SettingPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logout()),
});

export const SettingWrapper = connect(null, mapDispatchToProps)(SettingPage);
