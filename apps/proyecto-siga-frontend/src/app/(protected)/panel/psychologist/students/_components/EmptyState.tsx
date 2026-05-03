type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
      {message}
    </div>
  );
}
