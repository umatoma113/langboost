// services/article/find.ts
import { prisma } from "../../../lib/db";
import type { Article, Word } from "../../app/generated/prisma";

type SentencePair = {
  english: string;
  japanese: string;
};

export async function getArticlesByUser(userId: string, limit: number = 10) {
  return await prisma.article.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getArticleById(id: number): Promise<(Article & {
  words: Word[];
  sentencePairs: SentencePair[];
}) | null> {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      words: true,
    },
  });

  if (!article) return null;

  const englishSentences = article.content.split(/(?<=[.?!])\s+/);
  const japaneseSentences = (article.translation ?? "").split(/(?<=[。！？])\s*/);
  const sentencePairs: SentencePair[] = englishSentences.map((english, i) => ({
    english,
    japanese: japaneseSentences[i] ?? "",
  }));

  return {
    ...article,
    sentencePairs,
  };
}

