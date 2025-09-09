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
    paddingBottom: RFValue(40),
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
  dateView: {
    marginTop: RFValue(10),
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textView: {
    marginTop: RFValue(20),
    flexDirection: 'row',
    borderWidth: RFValue(3),
    borderRadius: RFValue(30),
    borderColor: colors.secondary,
  },
  tableView: {
    marginTop: RFValue(30),
    marginHorizontal: RFValue(20),
  },
  flexRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  headingText: {
    fontSize: RFValue(60),
    fontWeight: 'bold',
    color: colors.white,
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
  textStyle1: {
    fontWeight: 'bold',
    fontSize: RFValue(25),
    color: colors.white,
  },
  textStyle2: {
    marginTop: RFValue(15),
    fontSize: RFValue(19),
    color: colors.grey,
  },
  textStyle3: {
    marginTop: RFValue(15),
    fontSize: RFValue(22),
    fontWeight: 'bold',
    color: colors.white,
  },
  dateText: {
    fontWeight: 'bold',
    fontSize: RFValue(35),
    color: colors.tertiary,
    marginHorizontal: RFValue(5),
  },
  customTextStyle: {
    margin: RFValue(-3),
    marginLeft: RFValue(10),
    paddingHorizontal: RFValue(5),
  },

  setMargin: {
    marginTop: RFValue(20),
    marginHorizontal: RFValue(20),
    alignItems: 'center',
  },
  setMargin1: {
    marginTop: RFValue(20),
    marginHorizontal: RFValue(20),
  },
  setMargin2: {
    marginTop: RFValue(20),
  },
  setMargin3: {
    margin: RFValue(-3),
  },

  separator: {
    height: '100%',
    borderWidth: 1,
    marginHorizontal: RFValue(15),
    borderColor: colors.secondaryIcon,
  },

  iconStyle: {
    color: colors.white,
  },

  lineStyle: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 1,
    // borderStyle: 'dashed',
    borderColor: colors.white,
    marginVertical: RFValue(20),
    marginHorizontal: RFValue(20),
  },

  btnView: {
    marginTop: RFValue(20),
    marginHorizontal: RFValue(30),
  },
  btnView2: {
    paddingHorizontal: RFValue(30),
    paddingVertical: RFValue(20),
    borderTopRightRadius: RFValue(10),
    borderTopLeftRadius: RFValue(10),
    backgroundColor: colors.nonEditableOverlays,
  },
});
