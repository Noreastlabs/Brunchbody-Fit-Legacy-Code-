import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  flexRowView2: {
    marginTop: RFValue(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subHeading: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: colors.secondary,
    marginRight: RFValue(10),
  },
  mediumText: {
    fontSize: RFValue(18),
    color: colors.white,
  },
  setMargin3: {
    marginTop: RFValue(20),
  },
  selectCompStyle: {
    marginTop: RFValue(15),
    marginHorizontal: 0,
  },
  selectCompStyle2: {
    flex: 0.58,
    marginTop: 0,
    marginHorizontal: 0,
  },
  textInputStyle: {
    width: '100%',
    height: RFValue(45),
    marginTop: RFValue(15),
    borderRadius: RFValue(25),
    fontSize: RFValue(15),
    color: colors.mainFont,
    paddingHorizontal: RFValue(15),
    backgroundColor: colors.nonEditableOverlays,
  },
});
