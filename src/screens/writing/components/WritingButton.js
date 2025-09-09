import React from 'react';
import {Button} from 'react-native-paper';
import PropTypes from 'prop-types';

const WritingButton = ({color}) => (
  <Button
    mode="contained"
    style={{
      backgroundColor: color,
      width: 100,
      borderRadius: 20,
      margin: 3,
    }}
  />
);

WritingButton.propTypes = {
  color: PropTypes.string.isRequired,
};
export default WritingButton;
