/* eslint-disable no-unused-expressions */
import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {CustomHeader, SafeAreaWrapper} from '../../../../components';

import styles from './style';

export default function Abbrevations(props) {
  const {abbrevationList} = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />
        <View style={styles.headingView}>
          <Text style={styles.headingText}>Abbrevations</Text>
        </View>
        <View style={{paddingVertical: 10, marginHorizontal: 20}}>
          {abbrevationList.map(abbrevation => (
            <Text style={styles.textStyle}>
              {abbrevation.shortName} - {abbrevation.longName}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
  // }
}

Abbrevations.propTypes = {
  abbrevationList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
    .isRequired,
};
