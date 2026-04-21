import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import {
  AddButton,
  CreateItemContent,
  CustomHeader,
  CustomModal,
  CustomTable,
  PermissionModal,
  SafeAreaWrapper,
  WheelPickerContent,
} from '../../../components';
import styles from './style';

export default function Supplement(props) {
  const {
    route,
    createItemFields,
    createItemModal,
    closeCreateItemModal,
    createItemFormErrorText,
    wheelPickerModal,
    setWheelPickerModal,
    pickerItems,
    permissionModal,
    closePermissionModal,
    showDeleteBtn,
    heading,
    btnTitle,
    onOpenModal,
    onCreateItem,
    alertHeading,
    alertText,
    onDonePermissionModal,
    onChangeText,
    setItemUnit,
    itemUnit,
    mySupplementItems,
    onEditItem,
    onRequestDelete,
    deleteLoader,
  } = props;
  const { supplement } = route.params;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />

        <View style={styles.headingView}>
          <Text style={styles.subHeading2}>{supplement.name}</Text>
        </View>

        <View style={styles.setMargin}>
          <CustomTable
            isEditable
            isTwoColumn
            data={mySupplementItems}
            showEditModal={onEditItem}
          />

          <View style={styles.setMargin2}>
            <AddButton onPress={onOpenModal} />
          </View>
        </View>
      </ScrollView>

      <CustomModal
        isVisible={createItemModal}
        onDismiss={closeCreateItemModal}
        content={
          <CreateItemContent
            {...props}
            heading={heading}
            createItemFields={createItemFields}
            formErrorText={createItemFormErrorText}
            onChangeText={onChangeText}
            selectedPickerItem={itemUnit}
            hideModal={closeCreateItemModal}
            btnTitle={btnTitle}
            onBtnPress={onCreateItem}
            onDropdownSelect={() => setWheelPickerModal(true)}
            isDeleteBtn={showDeleteBtn}
            onDeleteBtnPress={onRequestDelete}
          />
        }
      />

      <CustomModal
        isVisible={wheelPickerModal}
        onDismiss={() => setWheelPickerModal(false)}
        content={
          <WheelPickerContent
            pickerItems={pickerItems}
            onValueChange={index => setItemUnit(pickerItems[index - 1].value)}
            onConfirm={() => setWheelPickerModal(false)}
            onCancel={() => setWheelPickerModal(false)}
          />
        }
      />

      <CustomModal
        isVisible={permissionModal}
        onDismiss={closePermissionModal}
        content={
          <PermissionModal
            loader={deleteLoader}
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={onDonePermissionModal}
            onCancel={closePermissionModal}
          />
        }
      />
    </SafeAreaWrapper>
  );
}

Supplement.defaultProps = {
  route: {},
};

Supplement.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  createItemModal: PropTypes.bool.isRequired,
  closeCreateItemModal: PropTypes.func.isRequired,
  createItemFields: PropTypes.arrayOf(PropTypes.any).isRequired,
  createItemFormErrorText: PropTypes.string.isRequired,
  wheelPickerModal: PropTypes.bool.isRequired,
  setWheelPickerModal: PropTypes.func.isRequired,
  pickerItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  permissionModal: PropTypes.bool.isRequired,
  closePermissionModal: PropTypes.func.isRequired,
  showDeleteBtn: PropTypes.bool.isRequired,
  heading: PropTypes.string.isRequired,
  btnTitle: PropTypes.string.isRequired,
  onOpenModal: PropTypes.func.isRequired,
  onCreateItem: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  setItemUnit: PropTypes.func.isRequired,
  itemUnit: PropTypes.string.isRequired,
  mySupplementItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  onEditItem: PropTypes.func.isRequired,
  onRequestDelete: PropTypes.func.isRequired,
  deleteLoader: PropTypes.bool.isRequired,
};
