type QuickActionCardProps = {
  title: string;
  description: string;
  ctaLabel: string;
  onClick?: () => void;
  disabled?: boolean;
};

export function QuickActionCard({
  title,
  description,
  ctaLabel,
  onClick,
  disabled = false,
}: QuickActionCardProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-xl font-bold text-[#102D69]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`mt-6 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
          disabled
            ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
            : "bg-gradient-to-r from-[#102D69] to-[#00A0B7] text-white hover:shadow-lg"
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
