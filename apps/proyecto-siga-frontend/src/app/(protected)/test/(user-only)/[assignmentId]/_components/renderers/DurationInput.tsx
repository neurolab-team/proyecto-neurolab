import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { TimeSelect } from './TimeSelect';
import { formatDuration, joinHours, splitHours } from '../shared/timeMath';

interface DurationInputProps {
  value: string | null;
  onChange: (value: string) => void;
  maxHours: number;
  minuteStep: number;
}

/** Lee un valor guardado en horas decimales; ignora valores fuera de rango. */
function parseValue(value: string | null, maxHours: number) {
  const n = value ? Number(value) : NaN;
  if (!Number.isFinite(n) || n < 0 || n > maxHours) return { h: '', m: '' };
  const { h, m } = splitHours(n);
  return { h: String(h), m: String(m).padStart(2, '0') };
}

/**
 * Captura una duración con selectores de horas y minutos en vez de un campo
 * libre, de modo que no se puedan escribir valores imposibles (p. ej. "430"
 * cuando se quería decir 4 h 30 min). Guarda la respuesta en horas decimales.
 */
export const DurationInput = ({ value, onChange, maxHours, minuteStep }: DurationInputProps) => {
  const hourOptions = Array.from({ length: maxHours + 1 }, (_, i) => String(i));
  const minuteOptions = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) =>
    String(i * minuteStep).padStart(2, '0'),
  );

  const initial = parseValue(value, maxHours);
  const [h, setH] = useState(initial.h);
  const [m, setM] = useState(initial.m);

  // Sincroniza si la respuesta cambia desde fuera (p. ej. al restaurar progreso).
  useEffect(() => {
    const next = parseValue(value, maxHours);
    setH(next.h);
    setM(next.m);
  }, [value, maxHours]);

  const commit = (nextH: string, nextM: string) => {
    if (!nextH) return;
    onChange(joinHours(Number(nextH), Number(nextM || '0')));
  };

  const handleHours = (v: string) => {
    const nextM = m || '00';
    setH(v);
    setM(nextM);
    commit(v, nextM);
  };

  const handleMinutes = (v: string) => {
    setM(v);
    commit(h, v);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <TimeSelect
          value={h}
          onChange={handleHours}
          options={hourOptions}
          placeholder="Horas"
          width="w-32"
          formatOption={(v) => `${v} h`}
          ariaLabel="Horas"
        />
        <TimeSelect
          value={m}
          onChange={handleMinutes}
          options={minuteOptions}
          placeholder="Min"
          width="w-32"
          formatOption={(v) => `${v} min`}
          ariaLabel="Minutos"
        />
      </div>
      {h && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
          <Clock size={16} strokeWidth={2.25} aria-hidden="true" />
          <span>
            Total: <strong>{formatDuration(Number(h) + Number(m || '0') / 60)}</strong>
          </span>
        </p>
      )}
    </div>
  );
};
