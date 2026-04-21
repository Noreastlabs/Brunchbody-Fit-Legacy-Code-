import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {colors, strings} from '../../../resources';
import style from './style';

const NextButton = ({nextScreen, currentScreen, loader, label, disabled}) => (
  <TouchableOpacity
    disabled={loader || disabled}
    style={[style.accBtn, disabled ? style.disabledButton : null]}
    onPress={() => {
      currentScreen(nextScreen);
    }}>
    {loader ? (
      <ActivityIndicator size="small" color={colors.white} />
    ) : (
      <Text style={style.accText}>
        {label || strings.completeProfile.buttons.next}
      </Text>
    )}
  </TouchableOpacity>
);

NextButton.defaultProps = {
  loader: false,
  label: '',
  disabled: false,
};

NextButton.propTypes = {
  loader: PropTypes.bool,
  nextScreen: PropTypes.string.isRequired,
  currentScreen: PropTypes.func.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

export default NextButton;
