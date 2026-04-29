import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../../../resources';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: RFValue(20),
    backgroundColor: colors.background,
  },
  headingView: {
    alignSelf: 'center',
  },
  contentView: {
    marginHorizontal: RFValue(20),
    paddingVertical: RFValue(12),
  },
  headingText1: {
    fontSize: RFValue(40),
    fontWeight: 'bold',
    color: colors.white,
  },
  bodyText: {
    fontSize: RFValue(18),
    lineHeight: RFValue(25),
    marginBottom: RFValue(14),
    color: colors.white,
  },
  sectionHeadingText: {
    fontSize: RFValue(24),
    fontWeight: 'bold',
    lineHeight: RFValue(30),
    marginTop: RFValue(8),
    marginBottom: RFValue(12),
    color: colors.white,
  },
});
