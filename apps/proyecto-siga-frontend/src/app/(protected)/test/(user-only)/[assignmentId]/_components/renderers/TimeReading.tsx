import { Moon, Sun, Sunrise, type LucideIcon } from 'lucide-react';
import { DayPeriod, formatTime12h, getDayPeriod, parseTime12h } from '../shared/timeMath';

const PERIOD_STYLE: Record<DayPeriod, { icon: LucideIcon; text: string; className: string }> = {
  madrugada: { icon: Moon, text: 'de la madrugada', className: 'bg-indigo-50 text-indigo-800' },
  mañana: { icon: Sunrise, text: 'de la mañana', className: 'bg-amber-50 text-amber-800' },
  tarde: { icon: Sun, text: 'de la tarde', className: 'bg-orange-50 text-orange-800' },
  noche: { icon: Moon, text: 'de la noche', className: 'bg-indigo-50 text-indigo-800' },
};

/**
 * Muestra cómo quedó interpretada la hora elegida ("10:00 p. m., de la noche")
 * para que el usuario detecte a tiempo una confusión de AM/PM.
 */
export const TimeReading = ({ value }: { value: string | null }) => {
  const parsed = parseTime12h(value);
  if (!value || !parsed) return null;

  const period = PERIOD_STYLE[getDayPeriod(parsed.hours)];
  const Icon = period.icon;

  return (
    <p
      className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${period.className}`}
      aria-live="polite"
    >
      <Icon size={16} strokeWidth={2.25} aria-hidden="true" />
      <span>
        Se registrará como <strong>{formatTime12h(value)}</strong>, {period.text}
      </span>
    </p>
  );
};
