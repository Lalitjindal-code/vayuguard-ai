import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';

const Thrower: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Simulated widget failure');
  }
  return <div>Workspace Healthy</div>;
};

describe('ErrorBoundary Component (src/components/ErrorBoundary.tsx)', () => {
  it('renders children normally when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <Thrower shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Workspace Healthy')).toBeInTheDocument();
  });

  it('catches rendering errors and displays recovery UI', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Thrower shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Component Recovery Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/Simulated widget failure/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Workspace/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Reload Workspace/i }));
    consoleSpy.mockRestore();
  });
});
