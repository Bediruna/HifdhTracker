import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const HIFDH_COLLECTION = 'hifdh-progress';
const ADMIN_USER_ID = 'bediruna@gmail.com';

/**
 * Migration function to update old status values to new ones
 * Run this once to migrate from old 3-status system to new 5-status system
 */
export async function migrateStatusData(): Promise<void> {
  try {
    const adminDocRef = doc(db, HIFDH_COLLECTION, ADMIN_USER_ID);
    const docSnap = await getDoc(adminDocRef);

    if (!docSnap.exists()) {
      console.log('No document found to migrate');
      return;
    }

    const data = docSnap.data();
    const surahs = data.surahs;
    let updated = false;

    // Update old status values to new ones
    for (const surahId in surahs) {
      const currentStatus = surahs[surahId];
      
      // Migrate old "memorized" status to "strong-memorization"
      if (currentStatus === 'memorized') {
        surahs[surahId] = 'strong-memorization';
        updated = true;
        console.log(`Migrated surah ${surahId} from 'memorized' to 'strong-memorization'`);
      }
    }

    // Update the document if any changes were made
    if (updated) {
      await updateDoc(adminDocRef, {
        surahs: surahs,
        lastUpdated: new Date()
      });
      console.log('Migration completed successfully');
    } else {
      console.log('No migration needed - all statuses are current');
    }

  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}

// Uncomment and run this function once in your admin page to migrate the data
// migrateStatusData().then(() => console.log('Migration complete'));
