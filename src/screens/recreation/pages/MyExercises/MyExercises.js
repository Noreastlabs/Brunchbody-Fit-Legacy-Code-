/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MyExercises } from '../../components';
import {
  addExercise,
  deleteExercise,
  editExercise,
} from '../../../../redux/actions';

const getCreateExerciseFields = ({
  exerciseName,
  equivalentExercise,
  exerciseType,
  fieldErrors,
}) => [
  {
    id: 1,
    value: exerciseName,
    state: 'exerciseName',
    fieldName: 'Exercise Name',
    placeholder: 'Enter Name',
    helperText: 'Use a clear label for this exercise.',
    errorText: fieldErrors.exerciseName,
  },
  {
    id: 2,
    value: equivalentExercise?.name || '',
    fieldName: 'Select Exercise Equivalent',
    picker: true,
    pickerLabel: 'Exercise',
    helperText: `Choose the ${exerciseType.toLowerCase()} equivalent for this entry.`,
    errorText: fieldErrors.equivalentExercise,
  },
];

const exerciseTypeOptions = [
  { id: 1, option: 'EXERCISE' },
  { id: 2, option: 'CARDIO' },
  { id: 3, option: 'SPORT' },
];

export default function MyExercisesPage(props) {
  const {
    userExercises,
    onCreateExercise,
    onDeleteExercise,
    onUpdateExercise,
    allExercises,
  } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [exeTypeModal, setExeTypeModal] = useState(false);
  const [createItemModal, setCreateItemModal] = useState(false);
  const [editExerciseModal, setEditExerciseModal] = useState(false);
  const [wheelPickerModal, setWheelPickerModal] = useState(false);
  const [heading, setHeading] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseType, setExerciseType] = useState('EXERCISE');
  const [exerciseId, setExerciseId] = useState(null);
  const [equivalentExercise, setEquivalentExercise] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [createItemFormErrorText, setCreateItemFormErrorText] = useState('');
  const [editItemFormErrorText, setEditItemFormErrorText] = useState('');
  const [submitPending, setSubmitPending] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [check, setCheck] = useState('');
  const submitLockRef = useRef(false);
  const deleteLockRef = useRef(false);
  const normalizedExerciseType = exerciseType.toLowerCase();
  const availableEquivalentExercises = useMemo(
    () =>
      allExercises.filter(
        item => item?.type?.toLowerCase() === normalizedExerciseType,
      ),
    [allExercises, normalizedExerciseType],
  );
  const createExerciseFields = getCreateExerciseFields({
    exerciseName,
    equivalentExercise,
    exerciseType,
    fieldErrors,
  });

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const resetExerciseForm = () => {
    setExerciseName('');
    setExerciseType('EXERCISE');
    setExerciseId(null);
    setEquivalentExercise({});
    setFieldErrors({});
    setCreateItemFormErrorText('');
    setEditItemFormErrorText('');
  };

  const closeCreateItemModal = () => {
    submitLockRef.current = false;
    setSubmitPending(false);
    setCreateItemModal(false);
    setWheelPickerModal(false);
    resetExerciseForm();
  };

  const closeEditExerciseModal = () => {
    submitLockRef.current = false;
    setSubmitPending(false);
    setEditExerciseModal(false);
    setWheelPickerModal(false);
    resetExerciseForm();
  };

  const onOpenCreateExerciseTypeModal = () => {
    submitLockRef.current = false;
    setSubmitPending(false);
    setExeTypeModal(true);
    resetExerciseForm();
  };

  const onOpenExerciseActions = item => {
    setHeading(item.name);
    setExerciseId(item.id);
    setExerciseName(item.name || '');
    setEquivalentExercise(
      allExercises.find(a => a.name === item.equivalentExercise) || item,
    );
    setExerciseType((item.type || 'EXERCISE').toUpperCase());
    setFieldErrors({});
    setCreateItemFormErrorText('');
    setEditItemFormErrorText('');
    setIsVisible(true);
  };

  const onOpenEditExerciseModal = () => {
    if (!exerciseId) {
      return;
    }

    submitLockRef.current = false;
    setSubmitPending(false);
    setFieldErrors({});
    setCreateItemFormErrorText('');
    setEditItemFormErrorText('');
    setIsVisible(false);
    setEditExerciseModal(true);
  };

  const onExerciseNameChange = text => {
    setExerciseName(text);
    setFieldErrors(currentErrors => ({
      ...currentErrors,
      exerciseName: '',
    }));
    setCreateItemFormErrorText('');
    setEditItemFormErrorText('');
  };

  const openEquivalentExercisePicker = () => {
    setFieldErrors(currentErrors => ({
      ...currentErrors,
      equivalentExercise: '',
    }));
    setCreateItemFormErrorText('');
    setEditItemFormErrorText('');
    setWheelPickerModal(true);
  };

  const onEquivalentExerciseSelect = index => {
    const selectedExercise = availableEquivalentExercises[index - 1];

    if (!selectedExercise) {
      return;
    }

    setEquivalentExercise(selectedExercise);
    setFieldErrors(currentErrors => ({
      ...currentErrors,
      equivalentExercise: '',
    }));
    setCreateItemFormErrorText('');
    setEditItemFormErrorText('');
  };

  const validateExerciseForm = mode => {
    const errors = {};

    if (!exerciseName.trim()) {
      errors.exerciseName = 'Enter an exercise name.';
    }

    if (!equivalentExercise?.name) {
      errors.equivalentExercise = 'Select an equivalent exercise.';
    }

    setFieldErrors(errors);

    const formErrorText =
      Object.keys(errors).length > 0
        ? 'Check the highlighted exercise fields before saving.'
        : '';

    if (mode === 'create') {
      setCreateItemFormErrorText(formErrorText);
    } else {
      setEditItemFormErrorText(formErrorText);
    }

    return Object.keys(errors).length === 0;
  };

  const onNextBtnPress = () => {
    if (exerciseType) {
      setExeTypeModal(false);
      setFieldErrors({});
      setCreateItemFormErrorText('');
      setEditItemFormErrorText('');
      setCreateItemModal(true);
    } else {
      showMessage('Error!', 'Please select exercise type.');
    }
  };

  const onAddExercise = async () => {
    if (submitLockRef.current || submitPending) {
      return;
    }

    if (!validateExerciseForm('create')) {
      return;
    }

    submitLockRef.current = true;
    setSubmitPending(true);

    const response = await onCreateExercise({
      name: exerciseName.trim(),
      equivalentExercise: equivalentExercise.name,
      met: equivalentExercise.met,
      rpm: equivalentExercise.rpm || 0,
      mph: equivalentExercise.mph || 0,
      type: normalizedExerciseType,
    });

    submitLockRef.current = false;
    setSubmitPending(false);

    if (response === true) {
      closeCreateItemModal();
    } else {
      showMessage('Error!', response);
    }
  };

  const onEditExercise = async () => {
    if (submitLockRef.current || submitPending || !exerciseId) {
      return;
    }

    if (!validateExerciseForm('edit')) {
      return;
    }

    submitLockRef.current = true;
    setSubmitPending(true);

    const response = await onUpdateExercise(exerciseId, {
      name: exerciseName.trim(),
      equivalentExercise: equivalentExercise.name,
      met: equivalentExercise.met,
      rpm: equivalentExercise.rpm || 0,
      mph: equivalentExercise.mph || 0,
      type: normalizedExerciseType,
    });

    submitLockRef.current = false;
    setSubmitPending(false);

    if (response === true) {
      closeEditExerciseModal();
    } else {
      showMessage('Error!', response);
    }
  };

  const onDonePermissionModal = async () => {
    if (check === 'delete') {
      if (deleteLockRef.current || !exerciseId) {
        return;
      }

      deleteLockRef.current = true;
      setDeleteLoader(true);

      const response = await onDeleteExercise(exerciseId);

      deleteLockRef.current = false;
      setDeleteLoader(false);

      if (response === true) {
        setCheck('');
        setIsVisible(false);
        setPermissionModal(false);
        resetExerciseForm();
      } else {
        setCheck('');
        showMessage('Error!', response);
      }
    } else {
      setPermissionModal(false);
      setTimeout(() => {
        setAlertText('');
        setAlertHeading('');
      }, 500);
    }
  };

  return (
    <MyExercises
      {...props}
      exercisesList={userExercises}
      pickerExercises={allExercises}
      heading={heading}
      setHeading={setHeading}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      createItemModal={createItemModal}
      closeCreateItemModal={closeCreateItemModal}
      editExerciseModal={editExerciseModal}
      closeEditExerciseModal={closeEditExerciseModal}
      createExerciseFields={createExerciseFields}
      wheelPickerModal={wheelPickerModal}
      setWheelPickerModal={setWheelPickerModal}
      exerciseName={exerciseName}
      onExerciseNameChange={onExerciseNameChange}
      onAddExercise={onAddExercise}
      onEditExercise={onEditExercise}
      onDonePermissionModal={onDonePermissionModal}
      equivalentExercise={equivalentExercise}
      submitPending={submitPending}
      deleteLoader={deleteLoader}
      alertHeading={alertHeading}
      alertText={alertText}
      setCheck={setCheck}
      exerciseType={exerciseType}
      setExerciseType={setExerciseType}
      exeTypeModal={exeTypeModal}
      setExeTypeModal={setExeTypeModal}
      exerciseTypeOptions={exerciseTypeOptions}
      onNextBtnPress={onNextBtnPress}
      onOpenCreateExerciseTypeModal={onOpenCreateExerciseTypeModal}
      onOpenExerciseActions={onOpenExerciseActions}
      onOpenEditExerciseModal={onOpenEditExerciseModal}
      openEquivalentExercisePicker={openEquivalentExercisePicker}
      onEquivalentExerciseSelect={onEquivalentExerciseSelect}
      availableEquivalentExercises={availableEquivalentExercises}
      createItemFormErrorText={createItemFormErrorText}
      editItemFormErrorText={editItemFormErrorText}
    />
  );
}

MyExercisesPage.propTypes = {
  onCreateExercise: PropTypes.func.isRequired,
  onDeleteExercise: PropTypes.func.isRequired,
  onUpdateExercise: PropTypes.func.isRequired,
  userExercises: PropTypes.arrayOf(PropTypes.any).isRequired,
  allExercises: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  userExercises: state.exercise?.exercises,
  allExercises: state.exercise?.allExercises,
});

const mapDispatchToProps = dispatch => ({
  onCreateExercise: data => dispatch(addExercise(data)),
  onDeleteExercise: id => dispatch(deleteExercise(id)),
  onUpdateExercise: (id, data) => dispatch(editExercise(id, data)),
});

export const MyExercisesWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyExercisesPage);
