import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/db';

function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')         // バックスラッシュをエスケープ
    .replace(/"/g, '\\"')           // ダブルクォートをエスケープ
    .replace(/\n/g, '\\n')          // 改行文字
    .replace(/\r/g, '\\r');         // 改行文字（CR）
}

async function main() {
  const words = await prisma.baseWord.findMany({
    include: { listTypes: true },
  });

  const entries = words.map((w) => {
    const listType = w.listTypes.map((l) => l.name).join(',');
    const escapedMeaning = escapeString(w.meaning);
    return `  ["${w.word}", { meaning: "${escapedMeaning}", listType: "${listType}" }]`;
  });

  const mapContent = `export const wordMap = new Map<string, { meaning: string; listType: string }>([\n${entries.join(',\n')}\n]);\n`;

  const filePath = path.join(__dirname, '../lib/wordMap.ts');
  fs.writeFileSync(filePath, mapContent);

  console.log(`✅ wordMap.ts に ${words.length} 語を書き出しました`);
}

main()
  .catch((err) => {
    console.error('❌ エラー:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
