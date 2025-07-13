// services/user/getMyRegisteredBaseForms.ts
import { prisma } from '../../../lib/db';

export async function getMyRegisteredBaseForms(userId: string, limit?: number): Promise<string[]> {
  const words = await prisma.userWord.findMany({
    where: { userId },
    include: { word: true },
    ...(limit && { take: limit }),
  });

  return words
    .map(({ word }) => word.baseForm?.toLowerCase())
    .filter((baseForm): baseForm is string => typeof baseForm === 'string');
}
