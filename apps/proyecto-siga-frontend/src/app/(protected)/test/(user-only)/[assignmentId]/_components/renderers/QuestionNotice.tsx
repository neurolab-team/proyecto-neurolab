import { Bookmark, Info, TriangleAlert, type LucideIcon } from 'lucide-react';
import {
  NoticeVariant,
  QuestionNotice as QuestionNoticeData,
} from '@packages/common-types/question.types';

interface QuestionNoticeProps {
  notice?: QuestionNoticeData | null;
}

type InlineVariant = Exclude<NoticeVariant, 'section'>;

/**
 * Cada variante se distingue por más de un canal (ícono, etiqueta y color),
 * no solo por el tono, para que sea legible también sin percibir color.
 * Se evita el borde completo y el gris de los campos de entrada para que el
 * aviso no se confunda con un input.
 */
const INLINE_VARIANTS: Record<
  InlineVariant,
  { icon: LucideIcon; label: string; container: string; iconWrap: string; labelClass: string }
> = {
  info: {
    icon: Info,
    label: 'Indicación',
    container: 'bg-sky-50 border-sky-500 text-sky-950',
    iconWrap: 'bg-sky-100 text-sky-700',
    labelClass: 'text-sky-700',
  },
  warning: {
    icon: TriangleAlert,
    label: 'Importante',
    container: 'bg-amber-50 border-amber-500 text-amber-950',
    iconWrap: 'bg-amber-100 text-amber-700',
    labelClass: 'text-amber-800',
  },
};

/**
 * Cabecera de sección: ocupa todo el ancho superior de la tarjeta de la
 * pregunta (sangra sobre el padding `p-6 sm:p-8` del contenedor) con fondo
 * sólido oscuro y título grande. Así el cambio de sección se percibe aunque
 * el usuario no lea el texto.
 */
const SectionHeader = ({ label, title, text }: { label?: string; title?: string; text: string }) => (
  <div
    role="note"
    aria-label={[label ?? 'Sección', title].filter(Boolean).join(': ')}
    className="-mx-6 -mt-6 mb-6 rounded-t-2xl bg-[#0B3A66] px-6 py-5 text-white sm:-mx-8 sm:-mt-8 sm:px-8"
  >
    <div className="flex items-center gap-3">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15"
        aria-hidden="true"
      >
        <Bookmark size={18} strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-widest text-sky-200">{label ?? 'Sección'}</p>
        {title && <p className="text-lg font-bold leading-tight sm:text-xl">{title}</p>}
      </div>
    </div>
    <p className="mt-3 text-sm leading-relaxed text-white/85">{text}</p>
  </div>
);

/**
 * Aviso/instrucción opcional mostrado sobre el prompt de una pregunta individual.
 * Independiente de la agrupación en bloque (ver GroupedBlockRenderer para ese caso).
 */
export const QuestionNotice = ({ notice }: QuestionNoticeProps) => {
  if (!notice?.text) return null;

  if (notice.variant === 'section') {
    return <SectionHeader label={notice.label} title={notice.title} text={notice.text} />;
  }

  const v = INLINE_VARIANTS[notice.variant ?? 'info'];
  const Icon = v.icon;

  return (
    <div
      role="note"
      aria-label={notice.label ?? v.label}
      className={`mb-6 flex items-start gap-3 rounded-r-xl border-l-4 py-3 pl-3 pr-4 ${v.container}`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${v.iconWrap}`}
        aria-hidden="true"
      >
        <Icon size={16} strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <p className={`text-[11px] font-bold uppercase tracking-wider ${v.labelClass}`}>{notice.label ?? v.label}</p>
        {notice.title && <p className="text-sm font-bold">{notice.title}</p>}
        <p className="mt-0.5 text-sm font-medium leading-relaxed">{notice.text}</p>
      </div>
    </div>
  );
};
