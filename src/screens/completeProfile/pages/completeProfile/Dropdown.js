import React, {useState} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Dropdown from '../../components/Dropdown';

export const DropdownPage = ({data, settingValue}) => {
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = useState(0);

  // setValue(0);
  return (
    <View>
      <Dropdown value={settingValue} data={data} initialValue={value} />
    </View>
  );
};

DropdownPage.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  settingValue: PropTypes.func.isRequired,
};

export const DropdownWrapper = connect(null, null)(DropdownPage);
