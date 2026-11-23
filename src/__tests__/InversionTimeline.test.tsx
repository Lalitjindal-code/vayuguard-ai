import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InversionTimeline } from '../components/InversionTimeline';
import { generateDiurnalHourlyCurve } from '../services/aqiService';

describe('InversionTimeline Component (src/components/InversionTimeline.tsx)', () => {
  const mockForecast = generateDiurnalHourlyCurve(295);

  it('renders section landmark and main heading', () => {
    render(<InversionTimeline hourlyForecast={mockForecast} />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Diurnal Boundary Layer Inversion & Ventilation Cycle/i,
      })
    ).toBeInTheDocument();
  });

  it('provides an accessible slider role with keyboard arrow controls', () => {
    render(<InversionTimeline hourlyForecast={mockForecast} />);

    const slider = screen.getByRole('slider', {
      name: /24-Hour Diurnal Atmospheric Inversion Scrubber/i,
    });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '23');

    // Test ArrowRight key navigation
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider).toBeInTheDocument();

    // Test ArrowLeft key navigation
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(slider).toBeInTheDocument();

    // Test Home key navigation
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(slider).toHaveAttribute('aria-valuenow', '0');

    // Test End key navigation
    fireEvent.keyDown(slider, { key: 'End' });
    expect(slider).toHaveAttribute('aria-valuenow', '23');
  });

  it('renders null gracefully when hourly forecast is empty', () => {
    const { container } = render(<InversionTimeline hourlyForecast={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
