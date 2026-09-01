import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

// Helper to generate clean keywords from a job
function generateKeywords(job: any): string[] {
  const words = new Set<string>();
  
  // Regex to remove punctuation and split by whitespace
  const cleanAndSplit = (text: string) => {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s]/gi, '') // Removes commas, brackets, periods, etc.
      .split(/\s+/);            // Splits by spaces
  };

  const fieldsToExtract = [job.title, job.jobTitle, job.company, job.companyName, job.location];
  
  fieldsToExtract.forEach(field => {
    cleanAndSplit(field).forEach(w => words.add(w));
  });

  // Remove common stopwords
  const stopwords = new Set(['a', 'an', 'the', 'for', 'of', 'and', 'with', 'in', 'at', 'to', 'is', 'on']);
  
  return Array.from(words).filter(w => w.length > 1 && !stopwords.has(w));
}

export async function GET(request: Request) {
  // SECURITY FIX: Require a secret key in the URL to run this script
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== 'all_admin_123') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const jobsRef = collection(db, 'jobs');
    const snapshot = await getDocs(jobsRef);
    
    let updatedCount = 0;
    
    // We use Promise.all to run updates concurrently (faster)
    const updatePromises = snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      
      // Skip if keywords already exist
      if (data.keywords && data.keywords.length > 0) return;
      
      const keywords = generateKeywords(data);
      
      if (keywords.length > 0) {
        await updateDoc(doc(db, 'jobs', docSnap.id), {
          keywords: keywords
        });
        updatedCount++;
      }
    });

    await Promise.all(updatePromises);
    
    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedCount} jobs with clean keywords.`
    });
  } catch (error) {
    console.error('Backfill error:', error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}