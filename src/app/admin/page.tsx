'use client';
import { useState } from 'react';
import Header from '@/components/header';
import HifdhTracker from '@/components/hifdh-tracker';
import ProgressSummary from '@/components/progress-summary';
import { quranData, type Surah, type SurahStatus } from '@/lib/quran-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function AdminPage() {
  const [surahs, setSurahs] = useState<Surah[]>(quranData);

  const handleStatusChange = (id: number, status: SurahStatus) => {
    setSurahs(currentSurahs =>
      currentSurahs.map(surah =>
        surah.id === id ? { ...surah, status } : surah
      )
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="container mx-auto max-w-7xl">
          <section className="mb-12">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-lg text-foreground/80">
              Update and manage your memorization progress here.
            </p>
          </section>

          <Card className="mb-8 border-yellow-500/50 bg-yellow-500/10 text-yellow-800">
             <CardHeader className="flex flex-row items-center gap-4 space-y-0">
               <AlertCircle className="h-6 w-6 text-yellow-600"/>
               <CardTitle className="text-yellow-800">Developer Note</CardTitle>
             </CardHeader>
             <CardContent>
                <CardDescription className="text-yellow-700">
                  This is a demonstration of the admin interface. Status changes are interactive but will not be saved. A full implementation would require a database connection.
                </CardDescription>
             </CardContent>
          </Card>

          <section id="progress" className="mb-12">
            <h2 className="font-headline mb-6 text-2xl font-bold text-primary">
              Live Progress
            </h2>
            <ProgressSummary surahs={surahs} />
            <div className="mt-8">
              <HifdhTracker surahs={surahs} isEditable={true} onStatusChange={handleStatusChange} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
