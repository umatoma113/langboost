// src/app/actions/extractWords.ts
'use server';

import { extractWordsFromText } from "../../services/article/extractWords";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";
import { normalizeWord } from "../../../lib/normalizeWord";

const MAX_WORD_LENGTH = 255;
const MAX_MEANING_LENGTH = 1024;

export async function extractWordsAction(formData: FormData) {
  console.log("✅ extractWordsAction reached");

  const session = await auth();
  console.log("🧑 session.id:", session.id);
  if (!session?.id) throw new Error("ログインが必要です");

  const text = formData.get("text")?.toString() || "";
  if (!text.trim()) throw new Error("本文が空です");

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

    if (!word || !meaning || word.length > MAX_WORD_LENGTH || meaning.length > MAX_MEANING_LENGTH) {
      console.warn("⚠️ スキップ: 無効または長すぎる単語", { word, meaning });
      continue;
    }

    const baseForm = normalizeWord(word);

    // ✅ Wordテーブルに保存（baseForm で upsert）
    const savedWord = await prisma.word.upsert({
      where: { baseForm },
      update: {},
      create: {
        word,
        baseForm,
        meaning,
      },
    });

    // ✅ UserWordテーブルに保存（userId と wordId で upsert）
    await prisma.userWord.upsert({
      where: {
        userId_wordId: {
          userId: session.id,
          wordId: savedWord.id,
        },
      },
      update: {},
      create: {
        userId: session.id,
        wordId: savedWord.id,
        level: 1,
        nextReviewDate: new Date(),
        registeredAt: new Date(),
        lastTestedAt: new Date(),
        correctCount: 0,
        incorrectCount: 0,
        isMastered: false,
      },
    });

    words.push(savedWord);
  }

  return words;
}

