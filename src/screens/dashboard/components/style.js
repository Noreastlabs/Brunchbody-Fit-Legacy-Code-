import { StyleSheet } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../../resources';

export default StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  text: {
    textAlign: 'center',
  },
  headingView: {
    alignSelf: 'center',
  },
  headingText1: {
    fontSize: RFValue(60),
    fontWeight: 'bold',
    color: colors.white,
  },
  activityIndicatorContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'black',
    opacity: 0.8,
  },
  carouselContainer: {
    borderWidth: 3,
    borderRadius: 20,
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderColor: colors.nonEditableOverlays,
  },
  carouselView: {
    flex: 1,
    marginTop: 15,
    alignSelf: 'center',
  },
  headerStyle: {
    height: 80,
    backgroundColor: colors.background,
    elevation: 0,
  },
  headerTitleStyle: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  indicatorStyle: {
    backgroundColor: colors.secondary,
  },
  labelStyle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  background: {
    backgroundColor: colors.background,
  },
  safeArea: {
    backgroundColor: colors.background,
    height: RFPercentage(50),
  },
  carousel: {
    height: RFPercentage(40),
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 8,
  },
  lineChart: {
    borderRadius: 20,
    borderWidth: 3,
    backgroundColor: colors.background,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  row: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  detailsText: {
    fontSize: RFValue(25),
    fontWeight: 'bold',
    color: colors.mainFont,
  },
  day: {
    borderWidth: 2,
    borderRadius: 30,
    borderStyle: 'dashed',
    marginTop: 6,
    paddingVertical: 5,
    marginHorizontal: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.secondary,
  },
  dotStyle: {
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: colors.nonEditableOverlays,
  },
  activeDotStyle: {
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: colors.mainFont,
  },
  slide1: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  slide2: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  slide3: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  textSwiper: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  themeContainer: {
    height: RFValue(40),
    margin: RFValue(5),
    borderRadius: RFValue(25),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: RFValue(15),
  },
  themeText: {
    color: colors.white,
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
  emptyDayView: {
    borderWidth: 2,
    borderRadius: 30,
    borderStyle: 'dashed',
    paddingVertical: 3,
    marginHorizontal: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.secondary,
  },
  emptyDayText: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: colors.white,
  },
});
