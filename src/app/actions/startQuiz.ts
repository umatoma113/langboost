'use server';

import { auth } from '../../../lib/auth';
import { getQuizSet } from '@/services/quiz/getQuizSet';

export async function startQuizAction() {
  const user = await auth();
  if (!user) throw new Error('認証が必要です');

  // すでに生成されたクイズのみ取得
  const quizTemplates = await getQuizSet(user.id);
  return quizTemplates;
}
