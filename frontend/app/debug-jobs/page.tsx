'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function DebugJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const jobsRef = collection(db, 'jobs');
        const querySnapshot = await getDocs(jobsRef);
        
        const jobsData: any[] = [];
        querySnapshot.forEach((doc) => {
          jobsData.push({ id: doc.id, ...doc.data() });
        });
        
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (loading) return <div>Loading jobs...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug: All Jobs in Database</h1>
      <p>Total jobs: {jobs.length}</p>
      
      {jobs.map((job) => (
        <div key={job.id} style={{ 
          border: '1px solid #ccc', 
          padding: '15px', 
          margin: '10px 0',
          borderRadius: '5px'
        }}>
          <h3>{job.title}</h3>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Poster ID:</strong> {job.posterId}</p>
          <p><strong>Job ID:</strong> {job.id}</p>
          <p><strong>Posted At:</strong> {job.postedAt?.toDate?.().toString()}</p>
        </div>
      ))}
    </div>
  );
}