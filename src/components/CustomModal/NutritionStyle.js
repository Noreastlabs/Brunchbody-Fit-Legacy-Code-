import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: RFValue(10),
    paddingVertical: RFValue(25),
    paddingHorizontal: RFValue(15),
    borderColor: colors.secondary,
    backgroundColor: colors.nonEditableOverlays,
  },
  headingStyle: {
    color: colors.white,
    fontSize: RFValue(24),
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: colors.secondary,
  },
  title: {
    color: colors.white,
    fontSize: RFValue(24),
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  crossButton: {
    backgroundColor: colors.white,
    height: 22,
    width: 22,
    borderRadius: 22,
  },
  tableContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  tableItem: {
    flex: 2,
  },
  tableContent: {
    flex: 2,
    alignItems: 'center',
    left: 15,
  },
  item: {
    color: colors.secondary,
    fontSize: RFValue(17),
    fontWeight: 'bold',
  },
  bodytext: {
    color: colors.white,
    fontSize: RFValue(13),
  },
  bodytext2: {
    color: colors.white,
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  itemHeading: {
    color: colors.white,
    fontSize: RFValue(13),
  },
  btnView: {
    marginTop: RFValue(35),
    marginHorizontal: RFValue(20),
  },
  btnView2: {
    marginTop: RFValue(40),
    marginHorizontal: RFValue(20),
  },
  setMargin: {
    marginTop: RFValue(15),
  },
  setMargin2: {
    marginTop: 25,
  },
  bottomTextView: {
    marginTop: RFValue(35),
  },

  totalItemsView2: {
    marginTop: 25,
    width: '60%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableHeadingStyle: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: colors.secondary,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: RFValue(17),
    color: colors.white,
  },

  eventTimeView: {
    marginTop: RFValue(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTimeText: {
    color: colors.grey,
    fontSize: RFValue(13),
    marginLeft: 20,
  },
  noteText: {
    color: colors.white,
    fontSize: RFValue(18),
  },
  restingTextStyle: {
    marginTop: 20,
    color: colors.secondary,
    fontSize: RFValue(20),
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
