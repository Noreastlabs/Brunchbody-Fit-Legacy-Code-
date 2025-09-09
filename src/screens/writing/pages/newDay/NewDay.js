/* eslint-disable array-callback-return */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { strings, timeBlock } from '../../../../resources';
import { NewDay } from '../../components';
import { editTheme } from '../../../../redux/actions';

export default function NewDayPage(props) {
  const { theme, onUpdateTheme } = props;
  const [timeData, setTimeData] = useState([]);
  const [visibilityEditEvent, setvisibilityEditEvent] = useState(false);
  const [visibleColorPicker, setvisibleColorPicker] = useState(false);
  const [fromTimePickerModal, setFromTimePickerModal] = useState(false);
  const [toTimePickerModal, setToTimePickerModal] = useState(false);
  const [fromHours, setFromHours] = useState(moment().format('h'));
  const [fromMinutes, setFromMinutes] = useState('00');
  const [fromTimeFormat, setFromTimeFormat] = useState(moment().format('A'));
  const [toHours, setToHours] = useState(moment().format('h'));
  const [toMinutes, setToMinutes] = useState('00');
  const [toTimeFormat, setToTimeFormat] = useState(moment().format('A'));
  const [newColor, setnewColor] = useState(strings.calendar.defaultColor);
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
  const [isDeleteBtn, setIsDeleteBtn] = useState(null);
  const [olderTasks, setOlderTasks] = useState(null);
  const [editTask, setEditTask] = useState(false);

  useEffect(() => {
    updateTimeBlock();
  }, [theme]);

  const updateTimeBlock = () => {
    const temp = [...timeBlock.data];
    const itineraries = [...theme.itinerary];

    temp.map((item, index) => {
      const itemMin = item.min;

      itineraries
        ?.sort((a, b) => a.fromTime.split(':')[0] - b.fromTime.split(':')[0])
        .map(a => {
          let itineraryFromHour = parseInt(
            a.fromTime.split(' ')[0].split(':')[0],
            10,
          );
          const itineraryFromMin = parseInt(
            a.fromTime.split(' ')[0].split(':')[1],
            10,
          );
          const itineraryFromFormat = a.fromTime.split(' ')[1];

          if (itineraryFromFormat === 'pm' && itineraryFromHour !== 12)
            itineraryFromHour += 12;
          if (itineraryFromFormat === 'am' && itineraryFromHour === 12)
            itineraryFromHour -= 12;

          const itineraryFromTime = itineraryFromHour * 60 + itineraryFromMin;

          let itineraryToHour = parseInt(
            a.toTime.split(' ')[0].split(':')[0],
            10,
          );
          const itineraryToMin = parseInt(
            a.toTime.split(' ')[0].split(':')[1],
            10,
          );
          const itineraryToFormat = a.toTime.split(' ')[1];

          if (itineraryToFormat === 'pm' && itineraryToHour !== 12)
            itineraryToHour += 12;
          if (itineraryToFormat === 'am' && itineraryToHour === 12)
            itineraryToHour -= 12;

          const itineraryToTime = itineraryToHour * 60 + itineraryToMin;

          if (itemMin >= itineraryFromTime && itemMin <= itineraryToTime) {
            temp[index] = {
              ...temp[index],
              taskName: a.taskName,
              taskColor: a.taskColor,
            };
          }
        });
    });

    setTimeData(temp);
  };

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onAddIconPress = () => {
    setTask('');
    setNote('');
    setEditTask(false);
    setIsDeleteBtn(false);
    setnewColor('#004672');
    setToHours(moment().format('h'));
    setToMinutes('00');
    setToTimeFormat(moment().format('A'));
    setFromHours(moment().format('h'));
    setFromMinutes('00');
    setFromTimeFormat(moment().format('A'));
  };

  const onItineraryPress = (item, index) => {
    setIsDeleteBtn(true);
    setItineraryIndex(index);
    setTask(item.taskName);
    setNote(item.notes);
    setnewColor(item.taskColor);
    setToHours(item.toTime.split(':')[0]);
    setToMinutes(item.toTime.split(':')[1].slice(0, 2));
    setToTimeFormat(item.toTime.split(' ')[1]);
    setFromHours(item.fromTime.split(':')[0]);
    setFromMinutes(item.fromTime.split(':')[1].slice(0, 2));
    setFromTimeFormat(item.fromTime.split(' ')[1]);
  };

  const onCheckExistingTask = async () => {
    const temp = [];
    const itineraries = [...theme.itinerary];

    let fromHourTemp = parseInt(fromHours, 10); // start time
    if (fromTimeFormat.toLowerCase() === 'pm' && fromHourTemp !== 12)
      fromHourTemp += 12;
    if (fromTimeFormat.toLowerCase() === 'am' && fromHourTemp === 12)
      fromHourTemp -= 12;
    const fromMin = fromHourTemp * 60 + parseInt(fromMinutes, 10);

    let toHourTemp = parseInt(toHours, 10); // end time
    if (toTimeFormat.toLowerCase() === 'pm' && toHourTemp !== 12)
      toHourTemp += 12;
    if (toTimeFormat.toLowerCase() === 'am' && toHourTemp === 12)
      toHourTemp -= 12;
    const toMin = toHourTemp * 60 + parseInt(toMinutes, 10);

    await itineraries
      .sort((a, b) => a.fromTime.split(':')[0] - b.fromTime.split(':')[0])
      .map(a => {
        let itineraryFromHour = parseInt(
          a.fromTime.split(' ')[0].split(':')[0],
          10,
        );
        const itineraryFromMin = parseInt(
          a.fromTime.split(' ')[0].split(':')[1],
          10,
        );
        const itineraryFromFormat = a.fromTime.split(' ')[1];

        if (itineraryFromFormat === 'pm' && itineraryFromHour !== 12)
          itineraryFromHour += 12;
        if (itineraryFromFormat === 'am' && itineraryFromHour === 12)
          itineraryFromHour -= 12;

        const itineraryFromTime = itineraryFromHour * 60 + itineraryFromMin;

        let itineraryToHour = parseInt(
          a.toTime.split(' ')[0].split(':')[0],
          10,
        );
        const itineraryToMin = parseInt(
          a.toTime.split(' ')[0].split(':')[1],
          10,
        );
        const itineraryToFormat = a.toTime.split(' ')[1];

        if (itineraryToFormat === 'pm' && itineraryToHour !== 12)
          itineraryToHour += 12;
        if (itineraryToFormat === 'am' && itineraryToHour === 12)
          itineraryToHour -= 12;

        const itineraryToTime = itineraryToHour * 60 + itineraryToMin;

        if (
          (fromMin >= itineraryFromTime && fromMin <= itineraryToTime) ||
          (toMin >= itineraryFromTime && toMin <= itineraryToTime) ||
          (itineraryFromTime >= fromMin && itineraryFromTime <= toMin) ||
          (itineraryToTime >= fromMin && itineraryToTime <= toMin)
        ) {
          temp.push(a);
        }
      });

    if (temp.length > 0) {
      setOlderTasks(temp);
      showMessage(
        'Confirmation',
        'Are you sure you want to override older task?',
      );
    } else if (editTask) {
      onEditThemeItinerary();
    } else {
      onAddThemeItinerary();
    }
  };

  const onAddThemeItinerary = async () => {
    if (task.trim()) {
      setBtnLoader(true);
      let response = false;

      const data = {
        taskName: task,
        notes: note,
        taskColor: newColor,
        toTime: `${toHours}:${toMinutes} ${toTimeFormat.toLowerCase()}`,
        fromTime: `${fromHours}:${fromMinutes} ${fromTimeFormat.toLowerCase()}`,
      };

      if (olderTasks && olderTasks.length > 0) {
        const filteredData = [...theme.itinerary].filter(b => {
          if (
            olderTasks.findIndex(
              a => a.taskName.toLowerCase() === b.taskName.toLowerCase(),
            ) > -1
          ) {
            return false;
          }
          return true;
        });

        response = await onUpdateTheme(theme.id, {
          itinerary: [...filteredData, data],
        });
      } else {
        response = await onUpdateTheme(theme.id, {
          itinerary: [...theme.itinerary, data],
        });
      }

      if (response === true) {
        setTask('');
        setNote('');
        setBtnLoader(false);
        setOlderTasks(null);
        showMessage('Success!', 'Theme updated successfully.');
      } else {
        setBtnLoader(false);
        showMessage('Error!', response);
      }
    } else {
      showMessage('Error!', 'Task name and time are required.');
    }
  };

  const onEditThemeItinerary = async () => {
    if (task.trim()) {
      setBtnLoader(true);
      let response = false;

      const data = {
        taskName: task,
        notes: note,
        taskColor: newColor,
        toTime: `${toHours}:${toMinutes} ${toTimeFormat.toLowerCase()}`,
        fromTime: `${fromHours}:${fromMinutes} ${fromTimeFormat.toLowerCase()}`,
      };

      const itinerary = [...theme.itinerary];
      itinerary[itineraryIndex] = data;

      if (olderTasks && olderTasks.length > 0) {
        const filteredData = [...itinerary].filter(b => {
          if (
            olderTasks.findIndex(
              a => a.taskName.toLowerCase() === b.taskName.toLowerCase(),
            ) > -1
          ) {
            return false;
          }
          return true;
        });

        response = await onUpdateTheme(theme.id, {
          itinerary: [...filteredData, data],
        });
      } else {
        response = await onUpdateTheme(theme.id, {
          itinerary,
        });
      }

      if (response === true) {
        setTask('');
        setNote('');
        setEditTask(false);
        setBtnLoader(false);
        setOlderTasks(null);
        showMessage('Success!', 'Theme updated successfully.');
      } else {
        setBtnLoader(false);
        showMessage('Error!', response);
      }
    } else {
      showMessage('Error!', 'Task name and time are required.');
    }
  };

  const onDonePermissionModal = async () => {
    if (olderTasks && olderTasks.length > 0) {
      if (editTask) {
        onEditThemeItinerary();
      } else {
        onAddThemeItinerary();
      }
    } else if (check === 'delete') {
      setDeleteLoader(true);

      const itinerary = [...theme.itinerary];
      itinerary.splice(itineraryIndex, 1);

      const response = await onUpdateTheme(theme.id, {
        itinerary,
      });

      if (response === true) {
        setCheck('');
        setDeleteLoader(false);
        showMessage('Success!', 'Theme updated successfully.');
      } else {
        setDeleteLoader(false);
        showMessage('Error!', response);
      }
    } else if (alertHeading === 'Success!') {
      setPermissionModal(false);
      setvisibilityEditEvent(false);
      setTimeout(() => {
        setAlertText('');
        setAlertHeading('');
      }, 500);
    } else {
      setPermissionModal(false);
      setTimeout(() => {
        setAlertText('');
        setAlertHeading('');
      }, 500);
    }
  };

  const onCancelPermissionModal = () => {
    setCheck('');
    setAlertText('');
    setOlderTasks(null);
    setAlertHeading('');
    setPermissionModal(false);
  };

  return (
    <NewDay
      {...props}
      timeData={timeData}
      setTimeData={setTimeData}
      newColor={newColor}
      setnewColor={setnewColor}
      modalHeading={modalHeading}
      setModalHeading={setModalHeading}
      btnTitle={btnTitle}
      setBtnTitle={setBtnTitle}
      visibilityEditEvent={visibilityEditEvent}
      setvisibilityEditEvent={setvisibilityEditEvent}
      visibleColorPicker={visibleColorPicker}
      setvisibleColorPicker={setvisibleColorPicker}
      onAddIconPress={onAddIconPress}
      onItineraryPress={onItineraryPress}
      onAddThemeItinerary={onCheckExistingTask}
      onEditThemeItinerary={() => {
        setEditTask(true);
        onCheckExistingTask();
      }}
      onDonePermissionModal={onDonePermissionModal}
      fromTimePickerModal={fromTimePickerModal}
      setFromTimePickerModal={setFromTimePickerModal}
      toTimePickerModal={toTimePickerModal}
      setToTimePickerModal={setToTimePickerModal}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      alertText={alertText}
      alertHeading={alertHeading}
      btnLoader={btnLoader}
      deleteLoader={deleteLoader}
      isDeleteBtn={isDeleteBtn}
      toHours={toHours}
      toMinutes={toMinutes}
      setToHours={setToHours}
      setToMinutes={setToMinutes}
      toTimeFormat={toTimeFormat}
      setToTimeFormat={setToTimeFormat}
      fromHours={fromHours}
      fromMinutes={fromMinutes}
      setFromHours={setFromHours}
      setFromMinutes={setFromMinutes}
      fromTimeFormat={fromTimeFormat}
      setFromTimeFormat={setFromTimeFormat}
      note={note}
      setNote={setNote}
      task={task}
      setTask={setTask}
      setCheck={setCheck}
      setEditTask={setEditTask}
      onCancelPermissionModal={onCancelPermissionModal}
    />
  );
}

NewDayPage.defaultProps = {
  theme: {},
};

NewDayPage.propTypes = {
  theme: PropTypes.objectOf(PropTypes.any),
  onUpdateTheme: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  theme: state.calendar?.theme,
});

const mapDispatchToProps = dispatch => ({
  onUpdateTheme: (id, data) => dispatch(editTheme(id, data)),
});

export const NewDayWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewDayPage);
