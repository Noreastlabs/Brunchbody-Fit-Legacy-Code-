import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Meal } from '../../components';
import {
  addMealItems,
  deleteMealItem,
  editMealItem,
} from '../../../../redux/actions';
import { NUTRITION_ROUTES } from '../../../../navigation/routeNames';

const selectOptions = [
  { id: 1, option: 'FROM DIRECTORY' },
  { id: 2, option: 'CUSTOM ITEM' },
];

const initialFormValues = {
  itemName: '',
  itemFat: '',
  itemProtein: '',
  itemCarbs: '',
};

const macroLabels = {
  itemFat: 'fat',
  itemProtein: 'protein',
  itemCarbs: 'carbs',
};

const isFiniteDecimal = value => {
  if (value.trim() === '') {
    return false;
  }

  return Number.isFinite(Number(value));
};

const getCreateItemFields = ({ formValues, fieldErrors }) => [
  {
    id: 1,
    value: formValues.itemName,
    state: 'itemName',
    fieldName: 'Meal Item Name',
    placeholder: 'Enter meal item name',
    helperText: 'Use a clear label for this meal item.',
    errorText: fieldErrors.itemName,
  },
  {
    id: 2,
    value: formValues.itemFat,
    state: 'itemFat',
    fieldName: 'Fat (g)',
    placeholder: 'Enter fat in grams',
    keyboardType: 'decimal-pad',
    helperText: 'Numbers can include decimals. Enter grams per item.',
    errorText: fieldErrors.itemFat,
  },
  {
    id: 3,
    value: formValues.itemProtein,
    state: 'itemProtein',
    fieldName: 'Protein (g)',
    placeholder: 'Enter protein in grams',
    keyboardType: 'decimal-pad',
    helperText: 'Numbers can include decimals. Enter grams per item.',
    errorText: fieldErrors.itemProtein,
  },
  {
    id: 4,
    value: formValues.itemCarbs,
    state: 'itemCarbs',
    fieldName: 'Carbs (g)',
    placeholder: 'Enter carbs in grams',
    keyboardType: 'decimal-pad',
    helperText: 'Numbers can include decimals. Enter grams per item.',
    errorText: fieldErrors.itemCarbs,
  },
];

export default function MealPage(props) {
  const {
    navigation,
    route,
    onAddMealItems,
    onDeleteMealItem,
    onEditMealItem,
  } = props;
  const { meal } = route.params;
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [createItemModal, setCreateItemModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState('FROM DIRECTORY');
  const [permissionModal, setPermissionModal] = useState(false);
  const [showDeleteBtn, setShowDeleteBtn] = useState(true);
  const [heading, setHeading] = useState('Add Item');
  const [btnTitle, setBtnTitle] = useState('Add');
  const [formValues, setFormValues] = useState(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState({});
  const [createItemFormErrorText, setCreateItemFormErrorText] = useState('');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [check, setCheck] = useState('');
  const submitLockRef = useRef(false);
  const deleteLockRef = useRef(false);

  const createItemFields = getCreateItemFields({ formValues, fieldErrors });

  const resetFormState = () => {
    setFormValues(initialFormValues);
    setFieldErrors({});
    setCreateItemFormErrorText('');
    setSelectedItem(null);
  };

  const closeCreateItemModal = () => {
    submitLockRef.current = false;
    setLoader(false);
    setCreateItemModal(false);
    resetFormState();
  };

  const onChangeText = (text, itemState) => {
    setFormValues(currentValues => ({
      ...currentValues,
      [itemState]: text,
    }));
    setFieldErrors(currentErrors => ({
      ...currentErrors,
      [itemState]: '',
    }));
    setCreateItemFormErrorText('');
  };

  const validateForm = () => {
    const errors = {};

    if (!formValues.itemName.trim()) {
      errors.itemName = 'Enter a meal item name.';
    }

    Object.keys(macroLabels).forEach(fieldName => {
      const value = formValues[fieldName].trim();
      const label = macroLabels[fieldName];

      if (!value) {
        errors[fieldName] = `Enter ${label} in grams.`;
      } else if (!isFiniteDecimal(value)) {
        errors[fieldName] = `${label[0].toUpperCase()}${label.slice(1)} must be a number.`;
      }
    });

    setFieldErrors(errors);
    setCreateItemFormErrorText(
      Object.keys(errors).length > 0
        ? 'Check the highlighted meal item fields before saving.'
        : '',
    );

    return Object.keys(errors).length === 0;
  };

  const onChooseOption = () => {
    setIsVisible(false);
    if (selectedOption === 'FROM DIRECTORY') {
      navigation.navigate(NUTRITION_ROUTES.MEALS_LIST, {
        targetMealId: meal.id,
      });
    } else {
      setBtnTitle('Add');
      setHeading('Add Item');
      setShowDeleteBtn(false);
      setCreateItemModal(true);
      resetFormState();
    }
  };

  const onEditItem = item => {
    setSelectedItem(item);
    setBtnTitle('Save');
    setHeading('Edit Item');
    setCreateItemModal(true);
    setShowDeleteBtn(true);
    setFieldErrors({});
    setCreateItemFormErrorText('');
    setFormValues({
      itemName: item.name || '',
      itemFat: `${item.fat ?? ''}`,
      itemProtein: `${item.prt ?? ''}`,
      itemCarbs: `${item.cho ?? ''}`,
    });
  };

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const closePermissionModal = () => {
    if (deleteLoader) {
      return;
    }

    setCheck('');
    setPermissionModal(false);
    setTimeout(() => {
      setAlertText('');
      setAlertHeading('');
    }, 500);
  };

  const onRequestDelete = () => {
    if (deleteLockRef.current) {
      return;
    }

    setPermissionModal(true);
    setCheck('delete');
  };

  const onCreateItem = async () => {
    if (submitLockRef.current || loader) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    submitLockRef.current = true;
    setLoader(true);

    const data = {
      name: formValues.itemName.trim(),
      fat: formValues.itemFat.trim(),
      prt: formValues.itemProtein.trim(),
      cho: formValues.itemCarbs.trim(),
      cal: `${formValues.itemFat * 9 + formValues.itemProtein * 4 + formValues.itemCarbs * 4}`,
    };

    let response = null;

    if (btnTitle === 'Add') {
      response = await onAddMealItems(meal.id, data);
    } else {
      response = await onEditMealItem({
        data,
        meal_id: meal.id,
        item_id: selectedItem.id,
      });
    }

    submitLockRef.current = false;
    setLoader(false);

    if (response === true) {
      setCreateItemModal(false);
      resetFormState();
      showMessage(
        'Success!',
        btnTitle === 'Add' ? 'Item added successfully.' : 'Item edited successfully.',
      );
    } else {
      showMessage('Error!', response);
    }
  };

  const onDonePermissionModal = async () => {
    if (check === 'delete') {
      if (deleteLockRef.current || !selectedItem) {
        return;
      }

      deleteLockRef.current = true;
      setDeleteLoader(true);

      const response = await onDeleteMealItem({
        meal_id: meal.id,
        item_id: selectedItem.id,
      });

      deleteLockRef.current = false;
      setDeleteLoader(false);

      if (response === true) {
        setCheck('');
        setIsVisible(false);
        setCreateItemModal(false);
        setPermissionModal(false);
        resetFormState();
      } else {
        setCheck('');
        showMessage('Error!', response);
      }
    } else {
      setCheck('');
      setPermissionModal(false);
      setTimeout(() => {
        setAlertText('');
        setAlertHeading('');
      }, 500);
    }
  };

  return (
    <Meal
      {...props}
      loader={loader}
      deleteLoader={deleteLoader}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      selectOptions={selectOptions}
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
      onChooseOption={onChooseOption}
      createItemModal={createItemModal}
      closeCreateItemModal={closeCreateItemModal}
      createItemFields={createItemFields}
      createItemFormErrorText={createItemFormErrorText}
      permissionModal={permissionModal}
      closePermissionModal={closePermissionModal}
      showDeleteBtn={showDeleteBtn}
      heading={heading}
      btnTitle={btnTitle}
      onEditItem={onEditItem}
      onChangeText={onChangeText}
      onCreateItem={onCreateItem}
      onRequestDelete={onRequestDelete}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
    />
  );
}

MealPage.defaultProps = {
  route: {},
};

MealPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  route: PropTypes.objectOf(PropTypes.any),
  onAddMealItems: PropTypes.func.isRequired,
  onDeleteMealItem: PropTypes.func.isRequired,
  onEditMealItem: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  myMealItems: state.nutrition?.mealItems,
});

const mapDispatchToProps = dispatch => ({
  onAddMealItems: (id, data) => dispatch(addMealItems(id, data)),
  onEditMealItem: data => dispatch(editMealItem(data)),
  onDeleteMealItem: data => dispatch(deleteMealItem(data)),
});

export const MealWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MealPage);
