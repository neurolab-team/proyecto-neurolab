import { useState, useEffect } from 'react';
import { QuestionRendererProps } from './rendererProps.types';
import { QuestionNotice } from './QuestionNotice';
import { TimeSelect } from './TimeSelect';
import { TimeReading } from './TimeReading';

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const AMPM = ['AM', 'PM'];
const formatAmPm = (v: string) => (v === 'AM' ? 'a. m.' : 'p. m.');

function parseTimeValue(val: string | null) {
  if (!val) return { hour: '', minute: '', ampm: '' };
  const match = val.match(/^(\d{2}):(\d{2})\s(AM|PM)$/);
  if (!match) return { hour: '', minute: '', ampm: '' };
  return { hour: match[1], minute: match[2], ampm: match[3] };
}

export const TimeInputRenderer = ({
  question,
  current,
  selectedValue,
  onOptionSelect,
  testConfig,
}: QuestionRendererProps) => {
  const { colors } = testConfig;

  const parsed = parseTimeValue(selectedValue);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [ampm, setAmpm] = useState(parsed.ampm);

  useEffect(() => {
    const p = parseTimeValue(selectedValue);
    setHour(p.hour);
    setMinute(p.minute);
    setAmpm(p.ampm);
  }, [selectedValue]);

  useEffect(() => {
    if (hour && minute && ampm) {
      onOptionSelect(question.questionId, `${hour}:${minute} ${ampm}`);
    }
  }, [hour, minute, ampm]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <QuestionNotice notice={question.metadata?.notice} />
      <h3 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: colors.primaryDark }}>
        <span style={{ color: colors.primaryLight }} className="mr-2">{current}.</span>
        {question.prompt}
      </h3>

      <div className="flex items-center gap-2">
        <TimeSelect value={hour} onChange={setHour} options={HOURS} placeholder="HH" width="w-28" ariaLabel="Hora" />
        <span className="text-2xl font-bold">:</span>
        <TimeSelect value={minute} onChange={setMinute} options={MINUTES} placeholder="MM" width="w-28" ariaLabel="Minutos" />
        <TimeSelect value={ampm} onChange={setAmpm} options={AMPM} placeholder="a. m./p. m." width="w-32" formatOption={formatAmPm} ariaLabel="a. m. o p. m." />
      </div>

      {hour && minute && ampm ? (
        <TimeReading value={`${hour}:${minute} ${ampm}`} />
      ) : (
        (hour || minute || ampm) && (
          <p className="text-red-500 text-sm mt-3">Complete todos los campos: hora, minutos y a. m./p. m.</p>
        )
      )}
    </div>
  );
};
