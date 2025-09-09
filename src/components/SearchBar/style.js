import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: RFValue(5),
    paddingHorizontal: RFValue(10),
    backgroundColor: colors.searchBarBackground,
  },
  textInputStyle: {
    flex: 1,
    height: RFValue(30),
    color: colors.white,
    fontSize: RFValue(16),
    padding: 0,
    paddingHorizontal: RFValue(10),
  },
  closeBtnStyle: {
    height: RFValue(15),
    width: RFValue(15),
    backgroundColor: colors.dullGrey,
  },
});
