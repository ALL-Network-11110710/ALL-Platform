export default function TestEnv() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Variables Test</h1>
      
      <h2>Firebase Values:</h2>
      <p>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'MISSING'}</p>
      <p>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'MISSING'}</p>
      <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING'}</p>
      
      <h2>RapidAPI Values:</h2>
      <p>API Key: {process.env.NEXT_PUBLIC_RAPIDAPI_KEY || 'MISSING'}</p>
      <p>API Host: {process.env.NEXT_PUBLIC_RAPIDAPI_HOST || 'MISSING'}</p>
    </div>
  );
}