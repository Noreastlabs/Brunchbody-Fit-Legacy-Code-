/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MyEmail } from '../../components';
import { changeEmail } from '../../../../redux/actions';

export default function MyEmailPage(props) {
  const { navigation, changeUserEmail } = props;
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [isPermissionModal, setIsPermissionModal] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setIsPermissionModal(true);
  };

  const onChangeEmail = async () => {
    setLoader(true);
    const regx = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;

    if (email.trim() && confirmEmail.trim()) {
      if (!regx.test(email)) {
        showMessage('Error!', 'Email address is badly formatted!');
      } else if (email !== confirmEmail) {
        showMessage('Error!', 'Emails are mismatch!');
      } else {
        const response = await changeUserEmail({
          email,
        });
        if (response === true) {
          setEmail('');
          setConfirmEmail('');
          showMessage('Success!', `Email has been changed successfully.`);
        } else {
          showMessage('Error!', `Something went wrong. Please try again!`);
        }
      }
      setLoader(false);
    } else {
      setLoader(false);
      showMessage('Error!', 'All fields are required!');
    }
  };

  return (
    <MyEmail
      {...props}
      navigation={navigation}
      loader={loader}
      email={email}
      setEmail={setEmail}
      confirmEmail={confirmEmail}
      setConfirmEmail={setConfirmEmail}
      onChangeEmail={onChangeEmail}
      isPermissionModal={isPermissionModal}
      setIsPermissionModal={setIsPermissionModal}
      alertHeading={alertHeading}
      alertText={alertText}
    />
  );
}

MyEmailPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  changeUserEmail: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth?.user,
});

const mapDispatchToProps = dispatch => ({
  changeUserEmail: data => dispatch(changeEmail(data)),
});

export const MyEmailWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyEmailPage);
