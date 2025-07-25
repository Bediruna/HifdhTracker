'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BookCopy, Zap, CircleCheck } from 'lucide-react';
import type { Surah } from '@/lib/quran-data';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Label } from './ui/label';

interface SurahCardProps {
  surah: Surah;
  isEditable: boolean;
  onProgressChange?: (id: number, memorizationStrength: number, percentMemorized: number) => void;
}

// Helper function to get the color and icon based on memorization strength
function getMemorizationConfig(strength: number) {
  if (strength >= 9) {
    return {
      icon: CircleCheck,
      className: 'text-green-600 border-green-600/80 bg-green-600/5',
      label: 'Excellent',
      color: 'text-green-600'
    };
  } else if (strength >= 7) {
    return {
      icon: Zap,
      className: 'text-blue-600 border-blue-600/80 bg-blue-600/5',
      label: 'Good',
      color: 'text-blue-600'
    };
  } else if (strength >= 4) {
    return {
      icon: BookCopy,
      className: 'text-orange-600 border-orange-600/80 bg-orange-600/5',
      label: 'Moderate',
      color: 'text-orange-600'
    };
  } else {
    return {
      icon: BookCopy,
      className: 'text-gray-500 border-gray-500/80 bg-gray-500/5',
      label: 'Beginner',
      color: 'text-gray-500'
    };
  }
}

export default function SurahCard({ surah, isEditable, onProgressChange }: SurahCardProps) {
  const config = getMemorizationConfig(surah.memorizationStrength);
  const Icon = config.icon;

  const handleStrengthChange = (value: number[]) => {
    if (onProgressChange) {
      onProgressChange(surah.id, value[0], surah.percentMemorized);
    }
  };

  const handlePercentChange = (value: number[]) => {
    if (onProgressChange) {
      onProgressChange(surah.id, surah.memorizationStrength, value[0]);
    }
  };

  return (
    <Card className={cn("flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1", config.className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="font-headline text-xl">{surah.id}. {surah.name}</CardTitle>
          <Icon className="h-6 w-6 shrink-0" />
        </div>
        <CardDescription className="text-foreground/70">{surah.englishName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
         <div className="flex items-center space-x-4 text-sm text-foreground/80">
            <div className="flex items-center">
              <BookCopy className="mr-1.5 h-4 w-4" />
              {surah.numberOfAyahs} Ayahs
            </div>
            <Badge variant="outline" className="border-current">{surah.revelationType}</Badge>
          </div>
          
          {/* Progress Display */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-medium">Percent Memorized</Label>
                <span className={cn("text-sm font-semibold", config.color)}>{surah.percentMemorized}%</span>
              </div>
              <Progress value={surah.percentMemorized} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-medium">Memorization Strength</Label>
                <span className={cn("text-sm font-semibold", config.color)}>{surah.memorizationStrength}/10</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">1</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-300"
                    style={{ width: `${(surah.memorizationStrength / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">10</span>
              </div>
            </div>
          </div>
      </CardContent>
      <CardFooter>
        {isEditable ? (
          <div className="w-full space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Memorization Strength: {surah.memorizationStrength}</Label>
              <Slider
                value={[surah.memorizationStrength]}
                onValueChange={handleStrengthChange}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Percent Memorized: {surah.percentMemorized}%</Label>
              <Slider
                value={[surah.percentMemorized]}
                onValueChange={handlePercentChange}
                min={1}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        ) : (
          <div className="w-full">
            <p className={cn("text-sm font-semibold text-center", config.color)}>{config.label}</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
