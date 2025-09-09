import PropTypes from 'prop-types';
import { Image, ScrollView, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  AddWorkoutModal,
  CreateItemContent,
  CustomModal,
  DatePickerModal,
  ModalContent,
  PermissionModal,
  ProgramDetailModal,
  SafeAreaWrapper,
  SelectModalContent,
  TopTabs,
  WheelPickerContent,
} from '../../../components';
import { colors, images } from '../../../resources';
import BodyPlans from './BodyPlans';
import MyRoutines from './MyRoutines';
import MyWorkout from './MyWorkout';
import styles from './style';

export default function Recreation(props) {
  const {
    tab,
    setTab,
    isVisible,
    setIsVisible,
    heading,
    subText,
    onNavigate,
    btnTitle,
    createItemModal,
    setCreateItemModal,
    createItemFields,
    pickerItems,
    wheelPickerModal,
    setWheelPickerModal,
    setPickerItems,
    workoutOptions,
    selectedWorkoutOption,
    setSelectedWorkoutOption,
    workoutModal,
    onWorkoutModalClose,
    onWorkoutOptionSelect,
    permissionModal,
    setPermissionModal,
    isDeleteWorkout,
    onDeleteHandler,
    showDeleteBtn,
    isProgramDetailModal,
    setIsProgramDetailModal,
    isCreateWorkoutModal,
    setIsCreateWorkoutModal,
    sequenceOptions,
    selectedSequence,
    setSelectedSequence,
    datePickerModal,
    setDatePickerModal,
    programMenuOptions,
    programMenuModal,
    setProgramMenuModal,
    selectedProgramMenuOption,
    setSelectedProgramMenuOption,
    onProgramMenuSelect,
    onCreateItem,
    title,
    setTitle,
    setPickerType,
    onPickerItemSelect,
    week,
    onCancelWheelPicker,
    loader,
    alertHeading,
    alertText,
    onDonePermissionModal,
    addMyWorkoutHandler,
    selectedWorkout,
    setSelectedWorkout,
    selectedItem,
    onConfirmDatePicker,
    onCancelDatePicker,
    setCheck,
    onMarkWorkoutComplete,
    programPlanLoader,
  } = props;

  const tabs = [
    {
      tab: 1,
      childView: (
        <FontAwesome5
          name="heartbeat"
          size={RFValue(45)}
          color={tab === 1 ? colors.white : colors.secondaryIcon}
        />
      ),
    },
    {
      tab: 2,
      childView: (
        <FontAwesome5
          name="briefcase-medical"
          size={RFValue(45)}
          color={tab === 2 ? colors.white : colors.secondaryIcon}
        />
      ),
    },
    {
      tab: 3,
      childView: (
        <Image
          source={images.rotatingArrows}
          style={{
            height: RFValue(40),
            width: RFValue(40),
            tintColor: tab === 3 ? colors.white : colors.secondaryIcon,
          }}
        />
      ),
    },
  ];

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headingView}>
          <Text style={styles.headingText}>Recreation</Text>
          <Text style={styles.subHeading1}>
            {tab === 1
              ? 'My Workout'
              : tab === 2
              ? 'Program Manager'
              : 'Routine Manager'}
          </Text>

          <View style={styles.topTabsView}>
            {tabs.map(item => (
              <>
                <TopTabs
                  childView={item.childView}
                  onPress={() => setTab(item.tab)}
                />
                {item.tab < 3 ? <View style={styles.separator} /> : null}
              </>
            ))}
          </View>
        </View>

        {tab === 1 ? (
          <MyWorkout {...props} />
        ) : tab === 2 ? (
          <BodyPlans {...props} />
        ) : (
          <MyRoutines {...props} />
        )}
      </ScrollView>

      <CustomModal
        isVisible={isVisible}
        onDismiss={() => setIsVisible(false)}
        content={
          <ModalContent
            heading={heading}
            subText={subText}
            hideModal={() => setIsVisible(false)}
            btnTitle={btnTitle}
            onBtnPress={() => {
              setIsVisible(false);
              onNavigate();
            }}
            isDeleteBtn={showDeleteBtn}
            onDeleteBtnPress={onDeleteHandler}
          />
        }
      />

      {/* Add workout / Select Program modal */}
      <CustomModal
        isVisible={workoutModal}
        onDismiss={onWorkoutModalClose}
        content={
          <SelectModalContent
            select
            returnItem
            heading={heading}
            subHeading={subText}
            selectOptions={workoutOptions}
            selected={selectedWorkoutOption}
            onOptionSelect={item => {
              setSelectedWorkoutOption(item.name);
              setSelectedWorkout(item);
            }}
            hideModal={onWorkoutModalClose}
            btnTitle={btnTitle}
            onBtnPress={onWorkoutOptionSelect}
          />
        }
      />

      {/* Create workout modal */}
      <CustomModal
        isVisible={isCreateWorkoutModal}
        onDismiss={() => setIsCreateWorkoutModal(false)}
        content={
          <AddWorkoutModal
            {...props}
            heading="Add Workout"
            subHeading={selectedWorkout.name}
            options={sequenceOptions}
            selected={selectedSequence}
            selectedWorkout={selectedWorkout}
            onOptionSelect={setSelectedSequence}
            hideModal={onWorkoutModalClose}
            btnTitle="Add"
            onBtnPress={addMyWorkoutHandler}
            onDropdownSelect={(data, type) => {
              setWheelPickerModal(true);
              setPickerItems(data);
              setPickerType(type);
            }}
          />
        }
      />

      {/* Delete workout modal */}
      <CustomModal
        isVisible={isDeleteWorkout}
        onDismiss={onWorkoutModalClose}
        content={
          <SelectModalContent
            select
            heading="Delete Workout"
            subHeading="Select"
            selectOptions={workoutOptions}
            selected={selectedWorkoutOption}
            onOptionSelect={setSelectedWorkoutOption}
            hideModal={onWorkoutModalClose}
            btnTitle="Confirm"
            onBtnPress={() => {
              setPermissionModal(true);
              setCheck('deleteWorkout');
            }}
          />
        }
      />

      <CustomModal
        isVisible={createItemModal}
        onDismiss={() => setCreateItemModal(false)}
        content={
          <CreateItemContent
            loader={loader}
            heading={heading}
            value={title}
            createItemFields={createItemFields}
            hideModal={() => setCreateItemModal(false)}
            onChangeText={text => setTitle(text)}
            selectedPickerItem={week}
            btnTitle={btnTitle}
            onBtnPress={onCreateItem}
            onDropdownSelect={(data, type) => {
              setWheelPickerModal(true);
              setPickerItems(data);
              setPickerType(type);
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
            loader={loader}
            isNote={false}
            heading={heading}
            subHeading={subText}
            showTable={true}
            planLoader={programPlanLoader}
            onBtnPress={onMarkWorkoutComplete}
            programData={selectedItem?.plan || []}
            hideModal={() => setIsProgramDetailModal(false)}
            btnTitle={selectedItem?.plan?.length === 0 ? '' : 'Complete'}
          />
        }
      />

      {/* Program Menu modal */}
      <CustomModal
        isVisible={programMenuModal}
        onDismiss={() => setProgramMenuModal(false)}
        content={
          <SelectModalContent
            select
            heading="Program Menu"
            subHeading="Select"
            selectOptions={programMenuOptions}
            selected={selectedProgramMenuOption}
            onOptionSelect={setSelectedProgramMenuOption}
            hideModal={() => setProgramMenuModal(false)}
            btnTitle="Next"
            onBtnPress={onProgramMenuSelect}
          />
        }
      />

      <CustomModal
        isVisible={wheelPickerModal}
        onDismiss={() => setWheelPickerModal(false)}
        content={
          <WheelPickerContent
            pickerItems={pickerItems}
            onValueChange={onPickerItemSelect}
            onConfirm={() => setWheelPickerModal(false)}
            onCancel={onCancelWheelPicker}
          />
        }
      />

      <CustomModal
        isVisible={datePickerModal}
        onDismiss={() => setDatePickerModal(false)}
        content={
          <DatePickerModal
            {...props}
            onConfirm={onConfirmDatePicker}
            onCancel={onCancelDatePicker}
          />
        }
      />

      <CustomModal
        isVisible={permissionModal}
        onDismiss={() => setPermissionModal(false)}
        content={
          <PermissionModal
            loader={loader}
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

Recreation.propTypes = {
  tab: PropTypes.number.isRequired,
  onNavigate: PropTypes.func.isRequired,
  setTab: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  setIsVisible: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
  btnTitle: PropTypes.string.isRequired,
  createItemModal: PropTypes.bool.isRequired,
  setCreateItemModal: PropTypes.func.isRequired,
  wheelPickerModal: PropTypes.bool.isRequired,
  setWheelPickerModal: PropTypes.func.isRequired,
  createItemFields: PropTypes.arrayOf(PropTypes.any).isRequired,
  pickerItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  setPickerItems: PropTypes.func.isRequired,
  workoutOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  selectedWorkoutOption: PropTypes.string.isRequired,
  setSelectedWorkoutOption: PropTypes.func.isRequired,
  workoutModal: PropTypes.bool.isRequired,
  onWorkoutModalClose: PropTypes.func.isRequired,
  onWorkoutOptionSelect: PropTypes.func.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  isDeleteWorkout: PropTypes.bool.isRequired,
  onDeleteHandler: PropTypes.func.isRequired,
  showDeleteBtn: PropTypes.bool.isRequired,
  isProgramDetailModal: PropTypes.bool.isRequired,
  setIsProgramDetailModal: PropTypes.func.isRequired,
  isCreateWorkoutModal: PropTypes.bool.isRequired,
  setIsCreateWorkoutModal: PropTypes.func.isRequired,
  sequenceOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  selectedSequence: PropTypes.bool.isRequired,
  setSelectedSequence: PropTypes.func.isRequired,
  datePickerModal: PropTypes.bool.isRequired,
  setDatePickerModal: PropTypes.func.isRequired,
  programMenuOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  programMenuModal: PropTypes.bool.isRequired,
  setProgramMenuModal: PropTypes.func.isRequired,
  selectedProgramMenuOption: PropTypes.string.isRequired,
  setSelectedProgramMenuOption: PropTypes.func.isRequired,
  onProgramMenuSelect: PropTypes.func.isRequired,
  onCreateItem: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  setPickerType: PropTypes.func.isRequired,
  onPickerItemSelect: PropTypes.func.isRequired,
  week: PropTypes.string.isRequired,
  onCancelWheelPicker: PropTypes.func.isRequired,
  loader: PropTypes.bool.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  addMyWorkoutHandler: PropTypes.func.isRequired,
  selectedWorkout: PropTypes.arrayOf(PropTypes.any).isRequired,
  setSelectedWorkout: PropTypes.func.isRequired,
  selectedItem: PropTypes.objectOf(PropTypes.any).isRequired,
  onConfirmDatePicker: PropTypes.func.isRequired,
  onCancelDatePicker: PropTypes.func.isRequired,
  setCheck: PropTypes.func.isRequired,
  onMarkWorkoutComplete: PropTypes.func.isRequired,
  programPlanLoader: PropTypes.bool.isRequired,
};
