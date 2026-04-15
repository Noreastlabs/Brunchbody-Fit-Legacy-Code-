import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import Details from './Details';
import CarouselCards from './Carousel';
import style from './style';

function Day(props) {
  const { dashboardReadModel, days } = props;
  const { weightData, outlookData, calDiffData } = dashboardReadModel.day;

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
  dashboardReadModel: PropTypes.objectOf(PropTypes.any).isRequired,
  days: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default Day;
