import { AnswerWithDetails } from "../contracts/answer/answer.types";
import { PsqiInterpreter } from "./PsqiInterpreter";

// --- Subclase testable ---
class TestablePsqi extends PsqiInterpreter {
  public override calcHoursInBed(
    b: { hours: number; minutes: number } | null,
    w: { hours: number; minutes: number } | null,
  ) {
    return super.calcHoursInBed(b, w);
  }
  public override interpretTotal(total: number) {
    return super.interpretTotal(total);
  }
}

// --- Helpers ---
function ans(code: string, score?: number, text?: string): AnswerWithDetails {
  return {
    textValue: text ?? null,
    question: { code, section: null },
    option:
      score !== undefined ? { scoreValue: { toNumber: () => score } } : null,
  };
}

/** Builds a baseline "neutral" answer set (all 0, good sleeper defaults) */
function baseAnswers(
  overrides: Array<{ code: string; score?: number; text?: string }> = [],
): AnswerWithDetails[] {
  const defaults: Array<{ code: string; score?: number; text?: string }> = [
    { code: "PSQI-1", text: "11:00 PM" },
    { code: "PSQI-2", score: 0 },
    { code: "PSQI-3", text: "07:00 AM" },
    { code: "PSQI-4.1", text: "8" },
    ...DISTURB_CODES.map((c) => ({ code: c, score: 0 })),
    { code: "PSQI-5.1", score: 0 },
    { code: "PSQI-6", score: 0 },
    { code: "PSQI-7", score: 0 },
    { code: "PSQI-8", score: 0 },
    { code: "PSQI-9", score: 0 },
  ];
  const overrideMap = new Map(overrides.map((o) => [o.code, o]));
  return defaults.map((d) => {
    const o = overrideMap.get(d.code);
    if (o) return ans(o.code, o.score, o.text);
    return ans(d.code, d.score, d.text);
  });
}

/** Items 5b–5j del PSQI (C5). PSQI-5.1 (5a) solo cuenta para C2; 5j es PSQI-5.10.1. */
const DISTURB_CODES = [
  "PSQI-5.2",
  "PSQI-5.3",
  "PSQI-5.4",
  "PSQI-5.5",
  "PSQI-5.6",
  "PSQI-5.7",
  "PSQI-5.8",
  "PSQI-5.9",
  "PSQI-5.10.1",
];

/** With the baseline at 0, the global score equals the isolated component. */
const total = (overrides: Array<{ code: string; score?: number; text?: string }>) =>
  t.calculateFromAnswers(baseAnswers(overrides)).totalScore;

const t = new TestablePsqi();

// --- Tests ---
describe("PsqiInterpreter", () => {
  it("should have testCode PSQI", () => {
    expect(t.testCode).toBe("PSQI");
  });

  // ==================== calcHoursInBed ====================
  describe("calcHoursInBed", () => {
    it.each([
      [{ hours: 22, minutes: 0 }, { hours: 6, minutes: 0 }, 8],
      [{ hours: 1, minutes: 0 }, { hours: 9, minutes: 0 }, 8],
      [{ hours: 23, minutes: 30 }, { hours: 5, minutes: 30 }, 6],
      [{ hours: 22, minutes: 15 }, { hours: 6, minutes: 45 }, 8.5],
      [{ hours: 8, minutes: 0 }, { hours: 8, minutes: 0 }, 24], // same time → 24h
    ] as [
      { hours: number; minutes: number },
      { hours: number; minutes: number },
      number,
    ][])("bed=%j wake=%j → %s hours", (bed, wake, expected) => {
      expect(t.calcHoursInBed(bed, wake)).toBeCloseTo(expected);
    });

    it.each([
      [null, { hours: 7, minutes: 0 }],
      [{ hours: 23, minutes: 0 }, null],
      [null, null],
    ] as [any, any][])("returns 0 when bed=%j wake=%j", (bed, wake) => {
      expect(t.calcHoursInBed(bed, wake)).toBe(0);
    });
  });

  // ==================== interpretTotal ====================
  describe("interpretTotal", () => {
    it.each([
      [0, "none"],
      [4, "none"],
      [5, "low"],
      [7, "low"],
      [8, "medium"],
      [14, "medium"],
      [15, "high"],
      [21, "high"],
    ] as [number, string][])("score %i → %s", (score, level) => {
      expect(t.interpretTotal(score).attentionLevel).toBe(level);
    });
  });

  // ==================== C1 - Calidad subjetiva ====================
  describe("C1 - Calidad subjetiva del sueño (PSQI-9)", () => {
    it.each([0, 1, 2, 3])("PSQI-9 score=%i → C1=%i", (s) => {
      expect(total([{ code: "PSQI-9", score: s }])).toBe(s);
    });
  });

  // ==================== C2 - Latencia del sueño ====================
  describe("C2 - Latencia del sueño (PSQI-2 + PSQI-5.1)", () => {
    it.each([
      [0, 0, 0], // raw=0 → 0
      [1, 0, 1], // raw=1 → 1
      [1, 1, 1], // raw=2 → 1
      [2, 1, 2], // raw=3 → 2
      [2, 2, 2], // raw=4 → 2
      [3, 2, 3], // raw=5 → 3
      [3, 3, 3], // raw=6 → 3
    ] as [number, number, number][])(
      "PSQI-2=%i + PSQI-5.1=%i → C2=%i",
      (p2, p51, expected) => {
        expect(
          total([
            { code: "PSQI-2", score: p2 },
            { code: "PSQI-5.1", score: p51 },
          ]),
        ).toBe(expected);
      },
    );
  });

  // ==================== C3 - Duración del sueño ====================
  describe("C3 - Duración del sueño (PSQI-4.1)", () => {
    // Bed 11PM–7AM = 8h in bed; keep efficiency (C4) out of the way where possible
    it.each([
      ["8", 0],
      ["7.5", 0],
    ] as [string, number][])("PSQI-4.1='%s' → C3=%i", (text, expected) => {
      expect(total([{ code: "PSQI-4.1", text }])).toBe(expected);
    });

    it.each([
      ["7", 1], // not >7
      ["6", 1],
      ["5.5", 2],
      ["5", 2],
      ["4", 3],
    ] as [string, number][])("PSQI-4.1='%s' → C3=%i (C4=0 con tiempo en cama igual)", (text, expected) => {
      const h = parseFloat(text);
      // Bedtime chosen so that time in bed == hours slept → efficiency 100% → C4=0
      const bedMinutes = (7 * 60 - h * 60 + 24 * 60) % (24 * 60);
      const hh = Math.floor(bedMinutes / 60);
      const mm = bedMinutes % 60;
      const h12 = hh % 12 === 0 ? 12 : hh % 12;
      const bed = `${String(h12).padStart(2, "0")}:${String(mm).padStart(2, "0")} ${hh < 12 ? "AM" : "PM"}`;
      expect(
        total([
          { code: "PSQI-1", text: bed },
          { code: "PSQI-4.1", text },
        ]),
      ).toBe(expected);
    });

    it.each(["", "abc"])("PSQI-4.1='%s' → sin penalización", (text) => {
      expect(total([{ code: "PSQI-4.1", text }])).toBe(0);
    });
  });

  // ==================== C4 - Eficiencia habitual ====================
  describe("C4 - Eficiencia habitual del sueño", () => {
    it.each([
      // slept 7.5h (C3=0); vary time in bed
      ["11:00 PM", "07:00 AM", 0], // 7.5/8  = 93.8% → 0
      ["10:00 PM", "07:00 AM", 1], // 7.5/9  = 83.3% → 1
      ["09:00 PM", "07:00 AM", 1], // 7.5/10 = 75.0% → 1 (boundary)
      ["08:00 PM", "07:00 AM", 2], // 7.5/11 = 68.2% → 2
      ["06:00 PM", "07:00 AM", 3], // 7.5/13 = 57.7% → 3
    ] as [string, string, number][])(
      "bed=%s wake=%s slept=7.5 → C4=%i",
      (bed, wake, expected) => {
        expect(
          total([
            { code: "PSQI-1", text: bed },
            { code: "PSQI-3", text: wake },
            { code: "PSQI-4.1", text: "7.5" },
          ]),
        ).toBe(expected);
      },
    );

    it("sin hora de acostarse → C4=0 (sin penalización)", () => {
      expect(
        total([
          { code: "PSQI-1", text: "" },
          { code: "PSQI-4.1", text: "7.5" },
        ]),
      ).toBe(0);
    });
  });

  // ==================== C5 - Perturbaciones del sueño ====================
  describe("C5 - Perturbaciones del sueño (PSQI-5.2 a 5.10.1)", () => {
    function withDisturbSum(targetSum: number) {
      const full3s = Math.floor(targetSum / 3);
      const remainder = targetSum % 3;
      return DISTURB_CODES.map((code, i) => ({
        code,
        score: i < full3s ? 3 : i === full3s ? remainder : 0,
      }));
    }

    it.each([
      [0, 0],
      [5, 1],
      [9, 1], // boundary
      [10, 2],
      [18, 2], // boundary
      [19, 3],
      [27, 3], // max
    ] as [number, number][])("sum=%i → C5=%i", (sum, expected) => {
      expect(total(withDisturbSum(sum))).toBe(expected);
    });

    it("PSQI-5.1 no suma a C5 (solo a C2)", () => {
      // PSQI-5.1=3 → C2 raw=3 → C2=2; C5 sigue en 0
      expect(total([{ code: "PSQI-5.1", score: 3 }])).toBe(2);
    });
  });

  // ==================== C6 - Uso de medicación ====================
  describe("C6 - Uso de medicación para dormir (PSQI-6)", () => {
    it.each([0, 1, 2, 3])("PSQI-6 score=%i → C6=%i", (s) => {
      expect(total([{ code: "PSQI-6", score: s }])).toBe(s);
    });
  });

  // ==================== C7 - Disfunción diurna ====================
  describe("C7 - Disfunción diurna (PSQI-7 + PSQI-8)", () => {
    it.each([
      [0, 0, 0],
      [1, 0, 1],
      [1, 1, 1],
      [2, 1, 2],
      [2, 2, 2],
      [3, 2, 3],
      [3, 3, 3],
    ] as [number, number, number][])(
      "PSQI-7=%i + PSQI-8=%i → C7=%i",
      (p7, p8, expected) => {
        expect(
          total([
            { code: "PSQI-7", score: p7 },
            { code: "PSQI-8", score: p8 },
          ]),
        ).toBe(expected);
      },
    );
  });

  // ==================== Integración y edge cases ====================
  describe("integración", () => {
    it("buen dormidor → totalScore=0, attentionLevel=none", () => {
      const r = t.calculateFromAnswers(baseAnswers());
      expect(r.totalScore).toBe(0);
      expect(r.attentionLevel).toBe("none");
      expect(r.sectionScores).toHaveLength(1);
    });

    it("mal dormidor → totalScore=21, attentionLevel=high", () => {
      const r = t.calculateFromAnswers(
        baseAnswers([
          { code: "PSQI-1", text: "10:00 PM" },
          { code: "PSQI-2", score: 3 },
          { code: "PSQI-3", text: "07:00 AM" },
          { code: "PSQI-4.1", text: "4" },
          { code: "PSQI-5.1", score: 3 },
          ...DISTURB_CODES.map((c) => ({ code: c, score: 3 })),
          { code: "PSQI-6", score: 3 },
          { code: "PSQI-7", score: 3 },
          { code: "PSQI-8", score: 3 },
          { code: "PSQI-9", score: 3 },
        ]),
      );
      expect(r.totalScore).toBe(21);
      expect(r.attentionLevel).toBe("high");
    });

    it("caso real de validación (validar.xlsx) → totalScore=11, attentionLevel=medium", () => {
      // C1=2 (P9) · C2=2 (1+2=3) · C3=2 (5.3h) · C4=0 (5.3h / 5h en cama >85%)
      // C5=2 (2+3+0+1+2+1+2+1=12, sin 5.10.1) · C6=1 · C7=2 (1+2=3)
      const r = t.calculateFromAnswers([
        ans("PSQI-1", undefined, "11:00 PM"),
        ans("PSQI-2", 1),
        ans("PSQI-3", undefined, "04:00 AM"),
        ans("PSQI-4.1", undefined, "5.3"),
        ans("PSQI-5.1", 2),
        ans("PSQI-5.2", 2),
        ans("PSQI-5.3", 3),
        ans("PSQI-5.4", 0),
        ans("PSQI-5.5", 1),
        ans("PSQI-5.6", 2),
        ans("PSQI-5.7", 1),
        ans("PSQI-5.8", 2),
        ans("PSQI-5.9", 1),
        ans("PSQI-5.10", undefined, "Dificultad para levantarme cuando suena la alarma"),
        ans("PSQI-6", 1),
        ans("PSQI-7", 1),
        ans("PSQI-8", 2),
        ans("PSQI-9", 2),
        ans("PSQI-11.1", 1),
        ans("PSQI-11.3", 1),
        ans("PSQI-11.4", 1),
      ]);
      expect(r.totalScore).toBe(11);
      expect(r.attentionLevel).toBe("medium");
    });

    it("array vacío → no lanza error, totalScore=0", () => {
      const r = t.calculateFromAnswers([]);
      expect(r.totalScore).toBe(0);
      expect(r.attentionLevel).toBe("none");
    });

    it("answer con question: null → se ignora", () => {
      const r = t.calculateFromAnswers([
        {
          textValue: null,
          question: null,
          option: { scoreValue: { toNumber: () => 3 } },
        },
      ]);
      expect(r.totalScore).toBe(0);
    });

    it("answer con scoreValue: null → score=0", () => {
      const a: AnswerWithDetails = {
        textValue: null,
        question: { code: "PSQI-9", section: null },
        option: { scoreValue: null },
      };
      expect(t.calculateFromAnswers([a]).totalScore).toBe(0);
    });

    it("interpretación clínica incluye los 7 componentes", () => {
      const r = t.calculateFromAnswers(baseAnswers([{ code: "PSQI-6", score: 1 }]));
      for (let i = 1; i <= 7; i++) expect(r.clinicalInterpretation).toContain(`C${i} -`);
      expect(r.clinicalInterpretation).toContain("C6 - Uso de medicación para dormir: Leve (1/3)");
    });
  });
});
