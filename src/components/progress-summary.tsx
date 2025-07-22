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
    const strongMemorization = surahs.filter(s => s.status === 'strong-memorization').length;
    const needsRevision = surahs.filter(s => s.status === 'needs-revision').length;
    const weakMemorization = surahs.filter(s => s.status === 'weak-memorization').length;
    const inProgress = surahs.filter(s => s.status === 'in-progress').length;
    const notStarted = surahs.filter(s => s.status === 'not-started').length;

    return {
      total,
      strongMemorization,
      needsRevision,
      weakMemorization,
      inProgress,
      notStarted,
      strongMemorizationPercent: (strongMemorization / total) * 100,
      needsRevisionPercent: (needsRevision / total) * 100,
      weakMemorizationPercent: (weakMemorization / total) * 100,
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
            <span>Strong Memorization</span>
            <span>{stats.strongMemorization} of {stats.total} Surahs</span>
          </div>
          <Progress value={stats.strongMemorizationPercent} className="h-3 [&>div]:bg-green-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between font-medium">
            <span>Needs Revision</span>
            <span>{stats.needsRevision} Surahs</span>
          </div>
          <Progress value={stats.needsRevisionPercent} className="h-3 [&>div]:bg-orange-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between font-medium">
            <span>Weak Memorization</span>
            <span>{stats.weakMemorization} Surahs</span>
          </div>
          <Progress value={stats.weakMemorizationPercent} className="h-3 [&>div]:bg-accent" />
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
