import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  tableContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  tableContainer2: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
  bodytext: {
    color: colors.white,
    fontSize: RFValue(14),
  },
  bodytext2: {
    color: colors.white,
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
  itemHeading: {
    color: colors.white,
    fontSize: RFValue(14),
  },
  setMargin: {
    marginTop: RFValue(15),
  },
  setMargin2: {
    marginTop: RFValue(20),
  },
  setMargin3: {
    marginTop: 40,
    marginBottom: 20,
  },
});
