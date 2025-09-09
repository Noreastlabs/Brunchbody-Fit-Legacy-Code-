import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import Button from '../Button';
import CloseButton from '../CloseButton';

export default function ModalContent(props) {
  const {
    hideModal,
    btnTitle,
    heading,
    subText,
    onBtnPress,
    isDeleteBtn,
    onDeleteBtnPress,
  } = props;

  return (
    <View style={styles.contentContainer}>
      <View style={styles.closeBtnView}>
        <CloseButton onPress={hideModal} />
      </View>

      <View style={styles.textsView}>
        <Text style={styles.textStyle1}>{heading}</Text>
        {subText !== '' ? (
          <Text style={styles.textStyle2}>{subText}</Text>
        ) : null}
      </View>

      <View style={styles.btnView}>
        <Button title={btnTitle} onPress={onBtnPress} />
      </View>

      {isDeleteBtn && (
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.bottomTextView}
          onPress={onDeleteBtnPress}
        >
          <Text style={styles.textStyle3}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

ModalContent.defaultProps = {
  heading: '',
  subText: '',
  isDeleteBtn: false,
  onDeleteBtnPress: () => {},
};

ModalContent.propTypes = {
  heading: PropTypes.string,
  subText: PropTypes.string,
  btnTitle: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
  onBtnPress: PropTypes.func.isRequired,
  isDeleteBtn: PropTypes.bool,
  onDeleteBtnPress: PropTypes.func,
};
