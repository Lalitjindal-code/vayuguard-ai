import React from 'react';
import { X } from 'lucide-react';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconWrapperClassName?: string;
  closeAriaLabel: string;
  maxWidthClassName?: string;
  children: React.ReactNode;
}

/**
 * Shared accessible Neo-Brutalist modal shell with backdrop click dismissal,
 * Escape key handling, and standardized dialog landmarks.
 */
export const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  onClose,
  titleId,
  title,
  subtitle,
  icon,
  iconWrapperClassName = 'bg-cyan-500/10 border-2 border-cyan-400 text-cyan-400',
  closeAriaLabel,
  maxWidthClassName = 'max-w-2xl',
  children,
}) => {
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div
        className={`w-full ${maxWidthClassName} bg-[#0C121B] border-2 border-slate-700 rounded-xl brutal-shadow p-6 relative my-8`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label={closeAriaLabel}
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 mb-5 pr-8">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center brutal-shadow-sm font-bold flex-shrink-0 ${iconWrapperClassName}`}
          >
            {icon}
          </div>
          <div>
            <h2
              id={titleId}
              className="text-base font-black uppercase tracking-wide text-white font-display"
            >
              {title}
            </h2>
            <p className="text-xs text-slate-400 font-mono">{subtitle}</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};
