/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ProgramManager } from '../../components';
import { wheelPickerItems } from '../../../../resources';
import {
  editWeekPlan,
  getBrunchBodyWeekPlan,
  getWeekPlans,
} from '../../../../redux/actions';

let tempWeek = '1';

export default function ProgramManagerPage(props) {
  const {
    navigation,
    route,
    onGetWeekPlan,
    myWeekPlan,
    onEditWeekPlan,
    onGetBrunchBodyWeekPlan,
  } = props;
  const { selectedItem, program } = route.params; // selectedItem is selected custom/brunch body program
  // console.log('selectedItem: ', selectedItem);
  const [btnTitle, setBtnTitle] = useState('');
  const [heading, setHeading] = useState('');
  const [subText, setSubText] = useState('');
  const [pickerItems, setPickerItems] = useState(
    wheelPickerItems.weeks.slice(0, selectedItem.numOfWeeks),
  );
  const [isVisible, setIsVisible] = useState(false);
  const [wheelPickerModal, setWheelPickerModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [showDeleteBtn, setShowDeleteBtn] = useState(true);
  const [isProgramDetailModal, setIsProgramDetailModal] = useState(false);
  const [loader, setLoader] = useState(true);
  const [weekNumber, setWeekNumber] = useState('1');
  const [selectedDay, setSelectedDay] = useState({});
  const [planDay, setPlanDay] = useState('');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [programData, setProgramData] = useState(null);
  const [check, setCheck] = useState('');

  const getWeekPlan = async () => {
    setLoader(true);
    if (program === 'Brunch Program') {
      await onGetBrunchBodyWeekPlan(selectedItem.name, weekNumber);
    } else {
      await onGetWeekPlan(selectedItem.id, weekNumber);
    }
    tempWeek = weekNumber;
    setLoader(false);
  };

  useEffect(() => {
    tempWeek = '1';
    getWeekPlan('1');
  }, []);

  const onNavigate = (screen, val) => {
    navigation.navigate(screen, {
      selectedProgram: val,
      selectedDay: { ...selectedDay, type: btnTitle, week: weekNumber },
    });
  };

  const onWeekDayPress = item => {
    if (program === 'Custom Program') {
      setIsVisible(true);
      setHeading(selectedItem.name);
      setPlanDay(item.day);
      setSubText(`Week ${weekNumber} Day ${item.day}`);
      setSelectedDay(item);
      if (item?.plan?.length > 0) {
        setBtnTitle('Edit');
        setShowDeleteBtn(true);
      } else {
        setBtnTitle('Create');
        setShowDeleteBtn(false);
      }
    } else {
      setHeading(`${selectedItem.name} Day ${item.day}`);
      setSubText(`Week ${weekNumber} Day ${item.day}`);
      setPlanDay(item.day);
      if (item?.plan?.length > 0) {
        const temp = myWeekPlan?.weekDays.find(i => i.day == item.day);
        setProgramData(temp.plan);
        setIsVisible(true);
        setBtnTitle('View');
        setShowDeleteBtn(false);
      } else {
        setIsErrorModal(true);
      }
    }
  };

  const onModalBtnPress = () => {
    setIsVisible(false);
    if (program === 'Custom Program') {
      if (btnTitle === 'Create') {
        onNavigate('EditProgram', selectedItem);
      } else {
        onNavigate('EditProgram', selectedItem);
      }
    } else if (btnTitle !== 'Create') {
      setIsProgramDetailModal(true);
    }
  };

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onDonePermissionModal = async () => {
    if (check === 'delete') {
      setDeleteLoader(true);

      const tempWeekData = myWeekPlan?.weekDays;
      const index = tempWeekData?.findIndex(a => a.day == planDay);
      tempWeekData.splice(index, 1);

      const response = await onEditWeekPlan(selectedItem.id, myWeekPlan.id, {
        week: tempWeek,
        weekDays: tempWeekData,
      });

      if (response === true) {
        setCheck('');
        setIsVisible(false);
        setDeleteLoader(false);
        showMessage('Success!', `Custom plan updated successfully.`);
      } else {
        setCheck('');
        setDeleteLoader(false);
        showMessage('Error!', response);
      }
    } else {
      setCheck('');
      setPermissionModal(false);
      setTimeout(() => {
        setAlertText('');
        setAlertHeading('');
      }, 500);
    }
  };

  return (
    <ProgramManager
      {...props}
      pickerItems={pickerItems}
      setPickerItems={setPickerItems}
      heading={heading}
      subText={subText}
      btnTitle={btnTitle}
      setBtnTitle={setBtnTitle}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      wheelPickerModal={wheelPickerModal}
      setWheelPickerModal={setWheelPickerModal}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      showDeleteBtn={showDeleteBtn}
      setShowDeleteBtn={setShowDeleteBtn}
      onWeekDayPress={onWeekDayPress}
      onModalBtnPress={onModalBtnPress}
      isProgramDetailModal={isProgramDetailModal}
      setIsProgramDetailModal={setIsProgramDetailModal}
      programData={programData}
      isErrorModal={isErrorModal}
      setIsErrorModal={setIsErrorModal}
      weekNumber={weekNumber}
      setWeekNumber={setWeekNumber}
      loader={loader}
      getWeekPlan={getWeekPlan}
      tempWeek={tempWeek}
      alertHeading={alertHeading}
      alertText={alertText}
      deleteLoader={deleteLoader}
      setCheck={setCheck}
      onDonePermissionModal={onDonePermissionModal}
    />
  );
}

ProgramManagerPage.defaultProps = {
  route: {},
};

ProgramManagerPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  route: PropTypes.objectOf(PropTypes.any),
  onGetWeekPlan: PropTypes.func.isRequired,
  myWeekPlan: PropTypes.objectOf(PropTypes.any).isRequired,
  onEditWeekPlan: PropTypes.func.isRequired,
  onGetBrunchBodyWeekPlan: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  myWeekPlan: state.recreation?.weekPlan,
});

const mapDispatchToProps = dispatch => ({
  onGetWeekPlan: (id, week) => dispatch(getWeekPlans(id, week)),
  onGetBrunchBodyWeekPlan: (id, week) =>
    dispatch(getBrunchBodyWeekPlan(id, week)),
  onEditWeekPlan: (id, weekId, data) =>
    dispatch(editWeekPlan(id, weekId, data)),
});

export const ProgramManagerWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProgramManagerPage);
