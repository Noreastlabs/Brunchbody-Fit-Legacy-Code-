import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import {RFValue} from 'react-native-responsive-fontsize';
import CloseButton from '../CloseButton';
import {colors} from '../../resources';
import styles from './NutritionStyle';

export default function ItineraryDetail(props) {
  const {onClose, itineraryItem} = props;

  return (
    <View style={[styles.container, {paddingVertical: RFValue(15)}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {fontSize: RFValue(22)}]}>
          {itineraryItem.taskName}
        </Text>
        <CloseButton
          closeIconSize={25}
          iconColor={colors.nonEditableOverlays}
          style={{backgroundColor: colors.white}}
          onPress={onClose}
        />
      </View>

      <View style={styles.setMargin}>
        <Text style={styles.subHeading}>Event Time</Text>
        <View style={styles.eventTimeView}>
          <Text style={styles.bodytext}>STARTS:</Text>
          <Text style={styles.eventTimeText}>{itineraryItem.fromTime}</Text>
        </View>
        <View style={styles.eventTimeView}>
          <Text style={styles.bodytext}>ENDS:</Text>
          <Text style={styles.eventTimeText}>{itineraryItem.toTime}</Text>
        </View>
      </View>

      <View style={styles.eventTimeView}>
        <Text style={styles.noteText}>Note:</Text>
        <Text style={[styles.noteText, {marginLeft: 10}]}>
          {itineraryItem.notes}
        </Text>
      </View>
    </View>
  );
}

ItineraryDetail.propTypes = {
  onClose: PropTypes.func.isRequired,
  itineraryItem: PropTypes.objectOf(PropTypes.any).isRequired,
};
