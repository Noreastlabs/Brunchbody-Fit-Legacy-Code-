/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {View, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import {Modal, Text, RadioButton, Headline} from 'react-native-paper';
import PropTypes from 'prop-types';
import {
  TextButton,
  CustomModal,
  DatePickerModal,
  PermissionModal,
} from '../../../components';
import ModalButton from './ModalButton';
import {colors, strings} from '../../../resources';
import CloseIcon from './CloseIcon';
import styles from './style';

const EditTodo = props => {
  const {
    visibleEdit,
    hideEditModal,
    checked,
    checkFirst,
    checkSecond,
    datePickerModal,
    setDatePickerModal,
    date,
    month,
    year,
    isDateSelected,
    setIsDateSelected,
    onUpdateTodo,
    settaskName,
    todoTask,
    settaskNotes,
    onSaveEditModal,
    setvisibleDialog,
    editTask,
    onDeleteTodo,
    visibleDialog,
    loader,
    deleteLoader,
    heading,
  } = props;

  return (
    <Modal
      visible={visibleEdit}
      onDismiss={hideEditModal}
      contentContainerStyle={styles.editModalContainer}>
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingVertical: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Headline style={styles.headline}>{heading}</Headline>
          <CloseIcon onPress={hideEditModal} />
        </View>

        <Headline style={styles.editTitle}>
          {strings.editTodo.enterTask}
        </Headline>
        <TextInput
          placeholder="Enter Task"
          defaultValue={editTask ? todoTask.name : null}
          placeholderTextColor={colors.grey}
          onChangeText={text => settaskName(text)}
          style={styles.input}
        />

        <Headline style={styles.editTitle}>
          {strings.editTodo.selectTime}
        </Headline>
        <View style={styles.selectTimeOptionsView}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <RadioButton.Android
                value="Someday"
                status={checked === 'Someday' ? 'checked' : 'unchecked'}
                onPress={checkFirst}
                uncheckedColor={colors.nonEditableOverlays}
              />
              <Text style={styles.modalText}>{strings.editTodo.someday}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <RadioButton.Android
                value="Pick a day"
                status={checked === 'Pick a day' ? 'checked' : 'unchecked'}
                onPress={checkSecond}
                uncheckedColor={colors.nonEditableOverlays}
              />
              <Text style={styles.modalText}>{strings.editTodo.pickDay}</Text>
            </View>
          </View>

          {checked === 'Pick a day' ? (
            <View style={{alignItems: 'center'}}>
              <Headline
                style={[styles.editTitle, {fontSize: 20, marginBottom: 0}]}>
                Select Day
              </Headline>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setDatePickerModal(true)}>
                <Text style={styles.dateText}>
                  {editTask && todoTask.day !== strings.todo.someday
                    ? `${new Date(todoTask.day).getMonth() + 1}/${new Date(
                        todoTask.day,
                      ).getDate()}/${new Date(todoTask.day).getFullYear()}`
                    : isDateSelected
                    ? `${month}/${date}/${year}`
                    : `${
                        new Date().getMonth() + 1
                      }/${new Date().getDate()}/${new Date().getFullYear()}`}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <Headline style={styles.editTitle}>{strings.editTodo.notes}</Headline>
        <TextInput
          multiline
          defaultValue={editTask ? todoTask.notes : null}
          placeholder="Notes"
          placeholderTextColor={colors.grey}
          style={styles.notesInput}
          onChangeText={text => settaskNotes(text)}
        />
        <ModalButton
          onPress={editTask ? onUpdateTodo : onSaveEditModal}
          label={strings.button.save}
          loader={loader}
        />
        {editTask ? (
          <View style={styles.bottomTextView}>
            <TextButton
              title="Clear Task"
              onPress={() => {
                setvisibleDialog(true);
              }}
            />
          </View>
        ) : null}
      </ScrollView>

      <CustomModal
        isVisible={datePickerModal}
        onDismiss={() => setDatePickerModal(false)}
        content={
          <DatePickerModal
            {...props}
            onConfirm={() => {
              setIsDateSelected(true);
              setDatePickerModal(false);
            }}
            onCancel={() => {
              setIsDateSelected(false);
              setDatePickerModal(false);
            }}
          />
        }
      />

      <CustomModal
        isVisible={visibleDialog}
        onDismiss={() => setvisibleDialog(false)}
        content={
          <PermissionModal
            loader={deleteLoader}
            onDone={onDeleteTodo}
            onCancel={() => setvisibleDialog(false)}
          />
        }
      />
    </Modal>
  );
};

EditTodo.propTypes = {
  visibleEdit: PropTypes.bool.isRequired,
  hideEditModal: PropTypes.func.isRequired,
  checked: PropTypes.string.isRequired,
  checkFirst: PropTypes.func.isRequired,
  checkSecond: PropTypes.func.isRequired,
  datePickerModal: PropTypes.bool.isRequired,
  setDatePickerModal: PropTypes.func.isRequired,
  date: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  isDateSelected: PropTypes.bool.isRequired,
  setIsDateSelected: PropTypes.func.isRequired,
  todoTask: PropTypes.objectOf(PropTypes.any).isRequired,
  onUpdateTodo: PropTypes.func.isRequired,
  setvisibleDialog: PropTypes.func.isRequired,
  settaskNotes: PropTypes.func.isRequired,
  settaskName: PropTypes.func.isRequired,
  editTask: PropTypes.bool.isRequired,
  onDeleteTodo: PropTypes.func.isRequired,
  visibleDialog: PropTypes.bool.isRequired,
  loader: PropTypes.bool.isRequired,
  onSaveEditModal: PropTypes.func.isRequired,
  deleteLoader: PropTypes.bool.isRequired,
  heading: PropTypes.string.isRequired,
};

export default EditTodo;
