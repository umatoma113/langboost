//src/app/actions/startQuiz.ts
'use server';

import { auth } from '../../../lib/auth';
import { getQuizSet } from '@/services/quiz/getQuizSet';

export async function startQuizAction() {
  const user = await auth();
  if (!user) throw new Error('認証が必要です');

  const quizTemplates = await getQuizSet(user.id);
  return quizTemplates;
}
