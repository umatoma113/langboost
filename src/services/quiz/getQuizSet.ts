// services/quiz/getQuizSet.ts
import { prisma } from '../../../lib/db';
import { getLeitnerReviewWords } from './getLeitnerReviewWords';
import { generateQuizTemplateForWord } from './generateQuizTemplate';

export type QuizTemplate = Awaited<ReturnType<typeof prisma.quizTemplate.findFirst>>;

export async function getQuizSet(userId: string): Promise<QuizTemplate[]> {
  const userWords = await getLeitnerReviewWords(userId);
  const quizzes: QuizTemplate[] = [];

  for (const userWord of userWords) {
    const existing = userWord.word.quizTemplates.find(
      (q: QuizTemplate) => q.quizType === 'meaning'
    );

    if (existing) {
      quizzes.push(existing);
    } else {
      const generated = await generateQuizTemplateForWord(userWord.wordId);
      quizzes.push(generated);
    }
  }

  return quizzes;
}