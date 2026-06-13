import PropTypes from 'prop-types';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const DEFAULT_ADAPTIVE_MAX_WIDTH = 720;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export const getAdaptiveContentStyle = ({
  width,
  maxContentWidth = DEFAULT_ADAPTIVE_MAX_WIDTH,
} = {}) => {
  const numericWidth = Number(width);
  const numericMaxWidth = Number(maxContentWidth);

  if (
    !Number.isFinite(numericWidth) ||
    !Number.isFinite(numericMaxWidth) ||
    numericMaxWidth <= 0 ||
    numericWidth <= numericMaxWidth
  ) {
    return {flex: 1, width: '100%'};
  }

  return {
    flex: 1,
    width: numericMaxWidth,
    alignSelf: 'center',
  };
};

export default function SafeAreaWrapper({
  children,
  contentStyle,
  style,
  backgroundColor = '#000000',
  maxContentWidth = DEFAULT_ADAPTIVE_MAX_WIDTH,
}) {
  const {width} = useWindowDimensions();
  const backgroundStyle = {backgroundColor};

  return (
    <SafeAreaView style={[styles.safeArea, backgroundStyle, style]}>
      {/* <StatusBar 
        barStyle="light-content" 
        backgroundColor={backgroundColor}
        translucent={true}
      /> */}
      <View
        style={[
          getAdaptiveContentStyle({width, maxContentWidth}),
          contentStyle,
        ]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

SafeAreaWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  contentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  backgroundColor: PropTypes.string,
  maxContentWidth: PropTypes.number,
};
