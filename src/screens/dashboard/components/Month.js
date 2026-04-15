import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import CarouselCards from './Carousel';
import Details from './Details';
import style from './style';

function Month(props) {
  const { dashboardReadModel, months } = props;
  const { weightData, outlookData, calDiffData } = dashboardReadModel.month;

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
  dashboardReadModel: PropTypes.objectOf(PropTypes.any).isRequired,
  months: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default Month;
