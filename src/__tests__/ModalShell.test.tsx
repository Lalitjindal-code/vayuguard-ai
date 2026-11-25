import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalShell } from '../components/ModalShell';

describe('ModalShell Component (src/components/ModalShell.tsx)', () => {
  it('dismisses modal on Escape key press and backdrop click', () => {
    const handleClose = vi.fn();

    render(
      <ModalShell
        isOpen={true}
        onClose={handleClose}
        titleId="test-modal-title"
        title="Test Modal"
        subtitle="Subtitle text"
        icon={<span>Icon</span>}
        closeAriaLabel="Close test modal"
      >
        <div>Modal Body Content</div>
      </ModalShell>
    );

    const dialog = screen.getByRole('dialog', { name: /Test Modal/i });
    expect(dialog).toBeInTheDocument();

    // Pressing Escape invokes onClose
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Clicking directly on backdrop invokes onClose
    fireEvent.mouseDown(dialog);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('does not render when closed', () => {
    const { container } = render(
      <ModalShell
        isOpen={false}
        onClose={vi.fn()}
        titleId="test-modal-title"
        title="Closed Modal"
        subtitle="Subtitle"
        icon={<span>Icon</span>}
        closeAriaLabel="Close test modal"
      >
        <div>Hidden</div>
      </ModalShell>
    );

    expect(container.firstChild).toBeNull();
  });
});
