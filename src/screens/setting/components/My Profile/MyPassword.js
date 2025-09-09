  /* eslint-disable no-unused-expressions */
import PropTypes from 'prop-types';
import React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import {
  Button,
  CustomHeader,
  CustomModal,
  PermissionModal,
  SafeAreaWrapper,
  TextButton,
} from '../../../../components';
import { colors } from '../../../../resources';
import styles from './style';

export default function MyPassword(props) {
  const {
    forgotPassModal,
    setForgotPassModal,
    confirmationModal,
    setConfirmationModal,
    loader,
    currentPass,
    setCurrentPass,
    newPass,
    setNewPass,
    confirmNewPass,
    setConfirmNewPass,
    onChangePassword,
    isPermissionModal,
    setIsPermissionModal,
    alertHeading,
    alertText,
    resetLoader,
    forgotModalEmail,
    setForgotModalEmail,
    onResetPasswordHandler,
  } = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />
        <View style={styles.headingView}>
          <Text style={styles.headingText1}>My Password</Text>
        </View>
        <View>
          <View style={styles.listView}>
            <View style={{flex: 1, paddingVertical: 5}}>
              <Text style={styles.textStyle1}>Current Password</Text>
              <TextInput
                secureTextEntry
                value={currentPass}
                placeholder="Password"
                placeholderTextColor={colors.grey}
                onChangeText={text => setCurrentPass(text)}
                autoCapitalize="none"
                style={styles.TextInput}
              />
            </View>

            <View style={{flex: 1, paddingVertical: 5}}>
              <Text style={styles.textStyle1}>New Password</Text>
              <TextInput
                secureTextEntry
                value={newPass}
                placeholder="Password"
                placeholderTextColor={colors.grey}
                onChangeText={text => setNewPass(text)}
                autoCapitalize="none"
                style={styles.TextInput}
              />
            </View>
            <View style={{flex: 1, paddingVertical: 5}}>
              <Text style={styles.textStyle1}>Confirm New Password</Text>
              <TextInput
                secureTextEntry
                value={confirmNewPass}
                placeholder="Password"
                placeholderTextColor={colors.grey}
                onChangeText={text => setConfirmNewPass(text)}
                autoCapitalize="none"
                style={styles.TextInput}
              />
            </View>
          </View>
        </View>

        <View style={{margin: 30}}>
          <Button loader={loader} title="Save" onPress={onChangePassword} />
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
            heading="Password Request Sent"
            text="Check your email for the link to reset your password."
            onDone={() => setConfirmationModal(false)}
            onCancel={() => setConfirmationModal(false)}
          />
        }
      />

      <CustomModal
        isVisible={isPermissionModal}
        onDismiss={() => setIsPermissionModal(false)}
        content={
          <PermissionModal
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={() => setIsPermissionModal(false)}
            onCancel={() => setIsPermissionModal(false)}
          />
        }
      />
    </SafeAreaWrapper>
  );
  // }
}

MyPassword.propTypes = {
  forgotPassModal: PropTypes.bool.isRequired,
  setForgotPassModal: PropTypes.func.isRequired,
  confirmationModal: PropTypes.bool.isRequired,
  setConfirmationModal: PropTypes.func.isRequired,
  loader: PropTypes.bool.isRequired,
  currentPass: PropTypes.string.isRequired,
  setCurrentPass: PropTypes.func.isRequired,
  newPass: PropTypes.string.isRequired,
  setNewPass: PropTypes.func.isRequired,
  confirmNewPass: PropTypes.string.isRequired,
  setConfirmNewPass: PropTypes.func.isRequired,
  onChangePassword: PropTypes.func.isRequired,
  isPermissionModal: PropTypes.bool.isRequired,
  setIsPermissionModal: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  resetLoader: PropTypes.bool.isRequired,
  forgotModalEmail: PropTypes.string.isRequired,
  setForgotModalEmail: PropTypes.func.isRequired,
  onResetPasswordHandler: PropTypes.func.isRequired,
};
