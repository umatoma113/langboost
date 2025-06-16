// src/app/actions/extractWords.ts
'use server';

import { extractWordsFromText } from "../../services/article/extractWords";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";

const MAX_WORD_LENGTH = 255;
const MAX_MEANING_LENGTH = 1024; // UI表示やOpenAI返答を考慮し少し長めでもOK

export async function extractWordsAction(formData: FormData) {
  console.log("✅ extractWordsAction reached");

  const session = await auth();
  console.log("🧑 session.id:", session.id); 
  if (!session?.id) {
    throw new Error("ログインが必要です");
  }

  const text = formData.get("text")?.toString() || "";

  if (!text.trim()) {
    throw new Error("本文が空です");
  }

  const rawWords = await extractWordsFromText(text) as { word: string; meaning: string }[];

  console.log("🧪 rawWords:", rawWords);

  const words = [];

  for (const entry of rawWords) {
    const word = entry.word?.toString() ?? "";
    const meaning = entry.meaning?.toString() ?? "";

    console.log("📌 word:", word);
    console.log("📌 meaning:", meaning);
    console.log("📏 word.length:", word.length);
    console.log("📏 meaning.length:", meaning.length);

    if (
      !word ||
      !meaning ||
      word.length > MAX_WORD_LENGTH ||
      meaning.length > MAX_MEANING_LENGTH
    ) {
      console.warn("⚠️ スキップ: 無効または長すぎる単語", { word, meaning });
      continue; // 無効または長すぎるものは保存しない
    }

    const saved = await prisma.word.upsert({
      where: {
        userId_word: {
          userId: session.id,
          word,
        },
      },
      update: {}, // すでにある場合はそのまま
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
