/* eslint-disable no-lonely-if */
/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-props-no-spreading */
import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {EditProgram} from '../../components';
import {wheelPickerItems} from '../../../../resources';
import {addWeekPlan, editWeekPlan} from '../../../../redux/actions';

const addExerciseOptions = [
  {id: 1, option: 'SINGLE EXERCISE'},
  {id: 2, option: 'SUPERSET'},
  {id: 3, option: 'CARDIO'},
  {id: 4, option: 'SPORT'},
  {id: 5, option: 'NOTE'},
];

const getNoteFields = note => [
  {
    id: 1,
    value: note,
    state: 'note',
    fieldName: 'Notes',
    placeholder: 'Notes',
    textArea: true,
    helperText: 'Add an optional note for this day.',
  },
];

const isFiniteDecimal = value => {
  if (value.trim() === '') {
    return false;
  }

  return Number.isFinite(Number(value));
};

const createSupersetDraft = (count, existingOptions = []) =>
  Array.from({length: Number(count) || 0}, (_, index) => {
    const option = existingOptions[index] || {};

    return {
      exercise: option.exercise || '',
      amount:
        option.amount === undefined || option.amount === null
          ? ''
          : `${option.amount}`,
      unit: option.unit || '',
      met: option.met || 0,
      rpm: option.rpm || 0,
      mph: option.mph || 0,
      cal: option.cal,
    };
  });

const clonePlanEntry = item => ({
  ...item,
  amount:
    item?.amount === undefined || item?.amount === null
      ? item?.amount
      : `${item.amount}`,
  supersetOptions: item?.supersetOptions?.map(option => ({
    ...option,
    amount:
      option?.amount === undefined || option?.amount === null
        ? option?.amount
        : `${option.amount}`,
  })),
});

export default function EditProgramPage(props) {
  const {route, onAddWeekPlan, onEditWeekPlan, myWeekPlan, user} = props;
  const {selectedProgram, selectedDay} = route.params;
  const [btnTitle, setBtnTitle] = useState('');
  const [heading, setHeading] = useState('');
  const [pickerItems, setPickerItems] = useState(wheelPickerItems.weeks);
  const [pickerType, setPickerType] = useState('');
  const [wheelPickerModal, setWheelPickerModal] = useState(false);
  const [supersetWheelPicker, setSupersetWheelPicker] = useState(false);
  const [addExerciseModal, setAddExerciseModal] = useState(false);
  const [selectedExerciseOption, setSelectedExerciseOption] =
    useState('SINGLE EXERCISE');
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
  const [singleExerciseFieldErrors, setSingleExerciseFieldErrors] =
    useState({});
  const [singleExerciseFormErrorText, setSingleExerciseFormErrorText] =
    useState('');
  const [singleExercisePending, setSingleExercisePending] = useState(false);
  const [cardioFieldErrors, setCardioFieldErrors] = useState({});
  const [cardioFormErrorText, setCardioFormErrorText] = useState('');
  const [cardioPending, setCardioPending] = useState(false);
  const [supersetSetupFieldErrors, setSupersetSetupFieldErrors] = useState({});
  const [supersetSetupFormErrorText, setSupersetSetupFormErrorText] =
    useState('');
  const [supersetSetupPending, setSupersetSetupPending] = useState(false);
  const [supersetFieldErrors, setSupersetFieldErrors] = useState([]);
  const [supersetItemsFormErrorText, setSupersetItemsFormErrorText] =
    useState('');
  const [supersetItemsPending, setSupersetItemsPending] = useState(false);
  const entryActionLockRef = useRef(false);
  const createItemFields = getNoteFields(note);

  useEffect(() => {
    setAllDayPlan((selectedDay?.plan || []).map(clonePlanEntry));
    setSupersetOptions([]);
    setNote(selectedDay.note || '');
  }, [selectedDay]);

  const getCurrentDayData = () => {
    const tempWeekData = myWeekPlan?.weekDays || [];
    const index = tempWeekData.findIndex(item => item.day == selectedDay.day);

    return {
      tempWeekData,
      index,
      data: index >= 0 ? tempWeekData[index] : undefined,
    };
  };

  const getPersistedNote = () => getCurrentDayData().data?.note || selectedDay.note || '';

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setIsPermissionModal(true);
  };

  const clearEntryActionLock = () => {
    entryActionLockRef.current = false;
  };

  const resetExerciseDraft = () => {
    setExercise('');
    setNumberOfSets('');
    setAmount('');
    setUnit('');
    setMet(0);
    setRpm(0);
    setMph(0);
  };

  const resetSingleExerciseValidation = (clearLock = true) => {
    if (clearLock) {
      clearEntryActionLock();
    }
    setSingleExercisePending(false);
    setSingleExerciseFieldErrors({});
    setSingleExerciseFormErrorText('');
  };

  const resetCardioValidation = (clearLock = true) => {
    if (clearLock) {
      clearEntryActionLock();
    }
    setCardioPending(false);
    setCardioFieldErrors({});
    setCardioFormErrorText('');
  };

  const resetSupersetSetupValidation = () => {
    clearEntryActionLock();
    setSupersetSetupPending(false);
    setSupersetSetupFieldErrors({});
    setSupersetSetupFormErrorText('');
  };

  const resetSupersetItemsValidation = (clearLock = true) => {
    if (clearLock) {
      clearEntryActionLock();
    }
    setSupersetItemsPending(false);
    setSupersetFieldErrors([]);
    setSupersetItemsFormErrorText('');
  };

  const closeSingleExerciseModal = () => {
    resetSingleExerciseValidation();
    setSingleExerciseModal(false);
    resetExerciseDraft();
    setIsDeleteBtn(false);
    setExeIndex(null);
  };

  const closeCardioExerciseModal = () => {
    resetCardioValidation();
    setCardioExeModal(false);
    resetExerciseDraft();
    setIsDeleteBtn(false);
    setExeIndex(null);
  };

  const closeSupersetSetupModal = () => {
    resetSupersetSetupValidation();
    setSupersetModal(false);
    setNumberOfExercises('');
    setNumberOfSets('');
  };

  const closeSupersetItemsModal = () => {
    resetSupersetItemsValidation();
    setIsAddSupersetExercise(false);
    setSupersetWheelPicker(false);
    setSupersetExeIndex(null);
    setSupersetOptions([]);
    setNumberOfExercises('');
    setNumberOfSets('');
    setIsDeleteBtn(false);
    setExeIndex(null);
  };

  const onCloseCreateNoteModal = () => {
    setCreateExerciseModal(false);
    setNote(getPersistedNote());
    setIsDeleteBtn(false);
    setExeIndex(null);
  };

  const closePermissionModal = () => {
    if (deleteLoader) {
      return;
    }

    setCheck('');
    setIsPermissionModal(false);
    setTimeout(() => {
      setAlertText('');
      setAlertHeading('');
    }, 500);
  };

  const clearSingleExerciseError = fieldName => {
    setSingleExerciseFieldErrors(currentErrors => ({
      ...currentErrors,
      [fieldName]: '',
    }));
    setSingleExerciseFormErrorText('');
  };

  const clearCardioError = fieldName => {
    setCardioFieldErrors(currentErrors => ({
      ...currentErrors,
      [fieldName]: '',
    }));
    setCardioFormErrorText('');
  };

  const clearSupersetSetupError = fieldName => {
    setSupersetSetupFieldErrors(currentErrors => ({
      ...currentErrors,
      [fieldName]: '',
    }));
    setSupersetSetupFormErrorText('');
  };

  const clearSupersetRowError = (index, fieldName) => {
    setSupersetFieldErrors(currentErrors => {
      const nextErrors = [...currentErrors];
      nextErrors[index] = {
        ...(nextErrors[index] || {}),
        [fieldName]: '',
      };
      return nextErrors;
    });
    setSupersetItemsFormErrorText('');
  };

  const onSingleAmountChange = text => {
    setAmount(text);
    clearSingleExerciseError('amount');
  };

  const onCardioAmountChange = text => {
    setAmount(text);
    clearCardioError('amount');
  };

  const onAddBtnPress = () => {
    resetSingleExerciseValidation();
    resetCardioValidation();
    resetSupersetSetupValidation();
    resetSupersetItemsValidation();
    resetExerciseDraft();
    setSelectedExerciseOption('SINGLE EXERCISE');
    setHeading('');
    setBtnTitle('');
    setIsDeleteBtn(false);
    setExeIndex(null);
    setSupersetOptions([]);
    setNumberOfExercises('');
    setNumberOfSets('');
    setAddExerciseModal(true);
  };

  const onNextBtnPress = () => {
    setIsDeleteBtn(false);
    setAddExerciseModal(false);

    if (selectedExerciseOption === 'SINGLE EXERCISE') {
      resetExerciseDraft();
      resetSingleExerciseValidation();
      setHeading('Add Exercise');
      setBtnTitle('Add');
      setSingleExerciseModal(true);
    } else if (selectedExerciseOption === 'SUPERSET') {
      resetSupersetSetupValidation();
      setNumberOfExercises('');
      setNumberOfSets('');
      setHeading('Add Superset');
      setBtnTitle('Next');
      setSupersetModal(true);
    } else if (selectedExerciseOption === 'CARDIO') {
      resetExerciseDraft();
      resetCardioValidation();
      setHeading('Add Cardio');
      setBtnTitle('Add');
      setCardioExeModal(true);
    } else if (selectedExerciseOption === 'SPORT') {
      resetExerciseDraft();
      resetCardioValidation();
      setHeading('Add Sport');
      setBtnTitle('Add');
      setCardioExeModal(true);
    } else {
      setHeading('Add Note');
      setBtnTitle('Add');
      setCreateExerciseModal(true);
    }
  };

  const onEditExercise = (exerciseType, exerciseIndex) => {
    const currentEntry = allDayPlan[exerciseIndex];

    setExeIndex(exerciseIndex ?? null);
    setBtnTitle('Save');
    setIsDeleteBtn(true);

    if (exerciseType === 'SINGLE EXERCISE') {
      resetSingleExerciseValidation();
      setExercise(currentEntry?.exercise || '');
      setNumberOfSets(`${currentEntry?.set || ''}`);
      setAmount((currentEntry?.rtd || '').split(' ')[0] || '');
      setUnit((currentEntry?.rtd || '').split(' ')[1] || '');
      setMet(currentEntry?.met || 0);
      setRpm(currentEntry?.rpm || 0);
      setMph(currentEntry?.mph || 0);
      setHeading('Edit Exercise');
      setSingleExerciseModal(true);
    } else if (exerciseType === 'SUPERSET') {
      resetSupersetItemsValidation();
      const nextSupersetOptions = createSupersetDraft(
        currentEntry?.supersetOptions?.length || 0,
        currentEntry?.supersetOptions || [],
      );
      setHeading('Edit Exercises');
      setNumberOfExercises(`${nextSupersetOptions.length}`);
      setNumberOfSets(`${currentEntry?.set || ''}`);
      setSupersetOptions(nextSupersetOptions);
      setIsAddSupersetExercise(true);
    } else if (
      exerciseType === 'CARDIO EXERCISE' ||
      exerciseType === 'SPORT EXERCISE'
    ) {
      resetCardioValidation();
      setExercise(currentEntry?.exercise || '');
      setAmount((currentEntry?.rtd || '').split(' ')[0] || '');
      setUnit((currentEntry?.rtd || '').split(' ')[1] || '');
      setMet(currentEntry?.met || 0);
      setRpm(currentEntry?.rpm || 0);
      setMph(currentEntry?.mph || 0);
      setHeading(
        exerciseType === 'SPORT EXERCISE' ? 'Edit Sport' : 'Edit Cardio',
      );
      setSelectedExerciseOption(
        exerciseType === 'SPORT EXERCISE' ? 'SPORT' : 'CARDIO',
      );
      setCardioExeModal(true);
    } else {
      setHeading('Edit Note');
      setNote(getPersistedNote());
      setCreateExerciseModal(true);
    }
  };

  const onPickerItemSelect = index => {
    const selectedPickerItem = pickerItems[index - 1];

    if (!selectedPickerItem) {
      return;
    }

    if (pickerType === 'Exercise') {
      setExercise(selectedPickerItem.name);
      setMet(selectedPickerItem.met);
      setRpm(selectedPickerItem.rpm);
      setMph(selectedPickerItem.mph);

      if (singleExerciseModal) {
        clearSingleExerciseError('exercise');
      } else if (cardioExeModal) {
        clearCardioError('exercise');
      }
    } else if (pickerType === 'Sets') {
      setNumberOfSets(selectedPickerItem.value);

      if (singleExerciseModal) {
        clearSingleExerciseError('numberOfSets');
      } else {
        clearSupersetSetupError('numberOfSets');
      }
    } else if (pickerType === 'Number of Exercises') {
      setNumberOfExercises(selectedPickerItem.value);
      clearSupersetSetupError('numberOfExercises');
    } else {
      setUnit(selectedPickerItem.unit);

      if (singleExerciseModal) {
        clearSingleExerciseError('unit');
      } else if (cardioExeModal) {
        clearCardioError('unit');
      }
    }
  };

  const onSupersetPickerSelect = index => {
    const selectedPickerItem = pickerItems[index - 1];

    if (!selectedPickerItem || supersetExeIndex === null) {
      return;
    }

    setSupersetOptions(currentOptions => {
      const nextOptions = [...currentOptions];
      const currentOption = nextOptions[supersetExeIndex] || {};

      nextOptions[supersetExeIndex] =
        pickerType === 'Exercise'
          ? {
              ...currentOption,
              exercise: selectedPickerItem.name,
              met: selectedPickerItem.met,
              rpm: selectedPickerItem.rpm,
              mph: selectedPickerItem.mph,
            }
          : {
              ...currentOption,
              unit: selectedPickerItem.unit,
            };

      return nextOptions;
    });

    clearSupersetRowError(
      supersetExeIndex,
      pickerType === 'Exercise' ? 'exercise' : 'unit',
    );
  };

  const supersetExeAmount = (text, index) => {
    setSupersetOptions(currentOptions => {
      const nextOptions = [...currentOptions];
      nextOptions[index] = {
        ...(nextOptions[index] || {}),
        amount: text,
      };
      return nextOptions;
    });

    clearSupersetRowError(index, 'amount');
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

  const validateSingleExerciseForm = () => {
    const errors = {};

    if (!exercise.trim()) {
      errors.exercise = 'Select an exercise.';
    }
    if (!numberOfSets.trim()) {
      errors.numberOfSets = 'Select the number of sets.';
    }
    if (!amount.trim()) {
      errors.amount = 'Enter an amount.';
    } else if (!isFiniteDecimal(amount)) {
      errors.amount = 'Amount must be a number.';
    }
    if (!unit.trim()) {
      errors.unit = 'Select a unit.';
    }

    if (Object.keys(errors).length > 0) {
      setSingleExerciseFieldErrors(errors);
      setSingleExerciseFormErrorText(
        'Check the highlighted exercise fields before saving.',
      );
      return null;
    }

    const calories = calorieCalculationHandler();

    if (!calories) {
      setSingleExerciseFieldErrors({
        unit: 'Select a unit that matches the chosen exercise.',
      });
      setSingleExerciseFormErrorText(
        'Check the highlighted exercise fields before saving.',
      );
      return null;
    }

    return calories;
  };

  const validateCardioForm = () => {
    const errors = {};

    if (!exercise.trim()) {
      errors.exercise = 'Select an exercise.';
    }
    if (!amount.trim()) {
      errors.amount = 'Enter an amount.';
    } else if (!isFiniteDecimal(amount)) {
      errors.amount = 'Amount must be a number.';
    }
    if (!unit.trim()) {
      errors.unit = 'Select a unit.';
    }

    if (Object.keys(errors).length > 0) {
      setCardioFieldErrors(errors);
      setCardioFormErrorText(
        'Check the highlighted exercise fields before saving.',
      );
      return null;
    }

    const calories = calorieCalculationHandler();

    if (!calories) {
      setCardioFieldErrors({
        unit: 'Select a unit that matches the chosen exercise.',
      });
      setCardioFormErrorText(
        'Check the highlighted exercise fields before saving.',
      );
      return null;
    }

    return calories;
  };

  const validateSupersetSetup = () => {
    const errors = {};

    if (!numberOfExercises.trim()) {
      errors.numberOfExercises = 'Select the number of exercises.';
    }
    if (!numberOfSets.trim()) {
      errors.numberOfSets = 'Select the number of sets.';
    }

    setSupersetSetupFieldErrors(errors);
    setSupersetSetupFormErrorText(
      Object.keys(errors).length > 0
        ? 'Check the highlighted superset fields before continuing.'
        : '',
    );

    return Object.keys(errors).length === 0;
  };

  const validateSupersetItems = () => {
    const totalExercises = Number(numberOfExercises || supersetOptions.length);
    const nextRowErrors = Array.from({length: totalExercises}, () => ({}));
    const finalizedOptions = createSupersetDraft(totalExercises, supersetOptions);
    let hasErrors = false;

    finalizedOptions.forEach((item, index) => {
      if (!item.exercise) {
        nextRowErrors[index].exercise = 'Select an exercise.';
        hasErrors = true;
      }
      if (!`${item.amount || ''}`.trim()) {
        nextRowErrors[index].amount = 'Enter an amount.';
        hasErrors = true;
      } else if (!isFiniteDecimal(`${item.amount}`)) {
        nextRowErrors[index].amount = 'Amount must be a number.';
        hasErrors = true;
      }
      if (!item.unit) {
        nextRowErrors[index].unit = 'Select a unit.';
        hasErrors = true;
      }
    });

    if (!hasErrors) {
      finalizedOptions.forEach((item, index) => {
        const calories = calorieCalculationHandler(item);

        if (!calories) {
          nextRowErrors[index].unit =
            'Select a unit that matches the chosen exercise.';
          hasErrors = true;
        } else {
          finalizedOptions[index] = {
            ...item,
            cal: calories,
          };
        }
      });
    }

    setSupersetFieldErrors(nextRowErrors);
    setSupersetItemsFormErrorText(
      hasErrors
        ? 'Check the highlighted superset exercise fields before saving.'
        : '',
    );

    return hasErrors ? null : finalizedOptions;
  };

  const updateAllDayPlan = nextEntry => {
    setAllDayPlan(currentPlan => {
      const nextPlan = [...currentPlan];

      if (btnTitle === 'Save' && exeIndex !== null) {
        nextPlan[exeIndex] = nextEntry;
      } else {
        nextPlan.push(nextEntry);
      }

      return nextPlan;
    });
  };

  const onAddCardioExe = async () => {
    if (entryActionLockRef.current || cardioPending) {
      return;
    }

    const calories = validateCardioForm();

    if (!calories) {
      return;
    }

    entryActionLockRef.current = true;
    setCardioPending(true);

    const type =
      selectedExerciseOption === 'SPORT' ? 'SPORT EXERCISE' : 'CARDIO EXERCISE';

    updateAllDayPlan({
      type,
      exercise,
      met,
      rpm,
      mph,
      unit,
      amount,
      rtd: `${amount} ${unit}`,
      cal: calories,
    });

    resetCardioValidation(false);
    setCardioExeModal(false);
    resetExerciseDraft();
    setIsDeleteBtn(false);
    setExeIndex(null);
  };

  const onAddSingleExercise = async () => {
    if (entryActionLockRef.current || singleExercisePending) {
      return;
    }

    const calories = validateSingleExerciseForm();

    if (!calories) {
      return;
    }

    entryActionLockRef.current = true;
    setSingleExercisePending(true);

    updateAllDayPlan({
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

    resetSingleExerciseValidation(false);
    setSingleExerciseModal(false);
    resetExerciseDraft();
    setIsDeleteBtn(false);
    setExeIndex(null);
  };

  const onSupersetModalBtnPress = () => {
    if (entryActionLockRef.current || supersetSetupPending) {
      return;
    }

    if (!validateSupersetSetup()) {
      return;
    }

    entryActionLockRef.current = true;
    setSupersetSetupPending(true);
    setBtnTitle('Add');
    setHeading('Add Exercises');
    setSupersetOptions(createSupersetDraft(numberOfExercises));
    setSupersetModal(false);
    setIsAddSupersetExercise(true);
    resetSupersetSetupValidation();
  };

  const onAddSupersetExercises = async () => {
    if (entryActionLockRef.current || supersetItemsPending) {
      return;
    }

    const finalizedOptions = validateSupersetItems();

    if (!finalizedOptions) {
      return;
    }

    entryActionLockRef.current = true;
    setSupersetItemsPending(true);

    updateAllDayPlan({
      type: 'SUPERSET',
      exercise: 'Superset',
      set: numberOfSets,
      supersetOptions: finalizedOptions,
    });

    resetSupersetItemsValidation(false);
    setIsAddSupersetExercise(false);
    setSupersetWheelPicker(false);
    setSupersetExeIndex(null);
    setSupersetOptions([]);
    setNumberOfExercises('');
    setNumberOfSets('');
    setIsDeleteBtn(false);
    setExeIndex(null);
  };

  const onAddNote = () => {
    setCreateExerciseModal(false);
    setIsDeleteBtn(false);
    setExeIndex(null);
  };

  const onRequestDeleteEntry = () => {
    setCheck('deleteEntry');
    setIsPermissionModal(true);
  };

  const onRequestDeleteNote = () => {
    setCheck('deleteNote');
    setIsPermissionModal(true);
  };

  const onSaveHandler = async () => {
    setBtnLoader(true);
    let response = null;

    if (myWeekPlan?.id) {
      const tempWeekData = [...(myWeekPlan?.weekDays || [])];
      const index = tempWeekData.findIndex(a => a.day == selectedDay.day);

      if (index >= 0) {
        tempWeekData[index] = {
          ...tempWeekData[index],
          plan: allDayPlan,
          note,
        };
      }

      response = await onEditWeekPlan(selectedProgram.id, myWeekPlan.id, {
        week: myWeekPlan.week,
        weekDays:
          index >= 0
            ? tempWeekData
            : [
                ...tempWeekData,
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
    if (check !== 'deleteEntry' && check !== 'deleteNote') {
      closePermissionModal();
      return;
    }

    if (deleteLoader) {
      return;
    }

    const {tempWeekData, index, data} = getCurrentDayData();
    const nextPlan =
      check === 'deleteEntry'
        ? allDayPlan.filter((_, indexValue) => indexValue !== exeIndex)
        : allDayPlan;
    const nextNote = check === 'deleteNote' ? '' : note;

    setDeleteLoader(true);

    let response = true;

    if (tempWeekData.length > 0 && index >= 0 && data) {
      const nextWeekData = [...tempWeekData];
      nextWeekData[index] = {
        ...data,
        plan: nextPlan,
        note: nextNote,
      };

      response = await onEditWeekPlan(selectedProgram.id, myWeekPlan.id, {
        week: myWeekPlan.week,
        weekDays: nextWeekData,
      });
    }

    setDeleteLoader(false);

    if (response === true) {
      if (check === 'deleteEntry') {
        setAllDayPlan(nextPlan);
      } else {
        setNote('');
      }

      setCheck('');
      setIsPermissionModal(false);
      setSingleExerciseModal(false);
      setIsAddSupersetExercise(false);
      setCreateExerciseModal(false);
      setCardioExeModal(false);
      setIsDeleteBtn(false);
      setExeIndex(null);
      resetSingleExerciseValidation();
      resetCardioValidation();
      resetSupersetItemsValidation();

      if (tempWeekData.length > 0 && index >= 0 && data) {
        showMessage(
          'Success!',
          `Week ${myWeekPlan.week || selectedDay.week} day ${
            selectedDay.day
          } updated successfully.`,
        );
      }
    } else {
      showMessage('Error!', response);
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
      addExerciseOptions={addExerciseOptions}
      addExerciseModal={addExerciseModal}
      setAddExerciseModal={setAddExerciseModal}
      selectedExerciseOption={selectedExerciseOption}
      setSelectedExerciseOption={setSelectedExerciseOption}
      onNextBtnPress={onNextBtnPress}
      createExerciseModal={createExerciseModal}
      createItemFields={createItemFields}
      isAddSupersetExercise={isAddSupersetExercise}
      onEditExercise={onEditExercise}
      isDeleteBtn={isDeleteBtn}
      isPermissionModal={isPermissionModal}
      onPickerItemSelect={onPickerItemSelect}
      allDayPlan={allDayPlan}
      note={note}
      unit={unit}
      exercise={exercise}
      numberOfSets={numberOfSets}
      amount={amount}
      singleExerciseModal={singleExerciseModal}
      alertHeading={alertHeading}
      alertText={alertText}
      btnLoader={btnLoader}
      onAddSingleExercise={onAddSingleExercise}
      onAddCardioExe={onAddCardioExe}
      supersetModal={supersetModal}
      numberOfExercises={numberOfExercises}
      onSupersetModalBtnPress={onSupersetModalBtnPress}
      onAddBtnPress={onAddBtnPress}
      onSaveHandler={onSaveHandler}
      onDonePermissionModal={onDonePermissionModal}
      deleteLoader={deleteLoader}
      onChangeText={text => setNote(text)}
      onAddNote={onAddNote}
      onCloseCreateNoteModal={onCloseCreateNoteModal}
      cardioExeModal={cardioExeModal}
      supersetOptions={supersetOptions}
      supersetWheelPicker={supersetWheelPicker}
      setSupersetWheelPicker={setSupersetWheelPicker}
      onSupersetPickerSelect={onSupersetPickerSelect}
      onSupersetAmountChange={supersetExeAmount}
      onAddSupersetExercises={onAddSupersetExercises}
      pickerContent={pickerType}
      singleExerciseFieldErrors={singleExerciseFieldErrors}
      singleExerciseFormErrorText={singleExerciseFormErrorText}
      singleExercisePending={singleExercisePending}
      onSingleAmountChange={onSingleAmountChange}
      closeSingleExerciseModal={closeSingleExerciseModal}
      cardioFieldErrors={cardioFieldErrors}
      cardioFormErrorText={cardioFormErrorText}
      cardioPending={cardioPending}
      onCardioAmountChange={onCardioAmountChange}
      closeCardioExerciseModal={closeCardioExerciseModal}
      supersetSetupFieldErrors={supersetSetupFieldErrors}
      supersetSetupFormErrorText={supersetSetupFormErrorText}
      supersetSetupPending={supersetSetupPending}
      closeSupersetSetupModal={closeSupersetSetupModal}
      supersetFieldErrors={supersetFieldErrors}
      supersetItemsFormErrorText={supersetItemsFormErrorText}
      supersetItemsPending={supersetItemsPending}
      closeSupersetItemsModal={closeSupersetItemsModal}
      onRequestDeleteEntry={onRequestDeleteEntry}
      onRequestDeleteNote={onRequestDeleteNote}
      closePermissionModal={closePermissionModal}
      setSupersetExeIndex={setSupersetExeIndex}
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
