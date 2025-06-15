'use server';

import { extractWordsFromText } from "../../services/article/extractWords";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";

export async function extractWordsAction(formData: FormData) {
  console.log("✅ extractWordsAction reached");
  const session = await auth();
  if (!session?.id) {
    throw new Error("ログインが必要です");
  }

  const text = formData.get("text")?.toString() || "";

  if (!text.trim()) {
    throw new Error("本文が空です");
  }

  const rawWords = await extractWordsFromText(text) as Record<string, string | { meaning: string }>;

  const entries = Object.entries(rawWords); // 型付きなのでエラー消える

  const words = [];

  for (const [word, data] of entries) {
    const meaning = typeof data === "string" ? data : data.meaning;

    const saved = await prisma.word.upsert({
      where: {
        userId_word: {
          userId: session.id,
          word,
        },
      },
      update: {},
      create: {
        word,
        meaning,
        userId: session.id,
      },
    });

    words.push(saved);
  }

  return words;
}
