import React from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  ScrollView,
} from 'react-native';
import { Modal, Headline } from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from '../../calendar/components/style';
import CloseIcon from '../../calendar/components/CloseIcon';
import ModalButton from '../../calendar/components/ModalButton';
import { strings, colors } from '../../../resources';
import { TextButton } from '../../../components';

const EditEvent = ({
  visibilityEditEvent,
  hideEditEvent,
  colorTheme,
  showColorPicker,
  modalHeading,
  btnTitle,
  setToTimePickerModal,
  setFromTimePickerModal,
  btnLoader,
  note,
  setNote,
  fromTimeFormat,
  fromHours,
  fromMinutes,
  toHours,
  toMinutes,
  toTimeFormat,
  task,
  setTask,
  onAddThemeItinerary,
  onEditThemeItinerary,
  isDeleteBtn,
  setPermissionModal,
  setCheck,
}) => (
  <Modal
    visible={visibilityEditEvent}
    onDismiss={hideEditEvent}
    contentContainerStyle={styles.editModalContainer}
  >
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Headline style={styles.headline}>{modalHeading}</Headline>
        <CloseIcon onPress={hideEditEvent} />
      </View>
      <Headline style={styles.editTitle}>{strings.editTodo.enterTask}</Headline>
      <TextInput
        value={task}
        placeholder="Enter Task"
        placeholderTextColor={colors.grey}
        onChangeText={text => setTask(text)}
        style={styles.input}
      />
      <Headline style={styles.editTitle}>
        {strings.createEvent.traitColor}
      </Headline>

      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.modalTaskText}>{colorTheme}</Text>
        <TouchableOpacity onPress={showColorPicker}>
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: colorTheme,
              marginLeft: 10,
              borderWidth: 2,
              borderColor: colors.black,
            }}
          />
        </TouchableOpacity>
      </View>
      <Headline style={styles.editTitle}>
        {strings.createEvent.eventTime}
      </Headline>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.modalText}>{strings.createEvent.starts}</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setFromTimePickerModal(true)}
        >
          <Text style={{ color: colors.tertiary, fontSize: 16, margin: 5 }}>
            {fromHours}:{fromMinutes} {fromTimeFormat}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.modalText}>{strings.createEvent.ends}</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setToTimePickerModal(true)}
        >
          <Text style={{ color: colors.tertiary, fontSize: 16, margin: 5 }}>
            {toHours}:{toMinutes} {toTimeFormat}
          </Text>
        </TouchableOpacity>
      </View>
      <Headline style={styles.editTitle}>{strings.editTodo.notes}</Headline>
      <TextInput
        multiline
        value={note}
        placeholder="Notes"
        placeholderTextColor={colors.grey}
        onChangeText={text => setNote(text)}
        style={styles.notesInput}
      />
      <ModalButton
        label={btnTitle}
        loader={btnLoader}
        onPress={
          btnTitle === 'Save' ? onEditThemeItinerary : onAddThemeItinerary
        }
      />
      {isDeleteBtn ? (
        <View style={styles.bottomTextView2}>
          <TextButton
            title="Delete"
            onPress={() => {
              setCheck('delete');
              setPermissionModal(true);
            }}
          />
        </View>
      ) : null}
    </ScrollView>
  </Modal>
);

EditEvent.defaultProps = {
  fromHours: '',
  fromMinutes: '',
  toHours: '',
  toMinutes: '',
};

EditEvent.propTypes = {
  visibilityEditEvent: PropTypes.bool.isRequired,
  hideEditEvent: PropTypes.func.isRequired,
  colorTheme: PropTypes.string.isRequired,
  showColorPicker: PropTypes.func.isRequired,
  modalHeading: PropTypes.string.isRequired,
  btnTitle: PropTypes.string.isRequired,
  setToTimePickerModal: PropTypes.func.isRequired,
  setFromTimePickerModal: PropTypes.func.isRequired,
  note: PropTypes.string.isRequired,
  setNote: PropTypes.func.isRequired,
  task: PropTypes.string.isRequired,
  setTask: PropTypes.func.isRequired,
  fromTimeFormat: PropTypes.string.isRequired,
  fromHours: PropTypes.string,
  fromMinutes: PropTypes.string,
  toTimeFormat: PropTypes.string.isRequired,
  toHours: PropTypes.string,
  toMinutes: PropTypes.string,
  onAddThemeItinerary: PropTypes.func.isRequired,
  btnLoader: PropTypes.bool.isRequired,
  onEditThemeItinerary: PropTypes.func.isRequired,
  isDeleteBtn: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  setCheck: PropTypes.func.isRequired,
};

export default EditEvent;
