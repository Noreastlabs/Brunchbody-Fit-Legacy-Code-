import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {CustomHeader, SafeAreaWrapper} from '../../../../components';
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
          <Text style={styles.bodyText}>
            This screen is reserved for a plain-English Privacy & Data
            explanation.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

PrivacyAndData.propTypes = {};
