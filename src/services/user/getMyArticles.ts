import { prisma } from '../../../lib/db';

export async function getMyArticles(userId: string) {
  return await prisma.article.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}
