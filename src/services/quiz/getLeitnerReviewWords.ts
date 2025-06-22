// services/quiz/getLeitnerReviewWords.ts
import { prisma } from '../../../lib/db';
import { startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export async function getLeitnerReviewWords(userId: string) {
  const now = new Date();
  const jstDate = toZonedTime(now, 'Asia/Tokyo');
  const today = startOfDay(jstDate);

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

  console.log(
    '📘 出題対象単語:',
    reviewWords.map((w: typeof reviewWords[number]) => ({
      wordId: w.wordId,
      level: w.level,
      nextReviewDate: w.nextReviewDate.toISOString(),
    }))
  );

  console.log('🧪 userId:', userId);
  console.log('🧪 today:', today.toISOString());
  console.log('🧪 reviewWords:', reviewWords.map((w: typeof reviewWords[number]) => ({
    wordId: w.wordId,
    level: w.level,
    nextReviewDate: w.nextReviewDate.toISOString(),
    quizTemplates: w.word.quizTemplates.length,
  })));

  return reviewWords;
}
