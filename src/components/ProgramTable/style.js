import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  totalItemsView: {
    marginTop: RFValue(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalItemsView1: {
    marginHorizontal: -12,
    marginTop: RFValue(15),
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.white,
  },
  totalItemsView2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRowView: {
    marginTop: RFValue(15),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tableHeadingStyle: {
    width: '20%',
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: colors.secondary,
  },
  textStyle: {
    width: '40%',
    fontSize: RFValue(16),
  },
  textStyle2: {
    width: '20%',
    fontSize: RFValue(16),
    color: colors.white,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: RFValue(17),
    color: colors.white,
  },
  noteHeading: {
    fontSize: RFValue(18),
  },
  noteText: {
    marginLeft: RFValue(5),
    fontSize: RFValue(18),
    color: colors.white,
  },
  setMargin1: {
    marginVertical: RFValue(20),
  },
});
