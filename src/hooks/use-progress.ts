'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Surah, quranData } from '@/lib/quran-data';
import { HifdhProgress } from '@/lib/firestore-service';

const HIFDH_COLLECTION = 'hifdh-progress';
const ADMIN_USER_ID = 'bediruna@gmail.com';

export function useAdminProgress() {
  const [surahs, setSurahs] = useState<Surah[]>(quranData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useAdminProgress: Setting up Firestore listener...');
    const adminDocRef = doc(db, HIFDH_COLLECTION, ADMIN_USER_ID);
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('useAdminProgress: Timeout reached, using default data');
      setLoading(false);
      setError('Connection timeout - using default data');
    }, 10000); // 10 second timeout
    
    const unsubscribe = onSnapshot(
      adminDocRef,
      (doc) => {
        try {
          console.log('useAdminProgress: Firestore snapshot received', { exists: doc.exists() });
          clearTimeout(timeoutId);
          
          if (doc.exists()) {
            const data = doc.data() as HifdhProgress;
            console.log('useAdminProgress: Document data found', data);
            
            // Merge with quranData to get the full surah information
            const updatedSurahs = quranData.map(surah => {
              const progress = data.surahs[surah.id];
              return {
                ...surah,
                memorizationStrength: progress?.memorizationStrength || surah.memorizationStrength,
                percentMemorized: progress?.percentMemorized || surah.percentMemorized
              };
            });
            
            setSurahs(updatedSurahs);
          } else {
            console.log('useAdminProgress: No document found, using default data');
            // Use default data if document doesn't exist
            setSurahs(quranData);
          }
          setError(null);
        } catch (err) {
          console.error('Error processing admin progress:', err);
          clearTimeout(timeoutId);
          setError('Failed to load progress');
          setSurahs(quranData); // Fallback to default data
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error listening to admin progress:', err);
        clearTimeout(timeoutId);
        setError('Failed to connect to database');
        setSurahs(quranData); // Fallback to default data
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  return { surahs, loading, error };
}

export function useUserProgress(userId: string | null) {
  const [surahs, setSurahs] = useState<Surah[]>(quranData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, HIFDH_COLLECTION, userId);
    
    const unsubscribe = onSnapshot(
      userDocRef,
      (doc) => {
        try {
          if (doc.exists()) {
            const data = doc.data() as HifdhProgress;
            
            // Merge with quranData to get the full surah information
            const updatedSurahs = quranData.map(surah => {
              const progress = data.surahs[surah.id];
              return {
                ...surah,
                memorizationStrength: progress?.memorizationStrength || surah.memorizationStrength,
                percentMemorized: progress?.percentMemorized || surah.percentMemorized
              };
            });
            
            setSurahs(updatedSurahs);
          } else {
            // Use default data if document doesn't exist
            setSurahs(quranData);
          }
          setError(null);
        } catch (err) {
          console.error('Error processing user progress:', err);
          setError('Failed to load progress');
          setSurahs(quranData); // Fallback to default data
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error listening to user progress:', err);
        setError('Failed to connect to database');
        setSurahs(quranData); // Fallback to default data
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { surahs, loading, error };
}
