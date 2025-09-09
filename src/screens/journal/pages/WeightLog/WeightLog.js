import React, { useState } from 'react';
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
  const { entryData, entryId } = route.params;
  const [loader, setLoader] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [entryName, setEntryName] = useState(
    moment(entryData.date, 'YYYY/MM/DD').format('M/DD/YYYY'),
  );
  const [weight, setWeight] = useState(entryData.weight || 0);
  const [note, setNote] = useState(entryData.note || '');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [check, setCheck] = useState('');

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onDonePermissionModal = () => {
    setPermissionModal(false);
    if (check === 'clearEntry') {
      setWeight(0);
      setNote('');
      setCheck('');
    } else {
      if (alertHeading === 'Success!') {
        navigation.goBack();
      }
      setTimeout(() => {
        setAlertText('');
        setAlertHeading('');
      }, 500);
    }
  };

  const onSaveHandler = async () => {
    setLoader(true);
    let response = null;
    // Replace slashes with dashes for consistent date parsing (matching Daily Entry)
    const d = new Date(entryData.date.replace(/\//g, '-'));
    d.setHours(0, 0, 0, 0);

    if (d.getTime() > new Date().getTime()) {
      showMessage('Error!', 'You cannot enter data on future dates.');
      setLoader(false);
      return;
    } else if (!weight) {
      showMessage('Error!', 'Weight is required.');
      setLoader(false);
      return;
    }

    try {
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
        
        setLoader(false);
        showMessage('Success!', 'Entry updated successfully.');
        await getAllJournalEntries(d.getTime());
      } else {
        setLoader(false);
        showMessage('Error!', response || 'Failed to save entry.');
      }
    } catch (error) {
      console.error('Save error:', error);
      setLoader(false);
      showMessage('Error!', 'An unexpected error occurred while saving.');
    }
  };

  return (
    <WeightLog
      loader={loader}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      entryName={entryName}
      setEntryName={setEntryName}
      weight={weight}
      setWeight={setWeight}
      note={note}
      setNote={setNote}
      onSaveHandler={onSaveHandler}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
      setCheck={setCheck}
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
