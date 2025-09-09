import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../resources';

export default StyleSheet.create({
  container: {
    width: '75%',
    alignSelf: 'center',
    borderRadius: RFValue(10),
    borderWidth: RFValue(3),
    backgroundColor: colors.nonEditableOverlays,
  },
  textsView: {
    marginTop: RFValue(20),
    alignItems: 'center',
  },

  textStyle1: {
    fontWeight: 'bold',
    fontSize: RFValue(18),
    color: colors.white,
  },
  textStyle2: {
    textAlign: 'center',
    fontSize: RFValue(13),
    color: colors.white,
    marginHorizontal: 10,
  },

  textInputStyle: {
    height: 25,
    alignItems: 'center',
    fontSize: RFValue(13),
    marginTop: 15,
    marginHorizontal: 20,
    paddingHorizontal: 5,
    padding: 0,
    borderRadius: 5,
    backgroundColor: colors.icon,
  },

  btnsContainer: {
    marginTop: RFValue(15),
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderColor: colors.white,
    justifyContent: 'space-evenly',
  },
  btnView: {
    flex: 1,
    paddingVertical: RFValue(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: RFValue(16),
    color: colors.white,
  },

  lineStyle: {
    borderWidth: 0.5,
    height: '100%',
    borderColor: colors.white,
  },
});
