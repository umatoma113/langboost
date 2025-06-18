//src/app/actions/registerWord.ts
'use server';

import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";

export async function registerWordAction(word: string, meaning: string) {
  const user = await auth();
  if (!user?.id) throw new Error("未ログイン");

  const existing = await prisma.word.findUnique({
    where: {
      userId_word: {
        userId: user.id,
        word,
      },
    },
  });

  if (existing) return { alreadyRegistered: true };

  await prisma.word.create({
    data: {
      userId: user.id,
      word,
      meaning,
    },
  });

  return { success: true };
}
