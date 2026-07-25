import { AttentionLevel, SectionScore } from "@packages/common-types/assignmentScore.types";
import { IRawAnswerInterpreter } from "../contracts/interpretation/ITestInterpreter";
import { AnswerWithDetails } from "../contracts/answer/answer.types";
import { parseTime12h } from "./shared/timeUtils";

export class MunichInterpreter implements IRawAnswerInterpreter {
  readonly testCode = "MUNICH";

  calculateFromAnswers(answers: AnswerWithDetails[]): {
    sectionScores: SectionScore[];
    totalScore: number;
    attentionLevel: AttentionLevel;
  } {
    const byCode = new Map<string, AnswerWithDetails>();
    for (const a of answers) {
      if (a.question?.code) byCode.set(a.question.code, a);
    }

    const text = (code: string) => byCode.get(code)?.textValue ?? "";

    // Duración laboral:
    const wakeLaboral = parseTime12h(text("MUNICH-4"));
    const readyToSleepLaboral = parseTime12h(text("MUNICH-2"));
    const fallAsleepMinutesLaboral = this.parseMinutes(text("MUNICH-3"));
    const duracionLaboral = this.calcDuration(readyToSleepLaboral, fallAsleepMinutesLaboral, wakeLaboral);

    // Duración no laboral:
    const wakeNoLaboral = parseTime12h(text("MUNICH-10"));
    const readyToSleepNoLaboral = parseTime12h(text("MUNICH-8"));
    const fallAsleepMinutesNoLaboral = this.parseMinutes(text("MUNICH-9"));
    const duracionNoLaboral = this.calcDuration(readyToSleepNoLaboral, fallAsleepMinutesNoLaboral, wakeNoLaboral);

    // MSF (Mid-Sleep on Free days):
    const msf = this.calcMSF(readyToSleepNoLaboral, fallAsleepMinutesNoLaboral, duracionNoLaboral);

    // MSF corregido (MSFsc):
    const msfCorregido = this.calcMSFCorrected(duracionNoLaboral, duracionLaboral, msf);

    // Cronotipo (interpretación del MSFsc):
    const cronotipo = this.interpretChronotype(msfCorregido);

    const sectionScores: SectionScore[] = [
      {
        sectionName: "Puntuacion Cronotipo Prueba Munich",
        totalScore: msfCorregido ?? 0,
        interpretation: cronotipo.interpretation ?? "Sin datos suficientes",
        attentionLevel: cronotipo.attentionLevel,
      },
    ];

    return { sectionScores, totalScore: msfCorregido ?? 0, attentionLevel: cronotipo.attentionLevel };
  }

  protected calcDuration(
    readyToSleep: { hours: number; minutes: number } | null,
    fallAsleepMinutes: number | null,
    wake: { hours: number; minutes: number } | null,
  ): number | null {
    if (!readyToSleep || !wake || fallAsleepMinutes === null) return null;

    const readyToSleepFrac = (readyToSleep.hours * 60 + readyToSleep.minutes) / 1440;
    const wakeFrac = (wake.hours * 60 + wake.minutes) / 1440;
    const fallAsleepFrac = fallAsleepMinutes / 1440;

    let diff = wakeFrac - (readyToSleepFrac + fallAsleepFrac);
    diff = diff % 1;
    if (diff < 0) diff += 1;

    return diff * 24;
  }

  protected calcMSF(
    readyToSleep: { hours: number; minutes: number } | null,
    fallAsleepMinutes: number | null,
    durationHours: number | null,
  ): number | null {
    if (!readyToSleep || fallAsleepMinutes === null || durationHours === null) return null;

    const readyToSleepFrac = (readyToSleep.hours * 60 + readyToSleep.minutes) / 1440;
    const fallAsleepFrac = fallAsleepMinutes / 1440;
    const halfDurationFrac = durationHours / 24 / 2;

    let msf = readyToSleepFrac + fallAsleepFrac + halfDurationFrac;
    msf = msf % 1;
    if (msf < 0) msf += 1;

    return msf;
  }

  protected dayFractionToTime(frac: number): string {
    const totalMinutes = Math.round(frac * 1440);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  protected calcMSFCorrected(
    durationFreeHours: number | null,
    durationWorkHours: number | null,
    msf: number | null,
  ): number | null {
    if (durationFreeHours === null || msf === null) return null;

    const workHours = durationWorkHours ?? 0;

    if (durationFreeHours <= workHours) return msf;

    let corrected = msf - (durationFreeHours - workHours) / 2 / 24;
    corrected = corrected % 1;
    if (corrected < 0) corrected += 1;

    return corrected;
  }

  protected parseMinutes(val: string): number | null {
    if (!val) return null;
    const minutes = parseFloat(val);
    return isNaN(minutes) ? null : minutes;
  }

  protected interpretChronotype(msfsc: number | null): { interpretation: string; attentionLevel: AttentionLevel }  {
    if (msfsc === null) return {interpretation:"",attentionLevel:"none"};

    const hours = msfsc * 24;
    if (hours < 2) return { interpretation: "Muy matutino", attentionLevel: "none"};
      if(hours < 3.5) return { interpretation: "Matutino", attentionLevel: "low"};
      if(hours < 4.5) return { interpretation: "Intermedio", attentionLevel:"medium"};
      if(hours < 5.5) return { interpretation: "Vespertino", attentionLevel:"high"};
    return { interpretation: "Muy vespertino", attentionLevel: "high" };
  }
}
