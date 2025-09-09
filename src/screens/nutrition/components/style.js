import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../../resources';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  headingView: {
    marginTop: RFValue(10),
    alignItems: 'center',
  },
  topTabsView: {
    marginTop: RFValue(15),
    flexDirection: 'row',
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
  typeView: {
    marginTop: RFValue(15),
    padding: RFValue(15),
    borderRadius: 12,
    backgroundColor: colors.typeBackground,
  },
  bottomTextView: {
    alignSelf: 'center',
    marginVertical: RFValue(50),
  },
  flexRowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableContainer: {
    flexDirection: 'row',
    marginTop: RFValue(20),
    marginHorizontal: RFValue(20),
    justifyContent: 'space-between',
  },
  tableContent: {
    // flex: 2.5,
    // alignItems: 'center',
  },

  headingText: {
    fontSize: RFValue(60),
    fontWeight: 'bold',
    color: colors.white,
  },
  headingText2: {
    fontSize: RFValue(35),
    fontWeight: 'bold',
    color: colors.white,
  },
  subHeading: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: colors.secondary,
  },
  subHeading1: {
    fontSize: RFValue(35),
    fontWeight: 'bold',
    color: colors.secondary,
  },
  subHeading2: {
    fontSize: RFValue(35),
    fontWeight: 'bold',
    color: colors.white,
  },
  subHeading3: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: colors.secondary,
  },
  textStyle1: {
    fontWeight: 'bold',
    fontSize: RFValue(22),
    color: colors.white,
  },
  directoryItemText: {
    fontWeight: 'normal',
    color: colors.white,
    fontSize: RFValue(16),
    marginLeft: RFValue(15),
  },
  alphaTagText: {
    color: colors.textGrey,
    fontSize: RFValue(16),
    marginLeft: 15,
  },
  typeText: {
    fontSize: RFValue(12),
    color: colors.textGrey,
  },
  itemText: {
    fontWeight: 'bold',
    color: colors.white,
    fontSize: RFValue(16),
  },
  itemText2: {
    color: colors.white,
    fontSize: RFValue(15),
    textAlign: 'right',
    marginTop: RFValue(5),
  },
  miniText: {
    fontSize: RFValue(10),
    color: colors.white,
    textAlign: 'center',
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

  setMargin: {
    marginTop: RFValue(20),
    marginHorizontal: RFValue(20),
  },
  setMargin1: {
    marginTop: RFValue(30),
    marginHorizontal: RFValue(20),
  },
  setMargin2: {
    marginTop: RFValue(20),
  },
  selectCompStyle: {
    marginTop: RFValue(15),
    marginHorizontal: 0,
  },

  separator: {
    height: '100%',
    borderWidth: 1,
    marginHorizontal: RFValue(15),
    borderColor: colors.secondaryIcon,
  },

  btnView: {
    marginTop: RFValue(40),
    marginHorizontal: RFValue(30),
  },
  btnStyle: {
    backgroundColor: colors.tertiary,
  },
  btnTitle: {
    color: colors.white,
  },

  customContainer: {
    flex: 1,
  },
});
