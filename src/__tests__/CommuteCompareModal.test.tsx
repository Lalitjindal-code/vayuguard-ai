import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommuteCompareModal } from '../components/CommuteCompareModal';

describe('CommuteCompareModal Component (src/components/CommuteCompareModal.tsx)', () => {
  it('renders commute comparison modal with range slider and mode cards', () => {
    const handleClose = vi.fn();
    render(<CommuteCompareModal isOpen={true} onClose={handleClose} />);

    expect(
      screen.getByRole('heading', { name: /Head-to-Head Commute Exposure & Emission Evaluator/i })
    ).toBeInTheDocument();

    const slider = screen.getByRole('slider', {
      name: /Daily Round-Trip Commute Distance in Kilometers/i,
    });
    expect(slider).toBeInTheDocument();

    // Verify distance slider change
    fireEvent.change(slider, { target: { value: '25' } });
    expect(screen.getByText(/25 km \/ day/i)).toBeInTheDocument();

    // Verify all 4 modes are evaluated
    expect(screen.getByText(/Solo Petrol\/Diesel Car/i)).toBeInTheDocument();
    expect(screen.getByText(/Two-Wheeler \(Motorcycle \/ Scooter\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Metro Transit \+ E-Rickshaw/i)).toBeInTheDocument();
    expect(screen.getByText(/Electric Vehicle \/ E-Cycle \/ WFH/i)).toBeInTheDocument();

    // Close button
    const closeBtn = screen.getByLabelText(/Close commute comparison/i);
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders null when closed', () => {
    const { container } = render(<CommuteCompareModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});
