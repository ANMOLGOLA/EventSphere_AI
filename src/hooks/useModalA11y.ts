import { useEffect } from 'react';

/**
 * useModalA11y — Custom React hook implementing WAI-ARIA Dialog keyboard & scroll patterns.
 * 
 * 1. Attaches an Escape key listener that cleanly invokes onClose().
 * 2. Prevents background page scrolling while the dialog is visible.
 * 3. Gracefully restores body scroll when unmounted or closed.
 *
 * @param isOpen - Whether the modal dialog is currently open.
 * @param onClose - Callback invoked when the user requests dialog dismissal.
 */
export function useModalA11y(isOpen: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    // Lock body scrolling to prevent background scroll leaks
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);
}

