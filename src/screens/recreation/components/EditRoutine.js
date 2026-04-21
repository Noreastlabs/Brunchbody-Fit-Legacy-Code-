/* eslint-disable react/jsx-props-no-spreading */
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
} from '../../../components';
import {colors} from '../../../resources';
import styles from './style';

export default function EditRoutine(props) {
  const {
    route,
    myRoutineTasks,
    isVisible,
    setIsVisible,
    heading,
    createItemModal,
    closeCreateTaskModal,
    createTaskFields,
    editTaskModal,
    closeEditTaskModal,
    permissionModal,
    setPermissionModal,
    onRoutineTaskHandler,
    onTaskNameChange,
    onCreateItem,
    onDonePermissionModal,
    alertHeading,
    alertText,
    setCheck,
    onEditItem,
    onOpenCreateTaskModal,
    onOpenEditTaskModal,
    createItemFormErrorText,
    editItemFormErrorText,
    createItemPending,
    editItemPending,
    deleteLoader,
  } = props;
  const {selectedItem} = route.params;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />

        <View style={styles.headingView}>
          <Text style={styles.subHeading2}>{selectedItem.name}</Text>
        </View>

        <View style={styles.setMargin}>
          {myRoutineTasks?.map(item => (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => onRoutineTaskHandler(item)}>
              <Text
                key={item.id}
                style={[styles.textStyle3, {color: colors.tertiary}]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={{marginTop: 10}}>
            <AddButton
              onPress={onOpenCreateTaskModal}
            />
          </View>
        </View>
      </ScrollView>

      <CustomModal
        isVisible={isVisible}
        onDismiss={() => setIsVisible(false)}
        content={
          <ModalContent
            heading={heading}
            hideModal={() => setIsVisible(false)}
            btnTitle="Edit"
            onBtnPress={onOpenEditTaskModal}
            isDeleteBtn
            onDeleteBtnPress={() => {
              setPermissionModal(true);
              setCheck('delete');
            }}
          />
        }
      />

      {/* Create new task modal */}
      <CustomModal
        isVisible={createItemModal}
        onDismiss={closeCreateTaskModal}
        content={
          <CreateItemContent
            heading="Add Task"
            createItemFields={createTaskFields}
            onChangeText={onTaskNameChange}
            hideModal={closeCreateTaskModal}
            btnTitle="Add"
            loader={createItemPending}
            formErrorText={createItemFormErrorText}
            onBtnPress={onCreateItem}
          />
        }
      />

      {/* Edit task modal */}
      <CustomModal
        isVisible={editTaskModal}
        onDismiss={closeEditTaskModal}
        content={
          <CreateItemContent
            heading="Edit Task"
            createItemFields={createTaskFields}
            onChangeText={onTaskNameChange}
            hideModal={closeEditTaskModal}
            btnTitle="Save"
            loader={editItemPending}
            formErrorText={editItemFormErrorText}
            onBtnPress={onEditItem}
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

EditRoutine.defaultProps = {
  route: {},
};

EditRoutine.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  myRoutineTasks: PropTypes.arrayOf(PropTypes.any).isRequired,
  isVisible: PropTypes.bool.isRequired,
  setIsVisible: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  createTaskFields: PropTypes.arrayOf(PropTypes.any).isRequired,
  createItemModal: PropTypes.bool.isRequired,
  closeCreateTaskModal: PropTypes.func.isRequired,
  editTaskModal: PropTypes.bool.isRequired,
  closeEditTaskModal: PropTypes.func.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  onRoutineTaskHandler: PropTypes.func.isRequired,
  onTaskNameChange: PropTypes.func.isRequired,
  onCreateItem: PropTypes.func.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  setCheck: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
  onOpenCreateTaskModal: PropTypes.func.isRequired,
  onOpenEditTaskModal: PropTypes.func.isRequired,
  createItemFormErrorText: PropTypes.string.isRequired,
  editItemFormErrorText: PropTypes.string.isRequired,
  createItemPending: PropTypes.bool.isRequired,
  editItemPending: PropTypes.bool.isRequired,
  deleteLoader: PropTypes.bool.isRequired,
};
