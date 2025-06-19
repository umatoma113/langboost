import { prisma } from '../../../lib/db';

export async function getMyQuizRecords(userId: string) {
  return await prisma.quizHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      quizTemplate: {
        include: { word: true }, 
      },
    },
  });
}
