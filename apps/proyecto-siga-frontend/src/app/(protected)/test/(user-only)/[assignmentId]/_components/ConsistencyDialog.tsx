import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import { TriangleAlert, Wand2, Pencil, Check } from 'lucide-react';
import { TestConfig } from './config/testConfig.types';
import { IssueAction } from './config/consistency.types';
import { ActiveIssue } from '../_hooks/useConsistencyChecks';

interface ConsistencyDialogProps {
  issue: ActiveIssue | null;
  testConfig: TestConfig;
  onConfirm: () => void;
  onCorrect: (action: IssueAction) => void;
  onQuickFix: () => void;
}

/**
 * Aviso de respuesta atípica: explica qué se detectó y deja al usuario
 * corregir (con una sugerencia de un clic si existe) o confirmar y seguir.
 * Cerrarlo con Esc o clic fuera equivale a "corregir" sin moverse de página.
 */
export const ConsistencyDialog = ({
  issue,
  testConfig,
  onConfirm,
  onCorrect,
  onQuickFix,
}: ConsistencyDialogProps) => {
  const { colors } = testConfig;

  return (
    <Dialog open={issue !== null} onClose={() => onCorrect({ label: '' })} className="relative z-50">
      <div className="fixed inset-0 bg-slate-900/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {issue && (
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"
                aria-hidden="true"
              >
                <TriangleAlert size={20} strokeWidth={2.25} />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-lg font-bold" style={{ color: colors.primaryDark }}>
                  {issue.title}
                </DialogTitle>
                <Description className="mt-1 text-sm leading-relaxed text-slate-600">
                  {issue.message}
                </Description>
              </div>
            </div>

            {issue.details && issue.details.length > 0 && (
              <dl className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50 text-sm">
                {issue.details.map((d) => (
                  <div key={d.label} className="flex justify-between gap-4 px-4 py-2.5">
                    <dt className="text-slate-500">{d.label}</dt>
                    <dd className="font-semibold text-slate-800">{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-6 flex flex-col gap-2">
              {issue.quickFix && (
                <button
                  type="button"
                  onClick={onQuickFix}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Wand2 size={16} aria-hidden="true" />
                  {issue.quickFix.label}
                </button>
              )}
              {issue.corrections.map((action, i) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => onCorrect(action)}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                    !issue.quickFix && i === 0 ? 'text-white hover:opacity-90' : 'border-2 bg-white hover:bg-slate-50'
                  }`}
                  style={
                    !issue.quickFix && i === 0
                      ? { backgroundColor: colors.primary }
                      : { borderColor: colors.primary, color: colors.primary }
                  }
                >
                  <Pencil size={16} aria-hidden="true" />
                  {action.label}
                </button>
              ))}
              <button
                type="button"
                onClick={onConfirm}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
              >
                <Check size={16} aria-hidden="true" />
                Sí, es correcto, continuar
              </button>
            </div>
          </DialogPanel>
        )}
      </div>
    </Dialog>
  );
};
