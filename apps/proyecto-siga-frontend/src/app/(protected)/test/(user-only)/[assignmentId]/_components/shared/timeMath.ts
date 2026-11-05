/**
 * Utilidades de tiempo para las preguntas `time_input` y de duración.
 *
 * `parseTime12h` y `hoursBetween` replican la lógica del backend
 * (`interpreters/shared/timeUtils.ts` y `PsqiInterpreter.calcHoursInBed`) para
 * que los avisos de consistencia usen exactamente el mismo cálculo que la
 * puntuación.
 */

export type Time24 = { hours: number; minutes: number };

/** "HH:MM AM/PM" → hora 24h. `null` si está vacío o mal formado. */
export function parseTime12h(val: string | null | undefined): Time24 | null {
  if (!val) return null;
  const match = val.match(/^(\d{2}):(\d{2})\s(AM|PM)$/);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];
  if (hours < 1 || hours > 12 || minutes > 59) return null;
  if (period === 'AM' && hours === 12) hours = 0;
  else if (period === 'PM' && hours !== 12) hours += 12;
  return { hours, minutes };
}

/** Horas transcurridas de `from` a `to`, cruzando la medianoche si hace falta. */
export function hoursBetween(from: Time24, to: Time24): number {
  let diff = to.hours * 60 + to.minutes - (from.hours * 60 + from.minutes);
  if (diff <= 0) diff += 24 * 60;
  return diff / 60;
}

/** Invierte AM/PM de un valor "HH:MM AM/PM" (para sugerir correcciones). */
export function flipAmPm(val: string): string | null {
  const match = val.match(/^(\d{2}:\d{2})\s(AM|PM)$/);
  if (!match) return null;
  return `${match[1]} ${match[2] === 'AM' ? 'PM' : 'AM'}`;
}

/** "10:00 PM" → "10:00 p. m." para mostrar al usuario. */
export function formatTime12h(val: string): string {
  return val.replace(/\sAM$/, ' a. m.').replace(/\sPM$/, ' p. m.');
}

export type DayPeriod = 'madrugada' | 'mañana' | 'tarde' | 'noche';

export function getDayPeriod(hours24: number): DayPeriod {
  if (hours24 < 5) return 'madrugada';
  if (hours24 < 12) return 'mañana';
  if (hours24 < 19) return 'tarde';
  return 'noche';
}

/** Horas decimales → "7 h 30 min" / "7 h". */
export function formatDuration(hours: number): string {
  const total = Math.round(hours * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/** Horas decimales → { horas, minutos } (minutos redondeados). */
export function splitHours(hours: number): { h: number; m: number } {
  const total = Math.round(hours * 60);
  return { h: Math.floor(total / 60), m: total % 60 };
}

/** { horas, minutos } → horas decimales como string, p. ej. "7.5" o "6.25". */
export function joinHours(h: number, m: number): string {
  return String(Math.round((h + m / 60) * 100) / 100);
}
