import React from 'react';
import {View, Text, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import CloseButton from '../CloseButton';
import SelectComp from '../SelectComp';
import TextButton from '../TextButton';
import Button from '../Button';
import {colors, wheelPickerItems} from '../../resources';
import styles from './style';

export default function AddSingleExercise(props) {
  const {
    hideModal,
    heading,
    btnTitle,
    onBtnPress,
    exercise,
    numberOfSets,
    unit,
    onDropdownSelect,
    amount,
    setAmount,
    btnLoader,
    isDeleteBtn,
    onDeleteBtnPress,
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

      <SelectComp
        title="Number of Sets"
        type={numberOfSets || 'Sets'}
        style={styles.selectCompStyle}
        onPress={() => onDropdownSelect(wheelPickerItems.sets, 'Sets')}
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
          style={styles.selectCompStyle2}
          pickerViewStyle={{width: '80%'}}
          onPress={() =>
            onDropdownSelect(wheelPickerItems.exerciseUnits, 'Unit')
          }
        />
      </View>

      <View style={styles.btnView2}>
        <Button loader={btnLoader} title={btnTitle} onPress={onBtnPress} />
      </View>

      {isDeleteBtn ? (
        <View style={styles.bottomTextView2}>
          <TextButton title="Delete" onPress={onDeleteBtnPress} />
        </View>
      ) : null}
    </View>
  );
}

AddSingleExercise.defaultProps = {};

AddSingleExercise.propTypes = {
  hideModal: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  btnTitle: PropTypes.string.isRequired,
  onBtnPress: PropTypes.func.isRequired,
  exercise: PropTypes.string.isRequired,
  numberOfSets: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  onDropdownSelect: PropTypes.func.isRequired,
  amount: PropTypes.string.isRequired,
  setAmount: PropTypes.func.isRequired,
  btnLoader: PropTypes.bool.isRequired,
  isDeleteBtn: PropTypes.bool.isRequired,
  onDeleteBtnPress: PropTypes.func.isRequired,
  myExercises: PropTypes.arrayOf(PropTypes.any).isRequired,
};
