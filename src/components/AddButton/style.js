import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  plusIconView: {
    height: RFValue(30),
    width: RFValue(30),
    marginTop: RFValue(15),
    borderRadius: RFValue(15),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightestGrey,
  },
  iconStyle: {
    color: colors.white,
  },
});
