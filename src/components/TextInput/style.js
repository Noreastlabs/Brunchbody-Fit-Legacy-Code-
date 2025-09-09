import {StyleSheet} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

export default StyleSheet.create({
  col: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    margin: 8,
  },

  TextInput: {
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderRadius: 30,
    marginBottom: 10,
    width: RFPercentage(40),
    height: RFPercentage(6),
    paddingHorizontal: 8,
  },
});
