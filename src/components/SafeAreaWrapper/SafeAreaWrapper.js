import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SafeAreaWrapper({ children, style, backgroundColor = '#000000' }) {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor }, style]}>
      {/* <StatusBar 
        barStyle="light-content" 
        backgroundColor={backgroundColor}
        translucent={true}
      /> */}
      {children}
    </SafeAreaView>
  );
}

SafeAreaWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  backgroundColor: PropTypes.string,
};
