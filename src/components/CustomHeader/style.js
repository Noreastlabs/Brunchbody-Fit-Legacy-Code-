import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../resources';

export default StyleSheet.create({
  headerStyle: {
    marginTop: RFValue(10),
    marginHorizontal: RFValue(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  iconStyle: {
    color: colors.white,
  },
  textStyle: {
    fontSize: RFValue(16),
    color: colors.tertiary,
  },
});
