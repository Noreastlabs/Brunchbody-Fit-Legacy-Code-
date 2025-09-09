/* eslint-disable no-unused-expressions */
import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import {
  CustomHeader,
  Button,
  CustomModal,
  PermissionModal,
  SafeAreaWrapper,
} from '../../../../components';
import {colors} from '../../../../resources';

export default function DeleteAccount(props) {
  const {
    isEnabled,
    toggleSwitch,
    loader,
    email,
    setEmail,
    password,
    setPassword,
    onDeleteAccount,
    isPermissionModal,
    setIsPermissionModal,
    alertHeading,
    alertText,
    onDonePermissionModal,
  } = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />
        <View style={styles.headingView}>
          <Text style={styles.headingText1}>Delete Account</Text>
        </View>
        <View>
          <View style={styles.listView}>
            <View style={{flex: 1, paddingVertical: 15}}>
              <Text style={styles.textStyle1}>Email</Text>
              <TextInput
                value={email}
                placeholder="Email"
                placeholderTextColor={colors.grey}
                onChangeText={text => setEmail(text)}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.TextInput}
              />
            </View>

            <View style={{flex: 1, paddingVertical: 5}}>
              <Text style={styles.textStyle1}>Password</Text>
              <TextInput
                secureTextEntry
                value={password}
                placeholder="Password"
                placeholderTextColor={colors.grey}
                onChangeText={text => setPassword(text)}
                autoCapitalize="none"
                style={styles.TextInput}
              />
            </View>
            <View
              style={{
                flex: 1,
                paddingTop: 30,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={styles.genderSelectionStyle}
                onPress={toggleSwitch}>
                <View
                  style={[
                    styles.radioOuterStyle,
                    {
                      borderColor: !isEnabled ? '#56ccf2' : 'grey',
                      borderRadius: null,
                    },
                  ]}
                  onPress={toggleSwitch}>
                  <View
                    style={[
                      styles.radioInnerStyle,
                      {
                        backgroundColor: !isEnabled ? '#56ccf2' : null,
                        borderRadius: null,
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
              <View style={{flex: 1, marginLeft: 10}}>
                <Text style={styles.confirmDeletionText}>
                  Confirm Deletion{'\n'}(Warning: YOUR SAVED DATA WILL BE LOST.)
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{margin: 30}}>
          <Button
            loader={loader}
            title="Delete Account"
            onPress={onDeleteAccount}
          />
        </View>
      </ScrollView>

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
            onDone={onDonePermissionModal}
            onCancel={() => setIsPermissionModal(false)}
          />
        }
      />
    </SafeAreaWrapper>
  );
}

DeleteAccount.propTypes = {
  toggleSwitch: PropTypes.func.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  loader: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  onDeleteAccount: PropTypes.func.isRequired,
  isPermissionModal: PropTypes.bool.isRequired,
  setIsPermissionModal: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
};
