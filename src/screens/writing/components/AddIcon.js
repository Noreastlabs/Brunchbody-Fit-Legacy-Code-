import React from 'react';
import {IconButton} from 'react-native-paper';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../../resources';

const AddIcon = ({onPress}) => (
  <IconButton
    color={colors.icon}
    size={40}
    icon={({size, color}) => (
      <Icon
        name="add-circle"
        size={size}
        color={color}
        selectionColor={colors.icon}
      />
    )}
    style={{marginTop: -10, marginRight: -12}}
    onPress={onPress}
  />
);

AddIcon.propTypes = {
  onPress: PropTypes.func.isRequired,
};
export default AddIcon;
