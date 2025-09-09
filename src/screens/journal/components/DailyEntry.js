/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Text, View, ScrollView, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import {
  AddButton,
  Button,
  ColorPickerContent,
  CreateTraitModal,
  CustomHeader,
  CustomModal,
  CustomOptions,
  CustomTextArea,
  SelectModalContent,
  PermissionModal,
  TextButton,
  SafeAreaWrapper,
} from '../../../components';
import { colors, strings } from '../../../resources';
import styles from './style';

export default function DailyEntry(props) {
  const navigation = useNavigation();
  const {
    loader,
    traitOptions,
    isVisible,
    setIsVisible,
    createItemModal,
    setCreateItemModal,
    colorPickerModal,
    setColorPickerModal,
    color,
    setColor,
    addToFavorite,
    setAddToFavorite,
    isRemove,
    setIsRemove,
    permissionModal,
    setPermissionModal,
    entryName,
    setEntryName,
    feelingRate,
    setFeelingRate,
    task,
    setTask,
    thought,
    setThought,
    onSaveHandler,
    setNewTrait,
    newTrait,
    disabled,
    setDisabled,
    onTraitSelect,
    onAddTrait,
    onRemoveTrait,
    selectedTraits,
    selectedOption,
    setSelectedOption,
    alertHeading,
    alertText,
    onDonePermissionModal,
    setCheck,
  } = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />

        <View style={styles.headingView}>
          <Text style={styles.headingText2}>Daily Entry</Text>
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Entry Name</Text>
          <TextInput
            value={entryName}
            editable={false}
            placeholder="<Date> Daily Entry"
            placeholderTextColor={colors.grey}
            onChangeText={text => setEntryName(text)}
            style={[styles.textInputStyle, { color: colors.grey }]}
          />
        </View>

        <CustomTextArea
          checked={feelingRate}
          setChecked={val => setFeelingRate(val)}
          title={strings.dailyEntry.content1}
        />

        <CustomTextArea
          isTextArea
          value={task}
          title={strings.dailyEntry.content2}
          placeholder="Task"
          onChangeText={text => setTask(text)}
        />

        <View style={styles.setMargin}>
          <Text style={styles.contentStyle}>
            {strings.dailyEntry.content3.toUpperCase()}
          </Text>
          <CustomOptions
            data={selectedTraits || []}
            onOptionSelect={item => {
              setCheck('removeTrait');
              setSelectedOption(item);
              setPermissionModal(true);
            }}
          />
          <AddButton onPress={() => setIsVisible(true)} />
        </View>

        <CustomTextArea
          isTextArea
          value={thought}
          title={strings.dailyEntry.content4}
          placeholder="Thought"
          onChangeText={text => setThought(text)}
        />

        <View style={styles.btnView}>
          <Button loader={loader} title="Save" onPress={onSaveHandler} />
        </View>

        <View style={styles.bottomTextView}>
          <TextButton
            title="Clear Entry"
            onPress={() => {
              setPermissionModal(true);
              setCheck('clearEntry');
            }}
          />
        </View>
      </ScrollView>

      <CustomModal
        isVisible={isVisible}
        onDismiss={() => setIsVisible(false)}
        content={
          <SelectModalContent
            isRemove={isRemove}
            setRemove={() => setIsRemove(!isRemove)}
            onRemove={onRemoveTrait}
            heading="Add Trait"
            subHeading="Select Favorite"
            options={traitOptions.filter(i => i.isFavorite)}
            selectedOption={selectedOption}
            onOptionSelect={option => {
              setSelectedOption(option);
              setDisabled(false);
            }}
            hideModal={() => setIsVisible(false)}
            btnTitle="Select"
            disabled={disabled}
            onBtnPress={() => onTraitSelect()}
            addButton
            onAddTrait={() => setCreateItemModal(true)}
          />
        }
      />

      <CustomModal
        isVisible={createItemModal}
        onDismiss={() => setCreateItemModal(false)}
        content={
          <CreateTraitModal
            color={color}
            heading="Create Trait"
            favorite={addToFavorite}
            value={newTrait}
            onChangeText={text => setNewTrait(text)}
            openDirectory={() => navigation.navigate('TraitDirectory')}
            setFavorite={() => setAddToFavorite(!addToFavorite)}
            openColorPicker={() => setColorPickerModal(true)}
            hideModal={() => setCreateItemModal(false)}
            btnTitle="Create"
            onBtnPress={onAddTrait}
          />
        }
      />

      <CustomModal
        isVisible={colorPickerModal}
        onDismiss={() => setColorPickerModal(false)}
        content={
          <ColorPickerContent
            color={color}
            onChangeColor={setColor}
            hideModal={() => setColorPickerModal(false)}
            btnTitle="Save"
            onBtnPress={() => setColorPickerModal(false)}
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
            onDone={onDonePermissionModal}
            onCancel={() => {
              setPermissionModal(false);
              setCheck('');
            }}
          />
        }
      />
    </SafeAreaWrapper>
  );
}

DailyEntry.propTypes = {
  loader: PropTypes.bool.isRequired,
  traitOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  isVisible: PropTypes.bool.isRequired,
  setIsVisible: PropTypes.func.isRequired,
  createItemModal: PropTypes.bool.isRequired,
  setCreateItemModal: PropTypes.func.isRequired,
  colorPickerModal: PropTypes.bool.isRequired,
  setColorPickerModal: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  setColor: PropTypes.func.isRequired,
  addToFavorite: PropTypes.bool.isRequired,
  setAddToFavorite: PropTypes.func.isRequired,
  isRemove: PropTypes.bool.isRequired,
  setIsRemove: PropTypes.func.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  entryName: PropTypes.string.isRequired,
  setEntryName: PropTypes.func.isRequired,
  feelingRate: PropTypes.number.isRequired,
  setFeelingRate: PropTypes.func.isRequired,
  task: PropTypes.string.isRequired,
  setTask: PropTypes.func.isRequired,
  thought: PropTypes.string.isRequired,
  setThought: PropTypes.func.isRequired,
  onSaveHandler: PropTypes.func.isRequired,
  newTrait: PropTypes.string.isRequired,
  setNewTrait: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  setDisabled: PropTypes.func.isRequired,
  onTraitSelect: PropTypes.func.isRequired,
  onAddTrait: PropTypes.func.isRequired,
  onRemoveTrait: PropTypes.func.isRequired,
  selectedTraits: PropTypes.arrayOf(PropTypes.any).isRequired,
  selectedOption: PropTypes.objectOf(PropTypes.any).isRequired,
  setSelectedOption: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  setCheck: PropTypes.func.isRequired,
};
