import React, {Component} from 'react';
import {Image, View} from 'react-native';
import {images} from '../../resources';
import style from './style';

export default class LogoHeader extends Component {
  render() {
    return (
      <View style={style.container}>
        <Image source={images.logo} style={style.imageStyle} />
      </View>
    );
  }
}
