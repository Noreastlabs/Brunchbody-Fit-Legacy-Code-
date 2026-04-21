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

export default function WeightLogPage(props) {
  const dispatch = useDispatch();
  const {
    route,
    navigation,
    onCreateEntry,
    getAllJournalEntries,
    onEditEntry,
  } = props;
  const entryData = route?.params?.entryData || {};
  const entryId = route?.params?.entryId;
  const savePendingRef = useRef(false);
  const [loader, setLoader] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [entryName, setEntryName] = useState(
    entryData.date
      ? moment(entryData.date, 'YYYY/MM/DD').format('M/DD/YYYY')
      : moment().format('M/DD/YYYY'),
  );
  const [weight, setWeight] = useState(
    entryData.weight ? `${entryData.weight}` : '',
  );
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

    try {
      setWeightErrorText('');
      setFormErrorText('');

      if (entryId) {
        response = await onEditEntry(entryId, {
          WeightLog: {
            weight,
            note,
            isDeleted: false,
          },
        });
      } else {
        response = await onCreateEntry(d.getTime(), {
          WeightLog: {
            weight,
            note,
            isDeleted: false,
          },
        });
      }

      if (response === true) {
        // Only update profile after successful journal entry save
        try {
          const data = { weight };
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
        setWeightErrorText('');
        setFormErrorText('');
      }}
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
};

WeightLogPage.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  onCreateEntry: PropTypes.func.isRequired,
  getAllJournalEntries: PropTypes.func.isRequired,
  onEditEntry: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onCreateEntry: (date, data) => dispatch(addJournalEntry(date, data)),
  onEditEntry: (id, data) => dispatch(editJournalEntry(id, data)),
  getAllJournalEntries: date => dispatch(getJournalEntries(date)),
});

export const WeightLogWrapper = connect(
  null,
  mapDispatchToProps,
)(WeightLogPage);
