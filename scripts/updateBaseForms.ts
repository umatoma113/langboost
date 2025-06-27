// scripts/updateBaseForms.ts
import 'dotenv/config';

import { prisma } from '../lib/db';
import nlp from 'compromise';

function normalizeWord(word: string): string {
  const cleaned = word.toLowerCase().replace(/[.,!?;:()"']/g, '');
  const doc = nlp(cleaned);
  if (doc.verbs().length) return doc.verbs().toInfinitive().out('text');
  if (doc.nouns().length) return doc.nouns().toSingular().out('text');
  return doc.out('text');
}

async function main() {
  const words = await prisma.word.findMany({
  where: {
    baseForm: {
      equals: null as any,
    },
  },
});

  console.log(`🔍 null の baseForm を持つ単語数: ${words.length}`);

  for (const word of words) {
    const normalized = normalizeWord(word.word);
    await prisma.word.update({
      where: { id: word.id },
      data: { baseForm: normalized },
    });
    console.log(`✅ ${word.word} → ${normalized}`);
  }

  console.log('🎉 baseForm 一括更新完了！');
}

main().catch((e) => {
  console.error('❌ エラー:', e);
  process.exit(1);
});
