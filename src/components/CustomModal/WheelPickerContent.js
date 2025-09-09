/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { Picker } from 'react-native-wheel-pick';
import styles from './style';
import { colors } from '../../resources';

export default function WheelPickerContent(props) {
  const { onConfirm, onCancel, pickerItems, onValueChange } = props;

  // Always use an array of strings for Picker
  const data = Array.isArray(pickerItems)
    ? pickerItems
        .filter(item => item !== null && item !== undefined)
        .map(item => {
          if (typeof item === 'object' && item !== null) {
            return item.name || item.value || String(item);
          }
          return String(item);
        })
    : [];

  const [selectedValue, setSelectedValue] = useState(data[0] || '');

  return (
    <>
      <View style={styles.wheelPickerContainer}>
        <View style={[styles.wheelPickerView2, { alignItems: 'center' }]}>
          {data.length > 0 ? (
            <Picker
              style={{
                width: '95%',
                height: 250,
                backgroundColor: colors.background,
              }}
              selectedValue={selectedValue}
              pickerData={data}
              onValueChange={value => setSelectedValue(value)}
              itemTextSize={22}
              selectedItemTextSize={24}
              selectedItemTextColor={colors.white}
              itemTextColor={colors.textGrey}
              selectTextColor={colors.brightGreen}
            />
          ) : (
            <Text style={{ color: colors.white, textAlign: 'center' }}>
              No options
            </Text>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.pickerBtnsView}
          onPress={() => {
            if (data.length > 0) {
              // Call onValueChange with a 1-based index to match callers that
              // expect an index and access pickerItems[index - 1].value
              const idx = data.indexOf(selectedValue);
              onValueChange(idx >= 0 ? idx + 1 : 1);
            }
            onConfirm();
          }}
        >
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.wheelPickerContainer, { marginTop: 0 }]}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.pickerBtnsView}
          onPress={onCancel}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

WheelPickerContent.defaultProps = {
  pickerItems: [],
  onConfirm: () => {},
  onValueChange: () => {},
  pickerType: '',
  exerciseType: '',
};

WheelPickerContent.propTypes = {
  onConfirm: PropTypes.func,
  onValueChange: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  pickerItems: PropTypes.arrayOf(PropTypes.any),
  pickerType: PropTypes.string,
  exerciseType: PropTypes.string,
};
