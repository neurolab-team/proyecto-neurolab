import { injectable } from "tsyringe";
import { ITestInterpreter } from "../../contracts/interpretation/ITestInterpreter";
import { Dass21Interpreter } from "../../interpreters/Dass21Interpreter";
import { HadInterpreter } from "../../interpreters/HadIntrpreter";
import { PsqiInterpreter } from "../../interpreters/PsqiInterpreter";
import { EpworthInterpreter } from "../../interpreters/EpworthInterpreter";

@injectable()
export class InterpretationFactory {
  private interpreters: Map<string, ITestInterpreter>;

  constructor() {
    this.interpreters = new Map();
    this.registerDefaultInterpreters();
  }

  /**
   * Registers the default interpreters on initialization
   */
  private registerDefaultInterpreters(): void {
    this.register("DASS-21", new Dass21Interpreter());
    this.register("HAD", new HadInterpreter());
    this.register("PSQI", new PsqiInterpreter());
    this.register("EPWORTH", new EpworthInterpreter());
    // Register more interpreters here as they are created:
    // this.register("PHQ-9", new Phq9Interpreter());
  }

  register(testCode: string, interpreter: ITestInterpreter): void {
    this.interpreters.set(testCode.toUpperCase(), interpreter);
  }

  getInterpreter(testCode: string): ITestInterpreter | undefined {
    return this.interpreters.get(testCode.toUpperCase());
  }

  hasInterpreter(testCode: string): boolean {
    return this.interpreters.has(testCode.toUpperCase());
  }
}
