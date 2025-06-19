'use server';

import { auth } from '../../../lib/auth';
import { prisma } from '../../../lib/db';

export async function saveArticleAction(title: string, content: string, summary: string, translation: string, sourceUrl: string) {
  const user = await auth();
  if (!user?.id) throw new Error('未ログインです');

  const newArticle = await prisma.article.create({
    data: {
      userId: user.id,
      title,
      content,
      summary,
      translation,
      sourceUrl,
    },
  });

  return { success: true, articleId: newArticle.id };
}
