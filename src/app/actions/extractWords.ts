// src/app/actions/extractWords.ts
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

  // ✅ 型修正：配列として扱う
  const rawWords = await extractWordsFromText(text) as { word: string; meaning: string }[];

  console.log("🧪 rawWords:", rawWords);

  const words = [];

  // ✅ entriesではなくfor...ofで正しくループ
  for (const { word, meaning } of rawWords) {
    console.log("📌 word:", word);
    console.log("📌 meaning:", meaning);
    console.log("📏 word.length:", word.length);
    console.log("📏 meaning.length:", meaning.length);

    // 任意：255文字以上の警告ログ
    if (word.length > 255 || meaning.length > 255) {
      console.warn("⚠️ 長すぎる単語または意味を検出:", { word, meaning });
    }

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
