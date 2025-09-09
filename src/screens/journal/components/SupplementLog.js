/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AddButton,
  Button,
  CreateItemContent,
  CustomHeader,
  CustomModal,
  CustomOptions,
  CustomTable,
  Dashed,
  NutritionItems,
  PermissionModal,
  SelectModalContent,
  TextButton,
  WheelPickerContent,
} from '../../../components';
import { colors } from '../../../resources';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SupplementLog(props) {
  const {
    loader,
    btnLoader,
    modalLoader,
    supplements,
    totalItems,
    isVisible,
    setIsVisible,
    selectOptions,
    selectedOption,
    setSelectedOption,
    selectSupplementModal,
    setSelectSupplementModal,
    onChooseOption,
    createItemFields,
    createItemModal,
    setCreateItemModal,
    wheelPickerModal,
    setWheelPickerModal,
    pickerItems,
    permissionModal,
    setPermissionModal,
    entryName,
    setEntryName,
    note,
    setNote,
    onSaveHandler,
    supplementDetailModal,
    setSupplementDetailModal,
    selectedSupplement,
    setSelectedSupplement,
    disabled,
    setDisabled,
    onSupplementSelect,
    selectedSupplements,
    deleteCheck,
    setDeleteCheck,
    onRemoveSupplement,
    alertHeading,
    alertText,
    onDonePermissionModal,
    onChangeText,
    supplementUnit,
    setSupplementUnit,
    onCreateSingleSupplement,
    setCheck,
    onPressSelectedSupplement,
    mySupplementItems,
  } = props;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />

        <View style={styles.headingView}>
          <Text style={styles.headingText2}>Supplement Log</Text>
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Entry Name</Text>
          <TextInput
            value={entryName}
            editable={false}
            placeholder="<Date> Supplement Log"
            placeholderTextColor={colors.grey}
            onChangeText={text => setEntryName(text)}
            style={[styles.textInputStyle, { color: colors.grey }]}
          />
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Today&apos;s Supplements</Text>
          <CustomOptions
            data={selectedSupplements}
            onOptionSelect={item => onPressSelectedSupplement(item)}
          />
          <AddButton onPress={() => setIsVisible(true)} />
        </View>

        <View style={styles.setMargin1}>
          <Dashed />
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Total</Text>
          <CustomTable isTwoColumn data={totalItems} />
        </View>

        <View style={styles.setMargin1}>
          <Dashed />
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Note</Text>
          <TextInput
            multiline
            value={note}
            placeholder="Notes"
            style={styles.textArea}
            placeholderTextColor={colors.grey}
            onChangeText={text => setNote(text)}
          />
        </View>

        <View style={styles.btnView}>
          <Button loader={loader} title="Save" onPress={onSaveHandler} />
        </View>

        <TouchableOpacity activeOpacity={0.5} style={styles.bottomTextView}>
          <TextButton
            title="Clear Entry"
            onPress={() => {
              setPermissionModal(true);
              setCheck('clearEntry');
            }}
          />
        </TouchableOpacity>
      </ScrollView>

      <CustomModal
        isVisible={isVisible}
        onDismiss={() => setIsVisible(false)}
        content={
          <SelectModalContent
            select
            heading="Add Supplements"
            subHeading="Select"
            selectOptions={selectOptions}
            selected={selectedOption}
            onOptionSelect={setSelectedOption}
            hideModal={() => setIsVisible(false)}
            btnTitle="Next"
            onBtnPress={onChooseOption}
          />
        }
      />

      {/* Supplement selection from supplements list */}
      <CustomModal
        isVisible={selectSupplementModal}
        onDismiss={() => setSelectSupplementModal(false)}
        content={
          <SelectModalContent
            btnLoader={btnLoader}
            heading="Select Stack"
            options={supplements}
            selectedOption={selectedSupplement}
            onOptionSelect={option => {
              setSelectedSupplement(option);
              setDisabled(false);
            }}
            hideModal={() => setSelectSupplementModal(false)}
            btnTitle="Select"
            disabled={disabled}
            onBtnPress={() => onSupplementSelect(false)}
          />
        }
      />

      <CustomModal
        isVisible={createItemModal}
        onDismiss={() => setCreateItemModal(false)}
        content={
          <CreateItemContent
            heading="Add Supplement"
            selectedPickerItem={supplementUnit}
            createItemFields={createItemFields}
            onChangeText={onChangeText}
            hideModal={() => setCreateItemModal(false)}
            btnTitle="Create"
            onBtnPress={onCreateSingleSupplement}
            onDropdownSelect={() => setWheelPickerModal(true)}
          />
        }
      />

      <CustomModal
        isVisible={supplementDetailModal}
        onDismiss={() => setSupplementDetailModal(false)}
        content={
          <NutritionItems
            isTwoColumn
            loader={modalLoader}
            text={selectedSupplement.name}
            modalItems={
              selectedSupplement?.items?.length > 0
                ? selectedSupplement?.items
                : [selectedSupplement]
            }
            onClose={() => setSupplementDetailModal(false)}
            showButton={false}
            onDeleteBtnPress={() => {
              setPermissionModal(true);
              setDeleteCheck('removeSupplement');
            }}
          />
        }
      />

      <CustomModal
        isVisible={wheelPickerModal}
        onDismiss={() => setWheelPickerModal(false)}
        content={
          <WheelPickerContent
            pickerItems={pickerItems}
            onValueChange={index =>
              setSupplementUnit(pickerItems[index - 1].value)
            }
            onConfirm={() => setWheelPickerModal(false)}
            onCancel={() => setWheelPickerModal(false)}
          />
        }
      />

      <CustomModal
        isVisible={permissionModal}
        onDismiss={() => {
          setPermissionModal(false);
          setCheck('');
        }}
        content={
          <PermissionModal
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={
              deleteCheck === 'removeSupplement'
                ? onRemoveSupplement
                : onDonePermissionModal
            }
            onCancel={() => {
              setPermissionModal(false);
              setCheck('');
            }}
          />
        }
      />
    </SafeAreaView>
  );
}

SupplementLog.propTypes = {
  loader: PropTypes.bool.isRequired,
  btnLoader: PropTypes.bool.isRequired,
  modalLoader: PropTypes.bool.isRequired,
  supplements: PropTypes.arrayOf(PropTypes.any).isRequired,
  totalItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  isVisible: PropTypes.bool.isRequired,
  setIsVisible: PropTypes.func.isRequired,
  selectedOption: PropTypes.string.isRequired,
  setSelectedOption: PropTypes.func.isRequired,
  selectSupplementModal: PropTypes.bool.isRequired,
  setSelectSupplementModal: PropTypes.func.isRequired,
  onChooseOption: PropTypes.func.isRequired,
  createItemModal: PropTypes.bool.isRequired,
  setCreateItemModal: PropTypes.func.isRequired,
  createItemFields: PropTypes.arrayOf(PropTypes.any).isRequired,
  wheelPickerModal: PropTypes.bool.isRequired,
  setWheelPickerModal: PropTypes.func.isRequired,
  pickerItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  entryName: PropTypes.string.isRequired,
  setEntryName: PropTypes.func.isRequired,
  note: PropTypes.string.isRequired,
  setNote: PropTypes.func.isRequired,
  onSaveHandler: PropTypes.func.isRequired,
  supplementDetailModal: PropTypes.bool.isRequired,
  setSupplementDetailModal: PropTypes.func.isRequired,
  selectedSupplement: PropTypes.string.isRequired,
  setSelectedSupplement: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  setDisabled: PropTypes.func.isRequired,
  onSupplementSelect: PropTypes.func.isRequired,
  selectedSupplements: PropTypes.arrayOf(PropTypes.any).isRequired,
  deleteCheck: PropTypes.string.isRequired,
  setDeleteCheck: PropTypes.func.isRequired,
  onRemoveSupplement: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  supplementUnit: PropTypes.string.isRequired,
  setSupplementUnit: PropTypes.func.isRequired,
  onCreateSingleSupplement: PropTypes.func.isRequired,
  setCheck: PropTypes.func.isRequired,
  onPressSelectedSupplement: PropTypes.func.isRequired,
  mySupplementItems: PropTypes.arrayOf(PropTypes.any).isRequired,
};
