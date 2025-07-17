'use client';
import type { Surah } from '@/lib/quran-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useMemo } from 'react';

interface ProgressSummaryProps {
  surahs: Surah[];
}

export default function ProgressSummary({ surahs }: ProgressSummaryProps) {
  const stats = useMemo(() => {
    const total = surahs.length;
    const memorized = surahs.filter(s => s.status === 'memorized').length;
    const inProgress = surahs.filter(s => s.status === 'in-progress').length;
    const notStarted = surahs.filter(s => s.status === 'not-started').length;

    return {
      total,
      memorized,
      inProgress,
      notStarted,
      memorizedPercent: (memorized / total) * 100,
      inProgressPercent: (inProgress / total) * 100,
      notStartedPercent: (notStarted / total) * 100,
    };
  }, [surahs]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Overall Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between font-medium">
            <span>Memorized</span>
            <span>{stats.memorized} of {stats.total} Surahs</span>
          </div>
          <Progress value={stats.memorizedPercent} className="h-3 [&>div]:bg-accent" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between font-medium">
            <span>In Progress</span>
            <span>{stats.inProgress} Surahs</span>
          </div>
          <Progress value={stats.inProgressPercent} className="h-3" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between font-medium text-foreground/70">
            <span>Not Started</span>
            <span>{stats.notStarted} Surahs</span>
          </div>
          <Progress value={stats.notStartedPercent} className="h-3 bg-muted-foreground/20 [&>div]:bg-muted-foreground/50" />
        </div>
      </CardContent>
    </Card>
  );
}
