/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { strings } from '../../../../resources';
import { QuarterlyEntry } from '../../components';
import {
  addJournalEntry,
  editJournalEntry,
  getJournalEntries,
} from '../../../../redux/actions';

const questions = [
  {
    id: 1,
    value: '',
    title: strings.quarterlyEntry.content1,
    placeholder: 'Thoughts, Actions',
    state: 'presenceThoughts',
  },
  {
    id: 2,
    value: '',
    title: strings.quarterlyEntry.content2,
    placeholder: 'Thoughts',
    state: 'personalProjectThoughts',
  },
  {
    id: 3,
    value: '',
    title: strings.quarterlyEntry.content3,
    placeholder: 'Actions',
    state: 'personalProjectActions',
  },
  {
    id: 4,
    value: '',
    title: strings.quarterlyEntry.content4,
    placeholder: 'Thoughts',
    state: 'subjectToLearnThoughts',
  },
  {
    id: 5,
    value: '',
    title: strings.quarterlyEntry.content5,
    placeholder: 'Actions',
    state: 'subjectToLearnActions',
  },
  {
    id: 6,
    value: '',
    title: strings.quarterlyEntry.content6,
    placeholder: 'Thoughts',
    state: 'clearThingsThoughts',
  },
  {
    id: 7,
    value: '',
    title: strings.quarterlyEntry.content7,
    placeholder: 'Thoughts',
    state: 'letGoThoughts',
  },
  {
    id: 8,
    value: '',
    title: strings.quarterlyEntry.content8,
    placeholder: 'Thoughts',
    state: 'dietaryExpectionsThoughts',
  },
  {
    id: 9,
    value: '',
    title: strings.quarterlyEntry.content9,
    placeholder: 'Thoughts',
    state: 'routineThoughts',
  },
];

export default function QuarterlyEntryPage(props) {
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
  const [presenceThoughts, setPresenceThoughts] = useState(
    entryData.presenceThoughts || '',
  );
  const [personalProjectThoughts, setPersonalProjectThoughts] = useState(
    entryData.personalProjectThoughts || '',
  );
  const [personalProjectActions, setPersonalProjectActions] = useState(
    entryData.personalProjectActions || '',
  );
  const [subjectToLearnThoughts, setSubjectToLearnThoughts] = useState(
    entryData.subjectToLearnThoughts || '',
  );
  const [subjectToLearnActions, setSubjectToLearnActions] = useState(
    entryData.subjectToLearnActions || '',
  );
  const [clearThingsThoughts, setClearThingsThoughts] = useState(
    entryData.clearThingsThoughts || '',
  );
  const [letGoThoughts, setLetGoThoughts] = useState(
    entryData.letGoThoughts || '',
  );
  const [dietaryExpectionsThoughts, setDietaryExpectionsThoughts] = useState(
    entryData.dietaryExpectionsThoughts || '',
  );
  const [routineThoughts, setRoutineThoughts] = useState(
    entryData.routineThoughts || '',
  );
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [check, setCheck] = useState('');
  const [questionsList, setQuestionsList] = useState(questions);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const questionsCopy = [...questions];

      questionsCopy[0].value = entryData.presenceThoughts || '';
      questionsCopy[1].value = entryData.personalProjectThoughts || '';
      questionsCopy[2].value = entryData.personalProjectActions || '';
      questionsCopy[3].value = entryData.subjectToLearnThoughts || '';
      questionsCopy[4].value = entryData.subjectToLearnActions || '';
      questionsCopy[5].value = entryData.clearThingsThoughts || '';
      questionsCopy[6].value = entryData.letGoThoughts || '';
      questionsCopy[7].value = entryData.dietaryExpectionsThoughts || '';
      questionsCopy[8].value = entryData.routineThoughts || '';

      setQuestionsList(questionsCopy);
    });

    return unsubscribe;
  }, [navigation]);

  const onChangeText = (text, itemState, index) => {
    questions[index].value = text;
    if (itemState === 'presenceThoughts') setPresenceThoughts(text);
    if (itemState === 'personalProjectThoughts')
      setPersonalProjectThoughts(text);
    if (itemState === 'personalProjectActions') setPersonalProjectActions(text);
    if (itemState === 'subjectToLearnThoughts') setSubjectToLearnThoughts(text);
    if (itemState === 'subjectToLearnActions') setSubjectToLearnActions(text);
    if (itemState === 'clearThingsThoughts') setClearThingsThoughts(text);
    if (itemState === 'letGoThoughts') setLetGoThoughts(text);
    if (itemState === 'dietaryExpectionsThoughts')
      setDietaryExpectionsThoughts(text);
    if (itemState === 'routineThoughts') setRoutineThoughts(text);
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
      setPresenceThoughts('');
      setPersonalProjectThoughts('');
      setPersonalProjectActions('');
      setSubjectToLearnThoughts('');
      setSubjectToLearnActions('');
      setClearThingsThoughts('');
      setLetGoThoughts('');
      setDietaryExpectionsThoughts('');
      setRoutineThoughts('');
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
          QuarterlyEntry: {
            presenceThoughts,
            personalProjectThoughts,
            personalProjectActions,
            subjectToLearnThoughts,
            subjectToLearnActions,
            clearThingsThoughts,
            letGoThoughts,
            dietaryExpectionsThoughts,
            routineThoughts,
            isDeleted: false,
          },
        });
      } else {
        response = await onCreateEntry(d.getTime(), {
          QuarterlyEntry: {
            presenceThoughts,
            personalProjectThoughts,
            personalProjectActions,
            subjectToLearnThoughts,
            subjectToLearnActions,
            clearThingsThoughts,
            letGoThoughts,
            dietaryExpectionsThoughts,
            routineThoughts,
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
    <QuarterlyEntry
      loader={loader}
      questions={questionsList}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      entryName={entryName}
      setEntryName={setEntryName}
      onSaveHandler={onSaveHandler}
      onChangeText={onChangeText}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
      setCheck={setCheck}
    />
  );
}

QuarterlyEntryPage.defaultProps = {
  route: {},
};

QuarterlyEntryPage.propTypes = {
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

export const QuarterlyEntryWrapper = connect(
  null,
  mapDispatchToProps,
)(QuarterlyEntryPage);
