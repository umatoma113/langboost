// scripts/generateNgslWords.ts
import { PrismaClient } from '@/app/generated/prisma';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const outputPath = path.join(__dirname, '../lib/ngslWords.ts');

async function generateNgslWords() {
  const words = await prisma.baseWord.findMany({
    where: {
      isFunctionWord: false, // 機能語は除外
    },
    select: {
      word: true,
    },
  });

  const wordSet = new Set(words.map(w => `"${w.word}"`));
  const content = `// ✅ 自動生成ファイル（NGSL）\nexport const ngslWords = new Set([\n  ${[...wordSet].join(',\n  ')}\n]);\n`;

  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`✅ ${wordSet.size} 語を ngslWords.ts に書き出しました`);
  await prisma.$disconnect();
}

generateNgslWords();
