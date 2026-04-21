/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import SupersetExeComp from '../SupersetExeComp';
import CloseButton from '../CloseButton';
import TextButton from '../TextButton';
import Button from '../Button';
import styles from './style';

export default function AddExerciseModal(props) {
  const {
    hideModal,
    heading,
    btnTitle,
    onBtnPress,
    isDeleteBtn,
    onDeleteBtnPress,
    numberOfExercises,
    supersetOptions,
    btnLoader,
    submitDisabled,
    formErrorText,
    supersetFieldErrors,
  } = props;

  const renderErrorText = text =>
    text ? (
      <Text style={[styles.supportingText, styles.supportingTextError]}>
        {text}
      </Text>
    ) : null;

  return (
    <View style={styles.contentContainer}>
      <View style={styles.modalHead}>
        <Text style={styles.textStyle1}>{heading}</Text>
        <CloseButton onPress={hideModal} />
      </View>

      {Array(parseInt(numberOfExercises || supersetOptions.length, 10))
        .fill()
        .map((_, index) => (
          <View key={index}>
            <SupersetExeComp
              {...props}
              exeNum={index + 1}
              fieldErrors={supersetFieldErrors[index]}
            />
          </View>
        ))}
      {renderErrorText(formErrorText)}

      <View style={styles.btnView2}>
        <Button
          loader={btnLoader}
          disabled={submitDisabled}
          title={btnTitle}
          onPress={onBtnPress}
        />
      </View>

      {isDeleteBtn ? (
        <View style={styles.bottomTextView2}>
          <TextButton title="Delete" onPress={onDeleteBtnPress} />
        </View>
      ) : null}
    </View>
  );
}

AddExerciseModal.defaultProps = {
  btnLoader: false,
  submitDisabled: false,
  formErrorText: '',
  supersetFieldErrors: [],
};

AddExerciseModal.propTypes = {
  hideModal: PropTypes.func.isRequired,
  onDropdownSelect: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  btnTitle: PropTypes.string.isRequired,
  numberOfExercises: PropTypes.string.isRequired,
  exercise: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  setAmount: PropTypes.func.isRequired,
  onBtnPress: PropTypes.func.isRequired,
  isDeleteBtn: PropTypes.bool.isRequired,
  onDeleteBtnPress: PropTypes.func.isRequired,
  supersetOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  btnLoader: PropTypes.bool,
  submitDisabled: PropTypes.bool,
  formErrorText: PropTypes.string,
  supersetFieldErrors: PropTypes.arrayOf(PropTypes.any),
};
