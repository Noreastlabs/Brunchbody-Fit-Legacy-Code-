/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);  
jest.mock('react-native-responsive-fontsize', () => ({
  RFValue: value => value,
  RFPercentage: value => value,
}));

jest.mock('react-native-vector-icons/Feather', () => 'Feather');
jest.mock('react-native-dashed-line', () => 'DashedLine');
jest.mock('react-native-wheel-pick', () => 'WheelPicker');
jest.mock('react-native-wheel-color-picker', () => 'WheelColorPicker');
jest.mock('react-native-reanimated/lib/typescript/Colors', () => ({ clampRGBA: jest.fn() }), { virtual: true });
jest.mock('react-native-swiper', () => 'Swiper');
jest.mock('react-native-chart-kit', () => ({ LineChart: 'LineChart' }));
jest.mock('@react-navigation/core', () => ({ useFocusEffect: jest.fn() }));
jest.mock('react-native-scoped-storage', () => ({ createDocumentFile: jest.fn() }));
jest.mock('react-native-fs', () => ({}));
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));
jest.mock('react-native-calendars', () => ({ Calendar: 'Calendar' }));
