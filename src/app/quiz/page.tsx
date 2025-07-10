// app/quiz/page.tsx
import { auth } from '../../../lib/auth';
import { getQuizSet } from '@/services/quiz/getQuizSet';
import QuizClient from './QuizClient';

export const dynamic = 'force-dynamic';

export default async function QuizPage() {
  const user = await auth();
  if (!user) throw new Error('ログインが必要です');

  const quizzes = await getQuizSet(user.id); // クイズをサーバーで取得

  return <QuizClient initialQuizzes={quizzes} />;
}
