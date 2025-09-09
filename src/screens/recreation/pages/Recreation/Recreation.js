import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Recreation } from '../../components';
import { wheelPickerItems } from '../../../../resources';
import {
  addCompletedWorkout,
  addCustomPlan,
  addMyWorkout,
  addRoutine,
  deleteCustomPlan,
  deleteMyWorkout,
  deleteRoutine,
  editMyWorkout,
  getBrunchBodyPlans,
  getBrunchBodyWeekPlan,
  getCustomPlans,
  getExerciseDirectory,
  getExercises,
  getRoutines,
  getWeekPlans,
  getWorkouts,
  mergeExercises,
  profile,
} from '../../../../redux/actions';
import { useTodayKey } from '../../../../context/DateProvider';
import { SET_USER } from '../../../../redux/constants';
import { clampRGBA } from 'react-native-reanimated/lib/typescript/Colors';

const workoutOptionsData = [
  { id: 1, name: 'BRUNCH BODY' },
  { id: 2, name: 'CUSTOM PROGRAMS' },
];

const deleteWorkoutOptions = [
  { id: 1, option: "TODAY'S WORKOUT" },
  { id: 2, option: 'ENTIRE PROGRAM FROM CALENDAR' },
];

const sequenceOptions = [
  { id: 1, option: 'SINGLE WORKOUT' },
  { id: 2, option: 'FROM HERE FORWARD' },
];

const programMenuOptions = [
  { id: 1, option: 'MY EXERCISES' },
  { id: 2, option: 'CREATE A PLAN' },
];

const createProgramFields = [
  {
    id: 1,
    fieldName: 'Program Name',
    placeholder: 'Enter Name',
  },
  {
    id: 2,
    fieldName: 'Number of Weeks (30 Max)',
    picker: true,
    pickerLabel: 'Weeks',
    pickerContent: wheelPickerItems.weeks,
  },
];

let yearsList = [];

export default function RecreationPage(props) {
  const {
    navigation,
    myCustomPlans,
    onAddRoutine,
    myRoutines,
    getUserRoutines,
    onDeleteRoutine,
    getUserCustomPlans,
    onAddCustomPlan,
    onDeleteCustomPlan,
    onGetExercises,
    brunchBodyPlans,
    onGetBrunchBodyPlans,
    onAddMyWorkout,
    onGetMyWorkouts,
    myWorkouts,
    onDeleteWorkout,
    onEditMyWorkout,
    onGetWeekPlan,
    myWeekPlan,
    getAllExerciseDirectory,
    onMergeExercises,
    onGetBrunchBodyWeekPlan,
    updateUserProfile,
    onCompleteWorkout,
    user,
    allExercises,
    completedWorkouts,
  } = props;

  const {
    today,
    date,
    month,
    year,
    todoListDate,
    setDate,
    setMonth,
    setYear,
    setTodoListDate,
    resetToToday,
  } = useTodayKey();

  const [tab, setTab] = useState(1);
  const [loader, setLoader] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [heading, setHeading] = useState('');
  const [subText, setSubText] = useState('');
  const [screen, setScreen] = useState('');
  const [btnTitle, setBtnTitle] = useState('');
  const [program, setProgram] = useState('');
  const [selectedSequence, setSelectedSequence] = useState('SINGLE WORKOUT');
  const [createItemFields, setCreateItemFields] = useState([]);
  const [pickerItems, setPickerItems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [createItemModal, setCreateItemModal] = useState(false);
  const [wheelPickerModal, setWheelPickerModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [workoutOptions, setWorkoutOptions] = useState(workoutOptionsData);
  const [workoutModal, setWorkoutModal] = useState(false);
  const [isCreateWorkoutModal, setIsCreateWorkoutModal] = useState(false);
  const [selectedWorkoutOption, setSelectedWorkoutOption] =
    useState('BRUNCH BODY');
  const [selectedWorkout, setSelectedWorkout] = useState({});
  const [isDeleteWorkout, setIsDeleteWorkout] = useState(false);
  const [showDeleteBtn, setShowDeleteBtn] = useState(true);
  const [isProgramDetailModal, setIsProgramDetailModal] = useState(false);
  const [datePickerModal, setDatePickerModal] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [programMenuModal, setProgramMenuModal] = useState(false);
  const [programPlanLoader, setProgramPlanLoader] = useState(false);
  const [selectedProgramMenuOption, setSelectedProgramMenuOption] =
    useState('MY EXERCISES');
  const [title, setTitle] = useState('');
  const [pickerType, setPickerType] = useState('');
  const [week, setWeek] = useState('');
  const [day, setDay] = useState('');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [check, setCheck] = useState('');
  const [workouts, setWorkouts] = useState([]);

  const dispatch = useDispatch();

  const onNavigate = async () => {
    if (screen) {
      navigation.navigate(screen, { selectedItem, program });
    } else {
      setProgramPlanLoader(true);
      setIsProgramDetailModal(true);

      const allPlans = [...myCustomPlans, ...brunchBodyPlans];
      const plan = await allPlans.find(
        i => i.name.toLowerCase() === selectedItem.name.toLowerCase(),
      );

      let res = await onGetBrunchBodyWeekPlan(plan.name, selectedItem.week);

      if (res && Object.keys(res).length === 0) {
        const temp = myCustomPlans.find(i => i.id === plan.id);
        const customPlan = temp.week.find(i => i.week == selectedItem.week);
        res = customPlan;
      }

      if (res && Object.keys(res).length) {
        const temp = await res?.weekDays?.find(i => i.day == selectedItem.day);
        const newPlan = await getPlan(temp);
        setSelectedItem({ ...selectedItem, plan: newPlan });
        setProgramPlanLoader(false);
      } else {
        setSelectedItem({ ...selectedItem, plan: [] });
        setProgramPlanLoader(false);
      }
    }
  };

  useEffect(() => {
    const selectedDate = `${year}/${month}/${date}`;
    getMyWorkouts(moment(selectedDate, 'YYYY/M/D').format());
  }, [myWorkouts, user]);

  const getAllData = async () => {
    // await onGetMyWorkouts();
    // await getUserRoutines();
    // await getUserCustomPlans();
    // await getAllExerciseDirectory();
    await onGetBrunchBodyPlans();
    // await onGetExercises();
    await onMergeExercises();
  };

  useEffect(() => {
    getAllData();
    getDaysInMonth(new Date().getMonth() + 1);

    yearsList = [];

    for (let i = 0; i <= new Date().getFullYear() - 1900; i += 1) {
      yearsList.push({ id: i, value: `${1900 + i}` });
    }
  }, []);

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const getDaysInMonth = currentMonth => {
    const dt = new Date();
    const dtYear = dt.getFullYear();

    setDaysInMonth(new Date(dtYear, currentMonth, 0).getDate());
  };

  const getWeekOrDays = (createdAt, changeDate, isWeek, createdDay) => {
    const startDate = moment(createdAt).startOf('day').utc(true);
    const endDate = moment(changeDate).startOf('day').utc(true);
    const duration = moment.duration(endDate.diff(startDate));

    return isWeek
      ? Math.floor((duration.asDays() + createdDay - 1) / 7)
      : ((duration.asDays() + createdDay - 1) % 7) + 1;
  };

  const getMyWorkouts = currentDate => {
    const newDate = moment(currentDate).toDate();
    getDaysInMonth(newDate.getMonth() + 1);

    const { completedWorkouts = {}, deletedWorkouts = {} } = user;
    const d = moment(currentDate).format('YYYY-MM-DD');
    const temp = [...myWorkouts].filter(i => {
      const workoutCurrentWeek =
        parseInt(i.week, 10) +
        getWeekOrDays(
          new Date(i.createdAt), // pass Date directly
          new Date(
            newDate.getFullYear(),
            newDate.getMonth(),
            newDate.getDate(),
          ),
          true,
          parseInt(i.day, 10),
        );

      if (workoutCurrentWeek <= parseInt(i.totalWeeks, 10)) {
        if (i.sequence === 'SINGLE WORKOUT') {
          if (
            Object.keys(completedWorkouts).length &&
            completedWorkouts[i.name]?.length
          ) {
            const index = completedWorkouts[i.name].findIndex(a => a === d);
            if (index === -1) {
              return moment(i.createdAt).format('YYYY-MM-DD') === d;
            }
          } else {
            return moment(i.createdAt).format('YYYY-MM-DD') === d;
          }
        }
        if (i.sequence === 'FROM HERE FORWARD') {
          if (
            Object.keys(deletedWorkouts).length &&
            deletedWorkouts[i.name]?.length
          ) {
            const checker = deletedWorkouts[i.name].findIndex(a => a === d);
            if (checker === -1) {
              if (
                Object.keys(completedWorkouts).length &&
                completedWorkouts[i.name]?.length
              ) {
                const index = completedWorkouts[i.name].findIndex(a => a === d);
                if (index === -1)
                  return moment(i.createdAt).format('YYYY-MM-DD') <= d;
              } else {
                return moment(i.createdAt).format('YYYY-MM-DD') <= d;
              }
            }
          } else if (
            Object.keys(completedWorkouts).length &&
            completedWorkouts[i.name]?.length
          ) {
            const index = completedWorkouts[i.name].findIndex(a => a === d);
            if (index === -1)
              return moment(i.createdAt).format('YYYY-MM-DD') <= d;
          } else {
            return moment(i.createdAt).format('YYYY-MM-DD') <= d;
          }
        }
      }
    });

    setWorkouts(temp);
  };

  const onSelectWorkout = async workout => {
    const newDate = moment({ year, month: month - 1, day: date }).toDate();

    const tempWeek =
      parseInt(workout.week, 10) +
      getWeekOrDays(
        new Date(workout.createdAt),
        new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()),
        true,
        parseInt(workout.day, 10),
      );

    const tempDay = await getWeekOrDays(
      new Date(workout.createdAt),
      new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()),
      false,
      parseInt(workout.day, 10),
    );

    setSelectedItem({
      ...workout,
      week: tempWeek,
      day: tempDay,
    });

    setIsVisible(true);
  };

  const incrementDate = () => {
    setIsDateSelected(true);
    const current = new Date(year, month - 1, date);
    const prev = new Date(current);
    prev.setDate(current.getDate() + 1);
    setDate(prev.getDate());
    setMonth(prev.getMonth() + 1);
    setYear(prev.getFullYear());
    getMyWorkouts(prev);
  };

  const decrementDate = () => {
    setIsDateSelected(true);
    const current = new Date(year, month - 1, date);
    const prev = new Date(current);
    prev.setDate(current.getDate() - 1);
    setDate(prev.getDate());
    setMonth(prev.getMonth() + 1);
    setYear(prev.getFullYear());
    getMyWorkouts(prev);
  };

  const onConfirmDatePicker = parcedDate => {
    setIsDateSelected(true);
    setDatePickerModal(false);
    getMyWorkouts(parcedDate);
  };

  const onCancelDatePicker = () => {
    setIsDateSelected(false);
    setDatePickerModal(false);
    getMyWorkouts(new Date());
  };

  const onWorkoutOptionSelect = () => {
    if (selectedWorkoutOption === 'BRUNCH BODY') {
      setSubText('Select Program');
      setWorkoutOptions(brunchBodyPlans);
      setProgram('');
    } else if (selectedWorkoutOption === 'CUSTOM PROGRAMS') {
      setSubText('Select Program');
      setWorkoutOptions(myCustomPlans);
      setProgram('');
    } else {
      setWorkoutModal(false);
      setIsCreateWorkoutModal(true);
      setProgram('');
    }
  };

  const onWorkoutModalClose = () => {
    setWorkoutModal(false);
    setIsDeleteWorkout(false);
    setIsCreateWorkoutModal(false);
    setWorkoutOptions(workoutOptionsData);
    setSelectedWorkoutOption('BRUNCH BODY');
  };

  const addMyWorkoutHandler = async () => {
    setLoader(true);
    if (`${year}-${month}-${date}` < moment().format('YYYY-M-D')) {
      setLoader(false);
      showMessage('Error!', `You cannot add workouts on past dates.`);
    } else if (workouts.findIndex(i => i.name === selectedWorkoutOption) > -1) {
      setLoader(false);
      showMessage(
        'Error!',
        `You can’t add duplicate workouts on the same day.`,
      );
    } else if (week.trim() && day.trim()) {
      let res = await onGetBrunchBodyWeekPlan(selectedWorkout.name, week);
      if (!res) res = await onGetWeekPlan(selectedWorkout.id, week);
      const temp = myWeekPlan?.weekDays?.find(i => i.day == day);
      const plan = await getPlan(temp);
      const response = await onAddMyWorkout({
        day,
        week,
        plan,
        completed: [],
        deletedWorkout: [],
        name: selectedWorkout.name,
        sequence: selectedSequence,
        createdAt: moment([year, month - 1, date]).format(),
        totalWeeks: selectedWorkout?.weeks || selectedWorkout?.numOfWeeks,
      });

      if (response === true) {
        setDay('');
        setWeek('');
        setCheck('');
        setLoader(false);
        onWorkoutModalClose();
      } else {
        setCheck('');
        setLoader(false);
        showMessage('Error!', response);
      }
    } else {
      setLoader(false);
      showMessage('Error!', 'Please select day and week.');
    }
  };

  const getPlan = async temp => {
    const plan = [];

    if (temp?.plan?.length) {
      temp.plan.map(async item => {
        if (item?.supersetOptions?.length) {
          const superExe = [];

          item.supersetOptions.map(async i => {
            const exe = await allExercises.find(
              e => e.name.toLowerCase() === i.exercise.toLowerCase(),
            );
            const calories = await calorieCalculationHandler({
              ...exe,
              amount: parseInt(i.amount, 10),
              unit: i.unit,
            });

            superExe.push({ ...i, cal: calories });
          });

          plan.push({ ...item, supersetOptions: superExe });
        } else {
          const exe = await allExercises.find(
            e => e.name.toLowerCase() === item.exercise.toLowerCase(),
          );
          const calories = await calorieCalculationHandler({
            ...exe,
            amount: parseInt(item.amount, 10),
            unit: item.unit,
          });

          plan.push({ ...item, cal: calories });
        }
      });
    }

    return plan;
  };

  const calorieCalculationHandler = item => {
    let calories = 0;
    const weight = parseFloat(user.weight, 10) / 2.205;
    const calPerMin = (item?.met * 3.5 * weight) / 200;

    if (item?.rpm) {
      if (item?.unit === 'Rp') {
        const calBurnedPerRep = calPerMin / item?.rpm;
        calories = calBurnedPerRep * item?.amount;
      } else if (item?.unit === 'Mn') {
        calories = calPerMin * item?.amount;
      } else if (item?.unit === 'Hr') {
        calories = calPerMin * item?.amount * 60;
      } else if (item?.unit === 'Sc') {
        calories = calPerMin * (item?.amount / 60);
      } else {
        return false;
      }
    } else if (item?.mph) {
      if (item?.unit === 'mi') {
        const totalMin = (item?.amount / item?.mph) * 60;
        calories = totalMin * calPerMin;
      } else if (item?.unit === 'm') {
        const amountInMiles = item?.amount / 1609;
        const totalMin = (amountInMiles / item?.mph) * 60;
        calories = totalMin * calPerMin;
      } else if (item?.unit === 'km') {
        const amountInMiles = item?.amount / 1.609;
        const totalMin = (amountInMiles / item?.mph) * 60;
        calories = totalMin * calPerMin;
      } else if (item?.unit === 'yd') {
        const amountInMiles = item?.amount / 1760;
        const totalMin = (amountInMiles / item?.mph) * 60;
        calories = totalMin * calPerMin;
      } else if (item?.unit === 'Mn') {
        calories = calPerMin * item?.amount;
      } else if (item?.unit === 'Hr') {
        calories = calPerMin * item?.amount * 60;
      } else if (item?.unit === 'Sc') {
        calories = calPerMin * (item?.amount / 60);
      } else {
        return false;
      }
    } else {
      if (item?.unit === 'Mn') {
        calories = calPerMin * item?.amount;
      } else if (item?.unit === 'Hr') {
        calories = calPerMin * item?.amount * 60;
      } else if (item?.unit === 'Sc') {
        calories = calPerMin * (item?.amount / 60);
      } else {
        return false;
      }
    }

    return `${calories}`;
  };

  const onProgramMenuSelect = () => {
    if (selectedProgramMenuOption === 'MY EXERCISES') {
      setProgramMenuModal(false);
      navigation.navigate('MyExercises');
    } else {
      setProgramMenuModal(false);
      setCreateItemModal(true);
      setHeading('Create Program');
      setBtnTitle('Create');
      setProgram('Custom Program');
      setCreateItemFields(createProgramFields);
    }
  };

  const onPickerItemSelect = index => {
    if (pickerType === 'Days') {
      setDay(pickerItems[index - 1].value);
    }
    if (pickerType === 'Weeks') {
      setWeek(pickerItems[index - 1].value);
    }
  };

  const onCancelWheelPicker = () => {
    if (pickerType === 'Days') {
      setDay('');
      setWheelPickerModal(false);
    }
    if (pickerType === 'Weeks') {
      setWeek('');
      setWheelPickerModal(false);
    }
  };

  const onCreateItem = async () => {
    setLoader(true);

    let response;
    if (title.trim()) {
      if (program === 'Custom Program') {
        response = await onAddCustomPlan({
          name: title,
          numOfWeeks: week,
        });
      } else {
        response = await onAddRoutine({
          name: title,
        });
      }

      if (response === true) {
        setTitle('');
        setProgram('');
        setDay('');
        setWeek('');
        setPickerType('');
        setLoader(false);
        setCreateItemModal(false);
      } else {
        setLoader(false);
        showMessage('Error!', response);
      }
    } else {
      setLoader(false);
      showMessage('Error!', 'All fields are required.');
    }
  };

  const onMarkWorkoutComplete = async () => {
    setLoader(true);
    try {
      const completedDate = moment().format('YYYY-MM-DD');
      const week = parseInt(selectedItem?.week) || 1;
      const day = parseInt(selectedItem?.day) || 1;
      const updatedCompletedWorkouts = user?.completedWorkouts
        ? {
            ...user?.completedWorkouts,
            [selectedItem.name]: user?.completedWorkouts[selectedItem.name]
              ? [
                  ...user?.completedWorkouts[selectedItem.name],
                  moment(`${year}/${month}/${date}`, 'YYYY/MM/DD').format(
                    'YYYY-MM-DD',
                  ),
                ]
              : [
                  moment(`${year}/${month}/${date}`, 'YYYY/MM/DD').format(
                    'YYYY-MM-DD',
                  ),
                ],
          }
        : {
            [selectedItem.name]: [
              moment(`${year}/${month}/${date}`, 'YYYY/MM/DD').format(
                'YYYY-MM-DD',
              ),
            ],
          };
      dispatch({
        type: SET_USER,
        payload: { ...user, completedWorkouts: updatedCompletedWorkouts },
      });
      await onCompleteWorkout({
        ...selectedItem,
        completedDate: moment().format('YYYY-MM-DD'),
      });
      await onDeleteWorkout(selectedItem.id);
      setCheck('');
      setScreen('');
      setLoader(false);
      setIsVisible(false);
      setPermissionModal(false);
      setIsProgramDetailModal(false);
      showMessage('Success!', 'Workout completed successfully.');
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const onDeleteHandler = () => {
    if (tab === 1) {
      setIsVisible(false);
      setIsDeleteWorkout(true);
      setWorkoutOptions(deleteWorkoutOptions);
    } else setPermissionModal(true);
  };

  const onDonePermissionModal = async () => {
    if (check === 'deleteWorkout') {
      setLoader(true);
      let response;

      if (
        selectedWorkoutOption === `ENTIRE PROGRAM FROM CALENDAR` ||
        selectedItem.sequence === 'SINGLE WORKOUT'
      ) {
        response = await onDeleteWorkout(selectedItem.id);
      } else {
        // response = await onEditMyWorkout(selectedItem.id, {
        //   deletedWorkout: [
        //     ...selectedItem.deletedWorkout,
        //     moment(`${year}/${month}/${date}`).format(),
        //   ],
        // });

        response = await updateUserProfile({
          deletedWorkouts: user?.deletedWorkouts
            ? {
                ...user?.deletedWorkouts,
                [selectedItem.name]: user?.deletedWorkouts[selectedItem.name]
                  ? [
                      ...user?.deletedWorkouts[selectedItem.name],
                      moment(`${year}/${month}/${date}`).format('YYYY-MM-DD'),
                    ]
                  : [moment(`${year}/${month}/${date}`).format('YYYY-MM-DD')],
              }
            : {
                [selectedItem.name]: [
                  moment(`${year}/${month}/${date}`).format('YYYY-MM-DD'),
                ],
              },
        });
      }

      if (response === true) {
        setCheck('');
        setScreen('');
        setLoader(false);
        setIsVisible(false);
        setPermissionModal(false);
        onWorkoutModalClose();
        showMessage('Success!', 'Workout removed successfully.');
      } else {
        setCheck('');
        setScreen('');
        setLoader(false);
        showMessage('Error!', response);
      }
    } else if (screen) {
      setLoader(true);

      const response = await (screen === 'RoutineManager'
        ? onDeleteRoutine
        : onDeleteCustomPlan)(selectedItem.id);

      if (response === true) {
        setScreen('');
        setLoader(false);
        setIsVisible(false);
        setPermissionModal(false);
      } else {
        setScreen('');
        setLoader(false);
        showMessage('Error!', response);
      }
    } else {
      setCheck('');
      setScreen('');
      setPermissionModal(false);
      setTimeout(() => {
        setAlertText('');
        setAlertHeading('');
      }, 500);
    }
  };

  return (
    <Recreation
      loader={loader}
      myPlans={myCustomPlans}
      myWorkout={workouts}
      myRoutines={myRoutines}
      brunchBodyPlans={brunchBodyPlans}
      onNavigate={onNavigate}
      tab={tab}
      setTab={setTab}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      setSelectedItem={setSelectedItem}
      heading={heading}
      setHeading={setHeading}
      subText={subText}
      setSubText={setSubText}
      getWeekOrDays={getWeekOrDays}
      setScreen={setScreen}
      btnTitle={btnTitle}
      setBtnTitle={setBtnTitle}
      createItemFields={createItemFields}
      setCreateItemFields={setCreateItemFields}
      createItemModal={createItemModal}
      setCreateItemModal={setCreateItemModal}
      pickerItems={pickerItems}
      setPickerItems={setPickerItems}
      wheelPickerModal={wheelPickerModal}
      setWheelPickerModal={setWheelPickerModal}
      workoutOptions={workoutOptions}
      selectedWorkoutOption={selectedWorkoutOption}
      setSelectedWorkoutOption={setSelectedWorkoutOption}
      workoutModal={workoutModal}
      setWorkoutModal={setWorkoutModal}
      onWorkoutModalClose={onWorkoutModalClose}
      onWorkoutOptionSelect={onWorkoutOptionSelect}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      isDeleteWorkout={isDeleteWorkout}
      setIsDeleteWorkout={setIsDeleteWorkout}
      onDeleteHandler={onDeleteHandler}
      showDeleteBtn={showDeleteBtn}
      setShowDeleteBtn={setShowDeleteBtn}
      setProgram={setProgram}
      isProgramDetailModal={isProgramDetailModal}
      setIsProgramDetailModal={setIsProgramDetailModal}
      isCreateWorkoutModal={isCreateWorkoutModal}
      setIsCreateWorkoutModal={setIsCreateWorkoutModal}
      sequenceOptions={sequenceOptions}
      selectedSequence={selectedSequence}
      setSelectedSequence={setSelectedSequence}
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
      programMenuOptions={programMenuOptions}
      programMenuModal={programMenuModal}
      setProgramMenuModal={setProgramMenuModal}
      selectedProgramMenuOption={selectedProgramMenuOption}
      setSelectedProgramMenuOption={setSelectedProgramMenuOption}
      onProgramMenuSelect={onProgramMenuSelect}
      onCreateItem={onCreateItem}
      title={title}
      setTitle={setTitle}
      week={week}
      day={day}
      setPickerType={setPickerType}
      onPickerItemSelect={onPickerItemSelect}
      onCancelWheelPicker={onCancelWheelPicker}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
      incrementDate={incrementDate}
      decrementDate={decrementDate}
      daysInMonth={daysInMonth}
      addMyWorkoutHandler={addMyWorkoutHandler}
      selectedWorkout={selectedWorkout}
      setSelectedWorkout={setSelectedWorkout}
      selectedItem={selectedItem}
      workouts={workouts}
      onConfirmDatePicker={onConfirmDatePicker}
      onCancelDatePicker={onCancelDatePicker}
      setCheck={setCheck}
      onMarkWorkoutComplete={onMarkWorkoutComplete}
      programPlanLoader={programPlanLoader}
      onSelectWorkout={onSelectWorkout}
    />
  );
}

RecreationPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  myCustomPlans: PropTypes.arrayOf(PropTypes.any).isRequired,
  onAddRoutine: PropTypes.func.isRequired,
  myRoutines: PropTypes.arrayOf(PropTypes.any).isRequired,
  getUserRoutines: PropTypes.func.isRequired,
  onDeleteRoutine: PropTypes.func.isRequired,
  getUserCustomPlans: PropTypes.func.isRequired,
  onAddCustomPlan: PropTypes.func.isRequired,
  onDeleteCustomPlan: PropTypes.func.isRequired,
  onGetExercises: PropTypes.func.isRequired,
  brunchBodyPlans: PropTypes.arrayOf(PropTypes.any).isRequired,
  onGetBrunchBodyPlans: PropTypes.func.isRequired,
  onAddMyWorkout: PropTypes.func.isRequired,
  onGetMyWorkouts: PropTypes.func.isRequired,
  myWorkouts: PropTypes.arrayOf(PropTypes.any).isRequired,
  onDeleteWorkout: PropTypes.func.isRequired,
  onEditMyWorkout: PropTypes.func.isRequired,
  onGetWeekPlan: PropTypes.func.isRequired,
  myWeekPlan: PropTypes.objectOf(PropTypes.any).isRequired,
  getAllExerciseDirectory: PropTypes.func.isRequired,
  onMergeExercises: PropTypes.func.isRequired,
  onGetBrunchBodyWeekPlan: PropTypes.func.isRequired,
  updateUserProfile: PropTypes.func.isRequired,
  onCompleteWorkout: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  allExercises: PropTypes.arrayOf(PropTypes.any).isRequired,
  completedWorkouts: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  user: state.auth?.user,
  myWorkouts: state.recreation?.workouts,
  myWeekPlan: state.recreation?.weekPlan,
  myRoutines: state.recreation?.routines,
  myCustomPlans: state.recreation?.customPlans,
  brunchBodyPlans: state.recreation?.brunchBodyPlans,
  allExercises: state.exercise?.wholeExercises,
  completedWorkouts: state.recreation?.completedWorkouts,
});

const mapDispatchToProps = dispatch => ({
  onAddRoutine: data => dispatch(addRoutine(data)),
  getUserRoutines: () => dispatch(getRoutines()),
  onDeleteRoutine: data => dispatch(deleteRoutine(data)),
  getUserCustomPlans: () => dispatch(getCustomPlans()),
  onAddCustomPlan: data => dispatch(addCustomPlan(data)),
  onDeleteCustomPlan: id => dispatch(deleteCustomPlan(id)),
  onGetExercises: () => dispatch(getExercises()),
  onGetBrunchBodyPlans: () => dispatch(getBrunchBodyPlans()),
  onAddMyWorkout: data => dispatch(addMyWorkout(data)),
  onGetMyWorkouts: () => dispatch(getWorkouts()),
  onDeleteWorkout: id => dispatch(deleteMyWorkout(id)),
  onEditMyWorkout: (id, data) => dispatch(editMyWorkout(id, data)),
  onGetWeekPlan: (id, week) => dispatch(getWeekPlans(id, week)),
  getAllExerciseDirectory: () => dispatch(getExerciseDirectory()),
  onMergeExercises: () => dispatch(mergeExercises()),
  updateUserProfile: data => dispatch(profile(data)),
  onGetBrunchBodyWeekPlan: (id, week) =>
    dispatch(getBrunchBodyWeekPlan(id, week)),
  onCompleteWorkout: data => dispatch(addCompletedWorkout(data)),
});

export const RecreationWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecreationPage);
