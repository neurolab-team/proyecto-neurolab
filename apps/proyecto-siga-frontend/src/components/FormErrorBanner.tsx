interface FormErrorBannerProps {
  message?: string | string[] | null;
  className?: string;
}

export default function FormErrorBanner({
  message,
  className = "",
}: FormErrorBannerProps) {
  if (!message || (Array.isArray(message) && message.length === 0)) return null;

  const messages = Array.isArray(message) ? message : [message];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`.trim()}
    >
      <div className="flex items-start gap-3">
        <svg
          className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.66 18h16.68a1 1 0 00.87-1.5l-7.5-13a1 1 0 00-1.74 0z"
          />
        </svg>

        {messages.length === 1 ? (
          <p>{messages[0]}</p>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {messages.map((msg, i) => <li key={i}>{msg}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
