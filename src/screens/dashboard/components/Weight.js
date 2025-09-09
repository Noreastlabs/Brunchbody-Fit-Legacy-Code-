import React from 'react';
import {Dimensions, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {LineChart} from 'react-native-chart-kit';
import PropTypes from 'prop-types';
import style from './style';
import {colors} from '../../../resources';

const screenWidth = Dimensions.get('window').width - 15;

const chartConfig = {
  backgroundColor: colors.grey,
  decimalPlaces: 2,
  color: () => colors.nonEditableOverlays,
  propsForBackgroundLines: {
    strokeDasharray: '',
    // strokeWidth: 0,
  },
};

const Weight = ({data}) => (
  <View>
    <LineChart
      data={data}
      width={screenWidth - 12}
      height={RFPercentage(35)}
      withVerticalLines={false}
      segments={2} // For horizontal lines
      chartConfig={chartConfig}
      style={style.lineChart}
    />
  </View>
);

Weight.defaultProps = {
  data: {},
};

Weight.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
};

export default Weight;
