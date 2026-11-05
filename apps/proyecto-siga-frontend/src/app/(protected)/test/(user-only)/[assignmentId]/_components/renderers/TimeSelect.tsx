import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

interface TimeSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  width: string;
  /** Texto mostrado para cada opción (por defecto, el valor tal cual). */
  formatOption?: (v: string) => string;
  /** Nombre accesible del selector (p. ej. "Hora", "Minutos"). */
  ariaLabel?: string;
}

/** Selector compacto usado por las preguntas de hora y de duración. */
export function TimeSelect({
  value,
  onChange,
  options,
  placeholder,
  width,
  formatOption = (v) => v,
  ariaLabel,
}: TimeSelectProps) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className={`relative ${width}`}>
          <ListboxButton
            aria-label={ariaLabel}
            className="w-full py-3 pl-4 pr-8 border-2 border-gray-200 rounded-xl text-lg bg-white cursor-pointer text-left focus:outline-none focus:border-blue-400 transition-colors"
          >
            <span className={value ? 'text-gray-900' : 'text-gray-400'}>
              {value ? formatOption(value) : placeholder}
            </span>
            <span className="absolute inset-y-0 right-2 flex items-center">
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <ListboxOptions className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-xl bg-white border-2 border-gray-200 shadow-lg focus:outline-none">
            {options.map((opt) => (
              <ListboxOption
                key={opt}
                value={opt}
                className="cursor-pointer px-4 py-2 text-lg data-[focus]:bg-gray-100 data-[selected]:bg-blue-100 data-[selected]:font-semibold"
              >
                {formatOption(opt)}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      )}
    </Listbox>
  );
}
