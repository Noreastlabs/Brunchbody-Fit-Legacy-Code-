import React, {Component} from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import Slider from '@react-native-community/slider';
import {colors} from '../../resources';
import styles from './style';

export default class CustomSlider extends Component {
  render() {
    const {label, value, onChange} = this.props;

    return (
      <View style={styles.sliderView}>
        <Text style={styles.textStyle2}>{label}</Text>

        <View style={styles.flexRowView}>
          <Slider
            value={value}
            minimumValue={1}
            maximumValue={100}
            style={styles.sliderStyle}
            thumbTintColor={colors.tertiary}
            minimumTrackTintColor={colors.tertiary}
            maximumTrackTintColor={colors.white}
            onValueChange={val =>
              onChange({name: label, value: Math.floor(val)})
            }
          />
          <View style={styles.percentView}>
            <Text style={styles.percentText}>{Math.floor(value)}%</Text>
          </View>
        </View>
      </View>
    );
  }
}

CustomSlider.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
