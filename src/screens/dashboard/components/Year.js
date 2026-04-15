import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import CarouselCards from './Carousel';
import Details from './Details';
import style from './style';

function Year(props) {
  const { dashboardReadModel, years } = props;
  const { weightData, outlookData, calDiffData } = dashboardReadModel.year;

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
  dashboardReadModel: PropTypes.objectOf(PropTypes.any).isRequired,
  years: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default Year;
