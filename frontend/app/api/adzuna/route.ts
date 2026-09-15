import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Get search parameters from the frontend (e.g., "developer", "India")
  const { searchParams } = new URL(request.url);
  const what = searchParams.get('what') || 'developer';
  const where = searchParams.get('where') || 'in'; // 'in' is Adzuna's country code for India

  // 2. Safely load the hidden server-side variables
  const appId = process.env.ADZUNA_APP_ID;
  const apiKey = process.env.ADZUNA_API_KEY;

  if (!appId || !apiKey) {
    return NextResponse.json({ error: 'Adzuna API credentials missing on server' }, { status: 500 });
  }

  try {
    // 3. Make the request to Adzuna from the server
    const response = await fetch(
      `https://api.adzuna.com/v1/api/jobs/${where}/search/1?app_id=${appId}&app_key=${apiKey}&what=${what}`
    );
    
    if (!response.ok) {
        throw new Error(`Adzuna API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Adzuna Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch jobs from Adzuna' }, { status: 500 });
  }
}