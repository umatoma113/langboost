//scripts/importBaseWords.ts
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

const CSV_FILE_PATH = path.join(__dirname, '../data/基礎英単語（NGSL）.csv');

async function importBaseWords() {
  const records: {
    word: string;
    meaning: string;
    partOfSpeech: string;
    isFunctionWord: boolean;
  }[] = [];

  fs.createReadStream(CSV_FILE_PATH)
    .pipe(csv())
    .on('data', (row) => {
      const word = row.entry?.trim().toLowerCase();     // ✅ 修正
      const meaning = row.meaning?.trim();              // ✅ OK
      const pos = row.pos?.toLowerCase();               // ✅ OK（空でもいい）

      if (!word || !meaning) return;

      const isFunctionWord = ['pron', 'prep', 'conj', 'det', 'modal', 'aux', 'be'].some(tag =>
        pos?.includes(tag)
      );

      records.push({
        word,
        meaning,
        partOfSpeech: pos || '',
        isFunctionWord,
      });
    })
    .on('end', async () => {
      console.log(`📦 インポート対象語数: ${records.length}`);

      for (let i = 0; i < records.length; i += 100) {
        const chunk = records.slice(i, i + 100);
        try {
          await prisma.baseWord.createMany({
            data: chunk,
            skipDuplicates: true,
          });
        } catch (error) {
          console.error(`❌ Error at chunk ${i}:`, error);
        }
      }

      console.log('✅ BaseWord テーブルへのインポート完了');
      await prisma.$disconnect();
    });
}

importBaseWords();
