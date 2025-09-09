/* eslint-disable no-unused-expressions */
import React from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {CustomHeader} from '../../../../components';
import styles from './style';

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />
        <View style={styles.headingView}>
          <Text style={styles.headingText1}>Privacy Policy</Text>
        </View>
        <View style={{paddingVertical: 10, marginHorizontal: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
}

PrivacyPolicy.propTypes = {};
