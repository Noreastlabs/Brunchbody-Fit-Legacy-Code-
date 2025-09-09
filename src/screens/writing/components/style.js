import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../../resources';

export default StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: colors.mainFont,
    fontSize: 30,
  },
  text: {
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  gauge: {
    position: 'absolute',
    width: 100,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: 24,
  },

  // Time Block Styling
  timeContainer: {
    width: 330,
    alignSelf: 'center',
    marginVertical: 20,
    marginHorizontal: 40,
  },
  sleepUnfilled: {
    height: 20,
    width: 20,
    borderRadius: 100 / 2,
    borderWidth: 3,
    borderColor: colors.sleep,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    marginVertical: 3,
  },
  blockRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  textStyle: {
    color: '#fff',
    fontSize: RFValue(8),
  },
  textStyle1: {
    color: '#fff',
    fontSize: RFValue(14),
  },
  morningUnfilled: {
    height: 19,
    width: 19,
    borderRadius: 100 / 2,
    borderWidth: 2,
    borderColor: colors.morning,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    marginVertical: 3,
  },
  timeText: {
    fontSize: RFValue(35),
    fontWeight: 'bold',
    color: colors.white,
    alignSelf: 'center',
  },
  setMargin1: {
    margin: 20,
  },
  itinerariesView: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleStyle: {
    width: 20,
    height: 20,
    marginRight: 30,
    borderWidth: 3,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingView: {
    marginTop: RFValue(10),
    alignSelf: 'center',
  },
  headingText2: {
    fontSize: RFValue(35),
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
});
