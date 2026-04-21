import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import {
  addSupplementItems,
  deleteSupplementItem,
  editSupplementItem,
} from '../../../../redux/actions';
import { wheelPickerItems } from '../../../../resources';
import { Supplement } from '../../components';

const initialFormValues = {
  itemName: '',
  itemAmount: '',
  itemUnit: '',
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
    fieldName: 'Supplement Item Name',
    placeholder: 'Enter supplement item name',
    state: 'itemName',
    helperText: 'Use a clear label for this supplement item.',
    errorText: fieldErrors.itemName,
  },
  {
    id: 2,
    value: formValues.itemAmount,
    fieldName: 'Amount',
    placeholder: 'Enter amount',
    keyboardType: 'decimal-pad',
    state: 'itemAmount',
    helperText: 'Numbers can include decimals.',
    errorText: fieldErrors.itemAmount,
  },
  {
    id: 3,
    value: formValues.itemUnit,
    fieldName: 'Unit',
    picker: true,
    pickerLabel: 'Choose unit',
    state: 'itemUnit',
    helperText: 'Select the unit used for this supplement item.',
    errorText: fieldErrors.itemUnit,
  },
];

export default function SupplementPage(props) {
  const {
    route,
    onAddSupplementItems,
    onDeleteSupplementItem,
    onEditSupplementItem,
  } = props;
  const { supplement } = route.params;
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [createItemModal, setCreateItemModal] = useState(false);
  const [wheelPickerModal, setWheelPickerModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [showDeleteBtn, setShowDeleteBtn] = useState(true);
  const [heading, setHeading] = useState('Add Supplement');
  const [btnTitle, setBtnTitle] = useState('Create');
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
    setWheelPickerModal(false);
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

  const onItemUnitChange = value => {
    setFormValues(currentValues => ({
      ...currentValues,
      itemUnit: value,
    }));
    setFieldErrors(currentErrors => ({
      ...currentErrors,
      itemUnit: '',
    }));
    setCreateItemFormErrorText('');
  };

  const validateForm = () => {
    const errors = {};

    if (!formValues.itemName.trim()) {
      errors.itemName = 'Enter a supplement item name.';
    }

    if (!formValues.itemAmount.trim()) {
      errors.itemAmount = 'Enter an amount.';
    } else if (!isFiniteDecimal(formValues.itemAmount)) {
      errors.itemAmount = 'Amount must be a number.';
    }

    if (!formValues.itemUnit.trim()) {
      errors.itemUnit = 'Choose a unit.';
    }

    setFieldErrors(errors);
    setCreateItemFormErrorText(
      Object.keys(errors).length > 0
        ? 'Check the highlighted supplement fields before saving.'
        : '',
    );

    return Object.keys(errors).length === 0;
  };

  const onOpenModal = () => {
    setCreateItemModal(true);
    setHeading('Add Supplement');
    setBtnTitle('Create');
    setShowDeleteBtn(false);
    resetFormState();
  };

  const onEditItem = item => {
    setSelectedItem(item);
    setCreateItemModal(true);
    setHeading('Edit Supplement');
    setBtnTitle('Save');
    setShowDeleteBtn(true);
    setFieldErrors({});
    setCreateItemFormErrorText('');
    setFormValues({
      itemName: item.name || '',
      itemAmount: `${item.qty ?? ''}`,
      itemUnit: item.unt || '',
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
      qty: formValues.itemAmount.trim(),
      unt: formValues.itemUnit.trim(),
    };

    let response = null;

    if (btnTitle === 'Create') {
      response = await onAddSupplementItems(supplement.id, data);
    } else {
      response = await onEditSupplementItem({
        data,
        supplement_id: supplement.id,
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
        btnTitle === 'Create' ? 'Item added successfully.' : 'Item edited successfully.',
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

      const response = await onDeleteSupplementItem({
        supplement_id: supplement.id,
        item_id: selectedItem.id,
      });

      deleteLockRef.current = false;
      setDeleteLoader(false);

      if (response === true) {
        setCheck('');
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
    <Supplement
      {...props}
      loader={loader}
      deleteLoader={deleteLoader}
      createItemFields={createItemFields}
      createItemModal={createItemModal}
      closeCreateItemModal={closeCreateItemModal}
      createItemFormErrorText={createItemFormErrorText}
      wheelPickerModal={wheelPickerModal}
      setWheelPickerModal={setWheelPickerModal}
      pickerItems={wheelPickerItems.units}
      permissionModal={permissionModal}
      closePermissionModal={closePermissionModal}
      showDeleteBtn={showDeleteBtn}
      heading={heading}
      btnTitle={btnTitle}
      onOpenModal={onOpenModal}
      onChangeText={onChangeText}
      alertHeading={alertHeading}
      alertText={alertText}
      setItemUnit={onItemUnitChange}
      onDonePermissionModal={onDonePermissionModal}
      onCreateItem={onCreateItem}
      itemUnit={formValues.itemUnit}
      onEditItem={onEditItem}
      onRequestDelete={onRequestDelete}
    />
  );
}

SupplementPage.defaultProps = {
  route: {},
};

SupplementPage.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  onAddSupplementItems: PropTypes.func.isRequired,
  onDeleteSupplementItem: PropTypes.func.isRequired,
  onEditSupplementItem: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  mySupplementItems: state.nutrition?.supplementItems,
});

const mapDispatchToProps = dispatch => ({
  onAddSupplementItems: (id, data) => dispatch(addSupplementItems(id, data)),
  onEditSupplementItem: data => dispatch(editSupplementItem(data)),
  onDeleteSupplementItem: data => dispatch(deleteSupplementItem(data)),
});

export const SupplementWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SupplementPage);
