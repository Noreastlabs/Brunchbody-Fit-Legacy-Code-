import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { images } from '../../resources';
import styles from './style';

export default function CustomHeader(props) {
  const navigation = useNavigation();
  const { isEdit, onPress, onEditPress } = props;
  return (
    <View style={styles.headerStyle}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          if (typeof onPress === 'function') {
            onPress(navigation);
          } else {
            navigation.goBack();
          }
        }}
      >
        <Image style={{ tintColor: 'white' }} source={images.arrow} />
      </TouchableOpacity>
      {isEdit && (
        <TouchableOpacity activeOpacity={0.5} onPress={onEditPress}>
          <Text style={styles.textStyle}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

CustomHeader.defaultProps = {
  isEdit: false,
  // default to null and let the handler fall back to navigation.goBack()
  onPress: null,
  onEditPress: () => {},
};

CustomHeader.propTypes = {
  isEdit: PropTypes.bool,
  onPress: PropTypes.func,
  onEditPress: PropTypes.func,
};
