/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';

const TimeBlock = props => {
  const {timeData, type, currentTime} = props;

  return (
    <View style={styles.timeContainer}>
      <View style={styles.blockRow}>
        {timeData?.map((a, index) => {
          const taskTimeInMin =
            parseInt(a.time.split(':')[0], 10) * 60 +
            parseInt(a.time.split(':')[1], 10);

          const currentTimeInMin =
            parseInt(currentTime?.split(':')[0], 10) * 60 +
            parseInt(currentTime?.split(':')[1], 10);

          return (
            <View
              style={[
                styles.sleepUnfilled,
                {
                  borderColor: a.taskColor,
                  backgroundColor:
                    type !== 'edit' && taskTimeInMin <= currentTimeInMin
                      ? a.taskColor
                      : 'transparent',
                },
              ]}
              key={index}>
              <Text style={styles.textStyle}>
                {(type === 'edit' || type === 'newDay') &&
                  (index === 0
                    ? 12
                    : '' || index === 4
                    ? 1
                    : '' || index === 8
                    ? 2
                    : '' || index === 12
                    ? 3
                    : '' || index === 16
                    ? 4
                    : '' || index === 20
                    ? 5
                    : '' || index === 24
                    ? 6
                    : '' || index === 28
                    ? 7
                    : '' || index === 32
                    ? 8
                    : '' || index === 36
                    ? 9
                    : '' || index === 40
                    ? 10
                    : '' || index === 44
                    ? 11
                    : '' || index === 48
                    ? 12
                    : '' || index === 52
                    ? 1
                    : '' || index === 56
                    ? 2
                    : '' || index === 60
                    ? 3
                    : '' || index === 64
                    ? 4
                    : '' || index === 68
                    ? 5
                    : '' || index === 72
                    ? 6
                    : '' || index === 76
                    ? 7
                    : '' || index === 80
                    ? 8
                    : '' || index === 84
                    ? 9
                    : '' || index === 88
                    ? 10
                    : '' || index === 92
                    ? 11
                    : '')}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

TimeBlock.defaultProps = {
  type: '',
  tempArray: [],
};

TimeBlock.propTypes = {
  timeData: PropTypes.arrayOf(PropTypes.any).isRequired,
  type: PropTypes.string,
  currentTime: PropTypes.string.isRequired,
  tempArray: PropTypes.arrayOf(PropTypes.any),
};

export default TimeBlock;
