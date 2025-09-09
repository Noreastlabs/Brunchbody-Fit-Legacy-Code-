/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import {View, Text, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import {colors, wheelPickerItems} from '../../resources';
import CloseButton from '../CloseButton';
import SelectComp from '../SelectComp';
import TextButton from '../TextButton';
import Button from '../Button';
import styles from './style';

export default function AddCardioExercise(props) {
  const {
    hideModal,
    heading,
    btnTitle,
    onBtnPress,
    isDeleteBtn,
    onDeleteBtnPress,
    exercise,
    unit,
    amount,
    setAmount,
    onDropdownSelect,
    myExercises,
  } = props;

  return (
    <View style={styles.contentContainer}>
      <View style={styles.modalHead}>
        <Text style={styles.textStyle1}>{heading}</Text>
        <CloseButton onPress={hideModal} />
      </View>

      <SelectComp
        title="Select Exercise"
        type={exercise || 'Exercise'}
        style={styles.selectCompStyle}
        onPress={() => onDropdownSelect(myExercises, 'Exercise')}
      />

      <View style={styles.flexRowView2}>
        <View style={{flex: 0.3}}>
          <Text style={styles.subHeading}>Amount</Text>
          <TextInput
            value={amount}
            placeholder="Amount"
            placeholderTextColor={colors.white}
            keyboardType="decimal-pad"
            style={styles.textInputStyle}
            onChangeText={text => setAmount(text)}
          />
        </View>
        <SelectComp
          title="Select Unit"
          type={unit || 'Unit'}
          onPress={() =>
            onDropdownSelect(wheelPickerItems.exerciseUnits, 'Unit')
          }
          style={styles.selectCompStyle2}
          pickerViewStyle={{width: '80%'}}
        />
      </View>

      <View style={styles.btnView2}>
        <Button title={btnTitle} onPress={onBtnPress} />
      </View>

      {isDeleteBtn ? (
        <View style={styles.bottomTextView2}>
          <TextButton title="Delete" onPress={onDeleteBtnPress} />
        </View>
      ) : null}
    </View>
  );
}

AddCardioExercise.propTypes = {
  hideModal: PropTypes.func.isRequired,
  onDropdownSelect: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  btnTitle: PropTypes.string.isRequired,
  exercise: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  setAmount: PropTypes.func.isRequired,
  onBtnPress: PropTypes.func.isRequired,
  isDeleteBtn: PropTypes.bool.isRequired,
  onDeleteBtnPress: PropTypes.func.isRequired,
  myExercises: PropTypes.arrayOf(PropTypes.any).isRequired,
};
