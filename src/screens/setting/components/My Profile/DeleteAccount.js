/* eslint-disable no-unused-expressions */
import React from 'react';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import {
  CustomHeader,
  Button,
  CustomModal,
  PermissionModal,
  SafeAreaWrapper,
} from '../../../../components';

export default function DeleteAccount(props) {
  const {
    isConfirmed,
    toggleSwitch,
    loader,
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
          <Text style={styles.headingText1}>Delete local data</Text>
          <Text style={styles.headingText3}>
            Removes saved Brunch Body data from this device.
          </Text>
        </View>
        <View>
          <View style={styles.listView}>
            <Text style={styles.confirmDeletionText}>
              Deleted from this device:{'\n'}
              saved profile details, journal entries, workouts, nutrition,
              themes, todos, and other on-device Brunch Body data.
            </Text>
            <Text style={styles.confirmDeletionText}>
              Not deleted:{'\n'}
              files you exported to another app or folder.
            </Text>
            <Text style={styles.confirmDeletionText}>
              May appear again after setup:{'\n'}
              starter plans included with Brunch Body.
            </Text>
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
                      borderColor: isConfirmed ? '#56ccf2' : 'grey',
                      borderRadius: null,
                    },
                  ]}
                  onPress={toggleSwitch}>
                  <View
                    style={[
                      styles.radioInnerStyle,
                      {
                        backgroundColor: isConfirmed ? '#56ccf2' : null,
                        borderRadius: null,
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
              <View style={{flex: 1, marginLeft: 10}}>
                <Text style={styles.confirmDeletionText}>
                  I understand this will remove saved Brunch Body data from this
                  device.
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{margin: 30}}>
          <Button
            loader={loader}
            title="Delete Local Data"
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
  isConfirmed: PropTypes.bool.isRequired,
  loader: PropTypes.bool.isRequired,
  onDeleteAccount: PropTypes.func.isRequired,
  isPermissionModal: PropTypes.bool.isRequired,
  setIsPermissionModal: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
};
