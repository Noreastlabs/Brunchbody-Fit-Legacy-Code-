/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import Swiper from 'react-native-swiper';
import PropTypes from 'prop-types';
import Outlook from './Outlook';
import Weight from './Weight';
import Calorie from './Calorie';
import {colors} from '../../../resources';
import style from './style';

const CarouselCards = props => {
  const {loader, weightData, outlookData, calDiffData, labelsData} = props;

  const outlookChart = {
    labels: [...labelsData].reverse(),
    datasets: [
      {
        data: outlookData,
        color: () => colors.tertiary,
      },
    ],
    legend: ['Outlook'],
  };

  const weightChart = {
    labels: [...labelsData].reverse(),
    datasets: [
      {
        data: weightData,
        color: () => colors.tertiary,
      },
    ],
    legend: ['Weight (lbs)'],
  };

  const calorieChart = {
    labels: [...labelsData].reverse(),
    datasets: [
      {
        data: calDiffData,
        color: () => colors.tertiary,
      },
    ],
    legend: ['Calorie Differential'],
  };

  return (
    <View style={style.carouselView}>
      {loader ? (
        <ActivityIndicator
          size="large"
          color={colors.white}
          style={{marginTop: 10}}
        />
      ) : (
        <Swiper
          loop={false}
          height={380}
          useNativeDriver
          showsButtons={false}
          dotStyle={style.dotStyle}
          activeDotStyle={style.activeDotStyle}>
          <View style={style.slide1}>
            <Outlook {...props} data={outlookChart} />
          </View>
          <View style={style.slide2}>
            <Weight {...props} data={weightChart} />
          </View>
          <View style={style.slide3}>
            <Calorie {...props} data={calorieChart} />
          </View>
        </Swiper>
      )}
    </View>
  );
};

CarouselCards.propTypes = {
  loader: PropTypes.bool.isRequired,
  weightData: PropTypes.arrayOf(PropTypes.any).isRequired,
  outlookData: PropTypes.arrayOf(PropTypes.any).isRequired,
  calDiffData: PropTypes.arrayOf(PropTypes.any).isRequired,
  labelsData: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default CarouselCards;
