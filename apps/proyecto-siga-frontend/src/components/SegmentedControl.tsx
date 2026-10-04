import type { UseFormRegisterReturn } from "react-hook-form";

export interface SegmentedOption {
  value: string;
  label: string;
  helper?: string;
}

interface SegmentedControlProps {
  legend: string;
  options: SegmentedOption[];
  registration: UseFormRegisterReturn;
  hint?: string;
  error?: string;
  columnsClassName?: string;
  required?: boolean;
}

/**
 * Grupo de botones segmentados para selección rápida de una sola opción.
 * Usa radios nativos ocultos (`peer` + `sr-only`), así conserva la semántica,
 * el manejo de teclado y la agrupación del navegador sin estado adicional.
 */
export default function SegmentedControl({
  legend,
  options,
  registration,
  hint,
  error,
  columnsClassName = "grid-cols-1 sm:grid-cols-3",
  required = false,
}: SegmentedControlProps) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-gray-800">
        {legend}
        {required && <span className="text-[#00A0B7]"> *</span>}
      </legend>
      {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}

      <div className={`mt-2 grid gap-2 ${columnsClassName}`}>
        {options.map((option) => (
          <label key={option.value} className="cursor-pointer">
            <input
              type="radio"
              value={option.value}
              {...registration}
              className="peer sr-only"
            />
            <span className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-3 py-2.5 text-center text-sm font-semibold text-gray-600 transition-all hover:border-[#2a4d8f]/60 hover:bg-blue-50/60 peer-checked:border-[#102D69] peer-checked:bg-[#102D69] peer-checked:text-white peer-checked:shadow-md peer-focus-visible:ring-2 peer-focus-visible:ring-[#2a4d8f] peer-focus-visible:ring-offset-2">
              {option.label}
              {option.helper && (
                <span className="mt-0.5 block text-[11px] font-normal opacity-75">
                  {option.helper}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-1.5 text-sm text-red-500">
          {error}
        </p>
      )}
    </fieldset>
  );
}
