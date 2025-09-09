/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MyPassword } from '../../components';
import { changePassword, resetPassword } from '../../../../redux/actions';

export default function MyPasswordPage(props) {
  const { navigation, user, changeUserPassword, onResetPassword } = props;
  const [forgotPassModal, setForgotPassModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [isPermissionModal, setIsPermissionModal] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [resetLoader, setResetLoader] = useState(false);
  const [forgotModalEmail, setForgotModalEmail] = useState('');

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setIsPermissionModal(true);
  };

  const onChangePassword = async () => {
    setLoader(true);

    if (currentPass.trim() && newPass.trim() && confirmNewPass.trim()) {
      if (newPass !== confirmNewPass) {
        showMessage('Error!', 'Passwords are mismatch!');
      } else {
        const response = await changeUserPassword({
          email: user.email,
          password: currentPass,
          newPassword: newPass,
        });
        if (response === true) {
          setCurrentPass('');
          setNewPass('');
          setConfirmNewPass('');
          showMessage('Success!', `Password has been changed successfully.`);
        } else {
          showMessage('Error!', `${response}`);
        }
      }
      setLoader(false);
    } else {
      setLoader(false);
      showMessage('Error!', 'All fields are required!');
    }
  };

  const onResetPasswordHandler = async () => {
    setResetLoader(true);
    const regx = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;

    if (forgotModalEmail.trim()) {
      if (!regx.test(forgotModalEmail)) {
        showMessage('Error!', 'Email address is badly formatted.');
      } else {
        const response = await onResetPassword({
          email: forgotModalEmail,
        });
        if (response === true) {
          setForgotModalEmail('');
          setForgotPassModal(false);
          setConfirmationModal(true);
        } else {
          showMessage('Error!', response);
        }
      }
      setResetLoader(false);
    } else {
      setResetLoader(false);
      showMessage('Error!', 'Please enter your email.');
    }
  };

  return (
    <MyPassword
      navigation={navigation}
      forgotPassModal={forgotPassModal}
      setForgotPassModal={setForgotPassModal}
      confirmationModal={confirmationModal}
      setConfirmationModal={setConfirmationModal}
      loader={loader}
      currentPass={currentPass}
      setCurrentPass={setCurrentPass}
      newPass={newPass}
      setNewPass={setNewPass}
      confirmNewPass={confirmNewPass}
      setConfirmNewPass={setConfirmNewPass}
      onChangePassword={onChangePassword}
      isPermissionModal={isPermissionModal}
      setIsPermissionModal={setIsPermissionModal}
      alertHeading={alertHeading}
      alertText={alertText}
      resetLoader={resetLoader}
      forgotModalEmail={forgotModalEmail}
      setForgotModalEmail={setForgotModalEmail}
      onResetPasswordHandler={onResetPasswordHandler}
    />
  );
}

MyPasswordPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  changeUserPassword: PropTypes.func.isRequired,
  onResetPassword: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth?.user,
});

const mapDispatchToProps = dispatch => ({
  changeUserPassword: data => dispatch(changePassword(data)),
  onResetPassword: data => dispatch(resetPassword(data)),
});

export const MyPasswordWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyPasswordPage);
