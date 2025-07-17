// src/app/actions.ts
'use server';

import { generateStudyTips } from '@/ai/flows/generate-study-tips';
import { z } from 'zod';

const schema = z.object({
  history: z.string().min(10, { message: 'Please describe your progress or challenges in more detail (at least 10 characters).' }),
});

export type FormState = {
  message: string;
  tips?: string;
  errors?: {
    history?: string[];
  }
}

export async function getStudyTips(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = schema.safeParse({
    history: formData.get('history'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateStudyTips({ memorizationHistory: validatedFields.data.history });
    return {
      message: 'success',
      tips: result.studyTips,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred while generating tips. Please try again.',
    };
  }
}
