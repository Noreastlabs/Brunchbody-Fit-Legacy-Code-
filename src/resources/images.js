import React from 'react';
import { Dimensions } from 'react-native';
import GettingStarted from '../assets/tutorialsSVG/gettingStarted.svg';

const { width, height } = Dimensions.get('window');

module.exports.images = {
  logo: require('../assets/logo.png'),
  arrow: require('../assets/arrow.png'),
  rotatingArrows: require('../assets/arrows-rotating.png'),
  gettingStarted: <GettingStarted height={height} width={width} />,
  tutorialImages: [
    require('../assets/tutorialsPNG/cropped-images/gettingStarted.png'),
    require('../assets/tutorialsPNG/cropped-images/dashboard1.png'),
    require('../assets/tutorialsPNG/cropped-images/dashboard2.png'),
    require('../assets/tutorialsPNG/cropped-images/dashboard3.png'),
    require('../assets/tutorialsPNG/cropped-images/dashboardComplete.png'),
    require('../assets/tutorialsPNG/cropped-images/recreationStarted.png'),
    require('../assets/tutorialsPNG/cropped-images/recreation1.png'),
    require('../assets/tutorialsPNG/cropped-images/recreation2.png'),
    require('../assets/tutorialsPNG/cropped-images/recreation3.png'),
    require('../assets/tutorialsPNG/cropped-images/recreation4.png'),
    require('../assets/tutorialsPNG/cropped-images/recreation5.png'),
    require('../assets/tutorialsPNG/cropped-images/recreation6.png'),
    require('../assets/tutorialsPNG/cropped-images/recreationCompleted.png'),
    require('../assets/tutorialsPNG/cropped-images/nutrition1.png'),
    require('../assets/tutorialsPNG/cropped-images/nutrition2.png'),
    require('../assets/tutorialsPNG/cropped-images/nutrition3.png'),
    require('../assets/tutorialsPNG/cropped-images/nutrition4.png'),
    require('../assets/tutorialsPNG/cropped-images/nutrition5.png'),
    require('../assets/tutorialsPNG/cropped-images/nutrition6.png'),
    require('../assets/tutorialsPNG/cropped-images/nutritionCompleted.png'),
    require('../assets/tutorialsPNG/cropped-images/journal1.png'),
    require('../assets/tutorialsPNG/cropped-images/journal2.png'),
    require('../assets/tutorialsPNG/cropped-images/journal3.png'),
    require('../assets/tutorialsPNG/cropped-images/journalCompleted.png'),
    require('../assets/tutorialsPNG/cropped-images/calender1.png'),
    require('../assets/tutorialsPNG/cropped-images/calender2.png'),
    require('../assets/tutorialsPNG/cropped-images/calender3.png'),
    require('../assets/tutorialsPNG/cropped-images/calender4.png'),
    require('../assets/tutorialsPNG/cropped-images/calender5.png'),
    require('../assets/tutorialsPNG/cropped-images/calenderCompleted.png'),
  ],
};
