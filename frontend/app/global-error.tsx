'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🚨</span>
            </div>
            
            <h2 className="text-2xl font-bold text-black mb-4">Critical Application Error</h2>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600 mb-2">Something went wrong across the entire application:</p>
              <code className="text-xs text-red-600 break-words">
                {error.message || 'Unknown error occurred'}
              </code>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => reset()}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Go to Homepage
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              If this error continues, please contact support.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}