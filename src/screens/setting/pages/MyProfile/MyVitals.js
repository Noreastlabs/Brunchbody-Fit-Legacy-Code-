/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useFocusEffect } from '@react-navigation/core';
import { MyVitals } from '../../components';
import { loggedIn, profile } from '../../../../redux/actions';
import { strings } from '../../../../resources';
import {
  centimetersToFeetInches,
  formatHeight as formatCanonicalHeight,
  getBodyHeightCentimeters,
  parseHeightToCentimeters,
  parseMetricHeightToCentimeters,
  resolveBodyUnitPreference,
} from '../../../../utils/bodyMeasurementUnits';

const DEFAULT_HEIGHT = {
  feet: 1,
  inches: 0,
};

const FORM_ERROR_TEXT = 'Check the highlighted profile fields before saving.';
const SUCCESS_MESSAGE = 'Profile updated successfully.';
const DEFAULT_SUBMIT_ERROR = strings.completeProfile.errors.submit;
const STANDARD_UNIT_PREFERENCE = 'standard';
const METRIC_UNIT_PREFERENCE = 'metric';

const formatMetricDraftValue = value => {
  if (!Number.isFinite(value)) {
    return '';
  }

  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
};

const getDefaultDob = () => {
  const currentDate = new Date();

  return {
    date: currentDate.getDate(),
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
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

  return { date, month, year };
};

const formatDob = dob =>
  dob ? `${dob.month}/${dob.date}/${dob.year}` : 'Not set';

const getInitialHeightCentimeters = user => getBodyHeightCentimeters(user);

const formatHeight = (height, unitPreference, metricHeightText) => {
  if (unitPreference === METRIC_UNIT_PREFERENCE) {
    const centimeters = parseMetricHeightToCentimeters(metricHeightText);
    const formattedHeight =
      centimeters === null
        ? null
        : formatCanonicalHeight(centimeters, METRIC_UNIT_PREFERENCE);

    return formattedHeight || 'Not set';
  }

  const centimeters = parseHeightToCentimeters(
    height,
    STANDARD_UNIT_PREFERENCE,
  );
  const formattedHeight =
    centimeters === null
      ? null
      : formatCanonicalHeight(centimeters, STANDARD_UNIT_PREFERENCE);

  return formattedHeight || 'Not set';
};

const getStoredDobValue = dob => `${dob.date}/${dob.month}/${dob.year}`;

const getStoredHeightValue = height => `${height.feet}.${height.inches}`;

const hasOwn = (value, key) =>
  Object.prototype.hasOwnProperty.call(value || {}, key);

const getSavedCanonicalHeightCentimeters = user => {
  if (!hasOwn(user, 'heightCentimeters')) {
    return null;
  }

  return parseMetricHeightToCentimeters(user.heightCentimeters);
};

const getSavedLegacyHeight = user => {
  if (
    !hasOwn(user, 'height') ||
    parseHeightToCentimeters(user.height, STANDARD_UNIT_PREFERENCE) === null
  ) {
    return null;
  }

  return user.height;
};

const getLegacyHeightValueFromCentimeters = centimeters => {
  const nextHeight = centimetersToFeetInches(centimeters);

  return nextHeight ? getStoredHeightValue(nextHeight) : null;
};

const buildMyVitalsProfileUpdatePayload = ({
  name,
  dob,
  height,
  heightCentimeters,
  bodyUnitPreference,
  gender,
}) => ({
  name,
  dob: getStoredDobValue(dob),
  height,
  heightCentimeters,
  bodyUnitPreference,
  gender,
});

const getInitialName = value => (typeof value === 'string' ? value : '');

const getInitialGender = value => (value === 'female' ? 'female' : 'male');

const isAdultDob = dob => new Date().getFullYear() - dob.year >= 18;

export default function MyVitalsPage(props) {
  const { navigation, user, updateUserProfile, getUserData } = props;
  const initialDob = parseStoredDob(user?.dob);
  const initialHeightCentimeters = getInitialHeightCentimeters(user);
  const initialHeight =
    initialHeightCentimeters === null
      ? null
      : centimetersToFeetInches(initialHeightCentimeters);
  const latestUserRef = useRef(user);
  const submitLockRef = useRef(false);
  const [loader, setLoader] = useState(false);
  const [draftName, setDraftName] = useState(getInitialName(user?.name));
  const [draftGender, setDraftGender] = useState(getInitialGender(user?.gender));
  const [draftDob, setDraftDob] = useState(initialDob);
  const [draftHeight, setDraftHeight] = useState(initialHeight);
  const [draftMetricHeightText, setDraftMetricHeightText] = useState(
    formatMetricDraftValue(initialHeightCentimeters),
  );
  const [bodyUnitPreference, setBodyUnitPreference] = useState(
    resolveBodyUnitPreference(user?.bodyUnitPreference),
  );
  const [datePickerModal, setDatePickerModal] = useState(false);
  const [heightPickerModal, setHeightPickerModal] = useState(false);
  const [tempDate, setTempDate] = useState(
    initialDob ? initialDob.date : getDefaultDob().date,
  );
  const [tempMonth, setTempMonth] = useState(
    initialDob ? initialDob.month : getDefaultDob().month,
  );
  const [tempYear, setTempYear] = useState(
    initialDob ? initialDob.year : getDefaultDob().year,
  );
  const [tempFeet, setTempFeet] = useState(
    initialHeight ? initialHeight.feet : DEFAULT_HEIGHT.feet,
  );
  const [tempInches, setTempInches] = useState(
    initialHeight ? initialHeight.inches : DEFAULT_HEIGHT.inches,
  );
  const [dobErrorText, setDobErrorText] = useState('');
  const [heightErrorText, setHeightErrorText] = useState('');
  const [formErrorText, setFormErrorText] = useState('');
  const [isPermissionModal, setIsPermissionModal] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [heightDraftEdited, setHeightDraftEdited] = useState(false);

  useEffect(() => {
    latestUserRef.current = user || {};
  }, [user]);

  const closePermissionModal = useCallback(() => {
    setIsPermissionModal(false);
    setAlertHeading('');
    setAlertText('');
  }, []);

  const hydrateFormSession = useCallback((sourceUser, options = {}) => {
    const { closeFeedback = true } = options;
    const nextDob = parseStoredDob(sourceUser?.dob);
    const nextHeightCentimeters = getInitialHeightCentimeters(sourceUser);
    const nextHeight =
      nextHeightCentimeters === null
        ? null
        : centimetersToFeetInches(nextHeightCentimeters);
    const fallbackDob = getDefaultDob();
    const nextBodyUnitPreference = resolveBodyUnitPreference(
      sourceUser?.bodyUnitPreference,
    );

    setDraftName(getInitialName(sourceUser?.name));
    setDraftGender(getInitialGender(sourceUser?.gender));
    setDraftDob(nextDob);
    setDraftHeight(nextHeight);
    setDraftMetricHeightText(formatMetricDraftValue(nextHeightCentimeters));
    setBodyUnitPreference(nextBodyUnitPreference);
    setTempDate(nextDob ? nextDob.date : fallbackDob.date);
    setTempMonth(nextDob ? nextDob.month : fallbackDob.month);
    setTempYear(nextDob ? nextDob.year : fallbackDob.year);
    setTempFeet(nextHeight ? nextHeight.feet : DEFAULT_HEIGHT.feet);
    setTempInches(nextHeight ? nextHeight.inches : DEFAULT_HEIGHT.inches);
    setDatePickerModal(false);
    setHeightPickerModal(false);
    setDobErrorText('');
    setHeightErrorText('');
    setFormErrorText('');
    setLoader(false);
    setHeightDraftEdited(false);
    submitLockRef.current = false;

    if (closeFeedback) {
      closePermissionModal();
    }
  }, [closePermissionModal]);

  useFocusEffect(
    React.useCallback(() => {
      hydrateFormSession(latestUserRef.current);
    }, [hydrateFormSession]),
  );

  const onChangeName = value => {
    setDraftName(value);
    setFormErrorText('');
  };

  const onSelectGender = value => {
    setDraftGender(value);
    setFormErrorText('');
  };

  const onOpenDatePicker = () => {
    const nextDob = draftDob || getDefaultDob();

    setTempDate(nextDob.date);
    setTempMonth(nextDob.month);
    setTempYear(nextDob.year);
    setDatePickerModal(true);
  };

  const onCancelDatePicker = () => {
    const nextDob = draftDob || getDefaultDob();

    setTempDate(nextDob.date);
    setTempMonth(nextDob.month);
    setTempYear(nextDob.year);
    setDatePickerModal(false);
  };

  const onConfirmDatePicker = () => {
    setDraftDob({
      date: tempDate,
      month: tempMonth,
      year: tempYear,
    });
    setDobErrorText('');
    setFormErrorText('');
    setDatePickerModal(false);
  };

  const onOpenHeightPicker = () => {
    const nextHeight = draftHeight || DEFAULT_HEIGHT;

    setTempFeet(nextHeight.feet);
    setTempInches(nextHeight.inches);
    setHeightPickerModal(true);
  };

  const onCancelHeightPicker = () => {
    const nextHeight = draftHeight || DEFAULT_HEIGHT;

    setTempFeet(nextHeight.feet);
    setTempInches(nextHeight.inches);
    setHeightPickerModal(false);
  };

  const onConfirmHeightPicker = () => {
    const nextHeight = {
      feet: tempFeet,
      inches: tempInches,
    };
    const nextHeightCentimeters = parseHeightToCentimeters(
      nextHeight,
      STANDARD_UNIT_PREFERENCE,
    );

    if (nextHeightCentimeters === null) {
      setHeightErrorText(strings.completeProfile.errors.heightInvalid);
      setFormErrorText('');
      setHeightPickerModal(false);
      return;
    }

    setDraftHeight(nextHeight);
    setDraftMetricHeightText(formatMetricDraftValue(nextHeightCentimeters));
    setHeightDraftEdited(true);
    setHeightErrorText('');
    setFormErrorText('');
    setHeightPickerModal(false);
  };

  const onChangeMetricHeightText = value => {
    setDraftMetricHeightText(value);
    setHeightDraftEdited(true);
    setHeightErrorText('');
    setFormErrorText('');
  };

  const onSelectBodyUnitPreference = value => {
    const nextBodyUnitPreference = resolveBodyUnitPreference(value);

    if (nextBodyUnitPreference === bodyUnitPreference) {
      return;
    }

    if (
      bodyUnitPreference === METRIC_UNIT_PREFERENCE &&
      draftMetricHeightText.trim() &&
      parseMetricHeightToCentimeters(draftMetricHeightText) === null
    ) {
      setHeightErrorText(strings.completeProfile.errors.heightInvalid);
      setFormErrorText('');
      return;
    }

    const currentHeightCentimeters =
      bodyUnitPreference === METRIC_UNIT_PREFERENCE
        ? parseMetricHeightToCentimeters(draftMetricHeightText)
        : draftHeight
          ? parseHeightToCentimeters(draftHeight, STANDARD_UNIT_PREFERENCE)
          : null;

    if (currentHeightCentimeters !== null) {
      if (nextBodyUnitPreference === METRIC_UNIT_PREFERENCE) {
        setDraftMetricHeightText(
          formatMetricDraftValue(Math.round(currentHeightCentimeters)),
        );
      } else {
        const nextHeight = centimetersToFeetInches(currentHeightCentimeters);

        if (nextHeight) {
          setDraftHeight(nextHeight);
          setTempFeet(nextHeight.feet);
          setTempInches(nextHeight.inches);
        }
      }
    }

    setBodyUnitPreference(nextBodyUnitPreference);
    setHeightPickerModal(false);
    setHeightErrorText('');
    setFormErrorText('');
  };

  const getDraftHeightCentimeters = () =>
    bodyUnitPreference === METRIC_UNIT_PREFERENCE
      ? parseMetricHeightToCentimeters(draftMetricHeightText)
      : draftHeight
        ? parseHeightToCentimeters(draftHeight, STANDARD_UNIT_PREFERENCE)
        : null;

  const getProfileHeightCentimetersForSave = draftHeightCentimeters => {
    if (heightDraftEdited) {
      return draftHeightCentimeters;
    }

    const savedCanonicalHeightCentimeters = getSavedCanonicalHeightCentimeters(
      latestUserRef.current,
    );

    return savedCanonicalHeightCentimeters === null
      ? draftHeightCentimeters
      : savedCanonicalHeightCentimeters;
  };

  const getProfileLegacyHeightForSave = heightCentimetersForSave => {
    if (heightDraftEdited) {
      return getLegacyHeightValueFromCentimeters(heightCentimetersForSave);
    }

    const savedLegacyHeight = getSavedLegacyHeight(latestUserRef.current);

    return savedLegacyHeight === null
      ? getLegacyHeightValueFromCentimeters(heightCentimetersForSave)
      : savedLegacyHeight;
  };

  const onUpdateHandler = async () => {
    if (submitLockRef.current || loader) {
      return;
    }

    setDobErrorText('');
    setHeightErrorText('');
    setFormErrorText('');

    let hasValidationError = false;

    if (!draftDob) {
      setDobErrorText(strings.completeProfile.errors.dobRequired);
      hasValidationError = true;
    } else if (!isAdultDob(draftDob)) {
      setDobErrorText(strings.completeProfile.errors.dobInvalid);
      hasValidationError = true;
    }

    const draftHeightCentimeters = getDraftHeightCentimeters();

    if (draftHeightCentimeters === null) {
      setHeightErrorText(
        bodyUnitPreference === METRIC_UNIT_PREFERENCE &&
          draftMetricHeightText.trim()
          ? strings.completeProfile.errors.heightInvalid
          : strings.completeProfile.errors.heightRequired,
      );
      hasValidationError = true;
    }

    if (hasValidationError) {
      setFormErrorText(FORM_ERROR_TEXT);
      return;
    }

    submitLockRef.current = true;
    setLoader(true);

    try {
      const trimmedName = draftName.trim();
      const heightCentimetersForSave =
        getProfileHeightCentimetersForSave(draftHeightCentimeters);
      const legacyHeightForSave = getProfileLegacyHeightForSave(
        heightCentimetersForSave,
      );
      const profileUpdatePayload = buildMyVitalsProfileUpdatePayload({
        name: trimmedName,
        dob: draftDob,
        height: legacyHeightForSave,
        heightCentimeters: heightCentimetersForSave,
        bodyUnitPreference,
        gender: draftGender,
      });
      const response = await updateUserProfile(profileUpdatePayload);

      if (response === true) {
        await getUserData();

        const committedUser = {
          ...latestUserRef.current,
          ...profileUpdatePayload,
        };

        latestUserRef.current = committedUser;
        hydrateFormSession(committedUser, { closeFeedback: false });
        setAlertHeading('Success!');
        setAlertText(SUCCESS_MESSAGE);
        setIsPermissionModal(true);
      } else {
        setFormErrorText(
          typeof response === 'string' ? response : DEFAULT_SUBMIT_ERROR,
        );
      }
    } catch (error) {
      setFormErrorText(error?.message || DEFAULT_SUBMIT_ERROR);
    } finally {
      setLoader(false);
      submitLockRef.current = false;
    }
  };

  return (
    <MyVitals
      {...props}
      navigation={navigation}
      datePickerModal={datePickerModal}
      heightPickerModal={heightPickerModal}
      tempDate={tempDate}
      setTempDate={setTempDate}
      tempMonth={tempMonth}
      setTempMonth={setTempMonth}
      tempYear={tempYear}
      setTempYear={setTempYear}
      tempFeet={tempFeet}
      setTempFeet={setTempFeet}
      tempInches={tempInches}
      setTempInches={setTempInches}
      bodyUnitPreference={bodyUnitPreference}
      onSelectBodyUnitPreference={onSelectBodyUnitPreference}
      draftDobText={formatDob(draftDob)}
      draftHeightText={formatHeight(
        draftHeight,
        bodyUnitPreference,
        draftMetricHeightText,
      )}
      draftMetricHeightText={draftMetricHeightText}
      onChangeMetricHeightText={onChangeMetricHeightText}
      draftName={draftName}
      setDraftName={onChangeName}
      draftGender={draftGender}
      onSelectGender={onSelectGender}
      onOpenDatePicker={onOpenDatePicker}
      onConfirmDatePicker={onConfirmDatePicker}
      onCancelDatePicker={onCancelDatePicker}
      onOpenHeightPicker={onOpenHeightPicker}
      onConfirmHeightPicker={onConfirmHeightPicker}
      onCancelHeightPicker={onCancelHeightPicker}
      dobErrorText={dobErrorText}
      heightErrorText={heightErrorText}
      formErrorText={formErrorText}
      loader={loader}
      onUpdateHandler={onUpdateHandler}
      isPermissionModal={isPermissionModal}
      closePermissionModal={closePermissionModal}
      alertHeading={alertHeading}
      alertText={alertText}
    />
  );
}

MyVitalsPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  updateUserProfile: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any),
  getUserData: PropTypes.func.isRequired,
};

MyVitalsPage.defaultProps = {
  user: {},
};

const mapStateToProps = state => ({
  user: state.auth?.user || {},
});

const mapDispatchToProps = dispatch => ({
  updateUserProfile: data => dispatch(profile(data)),
  getUserData: () => dispatch(loggedIn()),
});

export const MyVitalsWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyVitalsPage);
