import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { CustomModal, DatePickerModal, PermissionModal, SafeAreaWrapper, WheelPickerContent } from '../../../../components';
import {AddRemoveTheme, ClearTheme} from './modals';
import {
  addRepeatedTheme,
  addTheme,
  addCalendarTodoTask,
  changeRepeatedTheme,
  clearCurrentTheme,
  clearThemeDays,
  deleteTheme,
  deleteCalendarTodoTask,
  editRepeatedTheme,
  editCalendarTodoTask,
  getRepeatedThemes,
  setTheme,
  updateThemesWithFrequency,
} from '../../../../redux/actions';
import {
  selectCalendarClearedThemeDays,
  selectCalendarCurrentTheme,
  selectCalendarMyThemes,
  selectCalendarRepeatedTheme,
  selectCalendarThemesWithFrequency,
  selectCalendarTodoTasks,
  selectCalendarUser,
} from '../../../../redux/selectors';
import { colors, strings, wheelPickerItems } from '../../../../resources';
import CalendarUI from '../../components';
import CalendarMenu from '../../components/CalendarMenu';
import Picker from '../../components/ColorPicker';
import CreateTheme from '../../components/CreateTheme';
import EditTask from '../../components/EditTask';
import EditTodo from '../../components/EditTodo';
import ManageTheme from '../../components/ManageTheme';
import MyThemes from '../../components/MyThemes';
import styles from '../../components/style';
import Todo from '../../components/Todo';
import Writing from '../../components/Writing';
import { buildCalendarTodoSubmission } from '../../todoSubmission';
import { CALENDAR_ROUTES } from '../../../../navigation/routeNames';

let yearsList = [];
let totalDays = 0;
let currentMonthTimeStamp = new Date().getTime();

export default function CalendarPage(props) {
  const {
    user,
    navigation,
    onAddTheme,
    myThemes,
    onDeleteTheme,
    onAddCalendarTodoTask,
    onEditCalendarTodoTask,
    onDeleteCalendarTodoTask,
    calendarTodoTasks,
    onAddRepeatedTheme,
    currentTheme,
    themesWithFrequency,
    onEditRepeatedTheme,
    repeatedTheme,
    setRepeatedTheme,
    onClearCurrentTheme,
    onUpdateThemesWithFrequency,
    onGetRepeatedTheme,
    onRemoveThemeDays,
    clearedThemeDays,
  } = props;

  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [visibleEdit, setvisibleEdit] = useState(false);
  const [visibleCalendarMenu, setvisibleCalendarMenu] = useState(false);
  const [visibleMyTheme, setvisibleMyTheme] = useState(false);
  const [visibleCreateTheme, setvisibleCreateTheme] = useState(false);
  const [visibleColorPicker, setvisibleColorPicker] = useState(false);
  const [visibleManageTheme, setvisibleManageTheme] = useState(false);
  const [visibleWheelPicker, setvisibleWheelPicker] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [visibleAddRemove, setvisibleAddRemove] = useState(false);
  const [visibleClearTheme, setvisibleClearTheme] = useState(false);
  const [checked, setchecked] = useState(strings.todo.today);
  const [checkedCalendarMenu, setcheckedCalendarMenu] = useState(
    strings.calendar.theme,
  );
  const [editTask, seteditTask] = useState(false);
  const [checkedTheme, setcheckedTheme] = useState(strings.calendar.create);
  const [newColor, setnewColor] = useState(strings.calendar.defaultColor);
  const [visibleDialog, setvisibleDialog] = useState(false);
  const [datePickerModal, setDatePickerModal] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [date, setDate] = useState(new Date().getDate());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [permissionModal, setPermissionModal] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [name, setName] = useState('');
  const [taskName, settaskName] = useState('');
  const [taskDay, settaskDay] = useState('');
  const [taskNotes, settaskNotes] = useState('');
  const [todoTask, setTodoTask] = useState({});
  const [frequency, setFrequency] = useState('');
  const [clearDays, setClearDays] = useState('');
  const [pickerItems, setPickerItems] = useState([]);
  const [todoModalHeading, setTodoModalHeading] = useState('');
  const [frequencyThemes, setFrequencyThemes] = useState('');
  const [check, setCheck] = useState('');
  const [daysToFollow, setDaysToFollow] = useState('');
  const [todoListDate, setTodoListDate] = useState(
    moment().format('YYYY-MM-DD'),
  );

  const onCancelWheelPicker = () => {
    setFrequency('');
    setClearDays('');
    setvisibleWheelPicker(false);
  };
  const hideColorPicker = () => {
    setvisibleColorPicker(false);
    setvisibleCreateTheme(true);
  };
  const showAddRemoveTheme = () => {
    setvisibleMyTheme(false);
    setvisibleAddRemove(true);
  };

  const hideModal = () => {
    setVisible(false);
    seteditTask(false);
    setchecked('');
  };

  const showModal = task => {
    setVisible(true);
    setTodoTask(task);
    seteditTask(true);
    settaskName(task.name);
    settaskDay(task.day);
    settaskNotes(task.notes);
    setDate(new Date(task.day).getDate());
    setMonth(new Date(task.day).getMonth() + 1);
    setYear(new Date(task.day).getFullYear());
    if (task.day !== '' && task.day === strings.todo.someday) {
      setchecked(strings.todo.someday);
    } else if (task.day !== '' && task.day !== strings.todo.someday)
      setchecked('Pick a day');
    else setchecked('');
  };

  const openEditModal = heading => {
    if (heading === 'Add To Do') {
      settaskName('');
      settaskDay('');
      settaskNotes('');
      setDate(new Date().getDate());
      setMonth(new Date().getMonth() + 1);
      setYear(new Date().getFullYear());
    }
    setVisible(false);
    setvisibleEdit(true);
    setvisibleCalendarMenu(false);
    setTodoModalHeading(heading);
  };

  const hideEditModal = () => {
    setvisibleEdit(false);
    setchecked('');
    seteditTask(false);
    setchecked('');
  };

  const showMyTheme = () => {
    setvisibleCalendarMenu(false);
    setvisibleMyTheme(true);
  };

  const checkFirst = () => {
    settaskDay(strings.calendar.someday);
    setchecked(strings.calendar.someday);
  };
  const checkSecond = () => {
    settaskDay(`${date}/${month}/${year}`);
    setchecked(strings.calendar.pickday);
  };
  const hideManageTheme = () => {
    setvisibleManageTheme(false);
    setIsRemove(false);
    setSelectedTheme(null);
    setDisabled(true);
  };
  const showCreateTheme = () => {
    setvisibleMyTheme(false);
    setvisibleCreateTheme(true);
  };
  const showManageTheme = () => {
    setvisibleMyTheme(false);
    setvisibleManageTheme(true);
  };
  const showClearTheme = () => {
    setvisibleMyTheme(false);
    setvisibleClearTheme(true);
  };
  const checkTheme = () => setcheckedCalendarMenu(strings.calendar.theme);
  const checkTodo = () => setcheckedCalendarMenu(strings.calendar.todo);
  const openThemeModal = () => {
    if (checkedTheme === strings.calendar.create) showCreateTheme();
    else if (checkedTheme === strings.calendar.manage) showManageTheme();
    else if (checkedTheme === strings.calendar.addRemove) showAddRemoveTheme();
    else showClearTheme();
  };
  const showColorPicker = () => {
    setvisibleCreateTheme(false);
    setvisibleColorPicker(true);
  };

  const getAllData = async () => {
    await onGetRepeatedTheme();
  };

  useEffect(() => {
    getAllData();

    yearsList = [];

    for (let i = 0; i <= year - 1900; i += 1) {
      yearsList.push({ id: i, value: `${1900 + i}` });
    }
  }, []);

  useEffect(() => {
    let temp = {};

    if (clearedThemeDays && Object.keys(clearedThemeDays).length > 0) {
      Object.keys(themesWithFrequency).map(item => {
        const itemDate = themesWithFrequency[item]?.theme?.createdOn;
        const itemDay = moment(item).format('dddd');

        if (clearedThemeDays['Entire Calenda']) {
          if (itemDate > clearedThemeDays['Entire Calenda']) {
            temp[item] = themesWithFrequency[item];
          }
        } else if (
          !clearedThemeDays[itemDay] ||
          itemDate > clearedThemeDays[itemDay]
        ) {
          temp[item] = themesWithFrequency[item];
        }
      });
    } else {
      temp = themesWithFrequency;
    }

    if (!temp[moment().format('YYYY-MM-DD')]) {
      onClearCurrentTheme();

      temp[moment().format('YYYY-MM-DD')] = {
        selected: true,
        customStyles: {
          container: {
            borderWidth: 2,
            borderColor: colors.secondary,
            backgroundColor: colors.secondary,
          },
        },
      };
    }

    setFrequencyThemes(temp);
  }, [themesWithFrequency, user, clearedThemeDays]);

  const onMonthChange = mon => {
    if (currentMonthTimeStamp < mon.timestamp) {
      currentMonthTimeStamp = mon.timestamp;
      const daysInMonth = new Date(mon.year, mon.month, 0).getDate();
      totalDays += daysInMonth;
      onUpdateThemesWithFrequency(totalDays);
    } else if (new Date().getTime() < mon.timestamp) {
      currentMonthTimeStamp = mon.timestamp;
      const daysInMonth = new Date(mon.year, mon.month + 1, 0).getDate();
      totalDays -= daysInMonth;
      onUpdateThemesWithFrequency(totalDays);
    } else {
      currentMonthTimeStamp = new Date().getTime();
      totalDays = 0;
      onUpdateThemesWithFrequency(0);
    }
  };

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onSaveEditModal = async () => {
    const todoSubmission = buildCalendarTodoSubmission({
      taskName,
      taskNotes,
      taskDay,
      year,
      month,
      date,
    });

    if (todoSubmission) {
      setBtnLoader(true);

      const response = await onAddCalendarTodoTask(todoSubmission);

      if (response === true) {
        settaskName('');
        settaskDay('');
        settaskNotes('');
        setBtnLoader(false);
        setvisibleEdit(false);
        setchecked('');
        setIsDateSelected(false);
        setTodoModalHeading('Edit To Do');
        showMessage('Success!', 'Todo added successfully.');
      } else {
        setBtnLoader(false);
        setTodoModalHeading('Edit To Do');
        showMessage('Error!', response);
      }
    } else {
      setBtnLoader(false);
      showMessage('Error!', 'Task name and time are required.');
    }
  };

  const onUpdateTodo = async () => {
    setTodoModalHeading('Edit To Do');
    const todoSubmission = buildCalendarTodoSubmission({
      taskName,
      taskNotes,
      taskDay,
      year,
      month,
      date,
    });

    if (todoSubmission) {
      setBtnLoader(true);

      const response = await onEditCalendarTodoTask(todoTask.id, todoSubmission);

      if (response === true) {
        settaskName('');
        settaskDay('');
        settaskNotes('');
        setBtnLoader(false);
        setvisibleEdit(false);
        setchecked('');
        setIsDateSelected(false);
        showMessage('Success!', 'Todo edited successfully.');
      } else {
        setBtnLoader(false);
        showMessage('Error!', response);
      }
    } else {
      setBtnLoader(false);
      showMessage('Error!', 'Task name and time are required.');
    }
  };

  const onClearTodo = async () => {
    setDeleteLoader(true);
    const response = await onDeleteCalendarTodoTask(todoTask.id);

    if (response === true) {
      setDeleteLoader(false);
      setvisibleDialog(false);
      hideEditModal();
      showMessage('Success!', `Todo removed successfully.`);
    } else {
      setDeleteLoader(false);
      setvisibleDialog(false);
      showMessage('Error!', response);
    }
  };

  const onCreateTheme = async () => {
    if (name.trim()) {
      setBtnLoader(true);

      const index = myThemes.findIndex(i => i.name === name);

      if (index === -1) {
        const response = await onAddTheme({
          name,
          itinerary: [],
          color: newColor,
          deletedThemes: [],
        });

        if (response === true) {
          setName('');
          setBtnLoader(false);
          setvisibleCreateTheme(false);
          navigation.navigate(CALENDAR_ROUTES.NEW_DAY);
        } else {
          setBtnLoader(false);
          showMessage('Error!', response);
        }
      } else {
        setBtnLoader(false);
        showMessage(
          'Error!',
          'Theme with the given name already exist. Please enter a different theme name.',
        );
      }
    } else {
      setBtnLoader(false);
      showMessage('Error!', 'All fields are required.');
    }
  };

  const addRepeatedThemeHandler = async () => {
    if (!daysToFollow.trim() && frequency !== 'Never') {
      showMessage('Error!', 'Please enter duration.');
      setDaysToFollow('');
    } else if (frequency.trim()) {
      setBtnLoader(true);

      const duration =
        frequency === 'Daily'
          ? parseInt(daysToFollow, 10)
          : frequency === 'Weekly'
          ? parseInt(daysToFollow, 10) * 7 - 1
          : frequency === 'BiWeekly'
          ? parseInt(daysToFollow, 10) * 14 - 1
          : frequency === 'Monthly'
          ? parseInt(daysToFollow, 10) * 30 - 1
          : 1;

      const themeData = { ...selectedTheme };
      // delete selectedTheme.id;
      console.log('themeData', themeData);
      const response = await onAddRepeatedTheme({
        ...themeData,
        frequency,
        daysToFollow: `${duration}`,
        createdOn: new Date().getTime(),
        themeDay: moment(`${year}/${month}/${date}`, 'YYYY/MM/DD').format(),
      });

      if (response === true) {
        setFrequency('');
        setDaysToFollow('');
        setDisabled(true);
        setBtnLoader(false);
        setSelectedTheme(null);
        showMessage('Success!', 'Theme added to calendar successfully.');
      } else {
        setBtnLoader(false);
        showMessage('Error!', response);
      }
    } else {
      showMessage('Error!', 'Please select frequency.');
    }
  };

  const onRemoveTheme = async id => {
    setLoader(true);
    const response = await onDeleteTheme(id);

    if (response === true) {
      setLoader(false);
      showMessage('Success!', `Theme removed successfully.`);
    } else {
      setLoader(false);
      showMessage('Error!', response);
    }
  };

  const onCloseAddRemoveThemeModal = () => {
    setFrequency('');
    setDaysToFollow('');
    setDisabled(true);
    setSelectedTheme(null);
    setvisibleAddRemove(false);
    setDate(new Date().getDate());
    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());

    if (
      frequencyThemes[
        moment(
          `${new Date().getFullYear()}/${
            new Date().getMonth() + 1
          }/${new Date().getDate()}`,
        ).format('YYYY-MM-DD')
      ]?.theme
    ) {
      setRepeatedTheme(
        frequencyThemes[
          moment(
            `${new Date().getFullYear()}/${
              new Date().getMonth() + 1
            }/${new Date().getDate()}`,
          ).format('YYYY-MM-DD')
        ].theme,
      );
    } else {
      setRepeatedTheme('');
    }
  };

  const onEditTheme = async () => {
    setIsRemove(false);
    setDisabled(true);
    setvisibleManageTheme(false);
    await dispatch(setTheme(selectedTheme));
    navigation.navigate(CALENDAR_ROUTES.NEW_DAY);
    setSelectedTheme(null);
  };

  const onDonePermissionModal = async () => {
    if (check === 'clearTheme') {
      setDeleteLoader(true);
      let data = [];

      if (repeatedTheme.deletedThemes?.length > 0) {
        data = [
          ...repeatedTheme.deletedThemes,
          moment(`${year}/${month}/${date}`, 'YYYY/MM/DD').format(),
        ];
      } else {
        data = [moment(`${year}/${month}/${date}`, 'YYYY/MM/DD').format()];
      }

      const response = await onEditRepeatedTheme(repeatedTheme.id, {
        deletedThemes: data,
      });

      if (response === true) {
        setCheck('');
        setDeleteLoader(false);
        showMessage('Success!', 'Current theme removed successfully.');
      } else {
        setCheck('');
        setDeleteLoader(false);
        showMessage('Error!', response);
      }
    } else if (alertHeading === 'Success!') {
      setvisibleCreateTheme(false);
      setvisibleAddRemove(false);
      setPermissionModal(false);
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

  const onConfirmDatePicker = () => {
    if (check === 'changeRepeatedTheme') {
      setIsDateSelected(true);
      setDatePickerModal(false);
      if (
        frequencyThemes[moment(`${year}/${month}/${date}`, 'YYYY/MM/DD').format('YYYY-MM-DD')]
          ?.theme
      ) {
        setRepeatedTheme(
          frequencyThemes[
            moment(`${year}/${month}/${date}`, 'YYYY/MM/DD').format('YYYY-MM-DD')
          ].theme,
        );
      } else {
        setRepeatedTheme('');
      }
      setCheck('');
    } else {
      setIsDateSelected(true);
      setDatePickerModal(false);
    }
  };

  const onClearThemeDays = async () => {
    if (alertHeading === 'Success!') {
      setvisibleCreateTheme(false);
      setvisibleAddRemove(false);
      setPermissionModal(false);
      setTimeout(() => {
        setAlertText('');
        setAlertHeading('');
      }, 500);
    } else {
      setDeleteLoader(true);
      const day = clearDays.slice(0, clearDays.length - 1);

      const response = await onRemoveThemeDays({
        ...clearedThemeDays,
        [day]: new Date().getTime(),
      });

      if (response === true) {
        setCheck('');
        setDeleteLoader(false);
        showMessage('Success!', 'Selected theme days removed successfully.');
      } else {
        setCheck('');
        setDeleteLoader(false);
        showMessage('Error!', response);
      }
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headingView}>
          <Text style={styles.headingText}>Calendar</Text>
        </View>

        <CalendarUI
          {...props}
          frequencyThemes={frequencyThemes}
          onMonthChange={onMonthChange}
          setTodoListDate={setTodoListDate}
        />

        <Writing
          navigation={navigation}
          currentTheme={currentTheme}
          showCalendarMenu={() => setvisibleCalendarMenu(true)}
        />

        <Todo
          tasks={calendarTodoTasks}
          showModal={showModal}
          todoListDate={todoListDate}
        />
      </ScrollView>

      <EditTask
        visible={visible}
        todoTask={todoTask}
        hideModal={hideModal}
        openEditModal={() => openEditModal('Edit To Do')}
      />

      <EditTodo
        visibleEdit={visibleEdit}
        hideEditModal={hideEditModal}
        checked={checked}
        checkFirst={checkFirst}
        checkSecond={checkSecond}
        datePickerModal={datePickerModal}
        setDatePickerModal={setDatePickerModal}
        yearsList={yearsList}
        date={date}
        setDate={setDate}
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
        isDateSelected={isDateSelected}
        setIsDateSelected={setIsDateSelected}
        settaskName={settaskName}
        settaskDay={settaskDay}
        settaskNotes={settaskNotes}
        onSaveEditModal={onSaveEditModal}
        editTask={editTask}
        todoTask={todoTask}
        onUpdateTodo={onUpdateTodo}
        visibleDialog={visibleDialog}
        setvisibleDialog={setvisibleDialog}
        onDeleteTodo={onClearTodo}
        loader={btnLoader}
        deleteLoader={deleteLoader}
        heading={todoModalHeading}
      />

      <CalendarMenu
        visibleCalendarMenu={visibleCalendarMenu}
        showCalendarMenu={() => setvisibleCalendarMenu(true)}
        hideCalendarMenu={() => setvisibleCalendarMenu(false)}
        openEditModal={() => openEditModal('Add To Do')}
        checkedCalendarMenu={checkedCalendarMenu}
        checkTheme={checkTheme}
        checkTodo={checkTodo}
        showMyTheme={showMyTheme}
      />

      <MyThemes
        setTheme={setcheckedTheme}
        checkedTheme={checkedTheme}
        hideMyTheme={() => setvisibleMyTheme(false)}
        visibleMyTheme={visibleMyTheme}
        showCreateTheme={showCreateTheme}
        openThemeModal={openThemeModal}
      />

      <CreateTheme
        loader={btnLoader}
        newColor={newColor}
        value={name}
        onChangeText={text => setName(text)}
        onCreateTheme={onCreateTheme}
        hideCreateTheme={() => setvisibleCreateTheme(false)}
        showColorPicker={showColorPicker}
        visibleCreateTheme={visibleCreateTheme}
      />

      <Picker
        visibleColorPicker={visibleColorPicker}
        hideColorPicker={hideColorPicker}
        closeColorPicker={() => setvisibleColorPicker(false)}
        newColor={newColor}
        changeColor={color => setnewColor(color)}
      />

      <ManageTheme
        hideManageTheme={hideManageTheme}
        visibleManageTheme={visibleManageTheme}
        isRemove={isRemove}
        setIsRemove={setIsRemove}
        onPressDone={() => setIsRemove(false)}
        themeOptions={myThemes}
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        disabled={disabled}
        setDisabled={setDisabled}
        loader={loader}
        onRemoveTheme={onRemoveTheme}
        onEditTheme={onEditTheme}
      />

      <CustomModal
        isVisible={visibleAddRemove}
        onDismiss={onCloseAddRemoveThemeModal}
        content={
          <AddRemoveTheme
            date={date}
            month={month}
            year={year}
            currentTheme={repeatedTheme}
            frequency={frequency}
            themeOptions={myThemes}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            hideModal={onCloseAddRemoveThemeModal}
            btnLoader={btnLoader}
            onBtnPress={addRepeatedThemeHandler}
            showWheelPicker={() => {
              setvisibleWheelPicker(true);
              setPickerItems(wheelPickerItems.frequency);
            }}
            isDateSelected={isDateSelected}
            setDatePickerModal={setDatePickerModal}
            disabled={disabled}
            setDisabled={setDisabled}
            setCheck={setCheck}
            setPermissionModal={setPermissionModal}
            daysToFollow={daysToFollow}
            setDaysToFollow={setDaysToFollow}
          />
        }
      />

      <CustomModal
        isVisible={visibleClearTheme}
        onDismiss={() => setvisibleClearTheme(false)}
        content={
          <ClearTheme
            clearDays={clearDays}
            hideModal={() => setvisibleClearTheme(false)}
            btnLoader={btnLoader}
            onBtnPress={() => setvisibleClearTheme(false)}
            showWheelPicker={() => {
              setvisibleWheelPicker(true);
              setPickerItems(wheelPickerItems.calendarDays);
            }}
            setPermissionModal={() => setPermissionModal(true)}
          />
        }
      />

      <CustomModal
        isVisible={datePickerModal}
        onDismiss={() => setDatePickerModal(false)}
        content={
          <DatePickerModal
            {...props}
            yearsList={yearsList}
            date={date}
            setDate={setDate}
            month={month}
            setMonth={setMonth}
            year={year}
            setYear={setYear}
            onConfirm={onConfirmDatePicker}
            onCancel={() => {
              setIsDateSelected(false);
              setDatePickerModal(false);
            }}
          />
        }
      />

      <CustomModal
        isVisible={visibleWheelPicker}
        onDismiss={() => setvisibleWheelPicker(false)}
        content={
          <WheelPickerContent
            pickerItems={pickerItems}
            onValueChange={index => {
              (visibleClearTheme ? setClearDays : setFrequency)(
                pickerItems[index - 1].value,
              );
            }}
            onConfirm={() => setvisibleWheelPicker(false)}
            onCancel={onCancelWheelPicker}
          />
        }
      />

      <CustomModal
        isVisible={permissionModal}
        onDismiss={() => setPermissionModal(false)}
        content={
          <PermissionModal
            loader={btnLoader || deleteLoader}
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={
              visibleClearTheme ? onClearThemeDays : onDonePermissionModal
            }
            onCancel={() => setPermissionModal(false)}
          />
        }
      />
    </SafeAreaWrapper>
  );
}

CalendarPage.defaultProps = {
  currentTheme: {},
};

CalendarPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  onAddTheme: PropTypes.func.isRequired,
  myThemes: PropTypes.arrayOf(PropTypes.any).isRequired,
  onDeleteTheme: PropTypes.func.isRequired,
  onAddCalendarTodoTask: PropTypes.func.isRequired,
  onEditCalendarTodoTask: PropTypes.func.isRequired,
  onDeleteCalendarTodoTask: PropTypes.func.isRequired,
  calendarTodoTasks: PropTypes.arrayOf(PropTypes.any).isRequired,
  onAddRepeatedTheme: PropTypes.func.isRequired,
  themesWithFrequency: PropTypes.objectOf(PropTypes.any).isRequired,
  currentTheme: PropTypes.objectOf(PropTypes.any),
  onEditRepeatedTheme: PropTypes.func.isRequired,
  repeatedTheme: PropTypes.objectOf(PropTypes.any).isRequired,
  setRepeatedTheme: PropTypes.func.isRequired,
  onClearCurrentTheme: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  onUpdateThemesWithFrequency: PropTypes.func.isRequired,
  onGetRepeatedTheme: PropTypes.func.isRequired,
  onRemoveThemeDays: PropTypes.func.isRequired,
  clearedThemeDays: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  user: selectCalendarUser(state),
  calendarTodoTasks: selectCalendarTodoTasks(state),
  myThemes: selectCalendarMyThemes(state),
  currentTheme: selectCalendarCurrentTheme(state),
  repeatedTheme: selectCalendarRepeatedTheme(state),
  themesWithFrequency: selectCalendarThemesWithFrequency(state),
  clearedThemeDays: selectCalendarClearedThemeDays(state),
});

const mapDispatchToProps = dispatch => ({
  onAddTheme: data => dispatch(addTheme(data)),
  onDeleteTheme: id => dispatch(deleteTheme(id)),
  onAddCalendarTodoTask: data => dispatch(addCalendarTodoTask(data)),
  onEditCalendarTodoTask: (id, data) =>
    dispatch(editCalendarTodoTask(id, data)),
  onDeleteCalendarTodoTask: id => dispatch(deleteCalendarTodoTask(id)),
  onGetRepeatedTheme: () => dispatch(getRepeatedThemes()),
  onAddRepeatedTheme: data => dispatch(addRepeatedTheme(data)),
  onEditRepeatedTheme: (id, data) => dispatch(editRepeatedTheme(id, data)),
  setRepeatedTheme: data => dispatch(changeRepeatedTheme(data)),
  onClearCurrentTheme: () => dispatch(clearCurrentTheme()),
  onUpdateThemesWithFrequency: val => dispatch(updateThemesWithFrequency(val)),
  onRemoveThemeDays: data => dispatch(clearThemeDays(data)),
});

export const CalendarWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CalendarPage);
