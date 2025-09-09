import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import style from './style';
import {LogoHeader} from '../../../components';
import {strings} from '../../../resources';
import Label from './Label';
import NextButton from './NextButton';

const Welcome = ({currentScreen, navigation}) => (
  <SafeAreaView style={style.nameContainer}>
    <ScrollView contentContainerStyle={style.scrollView}>
      <View style={style.logoContainer}>
        <LogoHeader />
      </View>
      <View style={style.nameInputContainer}>
        <Label text={strings.completeProfile.labels.welcome} />
        <View style={style.welcomeText}>
          <Text style={style.tutorial}>
            {strings.completeProfile.labels.tutorial}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tutorials')}>
            <Text style={style.click}>
              {strings.completeProfile.buttons.click}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <NextButton
        label="Get Started"
        currentScreen={currentScreen}
        nextScreen="Home"
      />
    </ScrollView>
  </SafeAreaView>
);

Welcome.propTypes = {
  currentScreen: PropTypes.func.isRequired,
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Welcome;
