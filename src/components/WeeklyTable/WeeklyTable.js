/* eslint-disable eqeqeq */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import CustomText from '../CustomText';
import styles from './style';
import {colors} from '../../resources';
import Dashed from '../Dashed';

export default function WeeklyTable(props) {
  const {data, onPress, tempWeek} = props;
  let calCost = 0;

  return (
    <View>
      <Text style={styles.titleStyle}>Week {tempWeek}</Text>

      <View style={styles.weekDaysView}>
        {[1, 2, 3, 4, 5, 6, 7].map((item, index) => {
          const dayData = data.find(a => a.day == item);

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.5}
              onPress={() => onPress(dayData || {day: index + 1})}>
              <CustomText
                text={item}
                style={[
                  styles.customTextStyle,
                  {
                    backgroundColor:
                      dayData?.plan.length > 0 ? colors.secondary : null,
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.setMargin1}>
        <Dashed />
      </View>

      <Text style={styles.tableHeadingStyle}>Cals Out</Text>

      {data
        .sort((a, b) => parseInt(a.day, 10) - parseInt(b.day, 10))
        .map(item => {
          let calSum = 0;
          const superSetExe = item.plan.filter(
            a => a.type.toLowerCase() == 'superset',
          );

          if (superSetExe.length > 0) {
            calSum = superSetExe[0].supersetOptions.reduce(
              (sum, i) => sum + parseFloat(i.cal, 10),
              0,
            );
          }

          calSum += item.plan
            .filter(a => a.type.toLowerCase() != 'superset')
            .reduce((sum, i) => sum + parseFloat(i.cal, 10), 0);

          calCost += calSum;

          return (
            <View key={item.id} style={styles.totalItemsView}>
              {item.plan?.length > 0 && (
                <>
                  <Text style={styles.textStyle1}>Day {item.day}</Text>
                  <Text style={styles.textStyle2}>
                    {Math.round(parseFloat(calSum, 10) * 100) / 100}
                  </Text>
                </>
              )}
            </View>
          );
        })}

      <View style={styles.setMargin1}>
        <Dashed />
      </View>

      <View style={styles.totalItemsView}>
        <Text style={styles.tableHeadingStyle}>Total</Text>
        <Text style={styles.totalText}>
          {Math.round(parseFloat(calCost, 10) * 100) / 100}
        </Text>
      </View>
    </View>
  );
}

WeeklyTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  onPress: PropTypes.func.isRequired,
  tempWeek: PropTypes.string.isRequired,
};
