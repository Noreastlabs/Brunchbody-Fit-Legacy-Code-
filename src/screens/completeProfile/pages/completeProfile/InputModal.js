// import React, {useState} from 'react';
// import {Text} from 'react-native';
// import {connect} from 'react-redux';
// import moment from 'moment';
// import PropTypes from 'prop-types';
// import InputModal from '../../components/DateInputModal';

// export const InputModalPage = ({dob}) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [date, setDate] = useState('');
//   const [feet, setFeet] = useState(0);
//   const [inches, setInches] = useState();

//   const height = `${feet} ft ${inches} in`;

//   const settingFeet = val => {
//     setFeet(val);
//   };

//   const settingInches = val => {
//     setInches(val);
//   };

//   const toggleModal = () => {
//     setModalVisible(!modalVisible);
//   };

//   const toggleDatePicker = () => {
//     setDatePickerVisibility(!isDatePickerVisible);
//   };

//   const handleConfirm = givenDate => {
//     toggleDatePicker();
//     const patternDate = moment(givenDate).format('MMM Do YY');
//     setDate(patternDate);
//   };
//   return (
//     <>
//       {/* {dob ? (
//         <Text style={style.testText}>dob in InputModal component</Text>
//       ) : (
//         <Text style={style.testText}>height in inputModal component</Text>
//       )} */}
//       <InputModal
//         // dob
//         dob
//         height={height}
//         settingFeet={settingFeet}
//         settingInches={settingInches}
//         toggleDatePicker={toggleDatePicker}
//         toggleModal={toggleModal}
//         handleConfirm={handleConfirm}
//         date={date}
//         feet={feet}
//         inches={inches}
//         isDatePickerVisible={isDatePickerVisible}
//         modalVisible={modalVisible}
//       />
//     </>
//   );
// };

// // InputModalPage.propTypes = {
// //   dob: PropTypes.func.isRequired,
// // };

// export const InputModalWrapper = connect(null, null)(InputModalPage);
