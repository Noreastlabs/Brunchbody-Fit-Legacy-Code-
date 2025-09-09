/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  CustomHeader,
  CustomModal,
  Dashed,
  ItineraryDetail,
} from '../../../components';
import { colors } from '../../../resources';
import Itinerary from './Itinerary';
import TimeBlock from './TimeBlock';
import styles from './style';

const Writing = props => {
  const navigation = useNavigation();
  const {
    timeData,
    isItineraryDetailModal,
    setIsItineraryDetailModal,
    setModalHeading,
    currentTheme,
  } = props;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <CustomHeader
          isEdit
          onEditPress={() =>
            navigation.navigate('Edit Writing', {type: 'edit'})
          }
        />
        <View style={styles.headingView}>
          <Text style={styles.headingText2}>{currentTheme.name} Day</Text>
        </View>
        <TimeBlock {...props} timeData={timeData} />
        <Text style={styles.timeText}>{moment().format('hh:mm a')}</Text>
        <View style={styles.setMargin1}>
          <Dashed />
        </View>
        <Itinerary
          {...props}
          showIcon={false}
          heading="Itinerary"
          color={colors.secondary}
          timeData={currentTheme.itinerary}
          setIsItineraryDetailModal={setIsItineraryDetailModal}
          setModalHeading={setModalHeading}
        />
      </ScrollView>

      <CustomModal
        isVisible={isItineraryDetailModal}
        onDismiss={() => setIsItineraryDetailModal(false)}
        content={
          <ItineraryDetail
            {...props}
            onClose={() => setIsItineraryDetailModal(false)}
          />
        }
      />
    </SafeAreaView>
  );
};

Writing.defaultProps = {
  currentTheme: {},
};

Writing.propTypes = {
  timeData: PropTypes.arrayOf(PropTypes.any).isRequired,
  isItineraryDetailModal: PropTypes.bool.isRequired,
  setIsItineraryDetailModal: PropTypes.func.isRequired,
  setModalHeading: PropTypes.func.isRequired,
  currentTheme: PropTypes.objectOf(PropTypes.any),
};

export default Writing;
