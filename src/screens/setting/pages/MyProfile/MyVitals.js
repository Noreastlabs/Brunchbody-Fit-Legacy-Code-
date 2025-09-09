/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MyVitals } from '../../components';
import { loggedIn, profile } from '../../../../redux/actions';

let yearsList = [];

export default function MyVitalsPage(props) {
  const { navigation, user, updateUserProfile, getUserData } = props;
  const [loader, setLoader] = useState(false);
  const [isEnabled, setIsEnabled] = useState(user.gender !== 'male');
  const [datePickerModal, setDatePickerModal] = useState(false);
  const [heightPickerModal, setHeightPickerModal] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [date, setDate] = useState(parseInt(user?.dob.split('/')[0], 10));
  const [month, setMonth] = useState(parseInt(user?.dob.split('/')[1], 10));
  const [year, setYear] = useState(parseInt(user?.dob.split('/')[2], 10));
  const [isHeightSelected, setIsHeightSelected] = useState(false);
  const [feet, setFeet] = useState(1);
  const [inches, setInches] = useState(0);
  const [name, setName] = useState(user.name);
  const [gender, setGender] = useState('');
  const [isPermissionModal, setIsPermissionModal] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');

  useEffect(() => {
    yearsList = [];

    for (let i = 0; i <= new Date().getFullYear() - 1900; i += 1) {
      yearsList.push({ id: i, value: `${1900 + i}` });
    }
  }, []);

  const toggleSwitch = val => {
    setIsEnabled(!isEnabled);
    setGender(val);
  };

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setIsPermissionModal(true);
  };

  const onUpdateHandler = async () => {
    setLoader(true);

    if (new Date().getFullYear() - year < 18)
      showMessage('Error!', 'Invalid date of birth!');
    else {
      const response = await updateUserProfile({
        name: name || user.name,
        dob: isDateSelected ? `${date}/${month}/${year}` : user.dob,
        height: isHeightSelected ? `${feet}.${inches}` : user.height,
        gender: gender || user.gender,
        weight: user.weight,
      });
      if (response === true) {
        await getUserData();
        setIsDateSelected(false);
        setIsHeightSelected(false);
        showMessage('Success!', 'Profile updated successfully.');
      } else {
        showMessage('Error!', 'Something went wrong. Please try again!');
      }
    }

    setLoader(false);
  };

  return (
    <MyVitals
      {...props}
      isEnabled={isEnabled}
      setIsEnabled={setIsEnabled}
      toggleSwitch={toggleSwitch}
      navigation={navigation}
      datePickerModal={datePickerModal}
      setDatePickerModal={setDatePickerModal}
      heightPickerModal={heightPickerModal}
      setHeightPickerModal={setHeightPickerModal}
      yearsList={yearsList}
      date={date}
      setDate={setDate}
      month={month}
      setMonth={setMonth}
      year={year}
      setYear={setYear}
      isDateSelected={isDateSelected}
      setIsDateSelected={setIsDateSelected}
      feet={feet}
      setFeet={setFeet}
      inches={inches}
      setInches={setInches}
      isHeightSelected={isHeightSelected}
      setIsHeightSelected={setIsHeightSelected}
      setName={setName}
      loader={loader}
      onUpdateHandler={onUpdateHandler}
      name={name}
      isPermissionModal={isPermissionModal}
      setIsPermissionModal={setIsPermissionModal}
      alertHeading={alertHeading}
      alertText={alertText}
    />
  );
}

MyVitalsPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  updateUserProfile: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  getUserData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth?.user,
});

const mapDispatchToProps = dispatch => ({
  updateUserProfile: data => dispatch(profile(data)),
  getUserData: () => dispatch(loggedIn()),
});

export const MyVitalsWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyVitalsPage);
