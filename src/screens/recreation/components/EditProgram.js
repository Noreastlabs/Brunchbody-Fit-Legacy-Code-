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
  WheelPickerContent,
  PermissionModal,
} from '../../../components';
import {
  AddCardioExercise,
  AddExerciseModal,
  AddSingleExercise,
  SupersetModal,
} from './modals';
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
    onEditExercise,
    isDeleteBtn,
    isPermissionModal,
    onPickerItemSelect,
    allDayPlan,
    singleExerciseModal,
    onAddSingleExercise,
    alertHeading,
    alertText,
    supersetModal,
    onSupersetModalBtnPress,
    onAddCardioExe,
    onAddBtnPress,
    onChangeText,
    btnLoader,
    onSaveHandler,
    onDonePermissionModal,
    deleteLoader,
    onAddNote,
    note,
    onCloseCreateNoteModal,
    cardioExeModal,
    supersetWheelPicker,
    setSupersetWheelPicker,
    onSupersetPickerSelect,
    onAddSupersetExercises,
    pickerContent,
    singleExerciseFieldErrors,
    singleExerciseFormErrorText,
    singleExercisePending,
    onSingleAmountChange,
    closeSingleExerciseModal,
    cardioFieldErrors,
    cardioFormErrorText,
    cardioPending,
    onCardioAmountChange,
    closeCardioExerciseModal,
    supersetSetupFieldErrors,
    supersetSetupFormErrorText,
    supersetSetupPending,
    closeSupersetSetupModal,
    supersetFieldErrors,
    supersetItemsFormErrorText,
    supersetItemsPending,
    closeSupersetItemsModal,
    onRequestDeleteEntry,
    onRequestDeleteNote,
    closePermissionModal,
    onSupersetAmountChange,
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

      <CustomModal
        isVisible={createExerciseModal}
        onDismiss={onCloseCreateNoteModal}
        content={
          <CreateItemContent
            heading={heading}
            createItemFields={createItemFields}
            onChangeText={onChangeText}
            hideModal={onCloseCreateNoteModal}
            btnTitle={btnTitle}
            onBtnPress={onAddNote}
            onDropdownSelect={(data, nextPickerType) => {
              setWheelPickerModal(true);
              setPickerItems(data);
              setPickerType(nextPickerType);
            }}
            isDeleteBtn={isDeleteBtn}
            onDeleteBtnPress={onRequestDeleteNote}
          />
        }
      />

      <CustomModal
        isVisible={singleExerciseModal}
        onDismiss={closeSingleExerciseModal}
        content={
          <AddSingleExercise
            {...props}
            hideModal={closeSingleExerciseModal}
            btnLoader={singleExercisePending}
            submitDisabled={singleExercisePending}
            fieldErrors={singleExerciseFieldErrors}
            formErrorText={singleExerciseFormErrorText}
            setAmount={onSingleAmountChange}
            onBtnPress={onAddSingleExercise}
            onDropdownSelect={(data, nextPickerType) => {
              setPickerItems(data);
              setPickerType(nextPickerType);
              setWheelPickerModal(true);
            }}
            onDeleteBtnPress={onRequestDeleteEntry}
          />
        }
      />

      <CustomModal
        isVisible={supersetModal}
        onDismiss={closeSupersetSetupModal}
        content={
          <SupersetModal
            {...props}
            hideModal={closeSupersetSetupModal}
            btnLoader={supersetSetupPending}
            submitDisabled={supersetSetupPending}
            fieldErrors={supersetSetupFieldErrors}
            formErrorText={supersetSetupFormErrorText}
            onBtnPress={onSupersetModalBtnPress}
            onDropdownSelect={(data, nextPickerType) => {
              setWheelPickerModal(true);
              setPickerItems(data);
              setPickerType(nextPickerType);
            }}
          />
        }
      />

      <CustomModal
        isVisible={isAddSupersetExercise}
        onDismiss={closeSupersetItemsModal}
        content={
          <AddExerciseModal
            {...props}
            hideModal={closeSupersetItemsModal}
            btnLoader={supersetItemsPending}
            submitDisabled={supersetItemsPending}
            formErrorText={supersetItemsFormErrorText}
            supersetFieldErrors={supersetFieldErrors}
            onAmountChange={onSupersetAmountChange}
            onBtnPress={onAddSupersetExercises}
            onDropdownSelect={(data, nextPickerType, index) => {
              setPickerItems(data);
              setPickerType(nextPickerType);
              props.setSupersetExeIndex(index);
              setSupersetWheelPicker(true);
            }}
            onDeleteBtnPress={onRequestDeleteEntry}
          />
        }
      />

      <CustomModal
        isVisible={cardioExeModal}
        onDismiss={closeCardioExerciseModal}
        content={
          <AddCardioExercise
            {...props}
            hideModal={closeCardioExerciseModal}
            btnLoader={cardioPending}
            submitDisabled={cardioPending}
            fieldErrors={cardioFieldErrors}
            formErrorText={cardioFormErrorText}
            setAmount={onCardioAmountChange}
            onBtnPress={onAddCardioExe}
            onDropdownSelect={(data, nextPickerType) => {
              setWheelPickerModal(true);
              setPickerItems(data);
              setPickerType(nextPickerType);
            }}
            onDeleteBtnPress={onRequestDeleteEntry}
          />
        }
      />

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
        onDismiss={closePermissionModal}
        content={
          <PermissionModal
            loader={deleteLoader}
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={onDonePermissionModal}
            onCancel={closePermissionModal}
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
  pickerItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  setPickerType: PropTypes.func.isRequired,
  setPickerItems: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  btnTitle: PropTypes.string.isRequired,
  wheelPickerModal: PropTypes.bool.isRequired,
  setWheelPickerModal: PropTypes.func.isRequired,
  addExerciseOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  addExerciseModal: PropTypes.bool.isRequired,
  setAddExerciseModal: PropTypes.func.isRequired,
  selectedExerciseOption: PropTypes.string.isRequired,
  setSelectedExerciseOption: PropTypes.func.isRequired,
  onNextBtnPress: PropTypes.func.isRequired,
  createExerciseModal: PropTypes.bool.isRequired,
  createItemFields: PropTypes.arrayOf(PropTypes.any).isRequired,
  isAddSupersetExercise: PropTypes.bool.isRequired,
  onEditExercise: PropTypes.func.isRequired,
  isDeleteBtn: PropTypes.bool.isRequired,
  isPermissionModal: PropTypes.bool.isRequired,
  onPickerItemSelect: PropTypes.func.isRequired,
  allDayPlan: PropTypes.arrayOf(PropTypes.any).isRequired,
  singleExerciseModal: PropTypes.bool.isRequired,
  onAddSingleExercise: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  supersetModal: PropTypes.bool.isRequired,
  numberOfExercises: PropTypes.string.isRequired,
  onSupersetModalBtnPress: PropTypes.func.isRequired,
  onAddCardioExe: PropTypes.func.isRequired,
  onAddBtnPress: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  btnLoader: PropTypes.bool.isRequired,
  onSaveHandler: PropTypes.func.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  deleteLoader: PropTypes.bool.isRequired,
  onAddNote: PropTypes.func.isRequired,
  note: PropTypes.string.isRequired,
  onCloseCreateNoteModal: PropTypes.func.isRequired,
  cardioExeModal: PropTypes.bool.isRequired,
  supersetWheelPicker: PropTypes.bool.isRequired,
  setSupersetWheelPicker: PropTypes.func.isRequired,
  onSupersetPickerSelect: PropTypes.func.isRequired,
  onAddSupersetExercises: PropTypes.func.isRequired,
  pickerContent: PropTypes.string.isRequired,
  singleExerciseFieldErrors: PropTypes.objectOf(PropTypes.any).isRequired,
  singleExerciseFormErrorText: PropTypes.string.isRequired,
  singleExercisePending: PropTypes.bool.isRequired,
  onSingleAmountChange: PropTypes.func.isRequired,
  closeSingleExerciseModal: PropTypes.func.isRequired,
  cardioFieldErrors: PropTypes.objectOf(PropTypes.any).isRequired,
  cardioFormErrorText: PropTypes.string.isRequired,
  cardioPending: PropTypes.bool.isRequired,
  onCardioAmountChange: PropTypes.func.isRequired,
  closeCardioExerciseModal: PropTypes.func.isRequired,
  supersetSetupFieldErrors: PropTypes.objectOf(PropTypes.any).isRequired,
  supersetSetupFormErrorText: PropTypes.string.isRequired,
  supersetSetupPending: PropTypes.bool.isRequired,
  closeSupersetSetupModal: PropTypes.func.isRequired,
  supersetFieldErrors: PropTypes.arrayOf(PropTypes.any).isRequired,
  supersetItemsFormErrorText: PropTypes.string.isRequired,
  supersetItemsPending: PropTypes.bool.isRequired,
  closeSupersetItemsModal: PropTypes.func.isRequired,
  onRequestDeleteEntry: PropTypes.func.isRequired,
  onRequestDeleteNote: PropTypes.func.isRequired,
  closePermissionModal: PropTypes.func.isRequired,
  onSupersetAmountChange: PropTypes.func.isRequired,
  setSupersetExeIndex: PropTypes.func.isRequired,
};
