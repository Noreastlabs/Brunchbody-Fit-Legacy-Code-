import React from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {CustomModal, LogoHeader, PermissionModal} from '../../../components';
import Input from './Input';
import Label from './Label';
import NextButton from './NextButton';
import BackButton from './BackButton';
import style from './style';
import {strings} from '../../../resources';

const Weight = ({
  currentScreen,
  text,
  onChangeText,
  permissionModal,
  setPermissionModal,
  alertText,
  alertHeading,
  onDonePermissionModal,
}) => (
  <SafeAreaView style={style.nameContainer}>
    <BackButton
      previousScreen={strings.completeProfile.screen.Height}
      currentScreen={currentScreen}
    />
    <ScrollView contentContainerStyle={style.scrollView}>
      <View style={style.logoContainer}>
        <LogoHeader />
      </View>
      <View style={style.nameInputContainer}>
        <Label text={strings.completeProfile.labels.weight} />
        <Input
          text={text}
          maxLength={8}
          keyboardType="decimal-pad"
          onChangeText={onChangeText}
          placeholder={strings.completeProfile.placeholders.weight}
        />
        {/* <Text>{text}</Text> */}
      </View>
      <NextButton
        nextScreen={strings.completeProfile.screen.Gender}
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

Weight.propTypes = {
  currentScreen: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  alertText: PropTypes.string.isRequired,
  alertHeading: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
};

export default Weight;
