/**
 * Parses a 12h time string in the format "HH:MM AM/PM" into 24h hours/minutes.
 * Returns null if the value is empty or doesn't match the expected format.
 *
 * Shared across interpreters that receive time_input answers (e.g. PSQI, MUNICH).
 */
export function parseTime12h(val: string): { hours: number; minutes: number } | null {
  if (!val) return null;
  const match = val.match(/^(\d{2}):(\d{2})\s(AM|PM)$/);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];
  if (hours < 1 || hours > 12 || minutes > 59) return null;
  // Convert 12h to 24h
  if (period === "AM" && hours === 12) hours = 0;
  else if (period === "PM" && hours !== 12) hours += 12;
  return { hours, minutes };
}
