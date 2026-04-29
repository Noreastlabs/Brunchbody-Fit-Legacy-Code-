import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {CustomHeader, SafeAreaWrapper} from '../../../../components';
import styles from '../PrivacyAndData/style';

const helpAndSupportCopy = [
  'Brunch Body helps you organize user-entered fitness, nutrition, journal, calendar, todo, planning, and Profile information.',
  'Profile details, including your Nickname, are Saved on this device in the current app. Profile information is Saved on this device only and used for in-app calculations and display.',
  'For privacy and data questions, remember that Brunch Body app-managed local data is stored in app storage on this device in the current app.',
  'The current app does not provide Brunch Body cloud sync, remote recovery, automatic Brunch Body backup or restore, or support-side inspection or deletion of device-local app data.',
  'Delete local data clears Brunch Body app-managed local data on this device. It does not remove files you exported, copied, shared, moved, backed up, uploaded, placed in operating-system backups or cloud folders, or otherwise saved outside the app.',
  'Exported files are user-managed copies after export. You are responsible for where those files are saved, copied, shared, backed up, moved, protected, restored, or deleted.',
  'For beta or tester feedback, use the existing Support & Contact link in Settings or the release/tester materials you were given. This help screen does not create a new support system.',
  'For health, training, or nutrition decisions, rely on qualified professionals. Brunch Body help is for understanding the app, not for professional guidance.',
];

export default function HelpAndSupport() {
  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />
        <View style={styles.headingView}>
          <Text style={styles.headingText1}>Help & Support</Text>
        </View>
        <View style={styles.contentView}>
          {helpAndSupportCopy.map(copy => (
            <Text key={copy} style={styles.bodyText}>
              {copy}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

HelpAndSupport.propTypes = {};
