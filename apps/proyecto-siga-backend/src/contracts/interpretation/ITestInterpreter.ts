export interface ITestInterpreter {
  interpretSection(sectionName: string, score: number): string;

  readonly testCode?: string;
}
