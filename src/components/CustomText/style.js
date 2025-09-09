import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  textView: {
    maxWidth: '70%',
    minWidth: RFValue(38),
    paddingVertical: RFValue(4),
    paddingHorizontal: RFValue(15),
    borderWidth: RFValue(3),
    borderRadius: RFValue(30),
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: RFValue(18),
    color: colors.white,
    textTransform: 'uppercase',
  },
});
