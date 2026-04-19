import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import { AUTH_TAB_ROUTES, ROOT_ROUTES } from '../../../../navigation/routeNames';
import {
  clearCompletedOnboardingDraft,
  getOnboardingDraftValue,
  setOnboardingDraftValue,
} from '../../../../redux/actions/onboardingStorage';
import {profile} from '../../../../redux/actions/auth';
import {Name, Gender, Welcome, Weight} from '../../components';
import {DateOfBirthWrapper} from './DateOfBirth';
import {HeightWrapper} from './Height';

export const CompleteProfilePage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Name');
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [permissionModal, setPermissionModal] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onDonePermissionModal = async () => {
    setPermissionModal(false);
    setTimeout(() => {
      setAlertText('');
      setAlertHeading('');
    }, 500);
  };

  const onSetName = val => {
    setName(val);
    setOnboardingDraftValue('name', val);
  };

  const onSetWeight = val => {
    setWeight(val);
    setOnboardingDraftValue('weight', val);
  };

  const giveCurrentScreen = async screen => {
    const dob = await getOnboardingDraftValue('dob');
    const height = await getOnboardingDraftValue('height');
    const gender = await getOnboardingDraftValue('gender');

    if (screen === ROOT_ROUTES.HOME) {
      navigation.navigate(ROOT_ROUTES.HOME, {
        screen: AUTH_TAB_ROUTES.DASHBOARD,
      });
    } else if (screen === 'Name') {
      setCurrentScreen(screen);
    } else if (screen === 'DateOfBirth') {
      setCurrentScreen(screen);
    } else if (screen === 'Height' && dob) {
      if (new Date().getFullYear() - dob.split('/')[2] < 18)
        showMessage('Error!', 'Invalid date of birth!');
      else setCurrentScreen(screen);
    } else if (screen === 'Weight' && height) {
      setCurrentScreen(screen);
    } else if (screen === 'Gender' && weight) {
      if (Number.isNaN(parseInt(weight, 10)))
        showMessage('Error!', 'Only numbers are allowed!');
      else setCurrentScreen(screen);
    } else if (screen === 'Welcome') {
      setLoader(true);

      const profileData = {
        name: name.trim(),
        dob,
        height,
        weight,
        gender: gender || 'male',
        targetCalories: [
          {
            id: 1,
            name: 'fat',
            value: `${Math.floor((2000 * (60 / 100)) / 9)}`,
          },
          {
            id: 2,
            name: 'prt',
            value: `${Math.floor((2000 * (30 / 100)) / 4)}`,
          },
          {
            id: 3,
            name: 'cho',
            value: `${Math.floor((2000 * (10 / 100)) / 4)}`,
          },
          {id: 4, name: 'cal', value: '2000'},
        ],
      };

      await dispatch(profile(profileData));
      setCurrentScreen(screen);
      setName('');
      setWeight('');
      await clearCompletedOnboardingDraft();
      setLoader(false);
    } else {
      showMessage('Error!', 'This field is required!');
    }
  };

  if (currentScreen === 'Name') {
    return (
      <Name
        text={name}
        onChangeText={onSetName}
        currentScreen={giveCurrentScreen}
        alertText={alertText}
        alertHeading={alertHeading}
        permissionModal={permissionModal}
        setPermissionModal={setPermissionModal}
        onDonePermissionModal={onDonePermissionModal}
      />
    );
  }
  if (currentScreen === 'DateOfBirth') {
    return (
      <DateOfBirthWrapper
        currentScreen={giveCurrentScreen}
        alertText={alertText}
        alertHeading={alertHeading}
        permissionModal={permissionModal}
        setPermissionModal={setPermissionModal}
        onDonePermissionModal={onDonePermissionModal}
      />
    );
  }
  if (currentScreen === 'Height') {
    return (
      <HeightWrapper
        currentScreen={giveCurrentScreen}
        alertText={alertText}
        alertHeading={alertHeading}
        permissionModal={permissionModal}
        setPermissionModal={setPermissionModal}
        onDonePermissionModal={onDonePermissionModal}
      />
    );
  }
  if (currentScreen === 'Weight') {
    return (
      <Weight
        text={weight}
        onChangeText={onSetWeight}
        currentScreen={giveCurrentScreen}
        alertText={alertText}
        alertHeading={alertHeading}
        permissionModal={permissionModal}
        setPermissionModal={setPermissionModal}
        onDonePermissionModal={onDonePermissionModal}
      />
    );
  }
  if (currentScreen === 'Gender') {
    return <Gender loader={loader} currentScreen={giveCurrentScreen} />;
  }
  if (currentScreen === 'Welcome') {
    return (
      <Welcome navigation={navigation} currentScreen={giveCurrentScreen} />
    );
  }
};

export const CompleteProfileWrapper = CompleteProfilePage;
