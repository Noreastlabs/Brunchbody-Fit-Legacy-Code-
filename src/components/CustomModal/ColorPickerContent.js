import React, { useState } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import WheelColorPicker from 'react-native-wheel-color-picker';
import CloseButton from '../CloseButton';
import styles from './style';
import Button from '../Button';

export default function ColorPickerContent(props) {
  const { hideModal, btnTitle, onBtnPress, color, onChangeColor } = props;
  const [selectedColor, setSelectedColor] = useState(color);

  const handleColorChange = newColor => {
    setSelectedColor(newColor);
    onChangeColor(newColor);
  };

  return (
    <View style={styles.contentContainer}>
      <View style={styles.modalHead}>
        <Text style={styles.textStyle1}>Colors</Text>
        <CloseButton onPress={hideModal} />
      </View>

      <WheelColorPicker
        color={selectedColor}
        onColorChangeComplete={handleColorChange}
        style={styles.colorPickerStyle}
        swatchesOnly={false}
        discrete={false}
      />

      <View style={styles.lineStyle} />

      <View style={styles.flexRowView}>
        <Text style={styles.mediumText}>Hex</Text>
        <View style={styles.hexColorCodeView}>
          <View
            style={[styles.colorView, { backgroundColor: selectedColor }]}
          />
          <Text style={styles.mediumText}>{selectedColor}</Text>
        </View>
      </View>

      <View style={styles.btnView2}>
        <Button title={btnTitle} onPress={onBtnPress} />
      </View>
    </View>
  );
}

ColorPickerContent.propTypes = {
  hideModal: PropTypes.func.isRequired,
  btnTitle: PropTypes.string.isRequired,
  onBtnPress: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  onChangeColor: PropTypes.func.isRequired,
};
