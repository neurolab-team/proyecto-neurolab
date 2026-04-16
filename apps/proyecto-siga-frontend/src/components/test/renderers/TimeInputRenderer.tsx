import { useState, useEffect } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { QuestionRendererProps } from './rendererProps.types';

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const AMPM = ['AM', 'PM'];

function parseTimeValue(val: string | null) {
  if (!val) return { hour: '', minute: '', ampm: '' };
  const match = val.match(/^(\d{2}):(\d{2})\s(AM|PM)$/);
  if (!match) return { hour: '', minute: '', ampm: '' };
  return { hour: match[1], minute: match[2], ampm: match[3] };
}

const ChevronIcon = ({ className }: { className?: string }) => (
  <svg className={`w-4 h-4 text-gray-500 ${className ?? ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

function TimeSelect({ value, onChange, options, placeholder, width }: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  width: string;
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className={`relative ${width}`}>
          <ListboxButton className="w-full  py-3 pl-4 pr-8 border-2 border-gray-200 rounded-xl text-lg bg-white cursor-pointer text-left focus:outline-none focus:border-blue-400 transition-colors">
            <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || placeholder}</span>
            <span className="absolute inset-y-0 right-2 flex items-center">
              <ChevronIcon className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </span>
          </ListboxButton>
          <ListboxOptions className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-xl bg-white border-2 border-gray-200 shadow-lg focus:outline-none">
            {options.map((opt) => (
              <ListboxOption
                key={opt}
                value={opt}
                className="cursor-pointer px-4 py-2 text-lg data-[focus]:bg-gray-100 data-[selected]:bg-blue-100 data-[selected]:font-semibold"
              >
                {opt}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      )}
    </Listbox>
  );
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
      <h3 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: colors.primaryDark }}>
        <span style={{ color: colors.primaryLight }} className="mr-2">{current}.</span>
        {question.prompt}
      </h3>

      <div className="flex items-center gap-2">
        <TimeSelect value={hour} onChange={setHour} options={HOURS} placeholder="HH" width="w-28" />
        <span className="text-2xl font-bold">:</span>
        <TimeSelect value={minute} onChange={setMinute} options={MINUTES} placeholder="MM" width="w-28" />
        <TimeSelect value={ampm} onChange={setAmpm} options={AMPM} placeholder="AM/PM" width="w-32" />
      </div>

      {(hour || minute || ampm) && !(hour && minute && ampm) && (
        <p className="text-red-500 text-sm mt-3">Complete todos los campos: hora, minutos y AM/PM.</p>
      )}
    </div>
  );
};
