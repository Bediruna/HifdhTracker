import type { Surah } from '@/lib/quran-data';
import SurahCard from './surah-card';

interface HifdhTrackerProps {
  surahs: Surah[];
  isEditable: boolean;
  onProgressChange?: (id: number, memorizationStrength: number, percentMemorized: number) => void;
}

export default function HifdhTracker({ surahs, isEditable, onProgressChange }: HifdhTrackerProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {surahs.map(surah => (
        <SurahCard 
          key={surah.id} 
          surah={surah} 
          isEditable={isEditable} 
          onProgressChange={onProgressChange}
        />
      ))}
    </div>
  );
}
