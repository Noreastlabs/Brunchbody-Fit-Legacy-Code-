import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import {colors} from '../../resources';

export default function PermissionModal(props) {
  const {
    onDone,
    onCancel,
    heading,
    text,
    isInput,
    isCancelBtn,
    loader,
    value,
    onChangeText,
  } = props;

  return (
    <View
      style={[
        styles.container,
        {borderColor: heading === 'Success!' ? colors.mediumGreen : colors.red},
      ]}>
      <View style={styles.textsView}>
        <Text style={styles.textStyle1}>{heading || 'Confirm Deletion'}</Text>
        <Text style={styles.textStyle2}>
          {text || 'Are you sure you want to remove item?'}
        </Text>
      </View>

      {isInput ? (
        <TextInput
          value={value}
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInputStyle}
          onChangeText={txt => onChangeText(txt)}
        />
      ) : null}

      <View style={styles.btnsContainer}>
        {isCancelBtn ? (
          <>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.btnView}
              onPress={onCancel}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <View style={styles.lineStyle} />
          </>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.btnView}
          onPress={onDone}
          disabled={loader}>
          {loader ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.btnText}>OK</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

PermissionModal.defaultProps = {
  heading: '',
  text: '',
  isInput: false,
  isCancelBtn: true,
  loader: false,
  value: '',
  onChangeText: () => {},
};

PermissionModal.propTypes = {
  onDone: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  heading: PropTypes.string,
  text: PropTypes.string,
  isInput: PropTypes.bool,
  isCancelBtn: PropTypes.bool,
  loader: PropTypes.bool,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
};
