// src/app/actions/deleteArticleAction.ts
'use server';

import { prisma } from '../../../lib/db';
import { auth } from '../../../lib/auth';

export async function deleteArticleAction(articleId: number) {
  const session = await auth();
  if (!session?.id) throw new Error('ログインが必要です');

  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article || article.userId !== session.id) {
    throw new Error('削除権限がありません');
  }

  await prisma.$transaction(async (tx) => {
    // ✅ 1. 単語帳に登録されていない Word だけ削除
    const articleWords = await tx.word.findMany({
      where: { articleId },
      include: { userWords: true },
    });

    const deletableWordIds = articleWords
      .filter((w) => w.userWords.length === 0)
      .map((w) => w.id);

    if (deletableWordIds.length > 0) {
      await tx.word.deleteMany({
        where: { id: { in: deletableWordIds } },
      });
    }

    // ✅ 2. Article を削除すれば Sentence / ArticleQuiz は cascade で自動削除される
    await tx.article.delete({
      where: { id: articleId },
    });
  });
}
