import PropTypes from 'prop-types';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Picker } from 'react-native-wheel-pick';
import { colors, wheelPickerItems } from '../../resources';
import styles from './style';

const TimePickerModal = ({
  visible,
  onConfirm,
  onCancel,
  currentHours,
  currentMinutes,
  timeFormat,
  setHours,
  setMinutes,
  setTimeFormat,
}) => {
  const hours = wheelPickerItems.hours.map(i => i.value);
  const minutes = wheelPickerItems.minutes.map(i => i.value);
  const formats = wheelPickerItems.timeFormat.map(i => i.value);

  const [selectedHour, setSelectedHour] = useState(currentHours || hours[0]);
  const [selectedMinute, setSelectedMinute] = useState(
    currentMinutes || minutes[0],
  );
  const [selectedFormat, setSelectedFormat] = useState(
    timeFormat || formats[0],
  );

  const confirm = () => {
    setHours(selectedHour);
    setMinutes(selectedMinute);
    setTimeFormat(selectedFormat);
    onConfirm();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.wheelPickerContainer}>
        <View style={styles.wheelPickerView2}>
          <View style={{ flex: 1 }}>
            <Picker
              style={styles.wheelPickerStyle}
              selectedValue={selectedHour}
              pickerData={hours}
              onValueChange={val => setSelectedHour(val)}
              selectTextColor={colors.brightGreen}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Picker
              style={styles.wheelPickerStyle}
              selectedValue={selectedMinute}
              pickerData={minutes}
              onValueChange={val => setSelectedMinute(val)}
              selectTextColor={colors.brightGreen}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Picker
              style={styles.wheelPickerStyle}
              selectedValue={selectedFormat}
              pickerData={formats}
              onValueChange={val => setSelectedFormat(val)}
              selectTextColor={colors.brightGreen}
            />
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.pickerBtnsView} onPress={confirm}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.pickerBtnsView} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

TimePickerModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  currentHours: PropTypes.string,
  currentMinutes: PropTypes.string,
  timeFormat: PropTypes.string,
  setHours: PropTypes.func.isRequired,
  setMinutes: PropTypes.func.isRequired,
  setTimeFormat: PropTypes.func.isRequired,
};

export default TimePickerModal;
