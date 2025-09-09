/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CarouselCards from './Carousel';
import Details from './Details';
import style from './style';

function Month(props) {
  const { weightData, outlookData, calDiffData, months } = props;

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
        labelsData={months}
      />
      <Details {...props} />
    </ScrollView>
  );
}

Month.propTypes = {
  weightData: PropTypes.arrayOf(PropTypes.any).isRequired,
  outlookData: PropTypes.arrayOf(PropTypes.any).isRequired,
  calDiffData: PropTypes.arrayOf(PropTypes.any).isRequired,
  months: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  weightData: state.journal?.monthlyWeightList,
  outlookData: state.journal?.monthlyOutlookList,
  calDiffData: state.journal?.monthlyCaloriesDiffList,
});

export default connect(mapStateToProps)(Month);
