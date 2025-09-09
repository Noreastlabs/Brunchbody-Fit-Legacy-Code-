import React, { useState } from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useFocusEffect } from '@react-navigation/native';
import SignIn from '../../components';
import { login, resetPassword, socialLogin } from '../../../../redux/actions';

GoogleSignin.configure({
  webClientId:
    '719080501603-i321dfpt92o5ujad5mvcfeti30r48mfi.apps.googleusercontent.com',
});

export default function SignInPage(props) {
  const { navigation, loginUser, socialLoginUser, onResetPassword } = props;
  const [loader, setLoader] = useState(false);
  const [resetLoader, setResetLoader] = useState(false);
  const [email, setEmail] = useState('test2@gmail.com');
  const [password, setPassword] = useState('test@123');
  const [forgotModalEmail, setForgotModalEmail] = useState('');
  const [forgotPassModal, setForgotPassModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [socialLoader, setSocialLoader] = useState(false);

  const backAction = () => {
    BackHandler.exitApp();
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  const showMessage = (heading, text) => {
    setAlertHeading(heading);
    setAlertText(text);
    setConfirmationModal(true);
  };

  const googleSignIn = async () => {
    const google = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = {
      token: google.idToken,
      providerId: 'google.com',
    };

    setSocialLoader(true);
    const response = await socialLoginUser({
      ...googleCredential,
    });

    if (response === 'logging in') {
      setSocialLoader(false);
      navigation.replace('Home');
    } else if (response === 'signing up') {
      setSocialLoader(false);
      navigation.replace('CompleteProfile');
    } else {
      setSocialLoader(false);
      showMessage('Error!', 'Something went wrong');
    }
  };

  const onDonePermissionModal = () => {
    setConfirmationModal(false);
    setTimeout(() => {
      setAlertText('');
      setAlertHeading('');
    }, 500);
  };

  const onLoginHandler = async () => {
    setLoader(true);
    const regx = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;

    if (email.trim() && password.trim()) {
      if (!regx.test(email)) {
        showMessage('Error!', 'Email address is badly formatted.');
      } else {
        const response = await loginUser({
          email,
          password,
        });
        if (response === 'goToCompleteProfile') {
          navigation.navigate('CompleteProfile');
        } else if (response) {
          setEmail('');
          setPassword('');
          navigation.replace('Home');
        } else {
          showMessage('Error!', 'Email or password is incorrect.');
        }
      }
      setLoader(false);
    } else {
      setLoader(false);
      showMessage('Error!', 'Please enter your email and password.');
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
    <SignIn
      navigation={navigation}
      loader={loader}
      socialLoader={socialLoader}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onLoginHandler={onLoginHandler}
      forgotPassModal={forgotPassModal}
      setForgotPassModal={setForgotPassModal}
      confirmationModal={confirmationModal}
      setConfirmationModal={setConfirmationModal}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
      googleSignIn={googleSignIn}
      resetLoader={resetLoader}
      forgotModalEmail={forgotModalEmail}
      setForgotModalEmail={setForgotModalEmail}
      onResetPasswordHandler={onResetPasswordHandler}
    />
  );
}

SignInPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  loginUser: PropTypes.func.isRequired,
  socialLoginUser: PropTypes.func.isRequired,
  onResetPassword: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  loginUser: data => dispatch(login(data)),
  socialLoginUser: data => dispatch(socialLogin(data)),
  onResetPassword: data => dispatch(resetPassword(data)),
});

export const SignInWrapper = connect(null, mapDispatchToProps)(SignInPage);
