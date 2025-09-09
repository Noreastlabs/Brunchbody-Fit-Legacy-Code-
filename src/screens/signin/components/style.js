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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  logoView: {
    marginVertical: RFValue(50),
  },

  col: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: colors.mainFont,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    margin: 8,
    paddingHorizontal: 8,
  },

  TextInput: {
    backgroundColor: colors.nonEditableOverlays,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderRadius: 30,
    marginBottom: 10,
    width: RFPercentage(40),
    height: RFValue(40),
    color: colors.mainFont,
    fontSize: RFValue(14),
    paddingHorizontal: 10,
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

  loginBtn: {
    backgroundColor: colors.secondary,
  },

  accBtn: {
    backgroundColor: colors.mainFont,
  },

  loginText: {
    color: colors.mainFont,
    fontWeight: 'bold',
    fontSize: RFValue(13),
  },

  accText: {
    color: colors.secondary,
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

  forgotPassword: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.qccentError,
  },

  bottomTextView: {
    alignSelf: 'center',
    marginVertical: RFValue(50),
  },
  socialLoaderContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
