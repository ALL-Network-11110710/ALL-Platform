// app/test-env-file/page.tsx
'use client';

export default function TestEnvFile() {
  const checkEnvVariables = () => {
    alert(
      `Environment variables check:\n\n` +
      `NEXT_PUBLIC_FIREBASE_API_KEY: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'SET' : 'MISSING'}\n` +
      `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'SET' : 'MISSING'}\n` +
      `NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'SET' : 'MISSING'}\n\n` +
      `If all are MISSING, your .env.local file is not in the correct location or wasn't loaded.`
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test Environment File</h1>
      
      <button 
        onClick={checkEnvVariables}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Check Environment Variables
      </button>
      
      <div className="mt-6 bg-yellow-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Common Solutions:</h2>
        <ol className="list-decimal pl-6 space-y-1">
          <li>Make sure .env.local is in the root folder (same level as package.json)</li>
          <li>Restart your dev server after creating/changing .env.local</li>
          <li>Check for typos in variable names</li>
          <li>Make sure there are no spaces around the = signs</li>
        </ol>
      </div>
    </div>
  );
}