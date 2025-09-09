/* eslint-disable no-nested-ternary */
import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import CustomOptions from '../CustomOptions';
import CloseButton from '../CloseButton';
import SelectComp from '../SelectComp';
import TextButton from '../TextButton';
import Button from '../Button';
import styles from './style';
import {colors} from '../../resources';

export default function AddRemoveTheme(props) {
  const {
    hideModal,
    selectedTheme,
    themeOptions,
    setSelectedTheme,
    frequency,
    onBtnPress,
    showWheelPicker,
    btnLoader,
    isDateSelected,
    setDatePickerModal,
    date,
    month,
    year,
    disabled,
    setDisabled,
    setPermissionModal,
    currentTheme,
    setCheck,
    daysToFollow,
    setDaysToFollow,
  } = props;

  const durationPlaceholder =
    frequency === 'Daily'
      ? 'days'
      : frequency === 'Weekly' || frequency === 'BiWeekly'
      ? 'weeks'
      : frequency === 'Monthly'
      ? 'months'
      : 'never';

  return (
    <View style={styles.contentContainer}>
      <View style={styles.modalHead}>
        <Text style={styles.textStyle1}>Add/Remove Theme</Text>
        <CloseButton onPress={hideModal} />
      </View>

      <View style={styles.setMargin2}>
        <Text style={styles.subHeading}>Select Day</Text>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            setDatePickerModal(true);
            setCheck('changeRepeatedTheme');
          }}>
          <Text style={styles.dateText}>
            {isDateSelected
              ? `${month}/${date}/${year}`
              : `${
                  new Date().getMonth() + 1
                }/${new Date().getDate()}/${new Date().getFullYear()}`}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.setMargin2}>
        <Text style={styles.subHeading}>Select Theme</Text>

        <CustomOptions
          data={themeOptions}
          selectedOption={selectedTheme}
          onOptionSelect={item => {
            setSelectedTheme(item);
            setDisabled(false);
          }}
        />
      </View>

      <View style={styles.setMargin2}>
        <View style={styles.flexRowView3}>
          <Text style={styles.subHeading}>Current Theme</Text>
          {Object.keys(currentTheme).length ? (
            <TextButton
              title="Clear"
              onPress={() => {
                setCheck('clearTheme');
                setPermissionModal(true);
              }}
            />
          ) : null}
        </View>

        <View style={{flexWrap: 'wrap'}}>
          <View
            style={[
              styles.themeContainer,
              {backgroundColor: currentTheme.color || colors.tertiary},
            ]}>
            <Text style={styles.themeText}>
              {currentTheme?.name || 'Empty'}
            </Text>
          </View>
        </View>
      </View>

      <SelectComp
        title="Frequency"
        type={frequency || 'Repeat Every'}
        onPress={showWheelPicker}
        pickerViewStyle={{width: '60%'}}
        style={styles.selectCompStyle}
      />

      {durationPlaceholder !== 'never' && (
        <View style={styles.setMargin2}>
          <Text style={styles.subHeading}>Duration</Text>

          <TextInput
            maxLength={3}
            value={daysToFollow}
            placeholder={`# of ${durationPlaceholder}`}
            style={styles.daysInputContainer}
            keyboardType="number-pad"
            onChangeText={text => {
              const regx = /^(\s*|\d+)$/; // Regx which should contain only numbers and empty string.
              if (regx.test(text)) setDaysToFollow(text);
            }}
          />
        </View>
      )}

      <View style={styles.btnView2}>
        <Button
          loader={btnLoader}
          disabled={disabled}
          title="Save"
          onPress={onBtnPress}
        />
      </View>
    </View>
  );
}

AddRemoveTheme.defaultProps = {
  currentTheme: {},
};

AddRemoveTheme.propTypes = {
  hideModal: PropTypes.func.isRequired,
  selectedTheme: PropTypes.objectOf(PropTypes.any).isRequired,
  themeOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  setSelectedTheme: PropTypes.func.isRequired,
  frequency: PropTypes.string.isRequired,
  onBtnPress: PropTypes.func.isRequired,
  showWheelPicker: PropTypes.func.isRequired,
  btnLoader: PropTypes.bool.isRequired,
  isDateSelected: PropTypes.bool.isRequired,
  setDatePickerModal: PropTypes.func.isRequired,
  date: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  setDisabled: PropTypes.func.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  currentTheme: PropTypes.objectOf(PropTypes.any),
  setCheck: PropTypes.func.isRequired,
  daysToFollow: PropTypes.string.isRequired,
  setDaysToFollow: PropTypes.func.isRequired,
};
