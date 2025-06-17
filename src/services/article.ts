//src/services/article.ts
import { prisma } from '../../lib/db';

export type ArticleWithWords = {
  id: number;
  title: string;
  summary: string;
  translation: string;
  words: {
    word: string;
    meaning: string;
  }[];
};

export async function getArticleById(id: number): Promise<ArticleWithWords | null> {
  return prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      summary: true,
      translation: true,
      words: {
        select: {
          word: true,
          meaning: true,
        },
      },
    },
  });
}
