import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  setMargin: {
    marginTop: RFValue(20),
    marginHorizontal: RFValue(20),
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: RFValue(22),
    color: colors.white,
  },
  btnsView: {
    marginTop: RFValue(15),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  btnStyle: {
    height: RFValue(40),
    margin: RFValue(5),
    borderRadius: RFValue(25),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: RFValue(15),
  },
  btnStyleWithBorder: {
    height: RFValue(40),
    margin: RFValue(5),
    borderRadius: RFValue(25),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: RFValue(15),
    borderWidth: 3,
    borderColor: colors.white,
  },
  btnTitle: {
    color: colors.white,
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
  closeBtnView: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  closeBtnStyle: {
    height: RFValue(20),
    width: RFValue(20),
  },
});
