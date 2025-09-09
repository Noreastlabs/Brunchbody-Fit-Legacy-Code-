import React from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import style from './style';
import {
  LogoHeader,
  CustomHeader,
  CustomModal,
  PermissionModal,
} from '../../../components';
import Input from './Input';
import Label from './Label';
import NextButton from './NextButton';
import {strings} from '../../../resources';
// import {CustomHeader} from '../../../components';

const Name = ({
  currentScreen,
  onChangeText,
  text,
  permissionModal,
  setPermissionModal,
  alertText,
  alertHeading,
  onDonePermissionModal,
}) => (
  <SafeAreaView style={style.nameContainer}>
    <CustomHeader />
    <ScrollView contentContainerStyle={style.scrollView}>
      <View style={style.logoContainer}>
        <LogoHeader />
      </View>
      <View style={style.nameInputContainer}>
        <Label text={strings.completeProfile.labels.name} />
        <Input
          text={text}
          placeholder={strings.completeProfile.placeholders.name}
          onChangeText={onChangeText}
        />
        {/* <Text style={{color: 'white'}}>{text}</Text> */}
      </View>
      <NextButton
        nextScreen={strings.completeProfile.screen.DOB}
        currentScreen={currentScreen}
      />
    </ScrollView>

    <CustomModal
      isVisible={permissionModal}
      onDismiss={() => setPermissionModal(false)}
      content={
        <PermissionModal
          heading={alertHeading}
          text={alertText}
          onDone={onDonePermissionModal}
          onCancel={() => setPermissionModal(false)}
        />
      }
    />
  </SafeAreaView>
);

Name.propTypes = {
  currentScreen: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  alertText: PropTypes.string.isRequired,
  alertHeading: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
};

export default Name;
