import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {MealDetail} from '../../components';
import {addMealItems} from '../../../../redux/actions';

const BASELINE_QUANTITY = '1';
const BASELINE_UNIT = 'g';

const getMealValues = meal => ({
  fat: meal.fat,
  prt: meal.prt,
  cho: meal.cho,
  cal: meal.cal,
});

const isFiniteDecimal = value => {
  if (value.trim() === '') {
    return false;
  }

  return Number.isFinite(Number(value));
};

export default function MealDetailPage(props) {
  const {navigation, route, onAddMealItems} = props;
  const {meal, targetMealId} = route.params;
  const baselineValues = getMealValues(meal);
  const [loader, setLoader] = useState(false);
  const [fat, setFat] = useState(baselineValues.fat);
  const [prt, setPrt] = useState(baselineValues.prt);
  const [cho, setCho] = useState(baselineValues.cho);
  const [cal, setCal] = useState(baselineValues.cal);
  const [unit, setUnit] = useState('');
  const [amount, setAmount] = useState('');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [entryErrorText, setEntryErrorText] = useState('');
  const [wheelPickerModal, setWheelPickerModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [quantity, setQuantity] = useState(BASELINE_QUANTITY);
  const [itemUnit, setItemUnit] = useState(BASELINE_UNIT);
  const [isCalculationStale, setIsCalculationStale] = useState(false);
  const addLockRef = useRef(false);

  const resetToBaseline = () => {
    setAmount('');
    setUnit('');
    setFat(baselineValues.fat);
    setPrt(baselineValues.prt);
    setCho(baselineValues.cho);
    setCal(baselineValues.cal);
    setQuantity(BASELINE_QUANTITY);
    setItemUnit(BASELINE_UNIT);
    setEntryErrorText('');
    setIsCalculationStale(false);
  };

  const markCalculationStale = () => {
    setIsCalculationStale(true);
    setEntryErrorText('Tap Calculate to update nutrition before adding to meal.');
  };

  const onAmountChange = text => {
    setAmount(text);
    markCalculationStale();
  };

  const onUnitChange = value => {
    setUnit(value);
    markCalculationStale();
  };

  const onCalculateHandler = () => {
    if (!amount.trim()) {
      setEntryErrorText('Enter an amount before calculating.');
      return;
    }

    if (!isFiniteDecimal(amount)) {
      setEntryErrorText('Amount must be a number.');
      return;
    }

    if (!unit.trim()) {
      setEntryErrorText('Choose a unit before calculating.');
      return;
    }

    const parsedAmount = Number(amount);

    setQuantity(amount.trim());
    setItemUnit(unit);
    setEntryErrorText('');
    setIsCalculationStale(false);

    switch (unit) {
      case 'kg': {
        const fatTemp = meal.fat * parsedAmount * 1000;
        const prtTemp = meal.prt * parsedAmount * 1000;
        const choTemp = meal.cho * parsedAmount * 1000;

        setFat(fatTemp);
        setPrt(prtTemp);
        setCho(choTemp);
        setCal(fatTemp * 9 + prtTemp * 4 + choTemp * 4);
        break;
      }
      case 'lbs': {
        const fatTemp = meal.fat * parsedAmount * 453.592;
        const prtTemp = meal.prt * parsedAmount * 453.592;
        const choTemp = meal.cho * parsedAmount * 453.592;

        setFat(fatTemp);
        setPrt(prtTemp);
        setCho(choTemp);
        setCal(fatTemp * 9 + prtTemp * 4 + choTemp * 4);
        break;
      }
      case 'oz': {
        const fatTemp = meal.fat * parsedAmount * 28.3495;
        const prtTemp = meal.prt * parsedAmount * 28.3495;
        const choTemp = meal.cho * parsedAmount * 28.3495;

        setFat(fatTemp);
        setPrt(prtTemp);
        setCho(choTemp);
        setCal(fatTemp * 9 + prtTemp * 4 + choTemp * 4);
        break;
      }
      case 'g': {
        const fatTemp = meal.fat * parsedAmount;
        const prtTemp = meal.prt * parsedAmount;
        const choTemp = meal.cho * parsedAmount;

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

    resetToBaseline();
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
    if (addLockRef.current || loader) {
      return;
    }

    if (isCalculationStale) {
      setEntryErrorText('Tap Calculate to update nutrition before adding to meal.');
      return;
    }

    addLockRef.current = true;
    setLoader(true);

    const data = {
      name: meal.name,
      fat: (Math.round(fat * 100) / 100).toString(),
      prt: (Math.round(prt * 100) / 100).toString(),
      cho: (Math.round(cho * 100) / 100).toString(),
      cal: (Math.round(cal * 100) / 100).toString(),
    };

    const response = await onAddMealItems(targetMealId, data);

    addLockRef.current = false;
    setLoader(false);

    if (response === true) {
      showMessage('Success!', 'Item added successfully.');
    } else {
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
      setUnit={onUnitChange}
      onAddMeal={onAddMeal}
      quantity={quantity}
      itemUnit={itemUnit}
      setAmount={onAmountChange}
      alertText={alertText}
      alertHeading={alertHeading}
      entryHelperText="Default serving starts at 1 g. Enter a custom amount and unit, then tap Calculate."
      entryErrorText={entryErrorText}
      addDisabled={isCalculationStale}
      wheelPickerModal={wheelPickerModal}
      setWheelPickerModal={setWheelPickerModal}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      onCalculateHandler={onCalculateHandler}
      onDonePermissionModal={onDonePermissionModal}
      onClearForm={resetToBaseline}
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
