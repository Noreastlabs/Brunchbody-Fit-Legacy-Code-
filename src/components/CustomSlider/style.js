import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  sliderView: {
    marginTop: RFValue(15),
  },
  flexRowView: {
    marginTop: RFValue(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textStyle2: {
    fontSize: RFValue(16),
    color: colors.grey,
    textTransform: 'capitalize',
  },
  sliderStyle: {
    flex: 1,
  },
  percentView: {
    borderRadius: RFValue(3),
    paddingVertical: RFValue(2),
    paddingHorizontal: RFValue(8),
    backgroundColor: colors.lightestGrey,
  },
  percentText: {
    fontSize: RFValue(10),
    color: colors.textGrey,
  },
});
