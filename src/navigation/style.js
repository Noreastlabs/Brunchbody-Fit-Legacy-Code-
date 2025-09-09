import {StyleSheet} from 'react-native';
import {colors} from '../resources';

export default StyleSheet.create({
  headerStyle: {
    height: 80,
    backgroundColor: colors.background,
    elevation: 0,
  },
  headerMain: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  headerSecondary: {
    fontSize: 30,
  },
});
