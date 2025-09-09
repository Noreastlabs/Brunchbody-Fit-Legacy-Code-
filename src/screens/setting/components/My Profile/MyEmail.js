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
} from '../../../../components';
import { colors } from '../../../../resources';
import styles from './style';

export default function MyEmail(props) {
  const {
    user,
    loader,
    email,
    setEmail,
    confirmEmail,
    setConfirmEmail,
    onChangeEmail,
    isPermissionModal,
    setIsPermissionModal,
    alertHeading,
    alertText,
  } = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />
        <View style={styles.headingView}>
          <Text style={styles.headingText1}>My Email</Text>
        </View>
        <View>
          <View style={styles.listView}>
            <Text style={styles.textStyle1}>Email</Text>
            <Text style={styles.currentEmail}>{user.email}</Text>

            <View style={{flex: 1, paddingVertical: 5}}>
              <Text style={styles.textStyle1}>New Email</Text>
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
              <Text style={styles.textStyle1}>Confirm Email</Text>
              <TextInput
                value={confirmEmail}
                placeholder="Confirm Email"
                placeholderTextColor={colors.grey}
                onChangeText={text => setConfirmEmail(text)}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.TextInput}
              />
            </View>
          </View>
        </View>
        <View style={{margin: 30}}>
          <Button loader={loader} title="Save" onPress={onChangeEmail} />
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
            onDone={() => setIsPermissionModal(false)}
            onCancel={() => setIsPermissionModal(false)}
          />
        }
      />
    </SafeAreaWrapper>
  );
  // }
}

MyEmail.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  loader: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  confirmEmail: PropTypes.string.isRequired,
  setConfirmEmail: PropTypes.func.isRequired,
  onChangeEmail: PropTypes.func.isRequired,
  isPermissionModal: PropTypes.bool.isRequired,
  setIsPermissionModal: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
};
