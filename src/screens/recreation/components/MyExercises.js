import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  AddButton,
  CreateItemContent,
  CustomHeader,
  CustomModal,
  ModalContent,
  PermissionModal,
  SafeAreaWrapper,
  SelectModalContent,
  WheelPickerContent,
} from '../../../components';
import {colors} from '../../../resources';
import styles from './style';

export default function MyExercises(props) {
  const {
    exercisesList,
    heading,
    isVisible,
    setIsVisible,
    permissionModal,
    setPermissionModal,
    createItemModal,
    closeCreateItemModal,
    editExerciseModal,
    closeEditExerciseModal,
    createExerciseFields,
    wheelPickerModal,
    setWheelPickerModal,
    onExerciseNameChange,
    onAddExercise,
    onEditExercise,
    onDonePermissionModal,
    equivalentExercise,
    submitPending,
    deleteLoader,
    alertHeading,
    alertText,
    setCheck,
    exerciseType,
    setExerciseType,
    exeTypeModal,
    setExeTypeModal,
    exerciseTypeOptions,
    onNextBtnPress,
    availableEquivalentExercises,
    onOpenCreateExerciseTypeModal,
    onOpenExerciseActions,
    onOpenEditExerciseModal,
    openEquivalentExercisePicker,
    onEquivalentExerciseSelect,
    createItemFormErrorText,
    editItemFormErrorText,
  } = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />

        <View style={styles.headingView}>
          <Text style={styles.subHeading2}>My Exercises</Text>
        </View>

        <View style={styles.setMargin}>
          {exercisesList.map(item => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.5}
              onPress={() => onOpenExerciseActions(item)}>
              <Text style={[styles.textStyle3, {color: colors.tertiary}]}>
                {item.name || item.value}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={{marginTop: 10}}>
            <AddButton onPress={onOpenCreateExerciseTypeModal} />
          </View>
        </View>
      </ScrollView>

      {/* Select exercise's type modal */}
      <CustomModal
        isVisible={exeTypeModal}
        onDismiss={() => setExeTypeModal(false)}
        content={
          <SelectModalContent
            select
            heading="Add Exercise"
            subHeading="Select Type"
            selectOptions={exerciseTypeOptions}
            selected={exerciseType}
            onOptionSelect={setExerciseType}
            hideModal={() => setExeTypeModal(false)}
            btnTitle="Next"
            onBtnPress={onNextBtnPress}
          />
        }
      />

      <CustomModal
        isVisible={isVisible}
        onDismiss={() => setIsVisible(false)}
        content={
          <ModalContent
            heading={heading}
            hideModal={() => setIsVisible(false)}
            btnTitle="Edit"
            onBtnPress={onOpenEditExerciseModal}
            isDeleteBtn
            onDeleteBtnPress={() => {
              setPermissionModal(true);
              setCheck('delete');
            }}
          />
        }
      />

      {/* Add exercise modal */}
      <CustomModal
        isVisible={createItemModal}
        onDismiss={closeCreateItemModal}
        content={
          <CreateItemContent
            loader={submitPending}
            heading="Add Exercise"
            selectedPickerItem={equivalentExercise?.name || ''}
            onChangeText={onExerciseNameChange}
            createItemFields={createExerciseFields}
            hideModal={closeCreateItemModal}
            btnTitle="Add"
            formErrorText={createItemFormErrorText}
            onBtnPress={onAddExercise}
            onDropdownSelect={openEquivalentExercisePicker}
          />
        }
      />

      {/* Edit exercise modal */}
      <CustomModal
        isVisible={editExerciseModal}
        onDismiss={closeEditExerciseModal}
        content={
          <CreateItemContent
            loader={submitPending}
            heading="Edit Exercise"
            selectedPickerItem={equivalentExercise?.name || ''}
            onChangeText={onExerciseNameChange}
            createItemFields={createExerciseFields}
            hideModal={closeEditExerciseModal}
            btnTitle="Save"
            formErrorText={editItemFormErrorText}
            onBtnPress={onEditExercise}
            onDropdownSelect={openEquivalentExercisePicker}
          />
        }
      />

      <CustomModal
        isVisible={wheelPickerModal}
        onDismiss={() => setWheelPickerModal(false)}
        content={
          <WheelPickerContent
            pickerItems={availableEquivalentExercises}
            onValueChange={onEquivalentExerciseSelect}
            onConfirm={() => setWheelPickerModal(false)}
            onCancel={() => setWheelPickerModal(false)}
          />
        }
      />

      <CustomModal
        isVisible={permissionModal}
        onDismiss={() => setPermissionModal(false)}
        content={
          <PermissionModal
            loader={deleteLoader}
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={onDonePermissionModal}
            onCancel={() => setPermissionModal(false)}
          />
        }
      />
    </SafeAreaWrapper>
  );
}

MyExercises.propTypes = {
  exercisesList: PropTypes.arrayOf(PropTypes.any).isRequired,
  heading: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  setIsVisible: PropTypes.func.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  createItemModal: PropTypes.bool.isRequired,
  closeCreateItemModal: PropTypes.func.isRequired,
  editExerciseModal: PropTypes.bool.isRequired,
  closeEditExerciseModal: PropTypes.func.isRequired,
  createExerciseFields: PropTypes.arrayOf(PropTypes.any).isRequired,
  wheelPickerModal: PropTypes.bool.isRequired,
  setWheelPickerModal: PropTypes.func.isRequired,
  onExerciseNameChange: PropTypes.func.isRequired,
  onAddExercise: PropTypes.func.isRequired,
  onEditExercise: PropTypes.func.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  equivalentExercise: PropTypes.objectOf(PropTypes.any).isRequired,
  submitPending: PropTypes.bool.isRequired,
  deleteLoader: PropTypes.bool.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  setCheck: PropTypes.func.isRequired,
  exerciseType: PropTypes.string.isRequired,
  setExerciseType: PropTypes.func.isRequired,
  exeTypeModal: PropTypes.bool.isRequired,
  setExeTypeModal: PropTypes.func.isRequired,
  exerciseTypeOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  onNextBtnPress: PropTypes.func.isRequired,
  availableEquivalentExercises: PropTypes.arrayOf(PropTypes.any).isRequired,
  onOpenCreateExerciseTypeModal: PropTypes.func.isRequired,
  onOpenExerciseActions: PropTypes.func.isRequired,
  onOpenEditExerciseModal: PropTypes.func.isRequired,
  openEquivalentExercisePicker: PropTypes.func.isRequired,
  onEquivalentExerciseSelect: PropTypes.func.isRequired,
  createItemFormErrorText: PropTypes.string.isRequired,
  editItemFormErrorText: PropTypes.string.isRequired,
};
