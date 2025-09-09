/* eslint-disable react/forbid-prop-types */
import React from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';

export default function CustomText(props) {
  const {text, style} = props;

  return (
    <View style={[styles.textView, style]}>
      <Text numberOfLines={1} style={styles.textStyle}>
        {text}
      </Text>
    </View>
  );
}

CustomText.defaultProps = {
  style: {} || [],
};

CustomText.propTypes = {
  text: PropTypes.any.isRequired,
  style: PropTypes.any,
};
