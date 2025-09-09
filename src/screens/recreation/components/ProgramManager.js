/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Button,
  CustomHeader,
  CustomModal,
  ModalContent,
  PermissionModal,
  ProgramDetailModal,
  SelectComp,
  WeeklyTable,
  WheelPickerContent,
} from '../../../components';
import styles from './style';
import {colors} from '../../../resources';

export default function ProgramManager(props) {
  const {
    route,
    pickerItems,
    heading,
    subText,
    btnTitle,
    showDeleteBtn,
    isVisible,
    setIsVisible,
    wheelPickerModal,
    setWheelPickerModal,
    permissionModal,
    setPermissionModal,
    onWeekDayPress,
    onModalBtnPress,
    isProgramDetailModal,
    setIsProgramDetailModal,
    programData,
    isErrorModal,
    setIsErrorModal,
    loader,
    getWeekPlan,
    myWeekPlan,
    setWeekNumber,
    weekNumber,
    tempWeek,
    alertHeading,
    alertText,
    deleteLoader,
    setCheck,
    onDonePermissionModal,
  } = props;
  const {selectedItem, program} = route.params;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />

        <View style={styles.headingView}>
          <Text style={styles.subHeading2}>{selectedItem.name}</Text>
        </View>

        <SelectComp
          title="Choose Week"
          type={weekNumber || 'Week'}
          onPress={() => setWheelPickerModal(true)}
        />

        <View style={styles.btnView}>
          <Button title="Go To" onPress={() => getWeekPlan()} />
        </View>

        {loader ? (
          <ActivityIndicator
            size="large"
            color={colors.white}
            style={styles.setMargin}
          />
        ) : (
          <View style={styles.tableView}>
            <WeeklyTable
              {...props}
              onPress={onWeekDayPress}
              data={myWeekPlan?.weekDays || []}
            />
          </View>
        )}
      </ScrollView>

      <CustomModal
        isVisible={isVisible}
        onDismiss={() => setIsVisible(false)}
        content={
          <ModalContent
            heading={heading}
            subText={program === 'Brunch Program' ? '' : subText}
            hideModal={() => setIsVisible(false)}
            btnTitle={btnTitle}
            onBtnPress={onModalBtnPress}
            isDeleteBtn={showDeleteBtn}
            onDeleteBtnPress={() => {
              setPermissionModal(true);
              setCheck('delete');
            }}
          />
        }
      />

      {/* View Program Detail Modal */}
      <CustomModal
        isVisible={isProgramDetailModal}
        onDismiss={() => setIsProgramDetailModal(false)}
        content={
          <ProgramDetailModal
            heading={selectedItem.name}
            subHeading={subText}
            programData={programData}
            hideModal={() => setIsProgramDetailModal(false)}
          />
        }
      />

      <CustomModal
        isVisible={wheelPickerModal}
        onDismiss={() => setWheelPickerModal(false)}
        content={
          <WheelPickerContent
            pickerItems={pickerItems}
            onValueChange={index => setWeekNumber(pickerItems[index - 1].value)}
            onConfirm={() => setWheelPickerModal(false)}
            onCancel={() => {
              setWeekNumber(tempWeek);
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
            loader={deleteLoader}
            heading={alertHeading}
            text={alertText}
            onDone={onDonePermissionModal}
            onCancel={() => setPermissionModal(false)}
          />
        }
      />

      {/* Error Modal */}
      <CustomModal
        isVisible={isErrorModal}
        onDismiss={() => setIsErrorModal(false)}
        content={
          <PermissionModal
            isCancelBtn={false}
            heading="Error"
            text="Cannot Edit Brunch Body Plans."
            onDone={() => setIsErrorModal(false)}
            onCancel={() => setIsErrorModal(false)}
          />
        }
      />
    </SafeAreaView>
  );
}

ProgramManager.defaultProps = {
  route: {},
};

ProgramManager.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  btnTitle: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
  showDeleteBtn: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,
  setIsVisible: PropTypes.func.isRequired,
  wheelPickerModal: PropTypes.bool.isRequired,
  setWheelPickerModal: PropTypes.func.isRequired,
  pickerItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  setPickerItems: PropTypes.func.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  onWeekDayPress: PropTypes.func.isRequired,
  onModalBtnPress: PropTypes.func.isRequired,
  isProgramDetailModal: PropTypes.bool.isRequired,
  setIsProgramDetailModal: PropTypes.func.isRequired,
  programData: PropTypes.arrayOf(PropTypes.any).isRequired,
  isErrorModal: PropTypes.bool.isRequired,
  setIsErrorModal: PropTypes.func.isRequired,
  loader: PropTypes.bool.isRequired,
  getWeekPlan: PropTypes.func.isRequired,
  myWeekPlan: PropTypes.objectOf(PropTypes.any).isRequired,
  setWeekNumber: PropTypes.func.isRequired,
  weekNumber: PropTypes.string.isRequired,
  tempWeek: PropTypes.string.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  deleteLoader: PropTypes.bool.isRequired,
  setCheck: PropTypes.func.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
};
