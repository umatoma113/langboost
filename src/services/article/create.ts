// services/article/create.ts
import { prisma } from "../../../lib/db";

type CreateArticleInput = {
  userId: string;
  originalText: string;
  summary: string;
};

export async function saveArticle(data: CreateArticleInput) {
  return await prisma.article.create({
    data,
  });
}
