/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import {
  CustomHeader,
  CustomModal,
  Dashed,
  PermissionModal,
  SafeAreaWrapper,
  TimePickerModal,
} from '../../../components';
import { colors, wheelPickerItems } from '../../../resources';
import Picker from '../../calendar/components/ColorPicker';
import EditEvent from './EditEvent';
import Itinerary from './Itinerary';
import TimeBlock from './TimeBlock';
import styles from './style';

export default function NewDay(props) {
  const {
    timeData,
    newColor,
    setnewColor,
    modalHeading,
    btnTitle,
    visibilityEditEvent,
    setvisibilityEditEvent,
    visibleColorPicker,
    setvisibleColorPicker,
    setIsTimePickerModal,
    theme,
    onAddThemeItinerary,
    onEditThemeItinerary,
    onDonePermissionModal,
    fromTimePickerModal,
    setFromTimePickerModal,
    toTimePickerModal,
    setToTimePickerModal,
    permissionModal,
    setPermissionModal,
    alertText,
    alertHeading,
    btnLoader,
    deleteLoader,
    isDeleteBtn,
    toHours,
    toMinutes,
    setToHours,
    setToMinutes,
    toTimeFormat,
    setToTimeFormat,
    fromHours,
    fromMinutes,
    setFromHours,
    setFromMinutes,
    fromTimeFormat,
    setFromTimeFormat,
    note,
    setNote,
    task,
    setTask,
    setCheck,
    setEditTask,
    onCancelPermissionModal,
  } = props;

  return (
    <SafeAreaWrapper style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <CustomHeader />
        <View style={styles.headingView}>
          <Text style={styles.headingText2}>{theme.name} Day</Text>
        </View>
        <TimeBlock {...props} timeData={timeData} type="newDay" />
        <View style={styles.setMargin1}>
          <Dashed />
        </View>
        <Itinerary
          {...props}
          showIcon
          type="newDay"
          heading="Itinerary"
          color={colors.secondary}
          timeData={theme.itinerary}
          showEditEvent={() => setvisibilityEditEvent(true)}
        />
      </ScrollView>

      <EditEvent
        visibilityEditEvent={visibilityEditEvent}
        colorTheme={newColor}
        showColorPicker={() => setvisibleColorPicker(true)}
        hideEditEvent={() => {
          setEditTask(false);
          setvisibilityEditEvent(false);
        }}
        modalHeading={modalHeading}
        btnTitle={btnTitle}
        setIsTimePickerModal={setIsTimePickerModal}
        isDeleteBtn={isDeleteBtn}
        btnLoader={btnLoader}
        onAddThemeItinerary={onAddThemeItinerary}
        onEditThemeItinerary={onEditThemeItinerary}
        setToTimePickerModal={setToTimePickerModal}
        setFromTimePickerModal={setFromTimePickerModal}
        note={note}
        setNote={setNote}
        task={task}
        setTask={setTask}
        fromHours={fromHours}
        fromMinutes={fromMinutes}
        fromTimeFormat={fromTimeFormat}
        toHours={toHours}
        toMinutes={toMinutes}
        toTimeFormat={toTimeFormat}
        setPermissionModal={setPermissionModal}
        setCheck={setCheck}
      />

      <Picker
        visibleColorPicker={visibleColorPicker}
        hideColorPicker={() => setvisibleColorPicker(false)}
        changeColor={color => setnewColor(color)}
        newColor={newColor}
      />

      <CustomModal
        isVisible={fromTimePickerModal}
        onDismiss={() => setFromTimePickerModal(false)}
        content={
          <TimePickerModal
            currentHours={fromHours}
            currentMinutes={fromMinutes}
            setHours={setFromHours}
            setMinutes={setFromMinutes}
            timeFormat={fromTimeFormat}
            setTimeFormat={setFromTimeFormat}
            hoursData={wheelPickerItems.hours}
            minutesData={wheelPickerItems.minutesWithDiff15}
            onConfirm={() => setFromTimePickerModal(false)}
            onCancel={() => setFromTimePickerModal(false)}
          />
        }
      />

      <CustomModal
        isVisible={toTimePickerModal}
        onDismiss={() => setToTimePickerModal(false)}
        content={
          <TimePickerModal
            currentHours={toHours}
            currentMinutes={toMinutes}
            setHours={setToHours}
            setMinutes={setToMinutes}
            timeFormat={toTimeFormat}
            setTimeFormat={setToTimeFormat}
            hoursData={wheelPickerItems.hours}
            minutesData={wheelPickerItems.minutesWithDiff15}
            onConfirm={() => setToTimePickerModal(false)}
            onCancel={() => setToTimePickerModal(false)}
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
            onCancel={onCancelPermissionModal}
          />
        }
      />
    </SafeAreaWrapper>
  );
}

NewDay.propTypes = {
  timeData: PropTypes.arrayOf(PropTypes.any).isRequired,
  newColor: PropTypes.string.isRequired,
  setnewColor: PropTypes.func.isRequired,
  modalHeading: PropTypes.string.isRequired,
  btnTitle: PropTypes.string.isRequired,
  visibilityEditEvent: PropTypes.bool.isRequired,
  setvisibilityEditEvent: PropTypes.func.isRequired,
  visibleColorPicker: PropTypes.bool.isRequired,
  setvisibleColorPicker: PropTypes.func.isRequired,
  setIsTimePickerModal: PropTypes.func.isRequired,
  theme: PropTypes.objectOf(PropTypes.any).isRequired,
  onAddThemeItinerary: PropTypes.func.isRequired,
  onEditThemeItinerary: PropTypes.func.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  fromTimePickerModal: PropTypes.bool.isRequired,
  setFromTimePickerModal: PropTypes.func.isRequired,
  toTimePickerModal: PropTypes.bool.isRequired,
  setToTimePickerModal: PropTypes.func.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  alertText: PropTypes.string.isRequired,
  alertHeading: PropTypes.string.isRequired,
  btnLoader: PropTypes.bool.isRequired,
  deleteLoader: PropTypes.bool.isRequired,
  isDeleteBtn: PropTypes.bool.isRequired,
  toHours: PropTypes.string.isRequired,
  toMinutes: PropTypes.string.isRequired,
  setToHours: PropTypes.func.isRequired,
  setToMinutes: PropTypes.func.isRequired,
  toTimeFormat: PropTypes.string.isRequired,
  setToTimeFormat: PropTypes.func.isRequired,
  fromHours: PropTypes.string.isRequired,
  fromMinutes: PropTypes.string.isRequired,
  setFromHours: PropTypes.func.isRequired,
  setFromMinutes: PropTypes.func.isRequired,
  fromTimeFormat: PropTypes.string.isRequired,
  setFromTimeFormat: PropTypes.func.isRequired,
  note: PropTypes.string.isRequired,
  setNote: PropTypes.func.isRequired,
  task: PropTypes.string.isRequired,
  setTask: PropTypes.func.isRequired,
  setCheck: PropTypes.func.isRequired,
  setEditTask: PropTypes.bool.isRequired,
  onCancelPermissionModal: PropTypes.func.isRequired,
};
