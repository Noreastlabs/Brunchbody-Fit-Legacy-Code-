module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@reduxjs|redux-persist|immer|react-native-gesture-handler|react-native-vector-icons|react-native-swiper|react-native-chart-kit|react-native-calendars|react-native-dashed-line|react-native-wheel-pick|react-native-wheel-color-picker|react-native-scoped-storage|react-native-fs|react-redux)/)',
  ],
};
