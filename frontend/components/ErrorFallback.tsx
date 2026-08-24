'use client';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">❌</span>
        </div>
        
        <h2 className="text-xl font-bold text-black mb-2">Oops! Something went wrong</h2>
        
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600 break-words">
            {error.message}
          </p>
        </div>

        <button
          onClick={resetErrorBoundary}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
        
        <p className="mt-4 text-sm text-gray-500">
          We apologize for the inconvenience.
        </p>
      </div>
    </div>
  );
}