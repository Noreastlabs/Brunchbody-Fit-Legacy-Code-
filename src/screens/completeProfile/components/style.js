import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../../resources';

export default StyleSheet.create({
  nameContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    paddingVertical: RFValue(20),
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: 17,
    textAlign: 'center',
  },
  nameInputContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: RFValue(50),
    paddingHorizontal: RFValue(30),
    // marginTop: -150,
    // justifyContent: 'center',
    // marginLeft: 100
  },

  pickerStyle: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
  },

  textInput: {
    backgroundColor: colors.nonEditableOverlays,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderRadius: 30,
    // width: 250,
    // height: 50,
    marginTop: 20,
    // paddingLeft: 70,
    // paddingRight: 50,
    color: colors.white,
    fontSize: 18,
    textAlign: 'center',
  },

  placeholder: {
    color: colors.white,
    textAlign: 'center',
  },

  button: {
    width: 200,
    height: 50,
    marginTop: 30,
    color: colors.secondary,
  },

  radioBtnContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  genderText: {
    fontSize: RFValue(12),
    color: colors.white,
    marginRight: 20,
  },

  heightDropdownContainer: {
    marginHorizontal: 120,
    justifyContent: 'center',
  },

  dataSelectionNote: {
    marginTop: 14,
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },

  tutorial: {
    textTransform: 'uppercase',
    color: colors.white,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
  },

  click: {
    textTransform: 'uppercase',
    color: colors.secondary,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
  },

  welcomeText: {
    marginTop: 40,
  },

  container: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  picker: {
    width: 200,
    height: 65,
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: 'white',
    color: 'white',
  },

  heightPickerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heightPicker: {
    width: 100,
    height: 220,
    backgroundColor: 'transparent',
  },

  heightUnitText: {
    color: 'white',
    fontSize: RFValue(18),
  },

  arrowIcon: {
    marginLeft: 5,
  },

  text12: {
    color: 'black',
  },

  dropdownInput: {
    width: 300,
    height: 60,
    // flex: 0.5,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.nonEditableOverlays,
    // borderTopRightRadius: 30,
    // borderTopLeftRadius: 30,
    borderRadius: 30,
  },

  input: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: colors.nonEditableOverlays,
    borderRadius: 30,
    // height: 40,
    // marginTop: 10,
    // paddingLeft: 80,
    // paddingRight: 50,
    color: colors.white,
    fontSize: RFValue(16),
    // marginLeft: 100,
  },

  modalWrapper: {
    backgroundColor: colors.blackTransparent,
    flex: 1,
    justifyContent: 'center',
  },
  modal: {
    borderWidth: 1,
    borderColor: colors.secondary,
    backgroundColor: colors.nonEditableOverlays,
    margin: 40,
    borderRadius: 20,
    flex: 0.5,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    color: colors.black,
    fontWeight: '700',
    marginTop: 45,
  },
  okBtn: {
    width: '50%',
    borderRadius: 25,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: colors.secondary,
  },
  okText: {
    color: colors.mainFont,
    fontWeight: 'bold',
    fontSize: 20,
  },
  accText: {
    color: colors.mainFont,
    fontWeight: 'bold',
    fontSize: RFValue(14),
  },
  accBtn: {
    width: '55%',
    borderRadius: 25,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    alignSelf: 'center',
    backgroundColor: colors.secondary,
  },

  testText: {
    color: 'white',
  },

  headerStyle: {
    marginTop: RFValue(20),
    marginHorizontal: RFValue(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
});
