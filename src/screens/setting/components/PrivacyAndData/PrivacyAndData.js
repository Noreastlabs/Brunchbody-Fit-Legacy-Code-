import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {CustomHeader, SafeAreaWrapper} from '../../../../components';
import styles from './style';

const privacyDataCopy = [
  'Brunch Body is local-first in the current app. Your Brunch Body data is stored on this device in local app storage.',
  'The current app does not automatically sync your data to a Brunch Body cloud service.',
  'Brunch Body does not currently provide automatic Brunch Body cloud backup for device-local app data.',
  'Profile and vitals values are stored locally and used for in-app calculations and display.',
  'Exported files may contain personal fitness, journal, nutrition, supplement, reflection, or profile-related information depending on what you export. Once exported, you are responsible for where the file is saved, copied, shared, uploaded, or deleted.',
  'Delete local data removes saved Brunch Body data from this device. It does not remove files you exported, copied, shared, uploaded, or saved outside the app.',
  'This screen is a plain-English explanation of current app behavior. It is not the legal Privacy Policy or Terms of Use.',
];

export default function PrivacyAndData() {
  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />
        <View style={styles.headingView}>
          <Text style={styles.headingText1}>Privacy & Data</Text>
        </View>
        <View style={styles.contentView}>
          {privacyDataCopy.map(copy => (
            <Text key={copy} style={styles.bodyText}>
              {copy}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

PrivacyAndData.propTypes = {};
