import React, { useEffect, useRef, useState } from 'react';
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
    title: strings.quarterlyEntry.content1,
    placeholder: 'Thoughts, Actions',
    state: 'presenceThoughts',
  },
  {
    id: 2,
    title: strings.quarterlyEntry.content2,
    placeholder: 'Thoughts',
    state: 'personalProjectThoughts',
  },
  {
    id: 3,
    title: strings.quarterlyEntry.content3,
    placeholder: 'Actions',
    state: 'personalProjectActions',
  },
  {
    id: 4,
    title: strings.quarterlyEntry.content4,
    placeholder: 'Thoughts',
    state: 'subjectToLearnThoughts',
  },
  {
    id: 5,
    title: strings.quarterlyEntry.content5,
    placeholder: 'Actions',
    state: 'subjectToLearnActions',
  },
  {
    id: 6,
    title: strings.quarterlyEntry.content6,
    placeholder: 'Thoughts',
    state: 'clearThingsThoughts',
  },
  {
    id: 7,
    title: strings.quarterlyEntry.content7,
    placeholder: 'Thoughts',
    state: 'letGoThoughts',
  },
  {
    id: 8,
    title: strings.quarterlyEntry.content8,
    placeholder: 'Thoughts',
    state: 'dietaryExpectionsThoughts',
  },
  {
    id: 9,
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
  const entryData = route?.params?.entryData || {};
  const entryId = route?.params?.entryId;
  const savePendingRef = useRef(false);
  const [loader, setLoader] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [entryName, setEntryName] = useState('');
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
  const [formErrorText, setFormErrorText] = useState('');

  const hydrateFromEntryData = sourceEntryData => {
    const entryDate = sourceEntryData.date
      ? moment(sourceEntryData.date, 'YYYY/MM/DD').format('M/DD/YYYY')
      : moment().format('M/DD/YYYY');

    setEntryName(entryDate);
    setPresenceThoughts(sourceEntryData.presenceThoughts || '');
    setPersonalProjectThoughts(sourceEntryData.personalProjectThoughts || '');
    setPersonalProjectActions(sourceEntryData.personalProjectActions || '');
    setSubjectToLearnThoughts(sourceEntryData.subjectToLearnThoughts || '');
    setSubjectToLearnActions(sourceEntryData.subjectToLearnActions || '');
    setClearThingsThoughts(sourceEntryData.clearThingsThoughts || '');
    setLetGoThoughts(sourceEntryData.letGoThoughts || '');
    setDietaryExpectionsThoughts(
      sourceEntryData.dietaryExpectionsThoughts || '',
    );
    setRoutineThoughts(sourceEntryData.routineThoughts || '');
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
        presenceThoughts,
        personalProjectThoughts,
        personalProjectActions,
        subjectToLearnThoughts,
        subjectToLearnActions,
        clearThingsThoughts,
        letGoThoughts,
        dietaryExpectionsThoughts,
        routineThoughts,
      }[item.state] || '',
  }));

  const onChangeText = (text, itemState) => {
    setFormErrorText('');
    if (itemState === 'presenceThoughts') {
      setPresenceThoughts(text);
    }
    if (itemState === 'personalProjectThoughts') {
      setPersonalProjectThoughts(text);
    }
    if (itemState === 'personalProjectActions') {
      setPersonalProjectActions(text);
    }
    if (itemState === 'subjectToLearnThoughts') {
      setSubjectToLearnThoughts(text);
    }
    if (itemState === 'subjectToLearnActions') {
      setSubjectToLearnActions(text);
    }
    if (itemState === 'clearThingsThoughts') {
      setClearThingsThoughts(text);
    }
    if (itemState === 'letGoThoughts') {
      setLetGoThoughts(text);
    }
    if (itemState === 'dietaryExpectionsThoughts') {
      setDietaryExpectionsThoughts(text);
    }
    if (itemState === 'routineThoughts') {
      setRoutineThoughts(text);
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
    setAlertText('Clear this quarterly entry form?');
    setCheck('clearEntry');
    setPermissionModal(true);
  };

  const onDonePermissionModal = () => {
    setPermissionModal(false);
    if (check === 'clearEntry') {
      setPresenceThoughts('');
      setPersonalProjectThoughts('');
      setPersonalProjectActions('');
      setSubjectToLearnThoughts('');
      setSubjectToLearnActions('');
      setClearThingsThoughts('');
      setLetGoThoughts('');
      setDietaryExpectionsThoughts('');
      setRoutineThoughts('');
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
    <QuarterlyEntry
      loader={loader}
      questions={questionsList}
      permissionModal={permissionModal}
      entryName={entryName}
      setEntryName={setEntryName}
      onSaveHandler={onSaveHandler}
      onChangeText={onChangeText}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
      onClosePermissionModal={closePermissionModal}
      onPromptClearEntry={openClearEntryConfirmation}
      formErrorText={formErrorText}
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
