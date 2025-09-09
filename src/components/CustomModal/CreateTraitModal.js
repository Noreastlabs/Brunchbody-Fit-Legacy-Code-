import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import {RadioButton} from 'react-native-paper';
import CloseButton from '../CloseButton';
import Button from '../Button';
import {colors} from '../../resources';
import styles from './style';

export default function CreateTraitModal(props) {
  const {
    openColorPicker,
    color,
    favorite,
    setFavorite,
    heading,
    hideModal,
    btnTitle,
    onBtnPress,
    openDirectory,
    onChangeText,
    value,
  } = props;

  return (
    <View style={styles.contentContainer}>
      <View style={styles.modalHead}>
        <Text style={styles.textStyle1}>{heading}</Text>
        <CloseButton onPress={hideModal} />
      </View>

      <View style={styles.setMargin1}>
        <Text style={styles.subHeading}>New Trait</Text>
        <TextInput
          value={value}
          placeholder="Enter Trait"
          placeholderTextColor={colors.grey}
          style={styles.textInputStyle}
          onChangeText={text => onChangeText(text)}
        />
      </View>

      <View style={styles.setMargin3}>
        <TouchableOpacity activeOpacity={0.5} onPress={openDirectory}>
          <Text style={styles.cancelText}>Select From Directory</Text>
        </TouchableOpacity>

        <View style={styles.setMargin2}>
          <Text style={styles.subHeading}>Trait Color</Text>

          <View style={[styles.flexRowView, styles.setMargin1]}>
            <Text style={styles.miniText}>{color}</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={openColorPicker}
              style={[styles.colorPicker, {backgroundColor: color}]}
            />
          </View>
        </View>

        <View style={styles.setMargin2}>
          <Text style={styles.subHeading}>Add to Favorites</Text>

          <View style={styles.setMargin1}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.selectOptionsView}
              onPress={setFavorite}>
              <RadioButton.Android
                value="Theme"
                status={favorite ? 'checked' : 'unchecked'}
                onPress={setFavorite}
                uncheckedColor={colors.nonEditableOverlays}
              />
              <Text style={styles.optionText}>ADD TO FAVORITES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.btnView2}>
        <Button title={btnTitle} onPress={onBtnPress} />
      </View>
    </View>
  );
}

CreateTraitModal.propTypes = {
  color: PropTypes.string.isRequired,
  openColorPicker: PropTypes.func.isRequired,
  favorite: PropTypes.bool.isRequired,
  setFavorite: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
  btnTitle: PropTypes.string.isRequired,
  onBtnPress: PropTypes.func.isRequired,
  openDirectory: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
