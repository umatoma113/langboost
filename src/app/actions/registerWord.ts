//src/app/actions/registerWord.ts
'use server';

import { generateQuizTemplateForWord } from "@/services/quiz/generateQuizTemplate";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";

export async function registerWordAction(word: string, meaning: string) {
  const user = await auth();
  if (!user?.id) throw new Error("未ログイン");

  const wordRecord = await prisma.word.upsert({
    where: {
      userId_word: {
        userId: user.id,
        word,
      },
    },
    update: {},
    create: {
      userId: user.id,
      word,
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
      correctCount: 0,
      incorrectCount: 0,
    },
  });

  await generateQuizTemplateForWord(wordRecord.id);

  return { success: true, alreadyRegistered: false };
}
