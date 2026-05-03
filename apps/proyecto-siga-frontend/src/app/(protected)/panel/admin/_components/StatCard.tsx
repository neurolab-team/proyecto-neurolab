type StatCardProps = {
  label: string;
  value: string | number;
  description: string;
  accentClassName: string;
};

export function StatCard({
  label,
  value,
  description,
  accentClassName,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className={`mb-4 h-2 w-16 rounded-full ${accentClassName}`} />
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-4 text-4xl font-bold text-slate-900">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
