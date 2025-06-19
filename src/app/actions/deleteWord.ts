'use server';

import { auth } from '../../../lib/auth';
import { prisma } from '../../../lib/db';

export async function deleteWordAction(wordId: number) {
  const user = await auth();
  if (!user?.id) throw new Error('未ログイン');

  // UserWord の削除（Word自体は消さない）
  await prisma.userWord.deleteMany({
    where: {
      userId: user.id,
      wordId: wordId,
    },
  });

  return { success: true };
}
