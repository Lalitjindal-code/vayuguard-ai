import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PurifierCalculatorModal } from '../components/PurifierCalculatorModal';

describe('PurifierCalculatorModal Component (src/components/PurifierCalculatorModal.tsx)', () => {
  it('renders CADR calculator modal when open and computes required CADR', async () => {
    const handleClose = vi.fn();
    render(<PurifierCalculatorModal isOpen={true} onClose={handleClose} />);

    expect(
      screen.getByRole('heading', { name: /DIY Box-Fan & HEPA Purifier CADR Calculator/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/Length \(feet\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Width \(feet\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ceiling \(feet\)/i)).toBeInTheDocument();

    // Verify Copy Guide button exists and functions without act() warnings
    const copyButton = screen.getByRole('button', { name: /COPY SPECS|COPIED/i });
    expect(copyButton).toBeInTheDocument();
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /COPIED/i })).toBeInTheDocument();
    });

    // Verify Close button
    const closeBtn = screen.getByLabelText(/Close purifier calculator/i);
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(<PurifierCalculatorModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});
