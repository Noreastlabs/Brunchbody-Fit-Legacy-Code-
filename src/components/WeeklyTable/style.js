import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  weekDaysView: {
    marginTop: RFValue(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalItemsView: {
    marginTop: RFValue(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleStyle: {
    fontWeight: 'bold',
    fontSize: RFValue(25),
    color: colors.white,
    textAlign: 'center',
  },
  customTextStyle: {
    paddingHorizontal: RFValue(4),
  },
  tableHeadingStyle: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: colors.secondary,
    alignSelf: 'flex-end',
  },
  textStyle1: {
    fontSize: RFValue(18),
    color: colors.white,
  },
  textStyle2: {
    fontSize: RFValue(16),
    color: colors.grey,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: RFValue(18),
    color: colors.white,
  },

  setMargin1: {
    marginVertical: RFValue(20),
  },
});
