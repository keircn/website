"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      return (
        <div className="border border-red-200 bg-red-50/10 rounded-lg p-4 my-4">
          <div className="flex items-start gap-3">
            <div className="text-red-400 text-lg">⚠️</div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-400 mb-2">
                Something went wrong
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <button
                type="button"
                onClick={this.resetError}
                className="px-3 py-1 bg-muted text-foreground rounded hover:opacity-90 transition text-sm"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
