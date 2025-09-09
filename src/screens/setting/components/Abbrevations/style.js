import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../../../resources';

export default StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingBottom: RFValue(20),
    backgroundColor: colors.background,
  },
  headingView: {
    alignSelf: 'center',
  },

  headingText: {
    fontSize: RFValue(40),
    fontWeight: 'bold',
    color: colors.white,
  },
  textStyle: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    padding: 3,
  },
});
