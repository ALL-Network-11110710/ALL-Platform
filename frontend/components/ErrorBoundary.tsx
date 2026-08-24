'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Here you can also log errors to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  private resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚠️</span>
            </div>
            
            <h2 className="text-2xl font-bold text-black mb-4">Something went wrong</h2>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600 mb-2">Error details:</p>
              <code className="text-xs text-red-600 break-words">
                {this.state.error?.message || 'Unknown error'}
              </code>
            </div>

            <div className="space-y-3">
              <button
                onClick={this.resetError}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Go Home
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full border border-orange-500 text-orange-500 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Reload Page
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              If the problem continues, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}