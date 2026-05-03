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
import {
  centimetersToFeetInches,
  kilogramsToPounds,
  parseHeightToCentimeters,
  parseMetricHeightToCentimeters,
  parseWeightToKilograms,
  resolveBodyUnitPreference,
} from '../../../../utils/bodyMeasurementUnits';

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

const STANDARD_UNIT_PREFERENCE = 'standard';
const METRIC_UNIT_PREFERENCE = 'metric';

const formatMetricDraftValue = value => {
  if (!Number.isFinite(value)) {
    return '';
  }

  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
};

const getStoredHeightValue = ({feet, inches}) => `${feet}.${inches}`;

const getLegacyHeightFromCentimeters = centimeters => {
  const height = centimetersToFeetInches(centimeters);

  return height ? getStoredHeightValue(height) : null;
};

const getLegacyWeightFromKilograms = kilograms => {
  const pounds = kilogramsToPounds(kilograms);

  return pounds === null ? null : `${Math.round(pounds)}`;
};

const buildProfileBodyMeasurementPayload = ({
  bodyUnitPreference,
  height,
  heightCentimeters,
  weight,
  weightKilograms,
}) => {
  const legacyHeight =
    bodyUnitPreference === METRIC_UNIT_PREFERENCE
      ? getLegacyHeightFromCentimeters(heightCentimeters)
      : getStoredHeightValue(height);
  const legacyWeight =
    bodyUnitPreference === METRIC_UNIT_PREFERENCE
      ? getLegacyWeightFromKilograms(weightKilograms)
      : weight;

  return {
    bodyUnitPreference,
    height: legacyHeight,
    heightCentimeters,
    weight: legacyWeight,
    weightKilograms,
  };
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
  const centimeters = parseHeightToCentimeters(
    value,
    STANDARD_UNIT_PREFERENCE,
  );

  return centimeters === null ? null : centimetersToFeetInches(centimeters);
};

const getStoredDobValue = ({date, month, year}) => `${date}/${month}/${year}`;

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
  const [metricHeight, setMetricHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyUnitPreference, setBodyUnitPreference] = useState(
    STANDARD_UNIT_PREFERENCE,
  );
  const [gender, setGender] = useState('male');
  const [stepErrors, setStepErrors] = useState({});

  useEffect(() => {
    let isMounted = true;

    const hydrateDraft = async () => {
      const [
        draftName,
        draftDob,
        draftHeight,
        draftWeight,
        draftGender,
        draftBodyUnitPreference,
      ] = await Promise.all([
        getOnboardingDraftValue('name'),
        getOnboardingDraftValue('dob'),
        getOnboardingDraftValue('height'),
        getOnboardingDraftValue('weight'),
        getOnboardingDraftValue('gender'),
        getOnboardingDraftValue('bodyUnitPreference'),
      ]);

      if (!isMounted) {
        return;
      }

      const nextBodyUnitPreference = resolveBodyUnitPreference(
        draftBodyUnitPreference,
      );

      setName(draftName || '');
      setWeight(draftWeight || '');
      setGender(draftGender || 'male');
      setBodyUnitPreference(nextBodyUnitPreference);

      const parsedDob = parseStoredDob(draftDob);
      if (parsedDob) {
        setDateOfBirth(parsedDob);
        setIsDateConfirmed(true);
      }

      if (nextBodyUnitPreference === METRIC_UNIT_PREFERENCE) {
        const parsedMetricHeight = parseMetricHeightToCentimeters(draftHeight);

        if (parsedMetricHeight !== null) {
          setMetricHeight(`${parsedMetricHeight}`);
        }
      } else {
        const parsedHeight = parseStoredHeight(draftHeight);

        if (parsedHeight) {
          setHeight(parsedHeight);
          setIsHeightConfirmed(true);
        }
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
    const heightCentimeters = parseHeightToCentimeters(
      value,
      STANDARD_UNIT_PREFERENCE,
    );

    if (heightCentimeters === null) {
      setIsHeightConfirmed(false);
      setStepError(HEIGHT_SCREEN, strings.completeProfile.errors.heightInvalid);
      return;
    }

    setHeight(value);
    setIsHeightConfirmed(true);
    clearStepError(HEIGHT_SCREEN);
    setOnboardingDraftValue('height', getStoredHeightValue(value));
  };

  const onSetMetricHeight = value => {
    setMetricHeight(value);
    clearStepError(HEIGHT_SCREEN);

    const trimmedValue = value.trim();

    if (parseMetricHeightToCentimeters(trimmedValue) !== null) {
      setOnboardingDraftValue('height', trimmedValue);
    }
  };

  const onSetWeight = value => {
    setWeight(value);
    clearStepError(WEIGHT_SCREEN);

    const trimmedValue = value.trim();
    const isValidDraftWeight =
      bodyUnitPreference === METRIC_UNIT_PREFERENCE
        ? parseWeightToKilograms(trimmedValue, METRIC_UNIT_PREFERENCE) !== null
        : isWholeNumber(trimmedValue) &&
          parseWeightToKilograms(trimmedValue, STANDARD_UNIT_PREFERENCE) !==
            null;

    if (isValidDraftWeight) {
      setOnboardingDraftValue('weight', trimmedValue);
    }
  };

  const onSetGender = value => {
    setGender(value);
    clearStepError(GENDER_SCREEN);
    setOnboardingDraftValue('gender', value);
  };

  const getCurrentHeightCentimeters = preference => {
    if (preference === METRIC_UNIT_PREFERENCE) {
      return parseMetricHeightToCentimeters(metricHeight);
    }

    return parseHeightToCentimeters(height, STANDARD_UNIT_PREFERENCE);
  };

  const onSetBodyUnitPreference = value => {
    const nextPreference = resolveBodyUnitPreference(value);
    const currentPreference = bodyUnitPreference;

    if (nextPreference === currentPreference) {
      return;
    }

    const currentHeightCentimeters =
      currentPreference === METRIC_UNIT_PREFERENCE
        ? parseMetricHeightToCentimeters(metricHeight)
        : isHeightConfirmed
          ? parseHeightToCentimeters(height, STANDARD_UNIT_PREFERENCE)
          : null;
    const currentWeightKilograms = weight.trim()
      ? parseWeightToKilograms(weight.trim(), currentPreference)
      : null;

    setBodyUnitPreference(nextPreference);
    clearStepError(HEIGHT_SCREEN);
    clearStepError(WEIGHT_SCREEN);
    setOnboardingDraftValue('bodyUnitPreference', nextPreference);

    if (currentHeightCentimeters !== null) {
      if (nextPreference === METRIC_UNIT_PREFERENCE) {
        const nextMetricHeight = formatMetricDraftValue(
          Math.round(currentHeightCentimeters),
        );
        setMetricHeight(nextMetricHeight);
        setOnboardingDraftValue('height', nextMetricHeight);
      } else {
        const nextHeight = centimetersToFeetInches(currentHeightCentimeters);

        if (nextHeight) {
          setHeight(nextHeight);
          setIsHeightConfirmed(true);
          setOnboardingDraftValue('height', getStoredHeightValue(nextHeight));
        }
      }
    }

    if (currentWeightKilograms !== null) {
      const nextWeight =
        nextPreference === METRIC_UNIT_PREFERENCE
          ? currentWeightKilograms.toFixed(1)
          : getLegacyWeightFromKilograms(currentWeightKilograms);

      if (nextWeight) {
        setWeight(nextWeight);
        setOnboardingDraftValue('weight', nextWeight);
      }
    }
  };

  const getCurrentBodyMeasurementPayload = ({
    heightCentimeters,
    trimmedWeight,
    weightKilograms,
  }) =>
    buildProfileBodyMeasurementPayload({
      bodyUnitPreference,
      heightCentimeters,
      height,
      weight: trimmedWeight,
      weightKilograms,
    });

  const getValidatedBodyMeasurementFields = () => {
    const heightCentimeters = getCurrentHeightCentimeters(bodyUnitPreference);
    const trimmedWeight = weight.trim();

    if (
      bodyUnitPreference === STANDARD_UNIT_PREFERENCE &&
      !isHeightConfirmed
    ) {
      setStepError(HEIGHT_SCREEN, strings.completeProfile.errors.heightRequired);
      setCurrentScreen(HEIGHT_SCREEN);
      return null;
    }

    if (heightCentimeters === null) {
      setStepError(
        HEIGHT_SCREEN,
        bodyUnitPreference === METRIC_UNIT_PREFERENCE && metricHeight.trim()
          ? strings.completeProfile.errors.heightInvalid
          : strings.completeProfile.errors.heightRequired,
      );
      setCurrentScreen(HEIGHT_SCREEN);
      return null;
    }

    if (!trimmedWeight) {
      setStepError(
        WEIGHT_SCREEN,
        bodyUnitPreference === METRIC_UNIT_PREFERENCE
          ? strings.completeProfile.errors.weightMetricRequired
          : strings.completeProfile.errors.weightRequired,
      );
      setCurrentScreen(WEIGHT_SCREEN);
      return null;
    }

    const weightKilograms = parseWeightToKilograms(
      trimmedWeight,
      bodyUnitPreference,
    );
    const isValidWeight =
      bodyUnitPreference === METRIC_UNIT_PREFERENCE
        ? weightKilograms !== null
        : isWholeNumber(trimmedWeight) && weightKilograms !== null;

    if (!isValidWeight) {
      setStepError(
        WEIGHT_SCREEN,
        bodyUnitPreference === METRIC_UNIT_PREFERENCE
          ? strings.completeProfile.errors.weightMetricInvalid
          : strings.completeProfile.errors.weightInvalid,
      );
      setCurrentScreen(WEIGHT_SCREEN);
      return null;
    }

    return {
      heightCentimeters,
      trimmedWeight,
      weightKilograms,
    };
  };

  const onSubmitProfile = async () => {
    if (loader) {
      return;
    }

    const bodyMeasurementFields = getValidatedBodyMeasurementFields();

    if (!bodyMeasurementFields) {
      return;
    }

    setLoader(true);
    clearStepError(GENDER_SCREEN);

    try {
      const result = await dispatch(
        profile({
          name: name.trim(),
          dob: getStoredDobValue(dateOfBirth),
          ...getCurrentBodyMeasurementPayload(bodyMeasurementFields),
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
      if (
        bodyUnitPreference === STANDARD_UNIT_PREFERENCE &&
        !isHeightConfirmed
      ) {
        setStepError(
          HEIGHT_SCREEN,
          strings.completeProfile.errors.heightRequired,
        );
        setCurrentScreen(HEIGHT_SCREEN);
        return;
      }

      if (
        bodyUnitPreference === STANDARD_UNIT_PREFERENCE &&
        parseHeightToCentimeters(height, STANDARD_UNIT_PREFERENCE) === null
      ) {
        setStepError(
          HEIGHT_SCREEN,
          strings.completeProfile.errors.heightInvalid,
        );
        setCurrentScreen(HEIGHT_SCREEN);
        return;
      }

      if (bodyUnitPreference === METRIC_UNIT_PREFERENCE) {
        const trimmedMetricHeight = metricHeight.trim();

        if (!trimmedMetricHeight) {
          setStepError(
            HEIGHT_SCREEN,
            strings.completeProfile.errors.heightRequired,
          );
          setCurrentScreen(HEIGHT_SCREEN);
          return;
        }

        if (parseMetricHeightToCentimeters(trimmedMetricHeight) === null) {
          setStepError(
            HEIGHT_SCREEN,
            strings.completeProfile.errors.heightInvalid,
          );
          setCurrentScreen(HEIGHT_SCREEN);
          return;
        }
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
          bodyUnitPreference === METRIC_UNIT_PREFERENCE
            ? strings.completeProfile.errors.weightMetricRequired
            : strings.completeProfile.errors.weightRequired,
        );
        setCurrentScreen(WEIGHT_SCREEN);
        return;
      }

      const isValidWeight =
        bodyUnitPreference === METRIC_UNIT_PREFERENCE
          ? parseWeightToKilograms(trimmedWeight, METRIC_UNIT_PREFERENCE) !==
            null
          : isWholeNumber(trimmedWeight) &&
            parseWeightToKilograms(
              trimmedWeight,
              STANDARD_UNIT_PREFERENCE,
            ) !== null;

      if (!isValidWeight) {
        setStepError(
          WEIGHT_SCREEN,
          bodyUnitPreference === METRIC_UNIT_PREFERENCE
            ? strings.completeProfile.errors.weightMetricInvalid
            : strings.completeProfile.errors.weightInvalid,
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
        bodyUnitPreference={bodyUnitPreference}
        onChangeBodyUnitPreference={onSetBodyUnitPreference}
        metricHeightText={metricHeight}
        onChangeMetricHeight={onSetMetricHeight}
        errorText={stepErrors[HEIGHT_SCREEN] || ''}
      />
    );
  }

  if (currentScreen === WEIGHT_SCREEN) {
    return (
      <Weight
        text={weight}
        onChangeText={onSetWeight}
        bodyUnitPreference={bodyUnitPreference}
        onChangeBodyUnitPreference={onSetBodyUnitPreference}
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
