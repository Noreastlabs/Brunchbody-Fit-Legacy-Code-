import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  calculationContainer: {
    borderWidth: 1,
    borderRadius: RFValue(10),
    paddingVertical: RFValue(25),
    paddingHorizontal: RFValue(15),
    borderColor: colors.secondary,
    backgroundColor: colors.nonEditableOverlays,
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
    flexDirection: 'row',
    marginTop: 15,
  },
  tableContent: {
    flex: 2.5,
    alignItems: 'center',
    left: -20,
    // marginLeft: 40,
  },
  item: {
    color: colors.white,
    fontSize: RFValue(17),
    fontWeight: 'bold',
  },
  dottedLine: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'white',
    marginTop: 25,
    borderRadius: 1,
  },
  footer: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  bodytext: {
    color: colors.white,
    fontSize: RFValue(13),
  },
  headingStyle: {
    color: colors.secondary,
    fontSize: RFValue(17),
    fontWeight: 'bold',
    marginTop: 20,
  },
});
