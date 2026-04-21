import React from 'react';
import {View, Text, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import {colors, wheelPickerItems} from '../../resources';
import SelectComp from '../SelectComp';
import styles from './style';

export default function SupersetExeComp(props) {
  const {
    onDropdownSelect,
    onAmountChange,
    exeNum,
    supersetOptions,
    myExercises,
    fieldErrors,
  } = props;

  const currentFieldErrors = fieldErrors || {};
  const renderErrorText = text =>
    text ? (
      <Text style={[styles.supportingText, styles.supportingTextError]}>
        {text}
      </Text>
    ) : null;

  return (
    <View>
      <Text style={[styles.mediumText, styles.setMargin3]}>
        Exercise #{exeNum}
      </Text>
      <SelectComp
        title="Select Exercise"
        type={supersetOptions[exeNum - 1]?.exercise || 'Exercise'}
        style={styles.selectCompStyle}
        onPress={() => onDropdownSelect(myExercises, 'Exercise', exeNum - 1)}
      />
      {renderErrorText(currentFieldErrors.exercise)}

      <View style={styles.flexRowView2}>
        <View style={{flex: 0.3}}>
          <Text style={styles.subHeading}>Amount</Text>
          <TextInput
            value={supersetOptions[exeNum - 1]?.amount || ''}
            placeholder="Amount"
            placeholderTextColor={colors.white}
            keyboardType="decimal-pad"
            style={styles.textInputStyle}
            onChangeText={text => onAmountChange(text, exeNum - 1)}
          />
          {renderErrorText(currentFieldErrors.amount)}
        </View>
        <View style={styles.supportingTextContainer}>
          <SelectComp
            title="Select Unit"
            type={supersetOptions[exeNum - 1]?.unit || 'Unit'}
            onPress={() =>
              onDropdownSelect(wheelPickerItems.exerciseUnits, 'Unit', exeNum - 1)
            }
            style={styles.selectCompStyle2}
            pickerViewStyle={{width: '80%'}}
          />
          {renderErrorText(currentFieldErrors.unit)}
        </View>
      </View>
    </View>
  );
}

SupersetExeComp.propTypes = {
  onDropdownSelect: PropTypes.func.isRequired,
  onAmountChange: PropTypes.func.isRequired,
  exeNum: PropTypes.number.isRequired,
  supersetOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  myExercises: PropTypes.arrayOf(PropTypes.any).isRequired,
  fieldErrors: PropTypes.objectOf(PropTypes.any),
};
