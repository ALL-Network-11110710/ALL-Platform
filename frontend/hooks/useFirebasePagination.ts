import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { getDocs, query, collection, startAfter, QueryDocumentSnapshot, DocumentData, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useFirebasePagination(collectionName: string, queryConstraints: QueryConstraint[], cacheKey: string | null) {
  const [dataList, setDataList] = useState<any[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // SWR automatically handles caching, deduping, and background revalidation
  const { data: firstPageData, error, isLoading, mutate } = useSWR(
    cacheKey,
    async () => {
      const q = query(collection(db, collectionName), ...queryConstraints);
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setDataList(docs);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === 20); // Assumes your limit is 20
      
      return docs;
    },
    { 
      revalidateOnFocus: false, // Prevents refetching just because you clicked a different browser tab
      dedupingInterval: 60000   // Cache strictly for 1 minute
    }
  );

  const loadMore = useCallback(async () => {
    if (!lastVisible || !hasMore || loadingMore) return;
    setLoadingMore(true);

    try {
      const q = query(collection(db, collectionName), ...queryConstraints, startAfter(lastVisible));
      const snapshot = await getDocs(q);
      const newDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setDataList(prev => [...prev, ...newDocs]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === 20);
    } catch (err) {
      console.error(`Error loading more ${collectionName}:`, err);
    } finally {
      setLoadingMore(false);
    }
  }, [lastVisible, hasMore, loadingMore, collectionName, queryConstraints]);

  return {
    data: dataList.length > 0 ? dataList : (firstPageData || []),
    isLoading,
    loadingMore,
    hasMore,
    loadMore,
    refresh: () => {
      setLastVisible(null);
      setHasMore(true);
      mutate();
    }
  };
}