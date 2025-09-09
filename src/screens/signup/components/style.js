import {StyleSheet} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../../resources';

export default StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  logoView: {
    marginVertical: RFValue(50),
  },

  image: {
    flex: 1,
    width: RFPercentage(65),
  },

  col: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    marginLeft: -260,
    color: colors.mainFont,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  TextInput: {
    backgroundColor: colors.nonEditableOverlays,
    borderRadius: 30,
    marginBottom: 30,
    width: RFPercentage(40),
    height: RFValue(40),
    color: colors.mainFont,
    fontSize: RFValue(14),
    paddingHorizontal: 10,
    textAlign: 'center',
    paddingVertical: 0,
  },

  btn: {
    width: RFPercentage(25),
    borderRadius: 25,
    height: RFPercentage(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  accBtn: {
    backgroundColor: colors.secondary,
  },

  loginText: {
    color: colors.mainFont,
    fontWeight: 'bold',
  },

  accText: {
    color: colors.mainFont,
    fontWeight: 'bold',
    fontSize: RFValue(13),
  },

  orView: {
    alignItems: 'center',
  },

  or: {
    marginTop: 25,
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: colors.secondary,
  },

  otherOpt: {
    marginVertical: 25,
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: colors.mainFont,
  },

  facebook: {
    color: colors.tertiary,
  },

  google: {
    color: colors.qccentError,
  },

  logoBtn: {
    flexDirection: 'row',
  },

  bottomTextView: {
    marginTop: 40,
    marginHorizontal: 50,
  },
  bottomTextStyle: {
    fontSize: RFValue(12),
    color: colors.dullGrey,
    textAlign: 'center',
  },
  linkedTextStyle: {
    color: 'gray',
    textDecorationLine: 'underline',
  },

  cancelBtnView: {
    alignSelf: 'center',
    marginVertical: 40,
  },
});
