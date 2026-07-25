import { AnswerWithDetails } from "../contracts/answer/answer.types";
import { MunichInterpreter } from "./MunichInterpreter";
import { parseTime12h } from "./shared/timeUtils";

class TestableMunich extends MunichInterpreter {
  public override parseMinutes(val: string) {
    return super.parseMinutes(val);
  }
  public override calcDuration(
    readyToSleep: { hours: number; minutes: number } | null,
    fallAsleepMinutes: number | null,
    wake: { hours: number; minutes: number } | null,
  ) {
    return super.calcDuration(readyToSleep, fallAsleepMinutes, wake);
  }
  public override calcMSF(
    readyToSleep: { hours: number; minutes: number } | null,
    fallAsleepMinutes: number | null,
    durationHours: number | null,
  ) {
    return super.calcMSF(readyToSleep, fallAsleepMinutes, durationHours);
  }
  public override calcMSFCorrected(
    durationFreeHours: number | null,
    durationWorkHours: number | null,
    msf: number | null,
  ) {
    return super.calcMSFCorrected(durationFreeHours, durationWorkHours, msf);
  }
  public override interpretChronotype(msfsc: number | null) {
    return super.interpretChronotype(msfsc);
  }
  public override dayFractionToTime(frac: number) {
    return super.dayFractionToTime(frac);
  }
}

function ans(code: string, text?: string): AnswerWithDetails {
  return {
    textValue: text ?? null,
    question: { code, section: null },
    option: null,
  };
}

describe("MunichInterpreter", () => {
  const interpreter = new TestableMunich();

  it("calcDuration replicates RESIDUO(D2-(B2+C2/1440);1)*24 for overnight sleep", () => {
    const readyToSleep = parseTime12h("11:00 PM");
    const wake = parseTime12h("07:00 AM");
    const result = interpreter.calcDuration(readyToSleep, 10, wake);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(7.8333, 3);
  });

  it("calcDuration handles same-day (no midnight crossing)", () => {
    // Ready to sleep 01:00 AM, 5 min to fall asleep, wake 09:00 AM => 7h55m = 7.9167h
    const readyToSleep = parseTime12h("01:00 AM");
    const wake = parseTime12h("09:00 AM");
    const result = interpreter.calcDuration(readyToSleep, 5, wake);
    expect(result!).toBeCloseTo(7.9167, 3);
  });

  it("calcDuration returns null when any input is missing", () => {
    expect(interpreter.calcDuration(null, 10, { hours: 7, minutes: 0 })).toBeNull();
    expect(interpreter.calcDuration({ hours: 23, minutes: 0 }, null, { hours: 7, minutes: 0 })).toBeNull();
    expect(interpreter.calcDuration({ hours: 23, minutes: 0 }, 10, null)).toBeNull();
  });

  // ==================== calcMSF ====================
  describe("calcMSF", () => {
    it("replicates RESIDUO((E2+F2/1440)+(I2/24)/2;1)", () => {
      // Ready to sleep 12:30 AM, 15 min to fall asleep, duration no laboral 8.25h
      // => (0.0208333 + 0.0104167) + (8.25/24)/2 = 0.03125 + 0.171875 = 0.203125 => 04:52
      const readyToSleep = parseTime12h("12:30 AM");
      const msf = interpreter.calcMSF(readyToSleep, 15, 8.25);
      expect(msf).not.toBeNull();
      expect(msf!).toBeCloseTo(0.203125, 6);
      expect(interpreter.dayFractionToTime(msf!)).toBe("04:53");
    });

    it("wraps around midnight via RESIDUO(x, 1)", () => {
      // Ready to sleep 11:50 PM, 20 min to fall asleep, duration 10h
      // => (0.9930556 + 0.0138889) + (10/24)/2 = 1.0069444 + 0.2083333 = 1.2152778 % 1 = 0.2152778 => 05:10
      const readyToSleep = parseTime12h("11:50 PM");
      const msf = interpreter.calcMSF(readyToSleep, 20, 10);
      expect(msf!).toBeCloseTo(0.2152778, 6);
      expect(interpreter.dayFractionToTime(msf!)).toBe("05:10");
    });

    it("returns null when any input is missing", () => {
      expect(interpreter.calcMSF(null, 15, 8)).toBeNull();
      expect(interpreter.calcMSF({ hours: 0, minutes: 30 }, null, 8)).toBeNull();
      expect(interpreter.calcMSF({ hours: 0, minutes: 30 }, 15, null)).toBeNull();
    });
  });

  // ==================== calcMSFCorrected ====================
  describe("calcMSFCorrected", () => {
    it("returns MSF unchanged when durationFree <= durationWork", () => {
      // I2 (7h) <= H2 (8h) => no correction
      expect(interpreter.calcMSFCorrected(7, 8, 0.5)).toBe(0.5);
      expect(interpreter.calcMSFCorrected(8, 8, 0.5)).toBe(0.5);
    });

    it("applies correction when durationFree > durationWork", () => {
      // I2=8.25, H2=7.8333, J2=0.203125
      // corrected = 0.203125 - ((8.25-7.8333)/2)/24 = 0.203125 - (0.41667/2)/24
      //           = 0.203125 - 0.2083333/24 = 0.203125 - 0.0086806 = 0.1944444 => 04:40
      const corrected = interpreter.calcMSFCorrected(8.25, 7.8333, 0.203125);
      expect(corrected).not.toBeNull();
      expect(corrected!).toBeCloseTo(0.1944444, 5);
      expect(interpreter.dayFractionToTime(corrected!)).toBe("04:40");
    });

    it("treats missing durationWork (H2) as 0, matching Excel empty-cell arithmetic", () => {
      // I2=5, H2 missing (=0), J2=0.5 => corrected = 0.5 - (5-0)/2/24 = 0.5 - 0.1041667 = 0.3958333
      const corrected = interpreter.calcMSFCorrected(5, null, 0.5);
      expect(corrected!).toBeCloseTo(0.3958333, 6);
    });

    it("wraps around via RESIDUO(x, 1) when correction goes negative", () => {
      // I2=20, H2=0, J2=0.1 => corrected = 0.1 - 10/24 = 0.1 - 0.41667 = -0.31667 % 1 => 0.68333
      const corrected = interpreter.calcMSFCorrected(20, 0, 0.1);
      expect(corrected!).toBeCloseTo(0.6833333, 5);
    });

    it("returns null when durationFree or msf is missing", () => {
      expect(interpreter.calcMSFCorrected(null, 8, 0.5)).toBeNull();
      expect(interpreter.calcMSFCorrected(8, 8, null)).toBeNull();
    });
  });

  // ==================== interpretChronotype ====================
  describe("interpretChronotype", () => {
    it.each([
      [0, "Muy matutino"],
      [1.999 / 24, "Muy matutino"],
      [2 / 24, "Matutino"],
      [3.499 / 24, "Matutino"],
      [3.5 / 24, "Intermedio"],
      [4.499 / 24, "Intermedio"],
      [4.5 / 24, "Vespertino"],
      [5.499 / 24, "Vespertino"],
      [5.5 / 24, "Muy vespertino"],
      [10 / 24, "Muy vespertino"],
    ])("classifies %p hours (as day fraction) as '%s'", (msfsc, expected) => {
      expect(interpreter.interpretChronotype(msfsc)).toBe(expected);
    });

    it("returns null when msfsc is missing", () => {
      expect(interpreter.interpretChronotype(null)).toBeNull();
    });
  });

  it("calculateFromAnswers computes 'Duración laboral', 'Duración no laboral', 'MSF', 'MSFsc' and 'Cronotipo' sections", () => {
    const answers: AnswerWithDetails[] = [
      ans("MUNICH-2", "11:00 PM"), // ready to sleep (laboral)
      ans("MUNICH-3", "10"), // minutes to fall asleep (laboral)
      ans("MUNICH-4", "07:00 AM"), // wake (laboral)
      ans("MUNICH-8", "12:30 AM"), // ready to sleep (no laboral)
      ans("MUNICH-9", "15"), // minutes to fall asleep (no laboral)
      ans("MUNICH-10", "09:00 AM"), // wake (no laboral)
    ];

    const { sectionScores } = interpreter.calculateFromAnswers(answers);

    const laboral = sectionScores.find((s) => s.sectionName === "Duración laboral");
    const noLaboral = sectionScores.find((s) => s.sectionName === "Duración no laboral");
    const msf = sectionScores.find((s) => s.sectionName === "MSF");
    const msfsc = sectionScores.find((s) => s.sectionName === "MSFsc");
    const cronotipo = sectionScores.find((s) => s.sectionName === "Cronotipo");

    expect(laboral).toBeDefined();
    expect(laboral!.totalScore).toBeCloseTo(7.8333, 3);

    expect(noLaboral).toBeDefined();
    // ready 12:30 AM + 15 min => 12:45 AM, wake 9:00 AM => 8h15m = 8.25h
    expect(noLaboral!.totalScore).toBeCloseTo(8.25, 3);

    expect(msf).toBeDefined();
    expect(msf!.totalScore).toBeCloseTo(0.203125, 6);
    expect(msf!.interpretation).toBe("04:53");

    // I2 (8.25) > H2 (7.8333) => se aplica corrección
    expect(msfsc).toBeDefined();
    expect(msfsc!.totalScore).toBeCloseTo(0.1944444, 6);

    // 0.1944444 * 24 = 4.6667h => Vespertino ([4.5, 5.5))
    expect(cronotipo).toBeDefined();
    expect(cronotipo!.interpretation).toBe("Vespertino");
  });

  it("calculateFromAnswers returns null-based 'Sin datos suficientes' when missing answers", () => {
    const { sectionScores } = interpreter.calculateFromAnswers([]);
    const laboral = sectionScores.find((s) => s.sectionName === "Duración laboral");
    const msf = sectionScores.find((s) => s.sectionName === "MSF");
    const msfsc = sectionScores.find((s) => s.sectionName === "MSFsc");
    const cronotipo = sectionScores.find((s) => s.sectionName === "Cronotipo");
    expect(laboral!.interpretation).toBe("Sin datos suficientes");
    expect(laboral!.totalScore).toBe(0);
    expect(msf!.interpretation).toBe("Sin datos suficientes");
    expect(msf!.totalScore).toBe(0);
    expect(msfsc!.interpretation).toBe("Sin datos suficientes");
    expect(msfsc!.totalScore).toBe(0);
    expect(cronotipo!.interpretation).toBe("Sin datos suficientes");
    expect(cronotipo!.totalScore).toBe(0);
  });
});
