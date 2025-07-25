'use client';
import Header from '@/components/header';
import HifdhTracker from '@/components/hifdh-tracker';
import ProgressSummary from '@/components/progress-summary';
import StudyTipsGenerator from '@/components/study-tips-generator';
import { useAdminProgress } from '@/hooks/use-progress';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { surahs, loading, error } = useAdminProgress();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 px-4 py-8 md:px-6 md:py-12">
          <div className="container mx-auto max-w-7xl flex items-center justify-center">
            <div className="flex items-center gap-2 text-lg">
              <Loader2 className="h-6 w-6 animate-spin" />
              Loading progress...
            </div>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="container mx-auto max-w-7xl">
          <section className="mb-12 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl">
              My Hifdh Journey
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80 md:text-xl">
              Following the path of light, one verse at a time. Welcome to my public journal of Quran memorization.
            </p>
          </section>

          <section id="progress" className="mb-12">
            <h2 className="font-headline mb-6 text-center text-3xl font-bold text-primary">
              Progress At a Glance
            </h2>
            <ProgressSummary surahs={surahs} />
            <div className="mt-8">
              <HifdhTracker surahs={surahs} isEditable={false} />
            </div>
          </section>

          <section id="ai-tips">
             <h2 className="font-headline mb-6 text-center text-3xl font-bold text-primary">
              AI-Powered Study Tips
            </h2>
            <StudyTipsGenerator />
          </section>
        </div>
      </main>
      <footer className="bg-primary/10 py-6 text-center text-sm text-foreground/60">
        <p>Hifdh Tracker &copy; {new Date().getFullYear()}. Built with love and dedication.</p>
      </footer>
    </div>
  );
}
