// scripts/importWordList.ts
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { prisma } from '../lib/db';

type CsvRow = {
  headword: string;
  meaning: string;
  pos?: string;
};


async function main() {
    const listType = process.argv[2];
    if (!listType) {
        throw new Error('⚠️ 第1引数にリスト名（NGSL/NAWL/TSL/BSL）が必要です');
    }

    const list = await prisma.listType.findUnique({ where: { name: listType } });
    if (!list) throw new Error(`❌ ListType "${listType}" が見つかりません`);

    const filePath = path.join(__dirname, `../data/${listType}.csv`);
    const csv = fs.readFileSync(filePath);
    const records: CsvRow[] = parse(csv, { columns: true, skip_empty_lines: true });

    for (const row of records) {
        const word = row.headword.trim().toLowerCase();
        const meaning = row.meaning.trim();
        const partOfSpeech = row.pos?.trim() || null;

        const existing = await prisma.baseWord.findUnique({ where: { word } });

        if (existing) {
            // 既存語に listType を追加
            await prisma.baseWord.update({
                where: { word },
                data: {
                    listTypes: {
                        connect: { id: list.id },
                    },
                },
            });
        } else {
            await prisma.baseWord.create({
                data: {
                    word,
                    meaning,
                    partOfSpeech,
                    listTypes: {
                        connect: { id: list.id },
                    },
                },
            });
        }
    }

    console.log(`✅ ${records.length} 語の ${listType} 語彙を登録しました`);
}

main()
    .catch((err) => {
        console.error('❌ エラー:', err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
