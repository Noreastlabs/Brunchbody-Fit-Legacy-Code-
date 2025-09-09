import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import CloseButton from '../CloseButton';
import SelectComp from '../SelectComp';
import Button from '../Button';
import {wheelPickerItems} from '../../resources';
import styles from './style';

export default function SupersetModal(props) {
  const {
    hideModal,
    heading,
    btnTitle,
    onBtnPress,
    numberOfExercises,
    numberOfSets,
    onDropdownSelect,
  } = props;

  return (
    <View style={styles.contentContainer}>
      <View style={styles.modalHead}>
        <Text style={styles.textStyle1}>{heading}</Text>
        <CloseButton onPress={hideModal} />
      </View>

      <SelectComp
        title="Number of Exercises"
        type={numberOfExercises || 'Amount'}
        style={styles.selectCompStyle}
        onPress={() =>
          onDropdownSelect(wheelPickerItems.sets, 'Number of Exercises')
        }
      />

      <SelectComp
        title="Number of Sets"
        type={numberOfSets || 'Sets'}
        style={styles.selectCompStyle}
        onPress={() => onDropdownSelect(wheelPickerItems.sets, 'Sets')}
      />

      <View style={styles.btnView2}>
        <Button title={btnTitle} onPress={onBtnPress} />
      </View>
    </View>
  );
}

SupersetModal.defaultProps = {};

SupersetModal.propTypes = {
  hideModal: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  btnTitle: PropTypes.string.isRequired,
  onBtnPress: PropTypes.func.isRequired,
  numberOfExercises: PropTypes.string.isRequired,
  numberOfSets: PropTypes.string.isRequired,
  onDropdownSelect: PropTypes.func.isRequired,
};
