/* eslint-disable react/forbid-prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import {Text, View, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import {RadioButton} from 'react-native-paper';
import {colors} from '../../resources';
import styles from './style';

const radioBtns = [
  {
    value: 1,
  },
  {
    value: 2,
  },
  {
    value: 3,
  },
  {
    value: 4,
  },
  {
    value: 5,
  },
  {
    value: 6,
  },
  {
    value: 7,
  },
  {
    value: 8,
  },
  {
    value: 9,
  },
  {
    value: 10,
  },
];

export default function CustomTextArea(props) {
  const {
    title,
    isTextArea,
    placeholder,
    checked,
    setChecked,
    onChangeText,
    value,
  } = props;

  return (
    <View style={styles.setMargin}>
      <Text style={styles.contentStyle}>{title.toUpperCase()}</Text>
      {isTextArea ? (
        <TextInput
          multiline
          value={value}
          placeholder={placeholder}
          style={styles.textArea}
          placeholderTextColor={colors.grey}
          onChangeText={text => onChangeText(text)}
        />
      ) : (
        <View style={styles.radioBtnView}>
          {radioBtns.map(item => (
            <View key={item.value} style={styles.radioBtns}>
              <RadioButton.Android
                value={item.value}
                status={checked === item.value ? 'checked' : 'unchecked'}
                onPress={() => setChecked(item.value)}
                uncheckedColor={colors.grey}
              />
              <Text style={styles.label}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

CustomTextArea.defaultProps = {
  isTextArea: false,
  placeholder: '',
  checked: 1,
  setChecked: () => {},
  onChangeText: () => {},
  value: null,
};

CustomTextArea.propTypes = {
  title: PropTypes.string.isRequired,
  isTextArea: PropTypes.bool,
  placeholder: PropTypes.string,
  setChecked: PropTypes.func,
  checked: PropTypes.number,
  onChangeText: PropTypes.func,
  value: PropTypes.any,
};
