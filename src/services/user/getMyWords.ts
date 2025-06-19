import { prisma } from '../../../lib/db';

export async function getMyWords(userId: string) {
  return await prisma.userWord.findMany({
    where: { userId },
    include: {
      word: true,
    },
    orderBy: { updatedAt: 'desc' },
  });
}
