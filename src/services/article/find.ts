// services/article/find.ts
import { prisma } from "../../../lib/db";

export async function getArticlesByUser(userId: string) {
  return await prisma.article.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getArticleById(id: number) {
  return await prisma.article.findUnique({
    where: { id },
  });
}
