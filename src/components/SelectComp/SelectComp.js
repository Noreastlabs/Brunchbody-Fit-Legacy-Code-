import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';
import styles from './style';

export default function SelectComp(props) {
  const {
    title,
    type,
    style,
    onPress,
    pickerViewStyle,
    textStyle,
    accessibilityLabel = '',
    accessibilityHint,
  } = props;
  const selectAccessibilityLabel =
    accessibilityLabel || [title, type].filter(Boolean).join(', ');

  return (
    <View style={[styles.container, style]}>
      {title !== '' ? (
        <Text style={[styles.titleStyle, textStyle]}>{title}</Text>
      ) : null}

      <TouchableOpacity
        accessibilityHint={accessibilityHint}
        accessibilityLabel={selectAccessibilityLabel}
        accessibilityRole="button"
        activeOpacity={0.5}
        style={[styles.pickerView, pickerViewStyle]}
        onPress={onPress}>
        <Text numberOfLines={1} style={styles.typeStyle}>
          {type}
        </Text>

        <MaterialIcons
          name="keyboard-arrow-down"
          size={RFValue(25)}
          color={colors.textGrey}
        />
      </TouchableOpacity>
    </View>
  );
}

SelectComp.defaultProps = {
  title: '',
  style: {},
  onPress: () => {},
  pickerViewStyle: {},
  textStyle: {},
  accessibilityLabel: '',
  accessibilityHint: undefined,
};

SelectComp.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  onPress: PropTypes.func,
  pickerViewStyle: PropTypes.objectOf(PropTypes.any),
  textStyle: PropTypes.objectOf(PropTypes.any),
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
};
