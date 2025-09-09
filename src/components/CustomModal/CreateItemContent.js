/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import CloseButton from '../CloseButton';
import SelectComp from '../SelectComp';
import TextButton from '../TextButton';
import Button from '../Button';
import {colors} from '../../resources';
import styles from './style';

export default function CreateItemContent(props) {
  const {
    hideModal,
    btnTitle,
    heading,
    onBtnPress,
    createItemFields,
    onDropdownSelect,
    openColorPicker,
    color,
    isDeleteBtn,
    onDeleteBtnPress,
    value,
    onChangeText,
    selectedPickerItem,
    loader,
  } = props;

  return (
    <View style={styles.contentContainer}>
      <View style={styles.modalHead}>
        <Text style={styles.textStyle1}>{heading}</Text>
        <CloseButton onPress={hideModal} />
      </View>

      {createItemFields.map(item => (
        <View key={item.id} style={styles.setMargin}>
          {item.picker ? (
            <SelectComp
              title={item.fieldName}
              type={selectedPickerItem || item.value || item.pickerLabel}
              onPress={() =>
                onDropdownSelect(item.pickerContent, item.pickerLabel)
              }
              style={styles.selectCompStyle}
            />
          ) : item.amountnUnit ? ( // For amount and unit fields in Project Manager screen when creating exercise.
            <View style={styles.flexRowView2}>
              {item.amountnUnit.map(i =>
                i.picker ? (
                  <SelectComp
                    title={i.fieldName}
                    type={selectedPickerItem || i.value || i.pickerLabel}
                    onPress={() =>
                      onDropdownSelect(i.pickerContent, item.pickerLabel)
                    }
                    style={styles.selectCompStyle2}
                    pickerViewStyle={{width: '80%'}}
                  />
                ) : (
                  <View style={{flex: 0.3}}>
                    <Text style={styles.subHeading}>{i.fieldName}</Text>
                    <TextInput
                      value={item.value}
                      placeholder={i.placeholder}
                      placeholderTextColor={colors.grey}
                      style={styles.textInputStyle}
                      keyboardType={i.keyboardType ? i.keyboardType : 'default'}
                      onChangeText={text => onChangeText(text, i.state || '')}
                    />
                  </View>
                ),
              )}
            </View>
          ) : (
            <View style={styles.setMargin1}>
              <Text style={styles.subHeading}>{item.fieldName}</Text>
              {item.colorPicker ? (
                <View style={[styles.flexRowView, styles.setMargin1]}>
                  <Text style={styles.miniText}>{color}</Text>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={openColorPicker}
                    style={[styles.colorPicker, {backgroundColor: color}]}
                  />
                </View>
              ) : (
                <TextInput
                  value={item.value || value}
                  multiline={item.textArea}
                  placeholder={item.placeholder}
                  placeholderTextColor={colors.grey}
                  onChangeText={text => onChangeText(text, item.state || '')}
                  keyboardType={
                    item.keyboardType ? item.keyboardType : 'default'
                  }
                  style={
                    item.textArea ? styles.textArea : styles.textInputStyle
                  }
                />
              )}
            </View>
          )}
        </View>
      ))}

      <View style={styles.btnView2}>
        <Button loader={loader} title={btnTitle} onPress={onBtnPress} />
      </View>

      {isDeleteBtn ? (
        <View style={styles.bottomTextView2}>
          <TextButton title="Delete" onPress={onDeleteBtnPress} />
        </View>
      ) : null}
    </View>
  );
}

CreateItemContent.defaultProps = {
  createItemFields: [],
  onDropdownSelect: () => {},
  openColorPicker: () => {},
  color: '',
  isDeleteBtn: false,
  onDeleteBtnPress: () => {},
  value: '',
  onChangeText: () => {},
  selectedPickerItem: '',
  loader: false,
};

CreateItemContent.propTypes = {
  heading: PropTypes.string.isRequired,
  btnTitle: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
  onBtnPress: PropTypes.func.isRequired,
  createItemFields: PropTypes.arrayOf(PropTypes.any),
  onDropdownSelect: PropTypes.func,
  openColorPicker: PropTypes.func,
  color: PropTypes.string,
  isDeleteBtn: PropTypes.bool,
  onDeleteBtnPress: PropTypes.func,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  selectedPickerItem: PropTypes.string,
  loader: PropTypes.bool,
};
