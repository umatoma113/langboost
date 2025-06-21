// services/quiz/getLeitnerReviewWords.ts
import { prisma } from '../../../lib/db';
import { startOfDay } from 'date-fns';

export async function getLeitnerReviewWords(userId: string) {
  const today = startOfDay(new Date()); // 今日の0:00
  const reviewWords = await prisma.userWord.findMany({
    where: {
      userId,
      nextReviewDate: {
        lte: today,
      },
    },
    include: {
      word: {
        include: {
          quizTemplates: true,
        },
      },
    },
  });

  return reviewWords;
}
