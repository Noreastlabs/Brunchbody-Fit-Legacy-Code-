/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {
  CustomHeader,
  CustomModal,
  SelectModalContent,
  CreateItemContent,
  PermissionModal,
  CustomTable,
  SafeAreaWrapper,
} from '../../../components';
import styles from './style';

export default function Meal(props) {
  const {
    route,
    isVisible,
    setIsVisible,
    selectOptions,
    selectedOption,
    setSelectedOption,
    onChooseOption,
    createItemModal,
    setCreateItemModal,
    createItemFields,
    permissionModal,
    setPermissionModal,
    showDeleteBtn,
    heading,
    btnTitle,
    onEditItem,
    onCreateItem,
    alertHeading,
    alertText,
    onDonePermissionModal,
    onChangeText,
    myMealItems,
    setCheck,
    deleteLoader,
  } = props;
  const {meal} = route.params;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />

        <View style={styles.headingView}>
          <Text style={styles.subHeading2}>{meal.name}</Text>
        </View>

        <View style={styles.setMargin}>
          <CustomTable
            isEditable
            data={myMealItems}
            showEditModal={onEditItem}
            onAddBtnPress={() => setIsVisible(true)}
          />
        </View>
      </ScrollView>

      <CustomModal
        isVisible={isVisible}
        onDismiss={() => setIsVisible(false)}
        content={
          <SelectModalContent
            select
            heading="Add Meal Item"
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

      <CustomModal
        isVisible={createItemModal}
        onDismiss={() => setCreateItemModal(false)}
        content={
          <CreateItemContent
            {...props}
            heading={heading}
            createItemFields={createItemFields}
            onChangeText={onChangeText}
            hideModal={() => setCreateItemModal(false)}
            btnTitle={btnTitle}
            onBtnPress={onCreateItem}
            isDeleteBtn={showDeleteBtn}
            onDeleteBtnPress={() => {
              setPermissionModal(true);
              setCheck('delete');
            }}
          />
        }
      />

      <CustomModal
        isVisible={permissionModal}
        onDismiss={() => setPermissionModal(false)}
        content={
          <PermissionModal
            loader={deleteLoader}
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={onDonePermissionModal}
            onCancel={() => setPermissionModal(false)}
          />
        }
      />
    </SafeAreaWrapper>
  );
}

Meal.defaultProps = {
  route: {},
};

Meal.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  selectOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  isVisible: PropTypes.bool.isRequired,
  setIsVisible: PropTypes.func.isRequired,
  selectedOption: PropTypes.string.isRequired,
  setSelectedOption: PropTypes.func.isRequired,
  onChooseOption: PropTypes.func.isRequired,
  createItemModal: PropTypes.bool.isRequired,
  setCreateItemModal: PropTypes.func.isRequired,
  createItemFields: PropTypes.arrayOf(PropTypes.any).isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  showDeleteBtn: PropTypes.bool.isRequired,
  heading: PropTypes.string.isRequired,
  btnTitle: PropTypes.string.isRequired,
  onEditItem: PropTypes.func.isRequired,
  onCreateItem: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  myMealItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  setCheck: PropTypes.func.isRequired,
  deleteLoader: PropTypes.bool.isRequired,
};
