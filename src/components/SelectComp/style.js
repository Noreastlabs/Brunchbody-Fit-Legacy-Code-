import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  container: {
    marginTop: RFValue(20),
    marginHorizontal: RFValue(20),
  },
  pickerView: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: RFValue(15),
    paddingVertical: RFValue(10),
    paddingLeft: RFValue(20),
    paddingRight: RFValue(10),
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    borderColor: colors.secondary,
    backgroundColor: colors.nonEditableOverlays,
  },
  titleStyle: {
    fontWeight: 'bold',
    fontSize: RFValue(20),
    color: colors.secondary,
  },
  typeStyle: {
    flex: 1,
    fontSize: RFValue(18),
    color: colors.textGrey,
  },
});
