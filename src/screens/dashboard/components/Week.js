import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import Details from './Details';
import CarouselCards from './Carousel';
import style from './style';

function Week(props) {
  const { dashboardReadModel } = props;
  const { weightData, outlookData, calDiffData } = dashboardReadModel.week;

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
  dashboardReadModel: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Week;
