'use client';
import { useState } from 'react';
import Header from '@/components/header';
import HifdhTracker from '@/components/hifdh-tracker';
import ProgressSummary from '@/components/progress-summary';
import LoginCard from '@/components/login-card';
import { useAuth } from '@/contexts/AuthContext';
import { type SurahStatus } from '@/lib/quran-data';
import { useUserProgress } from '@/hooks/use-progress';
import { updateAdminProgress } from '@/lib/firestore-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const { surahs, loading: isLoadingData } = useUserProgress(user?.email || null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (id: number, status: SurahStatus) => {
    if (!user || !isAdmin) return;

    setIsSaving(true);
    try {
      // Save to Firestore (the real-time hook will update the UI automatically)
      await updateAdminProgress(id, status);
      
      const surahName = surahs.find(s => s.id === id)?.name;
      toast({
        title: "Success",
        description: `Surah ${surahName} status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isLoadingData) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 px-4 py-8 md:px-6 md:py-12">
          <div className="container mx-auto max-w-7xl flex items-center justify-center">
            <div className="flex items-center gap-2 text-lg">
              <Loader2 className="h-6 w-6 animate-spin" />
              {loading ? 'Loading...' : 'Loading your progress...'}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 px-4 py-8 md:px-6 md:py-12">
          <div className="container mx-auto max-w-7xl">
            <section className="mb-12 text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
                Admin Access Required
              </h1>
              <p className="mt-4 text-lg text-foreground/80">
                {user ? 'Unauthorized access. Admin privileges required.' : 'Please sign in with the admin account to access this page.'}
              </p>
            </section>
            <div className="flex justify-center">
              <LoginCard />
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
          <section className="mb-12">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-lg text-foreground/80">
              Update and manage your memorization progress here.
            </p>
          </section>

          <Card className="mb-8 border-blue-500/50 bg-blue-500/10 text-blue-800">
             <CardHeader className="flex flex-row items-center gap-4 space-y-0">
               <AlertCircle className="h-6 w-6 text-blue-600"/>
               <CardTitle className="text-blue-800">Live Progress Tracking</CardTitle>
             </CardHeader>
             <CardContent>
                <CardDescription className="text-blue-700">
                  Your progress is automatically saved to the cloud. Changes are synced across all devices and will be visible on the public tracker.
                  {isSaving && (
                    <span className="flex items-center gap-2 mt-2 text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving changes...
                    </span>
                  )}
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
