// services/quiz/getLeitnerReviewWords.ts
import { prisma } from '../../../lib/db';
import { startOfDay } from 'date-fns';

export async function getLeitnerReviewWords(userId: string, limit = 20) {
  // ✅ UTC基準の今日の開始時刻を取得
  const today = startOfDay(new Date());

  const reviewWords = await prisma.userWord.findMany({
    where: {
      userId,
      nextReviewDate: {
        lte: today,
      },
      level: {
        lte: 7,
      },
      isMastered: false,
    },
    include: {
      word: {
        include: {
          quizTemplates: true,
        },
      },
    },
    orderBy: { nextReviewDate: 'asc' },
    take: limit,
  });

  console.log(
    '📘 出題対象単語:',
    reviewWords.map((w) => ({
      wordId: w.wordId,
      level: w.level,
      nextReviewDate: w.nextReviewDate.toISOString(),
    }))
  );

  console.log(
    '🧪 reviewWords (debug):',
    reviewWords.map((w) => ({
      wordId: w.wordId,
      level: w.level,
      nextReviewDate: w.nextReviewDate.toISOString(),
      quizTemplates: w.word.quizTemplates.length,
    }))
  );

  return reviewWords;
}
