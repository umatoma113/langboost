// services/quiz/getLeitnerReviewWords.ts
import { prisma } from '../../../lib/db';
import { startOfDay } from 'date-fns';

export async function getLeitnerReviewWords(userId: string) {
  // ✅ UTC基準の昨日の開始時刻を取得
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
  });

  // ✅ ログ出力（デバッグ用）
  console.log(
    '📘 出題対象単語:',
    reviewWords.map((w: typeof reviewWords[number]) => ({
      wordId: w.wordId,
      level: w.level,
      nextReviewDate: w.nextReviewDate.toISOString(),
    }))
  );

  console.log(
    '🧪 reviewWords (debug):',
    reviewWords.map((w: typeof reviewWords[number]) => ({
      wordId: w.wordId,
      level: w.level,
      nextReviewDate: w.nextReviewDate.toISOString(),
      quizTemplates: w.word.quizTemplates.length,
    }))
  );

  return reviewWords;
}
