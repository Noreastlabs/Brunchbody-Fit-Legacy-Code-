import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import EditWriting from '../../components/EditWriting';
import EditEvent from '../../components/EditEvent';
import { strings, timeBlock, wheelPickerItems } from '../../../../resources';
import Picker from '../../../calendar/components/ColorPicker';
import { editTheme } from '../../../../redux/actions';
import styles from '../../components/style';
import {
  CustomModal,
  PermissionModal,
  TimePickerModal,
} from '../../../../components';

const DEFAULT_COLOR = strings.calendar.defaultColor;
const TASK_REQUIRED_ERROR = 'Enter a task name.';
const FORM_REQUIRED_ERROR = 'Check the visible itinerary fields before saving.';
const STALE_ENTRY_ERROR = 'Reopen this itinerary editor and try again.';

const getInitialTimeState = () => ({
  fromHours: moment().format('h'),
  fromMinutes: '00',
  fromTimeFormat: moment().format('A'),
  toHours: moment().format('h'),
  toMinutes: '00',
  toTimeFormat: moment().format('A'),
});

const hasCompleteTimeState = timeState =>
  [
    timeState.fromHours,
    timeState.fromMinutes,
    timeState.fromTimeFormat,
    timeState.toHours,
    timeState.toMinutes,
    timeState.toTimeFormat,
  ].every(Boolean);

const getTimeInMinutes = ({ hours, minutes, format }) => {
  if (!hours || !minutes || !format) {
    return null;
  }

  let hour = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  const normalizedFormat = format.toLowerCase();

  if (normalizedFormat === 'pm' && hour !== 12) {
    hour += 12;
  }

  if (normalizedFormat === 'am' && hour === 12) {
    hour -= 12;
  }

  return hour * 60 + minute;
};

const getStoredTimeInMinutes = storedTime => {
  const [timeValue = '', format = ''] = (storedTime || '').split(' ');
  const [hours = '', minutes = ''] = timeValue.split(':');

  return getTimeInMinutes({ hours, minutes, format });
};

export default function EditWritingPage(props) {
  const { currentTheme, onUpdateTheme } = props;
  const initialTimeState = getInitialTimeState();
  const [timeData, setTimeData] = useState([]);
  const [visibilityEditEvent, setvisibilityEditEvent] = useState(false);
  const [visibleColorPicker, setvisibleColorPicker] = useState(false);
  const [fromTimePickerModal, setFromTimePickerModal] = useState(false);
  const [toTimePickerModal, setToTimePickerModal] = useState(false);
  const [fromHours, setFromHours] = useState(initialTimeState.fromHours);
  const [fromMinutes, setFromMinutes] = useState(initialTimeState.fromMinutes);
  const [fromTimeFormat, setFromTimeFormat] = useState(
    initialTimeState.fromTimeFormat,
  );
  const [toHours, setToHours] = useState(initialTimeState.toHours);
  const [toMinutes, setToMinutes] = useState(initialTimeState.toMinutes);
  const [toTimeFormat, setToTimeFormat] = useState(initialTimeState.toTimeFormat);
  const [colorTheme, setcolorTheme] = useState(DEFAULT_COLOR);
  const [newColor, setnewColor] = useState(DEFAULT_COLOR);
  const [modalHeading, setModalHeading] = useState('');
  const [btnTitle, setBtnTitle] = useState('');
  const [task, setTask] = useState('');
  const [note, setNote] = useState('');
  const [permissionModal, setPermissionModal] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [check, setCheck] = useState('');
  const [btnLoader, setBtnLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [itineraryIndex, setItineraryIndex] = useState(null);
  const [isDeleteBtn, setIsDeleteBtn] = useState(false);
  const [olderTasks, setOlderTasks] = useState([]);
  const [editTask, setEditTask] = useState(false);
  const [taskErrorText, setTaskErrorText] = useState('');
  const [formErrorText, setFormErrorText] = useState('');
  const submitLockRef = useRef(false);
  const deleteLockRef = useRef(false);

  const getItineraries = () =>
    Array.isArray(currentTheme?.itinerary) ? [...currentTheme.itinerary] : [];

  const resetValidation = () => {
    setTaskErrorText('');
    setFormErrorText('');
  };

  const resetActionState = () => {
    submitLockRef.current = false;
    deleteLockRef.current = false;
    setBtnLoader(false);
    setDeleteLoader(false);
    setOlderTasks([]);
    setCheck('');
    setAlertHeading('');
    setAlertText('');
    setPermissionModal(false);
    setEditTask(false);
    resetValidation();
  };

  const resetEditorFields = () => {
    const nextTimeState = getInitialTimeState();

    setTask('');
    setNote('');
    setcolorTheme(DEFAULT_COLOR);
    setnewColor(DEFAULT_COLOR);
    setFromHours(nextTimeState.fromHours);
    setFromMinutes(nextTimeState.fromMinutes);
    setFromTimeFormat(nextTimeState.fromTimeFormat);
    setToHours(nextTimeState.toHours);
    setToMinutes(nextTimeState.toMinutes);
    setToTimeFormat(nextTimeState.toTimeFormat);
    setItineraryIndex(null);
    setIsDeleteBtn(false);
  };

  const prepareEditorSession = () => {
    resetActionState();
    setvisibleColorPicker(false);
    setFromTimePickerModal(false);
    setToTimePickerModal(false);
  };

  const closeEditEvent = () => {
    prepareEditorSession();
    resetEditorFields();
    setModalHeading('');
    setBtnTitle('');
    setvisibilityEditEvent(false);
  };

  const changeColor = color => setnewColor(color);

  useEffect(() => {
    const temp = [...timeBlock.data];
    const itineraries = getItineraries().sort(
      (a, b) => a.fromTime.split(':')[0] - b.fromTime.split(':')[0],
    );

    temp.forEach((item, index) => {
      const itemMin = item.min;

      itineraries.forEach(itineraryItem => {
        const itineraryFromTime = getStoredTimeInMinutes(
          itineraryItem.fromTime,
        );
        const itineraryToTime = getStoredTimeInMinutes(itineraryItem.toTime);

        if (itineraryFromTime === null || itineraryToTime === null) {
          return;
        }

        if (itemMin >= itineraryFromTime && itemMin <= itineraryToTime) {
          temp[index] = {
            ...temp[index],
            taskName: itineraryItem.taskName,
            taskColor: itineraryItem.taskColor,
          };
        }
      });
    });

    setTimeData(temp);
  }, [currentTheme]);

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const validateEditorState = mode => {
    const itineraries = getItineraries();
    const nextTimeState = {
      fromHours,
      fromMinutes,
      fromTimeFormat,
      toHours,
      toMinutes,
      toTimeFormat,
    };
    let nextTaskError = '';
    let nextFormError = '';

    resetValidation();

    if (!task.trim()) {
      nextTaskError = TASK_REQUIRED_ERROR;
    }

    if (!hasCompleteTimeState(nextTimeState)) {
      nextFormError = FORM_REQUIRED_ERROR;
    }

    if (!currentTheme?.id || !Array.isArray(currentTheme?.itinerary)) {
      nextFormError = STALE_ENTRY_ERROR;
    }

    if (
      mode === 'edit' &&
      (itineraryIndex === null || !itineraries[itineraryIndex])
    ) {
      nextFormError = STALE_ENTRY_ERROR;
    }

    if (nextTaskError) {
      setTaskErrorText(nextTaskError);
    }

    if (nextFormError) {
      setFormErrorText(nextFormError);
    }

    return !nextTaskError && !nextFormError;
  };

  const onAddIconPress = () => {
    prepareEditorSession();
    resetEditorFields();
  };

  const onItineraryPress = (item, index) => {
    const nextTimeState = getInitialTimeState();
    const [toTimeValue = '', toFormat = ''] = (item?.toTime || '').split(' ');
    const [fromTimeValue = '', fromFormat = ''] = (item?.fromTime || '').split(
      ' ',
    );
    const [nextToHours = '', nextToMinutes = ''] = toTimeValue.split(':');
    const [nextFromHours = '', nextFromMinutes = ''] = fromTimeValue.split(':');

    prepareEditorSession();
    resetEditorFields();
    setIsDeleteBtn(true);
    setItineraryIndex(index);
    setTask(item?.taskName || '');
    setNote(item?.notes || '');
    setcolorTheme(item?.taskColor || DEFAULT_COLOR);
    setnewColor(item?.taskColor || DEFAULT_COLOR);
    setToHours(nextToHours || nextTimeState.toHours);
    setToMinutes(nextToMinutes || nextTimeState.toMinutes);
    setToTimeFormat(toFormat || nextTimeState.toTimeFormat);
    setFromHours(nextFromHours || nextTimeState.fromHours);
    setFromMinutes(nextFromMinutes || nextTimeState.fromMinutes);
    setFromTimeFormat(fromFormat || nextTimeState.fromTimeFormat);
  };

  const onTaskChange = text => {
    setTask(text);
    setTaskErrorText('');
  };

  const onDeletePress = () => {
    const itineraries = getItineraries();

    resetValidation();

    if (!currentTheme?.id || itineraryIndex === null || !itineraries[itineraryIndex]) {
      setFormErrorText(STALE_ENTRY_ERROR);
      return;
    }

    setOlderTasks([]);
    setAlertHeading('');
    setAlertText('');
    setCheck('delete');
    setPermissionModal(true);
  };

  const onAddThemeItinerary = async () => {
    if (submitLockRef.current || btnLoader) {
      return;
    }

    if (!validateEditorState('create')) {
      return;
    }

    const itineraries = getItineraries();
    const data = {
      taskName: task,
      notes: note,
      taskColor: colorTheme,
      toTime: `${toHours}:${toMinutes} ${toTimeFormat.toLowerCase()}`,
      fromTime: `${fromHours}:${fromMinutes} ${fromTimeFormat.toLowerCase()}`,
    };
    let response = false;

    submitLockRef.current = true;
    setBtnLoader(true);

    try {
      if (olderTasks.length > 0) {
        const filteredData = itineraries.filter(existingItem => {
          if (
            olderTasks.findIndex(
              olderItem =>
                olderItem.taskName.toLowerCase() ===
                existingItem.taskName.toLowerCase(),
            ) > -1
          ) {
            return false;
          }

          return true;
        });

        response = await onUpdateTheme(currentTheme.id, {
          itinerary: [...filteredData, data],
        });
      } else {
        response = await onUpdateTheme(currentTheme.id, {
          itinerary: [...itineraries, data],
        });
      }
    } catch (error) {
      response = error?.message || 'Something went wrong.';
    }

    submitLockRef.current = false;
    setBtnLoader(false);

    if (response === true) {
      setOlderTasks([]);
      setCheck('');
      showMessage('Success!', 'Theme updated successfully.');
    } else {
      showMessage('Error!', response);
    }
  };

  const onEditThemeItinerary = async () => {
    if (submitLockRef.current || btnLoader) {
      return;
    }

    if (!validateEditorState('edit')) {
      return;
    }

    const itineraries = getItineraries();
    const data = {
      taskName: task,
      notes: note,
      taskColor: colorTheme,
      toTime: `${toHours}:${toMinutes} ${toTimeFormat.toLowerCase()}`,
      fromTime: `${fromHours}:${fromMinutes} ${fromTimeFormat.toLowerCase()}`,
    };
    const nextItinerary = [...itineraries];
    let response = false;

    nextItinerary[itineraryIndex] = data;

    submitLockRef.current = true;
    setBtnLoader(true);

    try {
      if (olderTasks.length > 0) {
        const filteredData = nextItinerary.filter(existingItem => {
          if (
            olderTasks.findIndex(
              olderItem =>
                olderItem.taskName.toLowerCase() ===
                existingItem.taskName.toLowerCase(),
            ) > -1
          ) {
            return false;
          }

          return true;
        });

        response = await onUpdateTheme(currentTheme.id, {
          itinerary: [...filteredData, data],
        });
      } else {
        response = await onUpdateTheme(currentTheme.id, {
          itinerary: nextItinerary,
        });
      }
    } catch (error) {
      response = error?.message || 'Something went wrong.';
    }

    submitLockRef.current = false;
    setBtnLoader(false);

    if (response === true) {
      setOlderTasks([]);
      setCheck('');
      showMessage('Success!', 'Theme updated successfully.');
    } else {
      showMessage('Error!', response);
    }
  };

  const onCheckExistingTask = async isEditMode => {
    const temp = [];
    const itineraries = getItineraries();
    const fromMin = getTimeInMinutes({
      hours: fromHours,
      minutes: fromMinutes,
      format: fromTimeFormat,
    });
    const toMin = getTimeInMinutes({
      hours: toHours,
      minutes: toMinutes,
      format: toTimeFormat,
    });

    if (!validateEditorState(isEditMode ? 'edit' : 'create')) {
      return;
    }

    if (fromMin === null || toMin === null) {
      setFormErrorText(FORM_REQUIRED_ERROR);
      return;
    }

    setEditTask(isEditMode);

    itineraries
      .sort((a, b) => a.fromTime.split(':')[0] - b.fromTime.split(':')[0])
      .forEach(existingItem => {
        const itineraryFromTime = getStoredTimeInMinutes(existingItem.fromTime);
        const itineraryToTime = getStoredTimeInMinutes(existingItem.toTime);

        if (itineraryFromTime === null || itineraryToTime === null) {
          return;
        }

        if (
          (fromMin >= itineraryFromTime && fromMin <= itineraryToTime) ||
          (toMin >= itineraryFromTime && toMin <= itineraryToTime) ||
          (itineraryFromTime >= fromMin && itineraryFromTime <= toMin) ||
          (itineraryToTime >= fromMin && itineraryToTime <= toMin)
        ) {
          temp.push(existingItem);
        }
      });

    if (temp.length > 0) {
      setOlderTasks(temp);
      showMessage(
        'Confirmation',
        'Are you sure you want to override older task?',
      );
      return;
    }

    if (isEditMode) {
      await onEditThemeItinerary();
    } else {
      await onAddThemeItinerary();
    }
  };

  const onDonePermissionModal = async () => {
    if (alertHeading === 'Success!') {
      closeEditEvent();
      return;
    }

    if (alertHeading === 'Error!') {
      onCancelPermissionModal();
      return;
    }

    if (olderTasks.length > 0) {
      if (editTask) {
        await onEditThemeItinerary();
      } else {
        await onAddThemeItinerary();
      }
      return;
    }

    if (check === 'delete') {
      const itineraries = getItineraries();
      let response = false;

      if (deleteLockRef.current || deleteLoader) {
        return;
      }

      if (!currentTheme?.id || itineraryIndex === null || !itineraries[itineraryIndex]) {
        setPermissionModal(false);
        setCheck('');
        setFormErrorText(STALE_ENTRY_ERROR);
        return;
      }

      deleteLockRef.current = true;
      setDeleteLoader(true);

      try {
        const nextItinerary = [...itineraries];
        nextItinerary.splice(itineraryIndex, 1);
        response = await onUpdateTheme(currentTheme.id, {
          itinerary: nextItinerary,
        });
      } catch (error) {
        response = error?.message || 'Something went wrong.';
      }

      deleteLockRef.current = false;
      setDeleteLoader(false);

      if (response === true) {
        setCheck('');
        showMessage('Success!', 'Theme updated successfully.');
      } else {
        showMessage('Error!', response);
      }
      return;
    }

    onCancelPermissionModal();
  };

  const onCancelPermissionModal = () => {
    setCheck('');
    setAlertText('');
    setAlertHeading('');
    setOlderTasks([]);
    setPermissionModal(false);
  };

  const permissionLoader = check === 'delete' ? deleteLoader : btnLoader;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <EditWriting
          {...props}
          showEditEvent={() => setvisibilityEditEvent(true)}
          setTimeData={setTimeData}
          timeData={timeData}
          setModalHeading={setModalHeading}
          setBtnTitle={setBtnTitle}
          onItineraryPress={onItineraryPress}
          onAddIconPress={onAddIconPress}
        />
      </ScrollView>

      <EditEvent
        isDeleteBtn={isDeleteBtn}
        btnTitle={btnTitle}
        colorTheme={colorTheme}
        modalHeading={modalHeading}
        hideEditEvent={closeEditEvent}
        showColorPicker={() => setvisibleColorPicker(true)}
        visibilityEditEvent={visibilityEditEvent}
        setToTimePickerModal={setToTimePickerModal}
        setFromTimePickerModal={setFromTimePickerModal}
        btnLoader={btnLoader}
        note={note}
        setNote={setNote}
        task={task}
        setTask={onTaskChange}
        taskErrorText={taskErrorText}
        formErrorText={formErrorText}
        actionDisabled={btnLoader || deleteLoader}
        fromHours={fromHours}
        fromMinutes={fromMinutes}
        fromTimeFormat={fromTimeFormat}
        toHours={toHours}
        toMinutes={toMinutes}
        toTimeFormat={toTimeFormat}
        onAddThemeItinerary={() => onCheckExistingTask(false)}
        onEditThemeItinerary={() => onCheckExistingTask(true)}
        onDeletePress={onDeletePress}
      />

      <Picker
        visibleColorPicker={visibleColorPicker}
        hideColorPicker={() => {
          setvisibleColorPicker(false);
          setcolorTheme(newColor);
        }}
        changeColor={changeColor}
        newColor={newColor}
      />

      <CustomModal
        isVisible={fromTimePickerModal}
        onDismiss={() => setFromTimePickerModal(false)}
        content={
          <TimePickerModal
            currentHours={fromHours}
            currentMinutes={fromMinutes}
            setHours={setFromHours}
            setMinutes={setFromMinutes}
            timeFormat={fromTimeFormat}
            setTimeFormat={setFromTimeFormat}
            hoursData={wheelPickerItems.hours}
            minutesData={wheelPickerItems.minutesWithDiff15}
            onConfirm={() => setFromTimePickerModal(false)}
            onCancel={() => setFromTimePickerModal(false)}
          />
        }
      />

      <CustomModal
        isVisible={toTimePickerModal}
        onDismiss={() => setToTimePickerModal(false)}
        content={
          <TimePickerModal
            currentHours={toHours}
            currentMinutes={toMinutes}
            setHours={setToHours}
            setMinutes={setToMinutes}
            timeFormat={toTimeFormat}
            setTimeFormat={setToTimeFormat}
            hoursData={wheelPickerItems.hours}
            minutesData={wheelPickerItems.minutesWithDiff15}
            onConfirm={() => setToTimePickerModal(false)}
            onCancel={() => setToTimePickerModal(false)}
          />
        }
      />

      <CustomModal
        isVisible={permissionModal}
        onDismiss={
          alertHeading === 'Success!'
            ? onDonePermissionModal
            : onCancelPermissionModal
        }
        content={
          <PermissionModal
            loader={permissionLoader}
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={onDonePermissionModal}
            onCancel={onCancelPermissionModal}
          />
        }
      />
    </SafeAreaView>
  );
}

EditWritingPage.defaultProps = {
  currentTheme: {},
};

EditWritingPage.propTypes = {
  currentTheme: PropTypes.objectOf(PropTypes.any),
  onUpdateTheme: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentTheme: state.calendar?.currentTheme,
});

const mapDispatchToProps = dispatch => ({
  onUpdateTheme: (id, data) => dispatch(editTheme(id, data)),
});

export const EditWritingWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditWritingPage);
