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
    setHeading,
    isVisible,
    setIsVisible,
    permissionModal,
    setPermissionModal,
    createItemModal,
    setCreateItemModal,
    editExerciseModal,
    setEditExerciseModal,
    createExerciseFields,
    wheelPickerModal,
    setWheelPickerModal,
    exerciseName,
    setExerciseName,
    onAddExercise,
    onEditExercise,
    setExerciseId,
    onDonePermissionModal,
    equivalentExercise,
    setEquivalentExercise,
    btnLoader,
    alertHeading,
    alertText,
    setCheck,
    exerciseType,
    setExerciseType,
    exeTypeModal,
    setExeTypeModal,
    exerciseTypeOptions,
    onNextBtnPress,
    pickerExercises,
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
              onPress={() => {
                // console.log('item.id: ', item.id);
                setHeading(item.name);
                setExerciseId(item.id);
                setExerciseName(item.name);
                setEquivalentExercise(
                  pickerExercises?.find(
                    a => a.name === item.equivalentExercise,
                  ) || item,
                );
                setExerciseType(item.type);
                setIsVisible(true);
              }}>
              <Text style={[styles.textStyle3, {color: colors.tertiary}]}>
                {item.name || item.value}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={{marginTop: 10}}>
            <AddButton
              onPress={() => {
                setExeTypeModal(true);
                setExerciseName('');
                setEquivalentExercise('');
              }}
            />
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
            onBtnPress={() => {
              setIsVisible(false);
              setEditExerciseModal(true);
            }}
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
        onDismiss={() => setCreateItemModal(false)}
        content={
          <CreateItemContent
            loader={btnLoader}
            heading="Add Exercise"
            value={exerciseName}
            selectedPickerItem={equivalentExercise.name}
            onChangeText={text => setExerciseName(text)}
            createItemFields={createExerciseFields}
            hideModal={() => setCreateItemModal(false)}
            btnTitle="Add"
            onBtnPress={onAddExercise}
            onDropdownSelect={() => setWheelPickerModal(true)}
          />
        }
      />

      {/* Edit exercise modal */}
      <CustomModal
        isVisible={editExerciseModal}
        onDismiss={() => setEditExerciseModal(false)}
        content={
          <CreateItemContent
            loader={btnLoader}
            heading="Edit Exercise"
            value={exerciseName}
            selectedPickerItem={equivalentExercise.name}
            onChangeText={text => setExerciseName(text)}
            createItemFields={createExerciseFields}
            hideModal={() => setEditExerciseModal(false)}
            btnTitle="Save"
            onBtnPress={() => onEditExercise(false)}
            onDropdownSelect={() => setWheelPickerModal(true)}
          />
        }
      />

      <CustomModal
        isVisible={wheelPickerModal}
        onDismiss={() => setWheelPickerModal(false)}
        content={
          <WheelPickerContent
            pickerItems={pickerExercises.filter(
              i => i.type.toLowerCase() === exerciseType.toLowerCase(),
            )}
            onValueChange={index => {
              setEquivalentExercise(pickerExercises[index - 1]);
            }}
            onConfirm={() => setWheelPickerModal(false)}
            onCancel={() => {
              setEquivalentExercise('');
              setWheelPickerModal(false);
            }}
          />
        }
      />

      <CustomModal
        isVisible={permissionModal}
        onDismiss={() => setPermissionModal(false)}
        content={
          <PermissionModal
            loader={btnLoader}
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
  setHeading: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  setIsVisible: PropTypes.func.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  createItemModal: PropTypes.bool.isRequired,
  setCreateItemModal: PropTypes.func.isRequired,
  editExerciseModal: PropTypes.bool.isRequired,
  setEditExerciseModal: PropTypes.func.isRequired,
  createExerciseFields: PropTypes.arrayOf(PropTypes.any).isRequired,
  wheelPickerModal: PropTypes.bool.isRequired,
  setWheelPickerModal: PropTypes.func.isRequired,
  exerciseName: PropTypes.string.isRequired,
  setExerciseName: PropTypes.func.isRequired,
  onAddExercise: PropTypes.func.isRequired,
  onEditExercise: PropTypes.func.isRequired,
  setExerciseId: PropTypes.func.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  equivalentExercise: PropTypes.objectOf(PropTypes.any).isRequired,
  setEquivalentExercise: PropTypes.func.isRequired,
  btnLoader: PropTypes.bool.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  setCheck: PropTypes.func.isRequired,
  exerciseType: PropTypes.string.isRequired,
  setExerciseType: PropTypes.func.isRequired,
  exeTypeModal: PropTypes.bool.isRequired,
  setExeTypeModal: PropTypes.func.isRequired,
  exerciseTypeOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  onNextBtnPress: PropTypes.func.isRequired,
  pickerExercises: PropTypes.arrayOf(PropTypes.any).isRequired,
};
