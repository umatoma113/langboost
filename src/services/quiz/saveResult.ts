// services/quiz/saveResult.ts
import { prisma } from '../../../lib/db';
import { updateLeitnerLevel } from './updateLeitnerLevel';

type SaveResultParams = {
  userId: string;
  wordId: number;
  quizTemplateId: number;
  selectedChoice: number; // 1〜4
  isCorrect: boolean;
  executedAt: Date;
};

export async function saveQuizResult({
  userId,
  wordId,
  quizTemplateId,
  selectedChoice,
  isCorrect,
  executedAt,
}: SaveResultParams) {
  // 1. 回答履歴を保存（共通のexecutedAtで）
  await prisma.quizHistory.create({
    data: {
      userId,
      wordId,
      quizTemplateId,
      userAnswer: selectedChoice,
      isCorrect,
      executedAt,
    },
  });

  // 2. Leitnerレベル更新
  await updateLeitnerLevel(userId, wordId, isCorrect);
}
