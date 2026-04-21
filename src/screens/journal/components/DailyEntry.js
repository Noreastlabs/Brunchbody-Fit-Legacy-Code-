import React from 'react';
import { Text, View, ScrollView, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import {
  AddButton,
  Button,
  ColorPickerContent,
  CustomHeader,
  CustomModal,
  CustomOptions,
  CustomTextArea,
  SelectModalContent,
  PermissionModal,
  TextButton,
  SafeAreaWrapper,
} from '../../../components';
import {CreateTraitModal} from './modals';
import { JOURNAL_ROUTES } from '../../../navigation/routeNames';
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
    colorPickerModal,
    color,
    addToFavorite,
    isRemove,
    permissionModal,
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
    onTraitSelect,
    onAddTrait,
    onRemoveTrait,
    selectedTraits,
    selectedOption,
    alertHeading,
    alertText,
    onDonePermissionModal,
    onClosePermissionModal,
    onOpenCreateTraitModal,
    onCloseCreateTraitModal,
    onPromptClearEntry,
    onPromptRemoveTrait,
    onCloseTraitSelectModal,
    onToggleFavorite,
    onTraitOptionSelect,
    onSelectModalToggleRemove,
    onOpenColorPicker,
    onCloseColorPicker,
    onChangeColor,
    traitErrorText,
    createTraitErrorText,
    saveErrorText,
    selectTraitPending,
    addTraitPending,
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
            onOptionSelect={onPromptRemoveTrait}
          />
          <AddButton onPress={() => setIsVisible(true)} />
          {traitErrorText ? (
            <Text style={[styles.supportingText, styles.supportingTextError]}>
              {traitErrorText}
            </Text>
          ) : null}
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
          {saveErrorText ? (
            <Text style={[styles.supportingText, styles.supportingTextError]}>
              {saveErrorText}
            </Text>
          ) : null}
        </View>

        <View style={styles.bottomTextView}>
          <TextButton title="Clear Entry" onPress={onPromptClearEntry} />
        </View>
      </ScrollView>

      <CustomModal
        isVisible={isVisible}
        onDismiss={onCloseTraitSelectModal}
        content={
          <SelectModalContent
            isRemove={isRemove}
            setRemove={onSelectModalToggleRemove}
            onRemove={onRemoveTrait}
            heading="Add Trait"
            subHeading="Select Favorite"
            options={traitOptions.filter(i => i.isFavorite)}
            selectedOption={selectedOption}
            onOptionSelect={onTraitOptionSelect}
            hideModal={onCloseTraitSelectModal}
            btnTitle="Select"
            disabled={disabled}
            btnLoader={selectTraitPending}
            formErrorText={traitErrorText}
            onBtnPress={onTraitSelect}
            addButton
            onAddTrait={onOpenCreateTraitModal}
          />
        }
      />

      <CustomModal
        isVisible={createItemModal}
        onDismiss={onCloseCreateTraitModal}
        content={
          <CreateTraitModal
            color={color}
            heading="Create Trait"
            favorite={addToFavorite}
            value={newTrait}
            onChangeText={text => setNewTrait(text)}
            errorText={createTraitErrorText}
            submitDisabled={!newTrait.trim()}
            loader={addTraitPending}
            openDirectory={() =>
              navigation.navigate(JOURNAL_ROUTES.TRAIT_DIRECTORY)
            }
            setFavorite={onToggleFavorite}
            openColorPicker={onOpenColorPicker}
            hideModal={onCloseCreateTraitModal}
            btnTitle="Create"
            onBtnPress={onAddTrait}
          />
        }
      />

      <CustomModal
        isVisible={colorPickerModal}
        onDismiss={onCloseColorPicker}
        content={
          <ColorPickerContent
            color={color}
            onChangeColor={onChangeColor}
            hideModal={onCloseColorPicker}
            btnTitle="Save"
            onBtnPress={onCloseColorPicker}
          />
        }
      />

      <CustomModal
        isVisible={permissionModal}
        onDismiss={onClosePermissionModal}
        content={
          <PermissionModal
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={onDonePermissionModal}
            onCancel={onClosePermissionModal}
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
  colorPickerModal: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  addToFavorite: PropTypes.bool.isRequired,
  isRemove: PropTypes.bool.isRequired,
  permissionModal: PropTypes.bool.isRequired,
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
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  onClosePermissionModal: PropTypes.func.isRequired,
  onOpenCreateTraitModal: PropTypes.func.isRequired,
  onCloseCreateTraitModal: PropTypes.func.isRequired,
  onPromptClearEntry: PropTypes.func.isRequired,
  onPromptRemoveTrait: PropTypes.func.isRequired,
  onCloseTraitSelectModal: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onTraitOptionSelect: PropTypes.func.isRequired,
  onSelectModalToggleRemove: PropTypes.func.isRequired,
  onOpenColorPicker: PropTypes.func.isRequired,
  onCloseColorPicker: PropTypes.func.isRequired,
  onChangeColor: PropTypes.func.isRequired,
  traitErrorText: PropTypes.string.isRequired,
  createTraitErrorText: PropTypes.string.isRequired,
  saveErrorText: PropTypes.string.isRequired,
  selectTraitPending: PropTypes.bool.isRequired,
  addTraitPending: PropTypes.bool.isRequired,
};
