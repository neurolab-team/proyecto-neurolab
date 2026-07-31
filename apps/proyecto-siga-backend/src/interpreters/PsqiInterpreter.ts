import { AttentionLevel, SectionScore } from "@packages/common-types/assignmentScore.types";
import { IRawAnswerInterpreter } from "../contracts/interpretation/ITestInterpreter";
import { AnswerWithDetails } from "../contracts/answer/answer.types";
import { parseTime12h } from "./shared/timeUtils";

export class PsqiInterpreter implements IRawAnswerInterpreter {
  readonly testCode = "PSQI";

  calculateFromAnswers(answers: AnswerWithDetails[]): {
    sectionScores: SectionScore[];
    totalScore: number;
    attentionLevel: AttentionLevel;
  } {
    const byCode = new Map<string, AnswerWithDetails>();
    for (const a of answers) {
      if (a.question?.code) byCode.set(a.question.code, a);
    }

    const score = (code: string) => byCode.get(code)?.option?.scoreValue?.toNumber() ?? 0;
    const text = (code: string) => byCode.get(code)?.textValue ?? "";

    // C1: Calidad subjetiva del sueño (PSQI-2)
    const c1 = score("PSQI-2");

    // C2: Latencia del sueño (PSQI-2 scoreValue + PSQI-6.1 scoreValue)
    const c2Raw = score("PSQI-2") + score("PSQI-6.1");
    const c2 = c2Raw === 0 ? 0 : c2Raw <= 2 ? 1 : c2Raw <= 4 ? 2 : 3;

    // C3: Duración del sueño (PSQI-5 numeric hours)
    const rawHours = text("PSQI-5");
    const hoursSlept = rawHours ? parseFloat(rawHours) : NaN;
    const c3 = isNaN(hoursSlept) ? 0 : hoursSlept > 7 ? 0 : hoursSlept >= 6 ? 1 : hoursSlept >= 5 ? 2 : 3;

    // C4: Eficiencia habitual del sueño
    const bedtime = parseTime12h(text("PSQI-1"));
    const wakeTime = parseTime12h(text("PSQI-3"));
    const hoursInBed = this.calcHoursInBed(bedtime, wakeTime);
    const efficiency = hoursInBed > 0 && !isNaN(hoursSlept) ? (hoursSlept / hoursInBed) * 100 : NaN;
    const c4 = isNaN(efficiency) ? 0 : efficiency > 85 ? 0 : efficiency >= 75 ? 1 : efficiency >= 65 ? 2 : 3;

    // C5: Perturbaciones del sueño (sum of PSQI-6.1 to PSQI-6.9)
    const sleepDisturbCodes = ["PSQI-6.1", "PSQI-6.2", "PSQI-6.3", "PSQI-6.4", "PSQI-6.5", "PSQI-6.6", "PSQI-6.7", "PSQI-6.8", "PSQI-6.9"];
    const c5Raw = sleepDisturbCodes.reduce((sum, code) => sum + score(code), 0);
    const c5 = c5Raw === 0 ? 0 : c5Raw <= 9 ? 1 : c5Raw <= 18 ? 2 : 3;

    // C6: Uso de medicación para dormir (PSQI-8)
    const c6 = score("PSQI-8");

    // C7: Disfunción diurna (PSQI-9 + PSQI-10)
    const c7Raw = score("PSQI-9") + score("PSQI-10");
    const c7 = c7Raw === 0 ? 0 : c7Raw <= 2 ? 1 : c7Raw <= 4 ? 2 : 3;

    const components = [
      { name: "C1 - Calidad subjetiva del sueño", score: c1 },
      { name: "C2 - Latencia del sueño", score: c2 },
      { name: "C3 - Duración del sueño", score: c3 },
      { name: "C4 - Eficiencia habitual del sueño", score: c4 },
      { name: "C5 - Perturbaciones del sueño", score: c5 },
      { name: "C6 - Uso de medicación para dormir", score: c6 },
      { name: "C7 - Disfunción diurna", score: c7 },
    ];

    const totalScore = components.reduce((sum, c) => sum + c.score, 0);
    const { interpretation, attentionLevel } = this.interpretTotal(totalScore);

    // const sectionScores: SectionScore[] = components.map((c) => ({
    //   sectionName: c.name,
    //   totalScore: c.score,
    //   interpretation: c.score === 0 ? "Sin dificultad" : c.score === 1 ? "Leve" : c.score === 2 ? "Moderada" : "Severa",
    //   attentionLevel: (c.score <= 1 ? "none" : c.score === 2 ? "medium" : "high") as AttentionLevel,
    // }));
    const sectionScores: SectionScore[] = [{
      sectionName: "Puntuacion Global Calidad de Sueño de Pittsburgh",
      totalScore,
      interpretation,
      attentionLevel
    }]

    // Add overall interpretation as context
    // sectionScores.push({
    //   sectionName: "Puntuación Global PSQI",
    //   totalScore,
    //   interpretation,
    //   attentionLevel,
    // });

    return { sectionScores, totalScore, attentionLevel };
  }

  protected interpretTotal(total: number): { interpretation: string; attentionLevel: AttentionLevel } {
    if (total < 5) return { interpretation: "Sin problemas de sueño", attentionLevel: "none" };
    if (total < 8) return { interpretation: "Merece atención médica", attentionLevel: "low" };
    if (total < 15) return { interpretation: "Merece atención y tratamiento médico", attentionLevel: "medium" };
    return { interpretation: "Se trata de un problema de sueño", attentionLevel: "high" };
  }

  protected calcHoursInBed(
    bedtime: { hours: number; minutes: number } | null,
    wakeTime: { hours: number; minutes: number } | null,
  ): number {
    if (!bedtime || !wakeTime) return 0;
    const bedMinutes = bedtime.hours * 60 + bedtime.minutes;
    const wakeMinutes = wakeTime.hours * 60 + wakeTime.minutes;
    // Handle overnight (e.g. 11PM to 7AM)
    let diff = wakeMinutes - bedMinutes;
    if (diff <= 0) diff += 24 * 60;
    return diff / 60;
  }
}
