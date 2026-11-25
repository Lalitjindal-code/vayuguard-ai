import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Top-level React Error Boundary preventing unhandled render exceptions
 * from crashing the entire VayuGuard AI workspace.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected rendering error occurred.',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('VayuGuard ErrorBoundary caught error:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-screen bg-[#070B10] text-slate-100 flex items-center justify-center p-6 font-sans"
        >
          <div className="max-w-md w-full bg-[#0C121B] border-2 border-red-500 rounded-xl p-6 brutal-shadow-red space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/15 border-2 border-red-400 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-base font-black uppercase tracking-wide text-white font-display">
                  Component Recovery Mode
                </h1>
                <p className="text-xs text-slate-400 font-mono">VayuGuard AI Diagnostic Guard</p>
              </div>
            </div>

            <p className="text-xs font-mono text-red-200 bg-red-950/40 border border-red-500/40 rounded-lg p-3">
              {this.state.errorMessage}
            </p>

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black font-mono uppercase text-xs border-2 border-emerald-500 brutal-shadow-emerald brutal-btn flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Reload Workspace
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
