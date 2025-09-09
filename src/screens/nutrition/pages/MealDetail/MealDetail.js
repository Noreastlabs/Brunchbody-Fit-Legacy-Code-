/* eslint-disable default-case */
/* eslint-disable no-fallthrough */
/* eslint-disable react/jsx-props-no-spreading */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MealDetail} from '../../components';
import {addMealItems} from '../../../../redux/actions';

export default function MealDetailPage(props) {
  const {navigation, route, onAddMealItems} = props;
  const {meal} = route.params;
  const [loader, setLoader] = useState(false);
  const [fat, setFat] = useState(meal.fat);
  const [prt, setPrt] = useState(meal.prt);
  const [cho, setCho] = useState(meal.cho);
  const [cal, setCal] = useState(meal.cal);
  const [unit, setUnit] = useState('');
  const [amount, setAmount] = useState('');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [wheelPickerModal, setWheelPickerModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [itemUnit, setItemUnit] = useState('g');

  const onCalculateHandler = () => {
    setQuantity(amount);
    setItemUnit(unit);
    switch (unit) {
      case 'kg': {
        const fatTemp = meal.fat * amount * 1000;
        const prtTemp = meal.prt * amount * 1000;
        const choTemp = meal.cho * amount * 1000;

        setFat(fatTemp);
        setPrt(prtTemp);
        setCho(choTemp);
        setCal(fatTemp * 9 + prtTemp * 4 + choTemp * 4);
        break;
      }
      case 'lbs': {
        const fatTemp = meal.fat * amount * 453.592;
        const prtTemp = meal.prt * amount * 453.592;
        const choTemp = meal.cho * amount * 453.592;

        setFat(fatTemp);
        setPrt(prtTemp);
        setCho(choTemp);
        setCal(fatTemp * 9 + prtTemp * 4 + choTemp * 4);
        break;
      }
      case 'oz': {
        const fatTemp = meal.fat * amount * 28.3495;
        const prtTemp = meal.prt * amount * 28.3495;
        const choTemp = meal.cho * amount * 28.3495;

        setFat(fatTemp);
        setPrt(prtTemp);
        setCho(choTemp);
        setCal(fatTemp * 9 + prtTemp * 4 + choTemp * 4);
        break;
      }
      case 'g': {
        const fatTemp = meal.fat * amount;
        const prtTemp = meal.prt * amount;
        const choTemp = meal.cho * amount;

        setFat(fatTemp);
        setPrt(prtTemp);
        setCho(choTemp);
        setCal(fatTemp * 9 + prtTemp * 4 + choTemp * 4);
        break;
      }
    }
  };

  const onDonePermissionModal = () => {
    if (alertHeading === 'Success!') {
      navigation.pop(3);
    }
    setAmount('');
    setUnit('');
    setFat(meal.fat);
    setPrt(meal.prt);
    setCho(meal.cho);
    setCal(meal.cal);
    setQuantity('1');
    setItemUnit('g');
    setPermissionModal(false);
    setTimeout(() => {
      setAlertHeading('');
      setAlertText('');
    }, 500);
  };

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onAddMeal = async () => {
    setLoader(true);
    const mealId = await AsyncStorage.getItem('meal_id');

    const data = {
      name: meal.name,
      fat: (Math.round(fat * 100) / 100).toString(),
      prt: (Math.round(prt * 100) / 100).toString(),
      cho: (Math.round(cho * 100) / 100).toString(),
      cal: (Math.round(cal * 100) / 100).toString(),
    };

    const response = await onAddMealItems(mealId, data);

    if (response === true) {
      setLoader(false);
      showMessage('Success!', `Item added successfully.`);
    } else {
      setLoader(false);
      showMessage('Error!', response);
    }
  };

  return (
    <MealDetail
      {...props}
      fat={fat}
      prt={prt}
      cho={cho}
      cal={cal}
      unit={unit}
      loader={loader}
      amount={amount}
      setUnit={setUnit}
      onAddMeal={onAddMeal}
      quantity={quantity}
      itemUnit={itemUnit}
      setAmount={setAmount}
      alertText={alertText}
      alertHeading={alertHeading}
      wheelPickerModal={wheelPickerModal}
      setWheelPickerModal={setWheelPickerModal}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      onCalculateHandler={onCalculateHandler}
      onDonePermissionModal={onDonePermissionModal}
    />
  );
}

MealDetailPage.defaultProps = {
  route: {},
};

MealDetailPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  route: PropTypes.objectOf(PropTypes.any),
  onAddMealItems: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onAddMealItems: (id, data) => dispatch(addMealItems(id, data)),
});

export const MealDetailWrapper = connect(
  null,
  mapDispatchToProps,
)(MealDetailPage);
