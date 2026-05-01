import React, { useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { WeightLog } from '../../components';
import {
  addJournalEntry,
  editJournalEntry,
  getJournalEntries,
  profile,
} from '../../../../redux/actions';
import {
  getBodyWeightKilograms,
  isBodyUnitPreference,
  kilogramsToPounds,
  poundsToKilograms,
} from '../../../../utils/bodyMeasurementUnits';

const STANDARD_UNIT_PREFERENCE = 'standard';
const METRIC_UNIT_PREFERENCE = 'metric';

const resolveBodyUnitPreference = value =>
  isBodyUnitPreference(value) ? value : STANDARD_UNIT_PREFERENCE;

const getCanonicalEntryWeightKilograms = entryData =>
  getBodyWeightKilograms({weightKilograms: entryData?.weightKilograms});

const formatStandardDisplayWeight = entryData => {
  const kilograms = getCanonicalEntryWeightKilograms(entryData);

  if (kilograms !== null) {
    const pounds = kilogramsToPounds(kilograms);

    return pounds === null ? '' : pounds.toFixed(1);
  }

  return entryData?.weight ? `${entryData.weight}` : '';
};

const formatMetricDisplayWeight = entryData => {
  const kilograms = getBodyWeightKilograms(entryData);

  return kilograms === null ? '' : kilograms.toFixed(1);
};

const getInitialDisplayWeight = (entryData, unitPreference) =>
  unitPreference === METRIC_UNIT_PREFERENCE
    ? formatMetricDisplayWeight(entryData)
    : formatStandardDisplayWeight(entryData);

const getExistingEnteredWeightMetadata = entryData => {
  if (
    entryData?.enteredWeightValue === undefined ||
    entryData?.enteredWeightUnit === undefined
  ) {
    return {};
  }

  return {
    enteredWeightValue: entryData.enteredWeightValue,
    enteredWeightUnit: entryData.enteredWeightUnit,
  };
};

const getEnteredWeightMetadata = ({
  entryData,
  unitPreference,
  weightEdited,
  weight,
}) => {
  if (!weightEdited) {
    return getExistingEnteredWeightMetadata(entryData);
  }

  return {
    enteredWeightValue: weight,
    enteredWeightUnit:
      unitPreference === METRIC_UNIT_PREFERENCE ? 'kg' : 'lb',
  };
};

const getWeightPayloadValues = ({
  entryData,
  unitPreference,
  weight,
  weightEdited,
}) => {
  const existingCanonicalWeightKilograms =
    getCanonicalEntryWeightKilograms(entryData);
  const originalLegacyWeight = entryData?.weight ? `${entryData.weight}` : '';

  if (!weightEdited && existingCanonicalWeightKilograms !== null) {
    const pounds = kilogramsToPounds(existingCanonicalWeightKilograms);
    const legacyWeight =
      originalLegacyWeight || (pounds === null ? null : pounds.toFixed(1));

    return {
      legacyWeight,
      weightKilograms: existingCanonicalWeightKilograms,
    };
  }

  if (unitPreference !== METRIC_UNIT_PREFERENCE) {
    return {
      legacyWeight: weight,
      weightKilograms: poundsToKilograms(weight),
    };
  }

  if (!weightEdited && originalLegacyWeight) {
    return {
      legacyWeight: originalLegacyWeight,
      weightKilograms: poundsToKilograms(originalLegacyWeight),
    };
  }

  const pounds = kilogramsToPounds(weight);

  return {
    legacyWeight: pounds === null ? null : pounds.toFixed(1),
    weightKilograms: getBodyWeightKilograms({weightKilograms: weight}),
  };
};

const getWeightLogPayload = ({
  entryData,
  unitPreference,
  weight,
  weightEdited,
  note,
}) => {
  const {legacyWeight, weightKilograms} = getWeightPayloadValues({
    entryData,
    unitPreference,
    weight,
    weightEdited,
  });

  if (legacyWeight === null || weightKilograms === null) {
    return null;
  }

  return {
    weight: legacyWeight,
    weightKilograms,
    ...getEnteredWeightMetadata({
      entryData,
      unitPreference,
      weight,
      weightEdited,
    }),
    note,
    isDeleted: false,
  };
};

export default function WeightLogPage(props) {
  const dispatch = useDispatch();
  const {
    route,
    navigation,
    onCreateEntry,
    getAllJournalEntries,
    onEditEntry,
    user,
  } = props;
  const entryData = route?.params?.entryData || {};
  const entryId = route?.params?.entryId;
  const bodyUnitPreference = resolveBodyUnitPreference(
    user?.bodyUnitPreference,
  );
  const isMetric = bodyUnitPreference === METRIC_UNIT_PREFERENCE;
  const savePendingRef = useRef(false);
  const [loader, setLoader] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [entryName, setEntryName] = useState(
    entryData.date
      ? moment(entryData.date, 'YYYY/MM/DD').format('M/DD/YYYY')
      : moment().format('M/DD/YYYY'),
  );
  const [weight, setWeight] = useState(
    getInitialDisplayWeight(entryData, bodyUnitPreference),
  );
  const [weightEdited, setWeightEdited] = useState(false);
  const [note, setNote] = useState(entryData.note || '');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [check, setCheck] = useState('');
  const [weightErrorText, setWeightErrorText] = useState('');
  const [formErrorText, setFormErrorText] = useState('');

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const closePermissionModal = () => {
    setPermissionModal(false);
    setCheck('');
    setAlertHeading('');
    setAlertText('');
  };

  const openClearEntryConfirmation = () => {
    setAlertHeading('Clear Entry');
    setAlertText('Clear this weight log form?');
    setCheck('clearEntry');
    setPermissionModal(true);
  };

  const onDonePermissionModal = () => {
    setPermissionModal(false);
    if (check === 'clearEntry') {
      setWeight('');
      setWeightEdited(true);
      setNote('');
      setWeightErrorText('');
      setFormErrorText('');
      setCheck('');
      setAlertHeading('');
      setAlertText('');
    } else {
      if (alertHeading === 'Success!') {
        navigation.goBack();
      }
      setAlertText('');
      setAlertHeading('');
    }
  };

  const onSaveHandler = async () => {
    if (savePendingRef.current) {
      return;
    }

    savePendingRef.current = true;
    setLoader(true);
    let response = null;
    // Replace slashes with dashes for consistent date parsing (matching Daily Entry)
    const d = new Date(
      (entryData.date || moment().format('YYYY/MM/DD')).replace(/\//g, '-'),
    );
    d.setHours(0, 0, 0, 0);

    if (d.getTime() > new Date().getTime()) {
      setFormErrorText('You cannot enter data on future dates.');
      setWeightErrorText('');
      setLoader(false);
      savePendingRef.current = false;
      return;
    }

    if (!weight.trim()) {
      setWeightErrorText('Weight is required.');
      setFormErrorText('');
      setLoader(false);
      savePendingRef.current = false;
      return;
    }

    const weightLogPayload = getWeightLogPayload({
      entryData,
      unitPreference: bodyUnitPreference,
      weight,
      weightEdited,
      note,
    });

    if (!weightLogPayload) {
      setWeightErrorText('Enter a valid weight.');
      setFormErrorText('');
      setLoader(false);
      savePendingRef.current = false;
      return;
    }

    try {
      setWeightErrorText('');
      setFormErrorText('');

      if (entryId) {
        response = await onEditEntry(entryId, {
          WeightLog: weightLogPayload,
        });
      } else {
        response = await onCreateEntry(d.getTime(), {
          WeightLog: weightLogPayload,
        });
      }

      if (response === true) {
        // Only update profile after successful journal entry save
        try {
          const data = {
            weight: weightLogPayload.weight,
            weightKilograms: weightLogPayload.weightKilograms,
          };
          await dispatch(profile(data));
        } catch (profileError) {
          console.warn('Profile update failed:', profileError);
          // Continue with success flow even if profile update fails
        }

        showMessage('Success!', 'Entry updated successfully.');
        await getAllJournalEntries(d.getTime());
      } else {
        showMessage('Error!', response || 'Failed to save entry.');
      }
    } catch (error) {
      console.error('Save error:', error);
      showMessage('Error!', 'An unexpected error occurred while saving.');
    } finally {
      setLoader(false);
      savePendingRef.current = false;
    }
  };

  return (
    <WeightLog
      loader={loader}
      permissionModal={permissionModal}
      entryName={entryName}
      setEntryName={setEntryName}
      weight={weight}
      setWeight={text => {
        setWeight(text);
        setWeightEdited(true);
        setWeightErrorText('');
        setFormErrorText('');
      }}
      weightLabel={`Enter Weight (${isMetric ? 'kg' : 'lbs'})`}
      weightPlaceholder={isMetric ? 'kg' : 'lbs'}
      weightKeyboardType={isMetric ? 'decimal-pad' : 'number-pad'}
      note={note}
      setNote={text => {
        setNote(text);
        setFormErrorText('');
      }}
      onSaveHandler={onSaveHandler}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
      onClosePermissionModal={closePermissionModal}
      onPromptClearEntry={openClearEntryConfirmation}
      weightErrorText={weightErrorText}
      formErrorText={formErrorText}
    />
  );
}

WeightLogPage.defaultProps = {
  route: {},
  user: null,
};

WeightLogPage.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  onCreateEntry: PropTypes.func.isRequired,
  getAllJournalEntries: PropTypes.func.isRequired,
  onEditEntry: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any),
};

const mapStateToProps = state => ({
  user: state.auth?.user,
});

const mapDispatchToProps = dispatch => ({
  onCreateEntry: (date, data) => dispatch(addJournalEntry(date, data)),
  onEditEntry: (id, data) => dispatch(editJournalEntry(id, data)),
  getAllJournalEntries: date => dispatch(getJournalEntries(date)),
});

export const WeightLogWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(WeightLogPage);
