// services/quiz/saveResult.ts
import { prisma } from '../../../lib/db';
import { updateLeitnerLevel } from './updateLeitnerLevel';

type SaveResultParams = {
  userId: string;
  wordId: number;
  quizTemplateId: number;
  selectedChoice: number; // 1〜4
  isCorrect: boolean;
};

export async function saveQuizResult(params: SaveResultParams) {
  const { userId, wordId, quizTemplateId, selectedChoice, isCorrect } = params;

  // 1. 回答履歴を保存
  await prisma.quizHistory.create({
    data: {
      userId,
      wordId,
      quizTemplateId,
      selectedChoice,
      isCorrect,
      answeredAt: new Date(),
    },
  });

  // 2. Leitnerレベル更新
  await updateLeitnerLevel(userId, wordId, isCorrect);
}
