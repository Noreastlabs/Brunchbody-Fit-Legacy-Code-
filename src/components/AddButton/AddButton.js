import React from 'react';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Feather from 'react-native-vector-icons/Feather';
import styles from './style';

export default function AddButton(props) {
  const {onPress, accessibilityLabel = 'Add', accessibilityHint} = props;

  return (
    <TouchableOpacity
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      activeOpacity={0.5}
      style={styles.plusIconView}
      onPress={onPress}>
      <Feather name="plus" size={23} style={styles.iconStyle} />
    </TouchableOpacity>
  );
}

AddButton.defaultProps = {
  onPress: () => {},
  accessibilityLabel: 'Add',
  accessibilityHint: undefined,
};

AddButton.propTypes = {
  onPress: PropTypes.func,
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
};
