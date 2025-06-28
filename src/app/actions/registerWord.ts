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

  // ✅ 意味が未登録なら処理しない
  if (!word || !meaning || meaning === '意味未登録') {
    console.warn('❌ 無効な単語登録要求:', { word, meaning });
    return { success: false, message: '意味未登録の単語は登録できません' };
  }

  const wordRecord = await prisma.word.upsert({
    where: { baseForm },
    update: {},
    create: {
      word,
      baseForm,
      meaning,
    },
  });

  const already = await prisma.userWord.findFirst({
    where: {
      userId: user.id,
      wordId: wordRecord.id,
    },
  });

  if (already) return { success: true, alreadyRegistered: true };

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

  await generateQuizTemplateForWord(wordRecord.id);

  return { success: true, alreadyRegistered: false };
}


