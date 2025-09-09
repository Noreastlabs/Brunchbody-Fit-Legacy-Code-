import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../resources';

export default StyleSheet.create({
  modalContainer: {
    margin: RFValue(2),
    paddingVertical: RFValue(20),
  },
  contentContainer: {
    borderWidth: 1,
    borderRadius: RFValue(10),
    paddingVertical: RFValue(25),
    paddingHorizontal: RFValue(15),
    borderColor: colors.secondary,
    backgroundColor: colors.background,
  },
  flexRowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: RFValue(15),
  },
  flexRowView2: {
    marginTop: RFValue(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRowView3: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowView4: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  loaderView: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    opacity: 0.6,
    borderRadius: 10,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  wheelPickerContainer: {
    borderWidth: 1,
    margin: RFValue(10),
    borderRadius: RFValue(20),
    borderColor: colors.secondary,
    backgroundColor: colors.background,
  },
  wheelPickerView: {
    marginTop: RFValue(100),
    paddingVertical: RFValue(5),
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colors.textGrey,
  },
  wheelPickerView2: {
    marginTop: RFValue(100),
    paddingVertical: RFValue(5),
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colors.textGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelPickerStyle: {
    width: '100%',
    height: RFValue(200),
    backgroundColor: colors.background,
  },
  pickerItemStyle: {
    color: colors.white,
    fontSize: RFValue(20),
  },
  pickerBtnsView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: RFValue(15),
  },

  closeBtnView: {
    alignItems: 'flex-end',
  },
  textsView: {
    marginTop: RFValue(30),
    alignItems: 'center',
  },
  modalHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectOptionsView: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  textStyle1: {
    fontWeight: 'bold',
    fontSize: RFValue(24),
    color: colors.white,
  },
  textStyle2: {
    fontWeight: 'bold',
    fontSize: RFValue(20),
    color: colors.white,
  },
  textStyle3: {
    fontWeight: 'bold',
    fontSize: RFValue(18),
    color: colors.qccentError,
  },
  subHeading: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: colors.secondary,
    marginRight: RFValue(10),
  },
  subHeading2: {
    fontSize: RFValue(20),
    color: colors.white,
  },
  optionText: {
    fontSize: RFValue(13),
    color: colors.white,
    marginLeft: RFValue(10),
  },
  confirmText: {
    fontSize: RFValue(18),
    color: colors.white,
    fontWeight: 'bold',
  },
  cancelText: {
    fontSize: RFValue(18),
    color: colors.tertiary,
  },
  cancelText2: {
    fontWeight: 'normal',
    fontSize: RFValue(15),
    color: colors.tertiary,
  },
  miniText: {
    fontSize: RFValue(13),
    color: colors.white,
  },
  mediumText: {
    fontSize: RFValue(18),
    color: colors.white,
  },
  dateText: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: RFValue(14),
    color: colors.tertiary,
    marginHorizontal: 15,
  },

  setMargin: {
    marginTop: RFValue(5),
  },
  setMargin1: {
    marginTop: RFValue(10),
  },
  setMargin2: {
    marginTop: RFValue(15),
  },
  setMargin3: {
    marginTop: RFValue(20),
  },
  selectCompStyle: {
    marginTop: RFValue(15),
    marginHorizontal: 0,
  },
  selectCompStyle2: {
    flex: 0.58,
    marginTop: 0,
    marginHorizontal: 0,
  },

  textInputStyle: {
    width: '100%',
    height: RFValue(45),
    marginTop: RFValue(15),
    borderRadius: RFValue(25),
    fontSize: RFValue(15),
    color: colors.mainFont,
    paddingHorizontal: RFValue(15),
    backgroundColor: colors.nonEditableOverlays,
  },

  btnView: {
    marginVertical: RFValue(30),
    marginHorizontal: RFValue(20),
  },
  btnView2: {
    marginTop: RFValue(40),
    marginHorizontal: RFValue(20),
  },
  bottomTextView: {
    alignSelf: 'center',
  },
  bottomTextView2: {
    marginTop: 40,
    alignSelf: 'center',
  },

  colorPicker: {
    height: RFValue(25),
    width: RFValue(25),
    marginLeft: RFValue(10),
    borderWidth: 4,
    borderRadius: RFValue(2),
    borderColor: colors.nonEditableOverlays,
  },

  lineStyle: {
    borderWidth: 1,
    borderColor: colors.nonEditableOverlays,
    marginTop: RFValue(15),
  },

  colorPickerStyle: {
    width: '100%',
    height: 350,
  },
  hexColorCodeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: RFValue(15),
    borderRadius: RFValue(3),
    paddingVertical: RFValue(3),
    paddingHorizontal: RFValue(6),
    backgroundColor: colors.nonEditableOverlays,
  },
  colorView: {
    height: RFValue(30),
    width: RFValue(28),
    marginRight: RFValue(10),
    borderRadius: RFValue(4),
  },

  textArea: {
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

  themeContainer: {
    height: RFValue(40),
    margin: RFValue(5),
    borderRadius: RFValue(25),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: RFValue(15),
  },
  themeText: {
    color: colors.white,
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },

  daysInputContainer: {
    width: '50%',
    fontSize: RFValue(16),
    color: colors.white,
    marginTop: RFValue(15),
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingHorizontal: 20,
    borderColor: colors.secondary,
    backgroundColor: colors.nonEditableOverlays,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
