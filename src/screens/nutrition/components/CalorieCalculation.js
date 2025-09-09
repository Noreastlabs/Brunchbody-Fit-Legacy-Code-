import React, {Component} from 'react';
import {Text, View, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import {colors} from '../../../resources';
import styles from './style';
import {Button, CustomSlider} from '../../../components';

export default class CalorieCalculation extends Component {
  render() {
    const {
      fat,
      protein,
      carbohydrates,
      targetCalories,
      onChangeHandler,
      toggleCalModal,
    } = this.props;
    const sliderOptions = [
      {
        id: 1,
        label: 'fat',
        value: fat,
      },
      {
        id: 2,
        label: 'protein',
        value: protein,
      },
      {
        id: 3,
        label: 'carbohydrates',
        value: carbohydrates,
      },
    ];

    return (
      <View>
        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Target Calories</Text>
          <TextInput
            value={targetCalories}
            placeholder="Enter Calories"
            placeholderTextColor={colors.grey}
            keyboardType="decimal-pad"
            onChangeText={text =>
              onChangeHandler({name: 'targetCalories', value: text})
            }
            style={styles.textInputStyle}
          />
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Macro Ratio</Text>

          {sliderOptions.map(item => (
            <View key={item.id}>
              <CustomSlider
                label={item.label}
                value={item.value}
                onChange={onChangeHandler}
              />
            </View>
          ))}
        </View>

        <View style={styles.btnView}>
          <Button
            title="Calculate"
            onPress={toggleCalModal}
            style={styles.btnStyle}
            titleStyle={styles.btnTitle}
          />
        </View>
      </View>
    );
  }
}

CalorieCalculation.propTypes = {
  fat: PropTypes.number.isRequired,
  protein: PropTypes.number.isRequired,
  carbohydrates: PropTypes.number.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  toggleCalModal: PropTypes.func.isRequired,
  targetCalories: PropTypes.string.isRequired,
};
