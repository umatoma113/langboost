//src/services/user/getMyRegisteredWordIds.ts
import { prisma } from '../../../lib/db';

export async function getMyRegisteredWordIds(userId: string): Promise<number[]> {
  const userWords = await prisma.userWord.findMany({
    where: { userId },
    select: { wordId: true },
  });
  return userWords.map(w => w.wordId);
}
