import React from 'react';
import {View, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {RFValue} from 'react-native-responsive-fontsize';
import CloseButton from '../CloseButton';
import {colors} from '../../resources';
import styles from './style';

export default function SearchBar(props) {
  const {onChangeText, value} = props;

  return (
    <View style={styles.container}>
      <AntDesign
        name="search1"
        size={RFValue(15)}
        color={colors.nonEditableOverlays}
      />
      <TextInput
        value={value}
        placeholder="Search"
        placeholderTextColor={colors.textGrey}
        style={styles.textInputStyle}
        onChangeText={text => onChangeText(text)}
      />
      <CloseButton
        closeIconSize={13}
        iconColor={colors.nonEditableOverlays}
        style={styles.closeBtnStyle}
        onPress={() => onChangeText('')}
      />
    </View>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
};
