import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
              <AlertTriangle className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="font-editorial text-xl font-bold text-stone-900 mb-2">
              {this.props.fallbackTitle || 'Workspace Render Interrupted'}
            </h2>
            <p className="text-sm text-stone-600 mb-6">
              An unexpected state error occurred while rendering this module. You can safely recover your workspace state below.
            </p>
            {this.state.error && (
              <div className="mb-6 rounded-lg bg-stone-100 p-3 text-left font-mono text-xs text-rose-800 overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C57B57] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#B36945] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C57B57] focus-visible:ring-offset-2 transition-all cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                Recover Session
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
