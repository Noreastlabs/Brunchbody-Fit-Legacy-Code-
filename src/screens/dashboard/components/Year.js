/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CarouselCards from './Carousel';
import Details from './Details';
import style from './style';

function Year(props) {
  const { weightData, outlookData, calDiffData, years } = props;

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
        labelsData={years}
      />
      <Details {...props} />
    </ScrollView>
  );
}

Year.propTypes = {
  weightData: PropTypes.arrayOf(PropTypes.any).isRequired,
  outlookData: PropTypes.arrayOf(PropTypes.any).isRequired,
  calDiffData: PropTypes.arrayOf(PropTypes.any).isRequired,
  years: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  weightData: state.journal?.yearlyWeightList,
  outlookData: state.journal?.yearlyOutlookList,
  calDiffData: state.journal?.yearlyCaloriesDiffList,
});

export default connect(mapStateToProps)(Year);
