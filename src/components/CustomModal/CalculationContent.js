/* eslint-disable react/forbid-prop-types */
import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import CloseButton from '../CloseButton';
import Button from '../Button';
import {colors} from '../../resources';
import styles from './CalculationStyle';

export default function CalculationContent(props) {
  const {
    loader,
    targetCalories,
    fat,
    protein,
    carbohydrates,
    text,
    onClose,
    onCreateTargetCalories,
  } = props;

  const fatInGrams = Math.round((targetCalories * (fat / 100)) / 9);
  const prtInGrams = Math.round((targetCalories * (protein / 100)) / 4);
  const carbInGrams = Math.round((targetCalories * (carbohydrates / 100)) / 4);

  const mealOneFat = Math.round(fatInGrams * 0.6);
  const mealOnePrt = Math.round(prtInGrams * 0.4);
  const mealOneCho = Math.round(carbInGrams * 0.75);

  const mealTwoFat = Math.round(fatInGrams * 0.4);
  const mealTwoPrt = Math.round(prtInGrams * 0.6);
  const mealTwoCho = Math.round(carbInGrams * 0.25);

  return (
    <View style={styles.calculationContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>{text}</Text>
        <CloseButton
          closeIconSize={25}
          iconColor={colors.nonEditableOverlays}
          style={{backgroundColor: colors.white}}
          onPress={onClose}
        />
      </View>
      <Text style={styles.headingStyle}>Target Totals</Text>
      <View style={styles.tableContainer}>
        <View style={styles.tableContent}>
          <Text style={styles.item}>FAT</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.item}>PRT</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.item}>CHO</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.item}>CAL</Text>
        </View>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableContent}>
          <Text style={styles.bodytext}>{fatInGrams}</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.bodytext}>{prtInGrams}</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.bodytext}>{carbInGrams}</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.bodytext}>{targetCalories}</Text>
        </View>
      </View>

      <View style={styles.dottedLine} />

      <Text style={styles.headingStyle}>Meal #1</Text>
      <View style={styles.tableContainer}>
        <View style={styles.tableContent}>
          <Text style={styles.item}>FAT</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.item}>PRT</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.item}>CHO</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.item}>CAL</Text>
        </View>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableContent}>
          <Text style={styles.bodytext}>{mealOneFat}</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.bodytext}>{mealOnePrt}</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.bodytext}>{mealOneCho}</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.bodytext}>
            {mealOneFat * 9 + mealOnePrt * 4 + mealOneCho * 4}
          </Text>
        </View>
      </View>

      <Text style={styles.headingStyle}>Meal #2</Text>
      <View style={styles.tableContainer}>
        <View style={styles.tableContent}>
          <Text style={styles.item}>FAT</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.item}>PRT</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.item}>CHO</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.item}>CAL</Text>
        </View>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableContent}>
          <Text style={styles.bodytext}>{mealTwoFat}</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.bodytext}>{mealTwoPrt}</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.bodytext}>{mealTwoCho}</Text>
        </View>
        <View style={styles.tableContent}>
          <Text style={styles.bodytext}>
            {mealTwoFat * 9 + mealTwoPrt * 4 + mealTwoCho * 4}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          loader={loader}
          title="Add to Profile"
          onPress={onCreateTargetCalories}
        />
      </View>
    </View>
  );
}

CalculationContent.defaultProps = {
  onClose: () => {},
};

CalculationContent.propTypes = {
  text: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  targetCalories: PropTypes.string.isRequired,
  fat: PropTypes.string.isRequired,
  protein: PropTypes.string.isRequired,
  carbohydrates: PropTypes.string.isRequired,
  onCreateTargetCalories: PropTypes.func.isRequired,
  loader: PropTypes.bool.isRequired,
};
