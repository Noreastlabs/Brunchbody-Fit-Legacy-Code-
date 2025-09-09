import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import SignUp from '../../components';
import {createAccount} from '../../../../redux/actions';

export function SignUpPage(props) {
  const {navigation, createUserAccount} = props;
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [permissionModal, setPermissionModal] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');

  const showMessage = (heading, text) => {
    setAlertHeading(heading);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onDonePermissionModal = () => {
    setPermissionModal(false);
    setTimeout(() => {
      setAlertText('');
      setAlertHeading('');
    }, 500);
  };

  const onSignUpHandler = async () => {
    setLoader(true);
    const regx = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;

    if (
      email.trim() &&
      confirmEmail.trim() &&
      password.trim() &&
      confirmPassword.trim()
    ) {
      if (!regx.test(email)) {
        showMessage('Error!', 'Email address is badly formatted.');
      } else if (email !== confirmEmail) {
        showMessage('Error!', 'Emails are mismatch.');
      } else if (password !== confirmPassword) {
        showMessage('Error!', 'Passwords are mismatch.');
      } else {
        const response = await createUserAccount({
          email,
          password,
        });
        if (response === true) {
          setEmail('');
          setConfirmEmail('');
          setPassword('');
          setConfirmPassword('');
          navigation.navigate('CompleteProfile', {email, password});
        } else {
          showMessage('Error!', response);
        }
      }
      setLoader(false);
    } else {
      setLoader(false);
      showMessage('Error!', 'All fields are required.');
    }
  };

  return (
    <SignUp
      navigation={navigation}
      loader={loader}
      email={email}
      setEmail={setEmail}
      confirmEmail={confirmEmail}
      setConfirmEmail={setConfirmEmail}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      onSignUpHandler={onSignUpHandler}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
    />
  );
}

SignUpPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  createUserAccount: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  createUserAccount: data => dispatch(createAccount(data)),
});

export const SignUpWrapper = connect(null, mapDispatchToProps)(SignUpPage);
