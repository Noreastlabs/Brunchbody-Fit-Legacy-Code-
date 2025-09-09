import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {colors, strings} from '../../../resources';
import style from './style';

const NextButton = ({nextScreen, currentScreen, loader, label}) => (
  <TouchableOpacity
    disabled={loader}
    style={style.accBtn}
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
};

NextButton.propTypes = {
  loader: PropTypes.bool,
  nextScreen: PropTypes.string.isRequired,
  currentScreen: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default NextButton;
