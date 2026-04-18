import { AnswerWithDetails } from "../contracts/answer/answer.types";
import { PsqiInterpreter } from "./PsqiInterpreter";

// --- Subclase testable ---
class TestablePsqi extends PsqiInterpreter {
  public override parseTime(val: string) {
    return super.parseTime(val);
  }
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
    { code: "PSQI-5", text: "8" },
    ...[
      "PSQI-6.1",
      "PSQI-6.2",
      "PSQI-6.3",
      "PSQI-6.4",
      "PSQI-6.5",
      "PSQI-6.6",
      "PSQI-6.7",
      "PSQI-6.8",
      "PSQI-6.9",
    ].map((c) => ({ code: c, score: 0 })),
    { code: "PSQI-8", score: 0 },
    { code: "PSQI-9", score: 0 },
    { code: "PSQI-10", score: 0 },
  ];
  const overrideMap = new Map(overrides.map((o) => [o.code, o]));
  return defaults.map((d) => {
    const o = overrideMap.get(d.code);
    if (o) return ans(o.code, o.score, o.text);
    return ans(d.code, d.score, d.text);
  });
}

// --- Tests ---
describe("PsqiInterpreter", () => {
  const t = new TestablePsqi();

  it("should have testCode PSQI", () => {
    expect(t.testCode).toBe("PSQI");
  });

  // ==================== parseTime ====================
  describe("parseTime", () => {
    it.each([
      ["09:30 AM", { hours: 9, minutes: 30 }],
      ["09:30 PM", { hours: 21, minutes: 30 }],
      ["12:00 AM", { hours: 0, minutes: 0 }],
      ["12:00 PM", { hours: 12, minutes: 0 }],
      ["12:30 PM", { hours: 12, minutes: 30 }],
      ["01:00 AM", { hours: 1, minutes: 0 }],
      ["11:59 PM", { hours: 23, minutes: 59 }],
    ] as [string, { hours: number; minutes: number }][])(
      "parses '%s' correctly",
      (input, expected) => {
        expect(t.parseTime(input)).toEqual(expected);
      },
    );

    it.each(["9:30 AM", "21:30", "", "abc", "00:00 AM", "13:00 PM"])(
      "returns null for invalid '%s'",
      (input) => {
        expect(t.parseTime(input)).toBeNull();
      },
    );
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
      [0, "Sin problemas de sueño", "none"],
      [4, "Sin problemas de sueño", "none"],
      [5, "Merece atención médica", "low"],
      [7, "Merece atención médica", "low"],
      [8, "Merece atención y tratamiento médico", "medium"],
      [14, "Merece atención y tratamiento médico", "medium"],
      [15, "Se trata de un problema de sueño", "high"],
      [21, "Se trata de un problema de sueño", "high"],
    ] as [number, string, string][])(
      "score %i → '%s' (%s)",
      (score, interpretation, level) => {
        expect(t.interpretTotal(score)).toEqual({
          interpretation,
          attentionLevel: level,
        });
      },
    );
  });

  // ==================== C1 - Calidad subjetiva ====================
  // NOTA: C1 usa score("PSQI-2"). En el PSQI estándar, C1 corresponde a PSQI-7.
  describe("C1 - Calidad subjetiva del sueño", () => {
    it.each([0, 1, 2, 3])("PSQI-2 score=%i → C1=%i", (s) => {
      const r = t.calculateFromAnswers(
        baseAnswers([{ code: "PSQI-2", score: s }]),
      );
      expect(r.sectionScores[0].totalScore).toBe(s);
    });
  });

  // ==================== C2 - Latencia del sueño ====================
  describe("C2 - Latencia del sueño", () => {
    it.each([
      [0, 0, 0], // raw=0 → 0
      [1, 0, 1], // raw=1 → 1
      [1, 1, 1], // raw=2 → 1
      [2, 1, 2], // raw=3 → 2
      [2, 2, 2], // raw=4 → 2
      [3, 2, 3], // raw=5 → 3
      [3, 3, 3], // raw=6 → 3
    ] as [number, number, number][])(
      "PSQI-2=%i + PSQI-6.1=%i → C2=%i",
      (p2, p61, expected) => {
        const r = t.calculateFromAnswers(
          baseAnswers([
            { code: "PSQI-2", score: p2 },
            { code: "PSQI-6.1", score: p61 },
          ]),
        );
        expect(r.sectionScores[1].totalScore).toBe(expected);
      },
    );
  });

  // ==================== C3 - Duración del sueño ====================
  describe("C3 - Duración del sueño", () => {
    it.each([
      ["8", 0],
      ["7.5", 0],
      ["7", 1], // not >7
      ["6", 1],
      ["5.5", 2],
      ["5", 2],
      ["4", 3],
      ["", 0],    // no data → no penalty
      ["abc", 0], // non-numeric → no penalty
    ] as [string, number][])("PSQI-5='%s' → C3=%i", (text, expected) => {
      const r = t.calculateFromAnswers(baseAnswers([{ code: "PSQI-5", text }]));
      expect(r.sectionScores[2].totalScore).toBe(expected);
    });
  });

  // ==================== C4 - Eficiencia habitual ====================
  describe("C4 - Eficiencia habitual del sueño", () => {
    it.each([
      ["11:00 PM", "07:00 AM", "7", 0], // 7/8=87.5% → >85 → 0
      ["10:00 PM", "07:00 AM", "7", 1], // 7/9≈77.7% → >=75 → 1
      ["10:00 PM", "07:00 AM", "6", 2], // 6/9≈66.6% → >=65 → 2
      ["10:00 PM", "07:00 AM", "5", 3], // 5/9≈55.5% → <65 → 3
    ] as [string, string, string, number][])(
      "bed=%s wake=%s slept=%s → C4=%i",
      (bed, wake, slept, expected) => {
        const r = t.calculateFromAnswers(
          baseAnswers([
            { code: "PSQI-1", text: bed },
            { code: "PSQI-3", text: wake },
            { code: "PSQI-5", text: slept },
          ]),
        );
        expect(r.sectionScores[3].totalScore).toBe(expected);
      },
    );

    it("no bedtime → C4=0 (no penalty for missing data)", () => {
      const r = t.calculateFromAnswers(
        baseAnswers([
          { code: "PSQI-1", text: "" },
          { code: "PSQI-5", text: "7" },
        ]),
      );
      expect(r.sectionScores[3].totalScore).toBe(0);
    });
  });

  // ==================== C5 - Perturbaciones del sueño ====================
  describe("C5 - Perturbaciones del sueño", () => {
    const disturbCodes = [
      "PSQI-6.1",
      "PSQI-6.2",
      "PSQI-6.3",
      "PSQI-6.4",
      "PSQI-6.5",
      "PSQI-6.6",
      "PSQI-6.7",
      "PSQI-6.8",
      "PSQI-6.9",
    ];

    function withDisturbSum(targetSum: number) {
      // Distribute targetSum across 9 items: fill with 3s, then remainder
      const full3s = Math.floor(targetSum / 3);
      const remainder = targetSum % 3;
      return disturbCodes.map((code, i) => ({
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
      const r = t.calculateFromAnswers(baseAnswers(withDisturbSum(sum)));
      expect(r.sectionScores[4].totalScore).toBe(expected);
    });
  });

  // ==================== C6 - Uso de medicación ====================
  describe("C6 - Uso de medicación para dormir", () => {
    it.each([0, 1, 2, 3])("PSQI-8 score=%i → C6=%i", (s) => {
      const r = t.calculateFromAnswers(
        baseAnswers([{ code: "PSQI-8", score: s }]),
      );
      expect(r.sectionScores[5].totalScore).toBe(s);
    });
  });

  // ==================== C7 - Disfunción diurna ====================
  describe("C7 - Disfunción diurna", () => {
    it.each([
      [0, 0, 0],
      [1, 0, 1],
      [1, 1, 1],
      [2, 1, 2],
      [2, 2, 2],
      [3, 2, 3],
      [3, 3, 3],
    ] as [number, number, number][])(
      "PSQI-9=%i + PSQI-10=%i → C7=%i",
      (p9, p10, expected) => {
        const r = t.calculateFromAnswers(
          baseAnswers([
            { code: "PSQI-9", score: p9 },
            { code: "PSQI-10", score: p10 },
          ]),
        );
        expect(r.sectionScores[6].totalScore).toBe(expected);
      },
    );
  });

  // ==================== Integración y edge cases ====================
  describe("integración", () => {
    it("buen dormidor → totalScore=0, attentionLevel=none", () => {
      const r = t.calculateFromAnswers(baseAnswers());
      expect(r.totalScore).toBe(0);
      expect(r.attentionLevel).toBe("none");
      expect(r.sectionScores).toHaveLength(8); // 7 components + global
    });

    it("mal dormidor → totalScore=21, attentionLevel=high", () => {
      const r = t.calculateFromAnswers(
        baseAnswers([
          { code: "PSQI-1", text: "10:00 PM" },
          { code: "PSQI-2", score: 3 },
          { code: "PSQI-3", text: "07:00 AM" },
          { code: "PSQI-5", text: "4" },
          ...[
            "PSQI-6.1",
            "PSQI-6.2",
            "PSQI-6.3",
            "PSQI-6.4",
            "PSQI-6.5",
            "PSQI-6.6",
            "PSQI-6.7",
            "PSQI-6.8",
            "PSQI-6.9",
          ].map((c) => ({ code: c, score: 3 })),
          { code: "PSQI-8", score: 3 },
          { code: "PSQI-9", score: 3 },
          { code: "PSQI-10", score: 3 },
        ]),
      );
      expect(r.totalScore).toBe(21);
      expect(r.attentionLevel).toBe("high");
    });

    it("array vacío → no lanza error, totalScore=0 (sin datos = sin penalización)", () => {
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

    it("answer con option: null → score=0", () => {
      const r = t.calculateFromAnswers([ans("PSQI-2", undefined)]);
      expect(r.sectionScores[0].totalScore).toBe(0);
    });

    it("answer con scoreValue: null → score=0", () => {
      const a: AnswerWithDetails = {
        textValue: null,
        question: { code: "PSQI-2", section: null },
        option: { scoreValue: null },
      };
      const r = t.calculateFromAnswers([a]);
      expect(r.sectionScores[0].totalScore).toBe(0);
    });

    it("sectionScores tiene 8 elementos con estructura correcta", () => {
      const r = t.calculateFromAnswers(baseAnswers());
      expect(r.sectionScores).toHaveLength(8);
      expect(r.sectionScores[7].sectionName).toBe("Puntuación Global PSQI");
    });

    it("interpretaciones por componente: score 0→Sin dificultad, 1→Leve, 2→Moderada, 3→Severa", () => {
      const r = t.calculateFromAnswers(
        baseAnswers([
          { code: "PSQI-2", score: 0 }, // C1=0
          { code: "PSQI-8", score: 1 }, // C6=1
        ]),
      );
      expect(r.sectionScores[0].interpretation).toBe("Sin dificultad");
      expect(r.sectionScores[5].interpretation).toBe("Leve");
    });

    it("attentionLevel por componente: 0-1→none, 2→medium, 3→high", () => {
      const r = t.calculateFromAnswers(
        baseAnswers([
          { code: "PSQI-8", score: 2 }, // C6=2
          { code: "PSQI-9", score: 3 },
          { code: "PSQI-10", score: 3 }, // C7=3
        ]),
      );
      expect(r.sectionScores[0].attentionLevel).toBe("none"); // C1=0
      expect(r.sectionScores[5].attentionLevel).toBe("medium"); // C6=2
      expect(r.sectionScores[6].attentionLevel).toBe("high"); // C7=3
    });
  });
});
