import { ITestInterpreter } from "../contracts/interpretation/ITestInterpreter";

/**
 * Interpreter for DASS-21 (Depression, Anxiety, Stress Scale)
 * Provides interpretation logic for three sections: Depression, Anxiety, and Stress
 */
export class Dass21Interpreter implements ITestInterpreter {
  readonly testCode = "DASS-21";

  interpretSection(sectionName: string, score: number): string {
    const normalizedSection = sectionName.toLowerCase();

    // Interpretación para Depresión
    if (normalizedSection.includes("depresion")) {
      if (score < 5) return "Normal";
      if (score >= 5 && score <= 6) return "Depresion leve";
      if (score >= 7 && score <= 10) return "Depresion moderada";
      if (score >= 11 && score <= 13) return "Depresion severa";
      return "Depresion extremadamente severa";
    }

    // Interpretación para Ansiedad
    if (normalizedSection.includes("ansiedad")) {
      if (score < 4) return "Normal";
      if (score === 4) return "Ansiedad leve";
      if (score >= 5 && score <= 7) return "Ansiedad moderada";
      if (score >= 8 && score <= 9) return "Ansiedad severa";
      return "Ansiedad extremadamente severa";
    }

    // Interpretación para Estrés
    if (normalizedSection.includes("estres")) {
      if (score < 8) return "Normal";
      if (score >= 8 && score <= 9) return "Estrés leve";
      if (score >= 10 && score <= 12) return "Estrés moderado";
      if (score >= 13 && score <= 16) return "Estrés severo";
      return "Estrés extremadamente severo";
    }

    return "No interpretado";
  }
}
