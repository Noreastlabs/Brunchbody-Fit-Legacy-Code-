import React, {Component} from 'react';
import DashedLine from 'react-native-dashed-line';
import {colors} from '../../resources';

export default class Dashed extends Component {
  render() {
    return (
      <DashedLine
        dashLength={10}
        dashThickness={2}
        dashGap={10}
        dashColor={colors.mainFont}
      />
    );
  }
}
