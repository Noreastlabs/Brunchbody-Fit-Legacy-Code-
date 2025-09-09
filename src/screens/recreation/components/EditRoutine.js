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
    setCreateItemModal,
    createTaskFields,
    editTaskModal,
    setEditTaskModal,
    permissionModal,
    setPermissionModal,
    onRoutineTaskHandler,
    itemName,
    setItemName,
    onCreateItem,
    onDonePermissionModal,
    alertHeading,
    alertText,
    setCheck,
    onEditItem,
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
              onPress={() => {
                setCreateItemModal(true);
                setItemName('');
                createTaskFields[0].value = '';
              }}
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
            onBtnPress={() => {
              setIsVisible(false);
              setEditTaskModal(true);
            }}
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
        onDismiss={() => setCreateItemModal(false)}
        content={
          <CreateItemContent
            {...props}
            heading="Add Task"
            createItemFields={createTaskFields}
            value={itemName}
            onChangeText={text => setItemName(text)}
            hideModal={() => setCreateItemModal(false)}
            btnTitle="Add"
            onBtnPress={onCreateItem}
          />
        }
      />

      {/* Edit task modal */}
      <CustomModal
        isVisible={editTaskModal}
        onDismiss={() => setEditTaskModal(false)}
        content={
          <CreateItemContent
            {...props}
            heading="Edit Task"
            createItemFields={createTaskFields}
            value={itemName}
            onChangeText={text => {
              setItemName(text);
              createTaskFields[0].value = text;
            }}
            hideModal={() => setEditTaskModal(false)}
            btnTitle="Save"
            onBtnPress={onEditItem}
          />
        }
      />

      <CustomModal
        isVisible={permissionModal}
        onDismiss={() => setPermissionModal(false)}
        content={
          <PermissionModal
            {...props}
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
  setCreateItemModal: PropTypes.func.isRequired,
  editTaskModal: PropTypes.bool.isRequired,
  setEditTaskModal: PropTypes.func.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  onRoutineTaskHandler: PropTypes.func.isRequired,
  itemName: PropTypes.string.isRequired,
  setItemName: PropTypes.func.isRequired,
  onCreateItem: PropTypes.func.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  setCheck: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
};
