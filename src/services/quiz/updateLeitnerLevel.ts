// services/quiz/updateLeitnerLevel.ts
import { prisma } from '../../../lib/db';
import { startOfDay, addDays } from 'date-fns';

const intervals = {
  1: 0,
  2: 1,
  3: 3,
  4: 7,
  5: 14,
  6: 30,
  7: 180,
} as const;

export async function updateLeitnerLevel(
  userId: string,
  wordId: number,
  isCorrect: boolean
) {
  const userWord = await prisma.userWord.findUnique({
    where: {
      userId_wordId: {
        userId,
        wordId,
      },
    },
  });

  if (!userWord) throw new Error('UserWord が見つかりません');

  let newLevel = userWord.level;

  if (isCorrect) {
    newLevel = Math.min(newLevel + 1, 7);
  } else {
    newLevel = 1;
  }

  const today = startOfDay(new Date());

  const nextReviewDate = addDays(today, intervals[newLevel as keyof typeof intervals]);

  const isNowMastered = isCorrect && newLevel === 7;

  await prisma.userWord.update({
    where: {
      userId_wordId: {
        userId,
        wordId,
      },
    },
    data: {
      level: newLevel,
      nextReviewDate,
      isMastered: isNowMastered,
    },
  });
}