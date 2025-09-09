/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import {colors} from '../../../resources';
import Itinerary from './Itinerary';
import {CustomHeader, Dashed} from '../../../components';
import TimeBlock from './TimeBlock';
import styles from './style';

const EditWriting = props => {
  const {showEditEvent, timeData, route, currentTheme} = props;
  const {type} = route?.params;

  return (
    <>
      <CustomHeader />
      <View style={styles.headingView}>
        <Text style={styles.headingText2}>
          {currentTheme?.name || 'Writing'} Day
        </Text>
      </View>
      <TimeBlock timeData={timeData} type={currentTheme ? 'edit' : type} />
      <View style={styles.setMargin1}>
        <Dashed />
      </View>
      <Itinerary
        {...props}
        heading="Itinerary"
        color={colors.secondary}
        showIcon
        showEditEvent={showEditEvent}
        timeData={currentTheme.itinerary}
        type={currentTheme ? 'edit' : type}
      />
    </>
  );
};

EditWriting.defaultProps = {
  route: {},
  currentTheme: {},
};

EditWriting.propTypes = {
  showEditEvent: PropTypes.func.isRequired,
  timeData: PropTypes.arrayOf(PropTypes.any).isRequired,
  route: PropTypes.objectOf(PropTypes.any),
  currentTheme: PropTypes.objectOf(PropTypes.any),
};

export default EditWriting;
