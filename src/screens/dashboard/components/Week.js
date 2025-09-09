/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Details from './Details';
import CarouselCards from './Carousel';
import style from './style';

function Week(props) {
  const { weightData, outlookData, calDiffData } = props;

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
        labelsData={['W7', 'W6', 'W5', 'W4', 'W3', 'W2', 'W1']}
      />
      <Details {...props} />
    </ScrollView>
  );
}

Week.propTypes = {
  weightData: PropTypes.arrayOf(PropTypes.any).isRequired,
  outlookData: PropTypes.arrayOf(PropTypes.any).isRequired,
  calDiffData: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  weightData: state.journal?.weeklyWeightList,
  outlookData: state.journal?.weeklyOutlookList,
  calDiffData: state.journal?.weeklyCaloriesDiffList,
});

export default connect(mapStateToProps)(Week);
