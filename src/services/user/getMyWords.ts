// src/services/user/getMyWords.ts
import { prisma } from '../../../lib/db';

export async function getMyWords(userId: string, limit = 10) {
  return await prisma.userWord.findMany({
    where: { userId },
    include: {
      word: true,
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });
}
