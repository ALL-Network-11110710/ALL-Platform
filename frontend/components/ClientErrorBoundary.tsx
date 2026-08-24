'use client';

import { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import ErrorFallback from './ErrorFallback';

interface ClientErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
}

export default function ClientErrorBoundary({ 
  children, 
  fallbackMessage = 'This component encountered an error' 
}: ClientErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback 
          error={new Error(fallbackMessage)} 
          resetErrorBoundary={() => window.location.reload()} 
        />
      }
    >
      {children}
    </ErrorBoundary>
  );
}