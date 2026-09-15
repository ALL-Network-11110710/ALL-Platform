// // ADZUNA API - FIXED PARAMETERS VERSION
// import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
// import { db } from './firebase';

// export interface AdzunaJob {
//   id: string;
//   title: string;
//   description: string;
//   company: {
//     display_name: string;
//   };
//   location: {
//     display_name: string;
//   };
//   salary_min?: number;
//   salary_max?: number;
//   contract_type?: string;
//   redirect_url: string;
// }

// // FIXED: Function now accepts parameters like the admin page expects
// export const fetchAdzunaJobs = async (country: string = 'in', resultsPerPage: number = 20): Promise<AdzunaJob[]> => {
//   console.log('🎯 ADZUNA API CALL WITH PARAMETERS - THIS IS NEW!');
//   console.log('📋 Parameters received:', { country, resultsPerPage });
  
//   const appId = process.env.ADZUNA_APP_ID;
//   const apiKey = process.env.ADZUNA_API_KEY;

//   console.log('🔐 Credentials check:', { appId: !!appId, apiKey: !!apiKey });

//   // Use different queries based on timestamp to ensure variety
//   const timestamp = Date.now();
//   const randomQueries = [
//     'software engineer', 
//     'web developer', 
//     'data analyst', 
//     'digital marketing',
//     'product manager',
//     'sales executive',
//     'hr recruiter',
//     'graphic designer'
//   ];
  
//   const randomQuery = randomQueries[timestamp % randomQueries.length];
//   const randomPage = (timestamp % 10) + 1; // Pages 1-10

//   console.log('📡 Making API request with:', { 
//     randomQuery, 
//     randomPage, 
//     resultsPerPage,
//     country,
//     timestamp 
//   });

//   try {
//     const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${randomPage}?app_id=${appId}&app_key=${apiKey}&results_per_page=${resultsPerPage}&what=${encodeURIComponent(randomQuery)}`;
    
//     console.log('🌐 API URL:', url);

//     const response = await fetch(url);
//     const data = await response.json();

//     console.log('📊 API Response Details:');
//     console.log('   Status:', response.status);
//     console.log('   Results Count:', data.results?.length || 0);
//     console.log('   First Job Title:', data.results?.[0]?.title || 'No jobs');
//     console.log('   First Job Company:', data.results?.[0]?.company?.display_name || 'N/A');
//     console.log('   First Job Location:', data.results?.[0]?.location?.display_name || 'N/A');

//     return data.results || [];
//   } catch (error) {
//     console.error('❌ API Error:', error);
//     return [];
//   }
// };

// export const saveAdzunaJobsToFirestore = async (jobs: AdzunaJob[], userId: string): Promise<number> => {
//   console.log('💾 SAVE FUNCTION - Processing jobs:', jobs.length);
  
//   let savedCount = 0;
//   let duplicateCount = 0;

//   for (const job of jobs) {
//     try {
//       // Check if job already exists
//       const externalId = `adzuna_${job.id}`;
//       const existsQuery = query(collection(db, 'jobs'), where('externalId', '==', externalId));
//       const querySnapshot = await getDocs(existsQuery);
      
//       if (!querySnapshot.empty) {
//         console.log('⏭️  Skipping duplicate:', job.title);
//         duplicateCount++;
//         continue;
//       }

//       const jobData = {
//         title: job.title || 'Untitled Position',
//         company: job.company?.display_name || 'Company not specified',
//         location: job.location?.display_name || 'Location not specified',
//         type: job.contract_type?.toLowerCase().includes('part') ? 'part-time' : 
//               job.contract_type?.toLowerCase().includes('contract') ? 'contract' : 
//               job.contract_type?.toLowerCase().includes('intern') ? 'internship' : 'full-time',
//         salary: job.salary_min && job.salary_max ? 
//                 `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}` : 
//                 'Not specified',
//         description: job.description || 'No description provided',
//         requirements: ['Experience in related field'],
//         postedBy: userId,
//         postedAt: serverTimestamp(),
//         isExternal: true,
//         jobLink: job.redirect_url || '#',
//         source: 'adzuna',
//         externalId: externalId
//       };

//       // Save to main jobs collection
//       await addDoc(collection(db, 'jobs'), jobData);
      
//       // Also save to apiJobs for tracking
//       await addDoc(collection(db, 'apiJobs'), {
//         ...jobData,
//         fetchedAt: new Date()
//       });
      
//       savedCount++;
//       console.log('✅ Saved job:', job.title);
      
//       // Small delay to avoid overwhelming Firebase
//       await new Promise(resolve => setTimeout(resolve, 50));
      
//     } catch (error) {
//       console.error('❌ Failed to save job:', error);
//     }
//   }
  
//   console.log('🎉 Save Summary:', {
//     saved: savedCount,
//     duplicates: duplicateCount,
//     totalProcessed: jobs.length
//   });
  
//   return savedCount;
// };


// ADZUNA API - SERVER-ROUTE VERSION (secure, no keys in browser)
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface AdzunaJob {
  id: string;
  title: string;
  description: string;
  company: {
    display_name: string;
  };
  location: {
    display_name: string;
  };
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
  redirect_url: string;
}

// Calls our own /api/adzuna route (server-side keys, no exposure to browser)
export const fetchAdzunaJobs = async (
  country: string = 'in',
  resultsPerPage: number = 20
): Promise<AdzunaJob[]> => {
  try {
    // Pick a random query for variety (same behaviour as before)
    const timestamp = Date.now();
    const randomQueries = [
      'software engineer',
      'web developer',
      'data analyst',
      'digital marketing',
      'product manager',
      'sales executive',
      'hr recruiter',
      'graphic designer'
    ];
    const randomQuery = randomQueries[timestamp % randomQueries.length];

    const url = `/api/adzuna?what=${encodeURIComponent(
      randomQuery
    )}&where=${encodeURIComponent(country)}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Adzuna API error: ${response.status}`
      );
    }

    const data = await response.json();

    // Server returns the full Adzuna response — extract the results array
    const results: AdzunaJob[] = data.results || [];

    // Enforce the requested page size (Adzuna default is 20 per page)
    return results.slice(0, resultsPerPage);
  } catch (error) {
    console.error('❌ Adzuna fetch error:', error);
    throw error;
  }
};

// ============================================================
// saveAdzunaJobsToFirestore — UNCHANGED (kept exactly the same)
// ============================================================
export const saveAdzunaJobsToFirestore = async (
  jobs: AdzunaJob[],
  userId: string
): Promise<number> => {
  let savedCount = 0;
  let duplicateCount = 0;

  for (const job of jobs) {
    try {
      // Check if job already exists (avoid duplicates)
      const externalId = `adzuna_${job.id}`;
      const existsQuery = query(
        collection(db, 'jobs'),
        where('externalId', '==', externalId)
      );
      const querySnapshot = await getDocs(existsQuery);

      if (!querySnapshot.empty) {
        duplicateCount++;
        continue;
      }

      const jobData = {
        title: job.title || 'Untitled Position',
        company: job.company?.display_name || 'Company not specified',
        location: job.location?.display_name || 'Location not specified',
        type: job.contract_type?.toLowerCase().includes('part')
          ? 'part-time'
          : job.contract_type?.toLowerCase().includes('contract')
          ? 'contract'
          : job.contract_type?.toLowerCase().includes('intern')
          ? 'internship'
          : 'full-time',
        salary:
          job.salary_min && job.salary_max
            ? `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}`
            : 'Not specified',
        description: job.description || 'No description provided',
        requirements: ['Experience in related field'],
        postedBy: userId,
        postedAt: serverTimestamp(),
        isExternal: true,
        jobLink: job.redirect_url || '#',
        source: 'adzuna',
        externalId: externalId
      };

      // Save to main jobs collection
      await addDoc(collection(db, 'jobs'), jobData);

      // Also save to apiJobs for tracking
      await addDoc(collection(db, 'apiJobs'), {
        ...jobData,
        fetchedAt: new Date()
      });

      savedCount++;

      // Small delay to avoid overwhelming Firebase
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      console.error('❌ Failed to save Adzuna job:', error);
    }
  }

  return savedCount;
};