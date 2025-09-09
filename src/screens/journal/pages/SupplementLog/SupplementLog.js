/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { colors, wheelPickerItems } from '../../../../resources';
import { SupplementLog } from '../../components';
import {
  addJournalEntry,
  editJournalEntry,
  getJournalEntries,
  getSupplementItems,
} from '../../../../redux/actions';

const selectOptions = [
  { id: 1, option: 'FROM STACKS' },
  { id: 2, option: 'SINGLE ITEM' },
];

const createItemFields = [
  {
    id: 1,
    value: '',
    fieldName: 'Item Name',
    placeholder: 'Enter Name',
    state: 'supplementName',
  },
  {
    id: 2,
    value: '',
    fieldName: 'Amount',
    placeholder: 'Amount',
    keyboardType: 'decimal-pad',
    state: 'supplementAmount',
  },
  {
    id: 3,
    value: '',
    fieldName: 'Select Unit',
    picker: true,
    pickerLabel: 'Unit',
    state: 'supplementUnit',
  },
];

export default function SupplementLogPage(props) {
  const {
    route,
    navigation,
    onCreateEntry,
    mySupplements,
    getAllJournalEntries,
    mySupplementItems,
    onGetSupplementItems,
    onEditEntry,
  } = props;
  const { entryData, entryId } = route.params;
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [modalLoader, setModalLoader] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectSupplementModal, setSelectSupplementModal] = useState(false);
  const [createItemModal, setCreateItemModal] = useState(false);
  const [wheelPickerModal, setWheelPickerModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState('FROM STACKS');
  const [permissionModal, setPermissionModal] = useState(false);
  const [supplementDetailModal, setSupplementDetailModal] = useState(false);
  const [selectedSupplement, setSelectedSupplement] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [entryName, setEntryName] = useState(
    moment(entryData.date, 'YYYY/MM/DD').format('M/DD/YYYY'),
  );
  const [note, setNote] = useState(entryData.note || '');
  const [deleteCheck, setDeleteCheck] = useState('');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [supplementName, setSupplementName] = useState('');
  const [supplementAmount, setSupplementAmount] = useState('');
  const [supplementUnit, setSupplementUnit] = useState('');
  const [selectedSupplements, setSelectedSupplements] = useState(
    entryData.supplements || [],
  );
  const [check, setCheck] = useState('');
  const [totalItems, setTotalItems] = useState(entryData.totalItems || []);

  const onChangeText = (text, itemState) => {
    if (itemState === 'supplementName') {
      setSupplementName(text);
      createItemFields[0].value = text;
    }
    if (itemState === 'supplementAmount') {
      setSupplementAmount(text);
      createItemFields[1].value = text;
    }
  };

  const showMessage = (heading, text) => {
    setAlertHeading(heading);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onDonePermissionModal = () => {
    setPermissionModal(false);
    if (check === 'clearEntry') {
      setNote('');
      setCheck('');
      setTotalItems([]);
      setSelectedSupplements([]);
    } else {
      if (alertHeading === 'Success!') {
        navigation.goBack();
      }
      setTimeout(() => {
        setAlertText('');
        setAlertHeading('');
      }, 500);
    }
  };

  const onChooseOption = () => {
    setIsVisible(false);
    if (selectedOption === 'FROM STACKS') {
      setSelectSupplementModal(true);
    } else {
      setCreateItemModal(true);
    }
  };

  const onSupplementSelect = async () => {
    setBtnLoader(true);
    if (selectedSupplements.length < 4) {
      // const response = await onGetSupplementItems(selectedSupplement.id);
      const response = selectedSupplement.items;

      if (response.length > 0) {
        response.map(i =>
          totalItems.push({ ...i, stackId: selectedSupplement.id }),
        );
        selectedSupplements.push(selectedSupplement);
      } else {
        showMessage(
          'Error!',
          `No items found in this supplement. Please select another supplement or add some items in this supplement.`,
        );
      }
    } else showMessage('Error!', `You can't add supplements more than 4.`);

    setSelectSupplementModal(false);
    setSelectedSupplement({});
    setDisabled(true);
    setBtnLoader(false);
  };

  const onRemoveSupplement = () => {
    setSelectedSupplements(
      selectedSupplements.filter(
        i =>
          (i.stackId || i.id) !==
          (selectedSupplement.stackId || selectedSupplement.id),
      ),
    );

    setTotalItems(
      totalItems.filter(
        i =>
          i.stackId !== (selectedSupplement.stackId || selectedSupplement.id),
      ),
    );

    setDeleteCheck('');
    setPermissionModal(false);
    setSupplementDetailModal(false);
    setSelectedSupplement({});
  };

  const onPressSelectedSupplement = async item => {
    setModalLoader(true);
    setSelectedSupplement(item);
    setSupplementDetailModal(true);

    // await onGetSupplementItems(item.id);

    setModalLoader(false);
  };

  const onCreateSingleSupplement = () => {
    if (
      supplementName.trim() &&
      supplementAmount.trim() &&
      supplementUnit.trim()
    ) {
      const supplementObj = {
        stackId: selectedSupplements.length + 1,
        name: supplementName,
        qty: supplementAmount,
        unt: supplementUnit,
        bgColor: colors.darkBlue2,
      };

      if (selectedSupplements.length < 4) {
        selectedSupplements.push(supplementObj);
        totalItems.push(supplementObj);
      } else showMessage('Error!', `You can't add supplements more than 4.`);
      setCreateItemModal(false);
      setSupplementName('');
      setSupplementAmount('');
      setSupplementUnit('');
      createItemFields[0].value = '';
      createItemFields[1].value = '';
    } else {
      showMessage('Error!', 'All fields are required.');
    }
  };

  const onSaveHandler = async () => {
    setLoader(true);
    let response = null;
    // Replace slashes with dashes for consistent date parsing (matching Daily Entry)
    const d = new Date(entryData.date.replace(/\//g, '-'));
    d.setHours(0, 0, 0, 0);

    if (d.getTime() > new Date().getTime()) {
      showMessage('Error!', 'You cannot enter data on future dates.');
      setLoader(false);
      return;
    } else if (selectedSupplements.length < 1) {
      showMessage('Error!', 'Please add atleast one supplement.');
      setLoader(false);
      return;
    }

    try {
      if (entryId) {
        response = await onEditEntry(entryId, {
          SupplementLog: {
            supplements: selectedSupplements,
            totalItems,
            note,
            isDeleted: false,
          },
        });
      } else {
        response = await onCreateEntry(d.getTime(), {
          SupplementLog: {
            supplements: selectedSupplements,
            totalItems,
            note,
            isDeleted: false,
          },
        });
      }

      if (response === true) {
        setLoader(false);
        showMessage('Success!', `Entry updated successfully.`);
        await getAllJournalEntries(d.getTime());
      } else {
        setLoader(false);
        showMessage('Error!', response || 'Failed to save entry.');
      }
    } catch (error) {
      console.error('Save error:', error);
      setLoader(false);
      showMessage('Error!', 'An unexpected error occurred while saving.');
    }
  };

  return (
    <SupplementLog
      loader={loader}
      btnLoader={btnLoader}
      modalLoader={modalLoader}
      supplements={mySupplements}
      totalItems={totalItems}
      mySupplementItems={mySupplementItems}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      selectOptions={selectOptions}
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
      selectSupplementModal={selectSupplementModal}
      setSelectSupplementModal={setSelectSupplementModal}
      onChooseOption={onChooseOption}
      createItemModal={createItemModal}
      setCreateItemModal={setCreateItemModal}
      createItemFields={createItemFields}
      wheelPickerModal={wheelPickerModal}
      setWheelPickerModal={setWheelPickerModal}
      pickerItems={wheelPickerItems.units}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      entryName={entryName}
      setEntryName={setEntryName}
      note={note}
      setNote={setNote}
      onSaveHandler={onSaveHandler}
      supplementDetailModal={supplementDetailModal}
      setSupplementDetailModal={setSupplementDetailModal}
      selectedSupplement={selectedSupplement}
      setSelectedSupplement={setSelectedSupplement}
      disabled={disabled}
      setDisabled={setDisabled}
      onSupplementSelect={onSupplementSelect}
      selectedSupplements={selectedSupplements}
      onRemoveSupplement={onRemoveSupplement}
      deleteCheck={deleteCheck}
      setDeleteCheck={setDeleteCheck}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
      onChangeText={onChangeText}
      supplementUnit={supplementUnit}
      setSupplementUnit={setSupplementUnit}
      onCreateSingleSupplement={onCreateSingleSupplement}
      setCheck={setCheck}
      onPressSelectedSupplement={onPressSelectedSupplement}
    />
  );
}

SupplementLogPage.defaultProps = {
  route: {},
};

SupplementLogPage.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  onCreateEntry: PropTypes.func.isRequired,
  mySupplements: PropTypes.arrayOf(PropTypes.any).isRequired,
  mySupplementItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  getAllJournalEntries: PropTypes.func.isRequired,
  onGetSupplementItems: PropTypes.func.isRequired,
  onEditEntry: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  mySupplements: state.nutrition?.supplements,
  mySupplementItems: state.nutrition?.supplementItems,
});

const mapDispatchToProps = dispatch => ({
  onCreateEntry: (date, data) => dispatch(addJournalEntry(date, data)),
  onEditEntry: (id, data) => dispatch(editJournalEntry(id, data)),
  getAllJournalEntries: date => dispatch(getJournalEntries(date)),
  onGetSupplementItems: id => dispatch(getSupplementItems(id)),
});

export const SupplementLogWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SupplementLogPage);
