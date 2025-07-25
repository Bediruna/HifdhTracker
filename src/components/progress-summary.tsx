'use client';
import type { Surah } from '@/lib/quran-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';

interface ProgressSummaryProps {
  surahs: Surah[];
}

export default function ProgressSummary({ surahs }: ProgressSummaryProps) {
  const stats = useMemo(() => {
    const total = surahs.length;
    
    // Calculate based on memorization strength levels
    const excellent = surahs.filter(s => s.memorizationStrength >= 9).length; // 9-10
    const good = surahs.filter(s => s.memorizationStrength >= 7 && s.memorizationStrength < 9).length; // 7-8
    const moderate = surahs.filter(s => s.memorizationStrength >= 4 && s.memorizationStrength < 7).length; // 4-6
    const beginner = surahs.filter(s => s.memorizationStrength < 4).length; // 1-3
    
    // Calculate average progress
    const totalMemorization = surahs.reduce((sum, s) => sum + s.percentMemorized, 0);
    const averageMemorization = total > 0 ? totalMemorization / total : 0;
    
    const totalStrength = surahs.reduce((sum, s) => sum + s.memorizationStrength, 0);
    const averageStrength = total > 0 ? totalStrength / total : 0;
    
    // Calculate distribution by percent memorized
    const fullyMemorized = surahs.filter(s => s.percentMemorized >= 90).length;
    const mostlyMemorized = surahs.filter(s => s.percentMemorized >= 70 && s.percentMemorized < 90).length;
    const partiallyMemorized = surahs.filter(s => s.percentMemorized >= 30 && s.percentMemorized < 70).length;
    const justStarted = surahs.filter(s => s.percentMemorized < 30).length;

    return {
      total,
      excellent,
      good,
      moderate,
      beginner,
      fullyMemorized,
      mostlyMemorized,
      partiallyMemorized,
      justStarted,
      averageMemorization,
      averageStrength,
      excellentPercent: (excellent / total) * 100,
      goodPercent: (good / total) * 100,
      moderatePercent: (moderate / total) * 100,
      beginnerPercent: (beginner / total) * 100,
      fullyMemorizedPercent: (fullyMemorized / total) * 100,
      mostlyMemorizedPercent: (mostlyMemorized / total) * 100,
      partiallyMemorizedPercent: (partiallyMemorized / total) * 100,
      justStartedPercent: (justStarted / total) * 100,
    };
  }, [surahs]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Overall Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall averages */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.averageMemorization.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Average Memorization</div>
          </div>
          <div className="text-center p-4 bg-secondary/5 rounded-lg">
            <div className="text-2xl font-bold text-secondary-foreground">{stats.averageStrength.toFixed(1)}/10</div>
            <div className="text-sm text-muted-foreground">Average Strength</div>
          </div>
        </div>

        {/* Memorization Strength Distribution */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Memorization Strength Distribution</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>Excellent (9-10)</span>
                  <Badge variant="default" className="bg-green-600">
                    {stats.excellent} Surahs
                  </Badge>
                </div>
                <span className="text-sm font-medium">{stats.excellentPercent.toFixed(1)}%</span>
              </div>
              <Progress value={stats.excellentPercent} className="h-3 [&>div]:bg-green-600" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>Good (7-8)</span>
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    {stats.good} Surahs
                  </Badge>
                </div>
                <span className="text-sm font-medium">{stats.goodPercent.toFixed(1)}%</span>
              </div>
              <Progress value={stats.goodPercent} className="h-3 [&>div]:bg-blue-600" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>Moderate (4-6)</span>
                  <Badge variant="outline" className="border-orange-600 text-orange-600">
                    {stats.moderate} Surahs
                  </Badge>
                </div>
                <span className="text-sm font-medium">{stats.moderatePercent.toFixed(1)}%</span>
              </div>
              <Progress value={stats.moderatePercent} className="h-3 [&>div]:bg-orange-600" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>Beginner (1-3)</span>
                  <Badge variant="outline" className="border-gray-500 text-gray-500">
                    {stats.beginner} Surahs
                  </Badge>
                </div>
                <span className="text-sm font-medium">{stats.beginnerPercent.toFixed(1)}%</span>
              </div>
              <Progress value={stats.beginnerPercent} className="h-3 [&>div]:bg-gray-500" />
            </div>
          </div>
        </div>

        {/* Memorization Completion Distribution */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Memorization Completion</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>Fully Memorized (90%+)</span>
                  <Badge variant="default" className="bg-emerald-600">
                    {stats.fullyMemorized} Surahs
                  </Badge>
                </div>
                <span className="text-sm font-medium">{stats.fullyMemorizedPercent.toFixed(1)}%</span>
              </div>
              <Progress value={stats.fullyMemorizedPercent} className="h-3 [&>div]:bg-emerald-600" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>Mostly Memorized (70-89%)</span>
                  <Badge variant="secondary" className="bg-teal-600 text-white">
                    {stats.mostlyMemorized} Surahs
                  </Badge>
                </div>
                <span className="text-sm font-medium">{stats.mostlyMemorizedPercent.toFixed(1)}%</span>
              </div>
              <Progress value={stats.mostlyMemorizedPercent} className="h-3 [&>div]:bg-teal-600" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>Partially Memorized (30-69%)</span>
                  <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                    {stats.partiallyMemorized} Surahs
                  </Badge>
                </div>
                <span className="text-sm font-medium">{stats.partiallyMemorizedPercent.toFixed(1)}%</span>
              </div>
              <Progress value={stats.partiallyMemorizedPercent} className="h-3 [&>div]:bg-yellow-600" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>Just Started (&lt;30%)</span>
                  <Badge variant="outline" className="border-red-500 text-red-500">
                    {stats.justStarted} Surahs
                  </Badge>
                </div>
                <span className="text-sm font-medium">{stats.justStartedPercent.toFixed(1)}%</span>
              </div>
              <Progress value={stats.justStartedPercent} className="h-3 [&>div]:bg-red-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
