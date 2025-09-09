import React from 'react';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import {RFValue} from 'react-native-responsive-fontsize';
import styles from './style';
import {colors} from '../../resources';

export default function CloseButton(props) {
  const {onPress, style, closeIconSize, iconColor} = props;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.btnContainer, style]}>
      <Entypo
        name="cross"
        size={RFValue(closeIconSize || 25)}
        color={iconColor || colors.background}
      />
    </TouchableOpacity>
  );
}

CloseButton.defaultProps = {
  style: {},
  closeIconSize: null,
  onPress: () => {},
  iconColor: '',
};

CloseButton.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  closeIconSize: PropTypes.number,
  iconColor: PropTypes.string,
};
