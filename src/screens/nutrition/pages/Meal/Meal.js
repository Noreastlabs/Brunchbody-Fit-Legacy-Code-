/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Meal } from '../../components';
import {
  addMealItems,
  deleteMealItem,
  editMealItem,
} from '../../../../redux/actions';

const selectOptions = [
  { id: 1, option: 'FROM DIRECTORY' },
  { id: 2, option: 'CUSTOM ITEM' },
];

const createItemFields = [
  {
    id: 1,
    value: '',
    state: 'itemName',
    fieldName: 'Item Name',
    placeholder: 'Enter Name',
  },
  {
    id: 2,
    value: '',
    state: 'itemFat',
    fieldName: 'Enter Fat (Grams)',
    placeholder: 'Amount Fat (g)',
    keyboardType: 'decimal-pad',
  },
  {
    id: 3,
    value: '',
    state: 'itemProtein',
    fieldName: 'Enter Protein (Grams)',
    placeholder: 'Amount Protein (g)',
    keyboardType: 'decimal-pad',
  },
  {
    id: 4,
    value: '',
    state: 'itemCarbs',
    fieldName: 'Enter Carbs (Grams)',
    placeholder: 'Amount Carbs (g)',
    keyboardType: 'decimal-pad',
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
  const [itemName, setItemName] = useState('');
  const [itemFat, setItemFat] = useState('');
  const [itemProtein, setItemProtein] = useState('');
  const [itemCarbs, setItemCarbs] = useState('');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [check, setCheck] = useState('');

  const onChangeText = (text, itemState) => {
    if (itemState === 'itemName') {
      setItemName(text);
      createItemFields[0].value = text;
    }
    if (itemState === 'itemFat') {
      setItemFat(text);
      createItemFields[1].value = text;
    }
    if (itemState === 'itemProtein') {
      setItemProtein(text);
      createItemFields[2].value = text;
    }
    if (itemState === 'itemCarbs') {
      setItemCarbs(text);
      createItemFields[3].value = text;
    }
  };

  const onChooseOption = () => {
    setIsVisible(false);
    if (selectedOption === 'FROM DIRECTORY') {
      navigation.navigate('MealsList');
    } else {
      setBtnTitle('Add');
      setHeading('Add Item');
      setCreateItemModal(true);
      setShowDeleteBtn(false);
      setItemName('');
      setItemFat('');
      setItemProtein('');
      setItemCarbs('');
      createItemFields[0].value = '';
      createItemFields[1].value = '';
      createItemFields[2].value = '';
      createItemFields[3].value = '';
    }
  };

  const onEditItem = item => {
    setSelectedItem(item);
    setBtnTitle('Save');
    setHeading('Edit Item');
    setCreateItemModal(true);
    setShowDeleteBtn(true);
    setItemName(item.name);
    setItemFat(item.fat);
    setItemProtein(item.prt);
    setItemCarbs(item.cho);
    createItemFields[0].value = item.name;
    createItemFields[1].value = item.fat;
    createItemFields[2].value = item.prt;
    createItemFields[3].value = item.cho;
  };

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onCreateItem = async () => {
    setLoader(true);

    if (
      itemName.trim() &&
      itemFat.trim() &&
      itemProtein.trim() &&
      itemCarbs.trim()
    ) {
      const data = {
        name: itemName,
        fat: itemFat,
        prt: itemProtein,
        cho: itemCarbs,
        cal: `${itemFat * 9 + itemProtein * 4 + itemCarbs * 4}`,
      };
      let response = null;

      if (btnTitle === 'Add') {
        response = await onAddMealItems(meal.id, data);

        if (response === true) {
          setCreateItemModal(false);
          showMessage('Success!', `Item added successfully.`);
        } else {
          showMessage('Error!', response);
        }
      } else {
        response = await onEditMealItem({
          data,
          meal_id: meal.id,
          item_id: selectedItem.id,
        });

        if (response === true) {
          setCreateItemModal(false);
          showMessage('Success!', `Item edited successfully.`);
        } else {
          showMessage('Error!', response);
        }
      }
    } else {
      showMessage('Error!', 'All fields are required.');
    }

    setLoader(false);
  };

  const onDonePermissionModal = async () => {
    if (check === 'delete') {
      setDeleteLoader(true);

      const response = await onDeleteMealItem({
        meal_id: meal.id,
        item_id: selectedItem.id,
      });

      if (response === true) {
        setCheck('');
        setIsVisible(false);
        setDeleteLoader(false);
        setCreateItemModal(false);
        setPermissionModal(false);
      } else {
        setCheck('');
        setDeleteLoader(false);
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
      setCreateItemModal={setCreateItemModal}
      createItemFields={createItemFields}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      showDeleteBtn={showDeleteBtn}
      heading={heading}
      btnTitle={btnTitle}
      onEditItem={onEditItem}
      onChangeText={onChangeText}
      onCreateItem={onCreateItem}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
      setCheck={setCheck}
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
