import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  btnContainer: {
    height: RFValue(28),
    width: RFValue(28),
    borderRadius: RFValue(15),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.nonEditableOverlays,
  },
});
