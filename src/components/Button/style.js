import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  container: {
    height: RFValue(45),
    borderRadius: RFValue(25),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
  },
  textStyle1: {
    fontWeight: 'bold',
    fontSize: RFValue(22),
    color: colors.background,
  },
});
