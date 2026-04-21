import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { strings } from '../../../../resources';
import { WeeklyEntry } from '../../components';
import {
  addJournalEntry,
  editJournalEntry,
  getJournalEntries,
} from '../../../../redux/actions';

const DEFAULT_RATING = 1;

const questions = [
  {
    id: 1,
    isTextArea: false,
    title: strings.weeklyEntry.content1,
    state: 'effectiveness',
  },
  {
    id: 2,
    isTextArea: true,
    title: strings.weeklyEntry.content2,
    placeholder: 'Thoughts, Actions',
    state: 'communicationThoughts',
  },
  {
    id: 3,
    isTextArea: true,
    title: strings.weeklyEntry.content3,
    placeholder: 'Thoughts',
    state: 'focusThoughts',
  },
  {
    id: 4,
    isTextArea: false,
    title: strings.weeklyEntry.content4,
    state: 'focusRating',
  },
  {
    id: 5,
    isTextArea: true,
    title: strings.weeklyEntry.content5,
    placeholder: 'Actions',
    state: 'focusActions',
  },
  {
    id: 6,
    isTextArea: true,
    title: strings.weeklyEntry.content6,
    placeholder: 'Thoughts',
    state: 'newSitutionThoughts',
  },
];

export default function WeeklyEntryPage(props) {
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
  const [entryName, setEntryName] = useState('');
  const [effectiveness, setEffectiveness] = useState(
    entryData.effectiveness || DEFAULT_RATING,
  );
  const [communicationThoughts, setCommunicationThoughts] = useState(
    entryData.communicationThoughts || '',
  );
  const [focusThoughts, setFocusThoughts] = useState(
    entryData.focusThoughts || '',
  );
  const [focusRating, setFocusRating] = useState(
    entryData.focus || DEFAULT_RATING,
  );
  const [focusActions, setFocusActions] = useState(
    entryData.focusActions || '',
  );
  const [newSitutionThoughts, setNewSitutionThoughts] = useState(
    entryData.newSitutionThoughts || '',
  );
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [check, setCheck] = useState('');
  const [formErrorText, setFormErrorText] = useState('');

  const hydrateFromEntryData = sourceEntryData => {
    const entryDate = sourceEntryData.date
      ? moment(sourceEntryData.date, 'YYYY/MM/DD').format('M/DD/YYYY')
      : moment().format('M/DD/YYYY');

    setEntryName(entryDate);
    setEffectiveness(sourceEntryData.effectiveness || DEFAULT_RATING);
    setCommunicationThoughts(sourceEntryData.communicationThoughts || '');
    setFocusThoughts(sourceEntryData.focusThoughts || '');
    setFocusRating(sourceEntryData.focus || DEFAULT_RATING);
    setFocusActions(sourceEntryData.focusActions || '');
    setNewSitutionThoughts(sourceEntryData.newSitutionThoughts || '');
    setFormErrorText('');
  };

  useEffect(() => {
    hydrateFromEntryData(entryData);

    const unsubscribe = navigation.addListener('focus', () => {
      hydrateFromEntryData(route?.params?.entryData || {});
    });

    return unsubscribe;
  }, [entryData, navigation]);

  const questionsList = questions.map(item => ({
    ...item,
    value:
      {
        communicationThoughts,
        focusThoughts,
        focusActions,
        newSitutionThoughts,
      }[item.state] || '',
  }));

  const onSetRating = (val, itemState) => {
    setFormErrorText('');
    if (itemState === 'effectiveness') {
      setEffectiveness(val);
    }
    if (itemState === 'focusRating') {
      setFocusRating(val);
    }
  };

  const onChangeText = (text, itemState) => {
    setFormErrorText('');
    if (itemState === 'communicationThoughts') {
      setCommunicationThoughts(text);
    }
    if (itemState === 'focusThoughts') {
      setFocusThoughts(text);
    }
    if (itemState === 'focusActions') {
      setFocusActions(text);
    }
    if (itemState === 'newSitutionThoughts') {
      setNewSitutionThoughts(text);
    }
  };

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
    setAlertText('Clear this weekly entry form?');
    setCheck('clearEntry');
    setPermissionModal(true);
  };

  const onDonePermissionModal = () => {
    setPermissionModal(false);
    if (check === 'clearEntry') {
      setEffectiveness(DEFAULT_RATING);
      setCommunicationThoughts('');
      setFocusThoughts('');
      setFocusRating(DEFAULT_RATING);
      setFocusActions('');
      setNewSitutionThoughts('');
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
      setLoader(false);
      savePendingRef.current = false;
      return;
    }

    try {
      setFormErrorText('');

      if (entryId) {
        response = await onEditEntry(entryId, {
          WeeklyEntry: {
            effectiveness,
            communicationThoughts,
            focusThoughts,
            focus: focusRating,
            focusActions,
            newSitutionThoughts,
            isDeleted: false,
          },
        });
      } else {
        response = await onCreateEntry(d.getTime(), {
          WeeklyEntry: {
            effectiveness,
            communicationThoughts,
            focusThoughts,
            focus: focusRating,
            focusActions,
            newSitutionThoughts,
            isDeleted: false,
          },
        });
      }

      if (response === true) {
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
    <WeeklyEntry
      loader={loader}
      questions={questionsList}
      permissionModal={permissionModal}
      entryName={entryName}
      setEntryName={setEntryName}
      onSaveHandler={onSaveHandler}
      onChangeText={onChangeText}
      onSetRating={onSetRating}
      effectiveness={effectiveness}
      focusRating={focusRating}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
      onClosePermissionModal={closePermissionModal}
      onPromptClearEntry={openClearEntryConfirmation}
      formErrorText={formErrorText}
    />
  );
}

WeeklyEntryPage.defaultProps = {
  route: {},
};

WeeklyEntryPage.propTypes = {
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

export const WeeklyEntryWrapper = connect(
  null,
  mapDispatchToProps,
)(WeeklyEntryPage);
