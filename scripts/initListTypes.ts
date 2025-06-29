// scripts/initListTypes.ts
import 'dotenv/config'; 

import { prisma } from '../lib/db';

async function main() {
  const listTypes = ['NGSL', 'NAWL', 'TSL', 'BSL'];

  await prisma.listType.createMany({
    data: listTypes.map((name) => ({ name })),
    skipDuplicates: true,
  });

  console.log('✅ ListType テーブルに語彙リストを登録しました：', listTypes.join(', '));
}

main()
  .catch((e) => {
    console.error('❌ ListType の初期化中にエラー:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
