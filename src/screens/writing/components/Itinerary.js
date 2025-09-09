/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Headline} from 'react-native-paper';
import AddIcon from './AddIcon';
import styles from './style';
import {colors} from '../../../resources';

let prevName = '';

export default function Itinerary(props) {
  const {
    heading,
    color,
    showIcon,
    showEditEvent,
    timeData,
    type,
    setModalHeading,
    setBtnTitle,
    setIsItineraryDetailModal,
    setItineraryItem,
    onItineraryPress,
    onAddIconPress,
  } = props;

  return (
    <View style={{marginVertical: 10}}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Headline
          style={{
            color,
            fontSize: 26,
            textAlign: 'center',
            marginBottom: 10,
            fontWeight: 'bold',
          }}>
          {heading}
        </Headline>
        {showIcon ? (
          <AddIcon
            onPress={() => {
              onAddIconPress();
              showEditEvent();
              setBtnTitle('Create');
              setModalHeading('Create Event');
            }}
          />
        ) : null}
      </View>

      <View style={styles.timeContainer}>
        {timeData?.map((item, index) => {
          let temp = false;
          if (item.taskName !== prevName) {
            temp = true;
            prevName = item.taskName;
          }
          if (index + 1 === timeData.length) {
            prevName = '';
          }

          return temp ? (
            <TouchableOpacity
              key={index}
              activeOpacity={0.5}
              style={styles.itinerariesView}
              onPress={() =>
                type === 'edit' || type === 'newDay'
                  ? (setModalHeading('Edit Event'),
                    setBtnTitle('Save'),
                    showEditEvent(),
                    onItineraryPress(item, index))
                  : (setIsItineraryDetailModal(true), setItineraryItem(item))
              }>
              <View
                style={[styles.circleStyle, {borderColor: item.taskColor}]}
              />
              <Text
                style={[
                  styles.textStyle1,
                  {color: type === 'edit' ? colors.tertiary : colors.white},
                ]}>
                {item.taskName}
              </Text>
            </TouchableOpacity>
          ) : null;
        })}
      </View>
    </View>
  );
}

Itinerary.defaultProps = {
  type: '',
  showEditEvent: () => {},
  setIsItineraryDetailModal: () => {},
  setBtnTitle: () => {},
  setItineraryItem: () => {},
};

Itinerary.propTypes = {
  heading: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  showIcon: PropTypes.bool.isRequired,
  showEditEvent: PropTypes.func,
  timeData: PropTypes.arrayOf(PropTypes.any).isRequired,
  type: PropTypes.string,
  setModalHeading: PropTypes.func.isRequired,
  setBtnTitle: PropTypes.func,
  setIsItineraryDetailModal: PropTypes.func,
  setItineraryItem: PropTypes.func,
  onItineraryPress: PropTypes.func.isRequired,
  onAddIconPress: PropTypes.func.isRequired,
};
