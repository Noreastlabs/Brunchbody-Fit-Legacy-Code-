import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../../resources';

export default StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
  },

  dateView: {
    marginTop: RFValue(10),
    marginBottom: RFValue(25),
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  listView: {
    marginBottom: RFValue(15),
    marginHorizontal: RFValue(20),
  },
  linkView: {
    marginTop: RFValue(15),
  },
  btnView: {
    marginTop: RFValue(50),
    marginHorizontal: RFValue(30),
  },
  bottomTextView: {
    alignSelf: 'center',
    marginVertical: RFValue(50),
  },
  flexRowView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRowView2: {
    marginTop: RFValue(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapItemView: {
    width: '31%',
    alignItems: 'center',
  },
  directoryItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginLeft: RFValue(20),
    borderBottomWidth: 0.5,
    borderBottomColor: colors.white,
  },
  alphaTagView: {
    paddingVertical: RFValue(2),
    backgroundColor: colors.nonEditableOverlays,
  },
  headingView: {
    alignSelf: 'center',
  },
  headingText1: {
    fontSize: RFValue(60),
    fontWeight: 'bold',
    color: colors.white,
  },
  headingText2: {
    fontSize: RFValue(35),
    fontWeight: 'bold',
    color: colors.white,
  },
  headingText3: {
    fontSize: RFValue(20),
    color: colors.white,
  },
  dateText: {
    fontWeight: 'bold',
    fontSize: RFValue(35),
    color: colors.tertiary,
    marginHorizontal: RFValue(5),
  },
  contentStyle: {
    fontSize: RFValue(10),
    color: colors.white,
  },
  contentStyle2: {
    flex: 0.9,
    fontSize: RFValue(10),
    color: colors.tertiary,
  },
  boldText: {
    fontSize: RFValue(12),
    color: colors.white,
    fontWeight: 'bold',
  },
  boldText2: {
    fontSize: RFValue(12),
    color: colors.secondary,
    fontWeight: 'bold',
  },
  textStyle1: {
    fontWeight: 'bold',
    fontSize: RFValue(20),
    color: colors.white,
  },
  textStyle2: {
    fontSize: RFValue(16),
    color: colors.tertiary,
  },
  textStyle3: {
    fontWeight: 'bold',
    fontSize: RFValue(18),
    color: colors.qccentError,
  },
  directoryItemText: {
    fontWeight: 'normal',
    color: colors.white,
    fontSize: RFValue(16),
    marginLeft: 15,
  },
  alphaTagText: {
    color: colors.textGrey,
    fontSize: RFValue(16),
    marginLeft: 15,
  },

  iconStyle: {
    color: colors.white,
  },
  setMargin: {
    marginTop: RFValue(20),
    marginHorizontal: RFValue(20),
  },
  setMargin1: {
    marginTop: RFValue(25),
    marginHorizontal: RFValue(20),
  },
  setMargin2: {
    marginTop: RFValue(10),
  },
  setMargin3: {
    marginTop: RFValue(20),
  },

  textInputStyle: {
    width: '100%',
    height: RFValue(45),
    borderRadius: RFValue(25),
    fontSize: RFValue(15),
    color: colors.mainFont,
    marginTop: RFValue(15),
    paddingHorizontal: RFValue(15),
    backgroundColor: colors.nonEditableOverlays,
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

  btnsView: {
    marginTop: RFValue(15),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  btnStyle: {
    height: RFValue(40),
    margin: RFValue(5),
    paddingHorizontal: RFValue(15),
  },
  btnStyle2: {
    height: RFValue(45),
    marginTop: RFValue(15),
    paddingHorizontal: RFValue(15),
    alignSelf: 'flex-start',
  },
  btnTitle: {
    color: colors.white,
    fontSize: RFValue(18),
  },
});
