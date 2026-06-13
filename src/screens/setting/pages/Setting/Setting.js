/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import ReactNativeAN from 'react-native-alarm-notification';
import { useFocusEffect } from '@react-navigation/core';
import moment from 'moment';
import { Setting } from '../../components';
import { ROOT_ROUTES, SETTINGS_ROUTES } from '../../../../navigation/routeNames';
import {notificationUxCopy, settingsSectionHelp} from '../../../../resources';

const initialState = {
  clockToggle: true,
  checkWeightToggle: false,
  completeJournalToggle: false,
  complateCalInOutToggle: false,
  shareMyDataToggle: true,
  isTimePickerModal: false,
};


const ABOUT_LINKS = {
  termsOfUse: 'https://brunchbodyfit.com/terms-conditions/',
  privacyPolicy: 'https://brunchbodyfit.com/privacy-policy/',
  supportAndContact: 'https://brunchbodyfit.com/contact-us/',
};

const DEFAULT_SETTINGS_SECTION_HELP = Object.freeze({
  Profile:
    'Edit device-local profile details used for in-app display and calculations.',
  Clock: 'Choose how time appears in the app.',
  Alerts:
    'Reminder controls are local app preferences; notification behavior must stay truthful to the current build.',
  'Export data':
    'Create selected journal exports as user-managed files outside app-managed storage.',
  'Delete local data':
    'Clear app-managed local data on this device only; exported or external copies are not removed.',
  About:
    'Find privacy notes, tutorials, support links, release information, and app reference material.',
});

const DEFAULT_NOTIFICATION_UX_COPY = Object.freeze({
  disabledBuildInfo:
    'Reminder time saved locally. Alarm notifications are disabled in this build.',
});

const settingsHelpCopy = {
  ...DEFAULT_SETTINGS_SECTION_HELP,
  ...(settingsSectionHelp || {}),
};

const notificationCopy = {
  ...DEFAULT_NOTIFICATION_UX_COPY,
  ...(notificationUxCopy || {}),
};

const listData = [
  {
    id: 1,
    title: 'Profile',
    helperText: settingsHelpCopy.Profile,
    options: [
      {
        id: 1,
        name: 'View and edit profile',
        type: '',
        screen: SETTINGS_ROUTES.MY_PROFILE,
      },
    ],
  },
  {
    id: 2,
    title: 'Clock',
    helperText: settingsHelpCopy.Clock,
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
    helperText: settingsHelpCopy.Alerts,
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
    id: 4,
    title: 'Export data',
    helperText: settingsHelpCopy['Export data'],
    options: [
      {
        id: 1,
        name: 'Export journal data',
        value: false,
        screen: SETTINGS_ROUTES.EXPORT_TO_CSV,
      },
    ],
    screen: '',
  },
  {
    id: 5,
    title: 'Delete local data',
    helperText: settingsHelpCopy['Delete local data'],
    options: [
      {
        id: 1,
        name: 'Delete local data',
        type: '',
        screen: SETTINGS_ROUTES.DELETE_ACCOUNT,
      },
    ],
    screen: '',
  },
  {
    id: 6,
    title: 'About',
    helperText: settingsHelpCopy.About,
    options: [
      { id: 1, name: 'Version', type: '', screen: '' },
      {
        id: 2,
        name: 'Terms of Use',
        type: '',
        link: ABOUT_LINKS.termsOfUse,
      },
      {
        id: 3,
        name: 'Privacy & Data',
        type: '',
        screen: SETTINGS_ROUTES.PRIVACY_AND_DATA,
      },
      {
        id: 4,
        name: 'Privacy Policy',
        type: '',
        link: ABOUT_LINKS.privacyPolicy,
      },
      { id: 5, name: 'Tutorial', type: '', screen: ROOT_ROUTES.TUTORIALS },
      {
        id: 6,
        name: 'Abbreviations',
        type: '',
        screen: SETTINGS_ROUTES.ABBREVIATIONS,
      },
      { id: 7, name: 'Rate us', type: '', screen: '' },
      {
        id: 8,
        name: 'Help & Support',
        type: '',
        screen: SETTINGS_ROUTES.HELP_AND_SUPPORT,
      },
      {
        id: 9,
        name: 'Support & Contact',
        type: '',
        link: ABOUT_LINKS.supportAndContact,
      },
    ],
    screen: '',
  },
];

let currentHours = '';
let currentMinutes = '';

export default function SettingPage(props) {
  const { navigation } = props;
  const [state, setState] = useState(initialState);
  const [hours, setHours] = useState(moment().format('h'));
  const [minutes, setMinutes] = useState(moment().format('m'));
  const [timeFormat, setTimeFormat] = useState(moment().format('A'));
  const [listing] = useState(listData);
  const [selectedIndex, setIndex] = useState();
  const [isWarningModal, setIsWarningModal] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');

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

    showMessage('Info', notificationCopy.disabledBuildInfo);
  };

  return (
    <Setting
      state={state}
      listing={listing}
      setState={setState}
      navigation={navigation}
      listData={listData}
      onChangeHandler={onChangeHandler}
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
      alertHeading={alertHeading}
      alertText={alertText}
      isWarningModal={isWarningModal}
      setIsWarningModal={setIsWarningModal}
      onDoneWarningModal={onDoneWarningModal}
    />
  );
}

SettingPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};
export const SettingWrapper = connect(null, null)(SettingPage);
