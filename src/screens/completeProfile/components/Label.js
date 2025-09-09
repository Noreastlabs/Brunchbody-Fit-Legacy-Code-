import React from 'react';
import {Text} from 'react-native';
import PropTypes from 'prop-types';
import style from './style';

const Label = ({text}) => <Text style={style.text}>{text}</Text>;

Label.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Label;
