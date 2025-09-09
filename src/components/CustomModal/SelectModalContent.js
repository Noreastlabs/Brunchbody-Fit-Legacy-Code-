/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { RadioButton } from 'react-native-paper';
import CloseButton from '../CloseButton';
import CustomOptions from '../CustomOptions';
import AddButton from '../AddButton';
import Button from '../Button';
import { colors } from '../../resources';
import styles from './style';

export default function SelectModalContent(props) {
  const {
    hideModal,
    btnTitle,
    heading,
    onBtnPress,
    selectOptions,
    options,
    selected,
    onOptionSelect,
    select,
    subHeading,
    addButton,
    onAddTrait,
    isRemove,
    setRemove,
    disabled,
    loader,
    btnLoader,
    returnItem,
  } = props;

  return (
    <View style={styles.contentContainer}>
      {loader && (
        <View style={styles.loaderView}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      )}

      <View style={styles.modalHead}>
        <Text style={styles.textStyle1}>{heading}</Text>
        <CloseButton onPress={hideModal} />
      </View>

      {subHeading !== '' ? (
        <View style={styles.flexRowView}>
          <Text style={styles.subHeading}>{subHeading}</Text>
          {select ? null : !isRemove ? (
            <TouchableOpacity activeOpacity={0.5} onPress={setRemove}>
              <Text style={styles.cancelText}>Remove</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity activeOpacity={0.5} onPress={setRemove}>
              <Text style={styles.cancelText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}

      {select ? (
        <View style={styles.setMargin1}>
          {selectOptions.map(item => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.5}
              style={styles.selectOptionsView}
              onPress={() =>
                onOptionSelect(
                  returnItem ? item : item.option || item.title || item.name,
                )
              }
            >
              <RadioButton.Android
                value="Theme"
                status={
                  selected === (item.option || item.title || item.name)
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() =>
                  onOptionSelect(
                    returnItem ? item : item.option || item.title || item.name,
                  )
                }
                uncheckedColor={colors.nonEditableOverlays}
              />
              <Text style={styles.optionText}>
                {item.option || item.title || item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <>
          <CustomOptions {...props} data={options} isRemove={isRemove} />
          {addButton ? <AddButton onPress={onAddTrait} /> : null}
        </>
      )}

      <View style={styles.btnView2}>
        <Button
          loader={btnLoader}
          title={btnTitle}
          onPress={onBtnPress}
          disabled={disabled}
        />
      </View>
    </View>
  );
}

SelectModalContent.defaultProps = {
  selectOptions: [],
  options: [],
  selected: '',
  onOptionSelect: () => {},
  select: false,
  subHeading: '',
  addButton: false,
  onAddTrait: () => {},
  isRemove: false,
  setRemove: () => {},
  disabled: false,
  loader: false,
  btnLoader: false,
  returnItem: false,
};

SelectModalContent.propTypes = {
  heading: PropTypes.string.isRequired,
  btnTitle: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
  onBtnPress: PropTypes.func.isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.any),
  options: PropTypes.arrayOf(PropTypes.any),
  selected: PropTypes.string,
  onOptionSelect: PropTypes.func,
  select: PropTypes.bool,
  subHeading: PropTypes.string,
  addButton: PropTypes.bool,
  onAddTrait: PropTypes.func,
  isRemove: PropTypes.bool,
  setRemove: PropTypes.func,
  disabled: PropTypes.bool,
  loader: PropTypes.bool,
  btnLoader: PropTypes.bool,
  returnItem: PropTypes.bool,
};
