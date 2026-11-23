import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DailyDefenseChecklist } from '../components/DailyDefenseChecklist';

describe('DailyDefenseChecklist Component (src/components/DailyDefenseChecklist.tsx)', () => {
  it('renders defense tracker heading and initial progress correctly', () => {
    render(<DailyDefenseChecklist />);

    expect(
      screen.getByRole('heading', { level: 3, name: /Daily Smog Defense Tracker/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/Household Shield Level/i)).toBeInTheDocument();
    expect(screen.getByText(/Grounded in AIIMS & CPCB/i)).toBeInTheDocument();
  });

  it('renders all 5 default winter smog protocols', () => {
    render(<DailyDefenseChecklist />);

    expect(screen.getByText(/Seal Windows During Morning Inversion/i)).toBeInTheDocument();
    expect(screen.getByText(/Run Bedroom Purifier \/ Box Fan Purge/i)).toBeInTheDocument();
    expect(screen.getByText(/N95 Respirator for Roadside \/ Metro Commute/i)).toBeInTheDocument();
    expect(screen.getByText(/Damp Mopping Only \(Strictly No Dry Sweeping\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Chimney \/ Cross Vent During Cooking/i)).toBeInTheDocument();
  });

  it('toggles protocol status when clicked and updates active count', () => {
    render(<DailyDefenseChecklist />);

    // Find the N95 commute protocol button (initially unchecked)
    const n95Button = screen.getByText(/N95 Respirator for Roadside/i).closest('button');
    expect(n95Button).toBeInTheDocument();

    // Click to toggle on
    if (n95Button) {
      fireEvent.click(n95Button);
      expect(screen.getByText(/4\/5 ACTIVE/i)).toBeInTheDocument();

      // Click again to toggle off
      fireEvent.click(n95Button);
      expect(screen.getByText(/3\/5 ACTIVE/i)).toBeInTheDocument();
    }
  });
});
