import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import CloseButton from '../CloseButton';
import styles from './style';

export default function CustomOptions(props) {
  const {
    data,
    style,
    isRemove,
    selectedOption,
    onOptionSelect,
    onRemove,
    opacity,
  } = props;

  return (
    <>
      <View style={[styles.btnsView, style]}>
        {data.map(item => (
          <View key={item.id}>
            <TouchableOpacity
              activeOpacity={opacity}
              onPress={() => onOptionSelect(item)}
              style={[
                (selectedOption?.name || selectedOption?.title) ===
                (item.name || item.title)
                  ? styles.btnStyleWithBorder
                  : styles.btnStyle,
                {backgroundColor: item.color || item.bgColor},
              ]}>
              <Text style={styles.btnTitle}>{item.name || item.title}</Text>
            </TouchableOpacity>
            {isRemove ? (
              <View style={styles.closeBtnView}>
                <CloseButton
                  style={styles.closeBtnStyle}
                  closeIconSize={15}
                  onPress={() => onRemove(item.id)}
                />
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </>
  );
}

CustomOptions.defaultProps = {
  style: {},
  isRemove: false,
  selectedOption: '',
  onOptionSelect: () => {},
  onRemove: () => {},
  opacity: 0.5,
};

CustomOptions.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  isRemove: PropTypes.bool,
  selectedOption: PropTypes.string,
  onOptionSelect: PropTypes.func,
  onRemove: PropTypes.func,
  opacity: PropTypes.number,
};
