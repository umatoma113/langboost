// services/article/create.ts
import { prisma } from "../../../lib/db";

// Prisma の article モデルに必要な項目をすべて含める
type CreateArticleInput = {
  userId: string;
  title: string;
  content: string;
  summary: string;
  sourceUrl: string;
  translation?: string | null;
};

export async function saveArticle(data: CreateArticleInput) {
  return await prisma.article.create({
    data,
  });
}
