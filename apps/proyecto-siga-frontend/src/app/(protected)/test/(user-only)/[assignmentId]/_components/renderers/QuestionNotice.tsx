import { QuestionNotice as QuestionNoticeData } from '@packages/common-types/question.types';

interface QuestionNoticeProps {
  notice?: QuestionNoticeData | null;
}

const VARIANT_STYLES: Record<'info' | 'warning', string> = {
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
};

/**
 * Aviso/instrucción opcional mostrado sobre el prompt de una pregunta individual.
 * Independiente de la agrupación en bloque (ver GroupedBlockRenderer para ese caso).
 */
export const QuestionNotice = ({ notice }: QuestionNoticeProps) => {
  if (!notice?.text) return null;

  const variant = notice.variant ?? 'info';

  return (
    <p
      className={`text-sm rounded-lg border px-3 py-2 mb-4 ${VARIANT_STYLES[variant]}`}
      role="note"
    >
      {notice.text}
    </p>
  );
};
