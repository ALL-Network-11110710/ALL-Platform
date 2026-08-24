// app/debug-env/page.tsx
'use client';

export default function DebugEnv() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Debug</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Firebase Environment Variables</h2>
        
        <div className="space-y-3">
          <div>
            <strong>NEXT_PUBLIC_FIREBASE_API_KEY:</strong> 
            <span className={process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
              {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}
            </span>
            {process.env.NEXT_PUBLIC_FIREBASE_API_KEY && (
              <div className="text-xs mt-1 bg-yellow-100 p-2 rounded">
                Value: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY}
              </div>
            )}
          </div>
          
          <div>
            <strong>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:</strong> 
            <span className={process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
              {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}
            </span>
            {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN && (
              <div className="text-xs mt-1 bg-yellow-100 p-2 rounded">
                Value: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
              </div>
            )}
          </div>
          
          <div>
            <strong>NEXT_PUBLIC_FIREBASE_PROJECT_ID:</strong> 
            <span className={process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
              {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}
            </span>
            {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && (
              <div className="text-xs mt-1 bg-yellow-100 p-2 rounded">
                Value: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Make sure .env.local is in the root directory (same level as package.json)</li>
          <li>Restart your dev server after adding/changing .env.local</li>
          <li>Check that variable names match exactly (case-sensitive)</li>
          <li>Ensure there are no spaces around the = sign in .env.local</li>
          <li>Make sure you're not committing .env.local to git</li>
        </ol>
      </div>
    </div>
  );
}