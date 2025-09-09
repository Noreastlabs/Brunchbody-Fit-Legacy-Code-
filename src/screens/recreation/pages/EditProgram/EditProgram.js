/* eslint-disable no-lonely-if */
/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { EditProgram } from '../../components';
import { wheelPickerItems } from '../../../../resources';
import { addWeekPlan, editWeekPlan } from '../../../../redux/actions';

const addExerciseOptions = [
  { id: 1, option: 'SINGLE EXERCISE' },
  { id: 2, option: 'SUPERSET' },
  { id: 3, option: 'CARDIO' },
  { id: 4, option: 'SPORT' },
  { id: 5, option: 'NOTE' },
];

const addNoteFields = [
  {
    id: 1,
    value: '',
    state: 'note',
    fieldName: 'Notes',
    placeholder: 'Notes',
    textArea: true,
  },
];

export default function EditProgramPage(props) {
  const { route, onAddWeekPlan, onEditWeekPlan, myWeekPlan, user } = props;
  // console.log('myWeekPlan: ', myWeekPlan);
  const { selectedProgram, selectedDay } = route.params;
  const [btnTitle, setBtnTitle] = useState('');
  const [heading, setHeading] = useState('');
  const [pickerItems, setPickerItems] = useState(wheelPickerItems.weeks);
  const [pickerType, setPickerType] = useState('');
  const [wheelPickerModal, setWheelPickerModal] = useState(false);
  const [supersetWheelPicker, setSupersetWheelPicker] = useState(false);
  const [showDeleteBtn, setShowDeleteBtn] = useState(true);
  const [addExerciseModal, setAddExerciseModal] = useState(false);
  const [selectedExerciseOption, setSelectedExerciseOption] =
    useState('SINGLE EXERCISE');
  const [createItemFields, setCreateItemFields] = useState([]);
  const [createExerciseModal, setCreateExerciseModal] = useState(false);
  const [singleExerciseModal, setSingleExerciseModal] = useState(false);
  const [supersetModal, setSupersetModal] = useState(false);
  const [isAddSupersetExercise, setIsAddSupersetExercise] = useState(false);
  const [cardioExeModal, setCardioExeModal] = useState(false);
  const [isDeleteBtn, setIsDeleteBtn] = useState(false);
  const [isPermissionModal, setIsPermissionModal] = useState(false);
  const [allDayPlan, setAllDayPlan] = useState([]);
  const [exercise, setExercise] = useState('');
  const [numberOfSets, setNumberOfSets] = useState('');
  const [numberOfExercises, setNumberOfExercises] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('');
  const [note, setNote] = useState('');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [btnLoader, setBtnLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [exeIndex, setExeIndex] = useState(null);
  const [check, setCheck] = useState('');
  const [supersetOptions, setSupersetOptions] = useState([]);
  const [supersetExeIndex, setSupersetExeIndex] = useState(null);
  const [met, setMet] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [mph, setMph] = useState(0);

  useEffect(() => {
    addNoteFields[0].value = '';

    if (selectedDay?.plan?.length > 0) {
      const supersetExe = selectedDay.plan.find(a => a.exercise === 'Superset');
      setSupersetOptions(supersetExe?.supersetOptions || []);
      setAllDayPlan([...selectedDay.plan] || []);
      setNote(selectedDay.note);
      addNoteFields[0].value = selectedDay.note;
    }
  }, []);

  const onChangeText = text => {
    setNote(text);
    addNoteFields[0].value = text;
  };

  const onNextBtnPress = () => {
    setIsDeleteBtn(false);
    setAddExerciseModal(false);
    if (selectedExerciseOption === 'SINGLE EXERCISE') {
      setSingleExerciseModal(true);
      setHeading('Add Exercise');
      setBtnTitle('Add');
    } else if (selectedExerciseOption === 'SUPERSET') {
      setSupersetModal(true);
      setHeading('Add Superset');
      setBtnTitle('Next');
    } else if (selectedExerciseOption === 'CARDIO') {
      setCardioExeModal(true);
      setHeading('Add Cardio');
      setBtnTitle('Add');
    } else if (selectedExerciseOption === 'SPORT') {
      setCardioExeModal(true);
      setHeading('Add Sport');
      setBtnTitle('Add');
    } else {
      setCreateExerciseModal(true);
      setHeading('Add Note');
      setBtnTitle('Add');
      setCreateItemFields(addNoteFields);
    }
  };

  const onEditExercise = (exerciseType, exerciseIndex) => {
    setExeIndex(exerciseIndex);
    setBtnTitle('Save');
    setIsDeleteBtn(true);

    const tempWeekData = myWeekPlan?.weekDays;
    const index = tempWeekData?.findIndex(a => a.day == selectedDay.day);
    const data = tempWeekData?.[index];
    const exeData = data?.plan[exerciseIndex];

    if (exerciseType === 'SINGLE EXERCISE') {
      setExercise(exeData?.exercise || allDayPlan[exerciseIndex].exercise); // When data gets from redux || when data is in the state
      setNumberOfSets(exeData?.set || allDayPlan[exerciseIndex].set);
      setAmount((exeData?.rtd || allDayPlan[exerciseIndex].rtd).split(' ')[0]);
      setUnit((exeData?.rtd || allDayPlan[exerciseIndex].rtd).split(' ')[1]);
      setMet(exeData?.met || allDayPlan[exerciseIndex].met);
      setRpm(exeData?.rpm || allDayPlan[exerciseIndex].rpm);
      setMph(exeData?.mph || allDayPlan[exerciseIndex].mph);
      setHeading('Edit Exercise');
      setSingleExerciseModal(true);
    } else if (exerciseType === 'SUPERSET') {
      setHeading('Edit Exercises');
      setIsAddSupersetExercise(true);
    } else if (
      exerciseType === 'CARDIO EXERCISE' ||
      exerciseType === 'SPORT EXERCISE'
    ) {
      setExercise(exeData?.exercise || allDayPlan[exerciseIndex].exercise);
      setAmount((exeData?.rtd || allDayPlan[exerciseIndex].rtd).split(' ')[0]);
      setUnit((exeData?.rtd || allDayPlan[exerciseIndex].rtd).split(' ')[1]);
      setMet(exeData?.met || allDayPlan[exerciseIndex].met);
      setRpm(exeData?.rpm || allDayPlan[exerciseIndex].rpm);
      setMph(exeData?.mph || allDayPlan[exerciseIndex].mph);
      setHeading(
        exerciseType === 'SPORT EXERCISE' ? 'Edit Sport' : 'Edit Cardio',
      );
      setSelectedExerciseOption(
        exerciseType === 'SPORT EXERCISE' ? 'SPORT' : 'CARDIO',
      );
      setCardioExeModal(true);
    } else {
      setNote(data?.note || note);
      addNoteFields[0].value = data?.note || note;
      setHeading('Edit Note');
      setCreateItemFields(addNoteFields);
      setCreateExerciseModal(true);
    }
  };

  const onPickerItemSelect = index => {
    if (pickerType === 'Exercise') {
      setExercise(pickerItems[index - 1].name);
      setMet(pickerItems[index - 1].met);
      setRpm(pickerItems[index - 1].rpm);
      setMph(pickerItems[index - 1].mph);
    } else if (pickerType === 'Sets') {
      setNumberOfSets(pickerItems[index - 1].value);
    } else if (pickerType === 'Number of Exercises') {
      setNumberOfExercises(pickerItems[index - 1].value);
    } else {
      setUnit(pickerItems[index - 1].unit);
    }
  };

  const onSupersetPickerSelect = async index => {
    if (supersetOptions.length >= 0) {
      if (pickerType === 'Exercise') {
        supersetOptions[supersetExeIndex] = {
          ...supersetOptions[supersetExeIndex],
          exercise: pickerItems[index - 1].name,
          met: pickerItems[index - 1].met,
          rpm: pickerItems[index - 1].rpm,
          mph: pickerItems[index - 1].mph,
        };
      } else {
        supersetOptions[supersetExeIndex] = {
          ...supersetOptions[supersetExeIndex],
          unit: pickerItems[index - 1].unit,
        };
      }
    } else if (pickerType === 'Exercise') {
      supersetOptions.push({
        exercise: pickerItems[index - 1].name,
        met: pickerItems[index - 1].met,
        rpm: pickerItems[index - 1].rpm,
        mph: pickerItems[index - 1].mph,
      });
    } else {
      supersetOptions.push({
        unit: pickerItems[index - 1].unit,
      });
    }
  };

  const supersetExeAmount = async (text, index) => {
    if (supersetOptions.length >= 0) {
      supersetOptions[index].amount = text;
    } else {
      supersetOptions.push({ amount: text });
    }
  };

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setIsPermissionModal(true);
  };

  const onAddBtnPress = () => {
    setUnit('');
    setAmount('');
    setExercise('');
    setNumberOfSets('');
    setExeIndex(null);
    addNoteFields[0].value = '';
    setAddExerciseModal(true);
  };

  const onSupersetModalBtnPress = () => {
    if (numberOfExercises && numberOfSets) {
      setBtnTitle('Add');
      setHeading('Add Exercises');
      setSupersetModal(false);
      setIsAddSupersetExercise(true);
    } else {
      showMessage('Error!', 'All fields are required.');
    }
  };

  const onAddNote = () => {
    setCreateExerciseModal(false);
  };

  const onCloseCreateNoteModal = () => {
    const tempWeekData = myWeekPlan?.weekDays;
    const index = tempWeekData?.findIndex(a => a.day == selectedDay.day);
    const data = tempWeekData?.[index];
    setNote(data?.note || note);
    addNoteFields[0].value = data?.note || note;
    setCreateExerciseModal(false);
  };

  const calorieCalculationHandler = item => {
    let calories = 0;
    const weight = parseFloat(user.weight, 10) / 2.205;
    const calPerMin = ((item?.met || met) * 3.5 * weight) / 200;

    if (item?.rpm || rpm) {
      if ((item?.unit || unit) === 'Rp') {
        const calBurnedPerRep = calPerMin / (item?.rpm || rpm);
        calories = calBurnedPerRep * (item?.amount || amount);
      } else if ((item?.unit || unit) === 'Mn') {
        calories = calPerMin * (item?.amount || amount);
      } else if ((item?.unit || unit) === 'Hr') {
        calories = calPerMin * (item?.amount || amount) * 60;
      } else if ((item?.unit || unit) === 'Sc') {
        calories = calPerMin * ((item?.amount || amount) / 60);
      } else {
        return false;
      }
    } else if (item?.mph || mph) {
      if ((item?.unit || unit) === 'mi') {
        const totalMin = ((item?.amount || amount) / (item?.mph || mph)) * 60;
        calories = totalMin * calPerMin;
      } else if ((item?.unit || unit) === 'm') {
        const amountInMiles = (item?.amount || amount) / 1609;
        const totalMin = (amountInMiles / (item?.mph || mph)) * 60;
        calories = totalMin * calPerMin;
      } else if ((item?.unit || unit) === 'km') {
        const amountInMiles = (item?.amount || amount) / 1.609;
        const totalMin = (amountInMiles / (item?.mph || mph)) * 60;
        calories = totalMin * calPerMin;
      } else if ((item?.unit || unit) === 'yd') {
        const amountInMiles = (item?.amount || amount) / 1760;
        const totalMin = (amountInMiles / (item?.mph || mph)) * 60;
        calories = totalMin * calPerMin;
      } else if ((item?.unit || unit) === 'Mn') {
        calories = calPerMin * (item?.amount || amount);
      } else if ((item?.unit || unit) === 'Hr') {
        calories = calPerMin * (item?.amount || amount) * 60;
      } else if ((item?.unit || unit) === 'Sc') {
        calories = calPerMin * ((item?.amount || amount) / 60);
      } else {
        return false;
      }
    } else {
      if ((item?.unit || unit) === 'Mn') {
        calories = calPerMin * (item?.amount || amount);
      } else if ((item?.unit || unit) === 'Hr') {
        calories = calPerMin * (item?.amount || amount) * 60;
      } else if ((item?.unit || unit) === 'Sc') {
        calories = calPerMin * ((item?.amount || amount) / 60);
      } else {
        return false;
      }
    }

    return `${calories}`;
  };

  const onAddCardioExe = async () => {
    if (exercise.trim() && amount.trim() && unit.trim()) {
      const calories = await calorieCalculationHandler();
      const type =
        selectedExerciseOption === 'SPORT'
          ? 'SPORT EXERCISE'
          : 'CARDIO EXERCISE';

      if (calories) {
        if (btnTitle === 'Save') {
          allDayPlan[exeIndex] = {
            type,
            exercise,
            met,
            rpm,
            mph,
            unit,
            amount,
            rtd: `${amount} ${unit}`,
            cal: await calorieCalculationHandler(),
          };
        } else {
          allDayPlan.push({
            type,
            exercise,
            met,
            rpm,
            mph,
            unit,
            amount,
            rtd: `${amount} ${unit}`,
            cal: await calorieCalculationHandler(),
          });
        }

        setRpm(0);
        setMph(0);
        setMet(0);
        setCardioExeModal(false);
      } else {
        showMessage(
          'Error!',
          'Please select appropriate unit for the selected exercise.',
        );
      }
    } else {
      showMessage('Error!', 'All fields are required.');
    }
  };

  const onAddSingleExercise = async () => {
    if (
      exercise.trim() &&
      numberOfSets.trim() &&
      amount.trim() &&
      unit.trim()
    ) {
      const calories = await calorieCalculationHandler();

      if (calories) {
        if (btnTitle === 'Save') {
          allDayPlan[exeIndex] = {
            type: 'SINGLE EXERCISE',
            exercise,
            met,
            rpm,
            mph,
            unit,
            amount,
            set: numberOfSets,
            rtd: `${amount} ${unit}`,
            cal: calories,
          };
        } else {
          allDayPlan.push({
            type: 'SINGLE EXERCISE',
            exercise,
            met,
            rpm,
            mph,
            unit,
            amount,
            set: numberOfSets,
            rtd: `${amount} ${unit}`,
            cal: calories,
          });
        }

        setRpm(0);
        setMph(0);
        setMet(0);
        setSingleExerciseModal(false);
      } else {
        showMessage(
          'Error!',
          'Please select appropriate unit for the selected exercise.',
        );
      }
    } else {
      showMessage('Error!', 'All fields are required.');
    }
  };

  const onAddSupersetExercises = async () => {
    const temp = supersetOptions.filter(i => i.exercise && i.unit && i.amount);

    if (
      (btnTitle === 'Save' && supersetOptions.length == temp.length) ||
      (supersetOptions.length && temp.length) == numberOfExercises
    ) {
      let checker = true;

      await supersetOptions.map(async (item, index) => {
        const calories = await calorieCalculationHandler(item);

        if (calories) {
          supersetOptions[index] = {
            ...item,
            cal: calories,
          };
        } else {
          checker = false;
          showMessage(
            'Error!',
            'Please select appropriate unit for the selected exercise.',
          );
        }
      });

      if (checker) {
        if (btnTitle === 'Save') {
          allDayPlan[exeIndex] = {
            type: 'SUPERSET',
            exercise: 'Superset',
            set: numberOfSets,
            supersetOptions,
          };
        } else {
          allDayPlan.push({
            type: 'SUPERSET',
            exercise: 'Superset',
            set: numberOfSets,
            supersetOptions,
          });
        }

        setIsAddSupersetExercise(false);
      }
    } else {
      showMessage('Error!', 'All fields are required.');
    }
  };

  const onSaveHandler = async () => {
    setBtnLoader(true);
    let response = null;

    if (myWeekPlan?.id) {
      const tempWeekData = myWeekPlan?.weekDays;
      const index = tempWeekData.findIndex(a => a.day == selectedDay.day);

      if (index >= 0) {
        tempWeekData[index].plan = allDayPlan;
        if (note) tempWeekData[index].note = note;
      }

      response = await onEditWeekPlan(selectedProgram.id, myWeekPlan.id, {
        week: myWeekPlan.week,
        weekDays:
          index >= 0
            ? tempWeekData
            : [
                ...myWeekPlan.weekDays,
                {
                  day: selectedDay.day,
                  note,
                  plan: allDayPlan,
                },
              ],
      });
    } else {
      response = await onAddWeekPlan(selectedProgram.id, {
        week: selectedDay.week,
        weekDays: [
          {
            day: selectedDay.day,
            note,
            plan: allDayPlan,
          },
        ],
      });
    }

    if (response === true) {
      setPickerType('');
      setBtnLoader(false);
      showMessage(
        'Success!',
        `Week ${myWeekPlan.week || selectedDay.week} day ${
          selectedDay.day
        } updated successfully.`,
      );
    } else {
      setBtnLoader(false);
      showMessage('Error!', response);
    }
  };

  const onDonePermissionModal = async () => {
    if (check === 'delete') {
      setDeleteLoader(true);
      if (exeIndex !== null) allDayPlan.splice(exeIndex, 1);

      const tempWeekData = myWeekPlan?.weekDays;
      const index = tempWeekData?.findIndex(a => a.day == selectedDay.day);

      if (tempWeekData && tempWeekData[index]?.plan) {
        tempWeekData[index].plan = allDayPlan;
        tempWeekData[index].note = note;

        const response = await onEditWeekPlan(
          selectedProgram.id,
          myWeekPlan.id,
          {
            week: myWeekPlan.week,
            weekDays: tempWeekData,
          },
        );

        if (response === true) {
          setCheck('');
          setDeleteLoader(false);
          setSingleExerciseModal(false);
          setIsAddSupersetExercise(false);
          setCreateExerciseModal(false);
          setCardioExeModal(false);
          showMessage(
            'Success!',
            `Week ${myWeekPlan.week} day ${selectedDay.day} updated successfully.`,
          );
        } else {
          setCheck('');
          setDeleteLoader(false);
          showMessage('Error!', response);
        }
      } else {
        setCheck('');
        setDeleteLoader(false);
        setSingleExerciseModal(false);
        setIsAddSupersetExercise(false);
        setCreateExerciseModal(false);
        setCardioExeModal(false);
        setIsPermissionModal(false);
      }
    } else {
      setCheck('');
      setIsPermissionModal(false);
      setTimeout(() => {
        setAlertText('');
        setAlertHeading('');
      }, 500);
    }
  };

  return (
    <EditProgram
      {...props}
      pickerItems={pickerItems}
      setPickerType={setPickerType}
      setPickerItems={setPickerItems}
      heading={heading}
      btnTitle={btnTitle}
      wheelPickerModal={wheelPickerModal}
      setWheelPickerModal={setWheelPickerModal}
      showDeleteBtn={showDeleteBtn}
      setShowDeleteBtn={setShowDeleteBtn}
      addExerciseOptions={addExerciseOptions}
      addExerciseModal={addExerciseModal}
      setAddExerciseModal={setAddExerciseModal}
      selectedExerciseOption={selectedExerciseOption}
      setSelectedExerciseOption={setSelectedExerciseOption}
      onNextBtnPress={onNextBtnPress}
      createExerciseModal={createExerciseModal}
      setCreateExerciseModal={setCreateExerciseModal}
      createItemFields={createItemFields}
      setCreateItemFields={setCreateItemFields}
      isAddSupersetExercise={isAddSupersetExercise}
      setIsAddSupersetExercise={setIsAddSupersetExercise}
      onEditExercise={onEditExercise}
      isDeleteBtn={isDeleteBtn}
      isPermissionModal={isPermissionModal}
      setIsPermissionModal={setIsPermissionModal}
      onAddCardioExe={onAddCardioExe}
      onPickerItemSelect={onPickerItemSelect}
      allDayPlan={allDayPlan}
      note={note}
      setNote={setNote}
      unit={unit}
      exercise={exercise}
      numberOfSets={numberOfSets}
      amount={amount}
      setAmount={setAmount}
      singleExerciseModal={singleExerciseModal}
      setSingleExerciseModal={setSingleExerciseModal}
      alertHeading={alertHeading}
      alertText={alertText}
      btnLoader={btnLoader}
      onAddSingleExercise={onAddSingleExercise}
      supersetModal={supersetModal}
      setSupersetModal={setSupersetModal}
      numberOfExercises={numberOfExercises}
      onSupersetModalBtnPress={onSupersetModalBtnPress}
      onAddBtnPress={onAddBtnPress}
      onSaveHandler={onSaveHandler}
      onDonePermissionModal={onDonePermissionModal}
      setCheck={setCheck}
      deleteLoader={deleteLoader}
      onChangeText={onChangeText}
      onAddNote={onAddNote}
      setExeIndex={setExeIndex}
      onCloseCreateNoteModal={onCloseCreateNoteModal}
      cardioExeModal={cardioExeModal}
      setCardioExeModal={setCardioExeModal}
      setSupersetExeIndex={setSupersetExeIndex}
      supersetOptions={supersetOptions}
      supersetWheelPicker={supersetWheelPicker}
      setSupersetWheelPicker={setSupersetWheelPicker}
      onSupersetPickerSelect={onSupersetPickerSelect}
      supersetExeAmount={supersetExeAmount}
      onAddSupersetExercises={onAddSupersetExercises}
      pickerContent={pickerType}
    />
  );
}

EditProgramPage.defaultProps = {
  route: {},
};

EditProgramPage.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  onAddWeekPlan: PropTypes.func.isRequired,
  myWeekPlan: PropTypes.objectOf(PropTypes.any).isRequired,
  onEditWeekPlan: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  user: state.auth?.user,
  myWeekPlan: state.recreation?.weekPlan,
  myExercises: state.exercise?.allExercises,
});

const mapDispatchToProps = dispatch => ({
  onAddWeekPlan: (id, data) => dispatch(addWeekPlan(id, data)),
  onEditWeekPlan: (id, weekId, data) =>
    dispatch(editWeekPlan(id, weekId, data)),
});

export const EditProgramWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditProgramPage);
