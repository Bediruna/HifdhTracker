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
import { Surah, SurahStatus, quranData } from './quran-data';

const HIFDH_COLLECTION = 'hifdh-progress';
const ADMIN_USER_ID = 'bediruna@gmail.com';

export interface HifdhProgress {
  userId: string;
  surahs: Record<number, SurahStatus>;
  lastUpdated: Date;
}

/**
 * Initialize user's hifdh progress in Firestore with default data
 */
export async function initializeUserProgress(userId: string): Promise<void> {
  const userDocRef = doc(db, HIFDH_COLLECTION, userId);
  
  // Convert quranData array to Record<number, SurahStatus>
  const surahsRecord: Record<number, SurahStatus> = {};
  quranData.forEach(surah => {
    surahsRecord[surah.id] = surah.status;
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
      return quranData.map(surah => ({
        ...surah,
        status: data.surahs[surah.id] || surah.status
      }));
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
 * Update a specific surah's status in Firestore
 */
export async function updateSurahStatus(
  userId: string, 
  surahId: number, 
  status: SurahStatus
): Promise<void> {
  try {
    const userDocRef = doc(db, HIFDH_COLLECTION, userId);
    
    // Check if document exists
    const docSnap = await getDoc(userDocRef);
    
    if (!docSnap.exists()) {
      // Initialize first if document doesn't exist
      await initializeUserProgress(userId);
    }

    // Update the specific surah status
    await updateDoc(userDocRef, {
      [`surahs.${surahId}`]: status,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error updating surah status:', error);
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
  status: SurahStatus
): Promise<void> {
  return updateSurahStatus(ADMIN_USER_ID, surahId, status);
}
