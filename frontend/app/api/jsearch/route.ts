import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'developer in India';

  const rapidApiKey = process.env.RAPIDAPI_KEY;
  const rapidApiHost = process.env.RAPIDAPI_HOST || 'jsearch.p.rapidapi.com';

  if (!rapidApiKey) {
    return NextResponse.json({ error: 'RapidAPI credentials missing on server' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}`, 
      {
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': rapidApiHost,
        }
      }
    );

    if (!response.ok) {
        throw new Error(`JSearch API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("JSearch Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch jobs from JSearch' }, { status: 500 });
  }
}