import React from 'react';
import {Text} from 'react-native';
import PropTypes from 'prop-types';
import style from './style';

const SupportingText = ({text, tone}) => {
  if (!text) {
    return null;
  }

  return (
    <Text
      style={[
        style.supportingText,
        tone === 'error' ? style.supportingTextError : style.supportingTextInfo,
      ]}>
      {text}
    </Text>
  );
};

SupportingText.defaultProps = {
  text: '',
  tone: 'info',
};

SupportingText.propTypes = {
  text: PropTypes.string,
  tone: PropTypes.oneOf(['info', 'error']),
};

export default SupportingText;
