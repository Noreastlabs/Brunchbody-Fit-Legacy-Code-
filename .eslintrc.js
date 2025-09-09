module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['prettier', 'import'],
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'prettier/prettier': 'off',
    'import/prefer-default-export': 'off',
  },
};
