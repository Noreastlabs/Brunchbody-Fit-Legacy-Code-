import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  setMargin: {
    marginTop: RFValue(20),
    marginHorizontal: RFValue(20),
  },
  contentStyle: {
    fontSize: RFValue(10),
    color: colors.white,
  },
  textArea: {
    flex: 1,
    height: RFValue(150),
    fontSize: RFValue(15),
    marginTop: RFValue(15),
    color: colors.mainFont,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.secondary,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    backgroundColor: colors.nonEditableOverlays,
  },
  radioBtnView: {
    marginTop: RFValue(15),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  radioBtns: {
    alignItems: 'center',
  },
  label: {
    color: colors.white,
  },
});
