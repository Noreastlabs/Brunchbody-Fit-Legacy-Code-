/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useFocusEffect } from '@react-navigation/core';
import { MyVitals } from '../../components';
import { loggedIn, profile } from '../../../../redux/actions';
import { strings } from '../../../../resources';

const DEFAULT_HEIGHT = {
  feet: 1,
  inches: 0,
};

const FORM_ERROR_TEXT = 'Check the highlighted profile fields before saving.';
const SUCCESS_MESSAGE = 'Profile updated successfully.';
const DEFAULT_SUBMIT_ERROR = strings.completeProfile.errors.submit;

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

  return { feet, inches };
};

const formatDob = dob =>
  dob ? `${dob.month}/${dob.date}/${dob.year}` : 'Not set';

const formatHeight = height =>
  height ? `${height.feet} ft ${height.inches} in` : 'Not set';

const getStoredDobValue = dob => `${dob.date}/${dob.month}/${dob.year}`;

const getStoredHeightValue = height => `${height.feet}.${height.inches}`;

const getInitialName = value => (typeof value === 'string' ? value : '');

const getInitialGender = value => (value === 'female' ? 'female' : 'male');

const isAdultDob = dob => new Date().getFullYear() - dob.year >= 18;

export default function MyVitalsPage(props) {
  const { navigation, user, updateUserProfile, getUserData } = props;
  const initialDob = parseStoredDob(user?.dob);
  const initialHeight = parseStoredHeight(user?.height);
  const latestUserRef = useRef(user);
  const submitLockRef = useRef(false);
  const [loader, setLoader] = useState(false);
  const [draftName, setDraftName] = useState(getInitialName(user?.name));
  const [draftGender, setDraftGender] = useState(getInitialGender(user?.gender));
  const [draftDob, setDraftDob] = useState(initialDob);
  const [draftHeight, setDraftHeight] = useState(initialHeight);
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
    const nextHeight = parseStoredHeight(sourceUser?.height);
    const fallbackDob = getDefaultDob();

    setDraftName(getInitialName(sourceUser?.name));
    setDraftGender(getInitialGender(sourceUser?.gender));
    setDraftDob(nextDob);
    setDraftHeight(nextHeight);
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
    setDraftHeight({
      feet: tempFeet,
      inches: tempInches,
    });
    setHeightErrorText('');
    setFormErrorText('');
    setHeightPickerModal(false);
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

    if (!draftHeight) {
      setHeightErrorText(strings.completeProfile.errors.heightRequired);
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
      const response = await updateUserProfile({
        name: trimmedName,
        dob: getStoredDobValue(draftDob),
        height: getStoredHeightValue(draftHeight),
        gender: draftGender,
      });

      if (response === true) {
        await getUserData();

        const committedUser = {
          ...latestUserRef.current,
          name: trimmedName,
          dob: getStoredDobValue(draftDob),
          height: getStoredHeightValue(draftHeight),
          gender: draftGender,
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
      draftDobText={formatDob(draftDob)}
      draftHeightText={formatHeight(draftHeight)}
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
