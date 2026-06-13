import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {CustomHeader, SafeAreaWrapper} from '../../../../components';
import {privacyDataCopy} from '../../portabilityCopy';
import styles from './style';

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
