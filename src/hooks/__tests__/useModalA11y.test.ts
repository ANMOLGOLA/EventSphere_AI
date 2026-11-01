import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { renderHook } from '@testing-library/react';
import { useModalA11y } from '../useModalA11y';

describe('useModalA11y hook', () => {
  it('calls onClose when Escape key is pressed while open', () => {
    const onClose = vi.fn();
    renderHook(() => useModalA11y(true, onClose));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when Escape is pressed while closed', () => {
    const onClose = vi.fn();
    renderHook(() => useModalA11y(false, onClose));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks and restores document body overflow style', () => {
    const onClose = vi.fn();
    const { unmount } = renderHook(() => useModalA11y(true, onClose));

    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
