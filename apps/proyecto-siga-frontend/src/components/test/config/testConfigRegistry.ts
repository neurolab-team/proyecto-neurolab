import { TestConfig } from './testConfig.types';
import { dass21Config } from './tests/dass21.config';
import { hadConfig } from './tests/had.config';

const defaultConfig: TestConfig = {
  testCode: 'DEFAULT',
  displayName: 'Test',
  colors: {
    primary: '#102D69',
    primaryDark: '#102D69',
    primaryLight: '#00A0B7',
    gradientFrom: '#e0e7ff',
    gradientVia: '#ede9fe',
    gradientTo: '#dbeafe',
    selectedBg: '#102D69',
    selectedBorder: '#102D69',
    selectedText: '#ffffff',
  },
};

const registry = new Map<string, TestConfig>();
registry.set('DASS-21', dass21Config);
registry.set('HAD', hadConfig);

export function getTestConfig(testCode: string): TestConfig {
  return registry.get(testCode.toUpperCase()) ?? defaultConfig;
}
