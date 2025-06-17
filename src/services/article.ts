// src/services/article.ts
import { prisma } from '../../lib/db';

export type ArticleWithWords = {
  id: number;
  title: string;
  summary: string;
  translation: string | null;
  words: {
    word: string;
    meaning: string;
  }[];
};

export async function getArticleById(id: number): Promise<ArticleWithWords | null> {
  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      summary: true,
      translation: true,
      userId: true,
    },
  });

  if (!article) return null;

  const words = await prisma.word.findMany({
    where: { userId: article.userId },
    select: {
      word: true,
      meaning: true,
    },
  });

  return {
    id: article.id,
    title: article.title,
    summary: article.summary,
    translation: article.translation,
    words,
  };
}
