const mockSettingWrapper = () => null;
const mockMyProfileWrapper = () => null;
const mockExportToCSVWrapper = () => null;
const mockTermsOfUseWrapper = () => null;
const mockAbbrevationsWrapper = () => null;
const mockPrivacyPolicyWrapper = () => null;
const mockTutorialsWrapper = () => null;

jest.mock('../src/screens/setting/pages/Setting', () => ({
  __esModule: true,
  SettingWrapper: mockSettingWrapper,
}));

jest.mock('../src/screens/setting/pages/MyProfile', () => ({
  __esModule: true,
  MyProfileWrapper: mockMyProfileWrapper,
}));

jest.mock('../src/screens/setting/pages/Export To CSV', () => ({
  __esModule: true,
  ExportToCSVWrapper: mockExportToCSVWrapper,
}));

jest.mock('../src/screens/setting/pages/TermsOfUse', () => ({
  __esModule: true,
  TermsOfUseWrapper: mockTermsOfUseWrapper,
}));

jest.mock('../src/screens/setting/pages/Abbrevations', () => ({
  __esModule: true,
  AbbrevationsWrapper: mockAbbrevationsWrapper,
}));

jest.mock('../src/screens/setting/pages/PrivacyPolicy', () => ({
  __esModule: true,
  PrivacyPolicyWrapper: mockPrivacyPolicyWrapper,
}));

jest.mock('../src/screens/setting/pages/Tutorials', () => ({
  __esModule: true,
  TutorialsWrapper: mockTutorialsWrapper,
}));

describe('Settings Tutorials ownership cleanup', () => {
  test('settings barrel re-exports TutorialsWrapper from the Tutorials page entry', () => {
    const settingsModule = require('../src/screens/setting');

    expect(settingsModule.TutorialsWrapper).toBe(mockTutorialsWrapper);
  });
});
