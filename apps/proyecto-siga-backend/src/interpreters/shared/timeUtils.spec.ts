import { parseTime12h } from "./timeUtils";

describe("parseTime12h", () => {
  it("parses AM/PM times into 24h hours/minutes", () => {
    expect(parseTime12h("11:00 PM")).toEqual({ hours: 23, minutes: 0 });
    expect(parseTime12h("07:30 AM")).toEqual({ hours: 7, minutes: 30 });
    expect(parseTime12h("12:00 AM")).toEqual({ hours: 0, minutes: 0 });
    expect(parseTime12h("12:00 PM")).toEqual({ hours: 12, minutes: 0 });
    expect(parseTime12h("01:15 PM")).toEqual({ hours: 13, minutes: 15 });
  });

  it("returns null for empty or malformed values", () => {
    expect(parseTime12h("")).toBeNull();
    expect(parseTime12h("11:00")).toBeNull();
    expect(parseTime12h("13:00 PM")).toBeNull();
    expect(parseTime12h("11:60 PM")).toBeNull();
    expect(parseTime12h("00:00 AM")).toBeNull();
    expect(parseTime12h("garbage")).toBeNull();
  });
});
