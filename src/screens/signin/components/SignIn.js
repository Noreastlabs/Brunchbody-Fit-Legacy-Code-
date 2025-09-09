import React from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Text,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  LogoHeader,
  TextButton,
  CustomModal,
  PermissionModal,
} from '../../../components';
import {colors, strings} from '../../../resources';
import styles from './style';

export default function SignIn(props) {
  const {
    navigation,
    loader,
    email,
    setEmail,
    password,
    setPassword,
    onLoginHandler,
    forgotPassModal,
    setForgotPassModal,
    confirmationModal,
    setConfirmationModal,
    alertHeading,
    alertText,
    onDonePermissionModal,
    googleSignIn,
    socialLoader,
    resetLoader,
    forgotModalEmail,
    setForgotModalEmail,
    onResetPasswordHandler,
  } = props;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {socialLoader && (
        <View style={styles.socialLoaderContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <View style={styles.logoView}>
          <LogoHeader />
        </View>

        <View style={styles.col}>
          <Text style={styles.text}>{strings.signup.email}</Text>
          <TextInput
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder={strings.signup.enterEmail}
            placeholderTextColor={colors.grey}
            onChangeText={text => setEmail(text)}
            style={styles.TextInput}
          />
        </View>

        <View style={styles.col}>
          <Text style={styles.text}>{strings.signup.pasword}</Text>
          <TextInput
            value={password}
            secureTextEntry
            autoCapitalize="none"
            placeholder={strings.signup.enterPassword}
            placeholderTextColor={colors.grey}
            onChangeText={text => setPassword(text)}
            style={styles.TextInput}
          />
        </View>

        <View style={styles.col}>
          <TouchableOpacity
            disabled={loader}
            onPress={onLoginHandler}
            style={[styles.btn, styles.loginBtn]}>
            {loader ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.loginText}>{strings.signup.login}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.accBtn]}
            onPress={() => {
              navigation.navigate('SignUp');
            }}>
            <Text style={styles.accText}>{strings.signup.newAcc}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orView}>
          <Text style={styles.or}>{strings.signup.or}</Text>

          <Text style={styles.otherOpt}>{strings.signup.loginWith}</Text>

          <View style={styles.logoBtn}>
            <TouchableOpacity onPress={googleSignIn} activeOpacity={0.5}>
              <Icon name="logo-google" size={30} style={styles.google} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomTextView}>
          <TextButton
            title="Forgot Password"
            onPress={() => setForgotPassModal(true)}
          />
        </View>
      </ScrollView>

      <CustomModal
        isVisible={forgotPassModal}
        onDismiss={() => setForgotPassModal(false)}
        content={
          <PermissionModal
            isInput
            loader={resetLoader}
            heading="Reset Password"
            value={forgotModalEmail}
            onChangeText={text => setForgotModalEmail(text)}
            text="Please enter the email address for your account."
            onDone={onResetPasswordHandler}
            onCancel={() => setForgotPassModal(false)}
          />
        }
      />

      <CustomModal
        isVisible={confirmationModal}
        onDismiss={() => setConfirmationModal(false)}
        content={
          <PermissionModal
            isCancelBtn={false}
            heading={alertHeading || 'Password Request Sent'}
            text={
              alertText ||
              'Check your email for the link to reset your password.'
            }
            onDone={onDonePermissionModal}
            onCancel={() => setConfirmationModal(false)}
          />
        }
      />
    </SafeAreaView>
  );
}

SignIn.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  loader: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  onLoginHandler: PropTypes.func.isRequired,
  forgotPassModal: PropTypes.bool.isRequired,
  socialLoader: PropTypes.bool.isRequired,
  setForgotPassModal: PropTypes.func.isRequired,
  confirmationModal: PropTypes.bool.isRequired,
  setConfirmationModal: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  googleSignIn: PropTypes.func.isRequired,
  resetLoader: PropTypes.bool.isRequired,
  forgotModalEmail: PropTypes.string.isRequired,
  setForgotModalEmail: PropTypes.func.isRequired,
  onResetPasswordHandler: PropTypes.func.isRequired,
};
