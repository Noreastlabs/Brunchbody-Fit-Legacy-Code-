/* eslint-disable react/forbid-prop-types */
import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

export default class TopTabs extends Component {
  render() {
    const {onPress, childView} = this.props;

    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        {childView}
      </TouchableOpacity>
    );
  }
}

TopTabs.propTypes = {
  onPress: PropTypes.func.isRequired,
  childView: PropTypes.any.isRequired,
};
