import React from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import {colors, strings} from '../../../resources';
import styles from './style';
import {
  CustomModal,
  LogoHeader,
  PermissionModal,
  TextButton,
} from '../../../components';

export default function SignUp(props) {
  const {
    loader,
    email,
    setEmail,
    confirmEmail,
    setConfirmEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    onSignUpHandler,
    permissionModal,
    setPermissionModal,
    alertHeading,
    alertText,
    onDonePermissionModal,
    navigation,
  } = props;
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <View style={styles.logoView}>
          <LogoHeader />
        </View>

        <View style={styles.col}>
          <TextInput
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder={strings.signup.enterEmail}
            placeholderTextColor={colors.grey}
            onChangeText={text => setEmail(text)}
            style={styles.TextInput}
          />

          <TextInput
            value={confirmEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder={strings.signin.confirmEmail}
            placeholderTextColor={colors.grey}
            onChangeText={text => setConfirmEmail(text)}
            style={styles.TextInput}
          />

          <TextInput
            value={password}
            secureTextEntry
            autoCapitalize="none"
            placeholder={strings.signup.enterPassword}
            placeholderTextColor={colors.grey}
            onChangeText={text => setPassword(text)}
            style={styles.TextInput}
          />

          <TextInput
            value={confirmPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder={strings.signin.confirmPassword}
            placeholderTextColor={colors.grey}
            onChangeText={text => setConfirmPassword(text)}
            style={styles.TextInput}
          />

          <TouchableOpacity
            disabled={loader}
            onPress={onSignUpHandler}
            style={[styles.btn, styles.accBtn]}>
            {loader ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.accText}>{strings.signin.createAcc}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.bottomTextView}>
            <Text style={styles.bottomTextStyle}>
              By tapping to continue, you are indicating that you have read the{' '}
              <Text
                style={styles.linkedTextStyle}
                onPress={() =>
                  Linking.openURL('https://brunchbodyfit.com/privacy-policy/')
                }>
                Privacy Policy
              </Text>{' '}
              and agree to the{' '}
              <Text
                style={styles.linkedTextStyle}
                onPress={() =>
                  Linking.openURL('https://brunchbodyfit.com/terms-conditions/')
                }>
                Terms of Service
              </Text>
            </Text>
          </View>

          <View style={styles.cancelBtnView}>
            <TextButton title="Cancel" onPress={() => navigation.goBack()} />
          </View>

          {/* <View style={styles.orView}>
            <Text style={styles.or}>{strings.signup.or}</Text>

            <Text style={styles.otherOpt}>{strings.signup.loginWith}</Text>

            <View style={styles.logoBtn}>
              <TouchableOpacity activeOpacity={0.5}>
                <Icon name="logo-google" size={30} style={styles.google} />
              </TouchableOpacity>
            </View>
          </View> */}
        </View>
      </ScrollView>

      <CustomModal
        isVisible={permissionModal}
        onDismiss={() => setPermissionModal(false)}
        content={
          <PermissionModal
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
    </SafeAreaView>
  );
}

SignUp.propTypes = {
  loader: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  confirmEmail: PropTypes.string.isRequired,
  setConfirmEmail: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  setConfirmPassword: PropTypes.func.isRequired,
  onSignUpHandler: PropTypes.func.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};
