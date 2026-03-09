import { ReactNode } from "react";

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  backdropClassName?: string;
  panelClassName?: string;
  closeButtonClassName?: string;
  hideCloseButton?: boolean;
}

export default function ModalShell({
  isOpen,
  onClose,
  children,
  backdropClassName = "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
  panelClassName = "bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative",
  closeButtonClassName = "absolute top-4 right-4 text-gray-400 hover:text-gray-600",
  hideCloseButton = false,
}: ModalShellProps) {
  if (!isOpen) return null;

  return (
    <div className={backdropClassName} onClick={onClose}>
      <div className={panelClassName} onClick={(e) => e.stopPropagation()}>
        {!hideCloseButton && (
          <button onClick={onClose} className={closeButtonClassName}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
