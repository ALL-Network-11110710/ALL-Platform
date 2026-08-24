export default function EnvTest() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Environment Variables Test</h1>
      <p>Firebase API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'NOT FOUND'}</p>
      <p>RapidAPI Key: {process.env.NEXT_PUBLIC_RAPIDAPI_KEY || 'NOT FOUND'}</p>
      
      <h2>All Environment Variables:</h2>
      <pre>
        {JSON.stringify(process.env, null, 2)}
      </pre>
    </div>
  );
}