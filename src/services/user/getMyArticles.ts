// src/services/user/getMyArticles.ts
import { prisma } from '../../../lib/db';

export async function getMyArticles(userId: string) {
  const articles = await prisma.article.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return articles.map((article) => ({
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  }));
}
