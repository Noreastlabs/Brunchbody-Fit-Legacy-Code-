/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
import PropTypes from 'prop-types';
import React from 'react';
import { Dimensions, Image, ScrollView, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button, CustomHeader, SafeAreaWrapper } from '../../../../components';
import { images } from '../../../../resources';

export default function Tutorials({onBackPress, onNextPress, currentImage}) {
  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 40}}>
        <CustomHeader onPress={onBackPress} />
        <View style={{flex: 1}}>
          <Image
            style={{width: Dimensions.get('window').width}}
            source={images.tutorialImages[currentImage]}
            resizeMode="contain"
          />
        </View>

        <View style={{marginHorizontal: 80}}>
          <Button
            onPress={onNextPress}
            style={{height: RFValue(32)}}
            title={
              currentImage === 0
                ? 'Get Started'
                : currentImage === images.tutorialImages.length - 1
                ? 'Completed'
                : 'Next'
            }
            titleStyle={{color: 'white', fontSize: RFValue(16)}}
          />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

Tutorials.propTypes = {
  onNextPress: PropTypes.func.isRequired,
  onBackPress: PropTypes.func.isRequired,
  currentImage: PropTypes.number.isRequired,
};
