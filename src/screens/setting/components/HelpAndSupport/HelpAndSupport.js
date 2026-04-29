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

const trustRecoveryCopy = [
  'If Brunch Body data looks missing or unexpected, first check that you are using the same device and current app install where you entered it. Because Brunch Body is saved on this device only, the app does not provide cloud recovery or retrieve a copy from another device.',
  'If a Profile value looks wrong, open Profile and update the value saved on this device. Brunch Body uses saved Profile values for in-app calculations and display.',
  'If you used Delete local data, Brunch Body cannot recover local data after you delete it unless you separately saved or exported a copy.',
  'Files you export, copy, share, or move are managed outside the app. Delete local data does not remove those files.',
  'If you are unsure what Brunch Body can recover, assume only copies you separately saved or exported are available. Brunch Body cannot inspect or restore device-local app data for you.',
];

const feedbackCopy = [
  'Feedback is always your choice. Brunch Body does not automatically monitor what you do in the app.',
  'Helpful feedback can include confusing wording, broken screens, unclear delete/export behavior, privacy or trust concerns, or missing help topics.',
  'You do not need to include exported files, screenshots with private details, or sensitive health information unless you choose to.',
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
          <Text style={styles.sectionHeadingText}>
            When something feels wrong
          </Text>
          {trustRecoveryCopy.map(copy => (
            <Text key={copy} style={styles.bodyText}>
              {copy}
            </Text>
          ))}
          <Text style={styles.sectionHeadingText}>Share feedback</Text>
          {feedbackCopy.map(copy => (
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
