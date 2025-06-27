//src/app/actions/registerWord.ts
'use server';

import { generateQuizTemplateForWord } from "@/services/quiz/generateQuizTemplate";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";
import { startOfDay } from "date-fns";
import { normalizeWord } from "../../../lib/normalizeWord";

export async function registerWordAction(word: string, meaning: string) {
  const user = await auth();
  if (!user?.id) throw new Error("未ログイン");

  const baseForm = normalizeWord(word);

  // ✅ Word テーブルに baseForm で upsert
  const wordRecord = await prisma.word.upsert({
  where: { baseForm: baseForm }, // 明示的にプロパティ名を書く
  update: {},
  create: {
    word,
    baseForm,
    meaning,
  },
});

  // ✅ すでに登録されているか確認（UserWord）
  const already = await prisma.userWord.findFirst({
    where: {
      userId: user.id,
      wordId: wordRecord.id,
    },
  });

  if (already) return { success: true, alreadyRegistered: true };

  // ✅ UserWord 登録
  await prisma.userWord.create({
    data: {
      userId: user.id,
      wordId: wordRecord.id,
      registeredAt: new Date(),
      lastTestedAt: new Date(),
      nextReviewDate: startOfDay(new Date()),
      level: 1,
      isMastered: false,
      correctCount: 0,
      incorrectCount: 0,
    },
  });

  // ✅ クイズ生成
  await generateQuizTemplateForWord(wordRecord.id);

  return { success: true, alreadyRegistered: false };
}

