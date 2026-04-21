import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {AUTH_TAB_ROUTES, ROOT_ROUTES} from '../../../../navigation/routeNames';
import {
  clearCompletedOnboardingDraft,
  getOnboardingDraftValue,
  setOnboardingDraftValue,
} from '../../../../redux/actions/onboardingStorage';
import {profile} from '../../../../redux/actions/auth';
import {Name, Gender, Welcome, Weight} from '../../components';
import {DateOfBirthWrapper} from './DateOfBirth';
import {HeightWrapper} from './Height';
import {strings} from '../../../../resources';

const {
  Name: NAME_SCREEN,
  DOB: DOB_SCREEN,
  Gender: GENDER_SCREEN,
  Height: HEIGHT_SCREEN,
  Welcome: WELCOME_SCREEN,
  Weight: WEIGHT_SCREEN,
} = strings.completeProfile.screen;

const DEFAULT_DOB = {
  date: new Date().getDate(),
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
};

const DEFAULT_HEIGHT = {
  feet: 1,
  inches: 0,
};

const parseStoredDob = value => {
  if (typeof value !== 'string') {
    return null;
  }

  const [storedDate, storedMonth, storedYear] = value.split('/');
  const date = parseInt(storedDate, 10);
  const month = parseInt(storedMonth, 10);
  const year = parseInt(storedYear, 10);

  if (
    !Number.isFinite(date) ||
    !Number.isFinite(month) ||
    !Number.isFinite(year)
  ) {
    return null;
  }

  return {date, month, year};
};

const parseStoredHeight = value => {
  if (typeof value !== 'string') {
    return null;
  }

  const [storedFeet, storedInches] = value.split('.');
  const feet = parseInt(storedFeet, 10);
  const inches = parseInt(storedInches, 10);

  if (!Number.isFinite(feet) || !Number.isFinite(inches)) {
    return null;
  }

  return {feet, inches};
};

const getStoredDobValue = ({date, month, year}) => `${date}/${month}/${year}`;

const getStoredHeightValue = ({feet, inches}) => `${feet}.${inches}`;

const isWholeNumber = value => /^\d+$/.test(value);

const isAdultDob = dob => new Date().getFullYear() - dob.year >= 18;

const getDefaultTargetCalories = () => [
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
];

export const CompleteProfilePage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(NAME_SCREEN);
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(DEFAULT_DOB);
  const [isDateConfirmed, setIsDateConfirmed] = useState(false);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [isHeightConfirmed, setIsHeightConfirmed] = useState(false);
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('male');
  const [stepErrors, setStepErrors] = useState({});

  useEffect(() => {
    let isMounted = true;

    const hydrateDraft = async () => {
      const [draftName, draftDob, draftHeight, draftWeight, draftGender] =
        await Promise.all([
          getOnboardingDraftValue('name'),
          getOnboardingDraftValue('dob'),
          getOnboardingDraftValue('height'),
          getOnboardingDraftValue('weight'),
          getOnboardingDraftValue('gender'),
        ]);

      if (!isMounted) {
        return;
      }

      setName(draftName || '');
      setWeight(draftWeight || '');
      setGender(draftGender || 'male');

      const parsedDob = parseStoredDob(draftDob);
      if (parsedDob) {
        setDateOfBirth(parsedDob);
        setIsDateConfirmed(true);
      }

      const parsedHeight = parseStoredHeight(draftHeight);
      if (parsedHeight) {
        setHeight(parsedHeight);
        setIsHeightConfirmed(true);
      }
    };

    hydrateDraft();

    return () => {
      isMounted = false;
    };
  }, []);

  const setStepError = (screen, message) => {
    setStepErrors(prevState => ({
      ...prevState,
      [screen]: message,
    }));
  };

  const clearStepError = screen => {
    setStepError(screen, '');
  };

  const navigateHome = () => {
    navigation.navigate(ROOT_ROUTES.HOME, {
      screen: AUTH_TAB_ROUTES.DASHBOARD,
    });
  };

  const onSetName = value => {
    setName(value);
    setOnboardingDraftValue('name', value);
  };

  const onConfirmDate = value => {
    setDateOfBirth(value);
    setIsDateConfirmed(true);
    clearStepError(DOB_SCREEN);
    setOnboardingDraftValue('dob', getStoredDobValue(value));
  };

  const onConfirmHeight = value => {
    setHeight(value);
    setIsHeightConfirmed(true);
    clearStepError(HEIGHT_SCREEN);
    setOnboardingDraftValue('height', getStoredHeightValue(value));
  };

  const onSetWeight = value => {
    setWeight(value);
    clearStepError(WEIGHT_SCREEN);
    setOnboardingDraftValue('weight', value);
  };

  const onSetGender = value => {
    setGender(value);
    clearStepError(GENDER_SCREEN);
    setOnboardingDraftValue('gender', value);
  };

  const onSubmitProfile = async () => {
    const trimmedWeight = weight.trim();

    if (loader) {
      return;
    }

    setLoader(true);
    clearStepError(GENDER_SCREEN);

    try {
      const result = await dispatch(
        profile({
          name: name.trim(),
          dob: getStoredDobValue(dateOfBirth),
          height: getStoredHeightValue(height),
          weight: trimmedWeight,
          gender: gender || 'male',
          targetCalories: getDefaultTargetCalories(),
        }),
      );

      if (result !== true) {
        throw new Error(
          typeof result === 'string'
            ? result
            : strings.completeProfile.errors.submit,
        );
      }

      await clearCompletedOnboardingDraft();
      setCurrentScreen(WELCOME_SCREEN);
      setName('');
      setWeight('');
    } catch (error) {
      setStepError(
        GENDER_SCREEN,
        error?.message || strings.completeProfile.errors.submit,
      );
    } finally {
      setLoader(false);
    }
  };

  const giveCurrentScreen = async screen => {
    if (loader) {
      return;
    }

    if (screen === ROOT_ROUTES.HOME) {
      navigateHome();
      return;
    }

    if (screen === NAME_SCREEN || screen === DOB_SCREEN) {
      setCurrentScreen(screen);
      return;
    }

    if (screen === HEIGHT_SCREEN) {
      if (!isDateConfirmed) {
        setStepError(DOB_SCREEN, strings.completeProfile.errors.dobRequired);
        setCurrentScreen(DOB_SCREEN);
        return;
      }

      if (!isAdultDob(dateOfBirth)) {
        setStepError(DOB_SCREEN, strings.completeProfile.errors.dobInvalid);
        setCurrentScreen(DOB_SCREEN);
        return;
      }

      clearStepError(DOB_SCREEN);
      setCurrentScreen(screen);
      return;
    }

    if (screen === WEIGHT_SCREEN) {
      if (!isHeightConfirmed) {
        setStepError(HEIGHT_SCREEN, strings.completeProfile.errors.heightRequired);
        setCurrentScreen(HEIGHT_SCREEN);
        return;
      }

      clearStepError(HEIGHT_SCREEN);
      setCurrentScreen(screen);
      return;
    }

    if (screen === GENDER_SCREEN) {
      const trimmedWeight = weight.trim();

      if (!trimmedWeight) {
        setStepError(
          WEIGHT_SCREEN,
          strings.completeProfile.errors.weightRequired,
        );
        setCurrentScreen(WEIGHT_SCREEN);
        return;
      }

      if (!isWholeNumber(trimmedWeight)) {
        setStepError(
          WEIGHT_SCREEN,
          strings.completeProfile.errors.weightInvalid,
        );
        setCurrentScreen(WEIGHT_SCREEN);
        return;
      }

      clearStepError(WEIGHT_SCREEN);
      setCurrentScreen(screen);
      return;
    }

    if (screen === WELCOME_SCREEN) {
      await onSubmitProfile();
    }
  };

  if (currentScreen === NAME_SCREEN) {
    return (
      <Name
        text={name}
        onChangeText={onSetName}
        currentScreen={giveCurrentScreen}
      />
    );
  }

  if (currentScreen === DOB_SCREEN) {
    return (
      <DateOfBirthWrapper
        currentScreen={giveCurrentScreen}
        selectedDate={dateOfBirth}
        isDateConfirmed={isDateConfirmed}
        onConfirmDate={onConfirmDate}
        errorText={stepErrors[DOB_SCREEN] || ''}
      />
    );
  }

  if (currentScreen === HEIGHT_SCREEN) {
    return (
      <HeightWrapper
        currentScreen={giveCurrentScreen}
        selectedHeight={height}
        isHeightConfirmed={isHeightConfirmed}
        onConfirmHeight={onConfirmHeight}
        errorText={stepErrors[HEIGHT_SCREEN] || ''}
      />
    );
  }

  if (currentScreen === WEIGHT_SCREEN) {
    return (
      <Weight
        text={weight}
        onChangeText={onSetWeight}
        currentScreen={giveCurrentScreen}
        errorText={stepErrors[WEIGHT_SCREEN] || ''}
      />
    );
  }

  if (currentScreen === GENDER_SCREEN) {
    return (
      <Gender
        loader={loader}
        currentScreen={giveCurrentScreen}
        value={gender}
        onChange={onSetGender}
        disabled={loader}
        errorText={stepErrors[GENDER_SCREEN] || ''}
      />
    );
  }

  if (currentScreen === WELCOME_SCREEN) {
    return (
      <Welcome navigation={navigation} currentScreen={giveCurrentScreen} />
    );
  }

  return null;
};

export const CompleteProfileWrapper = CompleteProfilePage;
