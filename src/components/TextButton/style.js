import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle1: {
    fontWeight: 'bold',
    fontSize: RFValue(18),
    color: colors.qccentError,
  },
});
