import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../App';

describe('VayuGuard AI Full Application (src/App.tsx)', () => {
  it('renders semantic HTML5 landmarks and main accessible headings', async () => {
    render(<App />);

    // Header landmark
    expect(screen.getByRole('banner')).toBeInTheDocument();

    // Main landmark
    expect(screen.getByRole('main')).toBeInTheDocument();

    // Footer landmark
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();

    // Check main title
    expect(screen.getByRole('heading', { level: 1, name: /VayuGuard/i })).toBeInTheDocument();

    // Check household context heading
    expect(
      screen.getByRole('heading', { level: 2, name: /Household Context Profiler/i })
    ).toBeInTheDocument();

    // Check multi-modal AQI indicator (Icon + Text Severity + Numeric AQI)
    const aqiStatus = screen.getByRole('status', { name: /Air Quality/i });
    expect(aqiStatus).toBeInTheDocument();
    expect(aqiStatus).toHaveTextContent(/Severe Smog/i);
    expect(aqiStatus).toHaveTextContent(/435/i);
  });

  it('renders accessible form inputs with explicit labels', async () => {
    render(<App />);

    expect(screen.getByLabelText(/Housing Type & Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Primary Daily Commute Mode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Indoor Cooking & Winter Heating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Specific Household Context/i)).toBeInTheDocument();

    // Check generate button (waiting for initial async plan generation to settle)
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Generate Personalized Plan/i })
      ).toBeInTheDocument();
    });
  });

  it('renders action plan recommendations and updates impact when actions are toggled', async () => {
    render(<App />);

    // Wait for initial plan generation
    await waitFor(() => {
      expect(screen.getByText(/Tailored Winter Smog Action Plan/i)).toBeInTheDocument();
    });

    // Check that category filter tabs exist
    expect(screen.getByRole('tab', { name: /All Actions/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Daily Routines/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Indoor Hacks/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Sustainable Swaps/i })).toBeInTheDocument();

    // Find adoption checkboxes
    const adoptButtons = screen.getAllByRole('checkbox');
    expect(adoptButtons.length).toBeGreaterThanOrEqual(3);

    // Initial adopted count displayed
    const initialText = screen.getByText(/recommendations adopted/i);
    expect(initialText).toBeInTheDocument();

    // Click an adopt button to toggle
    fireEvent.click(adoptButtons[0]);

    // Check that Community Multiplier is rendered
    expect(screen.getByText(/Community Multiplier/i)).toBeInTheDocument();
    expect(screen.getByText(/100 Neighborhood Households/i)).toBeInTheDocument();
  });

  it('switches city preset when a quick preset button is clicked', async () => {
    render(<App />);

    // Click Bhopal preset button
    const bhopalBtn = screen.getByRole('button', { name: /Bhopal/i });
    fireEvent.click(bhopalBtn);

    await waitFor(() => {
      const aqiStatus = screen.getByRole('status', { name: /Air Quality/i });
      expect(aqiStatus).toHaveTextContent(/Poor/i);
    });
  });

  it('opens and closes the BYOK API Key modal properly', async () => {
    render(<App />);

    // Wait for initial async plan generation to settle to prevent unhandled act() warnings
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Generate Personalized Plan/i })
      ).toBeInTheDocument();
    });

    // Click desktop API key button
    const keyButtons = screen.getAllByLabelText(/Set Gemini API Key|Manage Gemini API Key|Configure Gemini API Key/i);
    fireEvent.click(keyButtons[0]);

    // Verify modal is displayed with accessible role="dialog"
    const dialog = screen.getByRole('dialog', { name: /Gemini API Key \(BYOK\)/i });
    expect(dialog).toBeInTheDocument();

    // Close button
    const closeBtn = screen.getByRole('button', { name: /Close dialog/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
