/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { wheelPickerItems } from '../../../../resources';
import { MyExercises } from '../../components';
import {
  addExercise,
  deleteExercise,
  editExercise,
} from '../../../../redux/actions';

const createExerciseFields = [
  {
    id: 1,
    fieldName: 'Exercise Name',
    placeholder: 'Enter Name',
  },
  {
    id: 2,
    fieldName: 'Select Exercise Equivalent',
    picker: true,
    pickerLabel: 'Exercise',
    pickerContent: wheelPickerItems.exercises,
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
  const [btnLoader, setBtnLoader] = useState(false);
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
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [check, setCheck] = useState('');

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onNextBtnPress = () => {
    if (exerciseType) {
      setExeTypeModal(false);
      setCreateItemModal(true);
    } else {
      showMessage('Error!', 'Please select exercise type.');
    }
  };

  const onAddExercise = async () => {
    if (exerciseName.trim() && equivalentExercise !== '') {
      setBtnLoader(true);

      const response = await onCreateExercise({
        name: exerciseName,
        equivalentExercise: equivalentExercise.name,
        met: equivalentExercise.met,
        rpm: equivalentExercise.rpm || 0,
        mph: equivalentExercise.mph || 0,
        type: exerciseType.toLowerCase(),
      });

      if (response === true) {
        setExerciseName('');
        setEquivalentExercise('');
        setBtnLoader(false);
        setCreateItemModal(false);
      } else {
        setBtnLoader(false);
        showMessage('Error!', response);
      }
    } else {
      showMessage('Error!', 'All fields are required.');
    }
  };

  const onEditExercise = async () => {
    if (exerciseName.trim() && equivalentExercise !== '') {
      setBtnLoader(true);

      const response = await onUpdateExercise(exerciseId, {
        name: exerciseName,
        equivalentExercise: equivalentExercise.name,
        met: equivalentExercise.met,
        rpm: equivalentExercise.rpm || 0,
        mph: equivalentExercise.mph || 0,
        type: exerciseType.toLowerCase(),
      });

      if (response === true) {
        setExerciseName('');
        setEquivalentExercise('');
        setBtnLoader(false);
        setEditExerciseModal(false);
      } else {
        setBtnLoader(false);
        showMessage('Error!', response);
      }
    } else {
      showMessage('Error!', 'All fields are required.');
    }
  };

  const onDonePermissionModal = async () => {
    if (check === 'delete') {
      setBtnLoader(true);

      const response = await onDeleteExercise(exerciseId);

      if (response === true) {
        setCheck('');
        setBtnLoader(false);
        setIsVisible(false);
        setPermissionModal(false);
      } else {
        setCheck('');
        setBtnLoader(false);
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
      setCreateItemModal={setCreateItemModal}
      editExerciseModal={editExerciseModal}
      setEditExerciseModal={setEditExerciseModal}
      createExerciseFields={createExerciseFields}
      wheelPickerModal={wheelPickerModal}
      setWheelPickerModal={setWheelPickerModal}
      exerciseName={exerciseName}
      setExerciseName={setExerciseName}
      onAddExercise={onAddExercise}
      onEditExercise={onEditExercise}
      setExerciseId={setExerciseId}
      onDonePermissionModal={onDonePermissionModal}
      equivalentExercise={equivalentExercise}
      setEquivalentExercise={setEquivalentExercise}
      btnLoader={btnLoader}
      alertHeading={alertHeading}
      alertText={alertText}
      setCheck={setCheck}
      exerciseType={exerciseType}
      setExerciseType={setExerciseType}
      exeTypeModal={exeTypeModal}
      setExeTypeModal={setExeTypeModal}
      exerciseTypeOptions={exerciseTypeOptions}
      onNextBtnPress={onNextBtnPress}
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
