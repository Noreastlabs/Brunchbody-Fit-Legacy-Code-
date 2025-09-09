import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Picker } from 'react-native-wheel-pick';
import styles from './style';
import { colors, wheelPickerItems } from '../../resources';

export default function HeightPickerModal(props) {
  const { onConfirm, onCancel, feet, setFeet, inches, setInches } = props;

  const feetList = wheelPickerItems.feets.map(item => item.value);
  const inchesList = wheelPickerItems.inches.map(item => item.value);

  const selectedFeetIndex = wheelPickerItems.feets.findIndex(
    item => item.id === feet,
  );
  const selectedInchesIndex = wheelPickerItems.inches.findIndex(
    item => item.id === inches,
  );

  return (
    <>
      <View style={styles.wheelPickerContainer}>
        <View style={styles.wheelPickerView2}>
          <View style={{ paddingHorizontal: 10 }}>
            <Picker
              style={{
                width: 100,
                height: 200,
                backgroundColor: colors.background,
              }}
              selectedValue={feetList[selectedFeetIndex]}
              pickerData={feetList}
              onValueChange={value => {
                const selected = wheelPickerItems.feets.find(
                  item => item.value === value,
                );
                if (selected) setFeet(selected.id);
              }}
              selectTextColor={colors.brightGreen}
              textColor="gray"
              selectedTextColor="white"
              textSize={20}
            />
            <Text
              style={[
                styles.mediumText,
                { textAlign: 'center', marginTop: 10 },
              ]}
            >
              ft
            </Text>
          </View>

          <View style={{ paddingHorizontal: 10 }}>
            <Picker
              style={{
                width: 100,
                height: 200,
                backgroundColor: colors.background,
              }}
              selectTextColor={colors.brightGreen}
              selectedValue={inchesList[selectedInchesIndex]}
              pickerData={inchesList}
              onValueChange={value => {
                const selected = wheelPickerItems.inches.find(
                  item => item.value === value,
                );
                if (selected) setInches(selected.id);
              }}
              textColor="gray"
              selectedTextColor="white"
              textSize={20}
            />
            <Text
              style={[
                styles.mediumText,
                { textAlign: 'center', marginTop: 10 },
              ]}
            >
              in
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.pickerBtnsView}
          onPress={onConfirm}
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

HeightPickerModal.defaultProps = {
  onConfirm: () => {},
};

HeightPickerModal.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  feet: PropTypes.number.isRequired,
  setFeet: PropTypes.func.isRequired,
  inches: PropTypes.number.isRequired,
  setInches: PropTypes.func.isRequired,
};
