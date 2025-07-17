'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getStudyTips, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Loader2, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Get Personalized Tips
        </>
      )}
    </Button>
  );
}

export default function StudyTipsGenerator() {
  const [state, formAction] = useFormState(getStudyTips, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message === 'success') {
      formRef.current?.reset();
    }
    if (state.message !== '' && state.message !== 'success' && !state.errors) {
       toast({
        title: "An error occurred",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <Card className="mx-auto max-w-3xl shadow-lg">
      <CardHeader className="text-center">
         <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <BrainCircuit className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl">Feeling Stuck?</CardTitle>
        <CardDescription className="text-lg">
          Describe your current memorization progress or any challenges you're facing, and our AI expert will provide personalized tips to help you.
        </CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent>
          <Textarea
            name="history"
            placeholder="e.g., 'I'm struggling to differentiate between similar verses in Surah Al-Baqarah...' or 'I have memorized the first 5 Juz but find it hard to retain them.'"
            rows={5}
            required
            className="bg-background"
          />
           {state?.errors?.history && (
            <p className="mt-2 text-sm text-red-500">{state.errors.history[0]}</p>
          )}
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4 sm:flex-row sm:justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
      {state.tips && (
        <div className="border-t p-6">
          <h3 className="font-headline mb-4 text-xl font-bold text-primary">Your Personalized Study Plan:</h3>
          <div className="prose prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground/90 max-w-none rounded-md border bg-primary/5 p-4 text-foreground">
             {state.tips.split('\n').map((line, index) => {
                if(line.trim().startsWith('*') || line.trim().startsWith('-')) {
                    return <p key={index} className="ml-4 list-item list-disc">{line.substring(1).trim()}</p>
                }
                 return <p key={index}>{line}</p>
             })}
          </div>
        </div>
      )}
    </Card>
  );
}
