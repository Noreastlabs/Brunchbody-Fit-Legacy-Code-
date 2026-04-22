/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
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

const SELECT_DAY_PLACEHOLDER = 'Select Day';

const inlineStyles = StyleSheet.create({
  supportingText: {
    fontSize: 13,
    marginTop: 8,
  },
  supportingTextError: {
    color: colors.qccentError,
  },
  supportingTextInfo: {
    color: colors.textGrey,
  },
});

const EditTodo = props => {
  const {
    visibleEdit,
    hideEditModal,
    checked,
    checkFirst,
    checkSecond,
    datePickerModal,
    setDatePickerModal,
    onUpdateTodo,
    taskName,
    taskNotes,
    taskDayLabel,
    onTaskNameChange,
    onTaskNotesChange,
    onConfirmDatePicker,
    onCancelDatePicker,
    onSaveEditModal,
    editTask,
    onDeleteTodo,
    onShowDeleteDialog,
    visibleDialog,
    loader,
    deleteLoader,
    saveDisabled,
    clearTaskDisabled,
    canDeleteTodo,
    taskErrorText,
    dayErrorText,
    formErrorText,
    heading,
  } = props;
  const isActionPending = loader || deleteLoader;
  const renderSupportingText = (text, tone = 'error') => {
    if (!text) {
      return null;
    }

    return (
      <Text
        style={[
          inlineStyles.supportingText,
          tone === 'error'
            ? inlineStyles.supportingTextError
            : inlineStyles.supportingTextInfo,
        ]}>
        {text}
      </Text>
    );
  };

  return (
    <Modal
      visible={visibleEdit}
      onDismiss={isActionPending ? () => {} : hideEditModal}
      contentContainerStyle={styles.editModalContainer}>
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingVertical: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Headline style={styles.headline}>{heading}</Headline>
          <CloseIcon onPress={isActionPending ? () => {} : hideEditModal} />
        </View>

        <Headline style={styles.editTitle}>
          {strings.editTodo.enterTask}
        </Headline>
        <TextInput
          value={taskName}
          placeholder="Enter Task"
          placeholderTextColor={colors.grey}
          onChangeText={text => onTaskNameChange(text)}
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
                status={
                  checked === strings.calendar.someday ? 'checked' : 'unchecked'
                }
                onPress={checkFirst}
                uncheckedColor={colors.nonEditableOverlays}
              />
              <Text style={styles.modalText}>{strings.editTodo.someday}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <RadioButton.Android
                value="Pick a day"
                status={
                  checked === strings.calendar.pickday ? 'checked' : 'unchecked'
                }
                onPress={checkSecond}
                uncheckedColor={colors.nonEditableOverlays}
              />
              <Text style={styles.modalText}>{strings.editTodo.pickDay}</Text>
            </View>
          </View>

          {checked === strings.calendar.pickday ? (
            <View style={{alignItems: 'center'}}>
              <Headline
                style={[styles.editTitle, {fontSize: 20, marginBottom: 0}]}>
                Select Day
              </Headline>
              <TouchableOpacity
                activeOpacity={0.5}
                disabled={isActionPending}
                onPress={() => setDatePickerModal(true)}>
                <Text
                  style={[
                    styles.dateText,
                    !taskDayLabel ? inlineStyles.supportingTextInfo : null,
                  ]}>
                  {taskDayLabel || SELECT_DAY_PLACEHOLDER}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <Headline style={styles.editTitle}>{strings.editTodo.notes}</Headline>
        <TextInput
          multiline
          value={taskNotes}
          placeholder="Notes"
          placeholderTextColor={colors.grey}
          style={styles.notesInput}
          onChangeText={text => onTaskNotesChange(text)}
        />
        {renderSupportingText(taskErrorText)}
        {renderSupportingText(dayErrorText)}
        {renderSupportingText(formErrorText)}
        <ModalButton
          onPress={editTask ? onUpdateTodo : onSaveEditModal}
          label={strings.button.save}
          loader={loader}
          disabled={saveDisabled}
        />
        {canDeleteTodo ? (
          <View style={styles.bottomTextView}>
            <TextButton
              title="Clear Task"
              disabled={clearTaskDisabled}
              onPress={onShowDeleteDialog}
            />
          </View>
        ) : null}
      </ScrollView>

      <CustomModal
        isVisible={visibleEdit && datePickerModal}
        onDismiss={onCancelDatePicker}
        content={
          <DatePickerModal
            {...props}
            onConfirm={onConfirmDatePicker}
            onCancel={onCancelDatePicker}
          />
        }
      />

      <CustomModal
        isVisible={visibleEdit && visibleDialog}
        onDismiss={() => {
          if (!deleteLoader) {
            props.setvisibleDialog(false);
          }
        }}
        content={
          <PermissionModal
            loader={deleteLoader}
            onDone={onDeleteTodo}
            onCancel={() => {
              if (!deleteLoader) {
                props.setvisibleDialog(false);
              }
            }}
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
  taskName: PropTypes.string.isRequired,
  taskNotes: PropTypes.string.isRequired,
  taskDayLabel: PropTypes.string.isRequired,
  taskErrorText: PropTypes.string.isRequired,
  dayErrorText: PropTypes.string.isRequired,
  formErrorText: PropTypes.string.isRequired,
  onTaskNameChange: PropTypes.func.isRequired,
  onTaskNotesChange: PropTypes.func.isRequired,
  onConfirmDatePicker: PropTypes.func.isRequired,
  onCancelDatePicker: PropTypes.func.isRequired,
  onUpdateTodo: PropTypes.func.isRequired,
  onShowDeleteDialog: PropTypes.func.isRequired,
  setvisibleDialog: PropTypes.func.isRequired,
  editTask: PropTypes.bool.isRequired,
  onDeleteTodo: PropTypes.func.isRequired,
  visibleDialog: PropTypes.bool.isRequired,
  loader: PropTypes.bool.isRequired,
  onSaveEditModal: PropTypes.func.isRequired,
  deleteLoader: PropTypes.bool.isRequired,
  saveDisabled: PropTypes.bool.isRequired,
  clearTaskDisabled: PropTypes.bool.isRequired,
  canDeleteTodo: PropTypes.bool.isRequired,
  heading: PropTypes.string.isRequired,
};

export default EditTodo;
