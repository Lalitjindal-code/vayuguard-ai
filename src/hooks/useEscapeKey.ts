import { useEffect } from 'react';

/**
 * Invokes `onClose` when the user presses the Escape key while a dialog or overlay is open.
 * Ensures WCAG 2.1 AA keyboard dismissibility across all modals.
 */
export function useEscapeKey(isOpen: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
}
