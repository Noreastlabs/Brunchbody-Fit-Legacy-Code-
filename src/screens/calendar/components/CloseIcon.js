import React from 'react';
import {IconButton} from 'react-native-paper';
import PropTypes from 'prop-types';
import {colors} from '../../../resources';

const CloseIcon = ({onPress}) => (
  <IconButton
    icon="close-circle-outline"
    color={colors.white}
    size={40}
    style={{marginTop: -18, marginRight: -12}}
    onPress={onPress}
  />
);
CloseIcon.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default CloseIcon;
