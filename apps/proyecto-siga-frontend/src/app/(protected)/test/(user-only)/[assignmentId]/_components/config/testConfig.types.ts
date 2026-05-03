export interface TestConfig {
  testCode: string;
  displayName: string;
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    gradientFrom: string;
    gradientVia: string;
    gradientTo: string;
    selectedBg: string;
    selectedBorder: string;
    selectedText: string;
  };
}
