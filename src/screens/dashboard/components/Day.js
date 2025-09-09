/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Details from './Details';
import CarouselCards from './Carousel';
import style from './style';

function Day(props) {
  const { weightData, outlookData, calDiffData, days } = props;

  return (
    <ScrollView
      contentContainerStyle={style.scrollView}
      showsVerticalScrollIndicator={false}
    >
      <CarouselCards
        {...props}
        weightData={[...weightData].reverse()}
        outlookData={[...outlookData].reverse()}
        calDiffData={[...calDiffData].reverse()}
        labelsData={days}
      />
      <Details {...props} />
    </ScrollView>
  );
}

Day.propTypes = {
  weightData: PropTypes.arrayOf(PropTypes.any).isRequired,
  outlookData: PropTypes.arrayOf(PropTypes.any).isRequired,
  calDiffData: PropTypes.arrayOf(PropTypes.any).isRequired,
  days: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  weightData: state.journal?.dailyWeightList,
  outlookData: state.journal?.dailyOutlookList,
  calDiffData: state.journal?.dailyCaloriesDiffList,
});

export default connect(mapStateToProps)(Day);
