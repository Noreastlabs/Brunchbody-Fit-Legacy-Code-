/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {
  AddButton,
  Button,
  CustomHeader,
  CustomModal,
  ProgramTable,
  SelectModalContent,
  CreateItemContent,
  AddExerciseModal,
  WheelPickerContent,
  PermissionModal,
  AddSingleExercise,
  SupersetModal,
  AddCardioExercise,
} from '../../../components';
import styles from './style';

export default function EditProgram(props) {
  const {
    route,
    pickerItems,
    setPickerType,
    setPickerItems,
    heading,
    btnTitle,
    wheelPickerModal,
    setWheelPickerModal,
    addExerciseOptions,
    addExerciseModal,
    setAddExerciseModal,
    selectedExerciseOption,
    setSelectedExerciseOption,
    onNextBtnPress,
    createExerciseModal,
    createItemFields,
    isAddSupersetExercise,
    setIsAddSupersetExercise,
    onEditExercise,
    isDeleteBtn,
    isPermissionModal,
    setIsPermissionModal,
    onPickerItemSelect,
    allDayPlan,
    singleExerciseModal,
    setSingleExerciseModal,
    onAddSingleExercise,
    alertHeading,
    alertText,
    supersetModal,
    setSupersetModal,
    onSupersetModalBtnPress,
    onAddCardioExe,
    onAddBtnPress,
    onChangeText,
    btnLoader,
    onSaveHandler,
    onDonePermissionModal,
    setCheck,
    deleteLoader,
    onAddNote,
    note,
    setNote,
    setExeIndex,
    onCloseCreateNoteModal,
    cardioExeModal,
    setCardioExeModal,
    setSupersetExeIndex,
    supersetWheelPicker,
    setSupersetWheelPicker,
    onSupersetPickerSelect,
    onAddSupersetExercises,
    pickerContent,
  } = props;
  const {selectedProgram, selectedDay} = route.params;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />

        <View style={styles.headingView}>
          <Text style={styles.subHeading2}>{selectedProgram.name}</Text>
        </View>

        <View style={styles.tableView}>
          <Text style={[styles.textStyle1, {alignSelf: 'center'}]}>
            Week {selectedDay.week} day {selectedDay.day}
          </Text>
          <ProgramTable
            {...props}
            note={note}
            data={allDayPlan}
            onEditExercise={onEditExercise}
          />
          <View style={styles.setMargin2}>
            <AddButton onPress={onAddBtnPress} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.btnView2}>
        <Button loader={btnLoader} title="Save" onPress={onSaveHandler} />
      </View>

      {/* Select exercise's type modal */}
      <CustomModal
        isVisible={addExerciseModal}
        onDismiss={() => setAddExerciseModal(false)}
        content={
          <SelectModalContent
            select
            heading="Add Exercise"
            subHeading="Select"
            selectOptions={addExerciseOptions}
            selected={selectedExerciseOption}
            onOptionSelect={setSelectedExerciseOption}
            hideModal={() => setAddExerciseModal(false)}
            btnTitle="Next"
            onBtnPress={onNextBtnPress}
          />
        }
      />

      {/* Create Exercise Modal */}
      <CustomModal
        isVisible={createExerciseModal}
        onDismiss={onCloseCreateNoteModal}
        content={
          <CreateItemContent
            heading={heading}
            createItemFields={createItemFields}
            onChangeText={text => onChangeText(text)}
            hideModal={onCloseCreateNoteModal}
            btnTitle={btnTitle}
            onBtnPress={onAddNote}
            onDropdownSelect={(data, pickerType) => {
              setWheelPickerModal(true);
              setPickerItems(data);
              setPickerType(pickerType);
            }}
            isDeleteBtn={isDeleteBtn}
            onDeleteBtnPress={() => {
              setNote('');
              setExeIndex(null);
              setCheck('delete');
              setIsPermissionModal(true);
            }}
          />
        }
      />

      {/* Create Single Exercise Modal */}
      <CustomModal
        isVisible={singleExerciseModal}
        onDismiss={() => setSingleExerciseModal(false)}
        content={
          <AddSingleExercise
            {...props}
            hideModal={() => setSingleExerciseModal(false)}
            onBtnPress={onAddSingleExercise}
            onDropdownSelect={(data, pickerType) => {
              setPickerItems(data);
              setPickerType(pickerType);
              setWheelPickerModal(true);
            }}
            onDeleteBtnPress={() => {
              setIsPermissionModal(true);
              setCheck('delete');
            }}
          />
        }
      />

      {/* Select Number of Superset Exercises Modal */}
      <CustomModal
        isVisible={supersetModal}
        onDismiss={() => setSupersetModal(false)}
        content={
          <SupersetModal
            {...props}
            hideModal={() => setSupersetModal(false)}
            onBtnPress={onSupersetModalBtnPress}
            onDropdownSelect={(data, pickerType) => {
              setWheelPickerModal(true);
              setPickerItems(data);
              setPickerType(pickerType);
            }}
          />
        }
      />

      {/* Create Superset Exercises Modal */}
      <CustomModal
        isVisible={isAddSupersetExercise}
        onDismiss={() => setIsAddSupersetExercise(false)}
        content={
          <AddExerciseModal
            {...props}
            hideModal={() => setIsAddSupersetExercise(false)}
            onBtnPress={onAddSupersetExercises}
            onDropdownSelect={(data, pickerType, index) => {
              setPickerItems(data);
              setPickerType(pickerType);
              setSupersetExeIndex(index);
              setSupersetWheelPicker(true);
            }}
            onDeleteBtnPress={() => {
              setIsPermissionModal(true);
              setCheck('delete');
            }}
          />
        }
      />

      {/* Create Cardio Exercise Modal */}
      <CustomModal
        isVisible={cardioExeModal}
        onDismiss={() => setCardioExeModal(false)}
        content={
          <AddCardioExercise
            {...props}
            hideModal={() => setCardioExeModal(false)}
            onBtnPress={onAddCardioExe}
            onDropdownSelect={(data, pickerType) => {
              setWheelPickerModal(true);
              setPickerItems(data);
              setPickerType(pickerType);
            }}
            onDeleteBtnPress={() => {
              setIsPermissionModal(true);
              setCheck('delete');
            }}
          />
        }
      />

      {/* Superset exercise wheel picker */}
      <CustomModal
        isVisible={supersetWheelPicker}
        onDismiss={() => setSupersetWheelPicker(false)}
        content={
          <WheelPickerContent
            pickerItems={pickerItems}
            pickerType={pickerContent}
            exerciseType={selectedExerciseOption}
            onValueChange={onSupersetPickerSelect}
            onConfirm={() => setSupersetWheelPicker(false)}
            onCancel={() => setSupersetWheelPicker(false)}
          />
        }
      />

      <CustomModal
        isVisible={wheelPickerModal}
        onDismiss={() => setWheelPickerModal(false)}
        content={
          <WheelPickerContent
            pickerItems={pickerItems}
            pickerType={pickerContent}
            exerciseType={selectedExerciseOption}
            onValueChange={onPickerItemSelect}
            onConfirm={() => setWheelPickerModal(false)}
            onCancel={() => setWheelPickerModal(false)}
          />
        }
      />

      <CustomModal
        isVisible={isPermissionModal}
        onDismiss={() => setIsPermissionModal(false)}
        content={
          <PermissionModal
            loader={deleteLoader}
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={onDonePermissionModal}
            onCancel={() => setIsPermissionModal(false)}
          />
        }
      />
    </SafeAreaView>
  );
}

EditProgram.defaultProps = {
  route: {},
};

EditProgram.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  btnTitle: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  wheelPickerModal: PropTypes.bool.isRequired,
  setWheelPickerModal: PropTypes.func.isRequired,
  pickerItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  setPickerType: PropTypes.func.isRequired,
  setPickerItems: PropTypes.func.isRequired,
  addExerciseOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  addExerciseModal: PropTypes.bool.isRequired,
  setAddExerciseModal: PropTypes.func.isRequired,
  selectedExerciseOption: PropTypes.string.isRequired,
  setSelectedExerciseOption: PropTypes.func.isRequired,
  onNextBtnPress: PropTypes.func.isRequired,
  createExerciseModal: PropTypes.bool.isRequired,
  createItemFields: PropTypes.arrayOf(PropTypes.any).isRequired,
  isAddSupersetExercise: PropTypes.bool.isRequired,
  setIsAddSupersetExercise: PropTypes.func.isRequired,
  onEditExercise: PropTypes.func.isRequired,
  isDeleteBtn: PropTypes.bool.isRequired,
  isPermissionModal: PropTypes.bool.isRequired,
  setIsPermissionModal: PropTypes.func.isRequired,
  onPickerItemSelect: PropTypes.func.isRequired,
  allDayPlan: PropTypes.arrayOf(PropTypes.any).isRequired,
  singleExerciseModal: PropTypes.bool.isRequired,
  setSingleExerciseModal: PropTypes.func.isRequired,
  onAddSingleExercise: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  supersetModal: PropTypes.bool.isRequired,
  setSupersetModal: PropTypes.func.isRequired,
  onSupersetModalBtnPress: PropTypes.func.isRequired,
  onAddCardioExe: PropTypes.func.isRequired,
  onAddBtnPress: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  btnLoader: PropTypes.bool.isRequired,
  onSaveHandler: PropTypes.func.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  setCheck: PropTypes.func.isRequired,
  deleteLoader: PropTypes.bool.isRequired,
  onAddNote: PropTypes.func.isRequired,
  note: PropTypes.string.isRequired,
  setNote: PropTypes.func.isRequired,
  setExeIndex: PropTypes.func.isRequired,
  onCloseCreateNoteModal: PropTypes.func.isRequired,
  cardioExeModal: PropTypes.bool.isRequired,
  setCardioExeModal: PropTypes.func.isRequired,
  setSupersetExeIndex: PropTypes.func.isRequired,
  supersetWheelPicker: PropTypes.bool.isRequired,
  setSupersetWheelPicker: PropTypes.func.isRequired,
  onSupersetPickerSelect: PropTypes.func.isRequired,
  onAddSupersetExercises: PropTypes.func.isRequired,
  pickerContent: PropTypes.string.isRequired,
};
