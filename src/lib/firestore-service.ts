import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { db } from './firebase';
import { Surah, quranData } from './quran-data';

const HIFDH_COLLECTION = 'hifdh-progress';
const ADMIN_USER_ID = 'bediruna@gmail.com';

export interface SurahProgress {
  memorizationStrength: number; // 1-10
  percentMemorized: number; // 1-100
}

export interface HifdhProgress {
  userId: string;
  surahs: Record<number, SurahProgress>;
  lastUpdated: Date;
}

/**
 * Initialize user's hifdh progress in Firestore with default data
 */
export async function initializeUserProgress(userId: string): Promise<void> {
  const userDocRef = doc(db, HIFDH_COLLECTION, userId);
  
  // Convert quranData array to Record<number, SurahProgress>
  const surahsRecord: Record<number, SurahProgress> = {};
  quranData.forEach(surah => {
    surahsRecord[surah.id] = {
      memorizationStrength: surah.memorizationStrength,
      percentMemorized: surah.percentMemorized
    };
  });

  const progressData: HifdhProgress = {
    userId,
    surahs: surahsRecord,
    lastUpdated: new Date()
  };

  await setDoc(userDocRef, progressData);
}

/**
 * Get user's hifdh progress from Firestore
 */
export async function getUserProgress(userId: string): Promise<Surah[]> {
  try {
    const userDocRef = doc(db, HIFDH_COLLECTION, userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as HifdhProgress;
      
      // Merge with quranData to get the full surah information
      return quranData.map(surah => {
        const progress = data.surahs[surah.id];
        return {
          ...surah,
          memorizationStrength: progress?.memorizationStrength || surah.memorizationStrength,
          percentMemorized: progress?.percentMemorized || surah.percentMemorized
        };
      });
    } else {
      // Initialize with default data if document doesn't exist
      await initializeUserProgress(userId);
      return quranData;
    }
  } catch (error) {
    console.error('Error getting user progress:', error);
    // Return default data if there's an error
    return quranData;
  }
}

/**
 * Update a specific surah's progress in Firestore
 */
export async function updateSurahProgress(
  userId: string, 
  surahId: number, 
  memorizationStrength: number,
  percentMemorized: number
): Promise<void> {
  try {
    const userDocRef = doc(db, HIFDH_COLLECTION, userId);
    
    // Check if document exists
    const docSnap = await getDoc(userDocRef);
    
    if (!docSnap.exists()) {
      // Initialize first if document doesn't exist
      await initializeUserProgress(userId);
    }

    // Update the specific surah progress
    await updateDoc(userDocRef, {
      [`surahs.${surahId}.memorizationStrength`]: memorizationStrength,
      [`surahs.${surahId}.percentMemorized`]: percentMemorized,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error updating surah progress:', error);
    throw error;
  }
}

/**
 * Get admin progress (for public display)
 */
export async function getAdminProgress(): Promise<Surah[]> {
  return getUserProgress(ADMIN_USER_ID);
}

/**
 * Update admin progress (only admin can do this)
 */
export async function updateAdminProgress(
  surahId: number, 
  memorizationStrength: number,
  percentMemorized: number
): Promise<void> {
  return updateSurahProgress(ADMIN_USER_ID, surahId, memorizationStrength, percentMemorized);
}
