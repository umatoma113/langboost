// services/quiz/updateLeitnerLevel.ts
import { prisma } from '../../../lib/db';
import { addDays } from 'date-fns';

const intervals = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
  6: 180, 
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
    if (newLevel < 6) {
      newLevel += 1;
    } else if (newLevel === 6) {
      newLevel = 7; 
    }
  } else {
    newLevel = 1;
  }

  const nextReviewDate =
    newLevel <= 6
      ? addDays(new Date(), intervals[newLevel as keyof typeof intervals])
      : new Date('2999-12-31'); 

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
    },
  });
}
