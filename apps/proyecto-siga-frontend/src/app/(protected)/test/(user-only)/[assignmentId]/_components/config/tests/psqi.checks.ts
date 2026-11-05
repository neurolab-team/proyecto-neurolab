import { ConsistencyCheck, CheckContext } from '../consistency.types';
import {
  flipAmPm,
  formatDuration,
  formatTime12h,
  hoursBetween,
  parseTime12h,
} from '../../shared/timeMath';

/**
 * Chequeos de consistencia del PSQI, derivados de la validación de respuestas
 * reales (reporte_validacion_psqi): tiempos en cama imposibles por AM/PM,
 * horas dormidas mayores al tiempo en cama y valores fuera de rango.
 */

const BED = 'PSQI-1';
const WAKE = 'PSQI-3';
const RANGE = 'PSQI-4';
const SLEPT = 'PSQI-4.1';

const MIN_IN_BED = 3;
const MAX_IN_BED = 14;
const MIN_SLEPT = 3;
const MAX_SLEPT = 12;
/** Margen para no avisar por diferencias de redondeo (15 min). */
const TOLERANCE = 0.25;

const isNormalInBed = (h: number) => h >= MIN_IN_BED && h <= MAX_IN_BED;

/** Acostarse entre 6 p. m. y 4 a. m. y levantarse entre 4 a. m. y 1 p. m. */
function isTypicalPattern(bed: string, wake: string) {
  const b = parseTime12h(bed);
  const w = parseTime12h(wake);
  if (!b || !w) return false;
  return (b.hours >= 18 || b.hours < 4) && w.hours >= 4 && w.hours < 13;
}

function hoursInBed(ctx: CheckContext, bed = ctx.text(BED), wake = ctx.text(WAKE)) {
  const b = parseTime12h(bed);
  const w = parseTime12h(wake);
  return b && w ? hoursBetween(b, w) : null;
}

function hoursSlept(ctx: CheckContext) {
  const raw = ctx.text(SLEPT);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : null;
}

/** Rangos de PSQI-4, con el margen de tolerancia aplicado al comparar. */
const SLEEP_RANGES: { label: string; min: number; max: number }[] = [
  { label: 'Menos de 5 horas', min: 0, max: 5 },
  { label: 'Entre 5 y 6 horas', min: 5, max: 6 },
  { label: 'Entre 6 y 7 horas', min: 6, max: 7 },
  { label: 'Más de 7 horas', min: 7, max: Infinity },
];

export const psqiChecks: ConsistencyCheck[] = [
  {
    id: 'psqi-time-in-bed',
    runOn: [WAKE],
    check: (ctx) => {
      const bed = ctx.text(BED);
      const wake = ctx.text(WAKE);
      const inBed = hoursInBed(ctx);
      if (!bed || !wake || inBed === null || isNormalInBed(inBed)) return null;

      // La mayoría de estos casos son AM/PM invertidos: se prueba invertir cada
      // hora y se sugiere la que deja un tiempo en cama normal, prefiriendo el
      // patrón típico (acostarse de tarde/noche y levantarse en la mañana).
      const candidates = [
        { code: BED, value: flipAmPm(bed), bed: flipAmPm(bed), wake, what: 'acostarme' },
        { code: WAKE, value: flipAmPm(wake), bed, wake: flipAmPm(wake), what: 'levantarme' },
      ].filter((c) => c.value && isNormalInBed(hoursInBed(ctx, c.bed, c.wake) ?? -1));
      const best = candidates.find((c) => isTypicalPattern(c.bed!, c.wake!)) ?? candidates[0];
      const quickFix = best
        ? {
            label: `Cambiar hora de ${best.what} a ${formatTime12h(best.value!)}`,
            answers: { [best.code]: best.value! },
          }
        : undefined;

      return {
        title: inBed < MIN_IN_BED ? 'Tu tiempo en cama es muy corto' : 'Tu tiempo en cama es muy largo',
        message: `Según tus respuestas pasas ${formatDuration(inBed)} en la cama. Revisa si elegiste bien a. m. y p. m.`,
        details: [
          { label: 'Te acuestas', value: formatTime12h(bed) },
          { label: 'Te levantas', value: formatTime12h(wake) },
          { label: 'Tiempo en cama', value: formatDuration(inBed) },
        ],
        quickFix,
        corrections: [
          { label: 'Corregir hora de levantarme' },
          { label: 'Corregir hora de acostarme', goToCode: BED },
        ],
        signature: `${bed}|${wake}`,
      };
    },
  },
  {
    id: 'psqi-slept-more-than-in-bed',
    runOn: [SLEPT],
    check: (ctx) => {
      const slept = hoursSlept(ctx);
      const inBed = hoursInBed(ctx);
      if (slept === null || inBed === null || slept <= inBed + TOLERANCE) return null;

      return {
        title: 'Duermes más horas de las que pasas en la cama',
        message:
          'Las horas que duermes no pueden ser más que el tiempo que pasas en la cama. Revisa las horas dormidas o tus horarios.',
        details: [
          { label: 'Horas dormidas', value: formatDuration(slept) },
          { label: 'Tiempo en cama', value: formatDuration(inBed) },
          { label: 'Horario', value: `${formatTime12h(ctx.text(BED)!)} a ${formatTime12h(ctx.text(WAKE)!)}` },
        ],
        corrections: [
          { label: 'Corregir horas dormidas' },
          { label: 'Corregir mis horarios', goToCode: BED },
        ],
        signature: `${slept}|${ctx.text(BED)}|${ctx.text(WAKE)}`,
      };
    },
  },
  {
    id: 'psqi-range-mismatch',
    runOn: [SLEPT],
    check: (ctx) => {
      const slept = hoursSlept(ctx);
      const label = ctx.optionLabel(RANGE);
      const range = SLEEP_RANGES.find((r) => r.label === label);
      if (slept === null || !range) return null;
      if (slept >= range.min - TOLERANCE && slept <= range.max + TOLERANCE) return null;

      const match = SLEEP_RANGES.find((r) => slept >= r.min && slept < r.max);
      const matchId = match ? ctx.optionIdByLabel(RANGE, match.label) : null;

      return {
        title: 'Tus dos respuestas sobre horas dormidas no coinciden',
        message: `Elegiste "${range.label.toLowerCase()}", pero indicaste que duermes ${formatDuration(slept)}.`,
        details: [
          { label: 'Rango elegido', value: range.label },
          { label: 'Horas exactas', value: formatDuration(slept) },
        ],
        quickFix:
          match && matchId
            ? { label: `Cambiar el rango a "${match.label.toLowerCase()}"`, answers: { [RANGE]: matchId } }
            : undefined,
        corrections: [{ label: 'Corregir mis respuestas' }],
        signature: `${slept}|${label}`,
      };
    },
  },
  {
    id: 'psqi-slept-out-of-range',
    runOn: [SLEPT],
    check: (ctx) => {
      const slept = hoursSlept(ctx);
      if (slept === null || (slept >= MIN_SLEPT && slept <= MAX_SLEPT)) return null;

      return {
        title: slept < MIN_SLEPT ? 'Indicas muy pocas horas de sueño' : 'Indicas muchas horas de sueño',
        message: `Indicas que duermes ${formatDuration(slept)} por noche en promedio. Si es correcto, puedes continuar.`,
        details: [{ label: 'Horas dormidas', value: formatDuration(slept) }],
        corrections: [{ label: 'Corregir horas dormidas' }],
        signature: String(slept),
      };
    },
  },
];
