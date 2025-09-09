/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
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

const questions = [
  {
    id: 1,
    value: '',
    isTextArea: false,
    title: strings.weeklyEntry.content1,
    state: 'effectiveness',
  },
  {
    id: 2,
    value: '',
    isTextArea: true,
    title: strings.weeklyEntry.content2,
    placeholder: 'Thoughts, Actions',
    state: 'communicationThoughts',
  },
  {
    id: 3,
    value: '',
    isTextArea: true,
    title: strings.weeklyEntry.content3,
    placeholder: 'Thoughts',
    state: 'focusThoughts',
  },
  {
    id: 4,
    value: '',
    isTextArea: false,
    title: strings.weeklyEntry.content4,
    state: 'focusRating',
  },
  {
    id: 5,
    value: '',
    isTextArea: true,
    title: strings.weeklyEntry.content5,
    placeholder: 'Actions',
    state: 'focusActions',
  },
  {
    id: 6,
    value: '',
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
  const { entryData, entryId } = route.params;
  const [loader, setLoader] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [entryName, setEntryName] = useState(
    moment(entryData.date, 'YYYY/MM/DD').format('M/DD/YYYY'),
  );
  const [effectiveness, setEffectiveness] = useState(
    entryData.effectiveness || 1,
  );
  const [communicationThoughts, setCommunicationThoughts] = useState(
    entryData.communicationThoughts || '',
  );
  const [focusThoughts, setFocusThoughts] = useState(
    entryData.focusThoughts || '',
  );
  const [focusRating, setFocusRating] = useState(entryData.focus || 1);
  const [focusActions, setFocusActions] = useState(
    entryData.focusActions || '',
  );
  const [newSitutionThoughts, setNewSitutionThoughts] = useState(
    entryData.newSitutionThoughts || '',
  );
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [check, setCheck] = useState('');
  const [questionsList, setQuestionsList] = useState(questions);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const questionsCopy = [...questions];

      questionsCopy[1].value = entryData.communicationThoughts || '';
      questionsCopy[2].value = entryData.focusThoughts || '';
      questionsCopy[4].value = entryData.focusActions || '';
      questionsCopy[5].value = entryData.newSitutionThoughts || '';

      setQuestionsList(questionsCopy);
    });

    return unsubscribe;
  }, [navigation]);

  const onSetRating = (val, itemState) => {
    if (itemState === 'effectiveness') setEffectiveness(val);
    if (itemState === 'focusRating') setFocusRating(val);
  };

  const onChangeText = (text, itemState, index) => {
    questions[index].value = text;
    if (itemState === 'communicationThoughts') setCommunicationThoughts(text);
    if (itemState === 'focusThoughts') setFocusThoughts(text);
    if (itemState === 'focusActions') setFocusActions(text);
    if (itemState === 'newSitutionThoughts') setNewSitutionThoughts(text);
  };

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onDonePermissionModal = () => {
    setPermissionModal(false);
    if (check === 'clearEntry') {
      questions.forEach(item => {
        item.value = '';
      });
      setEffectiveness(1);
      setCommunicationThoughts('');
      setFocusThoughts('');
      setFocusRating(1);
      setFocusActions('');
      setNewSitutionThoughts('');
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
    }

    try {
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
    <WeeklyEntry
      loader={loader}
      questions={questionsList}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
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
      setCheck={setCheck}
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
