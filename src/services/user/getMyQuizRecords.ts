// src/services/user/getMyQuizRecords.ts
import { prisma } from '../../../lib/db';

export async function getMyQuizRecords(userId: string, limit = 5) {
  const records = await prisma.quizHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      quizTemplate: {
        include: { word: true }, 
      },
    },
  });

  return records.map((record) => ({
    ...record,
    executedAt: record.executedAt.toISOString(),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    quizTemplate: {
      ...record.quizTemplate,
      createdAt: record.quizTemplate.createdAt.toISOString(),
      updatedAt: record.quizTemplate.updatedAt.toISOString(),
      word: {
        ...record.quizTemplate.word,
        createdAt: record.quizTemplate.word.createdAt.toISOString(),
        updatedAt: record.quizTemplate.word.updatedAt.toISOString(),
      },
    },
  }));
}
