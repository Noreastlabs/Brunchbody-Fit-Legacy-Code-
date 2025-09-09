import React, {Component} from 'react';
import {SafeAreaView, Text} from 'react-native';
import {LogoHeader} from '../../../components';
import {strings} from '../../../resources/strings';
import style from './style';

export default class Welcome extends Component {
  render() {
    return (
      <SafeAreaView style={style.safeArea}>
        <LogoHeader />
        <Text style={style.text}>{strings.welcome.message}</Text>
      </SafeAreaView>
    );
  }
}
