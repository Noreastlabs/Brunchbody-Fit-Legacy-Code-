/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import { useState } from 'react';
import { connect } from 'react-redux';
import {
  addSupplementItems,
  deleteSupplementItem,
  editSupplementItem,
} from '../../../../redux/actions';
import { wheelPickerItems } from '../../../../resources';
import { Supplement } from '../../components';

const createItemFields = [
  {
    id: 1,
    value: '',
    fieldName: 'Item Name',
    placeholder: 'Enter Name',
    state: 'itemName',
  },
  {
    id: 2,
    value: '',
    fieldName: 'Amount',
    placeholder: 'Amount',
    keyboardType: 'decimal-pad',
    state: 'itemAmount',
  },
  {
    id: 3,
    value: '',
    fieldName: 'Select Unit',
    picker: true,
    pickerLabel: 'Unit',
    state: 'itemUnit',
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
  const [itemName, setItemName] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [itemUnit, setItemUnit] = useState('');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [check, setCheck] = useState('');

  const onChangeText = (text, itemState) => {
    if (itemState === 'itemName') {
      setItemName(text);
      createItemFields[0].value = text;
    }
    if (itemState === 'itemAmount') {
      setItemAmount(text);
      createItemFields[1].value = text;
    }
  };

  const onOpenModal = () => {
    setCreateItemModal(true);
    setHeading('Add Supplement');
    setBtnTitle('Create');
    setShowDeleteBtn(false);
    setItemName('');
    setItemAmount('');
    setItemUnit('');
    createItemFields[0].value = '';
    createItemFields[1].value = '';
    createItemFields[2].value = '';
  };

  const onEditItem = item => {
    setSelectedItem(item);
    setCreateItemModal(true);
    setHeading('Edit Supplement');
    setBtnTitle('Save');
    setShowDeleteBtn(true);
    setItemName(item.name);
    setItemAmount(item.qty);
    setItemUnit(item.unt);
    createItemFields[0].value = item.name;
    createItemFields[1].value = item.qty;
    createItemFields[2].value = item.unt;
  };

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onCreateItem = async () => {
    setLoader(true);

    if (itemName.trim() && itemAmount.trim() && itemUnit.trim()) {
      const data = {
        name: itemName,
        qty: itemAmount,
        unt: itemUnit,
      };
      let response = null;

      if (btnTitle === 'Create') {
        response = await onAddSupplementItems(supplement.id, data);

        if (response === true) {
          setCreateItemModal(false);
          showMessage('Success!', `Item added successfully.`);
        } else {
          showMessage('Error!', response);
        }
      } else {
        response = await onEditSupplementItem({
          data,
          supplement_id: supplement.id,
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

      const response = await onDeleteSupplementItem({
        supplement_id: supplement.id,
        item_id: selectedItem.id,
      });

      if (response === true) {
        setCheck('');
        setCreateItemModal(false);
        setDeleteLoader(false);
        setCreateItemModal(false);
        setPermissionModal(false);
      } else {
        setCheck('');
        setDeleteLoader(false);
        showMessage('Error!', response);
      }
    } else {
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
      setCreateItemModal={setCreateItemModal}
      wheelPickerModal={wheelPickerModal}
      setWheelPickerModal={setWheelPickerModal}
      pickerItems={wheelPickerItems.units}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      showDeleteBtn={showDeleteBtn}
      heading={heading}
      btnTitle={btnTitle}
      onOpenModal={onOpenModal}
      onChangeText={onChangeText}
      alertHeading={alertHeading}
      alertText={alertText}
      setItemUnit={setItemUnit}
      onDonePermissionModal={onDonePermissionModal}
      onCreateItem={onCreateItem}
      itemUnit={itemUnit}
      onEditItem={onEditItem}
      setCheck={setCheck}
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
